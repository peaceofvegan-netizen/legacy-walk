import { getBreathingChallenges } from "../utils/breathingChallenges";
import { getBreathingAchievements }
from "../utils/breathingAchievements";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  loadBreathingAnalytics,
  resetBreathingAnalytics,
} from "../utils/breathingAnalyticsStorage";

export default function BreathingAnalyticsScreen({ goBack }) {
  const [analytics, setAnalytics] = useState({
    sessionsCompleted: 0,
    minutesBreathed: 0,
    coinsEarned: 0,
    weeklyStreak: 0,
    bestSession: null,
    history: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await loadBreathingAnalytics();
    setAnalytics(data);
  }

  async function handleReset() {
    const reset = await resetBreathingAnalytics();
    setAnalytics(reset);
  }
  const challenges = getBreathingChallenges(analytics);
const achievements = getBreathingAchievements({
  totalSessions: analytics.sessionsCompleted,
  totalMinutes: analytics.minutesBreathed,
  streak: analytics.weeklyStreak,
});
  const breathingScore = Math.min(
    Math.round(
      analytics.sessionsCompleted * 5 +
        analytics.minutesBreathed * 0.5 +
        analytics.weeklyStreak * 10
    ),
    100
  );

  const breathingLevel = Math.floor(analytics.sessionsCompleted / 5) + 1;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {goBack && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.kicker}>BREATHING ANALYTICS</Text>
        <Text style={styles.title}>Your Calm Progress</Text>
        <Text style={styles.subtitle}>
          Track completed sessions, breathing minutes, rewards, streaks, and calm mastery.
        </Text>

        <View style={styles.grid}>
          <StatCard label="Sessions" value={analytics.sessionsCompleted} sub="completed" />
          <StatCard label="Minutes" value={analytics.minutesBreathed} sub="breathed" />
          <StatCard label="W Coins" value={analytics.coinsEarned} sub="earned" />
          <StatCard label="Streak" value={analytics.weeklyStreak} sub="weekly" />
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Breathing Score</Text>
            <Text style={styles.scorePercent}>{breathingScore}%</Text>
          </View>

          <View style={styles.scoreTrack}>
            <View style={[styles.scoreFill, { width: `${breathingScore}%` }]} />
          </View>

          <Text style={styles.scoreSubtitle}>
            Overall breathing wellness score
          </Text>
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>BREATHING LEVEL</Text>
          <Text style={styles.levelTitle}>Calm Master Lv.{breathingLevel}</Text>
          <Text style={styles.levelMeta}>
            {analytics.sessionsCompleted} sessions completed
          </Text>
        </View>

        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Current Streak</Text>
          <Text style={styles.streakNumber}>{analytics.weeklyStreak}</Text>
          <Text style={styles.streakLabel}>Consecutive Sessions</Text>
        </View>

        <View style={styles.bestCard}>
          <Text style={styles.sectionTitle}>Best Session</Text>

          {analytics.bestSession ? (
            <>
              <Text style={styles.bestTitle}>{analytics.bestSession.title}</Text>
              <Text style={styles.bestMeta}>
                {analytics.bestSession.minutes} min • +{analytics.bestSession.reward} W Coins
              </Text>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Complete a breathing session to unlock your best session.
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>

        <View style={styles.badgeGrid}>
          <Badge
            unlocked={analytics.sessionsCompleted >= 1}
            icon="🌱"
            title="First Breath"
          />
          <Badge
            unlocked={analytics.sessionsCompleted >= 10}
            icon="🧘"
            title="Mindful Walker"
          />
          <Badge
            unlocked={analytics.sessionsCompleted >= 25}
            icon="🔥"
            title="Streak Builder"
          />
          <Badge
            unlocked={analytics.sessionsCompleted >= 50}
            icon="👑"
            title="Calm Master"
          />
        </View>

        <Text style={styles.sectionTitle}>Recent History</Text>

        {(analytics.history || []).length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No breathing sessions recorded yet.
            </Text>
          </View>
        ) : (
          analytics.history.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyMeta}>
                  {item.minutes} min • {item.pattern}
                </Text>
              </View>

              <Text style={styles.historyCoins}>+{item.reward}</Text>
            </View>
          ))
        )}

<Text style={styles.sectionTitle}>Daily Challenges</Text>

{challenges.map((item) => (
  <View key={item.id} style={styles.challengeCard}>
    <Text style={styles.challengeTitle}>{item.title}</Text>
    <Text style={styles.challengeGoal}>{item.goal}</Text>
    <Text style={styles.challengeProgress}>
      {item.progress}/{item.target}
    </Text>
    <Text style={styles.challengeReward}>
      +{item.reward} W Coins
    </Text>
  </View>
))}



        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset Analytics</Text>
        </TouchableOpacity>

        <View style={{ height: 170 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function Badge({ icon, title, unlocked }) {
  return (
    <View style={[styles.badgeCard, !unlocked && styles.badgeLocked]}>
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={styles.badgeTitle}>{title}</Text>
      <Text style={styles.badgeStatus}>
        {unlocked ? "Unlocked" : "Locked"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },



badgesCard: {
  marginTop: 20,
  backgroundColor: "#07162F",
  borderRadius: 30,
  padding: 20,
},

badgesTitle: {
  color: "#FFFFFF",
  fontSize: 28,
  fontWeight: "900",
  marginBottom: 20,
},

badgesGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

badge: {
  width: "48%",
  backgroundColor: "#0F2348",
  borderRadius: 20,
  padding: 18,
  marginBottom: 12,
  alignItems: "center",
},

badgeLocked: {
  opacity: 0.35,
},

badgeIcon: {
  fontSize: 36,
  marginBottom: 10,
},

badgeText: {
  color: "#FFFFFF",
  fontWeight: "800",
  textAlign: "center",
},

challengeCard: {
  backgroundColor: "#0D1626",
  borderWidth: 1,
  borderColor: "#263A5A",
  borderRadius: 24,
  padding: 18,
  marginBottom: 14,
},

challengeTitle: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "900",
},

challengeGoal: {
  color: "#B8C0D4",
  fontSize: 15,
  fontWeight: "800",
  marginTop: 6,
},

challengeProgress: {
  color: "#A7FFD0",
  fontSize: 18,
  fontWeight: "900",
  marginTop: 10,
},

challengeReward: {
  color: "#D4AF37",
  fontSize: 16,
  fontWeight: "900",
  marginTop: 6,
},

  content: {
    padding: 20,
    paddingTop: 90,
    paddingBottom: 190,
  },

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 26,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7FFD0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    color: "#B8C0D4",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 26,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    minHeight: 135,
    justifyContent: "center",
  },

  statLabel: {
    color: "#B8C0D4",
    fontSize: 17,
    fontWeight: "900",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 10,
  },

  statSub: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },

  scoreCard: {
    backgroundColor: "#0D1626",
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#263A5A",
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  scoreTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  scorePercent: {
    color: "#A7FFD0",
    fontSize: 24,
    fontWeight: "900",
  },

  scoreTrack: {
    height: 16,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#1C2740",
  },

  scoreFill: {
    height: "100%",
    backgroundColor: "#A7FFD0",
  },

  scoreSubtitle: {
    color: "#B8C0D4",
    marginTop: 12,
    fontWeight: "800",
  },

  levelCard: {
    backgroundColor: "#0D1626",
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  levelLabel: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 2,
  },

  levelTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },

  levelMeta: {
    color: "#B8C0D4",
    marginTop: 6,
    fontWeight: "800",
  },

  streakCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderColor: "#D4AF37",
    borderWidth: 1,
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  streakTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  streakNumber: {
    color: "#D4AF37",
    fontSize: 60,
    fontWeight: "900",
  },

  streakLabel: {
    color: "#B8C0D4",
    fontWeight: "800",
  },

  bestCard: {
    backgroundColor: "rgba(167,255,208,0.10)",
    borderColor: "#A7FFD0",
    borderWidth: 1,
    borderRadius: 26,
    padding: 22,
    marginBottom: 26,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 14,
  },

  bestTitle: {
    color: "#A7FFD0",
    fontSize: 25,
    fontWeight: "900",
  },

  bestMeta: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },

  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  badgeCard: {
    width: "48%",
    backgroundColor: "#0D1626",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#263A5A",
  },

  badgeLocked: {
    opacity: 0.35,
  },

  badgeIcon: {
    fontSize: 34,
  },

  badgeTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },

  badgeStatus: {
    color: "#D4AF37",
    fontWeight: "900",
    marginTop: 6,
    fontSize: 12,
  },

  emptyCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },

  emptyText: {
    color: "#B8C0D4",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },

  historyCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  historyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  historyMeta: {
    color: "#B8C0D4",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 5,
    maxWidth: 250,
  },

  historyCoins: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },

  resetButton: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
  },

  resetText: {
    color: "#FF6B6B",
    fontSize: 18,
    fontWeight: "900",
  },
});