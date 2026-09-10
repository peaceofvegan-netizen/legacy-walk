// screens/RewardsScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getWCoins,
} from "../utils/wcoinStorage";
import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import useLegathonPoints from "../hooks/useLegathonPoints";


// ============================================================
// TRACKSUIT MILESTONES
// ============================================================
//
// These are cumulative Journey Lifetime Step totals.
//
// Blue:
//     150,000
//
// Green:
//     +250,000
//     cumulative 400,000
//
// Red:
//     +350,000
//     cumulative 750,000
//
// Yellow:
//     +500,000
//     cumulative 1,250,000
//
// Black & Gold Elite:
//     +3,000,000
//     cumulative 4,250,000
//
// Marathon steps are NOT included.
// ============================================================

const TRACKSUITS = [
  {
    id: "blue",
    level: 1,
    name: "Blue",
    unlockAt: 150000,
    icon: "🔵",
  },

  {
    id: "green",
    level: 2,
    name: "Green",
    unlockAt: 400000,
    icon: "🟢",
  },

  {
    id: "red",
    level: 3,
    name: "Red",
    unlockAt: 750000,
    icon: "🔴",
  },

  {
    id: "yellow",
    level: 4,
    name: "Yellow",
    unlockAt: 1250000,
    icon: "🟡",
  },

  {
    id: "elite",
    level: 5,
    name: "Black & Gold Elite",
    unlockAt: 4250000,
    icon: "👑",
  },
];


// ============================================================
// COLORS
// ============================================================

const COLORS = {
  background: "#020711",

  card: "#081526",
  cardSoft: "#0C1A2C",
  cardDeep: "#06101D",

  gold: "#F4C126",
  goldDark: "#8F6B13",

  white: "#FFFFFF",

  text: "#D7DFEB",
  muted: "#9EABC0",
  mutedDark: "#66758B",

  aqua: "#78F1D0",

  green: "#67E0A7",
  greenDark: "#123B2D",

  border: "#29415F",
};


// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value
) {
  const parsed =
    Number(value ?? 0);

  if (
    !Number.isFinite(parsed)
  ) {
    return 0;
  }

  return Math.max(
    0,
    parsed
  );
}


function formatNumber(
  value
) {
  return Math.floor(
    safeNumber(value)
  ).toLocaleString();
}


function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      safeNumber(value)
    )
  );
}


// ============================================================
// WCOIN BALANCE LOADER
// ============================================================
//
// The project has had more than one WCoin implementation.
//
// This loader safely checks the common storage names so the
// Rewards dashboard can display the same stored wallet amount
// without creating a second WCoin balance.
//
// Once the wallet has one final canonical storage helper,
// this function can be replaced by that helper.
// ============================================================



// ============================================================
// LIFETIME STEP LOADER
// ============================================================
//
// Central engine first.
//
// Then recover old capitalization variants if necessary.
// ============================================================

async function loadRewardLifetimeSteps() {

  try {

    const centralSteps =
      safeNumber(
        await getJourneyLifetimeSteps()
      );


    const [
      lowerRaw,
      upperRaw,
    ] =
      await Promise.all([

        AsyncStorage.getItem(
          "lifetimeSteps"
        ),

        AsyncStorage.getItem(
          "LifetimeSteps"
        ),

      ]);


    const lifetimeSteps =
      Math.max(
        centralSteps,
        safeNumber(
          lowerRaw
        ),
        safeNumber(
          upperRaw
        )
      );


    // Repair old split capitalization so the rest of the app
    // continues seeing the same authoritative value.

    await Promise.all([

      AsyncStorage.setItem(
        "lifetimeSteps",
        String(
          lifetimeSteps
        )
      ),

      AsyncStorage.setItem(
        "LifetimeSteps",
        String(
          lifetimeSteps
        )
      ),

    ]);


    return lifetimeSteps;

  } catch (error) {

    console.log(
      "Rewards lifetime steps error:",
      error
    );

    return 0;
  }
}


// ============================================================
// TRACKSUIT PROGRESSION
// ============================================================

function calculateTracksuitProgress(
  lifetimeSteps
) {

  const steps =
    safeNumber(
      lifetimeSteps
    );


  const unlocked =
    TRACKSUITS.filter(
      (suit) =>
        steps >=
        suit.unlockAt
    );


  const current =
    unlocked.length > 0
      ? unlocked[
          unlocked.length - 1
        ]
      : null;


  const next =
    TRACKSUITS.find(
      (suit) =>
        steps <
        suit.unlockAt
    ) ||
    null;


  const currentStart =
    current?.unlockAt ||
    0;


  const nextTarget =
    next?.unlockAt ||
    currentStart;


  const segmentSize =
    Math.max(
      1,
      nextTarget -
        currentStart
    );


  const segmentProgress =
    next
      ? clamp(
          (
            (
              steps -
              currentStart
            ) /
            segmentSize
          ) *
            100
        )
      : 100;


  return {

    steps,

    current,

    next,

    unlocked,

    currentLevel:
      current?.level ||
      0,

    currentName:
      current?.name ||
      "Standard",

    nextName:
      next?.name ||
      "All Tracksuits Unlocked",

    nextTarget:
      next?.unlockAt ||
      null,

    stepsRemaining:
      next
        ? Math.max(
            0,
            next.unlockAt -
              steps
          )
        : 0,

    progress:
      segmentProgress,

  };
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function RewardsScreen({

  goBack,

  goToAchievements,

  goToWCoins,

  goToLegathonPoints,

}) {

  // ==========================================================
  // LIVE REWARD DATA
  // ==========================================================

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(0);


  const [
    wcoinBalance,
    setWcoinBalance,
  ] =
    useState(0);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  // ==========================================================
  // LEGATHON POINTS
  // ==========================================================

  const {

    points:
      legathonPoints,

    rank:
      legathonRank,

  } =
    useLegathonPoints();


  // ==========================================================
  // TRACKSUIT PROGRESSION
  // ==========================================================

  const progression =
    useMemo(
      () =>
        calculateTracksuitProgress(
          lifetimeSteps
        ),
      [
        lifetimeSteps
      ]
    );


  // ==========================================================
  // LOAD ALL REWARD DATA
  // ==========================================================

  const loadRewards =
    useCallback(
      async (
        showMainLoader = false
      ) => {

        try {

          if (
            showMainLoader
          ) {

            setLoading(
              true
            );

          } else {

            setRefreshing(
              true
            );

          }


         const [
  steps,
  coins,
] = await Promise.all([
  loadRewardLifetimeSteps(),
  getWCoins(),
]);


          setLifetimeSteps(
            steps
          );


          setWcoinBalance(
            coins
          );

        } catch (error) {

          console.log(
            "Rewards load error:",
            error
          );

        } finally {

          setLoading(
            false
          );


          setRefreshing(
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

      loadRewards(
        true
      );

    },
    [
      loadRewards
    ]
  );


  // ==========================================================
  // REFRESH WHEN APP BECOMES ACTIVE
  // ==========================================================

  useEffect(
    () => {

      const subscription =
        AppState.addEventListener(
          "change",
          (
            nextState
          ) => {

            if (
              nextState ===
              "active"
            ) {

              loadRewards(
                false
              );

            }

          }
        );


      return () => {

        subscription?.remove?.();

      };

    },
    [
      loadRewards
    ]
  );


  // ==========================================================
  // RANK VALUES
  // ==========================================================

  const currentRank =
    legathonRank?.currentRank ||
    "New Walker";


  const nextRank =
    legathonRank?.nextRank ||
    "MAX";


  const pointsRemaining =
    safeNumber(
      legathonRank
        ?.pointsRemaining
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View
      style={
        styles.screen
      }
    >

      <SafeAreaView
        style={
          styles.safeArea
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={
              styles.topRow
            }
          >

            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={() => {

                if (
                  typeof goBack ===
                  "function"
                ) {

                  goBack();

                }

              }}
              activeOpacity={
                0.8
              }
            >

              <Text
                style={
                  styles.backText
                }
              >
                ‹ Back
              </Text>

            </TouchableOpacity>


            <View
              style={
                styles.brandPill
              }
            >

              <Text
                style={
                  styles.brandPillText
                }
              >
                LEGATHON
              </Text>

            </View>

          </View>


          <Text
            style={
              styles.pageTitle
            }
          >
            Rewards
          </Text>


          <Text
            style={
              styles.pageSubtitle
            }
          >
            Your walking milestones, earned currency, points and tracksuit progression.
          </Text>


          {/* =================================================
              THREE MAIN REWARD BALANCES
          ================================================= */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            YOUR REWARD DASHBOARD
          </Text>


          <Text
            style={
              styles.sectionTitle
            }
          >
            Your Balances
          </Text>


          <View
            style={
              styles.balanceGrid
            }
          >

            {/* JOURNEY LIFETIME STEPS */}

            <View
              style={[
                styles.balanceCard,
                styles.fullBalanceCard,
              ]}
            >

              <View
                style={
                  styles.balanceIcon
                }
              >
                <Text
                  style={
                    styles.balanceEmoji
                  }
                >
                  👟
                </Text>
              </View>


              <View
                style={
                  styles.balanceTextArea
                }
              >

                <Text
                  style={
                    styles.balanceLabel
                  }
                >
                  JOURNEY LIFETIME STEPS
                </Text>


                <Text
                  style={
                    styles.balanceLarge
                  }
                >
                  {formatNumber(
                    lifetimeSteps
                  )}
                </Text>


                <Text
                  style={
                    styles.balanceSub
                  }
                >
                  Tracksuit progression steps
                </Text>

              </View>

            </View>


            {/* WCOINS */}

            <TouchableOpacity
              style={
                styles.halfBalanceCard
              }
              onPress={() => {

                if (
                  typeof goToWCoins ===
                  "function"
                ) {

                  goToWCoins();

                }

              }}
              activeOpacity={
                0.85
              }
            >

              <Text
                style={
                  styles.currencyEmoji
                }
              >
                🪙
              </Text>


              <Text
                style={
                  styles.smallBalanceLabel
                }
              >
                WCOINS
              </Text>


              <Text
                style={
                  styles.smallBalanceValue
                }
              >
                {formatNumber(
                  wcoinBalance
                )}
              </Text>


              <Text
                style={
                  styles.cardLink
                }
              >
                Open Wallet ›
              </Text>

            </TouchableOpacity>


            {/* LEGATHON POINTS */}

            <TouchableOpacity
              style={
                styles.halfBalanceCard
              }
              onPress={() => {

                if (
                  typeof goToLegathonPoints ===
                  "function"
                ) {

                  goToLegathonPoints();

                }

              }}
              activeOpacity={
                0.85
              }
            >

              <Text
                style={
                  styles.currencyEmoji
                }
              >
                ⭐
              </Text>


              <Text
                style={
                  styles.smallBalanceLabel
                }
              >
                LEGATHON POINTS
              </Text>


              <Text
                style={
                  styles.smallBalanceValue
                }
              >
                {formatNumber(
                  legathonPoints
                )}
              </Text>


              <Text
                style={
                  styles.cardLink
                }
              >
                View Rank ›
              </Text>

            </TouchableOpacity>

          </View>


          {/* =================================================
              LEGATHON RANK
          ================================================= */}

          <View
            style={
              styles.rankCard
            }
          >

            <View>

              <Text
                style={
                  styles.cardEyebrow
                }
              >
                LEGATHON RANK
              </Text>


              <Text
                style={
                  styles.rankName
                }
              >
                {currentRank}
              </Text>

            </View>


            <View
              style={
                styles.rankRight
              }
            >

              <Text
                style={
                  styles.rankNext
                }
              >
                Next: {nextRank}
              </Text>


              {nextRank !==
              "MAX" ? (

                <Text
                  style={
                    styles.rankRemaining
                  }
                >
                  {formatNumber(
                    pointsRemaining
                  )}{" "}
                  points remaining
                </Text>

              ) : (

                <Text
                  style={
                    styles.rankRemaining
                  }
                >
                  Maximum rank reached
                </Text>

              )}

            </View>

          </View>


          {/* =================================================
              TRACKSUIT CURRENT LEVEL
          ================================================= */}

          <View
            style={
              styles.progressCard
            }
          >

            <Text
              style={
                styles.cardEyebrow
              }
            >
              CURRENT TRACKSUIT MILESTONE
            </Text>


            <Text
              style={
                styles.currentSuitName
              }
            >
              {progression.currentName}
            </Text>


            <View
              style={
                styles.levelPill
              }
            >

              <Text
                style={
                  styles.levelPillText
                }
              >
                LEVEL{" "}
                {progression.currentLevel}
                {" / "}
                5
              </Text>

            </View>


            <Text
              style={
                styles.heroSteps
              }
            >
              {formatNumber(
                progression.steps
              )}
            </Text>


            <Text
              style={
                styles.heroStepsLabel
              }
            >
              Journey Lifetime Steps
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
                      `${progression.progress}%`,
                  },
                ]}
              />

            </View>


            {progression.next ? (

              <View
                style={
                  styles.nextSuitBox
                }
              >

                <Text
                  style={
                    styles.nextSuitEyebrow
                  }
                >
                  NEXT TRACKSUIT
                </Text>


                <Text
                  style={
                    styles.nextSuitName
                  }
                >
                  {
                    progression
                      .nextName
                  }
                </Text>


                <Text
                  style={
                    styles.stepsRemaining
                  }
                >
                  {formatNumber(
                    progression
                      .stepsRemaining
                  )}{" "}
                  steps remaining
                </Text>


                <Text
                  style={
                    styles.unlockTarget
                  }
                >
                  Unlocks at{" "}
                  {formatNumber(
                    progression
                      .nextTarget
                  )}{" "}
                  Journey Lifetime Steps
                </Text>

              </View>

            ) : (

              <View
                style={[
                  styles.nextSuitBox,
                  styles.completeBox,
                ]}
              >

                <Text
                  style={
                    styles.completeTitle
                  }
                >
                  👑 ALL TRACKSUITS UNLOCKED
                </Text>


                <Text
                  style={
                    styles.unlockTarget
                  }
                >
                  You reached the complete tracksuit milestone collection.
                </Text>

              </View>

            )}


            <TouchableOpacity
              style={
                styles.refreshButton
              }
              onPress={() =>
                loadRewards(
                  false
                )
              }
              activeOpacity={
                0.85
              }
            >

              {refreshing ? (

                <ActivityIndicator
                  size="small"
                  color={
                    COLORS.background
                  }
                />

              ) : (

                <Text
                  style={
                    styles.refreshButtonText
                  }
                >
                  Refresh Rewards
                </Text>

              )}

            </TouchableOpacity>

          </View>


          {/* =================================================
              TRACKSUIT UNLOCKS
          ================================================= */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            AVATAR REWARDS
          </Text>


          <Text
            style={
              styles.sectionTitle
            }
          >
            Tracksuit Unlocks
          </Text>


          <Text
            style={
              styles.sectionDescription
            }
          >
            Tracksuits unlock from Journey Lifetime Steps. Once a suit is earned, it stays available and you choose which unlocked outfit your avatar wears in Avatar Center.
          </Text>


          <View
            style={
              styles.tracksuitList
            }
          >

            {TRACKSUITS.map(
              (suit) => {

                const unlocked =
                  lifetimeSteps >=
                  suit.unlockAt;


                const next =
                  progression.next
                    ?.id ===
                  suit.id;


                return (

                  <View
                    key={
                      suit.id
                    }
                    style={[
                      styles.tracksuitRow,

                      unlocked &&
                        styles.tracksuitUnlocked,

                      next &&
                        styles.tracksuitNext,
                    ]}
                  >

                    <View
                      style={
                        styles.trackLevelCircle
                      }
                    >

                      <Text
                        style={
                          styles.trackLevelNumber
                        }
                      >
                        {suit.level}
                      </Text>

                    </View>


                    <View
                      style={
                        styles.trackSuitInfo
                      }
                    >

                      <Text
                        style={[
                          styles.trackSuitName,

                          unlocked &&
                            styles.unlockedText,
                        ]}
                      >
                        {suit.name}
                      </Text>


                      <Text
                        style={
                          styles.trackSuitSteps
                        }
                      >
                        {formatNumber(
                          suit.unlockAt
                        )}{" "}
                        Journey Lifetime Steps
                      </Text>

                    </View>


                    <View
                      style={[

                        styles.statusPill,

                        unlocked &&
                          styles.statusUnlocked,

                        next &&
                          styles.statusNext,

                      ]}
                    >

                      <Text
                        style={[

                          styles.statusText,

                          unlocked &&
                            styles.statusUnlockedText,

                          next &&
                            styles.statusNextText,

                        ]}
                      >
                        {
                          unlocked
                            ? "UNLOCKED"
                            : next
                            ? "NEXT"
                            : "LOCKED"
                        }
                      </Text>

                    </View>

                  </View>

                );

              }
            )}

          </View>


          {/* =================================================
              OTHER REWARDS
          ================================================= */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            REWARD CENTER
          </Text>


          <Text
            style={
              styles.sectionTitle
            }
          >
            Explore Rewards
          </Text>


          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {

              if (
                typeof goToAchievements ===
                "function"
              ) {

                goToAchievements();

              }

            }}
            activeOpacity={
              0.85
            }
          >

            <Text
              style={
                styles.navigationEmoji
              }
            >
              🏆
            </Text>


            <View
              style={
                styles.navigationText
              }
            >

              <Text
                style={
                  styles.navigationTitle
                }
              >
                Achievements
              </Text>


              <Text
                style={
                  styles.navigationSub
                }
              >
                View milestones and earned badges
              </Text>

            </View>


            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {

              if (
                typeof goToWCoins ===
                "function"
              ) {

                goToWCoins();

              }

            }}
            activeOpacity={
              0.85
            }
          >

            <Text
              style={
                styles.navigationEmoji
              }
            >
              🪙
            </Text>


            <View
              style={
                styles.navigationText
              }
            >

              <Text
                style={
                  styles.navigationTitle
                }
              >
                WCoin Wallet
              </Text>


              <Text
                style={
                  styles.navigationBalance
                }
              >
                {formatNumber(
                  wcoinBalance
                )}{" "}
                WCoins
              </Text>


              <Text
                style={
                  styles.navigationSub
                }
              >
                Open your wallet and rewards balance
              </Text>

            </View>


            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {

              if (
                typeof goToLegathonPoints ===
                "function"
              ) {

                goToLegathonPoints();

              }

            }}
            activeOpacity={
              0.85
            }
          >

            <Text
              style={
                styles.navigationEmoji
              }
            >
              ⭐
            </Text>


            <View
              style={
                styles.navigationText
              }
            >

              <Text
                style={
                  styles.navigationTitle
                }
              >
                Legathon Points
              </Text>


              <Text
                style={
                  styles.navigationBalance
                }
              >
                {formatNumber(
                  legathonPoints
                )}{" "}
                Points
              </Text>


              <Text
                style={
                  styles.navigationSub
                }
              >
                {currentRank}
              </Text>

            </View>


            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>


          {/* =================================================
              HOW IT WORKS
          ================================================= */}

          <View
            style={
              styles.infoCard
            }
          >

            <Text
              style={
                styles.infoTitle
              }
            >
              How Rewards Work
            </Text>


            <InfoRow
              number="1"
              title="Walk Journeys"
              body="Journey walking adds to your Journey Lifetime Steps. Marathon steps stay separate."
            />


            <InfoRow
              number="2"
              title="Unlock Tracksuits"
              body="Reach each Journey Lifetime Step milestone to permanently unlock that tracksuit."
            />


            <InfoRow
              number="3"
              title="Choose Your Outfit"
              body="Unlocking a new tracksuit does not force you to wear it. Choose any earned tracksuit in Avatar Center."
            />


            <InfoRow
              number="4"
              title="Earn WCoins & Points"
              body="WCoins and Legathon Points are separate reward systems and are shown above with your latest stored totals."
              last
            />

          </View>


          {loading ? (

            <View
              style={
                styles.loadingOverlay
              }
            >

              <ActivityIndicator
                size="large"
                color={
                  COLORS.gold
                }
              />

            </View>

          ) : null}

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}


// ============================================================
// INFO ROW
// ============================================================

function InfoRow({

  number,

  title,

  body,

  last = false,

}) {

  return (
    <View
      style={[
        styles.infoRow,

        last &&
          styles.infoRowLast,
      ]}
    >

      <View
        style={
          styles.infoNumberCircle
        }
      >

        <Text
          style={
            styles.infoNumber
          }
        >
          {number}
        </Text>

      </View>


      <View
        style={
          styles.infoTextArea
        }
      >

        <Text
          style={
            styles.infoRowTitle
          }
        >
          {title}
        </Text>


        <Text
          style={
            styles.infoBody
          }
        >
          {body}
        </Text>

      </View>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    screen: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },


    safeArea: {
      flex: 1,
    },


    scrollContent: {
      paddingHorizontal: 26,

      paddingTop: 18,

      paddingBottom: 180,
    },


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    topRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 44,
    },


    backButton: {
      paddingVertical: 10,
    },


    backText: {
      color:
        COLORS.gold,

      fontSize: 22,

      fontWeight:
        "900",
    },


    brandPill: {
      borderWidth: 1.5,

      borderColor:
        COLORS.gold,

      borderRadius: 28,

      paddingVertical: 11,

      paddingHorizontal: 24,
    },


    brandPillText: {
      color:
        COLORS.gold,

      fontSize: 14,

      fontWeight:
        "900",

      letterSpacing: 3,
    },


    pageTitle: {
      color:
        COLORS.white,

      fontSize: 51,

      lineHeight: 58,

      fontWeight:
        "900",
    },


    pageSubtitle: {
      color:
        COLORS.muted,

      fontSize: 20,

      lineHeight: 29,

      fontWeight:
        "700",

      marginTop: 18,

      marginBottom: 45,
    },


    // --------------------------------------------------------
    // SECTION TITLES
    // --------------------------------------------------------

    sectionEyebrow: {
      color:
        COLORS.gold,

      fontSize: 12,

      fontWeight:
        "900",

      letterSpacing: 3,

      marginBottom: 6,
    },


    sectionTitle: {
      color:
        COLORS.white,

      fontSize: 34,

      lineHeight: 41,

      fontWeight:
        "900",

      marginBottom: 12,
    },


    sectionDescription: {
      color:
        COLORS.muted,

      fontSize: 17,

      lineHeight: 27,

      fontWeight:
        "700",

      marginBottom: 22,
    },


    // --------------------------------------------------------
    // BALANCE GRID
    // --------------------------------------------------------

    balanceGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginBottom: 38,
    },


    balanceCard: {
      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 27,

      backgroundColor:
        COLORS.card,

      padding: 22,
    },


    fullBalanceCard: {
      width:
        "100%",

      minHeight: 155,

      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 14,
    },


    balanceIcon: {
      width: 78,

      height: 78,

      borderRadius: 39,

      backgroundColor:
        COLORS.cardDeep,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 18,
    },


    balanceEmoji: {
      fontSize: 37,
    },


    balanceTextArea: {
      flex: 1,
    },


    balanceLabel: {
      color:
        COLORS.aqua,

      fontSize: 11,

      fontWeight:
        "900",

      letterSpacing: 1.6,
    },


    balanceLarge: {
      color:
        COLORS.white,

      fontSize: 39,

      lineHeight: 45,

      fontWeight:
        "900",

      marginTop: 5,
    },


    balanceSub: {
      color:
        COLORS.muted,

      fontSize: 14,

      fontWeight:
        "700",

      marginTop: 3,
    },


    halfBalanceCard: {
      width:
        "48%",

      minHeight: 190,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 25,

      backgroundColor:
        COLORS.card,

      padding: 19,

      justifyContent:
        "center",
    },


    currencyEmoji: {
      fontSize: 31,

      marginBottom: 11,
    },


    smallBalanceLabel: {
      color:
        COLORS.muted,

      fontSize: 10,

      fontWeight:
        "900",

      letterSpacing: 1.4,
    },


    smallBalanceValue: {
      color:
        COLORS.white,

      fontSize: 29,

      lineHeight: 35,

      fontWeight:
        "900",

      marginTop: 5,
    },


    cardLink: {
      color:
        COLORS.gold,

      fontSize: 13,

      fontWeight:
        "900",

      marginTop: 13,
    },


    // --------------------------------------------------------
    // RANK
    // --------------------------------------------------------

    rankCard: {
      borderWidth: 1,

      borderColor:
        COLORS.goldDark,

      borderRadius: 25,

      backgroundColor:
        COLORS.card,

      padding: 23,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 24,
    },


    cardEyebrow: {
      color:
        COLORS.gold,

      fontSize: 12,

      fontWeight:
        "900",

      letterSpacing: 2,
    },


    rankName: {
      color:
        COLORS.white,

      fontSize: 25,

      fontWeight:
        "900",

      marginTop: 5,
    },


    rankRight: {
      alignItems:
        "flex-end",

      maxWidth:
        "53%",
    },


    rankNext: {
      color:
        COLORS.white,

      fontSize: 14,

      fontWeight:
        "900",
    },


    rankRemaining: {
      color:
        COLORS.muted,

      fontSize: 12,

      fontWeight:
        "700",

      marginTop: 4,

      textAlign:
        "right",
    },


    // --------------------------------------------------------
    // PROGRESSION
    // --------------------------------------------------------

    progressCard: {
      borderWidth: 1.5,

      borderColor:
        COLORS.goldDark,

      borderRadius: 28,

      backgroundColor:
        COLORS.card,

      padding: 25,

      marginBottom: 44,
    },


    currentSuitName: {
      color:
        COLORS.white,

      fontSize: 42,

      lineHeight: 50,

      fontWeight:
        "900",

      marginTop: 11,
    },


    levelPill: {
      alignSelf:
        "flex-start",

      borderWidth: 1,

      borderColor:
        COLORS.goldDark,

      backgroundColor:
        "#252617",

      borderRadius: 22,

      paddingVertical: 9,

      paddingHorizontal: 17,

      marginTop: 15,
    },


    levelPillText: {
      color:
        COLORS.gold,

      fontSize: 13,

      fontWeight:
        "900",

      letterSpacing: 1.5,
    },


    heroSteps: {
      color:
        COLORS.white,

      fontSize: 53,

      lineHeight: 62,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginTop: 36,
    },


    heroStepsLabel: {
      color:
        COLORS.muted,

      fontSize: 18,

      fontWeight:
        "800",

      textAlign:
        "center",
    },


    progressTrack: {
      width:
        "100%",

      height: 14,

      borderRadius: 8,

      backgroundColor:
        "#213248",

      overflow:
        "hidden",

      marginTop: 27,
    },


    progressFill: {
      height:
        "100%",

      backgroundColor:
        COLORS.gold,

      borderRadius: 8,
    },


    nextSuitBox: {
      borderWidth: 1,

      borderColor:
        COLORS.goldDark,

      borderRadius: 22,

      backgroundColor:
        "#171D25",

      padding: 20,

      marginTop: 27,
    },


    nextSuitEyebrow: {
      color:
        COLORS.gold,

      fontSize: 11,

      fontWeight:
        "900",

      letterSpacing: 2,
    },


    nextSuitName: {
      color:
        COLORS.white,

      fontSize: 28,

      fontWeight:
        "900",

      marginTop: 8,
    },


    stepsRemaining: {
      color:
        COLORS.gold,

      fontSize: 21,

      fontWeight:
        "900",

      marginTop: 14,
    },


    unlockTarget: {
      color:
        COLORS.muted,

      fontSize: 15,

      lineHeight: 22,

      fontWeight:
        "700",

      marginTop: 5,
    },


    completeBox: {
      borderColor:
        COLORS.green,

      backgroundColor:
        COLORS.greenDark,
    },


    completeTitle: {
      color:
        COLORS.green,

      fontSize: 18,

      fontWeight:
        "900",
    },


    refreshButton: {
      height: 66,

      borderRadius: 28,

      backgroundColor:
        COLORS.gold,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 27,
    },


    refreshButtonText: {
      color:
        COLORS.background,

      fontSize: 19,

      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // TRACKSUITS
    // --------------------------------------------------------

    tracksuitList: {
      marginBottom: 46,
    },


    tracksuitRow: {
      minHeight: 125,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 24,

      backgroundColor:
        COLORS.card,

      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 18,

      marginBottom: 13,
    },


    tracksuitUnlocked: {
      borderColor:
        COLORS.green,
    },


    tracksuitNext: {
      borderColor:
        COLORS.gold,
    },


    trackLevelCircle: {
      width: 62,

      height: 62,

      borderRadius: 31,

      backgroundColor:
        COLORS.cardDeep,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 15,
    },


    trackLevelNumber: {
      color:
        COLORS.gold,

      fontSize: 28,

      fontWeight:
        "900",
    },


    trackSuitInfo: {
      flex: 1,
    },


    trackSuitName: {
      color:
        "#7F8DA3",

      fontSize: 20,

      fontWeight:
        "900",
    },


    unlockedText: {
      color:
        COLORS.white,
    },


    trackSuitSteps: {
      color:
        COLORS.muted,

      fontSize: 13,

      lineHeight: 19,

      fontWeight:
        "700",

      marginTop: 5,
    },


    statusPill: {
      borderWidth: 1,

      borderColor:
        COLORS.mutedDark,

      borderRadius: 20,

      paddingVertical: 9,

      paddingHorizontal: 12,

      marginLeft: 8,
    },


    statusText: {
      color:
        COLORS.muted,

      fontSize: 10,

      fontWeight:
        "900",

      letterSpacing: 0.7,
    },


    statusUnlocked: {
      borderColor:
        COLORS.green,

      backgroundColor:
        COLORS.greenDark,
    },


    statusUnlockedText: {
      color:
        COLORS.green,
    },


    statusNext: {
      borderColor:
        COLORS.gold,
    },


    statusNextText: {
      color:
        COLORS.gold,
    },


    // --------------------------------------------------------
    // NAVIGATION CARDS
    // --------------------------------------------------------

    navigationCard: {
      minHeight: 132,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 25,

      backgroundColor:
        COLORS.card,

      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 20,

      marginBottom: 14,
    },


    navigationEmoji: {
      fontSize: 34,

      width: 50,
    },


    navigationText: {
      flex: 1,
    },


    navigationTitle: {
      color:
        COLORS.white,

      fontSize: 23,

      fontWeight:
        "900",
    },


    navigationBalance: {
      color:
        COLORS.gold,

      fontSize: 18,

      fontWeight:
        "900",

      marginTop: 5,
    },


    navigationSub: {
      color:
        COLORS.muted,

      fontSize: 14,

      lineHeight: 20,

      fontWeight:
        "700",

      marginTop: 4,
    },


    navigationArrow: {
      color:
        COLORS.gold,

      fontSize: 36,

      marginLeft: 10,
    },


    // --------------------------------------------------------
    // INFO
    // --------------------------------------------------------

    infoCard: {
      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 27,

      backgroundColor:
        COLORS.card,

      padding: 23,

      marginTop: 30,
    },


    infoTitle: {
      color:
        COLORS.white,

      fontSize: 28,

      fontWeight:
        "900",

      marginBottom: 10,
    },


    infoRow: {
      flexDirection:
        "row",

      paddingVertical: 19,

      borderBottomWidth: 1,

      borderBottomColor:
        "#1D3048",
    },


    infoRowLast: {
      borderBottomWidth: 0,
    },


    infoNumberCircle: {
      width: 39,

      height: 39,

      borderRadius: 20,

      backgroundColor:
        "#2A2513",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 14,
    },


    infoNumber: {
      color:
        COLORS.gold,

      fontSize: 17,

      fontWeight:
        "900",
    },


    infoTextArea: {
      flex: 1,
    },


    infoRowTitle: {
      color:
        COLORS.white,

      fontSize: 17,

      fontWeight:
        "900",
    },


    infoBody: {
      color:
        COLORS.muted,

      fontSize: 14,

      lineHeight: 22,

      fontWeight:
        "600",

      marginTop: 5,
    },


    loadingOverlay: {
      position:
        "absolute",

      top: 150,

      left: 0,

      right: 0,

      alignItems:
        "center",
    },

  });