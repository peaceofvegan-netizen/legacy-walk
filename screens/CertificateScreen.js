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

const posts = [
  {
    name: "Phillip",
    badge: "Master Explorer",
    action: "reached the Edmund Pettus Bridge checkpoint",
    journey: "Selma Freedom Walk",
    likes: 128,
    comments: 24,
    icon: "🏆",
  },
  {
    name: "Maya",
    badge: "Legacy Walker",
    action: "completed the Great Wall Trek",
    journey: "Great Wall",
    likes: 211,
    comments: 41,
    icon: "🛂",
  },
  {
    name: "Dre",
    badge: "Explorer",
    action: "earned a Roman Empire passport stamp",
    journey: "Roman Empire",
    likes: 89,
    comments: 12,
    icon: "🏛️",
  },
];

const groups = [
  { title: "Civil Rights Walkers", members: "12.4K", icon: "✊" },
  { title: "World Wonders Club", members: "9.8K", icon: "🌍" },
  { title: "Daily Streak Crew", members: "18.1K", icon: "🔥" },
];

export default function CommunityScreen({ goBack }) {
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

            <Text style={styles.kicker}>LEGACY COMMUNITY</Text>
            <Text style={styles.title}>Walk Together</Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>COMMUNITY STREAK</Text>
              <Text style={styles.heroNumber}>2.4M</Text>
              <Text style={styles.heroText}>steps walked by the community today</Text>
            </View>

            <View style={styles.inviteCard}>
              <Text style={styles.inviteTitle}>Invite Friends</Text>
              <Text style={styles.inviteText}>
                Build your walking circle, compete on leaderboards, and unlock
                group journey rewards together.
              </Text>

              <TouchableOpacity style={styles.inviteButton}>
                <Text style={styles.inviteButtonText}>Invite Walkers</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Community Feed</Text>

            {posts.map((post, index) => (
              <View key={`${post.name}-${index}`} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.postName}>{post.name}</Text>
                    <Text style={styles.postBadge}>{post.badge}</Text>
                  </View>
                </View>

                <Text style={styles.postText}>
                  {post.action} on{" "}
                  <Text style={styles.postJourney}>{post.journey}</Text>.
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>❤️ {post.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>💬 {post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>↗ Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.groupSection}>
              <Text style={styles.sectionTitle}>Journey Clubs</Text>

              {groups.map((group) => (
                <View key={group.title} style={styles.groupCard}>
                  <Text style={styles.groupIcon}>{group.icon}</Text>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    <Text style={styles.groupMembers}>{group.members} members</Text>
                  </View>

                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinText}>Join</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.featuredCard}>
              <Text style={styles.featuredLabel}>FEATURED WALKER</Text>
              <Text style={styles.featuredName}>Maya</Text>
              <Text style={styles.featuredText}>
                Completed 3 journeys this month and earned 8 passport stamps.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
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
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.3)",
    marginBottom: 24,
  },
  heroLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  heroNumber: {
    color: "#FFFFFF",
    fontSize: 62,
    fontWeight: "900",
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
  },

  inviteCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 26,
  },
  inviteTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  inviteText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  inviteButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 22,
  },
  inviteButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  postCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 18,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#020617",
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 28,
  },
  postName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  postBadge: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },
  postText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
  },
  postJourney: {
    color: "#D4AF37",
    fontWeight: "900",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    backgroundColor: "rgba(2,6,23,0.72)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  groupSection: {
    marginTop: 10,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.2)",
    marginBottom: 14,
  },
  groupIcon: {
    fontSize: 34,
    width: 52,
  },
  groupTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },
  groupMembers: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  joinText: {
    color: "#020617",
    fontSize: 15,
    fontWeight: "900",
  },

  featuredCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginTop: 18,
    marginBottom: 40,
  },
  featuredLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  featuredName: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  featuredText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
});