/**
 * Petits événements d'interface globaux : n'importe quel écran peut ouvrir l'inscription
 * ou envoyer le joueur vers la boutique, sans faire passer des callbacks partout.
 */
import type { TabId } from '../components/BottomNav';

export type AuthReason = 'save' | 'buy' | 'leaderboard' | 'referral' | 'default';

const NAV = 'kaziboss:navigate';
const AUTH = 'kaziboss:auth';

/** Va sur un onglet, et fait défiler jusqu'à l'élément `anchor` (id HTML) s'il est donné. */
export function goTo(tab: TabId, anchor?: string): void {
  window.dispatchEvent(new CustomEvent(NAV, { detail: { tab, anchor } }));
}

export function onGoTo(fn: (tab: TabId, anchor?: string) => void): () => void {
  const h = (e: Event) => {
    const d = (e as CustomEvent<{ tab: TabId; anchor?: string }>).detail;
    fn(d.tab, d.anchor);
  };
  window.addEventListener(NAV, h);
  return () => window.removeEventListener(NAV, h);
}

/** Ouvre la feuille de création de compte. */
export function openAuth(reason: AuthReason = 'default'): void {
  window.dispatchEvent(new CustomEvent(AUTH, { detail: { reason } }));
}

export function onOpenAuth(fn: (reason: AuthReason) => void): () => void {
  const h = (e: Event) => fn((e as CustomEvent<{ reason: AuthReason }>).detail.reason);
  window.addEventListener(AUTH, h);
  return () => window.removeEventListener(AUTH, h);
}

/** Petite vibration (Android) pour donner du corps aux actions. Sans effet ailleurs. */
export function haptic(ms = 12): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* non supporté */
  }
}
