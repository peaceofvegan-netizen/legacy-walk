import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";

import { getEquippedAvatar } from "../utils/avatarInventoryStorage";

const COLLAGE_BG = require("../assets/collage-background.png");

const leaderboardUsers = [
  {
    rank: 1,
    name: "MayaRuns",
    title: "Legend Walker",
    steps: 2450000,
    avatar: "🏆",
  },
  {
    rank: 2,
    name: "HistoryHunter",
    title: "Master Explorer",
    steps: 1980000,
    avatar: "🔥",
  },
  {
    rank: 3,
    name: "TrailKing",
    title: "Wayfinder",
    steps: 1525000,
    avatar: "🥉",
  },
  {
    rank: 4,
    name: "Phillip Morris",
    title: "Explorer",
    steps: 1245000,
    avatar: null,
    isUser: true,
  },
  {
    rank: 5,
    name: "JourneyQueen",
    title: "Traveler",
    steps: 990000,
    avatar: "⭐",
  },
];

export default function LeaderboardScreen() {
  const [currentAvatar, setCurrentAvatar] = useState(null);

  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = async () => {
    const avatar = await getEquippedAvatar();
    setCurrentAvatar(avatar);
  };

  return (
    <ImageBackground
      source={COLLAGE_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.kicker}>LEGACY WALK</Text>
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.subtitle}>
              Compete with walkers, explorers, and legends.
            </Text>

            <View style={styles.userHighlightCard}>
              <View style={styles.userAvatarFrame}>
                {currentAvatar ? (
                  <Image
                    source={currentAvatar.image}
                    style={styles.userAvatarImage}
                  />
                ) : (
                  <Text style={styles.userAvatarEmoji}>👤</Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.userLabel}>Your Rank</Text>
                <Text style={styles.userName}>Phillip Morris</Text>
                <Text style={styles.userMeta}>
                  #{leaderboardUsers.find((u) => u.isUser)?.rank || 4} •{" "}
                  {currentAvatar?.name || "Legacy Avatar"}
                </Text>
              </View>

              <View style={styles.rankPill}>
                <Text style={styles.rankPillText}>#4</Text>
              </View>
            </View>

            <View style={styles.podiumCard}>
              <Text style={styles.sectionTitle}>Top Walkers</Text>

              <View style={styles.podiumRow}>
                <PodiumPlace
                  place="2"
                  name="HistoryHunter"
                  steps="1.98M"
                  size="medium"
                />

                <PodiumPlace
                  place="1"
                  name="MayaRuns"
                  steps="2.45M"
                  size="large"
                />

                <PodiumPlace
                  place="3"
                  name="TrailKing"
                  steps="1.52M"
                  size="medium"
                />
              </View>
            </View>

            <View style={styles.listCard}>
              <Text style={styles.sectionTitle}>Weekly Rankings</Text>

              {leaderboardUsers.map((user) => {
                const isUser = user.isUser;

                return (
                  <View
                    key={user.rank}
                    style={[
                      styles.leaderRow,
                      isUser && styles.userLeaderRow,
                    ]}
                  >
                    <View style={styles.rankCircle}>
                      <Text style={styles.rankText}>{user.rank}</Text>
                    </View>

                    <View style={styles.rowAvatar}>
                      {isUser && currentAvatar ? (
                        <Image
                          source={currentAvatar.image}
                          style={styles.rowAvatarImage}
                        />
                      ) : (
                        <Text style={styles.rowAvatarEmoji}>
                          {user.avatar || "👟"}
                        </Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowName}>{user.name}</Text>
                      <Text style={styles.rowTitle}>{user.title}</Text>
                    </View>

                    <View style={styles.stepsBox}>
                      <Text style={styles.stepsValue}>
                        {user.steps.toLocaleString()}
                      </Text>
                      <Text style={styles.stepsLabel}>steps</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.challengeCard}>
              <Text style={styles.goldLabel}>DAILY CHALLENGE</Text>
              <Text style={styles.challengeTitle}>
                Climb 2 spots today
              </Text>
              <Text style={styles.challengeText}>
                Walk 4,500 more steps to pass the next explorer and earn bonus
                W Coins.
              </Text>

              <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeButtonText}>
                  Start Walking
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function PodiumPlace({ place, name, steps, size }) {
  const large = size === "large";

  return (
    <View style={[styles.podiumPlace, large && styles.podiumPlaceLarge]}>
      <View style={[styles.podiumBadge, large && styles.podiumBadgeLarge]}>
        <Text style={styles.podiumBadgeText}>#{place}</Text>
      </View>

      <Text style={styles.podiumName}>{name}</Text>
      <Text style={styles.podiumSteps}>{steps} steps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  backgroundImage: {
    opacity: 0.35,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,10,18,0.86)",
  },

  safe: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
  },

  subtitle: {
    color: "#AAB3C5",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 20,
  },

  userHighlightCard: {
    backgroundColor: "#101826",
    borderRadius: 28,
    padding: 18,
    borderWidth: 2,
    borderColor: "#D4AF37",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  userAvatarFrame: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#050A12",
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },

  userAvatarImage: {
    width: 70,
    height: 90,
    resizeMode: "contain",
  },

  userAvatarEmoji: {
    fontSize: 34,
  },

  userLabel: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },

  userMeta: {
    color: "#AAB3C5",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },

  rankPill: {
    backgroundColor: "#D4AF37",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  rankPillText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
  },

  podiumCard: {
    backgroundColor: "#101826",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26344A",
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  podiumPlace: {
    width: "31%",
    backgroundColor: "#050A12",
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#26344A",
  },

  podiumPlaceLarge: {
    paddingVertical: 22,
    borderColor: "#D4AF37",
  },

  podiumBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#26344A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  podiumBadgeLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D4AF37",
  },

  podiumBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  podiumName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  podiumSteps: {
    color: "#AAB3C5",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  listCard: {
    backgroundColor: "#101826",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26344A",
    marginBottom: 20,
  },

  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#050A12",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2A3A",
  },

  userLeaderRow: {
    borderColor: "#D4AF37",
    borderWidth: 2,
  },

  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#26344A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rankText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  rowAvatar: {
    width: 48,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rowAvatarImage: {
    width: 44,
    height: 58,
    resizeMode: "contain",
  },

  rowAvatarEmoji: {
    fontSize: 26,
  },

  rowName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  rowTitle: {
    color: "#AAB3C5",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  stepsBox: {
    alignItems: "flex-end",
  },

  stepsValue: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
  },

  stepsLabel: {
    color: "#AAB3C5",
    fontSize: 10,
    fontWeight: "700",
  },

  challengeCard: {
    backgroundColor: "rgba(20,16,5,0.95)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  goldLabel: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  challengeText: {
    color: "#AAB3C5",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 8,
  },

  challengeButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },

  challengeButtonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
  },
});