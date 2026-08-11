import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function WellnessProfileScreen({ onFinish }) {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("Beginner");
  const [goal, setGoal] = useState("General Wellness");
  const [dietPreference, setDietPreference] = useState("Balanced");
  const [limitations, setLimitations] = useState("");

  function saveProfile() {
    onFinish &&
      onFinish({
        age,
        height,
        weight,
        activityLevel,
        goal,
        dietPreference,
        limitations,
      });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>AI WELLNESS PROFILE</Text>

      <Text style={styles.title}>Personalize Your Performance</Text>

      <Text style={styles.subtitle}>
        This helps Legacy Walk AI recommend smarter walking goals, wellness
        tips, marathon training, and nutrition guidance.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="Example: 35"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Height</Text>
        <TextInput
          value={height}
          onChangeText={setHeight}
          placeholder="Example: 5'10 or 178 cm"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Weight</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="number-pad"
          placeholder="Example: 180"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />
      </View>

      <OptionGroup
        title="Activity Level"
        value={activityLevel}
        options={["Beginner", "Intermediate", "Advanced"]}
        setValue={setActivityLevel}
      />

      <OptionGroup
        title="Main Goal"
        value={goal}
        options={[
          "General Wellness",
          "Weight Loss",
          "Mental Wellness",
          "Marathon",
          "Strength & Endurance",
        ]}
        setValue={setGoal}
      />

      <OptionGroup
        title="Diet Preference"
        value={dietPreference}
        options={["Balanced", "High Protein", "Low Carb", "Plant Based", "No Preference"]}
        setValue={setDietPreference}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Limitations / Injuries</Text>

        <TextInput
          value={limitations}
          onChangeText={setLimitations}
          multiline
          placeholder="Optional: knee pain, back pain, asthma, etc."
          placeholderTextColor="#6B7280"
          style={[styles.input, styles.textArea]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Activate AI Wellness Coach</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          onFinish &&
          onFinish({
            age: "",
            height: "",
            weight: "",
            activityLevel,
            goal,
            dietPreference,
            limitations: "",
            skipped: true,
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Skip For Now</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Wellness guidance is educational and not medical advice. Always consult
        a healthcare professional before starting intense training or dieting.
      </Text>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function OptionGroup({ title, value, options, setValue }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{title}</Text>

      <View style={styles.pillRow}>
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.pill, value === item && styles.pillActive]}
            onPress={() => setValue(item)}
          >
            <Text style={[styles.pillText, value === item && styles.pillTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 130 },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  subtitle: {
    color: "#A8B3C2",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
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

  label: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    backgroundColor: "#131C2B",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    color: "#FFFFFF",
    padding: 15,
    marginBottom: 12,
  },

  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  pill: {
    backgroundColor: "#131C2B",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  pillActive: {
    backgroundColor: "#A6FFD2",
    borderColor: "#A6FFD2",
  },

  pillText: {
    color: "#A8B3C2",
    fontWeight: "900",
  },

  pillTextActive: {
    color: "#04110A",
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A6FFD2",
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 14,
  },

  secondaryButtonText: {
    color: "#A6FFD2",
    fontWeight: "900",
    fontSize: 16,
  },

  disclaimer: {
    color: "#8C97A8",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 18,
  },
});