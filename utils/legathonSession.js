// utils/legathonSession.js

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getActiveMarathon,
  setActiveMarathon,
} from "./marathonStorage";

import {
  activateJourneyTracking,
  activateMarathonTracking,
  resetStepRouterBaseline,
  syncTodaySteps,
} from "./stepTrackingEngine";

// ============================================================
// STORAGE
// ============================================================

const LEGATHON_SESSION_KEY =
  "LEGATHON_ACTIVE_SESSION_V1";

// ============================================================
// HELPERS
// ============================================================

const safeNumber = value => {
  const parsed =
    Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const nowISO = () =>
  new Date().toISOString();

const createEmptySession = () => ({
  active: false,
  marathonId: null,

  status: "idle",

  startedAt: null,
  resumedAt: null,
  pausedAt: null,
  completedAt: null,

  sessionSteps: 0,

  // Journey does not own incoming steps
  // while this value is true.
  ownsStepRouting: false,

  lastUpdated: null,
});

// ============================================================
// LOAD SESSION
// ============================================================

export async function loadLegathonSession() {
  try {
    const saved =
      await AsyncStorage.getItem(
        LEGATHON_SESSION_KEY
      );

    if (!saved) {
      return createEmptySession();
    }

    const parsed =
      JSON.parse(saved);

    return {
      ...createEmptySession(),
      ...parsed,

      active:
        parsed?.active === true,

      ownsStepRouting:
        parsed?.ownsStepRouting ===
        true,

      sessionSteps:
        Math.max(
          0,
          safeNumber(
            parsed?.sessionSteps
          )
        ),
    };
  } catch (error) {
    console.log(
      "Load Legathon session error:",
      error
    );

    return createEmptySession();
  }
}

// ============================================================
// SAVE SESSION
// ============================================================

export async function saveLegathonSession(
  session
) {
  const normalized = {
    ...createEmptySession(),
    ...session,

    lastUpdated:
      nowISO(),
  };

  await AsyncStorage.setItem(
    LEGATHON_SESSION_KEY,
    JSON.stringify(normalized)
  );

  return normalized;
}

// ============================================================
// IS LEGATHON CONTROLLING STEPS?
// ============================================================

export async function isLegathonActive() {
  const session =
    await loadLegathonSession();

  return (
    session.active === true &&
    session.status === "active" &&
    session.ownsStepRouting === true &&
    Boolean(session.marathonId)
  );
}

// ============================================================
// START LEGATHON
// ============================================================

export async function startLegathon(
  marathonId
) {
  try {
    if (!marathonId) {
      return {
        started: false,
        reason:
          "invalid-marathon-id",
      };
    }

    // --------------------------------------------------------
    // 1. Finish accounting for any physical steps recorded
    // before Marathon mode begins.
    // --------------------------------------------------------

    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-Legathon step sync error:",
        syncError
      );
    }

    // --------------------------------------------------------
    // 2. Select and activate the requested marathon.
    // --------------------------------------------------------

    const result =
      await setActiveMarathon(
        marathonId
      );

    if (!result?.saved) {
      return {
        started: false,

        reason:
          result?.reason ||
          "activation-failed",

        result,
      };
    }

    // --------------------------------------------------------
    // 3. Establish a fresh physical-step baseline.
    //
    // Steps recorded before Marathon mode cannot enter the
    // Marathon.
    // --------------------------------------------------------

    await resetStepRouterBaseline();

    // --------------------------------------------------------
    // 4. Give Marathon mode exclusive ownership of all new
    // physical steps.
    // --------------------------------------------------------

    await activateMarathonTracking();

    const now =
      nowISO();

    const session =
      await saveLegathonSession({
        active: true,

        marathonId,

        status: "active",

        startedAt:
          result?.progress
            ?.startedAt ||
          now,

        resumedAt:
          now,

        pausedAt:
          null,

        completedAt:
          null,

        sessionSteps:
          safeNumber(
            result?.progress?.steps
          ),

        ownsStepRouting:
          true,
      });

    return {
      started: true,

      marathon:
        result?.marathon ||
        null,

      progress:
        result?.progress ||
        null,

      session,
    };
  } catch (error) {
    console.log(
      "Start Legathon error:",
      error
    );

    return {
      started: false,
      reason: "start-error",
      error,
    };
  }
}

// ============================================================
// RESUME EXISTING LEGATHON
// ============================================================

export async function resumeLegathon() {
  try {
    const activeMarathon =
      await getActiveMarathon();

    const marathonId =
      activeMarathon?.marathonId ??
      activeMarathon?.id ??
      activeMarathon
        ?.marathon?.id;

    if (!marathonId) {
      return {
        resumed: false,
        reason:
          "no-active-marathon",
      };
    }

    const previous =
      await loadLegathonSession();

    // Account for physical steps accumulated while Marathon
    // mode was paused and Journey mode owned the router.
    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-resume step sync error:",
        syncError
      );
    }

    // Ignore all earlier phone steps when Marathon mode resumes.
    await resetStepRouterBaseline();

    await activateMarathonTracking();

    const session =
      await saveLegathonSession({
        ...previous,

        active: true,

        marathonId,

        status: "active",

        resumedAt:
          nowISO(),

        pausedAt:
          null,

        ownsStepRouting:
          true,
      });

    return {
      resumed: true,
      session,
    };
  } catch (error) {
    console.log(
      "Resume Legathon error:",
      error
    );

    return {
      resumed: false,
      reason: "resume-error",
      error,
    };
  }
}

// ============================================================
// PAUSE LEGATHON
// ============================================================

export async function pauseLegathon() {
  try {
    const current =
      await loadLegathonSession();

    if (!current.active) {
      return {
        paused: false,
        reason:
          "no-active-session",
      };
    }

    // Capture any new Marathon steps before ownership changes.
    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-pause step sync error:",
        syncError
      );
    }

    const session =
      await saveLegathonSession({
        ...current,

        active: false,

        status: "paused",

        pausedAt:
          nowISO(),

        ownsStepRouting:
          false,
      });

    // Journey begins with a clean physical-step baseline.
    await resetStepRouterBaseline();

    await activateJourneyTracking();

    return {
      paused: true,
      session,
    };
  } catch (error) {
    console.log(
      "Pause Legathon error:",
      error
    );

    return {
      paused: false,
      reason: "pause-error",
      error,
    };
  }
}

// ============================================================
// COMPLETE LEGATHON SESSION
// ============================================================

export async function completeLegathonSession(
  marathonId
) {
  try {
    const current =
      await loadLegathonSession();

    if (
      marathonId &&
      current.marathonId &&
      marathonId !==
        current.marathonId
    ) {
      return {
        completed: false,
        reason:
          "marathon-id-mismatch",
      };
    }

    const now =
      nowISO();

    const session =
      await saveLegathonSession({
        ...current,

        active: false,

        status: "completed",

        completedAt:
          now,

        ownsStepRouting:
          false,
      });

    // Marathon steps cannot leak into Journey progress.
    await resetStepRouterBaseline();

    await activateJourneyTracking();

    return {
      completed: true,
      session,
    };
  } catch (error) {
    console.log(
      "Complete Legathon session error:",
      error
    );

    return {
      completed: false,
      reason: "completion-error",
      error,
    };
  }
}

// ============================================================
// EXIT ACTIVE LEGATHON
// ============================================================

export async function exitLegathon() {
  try {
    const current =
      await loadLegathonSession();

    // Capture the final Marathon delta before exiting.
    if (
      current.active === true &&
      current.status === "active"
    ) {
      try {
        await syncTodaySteps();
      } catch (syncError) {
        console.log(
          "Pre-exit step sync error:",
          syncError
        );
      }
    }

    const session =
      await saveLegathonSession({
        ...current,

        active: false,

        status: "idle",

        pausedAt:
          null,

        ownsStepRouting:
          false,
      });

    // Journey restarts from a clean sensor boundary.
    await resetStepRouterBaseline();

    await activateJourneyTracking();

    return {
      exited: true,
      session,
    };
  } catch (error) {
    console.log(
      "Exit Legathon error:",
      error
    );

    return {
      exited: false,
      reason: "exit-error",
      error,
    };
  }
}

// ============================================================
// CLEAR SESSION
// ============================================================

export async function clearLegathonSession() {
  try {
    await AsyncStorage.removeItem(
      LEGATHON_SESSION_KEY
    );

    await resetStepRouterBaseline();

    await activateJourneyTracking();

    return createEmptySession();
  } catch (error) {
    console.log(
      "Clear Legathon session error:",
      error
    );

    return {
      ...createEmptySession(),
      error,
    };
  }
}