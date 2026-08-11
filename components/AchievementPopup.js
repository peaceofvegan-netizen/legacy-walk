import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function AchievementPopup({
  visible,
  achievement,
  onClose,
}) {
  if (!achievement) return null;

  const onViewCertificate = () => {
  navigation.navigate("Certificate");
};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.small}>ACHIEVEMENT UNLOCKED</Text>
          <Text style={styles.icon}>🏆</Text>
          <Text style={styles.title}>{achievement}</Text>

          <Text style={styles.text}>
            You earned a new Legathon Walk achievement. Keep moving forward.
          </Text>
<TouchableOpacity
  style={styles.button}
  onPress={onViewCertificate}
>
  <Text>View Certificate</Text>
</TouchableOpacity>
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
    backgroundColor: "#10151F",
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: "#A6FFD2",
    alignItems: "center",
  },
  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  icon: {
    fontSize: 56,
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