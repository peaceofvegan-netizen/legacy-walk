import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


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
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const saved = await _accountSession.run(async () => (AsyncStorage.getItem(BREATHING_ANALYTICS_KEY)));
    return saved ? JSON.parse(saved) : DEFAULT_ANALYTICS;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("loadBreathingAnalytics error:", error);
    return DEFAULT_ANALYTICS;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveBreathingAnalytics(data) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    await _accountSession2.run(async () => (AsyncStorage.setItem(
      BREATHING_ANALYTICS_KEY,
      JSON.stringify(data)
    )));
    return data;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("saveBreathingAnalytics error:", error);
    return data;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function recordBreathingSession(session) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const analytics = await _accountSession3.run(async () => (loadBreathingAnalytics()));

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

  await _accountSession3.run(async () => (saveBreathingAnalytics(updated)));
  return updated;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function resetBreathingAnalytics() {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  await _accountSession4.run(async () => (saveBreathingAnalytics(DEFAULT_ANALYTICS)));
  return DEFAULT_ANALYTICS;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}
