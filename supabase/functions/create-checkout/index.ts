// ═══════════════════════════════════════════════════════════════════
//  Création d'un paiement Chariow pour le joueur connecté
//  Doc : https://chariow.dev/en/guides/checkout  (POST https://api.chariow.com/v1/checkout)
//
//  Le joueur est identifié par son JWT Supabase. Son id est transmis à Chariow dans
//  `custom_metadata`, que le webhook relit : le pack arrive sur le bon compte même si
//  le joueur paie avec un autre email.
//
//  Déploiement :
//    supabase functions deploy create-checkout
//    supabase secrets set CHARIOW_API_KEY=sk_xxx APP_URL=https://ton-domaine.com \
//      CHARIOW_PRODUCT_AGRI=prd_xxx CHARIOW_PRODUCT_UNLIMITED=prd_yyy CHARIOW_PRODUCT_RESOURCES=prd_zzz
// ═══════════════════════════════════════════════════════════════════
import { createClient } from 'npm:@supabase/supabase-js@2';
import { PACK_PRODUCTS, allowedOrigin, corsHeadersFor, isPackId, json } from '../_shared/chariow.ts';

const API_KEY = Deno.env.get('CHARIOW_API_KEY') ?? '';
const APP_URL = (Deno.env.get('APP_URL') ?? '').replace(/\/$/, '');

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = corsHeadersFor(origin);
  // Retour après paiement sur l'adresse d'où vient le joueur (kaziboss.com, www, vercel.app…).
  const returnBase = allowedOrigin(origin) ?? APP_URL;
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method' }, 405, corsHeaders);
  if (!API_KEY) return json({ error: 'Paiement non configuré (CHARIOW_API_KEY).' }, 500, corsHeaders);

  // Joueur connecté (le JWT est vérifié par Supabase avant d'arriver ici).
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    auth: { persistSession: false },
  });
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user?.email) return json({ error: 'Connecte-toi pour acheter un pack.' }, 401, corsHeaders);

  const { pack, buyer } = await req.json().catch(() => ({ pack: null, buyer: null }));
  if (!isPackId(pack)) return json({ error: 'Pack inconnu.' }, 400, corsHeaders);

  // Champs exigés par Chariow : first_name, last_name, phone { number, country_code }.
  const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const firstName = clean(buyer?.firstName, 60);
  const lastName = clean(buyer?.lastName, 60);
  const phone = clean(buyer?.phone, 20).replace(/\D/g, '');
  const country = clean(buyer?.country, 2).toUpperCase();
  if (!firstName || !lastName || phone.length < 6 || !/^[A-Z]{2}$/.test(country)) {
    return json({ error: 'Prénom, nom et téléphone sont nécessaires pour le paiement.' }, 400, corsHeaders);
  }
  const productId = PACK_PRODUCTS[pack];
  if (!productId) return json({ error: 'Produit Chariow non configuré pour ce pack.' }, 500, corsHeaders);

  const res = await fetch('https://api.chariow.com/v1/checkout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      phone: { number: phone, country_code: country },
      custom_metadata: { kaziboss_user_id: user.id, pack },
      redirect_url: returnBase ? `${returnBase}/?tab=profile&purchase=${pack}` : undefined,
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    console.error('Chariow checkout', res.status, body);
    return json({ error: 'Le service de paiement ne répond pas. Réessaie dans un instant.' }, 502, corsHeaders);
  }

  const step = body?.data?.step as string | undefined;
  const url = body?.data?.payment?.checkout_url as string | undefined;
  return json({ step, url: url ?? null }, 200, corsHeaders);
});
