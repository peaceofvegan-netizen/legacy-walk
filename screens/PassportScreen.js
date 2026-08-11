import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const PASSPORT_BG = require("../assets/passports/passport-background.png");

const PASSPORTS = [
  {
    id: "greatwall",
    title: "Great Wall",
    subtitle: "Legacy Trek",
    progress: 100,
    cover: require("../assets/passports/greatwall.png"),
    stamps: ["Badaling", "Juyongguan", "Simatai", "Jinshanling", "Mutianyu"],
  },
  {
    id: "rome",
    title: "Roman Empire",
    subtitle: "Legacy Journey",
    progress: 92,
    cover: require("../assets/passports/rome.png"),
    stamps: ["Roma", "Colosseum", "Appian Way", "Pantheon", "Forum"],
  },
  {
    id: "tubman",
    title: "Harriet Tubman",
    subtitle: "Journey to Freedom",
    progress: 76,
    cover: require("../assets/passports/tubman.png"),
    stamps: ["Bucktown", "The Call", "Underground", "Liberated", "Legacy"],
  },
  {
    id: "mecca",
    title: "Mecca",
    subtitle: "Pilgrimage of Faith",
    progress: 60,
    cover: require("../assets/passports/mecca.png"),
    stamps: ["Miqat", "Arrival", "Tawaf", "Sa’i", "Arafat"],
  },
  {
    id: "tokyo",
    title: "Tokyo Nights",
    subtitle: "Journey of Contrasts",
    progress: 48,
    cover: require("../assets/passports/tokyo.png"),
    stamps: ["Asakusa", "Shibuya", "Skyline", "Harajuku", "Senso-ji"],
  },
  {
    id: "trans",
    title: "Trans-Siberian",
    subtitle: "Journey Across Continents",
    progress: 35,
    cover: require("../assets/passports/trans.png"),
    stamps: ["Moscow", "Siberia", "Baikal", "Mongolia", "Beijing"],
  },
];

export default function PassportScreen({ language = "en", goBack }) {
  const [selectedPassport, setSelectedPassport] = useState(PASSPORTS[0]);

  const earnedStamps = useMemo(() => {
    return PASSPORTS.reduce((total, passport) => {
      return total + Math.ceil((passport.progress / 100) * passport.stamps.length);
    }, 0);
  }, []);

  const completedJourneys = PASSPORTS.filter((p) => p.progress >= 100).length;

  const selectedUnlockedStamps = Math.ceil(
    (selectedPassport.progress / 100) * selectedPassport.stamps.length
  );

  return (
    <ImageBackground source={PASSPORT_BG} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {goBack && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.kicker}>PASSPORT HUB</Text>
            <Text style={styles.title}>Passport Collection</Text>

            <View style={styles.explorerCard}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>

              <Text style={styles.name}>Phillip Morris</Text>
              <Text style={styles.rank}>Master Explorer</Text>

              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>{earnedStamps}</Text>
                  <Text style={styles.profileLabel}>Stamps</Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>{completedJourneys}</Text>
                  <Text style={styles.profileLabel}>Completed</Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>12</Text>
                  <Text style={styles.profileLabel}>Level</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Featured Passport</Text>

            <View style={styles.featuredPassportCard}>
              <Image
                source={selectedPassport.cover}
                style={styles.featuredPassportImage}
                resizeMode="cover"
              />

              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredLabel}>SELECTED JOURNEY</Text>
                <Text style={styles.featuredTitle}>{selectedPassport.title}</Text>
                <Text style={styles.featuredSub}>{selectedPassport.subtitle}</Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${selectedPassport.progress}%` },
                    ]}
                  />
                </View>

                <Text style={styles.featuredProgress}>
                  {selectedPassport.progress}% Complete
                </Text>
              </View>
            </View>

            <View style={styles.openPassportCard}>
              <Text style={styles.sectionTitleSmall}>Passport Stamps</Text>

              <View style={styles.stampList}>
                {selectedPassport.stamps.map((stamp, index) => {
                  const unlocked = index < selectedUnlockedStamps;

                  return (
                    <View
                      key={stamp}
                      style={[
                        styles.stampRow,
                        unlocked ? styles.stampRowUnlocked : styles.stampRowLocked,
                      ]}
                    >
                      <View
                        style={[
                          styles.stampSeal,
                          unlocked ? styles.stampSealUnlocked : styles.stampSealLocked,
                        ]}
                      >
                        <Text style={styles.stampSealText}>{index + 1}</Text>
                      </View>

                      <View style={styles.stampTextBox}>
                        <Text style={styles.stampTitle}>{stamp}</Text>
                        <Text style={styles.stampStatus}>
                          {unlocked ? "Stamped" : "Locked"}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Passport Shelf</Text>

            <View style={styles.shelfGrid}>
              {PASSPORTS.map((passport) => {
                const selected = passport.id === selectedPassport.id;

                return (
                  <TouchableOpacity
                    key={passport.id}
                    style={[
                      styles.shelfCard,
                      selected && styles.shelfCardActive,
                    ]}
                    activeOpacity={0.88}
                    onPress={() => setSelectedPassport(passport)}
                  >
                    <Image
                      source={passport.cover}
                      style={styles.shelfImage}
                      resizeMode="cover"
                    />

                    <View style={styles.shelfOverlay}>
                      <Text style={styles.shelfTitle}>{passport.title}</Text>
                      <Text style={styles.shelfProgress}>{passport.progress}%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.28)",
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 170,
  },

  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "900",
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    marginBottom: 22,
  },

  explorerCard: {
    backgroundColor: "rgba(8,18,34,0.84)",
    borderColor: "#D4AF37",
    borderWidth: 2,
    borderRadius: 34,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrap: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,175,55,0.12)",
    marginBottom: 14,
  },
  avatarIcon: {
    fontSize: 54,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },
  rank: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 18,
  },

  profileStats: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  profileStat: {
    width: "31%",
    backgroundColor: "rgba(8,18,34,0.92)",
    borderColor: "rgba(212,175,55,0.55)",
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  profileNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  profileLabel: {
    color: "#B9C3D6",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 18,
  },
  sectionTitleSmall: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  featuredPassportCard: {
    height: 430,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D4AF37",
    marginBottom: 30,
    backgroundColor: "#081426",
  },
  featuredPassportImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "rgba(2,6,23,0.76)",
  },
  featuredLabel: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 10,
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
  },
  featuredSub: {
    color: "#B9C3D6",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 18,
  },
  progressBar: {
    height: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
    borderRadius: 20,
  },
  featuredProgress: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "900",
  },

  openPassportCard: {
    backgroundColor: "rgba(8,18,34,0.86)",
    borderColor: "rgba(212,175,55,0.55)",
    borderWidth: 1,
    borderRadius: 34,
    padding: 18,
    marginBottom: 34,
  },
  stampList: {
    gap: 14,
  },
  stampRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    padding: 14,
    borderWidth: 1,
  },
  stampRowUnlocked: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderColor: "rgba(212,175,55,0.7)",
  },
  stampRowLocked: {
    backgroundColor: "rgba(15,23,42,0.45)",
    borderColor: "rgba(255,255,255,0.12)",
    opacity: 0.55,
  },
  stampSeal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stampSealUnlocked: {
    backgroundColor: "#D4AF37",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  stampSealLocked: {
    backgroundColor: "#1F2937",
    borderWidth: 3,
    borderColor: "#64748B",
  },
  stampSealText: {
    color: "#020617",
    fontSize: 28,
    fontWeight: "900",
  },
  stampTextBox: {
    flex: 1,
  },
  stampTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  stampStatus: {
    color: "#B9C3D6",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },

  shelfGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shelfCard: {
    width: "48%",
    height: 230,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#081426",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 18,
  },
  shelfCardActive: {
    borderColor: "#D4AF37",
    borderWidth: 3,
  },
  shelfImage: {
    width: "100%",
    height: "100%",
  },
  shelfOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(2,6,23,0.74)",
  },
  shelfTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  shelfProgress: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3,
  },
});