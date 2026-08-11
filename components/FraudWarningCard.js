import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FraudWarningCard({
  validation,
}) {
  if (!validation || validation.valid) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Suspicious Activity Detected
      </Text>

      <Text style={styles.score}>
        Risk Score: {validation.riskScore}/100
      </Text>

      {validation.issues.map((issue, index) => (
        <Text key={index} style={styles.issue}>
          • {issue}
        </Text>
      ))}

      <Text style={styles.note}>
        Rewards may require manual verification.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2A120F",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FF6B57",
    marginBottom: 16,
  },

  title: {
    color: "#FF6B57",
    fontSize: 18,
    fontWeight: "900",
  },

  score: {
    color: "#FFD7D2",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "800",
  },

  issue: {
    color: "#FFFFFF",
    lineHeight: 22,
    marginBottom: 6,
  },

  note: {
    color: "#FFD7D2",
    marginTop: 14,
    lineHeight: 22,
  },
});