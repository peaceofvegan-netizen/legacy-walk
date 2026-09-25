// screens/SubscriptionScreen.js

import React, {
  useRef,
  useState,
} from "react";

import {
  Alert,
  Animated,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";


// ============================================================
// LEGATHON WALK — SUBSCRIPTION SCREEN
// ============================================================

const FREE_CARD =
  require("../assets/subscriptions/free-card.jpg");

const PREMIUM_CARD =
  require("../assets/subscriptions/premium-card.jpg");

const ELITE_CARD =
  require("../assets/subscriptions/elite-card.jpg");


// ============================================================
// MEMBERSHIP CONFIGURATION
// ============================================================

const SUBSCRIPTION_CARDS = [

  {
    id: "free",

    title: "Free",

    price: "$0",

    period: "Forever",

    image: FREE_CARD,

    badge: "START WALKING",

    accent: "#58E8C1",
  },


  {
    id: "premium",

    title: "Premium",

    price: "$4.99",

    period: "/ month",

    image: PREMIUM_CARD,

    badge: "MOST POPULAR",

    accent: "#D8A72E",
  },


  {
    id: "elite",

    title: "Elite",

    price: "$9.99",

    period: "/ month",

    image: ELITE_CARD,

    badge: "BEST VALUE",

    accent: "#B28CFF",
  },
];


// ============================================================
// PLAN FEATURES
// ============================================================

const PLAN_FEATURES = {

  // ==========================================================
  // FREE
  // ==========================================================

  free: [

    {
      icon: "🌎",
      text: "12 Free Journeys",
      available: true,
    },

    {
      icon: "👥",
      text: "Legathon Community",
      available: true,
    },

    {
      icon: "🏆",
      text: "Leaderboard & Rankings",
      available: true,
    },

    {
      icon: "📊",
      text: "Basic Walking Analytics",
      available: true,
    },

    {
      icon: "🪙",
      text: "Collect WCoins",
      available: true,
    },

    {
      icon: "🔒",
      text: "WCoin Redemption",
      available: false,
    },

    {
      icon: "🔒",
      text: "26 Legathon Marathons",
      available: false,
    },

    {
      icon: "🔒",
      text: "All Premium Journeys",
      available: false,
    },

    {
      icon: "🔒",
      text: "5 Tracksuit Unlocks",
      available: false,
    },

    {
      icon: "🔒",
      text: "Walking Pace & Mobility Trends",
      available: false,
    },

    {
      icon: "🔒",
      text: "AI Wellness Coach",
      available: false,
    },

    {
      icon: "🔒",
      text: "Personal Wellness Coach",
      available: false,
    },
  ],


  // ==========================================================
  // PREMIUM
  // ==========================================================

  premium: [

    {
      icon: "🌎",
      text: "All 92+ Journeys",
      available: true,
    },

    {
      icon: "🏁",
      text: "All 26 Legathon Marathons",
      available: true,
    },

    {
      icon: "👥",
      text: "Legathon Community",
      available: true,
    },

    {
      icon: "🏆",
      text: "Full Leaderboard & Rankings",
      available: true,
    },

    {
      icon: "📈",
      text: "Advanced Walking Analytics",
      available: true,
    },

    {
      icon: "🚶",
      text: "Walking Pace & Mobility Trends",
      available: true,
    },

    {
      icon: "🧠",
      text: "AI Wellness Coach",
      available: true,
    },

    {
      icon: "💬",
      text: "AI Walking Coach",
      available: true,
    },

    {
      icon: "👕",
      text: "5 Tracksuit Unlocks",
      available: true,
    },

    {
      icon: "🪙",
      text: "WCoin Redemption",
      available: true,
    },

    {
      icon: "🎁",
      text: "Premium Merchandise Benefits",
      available: true,
    },

    {
      icon: "🔒",
      text: "Elite Personal Wellness Coach",
      available: false,
    },

    {
      icon: "🔒",
      text: "Elite WCoin Redemption Value",
      available: false,
    },

    {
      icon: "🔒",
      text: "Free Merchandise Shipping",
      available: false,
    },
  ],


  // ==========================================================
  // ELITE
  // ==========================================================

  elite: [

    {
      icon: "👑",
      text: "Everything in Premium",
      available: true,
      highlight: true,
    },

    {
      icon: "🌎",
      text: "All 92+ Journeys",
      available: true,
    },

    {
      icon: "🏁",
      text: "All 26 Legathon Marathons",
      available: true,
    },

    {
      icon: "🏆",
      text: "Full Leaderboard & Rankings",
      available: true,
    },

    {
      icon: "📈",
      text: "Advanced Walking Analytics",
      available: true,
    },

    {
      icon: "🚶",
      text: "Walking Pace & Mobility Trends",
      available: true,
    },

    {
      icon: "🧠",
      text: "AI Wellness Coach",
      available: true,
    },

    {
      icon: "💬",
      text: "AI Walking Coach",
      available: true,
    },

    {
      icon: "⭐",
      text: "Personal Wellness Coach",
      available: true,
      highlight: true,
    },

    {
      icon: "👕",
      text: "5 Tracksuit Unlocks",
      available: true,
    },

    {
      icon: "🪙",
      text: "Highest WCoin Redemption Value",
      available: true,
      highlight: true,
    },

    {
      icon: "📦",
      text: "FREE Merchandise Shipping",
      available: true,
      highlight: true,
    },

    {
      icon: "🎁",
      text: "Elite Merchandise Benefits",
      available: true,
    },
  ],
};


// ============================================================
// MAIN SCREEN
// ============================================================

export default function SubscriptionScreen({

  language = "en",

  subscriptionPlan = "free",

  setSubscriptionPlan,

  goBack,

  goHome,

  goToPaywall,

  onRestorePurchases,

  goToPrivacyPolicy,

  goToTermsOfService,

}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const pulseAnim =
    useRef(
      new Animated.Value(1)
    ).current;


  const [
    isRestoring,
    setIsRestoring,
  ] = useState(false);


  // ==========================================================
  // CURRENT PLAN
  // ==========================================================

  const normalizedCurrentPlan =
    String(
      subscriptionPlan ||
      "free"
    ).toLowerCase();


  const currentPlan =
    SUBSCRIPTION_CARDS.find(
      (
        plan
      ) =>
        plan.id ===
        normalizedCurrentPlan
    ) ||
    SUBSCRIPTION_CARDS[0];


  const hasPaidMembership =
    normalizedCurrentPlan ===
      "premium" ||
    normalizedCurrentPlan ===
      "elite";


  // ==========================================================
  // CARD ANIMATION
  // ==========================================================

  const animateSelection =
    () => {

      Animated.sequence([

        Animated.timing(
          pulseAnim,
          {
            toValue: 0.98,

            duration: 90,

            useNativeDriver: true,
          }
        ),


        Animated.spring(
          pulseAnim,
          {
            toValue: 1,

            friction: 4,

            tension: 70,

            useNativeDriver: true,
          }
        ),

      ]).start();
    };


  // ==========================================================
  // MANAGE APP STORE / GOOGLE PLAY SUBSCRIPTION
  // ==========================================================

  const openSubscriptionSettings =
    async () => {

      try {

        const url =
          Platform.OS === "ios"

            ? "https://apps.apple.com/account/subscriptions"

            : "https://play.google.com/store/account/subscriptions";


        const supported =
          await Linking.canOpenURL(
            url
          );


        if (
          !supported
        ) {

          throw new Error(
            "Subscription settings are unavailable."
          );
        }


        await Linking.openURL(
          url
        );

      } catch (error) {

        console.log(
          "OPEN SUBSCRIPTION SETTINGS ERROR:",
          error
        );


        Alert.alert(
          "Manage Membership",

          "Open your App Store or Google Play subscription settings to manage or cancel your Legathon Walk membership."
        );
      }
    };


  // ==========================================================
  // SELECT PLAN
  // ==========================================================

  const handlePlanSelect =
    (
      planId
    ) => {

      const nextPlan =
        String(
          planId ||
          ""
        ).toLowerCase();


      if (
        !nextPlan
      ) {
        return;
      }


      if (
        nextPlan ===
        normalizedCurrentPlan
      ) {
        return;
      }


      animateSelection();


      // ======================================================
      // FREE PLAN
      // ======================================================
      //
      // Never locally switch a paid subscriber to Free.
      //
      // Their real subscription must first be changed through
      // Apple / Google Play / RevenueCat.
      //
      // ======================================================

      if (
        nextPlan === "free"
      ) {

        if (
          hasPaidMembership
        ) {

          Alert.alert(
            "Manage Your Membership",

            "Your paid Legathon Walk membership is managed through your App Store or Google Play account. Cancel or change the subscription there before the app returns your account to the Free plan.",

            [
              {
                text:
                  "Keep Membership",

                style:
                  "cancel",
              },

              {
                text:
                  "Manage Subscription",

                onPress:
                  openSubscriptionSettings,
              },
            ]
          );


          return;
        }


        if (
          typeof setSubscriptionPlan ===
          "function"
        ) {

          setSubscriptionPlan(
            "free"
          );
        }


        return;
      }


      // ======================================================
      // PREMIUM / ELITE
      // ======================================================

      if (
        nextPlan === "premium" ||
        nextPlan === "elite"
      ) {

        if (
          typeof goToPaywall ===
          "function"
        ) {

          goToPaywall(
            nextPlan
          );


          return;
        }


        Alert.alert(
          "Checkout Unavailable",

          "Subscription checkout is not currently connected."
        );
      }
    };


  // ==========================================================
  // RESTORE PURCHASES
  // ==========================================================

  const handleRestorePurchases =
    async () => {

      if (
        isRestoring
      ) {
        return;
      }


      if (
        typeof onRestorePurchases !==
        "function"
      ) {

        Alert.alert(
          "Restore Purchases",

          "Restore Purchases still needs to be connected to RevenueCat."
        );


        return;
      }


      try {

        setIsRestoring(
          true
        );


        const restoredPlan =
          await onRestorePurchases();


        const normalizedRestoredPlan =
          String(
            restoredPlan ||
            ""
          ).toLowerCase();


        if (
          normalizedRestoredPlan ===
            "premium" ||
          normalizedRestoredPlan ===
            "elite"
        ) {

          if (
            typeof setSubscriptionPlan ===
            "function"
          ) {

            setSubscriptionPlan(
              normalizedRestoredPlan
            );
          }


          Alert.alert(
            "Purchase Restored",

            `Your ${
              normalizedRestoredPlan ===
              "elite"
                ? "Elite"
                : "Premium"
            } membership has been restored.`
          );


          return;
        }


        Alert.alert(
          "No Active Membership Found",

          "No active Premium or Elite membership was found for this account."
        );

      } catch (error) {

        console.log(
          "RESTORE PURCHASE ERROR:",
          error
        );


        Alert.alert(
          "Unable to Restore",

          error?.message ||
            "Your purchases could not be restored."
        );

      } finally {

        setIsRestoring(
          false
        );
      }
    };


  // ==========================================================
  // PRIVACY
  // ==========================================================

  const handlePrivacyPolicy =
    () => {

      if (
        typeof goToPrivacyPolicy ===
        "function"
      ) {

        goToPrivacyPolicy();

        return;
      }


      Alert.alert(
        "Privacy Policy",

        "Privacy Policy navigation is not connected yet."
      );
    };


  // ==========================================================
  // TERMS
  // ==========================================================

  const handleTerms =
    () => {

      if (
        typeof goToTermsOfService ===
        "function"
      ) {

        goToTermsOfService();

        return;
      }


      Alert.alert(
        "Terms of Service",

        "Terms of Service navigation is not connected yet."
      );
    };


  // ==========================================================
  // RETURN
  // ==========================================================

  const handleReturn =
    () => {

      if (
        typeof goBack ===
        "function"
      ) {

        goBack();

        return;
      }


      if (
        typeof goHome ===
        "function"
      ) {

        goHome();
      }
    };


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
        {/* HEADER */}
        {/* ================================================== */}

        <View
          style={
            styles.header
          }
        >

          <TouchableOpacity
            onPress={
              handleReturn
            }
            activeOpacity={
              0.7
            }
            style={
              styles.backButton
            }
          >

            <Text
              style={
                styles.backArrow
              }
            >
              ‹
            </Text>

          </TouchableOpacity>


          <View
            style={
              styles.headerTextWrap
            }
          >

            <Text
              style={
                styles.brand
              }
            >

              <Text
                style={
                  styles.brandBlue
                }
              >
                LEGATHON
              </Text>

              {" "}
              WALK

            </Text>


            <View
              style={
                styles.goldLine
              }
            />


            <Text
              style={
                styles.tagline
              }
            >
              Built for Every Step.
            </Text>

          </View>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <Text
          style={
            styles.screenTitle
          }
        >
          Choose Your Membership
        </Text>


        <Text
          style={
            styles.screenSubtitle
          }
        >
          Start free or unlock the complete Legathon Walk experience with Premium or Elite.
        </Text>


        {/* ================================================== */}
        {/* CURRENT PLAN */}
        {/* ================================================== */}

        <View
          style={
            styles.currentPlanPanel
          }
        >

          <View>

            <Text
              style={
                styles.currentPlanLabel
              }
            >
              CURRENT PLAN
            </Text>


            <Text
              style={[
                styles.currentPlanName,

                {
                  color:
                    currentPlan.accent,
                },
              ]}
            >
              {currentPlan.title.toUpperCase()}
            </Text>

          </View>


          <View
            style={[
              styles.activeBadge,

              {
                borderColor:
                  currentPlan.accent,
              },
            ]}
          >

            <View
              style={[
                styles.activeDot,

                {
                  backgroundColor:
                    currentPlan.accent,
                },
              ]}
            />


            <Text
              style={[
                styles.activeBadgeText,

                {
                  color:
                    currentPlan.accent,
                },
              ]}
            >
              ACTIVE
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* PLAN CARDS */}
        {/* ================================================== */}

        {SUBSCRIPTION_CARDS.map(
          (
            card
          ) => {

            const isCurrent =
              normalizedCurrentPlan ===
              card.id;


            return (

              <Animated.View
                key={
                  card.id
                }
                style={[
                  styles.cardWrap,

                  isCurrent &&
                    styles.currentCardWrap,

                  isCurrent && {
                    borderColor:
                      card.accent,
                  },

                  {
                    transform: [
                      {
                        scale:
                          isCurrent
                            ? pulseAnim
                            : 1,
                      },
                    ],
                  },
                ]}
              >

                {/* ========================================= */}
                {/* CARD BADGES */}
                {/* ========================================= */}

                <View
                  style={
                    styles.cardTopRow
                  }
                >

                  <View
                    style={[
                      styles.planBadge,

                      {
                        borderColor:
                          card.accent,
                      },
                    ]}
                  >

                    <Text
                      style={[
                        styles.planBadgeText,

                        {
                          color:
                            card.accent,
                        },
                      ]}
                    >
                      {card.badge}
                    </Text>

                  </View>


                  {isCurrent && (

                    <View
                      style={[
                        styles.currentBadge,

                        {
                          backgroundColor:
                            card.accent,
                        },
                      ]}
                    >

                      <Text
                        style={
                          styles.currentBadgeText
                        }
                      >
                        CURRENT PLAN
                      </Text>

                    </View>

                  )}

                </View>


                {/* ========================================= */}
                {/* IMAGE */}
                {/* ========================================= */}

                <ImageBackground
                  source={
                    card.image
                  }
                  style={
                    styles.cardImage
                  }
                  imageStyle={
                    styles.cardImageStyle
                  }
                  resizeMode="cover"
                >

                  <View
                    style={
                      styles.cardImageShade
                    }
                  />

                </ImageBackground>


                {/* ========================================= */}
                {/* PRICE */}
                {/* ========================================= */}

                <View
                  style={
                    styles.priceArea
                  }
                >

                  <View>

                    <Text
                      style={
                        styles.planTitle
                      }
                    >
                      {card.title}
                    </Text>


                    <View
                      style={
                        styles.priceRow
                      }
                    >

                      <Text
                        style={[
                          styles.price,

                          {
                            color:
                              card.accent,
                          },
                        ]}
                      >
                        {card.price}
                      </Text>


                      <Text
                        style={
                          styles.pricePeriod
                        }
                      >
                        {card.period}
                      </Text>

                    </View>

                  </View>


                  {card.id ===
                    "elite" && (

                    <View
                      style={
                        styles.crownCircle
                      }
                    >

                      <Text
                        style={
                          styles.crownIcon
                        }
                      >
                        ♛
                      </Text>

                    </View>

                  )}

                </View>


                {/* ========================================= */}
                {/* FEATURES */}
                {/* ========================================= */}

                <View
                  style={
                    styles.featureList
                  }
                >

                  {PLAN_FEATURES[
                    card.id
                  ].map(
                    (
                      feature,
                      index
                    ) => (

                      <View
                        key={`${card.id}-${index}`}
                        style={[
                          styles.featureRow,

                          feature.highlight &&
                            styles.highlightFeature,
                        ]}
                      >

                        <Text
                          style={
                            styles.featureIcon
                          }
                        >
                          {feature.icon}
                        </Text>


                        <Text
                          style={[
                            styles.featureText,

                            !feature.available &&
                              styles.lockedFeatureText,

                            feature.highlight && {
                              color:
                                card.accent,
                            },
                          ]}
                        >
                          {feature.text}
                        </Text>

                      </View>
                    )
                  )}

                </View>


                {/* ========================================= */}
                {/* PLAN BUTTON */}
                {/* ========================================= */}

                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  disabled={
                    isCurrent
                  }
                  onPress={() =>
                    handlePlanSelect(
                      card.id
                    )
                  }
                  style={[
                    styles.planButton,

                    {
                      borderColor:
                        card.accent,
                    },

                    isCurrent &&
                      styles.currentPlanButton,

                    !isCurrent && {
                      backgroundColor:
                        card.accent,
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.planButtonText,

                      isCurrent

                        ? {
                            color:
                              card.accent,
                          }

                        : styles.planButtonActiveText,
                    ]}
                  >

                    {isCurrent

                      ? "CURRENT PLAN"

                      : card.id ===
                        "free"

                      ? hasPaidMembership

                        ? "MANAGE FREE PLAN"

                        : "CHOOSE FREE"

                      : `CHOOSE ${card.title.toUpperCase()}`}

                  </Text>

                </TouchableOpacity>

              </Animated.View>
            );
          }
        )}


        {/* ================================================== */}
        {/* WCOIN REWARDS */}
        {/* ================================================== */}

        <View
          style={
            styles.rewardBox
          }
        >

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            🪙 WALK • COMPLETE • EARN
          </Text>


          <Text
            style={
              styles.rewardTitle
            }
          >
            WCoin Rewards
          </Text>


          <Text
            style={
              styles.rewardDescription
            }
          >
            Complete eligible Legathon Walk activity and journeys to earn WCoins. Your WCoins accumulate in your wallet as you progress.
          </Text>


          <View
            style={
              styles.unlockBox
            }
          >

            <Text
              style={
                styles.unlockSmall
              }
            >
              REDEMPTION UNLOCK
            </Text>


            <Text
              style={
                styles.unlockAmount
              }
            >
              10,000 WCoins
            </Text>


            <Text
              style={
                styles.unlockDescription
              }
            >
              Reach 10,000 earned WCoins to unlock eligible redemption benefits on paid memberships.
            </Text>

          </View>


          <View
            style={
              styles.coinComparison
            }
          >

            <CoinTier
              name="FREE"
              value="COLLECT"
              description="Earn and collect WCoins. Redemption remains locked."
            />


            <View
              style={
                styles.coinDivider
              }
            />


            <CoinTier
              name="PREMIUM"
              value="$5 VALUE"
              description="10,000 WCoins after redemption unlock."
              valueStyle={
                styles.premiumCoinValue
              }
            />


            <View
              style={
                styles.coinDivider
              }
            />


            <CoinTier
              name="ELITE"
              value="$10 VALUE"
              description="10,000 WCoins at the highest membership redemption value."
              valueStyle={
                styles.eliteCoinValue
              }
            />

          </View>


          <Text
            style={
              styles.rewardNote
            }
          >
            WCoins are earned through eligible Legathon activity and journey completion. They are not direct cash-per-mile payments.
          </Text>

        </View>


        {/* ================================================== */}
        {/* TRACKSUITS */}
        {/* ================================================== */}

        <View
          style={
            styles.infoBox
          }
        >

          <Text
            style={
              styles.infoEyebrow
            }
          >
            👕 WALKING MILESTONE REWARDS
          </Text>


          <Text
            style={
              styles.infoTitle
            }
          >
            Tracksuit Collection
          </Text>


          <Text
            style={
              styles.infoText
            }
          >
            The five Legathon tracksuits are earned through walking milestones. Premium and Elite members can unlock the collection as their lifetime walking progress reaches each requirement.
          </Text>


          <View
            style={
              styles.lockStatus
            }
          >

            <Text
              style={
                styles.lockStatusIcon
              }
            >
              👟
            </Text>


            <View
              style={
                styles.lockStatusTextWrap
              }
            >

              <Text
                style={
                  styles.lockStatusTitle
                }
              >
                WALKING REQUIRED
              </Text>


              <Text
                style={
                  styles.lockStatusText
                }
              >
                Tracksuits cannot be purchased
              </Text>

            </View>

          </View>

        </View>


        {/* ================================================== */}
        {/* ELITE WELLNESS */}
        {/* ================================================== */}

        <View
          style={
            styles.eliteCoachBox
          }
        >

          <Text
            style={
              styles.eliteEyebrow
            }
          >
            👑 ELITE EXCLUSIVE
          </Text>


          <Text
            style={
              styles.eliteCoachTitle
            }
          >
            Personal Wellness Coach
          </Text>


          <Text
            style={
              styles.eliteCoachText
            }
          >
            Elite members receive personalized text-based wellness insights using walking pace, activity trends, and walking-performance data.
          </Text>


          <View
            style={
              styles.dataNotice
            }
          >

            <Text
              style={
                styles.dataNoticeIcon
              }
            >
              🚶
            </Text>


            <Text
              style={
                styles.dataNoticeText
              }
            >
              Walking pace is wellness and activity data. It is not used as a direct cash-per-mile reward.
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* COMPARISON */}
        {/* ================================================== */}

        <View
          style={
            styles.comparisonBox
          }
        >

          <Text
            style={
              styles.comparisonTitle
            }
          >
            Membership Comparison
          </Text>


          <View
            style={
              styles.tableHeader
            }
          >

            <Text
              style={
                styles.tableFeatureHeader
              }
            >
              FEATURE
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              FREE
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              PREM
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              ELITE
            </Text>

          </View>


          <ComparisonRow
            label="12 Free Journeys"
            free="✓"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="All Journeys"
            free="—"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="26 Legathons"
            free="—"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="Community"
            free="✓"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="Leaderboard"
            free="✓"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="Walking Analytics"
            free="Basic"
            premium="Advanced"
            elite="Advanced"
            small
          />


          <ComparisonRow
            label="Pace & Mobility"
            free="—"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="WCoin Collection"
            free="✓"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="WCoin Redemption"
            free="—"
            premium="$5"
            elite="$10"
            small
          />


          <ComparisonRow
            label="Tracksuit Unlocks"
            free="—"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="AI Wellness Coach"
            free="—"
            premium="✓"
            elite="✓"
          />


          <ComparisonRow
            label="Personal Coach"
            free="—"
            premium="—"
            elite="✓"
          />


          <ComparisonRow
            label="Free Shipping"
            free="—"
            premium="—"
            elite="✓"
          />

        </View>


        {/* ================================================== */}
        {/* SUBSCRIPTION MANAGEMENT */}
        {/* ================================================== */}

        {hasPaidMembership && (

          <View
            style={
              styles.manageBox
            }
          >

            <Text
              style={
                styles.manageTitle
              }
            >
              Manage Membership
            </Text>


            <Text
              style={
                styles.manageText
              }
            >
              Changes, cancellations, and renewals for paid memberships are managed through your App Store or Google Play account.
            </Text>


            <TouchableOpacity
              style={
                styles.manageButton
              }
              onPress={
                openSubscriptionSettings
              }
              activeOpacity={
                0.8
              }
            >

              <Text
                style={
                  styles.manageButtonText
                }
              >
                MANAGE SUBSCRIPTION
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <View
          style={
            styles.footer
          }
        >

          <Text
            style={
              styles.footerTitle
            }
          >
            Walk More. Experience More.
          </Text>


          <Text
            style={
              styles.footerText
            }
          >
            Your Legathon membership determines the journeys, rewards, analytics, wellness tools, and merchandise benefits available to your account.
          </Text>


          <TouchableOpacity
            style={
              styles.returnButton
            }
            onPress={
              handleReturn
            }
            activeOpacity={
              0.8
            }
          >

            <Text
              style={
                styles.returnText
              }
            >
              Return
            </Text>

          </TouchableOpacity>


          {/* =============================================== */}
          {/* RESTORE PURCHASES */}
          {/* =============================================== */}

          <TouchableOpacity
            style={
              styles.restoreButton
            }
            onPress={
              handleRestorePurchases
            }
            disabled={
              isRestoring
            }
            activeOpacity={
              0.8
            }
          >

            {isRestoring ? (

              <View
                style={
                  styles.restoreRow
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#D8A72E"
                />


                <Text
                  style={
                    styles.restoreText
                  }
                >
                  RESTORING...
                </Text>

              </View>

            ) : (

              <Text
                style={
                  styles.restoreText
                }
              >
                RESTORE PURCHASES
              </Text>

            )}

          </TouchableOpacity>


          <View
            style={
              styles.footerLinks
            }
          >

            <TouchableOpacity
              onPress={
                handlePrivacyPolicy
              }
            >

              <Text
                style={
                  styles.footerLink
                }
              >
                Privacy Policy
              </Text>

            </TouchableOpacity>


            <Text
              style={
                styles.footerDot
              }
            >
              •
            </Text>


            <TouchableOpacity
              onPress={
                handleTerms
              }
            >

              <Text
                style={
                  styles.footerLink
                }
              >
                Terms of Service
              </Text>

            </TouchableOpacity>

          </View>

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


// ============================================================
// COIN TIER
// ============================================================

function CoinTier({

  name,

  value,

  description,

  valueStyle,

}) {

  return (

    <View
      style={
        styles.coinTier
      }
    >

      <Text
        style={
          styles.coinTierName
        }
      >
        {name}
      </Text>


      <Text
        style={[
          styles.coinTierValue,

          valueStyle,
        ]}
      >
        {value}
      </Text>


      <Text
        style={
          styles.coinTierDescription
        }
      >
        {description}
      </Text>

    </View>
  );
}


// ============================================================
// COMPARISON ROW
// ============================================================

function ComparisonRow({

  label,

  free,

  premium,

  elite,

  small = false,

}) {

  return (

    <View
      style={
        styles.tableRow
      }
    >

      <Text
        style={
          styles.tableLabel
        }
      >
        {label}
      </Text>


      <Text
        style={[
          styles.tableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {free}
      </Text>


      <Text
        style={[
          styles.tableValue,

          styles.premiumTableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {premium}
      </Text>


      <Text
        style={[
          styles.tableValue,

          styles.eliteTableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {elite}
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
      backgroundColor: "#05070C",
    },


    container: {
      flex: 1,
      backgroundColor: "#05070C",
    },


    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 160,
    },


    bottomSpace: {
      height: 120,
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },


    backButton: {
      width: 54,
      height: 54,
      borderRadius: 27,
      borderWidth: 1,
      borderColor: "#374151",
      backgroundColor: "#101722",
      alignItems: "center",
      justifyContent: "center",
    },


    backArrow: {
      color: "#D8A72E",
      fontSize: 48,
      fontWeight: "300",
      lineHeight: 48,
      marginTop: -5,
    },


    headerTextWrap: {
      flex: 1,
      alignItems: "center",
    },


    headerSpacer: {
      width: 54,
    },


    brand: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "900",
      letterSpacing: 1.2,
    },


    brandBlue: {
      color: "#1E7BFF",
    },


    goldLine: {
      width: 170,
      height: 3,
      borderRadius: 999,
      backgroundColor: "#D8A72E",
      marginTop: 6,
      marginBottom: 7,
    },


    tagline: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "800",
    },


    // ========================================================
    // TITLE
    // ========================================================

    screenTitle: {
      color: "#FFFFFF",
      fontSize: 31,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 6,
    },


    screenSubtitle: {
      color: "#8F9DB2",
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 22,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 22,
      paddingHorizontal: 16,
    },


    // ========================================================
    // CURRENT PLAN
    // ========================================================

    currentPlanPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#0A1320",
      borderWidth: 1,
      borderColor: "#243A55",
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginBottom: 24,
    },


    currentPlanLabel: {
      color: "#7E8DA4",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2,
    },


    currentPlanName: {
      fontSize: 23,
      fontWeight: "900",
      marginTop: 4,
    },


    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },


    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginRight: 7,
    },


    activeBadgeText: {
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
    },


    // ========================================================
    // CARDS
    // ========================================================

    cardWrap: {
      width: "100%",
      borderRadius: 28,
      overflow: "hidden",
      marginBottom: 28,
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#1E334F",

      shadowColor: "#000000",
      shadowOpacity: 0.35,
      shadowRadius: 12,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 8,
    },


    currentCardWrap: {
      borderWidth: 2,

      shadowColor: "#D8A72E",
      shadowOpacity: 0.3,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 7,
      },

      elevation: 12,
    },


    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 12,
    },


    planBadge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 11,
      paddingVertical: 6,
    },


    planBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
    },


    currentBadge: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },


    currentBadgeText: {
      color: "#05070C",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1,
    },


    cardImage: {
      width: "100%",
      height: 300,
      justifyContent: "flex-end",
    },


    cardImageStyle: {
      borderRadius: 0,
    },


    cardImageShade: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.08)",
    },


    // ========================================================
    // PRICE
    // ========================================================

    priceArea: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 15,
    },


    planTitle: {
      color: "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
    },


    priceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 3,
    },


    price: {
      fontSize: 32,
      fontWeight: "900",
    },


    pricePeriod: {
      color: "#8795AA",
      fontSize: 14,
      fontWeight: "700",
      marginLeft: 5,
      marginBottom: 5,
    },


    crownCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "#151128",
      borderWidth: 1,
      borderColor: "#B28CFF",
      alignItems: "center",
      justifyContent: "center",
    },


    crownIcon: {
      color: "#B28CFF",
      fontSize: 28,
    },


    // ========================================================
    // FEATURES
    // ========================================================

    featureList: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },


    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 38,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      borderBottomColor: "#1C2A3C",
    },


    highlightFeature: {
      backgroundColor:
        "rgba(216,167,46,0.05)",
      borderRadius: 10,
      paddingHorizontal: 6,
    },


    featureIcon: {
      width: 31,
      fontSize: 17,
    },


    featureText: {
      flex: 1,
      color: "#E7EDF6",
      fontSize: 14,
      fontWeight: "700",
    },


    lockedFeatureText: {
      color: "#68778D",
    },


    // ========================================================
    // PLAN BUTTON
    // ========================================================

    planButton: {
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 20,
      borderWidth: 1.5,
      borderRadius: 999,
      paddingVertical: 15,
      alignItems: "center",
    },


    currentPlanButton: {
      backgroundColor: "#071224",
    },


    planButtonText: {
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 1,
    },


    planButtonActiveText: {
      color: "#05070C",
    },


    // ========================================================
    // WCOIN
    // ========================================================

    rewardBox: {
      backgroundColor: "#11150E",
      borderColor: "#8B6B1C",
      borderWidth: 1.5,
      borderRadius: 26,
      padding: 20,
      marginBottom: 24,
    },


    sectionEyebrow: {
      color: "#D8A72E",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.6,
    },


    rewardTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
      marginTop: 7,
    },


    rewardDescription: {
      color: "#AEB8C7",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },


    unlockBox: {
      backgroundColor: "#181A11",
      borderWidth: 1,
      borderColor: "#4E421D",
      borderRadius: 18,
      padding: 16,
      marginTop: 18,
    },


    unlockSmall: {
      color: "#8F9A79",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.6,
    },


    unlockAmount: {
      color: "#F5C94C",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 3,
    },


    unlockDescription: {
      color: "#929C89",
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
      fontWeight: "600",
    },


    coinComparison: {
      marginTop: 17,
    },


    coinTier: {
      paddingVertical: 12,
    },


    coinTierName: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.5,
    },


    coinTierValue: {
      color: "#8D99A8",
      fontSize: 21,
      fontWeight: "900",
      marginTop: 4,
    },


    premiumCoinValue: {
      color: "#D8A72E",
    },


    eliteCoinValue: {
      color: "#B28CFF",
    },


    coinTierDescription: {
      color: "#8994A4",
      fontSize: 13,
      lineHeight: 18,
      marginTop: 3,
    },


    coinDivider: {
      height: 1,
      backgroundColor: "#323526",
    },


    rewardNote: {
      color: "#7F8978",
      fontSize: 11,
      lineHeight: 17,
      marginTop: 15,
      fontStyle: "italic",
    },


    // ========================================================
    // TRACKSUITS
    // ========================================================

    infoBox: {
      backgroundColor: "#071224",
      borderColor: "#24415F",
      borderWidth: 1,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
    },


    infoEyebrow: {
      color: "#58E8C1",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.5,
    },


    infoTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 7,
    },


    infoText: {
      color: "#A6B2C4",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },


    lockStatus: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#0B1727",
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },


    lockStatusIcon: {
      fontSize: 25,
      marginRight: 13,
    },


    lockStatusTextWrap: {
      flex: 1,
    },


    lockStatusTitle: {
      color: "#8C9AAF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
    },


    lockStatusText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      marginTop: 2,
    },


    // ========================================================
    // ELITE
    // ========================================================

    eliteCoachBox: {
      backgroundColor: "#100D1D",
      borderWidth: 1.5,
      borderColor: "#7055A7",
      borderRadius: 26,
      padding: 20,
      marginBottom: 24,

      shadowColor: "#B28CFF",
      shadowOpacity: 0.16,
      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 5,
      },
    },


    eliteEyebrow: {
      color: "#B28CFF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.6,
    },


    eliteCoachTitle: {
      color: "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 7,
    },


    eliteCoachText: {
      color: "#B5AEC6",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },


    dataNotice: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#171228",
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },


    dataNoticeIcon: {
      fontSize: 25,
      marginRight: 12,
    },


    dataNoticeText: {
      flex: 1,
      color: "#BEB7CE",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
    },


    // ========================================================
    // COMPARISON
    // ========================================================

    comparisonBox: {
      backgroundColor: "#071224",
      borderColor: "#243A55",
      borderWidth: 1,
      borderRadius: 24,
      padding: 16,
      marginBottom: 24,
    },


    comparisonTitle: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "900",
      marginBottom: 18,
    },


    tableHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#2A3B51",
    },


    tableFeatureHeader: {
      flex: 1.6,
      color: "#73839A",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },


    tablePlanHeader: {
      flex: 0.75,
      textAlign: "center",
      color: "#73839A",
      fontSize: 9,
      fontWeight: "900",
    },


    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 49,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      borderBottomColor: "#223149",
    },


    tableLabel: {
      flex: 1.6,
      color: "#D7DEEA",
      fontSize: 12,
      fontWeight: "700",
    },


    tableValue: {
      flex: 0.75,
      color: "#58E8C1",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },


    tableValueSmall: {
      fontSize: 9,
    },


    premiumTableValue: {
      color: "#D8A72E",
    },


    eliteTableValue: {
      color: "#B28CFF",
    },


    // ========================================================
    // MANAGE
    // ========================================================

    manageBox: {
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#243A55",
      borderRadius: 24,
      padding: 18,
      marginBottom: 24,
    },


    manageTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
    },


    manageText: {
      color: "#94A3B8",
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
      marginTop: 7,
    },


    manageButton: {
      borderWidth: 1.5,
      borderColor: "#D8A72E",
      borderRadius: 999,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 16,
    },


    manageButtonText: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.8,
    },


    // ========================================================
    // FOOTER
    // ========================================================

    footer: {
      alignItems: "center",
      marginTop: 6,
    },


    footerTitle: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
    },


    footerText: {
      color: "#7F8CA0",
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      marginTop: 7,
      paddingHorizontal: 12,
    },


    returnButton: {
      width: "100%",
      borderColor: "#D8A72E",
      borderWidth: 1.5,
      borderRadius: 999,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 20,
    },


    returnText: {
      color: "#D8A72E",
      fontSize: 18,
      fontWeight: "900",
    },


    restoreButton: {
      width: "100%",
      borderRadius: 999,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 12,
      backgroundColor: "#0A1320",
      borderWidth: 1,
      borderColor: "#243A55",
    },


    restoreRow: {
      flexDirection: "row",
      alignItems: "center",
    },


    restoreText: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.8,
      marginLeft: 8,
    },


    footerLinks: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },


    footerLink: {
      color: "#73839A",
      fontSize: 11,
      fontWeight: "700",
      marginHorizontal: 5,
    },


    footerDot: {
      color: "#3F4C5F",
      fontSize: 12,
    },
  });