// screens/BreathingAnalyticsScreen.js

import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  loadBreathingAnalytics,
  resetBreathingAnalytics,
} from "../utils/breathingAnalyticsStorage";

import {
  getBreathingChallenges,
} from "../utils/breathingChallenges";

import {
  getBreathingAchievements,
} from "../utils/breathingAchievements";


// ============================================================
// LEGATHON WALK — BREATHING ANALYTICS
// ============================================================
//
// Supported languages:
//
// en = English
// es = Spanish
// fr = French
// de = German
// pt = Portuguese
// ja = Japanese
// ko = Korean
// zh = Chinese
// it = Italian
// ar = Arabic
//
// IMPORTANT:
//
// This screen only READS breathing analytics and displays them.
//
// Existing breathing storage, rewards, challenges, and
// achievements remain unchanged.
//
// ============================================================


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "Back",

    kicker: "BREATHING ANALYTICS",
    title: "Your Calm Progress",

    subtitle:
      "Track completed sessions, breathing minutes, rewards, streaks, and calm mastery.",

    sessions: "Sessions",
    minutes: "Minutes",
    wCoins: "WCoins",
    streak: "Streak",

    completed: "completed",
    breathed: "breathed",
    earned: "earned",
    weekly: "weekly",

    breathingScore: "Breathing Score",
    breathingScoreSubtitle:
      "Overall breathing wellness score",

    breathingLevel: "BREATHING LEVEL",
    calmMaster: "Calm Master",
    level: "Lv.",

    sessionsCompleted:
      "{count} sessions completed",

    currentStreak: "Current Streak",
    consecutiveSessions:
      "Consecutive Sessions",

    bestSession: "Best Session",

    bestSessionEmpty:
      "Complete a breathing session to unlock your best session.",

    achievements: "Achievements",

    firstBreath: "First Breath",
    mindfulWalker: "Mindful Walker",
    streakBuilder: "Streak Builder",
    calmMasterBadge: "Calm Master",

    unlocked: "Unlocked",
    locked: "Locked",

    recentHistory: "Recent History",

    noHistory:
      "No breathing sessions recorded yet.",

    dailyChallenges: "Daily Challenges",

    resetAnalytics: "Reset Analytics",

    resetTitle: "Reset Breathing Analytics",

    resetMessage:
      "Are you sure you want to erase your breathing analytics?",

    cancel: "Cancel",
    reset: "Reset",

    minuteShort: "min",

    wCoinsEarned: "WCoins",

    challengeProgress: "Progress",

    reward: "Reward",

    loading: "Loading breathing analytics…",

    loadError:
      "Unable to load breathing analytics.",

    resetError:
      "Unable to reset breathing analytics.",
  },


  es: {
    back: "Atrás",

    kicker: "ANÁLISIS DE RESPIRACIÓN",
    title: "Tu progreso de calma",

    subtitle:
      "Sigue tus sesiones completadas, minutos de respiración, recompensas, rachas y progreso de calma.",

    sessions: "Sesiones",
    minutes: "Minutos",
    wCoins: "WCoins",
    streak: "Racha",

    completed: "completadas",
    breathed: "respirados",
    earned: "ganadas",
    weekly: "semanal",

    breathingScore: "Puntuación de respiración",
    breathingScoreSubtitle:
      "Puntuación general de bienestar respiratorio",

    breathingLevel: "NIVEL DE RESPIRACIÓN",
    calmMaster: "Maestro de la calma",
    level: "Nv.",

    sessionsCompleted:
      "{count} sesiones completadas",

    currentStreak: "Racha actual",
    consecutiveSessions:
      "Sesiones consecutivas",

    bestSession: "Mejor sesión",

    bestSessionEmpty:
      "Completa una sesión de respiración para desbloquear tu mejor sesión.",

    achievements: "Logros",

    firstBreath: "Primera respiración",
    mindfulWalker: "Caminante consciente",
    streakBuilder: "Creador de rachas",
    calmMasterBadge: "Maestro de la calma",

    unlocked: "Desbloqueado",
    locked: "Bloqueado",

    recentHistory: "Historial reciente",

    noHistory:
      "Aún no hay sesiones de respiración registradas.",

    dailyChallenges: "Desafíos diarios",

    resetAnalytics: "Restablecer análisis",

    resetTitle: "Restablecer análisis de respiración",

    resetMessage:
      "¿Seguro que deseas borrar tus análisis de respiración?",

    cancel: "Cancelar",
    reset: "Restablecer",

    minuteShort: "min",

    wCoinsEarned: "WCoins",

    challengeProgress: "Progreso",

    reward: "Recompensa",

    loading: "Cargando análisis de respiración…",

    loadError:
      "No se pudieron cargar los análisis de respiración.",

    resetError:
      "No se pudieron restablecer los análisis de respiración.",
  },


  fr: {
    back: "Retour",

    kicker: "ANALYSE RESPIRATOIRE",
    title: "Votre progression vers le calme",

    subtitle:
      "Suivez vos séances terminées, minutes de respiration, récompenses, séries et progression vers le calme.",

    sessions: "Séances",
    minutes: "Minutes",
    wCoins: "WCoins",
    streak: "Série",

    completed: "terminées",
    breathed: "respirées",
    earned: "gagnés",
    weekly: "hebdomadaire",

    breathingScore: "Score de respiration",
    breathingScoreSubtitle:
      "Score global de bien-être respiratoire",

    breathingLevel: "NIVEAU DE RESPIRATION",
    calmMaster: "Maître du calme",
    level: "Niv.",

    sessionsCompleted:
      "{count} séances terminées",

    currentStreak: "Série actuelle",
    consecutiveSessions:
      "Séances consécutives",

    bestSession: "Meilleure séance",

    bestSessionEmpty:
      "Terminez une séance de respiration pour débloquer votre meilleure séance.",

    achievements: "Réussites",

    firstBreath: "Premier souffle",
    mindfulWalker: "Marcheur conscient",
    streakBuilder: "Créateur de séries",
    calmMasterBadge: "Maître du calme",

    unlocked: "Débloqué",
    locked: "Verrouillé",

    recentHistory: "Historique récent",

    noHistory:
      "Aucune séance de respiration enregistrée pour le moment.",

    dailyChallenges: "Défis quotidiens",

    resetAnalytics: "Réinitialiser les analyses",

    resetTitle: "Réinitialiser les analyses respiratoires",

    resetMessage:
      "Voulez-vous vraiment effacer vos analyses respiratoires ?",

    cancel: "Annuler",
    reset: "Réinitialiser",

    minuteShort: "min",

    wCoinsEarned: "WCoins",

    challengeProgress: "Progression",

    reward: "Récompense",

    loading: "Chargement des analyses respiratoires…",

    loadError:
      "Impossible de charger les analyses respiratoires.",

    resetError:
      "Impossible de réinitialiser les analyses respiratoires.",
  },


  de: {
    back: "Zurück",

    kicker: "ATEMANALYSE",
    title: "Dein Ruhefortschritt",

    subtitle:
      "Verfolge abgeschlossene Sitzungen, Atemminuten, Belohnungen, Serien und deinen Fortschritt zur inneren Ruhe.",

    sessions: "Sitzungen",
    minutes: "Minuten",
    wCoins: "WCoins",
    streak: "Serie",

    completed: "abgeschlossen",
    breathed: "geatmet",
    earned: "verdient",
    weekly: "wöchentlich",

    breathingScore: "Atembewertung",
    breathingScoreSubtitle:
      "Gesamtbewertung des Atemwohlbefindens",

    breathingLevel: "ATEMLEVEL",
    calmMaster: "Meister der Ruhe",
    level: "Lv.",

    sessionsCompleted:
      "{count} Sitzungen abgeschlossen",

    currentStreak: "Aktuelle Serie",
    consecutiveSessions:
      "Sitzungen in Folge",

    bestSession: "Beste Sitzung",

    bestSessionEmpty:
      "Schließe eine Atemsitzung ab, um deine beste Sitzung freizuschalten.",

    achievements: "Erfolge",

    firstBreath: "Erster Atemzug",
    mindfulWalker: "Achtsamer Wanderer",
    streakBuilder: "Serienmeister",
    calmMasterBadge: "Meister der Ruhe",

    unlocked: "Freigeschaltet",
    locked: "Gesperrt",

    recentHistory: "Letzte Aktivitäten",

    noHistory:
      "Noch keine Atemsitzungen aufgezeichnet.",

    dailyChallenges: "Tägliche Herausforderungen",

    resetAnalytics: "Analyse zurücksetzen",

    resetTitle: "Atemanalyse zurücksetzen",

    resetMessage:
      "Möchtest du deine Atemanalyse wirklich löschen?",

    cancel: "Abbrechen",
    reset: "Zurücksetzen",

    minuteShort: "Min.",

    wCoinsEarned: "WCoins",

    challengeProgress: "Fortschritt",

    reward: "Belohnung",

    loading: "Atemanalyse wird geladen…",

    loadError:
      "Atemanalyse konnte nicht geladen werden.",

    resetError:
      "Atemanalyse konnte nicht zurückgesetzt werden.",
  },


  pt: {
    back: "Voltar",

    kicker: "ANÁLISE DE RESPIRAÇÃO",
    title: "Seu progresso de calma",

    subtitle:
      "Acompanhe sessões concluídas, minutos de respiração, recompensas, sequências e seu progresso de calma.",

    sessions: "Sessões",
    minutes: "Minutos",
    wCoins: "WCoins",
    streak: "Sequência",

    completed: "concluídas",
    breathed: "respirados",
    earned: "ganhos",
    weekly: "semanal",

    breathingScore: "Pontuação de respiração",
    breathingScoreSubtitle:
      "Pontuação geral de bem-estar respiratório",

    breathingLevel: "NÍVEL DE RESPIRAÇÃO",
    calmMaster: "Mestre da calma",
    level: "Nv.",

    sessionsCompleted:
      "{count} sessões concluídas",

    currentStreak: "Sequência atual",
    consecutiveSessions:
      "Sessões consecutivas",

    bestSession: "Melhor sessão",

    bestSessionEmpty:
      "Conclua uma sessão de respiração para desbloquear sua melhor sessão.",

    achievements: "Conquistas",

    firstBreath: "Primeira respiração",
    mindfulWalker: "Caminhante consciente",
    streakBuilder: "Construtor de sequência",
    calmMasterBadge: "Mestre da calma",

    unlocked: "Desbloqueado",
    locked: "Bloqueado",

    recentHistory: "Histórico recente",

    noHistory:
      "Nenhuma sessão de respiração registrada ainda.",

    dailyChallenges: "Desafios diários",

    resetAnalytics: "Redefinir análises",

    resetTitle: "Redefinir análise de respiração",

    resetMessage:
      "Tem certeza de que deseja apagar sua análise de respiração?",

    cancel: "Cancelar",
    reset: "Redefinir",

    minuteShort: "min",

    wCoinsEarned: "WCoins",

    challengeProgress: "Progresso",

    reward: "Recompensa",

    loading: "Carregando análise de respiração…",

    loadError:
      "Não foi possível carregar a análise de respiração.",

    resetError:
      "Não foi possível redefinir a análise de respiração.",
  },


  ja: {
    back: "戻る",

    kicker: "呼吸分析",
    title: "心の落ち着きの進歩",

    subtitle:
      "完了したセッション、呼吸時間、報酬、連続記録、心の落ち着きの進歩を確認できます。",

    sessions: "セッション",
    minutes: "分",
    wCoins: "WCoins",
    streak: "連続記録",

    completed: "完了",
    breathed: "呼吸",
    earned: "獲得",
    weekly: "週間",

    breathingScore: "呼吸スコア",
    breathingScoreSubtitle:
      "総合的な呼吸ウェルネススコア",

    breathingLevel: "呼吸レベル",
    calmMaster: "カームマスター",
    level: "Lv.",

    sessionsCompleted:
      "{count} セッション完了",

    currentStreak: "現在の連続記録",
    consecutiveSessions:
      "連続セッション",

    bestSession: "ベストセッション",

    bestSessionEmpty:
      "呼吸セッションを完了するとベストセッションが表示されます。",

    achievements: "実績",

    firstBreath: "最初の呼吸",
    mindfulWalker: "マインドフルウォーカー",
    streakBuilder: "連続記録ビルダー",
    calmMasterBadge: "カームマスター",

    unlocked: "解除済み",
    locked: "ロック中",

    recentHistory: "最近の履歴",

    noHistory:
      "呼吸セッションはまだ記録されていません。",

    dailyChallenges: "デイリーチャレンジ",

    resetAnalytics: "分析をリセット",

    resetTitle: "呼吸分析をリセット",

    resetMessage:
      "呼吸分析データを消去しますか？",

    cancel: "キャンセル",
    reset: "リセット",

    minuteShort: "分",

    wCoinsEarned: "WCoins",

    challengeProgress: "進捗",

    reward: "報酬",

    loading: "呼吸分析を読み込み中…",

    loadError:
      "呼吸分析を読み込めませんでした。",

    resetError:
      "呼吸分析をリセットできませんでした。",
  },


  ko: {
    back: "뒤로",

    kicker: "호흡 분석",
    title: "마음의 안정 진행",

    subtitle:
      "완료한 세션, 호흡 시간, 보상, 연속 기록 및 마음의 안정 진행 상황을 확인하세요.",

    sessions: "세션",
    minutes: "분",
    wCoins: "WCoins",
    streak: "연속 기록",

    completed: "완료",
    breathed: "호흡",
    earned: "획득",
    weekly: "주간",

    breathingScore: "호흡 점수",
    breathingScoreSubtitle:
      "전체 호흡 웰니스 점수",

    breathingLevel: "호흡 레벨",
    calmMaster: "평온 마스터",
    level: "Lv.",

    sessionsCompleted:
      "{count}개 세션 완료",

    currentStreak: "현재 연속 기록",
    consecutiveSessions:
      "연속 세션",

    bestSession: "최고 세션",

    bestSessionEmpty:
      "호흡 세션을 완료하면 최고 세션이 표시됩니다.",

    achievements: "업적",

    firstBreath: "첫 호흡",
    mindfulWalker: "마음챙김 워커",
    streakBuilder: "연속 기록 달성자",
    calmMasterBadge: "평온 마스터",

    unlocked: "잠금 해제",
    locked: "잠김",

    recentHistory: "최근 기록",

    noHistory:
      "아직 기록된 호흡 세션이 없습니다.",

    dailyChallenges: "일일 도전",

    resetAnalytics: "분석 초기화",

    resetTitle: "호흡 분석 초기화",

    resetMessage:
      "호흡 분석 데이터를 삭제하시겠습니까?",

    cancel: "취소",
    reset: "초기화",

    minuteShort: "분",

    wCoinsEarned: "WCoins",

    challengeProgress: "진행",

    reward: "보상",

    loading: "호흡 분석 불러오는 중…",

    loadError:
      "호흡 분석을 불러올 수 없습니다.",

    resetError:
      "호흡 분석을 초기화할 수 없습니다.",
  },


  zh: {
    back: "返回",

    kicker: "呼吸分析",
    title: "你的平静进度",

    subtitle:
      "追踪已完成的呼吸训练、呼吸分钟数、奖励、连续记录和平静进度。",

    sessions: "训练次数",
    minutes: "分钟",
    wCoins: "WCoins",
    streak: "连续记录",

    completed: "已完成",
    breathed: "呼吸",
    earned: "已获得",
    weekly: "每周",

    breathingScore: "呼吸评分",
    breathingScoreSubtitle:
      "整体呼吸健康评分",

    breathingLevel: "呼吸等级",
    calmMaster: "平静大师",
    level: "等级",

    sessionsCompleted:
      "已完成 {count} 次训练",

    currentStreak: "当前连续记录",
    consecutiveSessions:
      "连续训练",

    bestSession: "最佳训练",

    bestSessionEmpty:
      "完成一次呼吸训练即可解锁最佳训练记录。",

    achievements: "成就",

    firstBreath: "第一次呼吸",
    mindfulWalker: "正念步行者",
    streakBuilder: "连续记录达人",
    calmMasterBadge: "平静大师",

    unlocked: "已解锁",
    locked: "已锁定",

    recentHistory: "最近记录",

    noHistory:
      "目前还没有呼吸训练记录。",

    dailyChallenges: "每日挑战",

    resetAnalytics: "重置分析",

    resetTitle: "重置呼吸分析",

    resetMessage:
      "确定要清除你的呼吸分析数据吗？",

    cancel: "取消",
    reset: "重置",

    minuteShort: "分钟",

    wCoinsEarned: "WCoins",

    challengeProgress: "进度",

    reward: "奖励",

    loading: "正在加载呼吸分析…",

    loadError:
      "无法加载呼吸分析。",

    resetError:
      "无法重置呼吸分析。",
  },


  it: {
    back: "Indietro",

    kicker: "ANALISI DELLA RESPIRAZIONE",
    title: "I tuoi progressi nella calma",

    subtitle:
      "Monitora sessioni completate, minuti di respirazione, ricompense, serie e progressi verso la calma.",

    sessions: "Sessioni",
    minutes: "Minuti",
    wCoins: "WCoins",
    streak: "Serie",

    completed: "completate",
    breathed: "respirati",
    earned: "guadagnati",
    weekly: "settimanale",

    breathingScore: "Punteggio respirazione",
    breathingScoreSubtitle:
      "Punteggio complessivo del benessere respiratorio",

    breathingLevel: "LIVELLO RESPIRAZIONE",
    calmMaster: "Maestro della calma",
    level: "Liv.",

    sessionsCompleted:
      "{count} sessioni completate",

    currentStreak: "Serie attuale",
    consecutiveSessions:
      "Sessioni consecutive",

    bestSession: "Migliore sessione",

    bestSessionEmpty:
      "Completa una sessione di respirazione per sbloccare la tua migliore sessione.",

    achievements: "Traguardi",

    firstBreath: "Primo respiro",
    mindfulWalker: "Camminatore consapevole",
    streakBuilder: "Costruttore di serie",
    calmMasterBadge: "Maestro della calma",

    unlocked: "Sbloccato",
    locked: "Bloccato",

    recentHistory: "Cronologia recente",

    noHistory:
      "Nessuna sessione di respirazione registrata.",

    dailyChallenges: "Sfide giornaliere",

    resetAnalytics: "Reimposta analisi",

    resetTitle: "Reimposta analisi respirazione",

    resetMessage:
      "Vuoi davvero cancellare i dati dell'analisi respiratoria?",

    cancel: "Annulla",
    reset: "Reimposta",

    minuteShort: "min",

    wCoinsEarned: "WCoins",

    challengeProgress: "Progresso",

    reward: "Ricompensa",

    loading: "Caricamento analisi respiratoria…",

    loadError:
      "Impossibile caricare l'analisi respiratoria.",

    resetError:
      "Impossibile reimpostare l'analisi respiratoria.",
  },


  ar: {
    back: "رجوع",

    kicker: "تحليلات التنفس",
    title: "تقدمك نحو الهدوء",

    subtitle:
      "تابع جلسات التنفس المكتملة ودقائق التنفس والمكافآت والاستمرارية وتقدمك نحو الهدوء.",

    sessions: "الجلسات",
    minutes: "الدقائق",
    wCoins: "WCoins",
    streak: "الاستمرارية",

    completed: "مكتملة",
    breathed: "تنفس",
    earned: "مكتسبة",
    weekly: "أسبوعي",

    breathingScore: "درجة التنفس",
    breathingScoreSubtitle:
      "درجة العافية العامة للتنفس",

    breathingLevel: "مستوى التنفس",
    calmMaster: "خبير الهدوء",
    level: "المستوى",

    sessionsCompleted:
      "{count} جلسات مكتملة",

    currentStreak: "الاستمرارية الحالية",
    consecutiveSessions:
      "جلسات متتالية",

    bestSession: "أفضل جلسة",

    bestSessionEmpty:
      "أكمل جلسة تنفس لفتح أفضل جلسة لديك.",

    achievements: "الإنجازات",

    firstBreath: "النفس الأول",
    mindfulWalker: "المشي الواعي",
    streakBuilder: "باني الاستمرارية",
    calmMasterBadge: "خبير الهدوء",

    unlocked: "مفتوح",
    locked: "مغلق",

    recentHistory: "السجل الأخير",

    noHistory:
      "لا توجد جلسات تنفس مسجلة حتى الآن.",

    dailyChallenges: "التحديات اليومية",

    resetAnalytics: "إعادة ضبط التحليلات",

    resetTitle: "إعادة ضبط تحليلات التنفس",

    resetMessage:
      "هل أنت متأكد من أنك تريد مسح بيانات تحليلات التنفس؟",

    cancel: "إلغاء",
    reset: "إعادة ضبط",

    minuteShort: "دقيقة",

    wCoinsEarned: "WCoins",

    challengeProgress: "التقدم",

    reward: "المكافأة",

    loading: "جارٍ تحميل تحليلات التنفس…",

    loadError:
      "تعذر تحميل تحليلات التنفس.",

    resetError:
      "تعذر إعادة ضبط تحليلات التنفس.",
  },
};


// ============================================================
// TRANSLATION HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase();

  return TEXT[code] ? code : "en";
}


function fillTemplate(text, values = {}) {
  let result = String(text || "");

  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(
      new RegExp(`\\{${key}\\}`, "g"),
      String(value)
    );
  });

  return result;
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function BreathingAnalyticsScreen({
  goBack,
  language = "en",
}) {
  const currentLanguage =
    normalizeLanguage(language);

  const t = (key, values = {}) => {
    const value =
      TEXT[currentLanguage]?.[key] ??
      TEXT.en?.[key] ??
      key;

    return fillTemplate(value, values);
  };


  // ==========================================================
  // STATE
  // ==========================================================

  const [analytics, setAnalytics] = useState({
    sessionsCompleted: 0,
    minutesBreathed: 0,
    coinsEarned: 0,
    weeklyStreak: 0,
    bestSession: null,
    history: [],
  });

  const [loading, setLoading] = useState(true);


  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
    try {
      setLoading(true);

      const data =
        await loadBreathingAnalytics();

      setAnalytics({
        sessionsCompleted:
          Number(data?.sessionsCompleted) || 0,

        minutesBreathed:
          Number(data?.minutesBreathed) || 0,

        coinsEarned:
          Number(data?.coinsEarned) || 0,

        weeklyStreak:
          Number(data?.weeklyStreak) || 0,

        bestSession:
          data?.bestSession || null,

        history:
          Array.isArray(data?.history)
            ? data.history
            : [],
      });
    } catch (error) {
      console.log(
        "Breathing analytics load error:",
        error
      );

      Alert.alert(
        "Legathon Walk",
        t("loadError")
      );
    } finally {
      setLoading(false);
    }
  }


  // ==========================================================
  // RESET
  // ==========================================================

  async function performReset() {
    try {
      const reset =
        await resetBreathingAnalytics();

      setAnalytics({
        sessionsCompleted:
          Number(reset?.sessionsCompleted) || 0,

        minutesBreathed:
          Number(reset?.minutesBreathed) || 0,

        coinsEarned:
          Number(reset?.coinsEarned) || 0,

        weeklyStreak:
          Number(reset?.weeklyStreak) || 0,

        bestSession:
          reset?.bestSession || null,

        history:
          Array.isArray(reset?.history)
            ? reset.history
            : [],
      });
    } catch (error) {
      console.log(
        "Breathing analytics reset error:",
        error
      );

      Alert.alert(
        "Legathon Walk",
        t("resetError")
      );
    }
  }


  function handleReset() {
    Alert.alert(
      t("resetTitle"),
      t("resetMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("reset"),
          style: "destructive",
          onPress: performReset,
        },
      ]
    );
  }


  // ==========================================================
  // CHALLENGES
  // ==========================================================

  const challenges = useMemo(() => {
    try {
      return (
        getBreathingChallenges(
          analytics
        ) || []
      );
    } catch (error) {
      console.log(
        "Breathing challenge error:",
        error
      );

      return [];
    }
  }, [analytics]);


  // ==========================================================
  // ACHIEVEMENTS
  // ==========================================================

  // Keep this calculation because your existing achievement
  // utility may use it elsewhere now or later.

  const achievements = useMemo(() => {
    try {
      return (
        getBreathingAchievements({
          totalSessions:
            analytics.sessionsCompleted,

          totalMinutes:
            analytics.minutesBreathed,

          streak:
            analytics.weeklyStreak,
        }) || []
      );
    } catch (error) {
      console.log(
        "Breathing achievement error:",
        error
      );

      return [];
    }
  }, [analytics]);


  // Prevent lint from treating the utility result as accidental.
  void achievements;


  // ==========================================================
  // BREATHING SCORE
  // ==========================================================

  const breathingScore = Math.min(
    Math.max(
      Math.round(
        analytics.sessionsCompleted * 5 +
          analytics.minutesBreathed * 0.5 +
          analytics.weeklyStreak * 10
      ),
      0
    ),
    100
  );


  // ==========================================================
  // BREATHING LEVEL
  // ==========================================================

  const breathingLevel =
    Math.floor(
      analytics.sessionsCompleted / 5
    ) + 1;


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ==================================================
            BACK
        ================================================== */}

        {goBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.82}
          >
            <Text style={styles.backText}>
              ‹ {t("back")}
            </Text>
          </TouchableOpacity>
        ) : null}


        {/* ==================================================
            HEADER
        ================================================== */}

        <Text
          style={styles.kicker}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {t("kicker")}
        </Text>

        <Text
          style={styles.title}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {t("title")}
        </Text>

        <Text style={styles.subtitle}>
          {t("subtitle")}
        </Text>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>
              {t("loading")}
            </Text>
          </View>
        ) : null}


        {/* ==================================================
            STATS
        ================================================== */}

        <View style={styles.grid}>
          <StatCard
            label={t("sessions")}
            value={analytics.sessionsCompleted}
            sub={t("completed")}
          />

          <StatCard
            label={t("minutes")}
            value={analytics.minutesBreathed}
            sub={t("breathed")}
          />

          <StatCard
            label={t("wCoins")}
            value={analytics.coinsEarned}
            sub={t("earned")}
          />

          <StatCard
            label={t("streak")}
            value={analytics.weeklyStreak}
            sub={t("weekly")}
          />
        </View>


        {/* ==================================================
            SCORE
        ================================================== */}

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text
              style={styles.scoreTitle}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {t("breathingScore")}
            </Text>

            <Text style={styles.scorePercent}>
              {breathingScore}%
            </Text>
          </View>

          <View style={styles.scoreTrack}>
            <View
              style={[
                styles.scoreFill,
                {
                  width: `${breathingScore}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.scoreSubtitle}>
            {t("breathingScoreSubtitle")}
          </Text>
        </View>


        {/* ==================================================
            LEVEL
        ================================================== */}

        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>
            {t("breathingLevel")}
          </Text>

          <Text
            style={styles.levelTitle}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {t("calmMaster")}{" "}
            {t("level")}
            {breathingLevel}
          </Text>

          <Text style={styles.levelMeta}>
            {t("sessionsCompleted", {
              count:
                analytics.sessionsCompleted,
            })}
          </Text>
        </View>


        {/* ==================================================
            STREAK
        ================================================== */}

        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>
            {t("currentStreak")}
          </Text>

          <Text style={styles.streakNumber}>
            {analytics.weeklyStreak}
          </Text>

          <Text style={styles.streakLabel}>
            {t("consecutiveSessions")}
          </Text>
        </View>


        {/* ==================================================
            BEST SESSION
        ================================================== */}

        <View style={styles.bestCard}>
          <Text style={styles.sectionTitle}>
            {t("bestSession")}
          </Text>

          {analytics.bestSession ? (
            <>
              <Text style={styles.bestTitle}>
                {analytics.bestSession.title}
              </Text>

              <Text style={styles.bestMeta}>
                {analytics.bestSession.minutes}{" "}
                {t("minuteShort")} • +
                {analytics.bestSession.reward}{" "}
                {t("wCoinsEarned")}
              </Text>
            </>
          ) : (
            <Text style={styles.emptyText}>
              {t("bestSessionEmpty")}
            </Text>
          )}
        </View>


        {/* ==================================================
            ACHIEVEMENTS
        ================================================== */}

        <Text style={styles.sectionTitle}>
          {t("achievements")}
        </Text>

        <View style={styles.badgeGrid}>
          <Badge
            unlocked={
              analytics.sessionsCompleted >= 1
            }
            icon="🌱"
            title={t("firstBreath")}
            unlockedText={t("unlocked")}
            lockedText={t("locked")}
          />

          <Badge
            unlocked={
              analytics.sessionsCompleted >= 10
            }
            icon="🧘"
            title={t("mindfulWalker")}
            unlockedText={t("unlocked")}
            lockedText={t("locked")}
          />

          <Badge
            unlocked={
              analytics.sessionsCompleted >= 25
            }
            icon="🔥"
            title={t("streakBuilder")}
            unlockedText={t("unlocked")}
            lockedText={t("locked")}
          />

          <Badge
            unlocked={
              analytics.sessionsCompleted >= 50
            }
            icon="👑"
            title={t("calmMasterBadge")}
            unlockedText={t("unlocked")}
            lockedText={t("locked")}
          />
        </View>


        {/* ==================================================
            HISTORY
        ================================================== */}

        <Text style={styles.sectionTitle}>
          {t("recentHistory")}
        </Text>

        {(analytics.history || []).length ===
        0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {t("noHistory")}
            </Text>
          </View>
        ) : (
          analytics.history.map(
            (item, index) => (
              <View
                key={
                  item?.id ||
                  `breathing-history-${index}`
                }
                style={styles.historyCard}
              >
                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>
                    {item?.title || ""}
                  </Text>

                  <Text style={styles.historyMeta}>
                    {Number(item?.minutes) || 0}{" "}
                    {t("minuteShort")}
                    {item?.pattern
                      ? ` • ${item.pattern}`
                      : ""}
                  </Text>
                </View>

                <Text style={styles.historyCoins}>
                  +{Number(item?.reward) || 0}
                </Text>
              </View>
            )
          )
        )}


        {/* ==================================================
            DAILY CHALLENGES
        ================================================== */}

        <Text style={styles.sectionTitle}>
          {t("dailyChallenges")}
        </Text>

        {challenges.map(
          (item, index) => (
            <View
              key={
                item?.id ||
                `breathing-challenge-${index}`
              }
              style={styles.challengeCard}
            >
              <Text style={styles.challengeTitle}>
                {item?.title || ""}
              </Text>

              <Text style={styles.challengeGoal}>
                {item?.goal || ""}
              </Text>

              <Text style={styles.challengeLabel}>
                {t("challengeProgress")}
              </Text>

              <Text style={styles.challengeProgress}>
                {Number(item?.progress) || 0}/
                {Number(item?.target) || 0}
              </Text>

              <Text style={styles.challengeReward}>
                +{Number(item?.reward) || 0}{" "}
                {t("wCoinsEarned")}
              </Text>
            </View>
          )
        )}


        {/* ==================================================
            RESET
        ================================================== */}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.82}
        >
          <Text style={styles.resetText}>
            {t("resetAnalytics")}
          </Text>
        </TouchableOpacity>


        <View style={styles.bottomSpace} />

      </ScrollView>
    </View>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  sub,
}) {
  return (
    <View style={styles.statCard}>
      <Text
        style={styles.statLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {label}
      </Text>

      <Text style={styles.statValue}>
        {Number(value || 0).toLocaleString()}
      </Text>

      <Text
        style={styles.statSub}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {sub}
      </Text>
    </View>
  );
}


// ============================================================
// BADGE
// ============================================================

function Badge({
  icon,
  title,
  unlocked,
  unlockedText,
  lockedText,
}) {
  return (
    <View
      style={[
        styles.badgeCard,
        !unlocked &&
          styles.badgeLocked,
      ]}
    >
      <Text style={styles.badgeIcon}>
        {icon}
      </Text>

      <Text
        style={styles.badgeTitle}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {title}
      </Text>

      <Text style={styles.badgeStatus}>
        {unlocked
          ? unlockedText
          : lockedText}
      </Text>
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
    paddingTop: 90,
    paddingBottom: 190,
  },


  // ----------------------------------------------------------
  // BACK
  // ----------------------------------------------------------

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 26,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
  },


  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  kicker: {
    color: "#A7FFD0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 40,
    lineHeight: 47,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    color: "#B8C0D4",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 26,
  },


  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  loadingCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },

  loadingText: {
    color: "#A7FFD0",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },


  // ----------------------------------------------------------
  // STATS
  // ----------------------------------------------------------

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    minHeight: 135,
    justifyContent: "center",
  },

  statLabel: {
    color: "#B8C0D4",
    fontSize: 17,
    fontWeight: "900",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 10,
  },

  statSub: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },


  // ----------------------------------------------------------
  // SCORE
  // ----------------------------------------------------------

  scoreCard: {
    backgroundColor: "#0D1626",
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#263A5A",
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  scoreTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  scorePercent: {
    color: "#A7FFD0",
    fontSize: 24,
    fontWeight: "900",
  },

  scoreTrack: {
    height: 16,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#1C2740",
  },

  scoreFill: {
    height: "100%",
    backgroundColor: "#A7FFD0",
  },

  scoreSubtitle: {
    color: "#B8C0D4",
    marginTop: 12,
    fontWeight: "800",
  },


  // ----------------------------------------------------------
  // LEVEL
  // ----------------------------------------------------------

  levelCard: {
    backgroundColor: "#0D1626",
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  levelLabel: {
    color: "#D4AF37",
    fontWeight: "900",
    letterSpacing: 2,
  },

  levelTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "900",
    marginTop: 10,
  },

  levelMeta: {
    color: "#B8C0D4",
    marginTop: 6,
    fontWeight: "800",
  },


  // ----------------------------------------------------------
  // STREAK
  // ----------------------------------------------------------

  streakCard: {
    backgroundColor:
      "rgba(212,175,55,0.12)",

    borderColor: "#D4AF37",
    borderWidth: 1,
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  streakTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  streakNumber: {
    color: "#D4AF37",
    fontSize: 60,
    fontWeight: "900",
  },

  streakLabel: {
    color: "#B8C0D4",
    fontWeight: "800",
    textAlign: "center",
  },


  // ----------------------------------------------------------
  // BEST SESSION
  // ----------------------------------------------------------

  bestCard: {
    backgroundColor:
      "rgba(167,255,208,0.10)",

    borderColor: "#A7FFD0",
    borderWidth: 1,
    borderRadius: 26,
    padding: 22,
    marginBottom: 26,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 14,
  },

  bestTitle: {
    color: "#A7FFD0",
    fontSize: 25,
    fontWeight: "900",
  },

  bestMeta: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },


  // ----------------------------------------------------------
  // BADGES
  // ----------------------------------------------------------

  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  badgeCard: {
    width: "48%",
    backgroundColor: "#0D1626",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#263A5A",
    minHeight: 160,
  },

  badgeLocked: {
    opacity: 0.35,
  },

  badgeIcon: {
    fontSize: 34,
  },

  badgeTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },

  badgeStatus: {
    color: "#D4AF37",
    fontWeight: "900",
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },


  // ----------------------------------------------------------
  // EMPTY
  // ----------------------------------------------------------

  emptyCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },

  emptyText: {
    color: "#B8C0D4",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },


  // ----------------------------------------------------------
  // HISTORY
  // ----------------------------------------------------------

  historyCard: {
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

  historyContent: {
    flex: 1,
    paddingRight: 12,
  },

  historyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  historyMeta: {
    color: "#B8C0D4",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 5,
  },

  historyCoins: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },


  // ----------------------------------------------------------
  // CHALLENGES
  // ----------------------------------------------------------

  challengeCard: {
    backgroundColor: "#0D1626",
    borderWidth: 1,
    borderColor: "#263A5A",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  challengeGoal: {
    color: "#B8C0D4",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 6,
  },

  challengeLabel: {
    color: "#7E8CA4",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 12,
    textTransform: "uppercase",
  },

  challengeProgress: {
    color: "#A7FFD0",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3,
  },

  challengeReward: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },


  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

  resetButton: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 14,
  },

  resetText: {
    color: "#FF6B6B",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  bottomSpace: {
    height: 170,
  },
});