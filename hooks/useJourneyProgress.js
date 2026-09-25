import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AppState,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import JOURNEY_CATALOG from
  "../data/journeyCatalog";

import JOURNEY_REWARDS from
  "../utils/journeyRewards";


const PROGRESS_KEY =
  "LEGACY_WALK_JOURNEY_PROGRESS";


// ============================================================
// NORMALIZE JOURNEY ID
// ============================================================

export function normalizeJourneyId(
  value
) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[_\s]+/g,
      "-"
    )
    .replace(
      /[^a-z0-9-]/g,
      ""
    )
    .replace(
      /-+/g,
      "-"
    );
}


// ============================================================
// SAFE OBJECT
// ============================================================

function objectFrom(
  raw
) {
  if (
    raw == null
  ) {
    return {};
  }


  const value =
    JSON.parse(
      raw
    );


  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value
    )
  ) {
    throw new Error(
      "Saved journey progress could not be read."
    );
  }


  return value;
}


// ============================================================
// SAFE COUNT
// ============================================================

function count(
  value
) {
  const number =
    Number(
      value ?? 0
    );


  if (
    !Number.isFinite(
      number
    ) ||
    number < 0
  ) {
    throw new Error(
      "Saved journey steps are invalid."
    );
  }


  return Math.floor(
    number
  );
}


// ============================================================
// POSITIVE NUMBER
// ============================================================

function positive(
  ...values
) {
  return (
    values
      .map(
        Number
      )
      .find(
        (value) =>
          Number.isFinite(
            value
          ) &&
          value > 0
      ) || 0
  );
}


// ============================================================
// VERIFY MASTER CATALOG
// ============================================================

const MASTER_JOURNEYS =
  Array.isArray(
    JOURNEY_CATALOG
  )
    ? JOURNEY_CATALOG
    : [];


// ============================================================
// DISPLAY JOURNEYS
// ============================================================

export const DISPLAY_JOURNEYS =
  MASTER_JOURNEYS.map(
    (item) => {

      const id =
        String(
          item.id ||
            item.journeyId ||
            item.routeKey ||
            item.slug ||
            ""
        );


      const normalizedId =
        normalizeJourneyId(
          id
        );


      const reward =
        JOURNEY_REWARDS[
          normalizedId
        ] ||
        JOURNEY_REWARDS[
          id
        ] ||
        {};


      const totalSteps =
        positive(
          reward.totalSteps,

          item.totalSteps,

          item.requiredSteps,

          item.stepGoal,

          item.targetSteps,

          item.steps,

          positive(
            reward.distanceMiles,

            item.distanceMiles,

            item.miles
          ) * 2000
        );


      return {
        ...item,

        id,

        category:
          item.category ||
          "Other",

        totalSteps,

        steps:
          totalSteps,

        wCoins:
          Number(
            reward.wCoins ??
              item.wCoins ??
              item.coins ??
              0
          ),

        coins:
          Number(
            reward.wCoins ??
              item.wCoins ??
              item.coins ??
              0
          ),

        reward:
          Number(
            reward.wCoins ??
              item.reward ??
              item.wCoins ??
              0
          ),

        rewardPoints:
          Number(
            reward.rewardPoints ??
              item.rewardPoints ??
              0
          ),

        xp:
          Number(
            reward.avatarXP ??
              item.avatarXP ??
              item.xp ??
              0
          ),

        avatarXP:
          Number(
            reward.avatarXP ??
              item.avatarXP ??
              item.xp ??
              0
          ),

        badge:
          reward.badge ||
          item.badge ||
          "Explorer",

        miles:
          Number(
            reward.distanceMiles ??
              item.distanceMiles ??
              item.miles ??
              0
          ),

        distanceMiles:
          Number(
            reward.distanceMiles ??
              item.distanceMiles ??
              item.miles ??
              0
          ),
      };
    }
  );


// ============================================================
// DEVELOPMENT CHECK
// ============================================================

if (__DEV__) {
  console.log(
    "LEGATHON JOURNEY CATALOG:",
    DISPLAY_JOURNEYS.length,
    "journeys loaded"
  );


  if (
    DISPLAY_JOURNEYS.length ===
    0
  ) {
    console.warn(
      "LEGATHON ERROR: No journeys loaded from data/journeyCatalog.js"
    );
  }
}


// ============================================================
// RESOLVE JOURNEY PROGRESS
// ============================================================

export function resolveJourneyProgress(
  journey,
  rawSnapshot,
  database,
  completionFlag = null
) {

  const id =
    String(
      journey.id
    );


  const local =
    objectFrom(
      rawSnapshot
    );


  const legacy =
    database[
      normalizeJourneyId(
        id
      )
    ] || {};


  const savedSteps =
    count(
      rawSnapshot != null
        ? local.steps ?? 0
        : legacy.stepsCompleted ??
            0
    );


  const goal =
    positive(
      journey.totalSteps,

      journey.requiredSteps,

      journey.stepGoal,

      journey.targetSteps,

      positive(
        journey.distanceMiles
      ) * 2000
    );


  const steps =
    goal
      ? Math.min(
          goal,
          savedSteps
        )
      : savedSteps;


  const progress =
    goal
      ? Math.min(
          100,
          (
            steps /
            goal
          ) * 100
        )
      : 0;


  const atGoal =
    goal > 0 &&
    steps >= goal;


  const completed =
    atGoal &&
    rawSnapshot != null &&
    local.hasCompleted ===
      true &&
    completionFlag ===
      "true";


  return {
    steps,
    totalSteps:
      goal,
    progress,
    atGoal,
    completed,
  };
}


// ============================================================
// LOAD JOURNEY DISPLAY
// ============================================================

export async function loadJourneyDisplay(
  fallbackActive = null
) {

  const header =
    Object.fromEntries(
      await AsyncStorage.multiGet([
        "activeJourney",
        "resumeJourneyId",
        PROGRESS_KEY,
      ])
    );


  const database =
    objectFrom(
      header[
        PROGRESS_KEY
      ]
    );


  const savedActive =
    header.activeJourney
      ? objectFrom(
          header.activeJourney
        )
      : null;


  const candidate =
    savedActive?.id
      ? savedActive
      : fallbackActive;


  const activeId =
    String(
      candidate?.id ||
        header.resumeJourneyId ||
        ""
    );


  const catalogEntry =
    DISPLAY_JOURNEYS.find(
      (item) =>
        item.id ===
        activeId
    );


  const active =
    activeId
      ? {
          ...catalogEntry,
          ...candidate,
          id: activeId,
        }
      : null;


  if (
    active
  ) {
    active.totalSteps =
      positive(
        active.totalSteps,

        active.requiredSteps,

        active.stepGoal,

        active.targetSteps,

        catalogEntry?.totalSteps,

        positive(
          active.distanceMiles
        ) * 2000
      );
  }


  const ids = [
    ...new Set(
      DISPLAY_JOURNEYS
        .map(
          (item) =>
            item.id
        )
        .concat(
          activeId
            ? [
                activeId,
              ]
            : []
        )
    ),
  ];


  const snapshotPairs =
    await AsyncStorage.multiGet(
      ids.flatMap(
        (id) => [
          `journeyStats_${id}`,
          `journeyCompleted_${id}`,
        ]
      )
    );


  const snapshots =
    Object.fromEntries(
      snapshotPairs
    );


  const progressMap =
    {};


  const detailsMap =
    {};


  let completedCount =
    0;


  for (
    const journey of
    DISPLAY_JOURNEYS
  ) {

    const target =
      active?.id ===
      journey.id
        ? {
            ...journey,

            totalSteps:
              active.totalSteps,
          }
        : journey;


    const result =
      resolveJourneyProgress(
        target,

        snapshots[
          `journeyStats_${journey.id}`
        ],

        database,

        snapshots[
          `journeyCompleted_${journey.id}`
        ]
      );


    progressMap[
      journey.id
    ] =
      result.progress;


    detailsMap[
      journey.id
    ] =
      result;


    if (
      result.completed
    ) {
      completedCount +=
        1;
    }
  }


  let activeJourney =
    null;


  if (
    active
  ) {

    const result =
      resolveJourneyProgress(
        active,

        snapshots[
          `journeyStats_${active.id}`
        ],

        database,

        snapshots[
          `journeyCompleted_${active.id}`
        ]
      );


    activeJourney = {
      ...active,
      ...result,

      journeyProgress:
        result.progress,

      progressPercent:
        result.progress,
    };
  }


  return {
    activeJourney,

    progressMap,

    detailsMap,

    completedCount,

    totalCount:
      DISPLAY_JOURNEYS.length,

    collectionPercent:
      DISPLAY_JOURNEYS.length
        ? (
            completedCount /
            DISPLAY_JOURNEYS.length
          ) * 100
        : 0,
  };
}


// ============================================================
// HOOK
// ============================================================

export default function useJourneyProgress(
  fallbackActive = null
) {

  const fallbackRef =
    useRef(
      fallbackActive
    );


  fallbackRef.current =
    fallbackActive;


  const [
    state,
    setState,
  ] =
    useState({
      activeJourney:
        null,

      progressMap:
        {},

      detailsMap:
        {},

      completedCount:
        0,

      totalCount:
        DISPLAY_JOURNEYS.length,

      collectionPercent:
        0,

      ready:
        false,

      error:
        "",
    });


  useEffect(
    () => {

      let alive =
        true;


      let busy =
        false;


      let foreground =
        AppState.currentState !==
          "background" &&
        AppState.currentState !==
          "inactive";


      async function refresh() {

        if (
          !alive ||
          busy ||
          !foreground
        ) {
          return;
        }


        busy =
          true;


        try {

          const result =
            await loadJourneyDisplay(
              fallbackRef.current
            );


          if (
            alive
          ) {
            setState({
              ...result,

              ready:
                true,

              error:
                "",
            });
          }

        } catch (
          error
        ) {

          console.log(
            "Journey progress load error:",
            error
          );


          if (
            alive
          ) {

            setState(
              (
                previous
              ) => ({
                ...previous,

                ready:
                  true,

                error:
                  error.message ||
                  "Unable to load journey progress.",
              })
            );
          }

        } finally {

          busy =
            false;
        }
      }


      void refresh();


      const timer =
        setInterval(
          refresh,
          1500
        );


      const listener =
        AppState.addEventListener(
          "change",
          (
            value
          ) => {

            foreground =
              value ===
              "active";


            if (
              foreground
            ) {
              void refresh();
            }
          }
        );


      return () => {

        alive =
          false;


        clearInterval(
          timer
        );


        listener.remove();
      };

    },

    [
      fallbackActive?.id,
    ]
  );


  return state;
}