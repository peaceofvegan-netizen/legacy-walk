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

const completedChallenges = [
  { day: "Mon", steps: "5,240", reward: "+50 XP" },
  { day: "Tue", steps: "6,100", reward: "+60 XP" },
  { day: "Wed", steps: "7,850", reward: "+75 XP" },
];

export default function DailyChallengeScreen({ 
language = "en",
goBack,
}) {
  


  const goalSteps = 5000;
  const currentSteps = 3600;
  const progress = Math.min(Math.round((currentSteps / goalSteps) * 100), 100);
  const stepsRemaining = goalSteps - currentSteps;

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

            <Text style={styles.kicker}>DAILY CHALLENGE</Text>
            <Text style={styles.title}>Keep Your Legacy Streak Alive</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>TODAY’S GOAL</Text>
              <Text style={styles.heroNumber}>{currentSteps.toLocaleString()}</Text>
              <Text style={styles.heroSub}>
                of {goalSteps.toLocaleString()} steps completed
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <Text style={styles.progressText}>{progress}% Complete</Text>
              <Text style={styles.remainingText}>
                {stepsRemaining.toLocaleString()} steps remaining
              </Text>
            </View>

            <View style={styles.streakCard}>
              <Text style={styles.streakLabel}>CURRENT STREAK</Text>
              <Text style={styles.streakNumber}>7 Days</Text>
              <Text style={styles.streakText}>
                Walk every day to build your Legacy streak and unlock bonus rewards.
              </Text>

              <View style={styles.streakDots}>
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <View
                    key={`${day}-${index}`}
                    style={[
                      styles.dayDot,
                      index < 5 ? styles.dayDotComplete : styles.dayDotLocked,
                    ]}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>TODAY’S REWARD</Text>
              <Text style={styles.rewardTitle}>+50 XP • +25 W Coins</Text>
              <Text style={styles.rewardText}>
                Complete today’s challenge to earn XP, W Coins, streak protection,
                and passport progress.
              </Text>

              <TouchableOpacity
                style={[
                  styles.claimButton,
                  progress < 100 && styles.claimButtonDisabled,
                ]}
              >
                <Text style={styles.claimButtonText}>
                  {progress >= 100 ? "Claim Reward" : "Keep Walking"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weeklyCard}>
              <Text style={styles.weeklyLabel}>WEEKLY CHALLENGE</Text>
              <Text style={styles.weeklyTitle}>Walk 35,000 Steps</Text>
              <Text style={styles.weeklyText}>
                Complete the weekly challenge to unlock the Endurance Medal and
                bonus W Coins.
              </Text>

              <View style={styles.weeklyProgress}>
                <View style={[styles.weeklyFill, { width: "62%" }]} />
              </View>

              <Text style={styles.weeklySmall}>21,700 / 35,000 steps</Text>
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.sectionTitle}>Completed This Week</Text>

              {completedChallenges.map((item) => (
                <View key={item.day} style={styles.historyRow}>
                  <Text style={styles.historyDay}>{item.day}</Text>

                  <View style={styles.historyInfo}>
                    <Text style={styles.historySteps}>{item.steps} steps</Text>
                    <Text style={styles.historyReward}>{item.reward}</Text>
                  </View>

                  <Text style={styles.historyCheck}>✓</Text>
                </View>
              ))}
            </View>

            <View style={styles.bonusCard}>
              <Text style={styles.bonusLabel}>BONUS UNLOCK</Text>
              <Text style={styles.bonusTitle}>10-Day Streak Reward</Text>
              <Text style={styles.bonusText}>
                Reach a 10-day streak to unlock a premium passport frame,
                +250 XP, and +100 W Coins.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#020617" },
  backgroundImage: { resizeMode: "cover", opacity: 0.45 },
  overlay: { flex: 1, backgroundColor: "rgba(2,4,10,0.78)" },
  safe: { flex: 1 },
  content: { padding: 22, paddingBottom: 160 },

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
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 50,
    fontWeight: "900",
    lineHeight: 56,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.3)",
    marginBottom: 24,
  },
  heroLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  heroNumber: {
    color: "#FFFFFF",
    fontSize: 62,
    fontWeight: "900",
  },
  heroSub: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
  },
  progressBar: {
    height: 14,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 22,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#A7F3D0",
  },
  progressText: {
    color: "#A7F3D0",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 16,
  },
  remainingText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  streakCard: {
    backgroundColor: "rgba(212,175,55,0.1)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.4)",
    marginBottom: 24,
  },
  streakLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  streakNumber: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
  },
  streakText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 10,
  },
  streakDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  dayDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dayDotComplete: {
    backgroundColor: "#D4AF37",
    borderColor: "#F8F2E7",
  },
  dayDotLocked: {
    backgroundColor: "#111827",
    borderColor: "#374151",
  },
  dayText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: "900",
  },

  rewardCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.25)",
    marginBottom: 24,
  },
  rewardLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  rewardText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 14,
  },
  claimButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 22,
  },
  claimButtonDisabled: {
    backgroundColor: "#374151",
  },
  claimButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
  },

  weeklyCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
    marginBottom: 24,
  },
  weeklyLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  weeklyTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  weeklyText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  weeklyProgress: {
    height: 12,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 20,
  },
  weeklyFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
  },
  weeklySmall: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },

  historyCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
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
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  historyDay: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    width: 52,
  },
  historyInfo: {
    flex: 1,
  },
  historySteps: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  historyReward: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  historyCheck: {
    color: "#A7F3D0",
    fontSize: 24,
    fontWeight: "900",
  },

  bonusCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 40,
  },
  bonusLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  bonusTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  bonusText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 14,
  },
});