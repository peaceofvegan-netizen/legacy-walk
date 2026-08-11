import AsyncStorage from "@react-native-async-storage/async-storage";
import { addWCoins } from "./wCoinStorage";
import { addWCoinTransaction } from "./wCoinTransactions";

const AUTO_REWARD_KEY = "legacywalk_auto_reward_steps_v1";

export async function loadLastRewardedSteps() {
  const saved = await AsyncStorage.getItem(AUTO_REWARD_KEY);
  return saved ? Number(saved) : 0;
}

export async function saveLastRewardedSteps(steps) {
  await AsyncStorage.setItem(AUTO_REWARD_KEY, String(steps));
}

export async function rewardCoinsForSteps(totalSteps) {
  const lastRewardedSteps = await loadLastRewardedSteps();

  const newRewardableSteps = totalSteps - lastRewardedSteps;

  if (newRewardableSteps < 100) {
    return {
      coinsEarned: 0,
      lastRewardedSteps,
    };
  }

  const coinsEarned = Math.floor(newRewardableSteps / 100);
  const updatedRewardedSteps = lastRewardedSteps + coinsEarned * 100;

  await addWCoins(coinsEarned);
  await saveLastRewardedSteps(updatedRewardedSteps);

  await addWCoinTransaction({
    type: "earned",
    amount: coinsEarned,
    title: `Automatic walking reward: ${coinsEarned} W Coins`,
  });

  return {
    coinsEarned,
    lastRewardedSteps: updatedRewardedSteps,
  };
}