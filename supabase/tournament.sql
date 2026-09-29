-- Tournoi GSC Pickleball — inscriptions sans compte.
-- Table indépendante des tables de l'application (profiles/registrations),
-- accessible uniquement côté serveur (service role) : RLS activé, aucune policy.

create table if not exists public.tournament_registrations (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid,                          -- relie les tableaux d'un même combo
  tournament      text not null,                 -- ex. 'gsc-2026'
  category        text not null,                 -- 'men', 'women', 'mixed', 'singles'
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text,
  partner_name    text,                          -- null si simple ou "trouvez-moi un partenaire"
  find_partner    boolean not null default false,
  lang            text not null default 'fr',
  status          text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'expired', 'cancelled')),
  hold_expires_at timestamptz,                   -- fin des 15 min accordées pour payer
  amount_cents    integer not null check (amount_cents >= 0),
  stripe_session_id text,                        -- partagé par les tableaux d'un combo
  stripe_payment_intent_id text,
  confirmation_sent_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists tournament_registrations_cat_idx
  on public.tournament_registrations (tournament, category, status);
create index if not exists tournament_registrations_order_idx
  on public.tournament_registrations (order_id);
create index if not exists tournament_registrations_session_idx
  on public.tournament_registrations (stripe_session_id);

alter table public.tournament_registrations enable row level security;
-- Défense en profondeur : aucun droit pour les clés publiques (RLS bloque déjà tout).
revoke all on public.tournament_registrations from anon, authenticated;

-- Places occupées = inscriptions confirmées + commandes en attente de paiement.
-- Une commande en attente garde sa place jusqu'à ce que la tâche planifiée
-- (netlify/functions/tournoi-expire-holds) ferme sa page Stripe après 15 min
-- (hold_expires_at) et la passe en 'expired'. Les 20 min supplémentaires ne sont
-- qu'un filet de sécurité si la tâche et le webhook échouent : plus long que la
-- durée de vie de 30 min d'une page Stripe, donc jamais de place vendue deux fois.
create or replace function public.tournament_counts(p_tournament text)
returns table (category text, taken bigint)
language sql stable security definer set search_path = public as $$
  select category, count(*)
  from tournament_registrations
  where tournament = p_tournament
    and (status = 'confirmed'
         or (status = 'pending' and hold_expires_at > now() - interval '20 minutes'))
  group by category;
$$;

-- Réservation atomique d'une commande (1 tableau ou un combo), en tout ou rien :
-- si un seul des tableaux est complet, rien n'est réservé. Verrous pris dans
-- l'ordre alphabétique des tableaux pour éviter les interblocages.
-- p_items : [{"category","capacity","amount_cents","partner_name","find_partner"}]
create or replace function public.tournament_reserve_order(
  p_tournament text, p_items jsonb, p_hold_minutes integer,
  p_first_name text, p_last_name text, p_email text, p_phone text, p_lang text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_item jsonb;
  v_taken bigint;
  v_order uuid := gen_random_uuid();
begin
  for v_item in select value from jsonb_array_elements(p_items) order by value->>'category' loop
    perform pg_advisory_xact_lock(hashtext(p_tournament || ':' || (v_item->>'category')));
  end loop;

  for v_item in select value from jsonb_array_elements(p_items) loop
    select count(*) into v_taken
    from tournament_registrations
    where tournament = p_tournament and category = v_item->>'category'
      and (status = 'confirmed'
           or (status = 'pending' and hold_expires_at > now() - interval '20 minutes'));
    if v_taken >= (v_item->>'capacity')::int then
      return null; -- complet
    end if;
  end loop;

  insert into tournament_registrations (
    order_id, tournament, category, first_name, last_name, email, phone,
    partner_name, find_partner, lang, amount_cents, hold_expires_at
  )
  select v_order, p_tournament, value->>'category', p_first_name, p_last_name, p_email, p_phone,
         nullif(value->>'partner_name', ''), coalesce((value->>'find_partner')::boolean, false),
         p_lang, (value->>'amount_cents')::int, now() + make_interval(mins => p_hold_minutes)
  from jsonb_array_elements(p_items);

  return v_order;
end;
$$;

-- Fonctions réservées au serveur (clé service role), pas au public.
revoke all on function public.tournament_counts(text) from public, anon, authenticated;
revoke all on function public.tournament_reserve_order(text, jsonb, integer, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.tournament_counts(text) to service_role;
grant execute on function public.tournament_reserve_order(text, jsonb, integer, text, text, text, text, text) to service_role;

-- Liste des participants (inscriptions payées uniquement), lisible dans
-- Supabase → Table Editor → tournoi_participants, exportable en CSV.
-- security_invoker + aucun droit pour anon/authenticated : invisible depuis le site public.
drop view if exists public.tournoi_participants;
create view public.tournoi_participants
with (security_invoker = true) as
select
  case r.category
    when 'men' then 'Double hommes'
    when 'women' then 'Double dames'
    when 'mixed' then 'Double mixte'
    when 'singles' then 'Simple'
    else r.category
  end                                             as tableau,
  case when r.category in ('men', 'women') then 'Matin' else 'Après-midi' end as demi_journee,
  r.first_name                                    as prenom,
  r.last_name                                     as nom,
  r.email,
  r.phone                                         as telephone,
  case
    when r.category = 'singles' then '—'
    when r.find_partner then 'À TROUVER'
    else r.partner_name
  end                                             as partenaire,
  coalesce((
    select string_agg(case o.category
             when 'men' then 'Double hommes' when 'women' then 'Double dames'
             when 'mixed' then 'Double mixte' when 'singles' then 'Simple' else o.category end, ', ')
    from public.tournament_registrations o
    where o.order_id = r.order_id and o.id <> r.id
  ), '')                                          as combo_avec,
  (r.amount_cents / 100.0)::numeric(10, 2)        as montant_chf,
  r.lang                                          as langue,
  (r.created_at at time zone 'Europe/Zurich')     as inscrit_le,
  r.order_id                                      as commande
from public.tournament_registrations r
where r.tournament = 'gsc-2026' and r.status = 'confirmed'
order by
  array_position(array['men', 'women', 'mixed', 'singles'], r.category),
  r.last_name, r.first_name;

revoke all on public.tournoi_participants from public, anon, authenticated;
grant select on public.tournoi_participants to service_role;
