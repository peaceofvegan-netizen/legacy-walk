import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_STATS_KEY = "legacywalk_step_stats_v1";

export async function isStepTrackingAvailable() {
  return await Pedometer.isAvailableAsync();
}

export async function getTodaySteps() {
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const result = await Pedometer.getStepCountAsync(start, end);
  return result.steps || 0;
}

export function watchLiveSteps(onStepUpdate) {
  return Pedometer.watchStepCount((result) => {
    onStepUpdate(result.steps || 0);
  });
}

export async function loadStepStats() {
  const saved = await AsyncStorage.getItem(STEP_STATS_KEY);

  if (!saved) {
    return {
      todaySteps: 0,
      liveSessionSteps: 0,
      totalSteps: 0,
      milesWalked: 0,
      dayStreak: 0,
      lastUpdated: null,
    };
  }

  return JSON.parse(saved);
}

export async function saveStepStats(stats) {
  await AsyncStorage.setItem(STEP_STATS_KEY, JSON.stringify(stats));
}

export function stepsToMiles(steps) {
  return Number((steps / 2300).toFixed(2));
}

export async function syncTodaySteps() {
  const todaySteps = await getTodaySteps();
  const saved = await loadStepStats();

  const updated = {
    ...saved,
    todaySteps,
    totalSteps: Math.max(saved.totalSteps || 0, todaySteps),
    milesWalked: stepsToMiles(todaySteps),
    lastUpdated: new Date().toISOString(),
  };

  await saveStepStats(updated);

  return updated;
}