import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

import {
  isJourneyLocked,
  getUpgradeMessage,
} from "../utils/paywall";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// WCOIN IMAGE
// ============================================================

const WCOIN_ICON =
  require("../assets/wcoin.png");

// ============================================================
// JOURNEY CARD TRANSLATIONS
// ============================================================

const CARD_TRANSLATIONS = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    premium:
      "PREMIUM",

    activeJourney:
      "ACTIVE JOURNEY",

    journeyRewards:
      "Journey Rewards",

    journeyProgress:
      "Journey Progress",

    complete:
      "Complete",

    miles:
      "Miles",

    steps:
      "Steps",

    badge:
      "Badge",

    unlockJourney:
      "Unlock Journey",

    viewJourney:
      "View Journey",

    viewPlans:
      "View Plans",

    continueJourney:
      "Continue Journey",

    startJourney:
      "Start Journey",

    easy:
      "Easy",

    beginner:
      "Beginner",

    intermediate:
      "Intermediate",

    advanced:
      "Advanced",

    hard:
      "Hard",

    expert:
      "Expert",

    explorer:
      "Explorer",

    upToOneWeek:
      "Up to 1 week",

    upgradeMessage:
      "Upgrade your plan to unlock this journey.",

    legathonJourney:
      "Legathon Journey",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    premium:
      "PREMIUM",

    activeJourney:
      "VIAJE ACTIVO",

    journeyRewards:
      "Recompensas del Viaje",

    journeyProgress:
      "Progreso del Viaje",

    complete:
      "Completado",

    miles:
      "Millas",

    steps:
      "Pasos",

    badge:
      "Insignia",

    unlockJourney:
      "Desbloquear Viaje",

    viewJourney:
      "Ver Viaje",

    viewPlans:
      "Ver Planes",

    continueJourney:
      "Continuar Viaje",

    startJourney:
      "Iniciar Viaje",

    easy:
      "Fácil",

    beginner:
      "Principiante",

    intermediate:
      "Intermedio",

    advanced:
      "Avanzado",

    hard:
      "Difícil",

    expert:
      "Experto",

    explorer:
      "Explorador",

    upToOneWeek:
      "Hasta 1 semana",

    upgradeMessage:
      "Mejora tu plan para desbloquear este viaje.",

    legathonJourney:
      "Viaje Legathon",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    premium:
      "PREMIUM",

    activeJourney:
      "VOYAGE ACTIF",

    journeyRewards:
      "Récompenses du Voyage",

    journeyProgress:
      "Progression du Voyage",

    complete:
      "Terminé",

    miles:
      "Miles",

    steps:
      "Pas",

    badge:
      "Badge",

    unlockJourney:
      "Débloquer le Voyage",

    viewJourney:
      "Voir le Voyage",

    viewPlans:
      "Voir les Plans",

    continueJourney:
      "Continuer le Voyage",

    startJourney:
      "Commencer le Voyage",

    easy:
      "Facile",

    beginner:
      "Débutant",

    intermediate:
      "Intermédiaire",

    advanced:
      "Avancé",

    hard:
      "Difficile",

    expert:
      "Expert",

    explorer:
      "Explorateur",

    upToOneWeek:
      "Jusqu'à 1 semaine",

    upgradeMessage:
      "Améliorez votre abonnement pour débloquer ce voyage.",

    legathonJourney:
      "Voyage Legathon",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    premium:
      "PREMIUM",

    activeJourney:
      "AKTIVE REISE",

    journeyRewards:
      "Reisebelohnungen",

    journeyProgress:
      "Reisefortschritt",

    complete:
      "Abgeschlossen",

    miles:
      "Meilen",

    steps:
      "Schritte",

    badge:
      "Abzeichen",

    unlockJourney:
      "Reise Freischalten",

    viewJourney:
      "Reise Ansehen",

    viewPlans:
      "Pläne Ansehen",

    continueJourney:
      "Reise Fortsetzen",

    startJourney:
      "Reise Starten",

    easy:
      "Einfach",

    beginner:
      "Anfänger",

    intermediate:
      "Mittel",

    advanced:
      "Fortgeschritten",

    hard:
      "Schwer",

    expert:
      "Experte",

    explorer:
      "Entdecker",

    upToOneWeek:
      "Bis zu 1 Woche",

    upgradeMessage:
      "Aktualisiere deinen Plan, um diese Reise freizuschalten.",

    legathonJourney:
      "Legathon-Reise",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    premium:
      "PREMIUM",

    activeJourney:
      "JORNADA ATIVA",

    journeyRewards:
      "Recompensas da Jornada",

    journeyProgress:
      "Progresso da Jornada",

    complete:
      "Concluído",

    miles:
      "Milhas",

    steps:
      "Passos",

    badge:
      "Distintivo",

    unlockJourney:
      "Desbloquear Jornada",

    viewJourney:
      "Ver Jornada",

    viewPlans:
      "Ver Planos",

    continueJourney:
      "Continuar Jornada",

    startJourney:
      "Iniciar Jornada",

    easy:
      "Fácil",

    beginner:
      "Iniciante",

    intermediate:
      "Intermediário",

    advanced:
      "Avançado",

    hard:
      "Difícil",

    expert:
      "Especialista",

    explorer:
      "Explorador",

    upToOneWeek:
      "Até 1 semana",

    upgradeMessage:
      "Atualize seu plano para desbloquear esta jornada.",

    legathonJourney:
      "Jornada Legathon",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    premium:
      "プレミアム",

    activeJourney:
      "進行中のジャーニー",

    journeyRewards:
      "ジャーニー報酬",

    journeyProgress:
      "ジャーニー進捗",

    complete:
      "完了",

    miles:
      "マイル",

    steps:
      "歩数",

    badge:
      "バッジ",

    unlockJourney:
      "ジャーニーを解除",

    viewJourney:
      "ジャーニーを見る",

    viewPlans:
      "プランを見る",

    continueJourney:
      "ジャーニーを続ける",

    startJourney:
      "ジャーニーを開始",

    easy:
      "簡単",

    beginner:
      "初心者",

    intermediate:
      "中級",

    advanced:
      "上級",

    hard:
      "難しい",

    expert:
      "エキスパート",

    explorer:
      "エクスプローラー",

    upToOneWeek:
      "最大1週間",

    upgradeMessage:
      "このジャーニーを解除するにはプランをアップグレードしてください。",

    legathonJourney:
      "Legathonジャーニー",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    premium:
      "프리미엄",

    activeJourney:
      "진행 중인 여정",

    journeyRewards:
      "여정 보상",

    journeyProgress:
      "여정 진행",

    complete:
      "완료",

    miles:
      "마일",

    steps:
      "걸음 수",

    badge:
      "배지",

    unlockJourney:
      "여정 잠금 해제",

    viewJourney:
      "여정 보기",

    viewPlans:
      "플랜 보기",

    continueJourney:
      "여정 계속하기",

    startJourney:
      "여정 시작",

    easy:
      "쉬움",

    beginner:
      "초급",

    intermediate:
      "중급",

    advanced:
      "고급",

    hard:
      "어려움",

    expert:
      "전문가",

    explorer:
      "탐험가",

    upToOneWeek:
      "최대 1주",

    upgradeMessage:
      "이 여정을 잠금 해제하려면 플랜을 업그레이드하세요.",

    legathonJourney:
      "Legathon 여정",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    premium:
      "高级",

    activeJourney:
      "当前旅程",

    journeyRewards:
      "旅程奖励",

    journeyProgress:
      "旅程进度",

    complete:
      "完成",

    miles:
      "英里",

    steps:
      "步数",

    badge:
      "徽章",

    unlockJourney:
      "解锁旅程",

    viewJourney:
      "查看旅程",

    viewPlans:
      "查看计划",

    continueJourney:
      "继续旅程",

    startJourney:
      "开始旅程",

    easy:
      "简单",

    beginner:
      "初级",

    intermediate:
      "中级",

    advanced:
      "高级",

    hard:
      "困难",

    expert:
      "专家",

    explorer:
      "探索者",

    upToOneWeek:
      "最长1周",

    upgradeMessage:
      "升级你的计划以解锁此旅程。",

    legathonJourney:
      "Legathon旅程",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    premium:
      "PREMIUM",

    activeJourney:
      "PERCORSO ATTIVO",

    journeyRewards:
      "Premi del Percorso",

    journeyProgress:
      "Progresso del Percorso",

    complete:
      "Completato",

    miles:
      "Miglia",

    steps:
      "Passi",

    badge:
      "Distintivo",

    unlockJourney:
      "Sblocca Percorso",

    viewJourney:
      "Visualizza Percorso",

    viewPlans:
      "Visualizza Piani",

    continueJourney:
      "Continua Percorso",

    startJourney:
      "Inizia Percorso",

    easy:
      "Facile",

    beginner:
      "Principiante",

    intermediate:
      "Intermedio",

    advanced:
      "Avanzato",

    hard:
      "Difficile",

    expert:
      "Esperto",

    explorer:
      "Esploratore",

    upToOneWeek:
      "Fino a 1 settimana",

    upgradeMessage:
      "Aggiorna il tuo piano per sbloccare questo percorso.",

    legathonJourney:
      "Percorso Legathon",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    premium:
      "مميز",

    activeJourney:
      "الرحلة النشطة",

    journeyRewards:
      "مكافآت الرحلة",

    journeyProgress:
      "تقدم الرحلة",

    complete:
      "مكتمل",

    miles:
      "أميال",

    steps:
      "الخطوات",

    badge:
      "الشارة",

    unlockJourney:
      "فتح الرحلة",

    viewJourney:
      "عرض الرحلة",

    viewPlans:
      "عرض الخطط",

    continueJourney:
      "متابعة الرحلة",

    startJourney:
      "بدء الرحلة",

    easy:
      "سهل",

    beginner:
      "مبتدئ",

    intermediate:
      "متوسط",

    advanced:
      "متقدم",

    hard:
      "صعب",

    expert:
      "خبير",

    explorer:
      "مستكشف",

    upToOneWeek:
      "حتى أسبوع واحد",

    upgradeMessage:
      "قم بترقية خطتك لفتح هذه الرحلة.",

    legathonJourney:
      "رحلة Legathon",
  },
};

// ============================================================
// CATEGORY TRANSLATIONS
// ============================================================

const CATEGORY_TRANSLATIONS = {
  es: {
    "Black Legacy":
      "Legado Afroamericano",

    "Civil Rights":
      "Derechos Civiles",

    "Ancient Civilizations":
      "Civilizaciones Antiguas",

    "Faith & Pilgrimages":
      "Fe y Peregrinaciones",

    "Nature & Adventure":
      "Naturaleza y Aventura",

    "African Heritage":
      "Herencia Africana",

    "Cities & Cultural Heritage":
      "Ciudades y Patrimonio Cultural",

    "Asian Heritage":
      "Herencia Asiática",

    "Historic Cultures":
      "Culturas Históricas",

    "American History":
      "Historia Estadounidense",

    "Bridges & Engineering":
      "Puentes e Ingeniería",

    "Awareness Journeys":
      "Viajes de Concientización",

    "Global Journey":
      "Viaje Global",
  },

  fr: {
    "Black Legacy":
      "Héritage Afro-Américain",

    "Civil Rights":
      "Droits Civiques",

    "Ancient Civilizations":
      "Civilisations Anciennes",

    "Faith & Pilgrimages":
      "Foi et Pèlerinages",

    "Nature & Adventure":
      "Nature et Aventure",

    "African Heritage":
      "Héritage Africain",

    "Cities & Cultural Heritage":
      "Villes et Patrimoine Culturel",

    "Asian Heritage":
      "Héritage Asiatique",

    "Historic Cultures":
      "Cultures Historiques",

    "American History":
      "Histoire Américaine",

    "Bridges & Engineering":
      "Ponts et Ingénierie",

    "Awareness Journeys":
      "Voyages de Sensibilisation",

    "Global Journey":
      "Voyage Mondial",
  },

  de: {
    "Black Legacy":
      "Afroamerikanisches Erbe",

    "Civil Rights":
      "Bürgerrechte",

    "Ancient Civilizations":
      "Antike Zivilisationen",

    "Faith & Pilgrimages":
      "Glaube & Pilgerreisen",

    "Nature & Adventure":
      "Natur & Abenteuer",

    "African Heritage":
      "Afrikanisches Erbe",

    "Cities & Cultural Heritage":
      "Städte & Kulturerbe",

    "Asian Heritage":
      "Asiatisches Erbe",

    "Historic Cultures":
      "Historische Kulturen",

    "American History":
      "Amerikanische Geschichte",

    "Bridges & Engineering":
      "Brücken & Ingenieurwesen",

    "Awareness Journeys":
      "Bewusstseinsreisen",

    "Global Journey":
      "Globale Reise",
  },

  pt: {
    "Black Legacy":
      "Legado Afro-Americano",

    "Civil Rights":
      "Direitos Civis",

    "Ancient Civilizations":
      "Civilizações Antigas",

    "Faith & Pilgrimages":
      "Fé e Peregrinações",

    "Nature & Adventure":
      "Natureza e Aventura",

    "African Heritage":
      "Herança Africana",

    "Cities & Cultural Heritage":
      "Cidades e Patrimônio Cultural",

    "Asian Heritage":
      "Herança Asiática",

    "Historic Cultures":
      "Culturas Históricas",

    "American History":
      "História Americana",

    "Bridges & Engineering":
      "Pontes e Engenharia",

    "Awareness Journeys":
      "Jornadas de Conscientização",

    "Global Journey":
      "Jornada Global",
  },

  ja: {
    "Black Legacy":
      "黒人の歴史と遺産",

    "Civil Rights":
      "公民権",

    "Ancient Civilizations":
      "古代文明",

    "Faith & Pilgrimages":
      "信仰と巡礼",

    "Nature & Adventure":
      "自然と冒険",

    "African Heritage":
      "アフリカの遺産",

    "Cities & Cultural Heritage":
      "都市と文化遺産",

    "Asian Heritage":
      "アジアの遺産",

    "Historic Cultures":
      "歴史文化",

    "American History":
      "アメリカ史",

    "Bridges & Engineering":
      "橋と工学",

    "Awareness Journeys":
      "啓発ジャーニー",

    "Global Journey":
      "グローバルジャーニー",
  },

  ko: {
    "Black Legacy":
      "흑인 역사와 유산",

    "Civil Rights":
      "시민권",

    "Ancient Civilizations":
      "고대 문명",

    "Faith & Pilgrimages":
      "신앙과 순례",

    "Nature & Adventure":
      "자연과 모험",

    "African Heritage":
      "아프리카 유산",

    "Cities & Cultural Heritage":
      "도시와 문화유산",

    "Asian Heritage":
      "아시아 유산",

    "Historic Cultures":
      "역사 문화",

    "American History":
      "미국 역사",

    "Bridges & Engineering":
      "교량과 공학",

    "Awareness Journeys":
      "인식 여정",

    "Global Journey":
      "글로벌 여정",
  },

  zh: {
    "Black Legacy":
      "黑人历史传承",

    "Civil Rights":
      "民权运动",

    "Ancient Civilizations":
      "古代文明",

    "Faith & Pilgrimages":
      "信仰与朝圣",

    "Nature & Adventure":
      "自然与探险",

    "African Heritage":
      "非洲文化遗产",

    "Cities & Cultural Heritage":
      "城市与文化遗产",

    "Asian Heritage":
      "亚洲文化遗产",

    "Historic Cultures":
      "历史文化",

    "American History":
      "美国历史",

    "Bridges & Engineering":
      "桥梁与工程",

    "Awareness Journeys":
      "公益主题旅程",

    "Global Journey":
      "全球旅程",
  },

  it: {
    "Black Legacy":
      "Eredità Afroamericana",

    "Civil Rights":
      "Diritti Civili",

    "Ancient Civilizations":
      "Civiltà Antiche",

    "Faith & Pilgrimages":
      "Fede e Pellegrinaggi",

    "Nature & Adventure":
      "Natura e Avventura",

    "African Heritage":
      "Patrimonio Africano",

    "Cities & Cultural Heritage":
      "Città e Patrimonio Culturale",

    "Asian Heritage":
      "Patrimonio Asiatico",

    "Historic Cultures":
      "Culture Storiche",

    "American History":
      "Storia Americana",

    "Bridges & Engineering":
      "Ponti e Ingegneria",

    "Awareness Journeys":
      "Percorsi di Sensibilizzazione",

    "Global Journey":
      "Percorso Globale",
  },

  ar: {
    "Black Legacy":
      "التراث الأسود",

    "Civil Rights":
      "الحقوق المدنية",

    "Ancient Civilizations":
      "الحضارات القديمة",

    "Faith & Pilgrimages":
      "الإيمان والحج",

    "Nature & Adventure":
      "الطبيعة والمغامرة",

    "African Heritage":
      "التراث الأفريقي",

    "Cities & Cultural Heritage":
      "المدن والتراث الثقافي",

    "Asian Heritage":
      "التراث الآسيوي",

    "Historic Cultures":
      "الثقافات التاريخية",

    "American History":
      "التاريخ الأمريكي",

    "Bridges & Engineering":
      "الجسور والهندسة",

    "Awareness Journeys":
      "رحلات التوعية",

    "Global Journey":
      "رحلة عالمية",
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function JourneyCard({
  language = "en",

  item,

  savedProgress = 0,

  userPlan = "free",

  activeJourney,

  setSelectedJourney,

  setActiveJourney,

  goDetail,

  goHome,

  goPaywall,
}) {
  if (!item) {
    return null;
  }

  // ==========================================================
  // TRANSLATION HELPER
  // ==========================================================

  function t(key) {
    const central =
      translate(
        language,
        key
      );

    if (
      central !==
      key
    ) {
      return central;
    }

    return (
      CARD_TRANSLATIONS?.[
        language
      ]?.[key] ??
      CARD_TRANSLATIONS
        .en?.[key] ??
      key
    );
  }

  // ==========================================================
  // LOCK
  // ==========================================================

  const locked =
    isJourneyLocked(
      item,
      userPlan
    );

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const rawProgress =
    Number(
      savedProgress
    );

  const progress =
    Number.isFinite(
      rawProgress
    )
      ? Math.max(
          0,
          Math.min(
            100,
            rawProgress
          )
        )
      : 0;

  // Keep unfinished progress from rounding to 100.
  const progressText =
    (
      progress <
      100
        ? Math.min(
            progress,
            99.99
          )
        : 100
    ).toFixed(
      2
    );

  // ==========================================================
  // NUMBER HELPER
  // ==========================================================

  function safeNumber(
    value
  ) {
    const number =
      Number(
        value ??
          0
      );

    return Number.isFinite(
      number
    )
      ? Math.max(
          0,
          number
        )
      : 0;
  }

  // ==========================================================
  // JOURNEY VALUES
  // ==========================================================

  const miles =
    safeNumber(
      item.distanceMiles ??
      item.miles ??
      item.distance ??
      0
    );

  const steps =
    Math.floor(
      safeNumber(
        item.totalSteps ??
        item.steps ??
        Math.round(
          miles *
            2000
        )
      )
    );

  const reward =
    safeNumber(
      item.wCoins ??
      item.wCoinReward ??
      item.coins ??
      item.reward ??
      0
    );

  const xp =
    safeNumber(
      item.avatarXP ??
      item.xpReward ??
      item.xp ??
      0
    );

  // ==========================================================
  // DIFFICULTY
  // ==========================================================

  const rawDifficulty =
    item.difficulty ||
    "Easy";

  function translateDifficulty(
    value
  ) {
    const difficultyMap = {
      Easy:
        "easy",

      Beginner:
        "beginner",

      Intermediate:
        "intermediate",

      Advanced:
        "advanced",

      Hard:
        "hard",

      Expert:
        "expert",
    };

    const key =
      difficultyMap[
        value
      ];

    return key
      ? t(key)
      : value;
  }

  const difficulty =
    translateDifficulty(
      rawDifficulty
    );

  // ==========================================================
  // BADGE
  // ==========================================================

  const rawBadge =
    item.badge ||
    "Explorer";

  const badge =
    rawBadge ===
    "Explorer"
      ? t(
          "explorer"
        )
      : rawBadge;

  const difficultyColor =
    item.color ||
    "#D4AF37";

  // ==========================================================
  // ESTIMATED TIME
  // ==========================================================

  const estimatedTime =
    item.estimatedTime ||
    t(
      "upToOneWeek"
    );

  // ==========================================================
  // ACTIVE JOURNEY
  // ==========================================================

  const isActive =
    activeJourney?.id ===
      item.id ||
    item.isActive ===
      true;

  // ==========================================================
  // CONTENT
  // ==========================================================

  const title =
    item.title ||
    t(
      "legathonJourney"
    );

  const category =
    item.category ||
    "";

  const subtitle =
    item.subtitle ||
    item.description ||
    "";

  // ==========================================================
  // CATEGORY TRANSLATION
  // ==========================================================

  function translateCategory(
    value
  ) {
    return (
      CATEGORY_TRANSLATIONS?.[
        language
      ]?.[value] ||
      value
    );
  }

  // ==========================================================
  // LOCK MESSAGE
  // ==========================================================

  function lockMessage() {
    if (
      language ===
      "en"
    ) {
      return (
        getUpgradeMessage(
          item
        ) ||
        t(
          "upgradeMessage"
        )
      );
    }

    return t(
      "upgradeMessage"
    );
  }

  // ==========================================================
  // VIEW JOURNEY
  // ==========================================================

  function handleView() {
    if (
      locked
    ) {
      goPaywall?.(
        item
      );

      return;
    }

    setSelectedJourney?.(
      item
    );

    goDetail?.(
      item
    );
  }

  // ==========================================================
  // START JOURNEY
  // ==========================================================

  function handleStart() {
    if (
      locked
    ) {
      goPaywall?.(
        item
      );

      return;
    }

    setActiveJourney?.(
      item
    );

    goHome?.(
      item
    );
  }

  // ==========================================================
  // STAT BOX
  // ==========================================================

  function StatBox({
    label,
    value,
    last = false,
  }) {
    return (
      <View
        style={[
          styles.statBox,

          last &&
            styles.lastStatBox,
        ]}
      >
        <Text
          style={
            styles.statLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.statValue
          }
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
      </View>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View
      style={[
        styles.card,

        locked &&
          styles.lockedCard,

        isActive &&
          styles.activeCard,
      ]}
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <ImageBackground
        source={
          item.image
        }
        style={
          styles.image
        }
        imageStyle={
          styles.imageStyle
        }
        resizeMode="cover"
      >
        <View
          style={
            styles.imageShade
          }
        />

        {/* ====================================================
            DIFFICULTY
        ==================================================== */}

        <View
          style={
            styles.topRow
          }
        >
          <View />

          <View
            style={[
              styles.difficultyBadge,

              {
                borderColor:
                  difficultyColor,
              },
            ]}
          >
            <View
              style={[
                styles.difficultyDot,

                {
                  backgroundColor:
                    difficultyColor,
                },
              ]}
            />

            <Text
              style={
                styles.difficultyText
              }
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.7
              }
            >
              {
                difficulty
              }
            </Text>
          </View>
        </View>

        {/* ====================================================
            PREMIUM
        ==================================================== */}

        {locked && (
          <View
            style={
              styles.lockBadge
            }
          >
            <Text
              style={
                styles.lockBadgeText
              }
            >
              🔒{" "}
              {t(
                "premium"
              )}
            </Text>
          </View>
        )}

        {/* ====================================================
            ACTIVE
        ==================================================== */}

        {isActive &&
          !locked && (
          <View
            style={
              styles.activeBadge
            }
          >
            <Text
              style={
                styles.activeBadgeText
              }
            >
              {t(
                "activeJourney"
              )}
            </Text>
          </View>
        )}
      </ImageBackground>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <View
        style={
          styles.content
        }
      >
        <Text
          style={
            styles.title
          }
          numberOfLines={
            2
          }
        >
          {title}
        </Text>

        {!!category && (
          <Text
            style={
              styles.category
            }
          >
            {translateCategory(
              category
            )}
          </Text>
        )}

        {!!subtitle && (
          <Text
            style={
              styles.description
            }
            numberOfLines={
              3
            }
          >
            {subtitle}
          </Text>
        )}

        {/* ====================================================
            REWARDS
        ==================================================== */}

        <View
          style={
            styles.rewardPanel
          }
        >
          <Text
            style={
              styles.rewardTitle
            }
          >
            🏆{" "}
            {t(
              "journeyRewards"
            )}
          </Text>

          <View
            style={
              styles.rewardRow
            }
          >
            {/* WCOIN */}

            <View
              style={
                styles.rewardItem
              }
            >
              <Image
                source={
                  WCOIN_ICON
                }
                style={
                  styles.wcoinIcon
                }
                resizeMode="contain"
              />

              <Text
                style={
                  styles.rewardText
                }
              >
                {reward.toLocaleString()}{" "}
                WCoin
              </Text>
            </View>

            {/* XP */}

            <View
              style={
                styles.rewardItem
              }
            >
              <Text
                style={
                  styles.rewardIcon
                }
              >
                ⭐
              </Text>

              <Text
                style={
                  styles.rewardText
                }
              >
                {xp.toLocaleString()}{" "}
                XP
              </Text>
            </View>

            {/* BADGE */}

            <View
              style={
                styles.rewardItem
              }
            >
              <Text
                style={
                  styles.rewardIcon
                }
              >
                🏅
              </Text>

              <Text
                style={
                  styles.rewardText
                }
                numberOfLines={
                  1
                }
              >
                {badge}
              </Text>
            </View>
          </View>
        </View>

        {/* ====================================================
            DIFFICULTY + TIME
        ==================================================== */}

        <View
          style={
            styles.metaRow
          }
        >
          <View
            style={
              styles.metaPill
            }
          >
            <Text
              style={
                styles.metaText
              }
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.7
              }
            >
              ⭐{" "}
              {
                difficulty
              }
            </Text>
          </View>

          <View
            style={[
              styles.metaPill,

              styles.lastMetaPill,
            ]}
          >
            <Text
              style={
                styles.metaText
              }
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.65
              }
            >
              ⏱{" "}
              {
                estimatedTime
              }
            </Text>
          </View>
        </View>

        {/* ====================================================
            PROGRESS
        ==================================================== */}

        <View
          style={
            styles.progressHeader
          }
        >
          <Text
            style={
              styles.progressLabel
            }
          >
            {t(
              "journeyProgress"
            )}
          </Text>

          <Text
            style={
              styles.progressPercent
            }
          >
            {
              progressText
            }
            %
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
                  `${progressText}%`,

                backgroundColor:
                  difficultyColor,
              },
            ]}
          />
        </View>

        <Text
          style={
            styles.progressText
          }
        >
          {
            progressText
          }
          %{" "}
          {t(
            "complete"
          )}
        </Text>

        {/* ====================================================
            STATS
        ==================================================== */}

        <View
          style={
            styles.infoRow
          }
        >
          <StatBox
            label={
              t(
                "miles"
              )
            }
            value={
              `${miles.toLocaleString()} mi`
            }
          />

          <StatBox
            label={
              t(
                "steps"
              )
            }
            value={
              steps.toLocaleString()
            }
          />

          <StatBox
            label={
              t(
                "badge"
              )
            }
            value={
              badge
            }
            last
          />
        </View>

        {/* ====================================================
            LOCK MESSAGE
        ==================================================== */}

        {locked && (
          <Text
            style={
              styles.lockMessage
            }
          >
            {
              lockMessage()
            }
          </Text>
        )}

        {/* ====================================================
            VIEW BUTTON
        ==================================================== */}

        <TouchableOpacity
          style={
            styles.primaryButton
          }
          activeOpacity={
            0.9
          }
          onPress={
            handleView
          }
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            {locked
              ? t(
                  "unlockJourney"
                )
              : t(
                  "viewJourney"
                )}
          </Text>
        </TouchableOpacity>

        {/* ====================================================
            START BUTTON
        ==================================================== */}

        <TouchableOpacity
          style={[
            styles.startButton,

            locked &&
              styles.lockedButton,
          ]}
          activeOpacity={
            0.9
          }
          onPress={
            handleStart
          }
        >
          <Text
            style={
              styles.startButtonText
            }
          >
            {locked
              ? t(
                  "viewPlans"
                )
              : isActive
              ? t(
                  "continueJourney"
                )
              : t(
                  "startJourney"
                )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#061226",

      borderRadius:
        22,

      overflow:
        "hidden",

      marginBottom:
        22,

      borderWidth:
        2,

      borderColor:
        "#20314A",

      shadowColor:
        "#000",

      shadowOpacity:
        0.45,

      shadowRadius:
        12,

      shadowOffset: {
        width:
          0,

        height:
          8,
      },

      elevation:
        10,
    },

    lockedCard: {
      borderColor:
        "#FFD54F",
    },

    activeCard: {
      borderColor:
        "#10D8C4",
    },

    // ==========================================================
    // IMAGE
    // ==========================================================

    image: {
      height:
        270,

      justifyContent:
        "space-between",
    },

    imageStyle: {
      borderTopLeftRadius:
        22,

      borderTopRightRadius:
        22,
    },

    imageShade: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(4,10,22,0.10)",
    },

    topRow: {
      position:
        "absolute",

      top:
        14,

      right:
        14,

      zIndex:
        5,
    },

    // ==========================================================
    // DIFFICULTY
    // ==========================================================

    difficultyBadge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      alignSelf:
        "flex-end",

      backgroundColor:
        "rgba(3,10,23,0.92)",

      borderWidth:
        1.5,

      borderRadius:
        18,

      paddingHorizontal:
        12,

      paddingVertical:
        8,

      minWidth:
        0,

      maxWidth:
        150,
    },

    difficultyDot: {
      width:
        8,

      height:
        8,

      borderRadius:
        4,

      marginRight:
        7,
    },

    difficultyText: {
      color:
        "#FFFFFF",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    // ==========================================================
    // LOCK BADGE
    // ==========================================================

    lockBadge: {
      position:
        "absolute",

      top:
        14,

      left:
        14,

      backgroundColor:
        "rgba(5,12,24,0.92)",

      borderWidth:
        1,

      borderColor:
        "#FFD54F",

      borderRadius:
        16,

      paddingHorizontal:
        11,

      paddingVertical:
        8,
    },

    lockBadgeText: {
      color:
        "#FFD54F",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        0.7,
    },

    // ==========================================================
    // ACTIVE
    // ==========================================================

    activeBadge: {
      position:
        "absolute",

      left:
        14,

      bottom:
        14,

      backgroundColor:
        "#10D8C4",

      borderRadius:
        14,

      paddingHorizontal:
        11,

      paddingVertical:
        7,
    },

    activeBadgeText: {
      color:
        "#03111D",

      fontSize:
        9,

      fontWeight:
        "900",

      letterSpacing:
        0.8,
    },

    // ==========================================================
    // CONTENT
    // ==========================================================

    content: {
      paddingHorizontal:
        18,

      paddingTop:
        18,

      paddingBottom:
        18,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        30,

      fontWeight:
        "900",

      lineHeight:
        35,
    },

    category: {
      color:
        "#68E0C1",

      fontSize:
        17,

      fontWeight:
        "900",

      marginTop:
        6,
    },

    description: {
      color:
        "#E3E9F3",

      fontSize:
        15,

      lineHeight:
        22,

      marginTop:
        12,
    },

    // ==========================================================
    // REWARDS
    // ==========================================================

    rewardPanel: {
      backgroundColor:
        "#0B1A30",

      borderWidth:
        1,

      borderColor:
        "#263A59",

      borderRadius:
        17,

      padding:
        14,

      marginTop:
        17,
    },

    rewardTitle: {
      color:
        "#FFD54A",

      fontSize:
        17,

      fontWeight:
        "900",

      marginBottom:
        11,
    },

    rewardRow: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",
    },

    rewardItem: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#111F35",

      borderRadius:
        11,

      paddingHorizontal:
        9,

      paddingVertical:
        7,

      marginRight:
        7,

      marginBottom:
        7,
    },

    rewardIcon: {
      fontSize:
        13,

      marginRight:
        5,
    },

    wcoinIcon: {
      width:
        20,

      height:
        20,

      marginRight:
        6,
    },

    rewardText: {
      color:
        "#F4D978",

      fontSize:
        10,

      fontWeight:
        "800",
    },

    // ==========================================================
    // META
    // ==========================================================

    metaRow: {
      flexDirection:
        "row",

      marginTop:
        13,
    },

    metaPill: {
      flex:
        1,

      minHeight:
        42,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#0B1A30",

      borderWidth:
        1,

      borderColor:
        "#263A59",

      borderRadius:
        13,

      marginRight:
        8,

      paddingHorizontal:
        8,
    },

    lastMetaPill: {
      marginRight:
        0,
    },

    metaText: {
      color:
        "#FFFFFF",

      fontSize:
        11,

      fontWeight:
        "800",

      textAlign:
        "center",
    },

    // ==========================================================
    // PROGRESS
    // ==========================================================

    progressHeader: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginTop:
        17,
    },

    progressLabel: {
      color:
        "#FFFFFF",

      fontSize:
        12,

      fontWeight:
        "800",
    },

    progressPercent: {
      color:
        "#68E0C1",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    progressTrack: {
      height:
        10,

      backgroundColor:
        "#18263A",

      borderRadius:
        5,

      overflow:
        "hidden",

      marginTop:
        8,
    },

    progressFill: {
      height:
        "100%",

      borderRadius:
        5,
    },

    progressText: {
      color:
        "#AAB6C8",

      fontSize:
        11,

      marginTop:
        7,

      textAlign:
        "right",
    },

    // ==========================================================
    // STATS
    // ==========================================================

    infoRow: {
      flexDirection:
        "row",

      alignItems:
        "stretch",

      justifyContent:
        "space-between",

      marginTop:
        18,

      marginBottom:
        20,
    },

    statBox: {
      flex:
        1,

      minWidth:
        0,

      backgroundColor:
        "#10213D",

      borderWidth:
        1,

      borderColor:
        "#294366",

      borderRadius:
        16,

      paddingVertical:
        16,

      paddingHorizontal:
        6,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        8,
    },

    lastStatBox: {
      marginRight:
        0,
    },

    statLabel: {
      color:
        "#AEBBD0",

      fontSize:
        12,

      fontWeight:
        "700",

      textAlign:
        "center",
    },

    statValue: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    // ==========================================================
    // LOCK MESSAGE
    // ==========================================================

    lockMessage: {
      color:
        "#FFD54A",

      fontSize:
        12,

      lineHeight:
        18,

      fontWeight:
        "700",

      textAlign:
        "center",

      marginTop:
        14,
    },

    // ==========================================================
    // BUTTONS
    // ==========================================================

    primaryButton: {
      minHeight:
        56,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#10D8C4",

      borderRadius:
        17,

      marginTop:
        17,
    },

    primaryButtonText: {
      color:
        "#03111D",

      fontSize:
        16,

      fontWeight:
        "900",
    },

    startButton: {
      minHeight:
        56,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#FFD84D",

      borderRadius:
        17,

      marginTop:
        11,
    },

    lockedButton: {
      backgroundColor:
        "#FFD54A",
    },

    startButtonText: {
      color:
        "#15100A",

      fontSize:
        16,

      fontWeight:
        "900",
    },
  });