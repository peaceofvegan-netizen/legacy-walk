// SubscriptionScreen.js

import React, { useRef } from "react";
import {
  Animated,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const FREE_CARD = require("../assets/subscriptions/free-card.jpg");
const PREMIUM_CARD = require("../assets/subscriptions/premium-card.jpg");
const ELITE_CARD = require("../assets/subscriptions/elite-card.jpg");

// ======================================================
// MEMBERSHIP CONFIGURATION
// ======================================================

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

const PLAN_FEATURES = {
  free: [
    { icon: "🌎", text: "12 Free Journeys", available: true },
    { icon: "👥", text: "Legathon Community", available: true },
    { icon: "🏆", text: "Leaderboard & Rankings", available: true },
    { icon: "📊", text: "Basic Walking Analytics", available: true },
    { icon: "🪙", text: "Collect WCoins", available: true },

    { icon: "🔒", text: "WCoin Redemption", available: false },
    { icon: "🔒", text: "26 Legathons", available: false },
    { icon: "🔒", text: "All Premium Journeys", available: false },
    { icon: "🔒", text: "5 Tracksuit Unlocks", available: false },
    { icon: "🔒", text: "Advanced Walking Analytics", available: false },
    { icon: "🔒", text: "Personal Wellness Coach", available: false },
  ],

  premium: [
    { icon: "🌎", text: "All 92+ Journeys", available: true },
    { icon: "🏁", text: "All 26 Legathons", available: true },
    { icon: "👥", text: "Legathon Community", available: true },
    { icon: "🏆", text: "Full Leaderboard & Rankings", available: true },
    { icon: "📈", text: "Advanced Walking Analytics", available: true },
    { icon: "🚶", text: "Walking Pace Data", available: true },
    { icon: "🧠", text: "AI Wellness Access", available: true },
    { icon: "👕", text: "5 Tracksuit Unlocks", available: true },
    { icon: "🪙", text: "WCoin Redemption", available: true },
    { icon: "🎁", text: "Premium Merchandise Benefits", available: true },

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
    { icon: "🔒", text: "Free Merchandise Shipping", available: false },
  ],

  elite: [
    { icon: "👑", text: "Everything in Premium", available: true },
    { icon: "🌎", text: "All 92+ Journeys", available: true },
    { icon: "🏁", text: "All 26 Legathons", available: true },
    { icon: "🏆", text: "Full Leaderboard & Rankings", available: true },
    { icon: "📈", text: "Advanced Walking Analytics", available: true },
    { icon: "🚶", text: "Walking Pace Data", available: true },
    { icon: "🧠", text: "AI Wellness Access", available: true },
    {
      icon: "🤖",
      text: "Personal Wellness Coach",
      available: true,
      highlight: true,
    },
    { icon: "👕", text: "5 Tracksuit Unlocks", available: true },
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
    { icon: "🎁", text: "Elite Merchandise Benefits", available: true },
  ],
};

// ======================================================
// MAIN SCREEN
// ======================================================

export default function SubscriptionScreen({
  subscriptionPlan = "free",
  setSubscriptionPlan,
  goBack,
  goHome,
  goToPaywall,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ====================================================
  // PLAN SELECTION
  // ====================================================

  const handlePlanSelect = (planId) => {
    if (planId === subscriptionPlan) {
      return;
    }

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.98,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 4,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    // Free does not need a paywall.
    if (planId === "free") {
      if (setSubscriptionPlan) {
        setSubscriptionPlan("free");
      }
      return;
    }

    // Paid plans go through checkout/paywall.
    if (goToPaywall) {
      goToPaywall(planId);
      return;
    }

    // Fallback for development/testing only.
    if (setSubscriptionPlan) {
      setSubscriptionPlan(planId);
    }
  };

  const handleReturn = () => {
    if (goBack) {
      goBack();
    } else if (goHome) {
      goHome();
    }
  };

  const currentPlan =
    SUBSCRIPTION_CARDS.find(
      (plan) => plan.id === subscriptionPlan
    ) || SUBSCRIPTION_CARDS[0];

  // ====================================================
  // UI
  // ====================================================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleReturn}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.brand}>
              <Text style={styles.brandBlue}>LEGATHON</Text> WALK
            </Text>

            <View style={styles.goldLine} />

            <Text style={styles.tagline}>
              Walk Today.{" "}
              <Text style={styles.goldText}>Legacy Forever.</Text>
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* =================================================
            TITLE
        ================================================= */}

        <Text style={styles.screenTitle}>
          Upgrade Your Legathon Journey
        </Text>

        <Text style={styles.screenSubtitle}>
          Choose the walking experience that fits your journey.
        </Text>

        {/* =================================================
            CURRENT PLAN
        ================================================= */}

        <View style={styles.currentPlanPanel}>
          <View>
            <Text style={styles.currentPlanLabel}>
              CURRENT PLAN
            </Text>

            <Text
              style={[
                styles.currentPlanName,
                { color: currentPlan.accent },
              ]}
            >
              {currentPlan.title.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.activeBadge,
              {
                borderColor: currentPlan.accent,
              },
            ]}
          >
            <View
              style={[
                styles.activeDot,
                {
                  backgroundColor: currentPlan.accent,
                },
              ]}
            />

            <Text
              style={[
                styles.activeBadgeText,
                {
                  color: currentPlan.accent,
                },
              ]}
            >
              ACTIVE
            </Text>
          </View>
        </View>

        {/* =================================================
            SUBSCRIPTION CARDS
        ================================================= */}

        {SUBSCRIPTION_CARDS.map((card) => {
          const isCurrent = subscriptionPlan === card.id;

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.cardWrap,
                isCurrent && styles.currentCardWrap,
                isCurrent && {
                  borderColor: card.accent,
                },
                {
                  transform: [
                    {
                      scale: isCurrent ? pulseAnim : 1,
                    },
                  ],
                },
              ]}
            >
              {/* TOP BADGES */}

              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.planBadge,
                    {
                      borderColor: card.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.planBadgeText,
                      {
                        color: card.accent,
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
                        backgroundColor: card.accent,
                      },
                    ]}
                  >
                    <Text style={styles.currentBadgeText}>
                      CURRENT PLAN
                    </Text>
                  </View>
                )}
              </View>

              {/* CARD IMAGE */}

              <ImageBackground
                source={card.image}
                style={styles.cardImage}
                imageStyle={styles.cardImageStyle}
                resizeMode="cover"
              >
                <View style={styles.cardImageShade} />
              </ImageBackground>

              {/* PRICE */}

              <View style={styles.priceArea}>
                <View>
                  <Text style={styles.planTitle}>
                    {card.title}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text
                      style={[
                        styles.price,
                        {
                          color: card.accent,
                        },
                      ]}
                    >
                      {card.price}
                    </Text>

                    <Text style={styles.pricePeriod}>
                      {card.period}
                    </Text>
                  </View>
                </View>

                {card.id === "elite" && (
                  <View style={styles.crownCircle}>
                    <Text style={styles.crownIcon}>♛</Text>
                  </View>
                )}
              </View>

              {/* FEATURES */}

              <View style={styles.featureList}>
                {PLAN_FEATURES[card.id].map(
                  (feature, index) => (
                    <View
                      key={`${card.id}-${index}`}
                      style={[
                        styles.featureRow,
                        feature.highlight &&
                          styles.highlightFeature,
                      ]}
                    >
                      <Text style={styles.featureIcon}>
                        {feature.icon}
                      </Text>

                      <Text
                        style={[
                          styles.featureText,
                          !feature.available &&
                            styles.lockedFeatureText,
                          feature.highlight && {
                            color: card.accent,
                          },
                        ]}
                      >
                        {feature.text}
                      </Text>
                    </View>
                  )
                )}
              </View>

              {/* ACTION BUTTON */}

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isCurrent}
                onPress={() => handlePlanSelect(card.id)}
                style={[
                  styles.planButton,
                  {
                    borderColor: card.accent,
                  },
                  isCurrent && styles.currentPlanButton,
                  !isCurrent && {
                    backgroundColor: card.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.planButtonText,
                    isCurrent
                      ? {
                          color: card.accent,
                        }
                      : styles.planButtonActiveText,
                  ]}
                >
                  {isCurrent
                    ? "CURRENT PLAN"
                    : card.id === "free"
                    ? "CHOOSE FREE"
                    : `CHOOSE ${card.title.toUpperCase()}`}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* =================================================
            WCOIN REWARDS
        ================================================= */}

        <View style={styles.rewardBox}>
          <Text style={styles.sectionEyebrow}>
            🪙 WALK • COMPLETE • EARN
          </Text>

          <Text style={styles.rewardTitle}>
            WCoin Rewards
          </Text>

          <Text style={styles.rewardDescription}>
            Complete Legathon journeys to earn WCoins.
            WCoins accumulate in your wallet as you walk
            through and complete eligible journeys.
          </Text>

          <View style={styles.unlockBox}>
            <Text style={styles.unlockSmall}>
              REDEMPTION UNLOCK
            </Text>

            <Text style={styles.unlockAmount}>
              10,000 WCoins
            </Text>

            <Text style={styles.unlockDescription}>
              Reach 10,000 earned WCoins to unlock
              redemption on eligible paid memberships.
            </Text>
          </View>

          <View style={styles.coinComparison}>
            <View style={styles.coinTier}>
              <Text style={styles.coinTierName}>
                FREE
              </Text>

              <Text style={styles.coinTierValue}>
                COLLECT
              </Text>

              <Text style={styles.coinTierDescription}>
                WCoins accumulate, but redemption remains locked.
              </Text>
            </View>

            <View style={styles.coinDivider} />

            <View style={styles.coinTier}>
              <Text style={styles.coinTierName}>
                PREMIUM
              </Text>

              <Text style={styles.premiumCoinValue}>
                $5 VALUE
              </Text>

              <Text style={styles.coinTierDescription}>
                10,000 WCoins after redemption unlock.
              </Text>
            </View>

            <View style={styles.coinDivider} />

            <View style={styles.coinTier}>
              <Text style={styles.coinTierName}>
                ELITE
              </Text>

              <Text style={styles.eliteCoinValue}>
                $10 VALUE
              </Text>

              <Text style={styles.coinTierDescription}>
                10,000 WCoins at the highest membership value.
              </Text>
            </View>
          </View>

          <Text style={styles.rewardNote}>
            WCoins are earned through eligible Legathon activity
            and journey completion. They are not direct
            cash-per-mile payments.
          </Text>
        </View>

        {/* =================================================
            TRACKSUIT ACCESS
        ================================================= */}

        <View style={styles.infoBox}>
          <Text style={styles.infoEyebrow}>
            👕 MEMBER UNLOCKS
          </Text>

          <Text style={styles.infoTitle}>
            Tracksuit Collection
          </Text>

          <Text style={styles.infoText}>
            The five Legathon tracksuit rewards are subscriber
            benefits. Free members may continue earning progress,
            but the tracksuits remain locked until a Premium or
            Elite membership is active.
          </Text>

          <View style={styles.lockStatus}>
            <Text style={styles.lockStatusIcon}>🔒</Text>

            <View style={styles.lockStatusTextWrap}>
              <Text style={styles.lockStatusTitle}>
                FREE MEMBERS
              </Text>

              <Text style={styles.lockStatusText}>
                All five tracksuits locked
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            ELITE WELLNESS
        ================================================= */}

        <View style={styles.eliteCoachBox}>
          <Text style={styles.eliteEyebrow}>
            👑 ELITE EXCLUSIVE
          </Text>

          <Text style={styles.eliteCoachTitle}>
            Personal Wellness Coach
          </Text>

          <Text style={styles.eliteCoachText}>
            Elite members receive access to the Legathon
            Personal Wellness Coach with walking pace,
            activity trends, and walking-performance data
            incorporated into the experience.
          </Text>

          <View style={styles.dataNotice}>
            <Text style={styles.dataNoticeIcon}>🚶</Text>

            <Text style={styles.dataNoticeText}>
              Walking pace is provided as wellness and activity
              data. It is not part of the WCoin reward calculation.
            </Text>
          </View>
        </View>

        {/* =================================================
            QUICK COMPARISON
        ================================================= */}

        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>
            Membership Comparison
          </Text>

          <View style={styles.tableHeader}>
            <Text style={styles.tableFeatureHeader}>
              FEATURE
            </Text>

            <Text style={styles.tablePlanHeader}>
              FREE
            </Text>

            <Text style={styles.tablePlanHeader}>
              PREM
            </Text>

            <Text style={styles.tablePlanHeader}>
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
            label="All 92+ Journeys"
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
            label="WCoin Collection"
            free="✓"
            premium="✓"
            elite="✓"
          />

          <ComparisonRow
            label="WCoin Redemption"
            free="—"
            premium="✓"
            elite="✓"
          />

          <ComparisonRow
            label="Tracksuit Unlocks"
            free="—"
            premium="✓"
            elite="✓"
          />

          <ComparisonRow
            label="AI Wellness"
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

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            Walk More. Experience More.
          </Text>

          <Text style={styles.footerText}>
            Your Legathon membership determines the journeys,
            rewards, analytics and wellness experiences available
            to your account.
          </Text>

          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturn}
            activeOpacity={0.8}
          >
            <Text style={styles.returnText}>
              Return Home
            </Text>
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>
                Restore Purchases
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerDot}>•</Text>

            <TouchableOpacity>
              <Text style={styles.footerLink}>
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerDot}>•</Text>

            <TouchableOpacity>
              <Text style={styles.footerLink}>
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// COMPARISON ROW
// ======================================================

function ComparisonRow({
  label,
  free,
  premium,
  elite,
  small = false,
}) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.tableValue,
          small && styles.tableValueSmall,
        ]}
      >
        {free}
      </Text>

      <Text
        style={[
          styles.tableValue,
          styles.premiumTableValue,
          small && styles.tableValueSmall,
        ]}
      >
        {premium}
      </Text>

      <Text
        style={[
          styles.tableValue,
          styles.eliteTableValue,
          small && styles.tableValueSmall,
        ]}
      >
        {elite}
      </Text>
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
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

  // HEADER

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
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  goldText: {
    color: "#D8A72E",
  },

  // TITLE

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

  // CURRENT PLAN

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

  // CARDS

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
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  // PRICE

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

  // FEATURES

  featureList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 38,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1C2A3C",
  },

  highlightFeature: {
    backgroundColor: "rgba(216,167,46,0.05)",
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

  // PLAN BUTTON

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

  // WCOIN BOX

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
    fontSize: 21,
    fontWeight: "900",
    marginTop: 4,
  },

  eliteCoinValue: {
    color: "#B28CFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 4,
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

  // TRACKSUITS

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

  // ELITE COACH

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

  // COMPARISON

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
    borderBottomWidth: StyleSheet.hairlineWidth,
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

  // FOOTER

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