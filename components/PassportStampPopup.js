import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function PassportStampPopup({
  visible,
  stamp,
  onClose,
}) {
  if (!stamp) return null;

  const unlocked = stamp.status === "Unlocked";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, unlocked && styles.unlockedCard]}>
          <Text style={styles.small}>
            {unlocked ? "PASSPORT STAMP UNLOCKED" : "LOCKED PASSPORT STAMP"}
          </Text>

          <Text style={styles.flag}>{stamp.flag || "🌍"}</Text>

          <Text style={styles.stamp}>{stamp.stamp || "📍"}</Text>

          <Text style={styles.country}>{stamp.country}</Text>

          <Text style={styles.journey}>{stamp.journey}</Text>

          <Text style={styles.region}>
            {stamp.region} • {stamp.category}
          </Text>

          <Text style={styles.description}>
            {stamp.description}
          </Text>

          {unlocked ? (
            <Text style={styles.unlockedText}>
              Unlocked: {stamp.dateUnlocked || "Completed"}
            </Text>
          ) : (
            <Text style={styles.lockedText}>
              Complete this journey to unlock the stamp.
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {unlocked ? "View Passport" : "Keep Walking"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.86)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#10151F",
    borderRadius: 34,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  unlockedCard: {
    borderColor: "#A6FFD2",
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },

  flag: {
    fontSize: 70,
    marginBottom: 8,
  },

  stamp: {
    fontSize: 58,
    marginBottom: 12,
  },

  country: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  journey: {
    color: "#DDE6F3",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  region: {
    color: "#8C97A8",
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },

  description: {
    color: "#DDE6F3",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 18,
  },

  unlockedText: {
    color: "#A6FFD2",
    fontWeight: "900",
    marginTop: 18,
    textAlign: "center",
  },

  lockedText: {
    color: "#FFD700",
    fontWeight: "900",
    marginTop: 18,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 28,
    marginTop: 26,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 15,
  },
});