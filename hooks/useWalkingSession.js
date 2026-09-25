import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  AppState,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";


// ============================================================
// LEGATHON WALK — WALKING SESSION ENGINE
// ============================================================
//
// RESPONSIBILITY:
//
// • Start walking assessment
// • Pause walking assessment
// • Resume walking assessment
// • Finish walking assessment
// • Track session-only steps
// • Track active walking time
// • Calculate:
//      - distance
//      - pace
//      - speed
//      - cadence
// • Save assessment history
// • Restore unfinished assessments
//
// IMPORTANT:
//
// Pedometer.watchStepCount() is foreground based.
//
// Therefore assessments automatically PAUSE when:
// • App goes into background
// • Screen closes
// • Pedometer becomes unavailable
//
// ============================================================


const STORAGE_KEY =
  "@legathon_walking_assessment_v1";

const OLD_HISTORY_KEY =
  "@legathon_walk_function_history_v2";


const STEPS_PER_MILE = 2000;

// UI/session calculation frequency.
const SESSION_TICK_MS = 1000;

// We do NOT need to write AsyncStorage every second.
const AUTO_SAVE_MS = 5000;


// ============================================================
// EMPTY SESSION
// ============================================================

const emptyDraft = () => ({
  id: null,
  steps: 0,
  milliseconds: 0,
});


// ============================================================
// SAFE NUMBER
// ============================================================

const nonnegative = (value) => {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, number);
};


// ============================================================
// APP ACTIVE CHECK
// ============================================================
//
// React Native AppState.currentState can briefly be null
// during startup in some configurations.
//
// Treat null as usable instead of blocking the walker.
//
// ============================================================

const isAppActive = () => {

  const current =
    AppState.currentState;

  return (
    current === "active" ||
    current == null
  );
};


// ============================================================
// ORDERED STORAGE WRITES
// ============================================================
//
// Ensures older saves cannot overwrite newer saves.
//
// ============================================================

let writes = Promise.resolve();


function writeStore(value) {

  const json =
    JSON.stringify(value);


  const next =
    writes.then(() =>
      AsyncStorage.setItem(
        STORAGE_KEY,
        json
      )
    );


  // Keep queue alive even if one write fails.

  writes =
    next.catch(() => {});


  return next;
}


// ============================================================
// HOOK
// ============================================================

export function useWalkingSession(
  liveSteps,
  pedometerAvailable
) {

  const [, forceRender] =
    useState(0);


  const mounted =
    useRef(false);


  // ==========================================================
  // CURRENT PEDOMETER SOURCE
  // ==========================================================

  const source =
    useRef({
      steps: 0,
      available: false,
    });


  source.current = {

    steps:
      nonnegative(liveSteps),

    available:
      pedometerAvailable === true,
  };


  // ==========================================================
  // INTERNAL SESSION STATE
  // ==========================================================

  const state =
    useRef({

      ready: false,

      busy: false,

      error: "",

      // idle
      // walking
      // paused

      status: "idle",

      draft:
        emptyDraft(),

      history: [],

      // Current raw pedometer baseline.
      baseline: 0,

      // Last timestamp sampled.
      tick: 0,

      // Last persistent save.
      lastSavedAt: 0,
    });


  // ==========================================================
  // RENDER
  // ==========================================================

  const refresh = () => {

    if (mounted.current) {

      forceRender(
        (value) =>
          value + 1
      );
    }
  };


  // ==========================================================
  // STORAGE PAYLOAD
  // ==========================================================

  const pack = () => ({

    version: 1,

    draft: {
      ...state.current.draft,
    },

    history:
      state.current.history,
  });


  // ==========================================================
  // SAVE CURRENT SESSION
  // ==========================================================

  const persist = () => {

    const s =
      state.current;


    if (!s.ready) {

      return Promise.resolve();
    }


    s.lastSavedAt =
      Date.now();


    return writeStore(
      pack()
    )
      .then(() => {

        s.error = "";

        refresh();
      })
      .catch((error) => {

        console.log(
          "Walking session autosave error:",
          error
        );


        s.error =
          "Auto-save failed. Keep this screen open and try again.";


        refresh();


        throw error;
      });
  };


  // ==========================================================
  // SAMPLE CURRENT SESSION
  // ==========================================================

  const sample = () => {

    const s =
      state.current;

    const now =
      Date.now();

    const current =
      source.current.steps;


    // ========================================================
    // ACTIVE WALKING
    // ========================================================

    if (
      s.status === "walking"
    ) {

      // If the sensor disappeared or restarted,
      // preserve everything already earned.

      if (
        !source.current.available ||
        current < s.baseline
      ) {

        s.status =
          "paused";

      } else {

        // Add elapsed foreground walking time.

        const elapsed =
          Math.max(
            0,
            now - s.tick
          );


        s.draft.milliseconds +=
          elapsed;


        // Add only NEW steps since last sample.

        const newSteps =
          Math.max(
            0,
            current - s.baseline
          );


        s.draft.steps +=
          newSteps;
      }
    }


    // Always refresh baseline.

    s.baseline =
      current;

    s.tick =
      now;
  };


  // ==========================================================
  // PAUSE
  // ==========================================================

  const pause = () => {

    const s =
      state.current;


    if (
      !s.ready ||
      s.busy ||
      s.status !== "walking"
    ) {

      return;
    }


    // Capture final foreground movement.

    sample();


    s.status =
      "paused";


    persist().catch(() => {});


    refresh();
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    mounted.current = true;


    let cancelled = false;


    async function load() {

      try {

        // Wait for old queued writes before reading.

        await writes;


        const raw =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );


        let saved;


        // ======================================================
        // CURRENT STORAGE
        // ======================================================

        if (raw !== null) {

          saved =
            JSON.parse(raw);


          if (
            saved?.version !== 1 ||
            !Array.isArray(
              saved.history
            )
          ) {

            throw new Error(
              "Invalid assessment data"
            );
          }


        } else {

          // ====================================================
          // MIGRATE OLD HISTORY
          // ====================================================

          const old =
            await AsyncStorage.getItem(
              OLD_HISTORY_KEY
            );


          const history =
            old
              ? JSON.parse(old)
              : [];


          if (
            !Array.isArray(
              history
            )
          ) {

            throw new Error(
              "Invalid history"
            );
          }


          saved = {

            history,

            draft:
              emptyDraft(),
          };
        }


        if (cancelled) {
          return;
        }


        const d =
          saved.draft;


        const s =
          state.current;


        // Keep most recent 365 assessments.

        s.history =
          saved.history.slice(
            0,
            365
          );


        // ======================================================
        // RESTORE DRAFT
        // ======================================================

        s.draft =
          typeof d?.id === "string"
            ? {

                id:
                  d.id,

                steps:
                  Math.floor(
                    nonnegative(
                      d.steps
                    )
                  ),

                milliseconds:
                  nonnegative(
                    d.milliseconds
                  ),
              }
            : emptyDraft();


        // Never automatically resume a restored walk.

        s.status =
          s.draft.id
            ? "paused"
            : "idle";


        s.baseline =
          source.current.steps;


        s.tick =
          Date.now();


        s.lastSavedAt =
          Date.now();


        s.ready =
          true;


        s.error =
          "";


        refresh();

      } catch (error) {

        console.log(
          "Walking session load error:",
          error
        );


        if (!cancelled) {

          state.current.error =
            "Could not load your saved assessment. Reopen this screen to retry.";


          refresh();
        }
      }
    }


    load();


    // ==========================================================
    // SESSION CLOCK
    // ==========================================================

    const timer =
      setInterval(() => {

        const s =
          state.current;


        if (
          !s.ready ||
          s.busy ||
          s.status !== "walking"
        ) {

          return;
        }


        // App left foreground.

        if (!isAppActive()) {

          pause();

          return;
        }


        const previousStatus =
          s.status;


        sample();


        // Sensor failure/reset automatically paused session.

        if (
          previousStatus === "walking" &&
          s.status === "paused"
        ) {

          persist()
            .catch(() => {});

          refresh();

          return;
        }


        // ======================================================
        // PERIODIC AUTO SAVE
        // ======================================================

        if (
          Date.now() -
            s.lastSavedAt >=
          AUTO_SAVE_MS
        ) {

          persist()
            .catch(() => {});
        }


        refresh();

      }, SESSION_TICK_MS);


    // ==========================================================
    // APP STATE
    // ==========================================================

    const subscription =
      AppState.addEventListener(
        "change",
        (nextState) => {

          if (
            nextState !== "active"
          ) {

            pause();
          }
        }
      );


    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {

      cancelled = true;


      clearInterval(timer);


      subscription.remove();


      const s =
        state.current;


      // Capture final session data BEFORE marking unmounted.

      if (
        s.ready &&
        !s.busy
      ) {

        sample();


        if (
          s.status === "walking"
        ) {

          s.status =
            "paused";
        }


        // Final screen-exit save.

        writeStore(
          pack()
        ).catch(
          () => {}
        );
      }


      mounted.current =
        false;
    };

  }, []);


  // ==========================================================
  // LIVE PEDOMETER UPDATE
  // ==========================================================
  //
  // Update in-memory data immediately.
  //
  // DO NOT write AsyncStorage every time the pedometer emits.
  //
  // ==========================================================

  useEffect(() => {

    const s =
      state.current;


    if (
      !s.ready ||
      s.busy
    ) {

      return;
    }


    if (!isAppActive()) {

      pause();

      return;
    }


    const previousStatus =
      s.status;


    sample();


    // Sensor restarted/disappeared.

    if (
      previousStatus === "walking" &&
      s.status === "paused"
    ) {

      persist()
        .catch(() => {});
    }


    refresh();

  }, [
    liveSteps,
    pedometerAvailable,
  ]);


  // ==========================================================
  // START / RESUME
  // ==========================================================

  const begin = (
    expectedStatus
  ) => {

    const s =
      state.current;


    if (!s.ready) {

      Alert.alert(
        "Please wait",
        s.error ||
          "Loading your saved assessment."
      );

      return;
    }


    if (
      s.busy ||
      s.status !== expectedStatus
    ) {

      return;
    }


    // ========================================================
    // SENSOR CHECK
    // ========================================================

    if (
      !source.current.available ||
      !isAppActive()
    ) {

      Alert.alert(
        "Step Tracking Unavailable",
        "Enable motion access and keep the app open to record an assessment."
      );

      return;
    }


    // ========================================================
    // NEW WALK
    // ========================================================

    if (
      expectedStatus === "idle"
    ) {

      s.draft = {

        ...emptyDraft(),

        id:
          `walk_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 8)}`,
      };
    }


    // Exclude ALL steps taken before Start / Resume.

    s.baseline =
      source.current.steps;


    s.tick =
      Date.now();


    s.status =
      "walking";


    persist()
      .catch(() => {});


    refresh();
  };


  // ==========================================================
  // FINISH WALK
  // ==========================================================

  const finish =
    async () => {

      const s =
        state.current;


      if (
        !s.ready ||
        s.busy ||
        s.status === "idle"
      ) {

        return;
      }


      // Capture final sample.

      sample();


      s.status =
        "paused";


      refresh();


      const steps =
        Math.floor(
          s.draft.steps
        );


      const minutes =
        s.draft.milliseconds /
        60000;


      // ========================================================
      // MINIMUM ASSESSMENT LENGTH
      // ========================================================

      if (
        steps < 100 ||
        minutes <= 0
      ) {

        persist()
          .catch(() => {});


        Alert.alert(
          "Walk Too Short",
          "Resume and walk at least 100 steps before saving."
        );

        return;
      }


      // ========================================================
      // CALCULATIONS
      // ========================================================

      const miles =
        steps /
        STEPS_PER_MILE;


      const pace =
        minutes /
        miles;


      const speedMph =
        (miles * 60) /
        minutes;


      const cadence =
        steps /
        minutes;


      // ========================================================
      // FINAL RECORD
      // ========================================================

      const record = {

        id:
          s.draft.id,

        date:
          new Date()
            .toISOString(),

        steps,

        distanceMiles:
          Number(
            miles.toFixed(3)
          ),

        durationMinutes:
          Number(
            minutes.toFixed(2)
          ),

        pace:
          Number(
            pace.toFixed(2)
          ),

        speedMph:
          Number(
            speedMph.toFixed(2)
          ),

        cadence:
          Math.round(
            cadence
          ),
      };


      // ========================================================
      // UPDATE HISTORY
      // ========================================================

      const history = [

        record,

        ...s.history.filter(
          (item) =>
            item.id !==
            record.id
        ),

      ].slice(
        0,
        365
      );


      s.busy =
        true;


      refresh();


      try {

        // ======================================================
        // SAFETY SAVE
        // ======================================================
        //
        // First preserve the paused draft.
        //
        // If the final commit fails, the walk remains recoverable.
        //
        // ======================================================

        await writeStore(
          pack()
        );


        // ======================================================
        // ATOMIC LOGICAL COMMIT
        // ======================================================

        await writeStore({

          version: 1,

          history,

          draft:
            emptyDraft(),
        });


        // Only change in-memory state AFTER successful storage.

        s.history =
          history;


        s.draft =
          emptyDraft();


        s.status =
          "idle";


        s.error =
          "";


        s.lastSavedAt =
          Date.now();


        if (
          mounted.current
        ) {

          Alert.alert(
            "Walk Saved",
            "Your assessment was added to your walking history."
          );
        }

      } catch (error) {

        console.log(
          "Walking assessment save error:",
          error
        );


        s.error =
          "Save failed. Your assessment is still paused. Tap Finish to retry.";


        if (
          mounted.current
        ) {

          Alert.alert(
            "Unable to Save",
            s.error
          );
        }

      } finally {

        s.busy =
          false;


        refresh();
      }
    };


  // ==========================================================
  // PUBLIC VALUES
  // ==========================================================

  const s =
    state.current;


  return {

    // ========================================================
    // STATUS
    // ========================================================

    sessionStatus:
      s.status,


    // ========================================================
    // CURRENT WALK
    // ========================================================

    sessionSteps:
      Math.floor(
        s.draft.steps
      ),


    sessionSeconds:
      Math.floor(
        s.draft.milliseconds /
        1000
      ),


    // ========================================================
    // HISTORY
    // ========================================================

    savedWalkHistory:
      s.history,


    historyLoaded:
      s.ready,


    // ========================================================
    // SCREEN MESSAGE
    // ========================================================

    sessionNotice:

      s.error ||

      (
        s.busy
          ? "Saving assessment…"

          : !s.ready
            ? "Loading assessment…"

            : s.status === "walking"
              ? "Walking assessment in progress."

              : s.status === "paused"
                ? "Assessment paused. Tap Resume when you're ready to continue."

                : "Ready to begin your walking assessment."
      ),


    // ========================================================
    // CONTROLS
    // ========================================================

    startWalkingSession:
      () =>
        begin(
          "idle"
        ),


    pauseWalkingSession:
      pause,


    resumeWalkingSession:
      () =>
        begin(
          "paused"
        ),


    finishWalkingSession:
      finish,
  };
}