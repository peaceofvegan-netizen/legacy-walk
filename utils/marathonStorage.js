// utils/marathonStorage.js
import {
  unlockAvatarSuit,
} from "./avatarWardrobeStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MARATHON_CATALOG, {
  MARATHON_TOTAL_STEPS,
} from "../data/marathonCatalog";


// ============================================================
// LEGATHON MARATHON STORAGE
// ============================================================
//
// IMPORTANT:
//
// Marathon progress is completely independent.
//
// This file NEVER uses:
//
// - Lifetime Steps
// - Today Steps as marathon progress
// - startingLifetimeSteps
// - Journey steps
// - Pedometer
//
// It receives ONLY step deltas that have already been routed
// to the active Legathon by stepTrackingEngine.js.
//
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

const MARATHON_PROGRESS_KEY =
  "LEGATHON_MARATHON_PROGRESS_V2";

const ACTIVE_MARATHON_KEY =
  "LEGATHON_ACTIVE_MARATHON_V2";

const MARATHON_REWARDS_KEY =
  "LEGATHON_MARATHON_REWARDS_V2";

const MARATHON_COMPLETION_ALERTS_KEY =
  "LEGATHON_MARATHON_COMPLETION_ALERTS_V2";

const MARATHON_PASSPORT_KEY =
  "LEGATHON_MARATHON_PASSPORT_V2";

const MARATHON_CERTIFICATES_KEY =
  "LEGATHON_MARATHON_CERTIFICATES_V2";


// ============================================================
// HELPERS
// ============================================================

const safeNumber = (value) => {
  const parsed =
    Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};


const safeInteger = (value) => {
  return Math.max(
    0,
    Math.floor(
      safeNumber(value)
    )
  );
};


const clamp = (
  value,
  minimum = 0,
  maximum = 100
) => {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      safeNumber(value)
    )
  );
};


const nowISO = () =>
  new Date().toISOString();


const parseJSON = (
  value,
  fallback
) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log(
      "Marathon JSON parse error:",
      error
    );

    return fallback;
  }
};


// ============================================================
// CATALOG HELPERS
// ============================================================

export function normalizeMarathonId(
  marathonId
) {
  if (
    marathonId === null ||
    marathonId === undefined
  ) {
    return null;
  }

  const normalized =
    String(marathonId)
      .trim();

  return normalized || null;
}


export function getMarathonById(
  marathonId
) {
  const normalizedId =
    normalizeMarathonId(
      marathonId
    );

  if (!normalizedId) {
    return null;
  }

  return (
    MARATHON_CATALOG.find(
      (marathon) =>
        marathon.id ===
        normalizedId
    ) || null
  );
}


const getMarathonIndex = (
  marathonId
) => {
  const normalizedId =
    normalizeMarathonId(
      marathonId
    );

  if (!normalizedId) {
    return -1;
  }

  return MARATHON_CATALOG.findIndex(
    (marathon) =>
      marathon.id ===
      normalizedId
  );
};


const getMarathonTotalSteps = (
  marathon
) => {
  return (
    safeInteger(
      marathon?.totalSteps
    ) ||
    safeInteger(
      MARATHON_TOTAL_STEPS
    ) ||
    1
  );
};


// ============================================================
// DEFAULT PROGRESS
// ============================================================

const createDefaultProgress = (
  marathon
) => {
  return {
    id: marathon.id,

    marathonId:
      marathon.id,

    // --------------------------------------------------------
    // LEGATHON-ONLY ACCUMULATED STEPS
    // --------------------------------------------------------

    steps: 0,

    totalSteps:
      getMarathonTotalSteps(
        marathon
      ),

    progress: 0,

    // --------------------------------------------------------
    // ACCESS
    // --------------------------------------------------------

    unlocked:
      marathon
        ?.unlockedByDefault ===
        true,

    // --------------------------------------------------------
    // COMPLETION
    // --------------------------------------------------------

    completed: false,

    rewardClaimed: false,

    // --------------------------------------------------------
    // TIMESTAMPS
    // --------------------------------------------------------

    startedAt: null,

    lastActivatedAt: null,

    completedAt: null,

    lastUpdated: null,
  };
};


// ============================================================
// NORMALIZE PROGRESS
// ============================================================

const normalizeProgress = (
  marathon,
  saved = {}
) => {
  const defaults =
    createDefaultProgress(
      marathon
    );

  const totalSteps =
    safeInteger(
      saved?.totalSteps
    ) ||
    defaults.totalSteps;

  const steps =
    Math.min(
      totalSteps,
      safeInteger(
        saved?.steps
      )
    );

  const completed =
    saved?.completed ===
      true ||
    (
      totalSteps > 0 &&
      steps >= totalSteps
    );

  const progress =
    completed
      ? 100
      : totalSteps > 0
        ? clamp(
            (
              steps /
              totalSteps
            ) * 100
          )
        : 0;

  return {
    ...defaults,
    ...saved,

    id:
      marathon.id,

    marathonId:
      marathon.id,

    steps,

    totalSteps,

    progress,

    unlocked:
      saved?.unlocked ===
        true ||
      marathon
        ?.unlockedByDefault ===
        true,

    completed,

    rewardClaimed:
      saved?.rewardClaimed ===
      true,

    startedAt:
      saved?.startedAt ||
      null,

    lastActivatedAt:
      saved
        ?.lastActivatedAt ||
      null,

    completedAt:
      completed
        ? (
            saved
              ?.completedAt ||
            null
          )
        : null,

    lastUpdated:
      saved
        ?.lastUpdated ||
      null,
  };
};


// ============================================================
// CREATE DEFAULT MAP
// ============================================================

const createDefaultProgressMap =
  () => {
    const map = {};

    MARATHON_CATALOG.forEach(
      (marathon) => {
        map[
          marathon.id
        ] =
          createDefaultProgress(
            marathon
          );
      }
    );

    return map;
  };


// ============================================================
// LOAD PROGRESS MAP
// ============================================================

export async function
loadMarathonProgressMap() {
  try {
    const saved =
      await AsyncStorage.getItem(
        MARATHON_PROGRESS_KEY
      );

    const stored =
      parseJSON(
        saved,
        {}
      );

    const normalized = {};

    MARATHON_CATALOG.forEach(
      (marathon) => {
        normalized[
          marathon.id
        ] =
          normalizeProgress(
            marathon,
            stored?.[
              marathon.id
            ] || {}
          );
      }
    );

    return normalized;
  } catch (error) {
    console.log(
      "Load marathon progress map error:",
      error
    );

    return createDefaultProgressMap();
  }
}


// ============================================================
// SAVE PROGRESS MAP
// ============================================================

export async function
saveMarathonProgressMap(
  progressMap
) {
  try {
    const safeMap =
      progressMap &&
      typeof progressMap ===
        "object"
        ? progressMap
        : {};

    await AsyncStorage.setItem(
      MARATHON_PROGRESS_KEY,
      JSON.stringify(
        safeMap
      )
    );

    return {
      saved: true,
      progressMap:
        safeMap,
    };
  } catch (error) {
    console.log(
      "Save marathon progress map error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}


// ============================================================
// GET ONE PROGRESS RECORD
// ============================================================

export async function
getMarathonProgress(
  marathonId
) {
  try {
    const marathon =
      getMarathonById(
        marathonId
      );

    if (!marathon) {
      return null;
    }

    const progressMap =
      await loadMarathonProgressMap();

    return normalizeProgress(
      marathon,
      progressMap?.[
        marathon.id
      ] || {}
    );
  } catch (error) {
    console.log(
      "Get marathon progress error:",
      error
    );

    return null;
  }
}


// ============================================================
// SAVE ONE PROGRESS RECORD
// ============================================================

async function
saveSingleMarathonProgress(
  marathonId,
  progress
) {
  const marathon =
    getMarathonById(
      marathonId
    );

  if (!marathon) {
    return {
      saved: false,
      reason:
        "marathon-not-found",
    };
  }

  const progressMap =
    await loadMarathonProgressMap();

  const normalized =
    normalizeProgress(
      marathon,
      progress
    );

  const updatedMap = {
    ...progressMap,

    [marathon.id]:
      normalized,
  };

  const result =
    await saveMarathonProgressMap(
      updatedMap
    );

  return {
    saved:
      result?.saved === true,

    progress:
      normalized,

    progressMap:
      updatedMap,
  };
}


// ============================================================
// COMPLETED COUNT
// ============================================================

export async function
getCompletedMarathonCount() {
  const progressMap =
    await loadMarathonProgressMap();

  return MARATHON_CATALOG.filter(
    (marathon) =>
      progressMap?.[
        marathon.id
      ]?.completed === true
  ).length;
}


// ============================================================
// UNLOCK CHECK
// ============================================================

export async function
isMarathonUnlocked(
  marathonId
) {
  const marathon =
    getMarathonById(
      marathonId
    );

  if (!marathon) {
    return false;
  }

  if (
    marathon
      .unlockedByDefault ===
    true
  ) {
    return true;
  }

  const saved =
    await getMarathonProgress(
      marathon.id
    );

  if (
    saved?.unlocked ===
    true
  ) {
    return true;
  }

  const required =
    safeInteger(
      marathon
        .requiredCompletedMarathons
    );

  if (required <= 0) {
    return true;
  }

  const completedCount =
    await getCompletedMarathonCount();

  return (
    completedCount >=
    required
  );
}


// ============================================================
// ACTIVE MARATHON
// ============================================================

export async function
getActiveMarathon() {
  try {
    const saved =
      await AsyncStorage.getItem(
        ACTIVE_MARATHON_KEY
      );

    const active =
      parseJSON(
        saved,
        null
      );

    if (!active) {
      return null;
    }

    const marathonId =
      normalizeMarathonId(
        active?.marathonId ??
        active?.id
      );

    if (!marathonId) {
      await AsyncStorage.removeItem(
        ACTIVE_MARATHON_KEY
      );

      return null;
    }

    const marathon =
      getMarathonById(
        marathonId
      );

    if (!marathon) {
      await AsyncStorage.removeItem(
        ACTIVE_MARATHON_KEY
      );

      return null;
    }

    const progress =
      await getMarathonProgress(
        marathon.id
      );

    // Completed Legathon cannot remain
    // the active step destination.

    if (
      progress?.completed ===
      true
    ) {
      await AsyncStorage.removeItem(
        ACTIVE_MARATHON_KEY
      );

      return null;
    }

    return {
      id:
        marathon.id,

      marathonId:
        marathon.id,

      marathon,

      progress,

      startedAt:
        progress?.startedAt ||
        active?.startedAt ||
        null,

      activatedAt:
        active?.activatedAt ||
        null,
    };
  } catch (error) {
    console.log(
      "Get active marathon error:",
      error
    );

    return null;
  }
}


// ============================================================
// SET ACTIVE MARATHON
//
// IMPORTANT:
//
// This function does NOT:
// - read lifetime steps
// - read today steps
// - create a pedometer checkpoint
//
// legathonSession.js handles the routing transition.
// ============================================================

export async function
setActiveMarathon(
  marathonId
) {
  try {
    const marathon =
      getMarathonById(
        marathonId
      );

    if (!marathon) {
      return {
        saved: false,
        reason:
          "marathon-not-found",
      };
    }

    const unlocked =
      await isMarathonUnlocked(
        marathon.id
      );

    if (!unlocked) {
      return {
        saved: false,
        reason:
          "marathon-locked",
      };
    }

    let progress =
      await getMarathonProgress(
        marathon.id
      );

    if (!progress) {
      progress =
        createDefaultProgress(
          marathon
        );
    }

    if (
      progress.completed ===
      true
    ) {
      return {
        saved: false,

        reason:
          "marathon-completed",

        marathon,

        progress,
      };
    }


    // --------------------------------------------------------
    // ONLY ONE LEGATHON CAN BE ACTIVE
    // --------------------------------------------------------

    const existingActive =
      await getActiveMarathon();

    if (
      existingActive
        ?.marathonId &&
      existingActive
        .marathonId !==
        marathon.id
    ) {
      return {
        saved: false,

        reason:
          "another-marathon-active",

        activeMarathon:
          existingActive
            .marathon,
      };
    }


    const now =
      nowISO();


    const updatedProgress = {
      ...progress,

      unlocked: true,

      startedAt:
        progress.startedAt ||
        now,

      lastActivatedAt:
        now,

      lastUpdated:
        now,
    };


    const progressResult =
      await saveSingleMarathonProgress(
        marathon.id,
        updatedProgress
      );

    if (
      !progressResult?.saved
    ) {
      return {
        saved: false,
        reason:
          "progress-save-failed",
      };
    }


    const activeState = {
      id:
        marathon.id,

      marathonId:
        marathon.id,

      startedAt:
        progressResult
          .progress
          .startedAt,

      activatedAt:
        now,
    };


    await AsyncStorage.setItem(
      ACTIVE_MARATHON_KEY,
      JSON.stringify(
        activeState
      )
    );


    return {
      saved: true,

      marathon,

      progress:
        progressResult.progress,

      active:
        activeState,
    };
  } catch (error) {
    console.log(
      "Set active marathon error:",
      error
    );

    return {
      saved: false,

      reason:
        "storage-error",

      error,
    };
  }
}


// ============================================================
// START ALIAS
// ============================================================

export async function
startMarathon(
  marathonId
) {
  return setActiveMarathon(
    marathonId
  );
}


// ============================================================
// CLEAR ACTIVE MARATHON
// ============================================================

export async function
clearActiveMarathon() {
  try {
    await AsyncStorage.removeItem(
      ACTIVE_MARATHON_KEY
    );

    return {
      cleared: true,
    };
  } catch (error) {
    console.log(
      "Clear active marathon error:",
      error
    );

    return {
      cleared: false,
      error,
    };
  }
}


// ============================================================
// GET NEXT MARATHON
// ============================================================

export function getNextMarathon(
  marathonId
) {
  const currentIndex =
    getMarathonIndex(
      marathonId
    );

  if (
    currentIndex < 0 ||
    currentIndex >=
      MARATHON_CATALOG.length -
        1
  ) {
    return null;
  }

  return (
    MARATHON_CATALOG[
      currentIndex + 1
    ] || null
  );
}


// ============================================================
// UNLOCK NEXT MARATHON
// ============================================================

export async function
unlockNextMarathon(
  completedMarathonId
) {
  try {
    const next =
      getNextMarathon(
        completedMarathonId
      );

    if (!next) {
      return null;
    }

    const current =
      await getMarathonProgress(
        next.id
      );

    if (!current) {
      return null;
    }

    if (
      current.unlocked ===
      true
    ) {
      return next;
    }

    const updated = {
      ...current,

      unlocked: true,

      lastUpdated:
        nowISO(),
    };


    await saveSingleMarathonProgress(
      next.id,
      updated
    );


    return next;
  } catch (error) {
    console.log(
      "Unlock next marathon error:",
      error
    );

    return null;
  }
}


// ============================================================
// ADD LEGATHON STEPS
//
// THIS IS THE CORE STEP RECEIVER.
//
// It receives ONLY the physical step delta that the central
// router has already assigned to Legathon Mode.
//
// Example:
//
// Router determines:
//     24 new physical steps
//
// This function receives:
//     24
//
// NOT:
//     282,110 lifetime steps
//     8,460 device total
//     150 today's cumulative steps
//
// ============================================================

export async function
addMarathonSteps(
  stepDelta
) {
  try {
    const incomingSteps =
      safeInteger(
        stepDelta
      );

    if (
      incomingSteps <= 0
    ) {
      return {
        saved: true,

        added: 0,

        overflow: 0,

        completedNow: false,

        reason:
          "zero-delta",
      };
    }


    // --------------------------------------------------------
    // ACTIVE LEGATHON
    // --------------------------------------------------------

    const active =
      await getActiveMarathon();

    if (
      !active?.marathonId ||
      !active?.marathon
    ) {
      return {
        saved: false,

        added: 0,

        overflow:
          incomingSteps,

        completedNow:
          false,

        reason:
          "no-active-marathon",
      };
    }


    const marathon =
      active.marathon;

    const marathonId =
      marathon.id;


    const current =
      await getMarathonProgress(
        marathonId
      );


    if (!current) {
      return {
        saved: false,

        added: 0,

        overflow:
          incomingSteps,

        completedNow:
          false,

        reason:
          "progress-not-found",
      };
    }


    const totalSteps =
      getMarathonTotalSteps(
        marathon
      );


    const previousSteps =
      Math.min(
        totalSteps,
        safeInteger(
          current.steps
        )
      );


    // --------------------------------------------------------
    // ALREADY FINISHED
    // --------------------------------------------------------

    if (
      current.completed ===
        true ||
      previousSteps >=
        totalSteps
    ) {
      return {
        saved: true,

        added: 0,

        overflow:
          incomingSteps,

        completedNow:
          false,

        alreadyCompleted:
          true,

        marathon,

        progress:
          current,
      };
    }


    // --------------------------------------------------------
    // EXACT CREDIT
    // --------------------------------------------------------

    const remaining =
      Math.max(
        totalSteps -
          previousSteps,
        0
      );


    const creditedSteps =
      Math.min(
        incomingSteps,
        remaining
      );


    // Steps beyond the finish line are not
    // transferred to Journey.

    const overflow =
      Math.max(
        incomingSteps -
          creditedSteps,
        0
      );


    const nextSteps =
      previousSteps +
      creditedSteps;


    const completed =
      nextSteps >=
      totalSteps;


    const completedNow =
      completed &&
      current.completed !==
        true;


    const progress =
      completed
        ? 100
        : clamp(
            (
              nextSteps /
              totalSteps
            ) * 100
          );


    const now =
      nowISO();


    const updated = {
      ...current,

      steps:
        nextSteps,

      totalSteps,

      progress,

      completed,

      completedAt:
        completed
          ? (
              current.completedAt ||
              now
            )
          : null,

      lastUpdated:
        now,
    };


    const savedResult =
      await saveSingleMarathonProgress(
        marathonId,
        updated
      );


    if (
      !savedResult?.saved
    ) {
      return {
        saved: false,

        added: 0,

        overflow:
          incomingSteps,

        completedNow:
          false,

        reason:
          "progress-save-failed",
      };
    }


    // --------------------------------------------------------
    // STILL ACTIVE
    // --------------------------------------------------------

    if (!completedNow) {
      return {
        saved: true,

        added:
          creditedSteps,

        overflow,

        completedNow:
          false,

        marathon,

        progress:
          savedResult.progress,
      };
    }


    // ========================================================
    // JUST COMPLETED
    // ========================================================

    const nextMarathonUnlocked =
      await unlockNextMarathon(
        marathonId
      );


    // --------------------------------------------------------
    // CRITICAL:
    //
    // Finished marathon must stop being the active marathon.
    //
    // The step router / Legathon session then establishes the
    // fresh Journey checkpoint before Journey resumes.
    // --------------------------------------------------------

    await AsyncStorage.removeItem(
      ACTIVE_MARATHON_KEY
    );


    return {
      saved: true,

      added:
        creditedSteps,

      overflow,

      completedNow:
        true,

      marathon,

      progress:
        savedResult.progress,

      nextMarathonUnlocked,
    };
  } catch (error) {
    console.log(
      "Add marathon steps error:",
      error
    );

    return {
      saved: false,

      added: 0,

      overflow: 0,

      completedNow:
        false,

      reason:
        "add-marathon-steps-error",

      error,
    };
  }
}


// ============================================================
// MANUAL COMPLETE
//
// Mainly useful for testing/admin functions.
// Normal completion should happen through addMarathonSteps().
// ============================================================

export async function
completeActiveMarathon() {
  try {
    const active =
      await getActiveMarathon();

    if (
      !active?.marathon
    ) {
      return {
        saved: false,
        reason:
          "no-active-marathon",
      };
    }

    const marathon =
      active.marathon;

    const current =
      await getMarathonProgress(
        marathon.id
      );

    if (!current) {
      return {
        saved: false,
        reason:
          "progress-not-found",
      };
    }

    const now =
      nowISO();

    const totalSteps =
      getMarathonTotalSteps(
        marathon
      );


    const updated = {
      ...current,

      steps:
        totalSteps,

      totalSteps,

      progress: 100,

      completed: true,

      completedAt:
        current.completedAt ||
        now,

      lastUpdated:
        now,
    };


    const savedResult =
      await saveSingleMarathonProgress(
        marathon.id,
        updated
      );


    if (
      !savedResult?.saved
    ) {
      return {
        saved: false,
        reason:
          "progress-save-failed",
      };
    }


    const nextMarathonUnlocked =
      await unlockNextMarathon(
        marathon.id
      );


    await clearActiveMarathon();


    return {
      saved: true,

      completedNow:
        current.completed !==
        true,

      marathon,

      progress:
        savedResult.progress,

      nextMarathonUnlocked,
    };
  } catch (error) {
    console.log(
      "Complete active marathon error:",
      error
    );

    return {
      saved: false,

      reason:
        "completion-error",

      error,
    };
  }
}


// ============================================================
// COMPLETION ALERT STATE
//
// This is UI state only.
//
// It prevents the same completion celebration from appearing
// repeatedly after reopening a completed challenge.
// ============================================================

export async function
hasShownMarathonCompletionAlert(
  marathonId
) {
  try {
    const normalizedId =
      normalizeMarathonId(
        marathonId
      );

    if (!normalizedId) {
      return false;
    }

    const saved =
      await AsyncStorage.getItem(
        MARATHON_COMPLETION_ALERTS_KEY
      );

    const map =
      parseJSON(
        saved,
        {}
      );

    return (
      map?.[
        normalizedId
      ] === true
    );
  } catch (error) {
    console.log(
      "Read marathon alert state error:",
      error
    );

    return false;
  }
}


export async function
markMarathonCompletionAlertShown(
  marathonId
) {
  try {
    const normalizedId =
      normalizeMarathonId(
        marathonId
      );

    if (!normalizedId) {
      return false;
    }

    const saved =
      await AsyncStorage.getItem(
        MARATHON_COMPLETION_ALERTS_KEY
      );

    const current =
      parseJSON(
        saved,
        {}
      );

    const updated = {
      ...current,

      [normalizedId]:
        true,
    };


    await AsyncStorage.setItem(
      MARATHON_COMPLETION_ALERTS_KEY,
      JSON.stringify(
        updated
      )
    );


    return true;
  } catch (error) {
    console.log(
      "Save marathon alert state error:",
      error
    );

    return false;
  }
}


// ============================================================
// REWARD RECORDS
// ============================================================

export async function
loadMarathonRewards() {
  try {
    const saved =
      await AsyncStorage.getItem(
        MARATHON_REWARDS_KEY
      );

    return parseJSON(
      saved,
      {}
    );
  } catch (error) {
    console.log(
      "Load marathon rewards error:",
      error
    );

    return {};
  }
}


export async function
saveMarathonRewardRecord(
  marathonId,
  rewardData
) {
  try {
    const normalizedId =
      normalizeMarathonId(
        marathonId
      );

    if (!normalizedId) {
      return {
        saved: false,
        reason:
          "invalid-marathon-id",
      };
    }

    const rewards =
      await loadMarathonRewards();

    const record = {
      ...rewardData,

      marathonId:
        normalizedId,

      savedAt:
        nowISO(),
    };


    const updated = {
      ...rewards,

      [normalizedId]:
        record,
    };


    await AsyncStorage.setItem(
      MARATHON_REWARDS_KEY,
      JSON.stringify(
        updated
      )
    );


    return {
      saved: true,
      record,
    };
  } catch (error) {
    console.log(
      "Save marathon reward record error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}


// ============================================================
// MARK REWARD CLAIMED
//
// IMPORTANT:
//
// This only marks the marathon record as claimed.
//
// Actual WCoin / Legathon Point / Avatar XP awarding should
// remain in your central reward system so balances are not
// duplicated.
// ============================================================

export async function
markMarathonRewardClaimed(
  marathonId
) {
  try {
    const marathon =
      getMarathonById(
        marathonId
      );

    if (!marathon) {
      return {
        saved: false,
        reason:
          "marathon-not-found",
      };
    }


    const progress =
      await getMarathonProgress(
        marathon.id
      );


    if (!progress) {
      return {
        saved: false,
        reason:
          "progress-not-found",
      };
    }


    if (!progress.completed) {
      return {
        saved: false,
        reason:
          "marathon-not-completed",
      };
    }


    if (
      progress.rewardClaimed ===
      true
    ) {
      return {
        saved: true,

        alreadyClaimed:
          true,

        progress,
      };
    }


    const updated = {
      ...progress,

      rewardClaimed:
        true,

      lastUpdated:
        nowISO(),
    };


    const result =
      await saveSingleMarathonProgress(
        marathon.id,
        updated
      );


    if (
      result?.saved
    ) {
      await saveMarathonRewardRecord(
        marathon.id,
        {
          title:
            marathon.title,

          rewardCoins:
            safeInteger(
              marathon.rewardCoins
            ),

          rewardPoints:
            safeInteger(
              marathon.rewardPoints
            ),

          avatarXP:
            safeInteger(
              marathon.avatarXP
            ),

          badge:
            marathon.badge ||
            null,

          claimedAt:
            nowISO(),
        }
      );
    }


    return {
      saved:
        result?.saved ===
        true,

      marathon,

      progress:
        result?.progress ||
        updated,
    };
  } catch (error) {
    console.log(
      "Mark marathon reward claimed error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}


// ============================================================
// PASSPORT
// ============================================================

export async function
loadMarathonPassport() {
  try {
    const saved =
      await AsyncStorage.getItem(
        MARATHON_PASSPORT_KEY
      );

    return parseJSON(
      saved,
      {}
    );
  } catch (error) {
    console.log(
      "Load marathon passport error:",
      error
    );

    return {};
  }
}


export async function
saveMarathonPassport(
  passport
) {
  try {
    const value =
      passport &&
      typeof passport ===
        "object"
        ? passport
        : {};

    await AsyncStorage.setItem(
      MARATHON_PASSPORT_KEY,
      JSON.stringify(
        value
      )
    );

    return {
      saved: true,
      passport:
        value,
    };
  } catch (error) {
    console.log(
      "Save marathon passport error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}


// ============================================================
// CERTIFICATES
// ============================================================

export async function
loadMarathonCertificates() {
  try {
    const saved =
      await AsyncStorage.getItem(
        MARATHON_CERTIFICATES_KEY
      );

    return parseJSON(
      saved,
      {}
    );
  } catch (error) {
    console.log(
      "Load marathon certificates error:",
      error
    );

    return {};
  }
}


export async function
saveMarathonCertificates(
  certificates
) {
  try {
    const value =
      certificates &&
      typeof certificates ===
        "object"
        ? certificates
        : {};

    await AsyncStorage.setItem(
      MARATHON_CERTIFICATES_KEY,
      JSON.stringify(
        value
      )
    );

    return {
      saved: true,
      certificates:
        value,
    };
  } catch (error) {
    console.log(
      "Save marathon certificates error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}


// ============================================================
// MARATHON MODE STATE
//
// Useful for UI / diagnostics.
//
// Step routing itself should use the dedicated Legathon routing
// state created by legathonSession.js.
// ============================================================

export async function
getMarathonModeState() {
  const active =
    await getActiveMarathon();

  return {
    active:
      Boolean(
        active?.marathonId
      ),

    marathonId:
      active?.marathonId ||
      null,

    marathon:
      active?.marathon ||
      null,

    progress:
      active?.progress ||
      null,
  };
}


// ============================================================
// DEVELOPMENT RESET
//
// TESTING ONLY.
//
// Does NOT erase:
// - Lifetime Steps
// - normal Journey progress
// - profile data
// - WCoins
//
// ============================================================

export async function
resetAllMarathonData() {
  try {
    await Promise.all([
      AsyncStorage.removeItem(
        MARATHON_PROGRESS_KEY
      ),

      AsyncStorage.removeItem(
        ACTIVE_MARATHON_KEY
      ),

      AsyncStorage.removeItem(
        MARATHON_REWARDS_KEY
      ),

      AsyncStorage.removeItem(
        MARATHON_COMPLETION_ALERTS_KEY
      ),

      AsyncStorage.removeItem(
        MARATHON_PASSPORT_KEY
      ),

      AsyncStorage.removeItem(
        MARATHON_CERTIFICATES_KEY
      ),
    ]);

    return {
      reset: true,
    };
  } catch (error) {
    console.log(
      "Reset marathon data error:",
      error
    );

    return {
      reset: false,
      error,
    };
  }
}