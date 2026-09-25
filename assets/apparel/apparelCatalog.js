// assets/apparel/apparelCatalog.js

// ============================================================
// LEGATHON WALK — APPAREL CATALOG
// ============================================================

export const APPAREL_CATEGORIES = [
  "Mens",
  "Womens",
  "Accessories",
  "Hoodies",
  "T-Shirts",
  "Joggers",
  "Shorts",
  "Tanks",
  "Compression Shirts",
  "Compression Pants",
  "Biker Shorts",
  "Sports Bras",
  "Skirts",
  "Track Jackets",
  "Tracksuits",
  "Bags",
];


// ============================================================
// APPAREL CATALOG
// ============================================================

export const APPAREL_CATALOG = [

  // ==========================================================
  // ACCESSORIES
  // ==========================================================

  {
    id: "dufflebag-black",

    name: "Legathon Black Duffle Bag",

    category: "Accessories",

    productType: "Bags",

    gender: "Unisex",

    collection: "Legathon",

    price: 69.99,

    coins: 1200,

    colors: [
      "Black",
    ],

    sizes: [
      "One Size",
    ],

    image: require(
      "./accessories/dufflebag_black.png"
    ),

    imagesByColor: {
      Black: require(
        "./accessories/dufflebag_black.png"
      ),
    },

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  {
    id: "dufflebag-pink",

    name: "Legathon Pink Duffle Bag",

    category: "Accessories",

    productType: "Bags",

    gender: "Unisex",

    collection: "Legathon",

    price: 69.99,

    coins: 1200,

    colors: [
      "Pink",
    ],

    sizes: [
      "One Size",
    ],

    image: require(
      "./accessories/dufflebag_pink.png"
    ),

    imagesByColor: {
      Pink: require(
        "./accessories/dufflebag_pink.png"
      ),
    },

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  {
    id: "fanny-black",

    name: "Legathon Black Fanny Pack",

    category: "Accessories",

    productType: "Bags",

    gender: "Unisex",

    collection: "Legathon",

    price: 39.99,

    coins: 700,

    colors: [
      "Black",
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
    },

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  {
    id: "fanny-pink",

    name: "Legathon Pink Fanny Pack",

    category: "Accessories",

    productType: "Bags",

    gender: "Unisex",

    collection: "Legathon",

    price: 39.99,

    coins: 700,

    colors: [
      "Pink",
    ],

    sizes: [
      "One Size",
    ],

    image: require(
      "./accessories/fanny_pink.png"
    ),

    imagesByColor: {
      Pink: require(
        "./accessories/fanny_pink.png"
      ),
    },

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // MEN'S HOODIE
  // ==========================================================

  {
    id: "hoodie-mens",

    name: "Men's Legathon Hoodie",

    category: "Mens",

    productType: "Hoodies",

    gender: "Men",

    collection: "Legathon",

    price: 59.99,

    coins: 900,

    colors: [
      "Black",
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

    // Default store image
    image: require(
      "./hoodies/hoodie_black_mens.png"
    ),

    // Image changes when color changes
    imagesByColor: {
      Black: require(
        "./hoodies/hoodie_black_mens.png"
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
    },

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // WOMEN'S HOODIE
  // ==========================================================

  {
    id: "hoodie-womens",

    name: "Women's Legathon Hoodie",

    category: "Womens",

    productType: "Hoodies",

    gender: "Women",

    collection: "Legathon",

    price: 59.99,

    coins: 900,

    colors: [
      "Black",
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

    // Default store image
    image: require(
      "./hoodies/hoodie_black_womens.png"
    ),

    // Image changes with selected color
    imagesByColor: {
      Black: require(
        "./hoodies/hoodie_black_womens.png"
      ),

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

    purchaseType:
      "buy_redeem",

    unlockSteps: 0,
  },


  // ==========================================================
  // MEN'S T-SHIRT
  // ==========================================================

  {
    id: "tshirt-black-mens",

    name: "Men's Legathon T-Shirt",

    category: "Mens",

    productType: "T-Shirts",

    gender: "Men",

    collection: "Legathon",

    price: 24.99,

    coins: 250,

    colors: [
      "Black",
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
    },

    purchaseType:
      "buy_redeem",

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
// GET MAIN CATEGORY
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
// GET PRODUCT TYPE
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
// MEN'S PRODUCTS
// ============================================================

export function getMensApparel() {
  return getApparelByCategory(
    "Mens"
  );
}


// ============================================================
// WOMEN'S PRODUCTS
// ============================================================

export function getWomensApparel() {
  return getApparelByCategory(
    "Womens"
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