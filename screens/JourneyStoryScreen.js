import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Share,
} from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {getJourneyStory,} from "../data/journeyStories";
import {
  getJourneyProgress,
} from "../utils/journeyProgress";
export default function JourneyStoryScreen({
  route,
  goBack,
  goToProgress,
  lifetimeSteps = 0,
  subscriptionPlan = "free",
}) {
  const routeJourney = route?.params?.journey || null;

  const selectedJourneyId =
    routeJourney?.id ||
    routeJourney?.journeyId ||
    routeJourney?.routeKey ||
    routeJourney?.slug ||
    routeJourney?.title ||
    "selma";

  const storyData = getJourneyStory(
    selectedJourneyId
  );

  const requestedCheckpoint = Math.min(
    5,
    Math.max(
      1,
      Number(route?.params?.checkpoint || 1)
    )
  );

  const [isNarrating, setIsNarrating] =
    useState(false);



  const [isPaused, setIsPaused] = useState(false);
  const [voiceRate, setVoiceRate] = useState(0.82);
  const [narratorType, setNarratorType] = useState("classic");
  const [narrationLanguage, setNarrationLanguage] = useState("en-US");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showEliteUpsell, setShowEliteUpsell] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [narrationProgress, setNarrationProgress] = useState(0);
  const [listenedChapters, setListenedChapters] = useState([]);
  const [storyXP, setStoryXP] = useState(0);
  const [showXPReward, setShowXPReward] = useState(false);
const [journeyProgress, setJourneyProgress] = useState(null);
  const isPremium =
    subscriptionPlan === "premium" ||
    subscriptionPlan === "legendary" ||
    subscriptionPlan === "elite";

  const isElite =
    subscriptionPlan === "legendary" || subscriptionPlan === "elite";

  const celebrityNarratorLocked = !isElite;

  React.useEffect(() => {
    loadNarrationSettings();
    loadListenedChapters();
    loadStoryXP();

    return () => {
      Speech.stop();
    };
  }, []);

  React.useEffect(() => {
    saveNarrationSettings();
  }, [voiceRate, narratorType, narrationLanguage, musicEnabled]);

  async function loadNarrationSettings() {
    try {
      const saved = await AsyncStorage.getItem("journeyNarrationSettings");

      if (saved) {
        const settings = JSON.parse(saved);

        setVoiceRate(settings.voiceRate || 0.82);
        setNarratorType(settings.narratorType || "classic");
        setNarrationLanguage(settings.narrationLanguage || "en-US");
        setMusicEnabled(settings.musicEnabled || false);
      }
    } catch (error) {
      console.log("Load narration settings error:", error);
    }
  }

  async function saveNarrationSettings() {
    try {
      await AsyncStorage.setItem(
        "journeyNarrationSettings",
        JSON.stringify({
          voiceRate,
          narratorType,
          narrationLanguage,
          musicEnabled,
        })
      );
    } catch (error) {
      console.log("Save narration settings error:", error);
    }
  }

  async function loadListenedChapters() {
    try {
      const saved = await AsyncStorage.getItem("listenedJourneyChapters");
      setListenedChapters(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.log("Load listened chapters error:", error);
    }
  }

  async function loadStoryXP() {
    try {
      const saved = await AsyncStorage.getItem("storyXP");
      setStoryXP(Number(saved || 0));
    } catch (error) {
      console.log("Load story XP error:", error);
    }
  }
const safeJourneyId = selectedJourneyId || "selma";

  

React.useEffect(() => {
  let mounted = true;

  async function loadProgress() {
    try {
      const savedProgress =
        await getJourneyProgress(selectedJourneyId);

      if (mounted) {
        setJourneyProgress(savedProgress);
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

const checkpoints = useMemo(() => {
  const chapters = storyData?.chapters || [];

  return chapters.map((chapter, index) => {
    const checkpointNumber = index + 1;

    const requiredSteps =
      Number(
        routeJourney?.checkpointSteps?.[index]
      ) ||
      Number(
        routeJourney?.stepsPerCheckpoint
      ) * checkpointNumber ||
      checkpointNumber * 1000;

   const unlocked =
  checkpointNumber === 1 ||
  journeyProgress?.isComplete === true ||
  journeyProgress?.completedCheckpoints?.includes(
    checkpointNumber
  ) ||
  journeyProgress?.storiesUnlocked?.includes(
    checkpointNumber
  ) ||
  Number(
    journeyProgress?.currentCheckpoint || 0
  ) >= checkpointNumber;
    const completed =
      listenedChapters.includes(
        chapter.id
      );

    return {
      ...chapter,

      id:
        chapter.id ||
        `${storyData?.id || "journey"}-${checkpointNumber}`,

      number: checkpointNumber,
      checkpoint: checkpointNumber,

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
  });
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
  storyChapters.find((item, index) => {
    const chapterNumber = Number(
      item?.checkpoint ??
      item?.number ??
      index + 1
    );

    return (
      chapterNumber === requestedCheckpoint
    );
  }) || null;

const currentChapter =
  requestedChapter ||
  storyChapters[requestedCheckpoint - 1] ||
  checkpoints.find((item, index) => {
    const chapterNumber = Number(
      item?.checkpoint ??
      item?.number ??
      index + 1
    );

    return (
      chapterNumber === requestedCheckpoint
    );
  }) ||
  checkpoints[requestedCheckpoint - 1] ||
  checkpoints[0] || {
    id: `journey-start-${requestedCheckpoint}`,
    number: requestedCheckpoint,
    checkpoint: requestedCheckpoint,
    title: "Journey Start",
    subtitle: "The Journey Begins",
    story:
      "Begin walking to unlock this journey’s story.",
    premiumNarration:
      "Begin walking to unlock this journey’s narration.",
    xp: 0,
    requiredSteps: 0,
    unlocked: true,
    completed: false,
  };
const journeyLocation = [
  storyData?.location,
  storyData?.country,
]
  .filter(Boolean)
  .join(" • ");

const journeyTitle =
  storyData?.title ||
  routeJourney?.title ||
  routeJourney?.name ||
  "Legacy Journey";

const journeySubtitle =
  storyData?.subtitle ||
  routeJourney?.subtitle ||
  "";

const journeyIntroduction =
  storyData?.introduction ||
  routeJourney?.description ||
  "Walk to unlock this journey one checkpoint at a time.";
const chapterTitle =
  currentChapter?.subtitle ||
  currentChapter?.title ||
  "The Journey Begins";

const chapterLocation =
  currentChapter?.title ||
  currentChapter?.location ||
  `Checkpoint ${currentChapter?.number || 1}`;

const chapterStory =
  currentChapter?.story ||
  currentChapter?.description ||
  "Begin walking to unlock this chapter.";

const chapterNarration =
  currentChapter?.premiumNarration ||
  currentChapter?.narration ||
  chapterStory;


const storyLevel = Math.max(
  1,
  Math.floor(storyXP / 100) + 1
);

const storyXPProgress =
  storyXP % 100;

  const isSpeed = (rate) => voiceRate === rate;
  const isNarrator = (type) => narratorType === type;

  const narrationText = isPremium
  ? chapterNarration
  : `${chapterLocation}. ${chapterTitle}. ${chapterStory}`;

  const getPitch = () => {
    if (narratorType === "deep") return 0.75;
    if (narratorType === "bright") return 1.15;
    if (narratorType === "celebrity") return 0.9;
    return 0.95;
  };

  const finishNarration = async () => {
    setIsNarrating(false);
    setIsPaused(false);
    setNarrationProgress(0);

    if (!listenedChapters.includes(currentChapter.id)) {
      const updatedChapters = [...listenedChapters, currentChapter.id];

      setListenedChapters(updatedChapters);

      await AsyncStorage.setItem(
        "listenedJourneyChapters",
        JSON.stringify(updatedChapters)
      );

      const updatedXP = storyXP + 25;

      setStoryXP(updatedXP);
      await AsyncStorage.setItem("storyXP", String(updatedXP));

      setShowXPReward(true);

      setTimeout(() => {
        setShowXPReward(false);
      }, 2500);
    }
  };

  const playNarration = () => {
    Speech.stop();

    setIsNarrating(true);
    setIsPaused(false);
    setNarrationProgress(0);

    let progress = 0;

    const progressTimer = setInterval(() => {
      progress += 5;
      setNarrationProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(progressTimer);
      }
    }, 1000);

    Speech.speak(narrationText, {
      language: narrationLanguage,
      pitch: getPitch(),
      rate: voiceRate,
      onDone: async () => {
        clearInterval(progressTimer);
        await finishNarration();
      },
      onStopped: () => {
        clearInterval(progressTimer);
        setIsNarrating(false);
        setIsPaused(false);
        setNarrationProgress(0);
      },
      onError: () => {
        clearInterval(progressTimer);
        setIsNarrating(false);
        setIsPaused(false);
        setNarrationProgress(0);
      },
    });
  };

  const pauseNarration = async () => {
    if (Speech.pause) {
      await Speech.pause();
      setIsPaused(true);
    } else {
      Speech.stop();
      setIsNarrating(false);
      setIsPaused(false);
    }
  };

  const resumeNarration = async () => {
    if (Speech.resume) {
      await Speech.resume();
      setIsPaused(false);
    } else {
      playNarration();
    }
  };

  const stopNarration = () => {
    Speech.stop();
    setIsNarrating(false);
    setIsPaused(false);
    setNarrationProgress(0);
  };

  const shareChapter = async () => {
    await Share.share({
      message: `I unlocked "${currentChapter.subtitle}" on Legathon Walk. ${currentChapter.story}`,
    });
  };

  const getStatus = (checkpoint) => {
    if (listenedChapters.includes(checkpoint.id)) {
      return "🎧 NARRATION COMPLETE";
    }

    if (checkpoint.completed) return "✓ COMPLETED";
    if (checkpoint.unlocked) return "UNLOCKED";
    return "LOCKED";
  };

  return (
   <ImageBackground
  source={
    routeJourney?.background ||
    routeJourney?.image ||
    storyData?.background ||
    require("../assets/collage-background.png")
  }
  style={styles.background}
  resizeMode="cover"
>
      <View style={styles.overlay}>
        {showXPReward && (
          <View style={styles.xpReward}>
            <Text style={styles.xpRewardText}>+25 Story XP</Text>
          </View>
        )}

        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.kicker}>JOURNEY STORY</Text>
     <Text style={styles.journeyTitle}>
  {journeyTitle}
</Text>

            <Text style={styles.subtitle}>
              Unlock the story one checkpoint at a time as your real-world steps
              move you through the route.
            </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>CURRENT CHAPTER</Text>
              <Text style={styles.heroTitle}>{currentChapter.subtitle}</Text>

              <View style={styles.storyLevelCard}>
                <Text style={styles.storyLevelText}>Story Level {storyLevel}</Text>

                <Text style={styles.storyXPText}>
                  {storyXPProgress}/100 XP
                </Text>

                <View style={styles.storyXPTrack}>
                  <View
                    style={[
                      styles.storyXPFill,
                      { width: `${storyXPProgress}%` },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.heroText}>{currentChapter.story}</Text>

              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>
                  {isPremium ? "ELITE AUDIO EXPERIENCE" : "FREE NARRATION"}
                </Text>
              </View>

              {!isNarrating ? (
                <TouchableOpacity style={styles.audioButton} onPress={playNarration}>
                  <Text style={styles.audioButtonText}>
                    {isPremium ? "🎙 Premium Narration" : "▶ Play Narration"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.audioControlRow}>
                  <TouchableOpacity
                    style={styles.audioMiniButton}
                    onPress={isPaused ? resumeNarration : pauseNarration}
                  >
                    <Text style={styles.audioMiniText}>
                      {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.audioMiniButton, styles.stopButton]}
                    onPress={stopNarration}
                  >
                    <Text style={styles.audioMiniText}>⏹ Stop</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isNarrating && (
                <View style={styles.narrationProgressTrack}>
                  <View
                    style={[
                      styles.narrationProgressFill,
                      { width: `${narrationProgress}%` },
                    ]}
                  />
                </View>
              )}

              <TouchableOpacity style={styles.shareButton} onPress={shareChapter}>
                <Text style={styles.shareButtonText}>📤 Share Chapter</Text>
              </TouchableOpacity>

              <View style={styles.audioPanel}>
                <Text style={styles.audioPanelTitle}>Audio Experience</Text>

                <Text style={styles.controlTitle}>Speed</Text>

                <View style={styles.speedRow}>
                  <TouchableOpacity
                    style={[
                      styles.speedButton,
                      isSpeed(0.7) && styles.controlButtonActive,
                    ]}
                    onPress={() => setVoiceRate(0.7)}
                  >
                    <Text style={styles.speedText}>Slow</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.speedButton,
                      isSpeed(0.82) && styles.controlButtonActive,
                    ]}
                    onPress={() => setVoiceRate(0.82)}
                  >
                    <Text style={styles.speedText}>Normal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.speedButton,
                      isSpeed(1.0) && styles.controlButtonActive,
                    ]}
                    onPress={() => setVoiceRate(1.0)}
                  >
                    <Text style={styles.speedText}>Fast</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.controlTitle}>Narrator</Text>

                <View style={styles.narratorRow}>
                  <TouchableOpacity
                    style={[
                      styles.narratorButton,
                      isNarrator("classic") && styles.controlButtonActive,
                    ]}
                    onPress={() => setNarratorType("classic")}
                  >
                    <Text style={styles.narratorText}>Classic</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.narratorButton,
                      isNarrator("deep") && styles.controlButtonActive,
                    ]}
                    onPress={() => setNarratorType("deep")}
                  >
                    <Text style={styles.narratorText}>Deep</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.narratorButton,
                      isNarrator("bright") && styles.controlButtonActive,
                    ]}
                    onPress={() => setNarratorType("bright")}
                  >
                    <Text style={styles.narratorText}>Bright</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.celebrityButton,
                    celebrityNarratorLocked && styles.lockedNarratorButton,
                    isNarrator("celebrity") && styles.controlButtonActive,
                  ]}
                  onPress={() => {
                    if (celebrityNarratorLocked) {
                      setShowEliteUpsell(true);
                      return;
                    }

                    setNarratorType("celebrity");
                  }}
                >
                  <Text style={styles.narratorText}>
                    {celebrityNarratorLocked ? "🔒 Celebrity" : "⭐ Celebrity"}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.controlTitle}>Narration Language</Text>

                <View style={styles.languageRow}>
                  <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setNarrationLanguage("en-US")}
                  >
                    <Text style={styles.languageText}>🇺🇸 English</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setNarrationLanguage("es-ES")}
                  >
                    <Text style={styles.languageText}>🇪🇸 Español</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.languageRow}>
                  <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setNarrationLanguage("fr-FR")}
                  >
                    <Text style={styles.languageText}>🇫🇷 Français</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setNarrationLanguage("de-DE")}
                  >
                    <Text style={styles.languageText}>🇩🇪 Deutsch</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.musicCard}>
                  <Text style={styles.controlTitle}>Background Music</Text>

                  <TouchableOpacity
                    style={[
                      styles.musicButton,
                      musicEnabled && styles.musicButtonActive,
                    ]}
                    onPress={() => setMusicEnabled(!musicEnabled)}
                  >
                    <Text style={styles.musicText}>
                      {musicEnabled ? "🎵 Music On" : "🎵 Music Off"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.transcriptCard}>
                <Text style={styles.transcriptText}>
  {chapterNarration}
</Text>
                <Text style={styles.transcriptText}>{narrationText}</Text>
              </View>
            </View>
<View style={styles.checkpointsSection}>
  <Text style={styles.checkpointsTitle}>
    Story Checkpoints
  </Text>

 {checkpoints.map((checkpoint, index) => {
  const checkpointNumber = Number(
    checkpoint.checkpoint ||
      checkpoint.number ||
      index + 1
  );

  const isCurrent =
    checkpointNumber ===
    Number(requestedCheckpoint);

  const isUnlocked =
    checkpoint.unlocked || isCurrent;

  const isCompleted =
    checkpoint.completed ||
    listenedChapters.includes(checkpoint.id);

  return (
    <View
      key={
        checkpoint.id ||
        `checkpoint-${checkpointNumber}`
      }
      style={[
        styles.checkpointCard,
        isCurrent &&
          styles.checkpointCardCurrent,
        !isUnlocked &&
          styles.checkpointCardLocked,
      ]}
    >
      <View
        style={[
          styles.checkpointNumber,
          isCompleted &&
            styles.checkpointNumberComplete,
          !isUnlocked &&
            styles.checkpointNumberLocked,
        ]}
      >
        {isUnlocked ? (
          <Text style={styles.checkpointNumberText}>
            {checkpointNumber}
          </Text>
        ) : (
          <Ionicons
            name="lock-closed"
            size={21}
            color="#94A1B3"
          />
        )}
      </View>

      <View style={styles.checkpointContent}>
        <Text style={styles.checkpointStatus}>
          {isCompleted
            ? "NARRATION COMPLETE"
            : isCurrent
              ? "CURRENT CHAPTER"
              : isUnlocked
                ? "UNLOCKED"
                : "LOCKED"}
        </Text>

        <Text style={styles.checkpointTitle}>
          {checkpoint.title}
        </Text>

        <Text style={styles.checkpointSubtitle}>
          {checkpoint.subtitle}
        </Text>

        {isUnlocked ? (
          <Text style={styles.checkpointStory}>
            {checkpoint.story ||
              checkpoint.description}
          </Text>
        ) : (
          <Text style={styles.checkpointLockedText}>
            Reach checkpoint {checkpointNumber} to
            unlock this story.
          </Text>
        )}
      </View>
    </View>
  );
})}
</View>

         <TouchableOpacity
  style={styles.progressButton}
  activeOpacity={0.85}
  onPress={() => {
    const journeyToContinue =
      routeJourney && typeof routeJourney === "object"
        ? routeJourney
        : storyData && typeof storyData === "object"
          ? {
              ...storyData,
              id:
                storyData.id ||
                routeJourney?.id ||
                "",
            }
          : null;

    if (typeof goToProgress === "function") {
      goToProgress(journeyToContinue);
    } else if (typeof goBack === "function") {
      goBack();
    }
  }}
>
  <Text style={styles.progressButtonText}>
    Continue Walking
  </Text>
</TouchableOpacity>


          </ScrollView>
        </SafeAreaView>

        <Modal transparent visible={showEliteUpsell} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.unlockModal}>
              <Text style={styles.unlockBadge}>ELITE FEATURE</Text>
              <Text style={styles.unlockTitle}>Celebrity Narrators</Text>

              <Text style={styles.unlockText}>
                Upgrade to Elite to unlock celebrity-style narration, cinematic
                audio, and premium journey storytelling.
              </Text>

              <TouchableOpacity
                style={styles.unlockButton}
                onPress={() => setShowEliteUpsell(false)}
              >
                <Text style={styles.unlockButtonText}>Got It</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#020617" },
  overlay: { flex: 1, backgroundColor: "rgba(2,4,10,0.78)" },
  safe: { flex: 1 },
  content: { padding: 22, paddingBottom: 190 },

  xpReward: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "#D4AF37",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    zIndex: 99,
  },
  xpRewardText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
checkpointsSection: {
  marginTop: 24,
  marginHorizontal: 18,
  padding: 20,
  paddingBottom: 28,
  backgroundColor: "rgba(4, 15, 35, 0.96)",
  borderRadius: 28,
  borderWidth: 1,
  borderColor: "rgba(212, 175, 55, 0.45)",
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
  borderColor: "rgba(132, 159, 197, 0.35)",
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
  letterSpacing: 2,
  marginBottom: 8,
},

checkpointTitle: {
  color: "#FFFFFF",
  fontSize: 25,
  fontWeight: "900",
  marginBottom: 5,
},

checkpointSubtitle: {
  color: "#9EF2D0",
  fontSize: 18,
  fontWeight: "800",
  marginBottom: 10,
},

checkpointStory: {
  color: "#D6DEEC",
  fontSize: 16,
  lineHeight: 25,
  fontWeight: "600",
},
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(8,18,37,0.86)",
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.45)",
    marginBottom: 26,
  },
  backText: { color: "#A7F3D0", fontSize: 19, fontWeight: "900" },

  kicker: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
    marginBottom: 18,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 28,
  },

  heroCard: {
    backgroundColor: "rgba(8,18,37,0.94)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.3)",
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
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 48,
    marginBottom: 18,
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 22,
  },

  storyLevelCard: {
    backgroundColor: "rgba(2,6,23,0.65)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
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
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  storyXPFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#D4AF37",
  },

  premiumBadge: {
    backgroundColor: "rgba(212,175,55,0.16)",
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  premiumBadgeText: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  audioButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
  },
  audioButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
  },
  audioControlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  audioMiniButton: {
    flex: 1,
    backgroundColor: "#A7F3D0",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  stopButton: { backgroundColor: "#FF5252" },
  audioMiniText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },

  narrationProgressTrack: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  audioPanel: {
    backgroundColor: "rgba(2,6,23,0.72)",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
  },
  audioPanelTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
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
    justifyContent: "space-between",
  },
  speedButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  speedText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  narratorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  narratorButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.16)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
  },
  celebrityButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.16)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
  },
  narratorText: { color: "#D4AF37", fontSize: 14, fontWeight: "900" },
  lockedNarratorButton: {
    opacity: 0.45,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  controlButtonActive: {
    backgroundColor: "rgba(212,175,55,0.35)",
    borderColor: "#D4AF37",
  },

  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  languageButton: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  languageText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

  musicCard: { marginTop: 16 },
  musicButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  musicButtonActive: {
    backgroundColor: "rgba(212,175,55,0.18)",
    borderColor: "#D4AF37",
  },
  musicText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  transcriptCard: {
    backgroundColor: "rgba(2,6,23,0.68)",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
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
    fontWeight: "800",
    lineHeight: 27,
  },

  timelineCard: {
    backgroundColor: "rgba(8,18,37,0.94)",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 26,
  },
  storyRow: { flexDirection: "row" },
  timelineLeft: { width: 76, alignItems: "center" },
  timelineDot: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  timelineDotUnlocked: { backgroundColor: "#D4AF37" },
  timelineDotLocked: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderColor: "rgba(203,213,225,0.25)",
  },
  timelineDotText: {
    color: "#020617",
    fontSize: 24,
    fontWeight: "900",
  },
  timelineLine: {
    width: 4,
    flex: 1,
    minHeight: 110,
    backgroundColor: "rgba(167,243,208,0.45)",
    marginVertical: 8,
  },
  storyCard: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.76)",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.55)",
    marginBottom: 26,
  },
  storyCardLocked: {
    opacity: 0.52,
    borderColor: "rgba(203,213,225,0.18)",
  },
  storyCardNarrationComplete: {
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  storyStatus: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  storyTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  storySubtitle: {
    color: "#A7F3D0",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 18,
  },
  storyText: {
    color: "#CBD5E1",
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 32,
  },
  listenedText: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 10,
  },

  progressButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  progressButtonText: {
    color: "#020617",
    fontSize: 22,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: 24,
  },
  unlockModal: {
    backgroundColor: "#081225",
    borderRadius: 30,
    padding: 24,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },
  unlockBadge: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 12,
  },
  unlockTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 14,
  },
  unlockText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 20,
  },
  unlockButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  lockedTitle: {
  fontSize: 34,
  lineHeight: 40,
},
continueButton: {
  marginBottom: 120,
},
  unlockButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
  content: {
  paddingBottom: 180,
},
});
