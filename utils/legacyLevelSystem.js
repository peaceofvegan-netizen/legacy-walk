export const LEGACY_LEVELS = [
  {
    level: 0,
    id: "new_walker",
    title: "New Walker",
    minSteps: 0,
    maxSteps: 9999,
    themeColor: "#05070C",
    rewards: ["Default black hoodie", "Default black joggers", "Default black shoes"],
  },
  {
    level: 1,
    id: "explorer",
    title: "Explorer",
    minSteps: 10000,
    maxSteps: 49999,
    themeColor: "#3B82F6",
    rewards: ["Blue shoes", "Blue W badge", "Blue outfit set"],
  },
  {
    level: 2,
    id: "pathfinder",
    title: "Pathfinder",
    minSteps: 50000,
    maxSteps: 249999,
    themeColor: "#22C55E",
    rewards: ["Green shoes", "Green tracksuit", "Green headphones"],
  },
  {
    level: 3,
    id: "trailblazer",
    title: "Trailblazer",
    minSteps: 250000,
    maxSteps: 999999,
    themeColor: "#EF4444",
    rewards: ["Red shoes", "Red tracksuit", "Red headphones", "Walking trail effect"],
  },
  {
    level: 4,
    id: "legend",
    title: "Legend",
    minSteps: 1000000,
    maxSteps: 4999999,
    themeColor: "#E0AE25",
    rewards: ["Gold shoes", "Gold compression gear", "Gold headphones", "Gold W Coin necklace"],
  },
  {
    level: 5,
    id: "black_legacy_walker",
    title: "Black Legacy Walker",
    minSteps: 5000000,
    maxSteps: Infinity,
    themeColor: "#E0AE25",
    rewards: ["Black & Gold collection", "Crown", "Gold aura", "Golden footsteps", "Legacy title"],
  },
];

export function getLegacyLevel(totalSteps = 0) {
  return (
    LEGACY_LEVELS.find(
      (level) => totalSteps >= level.minSteps && totalSteps <= level.maxSteps
    ) || LEGACY_LEVELS[0]
  );
}

export function getNextLegacyLevel(totalSteps = 0) {
  return LEGACY_LEVELS.find((level) => totalSteps < level.minSteps) || null;
}

export function getLegacyProgress(totalSteps = 0) {
  const currentLevel = getLegacyLevel(totalSteps);
  const nextLevel = getNextLegacyLevel(totalSteps);

  if (!nextLevel) {
    return { currentLevel, nextLevel: null, percent: 100, remainingSteps: 0 };
  }

  const range = nextLevel.minSteps - currentLevel.minSteps;
  const progressSteps = totalSteps - currentLevel.minSteps;

  return {
    currentLevel,
    nextLevel,
    percent: Math.min(Math.round((progressSteps / range) * 100), 100),
    remainingSteps: nextLevel.minSteps - totalSteps,
  };
}

export function isLegacyRewardUnlocked(totalSteps = 0, requiredSteps = 0) {
  return totalSteps >= requiredSteps;
}