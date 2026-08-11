export const COLLECTIONS = [
  {
    id: "basic",
    level: "Starter",
    stepsRequired: 0,
    color: "Black",
    badge: "⚫",
    unlockedText: "Default Starter Set",
    items: ["Black Hoodie", "Black Joggers", "Black Shoes"],
  },
  {
    id: "pathfinder",
    level: "Pathfinder",
    stepsRequired: 50000,
    color: "Green",
    badge: "🟢",
    unlockedText: "Earned Through Walking",
    items: ["Green Tracksuit", "Green Shoes", "Green Headphones"],
  },
  {
    id: "trailblazer",
    level: "Trailblazer",
    stepsRequired: 250000,
    color: "Red",
    badge: "🔴",
    unlockedText: "Earned Through Walking",
    items: ["Red Performance Hoodie", "Red Joggers", "Red Running Shoes"],
  },
  {
    id: "legend",
    level: "Legend",
    stepsRequired: 1000000,
    color: "Gold",
    badge: "🟡",
    unlockedText: "Earned Through Walking",
    items: ["Gold Performance Jacket", "Gold Compression Shirt", "Gold Backpack", "Gold Water Bottle"],
  },
  {
    id: "blackLegacy",
    level: "Black Legacy",
    stepsRequired: 5000000,
    color: "Black & Gold",
    badge: "⚫🟡",
    unlockedText: "No Shortcuts. Only Walking.",
    items: ["Black Legacy Jacket", "Black Legacy Shoes", "Black Legacy Watch", "Black Legacy Backpack", "Black Legacy Medal"],
  },
];

export const STORE_PRODUCTS = [
  {
    id: "blue-hoodie",
    collectionId: "explorer",
    name: "Blue Hoodie",
    retailPrice: 49.99,
    coinCost: 2000,
    discount: 20,
  },
  {
    id: "green-tracksuit",
    collectionId: "pathfinder",
    name: "Green Tracksuit",
    retailPrice: 89.99,
    coinCost: 3000,
    discount: 30,
  },
  {
    id: "red-hoodie",
    collectionId: "trailblazer",
    name: "Red Performance Hoodie",
    retailPrice: 59.99,
    coinCost: 2500,
    discount: 25,
  },
  {
    id: "gold-jacket",
    collectionId: "legend",
    name: "Gold Performance Jacket",
    retailPrice: 129.99,
    coinCost: 5000,
    discount: 50,
  },
  {
    id: "black-legacy-jacket",
    collectionId: "blackLegacy",
    name: "Black Legacy Jacket",
    retailPrice: 199.99,
    coinCost: 0,
    discount: 0,
    noShortcut: true,
  },
];

export function getUnlockedCollections(totalSteps) {
  return COLLECTIONS.map((collection) => ({
    ...collection,
    unlocked: totalSteps >= collection.stepsRequired,
  }));
}

export function getCurrentCollection(totalSteps) {
  return [...COLLECTIONS]
    .reverse()
    .find((collection) => totalSteps >= collection.stepsRequired);
}

export function getUnlockedStoreProducts(totalSteps) {
  const unlockedCollections = getUnlockedCollections(totalSteps)
    .filter((c) => c.unlocked)
    .map((c) => c.id);

  return STORE_PRODUCTS.map((product) => ({
    ...product,
    unlocked: unlockedCollections.includes(product.collectionId),
    userPays: Math.max(product.retailPrice - product.discount, 0),
  }));
}