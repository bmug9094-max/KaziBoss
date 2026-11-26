/** Formes des textes traduits (les chiffres et effets restent dans data/gameContent.ts). */
export interface ChoiceText {
  label: string;
  outcome: string;
  lesson: string;
}

export interface CardText {
  character: string;
  role: string;
  title: string;
  text: string;
  a: ChoiceText;
  b: ChoiceText;
}

export interface ModuleText {
  title: string;
  subtitle: string;
}

export interface LessonText {
  title: string;
  description: string;
  /** [titre, texte] des 3 micro-cartes, dans l'ordre */
  theory: [string, string][];
}

export interface QuizText {
  question: string;
  /** Même nombre et même ordre que les options françaises (la bonne réponse est un index) */
  options: string[];
  explanation: string;
}
