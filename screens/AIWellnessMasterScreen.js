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

import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_STEP_GOAL = 7000;
const DEFAULT_HYDRATION_GOAL = 100;

const INITIAL_WELLNESS = {
  userName: "Walker",
  greeting: "",

  steps: 0,
  stepGoal: DEFAULT_STEP_GOAL,
  stepsRemaining: DEFAULT_STEP_GOAL,

  recovery: null,
  sleepHours: null,

  hydration: 0,
  hydrationGoal: DEFAULT_HYDRATION_GOAL,

  calories: 0,
  stress: null,

  wellnessScore: null,
  wellnessLabel: "",

  streak: 0,

  journey: "",
  journeyFull: "",
  activeJourney: null,
  journeyProgress: 0,
  checkpoint: "",

  aiMessage: "",
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

    wellnessOverview: "Wellness Overview",
    aiWellnessSummary: "AI Wellness Summary",

    wellnessSummary:
      "Your wellness dashboard uses your stored walking, hydration, recovery, sleep, and journey information to help guide your next step.",

    stress: "Stress",

    aiCoachingTools: "AI Coaching Tools",
    mealPlan: "Meal Plan",
    breathing: "Breathing",
    motivation: "Motivation",

    journeyCoach: "Journey Coach",
    currentJourney: "CURRENT JOURNEY",

    checkpointProgress:
      "Checkpoint {checkpoint} • {progress}% complete",

    continueJourney: "Continue Journey",

    aiRoutePlan: "AI Route Plan",
    nextCheckpoint: "Next Checkpoint",
    nextCheckpointMessage:
      "Continue walking toward your next journey checkpoint.",

    suggestedPace: "Suggested Pace",
    suggestedPaceMessage:
      "Keep a comfortable, steady walking pace.",

    dailyGoal: "Daily Goal",
    dailyGoalMessage:
      "Walk {steps} steps today.",

    thisWeek: "This week",
    ai: "AI",

    goalMessageRemaining:
      "You are {steps} steps from today's goal.",

    goalMessageComplete:
      "You completed today's step goal.",

    unavailable:
      "Wellness information is temporarily unavailable.",

    recoveryTrend: "Recovery: {trend}",

    plan: "PLAN",

    eliteAI: "ELITE AI",
    unlockFullCoach: "Unlock Your Full AI Coach",

    eliteDescription:
      "Premium coaching, personalized wellness intelligence, and exclusive AI-powered tools.",

    advancedAnalytics: "Advanced Analytics",
    advancedAnalyticsDescription:
      "Detailed wellness trends and predictions.",

    recoveryForecast: "Recovery Forecast",
    recoveryForecastDescription:
      "AI-powered recovery and readiness insights.",

    journeyNarrator: "Journey Narrator",
    journeyNarratorDescription:
      "Historical storytelling during every Legathon Journey.",

    mealPlanning: "Meal Planning",
    mealPlanningDescription:
      "Personalized nutrition recommendations.",

    aiMemory: "AI Memory",
    aiMemoryDescription:
      "A coach that remembers your habits and goals.",

    learnMore: "Learn More",
    upgrade: "Upgrade",
  },

  es: {
    walker: "Caminante",

    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    welcome: "Bienvenido",

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
    recoveryNeedsAttention: "La recuperación necesita atención",

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

    recoveryScore: "Puntuación de recuperación: {score}%.",
    recoveryNotRecordedPeriod: "Recuperación no registrada.",

    today: "Hoy",

    wellnessOverview: "Resumen de Bienestar",
    aiWellnessSummary: "Resumen de Bienestar con IA",

    wellnessSummary:
      "Tu panel utiliza tus datos guardados de caminata, hidratación, recuperación, sueño y viajes para ayudarte a decidir tu próximo paso.",

    stress: "Estrés",

    aiCoachingTools: "Herramientas de Coaching IA",
    mealPlan: "Plan de Comidas",
    breathing: "Respiración",
    motivation: "Motivación",

    journeyCoach: "Coach de Viaje",
    currentJourney: "VIAJE ACTUAL",

    checkpointProgress:
      "Punto de control {checkpoint} • {progress}% completado",

    continueJourney: "Continuar Viaje",

    aiRoutePlan: "Plan de Ruta con IA",
    nextCheckpoint: "Próximo Punto de Control",
    nextCheckpointMessage:
      "Continúa caminando hacia tu próximo punto de control.",

    suggestedPace: "Ritmo Sugerido",
    suggestedPaceMessage:
      "Mantén un ritmo cómodo y constante.",

    dailyGoal: "Meta Diaria",
    dailyGoalMessage:
      "Camina {steps} pasos hoy.",

    thisWeek: "Esta semana",
    ai: "IA",

    goalMessageRemaining:
      "Estás a {steps} pasos de la meta de hoy.",

    goalMessageComplete:
      "Completaste la meta de pasos de hoy.",

    unavailable:
      "La información de bienestar no está disponible temporalmente.",

    recoveryTrend: "Recuperación: {trend}",

    plan: "PLAN",

    eliteAI: "IA ELITE",
    unlockFullCoach: "Desbloquea Tu Coach de IA Completo",

    eliteDescription:
      "Coaching premium, inteligencia de bienestar personalizada y herramientas exclusivas con IA.",

    advancedAnalytics: "Análisis Avanzado",
    advancedAnalyticsDescription:
      "Tendencias y predicciones detalladas de bienestar.",

    recoveryForecast: "Pronóstico de Recuperación",
    recoveryForecastDescription:
      "Información de recuperación y preparación impulsada por IA.",

    journeyNarrator: "Narrador de Viaje",
    journeyNarratorDescription:
      "Historias durante cada viaje de Legathon.",

    mealPlanning: "Planificación de Comidas",
    mealPlanningDescription:
      "Recomendaciones nutricionales personalizadas.",

    aiMemory: "Memoria IA",
    aiMemoryDescription:
      "Un coach que recuerda tus hábitos y objetivos.",

    learnMore: "Más Información",
    upgrade: "Mejorar",
  },

  fr: {
    walker: "Marcheur",

    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    welcome: "Bienvenue",

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
    recoveryNeedsAttention: "La récupération mérite votre attention",

    startShortWalk:
      "Commencez par une courte marche aujourd’hui pour développer votre progression bien-être.",

    completedGoal:
      "Vous avez atteint votre objectif de pas. Concentrez-vous maintenant sur l’hydratation, la récupération et un sommeil de qualité.",

    stepsAway:
      "Il vous reste {steps} pas pour atteindre votre objectif aujourd’hui.",

    aiActivityFeed: "Activité IA",

    walkProgress: "Progression de Marche",
    walkedToday: "Vous avez marché {steps} pas aujourd’hui.",

    journeyProgress: "Progression du Voyage",
    journeyInProgress: "Voyage en cours",
    noActiveJourneyPeriod: "Aucun voyage actif.",

    recoveryScore: "Score de récupération : {score}%.",
    recoveryNotRecordedPeriod: "Récupération non enregistrée.",

    today: "Aujourd’hui",

    wellnessOverview: "Aperçu du Bien-être",
    aiWellnessSummary: "Résumé Bien-être IA",

    wellnessSummary:
      "Votre tableau utilise vos données de marche, hydratation, récupération, sommeil et voyage pour vous guider.",

    stress: "Stress",

    aiCoachingTools: "Outils de Coaching IA",
    mealPlan: "Plan de Repas",
    breathing: "Respiration",
    motivation: "Motivation",

    journeyCoach: "Coach de Voyage",
    currentJourney: "VOYAGE ACTUEL",

    checkpointProgress:
      "Point de contrôle {checkpoint} • {progress}% terminé",

    continueJourney: "Continuer le Voyage",

    aiRoutePlan: "Plan de Route IA",
    nextCheckpoint: "Prochain Point de Contrôle",
    nextCheckpointMessage:
      "Continuez à marcher vers votre prochain point de contrôle.",

    suggestedPace: "Rythme Suggéré",
    suggestedPaceMessage:
      "Maintenez un rythme confortable et régulier.",

    dailyGoal: "Objectif Quotidien",
    dailyGoalMessage:
      "Marchez {steps} pas aujourd’hui.",

    thisWeek: "Cette semaine",
    ai: "IA",

    goalMessageRemaining:
      "Il vous reste {steps} pas avant l’objectif du jour.",

    goalMessageComplete:
      "Vous avez atteint votre objectif de pas aujourd’hui.",

    unavailable:
      "Les informations de bien-être sont temporairement indisponibles.",

    recoveryTrend: "Récupération : {trend}",

    plan: "FORMULE",

    eliteAI: "IA ELITE",
    unlockFullCoach: "Débloquez Votre Coach IA Complet",

    eliteDescription:
      "Coaching premium, intelligence personnalisée et outils IA exclusifs.",

    advancedAnalytics: "Analyses Avancées",
    advancedAnalyticsDescription:
      "Tendances et prévisions détaillées.",

    recoveryForecast: "Prévision de Récupération",
    recoveryForecastDescription:
      "Informations IA sur la récupération et la préparation.",

    journeyNarrator: "Narrateur de Voyage",
    journeyNarratorDescription:
      "Récits historiques pendant chaque voyage Legathon.",

    mealPlanning: "Planification des Repas",
    mealPlanningDescription:
      "Recommandations nutritionnelles personnalisées.",

    aiMemory: "Mémoire IA",
    aiMemoryDescription:
      "Un coach qui se souvient de vos habitudes et objectifs.",

    learnMore: "En Savoir Plus",
    upgrade: "Améliorer",
  },

  de: {
    walker: "Walker",

    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    welcome: "Willkommen",

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
    recoveryNeedsAttention: "Erholung braucht Aufmerksamkeit",

    startShortWalk:
      "Beginne heute mit einem kurzen Spaziergang, um deinen Wellness-Fortschritt aufzubauen.",

    completedGoal:
      "Du hast dein heutiges Schrittziel erreicht. Konzentriere dich auf Flüssigkeit, Erholung und guten Schlaf.",

    stepsAway:
      "Du bist noch {steps} Schritte vom heutigen Ziel entfernt.",

    aiActivityFeed: "KI-Aktivitäten",

    walkProgress: "Gehfortschritt",
    walkedToday: "Du bist heute {steps} Schritte gegangen.",

    journeyProgress: "Reisefortschritt",
    journeyInProgress: "Reise läuft",
    noActiveJourneyPeriod: "Keine aktive Reise.",

    recoveryScore: "Erholungswert: {score}%.",
    recoveryNotRecordedPeriod: "Erholung nicht erfasst.",

    today: "Heute",

    wellnessOverview: "Wellness-Übersicht",
    aiWellnessSummary: "KI-Wellness-Zusammenfassung",

    wellnessSummary:
      "Dein Dashboard verwendet deine gespeicherten Geh-, Hydrations-, Erholungs-, Schlaf- und Reisedaten.",

    stress: "Stress",

    aiCoachingTools: "KI-Coaching-Tools",
    mealPlan: "Essensplan",
    breathing: "Atmung",
    motivation: "Motivation",

    journeyCoach: "Reise-Coach",
    currentJourney: "AKTUELLE REISE",

    checkpointProgress:
      "Checkpoint {checkpoint} • {progress}% abgeschlossen",

    continueJourney: "Reise Fortsetzen",

    aiRoutePlan: "KI-Routenplan",
    nextCheckpoint: "Nächster Checkpoint",
    nextCheckpointMessage:
      "Gehe weiter in Richtung deines nächsten Checkpoints.",

    suggestedPace: "Empfohlenes Tempo",
    suggestedPaceMessage:
      "Halte ein angenehmes, gleichmäßiges Tempo.",

    dailyGoal: "Tagesziel",
    dailyGoalMessage:
      "Gehe heute {steps} Schritte.",

    thisWeek: "Diese Woche",
    ai: "KI",

    goalMessageRemaining:
      "Noch {steps} Schritte bis zum heutigen Ziel.",

    goalMessageComplete:
      "Du hast dein heutiges Schrittziel erreicht.",

    unavailable:
      "Wellness-Informationen sind vorübergehend nicht verfügbar.",

    recoveryTrend: "Erholung: {trend}",

    plan: "PLAN",

    eliteAI: "ELITE KI",
    unlockFullCoach: "Vollen KI-Coach Freischalten",

    eliteDescription:
      "Premium-Coaching, personalisierte Wellness-Informationen und exklusive KI-Tools.",

    advancedAnalytics: "Erweiterte Analysen",
    advancedAnalyticsDescription:
      "Detaillierte Wellness-Trends und Prognosen.",

    recoveryForecast: "Erholungsprognose",
    recoveryForecastDescription:
      "KI-gestützte Erholungs- und Bereitschaftsinformationen.",

    journeyNarrator: "Reise-Erzähler",
    journeyNarratorDescription:
      "Historische Geschichten während jeder Legathon-Reise.",

    mealPlanning: "Essensplanung",
    mealPlanningDescription:
      "Personalisierte Ernährungsempfehlungen.",

    aiMemory: "KI-Gedächtnis",
    aiMemoryDescription:
      "Ein Coach, der sich an deine Gewohnheiten und Ziele erinnert.",

    learnMore: "Mehr Erfahren",
    upgrade: "Upgrade",
  },

  pt: {
    walker: "Caminhante",

    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    goodEvening: "Boa noite",
    welcome: "Bem-vindo",

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
    recoveryNeedsAttention: "A recuperação precisa de atenção",

    startShortWalk:
      "Comece com uma caminhada curta hoje para desenvolver seu progresso de bem-estar.",

    completedGoal:
      "Você completou a meta de passos de hoje. Foque em hidratação, recuperação e sono de qualidade.",

    stepsAway:
      "Você está a {steps} passos da meta de hoje.",

    aiActivityFeed: "Atividade de IA",

    walkProgress: "Progresso da Caminhada",
    walkedToday: "Você caminhou {steps} passos hoje.",

    journeyProgress: "Progresso da Jornada",
    journeyInProgress: "Jornada em andamento",
    noActiveJourneyPeriod: "Nenhuma jornada ativa.",

    recoveryScore: "Pontuação de recuperação: {score}%.",
    recoveryNotRecordedPeriod: "Recuperação não registrada.",

    today: "Hoje",

    wellnessOverview: "Visão Geral de Bem-Estar",
    aiWellnessSummary: "Resumo de Bem-Estar com IA",

    wellnessSummary:
      "Seu painel usa seus dados de caminhada, hidratação, recuperação, sono e jornada para orientar seu próximo passo.",

    stress: "Estresse",

    aiCoachingTools: "Ferramentas de Coaching IA",
    mealPlan: "Plano Alimentar",
    breathing: "Respiração",
    motivation: "Motivação",

    journeyCoach: "Coach de Jornada",
    currentJourney: "JORNADA ATUAL",

    checkpointProgress:
      "Checkpoint {checkpoint} • {progress}% concluído",

    continueJourney: "Continuar Jornada",

    aiRoutePlan: "Plano de Rota com IA",
    nextCheckpoint: "Próximo Checkpoint",
    nextCheckpointMessage:
      "Continue caminhando em direção ao próximo checkpoint.",

    suggestedPace: "Ritmo Sugerido",
    suggestedPaceMessage:
      "Mantenha um ritmo confortável e constante.",

    dailyGoal: "Meta Diária",
    dailyGoalMessage:
      "Caminhe {steps} passos hoje.",

    thisWeek: "Esta semana",
    ai: "IA",

    goalMessageRemaining:
      "Faltam {steps} passos para a meta de hoje.",

    goalMessageComplete:
      "Você completou a meta de passos de hoje.",

    unavailable:
      "As informações de bem-estar estão temporariamente indisponíveis.",

    recoveryTrend: "Recuperação: {trend}",

    plan: "PLANO",

    eliteAI: "IA ELITE",
    unlockFullCoach: "Desbloqueie Seu Coach de IA Completo",

    eliteDescription:
      "Coaching premium, inteligência de bem-estar personalizada e ferramentas exclusivas de IA.",

    advancedAnalytics: "Análises Avançadas",
    advancedAnalyticsDescription:
      "Tendências e previsões detalhadas de bem-estar.",

    recoveryForecast: "Previsão de Recuperação",
    recoveryForecastDescription:
      "Insights de recuperação e prontidão com IA.",

    journeyNarrator: "Narrador da Jornada",
    journeyNarratorDescription:
      "Histórias durante cada Jornada Legathon.",

    mealPlanning: "Planejamento de Refeições",
    mealPlanningDescription:
      "Recomendações nutricionais personalizadas.",

    aiMemory: "Memória IA",
    aiMemoryDescription:
      "Um coach que lembra seus hábitos e objetivos.",

    learnMore: "Saiba Mais",
    upgrade: "Atualizar",
  },

  ja: {
    walker: "ウォーカー",

    goodMorning: "おはようございます",
    goodAfternoon: "こんにちは",
    goodEvening: "こんばんは",
    welcome: "ようこそ",

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
    noActiveJourneyPeriod: "進行中のジャーニーはありません。",

    recoveryScore: "回復スコア：{score}%",
    recoveryNotRecordedPeriod: "回復データは未記録です。",

    today: "今日",

    wellnessOverview: "ウェルネス概要",
    aiWellnessSummary: "AIウェルネス概要",

    wellnessSummary:
      "保存された歩行、水分、回復、睡眠、ジャーニーデータを使って次の行動をサポートします。",

    stress: "ストレス",

    aiCoachingTools: "AIコーチングツール",
    mealPlan: "食事プラン",
    breathing: "呼吸",
    motivation: "モチベーション",

    journeyCoach: "ジャーニーコーチ",
    currentJourney: "現在のジャーニー",

    checkpointProgress:
      "チェックポイント {checkpoint} • {progress}% 完了",

    continueJourney: "ジャーニーを続ける",

    aiRoutePlan: "AIルートプラン",
    nextCheckpoint: "次のチェックポイント",
    nextCheckpointMessage:
      "次のチェックポイントに向かって歩き続けましょう。",

    suggestedPace: "おすすめペース",
    suggestedPaceMessage:
      "快適で安定したペースを維持しましょう。",

    dailyGoal: "今日の目標",
    dailyGoalMessage:
      "今日は{steps}歩を目指しましょう。",

    thisWeek: "今週",
    ai: "AI",

    goalMessageRemaining:
      "今日の目標まであと{steps}歩です。",

    goalMessageComplete:
      "今日の歩数目標を達成しました。",

    unavailable:
      "ウェルネス情報は一時的に利用できません。",

    recoveryTrend: "回復：{trend}",

    plan: "プラン",

    eliteAI: "ELITE AI",
    unlockFullCoach: "フルAIコーチをアンロック",

    eliteDescription:
      "プレミアムコーチング、パーソナライズされたウェルネス情報、限定AIツール。",

    advancedAnalytics: "高度な分析",
    advancedAnalyticsDescription:
      "詳細なウェルネストレンドと予測。",

    recoveryForecast: "回復予測",
    recoveryForecastDescription:
      "AIによる回復と準備状態の分析。",

    journeyNarrator: "ジャーニーナレーター",
    journeyNarratorDescription:
      "Legathonジャーニーで歴史ストーリーを楽しめます。",

    mealPlanning: "食事プランニング",
    mealPlanningDescription:
      "個人に合わせた栄養アドバイス。",

    aiMemory: "AIメモリー",
    aiMemoryDescription:
      "習慣や目標を覚えるコーチ。",

    learnMore: "詳しく見る",
    upgrade: "アップグレード",
  },

  ko: {
    walker: "워커",

    goodMorning: "좋은 아침입니다",
    goodAfternoon: "좋은 오후입니다",
    goodEvening: "좋은 저녁입니다",
    welcome: "환영합니다",

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
    recoveryNeedsAttention: "회복에 주의가 필요합니다",

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
    recoveryNotRecordedPeriod: "회복 기록이 없습니다.",

    today: "오늘",

    wellnessOverview: "웰니스 개요",
    aiWellnessSummary: "AI 웰니스 요약",

    wellnessSummary:
      "저장된 걷기, 수분, 회복, 수면 및 여정 데이터를 사용해 다음 활동을 안내합니다.",

    stress: "스트레스",

    aiCoachingTools: "AI 코칭 도구",
    mealPlan: "식사 계획",
    breathing: "호흡",
    motivation: "동기 부여",

    journeyCoach: "여정 코치",
    currentJourney: "현재 여정",

    checkpointProgress:
      "체크포인트 {checkpoint} • {progress}% 완료",

    continueJourney: "여정 계속",

    aiRoutePlan: "AI 경로 계획",
    nextCheckpoint: "다음 체크포인트",
    nextCheckpointMessage:
      "다음 체크포인트를 향해 계속 걸으세요.",

    suggestedPace: "추천 페이스",
    suggestedPaceMessage:
      "편안하고 일정한 걷기 속도를 유지하세요.",

    dailyGoal: "일일 목표",
    dailyGoalMessage:
      "오늘 {steps}걸음을 걸어보세요.",

    thisWeek: "이번 주",
    ai: "AI",

    goalMessageRemaining:
      "오늘 목표까지 {steps}걸음 남았습니다.",

    goalMessageComplete:
      "오늘의 걸음 목표를 달성했습니다.",

    unavailable:
      "웰니스 정보를 일시적으로 사용할 수 없습니다.",

    recoveryTrend: "회복: {trend}",

    plan: "플랜",

    eliteAI: "ELITE AI",
    unlockFullCoach: "전체 AI 코치 잠금 해제",

    eliteDescription:
      "프리미엄 코칭, 개인화된 웰니스 인사이트 및 독점 AI 도구.",

    advancedAnalytics: "고급 분석",
    advancedAnalyticsDescription:
      "상세한 웰니스 추세 및 예측.",

    recoveryForecast: "회복 예측",
    recoveryForecastDescription:
      "AI 기반 회복 및 준비 상태 인사이트.",

    journeyNarrator: "여정 내레이터",
    journeyNarratorDescription:
      "Legathon 여정에서 역사 이야기를 제공합니다.",

    mealPlanning: "식사 계획",
    mealPlanningDescription:
      "개인 맞춤 영양 추천.",

    aiMemory: "AI 메모리",
    aiMemoryDescription:
      "습관과 목표를 기억하는 코치.",

    learnMore: "더 알아보기",
    upgrade: "업그레이드",
  },

  zh: {
    walker: "步行者",

    goodMorning: "早上好",
    goodAfternoon: "下午好",
    goodEvening: "晚上好",
    welcome: "欢迎",

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
    noActiveJourneyPeriod: "目前没有进行中的旅程。",

    recoveryScore: "恢复评分：{score}%",
    recoveryNotRecordedPeriod: "恢复数据未记录。",

    today: "今天",

    wellnessOverview: "健康概览",
    aiWellnessSummary: "AI健康总结",

    wellnessSummary:
      "健康面板使用已保存的步行、补水、恢复、睡眠和旅程数据来帮助你规划下一步。",

    stress: "压力",

    aiCoachingTools: "AI指导工具",
    mealPlan: "饮食计划",
    breathing: "呼吸",
    motivation: "动力",

    journeyCoach: "旅程教练",
    currentJourney: "当前旅程",

    checkpointProgress:
      "检查点 {checkpoint} • 已完成 {progress}%",

    continueJourney: "继续旅程",

    aiRoutePlan: "AI路线计划",
    nextCheckpoint: "下一个检查点",
    nextCheckpointMessage:
      "继续向下一个旅程检查点前进。",

    suggestedPace: "建议速度",
    suggestedPaceMessage:
      "保持舒适且稳定的步行速度。",

    dailyGoal: "每日目标",
    dailyGoalMessage:
      "今天步行{steps}步。",

    thisWeek: "本周",
    ai: "AI",

    goalMessageRemaining:
      "距离今天的目标还差{steps}步。",

    goalMessageComplete:
      "你已经完成今天的步数目标。",

    unavailable:
      "健康信息暂时无法使用。",

    recoveryTrend: "恢复：{trend}",

    plan: "计划",

    eliteAI: "ELITE AI",
    unlockFullCoach: "解锁完整AI教练",

    eliteDescription:
      "高级指导、个性化健康分析以及专属AI工具。",

    advancedAnalytics: "高级分析",
    advancedAnalyticsDescription:
      "详细的健康趋势和预测。",

    recoveryForecast: "恢复预测",
    recoveryForecastDescription:
      "AI驱动的恢复和准备状态分析。",

    journeyNarrator: "旅程讲述",
    journeyNarratorDescription:
      "在每次Legathon旅程中提供历史故事。",

    mealPlanning: "饮食规划",
    mealPlanningDescription:
      "个性化营养建议。",

    aiMemory: "AI记忆",
    aiMemoryDescription:
      "能够记住你的习惯和目标的教练。",

    learnMore: "了解更多",
    upgrade: "升级",
  },

  it: {
    walker: "Camminatore",

    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio",
    goodEvening: "Buonasera",
    welcome: "Benvenuto",

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
    recoveryNeedsAttention: "Il recupero richiede attenzione",

    startShortWalk:
      "Inizia oggi con una breve camminata per costruire il tuo progresso di benessere.",

    completedGoal:
      "Hai completato l’obiettivo di passi di oggi. Concentrati su idratazione, recupero e sonno di qualità.",

    stepsAway:
      "Ti mancano {steps} passi per raggiungere l’obiettivo di oggi.",

    aiActivityFeed: "Attività AI",

    walkProgress: "Progresso della Camminata",
    walkedToday: "Hai camminato {steps} passi oggi.",

    journeyProgress: "Progresso del Viaggio",
    journeyInProgress: "Viaggio in corso",
    noActiveJourneyPeriod: "Nessun viaggio attivo.",

    recoveryScore: "Punteggio recupero: {score}%.",
    recoveryNotRecordedPeriod: "Recupero non registrato.",

    today: "Oggi",

    wellnessOverview: "Panoramica Benessere",
    aiWellnessSummary: "Riepilogo Benessere AI",

    wellnessSummary:
      "La dashboard usa i dati salvati su camminata, idratazione, recupero, sonno e viaggio per guidarti.",

    stress: "Stress",

    aiCoachingTools: "Strumenti Coaching AI",
    mealPlan: "Piano Pasti",
    breathing: "Respirazione",
    motivation: "Motivazione",

    journeyCoach: "Coach del Viaggio",
    currentJourney: "VIAGGIO ATTUALE",

    checkpointProgress:
      "Checkpoint {checkpoint} • {progress}% completato",

    continueJourney: "Continua Viaggio",

    aiRoutePlan: "Piano Percorso AI",
    nextCheckpoint: "Prossimo Checkpoint",
    nextCheckpointMessage:
      "Continua a camminare verso il prossimo checkpoint.",

    suggestedPace: "Ritmo Suggerito",
    suggestedPaceMessage:
      "Mantieni un ritmo comodo e costante.",

    dailyGoal: "Obiettivo Giornaliero",
    dailyGoalMessage:
      "Cammina {steps} passi oggi.",

    thisWeek: "Questa settimana",
    ai: "AI",

    goalMessageRemaining:
      "Ti mancano {steps} passi per l’obiettivo di oggi.",

    goalMessageComplete:
      "Hai completato l’obiettivo di passi di oggi.",

    unavailable:
      "Le informazioni sul benessere sono temporaneamente non disponibili.",

    recoveryTrend: "Recupero: {trend}",

    plan: "PIANO",

    eliteAI: "AI ELITE",
    unlockFullCoach: "Sblocca il Coach AI Completo",

    eliteDescription:
      "Coaching premium, intelligence personalizzata e strumenti AI esclusivi.",

    advancedAnalytics: "Analisi Avanzate",
    advancedAnalyticsDescription:
      "Tendenze e previsioni dettagliate.",

    recoveryForecast: "Previsione Recupero",
    recoveryForecastDescription:
      "Analisi AI del recupero e della preparazione.",

    journeyNarrator: "Narratore del Viaggio",
    journeyNarratorDescription:
      "Narrazione storica durante ogni viaggio Legathon.",

    mealPlanning: "Pianificazione Pasti",
    mealPlanningDescription:
      "Raccomandazioni nutrizionali personalizzate.",

    aiMemory: "Memoria AI",
    aiMemoryDescription:
      "Un coach che ricorda abitudini e obiettivi.",

    learnMore: "Scopri di Più",
    upgrade: "Aggiorna",
  },

  ar: {
    walker: "المشّاء",

    goodMorning: "صباح الخير",
    goodAfternoon: "مساء الخير",
    goodEvening: "مساء الخير",
    welcome: "مرحبًا",

    aiWellnessCoach: "مدرب العافية بالذكاء الاصطناعي",

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
    recoveryNeedsAttention: "التعافي يحتاج إلى اهتمام",

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
    recoveryNotRecordedPeriod: "التعافي غير مسجل.",

    today: "اليوم",

    wellnessOverview: "نظرة عامة على العافية",
    aiWellnessSummary: "ملخص العافية بالذكاء الاصطناعي",

    wellnessSummary:
      "تستخدم لوحة العافية بيانات المشي والترطيب والتعافي والنوم والرحلات المحفوظة لمساعدتك.",

    stress: "التوتر",

    aiCoachingTools: "أدوات التدريب بالذكاء الاصطناعي",
    mealPlan: "خطة الوجبات",
    breathing: "التنفس",
    motivation: "التحفيز",

    journeyCoach: "مدرب الرحلة",
    currentJourney: "الرحلة الحالية",

    checkpointProgress:
      "نقطة التحقق {checkpoint} • مكتمل {progress}٪",

    continueJourney: "متابعة الرحلة",

    aiRoutePlan: "خطة المسار بالذكاء الاصطناعي",
    nextCheckpoint: "نقطة التحقق التالية",
    nextCheckpointMessage:
      "استمر في المشي نحو نقطة التحقق التالية.",

    suggestedPace: "السرعة المقترحة",
    suggestedPaceMessage:
      "حافظ على سرعة مشي مريحة وثابتة.",

    dailyGoal: "الهدف اليومي",
    dailyGoalMessage:
      "امشِ {steps} خطوة اليوم.",

    thisWeek: "هذا الأسبوع",
    ai: "AI",

    goalMessageRemaining:
      "تبقى {steps} خطوة للوصول إلى هدف اليوم.",

    goalMessageComplete:
      "أكملت هدف خطوات اليوم.",

    unavailable:
      "معلومات العافية غير متاحة مؤقتًا.",

    recoveryTrend: "التعافي: {trend}",

    plan: "الخطة",

    eliteAI: "ELITE AI",
    unlockFullCoach: "افتح المدرب الكامل بالذكاء الاصطناعي",

    eliteDescription:
      "تدريب مميز وتحليلات عافية مخصصة وأدوات AI حصرية.",

    advancedAnalytics: "تحليلات متقدمة",
    advancedAnalyticsDescription:
      "اتجاهات وتوقعات تفصيلية للعافية.",

    recoveryForecast: "توقع التعافي",
    recoveryForecastDescription:
      "تحليلات التعافي والاستعداد بالذكاء الاصطناعي.",

    journeyNarrator: "راوي الرحلة",
    journeyNarratorDescription:
      "قصص تاريخية خلال رحلات Legathon.",

    mealPlanning: "تخطيط الوجبات",
    mealPlanningDescription:
      "توصيات غذائية مخصصة.",

    aiMemory: "ذاكرة AI",
    aiMemoryDescription:
      "مدرب يتذكر عاداتك وأهدافك.",

    learnMore: "اعرف المزيد",
    upgrade: "ترقية",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function fillTemplate(
  text,
  variables = {}
) {
  return String(text).replace(
    /\{(\w+)\}/g,
    (match, key) => {
      if (
        Object.prototype.hasOwnProperty.call(
          variables,
          key
        )
      ) {
        return String(
          variables[key]
        );
      }

      return match;
    }
  );
}

function getText(
  language,
  key,
  variables = {}
) {
  const value =
    TEXT?.[language]?.[key] ??
    TEXT.en?.[key] ??
    key;

  return fillTemplate(
    value,
    variables
  );
}

// ============================================================
// HELPERS
// ============================================================

function safelyParseJSON(
  value,
  fallback = null
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

function clampNumber(
  value,
  minimum = 0,
  maximum = 100
) {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return minimum;
  }

  return Math.min(
    Math.max(
      numericValue,
      minimum
    ),
    maximum
  );
}

function calculateGreeting(
  language
) {
  const hour =
    new Date().getHours();

  if (
    hour < 12
  ) {
    return getText(
      language,
      "goodMorning"
    );
  }

  if (
    hour < 18
  ) {
    return getText(
      language,
      "goodAfternoon"
    );
  }

  return getText(
    language,
    "goodEvening"
  );
}

async function getFirstStoredValue(
  keys = []
) {
  for (
    const key of keys
  ) {
    try {
      const value =
        await AsyncStorage.getItem(
          key
        );

      if (
        value !== null &&
        value !== undefined
      ) {
        return value;
      }
    } catch (
      error
    ) {
      console.log(
        `Storage read error for ${key}:`,
        error
      );
    }
  }

  return null;
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

  activeJourney:
    activeJourneyProp = null,

  userPlan = "free",
}) {
  const t = useCallback(
    (
      key,
      variables = {}
    ) =>
      getText(
        language,
        key,
        variables
      ),
    [
      language,
    ]
  );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState("Home");

  const [
    aiStatus,
    setAIStatus,
  ] =
    useState("");

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    wellness,
    setWellness,
  ] =
    useState(
      INITIAL_WELLNESS
    );

  const pulse =
    useRef(
      new Animated.Value(1)
    ).current;

  const rotate =
    useRef(
      new Animated.Value(0)
    ).current;

  const glow =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const runAction =
    useCallback(
      (
        callback,
        screenName,
        params = undefined
      ) => {
        if (
          typeof callback ===
          "function"
        ) {
          callback(params);
          return;
        }

        if (
          navigation?.navigate &&
          screenName
        ) {
          navigation.navigate(
            screenName,
            params
          );

          return;
        }

        console.warn(
          `${screenName} is not connected.`
        );
      },
      [
        navigation,
      ]
    );

  const navTo =
    useCallback(
      (
        screenName,
        params
      ) => {
        switch (
          screenName
        ) {
          case "MealPlanner":
            runAction(
              goToMealPlanner,
              screenName,
              params
            );
            return;

          case "HydrationCoach":
            runAction(
              goToHydration,
              screenName,
              params
            );
            return;

          case "RecoveryCoach":
            runAction(
              goToRecovery,
              screenName,
              params
            );
            return;

          case "SleepCoach":
            runAction(
              goToSleep,
              screenName,
              params
            );
            return;

          case "StressBreathingCoach":
            runAction(
              goToBreathing,
              screenName,
              params
            );
            return;

          case "WalkingAnalytics":
            runAction(
              goToWalkingAnalytics,
              screenName,
              params
            );
            return;

          case "WalkHistory":
            runAction(
              goToWalkHistory,
              screenName,
              params
            );
            return;

          case "WellnessGoals":
            runAction(
              goToGoals,
              screenName,
              params
            );
            return;

          case "Journeys":
            runAction(
              goToJourneys,
              screenName,
              params
            );
            return;

          case "JourneyStory":
            runAction(
              goToJourneyStory,
              screenName,
              params
            );
            return;

          case "GPSJourneyMap":
            runAction(
              goToGPSJourneyMap,
              screenName,
              params
            );
            return;

          case "Subscription":
            runAction(
              goToSubscription,
              screenName,
              params
            );
            return;

          default:
            navigation?.navigate?.(
              screenName,
              params
            );
        }
      },
      [
        navigation,
        runAction,
        goToMealPlanner,
        goToHydration,
        goToRecovery,
        goToSleep,
        goToBreathing,
        goToWalkingAnalytics,
        goToWalkHistory,
        goToGoals,
        goToJourneys,
        goToJourneyStory,
        goToGPSJourneyMap,
        goToSubscription,
      ]
    );

  // ==========================================================
  // ANIMATION
  // ==========================================================

  useEffect(
    () => {
      const pulseAnimation =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              pulse,
              {
                toValue:
                  1.08,

                duration:
                  1200,

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              pulse,
              {
                toValue:
                  1,

                duration:
                  1200,

                useNativeDriver:
                  true,
              }
            ),
          ])
        );

      const rotateAnimation =
        Animated.loop(
          Animated.timing(
            rotate,
            {
              toValue:
                1,

              duration:
                9000,

              useNativeDriver:
                true,
            }
          )
        );

      const glowAnimation =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              glow,
              {
                toValue:
                  1,

                duration:
                  1500,

                useNativeDriver:
                  false,
              }
            ),

            Animated.timing(
              glow,
              {
                toValue:
                  0,

                duration:
                  1500,

                useNativeDriver:
                  false,
              }
            ),
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
    },
    [
      glow,
      pulse,
      rotate,
    ]
  );

  // ==========================================================
  // LOAD WELLNESS DATA
  // ==========================================================

  const loadWellnessData =
    useCallback(
      async () => {
        try {
          setIsLoading(
            true
          );

          const [
            savedProfile,
            savedTodaySteps,
            savedActiveJourney,
            savedHydration,
            savedSleep,
            savedRecovery,
            savedStreak,
          ] =
            await Promise.all([
              getFirstStoredValue([
                "userProfile",
                "profile",
                "legathonWalkProfile",
              ]),

              getFirstStoredValue([
                "todaySteps",
                "dailySteps",
                "currentDaySteps",
              ]),

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

          const profile =
            safelyParseJSON(
              savedProfile,
              {}
            );

          const storedJourney =
            safelyParseJSON(
              savedActiveJourney,
              null
            );

          const journey =
            activeJourneyProp ||
            storedJourney ||
            null;

          const hydrationData =
            safelyParseJSON(
              savedHydration,
              {}
            );

          const hydrationAmount =
            Math.max(
              0,
              Number(
                hydrationData
                  ?.amount ??
                  hydrationData
                    ?.ounces ??
                  hydrationData
                    ?.hydration ??
                  hydrationData
                    ?.current ??
                  hydrationData
                    ?.todayAmount ??
                  0
              ) || 0
            );

          const hydrationGoal =
            Math.max(
              1,
              Number(
                hydrationData
                  ?.goal ??
                  hydrationData
                    ?.hydrationGoal ??
                  hydrationData
                    ?.dailyGoal ??
                  DEFAULT_HYDRATION_GOAL
              ) ||
                DEFAULT_HYDRATION_GOAL
            );

          const sleepData =
            safelyParseJSON(
              savedSleep,
              {}
            );

          const recoveryData =
            safelyParseJSON(
              savedRecovery,
              {}
            );

          const steps =
            Math.max(
              0,
              Number(
                savedTodaySteps
              ) || 0
            );

          const stepGoal =
            Math.max(
              1,
              Number(
                profile
                  ?.stepGoal ??
                  profile
                    ?.dailyStepGoal ??
                  DEFAULT_STEP_GOAL
              ) ||
                DEFAULT_STEP_GOAL
            );

          const stepsRemaining =
            Math.max(
              stepGoal -
                steps,
              0
            );

          const rawJourneyProgress =
            journey?.progress ??
            journey?.journeyProgress ??
            journey?.progressPercent ??
            journey?.percentComplete ??
            0;

          const journeyProgress =
            clampNumber(
              rawJourneyProgress,
              0,
              100
            );

          const recovery =
            recoveryData
              ?.score !==
              undefined &&
            recoveryData
              ?.score !==
              null
              ? clampNumber(
                  recoveryData
                    .score,
                  0,
                  100
                )
              : null;

          const sleepHours =
            sleepData
              ?.hours !==
              undefined &&
            sleepData
              ?.hours !==
              null
              ? Math.max(
                  0,
                  Number(
                    sleepData
                      .hours
                  ) || 0
                )
              : null;

          const parsedStreakObject =
            safelyParseJSON(
              savedStreak,
              null
            );

          const streakValue =
            typeof parsedStreakObject ===
              "object" &&
            parsedStreakObject !==
              null
              ? parsedStreakObject
                  .streak ??
                parsedStreakObject
                  .days ??
                parsedStreakObject
                  .value ??
                0
              : savedStreak ??
                0;

          const streak =
            Math.max(
              0,
              Number(
                streakValue
              ) || 0
            );

          const calories =
            Math.max(
              0,
              Math.round(
                steps *
                  0.04
              )
            );

          const currentCheckpoint =
            Number(
              journey
                ?.currentCheckpoint ??
                journey
                  ?.checkpoint ??
                0
            ) || 0;

          const checkpoint =
            currentCheckpoint >
            0
              ? `${Math.min(
                  currentCheckpoint,
                  5
                )} of 5`
              : "";

          const greeting =
            calculateGreeting(
              language
            );

          const userName =
            profile
              ?.userName ||
            profile
              ?.username ||
            profile
              ?.name ||
            t(
              "walker"
            );

          const journeyTitle =
            journey
              ?.shortTitle ||
            journey
              ?.title ||
            "";

          const journeyFull =
            journey
              ?.title ||
            journey
              ?.name ||
            "";

          const stress =
            recoveryData
              ?.stress ??
            recoveryData
              ?.stressLevel ??
            profile
              ?.stressLevel ??
            null;

          const aiMessage =
            stepsRemaining >
            0
              ? t(
                  "goalMessageRemaining",
                  {
                    steps:
                      stepsRemaining.toLocaleString(),
                  }
                )
              : t(
                  "goalMessageComplete"
                );

          setWellness({
            userName,
            greeting,

            steps,
            stepGoal,
            stepsRemaining,

            recovery,
            sleepHours,

            hydration:
              hydrationAmount,

            hydrationGoal,

            calories,
            stress,

            wellnessScore:
              null,

            wellnessLabel:
              "",

            streak,

            journey:
              journeyTitle,

            journeyFull,

            activeJourney:
              journey,

            journeyProgress,

            checkpoint,

            aiMessage,
          });
        } catch (
          error
        ) {
          console.log(
            "AI Wellness load error:",
            error
          );

          setWellness(
            current => ({
              ...current,

              greeting:
                calculateGreeting(
                  language
                ),

              aiMessage:
                t(
                  "unavailable"
                ),
            })
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [
        activeJourneyProp,
        language,
        t,
      ]
    );

  useEffect(
    () => {
      loadWellnessData();
    },
    [
      loadWellnessData,
    ]
  );

  useEffect(
    () => {
      const subscription =
        AppState.addEventListener(
          "change",
          nextState => {
            if (
              nextState ===
              "active"
            ) {
              loadWellnessData();
            }
          }
        );

      return () => {
        subscription.remove();
      };
    },
    [
      loadWellnessData,
    ]
  );

  // ==========================================================
  // ANIMATION VALUES
  // ==========================================================

  const spin =
    rotate.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "0deg",
        "360deg",
      ],
    });

  const reverseSpin =
    rotate.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "360deg",
        "0deg",
      ],
    });

  const glowOpacity =
    glow.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        0.25,
        0.8,
      ],
    });

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const stepProgress =
    useMemo(
      () => {
        if (
          !wellness.stepGoal
        ) {
          return 0;
        }

        return clampNumber(
          (
            wellness.steps /
            wellness.stepGoal
          ) * 100,
          0,
          100
        );
      },
      [
        wellness.stepGoal,
        wellness.steps,
      ]
    );

  const hydrationProgress =
    useMemo(
      () => {
        if (
          !wellness
            .hydrationGoal
        ) {
          return 0;
        }

        return clampNumber(
          (
            wellness
              .hydration /
            wellness
              .hydrationGoal
          ) * 100,
          0,
          100
        );
      },
      [
        wellness.hydration,
        wellness.hydrationGoal,
      ]
    );

  const recoveryProgress =
    useMemo(
      () => {
        if (
          wellness
            .recovery ===
          null
        ) {
          return 0;
        }

        return clampNumber(
          wellness.recovery,
          0,
          100
        );
      },
      [
        wellness.recovery,
      ]
    );

  const sleepProgress =
    useMemo(
      () => {
        if (
          wellness
            .sleepHours ===
          null
        ) {
          return 0;
        }

        return clampNumber(
          (
            wellness
              .sleepHours /
            8
          ) * 100,
          0,
          100
        );
      },
      [
        wellness.sleepHours,
      ]
    );

  const calorieProgress =
    useMemo(
      () => {
        const calorieGoal =
          Number(
            wellness.stepGoal ||
              0
          ) * 0.04;

        if (
          !calorieGoal
        ) {
          return 0;
        }

        return clampNumber(
          (
            Number(
              wellness.calories ||
                0
            ) /
            calorieGoal
          ) * 100,
          0,
          100
        );
      },
      [
        wellness.calories,
        wellness.stepGoal,
      ]
    );

  // FIXED: stressProgress was missing in the original file.
  const stressProgress =
    useMemo(
      () => {
        if (
          wellness.stress ===
            null ||
          wellness.stress ===
            undefined
        ) {
          return 0;
        }

        const numeric =
          Number(
            wellness.stress
          );

        if (
          Number.isFinite(
            numeric
          )
        ) {
          return clampNumber(
            numeric,
            0,
            100
          );
        }

        return 0;
      },
      [
        wellness.stress,
      ]
    );

  // ==========================================================
  // AI INSIGHT
  // ==========================================================

  const insightMessage =
    useMemo(
      () => {
        const steps =
          Number(
            wellness.steps ||
              0
          );

        const goal =
          Number(
            wellness.stepGoal ||
              DEFAULT_STEP_GOAL
          );

        const remaining =
          Math.max(
            goal -
              steps,
            0
          );

        if (
          steps <= 0
        ) {
          return t(
            "startShortWalk"
          );
        }

        if (
          remaining === 0
        ) {
          return t(
            "completedGoal"
          );
        }

        return t(
          "stepsAway",
          {
            steps:
              remaining.toLocaleString(),
          }
        );
      },
      [
        wellness.steps,
        wellness.stepGoal,
        t,
      ]
    );

  const aiConfidence =
    useMemo(
      () => {
        let score = 0;

        if (
          Number(
            wellness.steps ||
              0
          ) > 0
        ) {
          score += 30;
        }

        if (
          Number(
            wellness
              .hydration ||
              0
          ) > 0
        ) {
          score += 20;
        }

        if (
          wellness
            .recovery != null
        ) {
          score += 20;
        }

        if (
          wellness
            .sleepHours !=
          null
        ) {
          score += 20;
        }

        if (
          wellness.journey
        ) {
          score += 10;
        }

        return clampNumber(
          score,
          0,
          100
        );
      },
      [
        wellness.steps,
        wellness.hydration,
        wellness.recovery,
        wellness.sleepHours,
        wellness.journey,
      ]
    );

  const recoveryTrend =
    useMemo(
      () => {
        if (
          wellness
            .recovery ==
          null
        ) {
          return t(
            "recoveryNotRecorded"
          );
        }

        if (
          wellness
            .recovery >=
          90
        ) {
          return t(
            "excellentRecovery"
          );
        }

        if (
          wellness
            .recovery >=
          75
        ) {
          return t(
            "recoveryImproving"
          );
        }

        if (
          wellness
            .recovery >=
          60
        ) {
          return t(
            "moderateRecovery"
          );
        }

        return t(
          "recoveryNeedsAttention"
        );
      },
      [
        wellness.recovery,
        t,
      ]
    );

  // ==========================================================
  // HANDLERS
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

      if (
        navigation?.canGoBack?.()
      ) {
        navigation.goBack();
        return;
      }

      navigation?.navigate?.(
        "More"
      );
    };

  const handleNotifications =
    () => {
      runAction(
        goToNotifications,
        "NotificationSettings"
      );
    };

  const handleTextCoach =
    () => {
      runAction(
        goToAIConversation,
        "aiConversation"
      );
    };

  const handleHydration =
    () => {
      runAction(
        goToHydration,
        "HydrationCoach"
      );
    };

  const handleRecovery =
    () => {
      runAction(
        goToRecovery,
        "RecoveryCoach"
      );
    };

  const handleSleep =
    () => {
      runAction(
        goToSleep,
        "SleepCoach"
      );
    };

  const handleBreathing =
    () => {
      runAction(
        goToBreathing,
        "StressBreathingCoach"
      );
    };

  const handleMealPlanner =
    () => {
      runAction(
        goToMealPlanner,
        "MealPlanner"
      );
    };

  const handleWalkingAnalytics =
    () => {
      runAction(
        goToWalkingAnalytics,
        "WalkingAnalytics"
      );
    };

  const handleWalkHistory =
    () => {
      runAction(
        goToWalkHistory,
        "WalkHistory"
      );
    };

  const handleGoals =
    () => {
      runAction(
        goToGoals,
        "WellnessGoals"
      );
    };

  const handleJourneys =
    () => {
      runAction(
        goToJourneys,
        "Journeys"
      );
    };

  const handleJourneyStory =
    () => {
      runAction(
        goToJourneyStory,
        "JourneyStory",
        {
          journey:
            wellness
              .activeJourney ||
            activeJourneyProp ||
            null,
        }
      );
    };

  const handleStartWalk =
    async () => {
      let journey =
        wellness
          .activeJourney ||
        activeJourneyProp ||
        null;

      if (
        !journey
      ) {
        const savedJourney =
          await AsyncStorage.getItem(
            "activeJourney"
          );

        if (
          savedJourney
        ) {
          try {
            journey =
              JSON.parse(
                savedJourney
              );
          } catch (
            error
          ) {
            console.log(
              "Active journey parse error:",
              error
            );
          }
        }
      }

      if (
        journey
      ) {
        runAction(
          goToGPSJourneyMap,
          "GPSJourneyMap",
          {
            journey,
          }
        );

        return;
      }

      runAction(
        goToJourneys,
        "Journeys"
      );
    };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={
          styles.container
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom:
              40,
          }}
        >
          {/* HEADER */}

          <View
            style={
              styles.header
            }
          >
            <TouchableOpacity
              style={
                styles.iconButton
              }
              onPress={
                handleBack
              }
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View>
              <Text
                style={
                  styles.headerTitle
                }
              >
                LEGATHON AI
              </Text>

              <Text
                style={
                  styles.headerSubtitle
                }
              >
                WELLNESS
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.iconButton
              }
              onPress={
                handleNotifications
              }
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
            style={
              styles.heroCard
            }
          >
            <Text
              style={
                styles.smallLabel
              }
            >
              {`${wellness.greeting || t("welcome")} ${
                wellness.userName ||
                t("walker")
              }`.toUpperCase()}
            </Text>

            <Text
              style={
                styles.heroTitle
              }
            >
              {t(
                "aiWellnessCoach"
              )}
            </Text>

            <Text
              style={
                styles.heroText
              }
            >
              {t(
                "heroDescription"
              )}
            </Text>

            <View
              style={
                styles.orbWrap
              }
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.orbGlow,
                  {
                    opacity:
                      glowOpacity,
                  },
                ]}
              />

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.orbOuter,
                  {
                    transform: [
                      {
                        rotate:
                          spin,
                      },
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
                      {
                        rotate:
                          reverseSpin,
                      },
                    ],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.orbInner,
                  {
                    transform: [
                      {
                        scale:
                          pulse,
                      },
                    ],
                  },
                ]}
              >
                {wellness
                  .wellnessScore !==
                  null &&
                wellness
                  .wellnessScore !==
                  undefined ? (
                  <>
                    <Text
                      style={
                        styles.orbScore
                      }
                    >
                      {Math.round(
                        Number(
                          wellness
                            .wellnessScore
                        ) || 0
                      )}
                    </Text>

                    <Text
                      style={
                        styles.orbScoreLabel
                      }
                    >
                      Score
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="brain"
                      size={54}
                      color="#9DFFCF"
                    />

                    <Text
                      style={
                        styles.orbScoreLabel
                      }
                    >
                      {t(
                        "aiCoach"
                      )}
                    </Text>
                  </>
                )}
              </Animated.View>
            </View>

            <View
              style={
                styles.aiStatusRow
              }
            >
              <View
                style={
                  styles.statusDot
                }
              />

              <Text
                style={
                  styles.aiStatusText
                }
              >
                {aiStatus ||
                  t(
                    "aiReady"
                  )}
              </Text>
            </View>

            <Text
              style={
                styles.aiStatusMessage
              }
            >
              {wellness.aiMessage ||
                t(
                  "coachReady"
                )}
            </Text>

            <TouchableOpacity
              style={
                styles.textCoachButton
              }
              activeOpacity={
                0.85
              }
              onPress={
                handleTextCoach
              }
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={26}
                color="#020611"
              />

              <Text
                style={
                  styles.textCoachButtonText
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
              >
                {t(
                  "messageCoach"
                )}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color="#020611"
              />
            </TouchableOpacity>

            <View
              style={
                styles.heroActions
              }
            >
              <HeroAction
                icon="walk"
                title={
                  t(
                    "walk"
                  )
                }
                onPress={
                  handleStartWalk
                }
              />

              <HeroAction
                icon="leaf"
                title={
                  t(
                    "calm"
                  )
                }
                onPress={
                  handleBreathing
                }
              />

              <HeroAction
                icon="restaurant"
                title={
                  t(
                    "meal"
                  )
                }
                onPress={
                  handleMealPlanner
                }
              />
            </View>
          </LinearGradient>

          {/* TODAY */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "todaysWellness"
            )}
          </Text>

          <View
            style={
              styles.quickStatsGrid
            }
          >
            <QuickStatCard
              icon="walk"
              title={
                t(
                  "steps"
                )
              }
              value={`${Number(
                wellness.steps ||
                  0
              ).toLocaleString()} / ${Number(
                wellness.stepGoal ||
                  DEFAULT_STEP_GOAL
              ).toLocaleString()}`}
              progress={
                stepProgress
              }
              color="#44F58A"
              onPress={
                handleWalkingAnalytics
              }
            />

            <QuickStatCard
              icon="water"
              title={
                t(
                  "hydration"
                )
              }
              value={`${Number(
                wellness.hydration ||
                  0
              )} / ${Number(
                wellness.hydrationGoal ||
                  DEFAULT_HYDRATION_GOAL
              )} oz`}
              progress={
                hydrationProgress
              }
              color="#38D6FF"
              onPress={
                handleHydration
              }
            />

            <QuickStatCard
              icon="heart"
              title={
                t(
                  "recovery"
                )
              }
              value={
                wellness.recovery !=
                null
                  ? `${wellness.recovery}%`
                  : t(
                      "notRecorded"
                    )
              }
              progress={
                recoveryProgress
              }
              color="#FF5A6A"
              onPress={
                handleRecovery
              }
            />

            <QuickStatCard
              icon="moon"
              title={
                t(
                  "sleep"
                )
              }
              value={
                wellness.sleepHours !=
                null
                  ? `${Number(
                      wellness.sleepHours
                    ).toFixed(
                      1
                    )}h`
                  : t(
                      "notRecorded"
                    )
              }
              progress={
                sleepProgress
              }
              color="#A66CFF"
              onPress={
                handleSleep
              }
            />

            <QuickStatCard
              icon="flame"
              title={
                t(
                  "calories"
                )
              }
              value={Number(
                wellness.calories ||
                  0
              ).toLocaleString()}
              progress={
                calorieProgress
              }
              color="#FF9F1C"
              onPress={
                handleWalkingAnalytics
              }
            />

            <QuickStatCard
              icon="map"
              title={
                t(
                  "journey"
                )
              }
              value={
                wellness.journey ||
                t(
                  "noActiveJourney"
                )
              }
              progress={
                wellness
                  .journeyProgress ||
                0
              }
              color="#2D7FF9"
              onPress={
                handleStartWalk
              }
            />

            <QuickStatCard
              icon="trophy"
              title={
                t(
                  "streak"
                )
              }
              value={`${Number(
                wellness.streak ||
                  0
              )} ${t(
                "days"
              )}`}
              progress={clampNumber(
                (
                  Number(
                    wellness.streak ||
                      0
                  ) /
                  7
                ) * 100,
                0,
                100
              )}
              color="#F7C948"
              onPress={
                handleGoals
              }
            />
          </View>

          {/* AI INSIGHT */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "aiInsight"
            )}
          </Text>

          <AIInsightCard
            title={
              t(
                "todaysRecommendation"
              )
            }
            message={
              insightMessage
            }
            confidence={
              aiConfidence
            }
            trend={
              recoveryTrend
            }
            action={
              t(
                "startWalk"
              )
            }
            confidenceLabel={
              t(
                "confidence"
              )
            }
            trendLabel={
              t(
                "recoveryTrend",
                {
                  trend:
                    recoveryTrend,
                }
              )
            }
            onPress={
              handleStartWalk
            }
          />

          {/* ACTIVITY */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "aiActivityFeed"
            )}
          </Text>

          <View
            style={
              styles.activityContainer
            }
          >
            <ActivityItem
              icon="walk"
              color="#44F58A"
              title={
                t(
                  "walkProgress"
                )
              }
              subtitle={t(
                "walkedToday",
                {
                  steps:
                    Number(
                      wellness.steps ||
                        0
                    ).toLocaleString(),
                }
              )}
              time={
                t(
                  "today"
                )
              }
            />

            <ActivityItem
              icon="flag"
              color="#2D7FF9"
              title={
                t(
                  "journeyProgress"
                )
              }
              subtitle={
                wellness.journey
                  ? `${
                      wellness.checkpoint ||
                      t(
                        "journeyInProgress"
                      )
                    } — ${
                      wellness.journey
                    }`
                  : t(
                      "noActiveJourneyPeriod"
                    )
              }
              time={
                wellness.journey
                  ? t(
                      "today"
                    )
                  : ""
              }
            />

            <ActivityItem
              icon="heart"
              color="#FF5A6A"
              title={
                t(
                  "recovery"
                )
              }
              subtitle={
                wellness.recovery !=
                null
                  ? t(
                      "recoveryScore",
                      {
                        score:
                          Math.round(
                            Number(
                              wellness.recovery
                            )
                          ),
                      }
                    )
                  : t(
                      "recoveryNotRecordedPeriod"
                    )
              }
              time={
                wellness.recovery !=
                null
                  ? t(
                      "today"
                    )
                  : ""
              }
            />
          </View>

          {/* OPTIONAL WELLNESS TAB CONTENT */}

          {activeTab ===
            "Wellness" && (
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "wellnessOverview"
                )}
              </Text>

              <View
                style={
                  styles.quickStatsGrid
                }
              >
                <QuickStatCard
                  icon="walk"
                  title={
                    t(
                      "steps"
                    )
                  }
                  value={`${Number(
                    wellness.steps ||
                      0
                  ).toLocaleString()} / ${Number(
                    wellness.stepGoal ||
                      DEFAULT_STEP_GOAL
                  ).toLocaleString()}`}
                  progress={
                    stepProgress
                  }
                  color="#44F58A"
                  onPress={
                    handleWalkingAnalytics
                  }
                />

                <QuickStatCard
                  icon="heart"
                  title={
                    t(
                      "recovery"
                    )
                  }
                  value={
                    wellness.recovery !=
                    null
                      ? `${wellness.recovery}%`
                      : t(
                          "notRecorded"
                        )
                  }
                  progress={
                    recoveryProgress
                  }
                  color="#FF5A6A"
                  onPress={
                    handleRecovery
                  }
                />

                <QuickStatCard
                  icon="moon"
                  title={
                    t(
                      "sleep"
                    )
                  }
                  value={
                    wellness.sleepHours !=
                    null
                      ? `${Number(
                          wellness.sleepHours
                        ).toFixed(
                          1
                        )}h`
                      : t(
                          "notRecorded"
                        )
                  }
                  progress={
                    sleepProgress
                  }
                  color="#A66CFF"
                  onPress={
                    handleSleep
                  }
                />

                <QuickStatCard
                  icon="water"
                  title={
                    t(
                      "hydration"
                    )
                  }
                  value={`${Number(
                    wellness.hydration ||
                      0
                  )} / ${Number(
                    wellness.hydrationGoal ||
                      DEFAULT_HYDRATION_GOAL
                  )} oz`}
                  progress={
                    hydrationProgress
                  }
                  color="#38D6FF"
                  onPress={
                    handleHydration
                  }
                />

                <QuickStatCard
                  icon="flame"
                  title={
                    t(
                      "calories"
                    )
                  }
                  value={Number(
                    wellness.calories ||
                      0
                  ).toLocaleString()}
                  progress={
                    calorieProgress
                  }
                  color="#FF9F1C"
                  onPress={
                    handleWalkingAnalytics
                  }
                />

                <QuickStatCard
                  icon="leaf"
                  title={
                    t(
                      "stress"
                    )
                  }
                  value={
                    wellness.stress ??
                    t(
                      "notRecorded"
                    )
                  }
                  progress={
                    stressProgress
                  }
                  color="#64FFD2"
                  onPress={
                    handleBreathing
                  }
                />
              </View>

              <LinearGradient
                colors={[
                  "#0A2442",
                  "#08192F",
                  "#051120",
                ]}
                style={
                  styles.largeCard
                }
              >
                <Text
                  style={
                    styles.cardTitle
                  }
                >
                  {t(
                    "aiWellnessSummary"
                  )}
                </Text>

                <Text
                  style={
                    styles.cardText
                  }
                >
                  {t(
                    "wellnessSummary"
                  )}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* OPTIONAL COACH TAB */}

          {activeTab ===
            "Coach" && (
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "aiCoachingTools"
                )}
              </Text>

              <View
                style={
                  styles.quickStatsGrid
                }
              >
                <ActionCard
                  icon="restaurant"
                  title={
                    t(
                      "mealPlan"
                    )
                  }
                  onPress={
                    handleMealPlanner
                  }
                />

                <ActionCard
                  icon="water"
                  title={
                    t(
                      "hydration"
                    )
                  }
                  onPress={
                    handleHydration
                  }
                />

                <ActionCard
                  icon="heart"
                  title={
                    t(
                      "recovery"
                    )
                  }
                  onPress={
                    handleRecovery
                  }
                />

                <ActionCard
                  icon="moon"
                  title={
                    t(
                      "sleep"
                    )
                  }
                  onPress={
                    handleSleep
                  }
                />

                <ActionCard
                  icon="leaf"
                  title={
                    t(
                      "breathing"
                    )
                  }
                  onPress={
                    handleBreathing
                  }
                />

                <ActionCard
                  icon="sparkles"
                  title={
                    t(
                      "motivation"
                    )
                  }
                  onPress={() =>
                    navTo(
                      "MotivationCoach"
                    )
                  }
                />
              </View>
            </View>
          )}

          {/* OPTIONAL JOURNEY TAB */}

          {activeTab ===
            "Journey" && (
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "journeyCoach"
                )}
              </Text>

              <LinearGradient
                colors={[
                  "#132A46",
                  "#0B1D35",
                  "#071221",
                ]}
                style={
                  styles.largeCard
                }
              >
                <Text
                  style={
                    styles.smallLabel
                  }
                >
                  {t(
                    "currentJourney"
                  )}
                </Text>

                <Text
                  style={
                    styles.cardTitle
                  }
                >
                  {wellness.journeyFull ||
                    t(
                      "noActiveJourney"
                    )}
                </Text>

                {wellness.journey ? (
                  <Text
                    style={
                      styles.cardText
                    }
                  >
                    {t(
                      "checkpointProgress",
                      {
                        checkpoint:
                          wellness.checkpoint ||
                          "—",

                        progress:
                          Math.round(
                            wellness.journeyProgress
                          ),
                      }
                    )}
                  </Text>
                ) : null}

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
                          `${wellness.journeyProgress}%`,
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={
                    styles.goldButton
                  }
                  onPress={
                    handleStartWalk
                  }
                >
                  <Text
                    style={
                      styles.goldButtonText
                    }
                  >
                    {t(
                      "continueJourney"
                    )}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#020611"
                  />
                </TouchableOpacity>
              </LinearGradient>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "aiRoutePlan"
                )}
              </Text>

              <View
                style={
                  styles.activityContainer
                }
              >
                <ActivityItem
                  icon="flag"
                  color="#2D7FF9"
                  title={
                    t(
                      "nextCheckpoint"
                    )
                  }
                  subtitle={
                    t(
                      "nextCheckpointMessage"
                    )
                  }
                  time={
                    t(
                      "thisWeek"
                    )
                  }
                />

                <ActivityItem
                  icon="speedometer"
                  color="#44F58A"
                  title={
                    t(
                      "suggestedPace"
                    )
                  }
                  subtitle={
                    t(
                      "suggestedPaceMessage"
                    )
                  }
                  time={
                    t(
                      "ai"
                    )
                  }
                />

                <ActivityItem
                  icon="walk"
                  color="#F7C948"
                  title={
                    t(
                      "dailyGoal"
                    )
                  }
                  subtitle={t(
                    "dailyGoalMessage",
                    {
                      steps:
                        Number(
                          wellness.stepGoal ||
                            DEFAULT_STEP_GOAL
                        ).toLocaleString(),
                    }
                  )}
                  time={
                    t(
                      "today"
                    )
                  }
                />
              </View>
            </View>
          )}

          <View
            style={{
              height: 180,
            }}
          />
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
      style={
        styles.heroAction
      }
      onPress={
        onPress
      }
      activeOpacity={
        0.85
      }
    >
      <Ionicons
        name={icon}
        size={24}
        color="#020611"
      />

      <Text
        style={
          styles.heroActionText
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// QUICK STAT
// ============================================================

function QuickStatCard({
  icon,
  title,
  value,
  progress,
  color,
  onPress,
}) {
  const safeProgress =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          progress
        ) || 0
      )
    );

  return (
    <TouchableOpacity
      style={
        styles.quickStatCard
      }
      onPress={
        onPress
      }
      activeOpacity={
        0.85
      }
    >
      <View
        style={
          styles.quickStatTop
        }
      >
        <Ionicons
          name={icon}
          size={24}
          color={color}
        />

        <Text
          style={
            styles.quickStatTitle
          }
          numberOfLines={
            2
          }
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </View>

      <Text
        style={
          styles.quickStatValue
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <View
        style={
          styles.quickProgressTrack
        }
      >
        <View
          style={[
            styles.quickProgressFill,
            {
              width:
                `${safeProgress}%`,

              backgroundColor:
                color,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// ACTION CARD
// ============================================================

function ActionCard({
  icon,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={
        styles.actionCard
      }
      onPress={
        onPress
      }
      activeOpacity={
        0.85
      }
    >
      <Ionicons
        name={icon}
        size={28}
        color="#F7C948"
      />

      <Text
        style={
          styles.actionTitle
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// AI INSIGHT
// ============================================================

function AIInsightCard({
  title,
  message,
  confidence,
  trend,
  trendLabel,
  action,
  confidenceLabel,
  onPress,
}) {
  return (
    <LinearGradient
      colors={[
        "#0A2442",
        "#08192F",
        "#051120",
      ]}
      style={
        styles.insightCard
      }
    >
      <View
        style={
          styles.insightHeader
        }
      >
        <View
          style={
            styles.aiBadge
          }
        >
          <Ionicons
            name="sparkles"
            size={18}
            color="#F7C948"
          />

          <Text
            style={
              styles.aiBadgeText
            }
          >
            LEGATHON AI
          </Text>
        </View>

        <View
          style={
            styles.confidenceBox
          }
        >
          <Text
            style={
              styles.confidenceNumber
            }
          >
            {confidence}%
          </Text>

          <Text
            style={
              styles.confidenceLabel
            }
          >
            {confidenceLabel}
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.insightTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.insightMessage
        }
      >
        {message}
      </Text>

      <View
        style={
          styles.trendRow
        }
      >
        <Ionicons
          name="trending-up"
          size={18}
          color="#44F58A"
        />

        <Text
          style={
            styles.trendText
          }
        >
          {trendLabel ||
            trend}
        </Text>
      </View>

      <TouchableOpacity
        style={
          styles.insightButton
        }
        onPress={
          onPress
        }
      >
        <Ionicons
          name="walk"
          size={22}
          color="#020611"
        />

        <Text
          style={
            styles.insightButtonText
          }
        >
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
}) {
  return (
    <View
      style={
        styles.activityCard
      }
    >
      <View
        style={[
          styles.activityIcon,
          {
            backgroundColor:
              `${color}20`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={color}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={
            styles.activityTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.activitySubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      {!!time && (
        <Text
          style={
            styles.activityTime
          }
        >
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
    borderColor: "rgba(255,255,255,0.14)",
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

  orbScore: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
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
    backgroundColor: "rgba(68,245,138,0.12)",
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
    backgroundColor: "rgba(255,255,255,0.12)",
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
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247,201,72,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
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
    color: "#44F58A",
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
  },

  largeCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1B3353",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
  },

  cardText: {
    color: "#B8C5D6",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  progressTrack: {
    height: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#44F58A",
  },

  goldButton: {
    marginTop: 24,
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: "#F7C948",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },

  goldButtonText: {
    flexShrink: 1,
    color: "#020611",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 8,
    textAlign: "center",
  },

  actionCard: {
    width: "48%",
    minHeight: 118,
    backgroundColor: "#091A30",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1B3353",
    paddingHorizontal: 10,
  },

  actionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },
});