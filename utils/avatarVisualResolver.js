// utils/avatarVisualResolver.js

import {
  getCurrentAvatarSuit,
  getCurrentAvatarSuitLevel,
} from "./avatarWardrobeStorage";

import {
  getAvatarAsset,
  getTracksuitAvatarAsset,
  normalizeAvatarRace,
  normalizeAvatarGender,
  normalizeAvatarAge,
  normalizeAvatarSuitId,
  buildTracksuitAssetKey,
} from "../data/avatarAssetRegistry";


// ============================================================
// LEGATHON WALK — AVATAR VISUAL RESOLVER
// ============================================================
//
// PURPOSE
// ------------------------------------------------------------
//
// Converts:
//
// avatarId
// +
// equipped tracksuit
//
// into the correct full-body avatar PNG.
//
// Examples:
//
// youngBlackMale + blue
// middleWhiteFemale + green
// seniorHispanicMale + yellow
// youngAsianFemale + elite
//
// Supports:
//
// • Normal/default avatar
// • Blue tracksuit
// • Green tracksuit
// • Red tracksuit
// • Yellow tracksuit
// • Elite tracksuit
//
// Safe fallback:
// If a tracksuit asset cannot be found, the user's normal
// avatar remains visible.
//
// ============================================================


// ============================================================
// NORMALIZE VALUE
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
// COMPACT AVATAR ID
// ============================================================
//
// Removes:
// spaces
// underscores
// hyphens
// punctuation
//
// young_Asian_Male
// young-asian-male
// Young Asian Male
//
// all become:
//
// youngasianmale
//
// ============================================================

function compactAvatarId(
  avatarId
) {
  return normalizeId(
    avatarId
  ).replace(
    /[^a-z0-9]/g,
    ""
  );
}


// ============================================================
// PARSE AVATAR IDENTITY
// ============================================================
//
// Avatar IDs currently use patterns like:
//
// youngBlackMale
// middleBlackFemale
//
// youngWhiteMale
// seniorWhiteFemale
//
// youngHispanicMale
// middleHispanicFemale
//
// youngAsianMale
// seniorAsianFemale
//
// ============================================================

export function parseAvatarIdentity(
  avatarId
) {
  const compact =
    compactAvatarId(
      avatarId
    );

  if (!compact) {
    return null;
  }


  // ----------------------------------------------------------
  // AGE
  // ----------------------------------------------------------

  let age = null;

  if (
    compact.includes(
      "young"
    )
  ) {
    age = "young";
  } else if (
    compact.includes(
      "middle"
    )
  ) {
    age = "middle";
  } else if (
    compact.includes(
      "senior"
    )
  ) {
    age = "senior";
  }


  // ----------------------------------------------------------
  // GENDER
  // ----------------------------------------------------------

  let gender = null;

  if (
    compact.includes(
      "female"
    )
  ) {
    gender = "female";
  } else if (
    compact.includes(
      "male"
    )
  ) {
    gender = "male";
  }


  // ----------------------------------------------------------
  // RACE
  // ----------------------------------------------------------

  let race = null;

  if (
    compact.includes(
      "asian"
    )
  ) {
    race = "asian";
  } else if (
    compact.includes(
      "black"
    )
  ) {
    race = "black";
  } else if (
    compact.includes(
      "white"
    ) ||
    compact.includes(
      "caucasian"
    )
  ) {
    race = "caucasian";
  } else if (
    compact.includes(
      "hispanic"
    ) ||
    compact.includes(
      "spanish"
    ) ||
    compact.includes(
      "latino"
    ) ||
    compact.includes(
      "latina"
    )
  ) {
    race = "hispanic";
  }


  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  if (
    !age ||
    !gender ||
    !race
  ) {
    return null;
  }


  return {
    race:
      normalizeAvatarRace(
        race
      ),

    gender:
      normalizeAvatarGender(
        gender
      ),

    age:
      normalizeAvatarAge(
        age
      ),
  };
}


// ============================================================
// BUILD LEGACY / DEFAULT ASSET KEY
// ============================================================
//
// Compatibility helper.
//
// Example:
//
// youngBlackMale
//
// becomes:
//
// youngblackmale_default
//
// ============================================================

export function buildAvatarAssetKey(
  avatarId,
  suitId = "default"
) {
  const normalizedAvatarId =
    normalizeId(
      avatarId
    );

  const normalizedSuitId =
    normalizeAvatarSuitId(
      suitId
    );


  if (
    !normalizedAvatarId
  ) {
    return null;
  }


  if (
    !normalizedSuitId ||
    normalizedSuitId ===
      "default"
  ) {
    return `${normalizedAvatarId}_default`;
  }


  return `${normalizedAvatarId}_${normalizedSuitId}`;
}


// ============================================================
// RESOLVE NORMAL / DEFAULT AVATAR
// ============================================================

function resolveDefaultAvatarImage(
  avatarId
) {
  const normalizedAvatarId =
    normalizeId(
      avatarId
    );


  if (!normalizedAvatarId) {
    return {
      assetKey: null,
      image: null,
    };
  }


  // ----------------------------------------------------------
  // FIRST TRY DEFAULT KEY
  // ----------------------------------------------------------

  const defaultAssetKey =
    buildAvatarAssetKey(
      normalizedAvatarId,
      "default"
    );


  let image =
    getAvatarAsset(
      defaultAssetKey
    );


  // ----------------------------------------------------------
  // COMPATIBILITY:
  // TRY AVATAR ID DIRECTLY
  // ----------------------------------------------------------

  if (!image) {
    image =
      getAvatarAsset(
        normalizedAvatarId
      );
  }


  return {
    assetKey:
      defaultAssetKey,

    image:
      image || null,
  };
}


// ============================================================
// RESOLVE TRACKSUIT IMAGE
// ============================================================

export function resolveTracksuitImage({
  avatarId,
  suitId,
} = {}) {

  try {

    const identity =
      parseAvatarIdentity(
        avatarId
      );


    if (!identity) {
      return null;
    }


    const normalizedSuit =
      normalizeAvatarSuitId(
        suitId
      );


    if (
      !normalizedSuit ||
      normalizedSuit ===
        "default"
    ) {
      return null;
    }


    return (
      getTracksuitAvatarAsset({
        race:
          identity.race,

        gender:
          identity.gender,

        age:
          identity.age,

        suitId:
          normalizedSuit,
      }) || null
    );

  } catch (error) {

    console.log(
      "Resolve tracksuit image error:",
      error
    );

    return null;
  }
}


// ============================================================
// GET TRACKSUIT VISUAL
// ============================================================
//
// Useful for screens that want to preview a specific suit.
//
// Does NOT change the currently equipped suit.
//
// ============================================================

export function getTracksuitVisual({
  avatarId,
  suitId,
} = {}) {

  const normalizedAvatarId =
    normalizeId(
      avatarId
    );


  const normalizedSuitId =
    normalizeAvatarSuitId(
      suitId
    );


  const identity =
    parseAvatarIdentity(
      normalizedAvatarId
    );


  const image =
    resolveTracksuitImage({
      avatarId:
        normalizedAvatarId,

      suitId:
        normalizedSuitId,
    });


  const assetKey =
    identity
      ? buildTracksuitAssetKey({
          suitId:
            normalizedSuitId,

          race:
            identity.race,

          gender:
            identity.gender,

          age:
            identity.age,
        })
      : null;


  return {
    avatarId:
      normalizedAvatarId ||
      null,

    suitId:
      normalizedSuitId ||
      "default",

    assetKey,

    image,

    identity,

    found:
      Boolean(image),
  };
}


// ============================================================
// GET CURRENT AVATAR VISUAL
// ============================================================
//
// MAIN FUNCTION USED THROUGHOUT THE APP.
//
// Reads:
// • current equipped suit
// • current suit level
//
// Then resolves:
// avatarId
// ↓
// age/race/gender
// ↓
// equipped tracksuit
// ↓
// matching full-body PNG
//
// ============================================================

export async function getCurrentAvatarVisual(
  avatarId
) {

  const normalizedAvatarId =
    normalizeId(
      avatarId
    );


  // ----------------------------------------------------------
  // INVALID AVATAR
  // ----------------------------------------------------------

  if (!normalizedAvatarId) {
    return {
      avatarId: null,

      suitId:
        "default",

      suitLevel: 0,

      assetKey: null,

      image: null,

      fallbackUsed: false,

      fallbackAssetKey:
        null,

      identity: null,
    };
  }


  try {

    // --------------------------------------------------------
    // CURRENT WARDROBE
    // --------------------------------------------------------

    const [
      currentSuit,
      currentSuitLevel,
    ] =
      await Promise.all([
        getCurrentAvatarSuit(),
        getCurrentAvatarSuitLevel(),
      ]);


    const suitId =
      normalizeAvatarSuitId(
        currentSuit
      );


    const suitLevel =
      Number(
        currentSuitLevel ?? 0
      );


    const identity =
      parseAvatarIdentity(
        normalizedAvatarId
      );


    // --------------------------------------------------------
    // NORMAL AVATAR FALLBACK
    // --------------------------------------------------------

    const defaultVisual =
      resolveDefaultAvatarImage(
        normalizedAvatarId
      );


    // --------------------------------------------------------
    // NO TRACKSUIT EQUIPPED
    // --------------------------------------------------------

    if (
      !suitId ||
      suitId ===
        "default"
    ) {
      return {
        avatarId:
          normalizedAvatarId,

        suitId:
          "default",

        suitLevel,

        assetKey:
          defaultVisual.assetKey,

        image:
          defaultVisual.image,

        fallbackUsed: false,

        fallbackAssetKey:
          null,

        identity,
      };
    }


    // --------------------------------------------------------
    // TRACKSUIT EQUIPPED
    // --------------------------------------------------------

    const tracksuitImage =
      resolveTracksuitImage({
        avatarId:
          normalizedAvatarId,

        suitId,
      });


    // --------------------------------------------------------
    // TRACKSUIT FOUND
    // --------------------------------------------------------

    if (
      tracksuitImage
    ) {

      const tracksuitAssetKey =
        identity
          ? buildTracksuitAssetKey({
              suitId,

              race:
                identity.race,

              gender:
                identity.gender,

              age:
                identity.age,
            })
          : buildAvatarAssetKey(
              normalizedAvatarId,
              suitId
            );


      return {
        avatarId:
          normalizedAvatarId,

        suitId,

        suitLevel,

        assetKey:
          tracksuitAssetKey,

        image:
          tracksuitImage,

        fallbackUsed: false,

        fallbackAssetKey:
          null,

        identity,
      };
    }


    // --------------------------------------------------------
    // SAFE FALLBACK
    // --------------------------------------------------------
    //
    // Suit exists/equipped but matching avatar image is missing.
    //
    // Keep showing normal avatar.
    //
    // --------------------------------------------------------

    return {
      avatarId:
        normalizedAvatarId,

      suitId,

      suitLevel,

      assetKey:
        buildAvatarAssetKey(
          normalizedAvatarId,
          suitId
        ),

      image:
        defaultVisual.image,

      fallbackUsed: true,

      fallbackAssetKey:
        defaultVisual.assetKey,

      identity,
    };

  } catch (error) {

    console.log(
      "Get current avatar visual error:",
      error
    );


    const defaultVisual =
      resolveDefaultAvatarImage(
        normalizedAvatarId
      );


    return {
      avatarId:
        normalizedAvatarId ||
        null,

      suitId:
        "default",

      suitLevel: 0,

      assetKey:
        defaultVisual.assetKey,

      image:
        defaultVisual.image,

      fallbackUsed: true,

      fallbackAssetKey:
        defaultVisual.assetKey,

      identity:
        parseAvatarIdentity(
          normalizedAvatarId
        ),

      error,
    };
  }
}


// ============================================================
// GET DEFAULT AVATAR VISUAL
// ============================================================
//
// Ignores equipped tracksuit.
//
// Useful for:
// • Avatar picker
// • Reset outfit
// • Normal-avatar previews
//
// ============================================================

export function getDefaultAvatarVisual(
  avatarId
) {

  const normalizedAvatarId =
    normalizeId(
      avatarId
    );


  if (!normalizedAvatarId) {
    return {
      avatarId: null,

      suitId:
        "default",

      suitLevel: 0,

      assetKey: null,

      image: null,

      fallbackUsed: false,

      identity: null,
    };
  }


  const defaultVisual =
    resolveDefaultAvatarImage(
      normalizedAvatarId
    );


  return {
    avatarId:
      normalizedAvatarId,

    suitId:
      "default",

    suitLevel: 0,

    assetKey:
      defaultVisual.assetKey,

    image:
      defaultVisual.image,

    fallbackUsed: false,

    identity:
      parseAvatarIdentity(
        normalizedAvatarId
      ),
  };
}


// ============================================================
// GET PUBLIC AVATAR VISUAL
// ============================================================
//
// Used by:
// • Leaderboards
// • Community
// • Profile previews
// • Public-facing avatar cards
//
// ============================================================

export async function getPublicAvatarVisual(
  avatarId
) {

  const visual =
    await getCurrentAvatarVisual(
      avatarId
    );


  return {
    avatarId:
      visual.avatarId,

    suitId:
      visual.suitId,

    suitLevel:
      visual.suitLevel,

    assetKey:
      visual.assetKey,

    image:
      visual.image,

    fallbackUsed:
      Boolean(
        visual.fallbackUsed
      ),

    identity:
      visual.identity ||
      null,
  };
}


// ============================================================
// GET AVATAR IDENTITY
// ============================================================
//
// Convenience helper for other screens.
//
// ============================================================

export function getAvatarIdentity(
  avatarId
) {
  return (
    parseAvatarIdentity(
      avatarId
    ) || null
  );
}


// ============================================================
// CAN RESOLVE TRACKSUIT
// ============================================================

export function canResolveTracksuitAvatar({
  avatarId,
  suitId,
} = {}) {

  return Boolean(
    resolveTracksuitImage({
      avatarId,
      suitId,
    })
  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  parseAvatarIdentity,

  buildAvatarAssetKey,

  resolveTracksuitImage,

  getTracksuitVisual,

  getCurrentAvatarVisual,

  getDefaultAvatarVisual,

  getPublicAvatarVisual,

  getAvatarIdentity,

  canResolveTracksuitAvatar,
};