import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import {
  isJourneyLocked,
  getUpgradeMessage,
} from "../utils/paywall";

export default function JourneyCard({
  item,
  savedProgress = 0,
  userPlan = "free",
  activeJourney,
  setSelectedJourney,
  setActiveJourney,
  goDetail,
  goHome,
  goPaywall,
}) {
  if (!item) return null;

  const locked = isJourneyLocked(item, userPlan);

 const progress = Math.max(
  0,
  Math.min(
    100,
    Number(savedProgress) ||
      Number(item?.progress) ||
      Number(item?.journeyProgress) ||
      Number(item?.progressPercent) ||
      0
  )
);

const miles = Number(
  item?.miles ??
  item?.distance ??
  0
);

const steps = Number(
  item?.steps ??
  item?.totalSteps ??
  Math.round(miles * 2000)
);



  const reward = Number(
    item.wCoinReward ??
      item.rewardPoints ??
      item.reward ??
      0
  );

  const xp = Number(
    item.xpReward ??
      item.xp ??
      reward * 2
  );

  const difficulty =
    item.difficulty || "Easy";

  const badge =
    item.badge || "Explorer";

  const difficultyColor =
    item.color || "#D4AF37";

  const estimatedTime =
    item.estimatedTime ||
    "Up to 1 week";

  const isActive =
    activeJourney?.id === item.id;

  const title =
    item.title || "Legacy Journey";

  const category =
    item.category || "";

  const subtitle =
    item.subtitle ||
    item.description ||
    "";

  function handleView() {
    if (locked) {
      goPaywall?.(item);
      return;
    }

    setSelectedJourney?.(item);
    goDetail?.(item);
  }

  function handleStart() {
    if (locked) {
      goPaywall?.(item);
      return;
    }

    setActiveJourney?.(item);
    goHome?.(item);
  }

  function handleStory() {
    if (locked) {
      goPaywall?.(item);
      return;
    }

    setSelectedJourney?.(item);
    goStory?.(item);
  }

  function StatBox({
    label,
    value,
    last = false,
  }) {
    return (
      <View
        style={[
          styles.statBox,
          last && styles.lastStatBox,
        ]}
      >
        <Text style={styles.statLabel}>
          {label}
        </Text>

        <Text
          style={styles.statValue}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        locked &&
          styles.lockedCard,
        isActive &&
          styles.activeCard,
      ]}
    >
      <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />

        <View style={styles.header}>
          <View />

          <View
            style={[
              styles.difficultyBadge,
              {
                borderColor:
                  difficultyColor,
              },
            ]}
          >
            <View
              style={[
                styles.difficultyDot,
                {
                  backgroundColor:
                    difficultyColor,
                },
              ]}
            />

            <Text
              style={
                styles.difficultyText
              }
            >
              {difficulty}
            </Text>
          </View>
        </View>

        {locked && (
          <View style={styles.lockBadge}>
            <Text
              style={
                styles.lockBadgeText
              }
            >
              🔒 PREMIUM
            </Text>
          </View>
        )}

        {isActive && !locked && (
          <View style={styles.activeBadge}>
            <Text
              style={
                styles.activeBadgeText
              }
            >
              ACTIVE JOURNEY
            </Text>
          </View>
        )}
      </ImageBackground>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {title}
        </Text>

        {!!category && (
          <Text
            style={styles.category}
          >
            {category}
          </Text>
        )}

        {!!subtitle && (
          <Text
            style={
              styles.description
            }
            numberOfLines={3}
          >
            {subtitle}
          </Text>
        )}

                <View style={styles.rewardPanel}>
          <Text style={styles.rewardTitle}>
            🏆 Journey Rewards
          </Text>

          <View style={styles.rewardRow}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>
                🪙
              </Text>

              <Text style={styles.rewardText}>
                {reward.toLocaleString()} WCoin
              </Text>
            </View>

            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>
                ⭐
              </Text>

              <Text style={styles.rewardText}>
                {xp.toLocaleString()} XP
              </Text>
            </View>

            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>
                🏅
              </Text>

              <Text
                style={styles.rewardText}
                numberOfLines={1}
              >
                {badge}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>
              ⭐ {difficulty}
            </Text>
          </View>

          <View style={styles.metaPill}>
            <Text style={styles.metaText}>
              ⏱ {estimatedTime}
            </Text>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Journey Progress
          </Text>

          <Text style={styles.progressPercent}>
            {progress}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor:
                  difficultyColor,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {progress}% Complete
        </Text>

       <View style={styles.infoRow}>
  <StatBox
    label="Miles"
    value={`${miles.toLocaleString()} mi`}
  />

  <StatBox
    label="Steps"
    value={steps.toLocaleString()}
  />

  <StatBox
    label="Badge"
    value={badge}
    last
  />
</View>
        {locked && (
          <Text style={styles.lockMessage}>
            {getUpgradeMessage(item)}
          </Text>
        )}

       <TouchableOpacity
  style={styles.primaryButton}
  activeOpacity={0.9}
  onPress={handleView}
>
          <Text style={styles.primaryButtonText}>
            {locked
              ? "Unlock Journey"
              : "View Journey"}
          </Text>
        </TouchableOpacity>

      <TouchableOpacity
  style={[
    styles.startButton,
    locked && styles.lockedButton,
  ]}
  activeOpacity={0.9}
  onPress={handleStart}
>
  <Text style={styles.startButtonText}>
    {locked
      ? "View Plans"
      : isActive
      ? "Continue Journey"
      : "Start Journey"}
  </Text>
</TouchableOpacity>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#061226",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 22,
    borderWidth: 2,
    borderColor: "#20314A",

    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  lockedCard: {
    borderColor: "#FFD54F",
  },

  activeCard: {
    borderColor: "#10D8C4",
  },

  image: {
    height: 270,
    justifyContent: "space-between",
  },

  imageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(4,10,22,0.10)",
  },

 

  topSpacer: {
    width: 1,
  },

 topRow: {
  position: "absolute",
  top: 14,
  right: 14,
  zIndex: 5,
},

difficultyBadge: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-end",
  backgroundColor: "rgba(3, 10, 23, 0.92)",
  borderWidth: 1.5,
  borderRadius: 18,
  paddingHorizontal: 12,
  paddingVertical: 8,
  minWidth: 0,
  maxWidth: 130,
},

difficultyDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginRight: 7,
},

difficultyText: {
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: "900",
},

    lockBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(5,12,24,0.92)",
    borderWidth: 1,
    borderColor: "#FFD54F",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  lockBadgeText: {
    color: "#FFD54F",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  activeBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    backgroundColor: "#10D8C4",
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  activeBadgeText: {
    color: "#03111D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 35,
  },

  category: {
    color: "#68E0C1",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 6,
  },

  description: {
    color: "#E3E9F3",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },

  rewardPanel: {
    backgroundColor: "#0B1A30",
    borderWidth: 1,
    borderColor: "#263A59",
    borderRadius: 17,
    padding: 14,
    marginTop: 17,
  },

  rewardTitle: {
    color: "#FFD54A",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 11,
  },

  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111F35",
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },

  rewardIcon: {
    fontSize: 13,
    marginRight: 5,
  },

  rewardText: {
    color: "#F4D978",
    fontSize: 10,
    fontWeight: "800",
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 13,
  },

  metaPill: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1A30",
    borderWidth: 1,
    borderColor: "#263A59",
    borderRadius: 13,
    marginRight: 8,
    paddingHorizontal: 8,
  },

  metaText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
  },

  progressLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  progressPercent: {
    color: "#68E0C1",
    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#18263A",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
  },

  progressText: {
    color: "#AAB6C8",
    fontSize: 11,
    marginTop: 7,
    textAlign: "right",
  },

statBox: {
  flex: 1,
  minWidth: 0,
  backgroundColor: "#10213D",
  borderWidth: 1,
  borderColor: "#294366",
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 6,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
},
lastStatBox: {
  marginRight: 0,
},

statLabel: {
  color: "#AEBBD0",
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
},

statValue: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "900",
  textAlign: "center",
},

  lockMessage: {
    color: "#FFD54A",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 14,
  },

  primaryButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10D8C4",
    borderRadius: 17,
    marginTop: 17,
  },

  primaryButtonText: {
    color: "#03111D",
    fontSize: 16,
    fontWeight: "900",
  },

  startButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD84D",
    borderRadius: 17,
    marginTop: 11,
  },

  lockedButton: {
    backgroundColor: "#FFD54A",
  },

  startButtonText: {
    color: "#15100A",
    fontSize: 16,
    fontWeight: "900",
  },

  storyButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14233A",
    borderWidth: 1,
    borderColor: "#31527A",
    borderRadius: 15,
    marginTop: 11,
  },

  storyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
infoRow: {
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "space-between",
  marginTop: 18,
  marginBottom: 20,

},
});