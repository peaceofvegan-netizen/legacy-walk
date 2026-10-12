
 // screens/PassportDetailScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppState,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import JOURNEY_CATALOG from "../data/journeyCatalog";
import passportImages from "../data/passportImages";
import { getJourneyTranslation } from "../i18n/journeyTranslations";

const LOCKED_PASSPORT = require(
  "../assets/locked/legacy-lock.png"
);

const DETAIL_BACKGROUND = require(
  "../assets/passports/passport-background.png"
);

const PROGRESS_KEY = "journeyProgressData";
const ACTIVE_KEY = "activeJourney";

const GOLD = "#D4AF37";
const WHITE = "#FFFFFF";
const MUTED = "#AAB3C5";
const NAVY = "#081225";

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    passport: "Journey Passport",
    story: "Journey Story",
    details: "Passport Details",
    journey: "Journey",
    region: "Region",
    distance: "Distance",
    progress: "Journey Progress",
    locked: "PASSPORT LOCKED",
    inProgress: "IN PROGRESS",
    completed: "PASSPORT UNLOCKED",
    unlockNote:
      "Complete all five Journey checkpoints to reveal this passport.",
    progressNote:
      "Keep walking. Your passport will be revealed at 100%.",
    completedNote:
      "Congratulations! This Journey passport is now part of your collection.",
    checkpoints: "Checkpoint Stamps",
    stamped: "STAMPED",
    pending: "LOCKED",
    completionDate: "Completed On",
    loading: "Loading passport...",
    missing: "Journey not found",
    notAvailable: "Not Available",
    status: "Status",
  },
  es: {
    back: "Atrás",
    passport: "Pasaporte del Viaje",
    story: "Historia del Viaje",
    details: "Detalles del Pasaporte",
    journey: "Viaje",
    region: "Región",
    distance: "Distancia",
    progress: "Progreso",
    locked: "PASAPORTE BLOQUEADO",
    inProgress: "EN PROGRESO",
    completed: "PASAPORTE DESBLOQUEADO",
    unlockNote: "Completa los cinco puntos para revelar el pasaporte.",
    progressNote: "Sigue caminando. Se revela al llegar al 100%.",
    completedNote: "¡Felicidades! Has ganado este pasaporte.",
    checkpoints: "Sellos",
    stamped: "SELLADO",
    pending: "BLOQUEADO",
    completionDate: "Fecha de Finalización",
    loading: "Cargando pasaporte...",
    missing: "Viaje no encontrado",
    notAvailable: "No disponible",
    status: "Estado",
  },
  fr: {
    back: "Retour",
    passport: "Passeport de Voyage",
    story: "Histoire du Voyage",
    details: "Détails du Passeport",
    journey: "Voyage",
    region: "Région",
    distance: "Distance",
    progress: "Progression",
    locked: "PASSEPORT VERROUILLÉ",
    inProgress: "EN COURS",
    completed: "PASSEPORT DÉBLOQUÉ",
    unlockNote: "Terminez les cinq étapes pour révéler le passeport.",
    progressNote: "Continuez à marcher. Révélation à 100%.",
    completedNote: "Félicitations ! Vous avez gagné ce passeport.",
    checkpoints: "Tampons",
    stamped: "TAMPONNÉ",
    pending: "VERROUILLÉ",
    completionDate: "Date de Fin",
    loading: "Chargement...",
    missing: "Voyage introuvable",
    notAvailable: "Indisponible",
    status: "Statut",
  },
  de: {
    back: "Zurück",
    passport: "Reisepass",
    story: "Reisegeschichte",
    details: "Passdetails",
    journey: "Reise",
    region: "Region",
    distance: "Distanz",
    progress: "Fortschritt",
    locked: "PASS GESPERRT",
    inProgress: "IN BEARBEITUNG",
    completed: "PASS FREIGESCHALTET",
    unlockNote: "Schließe alle fünf Kontrollpunkte ab.",
    progressNote: "Gehe weiter. Der Pass erscheint bei 100%.",
    completedNote: "Glückwunsch! Dieser Pass gehört dir.",
    checkpoints: "Passstempel",
    stamped: "GESTEMPELT",
    pending: "GESPERRT",
    completionDate: "Abgeschlossen Am",
    loading: "Pass wird geladen...",
    missing: "Reise nicht gefunden",
    notAvailable: "Nicht verfügbar",
    status: "Status",
  },
  pt: {
    back: "Voltar",
    passport: "Passaporte da Jornada",
    story: "História da Jornada",
    details: "Detalhes do Passaporte",
    journey: "Jornada",
    region: "Região",
    distance: "Distância",
    progress: "Progresso",
    locked: "PASSAPORTE BLOQUEADO",
    inProgress: "EM ANDAMENTO",
    completed: "PASSAPORTE DESBLOQUEADO",
    unlockNote: "Conclua os cinco pontos para revelar o passaporte.",
    progressNote: "Continue caminhando. Revelação em 100%.",
    completedNote: "Parabéns! Você conquistou este passaporte.",
    checkpoints: "Carimbos",
    stamped: "CARIMBADO",
    pending: "BLOQUEADO",
    completionDate: "Concluído Em",
    loading: "Carregando...",
    missing: "Jornada não encontrada",
    notAvailable: "Indisponível",
    status: "Estado",
  },
  ja: {
    back: "戻る",
    passport: "ジャーニーパスポート",
    story: "ジャーニーストーリー",
    details: "パスポート詳細",
    journey: "ジャーニー",
    region: "地域",
    distance: "距離",
    progress: "進行状況",
    locked: "パスポートはロック中",
    inProgress: "進行中",
    completed: "パスポート獲得",
    unlockNote: "5つのチェックポイントを完了してください。",
    progressNote: "100%になるとパスポートが公開されます。",
    completedNote: "おめでとうございます！パスポートを獲得しました。",
    checkpoints: "チェックポイントスタンプ",
    stamped: "獲得済み",
    pending: "ロック中",
    completionDate: "完了日",
    loading: "読み込み中...",
    missing: "ジャーニーが見つかりません",
    notAvailable: "利用不可",
    status: "状態",
  },
  ko: {
    back: "뒤로",
    passport: "여정 패스포트",
    story: "여정 이야기",
    details: "패스포트 정보",
    journey: "여정",
    region: "지역",
    distance: "거리",
    progress: "진행 상황",
    locked: "패스포트 잠김",
    inProgress: "진행 중",
    completed: "패스포트 획득",
    unlockNote: "체크포인트 5개를 모두 완료하세요.",
    progressNote: "100% 완료 시 패스포트가 공개됩니다.",
    completedNote: "축하합니다! 패스포트를 획득했습니다.",
    checkpoints: "체크포인트 스탬프",
    stamped: "획득",
    pending: "잠김",
    completionDate: "완료일",
    loading: "불러오는 중...",
    missing: "여정을 찾을 수 없습니다",
    notAvailable: "없음",
    status: "상태",
  },
  zh: {
    back: "返回",
    passport: "旅程护照",
    story: "旅程故事",
    details: "护照详情",
    journey: "旅程",
    region: "地区",
    distance: "距离",
    progress: "旅程进度",
    locked: "护照已锁定",
    inProgress: "进行中",
    completed: "护照已解锁",
    unlockNote: "完成全部五个检查点即可解锁。",
    progressNote: "继续步行，达到100%后即可查看护照。",
    completedNote: "恭喜！你已获得这本护照。",
    checkpoints: "检查点印章",
    stamped: "已盖章",
    pending: "未解锁",
    completionDate: "完成日期",
    loading: "正在加载...",
    missing: "未找到旅程",
    notAvailable: "暂无",
    status: "状态",
  },
  it: {
    back: "Indietro",
    passport: "Passaporto del Viaggio",
    story: "Storia del Viaggio",
    details: "Dettagli Passaporto",
    journey: "Viaggio",
    region: "Regione",
    distance: "Distanza",
    progress: "Progresso",
    locked: "PASSAPORTO BLOCCATO",
    inProgress: "IN CORSO",
    completed: "PASSAPORTO SBLOCCATO",
    unlockNote: "Completa tutti e cinque i checkpoint.",
    progressNote: "Continua a camminare. Si sblocca al 100%.",
    completedNote: "Congratulazioni! Hai ottenuto il passaporto.",
    checkpoints: "Timbri",
    stamped: "TIMBRATO",
    pending: "BLOCCATO",
    completionDate: "Completato Il",
    loading: "Caricamento...",
    missing: "Viaggio non trovato",
    notAvailable: "Non disponibile",
    status: "Stato",
  },
  ar: {
    back: "رجوع",
    passport: "جواز سفر الرحلة",
    story: "قصة الرحلة",
    details: "تفاصيل جواز السفر",
    journey: "الرحلة",
    region: "المنطقة",
    distance: "المسافة",
    progress: "تقدم الرحلة",
    locked: "جواز السفر مغلق",
    inProgress: "قيد التقدم",
    completed: "تم فتح جواز السفر",
    unlockNote: "أكمل نقاط التحقق الخمس لفتح جواز السفر.",
    progressNote: "استمر بالمشي. يظهر جواز السفر عند 100%.",
    completedNote: "تهانينا! لقد حصلت على جواز السفر.",
    checkpoints: "أختام نقاط التحقق",
    stamped: "مختوم",
    pending: "مغلق",
    completionDate: "تاريخ الإكمال",
    loading: "جارٍ التحميل...",
    missing: "لم يتم العثور على الرحلة",
    notAvailable: "غير متاح",
    status: "الحالة",
  },
};

function tFor(language, key) {
  return TEXT[language]?.[key] || TEXT.en[key] || key;
}

// ============================================================
// DATA HELPERS
// ============================================================

function safeParse(raw, fallback = null) {
  try {
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getId(item) {
  const id = item?.id ?? item?.journeyId ?? item?.routeKey;
  return id == null ? "" : String(id);
}

function progressOf(value) {
  if (typeof value === "number") {
    return Math.max(0, Math.min(100, value));
  }

  if (!value || typeof value !== "object") return 0;

  if (
    value.completed === true ||
    value.isCompleted === true ||
    value.status === "completed"
  ) {
    return 100;
  }

  const number = Number(
    value.progress ??
      value.journeyProgress ??
      value.progressPercent ??
      value.percentComplete ??
      0
  );

  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : 0;
}

function readDate(value) {
  const raw =
    value?.completedAt ??
    value?.completionDate ??
    value?.completedDate ??
    value?.finishedAt;

  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function buildMap(value) {
  const map = {};

  function add(id, record) {
    if (!id) return;

    const previous = map[id] || {};

    map[id] = {
      progress: Math.max(
        previous.progress || 0,
        progressOf(record)
      ),
      completedAt:
        readDate(record) || previous.completedAt || null,
    };
  }

  if (Array.isArray(value)) {
    value.forEach(item => add(getId(item), item));
  } else if (value && typeof value === "object") {
    const id = getId(value);

    if (id) {
      add(id, value);
    } else {
      Object.entries(value).forEach(([key, record]) => {
        add(key, record);
      });
    }
  }

  return map;
}

function validImage(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.uri) {
    return value;
  }
  return null;
}

function normalized(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

// Support older Profile passport identifiers.
const LEGACY_SEARCH = {
  rome: ["roman empire", "rome"],
  wall: ["great wall of china", "great wall"],
  tubman: ["harriet tubman", "tubman"],
  mecca: ["mecca"],
  tokyo: ["tokyo"],
  trans: ["trans-siberian"],
};

function resolveJourney(passportId) {
  const catalog = Array.isArray(JOURNEY_CATALOG)
    ? JOURNEY_CATALOG
    : [];

  const id = String(passportId || "").trim();

  const direct = catalog.find(item =>
    [item?.id, item?.journeyId, item?.routeKey]
      .filter(Boolean)
      .some(value => String(value) === id)
  );

  if (direct) return direct;

  const searchNames = LEGACY_SEARCH[id] || [];

  return (
    catalog.find(item => {
      const title = normalized(item?.title);
      return searchNames.some(name =>
        title.includes(normalized(name))
      );
    }) || null
  );
}

function checkpointCount(progress) {
  if (progress >= 100) return 5;
  if (progress >= 75) return 4;
  if (progress >= 50) return 3;
  if (progress >= 25) return 2;
  if (progress > 0) return 1;
  return 0;
}

function displayDistance(journey, language) {
  const distance =
    journey?.distanceMiles ??
    journey?.miles ??
    journey?.distance;

  if (distance === undefined || distance === null) {
    return tFor(language, "notAvailable");
  }

  if (typeof distance === "number") {
    return `${distance} ${tFor(language, "distance") === "Distancia" ? "millas" : "miles"}`;
  }

  return String(distance);
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function PassportDetailScreen({
  passportId = "rome",
  goBack,
  language = "en",
}) {
  const t = useCallback(
    key => tFor(language, key),
    [language]
  );

  const journey = useMemo(
    () => resolveJourney(passportId),
    [passportId]
  );

  const localized = useMemo(
    () =>
      journey
        ? getJourneyTranslation(journey, language) || journey
        : null,
    [journey, language]
  );

  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);

    try {
      const values = await AsyncStorage.multiGet([
        PROGRESS_KEY,
        ACTIVE_KEY,
      ]);

      const map = buildMap(safeParse(values[0]?.[1], []));
      const active = safeParse(values[1]?.[1], null);

      const activeId = getId(active);

      if (activeId) {
        const previous = map[activeId] || {};

        map[activeId] = {
          progress: Math.max(
            previous.progress || 0,
            progressOf(active)
          ),
          completedAt:
            readDate(active) || previous.completedAt || null,
        };
      }

      setProgressMap(map);
    } catch (error) {
      console.log("Passport Detail load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      state => {
        if (state === "active") loadProgress();
      }
    );

    return () => subscription.remove();
  }, [loadProgress]);

  const id = getId(journey);
  const record = progressMap[id] || {};
  const progress = progressOf(record);
  const unlocked = progress >= 100;
  const started = progress > 0 && progress < 100;

  // Passport artwork is never accessed for display
  // until this particular Journey is complete.
  const unlockedArtwork = journey
    ? validImage(passportImages[id]) ||
      validImage(journey.passportCover) ||
      validImage(journey.passportImage)
    : null;

  const artwork = unlocked
    ? unlockedArtwork
    : LOCKED_PASSPORT;

  const status = unlocked
    ? t("completed")
    : started
    ? t("inProgress")
    : t("locked");

  const description =
    localized?.description ||
    journey?.description ||
    journey?.story ||
    "";

  const location =
    localized?.location ||
    journey?.location ||
    journey?.region ||
    t("notAvailable");

  const completionDate =
    unlocked && record.completedAt
      ? new Date(record.completedAt).toLocaleDateString(language)
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={DETAIL_BACKGROUND}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
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

            <Text style={styles.kicker}>
              LEGATHON WALK
            </Text>

            <Text style={styles.heading}>
              {t("passport")}
            </Text>

            {loading ? (
              <View style={styles.sectionCard}>
                <Text style={styles.description}>
                  {t("loading")}
                </Text>
              </View>
            ) : !journey ? (
              <View style={styles.sectionCard}>
                <Text style={styles.description}>
                  {t("missing")}
                </Text>
              </View>
            ) : (
              <>
                {/* LOCKED OR REVEALED PASSPORT */}

                <View style={styles.artworkCard}>
                  {artwork ? (
                    <Image
                      source={artwork}
                      style={styles.passportImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.fallbackArtwork}>
                      <Text style={styles.fallbackText}>🛂</Text>
                    </View>
                  )}
                </View>

                {/* JOURNEY STATUS */}

                <View style={styles.heroCard}>
                  <Text style={styles.title}>
                    {localized?.title || journey.title}
                  </Text>

                  <Text style={styles.location}>
                    {location}
                  </Text>

                  <Text style={styles.distance}>
                    {displayDistance(journey, language)}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      unlocked && styles.statusCompleted,
                    ]}
                  >
                    {status}
                  </Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.percent}>
                    {Math.round(progress)}%
                  </Text>

                  <Text style={styles.guidance}>
                    {unlocked
                      ? t("completedNote")
                      : started
                      ? t("progressNote")
                      : t("unlockNote")}
                  </Text>
                </View>

                {/* JOURNEY STORY */}

                {!!description && (
                  <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>
                      {t("story")}
                    </Text>

                    <Text style={styles.description}>
                      {description}
                    </Text>
                  </View>
                )}

                {/* PASSPORT DETAILS */}

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>
                    {t("details")}
                  </Text>

                  <DetailRow
                    label={t("journey")}
                    value={localized?.title || journey.title}
                  />

                  <DetailRow
                    label={t("region")}
                    value={String(location)}
                  />

                  <DetailRow
                    label={t("distance")}
                    value={displayDistance(journey, language)}
                  />

                  <DetailRow
                    label={t("progress")}
                    value={`${Math.round(progress)}%`}
                  />

                  <DetailRow
                    label={t("status")}
                    value={status}
                  />

                  {completionDate && (
                    <DetailRow
                      label={t("completionDate")}
                      value={completionDate}
                    />
                  )}
                </View>

                {/* FIVE CHECKPOINT STAMPS */}

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>
                    {t("checkpoints")}
                  </Text>

                  <View style={styles.checkpointRow}>
                    {[1, 2, 3, 4, 5].map(number => {
                      const earned =
                        number <= checkpointCount(progress);

                      return (
                        <View
                          key={number}
                          style={styles.checkpointItem}
                        >
                          <View
                            style={[
                              styles.stampCircle,
                              earned && styles.stampEarned,
                            ]}
                          >
                            <Text
                              style={[
                                styles.stampNumber,
                                earned && styles.stampNumberEarned,
                              ]}
                            >
                              {number}
                            </Text>
                          </View>

                          <Text
                            style={[
                              styles.stampCaption,
                              earned && styles.stampCaptionEarned,
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {earned ? t("stamped") : t("pending")}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* ONLY COMPLETED JOURNEYS GET PASSPORTS */}

                {unlocked && (
                  <View style={styles.unlockedBox}>
                    <Text style={styles.unlockedText}>
                      ✓ {t("completed")}
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
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
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.60)",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 160,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 5,
  },
  backText: {
    color: GOLD,
    fontSize: 21,
    fontWeight: "900",
  },
  kicker: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 7,
  },
  heading: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 20,
  },
  artworkCard: {
    height: 360,
    backgroundColor: NAVY,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: GOLD,
    padding: 10,
    overflow: "hidden",
    marginBottom: 22,
  },
  passportImage: {
    width: "100%",
    height: "100%",
  },
  fallbackArtwork: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 75,
  },
  heroCard: {
    backgroundColor: "rgba(8,18,37,0.92)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.40)",
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
  },
  title: {
    color: WHITE,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    textAlign: "center",
  },
  location: {
    color: MUTED,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },
  distance: {
    color: GOLD,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },
  status: {
    color: "#C9D1DF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 17,
    textAlign: "center",
  },
  statusCompleted: {
    color: GOLD,
  },
  progressTrack: {
    width: "100%",
    height: 13,
    borderRadius: 10,
    backgroundColor: "#25394F",
    overflow: "hidden",
    marginTop: 18,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GOLD,
    borderRadius: 10,
  },
  percent: {
    color: GOLD,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 9,
  },
  guidance: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 13,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: "rgba(8,18,37,0.92)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 20,
    marginBottom: 22,
  },
  sectionTitle: {
    color: WHITE,
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 15,
  },
  description: {
    color: MUTED,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 27,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(170,179,197,0.17)",
    paddingVertical: 12,
  },
  detailLabel: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "800",
  },
  detailValue: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
    flex: 1,
  },
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  checkpointItem: {
    flex: 1,
    alignItems: "center",
  },
  stampCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#64748B",
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  stampEarned: {
    backgroundColor: GOLD,
    borderColor: WHITE,
  },
  stampNumber: {
    color: "#94A3B8",
    fontWeight: "900",
    fontSize: 19,
  },
  stampNumberEarned: {
    color: "#020617",
  },
  stampCaption: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 7,
  },
  stampCaptionEarned: {
    color: GOLD,
  },
  unlockedBox: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 18,
    backgroundColor: "rgba(212,175,55,0.14)",
    alignItems: "center",
    paddingVertical: 17,
  },
  unlockedText: {
    color: GOLD,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
});

