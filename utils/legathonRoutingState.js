import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
// utils/legathonRoutingState.js




// ============================================================
// LEGATHON ROUTING STATE
// ============================================================
//
// This file is the bridge between:
//
// legathonSession.js
//        ↓
// stepTrackingEngine.js
//        ↓
// marathonStorage.js
//
// IMPORTANT:
//
// Do NOT import legathonSession.js here.
//
// legathonSession.js already imports stepTrackingEngine.js.
// Importing it here would create a circular dependency.
//
// Instead we read the same saved Legathon session directly.
//
// ============================================================


const LEGATHON_SESSION_KEY =
  "LEGATHON_ACTIVE_SESSION_V1";


// ============================================================
// DEFAULT ROUTING STATE
// ============================================================

function createIdleRoutingState() {
  return {
    active: false,

    marathonId: null,

    status: "idle",

    ownsStepRouting: false,

    sessionSteps: 0,

    startedAt: null,

    resumedAt: null,

    pausedAt: null,

    completedAt: null,
  };
}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(value) {
  const parsed =
    Number(value ?? 0);

  if (
    !Number.isFinite(parsed)
  ) {
    return 0;
  }

  return Math.max(
    0,
    parsed
  );
}


// ============================================================
// GET LEGATHON ROUTING STATE
// ============================================================
//
// stepTrackingEngine calls THIS function before routing
// every new physical step delta.
//
// If this returns:
//
// active: true
// status: "active"
// ownsStepRouting: true
// marathonId: "new-york..."
//
// then:
//
// physical steps
//      ↓
// Marathon
//
// Journey receives ZERO.
//
// ============================================================

export async function getLegathonRoutingState() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();


  try {

    const raw =
      await _accountSession.run(async () => (AsyncStorage.getItem(
        LEGATHON_SESSION_KEY
      )));


    if (!raw) {

      return createIdleRoutingState();

    }


    let session = null;


    try {

      session =
        JSON.parse(raw);

    } catch (parseError) {
    if (isAccountSessionEnded(parseError)) throw parseError;


      console.log(
        "Legathon routing session parse error:",
        parseError
      );

      return createIdleRoutingState();

    }


    const marathonId =
      session?.marathonId ||
      null;


    // ========================================================
    // DOES THE MARATHON ACTUALLY OWN STEPS?
    // ========================================================

    const ownsStepRouting =
      session?.active === true &&
      session?.status === "active" &&
      session?.ownsStepRouting === true &&
      Boolean(marathonId);


    // ========================================================
    // RETURN AUTHORITATIVE ROUTING STATE
    // ========================================================

    return {

      active:
        ownsStepRouting,

      marathonId:
        ownsStepRouting
          ? marathonId
          : null,

      status:
        ownsStepRouting
          ? "active"
          : session?.status ||
            "idle",

      ownsStepRouting,

      sessionSteps:
        safeNumber(
          session?.sessionSteps
        ),

      startedAt:
        session?.startedAt ||
        null,

      resumedAt:
        session?.resumedAt ||
        null,

      pausedAt:
        session?.pausedAt ||
        null,

      completedAt:
        session?.completedAt ||
        null,

    };

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;


    console.log(
      "Get Legathon routing state error:",
      error
    );


    return {
      ...createIdleRoutingState(),

      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// IS LEGATHON ROUTING ACTIVE
// ============================================================

export async function isLegathonRoutingActive() {
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();


  const routing =
    await _accountSession2.run(async () => (getLegathonRoutingState()));


  return (
    routing?.active === true &&
    routing?.ownsStepRouting === true &&
    Boolean(
      routing?.marathonId
    )
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// GET ACTIVE ROUTING MARATHON ID
// ============================================================

export async function getRoutingMarathonId() {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();


  const routing =
    await _accountSession3.run(async () => (getLegathonRoutingState()));


  if (
    routing?.active !== true ||
    routing?.ownsStepRouting !== true
  ) {
    return null;
  }


  return (
    routing?.marathonId ||
    null
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {

  getLegathonRoutingState,

  isLegathonRoutingActive,

  getRoutingMarathonId,

};