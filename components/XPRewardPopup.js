import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function XPRewardPopup({
  visible,
  xp = 0,
  level,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.small}>XP REWARD</Text>

          <Text style={styles.icon}>⚡</Text>

          <Text style={styles.title}>
            +{xp.toLocaleString()} XP
          </Text>

          <Text style={styles.text}>
            You earned progress toward your Legathon Walk level.
          </Text>

          {level && (
            <Text style={styles.level}>
              Level {level.level}: {level.title}
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Claim XP</Text>
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
    borderRadius: 32,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A6FFD2",
  },
  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  icon: {
    fontSize: 66,
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },
  text: {
    color: "#DDE6F3",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 14,
  },
  level: {
    color: "#A6FFD2",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginTop: 26,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 15,
  },
});