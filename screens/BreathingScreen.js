// screens/BreathingScreen.js

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

import {
  addBreathingXP,
  getBreathingXPReward,
} from "../utils/breathingXP";

import {
  recordBreathingSession,
} from "../utils/breathingAnalyticsStorage";

const LUNGS_IMAGE = require("../assets/breathing/lungs.png");

// ============================================================
// SESSIONS
// ============================================================

const SESSIONS = [
  {
    id: "calm",
    timeMinutes: 2,
    inhale: 4,
    hold: 2,
    exhale: 6,
    reward: 25,
  },
  {
    id: "focus",
    timeMinutes: 3,
    inhale: 4,
    hold: 4,
    exhale: 4,
    reward: 35,
  },
  {
    id: "recovery",
    timeMinutes: 5,
    inhale: 5,
    hold: 2,
    exhale: 7,
    reward: 50,
  },
];

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",

    breathingRoom: "BREATHING ROOM",
    title: "Reset Your Energy",

    subtitle:
      "Slow your breath, calm your mind, and recharge your Legathon energy.",

    ready: "Ready",
    inhale: "Inhale",
    hold: "Hold",
    exhale: "Exhale",

    sessionComplete: "Session Complete",

    pattern:
      "Inhale {inhale} • Hold {hold} • Exhale {exhale}",

    rewardAvailable:
      "+{reward} WCoins available",

    rewardEarned:
      "+{reward} WCoins Earned",

    chooseSession: "Choose Session",

    calmTitle: "Calm Reset",
    focusTitle: "Focus Walk",
    recoveryTitle: "Recovery Breath",

    minutes: "{minutes} min",

    breathingActive: "Breathing Active",
    startBreathing: "Start Breathing",
    completeSession: "Complete Session",
    stopSession: "Stop Session",
  },

  es: {
    back: "‹ Atrás",

    breathingRoom: "SALA DE RESPIRACIÓN",
    title: "Recupera tu energía",

    subtitle:
      "Respira más despacio, calma tu mente y recarga tu energía Legathon.",

    ready: "Listo",
    inhale: "Inhala",
    hold: "Mantén",
    exhale: "Exhala",

    sessionComplete: "Sesión completada",

    pattern:
      "Inhala {inhale} • Mantén {hold} • Exhala {exhale}",

    rewardAvailable:
      "+{reward} WCoins disponibles",

    rewardEarned:
      "+{reward} WCoins ganados",

    chooseSession: "Elige una sesión",

    calmTitle: "Reinicio tranquilo",
    focusTitle: "Caminata enfocada",
    recoveryTitle: "Respiración de recuperación",

    minutes: "{minutes} min",

    breathingActive: "Respiración activa",
    startBreathing: "Comenzar respiración",
    completeSession: "Completar sesión",
    stopSession: "Detener sesión",
  },

  fr: {
    back: "‹ Retour",

    breathingRoom: "ESPACE RESPIRATION",
    title: "Rechargez votre énergie",

    subtitle:
      "Ralentissez votre respiration, apaisez votre esprit et rechargez votre énergie Legathon.",

    ready: "Prêt",
    inhale: "Inspirez",
    hold: "Retenez",
    exhale: "Expirez",

    sessionComplete: "Séance terminée",

    pattern:
      "Inspirez {inhale} • Retenez {hold} • Expirez {exhale}",

    rewardAvailable:
      "+{reward} WCoins disponibles",

    rewardEarned:
      "+{reward} WCoins gagnés",

    chooseSession: "Choisissez une séance",

    calmTitle: "Retour au calme",
    focusTitle: "Marche concentrée",
    recoveryTitle: "Respiration de récupération",

    minutes: "{minutes} min",

    breathingActive: "Respiration active",
    startBreathing: "Commencer",
    completeSession: "Terminer la séance",
    stopSession: "Arrêter la séance",
  },

  de: {
    back: "‹ Zurück",

    breathingRoom: "ATEMRAUM",
    title: "Neue Energie tanken",

    subtitle:
      "Verlangsame deine Atmung, beruhige deinen Geist und lade deine Legathon-Energie auf.",

    ready: "Bereit",
    inhale: "Einatmen",
    hold: "Halten",
    exhale: "Ausatmen",

    sessionComplete: "Sitzung abgeschlossen",

    pattern:
      "Einatmen {inhale} • Halten {hold} • Ausatmen {exhale}",

    rewardAvailable:
      "+{reward} WCoins verfügbar",

    rewardEarned:
      "+{reward} WCoins verdient",

    chooseSession: "Sitzung auswählen",

    calmTitle: "Ruhe-Reset",
    focusTitle: "Fokus-Walk",
    recoveryTitle: "Erholungsatmung",

    minutes: "{minutes} Min.",

    breathingActive: "Atmung aktiv",
    startBreathing: "Atmung starten",
    completeSession: "Sitzung abschließen",
    stopSession: "Sitzung stoppen",
  },

  pt: {
    back: "‹ Voltar",

    breathingRoom: "ESPAÇO DE RESPIRAÇÃO",
    title: "Renove sua energia",

    subtitle:
      "Desacelere a respiração, acalme a mente e recarregue sua energia Legathon.",

    ready: "Pronto",
    inhale: "Inspire",
    hold: "Segure",
    exhale: "Expire",

    sessionComplete: "Sessão concluída",

    pattern:
      "Inspire {inhale} • Segure {hold} • Expire {exhale}",

    rewardAvailable:
      "+{reward} WCoins disponíveis",

    rewardEarned:
      "+{reward} WCoins ganhos",

    chooseSession: "Escolha uma sessão",

    calmTitle: "Reinício calmo",
    focusTitle: "Caminhada focada",
    recoveryTitle: "Respiração de recuperação",

    minutes: "{minutes} min",

    breathingActive: "Respiração ativa",
    startBreathing: "Iniciar respiração",
    completeSession: "Concluir sessão",
    stopSession: "Parar sessão",
  },

  ja: {
    back: "‹ 戻る",

    breathingRoom: "呼吸ルーム",
    title: "エネルギーをリセット",

    subtitle:
      "呼吸をゆっくり整え、心を落ち着かせ、Legathonのエネルギーを回復しましょう。",

    ready: "準備完了",
    inhale: "吸う",
    hold: "止める",
    exhale: "吐く",

    sessionComplete: "セッション完了",

    pattern:
      "吸う {inhale} • 止める {hold} • 吐く {exhale}",

    rewardAvailable:
      "+{reward} WCoins 獲得可能",

    rewardEarned:
      "+{reward} WCoins 獲得",

    chooseSession: "セッションを選択",

    calmTitle: "リラックスリセット",
    focusTitle: "集中ウォーク",
    recoveryTitle: "回復呼吸",

    minutes: "{minutes}分",

    breathingActive: "呼吸セッション中",
    startBreathing: "呼吸を開始",
    completeSession: "セッションを完了",
    stopSession: "セッションを停止",
  },

  ko: {
    back: "‹ 뒤로",

    breathingRoom: "호흡 공간",
    title: "에너지 재충전",

    subtitle:
      "호흡을 천천히 하고 마음을 안정시키며 Legathon 에너지를 재충전하세요.",

    ready: "준비",
    inhale: "들이마시기",
    hold: "멈추기",
    exhale: "내쉬기",

    sessionComplete: "세션 완료",

    pattern:
      "들이마시기 {inhale} • 멈추기 {hold} • 내쉬기 {exhale}",

    rewardAvailable:
      "+{reward} WCoins 획득 가능",

    rewardEarned:
      "+{reward} WCoins 획득",

    chooseSession: "세션 선택",

    calmTitle: "마음 안정",
    focusTitle: "집중 걷기",
    recoveryTitle: "회복 호흡",

    minutes: "{minutes}분",

    breathingActive: "호흡 진행 중",
    startBreathing: "호흡 시작",
    completeSession: "세션 완료",
    stopSession: "세션 중지",
  },

  zh: {
    back: "‹ 返回",

    breathingRoom: "呼吸空间",
    title: "恢复你的能量",

    subtitle:
      "放慢呼吸，平静思绪，重新补充你的 Legathon 能量。",

    ready: "准备好",
    inhale: "吸气",
    hold: "屏息",
    exhale: "呼气",

    sessionComplete: "训练完成",

    pattern:
      "吸气 {inhale} • 屏息 {hold} • 呼气 {exhale}",

    rewardAvailable:
      "可获得 +{reward} WCoins",

    rewardEarned:
      "已获得 +{reward} WCoins",

    chooseSession: "选择训练",

    calmTitle: "平静重置",
    focusTitle: "专注步行",
    recoveryTitle: "恢复呼吸",

    minutes: "{minutes} 分钟",

    breathingActive: "正在呼吸训练",
    startBreathing: "开始呼吸",
    completeSession: "完成训练",
    stopSession: "停止训练",
  },

  it: {
    back: "‹ Indietro",

    breathingRoom: "SPAZIO RESPIRAZIONE",
    title: "Ricarica la tua energia",

    subtitle:
      "Rallenta il respiro, calma la mente e ricarica la tua energia Legathon.",

    ready: "Pronto",
    inhale: "Inspira",
    hold: "Trattieni",
    exhale: "Espira",

    sessionComplete: "Sessione completata",

    pattern:
      "Inspira {inhale} • Trattieni {hold} • Espira {exhale}",

    rewardAvailable:
      "+{reward} WCoins disponibili",

    rewardEarned:
      "+{reward} WCoins guadagnati",

    chooseSession: "Scegli una sessione",

    calmTitle: "Reset rilassante",
    focusTitle: "Camminata concentrata",
    recoveryTitle: "Respirazione di recupero",

    minutes: "{minutes} min",

    breathingActive: "Respirazione attiva",
    startBreathing: "Inizia respirazione",
    completeSession: "Completa sessione",
    stopSession: "Interrompi sessione",
  },

  ar: {
    back: "رجوع ›",

    breathingRoom: "غرفة التنفس",
    title: "استعد طاقتك",

    subtitle:
      "أبطئ تنفسك وهدئ ذهنك واستعد طاقة Legathon.",

    ready: "جاهز",
    inhale: "شهيق",
    hold: "احبس النفس",
    exhale: "زفير",

    sessionComplete: "اكتملت الجلسة",

    pattern:
      "شهيق {inhale} • حبس {hold} • زفير {exhale}",

    rewardAvailable:
      "+{reward} WCoins متاحة",

    rewardEarned:
      "+{reward} WCoins تم كسبها",

    chooseSession: "اختر الجلسة",

    calmTitle: "استعادة الهدوء",
    focusTitle: "مشي بتركيز",
    recoveryTitle: "تنفس للتعافي",

    minutes: "{minutes} دقيقة",

    breathingActive: "التنفس نشط",
    startBreathing: "ابدأ التنفس",
    completeSession: "إكمال الجلسة",
    stopSession: "إيقاف الجلسة",
  },
};

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase();

  return TEXT[code] ? code : "en";
}

function fillTemplate(text, values = {}) {
  return String(text || "").replace(
    /\{(\w+)\}/g,
    (_, key) =>
      values[key] !== undefined &&
      values[key] !== null
        ? String(values[key])
        : ""
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function BreathingScreen({
  language = "en",
  goBack,
  rewardBreathingSession,
  rewardBreathingBonus,
}) {
  const currentLanguage =
    normalizeLanguage(language);

  const isRTL =
    currentLanguage === "ar";

  const t = (
    key,
    values = {}
  ) => {
    const value =
      TEXT[currentLanguage]?.[key] ??
      TEXT.en?.[key] ??
      key;

    return fillTemplate(
      value,
      values
    );
  };

  const [selected, setSelected] =
    useState(SESSIONS[0]);

  const [
    isBreathing,
    setIsBreathing,
  ] = useState(false);

  // Internal phase stays language-neutral.
  const [phase, setPhase] =
    useState("ready");

  const [
    countdown,
    setCountdown,
  ] = useState(0);

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const pulseAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const ringAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // LOCALIZED SESSION TITLE
  // ==========================================================

  const getSessionTitle = (
    session
  ) => {
    if (session.id === "calm") {
      return t("calmTitle");
    }

    if (session.id === "focus") {
      return t("focusTitle");
    }

    if (
      session.id === "recovery"
    ) {
      return t(
        "recoveryTitle"
      );
    }

    return session.id;
  };

  // ==========================================================
  // PATTERN
  // ==========================================================

  const patternText =
    useMemo(() => {
      return t("pattern", {
        inhale: selected.inhale,
        hold: selected.hold,
        exhale: selected.exhale,
      });
    }, [
      selected,
      currentLanguage,
    ]);

  // ==========================================================
  // PHASE DISPLAY
  // ==========================================================

  const phaseText = useMemo(
    () => {
      if (phase === "inhale") {
        return t("inhale");
      }

      if (phase === "hold") {
        return t("hold");
      }

      if (phase === "exhale") {
        return t("exhale");
      }

      if (
        phase === "complete"
      ) {
        return t(
          "sessionComplete"
        );
      }

      return t("ready");
    },
    [phase, currentLanguage]
  );

  // ==========================================================
  // RING ANIMATION
  // ==========================================================

  const ringRotate =
    ringAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        "0deg",
        "360deg",
      ],
    });

  const ringColor =
    phase === "inhale"
      ? "#A7FFD0"
      : phase === "hold"
      ? "#D4AF37"
      : phase === "exhale"
      ? "#4EA8DE"
      : "#A7FFD0";

  // ==========================================================
  // BREATHING CYCLE
  // ==========================================================

  useEffect(() => {
    if (!isBreathing) {
      return;
    }

    let mounted = true;
    let timer;

    const runPhase = (
      nextPhase,
      seconds,
      scaleTo
    ) => {
      return new Promise(
        (resolve) => {
          if (!mounted) {
            resolve();
            return;
          }

          setPhase(nextPhase);
          setCountdown(seconds);

          Animated.timing(
            pulseAnim,
            {
              toValue: scaleTo,
              duration:
                seconds * 1000,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver:
                true,
            }
          ).start();

          let remaining =
            seconds;

          timer = setInterval(
            () => {
              remaining -= 1;

              if (mounted) {
                setCountdown(
                  Math.max(
                    remaining,
                    0
                  )
                );
              }

              if (
                remaining <= 0
              ) {
                clearInterval(
                  timer
                );

                resolve();
              }
            },
            1000
          );
        }
      );
    };

    const runCycle =
      async () => {
        while (mounted) {
          await runPhase(
            "inhale",
            selected.inhale,
            1.25
          );

          if (!mounted) {
            break;
          }

          await runPhase(
            "hold",
            selected.hold,
            1.25
          );

          if (!mounted) {
            break;
          }

          await runPhase(
            "exhale",
            selected.exhale,
            0.92
          );
        }
      };

    ringAnim.setValue(0);

    const ringLoop =
      Animated.loop(
        Animated.timing(
          ringAnim,
          {
            toValue: 1,

            duration:
              (
                selected.inhale +
                selected.hold +
                selected.exhale
              ) * 1000,

            easing:
              Easing.linear,

            useNativeDriver:
              true,
          }
        )
      );

    ringLoop.start();

    runCycle();

    return () => {
      mounted = false;

      if (timer) {
        clearInterval(timer);
      }

      ringLoop.stop();

      pulseAnim.stopAnimation();
      ringAnim.stopAnimation();
    };
  }, [
    isBreathing,
    selected,
    pulseAnim,
    ringAnim,
  ]);

  // ==========================================================
  // START SESSION
  // ==========================================================

  function startSession() {
    if (isBreathing) {
      return;
    }

    setCompleted(false);
    setIsBreathing(true);
    setPhase("inhale");
  }

  // ==========================================================
  // COMPLETE SESSION
  // ==========================================================

  async function completeSession() {
    // Prevent accidentally earning
    // the same session multiple times
    // from repeated taps.
    if (completed) {
      return;
    }

    setIsBreathing(false);
    setCompleted(true);

    setPhase("complete");
    setCountdown(0);

    pulseAnim.setValue(1);
    ringAnim.setValue(0);

    const minutes =
      Number(
        selected.timeMinutes
      );

    const xpReward =
      getBreathingXPReward(
        minutes
      );

    await addBreathingXP(
      xpReward
    );

    // Keep stable English/internal
    // values in analytics storage.
    const analyticsTitles = {
      calm: "Calm Reset",
      focus: "Focus Walk",
      recovery:
        "Recovery Breath",
    };

    const analyticsPattern =
      `Inhale ${selected.inhale} • Hold ${selected.hold} • Exhale ${selected.exhale}`;

    await recordBreathingSession({
      title:
        analyticsTitles[
          selected.id
        ] ||
        selected.id,

      minutes,

      reward:
        selected.reward,

      pattern:
        analyticsPattern,
    });

    if (
      rewardBreathingSession
    ) {
      await rewardBreathingSession(
        selected.reward
      );
    }

    if (
      rewardBreathingBonus
    ) {
      await rewardBreathingBonus();
    }
  }

  // ==========================================================
  // STOP SESSION
  // ==========================================================

  function stopSession() {
    setIsBreathing(false);
    setCompleted(false);

    setPhase("ready");
    setCountdown(0);

    pulseAnim.setValue(1);
    ringAnim.setValue(0);
  }

  // ==========================================================
  // SELECT SESSION
  // ==========================================================

  function selectSession(
    session
  ) {
    setSelected(session);

    setCompleted(false);
    setIsBreathing(false);

    setPhase("ready");
    setCountdown(0);

    pulseAnim.setValue(1);
    ringAnim.setValue(0);
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {goBack && (
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={goBack}
          >
            <Text
              style={[
                styles.backText,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t("back")}
            </Text>
          </TouchableOpacity>
        )}

        {/* HEADER */}

        <Text
          style={[
            styles.kicker,
            isRTL &&
              styles.rtlText,
          ]}
        >
          {t("breathingRoom")}
        </Text>

        <Text
          style={[
            styles.title,
            isRTL &&
              styles.rtlText,
          ]}
          adjustsFontSizeToFit
          numberOfLines={2}
        >
          {t("title")}
        </Text>

        <Text
          style={[
            styles.subtitle,
            isRTL &&
              styles.rtlText,
          ]}
        >
          {t("subtitle")}
        </Text>

        {/* BREATHING HERO */}

        <View
          style={styles.heroCard}
        >
          <View
            style={styles.ringWrap}
          >
            <Animated.View
              style={[
                styles.chargeRing,
                {
                  borderColor:
                    ringColor,

                  borderLeftColor:
                    "#D4AF37",

                  borderBottomColor:
                    "#D4AF37",

                  transform: [
                    {
                      rotate:
                        ringRotate,
                    },
                  ],
                },
              ]}
            />

            <Animated.Image
              source={LUNGS_IMAGE}
              style={[
                styles.lungsImage,
                {
                  transform: [
                    {
                      scale:
                        pulseAnim,
                    },
                  ],
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.phaseText,
              isRTL &&
                styles.rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {phaseText}
          </Text>

          {countdown > 0 && (
            <Text
              style={
                styles.timerText
              }
            >
              {countdown}
            </Text>
          )}

          <Text
            style={[
              styles.guideText,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {patternText}
          </Text>

          <Text
            style={[
              styles.rewardText,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "rewardAvailable",
              {
                reward:
                  selected.reward,
              }
            )}
          </Text>
        </View>

        {/* COMPLETED REWARD */}

        {completed && (
          <View
            style={
              styles.rewardCard
            }
          >
            <Text
              style={[
                styles.rewardTitle,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "sessionComplete"
              )}
            </Text>

            <Text
              style={[
                styles.rewardCoins,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "rewardEarned",
                {
                  reward:
                    selected.reward,
                }
              )}
            </Text>
          </View>
        )}

        {/* SESSION SELECTION */}

        <Text
          style={[
            styles.sectionTitle,
            isRTL &&
              styles.rtlText,
          ]}
        >
          {t("chooseSession")}
        </Text>

        {SESSIONS.map(
          (session) => {
            const active =
              selected.id ===
              session.id;

            const sessionPattern =
              t("pattern", {
                inhale:
                  session.inhale,

                hold:
                  session.hold,

                exhale:
                  session.exhale,
              });

            return (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionCard,

                  active &&
                    styles.sessionCardActive,
                ]}
                onPress={() =>
                  selectSession(
                    session
                  )
                }
                activeOpacity={0.86}
              >
                <View
                  style={
                    styles.sessionTextWrap
                  }
                >
                  <Text
                    style={[
                      styles.sessionTitle,
                      isRTL &&
                        styles.rtlText,
                    ]}
                  >
                    {getSessionTitle(
                      session
                    )}
                  </Text>

                  <Text
                    style={[
                      styles.sessionPattern,
                      isRTL &&
                        styles.rtlText,
                    ]}
                  >
                    {sessionPattern}
                  </Text>
                </View>

                <View
                  style={
                    styles.sessionBadge
                  }
                >
                  <Text
                    style={
                      styles.sessionBadgeText
                    }
                  >
                    {t(
                      "minutes",
                      {
                        minutes:
                          session.timeMinutes,
                      }
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        )}

        {/* START */}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            isBreathing &&
              styles.activePrimaryButton,
          ]}
          onPress={startSession}
          activeOpacity={0.86}
        >
          <Text
            style={
              styles.primaryButtonText
            }
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {isBreathing
              ? t(
                  "breathingActive"
                )
              : t(
                  "startBreathing"
                )}
          </Text>
        </TouchableOpacity>

        {/* COMPLETE */}

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            completed &&
              styles.completedButton,
          ]}
          onPress={
            completeSession
          }
          activeOpacity={0.86}
        >
          <Text
            style={
              styles.secondaryButtonText
            }
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {completed
              ? t(
                  "sessionComplete"
                )
              : t(
                  "completeSession"
                )}
          </Text>
        </TouchableOpacity>

        {/* STOP */}

        {isBreathing && (
          <TouchableOpacity
            style={
              styles.stopButton
            }
            onPress={stopSession}
            activeOpacity={0.86}
          >
            <Text
              style={
                styles.stopButtonText
              }
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {t("stopSession")}
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{ height: 180 }}
        />
      </ScrollView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

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
    textAlign: "center",
  },

  rewardCard: {
    backgroundColor:
      "rgba(167,255,208,0.12)",
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
    textAlign: "center",
  },

  rewardCoins: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
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
    backgroundColor:
      "rgba(212,175,55,0.12)",
  },

  sessionTextWrap: {
    flex: 1,
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
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 12,
  },

  activePrimaryButton: {
    opacity: 0.75,
  },

  primaryButtonText: {
    color: "#050505",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A7FFD0",
    borderRadius: 22,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 14,
  },

  completedButton: {
    backgroundColor:
      "rgba(167,255,208,0.08)",
  },

  secondaryButtonText: {
    color: "#A7FFD0",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  stopButton: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 22,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 14,
  },

  stopButtonText: {
    color: "#FF6B6B",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  rtlText: {
    writingDirection: "rtl",
  },
});