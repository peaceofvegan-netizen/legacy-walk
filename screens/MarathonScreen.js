// screens/MarathonScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  AppState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MARATHON_CATALOG, {
  MARATHON_TOTAL_STEPS,
  STEPS_PER_MILE,
} from "../data/marathonCatalog";

import {
  getActiveMarathon,
  loadMarathonProgressMap,
} from "../utils/marathonStorage";

import {
  loadLegathonSession,
  startLegathon,
} from "../utils/legathonSession";

import {
  getCurrentStepOwner,
  syncTodaySteps,
  watchLiveSteps,
  stopLiveSteps,
} from "../utils/stepTrackingEngine";


// ============================================================
// CONSTANTS
// ============================================================

const SYNC_INTERVAL_MS = 1500;


// ============================================================
// HELPERS
// ============================================================

function safeNumber(value) {
  const parsed =
    Number(value ?? 0);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(
    0,
    parsed
  );
}


function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      safeNumber(value)
    )
  );
}


function formatNumber(value) {
  return Math.floor(
    safeNumber(value)
  ).toLocaleString();
}


function getStoredActiveId(
  activeStorage,
  session
) {
  if (
    session?.active === true &&
    session?.status === "active" &&
    session?.marathonId
  ) {
    return session.marathonId;
  }

  return (
    activeStorage?.marathonId ||
    activeStorage?.id ||
    activeStorage?.marathon?.id ||
    null
  );
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function MarathonScreen({
  goBack,
  goToWorldMarathonDetail,
}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    marathons,
    setMarathons,
  ] =
    useState(
      MARATHON_CATALOG
    );


  const [
    progressMap,
    setProgressMap,
  ] =
    useState({});


  const [
    activeMarathonId,
    setActiveMarathonId,
  ] =
    useState(null);


  const [
    legathonSession,
    setLegathonSession,
  ] =
    useState(null);


  const [
    stepOwner,
    setStepOwner,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    openingId,
    setOpeningId,
  ] =
    useState(null);


  const [
    walkingDetected,
    setWalkingDetected,
  ] =
    useState(false);


  const [
    liveSensorSteps,
    setLiveSensorSteps,
  ] =
    useState(0);


  // ==========================================================
  // REFS
  // ==========================================================

  const mountedRef =
    useRef(true);


  const syncBusyRef =
    useRef(false);


  const timerRef =
    useRef(null);


  const watcherRef =
    useRef(null);


  const completionAlertRef =
    useRef(
      new Set()
    );


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigateBack =
    useCallback(
      () => {

        if (
          typeof goBack ===
          "function"
        ) {
          goBack();
        }

      },
      [
        goBack
      ]
    );


  const openMarathonDetail =
    useCallback(
      marathonId => {

        if (!marathonId) {
          return;
        }


        if (
          typeof goToWorldMarathonDetail ===
          "function"
        ) {

          goToWorldMarathonDetail(
            marathonId
          );

        }

      },
      [
        goToWorldMarathonDetail
      ]
    );


  // ==========================================================
  // PROGRESS CALCULATOR
  // ==========================================================

  const getProgress =
    useCallback(
      marathonId => {

        const marathon =
          MARATHON_CATALOG.find(
            item =>
              item.id ===
              marathonId
          );


        const saved =
          progressMap?.[
            marathonId
          ];


        const totalSteps =
          safeNumber(
            saved?.totalSteps
          ) ||
          safeNumber(
            marathon?.totalSteps
          ) ||
          MARATHON_TOTAL_STEPS;


        const steps =
          Math.min(
            totalSteps,
            safeNumber(
              saved?.steps
            )
          );


        const completed =
          saved?.completed ===
            true ||
          steps >= totalSteps;


        const calculatedProgress =
          totalSteps > 0
            ? (
                steps /
                totalSteps
              ) * 100
            : 0;


        const progress =
          completed
            ? 100
            : clamp(
                saved?.progress ??
                calculatedProgress
              );


        const unlocked =
          saved?.unlocked ===
            true ||
          marathon
            ?.unlockedByDefault ===
            true;


        return {

          id:
            marathonId,

          steps,

          totalSteps,

          progress,

          completed,

          unlocked,

          rewardClaimed:
            saved
              ?.rewardClaimed ===
            true,

          startedAt:
            saved?.startedAt ||
            null,

          completedAt:
            saved?.completedAt ||
            null,

        };

      },
      [
        progressMap
      ]
    );


  // ==========================================================
  // READ SAVED STATE
  // ==========================================================

  const readMarathonState =
    useCallback(
      async () => {

        try {

          const [
            savedProgress,
            savedActive,
            session,
            owner,
          ] =
            await Promise.all([

              loadMarathonProgressMap(),

              getActiveMarathon(),

              loadLegathonSession(),

              getCurrentStepOwner(),

            ]);


          if (
            !mountedRef.current
          ) {
            return;
          }


          setMarathons(
            MARATHON_CATALOG
          );


          setProgressMap(
            savedProgress ||
            {}
          );


          setLegathonSession(
            session ||
            null
          );


          setStepOwner(
            owner ||
            null
          );


          const activeId =
            getStoredActiveId(
              savedActive,
              session
            );


          setActiveMarathonId(
            activeId
          );

        } catch (error) {

          console.log(
            "Read marathon state error:",
            error
          );

        }

      },
      []
    );


  // ==========================================================
  // CENTRAL PHYSICAL STEP SYNC
  // ==========================================================
  //
  // THIS IS THE IMPORTANT PART.
  //
  // syncTodaySteps:
  //
  // phone physical steps
  //        ↓
  // determine new delta
  //        ↓
  // central router
  //        ↓
  // active Legathon?
  //        ↓
  // YES → marathonStorage
  //
  // NO → normal Journey
  //
  // ==========================================================

  const syncPhysicalSteps =
    useCallback(
      async ({
        showSpinner = false,
      } = {}) => {

        if (
          syncBusyRef.current
        ) {
          return;
        }


        syncBusyRef.current =
          true;


        try {

          if (showSpinner) {
            setRefreshing(
              true
            );
          }


          const result =
            await syncTodaySteps();


          console.log(
            "LEGATHON STEP SYNC:",
            result
          );


          // -----------------------------------------------
          // Reload marathon progress AFTER routing.
          // -----------------------------------------------

          await readMarathonState();


          // -----------------------------------------------
          // Completion feedback.
          // -----------------------------------------------

          if (
            result
              ?.completedNow ===
              true
          ) {

            const completedId =
              result?.marathonId ||
              result?.routed
                ?.marathonId ||
              null;


            if (
              completedId &&
              !completionAlertRef
                .current
                .has(
                  completedId
                )
            ) {

              completionAlertRef
                .current
                .add(
                  completedId
                );


              const marathon =
                MARATHON_CATALOG.find(
                  item =>
                    item.id ===
                    completedId
                );


              Alert.alert(
                "Legathon Complete!",
                `${
                  marathon?.title ||
                  "Your marathon"
                } is complete. Your final progress has been saved.`
              );

            }

          }

        } catch (error) {

          console.log(
            "Physical Legathon sync error:",
            error
          );

        } finally {

          syncBusyRef.current =
            false;


          if (
            mountedRef.current
          ) {

            setRefreshing(
              false
            );

          }

        }

      },
      [
        readMarathonState
      ]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  const initializeScreen =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );


          // -----------------------------------------------
          // First synchronize the phone's current physical
          // step count.
          // -----------------------------------------------

          await syncPhysicalSteps();


          // -----------------------------------------------
          // Then read the authoritative saved marathon state.
          // -----------------------------------------------

          await readMarathonState();

        } catch (error) {

          console.log(
            "Initialize Marathon screen error:",
            error
          );

        } finally {

          if (
            mountedRef.current
          ) {

            setLoading(
              false
            );

          }

        }

      },
      [
        readMarathonState,
        syncPhysicalSteps,
      ]
    );


  // ==========================================================
  // START / ACTIVATE LEGATHON
  // ==========================================================

  const activateLegathon =
    useCallback(
      async (
        marathon,
        openDetailAfter = true
      ) => {

        if (
          !marathon?.id ||
          openingId
        ) {
          return;
        }


        const progress =
          getProgress(
            marathon.id
          );


        if (
          !progress.unlocked
        ) {

          Alert.alert(
            "Legathon Locked",
            `Complete the required previous Legathon challenge to unlock ${marathon.title}.`
          );

          return;
        }


        try {

          setOpeningId(
            marathon.id
          );


          // =================================================
          // NEW AUTHORITY
          //
          // DO NOT call:
          //
          // setActiveMarathon(...)
          //
          // DO NOT use Lifetime Steps as the marathon source.
          //
          // startLegathon() performs the complete ownership
          // transition and establishes the physical sensor
          // checkpoint.
          // =================================================

          const result =
            await startLegathon(
              marathon.id
            );


          console.log(
            "START LEGATHON RESULT:",
            result
          );


          if (
            result?.started !==
            true
          ) {

            Alert.alert(
              "Legathon",
              result?.reason ===
                "marathon-locked"
                ? "This Legathon is still locked."
                : "The Legathon walking session could not be started."
            );

            return;
          }


          // -----------------------------------------------
          // Refresh session + marathon state.
          // -----------------------------------------------

          await readMarathonState();


          // -----------------------------------------------
          // Establish UI immediately.
          // -----------------------------------------------

          setActiveMarathonId(
            marathon.id
          );


          setWalkingDetected(
            false
          );


          Alert.alert(
            "Legathon Mode Active",
            `${marathon.title} is now your active Legathon. New physical walking steps will count toward this challenge.`,
            [
              {
                text: "OK",
                onPress: () => {

                  if (
                    openDetailAfter
                  ) {

                    openMarathonDetail(
                      marathon.id
                    );

                  }

                },
              },
            ]
          );

        } catch (error) {

          console.log(
            "Activate Legathon error:",
            error
          );


          Alert.alert(
            "Legathon",
            "The walking session could not be activated."
          );

        } finally {

          if (
            mountedRef.current
          ) {

            setOpeningId(
              null
            );

          }

        }

      },
      [
        getProgress,
        openingId,
        openMarathonDetail,
        readMarathonState,
      ]
    );


  // ==========================================================
  // OPEN CARD
  // ==========================================================

  const handleOpenMarathon =
    useCallback(
      async marathon => {

        if (!marathon?.id) {
          return;
        }


        const progress =
          getProgress(
            marathon.id
          );


        if (
          !progress.unlocked
        ) {

          Alert.alert(
            "Legathon Locked",
            `Complete the previous Legathon challenges to unlock ${marathon.title}.`
          );

          return;
        }


        const isAlreadyActive =
          activeMarathonId ===
            marathon.id &&
          legathonSession?.active ===
            true &&
          legathonSession?.status ===
            "active";


        // -----------------------------------------------
        // If already active, just synchronize and open.
        // -----------------------------------------------

        if (
          isAlreadyActive
        ) {

          await syncPhysicalSteps();


          openMarathonDetail(
            marathon.id
          );


          return;
        }


        // -----------------------------------------------
        // Otherwise activate the Legathon first.
        // -----------------------------------------------

        await activateLegathon(
          marathon,
          true
        );

      },
      [
        activeMarathonId,
        activateLegathon,
        getProgress,
        legathonSession,
        openMarathonDetail,
        syncPhysicalSteps,
      ]
    );


  // ==========================================================
  // COMPONENT MOUNT
  // ==========================================================

  useEffect(
    () => {

      mountedRef.current =
        true;


      initializeScreen();


      return () => {

        mountedRef.current =
          false;

      };

    },
    [
      initializeScreen
    ]
  );


  // ==========================================================
  // AUTOMATIC STEP SYNCHRONIZATION
  // ==========================================================
  //
  // While this screen is mounted, poll the authoritative
  // physical pedometer checkpoint approximately every
  // 1.5 seconds.
  //
  // This DOES NOT create fake steps.
  //
  // syncTodaySteps only credits the actual physical delta
  // detected by the phone.
  //
  // ==========================================================

  useEffect(
    () => {

      timerRef.current =
        setInterval(
          () => {

            syncPhysicalSteps();

          },
          SYNC_INTERVAL_MS
        );


      return () => {

        if (
          timerRef.current
        ) {

          clearInterval(
            timerRef.current
          );


          timerRef.current =
            null;

        }

      };

    },
    [
      syncPhysicalSteps
    ]
  );


  // ==========================================================
  // APP FOREGROUND SYNC
  // ==========================================================

  useEffect(
    () => {

      const subscription =
        AppState.addEventListener(
          "change",
          nextState => {

            if (
              nextState ===
              "active"
            ) {

              syncPhysicalSteps();

            }

          }
        );


      return () => {

        subscription?.remove?.();

      };

    },
    [
      syncPhysicalSteps
    ]
  );


  // ==========================================================
  // LIVE PEDOMETER WATCHER
  // ==========================================================
  //
  // IMPORTANT:
  //
  // watchLiveSteps() is UI feedback only.
  //
  // Persistence is still performed exclusively by
  // syncTodaySteps().
  //
  // ==========================================================

  useEffect(
    () => {

      try {

        watcherRef.current =
          watchLiveSteps(
            update => {

              if (
                !mountedRef.current
              ) {
                return;
              }


              setLiveSensorSteps(
                safeNumber(
                  update?.liveSteps
                )
              );


              if (
                update
                  ?.legathonActive ===
                  true
              ) {

                setWalkingDetected(
                  true
                );

              }

            }
          );

      } catch (error) {

        console.log(
          "Legathon live watcher error:",
          error
        );

      }


      return () => {

        try {

          stopLiveSteps(
            watcherRef.current
          );

        } catch (error) {

          console.log(
            "Stop Legathon watcher error:",
            error
          );

        }


        watcherRef.current =
          null;

      };

    },
    []
  );


  // ==========================================================
  // ACTIVE MARATHON
  // ==========================================================

  const activeMarathon =
    useMemo(
      () => {

        if (
          activeMarathonId
        ) {

          const found =
            marathons.find(
              marathon =>
                marathon.id ===
                activeMarathonId
            );


          if (found) {
            return found;
          }

        }


        return (
          marathons.find(
            marathon => {

              const progress =
                getProgress(
                  marathon.id
                );


              return (
                progress.unlocked &&
                !progress.completed
              );

            }
          ) ||
          marathons[0] ||
          null
        );

      },
      [
        activeMarathonId,
        getProgress,
        marathons,
      ]
    );


  // ==========================================================
  // ACTIVE PROGRESS
  // ==========================================================

  const activeProgress =
    activeMarathon
      ? getProgress(
          activeMarathon.id
        )
      : {
          steps: 0,

          totalSteps:
            MARATHON_TOTAL_STEPS,

          progress: 0,

          completed: false,

          unlocked: false,

          rewardClaimed:
            false,
        };


  const steps =
    safeNumber(
      activeProgress.steps
    );


  const totalSteps =
    safeNumber(
      activeProgress.totalSteps
    ) ||
    MARATHON_TOTAL_STEPS;


  const percent =
    Math.round(
      clamp(
        activeProgress.progress
      )
    );


  const remaining =
    Math.max(
      totalSteps -
        steps,
      0
    );


  const miles =
    steps /
    (
      STEPS_PER_MILE ||
      2000
    );


  const completed =
    activeProgress.completed;


  const modeActive =
    legathonSession?.active ===
      true &&
    legathonSession?.status ===
      "active" &&
    legathonSession
      ?.ownsStepRouting ===
      true &&
    Boolean(
      legathonSession
        ?.marathonId
    );


  // ==========================================================
  // COUNTS
  // ==========================================================

  const completedCount =
    useMemo(
      () => {

        return marathons.filter(
          marathon =>
            getProgress(
              marathon.id
            ).completed
        ).length;

      },
      [
        getProgress,
        marathons,
      ]
    );


  const unlockedCount =
    useMemo(
      () => {

        return marathons.filter(
          marathon =>
            getProgress(
              marathon.id
            ).unlocked
        ).length;

      },
      [
        getProgress,
        marathons,
      ]
    );


  const totalRewardCoins =
    useMemo(
      () => {

        return marathons.reduce(
          (
            total,
            marathon
          ) => {

            const progress =
              getProgress(
                marathon.id
              );


            if (
              !progress.completed
            ) {
              return total;
            }


            return (
              total +
              safeNumber(
                marathon
                  .rewardCoins
              )
            );

          },
          0
        );

      },
      [
        getProgress,
        marathons,
      ]
    );


  const totalRewardPoints =
    useMemo(
      () => {

        return marathons.reduce(
          (
            total,
            marathon
          ) => {

            const progress =
              getProgress(
                marathon.id
              );


            if (
              !progress.completed
            ) {
              return total;
            }


            return (
              total +
              safeNumber(
                marathon
                  .rewardPoints
              )
            );

          },
          0
        );

      },
      [
        getProgress,
        marathons,
      ]
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    Object.keys(
      progressMap
    ).length === 0
  ) {

    return (

      <SafeAreaView
        style={
          styles.safe
        }
      >

        <View
          style={
            styles.loadingContainer
          }
        >

          <ActivityIndicator
            size="large"
            color="#F7BE22"
          />


          <Text
            style={
              styles.loadingText
            }
          >
            Connecting walking system...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (

    <SafeAreaView
      style={
        styles.safe
      }
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

        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={
            styles.headerRow
          }
        >

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              navigateBack
            }
          >

            <Text
              style={
                styles.backButtonText
              }
            >
              ‹ Back
            </Text>

          </TouchableOpacity>


          <View
            style={
              styles.headerBadge
            }
          >

            <Text
              style={
                styles.headerBadgeText
              }
            >
              LEGATHON
            </Text>

          </View>

        </View>


        <Text
          style={
            styles.screenTitle
          }
        >
          World Legathons
        </Text>


        <Text
          style={
            styles.screenSubtitle
          }
        >
          Walk global endurance challenges using real physical steps and build your Legathon legacy.
        </Text>


        {/* =================================================
            WALKING ROUTER STATUS
        ================================================= */}

        <View
          style={[
            styles.modeCard,

            modeActive
              ? styles.modeCardActive
              : styles.modeCardInactive,
          ]}
        >

          <View
            style={[
              styles.modeDot,

              modeActive
                ? styles.modeDotActive
                : styles.modeDotInactive,
            ]}
          />


          <View
            style={
              styles.modeTextWrap
            }
          >

            <Text
              style={[
                styles.modeTitle,

                modeActive
                  ? styles.modeTitleActive
                  : styles.modeTitleInactive,
              ]}
            >

              {modeActive
                ? "Legathon Mode Active"
                : "Legathon Mode Ready"}

            </Text>


            <Text
              style={
                styles.modeText
              }
            >

              {modeActive
                ? `New physical walking steps are being routed to ${
                    activeMarathon?.title ||
                    "your active Legathon"
                  }.`
                : "Select an unlocked Legathon to activate physical step routing."}

            </Text>


            {modeActive && (

              <Text
                style={
                  styles.routerText
                }
              >

                Step owner:{" "}
                {stepOwner
                  ?.owner ||
                  "marathon"}

                {walkingDetected
                  ? " • Walking detected"
                  : ""}

              </Text>

            )}

          </View>

        </View>


        {/* =================================================
            ACTIVE LEGATHON
        ================================================= */}

        {activeMarathon && (

          <View
            style={
              styles.heroCard
            }
          >

            <View
              style={
                styles.heroTopRow
              }
            >

              <View
                style={
                  styles.heroFlagBox
                }
              >

                <Text
                  style={
                    styles.heroFlag
                  }
                >
                  {activeMarathon.flag}
                </Text>

              </View>


              <View
                style={
                  styles.heroHeading
                }
              >

                <Text
                  style={
                    styles.activeLabel
                  }
                >
                  {modeActive
                    ? "ACTIVE LEGATHON"
                    : "NEXT LEGATHON"}
                </Text>


                <Text
                  style={
                    styles.heroTitle
                  }
                >
                  {activeMarathon.title}
                </Text>


                <Text
                  style={
                    styles.heroLocation
                  }
                >
                  {activeMarathon.city},{" "}
                  {activeMarathon.country}
                </Text>

              </View>

            </View>


            <View
              style={
                styles.percentCircle
              }
            >

              <Text
                style={
                  styles.percentValue
                }
              >
                {percent}%
              </Text>


              <Text
                style={
                  styles.percentLabel
                }
              >
                COMPLETE
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
                      `${clamp(
                        activeProgress.progress
                      )}%`,
                  },
                ]}
              />

            </View>


            <View
              style={
                styles.metricGrid
              }
            >

              <MetricCard
                value={
                  formatNumber(
                    steps
                  )
                }
                label="Legathon Steps"
              />


              <MetricCard
                value={
                  miles.toFixed(2)
                }
                label="Miles"
              />


              <MetricCard
                value={
                  formatNumber(
                    remaining
                  )
                }
                label="Remaining"
              />

            </View>


            <Text
              style={
                styles.stepSummary
              }
            >
              {formatNumber(
                steps
              )}{" "}
              /{" "}
              {formatNumber(
                totalSteps
              )}{" "}
              steps
            </Text>


            <Text
              style={
                styles.milesSummary
              }
            >
              {miles.toFixed(2)} / 26.20 miles
            </Text>


            <View
              style={
                styles.heroRewardCard
              }
            >

              <Text
                style={
                  styles.heroRewardLabel
                }
              >
                COMPLETION REWARDS
              </Text>


              <Text
                style={
                  styles.heroRewardValue
                }
              >
                🪙{" "}
                {formatNumber(
                  activeMarathon
                    .rewardCoins
                )}{" "}
                WCoins
              </Text>


              <Text
                style={
                  styles.heroRewardSubtext
                }
              >
                ⭐{" "}
                {formatNumber(
                  activeMarathon
                    .rewardPoints
                )}{" "}
                Legathon Points
              </Text>


              <Text
                style={
                  styles.heroRewardSubtext
                }
              >
                ✨{" "}
                {formatNumber(
                  activeMarathon
                    .avatarXP
                )}{" "}
                Avatar XP
              </Text>

            </View>


            <TouchableOpacity
              style={
                styles.primaryButton
              }
              activeOpacity={
                0.85
              }
              disabled={
                openingId ===
                activeMarathon.id
              }
              onPress={() =>
                handleOpenMarathon(
                  activeMarathon
                )
              }
            >

              {openingId ===
              activeMarathon.id ? (

                <ActivityIndicator
                  size="small"
                  color="#06101C"
                />

              ) : (

                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  {modeActive
                    ? "Continue Legathon"
                    : "Activate Legathon"}
                </Text>

              )}

            </TouchableOpacity>


            <TouchableOpacity
              style={
                styles.syncButton
              }
              onPress={() =>
                syncPhysicalSteps({
                  showSpinner:
                    true,
                })
              }
            >

              {refreshing ? (

                <ActivityIndicator
                  size="small"
                  color="#F7BE22"
                />

              ) : (

                <Text
                  style={
                    styles.syncButtonText
                  }
                >
                  Sync Walking Progress
                </Text>

              )}

            </TouchableOpacity>

          </View>

        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <View
          style={
            styles.statsRow
          }
        >

          <StatCard
            value={
              completedCount
            }
            label="Completed"
          />


          <StatCard
            value={
              unlockedCount
            }
            label="Unlocked"
          />


          <StatCard
            value={
              formatNumber(
                totalRewardCoins
              )
            }
            label="WCoins Earned"
          />

        </View>


        <View
          style={
            styles.pointsCard
          }
        >

          <Text
            style={
              styles.pointsLabel
            }
          >
            TOTAL LEGATHON POINTS EARNED
          </Text>


          <Text
            style={
              styles.pointsValue
            }
          >
            ⭐{" "}
            {formatNumber(
              totalRewardPoints
            )}
          </Text>

        </View>


        {/* =================================================
            CHALLENGES
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Global Legathon Challenges
        </Text>


        <Text
          style={
            styles.sectionSubtitle
          }
        >
          Complete each unlocked challenge to advance through the global Legathon series.
        </Text>


        {marathons.map(
          marathon => {

            const marathonProgress =
              getProgress(
                marathon.id
              );


            const cardPercent =
              Math.round(
                marathonProgress
                  .progress
              );


            const isActive =
              activeMarathonId ===
                marathon.id &&
              modeActive;


            const isOpening =
              openingId ===
              marathon.id;


            const marathonMiles =
              marathonProgress.steps /
              (
                STEPS_PER_MILE ||
                2000
              );


            return (

              <TouchableOpacity
                key={
                  marathon.id
                }
                style={[
                  styles.marathonCard,

                  isActive &&
                    styles.activeMarathonCard,

                  !marathonProgress
                    .unlocked &&
                    styles.lockedMarathonCard,

                  marathonProgress
                    .completed &&
                    styles.completedMarathonCard,
                ]}
                activeOpacity={
                  marathonProgress
                    .unlocked
                    ? 0.82
                    : 1
                }
                disabled={
                  isOpening
                }
                onPress={() =>
                  handleOpenMarathon(
                    marathon
                  )
                }
              >

                <View
                  style={
                    styles.marathonFlagBox
                  }
                >

                  <Text
                    style={
                      styles.marathonFlag
                    }
                  >
                    {marathon.flag}
                  </Text>

                </View>


                <View
                  style={
                    styles.marathonInfo
                  }
                >

                  <View
                    style={
                      styles.marathonTitleRow
                    }
                  >

                    <Text
                      style={
                        styles.marathonTitle
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {marathon.title}
                    </Text>


                    {isActive && (

                      <View
                        style={
                          styles.activePill
                        }
                      >

                        <Text
                          style={
                            styles.activePillText
                          }
                        >
                          ACTIVE
                        </Text>

                      </View>

                    )}

                  </View>


                  <Text
                    style={
                      styles.marathonSubtitle
                    }
                  >
                    {marathon.city},{" "}
                    {marathon.country}
                  </Text>


                  <Text
                    style={
                      styles.marathonMileage
                    }
                  >
                    {marathonMiles.toFixed(
                      2
                    )}{" "}
                    / 26.20 miles
                  </Text>


                  <Text
                    style={
                      styles.marathonReward
                    }
                  >
                    🪙{" "}
                    {formatNumber(
                      marathon
                        .rewardCoins
                    )}{" "}
                    WCoins
                  </Text>


                  {marathonProgress
                    .unlocked &&
                    !marathonProgress
                      .completed && (

                      <View
                        style={
                          styles.cardProgressTrack
                        }
                      >

                        <View
                          style={[
                            styles.cardProgressFill,

                            {
                              width:
                                `${clamp(
                                  marathonProgress
                                    .progress
                                )}%`,
                            },
                          ]}
                        />

                      </View>

                    )}

                </View>


                <View
                  style={[
                    styles.statusPill,

                    isActive &&
                      styles.activeStatusPill,

                    marathonProgress
                      .completed &&
                      styles.completedStatusPill,

                    !marathonProgress
                      .unlocked &&
                      styles.lockedStatusPill,
                  ]}
                >

                  {isOpening ? (

                    <ActivityIndicator
                      size="small"
                      color="#F7BE22"
                    />

                  ) : (

                    <Text
                      style={[
                        styles.statusText,

                        isActive &&
                          styles.activeStatusText,

                        marathonProgress
                          .completed &&
                          styles.completedStatusText,

                        !marathonProgress
                          .unlocked &&
                          styles.lockedStatusText,
                      ]}
                    >

                      {!marathonProgress
                        .unlocked
                        ? "Locked"
                        : marathonProgress
                            .completed
                          ? "Completed"
                          : isActive
                            ? `${cardPercent}%`
                            : "Start"}

                    </Text>

                  )}

                </View>

              </TouchableOpacity>

            );

          }
        )}


        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <View
          style={
            styles.informationCard
          }
        >

          <Text
            style={
              styles.informationTitle
            }
          >
            How Legathon Mode Works
          </Text>


          <Text
            style={
              styles.informationText
            }
          >
            Starting a Legathon creates a clean physical-step checkpoint. Steps taken before activation do not count toward the challenge.
          </Text>


          <Text
            style={
              styles.informationText
            }
          >
            While Legathon Mode is active, new physical walking steps are routed to the active marathon instead of your regular Journey.
          </Text>


          <Text
            style={
              styles.informationText
            }
          >
            Marathon progress is stored independently. Marathon steps do not increase Journey Lifetime Steps or tracksuit progression.
          </Text>


          <Text
            style={
              styles.informationText
            }
          >
            The screen automatically synchronizes with the phone pedometer while it is open and again whenever the app returns to the foreground.
          </Text>

        </View>


        <View
          style={{
            height: 130,
          }}
        />

      </ScrollView>

    </SafeAreaView>

  );
}


// ============================================================
// SMALL COMPONENTS
// ============================================================

function MetricCard({
  value,
  label,
}) {

  return (

    <View
      style={
        styles.metricCard
      }
    >

      <Text
        style={
          styles.metricValue
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {value}
      </Text>


      <Text
        style={
          styles.metricLabel
        }
      >
        {label}
      </Text>

    </View>

  );
}


function StatCard({
  value,
  label,
}) {

  return (

    <View
      style={
        styles.statCard
      }
    >

      <Text
        style={
          styles.statValue
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {value}
      </Text>


      <Text
        style={
          styles.statLabel
        }
      >
        {label}
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
        "#02060D",
    },


    container: {
      flex: 1,
      backgroundColor:
        "#02060D",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 20,
    },


    loadingContainer: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      padding: 30,
    },


    loadingText: {
      color:
        "#FFFFFF",
      fontSize: 17,
      fontWeight:
        "800",
      marginTop: 18,
    },


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    headerRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 24,
    },


    backButton: {
      minHeight: 44,
      justifyContent:
        "center",
    },


    backButtonText: {
      color:
        "#F7BE22",
      fontSize: 20,
      fontWeight:
        "900",
    },


    headerBadge: {
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor:
        "#F7BE22",
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor:
        "rgba(247,190,34,0.06)",
    },


    headerBadgeText: {
      color:
        "#F7BE22",
      fontSize: 13,
      fontWeight:
        "900",
      letterSpacing: 2,
    },


    screenTitle: {
      color:
        "#FFFFFF",
      fontSize: 43,
      lineHeight: 49,
      fontWeight:
        "900",
    },


    screenSubtitle: {
      color:
        "#9EACC0",
      fontSize: 18,
      lineHeight: 27,
      fontWeight:
        "700",
      marginTop: 10,
      marginBottom: 25,
    },


    // --------------------------------------------------------
    // MODE STATUS
    // --------------------------------------------------------

    modeCard: {
      flexDirection:
        "row",
      borderRadius: 24,
      borderWidth: 1.5,
      padding: 19,
      marginBottom: 22,
    },


    modeCardActive: {
      borderColor:
        "#4ED7B0",
      backgroundColor:
        "rgba(25,109,88,0.12)",
    },


    modeCardInactive: {
      borderColor:
        "#3A4960",
      backgroundColor:
        "#0B1421",
    },


    modeDot: {
      width: 13,
      height: 13,
      borderRadius: 7,
      marginTop: 6,
      marginRight: 15,
    },


    modeDotActive: {
      backgroundColor:
        "#78F3CF",
    },


    modeDotInactive: {
      backgroundColor:
        "#748198",
    },


    modeTextWrap: {
      flex: 1,
    },


    modeTitle: {
      fontSize: 19,
      fontWeight:
        "900",
    },


    modeTitleActive: {
      color:
        "#80F3D1",
    },


    modeTitleInactive: {
      color:
        "#FFFFFF",
    },


    modeText: {
      color:
        "#AAB7C9",
      fontSize: 14,
      lineHeight: 21,
      fontWeight:
        "700",
      marginTop: 4,
    },


    routerText: {
      color:
        "#6FE4C1",
      fontSize: 12,
      fontWeight:
        "800",
      marginTop: 8,
    },


    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------

    heroCard: {
      borderRadius: 30,
      borderWidth: 1.5,
      borderColor:
        "#876A19",
      backgroundColor:
        "#0E192B",
      padding: 22,
      marginBottom: 22,
    },


    heroTopRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },


    heroFlagBox: {
      width: 70,
      height: 70,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        "#31445F",
      backgroundColor:
        "#16243A",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 16,
    },


    heroFlag: {
      fontSize: 40,
    },


    heroHeading: {
      flex: 1,
    },


    activeLabel: {
      color:
        "#F7BE22",
      fontSize: 12,
      fontWeight:
        "900",
      letterSpacing: 2,
    },


    heroTitle: {
      color:
        "#FFFFFF",
      fontSize: 28,
      lineHeight: 34,
      fontWeight:
        "900",
      marginTop: 5,
    },


    heroLocation: {
      color:
        "#A7B5C8",
      fontSize: 15,
      fontWeight:
        "700",
      marginTop: 5,
    },


    percentCircle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 13,
      borderColor:
        "#F7BE22",
      backgroundColor:
        "#08111F",
      alignSelf:
        "center",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 30,
      marginBottom: 25,
    },


    percentValue: {
      color:
        "#FFFFFF",
      fontSize: 43,
      fontWeight:
        "900",
    },


    percentLabel: {
      color:
        "#F7BE22",
      fontSize: 11,
      fontWeight:
        "900",
      letterSpacing: 1.5,
      marginTop: 2,
    },


    progressTrack: {
      height: 15,
      borderRadius: 10,
      overflow:
        "hidden",
      backgroundColor:
        "#223149",
    },


    progressFill: {
      height:
        "100%",
      borderRadius: 10,
      backgroundColor:
        "#F7BE22",
    },


    metricGrid: {
      flexDirection:
        "row",
      marginTop: 22,
      marginHorizontal: -5,
    },


    metricCard: {
      flex: 1,
      minHeight: 96,
      borderRadius: 21,
      borderWidth: 1,
      borderColor:
        "#2D405B",
      backgroundColor:
        "#091321",
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 6,
      marginHorizontal: 5,
    },


    metricValue: {
      color:
        "#FFFFFF",
      fontSize: 22,
      fontWeight:
        "900",
    },


    metricLabel: {
      color:
        "#9CAAC0",
      fontSize: 11,
      fontWeight:
        "800",
      textAlign:
        "center",
      marginTop: 6,
    },


    stepSummary: {
      color:
        "#FFFFFF",
      fontSize: 17,
      fontWeight:
        "900",
      textAlign:
        "center",
      marginTop: 20,
    },


    milesSummary: {
      color:
        "#9EACC0",
      fontSize: 15,
      fontWeight:
        "700",
      textAlign:
        "center",
      marginTop: 5,
    },


    heroRewardCard: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        "#745B1E",
      backgroundColor:
        "rgba(247,190,34,0.06)",
      padding: 18,
      marginTop: 21,
    },


    heroRewardLabel: {
      color:
        "#F7BE22",
      fontSize: 12,
      fontWeight:
        "900",
      letterSpacing: 1.7,
    },


    heroRewardValue: {
      color:
        "#FFFFFF",
      fontSize: 22,
      fontWeight:
        "900",
      marginTop: 9,
    },


    heroRewardSubtext: {
      color:
        "#C3CEDC",
      fontSize: 14,
      lineHeight: 21,
      fontWeight:
        "700",
      marginTop: 6,
    },


    primaryButton: {
      minHeight: 62,
      borderRadius: 22,
      backgroundColor:
        "#F7BE22",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 20,
    },


    primaryButtonText: {
      color:
        "#06101C",
      fontSize: 19,
      fontWeight:
        "900",
    },


    syncButton: {
      minHeight: 54,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        "#F7BE22",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 12,
    },


    syncButtonText: {
      color:
        "#F7BE22",
      fontSize: 15,
      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    statsRow: {
      flexDirection:
        "row",
      marginHorizontal: -5,
      marginBottom: 18,
    },


    statCard: {
      flex: 1,
      minHeight: 108,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        "#2D405B",
      backgroundColor:
        "#0C1625",
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 6,
      marginHorizontal: 5,
    },


    statValue: {
      color:
        "#F7BE22",
      fontSize: 27,
      fontWeight:
        "900",
    },


    statLabel: {
      color:
        "#A3B0C4",
      fontSize: 11,
      fontWeight:
        "800",
      textAlign:
        "center",
      marginTop: 7,
    },


    pointsCard: {
      borderRadius: 23,
      borderWidth: 1,
      borderColor:
        "#2D405B",
      backgroundColor:
        "#0C1625",
      padding: 20,
      marginBottom: 30,
    },


    pointsLabel: {
      color:
        "#AAB6C8",
      fontSize: 12,
      fontWeight:
        "900",
      letterSpacing: 1.5,
    },


    pointsValue: {
      color:
        "#FFFFFF",
      fontSize: 28,
      fontWeight:
        "900",
      marginTop: 8,
    },


    // --------------------------------------------------------
    // LIST
    // --------------------------------------------------------

    sectionTitle: {
      color:
        "#FFFFFF",
      fontSize: 31,
      lineHeight: 37,
      fontWeight:
        "900",
    },


    sectionSubtitle: {
      color:
        "#9BA9BD",
      fontSize: 16,
      lineHeight: 24,
      fontWeight:
        "700",
      marginTop: 7,
      marginBottom: 19,
    },


    marathonCard: {
      minHeight: 137,
      borderRadius: 26,
      borderWidth: 1,
      borderColor:
        "#293D59",
      backgroundColor:
        "#0E1828",
      paddingHorizontal: 16,
      paddingVertical: 18,
      marginBottom: 15,
      flexDirection:
        "row",
      alignItems:
        "center",
    },


    activeMarathonCard: {
      borderColor:
        "#F7BE22",
      borderWidth: 2,
    },


    lockedMarathonCard: {
      opacity: 0.55,
    },


    completedMarathonCard: {
      borderColor:
        "#4AA98D",
    },


    marathonFlagBox: {
      width: 61,
      height: 61,
      borderRadius: 19,
      backgroundColor:
        "#17253A",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 14,
    },


    marathonFlag: {
      fontSize: 34,
    },


    marathonInfo: {
      flex: 1,
      paddingRight: 8,
    },


    marathonTitleRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },


    marathonTitle: {
      flexShrink: 1,
      color:
        "#FFFFFF",
      fontSize: 19,
      fontWeight:
        "900",
    },


    activePill: {
      borderRadius: 11,
      backgroundColor:
        "#F7BE22",
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginLeft: 7,
    },


    activePillText: {
      color:
        "#06101C",
      fontSize: 8,
      fontWeight:
        "900",
    },


    marathonSubtitle: {
      color:
        "#9EACC0",
      fontSize: 13,
      fontWeight:
        "700",
      marginTop: 5,
    },


    marathonMileage: {
      color:
        "#AAB5C5",
      fontSize: 13,
      fontWeight:
        "700",
      marginTop: 4,
    },


    marathonReward: {
      color:
        "#F7BE22",
      fontSize: 14,
      fontWeight:
        "900",
      marginTop: 6,
    },


    cardProgressTrack: {
      height: 7,
      borderRadius: 5,
      overflow:
        "hidden",
      backgroundColor:
        "#25354C",
      marginTop: 10,
    },


    cardProgressFill: {
      height:
        "100%",
      borderRadius: 5,
      backgroundColor:
        "#F7BE22",
    },


    statusPill: {
      minWidth: 75,
      minHeight: 44,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor:
        "#F7BE22",
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 9,
    },


    activeStatusPill: {
      backgroundColor:
        "rgba(247,190,34,0.08)",
    },


    completedStatusPill: {
      borderColor:
        "#7FE2BF",
      backgroundColor:
        "rgba(127,226,191,0.08)",
    },


    lockedStatusPill: {
      borderColor:
        "#69758A",
    },


    statusText: {
      color:
        "#F7BE22",
      fontSize: 12,
      fontWeight:
        "900",
    },


    activeStatusText: {
      color:
        "#F7BE22",
    },


    completedStatusText: {
      color:
        "#7FE2BF",
    },


    lockedStatusText: {
      color:
        "#9CA7B7",
    },


    // --------------------------------------------------------
    // INFORMATION
    // --------------------------------------------------------

    informationCard: {
      borderRadius: 25,
      borderWidth: 1,
      borderColor:
        "#2A3E59",
      backgroundColor:
        "#0C1625",
      padding: 22,
      marginTop: 17,
    },


    informationTitle: {
      color:
        "#FFFFFF",
      fontSize: 22,
      fontWeight:
        "900",
    },


    informationText: {
      color:
        "#9EACC0",
      fontSize: 15,
      lineHeight: 24,
      fontWeight:
        "700",
      marginTop: 13,
    },

  });