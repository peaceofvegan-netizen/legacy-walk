import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";

import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import journeyMaps from "../data/journeyMaps";

import {
  ROUTE_IMAGES,
  getRouteImage,
} from "../data/routeImages";

import JOURNEY_REWARDS, {
  completeJourneyReward,
} from "../utils/journeyRewards";

import {
  addWCoins,
  getWCoins,
} from "../utils/wcoinStorage";

const SHOE_ICON = require("../assets/apparel/w-shoe.png");

function getDistanceMiles(a, b) {
  const R = 3958.8;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function GPSJourneyMapScreen({
  route,
  journey,
  selectedJourney,
  activeJourney,
  goBack,
  goToDetail,
  goToStory,
  goToCertificate,
  goToWallet,
  awardJourneyRewards,
}) {
  const [savedJourney, setSavedJourney] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [steps, setSteps] = React.useState(0);
  const [secondsActive, setSecondsActive] = React.useState(0);
  const [isTracking, setIsTracking] = React.useState(true);
  const [hasCompleted, setHasCompleted] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState(null);
  const [lastRewardedCheckpoint, setLastRewardedCheckpoint] = React.useState(1);
  const [sessionId] = React.useState(`${Date.now()}`);
  const [passportStamps, setPassportStamps] = React.useState([]);
  const lastStepEventRef = React.useRef(0);
  const [ shownStoryCheckpoints,setShownStoryCheckpoints,] = React.useState([]);
  const shareWalkProgress = async () => {
  await Share.share({
    message: `I’m walking ${journey?.title || "a Legacy Walk journey"} on Legacy Walk.

Steps: ${steps?.toLocaleString() || 0}
Distance: ${distanceMiles || "0.0"} miles
Checkpoints completed: ${completedCheckpoints?.length || 0}/5

Join me on Legacy Walk.`,
  });
};
  const rawJourney =
  journey ||
  selectedJourney ||
  activeJourney ||
  route?.params?.journey ||
  route?.params?.selectedJourney ||
  null;


 const currentJourney =
  rawJourney && typeof rawJourney === "object"
    ? rawJourney
    : rawJourney
      ? {
          id: String(rawJourney),
          title: String(rawJourney),
        }
      : null;

const journeyId =
  currentJourney?.id ||
  currentJourney?.journeyId ||
  currentJourney?.routeKey ||
  currentJourney?.slug ||
  route?.params?.journeyId ||
  route?.params?.id ||
  "";

const normalizedJourneyId = String(journeyId)
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, "-")
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-");

const journeyReward =
  JOURNEY_REWARDS[normalizedJourneyId] || null;

console.log("GPS CURRENT JOURNEY:", currentJourney);
console.log("GPS JOURNEY ID:", normalizedJourneyId);
console.log("GPS JOURNEY REWARD:", journeyReward);

  const routeTitle = currentJourney?.title || "Legacy Journey";
  const storyTriggerStorageKey = React.useMemo(() => {
  const journeyId =
    currentJourney?.id ||
    currentJourney?.journeyId ||
    currentJourney?.slug ||
    "default";

  return `shownJourneyStories:${journeyId}`;
}, [
  currentJourney?.id,
  currentJourney?.journeyId,
  currentJourney?.slug,
]);



React.useEffect(() => {
  let mounted = true;

  async function loadStories() {
    try {
      const saved = await AsyncStorage.getItem(
        storyTriggerStorageKey
      );

      if (mounted) {
        setShownStoryCheckpoints(
          saved ? JSON.parse(saved) : []
        );
      }
    } catch {
      if (mounted) {
        setShownStoryCheckpoints([]);
      }
    }
  }

  loadStories();

  return () => {
    mounted = false;
  };
}, [storyTriggerStorageKey]);
 const [startingSteps, setStartingSteps] = React.useState(0);
  const totalSteps =
  Number(
    currentJourney?.totalSteps ||
    currentJourney?.requiredSteps ||
    currentJourney?.stepGoal ||
    currentJourney?.targetSteps
  ) || 125000;
  const routeKey =
    currentJourney?.routeKey ||
    currentJourney?.id ||
    currentJourney?.title?.toLowerCase().replaceAll(" ", "") ||
    null;

  const routeImage =
    getRouteImage?.(routeKey) ||
    ROUTE_IMAGES?.[routeKey] ||
    currentJourney?.routeImage ||
    currentJourney?.image ||
    ROUTE_IMAGES?.selma;

  const routeDescription =
    currentJourney?.gpsText ||
    currentJourney?.description ||
    "Walk anywhere. Every step powers your progress, unlocks new milestones, earns rewards, and moves you closer to completing your Legathon Journey.";

  const liveMiles = Number((steps / 2200).toFixed(2));
  const liveCalories = Math.round(steps * 0.04);
const progress = Math.min(
  Number(((steps / totalSteps) * 100).toFixed(2)),
  100
);

  const remainingSteps = Math.max(totalSteps - steps, 0);

  const timeActive = `${String(Math.floor(secondsActive / 3600)).padStart(
    2,
    "0"
  )}:${String(Math.floor((secondsActive % 3600) / 60)).padStart(
    2,
    "0"
  )}:${String(secondsActive % 60).padStart(2, "0")}`;

  const journeyData =
    journeyMaps?.[currentJourney?.id] ||
    journeyMaps?.[currentJourney?.title] ||
    journeyMaps?.[currentJourney?.name] ||
    {};

    const defaultCheckpointNames = [
  "Start",
  "Checkpoint 2",
  "Checkpoint 3",
  "Checkpoint 4",
  "Finish",
];

const rawCheckpoints =
  journeyData?.checkpoints ??
  currentJourney?.checkpoints ??
  currentJourney?.checkpointNames;

const checkpointNames = Array.isArray(rawCheckpoints)
  ? rawCheckpoints.slice(0, 5).map((checkpoint, index) => {
      if (typeof checkpoint === "string") {
        return checkpoint;
      }

      return (
        checkpoint?.title ||
        checkpoint?.name ||
        checkpoint?.label ||
        defaultCheckpointNames[index]
      );
    })
  : defaultCheckpointNames;

while (checkpointNames.length < 5) {
  checkpointNames.push(
    defaultCheckpointNames[checkpointNames.length]
  );
}

const checkpointCount = 5;

const completedCheckpoints =
  progress >= 100
    ? checkpointCount
    : Math.floor((progress / 100) * checkpointCount);

const currentCheckpoint =
  progress >= 100
    ? checkpointCount
    : Math.min(completedCheckpoints + 1, checkpointCount);

const checkpoints = checkpointNames.map((title, index) => {
  const checkpointNumber = index + 1;

  return {
    id: checkpointNumber,
    title,
    complete: checkpointNumber <= completedCheckpoints,
    active:
      progress < 100 &&
      checkpointNumber === currentCheckpoint,
  };
});
  const markerPositions = checkpoints.map((_, index) => {
    if (checkpoints.length === 1) return "50%";
    return `${(index / (checkpoints.length - 1)) * 88 + 5}%`;
  });

  const shoeLeft = `${Math.max(
  5,
  Math.min((steps / totalSteps) * 88 + 5, 93)
)}%`;

React.useEffect(() => {
  loadPassportStamps();
}, []);

async function loadPassportStamps() {
  try {
    const saved = await AsyncStorage.getItem("passportStamps");

    if (saved) {
      setPassportStamps(JSON.parse(saved));
    }
  } catch (error) {
    console.log("Passport load error:", error);
  }
}

  React.useEffect(() => {
    async function saveJourneyProgress(journey, progress) {
  if (!journey?.id) return;

  const saved = await AsyncStorage.getItem("journeyProgressData");
  const existing = saved ? JSON.parse(saved) : [];

  const updatedJourney = {
    id: journey.id,
    title: journey.title || "Legathon Journey",
    progress: Math.min(Math.round(Number(progress || 0)), 100),
  };

  const updated = existing.some(item => item.id === journey.id)
    ? existing.map(item =>
        item.id === journey.id ? updatedJourney : item
      )
    : [...existing, updatedJourney];

  await AsyncStorage.setItem(
    "journeyProgressData",
    JSON.stringify(updated)
  );
}
    saveJourneyProgress(journey, progress);
  }, [journey?.id, progress]);
const openCheckpointStory = React.useCallback(
  async (checkpointNumber) => {
    const checkpoint = Number(checkpointNumber);

    if (
      !checkpoint ||
      checkpoint < 1 ||
      checkpoint > 5 ||
      shownStoryCheckpoints.includes(checkpoint)
    ) {
      return;
    }

    const updatedCheckpoints = [
      ...shownStoryCheckpoints,
      checkpoint,
    ];

    setShownStoryCheckpoints(updatedCheckpoints);
    setIsTracking(false);

    try {
      await AsyncStorage.setItem(
        storyTriggerStorageKey,
        JSON.stringify(updatedCheckpoints)
      );
    } catch (error) {
      console.log(
        "Save shown journey story error:",
        error
      );
    }

    if (typeof goToStory === "function") {
      goToStory(checkpoint);
    }
  },
  [
    goToStory,
    shownStoryCheckpoints,
    storyTriggerStorageKey,
  ]
);

React.useEffect(() => {
  if (!currentJourney?.id) {
    return;
  }

  let checkpointToOpen = null;

  if (progress >= 100) {
    checkpointToOpen = 5;
  } else if (progress >= 80) {
    checkpointToOpen = 4;
  } else if (progress >= 60) {
    checkpointToOpen = 3;
  } else if (progress >= 40) {
    checkpointToOpen = 2;
  } else if (progress >= 20) {
    checkpointToOpen = 1;
  }

  if (
    checkpointToOpen &&
    !shownStoryCheckpoints.includes(checkpointToOpen)
  ) {
    openCheckpointStory(checkpointToOpen);
  }
}, [
  progress,
  currentJourney?.id,
  shownStoryCheckpoints,
  openCheckpointStory,
]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isTracking) {
        setSecondsActive((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking]);

  React.useEffect(() => {
    async function loadStats() {
      if (!currentJourney?.id) return;

      const saved = await AsyncStorage.getItem(
        `journeyStats_${currentJourney.id}`
      );

      if (saved) {
        const data = JSON.parse(saved);
        setSteps(data.steps || 0);
        setSecondsActive(data.secondsActive || 0);
        setLastSavedAt(new Date());
   

      }


      const rewarded = await AsyncStorage.getItem(
        `lastRewardedCheckpoint_${currentJourney.id}`
      );

      if (rewarded) {
        setLastRewardedCheckpoint(Number(rewarded));
      }
    }

    loadStats();


}, [currentJourney?.id]);

// ADD THIS FUNCTION HERE
async function saveJourneyProgress(journey, progress) {
  const saved = await AsyncStorage.getItem("journeyProgressData");
  const existing = saved ? JSON.parse(saved) : [];

  const updatedJourney = {
    id: journey.id,
    title: journey.title,
    progress: Math.min(Math.round(progress), 100),
  };

  const updated = existing.some(item => item.id === journey.id)
    ? existing.map(item =>
        item.id === journey.id ? updatedJourney : item
      )
    : [...existing, updatedJourney];

  await AsyncStorage.setItem(
    "journeyProgressData",
    JSON.stringify(updated)
  );
}
async function saveWeeklyStepData(stepCount) {
  const today = new Date().getDay(); // 0=Sun, 1=Mon

  const saved = await AsyncStorage.getItem("weeklyStepData");

  let week = saved
    ? JSON.parse(saved)
    : [
        { day: "M", steps: 0 },
        { day: "T", steps: 0 },
        { day: "W", steps: 0 },
        { day: "T", steps: 0 },
        { day: "F", steps: 0 },
        { day: "S", steps: 0 },
        { day: "S", steps: 0 },
      ];

  const index = today === 0 ? 6 : today - 1;

  week[index].steps = stepCount;

  await AsyncStorage.setItem(
    "weeklyStepData",
    JSON.stringify(week)
  );
}

  React.useEffect(() => {
    async function saveStats() {
      if (!currentJourney?.id) return;

      await AsyncStorage.setItem(
        `journeyStats_${currentJourney.id}`,
        JSON.stringify({
          steps,
          secondsActive,
        })
      );

     const updatedActiveJourney = {
  ...currentJourney,
  sessionId,
  steps,
  secondsActive,
  progress,
  journeyProgress: progress,
  progressPercent: progress,
  currentCheckpoint,
  completed: progress >= 100,
  lastUpdated: new Date().toISOString(),
};

await AsyncStorage.setItem(
  `activeJourney_${currentJourney.id}`,
  JSON.stringify(updatedActiveJourney)
);

await AsyncStorage.setItem(
  "activeJourney",
  JSON.stringify(updatedActiveJourney)
);

      setLastSavedAt(new Date());
      await saveJourneyProgress(currentJourney, progress);
      await saveWeeklyStepData(steps);
    }

    saveStats();
  }, [
    steps,
    secondsActive,
    progress,
    currentCheckpoint,
    currentJourney?.id,
    sessionId,
  ]);

 
React.useEffect(() => {
  let mounted = true;
  let interval;

  async function startPedometer() {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        "Step Tracking Unavailable",
        "This device does not support step tracking."
      );
      return;
    }

    const baseline = await Pedometer.getStepCountAsync(
      startOfDay,
      new Date()
    );

    const baselineSteps = baseline.steps || 0;

    console.log("BASELINE STEPS", baselineSteps);

    interval = setInterval(async () => {
      const endTime = new Date();

      const current = await Pedometer.getStepCountAsync(
        startOfDay,
        endTime
      );

      const sessionSteps = Math.max(
        (current.steps || 0) - baselineSteps,
        0
      );

      console.log("SESSION STEPS", sessionSteps);

      if (mounted) {
        setSteps((prevSavedSteps) => {
          const newSteps = Math.max(
            prevSavedSteps,
            sessionSteps
          );

          AsyncStorage.getItem("lifetimeSteps").then((saved) => {
            const oldLifetime = Number(saved || 0);
            const safeLifetime = Math.max(
              oldLifetime,
              newSteps
            );

            AsyncStorage.setItem(
              "lifetimeSteps",
              String(safeLifetime)
            );
          });

          return newSteps;
        });
      }
    }, 3000);
  
    }

  startPedometer();

  return () => {
    mounted = false;

    if (interval) {
      clearInterval(interval);
    }
  };
}, [isTracking]);
     
        
 React.useEffect(() => {
  let cancelled = false;

  async function rewardCheckpoint() {
    if (!currentJourney?.id) return;

    const checkpointNumber = Number(currentCheckpoint || 0);
    const lastRewarded = Number(lastRewardedCheckpoint || 0);

    if (checkpointNumber <= 1) return;
    if (checkpointNumber <= lastRewarded) return;

    const checkpointKey =
      `checkpointReward_${currentJourney.id}_${checkpointNumber}`;

    try {
      const alreadyRewarded =
        await AsyncStorage.getItem(checkpointKey);

      if (alreadyRewarded === "true") {
        if (!cancelled) {
          setLastRewardedCheckpoint(checkpointNumber);
        }
        return;
      }

      const checkpointReward = 50;

      await AsyncStorage.multiSet([
        [
          checkpointKey,
          "true",
        ],
        [
          `lastRewardedCheckpoint_${currentJourney.id}`,
          String(checkpointNumber),
        ],
      ]);

      if (cancelled) return;

      setLastRewardedCheckpoint(checkpointNumber);

      Alert.alert(
        "Checkpoint Reached!",
        `You reached checkpoint ${checkpointNumber} and earned ${checkpointReward} points.`
      );
    } catch (error) {
      console.warn(
        "Checkpoint reward error:",
        error
      );
    }
  }

  rewardCheckpoint();

  return () => {
    cancelled = true;
  };
}, [
  currentCheckpoint,
  currentJourney?.id,
  lastRewardedCheckpoint,
]);

async function completeJourney() {
  if (!currentJourney?.id) {
    Alert.alert(
      "Unable to Complete Journey",
      "No active journey was found."
    );
    return;
  }

  const journeyId = String(currentJourney.id);

  const currentProgress = Number(progress || 0);
  const requiredSteps = Number(totalSteps || 0);
  const currentSteps = Number(steps || 0);

  const calculatedProgress =
    requiredSteps > 0
      ? Math.min(
          100,
          Math.round((currentSteps / requiredSteps) * 100)
        )
      : currentProgress;

  const isActuallyComplete =
    currentProgress >= 100 ||
    calculatedProgress >= 100 ||
    (requiredSteps > 0 && currentSteps >= requiredSteps);

  if (!isActuallyComplete) {
    Alert.alert(
      "Journey Not Complete",
      `You must reach 100% before receiving this reward. Current progress: ${calculatedProgress.toFixed(
        2
      )}%.`
    );
    return;
  }

  const completedKey = `journeyCompleted_${journeyId}`;
  const rewardedKey = `journeyRewarded_${journeyId}`;

  try {
    /*
     * Check only this journey's saved keys.
     * Do not use hasCompleted here because that state may belong
     * to the previously completed journey.
     */
    const savedResults = await AsyncStorage.multiGet([
      completedKey,
      rewardedKey,
    ]);

    const completedSaved = savedResults?.[0]?.[1];
    const rewardedSaved = savedResults?.[1]?.[1];

    if (
      completedSaved === "true" ||
      rewardedSaved === "true"
    ) {
      Alert.alert(
        "Journey Already Completed",
        "This journey has already been completed and rewarded."
      );
      return;
    }

    /*
     * Award the WCoins first.
     * The journey is not marked completed unless this succeeds.
     */
    const rewardResult = await completeJourneyReward(journeyId);

    console.log(
      "JOURNEY REWARD RESULT:",
      rewardResult
    );

    if (!rewardResult?.awarded) {
      Alert.alert(
        "Reward Already Received",
        "This journey has already been rewarded."
      );
      return;
    }

    const completedJourney = {
      ...currentJourney,
      id: journeyId,
      progress: 100,
      completed: true,
      completedAt: new Date().toISOString(),
      steps: currentSteps,
      totalSteps: requiredSteps,
      routeImage: currentJourney.routeImage,
    };

await AsyncStorage.multiSet([
  [
    "activeJourney",
    JSON.stringify(completedJourney),
  ],
  [
    `journeyProgress_${journeyId}`,
    JSON.stringify(completedJourney),
  ],
  [completedKey, "true"],
  [rewardedKey, "true"],
]);

try {
  await awardPassportStamp(journeyId);
} catch (passportError) {
  console.warn(
    "Passport stamp error:",
    passportError
  );
}

/*
 * Update local state
 */
setHasCompleted(true);

/*
 * Read the updated wallet balance after the reward was deposited.
 */
const updatedWalletBalance = Number(
  rewardResult?.walletResult?.balance ??
  (await getWCoins())
);

/*
 * Notify App.js so the wallet and Rewards screen refresh.
 */
if (typeof onWCoinBalanceChanged === "function") {
  onWCoinBalanceChanged(updatedWalletBalance);
}

const earnedCoins = Number(
  rewardResult?.addedWCoins ??
  rewardResult?.walletResult?.added ??
  rewardResult?.reward?.wCoins ??
  0
);

Alert.alert(
  "Journey Complete!",
  `You earned ${earnedCoins.toLocaleString()} WCoins.`
);
} catch (error) {
  console.error(
    "COMPLETE JOURNEY FAILED:",
    error
  );

  console.error(
    "COMPLETE JOURNEY MESSAGE:",
    error?.message
  );

  Alert.alert(
    "Unable to Complete Journey",
    String(
      error?.message ??
      error ??
      "Unknown completion error"
    )
  );
}
}


  async function awardPassportStamp(journeyId) {
  if (!journeyId) return;

  try {
    const normalizedId = String(journeyId)
      .trim()
      .toLowerCase();

    const stampAliases = {
      roman: "rome",
      rome: "rome",
      greatwall: "wall",
      wall: "wall",
      tubman: "tubman",
      harriet: "tubman",
      mecca: "mecca",
      tokyo: "tokyo",
      trans: "trans",
    };

    const stampId =
      stampAliases[normalizedId] ||
      normalizedId;

    const saved =
      await AsyncStorage.getItem("passportStamps");

    let stamps = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          stamps = parsed;
        }
      } catch (parseError) {
        console.warn(
          "Passport stamp parse error:",
          parseError
        );
      }
    }

    if (!stamps.includes(stampId)) {
      const updatedStamps = [
        ...stamps,
        stampId,
      ];

      await AsyncStorage.setItem(
        "passportStamps",
        JSON.stringify(updatedStamps)
      );

      setPassportStamps?.(updatedStamps);
    }

    await AsyncStorage.setItem(
      `passport_${normalizedId}`,
      "true"
    );

    return {
      success: true,
      stampId,
    };
  } catch (error) {
    console.warn(
      "Passport stamp error:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

 async function resetJourney() {
  if (!currentJourney?.id) {
    return;
  }

  const journeyId = String(currentJourney.id);

  try {
    /*
     * Reset only this journey's progress.
     * Do not remove the completed or rewarded keys.
     * That prevents users from earning the same WCoins twice.
     */
    setSteps(0);
    setSecondsActive(0);
    setHasCompleted(false);
    setLastRewardedCheckpoint(1);

    const resetJourneyData = {
      ...currentJourney,
      progress: 0,
      completed: false,
      completedAt: null,
      steps: 0,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.multiRemove([
      `journeyStats_${journeyId}`,
      `activeJourney_${journeyId}`,
      `journeyProgress_${journeyId}`,
      `passport_${journeyId}`,
      `certificate_${journeyId}`,
      `lastRewardedCheckpoint_${journeyId}`,
    ]);

    await AsyncStorage.multiSet([
      [
        "activeJourney",
        JSON.stringify(resetJourneyData),
      ],
      [
        `journeyProgress_${journeyId}`,
        JSON.stringify(resetJourneyData),
      ],
    ]);

    Alert.alert(
      "Journey Reset",
      "Progress was reset. Previously claimed WCoins were kept."
    );
  } catch (error) {
    console.error(
      "RESET JOURNEY FAILED:",
      error
    );

    Alert.alert(
      "Unable to Reset Journey",
      String(
        error?.message ??
        error ??
        "Please try again."
      )
    );
  }
}
  
async function saveAndExit() {
  if (!currentJourney?.id) {
    if (typeof goBack === "function") {
      goBack();
    }

    return;
  }

  const journeyId = String(currentJourney.id);
  const currentSteps = Number(steps || 0);
  const requiredSteps = Number(totalSteps || 0);

  const savedProgress =
    requiredSteps > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (currentSteps / requiredSteps) * 100
            )
          )
        )
      : 0;

  try {
    const savedJourney = {
      ...currentJourney,
      id: journeyId,
      steps: currentSteps,
      totalSteps: requiredSteps,
      progress: hasCompleted ? 100 : savedProgress,
      completed: Boolean(hasCompleted),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.multiSet([
      [
        "activeJourney",
        JSON.stringify(savedJourney),
      ],
      [
        `activeJourney_${journeyId}`,
        JSON.stringify(savedJourney),
      ],
      [
        `journeyProgress_${journeyId}`,
        JSON.stringify(savedJourney),
      ],
      [
        "lastStartedJourney",
        JSON.stringify(savedJourney),
      ],
      [
        "resumeJourneyId",
        journeyId,
      ],
      [
        `lastRewardedCheckpoint_${journeyId}`,
        String(
          Number(lastRewardedCheckpoint || 1)
        ),
      ],
    ]);

    console.log(
      "JOURNEY SAVED:",
      savedJourney
    );

    if (typeof goBack === "function") {
      goBack();
    }
  } catch (error) {
    console.error(
      "SAVE AND EXIT FAILED:",
      error
    );

    Alert.alert(
      "Unable to Save Journey",
      String(
        error?.message ??
        error ??
        "Please try again."
      )
    );
  }
}
React.useEffect(() => {
  let mounted = true;

  async function loadJourneyCompletionState() {
    if (!currentJourney?.id) {
      if (mounted) {
        setHasCompleted(false);
        setLastRewardedCheckpoint(1);
      }

      return;
    }

    const activeJourneyId = String(currentJourney.id);

    try {
      const results = await AsyncStorage.multiGet([
        `journeyCompleted_${activeJourneyId}`,
        `journeyRewarded_${activeJourneyId}`,
        `lastRewardedCheckpoint_${activeJourneyId}`,
      ]);

      const completedValue = results?.[0]?.[1];
      const rewardedValue = results?.[1]?.[1];
      const checkpointValue = results?.[2]?.[1];

      if (!mounted) return;

      /*
       * These values now belong only to the current journey.
       * A previously completed journey cannot affect a new journey.
       */
      setHasCompleted(completedValue === "true");

      setLastRewardedCheckpoint(
        checkpointValue
          ? Math.max(1, Number(checkpointValue))
          : 1
      );

      console.log("JOURNEY COMPLETION STATE:", {
        journeyId: activeJourneyId,
        completed: completedValue === "true",
        rewarded: rewardedValue === "true",
        lastCheckpoint: checkpointValue,
      });
    } catch (error) {
      console.error(
        "LOAD JOURNEY COMPLETION STATE FAILED:",
        error
      );

      if (mounted) {
        setHasCompleted(false);
        setLastRewardedCheckpoint(1);
      }
    }
  }

  loadJourneyCompletionState();

  return () => {
    mounted = false;
  };
}, [currentJourney?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>LIVE GPS JOURNEY</Text>
        <Text style={styles.title}>{routeTitle}</Text>
        <Text style={styles.subtitle}>{routeDescription}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {isTracking ? "● Tracking Active" : "Paused"}
          </Text>
        </View>

        <Text style={styles.autoSaveText}>
          {lastSavedAt
            ? `Auto-saved ${lastSavedAt.toLocaleTimeString()}`
            : "Auto-save ready"}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatMini icon="👟" value={steps.toLocaleString()} label="Steps" />
        <StatMini icon="📍" value={liveMiles.toFixed(2)} label="Miles" />
        <StatMini icon="🔥" value={liveCalories} label="Calories" />
        <StatMini icon="⏱️" value={timeActive} label="Time" small />
      </View>
<View style={styles.progressCard}>
  <View style={styles.progressHeader}>
    <Text style={styles.progressTitle}>Journey Progress</Text>

    <Text style={styles.progressPercent}>
      {progress.toFixed(2)}%
    </Text>
  </View>

  <View style={styles.progressBar}>
    <View
      style={[
        styles.progressFill,
        { width: `${progress}%` },
      ]}
    />
  </View>

  
</View>
      <ImageBackground
        source={routeImage}
        style={styles.routeCard}
        imageStyle={styles.routeImage}
      >
        <View style={styles.routeOverlay}>
          

          <View style={styles.routeProgressTrack}>
            <View
              style={[styles.routeProgressFill, { width: `${progress}%` }]}
            />
          </View>

          <View style={[styles.movingShoe, { left: shoeLeft }]}>
            <Image source={SHOE_ICON} style={styles.movingShoeImage} />
          </View>

          <View style={styles.checkpointTrack}>
            {checkpoints.map((point, index) => {
              const left = markerPositions[index];

              return (
                <View key={point.id} style={[styles.checkpoint, { left }]}>
                  <View
                    style={[
                      styles.checkCircle,
                      point.complete && styles.checkCircleComplete,
                      point.active && styles.checkCircleCurrent,
                    ]}
                  >
                    {point.id === checkpoints.length ? (
                      <Text style={styles.checkNumber}>🏁</Text>
                    ) : (
                      <Text style={styles.checkNumber}>{point.id}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

      
        </View>
      </ImageBackground>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Journey Summary</Text>
       <SummaryRow
  label="Progress"
  value={`${progress}%`}
/>
       
        <SummaryRow
          label="Completed Checkpoints"
          value={`${checkpoints.filter((c) => c.complete).length}/${
            checkpoints.length
          }`}
        />
       
 <SummaryRow
  label="Steps Remaining"
  value={`${remainingSteps.toLocaleString()}`}
/>


<SummaryRow
  label="Tracking Status"
  value={
 
  Number(progress || 0) >= 100
    ? "Completed"
    : isTracking
      ? "Active"
      : "Paused"
}
/>
</View>

      <View style={styles.rewardsCard}>
        <Text style={styles.rewardsTitle}>Journey Rewards</Text>
       <SummaryRow
  label="Reward Points"
  value={Number(
    journeyReward?.rewardPoints || 0
  ).toLocaleString()}
  reward
/>

<SummaryRow
  label="W Coins"
  value={Number(
    journeyReward?.wCoins || 0
  ).toLocaleString()}
  reward
/>
        <SummaryRow label="Passport Stamp" value="✓ Unlocks" reward />
        <SummaryRow label="Certificate" value="✓ Earned" reward />
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Journey Checkpoints</Text>

        {checkpoints.map((point) => (
          <View key={point.id} style={styles.historyRow}>
            <Text style={styles.historyIcon}>
              {point.complete ? "✅" : point.active ? "🟡" : "○"}
            </Text>

            <Text style={styles.historyText}>
              {point.id}. {point.title}
            </Text>

            {point.complete && <Text style={styles.reachedText}>Reached</Text>}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.pauseButton}
        onPress={async () => {
          setSteps((prev) => prev + 500);

          const savedLifetime = Number(
            (await AsyncStorage.getItem("lifetimeSteps")) || 0
          );

          const newLifetime = savedLifetime + 500;

          await AsyncStorage.setItem(
            "lifetimeSteps",
            String(newLifetime)
          );

          console.log("Saved Lifetime Steps:", newLifetime);
        }}
      >
        <Text style={styles.pauseButtonText}>
          Test +500 Steps
        </Text>
      </TouchableOpacity>

      {/* SHARE BUTTON */}
      <TouchableOpacity
        style={styles.shareWalkButton}
        onPress={shareWalkProgress}
      >
        <Text style={styles.shareWalkText}>
          📤 Share My Walk
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pauseButton}
        onPress={() => setIsTracking((prev) => !prev)}
      >
        <Text style={styles.pauseButtonText}>
          {isTracking ? "Pause Journey" : "Resume Journey"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetJourney}
      >
        <Text style={styles.resetButtonText}>
          Reset Journey
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveExitButton}
        onPress={saveAndExit}
      >
        <Text style={styles.saveExitButtonText}>
          Save & Exit
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={completeJourney}
      >
        <Text style={styles.completeButtonText}>
          Complete Journey
        </Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={goToWallet}
        >
          <Text style={styles.secondaryText}>
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={goToCertificate}
        >
          <Text style={styles.secondaryText}>
            Certificate
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
function StatMini({ icon, value, label, small }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>
        {icon}
      </Text>

      <Text
        style={[
          styles.statValue,
          small && styles.statValueSmall,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function SummaryRow({ label, value, reward = false }) {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={
          reward
            ? styles.rewardLabel
            : styles.summaryLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          reward
            ? styles.rewardValue
            : styles.summaryValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07111F" },
  content: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 18 },
  backButton: { marginBottom: 12 },
  backText: { color: "#D4AF37", fontSize: 16, fontWeight: "800" },

  kicker: {
    color: "#8BE7FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: { color: "#C8D6EA", fontSize: 14, lineHeight: 21 },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(182,255,216,0.12)",
    borderColor: "rgba(182,255,216,0.35)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 12,
  },
  statusBadgeText: {
    color: "#B6FFD8",
    fontSize: 12,
    fontWeight: "900",
  },
  autoSaveText: {
    color: "#9FB0C7",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  shareWalkButton: {
  backgroundColor: "#D8A72E",
  borderRadius: 999,
  paddingVertical: 14,
  paddingHorizontal: 20,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 12,
  marginBottom: 12,
},

shareWalkText: {
  color: "#05070C",
  fontSize: 16,
  fontWeight: "900",
},
  statBox: {
    width: "23%",
    backgroundColor: "#101C2E",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { color: "#B6FFD8", fontSize: 18, fontWeight: "900" },
  statValueSmall: { fontSize: 12 },
  statLabel: {
    color: "#9FB0C7",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  routeCard: {
    height: 360,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#0E1A2B",
  },
  routeImage: { resizeMode: "cover" },
  routeOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    paddingBottom: 36,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 90,
  },

  routeProgressTrack: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: 130,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
  },
  routeProgressFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
    borderRadius: 10,
  },

  movingShoe: {
    position: "absolute",
    bottom: 118,
    marginLeft: -14,
    zIndex: 20,
  },
  movingShoeImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  checkpointTrack: {
    height: 70,
    position: "relative",
    marginTop: 20,
    marginBottom: 20,
  },
  checkpoint: {
    position: "absolute",
    top: 22,
    marginLeft: -19,
  },
  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#24324A",
    borderWidth: 2,
    borderColor: "#7D8AA3",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleComplete: {
    backgroundColor: "#1F8F55",
    borderColor: "#B6FFD8",
  },
  checkCircleCurrent: {
    backgroundColor: "#D4AF37",
    borderColor: "#FFFFFF",
  },
  checkNumber: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  remainingText: { color: "#E9F1FF", fontSize: 13, fontWeight: "800" },

  summaryCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: { color: "#9FB0C7", fontSize: 14, fontWeight: "700" },
  summaryValue: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

  rewardsCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  rewardsTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  rewardLabel: { color: "#9FB0C7", fontSize: 14, fontWeight: "700" },
  rewardValue: { color: "#B6FFD8", fontSize: 14, fontWeight: "900" },

  historyCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    marginBottom: 16,
  },
  historyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  historyIcon: { width: 28, fontSize: 17 },
  historyText: { flex: 1, color: "#DDE8F8", fontSize: 14, fontWeight: "700" },
  reachedText: { color: "#B6FFD8", fontSize: 12, fontWeight: "900" },

  pauseButton: {
    backgroundColor: "#16253A",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  pauseButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  resetButton: {
    backgroundColor: "#3A1620",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  resetButtonText: { color: "#FFB6C1", fontSize: 15, fontWeight: "900" },

  saveExitButton: {
    backgroundColor: "#102A3A",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  saveExitButtonText: { color: "#8BE7FF", fontSize: 15, fontWeight: "900" },

  completeButton: {
    backgroundColor: "#D4AF37",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  completeButtonText: {
    color: "#07111F",
    fontSize: 16,
    fontWeight: "900",
  },

  actionRow: { flexDirection: "row", gap: 12 },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#16253A",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  secondaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },


progressCard: {
  backgroundColor: "#111C2D",
  borderRadius: 20,
  padding: 18,
  marginTop: 18,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: "#2A3B52",
},

progressTitle: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "900",
},

progressPercent: {
  color: "#A6FFD2",
  fontSize: 22,
  fontWeight: "900",
},

progressRemaining: {
  marginTop: 12,
  color: "#DDE6F3",
  fontSize: 16,
  fontWeight: "800",
},


});// TERMINAL TEST
