import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";

import AvatarSocialCard from "../components/AvatarSocialCard";
import { exportAvatarProfile } from "../utils/avatarProfileExport";

export default function ShareAvatarProfileScreen({
  level = 1,
  rank = "Beginner Walker",
  outfit = "Starter Recovery Set",
  breathingStreak = 0,
  marathonMedals = 0,
  coins = 0,
  wellnessPoints = 0,
}) {
  const cardRef = useRef(null);

  async function shareTextProfile() {
    await Share.share({
      message: `Legacy Walk Profile 🚶‍♂️

Rank: ${rank}
Level: ${level}
Outfit: ${outfit}
Breathing Streak: ${breathingStreak}
Marathon Medals: ${marathonMedals}

Join me on Legacy Walk.`,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>SHARE PROFILE</Text>

      <Text style={styles.title}>Your Legacy Card</Text>

      <Text style={styles.subtitle}>
        Export your avatar profile as an image or share your wellness profile as text.
      </Text>

      <View collapsable={false} ref={cardRef}>
        <AvatarSocialCard
          level={level}
          rank={rank}
          outfit={outfit}
          breathingStreak={breathingStreak}
          marathonMedals={marathonMedals}
          coins={coins}
          wellnessPoints={wellnessPoints}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => exportAvatarProfile(cardRef)}
      >
        <Text style={styles.buttonText}>Export Profile Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={shareTextProfile}>
        <Text style={styles.secondaryButtonText}>Share Text Profile</Text>
      </TouchableOpacity>

      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 140 },
  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },
  subtitle: {
    color: "#A8B3C2",
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 22,
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 22,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A6FFD2",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 14,
  },
  secondaryButtonText: {
    color: "#A6FFD2",
    fontWeight: "900",
    fontSize: 16,
  },
});