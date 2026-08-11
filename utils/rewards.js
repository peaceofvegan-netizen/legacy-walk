export const REWARD_TIERS = [
  {
    id: "reward_5",
    title: "$5 Reward Eligibility",
    pointsRequired: 2500,
    cashValue: "$5",
  },

  {
    id: "reward_10",
    title: "$10 Reward Eligibility",
    pointsRequired: 10000,
    cashValue: "$10",
  },

  {
    id: "reward_25",
    title: "$25 Reward Eligibility",
    pointsRequired: 25000,
    cashValue: "$25",
  },

  {
    id: "reward_50",
    title: "$50 Sponsor Reward Eligibility",
    pointsRequired: 50000,
    cashValue: "$50",
  },

  {
    id: "grand_prize",
    title: "Premium Prize Drawing / Sponsor Experience",
    pointsRequired: 100000,
    cashValue: "Sponsor Experience",
    requiresLegacyChallenge: true,
  }
];
export function calculateAvailableRewardTiers(points = 0, legacyCompleted = false) {
  return REWARD_TIERS.map((tier) => ({
    ...tier,
    unlocked:
      points >= tier.pointsRequired &&
      (!tier.requiresLegacyChallenge || legacyCompleted),
  }));
}