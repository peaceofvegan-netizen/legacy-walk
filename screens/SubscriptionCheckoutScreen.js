import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const PREMIUM_CARD = require("../assets/subscriptions/premium-card.jpg");
const ELITE_CARD = require("../assets/subscriptions/elite-card.jpg");

export default function SubscriptionCheckoutScreen({
  selectedPlan = "premium",
  goBack,
  onConfirm,
}) {
  const isElite = selectedPlan === "elite";

  const planTitle = isElite ? "Elite Membership" : "Premium Membership";
  const price = isElite ? "$9.99/mo" : "$4.99/mo";
  const planImage = isElite ? ELITE_CARD : PREMIUM_CARD;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>LEGATHON WALK CHECKOUT</Text>
        <Text style={styles.title}>Confirm Your Membership</Text>

        <Image
          source={planImage}
          style={styles.planImage}
          resizeMode="contain"
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{planTitle}</Text>
          <Text style={styles.summarySub}>Legathon Walk Subscription</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Plan</Text>
            <Text style={styles.value}>{planTitle}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Billing</Text>
            <Text style={styles.value}>Monthly</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.price}>{price}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Today</Text>
            <Text style={styles.totalValue}>{price}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, isElite && styles.eliteButton]}
          onPress={() => onConfirm?.(selectedPlan)}
        >
          <Text style={styles.confirmText}>
            {isElite
              ? "CONFIRM ELITE MEMBERSHIP"
              : "CONFIRM PREMIUM MEMBERSHIP"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Cancel anytime. Secure payments. Your membership unlocks immediately
          after confirmation.
        </Text>
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
    padding: 22,
    paddingBottom: 150,
  },

  backButton: {
    marginBottom: 18,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  kicker: {
    color: "#8EF0C5",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 48,
    marginBottom: 22,
  },

  planImage: {
    width: "100%",
    height: 440,
    borderRadius: 24,
    marginBottom: 24,
  },

  summaryCard: {
    backgroundColor: "#081327",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginBottom: 28,
  },

  summaryTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
  },

  summarySub: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 26,
  },

  row: {
    marginBottom: 18,
  },

  label: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  price: {
    color: "#8EF0C5",
    fontSize: 28,
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
    fontSize: 24,
    fontWeight: "900",
  },

  totalValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },

  confirmButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 18,
  },

  eliteButton: {
    backgroundColor: "#A855F7",
  },

  confirmText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});