// screens/LeaderboardScreen.js
//
// LEGATHON WALK
// LEADERBOARD
//
// LANGUAGES:
// English, Spanish, French, German, Portuguese,
// Japanese, Korean, Chinese, Italian, Arabic
// ============================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getEquippedAvatar,
} from "../utils/avatarInventoryStorage";

import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import {
  LEGATHON_RANKS,
} from "../utils/legathonRankSystem";

import useLegathonPoints from
  "../hooks/useLegathonPoints";


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    goBack: "Go back",

    leaderboard: "Leaderboard",
    subtitle:
      "Build your rank through earned Legathon Points.",

    yourRecord: "YOUR RECORD",
    points: "POINTS",

    journeySteps: "Journey Steps",
    journeys: "Journeys",
    passportStamps: "Passport Stamps",
    walkingStreak: "Walking Streak",

    globalStandings: "GLOBAL STANDINGS",
    communityRanking: "Community ranking",

    globalDescription:
      "No shared member leaderboard is connected yet. Fake walkers and fixed positions have been removed.",

    yourGlobalRank: "Your global rank",
    pending: "Pending",

    rankPath: "RANK PATH",
    legathonLevels: "Legathon levels",

    pointMinimum: "{points} points",

    current: "CURRENT",
    reached: "REACHED",
    locked: "LOCKED",

    refreshing: "Refreshing…",
    refreshLeaderboard: "Refresh Leaderboard",

    defaultWalker: "Legathon Walker",

    newWalker: "New Walker",
    explorer: "Explorer",
    pathfinder: "Pathfinder",
    trailblazer: "Trailblazer",
    adventurer: "Adventurer",
    legend: "Legend",
  },


  es: {
    back: "‹ Atrás",
    goBack: "Volver",

    leaderboard: "Clasificación",
    subtitle:
      "Aumenta tu rango ganando Puntos Legathon.",

    yourRecord: "TU REGISTRO",
    points: "PUNTOS",

    journeySteps: "Pasos de Journey",
    journeys: "Journeys",
    passportStamps: "Sellos del pasaporte",
    walkingStreak: "Racha de caminata",

    globalStandings: "CLASIFICACIÓN GLOBAL",
    communityRanking: "Clasificación de la comunidad",

    globalDescription:
      "Todavía no hay una clasificación compartida de miembros conectada. Los caminantes ficticios y las posiciones fijas han sido eliminados.",

    yourGlobalRank: "Tu posición global",
    pending: "Pendiente",

    rankPath: "CAMINO DE RANGOS",
    legathonLevels: "Niveles Legathon",

    pointMinimum: "{points} puntos",

    current: "ACTUAL",
    reached: "ALCANZADO",
    locked: "BLOQUEADO",

    refreshing: "Actualizando…",
    refreshLeaderboard: "Actualizar clasificación",

    defaultWalker: "Caminante Legathon",

    newWalker: "Nuevo Caminante",
    explorer: "Explorador",
    pathfinder: "Pionero",
    trailblazer: "Innovador",
    adventurer: "Aventurero",
    legend: "Leyenda",
  },


  fr: {
    back: "‹ Retour",
    goBack: "Retour",

    leaderboard: "Classement",
    subtitle:
      "Progressez dans les rangs grâce aux Points Legathon gagnés.",

    yourRecord: "VOTRE DOSSIER",
    points: "POINTS",

    journeySteps: "Pas de Journey",
    journeys: "Journeys",
    passportStamps: "Tampons du passeport",
    walkingStreak: "Série de marche",

    globalStandings: "CLASSEMENT MONDIAL",
    communityRanking: "Classement de la communauté",

    globalDescription:
      "Aucun classement partagé des membres n'est encore connecté. Les faux marcheurs et les positions fixes ont été supprimés.",

    yourGlobalRank: "Votre rang mondial",
    pending: "En attente",

    rankPath: "PARCOURS DES RANGS",
    legathonLevels: "Niveaux Legathon",

    pointMinimum: "{points} points",

    current: "ACTUEL",
    reached: "ATTEINT",
    locked: "VERROUILLÉ",

    refreshing: "Actualisation…",
    refreshLeaderboard: "Actualiser le classement",

    defaultWalker: "Marcheur Legathon",

    newWalker: "Nouveau Marcheur",
    explorer: "Explorateur",
    pathfinder: "Éclaireur",
    trailblazer: "Pionnier",
    adventurer: "Aventurier",
    legend: "Légende",
  },


  de: {
    back: "‹ Zurück",
    goBack: "Zurück",

    leaderboard: "Bestenliste",
    subtitle:
      "Steige mit verdienten Legathon-Punkten im Rang auf.",

    yourRecord: "DEIN REKORD",
    points: "PUNKTE",

    journeySteps: "Journey-Schritte",
    journeys: "Journeys",
    passportStamps: "Passstempel",
    walkingStreak: "Gehserie",

    globalStandings: "GLOBALE RANGLISTE",
    communityRanking: "Community-Rangliste",

    globalDescription:
      "Eine gemeinsame Mitglieder-Rangliste ist noch nicht verbunden. Fiktive Walker und feste Positionen wurden entfernt.",

    yourGlobalRank: "Dein globaler Rang",
    pending: "Ausstehend",

    rankPath: "RANGPFAD",
    legathonLevels: "Legathon-Stufen",

    pointMinimum: "{points} Punkte",

    current: "AKTUELL",
    reached: "ERREICHT",
    locked: "GESPERRT",

    refreshing: "Aktualisierung…",
    refreshLeaderboard: "Bestenliste aktualisieren",

    defaultWalker: "Legathon-Walker",

    newWalker: "Neuer Walker",
    explorer: "Entdecker",
    pathfinder: "Pfadfinder",
    trailblazer: "Wegbereiter",
    adventurer: "Abenteurer",
    legend: "Legende",
  },


  pt: {
    back: "‹ Voltar",
    goBack: "Voltar",

    leaderboard: "Classificação",
    subtitle:
      "Aumente seu rank ganhando Pontos Legathon.",

    yourRecord: "SEU REGISTRO",
    points: "PONTOS",

    journeySteps: "Passos de Journey",
    journeys: "Journeys",
    passportStamps: "Selos do passaporte",
    walkingStreak: "Sequência de caminhada",

    globalStandings: "CLASSIFICAÇÃO GLOBAL",
    communityRanking: "Ranking da comunidade",

    globalDescription:
      "Ainda não há um ranking compartilhado de membros conectado. Caminhantes fictícios e posições fixas foram removidos.",

    yourGlobalRank: "Seu rank global",
    pending: "Pendente",

    rankPath: "CAMINHO DE RANKS",
    legathonLevels: "Níveis Legathon",

    pointMinimum: "{points} pontos",

    current: "ATUAL",
    reached: "ALCANÇADO",
    locked: "BLOQUEADO",

    refreshing: "Atualizando…",
    refreshLeaderboard: "Atualizar classificação",

    defaultWalker: "Caminhante Legathon",

    newWalker: "Novo Caminhante",
    explorer: "Explorador",
    pathfinder: "Desbravador",
    trailblazer: "Pioneiro",
    adventurer: "Aventureiro",
    legend: "Lenda",
  },


  ja: {
    back: "‹ 戻る",
    goBack: "戻る",

    leaderboard: "ランキング",
    subtitle:
      "獲得したLegathonポイントでランクを上げましょう。",

    yourRecord: "あなたの記録",
    points: "ポイント",

    journeySteps: "Journey歩数",
    journeys: "Journey",
    passportStamps: "パスポートスタンプ",
    walkingStreak: "連続ウォーキング",

    globalStandings: "世界ランキング",
    communityRanking: "コミュニティランキング",

    globalDescription:
      "共有メンバーランキングはまだ接続されていません。架空のウォーカーと固定順位は削除されています。",

    yourGlobalRank: "あなたの世界順位",
    pending: "保留中",

    rankPath: "ランクへの道",
    legathonLevels: "Legathonレベル",

    pointMinimum: "{points}ポイント",

    current: "現在",
    reached: "達成",
    locked: "ロック",

    refreshing: "更新中…",
    refreshLeaderboard: "ランキングを更新",

    defaultWalker: "Legathonウォーカー",

    newWalker: "ニューウォーカー",
    explorer: "エクスプローラー",
    pathfinder: "パスファインダー",
    trailblazer: "トレイルブレイザー",
    adventurer: "アドベンチャラー",
    legend: "レジェンド",
  },


  ko: {
    back: "‹ 뒤로",
    goBack: "뒤로 가기",

    leaderboard: "리더보드",
    subtitle:
      "획득한 Legathon 포인트로 랭크를 높이세요.",

    yourRecord: "내 기록",
    points: "포인트",

    journeySteps: "Journey 걸음",
    journeys: "Journey",
    passportStamps: "여권 스탬프",
    walkingStreak: "연속 걷기",

    globalStandings: "글로벌 순위",
    communityRanking: "커뮤니티 순위",

    globalDescription:
      "공유 회원 리더보드는 아직 연결되지 않았습니다. 가상 워커와 고정 순위는 제거되었습니다.",

    yourGlobalRank: "내 글로벌 순위",
    pending: "대기 중",

    rankPath: "랭크 경로",
    legathonLevels: "Legathon 레벨",

    pointMinimum: "{points} 포인트",

    current: "현재",
    reached: "달성",
    locked: "잠김",

    refreshing: "새로고침 중…",
    refreshLeaderboard: "리더보드 새로고침",

    defaultWalker: "Legathon 워커",

    newWalker: "새 워커",
    explorer: "탐험가",
    pathfinder: "패스파인더",
    trailblazer: "트레일블레이저",
    adventurer: "모험가",
    legend: "레전드",
  },


  zh: {
    back: "‹ 返回",
    goBack: "返回",

    leaderboard: "排行榜",
    subtitle:
      "通过获得 Legathon 积分提升你的等级。",

    yourRecord: "你的记录",
    points: "积分",

    journeySteps: "Journey 步数",
    journeys: "Journey",
    passportStamps: "护照印章",
    walkingStreak: "连续步行",

    globalStandings: "全球排名",
    communityRanking: "社区排名",

    globalDescription:
      "共享会员排行榜尚未连接。虚拟行者和固定排名已被移除。",

    yourGlobalRank: "你的全球排名",
    pending: "待定",

    rankPath: "等级路径",
    legathonLevels: "Legathon 等级",

    pointMinimum: "{points} 积分",

    current: "当前",
    reached: "已达到",
    locked: "未解锁",

    refreshing: "正在刷新…",
    refreshLeaderboard: "刷新排行榜",

    defaultWalker: "Legathon 行者",

    newWalker: "新行者",
    explorer: "探索者",
    pathfinder: "开拓者",
    trailblazer: "先驱者",
    adventurer: "冒险家",
    legend: "传奇",
  },


  it: {
    back: "‹ Indietro",
    goBack: "Torna indietro",

    leaderboard: "Classifica",
    subtitle:
      "Aumenta il tuo rango guadagnando Punti Legathon.",

    yourRecord: "IL TUO RECORD",
    points: "PUNTI",

    journeySteps: "Passi Journey",
    journeys: "Journey",
    passportStamps: "Timbri del passaporto",
    walkingStreak: "Serie di camminate",

    globalStandings: "CLASSIFICA GLOBALE",
    communityRanking: "Classifica della community",

    globalDescription:
      "Non è ancora collegata una classifica condivisa dei membri. I camminatori fittizi e le posizioni fisse sono stati rimossi.",

    yourGlobalRank: "Il tuo rango globale",
    pending: "In attesa",

    rankPath: "PERCORSO DEI RANGHI",
    legathonLevels: "Livelli Legathon",

    pointMinimum: "{points} punti",

    current: "ATTUALE",
    reached: "RAGGIUNTO",
    locked: "BLOCCATO",

    refreshing: "Aggiornamento…",
    refreshLeaderboard: "Aggiorna classifica",

    defaultWalker: "Camminatore Legathon",

    newWalker: "Nuovo Camminatore",
    explorer: "Esploratore",
    pathfinder: "Apripista",
    trailblazer: "Pioniere",
    adventurer: "Avventuriero",
    legend: "Leggenda",
  },


  ar: {
    back: "رجوع ›",
    goBack: "الرجوع",

    leaderboard: "لوحة المتصدرين",
    subtitle:
      "ارفع رتبتك من خلال نقاط Legathon التي تكسبها.",

    yourRecord: "سجلك",
    points: "النقاط",

    journeySteps: "خطوات Journey",
    journeys: "الرحلات",
    passportStamps: "أختام جواز السفر",
    walkingStreak: "سلسلة المشي",

    globalStandings: "الترتيب العالمي",
    communityRanking: "ترتيب المجتمع",

    globalDescription:
      "لم يتم ربط لوحة ترتيب مشتركة للأعضاء بعد. تمت إزالة المشاركين الوهميين والمراكز الثابتة.",

    yourGlobalRank: "ترتيبك العالمي",
    pending: "قيد الانتظار",

    rankPath: "مسار الرتب",
    legathonLevels: "مستويات Legathon",

    pointMinimum: "{points} نقطة",

    current: "الحالي",
    reached: "تم الوصول",
    locked: "مغلق",

    refreshing: "جارٍ التحديث…",
    refreshLeaderboard: "تحديث لوحة المتصدرين",

    defaultWalker: "مشارك Legathon",

    newWalker: "مشارك جديد",
    explorer: "مستكشف",
    pathfinder: "مكتشف المسار",
    trailblazer: "رائد",
    adventurer: "مغامر",
    legend: "أسطورة",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const normalized =
    String(language || "en")
      .trim()
      .toLowerCase()
      .split("-")[0];

  return TEXT[normalized]
    ? normalized
    : "en";
}


function fillTemplate(
  text,
  values = {}
) {
  let result =
    String(text || "");

  Object.entries(values)
    .forEach(
      ([key, value]) => {
        result =
          result.replaceAll(
            `{${key}}`,
            String(value)
          );
      }
    );

  return result;
}


// ============================================================
// NUMBER HELPERS
// ============================================================

function safeNumber(value) {
  const parsed =
    Number(value ?? 0);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}


function formatNumber(
  value,
  language = "en"
) {
  const number =
    Math.floor(
      safeNumber(value)
    );

  try {
    return number.toLocaleString(
      language
    );
  } catch {
    return number.toLocaleString();
  }
}


// ============================================================
// MEMBER RECORD
// ============================================================

async function loadMemberRecord() {
  const [
    avatar,
    displayName,
    avatarProfileRaw,
    steps,
    completed,
    stamps,
    streak,
  ] =
    await Promise.all([
      getEquippedAvatar(),

      AsyncStorage.getItem(
        "displayName"
      ),

      AsyncStorage.getItem(
        "avatarProfile"
      ),

      getJourneyLifetimeSteps(),

      AsyncStorage.getItem(
        "completedJourneys"
      ),

      AsyncStorage.getItem(
        "passportStamps"
      ),

      AsyncStorage.getItem(
        "walkingStreak"
      ),
    ]);


  let profile = {};

  try {
    profile =
      avatarProfileRaw
        ? JSON.parse(
            avatarProfileRaw
          )
        : {};
  } catch {
    profile = {};
  }


  return {
    avatar,

    name:
      displayName ||
      profile?.name ||
      avatar?.name ||
      "Legathon Walker",

    steps:
      safeNumber(steps),

    completed:
      safeNumber(completed),

    stamps:
      safeNumber(stamps),

    streak:
      safeNumber(streak),
  };
}


// ============================================================
// RANK TRANSLATION
//
// IMPORTANT:
// These translations are DISPLAY ONLY.
// LEGATHON_RANKS remains unchanged.
// ============================================================

function getRankTranslationKey(
  rankName
) {
  const normalized =
    String(rankName || "")
      .trim()
      .toLowerCase();


  const map = {
    "new walker":
      "newWalker",

    explorer:
      "explorer",

    pathfinder:
      "pathfinder",

    trailblazer:
      "trailblazer",

    adventurer:
      "adventurer",

    legend:
      "legend",
  };


  return map[normalized];
}


// ============================================================
// SCREEN
// ============================================================

export default function LeaderboardScreen({
  goBack,
  language = "en",
}) {

  const languageCode =
    normalizeLanguage(
      language
    );


  const t =
    useCallback(
      (
        key,
        values
      ) => {

        const translated =
          TEXT[
            languageCode
          ]?.[key] ??
          TEXT.en[key] ??
          key;


        return values
          ? fillTemplate(
              translated,
              values
            )
          : translated;
      },
      [
        languageCode,
      ]
    );


  // ==========================================================
  // POINTS + RANK
  // ==========================================================

  const {
    points,
    rank,
    loading,
    error,
    refresh,
  } =
    useLegathonPoints();


  // ==========================================================
  // MEMBER
  // ==========================================================

  const [
    member,
    setMember,
  ] =
    useState({
      avatar: null,
      name: "Legathon Walker",
      steps: 0,
      completed: 0,
      stamps: 0,
      streak: 0,
    });


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshAll =
    useCallback(
      async () => {

        setRefreshing(
          true
        );


        try {

          const [
            ,
            nextMember,
          ] =
            await Promise.all([
              refresh(),

              loadMemberRecord(),
            ]);


          setMember(
            nextMember
          );

        } catch (
          refreshError
        ) {

          console.log(
            "Leaderboard refresh error:",
            refreshError
          );

        } finally {

          setRefreshing(
            false
          );
        }

      },
      [
        refresh,
      ]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadMemberRecord()
        .then(
          setMember
        )
        .catch(
          loadError => {

            console.log(
              "Leaderboard member load error:",
              loadError
            );
          }
        );

    },
    []
  );


  // ==========================================================
  // RTL
  // ==========================================================

  const isRTL =
    languageCode ===
    "ar";


  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  // ==========================================================
  // MEMBER NAME
  //
  // Only translate the original default.
  // Never translate a custom member name.
  // ==========================================================

  const memberName =
    member.name ===
      "Legathon Walker"
      ? t(
          "defaultWalker"
        )
      : member.name;


  // ==========================================================
  // CURRENT RANK DISPLAY
  // ==========================================================

  const currentRankDisplay =
    useMemo(
      () => {

        const source =
          rank?.currentRank ||
          "New Walker";


        const key =
          getRankTranslationKey(
            source
          );


        return key
          ? t(key)
          : source;

      },
      [
        rank?.currentRank,
        t,
      ]
    );


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >

      <ScrollView
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
            onRefresh={
              refreshAll
            }
            tintColor=
              "#F5C542"
            colors={[
              "#F5C542",
            ]}
          />
        }
      >

        {/* =================================================
            BACK
        ================================================= */}

        {typeof goBack ===
          "function" && (

          <TouchableOpacity
            onPress={
              goBack
            }
            style={
              styles.back
            }
            accessibilityRole=
              "button"
            accessibilityLabel={
              t(
                "goBack"
              )
            }
          >

            <Text
              style={[
                styles.backText,
                rtlText,
              ]}
            >
              {t(
                "back"
              )}
            </Text>

          </TouchableOpacity>

        )}


        {/* =================================================
            HEADER
        ================================================= */}

        <Text
          style={[
            styles.kicker,
            rtlText,
          ]}
        >
          LEGATHON WALK
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
          {t(
            "leaderboard"
          )}
        </Text>


        <Text
          style={[
            styles.subtitle,
            rtlText,
          ]}
        >
          {t(
            "subtitle"
          )}
        </Text>


        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (

          <Text
            style={[
              styles.error,
              rtlText,
            ]}
            accessibilityRole=
              "alert"
          >
            {error}
          </Text>

        ) : null}


        {/* =================================================
            MEMBER RECORD
        ================================================= */}

        <View
          style={[
            styles.profileCard,

            isRTL &&
              styles.profileCardRTL,
          ]}
        >

          <View
            style={
              styles.avatarFrame
            }
          >

            {member.avatar
              ?.image ? (

              <Image
                source={
                  member.avatar
                    .image
                }
                style={
                  styles.avatar
                }
                resizeMode=
                  "contain"
              />

            ) : (

              <Text
                style={
                  styles.fallback
                }
              >
                👤
              </Text>

            )}

          </View>


          <View
            style={
              styles.profileText
            }
          >

            <Text
              style={[
                styles.you,
                rtlText,
              ]}
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
            >
              {t(
                "yourRecord"
              )}
            </Text>


            <Text
              style={[
                styles.name,
                rtlText,
              ]}
              numberOfLines={
                1
              }
              ellipsizeMode=
                "tail"
            >
              {memberName}
            </Text>


            <Text
              style={[
                styles.rank,
                rtlText,
              ]}
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
            >
              {rank?.badge ||
                "🥾"}{" "}
              {currentRankDisplay}
            </Text>

          </View>


          <View
            style={[
              styles.pointsPill,

              isRTL &&
                styles.pointsPillRTL,
            ]}
          >

            <Text
              style={[
                styles.points,

                isRTL &&
                  styles.pointsRTL,
              ]}
              adjustsFontSizeToFit
              numberOfLines={
                1
              }
            >
              {loading
                ? "—"
                : formatNumber(
                    points,
                    languageCode
                  )}
            </Text>


            <Text
              style={[
                styles.pointsLabel,
                rtlText,
              ]}
            >
              {t(
                "points"
              )}
            </Text>

          </View>

        </View>


        {/* =================================================
            STATS ROW 1
        ================================================= */}

        <View
          style={
            styles.statsRow
          }
        >

          <MiniStat
            value={
              formatNumber(
                member.steps,
                languageCode
              )
            }
            label={
              t(
                "journeySteps"
              )
            }
            isRTL={
              isRTL
            }
          />


          <MiniStat
            value={
              formatNumber(
                member.completed,
                languageCode
              )
            }
            label={
              t(
                "journeys"
              )
            }
            isRTL={
              isRTL
            }
          />

        </View>


        {/* =================================================
            STATS ROW 2
        ================================================= */}

        <View
          style={
            styles.statsRow
          }
        >

          <MiniStat
            value={
              formatNumber(
                member.stamps,
                languageCode
              )
            }
            label={
              t(
                "passportStamps"
              )
            }
            isRTL={
              isRTL
            }
          />


          <MiniStat
            value={
              formatNumber(
                member.streak,
                languageCode
              )
            }
            label={
              t(
                "walkingStreak"
              )
            }
            isRTL={
              isRTL
            }
          />

        </View>


        {/* =================================================
            GLOBAL STANDINGS
        ================================================= */}

        <View
          style={
            styles.card
          }
        >

          <Text
            style={[
              styles.kicker,
              rtlText,
            ]}
          >
            {t(
              "globalStandings"
            )}
          </Text>


          <Text
            style={[
              styles.sectionTitle,
              rtlText,
            ]}
          >
            {t(
              "communityRanking"
            )}
          </Text>


          <Text
            style={[
              styles.subtitle,
              rtlText,
            ]}
          >
            {t(
              "globalDescription"
            )}
          </Text>


          <View
            style={[
              styles.pendingRow,

              isRTL &&
                styles.pendingRowRTL,
            ]}
          >

            <Text
              style={[
                styles.pendingLabel,
                rtlText,
              ]}
            >
              {t(
                "yourGlobalRank"
              )}
            </Text>


            <Text
              style={[
                styles.pending,
                rtlText,
              ]}
            >
              {t(
                "pending"
              )}
            </Text>

          </View>

        </View>


        {/* =================================================
            RANK PATH
        ================================================= */}

        <View
          style={
            styles.card
          }
        >

          <Text
            style={[
              styles.kicker,
              rtlText,
            ]}
          >
            {t(
              "rankPath"
            )}
          </Text>


          <Text
            style={[
              styles.sectionTitle,
              rtlText,
            ]}
          >
            {t(
              "legathonLevels"
            )}
          </Text>


          {LEGATHON_RANKS.map(
            level => {

              const isCurrent =
                level.title ===
                rank?.currentRank;


              const reached =
                safeNumber(
                  points
                ) >=
                safeNumber(
                  level.minPoints
                );


              const rankKey =
                getRankTranslationKey(
                  level.title
                );


              const levelTitle =
                rankKey
                  ? t(
                      rankKey
                    )
                  : level.title;


              let statusText =
                t(
                  "locked"
                );


              if (
                isCurrent
              ) {

                statusText =
                  t(
                    "current"
                  );

              } else if (
                reached
              ) {

                statusText =
                  t(
                    "reached"
                  );
              }


              return (

                <View
                  key={
                    level.id
                  }
                  style={[
                    styles.levelRow,

                    isRTL &&
                      styles.levelRowRTL,

                    isCurrent &&
                      styles.currentLevel,
                  ]}
                >

                  <Text
                    style={
                      styles.levelBadge
                    }
                  >
                    {level.badge}
                  </Text>


                  <View
                    style={
                      styles.levelInfo
                    }
                  >

                    <Text
                      style={[
                        styles.levelName,

                        rtlText,

                        isCurrent && {
                          color:
                            level.color,
                        },
                      ]}
                      numberOfLines={
                        1
                      }
                      adjustsFontSizeToFit
                    >
                      {levelTitle}
                    </Text>


                    <Text
                      style={[
                        styles.levelMinimum,
                        rtlText,
                      ]}
                    >
                      {t(
                        "pointMinimum",
                        {
                          points:
                            formatNumber(
                              level
                                .minPoints,
                              languageCode
                            ),
                        }
                      )}
                    </Text>

                  </View>


                  <Text
                    style={[
                      styles.levelStatus,

                      isRTL &&
                        styles.levelStatusRTL,

                      reached &&
                        styles.reached,
                    ]}
                    numberOfLines={
                      1
                    }
                    adjustsFontSizeToFit
                  >
                    {statusText}
                  </Text>

                </View>
              );
            }
          )}

        </View>


        {/* =================================================
            REFRESH
        ================================================= */}

        <TouchableOpacity
          style={[
            styles.refreshButton,

            refreshing &&
              styles.refreshButtonDisabled,
          ]}
          onPress={
            refreshAll
          }
          disabled={
            refreshing
          }
          accessibilityRole=
            "button"
          accessibilityState={{
            disabled:
              refreshing,
          }}
        >

          <Text
            style={[
              styles.refreshText,
              rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              1
            }
          >
            {refreshing
              ? t(
                  "refreshing"
                )
              : t(
                  "refreshLeaderboard"
                )}
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}


// ============================================================
// MINI STAT
// ============================================================

function MiniStat({
  value,
  label,
  isRTL = false,
}) {

  return (
    <View
      style={
        styles.miniStat
      }
    >

      <Text
        style={[
          styles.miniValue,

          isRTL &&
            styles.rtlText,
        ]}
        adjustsFontSizeToFit
        numberOfLines={
          1
        }
      >
        {value}
      </Text>


      <Text
        style={[
          styles.miniLabel,

          isRTL &&
            styles.rtlText,
        ]}
        adjustsFontSizeToFit
        numberOfLines={
          2
        }
      >
        {label}
      </Text>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor:
        "#030812",
    },


    content: {
      padding: 22,
      paddingBottom: 145,
      maxWidth: 700,
      width: "100%",
      alignSelf:
        "center",
    },


    back: {
      alignSelf:
        "flex-start",

      borderWidth: 1,

      borderColor:
        "#8B7029",

      borderRadius:
        24,

      paddingVertical:
        12,

      paddingHorizontal:
        19,

      marginBottom:
        28,
    },


    backText: {
      color:
        "#F5C542",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    kicker: {
      color:
        "#F5C542",

      fontSize:
        11,

      letterSpacing:
        2.2,

      fontWeight:
        "900",

      marginBottom:
        8,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        40,

      fontWeight:
        "900",

      marginBottom:
        8,
    },


    subtitle: {
      color:
        "#A8B5C9",

      fontSize:
        15,

      lineHeight:
        23,
    },


    error: {
      color:
        "#FFD0D0",

      backgroundColor:
        "#351C28",

      padding:
        13,

      borderRadius:
        12,

      marginTop:
        18,
    },


    profileCard: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#15191C",

      borderWidth:
        1.5,

      borderColor:
        "#947725",

      borderRadius:
        27,

      padding:
        17,

      marginTop:
        24,

      marginBottom:
        14,
    },


    profileCardRTL: {
      flexDirection:
        "row-reverse",
    },


    avatarFrame: {
      width:
        68,

      height:
        68,

      borderRadius:
        21,

      backgroundColor:
        "#091526",

      alignItems:
        "center",

      justifyContent:
        "center",

      overflow:
        "hidden",
    },


    avatar: {
      width:
        66,

      height:
        66,
    },


    fallback: {
      fontSize:
        33,
    },


    profileText: {
      flex:
        1,

      paddingHorizontal:
        13,
    },


    you: {
      color:
        "#F5C542",

      fontSize:
        9,

      letterSpacing:
        1.5,

      fontWeight:
        "900",
    },


    name: {
      color:
        "#FFFFFF",

      fontSize:
        19,

      fontWeight:
        "900",

      marginTop:
        4,
    },


    rank: {
      color:
        "#81F1D0",

      fontSize:
        12,

      fontWeight:
        "800",

      marginTop:
        5,
    },


    pointsPill: {
      minWidth:
        76,

      maxWidth:
        105,

      alignItems:
        "flex-end",
    },


    pointsPillRTL: {
      alignItems:
        "flex-start",
    },


    points: {
      color:
        "#FFFFFF",

      fontSize:
        21,

      fontWeight:
        "900",

      width:
        "100%",

      textAlign:
        "right",
    },


    pointsRTL: {
      textAlign:
        "left",
    },


    pointsLabel: {
      color:
        "#91A1B8",

      fontSize:
        8,

      letterSpacing:
        1.2,

      fontWeight:
        "900",
    },


    statsRow: {
      flexDirection:
        "row",

      marginHorizontal:
        -6,
    },


    miniStat: {
      flex:
        1,

      backgroundColor:
        "#0B1727",

      borderWidth:
        1,

      borderColor:
        "#263D59",

      borderRadius:
        20,

      padding:
        17,

      margin:
        6,

      minHeight:
        92,
    },


    miniValue: {
      color:
        "#FFFFFF",

      fontSize:
        22,

      fontWeight:
        "900",

      marginBottom:
        6,
    },


    miniLabel: {
      color:
        "#91A1B8",

      fontSize:
        10,

      textTransform:
        "uppercase",

      letterSpacing:
        1,

      fontWeight:
        "800",
    },


    card: {
      backgroundColor:
        "#0B1727",

      borderWidth:
        1,

      borderColor:
        "#263D59",

      borderRadius:
        25,

      padding:
        21,

      marginTop:
        10,

      marginBottom:
        8,
    },


    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "900",

      marginBottom:
        9,
    },


    pendingRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      borderTopWidth:
        1,

      borderTopColor:
        "#263D59",

      paddingTop:
        16,

      marginTop:
        18,

      gap:
        12,
    },


    pendingRowRTL: {
      flexDirection:
        "row-reverse",
    },


    pendingLabel: {
      color:
        "#C5D0E0",

      fontSize:
        14,

      fontWeight:
        "700",

      flexShrink:
        1,
    },


    pending: {
      color:
        "#F5C542",

      fontSize:
        14,

      fontWeight:
        "900",
    },


    levelRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#07111F",

      borderRadius:
        16,

      padding:
        13,

      marginTop:
        9,

      borderWidth:
        1,

      borderColor:
        "transparent",
    },


    levelRowRTL: {
      flexDirection:
        "row-reverse",
    },


    currentLevel: {
      borderColor:
        "#F5C542",

      backgroundColor:
        "#171A1B",
    },


    levelBadge: {
      width:
        37,

      fontSize:
        23,

      textAlign:
        "center",
    },


    levelInfo: {
      flex:
        1,

      paddingHorizontal:
        8,
    },


    levelName: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    levelMinimum: {
      color:
        "#8392A9",

      fontSize:
        11,

      marginTop:
        3,
    },


    levelStatus: {
      color:
        "#65748A",

      fontSize:
        9,

      letterSpacing:
        1,

      fontWeight:
        "900",

      maxWidth:
        72,

      textAlign:
        "right",
    },


    levelStatusRTL: {
      textAlign:
        "left",
    },


    reached: {
      color:
        "#81F1D0",
    },


    refreshButton: {
      backgroundColor:
        "#F5C542",

      borderRadius:
        18,

      alignItems:
        "center",

      paddingVertical:
        17,

      paddingHorizontal:
        18,

      marginTop:
        10,
    },


    refreshButtonDisabled: {
      opacity:
        0.65,
    },


    refreshText: {
      color:
        "#06101D",

      fontSize:
        16,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    rtlText: {
      writingDirection:
        "rtl",

      textAlign:
        "right",
    },
  });