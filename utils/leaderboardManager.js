import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
import { supabase } from "../lib/supabase";

export async function updateLeaderboard(userId, profile) {
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  if (!userId) return;

  const row = {
    id: userId,
    username: profile.username,
    avatar: profile.avatar,
    points: profile.points,
    rank: profile.rank,
    steps: profile.steps,
    miles: profile.miles,
    journeys: profile.journeys,
    updated_at: new Date().toISOString(),
  };

  await _accountSession.run(async () => (supabase
    .from("leaderboard")
    .upsert(row, { onConflict: "id" })));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loadLeaderboard() {
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();

  const { data } = await _accountSession2.run(async () => (supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false })));

  return data || [];

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}
await updateLeaderboard(user.id, {
  username: currentAvatar?.name || "Legathon Walker",
  avatar: currentAvatar?.id,
  points: legathonPoints,
  rank: legathonRank.currentRank,
  steps: lifetimeSteps,
  miles: totalMiles,
  journeys: completedCount,
});
