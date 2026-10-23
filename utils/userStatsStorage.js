import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const USER_STATS_KEY = "legacywalk_user_stats_v2";

const DEFAULT_STATS = {
  totalSteps: 12000,
  todaySteps: 8742,
  dayStreak: 1,
  milesWalked: 3.6,
  journeysCompleted: 0,
};

export async function loadUserStats() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(USER_STATS_KEY)));
  return saved ? JSON.parse(saved) : DEFAULT_STATS;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveUserStats(stats) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  await _accountSession2.run(async () => (AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats))));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}