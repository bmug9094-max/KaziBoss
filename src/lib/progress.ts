import { LEARNING_MODULES } from '../data/content';
import { L } from '../i18n';
import type { PlayerProfile } from '../types';
import { daysBetween, todayISO } from './storage';

// ───────────── Niveaux ─────────────
const LEVEL_TITLES = L(
  [
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
  ],
  [
    'Street vendor',
    'Small trader',
    'Shopkeeper',
    'Seasoned trader',
    'Wholesaler',
    'Entrepreneur',
    'Neighbourhood boss',
    'Business leader',
    'Tycoon',
    'KaziBoss',
  ],
);

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
  { id: 'first_step', emoji: '🚀', name: L('Premier pas', 'First step'), description: L('Prendre ta première décision', 'Make your first decision'), test: (p) => p.stats.decisions >= 1 },
  { id: 'survivor', emoji: '🛡️', name: L('Survivant', 'Survivor'), description: L('Atteindre le jour 10', 'Reach day 10'), test: (p) => p.stats.bestDay >= 10 },
  { id: 'kaziboss', emoji: '👑', name: 'KaziBoss', description: L('Terminer les 30 jours', 'Complete all 30 days'), test: (p) => p.stats.runsWon >= 1 },
  { id: 'rich', emoji: '💰', name: L('Caisse pleine', 'Full till'), description: L('Atteindre 300 $ de trésorerie', 'Reach $300 in cash'), test: (p) => p.stats.bestCash >= 300 },
  { id: 'loved', emoji: '⭐', name: L('Chouchou du quartier', 'Local favourite'), description: L('Atteindre 90 de réputation', 'Reach 90 reputation'), test: (p) => p.stats.bestReputation >= 90 },
  { id: 'streak3', emoji: '🔥', name: L('En feu', 'On fire'), description: L('3 jours de suite', '3 days in a row'), test: (p) => p.bestStreak >= 3 },
  { id: 'streak7', emoji: '☄️', name: L('Inarrêtable', 'Unstoppable'), description: L('7 jours de suite', '7 days in a row'), test: (p) => p.bestStreak >= 7 },
  { id: 'student', emoji: '📚', name: L('Apprenti', 'Apprentice'), description: L('Terminer une leçon', 'Finish a lesson'), test: (p) => p.completedLessons.length >= 1 },
  { id: 'cashier', emoji: '🧾', name: L('Maître de caisse', 'Cash master'), description: L('Terminer le module 1', 'Finish module 1'), test: (p) => moduleDone(p, 'm1') },
  { id: 'pricer', emoji: '🏷️', name: L('Roi des marges', 'Margin king'), description: L('Terminer le module 2', 'Finish module 2'), test: (p) => moduleDone(p, 'm2') },
  { id: 'quiz20', emoji: '🎯', name: L('Tête bien faite', 'Sharp mind'), description: L('20 bonnes réponses aux quiz', '20 correct quiz answers'), test: (p) => p.stats.quizCorrect >= 20 },
  { id: 'toolbox', emoji: '🧰', name: L('Boîte à outils', 'Toolbox'), description: L('Utiliser les 3 outils', 'Use all 3 tools'), test: (p) => p.toolsUsed.length >= 3 },
  { id: 'xp1000', emoji: '⚡', name: L('Mille éclairs', 'Thousand sparks'), description: L('Cumuler 1 000 XP', 'Earn 1,000 XP'), test: (p) => p.xp >= 1000 },
  { id: 'ambassador', emoji: '📣', name: L('Ambassadeur', 'Ambassador'), description: L('Partager KaziBoss 5 fois', 'Share KaziBoss 5 times'), test: (p) => p.shares >= 5 },
  { id: 'exporter', emoji: '🚢', name: L('Exportateur', 'Exporter'), description: L('Obtenir le Pack Agri-Business & Import-Export', 'Get the Agri-Business & Import-Export Pack'), test: (p) => p.unlockedPacks.includes('agri_import') },
];

export function newlyEarnedBadges(p: PlayerProfile): BadgeDef[] {
  return BADGES.filter((b) => !p.badges.includes(b.id) && b.test(p));
}
