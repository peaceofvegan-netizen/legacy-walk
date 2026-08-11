import AsyncStorage from "@react-native-async-storage/async-storage";

const BREATHING_ANALYTICS_KEY = "LEGACY_WALK_BREATHING_ANALYTICS";

const DEFAULT_ANALYTICS = {
  sessionsCompleted: 0,
  minutesBreathed: 0,
  coinsEarned: 0,
  weeklyStreak: 0,
  bestSession: null,
  history: [],
};

export async function loadBreathingAnalytics() {
  try {
    const saved = await AsyncStorage.getItem(BREATHING_ANALYTICS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ANALYTICS;
  } catch (error) {
    console.log("loadBreathingAnalytics error:", error);
    return DEFAULT_ANALYTICS;
  }
}

export async function saveBreathingAnalytics(data) {
  try {
    await AsyncStorage.setItem(
      BREATHING_ANALYTICS_KEY,
      JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.log("saveBreathingAnalytics error:", error);
    return data;
  }
}

export async function recordBreathingSession(session) {
  const analytics = await loadBreathingAnalytics();

  const minutes = Number(session.minutes || 0);
  const reward = Number(session.reward || 0);

  const newEntry = {
    id: Date.now().toString(),
    title: session.title || "Breathing Session",
    minutes,
    reward,
    pattern: session.pattern || "",
    completedAt: new Date().toISOString(),
  };

  const updated = {
    ...analytics,
    sessionsCompleted: analytics.sessionsCompleted + 1,
    minutesBreathed: analytics.minutesBreathed + minutes,
    coinsEarned: analytics.coinsEarned + reward,
    weeklyStreak: analytics.weeklyStreak + 1,
    bestSession:
      !analytics.bestSession || minutes > analytics.bestSession.minutes
        ? newEntry
        : analytics.bestSession,
    history: [newEntry, ...(analytics.history || [])].slice(0, 50),
  };

  await saveBreathingAnalytics(updated);
  return updated;
}

export async function resetBreathingAnalytics() {
  await saveBreathingAnalytics(DEFAULT_ANALYTICS);
  return DEFAULT_ANALYTICS;
}
