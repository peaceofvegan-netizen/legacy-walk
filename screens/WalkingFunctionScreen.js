// screens/WalkingFunctionScreen.js

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useStepCounter } from "../hooks/useStepCounter";


// ============================================================
// LEGATHON WALK — WALKING FUNCTION
// ============================================================
//
// Walking Analytics = How much am I walking?
//
// Walking Function = How am I walking?
//
// Includes:
// • Live walking session
// • Pace
// • Speed
// • Cadence
// • Distance
// • Walking time
// • Personal baseline
// • 7-day pace
// • 30-day pace
// • Pace consistency
// • Endurance
// • Walking Function Score
// • Improving / Stable / Slower trend
// • Persistent walking history
// • Local AI-style mobility insights
//
// Does NOT include:
// • Heart rate
// • WCoins
// • Rewards
// • Medical diagnosis
//
// ============================================================


const STEPS_PER_MILE = 2000;

const WALK_HISTORY_STORAGE_KEY =
  "@legathon_walk_function_history_v2";

const MAX_HISTORY_RECORDS = 365;

const MIN_SAVE_STEPS = 100;

const MIN_FUNCTION_SESSIONS = 3;

const MIN_PACE_ANALYSIS_STEPS = 500;

// ============================================================
// BASIC HELPERS
// ============================================================

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


const clamp = (value, min, max) => {
  return Math.min(
    Math.max(value, min),
    max
  );
};


const average = (values = []) => {
  const valid = values.filter(
    (value) =>
      Number.isFinite(value) &&
      value > 0
  );

  if (!valid.length) {
    return 0;
  }

  return (
    valid.reduce(
      (total, value) =>
        total + value,
      0
    ) / valid.length
  );
};


// ============================================================
// DATE HELPERS
// ============================================================

const normalizeDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return date;
};


const startOfDay = (date) => {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};


const getDateDaysAgo = (days) => {
  const date =
    startOfDay(new Date());

  date.setDate(
    date.getDate() - days
  );

  return date;
};


const withinLastDays = (
  dateValue,
  days
) => {
  const date =
    normalizeDate(dateValue);

  if (!date) {
    return false;
  }

  return (
    date >=
    getDateDaysAgo(days - 1)
  );
};


// ============================================================
// PACE HELPERS
// ============================================================

const calculatePace = (
  distanceMiles,
  durationMinutes
) => {
  const miles =
    safeNumber(distanceMiles);

  const minutes =
    safeNumber(durationMinutes);

  if (
    miles <= 0 ||
    minutes <= 0
  ) {
    return 0;
  }

  return minutes / miles;
};


const calculateSpeed = (
  distanceMiles,
  durationMinutes
) => {
  const miles =
    safeNumber(distanceMiles);

  const minutes =
    safeNumber(durationMinutes);

  if (
    miles <= 0 ||
    minutes <= 0
  ) {
    return 0;
  }

  return (
    miles /
    (minutes / 60)
  );
};


const formatPace = (pace) => {
  if (
    !Number.isFinite(pace) ||
    pace <= 0
  ) {
    return "--:--";
  }

  let minutes =
    Math.floor(pace);

  let seconds =
    Math.round(
      (pace - minutes) * 60
    );

  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  return (
    `${minutes}:` +
    `${String(seconds).padStart(
      2,
      "0"
    )}`
  );
};


const formatTime = (
  totalSeconds
) => {
  const seconds =
    Math.max(
      0,
      Math.floor(
        safeNumber(totalSeconds)
      )
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const remainingSeconds =
    seconds % 60;

  if (hours > 0) {
    return (
      `${hours}:` +
      `${String(minutes).padStart(
        2,
        "0"
      )}:` +
      `${String(
        remainingSeconds
      ).padStart(2, "0")}`
    );
  }

  return (
    `${minutes}:` +
    `${String(
      remainingSeconds
    ).padStart(2, "0")}`
  );
};


// ============================================================
// HISTORY NORMALIZATION
// ============================================================

const normalizeWalk = (
  walk = {}
) => {
  const steps =
    safeNumber(walk.steps);

  const distanceMiles =
    safeNumber(
      walk.distanceMiles
    );

  const durationMinutes =
    safeNumber(
      walk.durationMinutes
    );

  const pace =
    safeNumber(walk.pace) ||
    calculatePace(
      distanceMiles,
      durationMinutes
    );

  const speedMph =
    safeNumber(
      walk.speedMph
    ) ||
    calculateSpeed(
      distanceMiles,
      durationMinutes
    );

  const cadence =
    safeNumber(
      walk.cadence
    ) ||
    (
      durationMinutes > 0
        ? steps /
          durationMinutes
        : 0
    );

  return {
    ...walk,

    id:
      walk.id ||
      `walk_${walk.date || Date.now()}`,

    date:
      walk.date || null,

    steps,

    distanceMiles,

    durationMinutes,

    pace,

    speedMph,

    cadence,
  };
};


// ============================================================
// CONSISTENCY
// ============================================================

const calculateConsistency = (
  paces = []
) => {
  const valid =
    paces.filter(
      (pace) =>
        Number.isFinite(pace) &&
        pace > 0
    );

  if (valid.length < 2) {
    return null;
  }

  const mean =
    average(valid);

  if (!mean) {
    return null;
  }

  const variance =
    valid.reduce(
      (total, pace) => {
        return (
          total +
          Math.pow(
            pace - mean,
            2
          )
        );
      },
      0
    ) / valid.length;

  const standardDeviation =
    Math.sqrt(variance);

  const coefficient =
    standardDeviation / mean;

  return clamp(
    Math.round(
      100 -
      coefficient * 180
    ),
    0,
    100
  );
};


// ============================================================
// ENDURANCE
// ============================================================

const calculateEndurance = (
  walks = []
) => {
  const durations =
    walks
      .map(
        (walk) =>
          safeNumber(
            walk.durationMinutes
          )
      )
      .filter(
        (minutes) =>
          minutes > 0
      );

  if (!durations.length) {
    return {
      averageMinutes: 0,
      longestMinutes: 0,
    };
  }

  return {
    averageMinutes:
      Math.round(
        average(durations)
      ),

    longestMinutes:
      Math.round(
        Math.max(
          ...durations
        )
      ),
  };
};


// ============================================================
// FUNCTION SCORE
// ============================================================

const calculateFunctionScore = ({
  recentWalks,
  recentPace,
  baselinePace,
  consistency,
  endurance,
}) => {
  if (
    recentWalks.length <
    MIN_FUNCTION_SESSIONS
  ) {
    return null;
  }

  let score = 50;


  // PERSONAL PACE CHANGE
  // Lower min/mile = faster.

  if (
    recentPace > 0 &&
    baselinePace > 0
  ) {
    const improvement =
      (
        (
          baselinePace -
          recentPace
        ) /
        baselinePace
      ) * 100;

    score += clamp(
      improvement * 1.5,
      -15,
      15
    );
  }


  // PACE CONSISTENCY

  if (
    consistency !== null
  ) {
    score +=
      (
        (
          consistency - 50
        ) /
        50
      ) * 15;
  }


  // ENDURANCE

  if (
    endurance.averageMinutes >= 45
  ) {
    score += 10;
  } else if (
    endurance.averageMinutes >= 30
  ) {
    score += 7;
  } else if (
    endurance.averageMinutes >= 20
  ) {
    score += 4;
  }


  // SESSION CONSISTENCY

  if (
    recentWalks.length >= 10
  ) {
    score += 10;
  } else if (
    recentWalks.length >= 7
  ) {
    score += 8;
  } else if (
    recentWalks.length >= 5
  ) {
    score += 5;
  } else {
    score += 2;
  }


  return clamp(
    Math.round(score),
    0,
    100
  );
};


const getFunctionLabel = (
  score
) => {
  if (score === null) {
    return "Building Baseline";
  }

  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Strong";
  }

  if (score >= 55) {
    return "Steady";
  }

  if (score >= 40) {
    return "Developing";
  }

  return "Watch Your Trend";
};


// ============================================================
// TREND
// ============================================================

const getPaceTrend = ({
  recentPace,
  baselinePace,
  recentCount,
  baselineCount,
}) => {
  if (
    recentCount < 2 ||
    baselineCount < 3 ||
    recentPace <= 0 ||
    baselinePace <= 0
  ) {
    return {
      status:
        "Building Baseline",

      symbol: "→",

      percent: 0,

      message:
        "Keep walking. Legathon is building your personal walking baseline.",
    };
  }


  const percentChange =
    (
      (
        baselinePace -
        recentPace
      ) /
      baselinePace
    ) * 100;


  if (percentChange >= 5) {
    return {
      status: "Improving",

      symbol: "↑",

      percent:
        Math.abs(
          percentChange
        ),

      message:
        "Your recent walking pace is faster than your personal baseline.",
    };
  }


  if (percentChange <= -5) {
    return {
      status:
        "Slower Than Baseline",

      symbol: "↓",

      percent:
        Math.abs(
          percentChange
        ),

      message:
        "Your recent walking pace is slower than your personal baseline.",
    };
  }


  return {
    status: "Stable",

    symbol: "→",

    percent:
      Math.abs(
        percentChange
      ),

    message:
      "Your recent walking pace is staying close to your personal baseline.",
  };
};


// ============================================================
// AI-STYLE INSIGHT ENGINE
// ============================================================
//
// This is a local interpretation layer.
// It does NOT make a medical diagnosis.
//
// A future remote AI service can receive these same calculated
// metrics and provide richer conversational coaching.
//
// ============================================================

const createWalkingInsight = ({
  trend,
  consistency,
  endurance,
  functionScore,
  recentWalks,
}) => {
  if (
    recentWalks.length <
    MIN_FUNCTION_SESSIONS
  ) {
    return (
      "Legathon is learning your walking pattern. " +
      "Complete more walking sessions to establish your " +
      "personal pace, endurance and consistency baseline."
    );
  }

  const messages = [];


  if (
    trend.status ===
    "Improving"
  ) {
    messages.push(
      `Your recent walking pace has improved by approximately ${trend.percent.toFixed(
        1
      )}% compared with your personal baseline.`
    );
  }


  if (
    trend.status === "Stable"
  ) {
    messages.push(
      "Your recent walking pace is staying relatively consistent with your personal baseline."
    );
  }


  if (
    trend.status ===
    "Slower Than Baseline"
  ) {
    messages.push(
      `Your recent walking pace is approximately ${trend.percent.toFixed(
        1
      )}% slower than your personal baseline.`
    );
  }


  if (
    consistency !== null &&
    consistency >= 80
  ) {
    messages.push(
      "Your pace has also been very consistent across recent walks."
    );
  } else if (
    consistency !== null &&
    consistency < 55
  ) {
    messages.push(
      "Your pace has varied more between recent walking sessions."
    );
  }


  if (
    endurance.averageMinutes >= 30
  ) {
    messages.push(
      `Your recent walks average about ${endurance.averageMinutes} minutes, giving Legathon a useful endurance trend.`
    );
  }


  if (
    functionScore !== null &&
    functionScore >= 70
  ) {
    messages.push(
      "Your overall Walking Function pattern is currently strong relative to your established Legathon baseline."
    );
  }


  return (
    messages.join(" ") ||
    "Continue walking to strengthen your personal Walking Function trend."
  );
};


// ============================================================
// COMPONENT
// ============================================================

export default function WalkingFunctionScreen({
  walkHistory = [],

  todaySteps = 0,

  goBack,

 

  



 
}) {


  // ==========================================================
  // LIVE PEDOMETER
  // ==========================================================

  const {
    steps: liveSteps,
    miles: liveMiles,
    isAvailable: pedometerAvailable,
  } = useStepCounter();


  const currentSteps =
    safeNumber(liveSteps) > 0
      ? safeNumber(liveSteps)
      : safeNumber(todaySteps);


  // ==========================================================
  // SESSION STATE
  // ==========================================================

  const [
    sessionStatus,
    setSessionStatus,
  ] = useState("idle");

  // idle | walking | paused


  const [
    sessionSeconds,
    setSessionSeconds,
  ] = useState(0);


  const [
    savedWalkHistory,
    setSavedWalkHistory,
  ] = useState([]);


  const [
    historyLoaded,
    setHistoryLoaded,
  ] = useState(false);


  const sessionStartStepsRef =
    useRef(0);


  const pauseStartStepsRef =
    useRef(null);


  const pausedStepOffsetRef =
    useRef(0);


  // ==========================================================
  // LOAD HISTORY
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadHistory =
      async () => {
        try {
          const stored =
            await AsyncStorage.getItem(
              WALK_HISTORY_STORAGE_KEY
            );

          if (!mounted) {
            return;
          }

          if (stored) {
            const parsed =
              JSON.parse(stored);

            setSavedWalkHistory(
              Array.isArray(parsed)
                ? parsed
                : []
            );
          }
        } catch (error) {
          console.log(
            "Walking Function history load error:",
            error
          );
        } finally {
          if (mounted) {
            setHistoryLoaded(true);
          }
        }
      };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);


  // ==========================================================
  // SESSION TIMER
  // ==========================================================

  useEffect(() => {
    if (
      sessionStatus !==
      "walking"
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setSessionSeconds(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [sessionStatus]);


  // ==========================================================
  // SESSION CALCULATIONS
  // ==========================================================

  const rawSessionSteps =
    Math.max(
      0,
      currentSteps -
      sessionStartStepsRef.current
    );


  const sessionSteps =
    sessionStatus === "idle"
      ? 0
      : Math.max(
          0,
          rawSessionSteps -
          pausedStepOffsetRef.current
        );


  const sessionMiles =
    sessionSteps /
    STEPS_PER_MILE;


  const sessionMinutes =
    sessionSeconds / 60;


  const livePace =
    calculatePace(
      sessionMiles,
      sessionMinutes
    );


  const liveSpeed =
    calculateSpeed(
      sessionMiles,
      sessionMinutes
    );


  const liveCadence =
    sessionMinutes > 0
      ? sessionSteps /
        sessionMinutes
      : 0;


  // ==========================================================
  // START
  // ==========================================================

  const startWalkingSession =
    () => {
      sessionStartStepsRef.current =
        currentSteps;

      pausedStepOffsetRef.current =
        0;

      pauseStartStepsRef.current =
        null;

      setSessionSeconds(0);

      setSessionStatus(
        "walking"
      );
    };


  // ==========================================================
  // PAUSE
  // ==========================================================

  const pauseWalkingSession =
    () => {
      if (
        sessionStatus !==
        "walking"
      ) {
        return;
      }

      pauseStartStepsRef.current =
        currentSteps;

      setSessionStatus(
        "paused"
      );
    };


  // ==========================================================
  // RESUME
  // ==========================================================

  const resumeWalkingSession =
    () => {
      if (
        sessionStatus !==
        "paused"
      ) {
        return;
      }

      if (
        pauseStartStepsRef.current !==
        null
      ) {
        const stepsWhilePaused =
          Math.max(
            0,
            currentSteps -
            pauseStartStepsRef.current
          );

        pausedStepOffsetRef.current +=
          stepsWhilePaused;
      }

      pauseStartStepsRef.current =
        null;

      setSessionStatus(
        "walking"
      );
    };


  // ==========================================================
  // RESET SESSION
  // ==========================================================

  const resetSession =
    () => {
      setSessionStatus(
        "idle"
      );

      setSessionSeconds(0);

      sessionStartStepsRef.current =
        currentSteps;

      pauseStartStepsRef.current =
        null;

      pausedStepOffsetRef.current =
        0;
    };


  // ==========================================================
  // FINISH + SAVE
  // ==========================================================

  const finishWalkingSession =
    async () => {
      if (
        sessionStatus ===
        "idle"
      ) {
        return;
      }


      let finalSessionSteps =
        sessionSteps;


      // If finishing while paused,
      // exclude steps accumulated during pause.

      if (
        sessionStatus ===
          "paused" &&
        pauseStartStepsRef.current !==
          null
      ) {
        const stepsDuringPause =
          Math.max(
            0,
            currentSteps -
            pauseStartStepsRef.current
          );

        finalSessionSteps =
          Math.max(
            0,
            sessionSteps -
            stepsDuringPause
          );
      }


      const finalMiles =
        finalSessionSteps /
        STEPS_PER_MILE;


      const finalMinutes =
        sessionSeconds / 60;


      if (
        finalSessionSteps <
          MIN_SAVE_STEPS ||
        finalMiles <= 0 ||
        finalMinutes <= 0
      ) {
        Alert.alert(
          "Walk Too Short",
          "Walk at least 100 steps before saving a Walking Function session."
        );

        return;
      }


      const finalPace =
        calculatePace(
          finalMiles,
          finalMinutes
        );


      const finalSpeed =
        calculateSpeed(
          finalMiles,
          finalMinutes
        );


      const finalCadence =
        finalMinutes > 0
          ? finalSessionSteps /
            finalMinutes
          : 0;


      const completedWalk = {
        id:
          `walk_${Date.now()}`,

        date:
          new Date().toISOString(),

        steps:
          Math.round(
            finalSessionSteps
          ),

        distanceMiles:
          Number(
            finalMiles.toFixed(
              3
            )
          ),

        durationMinutes:
          Number(
            finalMinutes.toFixed(
              2
            )
          ),

        pace:
          Number(
            finalPace.toFixed(
              2
            )
          ),

        speedMph:
          Number(
            finalSpeed.toFixed(
              2
            )
          ),

        cadence:
          Math.round(
            finalCadence
          ),
      };


      try {
        const updatedHistory = [
          completedWalk,
          ...savedWalkHistory,
        ].slice(
          0,
          MAX_HISTORY_RECORDS
        );


        await AsyncStorage.setItem(
          WALK_HISTORY_STORAGE_KEY,
          JSON.stringify(
            updatedHistory
          )
        );


        setSavedWalkHistory(
          updatedHistory
        );


        Alert.alert(
          "Walk Saved",
          "Your Walking Function session has been added to your personal pace history."
        );


        resetSession();

      } catch (error) {
        console.log(
          "Walking Function save error:",
          error
        );

        Alert.alert(
          "Unable to Save",
          "Legathon could not save this walking session."
        );
      }
    };


  // ==========================================================
  // NORMALIZED HISTORY
  // ==========================================================

  const normalizedHistory =
    useMemo(() => {
      const incoming =
        Array.isArray(
          walkHistory
        )
          ? walkHistory
          : [];


      const local =
        Array.isArray(
          savedWalkHistory
        )
          ? savedWalkHistory
          : [];


      const combined = [
        ...incoming,
        ...local,
      ];


      const seen =
        new Set();


      return combined
        .map(normalizeWalk)

        .filter((walk) => {
          if (
            walk.steps <= 0 &&
            walk.distanceMiles <= 0 &&
            walk.durationMinutes <= 0
          ) {
            return false;
          }


          const key =
            walk.id ||
            `${walk.date}-${walk.steps}-${walk.durationMinutes}`;


          if (
            seen.has(key)
          ) {
            return false;
          }


          seen.add(key);

          return true;
        })

        .sort((a, b) => {
          const aTime =
            normalizeDate(
              a.date
            )?.getTime() || 0;

          const bTime =
            normalizeDate(
              b.date
            )?.getTime() || 0;

          return (
            bTime - aTime
          );
        });

    }, [
      walkHistory,
      savedWalkHistory,
    ]);


  // ==========================================================
  // 7 DAY
  // ==========================================================

  const sevenDayHistory =
  useMemo(() => {
    return normalizedHistory.filter(
      (walk) =>
        walk.steps >= 500 &&
        walk.pace > 0 &&
        withinLastDays(
          walk.date,
          7
        )
    );
  }, [
    normalizedHistory,
  ]);


  // ==========================================================
  // 30 DAY
  // ==========================================================

 const thirtyDayHistory =
  useMemo(() => {
    return normalizedHistory.filter(
      (walk) =>
        walk.steps >= 500 &&
        walk.pace > 0 &&
        withinLastDays(
          walk.date,
          30
        )
    );
  }, [
    normalizedHistory,
  ]);


  // ==========================================================
  // BASELINE HISTORY
  // 8–30 DAYS
  // ==========================================================

  const baselineHistory =
    useMemo(() => {
      const sevenDaysAgo =
        getDateDaysAgo(7);

      const thirtyDaysAgo =
        getDateDaysAgo(30);


      return normalizedHistory.filter(
        (walk) => {
          const date =
            normalizeDate(
              walk.date
            );

          if (!date) {
            return false;
          }

          return (
            date < sevenDaysAgo &&
            date >= thirtyDaysAgo
          );
        }
      );
    }, [
      normalizedHistory,
    ]);


  // ==========================================================
  // AVERAGES
  // ==========================================================

  const sevenDayPace =
    useMemo(() => {
      return average(
        sevenDayHistory.map(
          (walk) =>
            walk.pace
        )
      );
    }, [
      sevenDayHistory,
    ]);


  const thirtyDayPace =
    useMemo(() => {
      return average(
        thirtyDayHistory.map(
          (walk) =>
            walk.pace
        )
      );
    }, [
      thirtyDayHistory,
    ]);


  const baselinePace =
  useMemo(() => {
    const historicalBaseline =
      average(
        baselineHistory.map(
          (walk) => walk.pace
        )
      );

    // Use the true 8–30 day personal baseline
    // once enough historical sessions exist.
    if (
      baselineHistory.length >= MIN_FUNCTION_SESSIONS &&
      historicalBaseline > 0
    ) {
      return historicalBaseline;
    }

    // Do not compare recent walks against themselves.
    // Until enough historical data exists,
    // the user's baseline is still being built.
    return 0;
  }, [
    baselineHistory,
  ]);


  // ==========================================================
  // TREND
  // ==========================================================

  const paceTrend =
    useMemo(() => {
      return getPaceTrend({
        recentPace:
          sevenDayPace,

        baselinePace,

        recentCount:
          sevenDayHistory.length,

        baselineCount:
          baselineHistory.length ||
          thirtyDayHistory.length,
      });
    }, [
      sevenDayPace,
      baselinePace,
      sevenDayHistory,
      baselineHistory,
      thirtyDayHistory,
    ]);


  // ==========================================================
  // CONSISTENCY
  // ==========================================================

  const consistency =
    useMemo(() => {
      return calculateConsistency(
        thirtyDayHistory.map(
          (walk) =>
            walk.pace
        )
      );
    }, [
      thirtyDayHistory,
    ]);


  // ==========================================================
  // ENDURANCE
  // ==========================================================

  const endurance =
    useMemo(() => {
      return calculateEndurance(
        thirtyDayHistory
      );
    }, [
      thirtyDayHistory,
    ]);


  // ==========================================================
  // FUNCTION SCORE
  // ==========================================================

  const functionScore =
    useMemo(() => {
      return calculateFunctionScore({
        recentWalks:
          thirtyDayHistory,

        recentPace:
          sevenDayPace ||
          thirtyDayPace,

        baselinePace,

        consistency,

        endurance,
      });
    }, [
      thirtyDayHistory,
      sevenDayPace,
      thirtyDayPace,
      baselinePace,
      consistency,
      endurance,
    ]);


  const functionLabel =
    getFunctionLabel(
      functionScore
    );


  // ==========================================================
  // AI INSIGHT
  // ==========================================================

  const aiInsight =
    useMemo(() => {
      return createWalkingInsight({
        trend:
          paceTrend,

        consistency,

        endurance,

        functionScore,

        recentWalks:
          thirtyDayHistory,
      });
    }, [
      paceTrend,
      consistency,
      endurance,
      functionScore,
      thirtyDayHistory,
    ]);


  // ==========================================================
  // SESSION STATUS
  // ==========================================================

  const sessionLabel =
    sessionStatus === "walking"
      ? "WALKING"
      : sessionStatus === "paused"
      ? "PAUSED"
      : "READY";


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.safe}
    >

      <ScrollView
        style={
          styles.container
        }

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        {/* BACK */}

        <TouchableOpacity
          style={
            styles.backButton
          }

          onPress={goBack}

          activeOpacity={0.8}
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹ Back
          </Text>
        </TouchableOpacity>


        {/* HEADER */}

        <Text
          style={
            styles.eyebrow
          }
        >
          LEGATHON WALK
        </Text>


        <Text
          style={
            styles.title
          }
        >
          Walking{"\n"}Function
        </Text>


        <Text
          style={
            styles.subtitle
          }
        >
          Understand your pace,
          consistency, endurance and
          walking trends over time.
        </Text>


        {/* DEVICE STATUS */}

        {!pedometerAvailable && (
          <View
            style={
              styles.noticeCard
            }
          >
            <Text
              style={
                styles.noticeTitle
              }
            >
              Step Tracking
            </Text>

            <Text
              style={
                styles.noticeText
              }
            >
              Live pedometer data is
              unavailable on this
              device. Historical
              Walking Function data
              can still be displayed.
            </Text>
          </View>
        )}


        {/* =============================================== */}
        {/* FUNCTION SCORE */}
        {/* =============================================== */}

        <View
          style={
            styles.scoreCard
          }
        >

          <View
            style={
              styles.rowBetween
            }
          >

            <View
              style={{ flex: 1 }}
            >
              <Text
                style={
                  styles.cardEyebrow
                }
              >
                WALKING FUNCTION SCORE
              </Text>

              <Text
                style={
                  styles.functionLabel
                }
              >
                {functionLabel}
              </Text>
            </View>


            <Text
              style={
                styles.scoreNumber
              }
            >
              {functionScore !== null
                ? functionScore
                : "--"}
            </Text>

          </View>


          <View
            style={
              styles.progressTrack
            }
          >
            <View
              style={[
                styles.progressFill,

                {
                  width:
                    `${functionScore || 0}%`,
                },
              ]}
            />
          </View>


          <Text
            style={
              styles.helperText
            }
          >
            {functionScore !== null
              ? "Based on your personal pace, consistency, endurance and recent walking history."
              : "Complete more walking sessions to establish your personal Walking Function baseline."}
          </Text>

        </View>


        {/* =============================================== */}
        {/* LIVE WALK */}
        {/* =============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Live Walking Pace
        </Text>


        <View
          style={
            styles.liveCard
          }
        >

          <View
            style={
              styles.liveHeader
            }
          >

            <View>
              <Text
                style={
                  styles.cardEyebrow
                }
              >
                CURRENT SESSION
              </Text>

              <Text
                style={
                  styles.liveTitle
                }
              >
                Walking Pace
              </Text>
            </View>


            <View
              style={[
                styles.statusBadge,

                sessionStatus ===
                "walking"
                  ? styles.statusWalking
                  : sessionStatus ===
                    "paused"
                  ? styles.statusPaused
                  : styles.statusReady,
              ]}
            >
              <Text
                style={
                  styles.statusText
                }
              >
                ● {sessionLabel}
              </Text>
            </View>

          </View>


          <View
            style={
              styles.paceCenter
            }
          >
            <Text
              style={
                styles.paceNumber
              }
            >
              {formatPace(
                livePace
              )}
            </Text>

            <Text
              style={
                styles.paceUnit
              }
            >
              MIN / MILE
            </Text>
          </View>


          <View
            style={
              styles.metricGrid
            }
          >

            <MetricCard
              label="SPEED"
              value={
                liveSpeed > 0
                  ? liveSpeed.toFixed(1)
                  : "0.0"
              }
              unit="MPH"
            />


            <MetricCard
              label="CADENCE"
              value={
                liveCadence > 0
                  ? Math.round(
                      liveCadence
                    )
                  : 0
              }
              unit="STEPS / MIN"
            />


            <MetricCard
              label="STEPS"
              value={
                sessionSteps.toLocaleString()
              }
              unit="SESSION"
            />


            <MetricCard
              label="DISTANCE"
              value={
                sessionMiles.toFixed(
                  2
                )
              }
              unit="MILES"
            />

          </View>


          <View
            style={
              styles.timeRow
            }
          >
            <Text
              style={
                styles.timeLabel
              }
            >
              Walking Time
            </Text>

            <Text
              style={
                styles.timeValue
              }
            >
              {formatTime(
                sessionSeconds
              )}
            </Text>
          </View>


          {/* CONTROLS */}

          <View
            style={
              styles.controls
            }
          >

            {sessionStatus ===
              "idle" && (

              <TouchableOpacity
                style={
                  styles.primaryButton
                }

                onPress={
                  startWalkingSession
                }
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  START WALK
                </Text>
              </TouchableOpacity>

            )}


            {sessionStatus ===
              "walking" && (
              <>

                <TouchableOpacity
                  style={
                    styles.secondaryButton
                  }

                  onPress={
                    pauseWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.secondaryButtonText
                    }
                  >
                    PAUSE
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.finishButton
                  }

                  onPress={
                    finishWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.finishButtonText
                    }
                  >
                    FINISH
                  </Text>
                </TouchableOpacity>

              </>
            )}


            {sessionStatus ===
              "paused" && (
              <>

                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }

                  onPress={
                    resumeWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    RESUME
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.finishButton
                  }

                  onPress={
                    finishWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.finishButtonText
                    }
                  >
                    FINISH
                  </Text>
                </TouchableOpacity>

              </>
            )}

          </View>

        </View>


        {/* =============================================== */}
        {/* PERSONAL PACE TREND */}
        {/* =============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Personal Pace Trend
        </Text>


        <View
          style={
            styles.trendCard
          }
        >

          <View
            style={
              styles.trendTop
            }
          >

            <Text
              style={
                styles.trendSymbol
              }
            >
              {paceTrend.symbol}
            </Text>


            <View
              style={{ flex: 1 }}
            >

              <Text
                style={
                  styles.trendTitle
                }
              >
                {paceTrend.status}
              </Text>


              {paceTrend.percent >
                0 && (
                <Text
                  style={
                    styles.trendPercent
                  }
                >
                  {paceTrend.percent.toFixed(
                    1
                  )}
                  % change
                </Text>
              )}

            </View>

          </View>


          <Text
            style={
              styles.trendDescription
            }
          >
            {paceTrend.message}
          </Text>


          <View
            style={
              styles.averageRow
            }
          >

            <AverageCard
              label="7-DAY AVG"
              value={
                formatPace(
                  sevenDayPace
                )
              }
            />


            <AverageCard
              label="30-DAY AVG"
              value={
                formatPace(
                  thirtyDayPace
                )
              }
            />

          </View>


          <Text
            style={
              styles.sessionCount
            }
          >
            {
              thirtyDayHistory.length
            }{" "}
            qualifying walking
            sessions in the last
            30 days
          </Text>

        </View>


        {/* =============================================== */}
        {/* MOBILITY INDICATORS */}
        {/* =============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Mobility Indicators
        </Text>


        <View
          style={
            styles.indicatorCard
          }
        >

          <Text
            style={
              styles.cardEyebrow
            }
          >
            PACE CONSISTENCY
          </Text>


          <View
            style={
              styles.rowBetween
            }
          >

            <Text
              style={
                styles.indicatorNumber
              }
            >
              {consistency !== null
                ? `${consistency}%`
                : "--"}
            </Text>


            <Text
              style={
                styles.indicatorStatus
              }
            >
              {consistency === null
                ? "Building"
                : consistency >= 80
                ? "Very Steady"
                : consistency >= 60
                ? "Steady"
                : "Variable"}
            </Text>

          </View>


          <Text
            style={
              styles.helperText
            }
          >
            Shows how consistently
            you maintain your pace
            across recent walking
            sessions.
          </Text>

        </View>


        <View
          style={
            styles.indicatorCard
          }
        >

          <Text
            style={
              styles.cardEyebrow
            }
          >
            WALKING ENDURANCE
          </Text>


          <View
            style={
              styles.enduranceRow
            }
          >

            <View>
              <Text
                style={
                  styles.indicatorNumber
                }
              >
                {endurance.averageMinutes ||
                  "--"}
              </Text>

              <Text
                style={
                  styles.indicatorUnit
                }
              >
                AVG MINUTES
              </Text>
            </View>


            <View
              style={
                styles.enduranceRight
              }
            >
              <Text
                style={
                  styles.indicatorNumber
                }
              >
                {endurance.longestMinutes ||
                  "--"}
              </Text>

              <Text
                style={
                  styles.indicatorUnit
                }
              >
                LONGEST WALK
              </Text>
            </View>

          </View>

        </View>


        {/* =============================================== */}
        {/* PERSONAL BASELINE */}
        {/* =============================================== */}

        <View
          style={
            styles.baselineCard
          }
        >

          <Text
            style={
              styles.goldEyebrow
            }
          >
            PERSONAL BASELINE
          </Text>


          <Text
            style={
              styles.baselineTitle
            }
          >
            Your Walking Pattern
          </Text>


          <Text
            style={
              styles.baselineNumber
            }
          >
            {formatPace(
              baselinePace
            )}
          </Text>


          <Text
            style={
              styles.baselineUnit
            }
          >
            BASELINE MIN / MILE
          </Text>


          <Text
            style={
              styles.helperText
            }
          >
            Legathon compares your
            recent walking against
            your own established
            pattern rather than
            judging everyone by one
            universal walking speed.
          </Text>

        </View>


        {/* =============================================== */}
        {/* AI MOBILITY INSIGHT */}
        {/* =============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          AI Mobility Insight
        </Text>


        <View
          style={
            styles.aiCard
          }
        >

          <View
            style={
              styles.aiHeader
            }
          >

            <View
              style={
                styles.aiCircle
              }
            >
              <Text
                style={
                  styles.aiCircleText
                }
              >
                AI
              </Text>
            </View>


            <View
              style={{ flex: 1 }}
            >

              <Text
                style={
                  styles.aiEyebrow
                }
              >
                LEGATHON AI
              </Text>

              <Text
                style={
                  styles.aiTitle
                }
              >
                Walking Insight
              </Text>

            </View>

          </View>


          <Text
            style={
              styles.aiText
            }
          >
            {aiInsight}
          </Text>


          <View
            style={
              styles.aiDivider
            }
          />


          <Text
            style={
              styles.disclaimer
            }
          >
            Walking Function provides
            wellness and activity
            insights from your
            Legathon walking data.
            It is not a medical
            diagnosis or clinical
            assessment.
          </Text>

        </View>


        {/* =============================================== */}
        {/* RECENT WALKS */}
        {/* =============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Recent Walks
        </Text>


        <View
          style={
            styles.historyCard
          }
        >

          {!historyLoaded ? (

            <Text
              style={
                styles.emptyText
              }
            >
              Loading walking
              history...
            </Text>

          ) : normalizedHistory.length ===
            0 ? (

            <Text
              style={
                styles.emptyText
              }
            >
              No Walking Function
              sessions yet. Start
              your first walk to
              begin building your
              personal baseline.
            </Text>

          ) : (

            normalizedHistory
              .slice(0, 5)
              .map(
                (walk) => (

                <View
                  key={
                    walk.id
                  }

                  style={
                    styles.historyRow
                  }
                >

                  <View
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={
                        styles.historyDate
                      }
                    >
                      {normalizeDate(
                        walk.date
                      )?.toLocaleDateString() ||
                        "Walk"}
                    </Text>

                    <Text
                      style={
                        styles.historyDetails
                      }
                    >
                      {Math.round(
                        walk.steps
                      ).toLocaleString()}{" "}
                      steps •{" "}
                      {walk.distanceMiles.toFixed(
                        2
                      )}{" "}
                      mi
                    </Text>
                  </View>


                  <View
                    style={
                      styles.historyRight
                    }
                  >
                    <Text
                      style={
                        styles.historyPace
                      }
                    >
                      {formatPace(
                        walk.pace
                      )}
                    </Text>

                    <Text
                      style={
                        styles.historyPaceUnit
                      }
                    >
                      / mile
                    </Text>
                  </View>

                </View>

              ))
          )}

        </View>


        <View
          style={
            styles.bottomSpace
          }
        />

      </ScrollView>


      {/* =============================================== */}
      {/* BOTTOM NAV */}
      {/* =============================================== */}

   

        
    </SafeAreaView>
  );
}


// ============================================================
// SMALL COMPONENTS
// ============================================================

function MetricCard({
  label,
  value,
  unit,
}) {
  return (
    <View
      style={
        styles.metricCard
      }
    >
      <Text
        style={
          styles.metricLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.metricValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.metricUnit
        }
      >
        {unit}
      </Text>
    </View>
  );
}


function AverageCard({
  label,
  value,
}) {
  return (
    <View
      style={
        styles.averageCard
      }
    >
      <Text
        style={
          styles.averageLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.averageValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.averageUnit
        }
      >
        MIN / MILE
      </Text>
    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor:
        "#030912",
    },

    container: {
      flex: 1,
      backgroundColor:
        "#030912",
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 115,
    },


    // BACK

    backButton: {
      alignSelf:
        "flex-start",

      borderWidth: 1.5,

      borderColor:
        "#E2B42B",

      borderRadius: 28,

      paddingHorizontal: 22,

      paddingVertical: 11,

      marginBottom: 28,
    },

    backText: {
      color:
        "#E2B42B",

      fontSize: 18,

      fontWeight: "900",
    },


    // HEADER

    eyebrow: {
      color:
        "#E2B42B",

      fontSize: 13,

      fontWeight: "900",

      letterSpacing: 4,

      marginBottom: 8,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize: 50,

      lineHeight: 53,

      fontWeight: "900",

      letterSpacing: -1.5,
    },

    subtitle: {
      color:
        "#AEB9CC",

      fontSize: 17,

      lineHeight: 26,

      fontWeight: "600",

      marginTop: 14,

      marginBottom: 28,
    },


    // COMMON

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize: 29,

      fontWeight: "900",

      marginTop: 8,

      marginBottom: 15,
    },

    cardEyebrow: {
      color:
        "#9CAAC0",

      fontSize: 11,

      fontWeight: "900",

      letterSpacing: 1.8,
    },

    rowBetween: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    helperText: {
      color:
        "#A8B5C8",

      fontSize: 14,

      lineHeight: 22,

      fontWeight: "600",

      marginTop: 12,
    },


    // NOTICE

    noticeCard: {
      backgroundColor:
        "#1B1820",

      borderWidth: 1,

      borderColor:
        "#7B6530",

      borderRadius: 18,

      padding: 16,

      marginBottom: 20,
    },

    noticeTitle: {
      color:
        "#E2B42B",

      fontSize: 16,

      fontWeight: "900",
    },

    noticeText: {
      color:
        "#B8C0CE",

      fontSize: 13,

      lineHeight: 20,

      marginTop: 5,
    },


    // SCORE

    scoreCard: {
      backgroundColor:
        "#0A1729",

      borderWidth: 1.5,

      borderColor:
        "#29476F",

      borderRadius: 27,

      padding: 22,

      marginBottom: 28,
    },

    functionLabel: {
      color:
        "#FFFFFF",

      fontSize: 25,

      fontWeight: "900",

      marginTop: 6,
    },

    scoreNumber: {
      color:
        "#9FF5CF",

      fontSize: 52,

      fontWeight: "900",

      marginLeft: 10,
    },

    progressTrack: {
      height: 11,

      backgroundColor:
        "#192A43",

      borderRadius: 20,

      overflow: "hidden",

      marginTop: 20,
    },

    progressFill: {
      height: "100%",

      backgroundColor:
        "#E2B42B",

      borderRadius: 20,
    },


    // LIVE WALK

    liveCard: {
      backgroundColor:
        "#08172A",

      borderWidth: 1.5,

      borderColor:
        "#E2B42B",

      borderRadius: 28,

      padding: 21,

      marginBottom: 28,
    },

    liveHeader: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",
    },

    liveTitle: {
      color:
        "#FFFFFF",

      fontSize: 26,

      fontWeight: "900",

      marginTop: 4,
    },

    statusBadge: {
      borderRadius: 20,

      paddingHorizontal: 11,

      paddingVertical: 8,
    },

    statusWalking: {
      backgroundColor:
        "#153C30",
    },

    statusPaused: {
      backgroundColor:
        "#4A3B18",
    },

    statusReady: {
      backgroundColor:
        "#18273D",
    },

    statusText: {
      color:
        "#9FF5CF",

      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 0.8,
    },

    paceCenter: {
      alignItems: "center",

      paddingVertical: 28,
    },

    paceNumber: {
      color:
        "#FFFFFF",

      fontSize: 60,

      fontWeight: "900",

      letterSpacing: -2,
    },

    paceUnit: {
      color:
        "#E2B42B",

      fontSize: 13,

      fontWeight: "900",

      letterSpacing: 2,
    },


    // METRICS

    metricGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent:
        "space-between",
    },

    metricCard: {
      width: "48%",

      backgroundColor:
        "#102037",

      borderWidth: 1,

      borderColor:
        "#29476F",

      borderRadius: 19,

      padding: 15,

      marginBottom: 12,
    },

    metricLabel: {
      color:
        "#9DAAC0",

      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.3,
    },

    metricValue: {
      color:
        "#FFFFFF",

      fontSize: 27,

      fontWeight: "900",

      marginTop: 6,
    },

    metricUnit: {
      color:
        "#E2B42B",

      fontSize: 10,

      fontWeight: "900",

      marginTop: 2,
    },


    // TIME

    timeRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      borderTopWidth: 1,

      borderTopColor:
        "#263951",

      paddingTop: 17,

      marginTop: 5,
    },

    timeLabel: {
      color:
        "#AAB6C8",

      fontSize: 15,

      fontWeight: "800",
    },

    timeValue: {
      color:
        "#FFFFFF",

      fontSize: 21,

      fontWeight: "900",
    },


    // CONTROLS

    controls: {
      flexDirection: "row",

      gap: 10,

      marginTop: 20,
    },

    primaryButton: {
      flex: 1,

      backgroundColor:
        "#E2B42B",

      borderRadius: 24,

      paddingVertical: 16,

      alignItems: "center",
    },

    primaryButtonText: {
      color:
        "#07101F",

      fontSize: 14,

      fontWeight: "900",

      letterSpacing: 0.8,
    },

    secondaryButton: {
      flex: 1,

      backgroundColor:
        "#14243A",

      borderWidth: 1.5,

      borderColor:
        "#E2B42B",

      borderRadius: 24,

      paddingVertical: 16,

      alignItems: "center",
    },

    secondaryButtonText: {
      color:
        "#E2B42B",

      fontSize: 14,

      fontWeight: "900",
    },

    finishButton: {
      flex: 1,

      backgroundColor:
        "#9FF5CF",

      borderRadius: 24,

      paddingVertical: 16,

      alignItems: "center",
    },

    finishButtonText: {
      color:
        "#061B18",

      fontSize: 14,

      fontWeight: "900",
    },


    // TREND

    trendCard: {
      backgroundColor:
        "#0A1729",

      borderWidth: 1.5,

      borderColor:
        "#29476F",

      borderRadius: 27,

      padding: 21,

      marginBottom: 28,
    },

    trendTop: {
      flexDirection: "row",

      alignItems: "center",
    },

    trendSymbol: {
      color:
        "#9FF5CF",

      fontSize: 47,

      fontWeight: "900",

      marginRight: 15,
    },

    trendTitle: {
      color:
        "#FFFFFF",

      fontSize: 25,

      fontWeight: "900",
    },

    trendPercent: {
      color:
        "#E2B42B",

      fontSize: 13,

      fontWeight: "900",

      marginTop: 3,
    },

    trendDescription: {
      color:
        "#AAB6C8",

      fontSize: 15,

      lineHeight: 23,

      fontWeight: "600",

      marginTop: 13,
    },

    averageRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 20,
    },

    averageCard: {
      width: "48%",

      backgroundColor:
        "#102037",

      borderWidth: 1,

      borderColor:
        "#29476F",

      borderRadius: 18,

      padding: 15,
    },

    averageLabel: {
      color:
        "#9DAAC0",

      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.2,
    },

    averageValue: {
      color:
        "#FFFFFF",

      fontSize: 27,

      fontWeight: "900",

      marginTop: 7,
    },

    averageUnit: {
      color:
        "#E2B42B",

      fontSize: 9,

      fontWeight: "900",

      marginTop: 2,
    },

    sessionCount: {
      color:
        "#8190A6",

      fontSize: 11,

      fontWeight: "700",

      textAlign: "center",

      marginTop: 16,
    },


    // INDICATORS

    indicatorCard: {
      backgroundColor:
        "#0A1729",

      borderWidth: 1.5,

      borderColor:
        "#29476F",

      borderRadius: 25,

      padding: 21,

      marginBottom: 15,
    },

    indicatorNumber: {
      color:
        "#FFFFFF",

      fontSize: 39,

      fontWeight: "900",

      marginTop: 8,
    },

    indicatorStatus: {
      color:
        "#9FF5CF",

      fontSize: 16,

      fontWeight: "900",
    },

    enduranceRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-end",
    },

    enduranceRight: {
      alignItems:
        "flex-end",
    },

    indicatorUnit: {
      color:
        "#E2B42B",

      fontSize: 10,

      fontWeight: "900",
    },


    // BASELINE

    baselineCard: {
      backgroundColor:
        "#16150F",

      borderWidth: 1.5,

      borderColor:
        "#E2B42B",

      borderRadius: 27,

      padding: 22,

      marginTop: 10,

      marginBottom: 28,
    },

    goldEyebrow: {
      color:
        "#E2B42B",

      fontSize: 11,

      fontWeight: "900",

      letterSpacing: 2.5,
    },

    baselineTitle: {
      color:
        "#FFFFFF",

      fontSize: 26,

      fontWeight: "900",

      marginTop: 6,
    },

    baselineNumber: {
      color:
        "#FFFFFF",

      fontSize: 46,

      fontWeight: "900",

      marginTop: 17,
    },

    baselineUnit: {
      color:
        "#E2B42B",

      fontSize: 11,

      fontWeight: "900",

      letterSpacing: 1,
    },


    // AI

    aiCard: {
      backgroundColor:
        "#0D2724",

      borderWidth: 1.5,

      borderColor:
        "#9FF5CF",

      borderRadius: 27,

      padding: 21,

      marginBottom: 28,
    },

    aiHeader: {
      flexDirection: "row",

      alignItems: "center",

      marginBottom: 18,
    },

    aiCircle: {
      width: 48,

      height: 48,

      borderRadius: 24,

      backgroundColor:
        "#9FF5CF",

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 13,
    },

    aiCircleText: {
      color:
        "#061B18",

      fontSize: 14,

      fontWeight: "900",
    },

    aiEyebrow: {
      color:
        "#9FF5CF",

      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 2,
    },

    aiTitle: {
      color:
        "#FFFFFF",

      fontSize: 24,

      fontWeight: "900",

      marginTop: 2,
    },

    aiText: {
      color:
        "#D1DDD9",

      fontSize: 16,

      lineHeight: 25,

      fontWeight: "600",
    },

    aiDivider: {
      height: 1,

      backgroundColor:
        "#294742",

      marginVertical: 17,
    },

    disclaimer: {
      color:
        "#8FA39E",

      fontSize: 11,

      lineHeight: 18,

      fontWeight: "600",
    },


    // HISTORY

    historyCard: {
      backgroundColor:
        "#0A1729",

      borderWidth: 1.5,

      borderColor:
        "#29476F",

      borderRadius: 25,

      paddingHorizontal: 19,

      paddingVertical: 5,
    },

    historyRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingVertical: 17,

      borderBottomWidth: 1,

      borderBottomColor:
        "#21334C",
    },

    historyDate: {
      color:
        "#FFFFFF",

      fontSize: 15,

      fontWeight: "900",
    },

    historyDetails: {
      color:
        "#93A2B7",

      fontSize: 12,

      fontWeight: "600",

      marginTop: 4,
    },

    historyRight: {
      alignItems:
        "flex-end",

      marginLeft: 10,
    },

    historyPace: {
      color:
        "#9FF5CF",

      fontSize: 20,

      fontWeight: "900",
    },

    historyPaceUnit: {
      color:
        "#E2B42B",

      fontSize: 10,

      fontWeight: "800",
    },

    emptyText: {
      color:
        "#9DAAC0",

      fontSize: 14,

      lineHeight: 22,

      textAlign: "center",

      paddingVertical: 26,
    },


    // BOTTOM NAV

    bottomSpace: {
      height: 25,
    },

    bottomNav: {
      height: 87,

      backgroundColor:
        "#001633",

      borderTopWidth: 1,

      borderTopColor:
        "#E2B42B",

      flexDirection: "row",

      justifyContent:
        "space-around",

      alignItems: "center",

      paddingBottom: 5,
    },

    navItem: {
      flex: 1,

      alignItems: "center",
    },

    navIcon: {
      color:
        "#E2B42B",

      fontSize: 22,

      fontWeight: "900",
    },

    navText: {
      color:
        "#AAB6C8",

      fontSize: 11,

      fontWeight: "800",

      marginTop: 4,
    },

  });