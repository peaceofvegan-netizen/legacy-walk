import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  AppState,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STEP_STATS_KEY } from "../utils/stepTrackingEngine";
import Svg, { Circle } from "react-native-svg";

import useJourneyProgress from "../hooks/useJourneyProgress";
import useLegathonPoints from "../hooks/useLegathonPoints";
import { avatarOptions } from "../data/avatarOptions";
import { getCurrentAvatarVisual } from "../utils/avatarVisualResolver";

const SHOE_ICON = require("../assets/apparel/w-shoe.png");
const STOPWATCH_ICON = require("../assets/legathon/icons/compass.png");
const HEART_ICON = require("../assets/legathon/icons/heart.png");
const PASSPORT_ICON = require("../assets/legathon/icons/passporthome.png");
const FLAG_ICON = require("../assets/legathon/icons/checkerflag.png");

const DAILY_STEP_GOAL = 10000;
const DAILY_MILE_GOAL = 5;
const DAILY_CALORIE_GOAL = 500;
const LIFETIME_GOAL = 3000000;

const STORAGE_KEYS = {
  avatarProfile: "avatarProfile",
};

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return Math.max(0, Math.floor(number)).toLocaleString();
}

function stepsToMiles(steps) {
  return Math.max(Number(steps || 0), 0) / 2000;
}

function caloriesFromSteps(steps) {
  return Math.round(Math.max(Number(steps || 0), 0) * 0.04);
}

function clampProgress(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(Math.max(number, 0), 1);
}

function ProgressRing({
  progress = 0,
  size = 48,
  strokeWidth = 4,
  color = "#4FFFD2",
  backgroundColor = "rgba(255,255,255,0.12)",
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = clampProgress(progress);
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {children}
    </View>
  );
}

export default function WalkingDashboardScreen({
  goToJourneys,
  goToGPSJourneyMap,
  goToAvatarCenter,
  goToLegathons,
}) {
  const [todaySteps, setTodaySteps] = useState(0);
  const [stepError, setStepError] = useState("");
  const [stepsLoaded, setStepsLoaded] = useState(false);
  const [lifetimeSteps, setLifetimeSteps] = useState(0);

  const [userAvatar, setUserAvatar] = useState(
    avatarOptions[0]?.image || null
  );

  const [avatarName, setAvatarName] = useState(
    "Legathon Walker"
  );

  const journeyDisplay = useJourneyProgress();
  const activeJourney = journeyDisplay.activeJourney;
  const collectionPercent = journeyDisplay.collectionPercent;

  const {
    points: legathonPoints,
    rank: legathonRank,
  } = useLegathonPoints();

  // Display only: journey/marathon tracking owns all step writes.
  // Never create a second baseline or add the phone total here.
  useEffect(() => {
    let mounted = true;
    let loading = false;
    let foreground =
      AppState.currentState !== "background" &&
      AppState.currentState !== "inactive";

    async function refresh() {
      if (!mounted || !foreground || loading) return;

      loading = true;

      try {
        const values = Object.fromEntries(
          await AsyncStorage.multiGet([
            STEP_STATS_KEY,
            STORAGE_KEYS.avatarProfile,
          ])
        );

        if (!mounted) return;

        try {
          const raw = values[STEP_STATS_KEY];

          if (!raw) {
            throw new Error(
              "Open a journey or marathon to initialize tracking."
            );
          }

          const stats = JSON.parse(raw);

          if (
            !stats ||
            typeof stats !== "object" ||
            Array.isArray(stats)
          ) {
            throw new Error(
              "Saved step totals could not be read."
            );
          }

          const readCount = value => {
            const number = Number(value ?? 0);

            if (!Number.isFinite(number) || number < 0) {
              throw new Error(
                "Saved step totals are invalid."
              );
            }

            return Math.floor(number);
          };

          const now = new Date();

          const day =
            `${now.getFullYear()}-` +
            `${String(now.getMonth() + 1).padStart(2, "0")}-` +
            `${String(now.getDate()).padStart(2, "0")}`;

          const today =
            stats.dateKey === day
              ? readCount(stats.todaySteps)
              : 0;

          const journeyLifetime = readCount(
            stats.journeyLifetimeSteps ??
            stats.lifetimeSteps ??
            stats.totalSteps
          );

          const marathonLifetime = readCount(
            stats.marathonLifetimeSteps
          );

          setTodaySteps(today);
          setLifetimeSteps(journeyLifetime + marathonLifetime);
          setStepsLoaded(true);
          setStepError("");
        } catch (error) {
          setStepError(
            error.message || "Unable to refresh steps."
          );
        }

        try {
          const savedProfile = values[STORAGE_KEYS.avatarProfile];

          if (savedProfile) {
            const profile = JSON.parse(savedProfile);

            setAvatarName(
              profile?.name || "Legathon Walker"
            );

            const avatar = avatarOptions.find(
              item => item.id === profile?.avatarId
            );

            if (avatar) {
              const visual = await getCurrentAvatarVisual(
                avatar.id
              );

              if (mounted) {
                setUserAvatar(
                  visual?.image || avatar.image || null
                );
              }
            }
          }
        } catch (error) {
          console.log(
            "Dashboard profile refresh error:",
            error
          );
        }
      } catch (error) {
        if (mounted) {
          setStepError(
            "Unable to read saved steps. Your progress has not been changed."
          );
        }
      } finally {
        loading = false;
      }
    }

    void refresh();

    const timer = setInterval(() => {
      void refresh();
    }, 1500);

    const listener = AppState.addEventListener(
      "change",
      state => {
        foreground = state === "active";

        if (foreground) {
          void refresh();
        }
      }
    );

    return () => {
      mounted = false;
      clearInterval(timer);
      listener.remove();
    };
  }, []);

  function openCurrentJourney() {
    if (
      activeJourney &&
      typeof goToGPSJourneyMap === "function"
    ) {
      goToGPSJourneyMap(activeJourney);
      return;
    }

    if (typeof goToJourneys === "function") {
      goToJourneys();
    }
  }

  const miles = stepsToMiles(todaySteps);
  const calories = caloriesFromSteps(todaySteps);
  const journeyProgress = activeJourney?.progress || 0;

  const metrics = [
    {
      key: "today",
      label: "TODAY STEPS",
      value: formatNumber(todaySteps),
      goal: `${formatNumber(DAILY_STEP_GOAL)} goal`,
      progress: todaySteps / DAILY_STEP_GOAL,
      color: "#4FFFD2",
      icon: SHOE_ICON,
    },
    {
      key: "lifetime",
      label: "LIFETIME STEPS",
      value: formatNumber(lifetimeSteps),
      goal: "All-time movement",
      progress: lifetimeSteps / LIFETIME_GOAL,
      color: "#FF4F7B",
      icon: STOPWATCH_ICON,
    },
    {
      key: "miles",
      label: "MILES WALKED",
      value: miles.toFixed(2),
      goal: `${DAILY_MILE_GOAL} mile goal`,
      progress: miles / DAILY_MILE_GOAL,
      color: "#8DFF64",
      icon: FLAG_ICON,
    },
    {
      key: "calories",
      label: "CALORIES",
      value: formatNumber(calories),
      goal: `${DAILY_CALORIE_GOAL} daily goal`,
      progress: calories / DAILY_CALORIE_GOAL,
      color: "#FF9E45",
      icon: HEART_ICON,
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.goldGlow} />
      <View style={styles.aquaGlow} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>
              LEGATHON WALK
            </Text>

            <Text
              style={styles.headerTitle}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
            >
              Walking{"\n"}
              <Text style={styles.headerTitleGold}>
                Dashboard
              </Text>
            </Text>

            <Text style={styles.headerSubtitle}>
              Every step builds momentum.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={goToAvatarCenter}
            activeOpacity={0.85}
          >
            <View style={styles.avatarHalo}>
              {userAvatar ? (
                <Image
                  source={
                    userAvatar.image
                      ? userAvatar.image
                      : userAvatar
                  }
                  style={styles.avatar}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.avatarFallback}>👟</Text>
              )}
            </View>

            <Text
              style={styles.profileName}
              numberOfLines={1}
            >
              {avatarName}
            </Text>

            <Text style={styles.profileAction}>
              VIEW AVATAR
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteMark}>“</Text>

          <View style={styles.quoteCopy}>
            <Text style={styles.quoteText}>
              Every step today builds the legacy of tomorrow.
            </Text>

            <Text style={styles.quoteSignature}>
              KEEP WALKING
            </Text>
          </View>

          <View style={styles.crownBadge}>
            <Text style={styles.crown}>♛</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>
              LIVE MOVEMENT
            </Text>

            <Text style={styles.sectionTitle}>
              Today at a glance
            </Text>
          </View>

          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {!!stepError && (
          <Text
            accessibilityRole="alert"
            style={{
              color: "#FFC747",
              marginBottom: 12,
            }}
          >
            {stepError}
          </Text>
        )}

        <View style={styles.metricsGrid}>
          {metrics.map(metric => (
            <View
              key={metric.key}
              style={styles.metricCard}
            >
              <View style={styles.metricTop}>
                <ProgressRing
                  progress={metric.progress}
                  size={54}
                  strokeWidth={4}
                  color={metric.color}
                  backgroundColor="rgba(255,255,255,0.08)"
                >
                  <Image
                    source={metric.icon}
                    style={styles.metricIcon}
                    resizeMode="contain"
                  />
                </ProgressRing>

                <View
                  style={[
                    styles.metricAccent,
                    {
                      backgroundColor: metric.color,
                    },
                  ]}
                />
              </View>

              <Text style={styles.metricLabel}>
                {metric.label}
              </Text>

              <Text
                style={styles.metricValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
              >
                {stepsLoaded ? metric.value : "—"}
              </Text>

              <Text style={styles.metricGoal}>
                {metric.goal}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.pointsCard}>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsStar}>★</Text>
          </View>

          <View style={styles.pointsMain}>
            <Text style={styles.pointsLabel}>
              LEGATHON POINTS
            </Text>

            <Text style={styles.pointsValue}>
              {formatNumber(legathonPoints)}
            </Text>

            <Text style={styles.pointsRank}>
              {legathonRank?.currentRank || "New Walker"}
            </Text>
          </View>

          <View style={styles.pointsNext}>
            <Text style={styles.nextLabel}>NEXT</Text>

            <Text
              style={styles.nextRank}
              numberOfLines={1}
            >
              {legathonRank?.nextRank || "MAX"}
            </Text>

            <Text style={styles.pointsRemaining}>
              {formatNumber(legathonRank?.pointsRemaining)} left
            </Text>
          </View>
        </View>

        {journeyDisplay.error ? (
          <Text style={styles.metricGoal}>
            {journeyDisplay.error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.progressCard}
          onPress={goToJourneys}
          activeOpacity={0.85}
        >
          <ProgressRing
            progress={collectionPercent / 100}
            size={64}
            strokeWidth={5}
            color="#4FFFD2"
            backgroundColor="rgba(79,255,210,0.12)"
          >
            <Image
              source={PASSPORT_ICON}
              style={styles.progressIcon}
              resizeMode="contain"
            />
          </ProgressRing>

          <View style={styles.progressCopy}>
            <Text style={styles.progressAqua}>
              LEGATHON PROGRESS
            </Text>

            <Text style={styles.progressTitle}>
              Your journey collection
            </Text>

            <Text style={styles.metricGoal}>
              {journeyDisplay.ready
                ? `${journeyDisplay.completedCount} of ${journeyDisplay.totalCount} journeys at goal`
                : "Loading saved progress…"}
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${collectionPercent}%`,
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.progressPercent}>
            {journeyDisplay.ready
              ? `${collectionPercent.toFixed(1)}%`
              : "—"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.progressCard,
            styles.continueCard,
          ]}
          onPress={openCurrentJourney}
          activeOpacity={0.85}
        >
          <ProgressRing
            progress={journeyProgress / 100}
            size={64}
            strokeWidth={5}
            color="#F6C84A"
            backgroundColor="rgba(246,200,74,0.13)"
          >
            <Image
              source={PASSPORT_ICON}
              style={styles.progressIcon}
              resizeMode="contain"
            />
          </ProgressRing>

          <View style={styles.progressCopy}>
            <Text style={styles.progressGold}>
              CONTINUE JOURNEY
            </Text>

            <Text
              style={styles.progressTitle}
              numberOfLines={1}
            >
              {activeJourney?.title ||
                "Choose your next adventure"}
            </Text>

            <Text style={styles.continueHint}>
              Tap to return to your route
            </Text>
          </View>

          <View style={styles.arrowBadge}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.legathonButton}
          onPress={goToLegathons}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEyebrow}>
            GLOBAL EVENTS
          </Text>

          <Text style={styles.buttonTitle}>
            Explore Legathon Marathons
          </Text>

          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#020713" },
  goldGlow: { position: "absolute", top: -120, right: -110, width: 330, height: 330, borderRadius: 165, backgroundColor: "rgba(246,200,74,0.10)" },
  aquaGlow: { position: "absolute", top: 470, left: -140, width: 290, height: 290, borderRadius: 145, backgroundColor: "rgba(79,255,210,0.055)" },
  scrollView: { flex: 1, zIndex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 150 },
  header: { minHeight: 188, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerCopy: { flex: 1, paddingRight: 12 },
  headerEyebrow: { color: "#79F5D1", fontSize: 12, fontWeight: "900", letterSpacing: 3.2, marginBottom: 8 },
  headerTitle: { color: "#FFFFFF", fontSize: 42, lineHeight: 44, fontWeight: "900", letterSpacing: -1.3 },
  headerTitleGold: { color: "#F6C84A" },
  headerSubtitle: { color: "#8798B3", fontSize: 14, fontWeight: "700", marginTop: 10 },
  profileCard: { width: 112, alignItems: "center", paddingVertical: 8, paddingHorizontal: 6, borderRadius: 24, borderWidth: 1, borderColor: "rgba(246,200,74,0.28)", backgroundColor: "rgba(8,22,42,0.86)" },
  avatarHalo: { width: 92, height: 94, borderRadius: 46, alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 2, borderColor: "#F6C84A", backgroundColor: "#071326" },
  avatar: { width: 90, height: 90 },
  avatarFallback: { fontSize: 34 },
  profileName: { width: "100%", color: "#FFFFFF", fontSize: 13, fontWeight: "900", textAlign: "center", marginTop: 7 },
  profileAction: { color: "#F6C84A", fontSize: 8, fontWeight: "900", letterSpacing: 1.2, marginTop: 3 },
  quoteCard: { minHeight: 126, flexDirection: "row", alignItems: "center", paddingVertical: 20, paddingHorizontal: 18, borderRadius: 24, borderWidth: 1, borderColor: "rgba(246,200,74,0.48)", backgroundColor: "rgba(11,23,42,0.96)", overflow: "hidden" },
  quoteMark: { alignSelf: "flex-start", color: "#F6C84A", fontSize: 50, lineHeight: 48, fontWeight: "900", marginRight: 12 },
  quoteCopy: { flex: 1, paddingRight: 10 },
  quoteText: { color: "#F5F7FB", fontSize: 17, lineHeight: 25, fontWeight: "800" },
  quoteSignature: { color: "#79F5D1", fontSize: 10, fontWeight: "900", letterSpacing: 2, marginTop: 9 },
  crownBadge: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(246,200,74,0.65)", backgroundColor: "rgba(246,200,74,0.10)" },
  crown: { color: "#F6C84A", fontSize: 22, fontWeight: "900" },
  sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 28, marginBottom: 14 },
  sectionEyebrow: { color: "#79F5D1", fontSize: 10, fontWeight: "900", letterSpacing: 2.4, marginBottom: 5 },
  sectionTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", letterSpacing: -0.5 },
  livePill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 99, backgroundColor: "rgba(79,255,210,0.10)", borderWidth: 1, borderColor: "rgba(79,255,210,0.28)" },
  liveDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6, backgroundColor: "#4FFFD2" },
  liveText: { color: "#79F5D1", fontSize: 9, fontWeight: "900", letterSpacing: 1.4 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  metricCard: { width: "48.5%", minHeight: 190, padding: 15, marginBottom: 12, borderRadius: 22, borderWidth: 1, borderColor: "#233C5E", backgroundColor: "rgba(8,24,46,0.95)" },
  metricTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  metricAccent: { width: 22, height: 4, borderRadius: 2, marginTop: 4 },
  metricIcon: { width: 29, height: 29 },
  metricLabel: { color: "#91A2BC", fontSize: 10, fontWeight: "900", letterSpacing: 1.3 },
  metricValue: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginTop: 5 },
  metricGoal: { color: "#71839D", fontSize: 10, fontWeight: "700", marginTop: 5 },
  pointsCard: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 16, marginTop: 4, borderRadius: 22, borderWidth: 1, borderColor: "rgba(246,200,74,0.55)", backgroundColor: "rgba(27,23,15,0.96)" },
  pointsBadge: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#F6C84A", backgroundColor: "rgba(246,200,74,0.12)", marginRight: 13 },
  pointsStar: { color: "#F6C84A", fontSize: 24 },
  pointsMain: { flex: 1 },
  pointsLabel: { color: "#F6C84A", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  pointsValue: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", marginTop: 3 },
  pointsRank: { color: "#AAB7CA", fontSize: 11, fontWeight: "800", marginTop: 2 },
  pointsNext: { maxWidth: 105, alignItems: "flex-end" },
  nextLabel: { color: "#7C8BA1", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  nextRank: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", textAlign: "right", marginTop: 4 },
  pointsRemaining: { color: "#95845A", fontSize: 9, fontWeight: "700", textAlign: "right", marginTop: 4 },
  progressCard: { minHeight: 96, flexDirection: "row", alignItems: "center", padding: 16, marginTop: 14, borderRadius: 22, borderWidth: 1, borderColor: "rgba(79,255,210,0.34)", backgroundColor: "rgba(8,24,46,0.95)" },
  continueCard: { borderColor: "rgba(246,200,74,0.42)" },
  progressIcon: { width: 36, height: 36 },
  progressCopy: { flex: 1, paddingHorizontal: 13 },
  progressAqua: { color: "#79F5D1", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  progressGold: { color: "#F6C84A", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  progressTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginTop: 4 },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden", backgroundColor: "#162D4A", marginTop: 10 },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#4FFFD2" },
  progressPercent: { minWidth: 46, color: "#FFFFFF", fontSize: 19, fontWeight: "900", textAlign: "right" },
  continueHint: { color: "#7F90A9", fontSize: 10, fontWeight: "700", marginTop: 5 },
  arrowBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(246,200,74,0.12)", borderWidth: 1, borderColor: "rgba(246,200,74,0.45)" },
  arrow: { color: "#F6C84A", fontSize: 29, lineHeight: 31, fontWeight: "700" },
  legathonButton: { minHeight: 84, justifyContent: "center", paddingVertical: 17, paddingLeft: 20, paddingRight: 58, marginTop: 14, borderRadius: 22, borderWidth: 1, borderColor: "rgba(246,200,74,0.62)", backgroundColor: "#F6C84A" },
  buttonEyebrow: { color: "#5D470E", fontSize: 9, fontWeight: "900", letterSpacing: 1.8 },
  buttonTitle: { color: "#07101F", fontSize: 18, fontWeight: "900", marginTop: 4 },
  buttonArrow: { position: "absolute", right: 20, color: "#07101F", fontSize: 28, fontWeight: "900" },
});