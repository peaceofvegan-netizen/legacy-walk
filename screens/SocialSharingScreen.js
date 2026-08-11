import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";

const SHARE_CARDS = [
  {
    id: "journey",
    title: "Journey Complete",
    message: "I completed a LegacyWalks journey and unlocked new rewards.",
    icon: "🏆",
  },
  {
    id: "collection",
    title: "Collection Unlocked",
    message: "I unlocked a new LegacyWalks achievement collection.",
    icon: "👕",
  },
  {
    id: "streak",
    title: "Streak Milestone",
    message: "I hit a new walking streak on LegacyWalks.",
    icon: "🔥",
  },
  {
    id: "coins",
    title: "W Coins Earned",
    message: "I earned W Coins by walking and completing journeys.",
    icon: "🪙",
  },
];

export default function SocialSharingScreen() {
  async function shareCard(card) {
    await Share.share({
      message: `${card.icon} ${card.title}\n\n${card.message}\n\nWalk. Earn. Unlock. Wear Your Legacy.`,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>SOCIAL SHARING</Text>
      <Text style={styles.title}>Share Your Legacy</Text>

      {SHARE_CARDS.map((card) => (
        <View key={card.id} style={styles.card}>
          <Text style={styles.icon}>{card.icon}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardText}>{card.message}</Text>

          <TouchableOpacity style={styles.button} onPress={() => shareCard(card)}>
            <Text style={styles.buttonText}>SHARE</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 140 },
  small: { color: "#D8A72E", fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#FFFFFF", fontSize: 38, fontWeight: "900", marginTop: 10, marginBottom: 20 },
  card: {
    backgroundColor: "#111318",
    borderRadius: 26,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },
  icon: { fontSize: 50 },
  cardTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", marginTop: 12 },
  cardText: { color: "#DDE6F3", lineHeight: 24, marginTop: 10 },
  button: {
    backgroundColor: "#D8A72E",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: { color: "#000000", fontWeight: "900" },
});