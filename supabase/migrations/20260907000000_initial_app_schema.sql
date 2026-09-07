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

alter table public.saved_posts enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.usage_events enable row level security;

-- Client-side direct access is intentionally denied. The application server
-- uses a server-only Supabase key and validates every request before writes.
