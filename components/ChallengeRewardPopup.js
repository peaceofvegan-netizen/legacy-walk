import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

export default function ChallengeRewardPopup({
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
          <Text style={styles.icon}>🔥</Text>

          <Text style={styles.title}>
            Challenge Complete!
          </Text>

          <Text style={styles.rewardTitle}>
            {reward.title}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.line}>
            + {reward.coins} W Coins
          </Text>

          {reward.streakBonus > 0 && (
            <Text style={styles.bonus}>
              + {reward.streakBonus} Streak Bonus
            </Text>
          )}

          <Text style={styles.total}>
            Total: {reward.totalCoins} Coins
          </Text>

          <Text style={styles.badge}>
            🏆 {reward.badge}
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
    backgroundColor: "#111318",
    borderRadius: 30,
    padding: 28,
    borderWidth: 2,
    borderColor: "#D8A72E",
    alignItems: "center",
  },

  icon: {
    fontSize: 70,
  },

  title: {
    color: "#D8A72E",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
  },

  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "700",
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#333",
    marginVertical: 20,
  },

  line: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  bonus: {
    color: "#2ECC71",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  total: {
    color: "#D8A72E",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 12,
  },

  badge: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#D8A72E",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
  },

  buttonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
  },
});