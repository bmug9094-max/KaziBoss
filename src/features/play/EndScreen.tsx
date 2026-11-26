import { motion } from 'framer-motion';
import { Crown, GraduationCap, HeartPulse, RotateCcw, Share2, Skull, TrendingDown } from 'lucide-react';
import { PREMIUM_PACKS, SHARE_DAILY_BONUS } from '../../config/shop';
import { FAILURE_ANALYSIS, GAUGE_META, SECOND_CHANCE_COST, computeScore, costliestDecisions, type RunState } from '../../lib/game';
import { useState } from 'react';
import { npsDue } from '../../lib/feedback';
import { goTo } from '../../lib/ui';
import NpsCard from '../feedback/NpsCard';
import type { PackId } from '../../types';
import { L, usd } from '../../i18n';

interface Props {
  run: RunState;
  /** Nombre de mois joués (pour la question de recommandation) */
  runsPlayed: number;
  unlimitedLives: boolean;
  hasAgri: boolean;
  coins: number;
  onReplay: () => void;
  onSecondChance: () => void;
  onShare: (score: number) => void;
  shareBonusAvailable: boolean;
}

/** Encart d'offre contextuel : envoie vers la carte du pack dans la Boutique. */
function PackOffer({ id, title, text, strong }: { id: PackId; title: string; text: string; strong?: boolean }) {
  const pack = PREMIUM_PACKS.find((p) => p.id === id)!;
  return (
    <button
      onClick={() => goTo('profile', `pack-${id}`)}
      className={`flex items-center gap-3 rounded-3xl border p-4 text-left transition active:scale-[0.99] ${
        strong ? 'border-gold bg-gold/15' : 'border-line bg-surface hover:border-gold/60'
      }`}
    >
      <span className="text-3xl">{pack.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
      <span className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-xs font-extrabold text-slate-900">{pack.price}</span>
    </button>
  );
}

export default function EndScreen({ run, runsPlayed, unlimitedLives, hasAgri, coins, onReplay, onSecondChance, onShare, shareBonusAvailable }: Props) {
  const score = computeScore(run);
  const victory = run.status === 'victory';
  // Décidé une seule fois : la carte ne doit pas disparaître pendant que le joueur répond.
  const [askNps] = useState(() => npsDue(runsPlayed));
  const nps = askNps ? <NpsCard context={{ screen: 'end_of_month', victory, day: run.day, score, runsPlayed }} /> : null;

  if (victory) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
        <div className="card overflow-hidden text-center">
          <div className="bg-gradient-to-b from-gold/30 to-transparent px-6 pb-4 pt-8">
            <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <Crown size={64} className="mx-auto fill-gold text-gold" />
            </motion.div>
            <h2 className="mt-3 text-2xl font-extrabold">{L('Mois réussi, KaziBoss !', 'Month completed, KaziBoss!')}</h2>
            <p className="mt-1 text-sm text-muted">{L('Tu as tenu 30 jours en gardant ta boutique debout.', 'You lasted 30 days and kept your shop standing.')}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 px-5 pb-5">
            <Stat label="Score" value={score} />
            <Stat label={L('Trésorerie', 'Cash')} value={usd(Math.round(run.gauges.cash))} />
            <Stat label={L('XP gagnée', 'XP earned')} value={run.xpEarned} />
          </div>
          <p className="px-5 pb-5 text-sm text-ink/80">
            {L('Bonus de fin de mois :', 'End-of-month bonus:')} <b className="text-gold">+100 XP · +50 KaziCoins</b>
          </p>
        </div>
        <button onClick={() => onShare(score)} className="btn-emerald">
          <Share2 size={18} /> {L('Défier mes amis', 'Challenge my friends')}{shareBonusAvailable ? ` · +${SHARE_DAILY_BONUS} KaziCoins` : ''}
        </button>
        <button onClick={onReplay} className="btn-primary">
          <RotateCcw size={18} /> {L('Nouveau mois', 'New month')}
        </button>
        {nps}
        {!hasAgri && (
          <PackOffer
            id="agri_import"
            title={L('Prêt pour le niveau supérieur ?', 'Ready for the next level?')}
            text={L('Récolte, conteneur, douane : 22 nouveaux défis et le module Croissance & Équipe.', 'Harvest, containers, customs: 22 new challenges and the Growth & Team module.')}
          />
        )}
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
            {L('Jour', 'Day')} {run.day}/30 · {GAUGE_META[cause].label} {L('à zéro', 'at zero')}
          </p>
        </div>
        <div className="space-y-3 px-5 pb-5">
          <p className="text-[15px] leading-relaxed">{analysis.cause}</p>
          <div className="rounded-2xl bg-emerald/10 p-3 text-sm">
            <p className="font-extrabold text-emerald">{L("Comment l'éviter", 'How to avoid it')}</p>
            <p className="mt-1 text-ink/85">{analysis.fix}</p>
          </div>
          {worst.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-muted">
                <TrendingDown size={14} /> {L('Tes décisions les plus coûteuses', 'Your most costly decisions')}
              </p>
              <ul className="space-y-2">
                {worst.map((w) => (
                  <li key={w.day} className="flex items-start justify-between gap-3 rounded-2xl bg-surface-2/60 px-3 py-2 text-sm">
                    <span>
                      <b>{L('J', 'D')}{w.day} · {w.title}</b>
                      <br />
                      <span className="text-muted">{w.label}</span>
                    </span>
                    <span className="shrink-0 font-extrabold text-coral">
                      {cause === 'cash' ? usd(w.impact) : w.impact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Stat label="Score" value={score} />
            <Stat label={L('Jours', 'Days')} value={run.day} />
            <Stat label={L('XP gagnée', 'XP earned')} value={run.xpEarned} />
          </div>
        </div>
      </div>

      {canSecondChance && (
        <button onClick={onSecondChance} disabled={!affordable} className="btn-emerald">
          <HeartPulse size={18} />
          {unlimitedLives ? L('Seconde chance (illimitée)', 'Second chance (unlimited)') : `${L('Seconde chance', 'Second chance')} · ${SECOND_CHANCE_COST} KaziCoins`}
        </button>
      )}
      {!unlimitedLives && (
        <PackOffer
          id="unlimited_lives"
          strong={!affordable || !canSecondChance}
          title={!canSecondChance ? L('Plus de seconde chance ce mois-ci', 'No second chance left this month') : !affordable ? L('Pas assez de KaziCoins ?', 'Not enough KaziCoins?') : L('Ne recommence plus jamais à zéro', 'Never start from zero again')}
          text={L('Secondes chances gratuites et illimitées, à vie. Paiement unique.', 'Free, unlimited second chances for life. One-time payment.')}
        />
      )}
      <button onClick={onReplay} className="btn-primary">
        <RotateCcw size={18} /> {L('Rejouer un nouveau mois', 'Play a new month')}
      </button>
      {nps}
      <p className="flex items-center justify-center gap-2 text-center text-xs text-muted">
        <GraduationCap size={14} /> {L("Révise le module correspondant dans l'onglet Apprendre.", 'Review the matching module in the Learn tab.')}
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
