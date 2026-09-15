import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
import passportImages from "../data/passportImages";
import AsyncStorage from
  "@react-native-async-storage/async-storage";

import JOURNEY_CATALOG from
  "../data/journeyCatalog";

const PASSPORT_BG = require(
  "../assets/passports/passport-background.png"
);

const PROGRESS_STORAGE_KEY = "journeyProgressData";
const ACTIVE_JOURNEY_KEY = "activeJourney";

function safeParse(value, fallback = null) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log("Passport JSON error:", error);
    return fallback;
  }
}

function clampProgress(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
}

function readProgress(item) {
  if (typeof item === "number") {
    return clampProgress(item);
  }

  return clampProgress(
    item?.progress ??
      item?.journeyProgress ??
      item?.progressPercent ??
      item?.percentComplete ??
      0
  );
}

function createProgressMap(savedData) {
  const nextMap = {};

  if (Array.isArray(savedData)) {
    savedData.forEach((entry) => {
      const journeyId =
        entry?.id ??
        entry?.journeyId ??
        entry?.routeKey;

      if (!journeyId) return;

      nextMap[String(journeyId)] =
        readProgress(entry);
    });

    return nextMap;
  }

  if (
    savedData &&
    typeof savedData === "object"
  ) {
    const singleJourneyId =
      savedData.id ??
      savedData.journeyId ??
      savedData.routeKey;

    if (singleJourneyId) {
      nextMap[String(singleJourneyId)] =
        readProgress(savedData);

      return nextMap;
    }

    Object.entries(savedData).forEach(
      ([journeyId, value]) => {
        nextMap[String(journeyId)] =
          readProgress(value);
      }
    );
  }

  return nextMap;
}

function buildJourneyStamps(journey) {
  if (
    Array.isArray(journey?.stamps) &&
    journey.stamps.length > 0
  ) {
    return journey.stamps;
  }

  if (
    Array.isArray(journey?.checkpoints) &&
    journey.checkpoints.length > 0
  ) {
    return journey.checkpoints.map(
      (checkpoint, index) =>
        checkpoint?.title ??
        checkpoint?.name ??
        checkpoint?.label ??
        `Checkpoint ${index + 1}`
    );
  }

  const checkpointCount = Math.max(
    1,
    Number(journey?.checkpoints) || 5
  );

  return Array.from(
    { length: checkpointCount },
    (_, index) => `Checkpoint ${index + 1}`
  );
}

function getExplorerRank(completedJourneys) {
  if (completedJourneys >= 75) {
    return "Elite Explorer";
  }

  if (completedJourneys >= 50) {
    return "Legend";
  }

  if (completedJourneys >= 25) {
    return "Trailblazer";
  }

  if (completedJourneys >= 10) {
    return "Pathfinder";
  }

  if (completedJourneys >= 1) {
    return "Explorer";
  }

  return "New Explorer";
}

export default function PassportScreen({
  language = "en",
  goBack,
  userName = "Explorer",
  activeJourney = null,
}) {
  const [progressMap, setProgressMap] =
    useState({});

  const [selectedPassportId, setSelectedPassportId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadPassportProgress =
    useCallback(async () => {
      try {
        setLoading(true);

        const storedValues =
          await AsyncStorage.multiGet([
            PROGRESS_STORAGE_KEY,
            ACTIVE_JOURNEY_KEY,
          ]);

        const progressRaw =
          storedValues[0]?.[1];

        const activeRaw =
          storedValues[1]?.[1];

        const savedProgress =
          safeParse(progressRaw, []);

        const savedActive =
          safeParse(activeRaw, null);

        const nextMap =
          createProgressMap(savedProgress);

        const currentActive =
          activeJourney || savedActive;

        const activeId =
          currentActive?.id ??
          currentActive?.journeyId ??
          currentActive?.routeKey;

        if (activeId) {
          const savedActiveProgress =
            readProgress(currentActive);

          nextMap[String(activeId)] =
            Math.max(
              nextMap[String(activeId)] || 0,
              savedActiveProgress
            );
        }

        setProgressMap(nextMap);
      } catch (error) {
        console.log(
          "Passport progress load error:",
          error
        );

        setProgressMap({});
      } finally {
        setLoading(false);
      }
    }, [activeJourney]);

  useEffect(() => {
    loadPassportProgress();
  }, [loadPassportProgress]);

  const passports = useMemo(() => {
    const catalog =
      Array.isArray(JOURNEY_CATALOG)
        ? JOURNEY_CATALOG
        : [];

    return catalog.map((journey) => {
      const journeyId = String(
        journey?.id ??
          journey?.journeyId ??
          journey?.routeKey ??
          ""
      );

      return {
        ...journey,

        id: journeyId,

        title:
          journey?.title ||
          "Untitled Journey",

        subtitle:
          journey?.subtitle ||
          journey?.category ||
          "Legathon Journey",

        progress:
          progressMap[journeyId] || 0,

       cover:
  passportImages[journeyId] ||
  journey?.passportCover ||
  journey?.passportImage ||
  journey?.image ||
  journey?.routeImage ||
  null,

        stamps:
          buildJourneyStamps(journey),
      };
    });
  }, [progressMap]);

  useEffect(() => {
    if (passports.length === 0) {
      setSelectedPassportId(null);
      return;
    }

    const selectionStillExists =
      passports.some(
        (passport) =>
          passport.id === selectedPassportId
      );

    if (!selectionStillExists) {
      const activePassport =
        passports.find(
          (passport) =>
            passport.progress > 0 &&
            passport.progress < 100
        ) ||
        passports.find(
          (passport) =>
            passport.progress >= 100
        ) ||
        passports[0];

      setSelectedPassportId(
        activePassport.id
      );
    }
  }, [passports, selectedPassportId]);

  const selectedPassport = useMemo(() => {
    return (
      passports.find(
        (passport) =>
          passport.id === selectedPassportId
      ) ||
      passports[0] ||
      null
    );
  }, [passports, selectedPassportId]);

  const earnedStamps = useMemo(() => {
    return passports.reduce(
      (total, passport) => {
        const unlocked = Math.floor(
          (passport.progress / 100) *
            passport.stamps.length
        );

        return total + unlocked;
      },
      0
    );
  }, [passports]);

  const completedJourneys = useMemo(() => {
    return passports.filter(
      (passport) =>
        passport.progress >= 100
    ).length;
  }, [passports]);

  const explorerLevel = Math.max(
    1,
    completedJourneys + 1
  );

  const explorerRank =
    getExplorerRank(completedJourneys);

  const selectedUnlockedStamps =
    selectedPassport
      ? Math.floor(
          (selectedPassport.progress / 100) *
            selectedPassport.stamps.length
        )
      : 0;

  return (
    <ImageBackground
      source={PASSPORT_BG}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {!!goBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={goBack}
              >
                <Text style={styles.backText}>
                  ← Back
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.kicker}>
              LEGATHON PASSPORT HUB
            </Text>

            <Text style={styles.title}>
              Passport Collection
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={loadPassportProgress}
            >
              <Text style={styles.backText}>
                ↻ Refresh Progress
              </Text>
            </TouchableOpacity>

            <View style={styles.explorerCard}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarIcon}>
                  👤
                </Text>
              </View>

              <Text style={styles.name}>
                {userName}
              </Text>

              <Text style={styles.rank}>
                {explorerRank}
              </Text>

              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {earnedStamps}
                  </Text>

                  <Text style={styles.profileLabel}>
                    Stamps
                  </Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {completedJourneys}
                  </Text>

                  <Text style={styles.profileLabel}>
                    Completed
                  </Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {explorerLevel}
                  </Text>

                  <Text style={styles.profileLabel}>
                    Level
                  </Text>
                </View>
              </View>
            </View>

            {loading ? (
              <View style={styles.openPassportCard}>
                <Text style={styles.sectionTitleSmall}>
                  Loading passports...
                </Text>
              </View>
            ) : !selectedPassport ? (
              <View style={styles.openPassportCard}>
                <Text style={styles.sectionTitleSmall}>
                  No journeys available
                </Text>

                <Text style={styles.stampStatus}>
                  Add journeys to journeyCatalog.js.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>
                  Featured Passport
                </Text>

                <View
                  style={styles.featuredPassportCard}
                >
                  {selectedPassport.cover ? (
                    <Image
                      source={selectedPassport.cover}
                      style={
                        styles.featuredPassportImage
                      }
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.featuredPassportImage,
                        {
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#081426",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 72,
                        }}
                      >
                        🛂
                      </Text>
                    </View>
                  )}

                  <View style={styles.featuredOverlay}>
                    <Text
                      style={styles.featuredLabel}
                    >
                      SELECTED JOURNEY
                    </Text>

                    <Text
                      style={styles.featuredTitle}
                    >
                      {selectedPassport.title}
                    </Text>

                    <Text
                      style={styles.featuredSub}
                    >
                      {selectedPassport.subtitle}
                    </Text>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width:
                              `${selectedPassport.progress}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={styles.featuredProgress}
                    >
                      {selectedPassport.progress}%
                      Complete
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.openPassportCard}
                >
                  <Text
                    style={styles.sectionTitleSmall}
                  >
                    Passport Stamps
                  </Text>

                  <View style={styles.stampList}>
                    {selectedPassport.stamps.map(
                      (stamp, index) => {
                        const unlocked =
                          index <
                          selectedUnlockedStamps;

                        return (
                          <View
                            key={
                              `${selectedPassport.id}-${index}`
                            }
                            style={[
                              styles.stampRow,
                              unlocked
                                ? styles.stampRowUnlocked
                                : styles.stampRowLocked,
                            ]}
                          >
                            <View
                              style={[
                                styles.stampSeal,
                                unlocked
                                  ? styles.stampSealUnlocked
                                  : styles.stampSealLocked,
                              ]}
                            >
                              <Text
                                style={
                                  styles.stampSealText
                                }
                              >
                                {index + 1}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.stampTextBox
                              }
                            >
                              <Text
                                style={
                                  styles.stampTitle
                                }
                              >
                                {stamp}
                              </Text>

                              <Text
                                style={
                                  styles.stampStatus
                                }
                              >
                                {unlocked
                                  ? "Stamped"
                                  : "Locked"}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                <Text style={styles.sectionTitle}>
                  Passport Shelf
                </Text>

                <View style={styles.shelfGrid}>
                  {passports.map((passport) => {
                    const selected =
                      passport.id ===
                      selectedPassport.id;

                    return (
                      <TouchableOpacity
                        key={passport.id}
                        style={[
                          styles.shelfCard,
                          selected &&
                            styles.shelfCardActive,
                        ]}
                        activeOpacity={0.88}
                        onPress={() =>
                          setSelectedPassportId(
                            passport.id
                          )
                        }
                      >
                        {passport.cover ? (
                          <Image
                            source={passport.cover}
                            style={styles.shelfImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.shelfImage,
                              {
                                alignItems: "center",
                                justifyContent:
                                  "center",
                                backgroundColor:
                                  "#081426",
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: 42,
                              }}
                            >
                              🛂
                            </Text>
                          </View>
                        )}

                        <View
                          style={styles.shelfOverlay}
                        >
                          <Text
                            style={styles.shelfTitle}
                            numberOfLines={2}
                          >
                            {passport.title}
                          </Text>

                          <Text
                            style={
                              styles.shelfProgress
                            }
                          >
                            {passport.progress}%
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
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