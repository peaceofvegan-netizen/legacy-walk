import AsyncStorage from "@react-native-async-storage/async-storage";

const CHALLENGE_REWARDS_KEY = "LEGACY_WALK_CHALLENGE_REWARDS";

export const DAILY_CHALLENGE_REWARDS = {
  steps: {
    title: "Daily Step Goal Complete",
    coins: 50,
    badge: "Daily Walker",
  },
  breathing: {
    title: "Recovery Reset Complete",
    coins: 25,
    badge: "Calm Reset",
  },
  journey: {
    title: "Journey Push Complete",
    coins: 75,
    badge: "Journey Builder",
  },
};

export async function loadChallengeRewards() {
  const saved = await AsyncStorage.getItem(CHALLENGE_REWARDS_KEY);

  return saved
    ? JSON.parse(saved)
    : {
        coins: 0,
        streak: 0,
        badges: [],
        completedToday: [],
        history: [],
      };
}

export async function completeDailyChallenge(challengeId) {
  const reward = DAILY_CHALLENGE_REWARDS[challengeId];

  if (!reward) {
    return {
      success: false,
      message: "Challenge reward not found.",
    };
  }

  const current = await loadChallengeRewards();

  if (current.completedToday.includes(challengeId)) {
    return {
      success: false,
      message: "Challenge already completed today.",
      rewards: current,
    };
  }

  const allCompletedToday = [
    challengeId,
    ...current.completedToday,
  ];

  const streakBonus =
    allCompletedToday.length >= 3 ? 25 : 0;

  const updated = {
    coins: current.coins + reward.coins + streakBonus,
    streak:
      allCompletedToday.length >= 3
        ? current.streak + 1
        : current.streak,
    badges: current.badges.includes(reward.badge)
      ? current.badges
      : [reward.badge, ...current.badges],
    completedToday: allCompletedToday,
    history: [
      {
        id: Date.now(),
        challengeId,
        title: reward.title,
        coinsEarned: reward.coins,
        streakBonus,
        completedAt: new Date().toISOString(),
      },
      ...current.history,
    ],
  };

  await AsyncStorage.setItem(
    CHALLENGE_REWARDS_KEY,
    JSON.stringify(updated)
  );

  return {
    success: true,
    reward: {
      ...reward,
      streakBonus,
      totalCoins: reward.coins + streakBonus,
    },
    rewards: updated,
  };
}

export async function resetDailyChallenges() {
  const current = await loadChallengeRewards();

  const updated = {
    ...current,
    completedToday: [],
  };

  await AsyncStorage.setItem(
    CHALLENGE_REWARDS_KEY,
    JSON.stringify(updated)
  );

  return updated;
}