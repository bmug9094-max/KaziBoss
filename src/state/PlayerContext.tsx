import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { newlyEarnedBadges, touchStreak } from '../lib/progress';
import { loadJSON, removeKey, saveJSON } from '../lib/storage';
import { isSupabaseConfigured, supabase, type ProfileRow } from '../lib/supabase';
import type { PackId, PlayerProfile, PlayerStats, ToolId } from '../types';

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
  username: 'Invité',
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
  signOut: () => Promise<void>;
  resetProgress: () => void;
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
  };
}

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
  };
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(() => hydrate(loadJSON(STORAGE_KEY, {})));
  const [user, setUser] = useState<User | null>(null);
  const [synced, setSynced] = useState(false);
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
    earned.forEach((b) => notify(`${b.emoji} Badge débloqué : ${b.name}`, 'gold'));
  }, [profile, notify]);

  // ───── Auth Supabase ─────
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const fetchRemote = useCallback(async (u: User) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle();
    if (error) {
      notify('Synchronisation impossible pour le moment.', 'error');
      return;
    }
    if (data) setProfile((p) => mergeFromRow(p, data as ProfileRow));
    setSynced(true);
  }, [notify]);

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
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user]);

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

  const profileRef = useRef(profile);
  profileRef.current = profile;

  const spendCoins = useCallback(
    (amount: number) => {
      if (profileRef.current.kazicoins < amount) {
        notify("Pas assez de KaziCoins. Joue et apprends pour en gagner !", 'error');
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
    if (shieldUsed) notify('🛡️ Ton bouclier a sauvé ton streak !', 'gold');
    else if (next.streak > 1) notify(`🔥 Streak : ${next.streak} jours !`, 'gold');
  }, [notify]);

  const markToolUsed = useCallback((tool: ToolId) => {
    setProfile((p) => (p.toolsUsed.includes(tool) ? p : { ...p, toolsUsed: [...p.toolsUsed, tool] }));
  }, []);

  const hasPack = useCallback((id: PackId) => profile.unlockedPacks.includes(id), [profile.unlockedPacks]);
  const module4Unlocked = profile.coinUnlocks.includes('module4') || profile.unlockedPacks.includes('agri_import');

  const signUp = useCallback(async (email: string, password: string, username: string, city: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase non configuré.' };
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username, city } } });
    if (error) return { error: error.message };
    setProfile((p) => ({ ...p, username, city }));
    if (!data.session) return { info: 'Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.' };
    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase non configuré.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setProfile((p) => ({ ...p, unlockedPacks: [] }));
    notify('Déconnecté. Ta progression reste sur cet appareil.');
  }, [notify]);

  const resetProgress = useCallback(() => {
    removeKey('run');
    removeKey('journal');
    setProfile((p) => ({ ...DEFAULT_PROFILE, theme: p.theme, username: p.username, city: p.city, unlockedPacks: p.unlockedPacks }));
    notify('Progression réinitialisée.');
  }, [notify]);

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
      signOut,
      resetProgress,
    }),
    [profile, user, update, reward, spendCoins, recordActivity, markToolUsed, hasPack, module4Unlocked, toasts, notify, signUp, signIn, signOut, resetProgress],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer doit être utilisé dans <PlayerProvider>');
  return ctx;
}
