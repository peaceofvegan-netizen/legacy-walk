import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNEY_PROGRESS_KEY = "LEGACY_WALK_JOURNEY_PROGRESS";
const ACTIVE_JOURNEY_KEY = "LEGACY_WALK_ACTIVE_JOURNEY";

const TOTAL_CHECKPOINTS = 5;
const STEPS_PER_MILE = 2000;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(Number(value) || 0, minimum), maximum);

const normalizeJourneyId = journeyId =>
  String(journeyId || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const createDefaultProgress = journeyId => ({
  journeyId: normalizeJourneyId(journeyId),

  status: "not-started",

  progress: 0,
  currentCheckpoint: 0,
  completedCheckpoints: [],
  storiesUnlocked: [],

  totalCheckpoints: TOTAL_CHECKPOINTS,

  stepsCompleted: 0,
  stepsTotal: 0,
  stepsRemaining: 0,

  milesCompleted: 0,
  milesTotal: 0,

  calories: 0,
  walkingTimeMinutes: 0,

  isTracking: false,
  isComplete: false,

  rewardsClaimed: false,
  passportUnlocked: false,
  certificateUnlocked: false,

  startedAt: null,
  updatedAt: null,
  completedAt: null,
});

const readProgressDatabase = async () => {
  try {
    const stored = await AsyncStorage.getItem(
      JOURNEY_PROGRESS_KEY
    );

    if (!stored) return {};

    const parsed = JSON.parse(stored);

    return parsed && typeof parsed === "object"
      ? parsed
      : {};
  } catch (error) {
    console.error(
      "Unable to read journey progress:",
      error
    );

    return {};
  }
};

const saveProgressDatabase = async database => {
  await AsyncStorage.setItem(
    JOURNEY_PROGRESS_KEY,
    JSON.stringify(database)
  );
};

const calculateCheckpoint = progressPercent => {
  if (progressPercent >= 100) return 5;
  if (progressPercent >= 75) return 4;
  if (progressPercent >= 50) return 3;
  if (progressPercent >= 25) return 2;
  if (progressPercent > 0) return 1;

  return 0;
};

const buildCheckpointArray = checkpoint => {
  if (checkpoint <= 0) return [];

  return Array.from(
    { length: checkpoint },
    (_, index) => index + 1
  );
};

export const calculateJourneyProgress = (
  journey,
  completedSteps = 0
) => {
  if (!journey) {
    return {
      percent: 0,
      progress: 0,

      stepsCompleted: 0,
      stepsTotal: 0,
      stepsRemaining: 0,

      milesCompleted: 0,
      milesTotal: 0,

      currentCheckpoint: 0,
      completedCheckpoints: [],
      storiesUnlocked: [],

      isComplete: false,
    };
  }

  const stepsTotal = Math.max(
    Number(
      journey.totalSteps ??
      journey.steps ??
      journey.requiredSteps ??
      0
    ),
    0
  );

  const stepsCompleted = clamp(
    completedSteps,
    0,
    stepsTotal || Number.MAX_SAFE_INTEGER
  );

  const rawPercent =
    stepsTotal > 0
      ? (stepsCompleted / stepsTotal) * 100
      : 0;

  const percent = clamp(
    Math.floor(rawPercent),
    0,
    100
  );

  const milesCompleted = Number(
    (stepsCompleted / STEPS_PER_MILE).toFixed(1)
  );

  const milesTotal = Number(
    (
      Number(journey.distanceMiles) ||
      Number(journey.distance) ||
      stepsTotal / STEPS_PER_MILE ||
      0
    ).toFixed(1)
  );

  const currentCheckpoint =
    calculateCheckpoint(percent);

  const completedCheckpoints =
    buildCheckpointArray(currentCheckpoint);

  return {
    percent,
    progress: percent,

    stepsCompleted,
    stepsTotal,
    stepsRemaining: Math.max(
      stepsTotal - stepsCompleted,
      0
    ),

    milesCompleted,
    milesTotal,

    currentCheckpoint,
    completedCheckpoints,
    storiesUnlocked: completedCheckpoints,

    isComplete:
      percent >= 100 &&
      currentCheckpoint >= TOTAL_CHECKPOINTS,
  };
};

export const getJourneyProgress = async journeyId => {
  const id = normalizeJourneyId(journeyId);

  if (!id) {
    return createDefaultProgress("");
  }

  const database = await readProgressDatabase();

  return {
    ...createDefaultProgress(id),
    ...(database[id] || {}),
  };
};

export const getAllJourneyProgress = async () => {
  return readProgressDatabase();
};

export const startJourneyProgress = async journey => {
  const journeyId = normalizeJourneyId(
    journey?.id ||
    journey?.journeyId ||
    journey?.slug
  );

  if (!journeyId) {
    throw new Error(
      "A valid journey ID is required."
    );
  }

  const database = await readProgressDatabase();
  const existing = database[journeyId];

  const stepsTotal = Math.max(
    Number(
      journey.totalSteps ??
      journey.steps ??
      journey.requiredSteps ??
      0
    ),
    0
  );

  const milesTotal = Number(
    (
      Number(journey.distanceMiles) ||
      Number(journey.distance) ||
      stepsTotal / STEPS_PER_MILE ||
      0
    ).toFixed(1)
  );

  const now = new Date().toISOString();

  const progress = {
    ...createDefaultProgress(journeyId),
    ...(existing || {}),

    journeyId,
    status:
      existing?.isComplete
        ? "completed"
        : "active",

    stepsTotal,
    milesTotal,

    isTracking: !existing?.isComplete,

    startedAt:
      existing?.startedAt || now,

    updatedAt: now,
  };

  database[journeyId] = progress;

  await Promise.all([
    saveProgressDatabase(database),

    AsyncStorage.setItem(
      ACTIVE_JOURNEY_KEY,
      journeyId
    ),
  ]);

  return progress;
};

export const updateJourneySteps = async (
  journey,
  completedSteps,
  additionalData = {}
) => {
  const journeyId = normalizeJourneyId(
    journey?.id ||
    journey?.journeyId ||
    journey?.slug
  );

  if (!journeyId) {
    throw new Error(
      "A valid journey ID is required."
    );
  }

  const database = await readProgressDatabase();

  const existing = {
    ...createDefaultProgress(journeyId),
    ...(database[journeyId] || {}),
  };

  const calculated =
    calculateJourneyProgress(
      journey,
      completedSteps
    );

  const now = new Date().toISOString();
  const completedNow =
    calculated.isComplete ||
    existing.isComplete;

  const progress = {
    ...existing,
    ...calculated,

    journeyId,

    calories: Math.max(
      Number(
        additionalData.calories ??
        existing.calories ??
        0
      ),
      0
    ),

    walkingTimeMinutes: Math.max(
      Number(
        additionalData.walkingTimeMinutes ??
        existing.walkingTimeMinutes ??
        0
      ),
      0
    ),

    status: completedNow
      ? "completed"
      : completedSteps > 0
        ? "active"
        : "not-started",

    isTracking: !completedNow,
    isComplete: completedNow,

    passportUnlocked: completedNow,
    certificateUnlocked: completedNow,

    completedAt: completedNow
      ? existing.completedAt || now
      : null,

    startedAt:
      existing.startedAt ||
      (completedSteps > 0 ? now : null),

    updatedAt: now,
  };

  database[journeyId] = progress;

  await saveProgressDatabase(database);

  return progress;
};

export const reachJourneyCheckpoint = async (
  journeyId,
  checkpointNumber
) => {
  const id = normalizeJourneyId(journeyId);

  if (!id) {
    throw new Error(
      "A valid journey ID is required."
    );
  }

  const checkpoint = clamp(
    checkpointNumber,
    1,
    TOTAL_CHECKPOINTS
  );

  const database = await readProgressDatabase();

  const existing = {
    ...createDefaultProgress(id),
    ...(database[id] || {}),
  };

  const highestCheckpoint = Math.max(
    existing.currentCheckpoint || 0,
    checkpoint
  );

  const completedCheckpoints =
    buildCheckpointArray(highestCheckpoint);

  const checkpointPercent =
    highestCheckpoint >= 5
      ? 100
      : highestCheckpoint === 4
        ? 75
        : highestCheckpoint === 3
          ? 50
          : highestCheckpoint === 2
            ? 25
            : 1;

  const now = new Date().toISOString();
  const completedNow =
    highestCheckpoint >= TOTAL_CHECKPOINTS;

  const progress = {
    ...existing,

    journeyId: id,

    currentCheckpoint: highestCheckpoint,
    completedCheckpoints,
    storiesUnlocked: completedCheckpoints,

    progress: Math.max(
      existing.progress || 0,
      checkpointPercent
    ),

    percent: Math.max(
      existing.percent || 0,
      checkpointPercent
    ),

    status: completedNow
      ? "completed"
      : "active",

    isTracking: !completedNow,
    isComplete: completedNow,

    passportUnlocked:
      completedNow ||
      existing.passportUnlocked,

    certificateUnlocked:
      completedNow ||
      existing.certificateUnlocked,

    startedAt:
      existing.startedAt || now,

    completedAt: completedNow
      ? existing.completedAt || now
      : existing.completedAt,

    updatedAt: now,
  };

  database[id] = progress;

  await saveProgressDatabase(database);

  return progress;
};

export const completeJourneyProgress = async journeyId => {
  const id = normalizeJourneyId(journeyId);

  if (!id) {
    throw new Error(
      "A valid journey ID is required."
    );
  }

  const database = await readProgressDatabase();

  const existing = {
    ...createDefaultProgress(id),
    ...(database[id] || {}),
  };

  const now = new Date().toISOString();

  const progress = {
    ...existing,

    journeyId: id,

    status: "completed",

    progress: 100,
    percent: 100,

    currentCheckpoint: 5,
    completedCheckpoints: [1, 2, 3, 4, 5],
    storiesUnlocked: [1, 2, 3, 4, 5],

    stepsCompleted:
      existing.stepsTotal > 0
        ? existing.stepsTotal
        : existing.stepsCompleted,

    stepsRemaining: 0,

    milesCompleted:
      existing.milesTotal > 0
        ? existing.milesTotal
        : existing.milesCompleted,

    isTracking: false,
    isComplete: true,

    passportUnlocked: true,
    certificateUnlocked: true,

    startedAt:
      existing.startedAt || now,

    completedAt:
      existing.completedAt || now,

    updatedAt: now,
  };

  database[id] = progress;

  await saveProgressDatabase(database);

  return progress;
};

export const markJourneyRewardsClaimed = async journeyId => {
  const id = normalizeJourneyId(journeyId);

  if (!id) return null;

  const database = await readProgressDatabase();

  const existing = {
    ...createDefaultProgress(id),
    ...(database[id] || {}),
  };

  const progress = {
    ...existing,
    rewardsClaimed: true,
    updatedAt: new Date().toISOString(),
  };

  database[id] = progress;

  await saveProgressDatabase(database);

  return progress;
};

export const getActiveJourneyId = async () => {
  return AsyncStorage.getItem(
    ACTIVE_JOURNEY_KEY
  );
};

export const getActiveJourneyProgress = async () => {
  const journeyId =
    await getActiveJourneyId();

  if (!journeyId) return null;

  return getJourneyProgress(journeyId);
};

export const setActiveJourney = async journeyId => {
  const id = normalizeJourneyId(journeyId);

  if (!id) {
    await AsyncStorage.removeItem(
      ACTIVE_JOURNEY_KEY
    );

    return null;
  }

  await AsyncStorage.setItem(
    ACTIVE_JOURNEY_KEY,
    id
  );

  return id;
};

export const resetJourneyProgress = async journeyId => {
  const id = normalizeJourneyId(journeyId);

  if (!id) return false;

  const database = await readProgressDatabase();

  delete database[id];

  await saveProgressDatabase(database);

  const activeJourneyId =
    await getActiveJourneyId();

  if (activeJourneyId === id) {
    await AsyncStorage.removeItem(
      ACTIVE_JOURNEY_KEY
    );
  }

  return true;
};

export const resetAllJourneyProgress = async () => {
  await Promise.all([
    AsyncStorage.removeItem(
      JOURNEY_PROGRESS_KEY
    ),

    AsyncStorage.removeItem(
      ACTIVE_JOURNEY_KEY
    ),
  ]);
};

export default {
  calculateJourneyProgress,
  getJourneyProgress,
  getAllJourneyProgress,
  startJourneyProgress,
  updateJourneySteps,
  reachJourneyCheckpoint,
  completeJourneyProgress,
  markJourneyRewardsClaimed,
  getActiveJourneyId,
  getActiveJourneyProgress,
  setActiveJourney,
  resetJourneyProgress,
  resetAllJourneyProgress,
};