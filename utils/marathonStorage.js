import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


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
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  await _accountSession.run(async () => (writeQueue));
  return operation();

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// ============================================================
// LOW-LEVEL STORAGE HELPERS
// ============================================================

async function readJSON(key, fallback) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const raw = await _accountSession2.run(async () => (AsyncStorage.getItem(key)));

  if (raw === null) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch (_cancelledError) {
    if (isAccountSessionEnded(_cancelledError)) throw _cancelledError;

    // Do not overwrite unreadable progress with an empty map.
    throw new Error(
      `Saved marathon data could not be read: ${key}`
    );
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function readMap(key) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const value = await _accountSession3.run(async () => (readJSON(key, {})));

  if (!isObject(value)) {
    throw new Error(
      `Invalid saved marathon data: ${key}`
    );
  }

  return value;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

async function writeJSON(key, value) {
  const _accountSession4 = captureAccountSession();
  const AsyncStorage = _accountSession4.storage;

  try {
    _accountSession4.assertCurrent();

  await _accountSession4.run(async () => (AsyncStorage.setItem(
    key,
    JSON.stringify(value)
  )));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  const stored =
    await _accountSession5.run(async () => (readMap(PROGRESS_KEY)));

  const rewards =
    await _accountSession5.run(async () => (readMap(REWARDS_KEY)));

  return normalizeMap(stored, rewards);

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// ============================================================
// ACTIVE MARATHON HELPERS
// ============================================================

async function readActiveRecord() {
  const _accountSession6 = captureAccountSession();

  try {
    _accountSession6.assertCurrent();

  const value =
    await _accountSession6.run(async () => (readJSON(ACTIVE_KEY, null)));

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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession7 = captureAccountSession();
  const AsyncStorage = _accountSession7.storage;

  try {
    _accountSession7.assertCurrent();

  try {
    await _accountSession7.run(async () => (AsyncStorage.removeItem(ACTIVE_KEY)));
    return null;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    // Progress has already committed.
    // Do not report the step credit as failed.
    return error.message || String(error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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
  const _accountSession8 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession8.assertCurrent();

    if (!isObject(progressMap)) {
      return {
        saved: false,
        reason: "invalid-progress-map",
      };
    }

    const current =
      await _accountSession8.run(async () => (readProgressMap()));

    const rewards =
      await _accountSession8.run(async () => (readMap(REWARDS_KEY)));

    const updated = normalizeMap(
      {
        ...current,
        ...progressMap,
      },
      rewards
    );

    await _accountSession8.run(async () => (writeJSON(
      PROGRESS_KEY,
      updated
    )));

    return {
      saved: true,
      progressMap: updated,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

export function getMarathonProgress(
  marathonId
) {
  const _accountSession9 = captureAccountSession();

  return settledRead(async () => {
  try {
    _accountSession9.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return null;
    }

    const map = await _accountSession9.run(async () => (readProgressMap()));

    return map[marathon.id];
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

export function getCompletedMarathonCount() {
  const _accountSession0 = captureAccountSession();

  return settledRead(async () => {
  try {
    _accountSession0.assertCurrent();

    const map = await _accountSession0.run(async () => (readProgressMap()));

    return MARATHON_CATALOG.filter(
      item => {
  

return (map[item.id].completed);
}
    ).length;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

export function isMarathonUnlocked(
  marathonId
) {
  const _accountSession1 = captureAccountSession();

  return settledRead(async () => {
  try {
    _accountSession1.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return false;
    }

    const map = await _accountSession1.run(async () => (readProgressMap()));

    return map[marathon.id].unlocked;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

// ============================================================
// GET ACTIVE MARATHON
// ============================================================

export function getActiveMarathon() {
  const _accountSession10 = captureAccountSession();

  return settledRead(async () => {
  try {
    _accountSession10.assertCurrent();

    const record =
      await _accountSession10.run(async () => (readActiveRecord()));

    const map =
      await _accountSession10.run(async () => (readProgressMap()));

    return activeFrom(record, map);
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

// ============================================================
// SET ACTIVE MARATHON
// ============================================================

export function setActiveMarathon(
  marathonId
) {
  const _accountSession11 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession11.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await _accountSession11.run(async () => (readProgressMap()));

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
      await _accountSession11.run(async () => (readActiveRecord())),
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

    await _accountSession11.run(async () => (writeJSON(PROGRESS_KEY, {
      ...map,
      [marathon.id]: updated,
    })));

    const active = {
      id: marathon.id,
      marathonId: marathon.id,
      startedAt: updated.startedAt,
      activatedAt: now,
    };

    await _accountSession11.run(async () => (writeJSON(ACTIVE_KEY, active)));

    return {
      saved: true,
      marathon,
      progress: updated,
      active,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

export function startMarathon(marathonId) {
  return setActiveMarathon(marathonId);
}

export function clearActiveMarathon() {
  const _accountSession12 = captureAccountSession();
  const AsyncStorage = _accountSession12.storage;

  return mutate(async () => {
  try {
    _accountSession12.assertCurrent();

    await _accountSession12.run(async () => (AsyncStorage.removeItem(ACTIVE_KEY)));

    return {
      cleared: true,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}, "cleared");
}

// ============================================================
// UNLOCK THE NEXT CHALLENGE
// ============================================================

export function unlockNextMarathon(
  completedMarathonId
) {
  const _accountSession13 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession13.assertCurrent();

    const marathon =
      getMarathonById(completedMarathonId);

    const next =
      getNextMarathon(completedMarathonId);

    if (!marathon || !next) {
      return null;
    }

    const map =
      await _accountSession13.run(async () => (readProgressMap()));

    if (!map[marathon.id].completed) {
      return null;
    }

    map[next.id] = {
      ...map[next.id],
      unlocked: true,
      lastUpdated: nowISO(),
    };

    await _accountSession13.run(async () => (writeJSON(PROGRESS_KEY, map)));

    return next;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}).then(result =>
    {
  if (!_accountSession13.isCurrent()) return;

return (result?.saved === false
      ? null
      : result);
}
  );
}

// ============================================================
// ADD MARATHON STEPS
//
// Receives a NEW step delta from the tracking engine.
// Never pass today's total or a live sensor total directly.
// ============================================================

export function addMarathonSteps(stepDelta, options = {}) {
  const _accountSession14 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession14.assertCurrent();

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
      await _accountSession14.run(async () => (readProgressMap()));

    // The engine journals a credit ID before calling us. Save its receipt in
    // the same JSON object as progress, so a retry after a crash is idempotent.
    const requestedId = options.marathonId && normalizeMarathonId(options.marathonId);
    const receipt = requestedId && map[requestedId]?.lastStepCredit;
    if (options.creditId && receipt?.id === options.creditId) {
      return { saved: true, added: receipt.added, completedNow: receipt.completedNow,
        overflow: incoming - receipt.added, marathonId: requestedId,
        marathon: getMarathonById(requestedId), progress: map[requestedId], duplicate: true };
    }


    const active = activeFrom(
      await _accountSession14.run(async () => (readActiveRecord())),
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
    if (requestedId && requestedId !== marathon.id) {
      return { saved: false, added: 0, reason: "marathon-owner-changed" };
    }
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

    if (options.creditId) {
      progress.lastStepCredit = { id: options.creditId, added, completedNow };
    }
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
    await _accountSession14.run(async () => (writeJSON(PROGRESS_KEY, map)));

    const cleanupWarning = completedNow
      ? await _accountSession14.run(async () => (removeCompletedActive()))
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
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

// ============================================================
// COMPLETE ACTIVE MARATHON
//
// Does not invent missing steps.
// Does not pay rewards.
// ============================================================

export function completeActiveMarathon() {
  const _accountSession15 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession15.assertCurrent();

    const record =
      await _accountSession15.run(async () => (readActiveRecord()));

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
      await _accountSession15.run(async () => (readProgressMap()));

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

    await _accountSession15.run(async () => (writeJSON(PROGRESS_KEY, map)));

    const cleanupWarning =
      await _accountSession15.run(async () => (removeCompletedActive()));

    return {
      saved: true,
      completedNow: !current.completedAt,

      marathon,
      progress,

      nextMarathonUnlocked: next,
      cleanupWarning,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

// ============================================================
// COMPLETION ALERT RECORDS
// ============================================================

export function hasShownMarathonCompletionAlert(
  marathonId
) {
  const _accountSession16 = captureAccountSession();

  return settledRead(async () => {
  try {
    _accountSession16.assertCurrent();

    const id =
      normalizeMarathonId(marathonId);

    if (!id) {
      return false;
    }

    const map = await _accountSession16.run(async () => (readMap(ALERTS_KEY)));

    return map[id] === true;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
});
}

export function markMarathonCompletionAlertShown(
  marathonId
) {
  const _accountSession17 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession17.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return false;
    }

    const map =
      await _accountSession17.run(async () => (readMap(ALERTS_KEY)));

    await _accountSession17.run(async () => (writeJSON(ALERTS_KEY, {
      ...map,
      [marathon.id]: true,
    })));

    return true;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}).then(result => {
  if (!_accountSession17.isCurrent()) return;

return (result === true);
});
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
  const _accountSession18 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession18.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await _accountSession18.run(async () => (readProgressMap()));

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
      await _accountSession18.run(async () => (readMap(REWARDS_KEY)));

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

    await _accountSession18.run(async () => (writeJSON(REWARDS_KEY, {
      ...rewards,
      [marathon.id]: record,
    })));

    return {
      saved: true,
      record,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession19 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession19.assertCurrent();

    const marathon =
      getMarathonById(marathonId);

    if (!marathon) {
      return {
        saved: false,
        reason: "marathon-not-found",
      };
    }

    const map =
      await _accountSession19.run(async () => (readProgressMap()));

    const current =
      map[marathon.id];

    if (!current.completed) {
      return {
        saved: false,
        reason: "marathon-not-completed",
      };
    }

    const rewards =
      await _accountSession19.run(async () => (readMap(REWARDS_KEY)));

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
    await _accountSession19.run(async () => (writeJSON(REWARDS_KEY, {
      ...rewards,
      [marathon.id]: record,
    })));

    const progress = {
      ...current,
      rewardClaimed: true,
      lastUpdated: now,
    };

    let progressWarning = null;

    try {
      await _accountSession19.run(async () => (writeJSON(PROGRESS_KEY, {
        ...map,
        [marathon.id]: progress,
      })));
    } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

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
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession20 = captureAccountSession();

  return mutate(async () => {
  try {
    _accountSession20.assertCurrent();

    if (!isObject(value)) {
      return {
        saved: false,
        reason: `invalid-${field}`,
      };
    }

    const current =
      await _accountSession20.run(async () => (readMap(key)));

    const updated = {
      ...current,
      ...value,
    };

    await _accountSession20.run(async () => (writeJSON(key, updated)));

    return {
      saved: true,
      [field]: updated,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession21 = captureAccountSession();

  try {
    _accountSession21.assertCurrent();

  const active =
    await _accountSession21.run(async () => (getActiveMarathon()));

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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// ============================================================
// EXPLICIT DATA RESET
//
// Never call during ordinary activation or synchronization.
// This does not reset session, engine, or wallet storage.
// ============================================================

export function resetAllMarathonData() {
  const _accountSession22 = captureAccountSession();
  const AsyncStorage = _accountSession22.storage;

  return mutate(async () => {
  try {
    _accountSession22.assertCurrent();

    await _accountSession22.run(async () => (AsyncStorage.multiRemove([
      PROGRESS_KEY,
      ACTIVE_KEY,
      REWARDS_KEY,
      ALERTS_KEY,
      PASSPORT_KEY,
      CERTIFICATES_KEY,
    ])));

    return {
      reset: true,
    };
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}, "reset");
}