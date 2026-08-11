import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function StoryUnlockPopup({
  visible,
  story,
  onClose,
}) {
  if (!story) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>STORY UNLOCKED</Text>

          <Text style={styles.icon}>✨</Text>

          <Text style={styles.title}>
            {story.title}
          </Text>

          <Text style={styles.text}>
            {story.text}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              Continue Walking
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
    borderWidth: 1,
    borderColor: "#A6FFD2",
    alignItems: "center",
  },
  badge: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  icon: {
    fontSize: 54,
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  text: {
    color: "#DDE6F3",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 15,
  },
});