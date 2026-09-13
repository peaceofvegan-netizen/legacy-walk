// screens/SleepCoachScreen.js

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SLEEP_KEYS = [
  "sleepData",
  "dailySleep",
];

const SLEEP_GOAL = 8;

const QUALITY_OPTIONS = [
  {
    value: 1,
    label: "Poor",
  },
  {
    value: 2,
    label: "Fair",
  },
  {
    value: 3,
    label: "Good",
  },
  {
    value: 4,
    label: "Very Good",
  },
  {
    value: 5,
    label: "Excellent",
  },
];

function getTodayKey() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function safelyParseJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function calculateSleepScore(
  hours,
  quality,
  interruptions,
  rested
) {
  const durationScore =
    Math.max(
      0,
      100 -
        Math.abs(
          SLEEP_GOAL - hours
        ) *
          18
    );

  const qualityScore =
    ((quality - 1) / 4) *
    100;

  const interruptionScore =
    Math.max(
      0,
      100 -
        interruptions * 22
    );

  const restedScore =
    ((rested - 1) / 4) *
    100;

  return Math.round(
    durationScore * 0.4 +
      qualityScore * 0.25 +
      interruptionScore *
        0.15 +
      restedScore * 0.2
  );
}

function getSleepStatus(
  score,
  hours
) {
  if (score >= 85) {
    return {
      title:
        "Restored and Ready",

      color:
        "#42F58D",

      icon:
        "sunny",

      message:
        "Your sleep check-in supports normal walking activity today.",
    };
  }

  if (score >= 65) {
    return {
      title:
        "Good Foundation",

      color:
        "#73A8FF",

      icon:
        "moon",

      message:
        "Your sleep was solid. Maintain a comfortable pace and regular hydration.",
    };
  }

  if (score >= 45) {
    return {
      title:
        "Take It Gently",

      color:
        "#FFC94A",

      icon:
        "cloudy-night",

      message:
        "Consider a lighter walk and an earlier wind-down tonight.",
    };
  }

  return {
    title:
      hours < 5
        ? "Sleep Recovery Needed"
        : "Rest Recommended",

    color:
      "#FF7184",

    icon:
      "bed",

    message:
      "Prioritize rest and avoid pushing intensity when you feel unusually fatigued.",
  };
}

function RatingRow({
  title,
  subtitle,
  value,
  onChange,
  color = "#A978FF",
}) {
  return (
    <View
      style={
        styles.ratingCard
      }
    >
      <Text
        style={
          styles.ratingTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.ratingSubtitle
        }
      >
        {subtitle}
      </Text>

      <View
        style={
          styles.ratingButtons
        }
      >
        {[1, 2, 3, 4, 5].map(
          (number) => {
            const selected =
              number === value;

            return (
              <TouchableOpacity
                key={number}
                style={[
                  styles.ratingButton,
                  selected && {
                    backgroundColor:
                      color,

                    borderColor:
                      color,
                  },
                ]}
                onPress={() =>
                  onChange(
                    number
                  )
                }
                accessibilityRole=
                  "button"
                accessibilityState={{
                  selected,
                }}
              >
                <Text
                  style={[
                    styles.ratingNumber,
                    selected &&
                      styles.ratingNumberSelected,
                  ]}
                >
                  {number}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}

export default function SleepCoachScreen({
  navigation,
  goBack,
  goToRecovery,
  goToBreathing,
  goToAIWellness,
}) {
  const [
    hours,
    setHours,
  ] = useState(7.5);

  const [
    quality,
    setQuality,
  ] = useState(3);

  const [
    interruptions,
    setInterruptions,
  ] = useState(0);

  const [
    rested,
    setRested,
  ] = useState(3);

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const sleepScore =
    useMemo(
      () =>
        calculateSleepScore(
          hours,
          quality,
          interruptions,
          rested
        ),
      [
        hours,
        quality,
        interruptions,
        rested,
      ]
    );

  const status =
    useMemo(
      () =>
        getSleepStatus(
          sleepScore,
          hours
        ),
      [
        sleepScore,
        hours,
      ]
    );

  const durationProgress =
    Math.min(
      100,
      Math.round(
        (
          hours /
          SLEEP_GOAL
        ) * 100
      )
    );

  useEffect(() => {
    const loadSleep =
      async () => {
        try {
          const saved =
            await AsyncStorage.getItem(
              "sleepData"
            );

          const parsed =
            safelyParseJSON(
              saved,
              null
            );

          if (
            !parsed ||
            parsed.date !==
              getTodayKey()
          ) {
            return;
          }

          setHours(
            Math.max(
              0,
              Math.min(
                16,
                Number(
                  parsed.hours
                ) || 0
              )
            )
          );

          setQuality(
            Math.max(
              1,
              Math.min(
                5,
                Number(
                  parsed.quality
                ) || 3
              )
            )
          );

          setInterruptions(
            Math.max(
              0,
              Math.min(
                10,
                Number(
                  parsed.interruptions
                ) || 0
              )
            )
          );

          setRested(
            Math.max(
              1,
              Math.min(
                5,
                Number(
                  parsed.rested
                ) || 3
              )
            )
          );

          setLastUpdated(
            parsed.timestamp ||
              ""
          );
        } catch (error) {
          console.log(
            "Sleep load error:",
            error
          );
        }
      };

    loadSleep();
  }, []);

  const adjustHours = (
    change
  ) => {
    setHours(
      (current) =>
        Math.max(
          0,
          Math.min(
            16,
            Math.round(
              (
                current +
                change
              ) * 2
            ) / 2
          )
        )
    );
  };

  const saveSleep =
    async () => {
      if (isSaving) {
        return;
      }

      setIsSaving(true);

      try {
        const timestamp =
          new Date().toISOString();

        const selectedQuality =
          QUALITY_OPTIONS.find(
            (item) =>
              item.value ===
              quality
          )?.label ||
          "Good";

        const record = {
          hours,

          sleepHours:
            hours,

          goal:
            SLEEP_GOAL,

          sleepGoal:
            SLEEP_GOAL,

          quality,

          qualityLabel:
            selectedQuality,

          interruptions,

          rested,

          score:
            sleepScore,

          sleepScore,

          status:
            status.title,

          date:
            getTodayKey(),

          timestamp,
        };

        const serialized =
          JSON.stringify(
            record
          );

        await AsyncStorage.multiSet(
          SLEEP_KEYS.map(
            (key) => [
              key,
              serialized,
            ]
          )
        );

        setLastUpdated(
          timestamp
        );

        Alert.alert(
          "Sleep Recorded",
          `Your sleep score is ${sleepScore}%. Your AI Wellness Coach can now use this check-in.`
        );
      } catch (error) {
        console.log(
          "Sleep save error:",
          error
        );

        Alert.alert(
          "Save Error",
          "Your sleep check-in could not be saved. Please try again."
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };

  const handleBack = () => {
    if (
      typeof goBack ===
      "function"
    ) {
      goBack();
      return;
    }

    if (
      navigation?.canGoBack?.()
    ) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.(
      "AIWellness"
    );
  };

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <LinearGradient
        colors={[
          "#020611",
          "#10112E",
          "#020611",
        ]}
        style={
          styles.container
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <View
            style={
              styles.header
            }
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={
                handleBack
              }
            >
              <Ionicons
                name=
                  "chevron-back"
                size={25}
                color=
                  "#FFC94A"
              />
            </TouchableOpacity>

            <View
              style={
                styles.headerCopy
              }
            >
              <Text
                style={
                  styles.eyebrow
                }
              >
                LEGATHON WELLNESS
              </Text>

              <Text
                style={
                  styles.title
                }
              >
                Sleep Coach
              </Text>
            </View>

            <View
              style={
                styles.headerIcon
              }
            >
              <Ionicons
                name="moon"
                size={25}
                color=
                  "#A978FF"
              />
            </View>
          </View>

          <LinearGradient
            colors={[
              "#1A1847",
              "#101B3A",
              "#071326",
            ]}
            style={
              styles.heroCard
            }
          >
            <View
              style={
                styles.scoreHeader
              }
            >
              <View
                style={
                  styles.scoreCopy
                }
              >
                <Text
                  style={
                    styles.heroLabel
                  }
                >
                  LAST NIGHT’S SLEEP
                </Text>

                <Text
                  style={[
                    styles.statusTitle,
                    {
                      color:
                        status.color,
                    },
                  ]}
                >
                  {status.title}
                </Text>
              </View>

              <View
                style={[
                  styles.scoreCircle,
                  {
                    borderColor:
                      status.color,
                  },
                ]}
              >
                <Text
                  style={
                    styles.scoreNumber
                  }
                >
                  {sleepScore}
                </Text>

                <Text
                  style={
                    styles.percent
                  }
                >
                  %
                </Text>
              </View>
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
                      `${durationProgress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={
                styles.heroMessage
              }
            >
              {status.message}
            </Text>
          </LinearGradient>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Hours Slept
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Adjust in
            30-minute
            increments.
          </Text>

          <View
            style={
              styles.hoursCard
            }
          >
            <TouchableOpacity
              style={
                styles.adjustButton
              }
              onPress={() =>
                adjustHours(
                  -0.5
                )
              }
            >
              <Ionicons
                name="remove"
                size={28}
                color=
                  "#DDE8F7"
              />
            </TouchableOpacity>

            <View
              style={
                styles.hoursCenter
              }
            >
              <Text
                style={
                  styles.hoursNumber
                }
              >
                {hours.toFixed(
                  1
                )}
              </Text>

              <Text
                style={
                  styles.hoursLabel
                }
              >
                hours
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.adjustButton
              }
              onPress={() =>
                adjustHours(
                  0.5
                )
              }
            >
              <Ionicons
                name="add"
                size={28}
                color=
                  "#DDE8F7"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Sleep Quality
          </Text>

          <View
            style={
              styles.qualityGrid
            }
          >
            {QUALITY_OPTIONS.map(
              (option) => {
                const selected =
                  option.value ===
                  quality;

                return (
                  <TouchableOpacity
                    key={
                      option.value
                    }
                    style={[
                      styles.qualityButton,
                      selected &&
                        styles.qualityButtonSelected,
                    ]}
                    onPress={() =>
                      setQuality(
                        option.value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        selected &&
                          styles.qualityTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          <View
            style={
              styles.interruptionCard
            }
          >
            <View
              style={
                styles.interruptionCopy
              }
            >
              <Text
                style={
                  styles.interruptionTitle
                }
              >
                Night
                Interruptions
              </Text>

              <Text
                style={
                  styles.interruptionSubtitle
                }
              >
                How many times
                did you wake up?
              </Text>
            </View>

            <View
              style={
                styles.counterRow
              }
            >
              <TouchableOpacity
                style={
                  styles.counterButton
                }
                onPress={() =>
                  setInterruptions(
                    (current) =>
                      Math.max(
                        0,
                        current -
                          1
                      )
                  )
                }
              >
                <Ionicons
                  name=
                    "remove"
                  size={22}
                  color=
                    "#DDE8F7"
                />
              </TouchableOpacity>

              <Text
                style={
                  styles.counterNumber
                }
              >
                {interruptions}
              </Text>

              <TouchableOpacity
                style={
                  styles.counterButton
                }
                onPress={() =>
                  setInterruptions(
                    (current) =>
                      Math.min(
                        10,
                        current +
                          1
                      )
                  )
                }
              >
                <Ionicons
                  name="add"
                  size={22}
                  color=
                    "#DDE8F7"
                />
              </TouchableOpacity>
            </View>
          </View>

          <RatingRow
            title=
              "Morning Readiness"
            subtitle=
              "How rested did you feel after waking?"
            value={rested}
            onChange={
              setRested
            }
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving &&
                styles.disabledButton,
            ]}
            onPress={
              saveSleep
            }
            disabled={
              isSaving
            }
          >
            <Ionicons
              name={
                isSaving
                  ? "hourglass"
                  : "checkmark-circle"
              }
              size={23}
              color=
                "#07101F"
            />

            <Text
              style={
                styles.saveButtonText
              }
            >
              {isSaving
                ? "Saving Sleep..."
                : "Save Sleep Check-In"}
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Sleep Tools
          </Text>

          <View
            style={
              styles.toolsRow
            }
          >
            <TouchableOpacity
              style={
                styles.toolCard
              }
              onPress={
                goToBreathing
              }
              disabled={
                typeof goToBreathing !==
                "function"
              }
            >
              <Ionicons
                name="leaf"
                size={25}
                color=
                  "#42F58D"
              />

              <Text
                style={
                  styles.toolTitle
                }
              >
                Wind Down
              </Text>

              <Text
                style={
                  styles.toolSubtitle
                }
              >
                Calm breathing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.toolCard
              }
              onPress={
                goToRecovery
              }
              disabled={
                typeof goToRecovery !==
                "function"
              }
            >
              <Ionicons
                name="heart"
                size={25}
                color=
                  "#FF7184"
              />

              <Text
                style={
                  styles.toolTitle
                }
              >
                Recovery
              </Text>

              <Text
                style={
                  styles.toolSubtitle
                }
              >
                Check readiness
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={
              styles.aiButton
            }
            onPress={
              goToAIWellness
            }
            disabled={
              typeof goToAIWellness !==
              "function"
            }
          >
            <Ionicons
              name="sparkles"
              size={22}
              color=
                "#FFC94A"
            />

            <Text
              style={
                styles.aiButtonText
              }
            >
              Return to AI
              Wellness
            </Text>

            <Ionicons
              name=
                "chevron-forward"
              size={20}
              color=
                "#FFC94A"
            />
          </TouchableOpacity>

          <View
            style={
              styles.lastUpdatedCard
            }
          >
            <Ionicons
              name=
                "time-outline"
              size={18}
              color=
                "#8FA8C4"
            />

            <Text
              style={
                styles.lastUpdatedText
              }
            >
              {lastUpdated
                ? `Last updated ${new Date(
                    lastUpdated
                  ).toLocaleString()}`
                : "No sleep check-in recorded today"}
            </Text>
          </View>

          <View
            style={
              styles.noticeCard
            }
          >
            <Ionicons
              name=
                "information-circle"
              size={22}
              color=
                "#73A8FF"
            />

            <Text
              style={
                styles.noticeText
              }
            >
              This sleep
              check-in is
              informational
              and is not
              medical advice.
              Speak with a
              qualified
              professional
              about persistent
              sleep problems.
            </Text>
          </View>

          <View
            style={{
              height: 140,
            }}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#020611",
    },

    container: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },

    header: {
      flexDirection: "row",
      alignItems:
        "center",
      marginBottom: 24,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#0B1C33",
      borderWidth: 1,
      borderColor:
        "#29496B",
    },

    headerCopy: {
      flex: 1,
      paddingHorizontal: 14,
    },

    eyebrow: {
      color: "#FFC94A",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2.7,
      marginBottom: 4,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
    },

    headerIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "rgba(169,120,255,0.14)",
      borderWidth: 1,
      borderColor:
        "rgba(169,120,255,0.42)",
    },

    heroCard: {
      borderRadius: 28,
      padding: 22,
      borderWidth: 1,
      borderColor:
        "#514589",
    },

    scoreHeader: {
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    scoreCopy: {
      flex: 1,
      paddingRight: 12,
    },

    heroLabel: {
      color: "#C2A8FF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.4,
    },

    statusTitle: {
      fontSize: 23,
      fontWeight: "900",
      marginTop: 8,
    },

    scoreCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 8,
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#081126",
    },

    scoreNumber: {
      color: "#FFFFFF",
      fontSize: 31,
      fontWeight: "900",
    },

    percent: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 11,
    },

    progressTrack: {
      height: 11,
      borderRadius: 999,
      backgroundColor:
        "#252A52",
      overflow: "hidden",
      marginTop: 22,
    },

    progressFill: {
      height: "100%",
      backgroundColor:
        "#A978FF",
      borderRadius: 999,
    },

    heroMessage: {
      color: "#C0CAE0",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "600",
      marginTop: 17,
    },

    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 30,
      marginBottom: 7,
    },

    sectionSubtitle: {
      color: "#98ABC2",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "600",
      marginBottom: 15,
    },

    hoursCard: {
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 24,
      padding: 18,
    },

    adjustButton: {
      width: 55,
      height: 55,
      borderRadius: 18,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#19284A",
      borderWidth: 1,
      borderColor:
        "#4B5986",
    },

    hoursCenter: {
      alignItems:
        "center",
    },

    hoursNumber: {
      color: "#FFFFFF",
      fontSize: 45,
      fontWeight: "900",
    },

    hoursLabel: {
      color: "#A978FF",
      fontSize: 15,
      fontWeight: "900",
    },

    qualityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    qualityButton: {
      width: "48.5%",
      minHeight: 54,
      borderRadius: 17,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      marginBottom: 12,
    },

    qualityButtonSelected: {
      backgroundColor:
        "#A978FF",
      borderColor:
        "#A978FF",
    },

    qualityText: {
      color: "#DCE5F4",
      fontSize: 15,
      fontWeight: "900",
    },

    qualityTextSelected: {
      color: "#07101F",
    },

    interruptionCard: {
      flexDirection: "row",
      alignItems:
        "center",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 22,
      padding: 17,
      marginTop: 4,
    },

    interruptionCopy: {
      flex: 1,
      paddingRight: 12,
    },

    interruptionTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    interruptionSubtitle: {
      color: "#98ABC2",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
      marginTop: 3,
    },

    counterRow: {
      flexDirection: "row",
      alignItems:
        "center",
    },

    counterButton: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#19284A",
    },

    counterNumber: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "900",
      minWidth: 38,
      textAlign:
        "center",
    },

    ratingCard: {
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 22,
      padding: 17,
      marginTop: 14,
    },

    ratingTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    ratingSubtitle: {
      color: "#98ABC2",
      fontSize: 13,
      fontWeight: "600",
      marginTop: 3,
    },

    ratingButtons: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 16,
    },

    ratingButton: {
      width: 47,
      height: 43,
      borderRadius: 14,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#19284A",
      borderWidth: 1,
      borderColor:
        "#4B5986",
    },

    ratingNumber: {
      color: "#DCE5F4",
      fontSize: 17,
      fontWeight: "900",
    },

    ratingNumberSelected: {
      color: "#07101F",
    },

    saveButton: {
      minHeight: 60,
      borderRadius: 999,
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#FFC94A",
      marginTop: 18,
    },

    disabledButton: {
      opacity: 0.55,
    },

    saveButtonText: {
      color: "#07101F",
      fontSize: 17,
      fontWeight: "900",
      marginLeft: 9,
    },

    toolsRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
    },

    toolCard: {
      width: "48.5%",
      minHeight: 116,
      borderRadius: 20,
      padding: 16,
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
    },

    toolTitle: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 13,
    },

    toolSubtitle: {
      color: "#98ABC2",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
    },

    aiButton: {
      minHeight: 58,
      borderRadius: 19,
      flexDirection: "row",
      alignItems:
        "center",
      paddingHorizontal: 18,
      backgroundColor:
        "#101B34",
      borderWidth: 1,
      borderColor:
        "#514589",
      marginTop: 14,
    },

    aiButtonText: {
      flex: 1,
      color: "#EAF1FB",
      fontSize: 16,
      fontWeight: "900",
      marginLeft: 10,
    },

    lastUpdatedCard: {
      flexDirection: "row",
      alignItems:
        "center",
      backgroundColor:
        "#071426",
      borderRadius: 17,
      padding: 15,
      marginTop: 16,
    },

    lastUpdatedText: {
      flex: 1,
      color: "#8FA8C4",
      fontSize: 12,
      fontWeight: "700",
      marginLeft: 8,
    },

    noticeCard: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      padding: 16,
      borderRadius: 19,
      backgroundColor:
        "rgba(115,168,255,0.08)",
      borderWidth: 1,
      borderColor:
        "rgba(115,168,255,0.25)",
      marginTop: 16,
    },

    noticeText: {
      flex: 1,
      color: "#9EB4CE",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600",
      marginLeft: 10,
    },
  });