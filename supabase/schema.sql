-- ═══════════════════════════════════════════════════════════════════
--  KaziBoss — Schéma Supabase
--  À exécuter dans : Supabase Dashboard › SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────── 1. PROFILES ─────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  username        text        not null,
  city            text,
  xp              integer     not null default 0,
  streak          integer     not null default 0,
  last_played_at  timestamptz,
  kazicoins       integer     not null default 50,
  -- Packs premium achetés. Écrits UNIQUEMENT côté serveur (webhook Chariow / service_role).
  unlocked_packs  jsonb       not null default '[]'::jsonb,
  -- Progression détaillée (leçons, badges, inventaire, stats) écrite par le client.
  progress        jsonb       not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint username_length   check (char_length(username) between 3 and 24),
  constraint city_length       check (city is null or char_length(city) <= 40),
  constraint xp_positive       check (xp >= 0),
  constraint streak_positive   check (streak >= 0),
  constraint coins_positive    check (kazicoins >= 0),
  constraint packs_is_array    check (jsonb_typeof(unlocked_packs) = 'array'),
  constraint progress_is_obj   check (jsonb_typeof(progress) = 'object'),
  constraint progress_size     check (pg_column_size(progress) < 32768)
);

create index if not exists profiles_xp_idx on public.profiles (xp desc);

-- updated_at automatique
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Garde-fou anti-triche simple : l'XP ne peut pas baisser ni bondir de plus de 2 000 en une écriture.
create or replace function public.guard_profile_update()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- Le service_role (webhooks, admin) n'est pas limité.
  if coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role'
     or current_user in ('postgres', 'service_role') then
    return new;
  end if;
  if new.xp < old.xp or new.xp - old.xp > 2000 then
    raise exception 'Variation d''XP invalide';
  end if;
  if new.kazicoins - old.kazicoins > 1000 then
    raise exception 'Variation de KaziCoins invalide';
  end if;
  new.unlocked_packs := old.unlocked_packs;  -- jamais modifiable par le client
  return new;
end $$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_username text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), 'Boss' || substr(new.id::text, 1, 6));
begin
  if char_length(v_username) < 3 then v_username := v_username || '_kb'; end if;
  insert into public.profiles (id, username, city)
  values (new.id, left(v_username, 24), left(nullif(trim(new.raw_user_meta_data ->> 'city'), ''), 40))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────── 2. LEADERBOARD ─────────────────────────
-- Table publique dénormalisée : n'expose QUE les colonnes du classement
-- (pas d'email, pas de progression, pas d'achats).
create table if not exists public.leaderboard (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  username   text    not null,
  city       text,
  xp         integer not null default 0,
  streak     integer not null default 0,
  level      integer not null default 1,
  updated_at timestamptz not null default now()
);

create index if not exists leaderboard_xp_idx on public.leaderboard (xp desc);

-- Même formule que src/lib/progress.ts : xp requise pour le niveau n = 50·n·(n−1)
create or replace function public.level_from_xp(p_xp integer)
returns integer language sql immutable set search_path = '' as $$
  select greatest(1, floor((1 + sqrt(1 + 4 * greatest(p_xp, 0) / 50.0)) / 2)::integer);
$$;

create or replace function public.sync_leaderboard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.leaderboard (user_id, username, city, xp, streak, level, updated_at)
  values (new.id, new.username, new.city, new.xp, new.streak, public.level_from_xp(new.xp), now())
  on conflict (user_id) do update
    set username = excluded.username,
        city = excluded.city,
        xp = excluded.xp,
        streak = excluded.streak,
        level = excluded.level,
        updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_sync_leaderboard on public.profiles;
create trigger profiles_sync_leaderboard after insert or update of username, city, xp, streak on public.profiles
  for each row execute function public.sync_leaderboard();

-- ───────────────────────── 3. ROW LEVEL SECURITY ─────────────────────────
alter table public.profiles    enable row level security;
alter table public.leaderboard enable row level security;

-- Profiles : chacun ne voit et ne modifie que SA ligne.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Pas de policy INSERT / DELETE : la ligne est créée par le trigger handle_new_user
-- et supprimée en cascade avec le compte.

-- Privilèges au niveau colonne : le client ne peut écrire que ces colonnes.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (username, city, xp, streak, last_played_at, kazicoins, progress) on public.profiles to authenticated;

-- Leaderboard : lecture publique, aucune écriture client.
drop policy if exists "leaderboard_read_all" on public.leaderboard;
create policy "leaderboard_read_all" on public.leaderboard
  for select to anon, authenticated using (true);

revoke all on public.leaderboard from anon, authenticated;
grant select on public.leaderboard to anon, authenticated;

-- ───────────────────────── 4. DÉBLOCAGE DES PACKS (serveur) ─────────────────────────
-- À appeler depuis une Edge Function / webhook Chariow avec la clé service_role,
-- après vérification de la signature du paiement :
--   select public.grant_pack('client@email.com', 'agri_import');
create or replace function public.grant_pack(p_email text, p_pack text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if p_pack not in ('agri_import', 'unlimited_lives', 'digital_growth') then
    raise exception 'Pack inconnu : %', p_pack;
  end if;
  select id into v_id from auth.users where lower(email) = lower(p_email) limit 1;
  if v_id is null then return false; end if;
  update public.profiles
     set unlocked_packs = (
       select coalesce(jsonb_agg(distinct x), '[]'::jsonb)
       from jsonb_array_elements_text(unlocked_packs || to_jsonb(p_pack)) as t(x)
     )
   where id = v_id;
  return true;
end $$;

revoke all on function public.grant_pack(text, text) from public, anon, authenticated;
grant execute on function public.grant_pack(text, text) to service_role;
