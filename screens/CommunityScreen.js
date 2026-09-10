import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COMMUNITY_BG = require("../assets/collage-background.png");

const COMMUNITY_STATE_KEY = "@legathon_community_state";

const communityFeed = [
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

const friendsWalking = [
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

const friendRequestPerson = {
  id: "daniel-brooks",
  name: "Daniel Brooks",
  journey: "Selma to Montgomery",
  steps: 6840,
  icon: "👟",
  isOnline: true,
};

const activities = [
  {
    id: "activity-1",
    icon: "🔥",
    title: "Walking Streak",
    text: "Several walkers extended their walking streak today.",
  },
  {
    id: "activity-2",
    icon: "🏆",
    title: "Journey Completed",
    text: "A community member completed the Great Wall of China journey.",
  },
  {
    id: "activity-3",
    icon: "🌍",
    title: "Community Growing",
    text: "New walkers joined the Legathon community.",
  },
];

const walkingCircles = [
  {
    id: "black-legacy",
    icon: "✊🏾",
    name: "Black Legacy",
    members: 5827,
  },
  {
    id: "autism-awareness",
    icon: "🧩",
    name: "Autism Awareness",
    members: 3240,
  },
  {
    id: "world-explorers",
    icon: "🌍",
    name: "World Explorers",
    members: 9120,
  },
  {
    id: "heart-health",
    icon: "❤️",
    name: "Heart Health",
    members: 2188,
  },
];

const topWalkingCircles = [
  {
    id: "world-explorers",
    rank: 1,
    icon: "🌍",
    name: "World Explorers",
    members: 9120,
  },
  {
    id: "black-legacy",
    rank: 2,
    icon: "✊🏾",
    name: "Black Legacy",
    members: 5827,
  },
  {
    id: "autism-awareness",
    rank: 3,
    icon: "🧩",
    name: "Autism Awareness",
    members: 3240,
  },
];

const challenges = [
  {
    id: "weekend-challenge",
    icon: "🔥",
    title: "Weekend Challenge",
    description: "Walk 50,000 community steps this weekend.",
    progress: 42600,
    target: 50000,
    reward: 500,
  },
  {
    id: "global-walking-weekend",
    icon: "🌍",
    title: "Global Walking Weekend",
    description: "Help the community reach 100,000 steps.",
    progress: 31000,
    target: 100000,
    reward: 1000,
  },
];

const events = [
  {
    id: "global-event",
    icon: "🌎",
    title: "Global Walking Weekend",
    date: "Community Event",
    description: "Walk with Legathon members around the world.",
  },
  {
    id: "autism-event",
    icon: "🧩",
    title: "Autism Awareness Walk",
    date: "Awareness Event",
    description: "Walk together in support of autism awareness.",
  },
  {
    id: "heart-event",
    icon: "❤️",
    title: "Heart Health Walk",
    date: "Wellness Event",
    description: "Join the community for a heart-healthy walking event.",
  },
];

const followSuggestions = [
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
        selected && styles.tabButtonSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabButtonText,
          selected && styles.tabButtonTextSelected,
        ]}
      >
        {label}
      </Text>

      {!!badge && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>
          {icon}
        </Text>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      </View>

      {!!subtitle && (
        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export default function CommunityScreen({
  navigation,
  goBack,
  goToAICoach,
}) {
  const [selectedTab, setSelectedTab] =
    useState("global");

  const [cheeredFriends, setCheeredFriends] =
    useState({});

  const [
    friendRequestStatus,
    setFriendRequestStatus,
  ] = useState("pending");

  const [
    acceptedFriends,
    setAcceptedFriends,
  ] = useState([]);

  const [
    joinedChallenges,
    setJoinedChallenges,
  ] = useState({});

  const [
    joinedEvents,
    setJoinedEvents,
  ] = useState({});

  const [
    feedReactions,
    setFeedReactions,
  ] = useState({});

  const [
    joinedCircles,
    setJoinedCircles,
  ] = useState({});

  const [following, setFollowing] =
    useState({});

  const [
    readActivities,
    setReadActivities,
  ] = useState({});

  useEffect(() => {
    loadCommunityState();
  }, []);

  const loadCommunityState = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        COMMUNITY_STATE_KEY
      );

      if (!saved) return;

      const data = JSON.parse(saved);

      setCheeredFriends(
        data.cheeredFriends || {}
      );

      setFriendRequestStatus(
        data.friendRequestStatus || "pending"
      );

      setAcceptedFriends(
        data.acceptedFriends || []
      );

      setJoinedChallenges(
        data.joinedChallenges || {}
      );

      setJoinedEvents(
        data.joinedEvents || {}
      );

      setFeedReactions(
        data.feedReactions || {}
      );

      setJoinedCircles(
        data.joinedCircles || {}
      );

      setFollowing(
        data.following || {}
      );

      setReadActivities(
        data.readActivities || {}
      );
    } catch (error) {
      console.log(
        "COMMUNITY LOAD ERROR:",
        error
      );
    }
  };

  const persistCommunityState =
    async (overrides = {}) => {
      try {
        const stateToSave = {
          cheeredFriends,
          friendRequestStatus,
          acceptedFriends,
          joinedChallenges,
          joinedEvents,
          feedReactions,
          joinedCircles,
          following,
          readActivities,
          ...overrides,
        };

        await AsyncStorage.setItem(
          COMMUNITY_STATE_KEY,
          JSON.stringify(stateToSave)
        );
      } catch (error) {
        console.log(
          "COMMUNITY SAVE ERROR:",
          error
        );
      }
    };

  const handleBack = () => {
    if (goBack) {
      goBack();
      return;
    }

    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleCheer = async (friendId) => {
    const updated = {
      ...cheeredFriends,
      [friendId]: true,
    };

    setCheeredFriends(updated);

    await persistCommunityState({
      cheeredFriends: updated,
    });
  };

  const handleAcceptFriend = async () => {
    const updatedFriends =
      acceptedFriends.some(
        (friend) =>
          friend.id ===
          friendRequestPerson.id
      )
        ? acceptedFriends
        : [
            ...acceptedFriends,
            friendRequestPerson,
          ];

    setFriendRequestStatus("accepted");
    setAcceptedFriends(updatedFriends);

    await persistCommunityState({
      friendRequestStatus: "accepted",
      acceptedFriends: updatedFriends,
    });
  };

  const handleDeclineFriend = async () => {
    setFriendRequestStatus("declined");

    await persistCommunityState({
      friendRequestStatus: "declined",
    });
  };

  const handleRemoveFriend =
    async (friendId) => {
      const updatedFriends =
        acceptedFriends.filter(
          (friend) =>
            friend.id !== friendId
        );

      setAcceptedFriends(updatedFriends);

      await persistCommunityState({
        acceptedFriends: updatedFriends,
      });
    };

  const handleJoinChallenge =
    async (challengeId) => {
      const updated = {
        ...joinedChallenges,
        [challengeId]:
          !joinedChallenges[challengeId],
      };

      setJoinedChallenges(updated);

      await persistCommunityState({
        joinedChallenges: updated,
      });
    };

  const handleJoinEvent =
    async (eventId) => {
      const updated = {
        ...joinedEvents,
        [eventId]:
          !joinedEvents[eventId],
      };

      setJoinedEvents(updated);

      await persistCommunityState({
        joinedEvents: updated,
      });
    };

  const handleFeedReaction =
    async (postId) => {
      const updated = {
        ...feedReactions,
        [postId]: true,
      };

      setFeedReactions(updated);

      await persistCommunityState({
        feedReactions: updated,
      });
    };

  const handleJoinCircle =
    async (circleId) => {
      const updated = {
        ...joinedCircles,
        [circleId]:
          !joinedCircles[circleId],
      };

      setJoinedCircles(updated);

      await persistCommunityState({
        joinedCircles: updated,
      });
    };

  const handleToggleFollow =
    async (id) => {
      const updated = {
        ...following,
        [id]: !following[id],
      };

      setFollowing(updated);

      await persistCommunityState({
        following: updated,
      });
    };

  const handleActivityRead =
    async (activityId) => {
      const updated = {
        ...readActivities,
        [activityId]: true,
      };

      setReadActivities(updated);

      await persistCommunityState({
        readActivities: updated,
      });
    };

  const handleOpenAICoach = () => {
    if (goToAICoach) {
      goToAICoach();
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate("AIWellness");
      return;
    }

    Alert.alert(
      "Legathon AI",
      "AI Community Coach navigation is ready to be connected."
    );
  };

  const allFriends = useMemo(
    () => [
      ...friendsWalking,
      ...acceptedFriends,
    ],
    [acceptedFriends]
  );

  const totalFriends =
    allFriends.length;

  const onlineFriends =
    allFriends.filter(
      (friend) =>
        friend.isOnline !== false
    ).length;

  const unreadActivityCount =
    activities.filter(
      (item) =>
        !readActivities[item.id]
    ).length;

  const pendingFriendRequests =
    friendRequestStatus === "pending"
      ? 1
      : 0;

  const renderFriendsTab = () => {
    return (
      <>
        <SectionTitle
          icon="👟"
          title="Friends Walking Now"
          subtitle={`${onlineFriends} of ${totalFriends} friends online`}
        />

        {allFriends.map((friend) => {
          const isAcceptedFriend =
            acceptedFriends.some(
              (accepted) =>
                accepted.id === friend.id
            );

          return (
            <View
              key={friend.id}
              style={styles.friendCard}
            >
              <View
                style={
                  styles.friendIconWrap
                }
              >
                <Text
                  style={styles.friendIcon}
                >
                  {friend.icon}
                </Text>
              </View>

              <View
                style={styles.friendInfo}
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

                  <View
                    style={
                      styles.onlineDot
                    }
                  />
                </View>

                <Text
                  style={
                    styles.friendJourney
                  }
                >
                  {friend.journey}
                </Text>

                <Text
                  style={styles.friendSteps}
                >
                  {Number(
                    friend.steps || 0
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
                    !!cheeredFriends[
                      friend.id
                    ]
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
        })}

        <SectionTitle
          icon="👥"
          title="Friend Requests"
        />

        <View style={styles.requestCard}>
          <View
            style={styles.requestTop}
          >
            <View
              style={
                styles.requestIconWrap
              }
            >
              <Text
                style={styles.requestIcon}
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
                style={styles.requestName}
              >
                {friendRequestPerson.name}
              </Text>

              <Text
                style={styles.requestText}
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

  const renderFollowingTab = () => {
    return (
      <>
        <SectionTitle
          icon="📡"
          title="Following"
          subtitle="Walkers and circles you follow"
        />

        {followSuggestions.map(
          (item) => (
            <View
              key={item.id}
              style={styles.followCard}
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
                  following[item.id] &&
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
                    following[item.id] &&
                      styles.followButtonTextActive,
                  ]}
                >
                  {following[item.id]
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

  const renderGlobalTab = () => {
    return (
      <>
        <SectionTitle
          icon="🔔"
          title="Activity Center"
          subtitle={
            unreadActivityCount > 0
              ? `${unreadActivityCount} unread updates`
              : "You're all caught up"
          }
        />

        {activities.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.activityCard,
              readActivities[item.id] &&
                styles.activityCardRead,
            ]}
            onPress={() =>
              handleActivityRead(
                item.id
              )
            }
            disabled={
              !!readActivities[item.id]
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
        ))}

        <SectionTitle
          icon="🌎"
          title="Community Feed"
          subtitle="Celebrate walkers around the world"
        />

        {communityFeed.map(
          (item) => (
            <View
              key={item.id}
              style={styles.feedCard}
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
                  !!feedReactions[item.id]
                }
              >
                <Text
                  style={[
                    styles.feedActionText,
                    feedReactions[
                      item.id
                    ] &&
                      styles.feedActionTextActive,
                  ]}
                >
                  {feedReactions[
                    item.id
                  ]
                    ? "✓ Sent"
                    : `${item.actionIcon} ${item.action}`}
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}

        <SectionTitle
          icon="👣"
          title="Walking Circles"
          subtitle="Find your walking community"
        />

        <View
          style={styles.circleGrid}
        >
          {walkingCircles.map(
            (circle) => (
              <TouchableOpacity
                key={circle.id}
                style={[
                  styles.circleCard,
                  joinedCircles[
                    circle.id
                  ] &&
                    styles.circleCardJoined,
                ]}
                onPress={() =>
                  handleJoinCircle(
                    circle.id
                  )
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
                  {circle.members.toLocaleString()}{" "}
                  members
                </Text>

                <Text
                  style={[
                    styles.circleJoinText,
                    joinedCircles[
                      circle.id
                    ] &&
                      styles.circleJoinTextActive,
                  ]}
                >
                  {joinedCircles[
                    circle.id
                  ]
                    ? "✓ Joined • Tap to Leave"
                    : "Join Circle"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <SectionTitle
          icon="🏆"
          title="Top Walking Circles"
        />

        {topWalkingCircles.map(
          (circle) => (
            <View
              key={circle.id}
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
                  {circle.members.toLocaleString()}{" "}
                  members
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.topCircleButton,
                  joinedCircles[
                    circle.id
                  ] &&
                    styles.topCircleButtonJoined,
                ]}
                onPress={() =>
                  handleJoinCircle(
                    circle.id
                  )
                }
              >
                <Text
                  style={[
                    styles.topCircleButtonText,
                    joinedCircles[
                      circle.id
                    ] &&
                      styles.topCircleButtonTextJoined,
                  ]}
                >
                  {joinedCircles[
                    circle.id
                  ]
                    ? "✓ Joined"
                    : "Join"}
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}

        <SectionTitle
          icon="🎯"
          title="Community Challenges"
        />

        {challenges.map(
          (challenge) => {
            const percentage =
              Math.min(
                challenge.progress /
                  challenge.target,
                1
              ) * 100;

            return (
              <View
                key={challenge.id}
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
                      {
                        challenge.description
                      }
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
                        width: `${percentage}%`,
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
                    {challenge.progress.toLocaleString()}{" "}
                    /{" "}
                    {challenge.target.toLocaleString()}
                  </Text>

                  <Text
                    style={
                      styles.challengeReward
                    }
                  >
                    🪙{" "}
                    {challenge.reward.toLocaleString()}
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

        <SectionTitle
          icon="📅"
          title="Community Events"
        />

        {events.map((event) => (
          <View
            key={event.id}
            style={styles.eventCard}
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
              style={styles.eventInfo}
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
        ))}

        <SectionTitle
          icon="🧠"
          title="Legathon AI Community Coach"
        />

        <View style={styles.aiCard}>
          <View
            style={styles.aiIconWrap}
          >
            <Text style={styles.aiIcon}>
              ✨
            </Text>
          </View>

          <Text style={styles.aiTitle}>
            Walk Smarter Together
          </Text>

          <Text style={styles.aiText}>
            Get encouragement, community
            insights, walking motivation,
            and personalized guidance from
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

  const renderTabContent = () => {
    if (selectedTab === "friends") {
      return renderFriendsTab();
    }

    if (
      selectedTab === "following"
    ) {
      return renderFollowingTab();
    }

    return renderGlobalTab();
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ImageBackground
        source={COMMUNITY_BG}
        style={styles.background}
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
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
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
            style={styles.brandText}
          >
            LEGATHON WALK
          </Text>

          <Text
            style={styles.mainTitle}
          >
            Legathon Community
          </Text>

          <Text
            style={styles.mainSubtitle}
          >
            Walk • Encourage • Grow
            Together
          </Text>

          <View
            style={styles.onlineCard}
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
                {onlineFriends.toLocaleString()}
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

          <View style={styles.tabRow}>
            <CommunityTab
              label="GLOBAL"
              selected={
                selectedTab === "global"
              }
              onPress={() =>
                setSelectedTab("global")
              }
              badge={
                unreadActivityCount > 0
                  ? unreadActivityCount
                  : null
              }
            />

            <CommunityTab
              label="FRIENDS"
              selected={
                selectedTab === "friends"
              }
              onPress={() =>
                setSelectedTab("friends")
              }
              badge={
                pendingFriendRequests
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020813",
  },

  background: {
    flex: 1,
    backgroundColor: "#020813",
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 150,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 18,
    marginBottom: 6,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  brandText: {
    color: "#FFD343",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginTop: 6,
  },

  mainTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    marginTop: 8,
  },

  mainSubtitle: {
    color: "#AFC0D9",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 22,
  },

  onlineCard: {
    backgroundColor:
      "rgba(15, 29, 49, 0.96)",
    borderWidth: 1,
    borderColor: "#243856",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 20,
  },

  onlineLabel: {
    color: "#8FA5C2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  onlineCount: {
    color: "#80F2CE",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 3,
  },

  onlineRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  largeOnlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#80F2CE",
    marginRight: 8,
  },

  onlineStatus: {
    color: "#DDE7F5",
    fontSize: 13,
    fontWeight: "800",
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor:
      "rgba(10, 22, 38, 0.96)",
    borderRadius: 20,
    padding: 5,
    marginBottom: 24,
  },

  tabButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },

  tabButtonSelected: {
    backgroundColor: "#FFD343",
  },

  tabButtonText: {
    color: "#91A3BC",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  tabButtonTextSelected: {
    color: "#08111D",
  },

  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF5B5B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 4,
  },

  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  sectionHeader: {
    marginTop: 7,
    marginBottom: 13,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    fontSize: 23,
    marginRight: 9,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#8FA2BD",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    marginLeft: 34,
  },

  friendCard: {
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  friendIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1B2A42",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  friendIcon: {
    fontSize: 25,
  },

  friendInfo: {
    flex: 1,
  },

  friendNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  friendName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#80F2CE",
    marginLeft: 7,
  },

  friendJourney: {
    color: "#AFC0D9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  friendSteps: {
    color: "#FFD343",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },

  friendActions: {
    alignItems: "center",
    marginLeft: 8,
  },

  cheerButton: {
    backgroundColor: "#182C45",
    borderWidth: 1,
    borderColor: "#35516F",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  cheerButtonActive: {
    backgroundColor: "#1F5C4E",
    borderColor: "#80F2CE",
  },

  cheerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  removeFriendButton: {
    marginTop: 7,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  removeFriendButtonText: {
    color: "#9AA9BF",
    fontSize: 11,
    fontWeight: "800",
  },

  requestCard: {
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },

  requestTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  requestIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1D2C44",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  requestIcon: {
    fontSize: 27,
  },

  requestInfo: {
    flex: 1,
  },

  requestName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  requestText: {
    color: "#AFC0D9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  requestButtonRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  acceptButton: {
    flex: 1,
    backgroundColor: "#80F2CE",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginRight: 6,
  },

  acceptButtonText: {
    color: "#06101D",
    fontSize: 14,
    fontWeight: "900",
  },

  declineButton: {
    flex: 1,
    backgroundColor: "#1D2B40",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginLeft: 6,
  },

  declineButtonText: {
    color: "#DCE5F2",
    fontSize: 14,
    fontWeight: "900",
  },

  requestStatusBox: {
    marginTop: 18,
    backgroundColor: "#172946",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  requestStatusText: {
    color: "#80F2CE",
    fontSize: 15,
    fontWeight: "900",
  },

  followCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  followIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1D2C44",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  followIcon: {
    fontSize: 25,
  },

  followInfo: {
    flex: 1,
  },

  followName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  followSubtitle: {
    color: "#AEBBD2",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  followButton: {
    borderWidth: 1.5,
    borderColor: "#80F2CE",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  followButtonActive: {
    backgroundColor: "#1F5C4E",
  },

  followButtonText: {
    color: "#80F2CE",
    fontSize: 12,
    fontWeight: "900",
  },

  followButtonTextActive: {
    color: "#FFFFFF",
  },

  activityCard: {
    flexDirection: "row",
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderWidth: 1,
    borderColor: "#263B58",
    borderRadius: 20,
    padding: 15,
    marginBottom: 11,
  },

  activityCardRead: {
    opacity: 0.6,
    borderColor: "#26364D",
  },

  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E304B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityIcon: {
    fontSize: 22,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  activityText: {
    color: "#AFC0D9",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 3,
  },

  activityStatus: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },

  activityStatusRead: {
    color: "#80F2CE",
  },

  feedCard: {
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
  },

  feedTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  feedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1C2B42",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  feedAvatarText: {
    fontSize: 24,
  },

  feedInfo: {
    flex: 1,
  },

  feedName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  feedActivity: {
    color: "#AFBED2",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  feedJourneyBox: {
    backgroundColor: "#0D1727",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },

  feedJourneyLabel: {
    color: "#8194AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  feedJourneyText: {
    color: "#FFD343",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3,
  },

  feedActionButton: {
    borderWidth: 1,
    borderColor: "#36506E",
    borderRadius: 15,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 13,
  },

  feedActionButtonActive: {
    backgroundColor: "#1F5C4E",
    borderColor: "#80F2CE",
  },

  feedActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  feedActionTextActive: {
    color: "#FFFFFF",
  },

  circleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  circleCard: {
    width: "48.5%",
    minHeight: 170,
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderWidth: 1,
    borderColor: "#263B58",
    borderRadius: 21,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  circleCardJoined: {
    borderWidth: 2,
    borderColor: "#80F2CE",
    backgroundColor: "#102A2B",
  },

  circleIcon: {
    fontSize: 31,
    marginBottom: 9,
  },

  circleName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  circleMembers: {
    color: "#91A4BD",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },

  circleJoinText: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },

  circleJoinTextActive: {
    color: "#80F2CE",
  },

  topCircleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 19,
    padding: 14,
    marginBottom: 10,
  },

  topCircleRank: {
    width: 36,
  },

  topCircleRankText: {
    color: "#FFD343",
    fontSize: 15,
    fontWeight: "900",
  },

  topCircleIcon: {
    fontSize: 25,
    marginRight: 10,
  },

  topCircleInfo: {
    flex: 1,
  },

  topCircleName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  topCircleMembers: {
    color: "#91A4BD",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  topCircleButton: {
    backgroundColor: "#FFD343",
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  topCircleButtonJoined: {
    backgroundColor: "#1F5C4E",
  },

  topCircleButtonText: {
    color: "#07111E",
    fontSize: 11,
    fontWeight: "900",
  },

  topCircleButtonTextJoined: {
    color: "#FFFFFF",
  },

  challengeCard: {
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
  },

  challengeHeader: {
    flexDirection: "row",
  },

  challengeIcon: {
    fontSize: 31,
    marginRight: 12,
  },

  challengeHeaderInfo: {
    flex: 1,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  challengeDescription: {
    color: "#AFC0D9",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 4,
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#26354A",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 17,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#80F2CE",
    borderRadius: 10,
  },

  challengeStats: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginTop: 8,
  },

  challengeProgressText: {
    color: "#B9C6D9",
    fontSize: 11,
    fontWeight: "800",
  },

  challengeReward: {
    color: "#FFD343",
    fontSize: 12,
    fontWeight: "900",
  },

  aquaButton: {
    backgroundColor: "#80F2CE",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 15,
  },

  aquaButtonText: {
    color: "#06101D",
    fontSize: 14,
    fontWeight: "900",
  },

  joinedButton: {
    backgroundColor: "#66CDB1",
  },

  eventCard: {
    flexDirection: "row",
    backgroundColor:
      "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 13,
  },

  eventIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E2F48",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  eventIcon: {
    fontSize: 27,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  eventDate: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },

  eventDescription: {
    color: "#AFC0D9",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 6,
  },

  goldButton: {
    backgroundColor: "#FFD343",
    borderRadius: 15,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 13,
  },

  goldButtonText: {
    color: "#07111E",
    fontSize: 13,
    fontWeight: "900",
  },

  joinedEventButton: {
    backgroundColor: "#1F5C4E",
  },

  joinedEventButtonText: {
    color: "#FFFFFF",
  },

  aiCard: {
    backgroundColor:
      "rgba(16, 29, 49, 0.98)",
    borderWidth: 1,
    borderColor: "#3A5C68",
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
    marginBottom: 10,
  },

  aiIconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#173844",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  aiIcon: {
    fontSize: 32,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
  },

  aiText: {
    color: "#AFC0D9",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 9,
  },

  aiCoachButton: {
    width: "100%",
    backgroundColor: "#80F2CE",
    borderRadius: 17,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 17,
  },

  aiCoachButtonText: {
    color: "#03101B",
    fontSize: 14,
    fontWeight: "900",
  },
});