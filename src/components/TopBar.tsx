import { Coins, Flame, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { displayStreak, levelInfo } from '../lib/progress';
import { isSoundOn, onSoundChange, playChime, setSoundOn } from '../lib/sound';
import { usePlayer } from '../state/PlayerContext';
import { L } from '../i18n';

export default function TopBar({ onOpenProfile }: { onOpenProfile: () => void }) {
  const { profile } = usePlayer();
  const lvl = levelInfo(profile.xp);
  const streak = displayStreak(profile);
  const [sound, setSound] = useState(isSoundOn);

  useEffect(() => onSoundChange(setSound), []);

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    if (next) playChime();
  };

  return (
    <header className="pt-safe sticky top-0 z-20 bg-bg/90 px-4 pb-2 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex min-w-0 items-center gap-2">
          <img src="/icons/icon.svg" alt="" className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0 leading-tight">
            <p className="text-lg font-extrabold tracking-tight">
              Kazi<span className="text-gold">Boss</span>
            </p>
            <p className="truncate text-[11px] font-semibold text-muted" title={lvl.title}>
              {L('Niv.', 'Lvl')} {lvl.level} · {lvl.title}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="rounded-full p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
            aria-label={sound ? L('Couper le son', 'Mute sound') : L('Activer le son', 'Turn sound on')}
            aria-pressed={sound}
            title={sound ? L('Son activé', 'Sound on') : L('Son coupé', 'Sound off')}
          >
            {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button onClick={onOpenProfile} className="flex items-center gap-1.5" aria-label={L('Voir le profil', 'View profile')}>
            <span className={`chip ${streak > 0 ? 'text-gold' : 'text-muted'}`}>
              <Flame size={14} className={streak > 0 ? 'fill-gold' : ''} /> {streak}
            </span>
            <span className="chip text-gold">
              <Coins size={14} /> {profile.kazicoins}
            </span>
          </button>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald transition-all duration-700" style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
      </div>
    </header>
  );
}
