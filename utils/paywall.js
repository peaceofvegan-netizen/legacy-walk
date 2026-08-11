export function isJourneyLocked(journey, plan = "free") {
  if (!journey) return false;

  const premiumCategories = [
    "Ultimate Legacy Challenge",
    "Mental Wellness",
  ];

  if (plan === "legendary") return false;

  if (plan === "premium") {
    return journey.category === "Ultimate Legacy Challenge";
  }

  return premiumCategories.includes(journey.category);
}

export function getUpgradeMessage(journey) {
  if (journey?.category === "Ultimate Legacy Challenge") {
    return "Upgrade to Legendary Walker to unlock elite challenges.";
  }

  return "Upgrade to Premium Walker to unlock this journey.";
}