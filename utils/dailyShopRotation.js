import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";

import { STORE_ITEMS } from "./avatarStoreData";

const DAILY_SHOP_KEY = "LEGACY_WALK_DAILY_SHOP";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function rotateItemsForToday() {
  const today = getTodayKey();
  const seed = today.split("-").join("");

  const shuffled = [...STORE_ITEMS].sort((a, b) => {
    const aScore = (a.id + seed).length % 7;
    const bScore = (b.id + seed).length % 7;
    return aScore - bScore;
  });

  return shuffled.slice(0, 4);
}

export async function loadDailyShop() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const today = getTodayKey();
  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(DAILY_SHOP_KEY)));

  if (saved) {
    const parsed = JSON.parse(saved);

    if (parsed.date === today) {
      return parsed;
    }
  }

  const newShop = {
    date: today,
    featuredItems: rotateItemsForToday(),
  };

  await _accountSession.run(async () => (AsyncStorage.setItem(DAILY_SHOP_KEY, JSON.stringify(newShop))));

  return newShop;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export function getDailyShopCountdown() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  return `${hours}h ${minutes}m`;
}