import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

export default function JourneyRewardPopup({
  visible,
  reward,
  onClose,
}) {
  if (!reward) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.trophy}>🏆</Text>

          <Text style={styles.title}>
            Journey Complete!
          </Text>

          <Text style={styles.rewardTitle}>
            {reward.title}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.rewardLine}>
            + {reward.coins} W Coins
          </Text>

          <Text style={styles.rewardLine}>
            Badge: {reward.badge}
          </Text>

          <Text style={styles.rewardLine}>
            Collection Unlocked
          </Text>

          <Text style={styles.collection}>
            {reward.unlockCollection}
          </Text>

          <Pressable
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              CLAIM REWARD
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#0D0F14",
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "#D8A72E",
    alignItems: "center",
  },

  trophy: {
    fontSize: 70,
    marginBottom: 12,
  },

  title: {
    color: "#D8A72E",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#333",
    marginVertical: 20,
  },

  rewardLine: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 8,
  },

  collection: {
    color: "#D8A72E",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#D8A72E",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },
});