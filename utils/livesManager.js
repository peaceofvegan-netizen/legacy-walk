import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
// utils/livesManager.js



export const MAX_LIVES = 5;
export const LIFE_RESTORE_TIME = 30 * 60 * 1000;

const KEY = "LEGATHON_LIVES";

export async function getLives() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(KEY)));

  if (!saved) {
    const initial = {
      lives: MAX_LIVES,
      lastUpdated: Date.now(),
    };

    await _accountSession.run(async () => (AsyncStorage.setItem(KEY, JSON.stringify(initial))));
    return initial;
  }

  const data = JSON.parse(saved);
  const now = Date.now();
  const elapsed = now - data.lastUpdated;
  const restored = Math.floor(elapsed / LIFE_RESTORE_TIME);

  if (restored > 0 && data.lives < MAX_LIVES) {
    const next = {
      lives: Math.min(MAX_LIVES, data.lives + restored),
      lastUpdated: now,
    };

    await _accountSession.run(async () => (AsyncStorage.setItem(KEY, JSON.stringify(next))));
    return next;
  }

  return data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loseLife() {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const data = await _accountSession2.run(async () => (getLives()));

  const next = {
    ...data,
    lives: Math.max(0, data.lives - 1),
    lastUpdated: Date.now(),
  };

  await _accountSession2.run(async () => (AsyncStorage.setItem(KEY, JSON.stringify(next))));
  return next;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addLife() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  const data = await _accountSession3.run(async () => (getLives()));

  const next = {
    ...data,
    lives: Math.min(MAX_LIVES, data.lives + 1),
  };

  await _accountSession3.run(async () => (AsyncStorage.setItem(KEY, JSON.stringify(next))));
  return next;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getNextLifeTime() {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  const data = await _accountSession4.run(async () => (getLives()));

  if (data.lives >= MAX_LIVES) {
    return {
      full: true,
      millisecondsLeft: 0,
    };
  }

  const nextLifeAt = data.lastUpdated + LIFE_RESTORE_TIME;

  return {
    full: false,
    millisecondsLeft: Math.max(0, nextLifeAt - Date.now()),
  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}