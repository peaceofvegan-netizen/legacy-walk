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
import { translate } from "../i18n/i18n";
const LEGACY_BG = require("../assets/collage-background.png");

const notifications = [
  {
    id: 1,
    icon: "📍",
    title: "Checkpoint Reached",
    message: "You reached Brown Chapel on the Selma Freedom Walk.",
    time: "Just now",
    type: "Journey",
    unread: true,
  },
  {
    id: 2,
    icon: "🛂",
    title: "Passport Stamp Earned",
    message: "A new Selma stamp was added to your Legacy Passport.",
    time: "12 min ago",
    type: "Passport",
    unread: true,
  },
  {
    id: 3,
    icon: "🪙",
    title: "W Coins Added",
    message: "+50 W Coins earned from your daily challenge.",
    time: "1 hr ago",
    type: "Rewards",
    unread: false,
  },
  {
    id: 4,
    icon: "🔥",
    title: "Streak Protected",
    message: "Your 7-day Legacy streak is still alive.",
    time: "Today",
    type: "Challenge",
    unread: false,
  },
  {
    id: 5,
    icon: "👑",
    title: "Leaderboard Update",
    message: "You moved into the Top 3 on the Hall of Legends.",
    time: "Yesterday",
    type: "Community",
    unread: false,
  },
];

export default function NotificationSettingsScreen({
  language = "en",
  goBack,
}) {
  const [filter, setFilter] = useState("All");

  

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((item) => item.type === filter);

  const unreadCount = notifications.filter((item) => item.unread).length;

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
<Text style={styles.kicker}>
  {translate(language, "notifications")}
</Text>

<Text style={styles.title}>
  {translate(language, "notificationSettings")}
</Text>
           

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
  {translate(language, "unreadAlerts")}
</Text>
              <Text style={styles.summaryNumber}>{unreadCount}</Text>
              <Text style={styles.summaryText}>
                {translate(language, "notificationSummary")}
              </Text>
            </View>

            <View style={styles.filterRow}>
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                    onPress={() => setFilter(item)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>
  {translate(language, "recentActivity")}
</Text>

              {filteredNotifications.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    item.unread && styles.notificationUnread,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <Text style={styles.notificationIcon}>{item.icon}</Text>
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTop}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>

                      {item.unread && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.notificationMessage}>{item.message}</Text>

                    <View style={styles.notificationFooter}>
                      <Text style={styles.notificationType}>{item.type}</Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
          

            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>ALERT SETTINGS</Text>
              <Text style={styles.settingsTitle}>Choose What You Hear About</Text>

              <AlertRow icon="📍" text="Journey milestone alerts" />
              <AlertRow icon="🛂" text="Passport stamp unlocks" />
              <AlertRow icon="🪙" text="W Coin reward updates" />
              <AlertRow icon="🔥" text="Daily challenge reminders" />
              <AlertRow icon="🌎" text="Friend and community activity" />
            </View>

            <View style={styles.plusCard}>
              <Text style={styles.plusLabel}>LEGACY PLUS</Text>
              <Text style={styles.plusTitle}>Premium Unlock Alerts</Text>
              <Text style={styles.plusText}>
                Legacy Plus members receive early alerts for new journeys,
                limited passport frames, premium drops, and exclusive rewards.
              </Text>

              <TouchableOpacity style={styles.plusButton}>
                <Text style={styles.plusButtonText}>View Legacy Plus</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function AlertRow({ icon, text }) {
  return (
    <View style={styles.alertRow}>
      <Text style={styles.alertIcon}>{icon}</Text>
      <Text style={styles.alertText}>{text}</Text>
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

  summaryCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 24,
  },
  summaryLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
  },
  summaryText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 8,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  filterPill: {
    backgroundColor: "rgba(8,18,37,0.86)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.22)",
  },
  filterPillActive: {
    backgroundColor: "#D4AF37",
    borderColor: "#D4AF37",
  },
  filterText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "900",
  },
  filterTextActive: {
    color: "#020617",
  },

  sectionCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  notificationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    marginBottom: 12,
  },
  notificationUnread: {
    borderColor: "rgba(212,175,55,0.55)",
    backgroundColor: "rgba(212,175,55,0.09)",
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#020617",
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  notificationIcon: {
    fontSize: 26,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A7F3D0",
    marginLeft: 8,
  },
  notificationMessage: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 6,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  notificationType: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
  },
  notificationTime: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "800",
  },

  settingsCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },
  settingsLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  settingsTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 14,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  alertIcon: {
    fontSize: 28,
    width: 46,
  },
  alertText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
  },

  plusCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 40,
  },
  plusLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  plusTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  plusText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  plusButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 22,
  },
  plusButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
});