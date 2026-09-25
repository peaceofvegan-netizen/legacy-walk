// screens/StoreItemDetailScreen.js

import React, {
  useEffect,
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
  SafeAreaView,
} from "react-native";

const WCOIN =
  require("../assets/wcoin.png");


// ============================================================
// LEGATHON WALK
// STORE ITEM DETAIL SCREEN
// ============================================================

export default function StoreItemDetailScreen({
  language = "en",
  item = null,
  goBack,
  goToPurchaseConfirmation,
}) {

  // ==========================================================
  // PRODUCT OPTIONS
  // ==========================================================

  const colors =
    Array.isArray(
      item?.colors
    )
      ? item.colors
      : [];


  const sizes =
    Array.isArray(
      item?.sizes
    )
      ? item.sizes
      : [];


  // ==========================================================
  // SELECTED OPTIONS
  // ==========================================================

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    colors[0] || ""
  );


  const [
    selectedSize,
    setSelectedSize,
  ] = useState(
    sizes[0] || ""
  );


  // ==========================================================
  // RESET OPTIONS WHEN PRODUCT CHANGES
  // ==========================================================

  useEffect(() => {

    setSelectedColor(
      colors[0] || ""
    );


    setSelectedSize(
      sizes[0] || ""
    );

  }, [
    item?.id,
  ]);


  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

  const productName =
    item?.name ||
    item?.title ||
    "Legathon Walk Item";


  // ==========================================================
  // PRICE
  // ==========================================================

  const price =
    useMemo(() => {

      const rawPrice =
        item?.price ??
        item?.retailPrice ??
        item?.amount ??
        0;


      if (
        typeof rawPrice ===
        "number"
      ) {

        return Math.max(
          rawPrice,
          0
        );
      }


      const parsed =
        Number(
          String(
            rawPrice
          )
            .replace(
              "$",
              ""
            )
            .replace(
              /,/g,
              ""
            )
            .trim()
        );


      return Number.isFinite(
        parsed
      )
        ? Math.max(
            parsed,
            0
          )
        : 0;

    }, [
      item?.price,
      item?.retailPrice,
      item?.amount,
    ]);


  // ==========================================================
  // WCOIN VALUE
  // ==========================================================

  const coins =
    Math.max(
      0,

      Math.floor(
        Number(
          item?.coins ??
          item?.coinDiscount ??
          0
        ) || 0
      )
    );


  // ==========================================================
  // OTHER PRODUCT INFORMATION
  // ==========================================================

  const gender =
    item?.gender ||
    "Unisex";


  const category =
    item?.category ||
    "Merchandise";


  const productType =
    item?.productType ||
    category;


  const collection =
    item?.collection ||
    "Legathon";


  // ==========================================================
  // SELECT PRODUCT IMAGE BASED ON COLOR
  // ==========================================================

  const selectedImage =
    useMemo(() => {

      if (
        selectedColor &&
        item?.imagesByColor?.[
          selectedColor
        ]
      ) {

        return (
          item.imagesByColor[
            selectedColor
          ]
        );
      }


      return (
        item?.image ||
        null
      );

    }, [
      item,
      selectedColor,
    ]);


  // ==========================================================
  // DETERMINE IF OPTIONS ARE READY
  // ==========================================================

  const colorRequired =
    colors.length > 0;


  const sizeRequired =
    sizes.length > 0;


  const hasSelectedColor =
    !colorRequired ||
    Boolean(
      selectedColor
    );


  const hasSelectedSize =
    !sizeRequired ||
    Boolean(
      selectedSize
    );


  const readyToPurchase =
    hasSelectedColor &&
    hasSelectedSize;


  // ==========================================================
  // CONTINUE TO PURCHASE
  // ==========================================================

  const handlePurchase =
    () => {

      if (
        !readyToPurchase
      ) {
        return;
      }


      if (
        typeof goToPurchaseConfirmation !==
        "function"
      ) {
        return;
      }


      const selectedItem = {

        ...item,


        // ------------------------------------------------------
        // SELECTED CUSTOMER OPTIONS
        // ------------------------------------------------------

        selectedColor:
          selectedColor ||
          null,


        selectedSize:
          selectedSize ||
          null,


        // ------------------------------------------------------
        // MAKE CHECKOUT USE SELECTED COLOR IMAGE
        // ------------------------------------------------------

        image:
          selectedImage,


        // ------------------------------------------------------
        // PRODUCT DETAILS
        // ------------------------------------------------------

        name:
          productName,

        price,

        coins,
      };


      console.log(
        "STORE ITEM SELECTED:",
        {
          id:
            selectedItem?.id,

          name:
            selectedItem?.name,

          color:
            selectedItem
              ?.selectedColor,

          size:
            selectedItem
              ?.selectedSize,

          price:
            selectedItem?.price,
        }
      );


      goToPurchaseConfirmation(
        selectedItem
      );
    };


  // ==========================================================
  // NO ITEM
  // ==========================================================

  if (!item) {

    return (
      <SafeAreaView
        style={
          styles.safe
        }
      >

        <View
          style={
            styles.emptyContainer
          }
        >

          <Text
            style={
              styles.emptyIcon
            }
          >
            🛍️
          </Text>


          <Text
            style={
              styles.emptyTitle
            }
          >
            Item Not Found
          </Text>


          <Text
            style={
              styles.emptyText
            }
          >
            Return to the Legathon Walk Store and select an item.
          </Text>


          <TouchableOpacity
            style={
              styles.primaryButton
            }
            onPress={
              goBack
            }
          >

            <Text
              style={
                styles.primaryButtonText
              }
            >
              RETURN TO STORE
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );
  }


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >

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

        {/* ================================================== */}
        {/* BACK BUTTON */}
        {/* ================================================== */}

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


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <Text
          style={
            styles.kicker
          }
        >
          LEGATHON WALK STORE
        </Text>


        <Text
          style={
            styles.pageTitle
          }
        >
          Product Details
        </Text>


        {/* ================================================== */}
        {/* PRODUCT IMAGE */}
        {/* ================================================== */}

        <View
          style={
            styles.imageCard
          }
        >

          {selectedImage ? (

            <Image
              source={
                selectedImage
              }
              style={
                styles.productImage
              }
            />

          ) : (

            <View
              style={
                styles.noImageBox
              }
            >

              <Text
                style={
                  styles.noImageText
                }
              >
                Product Image
              </Text>

            </View>

          )}


          {/* ================================================ */}
          {/* SELECTED COLOR BADGE */}
          {/* ================================================ */}

          {selectedColor ? (

            <View
              style={
                styles.selectedColorBadge
              }
            >

              <Text
                style={
                  styles.selectedColorBadgeText
                }
              >
                {selectedColor}
              </Text>

            </View>

          ) : null}

        </View>


        {/* ================================================== */}
        {/* PRODUCT INFORMATION */}
        {/* ================================================== */}

        <View
          style={
            styles.productInfoCard
          }
        >

          <Text
            style={
              styles.collectionText
            }
          >
            {collection.toUpperCase()}
          </Text>


          <Text
            style={
              styles.productName
            }
          >
            {productName}
          </Text>


          <Text
            style={
              styles.productMeta
            }
          >
            {gender}
            {"  •  "}
            {productType}
          </Text>


          {/* ================================================ */}
          {/* PRICE / WCOIN */}
          {/* ================================================ */}

          <View
            style={
              styles.priceRow
            }
          >

            <View>

              <Text
                style={
                  styles.priceLabel
                }
              >
                PRICE
              </Text>


              <Text
                style={
                  styles.priceText
                }
              >
                ${price.toFixed(
                  2
                )}
              </Text>

            </View>


            <View
              style={
                styles.wCoinPill
              }
            >

              <Image
                source={
                  WCOIN
                }
                style={
                  styles.wCoinIcon
                }
              />


              <View>

                <Text
                  style={
                    styles.wCoinLabel
                  }
                >
                  W COINS
                </Text>


                <Text
                  style={
                    styles.wCoinAmount
                  }
                >
                  {coins.toLocaleString()}
                </Text>

              </View>

            </View>

          </View>

        </View>


        {/* ================================================== */}
        {/* COLOR SELECTOR */}
        {/* ================================================== */}

        <View
          style={
            styles.optionCard
          }
        >

          <View
            style={
              styles.optionHeader
            }
          >

            <Text
              style={
                styles.optionTitle
              }
            >
              Select Color
            </Text>


            {selectedColor ? (

              <Text
                style={
                  styles.selectedOptionText
                }
              >
                {selectedColor}
              </Text>

            ) : null}

          </View>


          {colors.length >
          0 ? (

            <View
              style={
                styles.optionWrap
              }
            >

              {colors.map(
                (
                  color
                ) => {

                  const active =
                    selectedColor ===
                    color;


                  return (

                    <TouchableOpacity
                      key={
                        color
                      }
                      style={[
                        styles.colorButton,

                        active &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setSelectedColor(
                          color
                        )
                      }
                      activeOpacity={
                        0.8
                      }
                    >

                      {/* ===================================== */}
                      {/* COLOR DOT */}
                      {/* ===================================== */}

                      <View
                        style={[
                          styles.colorDot,

                          {
                            backgroundColor:
                              getColorValue(
                                color
                              ),
                          },

                          color
                            .toLowerCase() ===
                            "white" &&
                            styles.whiteColorDot,
                        ]}
                      />


                      <Text
                        style={[
                          styles.optionText,

                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {color}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          ) : (

            <Text
              style={
                styles.unavailableText
              }
            >
              No color selection required.
            </Text>

          )}

        </View>


        {/* ================================================== */}
        {/* SIZE SELECTOR */}
        {/* ================================================== */}

        <View
          style={
            styles.optionCard
          }
        >

          <View
            style={
              styles.optionHeader
            }
          >

            <Text
              style={
                styles.optionTitle
              }
            >
              Select Size
            </Text>


            {selectedSize ? (

              <Text
                style={
                  styles.selectedOptionText
                }
              >
                {selectedSize}
              </Text>

            ) : null}

          </View>


          {sizes.length >
          0 ? (

            <View
              style={
                styles.sizeWrap
              }
            >

              {sizes.map(
                (
                  size
                ) => {

                  const active =
                    selectedSize ===
                    size;


                  return (

                    <TouchableOpacity
                      key={
                        size
                      }
                      style={[
                        styles.sizeButton,

                        active &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      activeOpacity={
                        0.8
                      }
                    >

                      <Text
                        style={[
                          styles.sizeText,

                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {size}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          ) : (

            <Text
              style={
                styles.unavailableText
              }
            >
              No size selection required.
            </Text>

          )}

        </View>


        {/* ================================================== */}
        {/* YOUR SELECTION */}
        {/* ================================================== */}

        <View
          style={
            styles.selectionCard
          }
        >

          <Text
            style={
              styles.selectionTitle
            }
          >
            Your Selection
          </Text>


          <DetailRow
            label="Item"
            value={
              productName
            }
          />


          <DetailRow
            label="Color"
            value={
              selectedColor ||
              "Not Selected"
            }
          />


          <DetailRow
            label="Size"
            value={
              selectedSize ||
              "Not Selected"
            }
          />


          <DetailRow
            label="Price"
            value={`$${price.toFixed(
              2
            )}`}
          />

        </View>


        {/* ================================================== */}
        {/* PRODUCT DETAILS */}
        {/* ================================================== */}

        <View
          style={
            styles.detailsCard
          }
        >

          <Text
            style={
              styles.detailsTitle
            }
          >
            Product Details
          </Text>


          <DetailRow
            label="Collection"
            value={
              collection
            }
          />


          <DetailRow
            label="Category"
            value={
              category
            }
          />


          <DetailRow
            label="Product"
            value={
              productType
            }
          />


          <DetailRow
            label="Fit"
            value={
              gender
            }
          />


          <DetailRow
            label="Availability"
            value="Available"
          />

        </View>


        {/* ================================================== */}
        {/* WCOIN INFORMATION */}
        {/* ================================================== */}

        <View
          style={
            styles.rewardCard
          }
        >

          <Image
            source={
              WCOIN
            }
            style={
              styles.rewardCoin
            }
          />


          <View
            style={
              styles.rewardContent
            }
          >

            <Text
              style={
                styles.rewardTitle
              }
            >
              W Coin Eligible
            </Text>


            <Text
              style={
                styles.rewardText
              }
            >
              Eligible Premium and Elite members can apply W Coins toward merchandise discounts at checkout.
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* CHECKOUT BUTTON */}
        {/* ================================================== */}

        <TouchableOpacity
          style={[
            styles.primaryButton,

            !readyToPurchase &&
              styles.disabledButton,
          ]}
          onPress={
            handlePurchase
          }
          disabled={
            !readyToPurchase
          }
          activeOpacity={
            0.85
          }
        >

          <Text
            style={
              styles.primaryButtonText
            }
          >
            CONTINUE TO PURCHASE
          </Text>

        </TouchableOpacity>


        {/* ================================================== */}
        {/* CURRENT SELECTION UNDER BUTTON */}
        {/* ================================================== */}

        {selectedColor &&
        selectedSize ? (

          <Text
            style={
              styles.purchaseNote
            }
          >
            {selectedColor}
            {" • "}
            {selectedSize}
            {" • "}
            ${price.toFixed(
              2
            )}
          </Text>

        ) : (

          <Text
            style={
              styles.purchaseNote
            }
          >
            Select your color and size before continuing.
          </Text>

        )}


        <View
          style={
            styles.bottomSpace
          }
        />

      </ScrollView>

    </SafeAreaView>
  );
}


// ============================================================
// DETAIL ROW
// ============================================================

function DetailRow({
  label,
  value,
}) {

  return (
    <View
      style={
        styles.detailRow
      }
    >

      <Text
        style={
          styles.detailLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.detailValue
        }
      >
        {value}
      </Text>

    </View>
  );
}


// ============================================================
// COLOR HELPER
// ============================================================

function getColorValue(
  color
) {

  const value =
    String(
      color || ""
    ).toLowerCase();


  switch (
    value
  ) {

    case "black":

      return "#090909";


    case "white":

      return "#FFFFFF";


    case "blue":

      return "#2563EB";


    case "green":

      return "#16A34A";


    case "red":

      return "#DC2626";


    case "yellow":

      return "#FACC15";


    case "pink":

      return "#EC4899";


    case "gray":

    case "grey":

      return "#64748B";


    case "gold":

      return "#D4AF37";


    default:

      return "#64748B";
  }
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    // ========================================================
    // SCREEN
    // ========================================================

    safe: {
      flex: 1,
      backgroundColor: "#050914",
    },


    container: {
      flex: 1,
      backgroundColor: "#050914",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 34,
      paddingBottom: 160,
    },


    bottomSpace: {
      height: 100,
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 2,
      marginBottom: 20,
    },


    backText: {
      color: "#E7C447",
      fontSize: 22,
      fontWeight: "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    kicker: {
      color: "#E7C447",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 3.5,
      marginBottom: 10,
    },


    pageTitle: {
      color: "#FFFFFF",
      fontSize: 42,
      lineHeight: 48,
      fontWeight: "900",
      marginBottom: 24,
    },


    // ========================================================
    // IMAGE CARD
    // ========================================================

    imageCard: {
      width: "100%",
      minHeight: 330,
      backgroundColor: "#071224",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
      overflow: "hidden",
    },


    productImage: {
      width: "100%",
      height: 285,
      resizeMode: "contain",
    },


    noImageBox: {
      width: "100%",
      height: 250,
      alignItems: "center",
      justifyContent: "center",
    },


    noImageText: {
      color: "#64748B",
      fontSize: 16,
      fontWeight: "800",
    },


    selectedColorBadge: {
      position: "absolute",
      right: 16,
      bottom: 16,
      backgroundColor: "#050914",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "#D4AF37",
      paddingHorizontal: 14,
      paddingVertical: 8,
    },


    selectedColorBadgeText: {
      color: "#E7C447",
      fontSize: 12,
      fontWeight: "900",
    },


    // ========================================================
    // PRODUCT INFO
    // ========================================================

    productInfoCard: {
      backgroundColor: "#0B182B",
      borderRadius: 26,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 20,
      marginBottom: 18,
    },


    collectionText: {
      color: "#A7F3D0",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 8,
    },


    productName: {
      color: "#FFFFFF",
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "900",
    },


    productMeta: {
      color: "#94A3B8",
      fontSize: 14,
      fontWeight: "700",
      marginTop: 8,
    },


    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 24,
    },


    priceLabel: {
      color: "#94A3B8",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2,
    },


    priceText: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "900",
      marginTop: 3,
    },


    // ========================================================
    // WCOIN
    // ========================================================

    wCoinPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#071224",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#D4AF37",
      paddingHorizontal: 13,
      paddingVertical: 9,
    },


    wCoinIcon: {
      width: 31,
      height: 31,
      resizeMode: "contain",
      marginRight: 9,
    },


    wCoinLabel: {
      color: "#94A3B8",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },


    wCoinAmount: {
      color: "#E7C447",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 1,
    },


    // ========================================================
    // COLOR / SIZE CARDS
    // ========================================================

    optionCard: {
      backgroundColor: "#0B182B",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 18,
      marginBottom: 18,
    },


    optionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },


    optionTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
    },


    selectedOptionText: {
      color: "#E7C447",
      fontSize: 13,
      fontWeight: "900",
    },


    optionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },


    colorButton: {
      minHeight: 48,
      borderRadius: 24,
      backgroundColor: "#101B2E",
      borderWidth: 1,
      borderColor: "#29425D",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      marginRight: 10,
      marginBottom: 10,
    },


    colorDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      marginRight: 8,
    },


    whiteColorDot: {
      borderWidth: 1,
      borderColor: "#94A3B8",
    },


    optionText: {
      color: "#CBD5E1",
      fontSize: 13,
      fontWeight: "900",
    },


    optionButtonActive: {
      backgroundColor: "#D4AF37",
      borderColor: "#E7C447",
    },


    optionTextActive: {
      color: "#050914",
    },


    unavailableText: {
      color: "#718096",
      fontSize: 13,
      fontWeight: "700",
    },


    // ========================================================
    // SIZE
    // ========================================================

    sizeWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },


    sizeButton: {
      minWidth: 60,
      minHeight: 50,
      backgroundColor: "#101B2E",
      borderWidth: 1,
      borderColor: "#29425D",
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      marginRight: 10,
      marginBottom: 10,
    },


    sizeText: {
      color: "#CBD5E1",
      fontSize: 14,
      fontWeight: "900",
    },


    // ========================================================
    // SELECTION SUMMARY
    // ========================================================

    selectionCard: {
      backgroundColor: "#09172A",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#D4AF37",
      padding: 18,
      marginBottom: 18,
    },


    selectionTitle: {
      color: "#E7C447",
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 14,
    },


    // ========================================================
    // DETAILS
    // ========================================================

    detailsCard: {
      backgroundColor: "#0B182B",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 18,
      marginBottom: 18,
    },


    detailsTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 14,
    },


    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#17283A",
      paddingVertical: 12,
    },


    detailLabel: {
      color: "#94A3B8",
      fontSize: 13,
      fontWeight: "700",
    },


    detailValue: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
      maxWidth: "62%",
    },


    // ========================================================
    // WCOIN REWARD CARD
    // ========================================================

    rewardCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#09172A",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#D4AF37",
      padding: 18,
      marginBottom: 22,
    },


    rewardCoin: {
      width: 48,
      height: 48,
      resizeMode: "contain",
      marginRight: 14,
    },


    rewardContent: {
      flex: 1,
    },


    rewardTitle: {
      color: "#E7C447",
      fontSize: 16,
      fontWeight: "900",
    },


    rewardText: {
      color: "#AAB3C5",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      marginTop: 4,
    },


    // ========================================================
    // PURCHASE BUTTON
    // ========================================================

    primaryButton: {
      width: "100%",
      minHeight: 62,
      backgroundColor: "#D4AF37",
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
    },


    primaryButtonText: {
      color: "#050914",
      fontSize: 17,
      fontWeight: "900",
    },


    disabledButton: {
      opacity: 0.45,
    },


    purchaseNote: {
      color: "#94A3B8",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 12,
      paddingHorizontal: 16,
    },


    // ========================================================
    // EMPTY SCREEN
    // ========================================================

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
    },


    emptyIcon: {
      fontSize: 64,
      marginBottom: 18,
    },


    emptyTitle: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "900",
      textAlign: "center",
    },


    emptyText: {
      color: "#94A3B8",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 24,
    },
  });