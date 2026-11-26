import { motion } from 'framer-motion';
import { CalendarDays, Cloud, Play, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSector, isSectorUnlocked, sectorUnlockKey } from '../../config/sectors';
import { ENERGY_REFILL_AMOUNT } from '../../config/shop';
import {
  MAX_DAYS,
  NEW_RUN,
  SECOND_CHANCE_COST,
  advance,
  applyBoost,
  computeScore,
  getCard,
  newlyLowGauges,
  resolveChoice,
  secondChance,
  startRun,
  type RunState,
} from '../../lib/game';
import { playAlert, playChime, playGameOver, playSuccess } from '../../lib/sound';
import { loadJSON, saveJSON, todayISO } from '../../lib/storage';
import { isSupabaseConfigured } from '../../lib/supabase';
import { usePlayer } from '../../state/PlayerContext';
import type { Effects, SectorId } from '../../types';
import EndScreen from './EndScreen';
import GaugeBar from './GaugeBar';
import OutcomePanel from './OutcomePanel';
import ScenarioSwipe from './ScenarioSwipe';
import SectorPicker from './SectorPicker';

function loadRun(): RunState {
  const r = loadJSON<RunState>('run', NEW_RUN);
  // Partie corrompue ou carte supprimée du contenu : on repart proprement.
  if (!r || !r.gauges || (r.status === 'playing' && !getCard(r.cardId))) return NEW_RUN;
  return r;
}

export default function PlayTab() {
  const { profile, update, reward, spendCoins, recordActivity, hasPack, notify, user, shareInvite } = usePlayer();
  const [run, setRun] = useState<RunState>(loadRun);
  const [previewChoice, setPreviewChoice] = useState<'a' | 'b' | null>(null);
  const [savedSector, setSector] = useState<SectorId | null>(() => loadJSON<SectorId | null>('sector', null));
  const packs = profile.unlockedPacks;
  const card = getCard(run.cardId);
  // Un secteur sauvegardé mais plus accessible (ex. déconnexion d'un compte avec pack) retombe sur la boutique.
  const sector = savedSector && isSectorUnlocked(profile, savedSector) ? savedSector : null;
  const runSector = getSector(run.sector);

  useEffect(() => saveJSON('run', run), [run]);
  useEffect(() => saveJSON('sector', savedSector), [savedSector]);

  const begin = () => {
    setRun(startRun(packs, sector));
    setPreviewChoice(null);
  };

  const unlockSector = (id: SectorId) => {
    const def = getSector(id);
    if (!def || !spendCoins(def.coinPrice)) return;
    update((p) => ({ ...p, coinUnlocks: [...p.coinUnlocks, sectorUnlockKey(id)] }));
    setSector(id);
    notify(`${def.emoji} Secteur débloqué : ${def.name}`, 'gold');
  };

  const choose = (c: 'a' | 'b') => {
    const next = resolveChoice(run, c);
    const res = next.lastResult!;
    if (!res.failed.length && newlyLowGauges(run.gauges, next.gauges).length) playAlert();
    else if (res.coins > 0) playChime();
    setRun(next);
    setPreviewChoice(null);
    reward(res.xp, res.coins);
    recordActivity();
    update((p) => ({
      ...p,
      stats: {
        ...p.stats,
        decisions: p.stats.decisions + 1,
        bestDay: Math.max(p.stats.bestDay, res.failed.length ? run.day - 1 : run.day),
        bestCash: Math.max(p.stats.bestCash, Math.round(next.gauges.cash)),
        bestReputation: Math.max(p.stats.bestReputation, next.gauges.reputation),
      },
    }));
  };

  const proceed = () => {
    const next = advance(run, packs);
    if (next.status === 'gameover' || next.status === 'victory') {
      const won = next.status === 'victory';
      const score = computeScore(next);
      if (won) playSuccess();
      else playGameOver();
      if (won) reward(100, 50);
      update((p) => ({
        ...p,
        stats: {
          ...p.stats,
          runsPlayed: p.stats.runsPlayed + 1,
          runsWon: p.stats.runsWon + (won ? 1 : 0),
          bestScore: Math.max(p.stats.bestScore, score),
        },
      }));
    }
    setRun(next);
  };

  const handleSecondChance = () => {
    const unlimited = hasPack('unlimited_lives');
    if (!unlimited && !spendCoins(SECOND_CHANCE_COST)) return;
    // La partie avait été comptée comme terminée : on annule ce décompte.
    update((p) => ({ ...p, stats: { ...p.stats, runsPlayed: Math.max(0, p.stats.runsPlayed - 1) } }));
    setRun(secondChance(run, packs));
    notify('❤️ Seconde chance ! Ne refais pas la même erreur.', 'success');
  };

  const handleEnergyRefill = () => {
    if (profile.energyRefills <= 0) return;
    update((p) => ({ ...p, energyRefills: p.energyRefills - 1 }));
    setRun((r) => applyBoost(r, { energy: ENERGY_REFILL_AMOUNT }));
    notify(`⚡ +${ENERGY_REFILL_AMOUNT} énergie`, 'success');
  };

  const preview: Effects | null = card && previewChoice ? card[previewChoice].effects : null;

  // ───────── Intro ─────────
  if (run.status === 'intro') {
    return (
      <div className="flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          <div className="bg-gradient-to-br from-gold/25 via-transparent to-emerald/15 p-6">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">Simulation terrain</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight">
              30 jours pour devenir <span className="text-gold">KaziBoss</span>
            </h1>
            <p className="mt-2 text-[15px] text-ink/80">
              Tu ouvres ta boutique avec <b>100 $</b>. Chaque jour, une décision. Garde tes 4 jauges au-dessus de zéro… et apprends de chaque choix.
            </p>
          </div>
          <div className="px-5 pb-5">
            <GaugeBar gauges={NEW_RUN.gauges} />
            <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
              <li>👈 Glisse à gauche pour le choix A, 👉 à droite pour le B.</li>
              <li>● Un point au-dessus d'une jauge = elle va bouger (gros point = gros impact).</li>
              <li>🛒 Chaque soir, ton stock se vend selon ta réputation.</li>
            </ul>
          </div>
        </motion.div>

        {profile.stats.bestScore > 0 && (
          <p className="text-center text-sm text-muted">
            Meilleur score : <b className="text-gold">{profile.stats.bestScore}</b> · Meilleure journée : J{profile.stats.bestDay}
          </p>
        )}

        <SectorPicker selected={sector} onSelect={setSector} onUnlock={unlockSector} />

        <button onClick={begin} className="btn-primary py-4 text-base">
          <Play size={20} className="fill-slate-900" /> {sector ? `Lancer : ${getSector(sector)?.name}` : 'Ouvrir ma boutique'}
        </button>

        {isSupabaseConfigured && !user && (
          <p className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-3 text-xs text-muted">
            <Cloud size={16} className="mt-0.5 shrink-0 text-sky" />
            Mode invité : ta progression est sauvegardée sur ce téléphone. Crée un compte (onglet Boutique) pour garder ton streak et apparaître dans le classement.
          </p>
        )}
      </div>
    );
  }

  // ───────── Fin de partie ─────────
  if (run.status === 'gameover' || run.status === 'victory') {
    return (
      <EndScreen
        run={run}
        unlimitedLives={hasPack('unlimited_lives')}
        coins={profile.kazicoins}
        onReplay={begin}
        onSecondChance={handleSecondChance}
        onShare={(score) => void shareInvite(score)}
        shareBonusAvailable={profile.lastShareDate !== todayISO()}
      />
    );
  }

  // ───────── Partie en cours ─────────
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-extrabold">
          <CalendarDays size={16} className="text-gold" /> Jour {run.day}
          <span className="text-muted">/ {MAX_DAYS}</span>
          {runSector && (
            <span className="chip text-[11px]" title={runSector.name}>
              {runSector.emoji} {runSector.name.split(' ')[0]}
            </span>
          )}
        </p>
        {run.status === 'playing' && profile.energyRefills > 0 && run.gauges.energy < 100 && (
          <button onClick={handleEnergyRefill} className="chip text-gold hover:bg-surface-2">
            <Zap size={13} className="fill-gold" /> Recharge ({profile.energyRefills})
          </button>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div className="h-full rounded-full bg-gold" animate={{ width: `${(run.day / MAX_DAYS) * 100}%` }} />
      </div>

      <GaugeBar gauges={run.gauges} preview={run.status === 'playing' ? preview : null} delta={run.status === 'outcome' ? run.lastResult?.delta : null} />

      {/* Pas d'AnimatePresence ici : la carte s'en va déjà toute seule en glissant et chaque
          panneau anime sa propre entrée. Avec AnimatePresence mode="wait", la fin de l'animation
          de sortie n'était parfois jamais signalée : écran vide jusqu'au changement d'onglet. */}
      {run.status === 'playing' && card && (
        <ScenarioSwipe key={card.id} card={card} onChoose={choose} onPreview={setPreviewChoice} />
      )}
      {run.status === 'outcome' && <OutcomePanel key={`outcome-${run.day}`} run={run} onContinue={proceed} />}
    </div>
  );
}
