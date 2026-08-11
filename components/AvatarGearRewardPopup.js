import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AvatarGearRewardPopup({
  visible,
  item,
  title = "Gear Unlocked!",
  onClose,
  onEquip,
}) {
  if (!visible || !item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { borderColor: item.color || "#A6FFD2" }]}>
          <Text style={styles.small}>AVATAR REWARD</Text>

          <Text style={styles.icon}>🎁</Text>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.itemName}>{item.name}</Text>

          <Text style={styles.meta}>
            {item.rarity} • {item.category}
          </Text>

          <View
            style={[
              styles.colorPreview,
              { backgroundColor: item.color || "#A6FFD2" },
            ]}
          />

          <TouchableOpacity style={styles.button} onPress={onEquip}>
            <Text style={styles.buttonText}>Equip Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryText}>Continue</Text>
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
    borderRadius: 34,
    padding: 28,
    alignItems: "center",
    borderWidth: 2,
  },
  small: {
    color: "#A6FFD2",
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
    color: "#A6FFD2",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },
  meta: {
    color: "#DDE6F3",
    marginTop: 8,
    fontWeight: "800",
  },
  colorPreview: {
    width: 76,
    height: 76,
    borderRadius: 22,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#A6FFD2",
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