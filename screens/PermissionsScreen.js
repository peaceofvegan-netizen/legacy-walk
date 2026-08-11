import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function PermissionsScreen({ onContinue }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>YOUR PRIVACY MATTERS</Text>

      <Text style={styles.title}>Permissions We Ask For</Text>

      <Text style={styles.subtitle}>
        Legacy Walk only asks for permissions that help track your walking,
        save your progress, and improve your wellness experience.
      </Text>

      <PermissionCard
        icon="👟"
        title="Motion & Step Tracking"
        text="Used to count your steps while you walk with your phone. This powers journey progress, XP, streaks, and walk history."
      />

      <PermissionCard
        icon="📍"
        title="Location Access"
        text="Used only if you enable route tracking. This can help show outdoor walking progress and route points."
      />

      <PermissionCard
        icon="☁️"
        title="Account & Cloud Sync"
        text="Used to save your progress, completed journeys, passport stamps, reflections, and walk history to your account."
      />

      <PermissionCard
        icon="🧘"
        title="Wellness Reflections"
        text="Your journal reflections are private to your account. They are used to help you track personal growth."
      />

      <PermissionCard
        icon="🔒"
        title="Your Control"
        text="You can deny optional permissions, sign out, reset demo progress, or manage account settings at any time."
      />

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue to Legacy Walk</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        We do not sell your personal walking, wellness, or location data.
      </Text>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function PermissionCard({ icon, title, text }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 18,
    paddingBottom: 130,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  subtitle: {
    color: "#A8B3C2",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#10151F",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    flexDirection: "row",
  },

  icon: {
    fontSize: 34,
    marginRight: 14,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  cardText: {
    color: "#A8B3C2",
    lineHeight: 23,
    marginTop: 8,
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },

  footer: {
    color: "#8C97A8",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 18,
    fontWeight: "700",
  },
});