// data/avatarSuitCatalog.js

// ============================================================
// LEGATHON AVATAR SUIT CATALOG
// ============================================================
//
// 24 AVATARS
//
// Each avatar has:
//
//   default
//   suit_01
//   suit_02
//   suit_03
//   suit_04
//   suit_05
//
// Total:
//   24 avatars
//   6 appearances each
//   144 appearances
//
// IMPORTANT:
//
// This file stores metadata only.
//
// Actual React Native image require() statements belong in:
//
//   avatarAssetRegistry.js
//
// ============================================================


// ============================================================
// CONSTANTS
// ============================================================

export const TOTAL_AVATARS = 24;

export const SUITS_PER_AVATAR = 5;

export const TOTAL_LOOKS_PER_AVATAR =
  SUITS_PER_AVATAR + 1;


// ============================================================
// SUIT IDS
// ============================================================

export const AVATAR_SUIT_IDS = [
  "default",
  "suit_01",
  "suit_02",
  "suit_03",
  "suit_04",
  "suit_05",
];


// ============================================================
// HELPERS
// ============================================================

const padNumber = (value) =>
  String(value).padStart(2, "0");


const createAvatarId = (number) =>
  `avatar_${padNumber(number)}`;


const createSuit = ({
  avatarId,
  suitId,
  suitNumber,
}) => {
  const isDefault =
    suitId === "default";

  return {
    id: suitId,

    suitId,

    avatarId,

    name: isDefault
      ? "Default Suit"
      : `Reward Suit ${suitNumber}`,

    description: isDefault
      ? "Original Legathon avatar appearance."
      : `Unlockable reward suit ${suitNumber}.`,

    unlockedByDefault:
      isDefault,

    rewardOnly:
      !isDefault,

    autoEquipOnUnlock:
      !isDefault,

    rarity: isDefault
      ? "standard"
      : suitNumber === 5
        ? "legendary"
        : suitNumber >= 3
          ? "epic"
          : "rare",

    assetKey:
      `${avatarId}_${suitId}`,

    rewardSource: isDefault
      ? null
      : {
          type: "reward",

          sourceId: null,

          sourceType: null,
        },
  };
};


// ============================================================
// CREATE AVATAR
// ============================================================

const createAvatar = (
  number
) => {
  const avatarId =
    createAvatarId(number);

  return {
    id: avatarId,

    avatarId,

    number,

    name:
      `Avatar ${padNumber(
        number
      )}`,

    defaultSuitId:
      "default",

    suits: {
      default:
        createSuit({
          avatarId,

          suitId:
            "default",

          suitNumber: 0,
        }),

      suit_01:
        createSuit({
          avatarId,

          suitId:
            "suit_01",

          suitNumber: 1,
        }),

      suit_02:
        createSuit({
          avatarId,

          suitId:
            "suit_02",

          suitNumber: 2,
        }),

      suit_03:
        createSuit({
          avatarId,

          suitId:
            "suit_03",

          suitNumber: 3,
        }),

      suit_04:
        createSuit({
          avatarId,

          suitId:
            "suit_04",

          suitNumber: 4,
        }),

      suit_05:
        createSuit({
          avatarId,

          suitId:
            "suit_05",

          suitNumber: 5,
        }),
    },
  };
};


// ============================================================
// ALL 24 AVATARS
// ============================================================

export const AVATAR_SUIT_CATALOG = {
  avatar_01:
    createAvatar(1),

  avatar_02:
    createAvatar(2),

  avatar_03:
    createAvatar(3),

  avatar_04:
    createAvatar(4),

  avatar_05:
    createAvatar(5),

  avatar_06:
    createAvatar(6),

  avatar_07:
    createAvatar(7),

  avatar_08:
    createAvatar(8),

  avatar_09:
    createAvatar(9),

  avatar_10:
    createAvatar(10),

  avatar_11:
    createAvatar(11),

  avatar_12:
    createAvatar(12),

  avatar_13:
    createAvatar(13),

  avatar_14:
    createAvatar(14),

  avatar_15:
    createAvatar(15),

  avatar_16:
    createAvatar(16),

  avatar_17:
    createAvatar(17),

  avatar_18:
    createAvatar(18),

  avatar_19:
    createAvatar(19),

  avatar_20:
    createAvatar(20),

  avatar_21:
    createAvatar(21),

  avatar_22:
    createAvatar(22),

  avatar_23:
    createAvatar(23),

  avatar_24:
    createAvatar(24),
};


export default
  AVATAR_SUIT_CATALOG;


// ============================================================
// NORMALIZE ID
// ============================================================

const normalizeId = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
};


// ============================================================
// GET AVATAR
// ============================================================

export function getAvatarSuitCatalog(
  avatarId
) {
  const id =
    normalizeId(
      avatarId
    );

  if (!id) {
    return null;
  }

  return (
    AVATAR_SUIT_CATALOG[
      id
    ] || null
  );
}


// ============================================================
// GET ALL AVATARS
// ============================================================

export function getAllAvatarSuitCatalogs() {
  return Object.values(
    AVATAR_SUIT_CATALOG
  );
}


// ============================================================
// GET SPECIFIC SUIT
// ============================================================

export function getAvatarSuit(
  avatarId,
  suitId
) {
  const avatar =
    getAvatarSuitCatalog(
      avatarId
    );

  if (!avatar) {
    return null;
  }

  const normalizedSuitId =
    normalizeId(
      suitId
    );

  if (!normalizedSuitId) {
    return null;
  }

  return (
    avatar.suits?.[
      normalizedSuitId
    ] || null
  );
}


// ============================================================
// GET DEFAULT SUIT
// ============================================================

export function getDefaultAvatarSuit(
  avatarId
) {
  const avatar =
    getAvatarSuitCatalog(
      avatarId
    );

  if (!avatar) {
    return null;
  }

  return (
    avatar.suits?.[
      avatar.defaultSuitId
    ] ||
    avatar.suits?.default ||
    null
  );
}


// ============================================================
// GET ALL SUITS FOR AVATAR
// ============================================================

export function getAvatarSuits(
  avatarId
) {
  const avatar =
    getAvatarSuitCatalog(
      avatarId
    );

  if (!avatar?.suits) {
    return [];
  }

  return Object.values(
    avatar.suits
  );
}


// ============================================================
// GET REWARD SUITS
// ============================================================

export function getAvatarRewardSuits(
  avatarId
) {
  return getAvatarSuits(
    avatarId
  ).filter(
    (suit) =>
      suit.rewardOnly ===
      true
  );
}


// ============================================================
// VALIDATE AVATAR
// ============================================================

export function isValidAvatarId(
  avatarId
) {
  return Boolean(
    getAvatarSuitCatalog(
      avatarId
    )
  );
}


// ============================================================
// VALIDATE SUIT
// ============================================================

export function isValidAvatarSuit(
  avatarId,
  suitId
) {
  return Boolean(
    getAvatarSuit(
      avatarId,
      suitId
    )
  );
}


// ============================================================
// RESOLVE SUIT
//
// Invalid / removed saved suit IDs safely fall back to default.
// ============================================================

export function resolveAvatarSuit(
  avatarId,
  suitId
) {
  const requested =
    getAvatarSuit(
      avatarId,
      suitId
    );

  if (requested) {
    return requested;
  }

  return getDefaultAvatarSuit(
    avatarId
  );
}


// ============================================================
// GET ASSET KEY
// ============================================================

export function getAvatarSuitAssetKey(
  avatarId,
  suitId
) {
  const suit =
    resolveAvatarSuit(
      avatarId,
      suitId
    );

  return (
    suit?.assetKey ||
    null
  );
}


// ============================================================
// UPDATE REWARD SOURCE
//
// Useful if you want to assign suits from another catalog.
//
// Example:
//
// configureAvatarSuitReward(
//   "avatar_01",
//   "suit_01",
//   {
//     sourceType: "legathon",
//     sourceId: "new_york"
//   }
// )
//
// NOTE:
// This mutates the in-memory catalog only.
// For permanent production configuration,
// define reward source in static data instead.
// ============================================================

export function configureAvatarSuitReward(
  avatarId,
  suitId,
  rewardSource
) {
  const suit =
    getAvatarSuit(
      avatarId,
      suitId
    );

  if (!suit) {
    return false;
  }

  suit.rewardSource = {
    type:
      "reward",

    sourceType:
      rewardSource
        ?.sourceType ||
      null,

    sourceId:
      rewardSource
        ?.sourceId ||
      null,
  };

  return true;
}