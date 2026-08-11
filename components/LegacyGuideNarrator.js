import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const LEGACY_GUIDE = require("../assets/guides/legacy-guide.png");

export default function LegacyGuideNarrator({
  title = "Legathon",
  message = "Welcome to your journey. Every step connects you to history.",
}) {
  return (
    <View style={styles.card}>
      <Image source={LEGACY_GUIDE} style={styles.avatar} />

      <View style={styles.textBox}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.role}>AI WALKING GUIDE</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10,15,23,0.78)",
    borderWidth: 1,
    borderColor: "rgba(166,255,210,0.25)",
    borderRadius: 26,
    padding: 16,
    marginVertical: 18,
  },

  avatar: {
    width: 92,
    height: 120,
    resizeMode: "contain",
    marginRight: 14,
  },

  textBox: {
    flex: 1,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  role: {
    color: "#E0AE25",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  message: {
    color: "#D7DCE8",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
});