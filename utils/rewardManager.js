import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
// utils/rewardManager.js



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
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  const results = [];

  for (const reward of rewards) {
    try {
      switch (reward.type) {

        case "wcoins":
          await _accountSession.run(async () => (addWCoins(reward.amount || 0)));
          results.push(`+${reward.amount} WCoins`);
          break;

        case "points":
          await _accountSession.run(async () => (addLegathonPoints(reward.amount || 0)));
          results.push(`+${reward.amount} Legathon Points`);
          break;

        case "tracksuit":
          await _accountSession.run(async () => (unlockTrackSuit(reward.id)));
          results.push(`Unlocked Tracksuit: ${reward.id}`);
          break;

        case "badge":
          await _accountSession.run(async () => (unlockBadge(reward.id)));
          results.push(`Unlocked Badge: ${reward.id}`);
          break;

        case "passport":
          await _accountSession.run(async () => (unlockPassportStamp(reward.id)));
          results.push(`Passport Stamp: ${reward.id}`);
          break;

        case "certificate":
          await _accountSession.run(async () => (unlockCertificate(reward.id)));
          results.push(`Certificate: ${reward.id}`);
          break;

        case "rank":
          await _accountSession.run(async () => (unlockRank(reward.id)));
          results.push(`Rank: ${reward.id}`);
          break;

        default:
          console.log("Unknown reward:", reward);
      }
    } catch (e) {
    if (isAccountSessionEnded(e)) throw e;

      console.log("Reward Error:", reward, e);
    }
  }

  return results;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function unlockTrackSuit(id) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  if (!id) return;

  const saved =
    await _accountSession2.run(async () => (AsyncStorage.getItem(
      KEYS.TRACKSUITS
    )));

  let stored = [];

  try {
    stored = saved
      ? JSON.parse(saved)
      : [];
  } catch (_cancelledError) {
    if (isAccountSessionEnded(_cancelledError)) throw _cancelledError;

    stored = [];
  }

  if (!Array.isArray(stored)) {
    stored = [];
  }

  if (!stored.includes(id)) {
    stored.push(id);

    await _accountSession2.run(async () => (AsyncStorage.setItem(
      KEYS.TRACKSUITS,
      JSON.stringify(stored)
    )));
  }

  // Do not automatically equip the tracksuit.
  // The user must select an unlocked suit
  // from the Avatar Center.

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

 

async function unlockBadge(id) {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  if (!id) return;

  const stored =
    JSON.parse(await _accountSession3.run(async () => (AsyncStorage.getItem(KEYS.BADGES)))) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await _accountSession3.run(async () => (AsyncStorage.setItem(
      KEYS.BADGES,
      JSON.stringify(stored)
    )));
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function unlockPassportStamp(id) {
  const _accountSession4 = captureAccountSession();
  const AsyncStorage = _accountSession4.storage;

  try {
    _accountSession4.assertCurrent();

  if (!id) return;

  const stored =
    JSON.parse(await _accountSession4.run(async () => (AsyncStorage.getItem(KEYS.PASSPORT)))) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await _accountSession4.run(async () => (AsyncStorage.setItem(
      KEYS.PASSPORT,
      JSON.stringify(stored)
    )));
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function unlockCertificate(id) {
  const _accountSession5 = captureAccountSession();
  const AsyncStorage = _accountSession5.storage;

  try {
    _accountSession5.assertCurrent();

  if (!id) return;

  const stored =
    JSON.parse(await _accountSession5.run(async () => (AsyncStorage.getItem(KEYS.CERTIFICATES)))) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await _accountSession5.run(async () => (AsyncStorage.setItem(
      KEYS.CERTIFICATES,
      JSON.stringify(stored)
    )));
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function unlockRank(id) {
  const _accountSession6 = captureAccountSession();
  const AsyncStorage = _accountSession6.storage;

  try {
    _accountSession6.assertCurrent();

  if (!id) return;

  const stored =
    JSON.parse(await _accountSession6.run(async () => (AsyncStorage.getItem(KEYS.RANKS)))) || [];

  if (!stored.includes(id)) {
    stored.push(id);
    await _accountSession6.run(async () => (AsyncStorage.setItem(
      KEYS.RANKS,
      JSON.stringify(stored)
    )));
  }

  await _accountSession6.run(async () => (AsyncStorage.setItem("currentRank", id)));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}