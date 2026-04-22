-- ============================================
-- 해냄! — Supabase 스키마 (Sprint 1)
-- ============================================

-- 1. 프로필 (auth.users 확장)
create table if not exists profiles (
  id uuid references auth.users primary key,
  nickname text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. 목표
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  category text not null check (category in ('운동','학습','커리어','예술','금융','마음','습관','기타')),
  color text not null default '#7E77B7',
  start_date date not null,
  end_date date not null,
  is_public boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz default now()
);

-- 3. 기록 (날짜별 완료)
create table if not exists records (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals on delete cascade not null,
  user_id uuid references auth.users not null,
  date date not null,
  created_at timestamptz default now(),
  unique(goal_id, date)
);

-- 4. 마일스톤
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals on delete cascade not null,
  title text not null,
  target_date date,
  is_done boolean not null default false,
  created_at timestamptz default now()
);

-- ============================================
-- RLS 정책
-- ============================================

-- profiles
alter table profiles enable row level security;
create policy "본인 프로필만 조회" on profiles for select using (auth.uid() = id);
create policy "본인 프로필만 수정" on profiles for all using (auth.uid() = id);

-- goals
alter table goals enable row level security;
create policy "본인 목표만 조회" on goals for select using (auth.uid() = user_id);
create policy "본인 목표만 수정" on goals for all using (auth.uid() = user_id);

-- records
alter table records enable row level security;
create policy "본인 기록만 조회" on records for select using (auth.uid() = user_id);
create policy "본인 기록만 수정" on records for all using (auth.uid() = user_id);

-- milestones
alter table milestones enable row level security;
create policy "본인 마일스톤만 조회" on milestones
  for select using (
    auth.uid() = (select user_id from goals where goals.id = goal_id)
  );
create policy "본인 마일스톤만 수정" on milestones
  for all using (
    auth.uid() = (select user_id from goals where goals.id = goal_id)
  );

-- ============================================
-- 신규 유저 자동 프로필 생성
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
