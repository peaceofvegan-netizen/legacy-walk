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
  AppState,
} from "react-native";

import { Pedometer } from "expo-sensors";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  addRegularJourneySteps,
  activateJourneyTracking,
} from "../utils/stepTrackingEngine";

import {
  completeJourneyProgress,
  resetJourneyProgress,
  updateJourneySteps,
} from "../utils/journeyProgress";

import { awardPointsOnce } from "../utils/rewardPointsSystem";
import { addPoints } from "../utils/legacyPointsManager";

import journeyMaps from "../data/journeyMaps";

import {
  ROUTE_IMAGES,
  getRouteImage,
} from "../data/routeImages";

import JOURNEY_REWARDS, {
  completeJourneyReward,
} from "../utils/journeyRewards";

const SHOE_ICON = require("../assets/apparel/w-shoe.png");

const PROGRESS_KEY = "LEGACY_WALK_JOURNEY_PROGRESS";

// Foreground walking filter.
//
// GPS cannot identify every slow-moving vehicle.
// Unknown or stale GPS is deliberately rejected.
// Indoor steps may be missed.
//
// Speeds are meters per second:
// 2.5 m/s ≈ 5.6 mph
// 4.0 m/s ≈ 8.9 mph

export function createWalkingGate(clock = Date.now) {
  let lastFix = 0;
  let slowSince = null;
  let previous = null;
  let generation = 0;
  let driving = false;
  let latestSlow = false;

  function invalidate() {
    generation += 1;
    slowSince = null;
    latestSlow = false;
  }

  function status() {
    const now = clock();

    if (!lastFix || now - lastFix > 10000) {
      return "Waiting for reliable GPS";
    }

    if (driving) {
      return "Vehicle-speed movement — steps paused";
    }

    if (
      !latestSlow ||
      slowSince === null ||
      now - slowSince < 20000
    ) {
      return "Verifying walking speed";
    }

    return "Walking verified";
  }

  function update(fix) {
    const now = clock();
    const coords = fix?.coords;
    const time = Number(fix?.timestamp);

    if (
      !coords ||
      !Number.isFinite(time) ||
      now - time > 10000 ||
      time > now + 1000 ||
      !Number.isFinite(coords.accuracy) ||
      coords.accuracy > 30 ||
      coords.accuracy < 0 ||
      !Number.isFinite(coords.latitude) ||
      !Number.isFinite(coords.longitude)
    ) {
      invalidate();
      lastFix = 0;
      previous = null;
      return;
    }

    if (previous && time <= previous.timestamp) {
      return;
    }

    if (lastFix && time - lastFix > 10000) {
      invalidate();
    }

    let derivedSpeed = null;

    if (previous) {
      const seconds = (time - previous.timestamp) / 1000;

      if (seconds >= 1 && seconds <= 10) {
        const radians = Math.PI / 180;

        const latitudeDifference =
          (coords.latitude - previous.coords.latitude) * radians;

        const longitudeDifference =
          (coords.longitude - previous.coords.longitude) * radians;

        const haversine =
          Math.sin(latitudeDifference / 2) ** 2 +
          Math.cos(coords.latitude * radians) *
            Math.cos(previous.coords.latitude * radians) *
            Math.sin(longitudeDifference / 2) ** 2;

        const distance =
          6371000 *
          2 *
          Math.asin(Math.sqrt(Math.min(1, haversine)));

        // Subtract reported uncertainty to reduce GPS-drift errors.
        derivedSpeed =
          Math.max(
            0,
            distance -
              coords.accuracy -
              previous.coords.accuracy
          ) / seconds;
      }
    }

    previous = fix;
    lastFix = time;

    const reportedSpeed =
      Number.isFinite(coords.speed) && coords.speed >= 0
        ? coords.speed
        : null;

    const speed =
      reportedSpeed === null
        ? derivedSpeed
        : Math.max(reportedSpeed, derivedSpeed ?? 0);

    if (speed === null || speed > 2.5) {
      invalidate();

      if (speed !== null && speed >= 4) {
        driving = true;
      }

      return;
    }

    latestSlow = true;

    if (slowSince === null) {
      slowSince = time;
    }

    if (time - slowSince >= 20000) {
      driving = false;
    }
  }

  function ticket() {
    // A stale interval breaks the uninterrupted verification window.
    if (clock() - lastFix > 10000) {
      invalidate();
    }

    return status() === "Walking verified"
      ? generation
      : null;
  }

  return {
    update,
    status,
    ticket,
  };
}

// Serialize journey operations across screen remounts.
// A newly opened journey waits for the previous journey's saves.

let journeyWork = Promise.resolve();

function enqueueJourneyWork(operation) {
  const result = journeyWork.then(operation);

  journeyWork = result.catch(() => {});

  return result;
}

function normalizeId(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function nonnegative(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : fallback;
}

function firstPositive(...values) {
  return (
    values
      .map(Number)
      .find(
        value =>
          Number.isFinite(value) &&
          value > 0
      ) || 0
  );
}

function parseObject(raw) {
  if (!raw) {
    return {};
  }

  const value = JSON.parse(raw);

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error("Saved journey data is invalid.");
  }

  return value;
}

function checkpointFor(steps, goal) {
  return steps >= goal
    ? 5
    : Math.min(
        4,
        1 + Math.floor((steps / goal) * 4)
      );
}

// Each journey gets a separate component instance.
// This prevents one journey's state from appearing in another.

export default function GPSJourneyMapScreen(props) {
  const raw =
    props.journey ||
    props.selectedJourney ||
    props.activeJourney ||
    props.route?.params?.journey ||
    props.route?.params?.selectedJourney;

  const data =
    raw && typeof raw === "object"
      ? raw
      : raw
        ? {
            id: String(raw),
            title: String(raw),
          }
        : {};

  const id = String(
    data.id ||
      data.journeyId ||
      data.routeKey ||
      data.slug ||
      props.route?.params?.journeyId ||
      props.route?.params?.id ||
      ""
  );

  const reward =
    JOURNEY_REWARDS[normalizeId(id)] ||
    JOURNEY_REWARDS[id] ||
    {};

  const goal = firstPositive(
    data.totalSteps,
    data.requiredSteps,
    data.stepGoal,
    data.targetSteps,
    reward.totalSteps,
    firstPositive(
      data.distanceMiles,
      reward.distanceMiles
    ) * 2000
  );

  if (!id || !goal) {
    return (
      <View style={[styles.container, styles.content]}>
        <Text style={styles.title}>
          Journey unavailable
        </Text>

        <Text style={styles.subtitle}>
          This journey needs an ID and a step goal before
          tracking can start.
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            props.goBack
              ? props.goBack()
              : props.navigation?.goBack()
          }
        >
          <Text style={styles.secondaryText}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <JourneySession
      key={`${id}:${goal}`}
      {...props}
      initialJourney={{
        ...reward,
        ...data,
        id,
        totalSteps: Math.floor(goal),
      }}
    />
  );
}

function JourneySession({
  initialJourney,
  goBack,
  goToStory,
  navigation,
}) {
  const [currentJourney] = React.useState(initialJourney);

  const id = currentJourney.id;
  const normalizedJourneyId = normalizeId(id);
  const totalSteps = currentJourney.totalSteps;

  const journeyReward =
    JOURNEY_REWARDS[normalizedJourneyId] ||
    JOURNEY_REWARDS[id];

  const storyKey = `shownJourneyStories:${id}`;

  const [sessionId] = React.useState(() =>
    String(Date.now())
  );

  const [view, setView] = React.useState(null);
  const [loadError, setLoadError] = React.useState("");
  const [saveError, setSaveError] = React.useState("");
  const [sensorError, setSensorError] = React.useState("");
  const [lastSavedAt, setLastSavedAt] = React.useState(null);

  const [walkingStatus, setWalkingStatus] =
    React.useState("Waiting for reliable GPS");

  const [sensorReady, setSensorReady] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const [focused, setFocused] = React.useState(
    () => navigation?.isFocused?.() ?? true
  );

  const [appState, setAppState] = React.useState(
    AppState.currentState || "active"
  );

  const snapshot = React.useRef(null);
  const mounted = React.useRef(false);
  const busyRef = React.useRef(false);
  const trackingRef = React.useRef(false);
  const subscriptionRef = React.useRef(null);
  const allowNavigation = React.useRef(false);
  const errorRef = React.useRef("");

  function publish() {
    if (mounted.current && snapshot.current) {
      setView({ ...snapshot.current });
    }
  }

  function stopSensor() {
    trackingRef.current = false;

    subscriptionRef.current?.remove();
    subscriptionRef.current = null;

    if (mounted.current) {
      setSensorReady(false);
    }
  }

  function reportSaveError(error) {
    console.error("Journey save failed:", error);

    errorRef.current =
      "Progress could not be fully saved. Tap Save and Exit to retry.";

    if (mounted.current) {
      setSaveError(errorRef.current);

      if (snapshot.current) {
        snapshot.current.isTracking = false;
      }

      stopSensor();
      publish();
    }
  }

  // Called only within the serialized journey queue.
  // Never save a default zero before restoration finishes.

  async function persistNow() {
    if (!snapshot.current) {
      return;
    }

    const state = { ...snapshot.current };

    const percent = Math.min(
      100,
      (state.steps / totalSteps) * 100
    );

    const active = {
      ...currentJourney,
      sessionId,
      steps: state.steps,
      secondsActive: state.secondsActive,
      progress: percent,
      journeyProgress: percent,
      progressPercent: percent,
      currentCheckpoint: checkpointFor(
        state.steps,
        totalSteps
      ),
      completed: state.hasCompleted,
      isTracking: state.isTracking,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.multiSet([
      [
        `journeyStats_${id}`,
        JSON.stringify({
          ...state,
          schemaVersion: 2,
        }),
      ],
      [
        `activeJourney_${id}`,
        JSON.stringify(active),
      ],
      [
        `journeyProgress_${id}`,
        JSON.stringify(active),
      ],
      [
        "activeJourney",
        JSON.stringify(active),
      ],
      [
        "lastStartedJourney",
        JSON.stringify(active),
      ],
      [
        "resumeJourneyId",
        id,
      ],
      [
        storyKey,
        JSON.stringify(state.shownStories),
      ],
      [
        `lastRewardedCheckpoint_${id}`,
        String(state.lastRewardedCheckpoint),
      ],
    ]);

    await updateJourneySteps(
      currentJourney,
      state.steps,
      {
        calories: Math.round(state.steps * 0.04),
        walkingTimeMinutes: state.secondsActive / 60,
      }
    );

    const raw = await AsyncStorage.getItem(
      "journeyProgressData"
    );

    const existing = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(existing)) {
      throw new Error("Journey list data is invalid.");
    }

    const entry = {
      id,
      title: currentJourney.title || "Legathon Journey",
      progress: percent,
    };

    const found = existing.some(
      item => String(item?.id) === id
    );

    const updatedList = found
      ? existing.map(item =>
          String(item?.id) === id
            ? { ...item, ...entry }
            : item
        )
      : [...existing, entry];

    await AsyncStorage.setItem(
      "journeyProgressData",
      JSON.stringify(updatedList)
    );

    // Do not overwrite daily or lifetime totals with
    // this journey's cumulative total.

    errorRef.current = "";

    if (mounted.current) {
      setSaveError("");
      setLastSavedAt(new Date());
    }
  }

  function save() {
    return enqueueJourneyWork(persistNow);
  }

  // Restore this journey before starting any sensor.

  React.useEffect(() => {
    mounted.current = true;

    let cancelled = false;

    enqueueJourneyWork(async () => {
      const values = Object.fromEntries(
        await AsyncStorage.multiGet([
          `journeyStats_${id}`,
          `journeyCompleted_${id}`,
          `journeyRewarded_${id}`,
          `lastRewardedCheckpoint_${id}`,
          storyKey,
          PROGRESS_KEY,
        ])
      );

      const rawStats = values[`journeyStats_${id}`];
      const stats = parseObject(rawStats);
      const database = parseObject(values[PROGRESS_KEY]);
      const legacy = database[normalizedJourneyId] || {};

      const restoredSteps = Number(
        rawStats != null
          ? stats.steps ?? 0
          : legacy.stepsCompleted ?? 0
      );

      const restoredSeconds = Number(
        rawStats != null
          ? stats.secondsActive ?? 0
          : (legacy.walkingTimeMinutes ?? 0) * 60
      );

      if (
        !Number.isFinite(restoredSteps) ||
        restoredSteps < 0 ||
        !Number.isFinite(restoredSeconds) ||
        restoredSeconds < 0
      ) {
        throw new Error(
          "Saved progress has invalid steps or time; it was not overwritten."
        );
      }

      const stories =
        stats.shownStories ??
        (
          values[storyKey]
            ? JSON.parse(values[storyKey])
            : []
        );

      if (!Array.isArray(stories)) {
        throw new Error(
          "Saved story progress is invalid."
        );
      }

      const claimed =
        values[`journeyCompleted_${id}`] === "true" ||
        values[`journeyRewarded_${id}`] === "true" ||
        Boolean(legacy.rewardsClaimed);

      if (cancelled) {
        return;
      }

      snapshot.current = {
        steps: Math.min(
          totalSteps,
          Math.floor(restoredSteps)
        ),
        secondsActive: Math.floor(restoredSeconds),
        hasCompleted: stats.hasCompleted ?? claimed,
        rewardsClaimed: claimed,
        isTracking: stats.isTracking ?? !claimed,
        lastRewardedCheckpoint: Math.max(
          1,
          nonnegative(
            stats.lastRewardedCheckpoint ??
              values[`lastRewardedCheckpoint_${id}`],
            1
          )
        ),
        shownStories: stories
          .map(Number)
          .filter(number => number >= 1 && number <= 5),
      };

      if (snapshot.current.steps >= totalSteps) {
        snapshot.current.isTracking = false;
      }

      publish();
      setLoadError("");
    }).catch(error => {
      console.error(
        "Journey restoration failed:",
        error
      );

      if (!cancelled) {
        setLoadError(
          "Could not load your saved journey. Nothing was overwritten. Go back and reopen it."
        );
      }
    });

    return () => {
      cancelled = true;
      mounted.current = false;

      stopSensor();

      // Accepted events already queued finish before this save.
      if (snapshot.current) {
        save().catch(error =>
          console.error(
            "Final journey save failed:",
            error
          )
        );
      }
    };
  }, []);

  const ready = view !== null;
  const steps = view?.steps || 0;
  const secondsActive = view?.secondsActive || 0;
  const hasCompleted = Boolean(view?.hasCompleted);

  const isTracking = Boolean(
    view?.isTracking &&
      sensorReady &&
      walkingStatus === "Walking verified" &&
      focused &&
      appState === "active" &&
      !busy
  );

  const progress = Math.min(
    100,
    Math.floor((steps / totalSteps) * 10000) / 100
  );

  const liveMiles = steps / 2000;
  const liveCalories = Math.round(steps * 0.04);

  const remainingSteps = Math.max(
    totalSteps - steps,
    0
  );

  const currentCheckpoint = checkpointFor(
    steps,
    totalSteps
  );

  const timeActive = [
    Math.floor(secondsActive / 3600),
    Math.floor(secondsActive / 60) % 60,
    secondsActive % 60,
  ]
    .map(number =>
      String(number).padStart(2, "0")
    )
    .join(":");

  const routeTitle =
    currentJourney.title || "Legathon Journey";

  const routeDescription =
    currentJourney.gpsText ||
    currentJourney.description ||
    "Walk anywhere. Every step moves you closer to completing your Legathon Journey.";

  const routeKey = currentJourney.routeKey || id;

  const imageValue =
    getRouteImage?.(routeKey) ||
    ROUTE_IMAGES?.[routeKey] ||
    currentJourney.routeImage ||
    currentJourney.image ||
    ROUTE_IMAGES?.selma;

  const routeImage =
    typeof imageValue === "string"
      ? { uri: imageValue }
      : imageValue;

  const journeyData =
    journeyMaps?.[id] ||
    journeyMaps?.[normalizedJourneyId] ||
    journeyMaps?.[currentJourney.title] ||
    {};

  const names =
    journeyData.checkpoints ??
    currentJourney.checkpoints ??
    currentJourney.checkpointNames;

  const defaults = [
    "Start",
    "Checkpoint 2",
    "Checkpoint 3",
    "Checkpoint 4",
    "Finish",
  ];

  const checkpoints = defaults.map(
    (fallback, index) => {
      const item = Array.isArray(names)
        ? names[index]
        : null;

      const threshold = Math.ceil(
        (totalSteps * index) / 4
      );

      return {
        id: index + 1,
        title:
          typeof item === "string"
            ? item
            : item?.title ||
              item?.name ||
              item?.label ||
              fallback,
        complete: ready && steps >= threshold,
        active:
          ready &&
          index + 1 === currentCheckpoint &&
          steps < totalSteps,
      };
    }
  );

  const completedCheckpoints = checkpoints.filter(
    point => point.complete
  ).length;

  const markerPositions = checkpoints.map(
    (_, index) => `${5 + (index / 4) * 88}%`
  );

  const shoeLeft =
    `${5 + Math.min(1, steps / totalSteps) * 88}%`;

  async function awardReachedCheckpoints() {
    const highest = checkpointFor(
      snapshot.current.steps,
      totalSteps
    );

    for (
      let checkpoint = 2;
      checkpoint <= highest;
      checkpoint += 1
    ) {
      const key = `checkpointReward_${id}_${checkpoint}`;

      if (await AsyncStorage.getItem(key) !== "true") {
        await awardPointsOnce(
          `${id}_checkpoint_${checkpoint}`,
          50
        );

        await AsyncStorage.setItem(key, "true");
      }

      snapshot.current.lastRewardedCheckpoint =
        Math.max(
          snapshot.current.lastRewardedCheckpoint,
          checkpoint
        );
    }
  }

  // Foreground GPS and pedometer session.
  //
  // Raw readings always advance the local sensor baseline.
  // Rejected vehicle readings cannot be credited afterward.
  //
  // Accepted deltas wait six seconds before being credited.
  // A disqualifying GPS reading cancels pending deltas.

  React.useEffect(() => {
    if (
      !ready ||
      !view.isTracking ||
      steps >= totalSteps ||
      busy ||
      !focused ||
      appState !== "active"
    ) {
      return;
    }

    let cancelled = false;
    let lastReading = null;
    let locationSubscription = null;
    let verificationTimer = null;
    let pending = [];
    let priorTicket = null;

    const gate = createWalkingGate();

    function cleanupLocation() {
      locationSubscription?.remove();
      locationSubscription = null;

      if (verificationTimer) {
        clearInterval(verificationTimer);
      }

      verificationTimer = null;
      pending = [];
    }

    function commit(delta) {
      enqueueJourneyWork(async () => {
        const available = Math.max(
          0,
          totalSteps - snapshot.current.steps
        );

        if (!available) {
          return;
        }

        const accepted = Math.min(
          delta,
          available
        );

        const result =
          await addRegularJourneySteps(accepted);

        if (result?.blocked) {
          throw new Error(
            "Another activity owns step tracking. Resume this journey when ready."
          );
        }

        if (!result?.saved) {
          throw new Error(
            "Could not save your step totals."
          );
        }

        // Only credit the amount confirmed by the engine.
        const credited = Math.min(
          accepted,
          Math.max(
            0,
            Math.floor(Number(result.added) || 0)
          )
        );

        if (!credited) {
          return;
        }

        snapshot.current.steps += credited;

        if (snapshot.current.steps >= totalSteps) {
          snapshot.current.isTracking = false;
          stopSensor();
        }

        publish();

        await persistNow();
        await awardReachedCheckpoints();
      }).catch(reportSaveError);
    }

    async function start() {
      try {
        const permission =
          await Pedometer.requestPermissionsAsync();

        if (cancelled) {
          return;
        }

        if (!permission.granted) {
          throw new Error(
            "Enable Motion & Fitness permission to count steps."
          );
        }

        const available =
          await Pedometer.isAvailableAsync();

        if (!available) {
          throw new Error(
            "Step tracking is unavailable on this device."
          );
        }

        if (cancelled) {
          return;
        }

        const activated =
          await enqueueJourneyWork(async () => {
            if (cancelled) {
              return null;
            }

            return activateJourneyTracking();
          });

        if (cancelled) {
          return;
        }

        if (!activated?.saved) {
          throw new Error(
            "Could not start journey tracking. Please try again."
          );
        }

        const locationPermission =
          await Location.requestForegroundPermissionsAsync();

        if (cancelled) {
          return;
        }

        if (!locationPermission.granted) {
          throw new Error(
            "Enable precise location to filter vehicle movement."
          );
        }

        locationSubscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 0,
            },
            fix => {
              if (cancelled) {
                return;
              }

              gate.update(fix);
              setWalkingStatus(gate.status());
            }
          );

        if (cancelled) {
          cleanupLocation();
          return;
        }

        trackingRef.current = true;

        verificationTimer = setInterval(() => {
          if (
            cancelled ||
            !trackingRef.current ||
            busyRef.current
          ) {
            pending = [];
            return;
          }

          const ticket = gate.ticket();

          setWalkingStatus(gate.status());

          if (ticket === null) {
            pending = [];
            return;
          }

          const readyItems = [];

          pending = pending.filter(item => {
            if (item.ticket !== ticket) {
              return false;
            }

            if (Date.now() - item.time < 6000) {
              return true;
            }

            readyItems.push(item);
            return false;
          });

          const delta = readyItems.reduce(
            (sum, item) => sum + item.delta,
            0
          );

          if (delta) {
            commit(delta);
          }
        }, 1000);

        subscriptionRef.current =
          Pedometer.watchStepCount(result => {
            if (
              cancelled ||
              !trackingRef.current ||
              busyRef.current
            ) {
              return;
            }

            const reading = Number(result?.steps);

            if (
              !Number.isFinite(reading) ||
              reading < 0
            ) {
              return;
            }

            const value = Math.floor(reading);
            const ticket = gate.ticket();

            const delta =
              lastReading === null ||
              value < lastReading
                ? 0
                : value - lastReading;

            // Always advance, even when steps are rejected.
            lastReading = value;

            if (
              delta > 0 &&
              ticket !== null &&
              priorTicket === ticket
            ) {
              pending.push({
                delta,
                ticket,
                time: Date.now(),
              });
            }

            priorTicket = ticket;
          });

        setSensorError("");
        setSensorReady(true);
      } catch (error) {
        cleanupLocation();

        if (!cancelled) {
          stopSensor();

          snapshot.current.isTracking = false;

          publish();

          setSensorError(
            error.message ||
              "Step tracking could not start."
          );
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      cleanupLocation();
      stopSensor();
    };
  }, [
    ready,
    view?.isTracking,
    busy,
    focused,
    appState,
  ]);

  // Only verified foreground tracking increases active time.

  React.useEffect(() => {
    if (!isTracking) {
      return;
    }

    const timer = setInterval(() => {
      if (
        !trackingRef.current ||
        busyRef.current ||
        !snapshot.current
      ) {
        return;
      }

      snapshot.current.secondsActive += 1;

      publish();

      if (snapshot.current.secondsActive % 5 === 0) {
        save().catch(reportSaveError);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking]);

  // Save when leaving, changing screens, or backgrounding.
  // This screen does not implement background GPS tracking.

  React.useEffect(() => {
    const listener = AppState.addEventListener(
      "change",
      next => {
        setAppState(next);

        if (next !== "active") {
          stopSensor();

          if (snapshot.current) {
            save().catch(reportSaveError);
          }
        }
      }
    );

    const offBlur = navigation?.addListener?.(
      "blur",
      () => {
        setFocused(false);
        stopSensor();

        if (snapshot.current) {
          save().catch(reportSaveError);
        }
      }
    );

    const offFocus = navigation?.addListener?.(
      "focus",
      () => setFocused(true)
    );

    const offRemove = navigation?.addListener?.(
      "beforeRemove",
      event => {
        if (
          allowNavigation.current ||
          !snapshot.current
        ) {
          return;
        }

        event.preventDefault();

        if (busyRef.current) {
          return;
        }

        runAction(async () => {
          await persistNow();

          allowNavigation.current = true;

          navigation.dispatch(event.data.action);
        });
      }
    );

    return () => {
      listener.remove();
      offBlur?.();
      offFocus?.();
      offRemove?.();
    };
  }, [navigation]);

  async function runAction(operation) {
    if (!snapshot.current || busyRef.current) {
      return;
    }

    busyRef.current = true;
    setBusy(true);

    stopSensor();

    try {
      await enqueueJourneyWork(operation);
    } catch (error) {
      reportSaveError(error);

      if (mounted.current) {
        Alert.alert(
          "Unable to Save Journey",
          error.message || "Please try again."
        );
      }
    } finally {
      busyRef.current = false;

      if (mounted.current) {
        publish();
        setBusy(false);
      }
    }
  }

  function leave() {
    allowNavigation.current = true;

    if (typeof goBack === "function") {
      goBack();
    } else {
      navigation?.goBack();
    }
  }

  function saveAndExit() {
    if (!snapshot.current) {
      leave();
      return;
    }

    return runAction(async () => {
      await persistNow();
      leave();
    });
  }

  function toggleTracking() {
    return runAction(async () => {
      snapshot.current.isTracking =
        snapshot.current.steps < totalSteps &&
        !snapshot.current.isTracking;

      await persistNow();
    });
  }

  function openCheckpointStory(checkpointNumber) {
    const number = Number(checkpointNumber);

    if (
      !snapshot.current ||
      !Number.isInteger(number) ||
      number < 1 ||
      number > 5 ||
      snapshot.current.steps <
        Math.ceil((totalSteps * (number - 1)) / 4) ||
      typeof goToStory !== "function"
    ) {
      return;
    }

    return runAction(async () => {
      const previous = snapshot.current.shownStories;

      snapshot.current.shownStories = [
        ...new Set([...previous, number]),
      ];

      try {
        await persistNow();
      } catch (error) {
        snapshot.current.shownStories = previous;
        throw error;
      }

      goToStory(number);
    });
  }

  React.useEffect(() => {
    if (
      !ready ||
      busy ||
      errorRef.current ||
      !focused ||
      appState !== "active" ||
      !steps ||
      typeof goToStory !== "function"
    ) {
      return;
    }

    const number = checkpointFor(
      steps,
      totalSteps
    );

    if (!view.shownStories.includes(number)) {
      openCheckpointStory(number);
    }
  }, [
    ready,
    busy,
    focused,
    appState,
    steps,
    view?.shownStories,
    goToStory,
  ]);

  function resetJourney() {
    return runAction(async () => {
      const prior = snapshot.current;

      snapshot.current = {
        ...prior,
        steps: 0,
        secondsActive: 0,
        hasCompleted: false,
        isTracking: false,
        shownStories: [],
      };

      // Save an explicit zero so old progress cannot return.
      await AsyncStorage.setItem(
        `journeyStats_${id}`,
        JSON.stringify({
          ...snapshot.current,
          schemaVersion: 2,
        })
      );

      await resetJourneyProgress(id);
      await persistNow();

      // Keep reward and checkpoint claim ledgers.
      Alert.alert(
        "Journey Reset",
        "Progress was reset. Previously claimed rewards were kept. Tap Resume Tracking to walk again."
      );
    });
  }

  function runJourneyTest() {
    if (!__DEV__) {
      return;
    }

    return runAction(async () => {
      snapshot.current.steps = Math.max(
        snapshot.current.steps,
        totalSteps - 100
      );

      snapshot.current.isTracking = false;

      await persistNow();
    });
  }

  async function awardPassportStamp() {
    const aliases = {
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
      aliases[id.toLowerCase()] ||
      id.toLowerCase();

    const raw = await AsyncStorage.getItem(
      "passportStamps"
    );

    const stamps = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(stamps)) {
      throw new Error("Passport data is invalid.");
    }

    await AsyncStorage.multiSet([
      [
        "passportStamps",
        JSON.stringify(
          [...new Set([...stamps, stampId])]
        ),
      ],
      [
        `passport_${id.toLowerCase()}`,
        "true",
      ],
    ]);
  }

  function completeJourney() {
    if (
      !snapshot.current ||
      snapshot.current.steps < totalSteps
    ) {
      Alert.alert(
        "Journey Not Complete",
        "Reach the full step goal before claiming rewards."
      );

      return;
    }

    return runAction(async () => {
      snapshot.current.isTracking = false;

      await persistNow();
      await awardReachedCheckpoints();

      const flags = Object.fromEntries(
        await AsyncStorage.multiGet([
          `journeyCompleted_${id}`,
          `journeyRewarded_${id}`,
        ])
      );

      const alreadyClaimed =
        snapshot.current.rewardsClaimed ||
        flags[`journeyCompleted_${id}`] === "true" ||
        flags[`journeyRewarded_${id}`] === "true";

      let earnedCoins = 0;
      let earnedPoints = 0;

      if (!alreadyClaimed) {
        const reward =
          await completeJourneyReward(id);

        if (reward?.awarded) {
          earnedCoins = nonnegative(
            reward.addedWCoins ??
              reward.walletResult?.added ??
              reward.reward?.wCoins
          );
        } else {
          throw new Error(
            "The reward service did not confirm an award. Check your wallet before retrying."
          );
        }

        const points = await addPoints({
          id: `journey_${id}_complete`,
          title: routeTitle,
          category: "Journey",
          points: nonnegative(
            currentJourney.rewardPoints ??
              journeyReward?.rewardPoints
          ),
          source: "Journey Complete",
          metadata: {
            journeyId: id,
          },
        });

        earnedPoints = nonnegative(
          points?.pointsAwarded
        );

        await AsyncStorage.multiSet([
          [`journeyCompleted_${id}`, "true"],
          [`journeyRewarded_${id}`, "true"],
        ]);
      }

      await completeJourneyProgress(id);
      await awardPassportStamp();

      snapshot.current.hasCompleted = true;
      snapshot.current.rewardsClaimed = true;

      await persistNow();

      Alert.alert(
        "Journey Complete!",
        alreadyClaimed
          ? "You completed this walk again. Your previously claimed rewards remain protected."
          : `WCoins earned: ${earnedCoins.toLocaleString()}\nLegathon points earned: ${earnedPoints.toLocaleString()}`
      );
    });
  }

  async function shareWalkProgress() {
    try {
      await Share.share({
        message:
          `I’m walking ${routeTitle} on Legathon Walk.\n\n` +
          `Steps: ${steps.toLocaleString()}\n` +
          `Distance: ${liveMiles.toFixed(2)} miles\n` +
          `Checkpoints reached: ${completedCheckpoints}/5\n\n` +
          "Join me on Legathon Walk.",
      });
    } catch (error) {
      Alert.alert(
        "Unable to Share",
        error.message || "Please try again."
      );
    }
  }

  if (!ready) {
    return (
      <View style={[styles.container, styles.content]}>
        <TouchableOpacity
          onPress={leave}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {routeTitle}
        </Text>

        <Text style={styles.subtitle}>
          {loadError || "Loading saved journey progress…"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      pointerEvents={busy ? "none" : "auto"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={saveAndExit}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>
          LIVE JOURNEY PROGRESS
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
            !isTracking && styles.statusBadgePaused,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              !isTracking && styles.statusBadgeTextPaused,
            ]}
          >
            {progress >= 100
              ? "● Journey Goal Reached"
              : busy
                ? "● Saving Progress"
                : view.isTracking &&
                    !sensorReady &&
                    focused &&
                    appState === "active"
                  ? "● Starting Tracking"
                  : view.isTracking &&
                      sensorReady &&
                      focused &&
                      appState === "active"
                    ? `● ${walkingStatus}`
                    : "● Tracking Paused"}
          </Text>
        </View>

        <Text style={styles.autoSaveText}>
          {lastSavedAt
            ? `Auto-saved ${lastSavedAt.toLocaleTimeString()}`
            : "Auto-save ready"}
        </Text>
      </View>

      {!!(saveError || sensorError) && (
        <Text
          style={[
            styles.subtitle,
            {
              color: "#FFC747",
              marginBottom: 14,
            },
          ]}
          accessibilityRole="alert"
        >
          {saveError || sensorError}
        </Text>
      )}

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
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            Journey Progress
          </Text>

          <Text style={styles.progressPercent}>
            {progress.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressRemaining}>
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
          <View style={styles.routeProgressTrack}>
            <View
              style={[
                styles.routeProgressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
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
              style={styles.movingShoeImage}
            />
          </View>

          <View style={styles.checkpointTrack}>
            {checkpoints.map((point, index) => (
              <View
                key={point.id}
                style={[
                  styles.checkpoint,
                  {
                    left: markerPositions[index],
                  },
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
                  <Text style={styles.checkNumber}>
                    {point.id === 5 ? "🏁" : point.id}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Journey Summary
        </Text>

        <SummaryRow
          label="Progress"
          value={`${progress.toFixed(2)}%`}
        />

        <SummaryRow
          label="Completed Checkpoints"
          value={`${completedCheckpoints}/5`}
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
        <Text style={styles.rewardsTitle}>
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
          value={
            hasCompleted
              ? "✓ Unlocked"
              : "Unlocks on completion"
          }
          reward
        />

        <SummaryRow
          label="Certificate"
          value={
            hasCompleted
              ? "✓ Earned"
              : "Earned on completion"
          }
          reward
        />
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>
          Journey Checkpoints
        </Text>

        {checkpoints.map(point => (
          <TouchableOpacity
            key={point.id}
            style={styles.historyRow}
            disabled={!point.complete && !point.active}
            onPress={() => {
              if (point.complete || point.active) {
                openCheckpointStory(point.id);
              }
            }}
          >
            <Text style={styles.historyIcon}>
              {point.complete
                ? "✅"
                : point.active
                  ? "🟡"
                  : "○"}
            </Text>

            <Text style={styles.historyText}>
              {point.id}. {point.title}
            </Text>

            {point.complete && (
              <Text style={styles.reachedText}>
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
          <Text style={styles.testButtonText}>
            🧪 DEV: Jump Near Finish
          </Text>
        </TouchableOpacity>
      )}

      {progress >= 100 && !hasCompleted && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={completeJourney}
        >
          <Text style={styles.completeButtonText}>
            Complete Journey and Claim Rewards
          </Text>
        </TouchableOpacity>
      )}

      {hasCompleted && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedBannerText}>
            🏆 Journey Completed
          </Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={toggleTracking}
        >
          <Text style={styles.secondaryText}>
            {view.isTracking
              ? "Pause Tracking"
              : "Resume Tracking"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={saveAndExit}
        >
          <Text style={styles.secondaryText}>
            Save and Exit
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.shareWalkButton}
        onPress={shareWalkProgress}
      >
        <Text style={styles.shareWalkText}>
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
                style: "destructive",
                onPress: resetJourney,
              },
            ]
          );
        }}
      >
        <Text style={styles.resetButtonText}>
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
    backgroundColor: "rgba(182,255,216,0.12)",
    borderColor: "rgba(182,255,216,0.35)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 12,
  },
  statusBadgePaused: {
    backgroundColor: "rgba(255,199,71,0.12)",
    borderColor: "rgba(255,199,71,0.40)",
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
    borderColor: "rgba(212,175,55,0.25)",
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
    borderColor: "rgba(212,175,55,0.35)",
  },
  routeImage: {
    resizeMode: "cover",
  },
  routeOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    paddingBottom: 36,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  routeProgressTrack: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: 130,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
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
    borderColor: "rgba(212,175,55,0.25)",
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
    minHeight: 50,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
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
    backgroundColor: "rgba(182,255,216,0.14)",
    borderWidth: 1,
    borderColor: "rgba(182,255,216,0.45)",
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
    borderColor: "rgba(255,182,193,0.25)",
  },
  resetButtonText: {
    color: "#FFB6C1",
    fontSize: 15,
    fontWeight: "900",
  },
});