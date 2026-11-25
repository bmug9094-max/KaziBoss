import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PackId } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

/** null en mode Invité / Démo locale (aucune variable d'environnement). */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

/** Ligne de la table public.profiles (voir supabase/schema.sql) */
export interface ProfileRow {
  id: string;
  username: string;
  city: string | null;
  xp: number;
  streak: number;
  last_played_at: string | null;
  kazicoins: number;
  unlocked_packs: PackId[];
  progress: Record<string, unknown>;
}

export interface LeaderboardRow {
  user_id: string;
  username: string;
  city: string | null;
  xp: number;
  streak: number;
  level: number;
}
