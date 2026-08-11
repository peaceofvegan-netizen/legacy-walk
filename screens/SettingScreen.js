import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { translate } from "../i18n/i18n";

const COLLAGE_BG = require("../assets/collage-background.png");

export default function SettingsScreen({
  language = "en",
  goBack,
  goToLanguage,
  goToPrivacy,
  goToAbout,
}) {
  const [stepTracking, setStepTracking] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ImageBackground
      source={COLLAGE_BG}
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

            <Text style={styles.kicker}>LEGACY SETTINGS</Text>
            <Text style={styles.title}>Control Your{"\n"}Journey</Text>

            <Section title="Account">
              <SettingRow
                icon="👤"
                title="Profile Information"
                subtitle="Name, avatar, rank, and public profile"
              />
              <SettingRow
                icon="🌎"
                title={translate(language, "language") || "Language"}
                onPress={goToLanguage}
              />
            </Section>

            <Section title="Health & Permissions">
              <ToggleRow
                icon="👟"
                title="Step Tracking"
                subtitle="Connect walking activity to Legacy Walk"
                value={stepTracking}
                onValueChange={setStepTracking}
              />
              <SettingRow
                icon="❤️"
                title="Health Permissions"
                subtitle="Manage Apple Health / Google Fit access"
              />
              <SettingRow
                icon="📱"
                title="Device Permissions"
                subtitle="Motion, location, notifications"
              />
            </Section>

            <Section title="Notifications">
              <ToggleRow
                icon="🔔"
                title="Push Notifications"
                subtitle="Journey reminders, rewards, streaks"
                value={notifications}
                onValueChange={setNotifications}
              />
              <SettingRow
                icon="🔥"
                title="Streak Alerts"
                subtitle="Daily walking reminders"
              />
              <SettingRow
                icon="🏅"
                title="Reward Alerts"
                subtitle="Stamp and badge unlocks"
              />
            </Section>

            <Section title="Privacy">
              <ToggleRow
                icon="🔒"
                title="Private Profile"
                subtitle="Hide your leaderboard and public stats"
                value={privateProfile}
                onValueChange={setPrivateProfile}
              />
              <SettingRow
                icon="🛡️"
                title="Data & Privacy"
                subtitle="Manage activity and profile data"
              />
              <SettingRow
                icon="📄"
                title={translate(language, "privacyPolicy") || "Privacy Policy"}
                subtitle="Legal information"
                onPress={goToPrivacy}
              />
            </Section>

            <Section title="Appearance">
              <ToggleRow
                icon="🌙"
                title="Dark Legacy Mode"
                subtitle="Premium dark theme"
                value={darkMode}
                onValueChange={setDarkMode}
              />

              <View style={styles.themeGrid}>
                <ThemePill active label="Legacy Black" />
                <ThemePill label="Roman Gold" />
                <ThemePill label="Tokyo Neon" />
                <ThemePill label="Mecca Emerald" />
              </View>
            </Section>

            <Section title="Support">
              <SettingRow
                icon="❓"
                title="Help Center"
                subtitle="FAQs and app support"
              />
              <SettingRow
                icon="💬"
                title="Contact Support"
                subtitle="Get help with your account"
              />
              <SettingRow
                icon="ℹ️"
                title={translate(language, "aboutLegacyWalk") || "About Legacy Walk"}
                subtitle="App version, mission, and credits"
                onPress={goToAbout}
              />
            </Section>

            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

function SettingRow({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.rowIcon}>{icon}</Text>

      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function ToggleRow({ icon, title, subtitle, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>

      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#5C6678", true: "#D4AF37" }}
        thumbColor="#F6F2E8"
      />
    </View>
  );
}

function ThemePill({ label, active }) {
  return (
    <View style={[styles.themePill, active && styles.themePillActive]}>
      <Text style={[styles.themeText, active && styles.themeTextActive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#02070D",
  },
  backgroundImage: {
    opacity: 0.32,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 140,
  },

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: "#D4AF37",
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  backText: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "900",
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 46,
    lineHeight: 52,
    fontWeight: "900",
    marginBottom: 26,
  },

  section: {
    backgroundColor: "rgba(2,20,43,0.92)",
    borderWidth: 1,
    borderColor: "#123A68",
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 6,
  },

  row: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  rowIcon: {
    width: 54,
    fontSize: 30,
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  rowSubtitle: {
    color: "#AEB8CC",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 5,
    lineHeight: 21,
  },
  chevron: {
    color: "#D4AF37",
    fontSize: 46,
    fontWeight: "900",
    marginLeft: 8,
  },

  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },
  themePill: {
    borderWidth: 1.5,
    borderColor: "#39475C",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  themePillActive: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.12)",
  },
  themeText: {
    color: "#AEB8CC",
    fontSize: 16,
    fontWeight: "900",
  },
  themeTextActive: {
    color: "#FFFFFF",
  },

  logoutButton: {
    borderWidth: 1.5,
    borderColor: "#FF5A66",
    backgroundColor: "rgba(255,0,0,0.12)",
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    color: "#FF7B86",
    fontSize: 22,
    fontWeight: "900",
  },
});