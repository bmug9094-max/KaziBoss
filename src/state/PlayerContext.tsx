import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { newlyEarnedBadges, touchStreak } from '../lib/progress';
import { SHARE_DAILY_BONUS, SIGNUP_BONUS } from '../config/shop';
import { openAuth } from '../lib/ui';
import { clearReferral, inviteText, pendingReferral, shareGame, shareUrl } from '../lib/share';
import { loadJSON, removeKey, saveJSON, todayISO } from '../lib/storage';
import { isSupabaseConfigured, supabase, type ProfileRow } from '../lib/supabase';
import type { PackId, PlayerProfile, PlayerStats, ToolId } from '../types';
import { L } from '../i18n';

export const DEFAULT_STATS: PlayerStats = {
  runsPlayed: 0,
  runsWon: 0,
  bestScore: 0,
  bestDay: 0,
  bestCash: 0,
  bestReputation: 0,
  decisions: 0,
  quizCorrect: 0,
  quizAnswered: 0,
};

export const DEFAULT_PROFILE: PlayerProfile = {
  username: L('Invité', 'Guest'),
  city: 'Kinshasa',
  xp: 0,
  kazicoins: 50,
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  streakShields: 0,
  energyRefills: 1,
  unlockedPacks: [],
  coinUnlocks: [],
  completedLessons: [],
  badges: [],
  toolsUsed: [],
  stats: DEFAULT_STATS,
  theme: 'dark',
  lastShareDate: null,
  shares: 0,
  signupBonus: false,
  savePromptCount: 0,
  savePromptDate: null,
};

const STORAGE_KEY = 'profile';

export type ToastTone = 'info' | 'success' | 'error' | 'gold';
export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface AuthResult {
  error?: string;
  info?: string;
}

/** Données acheteur exigées par le checkout Chariow */
export interface CheckoutBuyer {
  firstName: string;
  lastName: string;
  /** chiffres uniquement, sans indicatif */
  phone: string;
  /** ISO 3166-1 alpha-2 */
  country: string;
}

interface PlayerContextValue {
  profile: PlayerProfile;
  user: User | null;
  email: string | null;
  isCloud: boolean;
  update: (fn: (p: PlayerProfile) => PlayerProfile) => void;
  reward: (xp: number, coins: number) => void;
  spendCoins: (amount: number) => boolean;
  recordActivity: () => void;
  markToolUsed: (tool: ToolId) => void;
  hasPack: (id: PackId) => boolean;
  module4Unlocked: boolean;
  toasts: Toast[];
  notify: (message: string, tone?: ToastTone) => void;
  signUp: (email: string, password: string, username: string, city: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  /** Connexion / inscription avec Google (redirige vers Google puis revient sur le site) */
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetProgress: () => void;
  /** Envoie l'email « mot de passe oublié » */
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  /** true quand le joueur revient du lien de réinitialisation reçu par email */
  passwordRecovery: boolean;
  updatePassword: (password: string) => Promise<AuthResult>;
  /** Relit les packs et récupère les achats faits avec l'email du compte */
  restorePurchases: (silent?: boolean) => Promise<void>;
  /** Ouvre le paiement Chariow d'un pack pour le joueur connecté */
  checkout: (pack: PackId, buyer: CheckoutBuyer) => Promise<AuthResult>;
  deleteAccount: () => Promise<AuthResult>;
  /** Code de parrainage du joueur connecté (null en invité) */
  refCode: string | null;
  /** Partage le jeu (avec le lien de parrainage) et donne le bonus du jour */
  shareInvite: (score?: number) => Promise<void>;
  referralStats: () => Promise<{ invited: number; rewarded: number } | null>;
  /** Invite un joueur invité à créer son compte (fréquence limitée) */
  maybePromptSave: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function hydrate(stored: Partial<PlayerProfile>): PlayerProfile {
  return { ...DEFAULT_PROFILE, ...stored, stats: { ...DEFAULT_STATS, ...(stored.stats ?? {}) } };
}

const union = <T,>(a: T[], b: T[]) => Array.from(new Set([...a, ...b]));

/** Champs stockés dans la colonne jsonb `progress` */
function progressOf(p: PlayerProfile) {
  return {
    bestStreak: p.bestStreak,
    streakShields: p.streakShields,
    energyRefills: p.energyRefills,
    coinUnlocks: p.coinUnlocks,
    completedLessons: p.completedLessons,
    badges: p.badges,
    toolsUsed: p.toolsUsed,
    stats: p.stats,
    lastShareDate: p.lastShareDate,
    shares: p.shares,
    signupBonus: p.signupBonus,
  };
}

const laterDate = (a: string | null | undefined, b: string | null | undefined) => ((a ?? '') > (b ?? '') ? (a ?? null) : (b ?? null));

function mergeFromRow(local: PlayerProfile, row: ProfileRow): PlayerProfile {
  const remote = (row.progress ?? {}) as Partial<PlayerProfile>;
  const isFresh = row.xp === 0 && !row.last_played_at;
  const packs = (row.unlocked_packs ?? []) as PackId[];
  if (isFresh) {
    // Nouveau compte : on garde la progression accumulée en mode invité.
    return { ...local, username: row.username || local.username, city: row.city ?? local.city, unlockedPacks: packs };
  }
  const rs = { ...DEFAULT_STATS, ...(remote.stats ?? {}) };
  const stats = Object.fromEntries(
    (Object.keys(DEFAULT_STATS) as (keyof PlayerStats)[]).map((k) => [k, Math.max(local.stats[k], rs[k])]),
  ) as unknown as PlayerStats;
  return {
    ...local,
    username: row.username,
    city: row.city ?? '',
    xp: Math.max(row.xp, local.xp),
    kazicoins: row.kazicoins,
    streak: row.streak,
    lastActiveDate: row.last_played_at ? row.last_played_at.slice(0, 10) : local.lastActiveDate,
    unlockedPacks: packs,
    bestStreak: Math.max(local.bestStreak, remote.bestStreak ?? 0),
    streakShields: remote.streakShields ?? local.streakShields,
    energyRefills: remote.energyRefills ?? local.energyRefills,
    coinUnlocks: union(local.coinUnlocks, remote.coinUnlocks ?? []),
    completedLessons: union(local.completedLessons, remote.completedLessons ?? []),
    badges: union(local.badges, remote.badges ?? []),
    toolsUsed: union(local.toolsUsed, remote.toolsUsed ?? []),
    stats,
    lastShareDate: laterDate(local.lastShareDate, remote.lastShareDate),
    shares: Math.max(local.shares, remote.shares ?? 0),
    signupBonus: local.signupBonus || Boolean(remote.signupBonus),
  };
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(() => hydrate(loadJSON(STORAGE_KEY, {})));
  const [user, setUser] = useState<User | null>(null);
  const [synced, setSynced] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const syncedRef = useRef(false);
  syncedRef.current = synced;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const update = useCallback((fn: (p: PlayerProfile) => PlayerProfile) => setProfile(fn), []);

  // Persistance locale
  useEffect(() => saveJSON(STORAGE_KEY, profile), [profile]);

  // Thème
  useEffect(() => {
    document.documentElement.classList.toggle('light', profile.theme === 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', profile.theme === 'light' ? '#F8FAFC' : '#0F172A');
  }, [profile.theme]);

  // Badges
  useEffect(() => {
    const earned = newlyEarnedBadges(profile);
    if (!earned.length) return;
    setProfile((p) => ({ ...p, badges: union(p.badges, earned.map((b) => b.id)) }));
    earned.forEach((b) => notify(`${b.emoji} ${L('Badge débloqué :', 'Badge unlocked:')} ${b.name}`, 'gold'));
  }, [profile, notify]);

  // ───── Auth Supabase ─────
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // On ne remplace l'objet que si le compte change (évite une resynchro à chaque rafraîchissement de jeton).
      setUser((prev) => (prev?.id === session?.user?.id ? prev : (session?.user ?? null)));
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const restorePurchases = useCallback(
    async (silent = false) => {
      if (!supabase) return;
      const before = profileRef.current.unlockedPacks.length;
      const { data, error } = await supabase.rpc('claim_pending_purchases');
      if (error) {
        if (!silent) notify(L('Impossible de vérifier tes achats pour le moment.', 'Unable to check your purchases right now.'), 'error');
        return;
      }
      const packs = (Array.isArray(data) ? data : []) as PackId[];
      setProfile((p) => ({ ...p, unlockedPacks: packs }));
      if (packs.length > before) notify(L('🎉 Achat retrouvé : ton pack est débloqué !', '🎉 Purchase found: your pack is unlocked!'), 'gold');
      else if (!silent) notify(packs.length ? L('Tes packs sont à jour.', 'Your packs are up to date.') : L('Aucun achat trouvé pour cet email.', 'No purchase found for this email.'), 'info');
    },
    [notify],
  );

  const claimCoinGrants = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc('claim_coin_grants');
    const amount = typeof data === 'number' ? data : 0;
    if (error || amount <= 0) return;
    setProfile((p) => ({ ...p, kazicoins: p.kazicoins + amount }));
    notify(L(`🤝 Bonus de parrainage : +${amount} KaziCoins !`, `🤝 Referral bonus: +${amount} KaziCoins!`), 'gold');
  }, [notify]);

  const fetchRemote = useCallback(async (u: User) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle();
    if (error) {
      notify(L('Synchronisation impossible pour le moment.', 'Unable to sync right now.'), 'error');
      return;
    }
    if (data) {
      const row = data as ProfileRow;
      // Cadeau de bienvenue : une seule fois par compte (drapeau synchronisé dans progress).
      const alreadyGiven = Boolean((row.progress as { signupBonus?: boolean } | null)?.signupBonus) || profileRef.current.signupBonus;
      setProfile((p) => {
        const merged = mergeFromRow(p, row);
        if (merged.signupBonus) return merged;
        return { ...merged, signupBonus: true, kazicoins: merged.kazicoins + SIGNUP_BONUS };
      });
      if (!alreadyGiven) notify(L(`🎁 Bienvenue ! +${SIGNUP_BONUS} KaziCoins offerts`, `🎁 Welcome! +${SIGNUP_BONUS} free KaziCoins`), 'gold');
      setRefCode(row.ref_code ?? null);
    }
    setSynced(true);
    // Parrainage d'un compte créé avec Google : le code (?ref=) n'a pas pu passer par l'inscription.
    // Le serveur ne l'accepte que pour un compte de moins de 24 h sans parrain (schema.sql § 8).
    const ref = pendingReferral();
    if (ref) {
      void supabase.rpc('claim_referral', { p_code: ref }).then(({ error: refError }) => {
        if (!refError) clearReferral();
      });
    }
    // Achats payés avant la création du compte (ou avec un simple lien de paiement).
    void restorePurchases(true);
    // KaziCoins offerts par le serveur (parrainage) : appliqués APRÈS la fusion ci-dessus.
    void claimCoinGrants();
  }, [notify, restorePurchases, claimCoinGrants]);

  useEffect(() => {
    setSynced(false);
    if (user) void fetchRemote(user);
  }, [user, fetchRemote]);

  // Au retour d'une page de paiement : on relit les packs débloqués.
  useEffect(() => {
    if (!supabase || !user) return;
    const onVisible = async () => {
      if (document.visibilityState !== 'visible' || !supabase) return;
      const { data } = await supabase.from('profiles').select('unlocked_packs').eq('id', user.id).maybeSingle();
      if (data) setProfile((p) => ({ ...p, unlockedPacks: (data.unlocked_packs ?? []) as PackId[] }));
      // Seulement après la première fusion : sinon le solde serveur écraserait le bonus.
      if (syncedRef.current) void claimCoinGrants();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user, claimCoinGrants]);

  // Retour de Chariow (?purchase=<pack>) : le webhook peut arriver quelques secondes après
  // la redirection, on vérifie donc le compte pendant ~40 s.
  useEffect(() => {
    if (!supabase || !user) return;
    const params = new URLSearchParams(window.location.search);
    const pack = params.get('purchase') as PackId | null;
    if (!pack) return;
    params.delete('purchase');
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
    notify(L('⏳ Paiement reçu, activation de ton pack…', '⏳ Payment received, activating your pack…'), 'info');
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      const { data } = await supabase!.from('profiles').select('unlocked_packs').eq('id', user.id).maybeSingle();
      const packs = (data?.unlocked_packs ?? []) as PackId[];
      if (packs.includes(pack)) {
        clearInterval(timer);
        setProfile((p) => ({ ...p, unlockedPacks: packs }));
        notify(L('🎉 Pack activé, merci pour ton soutien !', '🎉 Pack activated, thanks for your support!'), 'gold');
      } else if (tries >= 13) {
        clearInterval(timer);
        notify(L("L'activation prend plus de temps que prévu. Utilise « Restaurer mes achats » dans quelques minutes.", 'Activation is taking longer than expected. Use “Restore my purchases” in a few minutes.'), 'info');
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [user, notify]);

  // Envoi différé de la progression (les packs ne sont jamais écrits par le client).
  useEffect(() => {
    if (!supabase || !user || !synced) return;
    const t = setTimeout(() => {
      void supabase!
        .from('profiles')
        .update({
          username: profile.username,
          city: profile.city,
          xp: profile.xp,
          streak: profile.streak,
          kazicoins: profile.kazicoins,
          last_played_at: profile.lastActiveDate ? new Date(profile.lastActiveDate + 'T12:00:00').toISOString() : null,
          progress: progressOf(profile),
        })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.warn('[KaziBoss] sync', error.message);
        });
    }, 1200);
    return () => clearTimeout(t);
  }, [profile, user, synced]);

  // ───── Actions ─────
  const reward = useCallback(
    (xp: number, coins: number) => setProfile((p) => ({ ...p, xp: p.xp + xp, kazicoins: p.kazicoins + coins })),
    [],
  );

  const spendCoins = useCallback(
    (amount: number) => {
      if (profileRef.current.kazicoins < amount) {
        notify(L('Pas assez de KaziCoins. Joue et apprends pour en gagner !', 'Not enough KaziCoins. Play and learn to earn more!'), 'error');
        return false;
      }
      setProfile((p) => ({ ...p, kazicoins: p.kazicoins - amount }));
      return true;
    },
    [notify],
  );

  const recordActivity = useCallback(() => {
    const { profile: next, shieldUsed } = touchStreak(profileRef.current);
    if (next === profileRef.current) return;
    setProfile((p) => ({ ...p, streak: next.streak, bestStreak: next.bestStreak, lastActiveDate: next.lastActiveDate, streakShields: next.streakShields }));
    if (shieldUsed) notify(L('🛡️ Ton bouclier a sauvé ton streak !', '🛡️ Your shield saved your streak!'), 'gold');
    else if (next.streak > 1) notify(L(`🔥 Streak : ${next.streak} jours !`, `🔥 Streak: ${next.streak} days!`), 'gold');
  }, [notify]);

  const markToolUsed = useCallback((tool: ToolId) => {
    setProfile((p) => (p.toolsUsed.includes(tool) ? p : { ...p, toolsUsed: [...p.toolsUsed, tool] }));
  }, []);

  const hasPack = useCallback((id: PackId) => profile.unlockedPacks.includes(id), [profile.unlockedPacks]);
  const module4Unlocked = profile.coinUnlocks.includes('module4') || profile.unlockedPacks.includes('agri_import');

  const signUp = useCallback(async (email: string, password: string, username: string, city: string): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // `ref` : code de parrainage du lien d'invitation, lu par handle_new_user (schema.sql § 7).
      options: { data: { username, city, ref: pendingReferral() ?? undefined }, emailRedirectTo: window.location.origin },
    });
    if (error) return { error: error.message };
    clearReferral();
    setProfile((p) => ({ ...p, username, city }));
    if (!data.session) return { info: L('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.', 'Account created! Check your inbox to confirm your address, then log in.') };
    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message === 'Invalid login credentials' ? L('Email ou mot de passe incorrect.', 'Incorrect email or password.') : error.message } : {};
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    // Retour sur la page d'origine (www, sans www ou vercel.app) : doit figurer dans les URL autorisées de Supabase Auth.
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setRefCode(null);
    setProfile((p) => ({ ...p, unlockedPacks: [] }));
    notify(L('Déconnecté. Ta progression reste sur cet appareil.', 'Logged out. Your progress stays on this device.'));
  }, [notify]);

  const resetProgress = useCallback(() => {
    removeKey('run');
    removeKey('journal');
    setProfile((p) => ({ ...DEFAULT_PROFILE, theme: p.theme, username: p.username, city: p.city, unlockedPacks: p.unlockedPacks }));
    notify(L('Progression réinitialisée.', 'Progress reset.'));
  }, [notify]);

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) return { error: error.message };
    return { info: L('Si un compte existe pour cet email, tu vas recevoir un lien pour choisir un nouveau mot de passe.', 'If an account exists for this email, you will receive a link to choose a new password.') };
  }, []);

  const updatePassword = useCallback(
    async (password: string): Promise<AuthResult> => {
      if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
      setPasswordRecovery(false);
      notify(L('🔐 Mot de passe mis à jour.', '🔐 Password updated.'), 'success');
      return {};
    },
    [notify],
  );

  const checkout = useCallback(async (pack: PackId, buyer: CheckoutBuyer): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    const { data, error } = await supabase.functions.invoke<{ step?: string; url?: string | null; error?: string }>('create-checkout', {
      body: { pack, buyer },
    });
    if (error || !data) {
      // Erreur renvoyée par la fonction (4xx/5xx) : on affiche sa vraie raison plutôt qu'un message générique.
      let reason: string | undefined;
      try {
        const ctx = (error as { context?: Response } | null)?.context;
        if (ctx) reason = ((await ctx.json()) as { error?: string })?.error;
      } catch {
        /* réponse illisible : message générique */
      }
      return { error: reason || L('Paiement indisponible pour le moment. Réessaie dans un instant.', 'Payment is unavailable right now. Try again in a moment.') };
    }
    if (data.step === 'already_purchased') {
      await restorePurchases(true);
      return { info: L('Tu as déjà acheté ce pack : il est restauré sur ton compte.', 'You already bought this pack: it has been restored to your account.') };
    }
    if (!data.url) return { error: data.error ?? L('Lien de paiement introuvable.', 'Payment link not found.') };
    window.location.assign(data.url);
    return {};
  }, [restorePurchases]);

  const deleteAccount = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return { error: L('Supabase non configuré.', 'Supabase is not configured.') };
    const { error } = await supabase.rpc('delete_my_account');
    if (error) return { error: L('Suppression impossible pour le moment. Écris-nous et nous le ferons pour toi.', 'Unable to delete right now. Write to us and we will do it for you.') };
    await supabase.auth.signOut();
    removeKey('run');
    removeKey('journal');
    removeKey('sector');
    setProfile((p) => ({ ...DEFAULT_PROFILE, theme: p.theme }));
    notify(L('Ton compte et tes données ont été supprimés.', 'Your account and data have been deleted.'));
    return {};
  }, [notify]);

  const shareInvite = useCallback(
    async (score?: number) => {
      const outcome = await shareGame(inviteText(score), shareUrl(refCode));
      if (outcome === 'cancelled') return;
      const today = todayISO();
      const bonus = profileRef.current.lastShareDate !== today;
      setProfile((p) => ({
        ...p,
        shares: p.shares + 1,
        lastShareDate: today,
        kazicoins: bonus ? p.kazicoins + SHARE_DAILY_BONUS : p.kazicoins,
      }));
      if (bonus) notify(L(`📣 Merci pour le partage ! +${SHARE_DAILY_BONUS} KaziCoins`, `📣 Thanks for sharing! +${SHARE_DAILY_BONUS} KaziCoins`), 'gold');
    },
    [refCode, notify],
  );

  /**
   * Propose (sans forcer) de créer un compte à un moment où le joueur a quelque chose à perdre :
   * fin de mois, leçon terminée. Au plus 1 fois par jour et 5 fois au total.
   */
  const maybePromptSave = useCallback(() => {
    const p = profileRef.current;
    const today = todayISO();
    if (!isSupabaseConfigured || user || p.savePromptDate === today || p.savePromptCount >= 5) return;
    setProfile((x) => ({ ...x, savePromptDate: today, savePromptCount: x.savePromptCount + 1 }));
    window.setTimeout(() => openAuth('save'), 1200); // laisse le temps de voir l'écran de fin
  }, [user]);

  const referralStats = useCallback(async () => {
    if (!supabase || !user) return null;
    const { data, error } = await supabase.rpc('my_referral_stats');
    if (error || !data) return null;
    const d = data as { invited?: number; rewarded?: number };
    return { invited: d.invited ?? 0, rewarded: d.rewarded ?? 0 };
  }, [user]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      profile,
      user,
      email: user?.email ?? null,
      isCloud: isSupabaseConfigured && Boolean(user),
      update,
      reward,
      spendCoins,
      recordActivity,
      markToolUsed,
      hasPack,
      module4Unlocked,
      toasts,
      notify,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetProgress,
      requestPasswordReset,
      passwordRecovery,
      updatePassword,
      restorePurchases,
      checkout,
      deleteAccount,
      refCode,
      shareInvite,
      referralStats,
      maybePromptSave,
    }),
    [
      profile,
      user,
      update,
      reward,
      spendCoins,
      recordActivity,
      markToolUsed,
      hasPack,
      module4Unlocked,
      toasts,
      notify,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetProgress,
      requestPasswordReset,
      passwordRecovery,
      updatePassword,
      restorePurchases,
      checkout,
      deleteAccount,
      refCode,
      shareInvite,
      referralStats,
      maybePromptSave,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer doit être utilisé dans <PlayerProvider>');
  return ctx;
}
