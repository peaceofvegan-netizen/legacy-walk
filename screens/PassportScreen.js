
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
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  AppState,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import passportImages from "../data/passportImages";
import JOURNEY_CATALOG from "../data/journeyCatalog";

import { translate } from "../i18n/i18n";
import { getJourneyTranslation } from "../i18n/journeyTranslations";

// ============================================================
// LEGATHON WALK - PASSPORT SCREEN
//
// JOURNEYS ONLY - PASSPORTS
// LEGATHONS - MEDALS (SEPARATE SYSTEM)
//
// PASSPORT RULES:
//
// 0%       = LOCKED
// 1%-99%   = IN PROGRESS, PASSPORT STILL HIDDEN
// 100%     = COMPLETED, REAL PASSPORT REVEALED
//
// SELECTING A PASSPORT NEVER UNLOCKS IT.
// ============================================================

// ============================================================
// COLORS
// ============================================================

const GOLD = "#D4AF37";
const WHITE = "#FFFFFF";
const NAVY = "#081426";
const CARD = "#102038";
const MUTED = "#B9C3D6";

// ============================================================
// IMAGES
// ============================================================

const PASSPORT_BG = require(
  "../assets/passports/passport-background.png"
);

const LOCKED_PASSPORT = require(
  "../assets/locked/legacy-lock.png"
);

// ============================================================
// EXISTING STORAGE KEYS
// DO NOT CHANGE - PRESERVES SAVED JOURNEY PROGRESS
// ============================================================

const PROGRESS_STORAGE_KEY = "journeyProgressData";
const ACTIVE_JOURNEY_KEY = "activeJourney";

// ============================================================
// TRANSLATIONS
// ============================================================

const SCREEN_TEXT = {
  en: {
    back: "Back",
    hub: "LEGATHON PASSPORT HUB",
    collection: "Passport Collection",
    refresh: "↻ Refresh Progress",
    featured: "Featured Passport",
    selected: "SELECTED JOURNEY",
    stamps: "Passport Stamps",
    stampCount: "Stamps",
    completed: "Completed",
    level: "Level",
    locked: "Locked",
    inProgress: "In Progress",
    stamped: "Stamped",
    shelf: "Passport Shelf",
    world: "WORLD COLLECTION",
    collected: "Passports Completed",
    loading: "Loading passports...",
    empty: "No journeys available",
    start: "Start",
    checkpoint: "Checkpoint",
    finish: "Finish",
    untitled: "Untitled Journey",
    journey: "Legathon Journey",
    newExplorer: "New Explorer",
    explorer: "Explorer",
    pathfinder: "Pathfinder",
    trailblazer: "Trailblazer",
    legend: "Legend",
    eliteExplorer: "Elite Explorer",
  },

  es: {
    back: "Atrás",
    hub: "CENTRO DE PASAPORTES LEGATHON",
    collection: "Colección de Pasaportes",
    refresh: "↻ Actualizar Progreso",
    featured: "Pasaporte Destacado",
    selected: "VIAJE SELECCIONADO",
    stamps: "Sellos del Pasaporte",
    stampCount: "Sellos",
    completed: "Completado",
    level: "Nivel",
    locked: "Bloqueado",
    inProgress: "En Progreso",
    stamped: "Sellado",
    shelf: "Colección de Pasaportes",
    world: "COLECCIÓN MUNDIAL",
    collected: "Pasaportes Completados",
    loading: "Cargando pasaportes...",
    empty: "No hay viajes disponibles",
    start: "Inicio",
    checkpoint: "Punto",
    finish: "Final",
    untitled: "Viaje sin Título",
    journey: "Viaje Legathon",
    newExplorer: "Nuevo Explorador",
    explorer: "Explorador",
    pathfinder: "Pionero",
    trailblazer: "Precursor",
    legend: "Leyenda",
    eliteExplorer: "Explorador Elite",
  },

  fr: {
    back: "Retour",
    hub: "CENTRE DES PASSEPORTS LEGATHON",
    collection: "Collection de Passeports",
    refresh: "↻ Actualiser la Progression",
    featured: "Passeport en Vedette",
    selected: "VOYAGE SÉLECTIONNÉ",
    stamps: "Tampons du Passeport",
    stampCount: "Tampons",
    completed: "Terminé",
    level: "Niveau",
    locked: "Verrouillé",
    inProgress: "En Cours",
    stamped: "Tamponné",
    shelf: "Collection de Passeports",
    world: "COLLECTION MONDIALE",
    collected: "Passeports Terminés",
    loading: "Chargement des passeports...",
    empty: "Aucun voyage disponible",
    start: "Départ",
    checkpoint: "Étape",
    finish: "Arrivée",
    untitled: "Voyage sans Titre",
    journey: "Voyage Legathon",
    newExplorer: "Nouvel Explorateur",
    explorer: "Explorateur",
    pathfinder: "Éclaireur",
    trailblazer: "Pionnier",
    legend: "Légende",
    eliteExplorer: "Explorateur Elite",
  },

  de: {
    back: "Zurück",
    hub: "LEGATHON-PASSZENTRUM",
    collection: "Pass-Sammlung",
    refresh: "↻ Fortschritt Aktualisieren",
    featured: "Ausgewählter Pass",
    selected: "AUSGEWÄHLTE REISE",
    stamps: "Passstempel",
    stampCount: "Stempel",
    completed: "Abgeschlossen",
    level: "Level",
    locked: "Gesperrt",
    inProgress: "In Bearbeitung",
    stamped: "Gestempelt",
    shelf: "Pass-Sammlung",
    world: "WELTKOLLEKTION",
    collected: "Abgeschlossene Pässe",
    loading: "Pässe werden geladen...",
    empty: "Keine Reisen verfügbar",
    start: "Start",
    checkpoint: "Kontrollpunkt",
    finish: "Ziel",
    untitled: "Unbenannte Reise",
    journey: "Legathon-Reise",
    newExplorer: "Neuer Entdecker",
    explorer: "Entdecker",
    pathfinder: "Pfadfinder",
    trailblazer: "Wegbereiter",
    legend: "Legende",
    eliteExplorer: "Elite-Entdecker",
  },

  pt: {
    back: "Voltar",
    hub: "CENTRO DE PASSAPORTES LEGATHON",
    collection: "Coleção de Passaportes",
    refresh: "↻ Atualizar Progresso",
    featured: "Passaporte em Destaque",
    selected: "JORNADA SELECIONADA",
    stamps: "Carimbos do Passaporte",
    stampCount: "Carimbos",
    completed: "Concluído",
    level: "Nível",
    locked: "Bloqueado",
    inProgress: "Em Andamento",
    stamped: "Carimbado",
    shelf: "Coleção de Passaportes",
    world: "COLEÇÃO MUNDIAL",
    collected: "Passaportes Concluídos",
    loading: "Carregando passaportes...",
    empty: "Nenhuma jornada disponível",
    start: "Início",
    checkpoint: "Ponto",
    finish: "Final",
    untitled: "Jornada sem Título",
    journey: "Jornada Legathon",
    newExplorer: "Novo Explorador",
    explorer: "Explorador",
    pathfinder: "Desbravador",
    trailblazer: "Pioneiro",
    legend: "Lenda",
    eliteExplorer: "Explorador Elite",
  },

  ja: {
    back: "戻る",
    hub: "LEGATHON パスポートハブ",
    collection: "パスポートコレクション",
    refresh: "↻ 進捗を更新",
    featured: "注目のパスポート",
    selected: "選択したジャーニー",
    stamps: "パスポートスタンプ",
    stampCount: "スタンプ",
    completed: "完了",
    level: "レベル",
    locked: "ロック中",
    inProgress: "進行中",
    stamped: "獲得済み",
    shelf: "パスポート一覧",
    world: "ワールドコレクション",
    collected: "完了したパスポート",
    loading: "パスポートを読み込み中...",
    empty: "利用できるジャーニーがありません",
    start: "スタート",
    checkpoint: "チェックポイント",
    finish: "ゴール",
    untitled: "無題のジャーニー",
    journey: "Legathonジャーニー",
    newExplorer: "新人エクスプローラー",
    explorer: "エクスプローラー",
    pathfinder: "パスファインダー",
    trailblazer: "トレイルブレイザー",
    legend: "レジェンド",
    eliteExplorer: "Eliteエクスプローラー",
  },

  ko: {
    back: "뒤로",
    hub: "LEGATHON 패스포트 허브",
    collection: "패스포트 컬렉션",
    refresh: "↻ 진행 상황 새로고침",
    featured: "추천 패스포트",
    selected: "선택된 여정",
    stamps: "패스포트 스탬프",
    stampCount: "스탬프",
    completed: "완료",
    level: "레벨",
    locked: "잠김",
    inProgress: "진행 중",
    stamped: "획득",
    shelf: "패스포트 목록",
    world: "월드 컬렉션",
    collected: "완료한 패스포트",
    loading: "패스포트 불러오는 중...",
    empty: "사용 가능한 여정이 없습니다",
    start: "시작",
    checkpoint: "체크포인트",
    finish: "완료",
    untitled: "제목 없는 여정",
    journey: "Legathon 여정",
    newExplorer: "새 탐험가",
    explorer: "탐험가",
    pathfinder: "개척자",
    trailblazer: "선구자",
    legend: "레전드",
    eliteExplorer: "Elite 탐험가",
  },

  zh: {
    back: "返回",
    hub: "LEGATHON 护照中心",
    collection: "护照收藏",
    refresh: "↻ 刷新进度",
    featured: "精选护照",
    selected: "已选择旅程",
    stamps: "护照印章",
    stampCount: "印章",
    completed: "已完成",
    level: "等级",
    locked: "未解锁",
    inProgress: "进行中",
    stamped: "已盖章",
    shelf: "护照收藏架",
    world: "世界收藏",
    collected: "已完成护照",
    loading: "正在加载护照...",
    empty: "没有可用旅程",
    start: "起点",
    checkpoint: "检查点",
    finish: "终点",
    untitled: "未命名旅程",
    journey: "Legathon旅程",
    newExplorer: "新手探索者",
    explorer: "探索者",
    pathfinder: "开拓者",
    trailblazer: "先锋",
    legend: "传奇",
    eliteExplorer: "Elite探索者",
  },

  it: {
    back: "Indietro",
    hub: "CENTRO PASSAPORTI LEGATHON",
    collection: "Collezione Passaporti",
    refresh: "↻ Aggiorna Progressi",
    featured: "Passaporto in Evidenza",
    selected: "PERCORSO SELEZIONATO",
    stamps: "Timbri del Passaporto",
    stampCount: "Timbri",
    completed: "Completato",
    level: "Livello",
    locked: "Bloccato",
    inProgress: "In Corso",
    stamped: "Timbrato",
    shelf: "Collezione Passaporti",
    world: "COLLEZIONE MONDIALE",
    collected: "Passaporti Completati",
    loading: "Caricamento passaporti...",
    empty: "Nessun percorso disponibile",
    start: "Inizio",
    checkpoint: "Checkpoint",
    finish: "Fine",
    untitled: "Percorso senza Titolo",
    journey: "Percorso Legathon",
    newExplorer: "Nuovo Esploratore",
    explorer: "Esploratore",
    pathfinder: "Apripista",
    trailblazer: "Pioniere",
    legend: "Leggenda",
    eliteExplorer: "Esploratore Elite",
  },

  ar: {
    back: "رجوع",
    hub: "مركز جوازات LEGATHON",
    collection: "مجموعة جوازات السفر",
    refresh: "↻ تحديث التقدم",
    featured: "جواز السفر المميز",
    selected: "الرحلة المختارة",
    stamps: "أختام جواز السفر",
    stampCount: "الأختام",
    completed: "مكتمل",
    level: "المستوى",
    locked: "مغلق",
    inProgress: "قيد التقدم",
    stamped: "مختوم",
    shelf: "مجموعة جوازات السفر",
    world: "المجموعة العالمية",
    collected: "جوازات مكتملة",
    loading: "جارٍ تحميل جوازات السفر...",
    empty: "لا توجد رحلات متاحة",
    start: "البداية",
    checkpoint: "النقطة",
    finish: "النهاية",
    untitled: "رحلة بدون عنوان",
    journey: "رحلة Legathon",
    newExplorer: "مستكشف جديد",
    explorer: "مستكشف",
    pathfinder: "مكتشف المسار",
    trailblazer: "رائد",
    legend: "أسطورة",
    eliteExplorer: "مستكشف Elite",
  },
};

// ============================================================
// TRANSLATION HELPER
// ============================================================

function getText(language, key) {
  const local =
    SCREEN_TEXT[language]?.[key] ||
    SCREEN_TEXT.en[key];

  if (local) return local;

  const central = translate(language, key);

  return central && central !== key ? central : key;
}

// ============================================================
// SAFE DATA HELPERS
// ============================================================

function safeParse(value, fallback = null) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log("Passport JSON parse error:", error);
    return fallback;
  }
}

function clampProgress(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.max(0, Math.min(100, number));
}

// ============================================================
// COMPLETION - ONE RULE USED EVERYWHERE
// ============================================================

function readProgress(record) {
  if (typeof record === "number") {
    return clampProgress(record);
  }

  if (!record || typeof record !== "object") {
    return 0;
  }

  if (
    record.completed === true ||
    record.isCompleted === true ||
    record.status === "completed"
  ) {
    return 100;
  }

  return clampProgress(
    record.progress ??
      record.journeyProgress ??
      record.progressPercent ??
      record.percentComplete ??
      0
  );
}

function getPassportStatus(progress) {
  const value = clampProgress(progress);

  if (value >= 100) return "completed";
  if (value > 0) return "inProgress";

  return "locked";
}

function isPassportUnlocked(passport) {
  return getPassportStatus(passport?.progress) === "completed";
}

// ============================================================
// JOURNEY ID
// ============================================================

function getJourneyId(record) {
  const id =
    record?.id ??
    record?.journeyId ??
    record?.routeKey;

  if (id === null || id === undefined) {
    return "";
  }

  return String(id);
}

// ============================================================
// COMPLETION DATES
// ============================================================

function readCompletionDate(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const date =
    record.completedAt ??
    record.completionDate ??
    record.completedDate ??
    record.finishedAt ??
    null;

  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    return date.toLocaleDateString(language, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date.toDateString();
  }
}

// ============================================================
// CREATE JOURNEY PROGRESS MAP
// ============================================================

function createProgressMap(savedData) {
  const map = {};

  function register(id, record) {
    if (!id) return;

    const progress = readProgress(record);
    const previous = map[id];

    map[id] = {
      progress: Math.max(
        previous?.progress || 0,
        progress
      ),
      completedAt:
        readCompletionDate(record) ||
        previous?.completedAt ||
        null,
    };
  }

  if (Array.isArray(savedData)) {
    savedData.forEach(record => {
      register(getJourneyId(record), record);
    });

    return map;
  }

  if (savedData && typeof savedData === "object") {
    const singleId = getJourneyId(savedData);

    if (singleId) {
      register(singleId, savedData);
      return map;
    }

    Object.entries(savedData).forEach(([id, record]) => {
      register(String(id), record);
    });
  }

  return map;
}

// ============================================================
// CHECKPOINT STAMPS
// ============================================================

function getUnlockedStampCount(progress) {
  const value = clampProgress(progress);

  // At 0%, NO stamps are earned.
  if (value <= 0) return 0;

  if (value >= 100) return 5;
  if (value >= 75) return 4;
  if (value >= 50) return 3;
  if (value >= 25) return 2;

  return 1;
}

function buildJourneyStamps(journey, t) {
  const defaults = [
    t("start"),
    `${t("checkpoint")} 2`,
    `${t("checkpoint")} 3`,
    `${t("checkpoint")} 4`,
    t("finish"),
  ];

  const source =
    Array.isArray(journey?.stamps) && journey.stamps.length
      ? journey.stamps
      : Array.isArray(journey?.checkpoints)
      ? journey.checkpoints
      : [];

  return defaults.map((fallback, index) => {
    const item = source[index];

    if (typeof item === "string") {
      if (/^Start$/i.test(item)) return t("start");
      if (/^Finish$/i.test(item)) return t("finish");

      if (/^Checkpoint\s+[2-4]$/i.test(item)) {
        return `${t("checkpoint")} ${index + 1}`;
      }

      return item;
    }

    return (
      item?.title ||
      item?.name ||
      item?.label ||
      fallback
    );
  });
}

// ============================================================
// EXPLORER RANK
// ============================================================

function getExplorerRank(completed) {
  if (completed >= 75) return "eliteExplorer";
  if (completed >= 50) return "legend";
  if (completed >= 25) return "trailblazer";
  if (completed >= 10) return "pathfinder";
  if (completed >= 1) return "explorer";

  return "newExplorer";
}

// ============================================================
// PASSPORT ARTWORK
//
// IMPORTANT:
// ACTUAL PASSPORT IMAGE ONLY USED AT 100%.
// ============================================================

function PassportArtwork({
  passport,
  style,
  resizeMode = "contain",
}) {
  const unlocked = isPassportUnlocked(passport);

  // A locked or in-progress journey uses
  // ONLY the official LOCKED artwork.
  const source = unlocked
    ? passport.cover
    : LOCKED_PASSPORT;

  if (!source) {
    return (
      <View style={[style, styles.fallbackImage]}>
        <Text style={styles.fallbackEmoji}>
          🛂
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
    />
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function PassportScreen({
  language = "en",
  goBack,
  userName = "Explorer",
  activeJourney = null,
}) {
  const t = useCallback(
    key => getText(language, key),
    [language]
  );

  const [progressMap, setProgressMap] = useState({});
  const [selectedPassportId, setSelectedPassportId] =
    useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD SAVED JOURNEY PROGRESS
  // ==========================================================

  const loadPassportProgress = useCallback(async () => {
    try {
      setLoading(true);

      const values = await AsyncStorage.multiGet([
        PROGRESS_STORAGE_KEY,
        ACTIVE_JOURNEY_KEY,
      ]);

      const savedProgress = safeParse(
        values[0]?.[1],
        []
      );

      const savedActive = safeParse(
        values[1]?.[1],
        null
      );

      const nextMap = createProgressMap(savedProgress);

      // Merge active Journey progress, but never use
      // a selected passport as an unlock trigger.
      [savedActive, activeJourney].forEach(record => {
        const id = getJourneyId(record);

        if (!id) return;

        const previous = nextMap[id] || {};

        nextMap[id] = {
          progress: Math.max(
            previous.progress || 0,
            readProgress(record)
          ),
          completedAt:
            readCompletionDate(record) ||
            previous.completedAt ||
            null,
        };
      });

      setProgressMap(nextMap);
    } catch (error) {
      console.log(
        "Passport progress load error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [activeJourney]);

  useEffect(() => {
    loadPassportProgress();
  }, [loadPassportProgress]);

  // ==========================================================
  // REFRESH WHEN APP RETURNS TO FOREGROUND
  // ==========================================================

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      state => {
        if (state === "active") {
          loadPassportProgress();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [loadPassportProgress]);

  // ==========================================================
  // BUILD PASSPORT CATALOG
  // ==========================================================

  const passports = useMemo(() => {
    const catalog = Array.isArray(JOURNEY_CATALOG)
      ? JOURNEY_CATALOG
      : [];

    return catalog.map((journey, index) => {
      const id =
        getJourneyId(journey) ||
        `journey-${index}`;

      const localized =
        getJourneyTranslation(journey, language) ||
        journey;

      const record = progressMap[id] || {};

      const progress = clampProgress(
        record.progress || 0
      );

      const cover =
        passportImages[id] ||
        journey?.passportCover ||
        journey?.passportImage ||
        journey?.image ||
        journey?.routeImage ||
        null;

      return {
        ...journey,
        id,

        title:
          localized?.title ||
          journey?.title ||
          t("untitled"),

        subtitle:
          localized?.subtitle ||
          journey?.subtitle ||
          journey?.category ||
          t("journey"),

        progress,
        status: getPassportStatus(progress),

        completedAt:
          progress >= 100
            ? record.completedAt
            : null,

        cover,
        stamps: buildJourneyStamps(journey, t),
      };
    });
  }, [progressMap, language, t]);

  // ==========================================================
  // SELECT DEFAULT PASSPORT
  // ==========================================================

  useEffect(() => {
    if (!passports.length) {
      setSelectedPassportId(null);
      return;
    }

    const exists = passports.some(
      passport => passport.id === selectedPassportId
    );

    if (!exists) {
      const preferred =
        passports.find(
          item =>
            item.progress > 0 &&
            item.progress < 100
        ) ||
        passports.find(
          item => item.progress >= 100
        ) ||
        passports[0];

      setSelectedPassportId(preferred.id);
    }
  }, [passports, selectedPassportId]);

  // ==========================================================
  // SELECTED PASSPORT
  // ==========================================================

  const selectedPassport = useMemo(() => {
    return (
      passports.find(
        passport => passport.id === selectedPassportId
      ) ||
      passports[0] ||
      null
    );
  }, [passports, selectedPassportId]);

  // ==========================================================
  // STATS
  // ==========================================================

  const completedJourneys = useMemo(() => {
    return passports.filter(
      passport => isPassportUnlocked(passport)
    ).length;
  }, [passports]);

  const earnedStamps = useMemo(() => {
    return passports.reduce(
      (total, passport) =>
        total + getUnlockedStampCount(passport.progress),
      0
    );
  }, [passports]);

  const explorerLevel = completedJourneys + 1;

  const explorerRank = t(
    getExplorerRank(completedJourneys)
  );

  const selectedStampCount = selectedPassport
    ? getUnlockedStampCount(selectedPassport.progress)
    : 0;

  // ==========================================================
  // STATUS LABEL
  // ==========================================================

  const getStatusLabel = useCallback(
    passport => {
      const status = getPassportStatus(
        passport?.progress
      );

      if (status === "completed") {
        return t("completed");
      }

      if (status === "inProgress") {
        return t("inProgress");
      }

      return t("locked");
    },
    [t]
  );

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <ImageBackground
      source={PASSPORT_BG}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* BACK BUTTON */}

            {!!goBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={goBack}
              >
                <Text style={styles.backText}>
                  ← {t("back")}
                </Text>
              </TouchableOpacity>
            )}

            {/* HEADER */}

            <Text style={styles.kicker}>
              {t("hub")}
            </Text>

            <Text
              style={styles.title}
              numberOfLines={3}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {t("collection")}
            </Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadPassportProgress}
              activeOpacity={0.85}
            >
              <Text style={styles.refreshText}>
                {t("refresh")}
              </Text>
            </TouchableOpacity>

            {/* EXPLORER PROFILE */}

            <View style={styles.explorerCard}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarIcon}>
                  👤
                </Text>
              </View>

              <Text
                style={styles.name}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {userName}
              </Text>

              <Text style={styles.rank}>
                {explorerRank}
              </Text>

              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {earnedStamps}
                  </Text>
                  <Text style={styles.profileLabel}>
                    {t("stampCount")}
                  </Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {completedJourneys}
                  </Text>
                  <Text style={styles.profileLabel}>
                    {t("completed")}
                  </Text>
                </View>

                <View style={styles.profileStat}>
                  <Text style={styles.profileNumber}>
                    {explorerLevel}
                  </Text>
                  <Text style={styles.profileLabel}>
                    {t("level")}
                  </Text>
                </View>
              </View>
            </View>

            {/* LOADING */}

            {loading ? (
              <View style={styles.openPassportCard}>
                <Text style={styles.sectionTitleSmall}>
                  {t("loading")}
                </Text>
              </View>
            ) : !selectedPassport ? (
              <View style={styles.openPassportCard}>
                <Text style={styles.sectionTitleSmall}>
                  {t("empty")}
                </Text>
              </View>
            ) : (
              <>
                {/* ============================================
                    FEATURED PASSPORT
                ============================================ */}

                <Text style={styles.sectionTitle}>
                  {t("featured")}
                </Text>

                <View style={styles.featuredPassportCard}>
                  <PassportArtwork
                    passport={selectedPassport}
                    style={styles.featuredPassportImage}
                    resizeMode="contain"
                  />

                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredLabel}>
                      {t("selected")}
                    </Text>

                    <Text
                      style={styles.featuredTitle}
                      numberOfLines={3}
                      adjustsFontSizeToFit
                      minimumFontScale={0.65}
                    >
                      {selectedPassport.title}
                    </Text>

                    <Text
                      style={styles.featuredSub}
                      numberOfLines={3}
                    >
                      {selectedPassport.subtitle}
                    </Text>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width:
                              `${selectedPassport.progress}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.featuredProgress}>
                      {selectedPassport.status === "locked"
                        ? t("locked").toUpperCase()
                        : selectedPassport.status === "completed"
                        ? `100% ${t("completed")}`
                        : `${Math.round(
                            selectedPassport.progress
                          )}% ${t("inProgress")}`}
                    </Text>

                    {isPassportUnlocked(selectedPassport) &&
                      !!selectedPassport.completedAt && (
                        <Text style={styles.completedDate}>
                          {formatDate(
                            selectedPassport.completedAt,
                            language
                          )}
                        </Text>
                      )}
                  </View>
                </View>

                {/* ============================================
                    FIVE PASSPORT STAMPS
                ============================================ */}

                <View style={styles.openPassportCard}>
                  <Text style={styles.sectionTitleSmall}>
                    {t("stamps")}
                  </Text>

                  <View style={styles.stampList}>
                    {selectedPassport.stamps.map(
                      (stamp, index) => {
                        const unlocked =
                          selectedPassport.progress > 0 &&
                          index < selectedStampCount;

                        return (
                          <View
                            key={
                              `${selectedPassport.id}-${index}`
                            }
                            style={[
                              styles.stampRow,
                              unlocked
                                ? styles.stampRowUnlocked
                                : styles.stampRowLocked,
                            ]}
                          >
                            <View
                              style={[
                                styles.stampSeal,
                                unlocked
                                  ? styles.stampSealUnlocked
                                  : styles.stampSealLocked,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.stampSealText,
                                  !unlocked && {
                                    color: "#94A3B8",
                                  },
                                ]}
                              >
                                {index + 1}
                              </Text>
                            </View>

                            <View style={styles.stampTextBox}>
                              <Text
                                style={styles.stampTitle}
                                numberOfLines={3}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                              >
                                {stamp}
                              </Text>

                              <Text
                                style={[
                                  styles.stampStatus,
                                  unlocked &&
                                    styles.stampStatusUnlocked,
                                ]}
                              >
                                {unlocked
                                  ? t("stamped")
                                  : t("locked")}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* ============================================
                    PASSPORT COLLECTION HEADER
                ============================================ */}

                <View style={styles.collectionHeader}>
                  <View style={styles.collectionHeaderText}>
                    <Text style={styles.collectionKicker}>
                      {t("world")}
                    </Text>

                    <Text style={styles.collectionTitle}>
                      {t("shelf")}
                    </Text>
                  </View>

                  <View style={styles.counterCircle}>
                    <Text style={styles.counterText}>
                      {completedJourneys}
                    </Text>
                  </View>
                </View>

                <Text style={styles.collectionSubtext}>
                  {completedJourneys} / {passports.length}{" "}
                  {t("collected")}
                </Text>

                {/* ============================================
                    PASSPORT SHELF - TWO COLUMNS
                ============================================ */}

                <View style={styles.shelfGrid}>
                  {passports.map(passport => {
                    const selected =
                      passport.id === selectedPassport.id;

                    const completed =
                      isPassportUnlocked(passport);

                    const inProgress =
                      passport.status === "inProgress";

                    const completedDate = formatDate(
                      passport.completedAt,
                      language
                    );

                    return (
                      <TouchableOpacity
                        key={passport.id}
                        style={[
                          styles.shelfCard,
                          selected && styles.shelfCardActive,
                          completed && styles.shelfCardCompleted,
                        ]}
                        activeOpacity={0.88}
                        onPress={() => {
                          // Selection ONLY.
                          // This does not award or unlock a passport.
                          setSelectedPassportId(passport.id);
                        }}
                      >
                        <View style={styles.shelfImageWrap}>
                          <PassportArtwork
                            passport={passport}
                            style={styles.shelfImage}
                            resizeMode="contain"
                          />
                        </View>

                        <View style={styles.shelfInfo}>
                          <View style={styles.shelfTitleBox}>
                            <Text
                              style={styles.shelfTitle}
                              numberOfLines={2}
                              adjustsFontSizeToFit
                              minimumFontScale={0.62}
                            >
                              {passport.title}
                            </Text>
                          </View>

                          <Text
                            style={[
                              styles.shelfStatus,
                              completed &&
                                styles.shelfStatusCompleted,
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {getStatusLabel(
                              passport
                            ).toUpperCase()}
                          </Text>

                          {inProgress && (
                            <Text style={styles.shelfProgress}>
                              {Math.round(passport.progress)}%
                            </Text>
                          )}

                          {completed && !!completedDate && (
                            <Text
                              style={styles.shelfDate}
                              numberOfLines={1}
                            >
                              {completedDate}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
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
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.28)",
  },

  safe: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 170,
  },

  // ==========================================================
  // BACK / REFRESH
  // ==========================================================

  backButton: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },

  backText: {
    color: GOLD,
    fontSize: 24,
    fontWeight: "900",
  },

  refreshButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
    paddingVertical: 9,
    paddingHorizontal: 2,
  },

  refreshText: {
    color: GOLD,
    fontSize: 19,
    fontWeight: "900",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  kicker: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  title: {
    color: WHITE,
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    marginBottom: 12,
  },

  // ==========================================================
  // EXPLORER PROFILE
  // ==========================================================

  explorerCard: {
    backgroundColor: "rgba(8,18,34,0.84)",
    borderColor: GOLD,
    borderWidth: 2,
    borderRadius: 34,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },

  avatarWrap: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,175,55,0.12)",
    marginBottom: 14,
  },

  avatarIcon: {
    fontSize: 54,
  },

  name: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  rank: {
    color: GOLD,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 18,
    textAlign: "center",
  },

  profileStats: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  profileStat: {
    width: "31%",
    minHeight: 92,
    backgroundColor: "rgba(8,18,34,0.92)",
    borderColor: "rgba(212,175,55,0.55)",
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  profileNumber: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
  },

  profileLabel: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },

  // ==========================================================
  // TITLES
  // ==========================================================

  sectionTitle: {
    color: WHITE,
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 18,
  },

  sectionTitleSmall: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  // ==========================================================
  // FEATURED PASSPORT
  // ==========================================================

  featuredPassportCard: {
    height: 430,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: GOLD,
    marginBottom: 30,
    backgroundColor: NAVY,
  },

  featuredPassportImage: {
    width: "100%",
    height: "100%",
  },

  featuredOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "rgba(2,6,23,0.78)",
  },

  featuredLabel: {
    color: GOLD,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  featuredTitle: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "900",
  },

  featuredSub: {
    color: MUTED,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 18,
  },

  progressBar: {
    height: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    marginBottom: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: GOLD,
    borderRadius: 20,
  },

  featuredProgress: {
    color: GOLD,
    fontSize: 24,
    fontWeight: "900",
  },

  completedDate: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  // ==========================================================
  // FALLBACK
  // ==========================================================

  fallbackImage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAVY,
  },

  fallbackEmoji: {
    fontSize: 45,
  },

  // ==========================================================
  // CHECKPOINT STAMPS
  // ==========================================================

  openPassportCard: {
    backgroundColor: "rgba(8,18,34,0.86)",
    borderColor: "rgba(212,175,55,0.55)",
    borderWidth: 1,
    borderRadius: 34,
    padding: 18,
    marginBottom: 34,
  },

  stampList: {
    gap: 14,
  },

  stampRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    padding: 14,
    borderWidth: 1,
  },

  stampRowUnlocked: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderColor: "rgba(212,175,55,0.7)",
  },

  stampRowLocked: {
    backgroundColor: "rgba(15,23,42,0.45)",
    borderColor: "rgba(255,255,255,0.12)",
    opacity: 0.55,
  },

  stampSeal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  stampSealUnlocked: {
    backgroundColor: GOLD,
    borderWidth: 4,
    borderColor: WHITE,
  },

  stampSealLocked: {
    backgroundColor: "#1F2937",
    borderWidth: 3,
    borderColor: "#64748B",
  },

  stampSealText: {
    color: "#020617",
    fontSize: 28,
    fontWeight: "900",
  },

  stampTextBox: {
    flex: 1,
  },

  stampTitle: {
    color: WHITE,
    fontSize: 26,
    fontWeight: "900",
  },

  stampStatus: {
    color: MUTED,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },

  stampStatusUnlocked: {
    color: GOLD,
  },

  // ==========================================================
  // COLLECTION HEADER
  // ==========================================================

  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  collectionHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  collectionKicker: {
    color: GOLD,
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: "900",
    marginBottom: 7,
  },

  collectionTitle: {
    color: WHITE,
    fontSize: 34,
    fontWeight: "900",
  },

  counterCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: "#020617",
    fontSize: 27,
    fontWeight: "900",
  },

  collectionSubtext: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 24,
  },

  // ==========================================================
  // PASSPORT SHELF - FIXED TWO-COLUMN LAYOUT
  // ==========================================================

  shelfGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  // Every card has exactly the same height.
  shelfCard: {
    width: "48%",
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(105,140,190,0.45)",
    marginBottom: 18,
  },

  shelfCardActive: {
    borderColor: GOLD,
    borderWidth: 2,
  },

  shelfCardCompleted: {
    borderColor: "rgba(212,175,55,0.85)",
  },

  // Every image has exactly the same size.
  shelfImageWrap: {
    height: 185,
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#020617",
  },

  shelfImage: {
    width: "100%",
    height: "100%",
  },

  // Fixed content area prevents titles from
  // changing card heights or status positions.
  shelfInfo: {
    height: 100,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  shelfTitleBox: {
    height: 51,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  shelfTitle: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
  },

  shelfStatus: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 4,
  },

  shelfStatusCompleted: {
    color: GOLD,
  },

  shelfProgress: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },

  shelfDate: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 3,
  },
});
