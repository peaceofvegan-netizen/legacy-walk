import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  configureRevenueCat,
  loadOfferings,
  buyPackage,
  restoreRevenueCatPurchases,
} from "../services/revenuecat";

export default function PaywallScreen({
  goBack,
  upgradePlan,
  userId,
}) {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [offerings, setOfferings] = useState(null);

  useEffect(() => {
    setupRevenueCat();
  }, []);

  async function setupRevenueCat() {
    try {
      if (userId) {
        await configureRevenueCat(userId);
      }

      const currentOffering = await loadOfferings();
      setOfferings(currentOffering);
    } catch (error) {
      console.log("RevenueCat setup error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  function findPackage(plan) {
    if (!offerings?.availablePackages) return null;

    return offerings.availablePackages.find((pkg) =>
      pkg.product.identifier.includes(plan)
    );
  }

  async function handlePurchase(plan) {
    try {
      setPurchasing(true);

      const packageToBuy = findPackage(plan);

      if (!packageToBuy) {
        Alert.alert(
          "Plan Not Ready",
          "This subscription product is not available yet. Check RevenueCat offerings."
        );
        return;
      }

      const newPlan = await buyPackage(packageToBuy);

      upgradePlan && upgradePlan(newPlan);

      Alert.alert(
        "Membership Activated",
        `Your ${newPlan} membership is now active.`
      );
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Purchase Error", error.message);
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    try {
      setPurchasing(true);

      const restoredPlan = await restoreRevenueCatPurchases();

      upgradePlan && upgradePlan(restoredPlan);

      Alert.alert(
        "Purchases Restored",
        `Your current plan is ${restoredPlan}.`
      );
    } catch (error) {
      Alert.alert("Restore Error", error.message);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>LEGACY WALK MEMBERSHIP</Text>

      <Text style={styles.title}>Unlock Your Full Wellness Journey</Text>

      <Text style={styles.subtitle}>
        Upgrade for AI coaching, premium journeys, rewards, sponsor perks, and
        Legendary Walker benefits.
      </Text>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#A6FFD2" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      ) : (
        <>
          <PlanCard
            title="Premium Walker"
            price="$4.99/mo"
            features={[
              "AI wellness coaching",
              "AI meal guidance",
              "Premium journeys",
              "Marathon training",
              "Enhanced rewards",
              "Premium ambient audio",
            ]}
            buttonText="Choose Premium Walker"
            onPress={() => handlePurchase("premium")}
            disabled={purchasing}
          />

          <PlanCard
            title="Legendary Walker"
            price="$9.99/mo"
            features={[
              "Everything in Premium",
              "Legendary challenges",
              "Sponsor reward eligibility",
              "VIP leaderboard badge",
              "Premium prize eligibility",
              "Free portable bidet welcome gift",
            ]}
            buttonText="Choose Legendary Walker"
            onPress={() => handlePurchase("legendary")}
            disabled={purchasing}
            legendary
          />

          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backText}>Maybe Later</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Subscriptions are processed securely through the App Store. Rewards show
        eligibility and may require verification.
      </Text>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function PlanCard({
  title,
  price,
  features,
  buttonText,
  onPress,
  disabled,
  legendary,
}) {
  return (
    <View style={[styles.planCard, legendary && styles.legendaryCard]}>
      <Text style={styles.planTitle}>{title}</Text>

      <Text style={styles.price}>{price}</Text>

      {features.map((feature, index) => (
        <Text key={index} style={styles.feature}>
          ✓ {feature}
        </Text>
      ))}

      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {disabled ? "Processing..." : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 18,
    paddingBottom: 130,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  subtitle: {
    color: "#A8B3C2",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
    marginBottom: 22,
  },

  loadingCard: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  loadingText: {
    color: "#FFFFFF",
    marginTop: 14,
    fontWeight: "900",
  },

  planCard: {
    backgroundColor: "#10151F",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  legendaryCard: {
    borderColor: "#FFD700",
  },

  planTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  price: {
    color: "#A6FFD2",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 20,
  },

  feature: {
    color: "#DDE6F3",
    fontSize: 16,
    lineHeight: 28,
    fontWeight: "800",
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },

  restoreButton: {
    borderWidth: 1,
    borderColor: "#A6FFD2",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  restoreText: {
    color: "#A6FFD2",
    fontWeight: "900",
    fontSize: 16,
  },

  backButton: {
    marginTop: 18,
    alignItems: "center",
  },

  backText: {
    color: "#8C97A8",
    fontWeight: "900",
  },

  note: {
    color: "#8C97A8",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 18,
    fontSize: 13,
  },
});