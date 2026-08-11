create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table user_progress (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  steps integer default 0,
  streak integer default 0,
  xp integer default 0,
  active_journey_id bigint,
  updated_at timestamp with time zone default timezone('utc', now())
);

create table completed_journeys (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  journey_id bigint,
  title text,
  category text,
  distance text,
  steps integer,
  badge text,
  completed_by text,
  completed_at timestamp with time zone default timezone('utc', now())
);

create table walk_sessions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  journey_title text,
  steps integer,
  miles numeric,
  calories integer,
  xp integer,
  duration_seconds integer,
  created_at timestamp with time zone default timezone('utc', now())
);

create table reflections (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  journey_title text,
  mood text,
  entry text,
  created_at timestamp with time zone default timezone('utc', now())
);
-- =========================================
-- REWARD POINTS
-- =========================================

create table if not exists reward_points (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  points integer default 0,
  lifetime_points integer default 0,
  updated_at timestamp with time zone default timezone('utc', now())
);

create table if not exists reward_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  points integer not null,
  description text,
  journey_id bigint,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists reward_claims (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  reward_title text not null,
  points_required integer not null,
  cash_value text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_reward_points_user on reward_points(user_id);
create index if not exists idx_reward_events_user on reward_events(user_id);
create index if not exists idx_reward_claims_user on reward_claims(user_id);

create table if not exists leaderboard_profiles (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  display_name text default 'Legacy Walker',
  avatar_url text,
  steps integer default 0,
  completed_journeys integer default 0,
  reward_points integer default 0,
  streak integer default 0,
  score integer default 0,
  updated_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_leaderboard_score
on leaderboard_profiles(score desc);

-- =========================================
-- FRAUD / REWARD REVIEW
-- =========================================

create table if not exists fraud_reviews (
  id bigint generated always as identity primary key,

  user_id uuid references auth.users(id) on delete cascade,

  walk_session_id bigint,

  journey_title text,

  steps integer default 0,
  miles numeric default 0,
  duration_seconds integer default 0,

  risk_score integer default 0,
  issues jsonb default '[]'::jsonb,

  reward_blocked boolean default true,

  status text default 'pending',

  admin_notes text,

  created_at timestamp with time zone
  default timezone('utc', now()),

  reviewed_at timestamp with time zone
);