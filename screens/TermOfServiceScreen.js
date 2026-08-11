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

export default function TermsOfServiceScreen({ goBack }) {
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

            <Text style={styles.kicker}>TERMS OF SERVICE</Text>
            <Text style={styles.title}>Using Legacy Walk</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroIcon}>📜</Text>
              <Text style={styles.heroTitle}>Welcome To Legacy Walk</Text>
              <Text style={styles.heroText}>
                By using Legacy Walk, you agree to these terms governing step
                tracking, rewards, community participation, subscriptions,
                purchases, and account usage.
              </Text>
            </View>

            <TermCard
              icon="👟"
              title="Step Tracking Disclaimer"
              text="Legacy Walk relies on device sensors, Apple Health, Google Fit, and other tracking sources. Step counts may vary and are not guaranteed to be perfectly accurate."
            />

            <TermCard
              icon="🪙"
              title="Rewards & W Coins"
              text="W Coins, achievements, rewards, badges, and collectibles are virtual items and do not have cash value unless specifically stated."
            />

            <TermCard
              icon="🛍️"
              title="Marketplace Terms"
              text="Marketplace items, avatar rewards, passport frames, and collectibles may be modified, discontinued, or updated at any time."
            />

            <TermCard
              icon="⭐"
              title="Subscription Terms"
              text="Legacy Plus subscriptions automatically renew unless canceled through the appropriate platform or billing provider."
            />

            <TermCard
              icon="🌎"
              title="Community Rules"
              text="Users must treat others respectfully. Harassment, hate speech, impersonation, spam, cheating, and abusive behavior may result in account restrictions."
            />

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account Rules</Text>

              <RuleRow icon="✅" text="Provide accurate account information" />
              <RuleRow icon="✅" text="Protect your login credentials" />
              <RuleRow icon="✅" text="Use the platform responsibly" />
              <RuleRow icon="❌" text="No fake activity or reward manipulation" />
              <RuleRow icon="❌" text="No unauthorized access attempts" />
            </View>

            <View style={styles.safetyCard}>
              <Text style={styles.safetyLabel}>SAFETY NOTICE</Text>
              <Text style={styles.safetyTitle}>Walk Safely</Text>
              <Text style={styles.safetyText}>
                Always remain aware of your surroundings while walking. Do not
                use Legacy Walk in a manner that distracts you from traffic,
                hazards, or emergency situations.
              </Text>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactLabel}>SUPPORT</Text>
              <Text style={styles.contactTitle}>Questions About These Terms?</Text>
              <Text style={styles.contactText}>
                Contact Legacy Walk support regarding account access,
                subscriptions, purchases, rewards, or policy questions.
              </Text>

              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Last Updated: June 2026
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function TermCard({ icon, title, text }) {
  return (
    <View style={styles.termCard}>
      <Text style={styles.termIcon}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.termTitle}>{title}</Text>
        <Text style={styles.termText}>{text}</Text>
      </View>
    </View>
  );
}

function RuleRow({ icon, text }) {
  return (
    <View style={styles.ruleRow}>
      <Text style={styles.ruleIcon}>{icon}</Text>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },
  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.45,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,4,10,0.78)",
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 160,
  },

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
    color: "#D4AF37",
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
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
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

  termCard: {
    flexDirection: "row",
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 16,
  },

  termIcon: {
    fontSize: 34,
    width: 52,
  },

  termTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  termText: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: 8,
  },

  sectionCard: {
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

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  ruleIcon: {
    fontSize: 24,
    width: 40,
  },

  ruleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
  },

  safetyCard: {
    backgroundColor: "rgba(167,243,208,0.1)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.35)",
    marginBottom: 24,
  },

  safetyLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  safetyTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  safetyText: {
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
    borderColor: "rgba(212,175,55,0.28)",
    marginBottom: 24,
  },

  contactLabel: {
    color: "#D4AF37",
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
    backgroundColor: "#D4AF37",
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

  footerText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 40,
  },
});