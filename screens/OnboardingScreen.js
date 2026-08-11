import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const categories = [
  {
    title: "History & Culture",
    icon: "🏛️",
  },
  {
    title: "Faith & Spiritual Growth",
    icon: "🙏",
  },
  {
    title: "World Wonders",
    icon: "🌍",
  },
  {
    title: "Civil Rights & Freedom",
    icon: "✊",
  },
  {
    title: "Ancient Civilizations",
    icon: "📜",
  },
  {
    title: "Nature & Adventure",
    icon: "⛰️",
  },
  {
    title: "Mental Wellness",
    icon: "🧠",
  },
  {
    title: "Fitness Challenges",
    icon: "🔥",
  },
  {
    title: "Inspirational Leaders",
    icon: "⭐",
  },
  {
    title: "City Discovery",
    icon: "🏙️",
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [selected, setSelected] = useState([]);

  function toggleCategory(title) {
    if (selected.includes(title)) {
      setSelected(selected.filter((item) => item !== title));
    } else {
      setSelected([...selected, title]);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.small}>WELCOME TO LEGACY WALK</Text>

      <Text style={styles.title}>
        Walk Real Stories.{"\n"}
        Unlock Real History.
      </Text>

      <Text style={styles.subtitle}>
        Choose the journeys and experiences that inspire you most.
      </Text>

      {categories.map((item) => {
        const active = selected.includes(item.title);

        return (
          <TouchableOpacity
            key={item.title}
            style={[
              styles.card,
              active && styles.cardActive,
            ]}
            onPress={() => toggleCategory(item.title)}
          >
            <Text style={styles.icon}>{item.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.cardTitle,
                  active && styles.cardTitleActive,
                ]}
              >
                {item.title}
              </Text>

              <Text style={styles.cardText}>
                Personalized journeys and recommendations.
              </Text>
            </View>

            <View
              style={[
                styles.circle,
                active && styles.circleActive,
              ]}
            />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.button}
        onPress={onFinish}
      >
        <Text style={styles.buttonText}>
          Start Walking
        </Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 22,
    paddingBottom: 120,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 18,
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#10151F",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  cardActive: {
    borderColor: "#A6FFD2",
    backgroundColor: "#132033",
  },

  icon: {
    fontSize: 28,
    marginRight: 16,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  cardTitleActive: {
    color: "#A6FFD2",
  },

  cardText: {
    color: "#8C97A8",
    marginTop: 6,
    lineHeight: 20,
  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3B475C",
  },

  circleActive: {
    backgroundColor: "#A6FFD2",
    borderColor: "#A6FFD2",
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 17,
  },
});