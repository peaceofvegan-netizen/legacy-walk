import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const LEVEL_COIN_REWARDS = {
  explorer: 100,
  pathfinder: 250,
  trailblazer: 500,
  legend: 1000,
  black_legacy_walker: 5000,
};

export default function AvatarLevelUpPopup({
  visible,
  level,
  onEquip,
  onClose,
}) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glow, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(glow, {
              toValue: 0,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();
    }
  }, [visible]);

  if (!level) return null;

  const coinReward = LEVEL_COIN_REWARDS[level.id] || 0;

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E0AE25", "#A6FFD2"],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }],
              borderColor,
            },
          ]}
        >
          <Text style={styles.emoji}>
            {level.id === "black_legacy_walker" ? "👑" : "🎉"}
          </Text>

          <Text style={styles.kicker}>LEVEL UP</Text>

          <Text style={[styles.title, { color: level.themeColor || "#E0AE25" }]}>
            {level.title}
          </Text>

          <Text style={styles.subtitle}>
            You unlocked new Legathon Walk gear.
          </Text>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardHeader}>Unlocked Rewards</Text>

            {(level.rewards || []).map((reward, index) => (
              <Text key={index} style={styles.rewardText}>
                ✅ {reward}
              </Text>
            ))}

            {coinReward > 0 && (
              <Text style={styles.coinReward}>
                🪙 +{coinReward.toLocaleString()} W Coins
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.equipButton} onPress={onEquip}>
            <Text style={styles.equipText}>Equip Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },

  card: {
    width: "100%",
    backgroundColor: "#0A0F17",
    borderRadius: 32,
    borderWidth: 2,
    padding: 26,
    alignItems: "center",
  },

  emoji: {
    fontSize: 62,
    marginBottom: 8,
  },

  kicker: {
    color: "#A6FFD2",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#A8B0BF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
  },

  rewardBox: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    padding: 18,
    marginBottom: 20,
  },

  rewardHeader: {
    color: "#E0AE25",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 12,
  },

  rewardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  coinReward: {
    color: "#A6FFD2",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },

  equipButton: {
    width: "100%",
    backgroundColor: "#E0AE25",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 12,
  },

  equipText: {
    color: "#05070C",
    fontSize: 17,
    fontWeight: "900",
  },

  closeButton: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    paddingVertical: 17,
    alignItems: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});