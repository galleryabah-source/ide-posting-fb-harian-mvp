-- Initial isolated schema for Ide Posting FB Harian.
-- Apply only to the Supabase project dedicated to this repository.

create extension if not exists pgcrypto;

create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  idea_id text not null,
  niche text not null,
  title text not null,
  post_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (visitor_id, idea_id)
);

create index if not exists saved_posts_visitor_created_idx
  on public.saved_posts (visitor_id, created_at desc);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid,
  provider text not null,
  destination_url text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists affiliate_clicks_created_idx
  on public.affiliate_clicks (created_at desc);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_name_created_idx
  on public.usage_events (event_name, created_at desc);

create index if not exists usage_events_visitor_event_created_idx
  on public.usage_events (visitor_id, event_name, created_at desc);

create table if not exists public.rate_limit_buckets (
  visitor_id uuid not null,
  event_name text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  primary key (visitor_id, event_name, window_start)
);

create index if not exists rate_limit_buckets_window_idx
  on public.rate_limit_buckets (window_start desc);

create or replace function public.consume_rate_limit(
  p_visitor_id uuid,
  p_event_name text,
  p_max_requests integer default 20,
  p_window_seconds integer default 60
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window_start timestamptz;
  v_retry integer;
  v_count integer;
begin
  if p_max_requests < 1 or p_window_seconds < 1 then
    return query select false, p_window_seconds;
    return;
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );
  v_retry := greatest(1, ceil(extract(epoch from ((v_window_start + make_interval(secs => p_window_seconds)) - clock_timestamp())))::integer);

  insert into public.rate_limit_buckets(visitor_id, event_name, window_start, request_count)
  values (p_visitor_id, p_event_name, v_window_start, 1)
  on conflict (visitor_id, event_name, window_start)
  do update set request_count = public.rate_limit_buckets.request_count + 1
  where public.rate_limit_buckets.request_count < p_max_requests
  returning request_count into v_count;

  if v_count is null then
    return query select false, v_retry;
  else
    return query select true, 0;
  end if;
end;
$$;

-- The RPC is server-only: the browser roles cannot execute it, while the
-- server-side Supabase service role can call it explicitly.
revoke all on function public.consume_rate_limit(uuid, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(uuid, text, integer, integer) to service_role;

alter table public.saved_posts enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.usage_events enable row level security;
alter table public.rate_limit_buckets enable row level security;

-- Client-side direct access is intentionally denied. The application server
-- uses a server-only key and validates every request before writes.
