import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import journeys from "../data/journeys";

export default function JourneyMapsScreen({
  goBack,
  setSelectedJourney,
  goDetail,
}) {
  const openJourney = (journey) => {
    if (setSelectedJourney) setSelectedJourney(journey);
    if (goDetail) goDetail();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.small}>JOURNEY MAPS</Text>
        <Text style={styles.title}>Legathon Explorer</Text>
        <Text style={styles.subtitle}>
          Preview walking routes, checkpoints, map progress, and story locations.
        </Text>

        {journeys.map((journey) => (
          <TouchableOpacity
            key={journey.id}
            style={styles.card}
            onPress={() => openJourney(journey)}
          >
            <View style={styles.mapPreview}>
              <Text style={styles.mapIcon}>🧭</Text>
              <Text style={styles.mapText}>Live Route Preview</Text>
            </View>

            <Text style={styles.cardTitle}>{journey.title}</Text>
            <Text style={styles.location}>{journey.city || "Legahon Route"}</Text>

            <View style={styles.routeLine}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={styles.dotEnd} />
            </View>

            <View style={styles.infoRow}>
              <Info label="Distance" value={journey.distance || "Route"} />
              <Info
                label="Steps"
                value={
                  journey.steps
                    ? journey.steps.toLocaleString()
                    : "Journey"
                }
              />
              <Info label="Badge" value={journey.badge || "Explorer"} />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => openJourney(journey)}
            >
              <Text style={styles.buttonText}>View Route</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 18,
  },

  backText: {
    color: "#D4AF37",
    fontWeight: "900",
    fontSize: 18,
  },

  small: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 4,
    fontSize: 14,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 8,
  },

  subtitle: {
    color: "#B8C0D4",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#0D1422",
    borderWidth: 1,
    borderColor: "#22314A",
    borderRadius: 26,
    padding: 18,
    marginBottom: 20,
  },

  mapPreview: {
    height: 150,
    borderRadius: 22,
    backgroundColor: "#050A12",
    borderWidth: 1,
    borderColor: "#263650",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  mapIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  mapText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },

  location: {
    color: "#B8C0D4",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 16,
  },

  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D4AF37",
  },

  line: {
    flex: 1,
    height: 4,
    backgroundColor: "#D4AF37",
    marginHorizontal: 8,
    opacity: 0.6,
  },

  dotEnd: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#A7FFD0",
  },

  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#111C2E",
    borderRadius: 16,
    padding: 12,
  },

  infoLabel: {
    color: "#8D96AA",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  button: {
    backgroundColor: "#D4AF37",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "900",
  },
});
