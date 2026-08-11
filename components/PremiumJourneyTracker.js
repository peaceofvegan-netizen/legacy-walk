import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PremiumJourneyTracker() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.city}>SELMA</Text>
          <Text style={styles.state}>ALABAMA</Text>
        </View>

        <View style={styles.milesPill}>
          <Text style={styles.milesText}>54 MILES</Text>
        </View>

        <View>
          <Text style={styles.city}>MONTGOMERY</Text>
          <Text style={styles.state}>ALABAMA</Text>
        </View>
      </View>

      <View style={styles.mapStage}>
        <Text style={styles.shoe}>👟</Text>
        <View style={styles.routeLine} />

        <View style={[styles.node, styles.nodeActive]} />
        <View style={styles.node} />
        <View style={styles.node} />
        <View style={[styles.node, styles.nodeFinish]}>
          <Text style={styles.finishIcon}>🏛️</Text>
        </View>
      </View>

      <View style={styles.labels}>
        <Text style={styles.label}>Selma{"\n"}0 mi</Text>
        <Text style={styles.label}>Edmund{"\n"}0.6 mi</Text>
        <Text style={styles.label}>Lowndes{"\n"}18.2 mi</Text>
        <Text style={styles.finishLabel}>Montgomery{"\n"}54 mi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 22,
    padding: 20,
    borderRadius: 34,
    backgroundColor: "#071019",
    borderWidth: 1.5,
    borderColor: "#A6FFD2",
    shadowColor: "#A6FFD2",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  city: {
    color: "#F4D28A",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  state: {
    color: "#C9CEDA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 4,
  },

  milesPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(224,174,37,0.12)",
    borderWidth: 1,
    borderColor: "rgba(224,174,37,0.55)",
  },

  milesText: {
    color: "#E0AE25",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  mapStage: {
    height: 210,
    marginTop: 30,
    justifyContent: "center",
  },

  routeLine: {
    position: "absolute",
    left: 42,
    right: 42,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#15263A",
  },

  shoe: {
    position: "absolute",
    left: 0,
    top: 72,
    fontSize: 48,
    zIndex: 5,
    transform: [{ rotate: "-12deg" }],
  },

  node: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#A6FFD2",
    borderWidth: 5,
    borderColor: "#05070C",
    top: 83,
    shadowColor: "#A6FFD2",
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
  },

  nodeActive: {
    left: 92,
  },

  nodeFinish: {
    right: 0,
    width: 72,
    height: 72,
    borderRadius: 36,
    top: 70,
    backgroundColor: "#E0AE25",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E0AE25",
  },

  finishIcon: {
    fontSize: 34,
  },

  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  label: {
    color: "#C9CEDA",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 20,
  },

  finishLabel: {
    color: "#E0AE25",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 20,
  },
});