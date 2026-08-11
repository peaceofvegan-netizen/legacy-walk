import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
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
  hasShownMarathonCompletionAlert,
  loadMarathonProgressMap,
  markMarathonCompletionAlertShown,
  setActiveMarathon,
  syncActiveMarathonSteps,
} from "../utils/marathonStorage";

import {
  loadStepStats,
} from "../utils/stepTrackingEngine";

const safeNumber = value => {
  const parsed = Number(value || 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const clamp = (
  value,
  minimum = 0,
  maximum = 100
) => {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      safeNumber(value)
    )
  );
};

export default function MarathonScreen({
  goBack,
  goToWorldMarathonDetail,
}) {
  const [marathons, setMarathons] =
    useState(MARATHON_CATALOG);

  const [progressMap, setProgressMap] =
    useState({});

  const [
    activeMarathonData,
    setActiveMarathonData,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [openingId, setOpeningId] =
    useState(null);

  const navigateBack = useCallback(() => {
  if (typeof goBack === "function") {
    goBack();
  }
}, [goBack]);

  


const openMarathonDetail = useCallback(
  marathonId => {
    if (!marathonId) return;

    if (
      typeof goToWorldMarathonDetail ===
      "function"
    ) {
      goToWorldMarathonDetail(
        marathonId
      );
    }
  },
  [goToWorldMarathonDetail]
);

  const getProgress = useCallback(
    marathonId => {
      const marathon =
        MARATHON_CATALOG.find(
          item =>
            item.id === marathonId
        );

      const saved =
        progressMap?.[marathonId];

      const totalSteps =
        safeNumber(
          saved?.totalSteps
        ) ||
        safeNumber(
          marathon?.totalSteps
        ) ||
        MARATHON_TOTAL_STEPS;

      const steps = Math.min(
        totalSteps,
        Math.max(
          0,
          safeNumber(saved?.steps)
        )
      );

      const completed =
        saved?.completed === true ||
        steps >= totalSteps;

      const calculatedProgress =
        totalSteps > 0
          ? (steps / totalSteps) *
            100
          : 0;

      const progress = completed
        ? 100
        : clamp(
            saved?.progress ??
              calculatedProgress
          );

      return {
        id: marathonId,
        steps,
        totalSteps,
        progress,
        completed,

        unlocked:
          saved?.unlocked === true ||
          marathon
            ?.unlockedByDefault ===
            true,

        rewardClaimed:
          saved?.rewardClaimed ===
          true,

        startingLifetimeSteps:
          saved
            ?.startingLifetimeSteps ??
          null,

        startedAt:
          saved?.startedAt || null,

        completedAt:
          saved?.completedAt || null,
      };
    },
    [progressMap]
  );

  const loadMarathons =
    useCallback(async () => {
      try {
        setLoading(true);

        let lifetimeSteps = 0;

        try {
          const stepStats =
            await loadStepStats();

          lifetimeSteps = safeNumber(
            stepStats?.lifetimeSteps ??
              stepStats?.totalSteps ??
              stepStats?.steps
          );
        } catch (stepError) {
          console.log(
            "Load marathon step stats error:",
            stepError
          );
        }

        let syncedResult = null;

        try {
          syncedResult =
            await syncActiveMarathonSteps(
              lifetimeSteps
            );
        } catch (syncError) {
          console.log(
            "Sync active marathon error:",
            syncError
          );
        }

        const [
          savedProgress,
          active,
        ] = await Promise.all([
          loadMarathonProgressMap(),
          getActiveMarathon(),
        ]);

        setMarathons(
          MARATHON_CATALOG
        );

        setProgressMap(
          savedProgress || {}
        );

        setActiveMarathonData(
          active || null
        );

        if (
          syncedResult
            ?.completedNow &&
          syncedResult?.marathon
        ) {
          const marathonId =
            syncedResult.marathon.id;

          const alreadyShown =
            await hasShownMarathonCompletionAlert(
              marathonId
            );

          if (!alreadyShown) {
            await markMarathonCompletionAlertShown(
              marathonId
            );

            Alert.alert(
              "Marathon Complete!",
              `${
                syncedResult
                  .marathon.title
              } is complete. ${
                syncedResult
                  ?.nextMarathonUnlocked
                  ?.title
                  ? `${syncedResult.nextMarathonUnlocked.title} is now unlocked.`
                  : "You completed the final marathon."
              }`,
              [
                {
                  text: "Later",
                  style: "cancel",
                },
                {
                  text: "View Rewards",
                  onPress: () =>
                    openMarathonDetail(
                      marathonId
                    ),
                },
              ]
            );
          }
        }
      } catch (error) {
        console.log(
          "Load marathons error:",
          error
        );

        Alert.alert(
          "Marathons",
          "Your marathon progress could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, [openMarathonDetail]);

  useEffect(() => {
    loadMarathons();
  }, [loadMarathons]);

  

  const activeMarathon =
    activeMarathonData?.marathon ||
    marathons.find(
      marathon =>
        getProgress(
          marathon.id
        ).unlocked &&
        !getProgress(
          marathon.id
        ).completed
    ) ||
    marathons[0] ||
    null;

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
          rewardClaimed: false,
        };

  const steps =
    activeProgress.steps;

  const totalSteps =
    activeProgress.totalSteps;

  const percent = Math.round(
    clamp(activeProgress.progress)
  );

  const remaining =
    Math.max(
      totalSteps - steps,
      0
    );

  const miles =
    steps /
    (STEPS_PER_MILE || 2000);

  const completed =
    activeProgress.completed;

  const completedCount =
    useMemo(() => {
      return marathons.filter(
        marathon =>
          getProgress(
            marathon.id
          ).completed
      ).length;
    }, [
      marathons,
      getProgress,
    ]);

  const unlockedCount =
    useMemo(() => {
      return marathons.filter(
        marathon =>
          getProgress(
            marathon.id
          ).unlocked
      ).length;
    }, [
      marathons,
      getProgress,
    ]);

  const totalRewardCoins =
    useMemo(() => {
      return marathons.reduce(
        (total, marathon) => {
          const progress =
            getProgress(
              marathon.id
            );

          if (!progress.completed) {
            return total;
          }

          return (
            total +
            safeNumber(
              marathon.rewardCoins
            )
          );
        },
        0
      );
    }, [
      marathons,
      getProgress,
    ]);

  const handleOpenMarathon =
    useCallback(
      async marathon => {
        if (
          !marathon?.id ||
          openingId
        ) {
          return;
        }

        const marathonProgress =
          getProgress(
            marathon.id
          );

        if (
          !marathonProgress.unlocked
        ) {
          Alert.alert(
            "Marathon Locked",
            `Complete ${
              safeNumber(
                marathon
                  .requiredCompletedMarathons
              ) === 1
                ? "the previous marathon"
                : `${safeNumber(
                    marathon
                      .requiredCompletedMarathons
                  )} marathons`
            } to unlock ${marathon.title}.`
          );

          return;
        }

        try {
          setOpeningId(
            marathon.id
          );

          let lifetimeSteps = 0;

          try {
            const stepStats =
              await loadStepStats();

            lifetimeSteps =
              safeNumber(
                stepStats
                  ?.lifetimeSteps ??
                  stepStats
                    ?.totalSteps ??
                  stepStats?.steps
              );
          } catch (error) {
            console.log(
              "Load steps before marathon start error:",
              error
            );
          }

          const result =
            await setActiveMarathon(
              marathon.id,
              lifetimeSteps
            );

          if (!result?.saved) {
            Alert.alert(
              "Marathon",
              result?.reason ===
                "marathon-locked"
                ? "This marathon is still locked."
                : "This marathon could not be selected."
            );

            return;
          }

          const savedProgress =
            await loadMarathonProgressMap();

          setProgressMap(
            savedProgress || {}
          );

          setActiveMarathonData({
            marathon,
            progress:
              savedProgress?.[
                marathon.id
              ] ||
              marathonProgress,
          });

          openMarathonDetail(
            marathon.id
          );
        } catch (error) {
          console.log(
            "Open marathon error:",
            error
          );

          Alert.alert(
            "Marathon",
            "This marathon could not be opened."
          );
        } finally {
          setOpeningId(null);
        }
      },
      [
        openingId,
        getProgress,
        openMarathonDetail,
      ]
    );

  if (
    loading &&
    Object.keys(
      progressMap
    ).length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#F2BD22"
          />

          <Text
            style={styles.loadingText}
          >
            Loading marathons...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activeMarathon) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View
          style={styles.emptyContainer}
        >
          <Text
            style={styles.emptyTitle}
          >
            No marathons available
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={navigateBack}
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={styles.headerRow}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigateBack}
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
          style={styles.screenTitle}
        >
          World Marathons
        </Text>

        <Text
          style={
            styles.screenSubtitle
          }
        >
          Complete global 26.2-mile
          challenges and unlock
          rewards.
        </Text>

        <View
          style={styles.heroCard}
        >
          <View
            style={
              styles.heroTopRow
            }
          >
            <View
              style={styles.heroFlagBox}
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
                ACTIVE MARATHON
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                {
                  activeMarathon.title
                }
              </Text>

              <Text
                style={
                  styles.heroLocation
                }
              >
                {
                  activeMarathon.city
                }
                ,{" "}
                {
                  activeMarathon.country
                }
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
                  width: `${clamp(
                    activeProgress.progress
                  )}%`,
                },
              ]}
            />
          </View>

          <View
            style={styles.metricGrid}
          >
            <View
              style={styles.metricCard}
            >
              <Text
                style={
                  styles.metricValue
                }
              >
                {steps.toLocaleString()}
              </Text>

              <Text
                style={
                  styles.metricLabel
                }
              >
                Steps
              </Text>
            </View>

            <View
              style={styles.metricCard}
            >
              <Text
                style={
                  styles.metricValue
                }
              >
                {miles.toFixed(2)}
              </Text>

              <Text
                style={
                  styles.metricLabel
                }
              >
                Miles
              </Text>
            </View>

            <View
              style={styles.metricCard}
            >
              <Text
                style={
                  styles.metricValue
                }
              >
                {remaining.toLocaleString()}
              </Text>

              <Text
                style={
                  styles.metricLabel
                }
              >
                Remaining
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.stepSummary
            }
          >
            {steps.toLocaleString()} /{" "}
            {totalSteps.toLocaleString()}{" "}
            steps
          </Text>

          <Text
            style={
              completed
                ? styles.completedMessage
                : styles.remainingMessage
            }
          >
            {completed
              ? activeProgress.rewardClaimed
                ? "Marathon completed and rewards claimed."
                : "Marathon completed. Open the challenge to claim rewards."
              : `${remaining.toLocaleString()} steps remaining`}
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
              COMPLETION REWARD
            </Text>

            <Text
              style={
                styles.heroRewardValue
              }
            >
              🪙{" "}
              {safeNumber(
                activeMarathon.rewardCoins
              ).toLocaleString()}{" "}
              WCoins
            </Text>

            <Text
              style={
                styles.heroRewardSubtext
              }
            >
              ⭐{" "}
              {safeNumber(
                activeMarathon.rewardPoints
              ).toLocaleString()}{" "}
              Legacy Points • ✨{" "}
              {safeNumber(
                activeMarathon.avatarXP
              ).toLocaleString()}{" "}
              XP
            </Text>
          </View>

       <TouchableOpacity
  style={styles.openActiveButton}
  activeOpacity={0.85}
  onPress={() =>
    handleOpenMarathon(
      activeMarathon
    )
  }
>
  <Text style={styles.openActiveButtonText}>
    {activeProgress.startedAt
      ? "Continue Marathon"
      : "Start Marathon"}
  </Text>
</TouchableOpacity>
           
        </View>

        <View
          style={styles.statsRow}
        >
          <View
            style={styles.statCard}
          >
            <Text
              style={styles.statValue}
            >
              {completedCount}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Completed
            </Text>
          </View>

          <View
            style={styles.statCard}
          >
            <Text
              style={styles.statValue}
            >
              {unlockedCount}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Unlocked
            </Text>
          </View>

          <View
            style={styles.statCard}
          >
            <Text
              style={styles.statValue}
            >
              {totalRewardCoins.toLocaleString()}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Coins Earned
            </Text>
          </View>
        </View>

        <Text
          style={styles.sectionTitle}
        >
          Global 26.2 Challenges
        </Text>

        <Text
          style={
            styles.sectionSubtitle
          }
        >
          Complete each marathon to
          unlock the next destination.
        </Text>

        {marathons.map(
          marathon => {
            const marathonProgress =
              getProgress(
                marathon.id
              );

            const cardPercent =
              Math.round(
                marathonProgress.progress
              );

            const isActive =
              activeMarathon?.id ===
              marathon.id;

            const isOpening =
              openingId ===
              marathon.id;

            return (
              <TouchableOpacity
                key={marathon.id}
                style={[
                  styles.marathonCard,

                  isActive &&
                    styles.activeMarathonCard,

                  !marathonProgress.unlocked &&
                    styles.lockedMarathonCard,

                  marathonProgress.completed &&
                    styles.completedMarathonCard,
                ]}
                activeOpacity={
                  marathonProgress.unlocked
                    ? 0.82
                    : 1
                }
                disabled={isOpening}
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
                      numberOfLines={1}
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
                      styles.marathonReward
                    }
                  >
                    🪙{" "}
                    {safeNumber(
                      marathon.rewardCoins
                    ).toLocaleString()}{" "}
                    W Coins
                  </Text>

                  {marathonProgress.unlocked &&
                    !marathonProgress.completed && (
                      <View
                        style={
                          styles.cardProgressTrack
                        }
                      >
                        <View
                          style={[
                            styles.cardProgressFill,
                            {
                              width: `${clamp(
                                marathonProgress.progress
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

                    marathonProgress.completed &&
                      styles.completedStatusPill,

                    !marathonProgress.unlocked &&
                      styles.lockedStatusPill,
                  ]}
                >
                  {isOpening ? (
                    <ActivityIndicator
                      size="small"
                      color="#F2BD22"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.statusText,

                        marathonProgress.completed &&
                          styles.completedStatusText,

                        !marathonProgress.unlocked &&
                          styles.lockedStatusText,
                      ]}
                    >
                      {!marathonProgress.unlocked
                        ? "Locked"
                        : marathonProgress.completed
                          ? "Completed"
                          : `${cardPercent}%`}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        )}

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
            Marathon Progress
          </Text>

          <Text
            style={
              styles.informationText
            }
          >
            Only steps earned after
            selecting an active marathon
            count toward its 26.2-mile
            goal. Closing the app will not
            erase your progress.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#03060C",
  },

  container: {
    flex: 1,
    backgroundColor: "#03060C",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 18,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 25,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    minHeight: 44,
    justifyContent: "center",
  },

  backButtonText: {
    color: "#F2BD22",
    fontSize: 19,
    fontWeight: "900",
  },

  headerBadge: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F2BD22",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(242,189,34,0.08)",
  },

  headerBadgeText: {
    color: "#F2BD22",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.6,
  },

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  screenSubtitle: {
    color: "#9EACC0",
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 22,
  },

  heroCard: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6C5622",
    backgroundColor: "#101827",
    padding: 22,
    marginBottom: 20,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroFlagBox: {
    width: 66,
    height: 66,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2E405A",
    backgroundColor: "#172235",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  heroFlag: {
    fontSize: 38,
  },

  heroHeading: {
    flex: 1,
  },

  activeLabel: {
    color: "#F2BD22",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 3,
  },

  heroLocation: {
    color: "#AAB7CA",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  percentCircle: {
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 13,
    borderColor: "#F2BD22",
    backgroundColor: "#0A111E",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 24,
  },

  percentValue: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
  },

  percentLabel: {
    color: "#F2BD22",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginTop: 2,
  },

  progressTrack: {
    height: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#202D40",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#F2BD22",
  },

  metricGrid: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: -5,
  },

  metricCard: {
    flex: 1,
    minHeight: 85,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#263850",
    backgroundColor: "#0B1320",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginHorizontal: 5,
  },

  metricValue: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  metricLabel: {
    color: "#98A7BC",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },

  stepSummary: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
  },

  remainingMessage: {
    color: "#F2BD22",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },

  completedMessage: {
    color: "#93FFD3",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },

  heroRewardCard: {
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#6C5622",
    backgroundColor: "rgba(242,189,34,0.07)",
    padding: 17,
    marginTop: 20,
  },

  heroRewardLabel: {
    color: "#F2BD22",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  heroRewardValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  heroRewardSubtext: {
    color: "#C5CFDC",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginTop: 7,
  },

  openActiveButton: {
    minHeight: 60,
    borderRadius: 21,
    backgroundColor: "#F2BD22",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  openActiveButtonText: {
    color: "#07101A",
    fontSize: 18,
    fontWeight: "900",
  },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginBottom: 26,
  },

  statCard: {
    flex: 1,
    minHeight: 98,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#263750",
    backgroundColor: "#0D1522",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginHorizontal: 5,
  },

  statValue: {
    color: "#F2BD22",
    fontSize: 24,
    fontWeight: "900",
  },

  statLabel: {
    color: "#A6B4C7",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#98A7BC",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 17,
  },

  marathonCard: {
    minHeight: 124,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#263750",
    backgroundColor: "#101827",
    paddingHorizontal: 15,
    paddingVertical: 17,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  activeMarathonCard: {
    borderColor: "#F2BD22",
    borderWidth: 2,
  },

  lockedMarathonCard: {
    opacity: 0.6,
  },

  completedMarathonCard: {
    borderColor: "#388C75",
  },

  marathonFlagBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#192437",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  marathonFlag: {
    fontSize: 33,
  },

  marathonInfo: {
    flex: 1,
    paddingRight: 10,
  },

  marathonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  marathonTitle: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  activePill: {
    borderRadius: 10,
    backgroundColor: "#F2BD22",
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
  },

  activePillText: {
    color: "#07101A",
    fontSize: 8,
    fontWeight: "900",
  },

  marathonSubtitle: {
    color: "#9EACC0",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },

  marathonReward: {
    color: "#F2BD22",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 6,
  },

  cardProgressTrack: {
    height: 7,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#253247",
    marginTop: 10,
  },

  cardProgressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#F2BD22",
  },

  statusPill: {
    minWidth: 78,
    minHeight: 43,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#F2BD22",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  statusText: {
    color: "#F2BD22",
    fontSize: 13,
    fontWeight: "900",
  },

  completedStatusPill: {
    borderColor: "#93FFD3",
    backgroundColor: "rgba(147,255,211,0.08)",
  },

  completedStatusText: {
    color: "#93FFD3",
  },

  lockedStatusPill: {
    borderColor: "#667287",
  },

  lockedStatusText: {
    color: "#9DA8B8",
  },

  informationCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#263750",
    backgroundColor: "#0D1522",
    padding: 20,
    marginTop: 12,
  },

  informationTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  informationText: {
    color: "#9EACC0",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    marginTop: 9,
  },
});