import AsyncStorage from "@react-native-async-storage/async-storage";

import MARATHON_CATALOG, {
  MARATHON_TOTAL_STEPS,
} from "../data/marathonCatalog";

// ============================================================
// STORAGE KEYS
// Keep these unchanged to preserve existing saved data.
// ============================================================

const PROGRESS_KEY =
  "LEGATHON_MARATHON_PROGRESS_V2";

const ACTIVE_KEY =
  "LEGATHON_ACTIVE_MARATHON_V2";

const REWARDS_KEY =
  "LEGATHON_MARATHON_REWARDS_V2";

const ALERTS_KEY =
  "LEGATHON_MARATHON_COMPLETION_ALERTS_V2";

const PASSPORT_KEY =
  "LEGATHON_MARATHON_PASSPORT_V2";

const CERTIFICATES_KEY =
  "LEGATHON_MARATHON_CERTIFICATES_V2";

// ============================================================
// GENERAL HELPERS
// ============================================================

const nowISO = () => new Date().toISOString();

const isObject = value =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

function integer(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? Math.max(0, Math.floor(parsed))
    : 0;
}

// ============================================================
// STORAGE OPERATION QUEUE
//
// Serializes writes made through this module in this JS runtime.
// ============================================================

let writeQueue = Promise.resolve();

function mutate(operation, flag = "saved") {
  const task = writeQueue.then(operation);

  writeQueue = task.catch(() => {});

  return task.catch(error => {
    console.error("Marathon storage:", error);

    return {
      [flag]: false,
      reason: "storage-error",
      error,
    };
  });
}

async function settledRead(operation) {
  await writeQueue;
  return operation();
}

// ============================================================
// LOW-LEVEL STORAGE HELPERS
// ============================================================

async function readJSON(key, fallback) {
  const raw = await AsyncStorage.getItem(key);

  if (raw === null) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Do not overwrite unreadable progress with an empty map.
    throw new Error(
      `Saved marathon data could not be read: ${key}`
    );
  }
}

async function readMap(key) {
  const value = await readJSON(key, {});

  if (!isObject(value)) {
    throw new Error(
      `Invalid saved marathon data: ${key}`
    );
  }

  return value;
}

async function writeJSON(key, value) {
  await AsyncStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

// ============================================================
// MARATHON LOOKUP
// ============================================================

export function normalizeMarathonId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim() || null;
}

export function getMarathonById(value) {
  const id = normalizeMarathonId(value);

  return (
    MARATHON_CATALOG.find(
      item =>
        normalizeMarathonId(item.id) === id
    ) || null
  );
}

export function getNextMarathon(value) {
  const id = normalizeMarathonId(value);

  const index = MARATHON_CATALOG.findIndex(
    item =>
      normalizeMarathonId(item.id) === id
  );

  return index >= 0
    ? MARATHON_CATALOG[index + 1] || null
    : null;
}

// ============================================================
// PROGRESS NORMALIZATION
// ============================================================

function normalizeProgress(
  marathon,
  saved = {},
  reward = {}
) {
  if (!isObject(saved)) {
    throw new Error(
      `Invalid progress for ${marathon.id}`
    );
  }

  const totalSteps =
    integer(saved.totalSteps) ||
    integer(marathon.totalSteps) ||
    integer(MARATHON_TOTAL_STEPS) ||
    52400;

  const steps = Math.min(
    totalSteps,
    integer(saved.steps)
  );

  const completed =
    saved.completed === true ||
    steps >= totalSteps;

  return {
    ...saved,

    id: marathon.id,
    marathonId: marathon.id,

    steps,
    totalSteps,

    progress: completed
      ? 100
      : (steps / totalSteps) * 100,

    completed,

    unlocked:
      completed ||
      saved.unlocked === true ||
      marathon.unlockedByDefault === true,

    rewardClaimed:
      saved.rewardClaimed === true ||
      Boolean(reward?.claimedAt),

    startedAt:
      saved.startedAt || null,

    lastActivatedAt:
      saved.lastActivatedAt || null,

    completedAt: completed
      ? saved.completedAt || null
      : null,

    lastUpdated:
      saved.lastUpdated || null,
  };
}

function normalizeMap(stored, rewards = {}) {
  const map = { ...stored };

  for (const marathon of MARATHON_CATALOG) {
    map[marathon.id] = normalizeProgress(
      marathon,
      stored[marathon.id] || {},
      rewards[marathon.id]
    );
  }

  const completedCount =
    MARATHON_CATALOG.filter(
      item => map[item.id].completed
    ).length;

  MARATHON_CATALOG.forEach(
    (marathon, index) => {
      const required =
        marathon.requiredCompletedMarathons;

      const hasRequirement =
        required !== undefined &&
        required !== null &&
        Number.isFinite(Number(required));

      const eligible = hasRequirement
        ? completedCount >= integer(required)
        : index === 0 ||
          map[
            MARATHON_CATALOG[index - 1].id
          ].completed;

      map[marathon.id].unlocked =
        map[marathon.id].unlocked ||
        eligible;
    }
  );

  return map;
}

async function readProgressMap() {
  const stored =
    await readMap(PROGRESS_KEY);

  const rewards =
    await readMap(REWARDS_KEY);

  return normalizeMap(stored, rewards);
}

// ============================================================
// ACTIVE MARATHON HELPERS
// ============================================================

async function readActiveRecord() {
  const value =
    await readJSON(ACTIVE_KEY, null);

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return {
      marathonId: value,
    };
  }

  if (!isObject(value)) {
    throw new Error(
      "Invalid saved active marathon."
    );
  }

  return value;
}

function activeFrom(record, map) {
  const marathon = getMarathonById(
    record?.marathonId || record?.id
  );

  if (
    !marathon ||
    map[marathon.id]?.completed
  ) {
    return null;
  }

  return {
    id: marathon.id,
    marathonId: marathon.id,

    marathon,
    progress: map[marathon.id],

    startedAt:
      map[marathon.id].startedAt ||
      record.startedAt ||
      null,

    activatedAt:
      record.activatedAt || null,
  };
}

async function removeCompletedActive() {
  try {
    await AsyncStorage.removeItem(ACTIVE_KEY);
    return null;
  } catch (error) {
    // Progress has already committed.
    // Do not report the step credit as failed.
    return error.message || String(error);
  }
}

// ============================================================
// LOAD AND SAVE PROGRESS
// ============================================================

export function loadMarathonProgressMap() {
  return settledRead(readProgressMap);
}

export function saveMarathonProgressMap(
  progressMap
) {
  return mutate(async () => {
    if (!isObject(progressMap)) {
      return {
        saved: false,
        reason: "invalid-progress-map",
      };
    }

    const current =
      await readProgressMap();

    const rewards =
      await readMap(REWARDS_KEY);

    const updated = normalizeMap(
      {
        ...current,
        ...progressMap,
      },
      rewards
    );

    await writeJSON(
      PROGRESS_KEY,
      updated
    );

    return {
      saved: true,
      progressMap: updated,
    };
  });
}

export function getMarathonProgress(
  marathonId
) {
  return settledRead(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return null;
    }

    const map = await readProgressMap();

    return map[marathon.id];
  });
}

export function getCompletedMarathonCount() {
  return settledRead(async () => {
    const map = await readProgressMap();

    return MARATHON_CATALOG.filter(
      item => map[item.id].completed
    ).length;
  });
}

export function isMarathonUnlocked(
  marathonId
) {
  return settledRead(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return false;
    }

    const map = await readProgressMap();

    return map[marathon.id].unlocked;
  });
}

// ============================================================
// GET ACTIVE MARATHON
// ============================================================

export function getActiveMarathon() {
  return settledRead(async () => {
    const record =
      await readActiveRecord();

    const map =
      await readProgressMap();

    return activeFrom(record, map);
  });
}

// ============================================================
// SET ACTIVE MARATHON
// ============================================================

export function setActiveMarathon(
  marathonId
) {
  return mutate(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await readProgressMap();

    const progress =
      map[marathon.id];

    if (progress.completed) {
      return {
        saved: false,
        reason: "marathon-completed",
        marathon,
        progress,
      };
    }

    if (!progress.unlocked) {
      return {
        saved: false,
        reason: "marathon-locked",
      };
    }

    const existing = activeFrom(
      await readActiveRecord(),
      map
    );

    if (
      existing &&
      existing.marathonId !== marathon.id
    ) {
      return {
        saved: false,
        reason: "another-marathon-active",
        activeMarathon: existing.marathon,
      };
    }

    const now = nowISO();

    const updated = {
      ...progress,

      unlocked: true,

      startedAt:
        progress.startedAt || now,

      lastActivatedAt: now,
      lastUpdated: now,
    };

    await writeJSON(PROGRESS_KEY, {
      ...map,
      [marathon.id]: updated,
    });

    const active = {
      id: marathon.id,
      marathonId: marathon.id,
      startedAt: updated.startedAt,
      activatedAt: now,
    };

    await writeJSON(ACTIVE_KEY, active);

    return {
      saved: true,
      marathon,
      progress: updated,
      active,
    };
  });
}

export function startMarathon(marathonId) {
  return setActiveMarathon(marathonId);
}

export function clearActiveMarathon() {
  return mutate(async () => {
    await AsyncStorage.removeItem(ACTIVE_KEY);

    return {
      cleared: true,
    };
  }, "cleared");
}

// ============================================================
// UNLOCK THE NEXT CHALLENGE
// ============================================================

export function unlockNextMarathon(
  completedMarathonId
) {
  return mutate(async () => {
    const marathon =
      getMarathonById(completedMarathonId);

    const next =
      getNextMarathon(completedMarathonId);

    if (!marathon || !next) {
      return null;
    }

    const map =
      await readProgressMap();

    if (!map[marathon.id].completed) {
      return null;
    }

    map[next.id] = {
      ...map[next.id],
      unlocked: true,
      lastUpdated: nowISO(),
    };

    await writeJSON(PROGRESS_KEY, map);

    return next;
  }).then(result =>
    result?.saved === false
      ? null
      : result
  );
}

// ============================================================
// ADD MARATHON STEPS
//
// Receives a NEW step delta from the tracking engine.
// Never pass today's total or a live sensor total directly.
// ============================================================

export function addMarathonSteps(stepDelta) {
  return mutate(async () => {
    const incoming = integer(stepDelta);

    if (!incoming) {
      return {
        saved: true,
        added: 0,
        overflow: 0,
        completedNow: false,
        reason: "zero-delta",
      };
    }

    const map =
      await readProgressMap();

    const active = activeFrom(
      await readActiveRecord(),
      map
    );

    if (!active) {
      return {
        saved: false,
        added: 0,
        overflow: incoming,
        completedNow: false,
        reason: "no-active-marathon",
      };
    }

    const marathon = active.marathon;
    const current = map[marathon.id];

    const added = Math.min(
      incoming,
      current.totalSteps - current.steps
    );

    const steps =
      current.steps + added;

    const completedNow =
      steps >= current.totalSteps;

    const now = nowISO();

    const progress = {
      ...current,
      steps,

      completed: completedNow,

      progress: completedNow
        ? 100
        : (steps / current.totalSteps) * 100,

      completedAt: completedNow
        ? current.completedAt || now
        : null,

      lastUpdated: now,
    };

    map[marathon.id] = progress;

    const next = completedNow
      ? getNextMarathon(marathon.id)
      : null;

    if (next) {
      map[next.id] = {
        ...map[next.id],
        unlocked: true,
        lastUpdated: now,
      };
    }

    // Save progress and the next unlock in one write.
    await writeJSON(PROGRESS_KEY, map);

    const cleanupWarning = completedNow
      ? await removeCompletedActive()
      : null;

    return {
      saved: true,
      added,
      overflow: incoming - added,
      completedNow,

      marathonId: marathon.id,
      marathon,
      progress,

      nextMarathonUnlocked: next,
      cleanupWarning,
    };
  });
}

// ============================================================
// COMPLETE ACTIVE MARATHON
//
// Does not invent missing steps.
// Does not pay rewards.
// ============================================================

export function completeActiveMarathon() {
  return mutate(async () => {
    const record =
      await readActiveRecord();

    const marathon = getMarathonById(
      record?.marathonId || record?.id
    );

    if (!marathon) {
      return {
        saved: false,
        reason: "no-active-marathon",
      };
    }

    const map =
      await readProgressMap();

    const current =
      map[marathon.id];

    if (current.steps < current.totalSteps) {
      return {
        saved: false,
        reason: "marathon-not-finished",

        marathon,
        progress: current,

        remainingSteps:
          current.totalSteps - current.steps,
      };
    }

    const now = nowISO();

    const progress = {
      ...current,
      completed: true,
      progress: 100,
      completedAt: current.completedAt || now,
      lastUpdated: now,
    };

    map[marathon.id] = progress;

    const next =
      getNextMarathon(marathon.id);

    if (next) {
      map[next.id] = {
        ...map[next.id],
        unlocked: true,
        lastUpdated: now,
      };
    }

    await writeJSON(PROGRESS_KEY, map);

    const cleanupWarning =
      await removeCompletedActive();

    return {
      saved: true,
      completedNow: !current.completedAt,

      marathon,
      progress,

      nextMarathonUnlocked: next,
      cleanupWarning,
    };
  });
}

// ============================================================
// COMPLETION ALERT RECORDS
// ============================================================

export function hasShownMarathonCompletionAlert(
  marathonId
) {
  return settledRead(async () => {
    const id =
      normalizeMarathonId(marathonId);

    if (!id) {
      return false;
    }

    const map = await readMap(ALERTS_KEY);

    return map[id] === true;
  });
}

export function markMarathonCompletionAlertShown(
  marathonId
) {
  return mutate(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return false;
    }

    const map =
      await readMap(ALERTS_KEY);

    await writeJSON(ALERTS_KEY, {
      ...map,
      [marathon.id]: true,
    });

    return true;
  }).then(result => result === true);
}

// ============================================================
// REWARD RECORDS
//
// These functions record claims.
// They do not credit the wallet, points balance, or avatar XP.
// ============================================================

export function loadMarathonRewards() {
  return settledRead(() =>
    readMap(REWARDS_KEY)
  );
}

export function saveMarathonRewardRecord(
  marathonId,
  rewardData
) {
  return mutate(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await readProgressMap();

    if (!map[marathon.id].completed) {
      return {
        saved: false,
        reason: "marathon-not-completed",
      };
    }

    if (!isObject(rewardData)) {
      return {
        saved: false,
        reason: "invalid-reward-data",
      };
    }

    const rewards =
      await readMap(REWARDS_KEY);

    const existing =
      rewards[marathon.id];

    if (existing?.claimedAt) {
      return {
        saved: true,
        alreadyClaimed: true,
        record: existing,
      };
    }

    const record = {
      ...existing,
      ...rewardData,

      marathonId: marathon.id,
      savedAt: nowISO(),
    };

    await writeJSON(REWARDS_KEY, {
      ...rewards,
      [marathon.id]: record,
    });

    return {
      saved: true,
      record,
    };
  });
}

// ============================================================
// MARK REWARD CLAIMED
//
// Call after the reward system confirms the award.
// Repeated calls preserve the existing claim timestamp.
// ============================================================

export function markMarathonRewardClaimed(
  marathonId
) {
  return mutate(async () => {
    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await readProgressMap();

    const current =
      map[marathon.id];

    if (!current.completed) {
      return {
        saved: false,
        reason: "marathon-not-completed",
      };
    }

    const rewards =
      await readMap(REWARDS_KEY);

    const now = nowISO();

    const record = {
      ...rewards[marathon.id],

      marathonId: marathon.id,
      title: marathon.title,

      rewardCoins:
        integer(marathon.rewardCoins),

      rewardPoints:
        integer(marathon.rewardPoints),

      avatarXP:
        integer(marathon.avatarXP),

      badge:
        marathon.badge || null,

      claimedAt:
        rewards[marathon.id]?.claimedAt || now,

      savedAt: now,
    };

    // The ledger remains authoritative if the progress
    // mirror cannot be written afterward.
    await writeJSON(REWARDS_KEY, {
      ...rewards,
      [marathon.id]: record,
    });

    const progress = {
      ...current,
      rewardClaimed: true,
      lastUpdated: now,
    };

    let progressWarning = null;

    try {
      await writeJSON(PROGRESS_KEY, {
        ...map,
        [marathon.id]: progress,
      });
    } catch (error) {
      progressWarning =
        error.message || String(error);
    }

    return {
      saved: true,
      alreadyClaimed: current.rewardClaimed,

      marathon,
      progress,
      record,

      progressWarning,
    };
  });
}

// ============================================================
// PASSPORT AND CERTIFICATE HELPERS
// ============================================================

function saveDocumentMap(
  key,
  field,
  value
) {
  return mutate(async () => {
    if (!isObject(value)) {
      return {
        saved: false,
        reason: `invalid-${field}`,
      };
    }

    const current =
      await readMap(key);

    const updated = {
      ...current,
      ...value,
    };

    await writeJSON(key, updated);

    return {
      saved: true,
      [field]: updated,
    };
  });
}

// ============================================================
// PASSPORT
// ============================================================

export function loadMarathonPassport() {
  return settledRead(() =>
    readMap(PASSPORT_KEY)
  );
}

export function saveMarathonPassport(passport) {
  return saveDocumentMap(
    PASSPORT_KEY,
    "passport",
    passport
  );
}

// ============================================================
// CERTIFICATES
// ============================================================

export function loadMarathonCertificates() {
  return settledRead(() =>
    readMap(CERTIFICATES_KEY)
  );
}

export function saveMarathonCertificates(
  certificates
) {
  return saveDocumentMap(
    CERTIFICATES_KEY,
    "certificates",
    certificates
  );
}

// ============================================================
// MARATHON MODE SNAPSHOT
// ============================================================

export async function getMarathonModeState() {
  const active =
    await getActiveMarathon();

  // This describes the selected marathon.
  // The session and engine determine whether walking is active.
  return {
    active: Boolean(active),

    marathonId:
      active?.marathonId || null,

    marathon:
      active?.marathon || null,

    progress:
      active?.progress || null,
  };
}

// ============================================================
// EXPLICIT DATA RESET
//
// Never call during ordinary activation or synchronization.
// This does not reset session, engine, or wallet storage.
// ============================================================

export function resetAllMarathonData() {
  return mutate(async () => {
    await AsyncStorage.multiRemove([
      PROGRESS_KEY,
      ACTIVE_KEY,
      REWARDS_KEY,
      ALERTS_KEY,
      PASSPORT_KEY,
      CERTIFICATES_KEY,
    ]);

    return {
      reset: true,
    };
  }, "reset");
}