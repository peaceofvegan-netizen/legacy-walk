import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLegathonRank } from "./legathonRankSystem";

const STORAGE = {
  TOTAL: "@legathon_points_total",
  HISTORY: "@legathon_points_history",
  AWARDS: "@legathon_points_awards",
  LAST_UPDATED: "@legathon_last_updated",
};

async function getJSON(key, fallback) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function setJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getTotalPoints() {
  const total = await AsyncStorage.getItem(STORAGE.TOTAL);
  return Number(total || 0);
}

export async function getPointHistory() {
  return await getJSON(STORAGE.HISTORY, []);
}

export async function hasAward(id) {
  const awards = await getJSON(STORAGE.AWARDS, {});
  return awards[id] === true;
}

export async function addPoints(transaction) {
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

  const awards = await getJSON(STORAGE.AWARDS, {});

  if (awards[id]) {
    const total = await getTotalPoints();

    return {
      success: false,
      duplicate: true,
      totalPoints: total,
    };
  }

  const history = await getJSON(STORAGE.HISTORY, []);

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

  const previousTotal = await getTotalPoints();
  const totalPoints = previousTotal + Number(points);

  await AsyncStorage.multiSet([
    [STORAGE.TOTAL, String(totalPoints)],
    [STORAGE.LAST_UPDATED, new Date().toISOString()],
  ]);

  await setJSON(STORAGE.HISTORY, history);
  await setJSON(STORAGE.AWARDS, awards);

  const rank = getLegathonRank(totalPoints);

  return {
    success: true,
    duplicate: false,
    pointsAwarded: Number(points),
    totalPoints,
    rank,
    transaction: record,
  };
}