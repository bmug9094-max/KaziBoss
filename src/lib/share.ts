/**
 * PARTAGE DU JEU
 * --------------
 * Partage natif (menu du téléphone) quand il existe, sinon WhatsApp, le canal n°1 de nos joueurs.
 * Le lien porte le code de parrainage du joueur connecté : https://…/?ref=CODE
 */
import { loadJSON, removeKey, saveJSON } from './storage';
import { isEN } from '../i18n';

const REF_KEY = 'ref';
const REF_PATTERN = /^[a-z0-9]{6,12}$/;

export function shareUrl(refCode?: string | null): string {
  const url = new URL(window.location.origin + '/');
  if (refCode) url.searchParams.set('ref', refCode);
  return url.toString();
}

export function inviteText(score?: number): string {
  if (isEN)
    return score
      ? `I lasted 30 days with ${score} points on KaziBoss 👑 Can you beat that? Business simulation, quick lessons and management tools. Free, even offline.`
      : 'I run my shop on KaziBoss 👑: 30 days to become the boss of your business. Quick lessons and real management tools. Free, even offline.';
  return score
    ? `J'ai tenu 30 jours avec ${score} points sur KaziBoss 👑 Tu fais mieux ? Simulation de business, leçons express et outils de gestion. Gratuit, même hors-ligne.`
    : "Je gère ma boutique sur KaziBoss 👑 : 30 jours pour devenir le boss de ton business. Leçons express et vrais outils de gestion. Gratuit, même hors-ligne.";
}

export type ShareOutcome = 'shared' | 'whatsapp' | 'cancelled';

/** Ouvre le partage. `shared` = confirmé par le téléphone, `whatsapp` = ouvert, sans confirmation possible. */
export async function shareGame(text: string, url: string): Promise<ShareOutcome> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: 'KaziBoss', text, url });
      return 'shared';
    } catch (e) {
      // AbortError = le joueur a fermé le menu. Autre erreur : on tente WhatsApp.
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  return 'whatsapp';
}

export async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/** À l'ouverture : mémorise le code de parrainage de l'URL (?ref=) puis nettoie l'adresse. */
export function captureReferral(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref')?.toLowerCase();
    if (!ref) return;
    if (REF_PATTERN.test(ref)) saveJSON(REF_KEY, ref);
    params.delete('ref');
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
  } catch {
    /* adresse illisible : on ignore */
  }
}

export const pendingReferral = (): string | null => loadJSON<string | null>(REF_KEY, null);
export const clearReferral = (): void => removeKey(REF_KEY);
