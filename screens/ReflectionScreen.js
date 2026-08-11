import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import reflectionPrompts from "../data/reflectionPrompts";

export default function ReflectionScreen({
  activeJourney,
  reflections = [],
  setReflections,
  saveReflectionToCloud,
}) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("Inspired");

  const category = activeJourney?.category || "Faith & Spiritual Growth";
  const prompts = reflectionPrompts[category] || [];

  const randomPrompt = useMemo(() => {
    return (
      prompts[Math.floor(Math.random() * prompts.length)] ||
      "What did your journey teach you today?"
    );
  }, [category]);

  function saveReflection() {
    if (!entry.trim()) return;

    const newReflection = {
      id: Date.now(),
      text: entry.trim(),
      mood,
      journeyTitle: activeJourney?.title || null,
      date: new Date().toLocaleDateString(),
    };

    setReflections && setReflections((current) => [newReflection, ...current]);
    saveReflectionToCloud && saveReflectionToCloud(newReflection);

    setEntry("");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>DAILY REFLECTION</Text>

      <Text style={styles.title}>Reflect On Your Journey</Text>

      <Text style={styles.subtitle}>
        Walking is not only physical — it’s emotional, spiritual, and personal.
      </Text>

      {activeJourney && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CURRENT JOURNEY</Text>
          <Text style={styles.journeyTitle}>{activeJourney.title}</Text>
          <Text style={styles.journeyCategory}>{activeJourney.category}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>HOW DO YOU FEEL?</Text>

        <View style={styles.moodRow}>
          {["Peaceful", "Inspired", "Focused", "Tired"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.moodButton,
                mood === item && styles.moodButtonActive,
              ]}
              onPress={() => setMood(item)}
            >
              <Text
                style={[
                  styles.moodText,
                  mood === item && styles.moodTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>TODAY’S THOUGHT</Text>

        <TextInput
          multiline
          placeholder="How did your walk make you feel today?"
          placeholderTextColor="#6B7280"
          value={entry}
          onChangeText={setEntry}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={saveReflection}>
          <Text style={styles.buttonText}>Save Reflection</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>GUIDED PROMPT</Text>
        <Text style={styles.prompt}>“{randomPrompt}”</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>SAVED REFLECTIONS</Text>

        {reflections.length === 0 ? (
          <Text style={styles.prompt}>No reflections saved yet.</Text>
        ) : (
          reflections.map((item) => (
            <View key={item.id} style={styles.reflectionItem}>
              <Text style={styles.reflectionDate}>
                {item.date} • {item.mood}
              </Text>

              {item.journeyTitle && (
                <Text style={styles.reflectionJourney}>
                  {item.journeyTitle}
                </Text>
              )}

              <Text style={styles.reflectionText}>{item.text}</Text>
            </View>
          ))
        )}
      </View>

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
    paddingBottom: 130,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  cardLabel: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  journeyTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  journeyCategory: {
    color: "#A6FFD2",
    marginTop: 8,
    fontWeight: "800",
  },

  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  moodButton: {
    backgroundColor: "#131C2B",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  moodButtonActive: {
    backgroundColor: "#A6FFD2",
    borderColor: "#A6FFD2",
  },

  moodText: {
    color: "#A8B3C2",
    fontWeight: "900",
  },

  moodTextActive: {
    color: "#04110A",
  },

  input: {
    minHeight: 180,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    backgroundColor: "#131C2B",
    borderRadius: 20,
    padding: 16,
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },

  prompt: {
    color: "#DDE6F3",
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
  },

  reflectionItem: {
    backgroundColor: "#131C2B",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  reflectionDate: {
    color: "#A6FFD2",
    fontWeight: "900",
    marginBottom: 8,
  },

  reflectionJourney: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 8,
  },

  reflectionText: {
    color: "#DDE6F3",
    lineHeight: 23,
  },
});