// ═══════════════════════════════════════════════════════════════════
//  Vérifie la boutique Chariow en LECTURE SEULE : produits et Pulses (webhooks).
//  La clé API est lue dans supabase/functions/.env (ignoré par git) ou dans la
//  variable d'environnement CHARIOW_API_KEY. Elle n'est jamais affichée.
//
//  Usage (depuis la racine du projet) :  node chariow/outils/verifier_chariow.mjs
// ═══════════════════════════════════════════════════════════════════
import { existsSync, readFileSync } from 'node:fs';

function readKey() {
  if (process.env.CHARIOW_API_KEY) return process.env.CHARIOW_API_KEY.trim();
  const file = 'supabase/functions/.env';
  if (!existsSync(file)) return null;
  const line = readFileSync(file, 'utf8').split(/\r?\n/).find((l) => l.startsWith('CHARIOW_API_KEY='));
  return line ? line.slice('CHARIOW_API_KEY='.length).trim().replace(/^["']|["']$/g, '') : null;
}

const key = readKey();
if (!key) {
  console.error("Clé introuvable. Ajoute la ligne CHARIOW_API_KEY=... dans supabase/functions/.env puis relance.");
  process.exit(1);
}

async function get(path) {
  const res = await fetch(`https://api.chariow.com/v1${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message ?? body?.error ?? res.statusText;
    throw new Error(`${path} → HTTP ${res.status} : ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
  }
  return Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
}

const show = (v) => (v === undefined || v === null || v === '' ? '—' : typeof v === 'object' ? (v.formatted ?? v.value ?? JSON.stringify(v)) : String(v));

try {
  const products = await get('/products?per_page=100');
  console.log(`\n📦 Produits (${products.length})`);
  for (const p of products) {
    console.log(`  ${show(p.id)}  ·  ${show(p.name ?? p.title)}  ·  type ${show(p.type)}  ·  ${show(p.status)}  ·  prix ${show(p.price ?? p.pricing?.price)}`);
  }
  const wanted = ['agri', 'vies', 'digital'];
  const ids = Object.fromEntries(
    wanted.map((w) => [w, products.find((p) => String(p.name ?? p.title ?? '').toLowerCase().includes(w))?.id]),
  );
  console.log('\n🔑 Commande à lancer (vérifie que chaque id correspond au bon pack) :');
  console.log(
    `  supabase secrets set CHARIOW_PRODUCT_AGRI=${ids.agri ?? 'prd_?'} CHARIOW_PRODUCT_UNLIMITED=${ids.vies ?? 'prd_?'} CHARIOW_PRODUCT_RESOURCES=${ids.digital ?? 'prd_?'}`,
  );
} catch (e) {
  console.error('\n❌ Produits :', e.message);
}

try {
  const pulses = await get('/pulses?per_page=100');
  console.log(`\n📡 Pulses / webhooks (${pulses.length})`);
  for (const p of pulses) {
    const events = Array.isArray(p.events) ? p.events.join(', ') : show(p.events ?? p.event);
    console.log(`  ${show(p.id)}  ·  ${show(p.url ?? p.endpoint)}  ·  événements : ${events}  ·  ${show(p.status ?? (p.enabled ? 'actif' : undefined))}`);
  }
  if (!pulses.length) console.log('  Aucun Pulse : crée-le dans Automations › Pulses (événement successful.sale).');
} catch (e) {
  console.error('\n❌ Pulses :', e.message, '(la clé a peut-être seulement le droit products.read : ce n’est pas grave)');
}
