import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";

import { getLegathonRank } from "./legathonRankSystem";

const STORAGE = {
  TOTAL: "@legathon_points_total",
  HISTORY: "@legathon_points_history",
  AWARDS: "@legathon_points_awards",
  LAST_UPDATED: "@legathon_last_updated",
};

async function getJSON(key, fallback) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const value = await _accountSession.run(async () => (AsyncStorage.getItem(key)));
    return value ? JSON.parse(value) : fallback;
  } catch (_cancelledError) {
    if (isAccountSessionEnded(_cancelledError)) throw _cancelledError;

    return fallback;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function setJSON(key, value) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  await _accountSession2.run(async () => (AsyncStorage.setItem(key, JSON.stringify(value))));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getTotalPoints() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  const total = await _accountSession3.run(async () => (AsyncStorage.getItem(STORAGE.TOTAL)));
  return Number(total || 0);

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getPointHistory() {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  return await _accountSession4.run(async () => (getJSON(STORAGE.HISTORY, [])));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function hasAward(id) {
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  const awards = await _accountSession5.run(async () => (getJSON(STORAGE.AWARDS, {})));
  return awards[id] === true;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addPoints(transaction) {
  const _accountSession6 = captureAccountSession();
  const AsyncStorage = _accountSession6.storage;

  try {
    _accountSession6.assertCurrent();

  const {
    id,
    title,
    category,
    points,
    source = "",
    metadata = {},
  } = transaction;

  if (!id) throw new Error("Transaction id required.");
  if (!title) throw new Error("Title required.");
  if (!category) throw new Error("Category required.");
  if (Number(points) <= 0) throw new Error("Points must be greater than zero.");

  const awards = await _accountSession6.run(async () => (getJSON(STORAGE.AWARDS, {})));

  if (awards[id]) {
    const total = await _accountSession6.run(async () => (getTotalPoints()));

    return {
      success: false,
      duplicate: true,
      totalPoints: total,
    };
  }

  const history = await _accountSession6.run(async () => (getJSON(STORAGE.HISTORY, [])));

  const record = {
    id,
    title,
    category,
    source,
    points: Number(points),
    metadata,
    timestamp: new Date().toISOString(),
  };

  history.unshift(record);

  awards[id] = true;

  const previousTotal = await _accountSession6.run(async () => (getTotalPoints()));
  const totalPoints = previousTotal + Number(points);

  await _accountSession6.run(async () => (AsyncStorage.multiSet([
    [STORAGE.TOTAL, String(totalPoints)],
    [STORAGE.LAST_UPDATED, new Date().toISOString()],
  ])));

  await _accountSession6.run(async () => (setJSON(STORAGE.HISTORY, history)));
  await _accountSession6.run(async () => (setJSON(STORAGE.AWARDS, awards)));

  const rank = getLegathonRank(totalPoints);

  return {
    success: true,
    duplicate: false,
    pointsAwarded: Number(points),
    totalPoints,
    rank,
    transaction: record,
  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}