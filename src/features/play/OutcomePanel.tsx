import { motion } from 'framer-motion';
import { ArrowRight, Coins, Lightbulb, ShoppingBag, Sparkles } from 'lucide-react';
import { GAUGE_KEYS, GAUGE_META, MAX_DAYS, getCard, type RunState } from '../../lib/game';
import { L, usd } from '../../i18n';

export default function OutcomePanel({ run, onContinue }: { run: RunState; onContinue: () => void }) {
  const res = run.lastResult;
  const card = getCard(res?.cardId ?? null);
  if (!res || !card) return null;
  const choice = card[res.choice];
  const failing = res.failed.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex flex-col gap-3"
    >
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">
          {L('Jour', 'Day')} {run.day} · {L('Tu as choisi', 'You chose')} {res.choice.toUpperCase()}
        </p>
        <p className="mt-1 text-lg font-extrabold leading-snug">{choice.label}</p>
        <p className="mt-2 text-[15px] text-ink/85">{choice.outcome}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {GAUGE_KEYS.map((k) => {
            const d = res.choiceEffects[k] ?? 0;
            if (!d) return null;
            return (
              <motion.span
                key={k}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`chip ${d > 0 ? 'text-emerald' : 'text-coral'}`}
              >
                {GAUGE_META[k].label} {d > 0 ? '+' : ''}
                {k === 'cash' ? usd(d) : d}
              </motion.span>
            );
          })}
        </div>

        {res.sales.sold > 0 && (
          <p className="mt-3 flex items-center gap-2 rounded-2xl bg-surface-2/70 px-3 py-2 text-sm text-ink/85">
            <ShoppingBag size={16} className="text-sky" />
            {L('Ventes du jour :', "Today's sales:")} <b className="text-emerald">+{usd(res.sales.revenue)}</b>
            <span className="text-muted">(−{res.sales.sold} stock)</span>
          </p>
        )}

        <div className="mt-3 flex gap-2">
          <span className="chip text-gold">
            <Sparkles size={13} /> +{res.xp} XP
          </span>
          {res.coins > 0 && (
            <span className="chip text-gold">
              <Coins size={13} /> +{res.coins}
            </span>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.06, duration: 0.18 }}
        className="rounded-3xl border border-gold/40 bg-gold/10 p-5"
      >
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-gold">
          <Lightbulb size={16} /> {L('Leçon Terrain', 'Field Lesson')}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed">{choice.lesson}</p>
      </motion.div>

      <button onClick={onContinue} className={failing ? 'btn bg-coral text-white' : 'btn-primary'}>
        {failing ? L('Voir le bilan', 'See the review') : run.day >= MAX_DAYS ? L('Terminer le mois', 'Finish the month') : `${L('Jour', 'Day')} ${run.day + 1}`} <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
