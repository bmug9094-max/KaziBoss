// Configuration partagée par les Edge Functions Chariow.
// Les identifiants de produits Chariow se règlent en secrets Supabase :
//   supabase secrets set CHARIOW_PRODUCT_AGRI=prd_xxx CHARIOW_PRODUCT_UNLIMITED=prd_yyy CHARIOW_PRODUCT_RESOURCES=prd_zzz

export type PackId = 'agri_import' | 'unlimited_lives' | 'digital_growth';

export const PACK_PRODUCTS: Record<PackId, string | undefined> = {
  agri_import: Deno.env.get('CHARIOW_PRODUCT_AGRI'),
  unlimited_lives: Deno.env.get('CHARIOW_PRODUCT_UNLIMITED'),
  digital_growth: Deno.env.get('CHARIOW_PRODUCT_RESOURCES'),
};

export function packForProduct(productId: string | undefined | null): PackId | null {
  if (!productId) return null;
  const hit = (Object.entries(PACK_PRODUCTS) as [PackId, string | undefined][]).find(([, id]) => id === productId);
  return hit ? hit[0] : null;
}

export const isPackId = (v: unknown): v is PackId => v === 'agri_import' || v === 'unlimited_lives' || v === 'digital_growth';

// Origines autorisées à appeler les fonctions depuis le navigateur :
// APP_URL + ALLOWED_ORIGINS (liste séparée par des virgules) + serveurs de dev locaux.
const ALLOWED = new Set(
  [Deno.env.get('APP_URL'), ...(Deno.env.get('ALLOWED_ORIGINS') ?? '').split(','), 'http://localhost:5173', 'http://localhost:4173']
    .map((o) => o?.trim().replace(/\/$/, ''))
    .filter((o): o is string => Boolean(o)),
);

/** L'origine si elle fait partie de la liste autorisée, sinon null. */
export const allowedOrigin = (origin: string | null): string | null => (origin && ALLOWED.has(origin) ? origin : null);

/** En-têtes CORS : renvoie l'origine de la requête si elle est autorisée. */
export function corsHeadersFor(origin: string | null): Record<string, string> {
  const allowed = allowedOrigin(origin) ?? Deno.env.get('APP_URL') ?? '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export function json(body: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}
