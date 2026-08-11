import { addBreathingXP, getBreathingXPReward } from "../utils/breathingXP";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { recordBreathingSession } from "../utils/breathingAnalyticsStorage";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";

const LUNGS_IMAGE = require("../assets/breathing/lungs.png");

const SESSIONS = [
  {
    id: "calm",
    title: "Calm Reset",
    time: "2 min",
    inhale: 4,
    hold: 2,
    exhale: 6,
    reward: 25,
  },
  {
    id: "focus",
    title: "Focus Walk",
    time: "3 min",
    inhale: 4,
    hold: 4,
    exhale: 4,
    reward: 35,
  },
  {
    id: "recovery",
    title: "Recovery Breath",
    time: "5 min",
    inhale: 5,
    hold: 2,
    exhale: 7,
    reward: 50,
  },
];

export default function BreathingScreen({
  goBack,
  rewardBreathingSession,
  rewardBreathingBonus,
}) {
  const [selected, setSelected] = useState(SESSIONS[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [countdown, setCountdown] = useState(0);
  const [completed, setCompleted] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  const patternText = useMemo(() => {
    return `Inhale ${selected.inhale} • Hold ${selected.hold} • Exhale ${selected.exhale}`;
  }, [selected]);

  const ringRotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const ringColor =
    phase === "Inhale"
      ? "#A7FFD0"
      : phase === "Hold"
      ? "#D4AF37"
      : phase === "Exhale"
      ? "#4EA8DE"
      : "#A7FFD0";

  useEffect(() => {
    if (!isBreathing) return;

    let mounted = true;
    let timer;

    const runCycle = async () => {
      while (mounted) {
        await runPhase("Inhale", selected.inhale, 1.25);
        await runPhase("Hold", selected.hold, 1.25);
        await runPhase("Exhale", selected.exhale, 0.92);
      }
    };

    const runPhase = (nextPhase, seconds, scaleTo) => {
      return new Promise((resolve) => {
        if (!mounted) return resolve();

        setPhase(nextPhase);
        setCountdown(seconds);

        Animated.timing(pulseAnim, {
          toValue: scaleTo,
          duration: seconds * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();

        let remaining = seconds;

        timer = setInterval(() => {
          remaining -= 1;
          setCountdown(remaining);

          if (remaining <= 0) {
            clearInterval(timer);
            resolve();
          }
        }, 1000);
      });
    };

    ringAnim.setValue(0);

    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: (selected.inhale + selected.hold + selected.exhale) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    runCycle();

    return () => {
      mounted = false;
      clearInterval(timer);
      pulseAnim.stopAnimation();
      ringAnim.stopAnimation();
    };
  }, [isBreathing, selected]);

  function startSession() {
    setCompleted(false);
    setIsBreathing(true);
    setPhase("Inhale");
  }

  async function completeSession() {
    setIsBreathing(false);
    setCompleted(true);
    setPhase("Session Complete");
    setCountdown(0);
    pulseAnim.setValue(1);
const minutes = Number(selected.time.replace(" min", ""));
const xpReward = getBreathingXPReward(minutes);
await addBreathingXP(xpReward);

    await recordBreathingSession({
  title: selected.title,
  minutes: Number(selected.time.replace(" min", "")),
  reward: selected.reward,
  pattern: patternText,
});

    if (rewardBreathingSession) {
      await rewardBreathingSession(selected.reward);
    }

    if (rewardBreathingBonus) {
      await rewardBreathingBonus();
    }
  }

  function stopSession() {
    setIsBreathing(false);
    setCompleted(false);
    setPhase("Ready");
    setCountdown(0);
    pulseAnim.setValue(1);
    ringAnim.setValue(0);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {goBack && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.kicker}>BREATHING ROOM</Text>
        <Text style={styles.title}>Reset Your Energy</Text>
        <Text style={styles.subtitle}>
          Slow your breath, calm your mind, and recharge your Legacy energy.
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.ringWrap}>
            <Animated.View
              style={[
                styles.chargeRing,
                {
                  borderColor: ringColor,
                  borderLeftColor: "#D4AF37",
                  borderBottomColor: "#D4AF37",
                  transform: [{ rotate: ringRotate }],
                },
              ]}
            />

            <Animated.Image
              source={LUNGS_IMAGE}
              style={[
                styles.lungsImage,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
          </View>

          <Text style={styles.phaseText}>{phase}</Text>

          {countdown > 0 && (
            <Text style={styles.timerText}>{countdown}</Text>
          )}

          <Text style={styles.guideText}>{patternText}</Text>

          <Text style={styles.rewardText}>
            +{selected.reward} W Coins available
          </Text>
        </View>

        {completed && (
          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Session Complete</Text>
            <Text style={styles.rewardCoins}>
              +{selected.reward} W Coins Earned
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Choose Session</Text>

        {SESSIONS.map((session) => {
          const active = selected.id === session.id;
          const sessionPattern = `Inhale ${session.inhale} • Hold ${session.hold} • Exhale ${session.exhale}`;

          return (
            <TouchableOpacity
              key={session.id}
              style={[styles.sessionCard, active && styles.sessionCardActive]}
              onPress={() => {
                setSelected(session);
                setCompleted(false);
                setIsBreathing(false);
                setPhase("Ready");
                setCountdown(0);
                pulseAnim.setValue(1);
                ringAnim.setValue(0);
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionPattern}>{sessionPattern}</Text>
              </View>

              <View style={styles.sessionBadge}>
                <Text style={styles.sessionBadgeText}>{session.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.primaryButton} onPress={startSession}>
          <Text style={styles.primaryButtonText}>
            {isBreathing ? "Breathing Active" : "Start Breathing"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={completeSession}>
          <Text style={styles.secondaryButtonText}>Complete Session</Text>
        </TouchableOpacity>

        {isBreathing && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSession}>
            <Text style={styles.stopButtonText}>Stop Session</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 180 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  content: {
    padding: 20,
    paddingTop: 110,
    paddingBottom: 260,
  },

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 36,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7FFD0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#B8C0D4",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 28,
  },

  heroCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 34,
    padding: 22,
    alignItems: "center",
    marginBottom: 28,
  },

  ringWrap: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  chargeRing: {
    position: "absolute",
    width: 285,
    height: 285,
    borderRadius: 142.5,
    borderWidth: 8,
    opacity: 0.95,
  },

  lungsImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    shadowColor: "#7FFFD4",
    shadowOpacity: 1,
    shadowRadius: 40,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  phaseText: {
    color: "#A7FFD0",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  timerText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    marginTop: 4,
  },

  guideText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },

  rewardText: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 12,
  },

  rewardCard: {
    backgroundColor: "rgba(167,255,208,0.12)",
    borderColor: "#A7FFD0",
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 26,
    alignItems: "center",
  },

  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  rewardCoins: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 16,
  },

  sessionCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sessionCardActive: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.12)",
  },

  sessionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  sessionPattern: {
    color: "#B8C0D4",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
  },

  sessionBadge: {
    backgroundColor: "#D4AF37",
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginLeft: 12,
  },

  sessionBadgeText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "900",
  },

  primaryButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 12,
  },

  primaryButtonText: {
    color: "#050505",
    fontSize: 20,
    fontWeight: "900",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A7FFD0",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 14,
  },

  secondaryButtonText: {
    color: "#A7FFD0",
    fontSize: 20,
    fontWeight: "900",
  },

  stopButton: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 14,
  },

  stopButtonText: {
    color: "#FF6B6B",
    fontSize: 20,
    fontWeight: "900",
  },
});

   