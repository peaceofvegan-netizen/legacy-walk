import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const BREATHING_XP_KEY = "LEGACY_WALK_BREATHING_XP";

export async function getBreathingXP() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const saved = await _accountSession.run(async () => (AsyncStorage.getItem(BREATHING_XP_KEY)));
    return saved ? Number(saved) : 0;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("getBreathingXP error:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveBreathingXP(xp) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    await _accountSession2.run(async () => (AsyncStorage.setItem(BREATHING_XP_KEY, String(xp))));
    return xp;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("saveBreathingXP error:", error);
    return xp;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addBreathingXP(amount = 0) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  try {
    const currentXP = await _accountSession3.run(async () => (getBreathingXP()));
    const updatedXP = currentXP + Number(amount || 0);

    await _accountSession3.run(async () => (saveBreathingXP(updatedXP)));

    return updatedXP;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("addBreathingXP error:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  await _accountSession4.run(async () => (saveBreathingXP(0)));
  return 0;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}