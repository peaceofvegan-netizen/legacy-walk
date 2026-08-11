import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AvatarUnlockPopup({
  visible,
  unlocks = [],
  onClose,
  onEquip,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const firstUnlock = unlocks?.[0];

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible || !firstUnlock) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.small}>NEW AVATAR GEAR</Text>

          <Text style={styles.icon}>🎽</Text>

          <Text style={styles.title}>Gear Unlocked!</Text>

          <Text style={styles.itemName}>{firstUnlock.title}</Text>

          <Text style={styles.levelText}>
            Level {firstUnlock.level} Reward
          </Text>

          <Text style={styles.description}>
            Your avatar progression unlocked new gear. Visit the store or equip
            it now.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onEquip && onEquip(firstUnlock)}
          >
            <Text style={styles.buttonText}>Equip Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryText}>Later</Text>
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
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  small: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  itemName: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },
  levelText: {
    color: "#A6FFD2",
    marginTop: 10,
    fontWeight: "900",
  },
  description: {
    color: "#DDE6F3",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 14,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 28,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
  },
  secondaryButton: {
    marginTop: 14,
  },
  secondaryText: {
    color: "#A6FFD2",
    fontWeight: "900",
  },
});