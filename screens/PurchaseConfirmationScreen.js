// screens/PurchaseConfirmationScreen.js

import React, {
  useEffect,
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

import {
  AddressSheet,
  AddressSheetError,
  useStripe,
} from "@stripe/stripe-react-native";

import {
  getApparelItemById,
} from "../assets/apparel/apparelCatalog";

import {
  supabase,
} from "../lib/supabase";


// ============================================================
// LEGATHON WALK — PURCHASE CONFIRMATION
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


// ============================================================
// WCOIN RULES
// ============================================================
//
// 100 W Coins = $1.00
//
// Maximum merchandise WCoin discount:
// 15%
//
// Free:
// cannot use WCoins for merchandise
//
// Premium:
// 10% membership discount
//
// Elite:
// 15% membership discount + free shipping
//
// IMPORTANT:
//
// Client calculations are DISPLAY ONLY.
//
// Final price, membership eligibility,
// WCoin balance and shipping are verified server-side.
//
// ============================================================

const WCOINS_PER_DISCOUNT_DOLLAR =
  100;

const MAX_WCOIN_DISCOUNT_RATE =
  0.15;


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

    typeof value ===
    "string"

      ? value
          .replace("$", "")
          .replace("/mo", "")
          .replace(/,/g, "")
          .trim()

      : value;


  const parsed =
    Number(
      cleaned
    );


  return Number.isFinite(
    parsed
  )
    ? parsed
    : fallback;
}


// ============================================================
// MONEY
// ============================================================

function money(
  value
) {

  return `$${safeNumber(
    value,
    0
  ).toFixed(2)}`;
}


// ============================================================
// NORMALIZE PLAN
// ============================================================

function normalizePlan(
  plan
) {

  const value =
    String(
      plan ||
      "free"
    ).toLowerCase();


  if (
    value.includes(
      "elite"
    )
  ) {

    return "elite";
  }


  if (
    value.includes(
      "premium"
    )
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
    plan ===
    "elite"
  ) {

    return "Elite";
  }


  if (
    plan ===
    "premium"
  ) {

    return "Premium";
  }


  return "Free";
}


// ============================================================
// MEMBERSHIP DISCOUNT RATE
// ============================================================

function getMembershipDiscountRate(
  plan
) {

  if (
    plan ===
    "elite"
  ) {

    return 0.15;
  }


  if (
    plan ===
    "premium"
  ) {

    return 0.10;
  }


  return 0;
}


// ============================================================
// NORMALIZE SHIPPING ADDRESS
// ============================================================

function normalizeShippingDetails(
  details
) {

  const address =
    details?.address ||
    {};


  const rawCountry =
    String(
      address?.country ||
      ""
    ).trim();


  const country =

    rawCountry
      .toLowerCase() ===
      "united states"

      ? "US"

      : rawCountry
          .toUpperCase();


  return {

    name:
      String(
        details?.name ||
        ""
      ).trim(),

    phone:
      String(
        details?.phone ||
        ""
      ).trim(),

    line1:
      String(
        address?.line1 ||
        ""
      ).trim(),

    line2:
      String(
        address?.line2 ||
        ""
      ).trim(),

    city:
      String(
        address?.city ||
        ""
      ).trim(),

    state:
      String(
        address?.state ||
        ""
      ).trim(),

    postalCode:
      String(
        address?.postalCode ||
        ""
      ).trim(),

    country,

  };
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

  refreshWCoinBalance,

  onPurchaseComplete,

  shippingCost = 0,

}) {

  // ==========================================================
  // STRIPE
  // ==========================================================

  const {
    initPaymentSheet,
    presentPaymentSheet,
  } =
    useStripe();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    confirmed,
    setConfirmed,
  ] =
    useState(
      false
    );


  const [
    useWCoins,
    setUseWCoins,
  ] =
    useState(
      false
    );


  const [
    isProcessing,
    setIsProcessing,
  ] =
    useState(
      false
    );


  const [
    coinsSpent,
    setCoinsSpent,
  ] =
    useState(
      0
    );


  const [
    purchaseSummary,
    setPurchaseSummary,
  ] =
    useState(
      null
    );


  // ==========================================================
  // SHIPPING STATE
  // ==========================================================

  const [
    addressSheetVisible,
    setAddressSheetVisible,
  ] =
    useState(
      false
    );


  const [
    shippingDetails,
    setShippingDetails,
  ] =
    useState(
      null
    );


  // ==========================================================
  // REFRESH REAL SERVER WALLET
  // ==========================================================

  useEffect(
    () => {

      if (
        typeof refreshWCoinBalance ===
        "function"
      ) {

        refreshWCoinBalance();
      }

    },
    [
      refreshWCoinBalance,
    ]
  );


  // ==========================================================
  // PRODUCT
  // ==========================================================

  const productName =

    item?.name ||

    item?.title ||

    "Legathon Walk Item";


  const itemId =

    item?.id ||

    null;


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
  // PRODUCT OPTIONS
  // ==========================================================

  const selectedColor =

    item?.selectedColor ||

    item?.color ||

    null;


  const selectedSize =

    item?.selectedSize ||

    item?.size ||

    null;


  // ==========================================================
  // PRODUCT IMAGE
  // ==========================================================

  const catalogItem =
    getApparelItemById(
      item?.id
    );


  const productImage =

    item
      ?.imagesByColor
      ?.[selectedColor] ||

    catalogItem
      ?.imagesByColor
      ?.[selectedColor] ||

    item
      ?.image ||

    catalogItem
      ?.image ||

    null;


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

    normalizedPlan ===
      "premium" ||

    normalizedPlan ===
      "elite";


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
  // DISPLAY WCOIN DISCOUNT
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


  const finalShipping =

    normalizedPlan ===
      "elite"

      ? 0

      : normalShipping;


  // ==========================================================
  // DISPLAY TOTAL
  //
  // SERVER WILL RECALCULATE THIS.
  // ==========================================================

  const displayFinalPrice =
    Math.max(

      priceAfterMembership -

      wCoinDiscount +

      finalShipping,

      0
    );


  // ==========================================================
  // AUTHORITATIVE SUCCESS VALUES
  // ==========================================================

  const successOrderNumber =

    purchaseSummary
      ?.orderNumber ||

    purchaseSummary
      ?.order_number ||

    "Confirmed";


  const successItemPrice =
    safeNumber(

      purchaseSummary
        ?.itemPrice ??

      purchaseSummary
        ?.item_price,

      price
    );


  const successMembershipDiscount =
    safeNumber(

      purchaseSummary
        ?.membershipDiscount ??

      purchaseSummary
        ?.membership_discount,

      membershipDiscount
    );


  const successWCoinDiscount =
    safeNumber(

      purchaseSummary
        ?.wCoinDiscount ??

      purchaseSummary
        ?.wcoin_discount,

      wCoinDiscount
    );


  const successShipping =
    safeNumber(

      purchaseSummary
        ?.shipping,

      finalShipping
    );


  const successTotal =
    safeNumber(

      purchaseSummary
        ?.total,

      displayFinalPrice
    );


  // ==========================================================
  // NORMALIZED SHIPPING
  // ==========================================================

  const normalizedShipping =
    normalizeShippingDetails(
      shippingDetails
    );


  // ==========================================================
  // CREATE PAYMENT
  // ==========================================================

  async function createPayment() {

    if (
      !itemId
    ) {

      throw new Error(
        "This merchandise item does not have a valid product ID."
      );
    }


    const shipping =
      normalizeShippingDetails(
        shippingDetails
      );


    if (
      !shipping.name ||
      !shipping.line1 ||
      !shipping.city ||
      !shipping.state ||
      !shipping.postalCode ||
      !shipping.country
    ) {

      throw new Error(
        "A complete shipping address is required."
      );
    }


    const requestedWCoins =

      useWCoins

        ? usableWCoins

        : 0;


    const {
      data,
      error,
    } =
      await supabase
        .functions
        .invoke(
          "create-merch-payment",
          {
            body: {

              itemId,

              useWCoins:
                useWCoins ===
                true,

              requestedWCoins,

              selectedColor,

              selectedSize,

              shipping,

            },
          }
        );


    if (
      error
    ) {

      console.log(
        "CREATE MERCH PAYMENT ERROR:",
        error
      );


      throw new Error(
        error?.message ||
        "Unable to start the merchandise payment."
      );
    }


    if (
      !data
    ) {

      throw new Error(
        "The payment server returned no data."
      );
    }


    if (
      data?.success ===
      false
    ) {

      throw new Error(

        data?.message ||

        data?.reason ||

        "The merchandise payment could not be created."
      );
    }


    const clientSecret =

      data
        ?.paymentIntentClientSecret ||

      data
        ?.payment_intent_client_secret ||

      data
        ?.clientSecret ||

      data
        ?.client_secret;


    if (
      !clientSecret
    ) {

      throw new Error(
        "The payment server did not return a Stripe client secret."
      );
    }


    return {

      ...data,

      clientSecret,

      orderId:

        data?.orderId ??

        data?.order_id ??

        null,

      orderNumber:

        data?.orderNumber ??

        data?.order_number ??

        null,

    };
  }


  // ==========================================================
  // FINALIZE PAYMENT
  // ==========================================================

  async function finalizePayment(
    orderId
  ) {

    if (
      !orderId
    ) {

      throw new Error(
        "The payment completed but the order ID is missing."
      );
    }


    const {
      data,
      error,
    } =
      await supabase
        .functions
        .invoke(
          "finalize-merch-payment",
          {
            body: {
              orderId,
            },
          }
        );


    if (
      error
    ) {

      console.log(
        "FINALIZE MERCH PAYMENT ERROR:",
        error
      );


      throw new Error(
        error?.message ||
        "Your payment was received but the order could not be finalized."
      );
    }


    if (
      !data
    ) {

      throw new Error(
        "Your payment was received but the server returned no order confirmation."
      );
    }


    if (
      data?.confirmed !==
        true &&

      data?.success !==
        true
    ) {

      throw new Error(

        data?.message ||

        data?.reason ||

        "Payment verification is still pending."
      );
    }


    return data;
  }


  // ==========================================================
  // CANCEL PENDING MERCH PAYMENT
  // ==========================================================

  async function cancelPendingPayment(
    orderId
  ) {

    if (
      !orderId
    ) {

      return null;
    }


    try {

      const {
        data,
        error,
      } =
        await supabase
          .functions
          .invoke(
            "cancel-merch-payment",
            {
              body: {
                orderId,
              },
            }
          );


      if (
        error
      ) {

        console.log(
          "CANCEL MERCH PAYMENT ERROR:",
          error
        );


        return {

          success:
            false,

          error,

        };
      }


      if (
        data?.paymentSucceeded ===
        true
      ) {

        return {

          success:
            false,

          paymentSucceeded:
            true,

        };
      }


      if (
        typeof refreshWCoinBalance ===
        "function"
      ) {

        await refreshWCoinBalance();
      }


      return data;

    } catch (
      error
    ) {

      console.log(
        "CANCEL PAYMENT ERROR:",
        error
      );


      return {

        success:
          false,

        error,

      };
    }
  }


  // ==========================================================
  // COMPLETE ALREADY-SUCCEEDED PAYMENT
  // ==========================================================

  async function completeSuccessfulOrder(
    createdOrder
  ) {

    const finalOrder =
      await finalizePayment(
        createdOrder
          ?.orderId
      );


    setPurchaseSummary(
      finalOrder
    );


    const finalCoins =
      Math.max(

        0,

        Math.floor(

          safeNumber(

            finalOrder
              ?.coinsSpent ??

            finalOrder
              ?.wcoinsSpent ??

            finalOrder
              ?.wcoins_spent,

            0
          )
        )
      );


    setCoinsSpent(
      finalCoins
    );


    if (
      typeof refreshWCoinBalance ===
      "function"
    ) {

      await refreshWCoinBalance();
    }


    if (
      typeof onPurchaseComplete ===
      "function"
    ) {

      await onPurchaseComplete(
        finalOrder
      );
    }


    setConfirmed(
      true
    );


    return finalOrder;
  }


  // ==========================================================
  // CONFIRM PURCHASE
  // ==========================================================

  const confirmPurchase =
    async () => {

      if (
        !item
      ) {

        Alert.alert(
          "Item Unavailable",
          "Please return to the store and select an item."
        );


        return;
      }


      if (
        !itemId
      ) {

        Alert.alert(
          "Item Unavailable",
          "This merchandise item does not have a valid product ID."
        );


        return;
      }


      // ======================================================
      // REQUIRE SHIPPING ADDRESS FIRST
      // ======================================================

      if (
        !shippingDetails
      ) {

        setAddressSheetVisible(
          true
        );


        return;
      }


      const shipping =
        normalizeShippingDetails(
          shippingDetails
        );


      if (
        !shipping.name ||
        !shipping.line1 ||
        !shipping.city ||
        !shipping.state ||
        !shipping.postalCode ||
        !shipping.country
      ) {

        Alert.alert(
          "Shipping Address Required",
          "Please enter a complete shipping address."
        );


        setAddressSheetVisible(
          true
        );


        return;
      }


      if (
        shipping.country !==
        "US"
      ) {

        Alert.alert(
          "U.S. Shipping Only",
          "Legathon merchandise checkout is currently available for U.S. shipping addresses."
        );


        setAddressSheetVisible(
          true
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


      let createdOrder =
        null;


      let stripePaymentCompleted =
        false;


      let reservationReleased =
        false;


      try {

        // ====================================================
        // REFRESH SERVER WALLET
        // ====================================================

        if (
          typeof refreshWCoinBalance ===
          "function"
        ) {

          await refreshWCoinBalance();
        }


        // ====================================================
        // CREATE SERVER ORDER + PAYMENT INTENT
        // ====================================================

        createdOrder =
          await createPayment();


        // ====================================================
        // INITIALIZE STRIPE PAYMENT SHEET
        // ====================================================

        const {
          error:
            initError,
        } =
          await initPaymentSheet({

            merchantDisplayName:
              "Legathon Walk",

            paymentIntentClientSecret:
              createdOrder
                .clientSecret,

            defaultShippingDetails:
              shippingDetails,

            allowsDelayedPaymentMethods:
              false,

            style:
              "automatic",

          });


        if (
          initError
        ) {

          console.log(
            "STRIPE INIT ERROR:",
            initError
          );


          await cancelPendingPayment(
            createdOrder
              ?.orderId
          );


          reservationReleased =
            true;


          throw new Error(
            initError?.message ||
            "Unable to open the secure payment screen. Any reserved W Coins have been returned."
          );
        }


        // ====================================================
        // PRESENT STRIPE PAYMENT SHEET
        // ====================================================

        const {
          error:
            paymentError,
        } =
          await presentPaymentSheet();


        if (
          paymentError
        ) {

          console.log(
            "STRIPE PAYMENT ERROR:",
            paymentError
          );


          const paymentCode =
            String(
              paymentError
                ?.code ||
              ""
            ).toLowerCase();


          const cancelResult =
            await cancelPendingPayment(
              createdOrder
                ?.orderId
            );


          reservationReleased =
            true;


          // ==================================================
          // STRIPE MAY HAVE SUCCEEDED EVEN IF PHONE RETURNED
          // AN ERROR.
          // ==================================================

          if (
            cancelResult
              ?.paymentSucceeded ===
            true
          ) {

            stripePaymentCompleted =
              true;


            await completeSuccessfulOrder(
              createdOrder
            );


            return;
          }


          if (
            paymentCode.includes(
              "cancel"
            )
          ) {

            Alert.alert(
              "Payment Canceled",
              "Your payment was canceled. Any reserved W Coins have been returned to your wallet."
            );


            return;
          }


          throw new Error(
            paymentError?.message ||
            "The payment could not be completed. Any reserved W Coins have been returned."
          );
        }


        // ====================================================
        // PAYMENT SHEET RETURNED SUCCESS
        // ====================================================

        stripePaymentCompleted =
          true;


        // ====================================================
        // VERIFY PAYMENT SERVER-SIDE
        // ====================================================

        try {

          await completeSuccessfulOrder(
            createdOrder
          );

        } catch (
          finalizeError
        ) {

          console.log(
            "PAYMENT FINALIZATION ERROR:",
            finalizeError
          );


          Alert.alert(
            "Payment Received",
            "Stripe accepted your payment, but Legathon is still confirming the order. Do not submit another payment. Your order can be recovered from the Stripe payment record."
          );


          return;
        }

      } catch (
        error
      ) {

        console.log(
          "PURCHASE ERROR:",
          error
        );


        // ====================================================
        // FALLBACK RESERVATION RELEASE
        //
        // Only before Stripe has completed payment.
        // ====================================================

        if (
          createdOrder
            ?.orderId &&

          stripePaymentCompleted !==
            true &&

          reservationReleased !==
            true
        ) {

          await cancelPendingPayment(
            createdOrder
              .orderId
          );
        }


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

  if (
    !item
  ) {

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

  if (
    confirmed
  ) {

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
              Thank you for supporting Legathon Walk. Your payment and order have been confirmed.
            </Text>


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
                {successOrderNumber}
              </Text>

            </View>


            <View
              style={
                styles.orderBox
              }
            >

              {productImage && (

                <Image
                  source={
                    productImage
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


              {selectedColor && (

                <Info
                  label="Color"
                  value={
                    selectedColor
                  }
                />

              )}


              {selectedSize && (

                <Info
                  label="Size"
                  value={
                    selectedSize
                  }
                />

              )}


              <Info
                label="Item Price"
                value={
                  money(
                    successItemPrice
                  )
                }
              />


              <Info
                label="Membership"
                value={
                  `${planName} Plan`
                }
              />


              <Info
                label="Membership Discount"
                value={
                  `-${money(
                    successMembershipDiscount
                  )}`
                }
              />


              <Info
                label="W Coins Used"
                value={
                  coinsSpent
                    .toLocaleString()
                }
              />


              <Info
                label="W Coin Discount"
                value={
                  `-${money(
                    successWCoinDiscount
                  )}`
                }
              />


              <Info
                label="Shipping"
                value={
                  successShipping ===
                  0

                    ? "Free"

                    : money(
                        successShipping
                      )
                }
              />


              <Info
                label="Estimated Delivery"
                value="3–5 Business Days"
              />


              {shippingDetails && (

                <View
                  style={
                    styles.successShippingBox
                  }
                >

                  <Text
                    style={
                      styles.successShippingTitle
                    }
                  >
                    SHIPPING TO
                  </Text>


                  <Text
                    style={
                      styles.successShippingName
                    }
                  >
                    {normalizedShipping.name}
                  </Text>


                  <Text
                    style={
                      styles.successShippingText
                    }
                  >
                    {normalizedShipping.line1}
                  </Text>


                  {normalizedShipping.line2
                    ? (

                      <Text
                        style={
                          styles.successShippingText
                        }
                      >
                        {normalizedShipping.line2}
                      </Text>

                    )
                    : null}


                  <Text
                    style={
                      styles.successShippingText
                    }
                  >
                    {normalizedShipping.city},{" "}
                    {normalizedShipping.state}{" "}
                    {normalizedShipping.postalCode}
                  </Text>


                  <Text
                    style={
                      styles.successShippingText
                    }
                  >
                    {normalizedShipping.country}
                  </Text>

                </View>

              )}


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
                  {money(
                    successTotal
                  )}
                </Text>

              </View>


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
                  ✓ Stripe Payment Confirmed
                </Text>


                {coinsSpent >
                  0 && (

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
                  ✓ Shipping Address Saved
                </Text>


                <Text
                  style={
                    styles.checkText
                  }
                >
                  ✓ Purchase Recorded
                </Text>

              </View>

            </View>


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
  // PURCHASE SCREEN
  // ==========================================================

  return (

    <SafeAreaView
      style={
        styles.safe
      }
    >

      {/* ===================================================== */}
      {/* STRIPE SHIPPING ADDRESS SHEET */}
      {/* ===================================================== */}

      <AddressSheet

        visible={
          addressSheetVisible
        }

        defaultValues={
          shippingDetails ||
          {
            address: {
              country:
                "US",
            },
          }
        }

        additionalFields={{
          phoneNumber:
            "required",
        }}

        allowedCountries={[
          "US",
        ]}

        primaryButtonTitle=
          "USE THIS ADDRESS"

        sheetTitle=
          "Shipping Address"

        onSubmit={async (
          addressDetails
        ) => {

          setShippingDetails(
            addressDetails
          );


          setAddressSheetVisible(
            false
          );
        }}

        onError={(
          error
        ) => {

          console.log(
            "ADDRESS SHEET ERROR:",
            error
          );


          if (
            error?.code ===
            AddressSheetError.Failed
          ) {

            Alert.alert(
              "Shipping Address",
              "There was a problem saving the shipping address."
            );
          }


          setAddressSheetVisible(
            false
          );
        }}
      />


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

        {/* =================================================== */}
        {/* BACK */}
        {/* =================================================== */}

        <TouchableOpacity
          onPress={
            goBack
          }
          style={
            styles.backButton
          }
          disabled={
            isProcessing
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


        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

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


        {/* =================================================== */}
        {/* PRODUCT */}
        {/* =================================================== */}

        <View
          style={
            styles.productCard
          }
        >

          {productImage && (

            <Image
              source={
                productImage
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


          {selectedColor && (

            <Text
              style={
                styles.optionText
              }
            >
              Color: {selectedColor}
            </Text>

          )}


          {selectedSize && (

            <Text
              style={
                styles.optionText
              }
            >
              Size: {selectedSize}
            </Text>

          )}

        </View>


        {/* =================================================== */}
        {/* ORDER SUMMARY */}
        {/* =================================================== */}

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
            value={
              money(
                price
              )
            }
          />


          <Info
            label="Membership"
            value={
              `${planName} Plan`
            }
          />


          <Info
            label="Membership Discount"
            value={

              membershipDiscount >
              0

                ? `-${money(
                    membershipDiscount
                  )}`

                : "$0.00"
            }
          />


          {/* ================================================= */}
          {/* WCOIN */}
          {/* ================================================= */}

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
                  -{money(
                    wCoinDiscount
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
                  {availableWCoins
                    .toLocaleString()}
                </Text>

              </View>

            </View>


            {canUseWCoins &&
              usableWCoins >
                0 && (

              <TouchableOpacity
                style={[
                  styles.useCoinButton,

                  useWCoins &&
                    styles.useCoinButtonActive,
                ]}
                disabled={
                  isProcessing
                }
                onPress={() =>
                  setUseWCoins(
                    current =>
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


            {!canUseWCoins && (

              <Text
                style={
                  styles.coinMessage
                }
              >
                Premium or Elite membership is required to use W Coins for merchandise discounts.
              </Text>

            )}


            {canUseWCoins &&
              usableWCoins ===
                0 && (

              <Text
                style={
                  styles.coinMessage
                }
              >
                No W Coins are currently available for this purchase.
              </Text>

            )}


            <Text
              style={
                styles.coinFinePrint
              }
            >
              Final W Coin eligibility and discount are verified securely when checkout begins.
            </Text>

          </View>


          <Info
            label="Shipping"
            value={

              finalShipping ===
              0

                ? "Free"

                : money(
                    finalShipping
                  )
            }
          />


          <Info
            label="Estimated Delivery"
            value="3–5 Business Days"
          />


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
              Estimated Total
            </Text>


            <Text
              style={
                styles.totalValue
              }
            >
              {money(
                displayFinalPrice
              )}
            </Text>

          </View>

        </View>


        {/* =================================================== */}
        {/* SHIPPING ADDRESS */}
        {/* =================================================== */}

        <View
          style={
            styles.shippingCard
          }
        >

          <Text
            style={
              styles.shippingTitle
            }
          >
            Shipping Address
          </Text>


          {shippingDetails ? (

            <>

              <Text
                style={
                  styles.shippingName
                }
              >
                {normalizedShipping.name}
              </Text>


              <Text
                style={
                  styles.shippingText
                }
              >
                {normalizedShipping.line1}
              </Text>


              {normalizedShipping.line2
                ? (

                  <Text
                    style={
                      styles.shippingText
                    }
                  >
                    {normalizedShipping.line2}
                  </Text>

                )
                : null}


              <Text
                style={
                  styles.shippingText
                }
              >
                {normalizedShipping.city},{" "}
                {normalizedShipping.state}{" "}
                {normalizedShipping.postalCode}
              </Text>


              <Text
                style={
                  styles.shippingText
                }
              >
                {normalizedShipping.country}
              </Text>


              {normalizedShipping.phone
                ? (

                  <Text
                    style={
                      styles.shippingText
                    }
                  >
                    {normalizedShipping.phone}
                  </Text>

                )
                : null}


              <TouchableOpacity
                style={
                  styles.shippingButton
                }
                onPress={() =>
                  setAddressSheetVisible(
                    true
                  )
                }
                disabled={
                  isProcessing
                }
              >

                <Text
                  style={
                    styles.shippingButtonText
                  }
                >
                  CHANGE ADDRESS
                </Text>

              </TouchableOpacity>

            </>

          ) : (

            <>

              <Text
                style={
                  styles.shippingPrompt
                }
              >
                Add the address where your Legathon Walk merchandise should be delivered.
              </Text>


              <TouchableOpacity
                style={
                  styles.shippingButton
                }
                onPress={() =>
                  setAddressSheetVisible(
                    true
                  )
                }
                disabled={
                  isProcessing
                }
              >

                <Text
                  style={
                    styles.shippingButtonText
                  }
                >
                  ADD SHIPPING ADDRESS
                </Text>

              </TouchableOpacity>

            </>

          )}

        </View>


        {/* =================================================== */}
        {/* CHECKOUT BUTTON */}
        {/* =================================================== */}

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

              : shippingDetails

                ? "SECURE CHECKOUT"

                : "ADD SHIPPING ADDRESS"}
          </Text>

        </TouchableOpacity>


        <Text
          style={
            styles.purchaseNote
          }
        >
          Your final price, membership discount, W Coin eligibility and shipping information are verified by Legathon Walk before Stripe opens.
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

      flex:
        1,

      backgroundColor:
        "#050A12",

    },


    container: {

      flex:
        1,

      backgroundColor:
        "#050A12",

    },


    content: {

      paddingHorizontal:
        20,

      paddingTop:
        35,

      paddingBottom:
        150,

    },


    bottomSpace: {

      height:
        100,

    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {

      alignSelf:
        "flex-start",

      marginBottom:
        24,

    },


    back: {

      color:
        "#E7C447",

      fontSize:
        22,

      fontWeight:
        "900",

    },


    // ========================================================
    // HEADER
    // ========================================================

    kicker: {

      color:
        "#A7F3D0",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        4,

      marginBottom:
        12,

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

      marginBottom:
        24,

    },


    // ========================================================
    // PRODUCT
    // ========================================================

    productCard: {

      backgroundColor:
        "#0B182B",

      borderRadius:
        28,

      padding:
        24,

      alignItems:
        "center",

      marginBottom:
        22,

      borderWidth:
        1,

      borderColor:
        "#1E334A",

    },


    productImage: {

      width:
        230,

      height:
        230,

      resizeMode:
        "contain",

      marginBottom:
        18,

    },


    productName: {

      color:
        "#FFFFFF",

      fontSize:
        26,

      lineHeight:
        32,

      fontWeight:
        "900",

      textAlign:
        "center",

    },


    productSub: {

      color:
        "#E7C447",

      fontSize:
        14,

      fontWeight:
        "900",

      marginTop:
        8,

      textAlign:
        "center",

    },


    optionText: {

      color:
        "#CBD5E1",

      fontSize:
        14,

      fontWeight:
        "800",

      marginTop:
        8,

      textAlign:
        "center",

    },


    // ========================================================
    // SUMMARY
    // ========================================================

    summaryCard: {

      backgroundColor:
        "#0B182B",

      borderRadius:
        26,

      padding:
        22,

      marginBottom:
        24,

      borderWidth:
        1,

      borderColor:
        "#1E334A",

    },


    sectionTitle: {

      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        18,

    },


    infoRow: {

      marginBottom:
        16,

    },


    infoLabel: {

      color:
        "#94A3B8",

      fontSize:
        13,

      fontWeight:
        "800",

      marginBottom:
        4,

    },


    infoValue: {

      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "900",

    },


    // ========================================================
    // WCOINS
    // ========================================================

    wCoinCard: {

      backgroundColor:
        "#071224",

      borderRadius:
        20,

      borderWidth:
        1,

      borderColor:
        "#233A51",

      padding:
        14,

      marginBottom:
        18,

    },


    coinRow: {

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

    },


    coinPill: {

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#050A12",

      borderRadius:
        999,

      paddingHorizontal:
        14,

      paddingVertical:
        8,

      borderWidth:
        1,

      borderColor:
        "#E7C447",

    },


    coinIcon: {

      width:
        26,

      height:
        26,

      resizeMode:
        "contain",

      marginRight:
        8,

    },


    coinText: {

      color:
        "#E7C447",

      fontSize:
        18,

      fontWeight:
        "900",

    },


    useCoinButton: {

      minHeight:
        50,

      marginTop:
        14,

      borderRadius:
        18,

      borderWidth:
        1,

      borderColor:
        "#E7C447",

      backgroundColor:
        "#101827",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        12,

    },


    useCoinButtonActive: {

      backgroundColor:
        "#E7C447",

    },


    useCoinIcon: {

      width:
        23,

      height:
        23,

      resizeMode:
        "contain",

      marginRight:
        8,

    },


    useCoinText: {

      color:
        "#E7C447",

      fontSize:
        13,

      fontWeight:
        "900",

      textAlign:
        "center",

    },


    useCoinTextActive: {

      color:
        "#050A12",

    },


    coinMessage: {

      color:
        "#94A3B8",

      fontSize:
        12,

      fontWeight:
        "700",

      lineHeight:
        18,

      marginTop:
        12,

    },


    coinFinePrint: {

      color:
        "#64748B",

      fontSize:
        11,

      fontWeight:
        "700",

      lineHeight:
        17,

      marginTop:
        12,

    },


    // ========================================================
    // SHIPPING CARD
    // ========================================================

    shippingCard: {

      backgroundColor:
        "#0B182B",

      borderRadius:
        24,

      padding:
        20,

      borderWidth:
        1,

      borderColor:
        "#1E334A",

      marginBottom:
        22,

    },


    shippingTitle: {

      color:
        "#FFFFFF",

      fontSize:
        22,

      fontWeight:
        "900",

      marginBottom:
        12,

    },


    shippingPrompt: {

      color:
        "#94A3B8",

      fontSize:
        14,

      lineHeight:
        21,

      fontWeight:
        "700",

    },


    shippingName: {

      color:
        "#E7C447",

      fontSize:
        17,

      fontWeight:
        "900",

      marginBottom:
        6,

    },


    shippingText: {

      color:
        "#CBD5E1",

      fontSize:
        15,

      fontWeight:
        "700",

      lineHeight:
        22,

    },


    shippingButton: {

      minHeight:
        48,

      borderRadius:
        18,

      borderWidth:
        1,

      borderColor:
        "#E7C447",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        16,

      paddingHorizontal:
        16,

    },


    shippingButtonText: {

      color:
        "#E7C447",

      fontSize:
        14,

      fontWeight:
        "900",

    },


    // ========================================================
    // TOTAL
    // ========================================================

    totalRow: {

      borderTopWidth:
        1,

      borderTopColor:
        "#1E334A",

      marginTop:
        8,

      paddingTop:
        18,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

    },


    totalLabel: {

      color:
        "#A7F3D0",

      fontSize:
        20,

      fontWeight:
        "900",

    },


    totalValue: {

      color:
        "#FFFFFF",

      fontSize:
        30,

      fontWeight:
        "900",

    },


    // ========================================================
    // BUTTONS
    // ========================================================

    primaryButton: {

      backgroundColor:
        "#D4AF37",

      borderRadius:
        24,

      minHeight:
        60,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        4,

      width:
        "100%",

      paddingHorizontal:
        16,

    },


    primaryButtonText: {

      color:
        "#050A12",

      fontSize:
        18,

      fontWeight:
        "900",

      textAlign:
        "center",

    },


    processingButton: {

      opacity:
        0.55,

    },


    secondaryButton: {

      borderWidth:
        1,

      borderColor:
        "#D4AF37",

      borderRadius:
        24,

      minHeight:
        60,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        14,

      width:
        "100%",

    },


    secondaryButtonText: {

      color:
        "#D4AF37",

      fontSize:
        18,

      fontWeight:
        "900",

    },


    purchaseNote: {

      color:
        "#718096",

      fontSize:
        12,

      fontWeight:
        "700",

      lineHeight:
        18,

      textAlign:
        "center",

      marginTop:
        12,

      paddingHorizontal:
        18,

    },


    // ========================================================
    // SUCCESS
    // ========================================================

    successCard: {

      backgroundColor:
        "#0B182B",

      borderRadius:
        30,

      padding:
        24,

      alignItems:
        "center",

      marginTop:
        20,

      borderWidth:
        1,

      borderColor:
        "#1E334A",

    },


    successCircle: {

      width:
        82,

      height:
        82,

      borderRadius:
        41,

      backgroundColor:
        "#A7F3D0",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        18,

    },


    successCheck: {

      color:
        "#050A12",

      fontSize:
        50,

      fontWeight:
        "900",

    },


    successTitle: {

      color:
        "#FFFFFF",

      fontSize:
        34,

      lineHeight:
        40,

      fontWeight:
        "900",

      textAlign:
        "center",

    },


    successSub: {

      color:
        "#CBD5E1",

      fontSize:
        16,

      fontWeight:
        "700",

      textAlign:
        "center",

      lineHeight:
        24,

      marginTop:
        12,

      marginBottom:
        22,

    },


    orderNumberCard: {

      width:
        "100%",

      backgroundColor:
        "#071224",

      borderRadius:
        18,

      padding:
        15,

      marginBottom:
        16,

      alignItems:
        "center",

      borderWidth:
        1,

      borderColor:
        "#243A51",

    },


    orderNumberLabel: {

      color:
        "#94A3B8",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        2,

    },


    orderNumber: {

      color:
        "#E7C447",

      fontSize:
        24,

      fontWeight:
        "900",

      marginTop:
        5,

    },


    orderBox: {

      width:
        "100%",

      backgroundColor:
        "#071224",

      borderRadius:
        22,

      padding:
        18,

      marginBottom:
        24,

    },


    confirmImage: {

      width:
        150,

      height:
        150,

      resizeMode:
        "contain",

      alignSelf:
        "center",

      marginBottom:
        12,

    },


    confirmProductName: {

      color:
        "#FFFFFF",

      fontSize:
        20,

      lineHeight:
        26,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginBottom:
        20,

    },


    successShippingBox: {

      marginTop:
        10,

      marginBottom:
        16,

      padding:
        14,

      borderRadius:
        16,

      backgroundColor:
        "#0B182B",

      borderWidth:
        1,

      borderColor:
        "#1E334A",

    },


    successShippingTitle: {

      color:
        "#94A3B8",

      fontSize:
        11,

      fontWeight:
        "900",

      letterSpacing:
        2,

      marginBottom:
        8,

    },


    successShippingName: {

      color:
        "#E7C447",

      fontSize:
        16,

      fontWeight:
        "900",

      marginBottom:
        4,

    },


    successShippingText: {

      color:
        "#CBD5E1",

      fontSize:
        14,

      fontWeight:
        "700",

      lineHeight:
        20,

    },


    successTotalRow: {

      borderTopWidth:
        1,

      borderTopColor:
        "#1E334A",

      marginTop:
        8,

      paddingTop:
        18,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

    },


    checkList: {

      marginTop:
        18,

      borderTopWidth:
        1,

      borderTopColor:
        "#1E334A",

      paddingTop:
        16,

    },


    checkText: {

      color:
        "#A7F3D0",

      fontSize:
        14,

      fontWeight:
        "900",

      marginBottom:
        8,

    },


    // ========================================================
    // EMPTY
    // ========================================================

    emptyScreen: {

      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        28,

    },


    emptyIcon: {

      fontSize:
        64,

      marginBottom:
        18,

    },


    emptyTitle: {

      color:
        "#FFFFFF",

      fontSize:
        30,

      fontWeight:
        "900",

      textAlign:
        "center",

    },


    emptyText: {

      color:
        "#94A3B8",

      fontSize:
        16,

      fontWeight:
        "700",

      lineHeight:
        24,

      textAlign:
        "center",

      marginTop:
        10,

      marginBottom:
        24,

    },

  });