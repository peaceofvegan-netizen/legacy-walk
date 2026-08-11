import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREF_KEY = "journeyPreferences";

const INTERESTS = [
  { id: "civil_rights", label: "✊ Civil Rights & Freedom Movements" },
  { id: "african_history", label: "🌍 African & African Diaspora History" },
  { id: "world_wonders", label: "🌎 World Wonders" },
  { id: "ancient_civilizations", label: "🏛 Ancient Civilizations" },
  { id: "nature", label: "🌳 Nature & Adventure" },
  { id: "cities", label: "🏙 Cities & Culture" },
  { id: "faith", label: "🙏 Faith & Spiritual Journeys" },
  { id: "arts", label: "🎭 Arts & Literature" },
  { id: "wellness", label: "❤️ Health & Wellness" },
  { id: "fitness", label: "🏃 Fitness & Endurance" },
  { id: "marathon", label: "🏅 Marathon Challenges" },
];

const GOALS = [
  { id: "weight_loss", label: "Lose Weight" },
  { id: "heart_health", label: "Improve Heart Health" },
  { id: "stress", label: "Reduce Stress" },
  { id: "activity", label: "Stay Active" },
  { id: "endurance", label: "Build Endurance" },
  { id: "history", label: "Learn History" },
  { id: "culture", label: "Explore New Cultures" },
  { id: "competition", label: "Compete With Friends" },
  { id: "mental_wellness", label: "Improve Mental Wellness" },
];

const DIFFICULTY = [
  {
    id: "beginner",
    label: "🔵 Beginner",
    subtitle: "Explorer Collection",
    suit: "Blue Explorer",
    description: "Perfect for members beginning their Legathon journey.",
  },
  {
    id: "moderate",
    label: "🔴 Moderate",
    subtitle: "Trailblazer Collection",
    suit: "Red Trailblazer",
    description: "For members ready to challenge themselves.",
  },
  {
    id: "advanced",
    label: "🟢 Advanced",
    subtitle: "Pathfinder Collection",
    suit: "Green Pathfinder",
    description: "Designed for experienced walkers pursuing bigger goals.",
  },
  {
    id: "legendary",
    label: "🟡 Legendary",
    subtitle: "Longevity Collection",
    suit: "Gold Longevity",
    description: "For members committed to building a lasting legacy.",
  },
  {
    id: "elite",
    label: "⚫ Elite",
    subtitle: "Elite Collection",
    suit: "Black & Gold Elite",
    description: "The highest level of Legathon Walk achievement.",
  },
];

const LENGTHS = [
  { id: "7_days", label: "⚡ Quick Challenges (7 Days)" },
  { id: "30_days", label: "🚶 Standard Journeys (30 Days)" },
  { id: "60_90_days", label: "🌎 Long Expeditions (60–90 Days)" },
  { id: "lifetime", label: "🏆 Legendary Lifetime Journeys" },
];

const HIDE_CATEGORIES = [
  { id: "faith", label: "Faith & Spiritual" },
  { id: "civil_rights", label: "Civil Rights & Freedom Movements" },
  { id: "african_history", label: "African & African Diaspora History" },
  { id: "cause_based", label: "Cause-Based Walks" },
  { id: "marathon", label: "Marathon Challenges" },
];


export default function JourneyPreferencesScreen({
  navigation,
  route,
  goBack,
  goToJourneys,
}) {
  const [interests, setInterests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [difficulty, setDifficulty] = useState("moderate");
  const [preferredLength, setPreferredLength] = useState("30_days");
  const [hiddenCategories, setHiddenCategories] = useState([]);

  const fromOnboarding = route?.params?.fromOnboarding === true;

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(PREF_KEY);
      if (!saved) return;

      const prefs = JSON.parse(saved);

      setInterests(prefs.interests || []);
      setGoals(prefs.goals || []);
      setDifficulty(prefs.difficulty || "moderate");
      setPreferredLength(prefs.preferredLength || "30_days");
      setHiddenCategories(prefs.hiddenCategories || []);
    } catch (error) {
      console.log("Load preferences error:", error);
    }
  };

  const toggleArrayValue = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const savePreferences = async () => {
    const journeyPreferences = {
      interests,
      goals,
      difficulty,
      preferredLength,
      hiddenCategories,
      updatedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(PREF_KEY, JSON.stringify(journeyPreferences));

      Alert.alert(
        "Preferences Saved",
        "Your Legacy Walk recommendations will now be personalized."
      );

      if (fromOnboarding) {
        navigation.navigate("PersonalizationSummary");
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Save Error", "Unable to save preferences right now.");
    }
  };

  const resetPreferences = async () => {
    try {
      await AsyncStorage.removeItem(PREF_KEY);

      setInterests([]);
      setGoals([]);
      setDifficulty("moderate");
      setPreferredLength("30_days");
      setHiddenCategories([]);

      Alert.alert("Preferences Reset", "Your journey preferences were reset.");
    } catch (error) {
      Alert.alert("Reset Error", "Unable to reset preferences right now.");
    }
  };

 const skipScreen = () => {
  if (fromOnboarding) {
    if (navigation?.navigate) {
      navigation.navigate("JourneySelection");
    } else {
      goToJourneys?.();
    }
  } else {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack?.();
    }
  }
};

  const renderMultiOption = (item, selectedList, setter) => {
    const selected = selectedList.includes(item.id);

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => toggleArrayValue(item.id, selectedList, setter)}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {selected ? "✓ " : ""}
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDifficultyOption = (item) => {
    const selected = difficulty === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setDifficulty(item.id)}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {selected ? "✓ " : ""}
          {item.label}
        </Text>

        <Text style={styles.optionSubText}>{item.subtitle}</Text>
        <Text style={styles.optionDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  const renderLengthOption = (item) => {
    const selected = preferredLength === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setPreferredLength(item.id)}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {selected ? "✓ " : ""}
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.small}>PERSONALIZE</Text>
      <Text style={styles.title}>Your Legacy</Text>

      <Text style={styles.subtitle}>
        Choose the journeys and experiences that inspire you. Legathon Walk
        recommends based on your interests, not assumptions.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What inspires you?</Text>
        {INTERESTS.map((item) =>
          renderMultiOption(item, interests, setInterests)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What are your goals?</Text>
        {GOALS.map((item) => renderMultiOption(item, goals, setGoals))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Challenge Level</Text>
        {DIFFICULTY.map(renderDifficultyOption)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Journey Length</Text>
        {LENGTHS.map(renderLengthOption)}
      </View>

      <View style={styles.cardGold}>
        <Text style={styles.goldTitle}>Hide From Recommendations</Text>

        <Text style={styles.goldSubtitle}>
          Select categories you prefer not to see in recommendations. You can
          still browse all journeys later.
        </Text>

        {HIDE_CATEGORIES.map((item) =>
          renderMultiOption(item, hiddenCategories, setHiddenCategories)
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveText}>
          {fromOnboarding ? "Save & Continue" : "Save Preferences"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetPreferences}>
        <Text style={styles.resetText}>Reset Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={skipScreen}>
        <Text style={styles.skipText}>
          {fromOnboarding ? "Skip For Now" : "Not Now"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 140 }} />
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
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 6,
    marginTop: 18,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
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
    padding: 18,
    marginBottom: 20,
  },
  cardGold: {
    backgroundColor: "#10100A",
    borderColor: "#D8A72E",
    borderWidth: 1.5,
    borderRadius: 28,
    padding: 18,
    marginBottom: 22,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 16,
  },
  goldTitle: {
    color: "#D8A72E",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },
  goldSubtitle: {
    color: "#AAB7CA",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 14,
  },
  option: {
    backgroundColor: "#071224",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#241D08",
    borderColor: "#D8A72E",
  },
  optionText: {
    color: "#DDE6F3",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  optionTextSelected: {
    color: "#D8A72E",
  },
  optionSubText: {
    color: "#D8A72E",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 6,
  },
  optionDescription: {
    color: "#8FA1B8",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 14,
  },
  saveText: {
    color: "#05070C",
    fontSize: 18,
    fontWeight: "900",
  },
  resetButton: {
    backgroundColor: "#1A0B0B",
    borderColor: "#FF5C5C",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 14,
  },
  resetText: {
    color: "#FF5C5C",
    fontSize: 16,
    fontWeight: "900",
  },
  skipButton: {
    backgroundColor: "#0B1628",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  skipText: {
    color: "#DDE6F3",
    fontSize: 17,
    fontWeight: "900",
  },
});