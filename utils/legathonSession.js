// utils/legathonSession.js

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getActiveMarathon,
  setActiveMarathon,
} from "./marathonStorage";

import {
  resetStepRouterCheckpoint,
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

const safeNumber = (value) => {
  const parsed = Number(value ?? 0);

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

  // Journey does NOT own steps while this is true.
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

    lastUpdated: nowISO(),
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
    !!session.marathonId
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
        reason: "invalid-marathon-id",
      };
    }

    // --------------------------------------------------------
    // 1. Finish normal Journey accounting FIRST.
    //
    // Any steps accumulated before Start belongs to Journey.
    // --------------------------------------------------------

    try {
      await syncTodaySteps();
    } catch (error) {
      console.log(
        "Pre-Legathon journey sync error:",
        error
      );
    }

    // --------------------------------------------------------
    // 2. Activate the marathon.
    //
    // Marathon storage does NOT need lifetime steps.
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
    // 3. Establish a NEW sensor boundary.
    //
    // Steps before this checkpoint must never enter Legathon.
    // --------------------------------------------------------

    await resetStepRouterCheckpoint();

    const now = nowISO();

    // --------------------------------------------------------
    // 4. Legathon now owns incoming walking steps.
    // --------------------------------------------------------

    const session =
      await saveLegathonSession({
        active: true,

        marathonId,

        status: "active",

        startedAt:
          result?.progress
            ?.startedAt ||
          now,

        resumedAt: now,

        pausedAt: null,
        completedAt: null,

        sessionSteps: safeNumber(
          result?.progress?.steps
        ),

        ownsStepRouting: true,
      });

    return {
      started: true,
      marathon:
        result?.marathon || null,

      progress:
        result?.progress || null,

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
      activeMarathon?.marathon?.id;

    if (!marathonId) {
      return {
        resumed: false,
        reason:
          "no-active-marathon",
      };
    }

    const previous =
      await loadLegathonSession();

    // New sensor boundary.
    // Anything that happened while paused is ignored by
    // Legathon.
    await resetStepRouterCheckpoint();

    const session =
      await saveLegathonSession({
        ...previous,

        active: true,

        marathonId,

        status: "active",

        resumedAt: nowISO(),

        pausedAt: null,

        ownsStepRouting: true,
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

    const session =
      await saveLegathonSession({
        ...current,

        status: "paused",

        pausedAt: nowISO(),

        ownsStepRouting: false,
      });

    // Establish another clean boundary.
    await resetStepRouterCheckpoint();

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

    const now = nowISO();

    // Stop Legathon ownership first.
    const session =
      await saveLegathonSession({
        ...current,

        active: false,

        status: "completed",

        completedAt: now,

        ownsStepRouting: false,
      });

    // --------------------------------------------------------
    // IMPORTANT
    //
    // Journey begins from THIS checkpoint.
    //
    // Therefore:
    // Legathon steps cannot leak into normal Journey progress.
    // --------------------------------------------------------

    await resetStepRouterCheckpoint();

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
// EXIT / CANCEL ACTIVE LEGATHON ROUTING
// ============================================================

export async function exitLegathon() {
  try {
    const current =
      await loadLegathonSession();

    const session =
      await saveLegathonSession({
        ...current,

        active: false,

        status: "idle",

        pausedAt: null,

        ownsStepRouting: false,
      });

    // Journey starts counting fresh from this point.
    await resetStepRouterCheckpoint();

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
  await AsyncStorage.removeItem(
    LEGATHON_SESSION_KEY
  );

  return createEmptySession();
}