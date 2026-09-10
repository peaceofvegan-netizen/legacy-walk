import { supabase } from "../lib/supabase";

export async function updateLeaderboard(userId, profile) {
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

  await supabase
    .from("leaderboard")
    .upsert(row, { onConflict: "id" });
}

export async function loadLeaderboard() {
  const { data } = await supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false });

  return data || [];
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
