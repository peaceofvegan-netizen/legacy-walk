import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getJourneyLifetimeSteps,
  loadStepStats,
} from "../utils/stepTrackingEngine";

const DEFAULT_WEEKLY_GOAL = 100000;
const STEPS_PER_MILE = 2000;
const CALORIES_PER_STEP = 0.04;

const STORAGE_KEYS = {
  WEEK: "legathonWeeklyStepDataV2",
  JOURNEYS: "journeyProgressData",
  STREAK: "currentStreak",
  TODAY: "todaySteps",
  WEEKLY_GOAL: "weeklyStepGoal",
};

const EMPTY_WEEK = [
  {
    day: "M",
    full: "Monday",
    steps: 0,
  },
  {
    day: "T",
    full: "Tuesday",
    steps: 0,
  },
  {
    day: "W",
    full: "Wednesday",
    steps: 0,
  },
  {
    day: "T",
    full: "Thursday",
    steps: 0,
  },
  {
    day: "F",
    full: "Friday",
    steps: 0,
  },
  {
    day: "S",
    full: "Saturday",
    steps: 0,
  },
  {
    day: "S",
    full: "Sunday",
    steps: 0,
  },
];

function safeInteger(
  value,
  fallback = 0
) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor(parsed)
  );
}

function clampPercent(value) {
  return Math.min(
    100,
    safeInteger(value)
  );
}

function safeJSON(
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

function getCurrentDayIndex() {
  const day =
    new Date().getDay();

  return day === 0
    ? 6
    : day - 1;
}

function formatLocalDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentWeekId() {
  const date = new Date();

  const mondayOffset =
    (date.getDay() + 6) % 7;

  date.setHours(0, 0, 0, 0);

  date.setDate(
    date.getDate() - mondayOffset
  );

  return formatLocalDate(date);
}

function normalizeWeek(
  value,
  todaySteps
) {
  const currentWeekId =
    getCurrentWeekId();

  const savedWeek =
    value?.weekId === currentWeekId &&
    Array.isArray(value?.days)
      ? value.days
      : [];

  const todayIndex =
    getCurrentDayIndex();

  const days = EMPTY_WEEK.map(
    (fallback, index) => {
      const saved = savedWeek[index];

      return {
        day: fallback.day,
        full: fallback.full,

        steps:
          index === todayIndex
            ? safeInteger(todaySteps)
            : safeInteger(saved?.steps),
      };
    }
  );

  return {
    weekId: currentWeekId,
    days,
  };
}
function normalizeJourneys(value) {
  const source =
    Array.isArray(value)
      ? value
      : value &&
          typeof value === "object"
        ? Object.values(value)
        : [];

  return source
    .map((journey, index) => ({
      id: String(
        journey?.id ||
          journey?.journeyId ||
          `journey-${index}`
      ),

      title: String(
        journey?.title ||
          journey?.name ||
          "Untitled Journey"
      ),

      progress:
        clampPercent(
          journey?.progress ??
            journey?.progressPercent ??
            journey?.percent
        ),
    }))
    .filter(
      (journey) =>
        journey.title !==
        "Untitled Journey"
    );
}

function formatCompactSteps(value) {
  const steps =
    safeInteger(value);

  if (steps >= 1000000) {
    return `${(
      steps / 1000000
    ).toFixed(1)}M`;
  }

  if (steps >= 1000) {
    return `${(
      steps / 1000
    ).toFixed(1)}K`;
  }

  return String(steps);
}

function StatBox({
  value,
  label,
  accent = false,
}) {
  return (
    <View style={styles.statBox}>
      <Text
        style={[
          styles.statValue,

          accent &&
            styles.statValueAccent,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function RecordRow({
  label,
  value,
  last = false,
}) {
  return (
    <View
      style={[
        styles.recordRow,

        last &&
          styles.recordRowLast,
      ]}
    >
      <Text style={styles.recordLabel}>
        {label}
      </Text>

      <Text style={styles.recordValue}>
        {value}
      </Text>
    </View>
  );
}

export default function WalkingAnalyticsScreen({
  goBack,
}) {
  const [
    weeklyData,
    setWeeklyData,
  ] = useState(EMPTY_WEEK);

  const [
    journeys,
    setJourneys,
  ] = useState([]);

  const [
    todaySteps,
    setTodaySteps,
  ] = useState(0);

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] = useState(0);

  const [
    streak,
    setStreak,
  ] = useState(0);

  const [
    weeklyGoal,
    setWeeklyGoal,
  ] = useState(
    DEFAULT_WEEKLY_GOAL
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const loadAnalytics =
    useCallback(
      async ({
        pullRefresh = false,
      } = {}) => {
        if (pullRefresh) {
          setRefreshing(true);
        }

        try {
          setLoadError("");

          const [
            storedValues,
            stepStats,
            journeyLifetimeSteps,
          ] = await Promise.all([
            AsyncStorage.multiGet([
              STORAGE_KEYS.WEEK,
              STORAGE_KEYS.JOURNEYS,
              STORAGE_KEYS.STREAK,
              STORAGE_KEYS.TODAY,
              STORAGE_KEYS.WEEKLY_GOAL,
            ]),

            loadStepStats(),

            getJourneyLifetimeSteps(),
          ]);
 
          const stored =
            Object.fromEntries(
              storedValues
            );

         const hasTrackedToday =
  Number.isFinite(
    Number(stepStats?.todaySteps)
  );

const resolvedToday =
  hasTrackedToday
    ? safeInteger(
        stepStats.todaySteps
      )
    : safeInteger(
        stored[
          STORAGE_KEYS.TODAY
        ]
      );

          const resolvedLifetime =
            Math.max(
              safeInteger(
                journeyLifetimeSteps
              ),

              safeInteger(
                stepStats
                  ?.journeyLifetimeSteps
              ),

              safeInteger(
                stepStats?.lifetimeSteps
              )
            );

          const resolvedStreak =
            Math.max(
              safeInteger(
                stepStats?.dayStreak
              ),

              safeInteger(
                stored[
                  STORAGE_KEYS.STREAK
                ]
              )
            );

          const savedGoal =
            safeInteger(
              stored[
                STORAGE_KEYS.WEEKLY_GOAL
              ]
            );

          const savedWeek =
            safeJSON(
              stored[
                STORAGE_KEYS.WEEK
              ],
              []
            );

          const savedJourneys =
            safeJSON(
              stored[
                STORAGE_KEYS.JOURNEYS
              ],
              []
            );

          setTodaySteps(
            resolvedToday
          );

          setLifetimeSteps(
            resolvedLifetime
          );

          setStreak(
            resolvedStreak
          );

          setWeeklyGoal(
            savedGoal > 0
              ? savedGoal
              : DEFAULT_WEEKLY_GOAL
          );

         const normalizedWeek =
  normalizeWeek(
    savedWeek,
    resolvedToday
  );

setWeeklyData(
  normalizedWeek.days
);

await AsyncStorage.setItem(
  STORAGE_KEYS.WEEK,
  JSON.stringify(normalizedWeek)
);

          setJourneys(
            normalizeJourneys(
              savedJourneys
            )
          );
        } catch (error) {
          console.log(
            "Walking analytics load error:",
            error
          );

          setLoadError(
            "Analytics could not be refreshed right now."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        "change",
        (nextState) => {
          if (
            nextState === "active"
          ) {
            loadAnalytics();
          }
        }
      );

    return () =>
      subscription.remove();
  }, [loadAnalytics]);

  const weeklySteps =
    useMemo(
      () =>
        weeklyData.reduce(
          (total, day) =>
            total +
            safeInteger(
              day.steps
            ),
          0
        ),
      [weeklyData]
    );

  const goalProgress =
    useMemo(
      () =>
        weeklyGoal > 0
          ? Math.min(
              100,
              Math.round(
                (
                  weeklySteps /
                  weeklyGoal
                ) * 100
              )
            )
          : 0,
      [
        weeklyGoal,
        weeklySteps,
      ]
    );

  const stepsRemaining =
    Math.max(
      weeklyGoal -
        weeklySteps,
      0
    );

  const bestDay =
    Math.max(
      ...weeklyData.map(
        (day) =>
          safeInteger(
            day.steps
          )
      ),
      0
    );

  const maxChartSteps =
    Math.max(
      bestDay,
      1
    );

  const currentDayIndex =
    getCurrentDayIndex();

  const completedJourneys =
    journeys.filter(
      (journey) =>
        journey.progress >= 100
    ).length;

  const highestJourneyProgress =
    Math.max(
      ...journeys.map(
        (journey) =>
          clampPercent(
            journey.progress
          )
      ),
      0
    );

  const estimatedMiles =
    lifetimeSteps /
    STEPS_PER_MILE;

  const estimatedCalories =
    Math.round(
      lifetimeSteps *
        CALORIES_PER_STEP
    );
      if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#F5C542"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading walking analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadAnalytics({
                pullRefresh: true,
              })
            }
            tintColor="#F5C542"
            colors={["#F5C542"]}
          />
        }
      >
        <Text
          style={styles.eyebrow}
        >
          LEGATHON INSIGHTS
        </Text>

        <Text style={styles.title}>
          Walking Analytics
        </Text>

        <Text
          style={styles.subtitle}
        >
          Your current walking performance,
          journey activity, and lifetime
          progress.
        </Text>

        {loadError ? (
          <View
            style={styles.errorCard}
          >
            <Text
              style={
                styles.errorText
              }
            >
              {loadError}
            </Text>

            <TouchableOpacity
              onPress={() =>
                loadAnalytics()
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View
          style={styles.heroCard}
        >
          <View
            style={
              styles.sectionHeadingRow
            }
          >
            <View
              style={
                styles.sectionHeadingCopy
              }
            >
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                THIS WEEK
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                Weekly Movement
              </Text>
            </View>

            <View
              style={
                styles.progressBadge
              }
            >
           <Text
  style={
    styles.progressBadgeText
  }
  numberOfLines={1}
  adjustsFontSizeToFit
>
  {goalProgress}%
</Text>
            </View>
          </View>

          <View
            style={styles.statGrid}
          >
            <StatBox
              value={
                todaySteps
                  .toLocaleString()
              }
              label="Today"
              accent
            />

           <StatBox
  value={
    formatCompactSteps(
      weeklySteps
    )
  }
  label="This Week"
/>

            <StatBox
              value={String(streak)}
              label="Day Streak"
            />
          </View>

          <View
            style={styles.chart}
          >
            {weeklyData.map(
              (item, index) => {
                const steps =
                  safeInteger(
                    item.steps
                  );

                const height =
                  steps > 0
                    ? Math.max(
                        8,
                        (
                          steps /
                          maxChartSteps
                        ) * 156
                      )
                    : 0;

                const isToday =
                  index ===
                  currentDayIndex;

                return (
                  <View
                    key={
                      `${item.full}-${index}`
                    }
                    style={
                      styles.barColumn
                    }
                  >
                    <Text
                      style={
                        styles.barNumber
                      }
                    >
                      {formatCompactSteps(
                        steps
                      )}
                    </Text>

                    <View
                      style={
                        styles.barTrack
                      }
                    >
                      <View
                        style={[
                          styles.bar,
                          { height },

                          isToday &&
                            styles.todayBar,
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.day,

                        isToday &&
                          styles.todayDay,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                );
              }
            )}
          </View>

          <View
            style={styles.goalBox}
          >
            <View
              style={
                styles.goalHeadingRow
              }
            >
              <Text
                style={
                  styles.goalText
                }
              >
                Weekly Goal
              </Text>

              <Text
                style={
                  styles.goalValue
                }
              >
                {weeklySteps
                  .toLocaleString()}{" "}
                /{" "}
                {weeklyGoal
                  .toLocaleString()}
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
                      `${goalProgress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={
                styles.remaining
              }
            >
              {stepsRemaining > 0
                ? `${stepsRemaining.toLocaleString()} steps remaining`
                : "Weekly goal completed"}
            </Text>
          </View>
        </View>


        <View style={styles.card}>
          <Text
            style={
              styles.cardEyebrow
            }
          >
            ALL-TIME MOVEMENT
          </Text>

          <Text
            style={styles.cardTitle}
          >
            Lifetime Stats
          </Text>

          <RecordRow
            label="Lifetime Steps"
            value={
              lifetimeSteps
                .toLocaleString()
            }
          />

          <RecordRow
            label="Estimated Miles"
            value={
              estimatedMiles
                .toFixed(2)
            }
          />

          <RecordRow
            label="Estimated Calories"
            value={
              estimatedCalories
                .toLocaleString()
            }
          />

          <RecordRow
            label="Journeys Completed"
            value={
              String(
                completedJourneys
              )
            }
          />

          <RecordRow
            label="Current Streak"
            value={`${streak} days`}
            last
          />
        </View>

        <View
          style={styles.goldCard}
        >
          <Text
            style={
              styles.goldEyebrow
            }
          >
            PERSONAL BESTS
          </Text>

          <Text
            style={styles.goldTitle}
          >
            Walking Records
          </Text>

          <RecordRow
            label="Best Day This Week"
            value={
              bestDay
                .toLocaleString()
            }
          />

          <RecordRow
            label="Highest Journey"
            value={
              `${highestJourneyProgress}%`
            }
          />

          <RecordRow
            label="Weekly Goal"
            value={`${goalProgress}%`}
            last
          />
        </View>

        {typeof goBack ===
        "function" ? (
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={goBack}
            activeOpacity={0.84}
          >
            <Text
              style={
                styles.backText
              }
            >
              Back
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#030711",
  },

  container: {
    flex: 1,
    backgroundColor: "#030711",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 190,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#AAB7CA",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 16,
  },

  eyebrow: {
    color: "#F5C542",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 43,
    lineHeight: 49,
    fontWeight: "900",
  },

  subtitle: {
    color: "#9EABC0",
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 24,
  },

  errorCard: {
    backgroundColor:
      "rgba(127,29,29,0.28)",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },

  errorText: {
    color: "#FECACA",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },

  retryText: {
    color: "#F5C542",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
  },

  heroCard: {
    backgroundColor: "#09172A",
    borderColor: "#2A4162",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },

  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sectionHeadingCopy: {
    flex: 1,
    paddingRight: 12,
  },

  sectionEyebrow: {
    color: "#86F7D0",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 6,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  progressBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    borderColor: "#F5C542",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#06101F",
  },

  progressBadgeText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  statBox: {
    flex: 1,
    minHeight: 92,
    backgroundColor: "#0E1E34",
    borderColor: "#294361",
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  statValueAccent: {
    color: "#86F7D0",
  },

  statLabel: {
    color: "#9EABC0",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 6,
  },

  chart: {
    height: 225,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  barColumn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barNumber: {
    color: "#AAB7CA",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 7,
  },

  barTrack: {
    width: 26,
    height: 156,
    borderRadius: 13,
    backgroundColor: "#13243B",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  bar: {
    width: "100%",
    borderRadius: 13,
    backgroundColor: "#86F7D0",
  },

  todayBar: {
    backgroundColor: "#F5C542",
  },

  day: {
    color: "#8391A8",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 9,
  },

  todayDay: {
    color: "#F5C542",
  },

  goalBox: {
    backgroundColor: "#0E1E34",
    borderColor: "#294361",
    borderWidth: 1,
    borderRadius: 21,
    padding: 16,
  },

  goalHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  goalText: {
    color: "#AAB7CA",
    fontSize: 14,
    fontWeight: "900",
  },

  goalValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#142A46",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#86F7D0",
    borderRadius: 999,
  },

  remaining: {
    color: "#F5C542",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "900",
    marginTop: 11,
  },

  card: {
    backgroundColor: "#09172A",
    borderColor: "#2A4162",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },

  goldCard: {
    backgroundColor:
      "rgba(245,197,66,0.09)",
    borderColor: "#F5C542",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },

  cardEyebrow: {
    color: "#86F7D0",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },

  goldEyebrow: {
    color: "#F5C542",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  goldTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },

  journeyRow: {
    marginBottom: 20,
  },

  journeyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  journeyName: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    paddingRight: 12,
  },

  journeyPercent: {
    color: "#F5C542",
    fontSize: 17,
    fontWeight: "900",
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: "#0E1E34",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 10,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyText: {
    color: "#9EABC0",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 7,
  },

  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    borderBottomColor: "#20334E",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },

  recordRowLast: {
    borderBottomWidth: 0,
  },

  recordLabel: {
    flex: 1,
    color: "#AAB7CA",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },

  recordValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "right",
  },

  backButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: "#F5C542",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  backText: {
    color: "#030711",
    fontSize: 18,
    fontWeight: "900",
  },
});