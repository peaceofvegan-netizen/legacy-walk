import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_KEY = "LEGACY_WALK_PROGRESS";

export async function saveProgress(progress) {
  try {
    const json = JSON.stringify(progress);
    await AsyncStorage.setItem(PROGRESS_KEY, json);
  } catch (error) {
    console.log("Save progress error:", error);
  }
}

export async function loadProgress() {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.log("Load progress error:", error);
    return null;
  }
}

export async function clearProgress() {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
  } catch (error) {
    console.log("Clear progress error:", error);
  }
}