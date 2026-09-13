import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import useLegathonPoints from
  "../hooks/useLegathonPoints";

function safeNumber(value) {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

function formatNumber(value) {
  return Math.floor(
    safeNumber(value)
  ).toLocaleString();
}

async function loadLocalRecord() {
  const [
    displayName,
    avatarProfileRaw,
    completedRaw,
    lifetimeSteps,
  ] = await Promise.all([
    AsyncStorage.getItem("displayName"),
    AsyncStorage.getItem("avatarProfile"),
    AsyncStorage.getItem("completedJourneys"),
    getJourneyLifetimeSteps(),
  ]);

  let avatarProfile = {};

  try {
    avatarProfile = avatarProfileRaw
      ? JSON.parse(avatarProfileRaw)
      : {};
  } catch {
    avatarProfile = {};
  }

  return {
    name:
      displayName ||
      avatarProfile?.name ||
      "Legathon Walker",

    steps: safeNumber(lifetimeSteps),

    journeys: safeNumber(completedRaw),
  };
}

export default function HallOfLegendsScreen({
  goBack,
}) {
  const {
    points,
    rank,
    loading,
    error,
    refresh,
  } = useLegathonPoints();

  const [record, setRecord] = useState({
    name: "Legathon Walker",
    steps: 0,
    journeys: 0,
  });

  const [refreshing, setRefreshing] =
    useState(false);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);

    try {
      const [, nextRecord] =
        await Promise.all([
          refresh(),
          loadLocalRecord(),
        ]);

      setRecord(nextRecord);
    } catch (refreshError) {
      console.log(
        "Hall of Legends refresh error:",
        refreshError
      );
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  useEffect(() => {
    loadLocalRecord()
      .then(setRecord)
      .catch((loadError) => {
        console.log(
          "Hall of Legends load error:",
          loadError
        );
      });
  }, []);

  const progress = Math.max(
    0,
    Math.min(
      100,
      safeNumber(rank?.progress)
    )
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            tintColor="#F5C542"
            colors={["#F5C542"]}
          />
        }
      >
        <View style={styles.topRow}>
          {typeof goBack === "function" ? (
            <TouchableOpacity
              onPress={goBack}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>
                ‹ Back
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <View style={styles.livePill}>
            <Text style={styles.liveText}>
              LIVE RECORD
            </Text>
          </View>
        </View>

        <Text style={styles.kicker}>
          HALL OF LEGENDS
        </Text>

        <Text style={styles.title}>
          Your legacy is being built.
        </Text>

        <Text style={styles.subtitle}>
          Every verified reward adds to your
          Legathon Points record.
        </Text>

        {error ? (
          <Text
            style={styles.error}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}

        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>
            {rank?.badge || "🥾"}
          </Text>

          <Text style={styles.heroLabel}>
            CURRENT RANK
          </Text>

          <Text style={styles.heroName}>
            {rank?.currentRank || "New Walker"}
          </Text>

          <Text
            style={styles.memberName}
            numberOfLines={1}
          >
            {record.name}
          </Text>

          <Text
            style={styles.points}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {loading
              ? "—"
              : formatNumber(points)}
          </Text>

          <Text style={styles.pointsLabel}>
            LEGATHON POINTS
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {progress}% complete
            </Text>

            <Text style={styles.progressText}>
              {rank?.nextRank === "MAX"
                ? "Highest rank"
                : `Next: ${
                    rank?.nextRank ||
                    "Explorer"
                  }`}
            </Text>
          </View>

          {rank?.nextRank !== "MAX" && (
            <Text style={styles.remaining}>
              {formatNumber(
                rank?.pointsRemaining
              )}{" "}
              points remaining
            </Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Journey Steps"
            value={formatNumber(record.steps)}
          />

          <StatCard
            label="Miles"
            value={(
              record.steps / 2000
            ).toFixed(1)}
          />
        </View>

        <View style={styles.wideCard}>
          <Text style={styles.statLabel}>
            COMPLETED JOURNEYS
          </Text>

          <Text style={styles.wideValue}>
            {formatNumber(record.journeys)}
          </Text>
        </View>

        <View style={styles.communityCard}>
          <Text style={styles.kicker}>
            GLOBAL HALL
          </Text>

          <Text style={styles.sectionTitle}>
            Community rankings
          </Text>

          <Text style={styles.subtitle}>
            No shared member leaderboard is
            connected yet. Global names and
            positions will appear here after
            member records are synced through
            your database.
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              Your global position
            </Text>

            <Text style={styles.statusValue}>
              Pending
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.refreshButton,
            refreshing &&
              styles.refreshButtonDisabled,
          ]}
          onPress={refreshAll}
          disabled={refreshing}
          accessibilityRole="button"
          accessibilityState={{
            disabled: refreshing,
          }}
        >
          <Text style={styles.refreshText}>
            {refreshing
              ? "Refreshing…"
              : "Refresh My Record"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
}) {
  return (
    <View style={styles.statCard}>
      <Text
        style={styles.statValue}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#030812",
  },

  content: {
    padding: 22,
    paddingBottom: 145,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  back: {
    borderWidth: 1,
    borderColor: "#8B7029",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 19,
  },

  backText: {
    color: "#F5C542",
    fontSize: 17,
    fontWeight: "900",
  },

  livePill: {
    backgroundColor: "#102D28",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  liveText: {
    color: "#81F1D0",
    fontSize: 10,
    letterSpacing: 1.3,
    fontWeight: "900",
  },

  kicker: {
    color: "#F5C542",
    fontSize: 12,
    letterSpacing: 2.3,
    fontWeight: "900",
    marginBottom: 9,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#A8B5C9",
    fontSize: 15,
    lineHeight: 23,
  },

  error: {
    color: "#FFD0D0",
    backgroundColor: "#351C28",
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
  },

  heroCard: {
    backgroundColor: "#15191C",
    borderWidth: 1.5,
    borderColor: "#947725",
    borderRadius: 30,
    alignItems: "center",
    padding: 25,
    marginTop: 25,
    marginBottom: 16,
  },

  heroBadge: {
    fontSize: 44,
    marginBottom: 7,
  },

  heroLabel: {
    color: "#F5C542",
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: "900",
  },

  heroName: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 7,
    textAlign: "center",
  },

  memberName: {
    color: "#81F1D0",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
    maxWidth: "90%",
  },

  points: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
    marginTop: 22,
    width: "100%",
    textAlign: "center",
  },

  pointsLabel: {
    color: "#F5C542",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "900",
  },

  progressTrack: {
    width: "100%",
    height: 10,
    backgroundColor: "#29364A",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 24,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#F5C542",
    borderRadius: 5,
  },

  progressRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  progressText: {
    color: "#A8B5C9",
    fontSize: 12,
    fontWeight: "700",
  },

  remaining: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 13,
  },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: -6,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#0B1727",
    borderWidth: 1,
    borderColor: "#263D59",
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 6,
    marginBottom: 12,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 7,
  },

  statLabel: {
    color: "#91A1B8",
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  wideCard: {
    backgroundColor: "#0B1727",
    borderWidth: 1,
    borderColor: "#263D59",
    borderRadius: 22,
    padding: 19,
    marginBottom: 18,
  },

  wideValue: {
    color: "#81F1D0",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  communityCard: {
    backgroundColor: "#0B1727",
    borderWidth: 1,
    borderColor: "#564923",
    borderRadius: 26,
    padding: 22,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 9,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#263D59",
    marginTop: 18,
    paddingTop: 16,
  },

  statusLabel: {
    color: "#C5D0E0",
    fontSize: 14,
    fontWeight: "700",
  },

  statusValue: {
    color: "#F5C542",
    fontSize: 14,
    fontWeight: "900",
  },

  refreshButton: {
    backgroundColor: "#F5C542",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 17,
  },

  refreshButtonDisabled: {
    opacity: 0.65,
  },

  refreshText: {
    color: "#06101D",
    fontSize: 16,
    fontWeight: "900",
  },
});