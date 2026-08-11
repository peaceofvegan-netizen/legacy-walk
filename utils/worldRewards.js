import AsyncStorage from "@react-native-async-storage/async-storage";
import { addWCoins } from "./wcoinStorage";
import { addPowerCount } from "./powerStorage";

const CLAIMED_WORLD_REWARDS_KEY = "@LEGATHON_CLAIMED_WORLD_REWARDS";

const WORLD_REWARDS = {
  1: { label: "+500 W Coins", type: "coins", amount: 500 },
  2: { label: "+1 Rocket", type: "power", power: "rocket", amount: 1 },
  3: { label: "+1 Bomb", type: "power", power: "bomb", amount: 1 },
  4: { label: "+3 Hammers", type: "power", power: "hammer", amount: 3 },
  5: { label: "+1 Hat", type: "power", power: "hat", amount: 1 },
};

export async function claimWorldReward(worldId) {
  const saved = await AsyncStorage.getItem(CLAIMED_WORLD_REWARDS_KEY);
  const claimed = saved ? JSON.parse(saved) : {};

  if (claimed[worldId]) {
    return { claimed: false, message: "Reward already claimed." };
  }

  const reward = WORLD_REWARDS[worldId];

  if (!reward) {
    return { claimed: false, message: "No reward found." };
  }

  if (reward.type === "coins") {
    await addWCoins(reward.amount);
  }

  if (reward.type === "power") {
    await addPowerCount(reward.power, reward.amount);
  }

  const nextClaimed = {
    ...claimed,
    [worldId]: true,
  };

  await AsyncStorage.setItem(
    CLAIMED_WORLD_REWARDS_KEY,
    JSON.stringify(nextClaimed)
  );

  return {
    claimed: true,
    message: reward.label,
  };
}