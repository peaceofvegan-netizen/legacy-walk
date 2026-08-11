import AsyncStorage from "@react-native-async-storage/async-storage";

const WALK_HISTORY_KEY = "LEGACY_WALK_HISTORY";

export async function saveWalkHistory(history) {
  try {
    await AsyncStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.log("Save walk history error:", error);
  }
}

export async function loadWalkHistory() {
  try {
    const saved = await AsyncStorage.getItem(WALK_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.log("Load walk history error:", error);
    return [];
  }
}

export async function clearWalkHistory() {
  try {
    await AsyncStorage.removeItem(WALK_HISTORY_KEY);
  } catch (error) {
    console.log("Clear walk history error:", error);
  }
}