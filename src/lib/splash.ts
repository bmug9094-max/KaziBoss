/**
 * Retire l'écran d'ouverture (défini dans index.html) quand l'app est prête.
 * L'animation complète (~1,3 s) n'est jouée qu'à la première ouverture de la session ;
 * ensuite (retour de paiement, rechargement) on la coupe au plus vite.
 */
const FULL_MS = 1350;
const QUICK_MS = 250;
const KEY = 'kaziboss.splashSeen';

export function hideSplash(): void {
  const el = document.getElementById('splash');
  if (!el) return;
  let seen = false;
  try {
    seen = sessionStorage.getItem(KEY) === '1';
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* stockage indisponible */
  }
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const minimum = seen || reduced ? QUICK_MS : FULL_MS;
  const wait = Math.max(0, minimum - performance.now());
  window.setTimeout(() => {
    el.classList.add('splash-hide');
    window.setTimeout(() => el.remove(), 450);
  }, wait);
}
