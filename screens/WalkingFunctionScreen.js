// screens/WalkingFunctionScreen.js

import React, {
  useMemo,
} from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  useWalkingSession,
} from "../hooks/useWalkingSession";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// LEGATHON WALK — WALKING FUNCTION
// ============================================================
//
// Walking Analytics = How much am I walking?
// Walking Function  = How am I walking?
//
// Text-only mobility insights.
// No AI voice/audio is used on this screen.
//
// ============================================================

const STEPS_PER_MILE = 2000;

const MIN_FUNCTION_SESSIONS = 3;

// ============================================================
// TRANSLATIONS
// ============================================================

const WALKING_FUNCTION_TEXT = {
  en: {
    back: "Back",
    brand: "LEGATHON WALK",
    title: "Walking\nFunction",
    subtitle:
      "Understand your pace, consistency, endurance and walking trends over time.",

    stepTracking: "Step Tracking",
    pedometerUnavailable:
      "Live pedometer data is unavailable on this device. Historical Walking Function data can still be displayed.",

    functionScore: "WALKING FUNCTION SCORE",
    buildingBaseline: "Building Baseline",
    excellent: "Excellent",
    strong: "Strong",
    steady: "Steady",
    developing: "Developing",
    watchTrend: "Watch Your Trend",

    scoreDescription:
      "Based on your personal pace, consistency, endurance and recent walking history.",

    scoreNeedsData:
      "Complete more walking sessions to establish your personal Walking Function baseline.",

    liveWalkingPace: "Live Walking Pace",
    currentSession: "CURRENT SESSION",
    walkingPace: "Walking Pace",

    walking: "WALKING",
    paused: "PAUSED",
    ready: "READY",

    minMile: "MIN / MILE",

    speed: "SPEED",
    cadence: "CADENCE",
    steps: "STEPS",
    distance: "DISTANCE",

    mph: "MPH",
    stepsMin: "STEPS / MIN",
    session: "SESSION",
    miles: "MILES",

    walkingTime: "Walking Time",

    startWalk: "START WALK",
    pause: "PAUSE",
    finish: "FINISH",
    resume: "RESUME",

    personalPaceTrend: "Personal Pace Trend",

    improving: "Improving",
    slowerBaseline: "Slower Than Baseline",
    stable: "Stable",

    percentChange: "{percent}% change",

    baselineTrendMessage:
      "Keep walking. Legathon is building your personal walking baseline.",

    improvingTrendMessage:
      "Your recent walking pace is faster than your personal baseline.",

    slowerTrendMessage:
      "Your recent walking pace is slower than your personal baseline.",

    stableTrendMessage:
      "Your recent walking pace is staying close to your personal baseline.",

    sevenDayAverage: "7-DAY AVG",
    thirtyDayAverage: "30-DAY AVG",

    sessionsLast30:
      "{count} qualifying walking sessions in the last 30 days",

    mobilityIndicators: "Mobility Indicators",
    paceConsistency: "PACE CONSISTENCY",

    consistencyBuilding: "Building",
    verySteady: "Very Steady",
    variable: "Variable",

    consistencyDescription:
      "Shows how consistently you maintain your pace across recent walking sessions.",

    walkingEndurance: "WALKING ENDURANCE",
    averageMinutes: "AVG MINUTES",
    longestWalk: "LONGEST WALK",

    personalBaseline: "PERSONAL BASELINE",
    yourWalkingPattern: "Your Walking Pattern",
    baselineMinMile: "BASELINE MIN / MILE",

    baselineDescription:
      "Legathon compares your recent walking against your own established pattern rather than judging everyone by one universal walking speed.",

    aiMobilityInsight: "AI Mobility Insight",
    legathonAI: "LEGATHON AI",
    walkingInsight: "Walking Insight",

    aiBaseline:
      "Legathon is learning your walking pattern. Complete more walking sessions to establish your personal pace, endurance and consistency baseline.",

    aiImproving:
      "Your recent walking pace has improved by approximately {percent}% compared with your personal baseline.",

    aiStable:
      "Your recent walking pace is staying relatively consistent with your personal baseline.",

    aiSlower:
      "Your recent walking pace is approximately {percent}% slower than your personal baseline.",

    aiVeryConsistent:
      "Your pace has also been very consistent across recent walks.",

    aiVariable:
      "Your pace has varied more between recent walking sessions.",

    aiEndurance:
      "Your recent walks average about {minutes} minutes, giving Legathon a useful endurance trend.",

    aiStrong:
      "Your overall Walking Function pattern is currently strong relative to your established Legathon baseline.",

    aiContinue:
      "Continue walking to strengthen your personal Walking Function trend.",

    disclaimer:
      "Walking Function provides wellness and activity insights from your Legathon walking data. It is not a medical diagnosis or clinical assessment.",

    recentWalks: "Recent Walks",
    loadingHistory: "Loading walking history...",

    noWalkingSessions:
      "No Walking Function sessions yet. Start your first walk to begin building your personal baseline.",

    walk: "Walk",

    historyDetails:
      "{steps} steps • {miles} mi",

    perMile: "/ mile",
  },

  es: {
    back: "Atrás",
    brand: "LEGATHON WALK",
    title: "Función de\nCaminata",
    subtitle:
      "Comprende tu ritmo, consistencia, resistencia y tendencias al caminar con el tiempo.",

    stepTracking: "Seguimiento de Pasos",
    pedometerUnavailable:
      "Los datos del podómetro en vivo no están disponibles en este dispositivo. Los datos históricos de Función de Caminata todavía pueden mostrarse.",

    functionScore: "PUNTUACIÓN DE FUNCIÓN AL CAMINAR",
    buildingBaseline: "Creando Referencia",
    excellent: "Excelente",
    strong: "Fuerte",
    steady: "Estable",
    developing: "En Desarrollo",
    watchTrend: "Observa Tu Tendencia",

    scoreDescription:
      "Basado en tu ritmo personal, consistencia, resistencia e historial reciente de caminata.",

    scoreNeedsData:
      "Completa más sesiones de caminata para establecer tu referencia personal.",

    liveWalkingPace: "Ritmo de Caminata en Vivo",
    currentSession: "SESIÓN ACTUAL",
    walkingPace: "Ritmo de Caminata",

    walking: "CAMINANDO",
    paused: "PAUSADO",
    ready: "LISTO",

    minMile: "MIN / MILLA",

    speed: "VELOCIDAD",
    cadence: "CADENCIA",
    steps: "PASOS",
    distance: "DISTANCIA",

    mph: "MPH",
    stepsMin: "PASOS / MIN",
    session: "SESIÓN",
    miles: "MILLAS",

    walkingTime: "Tiempo Caminando",

    startWalk: "INICIAR CAMINATA",
    pause: "PAUSAR",
    finish: "FINALIZAR",
    resume: "CONTINUAR",

    personalPaceTrend: "Tendencia de Ritmo Personal",

    improving: "Mejorando",
    slowerBaseline: "Más Lento que la Referencia",
    stable: "Estable",

    percentChange: "{percent}% de cambio",

    baselineTrendMessage:
      "Sigue caminando. Legathon está creando tu referencia personal de caminata.",

    improvingTrendMessage:
      "Tu ritmo reciente es más rápido que tu referencia personal.",

    slowerTrendMessage:
      "Tu ritmo reciente es más lento que tu referencia personal.",

    stableTrendMessage:
      "Tu ritmo reciente se mantiene cerca de tu referencia personal.",

    sevenDayAverage: "PROMEDIO 7 DÍAS",
    thirtyDayAverage: "PROMEDIO 30 DÍAS",

    sessionsLast30:
      "{count} sesiones válidas de caminata en los últimos 30 días",

    mobilityIndicators: "Indicadores de Movilidad",
    paceConsistency: "CONSISTENCIA DEL RITMO",

    consistencyBuilding: "Creando",
    verySteady: "Muy Estable",
    variable: "Variable",

    consistencyDescription:
      "Muestra qué tan constante mantienes tu ritmo entre tus sesiones recientes.",

    walkingEndurance: "RESISTENCIA AL CAMINAR",
    averageMinutes: "MINUTOS PROM.",
    longestWalk: "CAMINATA MÁS LARGA",

    personalBaseline: "REFERENCIA PERSONAL",
    yourWalkingPattern: "Tu Patrón de Caminata",
    baselineMinMile: "MIN / MILLA DE REFERENCIA",

    baselineDescription:
      "Legathon compara tu caminata reciente con tu propio patrón establecido en lugar de comparar a todos con una sola velocidad.",

    aiMobilityInsight: "Análisis de Movilidad con IA",
    legathonAI: "IA LEGATHON",
    walkingInsight: "Análisis de Caminata",

    aiBaseline:
      "Legathon está aprendiendo tu patrón de caminata. Completa más sesiones para establecer tu ritmo, resistencia y consistencia personal.",

    aiImproving:
      "Tu ritmo reciente ha mejorado aproximadamente un {percent}% en comparación con tu referencia personal.",

    aiStable:
      "Tu ritmo reciente se mantiene relativamente constante con tu referencia personal.",

    aiSlower:
      "Tu ritmo reciente es aproximadamente un {percent}% más lento que tu referencia personal.",

    aiVeryConsistent:
      "Tu ritmo también ha sido muy constante durante tus caminatas recientes.",

    aiVariable:
      "Tu ritmo ha variado más entre tus sesiones recientes.",

    aiEndurance:
      "Tus caminatas recientes duran un promedio de {minutes} minutos, lo que permite establecer una tendencia de resistencia.",

    aiStrong:
      "Tu patrón general de Función de Caminata es actualmente fuerte en comparación con tu referencia Legathon.",

    aiContinue:
      "Sigue caminando para fortalecer tu tendencia personal.",

    disclaimer:
      "Función de Caminata proporciona información de bienestar y actividad a partir de tus datos Legathon. No es un diagnóstico médico ni una evaluación clínica.",

    recentWalks: "Caminatas Recientes",
    loadingHistory: "Cargando historial de caminatas...",

    noWalkingSessions:
      "Aún no hay sesiones de Función de Caminata. Inicia tu primera caminata para comenzar a crear tu referencia personal.",

    walk: "Caminata",

    historyDetails:
      "{steps} pasos • {miles} mi",

    perMile: "/ milla",
  },

  fr: {
    back: "Retour",
    brand: "LEGATHON WALK",
    title: "Fonction de\nMarche",
    subtitle:
      "Comprenez votre rythme, votre régularité, votre endurance et vos tendances de marche.",

    stepTracking: "Suivi des Pas",
    pedometerUnavailable:
      "Les données du podomètre en direct ne sont pas disponibles sur cet appareil. Les données historiques peuvent toujours être affichées.",

    functionScore: "SCORE DE FONCTION DE MARCHE",
    buildingBaseline: "Création de Référence",
    excellent: "Excellent",
    strong: "Fort",
    steady: "Stable",
    developing: "En Développement",
    watchTrend: "Surveillez Votre Tendance",

    scoreDescription:
      "Basé sur votre rythme personnel, votre régularité, votre endurance et votre historique récent.",

    scoreNeedsData:
      "Effectuez davantage de séances pour établir votre référence personnelle de marche.",

    liveWalkingPace: "Rythme de Marche en Direct",
    currentSession: "SESSION ACTUELLE",
    walkingPace: "Rythme de Marche",

    walking: "EN MARCHE",
    paused: "EN PAUSE",
    ready: "PRÊT",

    minMile: "MIN / MILE",

    speed: "VITESSE",
    cadence: "CADENCE",
    steps: "PAS",
    distance: "DISTANCE",

    mph: "MPH",
    stepsMin: "PAS / MIN",
    session: "SESSION",
    miles: "MILES",

    walkingTime: "Temps de Marche",

    startWalk: "DÉMARRER",
    pause: "PAUSE",
    finish: "TERMINER",
    resume: "REPRENDRE",

    personalPaceTrend: "Tendance de Rythme Personnel",

    improving: "En Amélioration",
    slowerBaseline: "Plus Lent que la Référence",
    stable: "Stable",

    percentChange: "{percent}% de changement",

    baselineTrendMessage:
      "Continuez à marcher. Legathon construit votre référence personnelle.",

    improvingTrendMessage:
      "Votre rythme récent est plus rapide que votre référence personnelle.",

    slowerTrendMessage:
      "Votre rythme récent est plus lent que votre référence personnelle.",

    stableTrendMessage:
      "Votre rythme récent reste proche de votre référence personnelle.",

    sevenDayAverage: "MOY. 7 JOURS",
    thirtyDayAverage: "MOY. 30 JOURS",

    sessionsLast30:
      "{count} séances de marche admissibles au cours des 30 derniers jours",

    mobilityIndicators: "Indicateurs de Mobilité",
    paceConsistency: "RÉGULARITÉ DU RYTHME",

    consistencyBuilding: "En Construction",
    verySteady: "Très Régulier",
    variable: "Variable",

    consistencyDescription:
      "Indique la régularité avec laquelle vous maintenez votre rythme pendant vos marches récentes.",

    walkingEndurance: "ENDURANCE DE MARCHE",
    averageMinutes: "MINUTES MOY.",
    longestWalk: "MARCHE LA PLUS LONGUE",

    personalBaseline: "RÉFÉRENCE PERSONNELLE",
    yourWalkingPattern: "Votre Profil de Marche",
    baselineMinMile: "MIN / MILE DE RÉFÉRENCE",

    baselineDescription:
      "Legathon compare votre marche récente à votre propre profil établi plutôt qu'à une vitesse universelle.",

    aiMobilityInsight: "Analyse de Mobilité IA",
    legathonAI: "IA LEGATHON",
    walkingInsight: "Analyse de Marche",

    aiBaseline:
      "Legathon apprend votre profil de marche. Effectuez davantage de séances pour établir votre rythme, votre endurance et votre régularité personnels.",

    aiImproving:
      "Votre rythme récent s'est amélioré d'environ {percent}% par rapport à votre référence personnelle.",

    aiStable:
      "Votre rythme récent reste relativement stable par rapport à votre référence personnelle.",

    aiSlower:
      "Votre rythme récent est environ {percent}% plus lent que votre référence personnelle.",

    aiVeryConsistent:
      "Votre rythme a également été très régulier lors de vos marches récentes.",

    aiVariable:
      "Votre rythme a davantage varié entre vos séances récentes.",

    aiEndurance:
      "Vos marches récentes durent en moyenne {minutes} minutes, ce qui fournit une tendance utile d'endurance.",

    aiStrong:
      "Votre profil global de Fonction de Marche est actuellement solide par rapport à votre référence Legathon.",

    aiContinue:
      "Continuez à marcher pour renforcer votre tendance personnelle.",

    disclaimer:
      "La Fonction de Marche fournit des informations de bien-être et d'activité basées sur vos données Legathon. Elle ne constitue pas un diagnostic médical ni une évaluation clinique.",

    recentWalks: "Marches Récentes",
    loadingHistory: "Chargement de l'historique de marche...",

    noWalkingSessions:
      "Aucune séance de Fonction de Marche pour le moment. Commencez votre première marche pour créer votre référence personnelle.",

    walk: "Marche",

    historyDetails:
      "{steps} pas • {miles} mi",

    perMile: "/ mile",
  },

  de: {
    back: "Zurück",
    brand: "LEGATHON WALK",
    title: "Gehfunktion",
    subtitle:
      "Verstehe dein Tempo, deine Beständigkeit, Ausdauer und Gehtrends im Laufe der Zeit.",

    stepTracking: "Schrittverfolgung",
    pedometerUnavailable:
      "Live-Schrittzählerdaten sind auf diesem Gerät nicht verfügbar. Historische Daten zur Gehfunktion können weiterhin angezeigt werden.",

    functionScore: "GEHFUNKTIONSWERT",
    buildingBaseline: "Referenz Wird Erstellt",
    excellent: "Ausgezeichnet",
    strong: "Stark",
    steady: "Stabil",
    developing: "In Entwicklung",
    watchTrend: "Trend Beobachten",

    scoreDescription:
      "Basierend auf deinem persönlichen Tempo, deiner Beständigkeit, Ausdauer und deinem aktuellen Verlauf.",

    scoreNeedsData:
      "Absolviere weitere Geh-Sitzungen, um deine persönliche Referenz aufzubauen.",

    liveWalkingPace: "Live-Gehtempo",
    currentSession: "AKTUELLE SITZUNG",
    walkingPace: "Gehtempo",

    walking: "GEHEN",
    paused: "PAUSIERT",
    ready: "BEREIT",

    minMile: "MIN / MEILE",

    speed: "GESCHWINDIGKEIT",
    cadence: "SCHRITTFREQUENZ",
    steps: "SCHRITTE",
    distance: "DISTANZ",

    mph: "MPH",
    stepsMin: "SCHRITTE / MIN",
    session: "SITZUNG",
    miles: "MEILEN",

    walkingTime: "Gehzeit",

    startWalk: "START",
    pause: "PAUSE",
    finish: "BEENDEN",
    resume: "FORTSETZEN",

    personalPaceTrend: "Persönlicher Tempotrend",

    improving: "Verbesserung",
    slowerBaseline: "Langsamer als Referenz",
    stable: "Stabil",

    percentChange: "{percent}% Änderung",

    baselineTrendMessage:
      "Gehe weiter. Legathon erstellt deine persönliche Geh-Referenz.",

    improvingTrendMessage:
      "Dein aktuelles Gehtempo ist schneller als deine persönliche Referenz.",

    slowerTrendMessage:
      "Dein aktuelles Gehtempo ist langsamer als deine persönliche Referenz.",

    stableTrendMessage:
      "Dein aktuelles Tempo bleibt nahe an deiner persönlichen Referenz.",

    sevenDayAverage: "7-TAGE-DURCHSCHNITT",
    thirtyDayAverage: "30-TAGE-DURCHSCHNITT",

    sessionsLast30:
      "{count} gültige Geh-Sitzungen in den letzten 30 Tagen",

    mobilityIndicators: "Mobilitätsindikatoren",
    paceConsistency: "TEMPOBESTÄNDIGKEIT",

    consistencyBuilding: "Aufbau",
    verySteady: "Sehr Stabil",
    variable: "Variabel",

    consistencyDescription:
      "Zeigt, wie gleichmäßig du dein Tempo bei deinen letzten Geh-Sitzungen hältst.",

    walkingEndurance: "GEHAUSDAUER",
    averageMinutes: "Ø MINUTEN",
    longestWalk: "LÄNGSTER GANG",

    personalBaseline: "PERSÖNLICHE REFERENZ",
    yourWalkingPattern: "Dein Gehmuster",
    baselineMinMile: "REFERENZ MIN / MEILE",

    baselineDescription:
      "Legathon vergleicht deine aktuelle Gehweise mit deinem eigenen etablierten Muster statt mit einer allgemeinen Gehgeschwindigkeit.",

    aiMobilityInsight: "KI-Mobilitätseinblick",
    legathonAI: "LEGATHON KI",
    walkingInsight: "Geheinblick",

    aiBaseline:
      "Legathon lernt dein Gehmuster. Absolviere weitere Sitzungen, um Tempo, Ausdauer und Beständigkeit zu bestimmen.",

    aiImproving:
      "Dein aktuelles Gehtempo hat sich gegenüber deiner persönlichen Referenz um etwa {percent}% verbessert.",

    aiStable:
      "Dein aktuelles Tempo bleibt relativ konstant zu deiner persönlichen Referenz.",

    aiSlower:
      "Dein aktuelles Tempo ist etwa {percent}% langsamer als deine persönliche Referenz.",

    aiVeryConsistent:
      "Dein Tempo war bei deinen letzten Spaziergängen sehr beständig.",

    aiVariable:
      "Dein Tempo hat zwischen den letzten Geh-Sitzungen stärker variiert.",

    aiEndurance:
      "Deine letzten Spaziergänge dauern durchschnittlich {minutes} Minuten und liefern einen nützlichen Ausdauertrend.",

    aiStrong:
      "Dein gesamtes Gehfunktionsmuster ist im Vergleich zu deiner Legathon-Referenz derzeit stark.",

    aiContinue:
      "Gehe weiter, um deinen persönlichen Gehfunktionstrend zu stärken.",

    disclaimer:
      "Die Gehfunktion liefert Wellness- und Aktivitätseinblicke aus deinen Legathon-Gehdaten. Sie ist keine medizinische Diagnose oder klinische Bewertung.",

    recentWalks: "Letzte Spaziergänge",
    loadingHistory: "Gehverlauf wird geladen...",

    noWalkingSessions:
      "Noch keine Gehfunktions-Sitzungen. Starte deinen ersten Spaziergang, um deine persönliche Referenz aufzubauen.",

    walk: "Spaziergang",

    historyDetails:
      "{steps} Schritte • {miles} mi",

    perMile: "/ Meile",
  },

  pt: {
    back: "Voltar",
    brand: "LEGATHON WALK",
    title: "Função de\nCaminhada",
    subtitle:
      "Entenda seu ritmo, consistência, resistência e tendências de caminhada ao longo do tempo.",

    stepTracking: "Rastreamento de Passos",
    pedometerUnavailable:
      "Os dados ao vivo do pedômetro não estão disponíveis neste dispositivo. Os dados históricos ainda podem ser exibidos.",

    functionScore: "PONTUAÇÃO DA FUNÇÃO DE CAMINHADA",
    buildingBaseline: "Criando Referência",
    excellent: "Excelente",
    strong: "Forte",
    steady: "Estável",
    developing: "Em Desenvolvimento",
    watchTrend: "Observe Sua Tendência",

    scoreDescription:
      "Com base no seu ritmo pessoal, consistência, resistência e histórico recente de caminhada.",

    scoreNeedsData:
      "Complete mais sessões para estabelecer sua referência pessoal de caminhada.",

    liveWalkingPace: "Ritmo de Caminhada ao Vivo",
    currentSession: "SESSÃO ATUAL",
    walkingPace: "Ritmo de Caminhada",

    walking: "CAMINHANDO",
    paused: "PAUSADO",
    ready: "PRONTO",

    minMile: "MIN / MILHA",

    speed: "VELOCIDADE",
    cadence: "CADÊNCIA",
    steps: "PASSOS",
    distance: "DISTÂNCIA",

    mph: "MPH",
    stepsMin: "PASSOS / MIN",
    session: "SESSÃO",
    miles: "MILHAS",

    walkingTime: "Tempo de Caminhada",

    startWalk: "INICIAR CAMINHADA",
    pause: "PAUSAR",
    finish: "FINALIZAR",
    resume: "CONTINUAR",

    personalPaceTrend: "Tendência do Ritmo Pessoal",

    improving: "Melhorando",
    slowerBaseline: "Mais Lento que a Referência",
    stable: "Estável",

    percentChange: "{percent}% de mudança",

    baselineTrendMessage:
      "Continue caminhando. O Legathon está criando sua referência pessoal.",

    improvingTrendMessage:
      "Seu ritmo recente está mais rápido que sua referência pessoal.",

    slowerTrendMessage:
      "Seu ritmo recente está mais lento que sua referência pessoal.",

    stableTrendMessage:
      "Seu ritmo recente está próximo da sua referência pessoal.",

    sevenDayAverage: "MÉDIA 7 DIAS",
    thirtyDayAverage: "MÉDIA 30 DIAS",

    sessionsLast30:
      "{count} sessões válidas nos últimos 30 dias",

    mobilityIndicators: "Indicadores de Mobilidade",
    paceConsistency: "CONSISTÊNCIA DO RITMO",

    consistencyBuilding: "Criando",
    verySteady: "Muito Estável",
    variable: "Variável",

    consistencyDescription:
      "Mostra com que consistência você mantém seu ritmo nas caminhadas recentes.",

    walkingEndurance: "RESISTÊNCIA NA CAMINHADA",
    averageMinutes: "MÉDIA MINUTOS",
    longestWalk: "CAMINHADA MAIS LONGA",

    personalBaseline: "REFERÊNCIA PESSOAL",
    yourWalkingPattern: "Seu Padrão de Caminhada",
    baselineMinMile: "REFERÊNCIA MIN / MILHA",

    baselineDescription:
      "O Legathon compara sua caminhada recente ao seu próprio padrão estabelecido, em vez de usar uma velocidade universal.",

    aiMobilityInsight: "Análise de Mobilidade com IA",
    legathonAI: "IA LEGATHON",
    walkingInsight: "Análise de Caminhada",

    aiBaseline:
      "O Legathon está aprendendo seu padrão de caminhada. Complete mais sessões para estabelecer ritmo, resistência e consistência.",

    aiImproving:
      "Seu ritmo recente melhorou aproximadamente {percent}% em comparação com sua referência pessoal.",

    aiStable:
      "Seu ritmo recente permanece relativamente consistente com sua referência pessoal.",

    aiSlower:
      "Seu ritmo recente está aproximadamente {percent}% mais lento que sua referência pessoal.",

    aiVeryConsistent:
      "Seu ritmo também tem sido muito consistente nas caminhadas recentes.",

    aiVariable:
      "Seu ritmo variou mais entre as sessões recentes.",

    aiEndurance:
      "Suas caminhadas recentes duram em média {minutes} minutos, fornecendo uma tendência útil de resistência.",

    aiStrong:
      "Seu padrão geral de Função de Caminhada está forte em comparação com sua referência Legathon.",

    aiContinue:
      "Continue caminhando para fortalecer sua tendência pessoal.",

    disclaimer:
      "A Função de Caminhada fornece informações de bem-estar e atividade com base nos seus dados Legathon. Não é um diagnóstico médico nem uma avaliação clínica.",

    recentWalks: "Caminhadas Recentes",
    loadingHistory: "Carregando histórico de caminhada...",

    noWalkingSessions:
      "Ainda não há sessões de Função de Caminhada. Inicie sua primeira caminhada para criar sua referência pessoal.",

    walk: "Caminhada",

    historyDetails:
      "{steps} passos • {miles} mi",

    perMile: "/ milha",
  },

  ja: {
    back: "戻る",
    brand: "LEGATHON WALK",
    title: "ウォーキング\n機能",
    subtitle:
      "歩行ペース、安定性、持久力、時間による変化を確認できます。",

    stepTracking: "歩数トラッキング",
    pedometerUnavailable:
      "このデバイスではリアルタイム歩数データを利用できません。過去のウォーキング機能データは引き続き表示できます。",

    functionScore: "ウォーキング機能スコア",
    buildingBaseline: "基準を作成中",
    excellent: "非常に良好",
    strong: "良好",
    steady: "安定",
    developing: "向上中",
    watchTrend: "傾向を確認",

    scoreDescription:
      "あなた自身の歩行ペース、安定性、持久力、最近の歩行履歴に基づいています。",

    scoreNeedsData:
      "さらにウォーキングセッションを完了すると、あなた自身の基準を作成できます。",

    liveWalkingPace: "リアルタイム歩行ペース",
    currentSession: "現在のセッション",
    walkingPace: "歩行ペース",

    walking: "歩行中",
    paused: "一時停止",
    ready: "準備完了",

    minMile: "分 / マイル",

    speed: "速度",
    cadence: "ケイデンス",
    steps: "歩数",
    distance: "距離",

    mph: "マイル/時",
    stepsMin: "歩 / 分",
    session: "セッション",
    miles: "マイル",

    walkingTime: "歩行時間",

    startWalk: "歩行開始",
    pause: "一時停止",
    finish: "終了",
    resume: "再開",

    personalPaceTrend: "個人ペースの傾向",

    improving: "改善中",
    slowerBaseline: "基準より遅い",
    stable: "安定",

    percentChange: "{percent}% 変化",

    baselineTrendMessage:
      "歩き続けてください。Legathonがあなた自身の歩行基準を作成しています。",

    improvingTrendMessage:
      "最近の歩行ペースは、あなた自身の基準より速くなっています。",

    slowerTrendMessage:
      "最近の歩行ペースは、あなた自身の基準より遅くなっています。",

    stableTrendMessage:
      "最近の歩行ペースは、あなた自身の基準に近い状態を維持しています。",

    sevenDayAverage: "7日平均",
    thirtyDayAverage: "30日平均",

    sessionsLast30:
      "過去30日間の対象ウォーキングセッション：{count}回",

    mobilityIndicators: "モビリティ指標",
    paceConsistency: "ペースの安定性",

    consistencyBuilding: "分析中",
    verySteady: "非常に安定",
    variable: "変動あり",

    consistencyDescription:
      "最近のウォーキングで、どれだけ安定してペースを維持できているかを示します。",

    walkingEndurance: "歩行持久力",
    averageMinutes: "平均時間",
    longestWalk: "最長ウォーク",

    personalBaseline: "個人基準",
    yourWalkingPattern: "あなたの歩行パターン",
    baselineMinMile: "基準 分 / マイル",

    baselineDescription:
      "Legathonは全員を同じ歩行速度で比較するのではなく、あなた自身の確立された歩行パターンと最近の歩行を比較します。",

    aiMobilityInsight: "AIモビリティ分析",
    legathonAI: "LEGATHON AI",
    walkingInsight: "歩行インサイト",

    aiBaseline:
      "Legathonはあなたの歩行パターンを学習しています。さらにセッションを完了して、ペース、持久力、安定性の個人基準を作成してください。",

    aiImproving:
      "最近の歩行ペースは個人基準と比べて約{percent}%改善しています。",

    aiStable:
      "最近の歩行ペースは個人基準と比較して比較的安定しています。",

    aiSlower:
      "最近の歩行ペースは個人基準より約{percent}%遅くなっています。",

    aiVeryConsistent:
      "最近のウォーキングではペースも非常に安定しています。",

    aiVariable:
      "最近のウォーキングセッションではペースの変動が大きくなっています。",

    aiEndurance:
      "最近のウォーキングは平均約{minutes}分で、持久力の傾向を確認するために役立ちます。",

    aiStrong:
      "現在のウォーキング機能パターンは、あなた自身のLegathon基準と比較して良好です。",

    aiContinue:
      "歩き続けて、あなた自身のウォーキング機能の傾向を強化してください。",

    disclaimer:
      "ウォーキング機能はLegathonの歩行データからウェルネスと活動に関する情報を提供します。医療診断や臨床評価ではありません。",

    recentWalks: "最近のウォーキング",
    loadingHistory: "ウォーキング履歴を読み込み中...",

    noWalkingSessions:
      "ウォーキング機能のセッションはまだありません。最初のウォーキングを開始して個人基準を作成してください。",

    walk: "ウォーキング",

    historyDetails:
      "{steps} 歩 • {miles} マイル",

    perMile: "/ マイル",
  },

  ko: {
    back: "뒤로",
    brand: "LEGATHON WALK",
    title: "걷기\n기능",
    subtitle:
      "시간에 따른 걷기 속도, 일관성, 지구력 및 걷기 추세를 확인하세요.",

    stepTracking: "걸음 추적",
    pedometerUnavailable:
      "이 기기에서는 실시간 만보기 데이터를 사용할 수 없습니다. 이전 걷기 기능 데이터는 계속 확인할 수 있습니다.",

    functionScore: "걷기 기능 점수",
    buildingBaseline: "기준 생성 중",
    excellent: "매우 좋음",
    strong: "좋음",
    steady: "안정적",
    developing: "발전 중",
    watchTrend: "추세 확인",

    scoreDescription:
      "개인 걷기 속도, 일관성, 지구력 및 최근 걷기 기록을 기반으로 합니다.",

    scoreNeedsData:
      "더 많은 걷기 세션을 완료하여 개인 기준을 설정하세요.",

    liveWalkingPace: "실시간 걷기 속도",
    currentSession: "현재 세션",
    walkingPace: "걷기 속도",

    walking: "걷는 중",
    paused: "일시정지",
    ready: "준비",

    minMile: "분 / 마일",

    speed: "속도",
    cadence: "케이던스",
    steps: "걸음",
    distance: "거리",

    mph: "마일/시간",
    stepsMin: "걸음 / 분",
    session: "세션",
    miles: "마일",

    walkingTime: "걷기 시간",

    startWalk: "걷기 시작",
    pause: "일시정지",
    finish: "종료",
    resume: "계속",

    personalPaceTrend: "개인 걷기 속도 추세",

    improving: "향상 중",
    slowerBaseline: "기준보다 느림",
    stable: "안정적",

    percentChange: "{percent}% 변화",

    baselineTrendMessage:
      "계속 걸으세요. Legathon이 개인 걷기 기준을 만들고 있습니다.",

    improvingTrendMessage:
      "최근 걷기 속도가 개인 기준보다 빨라졌습니다.",

    slowerTrendMessage:
      "최근 걷기 속도가 개인 기준보다 느립니다.",

    stableTrendMessage:
      "최근 걷기 속도가 개인 기준과 비슷하게 유지되고 있습니다.",

    sevenDayAverage: "7일 평균",
    thirtyDayAverage: "30일 평균",

    sessionsLast30:
      "지난 30일 동안 유효한 걷기 세션 {count}회",

    mobilityIndicators: "이동성 지표",
    paceConsistency: "속도 일관성",

    consistencyBuilding: "분석 중",
    verySteady: "매우 안정적",
    variable: "변동",

    consistencyDescription:
      "최근 걷기 세션에서 얼마나 일정하게 속도를 유지하는지 보여줍니다.",

    walkingEndurance: "걷기 지구력",
    averageMinutes: "평균 시간",
    longestWalk: "최장 걷기",

    personalBaseline: "개인 기준",
    yourWalkingPattern: "나의 걷기 패턴",
    baselineMinMile: "기준 분 / 마일",

    baselineDescription:
      "Legathon은 모든 사람을 하나의 걷기 속도로 평가하지 않고 최근 걷기를 개인의 확립된 패턴과 비교합니다.",

    aiMobilityInsight: "AI 이동성 분석",
    legathonAI: "LEGATHON AI",
    walkingInsight: "걷기 인사이트",

    aiBaseline:
      "Legathon이 걷기 패턴을 학습하고 있습니다. 더 많은 세션을 완료하여 개인 속도, 지구력 및 일관성 기준을 설정하세요.",

    aiImproving:
      "최근 걷기 속도가 개인 기준에 비해 약 {percent}% 향상되었습니다.",

    aiStable:
      "최근 걷기 속도가 개인 기준과 비교해 비교적 일정하게 유지되고 있습니다.",

    aiSlower:
      "최근 걷기 속도가 개인 기준보다 약 {percent}% 느립니다.",

    aiVeryConsistent:
      "최근 걷기에서 속도도 매우 일정했습니다.",

    aiVariable:
      "최근 걷기 세션 사이에서 속도 변화가 더 커졌습니다.",

    aiEndurance:
      "최근 걷기는 평균 약 {minutes}분으로, 지구력 추세를 확인하는 데 도움이 됩니다.",

    aiStrong:
      "현재 전체 걷기 기능 패턴은 개인 Legathon 기준과 비교해 좋은 상태입니다.",

    aiContinue:
      "계속 걸어서 개인 걷기 기능 추세를 강화하세요.",

    disclaimer:
      "걷기 기능은 Legathon 걷기 데이터를 기반으로 웰니스 및 활동 정보를 제공합니다. 의료 진단이나 임상 평가가 아닙니다.",

    recentWalks: "최근 걷기",
    loadingHistory: "걷기 기록 불러오는 중...",

    noWalkingSessions:
      "아직 걷기 기능 세션이 없습니다. 첫 걷기를 시작하여 개인 기준을 만들어 보세요.",

    walk: "걷기",

    historyDetails:
      "{steps} 걸음 • {miles} 마일",

    perMile: "/ 마일",
  },

  zh: {
    back: "返回",
    brand: "LEGATHON WALK",
    title: "步行\n功能",
    subtitle:
      "了解你的步行速度、稳定性、耐力以及随时间变化的步行趋势。",

    stepTracking: "步数追踪",
    pedometerUnavailable:
      "此设备无法使用实时计步器数据，但仍可查看历史步行功能数据。",

    functionScore: "步行功能评分",
    buildingBaseline: "正在建立基准",
    excellent: "优秀",
    strong: "良好",
    steady: "稳定",
    developing: "发展中",
    watchTrend: "关注趋势",

    scoreDescription:
      "根据你的个人步行速度、稳定性、耐力和近期步行记录计算。",

    scoreNeedsData:
      "完成更多步行活动以建立你的个人步行功能基准。",

    liveWalkingPace: "实时步行速度",
    currentSession: "当前活动",
    walkingPace: "步行速度",

    walking: "步行中",
    paused: "已暂停",
    ready: "准备",

    minMile: "分钟 / 英里",

    speed: "速度",
    cadence: "步频",
    steps: "步数",
    distance: "距离",

    mph: "英里/小时",
    stepsMin: "步 / 分钟",
    session: "本次活动",
    miles: "英里",

    walkingTime: "步行时间",

    startWalk: "开始步行",
    pause: "暂停",
    finish: "完成",
    resume: "继续",

    personalPaceTrend: "个人步速趋势",

    improving: "正在提升",
    slowerBaseline: "低于个人基准",
    stable: "稳定",

    percentChange: "变化 {percent}%",

    baselineTrendMessage:
      "继续步行。Legathon正在建立你的个人步行基准。",

    improvingTrendMessage:
      "你最近的步行速度比个人基准更快。",

    slowerTrendMessage:
      "你最近的步行速度比个人基准更慢。",

    stableTrendMessage:
      "你最近的步行速度与个人基准保持接近。",

    sevenDayAverage: "7天平均",
    thirtyDayAverage: "30天平均",

    sessionsLast30:
      "过去30天共有 {count} 次符合条件的步行活动",

    mobilityIndicators: "移动能力指标",
    paceConsistency: "步速稳定性",

    consistencyBuilding: "正在分析",
    verySteady: "非常稳定",
    variable: "有波动",

    consistencyDescription:
      "显示你在最近的步行活动中保持速度的一致程度。",

    walkingEndurance: "步行耐力",
    averageMinutes: "平均分钟",
    longestWalk: "最长步行",

    personalBaseline: "个人基准",
    yourWalkingPattern: "你的步行模式",
    baselineMinMile: "基准 分钟 / 英里",

    baselineDescription:
      "Legathon将你最近的步行与自己的既有模式进行比较，而不是用统一速度评价所有人。",

    aiMobilityInsight: "AI移动能力分析",
    legathonAI: "LEGATHON AI",
    walkingInsight: "步行洞察",

    aiBaseline:
      "Legathon正在学习你的步行模式。完成更多活动以建立个人速度、耐力和稳定性基准。",

    aiImproving:
      "你最近的步行速度与个人基准相比提高了约 {percent}%。",

    aiStable:
      "你最近的步行速度与个人基准相比保持相对稳定。",

    aiSlower:
      "你最近的步行速度比个人基准慢约 {percent}%。",

    aiVeryConsistent:
      "你最近几次步行的速度也非常稳定。",

    aiVariable:
      "最近不同步行活动之间的速度变化更明显。",

    aiEndurance:
      "你最近的步行平均约 {minutes} 分钟，可用于观察耐力趋势。",

    aiStrong:
      "与已经建立的Legathon个人基准相比，你目前整体步行功能表现良好。",

    aiContinue:
      "继续步行以增强你的个人步行功能趋势。",

    disclaimer:
      "步行功能根据你的Legathon步行数据提供健康和活动信息。它不是医疗诊断或临床评估。",

    recentWalks: "最近步行",
    loadingHistory: "正在加载步行记录...",

    noWalkingSessions:
      "还没有步行功能活动。开始第一次步行以建立你的个人基准。",

    walk: "步行",

    historyDetails:
      "{steps} 步 • {miles} 英里",

    perMile: "/ 英里",
  },

  it: {
    back: "Indietro",
    brand: "LEGATHON WALK",
    title: "Funzione di\nCamminata",
    subtitle:
      "Comprendi ritmo, costanza, resistenza e tendenze della camminata nel tempo.",

    stepTracking: "Monitoraggio Passi",
    pedometerUnavailable:
      "I dati del contapassi in tempo reale non sono disponibili su questo dispositivo. I dati storici possono comunque essere visualizzati.",

    functionScore: "PUNTEGGIO FUNZIONE DI CAMMINATA",
    buildingBaseline: "Creazione Riferimento",
    excellent: "Eccellente",
    strong: "Forte",
    steady: "Stabile",
    developing: "In Sviluppo",
    watchTrend: "Controlla la Tendenza",

    scoreDescription:
      "Basato sul tuo ritmo personale, costanza, resistenza e cronologia recente.",

    scoreNeedsData:
      "Completa altre sessioni per stabilire il tuo riferimento personale.",

    liveWalkingPace: "Ritmo di Camminata in Tempo Reale",
    currentSession: "SESSIONE ATTUALE",
    walkingPace: "Ritmo di Camminata",

    walking: "IN CAMMINO",
    paused: "IN PAUSA",
    ready: "PRONTO",

    minMile: "MIN / MIGLIO",

    speed: "VELOCITÀ",
    cadence: "CADENZA",
    steps: "PASSI",
    distance: "DISTANZA",

    mph: "MPH",
    stepsMin: "PASSI / MIN",
    session: "SESSIONE",
    miles: "MIGLIA",

    walkingTime: "Tempo di Camminata",

    startWalk: "INIZIA",
    pause: "PAUSA",
    finish: "TERMINA",
    resume: "RIPRENDI",

    personalPaceTrend: "Tendenza del Ritmo Personale",

    improving: "In Miglioramento",
    slowerBaseline: "Più Lento del Riferimento",
    stable: "Stabile",

    percentChange: "{percent}% di variazione",

    baselineTrendMessage:
      "Continua a camminare. Legathon sta costruendo il tuo riferimento personale.",

    improvingTrendMessage:
      "Il tuo ritmo recente è più veloce del tuo riferimento personale.",

    slowerTrendMessage:
      "Il tuo ritmo recente è più lento del tuo riferimento personale.",

    stableTrendMessage:
      "Il tuo ritmo recente rimane vicino al tuo riferimento personale.",

    sevenDayAverage: "MEDIA 7 GIORNI",
    thirtyDayAverage: "MEDIA 30 GIORNI",

    sessionsLast30:
      "{count} sessioni valide negli ultimi 30 giorni",

    mobilityIndicators: "Indicatori di Mobilità",
    paceConsistency: "COSTANZA DEL RITMO",

    consistencyBuilding: "In Costruzione",
    verySteady: "Molto Stabile",
    variable: "Variabile",

    consistencyDescription:
      "Mostra quanto mantieni costante il ritmo nelle sessioni recenti.",

    walkingEndurance: "RESISTENZA NELLA CAMMINATA",
    averageMinutes: "MINUTI MEDI",
    longestWalk: "CAMMINATA PIÙ LUNGA",

    personalBaseline: "RIFERIMENTO PERSONALE",
    yourWalkingPattern: "Il Tuo Modello di Camminata",
    baselineMinMile: "RIFERIMENTO MIN / MIGLIO",

    baselineDescription:
      "Legathon confronta la tua camminata recente con il tuo schema personale invece di valutare tutti con una velocità universale.",

    aiMobilityInsight: "Analisi Mobilità IA",
    legathonAI: "IA LEGATHON",
    walkingInsight: "Analisi Camminata",

    aiBaseline:
      "Legathon sta imparando il tuo modello di camminata. Completa altre sessioni per stabilire ritmo, resistenza e costanza.",

    aiImproving:
      "Il tuo ritmo recente è migliorato di circa {percent}% rispetto al tuo riferimento personale.",

    aiStable:
      "Il tuo ritmo recente rimane relativamente stabile rispetto al tuo riferimento personale.",

    aiSlower:
      "Il tuo ritmo recente è circa {percent}% più lento del tuo riferimento personale.",

    aiVeryConsistent:
      "Il tuo ritmo è stato anche molto costante nelle camminate recenti.",

    aiVariable:
      "Il tuo ritmo è variato maggiormente tra le sessioni recenti.",

    aiEndurance:
      "Le tue camminate recenti durano in media circa {minutes} minuti, fornendo una tendenza utile sulla resistenza.",

    aiStrong:
      "Il tuo modello complessivo di Funzione di Camminata è attualmente forte rispetto al riferimento Legathon.",

    aiContinue:
      "Continua a camminare per rafforzare la tua tendenza personale.",

    disclaimer:
      "La Funzione di Camminata fornisce informazioni su benessere e attività dai dati Legathon. Non è una diagnosi medica né una valutazione clinica.",

    recentWalks: "Camminate Recenti",
    loadingHistory: "Caricamento cronologia camminate...",

    noWalkingSessions:
      "Non ci sono ancora sessioni di Funzione di Camminata. Inizia la prima camminata per creare il tuo riferimento personale.",

    walk: "Camminata",

    historyDetails:
      "{steps} passi • {miles} mi",

    perMile: "/ miglio",
  },

  ar: {
    back: "رجوع",
    brand: "LEGATHON WALK",
    title: "وظيفة\nالمشي",
    subtitle:
      "تعرّف على وتيرة المشي والثبات والتحمل واتجاهات المشي مع مرور الوقت.",

    stepTracking: "تتبع الخطوات",
    pedometerUnavailable:
      "بيانات عداد الخطوات المباشرة غير متاحة على هذا الجهاز. لا يزال من الممكن عرض بيانات المشي السابقة.",

    functionScore: "درجة وظيفة المشي",
    buildingBaseline: "جارٍ إنشاء خط الأساس",
    excellent: "ممتاز",
    strong: "قوي",
    steady: "مستقر",
    developing: "قيد التطور",
    watchTrend: "راقب الاتجاه",

    scoreDescription:
      "يعتمد على وتيرتك الشخصية والثبات والتحمل وسجل المشي الحديث.",

    scoreNeedsData:
      "أكمل المزيد من جلسات المشي لإنشاء خط الأساس الشخصي.",

    liveWalkingPace: "وتيرة المشي المباشرة",
    currentSession: "الجلسة الحالية",
    walkingPace: "وتيرة المشي",

    walking: "مشي",
    paused: "متوقف مؤقتًا",
    ready: "جاهز",

    minMile: "دقيقة / ميل",

    speed: "السرعة",
    cadence: "معدل الخطوات",
    steps: "الخطوات",
    distance: "المسافة",

    mph: "ميل/ساعة",
    stepsMin: "خطوة / دقيقة",
    session: "الجلسة",
    miles: "أميال",

    walkingTime: "وقت المشي",

    startWalk: "ابدأ المشي",
    pause: "إيقاف مؤقت",
    finish: "إنهاء",
    resume: "استئناف",

    personalPaceTrend: "اتجاه وتيرتك الشخصية",

    improving: "يتحسن",
    slowerBaseline: "أبطأ من خط الأساس",
    stable: "مستقر",

    percentChange: "تغير {percent}%",

    baselineTrendMessage:
      "واصل المشي. يقوم Legathon بإنشاء خط الأساس الشخصي للمشي.",

    improvingTrendMessage:
      "وتيرة المشي الأخيرة أسرع من خط الأساس الشخصي.",

    slowerTrendMessage:
      "وتيرة المشي الأخيرة أبطأ من خط الأساس الشخصي.",

    stableTrendMessage:
      "وتيرة المشي الأخيرة قريبة من خط الأساس الشخصي.",

    sevenDayAverage: "متوسط 7 أيام",
    thirtyDayAverage: "متوسط 30 يومًا",

    sessionsLast30:
      "{count} جلسة مشي مؤهلة خلال آخر 30 يومًا",

    mobilityIndicators: "مؤشرات الحركة",
    paceConsistency: "ثبات الوتيرة",

    consistencyBuilding: "قيد التحليل",
    verySteady: "ثابت جدًا",
    variable: "متغير",

    consistencyDescription:
      "يوضح مدى ثبات وتيرتك خلال جلسات المشي الأخيرة.",

    walkingEndurance: "تحمل المشي",
    averageMinutes: "متوسط الدقائق",
    longestWalk: "أطول مشي",

    personalBaseline: "خط الأساس الشخصي",
    yourWalkingPattern: "نمط المشي الخاص بك",
    baselineMinMile: "خط الأساس دقيقة / ميل",

    baselineDescription:
      "يقارن Legathon المشي الحديث بنمطك الشخصي بدلاً من تقييم الجميع بسرعة مشي واحدة.",

    aiMobilityInsight: "تحليل الحركة بالذكاء الاصطناعي",
    legathonAI: "LEGATHON AI",
    walkingInsight: "رؤية حول المشي",

    aiBaseline:
      "يتعلم Legathon نمط مشيك. أكمل المزيد من الجلسات لإنشاء خط أساس شخصي للوتيرة والتحمل والثبات.",

    aiImproving:
      "تحسنت وتيرة المشي الأخيرة بنحو {percent}% مقارنة بخط الأساس الشخصي.",

    aiStable:
      "وتيرة المشي الأخيرة مستقرة نسبيًا مقارنة بخط الأساس الشخصي.",

    aiSlower:
      "وتيرة المشي الأخيرة أبطأ بنحو {percent}% من خط الأساس الشخصي.",

    aiVeryConsistent:
      "كانت وتيرتك أيضًا ثابتة جدًا خلال جلسات المشي الأخيرة.",

    aiVariable:
      "تباينت وتيرتك أكثر بين جلسات المشي الأخيرة.",

    aiEndurance:
      "متوسط مدة جلسات المشي الأخيرة حوالي {minutes} دقيقة، مما يساعد في تحديد اتجاه التحمل.",

    aiStrong:
      "نمط وظيفة المشي العام قوي حاليًا مقارنة بخط أساس Legathon الشخصي.",

    aiContinue:
      "واصل المشي لتعزيز اتجاه وظيفة المشي الشخصية.",

    disclaimer:
      "توفر وظيفة المشي معلومات عن النشاط والعافية باستخدام بيانات المشي في Legathon. وهي ليست تشخيصًا طبيًا أو تقييمًا سريريًا.",

    recentWalks: "المشي الأخير",
    loadingHistory: "جارٍ تحميل سجل المشي...",

    noWalkingSessions:
      "لا توجد جلسات وظيفة مشي بعد. ابدأ أول جلسة لإنشاء خط الأساس الشخصي.",

    walk: "مشي",

    historyDetails:
      "{steps} خطوة • {miles} ميل",

    perMile: "/ ميل",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function fillTemplate(
  value,
  variables = {}
) {
  return String(
    value
  ).replace(
    /\{(\w+)\}/g,
    (
      match,
      key
    ) =>
      Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[key]
          )
        : match
  );
}

function getWalkingFunctionText(
  language,
  key,
  variables = {}
) {
  const local =
    WALKING_FUNCTION_TEXT?.[
      language
    ]?.[key];

  if (local) {
    return fillTemplate(
      local,
      variables
    );
  }

  const central =
    translate(
      language,
      key
    );

  if (
    central !== key
  ) {
    return fillTemplate(
      central,
      variables
    );
  }

  return fillTemplate(
    WALKING_FUNCTION_TEXT
      .en?.[key] ||
      key,
    variables
  );
}

// ============================================================
// DATE LOCALES
// ============================================================

const LANGUAGE_LOCALES = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  it: "it-IT",
  ar: "ar-SA",
};

// ============================================================
// BASIC HELPERS
// ============================================================

const safeNumber = (
  value
) => {
  const number =
    Number(
      value
    );

  return Number.isFinite(
    number
  )
    ? number
    : 0;
};

const clamp = (
  value,
  min,
  max
) => {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
};

const average = (
  values = []
) => {
  const valid =
    values.filter(
      value =>
        Number.isFinite(
          value
        ) &&
        value > 0
    );

  if (
    !valid.length
  ) {
    return 0;
  }

  return (
    valid.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
    valid.length
  );
};

// ============================================================
// DATE HELPERS
// ============================================================

const normalizeDate = (
  value
) => {
  if (
    !value
  ) {
    return null;
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
};

const startOfDay = (
  date
) => {
  const result =
    new Date(
      date
    );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

const getDateDaysAgo = (
  days
) => {
  const date =
    startOfDay(
      new Date()
    );

  date.setDate(
    date.getDate() -
      days
  );

  return date;
};

const withinLastDays = (
  dateValue,
  days
) => {
  const date =
    normalizeDate(
      dateValue
    );

  if (
    !date
  ) {
    return false;
  }

  return (
    date >=
    getDateDaysAgo(
      days - 1
    )
  );
};

// ============================================================
// PACE HELPERS
// ============================================================

const calculatePace = (
  distanceMiles,
  durationMinutes
) => {
  const miles =
    safeNumber(
      distanceMiles
    );

  const minutes =
    safeNumber(
      durationMinutes
    );

  if (
    miles <= 0 ||
    minutes <= 0
  ) {
    return 0;
  }

  return (
    minutes /
    miles
  );
};

const calculateSpeed = (
  distanceMiles,
  durationMinutes
) => {
  const miles =
    safeNumber(
      distanceMiles
    );

  const minutes =
    safeNumber(
      durationMinutes
    );

  if (
    miles <= 0 ||
    minutes <= 0
  ) {
    return 0;
  }

  return (
    miles /
    (
      minutes /
      60
    )
  );
};

const formatPace = (
  pace
) => {
  if (
    !Number.isFinite(
      pace
    ) ||
    pace <= 0
  ) {
    return "--:--";
  }

  let minutes =
    Math.floor(
      pace
    );

  let seconds =
    Math.round(
      (
        pace -
        minutes
      ) *
        60
    );

  if (
    seconds === 60
  ) {
    minutes += 1;
    seconds = 0;
  }

  return (
    `${minutes}:` +
    `${String(
      seconds
    ).padStart(
      2,
      "0"
    )}`
  );
};

const formatTime = (
  totalSeconds
) => {
  const seconds =
    Math.max(
      0,
      Math.floor(
        safeNumber(
          totalSeconds
        )
      )
    );

  const hours =
    Math.floor(
      seconds /
        3600
    );

  const minutes =
    Math.floor(
      (
        seconds %
        3600
      ) /
        60
    );

  const remainingSeconds =
    seconds %
    60;

  if (
    hours > 0
  ) {
    return (
      `${hours}:` +
      `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:` +
      `${String(
        remainingSeconds
      ).padStart(
        2,
        "0"
      )}`
    );
  }

  return (
    `${minutes}:` +
    `${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`
  );
};

// ============================================================
// HISTORY NORMALIZATION
// ============================================================

const normalizeWalk = (
  walk = {}
) => {
  const steps =
    safeNumber(
      walk.steps
    );

  const distanceMiles =
    safeNumber(
      walk.distanceMiles
    );

  const durationMinutes =
    safeNumber(
      walk.durationMinutes
    );

  const pace =
    safeNumber(
      walk.pace
    ) ||
    calculatePace(
      distanceMiles,
      durationMinutes
    );

  const speedMph =
    safeNumber(
      walk.speedMph
    ) ||
    calculateSpeed(
      distanceMiles,
      durationMinutes
    );

  const cadence =
    safeNumber(
      walk.cadence
    ) ||
    (
      durationMinutes >
      0
        ? steps /
          durationMinutes
        : 0
    );

  return {
    ...walk,

    id:
      walk.id ||
      `walk_${
        walk.date ||
        Date.now()
      }`,

    date:
      walk.date ||
      null,

    steps,

    distanceMiles,

    durationMinutes,

    pace,

    speedMph,

    cadence,
  };
};

// ============================================================
// CONSISTENCY
// ============================================================

const calculateConsistency = (
  paces = []
) => {
  const valid =
    paces.filter(
      pace =>
        Number.isFinite(
          pace
        ) &&
        pace > 0
    );

  if (
    valid.length <
    2
  ) {
    return null;
  }

  const mean =
    average(
      valid
    );

  if (
    !mean
  ) {
    return null;
  }

  const variance =
    valid.reduce(
      (
        total,
        pace
      ) =>
        total +
        Math.pow(
          pace -
            mean,
          2
        ),
      0
    ) /
    valid.length;

  const standardDeviation =
    Math.sqrt(
      variance
    );

  const coefficient =
    standardDeviation /
    mean;

  return clamp(
    Math.round(
      100 -
        coefficient *
          180
    ),
    0,
    100
  );
};

// ============================================================
// ENDURANCE
// ============================================================

const calculateEndurance = (
  walks = []
) => {
  const durations =
    walks
      .map(
        walk =>
          safeNumber(
            walk.durationMinutes
          )
      )
      .filter(
        minutes =>
          minutes >
          0
      );

  if (
    !durations.length
  ) {
    return {
      averageMinutes:
        0,

      longestMinutes:
        0,
    };
  }

  return {
    averageMinutes:
      Math.round(
        average(
          durations
        )
      ),

    longestMinutes:
      Math.round(
        Math.max(
          ...durations
        )
      ),
  };
};

// ============================================================
// FUNCTION SCORE
// ============================================================

const calculateFunctionScore = ({
  recentWalks,
  recentPace,
  baselinePace,
  consistency,
  endurance,
}) => {
  if (
    recentWalks.length <
    MIN_FUNCTION_SESSIONS
  ) {
    return null;
  }

  let score = 50;

  if (
    recentPace >
      0 &&
    baselinePace >
      0
  ) {
    const improvement =
      (
        (
          baselinePace -
          recentPace
        ) /
        baselinePace
      ) *
      100;

    score +=
      clamp(
        improvement *
          1.5,
        -15,
        15
      );
  }

  if (
    consistency !==
    null
  ) {
    score +=
      (
        (
          consistency -
          50
        ) /
        50
      ) *
      15;
  }

  if (
    endurance
      .averageMinutes >=
    45
  ) {
    score += 10;
  } else if (
    endurance
      .averageMinutes >=
    30
  ) {
    score += 7;
  } else if (
    endurance
      .averageMinutes >=
    20
  ) {
    score += 4;
  }

  if (
    recentWalks.length >=
    10
  ) {
    score += 10;
  } else if (
    recentWalks.length >=
    7
  ) {
    score += 8;
  } else if (
    recentWalks.length >=
    5
  ) {
    score += 5;
  } else {
    score += 2;
  }

  return clamp(
    Math.round(
      score
    ),
    0,
    100
  );
};

// ============================================================
// FUNCTION LABEL KEY
// ============================================================

const getFunctionLabelKey = (
  score
) => {
  if (
    score === null
  ) {
    return "buildingBaseline";
  }

  if (
    score >= 85
  ) {
    return "excellent";
  }

  if (
    score >= 70
  ) {
    return "strong";
  }

  if (
    score >= 55
  ) {
    return "steady";
  }

  if (
    score >= 40
  ) {
    return "developing";
  }

  return "watchTrend";
};

// ============================================================
// TREND
// ============================================================

const getPaceTrend = ({
  recentPace,
  baselinePace,
  recentCount,
  baselineCount,
}) => {
  if (
    recentCount <
      2 ||
    baselineCount <
      3 ||
    recentPace <=
      0 ||
    baselinePace <=
      0
  ) {
    return {
      status:
        "building",

      symbol:
        "→",

      percent:
        0,
    };
  }

  const percentChange =
    (
      (
        baselinePace -
        recentPace
      ) /
      baselinePace
    ) *
    100;

  if (
    percentChange >=
    5
  ) {
    return {
      status:
        "improving",

      symbol:
        "↑",

      percent:
        Math.abs(
          percentChange
        ),
    };
  }

  if (
    percentChange <=
    -5
  ) {
    return {
      status:
        "slower",

      symbol:
        "↓",

      percent:
        Math.abs(
          percentChange
        ),
    };
  }

  return {
    status:
      "stable",

    symbol:
      "→",

    percent:
      Math.abs(
        percentChange
      ),
  };
};

// ============================================================
// COMPONENT
// ============================================================

export default function WalkingFunctionScreen({
  language = "en",
  walkHistory = [],
  liveSteps = 0,
  pedometerAvailable = false,
  goBack,
}) {
  function t(
    key,
    variables = {}
  ) {
    return getWalkingFunctionText(
      language,
      key,
      variables
    );
  }

  const {
    sessionStatus,
    sessionSteps,
    sessionSeconds,
    savedWalkHistory,
    historyLoaded,
    sessionNotice,
    startWalkingSession,
    pauseWalkingSession,
    resumeWalkingSession,
    finishWalkingSession,
  } =
    useWalkingSession(
      liveSteps,
      pedometerAvailable
    );

  // ==========================================================
  // LIVE SESSION
  // ==========================================================

  const sessionMiles =
    sessionSteps /
    STEPS_PER_MILE;

  const sessionMinutes =
    sessionSeconds /
    60;

  const livePace =
    calculatePace(
      sessionMiles,
      sessionMinutes
    );

  const liveSpeed =
    calculateSpeed(
      sessionMiles,
      sessionMinutes
    );

  const liveCadence =
    sessionMinutes >
    0
      ? sessionSteps /
        sessionMinutes
      : 0;

  // ==========================================================
  // NORMALIZED HISTORY
  // ==========================================================

  const normalizedHistory =
    useMemo(
      () => {
        const incoming =
          Array.isArray(
            walkHistory
          )
            ? walkHistory
            : [];

        const local =
          Array.isArray(
            savedWalkHistory
          )
            ? savedWalkHistory
            : [];

        const combined = [
          ...incoming,
          ...local,
        ];

        const seen =
          new Set();

        return combined
          .map(
            normalizeWalk
          )
          .filter(
            walk => {
              if (
                walk.steps <=
                  0 &&
                walk
                  .distanceMiles <=
                  0 &&
                walk
                  .durationMinutes <=
                  0
              ) {
                return false;
              }

              const key =
                walk.id ||
                `${walk.date}-${walk.steps}-${walk.durationMinutes}`;

              if (
                seen.has(
                  key
                )
              ) {
                return false;
              }

              seen.add(
                key
              );

              return true;
            }
          )
          .sort(
            (
              a,
              b
            ) => {
              const aTime =
                normalizeDate(
                  a.date
                )
                  ?.getTime() ||
                0;

              const bTime =
                normalizeDate(
                  b.date
                )
                  ?.getTime() ||
                0;

              return (
                bTime -
                aTime
              );
            }
          );
      },

      [
        walkHistory,
        savedWalkHistory,
      ]
    );

  // ==========================================================
  // 7 DAY
  // ==========================================================

  const sevenDayHistory =
    useMemo(
      () =>
        normalizedHistory.filter(
          walk =>
            walk.steps >=
              500 &&
            walk.pace >
              0 &&
            withinLastDays(
              walk.date,
              7
            )
        ),

      [
        normalizedHistory,
      ]
    );

  // ==========================================================
  // 30 DAY
  // ==========================================================

  const thirtyDayHistory =
    useMemo(
      () =>
        normalizedHistory.filter(
          walk =>
            walk.steps >=
              500 &&
            walk.pace >
              0 &&
            withinLastDays(
              walk.date,
              30
            )
        ),

      [
        normalizedHistory,
      ]
    );

  // ==========================================================
  // BASELINE HISTORY — 8 TO 30 DAYS
  // ==========================================================

  const baselineHistory =
    useMemo(
      () => {
        const sevenDaysAgo =
          getDateDaysAgo(
            7
          );

        const thirtyDaysAgo =
          getDateDaysAgo(
            30
          );

        return normalizedHistory.filter(
          walk => {
            const date =
              normalizeDate(
                walk.date
              );

            if (
              !date
            ) {
              return false;
            }

            return (
              date <
                sevenDaysAgo &&
              date >=
                thirtyDaysAgo
            );
          }
        );
      },

      [
        normalizedHistory,
      ]
    );

  // ==========================================================
  // AVERAGES
  // ==========================================================

  const sevenDayPace =
    useMemo(
      () =>
        average(
          sevenDayHistory.map(
            walk =>
              walk.pace
          )
        ),

      [
        sevenDayHistory,
      ]
    );

  const thirtyDayPace =
    useMemo(
      () =>
        average(
          thirtyDayHistory.map(
            walk =>
              walk.pace
          )
        ),

      [
        thirtyDayHistory,
      ]
    );

  const baselinePace =
    useMemo(
      () => {
        const historicalBaseline =
          average(
            baselineHistory.map(
              walk =>
                walk.pace
            )
          );

        if (
          baselineHistory.length >=
            MIN_FUNCTION_SESSIONS &&
          historicalBaseline >
            0
        ) {
          return historicalBaseline;
        }

        return 0;
      },

      [
        baselineHistory,
      ]
    );

  // ==========================================================
  // TREND
  // ==========================================================

  const paceTrend =
    useMemo(
      () =>
        getPaceTrend({
          recentPace:
            sevenDayPace,

          baselinePace,

          recentCount:
            sevenDayHistory.length,

          baselineCount:
            baselineHistory.length ||
            thirtyDayHistory.length,
        }),

      [
        sevenDayPace,
        baselinePace,
        sevenDayHistory,
        baselineHistory,
        thirtyDayHistory,
      ]
    );

  // ==========================================================
  // CONSISTENCY
  // ==========================================================

  const consistency =
    useMemo(
      () =>
        calculateConsistency(
          thirtyDayHistory.map(
            walk =>
              walk.pace
          )
        ),

      [
        thirtyDayHistory,
      ]
    );

  // ==========================================================
  // ENDURANCE
  // ==========================================================

  const endurance =
    useMemo(
      () =>
        calculateEndurance(
          thirtyDayHistory
        ),

      [
        thirtyDayHistory,
      ]
    );

  // ==========================================================
  // FUNCTION SCORE
  // ==========================================================

  const functionScore =
    useMemo(
      () =>
        calculateFunctionScore({
          recentWalks:
            thirtyDayHistory,

          recentPace:
            sevenDayPace ||
            thirtyDayPace,

          baselinePace,

          consistency,

          endurance,
        }),

      [
        thirtyDayHistory,
        sevenDayPace,
        thirtyDayPace,
        baselinePace,
        consistency,
        endurance,
      ]
    );

  const functionLabel =
    t(
      getFunctionLabelKey(
        functionScore
      )
    );

  // ==========================================================
  // TREND TRANSLATION
  // ==========================================================

  const trendTitle =
    paceTrend.status ===
    "improving"
      ? t(
          "improving"
        )
      : paceTrend.status ===
        "slower"
      ? t(
          "slowerBaseline"
        )
      : paceTrend.status ===
        "stable"
      ? t(
          "stable"
        )
      : t(
          "buildingBaseline"
        );

  const trendMessage =
    paceTrend.status ===
    "improving"
      ? t(
          "improvingTrendMessage"
        )
      : paceTrend.status ===
        "slower"
      ? t(
          "slowerTrendMessage"
        )
      : paceTrend.status ===
        "stable"
      ? t(
          "stableTrendMessage"
        )
      : t(
          "baselineTrendMessage"
        );

  // ==========================================================
  // TEXT-ONLY AI INSIGHT
  // ==========================================================

  const aiInsight =
    useMemo(
      () => {
        if (
          thirtyDayHistory.length <
          MIN_FUNCTION_SESSIONS
        ) {
          return t(
            "aiBaseline"
          );
        }

        const messages = [];

        if (
          paceTrend.status ===
          "improving"
        ) {
          messages.push(
            t(
              "aiImproving",
              {
                percent:
                  paceTrend.percent.toFixed(
                    1
                  ),
              }
            )
          );
        }

        if (
          paceTrend.status ===
          "stable"
        ) {
          messages.push(
            t(
              "aiStable"
            )
          );
        }

        if (
          paceTrend.status ===
          "slower"
        ) {
          messages.push(
            t(
              "aiSlower",
              {
                percent:
                  paceTrend.percent.toFixed(
                    1
                  ),
              }
            )
          );
        }

        if (
          consistency !==
            null &&
          consistency >=
            80
        ) {
          messages.push(
            t(
              "aiVeryConsistent"
            )
          );
        } else if (
          consistency !==
            null &&
          consistency <
            55
        ) {
          messages.push(
            t(
              "aiVariable"
            )
          );
        }

        if (
          endurance
            .averageMinutes >=
          30
        ) {
          messages.push(
            t(
              "aiEndurance",
              {
                minutes:
                  endurance.averageMinutes,
              }
            )
          );
        }

        if (
          functionScore !==
            null &&
          functionScore >=
            70
        ) {
          messages.push(
            t(
              "aiStrong"
            )
          );
        }

        return (
          messages.join(
            " "
          ) ||
          t(
            "aiContinue"
          )
        );
      },

      [
        language,
        paceTrend,
        consistency,
        endurance,
        functionScore,
        thirtyDayHistory,
      ]
    );

  // ==========================================================
  // SESSION STATUS
  // ==========================================================

  const sessionLabel =
    sessionStatus ===
    "walking"
      ? t(
          "walking"
        )
      : sessionStatus ===
        "paused"
      ? t(
          "paused"
        )
      : t(
          "ready"
        );

  // ==========================================================
  // CONSISTENCY LABEL
  // ==========================================================

  const consistencyLabel =
    consistency ===
    null
      ? t(
          "consistencyBuilding"
        )
      : consistency >=
        80
      ? t(
          "verySteady"
        )
      : consistency >=
        60
      ? t(
          "steady"
        )
      : t(
          "variable"
        );

  // ==========================================================
  // DATE LOCALE
  // ==========================================================

  const dateLocale =
    LANGUAGE_LOCALES[
      language
    ] ||
    LANGUAGE_LOCALES.en;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >
      <ScrollView
        style={
          styles.container
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* BACK */}

        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={
            goBack
          }
          activeOpacity={
            0.8
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹{" "}
            {t(
              "back"
            )}
          </Text>
        </TouchableOpacity>

        {/* HEADER */}

        <Text
          style={
            styles.eyebrow
          }
        >
          {t(
            "brand"
          )}
        </Text>

        <Text
          style={
            styles.title
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.7
          }
        >
          {t(
            "title"
          )}
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          {t(
            "subtitle"
          )}
        </Text>

        {/* SESSION NOTICE FROM HOOK */}

        {!!sessionNotice && (
          <View
            style={
              styles.noticeCard
            }
          >
            <Text
              style={
                styles.noticeText
              }
            >
              {
                sessionNotice
              }
            </Text>
          </View>
        )}

        {/* DEVICE STATUS */}

        {!pedometerAvailable && (
          <View
            style={
              styles.noticeCard
            }
          >
            <Text
              style={
                styles.noticeTitle
              }
            >
              {t(
                "stepTracking"
              )}
            </Text>

            <Text
              style={
                styles.noticeText
              }
            >
              {t(
                "pedometerUnavailable"
              )}
            </Text>
          </View>
        )}

        {/* FUNCTION SCORE */}

        <View
          style={
            styles.scoreCard
          }
        >
          <View
            style={
              styles.rowBetween
            }
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.cardEyebrow
                }
              >
                {t(
                  "functionScore"
                )}
              </Text>

              <Text
                style={
                  styles.functionLabel
                }
              >
                {
                  functionLabel
                }
              </Text>
            </View>

            <Text
              style={
                styles.scoreNumber
              }
            >
              {functionScore !==
              null
                ? functionScore
                : "--"}
            </Text>
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
                  width:
                    `${functionScore || 0}%`,
                },
              ]}
            />
          </View>

          <Text
            style={
              styles.helperText
            }
          >
            {functionScore !==
            null
              ? t(
                  "scoreDescription"
                )
              : t(
                  "scoreNeedsData"
                )}
          </Text>
        </View>

        {/* LIVE WALK */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {t(
            "liveWalkingPace"
          )}
        </Text>

        <View
          style={
            styles.liveCard
          }
        >
          <View
            style={
              styles.liveHeader
            }
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.cardEyebrow
                }
              >
                {t(
                  "currentSession"
                )}
              </Text>

              <Text
                style={
                  styles.liveTitle
                }
              >
                {t(
                  "walkingPace"
                )}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                sessionStatus ===
                "walking"
                  ? styles.statusWalking
                  : sessionStatus ===
                    "paused"
                  ? styles.statusPaused
                  : styles.statusReady,
              ]}
            >
              <Text
                style={
                  styles.statusText
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
              >
                ●{" "}
                {
                  sessionLabel
                }
              </Text>
            </View>
          </View>

          <View
            style={
              styles.paceCenter
            }
          >
            <Text
              style={
                styles.paceNumber
              }
            >
              {formatPace(
                livePace
              )}
            </Text>

            <Text
              style={
                styles.paceUnit
              }
            >
              {t(
                "minMile"
              )}
            </Text>
          </View>

          <View
            style={
              styles.metricGrid
            }
          >
            <MetricCard
              label={
                t(
                  "speed"
                )
              }
              value={
                liveSpeed >
                0
                  ? liveSpeed.toFixed(
                      1
                    )
                  : "0.0"
              }
              unit={
                t(
                  "mph"
                )
              }
            />

            <MetricCard
              label={
                t(
                  "cadence"
                )
              }
              value={
                liveCadence >
                0
                  ? Math.round(
                      liveCadence
                    )
                  : 0
              }
              unit={
                t(
                  "stepsMin"
                )
              }
            />

            <MetricCard
              label={
                t(
                  "steps"
                )
              }
              value={
                sessionSteps.toLocaleString()
              }
              unit={
                t(
                  "session"
                )
              }
            />

            <MetricCard
              label={
                t(
                  "distance"
                )
              }
              value={
                sessionMiles.toFixed(
                  2
                )
              }
              unit={
                t(
                  "miles"
                )
              }
            />
          </View>

          <View
            style={
              styles.timeRow
            }
          >
            <Text
              style={
                styles.timeLabel
              }
            >
              {t(
                "walkingTime"
              )}
            </Text>

            <Text
              style={
                styles.timeValue
              }
            >
              {formatTime(
                sessionSeconds
              )}
            </Text>
          </View>

          {/* CONTROLS */}

          <View
            style={
              styles.controls
            }
          >
            {sessionStatus ===
              "idle" && (
              <TouchableOpacity
                style={
                  styles.primaryButton
                }
                onPress={
                  startWalkingSession
                }
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  {t(
                    "startWalk"
                  )}
                </Text>
              </TouchableOpacity>
            )}

            {sessionStatus ===
              "walking" && (
              <>
                <TouchableOpacity
                  style={
                    styles.secondaryButton
                  }
                  onPress={
                    pauseWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.secondaryButtonText
                    }
                  >
                    {t(
                      "pause"
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.finishButton
                  }
                  onPress={
                    finishWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.finishButtonText
                    }
                  >
                    {t(
                      "finish"
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {sessionStatus ===
              "paused" && (
              <>
                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={
                    resumeWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    {t(
                      "resume"
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.finishButton
                  }
                  onPress={
                    finishWalkingSession
                  }
                >
                  <Text
                    style={
                      styles.finishButtonText
                    }
                  >
                    {t(
                      "finish"
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* PERSONAL PACE TREND */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {t(
            "personalPaceTrend"
          )}
        </Text>

        <View
          style={
            styles.trendCard
          }
        >
          <View
            style={
              styles.trendTop
            }
          >
            <Text
              style={
                styles.trendSymbol
              }
            >
              {
                paceTrend.symbol
              }
            </Text>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.trendTitle
                }
              >
                {
                  trendTitle
                }
              </Text>

              {paceTrend.percent >
                0 && (
                <Text
                  style={
                    styles.trendPercent
                  }
                >
                  {t(
                    "percentChange",
                    {
                      percent:
                        paceTrend.percent.toFixed(
                          1
                        ),
                    }
                  )}
                </Text>
              )}
            </View>
          </View>

          <Text
            style={
              styles.trendDescription
            }
          >
            {
              trendMessage
            }
          </Text>

          <View
            style={
              styles.averageRow
            }
          >
            <AverageCard
              label={
                t(
                  "sevenDayAverage"
                )
              }
              value={
                formatPace(
                  sevenDayPace
                )
              }
              unit={
                t(
                  "minMile"
                )
              }
            />

            <AverageCard
              label={
                t(
                  "thirtyDayAverage"
                )
              }
              value={
                formatPace(
                  thirtyDayPace
                )
              }
              unit={
                t(
                  "minMile"
                )
              }
            />
          </View>

          <Text
            style={
              styles.sessionCount
            }
          >
            {t(
              "sessionsLast30",
              {
                count:
                  thirtyDayHistory.length,
              }
            )}
          </Text>
        </View>

        {/* MOBILITY INDICATORS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {t(
            "mobilityIndicators"
          )}
        </Text>

        <View
          style={
            styles.indicatorCard
          }
        >
          <Text
            style={
              styles.cardEyebrow
            }
          >
            {t(
              "paceConsistency"
            )}
          </Text>

          <View
            style={
              styles.rowBetween
            }
          >
            <Text
              style={
                styles.indicatorNumber
              }
            >
              {consistency !==
              null
                ? `${consistency}%`
                : "--"}
            </Text>

            <Text
              style={
                styles.indicatorStatus
              }
            >
              {
                consistencyLabel
              }
            </Text>
          </View>

          <Text
            style={
              styles.helperText
            }
          >
            {t(
              "consistencyDescription"
            )}
          </Text>
        </View>

        <View
          style={
            styles.indicatorCard
          }
        >
          <Text
            style={
              styles.cardEyebrow
            }
          >
            {t(
              "walkingEndurance"
            )}
          </Text>

          <View
            style={
              styles.enduranceRow
            }
          >
            <View>
              <Text
                style={
                  styles.indicatorNumber
                }
              >
                {endurance.averageMinutes ||
                  "--"}
              </Text>

              <Text
                style={
                  styles.indicatorUnit
                }
              >
                {t(
                  "averageMinutes"
                )}
              </Text>
            </View>

            <View
              style={
                styles.enduranceRight
              }
            >
              <Text
                style={
                  styles.indicatorNumber
                }
              >
                {endurance.longestMinutes ||
                  "--"}
              </Text>

              <Text
                style={
                  styles.indicatorUnit
                }
              >
                {t(
                  "longestWalk"
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* PERSONAL BASELINE */}

        <View
          style={
            styles.baselineCard
          }
        >
          <Text
            style={
              styles.goldEyebrow
            }
          >
            {t(
              "personalBaseline"
            )}
          </Text>

          <Text
            style={
              styles.baselineTitle
            }
          >
            {t(
              "yourWalkingPattern"
            )}
          </Text>

          <Text
            style={
              styles.baselineNumber
            }
          >
            {formatPace(
              baselinePace
            )}
          </Text>

          <Text
            style={
              styles.baselineUnit
            }
          >
            {t(
              "baselineMinMile"
            )}
          </Text>

          <Text
            style={
              styles.helperText
            }
          >
            {t(
              "baselineDescription"
            )}
          </Text>
        </View>

        {/* AI MOBILITY INSIGHT */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {t(
            "aiMobilityInsight"
          )}
        </Text>

        <View
          style={
            styles.aiCard
          }
        >
          <View
            style={
              styles.aiHeader
            }
          >
            <View
              style={
                styles.aiCircle
              }
            >
              <Text
                style={
                  styles.aiCircleText
                }
              >
                AI
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.aiEyebrow
                }
              >
                {t(
                  "legathonAI"
                )}
              </Text>

              <Text
                style={
                  styles.aiTitle
                }
              >
                {t(
                  "walkingInsight"
                )}
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.aiText
            }
          >
            {
              aiInsight
            }
          </Text>

          <View
            style={
              styles.aiDivider
            }
          />

          <Text
            style={
              styles.disclaimer
            }
          >
            {t(
              "disclaimer"
            )}
          </Text>
        </View>

        {/* RECENT WALKS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          {t(
            "recentWalks"
          )}
        </Text>

        <View
          style={
            styles.historyCard
          }
        >
          {!historyLoaded ? (
            <Text
              style={
                styles.emptyText
              }
            >
              {t(
                "loadingHistory"
              )}
            </Text>
          ) : normalizedHistory.length ===
            0 ? (
            <Text
              style={
                styles.emptyText
              }
            >
              {t(
                "noWalkingSessions"
              )}
            </Text>
          ) : (
            normalizedHistory
              .slice(
                0,
                5
              )
              .map(
                walk => {
                  const date =
                    normalizeDate(
                      walk.date
                    );

                  return (
                    <View
                      key={
                        walk.id
                      }
                      style={
                        styles.historyRow
                      }
                    >
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={
                            styles.historyDate
                          }
                        >
                          {date
                            ? date.toLocaleDateString(
                                dateLocale
                              )
                            : t(
                                "walk"
                              )}
                        </Text>

                        <Text
                          style={
                            styles.historyDetails
                          }
                        >
                          {t(
                            "historyDetails",
                            {
                              steps:
                                Math.round(
                                  walk.steps
                                ).toLocaleString(),

                              miles:
                                walk.distanceMiles.toFixed(
                                  2
                                ),
                            }
                          )}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.historyRight
                        }
                      >
                        <Text
                          style={
                            styles.historyPace
                          }
                        >
                          {formatPace(
                            walk.pace
                          )}
                        </Text>

                        <Text
                          style={
                            styles.historyPaceUnit
                          }
                        >
                          {t(
                            "perMile"
                          )}
                        </Text>
                      </View>
                    </View>
                  );
                }
              )
          )}
        </View>

        <View
          style={
            styles.bottomSpace
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function MetricCard({
  label,
  value,
  unit,
}) {
  return (
    <View
      style={
        styles.metricCard
      }
    >
      <Text
        style={
          styles.metricLabel
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.metricValue
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <Text
        style={
          styles.metricUnit
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {unit}
      </Text>
    </View>
  );
}

function AverageCard({
  label,
  value,
  unit,
}) {
  return (
    <View
      style={
        styles.averageCard
      }
    >
      <Text
        style={
          styles.averageLabel
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.65
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.averageValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.averageUnit
        }
      >
        {unit}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        "#030912",
    },

    container: {
      flex: 1,
      backgroundColor:
        "#030912",
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 115,
    },

    backButton: {
      alignSelf:
        "flex-start",
      borderWidth: 1.5,
      borderColor:
        "#E2B42B",
      borderRadius: 28,
      paddingHorizontal: 22,
      paddingVertical: 11,
      marginBottom: 28,
    },

    backText: {
      color:
        "#E2B42B",
      fontSize: 18,
      fontWeight: "900",
    },

    eyebrow: {
      color:
        "#E2B42B",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 4,
      marginBottom: 8,
    },

    title: {
      color:
        "#FFFFFF",
      fontSize: 50,
      lineHeight: 53,
      fontWeight: "900",
      letterSpacing: -1.5,
    },

    subtitle: {
      color:
        "#AEB9CC",
      fontSize: 17,
      lineHeight: 26,
      fontWeight: "600",
      marginTop: 14,
      marginBottom: 28,
    },

    sectionTitle: {
      color:
        "#FFFFFF",
      fontSize: 29,
      fontWeight: "900",
      marginTop: 8,
      marginBottom: 15,
    },

    cardEyebrow: {
      color:
        "#9CAAC0",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.8,
    },

    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    helperText: {
      color:
        "#A8B5C8",
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600",
      marginTop: 12,
    },

    noticeCard: {
      backgroundColor:
        "#1B1820",
      borderWidth: 1,
      borderColor:
        "#7B6530",
      borderRadius: 18,
      padding: 16,
      marginBottom: 20,
    },

    noticeTitle: {
      color:
        "#E2B42B",
      fontSize: 16,
      fontWeight: "900",
    },

    noticeText: {
      color:
        "#B8C0CE",
      fontSize: 13,
      lineHeight: 20,
      marginTop: 5,
    },

    scoreCard: {
      backgroundColor:
        "#0A1729",
      borderWidth: 1.5,
      borderColor:
        "#29476F",
      borderRadius: 27,
      padding: 22,
      marginBottom: 28,
    },

    functionLabel: {
      color:
        "#FFFFFF",
      fontSize: 25,
      fontWeight: "900",
      marginTop: 6,
    },

    scoreNumber: {
      color:
        "#9FF5CF",
      fontSize: 52,
      fontWeight: "900",
      marginLeft: 10,
    },

    progressTrack: {
      height: 11,
      backgroundColor:
        "#192A43",
      borderRadius: 20,
      overflow: "hidden",
      marginTop: 20,
    },

    progressFill: {
      height: "100%",
      backgroundColor:
        "#E2B42B",
      borderRadius: 20,
    },

    liveCard: {
      backgroundColor:
        "#08172A",
      borderWidth: 1.5,
      borderColor:
        "#E2B42B",
      borderRadius: 28,
      padding: 21,
      marginBottom: 28,
    },

    liveHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
    },

    liveTitle: {
      color:
        "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 4,
    },

    statusBadge: {
      maxWidth: 120,
      borderRadius: 20,
      paddingHorizontal: 11,
      paddingVertical: 8,
      marginLeft: 8,
    },

    statusWalking: {
      backgroundColor:
        "#153C30",
    },

    statusPaused: {
      backgroundColor:
        "#4A3B18",
    },

    statusReady: {
      backgroundColor:
        "#18273D",
    },

    statusText: {
      color:
        "#9FF5CF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.4,
      textAlign: "center",
    },

    paceCenter: {
      alignItems: "center",
      paddingVertical: 28,
    },

    paceNumber: {
      color:
        "#FFFFFF",
      fontSize: 60,
      fontWeight: "900",
      letterSpacing: -2,
    },

    paceUnit: {
      color:
        "#E2B42B",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 1,
    },

    metricGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    metricCard: {
      width: "48%",
      minHeight: 115,
      backgroundColor:
        "#102037",
      borderWidth: 1,
      borderColor:
        "#29476F",
      borderRadius: 19,
      padding: 15,
      marginBottom: 12,
    },

    metricLabel: {
      color:
        "#9DAAC0",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1,
    },

    metricValue: {
      color:
        "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 6,
    },

    metricUnit: {
      color:
        "#E2B42B",
      fontSize: 10,
      fontWeight: "900",
      marginTop: 2,
    },

    timeRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor:
        "#263951",
      paddingTop: 17,
      marginTop: 5,
    },

    timeLabel: {
      flex: 1,
      color:
        "#AAB6C8",
      fontSize: 15,
      fontWeight: "800",
    },

    timeValue: {
      color:
        "#FFFFFF",
      fontSize: 21,
      fontWeight: "900",
    },

    controls: {
      flexDirection: "row",
      gap: 10,
      marginTop: 20,
    },

    primaryButton: {
      flex: 1,
      minHeight: 52,
      backgroundColor:
        "#E2B42B",
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryButtonText: {
      color:
        "#07101F",
      fontSize: 14,
      fontWeight: "900",
      textAlign: "center",
    },

    secondaryButton: {
      flex: 1,
      minHeight: 52,
      backgroundColor:
        "#14243A",
      borderWidth: 1.5,
      borderColor:
        "#E2B42B",
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    secondaryButtonText: {
      color:
        "#E2B42B",
      fontSize: 14,
      fontWeight: "900",
      textAlign: "center",
    },

    finishButton: {
      flex: 1,
      minHeight: 52,
      backgroundColor:
        "#9FF5CF",
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    finishButtonText: {
      color:
        "#061B18",
      fontSize: 14,
      fontWeight: "900",
      textAlign: "center",
    },

    trendCard: {
      backgroundColor:
        "#0A1729",
      borderWidth: 1.5,
      borderColor:
        "#29476F",
      borderRadius: 27,
      padding: 21,
      marginBottom: 28,
    },

    trendTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    trendSymbol: {
      color:
        "#9FF5CF",
      fontSize: 47,
      fontWeight: "900",
      marginRight: 15,
    },

    trendTitle: {
      color:
        "#FFFFFF",
      fontSize: 25,
      fontWeight: "900",
    },

    trendPercent: {
      color:
        "#E2B42B",
      fontSize: 13,
      fontWeight: "900",
      marginTop: 3,
    },

    trendDescription: {
      color:
        "#AAB6C8",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 13,
    },

    averageRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 20,
    },

    averageCard: {
      width: "48%",
      backgroundColor:
        "#102037",
      borderWidth: 1,
      borderColor:
        "#29476F",
      borderRadius: 18,
      padding: 15,
    },

    averageLabel: {
      color:
        "#9DAAC0",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.8,
    },

    averageValue: {
      color:
        "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 7,
    },

    averageUnit: {
      color:
        "#E2B42B",
      fontSize: 9,
      fontWeight: "900",
      marginTop: 2,
    },

    sessionCount: {
      color:
        "#8190A6",
      fontSize: 11,
      lineHeight: 17,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 16,
    },

    indicatorCard: {
      backgroundColor:
        "#0A1729",
      borderWidth: 1.5,
      borderColor:
        "#29476F",
      borderRadius: 25,
      padding: 21,
      marginBottom: 15,
    },

    indicatorNumber: {
      color:
        "#FFFFFF",
      fontSize: 39,
      fontWeight: "900",
      marginTop: 8,
    },

    indicatorStatus: {
      flex: 1,
      color:
        "#9FF5CF",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "right",
      marginLeft: 12,
    },

    enduranceRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-end",
    },

    enduranceRight: {
      alignItems:
        "flex-end",
    },

    indicatorUnit: {
      color:
        "#E2B42B",
      fontSize: 10,
      fontWeight: "900",
    },

    baselineCard: {
      backgroundColor:
        "#16150F",
      borderWidth: 1.5,
      borderColor:
        "#E2B42B",
      borderRadius: 27,
      padding: 22,
      marginTop: 10,
      marginBottom: 28,
    },

    goldEyebrow: {
      color:
        "#E2B42B",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2.5,
    },

    baselineTitle: {
      color:
        "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 6,
    },

    baselineNumber: {
      color:
        "#FFFFFF",
      fontSize: 46,
      fontWeight: "900",
      marginTop: 17,
    },

    baselineUnit: {
      color:
        "#E2B42B",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    aiCard: {
      backgroundColor:
        "#0D2724",
      borderWidth: 1.5,
      borderColor:
        "#9FF5CF",
      borderRadius: 27,
      padding: 21,
      marginBottom: 28,
    },

    aiHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
    },

    aiCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        "#9FF5CF",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 13,
    },

    aiCircleText: {
      color:
        "#061B18",
      fontSize: 14,
      fontWeight: "900",
    },

    aiEyebrow: {
      color:
        "#9FF5CF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2,
    },

    aiTitle: {
      color:
        "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginTop: 2,
    },

    aiText: {
      color:
        "#D1DDD9",
      fontSize: 16,
      lineHeight: 25,
      fontWeight: "600",
    },

    aiDivider: {
      height: 1,
      backgroundColor:
        "#294742",
      marginVertical: 17,
    },

    disclaimer: {
      color:
        "#8FA39E",
      fontSize: 11,
      lineHeight: 18,
      fontWeight: "600",
    },

    historyCard: {
      backgroundColor:
        "#0A1729",
      borderWidth: 1.5,
      borderColor:
        "#29476F",
      borderRadius: 25,
      paddingHorizontal: 19,
      paddingVertical: 5,
    },

    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingVertical: 17,
      borderBottomWidth: 1,
      borderBottomColor:
        "#21334C",
    },

    historyDate: {
      color:
        "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
    },

    historyDetails: {
      color:
        "#93A2B7",
      fontSize: 12,
      fontWeight: "600",
      marginTop: 4,
    },

    historyRight: {
      alignItems:
        "flex-end",
      marginLeft: 10,
    },

    historyPace: {
      color:
        "#9FF5CF",
      fontSize: 20,
      fontWeight: "900",
    },

    historyPaceUnit: {
      color:
        "#E2B42B",
      fontSize: 10,
      fontWeight: "800",
    },

    emptyText: {
      color:
        "#9DAAC0",
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      paddingVertical: 26,
    },

    bottomSpace: {
      height: 25,
    },
  });