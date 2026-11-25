import { Coins, Flame } from 'lucide-react';
import { displayStreak, levelInfo } from '../lib/progress';
import { usePlayer } from '../state/PlayerContext';

export default function TopBar({ onOpenProfile }: { onOpenProfile: () => void }) {
  const { profile } = usePlayer();
  const lvl = levelInfo(profile.xp);
  const streak = displayStreak(profile);

  return (
    <header className="pt-safe sticky top-0 z-20 bg-bg/90 px-4 pb-2 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <img src="/icons/icon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight">
              Kazi<span className="text-gold">Boss</span>
            </p>
            <p className="text-[11px] font-semibold text-muted">Niv. {lvl.level} · {lvl.title}</p>
          </div>
        </div>
        <button onClick={onOpenProfile} className="flex items-center gap-1.5" aria-label="Voir le profil">
          <span className={`chip ${streak > 0 ? 'text-gold' : 'text-muted'}`}>
            <Flame size={14} className={streak > 0 ? 'fill-gold' : ''} /> {streak}
          </span>
          <span className="chip text-gold">
            <Coins size={14} /> {profile.kazicoins}
          </span>
        </button>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald transition-all duration-700" style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
      </div>
    </header>
  );
}
