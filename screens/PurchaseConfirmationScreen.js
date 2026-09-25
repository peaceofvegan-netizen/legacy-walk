// screens/PurchaseConfirmationScreen.js

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
  SafeAreaView,
  Alert,
} from "react-native";


// ============================================================
// LEGATHON WALK — PURCHASE CONFIRMATION
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


// ============================================================
// MERCHANDISE WCOIN RULES
// ============================================================
//
// Merchandise discount:
// 100 W Coins = $1.00
//
// Maximum W Coin discount:
// 15% of merchandise price
//
// Free members:
// No W Coin merchandise discount
//
// Premium / Elite:
// W Coin merchandise discount enabled
//
// ============================================================

const WCOINS_PER_DISCOUNT_DOLLAR = 100;

const MAX_WCOIN_DISCOUNT_RATE = 0.15;


// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const cleaned =
    typeof value === "string"
      ? value
          .replace("$", "")
          .replace("/mo", "")
          .replace(/,/g, "")
          .trim()
      : value;

  const parsed =
    Number(cleaned);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}


// ============================================================
// NORMALIZE PLAN
// ============================================================

function normalizePlan(
  plan
) {
  const value =
    String(
      plan || "free"
    ).toLowerCase();


  if (
    value.includes("elite")
  ) {
    return "elite";
  }


  if (
    value.includes("premium")
  ) {
    return "premium";
  }


  return "free";
}


// ============================================================
// PLAN NAME
// ============================================================

function getPlanName(
  plan
) {
  if (
    plan === "elite"
  ) {
    return "Elite";
  }


  if (
    plan === "premium"
  ) {
    return "Premium";
  }


  return "Free";
}


// ============================================================
// PLAN DISCOUNT
// ============================================================

function getMembershipDiscountRate(
  plan
) {
  if (
    plan === "elite"
  ) {
    return 0.15;
  }


  if (
    plan === "premium"
  ) {
    return 0.10;
  }


  return 0;
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function PurchaseConfirmationScreen({
  language = "en",

  item = null,

  goBack,

  goHome,

  goToInventory,

  userPlan = "free",

  wCoinBalance = 0,

  spendWCoins,

  onPurchaseComplete,

  shippingCost = 0,
}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    confirmed,
    setConfirmed,
  ] = useState(false);


  const [
    useWCoins,
    setUseWCoins,
  ] = useState(false);


  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);


  const [
    coinsSpent,
    setCoinsSpent,
  ] = useState(0);


  // ==========================================================
  // PRODUCT
  // ==========================================================

  const productName =
    item?.name ||
    item?.title ||
    "Legathon Walk Item";


  const price =
    Math.max(
      0,

      safeNumber(
        item?.price ??
          item?.retailPrice ??
          item?.amount,
        0
      )
    );


  const productCoinLimit =
    Math.max(
      0,

      Math.floor(
        safeNumber(
          item?.coins ??
            item?.coinDiscount,
          0
        )
      )
    );


  // ==========================================================
  // USER PLAN
  // ==========================================================

  const normalizedPlan =
    normalizePlan(
      userPlan
    );


  const planName =
    getPlanName(
      normalizedPlan
    );


  const membershipDiscountRate =
    getMembershipDiscountRate(
      normalizedPlan
    );


  // ==========================================================
  // MEMBERSHIP DISCOUNT
  // ==========================================================

  const membershipDiscount =
    price *
    membershipDiscountRate;


  const priceAfterMembership =
    Math.max(
      price -
        membershipDiscount,
      0
    );


  // ==========================================================
  // WCOIN BALANCE
  // ==========================================================

  const availableWCoins =
    Math.max(
      0,

      Math.floor(
        safeNumber(
          wCoinBalance,
          0
        )
      )
    );


  // ==========================================================
  // WCOIN ACCESS
  // ==========================================================

  const canUseWCoins =
    normalizedPlan === "premium" ||
    normalizedPlan === "elite";


  // ==========================================================
  // MAX WCOIN DISCOUNT
  // ==========================================================

  const maximumDollarDiscount =
    priceAfterMembership *
    MAX_WCOIN_DISCOUNT_RATE;


  const maximumCoinsByPrice =
    Math.floor(
      maximumDollarDiscount *
      WCOINS_PER_DISCOUNT_DOLLAR
    );


  const usableWCoins =
    canUseWCoins
      ? Math.min(
          availableWCoins,
          productCoinLimit,
          maximumCoinsByPrice
        )
      : 0;


  // ==========================================================
  // WCOIN DISCOUNT
  // ==========================================================

  const wCoinDiscount =
    useWCoins
      ? usableWCoins /
        WCOINS_PER_DISCOUNT_DOLLAR
      : 0;


  // ==========================================================
  // SHIPPING
  // ==========================================================

  const normalShipping =
    Math.max(
      0,

      safeNumber(
        shippingCost,
        0
      )
    );


  // Elite receives free shipping.
  const finalShipping =
    normalizedPlan === "elite"
      ? 0
      : normalShipping;


  // ==========================================================
  // FINAL PRICE
  // ==========================================================

  const finalPrice =
    Math.max(
      priceAfterMembership -
        wCoinDiscount +
        finalShipping,
      0
    );


  // ==========================================================
  // ORDER NUMBER
  // ==========================================================

  const orderNumber =
    useMemo(() => {

      const randomNumber =
        Math.floor(
          100000 +
          Math.random() *
            900000
        );


      return `LW-${randomNumber}`;

    }, []);


  // ==========================================================
  // CONFIRM PURCHASE
  // ==========================================================

  const confirmPurchase =
    async () => {

      if (!item) {

        Alert.alert(
          "Item Unavailable",
          "Please return to the store and select an item."
        );

        return;
      }


      if (
        isProcessing
      ) {
        return;
      }


      setIsProcessing(
        true
      );


      try {

        // ====================================================
        // SPEND WCOINS
        // ====================================================

        if (
          useWCoins &&
          usableWCoins > 0
        ) {

          if (
            typeof spendWCoins !==
            "function"
          ) {

            throw new Error(
              "W Coin redemption is not connected."
            );
          }


          const success =
            await spendWCoins(
              usableWCoins
            );


          if (
            success === false
          ) {

            throw new Error(
              "The W Coin transaction could not be completed."
            );
          }


          setCoinsSpent(
            usableWCoins
          );
        }


        // ====================================================
        // PURCHASE RECORD
        // ====================================================

        const purchaseRecord = {

          orderNumber,

          itemId:
            item?.id ||
            null,

          item:
            item,

          productName,

          itemPrice:
            Number(
              price.toFixed(
                2
              )
            ),

          membership:
            normalizedPlan,

          membershipName:
            planName,

          membershipDiscount:
            Number(
              membershipDiscount.toFixed(
                2
              )
            ),

          wCoinsUsed:
            useWCoins
              ? usableWCoins
              : 0,

          wCoinDiscount:
            Number(
              wCoinDiscount.toFixed(
                2
              )
            ),

          shipping:
            Number(
              finalShipping.toFixed(
                2
              )
            ),

          total:
            Number(
              finalPrice.toFixed(
                2
              )
            ),

          purchasedAt:
            new Date().toISOString(),
        };


        // ====================================================
        // OPTIONAL PARENT HANDLER
        // ====================================================

        if (
          typeof onPurchaseComplete ===
          "function"
        ) {

          await onPurchaseComplete(
            purchaseRecord
          );
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        setConfirmed(
          true
        );

      } catch (error) {

        console.log(
          "PURCHASE ERROR:",
          error
        );


        Alert.alert(
          "Unable to Complete Purchase",

          error?.message ||
            "Please try again."
        );

      } finally {

        setIsProcessing(
          false
        );
      }
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
            styles.emptyScreen
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
            No Item Selected
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
  // PURCHASE SUCCESS
  // ==========================================================

  if (confirmed) {

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

          <View
            style={
              styles.successCard
            }
          >

            {/* =========================================== */}
            {/* SUCCESS ICON */}
            {/* =========================================== */}

            <View
              style={
                styles.successCircle
              }
            >

              <Text
                style={
                  styles.successCheck
                }
              >
                ✓
              </Text>

            </View>


            <Text
              style={
                styles.successTitle
              }
            >
              Purchase Confirmed
            </Text>


            <Text
              style={
                styles.successSub
              }
            >
              Thank you for supporting Legathon Walk. Your order has been confirmed.
            </Text>


            {/* =========================================== */}
            {/* ORDER NUMBER */}
            {/* =========================================== */}

            <View
              style={
                styles.orderNumberCard
              }
            >

              <Text
                style={
                  styles.orderNumberLabel
                }
              >
                ORDER NUMBER
              </Text>


              <Text
                style={
                  styles.orderNumber
                }
              >
                {orderNumber}
              </Text>

            </View>


            {/* =========================================== */}
            {/* ORDER */}
            {/* =========================================== */}

            <View
              style={
                styles.orderBox
              }
            >

              {item?.image && (

                <Image
                  source={
                    item.image
                  }
                  style={
                    styles.confirmImage
                  }
                />

              )}


              <Text
                style={
                  styles.confirmProductName
                }
              >
                {productName}
              </Text>


              <Info
                label="Item Price"

                value={`$${price.toFixed(
                  2
                )}`}
              />


              <Info
                label="Membership"

                value={`${planName} Plan`}
              />


              <Info
                label="Membership Discount"

                value={`-$${membershipDiscount.toFixed(
                  2
                )}`}
              />


              <Info
                label="W Coins Used"

                value={
                  coinsSpent.toLocaleString()
                }
              />


              <Info
                label="W Coin Discount"

                value={`-$${wCoinDiscount.toFixed(
                  2
                )}`}
              />


              <Info
                label="Shipping"

                value={
                  finalShipping === 0
                    ? "Free"
                    : `$${finalShipping.toFixed(
                        2
                      )}`
                }
              />


              <Info
                label="Estimated Delivery"

                value="3–5 Business Days"
              />


              {/* ========================================= */}
              {/* TOTAL PAID */}
              {/* ========================================= */}

              <View
                style={
                  styles.successTotalRow
                }
              >

                <Text
                  style={
                    styles.totalLabel
                  }
                >
                  Total Paid
                </Text>


                <Text
                  style={
                    styles.totalValue
                  }
                >
                  ${finalPrice.toFixed(
                    2
                  )}
                </Text>

              </View>


              {/* ========================================= */}
              {/* STATUS */}
              {/* ========================================= */}

              <View
                style={
                  styles.checkList
                }
              >

                <Text
                  style={
                    styles.checkText
                  }
                >
                  ✓ Order Confirmed
                </Text>


                {coinsSpent > 0 && (

                  <Text
                    style={
                      styles.checkText
                    }
                  >
                    ✓ W Coin Discount Applied
                  </Text>

                )}


                <Text
                  style={
                    styles.checkText
                  }
                >
                  ✓ Purchase Recorded
                </Text>

              </View>

            </View>


            {/* =========================================== */}
            {/* HOME */}
            {/* =========================================== */}

            <TouchableOpacity
              style={
                styles.primaryButton
              }
              onPress={
                goHome
              }
            >

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                RETURN HOME
              </Text>

            </TouchableOpacity>


            {/* =========================================== */}
            {/* SHOP */}
            {/* =========================================== */}

            <TouchableOpacity
              style={
                styles.secondaryButton
              }
              onPress={
                goToInventory ||
                goBack
              }
            >

              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                CONTINUE SHOPPING
              </Text>

            </TouchableOpacity>

          </View>


          <View
            style={
              styles.bottomSpace
            }
          />

        </ScrollView>

      </SafeAreaView>
    );
  }


  // ==========================================================
  // CONFIRM PURCHASE SCREEN
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

        {/* =============================================== */}
        {/* BACK */}
        {/* =============================================== */}

        <TouchableOpacity
          onPress={
            goBack
          }
          style={
            styles.backButton
          }
        >

          <Text
            style={
              styles.back
            }
          >
            ‹ Back
          </Text>

        </TouchableOpacity>


        {/* =============================================== */}
        {/* HEADER */}
        {/* =============================================== */}

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
          Confirm Purchase
        </Text>


        {/* =============================================== */}
        {/* PRODUCT */}
        {/* =============================================== */}

        <View
          style={
            styles.productCard
          }
        >

          {item?.image && (

            <Image
              source={
                item.image
              }
              style={
                styles.productImage
              }
            />

          )}


          <Text
            style={
              styles.productName
            }
          >
            {productName}
          </Text>


          <Text
            style={
              styles.productSub
            }
          >
            Official Legathon Walk Merchandise
          </Text>

        </View>


        {/* =============================================== */}
        {/* SUMMARY */}
        {/* =============================================== */}

        <View
          style={
            styles.summaryCard
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Order Summary
          </Text>


          <Info
            label="Item Price"

            value={`$${price.toFixed(
              2
            )}`}
          />


          {/* ============================================= */}
          {/* MEMBERSHIP */}
          {/* ============================================= */}

          <Info
            label="Membership"

            value={`${planName} Plan`}
          />


          <Info
            label="Membership Discount"

            value={
              membershipDiscount > 0
                ? `-$${membershipDiscount.toFixed(
                    2
                  )}`
                : "$0.00"
            }
          />


          {/* ============================================= */}
          {/* WCOIN */}
          {/* ============================================= */}

          <View
            style={
              styles.wCoinCard
            }
          >

            <View
              style={
                styles.coinRow
              }
            >

              <View>

                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  W Coin Discount
                </Text>


                <Text
                  style={
                    styles.infoValue
                  }
                >
                  -${wCoinDiscount.toFixed(
                    2
                  )}
                </Text>

              </View>


              <View
                style={
                  styles.coinPill
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
                    styles.coinText
                  }
                >
                  {availableWCoins.toLocaleString()}
                </Text>

              </View>

            </View>


            {/* =========================================== */}
            {/* APPLY WCOINS */}
            {/* =========================================== */}

            {canUseWCoins &&
              usableWCoins > 0 && (

              <TouchableOpacity
                style={[
                  styles.useCoinButton,

                  useWCoins &&
                    styles.useCoinButtonActive,
                ]}
                onPress={() =>
                  setUseWCoins(
                    (current) =>
                      !current
                  )
                }
              >

                <Image
                  source={
                    WCOIN
                  }
                  style={
                    styles.useCoinIcon
                  }
                />


                <Text
                  style={[
                    styles.useCoinText,

                    useWCoins &&
                      styles.useCoinTextActive,
                  ]}
                >

                  {useWCoins
                    ? `${usableWCoins.toLocaleString()} W Coins Applied`
                    : `Apply ${usableWCoins.toLocaleString()} W Coins`}

                </Text>

              </TouchableOpacity>

            )}


            {/* =========================================== */}
            {/* FREE USER */}
            {/* =========================================== */}

            {!canUseWCoins && (

              <Text
                style={
                  styles.coinMessage
                }
              >
                Premium or Elite membership is required to use W Coins for merchandise discounts.
              </Text>

            )}


            {/* =========================================== */}
            {/* NO COINS */}
            {/* =========================================== */}

            {canUseWCoins &&
              usableWCoins === 0 && (

              <Text
                style={
                  styles.coinMessage
                }
              >
                No W Coins are currently available for this purchase.
              </Text>

            )}

          </View>


          {/* ============================================= */}
          {/* SHIPPING */}
          {/* ============================================= */}

          <Info
            label="Shipping"

            value={
              finalShipping === 0
                ? "Free"
                : `$${finalShipping.toFixed(
                    2
                  )}`
            }
          />


          <Info
            label="Estimated Delivery"

            value="3–5 Business Days"
          />


          {/* ============================================= */}
          {/* TOTAL */}
          {/* ============================================= */}

          <View
            style={
              styles.totalRow
            }
          >

            <Text
              style={
                styles.totalLabel
              }
            >
              Total
            </Text>


            <Text
              style={
                styles.totalValue
              }
            >
              ${finalPrice.toFixed(
                2
              )}
            </Text>

          </View>

        </View>


        {/* =============================================== */}
        {/* CONFIRM BUTTON */}
        {/* =============================================== */}

        <TouchableOpacity
          style={[
            styles.primaryButton,

            isProcessing &&
              styles.processingButton,
          ]}
          onPress={
            confirmPurchase
          }
          disabled={
            isProcessing
          }
        >

          <Text
            style={
              styles.primaryButtonText
            }
          >

            {isProcessing
              ? "PROCESSING..."
              : "CONFIRM PURCHASE"}

          </Text>

        </TouchableOpacity>


        <Text
          style={
            styles.purchaseNote
          }
        >
          Review your order and discounts before confirming.
        </Text>


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
// INFO COMPONENT
// ============================================================

function Info({
  label,
  value,
}) {

  return (
    <View
      style={
        styles.infoRow
      }
    >

      <Text
        style={
          styles.infoLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.infoValue
        }
      >
        {value}
      </Text>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor: "#050A12",
    },


    container: {
      flex: 1,
      backgroundColor: "#050A12",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 35,
      paddingBottom: 150,
    },


    bottomSpace: {
      height: 100,
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",
      marginBottom: 24,
    },


    back: {
      color: "#E7C447",
      fontSize: 22,
      fontWeight: "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    kicker: {
      color: "#A7F3D0",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 4,
      marginBottom: 12,
    },


    title: {
      color: "#FFFFFF",
      fontSize: 42,
      lineHeight: 48,
      fontWeight: "900",
      marginBottom: 24,
    },


    // ========================================================
    // PRODUCT
    // ========================================================

    productCard: {
      backgroundColor: "#0B182B",
      borderRadius: 28,
      padding: 24,
      alignItems: "center",
      marginBottom: 22,
      borderWidth: 1,
      borderColor: "#1E334A",
    },


    productImage: {
      width: 230,
      height: 230,
      resizeMode: "contain",
      marginBottom: 18,
    },


    productName: {
      color: "#FFFFFF",
      fontSize: 26,
      lineHeight: 32,
      fontWeight: "900",
      textAlign: "center",
    },


    productSub: {
      color: "#E7C447",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 8,
      textAlign: "center",
    },


    // ========================================================
    // SUMMARY
    // ========================================================

    summaryCard: {
      backgroundColor: "#0B182B",
      borderRadius: 26,
      padding: 22,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: "#1E334A",
    },


    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginBottom: 18,
    },


    infoRow: {
      marginBottom: 16,
    },


    infoLabel: {
      color: "#94A3B8",
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 4,
    },


    infoValue: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },


    // ========================================================
    // WCOIN
    // ========================================================

    wCoinCard: {
      backgroundColor: "#071224",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#233A51",
      padding: 14,
      marginBottom: 18,
    },


    coinRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },


    coinPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#050A12",
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#E7C447",
    },


    coinIcon: {
      width: 26,
      height: 26,
      resizeMode: "contain",
      marginRight: 8,
    },


    coinText: {
      color: "#E7C447",
      fontSize: 18,
      fontWeight: "900",
    },


    useCoinButton: {
      minHeight: 50,
      marginTop: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#E7C447",
      backgroundColor: "#101827",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },


    useCoinButtonActive: {
      backgroundColor: "#E7C447",
    },


    useCoinIcon: {
      width: 23,
      height: 23,
      resizeMode: "contain",
      marginRight: 8,
    },


    useCoinText: {
      color: "#E7C447",
      fontSize: 13,
      fontWeight: "900",
      textAlign: "center",
    },


    useCoinTextActive: {
      color: "#050A12",
    },


    coinMessage: {
      color: "#94A3B8",
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 12,
    },


    // ========================================================
    // TOTAL
    // ========================================================

    totalRow: {
      borderTopWidth: 1,
      borderTopColor: "#1E334A",
      marginTop: 8,
      paddingTop: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },


    totalLabel: {
      color: "#A7F3D0",
      fontSize: 20,
      fontWeight: "900",
    },


    totalValue: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "900",
    },


    // ========================================================
    // BUTTONS
    // ========================================================

    primaryButton: {
      backgroundColor: "#D4AF37",
      borderRadius: 24,
      minHeight: 60,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
      width: "100%",
      paddingHorizontal: 16,
    },


    primaryButtonText: {
      color: "#050A12",
      fontSize: 18,
      fontWeight: "900",
    },


    processingButton: {
      opacity: 0.55,
    },


    secondaryButton: {
      borderWidth: 1,
      borderColor: "#D4AF37",
      borderRadius: 24,
      minHeight: 60,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 14,
      width: "100%",
    },


    secondaryButtonText: {
      color: "#D4AF37",
      fontSize: 18,
      fontWeight: "900",
    },


    purchaseNote: {
      color: "#718096",
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 18,
      textAlign: "center",
      marginTop: 12,
      paddingHorizontal: 18,
    },


    // ========================================================
    // SUCCESS
    // ========================================================

    successCard: {
      backgroundColor: "#0B182B",
      borderRadius: 30,
      padding: 24,
      alignItems: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#1E334A",
    },


    successCircle: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: "#A7F3D0",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },


    successCheck: {
      color: "#050A12",
      fontSize: 50,
      fontWeight: "900",
    },


    successTitle: {
      color: "#FFFFFF",
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "900",
      textAlign: "center",
    },


    successSub: {
      color: "#CBD5E1",
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
      lineHeight: 24,
      marginTop: 12,
      marginBottom: 22,
    },


    orderNumberCard: {
      width: "100%",
      backgroundColor: "#071224",
      borderRadius: 18,
      padding: 15,
      marginBottom: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#243A51",
    },


    orderNumberLabel: {
      color: "#94A3B8",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2,
    },


    orderNumber: {
      color: "#E7C447",
      fontSize: 24,
      fontWeight: "900",
      marginTop: 5,
    },


    orderBox: {
      width: "100%",
      backgroundColor: "#071224",
      borderRadius: 22,
      padding: 18,
      marginBottom: 24,
    },


    confirmImage: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      alignSelf: "center",
      marginBottom: 12,
    },


    confirmProductName: {
      color: "#FFFFFF",
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: 20,
    },


    successTotalRow: {
      borderTopWidth: 1,
      borderTopColor: "#1E334A",
      marginTop: 8,
      paddingTop: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },


    checkList: {
      marginTop: 18,
      borderTopWidth: 1,
      borderTopColor: "#1E334A",
      paddingTop: 16,
    },


    checkText: {
      color: "#A7F3D0",
      fontSize: 14,
      fontWeight: "900",
      marginBottom: 8,
    },


    // ========================================================
    // EMPTY SCREEN
    // ========================================================

    emptyScreen: {
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
      fontWeight: "700",
      lineHeight: 24,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 24,
    },
  });