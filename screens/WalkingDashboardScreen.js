import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLegathonPoints from "../hooks/useLegathonPoints";
import { Pedometer } from "expo-sensors";
import Svg, { Circle } from "react-native-svg";
import { avatarOptions } from "../data/avatarOptions";
import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";
const { width } = Dimensions.get("window");

const DASHBOARD_MOCKUP = require("../assets/logo/dashboard.png");

const SHOE_ICON = require("../assets/apparel/w-shoe.png");
const STOPWATCH_ICON = require("../assets/legathon/icons/compass.png");
const HEART_ICON = require("../assets/legathon/icons/heart.png");
const PASSPORT_ICON = require("../assets/legathon/icons/passporthome.png");
const FLAG_ICON = require("../assets/legathon/icons/checkerflag.png");

const DAILY_STEP_GOAL = 10000;
const DAILY_MILE_GOAL = 5;
const DAILY_CALORIE_GOAL = 500;
const LIFETIME_GOAL = 3000000;

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function stepsToMiles(steps) {
  return (Number(steps || 0) / 2000).toFixed(2);
}

function caloriesFromSteps(steps) {
  return Math.round(Number(steps || 0) * 0.04);
}

function ProgressRing({
  progress = 0,
  size = 48,
  strokeWidth = 4,
  color = "#00E8FF",
  bgColor = "rgba(255,255,255,0.15)",
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
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
          strokeDashoffset={strokeDashoffset}
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
  const [todaySteps, setTodaySteps] = React.useState(0);
const [lifetimeSteps, setLifetimeSteps] = React.useState(0);

const [userAvatar, setUserAvatar] = React.useState(
  avatarOptions[0]?.image || null
);

const [selectedAvatarId, setSelectedAvatarId] = React.useState(
  avatarOptions[0]?.id || null
);

const [activeJourney, setActiveJourney] = React.useState(null);

const [avatarName, setAvatarName] = React.useState(
  "Legacy Walker"
);

const [dashboardJourney, setDashboardJourney] = useState(null);

const {
  points: legathonPoints,
  rank: legathonRank,
} = useLegathonPoints();

  React.useEffect(() => {
    loadDashboard();
  }, []);

 React.useEffect(() => {
  let subscription;

  async function startPedometer() {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) return;

      const today = new Date().toDateString();

      // Get phone's current step total for today.
      // We use this only as a reference — NOT as Legathon steps.
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const now = new Date();

      const result = await Pedometer.getStepCountAsync(
        startOfDay,
        now
      );

      const phoneStepsNow = Number(result?.steps || 0);

      // Load Legathon tracking information
      let trackingDate =
        await AsyncStorage.getItem("legathonTrackingDate");

      let baseline = Number(
        (await AsyncStorage.getItem("legathonStepBaseline")) || 0
      );

      let savedToday = Number(
        (await AsyncStorage.getItem("todaySteps")) || 0
      );

      let savedLifetime = Number(
        (await AsyncStorage.getItem("lifetimeSteps")) || 0
      );

      // FIRST TIME USER
      // Start Legathon at ZERO and remember the phone's current steps.
      if (!trackingDate) {
        trackingDate = today;
        baseline = phoneStepsNow;
        savedToday = 0;
        savedLifetime = 0;

        await AsyncStorage.setItem(
          "legathonTrackingDate",
          today
        );

        await AsyncStorage.setItem(
          "legathonStepBaseline",
          String(phoneStepsNow)
        );

        await AsyncStorage.setItem("todaySteps", "0");
        await AsyncStorage.setItem("lifetimeSteps", "0");
      }

      // NEW DAY
      // Today resets to zero.
      // Lifetime DOES NOT reset.
      if (trackingDate !== today) {
        trackingDate = today;
        baseline = phoneStepsNow;
        savedToday = 0;

        await AsyncStorage.setItem(
          "legathonTrackingDate",
          today
        );

        await AsyncStorage.setItem(
          "legathonStepBaseline",
          String(phoneStepsNow)
        );

        await AsyncStorage.setItem("todaySteps", "0");
      }

      setTodaySteps(savedToday);
      setLifetimeSteps(savedLifetime);

      // Keep checking while app is running
      subscription = Pedometer.watchStepCount(async () => {
        try {
          const currentDate = new Date().toDateString();

          const currentStartOfDay = new Date();
          currentStartOfDay.setHours(0, 0, 0, 0);

          const currentResult =
            await Pedometer.getStepCountAsync(
              currentStartOfDay,
              new Date()
            );

          const currentPhoneSteps = Number(
            currentResult?.steps || 0
          );

          let storedDate =
            await AsyncStorage.getItem(
              "legathonTrackingDate"
            );

          let storedBaseline = Number(
            (await AsyncStorage.getItem(
              "legathonStepBaseline"
            )) || 0
          );

          let previousToday = Number(
            (await AsyncStorage.getItem(
              "todaySteps"
            )) || 0
          );

          let currentLifetime = Number(
            (await AsyncStorage.getItem(
              "lifetimeSteps"
            )) || 0
          );

          // MIDNIGHT RESET
          if (storedDate !== currentDate) {
            storedDate = currentDate;
            storedBaseline = currentPhoneSteps;
            previousToday = 0;

            await AsyncStorage.setItem(
              "legathonTrackingDate",
              currentDate
            );

            await AsyncStorage.setItem(
              "legathonStepBaseline",
              String(currentPhoneSteps)
            );

            await AsyncStorage.setItem(
              "todaySteps",
              "0"
            );

            setTodaySteps(0);
            return;
          }

          // Only count steps taken AFTER Legathon baseline
          const legathonToday = Math.max(
            currentPhoneSteps - storedBaseline,
            0
          );

          // Only add NEW steps to Lifetime
          const newSteps = Math.max(
            legathonToday - previousToday,
            0
          );

          if (newSteps > 0) {
            const updatedLifetime =
              currentLifetime + newSteps;

            setTodaySteps(legathonToday);
            setLifetimeSteps(updatedLifetime);

            await AsyncStorage.setItem(
              "todaySteps",
              String(legathonToday)
            );

            await AsyncStorage.setItem(
              "lifetimeSteps",
              String(updatedLifetime)
            );
          }
        } catch (error) {
          console.log(
            "Live step update error:",
            error
          );
        }
      });
    } catch (error) {
      console.log("Pedometer error:", error);
    }
  }

  startPedometer();

  return () => {
    if (subscription) subscription.remove();
  };
}, []);

async function loadDashboard() {
  try {
    const today = new Date().toDateString();

const trackingDate = await AsyncStorage.getItem(
  "legathonTrackingDate"
);

let savedToday = await AsyncStorage.getItem("todaySteps");

// Today Steps resets when the Legathon tracking date changes.
// Lifetime Steps is NEVER reset here.
if (trackingDate && trackingDate !== today) {
  savedToday = "0";
  await AsyncStorage.setItem("todaySteps", "0");
}

    const savedLifetime =
      await AsyncStorage.getItem("lifetimeSteps");

    const savedProfile =
      await AsyncStorage.getItem("avatarProfile");

    const savedActiveJourney =
      await AsyncStorage.getItem("activeJourney");

    setTodaySteps(Number(savedToday || 0));
    setLifetimeSteps(Number(savedLifetime || 0));

    if (savedActiveJourney) {
      const parsedJourney = JSON.parse(savedActiveJourney);

      setActiveJourney({
        ...parsedJourney,
        progress: parsedJourney.completed
          ? 100
          : Math.min(
              Math.max(Number(parsedJourney.progress || 0), 0),
              100
            ),
      });
    }
if (savedProfile) {
  const profile =
    JSON.parse(savedProfile);

  setAvatarName(
    profile?.name ||
    "Legacy Walker"
  );

  const foundAvatar =
    avatarOptions.find(
      (avatar) =>
        avatar.id ===
        profile?.avatarId
    );

  if (foundAvatar) {
    setSelectedAvatarId(
      foundAvatar.id
    );

    const visual =
      await getCurrentAvatarVisual(
        foundAvatar.id
      );

    setUserAvatar(
      visual?.image ||
      foundAvatar.image ||
      null
    );
  }
}

} catch (error) {
  console.log(
    "Dashboard load error:",
    error
  );
}
}
 
const miles = Number(stepsToMiles(todaySteps));
const calories = Number(caloriesFromSteps(todaySteps));
const homeJourneyProgress = activeJourney?.completed
  ? 100
  : Math.min(
      Math.max(Number(activeJourney?.progress || 0), 0),
      100
    );


return (
  <View style={styles.screen}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces
    >
      <View style={styles.dashboardCanvas}>
        <Image
          source={DASHBOARD_MOCKUP}
          style={styles.mockupImage}
          resizeMode="contain"
        />

        {userAvatar && (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={goToAvatarCenter}
            activeOpacity={0.85}
          >
    <Image
      source={userAvatar.image ? userAvatar.image : userAvatar}
      style={styles.dashboardAvatar}
    />

    <Text style={styles.avatarName} numberOfLines={1}>
      {avatarName}
    </Text>
  </TouchableOpacity>
)}
     {/* TODAY STEPS */}
<View style={styles.todayBox}>
  <View style={styles.todayRing}>
    <ProgressRing
      progress={Math.min(todaySteps / DAILY_STEP_GOAL, 1)}
      color="#00E8FF"
    >
      <Image
        source={SHOE_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text
    style={styles.todayValue}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.6}
  >
    {formatNumber(todaySteps)}
  </Text>
</View>

{/* LIFETIME STEPS */}
<View style={styles.lifetimeBox}>
  <View style={styles.lifetimeRing}>
    <ProgressRing
      progress={Math.min(lifetimeSteps / LIFETIME_GOAL, 1)}
      color="#FF3366"
    >
      <Image
        source={STOPWATCH_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text
    style={styles.lifetimeValue}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.6}
  >
    {formatNumber(lifetimeSteps)}
  </Text>
</View>
{/* MILES WALKED */}
<View style={styles.milesBox}>
  <View style={styles.milesRing}>
    <ProgressRing
      progress={Math.min(miles / 5, 1)}
      color="#75FF4D"
    >
      <Image
        source={FLAG_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text
    style={styles.milesValue}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.80}
  >
    {miles.toFixed(2)}
  </Text>
</View>

{/* CALORIES BURNED */}
<View style={styles.caloriesBox}>
  <View style={styles.caloriesRing}>
    <ProgressRing
      progress={Math.min(calories / 500, 1)}
      color="#FF8A00"
    >
      <Image
        source={HEART_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text
    style={styles.caloriesValue}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.6}
  >
    {formatNumber(calories)}
  </Text>
</View>
   
{/* LEGATHON POINTS */}
<View style={styles.legathonPointsCard}>
  <View style={{ flex: 1 }}>
    <Text style={styles.legathonPointsLabel}>
      ⭐ LEGATHON POINTS
    </Text>

    <Text style={styles.legathonPointsValue}>
      {Number(legathonPoints || 0).toLocaleString()}
    </Text>

    <Text style={styles.legathonPointsRank}>
      {legathonRank?.currentRank || "New Walker"}
    </Text>
  </View>

  <View style={styles.legathonPointsRight}>
    <Text style={styles.legathonPointsNext}>
      Next: {legathonRank?.nextRank || "MAX"}
    </Text>

    <Text style={styles.legathonPointsRemaining}>
      {Number(
        legathonRank?.pointsRemaining || 0
      ).toLocaleString()}{" "}
      points remaining
    </Text>
  </View>
</View>
 {/* LEGACY PROGRESS */}
<View style={styles.legacyBox}>
  <View style={styles.legacyRing}>
    <ProgressRing
      progress={Math.min(
        Math.max(homeJourneyProgress / 100, 0),
        1
      )}
      color="#00E8FF"
    >
      <Image
        source={PASSPORT_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text style={styles.legacyPercentage}>
    {Math.round(homeJourneyProgress)}%
  </Text>
</View>

{/* CONTINUE CURRENT JOURNEY */}
<TouchableOpacity
  style={styles.continueTapArea}
  activeOpacity={0.85}
 onPress={() => {
  if (typeof goToGPSJourneyMap === "function") {
    goToGPSJourneyMap();
  } else if (typeof goToJourneys === "function") {
    goToJourneys();
  }
}}
>
  <View style={styles.continueRing}>
    <ProgressRing
      progress={Math.min(
        Math.max(homeJourneyProgress / 100, 0),
        1
      )}
      color="#FFD700"
    >
      <Image
        source={PASSPORT_ICON}
        style={styles.ringImage}
        resizeMode="contain"
      />
    </ProgressRing>
  </View>

  <Text style={styles.continuePercentage}>
    {Math.round(homeJourneyProgress)}%
  </Text>
</TouchableOpacity>
         </View>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020814",
  },
  scrollView: {
  flex: 1,
},

scrollContent: {
  paddingBottom: 140,
},

dashboardCanvas: {
  position: "relative",
  width: "100%",
  height: 1400,
},

mockupImage: {
  position: "absolute",
  top: -35,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
},

continueTapArea: {
  position: "absolute",
  top: 700,
  left: 46,
  width: width - 92,
  height: 80,
  zIndex: 25,
},

legathonTapArea: {
  position: "absolute",
  bottom: 92,
  left: 0,
  width,
  height: 70,
  zIndex: 25,
},

  avatarContainer: {
    position: "absolute",
    top: 220,
    right: 5,
    alignItems: "center",
    zIndex: 30,
  },

  dashboardAvatar: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  avatarName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: -10,
    maxWidth: 130,
    textAlign: "center",
  },

  todayBox: {
    position: "absolute",
    top: 565,
    left: 47,
    width: 130,
    height: 92,
  },

  lifetimeBox: {
    position: "absolute",
    top: 565,
    right: 46,
    width: 130,
    height: 92,
  },

  milesBox: {
    position: "absolute",
    top: 667,
    left: 46,
    width: 130,
    height: 92,
  },

  caloriesBox: {
    position: "absolute",
    top: 667,
    right: 46,
    width: 130,
    height: 92,
  },

  legacyBox: {
    position: "absolute",
    top: 782,
    left: 46,
    width: width - 92,
    height: 90,
  },

  todayRing: {
    position: "absolute",
    top: 149,
    left: -17,
    zIndex: 20,
  },

  lifetimeRing: {
    position: "absolute",
    top: 149,
    left: -25,
    zIndex: 20,
  },

  milesRing: {
    position: "absolute",
    top: 146,
    left: -17,
    zIndex: 20,
  },

  caloriesRing: {
    position: "absolute",
    top: 146,
    left: -25,
    zIndex: 20,
  },

  legacyRing: {
    position: "absolute",
    top: 126,
    left: -17,
    zIndex: 20,
  },

  continueTapArea: {
    position: "absolute",
    top: 880,
    left: 46,
    width: width - 92,
    height: 90,
    zIndex: 25,
  },

  continueRing: {
    position: "absolute",
    top: 104,
    left: -17,
    zIndex: 30,
  },

  
  metricValue: {
    position: "absolute",
    bottom: 123,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  ringImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  journeyTextArea: {
  flex: 1,
  marginLeft: 18,
  justifyContent: "center",
},

journeySectionTitle: {
  color: "#00E8FF",
  fontSize: 14,
  fontWeight: "800",
  letterSpacing: 2,
},

continueJourneyTitle: {
  color: "#FFD700",
  fontSize: 14,
  fontWeight: "800",
  letterSpacing: 1.5,
},

journeyProgressText: {
  marginTop: 4,
  color: "#FFFFFF",
  fontSize: 22,
  fontWeight: "900",
},

journeyStatusText: {
  marginTop: 2,
  color: "#AAB7CE",
  fontSize: 13,
  fontWeight: "600",
},

legacyPercentage: {
  position: "absolute",
  left: 240,
  top: 155,
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "900",
  includeFontPadding: false,
},

continuePercentage: {
  position: "absolute",
  left: 240,
  top: 130,
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "900",
  includeFontPadding: false,
},

todayValue: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: -130,
  color: "#FFFFFF",
  fontSize: 24,
  fontWeight: "900",
  textAlign: "center",
  includeFontPadding: false,
},

lifetimeValue: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: -130,
  color: "#FFFFFF",
  fontSize: 24,
  fontWeight: "900",
  textAlign: "center",
  includeFontPadding: false,
},

milesValue: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: -122,
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "900",
  textAlign: "center",
  includeFontPadding: false,
},

caloriesValue: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: -122,
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "900",
  textAlign: "center",
  includeFontPadding: false,

},
legathonPointsCard: {
  marginTop: 16,
  marginBottom: 16,
  paddingVertical: 18,
  paddingHorizontal: 20,
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "#D4AF37",
  backgroundColor: "#071326",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

legathonPointsLabel: {
  color: "#7FFFD4",
  fontSize: 14,
  fontWeight: "800",
  letterSpacing: 1,
},

legathonPointsValue: {
  color: "#FFFFFF",
  fontSize: 30,
  fontWeight: "900",
  marginTop: 4,
},

legathonPointsRank: {
  color: "#D4AF37",
  fontSize: 15,
  fontWeight: "800",
  marginTop: 3,
},

legathonPointsRight: {
  alignItems: "flex-end",
},

legathonPointsNext: {
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: "700",
},

legathonPointsRemaining: {
  color: "#9FB0C8",
  fontSize: 11,
  fontWeight: "600",
  marginTop: 4,
},

});