import {
  Check,
  Cloud,
  CloudOff,
  Coins,
  ExternalLink,
  FileText,
  Flame,
  Loader2,
  LogOut,
  MapPin,
  Moon,
  RefreshCw,
  RotateCcw,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { LEGAL_LINKS } from '../../config/legal';
import { COIN_ITEMS, PREMIUM_PACKS, buildCheckoutUrl, type PremiumPack } from '../../config/shop';
import { BADGES, displayStreak, levelInfo } from '../../lib/progress';
import { isSupabaseConfigured } from '../../lib/supabase';
import { usePlayer } from '../../state/PlayerContext';
import AuthSheet from './AuthSheet';
import BuyerSheet, { type BuyerInfo } from './BuyerSheet';
import InviteCard from './InviteCard';
import Leaderboard from './Leaderboard';

export default function ProfileTab() {
  const {
    profile,
    update,
    spendCoins,
    notify,
    user,
    email,
    isCloud,
    signOut,
    resetProgress,
    hasPack,
    module4Unlocked,
    checkout,
    restorePurchases,
    deleteAccount,
  } = usePlayer();
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [paying, setPaying] = useState<PremiumPack['id'] | null>(null);
  const [buying, setBuying] = useState<PremiumPack | null>(null);
  const [restoring, setRestoring] = useState(false);
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

  /** Un pack est achetable si le paiement serveur (Supabase) ou un lien Chariow direct est configuré. */
  const canBuy = (pack: PremiumPack) => isSupabaseConfigured || Boolean(pack.url);

  const openPack = (pack: PremiumPack) => {
    // Ressources externes : livrées par Chariow, pas besoin de compte KaziBoss.
    if (pack.external && !email) {
      if (pack.url) window.open(pack.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!email) {
      setAuthOpen(true);
      return notify('Crée un compte pour lier ton achat à ta progression.', 'info');
    }
    if (isSupabaseConfigured) return setBuying(pack); // formulaire acheteur, puis checkout serveur
    fallbackLink(pack, 'Paiement non configuré.');
  };

  /** Secours : lien Chariow direct. L'achat sera rattaché via l'email (« Restaurer mes achats »). */
  const fallbackLink = (pack: PremiumPack, error: string) => {
    if (pack.url && email) window.open(buildCheckoutUrl(pack.url, email), '_blank', 'noopener,noreferrer');
    else notify(error, 'error');
  };

  const confirmPurchase = async (buyer: BuyerInfo) => {
    if (!buying) return;
    const pack = buying;
    setPaying(pack.id);
    const res = await checkout(pack.id, buyer);
    setPaying(null);
    if (!res.error && !res.info) return; // redirection vers Chariow en cours
    setBuying(null);
    if (res.info) notify(res.info, 'success');
    else fallbackLink(pack, res.error!);
  };

  const restore = async () => {
    setRestoring(true);
    await restorePurchases();
    setRestoring(false);
  };

  const removeAccount = async () => {
    const res = await deleteAccount();
    setConfirmDelete(false);
    if (res.error) notify(res.error, 'error');
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
                    <button
                      onClick={() => openPack(pack)}
                      disabled={!canBuy(pack) || paying !== null}
                      className={`${pack.external ? 'btn-emerald' : 'btn-primary'} w-full py-2.5`}
                    >
                      {paying === pack.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Ouverture du paiement…
                        </>
                      ) : canBuy(pack) ? (
                        <>
                          {pack.external ? 'Obtenir les modèles' : 'Débloquer'} · {pack.price} <ExternalLink size={14} />
                        </>
                      ) : (
                        'Paiement bientôt disponible'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted">
          Paiement sécurisé sur Chariow (moyens de paiement proposés selon ton pays). Ton pack est activé sur ton compte dès confirmation du paiement.
        </p>
        {user && (
          <button onClick={() => void restore()} disabled={restoring} className="btn-ghost mt-2 w-full py-2 text-xs">
            {restoring ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Restaurer mes achats
          </button>
        )}
      </section>

      <InviteCard onSignup={() => setAuthOpen(true)} />

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
        {user &&
          (confirmDelete ? (
            <div className="space-y-2 rounded-2xl bg-coral/10 p-3">
              <p className="text-xs text-ink/85">
                Ton compte, ta progression en ligne et ta place au classement seront supprimés définitivement. Les packs achetés seront perdus.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => void removeAccount()} className="btn bg-coral text-white">
                  Supprimer
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn-ghost">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost w-full justify-start text-coral">
              <Trash2 size={16} /> Supprimer mon compte
            </button>
          ))}
        <div className="flex gap-2 pt-1">
          <a href={LEGAL_LINKS.terms} target="_blank" rel="noopener" className="btn-ghost flex-1 py-2 text-xs">
            <FileText size={14} /> CGU / CGV
          </a>
          <a href={LEGAL_LINKS.privacy} target="_blank" rel="noopener" className="btn-ghost flex-1 py-2 text-xs">
            <Shield size={14} /> Confidentialité
          </a>
        </div>
      </section>

      <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
      <BuyerSheet
        key={buying?.id ?? 'none'}
        open={buying !== null}
        packName={buying?.name ?? ''}
        price={buying?.price ?? ''}
        onClose={() => setBuying(null)}
        onConfirm={confirmPurchase}
      />
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
