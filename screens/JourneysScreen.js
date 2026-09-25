import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import JourneyCard from "./JourneyCard";

import useJourneyProgress, {
  DISPLAY_JOURNEYS,
} from "../hooks/useJourneyProgress";

const COLLAGE_BG = require(
  "../assets/collage-background.png"
);


// ============================================================
// CATEGORIES
// ============================================================
//
// Categories are now built directly from the journey catalog.
//
// This prevents:
// • Empty categories
// • Category naming mismatches
// • Black Legacy returning accidentally
//
// ============================================================

const CATEGORIES = [
  "All",

  ...Array.from(
    new Set(
      DISPLAY_JOURNEYS
        .map(
          (journey) =>
            journey.category
        )
        .filter(Boolean)
    )
  ),
];


const SORTS = [
  "Featured",
  "Progress",
  "Steps",
  "Reward",
];


// ============================================================
// JOURNEYS SCREEN
// ============================================================

export default function JourneysScreen({
  language,

  activeJourney,

  setSelectedJourney,

  setActiveJourney,

  goToJourneyDetail,

  goToGPSJourneyMap,

  goToSubscription,

  goToJourneyStory,

  goBack,

  subscriptionPlan = "free",
}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");


  const [
    sortBy,
    setSortBy,
  ] = useState("Featured");


  const [
    searchText,
    setSearchText,
  ] = useState("");


  const [
    favorites,
    setFavorites,
  ] = useState([]);


  const [
    favoriteError,
    setFavoriteError,
  ] = useState("");


  // ==========================================================
  // JOURNEY PROGRESS
  // ==========================================================

  const display =
    useJourneyProgress(
      activeJourney
    );


  const journeyProgressMap =
    display.progressMap;


  const continueJourney =
    display.activeJourney;


  const continueProgress =
    continueJourney?.progress || 0;


  // ==========================================================
  // MASTER JOURNEY LIST
  // ==========================================================

  const journeys =
    DISPLAY_JOURNEYS;


  const journeysWithRewards =
    useMemo(
      () =>
        journeys.map(
          (item) => {

            const saved =
              display.detailsMap[
                item.id
              ];


            return {
              ...item,

              totalSteps:
                saved?.totalSteps ||
                item.totalSteps,

              steps:
                saved?.totalSteps ||
                item.totalSteps,

              stepsCompleted:
                saved?.steps || 0,

              progress:
                saved?.progress || 0,

              journeyProgress:
                saved?.progress || 0,

              progressPercent:
                saved?.progress || 0,

              completed:
                saved?.completed ||
                false,
            };
          }
        ),

      [
        journeys,
        display.detailsMap,
      ]
    );


  // ==========================================================
  // FAVORITES
  // ==========================================================

  useEffect(() => {

    let mounted =
      true;


    AsyncStorage
      .getItem(
        "favoriteJourneys"
      )
      .then(
        (raw) => {

          const value =
            raw
              ? JSON.parse(raw)
              : [];


          if (
            mounted
          ) {
            setFavorites(
              Array.isArray(value)
                ? value
                : []
            );
          }
        }
      )
      .catch(
        () => {

          if (
            mounted
          ) {
            setFavoriteError(
              "Unable to load favorites."
            );
          }
        }
      );


    return () => {

      mounted =
        false;
    };

  }, []);


  // ==========================================================
  // TOGGLE FAVORITE
  // ==========================================================

  async function toggleFavorite(
    id
  ) {

    const updated =
      favorites.includes(id)
        ? favorites.filter(
            (item) =>
              item !== id
          )
        : [
            ...favorites,
            id,
          ];


    setFavorites(
      updated
    );


    try {

      await AsyncStorage.setItem(
        "favoriteJourneys",

        JSON.stringify(
          updated
        )
      );


      setFavoriteError(
        ""
      );

    } catch {

      setFavoriteError(
        "Unable to save favorites. Please try again."
      );
    }
  }


  // ==========================================================
  // TOTAL JOURNEYS
  // ==========================================================

  const totalJourneys =
    journeysWithRewards.length;


  // ==========================================================
  // FEATURED JOURNEY
  // ==========================================================

  const featuredJourney =
    useMemo(
      () => {

        if (
          journeysWithRewards.length ===
          0
        ) {
          return null;
        }


        const day =
          new Date().getDate();


        return journeysWithRewards[
          day %
            journeysWithRewards.length
        ];
      },

      [
        journeysWithRewards,
      ]
    );


  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredJourneys =
    useMemo(
      () => {

        let data = [
          ...journeysWithRewards,
        ];


        // CATEGORY FILTER

        if (
          activeFilter ===
          "Favorites"
        ) {

          data =
            data.filter(
              (item) =>
                favorites.includes(
                  item.id
                )
            );

        } else if (
          activeFilter ===
          "Premium"
        ) {

          data =
            data.filter(
              (item) =>
                item.premium
            );

        } else if (
          activeFilter !==
          "All"
        ) {

          data =
            data.filter(
              (item) =>
                item.category ===
                activeFilter
            );
        }


        // SEARCH

        if (
          searchText.trim()
        ) {

          const q =
            searchText
              .trim()
              .toLowerCase();


          data =
            data.filter(
              (item) =>
                item.title
                  ?.toLowerCase()
                  .includes(q) ||

                item.subtitle
                  ?.toLowerCase()
                  .includes(q) ||

                item.category
                  ?.toLowerCase()
                  .includes(q) ||

                item.country
                  ?.toLowerCase()
                  .includes(q) ||

                item.location
                  ?.toLowerCase()
                  .includes(q)
            );
        }


        // SORT

        if (
          sortBy ===
          "Progress"
        ) {

          data.sort(
            (a, b) =>
              Number(
                b.progress || 0
              ) -
              Number(
                a.progress || 0
              )
          );
        }


        if (
          sortBy ===
          "Steps"
        ) {

          data.sort(
            (a, b) =>
              Number(
                b.steps || 0
              ) -
              Number(
                a.steps || 0
              )
          );
        }


        if (
          sortBy ===
          "Reward"
        ) {

          data.sort(
            (a, b) =>
              Number(
                b.rewardPoints ||
                  b.reward ||
                  0
              ) -
              Number(
                a.rewardPoints ||
                  a.reward ||
                  0
              )
          );
        }


        return data;
      },

      [
        journeysWithRewards,
        activeFilter,
        searchText,
        sortBy,
        favorites,
      ]
    );


  // ==========================================================
  // POPULAR
  // ==========================================================

  const popularJourneys =
    useMemo(
      () =>
        journeysWithRewards.slice(
          0,
          6
        ),

      [
        journeysWithRewards,
      ]
    );


  // ==========================================================
  // RECENTLY ADDED
  // ==========================================================

  const newJourneys =
    useMemo(
      () =>
        journeysWithRewards
          .slice(-6)
          .reverse(),

      [
        journeysWithRewards,
      ]
    );


  // ==========================================================
  // OPEN DETAIL
  // ==========================================================

  function openDetail(
    journey
  ) {

    setSelectedJourney?.(
      journey
    );


    goToJourneyDetail?.(
      journey
    );
  }


  // ==========================================================
  // START JOURNEY
  // ==========================================================

  function startJourney(
    journey
  ) {

    setActiveJourney?.(
      journey
    );


    goToGPSJourneyMap?.(
      journey
    );
  }


  // ==========================================================
  // OPEN STORY
  // ==========================================================

  function openStory(
    journey
  ) {

    setSelectedJourney?.(
      journey
    );


    goToJourneyStory?.(
      journey
    );
  }


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <ImageBackground
      source={
        COLLAGE_BG
      }
      style={
        styles.bg
      }
      resizeMode="cover"
    >
      <SafeAreaView
        style={
          styles.safe
        }
      >
        <ScrollView
          style={
            styles.container
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* HEADER */}

          <View
            style={
              styles.header
            }
          >
            <Text
              style={
                styles.small
              }
            >
              LEGATHON WALK
            </Text>


            <Text
              style={
                styles.title
              }
            >
              Explore the World
            </Text>


            <Text
              style={
                styles.subtitle
              }
            >
              {totalJourneys} Journeys
              {" • "}
              Walk
              {" • "}
              Learn
              {" • "}
              Discover
            </Text>
          </View>


          {/* SEARCH */}

          <View
            style={
              styles.searchBox
            }
          >
            <Text
              style={
                styles.searchIcon
              }
            >
              🔍
            </Text>


            <TextInput
              value={
                searchText
              }
              onChangeText={
                setSearchText
              }
              placeholder="Search journeys, countries, categories..."
              placeholderTextColor="#8B98AA"
              style={
                styles.searchInput
              }
            />
          </View>


          {/* LOAD ERROR */}

          {(
            !display.ready ||
            display.error ||
            favoriteError
          ) && (
            <Text
              style={
                styles.subtitle
              }
            >
              {
                display.error ||
                favoriteError ||
                "Loading saved progress…"
              }
            </Text>
          )}


          {/* CONTINUE JOURNEY */}

          {continueJourney && (

            <TouchableOpacity
              style={
                styles.continueCard
              }
              onPress={() =>
                startJourney(
                  continueJourney
                )
              }
              activeOpacity={
                0.85
              }
            >
              <Text
                style={
                  styles.sectionMini
                }
              >
                CONTINUE JOURNEY
              </Text>


              <Text
                style={
                  styles.continueTitle
                }
              >
                {
                  continueJourney.title
                }
              </Text>


              <Text
                style={
                  styles.continueSub
                }
              >
                {
                  Number(
                    continueProgress
                  ).toFixed(1)
                }
                % Complete
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
                        `${Math.min(
                          100,

                          Math.max(
                            0,

                            Number(
                              continueProgress
                            ) || 0
                          )
                        )}%`,
                    },
                  ]}
                />
              </View>


              <Text
                style={
                  styles.continueButton
                }
              >
                Continue →
              </Text>
            </TouchableOpacity>
          )}


          {/* FEATURED */}

          {featuredJourney && (

            <View
              style={
                styles.featuredCard
              }
            >
              <Text
                style={
                  styles.sectionMini
                }
              >
                ⭐ FEATURED JOURNEY
              </Text>


              <Text
                style={
                  styles.featuredTitle
                }
              >
                {
                  featuredJourney.title
                }
              </Text>


              <Text
                style={
                  styles.featuredText
                }
              >
                {
                  featuredJourney.subtitle
                }
              </Text>


              <TouchableOpacity
                style={
                  styles.featuredButton
                }
                onPress={() =>
                  openDetail(
                    featuredJourney
                  )
                }
              >
                <Text
                  style={
                    styles.featuredButtonText
                  }
                >
                  Explore Journey
                </Text>
              </TouchableOpacity>
            </View>
          )}


          {/* SORT */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.sortRow
            }
          >
            {SORTS.map(
              (item) => (

                <TouchableOpacity
                  key={
                    item
                  }
                  style={[
                    styles.sortChip,

                    sortBy ===
                      item &&
                      styles.sortActive,
                  ]}
                  onPress={() =>
                    setSortBy(
                      item
                    )
                  }
                >
                  <Text
                    style={[
                      styles.sortText,

                      sortBy ===
                        item &&
                        styles.sortTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>


          {/* CATEGORY FILTERS */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.filterRow
            }
          >
            {CATEGORIES.map(
              (item) => (

                <TouchableOpacity
                  key={
                    item
                  }
                  style={[
                    styles.filterChip,

                    activeFilter ===
                      item &&
                      styles.filterActive,
                  ]}
                  onPress={() =>
                    setActiveFilter(
                      item
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterText,

                      activeFilter ===
                        item &&
                        styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>


          {/* RESULTS */}

          <View
            style={
              styles.resultsBox
            }
          >
            <Text
              style={
                styles.resultsText
              }
            >
              {
                filteredJourneys.length
              }{" "}
              {
                filteredJourneys.length ===
                1
                  ? "journey"
                  : "journeys"
              }{" "}
              found
            </Text>
          </View>


          {/* JOURNEY CARDS */}

          {filteredJourneys.map(
            (journey) => (

              <JourneyCard
                key={
                  journey.id
                }

                item={
                  journey
                }

                savedProgress={
                  journeyProgressMap[
                    String(
                      journey.id
                    )
                  ] ?? 0
                }

                userPlan={
                  subscriptionPlan
                }

                setSelectedJourney={
                  setSelectedJourney
                }

                setActiveJourney={
                  setActiveJourney
                }

                goDetail={() =>
                  openDetail(
                    journey
                  )
                }

                goHome={() =>
                  startJourney(
                    journey
                  )
                }

                goPaywall={() =>
                  goToSubscription?.(
                    journey
                  )
                }

                isFavorite={
                  favorites.includes(
                    journey.id
                  )
                }

                onToggleFavorite={() =>
                  toggleFavorite(
                    journey.id
                  )
                }
              />
            )
          )}


          {/* EMPTY STATE */}

          {
            filteredJourneys.length ===
              0 && (

              <View
                style={
                  styles.emptyBox
                }
              >
                <Text
                  style={
                    styles.emptyIcon
                  }
                >
                  🌍
                </Text>


                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No journeys found
                </Text>


                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Try another search or category.
                </Text>
              </View>
            )
          }


          {/* POPULAR */}

          <Section
            title="🔥 Popular This Week"
            data={
              popularJourneys
            }
          />


          {/* NEW */}

          <Section
            title="🆕 Recently Added"
            data={
              newJourneys
            }
          />


          {/* SUMMARY */}

          <View
            style={
              styles.summaryCard
            }
          >
            <Text
              style={
                styles.summaryTitle
              }
            >
              Journey Summary
            </Text>


            <View
              style={
                styles.summaryGrid
              }
            >
              <Summary
                label="Total"
                value={
                  totalJourneys
                }
              />


              <Summary
                label="Favorites"
                value={
                  favorites.length
                }
              />


              <Summary
                label="Premium"
                value={
                  journeys.filter(
                    (journey) =>
                      journey.premium
                  ).length
                }
              />


              <Summary
                label="Categories"
                value={
                  CATEGORIES.length -
                  1
                }
              />
            </View>
          </View>


          <View
            style={{
              height: 130,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );


  // ==========================================================
  // HORIZONTAL SECTION
  // ==========================================================

  function Section({
    title,
    data,
  }) {

    return (
      <View
        style={
          styles.section
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          {title}
        </Text>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >
          {data.map(
            (item) => (

              <TouchableOpacity
                key={
                  item.id
                }
                style={
                  styles.miniCard
                }
                onPress={() =>
                  openDetail(
                    item
                  )
                }
              >
                <Text
                  style={
                    styles.miniFlag
                  }
                >
                  {
                    item.flag ||
                    "🌍"
                  }
                </Text>


                <Text
                  style={
                    styles.miniTitle
                  }
                >
                  {item.title}
                </Text>


                <Text
                  style={
                    styles.miniSub
                  }
                >
                  {item.category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    );
  }


  // ==========================================================
  // SUMMARY ITEM
  // ==========================================================

  function Summary({
    label,
    value,
  }) {

    return (
      <View
        style={
          styles.summaryBox
        }
      >
        <Text
          style={
            styles.summaryValue
          }
        >
          {value}
        </Text>


        <Text
          style={
            styles.summaryLabel
          }
        >
          {label}
        </Text>
      </View>
    );
  }
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    bg: {
      flex: 1,
    },


    safe: {
      flex: 1,

      backgroundColor:
        "rgba(0,0,0,0.72)",
    },


    container: {
      flex: 1,
    },


    content: {
      padding: 18,

      paddingBottom:
        160,
    },


    header: {
      marginTop:
        10,

      marginBottom:
        18,
    },


    small: {
      color:
        "#FACC15",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        5,

      marginBottom:
        8,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      fontWeight:
        "900",

      lineHeight:
        48,
    },


    subtitle: {
      color:
        "#C9D5E8",

      fontSize:
        16,

      fontWeight:
        "700",

      marginTop:
        8,
    },


    searchBox: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(9,16,31,0.92)",

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "#24364D",

      paddingHorizontal:
        16,

      paddingVertical:
        12,

      marginBottom:
        18,
    },


    searchIcon: {
      fontSize:
        20,

      marginRight:
        10,
    },


    searchInput: {
      flex:
        1,

      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "700",
    },


    continueCard: {
      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        28,

      padding:
        20,

      borderWidth:
        1,

      borderColor:
        "#8EF8D3",

      marginBottom:
        22,
    },


    sectionMini: {
      color:
        "#FACC15",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginBottom:
        8,
    },


    continueTitle: {
      color:
        "#FFFFFF",

      fontSize:
        28,

      fontWeight:
        "900",
    },


    continueSub: {
      color:
        "#8EF8D3",

      fontWeight:
        "900",

      marginTop:
        6,

      marginBottom:
        12,
    },


    continueButton: {
      color:
        "#FACC15",

      fontSize:
        18,

      fontWeight:
        "900",

      marginTop:
        12,
    },


    featuredCard: {
      backgroundColor:
        "rgba(8,14,27,0.94)",

      borderRadius:
        30,

      padding:
        24,

      borderWidth:
        1.5,

      borderColor:
        "#FACC15",

      marginBottom:
        22,
    },


    featuredTitle: {
      color:
        "#FFFFFF",

      fontSize:
        32,

      fontWeight:
        "900",

      marginBottom:
        8,
    },


    featuredText: {
      color:
        "#D6DFEF",

      fontSize:
        16,

      lineHeight:
        24,

      fontWeight:
        "700",

      marginBottom:
        18,
    },


    featuredButton: {
      backgroundColor:
        "#9EFFD0",

      borderRadius:
        22,

      paddingVertical:
        16,

      alignItems:
        "center",
    },


    featuredButtonText: {
      color:
        "#06121F",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    sortRow: {
      marginBottom:
        12,
    },


    sortChip: {
      backgroundColor:
        "rgba(10,18,34,0.95)",

      borderRadius:
        999,

      paddingHorizontal:
        24,

      paddingVertical:
        13,

      marginRight:
        12,

      borderWidth:
        1,

      borderColor:
        "#34506B",
    },


    sortActive: {
      backgroundColor:
        "#FACC15",

      borderColor:
        "#FACC15",
    },


    sortText: {
      color:
        "#C9D5E8",

      fontWeight:
        "900",

      fontSize:
        15,
    },


    sortTextActive: {
      color:
        "#07111E",
    },


    filterRow: {
      marginBottom:
        18,
    },


    filterChip: {
      backgroundColor:
        "rgba(10,18,34,0.95)",

      borderRadius:
        999,

      paddingHorizontal:
        22,

      paddingVertical:
        14,

      marginRight:
        12,

      borderWidth:
        1,

      borderColor:
        "#34506B",
    },


    filterActive: {
      backgroundColor:
        "#9EFFD0",

      borderColor:
        "#9EFFD0",
    },


    filterText: {
      color:
        "#C9D5E8",

      fontWeight:
        "900",

      fontSize:
        15,
    },


    filterTextActive: {
      color:
        "#07111E",
    },


    resultsBox: {
      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        20,

      padding:
        18,

      marginBottom:
        20,
    },


    resultsText: {
      color:
        "#9EFFD0",

      fontSize:
        22,

      fontWeight:
        "900",
    },


    progressTrack: {
      height:
        10,

      backgroundColor:
        "rgba(255,255,255,0.18)",

      borderRadius:
        999,

      overflow:
        "hidden",
    },


    progressFill: {
      height:
        "100%",

      backgroundColor:
        "#FACC15",

      borderRadius:
        999,
    },


    emptyBox: {
      alignItems:
        "center",

      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        26,

      padding:
        30,

      marginBottom:
        24,
    },


    emptyIcon: {
      fontSize:
        44,

      marginBottom:
        12,
    },


    emptyTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",
    },


    emptyText: {
      color:
        "#C9D5E8",

      fontSize:
        15,

      fontWeight:
        "700",

      marginTop:
        8,
    },


    section: {
      marginTop:
        8,

      marginBottom:
        24,
    },


    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        14,
    },


    miniCard: {
      width:
        170,

      minHeight:
        140,

      backgroundColor:
        "rgba(12,23,41,0.94)",

      borderRadius:
        24,

      padding:
        16,

      marginRight:
        14,

      borderWidth:
        1,

      borderColor:
        "#24364D",
    },


    miniFlag: {
      fontSize:
        32,

      marginBottom:
        10,
    },


    miniTitle: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",

      marginBottom:
        6,
    },


    miniSub: {
      color:
        "#9EFFD0",

      fontSize:
        13,

      fontWeight:
        "800",
    },


    summaryCard: {
      backgroundColor:
        "rgba(12,23,41,0.94)",

      borderRadius:
        28,

      padding:
        22,

      borderWidth:
        1,

      borderColor:
        "#24364D",
    },


    summaryTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        16,
    },


    summaryGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap:
        12,
    },


    summaryBox: {
      width:
        "47%",

      backgroundColor:
        "#101B2E",

      borderRadius:
        18,

      padding:
        16,

      borderWidth:
        1,

      borderColor:
        "#263A55",
    },


    summaryValue: {
      color:
        "#FACC15",

      fontSize:
        26,

      fontWeight:
        "900",
    },


    summaryLabel: {
      color:
        "#C9D5E8",

      fontSize:
        13,

      fontWeight:
        "800",

      marginTop:
        4,
    },
  });