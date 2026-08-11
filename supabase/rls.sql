-- =========================================
-- ENABLE RLS
-- =========================================

alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table completed_journeys enable row level security;
alter table walk_sessions enable row level security;
alter table reflections enable row level security;
alter table passport_stamps enable row level security;
alter table achievements enable row level security;
alter table user_settings enable row level security;
alter table subscriptions enable row level security;

-- =========================================
-- PROFILES
-- =========================================

create policy "Users can view own profile"
on profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles
for update
using (auth.uid() = id);

-- =========================================
-- USER PROGRESS
-- =========================================

create policy "Users can view own progress"
on user_progress
for select
using (auth.uid() = user_id);

create policy "Users can insert own progress"
on user_progress
for insert
with check (auth.uid() = user_id);

create policy "Users can update own progress"
on user_progress
for update
using (auth.uid() = user_id);

-- =========================================
-- COMPLETED JOURNEYS
-- =========================================

create policy "Users can view own completed journeys"
on completed_journeys
for select
using (auth.uid() = user_id);

create policy "Users can insert own completed journeys"
on completed_journeys
for insert
with check (auth.uid() = user_id);

create policy "Users can update own completed journeys"
on completed_journeys
for update
using (auth.uid() = user_id);

create policy "Users can delete own completed journeys"
on completed_journeys
for delete
using (auth.uid() = user_id);

-- =========================================
-- WALK SESSIONS
-- =========================================

create policy "Users can view own walk sessions"
on walk_sessions
for select
using (auth.uid() = user_id);

create policy "Users can insert own walk sessions"
on walk_sessions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own walk sessions"
on walk_sessions
for update
using (auth.uid() = user_id);

create policy "Users can delete own walk sessions"
on walk_sessions
for delete
using (auth.uid() = user_id);

-- =========================================
-- REFLECTIONS
-- =========================================

create policy "Users can view own reflections"
on reflections
for select
using (auth.uid() = user_id);

create policy "Users can insert own reflections"
on reflections
for insert
with check (auth.uid() = user_id);

create policy "Users can update own reflections"
on reflections
for update
using (auth.uid() = user_id);

create policy "Users can delete own reflections"
on reflections
for delete
using (auth.uid() = user_id);

-- =========================================
-- PASSPORT STAMPS
-- =========================================

create policy "Users can view own passport stamps"
on passport_stamps
for select
using (auth.uid() = user_id);

create policy "Users can insert own passport stamps"
on passport_stamps
for insert
with check (auth.uid() = user_id);

create policy "Users can update own passport stamps"
on passport_stamps
for update
using (auth.uid() = user_id);

-- =========================================
-- ACHIEVEMENTS
-- =========================================

create policy "Users can view own achievements"
on achievements
for select
using (auth.uid() = user_id);

create policy "Users can insert own achievements"
on achievements
for insert
with check (auth.uid() = user_id);

create policy "Users can update own achievements"
on achievements
for update
using (auth.uid() = user_id);

-- =========================================
-- USER SETTINGS
-- =========================================

create policy "Users can view own settings"
on user_settings
for select
using (auth.uid() = user_id);

create policy "Users can insert own settings"
on user_settings
for insert
with check (auth.uid() = user_id);

create policy "Users can update own settings"
on user_settings
for update
using (auth.uid() = user_id);

-- =========================================
-- SUBSCRIPTIONS
-- =========================================

create policy "Users can view own subscriptions"
on subscriptions
for select
using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
on subscriptions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
on subscriptions
for update
using (auth.uid() = user_id);

alter table reward_points enable row level security;
alter table reward_events enable row level security;
alter table reward_claims enable row level security;

create policy "Users can view own reward points"
on reward_points for select
using (auth.uid() = user_id);

create policy "Users can insert own reward points"
on reward_points for insert
with check (auth.uid() = user_id);

create policy "Users can update own reward points"
on reward_points for update
using (auth.uid() = user_id);

create policy "Users can view own reward events"
on reward_events for select
using (auth.uid() = user_id);

create policy "Users can insert own reward events"
on reward_events for insert
with check (auth.uid() = user_id);

create policy "Users can view own reward claims"
on reward_claims for select
using (auth.uid() = user_id);

create policy "Users can insert own reward claims"
on reward_claims for insert
with check (auth.uid() = user_id);

alter table leaderboard_profiles enable row level security;

create policy "Users can view leaderboard"
on leaderboard_profiles
for select
using (true);

create policy "Users can insert own leaderboard profile"
on leaderboard_profiles
for insert
with check (auth.uid() = user_id);

create policy "Users can update own leaderboard profile"
on leaderboard_profiles
for update
using (auth.uid() = user_id);

alter table fraud_reviews enable row level security;

create policy "Users can view own fraud reviews"
on fraud_reviews
for select
using (auth.uid() = user_id);

create policy "Users can insert own fraud reviews"
on fraud_reviews
for insert
with check (auth.uid() = user_id);