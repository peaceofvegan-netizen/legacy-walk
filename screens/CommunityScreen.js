import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const translations = {
  en: {
    title: "Legathon Community",
    subtitle: "Walk • Encourage • Grow Together",
    walkersOnline: "Walkers Online",
    todayQuote: "Today's Legacy Quote",
    quote: "Every step you take is building a stronger legathon.",
    encourage: "Encourage",
    celebrate: "Celebrate",
    support: "Support",
    liveWalkers: "Walking Right Now",
    walkingCircles: "Walking Circles",
    challenges: "Community Challenges",
    friends: "Friends",
    join: "Join",
    view: "View",
    steps: "Steps",
    communityFeed: "Community Feed",
  },

  es: {
    title: "Comunidad Legacy",
    subtitle: "Camina • Anima • Crece Juntos",
    walkersOnline: "Caminantes En Línea",
    todayQuote: "Frase Legathon De Hoy",
    quote: "Cada paso que das construye un legado más fuerte.",
    encourage: "Animar",
    celebrate: "Celebrar",
    support: "Apoyar",
    liveWalkers: "Caminando Ahora",
    walkingCircles: "Círculos De Caminata",
    challenges: "Desafíos Comunitarios",
    friends: "Amigos",
    join: "Unirse",
    view: "Ver",
    steps: "Pasos",
    communityFeed: "Comunidad",
  },
};

const communityFeed = [
  {
    id: "1",
    icon: "🏅",
    name: "James",
    text: "completed Checkpoint 3",
    journey: "Great Wall of China",
    action: "celebrate",
  },
  {
    id: "2",
    icon: "🚶",
    name: "Maria",
    text: "walked 14,582 steps today",
    journey: "Amazon Rainforest",
    action: "encourage",
  },
  {
    id: "3",
    icon: "🌍",
    name: "Sarah",
    text: "earned a new passport stamp",
    journey: "Selma to Montgomery",
    action: "support",
  },
];

const liveWalks = [
  { id: "amazon", title: "Amazon Rainforest", flag: "🇧🇷", walkers: 1248 },
  { id: "greatwall", title: "Great Wall", flag: "🇨🇳", walkers: 982 },
  { id: "selma", title: "Selma to Montgomery", flag: "🇺🇸", walkers: 674 },
];

const walkingCircles = [
  { id: "blackLegacy", title: "Black Legacy", icon: "✊", members: 5827 },
  { id: "autism", title: "Autism Awareness", icon: "💙", members: 3240 },
  { id: "world", title: "World Explorers", icon: "🌍", members: 9120 },
  { id: "heart", title: "Heart Health", icon: "❤️", members: 2188 },
];

const challenges = [
  {
    id: "weekend",
    title: "Weekend Challenge",
    goal: 50000,
    progress: 42600,
    reward: 500,
  },
  {
    id: "global",
    title: "Global Walking Weekend",
    goal: 100000,
    progress: 31000,
    reward: 1000,
  },
];

export default function CommunityScreen({
  language = "en",
  goBack,
  goToJourney,
  goToProfile,
  goToAICoach,
  goToChallenge,
  goToCommunityEvent,
}) {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState("global");

  const [todaySteps, setTodaySteps] = useState(0);
  const [lifetimeSteps, setLifetimeSteps] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [wcoins, setWcoins] = useState(0);
  const [passportStamps, setPassportStamps] = useState(0);
  const [completedJourneys, setCompletedJourneys] = useState(0);
  const [activeJourney, setActiveJourney] = useState(null);

  useEffect(() => {
    loadCommunityData();
  }, []);

  async function loadCommunityData() {
    try {
      const [
        today,
        lifetime,
        streak,
        coins,
        passport,
        completed,
        journey,
      ] = await Promise.all([
        AsyncStorage.getItem("todaySteps"),
        AsyncStorage.getItem("lifetimeSteps"),
        AsyncStorage.getItem("currentStreak"),
        AsyncStorage.getItem("wcoinBalance"),
        AsyncStorage.getItem("passportStampCount"),
        AsyncStorage.getItem("completedJourneyCount"),
        AsyncStorage.getItem("activeJourney"),
      ]);

      setTodaySteps(Number(today || 0));
      setLifetimeSteps(Number(lifetime || 0));
      setCurrentStreak(Number(streak || 0));
      setWcoins(Number(coins || 0));
      setPassportStamps(Number(passport || 0));
      setCompletedJourneys(Number(completed || 0));

      if (journey) {
        setActiveJourney(JSON.parse(journey));
      }
    } catch (err) {
      console.log("Community Load Error:", err);
    }
  }

  const walkersOnline = useMemo(() => {
    return liveWalks.reduce(
      (sum, item) => sum + item.walkers,
      0
    );
  }, []);

  const communityStats = [
    {
      label: "Today",
      value: todaySteps.toLocaleString(),
    },
    {
      label: "Lifetime",
      value: lifetimeSteps.toLocaleString(),
    },
    {
      label: "Streak",
      value: `${currentStreak} Days`,
    },
    {
      label: "W Coins",
      value: wcoins.toLocaleString(),
    },
  ];

  async function sendEncouragement(feedId) {
    const saved =
      await AsyncStorage.getItem("communityEncouragements");

    const current = saved ? JSON.parse(saved) : [];

    current.push({
      id: Date.now().toString(),
      feedId,
      createdAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem(
      "communityEncouragements",
      JSON.stringify(current)
    );
  }

  async function joinChallenge(challenge) {
    await AsyncStorage.setItem(
      "activeCommunityChallenge",
      JSON.stringify(challenge)
    );

    goToChallenge?.(challenge);
  }

  async function joinWalk(walk) {
    await AsyncStorage.setItem(
      "activeCommunityWalk",
      JSON.stringify(walk)
    );

    goToJourney?.(walk);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

              <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.kicker}>LEGATHON WALK</Text>

          <Text style={styles.title}>
            {t.title}
          </Text>

          <Text style={styles.subtitle}>
            {t.subtitle}
          </Text>

          <View style={styles.onlineCard}>
            <Text style={styles.onlineNumber}>
              {walkersOnline.toLocaleString()}
            </Text>

            <Text style={styles.onlineLabel}>
              {t.walkersOnline}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {communityStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>
                {stat.value}
              </Text>

              <Text style={styles.statLabel}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.passportCard}>
          <Text style={styles.passportKicker}>
            COMMUNITY PASSPORT
          </Text>

          <Text style={styles.passportName}>
            Legacy Walker
          </Text>

          <Text style={styles.passportSub}>
            Your community identity is built through walking,
            encouragement, and completed journeys.
          </Text>

          <View style={styles.passportGrid}>
            <View style={styles.passportStat}>
              <Text style={styles.passportValue}>
                {passportStamps}
              </Text>
              <Text style={styles.passportLabel}>Stamps</Text>
            </View>

            <View style={styles.passportStat}>
              <Text style={styles.passportValue}>
                {completedJourneys}
              </Text>
              <Text style={styles.passportLabel}>Journeys</Text>
            </View>

            <View style={styles.passportStat}>
              <Text style={styles.passportValue}>
                {currentStreak}
              </Text>
              <Text style={styles.passportLabel}>Streak</Text>
            </View>

            <View style={styles.passportStat}>
              <Text style={styles.passportValue}>
                {wcoins.toLocaleString()}
              </Text>
              <Text style={styles.passportLabel}>W Coins</Text>
            </View>
          </View>
        </View>

        {activeJourney && (
          <View style={styles.heroCard}>
            <Text style={styles.heroSmall}>
              CURRENT JOURNEY
            </Text>

            <Text style={styles.heroTitle}>
              {activeJourney.flag || "🌍"} {activeJourney.title}
            </Text>

            <Text style={styles.heroProgress}>
              {activeJourney.progress || 0}% Complete
            </Text>

            <View style={styles.heroBar}>
              <View
                style={[
                  styles.heroFill,
                  {
                    width: `${Math.min(
                      Number(activeJourney.progress || 0),
                      100
                    )}%`,
                  },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.walkButton}
              onPress={() => goToJourney?.(activeJourney)}
            >
              <Text style={styles.walkButtonText}>
                Continue Walking
              </Text>
            </TouchableOpacity>
          </View>
        )}

                <View style={styles.tabRow}>
          {["global", "friends", "following"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.sectionMini}>
            {t.todayQuote}
          </Text>

          <Text style={styles.quoteText}>
            “{t.quote}”
          </Text>

          <TouchableOpacity style={styles.encourageButton}>
            <Text style={styles.encourageText}>
              ❤️ {t.encourage}
            </Text>
          </TouchableOpacity>
        </View>

        <SectionTitle title="🔔 Activity Center" />

        <View style={styles.activityCard}>
          <ActivityItem
            icon="🏅"
            title="Checkpoint Completed"
            subtitle="Amazon Rainforest • Checkpoint 2"
            time="2m"
          />

          <View style={styles.activityDivider} />

          <ActivityItem
            icon="👏"
            title="You received encouragement"
            subtitle="James Wilson cheered your walk."
            time="8m"
          />

          <View style={styles.activityDivider} />

          <ActivityItem
            icon="🪙"
            title="W Coins Earned"
            subtitle="+250 W Coins from today's challenge."
            time="Today"
          />
        </View>

        <SectionTitle title={t.communityFeed} />

        {communityFeed.map((item) => (
          <View key={item.id} style={styles.feedCard}>
            <Text style={styles.feedIcon}>
              {item.icon}
            </Text>

            <View style={styles.feedContent}>
              <Text style={styles.feedTitle}>
                {item.name} {item.text}
              </Text>

              <Text style={styles.feedJourney}>
                {item.journey}
              </Text>

              <TouchableOpacity
                style={styles.feedAction}
                onPress={() => sendEncouragement(item.id)}
              >
                <Text style={styles.feedActionText}>
                  {item.action === "celebrate"
                    ? `🎉 ${t.celebrate}`
                    : item.action === "support"
                    ? `🙌 ${t.support}`
                    : `👏 ${t.encourage}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

                <SectionTitle title={t.liveWalkers} />

        {liveWalks.map((walk) => (
          <TouchableOpacity
            key={walk.id}
            style={styles.liveCard}
            onPress={() => joinWalk(walk)}
          >
            <Text style={styles.liveFlag}>
              {walk.flag}
            </Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.liveTitle}>
                {walk.title}
              </Text>

              <Text style={styles.liveSub}>
                {walk.walkers.toLocaleString()} walkers
              </Text>
            </View>

            <Text style={styles.joinText}>
              {t.join}
            </Text>
          </TouchableOpacity>
        ))}

        <SectionTitle title="🔥 Walking Streak" />

        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>
            Current Streak
          </Text>

          <Text style={styles.streakDays}>
            {currentStreak} Days
          </Text>

          <Text style={styles.streakSub}>
            Keep walking today to continue your streak.
          </Text>
        </View>

        <SectionTitle title="👥 Friends Walking Now" />

        <View style={styles.friendCard}>
          <Text style={styles.friendAvatar}>👤</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.friendName}>
              James Wilson
            </Text>

            <Text style={styles.friendJourney}>
              Amazon Rainforest
            </Text>

            <Text style={styles.friendSteps}>
              {todaySteps.toLocaleString()} Steps Today
            </Text>
          </View>

          <TouchableOpacity style={styles.cheerButton}>
            <Text style={styles.cheerText}>
              👏 Cheer
            </Text>
          </TouchableOpacity>
        </View>

        <SectionTitle title="Friend Requests" />

        <View style={styles.requestCard}>
          <View>
            <Text style={styles.requestName}>
              Maria Johnson
            </Text>

            <Text style={styles.requestText}>
              Wants to join your Walking Circle
            </Text>
          </View>

          <View style={styles.requestButtons}>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptText}>
                Accept
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.declineText}>
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

                <SectionTitle title={t.walkingCircles} />

        <View style={styles.circleGrid}>
          {walkingCircles.map((circle) => (
            <TouchableOpacity
              key={circle.id}
              style={styles.circleCard}
            >
              <Text style={styles.circleIcon}>
                {circle.icon}
              </Text>

              <Text style={styles.circleTitle}>
                {circle.title}
              </Text>

              <Text style={styles.circleMembers}>
                {circle.members.toLocaleString()} members
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionTitle title="🏆 Top Walking Circles" />

        <View style={styles.circleRanking}>
          <Text style={styles.rank}>🥇</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.rankTitle}>
              World Explorers
            </Text>

            <Text style={styles.rankMembers}>
              9,120 Members
            </Text>
          </View>

          <Text style={styles.rankSteps}>
            2.8M Steps
          </Text>
        </View>

        <SectionTitle title={t.challenges} />

        {challenges.map((challenge) => {
          const percent = Math.min(
            Math.round((challenge.progress / challenge.goal) * 100),
            100
          );

          return (
            <View key={challenge.id} style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>
                {challenge.title}
              </Text>

              <Text style={styles.challengeProgress}>
                {challenge.progress.toLocaleString()} /{" "}
                {challenge.goal.toLocaleString()} {t.steps}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percent}%` },
                  ]}
                />
              </View>

              <Text style={styles.rewardText}>
                🪙 {challenge.reward} W Coins
              </Text>

              <TouchableOpacity
                style={styles.challengeButton}
                onPress={() => joinChallenge(challenge)}
              >
                <Text style={styles.challengeButtonText}>
                  Join Challenge
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

                <SectionTitle title="📅 Community Events" />

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            🌎 Global Walking Weekend
          </Text>

          <Text style={styles.eventSub}>
            Starts Saturday • 9:00 AM
          </Text>

          <TouchableOpacity
            style={styles.eventButton}
            onPress={() =>
              goToCommunityEvent?.({
                id: "global-weekend",
                title: "Global Walking Weekend",
              })
            }
          >
            <Text style={styles.eventButtonText}>
              Join Event
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            💙 Autism Awareness Walk
          </Text>

          <Text style={styles.eventSub}>
            April Community Challenge
          </Text>

          <TouchableOpacity
            style={styles.eventButton}
            onPress={() =>
              goToCommunityEvent?.({
                id: "autism-awareness",
                title: "Autism Awareness Walk",
              })
            }
          >
            <Text style={styles.eventButtonText}>
              Join Event
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            ❤️ Heart Health Walk
          </Text>

          <Text style={styles.eventSub}>
            Walk for wellness and prevention
          </Text>

          <TouchableOpacity
            style={styles.eventButton}
            onPress={() =>
              goToCommunityEvent?.({
                id: "heart-health",
                title: "Heart Health Walk",
              })
            }
          >
            <Text style={styles.eventButtonText}>
              Join Event
            </Text>
          </TouchableOpacity>
        </View>

        <SectionTitle title="🤖 Legathon AI Community Coach" />

        <View style={styles.aiCoachCard}>
          <Text style={styles.aiCoachTitle}>
            Your Community Coach
          </Text>

          <Text style={styles.aiCoachMessage}>
            Great job today! Your walking circle is making progress.
            Encourage your friends, keep your streak alive, and stay
            consistent with your goals.
          </Text>

          <TouchableOpacity
            style={styles.aiCoachButton}
            onPress={goToAICoach}
          >
            <Text style={styles.aiCoachButtonText}>
              Open AI Coach
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.communityRewardCard}>
          <Text style={styles.communityRewardTitle}>
            Community Rewards
          </Text>

          <Text style={styles.communityRewardAmount}>
            🪙 {wcoins.toLocaleString()} W Coins
          </Text>

          <Text style={styles.communityRewardText}>
            Earn coins by encouraging friends, joining challenges,
            and completing community events.
          </Text>
        </View>

      <View style={{ height: 130 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
function SectionTitle({ title }) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function ActivityItem({ icon, title, subtitle, time }) {
  return (
    <View style={styles.activityItem}>
      <Text style={styles.activityIcon}>
        {icon}
      </Text>

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {title}
        </Text>

        <Text style={styles.activitySubtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={styles.activityTime}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020814",
  },

  content: {
    padding: 20,
    paddingBottom: 180,
  },

  backText: {
    color: "#8EF8D3",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 20,
  },

  header: {
    marginBottom: 22,
  },

  kicker: {
    color: "#FFD54A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  subtitle: {
    color: "#B8C3D8",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 8,
  },

  onlineCard: {
    marginTop: 20,
    backgroundColor: "#0B1628",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E2C42",
  },

  onlineNumber: {
    color: "#FFD54A",
    fontSize: 38,
    fontWeight: "900",
  },

  onlineLabel: {
    color: "#B8C3D8",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#0B1628",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1E2C42",
  },

  statValue: {
    color: "#FFD54A",
    fontSize: 24,
    fontWeight: "900",
  },

  statLabel: {
    color: "#B8C3D8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },

  passportCard: {
    backgroundColor: "#101827",
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFD54A",
  },

  passportKicker: {
    color: "#FFD54A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  passportName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  passportSub: {
    color: "#B8C3D8",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 23,
    marginTop: 8,
  },

  passportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },

  passportStat: {
    width: "48%",
    backgroundColor: "#0B1628",
    borderRadius: 18,
    padding: 16,
  },

  passportValue: {
    color: "#8EF8D3",
    fontSize: 24,
    fontWeight: "900",
  },

  passportLabel: {
    color: "#B8C3D8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },

    heroCard: {
    backgroundColor: "#101827",
    borderRadius: 28,
    padding: 22,
    borderWidth: 2,
    borderColor: "#FFD54A",
    marginBottom: 24,
  },

  heroSmall: {
    color: "#FFD54A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  heroProgress: {
    color: "#8EF8D3",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
  },

  heroBar: {
    height: 12,
    backgroundColor: "#233247",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 16,
  },

  heroFill: {
    height: "100%",
    backgroundColor: "#FFD54A",
  },

  walkButton: {
    backgroundColor: "#00E5C7",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },

  walkButtonText: {
    color: "#07111F",
    fontSize: 17,
    fontWeight: "900",
  },

  tabRow: {
    flexDirection: "row",
    marginBottom: 22,
    justifyContent: "space-between",
  },

  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#0B1628",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E2C42",
  },

  tabButtonActive: {
    backgroundColor: "#FFD54A",
  },

  tabText: {
    color: "#B8C3D8",
    fontWeight: "800",
  },

  tabTextActive: {
    color: "#07111F",
    fontWeight: "900",
  },

  quoteCard: {
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#263447",
    marginBottom: 24,
  },

  sectionMini: {
    color: "#FFD54A",
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },

  quoteText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
  },

  encourageButton: {
    marginTop: 18,
    backgroundColor: "#00E5C7",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
  },

  encourageText: {
    color: "#07111F",
    fontWeight: "900",
    fontSize: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 18,
    marginTop: 10,
  },

  activityCard: {
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#263447",
    marginBottom: 24,
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  activitySubtitle: {
    color: "#B8C3D8",
    marginTop: 4,
    fontSize: 13,
  },

  activityTime: {
    color: "#8EF8D3",
    fontWeight: "800",
    fontSize: 12,
  },

  activityDivider: {
    height: 1,
    backgroundColor: "#263447",
    marginVertical: 16,
  },

    feedCard: {
    flexDirection: "row",
    backgroundColor: "#0B1628",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1E2C42",
  },

  feedIcon: {
    fontSize: 36,
    marginRight: 16,
  },

  feedContent: {
    flex: 1,
  },

  feedTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 25,
  },

  feedJourney: {
    color: "#8EF8D3",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "700",
  },

  feedAction: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#16243A",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00E5C7",
  },

  feedActionText: {
    color: "#8EF8D3",
    fontWeight: "900",
  },

  liveCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#263447",
  },

  liveFlag: {
    fontSize: 34,
    marginRight: 14,
  },

  liveTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  liveSub: {
    color: "#8EF8D3",
    marginTop: 4,
  },

  joinText: {
    color: "#FFD54A",
    fontWeight: "900",
    fontSize: 15,
  },

  streakCard: {
    backgroundColor: "#111C2D",
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#FF8C42",
  },

  streakTitle: {
    color: "#FFB347",
    fontWeight: "900",
    fontSize: 18,
  },

  streakDays: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    marginTop: 8,
  },

  streakSub: {
    color: "#B8C3D8",
    marginTop: 6,
  },

  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  friendAvatar: {
    fontSize: 34,
    marginRight: 14,
  },

  friendName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  friendJourney: {
    color: "#8EF8D3",
    marginTop: 4,
  },

  friendSteps: {
    color: "#B8C3D8",
    marginTop: 4,
  },

  cheerButton: {
    backgroundColor: "#16243A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },

  cheerText: {
    color: "#8EF8D3",
    fontWeight: "900",
  },

  requestCard: {
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },

  requestName: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 18,
  },

  requestText: {
    color: "#B8C3D8",
    marginTop: 4,
  },

  requestButtons: {
    flexDirection: "row",
    marginTop: 16,
  },

  acceptButton: {
    flex: 1,
    backgroundColor: "#00E5C7",
    borderRadius: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },

  declineButton: {
    flex: 1,
    backgroundColor: "#263447",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  acceptText: {
    color: "#07111F",
    fontWeight: "900",
  },

  declineText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  circleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  circleCard: {
    width: "48%",
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  circleIcon: {
    fontSize: 34,
    marginBottom: 12,
  },

  circleTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
  },

  circleMembers: {
    color: "#8EF8D3",
    marginTop: 4,
  },

  circleRanking: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },

  rank: {
    fontSize: 36,
    marginRight: 14,
  },

  rankTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  rankMembers: {
    color: "#B8C3D8",
    marginTop: 4,
  },

  rankSteps: {
    color: "#FFD54A",
    fontWeight: "900",
  },

  challengeCard: {
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 20,
  },

  challengeProgress: {
    color: "#B8C3D8",
    marginVertical: 10,
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#233247",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFD54A",
  },

  rewardText: {
    color: "#FFD54A",
    fontWeight: "900",
    marginTop: 12,
  },

  challengeButton: {
    marginTop: 16,
    backgroundColor: "#00E5C7",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  challengeButtonText: {
    color: "#07111F",
    fontWeight: "900",
  },

  eventCard: {
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },

  eventTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  eventSub: {
    color: "#8EF8D3",
    marginTop: 6,
  },

  eventButton: {
    marginTop: 16,
    backgroundColor: "#FFD54A",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  eventButtonText: {
    color: "#07111F",
    fontWeight: "900",
  },

  aiCoachCard: {
    backgroundColor: "#111C2D",
    borderRadius: 28,
    padding: 22,
    borderWidth: 2,
    borderColor: "#00E5C7",
    marginBottom: 22,
  },

  aiCoachTitle: {
    color: "#00E5C7",
    fontSize: 22,
    fontWeight: "900",
  },

  aiCoachMessage: {
    color: "#FFFFFF",
    marginTop: 12,
    lineHeight: 24,
  },

  aiCoachButton: {
    marginTop: 18,
    backgroundColor: "#FFD54A",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
  },

  aiCoachButtonText: {
    color: "#07111F",
    fontWeight: "900",
  },

  communityRewardCard: {
    backgroundColor: "#101827",
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFD54A",
  },

  communityRewardTitle: {
    color: "#FFD54A",
    fontSize: 18,
    fontWeight: "900",
  },

  communityRewardAmount: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
  },

  communityRewardText: {
    color: "#B8C3D8",
    marginTop: 10,
    lineHeight: 22,
  },
});