import React from "react";
import { awardPointsOnce } from "../utils/rewardPointsSystem";
import { addLegacyPoints } from "../utils/legacyPointsManager";
import { addPoints } from "../utils/legacyPointsManager";

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

import { addRegularJourneySteps } from "../utils/stepTrackingEngine";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  completeJourneyProgress,
  resetJourneyProgress,
  updateJourneySteps,
} from "../utils/journeyProgress";

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
  const dLat =
    ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon =
    ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

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
  const [savedJourney, setSavedJourney] =
    React.useState(null);

  const [currentLocation, setCurrentLocation] =
    React.useState(null);

  const [steps, setSteps] =
    React.useState(0);

  const [secondsActive, setSecondsActive] =
    React.useState(0);

  const [isTracking, setIsTracking] =
    React.useState(true);

  const [hasCompleted, setHasCompleted] =
    React.useState(false);

  const [lastSavedAt, setLastSavedAt] =
    React.useState(null);

  const [
    lastRewardedCheckpoint,
    setLastRewardedCheckpoint,
  ] = React.useState(1);

  const [sessionId] =
    React.useState(`${Date.now()}`);

  const [passportStamps, setPassportStamps] =
    React.useState([]);

  const [
    shownStoryCheckpoints,
    setShownStoryCheckpoints,
  ] = React.useState([]);

  const lastStepEventRef =
    React.useRef(0);

  const journeyStepBaseRef =
    React.useRef(null);

  const rawJourney =
    journey ||
    selectedJourney ||
    activeJourney ||
    route?.params?.journey ||
    route?.params?.selectedJourney ||
    null;

  const currentJourney =
    rawJourney &&
    typeof rawJourney === "object"
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

  const normalizedJourneyId =
    String(journeyId)
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

  const journeyReward =
    JOURNEY_REWARDS[normalizedJourneyId] ||
    null;

  const routeTitle =
    currentJourney?.title ||
    "Legathon Journey";

  const storyTriggerStorageKey =
    React.useMemo(() => {
      const activeJourneyId =
        currentJourney?.id ||
        currentJourney?.journeyId ||
        currentJourney?.slug ||
        "default";

      return `shownJourneyStories:${activeJourneyId}`;
    }, [
      currentJourney?.id,
      currentJourney?.journeyId,
      currentJourney?.slug,
    ]);

  const [startingSteps, setStartingSteps] =
    React.useState(0);

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
    currentJourney?.title
      ?.toLowerCase()
      .replaceAll(" ", "") ||
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

  const liveMiles =
    Number((steps / 2000).toFixed(2));

  const liveCalories =
    Math.round(steps * 0.04);

  const progress =
    steps >= totalSteps
      ? 100
      : Math.floor(
          (steps / totalSteps) * 10000
        ) / 100;

  const remainingSteps =
    Math.max(totalSteps - steps, 0);

  const timeActive =
    `${String(
      Math.floor(secondsActive / 3600)
    ).padStart(2, "0")}:` +
    `${String(
      Math.floor(
        (secondsActive % 3600) / 60
      )
    ).padStart(2, "0")}:` +
    `${String(
      secondsActive % 60
    ).padStart(2, "0")}`;

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

  const checkpointNames =
    Array.isArray(rawCheckpoints)
      ? rawCheckpoints
          .slice(0, 5)
          .map((checkpoint, index) => {
            if (
              typeof checkpoint ===
              "string"
            ) {
              return checkpoint;
            }

            return (
              checkpoint?.title ||
              checkpoint?.name ||
              checkpoint?.label ||
              defaultCheckpointNames[index]
            );
          })
      : [...defaultCheckpointNames];

  while (checkpointNames.length < 5) {
    checkpointNames.push(
      defaultCheckpointNames[
        checkpointNames.length
      ]
    );
  }

  const checkpointCount = 5;

  const completedCheckpoints =
    progress >= 100
      ? checkpointCount
      : Math.floor(
          (progress / 100) *
            checkpointCount
        );

  const currentCheckpoint =
    progress >= 100
      ? checkpointCount
      : Math.min(
          completedCheckpoints + 1,
          checkpointCount
        );

  const checkpoints =
    checkpointNames.map(
      (title, index) => {
        const checkpointNumber =
          index + 1;

        return {
          id: checkpointNumber,
          title,
          complete:
            checkpointNumber <=
            completedCheckpoints,
          active:
            progress < 100 &&
            checkpointNumber ===
              currentCheckpoint,
        };
      }
    );

  const markerPositions =
    checkpoints.map((_, index) => {
      if (checkpoints.length === 1) {
        return "50%";
      }

      return `${
        (index /
          (checkpoints.length - 1)) *
          88 +
        5
      }%`;
    });

  const shoeLeft =
    `${Math.max(
      5,
      Math.min(
        (steps / totalSteps) * 88 + 5,
        93
      )
    )}%`;

  const shareWalkProgress =
    async () => {
      await Share.share({
        message:
          `I’m walking ${
            currentJourney?.title ||
            "a Legathon journey"
          } on Legathon Walk.\n\n` +
          `Steps: ${steps.toLocaleString()}\n` +
          `Distance: ${liveMiles.toFixed(
            2
          )} miles\n` +
          `Checkpoints completed: ${completedCheckpoints}/5\n\n` +
          "Join me on Legathon Walk.",
      });
    };

  React.useEffect(() => {
    let mounted = true;

    async function loadStories() {
      try {
        const saved =
          await AsyncStorage.getItem(
            storyTriggerStorageKey
          );

        if (mounted) {
          setShownStoryCheckpoints(
            saved
              ? JSON.parse(saved)
              : []
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

  React.useEffect(() => {
    loadPassportStamps();
  }, []);

  async function loadPassportStamps() {
    try {
      const saved =
        await AsyncStorage.getItem(
          "passportStamps"
        );

      if (saved) {
        setPassportStamps(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.log(
        "Passport load error:",
        error
      );
    }
  }

  React.useEffect(() => {
    journeyStepBaseRef.current = null;
    lastStepEventRef.current = 0;
  }, [currentJourney?.id]);

  React.useEffect(() => {
    let subscription = null;
    let mounted = true;

    async function startPedometer() {
      try {
        const available =
          await Pedometer.isAvailableAsync();

        if (!available || !mounted) {
          console.log(
            "Pedometer is unavailable."
          );
          return;
        }

        lastStepEventRef.current = 0;

        subscription =
          Pedometer.watchStepCount(
            async (result) => {
              if (
                !mounted ||
                !isTracking
              ) {
                return;
              }

              const sensorSteps =
                Number(
                  result?.steps || 0
                );

              const stepDelta =
                Math.max(
                  sensorSteps -
                    lastStepEventRef.current,
                  0
                );

              lastStepEventRef.current =
                sensorSteps;

              if (stepDelta <= 0) {
                return;
              }

              let newJourneySteps = 0;

              setSteps(
                (previousSteps) => {
                  if (
                    journeyStepBaseRef.current ==
                    null
                  ) {
                    journeyStepBaseRef.current =
                      previousSteps;
                  }

                  newJourneySteps =
                    Math.min(
                      totalSteps,
                      previousSteps +
                        stepDelta
                    );

                  return newJourneySteps;
                }
              );

              await addRegularJourneySteps(
                stepDelta
              );

              if (
                newJourneySteps >=
                totalSteps
              ) {
                setIsTracking(false);

                if (subscription) {
                  subscription.remove();
                  subscription = null;
                }

                return;
              }

              try {
                const savedLifetime =
                  Number(
                    (
                      await AsyncStorage.getItem(
                        "lifetimeSteps"
                      )
                    ) || 0
                  );

                await AsyncStorage.setItem(
                  "lifetimeSteps",
                  String(
                    savedLifetime +
                      stepDelta
                  )
                );
              } catch (saveError) {
                console.log(
                  "Pedometer save error:",
                  saveError
                );
              }
            }
          );
      } catch (error) {
        console.log(
          "Pedometer start error:",
          error
        );
      }
    }

    startPedometer();

    return () => {
      mounted = false;

      if (subscription) {
        subscription.remove();
      }
    };
  }, [
    currentJourney?.id,
    isTracking,
    totalSteps,
  ]);

  const runJourneyTest = async () => {
    if (!__DEV__) return;
    if (!currentJourney?.id) return;

    try {
      const testSteps =
        Math.max(totalSteps - 100, 0);

      setSteps(testSteps);

      await AsyncStorage.setItem(
        `journeyStats_${currentJourney.id}`,
        JSON.stringify({
          steps: testSteps,
          secondsActive,
        })
      );

      await updateJourneySteps(
        currentJourney,
        testSteps,
        {
          calories:
            Math.round(
              testSteps * 0.04
            ),
          walkingTimeMinutes:
            secondsActive / 60,
        }
      );
    } catch (error) {
      console.log(
        "Journey test error:",
        error
      );
    }
  };
    React.useEffect(() => {
    async function loadStats() {
      if (!currentJourney?.id) {
        return;
      }

      try {
        const results =
          await AsyncStorage.multiGet([
            `journeyStats_${currentJourney.id}`,
            `lastRewardedCheckpoint_${currentJourney.id}`,
            `journeyCompleted_${currentJourney.id}`,
          ]);

        const savedStats =
          results?.[0]?.[1];

        const savedCheckpoint =
          results?.[1]?.[1];

        const savedCompletion =
          results?.[2]?.[1];

        if (savedStats) {
          const data =
            JSON.parse(savedStats);

          setSteps(
            Number(data?.steps || 0)
          );

          setSecondsActive(
            Number(
              data?.secondsActive || 0
            )
          );

          setLastSavedAt(new Date());
        }

        if (savedCheckpoint) {
          setLastRewardedCheckpoint(
            Math.max(
              1,
              Number(savedCheckpoint)
            )
          );
        }

        setHasCompleted(
          savedCompletion === "true"
        );
      } catch (error) {
        console.log(
          "Journey stats load error:",
          error
        );
      }
    }

    loadStats();
  }, [currentJourney?.id]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isTracking) {
        setSecondsActive(
          (previousSeconds) =>
            previousSeconds + 1
        );
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isTracking]);

  async function saveJourneyProgressData(
    activeJourneyData,
    progressValue
  ) {
    if (!activeJourneyData?.id) {
      return;
    }

    const saved =
      await AsyncStorage.getItem(
        "journeyProgressData"
      );

    let existing = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          existing = parsed;
        }
      } catch {
        existing = [];
      }
    }

    const updatedJourney = {
      id: activeJourneyData.id,
      title:
        activeJourneyData.title ||
        "Legathon Journey",
      progress: Math.min(
        100,
        Math.max(
          0,
          Math.round(
            Number(progressValue || 0)
          )
        )
      ),
    };

    const journeyAlreadyExists =
      existing.some(
        (item) =>
          String(item?.id) ===
          String(activeJourneyData.id)
      );

    const updated =
      journeyAlreadyExists
        ? existing.map((item) =>
            String(item?.id) ===
            String(
              activeJourneyData.id
            )
              ? updatedJourney
              : item
          )
        : [
            ...existing,
            updatedJourney,
          ];

    await AsyncStorage.setItem(
      "journeyProgressData",
      JSON.stringify(updated)
    );
  }

  async function saveWeeklyStepData(
    stepCount
  ) {
    const today =
      new Date().getDay();

    const saved =
      await AsyncStorage.getItem(
        "weeklyStepData"
      );

    let week = [
      { day: "M", steps: 0 },
      { day: "T", steps: 0 },
      { day: "W", steps: 0 },
      { day: "T", steps: 0 },
      { day: "F", steps: 0 },
      { day: "S", steps: 0 },
      { day: "S", steps: 0 },
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length === 7
        ) {
          week = parsed;
        }
      } catch {
        // Keep the empty week.
      }
    }

    const todayIndex =
      today === 0 ? 6 : today - 1;

    week[todayIndex] = {
      ...week[todayIndex],
      steps: Number(stepCount || 0),
    };

    await AsyncStorage.setItem(
      "weeklyStepData",
      JSON.stringify(week)
    );
  }

  React.useEffect(() => {
    let cancelled = false;

    async function saveStats() {
      if (!currentJourney?.id) {
        return;
      }

      try {
        const updatedActiveJourney = {
          ...currentJourney,
          id: String(
            currentJourney.id
          ),
          sessionId,
          steps,
          secondsActive,
          progress,
          journeyProgress: progress,
          progressPercent: progress,
          currentCheckpoint,
          completed:
            progress >= 100,
          lastUpdated:
            new Date().toISOString(),
        };

        await AsyncStorage.multiSet([
          [
            `journeyStats_${currentJourney.id}`,
            JSON.stringify({
              steps,
              secondsActive,
            }),
          ],
          [
            `activeJourney_${currentJourney.id}`,
            JSON.stringify(
              updatedActiveJourney
            ),
          ],
          [
            "activeJourney",
            JSON.stringify(
              updatedActiveJourney
            ),
          ],
        ]);

        await saveJourneyProgressData(
          currentJourney,
          progress
        );

        await updateJourneySteps(
          currentJourney,
          steps,
          {
            calories: liveCalories,
            walkingTimeMinutes:
              secondsActive / 60,
          }
        );

        await saveWeeklyStepData(
          steps
        );

        if (!cancelled) {
          setLastSavedAt(new Date());
        }
      } catch (error) {
        console.log(
          "Journey auto-save error:",
          error
        );
      }
    }

    saveStats();

    return () => {
      cancelled = true;
    };
  }, [
    steps,
    secondsActive,
    progress,
    currentCheckpoint,
    currentJourney?.id,
    sessionId,
    liveCalories,
  ]);

  const openCheckpointStory =
    React.useCallback(
      async (checkpointNumber) => {
        const checkpoint =
          Number(checkpointNumber);

        if (
          !checkpoint ||
          checkpoint < 1 ||
          checkpoint > 5 ||
          shownStoryCheckpoints.includes(
            checkpoint
          )
        ) {
          return;
        }

        const updatedCheckpoints = [
          ...shownStoryCheckpoints,
          checkpoint,
        ];

        setShownStoryCheckpoints(
          updatedCheckpoints
        );

        setIsTracking(false);

        try {
          await AsyncStorage.setItem(
            storyTriggerStorageKey,
            JSON.stringify(
              updatedCheckpoints
            )
          );

          await updateJourneySteps(
            currentJourney,
            steps,
            {
              calories:
                liveCalories,
              walkingTimeMinutes:
                secondsActive / 60,
            }
          );

          if (progress >= 100) {
            await completeJourneyProgress(
              normalizedJourneyId ||
                currentJourney?.id
            );
          }
        } catch (error) {
          console.log(
            "Checkpoint story save error:",
            error
          );
        }

        if (
          typeof goToStory ===
          "function"
        ) {
          goToStory(checkpoint);
        }
      },
      [
        goToStory,
        shownStoryCheckpoints,
        storyTriggerStorageKey,
        currentJourney,
        steps,
        liveCalories,
        secondsActive,
        progress,
        normalizedJourneyId,
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
      !shownStoryCheckpoints.includes(
        checkpointToOpen
      )
    ) {
      openCheckpointStory(
        checkpointToOpen
      );
    }
  }, [
    progress,
    currentJourney?.id,
    shownStoryCheckpoints,
    openCheckpointStory,
  ]);

  React.useEffect(() => {
    let cancelled = false;

    async function rewardCheckpoint() {
      if (!currentJourney?.id) {
        return;
      }

      const checkpointNumber =
        Number(
          currentCheckpoint || 0
        );

      const lastRewarded =
        Number(
          lastRewardedCheckpoint || 0
        );

      if (checkpointNumber <= 1) {
        return;
      }

      if (
        checkpointNumber <=
        lastRewarded
      ) {
        return;
      }

      const checkpointKey =
        `checkpointReward_${currentJourney.id}_${checkpointNumber}`;

      try {
        const alreadyRewarded =
          await AsyncStorage.getItem(
            checkpointKey
          );

        if (
          alreadyRewarded === "true"
        ) {
          if (!cancelled) {
            setLastRewardedCheckpoint(
              checkpointNumber
            );
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
            String(
              checkpointNumber
            ),
          ],
        ]);

        await awardPointsOnce(
          `${currentJourney.id}_checkpoint_${checkpointNumber}`,
          checkpointReward
        );

        if (cancelled) {
          return;
        }

        setLastRewardedCheckpoint(
          checkpointNumber
        );

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

  async function awardPassportStamp(
    completedJourneyId
  ) {
    if (!completedJourneyId) {
      return;
    }

    try {
      const normalizedId =
        String(completedJourneyId)
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
        await AsyncStorage.getItem(
          "passportStamps"
        );

      let stamps = [];

      if (saved) {
        try {
          const parsed =
            JSON.parse(saved);

          if (Array.isArray(parsed)) {
            stamps = parsed;
          }
        } catch {
          stamps = [];
        }
      }

      if (
        !stamps.includes(stampId)
      ) {
        const updatedStamps = [
          ...stamps,
          stampId,
        ];

        await AsyncStorage.setItem(
          "passportStamps",
          JSON.stringify(
            updatedStamps
          )
        );

        setPassportStamps(
          updatedStamps
        );
      }

      await AsyncStorage.setItem(
        `passport_${normalizedId}`,
        "true"
      );
    } catch (error) {
      console.warn(
        "Passport stamp error:",
        error
      );
    }
  }

  async function completeJourney() {
    if (!currentJourney?.id) {
      Alert.alert(
        "Unable to Complete Journey",
        "No active journey was found."
      );

      return;
    }

    const activeJourneyId =
      String(currentJourney.id);

    const currentProgress =
      Number(progress || 0);

    const requiredSteps =
      Number(totalSteps || 0);

    const currentSteps =
      Number(steps || 0);

    const calculatedProgress =
      requiredSteps > 0
        ? Math.min(
            100,
            Math.round(
              (currentSteps /
                requiredSteps) *
                100
            )
          )
        : currentProgress;

    const isActuallyComplete =
      currentProgress >= 100 ||
      calculatedProgress >= 100 ||
      (
        requiredSteps > 0 &&
        currentSteps >= requiredSteps
      );

    if (!isActuallyComplete) {
      Alert.alert(
        "Journey Not Complete",
        `You must reach 100% before receiving this reward. Current progress: ${calculatedProgress}%.`
      );

      return;
    }

    const completedKey =
      `journeyCompleted_${activeJourneyId}`;

    const rewardedKey =
      `journeyRewarded_${activeJourneyId}`;

    try {
      const savedResults =
        await AsyncStorage.multiGet([
          completedKey,
          rewardedKey,
        ]);

      const completedSaved =
        savedResults?.[0]?.[1];

      const rewardedSaved =
        savedResults?.[1]?.[1];

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

      const rewardResult =
        await completeJourneyReward(
          activeJourneyId
        );

      if (!rewardResult?.awarded) {
        Alert.alert(
          "Reward Already Received",
          "This journey has already been rewarded."
        );

        return;
      }

      const journeyPoints =
        Number(
          currentJourney?.rewardPoints ||
          journeyReward?.rewardPoints ||
          0
        );

      const pointResult =
        await addPoints({
          id:
            `journey_${activeJourneyId}_complete`,
          title:
            currentJourney?.title ||
            "Legathon Journey",
          category: "Journey",
          points: journeyPoints,
          source:
            "Journey Complete",
          metadata: {
            journeyId:
              activeJourneyId,
          },
        });

      const completedJourney = {
        ...currentJourney,
        id: activeJourneyId,
        progress: 100,
        journeyProgress: 100,
        progressPercent: 100,
        currentCheckpoint: 5,
        completed: true,
        completedAt:
          new Date().toISOString(),
        steps: currentSteps,
        totalSteps: requiredSteps,
        routeImage:
          currentJourney?.routeImage,
      };

      await AsyncStorage.multiSet([
        [
          "activeJourney",
          JSON.stringify(
            completedJourney
          ),
        ],
        [
          `activeJourney_${activeJourneyId}`,
          JSON.stringify(
            completedJourney
          ),
        ],
        [
          `journeyProgress_${activeJourneyId}`,
          JSON.stringify(
            completedJourney
          ),
        ],
        [completedKey, "true"],
        [rewardedKey, "true"],
      ]);

      await completeJourneyProgress(
        activeJourneyId
      );

      await awardPassportStamp(
        activeJourneyId
      );

      setHasCompleted(true);
      setIsTracking(false);

      const earnedCoins =
        Number(
          rewardResult?.addedWCoins ??
          rewardResult?.walletResult
            ?.added ??
          rewardResult?.reward
            ?.wCoins ??
          journeyReward?.wCoins ??
          0
        );

      Alert.alert(
        "🏆 Journey Complete!",
        `Congratulations!\n\n` +
          `🪙 W Coins Earned: ${earnedCoins.toLocaleString()}\n\n` +
          `⭐ Legathon Points Earned: ${Number(
            pointResult?.pointsAwarded ||
            0
          ).toLocaleString()}\n\n` +
          `🏅 Total Legathon Points: ${Number(
            pointResult?.totalPoints ||
            0
          ).toLocaleString()}`
      );
    } catch (error) {
      console.error(
        "Complete journey failed:",
        error
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
    async function resetJourney() {
    if (!currentJourney?.id) {
      return;
    }

    const activeJourneyId =
      String(currentJourney.id);

    try {
      setSteps(0);
      setSecondsActive(0);
      setHasCompleted(false);
      setIsTracking(true);
      setLastRewardedCheckpoint(1);
      setShownStoryCheckpoints([]);

      const resetJourneyData = {
        ...currentJourney,
        id: activeJourneyId,
        progress: 0,
        journeyProgress: 0,
        progressPercent: 0,
        currentCheckpoint: 1,
        completed: false,
        completedAt: null,
        steps: 0,
        updatedAt:
          new Date().toISOString(),
      };

      await AsyncStorage.multiRemove([
        `journeyStats_${activeJourneyId}`,
        `activeJourney_${activeJourneyId}`,
        `journeyProgress_${activeJourneyId}`,
        `passport_${activeJourneyId}`,
        `certificate_${activeJourneyId}`,
        `lastRewardedCheckpoint_${activeJourneyId}`,
        storyTriggerStorageKey,
      ]);

      await AsyncStorage.multiSet([
        [
          "activeJourney",
          JSON.stringify(
            resetJourneyData
          ),
        ],
        [
          `activeJourney_${activeJourneyId}`,
          JSON.stringify(
            resetJourneyData
          ),
        ],
        [
          `journeyProgress_${activeJourneyId}`,
          JSON.stringify(
            resetJourneyData
          ),
        ],
      ]);

      await resetJourneyProgress(
        activeJourneyId
      );

      Alert.alert(
        "Journey Reset",
        "Progress was reset. Previously claimed rewards were kept."
      );
    } catch (error) {
      console.error(
        "Reset journey failed:",
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
      if (
        typeof goBack === "function"
      ) {
        goBack();
      }

      return;
    }

    const activeJourneyId =
      String(currentJourney.id);

    const currentSteps =
      Number(steps || 0);

    const requiredSteps =
      Number(totalSteps || 0);

    const savedProgress =
      requiredSteps > 0
        ? Math.min(
            100,
            Math.round(
              (currentSteps /
                requiredSteps) *
                100
            )
          )
        : 0;

    try {
      const savedJourneyData = {
        ...currentJourney,
        id: activeJourneyId,
        sessionId,
        steps: currentSteps,
        secondsActive,
        totalSteps: requiredSteps,
        progress:
          hasCompleted
            ? 100
            : savedProgress,
        journeyProgress:
          hasCompleted
            ? 100
            : savedProgress,
        progressPercent:
          hasCompleted
            ? 100
            : savedProgress,
        currentCheckpoint:
          hasCompleted
            ? 5
            : currentCheckpoint,
        completed:
          Boolean(hasCompleted),
        updatedAt:
          new Date().toISOString(),
      };

      await AsyncStorage.multiSet([
        [
          "activeJourney",
          JSON.stringify(
            savedJourneyData
          ),
        ],
        [
          `activeJourney_${activeJourneyId}`,
          JSON.stringify(
            savedJourneyData
          ),
        ],
        [
          `journeyProgress_${activeJourneyId}`,
          JSON.stringify(
            savedJourneyData
          ),
        ],
        [
          "lastStartedJourney",
          JSON.stringify(
            savedJourneyData
          ),
        ],
        [
          "resumeJourneyId",
          activeJourneyId,
        ],
        [
          `journeyStats_${activeJourneyId}`,
          JSON.stringify({
            steps: currentSteps,
            secondsActive,
          }),
        ],
        [
          `lastRewardedCheckpoint_${activeJourneyId}`,
          String(
            Number(
              lastRewardedCheckpoint ||
              1
            )
          ),
        ],
      ]);

      await saveJourneyProgressData(
        currentJourney,
        hasCompleted
          ? 100
          : savedProgress
      );

      await updateJourneySteps(
        currentJourney,
        currentSteps,
        {
          calories: liveCalories,
          walkingTimeMinutes:
            secondsActive / 60,
        }
      );

      if (
        typeof goBack === "function"
      ) {
        goBack();
      }
    } catch (error) {
      console.error(
        "Save and exit failed:",
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>
          LIVE GPS JOURNEY
        </Text>

        <Text style={styles.title}>
          {routeTitle}
        </Text>

        <Text style={styles.subtitle}>
          {routeDescription}
        </Text>

        <View
          style={[
            styles.statusBadge,
            !isTracking &&
              styles.statusBadgePaused,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              !isTracking &&
                styles.statusBadgeTextPaused,
            ]}
          >
            {progress >= 100
              ? "● Journey Goal Reached"
              : isTracking
                ? "● Tracking Active"
                : "● Tracking Paused"}
          </Text>
        </View>

        <Text
          style={styles.autoSaveText}
        >
          {lastSavedAt
            ? `Auto-saved ${lastSavedAt.toLocaleTimeString()}`
            : "Auto-save ready"}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatMini
          icon="👟"
          value={steps.toLocaleString()}
          label="Steps"
        />

        <StatMini
          icon="📍"
          value={liveMiles.toFixed(2)}
          label="Miles"
        />

        <StatMini
          icon="🔥"
          value={liveCalories}
          label="Calories"
        />

        <StatMini
          icon="⏱️"
          value={timeActive}
          label="Time"
          small
        />
      </View>

      <View style={styles.progressCard}>
        <View
          style={styles.progressHeader}
        >
          <Text
            style={styles.progressTitle}
          >
            Journey Progress
          </Text>

          <Text
            style={
              styles.progressPercent
            }
          >
            {progress.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  `${Math.min(
                    progress,
                    100
                  )}%`,
              },
            ]}
          />
        </View>

        <Text
          style={styles.progressRemaining}
        >
          {remainingSteps > 0
            ? `${remainingSteps.toLocaleString()} steps remaining`
            : "Journey step goal completed"}
        </Text>
      </View>

      <ImageBackground
        source={routeImage}
        style={styles.routeCard}
        imageStyle={styles.routeImage}
      >
        <View style={styles.routeOverlay}>
          <View
            style={
              styles.routeProgressTrack
            }
          >
            <View
              style={[
                styles.routeProgressFill,
                {
                  width:
                    `${Math.min(
                      progress,
                      100
                    )}%`,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.movingShoe,
              {
                left: shoeLeft,
              },
            ]}
          >
            <Image
              source={SHOE_ICON}
              style={
                styles.movingShoeImage
              }
            />
          </View>

          <View
            style={
              styles.checkpointTrack
            }
          >
            {checkpoints.map(
              (point, index) => {
                const left =
                  markerPositions[index];

                return (
                  <View
                    key={point.id}
                    style={[
                      styles.checkpoint,
                      { left },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkCircle,
                        point.complete &&
                          styles.checkCircleComplete,
                        point.active &&
                          styles.checkCircleCurrent,
                      ]}
                    >
                      <Text
                        style={
                          styles.checkNumber
                        }
                      >
                        {point.id === 5
                          ? "🏁"
                          : point.id}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>
      </ImageBackground>

      <View style={styles.summaryCard}>
        <Text
          style={styles.summaryTitle}
        >
          Journey Summary
        </Text>

        <SummaryRow
          label="Progress"
          value={`${progress.toFixed(
            2
          )}%`}
        />

        <SummaryRow
          label="Completed Checkpoints"
          value={`${checkpoints.filter(
            (checkpoint) =>
              checkpoint.complete
          ).length}/5`}
        />

        <SummaryRow
          label="Steps Remaining"
          value={remainingSteps.toLocaleString()}
        />

        <SummaryRow
          label="Tracking Status"
          value={
            progress >= 100
              ? "Goal Reached"
              : isTracking
                ? "Active"
                : "Paused"
          }
        />
      </View>

      <View style={styles.rewardsCard}>
        <Text
          style={styles.rewardsTitle}
        >
          Journey Rewards
        </Text>

        <SummaryRow
          label="Reward Points"
          value={Number(
            journeyReward?.rewardPoints ||
            currentJourney?.rewardPoints ||
            0
          ).toLocaleString()}
          reward
        />

        <SummaryRow
          label="W Coins"
          value={Number(
            journeyReward?.wCoins ||
            currentJourney?.wCoins ||
            0
          ).toLocaleString()}
          reward
        />

        <SummaryRow
          label="Passport Stamp"
          value="✓ Unlocks"
          reward
        />

        <SummaryRow
          label="Certificate"
          value="✓ Earned"
          reward
        />
      </View>

      <View style={styles.historyCard}>
        <Text
          style={styles.historyTitle}
        >
          Journey Checkpoints
        </Text>

        {checkpoints.map((point) => (
          <TouchableOpacity
            key={point.id}
            style={styles.historyRow}
            disabled={
              !point.complete &&
              !point.active
            }
            onPress={() => {
              if (
                point.complete ||
                point.active
              ) {
                openCheckpointStory(
                  point.id
                );
              }
            }}
          >
            <Text
              style={styles.historyIcon}
            >
              {point.complete
                ? "✅"
                : point.active
                  ? "🟡"
                  : "○"}
            </Text>

            <Text
              style={styles.historyText}
            >
              {point.id}. {point.title}
            </Text>

            {point.complete && (
              <Text
                style={
                  styles.reachedText
                }
              >
                Reached
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {__DEV__ && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={runJourneyTest}
        >
          <Text
            style={
              styles.testButtonText
            }
          >
            🧪 DEV: Jump Near Finish
          </Text>
        </TouchableOpacity>
      )}

      {progress >= 100 &&
        !hasCompleted && (
          <TouchableOpacity
            style={
              styles.completeButton
            }
            onPress={completeJourney}
          >
            <Text
              style={
                styles.completeButtonText
              }
            >
              Complete Journey and
              Claim Rewards
            </Text>
          </TouchableOpacity>
        )}

      {hasCompleted && (
        <View
          style={
            styles.completedBanner
          }
        >
          <Text
            style={
              styles.completedBannerText
            }
          >
            🏆 Journey Completed
          </Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            setIsTracking(
              (previous) => !previous
            )
          }
        >
          <Text
            style={styles.secondaryText}
          >
            {isTracking
              ? "Pause Tracking"
              : "Resume Tracking"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={saveAndExit}
        >
          <Text
            style={styles.secondaryText}
          >
            Save and Exit
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.shareWalkButton}
        onPress={shareWalkProgress}
      >
        <Text
          style={styles.shareWalkText}
        >
          📤 Share My Walk
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          Alert.alert(
            "Reset Journey?",
            "Your walking progress will return to zero. Previously claimed rewards will remain protected.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Reset",
                style:
                  "destructive",
                onPress:
                  resetJourney,
              },
            ]
          );
        }}
      >
        <Text
          style={styles.resetButtonText}
        >
          Reset Journey
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatMini({
  icon,
  value,
  label,
  small,
}) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>
        {icon}
      </Text>

      <Text
        style={[
          styles.statValue,
          small &&
            styles.statValueSmall,
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

function SummaryRow({
  label,
  value,
  reward = false,
}) {
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
  container: {
    flex: 1,
    backgroundColor: "#07111F",
  },

  content: {
    padding: 18,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 18,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingVertical: 6,
    paddingRight: 18,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 17,
    fontWeight: "900",
  },

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

  subtitle: {
    color: "#C8D6EA",
    fontSize: 14,
    lineHeight: 21,
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor:
      "rgba(182,255,216,0.12)",
    borderColor:
      "rgba(182,255,216,0.35)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 12,
  },

  statusBadgePaused: {
    backgroundColor:
      "rgba(255,199,71,0.12)",
    borderColor:
      "rgba(255,199,71,0.40)",
  },

  statusBadgeText: {
    color: "#B6FFD8",
    fontSize: 12,
    fontWeight: "900",
  },

  statusBadgeTextPaused: {
    color: "#FFC747",
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

  statBox: {
    width: "23%",
    minHeight: 100,
    backgroundColor: "#101C2E",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.25)",
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  statValue: {
    color: "#B6FFD8",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  statValueSmall: {
    fontSize: 12,
  },

  statLabel: {
    color: "#9FB0C7",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },

  progressCard: {
    backgroundColor: "#111C2D",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2A3B52",
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
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

  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#1B2B43",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#78E8C5",
    borderRadius: 999,
  },

  progressRemaining: {
    marginTop: 12,
    color: "#DDE6F3",
    fontSize: 14,
    fontWeight: "800",
  },

  routeCard: {
    height: 360,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#0E1A2B",
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.35)",
  },

  routeImage: {
    resizeMode: "cover",
  },

  routeOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    paddingBottom: 36,
    backgroundColor:
      "rgba(0,0,0,0.25)",
  },

  routeProgressTrack: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: 130,
    height: 8,
    backgroundColor:
      "rgba(255,255,255,0.25)",
    borderRadius: 10,
    overflow: "hidden",
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

  checkNumber: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  summaryCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.25)",
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    gap: 12,
  },

  summaryLabel: {
    flex: 1,
    color: "#9FB0C7",
    fontSize: 14,
    fontWeight: "700",
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  rewardsCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.25)",
  },

  rewardsTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  rewardLabel: {
    flex: 1,
    color: "#9FB0C7",
    fontSize: 14,
    fontWeight: "700",
  },

  rewardValue: {
    color: "#B6FFD8",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  historyCard: {
    backgroundColor: "#101C2E",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.25)",
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
    minHeight: 50,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor:
      "rgba(255,255,255,0.08)",
  },

  historyIcon: {
    width: 30,
    fontSize: 17,
  },

  historyText: {
    flex: 1,
    color: "#DDE8F8",
    fontSize: 14,
    fontWeight: "700",
  },

  reachedText: {
    color: "#B6FFD8",
    fontSize: 12,
    fontWeight: "900",
  },

  testButton: {
    backgroundColor: "#24344D",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#435B7A",
  },

  testButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  completeButton: {
    backgroundColor: "#D4AF37",
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  completeButtonText: {
    color: "#07111F",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  completedBanner: {
    backgroundColor:
      "rgba(182,255,216,0.14)",
    borderWidth: 1,
    borderColor:
      "rgba(182,255,216,0.45)",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  completedBannerText: {
    color: "#B6FFD8",
    fontSize: 17,
    fontWeight: "900",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#16253A",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A405D",
  },

  secondaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  shareWalkButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  shareWalkText: {
    color: "#05070C",
    fontSize: 16,
    fontWeight: "900",
  },

  resetButton: {
    backgroundColor: "#3A1620",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor:
      "rgba(255,182,193,0.25)",
  },

  resetButtonText: {
    color: "#FFB6C1",
    fontSize: 15,
    fontWeight: "900",
  },
});