import AsyncStorage from "@react-native-async-storage/async-storage";

const BREATHING_XP_KEY = "LEGACY_WALK_BREATHING_XP";

export async function getBreathingXP() {
  try {
    const saved = await AsyncStorage.getItem(BREATHING_XP_KEY);
    return saved ? Number(saved) : 0;
  } catch (error) {
    console.log("getBreathingXP error:", error);
    return 0;
  }
}

export async function saveBreathingXP(xp) {
  try {
    await AsyncStorage.setItem(BREATHING_XP_KEY, String(xp));
    return xp;
  } catch (error) {
    console.log("saveBreathingXP error:", error);
    return xp;
  }
}

export async function addBreathingXP(amount = 0) {
  try {
    const currentXP = await getBreathingXP();
    const updatedXP = currentXP + Number(amount || 0);

    await saveBreathingXP(updatedXP);

    return updatedXP;
  } catch (error) {
    console.log("addBreathingXP error:", error);
    return 0;
  }
}

export function getBreathingXPReward(minutes = 2) {
  const sessionMinutes = Number(minutes || 0);

  if (sessionMinutes >= 10) return 75;
  if (sessionMinutes >= 5) return 40;
  if (sessionMinutes >= 3) return 25;

  return 15;
}

export function getBreathingLevel(xp = 0) {
  const totalXP = Number(xp || 0);
  const level = Math.floor(totalXP / 100) + 1;
  const currentLevelXP = totalXP % 100;
  const percent = Math.min(currentLevelXP, 100);

  return {
    level,
    xp: totalXP,
    currentLevelXP,
    nextLevelXP: level * 100,
    percent,
  };
}

export async function resetBreathingXP() {
  await saveBreathingXP(0);
  return 0;
}