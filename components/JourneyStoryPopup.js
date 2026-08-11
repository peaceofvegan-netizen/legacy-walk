import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

function getIcon(type) {
  if (type === "fact") return "🏛️";
  if (type === "audio") return "🎧";
  if (type === "reward") return "🏆";
  return "📖";
}

export default function JourneyStoryPopup({
  visible,
  story,
  onClose,
}) {
  if (!story) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>{getIcon(story.type)}</Text>

          <Text style={styles.small}>
            MILE {story.mile} UNLOCKED
          </Text>

          <Text style={styles.title}>{story.title}</Text>

          <Text style={styles.description}>
            {story.description}
          </Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>CONTINUE WALKING</Text>
          </Pressable>
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

  small: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 12,
  },

  description: {
    color: "#DDE6F3",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 14,
  },

  button: {
    backgroundColor: "#D8A72E",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 24,
  },

  buttonText: {
    color: "#000",
    fontWeight: "900",
  },
});