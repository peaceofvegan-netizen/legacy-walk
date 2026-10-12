
// ============================================================
// LEGATHON WALK
// 26 GLOBAL LEGATHONS
//
// Official challenge name: LEGATHON
// Distance per Legathon: 26.2 miles
// Steps per mile: 2,000
// Steps per Legathon: 52,400
//
// Preserves:
// - All 26 existing challenge IDs
// - Original reward amounts
// - Existing internal exports and functions
// - Legacy slugs and lookup compatibility
// - Sequential unlocking
// - WCoin rewards
// - Legathon Points
// - Avatar XP
//
// User-visible names now say LEGATHON.
// ============================================================

// ============================================================
// DISTANCE CONSTANTS
// ============================================================

// Keep these export names for existing imports.

export const STEPS_PER_MILE = 2000;

export const MARATHON_TOTAL_MILES = 26.2;

export const MARATHON_TOTAL_STEPS = Math.round(
  MARATHON_TOTAL_MILES * STEPS_PER_MILE
);

// New optional Legathon aliases.

export const LEGATHON_TOTAL_MILES =
  MARATHON_TOTAL_MILES;

export const LEGATHON_TOTAL_STEPS =
  MARATHON_TOTAL_STEPS;

// ============================================================
// FIRST 8 ORIGINAL LEGATHONS
//
// IDs, order, rewards, and legacy slugs preserved.
// ============================================================

const ORIGINAL_LEGATHONS = [
  {
    id: "nyc",
    slug: "new-york-marathon",
    title: "New York Legathon",
    shortTitle: "New York",
    city: "New York City",
    country: "United States",
    flag: "🇺🇸",

    order: 1,
    unlockedByDefault: true,
    requiredCompletedMarathons: 0,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 500,
    rewardPoints: 1000,
    avatarXP: 750,

    badge: "New York Legathon Finisher",
    passportStamp: "New York Legathon Stamp",
    certificate: "New York Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon inspired by New York City's energy, neighborhoods, bridges, and famous finish line.",
  },

  {
    id: "london",
    slug: "london-marathon",
    title: "London Legathon",
    shortTitle: "London",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",

    order: 2,
    unlockedByDefault: false,
    requiredCompletedMarathons: 1,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 600,
    rewardPoints: 1200,
    avatarXP: 850,

    badge: "London Legathon Finisher",
    passportStamp: "London Legathon Stamp",
    certificate: "London Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon through London's historic streets, riverfront, royal landmarks, and celebrated walking routes.",
  },

  {
    id: "tokyo",
    slug: "tokyo-marathon",
    title: "Tokyo Legathon",
    shortTitle: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",

    order: 3,
    unlockedByDefault: false,
    requiredCompletedMarathons: 2,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 700,
    rewardPoints: 1400,
    avatarXP: 950,

    badge: "Tokyo Legathon Finisher",
    passportStamp: "Tokyo Legathon Stamp",
    certificate: "Tokyo Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon through Tokyo's modern districts, traditional neighborhoods, city landmarks, and glowing streets.",
  },

  {
    id: "paris",
    slug: "paris-marathon",
    title: "Paris Legathon",
    shortTitle: "Paris",
    city: "Paris",
    country: "France",
    flag: "🇫🇷",

    order: 4,
    unlockedByDefault: false,
    requiredCompletedMarathons: 3,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 800,
    rewardPoints: 1600,
    avatarXP: 1050,

    badge: "Paris Legathon Finisher",
    passportStamp: "Paris Legathon Stamp",
    certificate: "Paris Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon inspired by Parisian boulevards, monuments, parks, bridges, and the River Seine.",
  },

  {
    id: "berlin",
    slug: "berlin-marathon",
    title: "Berlin Legathon",
    shortTitle: "Berlin",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",

    order: 5,
    unlockedByDefault: false,
    requiredCompletedMarathons: 4,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 900,
    rewardPoints: 1800,
    avatarXP: 1150,

    badge: "Berlin Legathon Finisher",
    passportStamp: "Berlin Legathon Stamp",
    certificate: "Berlin Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon through Berlin's historic center, modern neighborhoods, broad avenues, and Brandenburg Gate.",
  },

  {
    id: "dubai",
    slug: "dubai-marathon",
    title: "Dubai Legathon",
    shortTitle: "Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    flag: "🇦🇪",

    order: 6,
    unlockedByDefault: false,
    requiredCompletedMarathons: 5,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 1000,
    rewardPoints: 2000,
    avatarXP: 1250,

    badge: "Dubai Legathon Finisher",
    passportStamp: "Dubai Legathon Stamp",
    certificate: "Dubai Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon inspired by Dubai's coastline, modern skyline, wide roads, and world-famous architecture.",
  },

  {
    id: "boston",
    slug: "boston-marathon",
    title: "Boston Legathon",
    shortTitle: "Boston",
    city: "Boston",
    country: "United States",
    flag: "🇺🇸",

    order: 7,
    unlockedByDefault: false,
    requiredCompletedMarathons: 6,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 1200,
    rewardPoints: 2400,
    avatarXP: 1500,

    badge: "Boston Legathon Finisher",
    passportStamp: "Boston Legathon Stamp",
    certificate: "Boston Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon inspired by Boston's historic neighborhoods, famous running heritage, and landmark streets.",
  },

  {
    id: "athens",
    slug: "athens-marathon",
    title: "Athens Legathon",
    shortTitle: "Athens",
    city: "Athens",
    country: "Greece",
    flag: "🇬🇷",

    order: 8,
    unlockedByDefault: false,
    requiredCompletedMarathons: 7,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: 1500,
    rewardPoints: 3000,
    avatarXP: 1800,

    badge: "Athens Legathon Finisher",
    passportStamp: "Athens Legathon Stamp",
    certificate: "Athens Legathon Certificate",

    description:
      "Complete a virtual 26.2-mile Legathon inspired by the legendary route from Marathon to Athens and the ancient origins of distance racing.",
  },
];

// ============================================================
// ADDITIONAL 18 GLOBAL LEGATHONS
//
// Existing IDs, order, and rewards preserved.
// ============================================================

const ADDITIONAL_LEGATHON_DATA = [
  {
    id: "chicago",
    title: "Chicago Legathon",
    shortTitle: "Chicago",
    city: "Chicago",
    country: "United States",
    flag: "🇺🇸",
    order: 9,
    rewardCoins: 1700,
    rewardPoints: 3400,
    avatarXP: 2000,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Chicago's vibrant neighborhoods, lakefront paths, famous architecture, and downtown skyline.",
  },

  {
    id: "rome",
    title: "Rome Legathon",
    shortTitle: "Rome",
    city: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    order: 10,
    rewardCoins: 1900,
    rewardPoints: 3800,
    avatarXP: 2200,
    description:
      "Walk a virtual 26.2-mile Legathon through the Eternal City, inspired by ancient Roman landmarks, historic streets, and celebrated monuments.",
  },

  {
    id: "amsterdam",
    title: "Amsterdam Legathon",
    shortTitle: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    order: 11,
    rewardCoins: 2100,
    rewardPoints: 4200,
    avatarXP: 2400,
    description:
      "Complete a virtual 26.2-mile Legathon inspired by Amsterdam's canals, charming bridges, green parks, and historic city neighborhoods.",
  },

  {
    id: "barcelona",
    title: "Barcelona Legathon",
    shortTitle: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    order: 12,
    rewardCoins: 2300,
    rewardPoints: 4600,
    avatarXP: 2600,
    description:
      "Experience a virtual 26.2-mile Legathon inspired by Barcelona's Mediterranean atmosphere, artistic architecture, broad avenues, and famous plazas.",
  },

  {
    id: "sydney",
    title: "Sydney Legathon",
    shortTitle: "Sydney",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    order: 13,
    rewardCoins: 2500,
    rewardPoints: 5000,
    avatarXP: 2800,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Sydney Harbour, the iconic Harbour Bridge, beautiful waterfronts, and the Sydney Opera House.",
  },

  {
    id: "cape-town",
    title: "Cape Town Legathon",
    shortTitle: "Cape Town",
    city: "Cape Town",
    country: "South Africa",
    flag: "🇿🇦",
    order: 14,
    rewardCoins: 2800,
    rewardPoints: 5600,
    avatarXP: 3100,
    description:
      "Discover a virtual 26.2-mile Legathon inspired by Cape Town's spectacular coastline, mountain scenery, colorful neighborhoods, and Table Mountain.",
  },

  {
    id: "rio",
    title: "Rio de Janeiro Legathon",
    shortTitle: "Rio de Janeiro",
    city: "Rio de Janeiro",
    country: "Brazil",
    flag: "🇧🇷",
    order: 15,
    rewardCoins: 3100,
    rewardPoints: 6200,
    avatarXP: 3400,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Rio's famous beaches, dramatic mountains, lively neighborhoods, and Atlantic coastline.",
  },

  {
    id: "toronto",
    title: "Toronto Legathon",
    shortTitle: "Toronto",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    order: 16,
    rewardCoins: 3400,
    rewardPoints: 6800,
    avatarXP: 3700,
    description:
      "Complete a virtual 26.2-mile Legathon inspired by Toronto's diverse communities, impressive skyline, beautiful parks, and Lake Ontario waterfront.",
  },

  {
    id: "seoul",
    title: "Seoul Legathon",
    shortTitle: "Seoul",
    city: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    order: 17,
    rewardCoins: 3700,
    rewardPoints: 7400,
    avatarXP: 4000,
    description:
      "Experience a virtual 26.2-mile Legathon inspired by Seoul's historic palaces, energetic districts, Han River scenery, and modern architecture.",
  },

  {
    id: "singapore",
    title: "Singapore Legathon",
    shortTitle: "Singapore",
    city: "Singapore",
    country: "Singapore",
    flag: "🇸🇬",
    order: 18,
    rewardCoins: 4000,
    rewardPoints: 8000,
    avatarXP: 4300,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Singapore's waterfront skyline, lush gardens, modern landmarks, and vibrant multicultural neighborhoods.",
  },

  {
    id: "mumbai",
    title: "Mumbai Legathon",
    shortTitle: "Mumbai",
    city: "Mumbai",
    country: "India",
    flag: "🇮🇳",
    order: 19,
    rewardCoins: 4400,
    rewardPoints: 8800,
    avatarXP: 4700,
    description:
      "Complete a virtual 26.2-mile Legathon inspired by Mumbai's bustling streets, iconic waterfront, historic architecture, and spirited communities.",
  },

  {
    id: "mexico-city",
    title: "Mexico City Legathon",
    shortTitle: "Mexico City",
    city: "Mexico City",
    country: "Mexico",
    flag: "🇲🇽",
    order: 20,
    rewardCoins: 4800,
    rewardPoints: 9600,
    avatarXP: 5100,
    description:
      "Explore a virtual 26.2-mile Legathon inspired by Mexico City's historic avenues, cultural landmarks, beautiful parks, and extraordinary urban scenery.",
  },

  {
    id: "honolulu",
    title: "Honolulu Legathon",
    shortTitle: "Honolulu",
    city: "Honolulu",
    country: "United States",
    flag: "🇺🇸",
    order: 21,
    rewardCoins: 5200,
    rewardPoints: 10400,
    avatarXP: 5500,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Honolulu's Pacific coastline, tropical atmosphere, Waikiki, and views near Diamond Head.",
  },

  {
    id: "istanbul",
    title: "Istanbul Legathon",
    shortTitle: "Istanbul",
    city: "Istanbul",
    country: "Türkiye",
    flag: "🇹🇷",
    order: 22,
    rewardCoins: 5600,
    rewardPoints: 11200,
    avatarXP: 5900,
    description:
      "Complete a virtual 26.2-mile Legathon inspired by Istanbul's connection between Europe and Asia, the Bosphorus, historic mosques, and lively markets.",
  },

  {
    id: "buenos-aires",
    title: "Buenos Aires Legathon",
    shortTitle: "Buenos Aires",
    city: "Buenos Aires",
    country: "Argentina",
    flag: "🇦🇷",
    order: 23,
    rewardCoins: 6000,
    rewardPoints: 12000,
    avatarXP: 6300,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Buenos Aires' elegant avenues, vibrant culture, distinctive neighborhoods, and historic landmarks.",
  },

  {
    id: "nairobi",
    title: "Nairobi Legathon",
    shortTitle: "Nairobi",
    city: "Nairobi",
    country: "Kenya",
    flag: "🇰🇪",
    order: 24,
    rewardCoins: 6500,
    rewardPoints: 13000,
    avatarXP: 6800,
    description:
      "Complete a virtual 26.2-mile Legathon inspired by Nairobi's dynamic cityscape, green spaces, vibrant communities, and Kenya's distance-running heritage.",
  },

  {
    id: "shanghai",
    title: "Shanghai Legathon",
    shortTitle: "Shanghai",
    city: "Shanghai",
    country: "China",
    flag: "🇨🇳",
    order: 25,
    rewardCoins: 7000,
    rewardPoints: 14000,
    avatarXP: 7300,
    description:
      "Walk a virtual 26.2-mile Legathon inspired by Shanghai's spectacular skyline, historic waterfront, modern districts, and bustling streets.",
  },

  {
    id: "los-angeles",
    title: "Los Angeles Legathon",
    shortTitle: "Los Angeles",
    city: "Los Angeles",
    country: "United States",
    flag: "🇺🇸",
    order: 26,
    rewardCoins: 8000,
    rewardPoints: 16000,
    avatarXP: 8000,
    description:
      "Finish the global Legathon series with a virtual 26.2-mile challenge inspired by Los Angeles' iconic neighborhoods, Hollywood landmarks, vibrant streets, and Southern California scenery.",
  },
];

// ============================================================
// BUILD ADDITIONAL LEGATHON RECORDS
//
// Legacy slug names are intentionally retained.
// Do not change existing stored challenge IDs.
// ============================================================

function createAdditionalLegathon(data) {
  return {
    id: data.id,

    // Keep legacy slug for compatibility.
    slug: `${data.id}-marathon`,

    title: data.title,
    shortTitle: data.shortTitle,
    city: data.city,
    country: data.country,
    flag: data.flag,

    order: data.order,

    unlockedByDefault: false,

    requiredCompletedMarathons:
      data.order - 1,

    miles: MARATHON_TOTAL_MILES,
    totalSteps: MARATHON_TOTAL_STEPS,

    rewardCoins: data.rewardCoins,
    rewardPoints: data.rewardPoints,
    avatarXP: data.avatarXP,

    badge: `${data.title} Finisher`,
    passportStamp: `${data.title} Stamp`,
    certificate: `${data.title} Certificate`,

    description: data.description,
  };
}

// ============================================================
// FULL 26-LEGATHON CATALOG
//
// Keep MARATHON_CATALOG as the original named export.
// Other app files already import it.
// ============================================================

export const MARATHON_CATALOG = [
  ...ORIGINAL_LEGATHONS,
  ...ADDITIONAL_LEGATHON_DATA.map(
    createAdditionalLegathon
  ),
];

// Optional new name for future code.

export const LEGATHON_CATALOG =
  MARATHON_CATALOG;

// ============================================================
// NORMALIZE CHALLENGE ID
//
// Existing exported function preserved.
// ============================================================

export function normalizeMarathonId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Optional new helper name.

export const normalizeLegathonId =
  normalizeMarathonId;

// ============================================================
// EXISTING LEGACY ALIASES
// ============================================================

const MARATHON_ID_ALIASES = {
  "new-york": "nyc",
  "new-york-city": "nyc",
  "new-york-marathon": "nyc",
  "nyc-marathon": "nyc",
  "new-york-city-marathon": "nyc",

  "london-marathon": "london",
  "tokyo-marathon": "tokyo",
  "paris-marathon": "paris",
  "berlin-marathon": "berlin",
  "dubai-marathon": "dubai",
  "boston-marathon": "boston",
  "athens-marathon": "athens",

  "chicago-marathon": "chicago",
  "rome-marathon": "rome",
  "amsterdam-marathon": "amsterdam",
  "barcelona-marathon": "barcelona",
  "sydney-marathon": "sydney",

  "cape-town-marathon": "cape-town",
  capetown: "cape-town",

  "rio-marathon": "rio",
  "rio-de-janeiro": "rio",
  "rio-de-janeiro-marathon": "rio",

  "toronto-marathon": "toronto",
  "seoul-marathon": "seoul",
  "singapore-marathon": "singapore",
  "mumbai-marathon": "mumbai",

  "mexico-city-marathon": "mexico-city",
  "mexico-marathon": "mexico-city",

  "honolulu-marathon": "honolulu",
  "istanbul-marathon": "istanbul",

  "buenos-aires-marathon": "buenos-aires",
  "nairobi-marathon": "nairobi",
  "shanghai-marathon": "shanghai",

  "los-angeles-marathon": "los-angeles",
  "la-marathon": "los-angeles",
};

// ============================================================
// NEW LEGATHON ALIASES
//
// Recognize both old and new challenge names.
// ============================================================

const LEGATHON_ID_ALIASES = {
  "new-york-legathon": "nyc",
  "new-york-city-legathon": "nyc",
  "nyc-legathon": "nyc",

  "rio-legathon": "rio",
  "rio-de-janeiro-legathon": "rio",

  "cape-town-legathon": "cape-town",
  "capetown-legathon": "cape-town",

  "mexico-legathon": "mexico-city",
  "mexico-city-legathon": "mexico-city",

  "la-legathon": "los-angeles",
  "los-angeles-legathon": "los-angeles",
};

// Create standard Legathon aliases for all 26.

MARATHON_CATALOG.forEach(challenge => {
  const titleKey = normalizeMarathonId(
    challenge.title
  );

  const shortKey = normalizeMarathonId(
    `${challenge.shortTitle} Legathon`
  );

  const idKey = normalizeMarathonId(
    `${challenge.id}-legathon`
  );

  LEGATHON_ID_ALIASES[titleKey] =
    challenge.id;

  LEGATHON_ID_ALIASES[shortKey] =
    challenge.id;

  LEGATHON_ID_ALIASES[idKey] =
    challenge.id;
});

// ============================================================
// RESOLVE CHALLENGE ID
//
// Supports:
// - Existing challenge ID
// - Existing legacy slug
// - Original Marathon names
// - New Legathon names
// - Short city names
// ============================================================

export function resolveMarathonId(value) {
  const normalizedId =
    normalizeMarathonId(value);

  if (!normalizedId) {
    return null;
  }

  const directMatch = MARATHON_CATALOG.find(
    challenge =>
      normalizeMarathonId(
        challenge.id
      ) === normalizedId ||
      normalizeMarathonId(
        challenge.slug
      ) === normalizedId ||
      normalizeMarathonId(
        challenge.title
      ) === normalizedId ||
      normalizeMarathonId(
        challenge.shortTitle
      ) === normalizedId
  );

  if (directMatch) {
    return directMatch.id;
  }

  return (
    LEGATHON_ID_ALIASES[normalizedId] ||
    MARATHON_ID_ALIASES[normalizedId] ||
    null
  );
}

export const resolveLegathonId =
  resolveMarathonId;

// ============================================================
// GET CHALLENGE BY ID
// ============================================================

export function getMarathonById(marathonId) {
  const resolvedId =
    resolveMarathonId(marathonId);

  if (!resolvedId) {
    return null;
  }

  return (
    MARATHON_CATALOG.find(
      challenge =>
        challenge.id === resolvedId
    ) || null
  );
}

export const getLegathonById =
  getMarathonById;

// ============================================================
// GET CHALLENGE BY ORDER
// ============================================================

export function getMarathonByOrder(order) {
  const safeOrder = Number(order || 0);

  return (
    MARATHON_CATALOG.find(
      challenge =>
        Number(challenge.order) ===
        safeOrder
    ) || null
  );
}

export const getLegathonByOrder =
  getMarathonByOrder;

// ============================================================
// GET NEXT CHALLENGE
// ============================================================

export function getNextMarathon(marathonId) {
  const challenge =
    getMarathonById(marathonId);

  if (!challenge) {
    return null;
  }

  return getMarathonByOrder(
    Number(challenge.order) + 1
  );
}

export const getNextLegathon =
  getNextMarathon;

// ============================================================
// GET PREVIOUS CHALLENGE
// ============================================================

export function getPreviousMarathon(marathonId) {
  const challenge =
    getMarathonById(marathonId);

  if (!challenge) {
    return null;
  }

  return getMarathonByOrder(
    Number(challenge.order) - 1
  );
}

export const getPreviousLegathon =
  getPreviousMarathon;

// ============================================================
// TOTAL NUMBER OF LEGATHONS
// ============================================================

export function getMarathonCount() {
  return MARATHON_CATALOG.length;
}

export const getLegathonCount =
  getMarathonCount;

// ============================================================
// TOTAL CHALLENGE DISTANCE
// ============================================================

export function getTotalMarathonMiles() {
  return MARATHON_CATALOG.reduce(
    (total, challenge) =>
      total +
      Number(challenge.miles || 0),
    0
  );
}

export const getTotalLegathonMiles =
  getTotalMarathonMiles;

// ============================================================
// TOTAL CHALLENGE STEPS
// ============================================================

export function getTotalMarathonSteps() {
  return MARATHON_CATALOG.reduce(
    (total, challenge) =>
      total +
      Number(challenge.totalSteps || 0),
    0
  );
}

export const getTotalLegathonSteps =
  getTotalMarathonSteps;

// ============================================================
// TOTAL POTENTIAL REWARDS
//
// This does not claim or award rewards.
// ============================================================

export function getTotalMarathonRewards() {
  return MARATHON_CATALOG.reduce(
    (totals, challenge) => ({
      rewardCoins:
        totals.rewardCoins +
        Number(challenge.rewardCoins || 0),

      rewardPoints:
        totals.rewardPoints +
        Number(challenge.rewardPoints || 0),

      avatarXP:
        totals.avatarXP +
        Number(challenge.avatarXP || 0),
    }),
    {
      rewardCoins: 0,
      rewardPoints: 0,
      avatarXP: 0,
    }
  );
}

export const getTotalLegathonRewards =
  getTotalMarathonRewards;

// ============================================================
// CATALOG VALIDATION
// ============================================================

export function validateMarathonCatalog() {
  const errors = [];

  const ids = new Set();
  const orders = new Set();

  if (MARATHON_CATALOG.length !== 26) {
    errors.push(
      `Expected 26 Legathons, found ${MARATHON_CATALOG.length}.`
    );
  }

  MARATHON_CATALOG.forEach(challenge => {
    if (!challenge.id) {
      errors.push(
        "A Legathon is missing an ID."
      );
    }

    if (ids.has(challenge.id)) {
      errors.push(
        `Duplicate Legathon ID: ${challenge.id}`
      );
    }

    ids.add(challenge.id);

    const order = Number(challenge.order);

    if (!Number.isInteger(order)) {
      errors.push(
        `${challenge.title} has an invalid order.`
      );
    }

    if (orders.has(order)) {
      errors.push(
        `Duplicate Legathon order: ${order}`
      );
    }

    orders.add(order);

    if (
      Number(challenge.totalSteps) !==
      MARATHON_TOTAL_STEPS
    ) {
      errors.push(
        `${challenge.title} must use ${MARATHON_TOTAL_STEPS} steps.`
      );
    }

    if (
      Number(challenge.miles) !==
      MARATHON_TOTAL_MILES
    ) {
      errors.push(
        `${challenge.title} must use ${MARATHON_TOTAL_MILES} miles.`
      );
    }

    if (
      Number(
        challenge.requiredCompletedMarathons
      ) !==
      order - 1
    ) {
      errors.push(
        `${challenge.title} has an incorrect unlock requirement.`
      );
    }

    if (
      challenge.unlockedByDefault !==
      (order === 1)
    ) {
      errors.push(
        `${challenge.title} has an incorrect default unlock setting.`
      );
    }

    if (
      !challenge.badge ||
      !challenge.passportStamp ||
      !challenge.certificate
    ) {
      errors.push(
        `${challenge.title} is missing completion metadata.`
      );
    }

    if (
      Number(challenge.rewardCoins) <= 0 ||
      Number(challenge.rewardPoints) <= 0 ||
      Number(challenge.avatarXP) <= 0
    ) {
      errors.push(
        `${challenge.title} has invalid reward amounts.`
      );
    }

    if (
      !String(challenge.title).includes(
        "Legathon"
      )
    ) {
      errors.push(
        `${challenge.title} is missing Legathon branding.`
      );
    }
  });

  for (let order = 1; order <= 26; order++) {
    if (!orders.has(order)) {
      errors.push(
        `Missing Legathon order: ${order}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    count: MARATHON_CATALOG.length,
  };
}

export const validateLegathonCatalog =
  validateMarathonCatalog;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default MARATHON_CATALOG;
