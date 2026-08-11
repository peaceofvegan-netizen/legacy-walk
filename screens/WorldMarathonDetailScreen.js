import React, {
  useCallback,
  useEffect,
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



import {
  getMarathonById,
  MARATHON_TOTAL_STEPS,
  STEPS_PER_MILE,
} from "../data/marathonCatalog";

import {
  claimMarathonReward,
  getMarathonProgress,
  setActiveMarathon,
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

export default function WorldMarathonDetailScreen({
  marathonId: marathonIdProp,
  goBack,
  goToCertificate,
  goToPassport,
}) {
  const marathonId =
  marathonIdProp || "nyc";


  const marathon =
    getMarathonById(marathonId);

  const [progress, setProgress] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [starting, setStarting] =
    useState(false);

  const [claiming, setClaiming] =
    useState(false);

  const navigateBack = useCallback(() => {
  if (typeof goBack === "function") {
    goBack();
  }
}, [goBack]);


  const loadProgress =
    useCallback(async () => {
      try {
        setLoading(true);

        if (!marathon?.id) {
          setProgress(null);
          return;
        }

        const savedProgress =
          await getMarathonProgress(
            marathon.id
          );

        setProgress(
          savedProgress || null
        );
      } catch (error) {
        console.log(
          "Load marathon detail error:",
          error
        );

        Alert.alert(
          "Marathon",
          "Your marathon progress could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, [marathon?.id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

 

  const totalSteps =
    safeNumber(
      progress?.totalSteps
    ) ||
    safeNumber(
      marathon?.totalSteps
    ) ||
    MARATHON_TOTAL_STEPS;

  const steps = Math.min(
    totalSteps,
    Math.max(
      0,
      safeNumber(progress?.steps)
    )
  );

  const completed =
    progress?.completed === true ||
    steps >= totalSteps;

  const calculatedPercent =
    totalSteps > 0
      ? (steps / totalSteps) * 100
      : 0;

  const percent = completed
    ? 100
    : clamp(
        progress?.progress ??
          calculatedPercent
      );

  const remaining = Math.max(
    totalSteps - steps,
    0
  );

  const milesCompleted =
    steps /
    (STEPS_PER_MILE || 2000);

  const totalMiles =
    safeNumber(marathon?.miles) ||
    26.2;

  const unlocked =
    progress?.unlocked === true ||
    marathon?.unlockedByDefault ===
      true ||
    completed;

  const rewardClaimed =
    progress?.rewardClaimed === true;

  const startDate =
    progress?.startedAt
      ? new Date(
          progress.startedAt
        ).toLocaleDateString()
      : null;

  const completionDate =
    progress?.completedAt
      ? new Date(
          progress.completedAt
        ).toLocaleDateString()
      : null;

  async function handleStartMarathon() {
    if (
      !marathon?.id ||
      !unlocked ||
      starting
    ) {
      return;
    }

    try {
      setStarting(true);

      let lifetimeSteps = 0;

      try {
        const stepStats =
          await loadStepStats();

        lifetimeSteps =
          safeNumber(
            stepStats?.lifetimeSteps ??
              stepStats?.totalSteps ??
              stepStats?.steps
          );
      } catch (stepError) {
        console.log(
          "Load lifetime steps error:",
          stepError
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
            : "This marathon could not be activated."
        );

        return;
      }

      await loadProgress();

      Alert.alert(
        "Active Marathon",
        `${marathon.title} is now your active marathon. New walking steps will count toward this challenge.`
      );
    } catch (error) {
      console.log(
        "Start marathon error:",
        error
      );

      Alert.alert(
        "Marathon",
        "This marathon could not be started."
      );
    } finally {
      setStarting(false);
    }
  }

  async function handleClaimReward() {
    if (
      !marathon?.id ||
      !completed ||
      rewardClaimed ||
      claiming
    ) {
      return;
    }

    try {
      setClaiming(true);

      const result =
        await claimMarathonReward(
          marathon.id
        );

      if (result?.claimed) {
        await loadProgress();

        Alert.alert(
          "Rewards Claimed!",
          `${safeNumber(
            marathon.rewardCoins
          ).toLocaleString()} WCoins, ${safeNumber(
            marathon.rewardPoints
          ).toLocaleString()} Legacy Points, and ${safeNumber(
            marathon.avatarXP
          ).toLocaleString()} Avatar XP were awarded.`
        );

        return;
      }

      if (
        result?.reason ===
        "reward-already-claimed"
      ) {
        await loadProgress();

        Alert.alert(
          "Rewards Claimed",
          "These marathon rewards were already claimed."
        );

        return;
      }

      Alert.alert(
        "Rewards",
        "The marathon rewards could not be claimed."
      );
    } catch (error) {
      console.log(
        "Claim marathon reward error:",
        error
      );

      Alert.alert(
        "Rewards",
        "The marathon rewards could not be claimed."
      );
    } finally {
      setClaiming(false);
    }
  }

  function handleCertificate() {
    if (!completed) return;

    const params = {
      marathonId: marathon.id,
      marathon,
      progress,
    };

    if (
      typeof goToCertificate ===
      "function"
    ) {
      goToCertificate(params);
      return;
    }

    navigation?.navigate?.(
      "Certificate",
      params
    );
  }

  function handlePassport() {
    if (!completed) return;

    const params = {
      marathonId: marathon.id,
      marathon,
      progress,
    };

    if (
      typeof goToPassport ===
      "function"
    ) {
      goToPassport(params);
      return;
    }

    navigation?.navigate?.(
      "WorldPassport",
      params
    );
  }

  if (loading && !progress) {
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
            Loading marathon...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!marathon) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View
          style={styles.errorContainer}
        >
          <Text
            style={styles.errorIcon}
          >
            🏃
          </Text>

          <Text
            style={styles.errorTitle}
          >
            Marathon Not Found
          </Text>

          <Text
            style={styles.errorText}
          >
            This marathon could not be
            found in the marathon
            catalog.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={navigateBack}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Return to Marathons
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
            style={[
              styles.statusBadge,
              completed &&
                styles.completedBadge,
              !unlocked &&
                styles.lockedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                completed &&
                  styles.completedBadgeText,
                !unlocked &&
                  styles.lockedBadgeText,
              ]}
            >
              {!unlocked
                ? "LOCKED"
                : completed
                  ? "COMPLETED"
                  : "26.2 CHALLENGE"}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View
            style={styles.heroTopRow}
          >
            <View
              style={styles.flagBox}
            >
              <Text
                style={styles.flag}
              >
                {marathon.flag}
              </Text>
            </View>

            <View
              style={styles.heroTextBox}
            >
              <Text
                style={
                  styles.heroEyebrow
                }
              >
                WORLD MARATHON
              </Text>

              <Text
                style={styles.title}
              >
                {marathon.title}
              </Text>

              <Text
                style={styles.location}
              >
                {marathon.city},{" "}
                {marathon.country}
              </Text>
            </View>
          </View>

          <Text
            style={styles.description}
          >
            {marathon.description}
          </Text>

          <View
            style={styles.distanceRow}
          >
            <View
              style={styles.distanceItem}
            >
              <Text
                style={
                  styles.distanceValue
                }
              >
                {totalMiles}
              </Text>

              <Text
                style={
                  styles.distanceLabel
                }
              >
                Miles
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View
              style={styles.distanceItem}
            >
              <Text
                style={
                  styles.distanceValue
                }
              >
                {totalSteps.toLocaleString()}
              </Text>

              <Text
                style={
                  styles.distanceLabel
                }
              >
                Total Steps
              </Text>
            </View>
          </View>
        </View>

        <View
          style={styles.progressCard}
        >
          <View
            style={styles.cardHeaderRow}
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                MARATHON PROGRESS
              </Text>

              <Text
                style={
                  styles.progressTitle
                }
              >
                {completed
                  ? "Finish Line Reached"
                  : "Keep Moving Forward"}
              </Text>
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
                {Math.round(percent)}%
              </Text>
            </View>
          </View>

          <View
            style={styles.progressTrack}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${clamp(
                    percent
                  )}%`,
                },
              ]}
            />
          </View>

          <View
            style={styles.metricsGrid}
          >
            <View
              style={styles.metricCard}
            >
              <Text
                style={styles.metricValue}
              >
                {steps.toLocaleString()}
              </Text>

              <Text
                style={styles.metricLabel}
              >
                Steps Completed
              </Text>
            </View>

            <View
              style={styles.metricCard}
            >
              <Text
                style={styles.metricValue}
              >
                {milesCompleted.toFixed(2)}
              </Text>

              <Text
                style={styles.metricLabel}
              >
                Miles Completed
              </Text>
            </View>
          </View>

          <View
            style={styles.remainingCard}
          >
            <Text
              style={
                styles.remainingLabel
              }
            >
              {completed
                ? "MARATHON STATUS"
                : "STEPS REMAINING"}
            </Text>

            <Text
              style={[
                styles.remainingValue,
                completed &&
                  styles.completedValue,
              ]}
            >
              {completed
                ? "Complete"
                : remaining.toLocaleString()}
            </Text>
          </View>

          {(startDate ||
            completionDate) && (
            <View
              style={styles.dateRow}
            >
              {startDate && (
                <View
                  style={styles.dateItem}
                >
                  <Text
                    style={
                      styles.dateLabel
                    }
                  >
                    Started
                  </Text>

                  <Text
                    style={
                      styles.dateValue
                    }
                  >
                    {startDate}
                  </Text>
                </View>
              )}

              {completionDate && (
                <View
                  style={styles.dateItem}
                >
                  <Text
                    style={
                      styles.dateLabel
                    }
                  >
                    Completed
                  </Text>

                  <Text
                    style={
                      styles.dateValue
                    }
                  >
                    {completionDate}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View
          style={styles.rewardsCard}
        >
          <Text
            style={styles.sectionEyebrow}
          >
            COMPLETION REWARDS
          </Text>

          <Text
            style={styles.rewardsTitle}
          >
            Finish-Line Rewards
          </Text>

          <View
            style={styles.rewardRow}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                🪙
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {safeNumber(
                  marathon.rewardCoins
                ).toLocaleString()}{" "}
                WCoins
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                Added to your wallet
              </Text>
            </View>
          </View>

          <View
            style={styles.rewardRow}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                ⭐
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {safeNumber(
                  marathon.rewardPoints
                ).toLocaleString()}{" "}
                Legacy Points
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                Added to your profile
              </Text>
            </View>
          </View>

          <View
            style={styles.rewardRow}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                ✨
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {safeNumber(
                  marathon.avatarXP
                ).toLocaleString()}{" "}
                Avatar XP
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                Advances your avatar
              </Text>
            </View>
          </View>

          <View
            style={styles.rewardRow}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                🏅
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {marathon.badge}
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                Marathon finisher badge
              </Text>
            </View>
          </View>

          <View
            style={styles.rewardRow}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                📘
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {marathon.passportStamp}
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                World Passport unlock
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.rewardRow,
              styles.lastRewardRow,
            ]}
          >
            <View
              style={styles.rewardIconBox}
            >
              <Text
                style={styles.rewardIcon}
              >
                📜
              </Text>
            </View>

            <View
              style={styles.rewardInfo}
            >
              <Text
                style={styles.rewardValue}
              >
                {marathon.certificate}
              </Text>

              <Text
                style={styles.rewardLabel}
              >
                Completion certificate
              </Text>
            </View>
          </View>
        </View>

        {!unlocked && (
          <View
            style={styles.lockedCard}
          >
            <Text
              style={styles.lockedIcon}
            >
              🔒
            </Text>

            <Text
              style={styles.lockedTitle}
            >
              Marathon Locked
            </Text>

            <Text
              style={styles.lockedText}
            >
              Complete{" "}
              {safeNumber(
                marathon.requiredCompletedMarathons
              ) === 1
                ? "the previous marathon"
                : `${safeNumber(
                    marathon.requiredCompletedMarathons
                  )} marathons`}{" "}
              to unlock this challenge.
            </Text>
          </View>
        )}

        {unlocked && !completed && (
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            disabled={starting}
            onPress={
              handleStartMarathon
            }
          >
            {starting ? (
              <ActivityIndicator
                size="small"
                color="#07101A"
              />
            ) : (
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Set as Active Marathon
              </Text>
            )}
          </TouchableOpacity>
        )}

        {completed &&
          !rewardClaimed && (
            <TouchableOpacity
              style={styles.claimButton}
              activeOpacity={0.85}
              disabled={claiming}
              onPress={
                handleClaimReward
              }
            >
              {claiming ? (
                <ActivityIndicator
                  size="small"
                  color="#07101A"
                />
              ) : (
                <Text
                  style={
                    styles.claimButtonText
                  }
                >
                  Claim Completion Rewards
                </Text>
              )}
            </TouchableOpacity>
          )}

        {completed &&
          rewardClaimed && (
            <View
              style={styles.claimedCard}
            >
              <Text
                style={styles.claimedIcon}
              >
                ✓
              </Text>

              <View
                style={
                  styles.claimedInfo
                }
              >
                <Text
                  style={
                    styles.claimedTitle
                  }
                >
                  Rewards Claimed
                </Text>

                <Text
                  style={
                    styles.claimedText
                  }
                >
                  Your WCoins, points,
                  XP, stamp, badge, and
                  certificate have been
                  registered.
                </Text>
              </View>
            </View>
          )}

        {completed && (
          <View
            style={styles.actionRow}
          >
            <TouchableOpacity
              style={
                styles.secondaryButton
              }
              activeOpacity={0.85}
              onPress={
                handleCertificate
              }
            >
              <Text
                style={
                  styles.secondaryButtonIcon
                }
              >
                📜
              </Text>

              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Certificate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.secondaryButton
              }
              activeOpacity={0.85}
              onPress={
                handlePassport
              }
            >
              <Text
                style={
                  styles.secondaryButtonIcon
                }
              >
                📘
              </Text>

              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Passport
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={styles.infoCard}
        >
          <Text
            style={styles.infoTitle}
          >
            How Marathon Tracking Works
          </Text>

          <Text
            style={styles.infoText}
          >
            Only walking steps earned
            after selecting this marathon
            as active count toward the
            challenge. Your progress is
            saved automatically and will
            not reset when the app closes.
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
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 18,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },

  errorIcon: {
    fontSize: 60,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 18,
  },

  errorText: {
    color: "#9DAABD",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
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

  statusBadge: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F2BD22",
    backgroundColor:
      "rgba(242,189,34,0.08)",
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  statusBadgeText: {
    color: "#F2BD22",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  completedBadge: {
    borderColor: "#93FFD3",
    backgroundColor:
      "rgba(147,255,211,0.08)",
  },

  completedBadgeText: {
    color: "#93FFD3",
  },

  lockedBadge: {
    borderColor: "#586477",
    backgroundColor: "#111926",
  },

  lockedBadgeText: {
    color: "#9CA7B7",
  },

  heroCard: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6C5622",
    backgroundColor: "#101827",
    padding: 22,
    marginBottom: 18,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  flagBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2C3D55",
    backgroundColor: "#192437",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  flag: {
    fontSize: 41,
  },

  heroTextBox: {
    flex: 1,
  },

  heroEyebrow: {
    color: "#F2BD22",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 4,
  },

  location: {
    color: "#93FFD3",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 5,
  },

  description: {
    color: "#A7B4C7",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
    marginTop: 18,
  },

  distanceRow: {
    minHeight: 88,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#293A51",
    backgroundColor: "#0A121E",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  distanceItem: {
    flex: 1,
    alignItems: "center",
  },

  distanceValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  distanceLabel: {
    color: "#97A6BA",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 45,
    backgroundColor: "#2B3C53",
  },

  progressCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#293A51",
    backgroundColor: "#101827",
    padding: 21,
    marginBottom: 18,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionEyebrow: {
    color: "#F2BD22",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  progressTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 5,
  },

  percentCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 7,
    borderColor: "#F2BD22",
    backgroundColor: "#09111D",
    alignItems: "center",
    justifyContent: "center",
  },

  percentValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  progressTrack: {
    height: 15,
    borderRadius: 9,
    overflow: "hidden",
    backgroundColor: "#233148",
    marginTop: 24,
  },

  progressFill: {
    height: "100%",
    borderRadius: 9,
    backgroundColor: "#F2BD22",
  },

  metricsGrid: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginTop: 18,
  },

  metricCard: {
    flex: 1,
    minHeight: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#293A51",
    backgroundColor: "#0A121E",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingHorizontal: 8,
  },

  metricValue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  metricLabel: {
    color: "#97A6BA",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
  },

  remainingCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6A5522",
    backgroundColor:
      "rgba(242,189,34,0.07)",
    padding: 17,
    marginTop: 16,
  },

  remainingLabel: {
    color: "#F2BD22",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  remainingValue: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 5,
  },

  completedValue: {
    color: "#93FFD3",
  },

  dateRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginTop: 16,
  },

  dateItem: {
    flex: 1,
    borderRadius: 17,
    backgroundColor: "#0A121E",
    padding: 14,
    marginHorizontal: 5,
  },

  dateLabel: {
    color: "#8F9DB1",
    fontSize: 11,
    fontWeight: "800",
  },

  dateValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 5,
  },

  rewardsCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#6C5622",
    backgroundColor: "#101827",
    padding: 21,
    marginBottom: 18,
  },

  rewardsTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 10,
  },

  rewardRow: {
    minHeight: 75,
    borderBottomWidth: 1,
    borderBottomColor: "#26364C",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  lastRewardRow: {
    borderBottomWidth: 0,
  },

  rewardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#192437",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  rewardIcon: {
    fontSize: 25,
  },

  rewardInfo: {
    flex: 1,
  },

  rewardValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  rewardLabel: {
    color: "#97A6BA",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },

  lockedCard: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#625023",
    backgroundColor: "#101827",
    alignItems: "center",
    padding: 24,
    marginBottom: 16,
  },

  lockedIcon: {
    fontSize: 38,
  },

  lockedTitle: {
    color: "#F2BD22",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  lockedText: {
    color: "#A0AEC0",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 9,
  },

  primaryButton: {
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: "#F2BD22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  primaryButtonText: {
    color: "#07101A",
    fontSize: 18,
    fontWeight: "900",
  },

  claimButton: {
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: "#93FFD3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  claimButtonText: {
    color: "#07101A",
    fontSize: 18,
    fontWeight: "900",
  },

  claimedCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#93FFD3",
    backgroundColor:
      "rgba(147,255,211,0.08)",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 16,
  },

  claimedIcon: {
    color: "#93FFD3",
    fontSize: 36,
    fontWeight: "900",
    marginRight: 14,
  },

  claimedInfo: {
    flex: 1,
  },

  claimedTitle: {
    color: "#93FFD3",
    fontSize: 20,
    fontWeight: "900",
  },

  claimedText: {
    color: "#D2FCEC",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  actionRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginBottom: 16,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 65,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "#F2BD22",
    backgroundColor: "#101827",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },

  secondaryButtonIcon: {
    fontSize: 23,
  },

  secondaryButtonText: {
    color: "#F2BD22",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },

  infoCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#293A51",
    backgroundColor: "#0D1522",
    padding: 19,
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  infoText: {
    color: "#9EACC0",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
    marginTop: 8,
  },
});