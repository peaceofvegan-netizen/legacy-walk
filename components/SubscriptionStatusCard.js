import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PLAN_LABELS = {
  free: "Free Walker",
  premium: "Premium Walker",
  legendary: "Legendary Walker",
};

export default function SubscriptionStatusCard({
  userPlan = "free",
  goPaywall,
}) {
  const label = PLAN_LABELS[userPlan] || "Free Walker";
  const isPaid = userPlan !== "free";

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>SUBSCRIPTION STATUS</Text>

      <Text style={styles.planTitle}>
        {isPaid ? "✨" : "🔓"} {label}
      </Text>

      <Text style={styles.text}>
        {isPaid
          ? "Premium journeys, rewards, and exclusive content are active."
          : "Upgrade to unlock premium journeys, wellness packs, and legendary challenges."}
      </Text>

      <TouchableOpacity style={styles.button} onPress={goPaywall}>
        <Text style={styles.buttonText}>
          {isPaid ? "Manage Plan" : "Upgrade Plan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },
  cardLabel: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 12,
  },
  planTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  text: {
    color: "#A8B3C2",
    lineHeight: 23,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
  },
});