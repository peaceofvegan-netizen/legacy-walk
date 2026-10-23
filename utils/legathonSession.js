import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


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
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const saved = await _accountSession.run(async () => (AsyncStorage.getItem(
      LEGATHON_SESSION_KEY
    )));

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
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Load Legathon session error:",
      error
    );

    return createEmptySession();
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function saveLegathonSession(session) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const normalized = {
    ...createEmptySession(),
    ...session,
    lastUpdated: nowISO(),
  };

  await _accountSession2.run(async () => (AsyncStorage.setItem(
    LEGATHON_SESSION_KEY,
    JSON.stringify(normalized)
  )));

  return normalized;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function isLegathonActive() {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const session = await _accountSession3.run(async () => (loadLegathonSession()));

  return (
    session.active === true &&
    session.status === "active" &&
    session.ownsStepRouting === true &&
    Boolean(session.marathonId)
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function startLegathon(marathonId) {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  try {
    if (!marathonId) {
      return {
        started: false,
        reason: "invalid-marathon-id",
      };
    }

    // Account for steps before Marathon mode begins.
    try {
      await _accountSession4.run(async () => (syncTodaySteps()));
    } catch (syncError) {
    if (isAccountSessionEnded(syncError)) throw syncError;

      console.log(
        "Pre-Legathon step sync error:",
        syncError
      );
    }

    const result = await _accountSession4.run(async () => (setActiveMarathon(
      marathonId
    )));

    if (!result?.saved) {
      return {
        started: false,
        reason:
          result?.reason || "activation-failed",
        result,
      };
    }

    // The next physical reading establishes a fresh baseline.
    await _accountSession4.run(async () => (resetStepRouterBaseline()));
    await _accountSession4.run(async () => (activateMarathonTracking()));

    const now = nowISO();

    const session = await _accountSession4.run(async () => (saveLegathonSession({
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
    })));

    return {
      started: true,
      marathon: result?.marathon || null,
      progress: result?.progress || null,
      session,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Start Legathon error:", error);

    return {
      started: false,
      reason: "start-error",
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function resumeLegathon() {
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  try {
    const activeMarathon =
      await _accountSession5.run(async () => (getActiveMarathon()));

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

    const previous = await _accountSession5.run(async () => (loadLegathonSession()));

    try {
      await _accountSession5.run(async () => (syncTodaySteps()));
    } catch (syncError) {
    if (isAccountSessionEnded(syncError)) throw syncError;

      console.log(
        "Pre-resume step sync error:",
        syncError
      );
    }

    await _accountSession5.run(async () => (resetStepRouterBaseline()));
    await _accountSession5.run(async () => (activateMarathonTracking()));

    const session = await _accountSession5.run(async () => (saveLegathonSession({
      ...previous,
      active: true,
      marathonId,
      status: "active",
      resumedAt: nowISO(),
      pausedAt: null,
      ownsStepRouting: true,
    })));

    return {
      resumed: true,
      session,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Resume Legathon error:", error);

    return {
      resumed: false,
      reason: "resume-error",
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function pauseLegathon() {
  const _accountSession6 = captureAccountSession();

  try {
    _accountSession6.assertCurrent();

  try {
    const current = await _accountSession6.run(async () => (loadLegathonSession()));

    if (!current.active) {
      return {
        paused: false,
        reason: "no-active-session",
      };
    }

    try {
      await _accountSession6.run(async () => (syncTodaySteps()));
    } catch (syncError) {
    if (isAccountSessionEnded(syncError)) throw syncError;

      console.log(
        "Pre-pause step sync error:",
        syncError
      );
    }

    const session = await _accountSession6.run(async () => (saveLegathonSession({
      ...current,
      active: false,
      status: "paused",
      pausedAt: nowISO(),
      ownsStepRouting: false,
    })));

    await _accountSession6.run(async () => (resetStepRouterBaseline()));
    await _accountSession6.run(async () => (activateJourneyTracking()));

    return {
      paused: true,
      session,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Pause Legathon error:", error);

    return {
      paused: false,
      reason: "pause-error",
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function completeLegathonSession(
  marathonId
) {
  const _accountSession7 = captureAccountSession();

  try {
    _accountSession7.assertCurrent();

  try {
    const current = await _accountSession7.run(async () => (loadLegathonSession()));

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

    const session = await _accountSession7.run(async () => (saveLegathonSession({
      ...current,
      active: false,
      status: "completed",
      completedAt: nowISO(),
      ownsStepRouting: false,
    })));

    await _accountSession7.run(async () => (resetStepRouterBaseline()));
    await _accountSession7.run(async () => (activateJourneyTracking()));

    return {
      completed: true,
      session,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function exitLegathon() {
  const _accountSession8 = captureAccountSession();

  try {
    _accountSession8.assertCurrent();

  try {
    const current = await _accountSession8.run(async () => (loadLegathonSession()));

    if (
      current.active === true &&
      current.status === "active"
    ) {
      try {
        await _accountSession8.run(async () => (syncTodaySteps()));
      } catch (syncError) {
    if (isAccountSessionEnded(syncError)) throw syncError;

        console.log(
          "Pre-exit step sync error:",
          syncError
        );
      }
    }

    const session = await _accountSession8.run(async () => (saveLegathonSession({
      ...current,
      active: false,
      status: "idle",
      pausedAt: null,
      ownsStepRouting: false,
    })));

    await _accountSession8.run(async () => (resetStepRouterBaseline()));
    await _accountSession8.run(async () => (activateJourneyTracking()));

    return {
      exited: true,
      session,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Exit Legathon error:", error);

    return {
      exited: false,
      reason: "exit-error",
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function clearLegathonSession() {
  const _accountSession9 = captureAccountSession();
  const AsyncStorage = _accountSession9.storage;

  try {
    _accountSession9.assertCurrent();

  try {
    await _accountSession9.run(async () => (AsyncStorage.removeItem(
      LEGATHON_SESSION_KEY
    )));

    await _accountSession9.run(async () => (resetStepRouterBaseline()));
    await _accountSession9.run(async () => (activateJourneyTracking()));

    return createEmptySession();
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Clear Legathon session error:",
      error
    );

    return {
      ...createEmptySession(),
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}