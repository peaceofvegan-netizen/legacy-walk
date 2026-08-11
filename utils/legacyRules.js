export const LEGACY_LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    colorName: "White",
    color: "#FFFFFF",
    minSteps: 0,
    collections: ["white"],
  },
  {
    id: "explorer",
    title: "Explorer",
    colorName: "Blue",
    color: "#3B82F6",
    minSteps: 10000,
    collections: ["white", "blue"],
  },
  {
    id: "pathfinder",
    title: "Pathfinder",
    colorName: "Green",
    color: "#22C55E",
    minSteps: 50000,
    collections: ["white", "blue", "green"],
  },
  {
    id: "trailblazer",
    title: "Trailblazer",
    colorName: "Red",
    color: "#EF4444",
    minSteps: 250000,
    collections: ["white", "blue", "green", "red"],
  },
  {
    id: "legend",
    title: "Legend",
    colorName: "Gold",
    color: "#D4AF37",
    minSteps: 1000000,
    collections: ["white", "blue", "green", "red", "gold"],
  },
  {
    id: "blackLegacy",
    title: "Black Legacy",
    colorName: "Black + Gold",
    color: "#111111",
    minSteps: 5000000,
    collections: ["white", "blue", "green", "red", "gold", "blackGold"],
  },
];

export function getLegacyLevel(totalSteps = 0) {
  let currentLevel = LEGACY_LEVELS[0];

  for (const level of LEGACY_LEVELS) {
    if (totalSteps >= level.minSteps) {
      currentLevel = level;
    }
  }

  return currentLevel;
}

export function getNextLegacyLevel(totalSteps = 0) {
  return (
    LEGACY_LEVELS.find((level) => totalSteps < level.minSteps) || null
  );
}

export function getLegacyProgress(totalSteps = 0) {
  const currentLevel = getLegacyLevel(totalSteps);
  const nextLevel = getNextLegacyLevel(totalSteps);

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      stepsRemaining: 0,
    };
  }

  const levelStart = currentLevel.minSteps;
  const levelEnd = nextLevel.minSteps;
  const progress = totalSteps - levelStart;
  const required = levelEnd - levelStart;

  return {
    currentLevel,
    nextLevel,
    progressPercent: Math.min(100, Math.round((progress / required) * 100)),
    stepsRemaining: Math.max(0, nextLevel.minSteps - totalSteps),
  };
}

export function getUnlockedCollections(totalSteps = 0) {
  const currentLevel = getLegacyLevel(totalSteps);
  return currentLevel.collections;
}

export function canAccessCollection(totalSteps = 0, collectionId) {
  return getUnlockedCollections(totalSteps).includes(collectionId);
}

export function canPurchaseProduct(totalSteps = 0, product) {
  if (!product?.collectionId) return true;
  return canAccessCollection(totalSteps, product.collectionId);
}

export function getLockedMessage(product) {
  const requiredLevel = LEGACY_LEVELS.find((level) =>
    level.collections.includes(product.collectionId)
  );

  if (!requiredLevel) return "Complete more steps to unlock this item.";

  return `Unlock at ${requiredLevel.minSteps.toLocaleString()} steps`;
}