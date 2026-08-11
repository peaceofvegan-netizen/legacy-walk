import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_STATS_KEY = "legacywalk_user_stats_v2";

const DEFAULT_STATS = {
  totalSteps: 12000,
  todaySteps: 8742,
  dayStreak: 1,
  milesWalked: 3.6,
  journeysCompleted: 0,
};

export async function loadUserStats() {
  const saved = await AsyncStorage.getItem(USER_STATS_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_STATS;
}

export async function saveUserStats(stats) {
  await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}