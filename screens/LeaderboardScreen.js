import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  AppState,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getEquippedAvatar } from "../utils/avatarInventoryStorage";
import { getWCoins } from "../utils/wcoinStorage";

const COLLAGE_BG = require("../assets/collage-background.png");

// ============================================================
// SAMPLE LEADERBOARD USERS
// ============================================================

const STATIC_USERS = [
  {
    rank: 1,
    name: "MayaRuns",
    title: "Legend Walker",
    badge: "Legend",
    tracksuit: "Legend Yellow",
    steps: 2450000,
    legathonPoints: 18500,
    wCoins: 25400,
    journeysCompleted: 81,
    passportStamps: 81,
    streak: 420,
    avatar: "🏆",
  },

  {
    rank: 2,
    name: "HistoryHunter",
    title: "Master Explorer",
    badge: "Master Walker",
    tracksuit: "Pathfinder Green",
    steps: 1980000,
    legathonPoints: 16200,
    wCoins: 20300,
    journeysCompleted: 74,
    passportStamps: 74,
    streak: 302,
    avatar: "🔥",
  },

  {
    rank: 3,
    name: "TrailKing",
    title: "Wayfinder",
    badge: "Champion",
    tracksuit: "Trailblazer Red",
    steps: 1525000,
    legathonPoints: 13100,
    wCoins: 17200,
    journeysCompleted: 60,
    passportStamps: 60,
    streak: 188,
    avatar: "🥉",
  },

  {
    rank: 5,
    name: "JourneyQueen",
    title: "Traveler",
    badge: "Explorer",
    tracksuit: "Explorer Blue",
    steps: 990000,
    legathonPoints: 2200,
    wCoins: 5200,
    journeysCompleted: 15,
    passportStamps: 15,
    streak: 17,
    avatar: "⭐",
  },
];

// ============================================================
// SCREEN
// ============================================================

export default function LeaderboardScreen() {
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const [liveUser, setLiveUser] = useState({
    rank: 4,
    name: "Legathon Walker",
    title: "Explorer",
    badge: "Explorer",
    tracksuit: "Explorer Blue",
    steps: 0,
    legathonPoints: 0,
    wCoins: 0,
    journeysCompleted: 0,
    passportStamps: 0,
    streak: 0,
    isUser: true,
  });

  // ============================================================
  // HELPERS
  // ============================================================

  const readNumber = (value, fallback = 0) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return parsed;
  };

  const loadLeaderboardUser = useCallback(async () => {
    try {
      const [
        avatar,
        lifetimeStepsValue,
        completedJourneysValue,
        passportStampsValue,
        streakValue,
        legathonPointsValue,
        displayNameValue,
        rankValue,
        badgeValue,
        tracksuitValue,
      ] = await Promise.all([
        getEquippedAvatar(),

        AsyncStorage.getItem("lifetimeSteps"),

        AsyncStorage.getItem("completedJourneys"),

        AsyncStorage.getItem("passportStamps"),

        AsyncStorage.getItem("walkingStreak"),

        AsyncStorage.getItem("legathonPoints"),

        AsyncStorage.getItem("displayName"),

        AsyncStorage.getItem("legathonRank"),

        AsyncStorage.getItem("equippedBadge"),

        AsyncStorage.getItem("equippedTracksuit"),
      ]);

      let coinBalance = 0;

      try {
        coinBalance = await getWCoins();
      } catch (coinError) {
        console.log(
          "LEADERBOARD WCOIN LOAD ERROR:",
          coinError
        );
      }

      const completedJourneys = readNumber(
        completedJourneysValue,
        0
      );

      setCurrentAvatar(avatar);

      setLiveUser({
        rank: 4,

        name:
          displayNameValue ||
          avatar?.name ||
          "Legathon Walker",

        title:
          rankValue ||
          "Explorer",

        badge:
          badgeValue ||
          rankValue ||
          "Explorer",

        tracksuit:
          tracksuitValue ||
          "Explorer Blue",

        steps: readNumber(
          lifetimeStepsValue,
          0
        ),

        legathonPoints: readNumber(
          legathonPointsValue,
          0
        ),

        wCoins: readNumber(
          coinBalance,
          0
        ),

        journeysCompleted:
          completedJourneys,

        passportStamps: readNumber(
          passportStampsValue,
          completedJourneys
        ),

        streak: readNumber(
          streakValue,
          0
        ),

        isUser: true,
      });
    } catch (error) {
      console.log(
        "LEADERBOARD USER LOAD ERROR:",
        error
      );
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadLeaderboardUser();
  }, [loadLeaderboardUser]);

  // ============================================================
  // REFRESH WHEN APP BECOMES ACTIVE
  // ============================================================

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (nextState === "active") {
          loadLeaderboardUser();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [loadLeaderboardUser]);

  // ============================================================
  // BUILD LEADERBOARD
  // ============================================================

  const leaderboardUsers = [
    STATIC_USERS[0],
    STATIC_USERS[1],
    STATIC_USERS[2],
    liveUser,
    STATIC_USERS[3],
  ];

  const currentRank =
    leaderboardUsers.find(
      (user) => user.isUser
    )?.rank || 4;

  // ============================================================
  // UI
  // ============================================================

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
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Text style={styles.kicker}>
              LEGATHON WALK
            </Text>

            <Text style={styles.title}>
              Leaderboard
            </Text>

            <Text style={styles.subtitle}>
              Compete with walkers, explorers, and legends.
            </Text>

            {/* ================================================= */}
            {/* YOUR RANK */}
            {/* ================================================= */}

            <View style={styles.userHighlightCard}>
              <View style={styles.userAvatarFrame}>
                {currentAvatar?.image ? (
                  <Image
                    source={currentAvatar.image}
                    style={styles.userAvatarImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.userAvatarEmoji}>
                    👤
                  </Text>
                )}
              </View>

              <View style={styles.userHighlightCenter}>
                <Text style={styles.userLabel}>
                  YOUR RANK
                </Text>

                <Text
                  style={styles.userName}
                  numberOfLines={2}
                >
                  {liveUser.name}
                </Text>

               <Text style={styles.userMeta}>
  #{leaderboardUsers.find((u) => u.isUser)?.rank || 4} •{" "}
  {currentAvatar?.displayName ||
    currentAvatar?.title ||
    currentAvatar?.name ||
    "Explorer Blue"}
</Text>
              </View>

              <View style={styles.rankPill}>
                <Text style={styles.rankPillText}>
                  #{currentRank}
                </Text>
              </View>
            </View>

            {/* ================================================= */}
            {/* TOP WALKERS */}
            {/* ================================================= */}

            <View style={styles.podiumCard}>
              <Text style={styles.sectionTitle}>
                Top Walkers
              </Text>

              <View style={styles.podiumRow}>
                <PodiumPlace
                  place={2}
                  name="HistoryHunter"
                  steps="1.98M"
                />

                <PodiumPlace
                  place={1}
                  name="MayaRuns"
                  steps="2.45M"
                  winner
                />

                <PodiumPlace
                  place={3}
                  name="TrailKing"
                  steps="1.52M"
                />
              </View>
            </View>

            {/* ================================================= */}
            {/* WEEKLY RANKINGS */}
            {/* ================================================= */}

            <View style={styles.listCard}>
              <Text style={styles.sectionTitle}>
                Weekly Rankings
              </Text>

              {leaderboardUsers.map((user) => {
                return (
                  <LeaderboardRow
                    key={`${user.rank}-${user.name}`}
                    user={user}
                    currentAvatar={currentAvatar}
                  />
                );
              })}
            </View>

            {/* ================================================= */}
            {/* DAILY CHALLENGE */}
            {/* ================================================= */}

            <View style={styles.challengeCard}>
              <Text style={styles.goldLabel}>
                DAILY CHALLENGE
              </Text>

              <Text style={styles.challengeTitle}>
                Climb 2 spots today
              </Text>

              <Text style={styles.challengeText}>
                Walk 4,500 more steps to pass the next
                explorer and earn bonus W Coins.
              </Text>

              <TouchableOpacity
                style={styles.challengeButton}
                activeOpacity={0.85}
              >
                <Text
                  style={styles.challengeButtonText}
                >
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

// ============================================================
// PODIUM
// ============================================================

function PodiumPlace({
  place,
  name,
  steps,
  winner = false,
}) {
  return (
    <View
      style={[
        styles.podiumPlace,
        winner && styles.podiumWinner,
      ]}
    >
      <View
        style={[
          styles.podiumBadge,
          winner && styles.podiumWinnerBadge,
        ]}
      >
        <Text style={styles.podiumBadgeText}>
          #{place}
        </Text>
      </View>

      <Text
        style={styles.podiumName}
        numberOfLines={2}
      >
        {name}
      </Text>

      <Text style={styles.podiumSteps}>
        {steps} steps
      </Text>
    </View>
  );
}

// ============================================================
// LEADERBOARD ROW
// ============================================================

function LeaderboardRow({
  user,
  currentAvatar,
}) {
  const isUser = user.isUser === true;

  return (
    <View
      style={[
        styles.leaderRow,
        isUser && styles.userLeaderRow,
      ]}
    >
      {/* ===================================================== */}
      {/* LEFT */}
      {/* ===================================================== */}

      <View style={styles.leftColumn}>
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>
            {user.rank}
          </Text>
        </View>

        <View style={styles.rowAvatar}>
          {isUser && currentAvatar?.image ? (
            <Image
              source={currentAvatar.image}
              style={styles.rowAvatarImage}
              resizeMode="contain"
            />
          ) : isUser ? (
            <Text style={styles.userRowFallback}>
              👤
            </Text>
          ) : (
            <Text style={styles.rowAvatarEmoji}>
              {user.avatar || "👟"}
            </Text>
          )}
        </View>
      </View>

      {/* ===================================================== */}
      {/* CENTER */}
      {/* ===================================================== */}

      <View style={styles.middleColumn}>
       <Text
  style={styles.rowName}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {user.name}
</Text>

<Text
  style={styles.rowTitle}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {user.title}
</Text>

<Text
  style={styles.badgeText}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  🏅 {user.badge}
</Text>

<Text
  style={styles.trackSuitText}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  👕 {user.tracksuit}
</Text>

        <View style={styles.statsRow}>
          <Text style={styles.smallStat}>
            🌍 {user.journeysCompleted || 0}
          </Text>

          <Text style={styles.smallStat}>
            📘 {user.passportStamps || 0}
          </Text>
        </View>

        <Text style={styles.smallStat}>
          🔥 {user.streak || 0}
        </Text>
      </View>

      {/* ===================================================== */}
      {/* RIGHT */}
      {/* ===================================================== */}

      <View style={styles.rightColumn}>
        <Text style={styles.stepsValue}>
          {(user.steps || 0).toLocaleString()}
        </Text>

        <Text style={styles.stepsLabel}>
          Steps
        </Text>

        <Text style={styles.pointsText}>
          ⭐{" "}
          {(user.legathonPoints || 0).toLocaleString()}{" "}
          LP
        </Text>

        <Text style={styles.coinText}>
          🪙 {(user.wCoins || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // SCREEN
  // ==========================================================

  background: {
    flex: 1,
    backgroundColor: "#020711",
  },

  backgroundImage: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(1, 6, 15, 0.84)",
  },

  safe: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 44,

    // Keeps final cards clear of fixed bottom navigation.
    paddingBottom: 280,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  kicker: {
    color: "#E2B82F",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 46,
    lineHeight: 50,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#AEB8CC",
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 26,
  },

  // ==========================================================
  // YOUR RANK CARD
  // ==========================================================

  userHighlightCard: {
    minHeight: 142,

    backgroundColor: "#0E192B",

    borderRadius: 28,

    borderWidth: 2,
    borderColor: "#E3B92E",

    paddingHorizontal: 18,
    paddingVertical: 18,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 22,
  },

  userAvatarFrame: {
    width: 82,
    height: 82,

    borderRadius: 41,

    borderWidth: 2,
    borderColor: "#E3B92E",

    backgroundColor: "#020813",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    marginRight: 16,
  },

  userAvatarImage: {
    width: 74,
    height: 74,
  },

  userAvatarEmoji: {
    fontSize: 43,
  },

  userHighlightCenter: {
    flex: 1,
    minWidth: 0,
  },

  userLabel: {
    color: "#E3B92E",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "900",
  },

  userMeta: {
    color: "#ADB6CA",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  rankPill: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: "#E3B92E",

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 8,
  },

  rankPillText: {
    color: "#050913",
    fontSize: 22,
    fontWeight: "900",
  },

  // ==========================================================
  // GENERIC SECTION
  // ==========================================================

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 20,
  },

  // ==========================================================
  // PODIUM
  // ==========================================================

  podiumCard: {
    backgroundColor: "#0E192B",

    borderRadius: 28,

    borderWidth: 1,
    borderColor: "#283C58",

    padding: 18,

    marginBottom: 22,
  },

  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  podiumPlace: {
    width: "29%",
    minHeight: 145,

    backgroundColor: "#020813",

    borderRadius: 22,

    borderWidth: 1,
    borderColor: "#263B59",

    paddingHorizontal: 8,
    paddingVertical: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  podiumWinner: {
    width: "34%",
    minHeight: 165,
    borderColor: "#E3B92E",
  },

  podiumBadge: {
    width: 55,
    height: 55,

    borderRadius: 28,

    backgroundColor: "#263650",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  podiumWinnerBadge: {
    width: 66,
    height: 66,

    borderRadius: 33,

    backgroundColor: "#E3B92E",
  },

  podiumBadgeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  podiumName: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  podiumSteps: {
    color: "#ABB5C9",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
  },

  // ==========================================================
  // WEEKLY RANKINGS CONTAINER
  // ==========================================================

  listCard: {
    backgroundColor: "#0D182A",

    borderRadius: 28,

    borderWidth: 1,
    borderColor: "#263952",

    padding: 18,

    marginBottom: 24,
  },

// ==========================================================
// LEADERBOARD ROW
// ==========================================================

leaderRow: {
  minHeight: 170,
  backgroundColor: "#020914",
  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#243956",

  marginBottom: 14,

  paddingHorizontal: 14,
  paddingVertical: 18,

  flexDirection: "row",
  alignItems: "center",
},

userLeaderRow: {
  borderWidth: 2,
  borderColor: "#E3B92E",
},

// ==========================================================
// LEFT COLUMN
// ==========================================================

leftColumn: {
  width: 62,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
},

rankCircle: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: "#263650",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
},

rankText: {
  color: "#FFFFFF",
  fontSize: 21,
  fontWeight: "900",
},

rowAvatar: {
  width: 52,
  minHeight: 50,
  alignItems: "center",
  justifyContent: "center",
},

rowAvatarEmoji: {
  fontSize: 35,
},

userRowFallback: {
  fontSize: 34,
},

rowAvatarImage: {
  width: 48,
  height: 66,
},

// ==========================================================
// CENTER COLUMN
// ==========================================================

middleColumn: {
  flex: 1,
  minWidth: 0,
  paddingRight: 6,
},

rowName: {
  color: "#FFFFFF",
  fontSize: 19,
  lineHeight: 23,
  fontWeight: "900",
  marginBottom: 3,
},

rowTitle: {
  color: "#AEB7CA",
  fontSize: 15,
  lineHeight: 19,
  fontWeight: "800",
  marginBottom: 3,
},

badgeText: {
  color: "#FFFFFF",
  fontSize: 13,
  lineHeight: 18,
  fontWeight: "800",
  marginBottom: 2,
},

trackSuitText: {
  color: "#FFFFFF",
  fontSize: 13,
  lineHeight: 18,
  fontWeight: "800",
  marginBottom: 6,
},

statsRow: {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
},

smallStat: {
  color: "#E5EBF5",
  fontSize: 13,
  lineHeight: 18,
  fontWeight: "800",
  marginRight: 10,
},

// ==========================================================
// RIGHT COLUMN
// ==========================================================

rightColumn: {
  width: 108,
  alignItems: "flex-end",
  justifyContent: "center",
},

stepsValue: {
  color: "#E3B92E",
  fontSize: 18,
  lineHeight: 22,
  fontWeight: "900",
  textAlign: "right",
},

stepsLabel: {
  color: "#BEC6D7",
  fontSize: 13,
  fontWeight: "800",
  marginBottom: 8,
},

pointsText: {
  color: "#F6C936",
  fontSize: 14,
  lineHeight: 19,
  fontWeight: "900",
  textAlign: "right",
  marginBottom: 4,
},

coinText: {
  color: "#8DE1B0",
  fontSize: 14,
  lineHeight: 19,
  fontWeight: "900",
  textAlign: "right",
},
  // ==========================================================
  // DAILY CHALLENGE
  // ==========================================================

  challengeCard: {
    backgroundColor: "#120E02",

    borderRadius: 28,

    borderWidth: 1.5,
    borderColor: "#DDB32E",

    padding: 22,

    marginBottom: 20,
  },

  goldLabel: {
    color: "#E3B92E",

    fontSize: 14,
    fontWeight: "900",

    letterSpacing: 3,

    marginBottom: 10,
  },

  challengeTitle: {
    color: "#FFFFFF",

    fontSize: 29,
    lineHeight: 34,

    fontWeight: "900",

    marginBottom: 12,
  },

  challengeText: {
    color: "#B7C0D1",

    fontSize: 17,
    lineHeight: 25,

    fontWeight: "700",

    marginBottom: 22,
  },

  challengeButton: {
    minHeight: 60,

    borderRadius: 18,

    backgroundColor: "#E0B932",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 18,
  },

  challengeButtonText: {
    color: "#060B13",

    fontSize: 20,

    fontWeight: "900",
  },
});