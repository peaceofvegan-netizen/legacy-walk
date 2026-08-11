import React from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { translate } from "../i18n/i18n";
const COLLAGE_BG = require("../assets/collage-background.png");

const legends = [
  {
    rank: 1,
    name: "Phillip",
    title: "Master Explorer",
    score: 8450,
    miles: 642,
    steps: "1,245,000",
    badge: "👑",
    verified: true,
  },
  {
    rank: 2,
    name: "Maya",
    title: "Legacy Walker",
    score: 7920,
    miles: 590,
    steps: "1,102,000",
    badge: "🥇",
    verified: true,
  },
  {
    rank: 3,
    name: "Dre",
    title: "Explorer",
    score: 6880,
    miles: 510,
    steps: "960,000",
    badge: "🥈",
    verified: true,
  },
];

const monthlyWinners = [
  { name: "Ava", route: "Great Wall", reward: "500 W Coins" },
  { name: "Jordan", route: "Roman Empire", reward: "Gold Medal" },
  { name: "Chris", route: "Selma Freedom Walk", reward: "Legacy Badge" },
];

const journeyChampions = [
  { route: "Selma to Montgomery", champion: "Phillip", progress: "100%" },
  { route: "Great Wall Trek", champion: "Maya", progress: "100%" },
  { route: "Roman Empire", champion: "Dre", progress: "92%" },
  { route: "Tokyo Nights", champion: "Ava", progress: "88%" },
];

const stateRankings = [
  { state: "California", walkers: "12,450", leader: "Phillip" },
  { state: "Nevada", walkers: "8,210", leader: "Maya" },
  { state: "Texas", walkers: "7,880", leader: "Dre" },
];

export default function HallOfLegendsScreen({
 language = "en",
  goBack,
}) {
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
            {goBack && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.kicker}>HALL OF LEGENDS</Text>
            <Text style={styles.title}>Top Legathon Walkers</Text>

            <Text style={styles.subtitle}>
              Verified walkers ranked by steps, miles, journey completion,
              passport stamps, streaks, and Legathon Score.
            </Text>

            <View style={styles.championCard}>
              <Text style={styles.championCrown}>👑</Text>
              <Text style={styles.championLabel}>CURRENT LEGEND</Text>
              <Text style={styles.championName}>{legends[0].name}</Text>
              <Text style={styles.championTitle}>{legends[0].title}</Text>

              <View style={styles.championStats}>
                <View style={styles.championStat}>
                  <Text style={styles.championNumber}>
                    {legends[0].score.toLocaleString()}
                  </Text>
                  <Text style={styles.championStatLabel}>Legathon Score</Text>
                </View>

                <View style={styles.championStat}>
                  <Text style={styles.championNumber}>{legends[0].miles}</Text>
                  <Text style={styles.championStatLabel}>Miles</Text>
                </View>
              </View>
            </View>

            <View style={styles.podiumRow}>
              {legends.map((legend) => (
                <View
                  key={legend.rank}
                  style={[
                    styles.podiumCard,
                    legend.rank === 1 && styles.podiumCardGold,
                  ]}
                >
                  <Text style={styles.podiumBadge}>{legend.badge}</Text>
                  <Text style={styles.podiumRank}>#{legend.rank}</Text>
                  <Text style={styles.podiumName}>{legend.name}</Text>
                  <Text style={styles.podiumTitle}>{legend.title}</Text>
                  <Text style={styles.podiumScore}>
                    {legend.score.toLocaleString()} LP
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Lifetime Rankings</Text>

              {legends.map((legend) => (
                <View key={legend.rank} style={styles.legendRow}>
                  <Text style={styles.legendRank}>#{legend.rank}</Text>

                  <View style={styles.legendInfo}>
                    <View style={styles.legendNameRow}>
                      <Text style={styles.legendName}>{legend.name}</Text>
                      {legend.verified && (
                        <Text style={styles.verified}>Verified Walk</Text>
                      )}
                    </View>

                    <Text style={styles.legendSub}>
                      {legend.steps} steps • {legend.miles} miles
                    </Text>
                  </View>

                  <Text style={styles.legendScore}>
                    {legend.score.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.goldCard}>
              <Text style={styles.goldLabel}>JOURNEY CHAMPIONS</Text>
              <Text style={styles.sectionTitle}>Route Leaders</Text>

              {journeyChampions.map((item) => (
                <View key={item.route} style={styles.championRow}>
                  <Text style={styles.routeIcon}>🏁</Text>

                  <View style={styles.routeInfo}>
                    <Text style={styles.routeTitle}>{item.route}</Text>
                    <Text style={styles.routeSub}>Champion: {item.champion}</Text>
                  </View>

                  <Text style={styles.routeProgress}>{item.progress}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Monthly Winners</Text>

              {monthlyWinners.map((winner) => (
                <View key={winner.name} style={styles.winnerRow}>
                  <Text style={styles.winnerIcon}>🏆</Text>

                  <View style={styles.winnerInfo}>
                    <Text style={styles.winnerName}>{winner.name}</Text>
                    <Text style={styles.winnerRoute}>{winner.route}</Text>
                  </View>

                  <Text style={styles.winnerReward}>{winner.reward}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>State Rankings</Text>

              {stateRankings.map((state) => (
                <View key={state.state} style={styles.stateRow}>
                  <View>
                    <Text style={styles.stateName}>{state.state}</Text>
                    <Text style={styles.stateSub}>
                      {state.walkers} verified walkers
                    </Text>
                  </View>

                  <Text style={styles.stateLeader}>{state.leader}</Text>
                </View>
              ))}
            </View>

            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>LEGEND REWARDS</Text>
              <Text style={styles.rewardTitle}>Monthly Champion Prize</Text>

              <Text style={styles.rewardText}>
                Top ranked verified walkers earn bonus W Coins, medals, passport
                frames, exclusive journey access, and Hall of Legends placement.
              </Text>

              <View style={styles.rewardGrid}>
                <Reward icon="🪙" text="W Coins" />
                <Reward icon="🏅" text="Medals" />
                <Reward icon="🛂" text="Passport Frame" />
                <Reward icon="🌍" text="Exclusive Route" />
              </View>
            </View>

            <View style={styles.fairPlayCard}>
              <Text style={styles.fairPlayTitle}>Fair Play Verified</Text>
              <Text style={styles.fairPlayText}>
                Rankings are based on verified walking sessions, journey
                progress, GPS checks, streaks, and activity consistency.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function Reward({ icon, text }) {
  return (
    <View style={styles.rewardItem}>
      <Text style={styles.rewardIcon}>{icon}</Text>
      <Text style={styles.rewardItemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.45,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,4,10,0.78)",
  },

  safe: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 160,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(8,18,37,0.88)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.45)",
    marginBottom: 24,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 19,
    fontWeight: "900",
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
    marginBottom: 16,
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 26,
  },

  championCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(212,175,55,0.55)",
    marginBottom: 24,
  },

  championCrown: {
    fontSize: 54,
    marginBottom: 8,
  },

  championLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  championName: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },

  championTitle: {
    color: "#A7F3D0",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  championStats: {
    flexDirection: "row",
    gap: 14,
    marginTop: 22,
  },

  championStat: {
    minWidth: 130,
    backgroundColor: "rgba(2,6,23,0.78)",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.28)",
  },

  championNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  championStatLabel: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },

  podiumRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  podiumCard: {
    flex: 1,
    minHeight: 170,
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 26,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
  },

  podiumCardGold: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.12)",
  },

  podiumBadge: {
    fontSize: 32,
    marginBottom: 8,
  },

  podiumRank: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },

  podiumName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },

  podiumTitle: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },

  podiumScore: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 6,
  },

  sectionCard: {
    backgroundColor: "rgba(8,18,37,0.94)",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    marginBottom: 12,
  },

  legendRank: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "900",
    width: 54,
  },

  legendInfo: {
    flex: 1,
  },

  legendNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  legendName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  verified: {
    color: "#020617",
    backgroundColor: "#A7F3D0",
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: "900",
  },

  legendSub: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 5,
  },

  legendScore: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
  },

  goldCard: {
    backgroundColor: "rgba(212,175,55,0.1)",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.38)",
    marginBottom: 24,
  },

  goldLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  championRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.72)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  routeIcon: {
    fontSize: 30,
    width: 46,
  },

  routeInfo: {
    flex: 1,
  },

  routeTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  routeSub: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },

  routeProgress: {
    color: "#D4AF37",
    fontSize: 17,
    fontWeight: "900",
  },

  winnerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  winnerIcon: {
    fontSize: 30,
    width: 46,
  },

  winnerInfo: {
    flex: 1,
  },

  winnerName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  winnerRoute: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },

  winnerReward: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
    maxWidth: 105,
  },

  stateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  stateName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  stateSub: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },

  stateLeader: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
  },

  rewardCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 24,
  },

  rewardLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },

  rewardText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 14,
  },

  rewardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },

  rewardItem: {
    width: "47.8%",
    backgroundColor: "rgba(2,6,23,0.72)",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },

  rewardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  rewardItemText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  fairPlayCard: {
    backgroundColor: "rgba(167,243,208,0.1)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.35)",
    marginBottom: 40,
  },

  fairPlayTitle: {
    color: "#A7F3D0",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },

  fairPlayText: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 26,
  },
});