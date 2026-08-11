import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SponsorDashboardScreen({
  rewardClaims = [],
  rewardEvents = [],
}) {
  const pendingClaims = rewardClaims.filter((c) => c.status === "pending");
  const approvedClaims = rewardClaims.filter((c) => c.status === "approved");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>SPONSOR DASHBOARD</Text>
      <Text style={styles.title}>Reward Partner Hub</Text>

      <Text style={styles.subtitle}>
        Track reward claims, sponsor campaigns, gift card eligibility, and manual verification.
      </Text>

      <View style={styles.statsRow}>
        <Stat value={pendingClaims.length} label="Pending Claims" />
        <Stat value={approvedClaims.length} label="Approved" />
      </View>

      <View style={styles.statsRow}>
        <Stat value={rewardEvents.length} label="Reward Events" />
        <Stat value="$1,000" label="Grand Prize" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>SPONSOR REWARD TIERS</Text>

        <Tier title="$10 Gift Card" points="2,500 pts" sponsor="Local food / coffee sponsor" />
        <Tier title="$25 Gift Card" points="10,000 pts" sponsor="Retail / wellness sponsor" />
        <Tier title="$100 Reward" points="25,000 pts" sponsor="Travel / fitness sponsor" />
        <Tier title="$250 Sponsor Reward" points="50,000 pts" sponsor="Brand campaign sponsor" />
        <Tier title="$1,000 Legacy Challenge" points="100,000 pts" sponsor="Grand sponsor / verified challenge" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>PENDING CLAIMS</Text>

        {pendingClaims.length === 0 ? (
          <Text style={styles.note}>No pending claims yet.</Text>
        ) : (
          pendingClaims.map((claim) => (
            <View key={claim.id} style={styles.claimCard}>
              <Text style={styles.claimTitle}>{claim.reward_title}</Text>
              <Text style={styles.claimText}>
                {claim.cash_value} • {claim.points_required?.toLocaleString?.() || claim.points_required} points
              </Text>
              <Text style={styles.status}>Status: {claim.status}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveButton}>
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>SPONSOR NOTES</Text>

        <Text style={styles.note}>
          Rewards should remain “eligibility pending verification” until an admin confirms the walk data,
          account identity, reward tier, and fraud review status.
        </Text>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Tier({ title, points, sponsor }) {
  return (
    <View style={styles.tierCard}>
      <Text style={styles.tierTitle}>{title}</Text>
      <Text style={styles.tierText}>{points}</Text>
      <Text style={styles.tierSponsor}>{sponsor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070C" },
  content: { padding: 18, paddingBottom: 130 },

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
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
    marginBottom: 22,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#10151F",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  statLabel: {
    color: "#8C97A8",
    marginTop: 8,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#10151F",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1F2A3D",
  },

  cardLabel: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  tierCard: {
    backgroundColor: "#131C2B",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  tierTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  tierText: {
    color: "#A6FFD2",
    marginTop: 6,
    fontWeight: "900",
  },

  tierSponsor: {
    color: "#8C97A8",
    marginTop: 6,
  },

  claimCard: {
    backgroundColor: "#131C2B",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  claimTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  claimText: {
    color: "#A8B3C2",
    marginTop: 7,
  },

  status: {
    color: "#FFD700",
    marginTop: 7,
    fontWeight: "900",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  approveButton: {
    flex: 1,
    backgroundColor: "#A6FFD2",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  approveText: {
    color: "#04110A",
    fontWeight: "900",
  },

  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  rejectText: {
    color: "#FF6B6B",
    fontWeight: "900",
  },

  note: {
    color: "#A8B3C2",
    lineHeight: 23,
  },
});