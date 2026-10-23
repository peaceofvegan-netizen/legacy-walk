import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const AVATAR_XP_KEY = "LEGACY_WALK_AVATAR_XP";

export const AVATAR_XP_VALUES = {
  JOURNEY_COMPLETED: 250,
  BREATHING_SESSION: 75,
  WORLD_MARATHON_STAMP: 1000,
  DAILY_STREAK: 150,
  REWARD_CLAIMED: 200,
};

export function getAvatarLevel(xp = 0) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

export function getNextLevelXP(xp = 0) {
  const currentLevel = getAvatarLevel(xp);
  return currentLevel * 1000;
}

export async function loadAvatarXP() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(AVATAR_XP_KEY)));

  return saved
    ? JSON.parse(saved)
    : {
        xp: 0,
        level: 1,
        lastLevelUp: null,
      };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addAvatarXP(eventType) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const current = await _accountSession2.run(async () => (loadAvatarXP()));

  const gained = AVATAR_XP_VALUES[eventType] || 0;
  const oldLevel = current.level || 1;
  const newXP = (current.xp || 0) + gained;
  const newLevel = getAvatarLevel(newXP);

  const updated = {
    xp: newXP,
    level: newLevel,
    lastLevelUp: newLevel > oldLevel ? new Date().toISOString() : current.lastLevelUp,
    leveledUp: newLevel > oldLevel,
    xpGained: gained,
  };

  await _accountSession2.run(async () => (AsyncStorage.setItem(AVATAR_XP_KEY, JSON.stringify(updated))));

  return updated;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}