import AsyncStorage from "@react-native-async-storage/async-storage";

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

const LEGATHON_SESSION_KEY =
  "LEGATHON_ACTIVE_SESSION_V1";

const safeNumber = value => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const nowISO = () => new Date().toISOString();

const createEmptySession = () => ({
  active: false,
  marathonId: null,
  status: "idle",
  startedAt: null,
  resumedAt: null,
  pausedAt: null,
  completedAt: null,
  sessionSteps: 0,
  ownsStepRouting: false,
  lastUpdated: null,
});

export async function loadLegathonSession() {
  try {
    const saved = await AsyncStorage.getItem(
      LEGATHON_SESSION_KEY
    );

    if (!saved) {
      return createEmptySession();
    }

    const parsed = JSON.parse(saved);

    return {
      ...createEmptySession(),
      ...parsed,
      active: parsed?.active === true,
      ownsStepRouting:
        parsed?.ownsStepRouting === true,
      sessionSteps: Math.max(
        0,
        safeNumber(parsed?.sessionSteps)
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

export async function saveLegathonSession(session) {
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

export async function isLegathonActive() {
  const session = await loadLegathonSession();

  return (
    session.active === true &&
    session.status === "active" &&
    session.ownsStepRouting === true &&
    Boolean(session.marathonId)
  );
}

export async function startLegathon(marathonId) {
  try {
    if (!marathonId) {
      return {
        started: false,
        reason: "invalid-marathon-id",
      };
    }

    // Account for steps before Marathon mode begins.
    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-Legathon step sync error:",
        syncError
      );
    }

    const result = await setActiveMarathon(
      marathonId
    );

    if (!result?.saved) {
      return {
        started: false,
        reason:
          result?.reason || "activation-failed",
        result,
      };
    }

    // The next physical reading establishes a fresh baseline.
    await resetStepRouterBaseline();
    await activateMarathonTracking();

    const now = nowISO();

    const session = await saveLegathonSession({
      active: true,
      marathonId,
      status: "active",
      startedAt:
        result?.progress?.startedAt || now,
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
      marathon: result?.marathon || null,
      progress: result?.progress || null,
      session,
    };
  } catch (error) {
    console.log("Start Legathon error:", error);

    return {
      started: false,
      reason: "start-error",
      error,
    };
  }
}

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
        reason: "no-active-marathon",
      };
    }

    const previous = await loadLegathonSession();

    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-resume step sync error:",
        syncError
      );
    }

    await resetStepRouterBaseline();
    await activateMarathonTracking();

    const session = await saveLegathonSession({
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
    console.log("Resume Legathon error:", error);

    return {
      resumed: false,
      reason: "resume-error",
      error,
    };
  }
}

export async function pauseLegathon() {
  try {
    const current = await loadLegathonSession();

    if (!current.active) {
      return {
        paused: false,
        reason: "no-active-session",
      };
    }

    try {
      await syncTodaySteps();
    } catch (syncError) {
      console.log(
        "Pre-pause step sync error:",
        syncError
      );
    }

    const session = await saveLegathonSession({
      ...current,
      active: false,
      status: "paused",
      pausedAt: nowISO(),
      ownsStepRouting: false,
    });

    await resetStepRouterBaseline();
    await activateJourneyTracking();

    return {
      paused: true,
      session,
    };
  } catch (error) {
    console.log("Pause Legathon error:", error);

    return {
      paused: false,
      reason: "pause-error",
      error,
    };
  }
}

export async function completeLegathonSession(
  marathonId
) {
  try {
    const current = await loadLegathonSession();

    if (
      marathonId &&
      current.marathonId &&
      marathonId !== current.marathonId
    ) {
      return {
        completed: false,
        reason: "marathon-id-mismatch",
      };
    }

    const session = await saveLegathonSession({
      ...current,
      active: false,
      status: "completed",
      completedAt: nowISO(),
      ownsStepRouting: false,
    });

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

export async function exitLegathon() {
  try {
    const current = await loadLegathonSession();

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

    const session = await saveLegathonSession({
      ...current,
      active: false,
      status: "idle",
      pausedAt: null,
      ownsStepRouting: false,
    });

    await resetStepRouterBaseline();
    await activateJourneyTracking();

    return {
      exited: true,
      session,
    };
  } catch (error) {
    console.log("Exit Legathon error:", error);

    return {
      exited: false,
      reason: "exit-error",
      error,
    };
  }
}

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