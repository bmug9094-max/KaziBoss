import { SCENARIO_CARDS } from '../data/content';
import { L } from '../i18n';
import type { CardCategory, Effects, Gauge, Gauges, PackId, ScenarioCard, SectorId } from '../types';

export const MAX_DAYS = 30;
export const START_GAUGES: Gauges = { cash: 100, stock: 50, reputation: 50, energy: 80 };
export const GAUGE_KEYS: Gauge[] = ['cash', 'stock', 'reputation', 'energy'];
export const SECOND_CHANCE_COST = 50;
/** Prix de revente d'un point de stock (≈ 2 $ à l'achat) */
const SALE_PRICE_PER_POINT = 3.5;

export type RunStatus = 'intro' | 'playing' | 'outcome' | 'gameover' | 'victory';

export interface HistoryEntry {
  day: number;
  cardId: string;
  choice: 'a' | 'b';
  delta: Effects;
}

export interface DailySales {
  sold: number;
  revenue: number;
}

export interface TurnResult {
  cardId: string;
  choice: 'a' | 'b';
  choiceEffects: Effects;
  sales: DailySales;
  /** variation totale (choix + ventes) */
  delta: Effects;
  xp: number;
  coins: number;
  failed: Gauge[];
}

export interface RunState {
  status: RunStatus;
  day: number;
  gauges: Gauges;
  cardId: string | null;
  seen: string[];
  history: HistoryEntry[];
  xpEarned: number;
  coinsEarned: number;
  secondChancesUsed: number;
  lastResult: TurnResult | null;
  failed: Gauge[];
  /** Secteur choisi pour ce mois (null = boutique de quartier). Absent des sauvegardes anciennes. */
  sector?: SectorId | null;
}

export const NEW_RUN: RunState = {
  status: 'intro',
  day: 1,
  gauges: { ...START_GAUGES },
  cardId: null,
  seen: [],
  history: [],
  xpEarned: 0,
  coinsEarned: 0,
  secondChancesUsed: 0,
  lastResult: null,
  failed: [],
  sector: null,
};

/** Seuil d'alerte : jauge sous 20 % (pour la trésorerie : sous 20 $, soit 20 % du capital de départ). */
export const LOW_GAUGE_THRESHOLD = 20;

/** Jauges qui viennent de passer sous le seuil d'alerte (sans être tombées à zéro). */
export function newlyLowGauges(before: Gauges, after: Gauges): Gauge[] {
  return GAUGE_KEYS.filter((k) => before[k] >= LOW_GAUGE_THRESHOLD && after[k] < LOW_GAUGE_THRESHOLD && after[k] > 0);
}

const CARD_INDEX = new Map(SCENARIO_CARDS.map((c) => [c.id, c]));
export const getCard = (id: string | null): ScenarioCard | undefined => (id ? CARD_INDEX.get(id) : undefined);

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

function addEffects(g: Gauges, e: Effects): Gauges {
  return {
    cash: Math.round((g.cash + (e.cash ?? 0)) * 100) / 100,
    stock: clamp(g.stock + (e.stock ?? 0)),
    reputation: clamp(g.reputation + (e.reputation ?? 0)),
    energy: clamp(g.energy + (e.energy ?? 0)),
  };
}

export function failedGauges(g: Gauges): Gauge[] {
  return GAUGE_KEYS.filter((k) => g[k] <= 0);
}

/** Tirage pondéré : quand une jauge est basse, les cartes qui la concernent remontent. */
export function drawCard(seen: string[], gauges: Gauges, packs: PackId[], sector: SectorId | null = null): ScenarioCard {
  const available = SCENARIO_CARDS.filter((c) => (!c.pack || packs.includes(c.pack)) && (!c.sector || c.sector === sector));
  let pool = available.filter((c) => !seen.includes(c.id));
  if (pool.length === 0) pool = available;

  const boost = new Set<CardCategory>();
  if (gauges.stock < 40) (['stock', 'fournisseur', 'agri', 'import', 'transformation'] as const).forEach((c) => boost.add(c));
  if (gauges.energy < 35) (['energie', 'equipe'] as const).forEach((c) => boost.add(c));
  if (gauges.reputation < 30) (['marketing', 'concurrence', 'digital'] as const).forEach((c) => boost.add(c));
  if (gauges.cash < 30) (['credit', 'caisse'] as const).forEach((c) => boost.add(c));

  // Les cartes du secteur choisi sortent plus souvent : c'est la « couleur » du mois.
  const weights = pool.map((c) => (boost.has(c.category) ? 3 : 1) * (c.pack ? 1.5 : 1) * (c.sector ? 2 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function startRun(packs: PackId[], sector: SectorId | null = null): RunState {
  const card = drawCard([], START_GAUGES, packs, sector);
  return { ...NEW_RUN, status: 'playing', gauges: { ...START_GAUGES }, cardId: card.id, seen: [card.id], sector };
}

/** Applique un choix puis la journée de vente. */
export function resolveChoice(run: RunState, choice: 'a' | 'b'): RunState {
  const card = getCard(run.cardId);
  if (!card) return run;
  const opt = card[choice];

  let g = addEffects(run.gauges, opt.effects);
  let sales: DailySales = { sold: 0, revenue: 0 };

  // Journée de vente : la réputation attire les clients, le stock se transforme en cash.
  if (failedGauges(g).length === 0) {
    const sold = Math.min(g.stock, Math.round(1 + g.reputation / 30));
    sales = { sold, revenue: sold * SALE_PRICE_PER_POINT };
    g = addEffects(g, { stock: -sold, cash: sales.revenue });
  }

  const delta: Effects = {};
  for (const k of GAUGE_KEYS) {
    const d = Math.round((g[k] - run.gauges[k]) * 100) / 100;
    if (d !== 0) delta[k] = d;
  }

  const failed = failedGauges(g);
  const coins = failed.length ? 0 : 2;

  return {
    ...run,
    status: 'outcome',
    gauges: g,
    history: [...run.history, { day: run.day, cardId: card.id, choice, delta }],
    xpEarned: run.xpEarned + opt.xp,
    coinsEarned: run.coinsEarned + coins,
    failed,
    lastResult: { cardId: card.id, choice, choiceEffects: opt.effects, sales, delta, xp: opt.xp, coins, failed },
  };
}

/** Après la Leçon Terrain : game over, victoire ou jour suivant. */
export function advance(run: RunState, packs: PackId[]): RunState {
  if (run.failed.length) return { ...run, status: 'gameover' };
  if (run.day >= MAX_DAYS) return { ...run, status: 'victory' };
  const card = drawCard(run.seen, run.gauges, packs, run.sector ?? null);
  return { ...run, status: 'playing', day: run.day + 1, cardId: card.id, seen: [...run.seen, card.id], lastResult: null };
}

export function applyBoost(run: RunState, effects: Effects): RunState {
  return { ...run, gauges: addEffects(run.gauges, effects) };
}

/** Seconde chance : remonte les jauges à zéro et continue au jour suivant. */
export function secondChance(run: RunState, packs: PackId[]): RunState {
  const g = { ...run.gauges };
  for (const k of run.failed) g[k] = k === 'cash' ? 40 : 30;
  return advance({ ...run, gauges: g, failed: [], secondChancesUsed: run.secondChancesUsed + 1 }, packs);
}

export function computeScore(run: RunState): number {
  const g = run.gauges;
  const base = run.day * 10 + Math.max(0, Math.round(g.cash)) + g.reputation * 2 + g.stock + g.energy;
  return run.status === 'victory' ? base + 250 : base;
}

// ───────────── Analyse pédagogique de la faillite ─────────────
export const GAUGE_META: Record<Gauge, { label: string; color: string }> = {
  cash: { label: L('Trésorerie', 'Cash'), color: '#F59E0B' },
  stock: { label: 'Stock', color: '#38BDF8' },
  reputation: { label: L('Réputation', 'Reputation'), color: '#10B981' },
  energy: { label: L('Énergie', 'Energy'), color: '#EF4444' },
};

const FAILURE_ANALYSIS_EN: Record<Gauge, { title: string; cause: string; fix: string }> = {
  cash: {
    title: 'Out of cash',
    cause:
      "Your cash box hit zero: you can no longer restock or pay your bills. It is the number one reason small businesses close, even profitable ones.",
    fix: 'Always keep a safety reserve, limit customer credit and avoid big purchases that empty the cash box.',
  },
  stock: {
    title: 'Completely out of stock',
    cause:
      "Your shelves are empty: no goods means no sales, and customers get used to shopping elsewhere.",
    fix: 'Restock before you run out, keep safety stock on your best sellers and use more than one supplier.',
  },
  reputation: {
    title: 'Reputation destroyed',
    cause:
      "Nobody in the neighbourhood trusts you any more. Without customers, neither your stock nor your cash is worth anything.",
    fix: "Never sell dubious products, stay professional in conflicts and invest in your customer relationships.",
  },
  energy: {
    title: 'Burned-out boss',
    cause:
      "You carried everything alone until you were exhausted. A worn-out boss makes mistakes and ends up closing.",
    fix: 'Plan your rest, delegate simple tasks and never replace an essential expense with your own fatigue.',
  },
};

const FAILURE_ANALYSIS_FR: Record<Gauge, { title: string; cause: string; fix: string }> = {
  cash: {
    title: 'Faillite de trésorerie',
    cause:
      "Ta caisse est tombée à zéro : tu ne peux plus racheter de stock ni payer tes charges. C'est la première cause de fermeture des petites entreprises, même rentables.",
    fix: 'Garde toujours une réserve de sécurité, limite le crédit client et évite les gros achats qui vident la caisse.',
  },
  stock: {
    title: 'Rupture de stock totale',
    cause:
      "Tes étagères sont vides : sans marchandise, plus de ventes, et les clients prennent l'habitude d'aller ailleurs.",
    fix: 'Réapprovisionne avant la rupture, garde un stock de sécurité sur tes produits phares et diversifie tes fournisseurs.',
  },
  reputation: {
    title: 'Réputation détruite',
    cause:
      "Plus personne ne te fait confiance dans le quartier. Sans clients, ni le stock ni la caisse ne servent à rien.",
    fix: "Ne vends jamais de produits douteux, reste professionnel face aux conflits et investis dans la relation client.",
  },
  energy: {
    title: 'Épuisement du patron',
    cause:
      "Tu as tout porté seul jusqu'à l'épuisement. Un patron à bout de forces fait des erreurs et finit par fermer.",
    fix: 'Planifie ton repos, délègue les tâches simples et ne remplace pas une dépense essentielle par ta propre fatigue.',
  },
};

export const FAILURE_ANALYSIS = L(FAILURE_ANALYSIS_FR, FAILURE_ANALYSIS_EN);

export interface CostlyDecision {
  day: number;
  title: string;
  label: string;
  impact: number;
}

export function costliestDecisions(run: RunState, gauge: Gauge, n = 3): CostlyDecision[] {
  return run.history
    .map((h) => {
      const card = getCard(h.cardId);
      const impact = card?.[h.choice].effects[gauge] ?? 0;
      return { day: h.day, title: card?.title ?? '', label: card?.[h.choice].label ?? '', impact };
    })
    .filter((d) => d.impact < 0)
    .sort((a, b) => a.impact - b.impact)
    .slice(0, n);
}
