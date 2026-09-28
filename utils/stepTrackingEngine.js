// ============================================================
// LEGATHON WALK
// utils/stepTrackingEngine.js
//
// MASTER PHYSICAL STEP ROUTER
//
// RULES
// 1. A physical step can have only one owner at a time:
//      JOURNEY or MARATHON.
// 2. Marathon steps never increase Journey lifetime steps.
// 3. Journey lifetime steps are the tracksuit/reward lifetime.
// 4. Today steps can include both Journey and Marathon walking.
// 5. Direct live-screen credits are reconciled against the next
//    cumulative phone reading so the same physical step is not
//    counted twice.
// 6. Global sync calls are serialized to prevent overlapping
//    timers/screens from crediting the same delta twice.
// 7. When location permission already exists, a lightweight
//    vehicle-speed filter rejects high-speed movement and moves
//    the phone baseline forward so rejected steps cannot leak in
//    later.
// ============================================================

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  Pedometer,
} from "expo-sensors";

import * as Location from
  "expo-location";

import {
  supabase,
} from "../lib/supabase";

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

export const MOVEMENT_FILTER_KEY =
  "@legathon_movement_filter";


// Legacy compatibility keys.

const LEGACY_LIFETIME_KEY =
  "lifetimeSteps";

const LEGACY_LIFETIME_KEY_UPPER =
  "LifetimeSteps";


// ============================================================
// CONSTANTS
// ============================================================

export const STEPS_PER_MILE =
  2000;

const CALORIES_PER_STEP =
  0.04;


const COMMUNITY_CHALLENGE_RPC =
  "credit_my_community_challenges";


const COMMUNITY_RPC_MAX_STEPS =
  500;


// Vehicle filter thresholds in meters/second.
//
// 2.5 m/s ≈ 5.6 mph
// 4.0 m/s ≈ 8.9 mph

const MAX_WALKING_SPEED_MPS =
  2.5;

const DRIVING_SPEED_MPS =
  4.0;

const VEHICLE_RELEASE_MS =
  20000;

const LOCATION_MAX_AGE_MS =
  12000;

const LOCATION_MAX_ACCURACY_METERS =
  50;


// ============================================================
// DESTINATIONS
// ============================================================

export const STEP_DESTINATIONS = {

  NONE:
    "none",

  JOURNEY:
    "journey",

  MARATHON:
    "marathon",

};


// ============================================================
// MODULE QUEUE
//
// Multiple screens can call syncTodaySteps().
//
// App.js also runs its global timer.
//
// This queue makes those calls execute ONE AT A TIME.
// ============================================================

let syncQueue =
  Promise.resolve();


function enqueueSync(
  operation
) {

  const next =
    syncQueue.then(
      operation,
      operation
    );


  syncQueue =
    next.catch(
      () => {}
    );


  return next;
}


// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(
      value
    );


  if (
    !Number.isFinite(
      number
    )
  ) {

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

  return new Date()
    .toISOString();
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


  return (
    `${year}-${month}-${day}`
  );
}


function parseJSON(
  value,
  fallback
) {

  if (
    !value
  ) {

    return fallback;
  }


  try {

    return JSON.parse(
      value
    );

  } catch (
    error
  ) {

    console.log(
      "Step engine JSON error:",
      error
    );


    return fallback;
  }
}


function normalizeDestination(
  destination
) {

  if (
    destination ===
    STEP_DESTINATIONS.JOURNEY
  ) {

    return (
      STEP_DESTINATIONS.JOURNEY
    );
  }


  if (
    destination ===
    STEP_DESTINATIONS.MARATHON
  ) {

    return (
      STEP_DESTINATIONS.MARATHON
    );
  }


  return (
    STEP_DESTINATIONS.NONE
  );
}


// ============================================================
// DISTANCE HELPER FOR VEHICLE FILTER
// ============================================================

function haversineDistanceMeters(
  first,
  second
) {

  if (
    !first ||
    !second
  ) {

    return 0;
  }


  const radians =
    Math.PI /
    180;


  const lat1 =
    safeNumber(
      first.latitude
    ) *
    radians;


  const lat2 =
    safeNumber(
      second.latitude
    ) *
    radians;


  const latitudeDifference =
    (
      safeNumber(
        second.latitude
      ) -
      safeNumber(
        first.latitude
      )
    ) *
    radians;


  const longitudeDifference =
    (
      safeNumber(
        second.longitude
      ) -
      safeNumber(
        first.longitude
      )
    ) *
    radians;


  const a =

    Math.sin(
      latitudeDifference /
      2
    ) ** 2 +

    Math.cos(
      lat1
    ) *

    Math.cos(
      lat2
    ) *

    Math.sin(
      longitudeDifference /
      2
    ) ** 2;


  return (

    6371000 *

    2 *

    Math.asin(
      Math.sqrt(
        Math.min(
          1,
          a
        )
      )
    )
  );
}


// ============================================================
// DISTANCE AND CALORIES
// ============================================================

export function stepsToMiles(
  steps
) {

  return Number(
    (
      safeInteger(
        steps
      ) /
      STEPS_PER_MILE
    ).toFixed(
      2
    )
  );
}


export function stepsToCalories(
  steps
) {

  return Math.round(
    safeInteger(
      steps
    ) *
    CALORIES_PER_STEP
  );
}


// ============================================================
// DEFAULT STEP STATS
// ============================================================

function createDefaultStepStats() {

  return {

    dateKey:
      getDateKey(),


    todaySteps:
      0,


    // --------------------------------------------------------
    // Journey lifetime.
    //
    // This controls:
    // • Journey lifetime
    // • reward lifetime
    // • tracksuit progression
    //
    // Marathon steps do NOT increase it.
    // --------------------------------------------------------

    lifetimeSteps:
      0,

    totalSteps:
      0,

    journeyLifetimeSteps:
      0,


    // --------------------------------------------------------
    // Separate Marathon lifetime.
    // --------------------------------------------------------

    marathonLifetimeSteps:
      0,


    liveSessionSteps:
      0,


    miles:
      0,

    milesWalked:
      0,


    calories:
      0,

    caloriesBurned:
      0,


    dayStreak:
      0,


    lastUpdated:
      null,

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
    savedDate ===
    today;


  const journeyLifetimeSteps =
    safeInteger(

      stats
        ?.journeyLifetimeSteps ??

      stats
        ?.lifetimeSteps ??

      stats
        ?.totalSteps
    );


  const marathonLifetimeSteps =
    safeInteger(
      stats
        ?.marathonLifetimeSteps
    );


  const todaySteps =

    sameDay

      ? safeInteger(
          stats
            ?.todaySteps
        )

      : 0;


  const liveSessionSteps =

    sameDay

      ? safeInteger(
          stats
            ?.liveSessionSteps
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


    liveSessionSteps,


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
        stats
          ?.dayStreak
      ),


    lastUpdated:
      stats
        ?.lastUpdated ||
      null,

  };
}


// ============================================================
// ONE-TIME LEGACY LIFETIME MIGRATION
//
// Older builds used several Lifetime keys.
//
// We only consult them when the canonical STEP_STATS_KEY does
// not yet exist.
//
// After that, STEP_STATS_KEY is the single source of truth.
// ============================================================

async function createMigratedDefaultStats() {

  try {

    const [
      lower,
      upper,
      reward,
    ] =
      await Promise.all([

        AsyncStorage.getItem(
          LEGACY_LIFETIME_KEY
        ),

        AsyncStorage.getItem(
          LEGACY_LIFETIME_KEY_UPPER
        ),

        AsyncStorage.getItem(
          JOURNEY_REWARD_STEPS_KEY
        ),

      ]);


    const migratedLifetime =
      Math.max(

        safeInteger(
          lower
        ),

        safeInteger(
          upper
        ),

        safeInteger(
          reward
        )
      );


    return normalizeStepStats({

      ...createDefaultStepStats(),


      lifetimeSteps:
        migratedLifetime,


      totalSteps:
        migratedLifetime,


      journeyLifetimeSteps:
        migratedLifetime,


      lastUpdated:
        nowISO(),

    });

  } catch (
    error
  ) {

    console.log(
      "Step migration error:",
      error
    );


    return (
      createDefaultStepStats()
    );
  }
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


    // --------------------------------------------------------
    // First use of canonical engine.
    // --------------------------------------------------------

    if (
      !saved
    ) {

      const migrated =
        await createMigratedDefaultStats();


      await AsyncStorage.setItem(
        STEP_STATS_KEY,

        JSON.stringify(
          migrated
        )
      );


      return migrated;
    }


    const parsed =
      parseJSON(
        saved,
        {}
      );


    const normalized =
      normalizeStepStats(
        parsed
      );


    // --------------------------------------------------------
    // Midnight reset.
    //
    // Today becomes zero.
    // Lifetime remains untouched.
    // --------------------------------------------------------

    if (
      parsed?.dateKey !==
      normalized.dateKey
    ) {

      await AsyncStorage.setItem(
        STEP_STATS_KEY,

        JSON.stringify(
          normalized
        )
      );
    }


    return normalized;

  } catch (
    error
  ) {

    console.log(
      "Load step stats error:",
      error
    );


    return (
      createDefaultStepStats()
    );
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
          stats
            ?.lastUpdated ||
          nowISO(),

      });


    await AsyncStorage.setItem(
      STEP_STATS_KEY,

      JSON.stringify(
        normalized
      )
    );


    return {

      saved:
        true,

      stats:
        normalized,

    };

  } catch (
    error
  ) {

    console.log(
      "Save step stats error:",
      error
    );


    return {

      saved:
        false,

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
      await Pedometer
        .isAvailableAsync();


    return Boolean(
      available
    );

  } catch (
    error
  ) {

    console.log(
      "Pedometer availability error:",
      error
    );


    return false;
  }
}


// ============================================================
// PHYSICAL DEVICE STEPS TODAY
//
// This is Apple's / device's cumulative step counter since
// local midnight.
//
// It is NOT automatically credited.
//
// The router compares it to the previous device reading.
// ============================================================

export async function getTodaySteps() {

  try {

    const available =
      await isStepTrackingAvailable();


    if (
      !available
    ) {

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
      await Pedometer
        .getStepCountAsync(
          start,
          end
        );


    return safeInteger(
      result
        ?.steps
    );

  } catch (
    error
  ) {

    console.log(
      "Get physical steps error:",
      error
    );


    return 0;
  }
}


// ============================================================
// APP-CREDITED TODAY STEPS
// ============================================================

export async function getCreditedTodaySteps() {

  const stats =
    await loadStepStats();


  return safeInteger(
    stats
      ?.todaySteps
  );
}


// ============================================================
// JOURNEY LIFETIME
// ============================================================

export async function getLifetimeSteps() {

  const stats =
    await loadStepStats();


  return safeInteger(

    stats
      ?.journeyLifetimeSteps ??

    stats
      ?.lifetimeSteps

  );
}


// ============================================================
// JOURNEY LIFETIME / TRACKSUIT STEPS
// ============================================================

export async function getJourneyLifetimeSteps() {

  try {

    // --------------------------------------------------------
    // Canonical stats are now the source of truth.
    //
    // We do NOT take Math.max() against old legacy keys on
    // every read anymore.
    //
    // That old behavior could resurrect steps after a reset.
    // --------------------------------------------------------

    const stats =
      await loadStepStats();


    const lifetimeSteps =
      safeInteger(

        stats
          ?.journeyLifetimeSteps ??

        stats
          ?.lifetimeSteps

      );


    // --------------------------------------------------------
    // Mirror canonical value to older screens.
    // --------------------------------------------------------

    await Promise.all([

      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY,

        String(
          lifetimeSteps
        )
      ),


      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY_UPPER,

        String(
          lifetimeSteps
        )
      ),


      AsyncStorage.setItem(
        JOURNEY_REWARD_STEPS_KEY,

        String(
          lifetimeSteps
        )
      ),

    ]);


    return lifetimeSteps;

  } catch (
    error
  ) {

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

  return (
    getJourneyLifetimeSteps()
  );
}


// ============================================================
// MARATHON LIFETIME
// ============================================================

export async function getMarathonLifetimeSteps() {

  const stats =
    await loadStepStats();


  return safeInteger(
    stats
      ?.marathonLifetimeSteps
  );
}


// ============================================================
// ROUTER STATE
// ============================================================

function createDefaultRouterState() {

  return {

    dateKey:
      null,


    lastDeviceSteps:
      null,


    lastDestination:
      null,


    lastMarathonId:
      null,


    lastJourneyId:
      null,


    lastDelta:
      0,


    // --------------------------------------------------------
    // Foreground screens such as GPSJourneyMap can save a step
    // immediately.
    //
    // The cumulative global phone counter will eventually also
    // contain that same physical step.
    //
    // These counters let us subtract those already-credited
    // foreground steps from the next cumulative sync.
    // --------------------------------------------------------

    pendingManualJourneySteps:
      0,


    pendingManualMarathonSteps:
      0,


    lastRejectedDeviceDelta:
      0,


    lastRejectedReason:
      null,


    lastUpdated:
      null,

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


    if (
      !saved
    ) {

      return (
        createDefaultRouterState()
      );
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

        parsed
          ?.lastDeviceSteps ===
            null ||

        parsed
          ?.lastDeviceSteps ===
            undefined

          ? null

          : safeInteger(
              parsed
                .lastDeviceSteps
            ),


      lastDelta:
        safeInteger(
          parsed
            ?.lastDelta
        ),


      pendingManualJourneySteps:
        safeInteger(
          parsed
            ?.pendingManualJourneySteps
        ),


      pendingManualMarathonSteps:
        safeInteger(
          parsed
            ?.pendingManualMarathonSteps
        ),


      lastRejectedDeviceDelta:
        safeInteger(
          parsed
            ?.lastRejectedDeviceDelta
        ),

    };

  } catch (
    error
  ) {

    console.log(
      "Load step router error:",
      error
    );


    return (
      createDefaultRouterState()
    );
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


      lastDeviceSteps:

        routerState
          ?.lastDeviceSteps ===
            null ||

        routerState
          ?.lastDeviceSteps ===
            undefined

          ? null

          : safeInteger(
              routerState
                .lastDeviceSteps
            ),


      lastDelta:
        safeInteger(
          routerState
            ?.lastDelta
        ),


      pendingManualJourneySteps:
        safeInteger(
          routerState
            ?.pendingManualJourneySteps
        ),


      pendingManualMarathonSteps:
        safeInteger(
          routerState
            ?.pendingManualMarathonSteps
        ),


      lastRejectedDeviceDelta:
        safeInteger(
          routerState
            ?.lastRejectedDeviceDelta
        ),


      lastUpdated:
        routerState
          ?.lastUpdated ||
        nowISO(),

    };


    await AsyncStorage.setItem(
      STEP_ROUTER_KEY,

      JSON.stringify(
        normalized
      )
    );


    return {

      saved:
        true,

      state:
        normalized,

    };

  } catch (
    error
  ) {

    console.log(
      "Save step router error:",
      error
    );


    return {

      saved:
        false,

      error,

    };
  }
}


// ============================================================
// RESET PHYSICAL BASELINE
//
// Used whenever ownership changes.
//
// Journey → Marathon
// Marathon → Journey
//
// Old physical steps cannot leak into the new activity.
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
        result
          ?.saved ===
        true,


      state:
        result
          ?.state ||
        state,

    };

  } catch (
    error
  ) {

    console.log(
      "Reset router baseline error:",
      error
    );


    return {

      reset:
        false,

      error,

    };
  }
}


// ============================================================
// RECORD DIRECT / FOREGROUND STEP CREDIT
//
// Prevents GPSJourneyMap + global App sync from both crediting
// the same physical steps.
// ============================================================

async function recordManualCredit(
  destination,
  amount
) {

  const delta =
    safeInteger(
      amount
    );


  if (
    delta <=
    0
  ) {

    return;
  }


  try {

    const router =
      await loadRouterState();


    const next = {

      ...router,

    };


    if (
      destination ===
      STEP_DESTINATIONS.JOURNEY
    ) {

      next.pendingManualJourneySteps =

        safeInteger(
          router
            .pendingManualJourneySteps
        ) +

        delta;
    }


    if (
      destination ===
      STEP_DESTINATIONS.MARATHON
    ) {

      next.pendingManualMarathonSteps =

        safeInteger(
          router
            .pendingManualMarathonSteps
        ) +

        delta;
    }


    next.lastUpdated =
      nowISO();


    await saveRouterState(
      next
    );

  } catch (
    error
  ) {

    console.log(
      "Manual step reconciliation error:",
      error
    );
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


    return normalizeDestination(
      saved
    );

  } catch (
    error
  ) {

    console.log(
      "Get active destination error:",
      error
    );


    return (
      STEP_DESTINATIONS.NONE
    );
  }
}


// ============================================================
// SET ACTIVE DESTINATION
// ============================================================

export async function setActiveStepDestination(
  destination
) {

  const normalized =
    normalizeDestination(
      destination
    );


  try {

    await AsyncStorage.setItem(
      ACTIVE_DESTINATION_KEY,
      normalized
    );


    return {

      saved:
        true,


      destination:
        normalized,

    };

  } catch (
    error
  ) {

    console.log(
      "Set active destination error:",
      error
    );


    return {

      saved:
        false,


      destination:
        STEP_DESTINATIONS.NONE,


      error,

    };
  }
}


// ============================================================
// SAFE ACTIVITY SWITCH
// ============================================================

async function activateDestinationSafely(
  destination
) {

  try {

    const current =
      await getActiveStepDestination();


    if (
      current !==
      destination
    ) {

      // ------------------------------------------------------
      // Ownership boundary.
      //
      // Start the new mode with a clean cumulative baseline.
      // ------------------------------------------------------

      await resetStepRouterBaseline();
    }


    return (
      setActiveStepDestination(
        destination
      )
    );

  } catch (
    error
  ) {

    console.log(
      "Activate destination error:",
      error
    );


    return {

      saved:
        false,


      destination:
        STEP_DESTINATIONS.NONE,


      error,

    };
  }
}


// ============================================================
// ACTIVATE JOURNEY
// ============================================================

export async function activateJourneyTracking() {

  return activateDestinationSafely(
    STEP_DESTINATIONS.JOURNEY
  );
}


// ============================================================
// ACTIVATE MARATHON
// ============================================================

export async function activateMarathonTracking() {

  return activateDestinationSafely(
    STEP_DESTINATIONS.MARATHON
  );
}


// ============================================================
// DEACTIVATE ROUTING
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

      activeMarathon
        ?.marathonId ??

      activeMarathon
        ?.id ??

      activeMarathon
        ?.marathon
        ?.id ??

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

  } catch (
    error
  ) {

    console.log(
      "Get current step owner error:",
      error
    );


    return {

      owner:
        null,


      destination:
        STEP_DESTINATIONS.NONE,


      marathonActive:
        false,


      legathonActive:
        false,


      journeyActive:
        false,


      marathonId:
        null,


      error,

    };
  }
}


// ============================================================
// COMMUNITY CHALLENGE STEP CREDIT
//
// Server RPC currently accepts max 500 steps per request.
//
// This is intentionally BEST EFFORT.
//
// A failed request is not automatically retried because an
// uncertain network response could otherwise duplicate credit.
// ============================================================

async function creditCommunityChallengeStepsBestEffort(
  stepDelta
) {

  const total =
    safeInteger(
      stepDelta
    );


  if (
    total <=
    0
  ) {

    return {

      credited:
        0,


      skipped:
        true,


      reason:
        "zero-delta",

    };
  }


  try {

    const {
      data:
        sessionData,
    } =
      await supabase
        .auth
        .getSession();


    if (
      !sessionData
        ?.session
        ?.user
    ) {

      return {

        credited:
          0,


        skipped:
          true,


        reason:
          "not-authenticated",

      };
    }


    let remaining =
      total;


    let credited =
      0;


    while (
      remaining >
      0
    ) {

      const chunk =
        Math.min(

          remaining,

          COMMUNITY_RPC_MAX_STEPS
        );


      const {
        error,
      } =
        await supabase.rpc(

          COMMUNITY_CHALLENGE_RPC,

          {

            p_steps:
              chunk,

          }
        );


      if (
        error
      ) {

        console.log(
          "Community challenge step credit skipped:",
          error
        );


        return {

          credited,


          skipped:
            credited ===
            0,


          partial:
            credited >
            0,


          error,

        };
      }


      credited +=
        chunk;


      remaining -=
        chunk;
    }


    return {

      credited,


      skipped:
        false,

    };

  } catch (
    error
  ) {

    console.log(
      "Community challenge credit error:",
      error
    );


    return {

      credited:
        0,


      skipped:
        true,


      error,

    };
  }
}


// ============================================================
// ADD JOURNEY STEPS
//
// options.source:
//
// "router"
//   = delta came from cumulative global device routing.
//
// anything else
//   = a foreground screen directly saved verified steps.
//
// Direct foreground credits create a reconciliation debt so the
// next cumulative sync does not count them again.
// ============================================================

export async function addRegularJourneySteps(
  stepDelta = 0,
  options = {}
) {

  const delta =
    safeInteger(
      stepDelta
    );


  const source =
    options
      ?.source ||
    "manual";


  const creditCommunity =
    options
      ?.creditCommunity !==
    false;


  if (
    delta <=
    0
  ) {

    return {

      saved:
        true,


      added:
        0,


      reason:
        "zero-delta",


      stats:
        await loadStepStats(),

    };
  }


  try {

    const destination =
      await getActiveStepDestination();


    // --------------------------------------------------------
    // Journey can only receive steps while Journey owns them.
    // --------------------------------------------------------

    if (
      destination !==
      STEP_DESTINATIONS.JOURNEY
    ) {

      return {

        saved:
          true,


        added:
          0,


        blocked:
          true,


        reason:

          destination ===
          STEP_DESTINATIONS.MARATHON

            ? "marathon-owns-steps"

            : "journey-not-active",

      };
    }


    const stats =
      await loadStepStats();


    const previousLifetime =
      safeInteger(

        stats
          ?.journeyLifetimeSteps ??

        stats
          ?.lifetimeSteps
      );


    const lifetimeSteps =

      previousLifetime +

      delta;


    const todaySteps =

      safeInteger(
        stats
          ?.todaySteps
      ) +

      delta;


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
          stats
            ?.liveSessionSteps
        ) +

        delta,


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


    if (
      !savedResult
        ?.saved
    ) {

      return {

        saved:
          false,


        added:
          0,


        error:
          savedResult
            ?.error,

      };
    }


    // --------------------------------------------------------
    // Keep old screens synchronized with canonical Lifetime.
    // --------------------------------------------------------

    await Promise.all([

      AsyncStorage.setItem(
        JOURNEY_REWARD_STEPS_KEY,

        String(
          lifetimeSteps
        )
      ),


      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY,

        String(
          lifetimeSteps
        )
      ),


      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY_UPPER,

        String(
          lifetimeSteps
        )
      ),

    ]);


    // --------------------------------------------------------
    // Foreground / GPS direct step credit.
    //
    // Remember these so global cumulative sync does not count
    // them again.
    // --------------------------------------------------------

    if (
      source !==
      "router"
    ) {

      await recordManualCredit(

        STEP_DESTINATIONS.JOURNEY,

        delta
      );


      if (
        creditCommunity
      ) {

        await creditCommunityChallengeStepsBestEffort(
          delta
        );
      }
    }


    return {

      saved:
        true,


      added:
        delta,


      todaySteps,


      lifetimeSteps,


      journeyLifetimeSteps:
        lifetimeSteps,


      rewardSteps:
        lifetimeSteps,


      stats:
        savedResult
          .stats,

    };

  } catch (
    error
  ) {

    console.log(
      "Add Journey steps error:",
      error
    );


    return {

      saved:
        false,


      added:
        0,


      error,

    };
  }
}


// ============================================================
// ADD MARATHON STEPS
//
// Marathon steps:
// • update active Marathon
// • update Marathon lifetime
// • increase Today
//
// They DO NOT increase Journey lifetime.
// ============================================================

export async function addMarathonSteps(
  stepDelta = 0,
  options = {}
) {

  const delta =
    safeInteger(
      stepDelta
    );


  const source =
    options
      ?.source ||
    "manual";


  const creditCommunity =
    options
      ?.creditCommunity !==
    false;


  if (
    delta <=
    0
  ) {

    return {

      saved:
        true,


      added:
        0,


      overflow:
        0,


      completedNow:
        false,


      reason:
        "zero-delta",

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

        saved:
          false,


        added:
          0,


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


    if (
      !marathonResult
        ?.saved
    ) {

      return {

        ...marathonResult,


        saved:
          false,


        added:
          0,

      };
    }


    // --------------------------------------------------------
    // Marathon may cap the amount at completion.
    // --------------------------------------------------------

    const creditedSteps =
      safeInteger(
        marathonResult
          ?.added
      );


    const stats =
      await loadStepStats();


    const marathonLifetimeSteps =

      safeInteger(
        stats
          ?.marathonLifetimeSteps
      ) +

      creditedSteps;


    const todaySteps =

      safeInteger(
        stats
          ?.todaySteps
      ) +

      creditedSteps;


    const updated = {

      ...stats,


      dateKey:
        getDateKey(),


      todaySteps,


      marathonLifetimeSteps,


      liveSessionSteps:

        safeInteger(
          stats
            ?.liveSessionSteps
        ) +

        creditedSteps,


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


    if (
      !statsResult
        ?.saved
    ) {

      return {

        ...marathonResult,


        saved:
          false,


        added:
          0,


        reason:
          "step-stats-save-failed",


        error:
          statsResult
            ?.error,

      };
    }


    if (
      source !==
        "router" &&

      creditedSteps >
        0
    ) {

      await recordManualCredit(

        STEP_DESTINATIONS.MARATHON,

        creditedSteps
      );


      if (
        creditCommunity
      ) {

        await creditCommunityChallengeStepsBestEffort(
          creditedSteps
        );
      }
    }


    return {

      ...marathonResult,


      saved:
        true,


      added:
        creditedSteps,


      todaySteps,


      marathonLifetimeSteps,


      journeyLifetimeSteps:
        safeInteger(
          stats
            ?.journeyLifetimeSteps
        ),


      stats:
        statsResult
          .stats,

    };

  } catch (
    error
  ) {

    console.log(
      "Add Marathon steps error:",
      error
    );


    return {

      saved:
        false,


      added:
        0,


      overflow:
        0,


      completedNow:
        false,


      reason:
        "marathon-step-error",


      error,

    };
  }
}


// ============================================================
// VEHICLE FILTER STATE
// ============================================================

function createDefaultMovementState() {

  return {

    previousFix:
      null,


    blockedUntil:
      0,


    lastSpeedMps:
      null,


    lastReason:
      null,


    lastUpdated:
      null,

  };
}


async function loadMovementState() {

  try {

    const saved =
      await AsyncStorage.getItem(
        MOVEMENT_FILTER_KEY
      );


    if (
      !saved
    ) {

      return (
        createDefaultMovementState()
      );
    }


    return {

      ...createDefaultMovementState(),

      ...parseJSON(
        saved,
        {}
      ),

    };

  } catch (
    error
  ) {

    return (
      createDefaultMovementState()
    );
  }
}


async function saveMovementState(
  state
) {

  try {

    const normalized = {

      ...createDefaultMovementState(),

      ...state,


      lastUpdated:
        nowISO(),

    };


    await AsyncStorage.setItem(
      MOVEMENT_FILTER_KEY,

      JSON.stringify(
        normalized
      )
    );


    return normalized;

  } catch (
    error
  ) {

    return state;
  }
}


// ============================================================
// CHECK MOVEMENT ELIGIBILITY
//
// This is a global best-effort vehicle filter.
//
// It does NOT request permission repeatedly.
//
// If location permission is already granted:
// • high-speed movement is blocked
// • the device baseline still advances
// • rejected steps cannot be credited later
//
// If location is unavailable, this function does not shut down
// the pedometer.
// ============================================================

async function checkMovementEligibility() {

  try {

    const permission =
      await Location
        .getForegroundPermissionsAsync();


    if (
      permission
        ?.status !==
      "granted"
    ) {

      return {

        allowed:
          true,


        verified:
          false,


        reason:
          "location-permission-unavailable",


        speedMps:
          null,

      };
    }


    const fix =
      await Location
        .getCurrentPositionAsync({

          accuracy:
            Location
              .Accuracy
              .High,

        });


    const now =
      Date.now();


    const time =
      Number(
        fix
          ?.timestamp
      );


    const coords =
      fix
        ?.coords;


    const state =
      await loadMovementState();


    // --------------------------------------------------------
    // Reject unreliable location as a vehicle decision.
    //
    // We do not stop all step counting because GPS can be weak
    // indoors.
    // --------------------------------------------------------

    if (
      !coords ||

      !Number.isFinite(
        time
      ) ||

      now - time >
        LOCATION_MAX_AGE_MS ||

      time >
        now + 1000 ||

      !Number.isFinite(
        coords
          .accuracy
      ) ||

      coords
        .accuracy <
        0 ||

      coords
        .accuracy >
        LOCATION_MAX_ACCURACY_METERS ||

      !Number.isFinite(
        coords
          .latitude
      ) ||

      !Number.isFinite(
        coords
          .longitude
      )
    ) {

      return {

        allowed:
          true,


        verified:
          false,


        reason:
          "location-fix-unreliable",


        speedMps:
          null,

      };
    }


    // --------------------------------------------------------
    // Reported speed.
    // --------------------------------------------------------

    const reportedSpeed =

      Number.isFinite(
        coords
          .speed
      ) &&

      coords
        .speed >=
        0

        ? coords
            .speed

        : null;


    // --------------------------------------------------------
    // Derived speed.
    //
    // Used when the GPS speed field is unavailable.
    // --------------------------------------------------------

    let derivedSpeed =
      null;


    const previousFix =
      state
        ?.previousFix;


    if (
      previousFix &&

      Number.isFinite(
        previousFix
          .timestamp
      )
    ) {

      const seconds =

        (
          time -
          previousFix
            .timestamp
        ) /

        1000;


      if (
        seconds >=
          1 &&

        seconds <=
          30
      ) {

        const distance =
          haversineDistanceMeters(

            previousFix
              .coords,

            coords
          );


        // ----------------------------------------------------
        // Subtract location uncertainty.
        //
        // This helps prevent GPS drift from looking like speed.
        // ----------------------------------------------------

        const uncertainty =

          safeNumber(
            previousFix
              ?.coords
              ?.accuracy
          ) +

          safeNumber(
            coords
              .accuracy
          );


        derivedSpeed =

          Math.max(

            0,

            distance -
              uncertainty

          ) /

          seconds;
      }
    }


    const speed =

      reportedSpeed ===
      null

        ? derivedSpeed

        : Math.max(

            reportedSpeed,

            derivedSpeed ??
              0
          );


    let blockedUntil =
      safeInteger(
        state
          ?.blockedUntil
      );


    let reason =
      "walking-speed-ok";


    // --------------------------------------------------------
    // Strong vehicle detection.
    // --------------------------------------------------------

    if (
      speed !==
        null &&

      speed >=
        DRIVING_SPEED_MPS
    ) {

      blockedUntil =

        now +

        VEHICLE_RELEASE_MS;


      reason =
        "vehicle-speed-detected";
    }


    // --------------------------------------------------------
    // Above normal walking speed.
    // --------------------------------------------------------

    else if (
      speed !==
        null &&

      speed >
        MAX_WALKING_SPEED_MPS
    ) {

      blockedUntil =
        Math.max(

          blockedUntil,

          now +
            VEHICLE_RELEASE_MS
        );


      reason =
        "above-walking-speed";
    }


    // --------------------------------------------------------
    // Slow again but still inside release window.
    // --------------------------------------------------------

    else if (
      blockedUntil >
      now
    ) {

      reason =
        "vehicle-release-window";
    }


    // --------------------------------------------------------
    // Released.
    // --------------------------------------------------------

    else {

      blockedUntil =
        0;
    }


    await saveMovementState({

      previousFix: {

        timestamp:
          time,


        coords: {

          latitude:
            coords
              .latitude,


          longitude:
            coords
              .longitude,


          accuracy:
            coords
              .accuracy,

        },
      },


      blockedUntil,


      lastSpeedMps:
        speed,


      lastReason:
        reason,

    });


    return {

      allowed:
        blockedUntil <=
        now,


      verified:
        speed !==
        null,


      reason,


      speedMps:
        speed,


      blockedUntil,

    };

  } catch (
    error
  ) {

    console.log(
      "Movement filter unavailable:",
      error
    );


    // --------------------------------------------------------
    // GPS problems should not silently disable the entire
    // pedometer.
    // --------------------------------------------------------

    return {

      allowed:
        true,


      verified:
        false,


      reason:
        "movement-filter-error",


      speedMps:
        null,


      error,

    };
  }
}


// ============================================================
// CALCULATE PHYSICAL STEP DELTA
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


  // ==========================================================
  // FIRST-EVER READING
  //
  // Establish baseline only.
  //
  // This prevents installing/opening the new engine from
  // suddenly importing earlier phone steps.
  // ==========================================================

  if (
    router
      .dateKey ===
      null ||

    router
      .dateKey ===
      undefined
  ) {

    const nextRouter = {

      ...createDefaultRouterState(),


      dateKey:
        today,


      lastDeviceSteps:
        currentDeviceSteps,


      lastUpdated:
        nowISO(),

    };


    await saveRouterState(
      nextRouter
    );


    return {

      delta:
        0,


      router:
        nextRouter,


      baselineEstablished:
        true,


      firstReading:
        true,

    };
  }


  // ==========================================================
  // NEW DAY
  //
  // Device count is already today's step count.
  //
  // Router was established on a previous day, so today's phone
  // count can be treated as the new day's first physical delta.
  // ==========================================================

  if (
    router
      .dateKey !==
    today
  ) {

    const nextRouter = {

      ...createDefaultRouterState(),


      dateKey:
        today,


      lastDeviceSteps:
        0,


      lastUpdated:
        nowISO(),

    };


    return {

      delta:
        currentDeviceSteps,


      router:
        nextRouter,


      baselineEstablished:
        false,


      newDay:
        true,

    };
  }


  // ==========================================================
  // MISSING BASELINE
  // ==========================================================

  if (
    router
      .lastDeviceSteps ===
      null ||

    router
      .lastDeviceSteps ===
      undefined
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

      delta:
        0,


      router:
        nextRouter,


      baselineEstablished:
        true,

    };
  }


  const previousDeviceSteps =
    safeInteger(
      router
        .lastDeviceSteps
    );


  // ==========================================================
  // DEVICE COUNTER DECREASED
  //
  // iOS/device data was recalculated or reset.
  //
  // Never make artificial negative or positive steps.
  // ==========================================================

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


      lastDelta:
        0,


      pendingManualJourneySteps:
        0,


      pendingManualMarathonSteps:
        0,


      lastUpdated:
        nowISO(),

    };


    await saveRouterState(
      nextRouter
    );


    return {

      delta:
        0,


      router:
        nextRouter,


      resetDetected:
        true,


      baselineEstablished:
        true,

    };
  }


  // ==========================================================
  // NORMAL PHYSICAL DELTA
  // ==========================================================

  return {

    delta:

      currentDeviceSteps -

      previousDeviceSteps,


    router,


    baselineEstablished:
      false,

  };
}


// ============================================================
// RECONCILE DIRECT FOREGROUND CREDITS
//
// Example:
//
// GPS Journey screen directly saves 12 verified physical steps.
//
// Later global Pedometer.getStepCountAsync() also contains those
// same 12 steps.
//
// Without this reconciliation:
//   +12 Journey
//   +12 global
//   = incorrect +24
//
// With this:
//   +12 Journey
//   next global 12 is consumed
//   = correct +12
// ============================================================

function reconcileManualCredits(
  router,
  destination,
  rawDelta
) {

  const raw =
    safeInteger(
      rawDelta
    );


  const nextRouter = {

    ...router,

  };


  // ==========================================================
  // JOURNEY
  // ==========================================================

  if (
    destination ===
    STEP_DESTINATIONS.JOURNEY
  ) {

    const pending =
      safeInteger(
        router
          ?.pendingManualJourneySteps
      );


    const consumed =
      Math.min(
        raw,
        pending
      );


    nextRouter.pendingManualJourneySteps =

      pending -

      consumed;


    return {

      router:
        nextRouter,


      rawDelta:
        raw,


      manualConsumed:
        consumed,


      creditDelta:

        raw -

        consumed,

    };
  }


  // ==========================================================
  // MARATHON
  // ==========================================================

  if (
    destination ===
    STEP_DESTINATIONS.MARATHON
  ) {

    const pending =
      safeInteger(
        router
          ?.pendingManualMarathonSteps
      );


    const consumed =
      Math.min(
        raw,
        pending
      );


    nextRouter.pendingManualMarathonSteps =

      pending -

      consumed;


    return {

      router:
        nextRouter,


      rawDelta:
        raw,


      manualConsumed:
        consumed,


      creditDelta:

        raw -

        consumed,

    };
  }


  return {

    router:
      nextRouter,


    rawDelta:
      raw,


    manualConsumed:
      0,


    creditDelta:
      raw,

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

  movementAllowed = true,

  movementReason = null,

} = {}) {

  try {

    const activeDestination =
      normalizeDestination(

        destination ||

        await getActiveStepDestination()
      );


    const physical =
      await calculatePhysicalStepDelta(
        deviceSteps
      );


    const rawDelta =
      safeInteger(
        physical
          ?.delta
      );


    // --------------------------------------------------------
    // Remove steps already credited by foreground screen.
    // --------------------------------------------------------

    const reconciled =
      reconcileManualCredits(

        physical
          ?.router ||

        createDefaultRouterState(),

        activeDestination,

        rawDelta
      );


    const delta =
      safeInteger(
        reconciled
          ?.creditDelta
      );


    // --------------------------------------------------------
    // Router state that acknowledges current phone reading.
    // --------------------------------------------------------

    const baseRouter = {

      ...reconciled
        .router,


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


      lastUpdated:
        nowISO(),

    };


    // ========================================================
    // VEHICLE / HIGH-SPEED MOVEMENT REJECTED
    //
    // IMPORTANT:
    // We still move lastDeviceSteps forward.
    //
    // Therefore these rejected steps can NEVER be credited
    // later when the vehicle stops.
    // ========================================================

    if (
      movementAllowed ===
      false
    ) {

      const routerResult =
        await saveRouterState({

          ...baseRouter,


          lastDelta:
            0,


          lastRejectedDeviceDelta:
            rawDelta,


          lastRejectedReason:

            movementReason ||

            "movement-rejected",

        });


      return {

        routed:
          false,


        rejected:
          true,


        destination:
          activeDestination,


        rawDelta,


        manualConsumed:
          reconciled
            .manualConsumed,


        delta:
          0,


        added:
          0,


        marathonId,


        journeyId,


        reason:

          movementReason ||

          "movement-rejected",


        routerSaved:

          routerResult
            ?.saved ===

          true,

      };
    }


    // ========================================================
    // NO OWNER
    //
    // Acknowledge phone reading but do not give it to Journey
    // or Marathon.
    // ========================================================

    if (
      activeDestination ===
      STEP_DESTINATIONS.NONE
    ) {

      await saveRouterState({

        ...baseRouter,


        lastDelta:
          0,


        lastRejectedDeviceDelta:
          0,


        lastRejectedReason:
          "no-active-destination",

      });


      return {

        routed:
          false,


        destination:
          activeDestination,


        rawDelta,


        manualConsumed:
          reconciled
            .manualConsumed,


        delta:
          0,


        added:
          0,


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


        reason:
          "no-active-destination",

      };
    }


    // ========================================================
    // ZERO CREDIT DELTA
    //
    // This can mean:
    // • baseline established
    // • no new steps
    // • foreground screen already credited all of them
    // ========================================================

    if (
      delta <=
      0
    ) {

      await saveRouterState({

        ...baseRouter,


        lastDelta:
          0,


        lastRejectedDeviceDelta:
          0,


        lastRejectedReason:
          null,

      });


      return {

        routed:
          false,


        destination:
          activeDestination,


        rawDelta,


        manualConsumed:
          reconciled
            .manualConsumed,


        delta:
          0,


        added:
          0,


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


        reconciledOnly:

          reconciled
            .manualConsumed >

          0,

      };
    }


    // ========================================================
    // ROUTE TO THE ONE ACTIVE OWNER
    // ========================================================

    let result;


    if (
      activeDestination ===
      STEP_DESTINATIONS.JOURNEY
    ) {

      result =
        await addRegularJourneySteps(

          delta,

          {

            source:
              "router",


            creditCommunity:
              false,

          }
        );

    } else {

      result =
        await addMarathonSteps(

          delta,

          {

            source:
              "router",


            creditCommunity:
              false,

          }
        );
    }


    // ========================================================
    // DESTINATION SAVE FAILED
    //
    // Do NOT advance the phone checkpoint.
    //
    // The same physical delta can be retried later.
    // ========================================================

    if (
      result
        ?.saved !==
      true
    ) {

      return {

        routed:
          false,


        destination:
          activeDestination,


        rawDelta,


        manualConsumed:
          reconciled
            .manualConsumed,


        delta,


        marathonId,


        journeyId,


        result,


        reason:

          result
            ?.reason ||

          "destination-save-failed",

      };
    }


    const added =
      safeInteger(
        result
          ?.added
      );


    // ========================================================
    // SAVE PHONE CHECKPOINT
    // ========================================================

    const routerResult =
      await saveRouterState({

        ...baseRouter,


        lastDelta:
          added,


        lastRejectedDeviceDelta:
          0,


        lastRejectedReason:
          null,

      });


    // ========================================================
    // ROUTER SAVE FAILED AFTER DESTINATION ALREADY SAVED
    //
    // We report a warning instead of calling the destination
    // again in this same request.
    // ========================================================

    if (
      routerResult
        ?.saved !==
      true
    ) {

      return {

        routed:
          true,


        destination:
          activeDestination,


        rawDelta,


        manualConsumed:
          reconciled
            .manualConsumed,


        delta,


        added,


        marathonId,


        journeyId,


        result,


        warning:
          "router-save-failed-after-destination-save",


        error:
          routerResult
            ?.error,

      };
    }


    // ========================================================
    // COMMUNITY CHALLENGE CREDIT
    //
    // Only after local physical credit is safely persisted.
    // ========================================================

    if (
      added >
      0
    ) {

      await creditCommunityChallengeStepsBestEffort(
        added
      );
    }


    return {

      routed:
        true,


      destination:
        activeDestination,


      rawDelta,


      manualConsumed:
        reconciled
          .manualConsumed,


      delta,


      added,


      marathonId,


      journeyId,


      completedNow:

        result
          ?.completedNow ===

        true,


      overflow:
        safeInteger(
          result
            ?.overflow
        ),


      result,

    };

  } catch (
    error
  ) {

    console.log(
      "Route physical steps error:",
      error
    );


    return {

      routed:
        false,


      delta:
        0,


      added:
        0,


      error,

    };
  }
}


// ============================================================
// SYNCHRONIZE PHYSICAL PHONE STEPS
//
// Called by:
// • App.js
// • Dashboard
// • Marathon screens
// • foreground refresh
//
// Calls are serialized by enqueueSync().
// ============================================================

export async function syncTodaySteps({

  filterVehicle = true,

} = {}) {

  return enqueueSync(

    async () => {

      try {

        // ----------------------------------------------------
        // Cumulative phone steps since midnight.
        // ----------------------------------------------------

        const deviceSteps =
          await getTodaySteps();


        // ----------------------------------------------------
        // Journey or Marathon owns them.
        // ----------------------------------------------------

        const owner =
          await getCurrentStepOwner();


        // ----------------------------------------------------
        // Optional global vehicle filter.
        // ----------------------------------------------------

        const movement =

          filterVehicle

            ? await checkMovementEligibility()

            : {

                allowed:
                  true,


                verified:
                  false,


                reason:
                  "filter-disabled",


                speedMps:
                  null,

              };


        // ----------------------------------------------------
        // Route physical difference.
        // ----------------------------------------------------

        const routed =
          await routePhysicalSteps({

            deviceSteps,


            destination:
              owner
                .destination,


            marathonId:
              owner
                .marathonId,


            movementAllowed:
              movement
                .allowed,


            movementReason:
              movement
                .reason,

          });


        return {

          ...routed,


          synced:
            true,


          deviceSteps,


          owner:
            owner
              .owner,


          marathonId:

            routed
              ?.marathonId ||

            owner
              .marathonId ||

            null,


          movement,


          completedNow:

            routed
              ?.completedNow ===
              true ||

            routed
              ?.result
              ?.completedNow ===
              true,


          marathon:

            routed
              ?.result
              ?.marathon ||

            null,


          progress:

            routed
              ?.result
              ?.progress ||

            null,


          nextMarathonUnlocked:

            routed
              ?.result
              ?.nextMarathonUnlocked ||

            null,

        };

      } catch (
        error
      ) {

        console.log(
          "Synchronize physical steps error:",
          error
        );


        return {

          synced:
            false,


          routed:
            false,


          delta:
            0,


          added:
            0,


          completedNow:
            false,


          error,

        };
      }
    }
  );
}


// ============================================================
// LIVE STEP WATCHER
//
// UI FEEDBACK ONLY.
//
// It does not persist progress.
//
// Persistent physical credit is controlled by:
//
// • syncTodaySteps()
// OR
// • a foreground screen explicitly calling
//   addRegularJourneySteps()
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
                    result
                      ?.steps
                  ),


                owner:
                  owner
                    .owner,


                destination:
                  owner
                    .destination,


                marathonId:
                  owner
                    .marathonId,


                marathonActive:
                  owner
                    .marathonActive,


                legathonActive:
                  owner
                    .legathonActive,

              });
            }

          } catch (
            error
          ) {

            console.log(
              "Live step callback error:",
              error
            );
          }
        }
      );


    return subscription;

  } catch (
    error
  ) {

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

    subscription
      ?.remove?.();


    return true;

  } catch (
    error
  ) {

    console.log(
      "Stop live step watcher error:",
      error
    );


    return false;
  }
}


// ============================================================
// COMPLETE STEP SNAPSHOT
// ============================================================

export async function getStepTrackingSnapshot() {

  try {

    const [
      stats,
      router,
      owner,
      journeyRewardSteps,
      movement,
    ] =
      await Promise.all([

        loadStepStats(),

        loadRouterState(),

        getCurrentStepOwner(),

        getJourneyRewardSteps(),

        loadMovementState(),

      ]);


    return {

      todaySteps:
        safeInteger(
          stats
            ?.todaySteps
        ),


      lifetimeSteps:
        safeInteger(
          stats
            ?.journeyLifetimeSteps
        ),


      totalSteps:
        safeInteger(
          stats
            ?.journeyLifetimeSteps
        ),


      journeyLifetimeSteps:
        safeInteger(
          stats
            ?.journeyLifetimeSteps
        ),


      marathonLifetimeSteps:
        safeInteger(
          stats
            ?.marathonLifetimeSteps
        ),


      journeyRewardSteps:
        safeInteger(
          journeyRewardSteps
        ),


      miles:
        safeNumber(
          stats
            ?.miles
        ),


      milesWalked:
        safeNumber(
          stats
            ?.milesWalked
        ),


      calories:
        safeNumber(
          stats
            ?.calories
        ),


      caloriesBurned:
        safeNumber(
          stats
            ?.caloriesBurned
        ),


      dayStreak:
        safeInteger(
          stats
            ?.dayStreak
        ),


      owner:
        owner
          .owner,


      destination:
        owner
          .destination,


      marathonActive:
        owner
          .marathonActive,


      marathonId:
        owner
          .marathonId,


      pendingManualJourneySteps:
        safeInteger(
          router
            ?.pendingManualJourneySteps
        ),


      pendingManualMarathonSteps:
        safeInteger(
          router
            ?.pendingManualMarathonSteps
        ),


      movement,


      router,


      stats,

    };

  } catch (
    error
  ) {

    console.log(
      "Get step snapshot error:",
      error
    );


    return {

      todaySteps:
        0,


      lifetimeSteps:
        0,


      totalSteps:
        0,


      journeyLifetimeSteps:
        0,


      marathonLifetimeSteps:
        0,


      journeyRewardSteps:
        0,


      miles:
        0,


      milesWalked:
        0,


      calories:
        0,


      caloriesBurned:
        0,


      dayStreak:
        0,


      owner:
        null,


      destination:
        STEP_DESTINATIONS.NONE,


      marathonActive:
        false,


      marathonId:
        null,


      pendingManualJourneySteps:
        0,


      pendingManualMarathonSteps:
        0,


      error,

    };
  }
}


// ============================================================
// COMPATIBILITY EXPORTS
//
// Keep older Legathon screens working.
// ============================================================

export const getStepStats =
  loadStepStats;


export const getStepsStats =
  loadStepStats;


export const setStepStats =
  saveStepStats;


export async function addJourneySteps(
  steps,
  options = {}
) {

  return addRegularJourneySteps(

    steps,

    options
  );
}


// ============================================================
// DEVELOPMENT RESET
//
// Default:
// • preserve Journey Lifetime
// • preserve Marathon Lifetime
// • clear Today
// • clear router baselines
// • clear vehicle filter
//
// If you want a TRUE zero reset:
//
// resetStepTrackingEngine({
//   preserveJourneyLifetime: false,
//   preserveMarathonLifetime: false,
// });
//
// ============================================================

export async function resetStepTrackingEngine({

  preserveJourneyLifetime =
    true,

  preserveMarathonLifetime =
    true,

} = {}) {

  try {

    const previous =
      await loadStepStats();


    const journeyLifetime =

      preserveJourneyLifetime

        ? safeInteger(
            previous
              ?.journeyLifetimeSteps
          )

        : 0;


    const marathonLifetime =

      preserveMarathonLifetime

        ? safeInteger(
            previous
              ?.marathonLifetimeSteps
          )

        : 0;


    // --------------------------------------------------------
    // Remove every step-engine key.
    // --------------------------------------------------------

    await AsyncStorage.multiRemove([

      STEP_STATS_KEY,

      STEP_ROUTER_KEY,

      ACTIVE_DESTINATION_KEY,

      MOVEMENT_FILTER_KEY,

      JOURNEY_REWARD_STEPS_KEY,

      LEGACY_LIFETIME_KEY,

      LEGACY_LIFETIME_KEY_UPPER,

    ]);


    // --------------------------------------------------------
    // Rebuild canonical stats.
    // --------------------------------------------------------

    const freshStats =
      normalizeStepStats({

        ...createDefaultStepStats(),


        lifetimeSteps:
          journeyLifetime,


        totalSteps:
          journeyLifetime,


        journeyLifetimeSteps:
          journeyLifetime,


        marathonLifetimeSteps:
          marathonLifetime,


        lastUpdated:
          nowISO(),

      });


    await saveStepStats(
      freshStats
    );


    // --------------------------------------------------------
    // Mirror Journey lifetime for old screens.
    // --------------------------------------------------------

    await Promise.all([

      AsyncStorage.setItem(
        JOURNEY_REWARD_STEPS_KEY,

        String(
          journeyLifetime
        )
      ),


      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY,

        String(
          journeyLifetime
        )
      ),


      AsyncStorage.setItem(
        LEGACY_LIFETIME_KEY_UPPER,

        String(
          journeyLifetime
        )
      ),

    ]);


    return {

      reset:
        true,


      preservedJourneyLifetime:
        preserveJourneyLifetime,


      preservedMarathonLifetime:
        preserveMarathonLifetime,


      journeyLifetimeSteps:
        journeyLifetime,


      marathonLifetimeSteps:
        marathonLifetime,

    };

  } catch (
    error
  ) {

    console.log(
      "Reset step engine error:",
      error
    );


    return {

      reset:
        false,


      error,

    };
  }
}


// ============================================================
// END OF LEGATHON WALK STEP TRACKING ENGINE
// ============================================================