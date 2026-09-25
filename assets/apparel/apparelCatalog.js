// assets/apparel/apparelCatalog.js

// ============================================================
// LEGATHON WALK — IN-APP MERCHANDISE CATALOG
// ============================================================
//
// IN-APP STORE:
//
// • Hoodies
// • T-Shirts
// • Accessories
//
// Larger merchandise collections can remain on the website.
//
// ============================================================


// ============================================================
// STORE CATEGORIES
// ============================================================

export const APPAREL_CATEGORIES = [
  "Hoodies",
  "T-Shirts",
  "Accessories",
];


// ============================================================
// MERCHANDISE CATALOG
// ============================================================

export const APPAREL_CATALOG = [

  // ==========================================================
  // MEN'S HOODIE
  // ==========================================================

  {
    id: "hoodie-mens",

    name: "Men's Legathon Hoodie",

    category: "Hoodies",

    productType: "Hoodie",

    gender: "Men",

    collection: "Legathon",

    price: 59.99,

    coins: 900,

    colors: [
      "Blue",
      "Green",
      "Red",
      "White",
      "Yellow",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
    ],

    image: require(
      "./hoodies/hoodie_blue_mens.png"
    ),

    imagesByColor: {
      Blue: require(
        "./hoodies/hoodie_blue_mens.png"
      ),

      Green: require(
        "./hoodies/hoodie_green_mens.png"
      ),

      Red: require(
        "./hoodies/hoodie_red_mens.png"
      ),

      White: require(
        "./hoodies/hoodie_white_mens.png"
      ),

      Yellow: require(
        "./hoodies/hoodie_yellow_mens.png"
      ),
    },

    purchaseType: "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // WOMEN'S HOODIE
  // ==========================================================

  {
    id: "hoodie-womens",

    name: "Women's Legathon Hoodie",

    category: "Hoodies",

    productType: "Hoodie",

    gender: "Women",

    collection: "Legathon",

    price: 59.99,

    coins: 900,

    colors: [
      "Blue",
      "Green",
      "Red",
      "White",
    ],

    sizes: [
      "XS",
      "S",
      "M",
      "L",
      "XL",
    ],

    image: require(
      "./hoodies/hoodie_blue_womens.png"
    ),

    imagesByColor: {
      Blue: require(
        "./hoodies/hoodie_blue_womens.png"
      ),

      Green: require(
        "./hoodies/hoodie_green_womens.png"
      ),

      Red: require(
        "./hoodies/hoodie_red_womens.png"
      ),

      White: require(
        "./hoodies/hoodie_white_womens.png"
      ),
    },

    purchaseType: "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // MEN'S T-SHIRT
  // ==========================================================

  {
    id: "tshirt-mens",

    name: "Men's Legathon T-Shirt",

    category: "T-Shirts",

    productType: "T-Shirt",

    gender: "Men",

    collection: "Legathon",

    price: 24.99,

    coins: 250,

    colors: [
      "Black",
      "Blue",
      "Green",
      "Red",
      "White",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
    ],

    image: require(
      "./men tshirts/tshirt_black_mens.png"
    ),

    imagesByColor: {
      Black: require(
        "./men tshirts/tshirt_black_mens.png"
      ),

      Blue: require(
        "./men tshirts/tshirt_blue_mens.png"
      ),

      Green: require(
        "./men tshirts/tshirt_green_mens.png"
      ),

      Red: require(
        "./men tshirts/tshirt_red_mens.png"
      ),

      White: require(
        "./men tshirts/tshirt_white_mens.png"
      ),
    },

    purchaseType: "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // DUFFLE BAG
  // ==========================================================

  {
    id: "dufflebag",

    name: "Legathon Duffle Bag",

    category: "Accessories",

    productType: "Duffle Bag",

    gender: "Unisex",

    collection: "Legathon",

    price: 69.99,

    coins: 1200,

    colors: [
      "Black",
      "Pink",
    ],

    sizes: [
      "One Size",
    ],

    image: require(
      "./accessories/duffelbag_black.png"
    ),

    imagesByColor: {
      Black: require(
        "./accessories/duffelbag_black.png"
      ),

      Pink: require(
        "./accessories/duffelbag_pink.png"
      ),
    },

    purchaseType: "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // FANNY PACK
  // ==========================================================

  {
    id: "fanny-pack",

    name: "Legathon Fanny Pack",

    category: "Accessories",

    productType: "Fanny Pack",

    gender: "Unisex",

    collection: "Legathon",

    price: 39.99,

    coins: 700,

    colors: [
      "Black",
      "Pink",
    ],

    sizes: [
      "One Size",
    ],

    image: require(
      "./accessories/fanny_black.png"
    ),

    imagesByColor: {
      Black: require(
        "./accessories/fanny_black.png"
      ),

      Pink: require(
        "./accessories/fanny_pink.png"
      ),
    },

    purchaseType: "buy_redeem",

    unlockSteps: 0,
  },
];


// ============================================================
// GET PRODUCT BY ID
// ============================================================

export function getApparelItemById(
  itemId
) {
  return (
    APPAREL_CATALOG.find(
      (item) =>
        item.id === itemId
    ) || null
  );
}


// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

export function getApparelByCategory(
  category
) {
  return APPAREL_CATALOG.filter(
    (item) =>
      item.category ===
      category
  );
}


// ============================================================
// GET PRODUCTS BY TYPE
// ============================================================

export function getApparelByProductType(
  productType
) {
  return APPAREL_CATALOG.filter(
    (item) =>
      item.productType ===
      productType
  );
}


// ============================================================
// HOODIES
// ============================================================

export function getHoodies() {
  return getApparelByCategory(
    "Hoodies"
  );
}


// ============================================================
// T-SHIRTS
// ============================================================

export function getTShirts() {
  return getApparelByCategory(
    "T-Shirts"
  );
}


// ============================================================
// ACCESSORIES
// ============================================================

export function getAccessories() {
  return getApparelByCategory(
    "Accessories"
  );
}


// ============================================================
// STEP UNLOCK
// ============================================================

export function isApparelUnlocked(
  item,
  lifetimeSteps = 0
) {

  const requiredSteps =
    Math.max(
      0,
      Number(
        item?.unlockSteps || 0
      )
    );


  const userSteps =
    Math.max(
      0,
      Number(
        lifetimeSteps || 0
      )
    );


  return (
    userSteps >=
    requiredSteps
  );
}