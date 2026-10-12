
 // screens/MedalCollectionScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppState,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import legathonMedalImages from "../data/legathonMedalImages";

import MARATHON_CATALOG from "../data/marathonCatalog";

import {
  loadMarathonProgressMap,
} from "../utils/marathonStorage";

// ============================================================
// LEGATHON WALK - MEDAL COLLECTION
//
// 26 LEGATHONS
// 26 EXCLUSIVE MEDALS
//
// 0%       = LOCKED
// 1%-99%   = IN PROGRESS
// 100%     = MEDAL REVEALED WHEN COMPLETION IS RECORDED
//
// NO PASSPORTS
// NO CERTIFICATES
// NO ACHIEVEMENT BADGES
// ============================================================
const LOCKED_MEDAL_IMAGE = require("../assets/locked/legacy-lock.png");
const GOLD = "#D4AF37";
const WHITE = "#FFFFFF";
const NAVY = "#071427";
const CARD = "#102038";
const MUTED = "#B9C3D6";

const STEPS_PER_LEGATHON = 52400;

// ============================================================
// ALL 26 MEDALS - OFFICIAL ORDER
// ============================================================


const MEDALS = [
  { key: "nyc", name: "New York" },
  { key: "london", name: "London" },
  { key: "tokyo", name: "Tokyo" },
  { key: "paris", name: "Paris" },
  { key: "berlin", name: "Berlin" },
  { key: "dubai", name: "Dubai" },
  { key: "boston", name: "Boston" },
  { key: "athens", name: "Athens" },
  { key: "chicago", name: "Chicago" },
  { key: "rome", name: "Rome" },
  { key: "amsterdam", name: "Amsterdam" },
  { key: "barcelona", name: "Barcelona" },
  { key: "sydney", name: "Sydney" },
  { key: "cape-town", name: "Cape Town" },
  { key: "rio", name: "Rio de Janeiro" },
  { key: "toronto", name: "Toronto" },
  { key: "seoul", name: "Seoul" },
  { key: "singapore", name: "Singapore" },
  { key: "mumbai", name: "Mumbai" },
  { key: "mexico-city", name: "Mexico City" },
  { key: "honolulu", name: "Honolulu" },
  { key: "istanbul", name: "Istanbul" },
  { key: "buenos-aires", name: "Buenos Aires" },
  { key: "nairobi", name: "Nairobi" },
  { key: "shanghai", name: "Shanghai" },
  { key: "los-angeles", name: "Los Angeles" },
];

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    heading: "Legathon Medal Collection",
    world: "WORLD COLLECTION",
    completed: "COMPLETED",
    locked: "LOCKED",
    progress: "IN PROGRESS",
    collected: "Medals Earned",
    refresh: "↻ Refresh Medals",
    back: "Back",
    empty: "Complete a Legathon to reveal its medal.",
    distance: "26.2 MILES",
    detail: "Legathon Medal",
    completion: "Completion Date",
    earned: "EXCLUSIVE MEDAL EARNED",
    requirement: "Complete 52,400 steps to earn this medal.",
    loading: "Loading medals...",
    total: "26 Exclusive Global Medals",
  },

  es: {
    heading: "Colección de Medallas Legathon",
    world: "COLECCIÓN MUNDIAL",
    completed: "COMPLETADO",
    locked: "BLOQUEADO",
    progress: "EN PROGRESO",
    collected: "Medallas Ganadas",
    refresh: "↻ Actualizar Medallas",
    back: "Atrás",
    empty: "Completa un Legathon para revelar su medalla.",
    distance: "26,2 MILLAS",
    detail: "Medalla Legathon",
    completion: "Fecha de Finalización",
    earned: "MEDALLA EXCLUSIVA GANADA",
    requirement: "Completa 52.400 pasos para ganar esta medalla.",
    loading: "Cargando medallas...",
    total: "26 Medallas Globales Exclusivas",
  },

  fr: {
    heading: "Collection de Médailles Legathon",
    world: "COLLECTION MONDIALE",
    completed: "TERMINÉ",
    locked: "VERROUILLÉ",
    progress: "EN COURS",
    collected: "Médailles Gagnées",
    refresh: "↻ Actualiser",
    back: "Retour",
    empty: "Terminez un Legathon pour révéler sa médaille.",
    distance: "26,2 MILES",
    detail: "Médaille Legathon",
    completion: "Date de Fin",
    earned: "MÉDAILLE EXCLUSIVE GAGNÉE",
    requirement: "Terminez 52 400 pas pour gagner cette médaille.",
    loading: "Chargement des médailles...",
    total: "26 Médailles Exclusives",
  },

  de: {
    heading: "Legathon-Medaillensammlung",
    world: "WELTKOLLEKTION",
    completed: "ABGESCHLOSSEN",
    locked: "GESPERRT",
    progress: "IN BEARBEITUNG",
    collected: "Verdiente Medaillen",
    refresh: "↻ Aktualisieren",
    back: "Zurück",
    empty: "Schließe einen Legathon ab, um die Medaille zu enthüllen.",
    distance: "26,2 MEILEN",
    detail: "Legathon-Medaille",
    completion: "Abschlussdatum",
    earned: "EXKLUSIVE MEDAILLE VERDIENT",
    requirement: "Schließe 52.400 Schritte ab.",
    loading: "Medaillen werden geladen...",
    total: "26 Exklusive Medaillen",
  },

  pt: {
    heading: "Coleção de Medalhas Legathon",
    world: "COLEÇÃO MUNDIAL",
    completed: "CONCLUÍDO",
    locked: "BLOQUEADO",
    progress: "EM ANDAMENTO",
    collected: "Medalhas Conquistadas",
    refresh: "↻ Atualizar Medalhas",
    back: "Voltar",
    empty: "Conclua um Legathon para revelar sua medalha.",
    distance: "26,2 MILHAS",
    detail: "Medalha Legathon",
    completion: "Data de Conclusão",
    earned: "MEDALHA EXCLUSIVA CONQUISTADA",
    requirement: "Complete 52.400 passos para ganhar esta medalha.",
    loading: "Carregando medalhas...",
    total: "26 Medalhas Exclusivas",
  },

  ja: {
    heading: "Legathon メダルコレクション",
    world: "ワールドコレクション",
    completed: "完了",
    locked: "ロック中",
    progress: "進行中",
    collected: "獲得メダル",
    refresh: "↻ メダル更新",
    back: "戻る",
    empty: "Legathonを完了してメダルを獲得しましょう。",
    distance: "26.2マイル",
    detail: "Legathonメダル",
    completion: "完了日",
    earned: "限定メダル獲得",
    requirement: "52,400歩でメダルを獲得できます。",
    loading: "メダルを読み込み中...",
    total: "26種類の限定メダル",
  },

  ko: {
    heading: "Legathon 메달 컬렉션",
    world: "월드 컬렉션",
    completed: "완료",
    locked: "잠김",
    progress: "진행 중",
    collected: "획득한 메달",
    refresh: "↻ 메달 새로고침",
    back: "뒤로",
    empty: "Legathon을 완료하고 메달을 획득하세요.",
    distance: "26.2마일",
    detail: "Legathon 메달",
    completion: "완료일",
    earned: "전용 메달 획득",
    requirement: "52,400걸음을 완료하면 메달을 획득합니다.",
    loading: "메달 불러오는 중...",
    total: "26개의 전용 메달",
  },

  zh: {
    heading: "Legathon 奖牌收藏",
    world: "世界收藏",
    completed: "已完成",
    locked: "未解锁",
    progress: "进行中",
    collected: "已获得奖牌",
    refresh: "↻ 刷新奖牌",
    back: "返回",
    empty: "完成Legathon即可获得专属奖牌。",
    distance: "26.2英里",
    detail: "Legathon奖牌",
    completion: "完成日期",
    earned: "已获得专属奖牌",
    requirement: "完成52,400步即可获得奖牌。",
    loading: "正在加载奖牌...",
    total: "26枚专属奖牌",
  },

  it: {
    heading: "Collezione Medaglie Legathon",
    world: "COLLEZIONE MONDIALE",
    completed: "COMPLETATO",
    locked: "BLOCCATO",
    progress: "IN CORSO",
    collected: "Medaglie Ottenute",
    refresh: "↻ Aggiorna Medaglie",
    back: "Indietro",
    empty: "Completa un Legathon per rivelare la medaglia.",
    distance: "26,2 MIGLIA",
    detail: "Medaglia Legathon",
    completion: "Data di Completamento",
    earned: "MEDAGLIA ESCLUSIVA OTTENUTA",
    requirement: "Completa 52.400 passi per ottenere la medaglia.",
    loading: "Caricamento medaglie...",
    total: "26 Medaglie Esclusive",
  },

  ar: {
    heading: "مجموعة ميداليات Legathon",
    world: "المجموعة العالمية",
    completed: "مكتمل",
    locked: "مغلق",
    progress: "قيد التقدم",
    collected: "الميداليات المكتسبة",
    refresh: "↻ تحديث الميداليات",
    back: "رجوع",
    empty: "أكمل Legathon للحصول على الميدالية.",
    distance: "26.2 ميل",
    detail: "ميدالية Legathon",
    completion: "تاريخ الإكمال",
    earned: "تم الحصول على الميدالية الحصرية",
    requirement: "أكمل 52,400 خطوة للحصول على الميدالية.",
    loading: "جارٍ تحميل الميداليات...",
    total: "26 ميدالية حصرية",
  },
};

function getText(language, key) {
  return TEXT[language]?.[key] || TEXT.en[key] || key;
}

// ============================================================
// NORMALIZATION
// ============================================================

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function clamp(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;

  return Math.max(0, Math.min(100, number));
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

// ============================================================
// FIND THE MATCHING LEGATHON CATALOG ENTRY
// ============================================================

function getCatalogEntries() {
  if (Array.isArray(MARATHON_CATALOG)) {
    return MARATHON_CATALOG;
  }

  return Object.values(MARATHON_CATALOG || {}).filter(
    item => item && typeof item === "object"
  );
}




 // ============================================================
 // FIND MATCHING LEGATHON
 // ============================================================

function findCatalogEntry(medal, catalog) {
  if (!medal || !Array.isArray(catalog)) {
    return null;
  }

  return (
    catalog.find(
      entry => entry?.id === medal.key
    ) || null
  );
}

// ============================================================
// STORAGE PARSING
// ============================================================



    

   


// ============================================================
// STORAGE PARSING
//
// READ ONLY - NEVER AWARDS OR MODIFIES REWARDS
// ============================================================

function findStoredRecord(map, medal, catalogEntry) {
  if (!map || typeof map !== "object") {
    return null;
  }

  const candidates = [
    catalogEntry?.id,
    catalogEntry?.slug,
    catalogEntry?.title,
    medal.key,
    medal.name,
    ...(medal.aliases || []),
  ]
    .filter(Boolean)
    .map(normalize);

  if (Array.isArray(map)) {
    return map.find(entry => {
      const id = normalize(
        entry?.id || entry?.marathonId || entry?.legathonId
      );
      return candidates.includes(id);
    }) || null;
  }

  for (const [key, record] of Object.entries(map)) {
    if (candidates.includes(normalize(key))) {
      return record;
    }
  }

  return null;
}



function extractProgress(record) {
  if (!record || typeof record !== "object") {
    return {
      percent: 0,
      completed: false,
      completedAt: null,
    };
  }

  // Read the normalized completion result
  // from utils/marathonStorage.js.
  const completed = record.completed === true;

  const totalSteps =
    safeNumber(record.totalSteps) ||
    STEPS_PER_LEGATHON;

  const steps = safeNumber(record.steps);

  const percent = completed
    ? 100
    : clamp((steps / totalSteps) * 100);

  return {
    percent,
    completed,
    completedAt: completed
      ? record.completedAt || null
      : null,
  };
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

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
// LOCKED MEDAL ARTWORK
//
// The real medal PNG is NEVER rendered when locked.
// ============================================================


function LockedMedal() {
  return (
    <View style={styles.lockedArtwork}>
      <Image
        source={LOCKED_MEDAL_IMAGE}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        }}
      />
    </View>
  );
}


// ============================================================
// MEDAL CARD
// ============================================================

function MedalCard({ medal, t, language, onPress }) {
  const completed = medal.completed;
  const inProgress = medal.percent > 0 && !completed;

  const status = completed
    ? t("completed")
    : inProgress
    ? t("progress")
    : t("locked");

  return (
    <TouchableOpacity
      style={[
        styles.medalCard,
        completed && styles.medalCardEarned,
      ]}
      onPress={() => onPress(medal.key)}
      activeOpacity={0.88}
    >
      <View style={styles.medalImageArea}>
        {completed && medal.image ? (
          <Image
            source={medal.image}
            style={styles.medalImage}
            resizeMode="contain"
          />
        ) : (
          <LockedMedal />
        )}
      </View>

      <View style={styles.medalNameArea}>
        <Text
          style={styles.medalName}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {medal.name}
        </Text>
      </View>

      <Text
        style={[
          styles.medalStatus,
          completed && styles.medalStatusEarned,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {status.toUpperCase()}
      </Text>

      {inProgress && (
        <Text style={styles.medalPercent}>
          {Math.round(medal.percent)}%
        </Text>
      )}

      {completed && medal.completedAt && (
        <Text style={styles.medalDate}>
          {formatDate(medal.completedAt, language)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function MedalCollectionScreen({
  language = "en",
  goBack,
}) {
  const t = useCallback(
    key => getText(language, key),
    [language]
  );

  const [progressMap, setProgressMap] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD LEGATHON PROGRESS
  // ==========================================================

  const loadMedals = useCallback(async () => {
    try {
      setLoading(true);

      const result = await loadMarathonProgressMap();

      setProgressMap(
        result && typeof result === "object"
          ? result
          : {}
      );
    } catch (error) {
      console.log("Medal Collection load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedals();
  }, [loadMedals]);

  useEffect(() => {
    const listener = AppState.addEventListener(
      "change",
      state => {
        if (state === "active") {
          loadMedals();
        }
      }
    );

    return () => listener.remove();
  }, [loadMedals]);

  // ==========================================================
  // BUILD THE 26 MEDALS
  // ==========================================================

  const medals = useMemo(() => {
    const catalog = getCatalogEntries();

    return MEDALS.map(item => {
      const catalogEntry = findCatalogEntry(item, catalog);

      const record = findStoredRecord(
        progressMap,
        item,
        catalogEntry
      );

      const progress = extractProgress(record);

      return {
        ...item,
        catalogId: catalogEntry?.id || item.key,
        image: legathonMedalImages[item.key] || null,
        ...progress,
      };
    });
  }, [progressMap]);

  const completedCount = medals.filter(
    medal => medal.completed
  ).length;

  const selectedMedal =
    medals.find(medal => medal.key === selectedKey) || null;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {!!goBack && (
          <TouchableOpacity
            onPress={goBack}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← {t("back")}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.collectionPanel}>
          <Text style={styles.kicker}>
            {t("world")}
          </Text>

          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {t("heading")}
              </Text>

              <Text style={styles.subtitle}>
                {t("total")}
              </Text>
            </View>

            <View style={styles.countCircle}>
              <Text style={styles.countNumber}>
                {completedCount}
              </Text>
            </View>
          </View>

          <Text style={styles.collectionSummary}>
            {completedCount} / 26 {t("collected")}
          </Text>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadMedals}
          >
            <Text style={styles.refreshText}>
              {t("refresh")}
            </Text>
          </TouchableOpacity>

          {loading ? (
            <Text style={styles.loading}>
              {t("loading")}
            </Text>
          ) : (
            <View style={styles.medalGrid}>
              {medals.map(medal => (
                <MedalCard
                  key={medal.key}
                  medal={medal}
                  t={t}
                  language={language}
                  onPress={setSelectedKey}
                />
              ))}
            </View>
          )}
        </View>

        {/* SELECTED MEDAL INFORMATION */}

        {!!selectedMedal && !loading && (
          <View style={styles.detailPanel}>
            <Text style={styles.detailKicker}>
              {t("detail")}
            </Text>

            <Text style={styles.detailTitle}>
              {selectedMedal.name} Legathon
            </Text>

            <View style={styles.detailArtwork}>
              {selectedMedal.completed && selectedMedal.image ? (
                <Image
                  source={selectedMedal.image}
                  style={styles.detailMedalImage}
                  resizeMode="contain"
                />
              ) : (
                <LockedMedal />
              )}
            </View>

            <Text
              style={[
                styles.detailStatus,
                selectedMedal.completed &&
                  styles.medalStatusEarned,
              ]}
            >
              {selectedMedal.completed
                ? t("earned")
                : selectedMedal.percent > 0
                ? `${Math.round(selectedMedal.percent)}% ${t("progress")}`
                : t("locked")}
            </Text>

            <Text style={styles.detailDistance}>
              {t("distance")}
            </Text>

            {selectedMedal.completed &&
            selectedMedal.completedAt ? (
              <Text style={styles.detailDescription}>
                {t("completion")}:{" "}
                {formatDate(
                  selectedMedal.completedAt,
                  language
                )}
              </Text>
            ) : !selectedMedal.completed ? (
              <Text style={styles.detailDescription}>
                {t("requirement")}
              </Text>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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

  content: {
    padding: 18,
    paddingTop: 28,
    paddingBottom: 160,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 12,
  },

  backText: {
    color: GOLD,
    fontSize: 22,
    fontWeight: "900",
  },

  collectionPanel: {
    backgroundColor: "#071426",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#344E72",
    padding: 16,
  },

  kicker: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: WHITE,
    fontSize: 33,
    lineHeight: 40,
    fontWeight: "900",
    marginRight: 8,
  },

  subtitle: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },

  countCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  countNumber: {
    color: "#07111F",
    fontSize: 28,
    fontWeight: "900",
  },

  collectionSummary: {
    color: MUTED,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 10,
  },

  refreshButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 14,
  },

  refreshText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "900",
  },

  loading: {
    color: MUTED,
    fontSize: 17,
    paddingVertical: 28,
  },

  medalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  medalCard: {
    width: "48%",
    height: 286,
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#344E72",
    alignItems: "center",
    padding: 10,
    marginBottom: 16,
  },

  medalCardEarned: {
    borderWidth: 2,
    borderColor: GOLD,
  },

  medalImageArea: {
    height: 175,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#07111F",
  },

  medalImage: {
    height: "100%",
    width: "100%",
  },

  medalNameArea: {
    width: "100%",
    height: 53,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  medalName: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
  },

  medalStatus: {
    color: "#9AA7BA",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
    textAlign: "center",
    marginTop: 2,
  },

  medalStatusEarned: {
    color: GOLD,
  },

  medalPercent: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },

  medalDate: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },

  lockedArtwork: {
    width: "100%",
    height: "100%",
    backgroundColor: "#081428",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },

  lockedRing: {
    height: 92,
    width: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: GOLD,
    backgroundColor: "#101D30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  lockIcon: {
    fontSize: 41,
  },

  lockedArtworkTitle: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  lockedArtworkCaption: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 5,
  },

  lockedStars: {
    color: GOLD,
    fontSize: 12,
    marginTop: 6,
  },

  detailPanel: {
    backgroundColor: NAVY,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 28,
    padding: 20,
    marginTop: 22,
    alignItems: "center",
  },

  detailKicker: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },

  detailTitle: {
    color: WHITE,
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 18,
  },

  detailArtwork: {
    width: "100%",
    height: 275,
    backgroundColor: "#07111F",
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  detailMedalImage: {
    width: "100%",
    height: "100%",
  },

  detailStatus: {
    color: MUTED,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,
  },

  detailDistance: {
    color: GOLD,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },

  detailDescription: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    textAlign: "center",
  },
});
