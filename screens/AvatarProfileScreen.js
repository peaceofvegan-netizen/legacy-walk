import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const DEFAULT_AVATAR_IMAGE = require("../assets/avatars/Caucasian/female/youngwhitefemale.png");
const LEGACY_LOGO = require("../assets/logo/Legacylogo.png");

export default function AvatarProfileScreen({
  currentAvatar,
  goToAvatarStore,
}) {
  const avatarName = currentAvatar?.name || "Amelia Horizon";
  const avatarImage = currentAvatar?.image || DEFAULT_AVATAR_IMAGE;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <Image source={LEGACY_LOGO} style={styles.logoBackground} />

        <Image source={avatarImage} style={styles.avatarImage} />

        <View style={styles.statsRow}>
          <Stat icon="🔥" value="12" label="Day Streak" sub="Keep it going!" />
          <Stat icon="⭐" value="2,450" label="Points" sub="Earned for steps" />
          <Stat icon="💎" value="5" label="Badges" sub="Achievements" />
        </View>

        <Text style={styles.avatarName}>{avatarName}</Text>

        <View style={styles.setRow}>
          <Image source={LEGACY_LOGO} style={styles.setLogo} />
          <Text style={styles.avatarSet}>Foundation Set</Text>
        </View>

        <Text style={styles.avatarSubtitle}>
          Keep stepping. Build your legacy.
        </Text>

        <TouchableOpacity style={styles.editButton} onPress={goToAvatarStore}>
          <Text style={styles.editButtonText}>✎ Edit Avatar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Stat({ icon, value, label, sub }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statTop}>
        {icon} {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 260,
  },

  profileCard: {
    backgroundColor: "#07111A",
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#1E2B40",
    overflow: "hidden",
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 120,
  },

  logoBackground: {
    position: "absolute",
    width: 560,
    height: 560,
    resizeMode: "contain",
    opacity: 1.65,
    top: 120,
  },

  avatarImage: {
    width: 330,
    height: 455,
    resizeMode: "contain",
    marginTop: 10,
  },

  statsRow: {
    flexDirection: "row",
    width: "92%",
    gap: 10,
    marginTop: -20,
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    minHeight: 112,
    backgroundColor: "#02060B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#102015",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },

  statTop: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  statLabel: {
    color: "#39D353",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },

  statSub: {
    color: "#B7BECC",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },

  avatarName: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 44
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  setLogo: {
    width: 60,
    height: 90
    ,
    resizeMode: "contain",
    marginRight: 5,
  },

  avatarSet: {
    color: "#E0AE25",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  avatarSubtitle: {
    color: "#AAB6C4",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 26,
  },

  editButton: {
    backgroundColor: "#E0AE25",
    width: "90%",
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: "center",
  },

  editButtonText: {
    color: "#000000",
    fontSize: 23,
    fontWeight: "900",
  },
});