import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEquippedAvatar } from "../utils/avatarInventoryStorage";
import { translate } from "../i18n/i18n";

const COLLAGE_BG = require("../assets/collage-background.png");

const formatNumber = (value) => Number(value || 0).toLocaleString();

export default function ProfileScreen({
  language = "en",
  openPassport,
}) {
  
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [lifetimeSteps, setLifetimeSteps] = useState(0);
  const [totalMiles, setTotalMiles] = useState(0);
  const [completedJourneys, setCompletedJourneys] = useState([]);
  const [passportStamps, setPassportStamps] = useState([]);
  const [rewardsEarned, setRewardsEarned] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      try {
        const avatar = await getEquippedAvatar();
        setCurrentAvatar(avatar);
      } catch (e) {
        console.log("Avatar load failed:", e);
      }

const savedSteps = await AsyncStorage.getItem("lifetimeSteps");
const journeys = await AsyncStorage.getItem("completedJourneys");
const stamps = await AsyncStorage.getItem("passportStamps");
const rewards = await AsyncStorage.getItem("rewardsEarned");

const steps = Number(savedSteps || 0);

const parsedJourneys = JSON.parse(journeys || "[]");

setLifetimeSteps(steps);
setTotalMiles(Math.round((steps * 2.5) / 5280));

setCompletedJourneys(
  Array.isArray(parsedJourneys)
    ? parsedJourneys
    : []
);

setPassportStamps(JSON.parse(stamps || "[]"));
setRewardsEarned(JSON.parse(rewards || "[]"));
    } catch (error) {
      console.log("Profile load error:", error);
    }
  }

  const journeyCount = completedJourneys?.length || 0;
  const stampCount = passportStamps?.length || 0;
  const rewardCount = rewardsEarned?.length || 0;
const favoriteJourney =
  completedJourneys.find(j => !j.completed) ||
  completedJourneys[0] || {
    id: "rome",
    icon: "🏛️",
    title: "Roman Empire",
    progress: 92,
  };
  return (
    <ImageBackground
      source={COLLAGE_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>
              {translate(language, "Profile Title") || "Explorer Identity"}
            </Text>

            <View style={styles.heroCard}>
              <View style={styles.avatarRing}>
                {currentAvatar?.image ? (
                  <Image
                    source={currentAvatar.image}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarIcon}>👤</Text>
                )}
              </View>

              <Text style={styles.name}>Phillip Morris</Text>
              <Text style={styles.rank}>Master Explorer</Text>

              {currentAvatar && (
                <>
                  <Text style={styles.avatarName}>{currentAvatar.name}</Text>
                  <Text style={styles.avatarMeta}>
                    {currentAvatar.group} • {currentAvatar.gender}
                  </Text>
                </>
              )}

              <Text style={styles.legathonScore}>
                {formatNumber(lifetimeSteps)} Legacy Score
              </Text>

              <View style={styles.levelBar}>
                <View style={styles.levelFill} />
              </View>

              <Text style={styles.levelText}>
                Level 12 • 74% to Legathon Walker
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <Stat number={formatNumber(lifetimeSteps)} label="Steps" />
              <Stat number={formatNumber(totalMiles)} label="Miles" />
              <Stat number={formatNumber(journeyCount)} label="Journeys" />
              <Stat number={formatNumber(journeyCount)} label="Completed" />
              <Stat number={formatNumber(stampCount)} label="Stamps" />
              <Stat number={formatNumber(rewardCount)} label="Rewards" />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Favorite Journey</Text>

            <TouchableOpacity
  style={styles.favoriteCard}
  onPress={() => openPassport && openPassport(favoriteJourney.id || "rome")}
>
  <Text style={styles.favoriteIcon}>{favoriteJourney.icon || "🏛️"}</Text>

  <View style={{ flex: 1 }}>
    <Text style={styles.favoriteTitle}>{favoriteJourney.title}</Text>
    <Text style={styles.favoriteSub}>
      Legacy Journey • {favoriteJourney.progress || 0}% Complete
    </Text>
  </View>
</TouchableOpacity>

            
            
</View>
            
           <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Passport Collection</Text>

          <View style={styles.collectionRow}>
 <Collection
  image={passportStamps.includes("rome")
    ? require("../assets/passports/rome.png")
    : require("../assets/locked/legacy-lock.png")
  }
  title="Rome"
  unlocked={passportStamps.includes("rome")}
  openPassport={() => openPassport("rome")}
/>

<Collection
  image={
    passportStamps.includes("wall")
      ? require("../assets/passports/greatwall.png")
      : require("../assets/locked/legacy-lock.png")
  }
  title="Great Wall"
  unlocked={passportStamps.includes("wall")}
  openPassport={() => openPassport("wall")}
/>

<Collection
  image={
    passportStamps.includes("tubman")
      ? require("../assets/passports/tubman.png")
      : require("../assets/locked/legacy-lock.png")
  }
  title="Tubman"
  unlocked={passportStamps.includes("tubman")}
  openPassport={() => openPassport("tubman")}
/>

<Collection
  image={
    passportStamps.includes("mecca")
      ? require("../assets/passports/mecca.png")
      : require("../assets/locked/legacy-lock.png")
  }
  title="Mecca"
  unlocked={passportStamps.includes("mecca")}
  openPassport={() => openPassport("mecca")}
/>

<Collection
  image={
    passportStamps.includes("tokyo")
      ? require("../assets/passports/tokyo.png")
      : require("../assets/locked/legacy-lock.png")
  }
  title="Tokyo"
  unlocked={passportStamps.includes("tokyo")}
  openPassport={() => openPassport("tokyo")}
/>
</View>
        </View>    

            <View style={styles.goldCard}>
              <Text style={styles.goldLabel}>ACHIEVEMENT WALL</Text>
              <Text style={styles.sectionTitle}>Badges Earned</Text>

              <View style={styles.badgeGrid}>

  <Badge
    icon="🥇"
    title="First Route"
    unlocked={completedJourneys.length >= 1}
  />

  <Badge
    icon="🛡️"
    title="First Passport"
    unlocked={passportStamps.length >= 1}
  />

  <Badge
    icon="🔥"
    title="Streak Master"
    unlocked={lifetimeSteps >= 100000}
  />

  <Badge
    icon="🌎"
    title="World Explorer"
    unlocked={completedJourneys.length >= 10}
  />

</View>
            </View>

            <View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Journey Timeline</Text>

  {completedJourneys.length === 0 ? (
    <Text style={styles.emptyText}>No completed journeys yet</Text>
  ) : (
    completedJourneys.map((journey, index) => (
      <Timeline
        key={journey.id || index}
        title={journey.title}
        date={journey.completed ? "Completed" : `${journey.progress || 0}% Complete`}
      />
    ))
  )}
</View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Legathon Rank</Text>

              {[
                "Traveler",
                "Wayfinder",
                "Explorer",
                "Master Explorer",
                "Legacy Walker",
                "Historian",
                "Legend",
              ].map((rank) => {
                const active = rank === "Master Explorer";

                return (
                  <View
                    key={rank}
                    style={[styles.rankRow, active && styles.rankRowActive]}
                  >
                    <Text style={styles.rankDot}>{active ? "◆" : "◇"}</Text>
                    <Text
                      style={[styles.rankName, active && styles.rankNameActive]}
                    >
                      {rank}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.showcaseCard}>
              <Text style={styles.showcaseLabel}>LEGATHON SHOWCASE</Text>
              <Text style={styles.showcaseTitle}>Public Profile Highlights</Text>

              <Showcase label="Favorite Passport" value="Tokyo Nights" />
              <Showcase label="Favorite Badge" value="World Explorer" />
              <Showcase label="Favorite Journey" value="Great Wall Trek" />
            </View>

            <View style={styles.bottomCard}>
              <Text style={styles.bottomLabel}>MEMBER SINCE</Text>
              <Text style={styles.bottomTitle}>June 2026</Text>
              <Text style={styles.bottomText}>
                Current streak: 24 days • Next reward: 450 points away
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function Stat({ number, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>
        {number}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}


function Collection({ image, title, unlocked = false, openPassport }) {
  return (
    <TouchableOpacity
      style={[
        styles.passportCard,
        unlocked && styles.unlockedPassport,
      ]}
      onPress={() => unlocked && openPassport()}
      activeOpacity={unlocked ? 0.85 : 1}
    >
      <Image source={image} style={styles.passportImage} />

      <Text style={styles.passportTitle}>{title}</Text>
    </TouchableOpacity>
  );
}
   

function Badge({ icon, title, unlocked = false }) {
  return (
    <View
      style={[
        styles.badgeCard,
        unlocked ? styles.badgeUnlocked : styles.badgeLocked,
      ]}
    >
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={styles.badgeTitle}>{title}</Text>
    </View>
  );
}

     
function Timeline({ title, date }) {
  return (
    <View style={styles.timelineRow}>
      <Text style={styles.timelineDot}>●</Text>

      <View>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDate}>{date}</Text>
      </View>
    </View>
  );
}

function Showcase({ label, value }) {
  return (
    <View style={styles.showcaseRow}>
      <Text style={styles.showcaseItemLabel}>{label}</Text>
      <Text style={styles.showcaseItemValue}>{value}</Text>
    </View>
  );
}




const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },
  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.45,
  },




  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,4,10,0.78)",
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 160,
  },

collectionUnlocked: {
  borderWidth: 2,
  borderColor: "#D4AF37",

  shadowColor: "#D4AF37",
  shadowOpacity: 0.6,
  shadowRadius: 10,

  elevation: 8,
},

collectionLocked: {
  opacity: 0.45,
},

  title: {
    color: "#F8F2E7",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 46,
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
    marginBottom: 20,
  },
  avatarRing: {
    width: 150,
    height: 180,
    borderRadius: 36,
    backgroundColor: "#0B1220",
    borderWidth: 3,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: 130,
    height: 170,
    resizeMode: "contain",
  },
  avatarIcon: {
    fontSize: 54,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  rank: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },

  emptyText: {
  color: "#AAB3C5",
  fontSize: 18,
  fontWeight: "800",
  marginTop: 10,
},
  avatarName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,


badgeCard: {
  width: "48%",
  borderRadius: 18,
  padding: 14,
  alignItems: "center",
  marginBottom: 12,
},

badgeLocked: {
  backgroundColor: "#101826",
  opacity: 0.4,
},

badgeUnlocked: {
  backgroundColor: "rgba(212,175,55,0.15)",
  borderWidth: 2,
  borderColor: "#D4AF37",

  shadowColor: "#D4AF37",
  shadowOpacity: 0.7,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 10,
},

badgeIcon: {
  fontSize: 28,
},

badgeTitle: {
  color: "#FFFFFF",
  fontWeight: "900",
  textAlign: "center",
  marginTop: 8,
},

  },
  avatarMeta: {
    color: "#AAB3C5",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
    textTransform: "capitalize",
  },
  legacyScore: {
    color: "#AAB3C5",
    marginTop: 18,
    fontWeight: "900",
  },
  levelBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#20344A",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 14,
  },
  levelFill: {
    width: "74%",
    height: "100%",
    backgroundColor: "#D4AF37",
  },
  levelText: {
    color: "#AAB3C5",
    fontWeight: "800",
    marginTop: 10,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    width: "31%",
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 22,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#26344A",
  },
  statNumber: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  statLabel: {
    color: "#AAB3C5",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },

  sectionCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26344A",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101826",
    padding: 16,
    borderRadius: 22,
  },
  favoriteIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  favoriteTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  favoriteSub: {
    color: "#AAB3C5",
    marginTop: 4,
    fontWeight: "700",
  },

 collectionRow: {
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

collectionItem: {
  width: "48%", // Two cards per row
  minHeight: 130,
  backgroundColor: "#101826",
  borderRadius: 18,
  paddingVertical: 20,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,

  },
  collectionIcon: {
    fontSize: 28,
  },
  collectionTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: 8,
  },

  goldCard: {
    backgroundColor: "rgba(20,16,5,0.95)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginBottom: 20,
  },
  goldLabel: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "#101826",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
    opacity: 0.5,
  },
  badgeUnlocked: {
    opacity: 1,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  timelineDot: {
    color: "#D4AF37",
    fontSize: 28,
    marginRight: 12,
  },
  timelineTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  timelineDate: {
    color: "#AAB3C5",
    fontWeight: "800",
    marginTop: 2,
  },

  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  rankRowActive: {
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  rankDot: {
    color: "#D4AF37",
    fontSize: 18,
    marginRight: 12,
  },
  rankName: {
    color: "#AAB3C5",
    fontWeight: "900",
    fontSize: 16,
  },
  rankNameActive: {
    color: "#FFFFFF",
  },

  showcaseCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26344A",
    marginBottom: 20,
  },
  showcaseLabel: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },
  showcaseTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  showcaseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#26344A",
    paddingVertical: 10,
  },
  showcaseItemLabel: {
    color: "#AAB3C5",
    fontWeight: "800",
  },
  showcaseItemValue: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  bottomCard: {
    backgroundColor: "rgba(20,16,5,0.95)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  bottomLabel: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  bottomTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },

  passportCard: {
  width: "48%",
  height: 235,
  backgroundColor: "#0E1A2F",
  borderRadius: 24,
  borderWidth: 1.5,
  borderColor: "#263A5E",
  overflow: "hidden",
  marginBottom: 20,
  alignItems: "center",
  justifyContent: "center",
},

unlockedPassport: {
  borderColor: "#D4AF37",
},

passportImage: {
  width: "100%",
  height: 165,
  resizeMode: "contain",
},

passportTitle: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "900",
  marginTop: 8,
},
  bottomText: {
    color: "#AAB3C5",
    fontWeight: "800",
    lineHeight: 22,
  },
});