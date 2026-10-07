// screens/WalkingAnalyticsScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getJourneyLifetimeSteps,
  loadStepStats,
} from "../utils/stepTrackingEngine";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_WEEKLY_GOAL = 100000;
const STEPS_PER_MILE = 2000;
const CALORIES_PER_STEP = 0.04;

const STORAGE_KEYS = {
  WEEK: "legathonWeeklyStepDataV2",
  JOURNEYS: "journeyProgressData",
  STREAK: "currentStreak",
  TODAY: "todaySteps",
  WEEKLY_GOAL: "weeklyStepGoal",
};

// Keep these internal names in English.
// Only the visible day label is translated.
const EMPTY_WEEK = [
  {
    dayKey: "mondayShort",
    full: "Monday",
    steps: 0,
  },
  {
    dayKey: "tuesdayShort",
    full: "Tuesday",
    steps: 0,
  },
  {
    dayKey: "wednesdayShort",
    full: "Wednesday",
    steps: 0,
  },
  {
    dayKey: "thursdayShort",
    full: "Thursday",
    steps: 0,
  },
  {
    dayKey: "fridayShort",
    full: "Friday",
    steps: 0,
  },
  {
    dayKey: "saturdayShort",
    full: "Saturday",
    steps: 0,
  },
  {
    dayKey: "sundayShort",
    full: "Sunday",
    steps: 0,
  },
];

// ============================================================
// SCREEN TRANSLATIONS
// ============================================================

const ANALYTICS_TEXT = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    insights: "LEGATHON INSIGHTS",
    walkingAnalytics: "Walking Analytics",

    subtitle:
      "Your current walking performance, journey activity, and lifetime progress.",

    loadingAnalytics:
      "Loading walking analytics...",

    analyticsRefreshError:
      "Analytics could not be refreshed right now.",

    tryAgain: "Try Again",

    thisWeek: "THIS WEEK",
    weeklyMovement: "Weekly Movement",

    today: "Today",
    thisWeekStat: "This Week",
    dayStreak: "Day Streak",

    weeklyGoal: "Weekly Goal",

    stepsRemaining:
      "{count} steps remaining",

    weeklyGoalCompleted:
      "Weekly goal completed",

    allTimeMovement:
      "ALL-TIME MOVEMENT",

    lifetimeStats:
      "Lifetime Stats",

    lifetimeSteps:
      "Lifetime Steps",

    estimatedMiles:
      "Estimated Miles",

    estimatedCalories:
      "Estimated Calories",

    journeysCompleted:
      "Journeys Completed",

    currentStreak:
      "Current Streak",

    days:
      "{count} days",

    personalBests:
      "PERSONAL BESTS",

    walkingRecords:
      "Walking Records",

    bestDayThisWeek:
      "Best Day This Week",

    highestJourney:
      "Highest Journey",

    back:
      "Back",

    mondayShort: "M",
    tuesdayShort: "T",
    wednesdayShort: "W",
    thursdayShort: "T",
    fridayShort: "F",
    saturdayShort: "S",
    sundayShort: "S",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    insights: "INFORMACIÓN LEGATHON",
    walkingAnalytics: "Análisis de Caminata",

    subtitle:
      "Tu rendimiento actual al caminar, actividad de viajes y progreso acumulado.",

    loadingAnalytics:
      "Cargando análisis de caminata...",

    analyticsRefreshError:
      "No se pudieron actualizar los análisis en este momento.",

    tryAgain: "Intentar de Nuevo",

    thisWeek: "ESTA SEMANA",
    weeklyMovement: "Movimiento Semanal",

    today: "Hoy",
    thisWeekStat: "Esta Semana",
    dayStreak: "Racha de Días",

    weeklyGoal: "Meta Semanal",

    stepsRemaining:
      "Faltan {count} pasos",

    weeklyGoalCompleted:
      "Meta semanal completada",

    allTimeMovement:
      "MOVIMIENTO TOTAL",

    lifetimeStats:
      "Estadísticas Totales",

    lifetimeSteps:
      "Pasos Totales",

    estimatedMiles:
      "Millas Estimadas",

    estimatedCalories:
      "Calorías Estimadas",

    journeysCompleted:
      "Viajes Completados",

    currentStreak:
      "Racha Actual",

    days:
      "{count} días",

    personalBests:
      "MEJORES MARCAS",

    walkingRecords:
      "Récords de Caminata",

    bestDayThisWeek:
      "Mejor Día de Esta Semana",

    highestJourney:
      "Mayor Progreso de Viaje",

    back:
      "Atrás",

    mondayShort: "L",
    tuesdayShort: "M",
    wednesdayShort: "X",
    thursdayShort: "J",
    fridayShort: "V",
    saturdayShort: "S",
    sundayShort: "D",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    insights: "ANALYSES LEGATHON",
    walkingAnalytics: "Analyse de Marche",

    subtitle:
      "Vos performances de marche actuelles, votre activité de voyage et votre progression globale.",

    loadingAnalytics:
      "Chargement des analyses de marche...",

    analyticsRefreshError:
      "Les analyses ne peuvent pas être actualisées pour le moment.",

    tryAgain: "Réessayer",

    thisWeek: "CETTE SEMAINE",
    weeklyMovement: "Mouvement Hebdomadaire",

    today: "Aujourd’hui",
    thisWeekStat: "Cette Semaine",
    dayStreak: "Série de Jours",

    weeklyGoal: "Objectif Hebdomadaire",

    stepsRemaining:
      "{count} pas restants",

    weeklyGoalCompleted:
      "Objectif hebdomadaire atteint",

    allTimeMovement:
      "MOUVEMENT GLOBAL",

    lifetimeStats:
      "Statistiques Globales",

    lifetimeSteps:
      "Pas Cumulés",

    estimatedMiles:
      "Miles Estimés",

    estimatedCalories:
      "Calories Estimées",

    journeysCompleted:
      "Voyages Terminés",

    currentStreak:
      "Série Actuelle",

    days:
      "{count} jours",

    personalBests:
      "RECORDS PERSONNELS",

    walkingRecords:
      "Records de Marche",

    bestDayThisWeek:
      "Meilleur Jour de la Semaine",

    highestJourney:
      "Progression Maximale",

    back:
      "Retour",

    mondayShort: "L",
    tuesdayShort: "M",
    wednesdayShort: "M",
    thursdayShort: "J",
    fridayShort: "V",
    saturdayShort: "S",
    sundayShort: "D",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    insights: "LEGATHON-EINBLICKE",
    walkingAnalytics: "Gehanalyse",

    subtitle:
      "Deine aktuelle Gehleistung, Reiseaktivität und dein Gesamtfortschritt.",

    loadingAnalytics:
      "Gehanalyse wird geladen...",

    analyticsRefreshError:
      "Die Analyse konnte derzeit nicht aktualisiert werden.",

    tryAgain: "Erneut Versuchen",

    thisWeek: "DIESE WOCHE",
    weeklyMovement: "Wöchentliche Bewegung",

    today: "Heute",
    thisWeekStat: "Diese Woche",
    dayStreak: "Tagesserie",

    weeklyGoal: "Wochenziel",

    stepsRemaining:
      "{count} Schritte verbleiben",

    weeklyGoalCompleted:
      "Wochenziel erreicht",

    allTimeMovement:
      "GESAMTBEWEGUNG",

    lifetimeStats:
      "Gesamtstatistik",

    lifetimeSteps:
      "Gesamtschritte",

    estimatedMiles:
      "Geschätzte Meilen",

    estimatedCalories:
      "Geschätzte Kalorien",

    journeysCompleted:
      "Abgeschlossene Reisen",

    currentStreak:
      "Aktuelle Serie",

    days:
      "{count} Tage",

    personalBests:
      "PERSÖNLICHE BESTWERTE",

    walkingRecords:
      "Gehrekorde",

    bestDayThisWeek:
      "Bester Tag Diese Woche",

    highestJourney:
      "Höchster Reisefortschritt",

    back:
      "Zurück",

    mondayShort: "M",
    tuesdayShort: "D",
    wednesdayShort: "M",
    thursdayShort: "D",
    fridayShort: "F",
    saturdayShort: "S",
    sundayShort: "S",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    insights: "ANÁLISES LEGATHON",
    walkingAnalytics: "Análise de Caminhada",

    subtitle:
      "Seu desempenho atual de caminhada, atividade nas jornadas e progresso total.",

    loadingAnalytics:
      "Carregando análise de caminhada...",

    analyticsRefreshError:
      "Não foi possível atualizar a análise agora.",

    tryAgain: "Tentar Novamente",

    thisWeek: "ESTA SEMANA",
    weeklyMovement: "Movimento Semanal",

    today: "Hoje",
    thisWeekStat: "Esta Semana",
    dayStreak: "Sequência de Dias",

    weeklyGoal: "Meta Semanal",

    stepsRemaining:
      "Faltam {count} passos",

    weeklyGoalCompleted:
      "Meta semanal concluída",

    allTimeMovement:
      "MOVIMENTO TOTAL",

    lifetimeStats:
      "Estatísticas Totais",

    lifetimeSteps:
      "Passos Totais",

    estimatedMiles:
      "Milhas Estimadas",

    estimatedCalories:
      "Calorias Estimadas",

    journeysCompleted:
      "Jornadas Concluídas",

    currentStreak:
      "Sequência Atual",

    days:
      "{count} dias",

    personalBests:
      "MELHORES MARCAS",

    walkingRecords:
      "Recordes de Caminhada",

    bestDayThisWeek:
      "Melhor Dia da Semana",

    highestJourney:
      "Maior Progresso de Jornada",

    back:
      "Voltar",

    mondayShort: "S",
    tuesdayShort: "T",
    wednesdayShort: "Q",
    thursdayShort: "Q",
    fridayShort: "S",
    saturdayShort: "S",
    sundayShort: "D",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    insights: "LEGATHON インサイト",
    walkingAnalytics: "ウォーキング分析",

    subtitle:
      "現在の歩行パフォーマンス、ジャーニー活動、累計進捗を確認できます。",

    loadingAnalytics:
      "ウォーキング分析を読み込み中...",

    analyticsRefreshError:
      "現在、分析データを更新できません。",

    tryAgain: "もう一度試す",

    thisWeek: "今週",
    weeklyMovement: "週間ウォーキング",

    today: "今日",
    thisWeekStat: "今週",
    dayStreak: "連続日数",

    weeklyGoal: "週間目標",

    stepsRemaining:
      "あと {count} 歩",

    weeklyGoalCompleted:
      "週間目標を達成しました",

    allTimeMovement:
      "累計ウォーキング",

    lifetimeStats:
      "累計統計",

    lifetimeSteps:
      "累計歩数",

    estimatedMiles:
      "推定マイル",

    estimatedCalories:
      "推定消費カロリー",

    journeysCompleted:
      "完了したジャーニー",

    currentStreak:
      "現在の連続記録",

    days:
      "{count} 日",

    personalBests:
      "自己ベスト",

    walkingRecords:
      "ウォーキング記録",

    bestDayThisWeek:
      "今週の最高歩数",

    highestJourney:
      "最高ジャーニー進捗",

    back:
      "戻る",

    mondayShort: "月",
    tuesdayShort: "火",
    wednesdayShort: "水",
    thursdayShort: "木",
    fridayShort: "金",
    saturdayShort: "土",
    sundayShort: "日",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    insights: "LEGATHON 인사이트",
    walkingAnalytics: "걷기 분석",

    subtitle:
      "현재 걷기 성과, 여정 활동 및 누적 진행 상황을 확인하세요.",

    loadingAnalytics:
      "걷기 분석 불러오는 중...",

    analyticsRefreshError:
      "현재 분석 데이터를 새로고침할 수 없습니다.",

    tryAgain: "다시 시도",

    thisWeek: "이번 주",
    weeklyMovement: "주간 활동",

    today: "오늘",
    thisWeekStat: "이번 주",
    dayStreak: "연속 일수",

    weeklyGoal: "주간 목표",

    stepsRemaining:
      "{count}걸음 남음",

    weeklyGoalCompleted:
      "주간 목표 달성",

    allTimeMovement:
      "누적 활동",

    lifetimeStats:
      "누적 통계",

    lifetimeSteps:
      "누적 걸음 수",

    estimatedMiles:
      "예상 마일",

    estimatedCalories:
      "예상 칼로리",

    journeysCompleted:
      "완료한 여정",

    currentStreak:
      "현재 연속 기록",

    days:
      "{count}일",

    personalBests:
      "개인 최고 기록",

    walkingRecords:
      "걷기 기록",

    bestDayThisWeek:
      "이번 주 최고 기록",

    highestJourney:
      "최고 여정 진행률",

    back:
      "뒤로",

    mondayShort: "월",
    tuesdayShort: "화",
    wednesdayShort: "수",
    thursdayShort: "목",
    fridayShort: "금",
    saturdayShort: "토",
    sundayShort: "일",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    insights: "LEGATHON 数据洞察",
    walkingAnalytics: "步行分析",

    subtitle:
      "查看你当前的步行表现、旅程活动和累计进度。",

    loadingAnalytics:
      "正在加载步行分析...",

    analyticsRefreshError:
      "目前无法刷新分析数据。",

    tryAgain: "重试",

    thisWeek: "本周",
    weeklyMovement: "本周运动",

    today: "今天",
    thisWeekStat: "本周",
    dayStreak: "连续天数",

    weeklyGoal: "每周目标",

    stepsRemaining:
      "还需 {count} 步",

    weeklyGoalCompleted:
      "已完成每周目标",

    allTimeMovement:
      "累计运动",

    lifetimeStats:
      "累计统计",

    lifetimeSteps:
      "累计步数",

    estimatedMiles:
      "预计英里",

    estimatedCalories:
      "预计消耗卡路里",

    journeysCompleted:
      "已完成旅程",

    currentStreak:
      "当前连续记录",

    days:
      "{count} 天",

    personalBests:
      "个人最佳",

    walkingRecords:
      "步行记录",

    bestDayThisWeek:
      "本周最佳单日",

    highestJourney:
      "最高旅程进度",

    back:
      "返回",

    mondayShort: "一",
    tuesdayShort: "二",
    wednesdayShort: "三",
    thursdayShort: "四",
    fridayShort: "五",
    saturdayShort: "六",
    sundayShort: "日",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    insights: "ANALISI LEGATHON",
    walkingAnalytics: "Analisi della Camminata",

    subtitle:
      "Le tue prestazioni attuali di camminata, attività dei percorsi e progressi complessivi.",

    loadingAnalytics:
      "Caricamento analisi della camminata...",

    analyticsRefreshError:
      "Impossibile aggiornare l'analisi in questo momento.",

    tryAgain: "Riprova",

    thisWeek: "QUESTA SETTIMANA",
    weeklyMovement: "Movimento Settimanale",

    today: "Oggi",
    thisWeekStat: "Questa Settimana",
    dayStreak: "Serie di Giorni",

    weeklyGoal: "Obiettivo Settimanale",

    stepsRemaining:
      "{count} passi rimanenti",

    weeklyGoalCompleted:
      "Obiettivo settimanale completato",

    allTimeMovement:
      "MOVIMENTO TOTALE",

    lifetimeStats:
      "Statistiche Totali",

    lifetimeSteps:
      "Passi Totali",

    estimatedMiles:
      "Miglia Stimate",

    estimatedCalories:
      "Calorie Stimate",

    journeysCompleted:
      "Percorsi Completati",

    currentStreak:
      "Serie Attuale",

    days:
      "{count} giorni",

    personalBests:
      "RECORD PERSONALI",

    walkingRecords:
      "Record di Camminata",

    bestDayThisWeek:
      "Miglior Giorno della Settimana",

    highestJourney:
      "Miglior Progresso Percorso",

    back:
      "Indietro",

    mondayShort: "L",
    tuesdayShort: "M",
    wednesdayShort: "M",
    thursdayShort: "G",
    fridayShort: "V",
    saturdayShort: "S",
    sundayShort: "D",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    insights: "تحليلات LEGATHON",
    walkingAnalytics: "تحليل المشي",

    subtitle:
      "أداء المشي الحالي ونشاط الرحلات والتقدم الإجمالي.",

    loadingAnalytics:
      "جارٍ تحميل تحليل المشي...",

    analyticsRefreshError:
      "تعذر تحديث التحليلات في الوقت الحالي.",

    tryAgain: "حاول مرة أخرى",

    thisWeek: "هذا الأسبوع",
    weeklyMovement: "الحركة الأسبوعية",

    today: "اليوم",
    thisWeekStat: "هذا الأسبوع",
    dayStreak: "أيام متتالية",

    weeklyGoal: "الهدف الأسبوعي",

    stepsRemaining:
      "متبقي {count} خطوة",

    weeklyGoalCompleted:
      "تم تحقيق الهدف الأسبوعي",

    allTimeMovement:
      "إجمالي الحركة",

    lifetimeStats:
      "الإحصائيات الإجمالية",

    lifetimeSteps:
      "إجمالي الخطوات",

    estimatedMiles:
      "الأميال المقدرة",

    estimatedCalories:
      "السعرات المقدرة",

    journeysCompleted:
      "الرحلات المكتملة",

    currentStreak:
      "السلسلة الحالية",

    days:
      "{count} يوم",

    personalBests:
      "أفضل الأرقام الشخصية",

    walkingRecords:
      "سجلات المشي",

    bestDayThisWeek:
      "أفضل يوم هذا الأسبوع",

    highestJourney:
      "أعلى تقدم للرحلة",

    back:
      "رجوع",

    mondayShort: "ن",
    tuesdayShort: "ث",
    wednesdayShort: "ر",
    thursdayShort: "خ",
    fridayShort: "ج",
    saturdayShort: "س",
    sundayShort: "ح",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function fillTemplate(
  value,
  variables = {}
) {
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

function getAnalyticsText(
  language,
  key,
  variables = {}
) {
  // Use screen translation first.
  // This prevents translate() English fallback from
  // overriding our screen-specific language.

  const local =
    ANALYTICS_TEXT?.[language]?.[key];

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

  if (central !== key) {
    return fillTemplate(
      central,
      variables
    );
  }

  return fillTemplate(
    ANALYTICS_TEXT.en?.[key] ||
      key,
    variables
  );
}

// ============================================================
// DATA HELPERS
// ============================================================

function safeInteger(
  value,
  fallback = 0
) {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor(parsed)
  );
}

function clampPercent(
  value
) {
  return Math.min(
    100,
    safeInteger(value)
  );
}

function safeJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch {
    return fallback;
  }
}

function getCurrentDayIndex() {
  const day =
    new Date().getDay();

  return day === 0
    ? 6
    : day - 1;
}

function formatLocalDate(
  date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function getCurrentWeekId() {
  const date =
    new Date();

  const mondayOffset =
    (date.getDay() + 6) %
    7;

  date.setHours(
    0,
    0,
    0,
    0
  );

  date.setDate(
    date.getDate() -
      mondayOffset
  );

  return formatLocalDate(
    date
  );
}

function normalizeWeek(
  value,
  todaySteps
) {
  const currentWeekId =
    getCurrentWeekId();

  const savedWeek =
    value?.weekId ===
      currentWeekId &&
    Array.isArray(
      value?.days
    )
      ? value.days
      : [];

  const todayIndex =
    getCurrentDayIndex();

  const days =
    EMPTY_WEEK.map(
      (
        fallback,
        index
      ) => {
        const saved =
          savedWeek[
            index
          ];

        return {
          dayKey:
            fallback.dayKey,

          full:
            fallback.full,

          steps:
            index ===
            todayIndex
              ? safeInteger(
                  todaySteps
                )
              : safeInteger(
                  saved?.steps
                ),
        };
      }
    );

  return {
    weekId:
      currentWeekId,

    days,
  };
}

function normalizeJourneys(
  value
) {
  const source =
    Array.isArray(
      value
    )
      ? value
      : value &&
        typeof value ===
          "object"
      ? Object.values(
          value
        )
      : [];

  return source
    .map(
      (
        journey,
        index
      ) => ({
        id:
          String(
            journey?.id ||
              journey?.journeyId ||
              `journey-${index}`
          ),

        title:
          String(
            journey?.title ||
              journey?.name ||
              "Untitled Journey"
          ),

        progress:
          clampPercent(
            journey?.progress ??
              journey?.progressPercent ??
              journey?.percent
          ),
      })
    )
    .filter(
      journey =>
        journey.title !==
        "Untitled Journey"
    );
}

function formatCompactSteps(
  value
) {
  const steps =
    safeInteger(
      value
    );

  if (
    steps >=
    1000000
  ) {
    return `${(
      steps /
      1000000
    ).toFixed(1)}M`;
  }

  if (
    steps >=
    1000
  ) {
    return `${(
      steps /
      1000
    ).toFixed(1)}K`;
  }

  return String(
    steps
  );
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function StatBox({
  value,
  label,
  accent = false,
}) {
  return (
    <View
      style={
        styles.statBox
      }
    >
      <Text
        style={[
          styles.statValue,

          accent &&
            styles.statValueAccent,
        ]}
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.statLabel
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
    </View>
  );
}

function RecordRow({
  label,
  value,
  last = false,
}) {
  return (
    <View
      style={[
        styles.recordRow,

        last &&
          styles.recordRowLast,
      ]}
    >
      <Text
        style={
          styles.recordLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.recordValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function WalkingAnalyticsScreen({
  language = "en",
  goBack,
}) {
  function t(
    key,
    variables = {}
  ) {
    return getAnalyticsText(
      language,
      key,
      variables
    );
  }

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    weeklyData,
    setWeeklyData,
  ] =
    useState(
      EMPTY_WEEK
    );

  const [
    journeys,
    setJourneys,
  ] =
    useState(
      []
    );

  const [
    todaySteps,
    setTodaySteps,
  ] =
    useState(
      0
    );

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(
      0
    );

  const [
    streak,
    setStreak,
  ] =
    useState(
      0
    );

  const [
    weeklyGoal,
    setWeeklyGoal,
  ] =
    useState(
      DEFAULT_WEEKLY_GOAL
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  // Store the translation key rather than
  // storing an English error message.
  const [
    loadError,
    setLoadError,
  ] =
    useState(
      ""
    );

  // ==========================================================
  // LOAD ANALYTICS
  // ==========================================================

  const loadAnalytics =
    useCallback(
      async ({
        pullRefresh = false,
      } = {}) => {
        if (
          pullRefresh
        ) {
          setRefreshing(
            true
          );
        }

        try {
          setLoadError(
            ""
          );

          const [
            storedValues,
            stepStats,
            journeyLifetimeSteps,
          ] =
            await Promise.all([
              AsyncStorage.multiGet([
                STORAGE_KEYS.WEEK,
                STORAGE_KEYS.JOURNEYS,
                STORAGE_KEYS.STREAK,
                STORAGE_KEYS.TODAY,
                STORAGE_KEYS.WEEKLY_GOAL,
              ]),

              loadStepStats(),

              getJourneyLifetimeSteps(),
            ]);

          const stored =
            Object.fromEntries(
              storedValues
            );

          // ====================================================
          // TODAY
          // ====================================================

          const hasTrackedToday =
            Number.isFinite(
              Number(
                stepStats
                  ?.todaySteps
              )
            );

          const resolvedToday =
            hasTrackedToday
              ? safeInteger(
                  stepStats.todaySteps
                )
              : safeInteger(
                  stored[
                    STORAGE_KEYS.TODAY
                  ]
                );

          // ====================================================
          // LIFETIME
          // ====================================================

          const resolvedLifetime =
            Math.max(
              safeInteger(
                journeyLifetimeSteps
              ),

              safeInteger(
                stepStats
                  ?.journeyLifetimeSteps
              ),

              safeInteger(
                stepStats
                  ?.lifetimeSteps
              )
            );

          // ====================================================
          // STREAK
          // ====================================================

          const resolvedStreak =
            Math.max(
              safeInteger(
                stepStats
                  ?.dayStreak
              ),

              safeInteger(
                stored[
                  STORAGE_KEYS.STREAK
                ]
              )
            );

          // ====================================================
          // GOAL
          // ====================================================

          const savedGoal =
            safeInteger(
              stored[
                STORAGE_KEYS.WEEKLY_GOAL
              ]
            );

          // ====================================================
          // WEEK
          // ====================================================

          const savedWeek =
            safeJSON(
              stored[
                STORAGE_KEYS.WEEK
              ],
              []
            );

          // ====================================================
          // JOURNEYS
          // ====================================================

          const savedJourneys =
            safeJSON(
              stored[
                STORAGE_KEYS.JOURNEYS
              ],
              []
            );

          setTodaySteps(
            resolvedToday
          );

          setLifetimeSteps(
            resolvedLifetime
          );

          setStreak(
            resolvedStreak
          );

          setWeeklyGoal(
            savedGoal >
              0
              ? savedGoal
              : DEFAULT_WEEKLY_GOAL
          );

          const normalizedWeek =
            normalizeWeek(
              savedWeek,
              resolvedToday
            );

          setWeeklyData(
            normalizedWeek.days
          );

          await AsyncStorage.setItem(
            STORAGE_KEYS.WEEK,
            JSON.stringify(
              normalizedWeek
            )
          );

          setJourneys(
            normalizeJourneys(
              savedJourneys
            )
          );
        } catch (
          error
        ) {
          console.log(
            "Walking analytics load error:",
            error
          );

          setLoadError(
            "analyticsRefreshError"
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },

      []
    );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {
      loadAnalytics();
    },

    [
      loadAnalytics,
    ]
  );

  // ==========================================================
  // REFRESH WHEN APP BECOMES ACTIVE
  // ==========================================================

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
              loadAnalytics();
            }
          }
        );

      return () =>
        subscription.remove();
    },

    [
      loadAnalytics,
    ]
  );

  // ==========================================================
  // WEEKLY STEPS
  // ==========================================================

  const weeklySteps =
    useMemo(
      () =>
        weeklyData.reduce(
          (
            total,
            day
          ) =>
            total +
            safeInteger(
              day.steps
            ),

          0
        ),

      [
        weeklyData,
      ]
    );

  // ==========================================================
  // WEEKLY GOAL PROGRESS
  // ==========================================================

  const goalProgress =
    useMemo(
      () =>
        weeklyGoal >
        0
          ? Math.min(
              100,

              Math.round(
                (
                  weeklySteps /
                  weeklyGoal
                ) *
                  100
              )
            )
          : 0,

      [
        weeklyGoal,
        weeklySteps,
      ]
    );

  const stepsRemaining =
    Math.max(
      weeklyGoal -
        weeklySteps,
      0
    );

  // ==========================================================
  // BEST DAY
  // ==========================================================

  const bestDay =
    Math.max(
      ...weeklyData.map(
        day =>
          safeInteger(
            day.steps
          )
      ),

      0
    );

  const maxChartSteps =
    Math.max(
      bestDay,
      1
    );

  const currentDayIndex =
    getCurrentDayIndex();

  // ==========================================================
  // JOURNEY STATS
  // ==========================================================

  const completedJourneys =
    journeys.filter(
      journey =>
        journey.progress >=
        100
    ).length;

  const highestJourneyProgress =
    Math.max(
      ...journeys.map(
        journey =>
          clampPercent(
            journey.progress
          )
      ),

      0
    );

  // ==========================================================
  // LIFETIME ESTIMATES
  // ==========================================================

  const estimatedMiles =
    lifetimeSteps /
    STEPS_PER_MILE;

  const estimatedCalories =
    Math.round(
      lifetimeSteps *
        CALORIES_PER_STEP
    );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading
  ) {
    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#F5C542"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            {t(
              "loadingAnalytics"
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
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
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() =>
              loadAnalytics({
                pullRefresh:
                  true,
              })
            }
            tintColor="#F5C542"
            colors={[
              "#F5C542",
            ]}
          />
        }
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <Text
          style={
            styles.eyebrow
          }
        >
          {t(
            "insights"
          )}
        </Text>

        <Text
          style={
            styles.title
          }
          numberOfLines={
            3
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.7
          }
        >
          {t(
            "walkingAnalytics"
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

        {/* ====================================================
            ERROR
        ==================================================== */}

        {loadError ? (
          <View
            style={
              styles.errorCard
            }
          >
            <Text
              style={
                styles.errorText
              }
            >
              {t(
                loadError
              )}
            </Text>

            <TouchableOpacity
              onPress={() =>
                loadAnalytics()
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                {t(
                  "tryAgain"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ====================================================
            WEEKLY MOVEMENT
        ==================================================== */}

        <View
          style={
            styles.heroCard
          }
        >
          <View
            style={
              styles.sectionHeadingRow
            }
          >
            <View
              style={
                styles.sectionHeadingCopy
              }
            >
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "thisWeek"
                )}
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
                numberOfLines={
                  2
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {t(
                  "weeklyMovement"
                )}
              </Text>
            </View>

            <View
              style={
                styles.progressBadge
              }
            >
              <Text
                style={
                  styles.progressBadgeText
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
              >
                {goalProgress}%
              </Text>
            </View>
          </View>

          {/* ==================================================
              TOP STATS
          ================================================== */}

          <View
            style={
              styles.statGrid
            }
          >
            <StatBox
              value={
                todaySteps
                  .toLocaleString()
              }
              label={
                t(
                  "today"
                )
              }
              accent
            />

            <StatBox
              value={
                formatCompactSteps(
                  weeklySteps
                )
              }
              label={
                t(
                  "thisWeekStat"
                )
              }
            />

            <StatBox
              value={
                String(
                  streak
                )
              }
              label={
                t(
                  "dayStreak"
                )
              }
            />
          </View>

          {/* ==================================================
              WEEK CHART
          ================================================== */}

          <View
            style={
              styles.chart
            }
          >
            {weeklyData.map(
              (
                item,
                index
              ) => {
                const steps =
                  safeInteger(
                    item.steps
                  );

                const height =
                  steps >
                  0
                    ? Math.max(
                        8,

                        (
                          steps /
                          maxChartSteps
                        ) *
                          156
                      )
                    : 0;

                const isToday =
                  index ===
                  currentDayIndex;

                return (
                  <View
                    key={
                      `${item.full}-${index}`
                    }
                    style={
                      styles.barColumn
                    }
                  >
                    <Text
                      style={
                        styles.barNumber
                      }
                    >
                      {formatCompactSteps(
                        steps
                      )}
                    </Text>

                    <View
                      style={
                        styles.barTrack
                      }
                    >
                      <View
                        style={[
                          styles.bar,

                          {
                            height,
                          },

                          isToday &&
                            styles.todayBar,
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.day,

                        isToday &&
                          styles.todayDay,
                      ]}
                    >
                      {t(
                        item.dayKey
                      )}
                    </Text>
                  </View>
                );
              }
            )}
          </View>

          {/* ==================================================
              WEEKLY GOAL
          ================================================== */}

          <View
            style={
              styles.goalBox
            }
          >
            <View
              style={
                styles.goalHeadingRow
              }
            >
              <Text
                style={
                  styles.goalText
                }
              >
                {t(
                  "weeklyGoal"
                )}
              </Text>

              <Text
                style={
                  styles.goalValue
                }
              >
                {weeklySteps
                  .toLocaleString()}{" "}
                /{" "}
                {weeklyGoal
                  .toLocaleString()}
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
                      `${goalProgress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={
                styles.remaining
              }
            >
              {stepsRemaining >
              0
                ? t(
                    "stepsRemaining",
                    {
                      count:
                        stepsRemaining
                          .toLocaleString(),
                    }
                  )
                : t(
                    "weeklyGoalCompleted"
                  )}
            </Text>
          </View>
        </View>

        {/* ====================================================
            LIFETIME STATS
        ==================================================== */}

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.cardEyebrow
            }
          >
            {t(
              "allTimeMovement"
            )}
          </Text>

          <Text
            style={
              styles.cardTitle
            }
          >
            {t(
              "lifetimeStats"
            )}
          </Text>

          <RecordRow
            label={
              t(
                "lifetimeSteps"
              )
            }
            value={
              lifetimeSteps
                .toLocaleString()
            }
          />

          <RecordRow
            label={
              t(
                "estimatedMiles"
              )
            }
            value={
              estimatedMiles
                .toFixed(2)
            }
          />

          <RecordRow
            label={
              t(
                "estimatedCalories"
              )
            }
            value={
              estimatedCalories
                .toLocaleString()
            }
          />

          <RecordRow
            label={
              t(
                "journeysCompleted"
              )
            }
            value={
              String(
                completedJourneys
              )
            }
          />

          <RecordRow
            label={
              t(
                "currentStreak"
              )
            }
            value={
              t(
                "days",
                {
                  count:
                    streak,
                }
              )
            }
            last
          />
        </View>

        {/* ====================================================
            PERSONAL RECORDS
        ==================================================== */}

        <View
          style={
            styles.goldCard
          }
        >
          <Text
            style={
              styles.goldEyebrow
            }
          >
            {t(
              "personalBests"
            )}
          </Text>

          <Text
            style={
              styles.goldTitle
            }
          >
            {t(
              "walkingRecords"
            )}
          </Text>

          <RecordRow
            label={
              t(
                "bestDayThisWeek"
              )
            }
            value={
              bestDay
                .toLocaleString()
            }
          />

          <RecordRow
            label={
              t(
                "highestJourney"
              )
            }
            value={
              `${highestJourneyProgress}%`
            }
          />

          <RecordRow
            label={
              t(
                "weeklyGoal"
              )
            }
            value={
              `${goalProgress}%`
            }
            last
          />
        </View>

        {/* ====================================================
            BACK
        ==================================================== */}

        {typeof goBack ===
        "function" ? (
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              goBack
            }
            activeOpacity={
              0.84
            }
          >
            <Text
              style={
                styles.backText
              }
            >
              {t(
                "back"
              )}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#030711",
    },

    container: {
      flex: 1,
      backgroundColor:
        "#030711",
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 26,
      paddingBottom: 190,
    },

    // ==========================================================
    // LOADING
    // ==========================================================

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },

    loadingText: {
      color: "#AAB7CA",
      fontSize: 16,
      fontWeight: "800",
      marginTop: 16,
      textAlign: "center",
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    eyebrow: {
      color: "#F5C542",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 10,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 43,
      lineHeight: 49,
      fontWeight: "900",
    },

    subtitle: {
      color: "#9EABC0",
      fontSize: 17,
      lineHeight: 26,
      fontWeight: "700",
      marginTop: 12,
      marginBottom: 24,
    },

    // ==========================================================
    // ERROR
    // ==========================================================

    errorCard: {
      backgroundColor:
        "rgba(127,29,29,0.28)",
      borderColor:
        "#EF4444",
      borderWidth: 1,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
    },

    errorText: {
      color: "#FECACA",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
    },

    retryText: {
      color: "#F5C542",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 10,
    },

    // ==========================================================
    // WEEK CARD
    // ==========================================================

    heroCard: {
      backgroundColor:
        "#09172A",
      borderColor:
        "#2A4162",
      borderWidth: 1.5,
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
    },

    sectionHeadingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    sectionHeadingCopy: {
      flex: 1,
      paddingRight: 12,
    },

    sectionEyebrow: {
      color: "#86F7D0",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.5,
      marginBottom: 6,
    },

    heroTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
    },

    progressBadge: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 5,
      borderColor:
        "#F5C542",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#06101F",
    },

    progressBadgeText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
    },

    // ==========================================================
    // STAT GRID
    // ==========================================================

    statGrid: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 22,
    },

    statBox: {
      flex: 1,
      minHeight: 92,
      backgroundColor:
        "#0E1E34",
      borderColor:
        "#294361",
      borderWidth: 1,
      borderRadius: 19,
      paddingHorizontal: 8,
      paddingVertical: 15,
      justifyContent: "center",
    },

    statValue: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
    },

    statValueAccent: {
      color: "#86F7D0",
    },

    statLabel: {
      color: "#9EABC0",
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "900",
      marginTop: 6,
    },

    // ==========================================================
    // CHART
    // ==========================================================

    chart: {
      height: 225,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    barColumn: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent:
        "flex-end",
    },

    barNumber: {
      color: "#AAB7CA",
      fontSize: 10,
      fontWeight: "900",
      marginBottom: 7,
    },

    barTrack: {
      width: 26,
      height: 156,
      borderRadius: 13,
      backgroundColor:
        "#13243B",
      overflow: "hidden",
      justifyContent:
        "flex-end",
    },

    bar: {
      width: "100%",
      borderRadius: 13,
      backgroundColor:
        "#86F7D0",
    },

    todayBar: {
      backgroundColor:
        "#F5C542",
    },

    day: {
      color: "#8391A8",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 9,
    },

    todayDay: {
      color: "#F5C542",
    },

    // ==========================================================
    // GOAL
    // ==========================================================

    goalBox: {
      backgroundColor:
        "#0E1E34",
      borderColor:
        "#294361",
      borderWidth: 1,
      borderRadius: 21,
      padding: 16,
    },

    goalHeadingRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    goalText: {
      flex: 1,
      color: "#AAB7CA",
      fontSize: 14,
      fontWeight: "900",
      paddingRight: 10,
    },

    goalValue: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
    },

    progressTrack: {
      width: "100%",
      height: 12,
      backgroundColor:
        "#142A46",
      borderRadius: 999,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor:
        "#86F7D0",
      borderRadius: 999,
    },

    remaining: {
      color: "#F5C542",
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "900",
      marginTop: 11,
    },

    // ==========================================================
    // STANDARD CARDS
    // ==========================================================

    card: {
      backgroundColor:
        "#09172A",
      borderColor:
        "#2A4162",
      borderWidth: 1.5,
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
    },

    goldCard: {
      backgroundColor:
        "rgba(245,197,66,0.09)",
      borderColor:
        "#F5C542",
      borderWidth: 1.5,
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
    },

    cardEyebrow: {
      color: "#86F7D0",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.5,
      marginBottom: 8,
    },

    cardTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
      marginBottom: 18,
    },

    goldEyebrow: {
      color: "#F5C542",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.5,
      marginBottom: 8,
    },

    goldTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
      marginBottom: 18,
    },

    // ==========================================================
    // RECORD ROW
    // ==========================================================

    recordRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      gap: 14,
      borderBottomColor:
        "#20334E",
      borderBottomWidth: 1,
      paddingVertical: 14,
    },

    recordRowLast: {
      borderBottomWidth: 0,
    },

    recordLabel: {
      flex: 1,
      color: "#AAB7CA",
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "800",
    },

    recordValue: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
      textAlign: "right",
      maxWidth: "45%",
    },

    // ==========================================================
    // UNUSED JOURNEY STYLES
    // Kept so your existing design remains available if you
    // later restore a journey-progress section.
    // ==========================================================

    journeyRow: {
      marginBottom: 20,
    },

    journeyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 10,
    },

    journeyName: {
      flex: 1,
      color: "#FFFFFF",
      fontSize: 17,
      lineHeight: 23,
      fontWeight: "800",
      paddingRight: 12,
    },

    journeyPercent: {
      color: "#F5C542",
      fontSize: 17,
      fontWeight: "900",
    },

    emptyState: {
      alignItems: "center",
      backgroundColor:
        "#0E1E34",
      borderRadius: 22,
      paddingHorizontal: 20,
      paddingVertical: 25,
    },

    emptyIcon: {
      fontSize: 35,
      marginBottom: 10,
    },

    emptyTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
      textAlign: "center",
    },

    emptyText: {
      color: "#9EABC0",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 7,
    },

    // ==========================================================
    // BACK
    // ==========================================================

    backButton: {
      minHeight: 56,
      borderRadius: 999,
      backgroundColor:
        "#F5C542",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    backText: {
      color: "#030711",
      fontSize: 18,
      fontWeight: "900",
    },
  });