import { isEN } from '../i18n';
import type { Choice, LearningModule, ScenarioCard } from '../types';
import { LEARNING_MODULES as MODULES_FR, SCENARIO_CARDS as CARDS_FR } from './gameContent';
import { CARDS_EN } from './en/cards';
import { LESSONS_EN, MODULES_EN, QUIZ_EN } from './en/lessons';

/**
 * CONTENU DANS LA LANGUE ACTIVE
 * -----------------------------
 * gameContent.ts reste la source de vérité (chiffres, effets, XP, bonnes réponses).
 * Les fichiers data/en/* ne contiennent que les textes anglais, indexés par id ;
 * un texte manquant retombe sur le français.
 * Importer le contenu depuis ce fichier, jamais directement depuis gameContent.ts.
 */

function choiceEN(fr: Choice, en?: { label: string; outcome: string; lesson: string }): Choice {
  return en ? { ...fr, label: en.label, outcome: en.outcome, lesson: en.lesson } : fr;
}

function cardEN(c: ScenarioCard): ScenarioCard {
  const en = CARDS_EN[c.id];
  if (!en) return c;
  return { ...c, character: en.character, role: en.role, title: en.title, text: en.text, a: choiceEN(c.a, en.a), b: choiceEN(c.b, en.b) };
}

function moduleEN(m: LearningModule): LearningModule {
  const mod = MODULES_EN[m.id];
  return {
    ...m,
    title: mod?.title ?? m.title,
    subtitle: mod?.subtitle ?? m.subtitle,
    lessons: m.lessons.map((l) => {
      const le = LESSONS_EN[l.id];
      return {
        ...l,
        title: le?.title ?? l.title,
        description: le?.description ?? l.description,
        theory: l.theory.map((t, i) => (le?.theory[i] ? { ...t, title: le.theory[i][0], body: le.theory[i][1] } : t)) as typeof l.theory,
        quiz: l.quiz.map((q) => {
          const qe = QUIZ_EN[q.id];
          return qe && qe.options.length === q.options.length ? { ...q, question: qe.question, options: qe.options, explanation: qe.explanation } : q;
        }),
      };
    }),
  };
}

export const SCENARIO_CARDS: ScenarioCard[] = isEN ? CARDS_FR.map(cardEN) : CARDS_FR;
export const LEARNING_MODULES: LearningModule[] = isEN ? MODULES_FR.map(moduleEN) : MODULES_FR;
export const ALL_LESSONS = LEARNING_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
export const TOTAL_QUIZ_COUNT = ALL_LESSONS.reduce((n, l) => n + l.quiz.length, 0);
