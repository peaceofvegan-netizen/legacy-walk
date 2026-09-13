// utils/rewardManager.js

import AsyncStorage from "@react-native-async-storage/async-storage";

import { addWCoins } from "./wcoinStorage";
import { addLegathonPoints } from "./legacyPointsManager";

const KEYS = {
  TRACKSUITS: "unlockedTracksuits",
  BADGES: "unlockedBadges",
  PASSPORT: "passportStamps",
  CERTIFICATES: "earnedCertificates",
  RANKS: "unlockedRanks",
};

export async function processRewards(rewards = []) {
  const results = [];

  for (const reward of rewards) {
    try {
      switch (reward.type) {

        case "wcoins":
          await addWCoins(reward.amount || 0);
          results.push(`+${reward.amount} WCoins`);
          break;

        case "points":
          await addLegathonPoints(reward.amount || 0);
          results.push(`+${reward.amount} Legathon Points`);
          break;

        case "tracksuit":
          await unlockTrackSuit(reward.id);
          results.push(`Unlocked Tracksuit: ${reward.id}`);
          break;

        case "badge":
          await unlockBadge(reward.id);
          results.push(`Unlocked Badge: ${reward.id}`);
          break;

        case "passport":
          await unlockPassportStamp(reward.id);
          results.push(`Passport Stamp: ${reward.id}`);
          break;

        case "certificate":
          await unlockCertificate(reward.id);
          results.push(`Certificate: ${reward.id}`);
          break;

        case "rank":
          await unlockRank(reward.id);
          results.push(`Rank: ${reward.id}`);
          break;

        default:
          console.log("Unknown reward:", reward);
      }
    } catch (e) {
      console.log("Reward Error:", reward, e);
    }
  }

  return results;
}

async function unlockTrackSuit(id) {
  if (!id) return;

  const saved =
    await AsyncStorage.getItem(
      KEYS.TRACKSUITS
    );

  let stored = [];

  try {
    stored = saved
      ? JSON.parse(saved)
      : [];
  } catch {
    stored = [];
  }

  if (!Array.isArray(stored)) {
    stored = [];
  }

  if (!stored.includes(id)) {
    stored.push(id);

    await AsyncStorage.setItem(
      KEYS.TRACKSUITS,
      JSON.stringify(stored)
    );
  }

  // Do not automatically equip the tracksuit.
  // The user must select an unlocked suit
  // from the Avatar Center.
}

 

async function unlockBadge(id) {
  if (!id) return;

  const stored =
    JSON.parse(await AsyncStorage.getItem(KEYS.BADGES)) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await AsyncStorage.setItem(
      KEYS.BADGES,
      JSON.stringify(stored)
    );
  }
}

async function unlockPassportStamp(id) {
  if (!id) return;

  const stored =
    JSON.parse(await AsyncStorage.getItem(KEYS.PASSPORT)) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await AsyncStorage.setItem(
      KEYS.PASSPORT,
      JSON.stringify(stored)
    );
  }
}

async function unlockCertificate(id) {
  if (!id) return;

  const stored =
    JSON.parse(await AsyncStorage.getItem(KEYS.CERTIFICATES)) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await AsyncStorage.setItem(
      KEYS.CERTIFICATES,
      JSON.stringify(stored)
    );
  }
}

async function unlockRank(id) {
  if (!id) return;

  const stored =
    JSON.parse(await AsyncStorage.getItem(KEYS.RANKS)) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await AsyncStorage.setItem(
      KEYS.RANKS,
      JSON.stringify(stored)
    );
  }

  await AsyncStorage.setItem("currentRank", id);
}