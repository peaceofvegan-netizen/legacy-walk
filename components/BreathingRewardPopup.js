import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function BreathingRewardPopup({
  visible,
  stats,
  onClose,
}) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.small}>BREATHING COMPLETE</Text>

          <Text style={styles.icon}>🫁</Text>

          <Text style={styles.title}>Recovery Reward!</Text>

          <Text style={styles.text}>
            Great job completing your breathing session.
          </Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>
              🔥 Streak: {stats?.streak || 0}
            </Text>

            <Text style={styles.rewardText}>
              💎 Points: {stats?.totalPointsEarned || 0}
            </Text>

            <Text style={styles.rewardText}>
              🧘 Sessions: {stats?.totalSessions || 0}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
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
    borderWidth: 2,
    borderColor: "#A6FFD2",
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  icon: {
    fontSize: 60,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },

  text: {
    color: "#DDE6F3",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 12,
  },

  rewardBox: {
    backgroundColor: "#131C2B",
    borderRadius: 22,
    padding: 16,
    width: "100%",
    marginTop: 20,
  },

  rewardText: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginTop: 22,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
  },
});