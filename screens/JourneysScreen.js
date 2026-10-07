import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import JourneyCard
  from "./JourneyCard";

import useJourneyProgress, {
  DISPLAY_JOURNEYS,
} from "../hooks/useJourneyProgress";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// BACKGROUND
// ============================================================

const COLLAGE_BG =
  require("../assets/collage-background.png");

// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES = [
  "All",

  ...Array.from(
    new Set(
      DISPLAY_JOURNEYS
        .map(
          journey =>
            journey.category
        )
        .filter(Boolean)
    )
  ),
];

// ============================================================
// SORT OPTIONS
// ============================================================

const SORTS = [
  "Featured",
  "Progress",
  "Steps",
  "Reward",
];

// ============================================================
// JOURNEY SCREEN TRANSLATIONS
// ============================================================

const JOURNEY_TRANSLATIONS = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    exploreWorld:
      "Explore the World",

    journeySubtitle:
      "{count} Journeys • Walk • Learn • Discover",

    searchPlaceholder:
      "Search journeys, countries, categories...",

    loadingProgress:
      "Loading saved progress…",

    unableLoadFavorites:
      "Unable to load favorites.",

    unableSaveFavorites:
      "Unable to save favorites. Please try again.",

    continueJourneyLabel:
      "CONTINUE JOURNEY",

    complete:
      "Complete",

    continue:
      "Continue",

    featuredJourney:
      "FEATURED JOURNEY",

    exploreJourney:
      "Explore Journey",

    journeysFound:
      "{count} journeys found",

    noJourneys:
      "No journeys found",

    tryAnother:
      "Try another search or category.",

    popularWeek:
      "Popular This Week",

    recentlyAdded:
      "Recently Added",

    journeySummary:
      "Journey Summary",

    total:
      "Total",

    favorites:
      "Favorites",

    premium:
      "Premium",

    categories:
      "Categories",

    all:
      "All",

    sortFeatured:
      "Featured",

    sortProgress:
      "Progress",

    sortSteps:
      "Steps",

    sortReward:
      "Reward",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    exploreWorld:
      "Explora el Mundo",

    journeySubtitle:
      "{count} Viajes • Camina • Aprende • Descubre",

    searchPlaceholder:
      "Buscar viajes, países, categorías...",

    loadingProgress:
      "Cargando progreso guardado…",

    unableLoadFavorites:
      "No se pudieron cargar los favoritos.",

    unableSaveFavorites:
      "No se pudieron guardar los favoritos. Inténtalo de nuevo.",

    continueJourneyLabel:
      "CONTINUAR VIAJE",

    complete:
      "Completado",

    continue:
      "Continuar",

    featuredJourney:
      "VIAJE DESTACADO",

    exploreJourney:
      "Explorar Viaje",

    journeysFound:
      "{count} viajes encontrados",

    noJourneys:
      "No se encontraron viajes",

    tryAnother:
      "Prueba otra búsqueda o categoría.",

    popularWeek:
      "Popular Esta Semana",

    recentlyAdded:
      "Añadidos Recientemente",

    journeySummary:
      "Resumen de Viajes",

    total:
      "Total",

    favorites:
      "Favoritos",

    premium:
      "Premium",

    categories:
      "Categorías",

    all:
      "Todos",

    sortFeatured:
      "Destacados",

    sortProgress:
      "Progreso",

    sortSteps:
      "Pasos",

    sortReward:
      "Recompensa",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    exploreWorld:
      "Explorez le Monde",

    journeySubtitle:
      "{count} Voyages • Marchez • Apprenez • Découvrez",

    searchPlaceholder:
      "Rechercher des voyages, pays, catégories...",

    loadingProgress:
      "Chargement de la progression…",

    unableLoadFavorites:
      "Impossible de charger les favoris.",

    unableSaveFavorites:
      "Impossible d'enregistrer les favoris. Réessayez.",

    continueJourneyLabel:
      "CONTINUER LE VOYAGE",

    complete:
      "Terminé",

    continue:
      "Continuer",

    featuredJourney:
      "VOYAGE EN VEDETTE",

    exploreJourney:
      "Explorer le Voyage",

    journeysFound:
      "{count} voyages trouvés",

    noJourneys:
      "Aucun voyage trouvé",

    tryAnother:
      "Essayez une autre recherche ou catégorie.",

    popularWeek:
      "Populaires Cette Semaine",

    recentlyAdded:
      "Ajoutés Récemment",

    journeySummary:
      "Résumé des Voyages",

    total:
      "Total",

    favorites:
      "Favoris",

    premium:
      "Premium",

    categories:
      "Catégories",

    all:
      "Tous",

    sortFeatured:
      "En Vedette",

    sortProgress:
      "Progrès",

    sortSteps:
      "Pas",

    sortReward:
      "Récompense",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    exploreWorld:
      "Entdecke die Welt",

    journeySubtitle:
      "{count} Reisen • Gehen • Lernen • Entdecken",

    searchPlaceholder:
      "Reisen, Länder oder Kategorien suchen...",

    loadingProgress:
      "Gespeicherten Fortschritt laden…",

    unableLoadFavorites:
      "Favoriten konnten nicht geladen werden.",

    unableSaveFavorites:
      "Favoriten konnten nicht gespeichert werden.",

    continueJourneyLabel:
      "REISE FORTSETZEN",

    complete:
      "Abgeschlossen",

    continue:
      "Fortsetzen",

    featuredJourney:
      "EMPFOHLENE REISE",

    exploreJourney:
      "Reise Entdecken",

    journeysFound:
      "{count} Reisen gefunden",

    noJourneys:
      "Keine Reisen gefunden",

    tryAnother:
      "Versuche eine andere Suche oder Kategorie.",

    popularWeek:
      "Diese Woche Beliebt",

    recentlyAdded:
      "Kürzlich Hinzugefügt",

    journeySummary:
      "Reiseübersicht",

    total:
      "Gesamt",

    favorites:
      "Favoriten",

    premium:
      "Premium",

    categories:
      "Kategorien",

    all:
      "Alle",

    sortFeatured:
      "Empfohlen",

    sortProgress:
      "Fortschritt",

    sortSteps:
      "Schritte",

    sortReward:
      "Belohnung",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    exploreWorld:
      "Explore o Mundo",

    journeySubtitle:
      "{count} Jornadas • Caminhe • Aprenda • Descubra",

    searchPlaceholder:
      "Buscar jornadas, países, categorias...",

    loadingProgress:
      "Carregando progresso salvo…",

    unableLoadFavorites:
      "Não foi possível carregar os favoritos.",

    unableSaveFavorites:
      "Não foi possível salvar os favoritos. Tente novamente.",

    continueJourneyLabel:
      "CONTINUAR JORNADA",

    complete:
      "Concluído",

    continue:
      "Continuar",

    featuredJourney:
      "JORNADA EM DESTAQUE",

    exploreJourney:
      "Explorar Jornada",

    journeysFound:
      "{count} jornadas encontradas",

    noJourneys:
      "Nenhuma jornada encontrada",

    tryAnother:
      "Tente outra busca ou categoria.",

    popularWeek:
      "Popular Esta Semana",

    recentlyAdded:
      "Adicionados Recentemente",

    journeySummary:
      "Resumo das Jornadas",

    total:
      "Total",

    favorites:
      "Favoritos",

    premium:
      "Premium",

    categories:
      "Categorias",

    all:
      "Todas",

    sortFeatured:
      "Destaques",

    sortProgress:
      "Progresso",

    sortSteps:
      "Passos",

    sortReward:
      "Recompensa",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    exploreWorld:
      "世界を探索",

    journeySubtitle:
      "{count} ジャーニー • 歩く • 学ぶ • 発見する",

    searchPlaceholder:
      "ジャーニー、国、カテゴリーを検索...",

    loadingProgress:
      "保存した進捗を読み込み中…",

    unableLoadFavorites:
      "お気に入りを読み込めませんでした。",

    unableSaveFavorites:
      "お気に入りを保存できませんでした。",

    continueJourneyLabel:
      "ジャーニーを続ける",

    complete:
      "完了",

    continue:
      "続ける",

    featuredJourney:
      "おすすめジャーニー",

    exploreJourney:
      "ジャーニーを見る",

    journeysFound:
      "{count} 件のジャーニー",

    noJourneys:
      "ジャーニーが見つかりません",

    tryAnother:
      "別の検索またはカテゴリーを試してください。",

    popularWeek:
      "今週の人気",

    recentlyAdded:
      "最近追加",

    journeySummary:
      "ジャーニー概要",

    total:
      "合計",

    favorites:
      "お気に入り",

    premium:
      "プレミアム",

    categories:
      "カテゴリー",

    all:
      "すべて",

    sortFeatured:
      "おすすめ",

    sortProgress:
      "進捗",

    sortSteps:
      "歩数",

    sortReward:
      "報酬",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    exploreWorld:
      "세계를 탐험하세요",

    journeySubtitle:
      "{count}개 여정 • 걷기 • 배우기 • 발견하기",

    searchPlaceholder:
      "여정, 국가, 카테고리 검색...",

    loadingProgress:
      "저장된 진행 상황 불러오는 중…",

    unableLoadFavorites:
      "즐겨찾기를 불러올 수 없습니다.",

    unableSaveFavorites:
      "즐겨찾기를 저장할 수 없습니다.",

    continueJourneyLabel:
      "여정 계속하기",

    complete:
      "완료",

    continue:
      "계속",

    featuredJourney:
      "추천 여정",

    exploreJourney:
      "여정 둘러보기",

    journeysFound:
      "{count}개 여정 발견",

    noJourneys:
      "여정을 찾을 수 없습니다",

    tryAnother:
      "다른 검색어나 카테고리를 사용해 보세요.",

    popularWeek:
      "이번 주 인기",

    recentlyAdded:
      "최근 추가",

    journeySummary:
      "여정 요약",

    total:
      "전체",

    favorites:
      "즐겨찾기",

    premium:
      "프리미엄",

    categories:
      "카테고리",

    all:
      "전체",

    sortFeatured:
      "추천",

    sortProgress:
      "진행",

    sortSteps:
      "걸음 수",

    sortReward:
      "보상",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    exploreWorld:
      "探索世界",

    journeySubtitle:
      "{count} 个旅程 • 步行 • 学习 • 探索",

    searchPlaceholder:
      "搜索旅程、国家或类别...",

    loadingProgress:
      "正在加载已保存的进度…",

    unableLoadFavorites:
      "无法加载收藏。",

    unableSaveFavorites:
      "无法保存收藏，请重试。",

    continueJourneyLabel:
      "继续旅程",

    complete:
      "完成",

    continue:
      "继续",

    featuredJourney:
      "精选旅程",

    exploreJourney:
      "探索旅程",

    journeysFound:
      "找到 {count} 个旅程",

    noJourneys:
      "未找到旅程",

    tryAnother:
      "请尝试其他搜索或类别。",

    popularWeek:
      "本周热门",

    recentlyAdded:
      "最近添加",

    journeySummary:
      "旅程概要",

    total:
      "总计",

    favorites:
      "收藏",

    premium:
      "高级",

    categories:
      "类别",

    all:
      "全部",

    sortFeatured:
      "精选",

    sortProgress:
      "进度",

    sortSteps:
      "步数",

    sortReward:
      "奖励",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    exploreWorld:
      "Esplora il Mondo",

    journeySubtitle:
      "{count} Percorsi • Cammina • Impara • Scopri",

    searchPlaceholder:
      "Cerca percorsi, paesi, categorie...",

    loadingProgress:
      "Caricamento dei progressi salvati…",

    unableLoadFavorites:
      "Impossibile caricare i preferiti.",

    unableSaveFavorites:
      "Impossibile salvare i preferiti. Riprova.",

    continueJourneyLabel:
      "CONTINUA IL PERCORSO",

    complete:
      "Completato",

    continue:
      "Continua",

    featuredJourney:
      "PERCORSO IN EVIDENZA",

    exploreJourney:
      "Esplora Percorso",

    journeysFound:
      "{count} percorsi trovati",

    noJourneys:
      "Nessun percorso trovato",

    tryAnother:
      "Prova un'altra ricerca o categoria.",

    popularWeek:
      "Popolari Questa Settimana",

    recentlyAdded:
      "Aggiunti di Recente",

    journeySummary:
      "Riepilogo Percorsi",

    total:
      "Totale",

    favorites:
      "Preferiti",

    premium:
      "Premium",

    categories:
      "Categorie",

    all:
      "Tutti",

    sortFeatured:
      "In Evidenza",

    sortProgress:
      "Progresso",

    sortSteps:
      "Passi",

    sortReward:
      "Premio",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    exploreWorld:
      "استكشف العالم",

    journeySubtitle:
      "{count} رحلة • امشِ • تعلّم • اكتشف",

    searchPlaceholder:
      "ابحث عن الرحلات أو الدول أو الفئات...",

    loadingProgress:
      "جارٍ تحميل التقدم المحفوظ…",

    unableLoadFavorites:
      "تعذر تحميل المفضلة.",

    unableSaveFavorites:
      "تعذر حفظ المفضلة. حاول مرة أخرى.",

    continueJourneyLabel:
      "متابعة الرحلة",

    complete:
      "مكتمل",

    continue:
      "متابعة",

    featuredJourney:
      "رحلة مميزة",

    exploreJourney:
      "استكشف الرحلة",

    journeysFound:
      "تم العثور على {count} رحلة",

    noJourneys:
      "لم يتم العثور على رحلات",

    tryAnother:
      "جرّب بحثاً أو فئة أخرى.",

    popularWeek:
      "الأكثر شعبية هذا الأسبوع",

    recentlyAdded:
      "أضيفت مؤخراً",

    journeySummary:
      "ملخص الرحلات",

    total:
      "الإجمالي",

    favorites:
      "المفضلة",

    premium:
      "مميز",

    categories:
      "الفئات",

    all:
      "الكل",

    sortFeatured:
      "مميز",

    sortProgress:
      "التقدم",

    sortSteps:
      "الخطوات",

    sortReward:
      "المكافأة",
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
// HELPER
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
    ) => {
      return Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[
              key
            ]
          )
        : match;
    }
  );
}

// ============================================================
// JOURNEYS SCREEN
// ============================================================

export default function JourneysScreen({
  language = "en",

  activeJourney,

  setSelectedJourney,

  setActiveJourney,

  goToJourneyDetail,

  goToGPSJourneyMap,

  goToSubscription,

  goToJourneyStory,

  goBack,

  subscriptionPlan = "free",
}) {
  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState(
      "All"
    );

  const [
    sortBy,
    setSortBy,
  ] =
    useState(
      "Featured"
    );

  const [
    searchText,
    setSearchText,
  ] =
    useState("");

  const [
    favorites,
    setFavorites,
  ] =
    useState([]);

  const [
    favoriteError,
    setFavoriteError,
  ] =
    useState("");

  // ==========================================================
  // TRANSLATION HELPER
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

    const text =
      central !== key
        ? central
        : JOURNEY_TRANSLATIONS?.[
            language
          ]?.[key] ??
          JOURNEY_TRANSLATIONS
            .en?.[key] ??
          key;

    return fillTemplate(
      text,
      variables
    );
  }

  // ==========================================================
  // CATEGORY LABEL
  // ==========================================================

  function categoryLabel(
    category
  ) {
    if (
      category ===
      "All"
    ) {
      return t(
        "all"
      );
    }

    return (
      CATEGORY_TRANSLATIONS?.[
        language
      ]?.[
        category
      ] ||
      category
    );
  }

  // ==========================================================
  // SORT LABEL
  // ==========================================================

  function sortLabel(
    value
  ) {
    const keys = {
      Featured:
        "sortFeatured",

      Progress:
        "sortProgress",

      Steps:
        "sortSteps",

      Reward:
        "sortReward",
    };

    return t(
      keys[value] ||
        value
    );
  }

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const display =
    useJourneyProgress(
      activeJourney
    );

  const journeyProgressMap =
    display.progressMap;

  const continueJourney =
    display.activeJourney;

  const continueProgress =
    continueJourney
      ?.progress ||
    0;

  const journeys =
    DISPLAY_JOURNEYS;

  // ==========================================================
  // COMBINE SAVED PROGRESS
  // ==========================================================

  const journeysWithRewards =
    useMemo(
      () =>
        journeys.map(
          item => {
            const saved =
              display
                .detailsMap[
                item.id
              ];

            return {
              ...item,

              totalSteps:
                saved
                  ?.totalSteps ||
                item
                  .totalSteps,

              steps:
                saved
                  ?.totalSteps ||
                item
                  .totalSteps,

              stepsCompleted:
                saved
                  ?.steps ||
                0,

              progress:
                saved
                  ?.progress ||
                0,

              journeyProgress:
                saved
                  ?.progress ||
                0,

              progressPercent:
                saved
                  ?.progress ||
                0,

              completed:
                saved
                  ?.completed ||
                false,
            };
          }
        ),

      [
        journeys,

        display
          .detailsMap,
      ]
    );

  // ==========================================================
  // LOAD FAVORITES
  // ==========================================================

  useEffect(
    () => {
      let mounted =
        true;

      AsyncStorage
        .getItem(
          "favoriteJourneys"
        )
        .then(
          raw => {
            const value =
              raw
                ? JSON.parse(
                    raw
                  )
                : [];

            if (
              mounted
            ) {
              setFavorites(
                Array.isArray(
                  value
                )
                  ? value
                  : []
              );
            }
          }
        )
        .catch(
          () => {
            if (
              mounted
            ) {
              setFavoriteError(
                t(
                  "unableLoadFavorites"
                )
              );
            }
          }
        );

      return () => {
        mounted =
          false;
      };
    },

    [
      language,
    ]
  );

  // ==========================================================
  // FAVORITES
  // ==========================================================

  async function toggleFavorite(
    id
  ) {
    const updated =
      favorites.includes(
        id
      )
        ? favorites.filter(
            item =>
              item !==
              id
          )
        : [
            ...favorites,
            id,
          ];

    setFavorites(
      updated
    );

    try {
      await AsyncStorage
        .setItem(
          "favoriteJourneys",

          JSON.stringify(
            updated
          )
        );

      setFavoriteError(
        ""
      );
    } catch {
      setFavoriteError(
        t(
          "unableSaveFavorites"
        )
      );
    }
  }

  // ==========================================================
  // TOTAL
  // ==========================================================

  const totalJourneys =
    journeysWithRewards
      .length;

  // ==========================================================
  // FEATURED JOURNEY
  // ==========================================================

  const featuredJourney =
    useMemo(
      () => {
        if (
          journeysWithRewards
            .length ===
          0
        ) {
          return null;
        }

        const day =
          new Date()
            .getDate();

        return journeysWithRewards[
          day %
            journeysWithRewards
              .length
        ];
      },

      [
        journeysWithRewards,
      ]
    );

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredJourneys =
    useMemo(
      () => {
        let data = [
          ...journeysWithRewards,
        ];

        // ------------------------------------------------------
        // FILTER
        // ------------------------------------------------------

        if (
          activeFilter ===
          "Favorites"
        ) {
          data =
            data.filter(
              item =>
                favorites.includes(
                  item.id
                )
            );
        } else if (
          activeFilter ===
          "Premium"
        ) {
          data =
            data.filter(
              item =>
                item.premium
            );
        } else if (
          activeFilter !==
          "All"
        ) {
          data =
            data.filter(
              item =>
                item.category ===
                activeFilter
            );
        }

        // ------------------------------------------------------
        // SEARCH
        // ------------------------------------------------------

        if (
          searchText.trim()
        ) {
          const q =
            searchText
              .toLowerCase();

          data =
            data.filter(
              item =>
                item.title
                  ?.toLowerCase()
                  .includes(
                    q
                  ) ||

                item.subtitle
                  ?.toLowerCase()
                  .includes(
                    q
                  ) ||

                item.category
                  ?.toLowerCase()
                  .includes(
                    q
                  ) ||

                item.country
                  ?.toLowerCase()
                  .includes(
                    q
                  )
            );
        }

        // ------------------------------------------------------
        // SORT
        // ------------------------------------------------------

        if (
          sortBy ===
          "Progress"
        ) {
          data.sort(
            (
              a,
              b
            ) =>
              Number(
                b.progress ||
                  0
              ) -
              Number(
                a.progress ||
                  0
              )
          );
        }

        if (
          sortBy ===
          "Steps"
        ) {
          data.sort(
            (
              a,
              b
            ) =>
              Number(
                b.steps ||
                  0
              ) -
              Number(
                a.steps ||
                  0
              )
          );
        }

        if (
          sortBy ===
          "Reward"
        ) {
          data.sort(
            (
              a,
              b
            ) =>
              Number(
                b.reward ||
                  0
              ) -
              Number(
                a.reward ||
                  0
              )
          );
        }

        return data;
      },

      [
        journeysWithRewards,
        activeFilter,
        searchText,
        sortBy,
        favorites,
      ]
    );

  // ==========================================================
  // POPULAR
  // ==========================================================

  const popularJourneys =
    useMemo(
      () =>
        journeysWithRewards
          .slice(
            0,
            6
          ),

      [
        journeysWithRewards,
      ]
    );

  // ==========================================================
  // RECENT
  // ==========================================================

  const newJourneys =
    useMemo(
      () =>
        journeysWithRewards
          .slice(
            -6
          )
          .reverse(),

      [
        journeysWithRewards,
      ]
    );

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function openDetail(
    journey
  ) {
    setSelectedJourney?.(
      journey
    );

    goToJourneyDetail?.(
      journey
    );
  }

  function startJourney(
    journey
  ) {
    setActiveJourney?.(
      journey
    );

    goToGPSJourneyMap?.(
      journey
    );
  }

  function openStory(
    journey
  ) {
    setSelectedJourney?.(
      journey
    );

    goToJourneyStory?.(
      journey
    );
  }

  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <ImageBackground
      source={
        COLLAGE_BG
      }
      style={
        styles.bg
      }
      resizeMode="cover"
    >
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
          {/* ==================================================
              HEADER
          ================================================== */}

          <View
            style={
              styles.header
            }
          >
            <Text
              style={
                styles.small
              }
            >
              LEGATHON WALK
            </Text>

            <Text
              style={
                styles.title
              }
              adjustsFontSizeToFit
              minimumFontScale={
                0.75
              }
            >
              {t(
                "exploreWorld"
              )}
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              {t(
                "journeySubtitle",
                {
                  count:
                    totalJourneys,
                }
              )}
            </Text>
          </View>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <View
            style={
              styles.searchBox
            }
          >
            <Text
              style={
                styles.searchIcon
              }
            >
              🔍
            </Text>

            <TextInput
              value={
                searchText
              }
              onChangeText={
                setSearchText
              }
              placeholder={
                t(
                  "searchPlaceholder"
                )
              }
              placeholderTextColor=
                "#8B98AA"
              style={
                styles.searchInput
              }
            />
          </View>

          {/* ==================================================
              STATUS / ERRORS
          ================================================== */}

          {(
            !display.ready ||
            display.error ||
            favoriteError
          ) && (
            <Text
              style={
                styles.subtitle
              }
            >
              {display.error ||
                favoriteError ||
                t(
                  "loadingProgress"
                )}
            </Text>
          )}

          {/* ==================================================
              CONTINUE JOURNEY
          ================================================== */}

          {continueJourney && (
            <TouchableOpacity
              style={
                styles.continueCard
              }
              onPress={() =>
                startJourney(
                  continueJourney
                )
              }
              activeOpacity={
                0.85
              }
            >
              <Text
                style={
                  styles.sectionMini
                }
              >
                {t(
                  "continueJourneyLabel"
                )}
              </Text>

              <Text
                style={
                  styles.continueTitle
                }
              >
                {
                  continueJourney
                    .title
                }
              </Text>

              <Text
                style={
                  styles.continueSub
                }
              >
                {continueProgress
                  .toFixed(
                    1
                  )}
                %{" "}
                {t(
                  "complete"
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
                        `${continueProgress}%`,
                    },
                  ]}
                />
              </View>

              <Text
                style={
                  styles.continueButton
                }
              >
                {t(
                  "continue"
                )}
                {"  →"}
              </Text>
            </TouchableOpacity>
          )}

          {/* ==================================================
              FEATURED JOURNEY
          ================================================== */}

          {featuredJourney && (
            <View
              style={
                styles.featuredCard
              }
            >
              <Text
                style={
                  styles.sectionMini
                }
              >
                ⭐{" "}
                {t(
                  "featuredJourney"
                )}
              </Text>

              <Text
                style={
                  styles.featuredTitle
                }
              >
                {
                  featuredJourney
                    .title
                }
              </Text>

              <Text
                style={
                  styles.featuredText
                }
              >
                {
                  featuredJourney
                    .subtitle
                }
              </Text>

              <TouchableOpacity
                style={
                  styles.featuredButton
                }
                onPress={() =>
                  openDetail(
                    featuredJourney
                  )
                }
                activeOpacity={
                  0.85
                }
              >
                <Text
                  style={
                    styles.featuredButtonText
                  }
                >
                  {t(
                    "exploreJourney"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ==================================================
              SORT
          ================================================== */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.sortRow
            }
          >
            {SORTS.map(
              item => (
                <TouchableOpacity
                  key={
                    item
                  }
                  style={[
                    styles.sortChip,

                    sortBy ===
                      item &&
                      styles.sortActive,
                  ]}
                  onPress={() =>
                    setSortBy(
                      item
                    )
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Text
                    style={[
                      styles.sortText,

                      sortBy ===
                        item &&
                        styles.sortTextActive,
                    ]}
                  >
                    {sortLabel(
                      item
                    )}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {/* ==================================================
              CATEGORY FILTER
          ================================================== */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.filterRow
            }
          >
            {CATEGORIES.map(
              item => (
                <TouchableOpacity
                  key={
                    item
                  }
                  style={[
                    styles.filterChip,

                    activeFilter ===
                      item &&
                      styles.filterActive,
                  ]}
                  onPress={() =>
                    setActiveFilter(
                      item
                    )
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Text
                    style={[
                      styles.filterText,

                      activeFilter ===
                        item &&
                        styles.filterTextActive,
                    ]}
                  >
                    {categoryLabel(
                      item
                    )}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {/* ==================================================
              RESULTS
          ================================================== */}

          <View
            style={
              styles.resultsBox
            }
          >
            <Text
              style={
                styles.resultsText
              }
            >
              {t(
                "journeysFound",
                {
                  count:
                    filteredJourneys
                      .length,
                }
              )}
            </Text>
          </View>

     {/* ==========================================================
    JOURNEY CARDS
========================================================== */}

{filteredJourneys.map((journey) => (
  <JourneyCard
    key={journey.id}

    language={language}

    item={journey}

    activeJourney={activeJourney}

    savedProgress={
      journeyProgressMap[
        String(journey.id)
      ] ?? 0
    }

    userPlan={subscriptionPlan}

    setSelectedJourney={
      setSelectedJourney
    }

    setActiveJourney={
      setActiveJourney
    }

    goDetail={() =>
      openDetail(journey)
    }

    goHome={() =>
      startJourney(journey)
    }

    goPaywall={() =>
      goToSubscription?.(
        journey
      )
    }

    isFavorite={
      favorites.includes(
        journey.id
      )
    }

    onToggleFavorite={() =>
      toggleFavorite(
        journey.id
      )
    }
  />
))}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {filteredJourneys
            .length ===
            0 && (
            <View
              style={
                styles.emptyBox
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                🌍
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                {t(
                  "noJourneys"
                )}
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                {t(
                  "tryAnother"
                )}
              </Text>
            </View>
          )}

          {/* ==================================================
              POPULAR
          ================================================== */}

          <Section
            title={
              `🔥 ${t(
                "popularWeek"
              )}`
            }
            data={
              popularJourneys
            }
          />

          {/* ==================================================
              RECENTLY ADDED
          ================================================== */}

          <Section
            title={
              `🆕 ${t(
                "recentlyAdded"
              )}`
            }
            data={
              newJourneys
            }
          />

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <View
            style={
              styles.summaryCard
            }
          >
            <Text
              style={
                styles.summaryTitle
              }
            >
              {t(
                "journeySummary"
              )}
            </Text>

            <View
              style={
                styles.summaryGrid
              }
            >
              <Summary
                label={
                  t(
                    "total"
                  )
                }
                value={
                  totalJourneys
                }
              />

              <Summary
                label={
                  t(
                    "favorites"
                  )
                }
                value={
                  favorites.length
                }
              />

              <Summary
                label={
                  t(
                    "premium"
                  )
                }
                value={
                  journeys.filter(
                    journey =>
                      journey.premium
                  ).length
                }
              />

              <Summary
                label={
                  t(
                    "categories"
                  )
                }
                value={
                  CATEGORIES.length -
                  1
                }
              />
            </View>
          </View>

          <View
            style={{
              height:
                130,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );

  // ==========================================================
  // HORIZONTAL JOURNEY SECTION
  // ==========================================================

  function Section({
    title,
    data,
  }) {
    return (
      <View
        style={
          styles.section
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          {title}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >
          {data.map(
            item => (
              <TouchableOpacity
                key={
                  item.id
                }
                style={
                  styles.miniCard
                }
                onPress={() =>
                  openDetail(
                    item
                  )
                }
                activeOpacity={
                  0.85
                }
              >
                <Text
                  style={
                    styles.miniFlag
                  }
                >
                  {item.flag ||
                    "🌍"}
                </Text>

                <Text
                  style={
                    styles.miniTitle
                  }
                  numberOfLines={
                    2
                  }
                >
                  {
                    item.title
                  }
                </Text>

                <Text
                  style={
                    styles.miniSub
                  }
                  numberOfLines={
                    2
                  }
                >
                  {categoryLabel(
                    item.category
                  )}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    );
  }

  // ==========================================================
  // SUMMARY BOX
  // ==========================================================

  function Summary({
    label,
    value,
  }) {
    return (
      <View
        style={
          styles.summaryBox
        }
      >
        <Text
          style={
            styles.summaryValue
          }
        >
          {value}
        </Text>

        <Text
          style={
            styles.summaryLabel
          }
        >
          {label}
        </Text>
      </View>
    );
  }
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    bg: {
      flex: 1,
    },

    safe: {
      flex: 1,

      backgroundColor:
        "rgba(0,0,0,0.72)",
    },

    container: {
      flex: 1,
    },

    content: {
      padding: 18,

      paddingBottom:
        160,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      marginTop:
        10,

      marginBottom:
        18,
    },

    small: {
      color:
        "#FACC15",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        5,

      marginBottom:
        8,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      fontWeight:
        "900",

      lineHeight:
        48,
    },

    subtitle: {
      color:
        "#C9D5E8",

      fontSize:
        16,

      fontWeight:
        "700",

      marginTop:
        8,
    },

    // ==========================================================
    // SEARCH
    // ==========================================================

    searchBox: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(9,16,31,0.92)",

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        "#24364D",

      paddingHorizontal:
        16,

      paddingVertical:
        12,

      marginBottom:
        18,
    },

    searchIcon: {
      fontSize:
        20,

      marginRight:
        10,
    },

    searchInput: {
      flex:
        1,

      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "700",
    },

    // ==========================================================
    // CONTINUE CARD
    // ==========================================================

    continueCard: {
      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        28,

      padding:
        20,

      borderWidth:
        1,

      borderColor:
        "#8EF8D3",

      marginBottom:
        22,
    },

    sectionMini: {
      color:
        "#FACC15",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginBottom:
        8,
    },

    continueTitle: {
      color:
        "#FFFFFF",

      fontSize:
        28,

      fontWeight:
        "900",
    },

    continueSub: {
      color:
        "#8EF8D3",

      fontWeight:
        "900",

      marginTop:
        6,

      marginBottom:
        12,
    },

    continueButton: {
      color:
        "#FACC15",

      fontSize:
        18,

      fontWeight:
        "900",

      marginTop:
        12,
    },

    progressTrack: {
      height:
        10,

      backgroundColor:
        "rgba(255,255,255,0.18)",

      borderRadius:
        999,

      overflow:
        "hidden",
    },

    progressFill: {
      height:
        "100%",

      backgroundColor:
        "#FACC15",

      borderRadius:
        999,
    },

    // ==========================================================
    // FEATURED
    // ==========================================================

    featuredCard: {
      backgroundColor:
        "rgba(8,14,27,0.94)",

      borderRadius:
        30,

      padding:
        24,

      borderWidth:
        1.5,

      borderColor:
        "#FACC15",

      marginBottom:
        22,
    },

    featuredTitle: {
      color:
        "#FFFFFF",

      fontSize:
        32,

      fontWeight:
        "900",

      marginBottom:
        8,
    },

    featuredText: {
      color:
        "#D6DFEF",

      fontSize:
        16,

      lineHeight:
        24,

      fontWeight:
        "700",

      marginBottom:
        18,
    },

    featuredButton: {
      backgroundColor:
        "#9EFFD0",

      borderRadius:
        22,

      paddingVertical:
        16,

      alignItems:
        "center",
    },

    featuredButtonText: {
      color:
        "#06121F",

      fontSize:
        17,

      fontWeight:
        "900",
    },

    // ==========================================================
    // SORT
    // ==========================================================

    sortRow: {
      marginBottom:
        12,
    },

    sortChip: {
      backgroundColor:
        "rgba(10,18,34,0.95)",

      borderRadius:
        999,

      paddingHorizontal:
        24,

      paddingVertical:
        13,

      marginRight:
        12,

      borderWidth:
        1,

      borderColor:
        "#34506B",
    },

    sortActive: {
      backgroundColor:
        "#FACC15",

      borderColor:
        "#FACC15",
    },

    sortText: {
      color:
        "#C9D5E8",

      fontWeight:
        "900",

      fontSize:
        15,
    },

    sortTextActive: {
      color:
        "#07111E",
    },

    // ==========================================================
    // FILTERS
    // ==========================================================

    filterRow: {
      marginBottom:
        18,
    },

    filterChip: {
      backgroundColor:
        "rgba(10,18,34,0.95)",

      borderRadius:
        999,

      paddingHorizontal:
        22,

      paddingVertical:
        14,

      marginRight:
        12,

      borderWidth:
        1,

      borderColor:
        "#34506B",
    },

    filterActive: {
      backgroundColor:
        "#9EFFD0",

      borderColor:
        "#9EFFD0",
    },

    filterText: {
      color:
        "#C9D5E8",

      fontWeight:
        "900",

      fontSize:
        15,
    },

    filterTextActive: {
      color:
        "#07111E",
    },

    // ==========================================================
    // RESULTS
    // ==========================================================

    resultsBox: {
      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        20,

      padding:
        18,

      marginBottom:
        20,
    },

    resultsText: {
      color:
        "#9EFFD0",

      fontSize:
        22,

      fontWeight:
        "900",
    },

    // ==========================================================
    // EMPTY STATE
    // ==========================================================

    emptyBox: {
      alignItems:
        "center",

      backgroundColor:
        "rgba(12,23,41,0.92)",

      borderRadius:
        26,

      padding:
        30,

      marginBottom:
        24,
    },

    emptyIcon: {
      fontSize:
        44,

      marginBottom:
        12,
    },

    emptyTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    emptyText: {
      color:
        "#C9D5E8",

      fontSize:
        15,

      fontWeight:
        "700",

      marginTop:
        8,

      textAlign:
        "center",
    },

    // ==========================================================
    // HORIZONTAL SECTIONS
    // ==========================================================

    section: {
      marginTop:
        8,

      marginBottom:
        24,
    },

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        14,
    },

    miniCard: {
      width:
        170,

      minHeight:
        140,

      backgroundColor:
        "rgba(12,23,41,0.94)",

      borderRadius:
        24,

      padding:
        16,

      marginRight:
        14,

      borderWidth:
        1,

      borderColor:
        "#24364D",
    },

    miniFlag: {
      fontSize:
        32,

      marginBottom:
        10,
    },

    miniTitle: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",

      marginBottom:
        6,
    },

    miniSub: {
      color:
        "#9EFFD0",

      fontSize:
        13,

      fontWeight:
        "800",
    },

    // ==========================================================
    // SUMMARY
    // ==========================================================

    summaryCard: {
      backgroundColor:
        "rgba(12,23,41,0.94)",

      borderRadius:
        28,

      padding:
        22,

      borderWidth:
        1,

      borderColor:
        "#24364D",
    },

    summaryTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        16,
    },

    summaryGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap:
        12,
    },

    summaryBox: {
      width:
        "47%",

      backgroundColor:
        "#101B2E",

      borderRadius:
        18,

      padding:
        16,

      borderWidth:
        1,

      borderColor:
        "#263A55",
    },

    summaryValue: {
      color:
        "#FACC15",

      fontSize:
        26,

      fontWeight:
        "900",
    },

    summaryLabel: {
      color:
        "#C9D5E8",

      fontSize:
        13,

      fontWeight:
        "800",

      marginTop:
        4,
    },
  });