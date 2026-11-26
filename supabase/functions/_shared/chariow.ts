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

export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_URL') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}
