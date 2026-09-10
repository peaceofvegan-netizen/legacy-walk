// data/avatarAssetRegistry.js

// ============================================================
// LEGATHON WALK — COMPLETE AVATAR ASSET REGISTRY
// ============================================================
//
// NORMAL AVATARS
// ------------------------------------------------------------
// assets/avatars/
//   Black/
//   Caucasian/
//   Spanish/
//   Asian/
//
// REWARD TRACKSUITS
// ------------------------------------------------------------
// assets/avatars/Rewardtracksuits/
//   blue/
//   green/
//   red/
//   yellow/
//   Elite/
//
// Each tracksuit:
//   Race
//     female
//       young
//       middle
//       senior
//     male
//       young
//       middle
//       senior
//
// Tracksuit race folders:
//   Asian
//   Black
//   Caucasian
//   Hispanic
//
// ============================================================


// ============================================================
// SUIT IDS
// ============================================================

export const AVATAR_SUIT_IDS = Object.freeze({
  DEFAULT: "default",
  BLUE: "blue",
  GREEN: "green",
  RED: "red",
  YELLOW: "yellow",
  ELITE: "elite",
});


// ============================================================
// NORMAL AVATARS
// ============================================================
//
// We register BOTH:
//
// youngBlackMale
//
// and:
//
// youngblackmale_default
//
// so old and new screens remain compatible.
//
// ============================================================

const NORMAL_AVATARS = {

  // ----------------------------------------------------------
  // BLACK — MALE
  // ----------------------------------------------------------

  youngBlackMale:
    require("../assets/avatars/Black/male/youngblackmale.png"),

  middleBlackMale:
    require("../assets/avatars/Black/male/middleblackmale.png"),

  seniorBlackMale:
    require("../assets/avatars/Black/male/seniorblackmale.png"),


  // ----------------------------------------------------------
  // BLACK — FEMALE
  // ----------------------------------------------------------

  youngBlackFemale:
    require("../assets/avatars/Black/female/youngblackfemale.png"),

  middleBlackFemale:
    require("../assets/avatars/Black/female/middleblackfemale.png"),

  seniorBlackFemale:
    require("../assets/avatars/Black/female/seniorblackfemale.png"),


  // ----------------------------------------------------------
  // CAUCASIAN / WHITE — MALE
  // ----------------------------------------------------------

  youngWhiteMale:
    require("../assets/avatars/Caucasian/male/youngwhitemale.png"),

  middleWhiteMale:
    require("../assets/avatars/Caucasian/male/middlewhitemale.png"),

  seniorWhiteMale:
    require("../assets/avatars/Caucasian/male/seniorwhitemale.png"),


  // ----------------------------------------------------------
  // CAUCASIAN / WHITE — FEMALE
  // ----------------------------------------------------------

  youngWhiteFemale:
    require("../assets/avatars/Caucasian/female/youngwhitefemale.png"),

  middleWhiteFemale:
    require("../assets/avatars/Caucasian/female/middlewhitefemale.png"),

  seniorWhiteFemale:
    require("../assets/avatars/Caucasian/female/seniorwhitefemale.png"),


  // ----------------------------------------------------------
  // HISPANIC / SPANISH — MALE
  // ----------------------------------------------------------

  youngHispanicMale:
    require("../assets/avatars/Spanish/male/younghispanicmale.png"),

  middleHispanicMale:
    require("../assets/avatars/Spanish/male/middlehispanicmale.png"),

  seniorHispanicMale:
    require("../assets/avatars/Spanish/male/seniorhispanicmale.png"),


  // ----------------------------------------------------------
  // HISPANIC / SPANISH — FEMALE
  // ----------------------------------------------------------

  youngHispanicFemale:
    require("../assets/avatars/Spanish/female/younghispanicfemale.png"),

  middleHispanicFemale:
    require("../assets/avatars/Spanish/female/middlehispanicfemale.png"),

  seniorHispanicFemale:
    require("../assets/avatars/Spanish/female/seniorhispanicfemale.png"),


  // ----------------------------------------------------------
  // ASIAN — MALE
  // ----------------------------------------------------------

  youngAsianMale:
    require("../assets/avatars/Asian/male/youngasianmale.png"),

  middleAsianMale:
    require("../assets/avatars/Asian/male/middleasianmale.png"),

  seniorAsianMale:
    require("../assets/avatars/Asian/male/seniorasianmale.png"),


  // ----------------------------------------------------------
  // ASIAN — FEMALE
  // ----------------------------------------------------------

  youngAsianFemale:
    require("../assets/avatars/Asian/female/youngasianfemale.png"),

  middleAsianFemale:
    require("../assets/avatars/Asian/female/middleasianfemale.png"),

  seniorAsianFemale:
    require("../assets/avatars/Asian/female/seniorasianfemale.png"),
};


// ============================================================
// NORMAL AVATAR LOOKUP
// ============================================================

const AVATAR_ASSETS = {};

Object.entries(
  NORMAL_AVATARS
).forEach(
  ([avatarId, image]) => {

    const normalizedId =
      avatarId
        .trim()
        .toLowerCase();

    AVATAR_ASSETS[
      normalizedId
    ] = image;

    AVATAR_ASSETS[
      `${normalizedId}_default`
    ] = image;
  }
);


// ============================================================
// BLUE TRACKSUIT
// ============================================================

const BLUE = {

  asian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/female/youngasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/female/middleasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/female/seniorasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/male/youngasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/male/middleasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Asian/male/seniorasianmale.png"),
    },
  },


  black: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Black/female/youngblackfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Black/female/middleblackfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Black/female/seniorblackfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Black/male/youngblackmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Black/male/middleblackmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Black/male/seniorblackmale.png"),
    },
  },


  caucasian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/female/youngcaucasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/female/middlecaucasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/female/seniorcaucasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/male/youngcaucasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/male/middlecaucasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Caucasian/male/seniorcaucasianmale.png"),
    },
  },


  hispanic: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/female/younghispanicfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/female/middlehispanicfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/female/seniorhispanicfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/male/younghispanicmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/male/middlehispanicmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/blue/Hispanic/male/seniorhispanicmale.png"),
    },
  },
};


// ============================================================
// GREEN TRACKSUIT
// ============================================================

const GREEN = {

  asian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Asian/female/youngasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Asian/female/middleasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Asian/female/seniorasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Asian/male/youngasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Asian/male/middleasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Asian/male/seniorasianmale.png"),
    },
  },


  black: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Black/female/youngblackfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Black/female/middleblackfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Black/female/seniorblackfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Black/male/youngblackmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Black/male/middleblackmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Black/male/seniorblackmale.png"),
    },
  },


  caucasian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/female/youngcaucasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/female/middlecaucasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/female/seniorcaucasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/male/youngcaucasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/male/middlecaucasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Caucasian/male/seniorcaucasianmale.png"),
    },
  },


  hispanic: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/female/younghispanicfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/female/middlehispanicfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/female/seniorhispanicfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/male/younghispanicmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/male/middlehispanicmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/green/Hispanic/male/seniorhispanicmale.png"),
    },
  },
};


// ============================================================
// RED TRACKSUIT
// ============================================================

const RED = {

  asian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Asian/female/youngasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Asian/female/middleasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Asian/female/seniorasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Asian/male/youngasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Asian/male/middleasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Asian/male/seniorasianmale.png"),
    },
  },


  black: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Black/female/youngblackfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Black/female/middleblackfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Black/female/seniorblackfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Black/male/youngblackmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Black/male/middleblackmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Black/male/seniorblackmale.png"),
    },
  },


  caucasian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/female/youngcaucasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/female/middlecaucasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/female/seniorcaucasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/male/youngcaucasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/male/middlecaucasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Caucasian/male/seniorcaucasianmale.png"),
    },
  },


  hispanic: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/female/younghispanicfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/female/middlehispanicfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/female/seniorhispanicfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/male/younghispanicmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/male/middlehispanicmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/red/Hispanic/male/seniorhispanicmale.png"),
    },
  },
};


// ============================================================
// YELLOW TRACKSUIT
// ============================================================

const YELLOW = {

  asian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/female/youngasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/female/middleasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/female/seniorasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/male/youngasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/male/middleasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Asian/male/seniorasianmale.png"),
    },
  },


  black: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/female/youngblackfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/female/middleblackfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/female/seniorblackfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/male/youngblackmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/male/middleblackmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Black/male/seniorblackmale.png"),
    },
  },


  caucasian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/female/youngcaucasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/female/middlecaucasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/female/seniorcaucasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/male/youngcaucasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/male/middlecaucasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Caucasian/male/seniorcaucasianmale.png"),
    },
  },


  hispanic: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/female/younghispanicfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/female/middlehispanicfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/female/seniorhispanicfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/male/younghispanicmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/male/middlehispanicmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/yellow/Hispanic/male/seniorhispanicmale.png"),
    },
  },
};


// ============================================================
// ELITE — BLACK & GOLD
// ============================================================
//
// IMPORTANT:
// Actual folder name is capitalized:
//
// Rewardtracksuits/Elite/
//
// ============================================================

const ELITE = {

  asian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/female/youngasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/female/middleasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/female/seniorasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/male/youngasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/male/middleasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Asian/male/seniorasianmale.png"),
    },
  },


  black: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/female/youngblackfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/female/middleblackfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/female/seniorblackfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/male/youngblackmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/male/middleblackmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Black/male/seniorblackmale.png"),
    },
  },


  caucasian: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/female/youngcaucasianfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/female/middlecaucasianfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/female/seniorcaucasianfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/male/youngcaucasianmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/male/middlecaucasianmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Caucasian/male/seniorcaucasianmale.png"),
    },
  },


  hispanic: {

    female: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/female/younghispanicfemale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/female/middlehispanicfemale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/female/seniorhispanicfemale.png"),
    },

    male: {
      young:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/male/younghispanicmale.png"),

      middle:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/male/middlehispanicmale.png"),

      senior:
        require("../assets/avatars/Rewardtracksuits/Elite/Hispanic/male/seniorhispanicmale.png"),
    },
  },
};


// ============================================================
// COMPLETE TRACKSUIT REGISTRY
// ============================================================

export const TRACKSUIT_AVATAR_ASSETS =
  Object.freeze({
    blue: BLUE,
    green: GREEN,
    red: RED,
    yellow: YELLOW,
    elite: ELITE,
  });


// ============================================================
// NORMALIZERS
// ============================================================

function normalizeValue(
  value
) {
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
// NORMALIZE RACE
// ============================================================

export function normalizeAvatarRace(
  value
) {
  const race =
    normalizeValue(
      value
    );


  if (!race) {
    return "";
  }


  if (
    race.includes(
      "asian"
    )
  ) {
    return "asian";
  }


  if (
    race.includes(
      "black"
    ) ||
    race.includes(
      "african"
    )
  ) {
    return "black";
  }


  if (
    race.includes(
      "white"
    ) ||
    race.includes(
      "caucasian"
    )
  ) {
    return "caucasian";
  }


  if (
    race.includes(
      "hispanic"
    ) ||
    race.includes(
      "spanish"
    ) ||
    race.includes(
      "latino"
    ) ||
    race.includes(
      "latina"
    )
  ) {
    return "hispanic";
  }


  return race;
}


// ============================================================
// NORMALIZE GENDER
// ============================================================

export function normalizeAvatarGender(
  value
) {
  const gender =
    normalizeValue(
      value
    );


  if (
    gender ===
      "female" ||
    gender ===
      "woman" ||
    gender ===
      "girl"
  ) {
    return "female";
  }


  if (
    gender ===
      "male" ||
    gender ===
      "man" ||
    gender ===
      "boy"
  ) {
    return "male";
  }


  return gender;
}


// ============================================================
// NORMALIZE AGE
// ============================================================

export function normalizeAvatarAge(
  value
) {
  const age =
    normalizeValue(
      value
    );


  if (
    age.includes(
      "young"
    ) ||
    age === "youth"
  ) {
    return "young";
  }


  if (
    age.includes(
      "middle"
    ) ||
    age === "adult"
  ) {
    return "middle";
  }


  if (
    age.includes(
      "senior"
    ) ||
    age === "older" ||
    age === "elder"
  ) {
    return "senior";
  }


  return age;
}


// ============================================================
// NORMALIZE SUIT
// ============================================================

export function normalizeAvatarSuitId(
  value
) {
  const suit =
    normalizeValue(
      value
    );


  if (
    !suit ||
    suit === "default" ||
    suit === "none" ||
    suit === "normal" ||
    suit === "base"
  ) {
    return "default";
  }


  if (
    suit.includes(
      "blue"
    )
  ) {
    return "blue";
  }


  if (
    suit.includes(
      "green"
    )
  ) {
    return "green";
  }


  if (
    suit.includes(
      "red"
    )
  ) {
    return "red";
  }


  if (
    suit.includes(
      "yellow"
    )
  ) {
    return "yellow";
  }


  if (
    suit.includes(
      "elite"
    ) ||
    suit.includes(
      "blackgold"
    ) ||
    suit.includes(
      "black-gold"
    ) ||
    suit.includes(
      "black_gold"
    ) ||
    suit.includes(
      "black & gold"
    ) ||
    suit.includes(
      "black and gold"
    )
  ) {
    return "elite";
  }


  return suit;
}


// ============================================================
// GET NORMAL AVATAR ASSET
// ============================================================

export function getAvatarAsset(
  assetKey
) {
  if (!assetKey) {
    return null;
  }


  const normalized =
    String(assetKey)
      .trim()
      .toLowerCase();


  return (
    AVATAR_ASSETS[
      normalized
    ] || null
  );
}


// ============================================================
// HAS NORMAL AVATAR ASSET
// ============================================================

export function hasAvatarAsset(
  assetKey
) {
  return Boolean(
    getAvatarAsset(
      assetKey
    )
  );
}


// ============================================================
// GET TRACKSUIT AVATAR ASSET
// ============================================================
//
// Example:
//
// getTracksuitAvatarAsset({
//   race: "Hispanic",
//   gender: "male",
//   age: "young",
//   suitId: "blue",
// });
//
// ============================================================

export function getTracksuitAvatarAsset({
  race,
  group,
  ethnicity,

  gender,

  age,
  ageGroup,

  suitId,
  suit,
} = {}) {

  try {

    const resolvedRace =
      normalizeAvatarRace(
        race ||
        group ||
        ethnicity
      );


    const resolvedGender =
      normalizeAvatarGender(
        gender
      );


    const resolvedAge =
      normalizeAvatarAge(
        age ||
        ageGroup
      );


    const resolvedSuit =
      normalizeAvatarSuitId(
        suitId ||
        suit
      );


    if (
      !resolvedRace ||
      !resolvedGender ||
      !resolvedAge ||
      !resolvedSuit ||
      resolvedSuit ===
        "default"
    ) {
      return null;
    }


    const suitRegistry =
      TRACKSUIT_AVATAR_ASSETS[
        resolvedSuit
      ];


    if (!suitRegistry) {
      return null;
    }


    const raceRegistry =
      suitRegistry[
        resolvedRace
      ];


    if (!raceRegistry) {
      return null;
    }


    const genderRegistry =
      raceRegistry[
        resolvedGender
      ];


    if (!genderRegistry) {
      return null;
    }


    return (
      genderRegistry[
        resolvedAge
      ] || null
    );

  } catch (error) {

    console.log(
      "Get tracksuit avatar asset error:",
      error
    );

    return null;
  }
}


// ============================================================
// HAS TRACKSUIT AVATAR ASSET
// ============================================================

export function hasTracksuitAvatarAsset(
  options
) {
  return Boolean(
    getTracksuitAvatarAsset(
      options
    )
  );
}


// ============================================================
// GET COMPLETE TRACKSUIT LOOKUP KEY
// ============================================================

export function buildTracksuitAssetKey({
  suitId,
  race,
  gender,
  age,
} = {}) {

  const resolvedSuit =
    normalizeAvatarSuitId(
      suitId
    );

  const resolvedRace =
    normalizeAvatarRace(
      race
    );

  const resolvedGender =
    normalizeAvatarGender(
      gender
    );

  const resolvedAge =
    normalizeAvatarAge(
      age
    );


  if (
    !resolvedSuit ||
    resolvedSuit ===
      "default" ||
    !resolvedRace ||
    !resolvedGender ||
    !resolvedAge
  ) {
    return null;
  }


  return [
    "tracksuit",
    resolvedSuit,
    resolvedRace,
    resolvedGender,
    resolvedAge,
  ].join("_");
}


// ============================================================
// DEBUG / VALIDATION HELPER
// ============================================================

export function getTracksuitAssetInfo(
  options = {}
) {

  const suitId =
    normalizeAvatarSuitId(
      options.suitId ||
      options.suit
    );

  const race =
    normalizeAvatarRace(
      options.race ||
      options.group ||
      options.ethnicity
    );

  const gender =
    normalizeAvatarGender(
      options.gender
    );

  const age =
    normalizeAvatarAge(
      options.age ||
      options.ageGroup
    );

  const image =
    getTracksuitAvatarAsset({
      suitId,
      race,
      gender,
      age,
    });


  return {
    suitId,
    race,
    gender,
    age,

    assetKey:
      buildTracksuitAssetKey({
        suitId,
        race,
        gender,
        age,
      }),

    image,

    exists:
      Boolean(image),
  };
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AVATAR_ASSETS;