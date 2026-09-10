// ============================================================
// LEGATHON WALK
// stepTrackingEngine.js
//
// MASTER STEP TRACKING / ROUTING ENGINE
//
// IMPORTANT RULES:
//
// 1. Physical phone steps are counted ONE TIME.
// 2. If a JOURNEY is active:
//      → Journey receives the steps.
//      → Journey lifetime reward steps increase.
//      → Tracksuit reward progress can increase.
//
// 3. If a MARATHON is active:
//      → Marathon receives the steps.
//      → Journey receives NOTHING.
//      → Tracksuit reward progress receives NOTHING.
//
// 4. Journey and Marathon NEVER receive the same physical steps.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";


// ============================================================
// STORAGE KEYS
// ============================================================

export const STEP_STATS_KEY = "@legathon_step_stats";

export const STEP_ROUTER_KEY = "@legathon_step_router";

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

function safeInteger(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, Math.floor(number));
}


function safeNumber(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, number);
}


function nowISO() {
  return new Date().toISOString();
}


function getDateKey(date = new Date()) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ============================================================
// DEFAULT STEP STATS
// ============================================================

const createDefaultStepStats = () => ({
  dateKey: getDateKey(),

  todaySteps: 0,

  // ----------------------------------------------------------
  // This is JOURNEY lifetime reward progress.
  //
  // Marathon steps DO NOT increase this value.
  //
  // This is the value that can be used for tracksuit rewards.
  // ----------------------------------------------------------

  lifetimeSteps: 0,

  journeyLifetimeSteps: 0,

  // Marathon steps remain completely separate.

  marathonLifetimeSteps: 0,

  calories: 0,

  miles: 0,

  dayStreak: 0,

  lastUpdated: null,
});


// ============================================================
// NORMALIZE STEP STATS
// ============================================================

function normalizeStepStats(stats = {}) {
  const currentDateKey = getDateKey();

  const savedDateKey =
    stats?.dateKey || currentDateKey;

  const isToday =
    savedDateKey === currentDateKey;

  const journeyLifetimeSteps =
    safeInteger(
      stats?.journeyLifetimeSteps ??
        stats?.lifetimeSteps
    );

  const marathonLifetimeSteps =
    safeInteger(
      stats?.marathonLifetimeSteps
    );

  const todaySteps =
    isToday
      ? safeInteger(stats?.todaySteps)
      : 0;

  return {
    dateKey: currentDateKey,

    todaySteps,

    lifetimeSteps:
      journeyLifetimeSteps,

    journeyLifetimeSteps,

    marathonLifetimeSteps,

    calories:
      safeNumber(stats?.calories),

    miles:
      safeNumber(stats?.miles),

    dayStreak:
      safeInteger(stats?.dayStreak),

    lastUpdated:
      stats?.lastUpdated || null,
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
      JSON.parse(saved);

    return normalizeStepStats(parsed);
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
      normalizeStepStats(stats);

    await AsyncStorage.setItem(
      STEP_STATS_KEY,
      JSON.stringify(normalized)
    );

    return {
      saved: true,
      stats: normalized,
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
// GET TODAY STEPS
// ============================================================

export async function getTodaySteps() {
  const stats =
    await loadStepStats();

  return safeInteger(
    stats?.todaySteps
  );
}


// ============================================================
// GET LIFETIME STEPS
//
// IMPORTANT:
// This represents JOURNEY reward lifetime steps.
// Marathon steps are intentionally excluded.
// ============================================================

export async function getLifetimeSteps() {
  const stats =
    await loadStepStats();

  return safeInteger(
    stats?.journeyLifetimeSteps ??
      stats?.lifetimeSteps
  );
}


// ============================================================
// GET JOURNEY REWARD STEPS
//
// Tracksuit reward system should use this.
// ============================================================

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


    // Repair the split storage keys.
    // From now on both old and new screens see the same total.
    await Promise.all([
      AsyncStorage.setItem(
        "lifetimeSteps",
        String(lifetimeSteps)
      ),

      AsyncStorage.setItem(
        "LifetimeSteps",
        String(lifetimeSteps)
      ),
    ]);


    return lifetimeSteps;

  } catch (error) {

    console.log(
      "Get Journey Lifetime Steps error:",
      error
    );

    return 0;
  }
}


// ============================================================
// GET MARATHON LIFETIME STEPS
// ============================================================

export async function getMarathonLifetimeSteps() {
  const stats =
    await loadStepStats();

  return safeInteger(
    stats?.marathonLifetimeSteps
  );
}


// ============================================================
// SYNC TODAY STEPS
//
// Allows Dashboard / other screens to synchronize displayed
// step totals without creating a second pedometer owner.
// ============================================================

export async function syncTodaySteps(
  nextTodaySteps = 0
) {
  try {
    const stats =
      await loadStepStats();

    const normalizedToday =
      safeInteger(nextTodaySteps);

    const updated = {
      ...stats,

      dateKey:
        getDateKey(),

      todaySteps:
        normalizedToday,

      lastUpdated:
        nowISO(),
    };

    await saveStepStats(updated);

    return updated;
  } catch (error) {
    console.log(
      "Sync today steps error:",
      error
    );

    return null;
  }
}


// ============================================================
// TRACKING AVAILABILITY
// ============================================================

export async function isStepTrackingAvailable() {
  try {
    const available =
      await Pedometer.isAvailableAsync();

    return Boolean(available);
  } catch (error) {
    console.log(
      "Pedometer availability error:",
      error
    );

    return false;
  }
}


// ============================================================
// ROUTER STATE
//
// THIS IS NOT JOURNEY OR MARATHON PROGRESS.
//
// It only remembers:
//
// "What physical phone step count was already processed?"
//
// Example:
//
// previous phone count:
// 8,420
//
// current phone count:
// 8,455
//
// NEW physical steps:
// 35
//
// Those 35 are assigned to ONE destination.
// ============================================================

const createDefaultRouterState = () => ({
  dateKey: null,

  lastDeviceSteps: null,

  lastDestination: null,

  lastMarathonId: null,

  lastJourneyId: null,

  lastDelta: 0,

  lastUpdated: null,
});


// ============================================================
// LOAD ROUTER STATE
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
      JSON.parse(saved || "{}");

    return {
      ...createDefaultRouterState(),
      ...parsed,

      lastDeviceSteps:
        parsed?.lastDeviceSteps === null ||
        parsed?.lastDeviceSteps === undefined
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
      "Load router state error:",
      error
    );

    return createDefaultRouterState();
  }
}


// ============================================================
// SAVE ROUTER STATE
// ============================================================

async function saveRouterState(
  routerState
) {
  try {
    await AsyncStorage.setItem(
      STEP_ROUTER_KEY,
      JSON.stringify(routerState)
    );

    return true;
  } catch (error) {
    console.log(
      "Save router state error:",
      error
    );

    return false;
  }
}


// ============================================================
// RESET ROUTER BASELINE
//
// Use when physical pedometer session must establish a new
// baseline without creating fake steps.
// ============================================================

export async function resetStepRouterBaseline() {
  try {
    const state =
      createDefaultRouterState();

    await saveRouterState(state);

    return state;
  } catch (error) {
    console.log(
      "Reset router error:",
      error
    );

    return createDefaultRouterState();
  }
}


// ============================================================
// ACTIVE DESTINATION
// ============================================================

export async function getActiveStepDestination() {
  try {
    const saved =
      await AsyncStorage.getItem(
        ACTIVE_DESTINATION_KEY
      );

    if (
      saved === STEP_DESTINATIONS.JOURNEY ||
      saved === STEP_DESTINATIONS.MARATHON
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
    destination === STEP_DESTINATIONS.JOURNEY
  ) {
    normalized =
      STEP_DESTINATIONS.JOURNEY;
  }

  if (
    destination === STEP_DESTINATIONS.MARATHON
  ) {
    normalized =
      STEP_DESTINATIONS.MARATHON;
  }

  try {
    await AsyncStorage.setItem(
      ACTIVE_DESTINATION_KEY,
      normalized
    );

    return normalized;
  } catch (error) {
    console.log(
      "Set active destination error:",
      error
    );

    return STEP_DESTINATIONS.NONE;
  }
}


// ============================================================
// ACTIVATE JOURNEY TRACKING
//
// Journey becomes the ONLY step destination.
// ============================================================

export async function activateJourneyTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.JOURNEY
  );
}


// ============================================================
// ACTIVATE MARATHON TRACKING
//
// Marathon becomes the ONLY step destination.
// ============================================================

export async function activateMarathonTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.MARATHON
  );
}


// ============================================================
// STOP ROUTING STEPS
// ============================================================

export async function deactivateStepTracking() {
  return setActiveStepDestination(
    STEP_DESTINATIONS.NONE
  );
}


// ============================================================
// ADD JOURNEY STEPS
//
// THIS IS THE ONLY PATH THAT INCREASES:
//
// → journey lifetime steps
// → reward lifetime steps
// → tracksuit progression
//
// Marathon must NEVER call this function.
// ============================================================

export async function addRegularJourneySteps(
  stepDelta = 0
) {
  const delta =
    safeInteger(stepDelta);

  if (delta <= 0) {
    const stats =
      await loadStepStats();

    return {
      added: 0,
      stats,
    };
  }

  try {
    const stats =
      await loadStepStats();

    const previousJourneyLifetime =
      safeInteger(
        stats?.journeyLifetimeSteps ??
          stats?.lifetimeSteps
      );

    const newJourneyLifetime =
      previousJourneyLifetime + delta;

    const newTodaySteps =
      safeInteger(stats?.todaySteps) +
      delta;

    // --------------------------------------------------------
    // 2,000 steps = 1 mile
    // --------------------------------------------------------

    const miles =
      newJourneyLifetime / 2000;

    // --------------------------------------------------------
    // Basic estimated calories.
    //
    // Dashboard can use its own personalized calorie formula
    // if one already exists.
    // --------------------------------------------------------

    const calories =
      newJourneyLifetime * 0.04;

    const updatedStats = {
      ...stats,

      dateKey:
        getDateKey(),

      todaySteps:
        newTodaySteps,

      lifetimeSteps:
        newJourneyLifetime,

      journeyLifetimeSteps:
        newJourneyLifetime,

      miles,

      calories,

      lastUpdated:
        nowISO(),
    };

    await saveStepStats(
      updatedStats
    );

    // --------------------------------------------------------
    // Dedicated reward counter.
    //
    // Tracksuit system reads this value.
    // --------------------------------------------------------

    await AsyncStorage.setItem(
      JOURNEY_REWARD_STEPS_KEY,
      String(newJourneyLifetime)
    );

    return {
      added: delta,

      todaySteps:
        newTodaySteps,

      lifetimeSteps:
        newJourneyLifetime,

      journeyLifetimeSteps:
        newJourneyLifetime,

      rewardSteps:
        newJourneyLifetime,

      stats:
        updatedStats,
    };
  } catch (error) {
    console.log(
      "Add regular journey steps error:",
      error
    );

    return {
      added: 0,
      error,
    };
  }
}


// ============================================================
// ADD MARATHON STEPS
//
// IMPORTANT:
//
// Marathon steps are stored separately.
//
// They DO NOT:
//
// → increase journey lifetime reward steps
// → increase tracksuit progress
// → increase JOURNEY progress
//
// ============================================================

export async function addMarathonSteps(
  stepDelta = 0
) {
  const delta =
    safeInteger(stepDelta);

  if (delta <= 0) {
    const stats =
      await loadStepStats();

    return {
      added: 0,
      stats,
    };
  }

  try {
    const stats =
      await loadStepStats();

    const previousMarathonLifetime =
      safeInteger(
        stats?.marathonLifetimeSteps
      );

    const newMarathonLifetime =
      previousMarathonLifetime + delta;

    // Today steps still represent physical walking today.
    //
    // Therefore marathon walking CAN increase Today Steps.
    //
    // It does NOT increase journey reward lifetime steps.

    const newTodaySteps =
      safeInteger(stats?.todaySteps) +
      delta;

    const updatedStats = {
      ...stats,

      dateKey:
        getDateKey(),

      todaySteps:
        newTodaySteps,

      marathonLifetimeSteps:
        newMarathonLifetime,

      lastUpdated:
        nowISO(),
    };

    await saveStepStats(
      updatedStats
    );

    return {
      added: delta,

      todaySteps:
        newTodaySteps,

      marathonLifetimeSteps:
        newMarathonLifetime,

      journeyLifetimeSteps:
        safeInteger(
          updatedStats?.journeyLifetimeSteps
        ),

      stats:
        updatedStats,
    };
  } catch (error) {
    console.log(
      "Add marathon steps error:",
      error
    );

    return {
      added: 0,
      error,
    };
  }
}


// ============================================================
// CALCULATE NEW PHYSICAL STEP DELTA
//
// This prevents the same phone steps from being counted twice.
// ============================================================

async function calculatePhysicalStepDelta(
  deviceSteps
) {
  const currentDeviceSteps =
    safeInteger(deviceSteps);

  const today =
    getDateKey();

  const router =
    await loadRouterState();

  // ----------------------------------------------------------
  // New day:
  // establish baseline.
  // Do NOT count the entire phone total as new steps.
  // ----------------------------------------------------------

  if (router.dateKey !== today) {
    const nextRouter = {
      ...createDefaultRouterState(),

      dateKey:
        today,

      lastDeviceSteps:
        currentDeviceSteps,

      lastDelta:
        0,

      lastUpdated:
        nowISO(),
    };

    await saveRouterState(
      nextRouter
    );

    return {
      delta: 0,
      router: nextRouter,
      baselineEstablished: true,
    };
  }

  // ----------------------------------------------------------
  // First reading:
  // establish baseline.
  // ----------------------------------------------------------

  if (
    router.lastDeviceSteps === null ||
    router.lastDeviceSteps === undefined
  ) {
    const nextRouter = {
      ...router,

      dateKey:
        today,

      lastDeviceSteps:
        currentDeviceSteps,

      lastDelta:
        0,

      lastUpdated:
        nowISO(),
    };

    await saveRouterState(
      nextRouter
    );

    return {
      delta: 0,
      router: nextRouter,
      baselineEstablished: true,
    };
  }

  const previousDeviceSteps =
    safeInteger(
      router.lastDeviceSteps
    );

  let delta =
    currentDeviceSteps -
    previousDeviceSteps;

  // ----------------------------------------------------------
  // Device counter restarted/reset.
  //
  // Do NOT create negative progress.
  // Establish new baseline.
  // ----------------------------------------------------------

  if (delta < 0) {
    delta = 0;
  }

  const nextRouter = {
    ...router,

    dateKey:
      today,

    lastDeviceSteps:
      currentDeviceSteps,

    lastDelta:
      delta,

    lastUpdated:
      nowISO(),
  };

  await saveRouterState(
    nextRouter
  );

  return {
    delta,
    router: nextRouter,
    baselineEstablished: false,
  };
}


// ============================================================
// ROUTE PHYSICAL STEPS
//
// CENTRAL ROUTER.
//
// A physical step can have ONE owner:
//
// JOURNEY
// OR
// MARATHON
// OR
// NONE
//
// NEVER JOURNEY + MARATHON.
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
      (await getActiveStepDestination());

    const physical =
      await calculatePhysicalStepDelta(
        deviceSteps
      );

    const delta =
      safeInteger(
        physical?.delta
      );

    // --------------------------------------------------------
    // No new physical steps.
    // --------------------------------------------------------

    if (delta <= 0) {
      return {
        routed: false,

        destination:
          activeDestination,

        delta: 0,

        baselineEstablished:
          Boolean(
            physical?.baselineEstablished
          ),
      };
    }

    // --------------------------------------------------------
    // JOURNEY OWNS THESE STEPS
    // --------------------------------------------------------

    if (
      activeDestination ===
      STEP_DESTINATIONS.JOURNEY
    ) {
      const result =
        await addRegularJourneySteps(
          delta
        );

      const router =
        await loadRouterState();

      await saveRouterState({
        ...router,

        lastDestination:
          STEP_DESTINATIONS.JOURNEY,

        lastJourneyId:
          journeyId || null,

        lastMarathonId:
          null,

        lastDelta:
          delta,

        lastUpdated:
          nowISO(),
      });

      return {
        routed: true,

        destination:
          STEP_DESTINATIONS.JOURNEY,

        delta,

        journeyId,

        result,
      };
    }

    // --------------------------------------------------------
    // MARATHON OWNS THESE STEPS
    // --------------------------------------------------------

    if (
      activeDestination ===
      STEP_DESTINATIONS.MARATHON
    ) {
      const result =
        await addMarathonSteps(
          delta
        );

      const router =
        await loadRouterState();

      await saveRouterState({
        ...router,

        lastDestination:
          STEP_DESTINATIONS.MARATHON,

        lastJourneyId:
          null,

        lastMarathonId:
          marathonId || null,

        lastDelta:
          delta,

        lastUpdated:
          nowISO(),
      });

      return {
        routed: true,

        destination:
          STEP_DESTINATIONS.MARATHON,

        delta,

        marathonId,

        result,
      };
    }

    // --------------------------------------------------------
    // NO ACTIVE JOURNEY OR MARATHON
    //
    // Physical reading is acknowledged so it cannot later be
    // incorrectly assigned to a journey or marathon.
    // --------------------------------------------------------

    const router =
      await loadRouterState();

    await saveRouterState({
      ...router,

      lastDestination:
        STEP_DESTINATIONS.NONE,

      lastJourneyId:
        null,

      lastMarathonId:
        null,

      lastDelta:
        delta,

      lastUpdated:
        nowISO(),
    });

    return {
      routed: false,

      destination:
        STEP_DESTINATIONS.NONE,

      delta,

      reason:
        "No active step destination.",
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
// STEP TRACKING SNAPSHOT
//
// Useful for Dashboard / debugging.
// ============================================================

export async function getStepTrackingSnapshot() {
  try {
    const [
      stats,
      router,
      destination,
      rewardSteps,
    ] = await Promise.all([
      loadStepStats(),

      loadRouterState(),

      getActiveStepDestination(),

      getJourneyRewardSteps(),
    ]);

    return {
      destination,

      todaySteps:
        safeInteger(
          stats?.todaySteps
        ),

      lifetimeSteps:
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
          rewardSteps
        ),

      miles:
        safeNumber(
          stats?.miles
        ),

      calories:
        safeNumber(
          stats?.calories
        ),

      dayStreak:
        safeInteger(
          stats?.dayStreak
        ),

      router,
    };
  } catch (error) {
    console.log(
      "Get tracking snapshot error:",
      error
    );

    return {
      destination:
        STEP_DESTINATIONS.NONE,

      todaySteps: 0,

      lifetimeSteps: 0,

      journeyLifetimeSteps: 0,

      marathonLifetimeSteps: 0,

      journeyRewardSteps: 0,

      miles: 0,

      calories: 0,

      dayStreak: 0,

      error,
    };
  }
}


// ============================================================
// LEGACY / EXISTING APP COMPATIBILITY EXPORTS
//
// These aliases help prevent older screens from breaking while
// we connect the upgraded engine.
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
// END
// ============================================================