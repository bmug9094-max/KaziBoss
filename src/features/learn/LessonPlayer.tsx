import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Coins, Sparkles, Trophy, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { usePlayer } from '../../state/PlayerContext';
import type { Lesson, ModuleColor, QuizKind } from '../../types';

const KIND_LABEL: Record<QuizKind, string> = {
  qcm: 'Question',
  'vrai-faux': 'Vrai ou faux ?',
  calcul: 'Calcul rapide',
  situation: 'Mise en situation',
};

const COINS_PER_CORRECT = 5;
const COMPLETION_BONUS = 10;

export default function LessonPlayer({ lesson, moduleColor, onClose }: { lesson: Lesson; moduleColor: ModuleColor; onClose: () => void }) {
  const { profile, reward, update, recordActivity } = usePlayer();
  const alreadyDone = profile.completedLessons.includes(lesson.id);
  const steps = lesson.theory.length + lesson.quiz.length;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState<{ xp: number; coins: number } | null>(null);

  const inTheory = step < lesson.theory.length;
  const quiz = !inTheory ? lesson.quiz[step - lesson.theory.length] : null;
  const answered = picked !== null;
  const accent = moduleColor === 'gold' ? 'bg-gold' : moduleColor === 'emerald' ? 'bg-emerald' : moduleColor === 'coral' ? 'bg-coral' : 'bg-sky';

  const pick = (i: number) => {
    if (answered || !quiz) return;
    setPicked(i);
    if (i === quiz.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (step + 1 < steps) {
      setStep(step + 1);
      setPicked(null);
      return;
    }
    // Fin de leçon : récompenses (réduites en révision)
    const xp = alreadyDone ? Math.round(lesson.xp / 3) : lesson.xp;
    const coins = alreadyDone ? correct : correct * COINS_PER_CORRECT + COMPLETION_BONUS;
    reward(xp, coins);
    recordActivity();
    update((p) => ({
      ...p,
      completedLessons: p.completedLessons.includes(lesson.id) ? p.completedLessons : [...p.completedLessons, lesson.id],
      stats: { ...p.stats, quizCorrect: p.stats.quizCorrect + correct, quizAnswered: p.stats.quizAnswered + lesson.quiz.length },
    }));
    setFinished({ xp, coins });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-bg">
      <div className="pt-safe pb-safe flex w-full max-w-md flex-col px-5">
        <div className="flex items-center gap-3 py-3">
          <button onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Quitter la leçon">
            <X size={22} />
          </button>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
            <motion.div className={`h-full rounded-full ${accent}`} animate={{ width: `${((finished ? steps : step) / steps) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pt-10 text-center">
                <Trophy size={72} className="fill-gold text-gold" />
                <h2 className="mt-4 text-2xl font-extrabold">Leçon terminée !</h2>
                <p className="mt-1 text-muted">{lesson.title}</p>
                <p className="mt-4 text-lg font-bold">
                  {correct}/{lesson.quiz.length} bonnes réponses
                </p>
                <div className="mt-4 flex gap-3">
                  <span className="chip px-4 py-2 text-base text-gold">
                    <Sparkles size={16} /> +{finished.xp} XP
                  </span>
                  <span className="chip px-4 py-2 text-base text-gold">
                    <Coins size={16} /> +{finished.coins}
                  </span>
                </div>
                {alreadyDone && <p className="mt-3 text-xs text-muted">Révision : récompenses réduites.</p>}
              </motion.div>
            ) : inTheory ? (
              <motion.div key={`t${step}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                <p className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  Micro-carte {step + 1}/{lesson.theory.length}
                </p>
                <div className="card mt-3 p-6">
                  <div className="text-6xl">{lesson.theory[step].emoji}</div>
                  <h2 className="mt-4 text-2xl font-extrabold leading-tight">{lesson.theory[step].title}</h2>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink/85">{lesson.theory[step].body}</p>
                </div>
              </motion.div>
            ) : (
              quiz && (
                <motion.div key={quiz.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-gold">{KIND_LABEL[quiz.kind]}</p>
                  <h2 className="mt-2 text-xl font-extrabold leading-snug">{quiz.question}</h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {quiz.options.map((opt, i) => {
                      const isRight = i === quiz.answer;
                      const isPicked = i === picked;
                      const style = !answered
                        ? 'border-line bg-surface hover:border-muted'
                        : isRight
                          ? 'border-emerald bg-emerald/15'
                          : isPicked
                            ? 'border-coral bg-coral/15'
                            : 'border-line bg-surface opacity-60';
                      return (
                        <motion.button
                          key={i}
                          whileTap={!answered ? { scale: 0.98 } : undefined}
                          animate={answered && isPicked && !isRight ? { x: [0, -8, 8, -4, 0] } : {}}
                          onClick={() => pick(i)}
                          className={`flex items-center justify-between gap-3 rounded-2xl border-2 border-b-4 px-4 py-3.5 text-left text-[15px] font-semibold transition ${style}`}
                        >
                          {opt}
                          {answered && isRight && <CheckCircle2 size={20} className="shrink-0 text-emerald" />}
                          {answered && isPicked && !isRight && <XCircle size={20} className="shrink-0 text-coral" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Pied : feedback + bouton */}
        <div className="pb-4">
          <AnimatePresence>
            {answered && quiz && !finished && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-3 rounded-2xl p-4 ${picked === quiz.answer ? 'bg-emerald/15' : 'bg-coral/15'}`}
              >
                <p className={`font-extrabold ${picked === quiz.answer ? 'text-emerald' : 'text-coral'}`}>
                  {picked === quiz.answer ? `Bravo ! +${alreadyDone ? 1 : COINS_PER_CORRECT} KaziCoins` : 'Pas tout à fait…'}
                </p>
                <p className="mt-1 text-sm text-ink/85">{quiz.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {finished ? (
            <button onClick={onClose} className="btn-primary w-full py-4 text-base">
              Continuer
            </button>
          ) : (
            <button onClick={next} disabled={!inTheory && !answered} className="btn-primary w-full py-4 text-base">
              {inTheory ? 'Compris' : 'Continuer'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
