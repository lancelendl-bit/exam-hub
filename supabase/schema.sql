-- Fabric Exam Hub: progress sync table.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- It is safe to run again. Each signed-in user can only read and write their own rows.

create table if not exists public.progress (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  key        text        not null,            -- the localStorage key, e.g. dp700-hub-e1
  value      jsonb       not null,            -- the saved document
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.progress enable row level security;

drop policy if exists "progress select own" on public.progress;
drop policy if exists "progress insert own" on public.progress;
drop policy if exists "progress update own" on public.progress;
drop policy if exists "progress delete own" on public.progress;

create policy "progress select own" on public.progress for select to authenticated using (auth.uid() = user_id);
create policy "progress insert own" on public.progress for insert to authenticated with check (auth.uid() = user_id);
create policy "progress update own" on public.progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress delete own" on public.progress for delete to authenticated using (auth.uid() = user_id);

-- Nothing is readable without signing in.
revoke all on public.progress from anon;
grant select, insert, update, delete on public.progress to authenticated;
