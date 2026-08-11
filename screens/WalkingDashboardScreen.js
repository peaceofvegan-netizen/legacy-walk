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
import { Pedometer } from "expo-sensors";
import Svg, { Circle } from "react-native-svg";
import { avatarOptions } from "../data/avatarOptions";
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
  return ((Number(steps || 0) * 2.5) / 5280).toFixed(2);
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
  const [userAvatar, setUserAvatar] = React.useState( avatarOptions[0]?.image);
  const [activeJourney, setActiveJourney] = React.useState(null);
  const [avatarName, setAvatarName] = React.useState("Legacy Walker");
const [dashboardJourney, setDashboardJourney] = useState(null);
  React.useEffect(() => {
    loadDashboard();
  }, []);

  React.useEffect(() => {
    let subscription;

    async function startPedometer() {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) return;

        let lastReading = Number(
          (await AsyncStorage.getItem("lastPedometerReading")) || 0
        );

        subscription = Pedometer.watchStepCount(async (result) => {
          const currentReading = Number(result.steps || 0);

          if (lastReading === 0) {
            lastReading = currentReading;
            await AsyncStorage.setItem(
              "lastPedometerReading",
              String(currentReading)
            );
            return;
          }

          const newSteps = Math.max(currentReading - lastReading, 0);
          lastReading = currentReading;

          await AsyncStorage.setItem(
            "lastPedometerReading",
            String(currentReading)
          );

          if (newSteps <= 0) return;

          setTodaySteps((prev) => {
            const updated = Number(prev || 0) + newSteps;
            AsyncStorage.setItem("todaySteps", String(updated));
            return updated;
          });

          setLifetimeSteps((prev) => {
            const updated = Number(prev || 0) + newSteps;
            AsyncStorage.setItem("lifetimeSteps", String(updated));
            return updated;
          });
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
    const savedToday = await AsyncStorage.getItem("todaySteps");
    const savedLifetime = await AsyncStorage.getItem("lifetimeSteps");
    const savedProfile = await AsyncStorage.getItem("avatarProfile");
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
      const profile = JSON.parse(savedProfile);

      setAvatarName(profile.name || "Legacy Walker");

      const foundAvatar = avatarOptions.find(
        (avatar) => avatar.id === profile.avatarId
      );

      if (foundAvatar) {
        setUserAvatar(foundAvatar);
      }
    }
  } catch (error) {
    console.log("Dashboard load error:", error);
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
});