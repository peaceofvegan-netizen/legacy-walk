import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LockedJourneyCard({
  title = "Journey Locked",
  message = "This journey is locked.",
  requirement = "Premium Required",
  onUnlock,
  onBack,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.lockIcon}>🔒</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.locked}>LOCKED</Text>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.requirementBox}>
          <Text style={styles.requirementText}>
            {requirement}
          </Text>
        </View>

        <TouchableOpacity style={styles.unlockButton} onPress={onUnlock}>
          <Text style={styles.unlockText}>Unlock Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#081020",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#D8A72E",
    padding: 28,
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 90,
    marginBottom: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  locked: {
    color: "#D8A72E",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 14,
  },
  message: {
    color: "#C8D3E0",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 20,
  },
  requirementBox: {
    backgroundColor: "#111A2E",
    borderColor: "#D8A72E",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  requirementText: {
    color: "#D8A72E",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  unlockButton: {
    backgroundColor: "#D8A72E",
    width: "100%",
    paddingVertical: 17,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 14,
  },
  unlockText: {
    color: "#05070C",
    fontSize: 18,
    fontWeight: "900",
  },
  backButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#284A75",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});