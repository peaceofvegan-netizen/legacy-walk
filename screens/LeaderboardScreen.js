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
  Image,
  RefreshControl,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getEquippedAvatar,
} from "../utils/avatarInventoryStorage";

import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import {
  LEGATHON_RANKS,
} from "../utils/legathonRankSystem";

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

async function loadMemberRecord() {
  const [
    avatar,
    displayName,
    avatarProfileRaw,
    steps,
    completed,
    stamps,
    streak,
  ] = await Promise.all([
    getEquippedAvatar(),
    AsyncStorage.getItem("displayName"),
    AsyncStorage.getItem("avatarProfile"),
    getJourneyLifetimeSteps(),
    AsyncStorage.getItem("completedJourneys"),
    AsyncStorage.getItem("passportStamps"),
    AsyncStorage.getItem("walkingStreak"),
  ]);

  let profile = {};

  try {
    profile = avatarProfileRaw
      ? JSON.parse(avatarProfileRaw)
      : {};
  } catch {
    profile = {};
  }

  return {
    avatar,

    name:
      displayName ||
      profile?.name ||
      avatar?.name ||
      "Legathon Walker",

    steps: safeNumber(steps),

    completed: safeNumber(completed),

    stamps: safeNumber(stamps),

    streak: safeNumber(streak),
  };
}

export default function LeaderboardScreen({
  goBack,
}) {
  const {
    points,
    rank,
    loading,
    error,
    refresh,
  } = useLegathonPoints();

  const [member, setMember] = useState({
    avatar: null,
    name: "Legathon Walker",
    steps: 0,
    completed: 0,
    stamps: 0,
    streak: 0,
  });

  const [refreshing, setRefreshing] =
    useState(false);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);

    try {
      const [, nextMember] =
        await Promise.all([
          refresh(),
          loadMemberRecord(),
        ]);

      setMember(nextMember);
    } catch (refreshError) {
      console.log(
        "Leaderboard refresh error:",
        refreshError
      );
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  useEffect(() => {
    loadMemberRecord()
      .then(setMember)
      .catch((loadError) => {
        console.log(
          "Leaderboard member load error:",
          loadError
        );
      });
  }, []);

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
        {typeof goBack === "function" && (
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
        )}

        <Text style={styles.kicker}>
          LEGATHON WALK
        </Text>

        <Text style={styles.title}>
          Leaderboard
        </Text>

        <Text style={styles.subtitle}>
          Build your rank through earned
          Legathon Points.
        </Text>

        {error ? (
          <Text
            style={styles.error}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}

        <View style={styles.profileCard}>
          <View style={styles.avatarFrame}>
            {member.avatar?.image ? (
              <Image
                source={member.avatar.image}
                style={styles.avatar}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.fallback}>
                👤
              </Text>
            )}
          </View>

          <View style={styles.profileText}>
            <Text style={styles.you}>
              YOUR RECORD
            </Text>

            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {member.name}
            </Text>

            <Text style={styles.rank}>
              {rank?.badge || "🥾"}{" "}
              {rank?.currentRank ||
                "New Walker"}
            </Text>
          </View>

          <View style={styles.pointsPill}>
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
              POINTS
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <MiniStat
            value={formatNumber(member.steps)}
            label="Journey Steps"
          />

          <MiniStat
            value={formatNumber(
              member.completed
            )}
            label="Journeys"
          />
        </View>

        <View style={styles.statsRow}>
          <MiniStat
            value={formatNumber(member.stamps)}
            label="Passport Stamps"
          />

          <MiniStat
            value={formatNumber(member.streak)}
            label="Walking Streak"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>
            GLOBAL STANDINGS
          </Text>

          <Text style={styles.sectionTitle}>
            Community ranking
          </Text>

          <Text style={styles.subtitle}>
            No shared member leaderboard is
            connected yet. Fake walkers and
            fixed positions have been removed.
          </Text>

          <View style={styles.pendingRow}>
            <Text style={styles.pendingLabel}>
              Your global rank
            </Text>

            <Text style={styles.pending}>
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>
            RANK PATH
          </Text>

          <Text style={styles.sectionTitle}>
            Legathon levels
          </Text>

          {LEGATHON_RANKS.map((level) => {
            const isCurrent =
              level.title ===
              rank?.currentRank;

            const reached =
              points >= level.minPoints;

            return (
              <View
                key={level.id}
                style={[
                  styles.levelRow,
                  isCurrent &&
                    styles.currentLevel,
                ]}
              >
                <Text style={styles.levelBadge}>
                  {level.badge}
                </Text>

                <View style={styles.levelInfo}>
                  <Text
                    style={[
                      styles.levelName,
                      isCurrent && {
                        color: level.color,
                      },
                    ]}
                  >
                    {level.title}
                  </Text>

                  <Text
                    style={styles.levelMinimum}
                  >
                    {formatNumber(
                      level.minPoints
                    )}{" "}
                    points
                  </Text>
                </View>

                <Text
                  style={[
                    styles.levelStatus,
                    reached &&
                      styles.reached,
                  ]}
                >
                  {isCurrent
                    ? "CURRENT"
                    : reached
                      ? "REACHED"
                      : "LOCKED"}
                </Text>
              </View>
            );
          })}
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
              : "Refresh Leaderboard"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({
  value,
  label,
}) {
  return (
    <View style={styles.miniStat}>
      <Text
        style={styles.miniValue}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>

      <Text style={styles.miniLabel}>
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

  back: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#8B7029",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 19,
    marginBottom: 28,
  },

  backText: {
    color: "#F5C542",
    fontSize: 17,
    fontWeight: "900",
  },

  kicker: {
    color: "#F5C542",
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: "900",
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 8,
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

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15191C",
    borderWidth: 1.5,
    borderColor: "#947725",
    borderRadius: 27,
    padding: 17,
    marginTop: 24,
    marginBottom: 14,
  },

  avatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 21,
    backgroundColor: "#091526",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatar: {
    width: 66,
    height: 66,
  },

  fallback: {
    fontSize: 33,
  },

  profileText: {
    flex: 1,
    paddingHorizontal: 13,
  },

  you: {
    color: "#F5C542",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "900",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 4,
  },

  rank: {
    color: "#81F1D0",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },

  pointsPill: {
    minWidth: 76,
    maxWidth: 105,
    alignItems: "flex-end",
  },

  points: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    width: "100%",
    textAlign: "right",
  },

  pointsLabel: {
    color: "#91A1B8",
    fontSize: 8,
    letterSpacing: 1.2,
    fontWeight: "900",
  },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: -6,
  },

  miniStat: {
    flex: 1,
    backgroundColor: "#0B1727",
    borderWidth: 1,
    borderColor: "#263D59",
    borderRadius: 20,
    padding: 17,
    margin: 6,
  },

  miniValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  miniLabel: {
    color: "#91A1B8",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#0B1727",
    borderWidth: 1,
    borderColor: "#263D59",
    borderRadius: 25,
    padding: 21,
    marginTop: 10,
    marginBottom: 8,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 9,
  },

  pendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#263D59",
    paddingTop: 16,
    marginTop: 18,
  },

  pendingLabel: {
    color: "#C5D0E0",
    fontSize: 14,
    fontWeight: "700",
  },

  pending: {
    color: "#F5C542",
    fontSize: 14,
    fontWeight: "900",
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07111F",
    borderRadius: 16,
    padding: 13,
    marginTop: 9,
    borderWidth: 1,
    borderColor: "transparent",
  },

  currentLevel: {
    borderColor: "#F5C542",
    backgroundColor: "#171A1B",
  },

  levelBadge: {
    width: 37,
    fontSize: 23,
  },

  levelInfo: {
    flex: 1,
  },

  levelName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  levelMinimum: {
    color: "#8392A9",
    fontSize: 11,
    marginTop: 3,
  },

  levelStatus: {
    color: "#65748A",
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "900",
  },

  reached: {
    color: "#81F1D0",
  },

  refreshButton: {
    backgroundColor: "#F5C542",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 17,
    marginTop: 10,
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