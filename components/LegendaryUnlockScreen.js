 import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LegendaryUnlockScreen({ onClose }) {
  return (
    <View style={styles.container}>
      <Text style={styles.small}>LEGENDARY STATUS ACHIEVED</Text>

      <Text style={styles.icon}>🏆</Text>

      <Text style={styles.title}>Legendary Walker</Text>

      <Text style={styles.text}>
        You completed the ultimate Legacy Walk challenge. Your journey now
        becomes part of history.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>✓ 3,000,000+ steps completed</Text>
        <Text style={styles.cardText}>✓ Cross-country endurance unlocked</Text>
        <Text style={styles.cardText}>✓ Elite Legathon status achieved</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Continue Your Legacy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  small: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 18,
  },
  icon: {
    fontSize: 76,
    marginBottom: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
  },
  text: {
    color: "#E5D3A1",
    fontSize: 17,
    lineHeight: 28,
    textAlign: "center",
    marginTop: 20,
    maxWidth: 330,
  },
  card: {
    backgroundColor: "#18110A",
    borderRadius: 28,
    padding: 24,
    width: "100%",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  cardText: {
    color: "#FFD700",
    fontWeight: "900",
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginTop: 34,
  },
  buttonText: {
    color: "#18110A",
    fontWeight: "900",
    fontSize: 17,
  },
});