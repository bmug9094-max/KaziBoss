// ═══════════════════════════════════════════════════════════════════
//  Webhook Chariow (« Pulse ») → déblocage des packs KaziBoss
//  Doc : https://chariow.dev/en/guides/pulses · https://chariow.dev/en/guides/pulse-security
//
//  Déploiement :
//    supabase functions deploy chariow-webhook --no-verify-jwt
//    supabase secrets set CHARIOW_PULSE_SECRET=whsec_xxx
//  Puis, dans Chariow › Automations › Pulses : URL
//    https://<projet>.supabase.co/functions/v1/chariow-webhook   (événement successful.sale)
// ═══════════════════════════════════════════════════════════════════
import { createClient } from 'npm:@supabase/supabase-js@2';
import { isPackId, json, packForProduct } from '../_shared/chariow.ts';

const SECRET = Deno.env.get('CHARIOW_PULSE_SECRET') ?? '';
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

const encoder = new TextEncoder();

/** HMAC-SHA256 du corps brut, en hexadécimal minuscule, préfixé « sha256= ». */
async function sign(raw: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, raw));
  return 'sha256=' + Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

interface SalePayload {
  event?: string;
  sale?: { id?: string; status?: string; amount?: { value?: number; currency?: string }; custom_metadata?: Record<string, string> | null };
  product?: { id?: string };
  customer?: { email?: string };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  if (!SECRET) {
    console.error('CHARIOW_PULSE_SECRET manquant');
    return json({ error: 'config' }, 500); // 5xx → Chariow réessaiera une fois la config corrigée
  }

  // La signature porte sur les octets EXACTS reçus : ne jamais re-sérialiser le JSON.
  const raw = new Uint8Array(await req.arrayBuffer());
  const received = req.headers.get('x-chariow-signature') ?? '';
  if (!safeEqual(received, await sign(raw))) return json({ error: 'signature' }, 401);

  const deliveryId = req.headers.get('x-pulse-delivery-id');
  const event = req.headers.get('x-pulse-event');
  let payload: SalePayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return json({ error: 'json' }, 400);
  }

  if ((event ?? payload.event) !== 'successful.sale') return json({ ignored: event ?? payload.event });
  if (!deliveryId) return json({ error: 'delivery id' }, 400);

  const meta = payload.sale?.custom_metadata ?? {};
  const pack = packForProduct(payload.product?.id) ?? (isPackId(meta.pack) ? meta.pack : null);
  if (!pack) {
    // Produit Chariow sans rapport avec un pack : on accuse réception pour éviter les relances.
    console.warn('Produit non associé à un pack', payload.product?.id);
    return json({ ignored: 'product' });
  }

  const email = payload.customer?.email?.trim().toLowerCase() ?? null;

  // 1. Joueur identifié par la métadonnée posée par create-checkout (le plus fiable)…
  let userId: string | null = null;
  const metaUser = meta.kaziboss_user_id;
  if (metaUser && /^[0-9a-f-]{36}$/i.test(metaUser)) {
    const { data } = await admin.from('profiles').select('id').eq('id', metaUser).maybeSingle();
    userId = data?.id ?? null;
  }
  // 2. …sinon par l'email du paiement (compte existant et confirmé).
  if (!userId && email) {
    const { data } = await admin.rpc('find_confirmed_user_by_email', { p_email: email });
    userId = (data as string | null) ?? null;
  }

  // Idempotence : la même livraison (retry) n'est enregistrée qu'une fois.
  const { data: inserted, error: insertError } = await admin
    .from('purchases')
    .insert({
      delivery_id: deliveryId,
      sale_id: payload.sale?.id ?? null,
      user_id: userId,
      email,
      pack,
      product_id: payload.product?.id ?? null,
      amount: payload.sale?.amount?.value ?? null,
      currency: payload.sale?.amount?.currency ?? null,
      status: userId ? 'granted' : 'pending',
      granted_at: userId ? new Date().toISOString() : null,
      raw: payload,
    })
    .select('id')
    .maybeSingle();

  if (insertError) {
    if (insertError.code === '23505') return json({ duplicate: true }); // déjà traitée
    console.error('insert purchase', insertError);
    return json({ error: 'db' }, 500);
  }

  if (userId) {
    const { error } = await admin.rpc('grant_pack_to_user', { p_user: userId, p_pack: pack });
    if (error) {
      console.error('grant', error);
      // On annule l'enregistrement pour que le retry de Chariow puisse réessayer proprement.
      await admin.from('purchases').delete().eq('id', inserted!.id);
      return json({ error: 'grant' }, 500);
    }
  }

  return json({ ok: true, pack, status: userId ? 'granted' : 'pending' });
});
