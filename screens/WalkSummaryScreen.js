 import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function WalkSummaryScreen({ goHome, goReflect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.small}>WALK COMPLETE</Text>

      <Text style={styles.title}>
        You Built Legacy Today.
      </Text>

      <Text style={styles.subtitle}>
        Your walk session is complete. Take a moment to reflect on what you unlocked.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>TODAY’S SESSION</Text>
        <Text style={styles.stat}>8,742 Steps</Text>
        <Text style={styles.stat}>3.9 Miles</Text>
        <Text style={styles.stat}>🔥 12-Day Streak</Text>
        <Text style={styles.stat}>✨ Story Moment Unlocked</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={goReflect}>
        <Text style={styles.buttonText}>Write Reflection</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={goHome}>
        <Text style={styles.secondaryText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    justifyContent: "center",
    padding: 24,
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
    marginTop: 18,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    marginBottom: 24,
  },
  cardLabel: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  stat: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
  },
  secondaryText: {
    color: "#A6FFD2",
    fontWeight: "900",
    fontSize: 16,
  },
});