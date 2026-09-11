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
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Pedometer } from "expo-sensors";

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
  resumeLegathon,
  pauseLegathon,
  exitLegathon,
  completeLegathonSession,
} from "../utils/legathonSession";

import {
  getCurrentStepOwner,
  syncTodaySteps,
} from "../utils/stepTrackingEngine";

// ============================================================
// CONSTANTS
// ============================================================

const SYNC_INTERVAL_MS = 2500;
const GOLD = "#F7BE22";

function safeNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

function formatNumber(value) {
  return Math.floor(safeNumber(value)).toLocaleString();
}

const STEPS_IN_ONE_MILE =
  safeNumber(STEPS_PER_MILE) || 2000;

// ============================================================
// PROGRESS HELPERS
// ============================================================

function getProgress(marathon, progressMap) {
  const saved = progressMap?.[marathon.id] || {};

  const totalSteps =
    safeNumber(saved.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    safeNumber(MARATHON_TOTAL_STEPS) ||
    52400;

  const steps = Math.min(
    totalSteps,
    safeNumber(saved.steps)
  );

  const completed =
    saved.completed === true || steps >= totalSteps;

  return {
    ...saved,
    steps,
    totalSteps,
    completed,

    unlocked:
      completed ||
      saved.unlocked === true ||
      marathon.unlockedByDefault === true,

    percent: completed
      ? 100
      : Math.min(100, (steps / totalSteps) * 100),
  };
}

function createResultError(result, fallback) {
  const error =
    result?.error || result?.result?.error;

  const message =
    error?.message ||
    (error ? String(error) : result?.reason) ||
    fallback;

  return new Error(message);
}

function isMarathonActive(state, marathonId) {
  return Boolean(
    marathonId &&
      state.activeId === marathonId &&
      state.session?.marathonId === marathonId &&
      state.session?.active === true &&
      state.session?.status === "active" &&
      state.session?.ownsStepRouting === true &&
      state.owner?.owner === "marathon" &&
      state.owner?.marathonId === marathonId
  );
}

// ============================================================
// PEDOMETER ACCESS
// ============================================================

async function requirePedometer(requestPermission = false) {
  // This engine uses historical step counts from the iPhone.
  if (Platform.OS !== "ios") {
    throw new Error(
      "This step engine currently supports iPhone. Android needs a compatible step-count source."
    );
  }

  let permission =
    await Pedometer.getPermissionsAsync();

  if (
    !permission.granted &&
    requestPermission &&
    permission.canAskAgain
  ) {
    permission =
      await Pedometer.requestPermissionsAsync();
  }

  if (!permission.granted) {
    throw new Error(
      "Enable Motion & Fitness access for this app in iPhone Settings, then try again."
    );
  }

  const available =
    await Pedometer.isAvailableAsync();

  if (!available) {
    throw new Error(
      "The pedometer is unavailable. Try this on a physical iPhone."
    );
  }
}

// ============================================================
// MARATHON SCREEN
// ============================================================

export default function MarathonScreen({
  goBack,
  goToWorldMarathonDetail,
}) {
  const [screenState, setScreenState] = useState({
    progressMap: {},
    activeId: null,
    session: null,
    owner: null,
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSync, setLastSync] = useState(null);

  const mountedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const operationQueueRef = useRef(Promise.resolve());
  const pendingOperationsRef = useRef(0);
  const completionAlertsRef = useRef(new Set());

  // ==========================================================
  // SERIALIZE SCREEN OPERATIONS
  // ==========================================================

  const runOperation = useCallback(
    (operation, showErrorAlert = false) => {
      // Background sync can wait for the next interval.
      if (
        !showErrorAlert &&
        pendingOperationsRef.current > 0
      ) {
        return Promise.resolve();
      }

      pendingOperationsRef.current += 1;

      if (mountedRef.current) {
        setBusy(true);
      }

      const queuedOperation =
        operationQueueRef.current.then(async () => {
          if (!mountedRef.current) return;

          try {
            await operation();

            if (mountedRef.current) {
              setErrorMessage("");
            }
          } catch (error) {
            const message =
              error?.message || String(error);

            console.error(
              "MarathonScreen operation error:",
              error
            );

            if (mountedRef.current) {
              setErrorMessage(message);

              if (showErrorAlert) {
                Alert.alert("Legathon", message);
              }
            }
          } finally {
            if (mountedRef.current) {
              setLoading(false);
            }
          }
        });

      operationQueueRef.current =
        queuedOperation.catch(() => {});

      return queuedOperation.finally(() => {
        pendingOperationsRef.current -= 1;

        if (mountedRef.current) {
          setBusy(
            pendingOperationsRef.current > 0
          );
        }
      });
    },
    []
  );

  // ==========================================================
  // READ SAVED MARATHON AND SESSION STATE
  // ==========================================================

  const refreshMarathonState = useCallback(async () => {
    const progressMap =
      await loadMarathonProgressMap();

    let session =
      await loadLegathonSession();

    const sessionMarathon =
      MARATHON_CATALOG.find(
        marathon =>
          marathon.id === session?.marathonId
      );

    // Finish any session whose saved marathon is already complete.
    if (
      sessionMarathon &&
      session.status !== "completed" &&
      getProgress(
        sessionMarathon,
        progressMap
      ).completed
    ) {
      const result =
        await completeLegathonSession(
          sessionMarathon.id
        );

      if (result?.completed !== true) {
        throw createResultError(
          result,
          "Could not finish the walking session."
        );
      }

      session = await loadLegathonSession();
    }

    const activeMarathon =
      await getActiveMarathon();

    const owner =
      await getCurrentStepOwner();

    if (owner?.error) {
      throw createResultError(
        owner,
        "Could not read the walking session."
      );
    }

    const nextState = {
      progressMap: progressMap || {},
      session,
      owner,

      activeId:
        activeMarathon?.marathonId ||
        activeMarathon?.id ||
        activeMarathon?.marathon?.id ||
        null,
    };

    if (mountedRef.current) {
      setScreenState(nextState);
    }

    return nextState;
  }, []);

  // ==========================================================
  // SYNCHRONIZE PHYSICAL STEPS
  // ==========================================================

  const syncWalkingProgress = useCallback(async () => {
    await refreshMarathonState();
    await requirePedometer();

    // The engine owns step persistence.
    // Do not add pedometer totals directly in this screen.
    const result =
      await syncTodaySteps();

    const routingFailed =
      safeNumber(result?.delta) > 0 &&
      result?.destination === "marathon" &&
      result?.routed !== true;

    if (
      !result ||
      result.synced !== true ||
      result.error ||
      result.result?.error ||
      result.result?.saved === false ||
      result.saved === false ||
      routingFailed
    ) {
      throw createResultError(
        result,
        "Walking progress could not be saved. Please try again."
      );
    }

    const nextState =
      await refreshMarathonState();

    if (mountedRef.current) {
      setLastSync(new Date());
    }

    if (result.completedNow === true) {
      const completedId =
        result.marathonId ||
        result.marathon?.id;

      const completedMarathon =
        MARATHON_CATALOG.find(
          marathon =>
            marathon.id === completedId
        );

      if (
        completedMarathon &&
        getProgress(
          completedMarathon,
          nextState.progressMap
        ).completed &&
        !completionAlertsRef.current.has(
          completedId
        ) &&
        mountedRef.current
      ) {
        completionAlertsRef.current.add(
          completedId
        );

        Alert.alert(
          "Legathon Complete!",
          `${completedMarathon.title} is complete. Open its details to review your rewards.`
        );
      }
    }

    return nextState;
  }, [refreshMarathonState]);

  // ==========================================================
  // INITIAL LOAD AND AUTOMATIC SYNC
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;
    appStateRef.current = AppState.currentState;

    void runOperation(syncWalkingProgress);

    const interval = setInterval(() => {
      if (appStateRef.current === "active") {
        void runOperation(syncWalkingProgress);
      }
    }, SYNC_INTERVAL_MS);

    const subscription =
      AppState.addEventListener(
        "change",
        nextAppState => {
          const previousAppState =
            appStateRef.current;

          appStateRef.current =
            nextAppState;

          if (
            nextAppState === "active" &&
            previousAppState !== "active"
          ) {
            void runOperation(
              syncWalkingProgress
            );
          }
        }
      );

    return () => {
      mountedRef.current = false;

      clearInterval(interval);
      subscription.remove();
    };
  }, [runOperation, syncWalkingProgress]);

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const openMarathonDetails = useCallback(
    marathonId => {
      if (
        typeof goToWorldMarathonDetail ===
        "function"
      ) {
        goToWorldMarathonDetail(marathonId);
      }
    },
    [goToWorldMarathonDetail]
  );

  // ==========================================================
  // START, RESUME, OR OPEN A MARATHON
  // ==========================================================

  const handleOpenMarathon = useCallback(
    marathon => {
      void runOperation(async () => {
        const currentState =
          await refreshMarathonState();

        const progress = getProgress(
          marathon,
          currentState.progressMap
        );

        if (progress.completed) {
          if (
            typeof goToWorldMarathonDetail ===
            "function"
          ) {
            openMarathonDetails(marathon.id);
          } else {
            Alert.alert(
              marathon.title,
              "This Legathon is complete. Your progress is saved."
            );
          }

          return;
        }

        if (!progress.unlocked) {
          throw new Error(
            "Complete the previous Legathon to unlock this challenge."
          );
        }

        await requirePedometer(true);

        if (
          !isMarathonActive(
            currentState,
            marathon.id
          )
        ) {
          const shouldResume =
            currentState.activeId ===
              marathon.id &&
            currentState.session?.marathonId ===
              marathon.id &&
            currentState.session?.status ===
              "paused";

          const result = shouldResume
            ? await resumeLegathon()
            : await startLegathon(marathon.id);

          const succeeded = shouldResume
            ? result?.resumed
            : result?.started;

          if (succeeded !== true) {
            throw createResultError(
              result,
              "The Legathon could not be activated."
            );
          }

          // Establish the baseline immediately after
          // the session resets the engine's checkpoint.
          const updatedState =
            await syncWalkingProgress();

          if (
            !isMarathonActive(
              updatedState,
              marathon.id
            )
          ) {
            throw new Error(
              "The session started but its step owner does not match. Check that the latest session and engine files are both saved."
            );
          }
        } else {
          await syncWalkingProgress();
        }

        if (mountedRef.current) {
          openMarathonDetails(marathon.id);
        }
      }, true);
    },
    [
      runOperation,
      refreshMarathonState,
      syncWalkingProgress,
      openMarathonDetails,
      goToWorldMarathonDetail,
    ]
  );

  // ==========================================================
  // PAUSE OR EXIT LEGATHON MODE
  // ==========================================================

  const handleSessionAction = useCallback(
    action => {
      void runOperation(async () => {
        const currentState =
          await syncWalkingProgress();

        if (
          currentState.session?.status ===
          "completed"
        ) {
          return;
        }

        const result =
          action === "pause"
            ? await pauseLegathon()
            : await exitLegathon();

        const succeeded =
          action === "pause"
            ? result?.paused
            : result?.exited;

        if (succeeded !== true) {
          throw createResultError(
            result,
            "The walking session could not be updated."
          );
        }

        await syncWalkingProgress();
      }, true);
    },
    [runOperation, syncWalkingProgress]
  );

  // ==========================================================
  // DERIVED DISPLAY VALUES
  // ==========================================================

  const marathonRows = useMemo(
    () =>
      MARATHON_CATALOG.map(marathon => ({
        marathon,
        progress: getProgress(
          marathon,
          screenState.progressMap
        ),
      })),
    [screenState.progressMap]
  );

  const selectedMarathon =
    marathonRows.find(
      row =>
        row.marathon.id ===
        screenState.activeId
    ) ||
    marathonRows.find(
      row =>
        row.progress.unlocked &&
        !row.progress.completed
    );

  const modeActive = selectedMarathon
    ? isMarathonActive(
        screenState,
        selectedMarathon.marathon.id
      )
    : false;

  const modePaused = Boolean(
    selectedMarathon &&
      screenState.session?.status === "paused" &&
      screenState.session?.marathonId ===
        selectedMarathon.marathon.id
  );

  const completedCount =
    marathonRows.filter(
      row => row.progress.completed
    ).length;

  const unlockedCount =
    marathonRows.filter(
      row => row.progress.unlocked
    ).length;

  const claimedMarathons =
    marathonRows.filter(
      row =>
        row.progress.rewardClaimed === true
    );

  const claimedCoins =
    claimedMarathons.reduce(
      (total, row) =>
        total +
        safeNumber(row.marathon.rewardCoins),
      0
    );

  const claimedPoints =
    claimedMarathons.reduce(
      (total, row) =>
        total +
        safeNumber(row.marathon.rewardPoints),
      0
    );

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GOLD}
          />

          <Text style={styles.bodyText}>
            Loading your Legathons…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // SCREEN CONTENT
  // ==========================================================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            accessibilityRole="button"
            disabled={
              busy ||
              typeof goBack !== "function"
            }
            onPress={goBack}
          >
            <Text style={styles.goldText}>
              ‹ Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerBadge}>
            LEGATHON
          </Text>
        </View>

        <Text style={styles.screenTitle}>
          World Legathons
        </Text>

        <Text style={styles.bodyText}>
          Walk global endurance challenges and
          build your Legathon legacy.
        </Text>

        {!!errorMessage && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>

            <ActionButton
              label="Retry Sync"
              disabled={busy}
              onPress={() => {
                void runOperation(
                  syncWalkingProgress,
                  true
                );
              }}
            />
          </View>
        )}

        <View
          style={[
            styles.card,
            modeActive && styles.activeCard,
          ]}
        >
          <Text style={styles.goldText}>
            {modeActive
              ? "Legathon Mode Active"
              : modePaused
                ? "Legathon Paused"
                : "Legathon Mode Ready"}
          </Text>

          <Text style={styles.bodyText}>
            {modeActive
              ? `New walking steps count toward ${selectedMarathon.marathon.title}.`
              : modePaused
                ? "Your progress is saved. Resume when you are ready."
                : "Choose an unlocked challenge to begin."}
          </Text>
        </View>

        {selectedMarathon ? (
          <View
            style={[
              styles.card,
              styles.heroCard,
            ]}
          >
            <View style={styles.row}>
              <Text style={styles.heroFlag}>
                {selectedMarathon.marathon.flag}
              </Text>

              <View style={styles.flex}>
                <Text style={styles.label}>
                  {modeActive
                    ? "ACTIVE LEGATHON"
                    : modePaused
                      ? "PAUSED LEGATHON"
                      : "NEXT LEGATHON"}
                </Text>

                <Text style={styles.heroTitle}>
                  {selectedMarathon.marathon.title}
                </Text>

                <Text style={styles.bodyText}>
                  {selectedMarathon.marathon.city}
                  ,{" "}
                  {
                    selectedMarathon.marathon
                      .country
                  }
                </Text>
              </View>
            </View>

            <View style={styles.percentCircle}>
              <Text style={styles.percentValue}>
                {Math.floor(
                  selectedMarathon.progress
                    .percent
                )}
                %
              </Text>

              <Text style={styles.label}>
                COMPLETE
              </Text>
            </View>

            <ProgressBar
              percent={
                selectedMarathon.progress.percent
              }
            />

            <View style={styles.metricsRow}>
              <MetricCard
                value={formatNumber(
                  selectedMarathon.progress.steps
                )}
                label="Steps"
              />

              <MetricCard
                value={(
                  selectedMarathon.progress.steps /
                  STEPS_IN_ONE_MILE
                ).toFixed(2)}
                label="Miles"
              />

              <MetricCard
                value={formatNumber(
                  selectedMarathon.progress
                    .totalSteps -
                    selectedMarathon.progress.steps
                )}
                label="Remaining"
              />
            </View>

            <Text style={styles.centerText}>
              {formatNumber(
                selectedMarathon.progress.steps
              )}{" "}
              /{" "}
              {formatNumber(
                selectedMarathon.progress
                  .totalSteps
              )}{" "}
              steps
            </Text>

            <Text style={styles.centerText}>
              {(
                selectedMarathon.progress.steps /
                STEPS_IN_ONE_MILE
              ).toFixed(2)}{" "}
              /{" "}
              {(
                selectedMarathon.progress
                  .totalSteps / STEPS_IN_ONE_MILE
              ).toFixed(2)}{" "}
              miles
            </Text>

            <View style={styles.rewardsCard}>
              <Text style={styles.label}>
                COMPLETION REWARDS
              </Text>

              <Text style={styles.goldText}>
                🪙{" "}
                {formatNumber(
                  selectedMarathon.marathon
                    .rewardCoins
                )}{" "}
                WCoins
              </Text>

              <Text style={styles.bodyText}>
                ⭐{" "}
                {formatNumber(
                  selectedMarathon.marathon
                    .rewardPoints
                )}{" "}
                Legathon Points
              </Text>

              <Text style={styles.bodyText}>
                ✨{" "}
                {formatNumber(
                  selectedMarathon.marathon
                    .avatarXP
                )}{" "}
                Avatar XP
              </Text>
            </View>

            <ActionButton
              primary
              disabled={busy}
              label={
                modeActive
                  ? "Continue Legathon"
                  : modePaused
                    ? "Resume Legathon"
                    : "Activate Legathon"
              }
              onPress={() =>
                handleOpenMarathon(
                  selectedMarathon.marathon
                )
              }
            />

            <ActionButton
              disabled={busy}
              label="Sync Walking Progress"
              onPress={() => {
                void runOperation(
                  syncWalkingProgress,
                  true
                );
              }}
            />

            {modeActive && (
              <ActionButton
                disabled={busy}
                label="Pause Legathon"
                onPress={() =>
                  handleSessionAction("pause")
                }
              />
            )}

            {(modeActive || modePaused) && (
              <ActionButton
                disabled={busy}
                label="Return to Journey Mode"
                onPress={() =>
                  handleSessionAction("exit")
                }
              />
            )}

            {busy && (
              <ActivityIndicator
                color={GOLD}
                style={styles.spinner}
              />
            )}

            {lastSync && (
              <Text style={styles.centerText}>
                Last synced{" "}
                {lastSync.toLocaleTimeString()}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.heroTitle}>
              {completedCount ===
                marathonRows.length &&
              marathonRows.length > 0
                ? "All Legathons Complete!"
                : "No challenge available"}
            </Text>

            <Text style={styles.bodyText}>
              Your saved challenges are listed
              below.
            </Text>
          </View>
        )}

        <View style={styles.metricsRow}>
          <MetricCard
            value={formatNumber(completedCount)}
            label="Completed"
          />

          <MetricCard
            value={formatNumber(unlockedCount)}
            label="Unlocked"
          />

          <MetricCard
            value={formatNumber(claimedCoins)}
            label="WCoins Claimed"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            TOTAL LEGATHON POINTS CLAIMED
          </Text>

          <Text style={styles.heroTitle}>
            ⭐ {formatNumber(claimedPoints)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Global Legathon Challenges
        </Text>

        <Text style={styles.bodyText}>
          Complete each unlocked challenge to
          advance through the global Legathon
          series.
        </Text>

        {marathonRows.map(
          ({ marathon, progress }) => {
            const isRunning =
              isMarathonActive(
                screenState,
                marathon.id
              );

            const isPaused =
              screenState.session?.status ===
                "paused" &&
              screenState.session?.marathonId ===
                marathon.id;

            const statusLabel =
              progress.completed
                ? "View"
                : !progress.unlocked
                  ? "Locked"
                  : isRunning
                    ? "Continue"
                    : isPaused
                      ? "Resume"
                      : "Start";

            return (
              <TouchableOpacity
                key={marathon.id}
                accessibilityRole="button"
                accessibilityLabel={`${marathon.title}, ${statusLabel}`}
                disabled={busy}
                onPress={() =>
                  handleOpenMarathon(marathon)
                }
                style={[
                  styles.card,
                  styles.row,
                  isRunning &&
                    styles.activeCard,
                  !progress.unlocked &&
                    styles.lockedCard,
                ]}
              >
                <Text style={styles.cardFlag}>
                  {marathon.flag}
                </Text>

                <View style={styles.flex}>
                  <Text style={styles.cardTitle}>
                    {marathon.title}
                  </Text>

                  <Text style={styles.smallText}>
                    {marathon.city},{" "}
                    {marathon.country}
                  </Text>

                  <Text style={styles.smallText}>
                    {(
                      progress.steps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}{" "}
                    /{" "}
                    {(
                      progress.totalSteps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}{" "}
                    miles
                  </Text>

                  <Text style={styles.rewardText}>
                    🪙{" "}
                    {formatNumber(
                      marathon.rewardCoins
                    )}{" "}
                    WCoins
                  </Text>

                  <ProgressBar
                    percent={progress.percent}
                  />

                  {progress.completed && (
                    <Text
                      style={styles.successText}
                    >
                      Completed
                      {progress.rewardClaimed
                        ? " • Rewards claimed"
                        : ""}
                    </Text>
                  )}
                </View>

                <Text style={styles.statusText}>
                  {statusLabel}
                </Text>
              </TouchableOpacity>
            );
          }
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            How Legathon Mode Works
          </Text>

          <Text style={styles.bodyText}>
            Activation starts a new step
            checkpoint. Keep your phone with you
            while walking.
          </Text>

          <Text style={styles.bodyText}>
            While active, new steps go to your
            Legathon. Pausing returns step routing
            to Journey mode and keeps your marathon
            progress.
          </Text>

          <Text style={styles.bodyText}>
            This screen checks for saved walking
            progress while open and when the app
            returns to the foreground.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function ActionButton({
  label,
  onPress,
  disabled = false,
  primary = false,
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionButton,
        primary && styles.primaryButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          primary &&
            styles.primaryButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ProgressBar({ percent }) {
  const width = Math.min(
    100,
    safeNumber(percent)
  );

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${width}%` },
        ]}
      />
    </View>
  );
}

function MetricCard({ value, label }) {
  return (
    <View style={styles.metricCard}>
      <Text
        style={styles.metricValue}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#02060D",
  },

  content: {
    padding: 20,
    paddingBottom: 140,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    minHeight: 44,
    justifyContent: "center",
  },

  headerBadge: {
    color: GOLD,
    borderColor: GOLD,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },

  bodyText: {
    color: "#A7B2C5",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#0B1422",
    borderWidth: 1,
    borderColor: "#283447",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
  },

  activeCard: {
    borderColor: GOLD,
  },

  heroCard: {
    borderColor: "#8A6B22",
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  flex: {
    flex: 1,
    minWidth: 0,
  },

  heroFlag: {
    fontSize: 42,
    marginRight: 14,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },

  label: {
    color: "#9EACC0",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  goldText: {
    color: GOLD,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 4,
  },

  percentCircle: {
    width: 172,
    height: 172,
    borderRadius: 86,
    borderWidth: 9,
    borderColor: GOLD,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },

  percentValue: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#253248",
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    backgroundColor: GOLD,
  },

  metricsRow: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginTop: 18,
  },

  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 17,
    paddingHorizontal: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#283447",
    backgroundColor: "#0B1422",
    alignItems: "center",
  },

  metricValue: {
    color: GOLD,
    fontSize: 27,
    fontWeight: "900",
  },

  metricLabel: {
    color: "#A7B2C5",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 7,
  },

  centerText: {
    color: "#A7B2C5",
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
  },

  rewardsCard: {
    backgroundColor: "#111D2E",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },

  actionButton: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 13,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: GOLD,
  },

  actionButtonText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  primaryButtonText: {
    color: "#06101C",
  },

  disabledButton: {
    opacity: 0.5,
  },

  spinner: {
    marginTop: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 28,
  },

  cardFlag: {
    fontSize: 32,
    marginRight: 12,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  smallText: {
    color: "#A7B2C5",
    fontSize: 13,
    marginTop: 5,
  },

  rewardText: {
    color: GOLD,
    fontWeight: "800",
    fontSize: 14,
    marginTop: 7,
  },

  statusText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 9,
  },

  lockedCard: {
    opacity: 0.55,
  },

  successText: {
    color: "#75D5A5",
    fontSize: 12,
    marginTop: 8,
  },

  errorCard: {
    backgroundColor: "#291922",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },

  errorText: {
    color: "#FFD0D0",
    fontSize: 14,
    lineHeight: 21,
  },
});