// screens/HydrationCoachScreen.js

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

const HYDRATION_KEYS = [
  "hydrationData",
  "dailyHydration",
];

const DEFAULT_GOAL = 100;

const ADD_AMOUNTS = [
  8,
  12,
  16,
  24,
];

const GOAL_OPTIONS = [
  64,
  80,
  100,
  128,
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

function getHydrationStatus(
  progress
) {
  if (progress >= 100) {
    return {
      title:
        "Daily Goal Complete",

      message:
        "Excellent work. Continue drinking according to thirst and activity.",

      color: "#42F58D",

      icon:
        "checkmark-circle",
    };
  }

  if (progress >= 75) {
    return {
      title:
        "Almost There",

      message:
        "You are close to your hydration goal. Keep your water nearby.",

      color: "#7EE8C4",

      icon: "water",
    };
  }

  if (progress >= 40) {
    return {
      title:
        "Building Momentum",

      message:
        "Good progress. Add water gradually throughout the rest of your day.",

      color: "#49D8FF",

      icon:
        "water-outline",
    };
  }

  return {
    title:
      "Hydration Needed",

    message:
      "Start with a glass of water and keep recording your intake today.",

    color: "#FFC94A",

    icon:
      "alert-circle",
  };
}

export default function HydrationCoachScreen({
  navigation,
  goBack,
  goToRecovery,
  goToAIWellness,
}) {
  const [
    amount,
    setAmount,
  ] = useState(0);

  const [
    goal,
    setGoal,
  ] = useState(
    DEFAULT_GOAL
  );

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const progress = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          (
            amount /
            Math.max(
              goal,
              1
            )
          ) * 100
        )
      ),
    [
      amount,
      goal,
    ]
  );

  const remaining =
    Math.max(
      goal - amount,
      0
    );

  const status = useMemo(
    () =>
      getHydrationStatus(
        progress
      ),
    [progress]
  );

  useEffect(() => {
    const loadHydration =
      async () => {
        try {
          const saved =
            await AsyncStorage.getItem(
              "hydrationData"
            );

          const parsed =
            safelyParseJSON(
              saved,
              null
            );

          if (!parsed) {
            return;
          }

          const savedGoal =
            Math.max(
              1,
              Number(
                parsed.goal ??
                parsed.hydrationGoal ??
                parsed.dailyGoal
              ) ||
                DEFAULT_GOAL
            );

          setGoal(savedGoal);

          if (
            parsed.date ===
            getTodayKey()
          ) {
            const savedAmount =
              Math.max(
                0,
                Number(
                  parsed.amount ??
                  parsed.ounces ??
                  parsed.hydration ??
                  parsed.current ??
                  parsed.todayAmount
                ) || 0
              );

            setAmount(
              savedAmount
            );

            setLastUpdated(
              parsed.timestamp ||
                ""
            );
          } else {
            setAmount(0);
          }
        } catch (error) {
          console.log(
            "Hydration load error:",
            error
          );
        }
      };

    loadHydration();
  }, []);

  const saveHydration =
    async (
      nextAmount = amount,
      nextGoal = goal
    ) => {
      if (isSaving) {
        return;
      }

      setIsSaving(true);

      try {
        const timestamp =
          new Date().toISOString();

        const safeAmount =
          Math.max(
            0,
            Number(
              nextAmount
            ) || 0
          );

        const safeGoal =
          Math.max(
            1,
            Number(
              nextGoal
            ) ||
              DEFAULT_GOAL
          );

        const record = {
          amount:
            safeAmount,

          ounces:
            safeAmount,

          hydration:
            safeAmount,

          current:
            safeAmount,

          todayAmount:
            safeAmount,

          goal:
            safeGoal,

          hydrationGoal:
            safeGoal,

          dailyGoal:
            safeGoal,

          date:
            getTodayKey(),

          timestamp,
        };

        const serialized =
          JSON.stringify(
            record
          );

        await AsyncStorage.multiSet(
          HYDRATION_KEYS.map(
            (key) => [
              key,
              serialized,
            ]
          )
        );

        setLastUpdated(
          timestamp
        );
      } catch (error) {
        console.log(
          "Hydration save error:",
          error
        );

        Alert.alert(
          "Save Error",
          "Your hydration could not be saved. Please try again."
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };

  const addWater =
    async (ounces) => {
      const nextAmount =
        amount + ounces;

      setAmount(
        nextAmount
      );

      await saveHydration(
        nextAmount,
        goal
      );
    };

  const removeWater =
    async () => {
      const nextAmount =
        Math.max(
          amount - 8,
          0
        );

      setAmount(
        nextAmount
      );

      await saveHydration(
        nextAmount,
        goal
      );
    };

  const changeGoal =
    async (nextGoal) => {
      setGoal(
        nextGoal
      );

      await saveHydration(
        amount,
        nextGoal
      );
    };

  const resetToday = () => {
    Alert.alert(
      "Reset Today’s Water?",
      "This resets only today’s hydration amount.",
      [
        {
          text:
            "Cancel",

          style:
            "cancel",
        },
        {
          text:
            "Reset",

          style:
            "destructive",

          onPress:
            async () => {
              setAmount(0);

              await saveHydration(
                0,
                goal
              );
            },
        },
      ]
    );
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

  const formattedTime =
    lastUpdated
      ? new Date(
          lastUpdated
        ).toLocaleTimeString(
          [],
          {
            hour:
              "numeric",

            minute:
              "2-digit",
          }
        )
      : "";

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
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
              activeOpacity={
                0.82
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
                Hydration Coach
              </Text>
            </View>

            <View
              style={
                styles.headerIcon
              }
            >
              <Ionicons
                name="water"
                size={26}
                color=
                  "#49D8FF"
              />
            </View>
          </View>

          <LinearGradient
            colors={[
              "#0A2947",
              "#071C34",
              "#061326",
            ]}
            style={
              styles.heroCard
            }
          >
            <Text
              style={
                styles.heroLabel
              }
            >
              TODAY’S WATER
            </Text>

            <View
              style={
                styles.amountRow
              }
            >
              <Text
                style={
                  styles.amount
                }
              >
                {amount.toLocaleString()}
              </Text>

              <Text
                style={
                  styles.unit
                }
              >
                oz
              </Text>
            </View>

            <Text
              style={
                styles.goalText
              }
            >
              of{" "}
              {goal.toLocaleString()}{" "}
              oz goal
            </Text>

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
                      `${progress}%`,
                  },
                ]}
              />
            </View>

            <View
              style={
                styles.progressDetails
              }
            >
              <Text
                style={
                  styles.progressPercent
                }
              >
                {progress}%
                complete
              </Text>

              <Text
                style={
                  styles.remainingText
                }
              >
                {remaining > 0
                  ? `${remaining} oz remaining`
                  : "Goal reached"}
              </Text>
            </View>

            <View
              style={
                styles.statusCard
              }
            >
              <Ionicons
                name={
                  status.icon
                }
                size={25}
                color={
                  status.color
                }
              />

              <View
                style={
                  styles.statusCopy
                }
              >
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

                <Text
                  style={
                    styles.statusMessage
                  }
                >
                  {status.message}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Add Water
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Select the amount
            you just finished
            drinking.
          </Text>

          <View
            style={
              styles.amountGrid
            }
          >
            {ADD_AMOUNTS.map(
              (ounces) => (
                <TouchableOpacity
                  key={
                    ounces
                  }
                  style={
                    styles.amountButton
                  }
                  onPress={() =>
                    addWater(
                      ounces
                    )
                  }
                  disabled={
                    isSaving
                  }
                  activeOpacity={
                    0.82
                  }
                >
                  <Ionicons
                    name=
                      "add-circle"
                    size={22}
                    color=
                      "#49D8FF"
                  />

                  <Text
                    style={
                      styles.amountButtonText
                    }
                  >
                    +{ounces} oz
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.undoButton,
              amount === 0 &&
                styles.disabledButton,
            ]}
            onPress={
              removeWater
            }
            disabled={
              isSaving ||
              amount === 0
            }
          >
            <Ionicons
              name=
                "remove-circle-outline"
              size={21}
              color=
                "#FF8A98"
            />

            <Text
              style={
                styles.undoText
              }
            >
              Remove 8 oz
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Daily Goal
          </Text>

          <View
            style={
              styles.goalOptions
            }
          >
            {GOAL_OPTIONS.map(
              (option) => {
                const selected =
                  option ===
                  goal;

                return (
                  <TouchableOpacity
                    key={
                      option
                    }
                    style={[
                      styles.goalButton,
                      selected &&
                        styles.goalButtonSelected,
                    ]}
                    onPress={() =>
                      changeGoal(
                        option
                      )
                    }
                    disabled={
                      isSaving
                    }
                  >
                    <Text
                      style={[
                        styles.goalButtonText,
                        selected &&
                          styles.goalButtonTextSelected,
                      ]}
                    >
                      {option} oz
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          <View
            style={
              styles.quickTools
            }
          >
            <TouchableOpacity
              style={
                styles.toolButton
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
                size={22}
                color=
                  "#42F58D"
              />

              <Text
                style={
                  styles.toolText
                }
              >
                Recovery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.toolButton
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
                  styles.toolText
                }
              >
                AI Wellness
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={
              styles.updateCard
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
                styles.updateText
              }
            >
              {lastUpdated
                ? `Last updated ${formattedTime}`
                : "No water recorded today"}
            </Text>

            <TouchableOpacity
              onPress={
                resetToday
              }
            >
              <Text
                style={
                  styles.resetText
                }
              >
                Reset
              </Text>
            </TouchableOpacity>
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
              Hydration needs
              vary. Follow
              professional
              guidance if you
              have a medical
              condition or fluid
              restriction.
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
      alignItems: "center",
      marginBottom: 24,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
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
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "rgba(73,216,255,0.12)",
      borderWidth: 1,
      borderColor:
        "rgba(73,216,255,0.4)",
    },

    heroCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor:
        "#31577E",
      padding: 22,
    },

    heroLabel: {
      color: "#80E8FF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.5,
    },

    amountRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 8,
    },

    amount: {
      color: "#FFFFFF",
      fontSize: 66,
      lineHeight: 72,
      fontWeight: "900",
    },

    unit: {
      color: "#49D8FF",
      fontSize: 22,
      fontWeight: "900",
      marginBottom: 10,
      marginLeft: 6,
    },

    goalText: {
      color: "#A9BCD2",
      fontSize: 16,
      fontWeight: "700",
    },

    progressTrack: {
      height: 13,
      borderRadius: 999,
      backgroundColor:
        "#173553",
      overflow: "hidden",
      marginTop: 22,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor:
        "#49D8FF",
    },

    progressDetails: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 10,
    },

    progressPercent: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    remainingText: {
      color: "#9EB4CE",
      fontSize: 13,
      fontWeight: "700",
    },

    statusCard: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      backgroundColor:
        "#07192D",
      borderRadius: 18,
      padding: 15,
      marginTop: 20,
    },

    statusCopy: {
      flex: 1,
      marginLeft: 11,
    },

    statusTitle: {
      fontSize: 17,
      fontWeight: "900",
      marginBottom: 4,
    },

    statusMessage: {
      color: "#B8C8DB",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
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

    amountGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    amountButton: {
      width: "48.5%",
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#08182C",
      borderWidth: 1,
      borderColor:
        "#2D577B",
      borderRadius: 19,
      marginBottom: 12,
    },

    amountButtonText: {
      color: "#EAF6FF",
      fontSize: 17,
      fontWeight: "900",
      marginLeft: 8,
    },

    undoButton: {
      minHeight: 52,
      borderRadius: 17,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "rgba(255,113,132,0.08)",
      borderWidth: 1,
      borderColor:
        "rgba(255,113,132,0.28)",
    },

    disabledButton: {
      opacity: 0.45,
    },

    undoText: {
      color: "#FF9AA7",
      fontSize: 15,
      fontWeight: "900",
      marginLeft: 7,
    },

    goalOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    goalButton: {
      width: "48.5%",
      minHeight: 54,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 17,
      backgroundColor:
        "#08182C",
      borderWidth: 1,
      borderColor:
        "#2D577B",
      marginBottom: 12,
    },

    goalButtonSelected: {
      backgroundColor:
        "#49D8FF",
      borderColor:
        "#49D8FF",
    },

    goalButtonText: {
      color: "#DCEBFA",
      fontSize: 16,
      fontWeight: "900",
    },

    goalButtonTextSelected: {
      color: "#02111F",
    },

    quickTools: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 14,
    },

    toolButton: {
      width: "48.5%",
      minHeight: 62,
      borderRadius: 19,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#08182C",
      borderWidth: 1,
      borderColor:
        "#264666",
    },

    toolText: {
      color: "#EAF2FC",
      fontSize: 15,
      fontWeight: "900",
      marginLeft: 8,
    },

    updateCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderRadius: 17,
      backgroundColor:
        "#07192D",
      marginTop: 18,
    },

    updateText: {
      flex: 1,
      color: "#9EB4CE",
      fontSize: 13,
      fontWeight: "700",
      marginLeft: 8,
    },

    resetText: {
      color: "#FF8A98",
      fontSize: 13,
      fontWeight: "900",
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
      marginTop: 18,
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