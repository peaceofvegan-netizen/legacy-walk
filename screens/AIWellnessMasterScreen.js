import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_STEP_GOAL = 7000;
const DEFAULT_HYDRATION_GOAL = 100;

const AI_TABS = [
  "Home",
  "Wellness",
  "Coach",
  "Journey",
  "Activity",
];

const INITIAL_WELLNESS = {
  userName: "Walker",
  greeting: "",
  steps: 0,
  stepGoal: DEFAULT_STEP_GOAL,
  stepsRemaining: DEFAULT_STEP_GOAL,

  recovery: null,
  sleepHours: null,

  hydration: 0,
  hydrationGoal: DEFAULT_HYDRATION_GOAL,

  calories: 0,
  stress: null,

  wellnessScore: null,
  wellnessLabel: "",

  streak: 0,

  journey: "",
  journeyFull: "",
  journeyProgress: 0,
  checkpoint: "",

  aiMessage: "",
};

function safelyParseJSON(value, fallback = null) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log("JSON parse error:", error);
    return fallback;
  }
}

function clampNumber(value, minimum = 0, maximum = 100) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minimum;
  }

  return Math.min(
    Math.max(numericValue, minimum),
    maximum
  );
}

function calculateGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

async function getFirstStoredValue(keys = []) {
  for (const key of keys) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value !== null && value !== undefined) {
        return value;
      }
    } catch (error) {
      console.log(`Storage read error for ${key}:`, error);
    }
  }

  return null;
}

export default function AIWellnessMasterScreen({
  navigation,
  language = "en",
  goBack,

 
  goToNotifications,
  goToSubscription,
  goToAIConversation,
  goToVoiceCoach,
 
  goToHydration,
  goToRecovery,
  goToSleep,
  goToBreathing,
  goToMealPlanner,

  goToGPSJourneyMap,
  goToJourneys,
  goToJourneyStory,

  goToWalkingAnalytics,
  goToWalkHistory,
  goToGoals,

  activeJourney: activeJourneyProp = null,
  userPlan = "free",
}) {
  const [activeTab, setActiveTab] = useState("Home");
  const [aiStatus, setAIStatus] = useState("AI Ready");
  const [isLoading, setIsLoading] = useState(true);

  const [wellness, setWellness] = useState(
    INITIAL_WELLNESS
  );

  const pulse = useRef(
    new Animated.Value(1)
  ).current;

  const rotate = useRef(
    new Animated.Value(0)
  ).current;

  const glow = useRef(
    new Animated.Value(0)
  ).current;
const runAction = useCallback(
  (callback, screenName, params = undefined) => {
    // Use a callback supplied by App.js first.
    if (typeof callback === "function") {
      callback(params);
      return;
    }

    // Otherwise use React Navigation.
    if (navigation?.navigate && screenName) {
      navigation.navigate(screenName, params);
      return;
    }

    console.warn(`${screenName} is not connected.`);
  },
  [navigation]
);
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      })
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, [glow, pulse, rotate]);

  const loadWellnessData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        savedProfile,
        savedTodaySteps,
        savedActiveJourney,
        savedHydration,
        savedSleep,
        savedRecovery,
        savedStreak,
      ] = await Promise.all([
        getFirstStoredValue([
          "userProfile",
          "profile",
          "legacyWalkProfile",
        ]),

        getFirstStoredValue([
          "todaySteps",
          "dailySteps",
          "currentDaySteps",
        ]),

        getFirstStoredValue([
          "activeJourney",
          "currentJourney",
        ]),

        getFirstStoredValue([
          "hydrationData",
          "dailyHydration",
        ]),

        getFirstStoredValue([
          "sleepData",
          "dailySleep",
        ]),

        getFirstStoredValue([
          "recoveryData",
          "dailyRecovery",
        ]),

        getFirstStoredValue([
          "walkingStreak",
          "currentStreak",
        ]),
      ]);

      const profile = safelyParseJSON(
        savedProfile,
        {}
      );

      const storedJourney = safelyParseJSON(
        savedActiveJourney,
        null
      );

      const journey =
        activeJourneyProp ||
        storedJourney ||
        null;

      const hydrationData = safelyParseJSON(
        savedHydration,
        {}
      );
      const hydrationAmount = Math.max(
  0,
  Number(
    hydrationData?.amount ??
      hydrationData?.ounces ??
      hydrationData?.hydration ??
      hydrationData?.current ??
      hydrationData?.todayAmount ??
      0
  ) || 0
);

const hydrationGoal = Math.max(
  1,
  Number(
    hydrationData?.goal ??
      hydrationData?.hydrationGoal ??
      hydrationData?.dailyGoal ??
      100
  ) || 100
);

      const sleepData = safelyParseJSON(
        savedSleep,
        {}
      );

      const recoveryData = safelyParseJSON(
        savedRecovery,
        {}
      );

const steps = Math.max(
  0,
  Number(stepsValue) || 0
);

      const stepGoal = Math.max(
        1,
        Number(
          profile?.stepGoal ??
            profile?.dailyStepGoal ??
            DEFAULT_STEP_GOAL
        ) || DEFAULT_STEP_GOAL
      );

      const stepsRemaining = Math.max(
        stepGoal - steps,
        0
      );

      const rawJourneyProgress =
        journey?.progress ??
        journey?.journeyProgress ??
        journey?.progressPercent ??
        journey?.percentComplete ??
        0;

      const journeyProgress = clampNumber(
        rawJourneyProgress,
        0,
        100
      );

      const recovery =
        recoveryData?.score !== undefined &&
        recoveryData?.score !== null
          ? clampNumber(
              recoveryData.score,
              0,
              100
            )
          : null;

      const sleepHours =
        sleepData?.hours !== undefined &&
        sleepData?.hours !== null
          ? Math.max(
              0,
              Number(sleepData.hours) || 0
            )
          : null;

      const parsedStreakObject = safelyParseJSON(
        savedStreak,
        null
      );

      const streakValue =
        typeof parsedStreakObject === "object" &&
        parsedStreakObject !== null
          ? parsedStreakObject.streak ??
            parsedStreakObject.days ??
            parsedStreakObject.value ??
            0
          : savedStreak ?? 0;

      const streak = Math.max(
        0,
        Number(streakValue) || 0
      );

      const calories = Math.max(
        0,
        Math.round(steps * 0.04)
      );

      const currentCheckpoint =
        Number(
          journey?.currentCheckpoint ??
            journey?.checkpoint ??
            0
        ) || 0;

      const checkpoint =
        currentCheckpoint > 0
          ? `${Math.min(
              currentCheckpoint,
              5
            )} of 5`
          : "";

      const greeting = calculateGreeting();

      const userName =
        profile?.userName ||
        profile?.username ||
        profile?.name ||
        "Walker";

      const journeyTitle =
        journey?.shortTitle ||
        journey?.title ||
        "";

      const journeyFull =
        journey?.title ||
        journey?.name ||
        "";

      const stress =
        recoveryData?.stress ??
        recoveryData?.stressLevel ??
        profile?.stressLevel ??
        null;

      const aiMessage =
        stepsRemaining > 0
          ? `You are ${stepsRemaining.toLocaleString()} steps from today's goal.`
          : "You completed today's step goal.";

      setWellness({
        userName,
        greeting,

        steps,
        stepGoal,
        stepsRemaining,

        recovery,
        sleepHours,

        hydration,
        hydrationGoal,

        calories,
        stress,

        wellnessScore: null,
        wellnessLabel: "",

        streak,

        journey: journeyTitle,
        journeyFull,
        journeyProgress,
        checkpoint,

        aiMessage,
      });
    } catch (error) {
      console.log(
        "AI Wellness load error:",
        error
      );

      setWellness((current) => ({
        ...current,
        greeting: calculateGreeting(),
        aiMessage:
          "Wellness information is temporarily unavailable.",
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeJourneyProp]);

 useEffect(() => {
  loadWellnessData();
}, [loadWellnessData]);

  const goBackAction = () => {
  if (typeof goBack === "function") {
    goBack();
    return;
  }

  if (navigation?.canGoBack?.()) {
    navigation.goBack();
    return;
  }

  if (navigation?.navigate) {
    navigation.navigate("More");
  }
};


  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.8],
  });

  const stepProgress = useMemo(() => {
    if (!wellness.stepGoal) {
      return 0;
    }

    return clampNumber(
      (wellness.steps / wellness.stepGoal) * 100,
      0,
      100
    );
  }, [wellness.stepGoal, wellness.steps]);

  const hydrationProgress = useMemo(() => {
    if (!wellness.hydrationGoal) {
      return 0;
    }

    return clampNumber(
      (wellness.hydration /
        wellness.hydrationGoal) *
        100,
      0,
      100
    );
  }, [
    wellness.hydration,
    wellness.hydrationGoal,
  ]);

  const recoveryProgress = useMemo(() => {
    if (wellness.recovery === null) {
      return 0;
    }

    return clampNumber(
      wellness.recovery,
      0,
      100
    );
  }, [wellness.recovery]);

  const sleepProgress = useMemo(() => {
    if (wellness.sleepHours === null) {
      return 0;
    }

    return clampNumber(
      (wellness.sleepHours / 8) * 100,
      0,
      100
    );
  }, [wellness.sleepHours]);

  const calorieProgress = useMemo(() => {
  const calorieGoal = Number(wellness.stepGoal || 0) * 0.04;

  if (!calorieGoal) {
    return 0;
  }

  return clampNumber(
    (Number(wellness.calories || 0) / calorieGoal) * 100,
    0,
    100
  );
}, [wellness.calories, wellness.stepGoal]);

const insightMessage = useMemo(() => {
  const steps = Number(wellness.steps || 0);
  const goal = Number(wellness.stepGoal || 7000);
  const remaining = Math.max(goal - steps, 0);

  if (steps <= 0) {
    return "Start with a short walk today to begin building your wellness progress.";
  }

  if (remaining === 0) {
    return "You completed today’s step goal. Focus on hydration, recovery, and quality sleep.";
  }

  return `You are ${remaining.toLocaleString()} steps away from today’s goal.`;
}, [wellness.steps, wellness.stepGoal]);


const aiConfidence = useMemo(() => {
  let score = 0;

  if (Number(wellness.steps || 0) > 0) score += 30;
  if (Number(wellness.hydration || 0) > 0) score += 20;
  if (wellness.recovery != null) score += 20;
  if (wellness.sleepHours != null) score += 20;
  if (wellness.journey) score += 10;

  return clampNumber(score, 0, 100);
}, [
  wellness.steps,
  wellness.hydration,
  wellness.recovery,
  wellness.sleepHours,
  wellness.journey,
]);

const recoveryTrend = useMemo(() => {
  if (wellness.recovery == null) {
    return "Recovery not recorded";
  }

  if (wellness.recovery >= 90) {
    return "Excellent recovery";
  }

  if (wellness.recovery >= 75) {
    return "Recovery improving";
  }

  if (wellness.recovery >= 60) {
    return "Moderate recovery";
  }

  return "Recovery needs attention";
}, [wellness.recovery]);

useEffect(() => {
  const subscription = AppState.addEventListener(
    "change",
    (nextState) => {
      if (nextState === "active") {
        loadWellnessData();
      }
    }
  );

  return () => {
    subscription.remove();
  };
}, [loadWellnessData]);
    


  
 const handleBack = () => {
  if (typeof goBack === "function") {
    goBack();
    return;
  }

  if (navigation?.canGoBack?.()) {
    navigation.goBack();
    return;
  }

  navigation?.navigate?.("More");
};

const handleNotifications = () => {
  runAction(
    goToNotifications,
    "NotificationSettings"
  );
};

const handleVoiceCoach = () => {
  runAction(
    goToVoiceCoach || goToAIConversation,
    "aiConversation"
  );
};
const handleHydration = () => {
  runAction(
    goToHydration,
    "HydrationCoach"
  );
};
const handleRecovery = () => {
  runAction(goToRecovery, "RecoveryCoach");
};

const handleSleep = () => {
  runAction(goToSleep, "SleepCoach");
};

const handleBreathing = () => {
  runAction(goToBreathing, "StressBreathingCoach");
};

const handleMealPlanner = () => {
  runAction(goToMealPlanner, "MealPlanner");
};

const handleWalkingAnalytics = () => {
  runAction(goToWalkingAnalytics, "WalkingAnalytics");
};
const handleWalkHistory = () => {
  runAction(
    goToWalkHistory,
    "WalkHistory"
  );
};

const handleGoals = () => {
  runAction(
    goToGoals,
    "WellnessGoals"
  );
};

const handleJourneys = () => {
  runAction(
    goToJourneys,
    "Journeys"
  );
};

const handleJourneyStory = () => {
  runAction(
    goToJourneyStory,
    "JourneyStory",
    {
      journey:
        wellness.activeJourney ||
        activeJourneyProp ||
        null,
    }
  );
};

const handleStartWalk = async () => {
  let journey =
    wellness.activeJourney ||
    activeJourneyProp ||
    null;

  if (!journey) {
    const savedJourney = await AsyncStorage.getItem("activeJourney");

    if (savedJourney) {
      try {
        journey = JSON.parse(savedJourney);
      } catch (error) {
        console.log("Active journey parse error:", error);
      }
    }
  }

  if (journey) {
    runAction(
      goToGPSJourneyMap,
      "GPSJourneyMap",
      { journey }
    );
    return;
  }

  runAction(
    goToJourneys,
    "Journeys"
  );
};

  
   return (
  <SafeAreaView style={styles.safe}>
    <LinearGradient
      colors={["#020611", "#071A33", "#020611"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[
            "rgba(45,127,249,0.24)",
            "rgba(9,26,48,0.94)",
            "#061326",
          ]}
          style={styles.heroCard}
        >
  <Text style={styles.smallLabel}>
    {`${wellness.greeting || "Welcome"} ${
      wellness.userName || "Walker"
    }`.toUpperCase()}
  </Text>

  <Text style={styles.heroTitle}>Your AI Wellness Coach</Text>

  <Text style={styles.heroText}>
    Ready to coach your next walk, recovery, meals, hydration, and
    Legacy Journey.
  </Text>

  <View style={styles.orbWrap}>
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orbGlow,
        {
          opacity: glowOpacity,
        },
      ]}
    />

    <Animated.View
      pointerEvents="none"
      style={[
        styles.orbOuter,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    />

    <Animated.View
      pointerEvents="none"
      style={[
        styles.orbMiddle,
        {
          transform: [
            {
              rotate: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ["360deg", "0deg"],
              }),
            },
          ],
        },
      ]}
    />

    <Animated.View
      style={[
        styles.orbInner,
        {
          transform: [{ scale: pulse }],
        },
      ]}
    >
      {wellness.wellnessScore !== null &&
      wellness.wellnessScore !== undefined ? (
        <>
          <Text style={styles.orbScore}>
            {Math.round(Number(wellness.wellnessScore) || 0)}
          </Text>

          <Text style={styles.orbScoreLabel}>Score</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name="brain"
            size={54}
            color="#9DFFCF"
          />

          <Text style={styles.orbScoreLabel}>AI Coach</Text>
        </>
      )}
    </Animated.View>
  </View>

  <View style={styles.aiStatusRow}>
    <View style={styles.statusDot} />

    <Text style={styles.aiStatusText}>
      {aiStatus || "AI Ready"}
    </Text>
  </View>

  <Text style={styles.aiStatusMessage}>
    {wellness.aiMessage ||
      "Your AI coach is ready to help with your next wellness goal."}
  </Text>

 <TouchableOpacity
  style={styles.voiceButton}
  activeOpacity={0.85}
  onPress={handleVoiceCoach}
>
    <Ionicons name="mic" size={26} color="#020611" />

    <Text style={styles.voiceButtonText}>
      Talk to Your Coach
    </Text>

    <Ionicons
      name="arrow-forward"
      size={21}
      color="#020611"
    />
  </TouchableOpacity>

  
  <View style={styles.heroActions}>
  <HeroAction
    icon="walk"
    title="Walk"
    onPress={handleStartWalk}
  />

  <HeroAction
    icon="leaf"
    title="Calm"
    onPress={handleBreathing}
  />

  <HeroAction
    icon="restaurant"
    title="Meal"
    onPress={handleMealPlanner}
  />
</View>
</LinearGradient>

                            <Text style={styles.sectionTitle}>Today’s Wellness</Text>

            <QuickStatCard
  icon="walk"
  title="Steps"
  value={`${Number(wellness.steps || 0).toLocaleString()} / ${Number(
    wellness.stepGoal || 7000
  ).toLocaleString()}`}
  progress={stepProgress}
  color="#44F58A"
  onPress={() =>
    runAction(
      goToWalkingAnalytics,
      "WalkingAnalytics"
    )
  }
/>
<QuickStatCard
  icon="water"
  title="Hydration"
  value={`${Number(wellness.hydration || 0)} / ${Number(
    wellness.hydrationGoal || 100
  )} oz`}
  progress={hydrationProgress}
  color="#38D6FF"
  onPress={() =>
    runAction(
      goToHydration,
      "HydrationCoach"
    )
  }
/>
              
                      <QuickStatCard
  icon="heart"
  title="Recovery"
  value={
    wellness.recovery != null
      ? `${wellness.recovery}%`
      : "Not recorded"
  }
  progress={recoveryProgress}
  color="#FF5A6A"
  onPress={() =>
    runAction(
      goToRecovery,
      "RecoveryCoach"
    )
  }
/>

<QuickStatCard
  icon="moon"
  title="Sleep"
  value={
    wellness.sleepHours != null
      ? `${Number(wellness.sleepHours).toFixed(1)}h`
      : "Not recorded"
  }
  progress={sleepProgress}
  color="#A66CFF"
  onPress={() =>
    runAction(
      goToSleep,
      "SleepCoach"
    )
  }
/>

<QuickStatCard
  icon="flame"
  title="Calories"
  value={Number(wellness.calories || 0).toLocaleString()}
  progress={calorieProgress}
  color="#FF9F1C"
  onPress={() =>
    runAction(
      goToWalkingAnalytics,
      "WalkingAnalytics"
    )
  }
/>

<QuickStatCard
  icon="map"
  title="Journey"
  value={wellness.journey || "No active journey"}
  progress={wellness.journeyProgress || 0}
  color="#2D7FF9"
  onPress={() =>
    runAction(
      goToGPSJourneyMap,
      "GPSJourneyMap",
      {
        journey:
          activeJourneyProp ||
          wellness.activeJourney ||
          null,
      }
    )
  }
/>

<QuickStatCard
  icon="trophy"
  title="Streak"
  value={`${Number(wellness.streak || 0)} Days`}
  progress={clampNumber(
    (Number(wellness.streak || 0) / 7) * 100,
    0,
    100
  )}
  color="#F7C948"
  onPress={() => navTo("Achievement")}
/>
            

              <Text style={styles.sectionTitle}>AI Insight</Text>

            <AIInsightCard
  title="Today's Recommendation"
  message={insightMessage}
  confidence={aiConfidence}
  trend={recoveryTrend}
  action="Start Walk"
  onPress={handleStartWalk}
/>

              <Text style={styles.sectionTitle}>AI Activity Feed</Text>

              <View style={styles.activityContainer}>
                <ActivityItem
                  icon="walk"
                  color="#44F58A"
                  title="Walk Progress"
                 subtitle={`You walked ${Number(
  wellness.steps || 0
).toLocaleString()} steps today.`}
                />

            

                <ActivityItem
  icon="flag"
  color="#2D7FF9"
  title="Journey Progress"
  subtitle={
    wellness.journey
      ? `${wellness.checkpoint || "Journey in progress"} — ${wellness.journey}`
      : "No active journey."
  }
  time={wellness.journey ? "Today" : ""}
/>

               <ActivityItem
  icon="heart"
  color="#FF5A6A"
  title="Recovery"
  subtitle={
    wellness.recovery != null
      ? `Recovery score: ${Math.round(Number(wellness.recovery))}%`
      : "Recovery not recorded."
  }
  time={wellness.recovery != null ? "Today" : ""}
/>
              </View>

            

             

        

          {activeTab === "Wellness" && (
            <View>
              <Text style={styles.sectionTitle}>Wellness Overview</Text>

             <View style={styles.quickStatsGrid}>
  <QuickStatCard
    icon="walk"
    title="Steps"
    value={`${Number(wellness.steps || 0).toLocaleString()} / ${Number(
      wellness.stepGoal || 7000
    ).toLocaleString()}`}
    progress={stepProgress}
    color="#44F58A"
    onPress={() =>
      runAction(
        goToWalkingAnalytics,
        "WalkingAnalytics"
      )
    }
  />

  <QuickStatCard
    icon="heart"
    title="Recovery"
    value={
      wellness.recovery != null
        ? `${wellness.recovery}%`
        : "Not recorded"
    }
    progress={recoveryProgress}
    color="#FF5A6A"
    onPress={() =>
      runAction(
        goToRecovery,
        "RecoveryCoach"
      )
    }
  />

  <QuickStatCard
    icon="moon"
    title="Sleep"
    value={
      wellness.sleepHours != null
        ? `${Number(wellness.sleepHours).toFixed(1)}h`
        : "Not recorded"
    }
    progress={sleepProgress}
    color="#A66CFF"
    onPress={() =>
      runAction(
        goToSleep,
        "SleepCoach"
      )
    }
  />

  <QuickStatCard
    icon="water"
    title="Hydration"
    value={`${Number(wellness.hydration || 0)} / ${Number(
      wellness.hydrationGoal || 100
    )} oz`}
    progress={hydrationProgress}
    color="#38D6FF"
    onPress={() =>
      runAction(
        goToHydration,
        "HydrationCoach"
      )
    }
  />

  <QuickStatCard
    icon="flame"
    title="Calories"
    value={Number(wellness.calories || 0).toLocaleString()}
    progress={calorieProgress}
    color="#FF9F1C"
    onPress={() =>
      runAction(
        goToWalkingAnalytics,
        "WalkingAnalytics"
      )
    }
  />

  <QuickStatCard
    icon="leaf"
    title="Stress"
    value={wellness.stress || "Not recorded"}
    progress={stressProgress}
    color="#64FFD2"
    onPress={() =>
      runAction(
        goToBreathing,
        "StressBreathingCoach"
      )
    }
  />
</View>

              <LinearGradient
                colors={["#0A2442", "#08192F", "#051120"]}
                style={styles.largeCard}
              >
                <Text style={styles.cardTitle}>AI Wellness Summary</Text>
                <Text style={styles.cardText}>
                  Your activity and recovery are trending strong. Keep hydration
                  steady and aim for 8 hours of sleep tonight.
                </Text>
              </LinearGradient>
            </View>
          )}

          {activeTab === "Coach" && (
            <View>
              <Text style={styles.sectionTitle}>AI Coaching Tools</Text>

              <View style={styles.quickStatsGrid}>
                <ActionCard
                  icon="restaurant"
                  title="Meal Plan"
                  onPress={() => navTo("MealPlanner")}
                />

                <ActionCard
                  icon="water"
                  title="Hydration"
                  onPress={() => navTo("HydrationCoach")}
                />

                <ActionCard
                  icon="heart"
                  title="Recovery"
                  onPress={() => navTo("RecoveryCoach")}
                />

                <ActionCard
                  icon="moon"
                  title="Sleep"
                  onPress={() => navTo("SleepCoach")}
                />

                <ActionCard
                  icon="leaf"
                  title="Breathing"
                  onPress={() => navTo("StressBreathingCoach")}
                />

                <ActionCard
                  icon="sparkles"
                  title="Motivation"
                  onPress={() => navTo("MotivationCoach")}
                />
              </View>
            </View>
          )}

          {activeTab === "Journey" && (
            <View>
              <Text style={styles.sectionTitle}>Journey Coach</Text>

              <LinearGradient
                colors={["#132A46", "#0B1D35", "#071221"]}
                style={styles.largeCard}
              >
                <Text style={styles.smallLabel}>CURRENT JOURNEY</Text>

                <Text style={styles.cardTitle}>{wellness.journeyFull}</Text>

                <Text style={styles.cardText}>
                  Checkpoint {wellness.checkpoint} •{" "}
                  {wellness.journeyProgress}% complete • 112.4 miles remaining
                </Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${wellness.journeyProgress}%` },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.goldButton}
                  onPress={() => navTo("GPSJourneyMap")}
                >
                  <Text style={styles.goldButtonText}>Continue Journey</Text>
                  <Ionicons name="arrow-forward" size={20} color="#020611" />
                </TouchableOpacity>
              </LinearGradient>

              <Text style={styles.sectionTitle}>AI Route Plan</Text>

              <ActivityItem
                icon="flag"
                color="#2D7FF9"
                title="Next Checkpoint"
                subtitle="Checkpoint 4 is your next target."
                time="This week"
              />

              <ActivityItem
                icon="speedometer"
                color="#44F58A"
                title="Suggested Pace"
                subtitle="Keep a steady moderate pace."
                time="AI"
              />

              <ActivityItem
                icon="walk"
                color="#F7C948"
                title="Daily Goal"
                subtitle="Walk 7,000 steps today."
                time="Today"
              />
            </View>
          )}

        

             


          <View style={{ height: 180 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function HeroAction({ icon, title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.heroAction}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons
        name={icon}
        size={24}
        color="#020611"
      />

      <Text style={styles.heroActionText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
function QuickStatCard({ icon, title, value, progress, color, onPress }) {
  const safeProgress = Math.min(
  100,
  Math.max(0, Number(progress) || 0)
);
  return (
    <TouchableOpacity style={styles.quickStatCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.quickStatTop}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.quickStatTitle}>{title}</Text>
      </View>

      <Text style={styles.quickStatValue}>{value}</Text>

      <View style={styles.quickProgressTrack}>
        <View
          style={[
            styles.quickProgressFill,
            {
              width: `${safeProgress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

function ActionCard({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={28} color="#F7C948" />
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function AIInsightCard({ title, message, confidence, trend, action, onPress }) {
  return (
    <LinearGradient colors={["#0A2442", "#08192F", "#051120"]} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={18} color="#F7C948" />
          <Text style={styles.aiBadgeText}>LEGACY AI</Text>
        </View>

        <View style={styles.confidenceBox}>
          <Text style={styles.confidenceNumber}>{confidence}%</Text>
          <Text style={styles.confidenceLabel}>Confidence</Text>
        </View>
      </View>

      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={styles.insightMessage}>{message}</Text>

      <View style={styles.trendRow}>
        <Ionicons name="trending-up" size={18} color="#44F58A" />
        <Text style={styles.trendText}>Recovery trending {trend} from yesterday</Text>
      </View>

      <TouchableOpacity style={styles.insightButton} onPress={onPress}>
        <Ionicons name="walk" size={22} color="#020611" />
        <Text style={styles.insightButtonText}>{action}</Text>
        <Ionicons name="arrow-forward" size={18} color="#020611" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

function ActivityItem({ icon, color, title, subtitle, time }) {
  return (
    <View style={styles.activityCard}>
      <View style={[styles.activityIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}


function ElitePreviewCard({ subscription, onUpgrade, onLearnMore }) {
  const features = [
    {
      icon: "mic",
      title: "Voice AI Coach",
      description: "Natural voice conversations while you walk.",
    },
    {
      icon: "analytics",
      title: "Advanced Analytics",
      description: "Detailed wellness trends and predictions.",
    },
    {
      icon: "heart",
      title: "Recovery Forecast",
      description: "AI-powered recovery and readiness insights.",
    },
    {
      icon: "map",
      title: "Journey Narrator",
      description: "Historical storytelling during every Legacy Journey.",
    },
    {
      icon: "restaurant",
      title: "Meal Planning",
      description: "Personalized nutrition recommendations.",
    },
    {
      icon: "sparkles",
      title: "AI Memory",
      description: "A coach that remembers your habits and goals.",
    },
  ];

  return (
    <LinearGradient colors={["#1A1133", "#0C1832", "#050A18"]} style={styles.eliteCard}>
      <View style={styles.eliteHeader}>
        <View style={styles.eliteBadge}>
          <Ionicons name="diamond" size={18} color="#F7C948" />
          <Text style={styles.eliteBadgeText}>ELITE AI</Text>
        </View>

        <Text style={styles.planText}>{subscription.toUpperCase()} PLAN</Text>
      </View>

      <Text style={styles.eliteTitle}>Unlock Your Full AI Coach</Text>

      <Text style={styles.eliteSubtitle}>
        Premium coaching, personalized wellness intelligence, and exclusive AI-powered tools.
      </Text>

      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <Ionicons name={feature.icon} size={20} color="#F7C948" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        </View>
      ))}

      <View style={styles.eliteButtonRow}>
        <TouchableOpacity style={styles.learnMoreButton} onPress={onLearnMore}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
          <Ionicons name="diamond" size={20} color="#020611" />
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  headerSubtitle: {
    color: "#F7C948",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 3,
  },

  tabScroll: {
    maxHeight: 76,
    marginBottom: 18,
  },

  tabContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 10,
  },

  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: "#091A30",
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  activeTabButton: {
    backgroundColor: "#F7C948",
    borderColor: "#F7C948",
  },

  tabText: {
    color: "#AAB8C8",
    fontSize: 13,
    fontWeight: "900",
  },

  activeTabText: {
    color: "#020611",
  },

 heroCard: {
  marginHorizontal: 20,
  marginTop: 14,
  borderRadius: 34,
  paddingHorizontal: 24,
  paddingVertical: 28,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.14)",
  overflow: "hidden",
},

smallLabel: {
  color: "#F7C948",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 1.4,
  textAlign: "center",
},

heroTitle: {
  color: "#FFFFFF",
  fontSize: 30,
  lineHeight: 36,
  fontWeight: "900",
  textAlign: "center",
  marginTop: 10,
},

heroText: {
  color: "#B8C5D6",
  fontSize: 15,
  lineHeight: 23,
  textAlign: "center",
  marginTop: 12,
  maxWidth: 340,
},

orbWrap: {
  width: 218,
  height: 218,
  marginVertical: 26,
  justifyContent: "center",
  alignItems: "center",
},

orbGlow: {
  position: "absolute",
  width: 210,
  height: 210,
  borderRadius: 105,
  backgroundColor: "#44F58A",
},

orbOuter: {
  position: "absolute",
  width: 200,
  height: 200,
  borderRadius: 100,
  borderWidth: 4,
  borderColor: "#2D7FF9",
  borderStyle: "dashed",
},

orbMiddle: {
  position: "absolute",
  width: 168,
  height: 168,
  borderRadius: 84,
  borderWidth: 3,
  borderColor: "#F7C948",
  borderStyle: "dotted",
},

orbInner: {
  width: 136,
  height: 136,
  borderRadius: 68,
  backgroundColor: "#061326",
  borderWidth: 2,
  borderColor: "#44F58A",
  justifyContent: "center",
  alignItems: "center",
},

orbScore: {
  color: "#FFFFFF",
  fontSize: 42,
  fontWeight: "900",
},

orbScoreLabel: {
  color: "#44F58A",
  fontSize: 13,
  fontWeight: "900",
  marginTop: 2,
},

aiStatusRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(68,245,138,0.12)",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#44F58A",
},

statusDot: {
  width: 9,
  height: 9,
  borderRadius: 5,
  backgroundColor: "#44F58A",
  marginRight: 8,
},

aiStatusText: {
  color: "#9DFFCF",
  fontSize: 13,
  fontWeight: "900",
},

aiStatusMessage: {
  color: "#DCE7F5",
  fontSize: 14,
  lineHeight: 22,
  textAlign: "center",
  marginTop: 16,
  maxWidth: 340,
},

voiceButton: {
  width: "100%",
  minHeight: 58,
  borderRadius: 29,
  backgroundColor: "#F7C948",
  marginTop: 22,
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

voiceButtonText: {
  color: "#020611",
  fontSize: 16,
  fontWeight: "900",
  marginHorizontal: 10,
},

heroActions: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 18,
},

heroAction: {
  width: "31%",
  minHeight: 74,
  borderRadius: 20,
  backgroundColor: "#F7C948",
  alignItems: "center",
  justifyContent: "center",
},

heroActionText: {
  color: "#020611",
  fontSize: 12,
  fontWeight: "900",
  marginTop: 6,
},

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },

  quickStatsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 14,
},

quickStatCard: {
  width: "48%",
  minHeight: 170,
  padding: 18,
  borderRadius: 24,
  marginBottom: 14,
},

  quickStatTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  quickStatTitle: {
    color: "#AAB8C8",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 8,
  },

  quickStatValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
  },

  quickProgressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 14,
    overflow: "hidden",
  },

  quickProgressFill: {
    height: "100%",
    borderRadius: 8,
  },

  insightCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247,201,72,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },

  aiBadgeText: {
    color: "#F7C948",
    marginLeft: 8,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },

  confidenceBox: {
    alignItems: "center",
  },

  confidenceNumber: {
    color: "#44F58A",
    fontSize: 28,
    fontWeight: "900",
  },

  confidenceLabel: {
    color: "#AAB8C8",
    fontSize: 11,
    fontWeight: "700",
  },

  insightTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 20,
  },

  insightMessage: {
    color: "#C7D5E4",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
  },

  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  trendText: {
    color: "#44F58A",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
  },

  insightButton: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F7C948",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  insightButtonText: {
    color: "#020611",
    fontSize: 16,
    fontWeight: "900",
    marginHorizontal: 10,
  },

  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#091A30",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  activitySubtitle: {
    color: "#AAB8C8",
    fontSize: 13,
    marginTop: 4,
  },

  activityTime: {
    color: "#7A8EA6",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },

  


  hallButton: {
    flex: 1,
    height: 52,
    backgroundColor: "#0E2746",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1B3353",
    marginLeft: 8,
  },

  hallButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
  },
eliteCard: {
  marginHorizontal: 20,
  marginTop: 20,
},

  eliteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eliteBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247,201,72,0.12)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  eliteBadgeText: {
    color: "#F7C948",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 8,
    letterSpacing: 1,
  },

  planText: {
    color: "#AAB8C8",
    fontSize: 12,
    fontWeight: "800",
  },

  eliteTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 20,
  },

  eliteSubtitle: {
    color: "#B8C5D6",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
  },

  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(247,201,72,0.10)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  featureTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  featureDescription: {
    color: "#AAB8C8",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },

  eliteButtonRow: {
    flexDirection: "row",
    marginTop: 30,
  },

  learnMoreButton: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#112541",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#284A73",
    marginRight: 8,
  },

  learnMoreText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  upgradeButton: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F7C948",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
  },

  upgradeButtonText: {
    color: "#020611",
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },

  largeCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
  },

  cardText: {
    color: "#B8C5D6",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  progressTrack: {
    height: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#44F58A",
  },

  goldButton: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F7C948",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  goldButtonText: {
    color: "#020611",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 8,
  },

  actionCard: {
    width: "48%",
    minHeight: 118,
    backgroundColor: "#091A30",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  actionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },
});