// utils/tracksuitConfig.js

// ============================================================
// LEGATHON WALK — TRACKSUIT CONFIGURATION
// ============================================================
//
// TRACKSUIT PROGRESSION RULE
//
// Tracksuits unlock from JOURNEY LIFETIME STEPS ONLY.
//
// Marathon steps DO NOT count.
//
// Each tier requires ADDITIONAL steps after the previous tier:
//
// BLUE
// +150,000
// Lifetime unlock: 150,000
//
// GREEN
// +250,000
// Lifetime unlock: 400,000
//
// RED
// +350,000
// Lifetime unlock: 750,000
//
// YELLOW
// +500,000
// Lifetime unlock: 1,250,000
//
// ELITE BLACK & GOLD
// +3,000,000
// Lifetime unlock: 4,250,000
//
// Tracksuits are earned by walking.
// They are NOT purchased.
//
// ============================================================


// ============================================================
// TRACKSUIT IDS
// ============================================================

export const TRACKSUIT_IDS =
  Object.freeze({
    BLUE:
      "blue",

    GREEN:
      "green",

    RED:
      "red",

    YELLOW:
      "yellow",

    ELITE:
      "elite",
  });


// ============================================================
// TRACKSUIT LEVELS
// ============================================================

export const TRACKSUIT_LEVELS =
  Object.freeze({
    blue: 1,
    green: 2,
    red: 3,
    yellow: 4,
    elite: 5,
  });


// ============================================================
// TRACKSUIT STEP REQUIREMENTS
// ============================================================
//
// tierSteps = additional steps required for this tier
//
// unlockAt = cumulative Journey Lifetime Steps required
//
// ============================================================

export const TRACKSUIT_TIERS =
  Object.freeze([

    // --------------------------------------------------------
    // BLUE
    // --------------------------------------------------------

    {
      id:
        "blue",

      level: 1,

      name:
        "Blue Tracksuit",

      shortName:
        "Blue",

      tierSteps:
        150000,

      unlockAt:
        150000,

      previousUnlockAt:
        0,

      premiumRequired:
        true,

      eliteRequired:
        false,

      purchasable:
        false,
    },


    // --------------------------------------------------------
    // GREEN
    // --------------------------------------------------------

    {
      id:
        "green",

      level: 2,

      name:
        "Green Tracksuit",

      shortName:
        "Green",

      tierSteps:
        250000,

      unlockAt:
        400000,

      previousUnlockAt:
        150000,

      premiumRequired:
        true,

      eliteRequired:
        false,

      purchasable:
        false,
    },


    // --------------------------------------------------------
    // RED
    // --------------------------------------------------------

    {
      id:
        "red",

      level: 3,

      name:
        "Red Tracksuit",

      shortName:
        "Red",

      tierSteps:
        350000,

      unlockAt:
        750000,

      previousUnlockAt:
        400000,

      premiumRequired:
        true,

      eliteRequired:
        false,

      purchasable:
        false,
    },


    // --------------------------------------------------------
    // YELLOW
    // --------------------------------------------------------

    {
      id:
        "yellow",

      level: 4,

      name:
        "Yellow Tracksuit",

      shortName:
        "Yellow",

      tierSteps:
        500000,

      unlockAt:
        1250000,

      previousUnlockAt:
        750000,

      premiumRequired:
        true,

      eliteRequired:
        false,

      purchasable:
        false,
    },


    // --------------------------------------------------------
    // ELITE BLACK & GOLD
    // --------------------------------------------------------

    {
      id:
        "elite",

      level: 5,

      name:
        "Black & Gold Elite Tracksuit",

      shortName:
        "Elite",

      tierSteps:
        3000000,

      unlockAt:
        4250000,

      previousUnlockAt:
        1250000,

      premiumRequired:
        true,

      eliteRequired:
        true,

      purchasable:
        false,
    },

  ]);


// ============================================================
// COMPATIBILITY EXPORT
// ============================================================
//
// Some existing screens may import TRACKSUITS rather than
// TRACKSUIT_TIERS.
//
// ============================================================

export const TRACKSUITS =
  TRACKSUIT_TIERS;


// ============================================================
// TOTAL NUMBER OF TRACKSUITS
// ============================================================

export const TOTAL_TRACKSUITS =
  TRACKSUIT_TIERS.length;


// ============================================================
// FINAL TRACKSUIT UNLOCK
// ============================================================

export const FINAL_TRACKSUIT_UNLOCK =
  TRACKSUIT_TIERS[
    TRACKSUIT_TIERS.length - 1
  ].unlockAt;


// ============================================================
// NORMALIZE TRACKSUIT ID
// ============================================================

export function normalizeTracksuitId(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const suit =
    String(value)
      .trim()
      .toLowerCase();


  if (
    suit.includes(
      "blue"
    )
  ) {
    return "blue";
  }


  if (
    suit.includes(
      "green"
    )
  ) {
    return "green";
  }


  if (
    suit.includes(
      "red"
    )
  ) {
    return "red";
  }


  if (
    suit.includes(
      "yellow"
    )
  ) {
    return "yellow";
  }


  if (
    suit.includes(
      "elite"
    ) ||
    suit.includes(
      "blackgold"
    ) ||
    suit.includes(
      "black-gold"
    ) ||
    suit.includes(
      "black_gold"
    ) ||
    suit.includes(
      "black & gold"
    ) ||
    suit.includes(
      "black and gold"
    )
  ) {
    return "elite";
  }


  return null;
}


// ============================================================
// GET TRACKSUIT BY ID
// ============================================================

export function getTracksuitById(
  suitId
) {
  const normalized =
    normalizeTracksuitId(
      suitId
    );


  if (!normalized) {
    return null;
  }


  return (
    TRACKSUIT_TIERS.find(
      (suit) =>
        suit.id ===
        normalized
    ) || null
  );
}


// ============================================================
// GET TRACKSUIT BY LEVEL
// ============================================================

export function getTracksuitByLevel(
  level
) {
  const numericLevel =
    Number(level);


  if (
    !Number.isFinite(
      numericLevel
    )
  ) {
    return null;
  }


  return (
    TRACKSUIT_TIERS.find(
      (suit) =>
        suit.level ===
        numericLevel
    ) || null
  );
}


// ============================================================
// GET NEXT TRACKSUIT
// ============================================================

export function getNextTracksuit(
  lifetimeSteps
) {
  const steps =
    Math.max(
      0,
      Number(
        lifetimeSteps
      ) || 0
    );


  return (
    TRACKSUIT_TIERS.find(
      (suit) =>
        steps <
        suit.unlockAt
    ) || null
  );
}


// ============================================================
// GET HIGHEST UNLOCKED TRACKSUIT
// ============================================================

export function getHighestUnlockedTracksuit(
  lifetimeSteps
) {
  const steps =
    Math.max(
      0,
      Number(
        lifetimeSteps
      ) || 0
    );


  let highest =
    null;


  for (
    const suit of
    TRACKSUIT_TIERS
  ) {

    if (
      steps >=
      suit.unlockAt
    ) {
      highest =
        suit;
    }

  }


  return highest;
}


// ============================================================
// GET UNLOCKED TRACKSUITS
// ============================================================

export function getUnlockedTracksuits(
  lifetimeSteps
) {
  const steps =
    Math.max(
      0,
      Number(
        lifetimeSteps
      ) || 0
    );


  return TRACKSUIT_TIERS.filter(
    (suit) =>
      steps >=
      suit.unlockAt
  );
}


// ============================================================
// IS TRACKSUIT STEP-UNLOCKED
// ============================================================
//
// Subscription eligibility is intentionally handled separately.
//
// This function answers only:
//
// Has the walker completed enough Journey Lifetime Steps?
//
// ============================================================

export function isTracksuitUnlockedBySteps(
  suitId,
  lifetimeSteps
) {
  const suit =
    getTracksuitById(
      suitId
    );


  if (!suit) {
    return false;
  }


  const steps =
    Math.max(
      0,
      Number(
        lifetimeSteps
      ) || 0
    );


  return (
    steps >=
    suit.unlockAt
  );
}


// ============================================================
// SUBSCRIPTION ELIGIBILITY
// ============================================================
//
// Basic:
// no tracksuit access
//
// Premium:
// Blue / Green / Red / Yellow
//
// Elite:
// Blue / Green / Red / Yellow / Elite
//
// ============================================================

export function canSubscriptionUseTracksuit(
  suitId,
  subscriptionTier
) {
  const suit =
    getTracksuitById(
      suitId
    );


  if (!suit) {
    return false;
  }


  const tier =
    String(
      subscriptionTier ||
      "free"
    )
      .trim()
      .toLowerCase();


  const isElite =
    tier === "elite";


  const isPremium =
    tier === "premium";


  if (
    suit.eliteRequired
  ) {
    return isElite;
  }


  if (
    suit.premiumRequired
  ) {
    return (
      isPremium ||
      isElite
    );
  }


  return true;
}


// ============================================================
// CAN EQUIP TRACKSUIT
// ============================================================
//
// Both conditions must pass:
//
// 1. Enough Journey Lifetime Steps
// 2. Correct subscription level
//
// ============================================================

export function canEquipTracksuit({
  suitId,
  lifetimeSteps,
  subscriptionTier,
} = {}) {

  return (
    isTracksuitUnlockedBySteps(
      suitId,
      lifetimeSteps
    ) &&
    canSubscriptionUseTracksuit(
      suitId,
      subscriptionTier
    )
  );
}


// ============================================================
// GET TRACKSUIT SUMMARY
// ============================================================

export function getTracksuitSummary(
  lifetimeSteps
) {
  const steps =
    Math.max(
      0,
      Number(
        lifetimeSteps
      ) || 0
    );


  const unlocked =
    getUnlockedTracksuits(
      steps
    );


  const next =
    getNextTracksuit(
      steps
    );


  const highest =
    getHighestUnlockedTracksuit(
      steps
    );


  return {
    lifetimeSteps:
      steps,

    unlocked,

    unlockedCount:
      unlocked.length,

    totalCount:
      TRACKSUIT_TIERS.length,

    highestUnlocked:
      highest,

    nextTracksuit:
      next,

    allUnlocked:
      next === null,
  };
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default TRACKSUIT_TIERS;