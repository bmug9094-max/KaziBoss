import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PackId } from '../types';

const env = import.meta.env;
// VITE_* en local (.env) ; NEXT_PUBLIC_* sur Vercel (variables créées par l'intégration Supabase).
const url = (env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
const anonKey = (
  env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)?.trim();

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
  /** Code de parrainage (schema.sql § 7) */
  ref_code?: string | null;
}

export interface LeaderboardRow {
  user_id: string;
  username: string;
  city: string | null;
  xp: number;
  streak: number;
  level: number;
}
