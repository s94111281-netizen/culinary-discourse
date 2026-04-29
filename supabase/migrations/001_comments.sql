create extension if not exists pgcrypto;

create table if not exists public.restaurant_comments (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text not null,
  nickname text not null,
  content text not null,
  rating smallint,
  ip_hash text not null,
  created_at timestamptz not null default now(),
  constraint restaurant_comments_nickname_len check (char_length(nickname) between 1 and 40),
  constraint restaurant_comments_content_len check (char_length(content) between 3 and 600),
  constraint restaurant_comments_rating_range check (rating is null or rating between 1 and 5)
);

create index if not exists restaurant_comments_restaurant_id_idx
  on public.restaurant_comments (restaurant_id);

create index if not exists restaurant_comments_created_at_idx
  on public.restaurant_comments (created_at desc);

create index if not exists restaurant_comments_restaurant_created_idx
  on public.restaurant_comments (restaurant_id, created_at desc);

alter table public.restaurant_comments enable row level security;

drop policy if exists "comments_read_all" on public.restaurant_comments;
create policy "comments_read_all"
  on public.restaurant_comments
  for select
  using (true);
