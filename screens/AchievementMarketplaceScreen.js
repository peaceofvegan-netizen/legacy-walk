import React, { useState } from "react";
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
const LEGACY_BG = require("../assets/collage-background.png");

const achievements = [
  { id: 1, icon: "👟", title: "First Steps", category: "Steps", progress: 100, rarity: "Common", unlocked: true },
  { id: 2, icon: "🔥", title: "7 Day Streak", category: "Streak", progress: 100, rarity: "Rare", unlocked: true },
  { id: 3, icon: "🛂", title: "Passport Collector", category: "Passport", progress: 70, rarity: "Epic", unlocked: false },
  { id: 4, icon: "🏆", title: "Route Finisher", category: "Journey", progress: 100, rarity: "Rare", unlocked: true },
  { id: 5, icon: "🌍", title: "World Explorer", category: "Journey", progress: 45, rarity: "Legendary", unlocked: false },
  { id: 6, icon: "🪙", title: "W Coin Earner", category: "Rewards", progress: 80, rarity: "Epic", unlocked: false },
];

export default function AchievementScreen({ 
  language = "en",
  goBack,
 }) {
  const [filter, setFilter] = useState("All");

  const filters = [
  translate(language, "all"),
  translate(language, "steps"),
  translate(language, "streak"),
  translate(language, "journey"),
  translate(language, "passport"),
  translate(language, "rewards"),
];

  const filteredAchievements =
    filter === "All"
      ? achievements
      : achievements.filter((item) => item.category === filter);

  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <ImageBackground
      source={LEGACY_BG}
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

            <Text style={styles.kicker}>
             {translate(language, "achievementWall")}
            </Text>
            <Text style={styles.title}>
              {translate(language, "legacyBadges")}
             </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>
               {translate(language, "badgesUnlocked")}
             </Text>
              <Text style={styles.heroNumber}>
                {unlockedCount}/{achievements.length}
              </Text>
              <Text style={styles.heroText}>
                Complete routes, protect streaks, earn stamps, and build your
                Legacy achievement wall.
              </Text>
            </View>

            <View style={styles.filterRow}>
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                    onPress={() => setFilter(item)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.grid}>
              {filteredAchievements.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.achievementCard,
                    item.unlocked
                      ? styles.achievementUnlocked
                      : styles.achievementLocked,
                  ]}
                >
                  <View style={styles.rarityBadge}>
                    <Text style={styles.rarityText}>{item.rarity}</Text>
                  </View>

                  <Text style={styles.achievementIcon}>
                    {item.unlocked ? item.icon : "🔒"}
                  </Text>

                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementCategory}>{item.category}</Text>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${item.progress}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.progressText}>
                    {item.progress}% Complete
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.legendaryCard}>
              <Text style={styles.legendaryLabel}>LEGENDARY REWARD</Text>
              <Text style={styles.legendaryTitle}>Legacy Legend Medal</Text>
              <Text style={styles.legendaryText}>
                Unlock every badge category to earn the rarest medal in Legacy
                Walk.
              </Text>

              <View style={styles.legendaryProgress}>
                <View style={styles.legendaryFill} />
              </View>

              <Text style={styles.legendarySmall}>3 of 6 categories complete</Text>
            </View>

            <View style={styles.milestoneCard}>
              <Text style={styles.sectionTitle}>Next Milestones</Text>

              <Milestone icon="👟" title="100,000 Steps" progress="82%" />
              <Milestone icon="🔥" title="10 Day Streak" progress="70%" />
              <Milestone icon="🛂" title="5 Passport Stamps" progress="60%" />
              <Milestone icon="🏆" title="Complete 3 Journeys" progress="45%" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function Milestone({ icon, title, progress }) {
  return (
    <View style={styles.milestoneRow}>
      <Text style={styles.milestoneIcon}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.milestoneTitle}>{title}</Text>

        <View style={styles.milestoneBar}>
          <View style={[styles.milestoneFill, { width: progress }]} />
        </View>
      </View>

      <Text style={styles.milestoneProgress}>{progress}</Text>
    </View>
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
  backText: { color: "#D4AF37", fontSize: 19, fontWeight: "900" },

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
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 24,
  },
  heroLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  heroNumber: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 10,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  filterPill: {
    backgroundColor: "rgba(8,18,37,0.86)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.22)",
  },
  filterPillActive: {
    backgroundColor: "#D4AF37",
    borderColor: "#D4AF37",
  },
  filterText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "900",
  },
  filterTextActive: {
    color: "#020617",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 24,
  },
  achievementCard: {
    width: "47.8%",
    minHeight: 245,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    position: "relative",
  },
  achievementUnlocked: {
    backgroundColor: "rgba(212,175,55,0.13)",
    borderColor: "rgba(212,175,55,0.42)",
  },
  achievementLocked: {
    backgroundColor: "rgba(8,18,37,0.92)",
    borderColor: "rgba(148,163,184,0.2)",
    opacity: 0.72,
  },
  rarityBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(2,6,23,0.8)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.28)",
  },
  rarityText: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "900",
  },
  achievementIcon: {
    fontSize: 42,
    marginBottom: 14,
  },
  achievementTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 24,
  },
  achievementCategory: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },
  progressBar: {
    height: 9,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 18,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
  },
  progressText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },

  legendaryCard: {
    backgroundColor: "rgba(167,243,208,0.1)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.35)",
    marginBottom: 24,
  },
  legendaryLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  legendaryTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  legendaryText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  legendaryProgress: {
    height: 12,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 20,
  },
  legendaryFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#A7F3D0",
  },
  legendarySmall: {
    color: "#A7F3D0",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
  },

  milestoneCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 40,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  milestoneIcon: {
    fontSize: 30,
    width: 48,
  },
  milestoneTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  milestoneBar: {
    height: 8,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
  },
  milestoneFill: {
    height: "100%",
    backgroundColor: "#A7F3D0",
  },
  milestoneProgress: {
    color: "#A7F3D0",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 12,
  },
});