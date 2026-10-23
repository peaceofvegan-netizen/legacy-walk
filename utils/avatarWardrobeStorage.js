import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
// utils/avatarWardrobeStorage.js




// ============================================================
// LEGATHON WALK — AVATAR WARDROBE STORAGE
// ============================================================
//
// Handles:
//
// • Current equipped tracksuit
// • Current tracksuit level
// • Tracksuit persistence
// • Default outfit
// • Legacy storage migration
//
// IMPORTANT:
// This file does NOT calculate unlocks.
// Unlock progression belongs in tracksuitProgress.js.
//
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

export const AVATAR_WARDROBE_KEYS = Object.freeze({
  CURRENT_SUIT:
    "@legathon/avatar/currentSuit",

  CURRENT_SUIT_LEVEL:
    "@legathon/avatar/currentSuitLevel",

  WARDROBE_STATE:
    "@legathon/avatar/wardrobeState",
});


// ============================================================
// LEGACY KEYS
// ============================================================
//
// These allow older saved versions of the app to continue
// working after this upgrade.
//
// ============================================================

const LEGACY_SUIT_KEYS = [
  "equippedSuit",
  "currentAvatarSuit",
  "avatarSuit",
  "selectedTracksuit",
  "equippedTracksuit",
];

const LEGACY_LEVEL_KEYS = [
  "currentAvatarSuitLevel",
  "avatarSuitLevel",
  "tracksuitLevel",
];


// ============================================================
// VALID SUITS
// ============================================================

export const VALID_AVATAR_SUITS = Object.freeze([
  "default",
  "blue",
  "green",
  "red",
  "yellow",
  "elite",
]);


// ============================================================
// SUIT LEVELS
// ============================================================

export const AVATAR_SUIT_LEVELS = Object.freeze({
  default: 0,
  blue: 1,
  green: 2,
  red: 3,
  yellow: 4,
  elite: 5,
});


// ============================================================
// NORMALIZE VALUE
// ============================================================

function normalizeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
}


// ============================================================
// NORMALIZE SUIT ID
// ============================================================

export function normalizeWardrobeSuitId(value) {
  const suit =
    normalizeValue(value);

  if (
    !suit ||
    suit === "default" ||
    suit === "normal" ||
    suit === "none" ||
    suit === "base"
  ) {
    return "default";
  }

  if (suit.includes("blue")) {
    return "blue";
  }

  if (suit.includes("green")) {
    return "green";
  }

  if (suit.includes("red")) {
    return "red";
  }

  if (suit.includes("yellow")) {
    return "yellow";
  }

  if (
    suit.includes("elite") ||
    suit.includes("blackgold") ||
    suit.includes("black-gold") ||
    suit.includes("black_gold") ||
    suit.includes("black & gold") ||
    suit.includes("black and gold")
  ) {
    return "elite";
  }

  return "default";
}


// ============================================================
// GET SUIT LEVEL
// ============================================================

export function getSuitLevelForId(suitId) {
  const normalizedSuit =
    normalizeWardrobeSuitId(
      suitId
    );

  return (
    AVATAR_SUIT_LEVELS[
      normalizedSuit
    ] ?? 0
  );
}


// ============================================================
// IS VALID SUIT
// ============================================================

export function isValidAvatarSuit(suitId) {
  const normalized =
    normalizeWardrobeSuitId(
      suitId
    );

  return VALID_AVATAR_SUITS.includes(
    normalized
  );
}


// ============================================================
// READ FIRST EXISTING STORAGE VALUE
// ============================================================

async function readFirstStorageValue(keys) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  for (const key of keys) {
    try {
      const value =
        await _accountSession.run(async () => (AsyncStorage.getItem(
          key
        )));

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

      console.log(
        "Wardrobe legacy read error:",
        key,
        error
      );
    }
  }

  return null;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// SAVE WARDROBE SNAPSHOT
// ============================================================

async function saveWardrobeSnapshot(
  suitId,
  suitLevel
) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    const state = {
      suitId:
        normalizeWardrobeSuitId(
          suitId
        ),

      suitLevel:
        Number(
          suitLevel || 0
        ),

      updatedAt:
        Date.now(),
    };

    await _accountSession2.run(async () => (AsyncStorage.setItem(
      AVATAR_WARDROBE_KEYS.WARDROBE_STATE,
      JSON.stringify(state)
    )));

    return state;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Save wardrobe snapshot error:",
      error
    );

    return null;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// GET CURRENT AVATAR SUIT
// ============================================================

export async function getCurrentAvatarSuit() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  try {
    // --------------------------------------------------------
    // NEW STORAGE
    // --------------------------------------------------------

    const storedSuit =
      await _accountSession3.run(async () => (AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT
      )));

    if (storedSuit) {
      return normalizeWardrobeSuitId(
        storedSuit
      );
    }


    // --------------------------------------------------------
    // SNAPSHOT FALLBACK
    // --------------------------------------------------------

    const snapshot =
      await _accountSession3.run(async () => (AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.WARDROBE_STATE
      )));

    if (snapshot) {
      try {
        const parsed =
          JSON.parse(snapshot);

        if (parsed?.suitId) {
          const normalized =
            normalizeWardrobeSuitId(
              parsed.suitId
            );

          await _accountSession3.run(async () => (AsyncStorage.setItem(
            AVATAR_WARDROBE_KEYS.CURRENT_SUIT,
            normalized
          )));

          return normalized;
        }
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log(
          "Wardrobe snapshot parse error:",
          error
        );
      }
    }


    // --------------------------------------------------------
    // LEGACY MIGRATION
    // --------------------------------------------------------

    const legacySuit =
      await _accountSession3.run(async () => (readFirstStorageValue(
        LEGACY_SUIT_KEYS
      )));

    if (legacySuit) {
      const normalized =
        normalizeWardrobeSuitId(
          legacySuit
        );

      await _accountSession3.run(async () => (AsyncStorage.setItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT,
        normalized
      )));

      return normalized;
    }


    return "default";

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Get current avatar suit error:",
      error
    );

    return "default";
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// GET CURRENT AVATAR SUIT LEVEL
// ============================================================

export async function getCurrentAvatarSuitLevel() {
  const _accountSession4 = captureAccountSession();
  const AsyncStorage = _accountSession4.storage;

  try {
    _accountSession4.assertCurrent();

  try {
    const storedLevel =
      await _accountSession4.run(async () => (AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL
      )));

    if (storedLevel !== null) {
      const parsed =
        Number(storedLevel);

      if (
        Number.isFinite(parsed) &&
        parsed >= 0
      ) {
        return parsed;
      }
    }


    // --------------------------------------------------------
    // LEGACY LEVEL
    // --------------------------------------------------------

    const legacyLevel =
      await _accountSession4.run(async () => (readFirstStorageValue(
        LEGACY_LEVEL_KEYS
      )));

    if (legacyLevel !== null) {
      const parsed =
        Number(legacyLevel);

      if (
        Number.isFinite(parsed) &&
        parsed >= 0
      ) {
        await _accountSession4.run(async () => (AsyncStorage.setItem(
          AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
          String(parsed)
        )));

        return parsed;
      }
    }


    // --------------------------------------------------------
    // DERIVE LEVEL FROM CURRENT SUIT
    // --------------------------------------------------------

    const suit =
      await _accountSession4.run(async () => (getCurrentAvatarSuit()));

    const level =
      getSuitLevelForId(
        suit
      );

    await _accountSession4.run(async () => (AsyncStorage.setItem(
      AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
      String(level)
    )));

    return level;

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Get current avatar suit level error:",
      error
    );

    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// SET CURRENT AVATAR SUIT
// ============================================================
//
// Main equip function.
//
// Example:
//
// await setCurrentAvatarSuit("blue");
//
// ============================================================

export async function setCurrentAvatarSuit(
  suitId,
  suitLevel = null
) {
  const _accountSession5 = captureAccountSession();
  const AsyncStorage = _accountSession5.storage;

  try {
    _accountSession5.assertCurrent();

  try {
    const normalizedSuit =
      normalizeWardrobeSuitId(
        suitId
      );

    const resolvedLevel =
      suitLevel !== null &&
      suitLevel !== undefined
        ? Math.max(
            0,
            Number(suitLevel) || 0
          )
        : getSuitLevelForId(
            normalizedSuit
          );


    await _accountSession5.run(async () => (AsyncStorage.multiSet([
      [
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT,
        normalizedSuit,
      ],

      [
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
        String(resolvedLevel),
      ],

      // ------------------------------------------------------
      // LEGACY COMPATIBILITY
      // ------------------------------------------------------

      [
        "equippedSuit",
        normalizedSuit,
      ],

      [
        "currentAvatarSuit",
        normalizedSuit,
      ],

      [
        "equippedTracksuit",
        normalizedSuit,
      ],

      [
        "currentAvatarSuitLevel",
        String(resolvedLevel),
      ],
    ])));


    await _accountSession5.run(async () => (saveWardrobeSnapshot(
      normalizedSuit,
      resolvedLevel
    )));


    return {
      success: true,

      suitId:
        normalizedSuit,

      suitLevel:
        resolvedLevel,
    };

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Set current avatar suit error:",
      error
    );

    return {
      success: false,

      suitId:
        "default",

      suitLevel: 0,

      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// SET CURRENT AVATAR SUIT LEVEL
// ============================================================

export async function setCurrentAvatarSuitLevel(
  suitLevel
) {
  const _accountSession6 = captureAccountSession();
  const AsyncStorage = _accountSession6.storage;

  try {
    _accountSession6.assertCurrent();

  try {
    const level =
      Math.max(
        0,
        Number(suitLevel) || 0
      );


    await _accountSession6.run(async () => (AsyncStorage.multiSet([
      [
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
        String(level),
      ],

      [
        "currentAvatarSuitLevel",
        String(level),
      ],
    ])));


    const currentSuit =
      await _accountSession6.run(async () => (getCurrentAvatarSuit()));


    await _accountSession6.run(async () => (saveWardrobeSnapshot(
      currentSuit,
      level
    )));


    return level;

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Set current avatar suit level error:",
      error
    );

    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// EQUIP AVATAR SUIT
// ============================================================
//
// Alias used by screens.
//
// ============================================================

export async function equipAvatarSuit(
  suitId,
  suitLevel = null
) {
  return setCurrentAvatarSuit(
    suitId,
    suitLevel
  );
}


// ============================================================
// EQUIP TRACKSUIT
// ============================================================
//
// Additional compatibility alias.
//
// ============================================================

export async function equipTracksuit(
  suitId,
  suitLevel = null
) {
  return setCurrentAvatarSuit(
    suitId,
    suitLevel
  );
}


// ============================================================
// UNEQUIP AVATAR SUIT
// ============================================================

export async function unequipAvatarSuit() {
  return setCurrentAvatarSuit(
    "default",
    0
  );
}


// ============================================================
// RESET AVATAR SUIT
// ============================================================

export async function resetAvatarSuit() {
  return unequipAvatarSuit();
}


// ============================================================
// GET COMPLETE WARDROBE STATE
// ============================================================

export async function getAvatarWardrobeState() {
  const _accountSession7 = captureAccountSession();

  try {
    _accountSession7.assertCurrent();

  try {
    const [
      suitId,
      suitLevel,
    ] =
      await _accountSession7.run(async () => (Promise.all([
        getCurrentAvatarSuit(),
        getCurrentAvatarSuitLevel(),
      ])));


    return {
      suitId,
      suitLevel,

      isWearingTracksuit:
        suitId !== "default",

      isEliteSuit:
        suitId === "elite",
    };

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Get avatar wardrobe state error:",
      error
    );

    return {
      suitId:
        "default",

      suitLevel: 0,

      isWearingTracksuit:
        false,

      isEliteSuit:
        false,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// MIGRATE OLD WARDROBE STORAGE
// ============================================================

export async function migrateAvatarWardrobeStorage() {
  const _accountSession8 = captureAccountSession();

  try {
    _accountSession8.assertCurrent();

  try {
    const suitId =
      await _accountSession8.run(async () => (getCurrentAvatarSuit()));

    const suitLevel =
      await _accountSession8.run(async () => (getCurrentAvatarSuitLevel()));


    await _accountSession8.run(async () => (setCurrentAvatarSuit(
      suitId,
      suitLevel
    )));


    return {
      success: true,
      suitId,
      suitLevel,
    };

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Avatar wardrobe migration error:",
      error
    );

    return {
      success: false,
      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// CLEAR WARDROBE
// ============================================================
//
// Does NOT delete unlocked tracksuit progression.
//
// It only returns the avatar to the normal outfit.
//
// ============================================================

export async function clearAvatarWardrobe() {
  const _accountSession9 = captureAccountSession();

  try {
    _accountSession9.assertCurrent();

  try {
    await _accountSession9.run(async () => (setCurrentAvatarSuit(
      "default",
      0
    )));

    return true;

  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Clear avatar wardrobe error:",
      error
    );

    return false;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}
// ============================================================
// REWARDS SCREEN COMPATIBILITY
// ============================================================
//
// RewardsScreen still uses these older function names.
//
// This compatibility layer allows RewardsScreen to work with
// the NEW Legathon wardrobe system without creating a second
// tracksuit progression database.
//
// IMPORTANT:
// Journey Lifetime Steps are supplied by the central
// stepTrackingEngine.
//
// Marathon steps are NOT added here.
//
// ============================================================


// ============================================================
// TRACKSUIT LEVELS — COMPATIBILITY ARRAY
// ============================================================

export const TRACKSUIT_LEVELS = Object.freeze([
  {
    id: "default",
    level: 0,
    name: "Standard",
    unlockSteps: 0,
    elite: false,
  },

  {
    id: "blue",
    level: 1,
    name: "Blue",
    unlockSteps: 150000,
    elite: false,
  },

  {
    id: "green",
    level: 2,
    name: "Green",
    unlockSteps: 400000,
    elite: false,
  },

  {
    id: "red",
    level: 3,
    name: "Red",
    unlockSteps: 750000,
    elite: false,
  },

  {
    id: "yellow",
    level: 4,
    name: "Yellow",
    unlockSteps: 1250000,
    elite: false,
  },

  {
    id: "elite",
    level: 5,
    name: "Black & Gold Elite",
    unlockSteps: 4250000,
    elite: true,
  },
]);


// ============================================================
// SAFE STEPS
// ============================================================

function safeProgressSteps(
  value
) {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return 0;
  }

  return Math.floor(
    parsed
  );
}


// ============================================================
// GET TRACKSUIT PROGRESSION
// ============================================================
//
// Compatibility function used by RewardsScreen.
//
// It CALCULATES progression.
//
// It does NOT independently count steps.
//
// ============================================================

export function getTracksuitProgression(
  lifetimeSteps
) {
  const steps =
    safeProgressSteps(
      lifetimeSteps
    );


  const unlocked =
    TRACKSUIT_LEVELS.filter(
      (suit) =>
        steps >=
        suit.unlockSteps
    );


  const current =
    unlocked[
      unlocked.length - 1
    ] ||
    TRACKSUIT_LEVELS[0];


  const next =
    TRACKSUIT_LEVELS.find(
      (suit) =>
        suit.level >
        current.level
    ) ||
    null;


  const unlockedSuits =
    unlocked.map(
      (suit) =>
        suit.id
    );


  return {
    lifetimeSteps:
      steps,

    // --------------------------------------------------------
    // OLD REWARDS SCREEN FIELDS
    // --------------------------------------------------------

    currentSuit:
      current.id,

    currentSuitLevel:
      current.level,

    currentSuitName:
      current.name,

    unlockedSuits,

    eliteUnlocked:
      steps >= 4250000,

    nextSuit:
      next?.id ||
      null,

    nextSuitName:
      next?.name ||
      null,

    nextUnlockSteps:
      next?.unlockSteps ??
      null,

    stepsUntilNextUnlock:
      next
        ? Math.max(
            0,
            next.unlockSteps -
            steps
          )
        : 0,

    // --------------------------------------------------------
    // ADDITIONAL USEFUL FIELDS
    // --------------------------------------------------------

    allUnlocked:
      next === null,

    totalLevels:
      5,

    progressPercent:
      next
        ? Math.min(
            100,
            Math.max(
              0,
              Math.round(
                (
                  (
                    steps -
                    current.unlockSteps
                  ) /
                  Math.max(
                    1,
                    next.unlockSteps -
                    current.unlockSteps
                  )
                ) *
                  100
              )
            )
          )
        : 100,
  };
}


// ============================================================
// SYNC FROM JOURNEY LIFETIME STEPS
// ============================================================
//
// IMPORTANT CHANGE:
//
// The older system automatically changed the equipped suit
// whenever a walking milestone was crossed.
//
// We do NOT want that anymore.
//
// A user may unlock Green while still choosing to wear Blue.
//
// Therefore:
//
// • progression updates automatically
// • equipped outfit stays under user control
//
// ============================================================

export async function syncAvatarSuitFromLifetimeSteps(
  lifetimeSteps
) {
  const _accountSession0 = captureAccountSession();
  const AsyncStorage = _accountSession0.storage;

  try {
    _accountSession0.assertCurrent();

  try {
    const progression =
      getTracksuitProgression(
        lifetimeSteps
      );

    const previousSuit =
      await _accountSession0.run(async () => (getCurrentAvatarSuit()));

    const previousLevel =
      await _accountSession0.run(async () => (getCurrentAvatarSuitLevel()));

    const unlockedSuits =
      Array.isArray(
        progression.unlockedSuits
      )
        ? progression.unlockedSuits
        : ["default"];

    const stillUnlocked =
      unlockedSuits.includes(
        previousSuit
      );

    let currentSuit =
      previousSuit;

    let currentLevel =
      Number(previousLevel || 0);

    let suitChanged = false;

    // If lifetime steps were reset and the
    // equipped suit is no longer unlocked,
    // return the avatar to its default outfit.
    if (!stillUnlocked) {
      const resetResult =
        await _accountSession0.run(async () => (setCurrentAvatarSuit(
          "default",
          0
        )));

      currentSuit =
        resetResult?.suitId ||
        "default";

      currentLevel = 0;
      suitChanged = true;
    }

    // Repair the old unlocked list so a suit
    // cannot remain listed as unlocked after
    // the qualifying steps have been reset.
    const earnedTracksuits =
      unlockedSuits.filter(
        (suitId) =>
          {
  

return (suitId !== "default");
}
      );

    await _accountSession0.run(async () => (AsyncStorage.setItem(
      "unlockedTracksuits",
      JSON.stringify(
        earnedTracksuits
      )
    )));

    return {
      saved: true,

      suitChanged,

      levelIncreased:
        progression.currentSuitLevel >
        Number(previousLevel || 0),

      previousSuit,

      currentSuit,

      previousLevel:
        Number(previousLevel || 0),

      currentLevel,

      progression,

      wardrobe: {
        suitId: currentSuit,
        suitLevel: currentLevel,
      },
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(
      "Sync tracksuit progression error:",
      error
    );

    return {
      saved: false,

      suitChanged: false,

      levelIncreased: false,

      progression:
        getTracksuitProgression(
          lifetimeSteps
        ),

      error,
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}
// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getCurrentAvatarSuit,
  getCurrentAvatarSuitLevel,

  setCurrentAvatarSuit,
  setCurrentAvatarSuitLevel,

  equipAvatarSuit,
  equipTracksuit,

  unequipAvatarSuit,
  resetAvatarSuit,

  getAvatarWardrobeState,
  migrateAvatarWardrobeStorage,
  clearAvatarWardrobe,

  getSuitLevelForId,
  isValidAvatarSuit,
  normalizeWardrobeSuitId,

  TRACKSUIT_LEVELS,
  getTracksuitProgression,
  syncAvatarSuitFromLifetimeSteps,
};