// utils/avatarWardrobeStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";


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
  for (const key of keys) {
    try {
      const value =
        await AsyncStorage.getItem(
          key
        );

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    } catch (error) {
      console.log(
        "Wardrobe legacy read error:",
        key,
        error
      );
    }
  }

  return null;
}


// ============================================================
// SAVE WARDROBE SNAPSHOT
// ============================================================

async function saveWardrobeSnapshot(
  suitId,
  suitLevel
) {
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

    await AsyncStorage.setItem(
      AVATAR_WARDROBE_KEYS.WARDROBE_STATE,
      JSON.stringify(state)
    );

    return state;
  } catch (error) {
    console.log(
      "Save wardrobe snapshot error:",
      error
    );

    return null;
  }
}


// ============================================================
// GET CURRENT AVATAR SUIT
// ============================================================

export async function getCurrentAvatarSuit() {
  try {
    // --------------------------------------------------------
    // NEW STORAGE
    // --------------------------------------------------------

    const storedSuit =
      await AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT
      );

    if (storedSuit) {
      return normalizeWardrobeSuitId(
        storedSuit
      );
    }


    // --------------------------------------------------------
    // SNAPSHOT FALLBACK
    // --------------------------------------------------------

    const snapshot =
      await AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.WARDROBE_STATE
      );

    if (snapshot) {
      try {
        const parsed =
          JSON.parse(snapshot);

        if (parsed?.suitId) {
          const normalized =
            normalizeWardrobeSuitId(
              parsed.suitId
            );

          await AsyncStorage.setItem(
            AVATAR_WARDROBE_KEYS.CURRENT_SUIT,
            normalized
          );

          return normalized;
        }
      } catch (error) {
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
      await readFirstStorageValue(
        LEGACY_SUIT_KEYS
      );

    if (legacySuit) {
      const normalized =
        normalizeWardrobeSuitId(
          legacySuit
        );

      await AsyncStorage.setItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT,
        normalized
      );

      return normalized;
    }


    return "default";

  } catch (error) {
    console.log(
      "Get current avatar suit error:",
      error
    );

    return "default";
  }
}


// ============================================================
// GET CURRENT AVATAR SUIT LEVEL
// ============================================================

export async function getCurrentAvatarSuitLevel() {
  try {
    const storedLevel =
      await AsyncStorage.getItem(
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL
      );

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
      await readFirstStorageValue(
        LEGACY_LEVEL_KEYS
      );

    if (legacyLevel !== null) {
      const parsed =
        Number(legacyLevel);

      if (
        Number.isFinite(parsed) &&
        parsed >= 0
      ) {
        await AsyncStorage.setItem(
          AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
          String(parsed)
        );

        return parsed;
      }
    }


    // --------------------------------------------------------
    // DERIVE LEVEL FROM CURRENT SUIT
    // --------------------------------------------------------

    const suit =
      await getCurrentAvatarSuit();

    const level =
      getSuitLevelForId(
        suit
      );

    await AsyncStorage.setItem(
      AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
      String(level)
    );

    return level;

  } catch (error) {
    console.log(
      "Get current avatar suit level error:",
      error
    );

    return 0;
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


    await AsyncStorage.multiSet([
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
    ]);


    await saveWardrobeSnapshot(
      normalizedSuit,
      resolvedLevel
    );


    return {
      success: true,

      suitId:
        normalizedSuit,

      suitLevel:
        resolvedLevel,
    };

  } catch (error) {
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
}


// ============================================================
// SET CURRENT AVATAR SUIT LEVEL
// ============================================================

export async function setCurrentAvatarSuitLevel(
  suitLevel
) {
  try {
    const level =
      Math.max(
        0,
        Number(suitLevel) || 0
      );


    await AsyncStorage.multiSet([
      [
        AVATAR_WARDROBE_KEYS.CURRENT_SUIT_LEVEL,
        String(level),
      ],

      [
        "currentAvatarSuitLevel",
        String(level),
      ],
    ]);


    const currentSuit =
      await getCurrentAvatarSuit();


    await saveWardrobeSnapshot(
      currentSuit,
      level
    );


    return level;

  } catch (error) {
    console.log(
      "Set current avatar suit level error:",
      error
    );

    return 0;
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
  try {
    const [
      suitId,
      suitLevel,
    ] =
      await Promise.all([
        getCurrentAvatarSuit(),
        getCurrentAvatarSuitLevel(),
      ]);


    return {
      suitId,
      suitLevel,

      isWearingTracksuit:
        suitId !== "default",

      isEliteSuit:
        suitId === "elite",
    };

  } catch (error) {
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
}


// ============================================================
// MIGRATE OLD WARDROBE STORAGE
// ============================================================

export async function migrateAvatarWardrobeStorage() {
  try {
    const suitId =
      await getCurrentAvatarSuit();

    const suitLevel =
      await getCurrentAvatarSuitLevel();


    await setCurrentAvatarSuit(
      suitId,
      suitLevel
    );


    return {
      success: true,
      suitId,
      suitLevel,
    };

  } catch (error) {
    console.log(
      "Avatar wardrobe migration error:",
      error
    );

    return {
      success: false,
      error,
    };
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
  try {
    await setCurrentAvatarSuit(
      "default",
      0
    );

    return true;

  } catch (error) {
    console.log(
      "Clear avatar wardrobe error:",
      error
    );

    return false;
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
  try {
    const progression =
      getTracksuitProgression(
        lifetimeSteps
      );


    const currentEquippedSuit =
      await getCurrentAvatarSuit();


    const currentEquippedLevel =
      await getCurrentAvatarSuitLevel();


    return {
      saved: true,

      suitChanged: false,

      levelIncreased:
        progression.currentSuitLevel >
        Number(
          currentEquippedLevel ||
          0
        ),

      previousSuit:
        currentEquippedSuit,

      currentSuit:
        currentEquippedSuit,

      previousLevel:
        Number(
          currentEquippedLevel ||
          0
        ),

      currentLevel:
        Number(
          currentEquippedLevel ||
          0
        ),

      progression,

      wardrobe: {
        suitId:
          currentEquippedSuit,

        suitLevel:
          Number(
            currentEquippedLevel ||
            0
          ),
      },
    };

  } catch (error) {

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