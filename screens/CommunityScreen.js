// ============================================================
// LEGATHON WALK
// screens/CommunityScreen.js
//
// COMMUNITY HUB
//
// LIVE THROUGH SUPABASE:
// • Walking Circles
// • Walking Circle membership totals
// • Join / Leave Circle
// • Top Walking Circles ranking
//
// LOCAL DEVICE STATE:
// • Cheers
// • Sample friend request
// • Challenge participation
// • Event participation
// • Feed reactions
// • Following
// • Activity read state
//
// COMMENTS:
// • Opens CommunityCommentsScreen
//
// AI:
// • Text-only AI Community Coach
// ============================================================

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
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  supabase,
} from "../lib/supabase";


// ============================================================
// ASSETS
// ============================================================

const COMMUNITY_BG = require(
  "../assets/collage-background.png"
);


// ============================================================
// STORAGE
// ============================================================

const COMMUNITY_STATE_KEY =
  "@legathon_community_state";


// ============================================================
// COMMUNITY FEED
//
// These are presentation/sample feed entries for now.
// They are separate from the new live Walking Circle system.
// ============================================================

const COMMUNITY_FEED = [
  {
    id: "feed-1",
    icon: "🏯",
    name: "James Wilson",
    activity: "completed Checkpoint 3",
    journey: "Great Wall of China",
    action: "Celebrate",
    actionIcon: "🎉",
  },

  {
    id: "feed-2",
    icon: "🌿",
    name: "Maria Johnson",
    activity: "walked 14,582 steps",
    journey: "Amazon Rainforest",
    action: "Encourage",
    actionIcon: "👏",
  },

  {
    id: "feed-3",
    icon: "🏅",
    name: "Sarah Thompson",
    activity: "earned a new journey stamp",
    journey: "Selma to Montgomery",
    action: "Support",
    actionIcon: "💪",
  },
];


// ============================================================
// SAMPLE FRIEND DATA
// ============================================================

const FRIENDS_WALKING = [
  {
    id: "james-wilson",
    name: "James Wilson",
    journey: "Amazon Rainforest",
    steps: 8240,
    icon: "🌿",
    isOnline: true,
  },

  {
    id: "maria-johnson",
    name: "Maria Johnson",
    journey: "Great Wall of China",
    steps: 14582,
    icon: "🏯",
    isOnline: true,
  },
];


const FRIEND_REQUEST_PERSON = {
  id: "daniel-brooks",
  name: "Daniel Brooks",
  journey: "Selma to Montgomery",
  steps: 6840,
  icon: "👟",
  isOnline: true,
};


// ============================================================
// ACTIVITY CENTER
// ============================================================

const ACTIVITIES = [
  {
    id: "activity-1",
    icon: "🔥",
    title: "Walking Streak",
    text:
      "Several walkers extended their walking streak today.",
  },

  {
    id: "activity-2",
    icon: "🏆",
    title: "Journey Completed",
    text:
      "A community member completed the Great Wall of China journey.",
  },

  {
    id: "activity-3",
    icon: "🌍",
    title: "Community Growing",
    text:
      "New walkers joined the Legathon community.",
  },
];


// ============================================================
// COMMUNITY CHALLENGES
//
// These remain local program content until their Supabase
// tables are created.
// ============================================================

const CHALLENGES = [
  {
    id: "weekend-challenge",
    icon: "🔥",
    title: "Weekend Challenge",
    description:
      "Walk 50,000 community steps this weekend.",
    progress: 42600,
    target: 50000,
    reward: 500,
  },

  {
    id: "global-walking-weekend",
    icon: "🌍",
    title: "Global Walking Weekend",
    description:
      "Help the community reach 100,000 steps.",
    progress: 31000,
    target: 100000,
    reward: 1000,
  },
];


// ============================================================
// COMMUNITY EVENTS
// ============================================================

const EVENTS = [
  {
    id: "global-event",
    icon: "🌎",
    title: "Global Walking Weekend",
    date: "Community Event",
    description:
      "Walk with Legathon members around the world.",
  },

  {
    id: "autism-event",
    icon: "🧩",
    title: "Autism Awareness Walk",
    date: "Awareness Event",
    description:
      "Walk together in support of autism awareness.",
  },

  {
    id: "heart-event",
    icon: "❤️",
    title: "Heart Health Walk",
    date: "Wellness Event",
    description:
      "Join the community for a heart-healthy walking event.",
  },
];


// ============================================================
// FOLLOW SUGGESTIONS
// ============================================================

const FOLLOW_SUGGESTIONS = [
  {
    id: "maya-runs",
    icon: "🏆",
    name: "MayaRuns",
    subtitle: "Legend Walker",
  },

  {
    id: "history-hunter",
    icon: "🔥",
    name: "HistoryHunter",
    subtitle: "Master Explorer",
  },

  {
    id: "world-explorers",
    icon: "🌍",
    name: "World Explorers",
    subtitle: "Walking Circle",
  },
];


// ============================================================
// HELPERS
// ============================================================

function safeInteger(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number)
  );
}


function CommunityTab({
  label,
  selected,
  onPress,
  badge,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,

        selected &&
          styles.tabButtonSelected,
      ]}
      onPress={
        onPress
      }
      activeOpacity={
        0.85
      }
    >
      <Text
        style={[
          styles.tabButtonText,

          selected &&
            styles.tabButtonTextSelected,
        ]}
      >
        {label}
      </Text>

      {!!badge && (
        <View
          style={
            styles.tabBadge
          }
        >
          <Text
            style={
              styles.tabBadgeText
            }
          >
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}


function SectionTitle({
  icon,
  title,
  subtitle,
}) {
  return (
    <View
      style={
        styles.sectionHeader
      }
    >
      <View
        style={
          styles.sectionTitleRow
        }
      >
        <Text
          style={
            styles.sectionIcon
          }
        >
          {icon}
        </Text>

        <Text
          style={
            styles.sectionTitle
          }
        >
          {title}
        </Text>
      </View>

      {!!subtitle && (
        <Text
          style={
            styles.sectionSubtitle
          }
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}


// ============================================================
// SCREEN
// ============================================================

export default function CommunityScreen({
  navigation,
  goBack,
  goToAICoach,
  goToComments,
}) {

  // ==========================================================
  // TAB
  // ==========================================================

  const [
    selectedTab,
    setSelectedTab,
  ] =
    useState("global");


  // ==========================================================
  // LOCAL COMMUNITY STATE
  // ==========================================================

  const [
    cheeredFriends,
    setCheeredFriends,
  ] =
    useState({});


  const [
    friendRequestStatus,
    setFriendRequestStatus,
  ] =
    useState("pending");


  const [
    acceptedFriends,
    setAcceptedFriends,
  ] =
    useState([]);


  const [
    joinedChallenges,
    setJoinedChallenges,
  ] =
    useState({});


  const [
    joinedEvents,
    setJoinedEvents,
  ] =
    useState({});


  const [
    feedReactions,
    setFeedReactions,
  ] =
    useState({});


  const [
    following,
    setFollowing,
  ] =
    useState({});


  const [
    readActivities,
    setReadActivities,
  ] =
    useState({});


  // ==========================================================
  // LIVE WALKING CIRCLES
  // ==========================================================

  const [
    walkingCircles,
    setWalkingCircles,
  ] =
    useState([]);


  const [
    joinedCircles,
    setJoinedCircles,
  ] =
    useState({});


  const [
    circlesLoading,
    setCirclesLoading,
  ] =
    useState(true);


  const [
    circlesError,
    setCirclesError,
  ] =
    useState("");


  const [
    circleActionId,
    setCircleActionId,
  ] =
    useState(null);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  // ==========================================================
  // LOAD SAVED LOCAL COMMUNITY STATE
  // ==========================================================

  const loadCommunityState =
    useCallback(
      async () => {

        try {

          const saved =
            await AsyncStorage
              .getItem(
                COMMUNITY_STATE_KEY
              );


          if (!saved) {
            return;
          }


          const data =
            JSON.parse(
              saved
            );


          if (
            !data ||
            typeof data !==
              "object"
          ) {
            return;
          }


          setCheeredFriends(
            data.cheeredFriends ||
              {}
          );


          setFriendRequestStatus(
            data.friendRequestStatus ||
              "pending"
          );


          setAcceptedFriends(
            Array.isArray(
              data.acceptedFriends
            )
              ? data.acceptedFriends
              : []
          );


          setJoinedChallenges(
            data.joinedChallenges ||
              {}
          );


          setJoinedEvents(
            data.joinedEvents ||
              {}
          );


          setFeedReactions(
            data.feedReactions ||
              {}
          );


          setFollowing(
            data.following ||
              {}
          );


          setReadActivities(
            data.readActivities ||
              {}
          );

        } catch (error) {

          console.log(
            "COMMUNITY LOAD ERROR:",
            error
          );
        }
      },
      []
    );


  // ==========================================================
  // SAVE LOCAL COMMUNITY STATE
  // ==========================================================

  const persistCommunityState =
    useCallback(
      async (
        overrides = {}
      ) => {

        try {

          const stateToSave = {
            cheeredFriends,
            friendRequestStatus,
            acceptedFriends,
            joinedChallenges,
            joinedEvents,
            feedReactions,
            following,
            readActivities,
            ...overrides,
          };


          await AsyncStorage
            .setItem(
              COMMUNITY_STATE_KEY,

              JSON.stringify(
                stateToSave
              )
            );

        } catch (error) {

          console.log(
            "COMMUNITY SAVE ERROR:",
            error
          );
        }
      },
      [
        cheeredFriends,
        friendRequestStatus,
        acceptedFriends,
        joinedChallenges,
        joinedEvents,
        feedReactions,
        following,
        readActivities,
      ]
    );


  // ==========================================================
  // LOAD WALKING CIRCLES FROM SUPABASE
  // ==========================================================

  const loadWalkingCircles =
    useCallback(
      async ({
        showLoader = true,
      } = {}) => {

        try {

          if (
            showLoader
          ) {
            setCirclesLoading(
              true
            );
          }


          setCirclesError(
            ""
          );


          const {
            data: circleData,
            error: circleError,
          } =
            await supabase
              .from(
                "walking_circles"
              )
              .select(
                [
                  "id",
                  "name",
                  "icon",
                  "base_member_count",
                  "live_member_count",
                  "sort_order",
                  "active",
                ].join(",")
              )
              .eq(
                "active",
                true
              )
              .order(
                "sort_order",
                {
                  ascending: true,
                }
              );


          if (
            circleError
          ) {
            throw circleError;
          }


          const formatted =
            (
              circleData ||
              []
            ).map(
              circle => {

                const baseMembers =
                  safeInteger(
                    circle
                      ?.base_member_count
                  );


                const liveMembers =
                  safeInteger(
                    circle
                      ?.live_member_count
                  );


                return {
                  id:
                    String(
                      circle?.id ||
                      ""
                    ),

                  name:
                    circle?.name ||
                    "Walking Circle",

                  icon:
                    circle?.icon ||
                    "👣",

                  baseMembers,

                  liveMembers,

                  members:
                    baseMembers +
                    liveMembers,
                };
              }
            );


          setWalkingCircles(
            formatted
          );


          // ================================================
          // CURRENT USER
          // ================================================

          const {
            data:
              userData,
            error:
              userError,
          } =
            await supabase
              .auth
              .getUser();


          if (
            userError
          ) {

            console.log(
              "Community user lookup:",
              userError
            );
          }


          const user =
            userData
              ?.user ||
            null;


          if (!user) {

            setJoinedCircles(
              {}
            );

            return;
          }


          // ================================================
          // USER'S LIVE MEMBERSHIPS
          // ================================================

          const {
            data:
              membershipData,
            error:
              membershipError,
          } =
            await supabase
              .from(
                "walking_circle_members"
              )
              .select(
                "circle_id"
              )
              .eq(
                "user_id",
                user.id
              );


          if (
            membershipError
          ) {
            throw membershipError;
          }


          const membershipMap =
            {};


          (
            membershipData ||
            []
          ).forEach(
            membership => {

              if (
                membership
                  ?.circle_id
              ) {

                membershipMap[
                  membership
                    .circle_id
                ] = true;
              }
            }
          );


          setJoinedCircles(
            membershipMap
          );

        } catch (error) {

          console.log(
            "WALKING CIRCLES LOAD ERROR:",
            error
          );


          setCirclesError(
            error?.message ||
              "Unable to load Walking Circles."
          );

        } finally {

          if (
            showLoader
          ) {
            setCirclesLoading(
              false
            );
          }
        }
      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadCommunityState();

      loadWalkingCircles();

    },
    [
      loadCommunityState,
      loadWalkingCircles,
    ]
  );


  // ==========================================================
  // PULL TO REFRESH
  // ==========================================================

  const handleRefresh =
    useCallback(
      async () => {

        setRefreshing(
          true
        );


        try {

          await Promise.all([
            loadCommunityState(),

            loadWalkingCircles({
              showLoader:
                false,
            }),
          ]);

        } finally {

          setRefreshing(
            false
          );
        }
      },
      [
        loadCommunityState,
        loadWalkingCircles,
      ]
    );


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    () => {

      if (
        typeof goBack ===
        "function"
      ) {

        goBack();

        return;
      }


      navigation
        ?.goBack?.();
    };


  // ==========================================================
  // CHEER FRIEND
  // ==========================================================

  const handleCheer =
    async friendId => {

      const updated = {
        ...cheeredFriends,

        [friendId]:
          true,
      };


      setCheeredFriends(
        updated
      );


      await persistCommunityState({
        cheeredFriends:
          updated,
      });
    };


  // ==========================================================
  // FRIEND REQUEST
  // ==========================================================

  const handleAcceptFriend =
    async () => {

      const alreadyExists =
        acceptedFriends
          .some(
            friend =>
              friend.id ===
              FRIEND_REQUEST_PERSON
                .id
          );


      const updatedFriends =
        alreadyExists
          ? acceptedFriends
          : [
              ...acceptedFriends,

              FRIEND_REQUEST_PERSON,
            ];


      setFriendRequestStatus(
        "accepted"
      );


      setAcceptedFriends(
        updatedFriends
      );


      await persistCommunityState({
        friendRequestStatus:
          "accepted",

        acceptedFriends:
          updatedFriends,
      });
    };


  const handleDeclineFriend =
    async () => {

      setFriendRequestStatus(
        "declined"
      );


      await persistCommunityState({
        friendRequestStatus:
          "declined",
      });
    };


  const handleRemoveFriend =
    async friendId => {

      const updatedFriends =
        acceptedFriends
          .filter(
            friend =>
              friend.id !==
              friendId
          );


      setAcceptedFriends(
        updatedFriends
      );


      await persistCommunityState({
        acceptedFriends:
          updatedFriends,
      });
    };


  // ==========================================================
  // COMMUNITY CHALLENGES
  // ==========================================================

  const handleJoinChallenge =
    async challengeId => {

      const updated = {
        ...joinedChallenges,

        [challengeId]:
          !joinedChallenges[
            challengeId
          ],
      };


      setJoinedChallenges(
        updated
      );


      await persistCommunityState({
        joinedChallenges:
          updated,
      });
    };


  // ==========================================================
  // EVENTS
  // ==========================================================

  const handleJoinEvent =
    async eventId => {

      const updated = {
        ...joinedEvents,

        [eventId]:
          !joinedEvents[
            eventId
          ],
      };


      setJoinedEvents(
        updated
      );


      await persistCommunityState({
        joinedEvents:
          updated,
      });
    };


  // ==========================================================
  // FEED REACTION
  // ==========================================================

  const handleFeedReaction =
    async postId => {

      const updated = {
        ...feedReactions,

        [postId]:
          true,
      };


      setFeedReactions(
        updated
      );


      await persistCommunityState({
        feedReactions:
          updated,
      });
    };


  // ==========================================================
  // OPEN COMMENTS
  // ==========================================================

  const handleOpenComments =
    item => {

      const post = {
        ...item,

        text:
          `${item.name} ${item.activity}`,
      };


      if (
        typeof goToComments ===
        "function"
      ) {

        goToComments(
          post
        );

        return;
      }


      navigation
        ?.navigate?.(
          "CommunityComments",
          {
            postId:
              item.id,

            postName:
              item.name,

            postText:
              post.text,

            postJourney:
              item.journey,
          }
        );
    };


  // ==========================================================
  // LIVE WALKING CIRCLE JOIN / LEAVE
  // ==========================================================

  const handleJoinCircle =
    async circleId => {

      if (
        circleActionId
      ) {
        return;
      }


      try {

        setCircleActionId(
          circleId
        );


        const {
          data:
            userData,
          error:
            userError,
        } =
          await supabase
            .auth
            .getUser();


        if (
          userError
        ) {
          throw userError;
        }


        const user =
          userData
            ?.user;


        if (!user) {

          Alert.alert(
            "Sign In Required",
            "Please sign in to join a Walking Circle."
          );

          return;
        }


        const alreadyJoined =
          Boolean(
            joinedCircles[
              circleId
            ]
          );


        // ================================================
        // LEAVE
        // ================================================

        if (
          alreadyJoined
        ) {

          const {
            error,
          } =
            await supabase
              .from(
                "walking_circle_members"
              )
              .delete()
              .eq(
                "circle_id",
                circleId
              )
              .eq(
                "user_id",
                user.id
              );


          if (
            error
          ) {
            throw error;
          }

        } else {

          // ==============================================
          // JOIN
          // ==============================================

          const {
            error,
          } =
            await supabase
              .from(
                "walking_circle_members"
              )
              .insert({
                circle_id:
                  circleId,

                user_id:
                  user.id,
              });


          // If membership already exists,
          // reload instead of counting twice.
          if (
            error &&
            error.code !==
              "23505"
          ) {
            throw error;
          }
        }


        // ================================================
        // RELOAD COUNTS + MEMBERSHIP
        // ================================================

        await loadWalkingCircles({
          showLoader:
            false,
        });

      } catch (error) {

        console.log(
          "WALKING CIRCLE ACTION ERROR:",
          error
        );


        Alert.alert(
          "Unable to Update Circle",
          error?.message ||
            "Please try again."
        );

      } finally {

        setCircleActionId(
          null
        );
      }
    };


  // ==========================================================
  // FOLLOWING
  // ==========================================================

  const handleToggleFollow =
    async id => {

      const updated = {
        ...following,

        [id]:
          !following[id],
      };


      setFollowing(
        updated
      );


      await persistCommunityState({
        following:
          updated,
      });
    };


  // ==========================================================
  // ACTIVITY READ STATE
  // ==========================================================

  const handleActivityRead =
    async activityId => {

      const updated = {
        ...readActivities,

        [activityId]:
          true,
      };


      setReadActivities(
        updated
      );


      await persistCommunityState({
        readActivities:
          updated,
      });
    };


  // ==========================================================
  // TEXT-ONLY AI COMMUNITY COACH
  // ==========================================================

  const handleOpenAICoach =
    () => {

      if (
        typeof goToAICoach ===
        "function"
      ) {

        goToAICoach();

        return;
      }


      if (
        navigation?.navigate
      ) {

        navigation.navigate(
          "AIWellness"
        );

        return;
      }


      Alert.alert(
        "Legathon AI",
        "AI Community Coach navigation is ready to be connected."
      );
    };


  // ==========================================================
  // FRIEND COUNTS
  // ==========================================================

  const allFriends =
    useMemo(
      () => [
        ...FRIENDS_WALKING,

        ...acceptedFriends,
      ],
      [
        acceptedFriends,
      ]
    );


  const totalFriends =
    allFriends.length;


  const onlineFriends =
    allFriends
      .filter(
        friend =>
          friend.isOnline !==
          false
      )
      .length;


  // ==========================================================
  // ACTIVITY COUNTS
  // ==========================================================

  const unreadActivityCount =
    ACTIVITIES
      .filter(
        item =>
          !readActivities[
            item.id
          ]
      )
      .length;


  const pendingFriendRequests =
    friendRequestStatus ===
    "pending"
      ? 1
      : 0;


  // ==========================================================
  // LIVE TOP WALKING CIRCLES
  // ==========================================================

  const topWalkingCircles =
    useMemo(
      () => {

        return [
          ...walkingCircles,
        ]
          .sort(
            (
              a,
              b
            ) =>
              b.members -
              a.members
          )
          .slice(
            0,
            3
          )
          .map(
            (
              circle,
              index
            ) => ({
              ...circle,

              rank:
                index + 1,
            })
          );
      },
      [
        walkingCircles,
      ]
    );


  // ==========================================================
  // FRIENDS TAB
  // ==========================================================

  const renderFriendsTab =
    () => {

      return (
        <>

          <SectionTitle
            icon="👟"
            title="Friends Walking Now"
            subtitle={
              `${onlineFriends} of ${totalFriends} friends online`
            }
          />


          {allFriends.map(
            friend => {

              const isAcceptedFriend =
                acceptedFriends
                  .some(
                    accepted =>
                      accepted.id ===
                      friend.id
                  );


              return (
                <View
                  key={
                    friend.id
                  }
                  style={
                    styles.friendCard
                  }
                >

                  <View
                    style={
                      styles.friendIconWrap
                    }
                  >
                    <Text
                      style={
                        styles.friendIcon
                      }
                    >
                      {friend.icon}
                    </Text>
                  </View>


                  <View
                    style={
                      styles.friendInfo
                    }
                  >

                    <View
                      style={
                        styles.friendNameRow
                      }
                    >
                      <Text
                        style={
                          styles.friendName
                        }
                      >
                        {friend.name}
                      </Text>

                      {friend.isOnline !==
                        false && (
                        <View
                          style={
                            styles.onlineDot
                          }
                        />
                      )}

                    </View>


                    <Text
                      style={
                        styles.friendJourney
                      }
                    >
                      {friend.journey}
                    </Text>


                    <Text
                      style={
                        styles.friendSteps
                      }
                    >
                      {safeInteger(
                        friend.steps
                      ).toLocaleString()}{" "}
                      steps
                    </Text>

                  </View>


                  <View
                    style={
                      styles.friendActions
                    }
                  >

                    <TouchableOpacity
                      style={[
                        styles.cheerButton,

                        cheeredFriends[
                          friend.id
                        ] &&
                          styles.cheerButtonActive,
                      ]}
                      onPress={() =>
                        handleCheer(
                          friend.id
                        )
                      }
                      disabled={
                        Boolean(
                          cheeredFriends[
                            friend.id
                          ]
                        )
                      }
                    >
                      <Text
                        style={
                          styles.cheerButtonText
                        }
                      >
                        {cheeredFriends[
                          friend.id
                        ]
                          ? "✓ Cheered"
                          : "👏 Cheer"}
                      </Text>
                    </TouchableOpacity>


                    {isAcceptedFriend && (
                      <TouchableOpacity
                        style={
                          styles.removeFriendButton
                        }
                        onPress={() =>
                          handleRemoveFriend(
                            friend.id
                          )
                        }
                      >
                        <Text
                          style={
                            styles.removeFriendButtonText
                          }
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    )}

                  </View>

                </View>
              );
            }
          )}


          <SectionTitle
            icon="👥"
            title="Friend Requests"
          />


          <View
            style={
              styles.requestCard
            }
          >

            <View
              style={
                styles.requestTop
              }
            >

              <View
                style={
                  styles.requestIconWrap
                }
              >
                <Text
                  style={
                    styles.requestIcon
                  }
                >
                  👟
                </Text>
              </View>


              <View
                style={
                  styles.requestInfo
                }
              >
                <Text
                  style={
                    styles.requestName
                  }
                >
                  {FRIEND_REQUEST_PERSON.name}
                </Text>

                <Text
                  style={
                    styles.requestText
                  }
                >
                  Wants to walk with you
                </Text>
              </View>

            </View>


            {friendRequestStatus ===
            "pending" ? (

              <View
                style={
                  styles.requestButtonRow
                }
              >

                <TouchableOpacity
                  style={
                    styles.acceptButton
                  }
                  onPress={
                    handleAcceptFriend
                  }
                >
                  <Text
                    style={
                      styles.acceptButtonText
                    }
                  >
                    Accept
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.declineButton
                  }
                  onPress={
                    handleDeclineFriend
                  }
                >
                  <Text
                    style={
                      styles.declineButtonText
                    }
                  >
                    Decline
                  </Text>
                </TouchableOpacity>

              </View>

            ) : (

              <View
                style={
                  styles.requestStatusBox
                }
              >
                <Text
                  style={
                    styles.requestStatusText
                  }
                >
                  {friendRequestStatus ===
                  "accepted"
                    ? "✓ Friend Added"
                    : "Request Declined"}
                </Text>
              </View>

            )}

          </View>

        </>
      );
    };


  // ==========================================================
  // FOLLOWING TAB
  // ==========================================================

  const renderFollowingTab =
    () => {

      return (
        <>

          <SectionTitle
            icon="📡"
            title="Following"
            subtitle=
              "Walkers and circles you follow"
          />


          {FOLLOW_SUGGESTIONS.map(
            item => (

              <View
                key={
                  item.id
                }
                style={
                  styles.followCard
                }
              >

                <View
                  style={
                    styles.followIconWrap
                  }
                >
                  <Text
                    style={
                      styles.followIcon
                    }
                  >
                    {item.icon}
                  </Text>
                </View>


                <View
                  style={
                    styles.followInfo
                  }
                >
                  <Text
                    style={
                      styles.followName
                    }
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={
                      styles.followSubtitle
                    }
                  >
                    {item.subtitle}
                  </Text>
                </View>


                <TouchableOpacity
                  style={[
                    styles.followButton,

                    following[
                      item.id
                    ] &&
                      styles.followButtonActive,
                  ]}
                  onPress={() =>
                    handleToggleFollow(
                      item.id
                    )
                  }
                >
                  <Text
                    style={[
                      styles.followButtonText,

                      following[
                        item.id
                      ] &&
                        styles.followButtonTextActive,
                    ]}
                  >
                    {following[
                      item.id
                    ]
                      ? "✓ Following"
                      : "Follow"}
                  </Text>
                </TouchableOpacity>

              </View>
            )
          )}

        </>
      );
    };


  // ==========================================================
  // GLOBAL TAB
  // ==========================================================

  const renderGlobalTab =
    () => {

      return (
        <>

          {/* =================================================
              ACTIVITY CENTER
          ================================================= */}

          <SectionTitle
            icon="🔔"
            title="Activity Center"
            subtitle={
              unreadActivityCount >
              0
                ? `${unreadActivityCount} unread updates`
                : "You're all caught up"
            }
          />


          {ACTIVITIES.map(
            item => (

              <TouchableOpacity
                key={
                  item.id
                }
                style={[
                  styles.activityCard,

                  readActivities[
                    item.id
                  ] &&
                    styles.activityCardRead,
                ]}
                onPress={() =>
                  handleActivityRead(
                    item.id
                  )
                }
                disabled={
                  Boolean(
                    readActivities[
                      item.id
                    ]
                  )
                }
              >

                <View
                  style={
                    styles.activityIconWrap
                  }
                >
                  <Text
                    style={
                      styles.activityIcon
                    }
                  >
                    {item.icon}
                  </Text>
                </View>


                <View
                  style={
                    styles.activityContent
                  }
                >

                  <Text
                    style={
                      styles.activityTitle
                    }
                  >
                    {item.title}
                  </Text>


                  <Text
                    style={
                      styles.activityText
                    }
                  >
                    {item.text}
                  </Text>


                  <Text
                    style={[
                      styles.activityStatus,

                      readActivities[
                        item.id
                      ] &&
                        styles.activityStatusRead,
                    ]}
                  >
                    {readActivities[
                      item.id
                    ]
                      ? "✓ Read"
                      : "Tap to mark as read"}
                  </Text>

                </View>

              </TouchableOpacity>
            )
          )}


          {/* =================================================
              COMMUNITY FEED
          ================================================= */}

          <SectionTitle
            icon="🌎"
            title="Community Feed"
            subtitle=
              "Celebrate walkers around the world"
          />


          {COMMUNITY_FEED.map(
            item => (

              <View
                key={
                  item.id
                }
                style={
                  styles.feedCard
                }
              >

                <View
                  style={
                    styles.feedTopRow
                  }
                >

                  <View
                    style={
                      styles.feedAvatar
                    }
                  >
                    <Text
                      style={
                        styles.feedAvatarText
                      }
                    >
                      {item.icon}
                    </Text>
                  </View>


                  <View
                    style={
                      styles.feedInfo
                    }
                  >

                    <Text
                      style={
                        styles.feedName
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.feedActivity
                      }
                    >
                      {item.activity}
                    </Text>

                  </View>

                </View>


                <View
                  style={
                    styles.feedJourneyBox
                  }
                >
                  <Text
                    style={
                      styles.feedJourneyLabel
                    }
                  >
                    JOURNEY
                  </Text>

                  <Text
                    style={
                      styles.feedJourneyText
                    }
                  >
                    {item.journey}
                  </Text>
                </View>


                <View
                  style={
                    styles.feedButtonRow
                  }
                >

                  <TouchableOpacity
                    style={[
                      styles.feedActionButton,

                      feedReactions[
                        item.id
                      ] &&
                        styles.feedActionButtonActive,
                    ]}
                    onPress={() =>
                      handleFeedReaction(
                        item.id
                      )
                    }
                    disabled={
                      Boolean(
                        feedReactions[
                          item.id
                        ]
                      )
                    }
                  >
                    <Text
                      style={
                        styles.feedActionText
                      }
                    >
                      {feedReactions[
                        item.id
                      ]
                        ? "✓ Sent"
                        : `${item.actionIcon} ${item.action}`}
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={
                      styles.commentButton
                    }
                    onPress={() =>
                      handleOpenComments(
                        item
                      )
                    }
                  >
                    <Text
                      style={
                        styles.commentButtonText
                      }
                    >
                      💬 Comments
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>
            )
          )}


          {/* =================================================
              LIVE WALKING CIRCLES
          ================================================= */}

          <SectionTitle
            icon="👣"
            title="Walking Circles"
            subtitle=
              "Find your walking community"
          />


          {circlesLoading ? (

            <View
              style={
                styles.loadingCard
              }
            >
              <ActivityIndicator
                size="small"
                color="#80F2CE"
              />

              <Text
                style={
                  styles.loadingText
                }
              >
                Loading Walking Circles...
              </Text>
            </View>

          ) : circlesError ? (

            <View
              style={
                styles.errorCard
              }
            >
              <Text
                style={
                  styles.errorText
                }
              >
                {circlesError}
              </Text>

              <TouchableOpacity
                style={
                  styles.retryButton
                }
                onPress={() =>
                  loadWalkingCircles()
                }
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>

          ) : walkingCircles.length ===
            0 ? (

            <View
              style={
                styles.loadingCard
              }
            >
              <Text
                style={
                  styles.loadingText
                }
              >
                No Walking Circles are available yet.
              </Text>
            </View>

          ) : (

            <View
              style={
                styles.circleGrid
              }
            >

              {walkingCircles.map(
                circle => {

                  const joined =
                    Boolean(
                      joinedCircles[
                        circle.id
                      ]
                    );


                  const updating =
                    circleActionId ===
                    circle.id;


                  return (
                    <TouchableOpacity
                      key={
                        circle.id
                      }
                      style={[
                        styles.circleCard,

                        joined &&
                          styles.circleCardJoined,
                      ]}
                      onPress={() =>
                        handleJoinCircle(
                          circle.id
                        )
                      }
                      disabled={
                        Boolean(
                          circleActionId
                        )
                      }
                      activeOpacity={
                        0.85
                      }
                    >

                      <Text
                        style={
                          styles.circleIcon
                        }
                      >
                        {circle.icon}
                      </Text>


                      <Text
                        style={
                          styles.circleName
                        }
                      >
                        {circle.name}
                      </Text>


                      <Text
                        style={
                          styles.circleMembers
                        }
                      >
                        {circle.members
                          .toLocaleString()}{" "}
                        members
                      </Text>


                      <Text
                        style={[
                          styles.circleJoinText,

                          joined &&
                            styles.circleJoinTextActive,
                        ]}
                      >
                        {updating
                          ? "Updating..."
                          : joined
                            ? "✓ Joined • Tap to Leave"
                            : "Join Circle"}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>
          )}


          {/* =================================================
              LIVE TOP WALKING CIRCLES
          ================================================= */}

          <SectionTitle
            icon="🏆"
            title="Top Walking Circles"
          />


          {topWalkingCircles.map(
            circle => {

              const joined =
                Boolean(
                  joinedCircles[
                    circle.id
                  ]
                );


              const updating =
                circleActionId ===
                circle.id;


              return (
                <View
                  key={
                    circle.id
                  }
                  style={
                    styles.topCircleCard
                  }
                >

                  <View
                    style={
                      styles.topCircleRank
                    }
                  >
                    <Text
                      style={
                        styles.topCircleRankText
                      }
                    >
                      #{circle.rank}
                    </Text>
                  </View>


                  <Text
                    style={
                      styles.topCircleIcon
                    }
                  >
                    {circle.icon}
                  </Text>


                  <View
                    style={
                      styles.topCircleInfo
                    }
                  >
                    <Text
                      style={
                        styles.topCircleName
                      }
                    >
                      {circle.name}
                    </Text>

                    <Text
                      style={
                        styles.topCircleMembers
                      }
                    >
                      {circle.members
                        .toLocaleString()}{" "}
                      members
                    </Text>
                  </View>


                  <TouchableOpacity
                    style={[
                      styles.topCircleButton,

                      joined &&
                        styles.topCircleButtonJoined,
                    ]}
                    onPress={() =>
                      handleJoinCircle(
                        circle.id
                      )
                    }
                    disabled={
                      Boolean(
                        circleActionId
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.topCircleButtonText,

                        joined &&
                          styles.topCircleButtonTextJoined,
                      ]}
                    >
                      {updating
                        ? "..."
                        : joined
                          ? "Joined"
                          : "Join"}
                    </Text>
                  </TouchableOpacity>

                </View>
              );
            }
          )}


          {/* =================================================
              CHALLENGES
          ================================================= */}

          <SectionTitle
            icon="🎯"
            title="Community Challenges"
          />


          {CHALLENGES.map(
            challenge => {

              const percentage =
                Math.min(
                  safeInteger(
                    challenge.progress
                  ) /
                    Math.max(
                      1,
                      safeInteger(
                        challenge.target
                      )
                    ),
                  1
                ) *
                100;


              return (
                <View
                  key={
                    challenge.id
                  }
                  style={
                    styles.challengeCard
                  }
                >

                  <View
                    style={
                      styles.challengeHeader
                    }
                  >

                    <Text
                      style={
                        styles.challengeIcon
                      }
                    >
                      {challenge.icon}
                    </Text>


                    <View
                      style={
                        styles.challengeHeaderInfo
                      }
                    >
                      <Text
                        style={
                          styles.challengeTitle
                        }
                      >
                        {challenge.title}
                      </Text>

                      <Text
                        style={
                          styles.challengeDescription
                        }
                      >
                        {challenge.description}
                      </Text>
                    </View>

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
                            `${percentage}%`,
                        },
                      ]}
                    />
                  </View>


                  <View
                    style={
                      styles.challengeStats
                    }
                  >
                    <Text
                      style={
                        styles.challengeProgressText
                      }
                    >
                      {safeInteger(
                        challenge.progress
                      ).toLocaleString()}{" "}
                      /{" "}
                      {safeInteger(
                        challenge.target
                      ).toLocaleString()}
                    </Text>

                    <Text
                      style={
                        styles.challengeReward
                      }
                    >
                      🪙{" "}
                      {safeInteger(
                        challenge.reward
                      ).toLocaleString()}
                    </Text>
                  </View>


                  <TouchableOpacity
                    style={[
                      styles.aquaButton,

                      joinedChallenges[
                        challenge.id
                      ] &&
                        styles.joinedButton,
                    ]}
                    onPress={() =>
                      handleJoinChallenge(
                        challenge.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.aquaButtonText
                      }
                    >
                      {joinedChallenges[
                        challenge.id
                      ]
                        ? "✓ Joined • Tap to Leave"
                        : "Join Challenge"}
                    </Text>
                  </TouchableOpacity>

                </View>
              );
            }
          )}


          {/* =================================================
              EVENTS
          ================================================= */}

          <SectionTitle
            icon="📅"
            title="Community Events"
          />


          {EVENTS.map(
            event => (

              <View
                key={
                  event.id
                }
                style={
                  styles.eventCard
                }
              >

                <View
                  style={
                    styles.eventIconWrap
                  }
                >
                  <Text
                    style={
                      styles.eventIcon
                    }
                  >
                    {event.icon}
                  </Text>
                </View>


                <View
                  style={
                    styles.eventInfo
                  }
                >

                  <Text
                    style={
                      styles.eventTitle
                    }
                  >
                    {event.title}
                  </Text>


                  <Text
                    style={
                      styles.eventDate
                    }
                  >
                    {event.date}
                  </Text>


                  <Text
                    style={
                      styles.eventDescription
                    }
                  >
                    {event.description}
                  </Text>


                  <TouchableOpacity
                    style={[
                      styles.goldButton,

                      joinedEvents[
                        event.id
                      ] &&
                        styles.joinedEventButton,
                    ]}
                    onPress={() =>
                      handleJoinEvent(
                        event.id
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.goldButtonText,

                        joinedEvents[
                          event.id
                        ] &&
                          styles.joinedEventButtonText,
                      ]}
                    >
                      {joinedEvents[
                        event.id
                      ]
                        ? "✓ Joined • Tap to Leave"
                        : "Join Event"}
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>
            )
          )}


          {/* =================================================
              TEXT-ONLY AI COMMUNITY COACH
          ================================================= */}

          <SectionTitle
            icon="🧠"
            title="Legathon AI Community Coach"
          />


          <View
            style={
              styles.aiCard
            }
          >

            <View
              style={
                styles.aiIconWrap
              }
            >
              <Text
                style={
                  styles.aiIcon
                }
              >
                ✨
              </Text>
            </View>


            <Text
              style={
                styles.aiTitle
              }
            >
              Walk Smarter Together
            </Text>


            <Text
              style={
                styles.aiText
              }
            >
              Get encouragement,
              community insights,
              walking motivation,
              and personalized
              text guidance from
              Legathon AI.
            </Text>


            <TouchableOpacity
              style={
                styles.aiCoachButton
              }
              onPress={
                handleOpenAICoach
              }
            >
              <Text
                style={
                  styles.aiCoachButtonText
                }
              >
                Open AI Community Coach
              </Text>
            </TouchableOpacity>

          </View>

        </>
      );
    };


  // ==========================================================
  // TAB ROUTER
  // ==========================================================

  const renderTabContent =
    () => {

      if (
        selectedTab ===
        "friends"
      ) {
        return (
          renderFriendsTab()
        );
      }


      if (
        selectedTab ===
        "following"
      ) {
        return (
          renderFollowingTab()
        );
      }


      return (
        renderGlobalTab()
      );
    };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <ImageBackground
        source={
          COMMUNITY_BG
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
            styles.backgroundOverlay
          }
        />


        <ScrollView
          style={
            styles.scrollView
          }
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor=
                "#80F2CE"
            />
          }
        >

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              handleBack
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              ‹ Back
            </Text>
          </TouchableOpacity>


          <Text
            style={
              styles.brandText
            }
          >
            LEGATHON WALK
          </Text>


          <Text
            style={
              styles.mainTitle
            }
          >
            Legathon Community
          </Text>


          <Text
            style={
              styles.mainSubtitle
            }
          >
            Walk • Encourage • Grow Together
          </Text>


          <View
            style={
              styles.onlineCard
            }
          >

            <View>

              <Text
                style={
                  styles.onlineLabel
                }
              >
                WALKERS ONLINE
              </Text>


              <Text
                style={
                  styles.onlineCount
                }
              >
                {onlineFriends
                  .toLocaleString()}
              </Text>

            </View>


            <View
              style={
                styles.onlineRight
              }
            >

              <View
                style={
                  styles.largeOnlineDot
                }
              />

              <Text
                style={
                  styles.onlineStatus
                }
              >
                Friends online
              </Text>

            </View>

          </View>


          <View
            style={
              styles.tabRow
            }
          >

            <CommunityTab
              label="GLOBAL"
              selected={
                selectedTab ===
                "global"
              }
              onPress={() =>
                setSelectedTab(
                  "global"
                )
              }
              badge={
                unreadActivityCount >
                0
                  ? unreadActivityCount
                  : null
              }
            />


            <CommunityTab
              label="FRIENDS"
              selected={
                selectedTab ===
                "friends"
              }
              onPress={() =>
                setSelectedTab(
                  "friends"
                )
              }
              badge={
                pendingFriendRequests ||
                null
              }
            />


            <CommunityTab
              label="FOLLOWING"
              selected={
                selectedTab ===
                "following"
              }
              onPress={() =>
                setSelectedTab(
                  "following"
                )
              }
            />

          </View>


          {renderTabContent()}

        </ScrollView>

      </ImageBackground>

    </SafeAreaView>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
      backgroundColor:
        "#020813",
    },


    background: {
      flex: 1,
      backgroundColor:
        "#020813",
    },


    backgroundImage: {
      opacity: 0.23,
    },


    backgroundOverlay: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(2, 8, 19, 0.78)",
    },


    scrollView: {
      flex: 1,
    },


    scrollContent: {
      paddingHorizontal:
        18,

      paddingTop:
        8,

      paddingBottom:
        150,
    },


    backButton: {
      alignSelf:
        "flex-start",

      paddingVertical:
        8,

      paddingRight:
        18,

      marginBottom:
        6,
    },


    backButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "800",
    },


    brandText: {
      color:
        "#FFD343",

      fontSize:
        14,

      fontWeight:
        "900",

      letterSpacing:
        2.2,

      marginTop:
        6,
    },


    mainTitle: {
      color:
        "#FFFFFF",

      fontSize:
        38,

      lineHeight:
        43,

      fontWeight:
        "900",

      marginTop:
        8,
    },


    mainSubtitle: {
      color:
        "#AFC0D9",

      fontSize:
        16,

      fontWeight:
        "700",

      marginTop:
        8,

      marginBottom:
        22,
    },


    onlineCard: {
      backgroundColor:
        "rgba(15, 29, 49, 0.96)",

      borderWidth:
        1,

      borderColor:
        "#243856",

      borderRadius:
        24,

      padding:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom:
        20,
    },


    onlineLabel: {
      color:
        "#8FA5C2",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        1.5,
    },


    onlineCount: {
      color:
        "#80F2CE",

      fontSize:
        34,

      fontWeight:
        "900",

      marginTop:
        3,
    },


    onlineRight: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    largeOnlineDot: {
      width:
        12,

      height:
        12,

      borderRadius:
        6,

      backgroundColor:
        "#80F2CE",

      marginRight:
        8,
    },


    onlineStatus: {
      color:
        "#DDE7F5",

      fontSize:
        13,

      fontWeight:
        "800",
    },


    tabRow: {
      flexDirection:
        "row",

      backgroundColor:
        "rgba(10, 22, 38, 0.96)",

      borderRadius:
        20,

      padding:
        5,

      marginBottom:
        24,
    },


    tabButton: {
      flex:
        1,

      minHeight:
        46,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",

      flexDirection:
        "row",

      paddingHorizontal:
        4,
    },


    tabButtonSelected: {
      backgroundColor:
        "#FFD343",
    },


    tabButtonText: {
      color:
        "#91A3BC",

      fontSize:
        11,

      fontWeight:
        "900",

      letterSpacing:
        0.5,
    },


    tabButtonTextSelected: {
      color:
        "#08111D",
    },


    tabBadge: {
      minWidth:
        18,

      height:
        18,

      borderRadius:
        9,

      backgroundColor:
        "#EF5B5B",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginLeft:
        5,

      paddingHorizontal:
        4,
    },


    tabBadgeText: {
      color:
        "#FFFFFF",

      fontSize:
        10,

      fontWeight:
        "900",
    },


    sectionHeader: {
      marginTop:
        7,

      marginBottom:
        13,
    },


    sectionTitleRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    sectionIcon: {
      fontSize:
        23,

      marginRight:
        9,
    },


    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        23,

      fontWeight:
        "900",
    },


    sectionSubtitle: {
      color:
        "#8FA2BD",

      fontSize:
        13,

      fontWeight:
        "700",

      marginTop:
        5,

      marginLeft:
        34,
    },


    friendCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        16,

      marginBottom:
        12,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    friendIconWrap: {
      width:
        52,

      height:
        52,

      borderRadius:
        26,

      backgroundColor:
        "#1B2A42",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        12,
    },


    friendIcon: {
      fontSize:
        25,
    },


    friendInfo: {
      flex:
        1,
    },


    friendNameRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    friendName: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    onlineDot: {
      width:
        8,

      height:
        8,

      borderRadius:
        4,

      backgroundColor:
        "#80F2CE",

      marginLeft:
        7,
    },


    friendJourney: {
      color:
        "#AFC0D9",

      fontSize:
        13,

      fontWeight:
        "700",

      marginTop:
        4,
    },


    friendSteps: {
      color:
        "#FFD343",

      fontSize:
        12,

      fontWeight:
        "800",

      marginTop:
        3,
    },


    friendActions: {
      alignItems:
        "center",

      marginLeft:
        8,
    },


    cheerButton: {
      backgroundColor:
        "#182C45",

      borderWidth:
        1,

      borderColor:
        "#35516F",

      borderRadius:
        14,

      paddingHorizontal:
        12,

      paddingVertical:
        10,
    },


    cheerButtonActive: {
      backgroundColor:
        "#1F5C4E",

      borderColor:
        "#80F2CE",
    },


    cheerButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    removeFriendButton: {
      marginTop:
        7,

      paddingVertical:
        5,

      paddingHorizontal:
        8,
    },


    removeFriendButtonText: {
      color:
        "#9AA9BF",

      fontSize:
        11,

      fontWeight:
        "800",
    },


    requestCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        18,

      marginBottom:
        22,
    },


    requestTop: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    requestIconWrap: {
      width:
        54,

      height:
        54,

      borderRadius:
        27,

      backgroundColor:
        "#1D2C44",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        13,
    },


    requestIcon: {
      fontSize:
        27,
    },


    requestInfo: {
      flex:
        1,
    },


    requestName: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "900",
    },


    requestText: {
      color:
        "#AFC0D9",

      fontSize:
        13,

      fontWeight:
        "700",

      marginTop:
        4,
    },


    requestButtonRow: {
      flexDirection:
        "row",

      marginTop:
        18,
    },


    acceptButton: {
      flex:
        1,

      backgroundColor:
        "#80F2CE",

      borderRadius:
        16,

      paddingVertical:
        13,

      alignItems:
        "center",

      marginRight:
        6,
    },


    acceptButtonText: {
      color:
        "#06101D",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    declineButton: {
      flex:
        1,

      backgroundColor:
        "#1D2B40",

      borderRadius:
        16,

      paddingVertical:
        13,

      alignItems:
        "center",

      marginLeft:
        6,
    },


    declineButtonText: {
      color:
        "#DCE5F2",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    requestStatusBox: {
      marginTop:
        18,

      backgroundColor:
        "#172946",

      borderRadius:
        18,

      paddingVertical:
        15,

      alignItems:
        "center",
    },


    requestStatusText: {
      color:
        "#80F2CE",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    followCard: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        16,

      marginBottom:
        12,
    },


    followIconWrap: {
      width:
        52,

      height:
        52,

      borderRadius:
        26,

      backgroundColor:
        "#1D2C44",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        13,
    },


    followIcon: {
      fontSize:
        25,
    },


    followInfo: {
      flex:
        1,
    },


    followName: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    followSubtitle: {
      color:
        "#AEBBD2",

      fontSize:
        13,

      fontWeight:
        "700",

      marginTop:
        4,
    },


    followButton: {
      borderWidth:
        1.5,

      borderColor:
        "#80F2CE",

      borderRadius:
        15,

      paddingHorizontal:
        12,

      paddingVertical:
        9,
    },


    followButtonActive: {
      backgroundColor:
        "#1F5C4E",
    },


    followButtonText: {
      color:
        "#80F2CE",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    followButtonTextActive: {
      color:
        "#FFFFFF",
    },


    activityCard: {
      flexDirection:
        "row",

      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderWidth:
        1,

      borderColor:
        "#263B58",

      borderRadius:
        20,

      padding:
        15,

      marginBottom:
        11,
    },


    activityCardRead: {
      opacity:
        0.6,

      borderColor:
        "#26364D",
    },


    activityIconWrap: {
      width:
        44,

      height:
        44,

      borderRadius:
        22,

      backgroundColor:
        "#1E304B",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        12,
    },


    activityIcon: {
      fontSize:
        22,
    },


    activityContent: {
      flex:
        1,
    },


    activityTitle: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "900",
    },


    activityText: {
      color:
        "#AFC0D9",

      fontSize:
        13,

      lineHeight:
        18,

      fontWeight:
        "600",

      marginTop:
        3,
    },


    activityStatus: {
      color:
        "#FFD343",

      fontSize:
        11,

      fontWeight:
        "800",

      marginTop:
        7,
    },


    activityStatusRead: {
      color:
        "#80F2CE",
    },


    feedCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        17,

      marginBottom:
        13,
    },


    feedTopRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    feedAvatar: {
      width:
        48,

      height:
        48,

      borderRadius:
        24,

      backgroundColor:
        "#1C2B42",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        12,
    },


    feedAvatarText: {
      fontSize:
        24,
    },


    feedInfo: {
      flex:
        1,
    },


    feedName: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    feedActivity: {
      color:
        "#AFBED2",

      fontSize:
        13,

      fontWeight:
        "600",

      marginTop:
        4,
    },


    feedJourneyBox: {
      backgroundColor:
        "#0D1727",

      borderRadius:
        14,

      padding:
        12,

      marginTop:
        14,
    },


    feedJourneyLabel: {
      color:
        "#8194AE",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        1.2,
    },


    feedJourneyText: {
      color:
        "#FFD343",

      fontSize:
        14,

      fontWeight:
        "900",

      marginTop:
        3,
    },


    feedButtonRow: {
      flexDirection:
        "row",

      marginTop:
        13,
    },


    feedActionButton: {
      flex:
        1,

      borderWidth:
        1,

      borderColor:
        "#36506E",

      borderRadius:
        15,

      paddingVertical:
        11,

      alignItems:
        "center",

      marginRight:
        5,
    },


    feedActionButtonActive: {
      backgroundColor:
        "#1F5C4E",

      borderColor:
        "#80F2CE",
    },


    feedActionText: {
      color:
        "#FFFFFF",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    commentButton: {
      flex:
        1,

      borderWidth:
        1,

      borderColor:
        "#FFD343",

      borderRadius:
        15,

      paddingVertical:
        11,

      alignItems:
        "center",

      marginLeft:
        5,
    },


    commentButtonText: {
      color:
        "#FFD343",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    loadingCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        20,

      padding:
        20,

      marginBottom:
        18,

      alignItems:
        "center",
    },


    loadingText: {
      color:
        "#AFC0D9",

      fontSize:
        13,

      fontWeight:
        "800",

      marginTop:
        8,

      textAlign:
        "center",
    },


    errorCard: {
      backgroundColor:
        "rgba(70, 23, 30, 0.94)",

      borderWidth:
        1,

      borderColor:
        "#EF5B5B",

      borderRadius:
        20,

      padding:
        18,

      marginBottom:
        18,
    },


    errorText: {
      color:
        "#FFFFFF",

      fontSize:
        13,

      fontWeight:
        "700",

      lineHeight:
        19,
    },


    retryButton: {
      alignSelf:
        "flex-start",

      backgroundColor:
        "#FFD343",

      borderRadius:
        14,

      paddingHorizontal:
        18,

      paddingVertical:
        10,

      marginTop:
        12,
    },


    retryButtonText: {
      color:
        "#07111E",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    circleGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    circleCard: {
      width:
        "48.5%",

      minHeight:
        178,

      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderWidth:
        1,

      borderColor:
        "#263B58",

      borderRadius:
        21,

      padding:
        15,

      marginBottom:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    circleCardJoined: {
      borderWidth:
        2,

      borderColor:
        "#80F2CE",

      backgroundColor:
        "#102A2B",
    },


    circleIcon: {
      fontSize:
        34,

      marginBottom:
        9,
    },


    circleName: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    circleMembers: {
      color:
        "#91A4BD",

      fontSize:
        11,

      fontWeight:
        "700",

      marginTop:
        6,

      textAlign:
        "center",
    },


    circleJoinText: {
      color:
        "#FFD343",

      fontSize:
        11,

      fontWeight:
        "900",

      marginTop:
        12,

      textAlign:
        "center",
    },


    circleJoinTextActive: {
      color:
        "#80F2CE",
    },


    topCircleCard: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        19,

      padding:
        14,

      marginBottom:
        10,
    },


    topCircleRank: {
      width:
        36,
    },


    topCircleRankText: {
      color:
        "#FFD343",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    topCircleIcon: {
      fontSize:
        25,

      marginRight:
        10,
    },


    topCircleInfo: {
      flex:
        1,
    },


    topCircleName: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    topCircleMembers: {
      color:
        "#91A4BD",

      fontSize:
        11,

      fontWeight:
        "700",

      marginTop:
        3,
    },


    topCircleButton: {
      backgroundColor:
        "#FFD343",

      borderRadius:
        13,

      paddingHorizontal:
        12,

      paddingVertical:
        9,

      minWidth:
        64,

      alignItems:
        "center",
    },


    topCircleButtonJoined: {
      backgroundColor:
        "#1F5C4E",
    },


    topCircleButtonText: {
      color:
        "#07111E",

      fontSize:
        11,

      fontWeight:
        "900",
    },


    topCircleButtonTextJoined: {
      color:
        "#FFFFFF",
    },


    challengeCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        17,

      marginBottom:
        13,
    },


    challengeHeader: {
      flexDirection:
        "row",
    },


    challengeIcon: {
      fontSize:
        31,

      marginRight:
        12,
    },


    challengeHeaderInfo: {
      flex:
        1,
    },


    challengeTitle: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "900",
    },


    challengeDescription: {
      color:
        "#AFC0D9",

      fontSize:
        13,

      lineHeight:
        18,

      fontWeight:
        "600",

      marginTop:
        4,
    },


    progressTrack: {
      height:
        10,

      backgroundColor:
        "#26354A",

      borderRadius:
        10,

      overflow:
        "hidden",

      marginTop:
        17,
    },


    progressFill: {
      height:
        "100%",

      backgroundColor:
        "#80F2CE",

      borderRadius:
        10,
    },


    challengeStats: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginTop:
        8,
    },


    challengeProgressText: {
      color:
        "#B9C6D9",

      fontSize:
        11,

      fontWeight:
        "800",
    },


    challengeReward: {
      color:
        "#FFD343",

      fontSize:
        12,

      fontWeight:
        "900",
    },


    aquaButton: {
      backgroundColor:
        "#80F2CE",

      borderRadius:
        16,

      paddingVertical:
        13,

      alignItems:
        "center",

      marginTop:
        15,
    },


    aquaButtonText: {
      color:
        "#06101D",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    joinedButton: {
      backgroundColor:
        "#66CDB1",
    },


    eventCard: {
      flexDirection:
        "row",

      backgroundColor:
        "rgba(16, 29, 49, 0.97)",

      borderRadius:
        22,

      padding:
        16,

      marginBottom:
        13,
    },


    eventIconWrap: {
      width:
        52,

      height:
        52,

      borderRadius:
        26,

      backgroundColor:
        "#1E2F48",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        13,
    },


    eventIcon: {
      fontSize:
        27,
    },


    eventInfo: {
      flex:
        1,
    },


    eventTitle: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    eventDate: {
      color:
        "#FFD343",

      fontSize:
        11,

      fontWeight:
        "900",

      marginTop:
        4,
    },


    eventDescription: {
      color:
        "#AFC0D9",

      fontSize:
        12,

      lineHeight:
        17,

      fontWeight:
        "600",

      marginTop:
        6,
    },


    goldButton: {
      backgroundColor:
        "#FFD343",

      borderRadius:
        15,

      paddingVertical:
        11,

      alignItems:
        "center",

      marginTop:
        13,
    },


    goldButtonText: {
      color:
        "#07111E",

      fontSize:
        13,

      fontWeight:
        "900",
    },


    joinedEventButton: {
      backgroundColor:
        "#1F5C4E",
    },


    joinedEventButtonText: {
      color:
        "#FFFFFF",
    },


    aiCard: {
      backgroundColor:
        "rgba(16, 29, 49, 0.98)",

      borderWidth:
        1,

      borderColor:
        "#3A5C68",

      borderRadius:
        25,

      padding:
        22,

      alignItems:
        "center",

      marginBottom:
        10,
    },


    aiIconWrap: {
      width:
        66,

      height:
        66,

      borderRadius:
        33,

      backgroundColor:
        "#173844",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        13,
    },


    aiIcon: {
      fontSize:
        32,
    },


    aiTitle: {
      color:
        "#FFFFFF",

      fontSize:
        21,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    aiText: {
      color:
        "#AFC0D9",

      fontSize:
        14,

      lineHeight:
        21,

      fontWeight:
        "600",

      textAlign:
        "center",

      marginTop:
        9,
    },


    aiCoachButton: {
      width:
        "100%",

      backgroundColor:
        "#80F2CE",

      borderRadius:
        17,

      paddingVertical:
        15,

      alignItems:
        "center",

      marginTop:
        17,
    },


    aiCoachButtonText: {
      color:
        "#03101B",

      fontSize:
        14,

      fontWeight:
        "900",
    },
  });