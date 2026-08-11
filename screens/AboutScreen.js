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

export default function AboutLegathonWalkScreen({ goBack }) {
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

            <Text style={styles.kicker}>ABOUT LEGATHON WALK</Text>
            <Text style={styles.title}>Walk Real Stories. Unlock Real History.</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroIcon}>👟</Text>
              <Text style={styles.heroTitle}>What Is Legathon Walk?</Text>
              <Text style={styles.heroText}>
                Legacy Walk turns your real-world steps into meaningful journeys
                through history, culture, courage, discovery, and personal growth.
              </Text>
            </View>

            <InfoCard
              icon="🌍"
              title="The Mission"
              text="To help people move their bodies while learning powerful stories from around the world."
            />

            <InfoCard
              icon="🛂"
              title="The Passport Experience"
              text="Every journey becomes a collectible passport with stamps, milestones, badges, and completion rewards."
            />

            <InfoCard
              icon="📖"
              title="Story-Based Walking"
              text="Each route unlocks chapters and checkpoints as you walk, turning exercise into a living story."
            />

            <InfoCard
              icon="🏆"
              title="Rewards With Purpose"
              text="Earn W Coins, medals, certificates, achievements, and profile upgrades as you complete journeys."
            />

            <View style={styles.valuesCard}>
              <Text style={styles.sectionTitle}>Legacy Values</Text>

              <Value icon="✊" text="Honor powerful stories" />
              <Value icon="👟" text="Encourage healthy movement" />
              <Value icon="📚" text="Make learning interactive" />
              <Value icon="🌎" text="Celebrate culture and history" />
              <Value icon="🏅" text="Reward consistency and progress" />
            </View>

            <View style={styles.versionCard}>
              <Text style={styles.versionLabel}>APP VERSION</Text>
              <Text style={styles.versionTitle}>Legathon Walk V1.0</Text>
              <Text style={styles.versionText}>
                Premium demo build with journeys, passports, rewards, W Coins,
                AI Coach, community, analytics, marketplace, and certificates.
              </Text>
            </View>

            <View style={styles.footerCard}>
              <Text style={styles.footerTitle}>Built For Legacy</Text>
              <Text style={styles.footerText}>
                Every step matters. Every route teaches. Every journey leaves a mark.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

function Value({ icon, text }) {
  return (
    <View style={styles.valueRow}>
      <Text style={styles.valueIcon}>{icon}</Text>
      <Text style={styles.valueText}>{text}</Text>
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
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 54,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
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

  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 16,
  },
  infoIcon: { fontSize: 34, width: 52 },
  infoTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  infoText: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: 8,
  },

  valuesCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  valueIcon: { fontSize: 28, width: 46 },
  valueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
  },

  versionCard: {
    backgroundColor: "rgba(167,243,208,0.1)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.35)",
    marginBottom: 24,
  },
  versionLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  versionTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  versionText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },

  footerCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 40,
  },
  footerTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  footerText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
});