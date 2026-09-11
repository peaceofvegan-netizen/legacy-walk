// ============================================================
// LEGATHON WALK
// utils/stepTrackingEngine.js
//
// MASTER PHYSICAL STEP ROUTER
//
// A physical step can have only one owner:
//
// JOURNEY
// or
// MARATHON
//
// Marathon steps never increase Journey lifetime steps or
// tracksuit progression.
// ============================================================

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  Pedometer,
} from "expo-sensors";

import {
  addMarathonSteps as saveMarathonProgressSteps,
  getActiveMarathon,
} from "./marathonStorage";

// ============================================================
// STORAGE KEYS
// ============================================================

export const STEP_STATS_KEY =
  "@legathon_step_stats";

export const STEP_ROUTER_KEY =
  "@legathon_step_router";

export const ACTIVE_DESTINATION_KEY =
  "@legathon_active_step_destination";

export const JOURNEY_REWARD_STEPS_KEY =
  "@legathon_journey_reward_steps";

// ============================================================
// DESTINATIONS
// ============================================================

export const STEP_DESTINATIONS = {
  NONE: "none",
  JOURNEY: "journey",
  MARATHON: "marathon",
};

// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(
    0,
    number
  );
}

function safeInteger(
  value,
  fallback = 0
) {
  return Math.max(
    0,
    Math.floor(
      safeNumber(
        value,
        fallback
      )
    )
  );
}

function nowISO() {
  return new Date().toISOString();
}

function getDateKey(
  date = new Date()
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function parseJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log(
      "Step engine JSON error:",
      error
    );

    return fallback;
  }
}

// ============================================================
// DISTANCE AND CALORIES
// ============================================================

export function stepsToMiles(
  steps
) {
  return Number(
    (
      safeInteger(steps) /
      2000
    ).toFixed(2)
  );
}

export function stepsToCalories(
  steps
) {
  return Math.round(
    safeInteger(steps) *
      0.04
  );
}

// ============================================================
// DEFAULT STEP STATS
// ============================================================

function createDefaultStepStats() {
  return {
    dateKey:
      getDateKey(),

    todaySteps: 0,

    // Journey lifetime reward steps.
    lifetimeSteps: 0,

    journeyLifetimeSteps: 0,

    // Separate Marathon total.
    marathonLifetimeSteps: 0,

    liveSessionSteps: 0,

    miles: 0,

    milesWalked: 0,

    calories: 0,

    caloriesBurned: 0,

    dayStreak: 0,

    lastUpdated: null,
  };
}

// ============================================================
// NORMALIZE STEP STATS
// ============================================================

function normalizeStepStats(
  stats = {}
) {
  const today =
    getDateKey();

  const savedDate =
    stats?.dateKey ||
    today;

  const sameDay =
    savedDate === today;

  const journeyLifetimeSteps =
    safeInteger(
      stats?.journeyLifetimeSteps ??
        stats?.lifetimeSteps ??
        stats?.totalSteps
    );

  const marathonLifetimeSteps =
    safeInteger(
      stats?.marathonLifetimeSteps
    );

  const todaySteps =
    sameDay
      ? safeInteger(
          stats?.todaySteps
        )
      : 0;

  return {
    ...createDefaultStepStats(),

    ...stats,

    dateKey:
      today,

    todaySteps,

    lifetimeSteps:
      journeyLifetimeSteps,

    totalSteps:
      journeyLifetimeSteps,

    journeyLifetimeSteps,

    marathonLifetimeSteps,

    liveSessionSteps:
      sameDay
        ? safeInteger(
            stats?.liveSessionSteps
          )
        : 0,

    miles:
      stepsToMiles(
        journeyLifetimeSteps
      ),

    milesWalked:
      stepsToMiles(
        journeyLifetimeSteps
      ),

    calories:
      stepsToCalories(
        todaySteps
      ),

    caloriesBurned:
      stepsToCalories(
        todaySteps
      ),

    dayStreak:
      safeInteger(
        stats?.dayStreak
      ),

    lastUpdated:
      stats?.lastUpdated ||
      null,
  };
}

// ============================================================
// LOAD STEP STATS
// ============================================================

export async function loadStepStats() {
  try {
    const saved =
      await AsyncStorage.getItem(
        STEP_STATS_KEY
      );

    if (!saved) {
      return createDefaultStepStats();
    }

    const parsed =
      parseJSON(
        saved,
        {}
      );

    return normalizeStepStats(
      parsed
    );
  } catch (error) {
    console.log(
      "Load step stats error:",
      error
    );

    return createDefaultStepStats();
  }
}

// ============================================================
// SAVE STEP STATS
// ============================================================

export async function saveStepStats(
  stats = {}
) {
  try {
    const normalized =
      normalizeStepStats({
        ...stats,

        lastUpdated:
          stats?.lastUpdated ||
          nowISO(),
      });

    await AsyncStorage.setItem(
      STEP_STATS_KEY,
      JSON.stringify(
        normalized
      )
    );

    return {
      saved: true,
      stats:
        normalized,
    };
  } catch (error) {
    console.log(
      "Save step stats error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}

// ============================================================
// PEDOMETER AVAILABILITY
// ============================================================

export async function isStepTrackingAvailable() {
  try {
    const available =
      await Pedometer.isAvailableAsync();

    return Boolean(
      available
    );
  } catch (error) {
    console.log(
      "Pedometer availability error:",
      error
    );

    return false;
  }
}

// ============================================================
// GET PHYSICAL PHONE STEPS TODAY
//
// This is the cumulative iPhone step count since midnight.
//
// It is not credited directly.
//
// The router compares it with the last saved phone count and
// credits only the new difference.
// ============================================================

export async function getTodaySteps() {
  try {
    const available =
      await isStepTrackingAvailable();

    if (!available) {
      return 0;
    }

    const end =
      new Date();

    const start =
      new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    const result =
      await Pedometer.getStepCountAsync(
        start,
        end
      );

    return safeInteger(
      result?.steps
    );
  } catch (error) {
    console.log(
      "Get physical steps error:",
      error
    );

    return 0;
  }
}

// ============================================================
// JOURNEY LIFETIME STEPS
// ============================================================

export async function getLifetimeSteps() {
  const stats =
    await loadStepStats();

  return safeInteger(
    stats?.journeyLifetimeSteps ??
      stats?.lifetimeSteps
  );
}

export async function getJourneyLifetimeSteps() {
  try {
    const stats =
      await loadStepStats();

    const [
      lowerCaseValue,
      upperCaseValue,
    ] =
      await Promise.all([
        AsyncStorage.getItem(
          "lifetimeSteps"
        ),

        AsyncStorage.getItem(
          "LifetimeSteps"
        ),
      ]);

    const lifetimeSteps =
      Math.max(
        safeInteger(
          stats?.journeyLifetimeSteps
        ),

        safeInteger(
          stats?.lifetimeSteps
        ),

        safeInteger(
          stats?.totalSteps
        ),

        safeInteger(
          lowerCaseValue
        ),

        safeInteger(
          upperCaseValue
        )
      );

    await Promise.all([
      AsyncStorage.setItem(
        "lifetimeSteps",
        String(
          lifetimeSteps
        )
      ),

      AsyncStorage.setItem(
        "LifetimeSteps",
        String(
          lifetimeSteps
        )
      ),
    ]);

    return lifetimeSteps;
  } catch (error) {
    console.log(
      "Get Journey lifetime error:",
      error
    );

    return 0;
  }
}

// ============================================================
// JOURNEY REWARD STEPS
// ============================================================

export async function getJourneyRewardSteps() {
  try {
    const saved =
      await AsyncStorage.getItem(
        JOURNEY_REWARD_STEPS_KEY
      );

    if (saved !== null) {
      return safeInteger(
        saved
      );
    }

    return getJourneyLifetimeSteps();
  } catch (error) {
    console.log(
      "Get Journey reward steps error:",
      error
    );

    return 0;
  }
}

// ============================================================
// MARATHON LIFETIME STEPS
// ============================================================

export async function getMarathonLifetimeSteps() {
  const stats =
    await loadStepStats();

  return safeInteger(
    stats?.marathonLifetimeSteps
  );
}

// ============================================================
// ROUTER STATE
// ============================================================

function createDefaultRouterState() {
  return {
    dateKey: null,

    lastDeviceSteps: null,

    lastDestination: null,

    lastMarathonId: null,

    lastJourneyId: null,

    lastDelta: 0,

    lastUpdated: null,
  };
}

// ============================================================
// LOAD ROUTER
// ============================================================

async function loadRouterState() {
  try {
    const saved =
      await AsyncStorage.getItem(
        STEP_ROUTER_KEY
      );

    if (!saved) {
      return createDefaultRouterState();
    }

    const parsed =
      parseJSON(
        saved,
        {}
      );

    return {
      ...createDefaultRouterState(),

      ...parsed,

      lastDeviceSteps:
        parsed?.lastDeviceSteps ===
          null ||
        parsed?.lastDeviceSteps ===
          undefined
          ? null
          : safeInteger(
              parsed.lastDeviceSteps
            ),

      lastDelta:
        safeInteger(
          parsed?.lastDelta
        ),
    };
  } catch (error) {
    console.log(
      "Load step router error:",
      error
    );

    return createDefaultRouterState();
  }
}

// ============================================================
// SAVE ROUTER
// ============================================================

async function saveRouterState(
  routerState
) {
  try {
    const normalized = {
      ...createDefaultRouterState(),

      ...routerState,

      lastUpdated:
        routerState?.lastUpdated ||
        nowISO(),
    };

    await AsyncStorage.setItem(
      STEP_ROUTER_KEY,
      JSON.stringify(
        normalized
      )
    );

    return {
      saved: true,
      state:
        normalized,
    };
  } catch (error) {
    console.log(
      "Save step router error:",
      error
    );

    return {
      saved: false,
      error,
    };
  }
}

// ============================================================
// RESET PHYSICAL BASELINE
//
// This is called whenever ownership changes:
//
// Journey → Marathon
// Marathon → Journey
//
// The next phone reading establishes a new baseline without
// crediting older physical steps.
// ============================================================

export async function resetStepRouterBaseline() {
  try {
    const state =
      createDefaultRouterState();

    const result =
      await saveRouterState(
        state
      );

    return {
      reset:
        result?.saved ===
        true,

      state:
        result?.state ||
        state,
    };
  } catch (error) {
    console.log(
      "Reset router baseline error:",
      error
    );

    return {
      reset: false,
      error,
    };
  }
}

// ============================================================
// GET ACTIVE DESTINATION
// ============================================================

export async function getActiveStepDestination() {
  try {
    const saved =
      await AsyncStorage.getItem(
        ACTIVE_DESTINATION_KEY
      );

    if (
      saved ===
        STEP_DESTINATIONS.JOURNEY ||
      saved ===
        STEP_DESTINATIONS.MARATHON
    ) {
      return saved;
    }

    return STEP_DESTINATIONS.NONE;
  } catch (error) {
    console.log(
      "Get active destination error:",
      error
    );

    return STEP_DESTINATIONS.NONE;
  }
}

// ============================================================
// SET ACTIVE DESTINATION
// ============================================================

export async function setActiveStepDestination(
  destination
) {
  let normalized =
    STEP_DESTINATIONS.NONE;

  if (
    destination ===
    STEP_DESTINATIONS.JOURNEY
  ) {
    normalized =
      STEP_DESTINATIONS.JOURNEY;
  }

  if (
    destination ===
    STEP_DESTINATIONS.MARATHON
  ) {
    normalized =
      STEP_DESTINATIONS.MARATHON;
  }

  try {
    await AsyncStorage.setItem(
      ACTIVE_DESTINATION_KEY,
      normalized
    );

    return {
      saved: true,
      destination:
        normalized,
    };
  } catch (error) {
    console.log(
      "Set active destination error:",
      error
    );

    return {
      saved: false,
      destination:
        STEP_DESTINATIONS.NONE,
      error,
    };
  }
}

// ============================================================
// ACTIVATE JOURNEY ROUTING
// ============================================================

export async function activateJourneyTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.JOURNEY
  );
}

// ============================================================
// ACTIVATE MARATHON ROUTING
// ============================================================

export async function activateMarathonTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.MARATHON
  );
}

// ============================================================
// STOP STEP ROUTING
// ============================================================

export async function deactivateStepTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.NONE
  );
}

// ============================================================
// CURRENT STEP OWNER
// ============================================================

export async function getCurrentStepOwner() {
  try {
    const destination =
      await getActiveStepDestination();

    const marathonActive =
      destination ===
      STEP_DESTINATIONS.MARATHON;

    const journeyActive =
      destination ===
      STEP_DESTINATIONS.JOURNEY;

    const activeMarathon =
      marathonActive
        ? await getActiveMarathon()
        : null;

    const marathonId =
      activeMarathon?.marathonId ??
      activeMarathon?.id ??
      activeMarathon
        ?.marathon?.id ??
      null;

    return {
      owner:
        marathonActive
          ? "marathon"
          : journeyActive
            ? "journey"
            : null,

      destination,

      marathonActive,

      legathonActive:
        marathonActive,

      journeyActive,

      marathonId,
    };
  } catch (error) {
    console.log(
      "Get current step owner error:",
      error
    );

    return {
      owner: null,

      destination:
        STEP_DESTINATIONS.NONE,

      marathonActive: false,

      legathonActive: false,

      journeyActive: false,

      marathonId: null,

      error,
    };
  }
}

// ============================================================
// ADD REGULAR JOURNEY STEPS
// ============================================================

export async function addRegularJourneySteps(
  stepDelta = 0
) {
  const delta =
    safeInteger(
      stepDelta
    );

  if (delta <= 0) {
    return {
      saved: true,
      added: 0,
      reason: "zero-delta",
      stats:
        await loadStepStats(),
    };
  }

  try {
    const destination =
      await getActiveStepDestination();

    if (
      destination ===
      STEP_DESTINATIONS.MARATHON
    ) {
      return {
        saved: true,
        added: 0,
        blocked: true,

        reason:
          "marathon-owns-steps",
      };
    }

    const stats =
      await loadStepStats();

    const previousLifetime =
      safeInteger(
        stats?.journeyLifetimeSteps ??
          stats?.lifetimeSteps
      );

    const lifetimeSteps =
      previousLifetime +
      delta;

    const todaySteps =
      safeInteger(
        stats?.todaySteps
      ) + delta;

    const updated = {
      ...stats,

      dateKey:
        getDateKey(),

      todaySteps,

      lifetimeSteps,

      totalSteps:
        lifetimeSteps,

      journeyLifetimeSteps:
        lifetimeSteps,

      liveSessionSteps:
        safeInteger(
          stats?.liveSessionSteps
        ) + delta,

      miles:
        stepsToMiles(
          lifetimeSteps
        ),

      milesWalked:
        stepsToMiles(
          lifetimeSteps
        ),

      calories:
        stepsToCalories(
          todaySteps
        ),

      caloriesBurned:
        stepsToCalories(
          todaySteps
        ),

      lastUpdated:
        nowISO(),
    };

    const savedResult =
      await saveStepStats(
        updated
      );

    if (!savedResult?.saved) {
      return {
        saved: false,
        added: 0,
        error:
          savedResult?.error,
      };
    }

    await Promise.all([
      AsyncStorage.setItem(
        JOURNEY_REWARD_STEPS_KEY,
        String(
          lifetimeSteps
        )
      ),

      AsyncStorage.setItem(
        "lifetimeSteps",
        String(
          lifetimeSteps
        )
      ),

      AsyncStorage.setItem(
        "LifetimeSteps",
        String(
          lifetimeSteps
        )
      ),
    ]);

    return {
      saved: true,

      added:
        delta,

      todaySteps,

      lifetimeSteps,

      journeyLifetimeSteps:
        lifetimeSteps,

      rewardSteps:
        lifetimeSteps,

      stats:
        savedResult.stats,
    };
  } catch (error) {
    console.log(
      "Add Journey steps error:",
      error
    );

    return {
      saved: false,
      added: 0,
      error,
    };
  }
}

// ============================================================
// ADD MARATHON STEPS
//
// This function updates:
//
// 1. The active Marathon progress in marathonStorage.js.
// 2. The separate Marathon lifetime statistic.
//
// It does not increase Journey lifetime or tracksuit steps.
// ============================================================

export async function addMarathonSteps(
  stepDelta = 0
) {
  const delta =
    safeInteger(
      stepDelta
    );

  if (delta <= 0) {
    return {
      saved: true,
      added: 0,
      overflow: 0,
      completedNow: false,
      reason: "zero-delta",
    };
  }

  try {
    const destination =
      await getActiveStepDestination();

    if (
      destination !==
      STEP_DESTINATIONS.MARATHON
    ) {
      return {
        saved: false,

        added: 0,

        overflow:
          delta,

        completedNow:
          false,

        reason:
          "marathon-not-active",
      };
    }

    const marathonResult =
      await saveMarathonProgressSteps(
        delta
      );

    if (!marathonResult?.saved) {
      return {
        ...marathonResult,

        saved: false,

        added: 0,
      };
    }

    const creditedSteps =
      safeInteger(
        marathonResult?.added
      );

    const stats =
      await loadStepStats();

    const marathonLifetimeSteps =
      safeInteger(
        stats?.marathonLifetimeSteps
      ) + creditedSteps;

    const todaySteps =
      safeInteger(
        stats?.todaySteps
      ) + creditedSteps;

    const updated = {
      ...stats,

      dateKey:
        getDateKey(),

      todaySteps,

      marathonLifetimeSteps,

      liveSessionSteps:
        safeInteger(
          stats?.liveSessionSteps
        ) + creditedSteps,

      calories:
        stepsToCalories(
          todaySteps
        ),

      caloriesBurned:
        stepsToCalories(
          todaySteps
        ),

      lastUpdated:
        nowISO(),
    };

    const statsResult =
      await saveStepStats(
        updated
      );

    return {
      ...marathonResult,

      saved:
        statsResult?.saved ===
        true,

      added:
        creditedSteps,

      todaySteps,

      marathonLifetimeSteps,

      journeyLifetimeSteps:
        safeInteger(
          stats?.journeyLifetimeSteps
        ),

      stats:
        statsResult?.stats ||
        updated,
    };
  } catch (error) {
    console.log(
      "Add Marathon steps error:",
      error
    );

    return {
      saved: false,
      added: 0,
      overflow: 0,
      completedNow: false,

      reason:
        "marathon-step-error",

      error,
    };
  }
}

// ============================================================
// CALCULATE NEW PHYSICAL STEP DELTA
// ============================================================

async function calculatePhysicalStepDelta(
  deviceSteps
) {
  const currentDeviceSteps =
    safeInteger(
      deviceSteps
    );

  const today =
    getDateKey();

  const router =
    await loadRouterState();

  // A new day establishes a new baseline.
  if (
    router.dateKey !==
    today
  ) {
    const nextRouter = {
      ...createDefaultRouterState(),

      dateKey:
        today,

      lastDeviceSteps:
        currentDeviceSteps,

      lastDelta: 0,

      lastUpdated:
        nowISO(),
    };

    await saveRouterState(
      nextRouter
    );

    return {
      delta: 0,

      router:
        nextRouter,

      baselineEstablished:
        true,
    };
  }

  // First physical reading establishes the baseline.
  if (
    router.lastDeviceSteps ===
      null ||
    router.lastDeviceSteps ===
      undefined
  ) {
    const nextRouter = {
      ...router,

      dateKey:
        today,

      lastDeviceSteps:
        currentDeviceSteps,

      lastDelta: 0,

      lastUpdated:
        nowISO(),
    };

    await saveRouterState(
      nextRouter
    );

    return {
      delta: 0,

      router:
        nextRouter,

      baselineEstablished:
        true,
    };
  }

  const previousDeviceSteps =
    safeInteger(
      router.lastDeviceSteps
    );

  // When the device counter decreases, do not create negative
  // or artificial steps.
  if (
    currentDeviceSteps <
    previousDeviceSteps
  ) {
    const nextRouter = {
      ...router,

      dateKey:
        today,

      lastDeviceSteps:
        currentDeviceSteps,

      lastDelta: 0,

      lastUpdated:
        nowISO(),
    };

    await saveRouterState(
      nextRouter
    );

    return {
      delta: 0,

      router:
        nextRouter,

      resetDetected:
        true,

      baselineEstablished:
        true,
    };
  }

  const delta =
    currentDeviceSteps -
    previousDeviceSteps;

  return {
    delta,

    router,

    baselineEstablished:
      false,
  };
}

// ============================================================
// CENTRAL PHYSICAL STEP ROUTER
// ============================================================

export async function routePhysicalSteps({
  deviceSteps = 0,

  destination = null,

  journeyId = null,

  marathonId = null,
} = {}) {
  try {
    const activeDestination =
      destination ||
      (
        await getActiveStepDestination()
      );

    const physical =
      await calculatePhysicalStepDelta(
        deviceSteps
      );

    const delta =
      safeInteger(
        physical?.delta
      );

    // Acknowledge the phone reading even when there are no new
    // steps.
    if (delta <= 0) {
      return {
        routed: false,

        destination:
          activeDestination,

        delta: 0,

        marathonId,

        journeyId,

        baselineEstablished:
          Boolean(
            physical
              ?.baselineEstablished
          ),

        resetDetected:
          Boolean(
            physical
              ?.resetDetected
          ),
      };
    }

    let result = null;

    if (
      activeDestination ===
      STEP_DESTINATIONS.JOURNEY
    ) {
      result =
        await addRegularJourneySteps(
          delta
        );
    } else if (
      activeDestination ===
      STEP_DESTINATIONS.MARATHON
    ) {
      result =
        await addMarathonSteps(
          delta
        );
    } else {
      result = {
        saved: true,
        added: 0,

        reason:
          "no-active-destination",
      };
    }

    if (
      result?.saved !== true
    ) {
      return {
        routed: false,

        destination:
          activeDestination,

        delta,

        marathonId,

        journeyId,

        result,

        reason:
          result?.reason ||
          "destination-save-failed",
      };
    }

    // Save the phone checkpoint only after the destination
    // successfully persists the new delta.
    const routerResult =
      await saveRouterState({
        ...physical.router,

        dateKey:
          getDateKey(),

        lastDeviceSteps:
          safeInteger(
            deviceSteps
          ),

        lastDestination:
          activeDestination,

        lastJourneyId:
          activeDestination ===
            STEP_DESTINATIONS.JOURNEY
            ? journeyId
            : null,

        lastMarathonId:
          activeDestination ===
            STEP_DESTINATIONS.MARATHON
            ? marathonId
            : null,

        lastDelta:
          delta,

        lastUpdated:
          nowISO(),
      });

    if (
      routerResult?.saved !==
      true
    ) {
      return {
        routed: false,

        destination:
          activeDestination,

        delta,

        marathonId,

        journeyId,

        result,

        reason:
          "router-save-failed",

        error:
          routerResult?.error,
      };
    }

    return {
      routed:
        activeDestination !==
        STEP_DESTINATIONS.NONE,

      destination:
        activeDestination,

      delta,

      added:
        safeInteger(
          result?.added
        ),

      marathonId,

      journeyId,

      completedNow:
        result?.completedNow ===
        true,

      overflow:
        safeInteger(
          result?.overflow
        ),

      result,
    };
  } catch (error) {
    console.log(
      "Route physical steps error:",
      error
    );

    return {
      routed: false,
      delta: 0,
      error,
    };
  }
}

// ============================================================
// SYNCHRONIZE PHYSICAL PHONE STEPS
//
// Called by MarathonScreen, Dashboard, application foreground,
// and the manual Sync Walking Progress button.
// ============================================================

export async function syncTodaySteps() {
  try {
    const deviceSteps =
      await getTodaySteps();

    const owner =
      await getCurrentStepOwner();

    const routed =
      await routePhysicalSteps({
        deviceSteps,

        destination:
          owner.destination,

        marathonId:
          owner.marathonId,
      });

    return {
      ...routed,

      synced: true,

      deviceSteps,

      owner:
        owner.owner,

      marathonId:
        routed?.marathonId ||
        owner.marathonId ||
        null,

      completedNow:
        routed?.completedNow ===
          true ||
        routed?.result
          ?.completedNow ===
          true,

      marathon:
        routed?.result
          ?.marathon ||
        null,

      progress:
        routed?.result
          ?.progress ||
        null,

      nextMarathonUnlocked:
        routed?.result
          ?.nextMarathonUnlocked ||
        null,
    };
  } catch (error) {
    console.log(
      "Synchronize physical steps error:",
      error
    );

    return {
      synced: false,

      routed: false,

      delta: 0,

      completedNow:
        false,

      error,
    };
  }
}

// ============================================================
// LIVE STEP WATCHER
//
// This watcher provides immediate UI feedback only.
//
// It does not save progress. Persistent credit is controlled by
// syncTodaySteps(), preventing duplicate step credit.
// ============================================================

export function watchLiveSteps(
  onStepUpdate
) {
  try {
    const subscription =
      Pedometer.watchStepCount(
        async result => {
          try {
            const owner =
              await getCurrentStepOwner();

            if (
              typeof onStepUpdate ===
              "function"
            ) {
              onStepUpdate({
                liveSteps:
                  safeInteger(
                    result?.steps
                  ),

                owner:
                  owner.owner,

                destination:
                  owner.destination,

                marathonId:
                  owner.marathonId,

                marathonActive:
                  owner
                    .marathonActive,

                legathonActive:
                  owner
                    .legathonActive,
              });
            }
          } catch (error) {
            console.log(
              "Live step callback error:",
              error
            );
          }
        }
      );

    return subscription;
  } catch (error) {
    console.log(
      "Start live step watcher error:",
      error
    );

    return null;
  }
}

// ============================================================
// STOP LIVE WATCHER
// ============================================================

export function stopLiveSteps(
  subscription
) {
  try {
    subscription?.remove?.();

    return true;
  } catch (error) {
    console.log(
      "Stop live step watcher error:",
      error
    );

    return false;
  }
}

// ============================================================
// COMPLETE SNAPSHOT
// ============================================================

export async function getStepTrackingSnapshot() {
  try {
    const [
      stats,
      router,
      owner,
      journeyRewardSteps,
    ] =
      await Promise.all([
        loadStepStats(),

        loadRouterState(),

        getCurrentStepOwner(),

        getJourneyRewardSteps(),
      ]);

    return {
      todaySteps:
        safeInteger(
          stats?.todaySteps
        ),

      lifetimeSteps:
        safeInteger(
          stats?.journeyLifetimeSteps
        ),

      totalSteps:
        safeInteger(
          stats?.journeyLifetimeSteps
        ),

      journeyLifetimeSteps:
        safeInteger(
          stats?.journeyLifetimeSteps
        ),

      marathonLifetimeSteps:
        safeInteger(
          stats?.marathonLifetimeSteps
        ),

      journeyRewardSteps:
        safeInteger(
          journeyRewardSteps
        ),

      miles:
        safeNumber(
          stats?.miles
        ),

      milesWalked:
        safeNumber(
          stats?.milesWalked
        ),

      calories:
        safeNumber(
          stats?.calories
        ),

      caloriesBurned:
        safeNumber(
          stats?.caloriesBurned
        ),

      dayStreak:
        safeInteger(
          stats?.dayStreak
        ),

      owner:
        owner.owner,

      destination:
        owner.destination,

      marathonActive:
        owner.marathonActive,

      marathonId:
        owner.marathonId,

      router,

      stats,
    };
  } catch (error) {
    console.log(
      "Get step snapshot error:",
      error
    );

    return {
      todaySteps: 0,
      lifetimeSteps: 0,
      totalSteps: 0,
      journeyLifetimeSteps: 0,
      marathonLifetimeSteps: 0,
      journeyRewardSteps: 0,
      miles: 0,
      milesWalked: 0,
      calories: 0,
      caloriesBurned: 0,
      dayStreak: 0,
      owner: null,

      destination:
        STEP_DESTINATIONS.NONE,

      marathonActive: false,
      marathonId: null,
      error,
    };
  }
}

// ============================================================
// COMPATIBILITY EXPORTS
// ============================================================

export const getStepStats =
  loadStepStats;

export const getStepsStats =
  loadStepStats;

export const setStepStats =
  saveStepStats;

export async function addJourneySteps(
  steps
) {
  return addRegularJourneySteps(
    steps
  );
}

// ============================================================
// DEVELOPMENT RESET
// ============================================================

export async function resetStepTrackingEngine({
  preserveJourneyLifetime = true,
} = {}) {
  try {
    const keys = [
      STEP_STATS_KEY,
      STEP_ROUTER_KEY,
      ACTIVE_DESTINATION_KEY,
    ];

    if (!preserveJourneyLifetime) {
      keys.push(
        JOURNEY_REWARD_STEPS_KEY,
        "lifetimeSteps",
        "LifetimeSteps"
      );
    }

    await AsyncStorage.multiRemove(
      keys
    );

    return {
      reset: true,

      preservedJourneyLifetime:
        preserveJourneyLifetime,
    };
  } catch (error) {
    console.log(
      "Reset step engine error:",
      error
    );

    return {
      reset: false,
      error,
    };
  }
}

// ============================================================
// END OF STEP TRACKING ENGINE
// ============================================================