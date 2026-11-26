/**
 * LANGUE DE L'APPLICATION (FR / EN)
 * ---------------------------------
 * La langue est lue une seule fois au démarrage : choix enregistré (localStorage
 * « kaziboss.lang »), sinon langue du téléphone (français par défaut).
 * Changer de langue recharge la page : chaque texte est donc un simple `L('fr', 'en')`,
 * utilisable partout, y compris dans les constantes de module.
 */
export type Lang = 'fr' | 'en';

const KEY = 'kaziboss.lang';

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === '"fr"' || saved === '"en"') return JSON.parse(saved) as Lang;
    // Joueur déjà installé avant l'arrivée de l'anglais : on ne change pas sa langue.
    if (localStorage.getItem('kaziboss.profile')) return 'fr';
  } catch {
    /* stockage indisponible */
  }
  // Robots d'indexation (Googlebot rend la page avec un navigateur anglais) : version française,
  // cohérente avec les métadonnées de index.html.
  if (typeof navigator !== 'undefined' && /bot|crawl|spider|slurp|preview/i.test(navigator.userAgent)) return 'fr';
  const nav = typeof navigator !== 'undefined' ? (navigator.languages?.[0] ?? navigator.language ?? '') : '';
  return nav.toLowerCase().startsWith('fr') ? 'fr' : nav ? 'en' : 'fr';
}

export const LANG: Lang = detect();
export const isEN = LANG === 'en';

/** Texte selon la langue active. */
export function L<T>(fr: T, en: T): T {
  return isEN ? en : fr;
}

/** Locale pour les nombres et les dates. */
export const LOCALE = L('fr-FR', 'en-US');

export function setLang(lang: Lang): void {
  if (lang === LANG) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(lang));
  } catch {
    /* stockage indisponible : le changement ne survivra pas au rechargement */
  }
  window.location.reload();
}

/** Montant en dollars : « 12 $ » en français, « $12 » en anglais (signe devant). */
export function usd(n: number | string): string {
  if (!isEN) return `${n} $`;
  const s = String(n);
  return s.startsWith('-') || s.startsWith('−') ? `-$${s.slice(1)}` : `$${s}`;
}

if (typeof document !== 'undefined') document.documentElement.lang = LANG;
