import React from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const LEGACY_BG = require("../assets/collage-background.png");

export default function PrivacyPolicyScreen({ goBack }) {
  return (
    <ImageBackground
      source={LEGACY_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {goBack && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.kicker}>PRIVACY POLICY</Text>
            <Text style={styles.title}>Your Legacy Data</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroIcon}>🛡️</Text>
              <Text style={styles.heroTitle}>Your Data Stays Protected</Text>
              <Text style={styles.heroText}>
                Legacy Walk uses activity data only to power your steps, journeys,
                rewards, passport stamps, streaks, and community features.
              </Text>
            </View>

            <PolicyCard
              icon="👟"
              title="Step Tracking Data"
              text="We use your step count to calculate route progress, daily challenges, streaks, badges, and journey completion."
            />

            <PolicyCard
              icon="📍"
              title="Location / GPS Data"
              text="Location may be used for live journey progress and verification. You can turn location permissions off in your device settings."
            />

            <PolicyCard
              icon="🛂"
              title="Passport & Rewards Data"
              text="We store earned stamps, badges, medals, W Coins, certificates, and completed routes so your Legacy profile stays updated."
            />

            <PolicyCard
              icon="🌎"
              title="Community Data"
              text="If you use community features, your public activity may include leaderboard rank, badges, completed journeys, and shared posts."
            />

            <View style={styles.controlsCard}>
              <Text style={styles.sectionTitle}>Your Controls</Text>

              <ControlRow icon="⚙️" text="Manage permissions in Settings" />
              <ControlRow icon="🔕" text="Turn off notifications anytime" />
              <ControlRow icon="👤" text="Make your profile private" />
              <ControlRow icon="🗑️" text="Request account or data deletion" />
            </View>

            <View style={styles.protectCard}>
              <Text style={styles.protectLabel}>DATA PROTECTION</Text>
              <Text style={styles.protectTitle}>How We Protect Your Information</Text>
              <Text style={styles.protectText}>
                Legacy Walk is designed to keep your walking, reward, and profile
                data secure. Production launch should include encrypted storage,
                secure authentication, privacy controls, and clear user consent.
              </Text>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactLabel}>PRIVACY SUPPORT</Text>
              <Text style={styles.contactTitle}>Need Privacy Help?</Text>
              <Text style={styles.contactText}>
                Contact support for privacy questions, account access, data export,
                or deletion requests.
              </Text>

              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Privacy Support</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function PolicyCard({ icon, title, text }) {
  return (
    <View style={styles.policyCard}>
      <Text style={styles.policyIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.policyTitle}>{title}</Text>
        <Text style={styles.policyText}>{text}</Text>
      </View>
    </View>
  );
}

function ControlRow({ icon, text }) {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.controlIcon}>{icon}</Text>
      <Text style={styles.controlText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#020617" },
  backgroundImage: { resizeMode: "cover", opacity: 0.45 },
  overlay: { flex: 1, backgroundColor: "rgba(2,4,10,0.78)" },
  safe: { flex: 1 },
  content: { padding: 22, paddingBottom: 160 },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(8,18,37,0.88)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.45)",
    marginBottom: 24,
  },
  backText: { color: "#D4AF37", fontSize: 19, fontWeight: "900" },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(167,243,208,0.1)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.35)",
    marginBottom: 24,
  },
  heroIcon: { fontSize: 58, marginBottom: 12 },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    textAlign: "center",
    marginTop: 12,
  },

  policyCard: {
    flexDirection: "row",
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 16,
  },
  policyIcon: {
    fontSize: 34,
    width: 52,
  },
  policyTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  policyText: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: 8,
  },

  controlsCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.28)",
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  controlIcon: {
    fontSize: 28,
    width: 46,
  },
  controlText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
  },

  protectCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 24,
  },
  protectLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  protectTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  protectText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },

  contactCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.28)",
    marginBottom: 40,
  },
  contactLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  contactTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  contactText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  contactButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 22,
  },
  contactButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
});