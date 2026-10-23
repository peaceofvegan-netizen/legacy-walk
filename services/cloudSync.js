import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
import { supabase } from "../lib/supabase";

// PROFILE
export async function loadCloudProfile(userId) {
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  if (!userId) return null;

  const { data, error } = await _accountSession.run(async () => (supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()));

  if (error) {
    console.log("Load profile error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function updateCloudProfile(userId, updates = {}) {
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();

  if (!userId) return null;

  const { data, error } = await _accountSession2.run(async () => (supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Update profile error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// PROGRESS
export async function loadCloudProgress(userId) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  if (!userId) return null;

  const { data, error } = await _accountSession3.run(async () => (supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()));

  if (error) {
    console.log("Load progress error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudProgress(userId, progress = {}) {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  if (!userId) return null;

  const payload = {
    user_id: userId,
    steps: progress.steps || 0,
    streak: progress.streak || 0,
    xp: progress.xp || 0,
    level: progress.level || 1,
    active_journey_id: progress.activeJourney?.id || null,
    completed_walks: progress.completedWalks || 0,
    total_miles: progress.totalMiles || 0,
    total_calories: progress.totalCalories || 0,
    current_plan: progress.userPlan || "free",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await _accountSession4.run(async () => (supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save progress error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// COMPLETED JOURNEYS
export async function loadCloudCompletedJourneys(userId) {
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  if (!userId) return [];

  const { data, error } = await _accountSession5.run(async () => (supabase
    .from("completed_journeys")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })));

  if (error) {
    console.log("Load completed journeys error:", error.message);
    return [];
  }

  return (data || []).map((item) => {
  

return (({
    id: item.journey_id,
    cloudId: item.id,
    title: item.title,
    category: item.category,
    country: item.country,
    flag: item.flag,
    distance: item.distance,
    steps: item.steps,
    badge: item.badge,
    completedAt: item.completed_at
      ? new Date(item.completed_at).toLocaleDateString()
      : "Completed",
    completedBy: item.completed_by,
  }));
});

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudCompletedJourney(userId, journey = {}) {
  const _accountSession6 = captureAccountSession();

  try {
    _accountSession6.assertCurrent();

  if (!userId || !journey?.id) return null;

  const payload = {
    user_id: userId,
    journey_id: journey.id,
    title: journey.title,
    category: journey.category,
    country: journey.country || null,
    flag: journey.flag || null,
    distance: journey.distance || null,
    steps: journey.steps || 0,
    badge: journey.badge || null,
    completed_by: journey.completedBy || "Manual Completion",
  };

  const { data, error } = await _accountSession6.run(async () => (supabase
    .from("completed_journeys")
    .insert(payload)
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save completed journey error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// WALK SESSIONS
export async function loadCloudWalkSessions(userId) {
  const _accountSession7 = captureAccountSession();

  try {
    _accountSession7.assertCurrent();

  if (!userId) return [];

  const { data, error } = await _accountSession7.run(async () => (supabase
    .from("walk_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })));

  if (error) {
    console.log("Load walk sessions error:", error.message);
    return [];
  }

  return (data || []).map((item) => {
  

return (({
    id: item.id,
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : "Saved",
    journey: item.journey_title || "Free Walk",
    country: item.country || null,
    steps: item.steps || 0,
    miles: item.miles || 0,
    calories: item.calories || 0,
    xp: item.xp || 0,
    durationSeconds: item.duration_seconds || 0,
  }));
});

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudWalkSession(userId, walk = {}) {
  const _accountSession8 = captureAccountSession();

  try {
    _accountSession8.assertCurrent();

  if (!userId) return null;

  const payload = {
    user_id: userId,
    journey_title: walk.journey || "Free Walk",
    country: walk.country || null,
    steps: walk.steps || 0,
    miles: Number(walk.miles || 0),
    calories: walk.calories || 0,
    xp: walk.xp || 0,
    duration_seconds: walk.durationSeconds || 0,
    average_pace: walk.averagePace || null,
  };

  const { data, error } = await _accountSession8.run(async () => (supabase
    .from("walk_sessions")
    .insert(payload)
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save walk session error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// REFLECTIONS
export async function loadCloudReflections(userId) {
  const _accountSession9 = captureAccountSession();

  try {
    _accountSession9.assertCurrent();

  if (!userId) return [];

  const { data, error } = await _accountSession9.run(async () => (supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })));

  if (error) {
    console.log("Load reflections error:", error.message);
    return [];
  }

  return (data || []).map((item) => {
  

return (({
    id: item.id,
    text: item.entry,
    mood: item.mood,
    journeyTitle: item.journey_title,
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : "Saved",
  }));
});

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudReflection(userId, reflection = {}) {
  const _accountSession0 = captureAccountSession();

  try {
    _accountSession0.assertCurrent();

  if (!userId || !reflection?.text) return null;

  const payload = {
    user_id: userId,
    journey_title: reflection.journeyTitle || null,
    mood: reflection.mood || null,
    entry: reflection.text,
  };

  const { data, error } = await _accountSession0.run(async () => (supabase
    .from("reflections")
    .insert(payload)
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save reflection error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// SUBSCRIPTIONS
export async function loadCloudSubscription(userId) {
  const _accountSession1 = captureAccountSession();

  try {
    _accountSession1.assertCurrent();

  if (!userId) return null;

  const { data, error } = await _accountSession1.run(async () => (supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()));

  if (error) {
    console.log("Load subscription error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudSubscription(userId, subscription = {}) {
  const _accountSession10 = captureAccountSession();

  try {
    _accountSession10.assertCurrent();

  if (!userId) return null;

  const payload = {
    user_id: userId,
    provider: subscription.provider || "revenuecat",
    plan: subscription.plan || "free",
    status: subscription.status || "active",
    expires_at: subscription.expiresAt || null,
  };

  const { data, error } = await _accountSession10.run(async () => (supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save subscription error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// =========================================
// REWARDS
// =========================================

export async function loadCloudRewardPoints(userId) {
  const _accountSession11 = captureAccountSession();

  try {
    _accountSession11.assertCurrent();

  if (!userId) return { points: 0, lifetimePoints: 0 };

  const { data, error } = await _accountSession11.run(async () => (supabase
    .from("reward_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()));

  if (error) {
    console.log("Load reward points error:", error.message);
    return { points: 0, lifetimePoints: 0 };
  }

  return {
    points: data?.points || 0,
    lifetimePoints: data?.lifetime_points || 0,
  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addCloudRewardPoints(userId, rewardEvent = {}) {
  const _accountSession12 = captureAccountSession();

  try {
    _accountSession12.assertCurrent();

  if (!userId || !rewardEvent?.points) return null;

  const current = await _accountSession12.run(async () => (loadCloudRewardPoints(userId)));

  const newPoints = current.points + rewardEvent.points;
  const newLifetimePoints = current.lifetimePoints + rewardEvent.points;

  const { error: pointsError } = await _accountSession12.run(async () => (supabase
    .from("reward_points")
    .upsert(
      {
        user_id: userId,
        points: newPoints,
        lifetime_points: newLifetimePoints,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )));

  if (pointsError) {
    console.log("Add reward points error:", pointsError.message);
    return null;
  }

  const { data, error: eventError } = await _accountSession12.run(async () => (supabase
    .from("reward_events")
    .insert({
      user_id: userId,
      event_type: rewardEvent.eventType,
      points: rewardEvent.points,
      description: rewardEvent.description,
      journey_id: rewardEvent.journeyId,
    })
    .select()
    .maybeSingle()));

  if (eventError) {
    console.log("Save reward event error:", eventError.message);
    return null;
  }

  return {
    points: newPoints,
    lifetimePoints: newLifetimePoints,
    event: data,
  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loadCloudRewardEvents(userId) {
  const _accountSession13 = captureAccountSession();

  try {
    _accountSession13.assertCurrent();

  if (!userId) return [];

  const { data, error } = await _accountSession13.run(async () => (supabase
    .from("reward_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })));

  if (error) {
    console.log("Load reward events error:", error.message);
    return [];
  }

  return data || [];

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function createCloudRewardClaim(userId, reward = {}) {
  const _accountSession14 = captureAccountSession();

  try {
    _accountSession14.assertCurrent();

  if (!userId || !reward?.title) return null;

  const { data, error } = await _accountSession14.run(async () => (supabase
    .from("reward_claims")
    .insert({
      user_id: userId,
      reward_title: reward.title,
      points_required: reward.pointsRequired,
      cash_value: reward.cashValue,
      status: "pending",
    })
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Create reward claim error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loadCloudRewardClaims(userId) {
  const _accountSession15 = captureAccountSession();

  try {
    _accountSession15.assertCurrent();

  if (!userId) return [];

  const { data, error } = await _accountSession15.run(async () => (supabase
    .from("reward_claims")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })));

  if (error) {
    console.log("Load reward claims error:", error.message);
    return [];
  }

  return data || [];

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// LEADERBOARD
export async function loadCloudLeaderboard(limit = 50) {
  const _accountSession16 = captureAccountSession();

  try {
    _accountSession16.assertCurrent();

  const { data, error } = await _accountSession16.run(async () => (supabase
    .from("leaderboard_profiles")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit)));

  if (error) {
    console.log("Load leaderboard error:", error.message);
    return [];
  }

  return data || [];

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveCloudLeaderboardProfile(userId, profile = {}) {
  const _accountSession17 = captureAccountSession();

  try {
    _accountSession17.assertCurrent();

  if (!userId) return null;

  const payload = {
    user_id: userId,
    display_name: profile.displayName || "Legacy Walker",
    avatar_url: profile.avatarUrl || null,
    steps: profile.steps || 0,
    completed_journeys: profile.completedJourneys || 0,
    reward_points: profile.rewardPoints || 0,
    streak: profile.streak || 0,
    score: profile.score || 0,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await _accountSession17.run(async () => (supabase
    .from("leaderboard_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle()));

  if (error) {
    console.log("Save leaderboard error:", error.message);
    return null;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}