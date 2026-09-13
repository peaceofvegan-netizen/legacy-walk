// screens/RecoveryCoachScreen.js

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

const RECOVERY_KEYS = [
  "recoveryData",
  "dailyRecovery",
];

const INITIAL_CHECK_IN = {
  energy: 3,
  soreness: 2,
  stress: 2,
  sleep: 3,
  hydration: 3,
};

const CHECK_IN_ITEMS = [
  {
    key: "energy",
    title: "Energy",
    subtitle: "How energized do you feel?",
    icon: "flash",
    color: "#FFC94A",
    low: "Low",
    high: "High",
  },
  {
    key: "soreness",
    title: "Muscle Soreness",
    subtitle: "How sore does your body feel?",
    icon: "body",
    color: "#FF7184",
    low: "None",
    high: "Severe",
  },
  {
    key: "stress",
    title: "Stress",
    subtitle: "How mentally stressed do you feel?",
    icon: "pulse",
    color: "#A978FF",
    low: "Calm",
    high: "High",
  },
  {
    key: "sleep",
    title: "Sleep Quality",
    subtitle: "How restorative was your sleep?",
    icon: "moon",
    color: "#73A8FF",
    low: "Poor",
    high: "Great",
  },
  {
    key: "hydration",
    title: "Hydration",
    subtitle: "How hydrated do you feel?",
    icon: "water",
    color: "#49D8FF",
    low: "Low",
    high: "Great",
  },
];

function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      Number(value) || 0
    )
  );
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

function calculateRecoveryScore(
  checkIn
) {
  const energy = clamp(
    ((checkIn.energy - 1) / 4) * 100
  );

  const soreness = clamp(
    ((5 - checkIn.soreness) / 4) * 100
  );

  const stress = clamp(
    ((5 - checkIn.stress) / 4) * 100
  );

  const sleep = clamp(
    ((checkIn.sleep - 1) / 4) * 100
  );

  const hydration = clamp(
    ((checkIn.hydration - 1) / 4) * 100
  );

  return Math.round(
    energy * 0.25 +
      soreness * 0.2 +
      stress * 0.15 +
      sleep * 0.25 +
      hydration * 0.15
  );
}

function getRecoveryStatus(score) {
  if (score >= 85) {
    return {
      label: "Ready to Perform",
      color: "#42F58D",
      icon: "rocket",
      intensity: "Strong Walk",
      message:
        "Your recovery indicators look strong. You can choose a challenging walk while maintaining good form and hydration.",
    };
  }

  if (score >= 65) {
    return {
      label: "Ready With Balance",
      color: "#7EE8C4",
      icon: "walk",
      intensity: "Moderate Walk",
      message:
        "You appear ready for steady movement. Keep the pace comfortable and reassess if soreness or fatigue increases.",
    };
  }

  if (score >= 45) {
    return {
      label: "Recovery Recommended",
      color: "#FFC94A",
      icon: "leaf",
      intensity: "Light Recovery Walk",
      message:
        "Keep today gentle. Try a short walk, hydrate, and give your body extra time to recover.",
    };
  }

  return {
    label: "Rest and Restore",
    color: "#FF7184",
    icon: "heart",
    intensity:
      "Rest or Very Light Movement",
    message:
      "Your check-in suggests a recovery day. Prioritize rest, hydration, nutrition, and sleep before increasing intensity.",
  };
}

function RatingSelector({
  item,
  value,
  onChange,
}) {
  return (
    <View style={styles.checkInCard}>
      <View style={styles.checkInHeader}>
        <View
          style={[
            styles.checkInIcon,
            {
              backgroundColor:
                `${item.color}18`,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={23}
            color={item.color}
          />
        </View>

        <View style={styles.checkInCopy}>
          <Text style={styles.checkInTitle}>
            {item.title}
          </Text>

          <Text
            style={styles.checkInSubtitle}
          >
            {item.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(
          (rating) => {
            const selected =
              rating === value;

            return (
              <TouchableOpacity
                key={rating}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={
                  `${item.title} ${rating} out of 5`
                }
                accessibilityState={{
                  selected,
                }}
                onPress={() =>
                  onChange(rating)
                }
                style={[
                  styles.ratingButton,
                  selected && {
                    backgroundColor:
                      item.color,
                    borderColor:
                      item.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ratingNumber,
                    selected &&
                      styles.ratingNumberSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.scaleText}>
          {item.low}
        </Text>

        <Text style={styles.scaleText}>
          {item.high}
        </Text>
      </View>
    </View>
  );
}

function RecoveryTool({
  icon,
  title,
  color,
  onPress,
}) {
  const enabled =
    typeof onPress === "function";

  return (
    <TouchableOpacity
      style={[
        styles.toolCard,
        !enabled &&
          styles.toolCardDisabled,
      ]}
      activeOpacity={0.84}
      onPress={onPress}
      disabled={!enabled}
    >
      <View
        style={[
          styles.toolIcon,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={color}
        />
      </View>

      <Text style={styles.toolTitle}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#7890AA"
      />
    </TouchableOpacity>
  );
}

export default function RecoveryCoachScreen({
  navigation,
  goBack,
  goToBreathing,
  goToHydration,
  goToSleep,
  goToWalkingAnalytics,
}) {
  const [checkIn, setCheckIn] =
    useState(INITIAL_CHECK_IN);

  const [
    lastRecorded,
    setLastRecorded,
  ] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const score = useMemo(
    () =>
      calculateRecoveryScore(
        checkIn
      ),
    [checkIn]
  );

  const status = useMemo(
    () => getRecoveryStatus(score),
    [score]
  );

  useEffect(() => {
    const loadSavedRecovery =
      async () => {
        try {
          const saved =
            await AsyncStorage.getItem(
              "recoveryData"
            );

          const parsed =
            safelyParseJSON(
              saved,
              null
            );

          if (parsed?.checkIn) {
            setCheckIn({
              ...INITIAL_CHECK_IN,
              ...parsed.checkIn,
            });
          }

          if (parsed?.timestamp) {
            setLastRecorded(
              parsed.timestamp
            );
          }
        } catch (error) {
          console.log(
            "Recovery load error:",
            error
          );
        }
      };

    loadSavedRecovery();
  }, []);

  const handleBack = () => {
    if (
      typeof goBack === "function"
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

  const updateRating = (
    key,
    rating
  ) => {
    setCheckIn((current) => ({
      ...current,
      [key]: rating,
    }));
  };

  const saveRecovery = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const timestamp =
        new Date().toISOString();

      const recoveryRecord = {
        score,
        recoveryScore: score,
        status: status.label,

        recommendedIntensity:
          status.intensity,

        stress: checkIn.stress,
        stressLevel:
          checkIn.stress,

        checkIn,

        date: timestamp.slice(
          0,
          10
        ),

        timestamp,
      };

      const serialized =
        JSON.stringify(
          recoveryRecord
        );

      await AsyncStorage.multiSet(
        RECOVERY_KEYS.map(
          (key) => [
            key,
            serialized,
          ]
        )
      );

      setLastRecorded(timestamp);

      Alert.alert(
        "Recovery Recorded",
        `Your recovery score is ${score}%. Your AI Wellness Coach can now use this check-in.`
      );
    } catch (error) {
      console.log(
        "Recovery save error:",
        error
      );

      Alert.alert(
        "Save Error",
        "Your recovery check-in could not be saved. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formattedLastRecorded =
    lastRecorded
      ? new Date(
          lastRecorded
        ).toLocaleString()
      : "Not recorded yet";

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={
                "Back to AI Wellness"
              }
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color="#FFC94A"
              />
            </TouchableOpacity>

            <View
              style={styles.topBarText}
            >
              <Text
                style={styles.eyebrow}
              >
                LEGATHON WELLNESS
              </Text>

              <Text
                style={styles.screenTitle}
              >
                Recovery Coach
              </Text>
            </View>

            <View
              style={styles.headerIcon}
            >
              <Ionicons
                name="heart"
                size={25}
                color="#42F58D"
              />
            </View>
          </View>

          <LinearGradient
            colors={[
              "#0B2A46",
              "#081A31",
              "#061326",
            ]}
            style={styles.scoreCard}
          >
            <View
              style={styles.scoreHeader}
            >
              <View
                style={
                  styles.statusContainer
                }
              >
                <Text
                  style={styles.scoreLabel}
                >
                  TODAY’S RECOVERY
                </Text>

                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color:
                        status.color,
                    },
                  ]}
                >
                  {status.label}
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
                  style={styles.scoreNumber}
                >
                  {score}
                </Text>

                <Text
                  style={styles.percentSign}
                >
                  %
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
                    width:
                      `${score}%`,

                    backgroundColor:
                      status.color,
                  },
                ]}
              />
            </View>

            <View
              style={
                styles.recommendationRow
              }
            >
              <Ionicons
                name={status.icon}
                size={22}
                color={status.color}
              />

              <View
                style={
                  styles.recommendationCopy
                }
              >
                <Text
                  style={
                    styles.recommendationTitle
                  }
                >
                  {status.intensity}
                </Text>

                <Text
                  style={
                    styles.recommendationText
                  }
                >
                  {status.message}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View
            style={styles.recordedRow}
          >
            <Ionicons
              name="time-outline"
              size={17}
              color="#8FA8C4"
            />

            <Text
              style={styles.recordedText}
            >
              Last check-in:{" "}
              {formattedLastRecorded}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            How Do You Feel?
          </Text>

          <Text
            style={styles.sectionSubtitle}
          >
            Rate each area from 1 to 5.
            Your answers calculate
            today’s recovery readiness.
          </Text>

          {CHECK_IN_ITEMS.map(
            (item) => (
              <RatingSelector
                key={item.key}
                item={item}
                value={
                  checkIn[item.key]
                }
                onChange={(rating) =>
                  updateRating(
                    item.key,
                    rating
                  )
                }
              />
            )
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving &&
                styles.disabledButton,
            ]}
            onPress={saveRecovery}
            disabled={isSaving}
            activeOpacity={0.86}
          >
            <Ionicons
              name={
                isSaving
                  ? "hourglass"
                  : "checkmark-circle"
              }
              size={23}
              color="#02111F"
            />

            <Text
              style={
                styles.saveButtonText
              }
            >
              {isSaving
                ? "Saving Check-In..."
                : "Save Recovery Check-In"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Recovery Tools
          </Text>

          <View style={styles.toolsGrid}>
            <RecoveryTool
              icon="leaf"
              title="Calm Breathing"
              color="#42F58D"
              onPress={goToBreathing}
            />

            <RecoveryTool
              icon="water"
              title="Hydration"
              color="#49D8FF"
              onPress={goToHydration}
            />

            <RecoveryTool
              icon="moon"
              title="Sleep Coach"
              color="#A978FF"
              onPress={goToSleep}
            />

            <RecoveryTool
              icon="analytics"
              title="Walking Data"
              color="#FFC94A"
              onPress={
                goToWalkingAnalytics
              }
            />
          </View>

          <View
            style={styles.noticeCard}
          >
            <Ionicons
              name="information-circle"
              size={22}
              color="#73A8FF"
            />

            <Text
              style={styles.noticeText}
            >
              This wellness check-in is
              informational and is not
              medical advice. Stop
              exercising and seek
              professional care for
              concerning symptoms.
            </Text>
          </View>

          <View
            style={{ height: 140 }}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1C33",
    borderWidth: 1,
    borderColor: "#29496B",
  },

  topBarText: {
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

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(66,245,141,0.12)",
    borderWidth: 1,
    borderColor:
      "rgba(66,245,141,0.38)",
  },

  scoreCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#31577E",
    padding: 22,
    shadowColor: "#42F58D",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusContainer: {
    flex: 1,
    paddingRight: 12,
  },

  scoreLabel: {
    color: "#9EB4CE",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.4,
  },

  statusLabel: {
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#061326",
  },

  scoreNumber: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },

  percentSign: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 11,
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#173553",
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  recommendationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
  },

  recommendationCopy: {
    flex: 1,
    marginLeft: 12,
  },

  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  recommendationText: {
    color: "#B8C8DB",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },

  recordedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 4,
  },

  recordedText: {
    color: "#8FA8C4",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
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
    marginBottom: 16,
  },

  checkInCard: {
    backgroundColor: "#08182C",
    borderWidth: 1,
    borderColor: "#264666",
    borderRadius: 22,
    padding: 17,
    marginBottom: 14,
  },

  checkInHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkInIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  checkInCopy: {
    flex: 1,
    marginLeft: 12,
  },

  checkInTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  checkInSubtitle: {
    color: "#91A6BF",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  ratingButton: {
    width: 47,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102946",
    borderWidth: 1,
    borderColor: "#345778",
  },

  ratingNumber: {
    color: "#D9E6F5",
    fontSize: 17,
    fontWeight: "900",
  },

  ratingNumberSelected: {
    color: "#02111F",
  },

  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
  },

  scaleText: {
    color: "#7088A3",
    fontSize: 11,
    fontWeight: "800",
  },

  saveButton: {
    minHeight: 60,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC94A",
    marginTop: 8,
    shadowColor: "#FFC94A",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  disabledButton: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: "#02111F",
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 9,
  },

  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  toolCard: {
    width: "48.5%",
    minHeight: 120,
    borderRadius: 20,
    backgroundColor: "#08182C",
    borderWidth: 1,
    borderColor: "#264666",
    padding: 15,
    marginBottom: 12,
  },

  toolCardDisabled: {
    opacity: 0.5,
  },

  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  toolTitle: {
    flex: 1,
    color: "#EAF2FC",
    fontSize: 15,
    fontWeight: "900",
  },

  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor:
      "rgba(115,168,255,0.08)",
    borderWidth: 1,
    borderColor:
      "rgba(115,168,255,0.25)",
    borderRadius: 19,
    padding: 16,
    marginTop: 12,
  },

  noticeText: {
    flex: 1,
    color: "#9EB4CE",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginLeft: 10,
  },
});