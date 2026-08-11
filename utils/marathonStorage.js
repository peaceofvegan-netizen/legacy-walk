import AsyncStorage from "@react-native-async-storage/async-storage";

import MARATHON_CATALOG, {
  MARATHON_TOTAL_STEPS,
  getMarathonById,
  normalizeMarathonId,
} from "../data/marathonCatalog";

import {
  addWCoins,
} from "./wcoinStorage";

const MARATHON_PROGRESS_KEY =
  "LEGACY_WALK_MARATHON_PROGRESS";

const ACTIVE_MARATHON_KEY =
  "LEGACY_WALK_ACTIVE_MARATHON";

const MARATHON_REWARDS_KEY =
  "LEGACY_WALK_MARATHON_REWARDS";

const MARATHON_PASSPORT_KEY =
  "LEGACY_WALK_MARATHON_PASSPORT";

const MARATHON_CERTIFICATES_KEY =
  "LEGACY_WALK_MARATHON_CERTIFICATES";

const MARATHON_COMPLETION_ALERTS_KEY =
  "LEGACY_WALK_MARATHON_COMPLETION_ALERTS";

const LEGACY_POINTS_KEY =
  "LEGACY_WALK_LEGACY_POINTS";

const AVATAR_XP_KEY =
  "LEGACY_WALK_AVATAR_XP";

const safeNumber = value => {
  const parsed = Number(value || 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const clamp = (
  value,
  minimum,
  maximum
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

async function readStoredNumber(key) {
  try {
    const storedValue =
      await AsyncStorage.getItem(key);

    return safeNumber(storedValue);
  } catch (error) {
    console.log(
      `Read stored number error for ${key}:`,
      error
    );

    return 0;
  }
}

function createDefaultMarathonProgress(
  marathon
) {
  return {
    id: marathon.id,

    steps: 0,

    totalSteps:
      safeNumber(marathon.totalSteps) ||
      MARATHON_TOTAL_STEPS,

    progress: 0,

    completed: false,

    unlocked:
      marathon.unlockedByDefault === true,

    rewardClaimed: false,

    rewardClaimPending: false,

    startingLifetimeSteps: null,

    startedAt: null,

    completedAt: null,

    updatedAt: null,
  };
}

export function createDefaultProgressMap() {
  return MARATHON_CATALOG.reduce(
    (progressMap, marathon) => {
      progressMap[marathon.id] =
        createDefaultMarathonProgress(
          marathon
        );

      return progressMap;
    },
    {}
  );
}

function normalizeProgressEntry(
  marathon,
  savedEntry = {}
) {
  const totalSteps =
    safeNumber(savedEntry.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    MARATHON_TOTAL_STEPS;

  const steps = clamp(
    Math.floor(
      safeNumber(savedEntry.steps)
    ),
    0,
    totalSteps
  );

  const completed =
    savedEntry.completed === true ||
    steps >= totalSteps;

  const calculatedProgress =
    totalSteps > 0
      ? (steps / totalSteps) * 100
      : 0;

  const progress = completed
    ? 100
    : clamp(
        savedEntry.progress ??
          calculatedProgress,
        0,
        100
      );

  return {
    ...createDefaultMarathonProgress(
      marathon
    ),

    ...savedEntry,

    id: marathon.id,

    steps,

    totalSteps,

    progress,

    completed,

    unlocked:
      marathon.unlockedByDefault === true ||
      savedEntry.unlocked === true ||
      completed,

    rewardClaimed:
      savedEntry.rewardClaimed === true,

    rewardClaimPending:
      savedEntry.rewardClaimPending === true,

    startingLifetimeSteps:
      savedEntry.startingLifetimeSteps ==
      null
        ? null
        : Math.max(
            0,
            Math.floor(
              safeNumber(
                savedEntry.startingLifetimeSteps
              )
            )
          ),
  };
}

export function getCompletedMarathonCount(
  progressMap = {}
) {
  return Object.values(
    progressMap
  ).filter(
    progress =>
      progress?.completed === true
  ).length;
}

export function applyMarathonUnlocks(
  progressMap = {}
) {
  const normalizedMap = {};

  MARATHON_CATALOG.forEach(
    marathon => {
      normalizedMap[marathon.id] =
        normalizeProgressEntry(
          marathon,
          progressMap?.[
            marathon.id
          ] || {}
        );
    }
  );

  const completedCount =
    getCompletedMarathonCount(
      normalizedMap
    );

  MARATHON_CATALOG.forEach(
    marathon => {
      const required =
        safeNumber(
          marathon.requiredCompletedMarathons
        );

      const current =
        normalizedMap[marathon.id];

      normalizedMap[marathon.id] = {
        ...current,

        unlocked:
          marathon.unlockedByDefault ===
            true ||
          current.completed === true ||
          completedCount >= required,
      };
    }
  );

  return normalizedMap;
}

export async function loadMarathonProgressMap() {
  try {
    const stored =
      await AsyncStorage.getItem(
        MARATHON_PROGRESS_KEY
      );

    const parsed = stored
      ? JSON.parse(stored)
      : {};

    return applyMarathonUnlocks(
      parsed && typeof parsed === "object"
        ? parsed
        : {}
    );
  } catch (error) {
    console.log(
      "Load marathon progress error:",
      error
    );

    return createDefaultProgressMap();
  }
}

export async function saveMarathonProgressMap(
  progressMap
) {
  const normalizedMap =
    applyMarathonUnlocks(
      progressMap || {}
    );

  await AsyncStorage.setItem(
    MARATHON_PROGRESS_KEY,
    JSON.stringify(normalizedMap)
  );

  return normalizedMap;
}

export async function getMarathonProgress(
  marathonId
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return null;
  }

  const progressMap =
    await loadMarathonProgressMap();

  return (
    progressMap[marathon.id] ||
    createDefaultMarathonProgress(
      marathon
    )
  );
}

export async function setActiveMarathon(
  marathonId,
  currentLifetimeSteps = 0
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return {
      saved: false,
      reason: "marathon-not-found",
    };
  }

  const progressMap =
    await loadMarathonProgressMap();

  const current =
    progressMap[marathon.id] ||
    createDefaultMarathonProgress(
      marathon
    );

  if (!current.unlocked) {
    return {
      saved: false,
      reason: "marathon-locked",
      marathon,
      progress: current,
    };
  }

  const lifetimeSteps = Math.max(
    0,
    Math.floor(
      safeNumber(currentLifetimeSteps)
    )
  );

  if (
    current.startingLifetimeSteps ==
      null &&
    !current.completed
  ) {
    progressMap[marathon.id] = {
      ...current,

      startingLifetimeSteps:
        lifetimeSteps,

      startedAt:
        current.startedAt ||
        nowISO(),

      updatedAt: nowISO(),
    };

    await saveMarathonProgressMap(
      progressMap
    );
  }

  await AsyncStorage.setItem(
    ACTIVE_MARATHON_KEY,
    marathon.id
  );

  const updatedMap =
    await loadMarathonProgressMap();

  return {
    saved: true,
    reason: "active-marathon-saved",
    marathon,
    progress:
      updatedMap[marathon.id],
  };
}

export async function getActiveMarathon() {
  try {
    const storedId =
      await AsyncStorage.getItem(
        ACTIVE_MARATHON_KEY
      );

    let marathon =
      getMarathonById(storedId);

    if (!marathon) {
      const progressMap =
        await loadMarathonProgressMap();

      marathon =
        MARATHON_CATALOG.find(
          item =>
            progressMap[item.id]
              ?.unlocked === true &&
            progressMap[item.id]
              ?.completed !== true
        ) ||
        MARATHON_CATALOG.find(
          item =>
            item.unlockedByDefault ===
            true
        ) ||
        MARATHON_CATALOG[0] ||
        null;
    }

    if (!marathon) {
      return null;
    }

    const progress =
      await getMarathonProgress(
        marathon.id
      );

    return {
      marathon,
      progress,
    };
  } catch (error) {
    console.log(
      "Load active marathon error:",
      error
    );

    return null;
  }
}

export async function clearActiveMarathon() {
  await AsyncStorage.removeItem(
    ACTIVE_MARATHON_KEY
  );
}

export async function updateMarathonProgress(
  marathonId,
  addedSteps = 0
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return {
      updated: false,
      reason: "marathon-not-found",
      progress: null,
    };
  }

  const progressMap =
    await loadMarathonProgressMap();

  const current =
    progressMap[marathon.id] ||
    createDefaultMarathonProgress(
      marathon
    );

  if (!current.unlocked) {
    return {
      updated: false,
      reason: "marathon-locked",
      progress: current,
    };
  }

  if (current.completed) {
    return {
      updated: false,
      reason: "already-completed",
      progress: current,
    };
  }

  const safeAddedSteps = Math.max(
    0,
    Math.floor(
      safeNumber(addedSteps)
    )
  );

  const totalSteps =
    safeNumber(current.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    MARATHON_TOTAL_STEPS;

  const previousCompleted =
    current.completed === true;

  const nextSteps = Math.min(
    totalSteps,
    safeNumber(current.steps) +
      safeAddedSteps
  );

  const completed =
    nextSteps >= totalSteps;

  progressMap[marathon.id] = {
    ...current,

    steps: nextSteps,

    totalSteps,

    progress: completed
      ? 100
      : clamp(
          (nextSteps / totalSteps) *
            100,
          0,
          100
        ),

    completed,

    startedAt:
      current.startedAt ||
      nowISO(),

    completedAt: completed
      ? current.completedAt ||
        nowISO()
      : null,

    updatedAt: nowISO(),
  };

  const savedMap =
    await saveMarathonProgressMap(
      progressMap
    );

  const completedNow =
    !previousCompleted &&
    savedMap[marathon.id]
      ?.completed === true;

  const nextMarathon =
    completedNow
      ? MARATHON_CATALOG.find(
          item =>
            safeNumber(item.order) ===
            safeNumber(
              marathon.order
            ) +
              1
        ) || null
      : null;

  return {
    updated: true,

    reason: completedNow
      ? "completed"
      : "progress-updated",

    completedNow,

    nextMarathonUnlocked:
      nextMarathon,

    marathon,

    progress:
      savedMap[marathon.id],

    progressMap: savedMap,
  };
}

export async function setMarathonSteps(
  marathonId,
  steps
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return null;
  }

  const progressMap =
    await loadMarathonProgressMap();

  const current =
    progressMap[marathon.id] ||
    createDefaultMarathonProgress(
      marathon
    );

  const totalSteps =
    safeNumber(current.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    MARATHON_TOTAL_STEPS;

  const nextSteps = clamp(
    Math.floor(
      safeNumber(steps)
    ),
    0,
    totalSteps
  );

  const completed =
    nextSteps >= totalSteps;

  progressMap[marathon.id] = {
    ...current,

    steps: nextSteps,

    totalSteps,

    progress: completed
      ? 100
      : clamp(
          (nextSteps / totalSteps) *
            100,
          0,
          100
        ),

    completed,

    startedAt:
      nextSteps > 0
        ? current.startedAt ||
          nowISO()
        : current.startedAt,

    completedAt: completed
      ? current.completedAt ||
        nowISO()
      : null,

    updatedAt: nowISO(),
  };

  const savedMap =
    await saveMarathonProgressMap(
      progressMap
    );

  return savedMap[marathon.id];
}

export async function syncActiveMarathonSteps(
  lifetimeSteps = 0
) {
  const active =
    await getActiveMarathon();

  if (!active?.marathon) {
    return {
      updated: false,
      reason: "no-active-marathon",
    };
  }

  const marathon =
    active.marathon;

  const progressMap =
    await loadMarathonProgressMap();

  const current =
    progressMap[marathon.id];

  if (!current) {
    return {
      updated: false,
      reason: "progress-not-found",
    };
  }

  if (!current.unlocked) {
    return {
      updated: false,
      reason: "marathon-locked",
      marathon,
      progress: current,
    };
  }

  if (current.completed) {
    return {
      updated: false,
      reason: "already-completed",
      marathon,
      completedNow: false,
      progress: current,
    };
  }

  const safeLifetimeSteps =
    Math.max(
      0,
      Math.floor(
        safeNumber(lifetimeSteps)
      )
    );

  const startingLifetimeSteps =
    current.startingLifetimeSteps ==
    null
      ? safeLifetimeSteps
      : Math.max(
          0,
          Math.floor(
            safeNumber(
              current.startingLifetimeSteps
            )
          )
        );

  const marathonSteps =
    Math.max(
      0,
      safeLifetimeSteps -
        startingLifetimeSteps
    );

  const totalSteps =
    safeNumber(current.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    MARATHON_TOTAL_STEPS;

  const previousCompleted =
    current.completed === true;

  const nextSteps = Math.min(
    totalSteps,
    marathonSteps
  );

  const completed =
    nextSteps >= totalSteps;

  progressMap[marathon.id] = {
    ...current,

    startingLifetimeSteps,

    steps: nextSteps,

    totalSteps,

    progress: completed
      ? 100
      : clamp(
          (nextSteps / totalSteps) * 100,
          0,
          100
        ),

    completed,

    startedAt:
      current.startedAt ||
      nowISO(),

    completedAt: completed
      ? current.completedAt ||
        nowISO()
      : null,

    updatedAt: nowISO(),
  };

  const savedMap =
    await saveMarathonProgressMap(
      progressMap
    );

  const completedNow =
    !previousCompleted &&
    savedMap[marathon.id]?.completed ===
      true;

  const nextMarathon =
    completedNow
      ? MARATHON_CATALOG.find(
          item =>
            safeNumber(item.order) ===
            safeNumber(marathon.order) + 1
        ) || null
      : null;

  return {
    updated: true,

    reason: completedNow
      ? "completed"
      : "progress-synced",

    completedNow,

    nextMarathonUnlocked:
      nextMarathon,

    marathon,

    progress:
      savedMap[marathon.id],

    progressMap: savedMap,
  };
}
   