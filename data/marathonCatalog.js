export const STEPS_PER_MILE = 2000;
export const MARATHON_TOTAL_MILES = 26.2;
export const MARATHON_TOTAL_STEPS = Math.round(
  MARATHON_TOTAL_MILES * STEPS_PER_MILE
);

export const MARATHON_CATALOG = [
  {
    id: "nyc",
    slug: "new-york-marathon",
    title: "New York Marathon",
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

    badge: "New York Marathon Finisher",
    passportStamp: "New York Marathon Stamp",
    certificate: "New York Marathon Certificate",

    description:
      "Complete a virtual 26.2-mile marathon inspired by New York City’s energy, neighborhoods, bridges, and famous finish line.",
  },

  {
    id: "london",
    slug: "london-marathon",
    title: "London Marathon",
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

    badge: "London Marathon Finisher",
    passportStamp: "London Marathon Stamp",
    certificate: "London Marathon Certificate",

    description:
      "Complete a virtual marathon through London’s historic streets, riverfront, royal landmarks, and celebrated marathon course.",
  },

  {
    id: "tokyo",
    slug: "tokyo-marathon",
    title: "Tokyo Marathon",
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

    badge: "Tokyo Marathon Finisher",
    passportStamp: "Tokyo Marathon Stamp",
    certificate: "Tokyo Marathon Certificate",

    description:
      "Complete a virtual marathon through Tokyo’s modern districts, traditional neighborhoods, city landmarks, and glowing streets.",
  },

  {
    id: "paris",
    slug: "paris-marathon",
    title: "Paris Marathon",
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

    badge: "Paris Marathon Finisher",
    passportStamp: "Paris Marathon Stamp",
    certificate: "Paris Marathon Certificate",

    description:
      "Complete a virtual marathon inspired by Parisian boulevards, monuments, parks, bridges, and the River Seine.",
  },

  {
    id: "berlin",
    slug: "berlin-marathon",
    title: "Berlin Marathon",
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

    badge: "Berlin Marathon Finisher",
    passportStamp: "Berlin Marathon Stamp",
    certificate: "Berlin Marathon Certificate",

    description:
      "Complete a virtual marathon through Berlin’s historic center, modern neighborhoods, broad avenues, and Brandenburg Gate finish.",
  },

  {
    id: "dubai",
    slug: "dubai-marathon",
    title: "Dubai Marathon",
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

    badge: "Dubai Marathon Finisher",
    passportStamp: "Dubai Marathon Stamp",
    certificate: "Dubai Marathon Certificate",

    description:
      "Complete a virtual marathon inspired by Dubai’s coastline, modern skyline, wide roads, and world-famous architecture.",
  },

  {
    id: "boston",
    slug: "boston-marathon",
    title: "Boston Marathon",
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

    badge: "Boston Marathon Finisher",
    passportStamp: "Boston Marathon Stamp",
    certificate: "Boston Marathon Certificate",

    description:
      "Complete a virtual marathon inspired by one of the world’s oldest and most respected annual marathon traditions.",
  },

  {
    id: "athens",
    slug: "athens-marathon",
    title: "Athens Marathon",
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

    badge: "Athens Marathon Finisher",
    passportStamp: "Athens Marathon Stamp",
    certificate: "Athens Marathon Certificate",

    description:
      "Complete a virtual marathon inspired by the legendary route from Marathon to Athens and the historic origin of the race.",
  },
];

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

const MARATHON_ID_ALIASES = {
  "new-york": "nyc",
  "new-york-city": "nyc",
  "new-york-marathon": "nyc",
  "nyc-marathon": "nyc",

  "london-marathon": "london",
  "tokyo-marathon": "tokyo",
  "paris-marathon": "paris",
  "berlin-marathon": "berlin",
  "dubai-marathon": "dubai",
  "boston-marathon": "boston",
  "athens-marathon": "athens",
};

export function resolveMarathonId(value) {
  const normalizedId = normalizeMarathonId(
    value
  );

  if (!normalizedId) {
    return null;
  }

  const directMatch =
    MARATHON_CATALOG.find(
      marathon =>
        normalizeMarathonId(
          marathon.id
        ) === normalizedId ||
        normalizeMarathonId(
          marathon.slug
        ) === normalizedId ||
        normalizeMarathonId(
          marathon.title
        ) === normalizedId ||
        normalizeMarathonId(
          marathon.shortTitle
        ) === normalizedId
    );

  if (directMatch) {
    return directMatch.id;
  }

  return (
    MARATHON_ID_ALIASES[
      normalizedId
    ] || null
  );
}

export function getMarathonById(
  marathonId
) {
  const resolvedId =
    resolveMarathonId(marathonId);

  if (!resolvedId) {
    return null;
  }

  return (
    MARATHON_CATALOG.find(
      marathon =>
        marathon.id === resolvedId
    ) || null
  );
}

export function getMarathonByOrder(
  order
) {
  const safeOrder =
    Number(order || 0);

  return (
    MARATHON_CATALOG.find(
      marathon =>
        Number(marathon.order) ===
        safeOrder
    ) || null
  );
}

export function getNextMarathon(
  marathonId
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return null;
  }

  return getMarathonByOrder(
    Number(marathon.order) + 1
  );
}

export function getPreviousMarathon(
  marathonId
) {
  const marathon =
    getMarathonById(marathonId);

  if (!marathon) {
    return null;
  }

  return getMarathonByOrder(
    Number(marathon.order) - 1
  );
}

export function getMarathonCount() {
  return MARATHON_CATALOG.length;
}

export function getTotalMarathonMiles() {
  return MARATHON_CATALOG.reduce(
    (total, marathon) =>
      total +
      Number(marathon.miles || 0),
    0
  );
}

export function getTotalMarathonSteps() {
  return MARATHON_CATALOG.reduce(
    (total, marathon) =>
      total +
      Number(
        marathon.totalSteps || 0
      ),
    0
  );
}

export function getTotalMarathonRewards() {
  return MARATHON_CATALOG.reduce(
    (totals, marathon) => ({
      rewardCoins:
        totals.rewardCoins +
        Number(
          marathon.rewardCoins || 0
        ),

      rewardPoints:
        totals.rewardPoints +
        Number(
          marathon.rewardPoints || 0
        ),

      avatarXP:
        totals.avatarXP +
        Number(
          marathon.avatarXP || 0
        ),
    }),
    {
      rewardCoins: 0,
      rewardPoints: 0,
      avatarXP: 0,
    }
  );
}

export function validateMarathonCatalog() {
  const errors = [];
  const ids = new Set();
  const orders = new Set();

  MARATHON_CATALOG.forEach(
    marathon => {
      if (!marathon.id) {
        errors.push(
          "A marathon is missing an ID."
        );
      }

      if (ids.has(marathon.id)) {
        errors.push(
          `Duplicate marathon ID: ${marathon.id}`
        );
      }

      ids.add(marathon.id);

      if (
        orders.has(
          Number(marathon.order)
        )
      ) {
        errors.push(
          `Duplicate marathon order: ${marathon.order}`
        );
      }

      orders.add(
        Number(marathon.order)
      );

      if (
        Number(
          marathon.totalSteps
        ) !==
        MARATHON_TOTAL_STEPS
      ) {
        errors.push(
          `${marathon.title} does not use ${MARATHON_TOTAL_STEPS} steps.`
        );
      }

      if (
        Number(marathon.miles) !==
        MARATHON_TOTAL_MILES
      ) {
        errors.push(
          `${marathon.title} does not use ${MARATHON_TOTAL_MILES} miles.`
        );
      }
    }
  );

  return {
    valid: errors.length === 0,
    errors,
    count:
      MARATHON_CATALOG.length,
  };
}

export default MARATHON_CATALOG;