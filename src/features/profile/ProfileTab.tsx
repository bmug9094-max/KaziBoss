import { Check, Cloud, CloudOff, Coins, ExternalLink, Flame, LogOut, MapPin, Moon, RotateCcw, Sparkles, Sun, Trophy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { COIN_ITEMS, PREMIUM_PACKS, buildCheckoutUrl, type PremiumPack } from '../../config/shop';
import { BADGES, displayStreak, levelInfo } from '../../lib/progress';
import { isSupabaseConfigured } from '../../lib/supabase';
import { usePlayer } from '../../state/PlayerContext';
import AuthSheet from './AuthSheet';
import Leaderboard from './Leaderboard';

export default function ProfileTab() {
  const { profile, update, spendCoins, notify, user, email, isCloud, signOut, resetProgress, hasPack, module4Unlocked } = usePlayer();
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const lvl = levelInfo(profile.xp);
  const streak = displayStreak(profile);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const buy = (item: 'streakShield' | 'energyRefill') => {
    const def = COIN_ITEMS[item];
    if (!spendCoins(def.price)) return;
    update((p) => (item === 'streakShield' ? { ...p, streakShields: p.streakShields + 1 } : { ...p, energyRefills: p.energyRefills + 1 }));
    notify(`${def.emoji} ${def.name} ajouté !`, 'success');
  };

  const unlockModule4 = () => {
    if (!spendCoins(COIN_ITEMS.module4.price)) return;
    update((p) => ({ ...p, coinUnlocks: [...p.coinUnlocks, 'module4'] }));
    notify('🚀 Module 4 débloqué !', 'gold');
  };

  const openPack = (pack: PremiumPack) => {
    if (!pack.url) return notify('Lien de paiement non configuré (voir .env).', 'error');
    if (!email) {
      setAuthOpen(true);
      return notify('Crée un compte pour lier ton achat à ta progression.', 'info');
    }
    window.open(buildCheckoutUrl(pack.url, email), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Profil */}
      <section className="card overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-br from-gold/20 via-transparent to-emerald/10 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-2xl font-extrabold text-slate-900">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-extrabold">{profile.username}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} /> {profile.city || 'Ville inconnue'}
            </p>
            <p className="mt-1 text-xs font-bold text-gold">
              Niveau {lvl.level} · {lvl.title}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald" style={{ width: `${lvl.progress * 100}%` }} />
          </div>
          <p className="mt-1 text-right text-[11px] text-muted">{lvl.toNext} XP avant le niveau {lvl.level + 1}</p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <Stat icon={<Flame size={16} className="fill-gold text-gold" />} value={streak} label="Streak" />
            <Stat icon={<Sparkles size={16} className="text-gold" />} value={profile.xp} label="XP" />
            <Stat icon={<Coins size={16} className="text-gold" />} value={profile.kazicoins} label="Coins" />
            <Stat icon={<Trophy size={16} className="text-gold" />} value={profile.stats.bestScore} label="Record" />
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            🛡️ {profile.streakShields} bouclier(s) · ⚡ {profile.energyRefills} recharge(s) · {profile.stats.runsWon}/{profile.stats.runsPlayed} mois réussis
          </p>
        </div>
      </section>

      {/* Compte */}
      <section className="card flex items-center gap-3 p-4">
        {isCloud ? <Cloud size={20} className="shrink-0 text-emerald" /> : <CloudOff size={20} className="shrink-0 text-muted" />}
        <div className="min-w-0 flex-1 text-sm">
          {isCloud ? (
            <>
              <p className="font-bold">Progression synchronisée</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </>
          ) : (
            <>
              <p className="font-bold">Mode invité · démo locale</p>
              <p className="text-xs text-muted">{isSupabaseConfigured ? 'Sauvegardé uniquement sur ce téléphone.' : 'Supabase non configuré : tout reste sur cet appareil.'}</p>
            </>
          )}
        </div>
        {isSupabaseConfigured &&
          (user ? (
            <button onClick={() => void signOut()} className="btn-ghost px-3 py-2 text-xs" aria-label="Se déconnecter">
              <LogOut size={14} />
            </button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="btn-primary px-3 py-2 text-xs">
              Créer un compte
            </button>
          ))}
      </section>

      {/* Badges */}
      <section className="card p-4">
        <h2 className="font-extrabold">
          Badges <span className="text-sm text-muted">{profile.badges.length}/{BADGES.length}</span>
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {BADGES.map((b) => {
            const has = profile.badges.includes(b.id);
            return (
              <div key={b.id} title={b.description} className={`flex flex-col items-center rounded-2xl p-2 text-center ${has ? 'bg-gold/15' : 'bg-surface-2/50 opacity-45 grayscale'}`}>
                <span className="text-2xl">{b.emoji}</span>
                <span className="mt-1 text-[10px] font-bold leading-tight">{b.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Boutique KaziCoins */}
      <section>
        <h2 className="mb-2 px-1 text-lg font-extrabold">Boutique KaziCoins</h2>
        <div className="grid grid-cols-2 gap-3">
          {(['streakShield', 'energyRefill'] as const).map((k) => {
            const it = COIN_ITEMS[k];
            return (
              <div key={k} className="card flex flex-col p-4">
                <span className="text-3xl">{it.emoji}</span>
                <p className="mt-2 text-sm font-extrabold">{it.name}</p>
                <p className="flex-1 text-xs text-muted">{it.description}</p>
                <button onClick={() => buy(k)} disabled={profile.kazicoins < it.price} className="btn-primary mt-3 py-2 text-xs">
                  <Coins size={14} /> {it.price}
                </button>
              </div>
            );
          })}
        </div>
        {!module4Unlocked && (
          <div className="card mt-3 flex items-center gap-3 p-4">
            <span className="text-3xl">{COIN_ITEMS.module4.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold">{COIN_ITEMS.module4.name}</p>
              <p className="text-xs text-muted">{COIN_ITEMS.module4.description}</p>
            </div>
            <button onClick={unlockModule4} disabled={profile.kazicoins < COIN_ITEMS.module4.price} className="btn-primary px-3 py-2 text-xs">
              <Coins size={14} /> {COIN_ITEMS.module4.price}
            </button>
          </div>
        )}
      </section>

      {/* Packs premium */}
      <section>
        <h2 className="mb-2 px-1 text-lg font-extrabold">Packs Premium</h2>
        <div className="space-y-3">
          {PREMIUM_PACKS.map((pack) => {
            const owned = !pack.external && hasPack(pack.id);
            return (
              <div key={pack.id} className={`card overflow-hidden ${pack.external ? 'border-emerald/50' : ''}`}>
                <div className="flex gap-3 p-4">
                  <span className="text-4xl">{pack.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold leading-tight">{pack.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{pack.tagline}</p>
                    <ul className="mt-2 space-y-0.5">
                      {pack.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5 text-xs">
                          <Check size={13} className="mt-0.5 shrink-0 text-emerald" /> {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-line/70 px-4 py-3">
                  {owned ? (
                    <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-emerald">
                      <Check size={16} /> Débloqué
                    </p>
                  ) : (
                    <button onClick={() => openPack(pack)} disabled={!pack.url} className={`${pack.external ? 'btn-emerald' : 'btn-primary'} w-full py-2.5`}>
                      {pack.url ? (
                        <>
                          {pack.external ? 'Obtenir les modèles' : 'Débloquer'} · {pack.price} <ExternalLink size={14} />
                        </>
                      ) : (
                        'Lien Chariow à configurer'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted">Paiement sécurisé sur Chariow. Ton pack est activé sur ton compte dès confirmation du paiement.</p>
      </section>

      <Leaderboard onSignup={() => setAuthOpen(true)} />

      {/* Réglages */}
      <section className="card space-y-2 p-4">
        <h2 className="font-extrabold">Réglages</h2>
        <button onClick={() => update((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))} className="btn-ghost w-full justify-start">
          {profile.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Thème {profile.theme === 'dark' ? 'clair' : 'sombre'}
        </button>
        {confirmReset ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="btn bg-coral text-white"
            >
              Confirmer
            </button>
            <button onClick={() => setConfirmReset(false)} className="btn-ghost">
              Annuler
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="btn-ghost w-full justify-start text-coral">
            <RotateCcw size={16} /> Réinitialiser ma progression
          </button>
        )}
      </section>

      <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-surface-2/60 px-1 py-2">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-0.5 text-base font-extrabold">{value.toLocaleString('fr-FR')}</p>
      <p className="text-[10px] font-bold uppercase text-muted">{label}</p>
    </div>
  );
}
