// screens/ProfileScreen.js

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  AppState,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  avatarOptions,
} from "../data/avatarOptions";

import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";

import {
  getCurrentAvatarSuit,
} from "../utils/avatarWardrobeStorage";

import {
  translate,
} from "../i18n/i18n";

import useLegathonPoints from "../hooks/useLegathonPoints";


// ============================================================
// ASSETS
// ============================================================

const COLLAGE_BG =
  require("../assets/collage-background.png");

const LOCKED_PASSPORT =
  require("../assets/locked/legacy-lock.png");

const PASSPORT_IMAGES = {
  rome:
    require("../assets/passports/rome.png"),

  wall:
    require("../assets/passports/greatwall.png"),

  tubman:
    require("../assets/passports/tubman.png"),

  mecca:
    require("../assets/passports/mecca.png"),

  tokyo:
    require("../assets/passports/tokyo.png"),
};


// ============================================================
// CONSTANTS
// ============================================================

const STEPS_PER_MILE = 2000;


// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed)
  ) {
    return fallback;
  }

  return parsed;
}


function formatNumber(
  value
) {
  return safeNumber(
    value
  ).toLocaleString();
}


function safeParse(
  value,
  fallback
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch (error) {
    return fallback;
  }
}


function normalizeSuitName(
  suitId
) {
  switch (
    String(
      suitId ||
      "default"
    ).toLowerCase()
  ) {
    case "blue":
      return "Blue Tracksuit";

    case "green":
      return "Green Tracksuit";

    case "red":
      return "Red Tracksuit";

    case "yellow":
      return "Yellow Tracksuit";

    case "elite":
      return "Black & Gold Elite";

    default:
      return "Default Outfit";
  }
}


function getFirstUnlockedPassport(
  stamps
) {
  if (
    !Array.isArray(stamps)
  ) {
    return "None Yet";
  }

  const order = [
    ["tokyo", "Tokyo"],
    ["rome", "Rome"],
    ["wall", "Great Wall"],
    ["tubman", "Tubman"],
    ["mecca", "Mecca"],
  ];

  for (
    const [
      id,
      title,
    ] of order
  ) {
    if (
      stamps.includes(
        id
      )
    ) {
      return title;
    }
  }

  return "None Yet";
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function ProfileScreen({
  language = "en",
  openPassport,
  goToAvatarCenter,
  goBack,
}) {

  // ==========================================================
  // PROFILE / AVATAR
  // ==========================================================

  const [
    avatarName,
    setAvatarName,
  ] =
    useState(
      "Legathon Walker"
    );

  const [
    selectedAvatarId,
    setSelectedAvatarId,
  ] =
    useState(
      avatarOptions?.[0]?.id ||
      null
    );

  const [
    avatarImage,
    setAvatarImage,
  ] =
    useState(
      avatarOptions?.[0]?.image ||
      null
    );

  const [
    equippedSuit,
    setEquippedSuit,
  ] =
    useState(
      "default"
    );


  // ==========================================================
  // PROFILE DATA
  // ==========================================================

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(0);

  const [
    totalMiles,
    setTotalMiles,
  ] =
    useState(0);

  const [
    completedJourneys,
    setCompletedJourneys,
  ] =
    useState([]);

  const [
    journeyCount,
    setJourneyCount,
  ] =
    useState(0);

  const [
    passportStamps,
    setPassportStamps,
  ] =
    useState([]);

  const [
    rewardsEarned,
    setRewardsEarned,
  ] =
    useState([]);

  const [
    walkingStreak,
    setWalkingStreak,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  // ==========================================================
  // LEGATHON POINTS / RANK
  // ==========================================================

  const {
    points:
      legathonPoints,

    rank:
      legathonRank,
  } =
    useLegathonPoints();


  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );


          // --------------------------------------------------
          // READ SAVED DATA
          // --------------------------------------------------

          const [
            savedSteps,
            journeysRaw,
            stampsRaw,
            rewardsRaw,
            profileRaw,
            streakRaw,
            currentSuit,
          ] =
            await Promise.all([

              AsyncStorage.getItem(
                "lifetimeSteps"
              ),

              AsyncStorage.getItem(
                "journeyProgressData"
              ),

              AsyncStorage.getItem(
                "passportStamps"
              ),

              AsyncStorage.getItem(
                "rewardsEarned"
              ),

              AsyncStorage.getItem(
                "avatarProfile"
              ),

              AsyncStorage.getItem(
                "walkingStreak"
              ),

              getCurrentAvatarSuit(),

            ]);


          // --------------------------------------------------
          // STEPS
          // --------------------------------------------------

          const steps =
            Math.max(
              0,
              safeNumber(
                savedSteps
              )
            );


          setLifetimeSteps(
            steps
          );


          setTotalMiles(
            Number(
              (
                steps /
                STEPS_PER_MILE
              ).toFixed(2)
            )
          );


          // --------------------------------------------------
          // JOURNEYS
          // --------------------------------------------------

          const parsedJourneys =
            safeParse(
              journeysRaw,
              []
            );


          const journeys =
            Array.isArray(
              parsedJourneys
            )
              ? parsedJourneys
              : [];


          setJourneyCount(
            journeys.length
          );


          const completed =
            journeys.filter(
              (journey) => {

                if (
                  journey?.completed ===
                  true
                ) {
                  return true;
                }


                return (
                  safeNumber(
                    journey?.progress
                  ) >= 100
                );
              }
            );


          setCompletedJourneys(
            completed
          );


          // --------------------------------------------------
          // PASSPORTS
          // --------------------------------------------------

          const parsedStamps =
            safeParse(
              stampsRaw,
              []
            );


          setPassportStamps(
            Array.isArray(
              parsedStamps
            )
              ? parsedStamps
              : []
          );


          // --------------------------------------------------
          // REWARDS
          // --------------------------------------------------

          const parsedRewards =
            safeParse(
              rewardsRaw,
              []
            );


          setRewardsEarned(
            Array.isArray(
              parsedRewards
            )
              ? parsedRewards
              : []
          );


          // --------------------------------------------------
          // STREAK
          // --------------------------------------------------

          setWalkingStreak(
            Math.max(
              0,
              safeNumber(
                streakRaw
              )
            )
          );


          // --------------------------------------------------
          // EQUIPPED SUIT
          // --------------------------------------------------

          setEquippedSuit(
            currentSuit ||
            "default"
          );


          // --------------------------------------------------
          // SELECTED AVATAR PROFILE
          // --------------------------------------------------

          const savedProfile =
            safeParse(
              profileRaw,
              null
            );


          const avatarId =
            savedProfile?.avatarId ||
            avatarOptions?.[0]?.id ||
            null;


          const name =
            savedProfile?.name ||
            "Legathon Walker";


          setAvatarName(
            name
          );


          setSelectedAvatarId(
            avatarId
          );


          // --------------------------------------------------
          // FIND NORMAL AVATAR
          // --------------------------------------------------

          const normalAvatar =
            avatarOptions.find(
              (avatar) =>
                avatar.id ===
                avatarId
            ) ||
            avatarOptions?.[0] ||
            null;


          // --------------------------------------------------
          // RESOLVE EQUIPPED TRACKSUIT AVATAR
          // --------------------------------------------------

          if (
            avatarId
          ) {

            try {

              const visual =
                await getCurrentAvatarVisual(
                  avatarId
                );


              setAvatarImage(
                visual?.image ||
                normalAvatar?.image ||
                null
              );

            } catch (
              avatarError
            ) {

              console.log(
                "Profile avatar visual error:",
                avatarError
              );


              setAvatarImage(
                normalAvatar?.image ||
                null
              );
            }

          } else {

            setAvatarImage(
              normalAvatar?.image ||
              null
            );
          }


        } catch (error) {

          console.log(
            "Profile load error:",
            error
          );

        } finally {

          setLoading(
            false
          );
        }
      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadProfile();

    },
    [
      loadProfile
    ]
  );


  // ==========================================================
  // REFRESH WHEN APP RETURNS TO FOREGROUND
  // ==========================================================

  useEffect(
    () => {

      const subscription =
        AppState.addEventListener(
          "change",
          (nextState) => {

            if (
              nextState ===
              "active"
            ) {
              loadProfile();
            }
          }
        );


      return () => {

        subscription?.remove?.();

      };

    },
    [
      loadProfile
    ]
  );


  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const completedCount =
    completedJourneys.length;


  const stampCount =
    passportStamps.length;


  const rewardCount =
    rewardsEarned.length;


  const currentRank =
    legathonRank?.currentRank ||
    legathonRank?.rank ||
    "New Walker";


  const nextRank =
    legathonRank?.nextRank ||
    "MAX";


  const rankProgress =
    Math.min(
      100,
      Math.max(
        0,
        safeNumber(
          legathonRank?.progress
        )
      )
    );


  const favoriteJourney =
    completedJourneys?.[0] ||
    {
      id:
        "rome",

      icon:
        "🏛️",

      title:
        "Roman Empire",

      progress: 0,
    };


  const favoritePassport =
    getFirstUnlockedPassport(
      passportStamps
    );


  const favoriteBadge =
    completedCount >= 10
      ? "World Explorer"
      : lifetimeSteps >=
        100000
      ? "Streak Master"
      : stampCount >= 1
      ? "First Passport"
      : completedCount >= 1
      ? "First Route"
      : "No Badge Yet";


  const displayJourneyTitle =
    favoriteJourney?.title ||
    "No Favorite Yet";


  const rankOrder = [
    "New Walker",
    "Explorer",
    "Pathfinder",
    "Trailblazer",
    "Adventurer",
    "Champion",
    "Master Walker",
    "Legathon Hero",
    "Legend",
    "Hall of Fame",
  ];


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ImageBackground
      source={
        COLLAGE_BG
      }
      style={
        styles.background
      }
      imageStyle={
        styles.backgroundImage
      }
    >

      <View
        style={
          styles.overlay
        }
      >

        <SafeAreaView
          style={
            styles.safe
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

            {/* =================================================
                HEADER
            ================================================= */}

            <View
              style={
                styles.headerRow
              }
            >

              {goBack ? (

                <TouchableOpacity
                  style={
                    styles.backButton
                  }
                  onPress={
                    goBack
                  }
                >

                  <Text
                    style={
                      styles.backText
                    }
                  >
                    ‹
                  </Text>

                </TouchableOpacity>

              ) : (

                <View
                  style={
                    styles.backSpacer
                  }
                />

              )}


              <View
                style={
                  styles.headerTextWrap
                }
              >

                <Text
                  style={
                    styles.eyebrow
                  }
                >
                  LEGATHON WALK
                </Text>


                <Text
                  style={
                    styles.title
                  }
                >
                  {translate(
                    language,
                    "LegathonProfile"
                  ) ||
                    "Legathon Profile"}
                </Text>


                <Text
                  style={
                    styles.headerSubtitle
                  }
                >
                  Your walking Legathon in one place
                </Text>

              </View>

            </View>


            {/* =================================================
                PREMIUM PROFILE HERO
            ================================================= */}

            <View
              style={
                styles.heroCard
              }
            >

              <View
                style={
                  styles.heroGlow
                }
              />


              <View
                style={
                  styles.avatarStage
                }
              >

                {avatarImage ? (

                  <Image
                    source={
                      avatarImage
                    }
                    style={
                      styles.avatarImage
                    }
                    resizeMode="contain"
                  />

                ) : (

                  <Text
                    style={
                      styles.avatarFallback
                    }
                  >
                    👤
                  </Text>

                )}


                <View
                  style={
                    styles.rankPill
                  }
                >

                  <Text
                    style={
                      styles.rankPillText
                    }
                  >
                    {currentRank}
                  </Text>

                </View>

              </View>


              <View
                style={
                  styles.heroInfo
                }
              >

                <Text
                  style={
                    styles.profileLabel
                  }
                >
                  YOUR LEGATHON IDENTITY
                </Text>


                <Text
                  style={
                    styles.name
                  }
                >
                  {avatarName}
                </Text>


               


                <View
                  style={
                    styles.outfitPill
                  }
                >

                  <Text
                    style={
                      styles.outfitPillText
                    }
                  >
                    ✓{" "}
                    {normalizeSuitName(
                      equippedSuit
                    )}
                  </Text>

                </View>


                <Text
                  style={
                    styles.legathonScore
                  }
                >
                  ⭐{" "}
                  {formatNumber(
                    legathonPoints
                  )}{" "}
                  Legathon Points
                </Text>


                <View
                  style={
                    styles.levelBar
                  }
                >

                  <View
                    style={[
                      styles.levelFill,
                      {
                        width:
                          `${rankProgress}%`,
                      },
                    ]}
                  />

                </View>


                <Text
                  style={
                    styles.levelText
                  }
                >
                  {Math.round(
                    rankProgress
                  )}
                  % to{" "}
                  {nextRank}
                </Text>


                {goToAvatarCenter ? (

                  <TouchableOpacity
                    style={
                      styles.avatarCenterButton
                    }
                    onPress={
                      goToAvatarCenter
                    }
                    activeOpacity={
                      0.85
                    }
                  >

                    <Text
                      style={
                        styles.avatarCenterButtonText
                      }
                    >
                      Open Avatar Center
                    </Text>

                  </TouchableOpacity>

                ) : null}

              </View>

            </View>


            {/* =================================================
                PERFORMANCE
            ================================================= */}

            <View
              style={
                styles.sectionHeadingRow
              }
            >

              <View>

                <Text
                  style={
                    styles.goldLabel
                  }
                >
                  WALKING LEGATHON
                </Text>


                <Text
                  style={
                    styles.sectionHeading
                  }
                >
                  Performance
                </Text>

              </View>


              <Text
                style={
                  styles.sectionIcon
                }
              >
                ✦
              </Text>

            </View>


            <View
              style={
                styles.statsGrid
              }
            >

              <Stat
                icon="👟"
                number={
                  formatNumber(
                    lifetimeSteps
                  )
                }
                label="Journey Steps"
              />


              <Stat
                icon="🗺️"
                number={
                  totalMiles.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )
                }
                label="Miles"
              />


              <Stat
                icon="🌍"
                number={
                  formatNumber(
                    journeyCount
                  )
                }
                label="Journeys"
              />


              <Stat
                icon="✅"
                number={
                  formatNumber(
                    completedCount
                  )
                }
                label="Completed"
              />


              <Stat
                icon="🛂"
                number={
                  formatNumber(
                    stampCount
                  )
                }
                label="Stamps"
              />


              <Stat
                icon="🔥"
                number={
                  formatNumber(
                    walkingStreak
                  )
                }
                label="Day Streak"
              />

            </View>


            {/* =================================================
                FAVORITE JOURNEY
            ================================================= */}

            <View
              style={
                styles.sectionCard
              }
            >

              <View
                style={
                  styles.sectionTop
                }
              >

                <View>

                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    JOURNEY IDENTITY
                  </Text>


                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Favorite Journey
                  </Text>

                </View>


                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  🧭
                </Text>

              </View>


              <TouchableOpacity
                style={
                  styles.favoriteCard
                }
                onPress={() => {

                  if (
                    openPassport
                  ) {
                    openPassport(
                      favoriteJourney?.id ||
                      "rome"
                    );
                  }

                }}
                activeOpacity={
                  0.85
                }
              >

                <View
                  style={
                    styles.favoriteIconBox
                  }
                >

                  <Text
                    style={
                      styles.favoriteIcon
                    }
                  >
                    {favoriteJourney?.icon ||
                      "🏛️"}
                  </Text>

                </View>


                <View
                  style={
                    styles.favoriteTextWrap
                  }
                >

                  <Text
                    style={
                      styles.favoriteTitle
                    }
                  >
                    {displayJourneyTitle}
                  </Text>


                  <Text
                    style={
                      styles.favoriteSub
                    }
                  >
                    Legathon Journey •{" "}
                    {Math.round(
                      safeNumber(
                        favoriteJourney?.progress
                      )
                    )}
                    % Complete
                  </Text>

                </View>


                <Text
                  style={
                    styles.chevron
                  }
                >
                  ›
                </Text>

              </TouchableOpacity>

            </View>


            {/* =================================================
                PASSPORT COLLECTION
            ================================================= */}

            <View
              style={
                styles.sectionCard
              }
            >

              <View
                style={
                  styles.sectionTop
                }
              >

                <View>

                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    WORLD COLLECTION
                  </Text>


                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Passport Collection
                  </Text>

                </View>


                <View
                  style={
                    styles.countPill
                  }
                >

                  <Text
                    style={
                      styles.countPillText
                    }
                  >
                    {stampCount}
                  </Text>

                </View>

              </View>


              <View
                style={
                  styles.collectionGrid
                }
              >

                <Collection
                  id="rome"
                  title="Rome"
                  unlocked={
                    passportStamps.includes(
                      "rome"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.rome
                  }
                  openPassport={
                    openPassport
                  }
                />


                <Collection
                  id="wall"
                  title="Great Wall"
                  unlocked={
                    passportStamps.includes(
                      "wall"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.wall
                  }
                  openPassport={
                    openPassport
                  }
                />


                <Collection
                  id="tubman"
                  title="Tubman"
                  unlocked={
                    passportStamps.includes(
                      "tubman"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.tubman
                  }
                  openPassport={
                    openPassport
                  }
                />


                <Collection
                  id="mecca"
                  title="Mecca"
                  unlocked={
                    passportStamps.includes(
                      "mecca"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.mecca
                  }
                  openPassport={
                    openPassport
                  }
                />


                <Collection
                  id="tokyo"
                  title="Tokyo"
                  unlocked={
                    passportStamps.includes(
                      "tokyo"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.tokyo
                  }
                  openPassport={
                    openPassport
                  }
                />

              </View>

            </View>


            {/* =================================================
                ACHIEVEMENT WALL
            ================================================= */}

            <View
              style={
                styles.goldCard
              }
            >

              <Text
                style={
                  styles.goldLabel
                }
              >
                ACHIEVEMENT WALL
              </Text>


              <Text
                style={
                  styles.sectionTitle
                }
              >
                Badges Earned
              </Text>


              <Text
                style={
                  styles.mutedText
                }
              >
                {rewardCount} saved rewards • milestone badges update automatically
              </Text>


              <View
                style={
                  styles.badgeGrid
                }
              >

                <Badge
                  icon="🥇"
                  title="First Route"
                  unlocked={
                    completedCount >= 1
                  }
                />


                <Badge
                  icon="🛡️"
                  title="First Passport"
                  unlocked={
                    stampCount >= 1
                  }
                />


                <Badge
                  icon="🔥"
                  title="Streak Master"
                  unlocked={
                    lifetimeSteps >=
                    100000
                  }
                />


                <Badge
                  icon="🌎"
                  title="World Explorer"
                  unlocked={
                    completedCount >= 10
                  }
                />

              </View>

            </View>


            {/* =================================================
                JOURNEY TIMELINE
            ================================================= */}

            <View
              style={
                styles.sectionCard
              }
            >

              <View
                style={
                  styles.sectionTop
                }
              >

                <View>

                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    LEGACY HISTORY
                  </Text>


                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Journey Timeline
                  </Text>

                </View>


                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  🏁
                </Text>

              </View>


              {completedJourneys.length ===
              0 ? (

                <View
                  style={
                    styles.emptyState
                  }
                >

                  <Text
                    style={
                      styles.emptyStateIcon
                    }
                  >
                    🗺️
                  </Text>


                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    Complete your first journey to begin your legacy timeline.
                  </Text>

                </View>

              ) : (

                completedJourneys.map(
                  (
                    journey,
                    index
                  ) => (

                    <Timeline
                      key={
                        journey?.id ||
                        `${journey?.title}-${index}`
                      }
                      title={
                        journey?.title ||
                        "Legathon Journey"
                      }
                      date={
                        journey?.completed
                          ? "Completed"
                          : `${Math.round(
                              safeNumber(
                                journey?.progress
                              )
                            )}% Complete`
                      }
                      last={
                        index ===
                        completedJourneys.length -
                          1
                      }
                    />

                  )
                )

              )}

            </View>


            {/* =================================================
                LEGATHON RANK
            ================================================= */}

            <View
              style={
                styles.sectionCard
              }
            >

              <View
                style={
                  styles.sectionTop
                }
              >

                <View>

                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    YOUR ASCENT
                  </Text>


                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Legathon Rank
                  </Text>

                </View>


                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  👑
                </Text>

              </View>


              <View
                style={
                  styles.rankList
                }
              >

                {rankOrder.map(
                  (rank) => {

                    const active =
                      rank ===
                      currentRank;


                    return (

                      <View
                        key={
                          rank
                        }
                        style={[
                          styles.rankRow,

                          active &&
                            styles.rankRowActive,
                        ]}
                      >

                        <Text
                          style={[
                            styles.rankDiamond,

                            active &&
                              styles.rankDiamondActive,
                          ]}
                        >
                          {active
                            ? "◆"
                            : "◇"}
                        </Text>


                        <Text
                          style={[
                            styles.rankText,

                            active &&
                              styles.rankTextActive,
                          ]}
                        >
                          {rank}
                        </Text>


                        {active ? (

                          <View
                            style={
                              styles.currentPill
                            }
                          >

                            <Text
                              style={
                                styles.currentPillText
                              }
                            >
                              CURRENT
                            </Text>

                          </View>

                        ) : null}

                      </View>

                    );
                  }
                )}

              </View>

            </View>


            {/* =================================================
                PUBLIC PROFILE
            ================================================= */}

            <View
              style={
                styles.showcaseCard
              }
            >

              <Text
                style={
                  styles.goldLabel
                }
              >
                LEGATHON SHOWCASE
              </Text>


              <Text
                style={
                  styles.showcaseTitle
                }
              >
                Public Profile Highlights
              </Text>


              <Showcase
                label="Avatar"
                value={
                  avatarName
                }
              />


              <Showcase
                label="Outfit"
                value={
                  normalizeSuitName(
                    equippedSuit
                  )
                }
              />


              <Showcase
                label="Favorite Passport"
                value={
                  favoritePassport
                }
              />


              <Showcase
                label="Favorite Badge"
                value={
                  favoriteBadge
                }
              />


              <Showcase
                label="Favorite Journey"
                value={
                  displayJourneyTitle
                }
              />

            </View>


            {/* =================================================
                FOOTER
            ================================================= */}

            <View
              style={
                styles.bottomCard
              }
            >

              <Text
                style={
                  styles.bottomLabel
                }
              >
                LEGATHON WALKER
              </Text>


              <Text
                style={
                  styles.bottomTitle
                }
              >
                Keep Building Your Legacy
              </Text>


              <Text
                style={
                  styles.bottomText
                }
              >
                Every Journey Step, completed route, passport stamp, and achievement adds another chapter to your walking story.
              </Text>

            </View>


            {loading ? (

              <Text
                style={
                  styles.loadingText
                }
              >
                Updating profile…
              </Text>

            ) : null}

          </ScrollView>

        </SafeAreaView>

      </View>

    </ImageBackground>
  );
}


// ============================================================
// STAT
// ============================================================

function Stat({
  icon,
  number,
  label,
}) {

  return (
    <View
      style={
        styles.statBox
      }
    >

      <Text
        style={
          styles.statIcon
        }
      >
        {icon}
      </Text>


      <Text
        style={
          styles.statNumber
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {number}
      </Text>


      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>

    </View>
  );
}


// ============================================================
// COLLECTION
// ============================================================

function Collection({
  id,
  image,
  title,
  unlocked = false,
  openPassport,
}) {

  return (
    <TouchableOpacity
      style={[
        styles.passportCard,

        unlocked &&
          styles.unlockedPassport,
      ]}
      onPress={() => {

        if (
          unlocked &&
          openPassport
        ) {
          openPassport(
            id
          );
        }

      }}
      activeOpacity={
        unlocked
          ? 0.82
          : 1
      }
    >

      <View
        style={
          styles.passportImageWrap
        }
      >

        <Image
          source={
            unlocked
              ? image
              : LOCKED_PASSPORT
          }
          style={
            styles.passportImage
          }
          resizeMode="contain"
        />

      </View>


      <Text
        style={
          styles.passportTitle
        }
      >
        {title}
      </Text>


      <Text
        style={
          unlocked
            ? styles.passportUnlockedText
            : styles.passportLockedText
        }
      >
        {unlocked
          ? "UNLOCKED"
          : "LOCKED"}
      </Text>

    </TouchableOpacity>
  );
}


// ============================================================
// BADGE
// ============================================================

function Badge({
  icon,
  title,
  unlocked = false,
}) {

  return (
    <View
      style={[
        styles.badgeCard,

        unlocked
          ? styles.badgeUnlocked
          : styles.badgeLocked,
      ]}
    >

      <Text
        style={[
          styles.badgeIcon,

          !unlocked &&
            styles.lockedOpacity,
        ]}
      >
        {icon}
      </Text>


      <Text
        style={[
          styles.badgeTitle,

          !unlocked &&
            styles.badgeTitleLocked,
        ]}
      >
        {title}
      </Text>


      <Text
        style={
          unlocked
            ? styles.badgeStateUnlocked
            : styles.badgeStateLocked
        }
      >
        {unlocked
          ? "EARNED"
          : "LOCKED"}
      </Text>

    </View>
  );
}


// ============================================================
// TIMELINE
// ============================================================

function Timeline({
  title,
  date,
  last = false,
}) {

  return (
    <View
      style={
        styles.timelineRow
      }
    >

      <View
        style={
          styles.timelineMarkerWrap
        }
      >

        <View
          style={
            styles.timelineDot
          }
        />


        {!last ? (

          <View
            style={
              styles.timelineLine
            }
          />

        ) : null}

      </View>


      <View
        style={
          styles.timelineTextWrap
        }
      >

        <Text
          style={
            styles.timelineTitle
          }
        >
          {title}
        </Text>


        <Text
          style={
            styles.timelineDate
          }
        >
          {date}
        </Text>

      </View>

    </View>
  );
}


// ============================================================
// SHOWCASE
// ============================================================

function Showcase({
  label,
  value,
}) {

  return (
    <View
      style={
        styles.showcaseRow
      }
    >

      <Text
        style={
          styles.showcaseItemLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.showcaseItemValue
        }
        numberOfLines={
          1
        }
      >
        {value}
      </Text>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    background: {
      flex: 1,
      backgroundColor:
        "#02060D",
    },


    backgroundImage: {
      resizeMode:
        "cover",
      opacity: 0.34,
    },


    overlay: {
      flex: 1,
      backgroundColor:
        "rgba(1,7,16,0.77)",
    },


    safe: {
      flex: 1,
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 170,
    },


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    headerRow: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      marginBottom: 22,
    },


    backButton: {
      width: 48,
      height: 48,

      borderRadius: 24,

      borderWidth: 1,
      borderColor:
        "#DDB535",

      backgroundColor:
        "rgba(7,20,38,0.94)",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 12,
    },


    backText: {
      color:
        "#F1CB49",

      fontSize: 39,
      lineHeight: 42,
    },


    backSpacer: {
      width: 0,
    },


    headerTextWrap: {
      flex: 1,
    },


    eyebrow: {
      color:
        "#9EF0D4",

      fontSize: 13,
      fontWeight:
        "900",

      letterSpacing: 3,
      marginBottom: 7,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize: 36,
      lineHeight: 40,

      fontWeight:
        "900",
    },


    headerSubtitle: {
      color:
        "#A8B5C8",

      fontSize: 15,
      lineHeight: 22,

      fontWeight:
        "700",

      marginTop: 7,
    },


    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------

    heroCard: {
      overflow:
        "hidden",

      borderRadius: 30,

      borderWidth: 2,
      borderColor:
        "#DBB536",

      backgroundColor:
        "#071427",

      marginBottom: 30,

      shadowColor:
        "#E1B739",

      shadowOpacity: 0.22,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: 10,
      },

      elevation: 12,
    },


    heroGlow: {
      position:
        "absolute",

      width: 430,
      height: 430,

      borderRadius: 215,

      backgroundColor:
        "rgba(75,44,170,0.30)",

      top: 72,
      alignSelf:
        "center",
    },


    avatarStage: {
      height: 500,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "rgba(4,15,30,0.40)",

      position:
        "relative",
    },


    avatarImage: {
      width:
        "92%",

      height:
        "92%",
    },


    avatarFallback: {
      fontSize: 110,
    },


    rankPill: {
      position:
        "absolute",

      bottom: 18,

      borderRadius: 24,

      borderWidth: 1.5,
      borderColor:
        "#E3BC38",

      backgroundColor:
        "#07111F",

      paddingVertical: 8,
      paddingHorizontal: 22,
    },


    rankPillText: {
      color:
        "#FFD54A",

      fontSize: 16,
      fontWeight:
        "900",
    },


    heroInfo: {
      alignItems:
        "center",

      paddingHorizontal: 24,
      paddingTop: 27,
      paddingBottom: 30,

      backgroundColor:
        "rgba(8,24,44,0.96)",
    },


    profileLabel: {
      color:
        "#FFD34A",

      fontSize: 13,
      fontWeight:
        "900",

      letterSpacing: 3,

      marginBottom: 8,
    },


    name: {
      color:
        "#FFFFFF",

      fontSize: 40,
      lineHeight: 46,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    avatarIdentity: {
      color:
        "#E7BE3D",

      fontSize: 18,
      fontWeight:
        "900",

      marginTop: 5,
    },


    outfitPill: {
      marginTop: 18,

      borderRadius: 25,

      borderWidth: 1.5,
      borderColor:
        "#55DEA4",

      backgroundColor:
        "#0E3A2B",

      paddingVertical: 9,
      paddingHorizontal: 18,
    },


    outfitPillText: {
      color:
        "#A5F1D5",

      fontSize: 15,
      fontWeight:
        "900",
    },


    legathonScore: {
      color:
        "#FFD54A",

      fontSize: 21,
      lineHeight: 28,

      fontWeight:
        "900",

      marginTop: 24,

      textAlign:
        "center",
    },


    levelBar: {
      width:
        "100%",

      height: 13,

      borderRadius: 10,

      backgroundColor:
        "#25394F",

      overflow:
        "hidden",

      marginTop: 20,
    },


    levelFill: {
      height:
        "100%",

      borderRadius: 10,

      backgroundColor:
        "#E2B932",
    },


    levelText: {
      color:
        "#ADB9CB",

      fontSize: 16,
      fontWeight:
        "800",

      marginTop: 11,
    },


    avatarCenterButton: {
      width:
        "100%",

      marginTop: 22,

      minHeight: 56,

      borderRadius: 28,

      backgroundColor:
        "#E1B736",

      justifyContent:
        "center",

      alignItems:
        "center",
    },


    avatarCenterButtonText: {
      color:
        "#07111F",

      fontSize: 17,
      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // SECTIONS
    // --------------------------------------------------------

    sectionHeadingRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 15,
    },


    sectionHeading: {
      color:
        "#FFFFFF",

      fontSize: 30,
      fontWeight:
        "900",

      marginTop: 2,
    },


    goldLabel: {
      color:
        "#DFB634",

      fontSize: 12,
      fontWeight:
        "900",

      letterSpacing: 3,
    },


    sectionIcon: {
      fontSize: 30,
    },


    sectionCard: {
      borderRadius: 26,

      borderWidth: 1,
      borderColor:
        "#304965",

      backgroundColor:
        "rgba(7,22,42,0.95)",

      padding: 22,

      marginBottom: 24,
    },


    sectionTop: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 20,
    },


    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize: 26,
      lineHeight: 32,

      fontWeight:
        "900",

      marginTop: 5,
    },


    mutedText: {
      color:
        "#9EABBE",

      fontSize: 14,
      lineHeight: 20,

      marginTop: 8,
    },


    // --------------------------------------------------------
    // STATS
    // --------------------------------------------------------

    statsGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginBottom: 22,
    },


    statBox: {
      width:
        "48%",

      minHeight: 150,

      borderRadius: 23,

      borderWidth: 1,
      borderColor:
        "#304B69",

      backgroundColor:
        "rgba(8,25,47,0.96)",

      padding: 17,

      justifyContent:
        "center",

      marginBottom: 14,
    },


    statIcon: {
      fontSize: 24,
      marginBottom: 8,
    },


    statNumber: {
      color:
        "#FFFFFF",

      fontSize: 31,
      fontWeight:
        "900",
    },


    statLabel: {
      color:
        "#AFB9CA",

      fontSize: 14,
      fontWeight:
        "800",

      marginTop: 4,
    },


    // --------------------------------------------------------
    // FAVORITE
    // --------------------------------------------------------

    favoriteCard: {
      minHeight: 108,

      borderRadius: 22,

      backgroundColor:
        "#101D2D",

      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 15,
    },


    favoriteIconBox: {
      width: 66,
      height: 66,

      borderRadius: 18,

      backgroundColor:
        "#15283E",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 14,
    },


    favoriteIcon: {
      fontSize: 34,
    },


    favoriteTextWrap: {
      flex: 1,
    },


    favoriteTitle: {
      color:
        "#FFFFFF",

      fontSize: 20,
      fontWeight:
        "900",
    },


    favoriteSub: {
      color:
        "#AEB8C7",

      fontSize: 14,
      lineHeight: 20,

      fontWeight:
        "700",

      marginTop: 5,
    },


    chevron: {
      color:
        "#D9B337",

      fontSize: 35,
      marginLeft: 8,
    },


    // --------------------------------------------------------
    // COLLECTION
    // --------------------------------------------------------

    countPill: {
      minWidth: 43,
      height: 43,

      borderRadius: 22,

      backgroundColor:
        "#DDB536",

      justifyContent:
        "center",

      alignItems:
        "center",
    },


    countPillText: {
      color:
        "#07111F",

      fontSize: 18,
      fontWeight:
        "900",
    },


    collectionGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    passportCard: {
      width:
        "48%",

      borderRadius: 23,

      borderWidth: 1,
      borderColor:
        "#324D70",

      backgroundColor:
        "#101F35",

      padding: 12,

      alignItems:
        "center",

      marginBottom: 15,
    },


    unlockedPassport: {
      borderWidth: 2,
      borderColor:
        "#DDB536",
    },


    passportImageWrap: {
      width:
        "100%",

      aspectRatio: 0.82,

      justifyContent:
        "center",

      alignItems:
        "center",
    },


    passportImage: {
      width:
        "92%",

      height:
        "92%",
    },


    passportTitle: {
      color:
        "#FFFFFF",

      fontSize: 18,

      fontWeight:
        "900",

      marginTop: 7,

      textAlign:
        "center",
    },


    passportUnlockedText: {
      color:
        "#88E7BA",

      fontSize: 10,
      fontWeight:
        "900",

      letterSpacing: 1.3,

      marginTop: 5,
    },


    passportLockedText: {
      color:
        "#8996AA",

      fontSize: 10,
      fontWeight:
        "900",

      letterSpacing: 1.3,

      marginTop: 5,
    },


    // --------------------------------------------------------
    // BADGES
    // --------------------------------------------------------

    goldCard: {
      borderRadius: 27,

      borderWidth: 1.5,
      borderColor:
        "#DDB536",

      backgroundColor:
        "rgba(24,18,2,0.95)",

      padding: 22,

      marginBottom: 24,
    },


    badgeGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginTop: 20,
    },


    badgeCard: {
      width:
        "48%",

      minHeight: 145,

      borderRadius: 22,

      borderWidth: 1,

      padding: 16,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 14,
    },


    badgeUnlocked: {
      borderColor:
        "#DDB536",

      backgroundColor:
        "#101D2F",
    },


    badgeLocked: {
      borderColor:
        "#354256",

      backgroundColor:
        "#0B1421",
    },


    badgeIcon: {
      fontSize: 36,
      marginBottom: 9,
    },


    lockedOpacity: {
      opacity: 0.35,
    },


    badgeTitle: {
      color:
        "#FFFFFF",

      fontSize: 16,
      fontWeight:
        "900",

      textAlign:
        "center",
    },


    badgeTitleLocked: {
      color:
        "#748197",
    },


    badgeStateUnlocked: {
      color:
        "#8CE8BB",

      fontSize: 9,
      fontWeight:
        "900",

      letterSpacing: 1.5,

      marginTop: 8,
    },


    badgeStateLocked: {
      color:
        "#657286",

      fontSize: 9,
      fontWeight:
        "900",

      letterSpacing: 1.5,

      marginTop: 8,
    },


    // --------------------------------------------------------
    // TIMELINE
    // --------------------------------------------------------

    timelineRow: {
      flexDirection:
        "row",

      minHeight: 88,
    },


    timelineMarkerWrap: {
      width: 34,

      alignItems:
        "center",
    },


    timelineDot: {
      width: 18,
      height: 18,

      borderRadius: 9,

      backgroundColor:
        "#E2B936",

      marginTop: 4,
    },


    timelineLine: {
      width: 2,
      flex: 1,

      backgroundColor:
        "#725F28",

      marginTop: 5,
    },


    timelineTextWrap: {
      flex: 1,
      paddingLeft: 12,
      paddingBottom: 20,
    },


    timelineTitle: {
      color:
        "#FFFFFF",

      fontSize: 19,

      fontWeight:
        "900",
    },


    timelineDate: {
      color:
        "#A7B2C3",

      fontSize: 14,
      fontWeight:
        "700",

      marginTop: 5,
    },


    emptyState: {
      borderRadius: 20,

      backgroundColor:
        "#0D1929",

      padding: 25,

      alignItems:
        "center",
    },


    emptyStateIcon: {
      fontSize: 38,
      marginBottom: 10,
    },


    emptyText: {
      color:
        "#A4B0C1",

      fontSize: 15,
      lineHeight: 22,

      textAlign:
        "center",
    },


    // --------------------------------------------------------
    // RANK
    // --------------------------------------------------------

    rankList: {
      gap: 8,
    },


    rankRow: {
      minHeight: 61,

      borderRadius: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 15,
    },


    rankRowActive: {
      backgroundColor:
        "#202C3E",
    },


    rankDiamond: {
      color:
        "#DDB536",

      fontSize: 23,

      width: 39,
    },


    rankDiamondActive: {
      color:
        "#F1C63B",
    },


    rankText: {
      flex: 1,

      color:
        "#8390A5",

      fontSize: 19,
      fontWeight:
        "900",
    },


    rankTextActive: {
      color:
        "#FFFFFF",
    },


    currentPill: {
      borderRadius: 16,

      backgroundColor:
        "#E2B936",

      paddingHorizontal: 9,
      paddingVertical: 5,
    },


    currentPillText: {
      color:
        "#07111F",

      fontSize: 9,
      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // SHOWCASE
    // --------------------------------------------------------

    showcaseCard: {
      borderRadius: 27,

      borderWidth: 1,
      borderColor:
        "#394E68",

      backgroundColor:
        "rgba(7,23,43,0.97)",

      padding: 22,

      marginBottom: 24,
    },


    showcaseTitle: {
      color:
        "#FFFFFF",

      fontSize: 30,
      lineHeight: 37,

      fontWeight:
        "900",

      marginTop: 6,
      marginBottom: 18,
    },


    showcaseRow: {
      minHeight: 61,

      borderBottomWidth: 1,
      borderBottomColor:
        "#2B3B50",

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap: 14,
    },


    showcaseItemLabel: {
      flex: 1,

      color:
        "#9EABBF",

      fontSize: 14,

      fontWeight:
        "800",
    },


    showcaseItemValue: {
      flex: 1,

      color:
        "#FFFFFF",

      fontSize: 14,
      fontWeight:
        "900",

      textAlign:
        "right",
    },


    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    bottomCard: {
      borderRadius: 27,

      borderWidth: 1,
      borderColor:
        "#DDB536",

      backgroundColor:
        "rgba(12,20,32,0.96)",

      padding: 25,

      marginBottom: 24,
    },


    bottomLabel: {
      color:
        "#9EF0D4",

      fontSize: 11,
      fontWeight:
        "900",

      letterSpacing: 3,
    },


    bottomTitle: {
      color:
        "#FFFFFF",

      fontSize: 28,
      lineHeight: 34,

      fontWeight:
        "900",

      marginTop: 8,
    },


    bottomText: {
      color:
        "#A9B5C5",

      fontSize: 15,
      lineHeight: 23,

      marginTop: 10,
    },


    loadingText: {
      color:
        "#91A0B4",

      textAlign:
        "center",

      marginTop: 6,
    },

  });