import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../lib/supabase";

import {
  speakCoachVoice,
  stopCoachVoice,
} from "../utils/coachVoice";

const CONVERSATION_STORAGE_KEY =
  "legathonAIConversationMessages";

const COACH_MEMORY_KEY =
  "legathonAICoachMemory";

const STARTER_MESSAGES = [
  {
    id: "welcome",
    sender: "coach",
    text:
      "Welcome. I’m your Legathon AI Wellness Coach. I can help with walking, recovery, hydration, meals, sleep, breathing, and your active Legathon Journey.",
    actionIntent: null,
  },
];

const INITIAL_MEMORY = {
  preferredWalkTime: "",
  mealPreference: "",
  favoriteBreathing: "",
};

const QUICK_PROMPTS = [
  {
    id: "walk",
    label: "Plan today’s walk",
    icon: "walk",
  },
  {
    id: "recovery",
    label: "Help me recover",
    icon: "heart",
  },
  {
    id: "meal",
    label: "Build a meal plan",
    icon: "restaurant",
  },
  {
    id: "hydration",
    label: "Check hydration",
    icon: "water",
  },
  {
    id: "sleep",
    label: "Improve sleep",
    icon: "moon",
  },
  {
    id: "stress",
    label: "Reduce stress",
    icon: "leaf",
  },
  {
    id: "journey",
    label: "Coach my journey",
    icon: "map",
  },
  {
    id: "progress",
    label: "Review progress",
    icon: "stats-chart",
  },
];

function safeNumber(
  value,
  fallback = 0
) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function safelyParseJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log(
      "JSON parse error:",
      error
    );

    return fallback;
  }
}

function getDayGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function detectNavigationIntent(
  text,
  wellness
) {
  const value =
    String(text || "").toLowerCase();

  if (
    value.includes("meal planner") ||
    value.includes("meal plan") ||
    value.includes("build a meal")
  ) {
    return "meal";
  }

  if (
    value.includes("hydration") ||
    value.includes("water")
  ) {
    return "hydration";
  }

  if (
    value.includes("recovery") ||
    value.includes("recover")
  ) {
    return "recovery";
  }

  if (
    value.includes("sleep") ||
    value.includes("tired")
  ) {
    return "sleep";
  }

  if (
    value.includes("stress") ||
    value.includes("calm") ||
    value.includes("breathing")
  ) {
    return "breathing";
  }

  if (
    value.includes("start walk") ||
    value.includes(
      "continue journey"
    ) ||
    value.includes("gps")
  ) {
    return wellness?.journey
      ? "journeyMap"
      : "journeys";
  }

  return null;
}

function detectMemoryUpdate(text) {
  const original =
    String(text || "").trim();

  const lower =
    original.toLowerCase();

  if (
    lower.includes(
      "i like to walk at"
    )
  ) {
    return {
      preferredWalkTime:
        original
          .split(
            /i like to walk at/i
          )[1]
          ?.trim() || "",
    };
  }

  if (
    lower.includes(
      "my meal preference is"
    )
  ) {
    return {
      mealPreference:
        original
          .split(
            /my meal preference is/i
          )[1]
          ?.trim() || "",
    };
  }

  if (
    lower.includes(
      "my favorite breathing exercise is"
    )
  ) {
    return {
      favoriteBreathing:
        original
          .split(
            /my favorite breathing exercise is/i
          )[1]
          ?.trim() || "",
    };
  }

  return null;
}

function createLocalCoachReply(
  message,
  context = {}
) {
  const value =
    String(message || "").toLowerCase();

  const steps =
    safeNumber(context.steps, 0);

  const stepGoal = Math.max(
    1,
    safeNumber(context.stepGoal, 7000)
  );

  const hydration =
    safeNumber(context.hydration, 0);

  const hydrationGoal = Math.max(
    1,
    safeNumber(context.hydrationGoal, 100)
  );

  const recovery =
    context.recovery !== null &&
    context.recovery !== undefined
      ? safeNumber(context.recovery)
      : null;

  const sleepHours =
    context.sleepHours !== null &&
    context.sleepHours !== undefined
      ? safeNumber(context.sleepHours)
      : null;

  const journey =
    context.journey || "";

  const journeyProgress =
    safeNumber(
      context.journeyProgress,
      0
    );

  const checkpoint =
    context.checkpoint || "";

  const coachMemory =
    context.coachMemory || {};

  const stepsRemaining =
    Math.max(
      stepGoal - steps,
      0
    );

  if (
    value.includes("when should i walk") &&
    coachMemory.preferredWalkTime
  ) {
    return (
      `You prefer walking at ` +
      `${coachMemory.preferredWalkTime}. ` +
      `That remains a good time if your schedule and conditions allow.`
    );
  }

  if (
    value.includes("walk") ||
    value.includes("steps")
  ) {
    if (journey) {
      return (
        `Continue your ${journey} journey. ` +
        `You are ${Math.round(
          journeyProgress
        )}% complete` +
        `${
          checkpoint
            ? ` and currently at checkpoint ${checkpoint}`
            : ""
        }. Begin at a comfortable pace and build momentum gradually.`
      );
    }

    if (stepsRemaining === 0) {
      return (
        "You completed today’s step goal. " +
        "A short recovery walk is optional if you still feel well."
      );
    }

    return (
      `You are ${stepsRemaining.toLocaleString()} steps ` +
      `from today’s goal. Start with a comfortable ` +
      `15-minute walk and reassess how you feel afterward.`
    );
  }

  if (
    value.includes("recover") ||
    value.includes("recovery")
  ) {
    if (recovery !== null) {
      return (
        `Your current recovery score is ${Math.round(
          recovery
        )}%. Prioritize hydration, protein, gentle movement, and quality sleep.`
      );
    }

    return (
      "Recovery has not been recorded yet. " +
      "Check your energy, soreness, hydration, and sleep " +
      "before choosing today’s walking intensity."
    );
  }

  if (
    value.includes("meal") ||
    value.includes("food") ||
    value.includes("eat")
  ) {
    const preference =
      coachMemory.mealPreference;

    return preference
      ? `Your saved meal preference is ${preference}. Build today’s meals around lean protein, vegetables, a quality carbohydrate, and healthy fat.`
      : "Build your plate around lean protein, vegetables, a quality carbohydrate, and healthy fat. Open the Meal Planner for a complete daily plan.";
  }

  if (
    value.includes("water") ||
    value.includes("hydration")
  ) {
    const remaining = Math.max(
      hydrationGoal - hydration,
      0
    );

    return remaining > 0
      ? `You have ${Math.round(
          remaining
        )} ounces remaining toward today’s hydration goal. Drink gradually throughout the day.`
      : "You reached today’s hydration goal. Continue drinking according to thirst, activity, and weather.";
  }

  if (
    value.includes("sleep") ||
    value.includes("tired")
  ) {
    if (sleepHours !== null) {
      return (
        `You recorded ${sleepHours.toFixed(
          1
        )} hours of sleep. Keep your bedtime consistent and reduce bright screens before bed tonight.`
      );
    }

    return (
      "Sleep has not been recorded yet. " +
      "Aim for a consistent bedtime, a cool dark room, " +
      "and a calm wind-down routine."
    );
  }

  if (
    value.includes("stress") ||
    value.includes("calm") ||
    value.includes("breath")
  ) {
    if (
      coachMemory.favoriteBreathing
    ) {
      return (
        `Your favorite exercise is ${coachMemory.favoriteBreathing}. ` +
        `Use it now for several slow rounds while keeping your shoulders relaxed.`
      );
    }

    return (
      "Try four rounds of breathing: inhale for four seconds, " +
      "hold for four, exhale for six, then pause briefly before repeating."
    );
  }

  if (
    value.includes("journey") ||
    value.includes("checkpoint")
  ) {
    return journey
      ? `Your active journey is ${journey}. You are ${Math.round(
          journeyProgress
        )}% complete${
          checkpoint
            ? ` at checkpoint ${checkpoint}`
            : ""
        }.`
      : "You do not have an active journey yet. Open Journeys to choose one and begin GPS coaching.";
  }

  if (
    value.includes("progress") ||
    value.includes("summary")
  ) {
    return (
      `Today you have ${steps.toLocaleString()} steps toward your ` +
      `${stepGoal.toLocaleString()}-step goal. Hydration is ` +
      `${Math.round(
        hydration
      )} of ${Math.round(
        hydrationGoal
      )} ounces` +
      `${
        journey
          ? `. Your ${journey} journey is ${Math.round(
              journeyProgress
            )}% complete.`
          : "."
      }`
    );
  }

  return (
    "I can help with walking, recovery, meals, hydration, " +
    "sleep, breathing, journey coaching, and progress reviews. " +
    "What would you like to improve today?"
  );
}

function MemoryInput({
  icon,
  label,
  value,
  placeholder,
  onChangeText,
}) {
  return (
    <View style={styles.memoryInputRow}>
      <View style={styles.memoryIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#42F58D"
        />
      </View>

      <View style={styles.memoryInputWrap}>
        <Text style={styles.memoryLabel}>
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#687D96"
          style={styles.memoryInput}
        />
      </View>
    </View>
  );
}

export default function AIConversationScreen({
  goBack,
  wellness = {},
  goToGPSJourneyMap,
  goToJourneys,
  goToMealPlanner,
  goToHydration,
  goToRecovery,
  goToSleep,
  goToBreathing,
}) {
  const [messages, setMessages] =
    useState(STARTER_MESSAGES);

  const [draft, setDraft] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [
    pendingAction,
    setPendingAction,
  ] = useState(null);

  const [
    showMemoryPanel,
    setShowMemoryPanel,
  ] = useState(false);

  const [
    coachMemory,
    setCoachMemory,
  ] = useState(INITIAL_MEMORY);

  const [
    memoryDraft,
    setMemoryDraft,
  ] = useState(INITIAL_MEMORY);

  const scrollRef = useRef(null);

  const canSend = useMemo(() => {
    return (
      draft.trim().length > 0 &&
      !isTyping
    );
  }, [draft, isTyping]);

  const mergedWellness =
    useMemo(() => {
      return {
        steps: safeNumber(
          wellness?.steps,
          0
        ),

        stepGoal: Math.max(
          1,
          safeNumber(
            wellness?.stepGoal,
            7000
          )
        ),

        hydration: safeNumber(
          wellness?.hydration,
          0
        ),

        hydrationGoal: Math.max(
          1,
          safeNumber(
            wellness?.hydrationGoal,
            100
          )
        ),

        recovery:
          wellness?.recovery ?? null,

        sleepHours:
          wellness?.sleepHours ?? null,

        journey:
          wellness?.journey || "",

        journeyProgress:
          safeNumber(
            wellness?.journeyProgress,
            0
          ),

        checkpoint:
          wellness?.checkpoint || "",

        coachMemory,
      };
    }, [wellness, coachMemory]);
const scrollToBottom = () => {
  requestAnimationFrame(() => {
    scrollRef.current?.scrollToEnd?.({
      animated: true,
    });
  });
};
  const requestCoachReply =
    async (message) => {
      const { data, error } =
        await supabase.functions.invoke(
          "legathon-ai-coach",
          {
            body: {
              message,
              wellness:
                mergedWellness,
              coachMemory,
              history: messages
                .slice(-12)
                .map((item) => ({
                  sender:
                    item.sender,
                  text: item.text,
                })),
            },
          }
        );

      if (error) {
        throw new Error(
          error.message ||
            "Unable to reach the AI Coach."
        );
      }

      if (!data?.reply) {
        throw new Error(
          data?.error ||
            "The AI Coach returned no response."
        );
      }

      return String(data.reply);
    };

useEffect(() => {
  const loadConversation = async () => {
    try {
      const savedMessages =
        await AsyncStorage.getItem(
          CONVERSATION_STORAGE_KEY
        );

      const parsed = safelyParseJSON(
        savedMessages,
        null
      );

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {
        setMessages(parsed);
      }
    } catch (error) {
      console.log(
        "Coach conversation load error:",
        error
      );
    }
  };

  loadConversation();
}, []);

useEffect(() => {
  const loadMemory = async () => {
    try {
      const savedMemory =
        await AsyncStorage.getItem(
          COACH_MEMORY_KEY
        );

      const parsed = safelyParseJSON(
        savedMemory,
        null
      );

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        const nextMemory = {
          ...INITIAL_MEMORY,
          ...parsed,
        };

        setCoachMemory(nextMemory);
        setMemoryDraft(nextMemory);
      }
    } catch (error) {
      console.log(
        "Coach memory load error:",
        error
      );
    }
  };

  loadMemory();
}, []);

useEffect(() => {
  const saveConversation = async () => {
    try {
      await AsyncStorage.setItem(
        CONVERSATION_STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.log(
        "Coach conversation save error:",
        error
      );
    }
  };

  saveConversation();
}, [messages]);

useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);

useEffect(() => {
  return () => {
    stopCoachVoice();
  };
}, []);

const speakCoachReply = async (text) => {
  if (!text?.trim()) return;

  console.log("Coach voice request started");

  try {
    await speakCoachVoice(text);

    console.log(
      "Coach audio playback started"
    );
  } catch (error) {
    const message =
      error?.message ||
      String(error) ||
      "Unknown voice error";

    console.log(
      "COACH VOICE EXACT ERROR:",
      message
    );

    Alert.alert(
      "Coach Voice Error",
      message
    );
  }
};
      const saveCoachMemory =
    async (updates) => {
      try {
        const nextMemory = {
          ...coachMemory,
          ...updates,
        };

        setCoachMemory(nextMemory);

        await AsyncStorage.setItem(
          COACH_MEMORY_KEY,
          JSON.stringify(nextMemory)
        );
      } catch (error) {
        console.log(
          "Coach memory save error:",
          error
        );
      }
    };

  const saveMemoryPanel =
    async () => {
      await saveCoachMemory({
        preferredWalkTime:
          memoryDraft
            .preferredWalkTime
            .trim(),

        mealPreference:
          memoryDraft
            .mealPreference
            .trim(),

        favoriteBreathing:
          memoryDraft
            .favoriteBreathing
            .trim(),
      });

      setShowMemoryPanel(false);
    };

  const clearCoachMemory = () => {
    Alert.alert(
      "Clear Coach Memory?",
      "This removes the preferences your coach remembers.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",

          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                COACH_MEMORY_KEY
              );

              setCoachMemory(
                INITIAL_MEMORY
              );

              setMemoryDraft(
                INITIAL_MEMORY
              );

              setShowMemoryPanel(false);
            } catch (error) {
              console.log(
                "Clear coach memory error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  const clearConversation = () => {
    Alert.alert(
      "Start New Conversation?",
      "This clears the current coach conversation.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",

          onPress: async () => {
            try {
              stopCoachVoice();

              await AsyncStorage.removeItem(
                CONVERSATION_STORAGE_KEY
              );

              setMessages(
                STARTER_MESSAGES
              );

              setDraft("");
              setIsTyping(false);
              setPendingAction(null);
            } catch (error) {
              console.log(
                "Clear conversation error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  const openDetectedScreen = (
    intent
  ) => {
    stopCoachVoice();

    switch (intent) {
      case "meal":
        goToMealPlanner?.();
        return;

      case "hydration":
        goToHydration?.();
        return;

      case "recovery":
        goToRecovery?.();
        return;

      case "sleep":
        goToSleep?.();
        return;

      case "breathing":
        goToBreathing?.();
        return;

      case "journeyMap":
        goToGPSJourneyMap?.();
        return;

      case "journeys":
        goToJourneys?.();
        return;

      default:
        return;
    }
  };

  const sendMessage = async (
    text = draft
  ) => {
    const cleaned =
      String(text || "").trim();

    if (
      !cleaned ||
      isTyping ||
      cleaned.length > 2000
    ) {
      return;
    }

    const memoryUpdate =
      detectMemoryUpdate(cleaned);

    if (memoryUpdate) {
      await saveCoachMemory(
        memoryUpdate
      );
    }

    const navigationIntent =
      detectNavigationIntent(
        cleaned,
        mergedWellness
      );

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: cleaned,
      actionIntent: null,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setDraft("");
    setIsTyping(true);
    stopCoachVoice();

    try {
      let replyText;

      try {
        replyText =
          await requestCoachReply(
            cleaned
          );
      } catch (remoteError) {
        console.log(
          "Remote AI unavailable. Using local coach:",
          remoteError
        );

        replyText =
          createLocalCoachReply(
            cleaned,
            mergedWellness
          );
      }

      const coachMessage = {
        id: `coach-${Date.now()}`,
        sender: "coach",
        text: replyText,
        actionIntent:
          navigationIntent,
      };

      setMessages((current) => [
        ...current,
        coachMessage,
      ]);

      if (navigationIntent) {
        setPendingAction(
          navigationIntent
        );
      }

      await speakCoachReply(
        replyText
      );
    } catch (error) {
      console.log(
        "Coach response error:",
        error
      );

      setMessages((current) => [
        ...current,
        {
          id:
            `coach-error-` +
            `${Date.now()}`,

          sender: "coach",

          text:
            "I could not prepare that response. Please try again.",

          actionIntent: null,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (
    prompt
  ) => {
    if (isTyping) {
      return;
    }

    sendMessage(prompt.label);
  };

  const toggleListening = () => {
    setIsListening(
      (current) => {
        const next = !current;

        if (next) {
          setDraft(
            "Voice recognition requires a development build."
          );
        }

        return next;
      }
    );
  };

  const openMemoryPanel = () => {
    setMemoryDraft({
      preferredWalkTime:
        coachMemory
          .preferredWalkTime || "",

      mealPreference:
        coachMemory
          .mealPreference || "",

      favoriteBreathing:
        coachMemory
          .favoriteBreathing || "",
    });

    setShowMemoryPanel(true);
  };

  const handleBack = () => {
    stopCoachVoice();
    goBack?.();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? 10
              : 0
          }
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-back"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={styles.headerCenter}
            >
              <Text style={styles.eyebrow}>
                LEGATHON AI WELLNESS
              </Text>

              <Text style={styles.title}>
                Your Coach
              </Text>
            </View>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={openMemoryPanel}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="brain"
                size={23}
                color="#42F58D"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.screenScroll}
            contentContainerStyle={
              styles.screenScrollContent
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={
              scrollToBottom
            }
          >
            {showMemoryPanel && (
              <View
                style={styles.memoryPanel}
              >
                <View
                  style={styles.memoryHeader}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={
                        styles.memoryEyebrow
                      }
                    >
                      AI MEMORY
                    </Text>

                    <Text
                      style={
                        styles.memoryTitle
                      }
                    >
                      What Your Coach
                      Remembers
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.memoryCloseButton
                    }
                    onPress={() =>
                      setShowMemoryPanel(
                        false
                      )
                    }
                  >
                    <Ionicons
                      name="close"
                      size={21}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                <MemoryInput
                  icon="time-outline"
                  label="Preferred Walk Time"
                  value={
                    memoryDraft
                      .preferredWalkTime
                  }
                  placeholder="Example: 7:00 PM"
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,

                        preferredWalkTime:
                          value,
                      })
                    )
                  }
                />

                <MemoryInput
                  icon="restaurant-outline"
                  label="Meal Preference"
                  value={
                    memoryDraft
                      .mealPreference
                  }
                  placeholder="Example: Mediterranean"
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,

                        mealPreference:
                          value,
                      })
                    )
                  }
                />

                <MemoryInput
                  icon="leaf-outline"
                  label="Favorite Breathing Exercise"
                  value={
                    memoryDraft
                      .favoriteBreathing
                  }
                  placeholder="Example: 4-7-8"
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,

                        favoriteBreathing:
                          value,
                      })
                    )
                  }
                />

                <TouchableOpacity
                  style={
                    styles.saveMemoryButton
                  }
                  onPress={
                    saveMemoryPanel
                  }
                >
                  <Ionicons
                    name="save-outline"
                    size={19}
                    color="#02111F"
                  />

                  <Text
                    style={
                      styles.saveMemoryText
                    }
                  >
                    Save Coach Memory
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.clearMemoryButton
                  }
                  onPress={
                    clearCoachMemory
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color="#FF7585"
                  />

                  <Text
                    style={
                      styles.clearMemoryText
                    }
                  >
                    Clear Coach Memory
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={styles.coachStatus}
            >
              <View
                style={styles.coachOrb}
              >
                <MaterialCommunityIcons
                  name="brain"
                  size={34}
                  color="#42F58D"
                />
              </View>

              <View
                style={
                  styles.coachStatusText
                }
              >
                <Text
                  style={styles.coachName}
                >
                  Legathon AI Coach
                </Text>

                <Text
                  style={styles.coachReady}
                >
                  {isTyping
                    ? "Preparing your response"
                    : `${getDayGreeting()} • Ready to help`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={
                  clearConversation
                }
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#9FCBFF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.messages}>
              {messages.map(
                (message) => {
                  const isUser =
                    message.sender ===
                    "user";

                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.messageRow,

                        isUser
                          ? styles.userMessageRow
                          : styles.coachMessageRow,
                      ]}
                    >
                      {!isUser && (
                        <View
                          style={
                            styles.messageAvatar
                          }
                        >
                          <MaterialCommunityIcons
                            name="brain"
                            size={21}
                            color="#42F58D"
                          />
                        </View>
                      )}

                      <View
                        style={[
                          styles.messageBubble,

                          isUser
                            ? styles.userBubble
                            : styles.coachBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,

                            isUser &&
                              styles.userMessageText,
                          ]}
                        >
                          {message.text}
                        </Text>

                        {!isUser &&
                          message.actionIntent && (
                            <TouchableOpacity
                              style={
                                styles.actionButton
                              }
                              onPress={() =>
                                openDetectedScreen(
                                  message.actionIntent
                                )
                              }
                            >
                              <Text
                                style={
                                  styles.actionButtonText
                                }
                              >
                                Open Feature
                              </Text>

                              <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#02111F"
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                  );
                }
              )}

              {isTyping && (
                <View
                  style={[
                    styles.messageRow,
                    styles.coachMessageRow,
                  ]}
                >
                  <View
                    style={
                      styles.messageAvatar
                    }
                  >
                    <MaterialCommunityIcons
                      name="brain"
                      size={21}
                      color="#42F58D"
                    />
                  </View>

                  <View
                    style={[
                      styles.messageBubble,
                      styles.coachBubble,
                    ]}
                  >
                    <Text
                      style={
                        styles.typingText
                      }
                    >
                      Your coach is thinking…
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {pendingAction && (
              <TouchableOpacity
                style={
                  styles.pendingActionButton
                }
                onPress={() =>
                  openDetectedScreen(
                    pendingAction
                  )
                }
              >
                <Text
                  style={
                    styles.pendingActionText
                  }
                >
                  Open Recommended Feature
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#02111F"
                />
              </TouchableOpacity>
            )}

            <Text
              style={styles.quickTitle}
            >
              QUICK COACHING
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.quickPromptRow
              }
            >
              {QUICK_PROMPTS.map(
                (prompt) => (
                  <TouchableOpacity
                    key={prompt.id}
                    style={
                      styles.quickPrompt
                    }
                    onPress={() =>
                      handleQuickPrompt(
                        prompt
                      )
                    }
                    disabled={isTyping}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={prompt.icon}
                      size={19}
                      color="#42F58D"
                    />

                    <Text
                      style={
                        styles.quickPromptText
                      }
                    >
                      {prompt.label}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.composerArea}>
            <View style={styles.composer}>
              <TouchableOpacity
                style={[
                  styles.micButton,

                  isListening &&
                    styles.micButtonActive,
                ]}
                onPress={toggleListening}
              >
                <Ionicons
                  name={
                    isListening
                      ? "mic"
                      : "mic-outline"
                  }
                  size={25}
                  color="#42F58D"
                />
              </TouchableOpacity>

              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Ask your coach…"
                placeholderTextColor="#71859D"
                style={styles.input}
                multiline
                maxLength={2000}
                editable={!isTyping}
                returnKeyType="send"
                blurOnSubmit
                onSubmitEditing={() => {
                  if (canSend) {
                    sendMessage();
                  }
                }}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,

                  !canSend &&
                    styles.sendButtonDisabled,
                ]}
                onPress={() =>
                  sendMessage()
                }
                disabled={!canSend}
              >
                <Ionicons
                  name="arrow-up"
                  size={26}
                  color="#02111F"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
              Legathon AI provides general
              wellness guidance and does not
              replace professional medical
              care.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#173656",
  },

  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B223A",
    borderWidth: 1,
    borderColor: "#24527A",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  eyebrow: {
    color: "#E5B52E",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.4,
    textAlign: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 3,
  },

  screenScroll: {
    flex: 1,
  },

  screenScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },

  coachStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#081C31",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#28577E",
    padding: 16,
    marginBottom: 20,
  },

  coachOrb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#083045",
    borderWidth: 1,
    borderColor: "#14617A",
  },

  coachStatusText: {
    flex: 1,
    marginLeft: 13,
  },

  coachName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  coachReady: {
    color: "#91A9C5",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  resetButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102A45",
  },

  memoryPanel: {
    backgroundColor: "#07182B",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#315B84",
    padding: 18,
    marginBottom: 20,
  },

  memoryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  memoryEyebrow: {
    color: "#42F58D",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.5,
  },

  memoryTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 5,
  },

  memoryCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132B45",
  },

  memoryInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2037",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#234C71",
    padding: 12,
    marginBottom: 12,
  },

  memoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#073245",
    marginRight: 12,
  },

  memoryInputWrap: {
    flex: 1,
  },

  memoryLabel: {
    color: "#9EB5CE",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  memoryInput: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 3,
  },

  saveMemoryButton: {
    minHeight: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42F58D",
    marginTop: 5,
  },

  saveMemoryText: {
    color: "#02111F",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
  },

  clearMemoryButton: {
    minHeight: 50,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#24121D",
    borderWidth: 1,
    borderColor: "#71313E",
    marginTop: 10,
  },

  clearMemoryText: {
    color: "#FF7585",
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },

  messages: {
    width: "100%",
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  coachMessageRow: {
    justifyContent: "flex-start",
  },

  userMessageRow: {
    justifyContent: "flex-end",
  },

  messageAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#073044",
    marginRight: 10,
    marginBottom: 4,
  },

  messageBubble: {
    maxWidth: "82%",
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 15,
  },

  coachBubble: {
    backgroundColor: "#0B2641",
    borderWidth: 1,
    borderColor: "#2A5D86",
    borderBottomLeftRadius: 7,
  },

  userBubble: {
    backgroundColor: "#FFC746",
    borderBottomRightRadius: 7,
  },

  messageText: {
    color: "#DCEBFF",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },

  userMessageText: {
    color: "#02111F",
    fontWeight: "800",
  },

  typingText: {
    color: "#91A9C5",
    fontSize: 15,
    fontWeight: "800",
    fontStyle: "italic",
  },

  actionButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC746",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginTop: 13,
  },

  actionButtonText: {
    color: "#02111F",
    fontSize: 14,
    fontWeight: "900",
    marginRight: 8,
  },

  pendingActionButton: {
    minHeight: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC746",
    marginTop: 4,
    marginBottom: 22,
  },

  pendingActionText: {
    color: "#02111F",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 9,
  },

  quickTitle: {
    color: "#91A9C5",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.5,
    marginTop: 8,
    marginBottom: 12,
  },

  quickPromptRow: {
    paddingRight: 18,
  },

  quickPrompt: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2138",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2A577E",
    paddingHorizontal: 16,
    marginRight: 10,
  },

  quickPromptText: {
    color: "#C7D9EE",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },

  composerArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:
      Platform.OS === "ios"
        ? 12
        : 10,
    backgroundColor: "#03101F",
    borderTopWidth: 1,
    borderTopColor: "#183B5D",
  },

  composer: {
    minHeight: 62,
    maxHeight: 130,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#091F35",
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "#2A577E",
    paddingHorizontal: 8,
  },

  micButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#093047",
  },

  micButtonActive: {
    backgroundColor: "#174C51",
    borderWidth: 1,
    borderColor: "#42F58D",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC746",
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  disclaimer: {
    color: "#6F849E",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
});