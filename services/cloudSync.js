import { supabase } from "../lib/supabase";

// PROFILE
export async function loadCloudProfile(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.log("Load profile error:", error.message);
    return null;
  }

  return data;
}

export async function updateCloudProfile(userId, updates = {}) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.log("Update profile error:", error.message);
    return null;
  }

  return data;
}

// PROGRESS
export async function loadCloudProgress(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("Load progress error:", error.message);
    return null;
  }

  return data;
}

export async function saveCloudProgress(userId, progress = {}) {
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

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save progress error:", error.message);
    return null;
  }

  return data;
}

// COMPLETED JOURNEYS
export async function loadCloudCompletedJourneys(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("completed_journeys")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) {
    console.log("Load completed journeys error:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
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
}

export async function saveCloudCompletedJourney(userId, journey = {}) {
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

  const { data, error } = await supabase
    .from("completed_journeys")
    .insert(payload)
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save completed journey error:", error.message);
    return null;
  }

  return data;
}

// WALK SESSIONS
export async function loadCloudWalkSessions(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("walk_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load walk sessions error:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
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
}

export async function saveCloudWalkSession(userId, walk = {}) {
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

  const { data, error } = await supabase
    .from("walk_sessions")
    .insert(payload)
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save walk session error:", error.message);
    return null;
  }

  return data;
}

// REFLECTIONS
export async function loadCloudReflections(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load reflections error:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    text: item.entry,
    mood: item.mood,
    journeyTitle: item.journey_title,
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : "Saved",
  }));
}

export async function saveCloudReflection(userId, reflection = {}) {
  if (!userId || !reflection?.text) return null;

  const payload = {
    user_id: userId,
    journey_title: reflection.journeyTitle || null,
    mood: reflection.mood || null,
    entry: reflection.text,
  };

  const { data, error } = await supabase
    .from("reflections")
    .insert(payload)
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save reflection error:", error.message);
    return null;
  }

  return data;
}

// SUBSCRIPTIONS
export async function loadCloudSubscription(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("Load subscription error:", error.message);
    return null;
  }

  return data;
}

export async function saveCloudSubscription(userId, subscription = {}) {
  if (!userId) return null;

  const payload = {
    user_id: userId,
    provider: subscription.provider || "revenuecat",
    plan: subscription.plan || "free",
    status: subscription.status || "active",
    expires_at: subscription.expiresAt || null,
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save subscription error:", error.message);
    return null;
  }

  return data;
}

// =========================================
// REWARDS
// =========================================

export async function loadCloudRewardPoints(userId) {
  if (!userId) return { points: 0, lifetimePoints: 0 };

  const { data, error } = await supabase
    .from("reward_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("Load reward points error:", error.message);
    return { points: 0, lifetimePoints: 0 };
  }

  return {
    points: data?.points || 0,
    lifetimePoints: data?.lifetime_points || 0,
  };
}

export async function addCloudRewardPoints(userId, rewardEvent = {}) {
  if (!userId || !rewardEvent?.points) return null;

  const current = await loadCloudRewardPoints(userId);

  const newPoints = current.points + rewardEvent.points;
  const newLifetimePoints = current.lifetimePoints + rewardEvent.points;

  const { error: pointsError } = await supabase
    .from("reward_points")
    .upsert(
      {
        user_id: userId,
        points: newPoints,
        lifetime_points: newLifetimePoints,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (pointsError) {
    console.log("Add reward points error:", pointsError.message);
    return null;
  }

  const { data, error: eventError } = await supabase
    .from("reward_events")
    .insert({
      user_id: userId,
      event_type: rewardEvent.eventType,
      points: rewardEvent.points,
      description: rewardEvent.description,
      journey_id: rewardEvent.journeyId,
    })
    .select()
    .maybeSingle();

  if (eventError) {
    console.log("Save reward event error:", eventError.message);
    return null;
  }

  return {
    points: newPoints,
    lifetimePoints: newLifetimePoints,
    event: data,
  };
}

export async function loadCloudRewardEvents(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("reward_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load reward events error:", error.message);
    return [];
  }

  return data || [];
}

export async function createCloudRewardClaim(userId, reward = {}) {
  if (!userId || !reward?.title) return null;

  const { data, error } = await supabase
    .from("reward_claims")
    .insert({
      user_id: userId,
      reward_title: reward.title,
      points_required: reward.pointsRequired,
      cash_value: reward.cashValue,
      status: "pending",
    })
    .select()
    .maybeSingle();

  if (error) {
    console.log("Create reward claim error:", error.message);
    return null;
  }

  return data;
}

export async function loadCloudRewardClaims(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("reward_claims")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load reward claims error:", error.message);
    return [];
  }

  return data || [];
}

// LEADERBOARD
export async function loadCloudLeaderboard(limit = 50) {
  const { data, error } = await supabase
    .from("leaderboard_profiles")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.log("Load leaderboard error:", error.message);
    return [];
  }

  return data || [];
}

export async function saveCloudLeaderboardProfile(userId, profile = {}) {
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

  const { data, error } = await supabase
    .from("leaderboard_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle();

  if (error) {
    console.log("Save leaderboard error:", error.message);
    return null;
  }

  return data;
}