import { LEARNING_MODULES } from '../data/gameContent';
import type { PlayerProfile } from '../types';
import { daysBetween, todayISO } from './storage';

// ───────────── Niveaux ─────────────
const LEVEL_TITLES = [
  'Vendeur ambulant',
  'Petit commerçant',
  'Boutiquier',
  'Commerçant aguerri',
  'Grossiste',
  'Entrepreneur',
  'Patron de quartier',
  'Business leader',
  'Magnat',
  'KaziBoss',
];

/** XP cumulée requise pour atteindre le niveau n (n ≥ 1) */
export const xpForLevel = (n: number) => 50 * n * (n - 1);

export function levelInfo(xp: number) {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const floor = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1],
    progress: (xp - floor) / (next - floor),
    toNext: next - xp,
  };
}

// ───────────── Streak ─────────────
/** Met à jour le streak lors d'une activité (décision ou leçon). */
export function touchStreak(p: PlayerProfile, today = todayISO()): { profile: PlayerProfile; shieldUsed: boolean } {
  if (p.lastActiveDate === today) return { profile: p, shieldUsed: false };
  let streak = 1;
  let shields = p.streakShields;
  let shieldUsed = false;
  if (p.lastActiveDate) {
    const gap = daysBetween(p.lastActiveDate, today);
    if (gap === 1) streak = p.streak + 1;
    else if (gap === 2 && shields > 0) {
      // Le bouclier sauve un jour manqué.
      shields -= 1;
      shieldUsed = true;
      streak = p.streak + 1;
    }
  }
  return {
    profile: { ...p, streak, bestStreak: Math.max(p.bestStreak, streak), lastActiveDate: today, streakShields: shields },
    shieldUsed,
  };
}

/** Streak affiché : retombe à 0 si le joueur a raté un jour sans bouclier. */
export function displayStreak(p: PlayerProfile, today = todayISO()): number {
  if (!p.lastActiveDate) return 0;
  const gap = daysBetween(p.lastActiveDate, today);
  if (gap <= 1) return p.streak;
  if (gap === 2 && p.streakShields > 0) return p.streak;
  return 0;
}

// ───────────── Badges ─────────────
export interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
  test: (p: PlayerProfile) => boolean;
}

const moduleDone = (p: PlayerProfile, moduleId: string) =>
  LEARNING_MODULES.find((m) => m.id === moduleId)!.lessons.every((l) => p.completedLessons.includes(l.id));

export const BADGES: BadgeDef[] = [
  { id: 'first_step', emoji: '🚀', name: 'Premier pas', description: 'Prendre ta première décision', test: (p) => p.stats.decisions >= 1 },
  { id: 'survivor', emoji: '🛡️', name: 'Survivant', description: 'Atteindre le jour 10', test: (p) => p.stats.bestDay >= 10 },
  { id: 'kaziboss', emoji: '👑', name: 'KaziBoss', description: 'Terminer les 30 jours', test: (p) => p.stats.runsWon >= 1 },
  { id: 'rich', emoji: '💰', name: 'Caisse pleine', description: 'Atteindre 300 $ de trésorerie', test: (p) => p.stats.bestCash >= 300 },
  { id: 'loved', emoji: '⭐', name: 'Chouchou du quartier', description: 'Atteindre 90 de réputation', test: (p) => p.stats.bestReputation >= 90 },
  { id: 'streak3', emoji: '🔥', name: 'En feu', description: '3 jours de suite', test: (p) => p.bestStreak >= 3 },
  { id: 'streak7', emoji: '☄️', name: 'Inarrêtable', description: '7 jours de suite', test: (p) => p.bestStreak >= 7 },
  { id: 'student', emoji: '📚', name: 'Apprenti', description: 'Terminer une leçon', test: (p) => p.completedLessons.length >= 1 },
  { id: 'cashier', emoji: '🧾', name: 'Maître de caisse', description: 'Terminer le module 1', test: (p) => moduleDone(p, 'm1') },
  { id: 'pricer', emoji: '🏷️', name: 'Roi des marges', description: 'Terminer le module 2', test: (p) => moduleDone(p, 'm2') },
  { id: 'quiz20', emoji: '🎯', name: 'Tête bien faite', description: '20 bonnes réponses aux quiz', test: (p) => p.stats.quizCorrect >= 20 },
  { id: 'toolbox', emoji: '🧰', name: 'Boîte à outils', description: 'Utiliser les 3 outils', test: (p) => p.toolsUsed.length >= 3 },
  { id: 'xp1000', emoji: '⚡', name: 'Mille éclairs', description: 'Cumuler 1 000 XP', test: (p) => p.xp >= 1000 },
];

export function newlyEarnedBadges(p: PlayerProfile): BadgeDef[] {
  return BADGES.filter((b) => !p.badges.includes(b.id) && b.test(p));
}
