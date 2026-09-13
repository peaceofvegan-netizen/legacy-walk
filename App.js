import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AppState,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  isStepTrackingAvailable,
  syncTodaySteps,
} from "./utils/stepTrackingEngine";

import { translate, loadLanguage } from "./i18n/i18n";
import { AVATARS } from "./data/avatarCatalog";
import { useStepCounter } from "./hooks/useStepCounter";

import PassportDetailScreen from "./screens/PassportDetailScreen";
import WalkingDashboardScreen from "./screens/WalkingDashboardScreen";
import JourneysScreen from "./screens/JourneysScreen";
import JourneyDetailScreen from "./screens/JourneyDetailScreen";
import GPSJourneyMapScreen from "./screens/GPSJourneyMapScreen";
import WalkingFunctionScreen from "./screens/WalkingFunctionScreen";
import RewardsScreen from "./screens/RewardsScreen";
import MoreScreen from "./screens/MoreScreen";

import RecoveryCoachScreen from "./screens/RecoveryCoachScreen";
import HydrationCoachScreen from "./screens/HydrationCoachScreen";
import SleepCoachScreen from "./screens/SleepCoachScreen";
import BreathingScreen from "./screens/BreathingScreen";
import BreathingAnalyticsScreen from "./screens/BreathingAnalyticsScreen";
import WalkingAnalyticsScreen from "./screens/WalkingAnalyticsScreen";
import AIConversationScreen from "./screens/AIConversationScreen";
import AIWellnessMasterScreen from "./screens/AIWellnessMasterScreen";

import AvatarCenterScreen from "./screens/AvatarCenterScreen";
import AvatarProfileScreen from "./screens/AvatarProfileScreen";

import PassportScreen from "./screens/PassportScreen";
import MarathonScreen from "./screens/MarathonScreen";
import WorldMarathonDetailScreen from "./screens/WorldMarathonDetailScreen";

import JourneyPreferencesScreen from "./screens/JourneyPreferencesScreen";
import PersonalizationSummaryScreen from "./screens/PersonalizationSummaryScreen";

import SubscriptionCheckoutScreen from "./screens/SubscriptionCheckoutScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";

import MealPlannerScreen from "./screens/MealPlannerScreen";
import HallOfLegendsScreen from "./screens/HallOfLegendsScreen";
import CertificateScreen from "./screens/CertificateScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";
import AboutScreen from "./screens/AboutScreen";

import PhysicalMerchStoreScreen from "./screens/PhysicalMerchStoreScreen";
import StoreItemDetailScreen from "./screens/StoreItemDetailScreen";
import PurchaseConfirmationScreen from "./screens/PurchaseConfirmationScreen";

import CommunityScreen from "./screens/CommunityScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import DailyChallengeScreen from "./screens/DailyChallengeScreen";

import SettingsScreen from "./screens/SettingScreen";
import PrivacyPolicyScreen from "./screens/PrivacyScreen";
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import WCoinWalletScreen from "./screens/WCoinWalletScreen";
import PaywallScreen from "./screens/PaywallScreen";
import JourneyStoryScreen from "./screens/JourneyStoryScreen";

const WCOIN_KEY = "wCoinBalance";

function NavButton({
  icon,
  label,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.navButton}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Image
        source={icon}
        style={[
          styles.navIconImage,
          active && styles.activeNavIcon,
        ]}
      />

      <Text
        style={[
          styles.navText,
          active && styles.activeNavText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [
    selectedLegathonLevel,
    setSelectedLegathonLevel,
  ] = useState(1);

  const [
    selectedLegathonWorld,
    setSelectedLegathonWorld,
  ] = useState(1);

  const [
    legathonStarsEarned,
    setLegathonStarsEarned,
  ] = useState(0);

  const [lifetimeSteps, setLifetimeSteps] =
    useState(0);

  const [language, setLanguage] =
    useState("en");

  const [lastJourney, setLastJourney] =
    useState(null);

  const [selectedJourney, setSelectedJourney] =
    useState(null);

  const [
    selectedStoreItem,
    setSelectedStoreItem,
  ] = useState(null);

  const [
    selectedPassport,
    setSelectedPassport,
  ] = useState(null);

  const [equippedAvatar, setEquippedAvatar] =
    useState(null);

  const [
    subscriptionPlan,
    setSubscriptionPlan,
  ] = useState("free");

  const [isPremium, setIsPremium] =
    useState(false);

  const walkingData = useStepCounter();

  const [totalSteps, setTotalSteps] =
    useState(0);

  const [wCoinBalance, setWCoinBalance] =
    useState(0);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [
    selectedStoryCheckpoint,
    setSelectedStoryCheckpoint,
  ] = useState(1);

  const [
    selectedMarathonId,
    setSelectedMarathonId,
  ] = useState("nyc");

  // ============================================================
  // WCOIN FUNCTIONS
  // ============================================================

  async function addWCoins(amount) {
    const saved = await AsyncStorage.getItem(
      WCOIN_KEY
    );

    const current = Number(saved || 0);
    const updated =
      current + Number(amount || 0);

    await AsyncStorage.setItem(
      WCOIN_KEY,
      String(updated)
    );

    setWCoinBalance(updated);

    console.log("Saved WCoins:", updated);

    alert(`W Coins now: ${updated}`);
  }

  async function spendWCoins(amount) {
    const saved = await AsyncStorage.getItem(
      WCOIN_KEY
    );

    const current = Number(saved || 0);
    const cost = Number(amount || 0);

    if (current < cost) {
      alert("Not enough W Coins");
      return false;
    }

    const updated = current - cost;

    await AsyncStorage.setItem(
      WCOIN_KEY,
      String(updated)
    );

    setWCoinBalance(updated);

    alert(
      `Purchase complete. W Coins left: ${updated}`
    );

    return true;
  }

  async function awardJourneyRewards(journey) {
    if (!journey?.id) {
      return false;
    }

    const rewardKey =
      `journeyRewarded_${journey.id}`;

    const alreadyRewarded =
      await AsyncStorage.getItem(rewardKey);

    if (alreadyRewarded === "true") {
      alert("Journey reward already claimed.");
      return false;
    }

    const points = Number(
      journey.rewardPoints || 0
    );

    const coins = Number(
      journey.rewardCoins || 0
    );

    const savedPoints =
      await AsyncStorage.getItem(
        "rewardPoints"
      );

    const updatedPoints =
      Number(savedPoints || 0) + points;

    await AsyncStorage.setItem(
      "rewardPoints",
      String(updatedPoints)
    );

    await AsyncStorage.setItem(
      rewardKey,
      "true"
    );

    if (coins > 0) {
      await addWCoins(coins);
    }

    alert(
      `Journey Complete!\n+${points} Legathon Points\n+${coins} W Coins\nPassport Stamp Unlocked`
    );

    setSelectedPassport(journey);
    setActiveTab("worldPassport");

    return true;
  }

  // ============================================================
  // GLOBAL STEP ROUTER
  // ============================================================

  const appStateRef = useRef(
    AppState.currentState
  );

  const stepSyncRunningRef =
    useRef(false);

  const stepSyncTimerRef =
    useRef(null);

  const runGlobalStepSync =
    useCallback(async () => {
      if (stepSyncRunningRef.current) {
        return;
      }

      stepSyncRunningRef.current = true;

      try {
        const available =
          await isStepTrackingAvailable();

        if (!available) {
          return;
        }

        const result =
          await syncTodaySteps();

        if (__DEV__) {
          console.log(
            "[GLOBAL STEP ROUTER]",
            {
              delta:
                result?.delta ?? 0,

              destination:
                result?.destination ??
                null,

              marathonId:
                result?.marathonId ??
                null,

              synced:
                result?.synced === true,
            }
          );
        }
      } catch (error) {
        console.log(
          "Global step router error:",
          error
        );
      } finally {
        stepSyncRunningRef.current = false;
      }
    }, []);

  // ============================================================
  // INITIAL STEP SYNC
  // ============================================================

  useEffect(() => {
    runGlobalStepSync();
  }, [runGlobalStepSync]);

  // ============================================================
  // APP-WIDE STEP SYNC
  // ============================================================

  useEffect(() => {
    const startStepSync = () => {
      if (stepSyncTimerRef.current) {
        return;
      }

      stepSyncTimerRef.current =
        setInterval(() => {
          runGlobalStepSync();
        }, 5000);
    };

    const stopStepSync = () => {
      if (!stepSyncTimerRef.current) {
        return;
      }

      clearInterval(
        stepSyncTimerRef.current
      );

      stepSyncTimerRef.current = null;
    };

    if (
      AppState.currentState === "active"
    ) {
      startStepSync();
    }

    const subscription =
      AppState.addEventListener(
        "change",
        (nextState) => {
          const previousState =
            appStateRef.current;

          appStateRef.current =
            nextState;

          if (nextState === "active") {
            runGlobalStepSync();
            startStepSync();
            return;
          }

          if (
            previousState === "active" &&
            (
              nextState === "inactive" ||
              nextState === "background"
            )
          ) {
            runGlobalStepSync();
            stopStepSync();
          }
        }
      );

    return () => {
      stopStepSync();
      subscription.remove();
    };
  }, [runGlobalStepSync]);
    // ============================================================
  // LOAD SAVED APP DATA
  // ============================================================

  useEffect(() => {
    async function initLanguage() {
      try {
        const savedLanguage =
          await loadLanguage();

        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.log(
          "Language load error:",
          error
        );
      }
    }

    initLanguage();
  }, []);

  useEffect(() => {
    async function loadWCoins() {
      try {
        const saved =
          await AsyncStorage.getItem(
            WCOIN_KEY
          );

        setWCoinBalance(
          Number(saved || 0)
        );
      } catch (error) {
        console.log(
          "WCoin load error:",
          error
        );
      }
    }

    loadWCoins();
  }, []);

  useEffect(() => {
    async function loadLastJourney() {
      try {
        const saved =
          await AsyncStorage.getItem(
            "lastJourney"
          );

        if (saved) {
          const journey =
            JSON.parse(saved);

          setLastJourney(journey);
          setSelectedJourney(journey);
        }
      } catch (error) {
        console.log(
          "Last journey load error:",
          error
        );
      }
    }

    loadLastJourney();
  }, []);

  // ============================================================
  // NAVIGATION HELPERS
  // ============================================================

  const goHome = () => {
    setActiveTab("home");
  };

  const goMore = () => {
    setActiveTab("more");
  };

  const openJourneyDetail =
    async (journey) => {
      setSelectedJourney(journey);
      setLastJourney(journey);

      await AsyncStorage.setItem(
        "lastJourney",
        JSON.stringify(journey)
      );

      setActiveTab("journeyDetail");
    };

  const openGPSJourneyMap =
    async (journey) => {
      setSelectedJourney(journey);
      setLastJourney(journey);

      await AsyncStorage.setItem(
        "lastJourney",
        JSON.stringify(journey)
      );

      setActiveTab("journeyMap");
    };

  const openStoreItemDetail = (item) => {
    setSelectedStoreItem(item);
    setActiveTab("storeItemDetail");
  };

  const goToPurchaseConfirmation =
    (item) => {
      setSelectedStoreItem(item);
      setActiveTab(
        "purchaseConfirmation"
      );
    };

  // ============================================================
  // SCREEN ROUTER
  // ============================================================

  const screen =
    activeTab === "home" ? (
      <WalkingDashboardScreen
        language={language}
        currentAvatar={equippedAvatar}
        activeJourney={selectedJourney}
        goToJourneys={() =>
          setActiveTab("journeys")
        }
        goToGPSJourneyMap={() => {
          const journeyToOpen =
            lastJourney ||
            selectedJourney;

          if (journeyToOpen) {
            openGPSJourneyMap(
              journeyToOpen
            );
          } else {
            setActiveTab("journeys");
          }
        }}
        goToPassport={() =>
          setActiveTab("passport")
        }
        goToAvatarProfile={() =>
          setActiveTab("avatarProfile")
        }
        goToRewards={() =>
          setActiveTab("rewards")
        }
        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
        goToLegathons={() =>
          setActiveTab("legathons")
        }
      />

    ) : activeTab === "journeys" ? (
      <JourneysScreen
        language={language}
        activeJourney={selectedJourney}
        setSelectedJourney={
          setSelectedJourney
        }
        goToJourneyDetail={
          openJourneyDetail
        }
        goToGPSJourneyMap={
          openGPSJourneyMap
        }
        goToSubscription={() =>
          setActiveTab("subscription")
        }
        goBack={goHome}
        subscriptionPlan={
          subscriptionPlan
        }
      />

    ) : activeTab ===
      "journeyDetail" ? (
      <JourneyDetailScreen
        journey={selectedJourney}
        goBack={() =>
          setActiveTab("journeys")
        }
        startJourney={(journey) => {
          const requiredPlan =
            journey?.accessLevel ||
            (
              journey?.premium
                ? "premium"
                : "free"
            );

          const currentPlan =
            String(
              subscriptionPlan ||
              "free"
            ).toLowerCase();

          const canStart =
            requiredPlan === "free" ||
            (
              requiredPlan ===
                "premium" &&
              (
                currentPlan ===
                  "premium" ||
                currentPlan ===
                  "elite"
              )
            ) ||
            (
              requiredPlan ===
                "elite" &&
              currentPlan === "elite"
            );

          if (!canStart) {
            setSelectedJourney(
              journey
            );

            setActiveTab(
              "subscription"
            );

            return;
          }

          setSelectedJourney(journey);
          setLastJourney(journey);
          setActiveTab("journeyMap");
        }}
        goToSubscription={() =>
          setActiveTab("subscription")
        }
        subscriptionPlan={
          subscriptionPlan
        }
        lifetimeSteps={lifetimeSteps}
      />

    ) : activeTab ===
      "subscriptionCheckout" ? (
      <SubscriptionCheckoutScreen
        selectedPlan={selectedPlan}
        subscriptionPlan={
          subscriptionPlan
        }
        goBack={() =>
          setActiveTab("subscription")
        }
        onConfirm={(plan) => {
          setSubscriptionPlan(plan);
          setIsPremium(
            plan !== "free"
          );
          setActiveTab("home");
        }}
      />

    ) : activeTab ===
      "mealPlanner" ? (
      <MealPlannerScreen
        language={language}
        goBack={() =>
          setActiveTab("aiCoach")
        }
      />

    ) : activeTab ===
      "journeyMap" ? (
      <GPSJourneyMapScreen
        language={language}
        selectedJourney={
          typeof selectedJourney ===
          "object"
            ? selectedJourney
            : typeof lastJourney ===
              "object"
            ? lastJourney
            : {
                id:
                  selectedJourney ||
                  lastJourney ||
                  "",
                title:
                  selectedJourney ||
                  lastJourney ||
                  "Legathon Journey",
              }
        }
        activeJourney={
          typeof selectedJourney ===
          "object"
            ? selectedJourney
            : typeof lastJourney ===
              "object"
            ? lastJourney
            : {
                id:
                  selectedJourney ||
                  lastJourney ||
                  "",
                title:
                  selectedJourney ||
                  lastJourney ||
                  "Legathon Journey",
              }
        }
        journey={
          typeof selectedJourney ===
          "object"
            ? selectedJourney
            : typeof lastJourney ===
              "object"
            ? lastJourney
            : {
                id:
                  selectedJourney ||
                  lastJourney ||
                  "",
                title:
                  selectedJourney ||
                  lastJourney ||
                  "Legathon Journey",
              }
        }
        goBack={() =>
          setActiveTab(
            "journeyDetail"
          )
        }
        goToDetail={() =>
          setActiveTab(
            "journeyDetail"
          )
        }
        awardJourneyRewards={
          awardJourneyRewards
        }
        goToStory={(
          checkpointNumber
        ) => {
          setSelectedStoryCheckpoint(
            Number(
              checkpointNumber || 1
            )
          );

          setActiveTab(
            "journeyStory"
          );
        }}
      />

    ) : activeTab ===
      "journeyPreferences" ? (
      <JourneyPreferencesScreen
        goToSummary={() =>
          setActiveTab(
            "personalizationSummary"
          )
        }
        goBack={() =>
          setActiveTab("home")
        }
      />

    ) : activeTab ===
      "personalizationSummary" ? (
      <PersonalizationSummaryScreen
        startLegacy={() =>
          setActiveTab("journeys")
        }
        editPreferences={() =>
          setActiveTab(
            "journeyPreferences"
          )
        }
      />

    ) : activeTab === "paywall" ? (
      <PurchaseConfirmationScreen
        language={language}
        item={{
          title:
            selectedPlan === "elite"
              ? "Elite Membership"
              : "Premium Membership",

          price:
            selectedPlan === "elite"
              ? "$9.99/mo"
              : "$4.99/mo",

          type: "subscription",
          plan: selectedPlan,
        }}
        goBack={() =>
          setActiveTab("subscription")
        }
        goHome={() =>
          setActiveTab("home")
        }
        goToInventory={() =>
          setActiveTab("subscription")
        }
      />

    ) : activeTab === "rewards" ? (
      <RewardsScreen
        language={language}
        wCoinBalance={wCoinBalance}
        addWCoins={addWCoins}
      />
          ) : activeTab ===
      "avatarCenter" ? (
      <AvatarCenterScreen
        language={language}
        goBack={goHome}
      />

    ) : activeTab === "more" ? (
      <MoreScreen
        language={language}
        goToProfile={() =>
          setActiveTab("profile")
        }
        goToSubscription={() =>
          setActiveTab("subscription")
        }
        goToPassport={() =>
          setActiveTab("passport")
        }
        goToCertificate={() =>
          setActiveTab("certificate")
        }
        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
        goToAICoach={() =>
          setActiveTab("aiCoach")
        }
        goToGPSJourneyMap={() =>
          setActiveTab("journeyMap")
        }
        goToJourneyStory={() =>
          setActiveTab("journeyStory")
        }
        goToLegathons={() =>
          setActiveTab("legathons")
        }
        goToCommunity={() =>
          setActiveTab("community")
        }
        goToLeaderboard={() =>
          setActiveTab("leaderboard")
        }
        goToHallOfLegends={() =>
          setActiveTab(
            "hallOfLegends"
          )
        }
        goToDailyChallenge={() =>
          setActiveTab(
            "dailyChallenge"
          )
        }
        goToPhysicalStore={() =>
          setActiveTab("physicalMerch")
        }
        goToMarketplace={() =>
          setActiveTab("physicalMerch")
        }
        goToInventory={() =>
          setActiveTab("physicalMerch")
        }
        goToWCoinWallet={() =>
          setActiveTab("wCoinWallet")
        }
        goToAvatarProfile={() =>
          setActiveTab("avatarCenter")
        }
        goToBreathing={() =>
          setActiveTab("breathing")
        }
        goToBreathingAnalytics={() =>
          setActiveTab(
            "breathingAnalytics"
          )
        }
        selectedJourney={
          selectedJourney || "selma"
        }
        goToLanguage={() =>
          setActiveTab("language")
        }
        goToSettings={() =>
          setActiveTab("settings")
        }
        goToPrivacyPolicy={() =>
          setActiveTab(
            "privacyPolicy"
          )
        }
        goToAbout={() =>
          setActiveTab("about")
        }
        goToWalkingFunction={() =>
          setActiveTab(
            "walkingFunction"
          )
        }
        goToJourneyPreferences={() =>
          setActiveTab(
            "journeyPreferences"
          )
        }
      />

    ) : activeTab === "passport" ? (
      <PassportScreen
        language={language}
        goBack={goMore}
        goToCertificate={() =>
          setActiveTab("certificate")
        }
      />

    ) : activeTab ===
      "passportDetail" ? (
      <PassportDetailScreen
        passportId={selectedPassport}
        goBack={() =>
          setActiveTab("profile")
        }
        goCertificate={() =>
          setActiveTab("certificate")
        }
      />

    ) : activeTab ===
      "certificate" ? (
      <CertificateScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab === "profile" ? (
      <ProfileScreen
        language={language}
        goBack={goMore}
        openPassport={(passportId) => {
          setSelectedPassport(
            passportId
          );

          setActiveTab(
            "passportDetail"
          );
        }}
      />

    ) : activeTab ===
      "wCoinWallet" ? (
      <WCoinWalletScreen
        language={language}
        wCoinBalance={wCoinBalance}
        goBack={goMore}
      />

    ) : activeTab ===
      "subscription" ? (
      <SubscriptionScreen
        language={language}
        subscriptionPlan={
          subscriptionPlan
        }
        setSubscriptionPlan={
          setSubscriptionPlan
        }
        goBack={goMore}
        goToPaywall={(plan) => {
          setSelectedPlan(plan);

          setActiveTab(
            "subscriptionCheckout"
          );
        }}
      />

    ) : activeTab ===
      "hallOfLegends" ? (
      <HallOfLegendsScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "walkingAnalytics" ? (
      <WalkingAnalyticsScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "walkingFunction" ? (
      <WalkingFunctionScreen
        todaySteps={walkingData.steps}
        liveSteps={walkingData.steps}
        liveMiles={walkingData.miles}
        walkingSeconds={
          walkingData.walkingSeconds
        }
        walkingMinutes={
          walkingData.walkingMinutes
        }
        paceMinutesPerMile={
          walkingData.paceMinutesPerMile
        }
        speedMph={
          walkingData.speedMph
        }
        cadence={walkingData.cadence}
        pedometerAvailable={
          walkingData.isAvailable
        }
        goBack={goMore}
        goHome={() =>
          setActiveTab("home")
        }
        goJourneys={() =>
          setActiveTab("journeys")
        }
        goRewards={() =>
          setActiveTab("rewards")
        }
        goMore={() =>
          setActiveTab("more")
        }
      />

    ) : activeTab === "aiCoach" ? (
      <AIWellnessMasterScreen
        goToGPSJourneyMap={(params) => {
          const journey =
            params?.journey ||
            params ||
            null;

          if (journey) {
            setSelectedJourney(
              journey
            );
          }

          setActiveTab("journeyMap");
        }}
        goToJourneys={() =>
          setActiveTab("journeys")
        }
        goToBreathing={() =>
          setActiveTab("breathing")
        }
        goToHydration={() =>
          setActiveTab("hydration")
        }
        goToRecovery={() =>
          setActiveTab("recovery")
        }
        goToSleep={() =>
          setActiveTab("sleep")
        }
        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
        goToMealPlanner={() =>
          setActiveTab("mealPlanner")
        }
        goToVoiceCoach={() =>
          setActiveTab(
            "aiConversation"
          )
        }
        goToAIConversation={() =>
          setActiveTab(
            "aiConversation"
          )
        }
      />

    ) : activeTab === "community" ? (
      <CommunityScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "leaderboard" ? (
      <LeaderboardScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "dailyChallenge" ? (
      <DailyChallengeScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "breathing" ? (
      <BreathingScreen
        language={language}
        goBack={() =>
          setActiveTab("recovery")
        }
      />

    ) : activeTab ===
      "breathingAnalytics" ? (
      <BreathingAnalyticsScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab ===
      "hydration" ? (
      <HydrationCoachScreen
        goBack={() =>
          setActiveTab("recovery")
        }
        goToRecovery={() =>
          setActiveTab("recovery")
        }
        goToAIWellness={() =>
          setActiveTab("aiCoach")
        }
      />

    ) : activeTab === "sleep" ? (
      <SleepCoachScreen
        goBack={() =>
          setActiveTab("recovery")
        }
        goToRecovery={() =>
          setActiveTab("recovery")
        }
        goToBreathing={() =>
          setActiveTab("breathing")
        }
        goToAIWellness={() =>
          setActiveTab("aiCoach")
        }
      />

    ) : activeTab === "recovery" ? (
      <RecoveryCoachScreen
        goBack={() =>
          setActiveTab(
            "aiConversation"
          )
        }
        goToBreathing={() =>
          setActiveTab("breathing")
        }
        goToHydration={() =>
          setActiveTab("hydration")
        }
        goToSleep={() =>
          setActiveTab("sleep")
        }
        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
      />

    ) : activeTab ===
      "aiConversation" ? (
      <AIConversationScreen
        goBack={() =>
          setActiveTab("aiCoach")
        }
        goToGPSJourneyMap={() =>
          setActiveTab("journeyMap")
        }
        goToJourneys={() =>
          setActiveTab("journeys")
        }
        goToMealPlanner={() =>
          setActiveTab("mealPlanner")
        }
        goToHydration={() =>
          setActiveTab("hydration")
        }
        goToRecovery={() =>
          setActiveTab("recovery")
        }
        goToSleep={() =>
          setActiveTab("sleep")
        }
        goToBreathing={() =>
          setActiveTab("breathing")
        }
        wellness={{
          steps:
            Number(
              walkingData?.steps || 0
            ),

          stepGoal: 7000,

          hydration: 0,

          hydrationGoal: 100,

          recovery: null,

          sleepHours: null,

          journey:
            selectedJourney?.title ||
            "",

          journeyProgress:
            selectedJourney?.progress ||
            selectedJourney
              ?.journeyProgress ||
            0,

          checkpoint:
            selectedJourney
              ?.currentCheckpoint ||
            "",
        }}
      />

    ) : activeTab ===
      "physicalMerch" ? (
      <PhysicalMerchStoreScreen
        language={language}
        goBack={() =>
          setActiveTab("wCoinWallet")
        }
        openItem={
          openStoreItemDetail
        }
        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
        wCoinBalance={wCoinBalance}
        spendWCoins={spendWCoins}
      />

    ) : activeTab ===
      "storeItemDetail" ? (
      <StoreItemDetailScreen
        language={language}
        item={selectedStoreItem}
        goBack={() =>
          setActiveTab(
            "physicalMerch"
          )
        }
        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
      />

    ) : activeTab ===
      "purchaseConfirmation" ? (
      <PurchaseConfirmationScreen
        language={language}
        item={selectedStoreItem}
        goBack={() =>
          setActiveTab(
            "physicalMerch"
          )
        }
        goHome={() =>
          setActiveTab("home")
        }
        goToInventory={() =>
          setActiveTab(
            "physicalMerch"
          )
        }
      />
          ) : activeTab ===
      "journeyStory" ? (
      <JourneyStoryScreen
        route={{
          params: {
            journey:
              typeof selectedJourney ===
              "object"
                ? selectedJourney
                : typeof lastJourney ===
                  "object"
                ? lastJourney
                : {
                    id:
                      selectedJourney ||
                      lastJourney ||
                      "",
                  },

            checkpoint:
              selectedStoryCheckpoint,
          },
        }}
        lifetimeSteps={totalSteps}
        subscriptionPlan={
          subscriptionPlan
        }
        goBack={() =>
          setActiveTab("journeys")
        }
        goToProgress={(journey) => {
          const journeyToContinue =
            journey &&
            typeof journey === "object"
              ? journey
              : typeof selectedJourney ===
                "object"
              ? selectedJourney
              : typeof lastJourney ===
                "object"
              ? lastJourney
              : null;

          if (journeyToContinue) {
            setSelectedJourney(
              journeyToContinue
            );

            setLastJourney(
              journeyToContinue
            );
          }

          setActiveTab("journeyMap");
        }}
      />

    ) : activeTab ===
      "avatarProfile" ? (
      <AvatarProfileScreen
        language={language}
        currentAvatar={equippedAvatar}
        equippedAvatar={equippedAvatar}
        goBack={goHome}
        goToAvatarCenter={() =>
          setActiveTab("avatarCenter")
        }
        changeAvatar={() =>
          setActiveTab("avatarCenter")
        }
      />

    ) : activeTab ===
      "worldPassport" ? (
      <PassportScreen
        language={language}
        selectedPassport={
          selectedPassport
        }
        goBack={() =>
          setActiveTab("journeys")
        }
        goToCertificate={() =>
          setActiveTab("certificate")
        }
      />

    ) : activeTab ===
      "legathons" ? (
      <MarathonScreen
        language={language}
        goBack={goMore}
        goToWorldMarathonDetail={(
          marathonId
        ) => {
          setSelectedMarathonId(
            marathonId
          );

          setActiveTab(
            "worldMarathonDetail"
          );
        }}
      />

    ) : activeTab ===
      "worldMarathonDetail" ? (
      <WorldMarathonDetailScreen
        marathonId={
          selectedMarathonId
        }
        goBack={() =>
          setActiveTab("legathons")
        }
        goToCertificate={(params) => {
          setSelectedMarathonId(
            params?.marathonId ||
            selectedMarathonId
          );

          setActiveTab(
            "certificate"
          );
        }}
        goToPassport={(params) => {
          setSelectedMarathonId(
            params?.marathonId ||
            selectedMarathonId
          );

          setActiveTab(
            "worldPassport"
          );
        }}
      />

    ) : activeTab === "language" ? (
      <LanguageSelectionScreen
        language={language}
        setLanguage={setLanguage}
        goBack={goMore}
      />

    ) : activeTab === "settings" ? (
      <SettingsScreen
        language={language}
        goBack={goMore}
        goToLanguage={() =>
          setActiveTab("language")
        }
        goToPrivacy={() =>
          setActiveTab(
            "privacyPolicy"
          )
        }
        goToAbout={() =>
          setActiveTab("about")
        }
      />

    ) : activeTab ===
      "privacyPolicy" ? (
      <PrivacyPolicyScreen
        language={language}
        goBack={goMore}
      />

    ) : activeTab === "about" ? (
      <AboutScreen
        language={language}
        goBack={goMore}
      />

    ) : (
      <WalkingDashboardScreen
        language={language}
        currentAvatar={equippedAvatar}
        activeJourney={selectedJourney}
        goToJourneys={() =>
          setActiveTab("journeys")
        }
        goToGPSJourneyMap={() =>
          setActiveTab("journeyMap")
        }
        goToPassport={() =>
          setActiveTab("passport")
        }
        goToAvatarProfile={() =>
          setActiveTab(
            "avatarProfile"
          )
        }
        goToRewards={() =>
          setActiveTab("rewards")
        }
        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
        goToLegathons={() =>
          setActiveTab("legathons")
        }
      />
    );

  // ============================================================
  // MAIN APP LAYOUT
  // ============================================================

  return (
    <View style={styles.app}>
      <View style={styles.screen}>
        {screen}
      </View>

      <View style={styles.bottomNav}>
        <NavButton
          icon={require(
            "./assets/legathon/icons/legacyhome.png"
          )}
          label="Home"
          active={activeTab === "home"}
          onPress={() =>
            setActiveTab("home")
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/passporthome.png"
          )}
          label="Journeys"
          active={
            activeTab === "journeys"
          }
          onPress={() =>
            setActiveTab("journeys")
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/coin.png"
          )}
          label="Rewards"
          active={
            activeTab === "rewards"
          }
          onPress={() =>
            setActiveTab("rewards")
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/morehome.png"
          )}
          label="More"
          active={activeTab === "more"}
          onPress={() =>
            setActiveTab("more")
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#020611",
  },

  screen: {
    flex: 1,
    backgroundColor: "#020611",
    paddingBottom: 98,
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 98,
    backgroundColor: "#03142D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor:
      "rgba(255, 215, 90, 0.55)",
    shadowColor: "#FFD75A",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 999,
    zIndex: 999,
  },

  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 18,
  },

  navIconImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    marginBottom: 3,
  },

  activeNavIcon: {
    transform: [
      {
        scale: 1.16,
      },
    ],
  },

  navText: {
    color: "#A8B6D4",
    fontSize: 10,
    fontWeight: "800",
  },

  activeNavText: {
    color: "#FFD75A",
    textShadowColor: "#FFD75A",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 8,
  },
});