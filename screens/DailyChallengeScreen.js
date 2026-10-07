// screens/DailyChallengeScreen.js

import React from "react";

import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const COLLAGE_BG = require("../assets/collage-background.png");

// ============================================================
// CANONICAL CHALLENGE DATA
// Keep internal values stable.
// ============================================================

const completedChallenges = [
  { day: "Mon", steps: 5240, reward: "+50 XP" },
  { day: "Tue", steps: 6100, reward: "+60 XP" },
  { day: "Wed", steps: 7850, reward: "+75 XP" },
];

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    dailyChallenge: "DAILY CHALLENGE",
    title: "Keep Your Legathon Streak Alive",

    todaysGoal: "TODAY’S GOAL",
    stepsCompleted: "of {goal} steps completed",
    complete: "{progress}% Complete",
    stepsRemaining: "{steps} steps remaining",

    currentStreak: "CURRENT STREAK",
    days: "Days",
    streakText:
      "Walk every day to build your Legathon streak and unlock bonus rewards.",

    todaysReward: "TODAY’S REWARD",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Complete today’s challenge to earn XP, W Coins, streak protection, and passport progress.",
    claimReward: "Claim Reward",
    keepWalking: "Keep Walking",

    weeklyChallenge: "WEEKLY CHALLENGE",
    weeklyTitle: "Walk 35,000 Steps",
    weeklyText:
      "Complete the weekly challenge to unlock the Endurance Medal and bonus W Coins.",
    weeklyProgress: "{current} / {goal} steps",

    completedThisWeek: "Completed This Week",
    steps: "steps",

    bonusUnlock: "BONUS UNLOCK",
    bonusTitle: "10-Day Streak Reward",
    bonusText:
      "Reach a 10-day streak to unlock a premium passport frame, +250 XP, and +100 W Coins.",

    mon: "M",
    tue: "T",
    wed: "W",
    thu: "T",
    fri: "F",
    sat: "S",
    sun: "S",

    monLong: "Mon",
    tueLong: "Tue",
    wedLong: "Wed",
  },

  es: {
    back: "Atrás",
    dailyChallenge: "DESAFÍO DIARIO",
    title: "Mantén Viva Tu Racha Legathon",

    todaysGoal: "META DE HOY",
    stepsCompleted: "de {goal} pasos completados",
    complete: "{progress}% Completado",
    stepsRemaining: "{steps} pasos restantes",

    currentStreak: "RACHA ACTUAL",
    days: "Días",
    streakText:
      "Camina todos los días para aumentar tu racha Legathon y desbloquear recompensas adicionales.",

    todaysReward: "RECOMPENSA DE HOY",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Completa el desafío de hoy para ganar XP, W Coins, protección de racha y progreso del pasaporte.",
    claimReward: "Reclamar Recompensa",
    keepWalking: "Sigue Caminando",

    weeklyChallenge: "DESAFÍO SEMANAL",
    weeklyTitle: "Camina 35.000 Pasos",
    weeklyText:
      "Completa el desafío semanal para desbloquear la Medalla de Resistencia y W Coins adicionales.",
    weeklyProgress: "{current} / {goal} pasos",

    completedThisWeek: "Completado Esta Semana",
    steps: "pasos",

    bonusUnlock: "BONO DESBLOQUEABLE",
    bonusTitle: "Recompensa por Racha de 10 Días",
    bonusText:
      "Alcanza una racha de 10 días para desbloquear un marco premium para el pasaporte, +250 XP y +100 W Coins.",

    mon: "L",
    tue: "M",
    wed: "X",
    thu: "J",
    fri: "V",
    sat: "S",
    sun: "D",

    monLong: "Lun",
    tueLong: "Mar",
    wedLong: "Mié",
  },

  fr: {
    back: "Retour",
    dailyChallenge: "DÉFI QUOTIDIEN",
    title: "Gardez Votre Série Legathon Active",

    todaysGoal: "OBJECTIF DU JOUR",
    stepsCompleted: "sur {goal} pas effectués",
    complete: "{progress}% Terminé",
    stepsRemaining: "{steps} pas restants",

    currentStreak: "SÉRIE ACTUELLE",
    days: "Jours",
    streakText:
      "Marchez chaque jour pour développer votre série Legathon et débloquer des récompenses bonus.",

    todaysReward: "RÉCOMPENSE DU JOUR",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Terminez le défi du jour pour gagner de l’XP, des W Coins, une protection de série et progresser dans votre passeport.",
    claimReward: "Réclamer la Récompense",
    keepWalking: "Continuez à Marcher",

    weeklyChallenge: "DÉFI HEBDOMADAIRE",
    weeklyTitle: "Marchez 35 000 Pas",
    weeklyText:
      "Terminez le défi hebdomadaire pour débloquer la Médaille d’Endurance et des W Coins bonus.",
    weeklyProgress: "{current} / {goal} pas",

    completedThisWeek: "Terminés Cette Semaine",
    steps: "pas",

    bonusUnlock: "BONUS À DÉBLOQUER",
    bonusTitle: "Récompense Série de 10 Jours",
    bonusText:
      "Atteignez une série de 10 jours pour débloquer un cadre de passeport premium, +250 XP et +100 W Coins.",

    mon: "L",
    tue: "M",
    wed: "M",
    thu: "J",
    fri: "V",
    sat: "S",
    sun: "D",

    monLong: "Lun",
    tueLong: "Mar",
    wedLong: "Mer",
  },

  de: {
    back: "Zurück",
    dailyChallenge: "TÄGLICHE CHALLENGE",
    title: "Halte Deine Legathon-Serie Am Leben",

    todaysGoal: "HEUTIGES ZIEL",
    stepsCompleted: "von {goal} Schritten geschafft",
    complete: "{progress}% Abgeschlossen",
    stepsRemaining: "{steps} Schritte verbleiben",

    currentStreak: "AKTUELLE SERIE",
    days: "Tage",
    streakText:
      "Gehe jeden Tag, um deine Legathon-Serie aufzubauen und Bonusbelohnungen freizuschalten.",

    todaysReward: "HEUTIGE BELOHNUNG",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Schließe die heutige Challenge ab, um XP, W Coins, Serien-Schutz und Passfortschritt zu erhalten.",
    claimReward: "Belohnung Einlösen",
    keepWalking: "Weitergehen",

    weeklyChallenge: "WÖCHENTLICHE CHALLENGE",
    weeklyTitle: "35.000 Schritte Gehen",
    weeklyText:
      "Schließe die Wochen-Challenge ab, um die Ausdauer-Medaille und zusätzliche W Coins freizuschalten.",
    weeklyProgress: "{current} / {goal} Schritte",

    completedThisWeek: "Diese Woche Abgeschlossen",
    steps: "Schritte",

    bonusUnlock: "BONUS FREISCHALTEN",
    bonusTitle: "Belohnung für 10-Tage-Serie",
    bonusText:
      "Erreiche eine 10-Tage-Serie, um einen Premium-Passrahmen, +250 XP und +100 W Coins freizuschalten.",

    mon: "M",
    tue: "D",
    wed: "M",
    thu: "D",
    fri: "F",
    sat: "S",
    sun: "S",

    monLong: "Mo",
    tueLong: "Di",
    wedLong: "Mi",
  },

  pt: {
    back: "Voltar",
    dailyChallenge: "DESAFIO DIÁRIO",
    title: "Mantenha Sua Sequência Legathon Ativa",

    todaysGoal: "META DE HOJE",
    stepsCompleted: "de {goal} passos concluídos",
    complete: "{progress}% Concluído",
    stepsRemaining: "{steps} passos restantes",

    currentStreak: "SEQUÊNCIA ATUAL",
    days: "Dias",
    streakText:
      "Caminhe todos os dias para aumentar sua sequência Legathon e desbloquear recompensas extras.",

    todaysReward: "RECOMPENSA DE HOJE",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Complete o desafio de hoje para ganhar XP, W Coins, proteção de sequência e progresso no passaporte.",
    claimReward: "Resgatar Recompensa",
    keepWalking: "Continue Caminhando",

    weeklyChallenge: "DESAFIO SEMANAL",
    weeklyTitle: "Caminhe 35.000 Passos",
    weeklyText:
      "Complete o desafio semanal para desbloquear a Medalha de Resistência e W Coins extras.",
    weeklyProgress: "{current} / {goal} passos",

    completedThisWeek: "Concluídos Esta Semana",
    steps: "passos",

    bonusUnlock: "BÔNUS PARA DESBLOQUEAR",
    bonusTitle: "Recompensa de Sequência de 10 Dias",
    bonusText:
      "Alcance uma sequência de 10 dias para desbloquear uma moldura premium de passaporte, +250 XP e +100 W Coins.",

    mon: "S",
    tue: "T",
    wed: "Q",
    thu: "Q",
    fri: "S",
    sat: "S",
    sun: "D",

    monLong: "Seg",
    tueLong: "Ter",
    wedLong: "Qua",
  },

  ja: {
    back: "戻る",
    dailyChallenge: "デイリーチャレンジ",
    title: "Legathon連続記録を続けよう",

    todaysGoal: "今日の目標",
    stepsCompleted: "{goal}歩中の達成歩数",
    complete: "{progress}% 完了",
    stepsRemaining: "残り{steps}歩",

    currentStreak: "現在の連続記録",
    days: "日",
    streakText:
      "毎日歩いてLegathonの連続記録を伸ばし、ボーナス報酬をアンロックしましょう。",

    todaysReward: "今日の報酬",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "今日のチャレンジを完了すると、XP、W Coins、連続記録保護、パスポート進行を獲得できます。",
    claimReward: "報酬を受け取る",
    keepWalking: "歩き続ける",

    weeklyChallenge: "週間チャレンジ",
    weeklyTitle: "35,000歩を歩く",
    weeklyText:
      "週間チャレンジを完了して、エンデュランスメダルとボーナスW Coinsをアンロックしましょう。",
    weeklyProgress: "{current} / {goal} 歩",

    completedThisWeek: "今週の完了記録",
    steps: "歩",

    bonusUnlock: "ボーナスアンロック",
    bonusTitle: "10日連続記録報酬",
    bonusText:
      "10日連続を達成すると、プレミアムパスポートフレーム、+250 XP、+100 W Coinsを獲得できます。",

    mon: "月",
    tue: "火",
    wed: "水",
    thu: "木",
    fri: "金",
    sat: "土",
    sun: "日",

    monLong: "月",
    tueLong: "火",
    wedLong: "水",
  },

  ko: {
    back: "뒤로",
    dailyChallenge: "일일 챌린지",
    title: "Legathon 연속 기록을 이어가세요",

    todaysGoal: "오늘의 목표",
    stepsCompleted: "{goal}걸음 중 완료",
    complete: "{progress}% 완료",
    stepsRemaining: "{steps}걸음 남음",

    currentStreak: "현재 연속 기록",
    days: "일",
    streakText:
      "매일 걸으며 Legathon 연속 기록을 쌓고 보너스 보상을 잠금 해제하세요.",

    todaysReward: "오늘의 보상",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "오늘의 챌린지를 완료하여 XP, W Coins, 연속 기록 보호 및 여권 진행도를 획득하세요.",
    claimReward: "보상 받기",
    keepWalking: "계속 걷기",

    weeklyChallenge: "주간 챌린지",
    weeklyTitle: "35,000걸음 걷기",
    weeklyText:
      "주간 챌린지를 완료하여 지구력 메달과 보너스 W Coins를 잠금 해제하세요.",
    weeklyProgress: "{current} / {goal} 걸음",

    completedThisWeek: "이번 주 완료",
    steps: "걸음",

    bonusUnlock: "보너스 잠금 해제",
    bonusTitle: "10일 연속 기록 보상",
    bonusText:
      "10일 연속 기록을 달성하면 프리미엄 여권 프레임, +250 XP, +100 W Coins를 받을 수 있습니다.",

    mon: "월",
    tue: "화",
    wed: "수",
    thu: "목",
    fri: "금",
    sat: "토",
    sun: "일",

    monLong: "월",
    tueLong: "화",
    wedLong: "수",
  },

  zh: {
    back: "返回",
    dailyChallenge: "每日挑战",
    title: "保持你的 Legathon 连续记录",

    todaysGoal: "今日目标",
    stepsCompleted: "已完成 {goal} 步目标中的步数",
    complete: "已完成 {progress}%",
    stepsRemaining: "还剩 {steps} 步",

    currentStreak: "当前连续记录",
    days: "天",
    streakText:
      "每天步行，保持你的 Legathon 连续记录并解锁额外奖励。",

    todaysReward: "今日奖励",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "完成今天的挑战即可获得 XP、W Coins、连续记录保护和护照进度。",
    claimReward: "领取奖励",
    keepWalking: "继续步行",

    weeklyChallenge: "每周挑战",
    weeklyTitle: "步行 35,000 步",
    weeklyText:
      "完成每周挑战即可解锁耐力奖章和额外 W Coins。",
    weeklyProgress: "{current} / {goal} 步",

    completedThisWeek: "本周已完成",
    steps: "步",

    bonusUnlock: "额外解锁",
    bonusTitle: "连续10天奖励",
    bonusText:
      "连续10天完成挑战即可解锁高级护照边框、+250 XP 和 +100 W Coins。",

    mon: "一",
    tue: "二",
    wed: "三",
    thu: "四",
    fri: "五",
    sat: "六",
    sun: "日",

    monLong: "周一",
    tueLong: "周二",
    wedLong: "周三",
  },

  it: {
    back: "Indietro",
    dailyChallenge: "SFIDA GIORNALIERA",
    title: "Mantieni Attiva la Tua Serie Legathon",

    todaysGoal: "OBIETTIVO DI OGGI",
    stepsCompleted: "su {goal} passi completati",
    complete: "{progress}% Completato",
    stepsRemaining: "{steps} passi rimanenti",

    currentStreak: "SERIE ATTUALE",
    days: "Giorni",
    streakText:
      "Cammina ogni giorno per aumentare la tua serie Legathon e sbloccare ricompense bonus.",

    todaysReward: "RICOMPENSA DI OGGI",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "Completa la sfida di oggi per guadagnare XP, W Coins, protezione della serie e progressi del passaporto.",
    claimReward: "Riscatta Ricompensa",
    keepWalking: "Continua a Camminare",

    weeklyChallenge: "SFIDA SETTIMANALE",
    weeklyTitle: "Cammina 35.000 Passi",
    weeklyText:
      "Completa la sfida settimanale per sbloccare la Medaglia di Resistenza e W Coins bonus.",
    weeklyProgress: "{current} / {goal} passi",

    completedThisWeek: "Completati Questa Settimana",
    steps: "passi",

    bonusUnlock: "BONUS DA SBLOCCARE",
    bonusTitle: "Ricompensa Serie di 10 Giorni",
    bonusText:
      "Raggiungi una serie di 10 giorni per sbloccare una cornice premium per il passaporto, +250 XP e +100 W Coins.",

    mon: "L",
    tue: "M",
    wed: "M",
    thu: "G",
    fri: "V",
    sat: "S",
    sun: "D",

    monLong: "Lun",
    tueLong: "Mar",
    wedLong: "Mer",
  },

  ar: {
    back: "رجوع",
    dailyChallenge: "التحدي اليومي",
    title: "حافظ على سلسلة Legathon الخاصة بك",

    todaysGoal: "هدف اليوم",
    stepsCompleted: "من أصل {goal} خطوة",
    complete: "اكتمل {progress}%",
    stepsRemaining: "متبقي {steps} خطوة",

    currentStreak: "السلسلة الحالية",
    days: "أيام",
    streakText:
      "امشِ كل يوم للحفاظ على سلسلة Legathon وفتح مكافآت إضافية.",

    todaysReward: "مكافأة اليوم",
    rewardTitle: "+50 XP • +25 W Coins",
    rewardText:
      "أكمل تحدي اليوم للحصول على XP وW Coins وحماية السلسلة وتقدم جواز السفر.",
    claimReward: "استلام المكافأة",
    keepWalking: "واصل المشي",

    weeklyChallenge: "التحدي الأسبوعي",
    weeklyTitle: "امشِ 35,000 خطوة",
    weeklyText:
      "أكمل التحدي الأسبوعي لفتح ميدالية التحمل والحصول على W Coins إضافية.",
    weeklyProgress: "{current} / {goal} خطوة",

    completedThisWeek: "المكتمل هذا الأسبوع",
    steps: "خطوة",

    bonusUnlock: "فتح مكافأة إضافية",
    bonusTitle: "مكافأة سلسلة 10 أيام",
    bonusText:
      "حقق سلسلة لمدة 10 أيام لفتح إطار جواز سفر مميز و+250 XP و+100 W Coins.",

    mon: "ن",
    tue: "ث",
    wed: "ر",
    thu: "خ",
    fri: "ج",
    sat: "س",
    sun: "ح",

    monLong: "الاثنين",
    tueLong: "الثلاثاء",
    wedLong: "الأربعاء",
  },
};

// ============================================================
// HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}

function fillTemplate(value, replacements = {}) {
  let output = String(value || "");

  Object.entries(replacements).forEach(([key, replacement]) => {
    output = output.replace(
      new RegExp(`\\{${key}\\}`, "g"),
      String(replacement ?? "")
    );
  });

  return output;
}

function formatNumber(value, languageCode) {
  try {
    return Number(value || 0).toLocaleString(languageCode);
  } catch {
    return Number(value || 0).toLocaleString();
  }
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function DailyChallengeScreen({
  language = "en",
  goBack,
}) {
  const languageCode = normalizeLanguage(language);
  const t = TEXT[languageCode];
  const isRTL = languageCode === "ar";

  const goalSteps = 5000;
  const currentSteps = 3600;

  const progress = Math.min(
    Math.round((currentSteps / goalSteps) * 100),
    100
  );

  const stepsRemaining = Math.max(
    0,
    goalSteps - currentSteps
  );

  const weekDays = [
    t.mon,
    t.tue,
    t.wed,
    t.thu,
    t.fri,
    t.sat,
    t.sun,
  ];

  const historyDayKeys = {
    Mon: "monLong",
    Tue: "tueLong",
    Wed: "wedLong",
  };

  return (
    <ImageBackground
      source={COLLAGE_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* BACK */}

            {typeof goBack === "function" && (
              <TouchableOpacity
                style={[
                  styles.backButton,
                  isRTL && styles.backButtonRTL,
                ]}
                onPress={goBack}
              >
                <Text
                  style={[
                    styles.backText,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {isRTL ? `${t.back} ›` : `‹ ${t.back}`}
                </Text>
              </TouchableOpacity>
            )}

            {/* HEADER */}

            <Text
              style={[
                styles.kicker,
                isRTL && styles.rtlText,
              ]}
            >
              {t.dailyChallenge}
            </Text>

            <Text
              style={[
                styles.title,
                isRTL && styles.rtlText,
              ]}
            >
              {t.title}
            </Text>

            {/* TODAY GOAL */}

            <View style={styles.heroCard}>
              <Text
                style={[
                  styles.heroLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.todaysGoal}
              </Text>

              <Text
                style={[
                  styles.heroNumber,
                  isRTL && styles.rtlText,
                ]}
              >
                {formatNumber(currentSteps, languageCode)}
              </Text>

              <Text
                style={[
                  styles.heroSub,
                  isRTL && styles.rtlText,
                ]}
              >
                {fillTemplate(t.stepsCompleted, {
                  goal: formatNumber(goalSteps, languageCode),
                })}
              </Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.progressText,
                  isRTL && styles.rtlText,
                ]}
              >
                {fillTemplate(t.complete, {
                  progress,
                })}
              </Text>

              <Text
                style={[
                  styles.remainingText,
                  isRTL && styles.rtlText,
                ]}
              >
                {fillTemplate(t.stepsRemaining, {
                  steps: formatNumber(
                    stepsRemaining,
                    languageCode
                  ),
                })}
              </Text>
            </View>

            {/* CURRENT STREAK */}

            <View style={styles.streakCard}>
              <Text
                style={[
                  styles.streakLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.currentStreak}
              </Text>

              <Text
                style={[
                  styles.streakNumber,
                  isRTL && styles.rtlText,
                ]}
              >
                7 {t.days}
              </Text>

              <Text
                style={[
                  styles.streakText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.streakText}
              </Text>

              <View
                style={[
                  styles.streakDots,
                  isRTL && styles.rowRTL,
                ]}
              >
                {weekDays.map((day, index) => (
                  <View
                    key={`${day}-${index}`}
                    style={[
                      styles.dayDot,
                      index < 5
                        ? styles.dayDotComplete
                        : styles.dayDotLocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        index >= 5 &&
                          styles.dayTextLocked,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* TODAY REWARD */}

            <View style={styles.rewardCard}>
              <Text
                style={[
                  styles.rewardLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.todaysReward}
              </Text>

              <Text
                style={[
                  styles.rewardTitle,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.rewardTitle}
              </Text>

              <Text
                style={[
                  styles.rewardText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.rewardText}
              </Text>

              <TouchableOpacity
                style={[
                  styles.claimButton,
                  progress < 100 &&
                    styles.claimButtonDisabled,
                ]}
                disabled={progress < 100}
              >
                <Text
                  style={[
                    styles.claimButtonText,
                    isRTL && styles.rtlCenterText,
                  ]}
                >
                  {progress >= 100
                    ? t.claimReward
                    : t.keepWalking}
                </Text>
              </TouchableOpacity>
            </View>

            {/* WEEKLY CHALLENGE */}

            <View style={styles.weeklyCard}>
              <Text
                style={[
                  styles.weeklyLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.weeklyChallenge}
              </Text>

              <Text
                style={[
                  styles.weeklyTitle,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.weeklyTitle}
              </Text>

              <Text
                style={[
                  styles.weeklyText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.weeklyText}
              </Text>

              <View style={styles.weeklyProgress}>
                <View
                  style={[
                    styles.weeklyFill,
                    { width: "62%" },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.weeklySmall,
                  isRTL && styles.rtlText,
                ]}
              >
                {fillTemplate(t.weeklyProgress, {
                  current: formatNumber(21700, languageCode),
                  goal: formatNumber(35000, languageCode),
                })}
              </Text>
            </View>

            {/* HISTORY */}

            <View style={styles.historyCard}>
              <Text
                style={[
                  styles.sectionTitle,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.completedThisWeek}
              </Text>

              {completedChallenges.map((item) => (
                <View
                  key={item.day}
                  style={[
                    styles.historyRow,
                    isRTL && styles.rowRTL,
                  ]}
                >
                  <Text
                    style={[
                      styles.historyDay,
                      isRTL && styles.historyDayRTL,
                    ]}
                  >
                    {t[historyDayKeys[item.day]] || item.day}
                  </Text>

                  <View style={styles.historyInfo}>
                    <Text
                      style={[
                        styles.historySteps,
                        isRTL && styles.rtlText,
                      ]}
                    >
                      {formatNumber(item.steps, languageCode)}{" "}
                      {t.steps}
                    </Text>

                    <Text
                      style={[
                        styles.historyReward,
                        isRTL && styles.rtlText,
                      ]}
                    >
                      {item.reward}
                    </Text>
                  </View>

                  <Text style={styles.historyCheck}>✓</Text>
                </View>
              ))}
            </View>

            {/* BONUS */}

            <View style={styles.bonusCard}>
              <Text
                style={[
                  styles.bonusLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.bonusUnlock}
              </Text>

              <Text
                style={[
                  styles.bonusTitle,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.bonusTitle}
              </Text>

              <Text
                style={[
                  styles.bonusText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t.bonusText}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.45,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,4,10,0.78)",
  },

  safe: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 160,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(8,18,37,0.88)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.45)",
    marginBottom: 24,
  },

  backButtonRTL: {
    alignSelf: "flex-end",
  },

  backText: {
    color: "#D4AF37",
    fontSize: 19,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 50,
    fontWeight: "900",
    lineHeight: 56,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.3)",
    marginBottom: 24,
  },

  heroLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  heroNumber: {
    color: "#FFFFFF",
    fontSize: 62,
    fontWeight: "900",
  },

  heroSub: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
  },

  progressBar: {
    height: 14,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#A7F3D0",
  },

  progressText: {
    color: "#A7F3D0",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 16,
  },

  remainingText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  streakCard: {
    backgroundColor: "rgba(212,175,55,0.1)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.4)",
    marginBottom: 24,
  },

  streakLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  streakNumber: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
  },

  streakText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 10,
  },

  streakDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  dayDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  dayDotComplete: {
    backgroundColor: "#D4AF37",
    borderColor: "#F8F2E7",
  },

  dayDotLocked: {
    backgroundColor: "#111827",
    borderColor: "#374151",
  },

  dayText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: "900",
  },

  dayTextLocked: {
    color: "#CBD5E1",
  },

  rewardCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.25)",
    marginBottom: 24,
  },

  rewardLabel: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  rewardText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 14,
  },

  claimButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 22,
  },

  claimButtonDisabled: {
    backgroundColor: "#374151",
  },

  claimButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  weeklyCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
    marginBottom: 24,
  },

  weeklyLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  weeklyTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  weeklyText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },

  weeklyProgress: {
    height: 12,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 20,
  },

  weeklyFill: {
    height: "100%",
    backgroundColor: "#D4AF37",
  },

  weeklySmall: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },

  historyCard: {
    backgroundColor: "rgba(8,18,37,0.95)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  historyDay: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
    width: 52,
  },

  historyDayRTL: {
    textAlign: "right",
    writingDirection: "rtl",
  },

  historyInfo: {
    flex: 1,
  },

  historySteps: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  historyReward: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },

  historyCheck: {
    color: "#A7F3D0",
    fontSize: 24,
    fontWeight: "900",
  },

  bonusCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 40,
  },

  bonusLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  bonusTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  bonusText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 14,
  },

  // ==========================================================
  // RTL
  // ==========================================================

  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },

  rtlCenterText: {
    textAlign: "center",
    writingDirection: "rtl",
  },

  rowRTL: {
    flexDirection: "row-reverse",
  },
});