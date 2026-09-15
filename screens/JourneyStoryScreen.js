import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { Ionicons } from
  "@expo/vector-icons";

import {
  getJourneyStory,
} from "../data/journeyStories";

import {
  getJourneyProgress,
} from "../utils/journeyProgress";

import {
  pauseCoachVoice,
  resumeCoachVoice,
  speakCoachVoice,
  stopCoachVoice,
} from "../utils/coachVoice";

export default function JourneyStoryScreen({
  route,
  goBack,
  goToProgress,
  lifetimeSteps = 0,
  subscriptionPlan = "free",
}) {
  const routeJourney =
    route?.params?.journey || null;

  const selectedJourneyId =
    routeJourney?.id ||
    routeJourney?.journeyId ||
    routeJourney?.routeKey ||
    routeJourney?.slug ||
    routeJourney?.title ||
    "selma";

  const storyData =
    getJourneyStory(selectedJourneyId);

  const requestedCheckpoint = Math.min(
    5,
    Math.max(
      1,
      Number(
        route?.params?.checkpoint || 1
      )
    )
  );

  const [isNarrating, setIsNarrating] =
    useState(false);

  const [
    isLoadingNarration,
    setIsLoadingNarration,
  ] = useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [voiceRate, setVoiceRate] =
    useState(1);

  const [
    narrationProgress,
    setNarrationProgress,
  ] = useState(0);

  const [
    listenedChapters,
    setListenedChapters,
  ] = useState([]);

  const [storyXP, setStoryXP] =
    useState(0);

  const [
    showXPReward,
    setShowXPReward,
  ] = useState(false);

  const [
    journeyProgress,
    setJourneyProgress,
  ] = useState(null);

  const isPremium =
    subscriptionPlan === "premium" ||
    subscriptionPlan === "legendary" ||
    subscriptionPlan === "elite";

  useEffect(() => {
    loadNarrationSettings();
    loadListenedChapters();
    loadStoryXP();

    return () => {
      stopCoachVoice();
    };
  }, []);

  useEffect(() => {
    saveNarrationSettings();
  }, [voiceRate]);

  useEffect(() => {
    let mounted = true;

    async function loadProgress() {
      try {
        const savedProgress =
          await getJourneyProgress(
            selectedJourneyId
          );

        if (mounted) {
          setJourneyProgress(
            savedProgress
          );
        }
      } catch (error) {
        console.log(
          "Journey progress load error:",
          error
        );
      }
    }

    if (selectedJourneyId) {
      loadProgress();
    }

    return () => {
      mounted = false;
    };
  }, [selectedJourneyId]);

  async function loadNarrationSettings() {
    try {
      const saved =
        await AsyncStorage.getItem(
          "journeyNarrationSettings"
        );

      if (saved) {
        const settings =
          JSON.parse(saved);

        setVoiceRate(
          Number(
            settings?.voiceRate || 1
          )
        );
      }
    } catch (error) {
      console.log(
        "Load narration settings error:",
        error
      );
    }
  }

  async function saveNarrationSettings() {
    try {
      await AsyncStorage.setItem(
        "journeyNarrationSettings",
        JSON.stringify({
          voiceRate,
        })
      );
    } catch (error) {
      console.log(
        "Save narration settings error:",
        error
      );
    }
  }

  async function loadListenedChapters() {
    try {
      const saved =
        await AsyncStorage.getItem(
          "listenedJourneyChapters"
        );

      setListenedChapters(
        saved ? JSON.parse(saved) : []
      );
    } catch (error) {
      console.log(
        "Load listened chapters error:",
        error
      );
    }
  }

  async function loadStoryXP() {
    try {
      const saved =
        await AsyncStorage.getItem(
          "storyXP"
        );

      setStoryXP(
        Number(saved || 0)
      );
    } catch (error) {
      console.log(
        "Load story XP error:",
        error
      );
    }
  }

 const checkpoints = useMemo(() => {
  const chapters =
    storyData?.chapters || [];

  const journeyPercent = Math.max(
    Number(journeyProgress?.progress || 0),
    Number(routeJourney?.progress || 0),
    Number(routeJourney?.journeyProgress || 0)
  );

  const journeyIsComplete =
    journeyProgress?.isComplete === true ||
    journeyProgress?.completed === true ||
    routeJourney?.isComplete === true ||
    routeJourney?.completed === true ||
    journeyPercent >= 100;

  const currentCheckpoint = Math.max(
    Number(
      journeyProgress?.currentCheckpoint || 0
    ),
    Number(
      journeyProgress?.checkpoint || 0
    ),
    Number(
      routeJourney?.currentCheckpoint || 0
    ),
    Number(
      routeJourney?.checkpoint || 0
    )
  );

  const completedCheckpoints = [
    ...(
      Array.isArray(
        journeyProgress?.completedCheckpoints
      )
        ? journeyProgress.completedCheckpoints
        : []
    ),
    ...(
      Array.isArray(
        routeJourney?.completedCheckpoints
      )
        ? routeJourney.completedCheckpoints
        : []
    ),
  ].map(Number);

  const unlockedStories = [
    ...(
      Array.isArray(
        journeyProgress?.storiesUnlocked
      )
        ? journeyProgress.storiesUnlocked
        : []
    ),
    ...(
      Array.isArray(
        routeJourney?.storiesUnlocked
      )
        ? routeJourney.storiesUnlocked
        : []
    ),
  ].map(Number);

  return chapters.map(
    (chapter, index) => {
      const checkpointNumber =
        index + 1;

      const requiredPercent =
        ((checkpointNumber - 1) / 4) *
        100;

      const requiredSteps =
        Number(
          routeJourney
            ?.checkpointSteps?.[index]
        ) ||
        Number(
          routeJourney?.stepsPerCheckpoint
        ) *
          checkpointNumber ||
        checkpointNumber * 1000;

      const unlocked =
        checkpointNumber === 1 ||
        journeyIsComplete ||
        journeyPercent >= requiredPercent ||
        currentCheckpoint >=
          checkpointNumber ||
        completedCheckpoints.includes(
          checkpointNumber
        ) ||
        unlockedStories.includes(
          checkpointNumber
        );

      const chapterId =
        chapter.id ||
        `${
          storyData?.id || "journey"
        }-${checkpointNumber}`;

      const completed =
        listenedChapters.includes(
          chapterId
        ) ||
        journeyIsComplete ||
        completedCheckpoints.includes(
          checkpointNumber
        );

      return {
        ...chapter,

        id: chapterId,

        number: checkpointNumber,

        checkpoint:
          checkpointNumber,

        title:
          chapter.location ||
          chapter.title ||
          `Checkpoint ${checkpointNumber}`,

        subtitle:
          chapter.title ||
          `Chapter ${checkpointNumber}`,

        story:
          chapter.description ||
          chapter.narration ||
          "",

        premiumNarration:
          chapter.narration ||
          chapter.description ||
          "",

        xp: Number(
          chapter.xp || 20
        ),

        requiredSteps,
        unlocked,
        completed,
      };
    }
  );
}, [
  storyData,
  routeJourney,
  listenedChapters,
  journeyProgress,
]);

  const storyChapters =
    storyData?.chapters ||
    storyData?.checkpoints ||
    checkpoints ||
    [];

  const requestedChapter =
    storyChapters.find(
      (item, index) => {
        const chapterNumber =
          Number(
            item?.checkpoint ??
              item?.number ??
              index + 1
          );

        return (
          chapterNumber ===
          requestedCheckpoint
        );
      }
    ) || null;

  const currentChapter =
    requestedChapter ||
    storyChapters[
      requestedCheckpoint - 1
    ] ||
    checkpoints.find(
      (item, index) => {
        const chapterNumber =
          Number(
            item?.checkpoint ??
              item?.number ??
              index + 1
          );

        return (
          chapterNumber ===
          requestedCheckpoint
        );
      }
    ) ||
    checkpoints[
      requestedCheckpoint - 1
    ] ||
    checkpoints[0] || {
      id:
        `journey-start-` +
        requestedCheckpoint,

      number: requestedCheckpoint,

      checkpoint:
        requestedCheckpoint,

      title: "Journey Start",

      subtitle:
        "The Journey Begins",

      story:
        "Begin walking to unlock this journey’s story.",

      premiumNarration:
        "Begin walking to unlock this journey’s narration.",

      xp: 0,
      requiredSteps: 0,
      unlocked: true,
      completed: false,
    };

  const journeyTitle =
    storyData?.title ||
    routeJourney?.title ||
    routeJourney?.name ||
    "Legathon Journey";

  const chapterTitle =
    currentChapter?.subtitle ||
    currentChapter?.title ||
    "The Journey Begins";

  const chapterLocation =
    currentChapter?.title ||
    currentChapter?.location ||
    `Checkpoint ${
      currentChapter?.number || 1
    }`;

  const chapterStory =
    currentChapter?.story ||
    currentChapter?.description ||
    "Begin walking to unlock this chapter.";

  const chapterNarration =
    currentChapter
      ?.premiumNarration ||
    currentChapter?.narration ||
    chapterStory;

  const storyLevel = Math.max(
    1,
    Math.floor(storyXP / 100) + 1
  );

  const storyXPProgress =
    storyXP % 100;

  const narrationText = isPremium
    ? chapterNarration
    : `${chapterLocation}. ` +
      `${chapterTitle}. ` +
      chapterStory;

  function isSpeed(rate) {
    return voiceRate === rate;
  }

  async function finishNarration() {
    setIsNarrating(false);
    setIsLoadingNarration(false);
    setIsPaused(false);
    setNarrationProgress(0);

    if (
      listenedChapters.includes(
        currentChapter.id
      )
    ) {
      return;
    }

    const updatedChapters = [
      ...listenedChapters,
      currentChapter.id,
    ];

    setListenedChapters(
      updatedChapters
    );

    await AsyncStorage.setItem(
      "listenedJourneyChapters",
      JSON.stringify(
        updatedChapters
      )
    );

    const updatedXP =
      storyXP + 25;

    setStoryXP(updatedXP);

    await AsyncStorage.setItem(
      "storyXP",
      String(updatedXP)
    );

    setShowXPReward(true);

    setTimeout(() => {
      setShowXPReward(false);
    }, 2500);
  }

  async function playNarration() {
    stopCoachVoice();

    setIsLoadingNarration(true);
    setIsNarrating(false);
    setIsPaused(false);
    setNarrationProgress(0);

    try {
      await speakCoachVoice(
        narrationText,
        {
          rate: voiceRate,

          onStatus: (status) => {
            if (status?.isLoaded) {
              setIsLoadingNarration(
                false
              );

              setIsNarrating(
                Boolean(
                  status.playing ||
                    status.paused
                )
              );
            }

            if (
              Number(status?.duration) > 0
            ) {
              const currentTime =
                Number(
                  status.currentTime || 0
                );

              const duration =
                Number(status.duration);

              const progress =
                (currentTime /
                  duration) *
                100;

              setNarrationProgress(
                Math.min(
                  Math.max(
                    progress,
                    0
                  ),
                  100
                )
              );
            }
          },

          onDone: async () => {
            await finishNarration();
          },

          onError: (error) => {
            console.log(
              "Natural narration playback error:",
              error
            );

            setIsLoadingNarration(
              false
            );

            setIsNarrating(false);
            setIsPaused(false);

            setNarrationProgress(0);
          },
        }
      );
    } catch (error) {
      console.log(
        "Natural narration request error:",
        error
      );

      setIsLoadingNarration(false);
      setIsNarrating(false);
      setIsPaused(false);
      setNarrationProgress(0);
    }
  }

  function pauseNarration() {
    const paused =
      pauseCoachVoice();

    if (paused) {
      setIsPaused(true);
    }
  }

  function resumeNarration() {
    const resumed =
      resumeCoachVoice();

    if (resumed) {
      setIsPaused(false);
      setIsNarrating(true);
    } else {
      playNarration();
    }
  }

  function stopNarration() {
    stopCoachVoice();

    setIsLoadingNarration(false);
    setIsNarrating(false);
    setIsPaused(false);
    setNarrationProgress(0);
  }

  async function shareChapter() {
    try {
      await Share.share({
        message:
          `I unlocked "` +
          `${currentChapter.subtitle}` +
          `" on Legathon Walk. ` +
          `${currentChapter.story}`,
      });
    } catch (error) {
      console.log(
        "Share chapter error:",
        error
      );
    }
  }

  function continueWalking() {
    const journeyToContinue =
      routeJourney &&
      typeof routeJourney ===
        "object"
        ? routeJourney
        : storyData &&
            typeof storyData ===
              "object"
          ? {
              ...storyData,

              id:
                storyData.id ||
                routeJourney?.id ||
                "",
            }
          : null;

    if (
      typeof goToProgress ===
      "function"
    ) {
      goToProgress(
        journeyToContinue
      );
      return;
    }

    if (
      typeof goBack ===
      "function"
    ) {
      goBack();
    }
  }

  return (
    <ImageBackground
      source={
        routeJourney?.background ||
        routeJourney?.image ||
        storyData?.background ||
        require(
          "../assets/collage-background.png"
        )
      }
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {showXPReward && (
          <View
            style={styles.xpReward}
          >
            <Text
              style={
                styles.xpRewardText
              }
            >
              +25 Story XP
            </Text>
          </View>
        )}

        <SafeAreaView
          style={styles.safe}
        >
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.content
            }
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={goBack}
              activeOpacity={0.85}
            >
              <Text
                style={styles.backText}
              >
                ← Back
              </Text>
            </TouchableOpacity>

            <Text style={styles.kicker}>
              JOURNEY STORY
            </Text>

            <Text
              style={styles.journeyTitle}
            >
              {journeyTitle}
            </Text>

            <Text
              style={styles.subtitle}
            >
              Unlock the story one
              checkpoint at a time as
              your real-world steps move
              you through the route.
            </Text>

            <View
              style={styles.heroCard}
            >
              <Text
                style={styles.heroLabel}
              >
                CURRENT CHAPTER
              </Text>

              <Text
                style={styles.heroTitle}
              >
                {
                  currentChapter.subtitle
                }
              </Text>

              <View
                style={
                  styles.storyLevelCard
                }
              >
                <Text
                  style={
                    styles.storyLevelText
                  }
                >
                  Story Level{" "}
                  {storyLevel}
                </Text>

                <Text
                  style={
                    styles.storyXPText
                  }
                >
                  {storyXPProgress}/100 XP
                </Text>

                <View
                  style={
                    styles.storyXPTrack
                  }
                >
                  <View
                    style={[
                      styles.storyXPFill,

                      {
                        width:
                          `${storyXPProgress}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <Text
                style={styles.heroText}
              >
                {currentChapter.story}
              </Text>

              <View
                style={
                  styles.naturalBadge
                }
              >
                <View
                  style={
                    styles.naturalDot
                  }
                />

                <Text
                  style={
                    styles.naturalBadgeText
                  }
                >
                  NATURAL AI NARRATION
                </Text>
              </View>

              {!isNarrating &&
              !isLoadingNarration ? (
                <TouchableOpacity
                  style={
                    styles.audioButton
                  }
                  onPress={
                    playNarration
                  }
                  activeOpacity={0.85}
                >
                  <Text
                    style={
                      styles.audioButtonText
                    }
                  >
                    🎙 Play Natural
                    Narration
                  </Text>
                </TouchableOpacity>
              ) : isLoadingNarration ? (
                <View
                  style={
                    styles.loadingButton
                  }
                >
                  <Text
                    style={
                      styles.loadingText
                    }
                  >
                    Preparing natural
                    voice...
                  </Text>
                </View>
              ) : (
                <View
                  style={
                    styles.audioControlRow
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.audioMiniButton
                    }
                    onPress={
                      isPaused
                        ? resumeNarration
                        : pauseNarration
                    }
                    activeOpacity={0.85}
                  >
                    <Text
                      style={
                        styles.audioMiniText
                      }
                    >
                      {isPaused
                        ? "▶ Resume"
                        : "⏸ Pause"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.audioMiniButton,
                      styles.stopButton,
                    ]}
                    onPress={
                      stopNarration
                    }
                    activeOpacity={0.85}
                  >
                    <Text
                      style={
                        styles.audioMiniText
                      }
                    >
                      ⏹ Stop
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {(isNarrating ||
                isLoadingNarration) && (
                <View
                  style={
                    styles
                      .narrationProgressTrack
                  }
                >
                  <View
                    style={[
                      styles
                        .narrationProgressFill,

                      {
                        width:
                          `${narrationProgress}%`,
                      },
                    ]}
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.shareButton}
                onPress={shareChapter}
                activeOpacity={0.85}
              >
                <Text
                  style={
                    styles.shareButtonText
                  }
                >
                  📤 Share Chapter
                </Text>
              </TouchableOpacity>

              <View
                style={styles.audioPanel}
              >
                <Text
                  style={
                    styles.audioPanelTitle
                  }
                >
                  Natural Voice
                  Experience
                </Text>

                <Text
                  style={
                    styles
                      .naturalVoiceDescription
                  }
                >
                  Human-quality narration
                  powered by the Legathon
                  natural voice system.
                </Text>

                <Text
                  style={
                    styles.controlTitle
                  }
                >
                  Playback Speed
                </Text>

                <View
                  style={styles.speedRow}
                >
                  <TouchableOpacity
                    style={[
                      styles.speedButton,

                      isSpeed(0.85) &&
                        styles
                          .controlButtonActive,
                    ]}
                    onPress={() =>
                      setVoiceRate(0.85)
                    }
                    activeOpacity={0.85}
                  >
                    <Text
                      style={
                        styles.speedText
                      }
                    >
                      Slow
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.speedButton,

                      isSpeed(1) &&
                        styles
                          .controlButtonActive,
                    ]}
                    onPress={() =>
                      setVoiceRate(1)
                    }
                    activeOpacity={0.85}
                  >
                    <Text
                      style={
                        styles.speedText
                      }
                    >
                      Normal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.speedButton,

                      isSpeed(1.15) &&
                        styles
                          .controlButtonActive,
                    ]}
                    onPress={() =>
                      setVoiceRate(1.15)
                    }
                    activeOpacity={0.85}
                  >
                    <Text
                      style={
                        styles.speedText
                      }
                    >
                      Fast
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={
                  styles.transcriptCard
                }
              >
                <Text
                  style={
                    styles.transcriptLabel
                  }
                >
                  STORY TRANSCRIPT
                </Text>

                <Text
                  style={
                    styles.transcriptText
                  }
                >
                  {narrationText}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.checkpointsSection
              }
            >
              <Text
                style={
                  styles.checkpointsTitle
                }
              >
                Story Checkpoints
              </Text>

              {checkpoints.map(
                (
                  checkpoint,
                  index
                ) => {
                  const checkpointNumber =
                    Number(
                      checkpoint.checkpoint ||
                        checkpoint.number ||
                        index + 1
                    );

                  const isCurrent =
                    checkpointNumber ===
                    Number(
                      requestedCheckpoint
                    );

                  const isUnlocked =
                    checkpoint.unlocked ||
                    isCurrent;

                  const isCompleted =
                    checkpoint.completed ||
                    listenedChapters.includes(
                      checkpoint.id
                    );

                  return (
                    <View
                      key={
                        checkpoint.id ||
                        `checkpoint-${checkpointNumber}`
                      }
                      style={[
                        styles.checkpointCard,

                        isCurrent &&
                          styles
                            .checkpointCardCurrent,

                        !isUnlocked &&
                          styles
                            .checkpointCardLocked,
                      ]}
                    >
                      <View
                        style={[
                          styles
                            .checkpointNumber,

                          isCompleted &&
                            styles
                              .checkpointNumberComplete,

                          !isUnlocked &&
                            styles
                              .checkpointNumberLocked,
                        ]}
                      >
                        {isUnlocked ? (
                          <Text
                            style={
                              styles
                                .checkpointNumberText
                            }
                          >
                            {
                              checkpointNumber
                            }
                          </Text>
                        ) : (
                          <Ionicons
                            name="lock-closed"
                            size={21}
                            color="#94A1B3"
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles
                            .checkpointContent
                        }
                      >
                        <Text
                          style={
                            styles
                              .checkpointStatus
                          }
                        >
                          {isCompleted
                            ? "NARRATION COMPLETE"
                            : isCurrent
                              ? "CURRENT CHAPTER"
                              : isUnlocked
                                ? "UNLOCKED"
                                : "LOCKED"}
                        </Text>

                        <Text
                          style={
                            styles
                              .checkpointTitle
                          }
                        >
                          {
                            checkpoint.title
                          }
                        </Text>

                        <Text
                          style={
                            styles
                              .checkpointSubtitle
                          }
                        >
                          {
                            checkpoint.subtitle
                          }
                        </Text>

                        {isUnlocked ? (
                          <Text
                            style={
                              styles
                                .checkpointStory
                            }
                          >
                            {checkpoint.story ||
                              checkpoint.description}
                          </Text>
                        ) : (
                          <Text
                            style={
                              styles
                                .checkpointLockedText
                            }
                          >
                            Reach checkpoint{" "}
                            {
                              checkpointNumber
                            }{" "}
                            to unlock this
                            story.
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            <TouchableOpacity
              style={
                styles.progressButton
              }
              onPress={
                continueWalking
              }
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.progressButtonText
                }
              >
                Continue Walking
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(2,4,10,0.80)",
  },

  safe: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 190,
  },

  xpReward: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "#D4AF37",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    zIndex: 99,

    shadowColor: "#D4AF37",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },

  xpRewardText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor:
      "rgba(8,18,37,0.86)",
    borderWidth: 1,
    borderColor:
      "rgba(167,243,208,0.45)",
    marginBottom: 26,
  },

  backText: {
    color: "#A7F3D0",
    fontSize: 19,
    fontWeight: "900",
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },

  journeyTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 47,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 12,
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 29,
    marginBottom: 28,
  },

  heroCard: {
    backgroundColor:
      "rgba(8,18,37,0.96)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor:
      "rgba(167,243,208,0.30)",
    marginBottom: 24,
  },

  heroLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 12,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 44,
    marginBottom: 18,
  },

  heroText: {
    color: "#CBD5E1",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 22,
  },

  storyLevelCard: {
    backgroundColor:
      "rgba(2,6,23,0.65)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.35)",
  },

  storyLevelText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  storyXPText: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 10,
  },

  storyXPTrack: {
    height: 10,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },

  storyXPFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#D4AF37",
  },

  naturalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(79,255,210,0.12)",
    borderWidth: 1,
    borderColor: "#4FFFD2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 18,
  },

  naturalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4FFFD2",
    marginRight: 9,
  },

  naturalBadgeText: {
    color: "#4FFFD2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  audioButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  audioButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  loadingButton: {
    backgroundColor:
      "rgba(167,243,208,0.72)",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  loadingText: {
    color: "#020617",
    fontSize: 17,
    fontWeight: "900",
  },

  audioControlRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  audioMiniButton: {
    flex: 1,
    backgroundColor: "#A7F3D0",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 5,
  },

  stopButton: {
    backgroundColor: "#FF5252",
  },

  audioMiniText: {
    color: "#020617",
    fontSize: 17,
    fontWeight: "900",
  },

  narrationProgressTrack: {
    height: 10,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    overflow: "hidden",
    marginTop: 14,
  },

  narrationProgressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#D4AF37",
  },

  shareButton: {
    marginTop: 14,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor:
      "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.18)",
  },

  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  audioPanel: {
    backgroundColor:
      "rgba(2,6,23,0.72)",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.35)",
  },

  audioPanelTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  naturalVoiceDescription: {
    color: "#AEBBD0",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },

  controlTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 18,
    marginBottom: 10,
  },

  speedRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  speedButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,0.10)",
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.12)",
  },

  speedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  controlButtonActive: {
    backgroundColor:
      "rgba(212,175,55,0.35)",
    borderColor: "#D4AF37",
  },

  transcriptCard: {
    backgroundColor:
      "rgba(2,6,23,0.68)",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor:
      "rgba(167,243,208,0.22)",
  },

  transcriptLabel: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  transcriptText: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 27,
  },

  checkpointsSection: {
    marginTop: 24,
    padding: 20,
    paddingBottom: 28,
    backgroundColor:
      "rgba(4,15,35,0.96)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor:
      "rgba(212,175,55,0.45)",
  },

  checkpointsTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 22,
  },

  checkpointCard: {
    flexDirection: "row",
    marginBottom: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#07152B",
    borderWidth: 1,
    borderColor:
      "rgba(132,159,197,0.35)",
  },

  checkpointCardCurrent: {
    borderColor: "#D9B52F",
    borderWidth: 2,
    backgroundColor: "#0A1930",
  },

  checkpointCardLocked: {
    opacity: 0.55,
  },

  checkpointNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#D9B52F",
  },

  checkpointNumberComplete: {
    backgroundColor: "#4FFFD2",
  },

  checkpointNumberLocked: {
    backgroundColor: "#17243A",
    borderWidth: 1,
    borderColor: "#53627A",
  },

  checkpointNumberText: {
    color: "#061126",
    fontSize: 22,
    fontWeight: "900",
  },

  checkpointContent: {
    flex: 1,
  },

  checkpointStatus: {
    color: "#D9B52F",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.7,
    marginBottom: 8,
  },

  checkpointTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 5,
  },

  checkpointSubtitle: {
    color: "#9EF2D0",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },

  checkpointStory: {
    color: "#D6DEEC",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
  },

  checkpointLockedText: {
    color: "#91A0B7",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },

  progressButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 30,
  },

  progressButtonText: {
    color: "#020617",
    fontSize: 22,
    fontWeight: "900",
  },
});