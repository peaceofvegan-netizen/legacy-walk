// utils/livesManager.js

import AsyncStorage from "@react-native-async-storage/async-storage";

export const MAX_LIVES = 5;
export const LIFE_RESTORE_TIME = 30 * 60 * 1000;

const KEY = "LEGATHON_LIVES";

export async function getLives() {
  const saved = await AsyncStorage.getItem(KEY);

  if (!saved) {
    const initial = {
      lives: MAX_LIVES,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(KEY, JSON.stringify(initial));
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

    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  return data;
}

export async function loseLife() {
  const data = await getLives();

  const next = {
    ...data,
    lives: Math.max(0, data.lives - 1),
    lastUpdated: Date.now(),
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function addLife() {
  const data = await getLives();

  const next = {
    ...data,
    lives: Math.min(MAX_LIVES, data.lives + 1),
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function getNextLifeTime() {
  const data = await getLives();

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
}