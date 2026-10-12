
import React, {
  useCallback,
  useEffect,
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
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  StripeProvider,
} from "@stripe/stripe-react-native";

import {
  isStepTrackingAvailable,
  syncTodaySteps,
} from "./utils/stepTrackingEngine";

import {
  loadLanguage,
  translate,
} from "./i18n/i18n";

import { useStepCounter } from "./hooks/useStepCounter";

import { getWCoins } from "./utils/wcoinStorage";

// ============================================================
// ALL EXISTING SCREENS
// ============================================================

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

// NEW - OFFICIAL LEGATHON MEDAL COLLECTION
import MedalCollectionScreen from "./screens/MedalCollectionScreen";

import MarathonScreen from "./screens/MarathonScreen";
import WorldMarathonDetailScreen from "./screens/WorldMarathonDetailScreen";

import JourneyPreferencesScreen from "./screens/JourneyPreferencesScreen";
import PersonalizationSummaryScreen from "./screens/PersonalizationSummaryScreen";

import SubscriptionCheckoutScreen from "./screens/SubscriptionCheckoutScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import MealPlannerScreen from "./screens/MealPlannerScreen";
import HallOfLegendsScreen from "./screens/HallOfLegendsScreen";

// Legacy compatibility only
import CertificateScreen from "./screens/CertificateScreen";

import ProfileScreen from "./screens/ProfileScreen";
import AboutScreen from "./screens/AboutScreen";
import PhysicalMerchStoreScreen from "./screens/PhysicalMerchStoreScreen";
import StoreItemDetailScreen from "./screens/StoreItemDetailScreen";
import PurchaseConfirmationScreen from "./screens/PurchaseConfirmationScreen";
import CommunityScreen from "./screens/CommunityScreen";
import CommunityCommentsScreen from "./screens/CommunityCommentsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import DailyChallengeScreen from "./screens/DailyChallengeScreen";
import SettingsScreen from "./screens/SettingScreen";
import PrivacyPolicyScreen from "./screens/PrivacyScreen";
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import WCoinWalletScreen from "./screens/WCoinWalletScreen";
import JourneyStoryScreen from "./screens/JourneyStoryScreen";

// ============================================================
// REVENUECAT
// ============================================================

import {
  configureRevenueCat,
  refreshRevenueCatMembership,
  restoreRevenueCatPurchases,
} from "./services/revenuecat";

// ============================================================
// CONSTANTS
// ============================================================

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

const WCOIN_KEY = "wCoinBalance";

// ============================================================
// BOTTOM NAVIGATION BUTTON
// ============================================================

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
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const [activeTab, setActiveTab] = useState("home");

  // ==========================================================
  // WALKING DATA
  // ==========================================================

  const [lifetimeSteps, setLifetimeSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const walkingData = useStepCounter();

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const [language, setLanguage] = useState("en");

  // ==========================================================
  // JOURNEYS
  // ==========================================================

  const [lastJourney, setLastJourney] = useState(null);

  const [selectedJourney, setSelectedJourney] =
    useState(null);

  const [
    selectedStoryCheckpoint,
    setSelectedStoryCheckpoint,
  ] = useState(1);

  // ==========================================================
  // STORE
  // ==========================================================

  const [selectedStoreItem, setSelectedStoreItem] =
    useState(null);

  // ==========================================================
  // COMMUNITY
  // ==========================================================

  const [
    selectedCommunityPost,
    setSelectedCommunityPost,
  ] = useState(null);

  // ==========================================================
  // PASSPORT
  // ==========================================================

  const [selectedPassport, setSelectedPassport] =
    useState(null);

  // ==========================================================
  // AVATAR
  // ==========================================================

  const [equippedAvatar, setEquippedAvatar] =
    useState(null);

  // ==========================================================
  // SUBSCRIPTIONS
  // ==========================================================

  const [subscriptionPlan, setSubscriptionPlan] =
    useState("free");

  const [isPremium, setIsPremium] = useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  // ==========================================================
  // WCOINS
  // ==========================================================

  const [wCoinBalance, setWCoinBalance] = useState(0);

  // ==========================================================
  // LEGATHONS
  // ==========================================================

  const [selectedMarathonId, setSelectedMarathonId] =
    useState("nyc");

  // ==========================================================
  // REFS
  // ==========================================================

  const appStateRef = useRef(AppState.currentState);

  const stepSyncRunningRef = useRef(false);

  const stepSyncTimerRef = useRef(null);

  // ==========================================================
  // NAVIGATION HELPERS
  // ==========================================================

  const goHome = () => setActiveTab("home");

  const goMore = () => setActiveTab("more");

  const goMedals = () => setActiveTab("medalCollection");

  // ==========================================================
  // VERIFIED MEMBERSHIP
  // ==========================================================

  const applyMembershipPlan = useCallback(incoming => {
    const value = String(incoming || "free").toLowerCase();

    const plan =
      value === "elite"
        ? "elite"
        : value === "premium"
        ? "premium"
        : "free";

    setSubscriptionPlan(plan);
    setIsPremium(plan !== "free");

    return plan;
  }, []);

  // ==========================================================
  // REFRESH REVENUECAT MEMBERSHIP
  // ==========================================================

  const refreshVerifiedMembership = useCallback(async () => {
    try {
      await configureRevenueCat();

      const result = await refreshRevenueCatMembership();

      if (result?.serverSync?.synced === true) {
        return applyMembershipPlan(
          result.serverSync.plan
        );
      }

      return applyMembershipPlan(
        result?.plan || "free"
      );
    } catch (error) {
      console.log(
        "Membership refresh error:",
        error
      );

      return applyMembershipPlan("free");
    }
  }, [applyMembershipPlan]);

  // ==========================================================
  // SECURE WCOIN BALANCE
  // ==========================================================

  const refreshSecureWCoinBalance =
    useCallback(async () => {
      try {
        const value = await getWCoins();

        const balance = Math.max(
          0,
          Math.floor(Number(value) || 0)
        );

        setWCoinBalance(balance);

        return balance;
      } catch (error) {
        console.log(
          "Secure WCoin refresh error:",
          error
        );

        return 0;
      }
    }, []);

  // ==========================================================
  // LEGACY WCOIN CALLBACK
  //
  // Preserved for existing screen compatibility.
  // ==========================================================

  async function addWCoins(amount) {
    const saved = await AsyncStorage.getItem(
      WCOIN_KEY
    );

    const updated =
      (Number(saved) || 0) +
      (Number(amount) || 0);

    await AsyncStorage.setItem(
      WCOIN_KEY,
      String(updated)
    );

    setWCoinBalance(updated);

    Alert.alert(
      "WCoins",
      `W Coins now: ${updated}`
    );
  }

  // ==========================================================
  // JOURNEY REWARD FALLBACK
  //
  // Preserves existing app callback.
  // ==========================================================

  async function awardJourneyRewards(journey) {
    if (!journey?.id) {
      return false;
    }

    const rewardKey =
      `journeyRewarded_${journey.id}`;

    const alreadyRewarded =
      await AsyncStorage.getItem(rewardKey);

    if (alreadyRewarded === "true") {
      Alert.alert(
        "Journey",
        "Journey reward already claimed."
      );

      return false;
    }

    const points =
      Number(journey.rewardPoints) || 0;

    const coins =
      Number(journey.rewardCoins) || 0;

    const savedPoints =
      await AsyncStorage.getItem("rewardPoints");

    const updatedPoints =
      (Number(savedPoints) || 0) + points;

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

    Alert.alert(
      "Journey Complete",
      `+${points} Legathon Points\n+${coins} WCoins\nPassport Stamp Unlocked`
    );

    setSelectedPassport(journey);

    setActiveTab("worldPassport");

    return true;
  }

  // ==========================================================
  // GLOBAL STEP SYNCHRONIZATION
  // ==========================================================

  const runGlobalStepSync = useCallback(async () => {
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

      const result = await syncTodaySteps();

      if (__DEV__) {
        console.log(
          "[GLOBAL STEP ROUTER]",
          {
            delta: result?.delta ?? 0,
            destination: result?.destination ?? null,
            marathonId: result?.marathonId ?? null,
            synced: result?.synced === true,
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

  // ==========================================================
  // INITIAL STEP SYNC
  // ==========================================================

  useEffect(() => {
    runGlobalStepSync();
  }, [runGlobalStepSync]);

  // ==========================================================
  // APP-WIDE STEP SYNC
  // ==========================================================

  useEffect(() => {
    const startStepSync = () => {
      if (!stepSyncTimerRef.current) {
        stepSyncTimerRef.current = setInterval(
          runGlobalStepSync,
          5000
        );
      }
    };

    const stopStepSync = () => {
      if (stepSyncTimerRef.current) {
        clearInterval(stepSyncTimerRef.current);
      }

      stepSyncTimerRef.current = null;
    };

    if (AppState.currentState === "active") {
      startStepSync();
    }

    const subscription =
      AppState.addEventListener("change", next => {
        const previous = appStateRef.current;

        appStateRef.current = next;

        if (next === "active") {
          runGlobalStepSync();
          startStepSync();
        } else if (
          previous === "active" &&
          (next === "inactive" ||
            next === "background")
        ) {
          runGlobalStepSync();
          stopStepSync();
        }
      });

    return () => {
      stopStepSync();
      subscription.remove();
    };
  }, [runGlobalStepSync]);

  // ==========================================================
  // LOAD LANGUAGE AND LAST JOURNEY
  // ==========================================================

  useEffect(() => {
    loadLanguage()
      .then(saved => {
        if (saved) {
          setLanguage(saved);
        }
      })
      .catch(error => {
        console.log(
          "Language load error:",
          error
        );
      });

    AsyncStorage.getItem("lastJourney")
      .then(raw => {
        if (!raw) return;

        const journey = JSON.parse(raw);

        setLastJourney(journey);
        setSelectedJourney(journey);
      })
      .catch(error => {
        console.log(
          "Last journey load error:",
          error
        );
      });
  }, []);

  // ==========================================================
  // MEMBERSHIP AND WCOINS
  // ==========================================================

  useEffect(() => {
    refreshVerifiedMembership();
    refreshSecureWCoinBalance();

    const subscription =
      AppState.addEventListener("change", state => {
        if (state === "active") {
          refreshVerifiedMembership();
          refreshSecureWCoinBalance();
        }
      });

    return () => {
      subscription.remove();
    };
  }, [
    refreshVerifiedMembership,
    refreshSecureWCoinBalance,
  ]);

  // ==========================================================
  // JOURNEY NAVIGATION
  // ==========================================================

  const openJourneyDetail = async journey => {
    setSelectedJourney(journey);
    setLastJourney(journey);

    await AsyncStorage.setItem(
      "lastJourney",
      JSON.stringify(journey)
    );

    setActiveTab("journeyDetail");
  };

  const openGPSJourneyMap = async journey => {
    setSelectedJourney(journey);
    setLastJourney(journey);

    await AsyncStorage.setItem(
      "lastJourney",
      JSON.stringify(journey)
    );

    setActiveTab("journeyMap");
  };

  // ==========================================================
  // STORE NAVIGATION
  // ==========================================================

  const openStoreItemDetail = item => {
    setSelectedStoreItem(item);
    setActiveTab("storeItemDetail");
  };

  const goToPurchaseConfirmation = item => {
    setSelectedStoreItem(item);
    setActiveTab("purchaseConfirmation");
  };

  // ==========================================================
  // RESTORE PURCHASES
  // ==========================================================

  async function handleRestorePurchases() {
    try {
      const restored =
        await restoreRevenueCatPurchases();

      const plan =
        applyMembershipPlan(restored);

      await refreshVerifiedMembership();

      return plan;
    } catch (error) {
      console.log(
        "Restore purchases error:",
        error
      );

      return "free";
    }
  }

  // ==========================================================
  // DASHBOARD PROPS
  // ==========================================================

  const dashboardProps = {
    language,

    currentAvatar: equippedAvatar,

    activeJourney: selectedJourney,

    goToJourneys: () =>
      setActiveTab("journeys"),

    goToGPSJourneyMap: () => {
      const journey = lastJourney || selectedJourney;

      if (journey) {
        openGPSJourneyMap(journey);
      } else {
        setActiveTab("journeys");
      }
    },

    goToPassport: () =>
      setActiveTab("passport"),

    goToAvatarProfile: () =>
      setActiveTab("avatarProfile"),

    goToRewards: () =>
      setActiveTab("rewards"),

    goToWalkingAnalytics: () =>
      setActiveTab("walkingAnalytics"),

    goToLegathons: () =>
      setActiveTab("legathons"),
  };

  // ==========================================================
  // SCREEN ROUTER
  // ==========================================================

  let screen = null;

  // ==========================================================
  // HOME
  // ==========================================================

  if (activeTab === "home") {
    screen = (
      <WalkingDashboardScreen {...dashboardProps} />
    );
  }

  // ==========================================================
  // JOURNEYS
  // ==========================================================

  else if (activeTab === "journeys") {
    screen = (
      <JourneysScreen
        language={language}
        activeJourney={selectedJourney}
        setSelectedJourney={setSelectedJourney}
        goToJourneyDetail={openJourneyDetail}
        goToGPSJourneyMap={openGPSJourneyMap}
        goToSubscription={() =>
          setActiveTab("subscription")
        }
        goBack={goHome}
        subscriptionPlan={subscriptionPlan}
      />
    );
  }

  // ==========================================================
  // JOURNEY DETAIL
  // ==========================================================

  else if (activeTab === "journeyDetail") {
    screen = (
      <JourneyDetailScreen
        language={language}
        journey={selectedJourney}
        goBack={() =>
          setActiveTab("journeys")
        }
        startJourney={journey => {
          const required =
            journey?.accessLevel ||
            (journey?.premium ? "premium" : "free");

          const current = String(
            subscriptionPlan || "free"
          ).toLowerCase();

          const allowed =
            required === "free" ||
            (required === "premium" &&
              (current === "premium" ||
                current === "elite")) ||
            (required === "elite" &&
              current === "elite");

          setSelectedJourney(journey);

          if (!allowed) {
            setActiveTab("subscription");
            return;
          }

          setLastJourney(journey);
          setActiveTab("journeyMap");
        }}
        goToSubscription={() =>
          setActiveTab("subscription")
        }
        subscriptionPlan={subscriptionPlan}
        lifetimeSteps={lifetimeSteps}
      />
    );
  }

  // ==========================================================
  // GPS JOURNEY MAP
  // ==========================================================

  else if (activeTab === "journeyMap") {
    const journey =
      selectedJourney &&
      typeof selectedJourney === "object"
        ? selectedJourney
        : lastJourney &&
          typeof lastJourney === "object"
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
          };

    screen = (
      <GPSJourneyMapScreen
        language={language}
        selectedJourney={journey}
        activeJourney={journey}
        journey={journey}
        goBack={() =>
          setActiveTab("journeyDetail")
        }
        goToDetail={() =>
          setActiveTab("journeyDetail")
        }
        awardJourneyRewards={awardJourneyRewards}
        goToStory={checkpoint => {
          setSelectedStoryCheckpoint(
            Number(checkpoint || 1)
          );

          setActiveTab("journeyStory");
        }}
      />
    );
  }

  // ==========================================================
  // SUBSCRIPTION CHECKOUT
  // ==========================================================

  else if (activeTab === "subscriptionCheckout") {
    screen = (
      <SubscriptionCheckoutScreen
        language={language}
        selectedPlan={selectedPlan}
        subscriptionPlan={subscriptionPlan}
        goBack={() =>
          setActiveTab("subscription")
        }
        onConfirm={async plan => {
          applyMembershipPlan(plan);
          await refreshVerifiedMembership();
          goHome();
        }}
      />
    );
  }

  // ==========================================================
  // MEAL PLANNER
  // ==========================================================

  else if (activeTab === "mealPlanner") {
    screen = (
      <MealPlannerScreen
        language={language}
        goBack={() =>
          setActiveTab("aiCoach")
        }
      />
    );
  }

  // ==========================================================
  // JOURNEY PREFERENCES
  // ==========================================================

  else if (activeTab === "journeyPreferences") {
    screen = (
      <JourneyPreferencesScreen
        language={language}
        goToSummary={() =>
          setActiveTab("personalizationSummary")
        }
        goBack={goHome}
      />
    );
  }

  // ==========================================================
  // PERSONALIZATION SUMMARY
  // ==========================================================

  else if (
    activeTab === "personalizationSummary"
  ) {
    screen = (
      <PersonalizationSummaryScreen
        language={language}
        startLegacy={() =>
          setActiveTab("journeys")
        }
        editPreferences={() =>
          setActiveTab("journeyPreferences")
        }
      />
    );
  }

  // ==========================================================
  // REWARDS
  // ==========================================================

  else if (activeTab === "rewards") {
    screen = (
      <RewardsScreen
        language={language}
        wCoinBalance={wCoinBalance}
        addWCoins={addWCoins}
      />
    );
  }

  // ==========================================================
  // AVATAR CENTER
  // ==========================================================

  else if (activeTab === "avatarCenter") {
    screen = (
      <AvatarCenterScreen
        language={language}
        goBack={goHome}
      />
    );
  }

  // ==========================================================
  // MORE MENU
  // ==========================================================

  else if (activeTab === "more") {
    screen = (
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
        goToMedalCollection={goMedals}
        goToCertificate={() =>
          setActiveTab("certificate")
        }
        goToWalkingAnalytics={() =>
          setActiveTab("walkingAnalytics")
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
          setActiveTab("hallOfLegends")
        }
        goToDailyChallenge={() =>
          setActiveTab("dailyChallenge")
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
          setActiveTab("breathingAnalytics")
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
          setActiveTab("privacyPolicy")
        }
        goToAbout={() =>
          setActiveTab("about")
        }
        goToWalkingFunction={() =>
          setActiveTab("walkingFunction")
        }
        goToJourneyPreferences={() =>
          setActiveTab("journeyPreferences")
        }
      />
    );
  }

  // ==========================================================
  // NEW - LEGATHON MEDAL COLLECTION
  // ==========================================================

  else if (activeTab === "medalCollection") {
    screen = (
      <MedalCollectionScreen
        language={language}
        goBack={() =>
          setActiveTab("legathons")
        }
      />
    );
  }

  // ==========================================================
  // JOURNEY PASSPORT COLLECTION
  // ==========================================================

  else if (activeTab === "passport") {
    screen = (
      <PassportScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // PASSPORT DETAIL
  // ==========================================================

  else if (activeTab === "passportDetail") {
    screen = (
      <PassportDetailScreen
        language={language}
        passportId={selectedPassport}
        goBack={() =>
          setActiveTab("passport")
        }
      />
    );
  }

  // ==========================================================
  // LEGACY CERTIFICATE ROUTE
  // ==========================================================

  else if (activeTab === "certificate") {
    screen = (
      <CertificateScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // PROFILE
  // ==========================================================

  else if (activeTab === "profile") {
    screen = (
      <ProfileScreen
        language={language}
        goBack={goMore}
        goToAvatarCenter={() =>
          setActiveTab("avatarCenter")
        }
        openPassport={passportId => {
          setSelectedPassport(passportId);
          setActiveTab("passportDetail");
        }}
      />
    );
  }

  // ==========================================================
  // WCOIN WALLET
  // ==========================================================

  else if (activeTab === "wCoinWallet") {
    screen = (
      <WCoinWalletScreen
        language={language}
        wCoinBalance={wCoinBalance}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // SUBSCRIPTIONS
  // ==========================================================

  else if (activeTab === "subscription") {
    screen = (
      <SubscriptionScreen
        language={language}
        subscriptionPlan={subscriptionPlan}
        setSubscriptionPlan={setSubscriptionPlan}
        goBack={goMore}
        goToPaywall={plan => {
          setSelectedPlan(plan);
          setActiveTab("subscriptionCheckout");
        }}
        onRestorePurchases={
          handleRestorePurchases
        }
        goToPrivacyPolicy={() =>
          setActiveTab("privacyPolicy")
        }
      />
    );
  }

  // ==========================================================
  // HALL OF LEGENDS
  // ==========================================================

  else if (activeTab === "hallOfLegends") {
    screen = (
      <HallOfLegendsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // WALKING ANALYTICS
  // ==========================================================

  else if (activeTab === "walkingAnalytics") {
    screen = (
      <WalkingAnalyticsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // WALKING FUNCTION
  // ==========================================================

  else if (activeTab === "walkingFunction") {
    screen = (
      <WalkingFunctionScreen
        language={language}
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
        speedMph={walkingData.speedMph}
        cadence={walkingData.cadence}
        pedometerAvailable={
          walkingData.isAvailable
        }
        goBack={goMore}
        goHome={goHome}
        goJourneys={() =>
          setActiveTab("journeys")
        }
        goRewards={() =>
          setActiveTab("rewards")
        }
        goMore={goMore}
      />
    );
  }

  // ==========================================================
  // AI WELLNESS
  // ==========================================================

  else if (activeTab === "aiCoach") {
    screen = (
      <AIWellnessMasterScreen
        language={language}
        goToGPSJourneyMap={params => {
          const journey =
            params?.journey || params || null;

          if (journey) {
            setSelectedJourney(journey);
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
          setActiveTab("walkingAnalytics")
        }
        goToMealPlanner={() =>
          setActiveTab("mealPlanner")
        }
        goToAIConversation={() =>
          setActiveTab("aiConversation")
        }
      />
    );
  }

  // ==========================================================
  // COMMUNITY
  // ==========================================================

  else if (activeTab === "community") {
    screen = (
      <CommunityScreen
        language={language}
        goBack={goMore}
        goToAICoach={() =>
          setActiveTab("aiConversation")
        }
        goToComments={post => {
          setSelectedCommunityPost(post);
          setActiveTab("communityComments");
        }}
      />
    );
  }

  // ==========================================================
  // COMMUNITY COMMENTS
  // ==========================================================

  else if (activeTab === "communityComments") {
    screen = (
      <CommunityCommentsScreen
        language={language}
        post={selectedCommunityPost}
        goBack={() =>
          setActiveTab("community")
        }
      />
    );
  }

  // ==========================================================
  // LEADERBOARD
  // ==========================================================

  else if (activeTab === "leaderboard") {
    screen = (
      <LeaderboardScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // DAILY CHALLENGE
  // ==========================================================

  else if (activeTab === "dailyChallenge") {
    screen = (
      <DailyChallengeScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // BREATHING
  // ==========================================================

  else if (activeTab === "breathing") {
    screen = (
      <BreathingScreen
        language={language}
        goBack={() =>
          setActiveTab("recovery")
        }
      />
    );
  }

  // ==========================================================
  // BREATHING ANALYTICS
  // ==========================================================

  else if (activeTab === "breathingAnalytics") {
    screen = (
      <BreathingAnalyticsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // HYDRATION
  // ==========================================================

  else if (activeTab === "hydration") {
    screen = (
      <HydrationCoachScreen
        language={language}
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
    );
  }

  // ==========================================================
  // SLEEP
  // ==========================================================

  else if (activeTab === "sleep") {
    screen = (
      <SleepCoachScreen
        language={language}
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
    );
  }

  // ==========================================================
  // RECOVERY
  // ==========================================================

  else if (activeTab === "recovery") {
    screen = (
      <RecoveryCoachScreen
        language={language}
        goBack={() =>
          setActiveTab("aiConversation")
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
          setActiveTab("walkingAnalytics")
        }
      />
    );
  }

  // ==========================================================
  // AI CONVERSATION - TEXT BASED
  // ==========================================================

  else if (activeTab === "aiConversation") {
    screen = (
      <AIConversationScreen
        language={language}
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
          steps: Number(walkingData?.steps || 0),
          stepGoal: 7000,
          hydration: 0,
          hydrationGoal: 100,
          recovery: null,
          sleepHours: null,
          journey: selectedJourney?.title || "",
          journeyProgress:
            selectedJourney?.progress ||
            selectedJourney?.journeyProgress ||
            0,
          checkpoint:
            selectedJourney?.currentCheckpoint || "",
        }}
      />
    );
  }

  // ==========================================================
  // PHYSICAL MERCHANDISE STORE
  // ==========================================================

  else if (activeTab === "physicalMerch") {
    screen = (
      <PhysicalMerchStoreScreen
        language={language}
        goBack={() =>
          setActiveTab("wCoinWallet")
        }
        openItem={openStoreItemDetail}
        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
        wCoinBalance={wCoinBalance}
        lifetimeSteps={lifetimeSteps}
      />
    );
  }

  // ==========================================================
  // STORE ITEM DETAIL
  // ==========================================================

  else if (activeTab === "storeItemDetail") {
    screen = (
      <StoreItemDetailScreen
        language={language}
        item={selectedStoreItem}
        goBack={() =>
          setActiveTab("physicalMerch")
        }
        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
      />
    );
  }

  // ==========================================================
  // PURCHASE CONFIRMATION
  // ==========================================================

  else if (activeTab === "purchaseConfirmation") {
    screen = (
      <PurchaseConfirmationScreen
        language={language}
        item={selectedStoreItem}
        userPlan={subscriptionPlan}
        wCoinBalance={wCoinBalance}
        refreshWCoinBalance={
          refreshSecureWCoinBalance
        }
        goBack={() =>
          setActiveTab("physicalMerch")
        }
        goHome={goHome}
        goToInventory={() =>
          setActiveTab("physicalMerch")
        }
      />
    );
  }

  // ==========================================================
  // JOURNEY STORY
  // ==========================================================

  else if (activeTab === "journeyStory") {
    const journey =
      selectedJourney &&
      typeof selectedJourney === "object"
        ? selectedJourney
        : lastJourney &&
          typeof lastJourney === "object"
        ? lastJourney
        : {
            id:
              selectedJourney ||
              lastJourney ||
              "",
          };

    screen = (
      <JourneyStoryScreen
        language={language}
        route={{
          params: {
            journey,
            checkpoint: selectedStoryCheckpoint,
          },
        }}
        lifetimeSteps={totalSteps}
        subscriptionPlan={subscriptionPlan}
        goBack={() =>
          setActiveTab("journeys")
        }
        goToProgress={item => {
          const next =
            item && typeof item === "object"
              ? item
              : journey;

          if (next) {
            setSelectedJourney(next);
            setLastJourney(next);
          }

          setActiveTab("journeyMap");
        }}
      />
    );
  }

  // ==========================================================
  // AVATAR PROFILE
  // ==========================================================

  else if (activeTab === "avatarProfile") {
    screen = (
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
    );
  }

  // ==========================================================
  // WORLD PASSPORT - JOURNEYS ONLY
  // ==========================================================

  else if (activeTab === "worldPassport") {
    screen = (
      <PassportScreen
        language={language}
        selectedPassport={selectedPassport}
        goBack={() =>
          setActiveTab("journeys")
        }
      />
    );
  }

  // ==========================================================
  // LEGATHONS - WITH NEW MEDAL COLLECTION BUTTON
  // ==========================================================

  else if (activeTab === "legathons") {
    screen = (
      <View style={styles.legathonsWrap}>
        <TouchableOpacity
          style={styles.medalShortcutButton}
          activeOpacity={0.85}
          onPress={goMedals}
        >
          <Text style={styles.medalShortcutText}>
            🏅 View My Medal Collection
          </Text>
        </TouchableOpacity>

        <View style={styles.legathonsContent}>
          <MarathonScreen
            language={language}
            goBack={goMore}
            goToWorldMarathonDetail={marathonId => {
              setSelectedMarathonId(marathonId);
              setActiveTab("worldMarathonDetail");
            }}
          />
        </View>
      </View>
    );
  }

  // ==========================================================
  // LEGATHON DETAIL
  // ==========================================================

  else if (activeTab === "worldMarathonDetail") {
    screen = (
      <WorldMarathonDetailScreen
        language={language}
        marathonId={selectedMarathonId}
        goBack={() =>
          setActiveTab("legathons")
        }
        goToCertificate={goMedals}
        goToPassport={goMedals}
        goToMedalCollection={goMedals}
      />
    );
  }

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  else if (activeTab === "language") {
    screen = (
      <LanguageSelectionScreen
        language={language}
        setLanguage={setLanguage}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // SETTINGS
  // ==========================================================

  else if (activeTab === "settings") {
    screen = (
      <SettingsScreen
        language={language}
        goBack={goMore}
        goToLanguage={() =>
          setActiveTab("language")
        }
        goToPrivacy={() =>
          setActiveTab("privacyPolicy")
        }
        goToAbout={() =>
          setActiveTab("about")
        }
      />
    );
  }

  // ==========================================================
  // PRIVACY POLICY
  // ==========================================================

  else if (activeTab === "privacyPolicy") {
    screen = (
      <PrivacyPolicyScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // ABOUT
  // ==========================================================

  else if (activeTab === "about") {
    screen = (
      <AboutScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ==========================================================
  // FALLBACK
  // ==========================================================

  else {
    screen = (
      <WalkingDashboardScreen {...dashboardProps} />
    );
  }

  // ==========================================================
  // MAIN APP LAYOUT
  // ==========================================================

  const appLayout = (
    <View style={styles.app}>
      <View style={styles.screen}>
        {screen}
      </View>

      <View style={styles.bottomNav}>
        <NavButton
          icon={require(
            "./assets/legathon/icons/legacyhome.png"
          )}
          label={translate(language, "home")}
          active={activeTab === "home"}
          onPress={goHome}
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/passporthome.png"
          )}
          label={translate(language, "journeys")}
          active={activeTab === "journeys"}
          onPress={() =>
            setActiveTab("journeys")
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/coin.png"
          )}
          label={translate(language, "rewards")}
          active={activeTab === "rewards"}
          onPress={() =>
            setActiveTab("rewards")
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/morehome.png"
          )}
          label={translate(language, "more")}
          active={activeTab === "more"}
          onPress={goMore}
        />
      </View>
    </View>
  );

  // ==========================================================
  // STRIPE PROVIDER
  // ==========================================================

  if (!STRIPE_PUBLISHABLE_KEY) {
    if (__DEV__) {
      console.warn(
        "Stripe publishable key missing. Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file."
      );
    }

    return appLayout;
  }

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
    >
      {appLayout}
    </StripeProvider>
  );
}

// ============================================================
// STYLES
// ============================================================

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
    borderTopColor: "rgba(255,215,90,0.55)",
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
      { scale: 1.16 },
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

  // ==========================================================
  // LEGATHON MEDAL COLLECTION SHORTCUT
  // ==========================================================

legathonsWrap: {
  flex: 1,
  backgroundColor: "#071427",
  paddingTop: 60,
},

  legathonsContent: {
    flex: 1,
  },

  medalShortcutButton: {
    minHeight: 52,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    backgroundColor: "#142640",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 8,
    paddingHorizontal: 15,
  },

  medalShortcutText: {
    color: "#FFD75A",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
});
