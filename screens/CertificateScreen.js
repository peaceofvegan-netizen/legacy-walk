// screens/CertificateScreen.js
//
// ============================================================
// LEGATHON WALK
// CERTIFICATES
//
// • Displays earned journey certificates
// • Supports completed journey data
// • Supports 10 Legathon languages
// • Keeps dynamic journey names intact
// • Safe fallback data handling
// ============================================================

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
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";


// ============================================================
// STORAGE KEYS
//
// We check several keys because older Legathon builds may have
// stored completion information in different locations.
// ============================================================

const CERTIFICATE_KEYS = [
  "legathonCertificates",
  "@legathon_certificates",
  "completedJourneys",
  "@legathon_completed_journeys",
  "journeyCertificates",
];


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    brand: "LEGATHON WALK",
    eyebrow: "ACHIEVEMENT CERTIFICATES",
    title: "Your Certificates",
    subtitle:
      "Celebrate the journeys you have completed and the milestones you have earned.",
    earned: "Certificates Earned",
    certificate: "CERTIFICATE OF COMPLETION",
    presentedTo: "Presented to",
    walker: "Legathon Walker",
    completed: "Successfully Completed",
    journey: "Journey",
    distance: "Distance",
    steps: "Steps",
    completedOn: "Completed",
    achievement: "LEGATHON WALK ACHIEVEMENT",
    certificateNumber: "Certificate",
    viewCertificate: "View Certificate",
    closeCertificate: "Close Certificate",
    noCertificates: "No certificates yet",
    noCertificatesText:
      "Complete a Legathon Walk journey to earn your first certificate.",
    loading: "Loading certificates...",
    reload: "Reload",
    unableLoad: "Unable to Load Certificates",
    unableLoadText:
      "Your certificates could not be loaded. Please try again.",
    miles: "miles",
  },

  es: {
    back: "Atrás",
    brand: "LEGATHON WALK",
    eyebrow: "CERTIFICADOS DE LOGRO",
    title: "Tus Certificados",
    subtitle:
      "Celebra los recorridos que has completado y los logros que has conseguido.",
    earned: "Certificados Obtenidos",
    certificate: "CERTIFICADO DE FINALIZACIÓN",
    presentedTo: "Presentado a",
    walker: "Caminante Legathon",
    completed: "Completó con éxito",
    journey: "Recorrido",
    distance: "Distancia",
    steps: "Pasos",
    completedOn: "Completado",
    achievement: "LOGRO LEGATHON WALK",
    certificateNumber: "Certificado",
    viewCertificate: "Ver Certificado",
    closeCertificate: "Cerrar Certificado",
    noCertificates: "Aún no hay certificados",
    noCertificatesText:
      "Completa un recorrido de Legathon Walk para obtener tu primer certificado.",
    loading: "Cargando certificados...",
    reload: "Recargar",
    unableLoad: "No se pueden cargar los certificados",
    unableLoadText:
      "No se pudieron cargar tus certificados. Inténtalo de nuevo.",
    miles: "millas",
  },

  fr: {
    back: "Retour",
    brand: "LEGATHON WALK",
    eyebrow: "CERTIFICATS DE RÉUSSITE",
    title: "Vos Certificats",
    subtitle:
      "Célébrez les parcours terminés et les étapes importantes accomplies.",
    earned: "Certificats Obtenus",
    certificate: "CERTIFICAT D’ACHÈVEMENT",
    presentedTo: "Présenté à",
    walker: "Marcheur Legathon",
    completed: "A terminé avec succès",
    journey: "Parcours",
    distance: "Distance",
    steps: "Pas",
    completedOn: "Terminé",
    achievement: "RÉUSSITE LEGATHON WALK",
    certificateNumber: "Certificat",
    viewCertificate: "Voir le Certificat",
    closeCertificate: "Fermer le Certificat",
    noCertificates: "Aucun certificat pour le moment",
    noCertificatesText:
      "Terminez un parcours Legathon Walk pour obtenir votre premier certificat.",
    loading: "Chargement des certificats...",
    reload: "Recharger",
    unableLoad: "Impossible de charger les certificats",
    unableLoadText:
      "Vos certificats n’ont pas pu être chargés. Réessayez.",
    miles: "miles",
  },

  de: {
    back: "Zurück",
    brand: "LEGATHON WALK",
    eyebrow: "ERFOLGSZERTIFIKATE",
    title: "Deine Zertifikate",
    subtitle:
      "Feiere deine abgeschlossenen Reisen und erreichten Meilensteine.",
    earned: "Erhaltene Zertifikate",
    certificate: "ABSCHLUSSZERTIFIKAT",
    presentedTo: "Verliehen an",
    walker: "Legathon Walker",
    completed: "Erfolgreich abgeschlossen",
    journey: "Reise",
    distance: "Distanz",
    steps: "Schritte",
    completedOn: "Abgeschlossen",
    achievement: "LEGATHON WALK ERFOLG",
    certificateNumber: "Zertifikat",
    viewCertificate: "Zertifikat Anzeigen",
    closeCertificate: "Zertifikat Schließen",
    noCertificates: "Noch keine Zertifikate",
    noCertificatesText:
      "Schließe eine Legathon-Walk-Reise ab, um dein erstes Zertifikat zu erhalten.",
    loading: "Zertifikate werden geladen...",
    reload: "Neu laden",
    unableLoad: "Zertifikate konnten nicht geladen werden",
    unableLoadText:
      "Deine Zertifikate konnten nicht geladen werden. Versuche es erneut.",
    miles: "Meilen",
  },

  pt: {
    back: "Voltar",
    brand: "LEGATHON WALK",
    eyebrow: "CERTIFICADOS DE CONQUISTA",
    title: "Seus Certificados",
    subtitle:
      "Celebre as jornadas concluídas e os marcos que você conquistou.",
    earned: "Certificados Conquistados",
    certificate: "CERTIFICADO DE CONCLUSÃO",
    presentedTo: "Apresentado a",
    walker: "Caminhante Legathon",
    completed: "Concluiu com sucesso",
    journey: "Jornada",
    distance: "Distância",
    steps: "Passos",
    completedOn: "Concluído",
    achievement: "CONQUISTA LEGATHON WALK",
    certificateNumber: "Certificado",
    viewCertificate: "Ver Certificado",
    closeCertificate: "Fechar Certificado",
    noCertificates: "Nenhum certificado ainda",
    noCertificatesText:
      "Conclua uma jornada Legathon Walk para ganhar seu primeiro certificado.",
    loading: "Carregando certificados...",
    reload: "Recarregar",
    unableLoad: "Não foi possível carregar os certificados",
    unableLoadText:
      "Seus certificados não puderam ser carregados. Tente novamente.",
    miles: "milhas",
  },

  ja: {
    back: "戻る",
    brand: "LEGATHON WALK",
    eyebrow: "達成証明書",
    title: "あなたの証明書",
    subtitle:
      "完了したジャーニーと達成したマイルストーンを祝いましょう。",
    earned: "獲得した証明書",
    certificate: "完了証明書",
    presentedTo: "授与",
    walker: "Legathon ウォーカー",
    completed: "正常に完了しました",
    journey: "ジャーニー",
    distance: "距離",
    steps: "歩数",
    completedOn: "完了日",
    achievement: "LEGATHON WALK 達成",
    certificateNumber: "証明書",
    viewCertificate: "証明書を見る",
    closeCertificate: "証明書を閉じる",
    noCertificates: "まだ証明書はありません",
    noCertificatesText:
      "Legathon Walk のジャーニーを完了すると、最初の証明書を獲得できます。",
    loading: "証明書を読み込んでいます...",
    reload: "再読み込み",
    unableLoad: "証明書を読み込めません",
    unableLoadText:
      "証明書を読み込めませんでした。もう一度お試しください。",
    miles: "マイル",
  },

  ko: {
    back: "뒤로",
    brand: "LEGATHON WALK",
    eyebrow: "성취 인증서",
    title: "나의 인증서",
    subtitle:
      "완료한 여정과 달성한 이정표를 기념하세요.",
    earned: "획득한 인증서",
    certificate: "완료 인증서",
    presentedTo: "수여 대상",
    walker: "Legathon 워커",
    completed: "성공적으로 완료",
    journey: "여정",
    distance: "거리",
    steps: "걸음",
    completedOn: "완료",
    achievement: "LEGATHON WALK 성취",
    certificateNumber: "인증서",
    viewCertificate: "인증서 보기",
    closeCertificate: "인증서 닫기",
    noCertificates: "아직 인증서가 없습니다",
    noCertificatesText:
      "Legathon Walk 여정을 완료하여 첫 인증서를 획득하세요.",
    loading: "인증서를 불러오는 중...",
    reload: "다시 불러오기",
    unableLoad: "인증서를 불러올 수 없습니다",
    unableLoadText:
      "인증서를 불러올 수 없습니다. 다시 시도해 주세요.",
    miles: "마일",
  },

  zh: {
    back: "返回",
    brand: "LEGATHON WALK",
    eyebrow: "成就证书",
    title: "你的证书",
    subtitle:
      "庆祝你完成的旅程和取得的里程碑。",
    earned: "已获得证书",
    certificate: "完成证书",
    presentedTo: "授予",
    walker: "Legathon 行者",
    completed: "成功完成",
    journey: "旅程",
    distance: "距离",
    steps: "步数",
    completedOn: "完成日期",
    achievement: "LEGATHON WALK 成就",
    certificateNumber: "证书",
    viewCertificate: "查看证书",
    closeCertificate: "关闭证书",
    noCertificates: "暂无证书",
    noCertificatesText:
      "完成一个 Legathon Walk 旅程即可获得你的第一张证书。",
    loading: "正在加载证书...",
    reload: "重新加载",
    unableLoad: "无法加载证书",
    unableLoadText:
      "无法加载你的证书。请重试。",
    miles: "英里",
  },

  it: {
    back: "Indietro",
    brand: "LEGATHON WALK",
    eyebrow: "CERTIFICATI DI SUCCESSO",
    title: "I Tuoi Certificati",
    subtitle:
      "Celebra i percorsi completati e i traguardi raggiunti.",
    earned: "Certificati Ottenuti",
    certificate: "CERTIFICATO DI COMPLETAMENTO",
    presentedTo: "Presentato a",
    walker: "Camminatore Legathon",
    completed: "Ha completato con successo",
    journey: "Percorso",
    distance: "Distanza",
    steps: "Passi",
    completedOn: "Completato",
    achievement: "TRAGUARDO LEGATHON WALK",
    certificateNumber: "Certificato",
    viewCertificate: "Visualizza Certificato",
    closeCertificate: "Chiudi Certificato",
    noCertificates: "Nessun certificato ancora",
    noCertificatesText:
      "Completa un percorso Legathon Walk per ottenere il tuo primo certificato.",
    loading: "Caricamento certificati...",
    reload: "Ricarica",
    unableLoad: "Impossibile caricare i certificati",
    unableLoadText:
      "Non è stato possibile caricare i certificati. Riprova.",
    miles: "miglia",
  },

  ar: {
    back: "رجوع",
    brand: "LEGATHON WALK",
    eyebrow: "شهادات الإنجاز",
    title: "شهاداتك",
    subtitle:
      "احتفل بالرحلات التي أكملتها والإنجازات التي حققتها.",
    earned: "الشهادات المكتسبة",
    certificate: "شهادة إتمام",
    presentedTo: "مقدمة إلى",
    walker: "مشارك Legathon",
    completed: "أكمل بنجاح",
    journey: "الرحلة",
    distance: "المسافة",
    steps: "الخطوات",
    completedOn: "تاريخ الإكمال",
    achievement: "إنجاز LEGATHON WALK",
    certificateNumber: "الشهادة",
    viewCertificate: "عرض الشهادة",
    closeCertificate: "إغلاق الشهادة",
    noCertificates: "لا توجد شهادات بعد",
    noCertificatesText:
      "أكمل رحلة في Legathon Walk للحصول على شهادتك الأولى.",
    loading: "جارٍ تحميل الشهادات...",
    reload: "إعادة التحميل",
    unableLoad: "تعذر تحميل الشهادات",
    unableLoadText:
      "تعذر تحميل شهاداتك. يرجى المحاولة مرة أخرى.",
    miles: "ميل",
  },
};


// ============================================================
// HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}


function safeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, number)
    : 0;
}


function normalizeCertificate(item, index = 0) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const journey =
    item.journey ||
    item.journeyTitle ||
    item.title ||
    item.name ||
    "Legathon Journey";

  const id =
    item.id ||
    item.journeyId ||
    item.slug ||
    `${journey}-${index}`;

  const miles = safeNumber(
    item.miles ??
      item.distanceMiles ??
      item.distance
  );

  const steps = safeNumber(
    item.steps ??
      item.totalSteps ??
      item.stepCount
  );

  const completedAt =
    item.completedAt ||
    item.completedDate ||
    item.date ||
    item.earnedAt ||
    "";

  const certificateNumber =
    item.certificateNumber ||
    item.certificateId ||
    `LW-${String(index + 1).padStart(4, "0")}`;

  return {
    ...item,
    id: String(id),
    journey,
    miles,
    steps,
    completedAt,
    certificateNumber,
  };
}


function extractCertificates(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data
      .map(normalizeCertificate)
      .filter(Boolean);
  }

  if (typeof data !== "object") {
    return [];
  }

  if (Array.isArray(data.certificates)) {
    return data.certificates
      .map(normalizeCertificate)
      .filter(Boolean);
  }

  if (Array.isArray(data.completedJourneys)) {
    return data.completedJourneys
      .map(normalizeCertificate)
      .filter(Boolean);
  }

  if (Array.isArray(data.journeys)) {
    return data.journeys
      .filter(
        item =>
          item?.completed === true ||
          item?.isCompleted === true ||
          item?.status === "completed"
      )
      .map(normalizeCertificate)
      .filter(Boolean);
  }

  // Supports object maps such as:
  // { "great-wall": { completed: true, ... } }

  return Object.entries(data)
    .filter(([, value]) => {
      if (!value || typeof value !== "object") {
        return false;
      }

      return (
        value.completed === true ||
        value.isCompleted === true ||
        value.status === "completed" ||
        Boolean(value.completedAt)
      );
    })
    .map(([key, value], index) =>
      normalizeCertificate(
        {
          id: value.id || key,
          ...value,
        },
        index
      )
    )
    .filter(Boolean);
}


// ============================================================
// SCREEN
// ============================================================

export default function CertificateScreen({
  navigation,
  route,
  goBack,
  language = "en",
  certificates: certificateProp,
  userName = "Legathon Walker",
}) {
  const languageCode =
    normalizeLanguage(language);

  const t = useCallback(
    key =>
      TEXT[languageCode]?.[key] ||
      TEXT.en[key] ||
      key,
    [languageCode]
  );


  // ==========================================================
  // STATE
  // ==========================================================

  const [certificates, setCertificates] =
    useState([]);

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);


  // ==========================================================
  // RTL
  // ==========================================================

  const isRTL =
    languageCode === "ar";

  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  // ==========================================================
  // ROUTE DATA
  // ==========================================================

  const routeCertificates =
    route?.params?.certificates;

  const routeCertificate =
    route?.params?.certificate;

  const routeUserName =
    route?.params?.userName;

  const displayUserName =
    routeUserName ||
    userName ||
    t("walker");


  // ==========================================================
  // LOAD CERTIFICATES
  // ==========================================================

  const loadCertificates =
    useCallback(async () => {
      try {
        setLoading(true);
        setLoadError(false);

        // -----------------------------------------------
        // DIRECT PROP
        // -----------------------------------------------

        if (
          Array.isArray(certificateProp) &&
          certificateProp.length > 0
        ) {
          setCertificates(
            certificateProp
              .map(normalizeCertificate)
              .filter(Boolean)
          );

          return;
        }


        // -----------------------------------------------
        // ROUTE ARRAY
        // -----------------------------------------------

        if (
          Array.isArray(routeCertificates) &&
          routeCertificates.length > 0
        ) {
          setCertificates(
            routeCertificates
              .map(normalizeCertificate)
              .filter(Boolean)
          );

          return;
        }


        // -----------------------------------------------
        // SINGLE ROUTE CERTIFICATE
        // -----------------------------------------------

        if (
          routeCertificate &&
          typeof routeCertificate === "object"
        ) {
          const normalized =
            normalizeCertificate(
              routeCertificate,
              0
            );

          if (normalized) {
            setCertificates([
              normalized,
            ]);

            setSelectedCertificate(
              normalized
            );

            return;
          }
        }


        // -----------------------------------------------
        // ASYNC STORAGE
        // -----------------------------------------------

        const found = [];
        const foundIds =
          new Set();

        for (
          const key of CERTIFICATE_KEYS
        ) {
          const saved =
            await AsyncStorage.getItem(
              key
            );

          if (!saved) {
            continue;
          }

          let parsed;

          try {
            parsed =
              JSON.parse(saved);
          } catch {
            continue;
          }

          const extracted =
            extractCertificates(
              parsed
            );

          extracted.forEach(
            certificate => {
              const uniqueKey =
                String(
                  certificate.id ||
                  certificate.journey
                );

              if (
                !foundIds.has(
                  uniqueKey
                )
              ) {
                foundIds.add(
                  uniqueKey
                );

                found.push(
                  certificate
                );
              }
            }
          );
        }

        setCertificates(found);

      } catch (error) {
        console.log(
          "CERTIFICATE LOAD ERROR:",
          error
        );

        setCertificates([]);
        setLoadError(true);

      } finally {
        setLoading(false);
      }
    }, [
      certificateProp,
      routeCertificates,
      routeCertificate,
    ]);


  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    useCallback(() => {
      if (
        selectedCertificate
      ) {
        setSelectedCertificate(
          null
        );

        return;
      }

      if (
        typeof goBack ===
        "function"
      ) {
        goBack();
        return;
      }

      navigation?.goBack?.();

    }, [
      selectedCertificate,
      goBack,
      navigation,
    ]);


  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate =
    useCallback(
      value => {
        if (!value) {
          return "—";
        }

        const date =
          new Date(value);

        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return String(value);
        }

        try {
          return date.toLocaleDateString(
            languageCode,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
        } catch {
          return date.toLocaleDateString();
        }
      },
      [languageCode]
    );


  // ==========================================================
  // NUMBER FORMAT
  // ==========================================================

  const formatNumber =
    useCallback(
      value => {
        try {
          return safeNumber(
            value
          ).toLocaleString(
            languageCode
          );
        } catch {
          return safeNumber(
            value
          ).toLocaleString();
        }
      },
      [languageCode]
    );


  // ==========================================================
  // SELECTED CERTIFICATE
  // ==========================================================

  if (selectedCertificate) {
    const item =
      selectedCertificate;

    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.certificateScreenContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              handleBack
            }
          >
            <Text
              style={[
                styles.backText,
                rtlText,
              ]}
            >
              {isRTL
                ? `› ${t("back")}`
                : `‹ ${t("back")}`}
            </Text>
          </TouchableOpacity>


          <View
            style={
              styles.fullCertificateOuter
            }
          >
            <View
              style={
                styles.fullCertificateMiddle
              }
            >
              <View
                style={
                  styles.fullCertificate
                }
              >
                <Text
                  style={
                    styles.certificateLogo
                  }
                >
                  L
                </Text>


                <Text
                  style={[
                    styles.certificateBrand,
                    rtlText,
                  ]}
                >
                  {t("brand")}
                </Text>


                <View
                  style={
                    styles.goldDivider
                  }
                />


                <Text
                  style={[
                    styles.certificateHeading,
                    rtlText,
                  ]}
                >
                  {t("certificate")}
                </Text>


                <Text
                  style={[
                    styles.presentedLabel,
                    rtlText,
                  ]}
                >
                  {t("presentedTo")}
                </Text>


                <Text
                  style={[
                    styles.walkerName,
                    rtlText,
                  ]}
                  numberOfLines={
                    2
                  }
                  adjustsFontSizeToFit
                >
                  {displayUserName}
                </Text>


                <View
                  style={
                    styles.nameLine
                  }
                />


                <Text
                  style={[
                    styles.completedLabel,
                    rtlText,
                  ]}
                >
                  {t("completed")}
                </Text>


                <Text
                  style={[
                    styles.journeyName,
                    rtlText,
                  ]}
                  numberOfLines={
                    3
                  }
                  adjustsFontSizeToFit
                >
                  {item.journey}
                </Text>


                <View
                  style={
                    styles.certificateStats
                  }
                >
                  <View
                    style={
                      styles.certificateStat
                    }
                  >
                    <Text
                      style={
                        styles.certificateStatValue
                      }
                    >
                      {item.miles > 0
                        ? formatNumber(
                            item.miles
                          )
                        : "—"}
                    </Text>

                    <Text
                      style={[
                        styles.certificateStatLabel,
                        rtlText,
                      ]}
                    >
                      {t("distance")}
                    </Text>

                    {item.miles > 0 && (
                      <Text
                        style={[
                          styles.certificateStatSmall,
                          rtlText,
                        ]}
                      >
                        {t("miles")}
                      </Text>
                    )}
                  </View>


                  <View
                    style={
                      styles.statDivider
                    }
                  />


                  <View
                    style={
                      styles.certificateStat
                    }
                  >
                    <Text
                      style={
                        styles.certificateStatValue
                      }
                      numberOfLines={
                        1
                      }
                      adjustsFontSizeToFit
                    >
                      {item.steps > 0
                        ? formatNumber(
                            item.steps
                          )
                        : "—"}
                    </Text>

                    <Text
                      style={[
                        styles.certificateStatLabel,
                        rtlText,
                      ]}
                    >
                      {t("steps")}
                    </Text>
                  </View>
                </View>


                <Text
                  style={[
                    styles.dateLabel,
                    rtlText,
                  ]}
                >
                  {t("completedOn")}
                </Text>


                <Text
                  style={[
                    styles.dateValue,
                    rtlText,
                  ]}
                >
                  {formatDate(
                    item.completedAt
                  )}
                </Text>


                <View
                  style={
                    styles.seal
                  }
                >
                  <View
                    style={
                      styles.sealInner
                    }
                  >
                    <Text
                      style={
                        styles.sealIcon
                      }
                    >
                      ✓
                    </Text>
                  </View>
                </View>


                <Text
                  style={[
                    styles.achievementText,
                    rtlText,
                  ]}
                >
                  {t("achievement")}
                </Text>


                <Text
                  style={[
                    styles.certificateId,
                    rtlText,
                  ]}
                >
                  {t(
                    "certificateNumber"
                  )}{" "}
                  #{item.certificateNumber}
                </Text>
              </View>
            </View>
          </View>


          <TouchableOpacity
            style={
              styles.closeButton
            }
            onPress={() =>
              setSelectedCertificate(
                null
              )
            }
          >
            <Text
              style={
                styles.closeButtonText
              }
            >
              {t(
                "closeCertificate"
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }


  // ==========================================================
  // MAIN CERTIFICATE LIST
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={
            handleBack
          }
        >
          <Text
            style={[
              styles.backText,
              rtlText,
            ]}
          >
            {isRTL
              ? `› ${t("back")}`
              : `‹ ${t("back")}`}
          </Text>
        </TouchableOpacity>


        <Text
          style={[
            styles.brand,
            rtlText,
          ]}
        >
          {t("brand")}
        </Text>


        <Text
          style={[
            styles.eyebrow,
            rtlText,
          ]}
        >
          {t("eyebrow")}
        </Text>


        <Text
          style={[
            styles.title,
            rtlText,
          ]}
          adjustsFontSizeToFit
          numberOfLines={
            2
          }
        >
          {t("title")}
        </Text>


        <Text
          style={[
            styles.subtitle,
            rtlText,
          ]}
        >
          {t("subtitle")}
        </Text>


        <View
          style={
            styles.summaryCard
          }
        >
          <View>
            <Text
              style={[
                styles.summaryLabel,
                rtlText,
              ]}
            >
              {t("earned")}
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {certificates.length}
            </Text>
          </View>

          <View
            style={
              styles.summaryIcon
            }
          >
            <Text
              style={
                styles.summaryIconText
              }
            >
              🏆
            </Text>
          </View>
        </View>


        {loading ? (
          <View
            style={
              styles.stateCard
            }
          >
            <ActivityIndicator
              size="large"
              color="#D8A72E"
            />

            <Text
              style={[
                styles.stateText,
                rtlText,
              ]}
            >
              {t("loading")}
            </Text>
          </View>
        ) : loadError ? (
          <View
            style={
              styles.stateCard
            }
          >
            <Text
              style={
                styles.stateIcon
              }
            >
              ⚠️
            </Text>

            <Text
              style={[
                styles.stateTitle,
                rtlText,
              ]}
            >
              {t(
                "unableLoad"
              )}
            </Text>

            <Text
              style={[
                styles.stateText,
                rtlText,
              ]}
            >
              {t(
                "unableLoadText"
              )}
            </Text>

            <TouchableOpacity
              style={
                styles.reloadButton
              }
              onPress={
                loadCertificates
              }
            >
              <Text
                style={
                  styles.reloadButtonText
                }
              >
                {t("reload")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : certificates.length ===
          0 ? (
          <View
            style={
              styles.emptyCard
            }
          >
            <View
              style={
                styles.emptyMedal
              }
            >
              <Text
                style={
                  styles.emptyMedalText
                }
              >
                🏅
              </Text>
            </View>

            <Text
              style={[
                styles.emptyTitle,
                rtlText,
              ]}
            >
              {t(
                "noCertificates"
              )}
            </Text>

            <Text
              style={[
                styles.emptyText,
                rtlText,
              ]}
            >
              {t(
                "noCertificatesText"
              )}
            </Text>
          </View>
        ) : (
          certificates.map(
            (
              certificate,
              index
            ) => (
              <TouchableOpacity
                key={
                  certificate.id ||
                  `${certificate.journey}-${index}`
                }
                style={
                  styles.certificateCard
                }
                onPress={() =>
                  setSelectedCertificate(
                    certificate
                  )
                }
                activeOpacity={
                  0.88
                }
              >
                <View
                  style={
                    styles.cardGoldLine
                  }
                />

                <View
                  style={
                    styles.cardTop
                  }
                >
                  <View
                    style={
                      styles.cardSeal
                    }
                  >
                    <Text
                      style={
                        styles.cardSealText
                      }
                    >
                      ✓
                    </Text>
                  </View>

                  <View
                    style={
                      styles.cardHeaderText
                    }
                  >
                    <Text
                      style={[
                        styles.cardCertificateLabel,
                        rtlText,
                      ]}
                    >
                      {t(
                        "certificate"
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.cardJourney,
                        rtlText,
                      ]}
                      numberOfLines={
                        2
                      }
                    >
                      {certificate.journey}
                    </Text>
                  </View>
                </View>


                <View
                  style={
                    styles.cardInfoRow
                  }
                >
                  <View
                    style={
                      styles.cardInfo
                    }
                  >
                    <Text
                      style={[
                        styles.cardInfoLabel,
                        rtlText,
                      ]}
                    >
                      {t("distance")}
                    </Text>

                    <Text
                      style={
                        styles.cardInfoValue
                      }
                    >
                      {certificate.miles >
                      0
                        ? `${formatNumber(
                            certificate.miles
                          )} ${t(
                            "miles"
                          )}`
                        : "—"}
                    </Text>
                  </View>


                  <View
                    style={
                      styles.cardInfo
                    }
                  >
                    <Text
                      style={[
                        styles.cardInfoLabel,
                        rtlText,
                      ]}
                    >
                      {t("steps")}
                    </Text>

                    <Text
                      style={
                        styles.cardInfoValue
                      }
                    >
                      {certificate.steps >
                      0
                        ? formatNumber(
                            certificate.steps
                          )
                        : "—"}
                    </Text>
                  </View>
                </View>


                <View
                  style={
                    styles.cardBottom
                  }
                >
                  <Text
                    style={[
                      styles.cardDate,
                      rtlText,
                    ]}
                  >
                    {formatDate(
                      certificate.completedAt
                    )}
                  </Text>

                  <Text
                    style={
                      styles.viewText
                    }
                  >
                    {t(
                      "viewCertificate"
                    )}{" "}
                    ›
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )
        )}
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
        "#05070C",
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 130,
    },

    certificateScreenContent: {
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 80,
    },

    backButton: {
      alignSelf:
        "flex-start",
      paddingVertical: 10,
      paddingRight: 20,
    },

    backText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
    },

    brand: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 2.2,
      marginTop: 10,
    },

    eyebrow: {
      color: "#80F2CE",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2.4,
      marginTop: 16,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 38,
      lineHeight: 44,
      fontWeight: "900",
      marginTop: 7,
    },

    subtitle: {
      color: "#A8B3C2",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 10,
      marginBottom: 22,
    },

    summaryCard: {
      backgroundColor:
        "#101722",
      borderWidth: 1,
      borderColor:
        "#24334A",
      borderRadius: 23,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 22,
    },

    summaryLabel: {
      color: "#AFC0D9",
      fontSize: 13,
      fontWeight: "800",
    },

    summaryValue: {
      color: "#D8A72E",
      fontSize: 36,
      fontWeight: "900",
      marginTop: 3,
    },

    summaryIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        "#202A35",
      alignItems: "center",
      justifyContent:
        "center",
    },

    summaryIconText: {
      fontSize: 29,
    },

    certificateCard: {
      backgroundColor:
        "#101722",
      borderWidth: 1,
      borderColor:
        "#26364D",
      borderRadius: 23,
      padding: 18,
      marginBottom: 15,
      overflow: "hidden",
    },

    cardGoldLine: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 5,
      backgroundColor:
        "#D8A72E",
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    cardSeal: {
      width: 53,
      height: 53,
      borderRadius: 27,
      backgroundColor:
        "#D8A72E",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 13,
    },

    cardSealText: {
      color: "#05070C",
      fontSize: 25,
      fontWeight: "900",
    },

    cardHeaderText: {
      flex: 1,
    },

    cardCertificateLabel: {
      color: "#80F2CE",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    cardJourney: {
      color: "#FFFFFF",
      fontSize: 18,
      lineHeight: 23,
      fontWeight: "900",
      marginTop: 4,
    },

    cardInfoRow: {
      flexDirection: "row",
      marginTop: 17,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor:
        "#24334A",
    },

    cardInfo: {
      flex: 1,
    },

    cardInfoLabel: {
      color: "#8191A7",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    cardInfoValue: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 4,
    },

    cardBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 17,
    },

    cardDate: {
      color: "#8999AE",
      fontSize: 11,
      fontWeight: "700",
      flex: 1,
    },

    viewText: {
      color: "#D8A72E",
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 10,
    },

    emptyCard: {
      backgroundColor:
        "#101722",
      borderWidth: 1,
      borderColor:
        "#26364D",
      borderRadius: 25,
      padding: 28,
      alignItems: "center",
      marginTop: 4,
    },

    emptyMedal: {
      width: 75,
      height: 75,
      borderRadius: 38,
      backgroundColor:
        "#1B2635",
      alignItems: "center",
      justifyContent:
        "center",
    },

    emptyMedalText: {
      fontSize: 37,
    },

    emptyTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 17,
    },

    emptyText: {
      color: "#A8B3C2",
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 8,
    },

    stateCard: {
      backgroundColor:
        "#101722",
      borderRadius: 23,
      borderWidth: 1,
      borderColor:
        "#26364D",
      padding: 25,
      alignItems: "center",
    },

    stateIcon: {
      fontSize: 35,
    },

    stateTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 12,
    },

    stateText: {
      color: "#A8B3C2",
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 11,
    },

    reloadButton: {
      backgroundColor:
        "#D8A72E",
      borderRadius: 15,
      paddingHorizontal: 25,
      paddingVertical: 12,
      marginTop: 18,
    },

    reloadButtonText: {
      color: "#05070C",
      fontSize: 14,
      fontWeight: "900",
    },

    fullCertificateOuter: {
      backgroundColor:
        "#D8A72E",
      borderRadius: 28,
      padding: 4,
      marginTop: 10,
    },

    fullCertificateMiddle: {
      backgroundColor:
        "#09101A",
      borderRadius: 25,
      padding: 4,
    },

    fullCertificate: {
      backgroundColor:
        "#F8F5EC",
      borderWidth: 2,
      borderColor:
        "#D8A72E",
      borderRadius: 22,
      paddingHorizontal: 22,
      paddingVertical: 30,
      alignItems: "center",
      minHeight: 650,
    },

    certificateLogo: {
      color: "#D8A72E",
      fontSize: 45,
      fontWeight: "900",
    },

    certificateBrand: {
      color: "#121A24",
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 2.4,
      marginTop: 5,
      textAlign: "center",
    },

    goldDivider: {
      width: 80,
      height: 3,
      borderRadius: 2,
      backgroundColor:
        "#D8A72E",
      marginVertical: 20,
    },

    certificateHeading: {
      color: "#101820",
      fontSize: 23,
      lineHeight: 29,
      fontWeight: "900",
      textAlign: "center",
    },

    presentedLabel: {
      color: "#6B7280",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 22,
      textAlign: "center",
    },

    walkerName: {
      color: "#101820",
      fontSize: 29,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 7,
      width: "100%",
    },

    nameLine: {
      width: "76%",
      height: 1,
      backgroundColor:
        "#B99A43",
      marginTop: 8,
    },

    completedLabel: {
      color: "#6B7280",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 24,
      textAlign: "center",
    },

    journeyName: {
      color: "#B28619",
      fontSize: 27,
      lineHeight: 33,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 8,
      width: "100%",
    },

    certificateStats: {
      width: "100%",
      flexDirection: "row",
      marginTop: 27,
      paddingVertical: 17,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor:
        "#DDD4BD",
    },

    certificateStat: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    statDivider: {
      width: 1,
      backgroundColor:
        "#DDD4BD",
    },

    certificateStatValue: {
      color: "#101820",
      fontSize: 20,
      fontWeight: "900",
      maxWidth: "95%",
    },

    certificateStatLabel: {
      color: "#69717A",
      fontSize: 10,
      fontWeight: "900",
      marginTop: 4,
      textAlign: "center",
    },

    certificateStatSmall: {
      color: "#8B7350",
      fontSize: 9,
      fontWeight: "700",
      marginTop: 2,
    },

    dateLabel: {
      color: "#6B7280",
      fontSize: 10,
      fontWeight: "900",
      marginTop: 21,
      textAlign: "center",
    },

    dateValue: {
      color: "#101820",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 4,
      textAlign: "center",
    },

    seal: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor:
        "#D8A72E",
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 24,
      borderWidth: 3,
      borderColor:
        "#B28619",
    },

    sealInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      borderWidth: 2,
      borderColor:
        "#F7E7AA",
      alignItems: "center",
      justifyContent:
        "center",
    },

    sealIcon: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
    },

    achievementText: {
      color: "#B28619",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
      textAlign: "center",
      marginTop: 12,
    },

    certificateId: {
      color: "#858585",
      fontSize: 9,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 8,
    },

    closeButton: {
      backgroundColor:
        "#D8A72E",
      borderRadius: 18,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 20,
    },

    closeButtonText: {
      color: "#05070C",
      fontSize: 15,
      fontWeight: "900",
    },

    rtlText: {
      writingDirection: "rtl",
      textAlign: "right",
    },
  });