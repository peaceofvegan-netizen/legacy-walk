import React, { useMemo } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateJourneySteps,getJourneyById,} from "../data/journeyCatalog";
import JOURNEY_REWARDS from "../utils/journeyRewards";
const FALLBACK_ROUTE = require("../assets/routes/selma.png");

const COLORS = {
  background: "#040A14",
  surface: "#08162A",
  surfaceLight: "#0E1E35",
  border: "#24405F",
  white: "#FFFFFF",
  textSecondary: "#A9B6CA",
  gold: "#F7C948",
  goldLight: "#FFD877",
  mint: "#8FF6D0",
  teal: "#16D8C4",
  blue: "#3B82F6",
  purple: "#A78BFA",
  red: "#FF5A6A",
  green: "#45F18B",
  muted: "#6F8198",
  black: "#020611",
};



const normalizePlan = (plan) =>
  String(plan || "free")
    .trim()
    .toLowerCase();

const normalizeAccessLevel = (journey) => {
  if (journey?.accessLevel) {
    return String(journey.accessLevel).toLowerCase();
  }

  if (journey?.elite === true) {
    return "elite";
  }

  if (journey?.premium === true) {
    return "premium";
  }

  return "free";
};

const canAccessJourney = (journey, plan) => {
  const requiredPlan = normalizeAccessLevel(journey);
  const currentPlan = normalizePlan(plan);

  if (requiredPlan === "free") {
    return true;
  }

  if (
    requiredPlan === "premium" &&
    (currentPlan === "premium" || currentPlan === "elite")
  ) {
    return true;
  }

  if (requiredPlan === "elite" && currentPlan === "elite") {
    return true;
  }

  return false;
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString();

const getRewardWCoins = (journey, subscriptionPlan) => {
  const plan = normalizePlan(subscriptionPlan);

  if (plan === "elite") {
    return Number(journey?.eliteWCoins || 0);
  }

  if (plan === "premium") {
    return Number(journey?.premiumWCoins || 0);
  }

  return Number(journey?.freeWCoins || 0);
};

const getLockedButtonText = (journey) => {
  const accessLevel = normalizeAccessLevel(journey);

  if (accessLevel === "elite") {
    return "Unlock with Elite";
  }

  return "Unlock with Premium";
};

function HeaderButton({ icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.headerButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name={icon} size={26} color={COLORS.white} />
    </TouchableOpacity>
  );
}

function Stat({ label, value, icon, color = COLORS.white }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTopRow}>
        <Ionicons name={icon} size={19} color={color} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>

      <Text style={[styles.statValue, { color }]}>
        {value}
      </Text>
    </View>
  );
}

function RewardItem({
  icon,
  label,
  value,
  valueColor = COLORS.white,
  subtitle,
}) {
  return (
    <View style={styles.rewardItem}>
      <View style={styles.rewardIconBox}>
        <Text style={styles.rewardIcon}>{icon}</Text>
      </View>

      <View style={styles.rewardTextWrap}>
        <Text style={styles.rewardLabel}>{label}</Text>

        <Text
          style={[
            styles.rewardValue,
            {
              color: valueColor,
            },
          ]}
        >
          {value}
        </Text>

        {!!subtitle && (
          <Text style={styles.rewardSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

function AccessBadge({ accessLevel }) {
  const config = {
    free: {
      label: "FREE",
      icon: "checkmark-circle",
      backgroundColor: COLORS.mint,
      color: COLORS.black,
    },

    premium: {
      label: "PREMIUM",
      icon: "star",
      backgroundColor: COLORS.gold,
      color: COLORS.black,
    },

    elite: {
      label: "ELITE",
      icon: "diamond",
      backgroundColor: COLORS.purple,
      color: COLORS.black,
    },
  };

  const current = config[accessLevel] || config.free;

  return (
    <View
      style={[
        styles.accessBadge,
        {
          backgroundColor: current.backgroundColor,
        },
      ]}
    >
      <Ionicons
        name={current.icon}
        size={15}
        color={current.color}
      />

      <Text
        style={[
          styles.accessBadgeText,
          {
            color: current.color,
          },
        ]}
      >
        {current.label}
      </Text>
    </View>
  );
}

function ProgressPreview({ checkpoints = 5 }) {
  const safeCheckpointCount = Math.max(
    1,
    Number(checkpoints || 5)
  );

  return (
    <View style={styles.progressPreview}>
      {Array.from(
        {
          length: safeCheckpointCount,
        },
        (_, index) => {
          const checkpointNumber = index + 1;
          const isFinish =
            checkpointNumber === safeCheckpointCount;

          return (
            <React.Fragment key={checkpointNumber}>
              <View
                style={[
                  styles.checkpointCircle,
                  isFinish && styles.finishCheckpoint,
                ]}
              >
                {isFinish ? (
                  <Ionicons
                    name="flag"
                    size={18}
                    color={COLORS.black}
                  />
                ) : (
                  <Text style={styles.checkpointNumber}>
                    {checkpointNumber}
                  </Text>
                )}
              </View>

              {!isFinish && <View style={styles.checkpointLine} />}
            </React.Fragment>
          );
        }
      )}
    </View>
  );
}

export default function JourneyDetailScreen({
  route,
  navigation,

  journey: journeyProp,
  subscriptionPlan: subscriptionPlanProp = "free",
  lifetimeSteps = 0,

  goBack,
  startJourney,
  goToSubscription,
  goToStory,
}) {
  const routeJourney = route?.params?.journey;
  const routeJourneyId = route?.params?.journeyId;

  const journey = useMemo(() => {
    if (routeJourney) {
      return routeJourney;
    }

    if (journeyProp) {
      return journeyProp;
    }

    if (routeJourneyId) {
      return getJourneyById(routeJourneyId);
    }

    return null;
  }, [routeJourney, journeyProp, routeJourneyId]);
const journeyId =
  journey?.id ||
  journey?.journeyId ||
  journey?.routeKey ||
  journey?.slug ||
  routeJourneyId ||
  "great-wall-of-china";

const normalizedJourneyId = String(journeyId || "")
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, "-")
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-");

const journeyReward =
  JOURNEY_REWARDS[normalizedJourneyId] ||
  JOURNEY_REWARDS["great-wall-of-china"] ||
  null;

  const subscriptionPlan =
    route?.params?.subscriptionPlan ??
    subscriptionPlanProp ??
    "free";

  const miles = Number(journey?.miles || 0);

  const steps =
    Number(journey?.steps) ||
    calculateJourneySteps(miles);

  const difficulty =
    journey?.difficulty || "Easy";

  const estimatedTime =
    journey?.estimatedTime || "Up to 1 week";

  const badge =
    journey?.rank ||
    journey?.badge ||
    "Explorer";

  const legacyPoints =
    Number(journey?.rewardPoints || 0);

  const xpReward =
    Number(journey?.xpReward || 0);

  const wCoinReward =
    getRewardWCoins(journey, subscriptionPlan);

  const accessLevel =
    normalizeAccessLevel(journey);

  const userCanStart =
    canAccessJourney(journey, subscriptionPlan);

  const checkpoints =
    Number(journey?.checkpoints || 5);

  const imageSource =
    journey?.image || FALLBACK_ROUTE;

  const currentPlanLabel =
    normalizePlan(subscriptionPlan);

  const rewardPlanLabel =
    currentPlanLabel === "elite"
      ? "Elite mileage reward"
      : currentPlanLabel === "premium"
      ? "Premium mileage reward"
      : "Free merchandise reward";

  const handleBack = () => {
    if (typeof goBack === "function") {
      goBack();
      return;
    }

    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleOpenStory = () => {
    if (typeof goToStory === "function") {
      goToStory(journey);
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate("JourneyStory", {
        journeyId: journey?.id,
        journey,
      });
    }
  };

  const handleSubscription = () => {
    if (typeof goToSubscription === "function") {
      goToSubscription(journey);
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate("Subscription", {
        requiredPlan: accessLevel,
        journeyId: journey?.id,
        journeyTitle: journey?.title,
      });
    }
  };

const handleStartJourney = async () => {
    if (!userCanStart) {
      handleSubscription();
      return;
    }

    if (typeof startJourney === "function") {
      startJourney(journey);
      return;
    }

   if (navigation?.navigate) {

  await AsyncStorage.setItem(
    "activeJourney",
    JSON.stringify(journey)
  );

  navigation.navigate("GPSJourneyMap", {
    journeyId: journey?.id,
    journey,
  });
}
  };

  if (!journey) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="map-outline"
            size={58}
            color={COLORS.gold}
          />

          <Text style={styles.emptyTitle}>
            Journey Not Found
          </Text>

          <Text style={styles.emptyText}>
            This journey could not be loaded from the catalog.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleBack}
          >
            <Text style={styles.emptyButtonText}>
              Return to Journeys
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={imageSource}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(2,6,17,0.54)",
            "rgba(2,6,17,0.88)",
            COLORS.background,
          ]}
          locations={[0, 0.34, 0.67]}
          style={styles.overlay}
        >
          <View style={styles.header}>
            <HeaderButton
              icon="chevron-back"
              onPress={handleBack}
            />

            <View style={styles.headerCenter}>
              <Text style={styles.headerEyebrow}>
                LEGACY WALK
              </Text>

              <Text style={styles.headerTitle}>
                Journey Details
              </Text>
            </View>

            <HeaderButton
              icon="bookmark-outline"
              onPress={() => {}}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroCard}>
              <Image
                source={imageSource}
                style={styles.heroImage}
                resizeMode="cover"
              />

              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(2,6,17,0.54)",
                  COLORS.surface,
                ]}
                style={styles.heroImageOverlay}
              />

              <AccessBadge accessLevel={accessLevel} />

              <View style={styles.heroContent}>
                <Text style={styles.categoryText}>
                  {String(
                    journey?.category || "Legathon Journey"
                  ).toUpperCase()}
                </Text>

                <Text style={styles.journeyTitle}>
                  {journey?.title || "Legathon Journey"}
                </Text>

                <Text style={styles.locationText}>
                  {journey?.location ||
                    journey?.country ||
                    "Worldwide"}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <Stat
                label="Distance"
                value={`${formatNumber(miles)} mi`}
                icon="map-outline"
                color={COLORS.mint}
              />

              <Stat
                label="Steps"
                value={formatNumber(steps)}
                icon="footsteps-outline"
                color={COLORS.blue}
              />

              <Stat
                label="Difficulty"
                value={difficulty}
                icon="speedometer-outline"
                color={COLORS.gold}
              />

              <Stat
                label="Estimated Time"
                value={estimatedTime}
                icon="time-outline"
                color={COLORS.purple}
              />
            </View>

            <LinearGradient
              colors={[
                "rgba(15,34,58,0.97)",
                "rgba(7,20,39,0.98)",
              ]}
              style={styles.overviewCard}
            >
              <Text style={styles.sectionEyebrow}>
                JOURNEY OVERVIEW
              </Text>

              <Text style={styles.sectionTitle}>
                Walk Through History
              </Text>

              <Text style={styles.overviewText}>
                {journey?.subtitle ||
                  "Complete this Legathon Walk journey using the five-checkpoint route. Each checkpoint unlocks history, narration, progress, and a new milestone."}
              </Text>

              <TouchableOpacity
                style={styles.storyButton}
                activeOpacity={0.85}
                onPress={handleOpenStory}
              >
                <Ionicons
                  name="book-outline"
                  size={21}
                  color={COLORS.mint}
                />

                <Text style={styles.storyButtonText}>
                  Read Journey Story
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.mint}
                />
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={[
                "rgba(47,38,8,0.96)",
                "rgba(12,25,43,0.98)",
              ]}
              style={styles.rewardsCard}
            >
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.rewardsEyebrow}>
                    JOURNEY REWARDS
                  </Text>

                  <Text style={styles.rewardsTitle}>
                    Complete to Earn
                  </Text>
                </View>

                <Ionicons
                  name="trophy"
                  size={39}
                  color={COLORS.gold}
                />
              </View>

              <View style={styles.rewardsList}>
                <RewardItem
                  icon="🪙"
                  label="WCoins"
                  value={`${formatNumber(
                    wCoinReward
                  )} WCoins`}
                  valueColor={COLORS.gold}
                  subtitle={rewardPlanLabel}
                />

                <RewardItem
                  icon="⭐"
                  label="Legathon Points"
                  value={`${formatNumber(
                    legacyPoints
                  )} Points`}
                  valueColor={COLORS.mint}
                  subtitle="Avatar level and Hall of Legends progress"
                />

                {xpReward > 0 && (
                  <RewardItem
                    icon="✨"
                    label="Avatar XP"
                    value={`${formatNumber(
                      xpReward
                    )} XP`}
                    valueColor={COLORS.purple}
                    subtitle="Avatar progression"
                  />
                )}

                <RewardItem
                  icon="👣"
                  label="Lifetime Steps"
                  value={`+${formatNumber(steps)}`}
                  valueColor={COLORS.blue}
                  subtitle={`${formatNumber(
                    Number(lifetimeSteps || 0) + steps
                  )} projected lifetime steps`}
                />

                <RewardItem
                  icon="🏅"
                  label="Journey Badge"
                  value={badge}
                  valueColor={COLORS.goldLight}
                  subtitle="Awarded once after completion"
                />

                <RewardItem
                  icon="📘"
                  label="Passport Stamp"
                  value={
                    journey?.passportStamp === false
                      ? "Not Included"
                      : "Included"
                  }
                  valueColor={COLORS.green}
                />

                <RewardItem
                  icon="📜"
                  label="Certificate"
                  value={
                    journey?.certificate === false
                      ? "Not Included"
                      : "Included"
                  }
                  valueColor={COLORS.green}
                />
              </View>
            </LinearGradient>

            <View style={styles.checkpointCard}>
              <Text style={styles.sectionEyebrow}>
                FIVE-CHECKPOINT ROUTE
              </Text>

              <Text style={styles.sectionTitle}>
                Your Journey Path
              </Text>

              <Text style={styles.checkpointDescription}>
                Begin at checkpoint 1 and finish at checkpoint{" "}
                {checkpoints}. Each checkpoint unlocks new history,
                narration, and journey progress.
              </Text>

              <ProgressPreview checkpoints={checkpoints} />

              <View style={styles.routeInfoRow}>
                <View style={styles.routeInfoItem}>
                  <Ionicons
                    name="flag-outline"
                    size={20}
                    color={COLORS.mint}
                  />

                  <Text style={styles.routeInfoText}>
                    {checkpoints} checkpoints
                  </Text>
                </View>

                <View style={styles.routeInfoItem}>
                  <Ionicons
                    name="navigate-outline"
                    size={20}
                    color={COLORS.blue}
                  />

                  <Text style={styles.routeInfoText}>
                    GPS guided
                  </Text>
                </View>

                <View style={styles.routeInfoItem}>
                  <Ionicons
                    name="volume-high-outline"
                    size={20}
                    color={COLORS.gold}
                  />

                  <Text style={styles.routeInfoText}>
                    Narration
                  </Text>
                </View>
              </View>
            </View>

            {!userCanStart && (
              <View style={styles.lockedCard}>
                <View style={styles.lockedIcon}>
                  <Ionicons
                    name="lock-closed"
                    size={28}
                    color={COLORS.gold}
                  />
                </View>

                <View style={styles.lockedTextWrap}>
                  <Text style={styles.lockedTitle}>
                    {accessLevel === "elite"
                      ? "Elite Journey"
                      : "Premium Journey"}
                  </Text>

                  <Text style={styles.lockedText}>
                    You can preview this entire journey. Upgrade your
                    membership when you are ready to start walking.
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                !userCanStart && styles.lockedStartButton,
              ]}
              activeOpacity={0.86}
              onPress={handleStartJourney}
            >
              <Ionicons
                name={
                  userCanStart
                    ? "walk"
                    : "lock-closed"
                }
                size={24}
                color={COLORS.black}
              />

              <Text style={styles.startButtonText}>
                {userCanStart
                  ? "Start Journey"
                  : getLockedButtonText(journey)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={handleBack}
            >
              <Ionicons
                name="albums-outline"
                size={21}
                color={COLORS.white}
              />

              <Text style={styles.secondaryButtonText}>
                Return to Journey Catalog
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerEyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2.2,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  heroCard: {
    height: 390,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  accessBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
  },

  accessBadgeText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  heroContent: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
  },

  categoryText: {
    color: COLORS.mint,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  journeyTitle: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
    marginTop: 8,
  },

  locationText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  statsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    minHeight: 112,
    backgroundColor: "rgba(8,22,42,0.96)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    marginBottom: 12,
  },

  statTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 7,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 13,
  },

  overviewCard: {
    borderRadius: 28,
    padding: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 6,
  },

  sectionEyebrow: {
    color: COLORS.mint,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.2,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 9,
  },

  overviewText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
    marginTop: 14,
  },

  storyButton: {
    minHeight: 56,
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: "rgba(143,246,208,0.08)",
    borderWidth: 1,
    borderColor: "rgba(143,246,208,0.34)",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  storyButtonText: {
    flex: 1,
    color: COLORS.mint,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 10,
  },

  rewardsCard: {
    borderRadius: 28,
    padding: 23,
    borderWidth: 1,
    borderColor: "rgba(247,201,72,0.52)",
    marginTop: 16,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rewardsEyebrow: {
    color: COLORS.mint,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.2,
  },

  rewardsTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 7,
  },

  rewardsList: {
    marginTop: 20,
  },

  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  rewardIconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  rewardIcon: {
    fontSize: 25,
  },

  rewardTextWrap: {
    flex: 1,
  },

  rewardLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },

  rewardValue: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  rewardSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  checkpointCard: {
    borderRadius: 28,
    padding: 23,
    backgroundColor: "rgba(8,22,42,0.97)",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 16,
  },

  checkpointDescription: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 13,
  },

  progressPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  checkpointCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.teal,
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  finishCheckpoint: {
    backgroundColor: COLORS.gold,
  },

  checkpointNumber: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "900",
  },

  checkpointLine: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },

  routeInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },

  routeInfoItem: {
    width: "31%",
    alignItems: "center",
  },

  routeInfoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 7,
  },

  lockedCard: {
    flexDirection: "row",
    backgroundColor: "rgba(247,201,72,0.09)",
    borderWidth: 1,
    borderColor: "rgba(247,201,72,0.48)",
    borderRadius: 24,
    padding: 18,
    marginTop: 16,
  },

  lockedIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: "rgba(247,201,72,0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  lockedTextWrap: {
    flex: 1,
  },

  lockedTitle: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: "900",
  },

  lockedText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },

  startButton: {
    minHeight: 66,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  lockedStartButton: {
    backgroundColor: COLORS.goldLight,
  },

  startButtonText: {
    color: COLORS.black,
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 10,
  },

  secondaryButton: {
    minHeight: 60,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 9,
  },

  bottomSpacer: {
    height: 120,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 18,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
  },

  emptyButton: {
    minHeight: 56,
    borderRadius: 22,
    paddingHorizontal: 26,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  emptyButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "900",
  },
});