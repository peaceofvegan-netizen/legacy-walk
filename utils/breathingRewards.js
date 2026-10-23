import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const BREATHING_STATS_KEY = "LEGACY_WALK_BREATHING_STATS";

export const BREATHING_REWARD_POINTS = {
  SESSION_COMPLETE: 25,
  THREE_SESSION_DAY: 50,
  SEVEN_DAY_STREAK: 150,
  THIRTY_DAY_STREAK: 750,
};

export const DEFAULT_BREATHING_STATS = {
  totalSessions: 0,
  totalMinutes: 0,
  streak: 0,
  bestStreak: 0,
  lastSessionDate: null,
  todaySessions: 0,
  totalPointsEarned: 0,
  badges: [],
};

export async function loadBreathingStats() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(BREATHING_STATS_KEY)));
  return saved ? JSON.parse(saved) : DEFAULT_BREATHING_STATS;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveBreathingStats(stats) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  await _accountSession2.run(async () => (AsyncStorage.setItem(BREATHING_STATS_KEY, JSON.stringify(stats))));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function completeBreathingSession(minutes = 3) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const stats = await _accountSession3.run(async () => (loadBreathingStats()));

  const today = new Date().toDateString();
  const lastDate = stats.lastSessionDate;

  let streak = stats.streak || 0;
  let todaySessions = stats.todaySessions || 0;

  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }

    todaySessions = 1;
  } else {
    todaySessions += 1;
  }

  let pointsEarned = BREATHING_REWARD_POINTS.SESSION_COMPLETE;
  const badges = [...(stats.badges || [])];

  if (todaySessions === 3) {
    pointsEarned += BREATHING_REWARD_POINTS.THREE_SESSION_DAY;
    if (!badges.includes("Triple Calm Day")) badges.push("Triple Calm Day");
  }

  if (streak === 7) {
    pointsEarned += BREATHING_REWARD_POINTS.SEVEN_DAY_STREAK;
    if (!badges.includes("7-Day Calm Streak")) badges.push("7-Day Calm Streak");
  }

  if (streak === 30) {
    pointsEarned += BREATHING_REWARD_POINTS.THIRTY_DAY_STREAK;
    if (!badges.includes("30-Day Meditation Discipline")) {
      badges.push("30-Day Meditation Discipline");
    }
  }

  const updated = {
    totalSessions: (stats.totalSessions || 0) + 1,
    totalMinutes: (stats.totalMinutes || 0) + minutes,
    streak,
    bestStreak: Math.max(stats.bestStreak || 0, streak),
    lastSessionDate: today,
    todaySessions,
    totalPointsEarned: (stats.totalPointsEarned || 0) + pointsEarned,
    badges,
    lastPointsEarned: pointsEarned,
  };

  await _accountSession3.run(async () => (saveBreathingStats(updated)));

  return updated;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}