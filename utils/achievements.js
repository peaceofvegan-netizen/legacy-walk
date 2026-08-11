import AsyncStorage from "@react-native-async-storage/async-storage";

import { loadUserStats } from "./userStatsStorage";
import { addWCoins } from "./wCoinStorage";
import { addWCoinTransaction } from "./wCoinTransactions";

const ACHIEVEMENTS_KEY = "legacywalk_achievements_v1";

export const ACHIEVEMENTS = [
  {
    id: "freedom-walker",
    title: "Freedom Walker",
    icon: "🏅",
    description: "Complete the Selma Freedom Walk.",
    rewardCoins: 500,
  },
  {
    id: "wellness-explorer",
    title: "Wellness Explorer",
    icon: "🧘",
    description: "Complete 5 wellness journeys.",
    rewardCoins: 750,
  },
  {
    id: "marathon-finisher",
    title: "Marathon Finisher",
    icon: "🏃",
    description: "Complete your first 26.2 challenge.",
    rewardCoins: 500,
  },
  {
    id: "world-explorer",
    title: "World Explorer",
    icon: "🌍",
    description: "Explore 10 countries.",
    rewardCoins: 1000,
  },
  {
    id: "momentum-master",
    title: "Momentum Master",
    icon: "🔥",
    description: "Reach a 100-day walking streak.",
    rewardCoins: 1200,
  },
  {
    id: "legendary-walker",
    title: "Legendary Walker",
    icon: "🏆",
    description: "Complete 50 Legacy Journeys.",
    rewardCoins: 2500,
  },
  {
    id: "black-legacy-member",
    title: "Black Legacy Member",
    icon: "👑",
    description: "Complete the Black Legacy collection.",
    rewardCoins: 5000,
  },
];

const DEFAULT_PROGRESS = {
  completedJourneys: 1,
  completedWellnessJourneys: 0,
  completedMarathons: 0,
  countriesExplored: 1,
  completedBlackLegacyCollection: false,
};

export async function loadUnlockedAchievements() {
  const saved = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function saveUnlockedAchievements(ids) {
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids));
}

export async function checkAchievements(extraProgress = {}) {
  const stats = await loadUserStats();
  const unlocked = await loadUnlockedAchievements();

  const progress = {
    ...DEFAULT_PROGRESS,
    ...extraProgress,
  };

  const newlyUnlocked = [];

  function unlockIf(condition, achievementId) {
    if (!condition) return;
    if (unlocked.includes(achievementId)) return;

    const achievement = ACHIEVEMENTS.find((item) => item.id === achievementId);
    if (!achievement) return;

    unlocked.push(achievementId);
    newlyUnlocked.push(achievement);
  }

  unlockIf(progress.completedJourneys >= 1, "freedom-walker");
  unlockIf(progress.completedWellnessJourneys >= 5, "wellness-explorer");
  unlockIf(progress.completedMarathons >= 1, "marathon-finisher");
  unlockIf(progress.countriesExplored >= 10, "world-explorer");
  unlockIf((stats.dayStreak || 0) >= 100, "momentum-master");
  unlockIf(progress.completedJourneys >= 50, "legendary-walker");
  unlockIf(progress.completedBlackLegacyCollection, "black-legacy-member");

  await saveUnlockedAchievements(unlocked);

  for (const achievement of newlyUnlocked) {
    await addWCoins(achievement.rewardCoins);

    await addWCoinTransaction({
      type: "earned",
      amount: achievement.rewardCoins,
      title: `Achievement unlocked: ${achievement.title}`,
    });
  }

  return {
    unlocked,
    newlyUnlocked,
  };
}

export async function resetAchievements() {
  await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
}