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
  Languages,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { LEGAL_LINKS } from '../../config/legal';
import { COIN_ITEMS, PREMIUM_PACKS, buildCheckoutUrl, type PremiumPack } from '../../config/shop';
import { BADGES, displayStreak, levelInfo } from '../../lib/progress';
import { isSupabaseConfigured } from '../../lib/supabase';
import { openAuth } from '../../lib/ui';
import { usePlayer } from '../../state/PlayerContext';
import BuyerSheet, { type BuyerInfo } from './BuyerSheet';
import InviteCard from './InviteCard';
import Leaderboard from './Leaderboard';
import { L, LANG, LOCALE, setLang } from '../../i18n';

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
    notify(`${def.emoji} ${def.name} ${L('ajouté !', 'added!')}`, 'success');
  };

  const unlockModule4 = () => {
    if (!spendCoins(COIN_ITEMS.module4.price)) return;
    update((p) => ({ ...p, coinUnlocks: [...p.coinUnlocks, 'module4'] }));
    notify(L('🚀 Module 4 débloqué !', '🚀 Module 4 unlocked!'), 'gold');
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
      return openAuth('buy');
    }
    if (isSupabaseConfigured) return setBuying(pack); // formulaire acheteur, puis checkout serveur
    fallbackLink(pack, L('Paiement non configuré.', 'Payment is not configured.'));
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
              <MapPin size={12} /> {profile.city || L('Ville inconnue', 'Unknown city')}
            </p>
            <p className="mt-1 text-xs font-bold text-gold">
              {L('Niveau', 'Level')} {lvl.level} · {lvl.title}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald" style={{ width: `${lvl.progress * 100}%` }} />
          </div>
          <p className="mt-1 text-right text-[11px] text-muted">{L(`${lvl.toNext} XP avant le niveau ${lvl.level + 1}`, `${lvl.toNext} XP to level ${lvl.level + 1}`)}</p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <Stat icon={<Flame size={16} className="fill-gold text-gold" />} value={streak} label="Streak" />
            <Stat icon={<Sparkles size={16} className="text-gold" />} value={profile.xp} label="XP" />
            <Stat icon={<Coins size={16} className="text-gold" />} value={profile.kazicoins} label="Coins" />
            <Stat icon={<Trophy size={16} className="text-gold" />} value={profile.stats.bestScore} label={L('Record', 'Best')} />
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            {L(
              `🛡️ ${profile.streakShields} bouclier(s) · ⚡ ${profile.energyRefills} recharge(s) · ${profile.stats.runsWon}/${profile.stats.runsPlayed} mois réussis`,
              `🛡️ ${profile.streakShields} shield(s) · ⚡ ${profile.energyRefills} refill(s) · ${profile.stats.runsWon}/${profile.stats.runsPlayed} months completed`,
            )}
          </p>
        </div>
      </section>

      {/* Compte */}
      <section className="card flex items-center gap-3 p-4">
        {isCloud ? <Cloud size={20} className="shrink-0 text-emerald" /> : <CloudOff size={20} className="shrink-0 text-muted" />}
        <div className="min-w-0 flex-1 text-sm">
          {isCloud ? (
            <>
              <p className="font-bold">{L('Progression synchronisée', 'Progress synced')}</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </>
          ) : (
            <>
              <p className="font-bold">{L('Mode invité · démo locale', 'Guest mode · local demo')}</p>
              <p className="text-xs text-muted">{isSupabaseConfigured ? L('Sauvegardé uniquement sur ce téléphone.', 'Saved on this phone only.') : L('Supabase non configuré : tout reste sur cet appareil.', 'Supabase is not configured: everything stays on this device.')}</p>
            </>
          )}
        </div>
        {isSupabaseConfigured &&
          (user ? (
            <button onClick={() => void signOut()} className="btn-ghost px-3 py-2 text-xs" aria-label={L('Se déconnecter', 'Log out')}>
              <LogOut size={14} />
            </button>
          ) : (
            <button onClick={() => openAuth()} className="btn-primary px-3 py-2 text-xs">
              {L('Créer un compte', 'Create an account')}
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
        <h2 className="mb-2 px-1 text-lg font-extrabold">{L('Boutique KaziCoins', 'KaziCoins shop')}</h2>
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
      <section id="packs" className="scroll-mt-24">
        <h2 className="mb-1 px-1 text-lg font-extrabold">{L('Packs Premium', 'Premium Packs')}</h2>
        <p className="mb-2 px-1 text-xs text-muted">{L('Paiement unique, sans abonnement · le pack reste à toi, sur tous tes téléphones.', 'One-time payment, no subscription · the pack stays yours, on all your phones.')}</p>
        <div className="space-y-3">
          {PREMIUM_PACKS.map((pack) => {
            const owned = !pack.external && hasPack(pack.id);
            return (
              <div
                key={pack.id}
                id={`pack-${pack.id}`}
                className={`card scroll-mt-24 overflow-hidden ${pack.badge && !owned ? 'border-gold/70 ring-1 ring-gold/30' : pack.external ? 'border-emerald/50' : ''}`}
              >
                {pack.badge && !owned && (
                  <p className="bg-gold px-4 py-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-slate-900">{pack.badge}</p>
                )}
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
                      <Check size={16} /> {L('Débloqué', 'Unlocked')}
                    </p>
                  ) : (
                    <button
                      onClick={() => openPack(pack)}
                      disabled={!canBuy(pack) || paying !== null}
                      className={`${pack.external ? 'btn-emerald' : 'btn-primary'} w-full py-2.5`}
                    >
                      {paying === pack.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {L('Ouverture du paiement…', 'Opening payment…')}
                        </>
                      ) : canBuy(pack) ? (
                        <>
                          {pack.external ? L('Obtenir les modèles', 'Get the templates') : L('Débloquer', 'Unlock')} · {pack.price} <ExternalLink size={14} />
                        </>
                      ) : (
                        L('Paiement bientôt disponible', 'Payment coming soon')
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted">
          {L(
            'Paiement sécurisé sur Chariow (moyens de paiement proposés selon ton pays). Ton pack est activé sur ton compte dès confirmation du paiement.',
            'Secure payment on Chariow (payment methods depend on your country). Your pack is activated on your account as soon as payment is confirmed.',
          )}
        </p>
        {user && (
          <button onClick={() => void restore()} disabled={restoring} className="btn-ghost mt-2 w-full py-2 text-xs">
            {restoring ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} {L('Restaurer mes achats', 'Restore my purchases')}
          </button>
        )}
      </section>

      <InviteCard onSignup={() => openAuth('referral')} />

      <Leaderboard onSignup={() => openAuth('leaderboard')} />

      {/* Réglages */}
      <section className="card space-y-2 p-4">
        <h2 className="font-extrabold">{L('Réglages', 'Settings')}</h2>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-2/50 px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Languages size={16} /> {L('Langue', 'Language')}
          </span>
          <div className="flex rounded-xl bg-surface-2 p-0.5 text-xs font-bold" role="group" aria-label={L('Langue', 'Language')}>
            {(['fr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLang(lang)}
                aria-pressed={LANG === lang}
                className={`rounded-lg px-3 py-1 ${LANG === lang ? 'bg-gold text-slate-900' : 'text-muted'}`}
              >
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => update((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))} className="btn-ghost w-full justify-start">
          {profile.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}{' '}
          {profile.theme === 'dark' ? L('Thème clair', 'Light theme') : L('Thème sombre', 'Dark theme')}
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
              {L('Confirmer', 'Confirm')}
            </button>
            <button onClick={() => setConfirmReset(false)} className="btn-ghost">
              {L('Annuler', 'Cancel')}
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="btn-ghost w-full justify-start text-coral">
            <RotateCcw size={16} /> {L('Réinitialiser ma progression', 'Reset my progress')}
          </button>
        )}
        {user &&
          (confirmDelete ? (
            <div className="space-y-2 rounded-2xl bg-coral/10 p-3">
              <p className="text-xs text-ink/85">
                {L(
                  'Ton compte, ta progression en ligne et ta place au classement seront supprimés définitivement. Les packs achetés seront perdus.',
                  'Your account, your online progress and your leaderboard place will be permanently deleted. Purchased packs will be lost.',
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => void removeAccount()} className="btn bg-coral text-white">
                  {L('Supprimer', 'Delete')}
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn-ghost">
                  {L('Annuler', 'Cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost w-full justify-start text-coral">
              <Trash2 size={16} /> {L('Supprimer mon compte', 'Delete my account')}
            </button>
          ))}
        <div className="flex gap-2 pt-1">
          <a href={LEGAL_LINKS.terms} target="_blank" rel="noopener" className="btn-ghost flex-1 py-2 text-xs">
            <FileText size={14} /> {L('CGU / CGV', 'Terms')}
          </a>
          <a href={LEGAL_LINKS.privacy} target="_blank" rel="noopener" className="btn-ghost flex-1 py-2 text-xs">
            <Shield size={14} /> {L('Confidentialité', 'Privacy')}
          </a>
        </div>
      </section>

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
      <p className="mt-0.5 text-base font-extrabold">{value.toLocaleString(LOCALE)}</p>
      <p className="text-[10px] font-bold uppercase text-muted">{label}</p>
    </div>
  );
}
