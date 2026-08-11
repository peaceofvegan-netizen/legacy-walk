// WelcomeBackScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeBackScreen({
  goToDashboard,
  goToJourneys,
  continueJourney,
}) {
  const [userName, setUserName] = useState("Legacy Walker");
  const [streak, setStreak] = useState(0);
  const [lifetimeSteps, setLifetimeSteps] = useState(0);
  const [activeJourney, setActiveJourney] = useState(
    "Choose Your First Journey"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedName = await AsyncStorage.getItem("userName");
      const savedStreak =
        await AsyncStorage.getItem("currentStreak");
      const savedSteps =
        await AsyncStorage.getItem("lifetimeSteps");
      const savedJourney =
        await AsyncStorage.getItem("activeJourneyTitle");

      if (savedName) setUserName(savedName);
      if (savedStreak) setStreak(Number(savedStreak));
      if (savedSteps)
        setLifetimeSteps(Number(savedSteps));
      if (savedJourney)
        setActiveJourney(savedJourney);
    } catch (error) {
      console.log("Error loading welcome data:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.brand}>LEGACY WALK</Text>

      <Text style={styles.greeting}>
        Welcome Back,
      </Text>

      <Text style={styles.name}>
        {userName}
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>
          🔥 Your Legacy Continues
        </Text>

        <Text style={styles.heroJourney}>
          {activeJourney}
        </Text>

        <Text style={styles.heroSubText}>
          Continue building your story and
          leave your legacy one step at a time.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            🔥 {streak}
          </Text>
          <Text style={styles.statLabel}>
            Day Streak
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            👣 {lifetimeSteps.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            Lifetime Steps
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={continueJourney}
      >
        <Text style={styles.primaryButtonText}>
          Continue Journey
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={goToDashboard}
      >
        <Text style={styles.secondaryButtonText}>
          Go To Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={goToJourneys}
      >
        <Text style={styles.secondaryButtonText}>
          Explore Journeys
        </Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>
          Today's Reminder
        </Text>

        <Text style={styles.tipText}>
          Every step you take today helps
          build the legacy you leave tomorrow.
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020814",
  },

  content: {
    padding: 24,
    paddingTop: 70,
  },

  brand: {
    color: "#77F7E5",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 8,
    marginBottom: 20,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  name: {
    color: "#D8A72E",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 30,
  },

  heroCard: {
    backgroundColor: "#06142A",
    borderWidth: 1.5,
    borderColor: "#D8A72E",
    borderRadius: 30,
    padding: 25,
    marginBottom: 25,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
  },

  heroJourney: {
    color: "#77F7E5",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 15,
  },

  heroSubText: {
    color: "#AAB7CA",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#06142A",
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "#15488B",
    alignItems: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  statLabel: {
    color: "#AAB7CA",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },

  primaryButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  primaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "900",
  },

  secondaryButton: {
    backgroundColor: "#06142A",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#15488B",
    marginBottom: 16,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  tipCard: {
    marginTop: 20,
    backgroundColor: "#0E0C04",
    borderWidth: 1,
    borderColor: "#D8A72E",
    borderRadius: 25,
    padding: 22,
  },

  tipTitle: {
    color: "#D8A72E",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },

  tipText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 28,
    fontStyle: "italic",
    fontWeight: "700",
  },
});