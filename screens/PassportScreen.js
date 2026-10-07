// screens/PassportScreen.js

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
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import passportImages from
  "../data/passportImages";

import JOURNEY_CATALOG from
  "../data/journeyCatalog";

import {
  translate,
} from "../i18n/i18n";

import {
  getJourneyTranslation,
} from "../i18n/journeyTranslations";

// ============================================================
// ASSETS
// ============================================================

const PASSPORT_BG = require(
  "../assets/passports/passport-background.png"
);

// ============================================================
// STORAGE
// ============================================================

const PROGRESS_STORAGE_KEY =
  "journeyProgressData";

const ACTIVE_JOURNEY_KEY =
  "activeJourney";

// ============================================================
// PASSPORT TRANSLATIONS
// ============================================================

const PASSPORT_TEXT = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    back: "Back",
    passportHub: "LEGATHON PASSPORT HUB",
    passportCollection: "Passport Collection",
    refreshProgress: "↻ Refresh Progress",

    stamps: "Stamps",
    completed: "Completed",
    level: "Level",

    loadingPassports: "Loading passports...",
    noJourneys: "No journeys available",
    addJourneys:
      "Add journeys to journeyCatalog.js.",

    featuredPassport: "Featured Passport",
    selectedJourney: "SELECTED JOURNEY",
    complete: "Complete",

    passportStamps: "Passport Stamps",
    stamped: "Stamped",
    locked: "Locked",

    passportShelf: "Passport Shelf",

    start: "Start",
    checkpoint: "Checkpoint {count}",
    finish: "Finish",

    untitledJourney: "Untitled Journey",
    legathonJourney: "Legathon Journey",

    newExplorer: "New Explorer",
    explorer: "Explorer",
    pathfinder: "Pathfinder",
    trailblazer: "Trailblazer",
    legend: "Legend",
    eliteExplorer: "Elite Explorer",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    back: "Atrás",
    passportHub: "CENTRO DE PASAPORTES LEGATHON",
    passportCollection: "Colección de Pasaportes",
    refreshProgress: "↻ Actualizar Progreso",

    stamps: "Sellos",
    completed: "Completados",
    level: "Nivel",

    loadingPassports: "Cargando pasaportes...",
    noJourneys: "No hay viajes disponibles",
    addJourneys:
      "Agrega viajes a journeyCatalog.js.",

    featuredPassport: "Pasaporte Destacado",
    selectedJourney: "VIAJE SELECCIONADO",
    complete: "Completado",

    passportStamps: "Sellos del Pasaporte",
    stamped: "Sellado",
    locked: "Bloqueado",

    passportShelf: "Colección de Pasaportes",

    start: "Inicio",
    checkpoint: "Punto {count}",
    finish: "Final",

    untitledJourney: "Viaje sin Título",
    legathonJourney: "Viaje Legathon",

    newExplorer: "Nuevo Explorador",
    explorer: "Explorador",
    pathfinder: "Pionero",
    trailblazer: "Precursor",
    legend: "Leyenda",
    eliteExplorer: "Explorador Elite",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    back: "Retour",
    passportHub: "CENTRE DES PASSEPORTS LEGATHON",
    passportCollection: "Collection de Passeports",
    refreshProgress: "↻ Actualiser la Progression",

    stamps: "Tampons",
    completed: "Terminés",
    level: "Niveau",

    loadingPassports: "Chargement des passeports...",
    noJourneys: "Aucun voyage disponible",
    addJourneys:
      "Ajoutez des voyages dans journeyCatalog.js.",

    featuredPassport: "Passeport en Vedette",
    selectedJourney: "VOYAGE SÉLECTIONNÉ",
    complete: "Terminé",

    passportStamps: "Tampons du Passeport",
    stamped: "Tamponné",
    locked: "Verrouillé",

    passportShelf: "Collection de Passeports",

    start: "Départ",
    checkpoint: "Étape {count}",
    finish: "Arrivée",

    untitledJourney: "Voyage sans Titre",
    legathonJourney: "Voyage Legathon",

    newExplorer: "Nouvel Explorateur",
    explorer: "Explorateur",
    pathfinder: "Éclaireur",
    trailblazer: "Pionnier",
    legend: "Légende",
    eliteExplorer: "Explorateur Elite",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    back: "Zurück",
    passportHub: "LEGATHON-PASSZENTRUM",
    passportCollection: "Pass-Sammlung",
    refreshProgress: "↻ Fortschritt Aktualisieren",

    stamps: "Stempel",
    completed: "Abgeschlossen",
    level: "Level",

    loadingPassports: "Pässe werden geladen...",
    noJourneys: "Keine Reisen verfügbar",
    addJourneys:
      "Füge Reisen zu journeyCatalog.js hinzu.",

    featuredPassport: "Ausgewählter Pass",
    selectedJourney: "AUSGEWÄHLTE REISE",
    complete: "Abgeschlossen",

    passportStamps: "Passstempel",
    stamped: "Gestempelt",
    locked: "Gesperrt",

    passportShelf: "Pass-Sammlung",

    start: "Start",
    checkpoint: "Kontrollpunkt {count}",
    finish: "Ziel",

    untitledJourney: "Unbenannte Reise",
    legathonJourney: "Legathon-Reise",

    newExplorer: "Neuer Entdecker",
    explorer: "Entdecker",
    pathfinder: "Pfadfinder",
    trailblazer: "Wegbereiter",
    legend: "Legende",
    eliteExplorer: "Elite-Entdecker",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    back: "Voltar",
    passportHub: "CENTRO DE PASSAPORTES LEGATHON",
    passportCollection: "Coleção de Passaportes",
    refreshProgress: "↻ Atualizar Progresso",

    stamps: "Carimbos",
    completed: "Concluídos",
    level: "Nível",

    loadingPassports: "Carregando passaportes...",
    noJourneys: "Nenhuma jornada disponível",
    addJourneys:
      "Adicione jornadas ao journeyCatalog.js.",

    featuredPassport: "Passaporte em Destaque",
    selectedJourney: "JORNADA SELECIONADA",
    complete: "Concluído",

    passportStamps: "Carimbos do Passaporte",
    stamped: "Carimbado",
    locked: "Bloqueado",

    passportShelf: "Coleção de Passaportes",

    start: "Início",
    checkpoint: "Ponto {count}",
    finish: "Final",

    untitledJourney: "Jornada sem Título",
    legathonJourney: "Jornada Legathon",

    newExplorer: "Novo Explorador",
    explorer: "Explorador",
    pathfinder: "Desbravador",
    trailblazer: "Pioneiro",
    legend: "Lenda",
    eliteExplorer: "Explorador Elite",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    back: "戻る",
    passportHub: "LEGATHON パスポートハブ",
    passportCollection: "パスポートコレクション",
    refreshProgress: "↻ 進捗を更新",

    stamps: "スタンプ",
    completed: "完了",
    level: "レベル",

    loadingPassports: "パスポートを読み込み中...",
    noJourneys: "利用できるジャーニーがありません",
    addJourneys:
      "journeyCatalog.js にジャーニーを追加してください。",

    featuredPassport: "注目のパスポート",
    selectedJourney: "選択したジャーニー",
    complete: "完了",

    passportStamps: "パスポートスタンプ",
    stamped: "獲得済み",
    locked: "ロック中",

    passportShelf: "パスポート一覧",

    start: "スタート",
    checkpoint: "チェックポイント {count}",
    finish: "ゴール",

    untitledJourney: "無題のジャーニー",
    legathonJourney: "Legathonジャーニー",

    newExplorer: "新人エクスプローラー",
    explorer: "エクスプローラー",
    pathfinder: "パスファインダー",
    trailblazer: "トレイルブレイザー",
    legend: "レジェンド",
    eliteExplorer: "Eliteエクスプローラー",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    back: "뒤로",
    passportHub: "LEGATHON 패스포트 허브",
    passportCollection: "패스포트 컬렉션",
    refreshProgress: "↻ 진행 상황 새로고침",

    stamps: "스탬프",
    completed: "완료",
    level: "레벨",

    loadingPassports: "패스포트 불러오는 중...",
    noJourneys: "사용 가능한 여정이 없습니다",
    addJourneys:
      "journeyCatalog.js에 여정을 추가하세요.",

    featuredPassport: "추천 패스포트",
    selectedJourney: "선택된 여정",
    complete: "완료",

    passportStamps: "패스포트 스탬프",
    stamped: "획득",
    locked: "잠김",

    passportShelf: "패스포트 목록",

    start: "시작",
    checkpoint: "체크포인트 {count}",
    finish: "완료",

    untitledJourney: "제목 없는 여정",
    legathonJourney: "Legathon 여정",

    newExplorer: "새 탐험가",
    explorer: "탐험가",
    pathfinder: "개척자",
    trailblazer: "선구자",
    legend: "레전드",
    eliteExplorer: "Elite 탐험가",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    back: "返回",
    passportHub: "LEGATHON 护照中心",
    passportCollection: "护照收藏",
    refreshProgress: "↻ 刷新进度",

    stamps: "印章",
    completed: "已完成",
    level: "等级",

    loadingPassports: "正在加载护照...",
    noJourneys: "没有可用旅程",
    addJourneys:
      "请在 journeyCatalog.js 中添加旅程。",

    featuredPassport: "精选护照",
    selectedJourney: "已选择旅程",
    complete: "完成",

    passportStamps: "护照印章",
    stamped: "已盖章",
    locked: "未解锁",

    passportShelf: "护照收藏架",

    start: "起点",
    checkpoint: "检查点 {count}",
    finish: "终点",

    untitledJourney: "未命名旅程",
    legathonJourney: "Legathon旅程",

    newExplorer: "新手探索者",
    explorer: "探索者",
    pathfinder: "开拓者",
    trailblazer: "先锋",
    legend: "传奇",
    eliteExplorer: "Elite探索者",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    back: "Indietro",
    passportHub: "CENTRO PASSAPORTI LEGATHON",
    passportCollection: "Collezione Passaporti",
    refreshProgress: "↻ Aggiorna Progressi",

    stamps: "Timbri",
    completed: "Completati",
    level: "Livello",

    loadingPassports: "Caricamento passaporti...",
    noJourneys: "Nessun percorso disponibile",
    addJourneys:
      "Aggiungi percorsi a journeyCatalog.js.",

    featuredPassport: "Passaporto in Evidenza",
    selectedJourney: "PERCORSO SELEZIONATO",
    complete: "Completato",

    passportStamps: "Timbri del Passaporto",
    stamped: "Timbrato",
    locked: "Bloccato",

    passportShelf: "Collezione Passaporti",

    start: "Inizio",
    checkpoint: "Checkpoint {count}",
    finish: "Fine",

    untitledJourney: "Percorso senza Titolo",
    legathonJourney: "Percorso Legathon",

    newExplorer: "Nuovo Esploratore",
    explorer: "Esploratore",
    pathfinder: "Apripista",
    trailblazer: "Pioniere",
    legend: "Leggenda",
    eliteExplorer: "Esploratore Elite",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    back: "رجوع",
    passportHub: "مركز جوازات LEGATHON",
    passportCollection: "مجموعة جوازات السفر",
    refreshProgress: "↻ تحديث التقدم",

    stamps: "الأختام",
    completed: "مكتملة",
    level: "المستوى",

    loadingPassports: "جارٍ تحميل جوازات السفر...",
    noJourneys: "لا توجد رحلات متاحة",
    addJourneys:
      "أضف الرحلات إلى journeyCatalog.js.",

    featuredPassport: "جواز السفر المميز",
    selectedJourney: "الرحلة المختارة",
    complete: "مكتمل",

    passportStamps: "أختام جواز السفر",
    stamped: "مختوم",
    locked: "مغلق",

    passportShelf: "مجموعة جوازات السفر",

    start: "البداية",
    checkpoint: "النقطة {count}",
    finish: "النهاية",

    untitledJourney: "رحلة بدون عنوان",
    legathonJourney: "رحلة Legathon",

    newExplorer: "مستكشف جديد",
    explorer: "مستكشف",
    pathfinder: "مكتشف المسار",
    trailblazer: "رائد",
    legend: "أسطورة",
    eliteExplorer: "مستكشف Elite",
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

function getPassportText(
  language,
  key,
  variables = {}
) {
  // Screen-specific translations first.
  // This prevents English fallback from translate()
  // overriding a Passport-specific translation.

  const local =
    PASSPORT_TEXT?.[language]?.[key];

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
    PASSPORT_TEXT.en?.[key] ||
      key,
    variables
  );
}

// ============================================================
// DATA HELPERS
// ============================================================

function safeParse(
  value,
  fallback = null
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch (error) {
    console.log(
      "Passport JSON error:",
      error
    );

    return fallback;
  }
}

function clampProgress(
  value
) {
  const number =
    Number(
      value
    );

  if (
    !Number.isFinite(
      number
    )
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      number
    )
  );
}

function readProgress(
  item
) {
  if (
    typeof item ===
    "number"
  ) {
    return clampProgress(
      item
    );
  }

  return clampProgress(
    item?.progress ??
      item?.journeyProgress ??
      item?.progressPercent ??
      item?.percentComplete ??
      0
  );
}

function createProgressMap(
  savedData
) {
  const nextMap = {};

  if (
    Array.isArray(
      savedData
    )
  ) {
    savedData.forEach(
      entry => {
        const journeyId =
          entry?.id ??
          entry?.journeyId ??
          entry?.routeKey;

        if (
          !journeyId
        ) {
          return;
        }

        nextMap[
          String(
            journeyId
          )
        ] =
          readProgress(
            entry
          );
      }
    );

    return nextMap;
  }

  if (
    savedData &&
    typeof savedData ===
      "object"
  ) {
    const singleJourneyId =
      savedData.id ??
      savedData.journeyId ??
      savedData.routeKey;

    if (
      singleJourneyId
    ) {
      nextMap[
        String(
          singleJourneyId
        )
      ] =
        readProgress(
          savedData
        );

      return nextMap;
    }

    Object.entries(
      savedData
    ).forEach(
      ([
        journeyId,
        value,
      ]) => {
        nextMap[
          String(
            journeyId
          )
        ] =
          readProgress(
            value
          );
      }
    );
  }

  return nextMap;
}

// ============================================================
// PASSPORT STAMPS
// ============================================================

function buildJourneyStamps(
  journey,
  t
) {
  const defaults = [
    t(
      "start"
    ),

    t(
      "checkpoint",
      {
        count: 2,
      }
    ),

    t(
      "checkpoint",
      {
        count: 3,
      }
    ),

    t(
      "checkpoint",
      {
        count: 4,
      }
    ),

    t(
      "finish"
    ),
  ];

  const source =
    Array.isArray(
      journey?.stamps
    ) &&
    journey.stamps.length
      ? journey.stamps
      : Array.isArray(
          journey?.checkpoints
        )
      ? journey.checkpoints
      : [];

  return defaults.map(
    (
      fallback,
      index
    ) => {
      const item =
        source[index];

      if (
        typeof item ===
        "string"
      ) {
        // Translate the common generic checkpoint names.
        if (
          item === "Start"
        ) {
          return t(
            "start"
          );
        }

        if (
          item === "Finish"
        ) {
          return t(
            "finish"
          );
        }

        if (
          /^Checkpoint\s+[2-4]$/i.test(
            item
          )
        ) {
          return t(
            "checkpoint",
            {
              count:
                index + 1,
            }
          );
        }

        return item;
      }

      return (
        item?.title ||
        item?.name ||
        item?.label ||
        fallback
      );
    }
  );
}

// ============================================================
// STAMP UNLOCKS
// ============================================================

function getUnlockedStampCount(
  progress
) {
  const value =
    clampProgress(
      progress
    );

  // Stamp 1 = started
  // Stamp 2 = 25%
  // Stamp 3 = 50%
  // Stamp 4 = 75%
  // Stamp 5 = 100%

  if (
    value >= 100
  ) {
    return 5;
  }

  if (
    value >= 75
  ) {
    return 4;
  }

  if (
    value >= 50
  ) {
    return 3;
  }

  if (
    value >= 25
  ) {
    return 2;
  }

  if (
    value > 0
  ) {
    return 1;
  }

  return 0;
}

// ============================================================
// EXPLORER RANK
// ============================================================

function getExplorerRank(
  completedJourneys
) {
  if (
    completedJourneys >=
    75
  ) {
    return "eliteExplorer";
  }

  if (
    completedJourneys >=
    50
  ) {
    return "legend";
  }

  if (
    completedJourneys >=
    25
  ) {
    return "trailblazer";
  }

  if (
    completedJourneys >=
    10
  ) {
    return "pathfinder";
  }

  if (
    completedJourneys >=
    1
  ) {
    return "explorer";
  }

  return "newExplorer";
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
  function t(
    key,
    variables = {}
  ) {
    return getPassportText(
      language,
      key,
      variables
    );
  }

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    progressMap,
    setProgressMap,
  ] =
    useState({});

  const [
    selectedPassportId,
    setSelectedPassportId,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  // ==========================================================
  // LOAD PROGRESS
  // ==========================================================

  const loadPassportProgress =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          const storedValues =
            await AsyncStorage
              .multiGet([
                PROGRESS_STORAGE_KEY,
                ACTIVE_JOURNEY_KEY,
              ]);

          const progressRaw =
            storedValues[
              0
            ]?.[1];

          const activeRaw =
            storedValues[
              1
            ]?.[1];

          const savedProgress =
            safeParse(
              progressRaw,
              []
            );

          const savedActive =
            safeParse(
              activeRaw,
              null
            );

          const nextMap =
            createProgressMap(
              savedProgress
            );

          const currentActive =
            activeJourney ||
            savedActive;

          const activeId =
            currentActive?.id ??
            currentActive?.journeyId ??
            currentActive?.routeKey;

          if (
            activeId
          ) {
            const savedActiveProgress =
              readProgress(
                currentActive
              );

            nextMap[
              String(
                activeId
              )
            ] =
              Math.max(
                nextMap[
                  String(
                    activeId
                  )
                ] ||
                  0,

                savedActiveProgress
              );
          }

          setProgressMap(
            nextMap
          );
        } catch (
          error
        ) {
          console.log(
            "Passport progress load error:",
            error
          );

          setProgressMap(
            {}
          );
        } finally {
          setLoading(
            false
          );
        }
      },

      [
        activeJourney,
      ]
    );

  useEffect(
    () => {
      loadPassportProgress();
    },

    [
      loadPassportProgress,
    ]
  );

  // ==========================================================
  // BUILD PASSPORTS
  // ==========================================================

  const passports =
    useMemo(
      () => {
        const catalog =
          Array.isArray(
            JOURNEY_CATALOG
          )
            ? JOURNEY_CATALOG
            : [];

        return catalog.map(
          journey => {
            const journeyId =
              String(
                journey?.id ??
                  journey?.journeyId ??
                  journey?.routeKey ??
                  ""
              );

            const localizedJourney =
              getJourneyTranslation(
                journey,
                language
              ) ||
              journey;

            return {
              ...journey,

              id:
                journeyId,

              title:
                localizedJourney?.title ||
                journey?.title ||
                t(
                  "untitledJourney"
                ),

              subtitle:
                localizedJourney?.subtitle ||
                journey?.subtitle ||
                journey?.category ||
                t(
                  "legathonJourney"
                ),

              progress:
                progressMap[
                  journeyId
                ] ||
                0,

              cover:
                passportImages[
                  journeyId
                ] ||
                journey?.passportCover ||
                journey?.passportImage ||
                journey?.image ||
                journey?.routeImage ||
                null,

              stamps:
                buildJourneyStamps(
                  journey,
                  t
                ),
            };
          }
        );
      },

      [
        progressMap,
        language,
      ]
    );

  // ==========================================================
  // DEFAULT SELECTED PASSPORT
  // ==========================================================

  useEffect(
    () => {
      if (
        passports.length ===
        0
      ) {
        setSelectedPassportId(
          null
        );

        return;
      }

      const selectionStillExists =
        passports.some(
          passport =>
            passport.id ===
            selectedPassportId
        );

      if (
        !selectionStillExists
      ) {
        const activePassport =
          passports.find(
            passport =>
              passport.progress >
                0 &&
              passport.progress <
                100
          ) ||
          passports.find(
            passport =>
              passport.progress >=
              100
          ) ||
          passports[0];

        setSelectedPassportId(
          activePassport.id
        );
      }
    },

    [
      passports,
      selectedPassportId,
    ]
  );

  // ==========================================================
  // SELECTED PASSPORT
  // ==========================================================

  const selectedPassport =
    useMemo(
      () =>
        passports.find(
          passport =>
            passport.id ===
            selectedPassportId
        ) ||
        passports[0] ||
        null,

      [
        passports,
        selectedPassportId,
      ]
    );

  // ==========================================================
  // STATS
  // ==========================================================

  const earnedStamps =
    useMemo(
      () =>
        passports.reduce(
          (
            total,
            passport
          ) =>
            total +
            getUnlockedStampCount(
              passport.progress
            ),

          0
        ),

      [
        passports,
      ]
    );

  const completedJourneys =
    useMemo(
      () =>
        passports.filter(
          passport =>
            passport.progress >=
            100
        ).length,

      [
        passports,
      ]
    );

  const explorerLevel =
    Math.max(
      1,
      completedJourneys +
        1
    );

  const explorerRankKey =
    getExplorerRank(
      completedJourneys
    );

  const explorerRank =
    t(
      explorerRankKey
    );

  const selectedUnlockedStamps =
    selectedPassport
      ? getUnlockedStampCount(
          selectedPassport.progress
        )
      : 0;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ImageBackground
      source={
        PASSPORT_BG
      }
      style={
        styles.container
      }
      resizeMode="cover"
    >
      <View
        style={
          styles.overlay
        }
      >
        <SafeAreaView
          style={
            styles.safe
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.content
            }
          >
            {/* ==================================================
                BACK
            ================================================== */}

            {!!goBack && (
              <TouchableOpacity
                style={
                  styles.backButton
                }
                onPress={
                  goBack
                }
              >
                <Text
                  style={
                    styles.backText
                  }
                >
                  ←{" "}
                  {t(
                    "back"
                  )}
                </Text>
              </TouchableOpacity>
            )}

            {/* ==================================================
                HEADER
            ================================================== */}

            <Text
              style={
                styles.kicker
              }
            >
              {t(
                "passportHub"
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
                "passportCollection"
              )}
            </Text>

            <TouchableOpacity
              style={
                styles.refreshButton
              }
              onPress={
                loadPassportProgress
              }
              activeOpacity={
                0.85
              }
            >
              <Text
                style={
                  styles.refreshText
                }
              >
                {t(
                  "refreshProgress"
                )}
              </Text>
            </TouchableOpacity>

            {/* ==================================================
                EXPLORER CARD
            ================================================== */}

            <View
              style={
                styles.explorerCard
              }
            >
              <View
                style={
                  styles.avatarWrap
                }
              >
                <Text
                  style={
                    styles.avatarIcon
                  }
                >
                  👤
                </Text>
              </View>

              <Text
                style={
                  styles.name
                }
                numberOfLines={
                  2
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {
                  userName
                }
              </Text>

              <Text
                style={
                  styles.rank
                }
              >
                {
                  explorerRank
                }
              </Text>

              {/* ================================================
                  PROFILE STATS
              ================================================ */}

              <View
                style={
                  styles.profileStats
                }
              >
                <View
                  style={
                    styles.profileStat
                  }
                >
                  <Text
                    style={
                      styles.profileNumber
                    }
                  >
                    {
                      earnedStamps
                    }
                  </Text>

                  <Text
                    style={
                      styles.profileLabel
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
                      "stamps"
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.profileStat
                  }
                >
                  <Text
                    style={
                      styles.profileNumber
                    }
                  >
                    {
                      completedJourneys
                    }
                  </Text>

                  <Text
                    style={
                      styles.profileLabel
                    }
                    numberOfLines={
                      2
                    }
                    adjustsFontSizeToFit
                    minimumFontScale={
                      0.65
                    }
                  >
                    {t(
                      "completed"
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.profileStat
                  }
                >
                  <Text
                    style={
                      styles.profileNumber
                    }
                  >
                    {
                      explorerLevel
                    }
                  </Text>

                  <Text
                    style={
                      styles.profileLabel
                    }
                  >
                    {t(
                      "level"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* ==================================================
                LOADING / EMPTY
            ================================================== */}

            {loading ? (
              <View
                style={
                  styles.openPassportCard
                }
              >
                <Text
                  style={
                    styles.sectionTitleSmall
                  }
                >
                  {t(
                    "loadingPassports"
                  )}
                </Text>
              </View>
            ) : !selectedPassport ? (
              <View
                style={
                  styles.openPassportCard
                }
              >
                <Text
                  style={
                    styles.sectionTitleSmall
                  }
                >
                  {t(
                    "noJourneys"
                  )}
                </Text>

                <Text
                  style={
                    styles.stampStatus
                  }
                >
                  {t(
                    "addJourneys"
                  )}
                </Text>
              </View>
            ) : (
              <>
                {/* ==============================================
                    FEATURED PASSPORT
                ============================================== */}

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {t(
                    "featuredPassport"
                  )}
                </Text>

                <View
                  style={
                    styles.featuredPassportCard
                  }
                >
                  {selectedPassport.cover ? (
                    <Image
                      source={
                        selectedPassport.cover
                      }
                      style={
                        styles.featuredPassportImage
                      }
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.featuredPassportImage,

                        styles.fallbackImage,
                      ]}
                    >
                      <Text
                        style={
                          styles.featuredFallbackEmoji
                        }
                      >
                        🛂
                      </Text>
                    </View>
                  )}

                  <View
                    style={
                      styles.featuredOverlay
                    }
                  >
                    <Text
                      style={
                        styles.featuredLabel
                      }
                    >
                      {t(
                        "selectedJourney"
                      )}
                    </Text>

                    <Text
                      style={
                        styles.featuredTitle
                      }
                      numberOfLines={
                        3
                      }
                      adjustsFontSizeToFit
                      minimumFontScale={
                        0.68
                      }
                    >
                      {
                        selectedPassport.title
                      }
                    </Text>

                    <Text
                      style={
                        styles.featuredSub
                      }
                      numberOfLines={
                        4
                      }
                    >
                      {
                        selectedPassport.subtitle
                      }
                    </Text>

                    {/* ==========================================
                        PROGRESS BAR
                    ========================================== */}

                    <View
                      style={
                        styles.progressBar
                      }
                    >
                      <View
                        style={[
                          styles.progressFill,

                          {
                            width:
                              `${clampProgress(
                                selectedPassport.progress
                              )}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={
                        styles.featuredProgress
                      }
                    >
                      {Math.round(
                        selectedPassport.progress
                      )}
                      %{" "}
                      {t(
                        "complete"
                      )}
                    </Text>
                  </View>
                </View>

                {/* ==============================================
                    PASSPORT STAMPS
                ============================================== */}

                <View
                  style={
                    styles.openPassportCard
                  }
                >
                  <Text
                    style={
                      styles.sectionTitleSmall
                    }
                  >
                    {t(
                      "passportStamps"
                    )}
                  </Text>

                  <View
                    style={
                      styles.stampList
                    }
                  >
                    {selectedPassport.stamps.map(
                      (
                        stamp,
                        index
                      ) => {
                        const unlocked =
                          index <
                          selectedUnlockedStamps;

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
                            {/* ==================================
                                STAMP SEAL
                            ================================== */}

                            <View
                              style={[
                                styles.stampSeal,

                                unlocked
                                  ? styles.stampSealUnlocked
                                  : styles.stampSealLocked,
                              ]}
                            >
                              <Text
                                style={
                                  styles.stampSealText
                                }
                              >
                                {
                                  index +
                                  1
                                }
                              </Text>
                            </View>

                            {/* ==================================
                                STAMP CONTENT
                            ================================== */}

                            <View
                              style={
                                styles.stampTextBox
                              }
                            >
                              <Text
                                style={
                                  styles.stampTitle
                                }
                                numberOfLines={
                                  3
                                }
                                adjustsFontSizeToFit
                                minimumFontScale={
                                  0.7
                                }
                              >
                                {
                                  stamp
                                }
                              </Text>

                              <Text
                                style={[
                                  styles.stampStatus,

                                  unlocked &&
                                    styles.stampStatusUnlocked,
                                ]}
                              >
                                {unlocked
                                  ? t(
                                      "stamped"
                                    )
                                  : t(
                                      "locked"
                                    )}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* ==============================================
                    PASSPORT SHELF
                ============================================== */}

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {t(
                    "passportShelf"
                  )}
                </Text>

                <View
                  style={
                    styles.shelfGrid
                  }
                >
                  {passports.map(
                    passport => {
                      const selected =
                        passport.id ===
                        selectedPassport.id;

                      return (
                        <TouchableOpacity
                          key={
                            passport.id
                          }
                          style={[
                            styles.shelfCard,

                            selected &&
                              styles.shelfCardActive,
                          ]}
                          activeOpacity={
                            0.88
                          }
                          onPress={() =>
                            setSelectedPassportId(
                              passport.id
                            )
                          }
                        >
                          {passport.cover ? (
                            <Image
                              source={
                                passport.cover
                              }
                              style={
                                styles.shelfImage
                              }
                              resizeMode="cover"
                            />
                          ) : (
                            <View
                              style={[
                                styles.shelfImage,

                                styles.fallbackImage,
                              ]}
                            >
                              <Text
                                style={
                                  styles.shelfFallbackEmoji
                                }
                              >
                                🛂
                              </Text>
                            </View>
                          )}

                          <View
                            style={
                              styles.shelfOverlay
                            }
                          >
                            <Text
                              style={
                                styles.shelfTitle
                              }
                              numberOfLines={
                                2
                              }
                              adjustsFontSizeToFit
                              minimumFontScale={
                                0.7
                              }
                            >
                              {
                                passport.title
                              }
                            </Text>

                            <Text
                              style={
                                styles.shelfProgress
                              }
                            >
                              {Math.round(
                                passport.progress
                              )}
                              %
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  )}
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
    color: "#D4AF37",
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
    color: "#D4AF37",
    fontSize: 19,
    fontWeight: "900",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  kicker: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
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
    borderColor: "#D4AF37",
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
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,175,55,0.12)",
    marginBottom: 14,
  },

  avatarIcon: {
    fontSize: 54,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  rank: {
    color: "#D4AF37",
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
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  profileLabel: {
    color: "#B9C3D6",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },

  // ==========================================================
  // SECTION TITLES
  // ==========================================================

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 18,
  },

  sectionTitleSmall: {
    color: "#FFFFFF",
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
    borderColor: "#D4AF37",
    marginBottom: 30,
    backgroundColor: "#081426",
  },

  featuredPassportImage: {
    width: "100%",
    height: "100%",
  },

  fallbackImage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#081426",
  },

  featuredFallbackEmoji: {
    fontSize: 72,
  },

  featuredOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "rgba(2,6,23,0.76)",
  },

  featuredLabel: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
  },

  featuredSub: {
    color: "#B9C3D6",
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
    backgroundColor: "#D4AF37",
    borderRadius: 20,
  },

  featuredProgress: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "900",
  },

  // ==========================================================
  // PASSPORT STAMPS
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
    backgroundColor: "#D4AF37",
    borderWidth: 4,
    borderColor: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  stampStatus: {
    color: "#B9C3D6",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },

  stampStatusUnlocked: {
    color: "#D4AF37",
  },

  // ==========================================================
  // PASSPORT SHELF
  // ==========================================================

  shelfGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  shelfCard: {
    width: "48%",
    height: 230,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#081426",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 18,
  },

  shelfCardActive: {
    borderColor: "#D4AF37",
    borderWidth: 3,
  },

  shelfImage: {
    width: "100%",
    height: "100%",
  },

  shelfFallbackEmoji: {
    fontSize: 42,
  },

  shelfOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(2,6,23,0.74)",
  },

  shelfTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  shelfProgress: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3,
  },
});