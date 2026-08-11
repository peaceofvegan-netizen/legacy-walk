import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

import wishlistJourneys from "../data/wishlistJourneys";

export default function WishlistScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>WISHLIST</Text>
      <Text style={styles.title}>Dream Journeys</Text>
      <Text style={styles.subtitle}>
        Save future walks you want to complete around the world.
      </Text>

      {wishlistJourneys.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.icon}>{item.icon}</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>
              {item.country} • {item.category}
            </Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Saved</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 130 },
  small: { color: "#A6FFD2", fontSize: 12, fontWeight: "900", marginBottom: 14 },
  title: { color: "#FFFFFF", fontSize: 38, fontWeight: "900" },
  subtitle: { color: "#A8B3C2", fontSize: 16, lineHeight: 24, marginTop: 14, marginBottom: 22 },
  card: {
    backgroundColor: "#10151F",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },
  icon: { fontSize: 34, marginRight: 14 },
  cardTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  cardText: { color: "#8C97A8", marginTop: 5 },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  buttonText: { color: "#04110A", fontWeight: "900" },
});