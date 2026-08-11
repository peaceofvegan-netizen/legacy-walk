import routeImages from "./routeImages";
const STEPS_PER_MILE = 2000;



export const MEMBERSHIP_TYPES = {
  FREE: "free",
  PREMIUM: "premium",
  ELITE: "elite",
};

export const DIFFICULTY = {
  EASY: "Easy",
  MODERATE: "Moderate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
  LEGENDARY: "Legendary",
};

export const LEGACY_RANKS = {
  ROOKIE: "Rookie",
  EXPLORER: "Explorer",
  PATHFINDER: "Pathfinder",
  TRAILBLAZER: "Trailblazer",
  LEGEND: "Legend",
  ELITE: "Elite",
};
export const CATEGORY_POINT_BONUSES = {
  "Black Legacy": 150,
  "Civil Rights": 150,
  "Ancient Civilizations": 100,
  "World Wonders": 200,
  "Faith & Spiritual": 100,
  Africa: 150,
  India: 120,
  "City Discovery": 100,
  "Nature & Adventure": 150,
  Bridges: 100,
  Routes: 150,
  Awareness: 200,
  "Literary & Heroes": 120,
  "Global Legacy": 500,
};
export const JOURNEY_CATEGORIES = {
  ALL: "All",
  BLACK_LEGACY: "Black Legacy",
  CIVIL_RIGHTS: "Civil Rights",
  ANCIENT_CIVILIZATIONS: "Ancient Civilizations",
  WORLD_WONDERS: "World Wonders",
  FAITH_SPIRITUAL: "Faith & Spiritual",
  AFRICA: "Africa",
  INDIA: "India",
  CITY_DISCOVERY: "City Discovery",
  NATURE_ADVENTURE: "Nature & Adventure",
  BRIDGES: "Bridges",
  ROUTES: "Routes",
  AWARENESS: "Awareness",
  LITERARY_HEROES: "Literary & Heroes",
  GLOBAL_LEGACY: "Global Legacy",
};

export const DIFFICULTY_POINTS = {
  Easy: 400,
  Moderate: 600,
  Advanced: 900,
  Expert: 1300,
  Legendary: 2000,
};

export const DIFFICULTY_XP = {
  Easy: 400,
  Moderate: 600,
  Advanced: 900,
  Expert: 1300,
  Legendary: 2000,
};

export const DIFFICULTY_RANK = {
  Easy: LEGACY_RANKS.EXPLORER,
  Moderate: LEGACY_RANKS.PATHFINDER,
  Advanced: LEGACY_RANKS.TRAILBLAZER,
  Expert: LEGACY_RANKS.LEGEND,
  Legendary: LEGACY_RANKS.ELITE,
};

export function calculateJourneySteps(miles = 0) {
  return Math.round(Number(miles || 0) * STEPS_PER_MILE);
}

export function calculatePremiumWCoins(miles = 0) {
  return Math.round(Number(miles || 0) * 100);
}

export function calculateEliteWCoins(miles = 0) {
  return Math.round(Number(miles || 0) * 200);
}

export function calculateLegacyPoints({
  miles = 0,
  difficulty = DIFFICULTY.EASY,
  category = "",
}) {
  const walkingPoints = Math.round(Number(miles || 0) * 10);
  const completionPoints = DIFFICULTY_POINTS[difficulty] || 400;
  const categoryBonus = CATEGORY_POINT_BONUSES[category] || 0;

  return walkingPoints + completionPoints + categoryBonus;
}

export function calculateEstimatedTime(miles = 0) {
  const distance = Number(miles || 0);

  if (distance <= 8) return "Up to 1 week";
  if (distance <= 15) return "1–2 weeks";
  if (distance <= 30) return "2–4 weeks";
  if (distance <= 75) return "1–2 months";
  if (distance <= 150) return "2–4 months";
  if (distance <= 500) return "4–8 months";

  return "Long-term journey";
}
const ROUTE_IMAGE_BY_ID = {
  // Ancient Civilizations
  "acropolis-athens": routeImages.acropolis,
  "angkor-wat": routeImages.angkorWat,
  "chichen-itza": routeImages.chichenItza,
  "forbidden-city": routeImages.forbiddenCity,
  "great-buddha": routeImages.greatBuddha,
  "great-wall-of-china": routeImages.greatWall,
  "great-zimbabwe": routeImages.greatZimbabwe,
  "machu-picchu": routeImages.machuPicchu,
  "nile-civilization": routeImages.nileCivilization,
  petra: routeImages.petra,
  "roman-empire": routeImages.romanEmpire,
  "terracotta-army": routeImages.terracottaArmy,

  // Faith and Pilgrimages
  "bodh-gaya": routeImages.bodhGaya,
  "camino-de-santiago": routeImages.caminoDeSantiago,
  "canterbury-pilgrimage": routeImages.canterburyPilgrimage,
  "kumano-kodo": routeImages.kumanoKodo,
  "lourdes-pilgrimage": routeImages.lourdesPilgrimage,
  "mecca-pilgrimage-routes": routeImages.meccaPilgrimage,
  "mount-sinai": routeImages.mountSinai,
  "st-patricks-way": routeImages.saintPatricksWay,
  "via-dolorosa": routeImages.viaDolorosa,

  // American Historic Trails
  "alamo-walk": routeImages.alamoWalk,
  "boston-freedom-trail": routeImages.bostonFreedomTrail,
  "coast-to-coast-usa": routeImages.coastToCoast,
  "ellis-island": routeImages.ellisIsland,
  "gettysburg-battlefield": routeImages.gettysburgBattlefield,
  "lewis-and-clark": routeImages.lewisAndClark,
  "lewis-clark-national-historic-trail": routeImages.lewisAndClark,
  "liberty-trail": routeImages.libertyTrail,
  "oregon-trail": routeImages.oregonTrail,
  "pacific-coast-highway": routeImages.pacificCoastHighway,
  "route-66": routeImages.route66,
  "selma-to-montgomery": routeImages.selmaToMontgomery,

  // Bridges
  "akashi-kaikyo-bridge": routeImages.akashiKaikyoBridge,
  "brooklyn-bridge": routeImages.brooklynBridge,
  "chapel-bridge": routeImages.chapelBridge,
  "danyang-kunshan-grand-bridge": routeImages.danyangKunshanBridge,
  "golden-gate-bridge": routeImages.goldenGateBridge,
  "magdeburg-water-bridge": routeImages.magdeburgWaterBridge,
  "millau-viaduct": routeImages.millauViaduct,
  "tower-bridge": routeImages.towerBridge,

  // Nature and Scenic Adventures
  "amazon-rainforest": routeImages.amazonRainforest,
  "banff-national-park": routeImages.banffNationalPark,
  himalayas: routeImages.himalayas,
  "irish-cliffs": routeImages.irishCliffs,
  "kilimanjaro-base-walk": routeImages.kilimanjaroBaseWalk,
  "mount-fuji": routeImages.mountFuji,
  "niagara-falls": routeImages.niagaraFalls,
  "norwegian-fjords": routeImages.norwegianFjords,
  patagonia: routeImages.patagonia,
  "scottish-highlands": routeImages.scottishHighlands,
  "serengeti-trail": routeImages.serengetiTrail,
  "swiss-alps": routeImages.swissAlps,
  "victoria-falls": routeImages.victoriaFalls,

  // Cities and Landmarks
  "berlin-wall": routeImages.berlinWall,
  "eiffel-tower": routeImages.eiffelTower,
  "kyoto-temples": routeImages.kyotoTemples,
  "seoul-heritage": routeImages.seoulHeritage,
  "singapore-gardens": routeImages.singaporeGardens,
  "taj-mahal": routeImages.tajMahal,
  "tokyo-nights": routeImages.tokyoNights,
  "venice-canals": routeImages.veniceCanals,

  // Africa and Global Heritage
  "ghana-cape-coast-castle": routeImages.ghanaCapeCoastCastle,
  "nelson-mandela-freedom-walk":
    routeImages.nelsonMandelaFreedomWalk,
  "silk-road": routeImages.silkRoad,
  "timbuktu-heritage": routeImages.timbuktuHeritage,
  vikings: routeImages.vikings,

  // Global and Awareness
  "around-the-world": routeImages.aroundTheWorld,
  "autism-awareness": routeImages.autismAwareness,
  "breast-cancer-awareness": routeImages.breastCancerAwareness,
  "cancer-awareness": routeImages.cancerAwareness,
};
function createJourney(config) {
  const miles = Number(config.miles || 0);
  const difficulty = config.difficulty || DIFFICULTY.EASY;
  const category = config.category || "Legacy Journey";

  return {
    ...config,
routeImage:
  config.routeImage ||
  ROUTE_IMAGE_BY_ID[config.id] ||
  null,
    miles,
    steps: calculateJourneySteps(miles),

    difficulty,
    rank: config.rank || DIFFICULTY_RANK[difficulty],

    estimatedTime:
      config.estimatedTime || calculateEstimatedTime(miles),

    rewardPoints:
      config.rewardPoints ||
      calculateLegacyPoints({
        miles,
        difficulty,
        category,
      }),

    xpReward:
      config.xpReward ||
      DIFFICULTY_XP[difficulty] ||
      DIFFICULTY_XP.Easy,

    freeWCoins:
      config.freeWCoins ?? calculatePremiumWCoins(miles),

    premiumWCoins:
      config.premiumWCoins ?? calculatePremiumWCoins(miles),

    eliteWCoins:
      config.eliteWCoins ?? calculateEliteWCoins(miles),

    passportStamp: config.passportStamp ?? true,
    journeyBadge: config.journeyBadge ?? true,
    certificate: config.certificate ?? true,
    checkpoints: config.checkpoints || 5,
    premium: config.premium ?? false,
  };
}

const rawJourneys = [
  createJourney({
    id: "acropolis-athens",
    title: "Acropolis Athens",
    subtitle:
      "Walk through the birthplace of democracy and classical civilization.",
    category: "Ancient Civilizations",
    country: "Greece",
    location: "Athens, Greece",
    image: require("../assets/journeys/acropolis.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "angkor-wat",
    title: "Angkor Wat",
    subtitle:
      "Walk through the spiritual and architectural legacy of the Khmer Empire.",
    category: "Ancient Civilizations",
    country: "Cambodia",
    location: "Siem Reap, Cambodia",
    image: require("../assets/journeys/angkor.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "chichen-itza",
    title: "Chichén Itzá",
    subtitle:
      "Explore the astronomy, architecture, and culture of the ancient Maya.",
    category: "Ancient Civilizations",
    country: "Mexico",
    location: "Yucatán, Mexico",
    image: require("../assets/journeys/chichen.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "forbidden-city",
    title: "Forbidden City",
    subtitle:
      "Journey through the imperial heart of China and centuries of dynastic history.",
    category: "Ancient Civilizations",
    country: "China",
    location: "Beijing, China",
    image: require("../assets/journeys/forbiddencity.png"),
    miles: 9,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "great-wall-of-china",
    title: "Great Wall of China",
    subtitle:
      "Walk one of history’s greatest engineering and cultural legacies.",
    category: "Ancient Civilizations",
    country: "China",
    location: "Northern China",
    image: require("../assets/journeys/greatwall.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "great-zimbabwe",
    title: "Great Zimbabwe",
    subtitle:
      "Discover the stone cities, trade routes, and legacy of a powerful African kingdom.",
    category: "Ancient Civilizations",
    country: "Zimbabwe",
    location: "Masvingo, Zimbabwe",
    image: require("../assets/journeys/zimbabwe.png"),
    miles: 14,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "machu-picchu",
    title: "Machu Picchu",
    subtitle:
      "Climb through the sacred landscapes and engineering achievements of the Inca.",
    category: "Ancient Civilizations",
    country: "Peru",
    location: "Cusco Region, Peru",
    image: require("../assets/journeys/machupicchu.png"),
    miles: 26,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "nile-civilization",
    title: "Nile Civilization",
    subtitle:
      "Follow the river that sustained one of the world’s greatest civilizations.",
    category: "Ancient Civilizations",
    country: "Egypt",
    location: "Nile Valley, Egypt",
    image: require("../assets/journeys/nile.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "petra",
    title: "Petra",
    subtitle:
      "Walk through the rose-red city carved into the mountains of Jordan.",
    category: "Ancient Civilizations",
    country: "Jordan",
    location: "Petra, Jordan",
    image: require("../assets/journeys/petra.png"),
    miles: 11,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "roman-empire",
    title: "Roman Empire",
    subtitle:
      "Explore the roads, monuments, and history that shaped the ancient world.",
    category: "Ancient Civilizations",
    country: "Italy",
    location: "Rome, Italy",
    image: require("../assets/journeys/romanempire.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "terracotta-army",
    title: "Terracotta Army",
    subtitle:
      "Walk through the history of China’s first emperor and his legendary guardians.",
    category: "Ancient Civilizations",
    country: "China",
    location: "Xi’an, China",
    image: require("../assets/journeys/terracottaarmy.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),




 createJourney({
    id: "bodh-gaya",
    title: "Bodh Gaya",
    subtitle:
      "Walk through the sacred landmarks connected to enlightenment, reflection, and Buddhist history.",
    category: "Faith & Pilgrimages",
    country: "India",
    location: "Bodh Gaya, India",
    image: require("../assets/journeys/bodh.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "camino-de-santiago",
    title: "Camino de Santiago",
    subtitle:
      "Follow one of the world’s most celebrated pilgrimage routes toward Santiago de Compostela.",
    category: "Faith & Pilgrimages",
    country: "Spain",
    location: "Northern Spain",
    image: require("../assets/journeys/camino.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "canterbury-pilgrimage",
    title: "Canterbury Pilgrimage",
    subtitle:
      "Journey along a historic pilgrimage path shaped by faith, storytelling, and English heritage.",
    category: "Faith & Pilgrimages",
    country: "United Kingdom",
    location: "Canterbury, England",
    image: require("../assets/journeys/canterbury.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "great-buddha",
    title: "Great Buddha",
    subtitle:
      "Explore a journey of peace, mindfulness, and Buddhist cultural heritage.",
    category: "Faith & Pilgrimages",
    country: "Japan",
    location: "Kamakura, Japan",
    image: require("../assets/journeys/greatbuddha.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "kumano-kodo",
    title: "Kumano Kodo",
    subtitle:
      "Walk the sacred mountain trails connecting ancient shrines across Japan’s Kii Peninsula.",
    category: "Faith & Pilgrimages",
    country: "Japan",
    location: "Kii Peninsula, Japan",
    image: require("../assets/journeys/kumano.png"),
    miles: 45,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "lourdes-pilgrimage",
    title: "Lourdes Pilgrimage",
    subtitle:
      "Journey through a place of prayer, healing, reflection, and international pilgrimage.",
    category: "Faith & Pilgrimages",
    country: "France",
    location: "Lourdes, France",
    image: require("../assets/journeys/lourdes.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "mecca-pilgrimage-routes",
    title: "Mecca Pilgrimage Routes",
    subtitle:
      "Explore the history, devotion, and global significance of the sacred pilgrimage routes.",
    category: "Faith & Pilgrimages",
    country: "Saudi Arabia",
    location: "Mecca, Saudi Arabia",
    image: require("../assets/journeys/mecca.png"),
    miles: 25,
    difficulty: DIFFICULTY.ADVANCED,
    premium: true,
  }),

  createJourney({
    id: "mount-sinai",
    title: "Mount Sinai",
    subtitle:
      "Climb through a landscape connected to faith, revelation, endurance, and ancient history.",
    category: "Faith & Pilgrimages",
    country: "Egypt",
    location: "Sinai Peninsula, Egypt",
    image: require("../assets/journeys/mountsinai.png"),
    miles: 14,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "st-patricks-way",
    title: "St. Patrick’s Way",
    subtitle:
      "Follow a spiritual and cultural trail through the landscapes associated with Saint Patrick.",
    category: "Faith & Pilgrimages",
    country: "Northern Ireland",
    location: "County Down, Northern Ireland",
    image: require("../assets/journeys/stpatricks.png"),
    miles: 40,
    difficulty: DIFFICULTY.EXPERT,
  }),

  createJourney({
    id: "vatican-pilgrim-walk",
    title: "Vatican Pilgrim Walk",
    subtitle:
      "Walk through the art, history, architecture, and spiritual legacy of Vatican City.",
    category: "Faith & Pilgrimages",
    country: "Vatican City",
    location: "Vatican City",
    image: require("../assets/journeys/vatican.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "via-dolorosa",
    title: "Via Dolorosa",
    subtitle:
      "Follow the historic route through Jerusalem associated with reflection, sacrifice, and faith.",
    category: "Faith & Pilgrimages",
    country: "Israel",
    location: "Jerusalem",
    image: require("../assets/journeys/viadolorosa.png"),
    miles: 6,
    difficulty: DIFFICULTY.EASY,
  }),

    createJourney({
    id: "alamo-walk",
    title: "Alamo Walk",
    subtitle:
      "Explore the history, sacrifice, and lasting legacy connected to the Alamo.",
    category: "American History",
    country: "United States",
    location: "San Antonio, Texas",
    image: require("../assets/journeys/alamowalk.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "boston-freedom-trail",
    title: "Boston Freedom Trail",
    subtitle:
      "Walk through the landmarks and events that helped shape the American Revolution.",
    category: "American History",
    country: "United States",
    location: "Boston, Massachusetts",
    image: require("../assets/journeys/bostonfreedom.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "coast-to-coast-usa",
    title: "Coast to Coast USA",
    subtitle:
      "Cross the United States through a long-distance journey of landscapes, cities, and national history.",
    category: "American History",
    country: "United States",
    location: "United States",
    image: require("../assets/journeys/coasttocoast.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "ellis-island",
    title: "Ellis Island",
    subtitle:
      "Walk through the stories of migration, hope, identity, and the American experience.",
    category: "American History",
    country: "United States",
    location: "New York Harbor, New York",
    image: require("../assets/journeys/ellisisland.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "gettysburg-battlefield",
    title: "Gettysburg Battlefield",
    subtitle:
      "Explore the battlefield, leadership, sacrifice, and turning point of the American Civil War.",
    category: "American History",
    country: "United States",
    location: "Gettysburg, Pennsylvania",
    image: require("../assets/journeys/gettysburg.png"),
    miles: 15,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "lewis-clark-national-historic-trail",
    title: "Lewis & Clark National Historic Trail",
    subtitle:
      "Follow the exploration route through rivers, mountains, cultures, and changing American frontiers.",
    category: "American History",
    country: "United States",
    location: "United States",
    image: require("../assets/journeys/lewisclark.png"),
    miles: 75,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "liberty-trail",
    title: "Liberty Trail",
    subtitle:
      "Walk through stories of independence, citizenship, courage, and the continuing pursuit of freedom.",
    category: "American History",
    country: "United States",
    location: "United States",
    image: require("../assets/journeys/liberty.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "oregon-trail",
    title: "Oregon Trail",
    subtitle:
      "Journey through migration, hardship, resilience, and westward expansion across America.",
    category: "American History",
    country: "United States",
    location: "United States",
    image: require("../assets/journeys/oregontrail.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "pacific-coast-highway",
    title: "Pacific Coast Highway",
    subtitle:
      "Travel along America’s western coastline through iconic cities, cliffs, beaches, and landmarks.",
    category: "American History",
    country: "United States",
    location: "California, United States",
    image: require("../assets/journeys/pacificcoast.png"),
    miles: 75,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "route-66",
    title: "Route 66",
    subtitle:
      "Follow America’s historic highway through small towns, landmarks, culture, and open-road history.",
    category: "American History",
    country: "United States",
    location: "Chicago to Santa Monica",
    image: require("../assets/journeys/route66.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "selma-to-montgomery",
    title: "Selma to Montgomery",
    subtitle:
      "Walk the historic civil rights route honoring courage, equality, sacrifice, and voting rights.",
    category: "American History",
    country: "United States",
    location: "Alabama, United States",
    image: require("../assets/journeys/selma.png"),
    miles: 25,
    difficulty: DIFFICULTY.ADVANCED,
  }),

   createJourney({
    id: "akashi-kaikyo-bridge",
    title: "Akashi Kaikyō Bridge",
    subtitle:
      "Walk the legacy of one of the world’s greatest suspension bridges and modern engineering achievements.",
    category: "Bridges & Engineering",
    country: "Japan",
    location: "Kobe to Awaji Island, Japan",
    image: require("../assets/journeys/akashi.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "brooklyn-bridge",
    title: "Brooklyn Bridge",
    subtitle:
      "Cross an iconic New York landmark that transformed transportation, architecture, and city life.",
    category: "Bridges & Engineering",
    country: "United States",
    location: "New York City, New York",
    image: require("../assets/journeys/brooklynbridge.png"),
    miles: 6,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "chapel-bridge",
    title: "Chapel Bridge",
    subtitle:
      "Explore the historic wooden bridge, artwork, and cultural heritage of Lucerne.",
    category: "Bridges & Engineering",
    country: "Switzerland",
    location: "Lucerne, Switzerland",
    image: require("../assets/journeys/chapelbridge.png"),
    miles: 6,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "danyang-kunshan-grand-bridge",
    title: "Danyang–Kunshan Grand Bridge",
    subtitle:
      "Journey across one of the longest bridges ever built and discover the scale of modern rail engineering.",
    category: "Bridges & Engineering",
    country: "China",
    location: "Jiangsu Province, China",
    image: require("../assets/journeys/danyang.png"),
    miles: 50,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "golden-gate-bridge",
    title: "Golden Gate Bridge",
    subtitle:
      "Walk across San Francisco’s legendary bridge and explore its architecture, history, and global influence.",
    category: "Bridges & Engineering",
    country: "United States",
    location: "San Francisco, California",
    image: require("../assets/journeys/goldengate.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "magdeburg-water-bridge",
    title: "Magdeburg Water Bridge",
    subtitle:
      "Explore the engineering marvel that carries ships across a river and connects major canal systems.",
    category: "Bridges & Engineering",
    country: "Germany",
    location: "Magdeburg, Germany",
    image: require("../assets/journeys/magdeburg.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "millau-viaduct",
    title: "Millau Viaduct",
    subtitle:
      "Walk the story of one of the world’s tallest bridges and its striking combination of design and engineering.",
    category: "Bridges & Engineering",
    country: "France",
    location: "Millau, France",
    image: require("../assets/journeys/millau.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "tower-bridge",
    title: "Tower Bridge",
    subtitle:
      "Explore London’s famous movable bridge and its role in the city’s transportation and maritime history.",
    category: "Bridges & Engineering",
    country: "United Kingdom",
    location: "London, England",
    image: require("../assets/journeys/towerbridge.png"),
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

    createJourney({
    id: "amazon-rainforest",
    title: "Amazon Rainforest",
    subtitle:
      "Journey through one of Earth’s most biodiverse environments and discover its ecological importance.",
    category: "Nature & Adventure",
    country: "Brazil",
    location: "Amazon Basin, South America",
    image: require("../assets/journeys/amazon.png"),
    miles: 50,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "banff-national-park",
    title: "Banff National Park",
    subtitle:
      "Walk through alpine lakes, mountain valleys, and the natural beauty of the Canadian Rockies.",
    category: "Nature & Adventure",
    country: "Canada",
    location: "Alberta, Canada",
    image: require("../assets/journeys/banff.png"),
    miles: 25,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "himalayas",
    title: "Himalayas",
    subtitle:
      "Explore the world’s highest mountain range through a journey of endurance, culture, and breathtaking landscapes.",
    category: "Nature & Adventure",
    country: "Nepal",
    location: "Himalayan Region",
    image: require("../assets/journeys/himalayas.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "irish-cliffs",
    title: "Irish Cliffs",
    subtitle:
      "Walk along dramatic Atlantic cliffs and discover the rugged natural beauty of Ireland.",
    category: "Nature & Adventure",
    country: "Ireland",
    location: "Western Ireland",
    image: require("../assets/journeys/irishcliffs.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "kilimanjaro-base-walk",
    title: "Kilimanjaro Base Walk",
    subtitle:
      "Journey toward the base of Africa’s highest mountain through changing landscapes and remarkable wildlife.",
    category: "Nature & Adventure",
    country: "Tanzania",
    location: "Mount Kilimanjaro, Tanzania",
    image: require("../assets/journeys/kilimanjaro.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "mount-fuji",
    title: "Mount Fuji",
    subtitle:
      "Explore Japan’s iconic mountain through a journey of nature, culture, and spiritual significance.",
    category: "Nature & Adventure",
    country: "Japan",
    location: "Honshu, Japan",
    image: require("../assets/journeys/mountfuji.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "niagara-falls",
    title: "Niagara Falls",
    subtitle:
      "Walk through the story of one of the world’s most famous waterfalls and the landscapes surrounding it.",
    category: "Nature & Adventure",
    country: "Canada / United States",
    location: "Ontario and New York",
    image: require("../assets/journeys/niagarafalls.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "norwegian-fjords",
    title: "Norwegian Fjords",
    subtitle:
      "Journey through deep fjords, towering cliffs, and dramatic coastal landscapes.",
    category: "Nature & Adventure",
    country: "Norway",
    location: "Western Norway",
    image: require("../assets/journeys/norwegianfjords.png"),
    miles: 40,
    difficulty: DIFFICULTY.EXPERT,
  }),

  createJourney({
    id: "patagonia",
    title: "Patagonia",
    subtitle:
      "Explore glaciers, mountains, and windswept wilderness across southern South America.",
    category: "Nature & Adventure",
    country: "Argentina / Chile",
    location: "Patagonia",
    image: require("../assets/journeys/patagonia.png"),
    miles: 75,
    difficulty: DIFFICULTY.EXPERT,
    premium: true,
  }),

  createJourney({
    id: "scottish-highlands",
    title: "Scottish Highlands",
    subtitle:
      "Walk through rugged mountains, ancient glens, and the dramatic landscapes of Scotland.",
    category: "Nature & Adventure",
    country: "United Kingdom",
    location: "Scotland",
    image: require("../assets/journeys/scottishhighlands.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "serengeti-trail",
    title: "Serengeti Trail",
    subtitle:
      "Journey through one of Africa’s most famous wildlife landscapes and migration routes.",
    category: "Nature & Adventure",
    country: "Tanzania",
    location: "Serengeti, Tanzania",
    image: require("../assets/journeys/serengeti.png"),
    miles: 45,
    difficulty: DIFFICULTY.EXPERT,
  }),

  createJourney({
    id: "swiss-alps",
    title: "Swiss Alps",
    subtitle:
      "Explore mountain villages, alpine valleys, and breathtaking European landscapes.",
    category: "Nature & Adventure",
    country: "Switzerland",
    location: "Swiss Alps",
    image: require("../assets/journeys/swissalps.png"),
    miles: 35,
    difficulty: DIFFICULTY.EXPERT,
  }),

  createJourney({
    id: "victoria-falls",
    title: "Victoria Falls",
    subtitle:
      "Walk through the history and natural power of one of the world’s largest waterfalls.",
    category: "Nature & Adventure",
    country: "Zambia / Zimbabwe",
    location: "Victoria Falls",
    image: require("../assets/journeys/victoriafalls.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

   

  createJourney({
    id: "cape-coast-castle",
    title: "Cape Coast Castle",
    subtitle:
      "Walk through the history of the transatlantic slave trade, remembrance, and the resilience of African people.",
    category: "African Heritage",
    country: "Ghana",
    location: "Cape Coast, Ghana",
    image: require("../assets/journeys/ghanacape.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "goree-island",
    title: "Gorée Island",
    subtitle:
      "Journey through a place of memory, migration, loss, and the enduring strength of African heritage.",
    category: "African Heritage",
    country: "Senegal",
    location: "Dakar, Senegal",
    
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "lake-victoria",
    title: "Lake Victoria",
    subtitle:
      "Explore the communities, waterways, trade, and cultural traditions surrounding Africa’s largest lake.",
    category: "African Heritage",
    country: "Kenya / Tanzania / Uganda",
    location: "East Africa",
    image: require("../assets/journeys/victoriafalls.png"),
    miles: 25,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "mandela-freedom-walk",
    title: "Mandela Freedom Walk",
    subtitle:
      "Follow the legacy of Nelson Mandela through courage, justice, leadership, and national transformation.",
    category: "African Heritage",
    country: "South Africa",
    location: "South Africa",
    image: require("../assets/journeys/nelsonmandela.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "timbuktu-trade-routes",
    title: "Timbuktu Trade Routes",
    subtitle:
      "Walk through the history of scholarship, trade, architecture, and cultural exchange across West Africa.",
    category: "African Heritage",
    country: "Mali",
    location: "Timbuktu, Mali",
    image: require("../assets/journeys/timbuktu.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "zanzibar-spice-route",
    title: "Zanzibar Spice Route",
    subtitle:
      "Explore the island’s trade history, Swahili culture, architecture, and global connections.",
    category: "African Heritage",
    country: "Tanzania",
    location: "Zanzibar, Tanzania",
   
    miles: 15,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "ethiopian-highlands-heritage",
    title: "Ethiopian Highlands Heritage",
    subtitle:
      "Journey through ancient kingdoms, sacred traditions, mountain landscapes, and Ethiopia’s enduring cultural legacy.",
    category: "African Heritage",
    country: "Ethiopia",
    location: "Ethiopian Highlands",
  
    miles: 40,
    difficulty: DIFFICULTY.EXPERT,
  }),

  createJourney({
    id: "dubai-modern-marvels",
    title: "Dubai Modern Marvels",
    subtitle:
      "Walk through one of the world's fastest-growing cities, showcasing innovation, architecture, and culture.",
    category: "Cities & Cultural Heritage",
    country: "United Arab Emirates",
    location: "Dubai, UAE",
    
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "istanbul-crossroads",
    title: "Istanbul Crossroads",
    subtitle:
      "Explore the city where Europe and Asia meet through centuries of history, trade, and architecture.",
    category: "Cities & Cultural Heritage",
    country: "Turkey",
    location: "Istanbul, Turkey",
    
    miles: 15,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "kyoto-temples",
    title: "Kyoto Temples",
    subtitle:
      "Journey through Japan's historic temples, gardens, and centuries of cultural tradition.",
    category: "Cities & Cultural Heritage",
    country: "Japan",
    location: "Kyoto, Japan",
    image: require("../assets/journeys/kyototemples.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "london-landmarks",
    title: "London Landmarks",
    subtitle:
      "Walk through iconic landmarks that tell the story of one of the world's most influential cities.",
    category: "Cities & Cultural Heritage",
    country: "United Kingdom",
    location: "London, England",
    
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "new-york-city",
    title: "New York City",
    subtitle:
      "Explore the neighborhoods, skyline, parks, and cultural diversity of the city that never sleeps.",
    category: "Cities & Cultural Heritage",
    country: "United States",
    location: "New York City, New York",
    
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "paris-landmarks",
    title: "Paris Landmarks",
    subtitle:
      "Walk through the art, architecture, cafés, and timeless beauty of the French capital.",
    category: "Cities & Cultural Heritage",
    country: "France",
    location: "Paris, France",
    
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "rio-de-janeiro",
    title: "Rio de Janeiro",
    subtitle:
      "Discover beaches, mountains, music, and vibrant Brazilian culture throughout this unforgettable city.",
    category: "Cities & Cultural Heritage",
    country: "Brazil",
    location: "Rio de Janeiro, Brazil",
    
    miles: 18,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "rome-landmarks",
    title: "Rome Landmarks",
    subtitle:
      "Walk through centuries of history, architecture, and cultural treasures in the Eternal City.",
    category: "Cities & Cultural Heritage",
    country: "Italy",
    location: "Rome, Italy",
    image: require("../assets/journeys/romanempire.png"),
    miles: 15,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "singapore-gardens",
    title: "Singapore Gardens",
    subtitle:
      "Explore one of the world's cleanest and most innovative cities through nature and urban design.",
    category: "Cities & Cultural Heritage",
    country: "Singapore",
    location: "Singapore",
    image: require("../assets/journeys/singapore.png"),
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "sydney-harbour",
    title: "Sydney Harbour",
    subtitle:
      "Journey across Australia's iconic harbour while discovering its history, culture, and waterfront landmarks.",
    category: "Cities & Cultural Heritage",
    country: "Australia",
    location: "Sydney, Australia",
    
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "tokyo-nights",
    title: "Tokyo Nights",
    subtitle:
      "Experience the energy, technology, food, and traditions of one of the world's greatest cities.",
    category: "Cities & Cultural Heritage",
    country: "Japan",
    location: "Tokyo, Japan",
    image: require("../assets/journeys/tokyonights.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "venice-canals",
    title: "Venice Canals",
    subtitle:
      "Walk through canals, bridges, architecture, and centuries of Venetian history.",
    category: "Cities & Cultural Heritage",
    country: "Italy",
    location: "Venice, Italy",
    image: require("../assets/journeys/venice.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),
  createJourney({
  id: "autism-awareness",
  title: "Autism Awareness",
  subtitle:
    "Walk to promote autism acceptance, inclusion, and support for individuals and families worldwide.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",
  image: require("../assets/journeys/autism.png"),
  miles: 12,
  difficulty: DIFFICULTY.MODERATE,
}),

createJourney({
  id: "breast-cancer-awareness",
  title: "Breast Cancer Awareness",
  subtitle:
    "Honor survivors, remember loved ones, and help raise awareness for early detection and research.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",
  image: require("../assets/journeys/breastcancer.png"),
  miles: 15,
  difficulty: DIFFICULTY.MODERATE,
}),

createJourney({
  id: "heart-health",
  title: "Heart Health Challenge",
  subtitle:
    "Improve cardiovascular health while supporting heart disease awareness and prevention.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",
  
  miles: 20,
  difficulty: DIFFICULTY.ADVANCED,
}),

createJourney({
  id: "mental-health-awareness",
  title: "Mental Health Awareness",
  subtitle:
    "Walk to encourage emotional wellness, resilience, and open conversations about mental health.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",
  
  miles: 15,
  difficulty: DIFFICULTY.MODERATE,
}),

createJourney({
  id: "diabetes-awareness",
  title: "Diabetes Awareness",
  subtitle:
    "Support healthy living while promoting diabetes education, prevention, and community awareness.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",

  miles: 18,
  difficulty: DIFFICULTY.ADVANCED,
}),

createJourney({
  id: "veterans-honor",
  title: "Veterans Honor Walk",
  subtitle:
    "Honor military veterans through a journey recognizing service, sacrifice, and national pride.",
  category: "Awareness Journeys",
  country: "United States",
  location: "United States",
  
  miles: 20,
  difficulty: DIFFICULTY.ADVANCED,
}),

createJourney({
  id: "world-peace",
  title: "World Peace Walk",
  subtitle:
    "Celebrate unity, compassion, and cooperation through a global community walking experience.",
  category: "Awareness Journeys",
  country: "Global",
  location: "Worldwide",
  
  miles: 25,
  difficulty: DIFFICULTY.ADVANCED,
}),

  createJourney({
    id: "gandhi-salt-march",
    title: "Gandhi Salt March",
    subtitle:
      "Follow the historic route of nonviolent resistance, independence, and social change.",
    category: "Historic Cultures",
    country: "India",
    location: "Ahmedabad to Dandi, India",
    
    miles: 25,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "maya-angelou-legacy",
    title: "Maya Angelou Legacy",
    subtitle:
      "Celebrate the life, writing, courage, and cultural impact of Maya Angelou.",
    category: "Historic Cultures",
    country: "United States",
    location: "United States",
    
    miles: 12,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "malcolm-x-harlem",
    title: "Malcolm X Harlem",
    subtitle:
      "Walk through Harlem while exploring the leadership, activism, and legacy of Malcolm X.",
    category: "Historic Cultures",
    country: "United States",
    location: "Harlem, New York",
   
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "martin-luther-king-memorial",
    title: "Martin Luther King Jr. Memorial",
    subtitle:
      "Honor the legacy of Dr. King through a journey focused on justice, leadership, and equality.",
    category: "Historic Cultures",
    country: "United States",
    location: "Washington, D.C.",
    
    miles: 8,
    difficulty: DIFFICULTY.EASY,
  }),

  createJourney({
    id: "black-wall-street",
    title: "Black Wall Street",
    subtitle:
      "Discover the prosperity, destruction, resilience, and legacy of Tulsa’s Greenwood District.",
    category: "Historic Cultures",
    country: "United States",
    location: "Tulsa, Oklahoma",
    image: require("../assets/journeys/blackwallstreet.png"),
    miles: 10,
    difficulty: DIFFICULTY.MODERATE,
  }),

  createJourney({
    id: "underground-railroad",
    title: "Underground Railroad",
    subtitle:
      "Follow stories of courage, escape, resistance, and the pursuit of freedom.",
    category: "Historic Cultures",
    country: "United States",
    location: "United States",
    image: require("../assets/journeys/undergroundrailroad.png"),
    miles: 30,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "nelson-mandela-freedom",
    title: "Nelson Mandela Freedom Journey",
    subtitle:
      "Walk through the story of resistance, reconciliation, leadership, and democracy.",
    category: "Historic Cultures",
    country: "South Africa",
    location: "South Africa",
    image: require("../assets/journeys/nelsonmandela.png"),
    miles: 20,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "maori-cultural-trail",
    title: "Māori Cultural Trail",
    subtitle:
      "Explore the traditions, language, land, and living heritage of the Māori people.",
    category: "Historic Cultures",
    country: "New Zealand",
    location: "New Zealand",
    
    miles: 18,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "aboriginal-heritage-walk",
    title: "Aboriginal Heritage Walk",
    subtitle:
      "Learn about the world’s oldest continuing cultures through land, art, story, and tradition.",
    category: "Historic Cultures",
    country: "Australia",
    location: "Australia",
    
    miles: 18,
    difficulty: DIFFICULTY.ADVANCED,
  }),

  createJourney({
    id: "silk-road",
    title: "Silk Road",
    subtitle:
      "Travel the ancient trade network that connected cultures, ideas, religions, and commerce.",
    category: "Historic Cultures",
    country: "Global",
    location: "Asia and Europe",
    image: require("../assets/journeys/silkroad.png"),
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "trans-siberian-trek",
    title: "Trans-Siberian Trek",
    subtitle:
      "Cross vast landscapes, historic cities, and cultural regions along one of the world’s longest routes.",
    category: "Global Journey",
    country: "Russia",
    location: "Russia",
    
    miles: 100,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
  }),

  createJourney({
    id: "global-legacy-journey",
    title: "Global Legacy Journey",
    subtitle:
      "Complete a worldwide journey celebrating history, wellness, culture, unity, and human achievement.",
    category: "Global Journey",
    country: "Global",
    location: "Worldwide",
    
    miles: 150,
    difficulty: DIFFICULTY.LEGENDARY,
    premium: true,
    estimatedTime: "6–12 months",
  }),
];


export const JOURNEY_CATALOG = rawJourneys;

export function getJourneyById(journeyId) {
  return JOURNEY_CATALOG.find(
    (journey) => journey.id === journeyId
  );
}

export function getJourneysByCategory(category) {
  return JOURNEY_CATALOG.filter(
    (journey) => journey.category === category
  );
}

export function getJourneysByDifficulty(difficulty) {
  return JOURNEY_CATALOG.filter(
    (journey) => journey.difficulty === difficulty
  );
}

export default JOURNEY_CATALOG;