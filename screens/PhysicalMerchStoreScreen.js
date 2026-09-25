// screens/PhysicalMerchStoreScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";



import {
  getWCoins,
} from "../utils/wcoinStorage";

import {
  APPAREL_CATALOG,
} from "../assets/apparel/apparelCatalog";


// ============================================================
// LEGATHON WALK — PHYSICAL MERCH STORE
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


const MAIN_CATEGORIES = [
  "Mens",
  "Womens",
  "Accessories",
];


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  const numeric =
    Number(value);

  return Number.isFinite(numeric)
    ? numeric
    : fallback;
}


// ============================================================
// SCREEN
// ============================================================

export default function PhysicalMerchStoreScreen({
  language,

  goBack,

  openItem,

  goToPurchaseConfirmation,

  wCoinBalance:
    incomingBalance = 0,

  lifetimeSteps = 0,

  spendWCoins,
}) {
  


  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Mens");


  const [
    wCoinBalance,
    setWCoinBalance,
  ] = useState(
    safeNumber(
      incomingBalance,
      0
    )
  );


  // ==========================================================
  // REAL LIFETIME STEPS
  // ==========================================================

  const totalSteps =
    Math.max(
      0,
      safeNumber(
        lifetimeSteps,
        0
      )
    );


  // ==========================================================
  // WCOIN BALANCE
  // ==========================================================

  const refreshWCoinBalance =
    useCallback(
      async () => {
        try {
          const storedBalance =
            await getWCoins();


          const latestBalance =
            safeNumber(
              storedBalance,
              safeNumber(
                incomingBalance,
                0
              )
            );


          setWCoinBalance(
            latestBalance
          );


          console.log(
            "STORE WCOIN BALANCE:",
            latestBalance
          );

        } catch (error) {
          console.error(
            "STORE BALANCE REFRESH ERROR:",
            error
          );


          setWCoinBalance(
            safeNumber(
              incomingBalance,
              0
            )
          );
        }
      },
      [
        incomingBalance,
      ]
    );


  useEffect(() => {
    refreshWCoinBalance();
  }, [
    refreshWCoinBalance,
  ]);


  // ==========================================================
  // UPDATE WHEN PARENT BALANCE CHANGES
  // ==========================================================

  useEffect(() => {
    const latest =
      safeNumber(
        incomingBalance,
        0
      );


    setWCoinBalance(
      (current) => {
        if (
          latest !== current &&
          latest >= 0
        ) {
          return latest;
        }

        return current;
      }
    );
  }, [
    incomingBalance,
  ]);


  // ==========================================================
  // FILTER STORE
  // ==========================================================

  const filteredItems =
    useMemo(() => {
      return APPAREL_CATALOG.filter(
        (item) =>
          item.category ===
          activeCategory
      );
    }, [
      activeCategory,
    ]);


  // ==========================================================
  // OPEN PRODUCT
  // ==========================================================

 const handleProductPress = (
  item,
  unlocked
) => {
  if (!unlocked) {
    return;
  }

  console.log(
    "OPEN PRODUCT:",
    item?.name ||
      item?.title ||
      item?.id
  );

  // OPEN PRODUCT DETAILS FIRST
  if (
    typeof openItem ===
    "function"
  ) {
    openItem(item);
    return;
  }

  // FALLBACK ONLY
  if (
    typeof goToPurchaseConfirmation ===
    "function"
  ) {
    goToPurchaseConfirmation(
      item
    );
  }
};


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      <ScrollView
        style={
          styles.scroll
        }
        showsVerticalScrollIndicator={
          false
        }
       contentContainerStyle={
  styles.content
}
      >

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        {typeof goBack ===
          "function" && (

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
            <Text
              style={
                styles.backText
              }
            >
              ‹ Back
            </Text>
          </TouchableOpacity>
        )}


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View
          style={
            styles.header
          }
        >
          <Text
            style={
              styles.kicker
            }
          >
            LEGATHON WALK STORE
          </Text>


          <Text
            style={
              styles.title
            }
          >
            Official Store
          </Text>


          <Text
            style={
              styles.subTitle
            }
          >
            Premium apparel, accessories, and exclusive Legathon Walk gear.
          </Text>
        </View>


        {/* ================================================= */}
        {/* WCOIN WALLET */}
        {/* ================================================= */}

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
              {Math.floor(
                wCoinBalance
              ).toLocaleString()}
            </Text>
          </View>


          <Text
            style={
              styles.walletSub
            }
          >
            Use W Coins toward eligible Legathon gear and merchandise.
          </Text>
        </View>


        {/* ================================================= */}
        {/* LIFETIME WALKING */}
        {/* ================================================= */}

        <View
          style={
            styles.stepsCard
          }
        >
          <Text
            style={
              styles.stepsLabel
            }
          >
            LIFETIME WALKING PROGRESS
          </Text>


          <Text
            style={
              styles.stepsAmount
            }
          >
            {Math.floor(
              totalSteps
            ).toLocaleString()}
          </Text>


          <Text
            style={
              styles.stepsUnit
            }
          >
            Lifetime Steps
          </Text>
        </View>


        {/* ================================================= */}
        {/* CATEGORIES */}
        {/* ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={
            styles.categoryScroll
          }
          contentContainerStyle={
            styles.categoryContent
          }
        >
          {MAIN_CATEGORIES.map(
            (
              category
            ) => {

              const active =
                category ===
                activeCategory;


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
                    setActiveCategory(
                      category
                    )
                  }
                  activeOpacity={
                    0.85
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


        {/* ================================================= */}
        {/* COLLECTION TITLE */}
        {/* ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {activeCategory ===
          "Mens"
            ? "Men's Collection"

            : activeCategory ===
              "Womens"
              ? "Women's Collection"

              : "Accessories"}
        </Text>


        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        <View
          style={
            styles.grid
          }
        >
          {filteredItems.map(
            (
              item
            ) => {

              const unlockSteps =
                Math.max(
                  0,
                  safeNumber(
                    item.unlockSteps,
                    0
                  )
                );


              const unlocked =
                totalSteps >=
                unlockSteps;


              const productName =
                item.title ||
                item.name ||
                "Legathon Item";


              const collection =
                item.collection ||
                "Legathon";


              const price =
                safeNumber(
                  item.price,
                  0
                );


              const coinCost =
                Math.max(
                  0,
                  safeNumber(
                    item.coins,
                    0
                  )
                );


              const canAfford =
                wCoinBalance >=
                coinCost;


              return (
                <View
                  key={
                    item.id
                  }
                  style={[
                    styles.productCard,

                    !unlocked &&
                      styles.lockedCard,
                  ]}
                >

                  {/* IMAGE */}

                  <View
                    style={
                      styles.imageWrap
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


                    {!unlocked && (
                      <View
                        style={
                          styles.lockOverlay
                        }
                      >
                        <Text
                          style={
                            styles.lockIcon
                          }
                        >
                          🔒
                        </Text>


                        <Text
                          style={
                            styles.lockText
                          }
                        >
                          LOCKED
                        </Text>
                      </View>
                    )}
                  </View>


                  {/* NAME */}

                  <Text
                    style={
                      styles.productName
                    }
                    numberOfLines={
                      2
                    }
                  >
                    {productName}
                  </Text>


                  <Text
                    style={
                      styles.collectionText
                    }
                  >
                    {collection} Gear
                  </Text>


                  {/* PRICE */}

                  <Text
                    style={
                      styles.price
                    }
                  >
                    ${price.toFixed(
                      2
                    )}
                  </Text>


                  {/* WCOIN */}

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
                        styles.coinCost
                      }
                    >
                      {coinCost.toLocaleString()}
                    </Text>
                  </View>


                  {/* LOCK REQUIREMENT */}

                  {!unlocked &&
                    unlockSteps >
                      0 && (

                    <View
                      style={
                        styles.requirementBox
                      }
                    >
                      <Text
                        style={
                          styles.requirementLabel
                        }
                      >
                        UNLOCK AT
                      </Text>


                      <Text
                        style={
                          styles.requirementValue
                        }
                      >
                        {unlockSteps.toLocaleString()} steps
                      </Text>
                    </View>
                  )}


                  {/* COIN STATUS */}

                  {unlocked &&
                    coinCost >
                      0 && (

                    <Text
                      style={[
                        styles.coinStatus,

                        canAfford
                          ? styles.coinStatusReady
                          : styles.coinStatusLow,
                      ]}
                    >
                      {canAfford
                        ? "W Coins available"
                        : "More W Coins needed"}
                    </Text>
                  )}


                  {/* BUY */}

                  <TouchableOpacity
                    style={[
                      styles.buyButton,

                      unlocked
                        ? styles.buyButtonActive
                        : styles.buyButtonLocked,
                    ]}
                    disabled={
                      !unlocked
                    }
                    onPress={() =>
                      handleProductPress(
                        item,
                        unlocked
                      )
                    }
                    activeOpacity={
                      0.85
                    }
                  >
                    <Text
                      style={[
                        styles.buyText,

                        !unlocked &&
                          styles.buyTextLocked,
                      ]}
                    >
                      {unlocked
                        ? "Buy / Redeem"
                        : "Locked"}
                    </Text>
                  </TouchableOpacity>

                </View>
              );
            }
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex:
        1,

      backgroundColor:
        "#050914",
    },


    scroll: {
      flex:
        1,

      backgroundColor:
        "#050914",
    },

content: {
  paddingHorizontal: 20,
  paddingTop: 24,
  paddingBottom: 260,
},



    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf:
        "flex-start",

      minHeight:
        46,

      paddingHorizontal:
        20,

      borderRadius:
        24,

      borderWidth:
        1.5,

      borderColor:
        "#E7C447",

      backgroundColor:
        "#071224",

      justifyContent:
        "center",

      marginBottom:
        18,
    },


    backText: {
      color:
        "#E7C447",

      fontSize:
        18,

      fontWeight:
        "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
      marginBottom:
        22,
    },


    kicker: {
      color:
        "#E7C447",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        3.2,

      marginBottom:
        8,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      lineHeight:
        48,

      fontWeight:
        "900",
    },


    subTitle: {
      color:
        "#AAB3C5",

      fontSize:
        16,

      fontWeight:
        "700",

      lineHeight:
        24,

      marginTop:
        10,
    },


    // ========================================================
    // WALLET
    // ========================================================

    walletCard: {
      backgroundColor:
        "#071224",

      borderRadius:
        26,

      borderWidth:
        1.5,

      borderColor:
        "#D4AF37",

      padding:
        20,

      marginBottom:
        16,
    },


    walletLabel: {
      color:
        "#A7F3D0",

      fontSize:
        13,

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
        40,

      height:
        40,

      resizeMode:
        "contain",

      marginRight:
        14,
    },


    walletAmount: {
      color:
        "#FFFFFF",

      fontSize:
        48,

      fontWeight:
        "900",
    },


    walletSub: {
      color:
        "#AAB3C5",

      fontSize:
        15,

      fontWeight:
        "700",

      lineHeight:
        22,

      marginTop:
        10,
    },


    // ========================================================
    // STEPS
    // ========================================================

    stepsCard: {
      backgroundColor:
        "#0B182B",

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "#1E415C",

      padding:
        18,

      marginBottom:
        4,
    },


    stepsLabel: {
      color:
        "#A7F3D0",

      fontSize:
        11,

      fontWeight:
        "900",

      letterSpacing:
        2,
    },


    stepsAmount: {
      color:
        "#FFFFFF",

      fontSize:
        34,

      fontWeight:
        "900",

      marginTop:
        6,
    },


    stepsUnit: {
      color:
        "#AAB3C5",

      fontSize:
        13,

      fontWeight:
        "700",

      marginTop:
        2,
    },


    // ========================================================
    // CATEGORY
    // ========================================================

    categoryScroll: {
      marginTop:
        18,

      marginBottom:
        20,
    },


    categoryContent: {
      paddingRight:
        20,
    },


    categoryPill: {
      minWidth:
        112,

      height:
        44,

      marginRight:
        10,

      borderRadius:
        24,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#101B2E",

      borderWidth:
        1,

      borderColor:
        "#103557",

      paddingHorizontal:
        16,
    },


    categoryPillActive: {
      backgroundColor:
        "#F2C438",

      borderColor:
        "#F2C438",
    },


    categoryText: {
      color:
        "#B8C4D9",

      fontSize:
        15,

      fontWeight:
        "800",
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
        30,

      lineHeight:
        38,

      fontWeight:
        "900",

      letterSpacing:
        1.5,

      marginBottom:
        20,

      // Prevents clipping of tall characters.
      paddingTop:
        2,
    },


    // ========================================================
    // GRID
    // ========================================================

    grid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",
    },


    // ========================================================
    // PRODUCT
    // ========================================================

    productCard: {
      width:
        "48%",

      backgroundColor:
        "#0B182B",

      borderRadius:
        24,

      borderWidth:
        1,

      borderColor:
        "#1E334A",

      padding:
        12,

      marginBottom:
        18,
    },


    lockedCard: {
      opacity:
        0.78,
    },


    imageWrap: {
      width:
        "100%",

      height:
        150,

      borderRadius:
        18,

      backgroundColor:
        "#050914",

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
        "92%",

      height:
        "92%",

      resizeMode:
        "contain",
    },


    // ========================================================
    // LOCK
    // ========================================================

    lockOverlay: {
      position:
        "absolute",

      left:
        0,

      right:
        0,

      top:
        0,

      bottom:
        0,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(0,0,0,0.58)",
    },


    lockIcon: {
      fontSize:
        24,

      marginBottom:
        6,
    },


    lockText: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",

      letterSpacing:
        3,
    },


    // ========================================================
    // PRODUCT DETAILS
    // ========================================================

    productName: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      lineHeight:
        22,

      fontWeight:
        "900",

      minHeight:
        44,

      marginBottom:
        4,
    },


    collectionText: {
      color:
        "#AAB3C5",

      fontSize:
        12,

      fontWeight:
        "800",

      marginBottom:
        8,
    },


    price: {
      color:
        "#FFFFFF",

      fontSize:
        25,

      fontWeight:
        "900",

      marginBottom:
        8,
    },


    // ========================================================
    // WCOIN
    // ========================================================

    coinRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom:
        9,
    },


    smallCoin: {
      width:
        23,

      height:
        23,

      resizeMode:
        "contain",

      marginRight:
        8,
    },


    coinCost: {
      color:
        "#F2C438",

      fontSize:
        18,

      fontWeight:
        "900",
    },


    coinStatus: {
      fontSize:
        11,

      fontWeight:
        "900",

      marginBottom:
        10,
    },


    coinStatusReady: {
      color:
        "#A7F3D0",
    },


    coinStatusLow: {
      color:
        "#FF9CA8",
    },


    // ========================================================
    // REQUIREMENT
    // ========================================================

    requirementBox: {
      backgroundColor:
        "#111B2D",

      borderRadius:
        12,

      padding:
        9,

      marginBottom:
        10,

      borderWidth:
        1,

      borderColor:
        "#253A52",
    },


    requirementLabel: {
      color:
        "#8497AE",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        1.3,
    },


    requirementValue: {
      color:
        "#E7C447",

      fontSize:
        12,

      fontWeight:
        "900",

      marginTop:
        3,
    },


    // ========================================================
    // BUY
    // ========================================================

    buyButton: {
      minHeight:
        48,

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        8,
    },


    buyButtonActive: {
      backgroundColor:
        "#F2C438",
    },


    buyButtonLocked: {
      backgroundColor:
        "#263244",
    },


    buyText: {
      color:
        "#00142D",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    buyTextLocked: {
      color:
        "#8C9AAE",
    },
  });