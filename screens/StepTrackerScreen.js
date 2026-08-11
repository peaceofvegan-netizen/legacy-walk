import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  loadStepData,
  addSteps,
  calculateLevelFromMiles,
  calculateWCoinsFromSteps,
} from "../utils/stepTrackingEngine";

export default function StepTrackerScreen() {
  const [steps, setSteps] = useState({
    todaySteps: 0,
    totalSteps: 0,
    totalMiles: 0,
    streak: 0,
    history: [],
  });

  useEffect(() => {
    async function load() {
      const data = await loadStepData();
      setSteps(data);
    }

    load();
  }, []);

  async function addDemoSteps(amount) {
    const updated = await addSteps(amount);
    setSteps(updated);
  }

  const level = calculateLevelFromMiles(steps.totalMiles);
  const coinsEarnedToday = calculateWCoinsFromSteps(steps.todaySteps);
  const dailyProgress = Math.min(100, Math.round((steps.todaySteps / 5000) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>STEP TRACKER</Text>
      <Text style={styles.title}>Today’s Walk</Text>

      <View style={styles.heroCard}>
        <Text style={styles.stepCount}>{steps.todaySteps.toLocaleString()}</Text>
        <Text style={styles.stepLabel}>Steps Today</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${dailyProgress}%` }]} />
        </View>

        <Text style={styles.goalText}>{dailyProgress}% of 5,000 step goal</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Total Steps" value={steps.totalSteps.toLocaleString()} />
        <Stat label="Miles" value={steps.totalMiles} />
        <Stat label="Streak" value={steps.streak} />
      </View>

      <View style={styles.levelCard}>
        <Text style={styles.cardTitle}>Current Level</Text>
        <Text style={styles.level}>{level.toUpperCase()}</Text>
        <Text style={styles.subText}>Coins earned today: 🪙 {coinsEarnedToday}</Text>
      </View>

      <Text style={styles.sectionTitle}>Demo Step Buttons</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => addDemoSteps(500)}>
          <Text style={styles.buttonText}>+500</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => addDemoSteps(1000)}>
          <Text style={styles.buttonText}>+1,000</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => addDemoSteps(5000)}>
          <Text style={styles.buttonText}>+5,000</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>

      {steps.history.slice(0, 5).map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <Text style={styles.historyText}>+{item.stepsAdded} steps</Text>
          <Text style={styles.historySub}>{item.date}</Text>
        </View>
      ))}

      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 140 },

  small: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: "#111318",
    borderRadius: 30,
    padding: 28,
    borderWidth: 2,
    borderColor: "#D8A72E",
    alignItems: "center",
  },

  stepCount: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
  },

  stepLabel: {
    color: "#D8A72E",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },

  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#222",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#D8A72E",
  },

  goalText: {
    color: "#A8B3C2",
    marginTop: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#111318",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  statLabel: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 12,
  },

  levelCard: {
    backgroundColor: "#111318",
    borderRadius: 26,
    padding: 22,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  level: {
    color: "#D8A72E",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },

  subText: {
    color: "#A8B3C2",
    marginTop: 8,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 26,
    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    flex: 1,
    backgroundColor: "#D8A72E",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#000000",
    fontWeight: "900",
  },

  historyCard: {
    backgroundColor: "#111318",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },

  historyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  historySub: {
    color: "#9CA3AF",
    marginTop: 5,
  },
});