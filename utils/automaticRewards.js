import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";

import { addWCoins } from "./wCoinStorage";
import { addWCoinTransaction } from "./wCoinTransactions";

const AUTO_REWARD_KEY = "legacywalk_auto_reward_steps_v1";

export async function loadLastRewardedSteps() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(AUTO_REWARD_KEY)));
  return saved ? Number(saved) : 0;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveLastRewardedSteps(steps) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  await _accountSession2.run(async () => (AsyncStorage.setItem(AUTO_REWARD_KEY, String(steps))));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function rewardCoinsForSteps(totalSteps) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const lastRewardedSteps = await _accountSession3.run(async () => (loadLastRewardedSteps()));

  const newRewardableSteps = totalSteps - lastRewardedSteps;

  if (newRewardableSteps < 100) {
    return {
      coinsEarned: 0,
      lastRewardedSteps,
    };
  }

  const coinsEarned = Math.floor(newRewardableSteps / 100);
  const updatedRewardedSteps = lastRewardedSteps + coinsEarned * 100;

  await _accountSession3.run(async () => (addWCoins(coinsEarned)));
  await _accountSession3.run(async () => (saveLastRewardedSteps(updatedRewardedSteps)));

  await _accountSession3.run(async () => (addWCoinTransaction({
    type: "earned",
    amount: coinsEarned,
    title: `Automatic walking reward: ${coinsEarned} W Coins`,
  })));

  return {
    coinsEarned,
    lastRewardedSteps: updatedRewardedSteps,
  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}