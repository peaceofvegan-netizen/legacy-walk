import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AvatarSocialCard({
  level = 1,
  rank = "Beginner Walker",
  outfit = "Starter Recovery Set",
  breathingStreak = 0,
  marathonMedals = 0,
  coins = 0,
  wellnessPoints = 0,
  avatarColor = "#A6FFD2",
  auraColor = "#A6FFD2",
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.aura, { backgroundColor: auraColor }]} />

      <Text style={styles.small}>LEGACY WALK PROFILE</Text>

      <View style={styles.avatar}>
        <View style={styles.head} />
        <View style={[styles.body, { backgroundColor: avatarColor }]} />
        <View style={styles.shorts} />

        <View style={styles.legs}>
          <View style={styles.leg} />
          <View style={styles.leg} />
        </View>

        <View style={styles.shoes}>
          <View style={styles.shoe} />
          <View style={styles.shoe} />
        </View>
      </View>

      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.level}>Level {level}</Text>
      <Text style={styles.outfit}>{outfit}</Text>

      <View style={styles.grid}>
        <Stat label="Breathing" value={`${breathingStreak}🔥`} />
        <Stat label="Medals" value={`${marathonMedals}🏅`} />
        <Stat label="Coins" value={coins} />
        <Stat label="Wellness" value={wellnessPoints} />
      </View>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#10151F",
    borderRadius: 34,
    padding: 24,
    borderWidth: 2,
    borderColor: "#A6FFD2",
    alignItems: "center",
    overflow: "hidden",
  },

  aura: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 999,
    opacity: 0.22,
    top: 70,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 18,
  },

  avatar: {
    alignItems: "center",
    marginBottom: 20,
  },

  head: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#F4C7A1",
  },

  body: {
    width: 84,
    height: 100,
    borderRadius: 28,
    marginTop: 8,
  },

  shorts: {
    width: 84,
    height: 38,
    backgroundColor: "#1F2937",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: -5,
  },

  legs: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },

  leg: {
    width: 16,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#F4C7A1",
  },

  shoes: {
    flexDirection: "row",
    gap: 20,
    marginTop: -5,
  },

  shoe: {
    width: 32,
    height: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  rank: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  level: {
    color: "#A6FFD2",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },

  outfit: {
    color: "#8C97A8",
    marginTop: 6,
    fontWeight: "800",
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },

  stat: {
    width: "47%",
    backgroundColor: "#131C2B",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  statLabel: {
    color: "#8C97A8",
    marginTop: 6,
    fontWeight: "800",
    fontSize: 12,
  },
});