// screens/MarketplaceScreen.js

import React, {
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  translate,
} from "../i18n/i18n";


// ============================================================
// LEGATHON WALK — MARKETPLACE
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


const CATEGORIES = [
  "Mens",
  "Womens",
  "Accessories",
];


// ============================================================
// SUBSCRIPTION PLANS
// ============================================================

const PLANS = [
  {
    id: "free",

    name: "Free",

    price: "$0",

    perks: [
      "12 free Journeys",
      "Community access",
      "Leaderboard access",
      "Basic Walking Analytics",
    ],
  },

  {
    id: "premium",

    name: "Premium",

    price: "$4.99 / month",

    perks: [
      "Full Journey collection",
      "26 Legathon Marathons",
      "AI Wellness Coach",
      "AI Walking Coach",
      "Walking Pace & Mobility Trends",
      "WCoin merchandise discounts",
    ],
  },

  {
    id: "elite",

    name: "Elite",

    price: "$9.99 / month",

    perks: [
      "Everything in Premium",
      "Personal Wellness Coach",
      "Enhanced WCoin redemption",
      "Free shipping on eligible merchandise",
    ],
  },
];


// ============================================================
// STORE ITEMS
// ============================================================

export const STORE_ITEMS = [

  // ==========================================================
  // ACCESSORIES
  // ==========================================================

  {
    id: "dufflebag-black",

    category:
      "Accessories",

    title:
      "Legathon Black Duffle Bag",

    price:
      69.99,

    coins:
      1200,

    image:
      require(
        "../assets/apparel/accessories/dufflebag_black.png"
      ),
  },

  {
    id: "dufflebag-pink",

    category:
      "Accessories",

    title:
      "Legathon Pink Duffle Bag",

    price:
      69.99,

    coins:
      1200,

    image:
      require(
        "../assets/apparel/accessories/dufflebag_pink.png"
      ),
  },

  {
    id: "fanny-black",

    category:
      "Accessories",

    title:
      "Legathon Black Fanny Pack",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/accessories/fanny_black.png"
      ),
  },

  {
    id: "fanny-pink",

    category:
      "Accessories",

    title:
      "Legathon Pink Fanny Pack",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/accessories/fanny_pink.png"
      ),
  },


  // ==========================================================
  // BIKER SHORTS
  // ==========================================================

  {
    id:
      "bikers-black-womens",

    category:
      "Womens",

    title:
      "Black Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_black_womens.png"
      ),
  },

  {
    id:
      "bikers-blue-womens",

    category:
      "Womens",

    title:
      "Blue Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_blue_womens.png"
      ),
  },

  {
    id:
      "bikers-green-womens",

    category:
      "Womens",

    title:
      "Green Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_green_womens.png"
      ),
  },

  {
    id:
      "bikers-grey-womens",

    category:
      "Womens",

    title:
      "Grey Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_grey_womens.png"
      ),
  },

  {
    id:
      "bikers-pink-womens",

    category:
      "Womens",

    title:
      "Pink Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_pink_womens.png"
      ),
  },

  {
    id:
      "bikers-red-womens",

    category:
      "Womens",

    title:
      "Red Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_red_womens.png"
      ),
  },

  {
    id:
      "bikers-white-womens",

    category:
      "Womens",

    title:
      "White Women Biker Shorts",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/biker_shorts/bikers_white_womens.png"
      ),
  },


  // ==========================================================
  // COMPRESSION PANTS
  // ==========================================================

  {
    id:
      "compressor-black-men-pants",

    category:
      "Mens",

    title:
      "Black Men Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_black_men.png"
      ),
  },

  {
    id:
      "compressor-black-women-pants",

    category:
      "Womens",

    title:
      "Black Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_black_women.png"
      ),
  },

  {
    id:
      "compressor-blue-men-pants",

    category:
      "Mens",

    title:
      "Blue Men Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_blue_men.png"
      ),
  },

  {
    id:
      "compressor-blue-womens-pants",

    category:
      "Womens",

    title:
      "Blue Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_blue_womens.png"
      ),
  },

  {
    id:
      "compressor-grey-womens-pants",

    category:
      "Womens",

    title:
      "Grey Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_grey_womens.png"
      ),
  },

  {
    id:
      "compressor-pink-womens-pants",

    category:
      "Womens",

    title:
      "Pink Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_pink_womens.png"
      ),
  },

  {
    id:
      "compressor-red-men-pants",

    category:
      "Mens",

    title:
      "Red Men Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_red_men.png"
      ),
  },

  {
    id:
      "compressor-red-womens-pants",

    category:
      "Womens",

    title:
      "Red Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_red_womens.png"
      ),
  },

  {
    id:
      "compressor-white-men-pants",

    category:
      "Mens",

    title:
      "White Men Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_white_men.png"
      ),
  },

  {
    id:
      "compressor-white-womens-pants",

    category:
      "Womens",

    title:
      "White Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_white_womens.png"
      ),
  },

  {
    id:
      "compressor-yellow-womens-pants",

    category:
      "Womens",

    title:
      "Yellow Women Compression Pants",

    price:
      39.99,

    coins:
      700,

    image:
      require(
        "../assets/apparel/compressor_pants/compressor_yellow_womens.png"
      ),
  },


  // ==========================================================
  // COMPRESSION SHIRTS
  // ==========================================================

  {
    id:
      "compressor-black-men-shirt",

    category:
      "Mens",

    title:
      "Black Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_black_men.png"
      ),
  },

  {
    id:
      "compressor-blue-men-shirt",

    category:
      "Mens",

    title:
      "Blue Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_blue_men.png"
      ),
  },

  {
    id:
      "compressor-blue-womens-shirt",

    category:
      "Womens",

    title:
      "Blue Women Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_blue_womens.png"
      ),
  },

  {
    id:
      "compressor-green-women-shirt",

    category:
      "Womens",

    title:
      "Green Women Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_green_women.png"
      ),
  },

  {
    id:
      "compressor-grey-men-shirt",

    category:
      "Mens",

    title:
      "Grey Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_grey_men.png"
      ),
  },

  {
    id:
      "compressor-red-men-shirt",

    category:
      "Mens",

    title:
      "Red Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_red_men.png"
      ),
  },

  {
    id:
      "compressor-red-womens-shirt",

    category:
      "Womens",

    title:
      "Red Women Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_red_womens.png"
      ),
  },

  {
    id:
      "compressor-white-men-shirt",

    category:
      "Mens",

    title:
      "White Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_white_men.png"
      ),
  },

  {
    id:
      "compressor-white-womens-shirt",

    category:
      "Womens",

    title:
      "White Women Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_white_womens.png"
      ),
  },

  {
    id:
      "compressor-yellow-men-shirt",

    category:
      "Mens",

    title:
      "Yellow Men Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_yellow_men.png"
      ),
  },

  {
    id:
      "compressor-yellow-womens-shirt",

    category:
      "Womens",

    title:
      "Yellow Women Compression Shirt",

    price:
      34.99,

    coins:
      650,

    image:
      require(
        "../assets/apparel/compressor_shirts/compressor_yellow_womens.png"
      ),
  },


  // ==========================================================
  // HOODIES
  // ==========================================================

  {
    id:
      "hoodie-black-mens",

    category:
      "Mens",

    title:
      "Black Men Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_black_mens.png"
      ),
  },

  {
    id:
      "hoodie-black-womens",

    category:
      "Womens",

    title:
      "Black Women Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_black_womens.png"
      ),
  },

  {
    id:
      "hoodie-blue-womens",

    category:
      "Womens",

    title:
      "Blue Women Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_blue_womens.png"
      ),
  },

  {
    id:
      "hoodie-green-mens",

    category:
      "Mens",

    title:
      "Green Men Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_green_mens.png"
      ),
  },

  {
    id:
      "hoodie-green-womens",

    category:
      "Womens",

    title:
      "Green Women Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_green_womens.png"
      ),
  },

  {
    id:
      "hoodie-red-mens",

    category:
      "Mens",

    title:
      "Red Men Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_red_mens.png"
      ),
  },

  {
    id:
      "hoodie-red-womens",

    category:
      "Womens",

    title:
      "Red Women Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_red_womens.png"
      ),
  },

  {
    id:
      "hoodie-white-mens",

    category:
      "Mens",

    title:
      "White Men Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_white_mens.png"
      ),
  },

  {
    id:
      "hoodie-white-womens",

    category:
      "Womens",

    title:
      "White Women Hoodie",

    price:
      49.99,

    coins:
      1000,

    image:
      require(
        "../assets/apparel/hoodies/hoodie_white_womens.png"
      ),
  },


  // ==========================================================
  // MEN T-SHIRTS
  // ==========================================================

  {
    id:
      "tshirt-black-mens",

    category:
      "Mens",

    title:
      "Black Men T-Shirt",

    price:
      24.99,

    coins:
      400,

    image:
      require(
        "../assets/apparel/men tshirts/tshirt_black_mens.png"
      ),
  },

  {
    id:
      "tshirt-blue-mens",

    category:
      "Mens",

    title:
      "Blue Men T-Shirt",

    price:
      24.99,

    coins:
      400,

    image:
      require(
        "../assets/apparel/men tshirts/tshirt_blue_mens.png"
      ),
  },

  {
    id:
      "tshirt-green-mens",

    category:
      "Mens",

    title:
      "Green Men T-Shirt",

    price:
      24.99,

    coins:
      400,

    image:
      require(
        "../assets/apparel/men tshirts/tshirt_green_mens.png"
      ),
  },

  {
    id:
      "tshirt-red-mens",

    category:
      "Mens",

    title:
      "Red Men T-Shirt",

    price:
      24.99,

    coins:
      400,

    image:
      require(
        "../assets/apparel/men tshirts/tshirt_red_mens.png"
      ),
  },

  {
    id:
      "tshirt-white-mens",

    category:
      "Mens",

    title:
      "White Men T-Shirt",

    price:
      24.99,

    coins:
      400,

    image:
      require(
        "../assets/apparel/men tshirts/tshirt_white_mens.png"
      ),
  },


  // ==========================================================
  // WOMEN SHORTS
  // ==========================================================

  {
    id:
      "shorts-black",

    category:
      "Womens",

    title:
      "Black Shorts",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/shorts/shorts_black.png"
      ),
  },

  {
    id:
      "shorts-blue",

    category:
      "Womens",

    title:
      "Blue Shorts",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/shorts/shorts_blue.png"
      ),
  },

  {
    id:
      "shorts-green",

    category:
      "Womens",

    title:
      "Green Shorts",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/shorts/shorts_green.png"
      ),
  },

  {
    id:
      "shorts-red",

    category:
      "Womens",

    title:
      "Red Shorts",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/shorts/shorts_red.png"
      ),
  },

  {
    id:
      "shorts-white",

    category:
      "Womens",

    title:
      "White Shorts",

    price:
      29.99,

    coins:
      500,

    image:
      require(
        "../assets/apparel/shorts/shorts_white.png"
      ),
  },


  // ==========================================================
  // SPORTS BRAS
  // ==========================================================

  {
    id:
      "sport-black-womens",

    category:
      "Womens",

    title:
      "Black Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_black_womens.png"
      ),
  },

  {
    id:
      "sport-blackwhite-womens",

    category:
      "Womens",

    title:
      "Black White Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_blackwhite_womens.png"
      ),
  },

  {
    id:
      "sport-blue-womens",

    category:
      "Womens",

    title:
      "Blue Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_blue_womens.png"
      ),
  },

  {
    id:
      "sport-green-women",

    category:
      "Womens",

    title:
      "Green Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_green_women.png"
      ),
  },

  {
    id:
      "sport-grey-womens",

    category:
      "Womens",

    title:
      "Grey Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_grey_womens.png"
      ),
  },

  {
    id:
      "sport-pink-womens",

    category:
      "Womens",

    title:
      "Pink Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_pink_womens.png"
      ),
  },

  {
    id:
      "sport-red-womens",

    category:
      "Womens",

    title:
      "Red Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_red_womens.png"
      ),
  },

  {
    id:
      "sport-white-women",

    category:
      "Womens",

    title:
      "White Sports Bra",

    price:
      34.99,

    coins:
      600,

    image:
      require(
        "../assets/apparel/sports_bra/sport_white_women.png"
      ),
  },
];


// ============================================================
// MARKETPLACE SCREEN
// ============================================================

export default function MarketplaceScreen({
  language = "en",

  goBack,

  wCoins = 4250,

  memberTier = "Free Member",

  onBuyProduct,

  onBuyWithCoins,

  onSubscribe,
}) {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Mens");


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(() => {

      return STORE_ITEMS.filter(
        (item) =>
          item.category ===
          selectedCategory
      );

    }, [
      selectedCategory,
    ]);


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* =============================================== */}
      {/* HEADER */}
      {/* =============================================== */}

      <View
        style={
          styles.headerRow
        }
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={
            goBack
          }
          activeOpacity={
            0.8
          }
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>


        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={
              styles.kicker
            }
          >
            LEGATHON WALK
          </Text>

          <Text
            style={
              styles.title
            }
          >
            Store
          </Text>
        </View>
      </View>


      {/* =============================================== */}
      {/* WCOIN WALLET */}
      {/* =============================================== */}

      <View
        style={
          styles.walletCard
        }
      >
        <Text
          style={
            styles.walletLabel
          }
        >
          W COIN BALANCE
        </Text>


        <View
          style={
            styles.walletRow
          }
        >
          <Image
            source={
              WCOIN
            }
            style={
              styles.coinIcon
            }
          />

          <Text
            style={
              styles.walletAmount
            }
          >
            {Number(
              wCoins || 0
            ).toLocaleString()}
          </Text>
        </View>


        <Text
          style={
            styles.walletText
          }
        >
          Use W Coins toward eligible Legathon gear and merchandise.
        </Text>


        <Text
          style={
            styles.memberText
          }
        >
          {memberTier}
        </Text>
      </View>


      {/* =============================================== */}
      {/* CATEGORIES */}
      {/* =============================================== */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.categoryRow
        }
      >
        {CATEGORIES.map(
          (category) => {

            const active =
              selectedCategory ===
              category;


            return (
              <TouchableOpacity
                key={
                  category
                }
                style={[
                  styles.categoryPill,

                  active &&
                    styles.categoryPillActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryText,

                    active &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </ScrollView>


      {/* =============================================== */}
      {/* COLLECTION */}
      {/* =============================================== */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        {selectedCategory ===
        "Mens"
          ? "Men's Collection"

          : selectedCategory ===
            "Womens"
            ? "Women's Collection"

            : "Accessories"}
      </Text>


      <View
        style={
          styles.grid
        }
      >
        {filteredProducts.map(
          (item) => (

            <ProductCard
              key={
                item.id
              }
              item={
                item
              }
              language={
                language
              }
              onBuyProduct={
                onBuyProduct
              }
              onBuyWithCoins={
                onBuyWithCoins
              }
            />
          )
        )}
      </View>


      {/* =============================================== */}
      {/* SUBSCRIPTIONS */}
      {/* =============================================== */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Subscription Plans
      </Text>


      {PLANS.map(
        (plan) => (

          <View
            key={
              plan.id
            }
            style={
              styles.planCard
            }
          >
            <View
              style={
                styles.planTop
              }
            >

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.planName
                  }
                >
                  {plan.name}
                </Text>

                <Text
                  style={
                    styles.planPrice
                  }
                >
                  {plan.price}
                </Text>
              </View>


              {plan.id !==
                "free" && (

                <TouchableOpacity
                  style={
                    styles.subscribeButton
                  }
                  onPress={() =>
                    onSubscribe?.(
                      plan
                    )
                  }
                >
                  <Text
                    style={
                      styles.subscribeButtonText
                    }
                  >
                    Upgrade
                  </Text>
                </TouchableOpacity>
              )}
            </View>


            {plan.perks.map(
              (perk) => (

                <Text
                  key={
                    perk
                  }
                  style={
                    styles.planPerk
                  }
                >
                  • {perk}
                </Text>
              )
            )}
          </View>
        )
      )}

    </ScrollView>
  );
}


// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({
  item,

  language,

  onBuyProduct,

  onBuyWithCoins,
}) {

  return (
    <View
      style={
        styles.productCard
      }
    >

      <View
        style={
          styles.imageBox
        }
      >
        <Image
          source={
            item.image
          }
          style={
            styles.productImage
          }
        />
      </View>


      <Text
        style={
          styles.productCategory
        }
      >
        {item.category}
      </Text>


      <Text
        style={
          styles.productTitle
        }
      >
        {item.title}
      </Text>


      <Text
        style={
          styles.productPrice
        }
      >
        ${Number(
          item.price
        ).toFixed(2)}
      </Text>


      <View
        style={
          styles.coinRow
        }
      >
        <Image
          source={
            WCOIN
          }
          style={
            styles.smallCoin
          }
        />

        <Text
          style={
            styles.coinPrice
          }
        >
          {Number(
            item.coins
          ).toLocaleString()}
        </Text>
      </View>


      <Text
        style={
          styles.availableText
        }
      >
        Available now
      </Text>


      <TouchableOpacity
        style={
          styles.buyButton
        }
        onPress={() =>
          onBuyProduct?.(
            item
          )
        }
      >
        <Text
          style={
            styles.buyButtonText
          }
        >
          {translate(
            language,
            "buyNow"
          ) || "Buy Now"}
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={
          styles.coinButton
        }
        onPress={() =>
          onBuyWithCoins?.(
            item
          )
        }
      >
        <Image
          source={
            WCOIN
          }
          style={
            styles.buttonCoin
          }
        />

        <Text
          style={
            styles.coinButtonText
          }
        >
          Use W Coins
        </Text>
      </TouchableOpacity>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex:
        1,

      backgroundColor:
        "#05070C",
    },


    content: {
      paddingHorizontal:
        20,

      paddingTop:
        58,

      paddingBottom:
        180,
    },


    // ========================================================
    // HEADER
    // ========================================================

    headerRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom:
        24,
    },


    backButton: {
      width:
        46,

      height:
        46,

      borderRadius:
        23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#101827",

      borderWidth:
        1,

      borderColor:
        "#263244",

      marginRight:
        14,
    },


    kicker: {
      color:
        "#A7F3D0",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        4,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      fontWeight:
        "900",

      marginTop:
        2,
    },


    // ========================================================
    // WALLET
    // ========================================================

    walletCard: {
      backgroundColor:
        "#0F172A",

      borderRadius:
        28,

      borderWidth:
        1.5,

      borderColor:
        "#D4AF37",

      padding:
        22,

      marginBottom:
        22,
    },


    walletLabel: {
      color:
        "#A7F3D0",

      fontSize:
        14,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginBottom:
        12,
    },


    walletRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    coinIcon: {
      width:
        42,

      height:
        42,

      resizeMode:
        "contain",

      marginRight:
        14,
    },


    walletAmount: {
      color:
        "#FFFFFF",

      fontSize:
        52,

      fontWeight:
        "900",
    },


    walletText: {
      color:
        "#CBD5E1",

      fontSize:
        16,

      fontWeight:
        "700",

      marginTop:
        10,

      lineHeight:
        24,
    },


    memberText: {
      color:
        "#D4AF37",

      fontSize:
        15,

      fontWeight:
        "900",

      marginTop:
        12,
    },


    // ========================================================
    // CATEGORY
    // ========================================================

    categoryRow: {
      paddingVertical:
        8,

      paddingRight:
        20,

      marginBottom:
        26,
    },


    categoryPill: {
      minWidth:
        145,

      minHeight:
        50,

      paddingHorizontal:
        24,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        25,

      borderWidth:
        1,

      borderColor:
        "#334155",

      backgroundColor:
        "#111827",

      marginRight:
        12,
    },


    categoryPillActive: {
      backgroundColor:
        "#E0AE25",

      borderColor:
        "#E0AE25",
    },


    categoryText: {
      color:
        "#CBD5E1",

      fontSize:
        16,

      fontWeight:
        "900",
    },


    categoryTextActive: {
      color:
        "#000000",
    },


    // ========================================================
    // SECTION
    // ========================================================

    sectionTitle: {
      color:
        "#A7F3D0",

      fontSize:
        28,

      fontWeight:
        "900",

      letterSpacing:
        2,

      marginBottom:
        18,
    },


    // ========================================================
    // PRODUCT GRID
    // ========================================================

    grid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginBottom:
        30,
    },


    productCard: {
      width:
        "48%",

      backgroundColor:
        "#0F172A",

      borderRadius:
        24,

      borderWidth:
        1,

      borderColor:
        "#263244",

      padding:
        14,

      marginBottom:
        16,
    },


    imageBox: {
      height:
        145,

      backgroundColor:
        "#020617",

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        14,

      overflow:
        "hidden",
    },


    productImage: {
      width:
        "100%",

      height:
        150,

      resizeMode:
        "contain",
    },


    productCategory: {
      color:
        "#D4AF37",

      fontSize:
        12,

      fontWeight:
        "900",

      textTransform:
        "uppercase",
    },


    productTitle: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "900",

      marginTop:
        6,

      minHeight:
        48,
    },


    productPrice: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginTop:
        8,
    },


    coinRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop:
        8,
    },


    smallCoin: {
      width:
        22,

      height:
        22,

      marginRight:
        8,

      resizeMode:
        "contain",
    },


    coinPrice: {
      color:
        "#D4AF37",

      fontSize:
        18,

      fontWeight:
        "900",
    },


    availableText: {
      color:
        "#A7F3D0",

      fontSize:
        12,

      fontWeight:
        "900",

      marginTop:
        10,

      marginBottom:
        12,
    },


    // ========================================================
    // BUTTONS
    // ========================================================

    buyButton: {
      backgroundColor:
        "#E0AE25",

      borderRadius:
        18,

      paddingVertical:
        12,

      alignItems:
        "center",

      marginBottom:
        8,
    },


    buyButtonText: {
      color:
        "#000000",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    coinButton: {
      minHeight:
        46,

      backgroundColor:
        "#111827",

      borderRadius:
        18,

      flexDirection:
        "row",

      justifyContent:
        "center",

      alignItems:
        "center",

      borderWidth:
        1,

      borderColor:
        "#D4AF37",
    },


    buttonCoin: {
      width:
        20,

      height:
        20,

      resizeMode:
        "contain",

      marginRight:
        7,
    },


    coinButtonText: {
      color:
        "#D4AF37",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    // ========================================================
    // SUBSCRIPTIONS
    // ========================================================

    planCard: {
      backgroundColor:
        "#0F172A",

      borderRadius:
        24,

      borderWidth:
        1,

      borderColor:
        "#263244",

      padding:
        18,

      marginBottom:
        16,
    },


    planTop: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom:
        12,
    },


    planName: {
      color:
        "#FFFFFF",

      fontSize:
        26,

      fontWeight:
        "900",
    },


    planPrice: {
      color:
        "#D4AF37",

      fontSize:
        20,

      fontWeight:
        "900",

      marginTop:
        4,
    },


    planPerk: {
      color:
        "#CBD5E1",

      fontSize:
        15,

      fontWeight:
        "700",

      lineHeight:
        22,

      marginTop:
        6,
    },


    subscribeButton: {
      backgroundColor:
        "#E0AE25",

      borderRadius:
        999,

      paddingVertical:
        10,

      paddingHorizontal:
        18,
    },


    subscribeButtonText: {
      color:
        "#000000",

      fontSize:
        15,

      fontWeight:
        "900",
    },
  });