import { motion } from 'framer-motion';
import { Crown, GraduationCap, HeartPulse, RotateCcw, Share2, Skull, TrendingDown } from 'lucide-react';
import { SHARE_DAILY_BONUS } from '../../config/shop';
import { FAILURE_ANALYSIS, GAUGE_META, SECOND_CHANCE_COST, computeScore, costliestDecisions, type RunState } from '../../lib/game';

interface Props {
  run: RunState;
  unlimitedLives: boolean;
  coins: number;
  onReplay: () => void;
  onSecondChance: () => void;
  onShare: (score: number) => void;
  shareBonusAvailable: boolean;
}

export default function EndScreen({ run, unlimitedLives, coins, onReplay, onSecondChance, onShare, shareBonusAvailable }: Props) {
  const score = computeScore(run);
  const victory = run.status === 'victory';

  if (victory) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
        <div className="card overflow-hidden text-center">
          <div className="bg-gradient-to-b from-gold/30 to-transparent px-6 pb-4 pt-8">
            <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <Crown size={64} className="mx-auto fill-gold text-gold" />
            </motion.div>
            <h2 className="mt-3 text-2xl font-extrabold">Mois réussi, KaziBoss !</h2>
            <p className="mt-1 text-sm text-muted">Tu as tenu 30 jours en gardant ta boutique debout.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 px-5 pb-5">
            <Stat label="Score" value={score} />
            <Stat label="Trésorerie" value={`${Math.round(run.gauges.cash)} $`} />
            <Stat label="XP gagnée" value={run.xpEarned} />
          </div>
          <p className="px-5 pb-5 text-sm text-ink/80">
            Bonus de fin de mois : <b className="text-gold">+100 XP · +50 KaziCoins</b>
          </p>
        </div>
        <button onClick={() => onShare(score)} className="btn-emerald">
          <Share2 size={18} /> Défier mes amis{shareBonusAvailable ? ` · +${SHARE_DAILY_BONUS} KaziCoins` : ''}
        </button>
        <button onClick={onReplay} className="btn-primary">
          <RotateCcw size={18} /> Nouveau mois
        </button>
      </motion.div>
    );
  }

  const cause = run.failed[0] ?? 'cash';
  const analysis = FAILURE_ANALYSIS[cause];
  const worst = costliestDecisions(run, cause);
  const canSecondChance = unlimitedLives || run.secondChancesUsed === 0;
  const affordable = unlimitedLives || coins >= SECOND_CHANCE_COST;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-b from-coral/25 to-transparent px-5 pb-3 pt-6 text-center">
          <Skull size={48} className="mx-auto text-coral" />
          <h2 className="mt-2 text-2xl font-extrabold">{analysis.title}</h2>
          <p className="mt-1 text-sm font-semibold text-muted">
            Jour {run.day}/30 · {GAUGE_META[cause].label} à zéro
          </p>
        </div>
        <div className="space-y-3 px-5 pb-5">
          <p className="text-[15px] leading-relaxed">{analysis.cause}</p>
          <div className="rounded-2xl bg-emerald/10 p-3 text-sm">
            <p className="font-extrabold text-emerald">Comment l'éviter</p>
            <p className="mt-1 text-ink/85">{analysis.fix}</p>
          </div>
          {worst.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-muted">
                <TrendingDown size={14} /> Tes décisions les plus coûteuses
              </p>
              <ul className="space-y-2">
                {worst.map((w) => (
                  <li key={w.day} className="flex items-start justify-between gap-3 rounded-2xl bg-surface-2/60 px-3 py-2 text-sm">
                    <span>
                      <b>J{w.day} · {w.title}</b>
                      <br />
                      <span className="text-muted">{w.label}</span>
                    </span>
                    <span className="shrink-0 font-extrabold text-coral">
                      {w.impact}
                      {cause === 'cash' ? ' $' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Stat label="Score" value={score} />
            <Stat label="Jours" value={run.day} />
            <Stat label="XP gagnée" value={run.xpEarned} />
          </div>
        </div>
      </div>

      {canSecondChance && (
        <button onClick={onSecondChance} disabled={!affordable} className="btn-emerald">
          <HeartPulse size={18} />
          {unlimitedLives ? 'Seconde chance (illimitée)' : `Seconde chance · ${SECOND_CHANCE_COST} KaziCoins`}
        </button>
      )}
      <button onClick={onReplay} className="btn-primary">
        <RotateCcw size={18} /> Rejouer un nouveau mois
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-muted">
        <GraduationCap size={14} /> Révise le module correspondant dans l'onglet Apprendre.
      </p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface-2/70 px-2 py-3 text-center">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
