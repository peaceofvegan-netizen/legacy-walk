import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function JourneyCompletionPopup({
  visible,
  journey,
  onClose,
}) {
  if (!journey) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.small}>JOURNEY COMPLETE</Text>

          <Text style={styles.icon}>🏆</Text>

          <Text style={styles.title}>{journey.title}</Text>

          <Text style={styles.text}>
            You completed this Legacy Walk journey and earned:
          </Text>

          <Text style={styles.reward}>
            {journey.badge || "Legacy Finisher"}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Claim Reward</Text>
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
    borderColor: "#FFD700",
  },
  small: {
    color: "#FFD700",
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
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  text: {
    color: "#DDE6F3",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 14,
  },
  reward: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginTop: 26,
  },
  buttonText: {
    color: "#18110A",
    fontWeight: "900",
    fontSize: 15,
  },
});