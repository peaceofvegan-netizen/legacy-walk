// screens/AIWellnessMasterScreen.js

import React, {
  useCallback,
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
  SafeAreaView,
  StyleSheet,
  Animated,
  AppState,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  STEP_STATS_KEY,
} from "../utils/stepTrackingEngine";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_STEP_GOAL = 10000;
const DEFAULT_HYDRATION_GOAL = 100;
const REFRESH_INTERVAL_MS = 1500;

const INITIAL_WELLNESS = {
  userName: "",
  greeting: "",

  steps: null,
  stepGoal: DEFAULT_STEP_GOAL,

  recovery: null,
  sleepHours: null,

  hydration: 0,
  hydrationGoal: DEFAULT_HYDRATION_GOAL,

  calories: null,
  stress: null,

  streak: 0,

  journey: "",
  journeyFull: "",
  activeJourney: null,
  journeyProgress: 0,
  checkpoint: null,

  stepError: false,
  loadError: false,
};

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    walker: "Walker",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcome: "Welcome",

    wellness: "WELLNESS",
    aiWellnessCoach: "Your AI Wellness Coach",

    heroDescription:
      "Ready to coach your next walk, recovery, meals, hydration, and Legathon Journey.",

    aiCoach: "AI Coach",
    aiReady: "AI Ready",

    coachReady:
      "Your AI coach is ready to help with your next wellness goal.",

    messageCoach: "Message Your Coach",
    walk: "Walk",
    calm: "Calm",
    meal: "Meal",

    todaysWellness: "Today’s Wellness",
    steps: "Steps",
    hydration: "Hydration",
    recovery: "Recovery",
    sleep: "Sleep",
    calories: "Calories",
    journey: "Journey",
    streak: "Streak",

    notRecorded: "Not recorded",
    noActiveJourney: "No active journey",
    days: "Days",

    aiInsight: "AI Insight",
    todaysRecommendation: "Today's Recommendation",
    startWalk: "Start Walk",
    confidence: "Confidence",

    recoveryNotRecorded: "Recovery not recorded",
    excellentRecovery: "Excellent recovery",
    recoveryImproving: "Recovery improving",
    moderateRecovery: "Moderate recovery",
    recoveryNeedsAttention: "Recovery needs attention",

    startShortWalk:
      "Start with a short walk today to begin building your wellness progress.",

    completedGoal:
      "You completed today’s step goal. Focus on hydration, recovery, and quality sleep.",

    stepsAway:
      "You are {steps} steps away from today’s goal.",

    aiActivityFeed: "AI Activity Feed",
    walkProgress: "Walk Progress",
    walkedToday: "You walked {steps} steps today.",

    journeyProgress: "Journey Progress",
    journeyInProgress: "Journey in progress",
    noActiveJourneyPeriod: "No active journey.",

    recoveryScore: "Recovery score: {score}%.",
    recoveryNotRecordedPeriod: "Recovery not recorded.",

    today: "Today",

    goalMessageRemaining:
      "You are {steps} steps from today's goal.",

    goalMessageComplete:
      "You completed today's step goal.",

    unavailable:
      "Wellness information is temporarily unavailable.",

    stepsUnavailable:
      "Saved daily steps are unavailable. Your walking progress has not been changed.",

    loading: "Loading your wellness information…",

    checkpointOf:
      "{checkpoint} of 5",
  },

  es: {
    walker: "Caminante",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    welcome: "Bienvenido",

    wellness: "BIENESTAR",
    aiWellnessCoach: "Tu Coach de Bienestar con IA",

    heroDescription:
      "Listo para ayudarte con tu próxima caminata, recuperación, comidas, hidratación y viaje de Legathon.",

    aiCoach: "Coach IA",
    aiReady: "IA Lista",

    coachReady:
      "Tu coach de IA está listo para ayudarte con tu próximo objetivo de bienestar.",

    messageCoach: "Habla con Tu Coach",
    walk: "Caminar",
    calm: "Calma",
    meal: "Comida",

    todaysWellness: "Bienestar de Hoy",
    steps: "Pasos",
    hydration: "Hidratación",
    recovery: "Recuperación",
    sleep: "Sueño",
    calories: "Calorías",
    journey: "Viaje",
    streak: "Racha",

    notRecorded: "No registrado",
    noActiveJourney: "Sin viaje activo",
    days: "Días",

    aiInsight: "Información de IA",
    todaysRecommendation: "Recomendación de Hoy",
    startWalk: "Comenzar Caminata",
    confidence: "Confianza",

    recoveryNotRecorded: "Recuperación no registrada",
    excellentRecovery: "Recuperación excelente",
    recoveryImproving: "Recuperación mejorando",
    moderateRecovery: "Recuperación moderada",
    recoveryNeedsAttention:
      "La recuperación necesita atención",

    startShortWalk:
      "Comienza con una caminata corta hoy para empezar a desarrollar tu progreso de bienestar.",

    completedGoal:
      "Completaste tu meta de pasos de hoy. Concéntrate en hidratación, recuperación y buen descanso.",

    stepsAway:
      "Estás a {steps} pasos de la meta de hoy.",

    aiActivityFeed: "Actividad de IA",
    walkProgress: "Progreso de Caminata",
    walkedToday: "Caminaste {steps} pasos hoy.",

    journeyProgress: "Progreso del Viaje",
    journeyInProgress: "Viaje en progreso",
    noActiveJourneyPeriod: "No hay un viaje activo.",

    recoveryScore:
      "Puntuación de recuperación: {score}%.",

    recoveryNotRecordedPeriod:
      "Recuperación no registrada.",

    today: "Hoy",

    goalMessageRemaining:
      "Estás a {steps} pasos de la meta de hoy.",

    goalMessageComplete:
      "Completaste la meta de pasos de hoy.",

    unavailable:
      "La información de bienestar no está disponible temporalmente.",

    stepsUnavailable:
      "Los pasos diarios guardados no están disponibles. Tu progreso no ha cambiado.",

    loading: "Cargando tu información de bienestar…",
    checkpointOf: "{checkpoint} de 5",
  },

  fr: {
    walker: "Marcheur",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    welcome: "Bienvenue",

    wellness: "BIEN-ÊTRE",
    aiWellnessCoach: "Votre Coach Bien-être IA",

    heroDescription:
      "Prêt à vous accompagner pour votre prochaine marche, récupération, repas, hydratation et voyage Legathon.",

    aiCoach: "Coach IA",
    aiReady: "IA Prête",

    coachReady:
      "Votre coach IA est prêt à vous aider avec votre prochain objectif de bien-être.",

    messageCoach: "Écrire à Votre Coach",
    walk: "Marche",
    calm: "Calme",
    meal: "Repas",

    todaysWellness: "Bien-être du Jour",
    steps: "Pas",
    hydration: "Hydratation",
    recovery: "Récupération",
    sleep: "Sommeil",
    calories: "Calories",
    journey: "Voyage",
    streak: "Série",

    notRecorded: "Non enregistré",
    noActiveJourney: "Aucun voyage actif",
    days: "Jours",

    aiInsight: "Analyse IA",
    todaysRecommendation: "Recommandation du Jour",
    startWalk: "Commencer la Marche",
    confidence: "Confiance",

    recoveryNotRecorded: "Récupération non enregistrée",
    excellentRecovery: "Excellente récupération",
    recoveryImproving: "Récupération en amélioration",
    moderateRecovery: "Récupération modérée",
    recoveryNeedsAttention:
      "La récupération mérite votre attention",

    startShortWalk:
      "Commencez par une courte marche aujourd’hui pour développer votre progression bien-être.",

    completedGoal:
      "Vous avez atteint votre objectif de pas. Concentrez-vous maintenant sur l’hydratation, la récupération et un sommeil de qualité.",

    stepsAway:
      "Il vous reste {steps} pas pour atteindre votre objectif aujourd’hui.",

    aiActivityFeed: "Activité IA",
    walkProgress: "Progression de Marche",

    walkedToday:
      "Vous avez marché {steps} pas aujourd’hui.",

    journeyProgress: "Progression du Voyage",
    journeyInProgress: "Voyage en cours",
    noActiveJourneyPeriod: "Aucun voyage actif.",

    recoveryScore: "Score de récupération : {score}%.",

    recoveryNotRecordedPeriod:
      "Récupération non enregistrée.",

    today: "Aujourd’hui",

    goalMessageRemaining:
      "Il vous reste {steps} pas avant l’objectif du jour.",

    goalMessageComplete:
      "Vous avez atteint votre objectif de pas aujourd’hui.",

    unavailable:
      "Les informations de bien-être sont temporairement indisponibles.",

    stepsUnavailable:
      "Les pas quotidiens enregistrés sont indisponibles. Votre progression n’a pas été modifiée.",

    loading:
      "Chargement de vos informations de bien-être…",

    checkpointOf: "{checkpoint} sur 5",
  },

  de: {
    walker: "Walker",
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    welcome: "Willkommen",

    wellness: "WELLNESS",
    aiWellnessCoach: "Dein KI-Wellness-Coach",

    heroDescription:
      "Bereit für deinen nächsten Spaziergang, Erholung, Mahlzeiten, Flüssigkeitszufuhr und deine Legathon-Reise.",

    aiCoach: "KI-Coach",
    aiReady: "KI Bereit",

    coachReady:
      "Dein KI-Coach ist bereit, dich beim nächsten Wellness-Ziel zu unterstützen.",

    messageCoach: "Coach Schreiben",
    walk: "Gehen",
    calm: "Ruhe",
    meal: "Essen",

    todaysWellness: "Heutiges Wohlbefinden",
    steps: "Schritte",
    hydration: "Hydration",
    recovery: "Erholung",
    sleep: "Schlaf",
    calories: "Kalorien",
    journey: "Reise",
    streak: "Serie",

    notRecorded: "Nicht erfasst",
    noActiveJourney: "Keine aktive Reise",
    days: "Tage",

    aiInsight: "KI-Einblick",
    todaysRecommendation: "Heutige Empfehlung",
    startWalk: "Spaziergang Starten",
    confidence: "Vertrauen",

    recoveryNotRecorded: "Erholung nicht erfasst",
    excellentRecovery: "Ausgezeichnete Erholung",
    recoveryImproving: "Erholung verbessert sich",
    moderateRecovery: "Mittlere Erholung",
    recoveryNeedsAttention:
      "Erholung braucht Aufmerksamkeit",

    startShortWalk:
      "Beginne heute mit einem kurzen Spaziergang, um deinen Wellness-Fortschritt aufzubauen.",

    completedGoal:
      "Du hast dein heutiges Schrittziel erreicht. Konzentriere dich auf Flüssigkeit, Erholung und guten Schlaf.",

    stepsAway:
      "Du bist noch {steps} Schritte vom heutigen Ziel entfernt.",

    aiActivityFeed: "KI-Aktivitäten",
    walkProgress: "Gehfortschritt",

    walkedToday:
      "Du bist heute {steps} Schritte gegangen.",

    journeyProgress: "Reisefortschritt",
    journeyInProgress: "Reise läuft",
    noActiveJourneyPeriod: "Keine aktive Reise.",

    recoveryScore: "Erholungswert: {score}%.",
    recoveryNotRecordedPeriod:
      "Erholung nicht erfasst.",

    today: "Heute",

    goalMessageRemaining:
      "Noch {steps} Schritte bis zum heutigen Ziel.",

    goalMessageComplete:
      "Du hast dein heutiges Schrittziel erreicht.",

    unavailable:
      "Wellness-Informationen sind vorübergehend nicht verfügbar.",

    stepsUnavailable:
      "Gespeicherte Tagesschritte sind nicht verfügbar. Dein Fortschritt wurde nicht verändert.",

    loading: "Deine Wellness-Daten werden geladen…",
    checkpointOf: "{checkpoint} von 5",
  },

  pt: {
    walker: "Caminhante",
    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    goodEvening: "Boa noite",
    welcome: "Bem-vindo",

    wellness: "BEM-ESTAR",
    aiWellnessCoach: "Seu Coach de Bem-Estar com IA",

    heroDescription:
      "Pronto para ajudar com sua próxima caminhada, recuperação, refeições, hidratação e Jornada Legathon.",

    aiCoach: "Coach IA",
    aiReady: "IA Pronta",

    coachReady:
      "Seu coach de IA está pronto para ajudar com seu próximo objetivo de bem-estar.",

    messageCoach: "Falar com Seu Coach",
    walk: "Caminhar",
    calm: "Calma",
    meal: "Refeição",

    todaysWellness: "Bem-Estar de Hoje",
    steps: "Passos",
    hydration: "Hidratação",
    recovery: "Recuperação",
    sleep: "Sono",
    calories: "Calorias",
    journey: "Jornada",
    streak: "Sequência",

    notRecorded: "Não registrado",
    noActiveJourney: "Nenhuma jornada ativa",
    days: "Dias",

    aiInsight: "Insight de IA",
    todaysRecommendation: "Recomendação de Hoje",
    startWalk: "Iniciar Caminhada",
    confidence: "Confiança",

    recoveryNotRecorded: "Recuperação não registrada",
    excellentRecovery: "Recuperação excelente",
    recoveryImproving: "Recuperação melhorando",
    moderateRecovery: "Recuperação moderada",
    recoveryNeedsAttention:
      "A recuperação precisa de atenção",

    startShortWalk:
      "Comece com uma caminhada curta hoje para desenvolver seu progresso de bem-estar.",

    completedGoal:
      "Você completou a meta de passos de hoje. Foque em hidratação, recuperação e sono de qualidade.",

    stepsAway:
      "Você está a {steps} passos da meta de hoje.",

    aiActivityFeed: "Atividade de IA",
    walkProgress: "Progresso da Caminhada",

    walkedToday:
      "Você caminhou {steps} passos hoje.",

    journeyProgress: "Progresso da Jornada",
    journeyInProgress: "Jornada em andamento",
    noActiveJourneyPeriod: "Nenhuma jornada ativa.",

    recoveryScore:
      "Pontuação de recuperação: {score}%.",

    recoveryNotRecordedPeriod:
      "Recuperação não registrada.",

    today: "Hoje",

    goalMessageRemaining:
      "Faltam {steps} passos para a meta de hoje.",

    goalMessageComplete:
      "Você completou a meta de passos de hoje.",

    unavailable:
      "As informações de bem-estar estão temporariamente indisponíveis.",

    stepsUnavailable:
      "Os passos diários salvos não estão disponíveis. Seu progresso não foi alterado.",

    loading:
      "Carregando suas informações de bem-estar…",

    checkpointOf: "{checkpoint} de 5",
  },

  ja: {
    walker: "ウォーカー",
    goodMorning: "おはようございます",
    goodAfternoon: "こんにちは",
    goodEvening: "こんばんは",
    welcome: "ようこそ",

    wellness: "ウェルネス",
    aiWellnessCoach: "AIウェルネスコーチ",

    heroDescription:
      "次のウォーキング、回復、食事、水分補給、Legathonジャーニーをサポートします。",

    aiCoach: "AIコーチ",
    aiReady: "AI準備完了",

    coachReady:
      "AIコーチが次のウェルネス目標をサポートする準備ができています。",

    messageCoach: "コーチにメッセージ",
    walk: "歩く",
    calm: "リラックス",
    meal: "食事",

    todaysWellness: "今日のウェルネス",
    steps: "歩数",
    hydration: "水分補給",
    recovery: "回復",
    sleep: "睡眠",
    calories: "カロリー",
    journey: "ジャーニー",
    streak: "連続記録",

    notRecorded: "未記録",
    noActiveJourney: "進行中のジャーニーなし",
    days: "日",

    aiInsight: "AIインサイト",
    todaysRecommendation: "今日のおすすめ",
    startWalk: "ウォーキング開始",
    confidence: "信頼度",

    recoveryNotRecorded: "回復データ未記録",
    excellentRecovery: "非常に良い回復",
    recoveryImproving: "回復が向上しています",
    moderateRecovery: "中程度の回復",
    recoveryNeedsAttention: "回復に注意が必要です",

    startShortWalk:
      "今日は短いウォーキングから始めて、ウェルネスの進捗を作りましょう。",

    completedGoal:
      "今日の歩数目標を達成しました。水分補給、回復、質の良い睡眠を意識しましょう。",

    stepsAway:
      "今日の目標まであと{steps}歩です。",

    aiActivityFeed: "AIアクティビティ",
    walkProgress: "ウォーキング進捗",
    walkedToday: "今日は{steps}歩歩きました。",

    journeyProgress: "ジャーニー進捗",
    journeyInProgress: "ジャーニー進行中",
    noActiveJourneyPeriod:
      "進行中のジャーニーはありません。",

    recoveryScore: "回復スコア：{score}%",
    recoveryNotRecordedPeriod:
      "回復データは未記録です。",

    today: "今日",

    goalMessageRemaining:
      "今日の目標まであと{steps}歩です。",

    goalMessageComplete:
      "今日の歩数目標を達成しました。",

    unavailable:
      "ウェルネス情報は一時的に利用できません。",

    stepsUnavailable:
      "保存された今日の歩数を取得できません。歩行の進捗は変更されていません。",

    loading: "ウェルネス情報を読み込み中…",
    checkpointOf: "5か所中{checkpoint}",
  },

  ko: {
    walker: "워커",
    goodMorning: "좋은 아침입니다",
    goodAfternoon: "좋은 오후입니다",
    goodEvening: "좋은 저녁입니다",
    welcome: "환영합니다",

    wellness: "웰니스",
    aiWellnessCoach: "나의 AI 웰니스 코치",

    heroDescription:
      "다음 걷기, 회복, 식사, 수분 섭취 및 Legathon 여정을 코칭할 준비가 되었습니다.",

    aiCoach: "AI 코치",
    aiReady: "AI 준비 완료",

    coachReady:
      "AI 코치가 다음 웰니스 목표를 도울 준비가 되었습니다.",

    messageCoach: "코치에게 메시지",
    walk: "걷기",
    calm: "안정",
    meal: "식사",

    todaysWellness: "오늘의 웰니스",
    steps: "걸음 수",
    hydration: "수분",
    recovery: "회복",
    sleep: "수면",
    calories: "칼로리",
    journey: "여정",
    streak: "연속 기록",

    notRecorded: "기록 없음",
    noActiveJourney: "활성 여정 없음",
    days: "일",

    aiInsight: "AI 인사이트",
    todaysRecommendation: "오늘의 추천",
    startWalk: "걷기 시작",
    confidence: "신뢰도",

    recoveryNotRecorded: "회복 기록 없음",
    excellentRecovery: "매우 좋은 회복",
    recoveryImproving: "회복 향상 중",
    moderateRecovery: "보통 회복",
    recoveryNeedsAttention:
      "회복에 주의가 필요합니다",

    startShortWalk:
      "오늘 짧은 걷기부터 시작해 웰니스 진행 상황을 만들어 보세요.",

    completedGoal:
      "오늘의 걸음 목표를 달성했습니다. 수분, 회복 및 충분한 수면에 집중하세요.",

    stepsAway:
      "오늘 목표까지 {steps}걸음 남았습니다.",

    aiActivityFeed: "AI 활동",
    walkProgress: "걷기 진행",
    walkedToday: "오늘 {steps}걸음을 걸었습니다.",

    journeyProgress: "여정 진행",
    journeyInProgress: "여정 진행 중",
    noActiveJourneyPeriod: "활성 여정이 없습니다.",

    recoveryScore: "회복 점수: {score}%",
    recoveryNotRecordedPeriod:
      "회복 기록이 없습니다.",

    today: "오늘",

    goalMessageRemaining:
      "오늘 목표까지 {steps}걸음 남았습니다.",

    goalMessageComplete:
      "오늘의 걸음 목표를 달성했습니다.",

    unavailable:
      "웰니스 정보를 일시적으로 사용할 수 없습니다.",

    stepsUnavailable:
      "저장된 일일 걸음 수를 사용할 수 없습니다. 걷기 진행 상황은 변경되지 않았습니다.",

    loading: "웰니스 정보를 불러오는 중…",
    checkpointOf: "5개 중 {checkpoint}",
  },

  zh: {
    walker: "步行者",
    goodMorning: "早上好",
    goodAfternoon: "下午好",
    goodEvening: "晚上好",
    welcome: "欢迎",

    wellness: "健康",
    aiWellnessCoach: "你的AI健康教练",

    heroDescription:
      "随时为你的下一次步行、恢复、饮食、补水和Legathon旅程提供指导。",

    aiCoach: "AI教练",
    aiReady: "AI已就绪",

    coachReady:
      "你的AI教练已准备好帮助你实现下一个健康目标。",

    messageCoach: "给教练发消息",
    walk: "步行",
    calm: "放松",
    meal: "饮食",

    todaysWellness: "今日健康",
    steps: "步数",
    hydration: "补水",
    recovery: "恢复",
    sleep: "睡眠",
    calories: "卡路里",
    journey: "旅程",
    streak: "连续记录",

    notRecorded: "未记录",
    noActiveJourney: "没有进行中的旅程",
    days: "天",

    aiInsight: "AI建议",
    todaysRecommendation: "今日建议",
    startWalk: "开始步行",
    confidence: "可信度",

    recoveryNotRecorded: "恢复数据未记录",
    excellentRecovery: "恢复状态极佳",
    recoveryImproving: "恢复状态正在改善",
    moderateRecovery: "恢复状态一般",
    recoveryNeedsAttention: "恢复状态需要关注",

    startShortWalk:
      "今天先进行一次短时间步行，开始建立你的健康进度。",

    completedGoal:
      "你已完成今天的步数目标。接下来注意补水、恢复和高质量睡眠。",

    stepsAway:
      "距离今天的目标还差{steps}步。",

    aiActivityFeed: "AI活动动态",
    walkProgress: "步行进度",
    walkedToday: "你今天走了{steps}步。",

    journeyProgress: "旅程进度",
    journeyInProgress: "旅程进行中",
    noActiveJourneyPeriod:
      "目前没有进行中的旅程。",

    recoveryScore: "恢复评分：{score}%",
    recoveryNotRecordedPeriod:
      "恢复数据未记录。",

    today: "今天",

    goalMessageRemaining:
      "距离今天的目标还差{steps}步。",

    goalMessageComplete:
      "你已经完成今天的步数目标。",

    unavailable: "健康信息暂时无法使用。",

    stepsUnavailable:
      "暂时无法读取已保存的每日步数。你的步行进度未被更改。",

    loading: "正在加载健康信息…",
    checkpointOf: "{checkpoint}/5",
  },

  it: {
    walker: "Camminatore",
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio",
    goodEvening: "Buonasera",
    welcome: "Benvenuto",

    wellness: "BENESSERE",
    aiWellnessCoach: "Il Tuo Coach Benessere AI",

    heroDescription:
      "Pronto ad aiutarti con la prossima camminata, recupero, pasti, idratazione e viaggio Legathon.",

    aiCoach: "Coach AI",
    aiReady: "AI Pronta",

    coachReady:
      "Il tuo coach AI è pronto ad aiutarti con il prossimo obiettivo di benessere.",

    messageCoach: "Scrivi al Tuo Coach",
    walk: "Cammina",
    calm: "Calma",
    meal: "Pasto",

    todaysWellness: "Benessere di Oggi",
    steps: "Passi",
    hydration: "Idratazione",
    recovery: "Recupero",
    sleep: "Sonno",
    calories: "Calorie",
    journey: "Viaggio",
    streak: "Serie",

    notRecorded: "Non registrato",
    noActiveJourney: "Nessun viaggio attivo",
    days: "Giorni",

    aiInsight: "Insight AI",
    todaysRecommendation: "Raccomandazione di Oggi",
    startWalk: "Inizia Camminata",
    confidence: "Affidabilità",

    recoveryNotRecorded: "Recupero non registrato",
    excellentRecovery: "Recupero eccellente",
    recoveryImproving: "Recupero in miglioramento",
    moderateRecovery: "Recupero moderato",
    recoveryNeedsAttention:
      "Il recupero richiede attenzione",

    startShortWalk:
      "Inizia oggi con una breve camminata per costruire il tuo progresso di benessere.",

    completedGoal:
      "Hai completato l’obiettivo di passi di oggi. Concentrati su idratazione, recupero e sonno di qualità.",

    stepsAway:
      "Ti mancano {steps} passi per raggiungere l’obiettivo di oggi.",

    aiActivityFeed: "Attività AI",
    walkProgress: "Progresso della Camminata",

    walkedToday:
      "Hai camminato {steps} passi oggi.",

    journeyProgress: "Progresso del Viaggio",
    journeyInProgress: "Viaggio in corso",
    noActiveJourneyPeriod: "Nessun viaggio attivo.",

    recoveryScore: "Punteggio recupero: {score}%.",
    recoveryNotRecordedPeriod:
      "Recupero non registrato.",

    today: "Oggi",

    goalMessageRemaining:
      "Ti mancano {steps} passi per l’obiettivo di oggi.",

    goalMessageComplete:
      "Hai completato l’obiettivo di passi di oggi.",

    unavailable:
      "Le informazioni sul benessere sono temporaneamente non disponibili.",

    stepsUnavailable:
      "I passi giornalieri salvati non sono disponibili. I tuoi progressi non sono stati modificati.",

    loading:
      "Caricamento delle informazioni sul benessere…",

    checkpointOf: "{checkpoint} di 5",
  },

  ar: {
    walker: "المشّاء",
    goodMorning: "صباح الخير",
    goodAfternoon: "مساء الخير",
    goodEvening: "مساء الخير",
    welcome: "مرحبًا",

    wellness: "العافية",
    aiWellnessCoach:
      "مدرب العافية بالذكاء الاصطناعي",

    heroDescription:
      "جاهز لمساعدتك في المشي والتعافي والوجبات والترطيب ورحلة Legathon القادمة.",

    aiCoach: "مدرب AI",
    aiReady: "الذكاء الاصطناعي جاهز",

    coachReady:
      "مدربك بالذكاء الاصطناعي جاهز لمساعدتك في هدف العافية التالي.",

    messageCoach: "راسل مدربك",
    walk: "مشي",
    calm: "استرخاء",
    meal: "وجبة",

    todaysWellness: "عافية اليوم",
    steps: "الخطوات",
    hydration: "الترطيب",
    recovery: "التعافي",
    sleep: "النوم",
    calories: "السعرات",
    journey: "الرحلة",
    streak: "السلسلة",

    notRecorded: "غير مسجل",
    noActiveJourney: "لا توجد رحلة نشطة",
    days: "أيام",

    aiInsight: "تحليل الذكاء الاصطناعي",
    todaysRecommendation: "توصية اليوم",
    startWalk: "ابدأ المشي",
    confidence: "الثقة",

    recoveryNotRecorded: "التعافي غير مسجل",
    excellentRecovery: "تعافٍ ممتاز",
    recoveryImproving: "التعافي يتحسن",
    moderateRecovery: "تعافٍ متوسط",
    recoveryNeedsAttention:
      "التعافي يحتاج إلى اهتمام",

    startShortWalk:
      "ابدأ اليوم بمشية قصيرة لبناء تقدمك في العافية.",

    completedGoal:
      "أكملت هدف خطوات اليوم. ركز على الترطيب والتعافي والنوم الجيد.",

    stepsAway:
      "تبقى {steps} خطوة للوصول إلى هدف اليوم.",

    aiActivityFeed: "نشاط الذكاء الاصطناعي",
    walkProgress: "تقدم المشي",
    walkedToday: "مشيت {steps} خطوة اليوم.",

    journeyProgress: "تقدم الرحلة",
    journeyInProgress: "الرحلة قيد التقدم",
    noActiveJourneyPeriod: "لا توجد رحلة نشطة.",

    recoveryScore: "درجة التعافي: {score}٪.",
    recoveryNotRecordedPeriod:
      "التعافي غير مسجل.",

    today: "اليوم",

    goalMessageRemaining:
      "تبقى {steps} خطوة للوصول إلى هدف اليوم.",

    goalMessageComplete:
      "أكملت هدف خطوات اليوم.",

    unavailable:
      "معلومات العافية غير متاحة مؤقتًا.",

    stepsUnavailable:
      "الخطوات اليومية المحفوظة غير متاحة. لم يتم تغيير تقدم المشي.",

    loading: "جارٍ تحميل معلومات العافية…",
    checkpointOf: "{checkpoint} من 5",
  },
};

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(value) {
  const code = String(value || "en")
    .toLowerCase()
    .split(/[-_]/)[0];

  return Object.prototype.hasOwnProperty.call(
    TEXT,
    code
  )
    ? code
    : "en";
}

function fillTemplate(value, variables = {}) {
  return String(value).replace(
    /\{(\w+)\}/g,
    (match, key) =>
      Object.prototype.hasOwnProperty.call(
        variables,
        key
      )
        ? String(variables[key])
        : match
  );
}

function getText(language, key, variables = {}) {
  const value =
    TEXT[language]?.[key] ??
    TEXT.en[key] ??
    key;

  return fillTemplate(value, variables);
}

function formatNumber(value, language) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  const safe = Math.max(0, Math.floor(number));

  try {
    return safe.toLocaleString(language);
  } catch {
    return safe.toLocaleString();
  }
}

// ============================================================
// DATA HELPERS
// ============================================================

function parseJSON(value, fallback = null) {
  if (value == null || value === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function asObject(value) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value
    : {};
}

function nonnegative(value, fallback = 0) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, number)
    : fallback;
}

function optionalNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

function clampNumber(
  value,
  minimum = 0,
  maximum = 100
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(minimum, number)
  );
}

function getLocalDateKey(date = new Date()) {
  return (
    `${date.getFullYear()}-` +
    `${String(date.getMonth() + 1).padStart(2, "0")}-` +
    `${String(date.getDate()).padStart(2, "0")}`
  );
}

function calculateGreeting(language) {
  const hour = new Date().getHours();

  return getText(
    language,
    hour < 12
      ? "goodMorning"
      : hour < 18
      ? "goodAfternoon"
      : "goodEvening"
  );
}

async function getFirstStoredValue(keys) {
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

// ============================================================
// DAILY STEPS
//
// Same source, date check, and goal as WalkingDashboard.
//
// This screen never writes step totals.
// It never creates its own pedometer subscription.
// ============================================================

function readDailySteps(raw) {
  if (!raw) {
    throw new Error("Step statistics are unavailable.");
  }

  const stats = JSON.parse(raw);

  if (
    !stats ||
    typeof stats !== "object" ||
    Array.isArray(stats)
  ) {
    throw new Error("Invalid step statistics.");
  }

  if (
    typeof stats.dateKey !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(stats.dateKey)
  ) {
    throw new Error("Invalid step statistics date.");
  }

  // Matches the Dashboard's local calendar-day check.
  if (stats.dateKey !== getLocalDateKey()) {
    return 0;
  }

  const steps = Number(stats.todaySteps ?? 0);

  if (
    !Number.isFinite(steps) ||
    steps < 0
  ) {
    throw new Error("Invalid daily step total.");
  }

  return Math.floor(steps);
}

// ============================================================
// READ WELLNESS SNAPSHOT
// ============================================================

async function readWellnessSnapshot(
  language,
  activeJourneyProp
) {
  const [
    savedProfile,
    savedStats,
    savedJourney,
    savedHydration,
    savedSleep,
    savedRecovery,
    savedStreak,
  ] = await Promise.all([
    getFirstStoredValue([
      "userProfile",
      "profile",
      "legathonWalkProfile",
    ]),

    AsyncStorage.getItem(STEP_STATS_KEY),

    getFirstStoredValue([
      "activeJourney",
      "currentJourney",
    ]),

    getFirstStoredValue([
      "hydrationData",
      "dailyHydration",
    ]),

    getFirstStoredValue([
      "sleepData",
      "dailySleep",
    ]),

    getFirstStoredValue([
      "recoveryData",
      "dailyRecovery",
    ]),

    getFirstStoredValue([
      "walkingStreak",
      "currentStreak",
    ]),
  ]);

  const profile = asObject(
    parseJSON(savedProfile, {})
  );

  const hydrationData = asObject(
    parseJSON(savedHydration, {})
  );

  const sleepData = asObject(
    parseJSON(savedSleep, {})
  );

  const recoveryData = asObject(
    parseJSON(savedRecovery, {})
  );

  const storedJourney = parseJSON(
    savedJourney,
    null
  );

  const candidateJourney =
    activeJourneyProp || storedJourney;

  const journey =
    candidateJourney &&
    typeof candidateJourney === "object" &&
    !Array.isArray(candidateJourney)
      ? candidateJourney
      : null;

  let steps = null;
  let stepError = false;

  try {
    steps = readDailySteps(savedStats);
  } catch (error) {
    stepError = true;
  }

  const hydration = nonnegative(
    hydrationData.amount ??
      hydrationData.ounces ??
      hydrationData.hydration ??
      hydrationData.current ??
      hydrationData.todayAmount,
    0
  );

  const hydrationGoal = Math.max(
    1,
    nonnegative(
      hydrationData.goal ??
        hydrationData.hydrationGoal ??
        hydrationData.dailyGoal,
      DEFAULT_HYDRATION_GOAL
    ) || DEFAULT_HYDRATION_GOAL
  );

  const rawRecovery = optionalNumber(
    recoveryData.score
  );

  const recovery =
    rawRecovery === null
      ? null
      : clampNumber(rawRecovery);

  const sleepHours = optionalNumber(
    sleepData.hours
  );

  const streakData = parseJSON(
    savedStreak,
    null
  );

  const rawStreak =
    streakData &&
    typeof streakData === "object"
      ? streakData.streak ??
        streakData.days ??
        streakData.value ??
        0
      : streakData ?? savedStreak ?? 0;

  const streak = Math.floor(
    nonnegative(rawStreak)
  );

  const checkpointNumber = optionalNumber(
    journey?.currentCheckpoint ??
      journey?.checkpoint
  );

  const checkpoint =
    checkpointNumber !== null &&
    checkpointNumber > 0
      ? Math.min(
          5,
          Math.floor(checkpointNumber)
        )
      : null;

  return {
    userName:
      profile.userName ||
      profile.username ||
      profile.name ||
      "",

    greeting: calculateGreeting(language),

    steps,

    // WalkingDashboard currently uses this fixed goal.
    stepGoal: DEFAULT_STEP_GOAL,

    recovery,
    sleepHours,

    hydration,
    hydrationGoal,

    // Same estimate used by WalkingDashboard.
    calories:
      steps === null
        ? null
        : Math.round(steps * 0.04),

    stress:
      recoveryData.stress ??
      recoveryData.stressLevel ??
      profile.stressLevel ??
      null,

    streak,

    journey:
      journey?.shortTitle ||
      journey?.title ||
      journey?.name ||
      "",

    journeyFull:
      journey?.title ||
      journey?.name ||
      "",

    activeJourney: journey,

    journeyProgress: clampNumber(
      journey?.progress ??
        journey?.journeyProgress ??
        journey?.progressPercent ??
        journey?.percentComplete ??
        0
    ),

    checkpoint,

    stepError,
    loadError: false,
  };
}

// ============================================================
// SCREEN
// ============================================================

export default function AIWellnessMasterScreen({
  navigation,

  language = "en",

  goBack,

  goToNotifications,
  goToSubscription,
  goToAIConversation,

  goToHydration,
  goToRecovery,
  goToSleep,
  goToBreathing,
  goToMealPlanner,

  goToGPSJourneyMap,
  goToJourneys,
  goToJourneyStory,

  goToWalkingAnalytics,
  goToWalkHistory,
  goToGoals,

  activeJourney: activeJourneyProp = null,

  userPlan = "free",
}) {
  const currentLanguage =
    normalizeLanguage(language);

  const isRTL = currentLanguage === "ar";

  const t = useCallback(
    (key, variables = {}) =>
      getText(currentLanguage, key, variables),
    [currentLanguage]
  );

  const [wellness, setWellness] =
    useState(INITIAL_WELLNESS);

  const [isLoading, setIsLoading] =
    useState(true);

  const pulse = useRef(
    new Animated.Value(1)
  ).current;

  const rotate = useRef(
    new Animated.Value(0)
  ).current;

  const glow = useRef(
    new Animated.Value(0)
  ).current;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const runAction = useCallback(
    (callback, screenName, params) => {
      if (typeof callback === "function") {
        callback(params);
        return;
      }

      if (
        typeof navigation?.navigate === "function"
      ) {
        navigation.navigate(screenName, params);
        return;
      }

      console.warn(
        `${screenName} is not connected.`
      );
    },
    [navigation]
  );

  const handleBack = () => {
    if (typeof goBack === "function") {
      goBack();
      return;
    }

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("More");
  };

  const handleNotifications = () => {
    runAction(
      goToNotifications,
      "NotificationSettings"
    );
  };

  const handleTextCoach = () => {
    runAction(
      goToAIConversation,
      "aiConversation"
    );
  };

  const handleHydration = () => {
    runAction(
      goToHydration,
      "HydrationCoach"
    );
  };

  const handleRecovery = () => {
    runAction(
      goToRecovery,
      "RecoveryCoach"
    );
  };

  const handleSleep = () => {
    runAction(
      goToSleep,
      "SleepCoach"
    );
  };

  const handleBreathing = () => {
    runAction(
      goToBreathing,
      "StressBreathingCoach"
    );
  };

  const handleMealPlanner = () => {
    runAction(
      goToMealPlanner,
      "MealPlanner"
    );
  };

  const handleWalkingAnalytics = () => {
    runAction(
      goToWalkingAnalytics,
      "WalkingAnalytics"
    );
  };

  const handleGoals = () => {
    runAction(
      goToGoals,
      "WellnessGoals"
    );
  };

  const handleStartWalk = async () => {
    try {
      let journey =
        wellness.activeJourney ||
        activeJourneyProp ||
        null;

      if (!journey) {
        const raw = await getFirstStoredValue([
          "activeJourney",
          "currentJourney",
        ]);

        const stored = parseJSON(raw, null);

        if (
          stored &&
          typeof stored === "object" &&
          !Array.isArray(stored)
        ) {
          journey = stored;
        }
      }

      if (journey) {
        runAction(
          goToGPSJourneyMap,
          "GPSJourneyMap",
          { journey }
        );

        return;
      }

      runAction(
        goToJourneys,
        "Journeys"
      );
    } catch (error) {
      console.log(
        "AI Wellness journey navigation error:",
        error
      );

      runAction(
        goToJourneys,
        "Journeys"
      );
    }
  };

  // ==========================================================
  // ANIMATIONS
  // ==========================================================

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      })
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),

        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulse, rotate, glow]);

  // ==========================================================
  // AUTOMATIC WELLNESS REFRESH
  //
  // Reads the engine's saved record every 1.5 seconds.
  // Prevents overlapping refreshes and updates after unmount.
  // ==========================================================

  useEffect(() => {
    let disposed = false;
    let refreshing = false;
    let refreshAgain = false;

    let foreground =
      AppState.currentState !== "background" &&
      AppState.currentState !== "inactive";

    async function refresh() {
      if (disposed || !foreground) {
        return;
      }

      if (refreshing) {
        refreshAgain = true;
        return;
      }

      refreshing = true;

      try {
        const snapshot =
          await readWellnessSnapshot(
            currentLanguage,
            activeJourneyProp
          );

        if (!disposed) {
          setWellness(snapshot);
        }
      } catch (error) {
        console.log(
          "AI Wellness refresh error:",
          error
        );

        if (!disposed) {
          setWellness((current) => ({
            ...current,

            greeting:
              calculateGreeting(currentLanguage),

            // Avoid presenting an old daily count as current.
            steps: null,
            calories: null,

            stepError: true,
            loadError: true,
          }));
        }
      } finally {
        refreshing = false;

        if (!disposed) {
          setIsLoading(false);
        }

        if (
          refreshAgain &&
          !disposed &&
          foreground
        ) {
          refreshAgain = false;
          void refresh();
        }
      }
    }

    void refresh();

    const timer = setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL_MS);

    const appStateSubscription =
      AppState.addEventListener(
        "change",
        (nextState) => {
          foreground = nextState === "active";

          if (foreground) {
            void refresh();
          }
        }
      );

    const unsubscribeFocus =
      navigation?.addListener?.(
        "focus",
        () => {
          void refresh();
        }
      );

    return () => {
      disposed = true;

      clearInterval(timer);
      appStateSubscription.remove();

      if (
        typeof unsubscribeFocus === "function"
      ) {
        unsubscribeFocus();
      }
    };
  }, [
    currentLanguage,
    activeJourneyProp,
    navigation,
  ]);

  // ==========================================================
  // ANIMATION VALUES
  // ==========================================================

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseSpin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.8],
  });

  // ==========================================================
  // DISPLAY VALUES
  // ==========================================================

  const stepsAvailable =
    wellness.steps !== null &&
    !wellness.stepError &&
    !wellness.loadError;

  const stepsRemaining = stepsAvailable
    ? Math.max(
        0,
        wellness.stepGoal - wellness.steps
      )
    : null;

  const stepProgress = stepsAvailable
    ? clampNumber(
        (wellness.steps / wellness.stepGoal) * 100
      )
    : 0;

  const hydrationProgress = clampNumber(
    (wellness.hydration /
      wellness.hydrationGoal) * 100
  );

  const recoveryProgress =
    wellness.recovery === null
      ? 0
      : clampNumber(wellness.recovery);

  const sleepProgress =
    wellness.sleepHours === null
      ? 0
      : clampNumber(
          (wellness.sleepHours / 8) * 100
        );

  const calorieGoal =
    wellness.stepGoal * 0.04;

  const calorieProgress =
    wellness.calories === null
      ? 0
      : clampNumber(
          (wellness.calories / calorieGoal) * 100
        );

  const aiMessage = isLoading
    ? t("loading")
    : wellness.loadError
    ? t("unavailable")
    : !stepsAvailable
    ? t("stepsUnavailable")
    : stepsRemaining > 0
    ? t("goalMessageRemaining", {
        steps: formatNumber(
          stepsRemaining,
          currentLanguage
        ),
      })
    : t("goalMessageComplete");

  const insightMessage = useMemo(() => {
    if (isLoading) {
      return t("loading");
    }

    if (!stepsAvailable) {
      return t("stepsUnavailable");
    }

    if (wellness.steps <= 0) {
      return t("startShortWalk");
    }

    if (stepsRemaining === 0) {
      return t("completedGoal");
    }

    return t("stepsAway", {
      steps: formatNumber(
        stepsRemaining,
        currentLanguage
      ),
    });
  }, [
    isLoading,
    stepsAvailable,
    wellness.steps,
    stepsRemaining,
    currentLanguage,
    t,
  ]);

  // Preserves the original data-availability calculation.
  const aiConfidence = useMemo(() => {
    let score = 0;

    if (
      stepsAvailable &&
      wellness.steps > 0
    ) {
      score += 30;
    }

    if (wellness.hydration > 0) {
      score += 20;
    }

    if (wellness.recovery !== null) {
      score += 20;
    }

    if (wellness.sleepHours !== null) {
      score += 20;
    }

    if (wellness.journey) {
      score += 10;
    }

    return clampNumber(score);
  }, [
    stepsAvailable,
    wellness.steps,
    wellness.hydration,
    wellness.recovery,
    wellness.sleepHours,
    wellness.journey,
  ]);

  const recoveryTrend = useMemo(() => {
    if (wellness.recovery === null) {
      return t("recoveryNotRecorded");
    }

    if (wellness.recovery >= 90) {
      return t("excellentRecovery");
    }

    if (wellness.recovery >= 75) {
      return t("recoveryImproving");
    }

    if (wellness.recovery >= 60) {
      return t("moderateRecovery");
    }

    return t("recoveryNeedsAttention");
  }, [wellness.recovery, t]);

  const recoveryColor =
    wellness.recovery === null
      ? "#AAB8C8"
      : wellness.recovery < 60
      ? "#FFB85C"
      : "#44F58A";

  const checkpointText =
    wellness.checkpoint !== null
      ? t("checkpointOf", {
          checkpoint: wellness.checkpoint,
        })
      : t("journeyInProgress");

  const stepValue = stepsAvailable
    ? `${formatNumber(
        wellness.steps,
        currentLanguage
      )} / ${formatNumber(
        wellness.stepGoal,
        currentLanguage
      )}`
    : `— / ${formatNumber(
        wellness.stepGoal,
        currentLanguage
      )}`;

  const stats = [
    {
      key: "steps",
      icon: "walk",
      title: t("steps"),
      value: stepValue,
      progress: stepProgress,
      color: "#44F58A",
      onPress: handleWalkingAnalytics,
    },

    {
      key: "hydration",
      icon: "water",
      title: t("hydration"),

      value:
        `${wellness.hydration} / ` +
        `${wellness.hydrationGoal} oz`,

      progress: hydrationProgress,
      color: "#38D6FF",
      onPress: handleHydration,
    },

    {
      key: "recovery",
      icon: "heart",
      title: t("recovery"),

      value:
        wellness.recovery === null
          ? t("notRecorded")
          : `${Math.round(wellness.recovery)}%`,

      progress: recoveryProgress,
      color: "#FF5A6A",
      onPress: handleRecovery,
    },

    {
      key: "sleep",
      icon: "moon",
      title: t("sleep"),

      value:
        wellness.sleepHours === null
          ? t("notRecorded")
          : `${wellness.sleepHours.toFixed(1)}h`,

      progress: sleepProgress,
      color: "#A66CFF",
      onPress: handleSleep,
    },

    {
      key: "calories",
      icon: "flame",
      title: t("calories"),

      value:
        wellness.calories === null
          ? "—"
          : formatNumber(
              wellness.calories,
              currentLanguage
            ),

      progress: calorieProgress,
      color: "#FF9F1C",
      onPress: handleWalkingAnalytics,
    },

    {
      key: "journey",
      icon: "map",
      title: t("journey"),

      value:
        wellness.journey ||
        t("noActiveJourney"),

      progress: wellness.journeyProgress,
      color: "#2D7FF9",
      onPress: handleStartWalk,
    },

    {
      key: "streak",
      icon: "trophy",
      title: t("streak"),

      value:
        `${formatNumber(
          wellness.streak,
          currentLanguage
        )} ${t("days")}`,

      progress: clampNumber(
        (wellness.streak / 7) * 100
      ),

      color: "#F7C948",
      onPress: handleGoals,
    },
  ];

  // ==========================================================
  // UI
  // ==========================================================

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>
                LEGATHON AI
              </Text>

              <Text style={styles.headerSubtitle}>
                {t("wellness")}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotifications}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* HERO */}

          <LinearGradient
            colors={[
              "rgba(45,127,249,0.24)",
              "rgba(9,26,48,0.94)",
              "#061326",
            ]}
            style={styles.heroCard}
          >
            <Text style={styles.smallLabel}>
              {`${wellness.greeting || t("welcome")} ${
                wellness.userName || t("walker")
              }`.toUpperCase()}
            </Text>

            <Text style={styles.heroTitle}>
              {t("aiWellnessCoach")}
            </Text>

            <Text style={styles.heroText}>
              {t("heroDescription")}
            </Text>

            <View style={styles.orbWrap}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.orbGlow,
                  { opacity: glowOpacity },
                ]}
              />

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.orbOuter,
                  {
                    transform: [
                      { rotate: spin },
                    ],
                  },
                ]}
              />

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.orbMiddle,
                  {
                    transform: [
                      { rotate: reverseSpin },
                    ],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.orbInner,
                  {
                    transform: [
                      { scale: pulse },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="brain"
                  size={54}
                  color="#9DFFCF"
                />

                <Text style={styles.orbScoreLabel}>
                  {t("aiCoach")}
                </Text>
              </Animated.View>
            </View>

            <View style={styles.aiStatusRow}>
              <View style={styles.statusDot} />

              <Text style={styles.aiStatusText}>
                {t("aiReady")}
              </Text>
            </View>

            <Text
              style={styles.aiStatusMessage}
              accessibilityLiveRegion="polite"
            >
              {aiMessage}
            </Text>

            <TouchableOpacity
              style={styles.textCoachButton}
              activeOpacity={0.85}
              onPress={handleTextCoach}
              accessibilityRole="button"
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={26}
                color="#020611"
              />

              <Text
                style={styles.textCoachButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t("messageCoach")}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color="#020611"
              />
            </TouchableOpacity>

            <View style={styles.heroActions}>
              <HeroAction
                icon="walk"
                title={t("walk")}
                onPress={handleStartWalk}
              />

              <HeroAction
                icon="leaf"
                title={t("calm")}
                onPress={handleBreathing}
              />

              <HeroAction
                icon="restaurant"
                title={t("meal")}
                onPress={handleMealPlanner}
              />
            </View>
          </LinearGradient>

          {/* TODAY'S WELLNESS */}

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("todaysWellness")}
          </Text>

          {!isLoading &&
            (wellness.stepError ||
              wellness.loadError) && (
              <Text
                style={[
                  styles.errorText,
                  isRTL && styles.rtlText,
                ]}
                accessibilityRole="alert"
              >
                {wellness.loadError
                  ? t("unavailable")
                  : t("stepsUnavailable")}
              </Text>
            )}

          <View style={styles.quickStatsGrid}>
            {stats.map((stat) => (
              <QuickStatCard
                key={stat.key}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                progress={stat.progress}
                color={stat.color}
                onPress={stat.onPress}
                isRTL={isRTL}
              />
            ))}
          </View>

          {/* AI INSIGHT */}

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("aiInsight")}
          </Text>

          <AIInsightCard
            title={t("todaysRecommendation")}
            message={insightMessage}
            confidence={aiConfidence}
            confidenceLabel={t("confidence")}
            trend={recoveryTrend}
            trendColor={recoveryColor}
            action={t("startWalk")}
            onPress={handleStartWalk}
            isRTL={isRTL}
          />

          {/* ACTIVITY FEED */}

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("aiActivityFeed")}
          </Text>

          <View style={styles.activityContainer}>
            <ActivityItem
              icon="walk"
              color="#44F58A"
              title={t("walkProgress")}
              subtitle={
                isLoading
                  ? t("loading")
                  : stepsAvailable
                  ? t("walkedToday", {
                      steps: formatNumber(
                        wellness.steps,
                        currentLanguage
                      ),
                    })
                  : t("stepsUnavailable")
              }
              time={
                stepsAvailable
                  ? t("today")
                  : ""
              }
              isRTL={isRTL}
            />

            <ActivityItem
              icon="flag"
              color="#2D7FF9"
              title={t("journeyProgress")}
              subtitle={
                wellness.journey
                  ? `${checkpointText} — ${wellness.journey}`
                  : t("noActiveJourneyPeriod")
              }
              time={
                wellness.journey
                  ? t("today")
                  : ""
              }
              isRTL={isRTL}
            />

            <ActivityItem
              icon="heart"
              color="#FF5A6A"
              title={t("recovery")}
              subtitle={
                wellness.recovery !== null
                  ? t("recoveryScore", {
                      score: Math.round(
                        wellness.recovery
                      ),
                    })
                  : t("recoveryNotRecordedPeriod")
              }
              time={
                wellness.recovery !== null
                  ? t("today")
                  : ""
              }
              isRTL={isRTL}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ============================================================
// HERO ACTION
// ============================================================

function HeroAction({
  icon,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.heroAction}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <Ionicons
        name={icon}
        size={24}
        color="#020611"
      />

      <Text
        style={styles.heroActionText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// QUICK STAT CARD
// ============================================================

function QuickStatCard({
  icon,
  title,
  value,
  progress,
  color,
  onPress,
  isRTL = false,
}) {
  const safeProgress =
    clampNumber(progress);

  return (
    <TouchableOpacity
      style={styles.quickStatCard}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <View style={styles.quickStatTop}>
        <Ionicons
          name={icon}
          size={24}
          color={color}
        />

        <Text
          style={[
            styles.quickStatTitle,
            isRTL && styles.rtlText,
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.quickStatValue,
          isRTL && styles.rtlText,
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <View style={styles.quickProgressTrack}>
        <View
          style={[
            styles.quickProgressFill,
            {
              width: `${safeProgress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// AI INSIGHT CARD
// ============================================================

function AIInsightCard({
  title,
  message,
  confidence,
  confidenceLabel,
  trend,
  trendColor,
  action,
  onPress,
  isRTL = false,
}) {
  return (
    <LinearGradient
      colors={[
        "#0A2442",
        "#08192F",
        "#051120",
      ]}
      style={styles.insightCard}
    >
      <View style={styles.insightHeader}>
        <View style={styles.aiBadge}>
          <Ionicons
            name="sparkles"
            size={18}
            color="#F7C948"
          />

          <Text style={styles.aiBadgeText}>
            LEGATHON AI
          </Text>
        </View>

        <View style={styles.confidenceBox}>
          <Text style={styles.confidenceNumber}>
            {confidence}%
          </Text>

          <Text style={styles.confidenceLabel}>
            {confidenceLabel}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.insightTitle,
          isRTL && styles.rtlText,
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.insightMessage,
          isRTL && styles.rtlText,
        ]}
      >
        {message}
      </Text>

      <View style={styles.trendRow}>
        <Ionicons
          name="heart-outline"
          size={18}
          color={trendColor}
        />

        <Text
          style={[
            styles.trendText,
            { color: trendColor },
            isRTL && styles.rtlText,
          ]}
        >
          {trend}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.insightButton}
        onPress={onPress}
        accessibilityRole="button"
      >
        <Ionicons
          name="walk"
          size={22}
          color="#020611"
        />

        <Text style={styles.insightButtonText}>
          {action}
        </Text>

        <Ionicons
          name="arrow-forward"
          size={18}
          color="#020611"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ============================================================
// ACTIVITY ITEM
// ============================================================

function ActivityItem({
  icon,
  color,
  title,
  subtitle,
  time,
  isRTL = false,
}) {
  return (
    <View style={styles.activityCard}>
      <View
        style={[
          styles.activityIcon,
          {
            backgroundColor: `${color}20`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={color}
        />
      </View>

      <View style={styles.activityCopy}>
        <Text
          style={[
            styles.activityTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.activitySubtitle,
            isRTL && styles.rtlText,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {!!time && (
        <Text style={styles.activityTime}>
          {time}
        </Text>
      )}
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 220,
  },

  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  headerSubtitle: {
    color: "#F7C948",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 3,
  },

  heroCard: {
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },

  smallLabel: {
    color: "#F7C948",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    textAlign: "center",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  heroText: {
    color: "#B8C5D6",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 340,
  },

  orbWrap: {
    width: 218,
    height: 218,
    marginVertical: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  orbGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#44F58A",
  },

  orbOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#2D7FF9",
    borderStyle: "dashed",
  },

  orbMiddle: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 3,
    borderColor: "#F7C948",
    borderStyle: "dotted",
  },

  orbInner: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: "#061326",
    borderWidth: 2,
    borderColor: "#44F58A",
    justifyContent: "center",
    alignItems: "center",
  },

  orbScoreLabel: {
    color: "#44F58A",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },

  aiStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(68,245,138,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#44F58A",
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#44F58A",
    marginRight: 8,
  },

  aiStatusText: {
    color: "#9DFFCF",
    fontSize: 13,
    fontWeight: "900",
  },

  aiStatusMessage: {
    color: "#DCE7F5",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 16,
    maxWidth: 340,
  },

  textCoachButton: {
    width: "100%",
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: "#F7C948",
    marginTop: 22,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  textCoachButtonText: {
    flexShrink: 1,
    color: "#020611",
    fontSize: 16,
    fontWeight: "900",
    marginHorizontal: 10,
    textAlign: "center",
  },

  heroActions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  heroAction: {
    width: "31%",
    minHeight: 74,
    borderRadius: 20,
    backgroundColor: "#F7C948",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  heroActionText: {
    color: "#020611",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 6,
    textAlign: "center",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },

  errorText: {
    color: "#F7C948",
    fontSize: 13,
    lineHeight: 20,
    marginHorizontal: 20,
    marginBottom: 14,
  },

  quickStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  quickStatCard: {
    width: "48%",
    minHeight: 170,
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    backgroundColor: "#091A30",
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  quickStatTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  quickStatTitle: {
    flex: 1,
    color: "#AAB8C8",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 8,
  },

  quickStatValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
  },

  quickProgressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    marginTop: 14,
    overflow: "hidden",
  },

  quickProgressFill: {
    height: "100%",
    borderRadius: 8,
  },

  insightCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(247,201,72,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
  },

  aiBadgeText: {
    color: "#F7C948",
    marginLeft: 8,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },

  confidenceBox: {
    alignItems: "center",
    marginBottom: 8,
  },

  confidenceNumber: {
    color: "#44F58A",
    fontSize: 28,
    fontWeight: "900",
  },

  confidenceLabel: {
    color: "#AAB8C8",
    fontSize: 11,
    fontWeight: "700",
  },

  insightTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 20,
  },

  insightMessage: {
    color: "#C7D5E4",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
  },

  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  trendText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
  },

  insightButton: {
    marginTop: 24,
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: "#F7C948",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  insightButtonText: {
    flexShrink: 1,
    color: "#020611",
    fontSize: 16,
    fontWeight: "900",
    marginHorizontal: 10,
    textAlign: "center",
  },

  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#091A30",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  activityCopy: {
    flex: 1,
    minWidth: 0,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  activitySubtitle: {
    color: "#AAB8C8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  activityTime: {
    color: "#7A8EA6",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
    maxWidth: 90,
  },
});