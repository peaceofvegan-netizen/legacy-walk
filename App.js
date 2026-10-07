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

import {
  useStepCounter,
} from "./hooks/useStepCounter";

import {
  getWCoins,
} from "./utils/wcoinStorage";

// ============================================================
// SCREENS
// ============================================================

import PassportDetailScreen
  from "./screens/PassportDetailScreen";

import WalkingDashboardScreen
  from "./screens/WalkingDashboardScreen";

import JourneysScreen
  from "./screens/JourneysScreen";

import JourneyDetailScreen
  from "./screens/JourneyDetailScreen";

import GPSJourneyMapScreen
  from "./screens/GPSJourneyMapScreen";

import WalkingFunctionScreen
  from "./screens/WalkingFunctionScreen";

import RewardsScreen
  from "./screens/RewardsScreen";

import MoreScreen
  from "./screens/MoreScreen";

import RecoveryCoachScreen
  from "./screens/RecoveryCoachScreen";

import HydrationCoachScreen
  from "./screens/HydrationCoachScreen";

import SleepCoachScreen
  from "./screens/SleepCoachScreen";

import BreathingScreen
  from "./screens/BreathingScreen";

import BreathingAnalyticsScreen
  from "./screens/BreathingAnalyticsScreen";

import WalkingAnalyticsScreen
  from "./screens/WalkingAnalyticsScreen";

import AIConversationScreen
  from "./screens/AIConversationScreen";

import AIWellnessMasterScreen
  from "./screens/AIWellnessMasterScreen";

import AvatarCenterScreen
  from "./screens/AvatarCenterScreen";

import AvatarProfileScreen
  from "./screens/AvatarProfileScreen";

import PassportScreen
  from "./screens/PassportScreen";

import MarathonScreen
  from "./screens/MarathonScreen";

import WorldMarathonDetailScreen
  from "./screens/WorldMarathonDetailScreen";

import JourneyPreferencesScreen
  from "./screens/JourneyPreferencesScreen";

import PersonalizationSummaryScreen
  from "./screens/PersonalizationSummaryScreen";

import SubscriptionCheckoutScreen
  from "./screens/SubscriptionCheckoutScreen";

import SubscriptionScreen
  from "./screens/SubscriptionScreen";

import MealPlannerScreen
  from "./screens/MealPlannerScreen";

import HallOfLegendsScreen
  from "./screens/HallOfLegendsScreen";

import CertificateScreen
  from "./screens/CertificateScreen";

import ProfileScreen
  from "./screens/ProfileScreen";

import AboutScreen
  from "./screens/AboutScreen";

import PhysicalMerchStoreScreen
  from "./screens/PhysicalMerchStoreScreen";

import StoreItemDetailScreen
  from "./screens/StoreItemDetailScreen";

import PurchaseConfirmationScreen
  from "./screens/PurchaseConfirmationScreen";

import CommunityScreen
  from "./screens/CommunityScreen";

import CommunityCommentsScreen
  from "./screens/CommunityCommentsScreen";

import LeaderboardScreen
  from "./screens/LeaderboardScreen";

import DailyChallengeScreen
  from "./screens/DailyChallengeScreen";

import SettingsScreen
  from "./screens/SettingScreen";

import PrivacyPolicyScreen
  from "./screens/PrivacyScreen";

import LanguageSelectionScreen
  from "./screens/LanguageSelectionScreen";

import WCoinWalletScreen
  from "./screens/WCoinWalletScreen";

import JourneyStoryScreen
  from "./screens/JourneyStoryScreen";

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

const WCOIN_KEY =
  "wCoinBalance";

const STRIPE_PUBLISHABLE_KEY =
  process.env
    .EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "";

// ============================================================
// NAV BUTTON
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

          active &&
            styles.activeNavIcon,
        ]}
      />

      <Text
        style={[
          styles.navText,

          active &&
            styles.activeNavText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const [
    activeTab,
    setActiveTab,
  ] =
    useState(
      "home"
    );

  // ==========================================================
  // WALKING
  // ==========================================================

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(
      0
    );

  const walkingData =
    useStepCounter();

  const [
    totalSteps,
    setTotalSteps,
  ] =
    useState(
      0
    );

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const [
    language,
    setLanguage,
  ] =
    useState(
      "en"
    );

  // ==========================================================
  // JOURNEYS
  // ==========================================================

  const [
    lastJourney,
    setLastJourney,
  ] =
    useState(
      null
    );

  const [
    selectedJourney,
    setSelectedJourney,
  ] =
    useState(
      null
    );

  const [
    selectedStoryCheckpoint,
    setSelectedStoryCheckpoint,
  ] =
    useState(
      1
    );

  // ==========================================================
  // STORE
  // ==========================================================

  const [
    selectedStoreItem,
    setSelectedStoreItem,
  ] =
    useState(
      null
    );

  // ==========================================================
  // COMMUNITY
  // ==========================================================

  const [
    selectedCommunityPost,
    setSelectedCommunityPost,
  ] =
    useState(
      null
    );

  // ==========================================================
  // PASSPORT
  // ==========================================================

  const [
    selectedPassport,
    setSelectedPassport,
  ] =
    useState(
      null
    );

  // ==========================================================
  // AVATAR
  // ==========================================================

  const [
    equippedAvatar,
    setEquippedAvatar,
  ] =
    useState(
      null
    );

  // ==========================================================
  // SUBSCRIPTION
  // ==========================================================

  const [
    subscriptionPlan,
    setSubscriptionPlan,
  ] =
    useState(
      "free"
    );

  const [
    isPremium,
    setIsPremium,
  ] =
    useState(
      false
    );

  const [
    selectedPlan,
    setSelectedPlan,
  ] =
    useState(
      null
    );

  // ==========================================================
  // WCOINS
  // ==========================================================

  const [
    wCoinBalance,
    setWCoinBalance,
  ] =
    useState(
      0
    );

  // ==========================================================
  // MARATHON
  // ==========================================================

  const [
    selectedMarathonId,
    setSelectedMarathonId,
  ] =
    useState(
      "nyc"
    );

  // ==========================================================
  // VERIFIED MEMBERSHIP
  // ==========================================================

  const applyMembershipPlan =
    useCallback(
      (
        incomingPlan
      ) => {
        const value =
          String(
            incomingPlan ||
            "free"
          )
            .toLowerCase();

        const plan =
          value === "elite"
            ? "elite"
            : value === "premium"
              ? "premium"
              : "free";

        setSubscriptionPlan(
          plan
        );

        setIsPremium(
          plan === "premium" ||
          plan === "elite"
        );

        return plan;
      },
      []
    );

  // ==========================================================
  // REFRESH VERIFIED MEMBERSHIP
  // ==========================================================

  const refreshVerifiedMembership =
    useCallback(
      async () => {
        try {
          await configureRevenueCat();

          const result =
            await refreshRevenueCatMembership();

          console.log(
            "Membership refresh result:",
            result
          );

          if (
            result
              ?.serverSync
              ?.synced ===
            true
          ) {
            return applyMembershipPlan(
              result
                .serverSync
                .plan
            );
          }

          if (
            result?.plan
          ) {
            return applyMembershipPlan(
              result.plan
            );
          }

          return applyMembershipPlan(
            "free"
          );
        } catch (
          error
        ) {
          console.log(
            "Membership refresh error:",
            error
          );

          return applyMembershipPlan(
            "free"
          );
        }
      },
      [
        applyMembershipPlan,
      ]
    );

  // ==========================================================
  // SECURE WCOIN BALANCE
  // ==========================================================

  const refreshSecureWCoinBalance =
    useCallback(
      async () => {
        try {
          const balance =
            await getWCoins();

          const normalized =
            Math.max(
              0,
              Math.floor(
                Number(
                  balance
                ) || 0
              )
            );

          setWCoinBalance(
            normalized
          );

          return normalized;
        } catch (
          error
        ) {
          console.log(
            "Secure WCoin refresh error:",
            error
          );

          return 0;
        }
      },
      []
    );

  // ==========================================================
  // LEGACY LOCAL WCOIN AWARD
  // ==========================================================

  async function addWCoins(
    amount
  ) {
    const saved =
      await AsyncStorage
        .getItem(
          WCOIN_KEY
        );

    const current =
      Number(
        saved || 0
      );

    const updated =
      current +
      Number(
        amount || 0
      );

    await AsyncStorage
      .setItem(
        WCOIN_KEY,
        String(
          updated
        )
      );

    setWCoinBalance(
      updated
    );

    console.log(
      "Saved WCoins:",
      updated
    );

    alert(
      `W Coins now: ${updated}`
    );
  }

  // ==========================================================
  // JOURNEY REWARD FALLBACK
  // ==========================================================

  async function awardJourneyRewards(
    journey
  ) {
    if (
      !journey?.id
    ) {
      return false;
    }

    const rewardKey =
      `journeyRewarded_${journey.id}`;

    const alreadyRewarded =
      await AsyncStorage
        .getItem(
          rewardKey
        );

    if (
      alreadyRewarded ===
      "true"
    ) {
      alert(
        "Journey reward already claimed."
      );

      return false;
    }

    const points =
      Number(
        journey
          .rewardPoints ||
        0
      );

    const coins =
      Number(
        journey
          .rewardCoins ||
        0
      );

    const savedPoints =
      await AsyncStorage
        .getItem(
          "rewardPoints"
        );

    const updatedPoints =
      Number(
        savedPoints ||
        0
      ) +
      points;

    await AsyncStorage
      .setItem(
        "rewardPoints",
        String(
          updatedPoints
        )
      );

    await AsyncStorage
      .setItem(
        rewardKey,
        "true"
      );

    if (
      coins >
      0
    ) {
      await addWCoins(
        coins
      );
    }

    alert(
      `Journey Complete!\n+${points} Legathon Points\n+${coins} W Coins\nPassport Stamp Unlocked`
    );

    setSelectedPassport(
      journey
    );

    setActiveTab(
      "worldPassport"
    );

    return true;
  }

  // ==========================================================
  // GLOBAL STEP ROUTER
  // ==========================================================

  const appStateRef =
    useRef(
      AppState
        .currentState
    );

  const stepSyncRunningRef =
    useRef(
      false
    );

  const stepSyncTimerRef =
    useRef(
      null
    );

  const runGlobalStepSync =
    useCallback(
      async () => {
        if (
          stepSyncRunningRef
            .current
        ) {
          return;
        }

        stepSyncRunningRef
          .current =
          true;

        try {
          const available =
            await isStepTrackingAvailable();

          if (
            !available
          ) {
            return;
          }

          const result =
            await syncTodaySteps();

          if (
            __DEV__
          ) {
            console.log(
              "[GLOBAL STEP ROUTER]",
              {
                delta:
                  result
                    ?.delta ??
                  0,

                destination:
                  result
                    ?.destination ??
                  null,

                marathonId:
                  result
                    ?.marathonId ??
                  null,

                synced:
                  result
                    ?.synced ===
                  true,
              }
            );
          }
        } catch (
          error
        ) {
          console.log(
            "Global step router error:",
            error
          );
        } finally {
          stepSyncRunningRef
            .current =
            false;
        }
      },
      []
    );

  // ==========================================================
  // INITIAL STEP SYNC
  // ==========================================================

  useEffect(
    () => {
      runGlobalStepSync();
    },
    [
      runGlobalStepSync,
    ]
  );

  // ==========================================================
  // APP-WIDE STEP SYNC
  // ==========================================================

  useEffect(
    () => {
      const startStepSync =
        () => {
          if (
            stepSyncTimerRef
              .current
          ) {
            return;
          }

          stepSyncTimerRef
            .current =
            setInterval(
              () => {
                runGlobalStepSync();
              },
              5000
            );
        };

      const stopStepSync =
        () => {
          if (
            !stepSyncTimerRef
              .current
          ) {
            return;
          }

          clearInterval(
            stepSyncTimerRef
              .current
          );

          stepSyncTimerRef
            .current =
            null;
        };

      if (
        AppState
          .currentState ===
        "active"
      ) {
        startStepSync();
      }

      const subscription =
        AppState
          .addEventListener(
            "change",

            (
              nextState
            ) => {
              const previousState =
                appStateRef
                  .current;

              appStateRef
                .current =
                nextState;

              if (
                nextState ===
                "active"
              ) {
                runGlobalStepSync();

                startStepSync();

                return;
              }

              if (
                previousState ===
                  "active" &&

                (
                  nextState ===
                    "inactive" ||

                  nextState ===
                    "background"
                )
              ) {
                runGlobalStepSync();

                stopStepSync();
              }
            }
          );

      return () => {
        stopStepSync();

        subscription
          .remove();
      };
    },
    [
      runGlobalStepSync,
    ]
  );

  // ==========================================================
  // LOAD LANGUAGE
  // ==========================================================

  useEffect(
    () => {
      async function initLanguage() {
        try {
          const savedLanguage =
            await loadLanguage();

          if (
            savedLanguage
          ) {
            setLanguage(
              savedLanguage
            );
          }
        } catch (
          error
        ) {
          console.log(
            "Language load error:",
            error
          );
        }
      }

      initLanguage();
    },
    []
  );

  // ==========================================================
  // LOAD VERIFIED MEMBERSHIP WHEN APP OPENS
  // ==========================================================

  useEffect(
    () => {
      let mounted =
        true;

      async function loadMembership() {
        if (
          !mounted
        ) {
          return;
        }

        await refreshVerifiedMembership();
      }

      loadMembership();

      return () => {
        mounted =
          false;
      };
    },
    [
      refreshVerifiedMembership,
    ]
  );

  // ==========================================================
  // REFRESH MEMBERSHIP WHEN APP RETURNS
  // ==========================================================

  useEffect(
    () => {
      const subscription =
        AppState
          .addEventListener(
            "change",

            (
              nextState
            ) => {
              if (
                nextState ===
                "active"
              ) {
                refreshVerifiedMembership();
              }
            }
          );

      return () => {
        subscription
          .remove();
      };
    },
    [
      refreshVerifiedMembership,
    ]
  );

  // ==========================================================
  // LOAD WCOINS
  // ==========================================================

  useEffect(
    () => {
      refreshSecureWCoinBalance();
    },
    [
      refreshSecureWCoinBalance,
    ]
  );

  // ==========================================================
  // REFRESH WCOINS WHEN APP RETURNS
  // ==========================================================

  useEffect(
    () => {
      const subscription =
        AppState
          .addEventListener(
            "change",

            (
              nextState
            ) => {
              if (
                nextState ===
                "active"
              ) {
                refreshSecureWCoinBalance();
              }
            }
          );

      return () => {
        subscription
          .remove();
      };
    },
    [
      refreshSecureWCoinBalance,
    ]
  );

  // ==========================================================
  // LOAD LAST JOURNEY
  // ==========================================================

  useEffect(
    () => {
      async function loadLastJourney() {
        try {
          const saved =
            await AsyncStorage
              .getItem(
                "lastJourney"
              );

          if (
            saved
          ) {
            const journey =
              JSON.parse(
                saved
              );

            setLastJourney(
              journey
            );

            setSelectedJourney(
              journey
            );
          }
        } catch (
          error
        ) {
          console.log(
            "Last journey load error:",
            error
          );
        }
      }

      loadLastJourney();
    },
    []
  );

  // ==========================================================
  // NAVIGATION HELPERS
  // ==========================================================

  const goHome =
    () => {
      setActiveTab(
        "home"
      );
    };

  const goMore =
    () => {
      setActiveTab(
        "more"
      );
    };

  const openJourneyDetail =
    async (
      journey
    ) => {
      setSelectedJourney(
        journey
      );

      setLastJourney(
        journey
      );

      await AsyncStorage
        .setItem(
          "lastJourney",

          JSON.stringify(
            journey
          )
        );

      setActiveTab(
        "journeyDetail"
      );
    };

  const openGPSJourneyMap =
    async (
      journey
    ) => {
      setSelectedJourney(
        journey
      );

      setLastJourney(
        journey
      );

      await AsyncStorage
        .setItem(
          "lastJourney",

          JSON.stringify(
            journey
          )
        );

      setActiveTab(
        "journeyMap"
      );
    };

  const openStoreItemDetail =
    (
      item
    ) => {
      setSelectedStoreItem(
        item
      );

      setActiveTab(
        "storeItemDetail"
      );
    };

  const goToPurchaseConfirmation =
    (
      item
    ) => {
      setSelectedStoreItem(
        item
      );

      setActiveTab(
        "purchaseConfirmation"
      );
    };

  // ==========================================================
  // RESTORE REVENUECAT PURCHASES
  // ==========================================================

  async function handleRestorePurchases() {
    try {
      const restoredPlan =
        await restoreRevenueCatPurchases();

      const plan =
        applyMembershipPlan(
          restoredPlan
        );

      await refreshVerifiedMembership();

      return plan;
    } catch (
      error
    ) {
      console.log(
        "Restore purchases error:",
        error
      );

      return "free";
    }
  }

  // ==========================================================
  // SCREEN ROUTER
  // ==========================================================

  let screen;

  // ==========================================================
  // HOME
  // ==========================================================

  if (
    activeTab ===
    "home"
  ) {
    screen = (
      <WalkingDashboardScreen
        language={language}

        currentAvatar={
          equippedAvatar
        }

        activeJourney={
          selectedJourney
        }

        goToJourneys={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToGPSJourneyMap={() => {
          const journeyToOpen =
            lastJourney ||
            selectedJourney;

          if (
            journeyToOpen
          ) {
            openGPSJourneyMap(
              journeyToOpen
            );
          } else {
            setActiveTab(
              "journeys"
            );
          }
        }}

        goToPassport={() =>
          setActiveTab(
            "passport"
          )
        }

        goToAvatarProfile={() =>
          setActiveTab(
            "avatarProfile"
          )
        }

        goToRewards={() =>
          setActiveTab(
            "rewards"
          )
        }

        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }

        goToLegathons={() =>
          setActiveTab(
            "legathons"
          )
        }
      />
    );
  }

  // ==========================================================
  // JOURNEYS
  // ==========================================================

  else if (
    activeTab ===
    "journeys"
  ) {
    screen = (
      <JourneysScreen
        language={language}

        activeJourney={
          selectedJourney
        }

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
          setActiveTab(
            "subscription"
          )
        }

        goBack={
          goHome
        }

        subscriptionPlan={
          subscriptionPlan
        }
      />
    );
  }

  // ==========================================================
  // JOURNEY DETAIL
  // ==========================================================

  else if (
    activeTab ===
    "journeyDetail"
  ) {
    screen = (
      <JourneyDetailScreen
        language={language}

        journey={
          selectedJourney
        }

        goBack={() =>
          setActiveTab(
            "journeys"
          )
        }

        startJourney={(
          journey
        ) => {
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
            )
              .toLowerCase();

          const canStart =
            requiredPlan ===
              "free" ||

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

              currentPlan ===
                "elite"
            );

          if (
            !canStart
          ) {
            setSelectedJourney(
              journey
            );

            setActiveTab(
              "subscription"
            );

            return;
          }

          setSelectedJourney(
            journey
          );

          setLastJourney(
            journey
          );

          setActiveTab(
            "journeyMap"
          );
        }}

        goToSubscription={() =>
          setActiveTab(
            "subscription"
          )
        }

        subscriptionPlan={
          subscriptionPlan
        }

        lifetimeSteps={
          lifetimeSteps
        }
      />
    );
  }

  // ==========================================================
  // SUBSCRIPTION CHECKOUT
  // ==========================================================

  else if (
    activeTab ===
    "subscriptionCheckout"
  ) {
    screen = (
      <SubscriptionCheckoutScreen
        language={language}

        selectedPlan={
          selectedPlan
        }

        subscriptionPlan={
          subscriptionPlan
        }

        goBack={() =>
          setActiveTab(
            "subscription"
          )
        }

        onConfirm={
          async (
            plan
          ) => {
            applyMembershipPlan(
              plan
            );

            await refreshVerifiedMembership();

            setActiveTab(
              "home"
            );
          }
        }
      />
    );
  }

  // ==========================================================
  // MEAL PLANNER
  // ==========================================================

  else if (
    activeTab ===
    "mealPlanner"
  ) {
    screen = (
      <MealPlannerScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "aiCoach"
          )
        }
      />
    );
  }

  // ==========================================================
  // GPS JOURNEY MAP
  // ==========================================================

  else if (
    activeTab ===
    "journeyMap"
  ) {
    const journeyObject =
      typeof selectedJourney ===
        "object" &&
      selectedJourney

        ? selectedJourney

        : typeof lastJourney ===
            "object" &&
          lastJourney

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

        selectedJourney={
          journeyObject
        }

        activeJourney={
          journeyObject
        }

        journey={
          journeyObject
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
              checkpointNumber ||
              1
            )
          );

          setActiveTab(
            "journeyStory"
          );
        }}
      />
    );
  }

  // ==========================================================
  // JOURNEY PREFERENCES
  // ==========================================================

  else if (
    activeTab ===
    "journeyPreferences"
  ) {
    screen = (
      <JourneyPreferencesScreen
        language={language}

        goToSummary={() =>
          setActiveTab(
            "personalizationSummary"
          )
        }

        goBack={() =>
          setActiveTab(
            "home"
          )
        }
      />
    );
  }

  // ==========================================================
  // PERSONALIZATION SUMMARY
  // ==========================================================

  else if (
    activeTab ===
    "personalizationSummary"
  ) {
    screen = (
      <PersonalizationSummaryScreen
        language={language}

        startLegacy={() =>
          setActiveTab(
            "journeys"
          )
        }

        editPreferences={() =>
          setActiveTab(
            "journeyPreferences"
          )
        }
      />
    );
  }

  // ==========================================================
  // REWARDS
  // ==========================================================

  else if (
    activeTab ===
    "rewards"
  ) {
    screen = (
      <RewardsScreen
        language={language}

        wCoinBalance={
          wCoinBalance
        }

        addWCoins={
          addWCoins
        }
      />
    );
  }

  // ==========================================================
  // AVATAR CENTER
  // ==========================================================

  else if (
    activeTab ===
    "avatarCenter"
  ) {
    screen = (
      <AvatarCenterScreen
        language={language}

        goBack={
          goHome
        }
      />
    );
  }

  // ==========================================================
  // MORE
  // ==========================================================

  else if (
    activeTab ===
    "more"
  ) {
    screen = (
      <MoreScreen
        language={language}

        goToProfile={() =>
          setActiveTab(
            "profile"
          )
        }

        goToSubscription={() =>
          setActiveTab(
            "subscription"
          )
        }

        goToPassport={() =>
          setActiveTab(
            "passport"
          )
        }

        goToCertificate={() =>
          setActiveTab(
            "certificate"
          )
        }

        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }

        goToAICoach={() =>
          setActiveTab(
            "aiCoach"
          )
        }

        goToGPSJourneyMap={() =>
          setActiveTab(
            "journeyMap"
          )
        }

        goToJourneyStory={() =>
          setActiveTab(
            "journeyStory"
          )
        }

        goToLegathons={() =>
          setActiveTab(
            "legathons"
          )
        }

        goToCommunity={() =>
          setActiveTab(
            "community"
          )
        }

        goToLeaderboard={() =>
          setActiveTab(
            "leaderboard"
          )
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
          setActiveTab(
            "physicalMerch"
          )
        }

        goToMarketplace={() =>
          setActiveTab(
            "physicalMerch"
          )
        }

        goToInventory={() =>
          setActiveTab(
            "physicalMerch"
          )
        }

        goToWCoinWallet={() =>
          setActiveTab(
            "wCoinWallet"
          )
        }

        goToAvatarProfile={() =>
          setActiveTab(
            "avatarCenter"
          )
        }

        goToBreathing={() =>
          setActiveTab(
            "breathing"
          )
        }

        goToBreathingAnalytics={() =>
          setActiveTab(
            "breathingAnalytics"
          )
        }

        selectedJourney={
          selectedJourney ||
          "selma"
        }

        goToLanguage={() =>
          setActiveTab(
            "language"
          )
        }

        goToSettings={() =>
          setActiveTab(
            "settings"
          )
        }

        goToPrivacyPolicy={() =>
          setActiveTab(
            "privacyPolicy"
          )
        }

        goToAbout={() =>
          setActiveTab(
            "about"
          )
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
    );
  }

  // ==========================================================
  // PASSPORT
  // ==========================================================

  else if (
    activeTab ===
    "passport"
  ) {
    screen = (
      <PassportScreen
        language={language}

        goBack={
          goMore
        }

        goToCertificate={() =>
          setActiveTab(
            "certificate"
          )
        }
      />
    );
  }

  // ==========================================================
  // PASSPORT DETAIL
  // ==========================================================

  else if (
    activeTab ===
    "passportDetail"
  ) {
    screen = (
      <PassportDetailScreen
        language={language}

        passportId={
          selectedPassport
        }

        goBack={() =>
          setActiveTab(
            "profile"
          )
        }

        goCertificate={() =>
          setActiveTab(
            "certificate"
          )
        }
      />
    );
  }

  // ==========================================================
  // CERTIFICATE
  // ==========================================================

  else if (
    activeTab ===
    "certificate"
  ) {
    screen = (
      <CertificateScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // PROFILE
  // ==========================================================

  else if (
    activeTab ===
    "profile"
  ) {
    screen = (
      <ProfileScreen
        language={language}

        goBack={
          goMore
        }

        openPassport={(
          passportId
        ) => {
          setSelectedPassport(
            passportId
          );

          setActiveTab(
            "passportDetail"
          );
        }}
      />
    );
  }

  // ==========================================================
  // WCOIN WALLET
  // ==========================================================

  else if (
    activeTab ===
    "wCoinWallet"
  ) {
    screen = (
      <WCoinWalletScreen
        language={language}

        wCoinBalance={
          wCoinBalance
        }

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // SUBSCRIPTIONS
  // ==========================================================

  else if (
    activeTab ===
    "subscription"
  ) {
    screen = (
      <SubscriptionScreen
        language={language}

        subscriptionPlan={
          subscriptionPlan
        }

        setSubscriptionPlan={
          setSubscriptionPlan
        }

        goBack={
          goMore
        }

        goToPaywall={(
          plan
        ) => {
          setSelectedPlan(
            plan
          );

          setActiveTab(
            "subscriptionCheckout"
          );
        }}

        onRestorePurchases={
          handleRestorePurchases
        }

        goToPrivacyPolicy={() =>
          setActiveTab(
            "privacyPolicy"
          )
        }
      />
    );
  }

  // ==========================================================
  // HALL OF LEGENDS
  // ==========================================================

  else if (
    activeTab ===
    "hallOfLegends"
  ) {
    screen = (
      <HallOfLegendsScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // WALKING ANALYTICS
  // ==========================================================

  else if (
    activeTab ===
    "walkingAnalytics"
  ) {
    screen = (
      <WalkingAnalyticsScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // WALKING FUNCTION
  // ==========================================================

  else if (
    activeTab ===
    "walkingFunction"
  ) {
    screen = (
      <WalkingFunctionScreen
        language={language}

        todaySteps={
          walkingData.steps
        }

        liveSteps={
          walkingData.steps
        }

        liveMiles={
          walkingData.miles
        }

        walkingSeconds={
          walkingData
            .walkingSeconds
        }

        walkingMinutes={
          walkingData
            .walkingMinutes
        }

        paceMinutesPerMile={
          walkingData
            .paceMinutesPerMile
        }

        speedMph={
          walkingData
            .speedMph
        }

        cadence={
          walkingData
            .cadence
        }

        pedometerAvailable={
          walkingData
            .isAvailable
        }

        goBack={
          goMore
        }

        goHome={() =>
          setActiveTab(
            "home"
          )
        }

        goJourneys={() =>
          setActiveTab(
            "journeys"
          )
        }

        goRewards={() =>
          setActiveTab(
            "rewards"
          )
        }

        goMore={() =>
          setActiveTab(
            "more"
          )
        }
      />
    );
  }

  // ==========================================================
  // AI WELLNESS
  // ==========================================================

  else if (
    activeTab ===
    "aiCoach"
  ) {
    screen = (
      <AIWellnessMasterScreen
        language={language}

        goToGPSJourneyMap={(
          params
        ) => {
          const journey =
            params?.journey ||
            params ||
            null;

          if (
            journey
          ) {
            setSelectedJourney(
              journey
            );
          }

          setActiveTab(
            "journeyMap"
          );
        }}

        goToJourneys={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToBreathing={() =>
          setActiveTab(
            "breathing"
          )
        }

        goToHydration={() =>
          setActiveTab(
            "hydration"
          )
        }

        goToRecovery={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToSleep={() =>
          setActiveTab(
            "sleep"
          )
        }

        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }

        goToMealPlanner={() =>
          setActiveTab(
            "mealPlanner"
          )
        }

        goToAIConversation={() =>
          setActiveTab(
            "aiConversation"
          )
        }
      />
    );
  }

  // ==========================================================
  // COMMUNITY
  // ==========================================================

  else if (
    activeTab ===
    "community"
  ) {
    screen = (
      <CommunityScreen
        language={language}

        goBack={
          goMore
        }

        goToAICoach={() =>
          setActiveTab(
            "aiConversation"
          )
        }

        goToComments={(
          post
        ) => {
          setSelectedCommunityPost(
            post
          );

          setActiveTab(
            "communityComments"
          );
        }}
      />
    );
  }

  // ==========================================================
  // COMMUNITY COMMENTS
  // ==========================================================

  else if (
    activeTab ===
    "communityComments"
  ) {
    screen = (
      <CommunityCommentsScreen
        language={language}

        post={
          selectedCommunityPost
        }

        goBack={() =>
          setActiveTab(
            "community"
          )
        }
      />
    );
  }

  // ==========================================================
  // LEADERBOARD
  // ==========================================================

  else if (
    activeTab ===
    "leaderboard"
  ) {
    screen = (
      <LeaderboardScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // DAILY CHALLENGE
  // ==========================================================

  else if (
    activeTab ===
    "dailyChallenge"
  ) {
    screen = (
      <DailyChallengeScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // BREATHING
  // ==========================================================

  else if (
    activeTab ===
    "breathing"
  ) {
    screen = (
      <BreathingScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "recovery"
          )
        }
      />
    );
  }

  // ==========================================================
  // BREATHING ANALYTICS
  // ==========================================================

  else if (
    activeTab ===
    "breathingAnalytics"
  ) {
    screen = (
      <BreathingAnalyticsScreen
        language={language}

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // HYDRATION
  // ==========================================================

  else if (
    activeTab ===
    "hydration"
  ) {
    screen = (
      <HydrationCoachScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToRecovery={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToAIWellness={() =>
          setActiveTab(
            "aiCoach"
          )
        }
      />
    );
  }

  // ==========================================================
  // SLEEP
  // ==========================================================

  else if (
    activeTab ===
    "sleep"
  ) {
    screen = (
      <SleepCoachScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToRecovery={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToBreathing={() =>
          setActiveTab(
            "breathing"
          )
        }

        goToAIWellness={() =>
          setActiveTab(
            "aiCoach"
          )
        }
      />
    );
  }

  // ==========================================================
  // RECOVERY
  // ==========================================================

  else if (
    activeTab ===
    "recovery"
  ) {
    screen = (
      <RecoveryCoachScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "aiConversation"
          )
        }

        goToBreathing={() =>
          setActiveTab(
            "breathing"
          )
        }

        goToHydration={() =>
          setActiveTab(
            "hydration"
          )
        }

        goToSleep={() =>
          setActiveTab(
            "sleep"
          )
        }

        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }
      />
    );
  }

  // ==========================================================
  // AI CONVERSATION
  // ==========================================================

  else if (
    activeTab ===
    "aiConversation"
  ) {
    screen = (
      <AIConversationScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "aiCoach"
          )
        }

        goToGPSJourneyMap={() =>
          setActiveTab(
            "journeyMap"
          )
        }

        goToJourneys={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToMealPlanner={() =>
          setActiveTab(
            "mealPlanner"
          )
        }

        goToHydration={() =>
          setActiveTab(
            "hydration"
          )
        }

        goToRecovery={() =>
          setActiveTab(
            "recovery"
          )
        }

        goToSleep={() =>
          setActiveTab(
            "sleep"
          )
        }

        goToBreathing={() =>
          setActiveTab(
            "breathing"
          )
        }

        wellness={{
          steps:
            Number(
              walkingData
                ?.steps ||
              0
            ),

          stepGoal:
            7000,

          hydration:
            0,

          hydrationGoal:
            100,

          recovery:
            null,

          sleepHours:
            null,

          journey:
            selectedJourney
              ?.title ||
            "",

          journeyProgress:
            selectedJourney
              ?.progress ||

            selectedJourney
              ?.journeyProgress ||

            0,

          checkpoint:
            selectedJourney
              ?.currentCheckpoint ||
            "",
        }}
      />
    );
  }

  // ==========================================================
  // PHYSICAL MERCH STORE
  // ==========================================================

  else if (
    activeTab ===
    "physicalMerch"
  ) {
    screen = (
      <PhysicalMerchStoreScreen
        language={language}

        goBack={() =>
          setActiveTab(
            "wCoinWallet"
          )
        }

        openItem={
          openStoreItemDetail
        }

        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }

        wCoinBalance={
          wCoinBalance
        }

        lifetimeSteps={
          lifetimeSteps
        }
      />
    );
  }

  // ==========================================================
  // STORE ITEM DETAIL
  // ==========================================================

  else if (
    activeTab ===
    "storeItemDetail"
  ) {
    screen = (
      <StoreItemDetailScreen
        language={language}

        item={
          selectedStoreItem
        }

        goBack={() =>
          setActiveTab(
            "physicalMerch"
          )
        }

        goToPurchaseConfirmation={
          goToPurchaseConfirmation
        }
      />
    );
  }

  // ==========================================================
  // PURCHASE CONFIRMATION / STRIPE
  // ==========================================================

  else if (
    activeTab ===
    "purchaseConfirmation"
  ) {
    screen = (
      <PurchaseConfirmationScreen
        language={language}

        item={
          selectedStoreItem
        }

        userPlan={
          subscriptionPlan
        }

        wCoinBalance={
          wCoinBalance
        }

        refreshWCoinBalance={
          refreshSecureWCoinBalance
        }

        goBack={() =>
          setActiveTab(
            "physicalMerch"
          )
        }

        goHome={() =>
          setActiveTab(
            "home"
          )
        }

        goToInventory={() =>
          setActiveTab(
            "physicalMerch"
          )
        }
      />
    );
  }

  // ==========================================================
  // JOURNEY STORY
  // ==========================================================

  else if (
    activeTab ===
    "journeyStory"
  ) {
    screen = (
      <JourneyStoryScreen
        language={language}

        route={{
          params: {
            journey:
              typeof selectedJourney ===
                "object" &&
              selectedJourney

                ? selectedJourney

                : typeof lastJourney ===
                    "object" &&
                  lastJourney

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

        lifetimeSteps={
          totalSteps
        }

        subscriptionPlan={
          subscriptionPlan
        }

        goBack={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToProgress={(
          journey
        ) => {
          const journeyToContinue =
            journey &&
            typeof journey ===
              "object"

              ? journey

              : typeof selectedJourney ===
                  "object" &&
                selectedJourney

                ? selectedJourney

                : typeof lastJourney ===
                    "object" &&
                  lastJourney

                  ? lastJourney

                  : null;

          if (
            journeyToContinue
          ) {
            setSelectedJourney(
              journeyToContinue
            );

            setLastJourney(
              journeyToContinue
            );
          }

          setActiveTab(
            "journeyMap"
          );
        }}
      />
    );
  }

  // ==========================================================
  // AVATAR PROFILE
  // ==========================================================

  else if (
    activeTab ===
    "avatarProfile"
  ) {
    screen = (
      <AvatarProfileScreen
        language={language}

        currentAvatar={
          equippedAvatar
        }

        equippedAvatar={
          equippedAvatar
        }

        goBack={
          goHome
        }

        goToAvatarCenter={() =>
          setActiveTab(
            "avatarCenter"
          )
        }

        changeAvatar={() =>
          setActiveTab(
            "avatarCenter"
          )
        }
      />
    );
  }

  // ==========================================================
  // WORLD PASSPORT
  // ==========================================================

  else if (
    activeTab ===
    "worldPassport"
  ) {
    screen = (
      <PassportScreen
        language={language}

        selectedPassport={
          selectedPassport
        }

        goBack={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToCertificate={() =>
          setActiveTab(
            "certificate"
          )
        }
      />
    );
  }

  // ==========================================================
  // LEGATHONS
  // ==========================================================

  else if (
    activeTab ===
    "legathons"
  ) {
    screen = (
      <MarathonScreen
        language={language}

        goBack={
          goMore
        }

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
    );
  }

  // ==========================================================
  // WORLD MARATHON DETAIL
  // ==========================================================

  else if (
    activeTab ===
    "worldMarathonDetail"
  ) {
    screen = (
      <WorldMarathonDetailScreen
        language={language}

        marathonId={
          selectedMarathonId
        }

        goBack={() =>
          setActiveTab(
            "legathons"
          )
        }

        goToCertificate={(
          params
        ) => {
          setSelectedMarathonId(
            params
              ?.marathonId ||
            selectedMarathonId
          );

          setActiveTab(
            "certificate"
          );
        }}

        goToPassport={(
          params
        ) => {
          setSelectedMarathonId(
            params
              ?.marathonId ||
            selectedMarathonId
          );

          setActiveTab(
            "worldPassport"
          );
        }}
      />
    );
  }

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  else if (
    activeTab ===
    "language"
  ) {
    screen = (
      <LanguageSelectionScreen
        language={
          language
        }

        setLanguage={
          setLanguage
        }

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // SETTINGS
  // ==========================================================

  else if (
    activeTab ===
    "settings"
  ) {
    screen = (
      <SettingsScreen
        language={
          language
        }

        goBack={
          goMore
        }

        goToLanguage={() =>
          setActiveTab(
            "language"
          )
        }

        goToPrivacy={() =>
          setActiveTab(
            "privacyPolicy"
          )
        }

        goToAbout={() =>
          setActiveTab(
            "about"
          )
        }
      />
    );
  }

  // ==========================================================
  // PRIVACY
  // ==========================================================

  else if (
    activeTab ===
    "privacyPolicy"
  ) {
    screen = (
      <PrivacyPolicyScreen
        language={
          language
        }

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // ABOUT
  // ==========================================================

  else if (
    activeTab ===
    "about"
  ) {
    screen = (
      <AboutScreen
        language={
          language
        }

        goBack={
          goMore
        }
      />
    );
  }

  // ==========================================================
  // FALLBACK HOME
  // ==========================================================

  else {
    screen = (
      <WalkingDashboardScreen
        language={
          language
        }

        currentAvatar={
          equippedAvatar
        }

        activeJourney={
          selectedJourney
        }

        goToJourneys={() =>
          setActiveTab(
            "journeys"
          )
        }

        goToGPSJourneyMap={() =>
          setActiveTab(
            "journeyMap"
          )
        }

        goToPassport={() =>
          setActiveTab(
            "passport"
          )
        }

        goToAvatarProfile={() =>
          setActiveTab(
            "avatarProfile"
          )
        }

        goToRewards={() =>
          setActiveTab(
            "rewards"
          )
        }

        goToWalkingAnalytics={() =>
          setActiveTab(
            "walkingAnalytics"
          )
        }

        goToLegathons={() =>
          setActiveTab(
            "legathons"
          )
        }
      />
    );
  }

  // ==========================================================
  // MAIN APP LAYOUT
  // ==========================================================

  const appLayout = (
    <View
      style={
        styles.app
      }
    >
      <View
        style={
          styles.screen
        }
      >
        {screen}
      </View>

      <View
        style={
          styles.bottomNav
        }
      >
        <NavButton
          icon={require(
            "./assets/legathon/icons/legacyhome.png"
          )}

          label={translate(
            language,
            "home"
          )}

          active={
            activeTab ===
            "home"
          }

          onPress={() =>
            setActiveTab(
              "home"
            )
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/passporthome.png"
          )}

          label={translate(
            language,
            "journeys"
          )}

          active={
            activeTab ===
            "journeys"
          }

          onPress={() =>
            setActiveTab(
              "journeys"
            )
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

          active={
            activeTab ===
            "rewards"
          }

          onPress={() =>
            setActiveTab(
              "rewards"
            )
          }
        />

        <NavButton
          icon={require(
            "./assets/legathon/icons/morehome.png"
          )}

          label={translate(
            language,
            "more"
          )}

          active={
            activeTab ===
            "more"
          }

          onPress={() =>
            setActiveTab(
              "more"
            )
          }
        />
      </View>
    </View>
  );

  // ==========================================================
  // STRIPE PROVIDER
  // ==========================================================

  if (
    !STRIPE_PUBLISHABLE_KEY
  ) {
    if (
      __DEV__
    ) {
      console.warn(
        "Stripe publishable key is missing. Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file."
      );
    }

    return appLayout;
  }

  return (
    <StripeProvider
      publishableKey={
        STRIPE_PUBLISHABLE_KEY
      }
    >
      {appLayout}
    </StripeProvider>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor:
        "#020611",
    },

    screen: {
      flex: 1,
      backgroundColor:
        "#020611",
      paddingBottom: 98,
    },

    bottomNav: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      height: 98,

      backgroundColor:
        "#03142D",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-around",

      paddingTop: 10,
      paddingBottom: 24,

      borderTopWidth: 1,

      borderTopColor:
        "rgba(255, 215, 90, 0.55)",

      shadowColor:
        "#FFD75A",

      shadowOffset: {
        width: 0,
        height: -4,
      },

      shadowOpacity:
        0.35,

      shadowRadius:
        14,

      elevation:
        999,

      zIndex:
        999,
    },

    navButton: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingVertical:
        6,

      marginHorizontal:
        2,

      borderRadius:
        18,
    },

    navIconImage: {
      width: 42,
      height: 42,

      resizeMode:
        "contain",

      marginBottom:
        3,
    },

    activeNavIcon: {
      transform: [
        {
          scale:
            1.16,
        },
      ],
    },

    navText: {
      color:
        "#A8B6D4",

      fontSize:
        10,

      fontWeight:
        "800",
    },

    activeNavText: {
      color:
        "#FFD75A",

      textShadowColor:
        "#FFD75A",

      textShadowOffset: {
        width: 0,
        height: 0,
      },

      textShadowRadius:
        8,
    },
  });