import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FraudReviewStatusCard({ walk }) {
  if (!walk) return null;

  const rewardEligible = walk.rewardEligible !== false;
  const riskScore = walk.fraudRiskScore || 0;
  const issues = walk.fraudIssues || [];

  return (
    <View
      style={[
        styles.card,
        rewardEligible ? styles.verifiedCard : styles.reviewCard,
      ]}
    >
      <Text style={styles.title}>
        {rewardEligible ? "Walk Verified ✅" : "Manual Review Pending ⚠️"}
      </Text>

      <Text style={styles.text}>
        {rewardEligible
          ? "This walk passed validation and is eligible for rewards."
          : "Rewards are blocked until this walk is reviewed."}
      </Text>

      {!rewardEligible && (
        <>
          <Text style={styles.score}>Risk Score: {riskScore}/100</Text>

          {issues.map((issue, index) => (
            <Text key={index} style={styles.issue}>
              • {issue}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
  },
  verifiedCard: {
    backgroundColor: "#0E1A13",
    borderColor: "#A6FFD2",
  },
  reviewCard: {
    backgroundColor: "#2A1C11",
    borderColor: "#FFD700",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  text: {
    color: "#DDE6F3",
    marginTop: 6,
    lineHeight: 21,
  },
  score: {
    color: "#FFD700",
    fontWeight: "900",
    marginTop: 10,
  },
  issue: {
    color: "#FFE7A3",
    marginTop: 5,
    lineHeight: 20,
  },
});