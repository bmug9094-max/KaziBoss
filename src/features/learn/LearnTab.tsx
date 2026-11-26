import { motion } from 'framer-motion';
import { Check, Crown, Lock, Star } from 'lucide-react';
import { useState } from 'react';
import { COIN_ITEMS } from '../../config/shop';
import { LEARNING_MODULES, TOTAL_QUIZ_COUNT } from '../../data/gameContent';
import { goTo } from '../../lib/ui';
import { usePlayer } from '../../state/PlayerContext';
import type { Lesson, LearningModule, ModuleColor } from '../../types';
import LessonPlayer from './LessonPlayer';

const COLOR: Record<ModuleColor, { bg: string; ring: string; text: string; grad: string }> = {
  gold: { bg: 'bg-gold', ring: 'ring-gold/40', text: 'text-gold', grad: 'from-gold/25' },
  emerald: { bg: 'bg-emerald', ring: 'ring-emerald/40', text: 'text-emerald', grad: 'from-emerald/25' },
  coral: { bg: 'bg-coral', ring: 'ring-coral/40', text: 'text-coral', grad: 'from-coral/25' },
  sky: { bg: 'bg-sky', ring: 'ring-sky/40', text: 'text-sky', grad: 'from-sky/25' },
};

/** Décalage horizontal façon Duolingo */
const OFFSETS = [0, 56, 0, -56];

export default function LearnTab() {
  const { profile, module4Unlocked, spendCoins, update, notify } = usePlayer();
  const [active, setActive] = useState<{ lesson: Lesson; module: LearningModule } | null>(null);
  const done = new Set(profile.completedLessons);
  const ordered = LEARNING_MODULES.flatMap((m) => m.lessons);
  const totalDone = ordered.filter((l) => done.has(l.id)).length;

  const isOpen = (lesson: Lesson) => {
    const i = ordered.findIndex((l) => l.id === lesson.id);
    return i === 0 || done.has(ordered[i - 1].id) || done.has(lesson.id);
  };

  const unlockModule4 = () => {
    if (!spendCoins(COIN_ITEMS.module4.price)) return;
    update((p) => ({ ...p, coinUnlocks: [...p.coinUnlocks, 'module4'] }));
    notify('🚀 Module 4 débloqué !', 'gold');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex items-center justify-between p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Ton parcours</p>
          <p className="text-lg font-extrabold">
            {totalDone}/{ordered.length} leçons
          </p>
          <p className="text-xs text-muted">{TOTAL_QUIZ_COUNT} quiz pratiques · KaziCoins à gagner</p>
        </div>
        <div className="relative h-14 w-14">
          <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(var(--surface-2))" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(totalDone / ordered.length) * 97.4} 97.4`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold">{Math.round((totalDone / ordered.length) * 100)}%</span>
        </div>
      </div>

      {LEARNING_MODULES.map((m) => {
        const c = COLOR[m.color];
        const premiumLocked = Boolean(m.premium) && !module4Unlocked;
        const moduleDone = m.lessons.every((l) => done.has(l.id));
        return (
          <section key={m.id}>
            <div className={`rounded-3xl bg-gradient-to-br ${c.grad} to-transparent p-4`}>
              <p className={`text-xs font-extrabold uppercase tracking-widest ${c.text}`}>
                Module {m.index}
                {m.premium && ' · Premium'}
              </p>
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                {m.title} {moduleDone && <Crown size={18} className="fill-gold text-gold" />}
              </h2>
              <p className="text-sm text-ink/75">{m.subtitle}</p>
            </div>

            <div className="relative mt-4 flex flex-col items-center gap-5">
              {m.lessons.map((lesson, i) => {
                const completed = done.has(lesson.id);
                const open = !premiumLocked && isOpen(lesson);
                const current = open && !completed;
                return (
                  <motion.div key={lesson.id} style={{ x: OFFSETS[i % OFFSETS.length] }} className="flex flex-col items-center">
                    <motion.button
                      whileTap={open ? { scale: 0.92 } : undefined}
                      disabled={!open}
                      onClick={() => setActive({ lesson, module: m })}
                      aria-label={lesson.title}
                      className={`relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-b-[6px] text-slate-900 transition ${
                        completed
                          ? 'border-gold-deep bg-gold'
                          : open
                            ? `${c.bg} border-black/25 ring-8 ${c.ring}`
                            : 'border-line bg-surface-2 text-muted'
                      }`}
                    >
                      {current && (
                        <motion.span
                          className={`absolute inset-0 rounded-full ${c.bg}`}
                          animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6 }}
                        />
                      )}
                      {completed ? <Check size={30} strokeWidth={3.5} /> : open ? <Star size={28} className="fill-slate-900" /> : <Lock size={24} />}
                    </motion.button>
                    <p className={`mt-1.5 max-w-[10rem] text-center text-xs font-bold ${open ? 'text-ink' : 'text-muted'}`}>{lesson.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {premiumLocked && (
              <div className="card mt-4 p-4 text-center">
                <Lock size={20} className="mx-auto text-sky" />
                <p className="mt-1 text-sm font-bold">Module Premium</p>
                <p className="text-xs text-muted">Débloque-le avec tes KaziCoins ou via le Pack Agri-Business.</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={unlockModule4} className="btn-primary px-2 text-xs">
                    {COIN_ITEMS.module4.price} KaziCoins
                  </button>
                  <button onClick={() => goTo('profile', 'pack-agri_import')} className="btn-ghost px-2 text-xs">
                    Pack Agri · 5 $
                  </button>
                </div>
              </div>
            )}
          </section>
        );
      })}

      {active && <LessonPlayer lesson={active.lesson} moduleColor={active.module.color} onClose={() => setActive(null)} />}
    </div>
  );
}
