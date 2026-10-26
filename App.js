import { captureAccountSession, isAccountSessionEnded } from "./utils/accountStorage";
// App.js

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";



// Central screen access policy. All navigation paths pass through this check.
const PAID_SCREEN_NAMES = Object.freeze({
  aiCoach: "AI Wellness Coach",
  aiConversation: "AI Coach conversations",
  mealPlanner: "Meal Planner",
  recovery: "Recovery Coach",
  hydration: "Hydration Coach",
  sleep: "Sleep Coach",
  walkingFunction: "Walking Pace and Mobility Trends",
  legathons: "World Legathons",
  worldMarathonDetail: "Legathon challenges",
});

function getMembershipGate(tab, plan, selectedJourney, lastJourney) {
  const current = String(plan || "free").trim().toLowerCase();
  const paid = current === "premium" || current === "elite";
  if (Object.prototype.hasOwnProperty.call(PAID_SCREEN_NAMES, tab)) {
    return paid ? null : {
      title: PAID_SCREEN_NAMES[tab], required: "Premium", missingJourney: false,
    };
  }
  if (tab !== "journeyMap" && tab !== "journeyStory") return null;
  const journey = selectedJourney && typeof selectedJourney === "object"
    ? selectedJourney
    : lastJourney && typeof lastJourney === "object" ? lastJourney : null;
  // An ID alone cannot establish access. Re-select from the journey list.
  if (!journey || (!journey.accessLevel && typeof journey.premium !== "boolean")) {
    return { title: "Choose a journey", missingJourney: true };
  }
  const required = String(journey.accessLevel || (journey.premium ? "premium" : "free"))
    .trim().toLowerCase();
  const allowed = required === "free" || (required === "premium" && paid)
    || (required === "elite" && current === "elite");
  if (allowed) return null;
  if (required !== "premium" && required !== "elite") {
    return { title: "Choose a journey", missingJourney: true };
  }
  return { title: journey.title || journey.name || "This journey",
    required: required === "elite" ? "Elite" : "Premium", missingJourney: false };
}

import { StripeProvider } from "@stripe/stripe-react-native";

// ============================================================
// AUTHENTICATION
// ============================================================

import {
  AuthProvider,
  useAuth,
} from "./contexts/AuthContext";

import AuthScreen from "./screens/AuthScreen";

// ============================================================
// UTILITIES
// ============================================================

import {
  syncTodaySteps,
  stopStepVerification,
} from "./utils/stepTrackingEngine";

import {
  loadLanguage,
  translate,
} from "./i18n/i18n";

import { useStepCounter } from "./hooks/useStepCounter";
import { getWCoins } from "./utils/wcoinStorage";

// ============================================================
// SCREENS
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
import MedalCollectionScreen from "./screens/MedalCollectionScreen";

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
import AboutScreen from "./screens/AboutScreen";

import PhysicalMerchStoreScreen from "./screens/PhysicalMerchStoreScreen";
import StoreItemDetailScreen from "./screens/StoreItemDetailScreen";
import PurchaseConfirmationScreen from "./screens/PurchaseConfirmationScreen";

import CommunityScreen from "./screens/CommunityScreen";
import CommunityCommentsScreen from "./screens/CommunityCommentsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import DailyChallengeScreen from "./screens/DailyChallengeScreen";

// Matches the import in your existing App.js.
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
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
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
// AUTHENTICATION LOADING SCREEN
// ============================================================

function AuthLoadingScreen() {
  return (
    <View style={styles.authLoading}>
      <ActivityIndicator
        size="large"
        color="#D4AF37"
      />

      <Text style={styles.authLoadingBrand}>
        LEGATHON WALK
      </Text>
    </View>
  );
}

// ============================================================
// AUTHENTICATION GATE
//
// The main application only mounts after a user is signed in.
// Signing out unmounts the main application and its navigation.
// ============================================================

function AuthGate() {
  const {
    user,
    loadingAuth,
    accountError,
    retryAccountSetup,
    signOut,
  } = useAuth();

  const [language, setLanguage] = useState("en");

  const [loadingLanguage, setLoadingLanguage] =
    useState(true);

  const logoutRunningRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initializeLanguage() {
      try {
        const saved = await loadLanguage();

        if (mounted && saved) {
          setLanguage(saved);
        }
      } catch (error) {
        console.log(
          "Language load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoadingLanguage(false);
        }
      }
    }

    initializeLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = useCallback(async () => {
    if (logoutRunningRef.current) {
      return;
    }

    logoutRunningRef.current = true;

    try {
      await signOut();
    } catch (error) {
      Alert.alert(
        "Unable to Log Out",
        error?.message ||
          "Please try again."
      );
    } finally {
      logoutRunningRef.current = false;
    }
  }, [signOut]);

  if (loadingAuth || loadingLanguage) {
    return <AuthLoadingScreen />;
  }

  if (accountError) {
    return (
      <View style={styles.authLoading}>
        <Text style={{ color: "#FFFFFF", padding: 24, textAlign: "center" }}>
          {accountError}
        </Text>
        <TouchableOpacity onPress={retryAccountSetup} accessibilityRole="button">
          <Text style={styles.authLoadingBrand}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <AuthScreen language={language} />
    );
  }

  return (
    <SignedInApp
      key={user.id}
      language={language}
      setLanguage={setLanguage}
      onLogout={handleLogout}
    />
  );
}

// ============================================================
// APP ENTRY POINT
// ============================================================

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

// ============================================================
// SIGNED-IN APPLICATION
// ============================================================

function SignedInApp({
  language,
  setLanguage,
  onLogout,
}) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const [activeTab, setActiveTab] = useState("home");

  // ==========================================================
  // WALKING DATA
  //
  // Existing values retained from your supplied App.js.
  // The walking hook continues providing live walking metrics.
  // ==========================================================

  const [lifetimeSteps] = useState(0);
  const [totalSteps] = useState(0);

  const walkingData = useStepCounter();

  // ==========================================================
  // JOURNEYS
  // ==========================================================

  const [lastJourney, setLastJourney] =
    useState(null);

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

  const [equippedAvatar] = useState(null);

  // ==========================================================
  // SUBSCRIPTIONS
  // ==========================================================

  const [subscriptionPlan, setSubscriptionPlan] =
    useState("free");

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  // ==========================================================
  // WCOINS
  // ==========================================================

  const [wCoinBalance, setWCoinBalance] =
    useState(0);

  // ==========================================================
  // LEGATHONS
  // ==========================================================

  const [selectedMarathonId, setSelectedMarathonId] =
    useState("nyc");

  // ==========================================================
  // REFS
  // ==========================================================

  const mountedRef = useRef(true);

  const appStateRef = useRef(
    AppState.currentState
  );

  const stepSyncRunningRef = useRef(false);
  const stepSyncTimerRef = useRef(null);

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stopStepVerification();
    };
  }, []);

  // ==========================================================
  // NAVIGATION HELPERS
  // ==========================================================

  const goHome = () => {
  

return (setActiveTab("home"));
};

  const goMore = () => {
  

return (setActiveTab("more"));
};

  const goMedals = () =>
    {
  

return (setActiveTab("medalCollection"));
};

  // ==========================================================
  // VERIFIED MEMBERSHIP
  // ==========================================================

  const applyMembershipPlan = useCallback(
    incoming => {
  

      const value = String(
        incoming || "free"
      ).toLowerCase();

      const plan =
        value === "elite"
          ? "elite"
          : value === "premium"
          ? "premium"
          : "free";

      if (mountedRef.current) {
        setSubscriptionPlan(plan);
      }

      return plan;
    },
    []
  );

  // ==========================================================
  // REFRESH REVENUECAT MEMBERSHIP
  // ==========================================================

  const refreshVerifiedMembership = useCallback(
    async () => {
  try {
    _accountSession.assertCurrent();

      try {
        await _accountSession.run(async () => (configureRevenueCat()));

        if (!mountedRef.current) {
          return "free";
        }

        const result =
          await _accountSession.run(async () => (refreshRevenueCatMembership()));

        if (result?.serverSync?.synced === true) {
          return applyMembershipPlan(
            result.serverSync.plan
          );
        }

        return applyMembershipPlan(
          result?.plan || "free"
        );
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log(
          "Membership refresh error:",
          error
        );

        return applyMembershipPlan("free");
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
},
    [applyMembershipPlan]
  );

  // ==========================================================
  // SECURE WCOIN BALANCE
  // ==========================================================

  const refreshSecureWCoinBalance = useCallback(
    async () => {
  try {
    _accountSession.assertCurrent();

      try {
        const value = await _accountSession.run(async () => (getWCoins()));

        const balance = Math.max(
          0,
          Math.floor(Number(value) || 0)
        );

        if (mountedRef.current) {
          setWCoinBalance(balance);
        }

        return balance;
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log(
          "Secure WCoin refresh error:",
          error
        );

        return 0;
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
},
    []
  );

  // ==========================================================
  // LEGACY WCOIN CALLBACK
  //
  // Existing behavior retained for screen compatibility.
  // ==========================================================

  async function addWCoins(amount) {
  try {
    _accountSession.assertCurrent();

    const saved = await _accountSession.run(async () => (AsyncStorage.getItem(
      WCOIN_KEY
    )));

    const updated =
      (Number(saved) || 0) +
      (Number(amount) || 0);

    await _accountSession.run(async () => (AsyncStorage.setItem(
      WCOIN_KEY,
      String(updated)
    )));

    if (!mountedRef.current) {
      return;
    }

    setWCoinBalance(updated);

    Alert.alert(
      "WCoins",
      `W Coins now: ${updated}`
    );
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

  // ==========================================================
  // JOURNEY REWARD FALLBACK
  //
  // Existing behavior retained for screen compatibility.
  // ==========================================================

  async function awardJourneyRewards(journey) {
  try {
    _accountSession.assertCurrent();

    if (!journey?.id) {
      return false;
    }

    const rewardKey =
      `journeyRewarded_${journey.id}`;

    const alreadyRewarded =
      await _accountSession.run(async () => (AsyncStorage.getItem(rewardKey)));

    if (alreadyRewarded === "true") {
      if (mountedRef.current) {
        Alert.alert(
          "Journey",
          "Journey reward already claimed."
        );
      }

      return false;
    }

    const points =
      Number(journey.rewardPoints) || 0;

    const coins =
      Number(journey.rewardCoins) || 0;

    const savedPoints =
      await _accountSession.run(async () => (AsyncStorage.getItem(
        "rewardPoints"
      )));

    const updatedPoints =
      (Number(savedPoints) || 0) + points;

    await _accountSession.run(async () => (AsyncStorage.setItem(
      "rewardPoints",
      String(updatedPoints)
    )));

    await _accountSession.run(async () => (AsyncStorage.setItem(
      rewardKey,
      "true"
    )));

    if (coins > 0) {
      await _accountSession.run(async () => (addWCoins(coins)));
    }

    if (!mountedRef.current) {
      return true;
    }

    Alert.alert(
      "Journey Complete",
      `+${points} Legathon Points\n+${coins} WCoins\nPassport Stamp Unlocked`
    );

    setSelectedPassport(journey);
    setActiveTab("worldPassport");

    return true;
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

  // ==========================================================
  // GLOBAL STEP SYNCHRONIZATION
  // ==========================================================

  const runGlobalStepSync = useCallback(
    async () => {
  try {
    _accountSession.assertCurrent();

      if (
        !mountedRef.current ||
        stepSyncRunningRef.current
      ) {
        return;
      }

      stepSyncRunningRef.current = true;

      try {

        const result = await _accountSession.run(async () => (syncTodaySteps()));

        if (__DEV__) {
          console.log(
            "[GLOBAL STEP ROUTER]",
            {
              delta: result?.delta ?? 0,
              destination:
                result?.destination ?? null,
              marathonId:
                result?.marathonId ?? null,
              synced:
                result?.synced === true,
            }
          );
        }
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log(
          "Global step router error:",
          error
        );
      } finally {
        stepSyncRunningRef.current = false;
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
},
    []
  );

  // ==========================================================
  // INITIAL STEP SYNC
  // ==========================================================

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    runGlobalStepSync();
  }, [runGlobalStepSync]);

  // ==========================================================
  // APP-WIDE STEP SYNC
  //
  // Cleanup runs when the signed-in application unmounts.
  // ==========================================================

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

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
        clearInterval(
          stepSyncTimerRef.current
        );
      }

      stepSyncTimerRef.current = null;
    };

    if (AppState.currentState === "active") {
      startStepSync();
    }

    const subscription =
      AppState.addEventListener(
        "change",
        next => {
  if (!_accountSession.isCurrent()) return;

          const previous =
            appStateRef.current;

          appStateRef.current = next;

          if (next === "active") {
            runGlobalStepSync();
            startStepSync();
          } else if (
            previous === "active" &&
            (
              next === "inactive" ||
              next === "background"
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

  // ==========================================================
  // LOAD LAST JOURNEY
  // ==========================================================

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    let cancelled = false;

    async function restoreLastJourney() {
  try {
    _accountSession.assertCurrent();

      try {
        const raw =
          await _accountSession.run(async () => (AsyncStorage.getItem(
            "lastJourney"
          )));

        if (!raw || cancelled) {
          return;
        }

        const journey = JSON.parse(raw);

        setLastJourney(journey);
        setSelectedJourney(journey);
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log(
          "Last journey load error:",
          error
        );
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

    restoreLastJourney();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // MEMBERSHIP AND WCOINS
  // ==========================================================

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    refreshVerifiedMembership();
    refreshSecureWCoinBalance();

    const subscription =
      AppState.addEventListener(
        "change",
        state => {
  if (!_accountSession.isCurrent()) return;

          if (state === "active") {
            refreshVerifiedMembership();
            refreshSecureWCoinBalance();
          }
        }
      );

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
  try {
    _accountSession.assertCurrent();

    setSelectedJourney(journey);
    setLastJourney(journey);

    await _accountSession.run(async () => (AsyncStorage.setItem(
      "lastJourney",
      JSON.stringify(journey)
    )));

    if (mountedRef.current) {
      setActiveTab("journeyDetail");
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
};

  const openGPSJourneyMap = async journey => {
  try {
    _accountSession.assertCurrent();

    setSelectedJourney(journey);
    setLastJourney(journey);

    await _accountSession.run(async () => (AsyncStorage.setItem(
      "lastJourney",
      JSON.stringify(journey)
    )));

    if (mountedRef.current) {
      setActiveTab("journeyMap");
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
    _accountSession.assertCurrent();

    try {
      const restored =
        await _accountSession.run(async () => (restoreRevenueCatPurchases()));

      const plan =
        applyMembershipPlan(restored);

      await _accountSession.run(async () => (refreshVerifiedMembership()));

      return plan;
    } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

      console.log(
        "Restore purchases error:",
        error
      );

      return "free";
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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
      {
  

return (setActiveTab("journeys"));
},

    goToGPSJourneyMap: () => {
  

      const journey =
        lastJourney || selectedJourney;

      if (journey) {
        openGPSJourneyMap(journey);
      } else {
        setActiveTab("journeys");
      }
    },

    goToPassport: () =>
      {
  

return (setActiveTab("passport"));
},

    goToAvatarProfile: () =>
      {
  

return (setActiveTab("avatarProfile"));
},

    goToRewards: () =>
      {
  

return (setActiveTab("rewards"));
},

    goToWalkingAnalytics: () =>
      {
  

return (setActiveTab("walkingAnalytics"));
},

    goToLegathons: () =>
      {
  

return (setActiveTab("legathons"));
},
  };

  // ==========================================================
  // SCREEN ROUTER
  // ==========================================================

  let screen = null;

  // HOME

  const membershipGate = getMembershipGate(
    activeTab, subscriptionPlan, selectedJourney, lastJourney
  );

  // Do not mount paid screens (or start their effects) for a Free account.
  if (membershipGate) {
    screen = (
      <View style={styles.membershipGate}>
        <Text accessibilityRole="header" style={styles.membershipGateTitle}>
          {membershipGate.title}
        </Text>
        <Text style={styles.membershipGateText}>
          {membershipGate.missingJourney
            ? "Select a journey from Journeys to check its availability."
            : `${membershipGate.required} membership required. Your current plan is ${subscriptionPlan}.`}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.membershipGateButton}
          onPress={() => setActiveTab(membershipGate.missingJourney ? "journeys" : "subscription")}
        >
          <Text style={styles.membershipGateButtonText}>
            {membershipGate.missingJourney ? "Choose a Journey" : "View Memberships"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={goMore}>
          <Text style={styles.membershipGateBack}>Back to More</Text>
        </TouchableOpacity>
      </View>
    );
  }
  else if (activeTab === "home") {
    screen = (
      <WalkingDashboardScreen
        {...dashboardProps}
      />
    );
  }

  // JOURNEYS

  else if (activeTab === "journeys") {
    screen = (
      <JourneysScreen
        language={language}
        activeJourney={selectedJourney}
        setSelectedJourney={setSelectedJourney}
        goToJourneyDetail={openJourneyDetail}
        goToGPSJourneyMap={openGPSJourneyMap}
        goToSubscription={() =>
          {
  

return (setActiveTab("subscription"));
}
        }
        goBack={goHome}
        subscriptionPlan={subscriptionPlan}
      />
    );
  }

  // JOURNEY DETAIL

  else if (activeTab === "journeyDetail") {
    screen = (
      <JourneyDetailScreen
        language={language}
        journey={selectedJourney}
        goBack={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        startJourney={journey => {
  

          const required =
            journey?.accessLevel ||
            (
              journey?.premium
                ? "premium"
                : "free"
            );

          const current = String(
            subscriptionPlan || "free"
          ).toLowerCase();

          const allowed =
            required === "free" ||
            (
              required === "premium" &&
              (
                current === "premium" ||
                current === "elite"
              )
            ) ||
            (
              required === "elite" &&
              current === "elite"
            );

          setSelectedJourney(journey);

          if (!allowed) {
            setActiveTab("subscription");
            return;
          }

          setLastJourney(journey);
          setActiveTab("journeyMap");
        }}
        goToSubscription={() =>
          {
  

return (setActiveTab("subscription"));
}
        }
        subscriptionPlan={subscriptionPlan}
        lifetimeSteps={lifetimeSteps}
      />
    );
  }

  // GPS JOURNEY MAP

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
          {
  

return (setActiveTab("journeyDetail"));
}
        }
        goToDetail={() =>
          {
  

return (setActiveTab("journeyDetail"));
}
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

  // SUBSCRIPTION CHECKOUT

  else if (
    activeTab === "subscriptionCheckout"
  ) {
    screen = (
      <SubscriptionCheckoutScreen
        language={language}
        selectedPlan={selectedPlan}
        subscriptionPlan={subscriptionPlan}
        goBack={() =>
          {
  

return (setActiveTab("subscription"));
}
        }
        onConfirm={async plan => {
  try {
    _accountSession.assertCurrent();

          applyMembershipPlan(plan);

          await _accountSession.run(async () => (refreshVerifiedMembership()));

          if (mountedRef.current) {
            goHome();
          }
        
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}}
      />
    );
  }

  // MEAL PLANNER

  else if (activeTab === "mealPlanner") {
    screen = (
      <MealPlannerScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("aiCoach"));
}
        }
      />
    );
  }

  // JOURNEY PREFERENCES

  else if (
    activeTab === "journeyPreferences"
  ) {
    screen = (
      <JourneyPreferencesScreen
        language={language}
        goToSummary={() =>
          {
  

return (setActiveTab(
            "personalizationSummary"
          ));
}
        }
        goBack={goHome}
      />
    );
  }

  // PERSONALIZATION SUMMARY

  else if (
    activeTab === "personalizationSummary"
  ) {
    screen = (
      <PersonalizationSummaryScreen
        language={language}
        startLegacy={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        editPreferences={() =>
          {
  

return (setActiveTab(
            "journeyPreferences"
          ));
}
        }
      />
    );
  }

  // REWARDS

  else if (activeTab === "rewards") {
    screen = (
      <RewardsScreen
        language={language}
        wCoinBalance={wCoinBalance}
        addWCoins={addWCoins}
      />
    );
  }

  // AVATAR CENTER

  else if (activeTab === "avatarCenter") {
    screen = (
      <AvatarCenterScreen
        language={language}
        goBack={goHome}
      />
    );
  }

  // MORE MENU

  else if (activeTab === "more") {
    screen = (
      <MoreScreen
        language={language}
        goToProfile={() =>
          {
  

return (setActiveTab("profile"));
}
        }
        goToSubscription={() =>
          {
  

return (setActiveTab("subscription"));
}
        }
        goToPassport={() =>
          {
  

return (setActiveTab("passport"));
}
        }
        goToMedalCollection={goMedals}
        goToCertificate={() =>
          {
  

return (setActiveTab("certificate"));
}
        }
        goToWalkingAnalytics={() =>
          {
  

return (setActiveTab("walkingAnalytics"));
}
        }
        goToAICoach={() =>
          {
  

return (setActiveTab("aiCoach"));
}
        }
        goToGPSJourneyMap={() =>
          {
  

return (setActiveTab("journeyMap"));
}
        }
        goToJourneyStory={() =>
          {
  

return (setActiveTab("journeyStory"));
}
        }
        goToLegathons={() =>
          {
  

return (setActiveTab("legathons"));
}
        }
        goToCommunity={() =>
          {
  

return (setActiveTab("community"));
}
        }
        goToLeaderboard={() =>
          {
  

return (setActiveTab("leaderboard"));
}
        }
        goToHallOfLegends={() =>
          {
  

return (setActiveTab("hallOfLegends"));
}
        }
        goToDailyChallenge={() =>
          {
  

return (setActiveTab("dailyChallenge"));
}
        }
        goToPhysicalStore={() =>
          {
  

return (setActiveTab("physicalMerch"));
}
        }
        goToMarketplace={() =>
          {
  

return (setActiveTab("physicalMerch"));
}
        }
        goToInventory={() =>
          {
  

return (setActiveTab("physicalMerch"));
}
        }
        goToWCoinWallet={() =>
          {
  

return (setActiveTab("wCoinWallet"));
}
        }
        goToAvatarProfile={() =>
          {
  

return (setActiveTab("avatarCenter"));
}
        }
        goToBreathing={() =>
          {
  

return (setActiveTab("breathing"));
}
        }
        goToBreathingAnalytics={() =>
          {
  

return (setActiveTab("breathingAnalytics"));
}
        }
        selectedJourney={
          selectedJourney || "selma"
        }
        goToLanguage={() =>
          {
  

return (setActiveTab("language"));
}
        }
        goToSettings={() =>
          {
  

return (setActiveTab("settings"));
}
        }
        goToPrivacyPolicy={() =>
          {
  

return (setActiveTab("privacyPolicy"));
}
        }
        goToAbout={() =>
          {
  

return (setActiveTab("about"));
}
        }
        goToWalkingFunction={() =>
          {
  

return (setActiveTab("walkingFunction"));
}
        }
        goToJourneyPreferences={() =>
          {
  

return (setActiveTab("journeyPreferences"));
}
        }
      />
    );
  }

  // LEGATHON MEDAL COLLECTION

  else if (
    activeTab === "medalCollection"
  ) {
    screen = (
      <MedalCollectionScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("legathons"));
}
        }
      />
    );
  }

  // JOURNEY PASSPORT COLLECTION

  else if (activeTab === "passport") {
    screen = (
      <PassportScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // PASSPORT DETAIL

  else if (
    activeTab === "passportDetail"
  ) {
    screen = (
      <PassportDetailScreen
        language={language}
        passportId={selectedPassport}
        goBack={() =>
          {
  

return (setActiveTab("passport"));
}
        }
      />
    );
  }

  // CERTIFICATE

  else if (activeTab === "certificate") {
    screen = (
      <CertificateScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // PROFILE

  else if (activeTab === "profile") {
    screen = (
      <ProfileScreen
        language={language}
        goBack={goMore}
        goToAvatarCenter={() =>
          {
  

return (setActiveTab("avatarCenter"));
}
        }
        openPassport={passportId => {
  

          setSelectedPassport(passportId);
          setActiveTab("passportDetail");
        }}
      />
    );
  }

  // WCOIN WALLET

  else if (activeTab === "wCoinWallet") {
    screen = (
      <WCoinWalletScreen
        language={language}
        wCoinBalance={wCoinBalance}
        goBack={goMore}
      />
    );
  }

  // SUBSCRIPTIONS

  else if (activeTab === "subscription") {
    screen = (
      <SubscriptionScreen
        language={language}
        subscriptionPlan={subscriptionPlan}
        setSubscriptionPlan={setSubscriptionPlan}
        goBack={goMore}
        goToPaywall={plan => {
  

          setSelectedPlan(plan);
          setActiveTab(
            "subscriptionCheckout"
          );
        }}
        onRestorePurchases={
          handleRestorePurchases
        }
        goToPrivacyPolicy={() =>
          {
  

return (setActiveTab("privacyPolicy"));
}
        }
      />
    );
  }

  // HALL OF LEGENDS

  else if (
    activeTab === "hallOfLegends"
  ) {
    screen = (
      <HallOfLegendsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // WALKING ANALYTICS

  else if (
    activeTab === "walkingAnalytics"
  ) {
    screen = (
      <WalkingAnalyticsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // WALKING FUNCTION

  else if (
    activeTab === "walkingFunction"
  ) {
    screen = (
      <WalkingFunctionScreen
        language={language}
        todaySteps={walkingData?.steps}
        liveSteps={walkingData?.liveSteps}
        liveMiles={walkingData?.liveMiles}
        walkingSeconds={
          walkingData?.walkingSeconds
        }
        walkingMinutes={
          walkingData?.walkingMinutes
        }
        paceMinutesPerMile={
          walkingData?.paceMinutesPerMile
        }
        speedMph={walkingData?.speedMph}
        cadence={walkingData?.cadence}
        pedometerAvailable={
          walkingData?.isAvailable
        }
        goBack={goMore}
        goHome={goHome}
        goJourneys={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        goRewards={() =>
          {
  

return (setActiveTab("rewards"));
}
        }
        goMore={goMore}
      />
    );
  }

  // AI WELLNESS

  else if (activeTab === "aiCoach") {
    screen = (
      <AIWellnessMasterScreen
        userPlan={subscriptionPlan}
        goToSubscription={() => setActiveTab("subscription")}
        language={language}
        goToGPSJourneyMap={params => {
  

          const journey =
            params?.journey ||
            params ||
            null;

          if (journey) {
            setSelectedJourney(journey);
          }

          setActiveTab("journeyMap");
        }}
        goToJourneys={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        goToBreathing={() =>
          {
  

return (setActiveTab("breathing"));
}
        }
        goToHydration={() =>
          {
  

return (setActiveTab("hydration"));
}
        }
        goToRecovery={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToSleep={() =>
          {
  

return (setActiveTab("sleep"));
}
        }
        goToWalkingAnalytics={() =>
          {
  

return (setActiveTab("walkingAnalytics"));
}
        }
        goToMealPlanner={() =>
          {
  

return (setActiveTab("mealPlanner"));
}
        }
        goToAIConversation={() =>
          {
  

return (setActiveTab("aiConversation"));
}
        }
      />
    );
  }

  // COMMUNITY

  else if (activeTab === "community") {
    screen = (
      <CommunityScreen
        language={language}
        goBack={goMore}
        goToAICoach={() =>
          {
  

return (setActiveTab("aiConversation"));
}
        }
        goToComments={post => {
  

          setSelectedCommunityPost(post);
          setActiveTab(
            "communityComments"
          );
        }}
      />
    );
  }

  // COMMUNITY COMMENTS

  else if (
    activeTab === "communityComments"
  ) {
    screen = (
      <CommunityCommentsScreen
        language={language}
        post={selectedCommunityPost}
        goBack={() =>
          {
  

return (setActiveTab("community"));
}
        }
      />
    );
  }

  // LEADERBOARD

  else if (activeTab === "leaderboard") {
    screen = (
      <LeaderboardScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // DAILY CHALLENGE

  else if (
    activeTab === "dailyChallenge"
  ) {
    screen = (
      <DailyChallengeScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // BREATHING

  else if (activeTab === "breathing") {
    screen = (
      <BreathingScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
      />
    );
  }

  // BREATHING ANALYTICS

  else if (
    activeTab === "breathingAnalytics"
  ) {
    screen = (
      <BreathingAnalyticsScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // HYDRATION

  else if (activeTab === "hydration") {
    screen = (
      <HydrationCoachScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToRecovery={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToAIWellness={() =>
          {
  

return (setActiveTab("aiCoach"));
}
        }
      />
    );
  }

  // SLEEP

  else if (activeTab === "sleep") {
    screen = (
      <SleepCoachScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToRecovery={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToBreathing={() =>
          {
  

return (setActiveTab("breathing"));
}
        }
        goToAIWellness={() =>
          {
  

return (setActiveTab("aiCoach"));
}
        }
      />
    );
  }

  // RECOVERY

  else if (activeTab === "recovery") {
    screen = (
      <RecoveryCoachScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("aiConversation"));
}
        }
        goToBreathing={() =>
          {
  

return (setActiveTab("breathing"));
}
        }
        goToHydration={() =>
          {
  

return (setActiveTab("hydration"));
}
        }
        goToSleep={() =>
          {
  

return (setActiveTab("sleep"));
}
        }
        goToWalkingAnalytics={() =>
          {
  

return (setActiveTab("walkingAnalytics"));
}
        }
      />
    );
  }

  // AI CONVERSATION — TEXT BASED

  else if (
    activeTab === "aiConversation"
  ) {
    screen = (
      <AIConversationScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("aiCoach"));
}
        }
        goToGPSJourneyMap={() =>
          {
  

return (setActiveTab("journeyMap"));
}
        }
        goToJourneys={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        goToMealPlanner={() =>
          {
  

return (setActiveTab("mealPlanner"));
}
        }
        goToHydration={() =>
          {
  

return (setActiveTab("hydration"));
}
        }
        goToRecovery={() =>
          {
  

return (setActiveTab("recovery"));
}
        }
        goToSleep={() =>
          {
  

return (setActiveTab("sleep"));
}
        }
        goToBreathing={() =>
          {
  

return (setActiveTab("breathing"));
}
        }
        wellness={{
          steps: Number(
            walkingData?.steps || 0
          ),
          stepGoal: 7000,
          hydration: 0,
          hydrationGoal: 100,
          recovery: null,
          sleepHours: null,
          journey:
            selectedJourney?.title || "",
          journeyProgress:
            selectedJourney?.progress ||
            selectedJourney?.journeyProgress ||
            0,
          checkpoint:
            selectedJourney?.currentCheckpoint ||
            "",
        }}
      />
    );
  }

  // PHYSICAL MERCHANDISE STORE

  else if (
    activeTab === "physicalMerch"
  ) {
    screen = (
      <PhysicalMerchStoreScreen
        language={language}
        goBack={() =>
          {
  

return (setActiveTab("wCoinWallet"));
}
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

  // STORE ITEM DETAIL

  else if (
    activeTab === "storeItemDetail"
  ) {
    screen = (
      <StoreItemDetailScreen
        language={language}
        item={selectedStoreItem}
        goBack={() =>
          {
  

return (setActiveTab("physicalMerch"));
}
        }
        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
      />
    );
  }

  // PURCHASE CONFIRMATION

  else if (
    activeTab === "purchaseConfirmation"
  ) {
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
          {
  

return (setActiveTab("physicalMerch"));
}
        }
        goHome={goHome}
        goToInventory={() =>
          {
  

return (setActiveTab("physicalMerch"));
}
        }
      />
    );
  }

  // JOURNEY STORY

  else if (
    activeTab === "journeyStory"
  ) {
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
            checkpoint:
              selectedStoryCheckpoint,
          },
        }}
        lifetimeSteps={totalSteps}
        subscriptionPlan={subscriptionPlan}
        goBack={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
        goToProgress={item => {
  

          const next =
            item &&
            typeof item === "object"
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

  // AVATAR PROFILE

  else if (
    activeTab === "avatarProfile"
  ) {
    screen = (
      <AvatarProfileScreen
        language={language}
        currentAvatar={equippedAvatar}
        equippedAvatar={equippedAvatar}
        goBack={goHome}
        goToAvatarCenter={() =>
          {
  

return (setActiveTab("avatarCenter"));
}
        }
        changeAvatar={() =>
          {
  

return (setActiveTab("avatarCenter"));
}
        }
      />
    );
  }

  // WORLD PASSPORT — JOURNEYS

  else if (
    activeTab === "worldPassport"
  ) {
    screen = (
      <PassportScreen
        language={language}
        selectedPassport={selectedPassport}
        goBack={() =>
          {
  

return (setActiveTab("journeys"));
}
        }
      />
    );
  }

  // LEGATHONS

  else if (activeTab === "legathons") {
    screen = (
      <View style={styles.legathonsWrap}>
        <TouchableOpacity
          style={styles.medalShortcutButton}
          activeOpacity={0.85}
          onPress={goMedals}
          accessibilityRole="button"
        >
          <Text
            style={styles.medalShortcutText}
          >
            🏅 View My Medal Collection
          </Text>
        </TouchableOpacity>

        <View style={styles.legathonsContent}>
          <MarathonScreen
            language={language}
            goBack={goMore}
            goToWorldMarathonDetail={
              marathonId => {
  

                setSelectedMarathonId(
                  marathonId
                );

                setActiveTab(
                  "worldMarathonDetail"
                );
              }
            }
          />
        </View>
      </View>
    );
  }

  // LEGATHON DETAIL

  else if (
    activeTab === "worldMarathonDetail"
  ) {
    screen = (
      <WorldMarathonDetailScreen
        language={language}
        marathonId={selectedMarathonId}
        goBack={() =>
          {
  

return (setActiveTab("legathons"));
}
        }
        goToCertificate={goMedals}
        goToPassport={goMedals}
        goToMedalCollection={goMedals}
      />
    );
  }

  // LANGUAGE

  else if (activeTab === "language") {
    screen = (
      <LanguageSelectionScreen
        language={language}
        setLanguage={setLanguage}
        goBack={goMore}
      />
    );
  }

  // SETTINGS — LOGOUT CONNECTED

  else if (activeTab === "settings") {
    screen = (
      <SettingsScreen
        language={language}
        goBack={goMore}
        goToProfile={() =>
          {
  

return (setActiveTab("profile"));
}
        }
        goToLanguage={() =>
          {
  

return (setActiveTab("language"));
}
        }
        goToPrivacy={() =>
          {
  

return (setActiveTab("privacyPolicy"));
}
        }
        goToAbout={() =>
          {
  

return (setActiveTab("about"));
}
        }
        onLogout={onLogout}
      />
    );
  }

  // PRIVACY POLICY

  else if (
    activeTab === "privacyPolicy"
  ) {
    screen = (
      <PrivacyPolicyScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // ABOUT

  else if (activeTab === "about") {
    screen = (
      <AboutScreen
        language={language}
        goBack={goMore}
      />
    );
  }

  // FALLBACK

  else {
    screen = (
      <WalkingDashboardScreen
        {...dashboardProps}
      />
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
          label={translate(
            language,
            "journeys"
          )}
          active={activeTab === "journeys"}
          onPress={() =>
            {
  

return (setActiveTab("journeys"));
}
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/coin.png"
          )}
          label={translate(
            language,
            "rewards"
          )}
          active={activeTab === "rewards"}
          onPress={() =>
            {
  

return (setActiveTab("rewards"));
}
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
  membershipGate: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: "#050B16" },
  membershipGateTitle: { color: "#F7BE22", fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 16 },
  membershipGateText: { color: "#DFE8F5", fontSize: 18, lineHeight: 27, textAlign: "center", marginBottom: 24 },
  membershipGateButton: { backgroundColor: "#F7BE22", padding: 18, borderRadius: 18, alignItems: "center" },
  membershipGateButtonText: { color: "#071223", fontSize: 18, fontWeight: "800" },
  membershipGateBack: { color: "#71E5CD", fontSize: 17, textAlign: "center", padding: 20 },

  authLoading: {
    flex: 1,
    backgroundColor: "#020611",
    alignItems: "center",
    justifyContent: "center",
  },

  authLoadingBrand: {
    color: "#D4AF37",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 20,
  },

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
      "rgba(255,215,90,0.55)",
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
    transform: [{ scale: 1.16 }],
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