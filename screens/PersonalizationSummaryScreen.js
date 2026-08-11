// PersonalizationSummaryScreen.js

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREF_KEY = "journeyPreferences";

const CATEGORY_LABELS = {
  civil_rights: "✊ Civil Rights & Freedom Movements",
  african_history: "🌍 African & African Diaspora History",
  world_wonders: "🌎 World Wonders",
  ancient_civilizations: "🏛 Ancient Civilizations",
  nature: "🌳 Nature & Adventure",
  cities: "🏙 Cities & Culture",
  faith: "🙏 Faith & Spiritual Journeys",
  arts: "🎭 Arts & Literature",
  wellness: "❤️ Health & Wellness",
  fitness: "🏃 Fitness & Endurance",
  marathon: "🏅 Marathon Challenges",
};

const GOAL_LABELS = {
  weight_loss: "Lose Weight",
  heart_health: "Improve Heart Health",
  stress: "Reduce Stress",
  activity: "Stay Active",
  endurance: "Build Endurance",
  history: "Learn History",
  culture: "Explore New Cultures",
  competition: "Compete With Friends",
  mental_wellness: "Improve Mental Wellness",
};

const DIFFICULTY_LABELS = {
  beginner: "🔵 Beginner — Explorer Collection",
  moderate: "🔴 Moderate — Trailblazer Collection",
  advanced: "🟢 Advanced — Pathfinder Collection",
  legendary: "🟡 Legendary — Longevity Collection",
  elite: "⚫ Elite — Black & Gold Elite Collection",
};

const LENGTH_LABELS = {
  "7_days": "⚡ Quick Challenges",
  "30_days": "🚶 Standard Journeys",
  "60_90_days": "🌎 Long Expeditions",
  lifetime: "🏆 Legendary Lifetime Journeys",
};

export default function PersonalizationSummaryScreen({
  startLegacy,
  editPreferences,
}) {
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(PREF_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Summary load error:", error);
    }
  };

  const handleStartLegacy = async () => {
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");

    if (startLegacy) {
      startLegacy();
    }
  };

  const interests = preferences?.interests || [];
  const goals = preferences?.goals || [];
  const hiddenCategories = preferences?.hiddenCategories || [];
  const difficulty = preferences?.difficulty || "moderate";
  const preferredLength = preferences?.preferredLength || "30_days";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.small}>YOUR LEGACY PROFILE</Text>
      <Text style={styles.title}>Personalized For You</Text>

      <Text style={styles.subtitle}>
        Legacy Walk will recommend journeys based on your interests, goals, and
        challenge level.
      </Text>

      <View style={styles.cardGold}>
        <Text style={styles.goldTitle}>Challenge Level</Text>
        <Text style={styles.goldValue}>
          {DIFFICULTY_LABELS[difficulty]}
        </Text>
        <Text style={styles.goldSub}>
          {LENGTH_LABELS[preferredLength]}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What Inspires You</Text>

        {interests.length === 0 ? (
          <Text style={styles.emptyText}>No interests selected.</Text>
        ) : (
          interests.map((item) => (
            <Text key={item} style={styles.itemText}>
              {CATEGORY_LABELS[item] || item}
            </Text>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Goals</Text>

        {goals.length === 0 ? (
          <Text style={styles.emptyText}>No goals selected.</Text>
        ) : (
          goals.map((item) => (
            <Text key={item} style={styles.itemText}>
              {GOAL_LABELS[item] || item}
            </Text>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hidden From Recommendations</Text>

        {hiddenCategories.length === 0 ? (
          <Text style={styles.emptyText}>No hidden categories.</Text>
        ) : (
          hiddenCategories.map((item) => (
            <Text key={item} style={styles.itemText}>
              {CATEGORY_LABELS[item] || item}
            </Text>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleStartLegacy}>
        <Text style={styles.continueText}>Start My Legacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={editPreferences}>
        <Text style={styles.editText}>Edit Preferences</Text>
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 18,
    paddingBottom: 160,
  },

  small: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 5,
    marginTop: 18,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 50,
    marginBottom: 14,
  },

  subtitle: {
    color: "#AAB7CA",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#111318",
    borderColor: "#1F2A3D",
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },

  cardGold: {
    backgroundColor: "#10100A",
    borderColor: "#D8A72E",
    borderWidth: 1.5,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  goldTitle: {
    color: "#D8A72E",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },

  goldValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 28,
  },

  goldSub: {
    color: "#D8A72E",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },

  itemText: {
    color: "#DDE6F3",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 8,
  },

  emptyText: {
    color: "#8FA1B8",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },

  continueButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 14,
  },

  continueText: {
    color: "#05070C",
    fontSize: 18,
    fontWeight: "900",
  },

  editButton: {
    backgroundColor: "#0B1628",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },

  editText: {
    color: "#DDE6F3",
    fontSize: 17,
    fontWeight: "900",
  },
});