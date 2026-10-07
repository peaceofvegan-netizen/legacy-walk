import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  AppState,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import Svg, {
  Circle,
} from "react-native-svg";

import {
  STEP_STATS_KEY,
} from "../utils/stepTrackingEngine";

import useJourneyProgress
  from "../hooks/useJourneyProgress";

import useLegathonPoints
  from "../hooks/useLegathonPoints";

import {
  avatarOptions,
} from "../data/avatarOptions";

import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// ICONS
// ============================================================

const SHOE_ICON =
  require("../assets/apparel/w-shoe.png");

const STOPWATCH_ICON =
  require("../assets/legathon/icons/compass.png");

const HEART_ICON =
  require("../assets/legathon/icons/heart.png");

const PASSPORT_ICON =
  require("../assets/legathon/icons/passporthome.png");

const FLAG_ICON =
  require("../assets/legathon/icons/checkerflag.png");

// ============================================================
// GOALS
// ============================================================

const DAILY_STEP_GOAL = 10000;
const DAILY_MILE_GOAL = 5;
const DAILY_CALORIE_GOAL = 500;
const LIFETIME_GOAL = 3000000;

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEYS = {
  avatarProfile: "avatarProfile",
};

// ============================================================
// DASHBOARD TRANSLATIONS
//
// These work even if a key has not yet been added to
// translation.js.
// ============================================================

const DASHBOARD_FALLBACKS = {
  en: {
    walkingHeader: "Walking",
    dashboardHeader: "Dashboard",
    everyStepBuildsMomentum:
      "Every step builds momentum.",

    viewAvatar: "VIEW AVATAR",

    dashboardQuote:
      "Every step today builds the legacy of tomorrow.",

    keepWalkingLabel:
      "KEEP WALKING",

    liveMovement:
      "LIVE MOVEMENT",

    todayAtAGlance:
      "Today at a glance",

    live: "LIVE",

    todaySteps:
      "TODAY STEPS",

    stepGoal:
      "{count} goal",

    allTimeMovement:
      "All-time movement",

    milesWalked:
      "MILES WALKED",

    mileGoal:
      "{count} mile goal",

    dailyGoal:
      "{count} daily goal",

    legathonPoints:
      "LEGATHON POINTS",

    next:
      "NEXT",

    max:
      "MAX",

    pointsLeft:
      "{count} left",

    legathonProgress:
      "LEGATHON PROGRESS",

    yourJourneyCollection:
      "Your journey collection",

    journeysAtGoal:
      "{completed} of {total} journeys at goal",

    loadingSavedProgress:
      "Loading saved progress…",

    chooseNextAdventure:
      "Choose your next adventure",

    tapReturnRoute:
      "Tap to return to your route",

    globalEvents:
      "GLOBAL EVENTS",

    exploreLegathonMarathons:
      "Explore Legathon Marathons",

    legathonWalker:
      "Legathon Walker",

    rankNewWalker:
      "New Walker",

    rankExplorer:
      "Explorer",

    rankPathfinder:
      "Pathfinder",

    rankTrailblazer:
      "Trailblazer",

    rankAdventurer:
      "Adventurer",

    errorInitializeTracking:
      "Open a journey or marathon to initialize tracking.",

    errorReadTotals:
      "Saved step totals could not be read.",

    errorInvalidTotals:
      "Saved step totals are invalid.",

    errorRefreshSteps:
      "Unable to refresh steps.",

    errorReadSavedSteps:
      "Unable to read saved steps. Your progress has not been changed.",
  },

  // ============================================================
  // SPANISH
  // ============================================================

  es: {
    walkingHeader:
      "Caminata",

    dashboardHeader:
      "Panel",

    everyStepBuildsMomentum:
      "Cada paso genera impulso.",

    viewAvatar:
      "VER AVATAR",

    dashboardQuote:
      "Cada paso de hoy construye el legado de mañana.",

    keepWalkingLabel:
      "SIGUE CAMINANDO",

    liveMovement:
      "MOVIMIENTO EN VIVO",

    todayAtAGlance:
      "Resumen de hoy",

    live:
      "EN VIVO",

    todaySteps:
      "PASOS DE HOY",

    stepGoal:
      "meta: {count}",

    allTimeMovement:
      "Movimiento total",

    milesWalked:
      "MILLAS CAMINADAS",

    mileGoal:
      "meta: {count} millas",

    dailyGoal:
      "meta diaria: {count}",

    legathonPoints:
      "PUNTOS LEGATHON",

    next:
      "SIGUIENTE",

    max:
      "MÁX.",

    pointsLeft:
      "faltan {count}",

    legathonProgress:
      "PROGRESO LEGATHON",

    yourJourneyCollection:
      "Tu colección de viajes",

    journeysAtGoal:
      "{completed} de {total} viajes completados",

    loadingSavedProgress:
      "Cargando progreso guardado…",

    chooseNextAdventure:
      "Elige tu próxima aventura",

    tapReturnRoute:
      "Toca para volver a tu ruta",

    globalEvents:
      "EVENTOS GLOBALES",

    exploreLegathonMarathons:
      "Explorar maratones Legathon",

    legathonWalker:
      "Caminante Legathon",

    rankNewWalker:
      "Nuevo Caminante",

    rankExplorer:
      "Explorador",

    rankPathfinder:
      "Pionero",

    rankTrailblazer:
      "Abrecaminos",

    rankAdventurer:
      "Aventurero",

    errorInitializeTracking:
      "Abre un viaje o maratón para iniciar el seguimiento.",

    errorReadTotals:
      "No se pudieron leer los pasos guardados.",

    errorInvalidTotals:
      "Los pasos guardados no son válidos.",

    errorRefreshSteps:
      "No se pudieron actualizar los pasos.",

    errorReadSavedSteps:
      "No se pudieron leer los pasos guardados. Tu progreso no ha cambiado.",
  },

  // ============================================================
  // FRENCH
  // ============================================================

  fr: {
    walkingHeader:
      "Marche",

    dashboardHeader:
      "Tableau",

    everyStepBuildsMomentum:
      "Chaque pas crée de l'élan.",

    viewAvatar:
      "VOIR L'AVATAR",

    dashboardQuote:
      "Chaque pas d'aujourd'hui construit l'héritage de demain.",

    keepWalkingLabel:
      "CONTINUEZ À MARCHER",

    liveMovement:
      "MOUVEMENT EN DIRECT",

    todayAtAGlance:
      "Aperçu d'aujourd'hui",

    live:
      "EN DIRECT",

    todaySteps:
      "PAS AUJOURD'HUI",

    stepGoal:
      "objectif : {count}",

    allTimeMovement:
      "Mouvement total",

    milesWalked:
      "MILES PARCOURUS",

    mileGoal:
      "objectif : {count} miles",

    dailyGoal:
      "objectif quotidien : {count}",

    legathonPoints:
      "POINTS LEGATHON",

    next:
      "SUIVANT",

    max:
      "MAX",

    pointsLeft:
      "{count} restants",

    legathonProgress:
      "PROGRÈS LEGATHON",

    yourJourneyCollection:
      "Votre collection de voyages",

    journeysAtGoal:
      "{completed} sur {total} voyages terminés",

    loadingSavedProgress:
      "Chargement de la progression…",

    chooseNextAdventure:
      "Choisissez votre prochaine aventure",

    tapReturnRoute:
      "Touchez pour revenir à votre itinéraire",

    globalEvents:
      "ÉVÉNEMENTS MONDIAUX",

    exploreLegathonMarathons:
      "Explorer les marathons Legathon",

    legathonWalker:
      "Marcheur Legathon",

    rankNewWalker:
      "Nouveau Marcheur",

    rankExplorer:
      "Explorateur",

    rankPathfinder:
      "Éclaireur",

    rankTrailblazer:
      "Pionnier",

    rankAdventurer:
      "Aventurier",

    errorInitializeTracking:
      "Ouvrez un voyage ou un marathon pour initialiser le suivi.",

    errorReadTotals:
      "Impossible de lire les pas enregistrés.",

    errorInvalidTotals:
      "Les pas enregistrés sont invalides.",

    errorRefreshSteps:
      "Impossible d'actualiser les pas.",

    errorReadSavedSteps:
      "Impossible de lire les pas enregistrés. Votre progression n'a pas été modifiée.",
  },

  // ============================================================
  // GERMAN
  // ============================================================

  de: {
    walkingHeader:
      "Gehen",

    dashboardHeader:
      "Übersicht",

    everyStepBuildsMomentum:
      "Jeder Schritt bringt dich voran.",

    viewAvatar:
      "AVATAR ANZEIGEN",

    dashboardQuote:
      "Jeder Schritt von heute baut das Vermächtnis von morgen.",

    keepWalkingLabel:
      "WEITERGEHEN",

    liveMovement:
      "LIVE-BEWEGUNG",

    todayAtAGlance:
      "Heute auf einen Blick",

    live:
      "LIVE",

    todaySteps:
      "HEUTIGE SCHRITTE",

    stepGoal:
      "Ziel: {count}",

    allTimeMovement:
      "Gesamtbewegung",

    milesWalked:
      "GEGANGENE MEILEN",

    mileGoal:
      "Ziel: {count} Meilen",

    dailyGoal:
      "Tagesziel: {count}",

    legathonPoints:
      "LEGATHON-PUNKTE",

    next:
      "NÄCHSTE",

    max:
      "MAX",

    pointsLeft:
      "noch {count}",

    legathonProgress:
      "LEGATHON-FORTSCHRITT",

    yourJourneyCollection:
      "Deine Reisesammlung",

    journeysAtGoal:
      "{completed} von {total} Reisen abgeschlossen",

    loadingSavedProgress:
      "Gespeicherten Fortschritt laden…",

    chooseNextAdventure:
      "Wähle dein nächstes Abenteuer",

    tapReturnRoute:
      "Tippe, um zu deiner Route zurückzukehren",

    globalEvents:
      "GLOBALE EVENTS",

    exploreLegathonMarathons:
      "Legathon-Marathons entdecken",

    legathonWalker:
      "Legathon-Walker",

    rankNewWalker:
      "Neuer Walker",

    rankExplorer:
      "Entdecker",

    rankPathfinder:
      "Pfadfinder",

    rankTrailblazer:
      "Wegbereiter",

    rankAdventurer:
      "Abenteurer",

    errorInitializeTracking:
      "Öffne eine Reise oder einen Marathon, um das Tracking zu starten.",

    errorReadTotals:
      "Gespeicherte Schrittwerte konnten nicht gelesen werden.",

    errorInvalidTotals:
      "Gespeicherte Schrittwerte sind ungültig.",

    errorRefreshSteps:
      "Schritte konnten nicht aktualisiert werden.",

    errorReadSavedSteps:
      "Gespeicherte Schritte konnten nicht gelesen werden. Dein Fortschritt wurde nicht verändert.",
  },

  // ============================================================
  // PORTUGUESE
  // ============================================================

  pt: {
    walkingHeader:
      "Caminhada",

    dashboardHeader:
      "Painel",

    everyStepBuildsMomentum:
      "Cada passo cria impulso.",

    viewAvatar:
      "VER AVATAR",

    dashboardQuote:
      "Cada passo de hoje constrói o legado de amanhã.",

    keepWalkingLabel:
      "CONTINUE CAMINHANDO",

    liveMovement:
      "MOVIMENTO AO VIVO",

    todayAtAGlance:
      "Resumo de hoje",

    live:
      "AO VIVO",

    todaySteps:
      "PASSOS DE HOJE",

    stepGoal:
      "meta: {count}",

    allTimeMovement:
      "Movimento total",

    milesWalked:
      "MILHAS CAMINHADAS",

    mileGoal:
      "meta: {count} milhas",

    dailyGoal:
      "meta diária: {count}",

    legathonPoints:
      "PONTOS LEGATHON",

    next:
      "PRÓXIMO",

    max:
      "MÁX.",

    pointsLeft:
      "faltam {count}",

    legathonProgress:
      "PROGRESSO LEGATHON",

    yourJourneyCollection:
      "Sua coleção de jornadas",

    journeysAtGoal:
      "{completed} de {total} jornadas concluídas",

    loadingSavedProgress:
      "Carregando progresso salvo…",

    chooseNextAdventure:
      "Escolha sua próxima aventura",

    tapReturnRoute:
      "Toque para voltar à sua rota",

    globalEvents:
      "EVENTOS GLOBAIS",

    exploreLegathonMarathons:
      "Explorar maratonas Legathon",

    legathonWalker:
      "Caminhante Legathon",

    rankNewWalker:
      "Novo Caminhante",

    rankExplorer:
      "Explorador",

    rankPathfinder:
      "Desbravador",

    rankTrailblazer:
      "Pioneiro",

    rankAdventurer:
      "Aventureiro",

    errorInitializeTracking:
      "Abra uma jornada ou maratona para iniciar o rastreamento.",

    errorReadTotals:
      "Não foi possível ler os passos salvos.",

    errorInvalidTotals:
      "Os passos salvos são inválidos.",

    errorRefreshSteps:
      "Não foi possível atualizar os passos.",

    errorReadSavedSteps:
      "Não foi possível ler os passos salvos. Seu progresso não foi alterado.",
  },

  // ============================================================
  // JAPANESE
  // ============================================================

  ja: {
    walkingHeader:
      "ウォーキング",

    dashboardHeader:
      "ダッシュボード",

    everyStepBuildsMomentum:
      "一歩一歩が前進につながります。",

    viewAvatar:
      "アバターを見る",

    dashboardQuote:
      "今日の一歩一歩が、明日のレガシーを築きます。",

    keepWalkingLabel:
      "歩き続けよう",

    liveMovement:
      "ライブムーブメント",

    todayAtAGlance:
      "今日の概要",

    live:
      "ライブ",

    todaySteps:
      "今日の歩数",

    stepGoal:
      "目標 {count}",

    allTimeMovement:
      "累計ムーブメント",

    milesWalked:
      "歩行マイル",

    mileGoal:
      "目標 {count} マイル",

    dailyGoal:
      "1日の目標 {count}",

    legathonPoints:
      "LEGATHONポイント",

    next:
      "次",

    max:
      "最大",

    pointsLeft:
      "あと {count}",

    legathonProgress:
      "LEGATHON進捗",

    yourJourneyCollection:
      "ジャーニーコレクション",

    journeysAtGoal:
      "{total}件中{completed}件のジャーニーを達成",

    loadingSavedProgress:
      "保存した進捗を読み込み中…",

    chooseNextAdventure:
      "次の冒険を選ぶ",

    tapReturnRoute:
      "タップしてルートに戻る",

    globalEvents:
      "グローバルイベント",

    exploreLegathonMarathons:
      "Legathonマラソンを見る",

    legathonWalker:
      "Legathonウォーカー",

    rankNewWalker:
      "新しいウォーカー",

    rankExplorer:
      "エクスプローラー",

    rankPathfinder:
      "パスファインダー",

    rankTrailblazer:
      "トレイルブレイザー",

    rankAdventurer:
      "アドベンチャラー",

    errorInitializeTracking:
      "ジャーニーまたはマラソンを開いて追跡を開始してください。",

    errorReadTotals:
      "保存された歩数を読み取れませんでした。",

    errorInvalidTotals:
      "保存された歩数が無効です。",

    errorRefreshSteps:
      "歩数を更新できませんでした。",

    errorReadSavedSteps:
      "保存された歩数を読み取れませんでした。進捗は変更されていません。",
  },

  // ============================================================
  // KOREAN
  // ============================================================

  ko: {
    walkingHeader:
      "걷기",

    dashboardHeader:
      "대시보드",

    everyStepBuildsMomentum:
      "한 걸음 한 걸음이 전진을 만듭니다.",

    viewAvatar:
      "아바타 보기",

    dashboardQuote:
      "오늘의 모든 걸음이 내일의 유산을 만듭니다.",

    keepWalkingLabel:
      "계속 걸으세요",

    liveMovement:
      "실시간 움직임",

    todayAtAGlance:
      "오늘 한눈에 보기",

    live:
      "실시간",

    todaySteps:
      "오늘 걸음 수",

    stepGoal:
      "목표 {count}",

    allTimeMovement:
      "누적 움직임",

    milesWalked:
      "걸은 마일",

    mileGoal:
      "목표 {count}마일",

    dailyGoal:
      "일일 목표 {count}",

    legathonPoints:
      "LEGATHON 포인트",

    next:
      "다음",

    max:
      "최대",

    pointsLeft:
      "{count} 남음",

    legathonProgress:
      "LEGATHON 진행",

    yourJourneyCollection:
      "여정 컬렉션",

    journeysAtGoal:
      "총 {total}개 중 {completed}개 여정 완료",

    loadingSavedProgress:
      "저장된 진행 상황 불러오는 중…",

    chooseNextAdventure:
      "다음 모험을 선택하세요",

    tapReturnRoute:
      "탭하여 경로로 돌아가기",

    globalEvents:
      "글로벌 이벤트",

    exploreLegathonMarathons:
      "Legathon 마라톤 둘러보기",

    legathonWalker:
      "Legathon 워커",

    rankNewWalker:
      "새로운 워커",

    rankExplorer:
      "탐험가",

    rankPathfinder:
      "개척자",

    rankTrailblazer:
      "선구자",

    rankAdventurer:
      "모험가",

    errorInitializeTracking:
      "여정 또는 마라톤을 열어 추적을 시작하세요.",

    errorReadTotals:
      "저장된 걸음 수를 읽을 수 없습니다.",

    errorInvalidTotals:
      "저장된 걸음 수가 올바르지 않습니다.",

    errorRefreshSteps:
      "걸음 수를 새로고침할 수 없습니다.",

    errorReadSavedSteps:
      "저장된 걸음 수를 읽을 수 없습니다. 진행 상황은 변경되지 않았습니다.",
  },

  // ============================================================
  // CHINESE
  // ============================================================

  zh: {
    walkingHeader:
      "步行",

    dashboardHeader:
      "仪表盘",

    everyStepBuildsMomentum:
      "每一步都在积累动力。",

    viewAvatar:
      "查看虚拟形象",

    dashboardQuote:
      "今天的每一步，都在创造明天的传承。",

    keepWalkingLabel:
      "继续步行",

    liveMovement:
      "实时活动",

    todayAtAGlance:
      "今日概览",

    live:
      "实时",

    todaySteps:
      "今日步数",

    stepGoal:
      "目标 {count}",

    allTimeMovement:
      "累计活动",

    milesWalked:
      "已步行英里",

    mileGoal:
      "目标 {count} 英里",

    dailyGoal:
      "每日目标 {count}",

    legathonPoints:
      "LEGATHON积分",

    next:
      "下一级",

    max:
      "最高",

    pointsLeft:
      "还差 {count}",

    legathonProgress:
      "LEGATHON进度",

    yourJourneyCollection:
      "你的旅程收藏",

    journeysAtGoal:
      "已完成 {completed}/{total} 个旅程",

    loadingSavedProgress:
      "正在加载已保存的进度…",

    chooseNextAdventure:
      "选择你的下一段冒险",

    tapReturnRoute:
      "点击返回你的路线",

    globalEvents:
      "全球活动",

    exploreLegathonMarathons:
      "探索 Legathon 马拉松",

    legathonWalker:
      "Legathon 步行者",

    rankNewWalker:
      "新步行者",

    rankExplorer:
      "探索者",

    rankPathfinder:
      "开拓者",

    rankTrailblazer:
      "先锋",

    rankAdventurer:
      "冒险家",

    errorInitializeTracking:
      "打开一个旅程或马拉松以开始步数追踪。",

    errorReadTotals:
      "无法读取已保存的步数。",

    errorInvalidTotals:
      "已保存的步数无效。",

    errorRefreshSteps:
      "无法刷新步数。",

    errorReadSavedSteps:
      "无法读取已保存的步数。你的进度没有改变。",
  },

  // ============================================================
  // ITALIAN
  // ============================================================

  it: {
    walkingHeader:
      "Camminata",

    dashboardHeader:
      "Dashboard",

    everyStepBuildsMomentum:
      "Ogni passo crea slancio.",

    viewAvatar:
      "VEDI AVATAR",

    dashboardQuote:
      "Ogni passo di oggi costruisce l'eredità di domani.",

    keepWalkingLabel:
      "CONTINUA A CAMMINARE",

    liveMovement:
      "MOVIMENTO LIVE",

    todayAtAGlance:
      "Oggi a colpo d'occhio",

    live:
      "LIVE",

    todaySteps:
      "PASSI DI OGGI",

    stepGoal:
      "obiettivo: {count}",

    allTimeMovement:
      "Movimento totale",

    milesWalked:
      "MIGLIA PERCORSE",

    mileGoal:
      "obiettivo: {count} miglia",

    dailyGoal:
      "obiettivo giornaliero: {count}",

    legathonPoints:
      "PUNTI LEGATHON",

    next:
      "PROSSIMO",

    max:
      "MAX",

    pointsLeft:
      "{count} mancanti",

    legathonProgress:
      "PROGRESSO LEGATHON",

    yourJourneyCollection:
      "La tua raccolta di percorsi",

    journeysAtGoal:
      "{completed} di {total} percorsi completati",

    loadingSavedProgress:
      "Caricamento dei progressi salvati…",

    chooseNextAdventure:
      "Scegli la tua prossima avventura",

    tapReturnRoute:
      "Tocca per tornare al percorso",

    globalEvents:
      "EVENTI GLOBALI",

    exploreLegathonMarathons:
      "Esplora le maratone Legathon",

    legathonWalker:
      "Camminatore Legathon",

    rankNewWalker:
      "Nuovo Camminatore",

    rankExplorer:
      "Esploratore",

    rankPathfinder:
      "Apripista",

    rankTrailblazer:
      "Pioniere",

    rankAdventurer:
      "Avventuriero",

    errorInitializeTracking:
      "Apri un percorso o una maratona per iniziare il monitoraggio.",

    errorReadTotals:
      "Impossibile leggere i passi salvati.",

    errorInvalidTotals:
      "I passi salvati non sono validi.",

    errorRefreshSteps:
      "Impossibile aggiornare i passi.",

    errorReadSavedSteps:
      "Impossibile leggere i passi salvati. I tuoi progressi non sono stati modificati.",
  },

  // ============================================================
  // ARABIC
  // ============================================================

  ar: {
    walkingHeader:
      "المشي",

    dashboardHeader:
      "لوحة المتابعة",

    everyStepBuildsMomentum:
      "كل خطوة تصنع تقدماً.",

    viewAvatar:
      "عرض الصورة الرمزية",

    dashboardQuote:
      "كل خطوة اليوم تبني إرث الغد.",

    keepWalkingLabel:
      "استمر في المشي",

    liveMovement:
      "الحركة المباشرة",

    todayAtAGlance:
      "نظرة على اليوم",

    live:
      "مباشر",

    todaySteps:
      "خطوات اليوم",

    stepGoal:
      "الهدف {count}",

    allTimeMovement:
      "إجمالي الحركة",

    milesWalked:
      "الأميال المقطوعة",

    mileGoal:
      "الهدف {count} أميال",

    dailyGoal:
      "الهدف اليومي {count}",

    legathonPoints:
      "نقاط LEGATHON",

    next:
      "التالي",

    max:
      "الأعلى",

    pointsLeft:
      "متبقي {count}",

    legathonProgress:
      "تقدم LEGATHON",

    yourJourneyCollection:
      "مجموعة رحلاتك",

    journeysAtGoal:
      "تم إكمال {completed} من {total} رحلة",

    loadingSavedProgress:
      "جارٍ تحميل التقدم المحفوظ…",

    chooseNextAdventure:
      "اختر مغامرتك التالية",

    tapReturnRoute:
      "اضغط للعودة إلى مسارك",

    globalEvents:
      "فعاليات عالمية",

    exploreLegathonMarathons:
      "استكشف ماراثونات Legathon",

    legathonWalker:
      "مشارك Legathon",

    rankNewWalker:
      "مشارك جديد",

    rankExplorer:
      "مستكشف",

    rankPathfinder:
      "مكتشف المسار",

    rankTrailblazer:
      "رائد",

    rankAdventurer:
      "مغامر",

    errorInitializeTracking:
      "افتح رحلة أو ماراثون لبدء التتبع.",

    errorReadTotals:
      "تعذر قراءة الخطوات المحفوظة.",

    errorInvalidTotals:
      "الخطوات المحفوظة غير صالحة.",

    errorRefreshSteps:
      "تعذر تحديث الخطوات.",

    errorReadSavedSteps:
      "تعذر قراءة الخطوات المحفوظة. لم يتم تغيير تقدمك.",
  },
};

// ============================================================
// HELPERS
// ============================================================

function formatNumber(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "0";
  }

  return Math.max(
    0,
    Math.floor(number)
  ).toLocaleString();
}

function stepsToMiles(steps) {
  return (
    Math.max(
      Number(steps || 0),
      0
    ) / 2000
  );
}

function caloriesFromSteps(
  steps
) {
  return Math.round(
    Math.max(
      Number(steps || 0),
      0
    ) * 0.04
  );
}

function clampProgress(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return Math.min(
    Math.max(number, 0),
    1
  );
}

function fillTemplate(
  value,
  variables = {}
) {
  return String(value).replace(
    /\{(\w+)\}/g,
    (match, key) => {
      return Object.prototype.hasOwnProperty.call(
        variables,
        key
      )
        ? String(
            variables[key]
          )
        : match;
    }
  );
}

// ============================================================
// PROGRESS RING
// ============================================================

function ProgressRing({
  progress = 0,
  size = 48,
  strokeWidth = 4,
  color = "#4FFFD2",
  backgroundColor =
    "rgba(255,255,255,0.12)",
  children,
}) {
  const radius =
    (size - strokeWidth) /
    2;

  const circumference =
    2 *
    Math.PI *
    radius;

  const safeProgress =
    clampProgress(progress);

  const dashOffset =
    circumference *
    (1 - safeProgress);

  return (
    <View
      style={{
        width: size,
        height: size,

        alignItems:
          "center",

        justifyContent:
          "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={
          StyleSheet.absoluteFill
        }
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            backgroundColor
          }
          strokeWidth={
            strokeWidth
          }
          fill="transparent"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={
            strokeWidth
          }
          fill="transparent"
          strokeDasharray={
            `${circumference} ${circumference}`
          }
          strokeDashoffset={
            dashOffset
          }
          strokeLinecap="round"
          rotation="-90"
          origin={
            `${size / 2}, ${size / 2}`
          }
        />
      </Svg>

      {children}
    </View>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

export default function WalkingDashboardScreen({
  language = "en",

  goToJourneys,

  goToGPSJourneyMap,

  goToAvatarCenter,

  goToAvatarProfile,

  goToLegathons,
}) {
  const [
    todaySteps,
    setTodaySteps,
  ] =
    useState(0);

  const [
    stepError,
    setStepError,
  ] =
    useState("");

  const [
    stepsLoaded,
    setStepsLoaded,
  ] =
    useState(false);

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(0);

  const [
    userAvatar,
    setUserAvatar,
  ] =
    useState(
      avatarOptions[0]
        ?.image ||
        null
    );

  const [
    avatarName,
    setAvatarName,
  ] =
    useState(
      "Legathon Walker"
    );

  const journeyDisplay =
    useJourneyProgress();

  const activeJourney =
    journeyDisplay
      .activeJourney;

  const collectionPercent =
    journeyDisplay
      .collectionPercent;

  const {
    points:
      legathonPoints,

    rank:
      legathonRank,
  } =
    useLegathonPoints();

  // ==========================================================
  // TRANSLATE HELPER
  // ==========================================================

  function t(
    key,
    variables = {}
  ) {
    const central =
      translate(
        language,
        key
      );

    const value =
      central !== key
        ? central
        : DASHBOARD_FALLBACKS?.[
            language
          ]?.[key] ??
          DASHBOARD_FALLBACKS
            .en?.[key] ??
          key;

    return fillTemplate(
      value,
      variables
    );
  }

  // ==========================================================
  // AVATAR NAVIGATION
  // ==========================================================

  const openAvatar =
    typeof goToAvatarCenter ===
    "function"
      ? goToAvatarCenter
      : goToAvatarProfile;

  // ==========================================================
  // STEP + AVATAR REFRESH
  // ==========================================================

  useEffect(() => {
    let mounted =
      true;

    let loading =
      false;

    let foreground =
      AppState.currentState !==
        "background" &&
      AppState.currentState !==
        "inactive";

    async function refresh() {
      if (
        !mounted ||
        !foreground ||
        loading
      ) {
        return;
      }

      loading =
        true;

      try {
        const values =
          Object.fromEntries(
            await AsyncStorage
              .multiGet([
                STEP_STATS_KEY,

                STORAGE_KEYS
                  .avatarProfile,
              ])
          );

        if (
          !mounted
        ) {
          return;
        }

        // ======================================================
        // STEP TOTALS
        // ======================================================

        try {
          const raw =
            values[
              STEP_STATS_KEY
            ];

          if (!raw) {
            throw new Error(
              DASHBOARD_FALLBACKS?.[
                language
              ]
                ?.errorInitializeTracking ??
                DASHBOARD_FALLBACKS
                  .en
                  .errorInitializeTracking
            );
          }

          const stats =
            JSON.parse(
              raw
            );

          if (
            !stats ||
            typeof stats !==
              "object" ||
            Array.isArray(
              stats
            )
          ) {
            throw new Error(
              DASHBOARD_FALLBACKS?.[
                language
              ]
                ?.errorReadTotals ??
                DASHBOARD_FALLBACKS
                  .en
                  .errorReadTotals
            );
          }

          const readCount =
            value => {
              const number =
                Number(
                  value ??
                    0
                );

              if (
                !Number.isFinite(
                  number
                ) ||
                number <
                  0
              ) {
                throw new Error(
                  DASHBOARD_FALLBACKS?.[
                    language
                  ]
                    ?.errorInvalidTotals ??
                    DASHBOARD_FALLBACKS
                      .en
                      .errorInvalidTotals
                );
              }

              return Math.floor(
                number
              );
            };

          const now =
            new Date();

          const day =
            `${now.getFullYear()}-` +
            `${String(
              now.getMonth() +
                1
            ).padStart(
              2,
              "0"
            )}-` +
            `${String(
              now.getDate()
            ).padStart(
              2,
              "0"
            )}`;

          const today =
            stats.dateKey ===
            day
              ? readCount(
                  stats
                    .todaySteps
                )
              : 0;

          const journeyLifetime =
            readCount(
              stats
                .journeyLifetimeSteps ??
                stats
                  .lifetimeSteps ??
                stats
                  .totalSteps
            );

          const marathonLifetime =
            readCount(
              stats
                .marathonLifetimeSteps
            );

          setTodaySteps(
            today
          );

          setLifetimeSteps(
            journeyLifetime +
              marathonLifetime
          );

          setStepsLoaded(
            true
          );

          setStepError(
            ""
          );
        } catch (
          error
        ) {
          setStepError(
            error.message ||
              (
                DASHBOARD_FALLBACKS?.[
                  language
                ]
                  ?.errorRefreshSteps ??
                  DASHBOARD_FALLBACKS
                    .en
                    .errorRefreshSteps
              )
          );
        }

        // ======================================================
        // AVATAR
        // ======================================================

        try {
          const savedProfile =
            values[
              STORAGE_KEYS
                .avatarProfile
            ];

          if (
            savedProfile
          ) {
            const profile =
              JSON.parse(
                savedProfile
              );

            setAvatarName(
              profile?.name ||
                "Legathon Walker"
            );

            const avatar =
              avatarOptions.find(
                item =>
                  item.id ===
                  profile
                    ?.avatarId
              );

            if (
              avatar
            ) {
              const visual =
                await getCurrentAvatarVisual(
                  avatar.id
                );

              if (
                mounted
              ) {
                setUserAvatar(
                  visual?.image ||
                    avatar.image ||
                    null
                );
              }
            }
          }
        } catch (
          error
        ) {
          console.log(
            "Dashboard profile refresh error:",
            error
          );
        }
      } catch (
        error
      ) {
        if (
          mounted
        ) {
          setStepError(
            DASHBOARD_FALLBACKS?.[
              language
            ]
              ?.errorReadSavedSteps ??
              DASHBOARD_FALLBACKS
                .en
                .errorReadSavedSteps
          );
        }
      } finally {
        loading =
          false;
      }
    }

    void refresh();

    const timer =
      setInterval(
        () => {
          void refresh();
        },
        1500
      );

    const listener =
      AppState
        .addEventListener(
          "change",

          state => {
            foreground =
              state ===
              "active";

            if (
              foreground
            ) {
              void refresh();
            }
          }
        );

    return () => {
      mounted =
        false;

      clearInterval(
        timer
      );

      listener
        .remove();
    };
  }, [
    language,
  ]);

  // ==========================================================
  // OPEN JOURNEY
  // ==========================================================

  function openCurrentJourney() {
    if (
      activeJourney &&
      typeof goToGPSJourneyMap ===
        "function"
    ) {
      goToGPSJourneyMap(
        activeJourney
      );

      return;
    }

    if (
      typeof goToJourneys ===
      "function"
    ) {
      goToJourneys();
    }
  }

  // ==========================================================
  // VALUES
  // ==========================================================

  const miles =
    stepsToMiles(
      todaySteps
    );

  const calories =
    caloriesFromSteps(
      todaySteps
    );

  const journeyProgress =
    activeJourney
      ?.progress ||
    0;

  const displayAvatarName =
    avatarName ===
    "Legathon Walker"
      ? t(
          "legathonWalker"
        )
      : avatarName;

  // ==========================================================
  // TRANSLATE RANK
  // ==========================================================

  function displayRank(
    rankName
  ) {
    const rankKeyMap = {
      "New Walker":
        "rankNewWalker",

      Explorer:
        "rankExplorer",

      Pathfinder:
        "rankPathfinder",

      Trailblazer:
        "rankTrailblazer",

      Adventurer:
        "rankAdventurer",
    };

    const key =
      rankKeyMap[
        rankName
      ];

    return key
      ? t(key)
      : rankName;
  }

  // ==========================================================
  // METRICS
  // ==========================================================

  const metrics = [
    {
      key:
        "today",

      label:
        t(
          "todaySteps"
        ),

      value:
        formatNumber(
          todaySteps
        ),

      goal:
        t(
          "stepGoal",
          {
            count:
              formatNumber(
                DAILY_STEP_GOAL
              ),
          }
        ),

      progress:
        todaySteps /
        DAILY_STEP_GOAL,

      color:
        "#4FFFD2",

      icon:
        SHOE_ICON,
    },

    {
      key:
        "lifetime",

      label:
        translate(
          language,
          "lifetimeSteps"
        ),

      value:
        formatNumber(
          lifetimeSteps
        ),

      goal:
        t(
          "allTimeMovement"
        ),

      progress:
        lifetimeSteps /
        LIFETIME_GOAL,

      color:
        "#FF4F7B",

      icon:
        STOPWATCH_ICON,
    },

    {
      key:
        "miles",

      label:
        t(
          "milesWalked"
        ),

      value:
        miles.toFixed(
          2
        ),

      goal:
        t(
          "mileGoal",
          {
            count:
              DAILY_MILE_GOAL,
          }
        ),

      progress:
        miles /
        DAILY_MILE_GOAL,

      color:
        "#8DFF64",

      icon:
        FLAG_ICON,
    },

    {
      key:
        "calories",

      label:
        translate(
          language,
          "calories"
        ),

      value:
        formatNumber(
          calories
        ),

      goal:
        t(
          "dailyGoal",
          {
            count:
              formatNumber(
                DAILY_CALORIE_GOAL
              ),
          }
        ),

      progress:
        calories /
        DAILY_CALORIE_GOAL,

      color:
        "#FF9E45",

      icon:
        HEART_ICON,
    },
  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.screen
      }
    >
      <View
        style={
          styles.goldGlow
        }
      />

      <View
        style={
          styles.aquaGlow
        }
      />

      <ScrollView
        style={
          styles.scrollView
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        bounces
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.headerCopy
            }
          >
            <Text
              style={
                styles.headerEyebrow
              }
            >
              LEGATHON WALK
            </Text>

            <Text
              style={
                styles.headerTitle
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.7
              }
            >
              {t(
                "walkingHeader"
              )}

              {"\n"}

              <Text
                style={
                  styles.headerTitleGold
                }
              >
                {t(
                  "dashboardHeader"
                )}
              </Text>
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {t(
                "everyStepBuildsMomentum"
              )}
            </Text>
          </View>

          {/* AVATAR */}

          <TouchableOpacity
            style={
              styles.profileCard
            }
            onPress={
              openAvatar
            }
            activeOpacity={
              0.85
            }
          >
            <View
              style={
                styles.avatarHalo
              }
            >
              {userAvatar ? (
                <Image
                  source={
                    userAvatar
                      .image
                      ? userAvatar
                          .image
                      : userAvatar
                  }
                  style={
                    styles.avatar
                  }
                  resizeMode="contain"
                />
              ) : (
                <Text
                  style={
                    styles.avatarFallback
                  }
                >
                  👟
                </Text>
              )}
            </View>

            <Text
              style={
                styles.profileName
              }
              numberOfLines={
                1
              }
            >
              {
                displayAvatarName
              }
            </Text>

            <Text
              style={
                styles.profileAction
              }
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.65
              }
            >
              {t(
                "viewAvatar"
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ====================================================
            QUOTE
        ==================================================== */}

        <View
          style={
            styles.quoteCard
          }
        >
          <Text
            style={
              styles.quoteMark
            }
          >
            “
          </Text>

          <View
            style={
              styles.quoteCopy
            }
          >
            <Text
              style={
                styles.quoteText
              }
            >
              {t(
                "dashboardQuote"
              )}
            </Text>

            <Text
              style={
                styles.quoteSignature
              }
            >
              {t(
                "keepWalkingLabel"
              )}
            </Text>
          </View>

          <View
            style={
              styles.crownBadge
            }
          >
            <Text
              style={
                styles.crown
              }
            >
              ♛
            </Text>
          </View>
        </View>

        {/* ====================================================
            LIVE MOVEMENT
        ==================================================== */}

        <View
          style={
            styles.sectionHeading
          }
        >
          <View>
            <Text
              style={
                styles.sectionEyebrow
              }
            >
              {t(
                "liveMovement"
              )}
            </Text>

            <Text
              style={
                styles.sectionTitle
              }
            >
              {t(
                "todayAtAGlance"
              )}
            </Text>
          </View>

          <View
            style={
              styles.livePill
            }
          >
            <View
              style={
                styles.liveDot
              }
            />

            <Text
              style={
                styles.liveText
              }
            >
              {t(
                "live"
              )}
            </Text>
          </View>
        </View>

        {/* ====================================================
            STEP ERROR
        ==================================================== */}

        {!!stepError && (
          <Text
            accessibilityRole="alert"
            style={{
              color:
                "#FFC747",

              marginBottom:
                12,
            }}
          >
            {
              stepError
            }
          </Text>
        )}

        {/* ====================================================
            METRICS
        ==================================================== */}

        <View
          style={
            styles.metricsGrid
          }
        >
          {metrics.map(
            metric => (
              <View
                key={
                  metric.key
                }
                style={
                  styles.metricCard
                }
              >
                <View
                  style={
                    styles.metricTop
                  }
                >
                  <ProgressRing
                    progress={
                      metric.progress
                    }
                    size={
                      54
                    }
                    strokeWidth={
                      4
                    }
                    color={
                      metric.color
                    }
                    backgroundColor=
                      "rgba(255,255,255,0.08)"
                  >
                    <Image
                      source={
                        metric.icon
                      }
                      style={
                        styles.metricIcon
                      }
                      resizeMode="contain"
                    />
                  </ProgressRing>

                  <View
                    style={[
                      styles.metricAccent,

                      {
                        backgroundColor:
                          metric.color,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={
                    styles.metricLabel
                  }
                  numberOfLines={
                    2
                  }
                  adjustsFontSizeToFit
                  minimumFontScale={
                    0.72
                  }
                >
                  {
                    metric.label
                  }
                </Text>

                <Text
                  style={
                    styles.metricValue
                  }
                  numberOfLines={
                    1
                  }
                  adjustsFontSizeToFit
                  minimumFontScale={
                    0.65
                  }
                >
                  {stepsLoaded
                    ? metric.value
                    : "—"}
                </Text>

                <Text
                  style={
                    styles.metricGoal
                  }
                  numberOfLines={
                    2
                  }
                >
                  {
                    metric.goal
                  }
                </Text>
              </View>
            )
          )}
        </View>

        {/* ====================================================
            LEGATHON POINTS
        ==================================================== */}

        <View
          style={
            styles.pointsCard
          }
        >
          <View
            style={
              styles.pointsBadge
            }
          >
            <Text
              style={
                styles.pointsStar
              }
            >
              ★
            </Text>
          </View>

          <View
            style={
              styles.pointsMain
            }
          >
            <Text
              style={
                styles.pointsLabel
              }
            >
              {t(
                "legathonPoints"
              )}
            </Text>

            <Text
              style={
                styles.pointsValue
              }
            >
              {formatNumber(
                legathonPoints
              )}
            </Text>

            <Text
              style={
                styles.pointsRank
              }
            >
              {displayRank(
                legathonRank
                  ?.currentRank ||
                  "New Walker"
              )}
            </Text>
          </View>

          <View
            style={
              styles.pointsNext
            }
          >
            <Text
              style={
                styles.nextLabel
              }
            >
              {t(
                "next"
              )}
            </Text>

            <Text
              style={
                styles.nextRank
              }
              numberOfLines={
                1
              }
            >
              {legathonRank
                ?.nextRank
                ? displayRank(
                    legathonRank
                      .nextRank
                  )
                : t(
                    "max"
                  )}
            </Text>

            <Text
              style={
                styles.pointsRemaining
              }
            >
              {t(
                "pointsLeft",
                {
                  count:
                    formatNumber(
                      legathonRank
                        ?.pointsRemaining
                    ),
                }
              )}
            </Text>
          </View>
        </View>

        {/* ====================================================
            JOURNEY ERROR
        ==================================================== */}

        {journeyDisplay
          .error ? (
          <Text
            style={
              styles.metricGoal
            }
          >
            {
              journeyDisplay
                .error
            }
          </Text>
        ) : null}

        {/* ====================================================
            LEGATHON PROGRESS
        ==================================================== */}

        <TouchableOpacity
          style={
            styles.progressCard
          }
          onPress={
            goToJourneys
          }
          activeOpacity={
            0.85
          }
        >
          <ProgressRing
            progress={
              collectionPercent /
              100
            }
            size={
              64
            }
            strokeWidth={
              5
            }
            color=
              "#4FFFD2"
            backgroundColor=
              "rgba(79,255,210,0.12)"
          >
            <Image
              source={
                PASSPORT_ICON
              }
              style={
                styles.progressIcon
              }
              resizeMode="contain"
            />
          </ProgressRing>

          <View
            style={
              styles.progressCopy
            }
          >
            <Text
              style={
                styles.progressAqua
              }
            >
              {t(
                "legathonProgress"
              )}
            </Text>

            <Text
              style={
                styles.progressTitle
              }
              numberOfLines={
                2
              }
            >
              {t(
                "yourJourneyCollection"
              )}
            </Text>

            <Text
              style={
                styles.metricGoal
              }
            >
              {journeyDisplay
                .ready
                ? t(
                    "journeysAtGoal",
                    {
                      completed:
                        journeyDisplay
                          .completedCount,

                      total:
                        journeyDisplay
                          .totalCount,
                    }
                  )
                : t(
                    "loadingSavedProgress"
                  )}
            </Text>

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
                      `${collectionPercent}%`,
                  },
                ]}
              />
            </View>
          </View>

          <Text
            style={
              styles.progressPercent
            }
          >
            {journeyDisplay
              .ready
              ? `${collectionPercent.toFixed(
                  1
                )}%`
              : "—"}
          </Text>
        </TouchableOpacity>

        {/* ====================================================
            CONTINUE JOURNEY
        ==================================================== */}

        <TouchableOpacity
          style={[
            styles.progressCard,
            styles.continueCard,
          ]}
          onPress={
            openCurrentJourney
          }
          activeOpacity={
            0.85
          }
        >
          <ProgressRing
            progress={
              journeyProgress /
              100
            }
            size={
              64
            }
            strokeWidth={
              5
            }
            color=
              "#F6C84A"
            backgroundColor=
              "rgba(246,200,74,0.13)"
          >
            <Image
              source={
                PASSPORT_ICON
              }
              style={
                styles.progressIcon
              }
              resizeMode="contain"
            />
          </ProgressRing>

          <View
            style={
              styles.progressCopy
            }
          >
            <Text
              style={
                styles.progressGold
              }
            >
              {translate(
                language,
                "continueJourney"
              )}
            </Text>

            <Text
              style={
                styles.progressTitle
              }
              numberOfLines={
                1
              }
            >
              {activeJourney
                ?.title ||
                t(
                  "chooseNextAdventure"
                )}
            </Text>

            <Text
              style={
                styles.continueHint
              }
              numberOfLines={
                2
              }
            >
              {t(
                "tapReturnRoute"
              )}
            </Text>
          </View>

          <View
            style={
              styles.arrowBadge
            }
          >
            <Text
              style={
                styles.arrow
              }
            >
              ›
            </Text>
          </View>
        </TouchableOpacity>

        {/* ====================================================
            LEGATHON MARATHONS
        ==================================================== */}

        <TouchableOpacity
          style={
            styles.legathonButton
          }
          onPress={
            goToLegathons
          }
          activeOpacity={
            0.85
          }
        >
          <Text
            style={
              styles.buttonEyebrow
            }
          >
            {t(
              "globalEvents"
            )}
          </Text>

          <Text
            style={
              styles.buttonTitle
            }
            numberOfLines={
              2
            }
            adjustsFontSizeToFit
            minimumFontScale={
              0.75
            }
          >
            {t(
              "exploreLegathonMarathons"
            )}
          </Text>

          <Text
            style={
              styles.buttonArrow
            }
          >
            →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        "#020713",
    },

    goldGlow: {
      position:
        "absolute",

      top:
        -120,

      right:
        -110,

      width:
        330,

      height:
        330,

      borderRadius:
        165,

      backgroundColor:
        "rgba(246,200,74,0.10)",
    },

    aquaGlow: {
      position:
        "absolute",

      top:
        470,

      left:
        -140,

      width:
        290,

      height:
        290,

      borderRadius:
        145,

      backgroundColor:
        "rgba(79,255,210,0.055)",
    },

    scrollView: {
      flex:
        1,

      zIndex:
        1,
    },

    content: {
      paddingHorizontal:
        18,

      paddingTop:
        12,

      paddingBottom:
        150,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      minHeight:
        188,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    headerCopy: {
      flex:
        1,

      paddingRight:
        12,
    },

    headerEyebrow: {
      color:
        "#79F5D1",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        3.2,

      marginBottom:
        8,
    },

    headerTitle: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      lineHeight:
        44,

      fontWeight:
        "900",

      letterSpacing:
        -1.3,
    },

    headerTitleGold: {
      color:
        "#F6C84A",
    },

    headerSubtitle: {
      color:
        "#8798B3",

      fontSize:
        14,

      fontWeight:
        "700",

      marginTop:
        10,
    },

    // ==========================================================
    // AVATAR
    // ==========================================================

    profileCard: {
      width:
        112,

      alignItems:
        "center",

      paddingVertical:
        8,

      paddingHorizontal:
        6,

      borderRadius:
        24,

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.28)",

      backgroundColor:
        "rgba(8,22,42,0.86)",
    },

    avatarHalo: {
      width:
        92,

      height:
        94,

      borderRadius:
        46,

      alignItems:
        "center",

      justifyContent:
        "center",

      overflow:
        "hidden",

      borderWidth:
        2,

      borderColor:
        "#F6C84A",

      backgroundColor:
        "#071326",
    },

    avatar: {
      width:
        90,

      height:
        90,
    },

    avatarFallback: {
      fontSize:
        34,
    },

    profileName: {
      width:
        "100%",

      color:
        "#FFFFFF",

      fontSize:
        13,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginTop:
        7,
    },

    profileAction: {
      color:
        "#F6C84A",

      fontSize:
        8,

      fontWeight:
        "900",

      letterSpacing:
        1.2,

      marginTop:
        3,
    },

    // ==========================================================
    // QUOTE
    // ==========================================================

    quoteCard: {
      minHeight:
        126,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        20,

      paddingHorizontal:
        18,

      borderRadius:
        24,

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.48)",

      backgroundColor:
        "rgba(11,23,42,0.96)",

      overflow:
        "hidden",
    },

    quoteMark: {
      alignSelf:
        "flex-start",

      color:
        "#F6C84A",

      fontSize:
        50,

      lineHeight:
        48,

      fontWeight:
        "900",

      marginRight:
        12,
    },

    quoteCopy: {
      flex:
        1,

      paddingRight:
        10,
    },

    quoteText: {
      color:
        "#F5F7FB",

      fontSize:
        17,

      lineHeight:
        25,

      fontWeight:
        "800",
    },

    quoteSignature: {
      color:
        "#79F5D1",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        2,

      marginTop:
        9,
    },

    crownBadge: {
      width:
        42,

      height:
        42,

      borderRadius:
        21,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.65)",

      backgroundColor:
        "rgba(246,200,74,0.10)",
    },

    crown: {
      color:
        "#F6C84A",

      fontSize:
        22,

      fontWeight:
        "900",
    },

    // ==========================================================
    // SECTION
    // ==========================================================

    sectionHeading: {
      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-between",

      marginTop:
        28,

      marginBottom:
        14,
    },

    sectionEyebrow: {
      color:
        "#79F5D1",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        2.4,

      marginBottom:
        5,
    },

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        25,

      fontWeight:
        "900",

      letterSpacing:
        -0.5,
    },

    livePill: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        11,

      paddingVertical:
        7,

      borderRadius:
        99,

      backgroundColor:
        "rgba(79,255,210,0.10)",

      borderWidth:
        1,

      borderColor:
        "rgba(79,255,210,0.28)",
    },

    liveDot: {
      width:
        7,

      height:
        7,

      borderRadius:
        4,

      marginRight:
        6,

      backgroundColor:
        "#4FFFD2",
    },

    liveText: {
      color:
        "#79F5D1",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        1.4,
    },

    // ==========================================================
    // METRICS
    // ==========================================================

    metricsGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },

    metricCard: {
      width:
        "48.5%",

      minHeight:
        190,

      padding:
        15,

      marginBottom:
        12,

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "#233C5E",

      backgroundColor:
        "rgba(8,24,46,0.95)",
    },

    metricTop: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",

      marginBottom:
        16,
    },

    metricAccent: {
      width:
        22,

      height:
        4,

      borderRadius:
        2,

      marginTop:
        4,
    },

    // Larger metric icon
    metricIcon: {
      width:
        42,

      height:
        42,
    },

    metricLabel: {
      color:
        "#91A2BC",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        1.3,
    },

    metricValue: {
      color:
        "#FFFFFF",

      fontSize:
        28,

      fontWeight:
        "900",

      marginTop:
        5,
    },

    metricGoal: {
      color:
        "#71839D",

      fontSize:
        10,

      fontWeight:
        "700",

      marginTop:
        5,
    },

    // ==========================================================
    // POINTS
    // ==========================================================

    pointsCard: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        18,

      paddingHorizontal:
        16,

      marginTop:
        4,

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.55)",

      backgroundColor:
        "rgba(27,23,15,0.96)",
    },

    pointsBadge: {
      width:
        48,

      height:
        48,

      borderRadius:
        24,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        1,

      borderColor:
        "#F6C84A",

      backgroundColor:
        "rgba(246,200,74,0.12)",

      marginRight:
        13,
    },

    pointsStar: {
      color:
        "#F6C84A",

      fontSize:
        24,
    },

    pointsMain: {
      flex:
        1,
    },

    pointsLabel: {
      color:
        "#F6C84A",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        1.4,
    },

    pointsValue: {
      color:
        "#FFFFFF",

      fontSize:
        27,

      fontWeight:
        "900",

      marginTop:
        3,
    },

    pointsRank: {
      color:
        "#AAB7CA",

      fontSize:
        11,

      fontWeight:
        "800",

      marginTop:
        2,
    },

    pointsNext: {
      maxWidth:
        105,

      alignItems:
        "flex-end",
    },

    nextLabel: {
      color:
        "#7C8BA1",

      fontSize:
        8,

      fontWeight:
        "900",

      letterSpacing:
        1.5,
    },

    nextRank: {
      color:
        "#FFFFFF",

      fontSize:
        13,

      fontWeight:
        "900",

      textAlign:
        "right",

      marginTop:
        4,
    },

    pointsRemaining: {
      color:
        "#95845A",

      fontSize:
        9,

      fontWeight:
        "700",

      textAlign:
        "right",

      marginTop:
        4,
    },

    // ==========================================================
    // PROGRESS CARDS
    // ==========================================================

    progressCard: {
      minHeight:
        96,

      flexDirection:
        "row",

      alignItems:
        "center",

      padding:
        16,

      marginTop:
        14,

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "rgba(79,255,210,0.34)",

      backgroundColor:
        "rgba(8,24,46,0.95)",
    },

    continueCard: {
      borderColor:
        "rgba(246,200,74,0.42)",
    },

    // Larger passport icon
    progressIcon: {
      width:
        44,

      height:
        44,
    },

    progressCopy: {
      flex:
        1,

      paddingHorizontal:
        13,
    },

    progressAqua: {
      color:
        "#79F5D1",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        1.5,
    },

    progressGold: {
      color:
        "#F6C84A",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        1.5,
    },

    progressTitle: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",

      marginTop:
        4,
    },

    progressTrack: {
      height:
        5,

      borderRadius:
        3,

      overflow:
        "hidden",

      backgroundColor:
        "#162D4A",

      marginTop:
        10,
    },

    progressFill: {
      height:
        "100%",

      borderRadius:
        3,

      backgroundColor:
        "#4FFFD2",
    },

    progressPercent: {
      minWidth:
        46,

      color:
        "#FFFFFF",

      fontSize:
        19,

      fontWeight:
        "900",

      textAlign:
        "right",
    },

    continueHint: {
      color:
        "#7F90A9",

      fontSize:
        10,

      fontWeight:
        "700",

      marginTop:
        5,
    },

    arrowBadge: {
      width:
        36,

      height:
        36,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(246,200,74,0.12)",

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.45)",
    },

    arrow: {
      color:
        "#F6C84A",

      fontSize:
        29,

      lineHeight:
        31,

      fontWeight:
        "700",
    },

    // ==========================================================
    // LEGATHON BUTTON
    // ==========================================================

    legathonButton: {
      minHeight:
        84,

      justifyContent:
        "center",

      paddingVertical:
        17,

      paddingLeft:
        20,

      paddingRight:
        58,

      marginTop:
        14,

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "rgba(246,200,74,0.62)",

      backgroundColor:
        "#F6C84A",
    },

    buttonEyebrow: {
      color:
        "#5D470E",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        1.8,
    },

    buttonTitle: {
      color:
        "#07101F",

      fontSize:
        18,

      fontWeight:
        "900",

      marginTop:
        4,
    },

    buttonArrow: {
      position:
        "absolute",

      right:
        20,

      color:
        "#07101F",

      fontSize:
        28,

      fontWeight:
        "900",
    },
  });