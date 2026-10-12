
 // screens/ProfileScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  AppState,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { avatarOptions } from "../data/avatarOptions";

import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";

import {
  getCurrentAvatarSuit,
} from "../utils/avatarWardrobeStorage";

import {
  getJourneyTranslation,
} from "../i18n/journeyTranslations";

import JOURNEY_CATALOG from "../data/journeyCatalog";

import useLegathonPoints from "../hooks/useLegathonPoints";

// ============================================================
// LEGATHON WALK - PROFILE SCREEN
//
// PROFILE:
// - Avatar and tracksuit
// - Walking statistics
// - Legathon Points
// - Rank progression
// - Favorite Journey
// - Journey Timeline
// - Public Profile Highlights
//
// REMOVED:
// - Passport Collection
// - Medal Collection
// - Achievement Badge Wall
// - Favorite Passport
// - Favorite Badge
// - Certificates
// ============================================================

// ============================================================
// COLORS AND ASSETS
// ============================================================

const GOLD = "#DDB536";
const WHITE = "#FFFFFF";
const NAVY = "#071427";
const MUTED = "#AAB7CC";

const COLLAGE_BG = require(
  "../assets/collage-background.png"
);

const STEPS_PER_MILE = 2000;

const PROGRESS_KEY = "journeyProgressData";
const ACTIVE_JOURNEY_KEY = "activeJourney";

// ============================================================
// TRANSLATIONS
// ============================================================

const PROFILE_TEXT = {
  en: {
    profileTitle: "Legathon Profile",
    profileSubtitle: "Your walking Legathon in one place",
    identity: "YOUR LEGATHON IDENTITY",
    points: "Legathon Points",
    openAvatar: "Open Avatar Center",
    performance: "Performance",
    walking: "WALKING LEGATHON",
    steps: "Lifetime Steps",
    miles: "Miles",
    journeys: "Journeys",
    completed: "Completed",
    stamps: "Stamps",
    streak: "Day Streak",
    journeyIdentity: "JOURNEY IDENTITY",
    favoriteJourney: "Favorite Journey",
    noFavorite: "No Favorite Yet",
    progress: "{percent}% Complete",
    history: "Journey Timeline",
    historyLabel: "JOURNEY HISTORY",
    historyEmpty: "Complete your first journey to begin your Legathon timeline.",
    rank: "Legathon Rank",
    rankLabel: "YOUR ASCENT",
    current: "CURRENT",
    showcase: "LEGATHON SHOWCASE",
    highlights: "Public Profile Highlights",
    avatar: "Avatar",
    outfit: "Outfit",
    journey: "Favorite Journey",
    footerTitle: "Keep Building Your Journey",
    footer: "Every step and completed Journey adds another chapter to your walking story.",
    loading: "Updating profile...",
  },

  es: {
    profileTitle: "Perfil Legathon",
    profileSubtitle: "Toda tu experiencia Legathon en un solo lugar",
    identity: "TU IDENTIDAD LEGATHON",
    points: "Puntos Legathon",
    openAvatar: "Abrir Centro de Avatar",
    performance: "Rendimiento",
    walking: "CAMINATA LEGATHON",
    steps: "Pasos Totales",
    miles: "Millas",
    journeys: "Viajes",
    completed: "Completados",
    stamps: "Sellos",
    streak: "Racha de Días",
    journeyIdentity: "IDENTIDAD DEL VIAJE",
    favoriteJourney: "Viaje Favorito",
    noFavorite: "Sin Favorito",
    progress: "{percent}% Completado",
    history: "Cronología de Viajes",
    historyLabel: "HISTORIAL DE VIAJES",
    historyEmpty: "Completa tu primer viaje para comenzar tu cronología.",
    rank: "Rango Legathon",
    rankLabel: "TU ASCENSO",
    current: "ACTUAL",
    showcase: "EXHIBICIÓN LEGATHON",
    highlights: "Aspectos Destacados del Perfil",
    avatar: "Avatar",
    outfit: "Atuendo",
    journey: "Viaje Favorito",
    footerTitle: "Sigue Construyendo Tu Viaje",
    footer: "Cada paso y viaje completado añade otro capítulo a tu historia.",
    loading: "Actualizando perfil...",
  },

  fr: {
    profileTitle: "Profil Legathon",
    profileSubtitle: "Toute votre expérience Legathon au même endroit",
    identity: "VOTRE IDENTITÉ LEGATHON",
    points: "Points Legathon",
    openAvatar: "Ouvrir le Centre Avatar",
    performance: "Performance",
    walking: "LEGATHON DE MARCHE",
    steps: "Pas Totaux",
    miles: "Miles",
    journeys: "Voyages",
    completed: "Terminés",
    stamps: "Tampons",
    streak: "Série de Jours",
    journeyIdentity: "IDENTITÉ DU VOYAGE",
    favoriteJourney: "Voyage Favori",
    noFavorite: "Aucun Favori",
    progress: "{percent}% Terminé",
    history: "Chronologie des Voyages",
    historyLabel: "HISTORIQUE DES VOYAGES",
    historyEmpty: "Terminez votre premier voyage pour commencer.",
    rank: "Rang Legathon",
    rankLabel: "VOTRE ASCENSION",
    current: "ACTUEL",
    showcase: "VITRINE LEGATHON",
    highlights: "Points Forts du Profil",
    avatar: "Avatar",
    outfit: "Tenue",
    journey: "Voyage Favori",
    footerTitle: "Continuez Votre Parcours",
    footer: "Chaque pas et voyage terminé enrichit votre histoire.",
    loading: "Mise à jour du profil...",
  },

  de: {
    profileTitle: "Legathon-Profil",
    profileSubtitle: "Dein gesamtes Legathon-Erlebnis an einem Ort",
    identity: "DEINE LEGATHON-IDENTITÄT",
    points: "Legathon-Punkte",
    openAvatar: "Avatar-Center Öffnen",
    performance: "Leistung",
    walking: "GEH-LEGATHON",
    steps: "Gesamtschritte",
    miles: "Meilen",
    journeys: "Reisen",
    completed: "Abgeschlossen",
    stamps: "Stempel",
    streak: "Tagesserie",
    journeyIdentity: "REISEIDENTITÄT",
    favoriteJourney: "Lieblingsreise",
    noFavorite: "Noch Kein Favorit",
    progress: "{percent}% Abgeschlossen",
    history: "Reise-Zeitleiste",
    historyLabel: "REISEVERLAUF",
    historyEmpty: "Schließe deine erste Reise ab, um zu beginnen.",
    rank: "Legathon-Rang",
    rankLabel: "DEIN AUFSTIEG",
    current: "AKTUELL",
    showcase: "LEGATHON-SHOWCASE",
    highlights: "Profil-Highlights",
    avatar: "Avatar",
    outfit: "Outfit",
    journey: "Lieblingsreise",
    footerTitle: "Setze Deine Reise Fort",
    footer: "Jeder Schritt und jede Reise erweitert deine Geschichte.",
    loading: "Profil wird aktualisiert...",
  },

  pt: {
    profileTitle: "Perfil Legathon",
    profileSubtitle: "Toda a sua experiência Legathon em um só lugar",
    identity: "SUA IDENTIDADE LEGATHON",
    points: "Pontos Legathon",
    openAvatar: "Abrir Central de Avatar",
    performance: "Desempenho",
    walking: "CAMINHADA LEGATHON",
    steps: "Passos Totais",
    miles: "Milhas",
    journeys: "Jornadas",
    completed: "Concluídas",
    stamps: "Carimbos",
    streak: "Sequência de Dias",
    journeyIdentity: "IDENTIDADE DA JORNADA",
    favoriteJourney: "Jornada Favorita",
    noFavorite: "Nenhuma Favorita",
    progress: "{percent}% Concluído",
    history: "Linha do Tempo",
    historyLabel: "HISTÓRICO DE JORNADAS",
    historyEmpty: "Conclua sua primeira jornada para começar.",
    rank: "Classificação Legathon",
    rankLabel: "SUA ASCENSÃO",
    current: "ATUAL",
    showcase: "VITRINE LEGATHON",
    highlights: "Destaques do Perfil",
    avatar: "Avatar",
    outfit: "Roupa",
    journey: "Jornada Favorita",
    footerTitle: "Continue Construindo Sua Jornada",
    footer: "Cada passo e jornada concluída amplia sua história.",
    loading: "Atualizando perfil...",
  },

  ja: {
    profileTitle: "Legathon プロフィール",
    profileSubtitle: "ウォーキング情報をひとつの場所で",
    identity: "LEGATHON アイデンティティ",
    points: "Legathonポイント",
    openAvatar: "アバターセンターを開く",
    performance: "パフォーマンス",
    walking: "ウォーキングLEGATHON",
    steps: "累計歩数",
    miles: "マイル",
    journeys: "ジャーニー",
    completed: "完了",
    stamps: "スタンプ",
    streak: "連続日数",
    journeyIdentity: "ジャーニー情報",
    favoriteJourney: "お気に入りジャーニー",
    noFavorite: "お気に入りなし",
    progress: "{percent}% 完了",
    history: "ジャーニー履歴",
    historyLabel: "ジャーニー履歴",
    historyEmpty: "最初のジャーニーを完了しましょう。",
    rank: "Legathonランク",
    rankLabel: "あなたのランク",
    current: "現在",
    showcase: "LEGATHONショーケース",
    highlights: "プロフィールのハイライト",
    avatar: "アバター",
    outfit: "ウェア",
    journey: "お気に入りジャーニー",
    footerTitle: "ジャーニーを続けよう",
    footer: "すべての一歩が物語になります。",
    loading: "プロフィールを更新中...",
  },

  ko: {
    profileTitle: "Legathon 프로필",
    profileSubtitle: "걷기 활동을 한곳에서 확인하세요",
    identity: "LEGATHON 아이덴티티",
    points: "Legathon 포인트",
    openAvatar: "아바타 센터 열기",
    performance: "활동 성과",
    walking: "걷기 LEGATHON",
    steps: "누적 걸음",
    miles: "마일",
    journeys: "여정",
    completed: "완료",
    stamps: "스탬프",
    streak: "연속 일수",
    journeyIdentity: "여정 정보",
    favoriteJourney: "즐겨찾는 여정",
    noFavorite: "즐겨찾기 없음",
    progress: "{percent}% 완료",
    history: "여정 타임라인",
    historyLabel: "여정 기록",
    historyEmpty: "첫 여정을 완료하면 기록이 시작됩니다.",
    rank: "Legathon 랭크",
    rankLabel: "나의 성장",
    current: "현재",
    showcase: "LEGATHON 쇼케이스",
    highlights: "프로필 하이라이트",
    avatar: "아바타",
    outfit: "의상",
    journey: "즐겨찾는 여정",
    footerTitle: "계속해서 여정을 만들어 가세요",
    footer: "모든 걸음이 이야기를 만듭니다.",
    loading: "프로필 업데이트 중...",
  },

  zh: {
    profileTitle: "Legathon 个人资料",
    profileSubtitle: "在一个页面查看步行成就",
    identity: "LEGATHON 身份",
    points: "Legathon积分",
    openAvatar: "打开头像中心",
    performance: "表现",
    walking: "步行LEGATHON",
    steps: "累计步数",
    miles: "英里",
    journeys: "旅程",
    completed: "已完成",
    stamps: "印章",
    streak: "连续天数",
    journeyIdentity: "旅程信息",
    favoriteJourney: "最喜欢的旅程",
    noFavorite: "暂无收藏",
    progress: "已完成 {percent}%",
    history: "旅程时间线",
    historyLabel: "旅程历史",
    historyEmpty: "完成第一次旅程即可开始记录。",
    rank: "Legathon等级",
    rankLabel: "你的成长",
    current: "当前",
    showcase: "LEGATHON展示",
    highlights: "公开个人资料亮点",
    avatar: "头像",
    outfit: "服装",
    journey: "最喜欢的旅程",
    footerTitle: "继续你的Legathon旅程",
    footer: "每一步都在书写你的故事。",
    loading: "正在更新资料...",
  },

  it: {
    profileTitle: "Profilo Legathon",
    profileSubtitle: "La tua esperienza Legathon in un unico posto",
    identity: "LA TUA IDENTITÀ LEGATHON",
    points: "Punti Legathon",
    openAvatar: "Apri Centro Avatar",
    performance: "Prestazioni",
    walking: "LEGATHON DI CAMMINATA",
    steps: "Passi Totali",
    miles: "Miglia",
    journeys: "Viaggi",
    completed: "Completati",
    stamps: "Timbri",
    streak: "Serie di Giorni",
    journeyIdentity: "IDENTITÀ DEL VIAGGIO",
    favoriteJourney: "Viaggio Preferito",
    noFavorite: "Nessun Preferito",
    progress: "{percent}% Completato",
    history: "Cronologia dei Viaggi",
    historyLabel: "STORIA DEI VIAGGI",
    historyEmpty: "Completa il tuo primo viaggio per iniziare.",
    rank: "Rango Legathon",
    rankLabel: "LA TUA ASCESA",
    current: "ATTUALE",
    showcase: "VETRINA LEGATHON",
    highlights: "Profilo Pubblico",
    avatar: "Avatar",
    outfit: "Completo",
    journey: "Viaggio Preferito",
    footerTitle: "Continua il Tuo Viaggio",
    footer: "Ogni passo e viaggio completato arricchisce la tua storia.",
    loading: "Aggiornamento profilo...",
  },

  ar: {
    profileTitle: "ملف Legathon",
    profileSubtitle: "كل إنجازات المشي في مكان واحد",
    identity: "هويتك في LEGATHON",
    points: "نقاط Legathon",
    openAvatar: "فتح مركز الشخصية",
    performance: "الأداء",
    walking: "LEGATHON للمشي",
    steps: "إجمالي الخطوات",
    miles: "الأميال",
    journeys: "الرحلات",
    completed: "مكتملة",
    stamps: "الأختام",
    streak: "سلسلة الأيام",
    journeyIdentity: "هوية الرحلة",
    favoriteJourney: "الرحلة المفضلة",
    noFavorite: "لا يوجد مفضل",
    progress: "مكتمل {percent}%",
    history: "الخط الزمني للرحلات",
    historyLabel: "سجل الرحلات",
    historyEmpty: "أكمل رحلتك الأولى لبدء السجل.",
    rank: "رتبة Legathon",
    rankLabel: "تقدمك",
    current: "الحالية",
    showcase: "عرض LEGATHON",
    highlights: "أبرز معلومات الملف",
    avatar: "الشخصية",
    outfit: "الزي",
    journey: "الرحلة المفضلة",
    footerTitle: "واصل بناء رحلتك",
    footer: "كل خطوة ورحلة مكتملة تضيف إلى قصتك.",
    loading: "جارٍ تحديث الملف...",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function fillTemplate(value, variables = {}) {
  return String(value).replace(
    /\{(\w+)\}/g,
    (match, key) =>
      Object.prototype.hasOwnProperty.call(variables, key)
        ? String(variables[key])
        : match
  );
}

function getText(language, key, variables = {}) {
  const value =
    PROFILE_TEXT[language]?.[key] ||
    PROFILE_TEXT.en[key] ||
    key;

  return fillTemplate(value, variables);
}

// ============================================================
// SAFE HELPERS
// ============================================================

function safeParse(value, fallback = null) {
  if (value === null || value === undefined) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

function clampProgress(value) {
  return Math.max(0, Math.min(100, safeNumber(value)));
}

function formatNumber(value) {
  return safeNumber(value).toLocaleString();
}

function getJourneyId(item) {
  const id = item?.id ?? item?.journeyId ?? item?.routeKey;

  return id === undefined || id === null
    ? ""
    : String(id);
}

function readProgress(value) {
  if (typeof value === "number") {
    return clampProgress(value);
  }

  if (!value || typeof value !== "object") {
    return 0;
  }

  if (
    value.completed === true ||
    value.isCompleted === true ||
    value.status === "completed"
  ) {
    return 100;
  }

  return clampProgress(
    value.progress ??
    value.journeyProgress ??
    value.progressPercent ??
    value.percentComplete ??
    0
  );
}

function readCompletionDate(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw =
    value.completedAt ??
    value.completionDate ??
    value.completedDate ??
    value.finishedAt;

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
}

function buildProgressMap(saved) {
  const map = {};

  function add(id, value) {
    if (!id) return;

    const previous = map[id] || {};

    map[id] = {
      progress: Math.max(
        previous.progress || 0,
        readProgress(value)
      ),
      completedAt:
        readCompletionDate(value) ||
        previous.completedAt ||
        null,
    };
  }

  if (Array.isArray(saved)) {
    saved.forEach(item => {
      add(getJourneyId(item), item);
    });
  } else if (saved && typeof saved === "object") {
    const singleId = getJourneyId(saved);

    if (singleId) {
      add(singleId, saved);
    } else {
      Object.entries(saved).forEach(([id, value]) => {
        add(id, value);
      });
    }
  }

  return map;
}

function getStampCount(progress) {
  if (progress >= 100) return 5;
  if (progress >= 75) return 4;
  if (progress >= 50) return 3;
  if (progress >= 25) return 2;
  if (progress > 0) return 1;

  return 0;
}

function getSuitTranslationKey(id) {
  switch (String(id || "default").toLowerCase()) {
    case "blue":
      return "blueTracksuit";
    case "green":
      return "greenTracksuit";
    case "red":
      return "redTracksuit";
    case "yellow":
      return "yellowTracksuit";
    case "elite":
      return "eliteTracksuit";
    default:
      return "defaultOutfit";
  }
}

const SUIT_LABELS = {
  en: {
    defaultOutfit: "Default Outfit",
    blueTracksuit: "Blue Tracksuit",
    greenTracksuit: "Green Tracksuit",
    redTracksuit: "Red Tracksuit",
    yellowTracksuit: "Yellow Tracksuit",
    eliteTracksuit: "Black & Gold Elite",
  },
  es: {
    defaultOutfit: "Atuendo Predeterminado",
    blueTracksuit: "Chándal Azul",
    greenTracksuit: "Chándal Verde",
    redTracksuit: "Chándal Rojo",
    yellowTracksuit: "Chándal Amarillo",
    eliteTracksuit: "Elite Negro y Dorado",
  },
  fr: {
    defaultOutfit: "Tenue par Défaut",
    blueTracksuit: "Survêtement Bleu",
    greenTracksuit: "Survêtement Vert",
    redTracksuit: "Survêtement Rouge",
    yellowTracksuit: "Survêtement Jaune",
    eliteTracksuit: "Élite Noir et Or",
  },
  de: {
    defaultOutfit: "Standard-Outfit",
    blueTracksuit: "Blauer Trainingsanzug",
    greenTracksuit: "Grüner Trainingsanzug",
    redTracksuit: "Roter Trainingsanzug",
    yellowTracksuit: "Gelber Trainingsanzug",
    eliteTracksuit: "Schwarz-Gold Elite",
  },
  pt: {
    defaultOutfit: "Roupa Padrão",
    blueTracksuit: "Agasalho Azul",
    greenTracksuit: "Agasalho Verde",
    redTracksuit: "Agasalho Vermelho",
    yellowTracksuit: "Agasalho Amarelo",
    eliteTracksuit: "Elite Preto e Dourado",
  },
  ja: {
    defaultOutfit: "デフォルトウェア",
    blueTracksuit: "ブルートラックスーツ",
    greenTracksuit: "グリーントラックスーツ",
    redTracksuit: "レッドトラックスーツ",
    yellowTracksuit: "イエロートラックスーツ",
    eliteTracksuit: "ブラック＆ゴールド エリート",
  },
  ko: {
    defaultOutfit: "기본 의상",
    blueTracksuit: "블루 트랙수트",
    greenTracksuit: "그린 트랙수트",
    redTracksuit: "레드 트랙수트",
    yellowTracksuit: "옐로 트랙수트",
    eliteTracksuit: "블랙 & 골드 엘리트",
  },
  zh: {
    defaultOutfit: "默认服装",
    blueTracksuit: "蓝色运动服",
    greenTracksuit: "绿色运动服",
    redTracksuit: "红色运动服",
    yellowTracksuit: "黄色运动服",
    eliteTracksuit: "黑金精英",
  },
  it: {
    defaultOutfit: "Completo Predefinito",
    blueTracksuit: "Tuta Blu",
    greenTracksuit: "Tuta Verde",
    redTracksuit: "Tuta Rossa",
    yellowTracksuit: "Tuta Gialla",
    eliteTracksuit: "Elite Nero e Oro",
  },
  ar: {
    defaultOutfit: "الزي الافتراضي",
    blueTracksuit: "البدلة الرياضية الزرقاء",
    greenTracksuit: "البدلة الرياضية الخضراء",
    redTracksuit: "البدلة الرياضية الحمراء",
    yellowTracksuit: "البدلة الرياضية الصفراء",
    eliteTracksuit: "النخبة الأسود والذهبي",
  },
};

function getSuitLabel(language, suit) {
  const key = getSuitTranslationKey(suit);

  return (
    SUIT_LABELS[language]?.[key] ||
    SUIT_LABELS.en[key]
  );
}

function getRankName(value) {
  if (typeof value === "string") return value;

  return value?.name || value?.title || "New Walker";
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  try {
    return date.toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date.toDateString();
  }
}

// ============================================================
// COMPONENTS
// ============================================================

function Stat({ icon, number, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>

      <Text
        style={styles.statNumber}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {number}
      </Text>

      <Text
        style={styles.statLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {label}
      </Text>
    </View>
  );
}

function Timeline({ title, date, last }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineMarkerWrap}>
        <View style={styles.timelineDot} />

        {!last && (
          <View style={styles.timelineLine} />
        )}
      </View>

      <View style={styles.timelineTextWrap}>
        <Text style={styles.timelineTitle}>
          {title}
        </Text>

        <Text style={styles.timelineDate}>
          {date}
        </Text>
      </View>
    </View>
  );
}

function Showcase({ label, value }) {
  return (
    <View style={styles.showcaseRow}>
      <Text style={styles.showcaseItemLabel}>
        {label}
      </Text>

      <Text
        style={styles.showcaseItemValue}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
    </View>
  );
}

// ============================================================
// MAIN PROFILE SCREEN
// ============================================================

export default function ProfileScreen({
  language = "en",
  goToAvatarCenter,
  goBack,
  openPassport,
}) {
  const t = useCallback(
    (key, variables = {}) =>
      getText(language, key, variables),
    [language]
  );

  const [avatarName, setAvatarName] = useState(
    "Legathon Walker"
  );

  const [avatarImage, setAvatarImage] = useState(
    avatarOptions?.[0]?.image || null
  );

  const [equippedSuit, setEquippedSuit] = useState(
    "default"
  );

  const [lifetimeSteps, setLifetimeSteps] =
    useState(0);

  const [walkingStreak, setWalkingStreak] =
    useState(0);

  const [progressMap, setProgressMap] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  // ==========================================================
  // LEGATHON POINTS
  // ==========================================================

  const {
    points: legathonPoints,
    rank: legathonRank,
  } = useLegathonPoints();

  // ==========================================================
  // LOAD PROFILE DATA
  // ==========================================================

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const [
        savedSteps,
        savedJourneys,
        savedActive,
        savedProfile,
        savedStreak,
      ] = await AsyncStorage.multiGet([
        "lifetimeSteps",
        PROGRESS_KEY,
        ACTIVE_JOURNEY_KEY,
        "avatarProfile",
        "walkingStreak",
      ]);

      // Walking data

      setLifetimeSteps(
        safeNumber(savedSteps?.[1])
      );

      setWalkingStreak(
        safeNumber(savedStreak?.[1])
      );

      // Journey progress:
      // use the same keys as PassportScreen.

      const nextMap = buildProgressMap(
        safeParse(savedJourneys?.[1], [])
      );

      const active = safeParse(
        savedActive?.[1],
        null
      );

      const activeId = getJourneyId(active);

      if (activeId) {
        const previous = nextMap[activeId] || {};

        nextMap[activeId] = {
          progress: Math.max(
            previous.progress || 0,
            readProgress(active)
          ),
          completedAt:
            readCompletionDate(active) ||
            previous.completedAt ||
            null,
        };
      }

      setProgressMap(nextMap);

      // Avatar profile

      const profile = safeParse(
        savedProfile?.[1],
        {}
      );

      const avatarId =
        profile?.avatarId ||
        avatarOptions?.[0]?.id ||
        null;

      setAvatarName(
        profile?.name || "Legathon Walker"
      );

      const baseAvatar =
        avatarOptions.find(
          item => item.id === avatarId
        ) ||
        avatarOptions?.[0] ||
        null;

      if (avatarId) {
        try {
          const visual =
            await getCurrentAvatarVisual(avatarId);

          setAvatarImage(
            visual?.image ||
            baseAvatar?.image ||
            null
          );
        } catch (error) {
          setAvatarImage(
            baseAvatar?.image || null
          );
        }
      } else {
        setAvatarImage(
          baseAvatar?.image || null
        );
      }

      // Track suit

      const suit = await getCurrentAvatarSuit();

      setEquippedSuit(
        suit || "default"
      );
    } catch (error) {
      console.log(
        "Profile loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ==========================================================
  // REFRESH ON APP RETURN
  // ==========================================================

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      state => {
        if (state === "active") {
          loadProfile();
        }
      }
    );

    return () => subscription.remove();
  }, [loadProfile]);

  // ==========================================================
  // JOURNEY DATA
  // ==========================================================

  const journeys = useMemo(() => {
    const catalog = Array.isArray(JOURNEY_CATALOG)
      ? JOURNEY_CATALOG
      : [];

    return catalog.map((journey, index) => {
      const id =
        getJourneyId(journey) ||
        `journey-${index}`;

      const translated =
        getJourneyTranslation(
          journey,
          language
        ) || journey;

      const progress = clampProgress(
        progressMap[id]?.progress || 0
      );

      return {
        id,
        title:
          translated?.title ||
          journey?.title ||
          "Legathon Journey",
        icon: journey?.icon || "🌍",
        progress,
        completedAt:
          progress >= 100
            ? progressMap[id]?.completedAt || null
            : null,
      };
    });
  }, [progressMap, language]);

  // ==========================================================
  // DERIVED STATISTICS
  // ==========================================================

  const completedJourneys = useMemo(
    () =>
      journeys.filter(
        journey => journey.progress >= 100
      ),
    [journeys]
  );

  const startedJourneys = journeys.filter(
    journey => journey.progress > 0
  );

  const completedCount =
    completedJourneys.length;

  const totalStamps = journeys.reduce(
    (total, journey) =>
      total + getStampCount(journey.progress),
    0
  );

  const totalMiles =
    lifetimeSteps / STEPS_PER_MILE;

  const favoriteJourney =
    completedJourneys[0] ||
    startedJourneys[0] ||
    null;

  // ==========================================================
  // RANK PROGRESSION
  // ==========================================================

  const currentRank = getRankName(
    legathonRank?.currentRank ||
    legathonRank?.rank ||
    "New Walker"
  );

  const nextRank = getRankName(
    legathonRank?.nextRank || "MAX"
  );

  const rankProgress = clampProgress(
    legathonRank?.progress
  );

  const rankOrder = [
    "New Walker",
    "Explorer",
    "Pathfinder",
    "Trailblazer",
    "Adventurer",
    "Champion",
    "Master Walker",
    "Legathon Hero",
    "Legend",
    "Hall of Fame",
  ];

  // ==========================================================
  // MAIN UI
  // ==========================================================

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
            {/* HEADER */}

            <View style={styles.headerRow}>
              {goBack ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={goBack}
                >
                  <Text style={styles.backText}>
                    ‹
                  </Text>
                </TouchableOpacity>
              ) : null}

              <View style={styles.headerTextWrap}>
                <Text style={styles.eyebrow}>
                  LEGATHON WALK
                </Text>

                <Text
                  style={styles.title}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {t("profileTitle")}
                </Text>

                <Text style={styles.headerSubtitle}>
                  {t("profileSubtitle")}
                </Text>
              </View>
            </View>

            {/* PROFILE HERO */}

            <View style={styles.heroCard}>
              <View style={styles.heroGlow} />

              <View style={styles.avatarStage}>
                {avatarImage ? (
                  <Image
                    source={avatarImage}
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.avatarFallback}>
                    👤
                  </Text>
                )}

                <View style={styles.rankPill}>
                  <Text
                    style={styles.rankPillText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {currentRank}
                  </Text>
                </View>
              </View>

              <View style={styles.heroInfo}>
                <Text style={styles.profileLabel}>
                  {t("identity")}
                </Text>

                <Text style={styles.name}>
                  {avatarName}
                </Text>

                <View style={styles.outfitPill}>
                  <Text
                    style={styles.outfitPillText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    ✓ {getSuitLabel(
                      language,
                      equippedSuit
                    )}
                  </Text>
                </View>

                <Text style={styles.legathonScore}>
                  ⭐ {formatNumber(legathonPoints)}{" "}
                  {t("points")}
                </Text>

                <View style={styles.levelBar}>
                  <View
                    style={[
                      styles.levelFill,
                      {
                        width: `${rankProgress}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.levelText}>
                  {Math.round(rankProgress)}% →{" "}
                  {nextRank}
                </Text>

                {goToAvatarCenter ? (
                  <TouchableOpacity
                    style={styles.avatarCenterButton}
                    onPress={goToAvatarCenter}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={styles.avatarCenterButtonText}
                    >
                      {t("openAvatar")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* WALKING PERFORMANCE */}

            <View style={styles.sectionHeadingRow}>
              <View>
                <Text style={styles.goldLabel}>
                  {t("walking")}
                </Text>

                <Text style={styles.sectionHeading}>
                  {t("performance")}
                </Text>
              </View>

              <Text style={styles.sectionIcon}>
                ✦
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <Stat
                icon="👟"
                number={formatNumber(lifetimeSteps)}
                label={t("steps")}
              />

              <Stat
                icon="🗺️"
                number={totalMiles.toFixed(2)}
                label={t("miles")}
              />

              <Stat
                icon="🌍"
                number={formatNumber(startedJourneys.length)}
                label={t("journeys")}
              />

              <Stat
                icon="✅"
                number={formatNumber(completedCount)}
                label={t("completed")}
              />

              <Stat
                icon="🛂"
                number={formatNumber(totalStamps)}
                label={t("stamps")}
              />

              <Stat
                icon="🔥"
                number={formatNumber(walkingStreak)}
                label={t("streak")}
              />
            </View>

            {/* FAVORITE JOURNEY */}

            <View style={styles.sectionCard}>
              <View style={styles.sectionTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goldLabel}>
                    {t("journeyIdentity")}
                  </Text>

                  <Text style={styles.sectionTitle}>
                    {t("favoriteJourney")}
                  </Text>
                </View>

                <Text style={styles.sectionIcon}>
                  🧭
                </Text>
              </View>

              {favoriteJourney ? (
                <View style={styles.favoriteCard}>
                  <View style={styles.favoriteIconBox}>
                    <Text style={styles.favoriteIcon}>
                      {favoriteJourney.icon}
                    </Text>
                  </View>

                  <View style={styles.favoriteTextWrap}>
                    <Text style={styles.favoriteTitle}>
                      {favoriteJourney.title}
                    </Text>

                    <Text style={styles.favoriteSub}>
                      {t("progress", {
                        percent: Math.round(
                          favoriteJourney.progress
                        ),
                      })}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.mutedText}>
                  {t("noFavorite")}
                </Text>
              )}
            </View>

            {/* JOURNEY TIMELINE */}

            <View style={styles.sectionCard}>
              <View style={styles.sectionTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goldLabel}>
                    {t("historyLabel")}
                  </Text>

                  <Text style={styles.sectionTitle}>
                    {t("history")}
                  </Text>
                </View>

                <Text style={styles.sectionIcon}>
                  🏁
                </Text>
              </View>

              {completedJourneys.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>
                    🗺️
                  </Text>

                  <Text style={styles.emptyText}>
                    {t("historyEmpty")}
                  </Text>
                </View>
              ) : (
                completedJourneys.map(
                  (journey, index) => (
                    <Timeline
                      key={journey.id}
                      title={journey.title}
                      date={
                        formatDate(
                          journey.completedAt,
                          language
                        ) || t("completed")
                      }
                      last={
                        index ===
                        completedJourneys.length - 1
                      }
                    />
                  )
                )
              )}
            </View>

            {/* LEGATHON RANK */}

            <View style={styles.sectionCard}>
              <View style={styles.sectionTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goldLabel}>
                    {t("rankLabel")}
                  </Text>

                  <Text style={styles.sectionTitle}>
                    {t("rank")}
                  </Text>
                </View>

                <Text style={styles.sectionIcon}>
                  👑
                </Text>
              </View>

              <View style={styles.rankList}>
                {rankOrder.map(rankName => {
                  const active =
                    rankName === currentRank;

                  return (
                    <View
                      key={rankName}
                      style={[
                        styles.rankRow,
                        active &&
                          styles.rankRowActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankDiamond,
                          active &&
                            styles.rankDiamondActive,
                        ]}
                      >
                        {active ? "◆" : "◇"}
                      </Text>

                      <Text
                        style={[
                          styles.rankText,
                          active &&
                            styles.rankTextActive,
                        ]}
                      >
                        {rankName}
                      </Text>

                      {active ? (
                        <View
                          style={styles.currentPill}
                        >
                          <Text
                            style={styles.currentPillText}
                          >
                            {t("current")}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* PUBLIC PROFILE HIGHLIGHTS */}

            <View style={styles.showcaseCard}>
              <Text style={styles.goldLabel}>
                {t("showcase")}
              </Text>

              <Text style={styles.showcaseTitle}>
                {t("highlights")}
              </Text>

              <Showcase
                label={t("avatar")}
                value={avatarName}
              />

              <Showcase
                label={t("outfit")}
                value={getSuitLabel(
                  language,
                  equippedSuit
                )}
              />

              <Showcase
                label={t("journey")}
                value={
                  favoriteJourney?.title ||
                  t("noFavorite")
                }
              />
            </View>

            {/* FOOTER */}

            <View style={styles.bottomCard}>
              <Text style={styles.bottomLabel}>
                LEGATHON WALKER
              </Text>

              <Text style={styles.bottomTitle}>
                {t("footerTitle")}
              </Text>

              <Text style={styles.bottomText}>
                {t("footer")}
              </Text>
            </View>

            {loading ? (
              <Text style={styles.loadingText}>
                {t("loading")}
              </Text>
            ) : null}
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
    backgroundColor: "#02060D",
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.34,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(1,7,16,0.77)",
  },

  safe: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 170,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  backText: {
    color: GOLD,
    fontSize: 39,
    lineHeight: 42,
  },

  headerTextWrap: {
    flex: 1,
  },

  eyebrow: {
    color: "#9EF0D4",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 7,
  },

  title: {
    color: WHITE,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    marginTop: 7,
  },

  heroCard: {
    overflow: "hidden",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: GOLD,
    backgroundColor: NAVY,
    marginBottom: 30,
  },

  heroGlow: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "rgba(75,44,170,0.30)",
    top: 72,
    alignSelf: "center",
  },

  avatarStage: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(4,15,30,0.40)",
  },

  avatarImage: {
    width: "92%",
    height: "92%",
  },

  avatarFallback: {
    fontSize: 110,
  },

  rankPill: {
    position: "absolute",
    bottom: 18,
    maxWidth: "88%",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: "#07111F",
    paddingVertical: 8,
    paddingHorizontal: 22,
  },

  rankPillText: {
    color: "#FFD54A",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  heroInfo: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 30,
    backgroundColor: "rgba(8,24,44,0.96)",
  },

  profileLabel: {
    color: "#FFD34A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },

  name: {
    color: WHITE,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "900",
    textAlign: "center",
  },

  outfitPill: {
    maxWidth: "100%",
    marginTop: 18,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#55DEA4",
    backgroundColor: "#0E3A2B",
    paddingVertical: 9,
    paddingHorizontal: 18,
  },

  outfitPillText: {
    color: "#A5F1D5",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  legathonScore: {
    color: "#FFD54A",
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "900",
    marginTop: 24,
    textAlign: "center",
  },

  levelBar: {
    width: "100%",
    height: 13,
    borderRadius: 10,
    backgroundColor: "#25394F",
    overflow: "hidden",
    marginTop: 20,
  },

  levelFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: GOLD,
  },

  levelText: {
    color: MUTED,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 11,
    textAlign: "center",
  },

  avatarCenterButton: {
    width: "100%",
    marginTop: 22,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  avatarCenterButtonText: {
    color: "#07111F",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  sectionHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionHeading: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },

  goldLabel: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  sectionIcon: {
    fontSize: 30,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statBox: {
    width: "48%",
    minHeight: 150,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#304B69",
    backgroundColor: "rgba(8,25,47,0.96)",
    padding: 17,
    justifyContent: "center",
    marginBottom: 14,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  statNumber: {
    color: WHITE,
    fontSize: 31,
    fontWeight: "900",
  },

  statLabel: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: 4,
  },

  sectionCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#304965",
    backgroundColor: "rgba(7,22,42,0.95)",
    padding: 22,
    marginBottom: 24,
  },

  sectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
    marginTop: 5,
  },

  mutedText: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
  },

  favoriteCard: {
    minHeight: 108,
    borderRadius: 22,
    backgroundColor: "#101D2D",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  favoriteIconBox: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: "#15283E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  favoriteIcon: {
    fontSize: 34,
  },

  favoriteTextWrap: {
    flex: 1,
  },

  favoriteTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "900",
  },

  favoriteSub: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 88,
  },

  timelineMarkerWrap: {
    width: 34,
    alignItems: "center",
  },

  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GOLD,
    marginTop: 4,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#725F28",
    marginTop: 5,
  },

  timelineTextWrap: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },

  timelineTitle: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "900",
  },

  timelineDate: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },

  emptyState: {
    borderRadius: 20,
    backgroundColor: "#0D1929",
    padding: 25,
    alignItems: "center",
  },

  emptyStateIcon: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyText: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  rankList: {
    gap: 8,
  },

  rankRow: {
    minHeight: 61,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  rankRowActive: {
    backgroundColor: "#202C3E",
  },

  rankDiamond: {
    color: GOLD,
    fontSize: 23,
    width: 39,
  },

  rankDiamondActive: {
    color: "#F1C63B",
  },

  rankText: {
    flex: 1,
    color: "#8390A5",
    fontSize: 19,
    fontWeight: "900",
  },

  rankTextActive: {
    color: WHITE,
  },

  currentPill: {
    borderRadius: 16,
    backgroundColor: GOLD,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  currentPillText: {
    color: "#07111F",
    fontSize: 9,
    fontWeight: "900",
  },

  showcaseCard: {
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#394E68",
    backgroundColor: "rgba(7,23,43,0.97)",
    padding: 22,
    marginBottom: 24,
  },

  showcaseTitle: {
    color: WHITE,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 18,
  },

  showcaseRow: {
    minHeight: 61,
    borderBottomWidth: 1,
    borderBottomColor: "#2B3B50",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },

  showcaseItemLabel: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
    fontWeight: "800",
  },

  showcaseItemValue: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  bottomCard: {
    borderRadius: 27,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: "rgba(12,20,32,0.96)",
    padding: 25,
    marginBottom: 24,
  },

  bottomLabel: {
    color: "#9EF0D4",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  bottomTitle: {
    color: WHITE,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 8,
  },

  bottomText: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  loadingText: {
    color: MUTED,
    textAlign: "center",
    marginTop: 6,
  },
});
