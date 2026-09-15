import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { translate } from "../i18n/i18n";

const COLLAGE_BG = require(
  "../assets/collage-background.png"
);

export const LEGATHON_SETTINGS_KEY =
  "LEGATHON_APP_SETTINGS_V1";

export const DEFAULT_LEGATHON_SETTINGS = {
  stepTracking: true,
  notifications: true,
  streakAlerts: true,
  rewardAlerts: true,
  privateProfile: false,
  darkMode: true,
  theme: "legathonBlack",
};

const THEMES = {
  legathonBlack: {
    label: "Legathon Black",
    accent: "#D4AF37",
    secondary: "#A7F3D0",
    background: "#02070D",
    card: "rgba(2,20,43,0.94)",
    border: "#123A68",
    text: "#FFFFFF",
    muted: "#AEB8CC",
  },

  romanGold: {
    label: "Roman Gold",
    accent: "#F4C542",
    secondary: "#FFE7A3",
    background: "#100B03",
    card: "rgba(40,27,6,0.95)",
    border: "#7A5715",
    text: "#FFF9E8",
    muted: "#D5C49C",
  },

  tokyoNeon: {
    label: "Tokyo Neon",
    accent: "#00E5FF",
    secondary: "#FF4FD8",
    background: "#030510",
    card: "rgba(11,13,43,0.95)",
    border: "#253D86",
    text: "#FFFFFF",
    muted: "#AEB8D8",
  },

  meccaEmerald: {
    label: "Mecca Emerald",
    accent: "#42F5A1",
    secondary: "#E7C75E",
    background: "#02100B",
    card: "rgba(4,38,27,0.95)",
    border: "#176848",
    text: "#F3FFF9",
    muted: "#A8CDBD",
  },
};

function safeBoolean(value, fallback) {
  return typeof value === "boolean"
    ? value
    : fallback;
}

function normalizeSettings(value) {
  const saved =
    value &&
    typeof value === "object"
      ? value
      : {};

  const selectedTheme =
    typeof saved.theme === "string" &&
    THEMES[saved.theme]
      ? saved.theme
      : DEFAULT_LEGATHON_SETTINGS.theme;

  return {
    stepTracking: safeBoolean(
      saved.stepTracking,
      DEFAULT_LEGATHON_SETTINGS
        .stepTracking
    ),

    notifications: safeBoolean(
      saved.notifications,
      DEFAULT_LEGATHON_SETTINGS
        .notifications
    ),

    streakAlerts: safeBoolean(
      saved.streakAlerts,
      DEFAULT_LEGATHON_SETTINGS
        .streakAlerts
    ),

    rewardAlerts: safeBoolean(
      saved.rewardAlerts,
      DEFAULT_LEGATHON_SETTINGS
        .rewardAlerts
    ),

    privateProfile: safeBoolean(
      saved.privateProfile,
      DEFAULT_LEGATHON_SETTINGS
        .privateProfile
    ),

    darkMode: safeBoolean(
      saved.darkMode,
      DEFAULT_LEGATHON_SETTINGS
        .darkMode
    ),

    theme: selectedTheme,
  };
}

export default function SettingsScreen({
  language = "en",

  goBack,
  goToProfile,
  goToLanguage,
  goToPrivacy,
  goToAbout,
  goToHelpCenter,
  goToContactSupport,

  onLogout,
  onSettingsChanged,
}) {
  const [settings, setSettings] =
    useState(
      DEFAULT_LEGATHON_SETTINGS
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const selectedTheme =
    THEMES[settings.theme] ||
    THEMES.legathonBlack;

  const colors = useMemo(() => {
    if (settings.darkMode) {
      return selectedTheme;
    }

    return {
      ...selectedTheme,
      background: "#EEF3F8",
      card:
        "rgba(255,255,255,0.96)",
      border: "#C5D2E0",
      text: "#07111F",
      muted: "#536276",
    };
  }, [
    selectedTheme,
    settings.darkMode,
  ]);

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const saved =
          await AsyncStorage.getItem(
            LEGATHON_SETTINGS_KEY
          );

        if (!mounted) {
          return;
        }

        if (saved) {
          setSettings(
            normalizeSettings(
              JSON.parse(saved)
            )
          );
        }
      } catch (error) {
        console.log(
          "Settings load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  async function persistSettings(
    nextSettings
  ) {
    setSaving(true);

    try {
      await AsyncStorage.multiSet([
        [
          LEGATHON_SETTINGS_KEY,
          JSON.stringify(nextSettings),
        ],
        [
          "LEGATHON_STEP_TRACKING_ENABLED",
          String(
            nextSettings.stepTracking
          ),
        ],
        [
          "LEGATHON_NOTIFICATIONS_ENABLED",
          String(
            nextSettings.notifications
          ),
        ],
        [
          "LEGATHON_PRIVATE_PROFILE",
          String(
            nextSettings.privateProfile
          ),
        ],
        [
          "LEGATHON_DARK_MODE",
          String(
            nextSettings.darkMode
          ),
        ],
        [
          "LEGATHON_THEME",
          nextSettings.theme,
        ],
      ]);

      if (
        typeof onSettingsChanged ===
        "function"
      ) {
        onSettingsChanged(
          nextSettings
        );
      }
    } catch (error) {
      console.log(
        "Settings save error:",
        error
      );

      Alert.alert(
        "Settings Error",
        "Your change could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateSetting(key, value) {
    const nextSettings = {
      ...settings,
      [key]: value,
    };

    if (
      key === "notifications" &&
      value === false
    ) {
      nextSettings.streakAlerts =
        false;

      nextSettings.rewardAlerts =
        false;
    }

    setSettings(nextSettings);

    persistSettings(nextSettings);
  }

  function openDeviceSettings(title) {
    Alert.alert(
      title,
      "Legathon Walk will open your device settings so you can manage this permission.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",

          onPress: async () => {
            try {
              await Linking.openSettings();
            } catch {
              Alert.alert(
                "Unable to Open Settings",
                "Open your phone Settings and select Legathon Walk."
              );
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      "Log Out?",
      "Your saved walking progress will remain connected to your account.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",

          onPress: async () => {
            if (
              typeof onLogout ===
              "function"
            ) {
              await onLogout();
              return;
            }

            Alert.alert(
              "Logout Not Connected",
              "Pass your existing logout function into SettingsScreen as onLogout."
            );
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.loadingScreen
        }
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text
          style={styles.loadingText}
        >
          Loading settings...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={COLLAGE_BG}
      style={styles.background}
      imageStyle={
        styles.backgroundImage
      }
    >
      <View style={styles.overlay}>
        <SafeAreaView
          style={styles.safe}
        >
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.content
            }
          >
            <View
              style={styles.topRow}
            >
              {goBack ? (
                <TouchableOpacity
                  style={
                    styles.backButton
                  }
                  onPress={goBack}
                  activeOpacity={0.8}
                >
                  <Text
                    style={
                      styles.backText
                    }
                  >
                    ‹ Back
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              <View
                style={
                  styles.saveStatus
                }
              >
                {saving ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      colors.accent
                    }
                  />
                ) : (
                  <Text
                    style={
                      styles.saveStatusText
                    }
                  >
                    ✓ Saved
                  </Text>
                )}
              </View>
            </View>

            <Text
              style={styles.kicker}
            >
              LEGATHON SETTINGS
            </Text>

            <Text
              style={styles.title}
            >
              Control Your{"\n"}Journey
            </Text>

            <Section
              title="Account"
              styles={styles}
            >
              <SettingRow
                icon="👤"
                title="Profile Information"
                subtitle="Name, avatar, rank, and public profile"
                onPress={goToProfile}
                styles={styles}
              />

              <SettingRow
                icon="🌎"
                title={
                  translate(
                    language,
                    "language"
                  ) || "Language"
                }
                subtitle="Choose your app language"
                onPress={goToLanguage}
                styles={styles}
                last
              />
            </Section>

            <Section
              title="Health & Permissions"
              styles={styles}
            >
              <ToggleRow
                icon="👟"
                title="Step Tracking"
                subtitle="Connect walking activity to Legathon Walk"
                value={
                  settings.stepTracking
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "stepTracking",
                    value
                  )
                }
                colors={colors}
                styles={styles}
              />

              <SettingRow
                icon="❤️"
                title="Health Permissions"
                subtitle="Manage Apple Health or Google Fit access"
                onPress={() =>
                  openDeviceSettings(
                    "Health Permissions"
                  )
                }
                styles={styles}
              />

              <SettingRow
                icon="📱"
                title="Device Permissions"
                subtitle="Motion, location, microphone, and notifications"
                onPress={() =>
                  openDeviceSettings(
                    "Device Permissions"
                  )
                }
                styles={styles}
                last
              />
            </Section>

            <Section
              title="Notifications"
              styles={styles}
            >
              <ToggleRow
                icon="🔔"
                title="Push Notifications"
                subtitle="Journey reminders and important updates"
                value={
                  settings.notifications
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "notifications",
                    value
                  )
                }
                colors={colors}
                styles={styles}
              />

              <ToggleRow
                icon="🔥"
                title="Streak Alerts"
                subtitle="Daily walking reminders"
                value={
                  settings.streakAlerts
                }
                disabled={
                  !settings.notifications
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "streakAlerts",
                    value
                  )
                }
                colors={colors}
                styles={styles}
              />

              <ToggleRow
                icon="🏅"
                title="Reward Alerts"
                subtitle="Checkpoint, stamp, badge, and reward updates"
                value={
                  settings.rewardAlerts
                }
                disabled={
                  !settings.notifications
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "rewardAlerts",
                    value
                  )
                }
                colors={colors}
                styles={styles}
                last
              />
            </Section>

            <Section
              title="Privacy"
              styles={styles}
            >
              <ToggleRow
                icon="🔒"
                title="Private Profile"
                subtitle="Hide your public walking stats and leaderboard profile"
                value={
                  settings.privateProfile
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "privateProfile",
                    value
                  )
                }
                colors={colors}
                styles={styles}
              />

              <SettingRow
                icon="🛡️"
                title="Data & Privacy"
                subtitle="Manage your activity and profile data"
                onPress={goToPrivacy}
                styles={styles}
              />

              <SettingRow
                icon="📄"
                title={
                  translate(
                    language,
                    "privacyPolicy"
                  ) ||
                  "Privacy Policy"
                }
                subtitle="Read Legathon Walk's privacy policy"
                onPress={goToPrivacy}
                styles={styles}
                last
              />
            </Section>

            <Section
              title="Appearance"
              styles={styles}
            >
              <ToggleRow
                icon="🌙"
                title="Dark Mode"
                subtitle="Use the premium dark interface"
                value={
                  settings.darkMode
                }
                onValueChange={(
                  value
                ) =>
                  updateSetting(
                    "darkMode",
                    value
                  )
                }
                colors={colors}
                styles={styles}
                last
              />

              <Text
                style={
                  styles.themeLabel
                }
              >
                COLOR THEME
              </Text>

              <View
                style={styles.themeGrid}
              >
                {Object.entries(
                  THEMES
                ).map(
                  ([
                    themeId,
                    theme,
                  ]) => (
                    <ThemePill
                      key={themeId}
                      label={
                        theme.label
                      }
                      color={
                        theme.accent
                      }
                      active={
                        settings.theme ===
                        themeId
                      }
                      onPress={() =>
                        updateSetting(
                          "theme",
                          themeId
                        )
                      }
                      styles={styles}
                    />
                  )
                )}
              </View>
            </Section>

            <Section
              title="Support"
              styles={styles}
            >
              <SettingRow
                icon="❓"
                title="Help Center"
                subtitle="FAQs and app support"
                onPress={
                  goToHelpCenter
                }
                styles={styles}
              />

              <SettingRow
                icon="💬"
                title="Contact Support"
                subtitle="Get help with your account"
                onPress={
                  goToContactSupport
                }
                styles={styles}
              />

              <SettingRow
                icon="ℹ️"
                title="About Legathon Walk"
                subtitle="App version, mission, and credits"
                onPress={goToAbout}
                styles={styles}
                last
              />
            </Section>

            <TouchableOpacity
              style={
                styles.logoutButton
              }
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={
                  styles.logoutText
                }
              >
                Log Out
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.versionText
              }
            >
              LEGATHON WALK • SETTINGS V1
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function Section({
  title,
  children,
  styles,
}) {
  return (
    <View style={styles.section}>
      <Text
        style={styles.sectionTitle}
      >
        {title}
      </Text>

      <View style={styles.divider} />

      {children}
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  styles,
  last = false,
}) {
  const enabled =
    typeof onPress === "function";

  return (
    <TouchableOpacity
      style={[
        styles.row,
        last && styles.rowLast,
        !enabled &&
          styles.rowDisabled,
      ]}
      onPress={onPress}
      disabled={!enabled}
      activeOpacity={0.8}
    >
      <Text style={styles.rowIcon}>
        {icon}
      </Text>

      <View
        style={styles.rowTextWrap}
      >
        <Text
          style={styles.rowTitle}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={
              styles.rowSubtitle
            }
          >
            {subtitle}
          </Text>
        )}
      </View>

      {enabled && (
        <Text
          style={styles.chevron}
        >
          ›
        </Text>
      )}
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  colors,
  styles,
  disabled = false,
  last = false,
}) {
  return (
    <View
      style={[
        styles.row,
        last && styles.rowLast,
        disabled &&
          styles.rowDisabled,
      ]}
    >
      <Text style={styles.rowIcon}>
        {icon}
      </Text>

      <View
        style={styles.rowTextWrap}
      >
        <Text
          style={styles.rowTitle}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={
              styles.rowSubtitle
            }
          >
            {subtitle}
          </Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        disabled={disabled}
        trackColor={{
          false: "#5C6678",
          true: colors.accent,
        }}
        thumbColor="#F6F2E8"
        ios_backgroundColor="#5C6678"
      />
    </View>
  );
}

function ThemePill({
  label,
  color,
  active,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.themePill,
        active &&
          styles.themePillActive,
        active && {
          borderColor: color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.themeDot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text
        style={[
          styles.themeText,
          active &&
            styles.themeTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    loadingScreen: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        colors.background,
    },

    loadingText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginTop: 14,
    },

    background: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    backgroundImage: {
      opacity: 0.26,
    },

    overlay: {
      flex: 1,
      backgroundColor:
        settingsOverlay(colors),
    },

    safe: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 140,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 26,
    },

    backButton: {
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 28,
      paddingVertical: 11,
      paddingHorizontal: 22,
    },

    backText: {
      color: colors.accent,
      fontSize: 20,
      fontWeight: "900",
    },

    saveStatus: {
      minWidth: 70,
      minHeight: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
    },

    saveStatusText: {
      color: colors.secondary,
      fontSize: 12,
      fontWeight: "900",
    },

    kicker: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: "900",
      letterSpacing: 5,
      marginBottom: 12,
    },

    title: {
      color: colors.text,
      fontSize: 46,
      lineHeight: 52,
      fontWeight: "900",
      marginBottom: 26,
    },

    section: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 28,
      padding: 18,
      marginBottom: 20,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 27,
      fontWeight: "900",
      marginBottom: 14,
    },

    divider: {
      height: 1,
      backgroundColor:
        colors.border,
      opacity: 0.7,
      marginBottom: 4,
    },

    row: {
      minHeight: 86,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor:
        colors.border,
    },

    rowLast: {
      borderBottomWidth: 0,
    },

    rowDisabled: {
      opacity: 0.48,
    },

    rowIcon: {
      width: 52,
      fontSize: 29,
      marginRight: 10,
    },

    rowTextWrap: {
      flex: 1,
      paddingRight: 8,
    },

    rowTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "900",
    },

    rowSubtitle: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: "700",
      marginTop: 5,
      lineHeight: 20,
    },

    chevron: {
      color: colors.accent,
      fontSize: 42,
      fontWeight: "900",
      marginLeft: 8,
    },

    themeLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2,
      marginTop: 18,
      marginBottom: 12,
    },

    themeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    themePill: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 24,
      paddingVertical: 11,
      paddingHorizontal: 14,
    },

    themePillActive: {
      backgroundColor:
        colors.background,
    },

    themeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },

    themeText: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: "900",
    },

    themeTextActive: {
      color: colors.text,
    },

    logoutButton: {
      borderWidth: 1.5,
      borderColor: "#FF5A66",
      backgroundColor:
        "rgba(255,0,0,0.12)",
      borderRadius: 28,
      paddingVertical: 18,
      alignItems: "center",
      marginTop: 8,
    },

    logoutText: {
      color: "#FF7B86",
      fontSize: 21,
      fontWeight: "900",
    },

    versionText: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 2,
      textAlign: "center",
      marginTop: 26,
    },
  });
}

function settingsOverlay(colors) {
  return colors.background ===
    "#EEF3F8"
    ? "rgba(238,243,248,0.86)"
    : "rgba(0,0,0,0.68)";
}