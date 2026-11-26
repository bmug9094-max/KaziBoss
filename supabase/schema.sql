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

-- Ajoute un pack à un joueur identifié par son id (utilisé par le webhook et la réclamation).
create or replace function public.grant_pack_to_user(p_user uuid, p_pack text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_pack not in ('agri_import', 'unlimited_lives', 'digital_growth') then
    raise exception 'Pack inconnu : %', p_pack;
  end if;
  update public.profiles
     set unlocked_packs = (
       select coalesce(jsonb_agg(distinct x), '[]'::jsonb)
       from jsonb_array_elements_text(unlocked_packs || to_jsonb(p_pack)) as t(x)
     )
   where id = p_user;
  return found;
end $$;

revoke all on function public.grant_pack_to_user(uuid, text) from public, anon, authenticated;
grant execute on function public.grant_pack_to_user(uuid, text) to service_role;

-- Retrouve un compte à l'email CONFIRMÉ (le webhook ne doit pas offrir un pack
-- à quelqu'un qui aurait créé un compte avec l'email d'un autre sans le confirmer).
create or replace function public.find_confirmed_user_by_email(p_email text)
returns uuid language sql stable security definer set search_path = '' as $$
  select id from auth.users
   where lower(email) = lower(p_email) and email_confirmed_at is not null
   limit 1;
$$;

revoke all on function public.find_confirmed_user_by_email(text) from public, anon, authenticated;
grant execute on function public.find_confirmed_user_by_email(text) to service_role;

-- ───────────────────────── 5. JOURNAL DES ACHATS ─────────────────────────
-- Une ligne par livraison de webhook Chariow (« Pulse »). Sert à :
--  - ne jamais traiter deux fois la même livraison (delivery_id unique),
--  - retrouver un achat payé AVANT la création du compte (status = 'pending'),
--  - garder une trace comptable (remboursements, litiges), même si le compte est supprimé.
create table if not exists public.purchases (
  id            uuid primary key default gen_random_uuid(),
  delivery_id   text unique not null,          -- en-tête x-pulse-delivery-id
  sale_id       text,                          -- sale.id chez Chariow
  user_id       uuid references auth.users (id) on delete set null,
  email         text,
  pack          text not null,
  product_id    text,
  amount        numeric,
  currency      text,
  status        text not null default 'pending' check (status in ('pending', 'granted', 'refunded')),
  raw           jsonb,
  created_at    timestamptz not null default now(),
  granted_at    timestamptz
);

create index if not exists purchases_email_idx on public.purchases (lower(email)) where status = 'pending';
create index if not exists purchases_user_idx on public.purchases (user_id);

alter table public.purchases enable row level security;

drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.purchases from anon, authenticated;
grant select (id, sale_id, pack, amount, currency, status, created_at, granted_at) on public.purchases to authenticated;

-- Le joueur connecté récupère les achats faits avec son email avant d'avoir un compte
-- (ou avec un lien de paiement qui ne portait pas son identifiant). Renvoie ses packs à jour.
create or replace function public.claim_pending_purchases()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
  r       record;
begin
  if v_uid is null then raise exception 'Non connecté'; end if;
  -- Seul un email confirmé peut réclamer des achats.
  select email into v_email from auth.users where id = v_uid and email_confirmed_at is not null;
  if v_email is not null then
    for r in
      select id, pack from public.purchases
       where status = 'pending' and user_id is null and lower(email) = lower(v_email)
       for update
    loop
      perform public.grant_pack_to_user(v_uid, r.pack);
      update public.purchases set user_id = v_uid, status = 'granted', granted_at = now() where id = r.id;
    end loop;
  end if;
  return (select unlocked_packs from public.profiles where id = v_uid);
end $$;

revoke all on function public.claim_pending_purchases() from public, anon;
grant execute on function public.claim_pending_purchases() to authenticated;

-- ───────────────────────── 6. SUPPRESSION DE COMPTE ─────────────────────────
-- Exigée par Google Play et par la protection des données. Supprime le compte et,
-- en cascade, le profil et la ligne du classement. Les achats sont conservés
-- (obligation comptable) mais détachés du compte (user_id = null).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Non connecté'; end if;
  delete from auth.users where id = v_uid;
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ───────────────────────── 7. PARRAINAGE ─────────────────────────
-- Chaque joueur a un code (lien https://…/?ref=CODE). Quand un ami s'inscrit avec ce lien
-- ET atteint 150 XP (il a vraiment joué), le parrain reçoit 100 KaziCoins et l'ami 50.
-- Les colonnes ci-dessous ne sont pas dans les droits d'écriture du client : impossible de tricher.
alter table public.profiles add column if not exists ref_code text;
alter table public.profiles add column if not exists referred_by uuid references public.profiles (id) on delete set null;
alter table public.profiles add column if not exists referral_rewarded boolean not null default false;
create unique index if not exists profiles_ref_code_idx on public.profiles (ref_code);

update public.profiles
   set ref_code = substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
 where ref_code is null;

-- Nouvelle version de la création de profil : code de parrainage + parrain éventuel.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_username text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), 'Boss' || substr(new.id::text, 1, 6));
  v_ref      text := lower(nullif(trim(new.raw_user_meta_data ->> 'ref'), ''));
  v_referrer uuid;
begin
  if char_length(v_username) < 3 then v_username := v_username || '_kb'; end if;
  if v_ref is not null then
    select id into v_referrer from public.profiles where ref_code = v_ref;
  end if;
  insert into public.profiles (id, username, city, ref_code, referred_by)
  values (
    new.id,
    left(v_username, 24),
    left(nullif(trim(new.raw_user_meta_data ->> 'city'), ''), 40),
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    v_referrer
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- KaziCoins offerts par le serveur, récupérés par l'app (le client reste maître de son solde).
create table if not exists public.coin_grants (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  amount     integer not null check (amount > 0 and amount <= 500),
  reason     text not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);
create index if not exists coin_grants_unclaimed_idx on public.coin_grants (user_id) where claimed_at is null;
alter table public.coin_grants enable row level security;
revoke all on public.coin_grants from anon, authenticated;

-- Récompense déclenchée quand le filleul franchit 150 XP (une seule fois, 20 filleuls récompensés max par parrain).
create or replace function public.reward_referral()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.referred_by is not null and not new.referral_rewarded and new.xp >= 150 then
    new.referral_rewarded := true;
    insert into public.coin_grants (user_id, amount, reason) values (new.id, 50, 'bienvenue_filleul');
    if (select count(*) from public.coin_grants where user_id = new.referred_by and reason = 'parrainage') < 20 then
      insert into public.coin_grants (user_id, amount, reason) values (new.referred_by, 100, 'parrainage');
    end if;
  end if;
  return new;
end $$;

drop trigger if exists profiles_referral on public.profiles;
create trigger profiles_referral before update of xp on public.profiles
  for each row execute function public.reward_referral();

-- L'app récupère ses KaziCoins offerts (900 max par appel, sous le plafond anti-triche de 1 000).
create or replace function public.claim_coin_grants()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_uid   uuid := auth.uid();
  v_total integer := 0;
  r       record;
begin
  if v_uid is null then raise exception 'Non connecté'; end if;
  for r in
    select id, amount from public.coin_grants
     where user_id = v_uid and claimed_at is null
     order by id
     for update
  loop
    exit when v_total + r.amount > 900;
    update public.coin_grants set claimed_at = now() where id = r.id;
    v_total := v_total + r.amount;
  end loop;
  return v_total;
end $$;

revoke all on function public.claim_coin_grants() from public, anon;
grant execute on function public.claim_coin_grants() to authenticated;

-- Statistiques de parrainage du joueur connecté.
create or replace function public.my_referral_stats()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'ref_code', (select ref_code from public.profiles where id = auth.uid()),
    'invited',  (select count(*) from public.profiles where referred_by = auth.uid()),
    'rewarded', (select count(*) from public.profiles where referred_by = auth.uid() and referral_rewarded)
  );
$$;

revoke all on function public.my_referral_stats() from public, anon;
grant execute on function public.my_referral_stats() to authenticated;

-- ───────────────────────── 8. CONNEXION GOOGLE ─────────────────────────
-- Un compte créé avec Google n'a ni pseudo ni code de parrainage dans ses métadonnées.
-- Pseudo : on prend le prénom Google (premier mot du nom, jamais le nom complet,
-- car le classement est public), sinon « Boss » + 6 caractères.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_username text := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(split_part(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ' ', 1), ''),
    'Boss' || substr(new.id::text, 1, 6)
  );
  v_ref      text := lower(nullif(trim(new.raw_user_meta_data ->> 'ref'), ''));
  v_referrer uuid;
begin
  if char_length(v_username) < 3 then v_username := v_username || '_kb'; end if;
  if v_ref is not null then
    select id into v_referrer from public.profiles where ref_code = v_ref;
  end if;
  insert into public.profiles (id, username, city, ref_code, referred_by)
  values (
    new.id,
    left(v_username, 24),
    left(nullif(trim(new.raw_user_meta_data ->> 'city'), ''), 40),
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    v_referrer
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- Parrainage après une inscription Google : l'app envoie le code mémorisé (?ref=) juste après
-- la première connexion. Accepté seulement pour un compte créé il y a moins de 24 h,
-- sans parrain, pas encore récompensé, et jamais son propre code.
create or replace function public.claim_referral(p_code text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_uid      uuid := auth.uid();
  v_referrer uuid;
begin
  if v_uid is null then raise exception 'Non connecté'; end if;
  select id into v_referrer from public.profiles where ref_code = lower(trim(p_code));
  if v_referrer is null or v_referrer = v_uid then return false; end if;
  if not exists (select 1 from auth.users where id = v_uid and created_at > now() - interval '24 hours') then
    return false;
  end if;
  update public.profiles
     set referred_by = v_referrer
   where id = v_uid and referred_by is null and not referral_rewarded;
  return found;
end $$;

revoke all on function public.claim_referral(text) from public, anon;
grant execute on function public.claim_referral(text) to authenticated;
