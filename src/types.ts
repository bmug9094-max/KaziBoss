// ---------- Simulation ----------
export type Gauge = 'cash' | 'stock' | 'reputation' | 'energy';
export type Gauges = Record<Gauge, number>;
export type Effects = Partial<Gauges>;

export type CardCategory =
  | 'stock'
  | 'change'
  | 'credit'
  | 'energie'
  | 'fournisseur'
  | 'marketing'
  | 'caisse'
  | 'famille'
  | 'admin'
  | 'mobile-money'
  | 'equipe'
  | 'concurrence'
  | 'securite'
  | 'agri'
  | 'import';

export interface Choice {
  /** Texte du bouton */
  label: string;
  /** Ce qui se passe (1 phrase) */
  outcome: string;
  effects: Effects;
  xp: number;
  /** « Leçon Terrain » : 2 phrases sur le principe financier */
  lesson: string;
}

export type PackId = 'agri_import' | 'unlimited_lives' | 'digital_growth';

export interface ScenarioCard {
  id: string;
  category: CardCategory;
  character: string;
  role: string;
  avatar: string;
  title: string;
  text: string;
  a: Choice;
  b: Choice;
  /** Carte réservée à un pack premium */
  pack?: PackId;
}

// ---------- Apprentissage ----------
export interface TheoryCard {
  emoji: string;
  title: string;
  body: string;
}

export type QuizKind = 'qcm' | 'vrai-faux' | 'calcul' | 'situation';

export interface QuizQuestion {
  id: string;
  kind: QuizKind;
  question: string;
  options: string[];
  /** index de la bonne réponse */
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: [TheoryCard, TheoryCard, TheoryCard];
  quiz: QuizQuestion[];
  xp: number;
}

export type ModuleColor = 'gold' | 'emerald' | 'coral' | 'sky';

export interface LearningModule {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  color: ModuleColor;
  premium?: boolean;
  lessons: Lesson[];
}

// ---------- Joueur ----------
export type ToolId = 'pricing' | 'exchange' | 'journal';

export interface PlayerStats {
  runsPlayed: number;
  runsWon: number;
  bestScore: number;
  bestDay: number;
  bestCash: number;
  bestReputation: number;
  decisions: number;
  quizCorrect: number;
  quizAnswered: number;
}

export interface PlayerProfile {
  username: string;
  city: string;
  xp: number;
  kazicoins: number;
  streak: number;
  bestStreak: number;
  /** YYYY-MM-DD (date locale) */
  lastActiveDate: string | null;
  streakShields: number;
  energyRefills: number;
  /** Packs premium achetés (source de vérité : Supabase) */
  unlockedPacks: PackId[];
  /** Déblocages achetés en KaziCoins */
  coinUnlocks: string[];
  completedLessons: string[];
  badges: string[];
  toolsUsed: ToolId[];
  stats: PlayerStats;
  theme: 'dark' | 'light';
}
