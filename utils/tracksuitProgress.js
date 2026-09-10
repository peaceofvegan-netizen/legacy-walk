// utils/tracksuitProgress.js

import {
  TRACKSUIT_TIERS,
  getTracksuitById,
  getNextTracksuit,
  getHighestUnlockedTracksuit,
  getUnlockedTracksuits,
  canSubscriptionUseTracksuit,
} from "./tracksuitConfig";


// ============================================================
// LEGATHON WALK — TRACKSUIT PROGRESS ENGINE
// ============================================================
//
// IMPORTANT:
//
// This file NEVER adds steps.
//
// It only READS the Journey Lifetime Step total passed to it
// and calculates tracksuit progress.
//
// Marathon steps therefore cannot accidentally be added here.
//
// Progression:
//
// Blue
// 0 → 150,000
//
// Green
// 150,000 → 400,000
//
// Red
// 400,000 → 750,000
//
// Yellow
// 750,000 → 1,250,000
//
// Elite
// 1,250,000 → 4,250,000
//
// ============================================================


// ============================================================
// SAFE STEP VALUE
// ============================================================

function safeSteps(value) {
  const steps =
    Number(value);

  if (
    !Number.isFinite(steps) ||
    steps < 0
  ) {
    return 0;
  }

  return Math.floor(steps);
}


// ============================================================
// CLAMP
// ============================================================

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}


// ============================================================
// GET TRACKSUIT PROGRESS
// ============================================================
//
// This is the main compatibility function already used by
// AvatarCenterScreen.
//
// Returns percent as 0 → 1.
//
// Example:
//
// {
//   unlocked: false,
//   percent: 0.5,
//   remaining: 75000
// }
//
// ============================================================

export function getTracksuitProgress(
  lifetimeSteps,
  tracksuitOrId
) {
  const steps =
    safeSteps(
      lifetimeSteps
    );


  const suit =
    typeof tracksuitOrId ===
    "string"
      ? getTracksuitById(
          tracksuitOrId
        )
      : tracksuitOrId;


  if (!suit) {
    return {
      suit: null,

      suitId: null,

      level: 0,

      unlocked: false,

      percent: 0,

      percent100: 0,

      remaining: 0,

      tierSteps: 0,

      tierProgressSteps: 0,

      unlockAt: 0,

      previousUnlockAt: 0,

      lifetimeSteps:
        steps,
    };
  }


  const unlockAt =
    safeSteps(
      suit.unlockAt
    );


  const previousUnlockAt =
    safeSteps(
      suit.previousUnlockAt
    );


  const tierSteps =
    Math.max(
      0,
      unlockAt -
      previousUnlockAt
    );


  const unlocked =
    steps >=
    unlockAt;


  // ----------------------------------------------------------
  // STEPS COMPLETED INSIDE THIS SPECIFIC TIER
  // ----------------------------------------------------------

  const tierProgressSteps =
    clamp(
      steps -
      previousUnlockAt,
      0,
      tierSteps
    );


  // ----------------------------------------------------------
  // PROGRESS 0 → 1
  // ----------------------------------------------------------

  const percent =
    tierSteps > 0
      ? clamp(
          tierProgressSteps /
            tierSteps,
          0,
          1
        )
      : unlocked
      ? 1
      : 0;


  // ----------------------------------------------------------
  // REMAINING
  // ----------------------------------------------------------

  const remaining =
    Math.max(
      0,
      unlockAt -
      steps
    );


  return {
    suit,

    suitId:
      suit.id,

    level:
      Number(
        suit.level || 0
      ),

    unlocked,

    percent,

    percent100:
      Math.round(
        percent * 100
      ),

    remaining,

    tierSteps,

    tierProgressSteps,

    unlockAt,

    previousUnlockAt,

    lifetimeSteps:
      steps,
  };
}


// ============================================================
// IS TRACKSUIT UNLOCKED
// ============================================================

export function isTracksuitUnlocked(
  lifetimeSteps,
  tracksuitOrId
) {
  return Boolean(
    getTracksuitProgress(
      lifetimeSteps,
      tracksuitOrId
    ).unlocked
  );
}


// ============================================================
// GET ALL TRACKSUIT PROGRESS
// ============================================================

export function getAllTracksuitProgress(
  lifetimeSteps
) {
  return TRACKSUIT_TIERS.map(
    (suit) =>
      getTracksuitProgress(
        lifetimeSteps,
        suit
      )
  );
}


// ============================================================
// GET NEXT TRACKSUIT PROGRESS
// ============================================================

export function getNextTracksuitProgress(
  lifetimeSteps
) {
  const steps =
    safeSteps(
      lifetimeSteps
    );


  const nextSuit =
    getNextTracksuit(
      steps
    );


  if (!nextSuit) {
    return {
      complete: true,

      allUnlocked: true,

      suit: null,

      suitId: null,

      unlocked: true,

      percent: 1,

      percent100: 100,

      remaining: 0,

      lifetimeSteps:
        steps,
    };
  }


  return {
    complete: false,

    allUnlocked: false,

    ...getTracksuitProgress(
      steps,
      nextSuit
    ),
  };
}


// ============================================================
// GET HIGHEST UNLOCKED SUIT
// ============================================================

export function getHighestUnlockedSuit(
  lifetimeSteps
) {
  return (
    getHighestUnlockedTracksuit(
      safeSteps(
        lifetimeSteps
      )
    ) || null
  );
}


// ============================================================
// GET UNLOCKED SUITS
// ============================================================

export function getUnlockedSuits(
  lifetimeSteps
) {
  return getUnlockedTracksuits(
    safeSteps(
      lifetimeSteps
    )
  );
}


// ============================================================
// GET UNLOCKED SUIT IDS
// ============================================================

export function getUnlockedSuitIds(
  lifetimeSteps
) {
  return getUnlockedSuits(
    lifetimeSteps
  ).map(
    (suit) =>
      suit.id
  );
}


// ============================================================
// GET UNLOCKED SUIT COUNT
// ============================================================

export function getUnlockedSuitCount(
  lifetimeSteps
) {
  return getUnlockedSuits(
    lifetimeSteps
  ).length;
}


// ============================================================
// GET TRACKSUIT MILESTONE STATE
// ============================================================

export function getTracksuitMilestoneState(
  lifetimeSteps
) {
  const steps =
    safeSteps(
      lifetimeSteps
    );


  const unlocked =
    getUnlockedSuits(
      steps
    );


  const highest =
    getHighestUnlockedSuit(
      steps
    );


  const nextProgress =
    getNextTracksuitProgress(
      steps
    );


  return {
    lifetimeSteps:
      steps,

    unlocked,

    unlockedSuitIds:
      unlocked.map(
        (suit) =>
          suit.id
      ),

    unlockedCount:
      unlocked.length,

    totalSuits:
      TRACKSUIT_TIERS.length,

    highestUnlocked:
      highest,

    nextSuit:
      nextProgress?.suit ||
      null,

    nextProgress,

    allUnlocked:
      unlocked.length ===
      TRACKSUIT_TIERS.length,
  };
}


// ============================================================
// CAN USER EQUIP SUIT
// ============================================================
//
// Checks BOTH:
//
// • Journey Lifetime Step requirement
// • Subscription requirement
//
// Basic/Free:
// no tracksuit access
//
// Premium:
// Blue, Green, Red, Yellow
//
// Elite:
// Blue, Green, Red, Yellow, Elite
//
// ============================================================

export function canUserEquipTracksuit({
  lifetimeSteps,
  suitId,
  subscriptionTier,
} = {}) {
  const suit =
    getTracksuitById(
      suitId
    );


  if (!suit) {
    return {
      allowed: false,

      reason:
        "invalid_suit",

      suit: null,

      stepUnlocked:
        false,

      subscriptionUnlocked:
        false,
    };
  }


  const progress =
    getTracksuitProgress(
      lifetimeSteps,
      suit
    );


  const subscriptionUnlocked =
    canSubscriptionUseTracksuit(
      suit.id,
      subscriptionTier
    );


  if (!progress.unlocked) {
    return {
      allowed: false,

      reason:
        "steps",

      suit,

      stepUnlocked:
        false,

      subscriptionUnlocked,

      progress,
    };
  }


  if (!subscriptionUnlocked) {
    return {
      allowed: false,

      reason:
        suit.eliteRequired
          ? "elite_required"
          : "premium_required",

      suit,

      stepUnlocked:
        true,

      subscriptionUnlocked:
        false,

      progress,
    };
  }


  return {
    allowed: true,

    reason: null,

    suit,

    stepUnlocked:
      true,

    subscriptionUnlocked:
      true,

    progress,
  };
}


// ============================================================
// GET DISPLAY MESSAGE
// ============================================================

export function getTracksuitProgressMessage(
  lifetimeSteps,
  tracksuitOrId
) {
  const progress =
    getTracksuitProgress(
      lifetimeSteps,
      tracksuitOrId
    );


  if (!progress.suit) {
    return "";
  }


  if (progress.unlocked) {
    return "Unlocked";
  }


  return (
    `${progress.remaining.toLocaleString()} ` +
    "steps remaining"
  );
}


// ============================================================
// GET TIER STEP MESSAGE
// ============================================================

export function getTracksuitTierMessage(
  tracksuitOrId
) {
  const suit =
    typeof tracksuitOrId ===
    "string"
      ? getTracksuitById(
          tracksuitOrId
        )
      : tracksuitOrId;


  if (!suit) {
    return "";
  }


  return (
    `Walk ${Number(
      suit.tierSteps || 0
    ).toLocaleString()} additional steps`
  );
}


// ============================================================
// GET LIFETIME UNLOCK MESSAGE
// ============================================================

export function getTracksuitLifetimeMessage(
  tracksuitOrId
) {
  const suit =
    typeof tracksuitOrId ===
    "string"
      ? getTracksuitById(
          tracksuitOrId
        )
      : tracksuitOrId;


  if (!suit) {
    return "";
  }


  return (
    `Unlocks at ${Number(
      suit.unlockAt || 0
    ).toLocaleString()} Journey Lifetime Steps`
  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getTracksuitProgress,

  isTracksuitUnlocked,

  getAllTracksuitProgress,

  getNextTracksuitProgress,

  getHighestUnlockedSuit,

  getUnlockedSuits,

  getUnlockedSuitIds,

  getUnlockedSuitCount,

  getTracksuitMilestoneState,

  canUserEquipTracksuit,

  getTracksuitProgressMessage,

  getTracksuitTierMessage,

  getTracksuitLifetimeMessage,
};