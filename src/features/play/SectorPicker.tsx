import { Check, Coins, Lock } from 'lucide-react';
import { SECTORS, isSectorUnlocked } from '../../config/sectors';
import { goTo } from '../../lib/ui';
import { usePlayer } from '../../state/PlayerContext';
import type { SectorId } from '../../types';
import { L } from '../../i18n';

/** Choix du secteur d'activité pour le mois (boutique de quartier ou secteur débloqué). */
export default function SectorPicker({
  selected,
  onSelect,
  onUnlock,
}: {
  selected: SectorId | null;
  onSelect: (id: SectorId | null) => void;
  onUnlock: (id: SectorId) => void;
}) {
  const { profile } = usePlayer();

  return (
    <section>
      <h2 className="mb-2 px-1 text-lg font-extrabold">{L('Ton secteur ce mois-ci', 'Your sector this month')}</h2>
      <div className="space-y-2">
        <Option
          emoji="🏪"
          name={L('Boutique de quartier', 'Neighbourhood shop')}
          tagline={L('Le classique : stock, clients, famille et imprévus.', 'The classic: stock, customers, family and surprises.')}
          active={selected === null}
          onClick={() => onSelect(null)}
        />
        {SECTORS.map((s) => {
          const unlocked = isSectorUnlocked(profile, s.id);
          if (unlocked) {
            return (
              <Option key={s.id} emoji={s.emoji} name={s.name} tagline={s.tagline} active={selected === s.id} onClick={() => onSelect(s.id)} />
            );
          }
          return (
            <div key={s.id} className="card flex items-center gap-3 p-3 opacity-90">
              <span className="text-3xl grayscale">{s.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-sm font-extrabold">
                  <Lock size={12} className="text-muted" /> {s.name}
                </p>
                <p className="text-xs text-muted">
                  {L('Niveau', 'Level')} {s.unlockLevel}
                  {s.pack && (
                    <>
                      {' · '}
                      <button onClick={() => goTo('profile', `pack-${s.pack}`)} className="font-bold text-gold underline-offset-2 hover:underline">
                        {L('inclus dans le Pack Agri →', 'included in the Agri Pack →')}
                      </button>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => onUnlock(s.id)}
                disabled={profile.kazicoins < s.coinPrice}
                className="btn-primary shrink-0 px-3 py-2 text-xs"
                aria-label={L(`Débloquer ${s.name} pour ${s.coinPrice} KaziCoins`, `Unlock ${s.name} for ${s.coinPrice} KaziCoins`)}
              >
                <Coins size={14} /> {s.coinPrice}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Option({ emoji, name, tagline, active, onClick }: { emoji: string; name: string; tagline: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`card flex w-full items-center gap-3 border-2 p-3 text-left transition ${active ? 'border-gold' : 'border-transparent hover:border-line'}`}
    >
      <span className="text-3xl">{emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold">{name}</p>
        <p className="text-xs text-muted">{tagline}</p>
      </div>
      {active && <Check size={18} className="shrink-0 text-gold" />}
    </button>
  );
}
