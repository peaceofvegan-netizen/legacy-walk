// SubscriptionCheckoutScreen.js

import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  configureRevenueCat,
  loadOfferings,
  buyPackage,
} from "../services/revenuecat";
const PREMIUM_CARD = require("../assets/subscriptions/premium-card.jpg");
const ELITE_CARD = require("../assets/subscriptions/elite-card.jpg");

const PLAN_DATA = {
  premium: {
    id: "premium",
    title: "Premium Membership",
    shortTitle: "Premium",
    price: "$4.99",
    priceLabel: "$4.99/mo",
    billing: "Billed monthly",
    image: PREMIUM_CARD,
    accent: "#D8A72E",
    buttonText: "CONFIRM PREMIUM MEMBERSHIP",
    benefits: [
      "All Legathon Journeys",
      "$0.10 per mile",
      "AI Analytics",
      "Exclusive Rewards",
      "Premium Challenges",
    ],
  },

  elite: {
    id: "elite",
    title: "Elite Membership",
    shortTitle: "Elite",
    price: "$9.99",
    priceLabel: "$9.99/mo",
    billing: "Billed monthly",
    image: ELITE_CARD,
    accent: "#A855F7",
    buttonText: "CONFIRM ELITE MEMBERSHIP",
    benefits: [
      "Everything in Premium",
      "$0.20 per mile",
      "AI Personal Wellness Coach",
      "Elite Challenges",
      "VIP Rewards",
    ],
  },
};

export default function SubscriptionCheckoutScreen({
  selectedPlan = "premium",
  goBack,
  onConfirm,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
  const setupRevenueCat = async () => {
    try {
      await configureRevenueCat("legathon-user");
      console.log("RevenueCat configured from checkout");
    } catch (error) {
      console.log("RevenueCat configuration error:", error);
    }
  };

  setupRevenueCat();
}, []);

  const plan = useMemo(() => {
    return PLAN_DATA[selectedPlan] || PLAN_DATA.premium;
  }, [selectedPlan]);

  const isElite = plan.id === "elite";

  const handleBack = () => {
    if (isProcessing) return;

    if (goBack) {
      goBack();
    }
  };

  const handleConfirm = async () => {
  if (isProcessing) return;

  try {
    setIsProcessing(true);

    console.log("Starting RevenueCat purchase:", plan.id);

    // Get the current RevenueCat offering
    const offering = await loadOfferings();

    if (!offering) {
      throw new Error("No RevenueCat offering available.");
    }

  
  

    // Match the selected Legathon plan
    const packageToBuy = offering.availablePackages?.find((pkg) => {
      const packageId = String(pkg.identifier || "").toLowerCase();
      const productId = String(
        pkg.product?.identifier || ""
      ).toLowerCase();

   if (plan.id === "premium") {
  return (
    packageId === "premium" ||
    productId === "premium_monthly_499"
  );
}

   if (plan.id === "elite") {
  return (
    packageId === "elite" ||
    productId === "legendary_monthly_999"
  );
}

      return false;
    });

    if (!packageToBuy) {
      throw new Error(
        `No RevenueCat package found for ${plan.id}`
      );
    }

    console.log(
      "Purchasing:",
      packageToBuy.identifier,
      packageToBuy.product?.identifier
    );

    // THIS triggers the real App Store / Google Play purchase
    const purchasedPlan = await buyPackage(packageToBuy);

    console.log("RevenueCat purchase result:", purchasedPlan);

    if (purchasedPlan === "premium" || purchasedPlan === "elite") {
      if (onConfirm) {
        await onConfirm(purchasedPlan);
      }
    } else {
      throw new Error(
        `Purchase completed but entitlement was not activated. Result: ${purchasedPlan}`
      );
    }
  } catch (error) {
    if (error?.userCancelled) {
      console.log("Purchase cancelled by user.");
    } else {
      console.log("Subscription purchase error:", error);
    }
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BACK BUTTON */}

        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.kicker}>LEGATHON WALK CHECKOUT</Text>

          <Text style={styles.title}>
            Confirm Your{"\n"}Membership
          </Text>

          <Text style={styles.subtitle}>
            You're one step away from unlocking your upgraded Legathon
            experience.
          </Text>
        </View>

        {/* PLAN STATUS */}

        <View
          style={[
            styles.planBadge,
            isElite && styles.elitePlanBadge,
          ]}
        >
          <Text
            style={[
              styles.planBadgeText,
              isElite && styles.elitePlanBadgeText,
            ]}
          >
            {isElite ? "★ ELITE MEMBERSHIP" : "★ PREMIUM MEMBERSHIP"}
          </Text>
        </View>

        {/* PLAN IMAGE */}

        <View
          style={[
            styles.imageWrap,
            isElite && styles.eliteImageWrap,
          ]}
        >
          <Image
            source={plan.image}
            style={styles.planImage}
            resizeMode="cover"
          />
        </View>

        {/* PRICE HERO */}

        <View style={styles.priceHero}>
          <Text style={styles.priceHeroLabel}>YOUR MEMBERSHIP</Text>

          <Text style={styles.priceHeroTitle}>
            {plan.shortTitle}
          </Text>

          <View style={styles.heroPriceRow}>
            <Text
              style={[
                styles.heroPrice,
                isElite && styles.eliteAccentText,
              ]}
            >
              {plan.price}
            </Text>

            <Text style={styles.heroMonth}> / month</Text>
          </View>

          <Text style={styles.billingText}>
            {plan.billing}
          </Text>
        </View>

        {/* MEMBERSHIP BENEFITS */}

        <View style={styles.benefitsCard}>
          <Text style={styles.sectionEyebrow}>
            INCLUDED WITH YOUR PLAN
          </Text>

          <Text style={styles.benefitsTitle}>
            Membership Benefits
          </Text>

          {plan.benefits.map((benefit, index) => (
            <View
              key={`${plan.id}-${index}`}
              style={[
                styles.benefitRow,
                index === plan.benefits.length - 1 &&
                  styles.lastBenefitRow,
              ]}
            >
              <View
                style={[
                  styles.checkCircle,
                  isElite && styles.eliteCheckCircle,
                ]}
              >
                <Text style={styles.checkMark}>✓</Text>
              </View>

              <Text style={styles.benefitText}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* ORDER SUMMARY */}

        <View
          style={[
            styles.summaryCard,
            isElite && styles.eliteSummaryCard,
          ]}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryKicker}>
                ORDER SUMMARY
              </Text>

              <Text style={styles.summaryTitle}>
                {plan.title}
              </Text>
            </View>

            <View
              style={[
                styles.summaryPlanPill,
                isElite && styles.eliteSummaryPlanPill,
              ]}
            >
              <Text
                style={[
                  styles.summaryPlanPillText,
                  isElite && styles.eliteSummaryPlanPillText,
                ]}
              >
                {plan.shortTitle.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Plan</Text>

            <Text style={styles.value}>
              {plan.title}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Billing</Text>

            <Text style={styles.value}>
              Monthly
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>

            <Text
              style={[
                styles.price,
                isElite && styles.eliteAccentText,
              ]}
            >
              {plan.priceLabel}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>
                Total Today
              </Text>

              <Text style={styles.totalSub}>
                Monthly subscription
              </Text>
            </View>

            <Text
              style={[
                styles.totalValue,
                isElite && styles.eliteAccentText,
              ]}
            >
              {plan.price}
            </Text>
          </View>
        </View>

        {/* SECURE PURCHASE */}

        <View style={styles.secureBox}>
          <View style={styles.secureIcon}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <View style={styles.secureTextWrap}>
            <Text style={styles.secureTitle}>
              Secure Purchase
            </Text>

            <Text style={styles.secureText}>
              Your subscription will be processed securely through your
              device's app store.
            </Text>
          </View>
        </View>

        {/* CONFIRM BUTTON */}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            isElite && styles.eliteButton,
            isProcessing && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.88}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator
                size="small"
                color="#020617"
              />

              <Text style={styles.confirmText}>
                PROCESSING...
              </Text>
            </View>
          ) : (
            <Text style={styles.confirmText}>
              {plan.buttonText}
            </Text>
          )}
        </TouchableOpacity>

        {/* PAYMENT INFO */}

        <Text style={styles.footerText}>
          Payment will be charged to your App Store or Google Play
          account after purchase confirmation. Your subscription renews
          automatically unless canceled through your account subscription
          settings.
        </Text>

        {/* CANCEL MESSAGE */}

        <View style={styles.cancelBox}>
          <Text style={styles.cancelTitle}>
            No long-term commitment
          </Text>

          <Text style={styles.cancelText}>
            Manage or cancel your membership through your device's
            subscription settings.
          </Text>
        </View>

        {/* LEGATHON FOOTER */}

        <View style={styles.brandFooter}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>
            <Text style={styles.footerBlue}>
              LEGATHON
            </Text>{" "}
            WALK
          </Text>

          <Text style={styles.footerTagline}>
            Walk Today.{" "}
            <Text style={styles.footerGold}>
              Legacy Forever.
            </Text>
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 100,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingRight: 20,
    marginBottom: 10,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  header: {
    marginBottom: 20,
  },

  kicker: {
    color: "#8EF0C5",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.7,
    marginBottom: 9,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginBottom: 12,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },

  planBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(216,167,46,0.14)",
    borderColor: "#D8A72E",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },

  elitePlanBadge: {
    backgroundColor: "rgba(168,85,247,0.15)",
    borderColor: "#A855F7",
  },

  planBadgeText: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  elitePlanBadgeText: {
    color: "#C084FC",
  },

  imageWrap: {
    width: "100%",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#D8A72E",
    marginBottom: 20,

    shadowColor: "#D8A72E",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  eliteImageWrap: {
    borderColor: "#A855F7",
    shadowColor: "#A855F7",
  },

  planImage: {
    width: "100%",
    height: 430,
  },

  priceHero: {
    alignItems: "center",
    backgroundColor: "#071224",
    borderWidth: 1,
    borderColor: "#1E334F",
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  priceHeroLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  priceHeroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 5,
  },

  heroPriceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  heroPrice: {
    color: "#D8A72E",
    fontSize: 44,
    fontWeight: "900",
  },

  heroMonth: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  billingText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },

  benefitsCard: {
    backgroundColor: "#081327",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1D334F",
    marginBottom: 20,
  },

  sectionEyebrow: {
    color: "#8EF0C5",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  benefitsTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 17,
  },

  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#16243A",
  },

  lastBenefitRow: {
    borderBottomWidth: 0,
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D8A72E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  eliteCheckCircle: {
    backgroundColor: "#A855F7",
  },

  checkMark: {
    color: "#020617",
    fontSize: 17,
    fontWeight: "900",
  },

  benefitText: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: "#081327",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1.5,
    borderColor: "#D8A72E",
    marginBottom: 20,

    shadowColor: "#D8A72E",
    shadowOpacity: 0.13,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  eliteSummaryCard: {
    borderColor: "#A855F7",
    shadowColor: "#A855F7",
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  summaryKicker: {
    color: "#8EF0C5",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  summaryPlanPill: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 10,
  },

  eliteSummaryPlanPill: {
    backgroundColor: "#A855F7",
  },

  summaryPlanPillText: {
    color: "#020617",
    fontSize: 10,
    fontWeight: "900",
  },

  eliteSummaryPlanPillText: {
    color: "#FFFFFF",
  },

  row: {
    marginBottom: 18,
  },

  label: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  price: {
    color: "#D8A72E",
    fontSize: 24,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: "#26364F",
    marginVertical: 20,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#8EF0C5",
    fontSize: 21,
    fontWeight: "900",
  },

  totalSub: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  totalValue: {
    color: "#D8A72E",
    fontSize: 32,
    fontWeight: "900",
  },

  eliteAccentText: {
    color: "#C084FC",
  },

  secureBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071224",
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: "#1E334F",
    marginBottom: 20,
  },

  secureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#102039",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  lockIcon: {
    fontSize: 20,
  },

  secureTextWrap: {
    flex: 1,
  },

  secureTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },

  secureText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 22,
    paddingVertical: 21,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    shadowColor: "#D8A72E",
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  eliteButton: {
    backgroundColor: "#A855F7",
    shadowColor: "#A855F7",
  },

  disabledButton: {
    opacity: 0.65,
  },

  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  confirmText: {
    color: "#020617",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.4,
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 8,
    marginBottom: 20,
  },

  cancelBox: {
    backgroundColor: "#071224",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E334F",
    padding: 17,
    alignItems: "center",
    marginBottom: 30,
  },

  cancelTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 5,
  },

  cancelText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontWeight: "600",
  },

  brandFooter: {
    alignItems: "center",
    paddingTop: 8,
  },

  footerLine: {
    width: 80,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#D8A72E",
    marginBottom: 15,
  },

  footerBrand: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 1,
  },

  footerBlue: {
    color: "#1E7BFF",
  },

  footerTagline: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  footerGold: {
    color: "#D8A72E",
  },
});