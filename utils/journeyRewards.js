import AsyncStorage from "@react-native-async-storage/async-storage";
import { addWCoins } from "./wcoinStorage";

const JOURNEY_REWARDS_KEY = "LEGACY_WALK_JOURNEY_REWARDS";
const LEGACY_POINTS_KEY = "LEGACY_WALK_LEGACY_POINTS";
const AVATAR_XP_KEY = "LEGACY_WALK_AVATAR_XP";




export const JOURNEY_REWARDS = {
  "chichen-itza": {
    title: "Chichén Itzá Complete",
    distanceMiles: 24,
    totalSteps: 48000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "machu-picchu": {
    title: "Machu Picchu Complete",
    distanceMiles: 42,
    totalSteps: 84000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  petra: {
    title: "Petra Complete",
    distanceMiles: 36,
    totalSteps: 72000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "angkor-wat": {
    title: "Angkor Wat Complete",
    distanceMiles: 31,
    totalSteps: 62000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "great-wall-of-china": {
    title: "Great Wall of China Complete",
    distanceMiles: 100,
    totalSteps: 200000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "terracotta-army": {
    title: "Terracotta Army Complete",
    distanceMiles: 28,
    totalSteps: 56000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "forbidden-city": {
    title: "Forbidden City Complete",
    distanceMiles: 22,
    totalSteps: 44000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "roman-empire": {
    title: "Roman Empire Complete",
    distanceMiles: 75,
    totalSteps: 150000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "nile-civilization": {
    title: "Nile Civilization Complete",
    distanceMiles: 80,
    totalSteps: 160000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "great-zimbabwe": {
    title: "Great Zimbabwe Complete",
    distanceMiles: 34,
    totalSteps: 68000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "acropolis-athens": {
    title: "Acropolis of Athens Complete",
    distanceMiles: 18,
    totalSteps: 36000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "camino-de-santiago": {
    title: "Camino de Santiago Complete",
    distanceMiles: 500,
    totalSteps: 1000000,
    wCoins: 8000,
    rewardPoints: 8000,
    avatarXP: 5200,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "kumano-kodo": {
    title: "Kumano Kodo Complete",
    distanceMiles: 106,
    totalSteps: 212000,
    wCoins: 4000,
    rewardPoints: 4000,
    avatarXP: 2600,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "mecca-pilgrimage-routes": {
    title: "Mecca Pilgrimage Routes Complete",
    distanceMiles: 55,
    totalSteps: 110000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "via-dolorosa": {
    title: "Via Dolorosa Complete",
    distanceMiles: 12,
    totalSteps: 24000,
    wCoins: 250,
    rewardPoints: 250,
    avatarXP: 250,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "mount-sinai": {
    title: "Mount Sinai Complete",
    distanceMiles: 32,
    totalSteps: 64000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "bodh-gaya": {
    title: "Bodh Gaya Complete",
    distanceMiles: 20,
    totalSteps: 40000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "lourdes-pilgrimage": {
    title: "Lourdes Pilgrimage Complete",
    distanceMiles: 26,
    totalSteps: 52000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "vatican-pilgrim-walk": {
    title: "Vatican Pilgrim Walk Complete",
    distanceMiles: 15,
    totalSteps: 30000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "st-patricks-way": {
    title: "St. Patrick’s Way Complete",
    distanceMiles: 82,
    totalSteps: 164000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "canterbury-pilgrimage": {
    title: "Canterbury Pilgrimage Complete",
    distanceMiles: 153,
    totalSteps: 306000,
    wCoins: 6000,
    rewardPoints: 6000,
    avatarXP: 3900,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "great-buddha": {
    title: "Great Buddha Complete",
    distanceMiles: 17,
    totalSteps: 34000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "boston-freedom-trail": {
    title: "Boston Freedom Trail Complete",
    distanceMiles: 16,
    totalSteps: 32000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

    "liberty-trail": {
    title: "Liberty Trail Complete",
    distanceMiles: 20,
    totalSteps: 40000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "oregon-trail": {
    title: "Oregon Trail Complete",
    distanceMiles: 2170,
    totalSteps: 4340000,
    wCoins: 18000,
    rewardPoints: 18000,
    avatarXP: 11700,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "lewis-and-clark": {
    title: "Lewis & Clark National Historic Trail Complete",
    distanceMiles: 3700,
    totalSteps: 7400000,
    wCoins: 25000,
    rewardPoints: 25000,
    avatarXP: 16250,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "route-66": {
    title: "Route 66 Complete",
    distanceMiles: 2448,
    totalSteps: 4896000,
    wCoins: 18000,
    rewardPoints: 18000,
    avatarXP: 11700,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "gettysburg-battlefield": {
    title: "Gettysburg Battlefield Complete",
    distanceMiles: 24,
    totalSteps: 48000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "ellis-island": {
    title: "Ellis Island Complete",
    distanceMiles: 14,
    totalSteps: 28000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "alamo-walk": {
    title: "Alamo Walk Complete",
    distanceMiles: 13,
    totalSteps: 26000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "selma-to-montgomery": {
    title: "Selma to Montgomery Complete",
    distanceMiles: 54,
    totalSteps: 108000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "golden-gate-bridge": {
    title: "Golden Gate Bridge Complete",
    distanceMiles: 18,
    totalSteps: 36000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "brooklyn-bridge": {
    title: "Brooklyn Bridge Complete",
    distanceMiles: 14,
    totalSteps: 28000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "tower-bridge": {
    title: "Tower Bridge Complete",
    distanceMiles: 12,
    totalSteps: 24000,
    wCoins: 250,
    rewardPoints: 250,
    avatarXP: 250,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "akashi-kaikyo-bridge": {
    title: "Akashi Kaikyo Bridge Complete",
    distanceMiles: 16,
    totalSteps: 32000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "millau-viaduct": {
    title: "Millau Viaduct Complete",
    distanceMiles: 18,
    totalSteps: 36000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "chapel-bridge": {
    title: "Chapel Bridge Complete",
    distanceMiles: 10,
    totalSteps: 20000,
    wCoins: 250,
    rewardPoints: 250,
    avatarXP: 250,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "magdeburg-water-bridge": {
    title: "Magdeburg Water Bridge Complete",
    distanceMiles: 14,
    totalSteps: 28000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "danyang-kunshan-grand-bridge": {
    title: "Danyang–Kunshan Grand Bridge Complete",
    distanceMiles: 102,
    totalSteps: 204000,
    wCoins: 4000,
    rewardPoints: 4000,
    avatarXP: 2600,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "timbuktu-heritage": {
    title: "Timbuktu Heritage Complete",
    distanceMiles: 38,
    totalSteps: 76000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "victoria-falls": {
    title: "Victoria Falls Complete",
    distanceMiles: 30,
    totalSteps: 60000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "serengeti-trail": {
    title: "Serengeti Trail Complete",
    distanceMiles: 90,
    totalSteps: 180000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "kilimanjaro-base-walk": {
    title: "Kilimanjaro Base Walk Complete",
    distanceMiles: 65,
    totalSteps: 130000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "ghana-cape-coast-castle": {
    title: "Ghana Cape Coast Castle Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "nelson-mandela-freedom-walk": {
    title: "Nelson Mandela Freedom Walk Complete",
    distanceMiles: 46,
    totalSteps: 92000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "ethiopian-highlands": {
    title: "Ethiopian Highlands Complete",
    distanceMiles: 72,
    totalSteps: 144000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },
    "zanzibar-spice-route": {
    title: "Zanzibar Spice Route Complete",
    distanceMiles: 29,
    totalSteps: 58000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "goree-island": {
    title: "Gorée Island Complete",
    distanceMiles: 18,
    totalSteps: 36000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "eiffel-tower": {
    title: "Eiffel Tower Complete",
    distanceMiles: 12,
    totalSteps: 24000,
    wCoins: 250,
    rewardPoints: 250,
    avatarXP: 250,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "venice-canals": {
    title: "Venice Canals Complete",
    distanceMiles: 21,
    totalSteps: 42000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "swiss-alps": {
    title: "Swiss Alps Complete",
    distanceMiles: 85,
    totalSteps: 170000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "berlin-wall": {
    title: "Berlin Wall Complete",
    distanceMiles: 27,
    totalSteps: 54000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "scottish-highlands": {
    title: "Scottish Highlands Complete",
    distanceMiles: 96,
    totalSteps: 192000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "irish-cliffs": {
    title: "Irish Cliffs Complete",
    distanceMiles: 34,
    totalSteps: 68000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "norwegian-fjords": {
    title: "Norwegian Fjords Complete",
    distanceMiles: 88,
    totalSteps: 176000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "prague-old-town": {
    title: "Prague Old Town Complete",
    distanceMiles: 18,
    totalSteps: 36000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "london-landmarks": {
    title: "London Landmarks Complete",
    distanceMiles: 26,
    totalSteps: 52000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "paris-landmarks": {
    title: "Paris Landmarks Complete",
    distanceMiles: 24,
    totalSteps: 48000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "tokyo-nights": {
    title: "Tokyo Nights Complete",
    distanceMiles: 22,
    totalSteps: 44000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "kyoto-temples": {
    title: "Kyoto Temples Complete",
    distanceMiles: 30,
    totalSteps: 60000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "seoul-heritage": {
    title: "Seoul Heritage Complete",
    distanceMiles: 24,
    totalSteps: 48000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "singapore-gardens": {
    title: "Singapore Gardens Complete",
    distanceMiles: 19,
    totalSteps: 38000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  himalayas: {
    title: "Himalayas Complete",
    distanceMiles: 120,
    totalSteps: 240000,
    wCoins: 4000,
    rewardPoints: 4000,
    avatarXP: 2600,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "mount-fuji": {
    title: "Mount Fuji Complete",
    distanceMiles: 45,
    totalSteps: 90000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "silk-road": {
    title: "Silk Road Complete",
    distanceMiles: 4000,
    totalSteps: 8000000,
    wCoins: 25000,
    rewardPoints: 25000,
    avatarXP: 16250,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "istanbul-crossroads": {
    title: "Istanbul Crossroads Complete",
    distanceMiles: 28,
    totalSteps: 56000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "sydney-harbor": {
    title: "Sydney Harbor Complete",
    distanceMiles: 22,
    totalSteps: 44000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "amazon-rainforest": {
    title: "Amazon Rainforest Complete",
    distanceMiles: 95,
    totalSteps: 190000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  patagonia: {
    title: "Patagonia Complete",
    distanceMiles: 110,
    totalSteps: 220000,
    wCoins: 4000,
    rewardPoints: 4000,
    avatarXP: 2600,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },
    "banff-national-park": {
    title: "Banff National Park Complete",
    distanceMiles: 70,
    totalSteps: 140000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "niagara-falls": {
    title: "Niagara Falls Complete",
    distanceMiles: 20,
    totalSteps: 40000,
    wCoins: 500,
    rewardPoints: 500,
    avatarXP: 300,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "pacific-coast-highway": {
    title: "Pacific Coast Highway Complete",
    distanceMiles: 656,
    totalSteps: 1312000,
    wCoins: 8000,
    rewardPoints: 8000,
    avatarXP: 5200,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "coast-to-coast-usa": {
    title: "Coast to Coast USA Complete",
    distanceMiles: 2800,
    totalSteps: 5600000,
    wCoins: 18000,
    rewardPoints: 18000,
    avatarXP: 11700,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "around-the-world": {
    title: "Around the World Complete",
    distanceMiles: 10000,
    totalSteps: 20000000,
    wCoins: 25000,
    rewardPoints: 25000,
    avatarXP: 16250,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "underground-railroad": {
    title: "Underground Railroad Complete",
    distanceMiles: 800,
    totalSteps: 1600000,
    wCoins: 12000,
    rewardPoints: 12000,
    avatarXP: 7800,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "freedom-riders-trail": {
    title: "Freedom Riders Trail Complete",
    distanceMiles: 436,
    totalSteps: 872000,
    wCoins: 8000,
    rewardPoints: 8000,
    avatarXP: 5200,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "rosa-parks-freedom-walk": {
    title: "Rosa Parks Freedom Walk Complete",
    distanceMiles: 22,
    totalSteps: 44000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "black-wall-street": {
    title: "Black Wall Street Complete",
    distanceMiles: 30,
    totalSteps: 60000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "mlk-legacy-walk": {
    title: "MLK Legacy Walk Complete",
    distanceMiles: 42,
    totalSteps: 84000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "malcolm-x-harlem": {
    title: "Malcolm X Harlem Complete",
    distanceMiles: 28,
    totalSteps: 56000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "maya-angelou-journey": {
    title: "Maya Angelou Journey Complete",
    distanceMiles: 32,
    totalSteps: 64000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "autism-awareness": {
    title: "Autism Awareness Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "breast-cancer-awareness": {
    title: "Breast Cancer Awareness Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Pink Collection",
    unlockColor: "pink",
  },

  "cancer-awareness": {
    title: "Cancer Awareness Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Explorer",
    unlockCollection: "Purple Collection",
    unlockColor: "purple",
  },

  "heart-challenge": {
    title: "Heart Challenge Complete",
    distanceMiles: 30,
    totalSteps: 60000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Heart Hero",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },

  "mental-health-awareness": {
    title: "Mental Health Awareness Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Wellness Champion",
    unlockCollection: "Teal Collection",
    unlockColor: "teal",
  },

  "diabetes-awareness": {
    title: "Diabetes Awareness Complete",
    distanceMiles: 25,
    totalSteps: 50000,
    wCoins: 800,
    rewardPoints: 800,
    avatarXP: 500,
    badge: "Health Advocate",
    unlockCollection: "Blue Collection",
    unlockColor: "blue",
  },

  "veterans-honor-walk": {
    title: "Veterans Honor Walk Complete",
    distanceMiles: 40,
    totalSteps: 80000,
    wCoins: 1200,
    rewardPoints: 1200,
    avatarXP: 800,
    badge: "Honor Guard",
    unlockCollection: "Patriot Collection",
    unlockColor: "navy",
  },

  "trans-siberian-trek": {
    title: "Trans-Siberian Trek Complete",
    distanceMiles: 5772,
    totalSteps: 11544000,
    wCoins: 25000,
    rewardPoints: 25000,
    avatarXP: 16250,
    badge: "Elite",
    unlockCollection: "Black & Gold Collection",
    unlockColor: "black",
  },

  "lycian-way": {
    title: "The Lycian Way Complete",
    distanceMiles: 335,
    totalSteps: 670000,
    wCoins: 6000,
    rewardPoints: 6000,
    avatarXP: 3900,
    badge: "Legend",
    unlockCollection: "Yellow Collection",
    unlockColor: "yellow",
  },

  "cordillera-huayhuash": {
    title: "Cordillera Huayhuash Circuit Complete",
    distanceMiles: 81,
    totalSteps: 162000,
    wCoins: 3100,
    rewardPoints: 3100,
    avatarXP: 2000,
    badge: "Pathfinder",
    unlockCollection: "Green Collection",
    unlockColor: "green",
  },

  "chornohora-ridge": {
    title: "Chornohora Ridge Complete",
    distanceMiles: 58,
    totalSteps: 116000,
    wCoins: 1800,
    rewardPoints: 1800,
    avatarXP: 1150,
    badge: "Trailblazer",
    unlockCollection: "Red Collection",
    unlockColor: "red",
  },
  };

const JOURNEY_ID_ALIASES = {
  greatwall: "great-wall-of-china",
  amazon: "amazon-rainforest",
  autism: "autism-awareness",
  blackwallstreet: "black-wall-street",
  route66: "route-66",
  lewisandclark: "lewis-and-clark",
  goldengate: "golden-gate-bridge",
  brooklynbridge: "brooklyn-bridge",
};

const normalizeJourneyId = id =>
  String(id || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

export const resolveJourneyRewardId = journeyId => {
  const raw = String(journeyId || "").trim();

  if (JOURNEY_REWARDS[raw]) return raw;

  if (JOURNEY_ID_ALIASES[raw]) {
    return JOURNEY_ID_ALIASES[raw];
  }

  const normalized = normalizeJourneyId(raw);

  if (JOURNEY_REWARDS[normalized]) {
    return normalized;
  }

  if (JOURNEY_ID_ALIASES[normalized]) {
    return JOURNEY_ID_ALIASES[normalized];
  }

  return null;
};

const rewardClaimKey = journeyId =>
  `${JOURNEY_REWARDS_KEY}_${journeyId}`;

const readNumber = async key => {
  const value = await AsyncStorage.getItem(key);
  return Number(value || 0);
};


export const hasClaimedJourneyReward = async journeyId => {
  const id = resolveJourneyRewardId(journeyId);

  if (!id) return false;

  const claimed = await AsyncStorage.getItem(
    rewardClaimKey(id)
  );

  return claimed === "true";
};

export const completeJourneyReward = async journeyId => {
  const id = resolveJourneyRewardId(journeyId);

  if (!id) {
    throw new Error(
      `Unknown journey reward: ${journeyId}`
    );
  }

  const reward = JOURNEY_REWARDS[id];

  const claimed = await AsyncStorage.getItem(
    rewardClaimKey(id)
  );

  if (claimed === "true") {
    return {
      awarded: false,
      reward,
    };
  }

  await AsyncStorage.setItem(
    rewardClaimKey(id),
    "pending"
  );

  try {
  const coinsToAward = Math.max(
    0,
    Math.floor(
      Number(reward?.wCoins || 0)
    )
  );

  const rewardPoints = Math.max(
    0,
    Math.floor(
      Number(reward?.rewardPoints || 0)
    )
  );

  const avatarXP = Math.max(
    0,
    Math.floor(
      Number(reward?.avatarXP || 0)
    )
  );

  const walletResult = await addWCoins(
    coinsToAward
  );

  const currentPoints =
    await readNumber(
      LEGACY_POINTS_KEY
    );

  const currentXP =
    await readNumber(
      AVATAR_XP_KEY
    );

  await AsyncStorage.multiSet([
    [
      LEGACY_POINTS_KEY,
      String(
        currentPoints +
          rewardPoints
      ),
    ],
    [
      AVATAR_XP_KEY,
      String(
        currentXP +
          avatarXP
      ),
    ],
    [
      rewardClaimKey(id),
      "true",
    ],
  ]);

  console.log(
    "JOURNEY REWARD AWARDED:",
    {
      journeyId: id,
      coinsToAward,
      walletResult,
    }
  );

  return {
  awarded: true,
  reward,
  addedWCoins:
    Number(reward.wCoins || 0),
  walletResult,
};
} catch (error) {
  await AsyncStorage.removeItem(
    rewardClaimKey(id)
  );

  console.log(
    "COMPLETE JOURNEY REWARD ERROR:",
    error
  );

  throw error;
}
};
export const resetJourneyReward = async journeyId => {
  const id = resolveJourneyRewardId(journeyId);

  if (!id) return;

  await AsyncStorage.removeItem(
    rewardClaimKey(id)
  );
};

export const getJourneyReward = journeyId => {
  const id = resolveJourneyRewardId(journeyId);

  if (!id) {
    return null;
  }

  return JOURNEY_REWARDS[id] || null;
};

export const getJourneyRewardCount = () =>
  Object.keys(JOURNEY_REWARDS).length;

export default JOURNEY_REWARDS;