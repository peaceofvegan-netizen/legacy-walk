import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';




const WEEKLY_GOAL = 100000;
const EMPTY_WEEK = [
  { day: "M", full: "Mon", steps: 0 },
  { day: "T", full: "Tue", steps: 0 },
  { day: "W", full: "Wed", steps: 0 },
  { day: "T", full: "Thu", steps: 0 },
  { day: "F", full: "Fri", steps: 0 },
  { day: "S", full: "Sat", steps: 0 },
  { day: "S", full: "Sun", steps: 0 },
];

const DEFAULT_JOURNEYS = [
  { id: "1", title: "Selma to Montgomery", progress: 10 },
  { id: "2", title: "Great Wall Trek", progress: 100 },
  { id: "3", title: "Roman Empire", progress: 92 },
  { id: "4", title: "Harriet Tubman", progress: 76 },
];
export default function WalkingAnalyticsScreen({ goBack,language,}) {
const [weeklyData, setWeeklyData] = useState(EMPTY_WEEK);
const [journeys, setJourneys] = useState([]);
const [lifetimeSteps, setLifetimeSteps] = useState(0);
const [streak, setStreak] = useState(24);
const [todaySteps, setTodaySteps] = useState(0);


const weeklySteps = weeklyData.reduce(
  (sum, item) => sum + Number(item.steps || 0),
  0
);

const goalProgress = Math.min(
  Math.round((weeklySteps / WEEKLY_GOAL) * 100),
  100
);

const stepsRemaining = Math.max(
  WEEKLY_GOAL - weeklySteps,
  0
);

const bestDay = Math.max(
  ...weeklyData.map(item => Number(item.steps || 0))
);


useEffect(() => {
  loadAnalytics();
}, []);

  const loadAnalytics = async () => {
    try {
      const savedWeek = await AsyncStorage.getItem("weeklyStepData");
      const savedJourneys = await AsyncStorage.getItem("journeyProgressData");
      const savedStreak = await AsyncStorage.getItem("currentStreak");
      const savedToday = await AsyncStorage.getItem("todaySteps");
      const savedLifetime = await AsyncStorage.getItem("lifetimeSteps");

        setTodaySteps(Number(savedToday || 0));
        setLifetimeSteps(Number(savedLifetime || 0));
      if (savedWeek) setWeeklyData(JSON.parse(savedWeek));
      if (savedJourneys) {
  setJourneys(JSON.parse(savedJourneys));
} else {
  setJourneys([]);
}
      if (savedLifetime) setLifetimeSteps(Number(savedLifetime));
      if (savedStreak) setStreak(Number(savedStreak));
    } catch (error) {
      console.log("Analytics load error:", error);
    }
  };

 const maxSteps = Math.max(
  ...weeklyData.map(item => Number(item.steps || 0)),
  1

);
  const currentDayIndex = new Date().getDay() === 0
  ? 6
  : new Date().getDay() - 1;

  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.small}>ANALYTICS</Text>
      <Text style={styles.title}>Walking Analytics</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Weekly Step Projection</Text>

        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{weeklySteps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Weekly Steps</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{goalProgress}%</Text>
            <Text style={styles.statLabel}>Goal Progress</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.chart}>
          {weeklyData.map((item, index) => {
            const height = Math.max((item.steps / maxSteps) * 180, 28);
            const isToday = index === currentDayIndex;

            return (
              <View key={`${item.day}-${index}`} style={styles.barWrap}>
                <Text style={styles.barNumber}>
                  {item.steps >= 1000
                    ? `${(item.steps / 1000).toFixed(1)}K`
                    : item.steps}
                </Text>

                <View
                  style={[
                    styles.bar,
                    { height },
                    isToday && styles.todayBar,
                  ]}
                />

                <Text style={styles.day}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.goalBox}>
          <Text style={styles.goalText}>Weekly Goal</Text>
          <Text style={styles.goalValue}>
            {weeklySteps.toLocaleString()} / {WEEKLY_GOAL.toLocaleString()}
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${goalProgress}%` }]} />
          </View>

          <Text style={styles.remaining}>
            {stepsRemaining.toLocaleString()} steps remaining
          </Text>
        </View>
      </View>

     

      <View style={styles.card}>
  <Text style={styles.cardTitle}>
    Journey Performance
  </Text>

  {journeys.length > 0 ? (
  journeys.map((journey) => (
    <View key={journey.id} style={styles.journeyRow}>
      <View style={styles.journeyHeader}>
        <Text style={styles.journeyName}>
          {journey.title}
        </Text>

        <Text style={styles.journeyPercent}>
          {journey.progress || 0}%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${journey.progress || 0}%` },
          ]}
        />
      </View>
    </View>
  ))
) : (
  <Text style={styles.emptyText}>
    No journey progress yet. Start a journey to build analytics.
  </Text>
)}
</View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lifetime Stats</Text>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Lifetime Steps</Text>
          <Text style={styles.recordValue}>{lifetimeSteps.toLocaleString()}</Text>
        </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Estimated Miles</Text>
          <Text style={styles.recordValue}>
            {(lifetimeSteps / 2200).toFixed(1)}
          </Text>
        </View>

          <View style={styles.recordRow}>
           <Text style={styles.recordLabel}>Calories Burned</Text>
          <Text style={styles.recordValue}>
            {Math.round(lifetimeSteps * 0.04)}
           </Text>
            </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Journeys Completed</Text>
          <Text style={styles.recordValue}>
            {journeys.filter((item) => item.progress >= 100).length}
          </Text>
        </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Current Streak</Text>
          <Text style={styles.recordValue}>{streak} days</Text>
        </View>
      </View>

      <View style={styles.cardGold}>
        <Text style={styles.goldTitle}>Personal Records</Text>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Best Day</Text>
          <Text style={styles.recordValue}>
            {Math.max(...weeklyData.map((item) => item.steps)).toLocaleString()}
          </Text>
        </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Highest Journey</Text>
         <Text style={styles.recordValue}>
  {journeys.length > 0
    ? Math.max(...journeys.map(item => Number(item.progress || 0)))
    : 0}%
       </Text>
        </View>

        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Weekly Goal</Text>
          <Text style={styles.recordValue}>{goalProgress}%</Text>
        </View>
      </View>

   <TouchableOpacity
  style={styles.backButton}
  onPress={() => goBack?.()}
>
  <Text style={styles.backText}>Back</Text>
</TouchableOpacity>

      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },
  content: {
    padding: 18,
    paddingBottom: 160,
  },
  small: {
    color: "#D8A72E",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 6,
    marginTop: 18,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
    lineHeight: 52,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: "#071224",
    borderColor: "#213653",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 22,
    marginBottom: 22,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 20,
  },
  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#101B2E",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
  },
  statValue: {
    color: "#D8A72E",
    fontSize: 21,
    fontWeight: "900",
  },
  statLabel: {
    color: "#AAB7CA",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },
  chart: {
    height: 250,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyText: {
  color: "#BFC7D5",
  fontSize: 16,
  fontWeight: "600",
},
  barWrap: {
    alignItems: "center",
    width: 42,
  },
  barNumber: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  bar: {
    width: 34,
    borderRadius: 999,
    backgroundColor: "#A6F0CD",
  },
  todayBar: {
    backgroundColor: "#D8A72E",
  },
  day: {
    color: "#AAB7CA",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  goalBox: {
    backgroundColor: "#101B2E",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
  },
  goalText: {
    color: "#AAB7CA",
    fontSize: 15,
    fontWeight: "900",
  },
  goalValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 12,
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#162238",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#A6F0CD",
  },
  remaining: {
    color: "#D8A72E",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#071224",
    borderColor: "#213653",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 22,
    marginBottom: 22,
  },
  cardGold: {
    backgroundColor: "#10100A",
    borderColor: "#D8A72E",
    borderWidth: 1.5,
    borderRadius: 30,
    padding: 22,
    marginBottom: 22,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 20,
  },
  goldTitle: {
    color: "#D8A72E",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 18,
  },
  journeyRow: {
    marginBottom: 20,
  },
  journeyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  journeyName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    flex: 1,
    paddingRight: 12,
  },
  emptyJourneyText: {
  color: "#BFC7D5",
  fontSize: 16,
  fontWeight: "600",
  lineHeight: 22,
},
  percent: {
    color: "#A6F0CD",
    fontSize: 22,
    fontWeight: "900",
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#1F2A3D",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  recordLabel: {
    color: "#AAB7CA",
    fontSize: 17,
    fontWeight: "900",
  },
  recordValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  backButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#05070C",
    fontSize: 18,
    fontWeight: "900",
  },
  journeyRow: {
  marginBottom: 20,
},

journeyHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10,
},

journeyName: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "700",
},

journeyPercent: {
  color: "#D4AF37",
  fontSize: 18,
  fontWeight: "800",
},

progressTrack: {
  width: "100%",
  height: 12,
  backgroundColor: "#142850",
  borderRadius: 10,
  overflow: "hidden",
},

progressFill: {
  height: "100%",
  backgroundColor: "#D4AF37",
  borderRadius: 10,
},
});

