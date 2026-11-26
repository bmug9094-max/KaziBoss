/**
 * AVIS DES JOUEURS
 * ----------------
 * Envoie les retours vers la table Supabase `feedback` (schema.sql § 9), avec ou sans compte.
 * Hors-ligne, les avis attendent dans une file locale et partent au prochain retour du réseau.
 * L'identifiant du compte est ajouté par la base elle-même (auth.uid()), jamais par l'app.
 */
import { LANG } from '../i18n';
import { loadJSON, saveJSON, todayISO, uid } from './storage';
import { supabase } from './supabase';

export type FeedbackKind = 'idea' | 'bug' | 'other' | 'nps' | 'card' | 'lesson';

export interface FeedbackInput {
  kind: FeedbackKind;
  /** 0-10 pour la recommandation, 1-5 pour la note, 1/0 pour utile/pas utile */
  rating?: number | null;
  message?: string;
  context?: Record<string, unknown>;
}

interface FeedbackRow {
  kind: FeedbackKind;
  rating: number | null;
  message: string | null;
  lang: string;
  context: Record<string, unknown>;
}

const QUEUE_KEY = 'feedback.queue';
const MAX_QUEUE = 50;

/** Identifiant anonyme de l'appareil : regroupe les avis d'un joueur invité, sans données personnelles. */
function deviceId(): string {
  let id = loadJSON<string | null>('device', null);
  if (!id) {
    id = uid();
    saveJSON('device', id);
  }
  return id;
}

function baseContext(): Record<string, unknown> {
  let standalone = false;
  try {
    standalone = window.matchMedia('(display-mode: standalone)').matches;
  } catch {
    /* non supporté */
  }
  return {
    device: deviceId(),
    build: __BUILD__,
    installed: standalone,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    online: navigator.onLine,
  };
}

/** Enregistre un avis et tente de l'envoyer. `true` si tout est parti, `false` s'il attend le réseau. */
export async function sendFeedback(input: FeedbackInput): Promise<boolean> {
  const row: FeedbackRow = {
    kind: input.kind,
    rating: input.rating ?? null,
    message: input.message?.trim().slice(0, 1000) || null,
    lang: LANG,
    context: { ...baseContext(), ...input.context },
  };
  saveJSON(QUEUE_KEY, [...loadJSON<FeedbackRow[]>(QUEUE_KEY, []), row].slice(-MAX_QUEUE));
  return flushFeedback();
}

/** Codes Postgres d'un avis définitivement refusé (contrainte, valeur invalide, limite du trigger). */
const REJECTED_CODES = new Set(['23514', '23502', '22001', '22P02', 'P0001']);

let flushing = false;

/** Envoie la file d'attente (au démarrage, au retour du réseau, après chaque nouvel avis). */
export async function flushFeedback(): Promise<boolean> {
  if (!supabase || flushing) return false;
  const queue = loadJSON<FeedbackRow[]>(QUEUE_KEY, []);
  if (!queue.length) return true;
  flushing = true;
  try {
    const { error } = await supabase.from('feedback').insert(queue);
    if (error) {
      // Avis refusé par la base (contrôle de format, limite anti-spam) : on le jette pour ne pas bloquer
      // la file. Toute autre erreur (réseau, table pas encore créée) : on réessaiera plus tard.
      if (REJECTED_CODES.has(error.code)) saveJSON(QUEUE_KEY, []);
      return false;
    }
    saveJSON(QUEUE_KEY, []);
    return true;
  } catch {
    return false;
  } finally {
    flushing = false;
  }
}

// ───────── Fréquence des demandes (pour ne jamais harceler le joueur) ─────────

const VOTED_KEY = 'feedback.voted';

/** Le joueur a-t-il déjà voté sur cette carte / leçon ? */
export function hasVoted(id: string): boolean {
  return loadJSON<string[]>(VOTED_KEY, []).includes(id);
}

export function markVoted(id: string): void {
  saveJSON(VOTED_KEY, [...loadJSON<string[]>(VOTED_KEY, []), id].slice(-500));
}

const NPS_KEY = 'feedback.npsDate';
const NPS_EVERY_DAYS = 45;

/** Question « recommanderais-tu KaziBoss ? » : au plus une fois tous les 45 jours. */
export function npsDue(runsPlayed: number): boolean {
  if (runsPlayed < 2) return false;
  const last = loadJSON<string | null>(NPS_KEY, null);
  if (!last) return true;
  return (Date.parse(todayISO()) - Date.parse(last)) / 86_400_000 >= NPS_EVERY_DAYS;
}

export function markNpsAsked(): void {
  saveJSON(NPS_KEY, todayISO());
}

const REWARD_KEY = 'feedback.rewardDate';
export const FEEDBACK_REWARD = 10;

/** Un avis écrit rapporte des KaziCoins au plus une fois par semaine. */
export function feedbackRewardAvailable(): boolean {
  const last = loadJSON<string | null>(REWARD_KEY, null);
  return !last || (Date.parse(todayISO()) - Date.parse(last)) / 86_400_000 >= 7;
}

export function markFeedbackRewarded(): void {
  saveJSON(REWARD_KEY, todayISO());
}
