import React, { useState } from "react";
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

export default function StepPermissionsScreen({ goBack, goToHome }) {
  const [stepEnabled, setStepEnabled] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const enableTracking = () => {
    setStepEnabled(true);
    setMotionEnabled(true);
    setLocationEnabled(true);
  };

  return (
    <ImageBackground
      source={LEGACY_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {goBack && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.kicker}>STEP TRACKING SETUP</Text>
            <Text style={styles.title}>Connect Your Movement</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroIcon}>👟</Text>
              <Text style={styles.heroTitle}>Walk Anywhere</Text>
              <Text style={styles.heroText}>
                Legacy Walk uses your steps to move you through historic routes,
                unlock stories, earn passport stamps, and complete journeys.
              </Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.sectionTitle}>Permission Status</Text>

              <PermissionRow
                icon="❤️"
                title="Health Steps"
                subtitle="Connect Apple Health / Google Fit step data"
                enabled={stepEnabled}
              />

              <PermissionRow
                icon="📱"
                title="Motion Activity"
                subtitle="Track walking activity and movement sessions"
                enabled={motionEnabled}
              />

              <PermissionRow
                icon="📍"
                title="Location"
                subtitle="Optional GPS support for live journey progress"
                enabled={locationEnabled}
              />
            </View>

            <View style={styles.privacyCard}>
              <Text style={styles.privacyLabel}>PRIVACY PROMISE</Text>
              <Text style={styles.privacyTitle}>Your Journey Data Stays Protected</Text>
              <Text style={styles.privacyText}>
                Legacy Walk only uses activity data to calculate route progress,
                challenges, rewards, streaks, and journey unlocks. Your data is
                not sold.
              </Text>
            </View>

            <View style={styles.howItWorksCard}>
              <Text style={styles.sectionTitle}>How It Works</Text>

              <StepItem number="1" text="Enable step and motion tracking." />
              <StepItem number="2" text="Walk anywhere in real life." />
              <StepItem number="3" text="Your steps move your route marker." />
              <StepItem number="4" text="Unlock stories, stamps, and rewards." />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={enableTracking}>
              <Text style={styles.primaryButtonText}>Enable Step Tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={goToHome}>
              <Text style={styles.secondaryButtonText}>Continue To Home</Text>
            </TouchableOpacity>

            <View style={styles.troubleshootCard}>
              <Text style={styles.troubleLabel}>TROUBLESHOOTING</Text>
              <Text style={styles.troubleText}>
                If steps are not updating, check your phone settings and make
                sure Health, Motion, and Location permissions are enabled for
                Legacy Walk.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function PermissionRow({ icon, title, subtitle, enabled }) {
  return (
    <View style={styles.permissionRow}>
      <Text style={styles.permissionIcon}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionSubtitle}>{subtitle}</Text>
      </View>

      <View style={[styles.statusPill, enabled && styles.statusPillEnabled]}>
        <Text style={[styles.statusText, enabled && styles.statusTextEnabled]}>
          {enabled ? "ON" : "OFF"}
        </Text>
      </View>
    </View>
  );
}

function StepItem({ number, text }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
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
  backText: {
    color: "#D4AF37",
    fontSize: 19,
    fontWeight: "900",
  },

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
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.3)",
    marginBottom: 24,
  },
  heroIcon: {
    fontSize: 58,
    marginBottom: 12,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    textAlign: "center",
    marginTop: 12,
  },

  statusCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.25)",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.66)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
    marginBottom: 12,
  },
  permissionIcon: {
    fontSize: 30,
    width: 48,
  },
  permissionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  permissionSubtitle: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: "#374151",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusPillEnabled: {
    backgroundColor: "#A7F3D0",
  },
  statusText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "900",
  },
  statusTextEnabled: {
    color: "#020617",
  },

  privacyCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 24,
  },
  privacyLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  privacyTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  privacyText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },

  howItWorksCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.25)",
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  stepNumber: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  stepNumberText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
  stepText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
    lineHeight: 24,
  },

  primaryButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#020617",
    fontSize: 21,
    fontWeight: "900",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#D4AF37",
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "rgba(8,18,37,0.72)",
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },

  troubleshootCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    marginBottom: 40,
  },
  troubleLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  troubleText: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 25,
  },
});