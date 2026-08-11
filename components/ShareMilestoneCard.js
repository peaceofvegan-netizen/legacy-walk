import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";

export default function ShareMilestoneCard({
  title = "Legacy Walk Milestone",
  message = "I’m building my legathon legacy one step at a time.",
}) {
  async function shareMilestone() {
    await Share.share({
      message: `${title}\n\n${message}\n\nWalk real stories. Unlock real history.`,
    });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>SHARE YOUR LEGATHON LEGACY</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.text}>{message}</Text>

      <TouchableOpacity style={styles.button} onPress={shareMilestone}>
        <Text style={styles.buttonText}>Share Milestone</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },
  label: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  text: {
    color: "#A8B3C2",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 15,
  },
});