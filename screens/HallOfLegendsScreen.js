// screens/HallOfLegendsScreen.js
//
// LEGATHON WALK
// HALL OF LEGENDS
//
// MULTILINGUAL:
// • English
// • Spanish
// • French
// • German
// • Portuguese
// • Japanese
// • Korean
// • Chinese
// • Italian
// • Arabic
//
// PRESERVES:
// • Legathon Points
// • Rank system
// • Journey lifetime steps
// • Miles
// • Completed journeys
// • Pull-to-refresh
// • Local member name
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
  RefreshControl,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import useLegathonPoints from
  "../hooks/useLegathonPoints";


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    goBack: "Go back",

    liveRecord: "LIVE RECORD",
    hallOfLegends: "HALL OF LEGENDS",

    title: "Your legacy is being built.",

    subtitle:
      "Every verified reward adds to your Legathon Points record.",

    currentRank: "CURRENT RANK",
    legathonPoints: "LEGATHON POINTS",

    complete: "{progress}% complete",
    highestRank: "Highest rank",
    next: "Next: {rank}",
    pointsRemaining: "{points} points remaining",

    journeySteps: "Journey Steps",
    miles: "Miles",
    completedJourneys: "Completed Journeys",

    globalHall: "GLOBAL HALL",
    communityRankings: "Community rankings",

    globalDescription:
      "No shared member leaderboard is connected yet. Global names and positions will appear here after member records are synced through your database.",

    globalPosition: "Your global position",
    pending: "Pending",

    refreshing: "Refreshing…",
    refreshRecord: "Refresh My Record",

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

    liveRecord: "REGISTRO EN VIVO",
    hallOfLegends: "SALÓN DE LEYENDAS",

    title: "Tu legado se está construyendo.",

    subtitle:
      "Cada recompensa verificada se suma a tu registro de Puntos Legathon.",

    currentRank: "RANGO ACTUAL",
    legathonPoints: "PUNTOS LEGATHON",

    complete: "{progress}% completado",
    highestRank: "Rango más alto",
    next: "Siguiente: {rank}",
    pointsRemaining: "Faltan {points} puntos",

    journeySteps: "Pasos de Journey",
    miles: "Millas",
    completedJourneys: "Journeys completados",

    globalHall: "SALÓN GLOBAL",
    communityRankings: "Clasificación de la comunidad",

    globalDescription:
      "Todavía no hay una clasificación compartida de miembros conectada. Los nombres y posiciones globales aparecerán aquí cuando los registros de miembros se sincronicen con tu base de datos.",

    globalPosition: "Tu posición global",
    pending: "Pendiente",

    refreshing: "Actualizando…",
    refreshRecord: "Actualizar mi registro",

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

    liveRecord: "DOSSIER EN DIRECT",
    hallOfLegends: "HALL DES LÉGENDES",

    title: "Votre héritage se construit.",

    subtitle:
      "Chaque récompense vérifiée s'ajoute à votre total de Points Legathon.",

    currentRank: "RANG ACTUEL",
    legathonPoints: "POINTS LEGATHON",

    complete: "{progress}% terminé",
    highestRank: "Rang le plus élevé",
    next: "Suivant : {rank}",
    pointsRemaining: "{points} points restants",

    journeySteps: "Pas de Journey",
    miles: "Miles",
    completedJourneys: "Journeys terminés",

    globalHall: "HALL MONDIAL",
    communityRankings: "Classement de la communauté",

    globalDescription:
      "Aucun classement partagé des membres n'est encore connecté. Les noms et positions mondiales apparaîtront ici lorsque les données des membres seront synchronisées avec votre base de données.",

    globalPosition: "Votre position mondiale",
    pending: "En attente",

    refreshing: "Actualisation…",
    refreshRecord: "Actualiser mon dossier",

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

    liveRecord: "LIVE-REKORD",
    hallOfLegends: "HALLE DER LEGENDEN",

    title: "Dein Vermächtnis wächst.",

    subtitle:
      "Jede bestätigte Belohnung wird deinem Legathon-Punktekonto hinzugefügt.",

    currentRank: "AKTUELLER RANG",
    legathonPoints: "LEGATHON-PUNKTE",

    complete: "{progress}% abgeschlossen",
    highestRank: "Höchster Rang",
    next: "Nächster: {rank}",
    pointsRemaining: "Noch {points} Punkte",

    journeySteps: "Journey-Schritte",
    miles: "Meilen",
    completedJourneys: "Abgeschlossene Journeys",

    globalHall: "GLOBALE HALLE",
    communityRankings: "Community-Rangliste",

    globalDescription:
      "Eine gemeinsame Mitglieder-Rangliste ist noch nicht verbunden. Globale Namen und Positionen erscheinen hier, sobald die Mitgliederdaten mit deiner Datenbank synchronisiert wurden.",

    globalPosition: "Deine globale Position",
    pending: "Ausstehend",

    refreshing: "Aktualisierung…",
    refreshRecord: "Meinen Rekord aktualisieren",

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

    liveRecord: "REGISTRO AO VIVO",
    hallOfLegends: "SALÃO DAS LENDAS",

    title: "Seu legado está sendo construído.",

    subtitle:
      "Cada recompensa verificada aumenta seu registro de Pontos Legathon.",

    currentRank: "RANK ATUAL",
    legathonPoints: "PONTOS LEGATHON",

    complete: "{progress}% concluído",
    highestRank: "Rank mais alto",
    next: "Próximo: {rank}",
    pointsRemaining: "Faltam {points} pontos",

    journeySteps: "Passos de Journey",
    miles: "Milhas",
    completedJourneys: "Journeys concluídos",

    globalHall: "SALÃO GLOBAL",
    communityRankings: "Ranking da comunidade",

    globalDescription:
      "Ainda não há um ranking compartilhado de membros conectado. Os nomes e posições globais aparecerão aqui depois que os registros dos membros forem sincronizados com seu banco de dados.",

    globalPosition: "Sua posição global",
    pending: "Pendente",

    refreshing: "Atualizando…",
    refreshRecord: "Atualizar meu registro",

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

    liveRecord: "ライブ記録",
    hallOfLegends: "レジェンドホール",

    title: "あなたのレガシーが築かれています。",

    subtitle:
      "確認されたすべての報酬がLegathonポイント記録に加算されます。",

    currentRank: "現在のランク",
    legathonPoints: "LEGATHONポイント",

    complete: "{progress}% 完了",
    highestRank: "最高ランク",
    next: "次：{rank}",
    pointsRemaining: "あと{points}ポイント",

    journeySteps: "Journey歩数",
    miles: "マイル",
    completedJourneys: "完了したJourney",

    globalHall: "グローバルホール",
    communityRankings: "コミュニティランキング",

    globalDescription:
      "共有メンバーランキングはまだ接続されていません。メンバー記録がデータベースと同期されると、世界ランキングの名前と順位がここに表示されます。",

    globalPosition: "あなたの世界順位",
    pending: "保留中",

    refreshing: "更新中…",
    refreshRecord: "記録を更新",

    defaultWalker: "Legathonウォーカー",

    newWalker: "ニュ－ウォーカー",
    explorer: "エクスプローラー",
    pathfinder: "パスファインダー",
    trailblazer: "トレイルブレイザー",
    adventurer: "アドベンチャラー",
    legend: "レジェンド",
  },


  ko: {
    back: "‹ 뒤로",
    goBack: "뒤로 가기",

    liveRecord: "실시간 기록",
    hallOfLegends: "레전드 홀",

    title: "당신의 레거시가 만들어지고 있습니다.",

    subtitle:
      "확인된 모든 보상이 Legathon 포인트 기록에 추가됩니다.",

    currentRank: "현재 랭크",
    legathonPoints: "LEGATHON 포인트",

    complete: "{progress}% 완료",
    highestRank: "최고 랭크",
    next: "다음: {rank}",
    pointsRemaining: "{points} 포인트 남음",

    journeySteps: "Journey 걸음",
    miles: "마일",
    completedJourneys: "완료한 Journey",

    globalHall: "글로벌 홀",
    communityRankings: "커뮤니티 순위",

    globalDescription:
      "공유 회원 리더보드는 아직 연결되지 않았습니다. 회원 기록이 데이터베이스와 동기화되면 글로벌 이름과 순위가 여기에 표시됩니다.",

    globalPosition: "내 글로벌 순위",
    pending: "대기 중",

    refreshing: "새로고침 중…",
    refreshRecord: "내 기록 새로고침",

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

    liveRecord: "实时记录",
    hallOfLegends: "传奇殿堂",

    title: "你的传奇正在建立。",

    subtitle:
      "每一项经过验证的奖励都会加入你的 Legathon 积分记录。",

    currentRank: "当前等级",
    legathonPoints: "LEGATHON 积分",

    complete: "已完成 {progress}%",
    highestRank: "最高等级",
    next: "下一级：{rank}",
    pointsRemaining: "还需 {points} 积分",

    journeySteps: "Journey 步数",
    miles: "英里",
    completedJourneys: "已完成 Journey",

    globalHall: "全球殿堂",
    communityRankings: "社区排名",

    globalDescription:
      "共享会员排行榜尚未连接。会员记录与数据库同步后，全球成员姓名和排名将在这里显示。",

    globalPosition: "你的全球排名",
    pending: "待定",

    refreshing: "正在刷新…",
    refreshRecord: "刷新我的记录",

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

    liveRecord: "RECORD LIVE",
    hallOfLegends: "SALA DELLE LEGGENDE",

    title: "La tua eredità si sta costruendo.",

    subtitle:
      "Ogni premio verificato viene aggiunto al tuo record di Punti Legathon.",

    currentRank: "RANGO ATTUALE",
    legathonPoints: "PUNTI LEGATHON",

    complete: "{progress}% completato",
    highestRank: "Rango più alto",
    next: "Prossimo: {rank}",
    pointsRemaining: "{points} punti rimanenti",

    journeySteps: "Passi Journey",
    miles: "Miglia",
    completedJourneys: "Journey completati",

    globalHall: "SALA GLOBALE",
    communityRankings: "Classifica della community",

    globalDescription:
      "Non è ancora collegata una classifica condivisa dei membri. I nomi e le posizioni globali appariranno qui dopo la sincronizzazione dei record dei membri con il database.",

    globalPosition: "La tua posizione globale",
    pending: "In attesa",

    refreshing: "Aggiornamento…",
    refreshRecord: "Aggiorna il mio record",

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

    liveRecord: "السجل المباشر",
    hallOfLegends: "قاعة الأساطير",

    title: "إرثك يتشكل مع كل خطوة.",

    subtitle:
      "تُضاف كل مكافأة موثقة إلى سجل نقاط Legathon الخاص بك.",

    currentRank: "الرتبة الحالية",
    legathonPoints: "نقاط LEGATHON",

    complete: "مكتمل بنسبة {progress}%",
    highestRank: "أعلى رتبة",
    next: "التالي: {rank}",
    pointsRemaining: "متبقي {points} نقطة",

    journeySteps: "خطوات Journey",
    miles: "الأميال",
    completedJourneys: "رحلات Journey المكتملة",

    globalHall: "القاعة العالمية",
    communityRankings: "تصنيف المجتمع",

    globalDescription:
      "لم يتم ربط لوحة ترتيب مشتركة للأعضاء بعد. ستظهر الأسماء والمراكز العالمية هنا بعد مزامنة سجلات الأعضاء مع قاعدة البيانات.",

    globalPosition: "ترتيبك العالمي",
    pending: "قيد الانتظار",

    refreshing: "جارٍ التحديث…",
    refreshRecord: "تحديث سجلي",

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
  const normalized = String(
    language || "en"
  )
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
  let result = String(
    text || ""
  );

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

  return Number.isFinite(
    parsed
  )
    ? Math.max(
        0,
        parsed
      )
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
    return number
      .toLocaleString(
        language
      );
  } catch {
    return number
      .toLocaleString();
  }
}


// ============================================================
// LOCAL RECORD
// ============================================================

async function loadLocalRecord() {
  const [
    displayName,
    avatarProfileRaw,
    completedRaw,
    lifetimeSteps,
  ] =
    await Promise.all([
      AsyncStorage.getItem(
        "displayName"
      ),

      AsyncStorage.getItem(
        "avatarProfile"
      ),

      AsyncStorage.getItem(
        "completedJourneys"
      ),

      getJourneyLifetimeSteps(),
    ]);


  let avatarProfile = {};

  try {
    avatarProfile =
      avatarProfileRaw
        ? JSON.parse(
            avatarProfileRaw
          )
        : {};
  } catch {
    avatarProfile = {};
  }


  return {
    name:
      displayName ||
      avatarProfile?.name ||
      "Legathon Walker",

    steps:
      safeNumber(
        lifetimeSteps
      ),

    journeys:
      safeNumber(
        completedRaw
      ),
  };
}


// ============================================================
// RANK DISPLAY TRANSLATION
//
// IMPORTANT:
// The rank system itself remains unchanged.
// We translate only what is displayed.
// ============================================================

function getRankTranslationKey(
  rankName
) {
  const normalized =
    String(
      rankName || ""
    )
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


  return map[
    normalized
  ];
}


// ============================================================
// SCREEN
// ============================================================

export default function HallOfLegendsScreen({
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
  // LEGATHON POINTS
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
  // LOCAL RECORD
  // ==========================================================

  const [
    record,
    setRecord,
  ] =
    useState({
      name:
        "Legathon Walker",

      steps:
        0,

      journeys:
        0,
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
            nextRecord,
          ] =
            await Promise.all([
              refresh(),

              loadLocalRecord(),
            ]);


          setRecord(
            nextRecord
          );

        } catch (
          refreshError
        ) {

          console.log(
            "Hall of Legends refresh error:",
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

      loadLocalRecord()
        .then(
          setRecord
        )
        .catch(
          loadError => {

            console.log(
              "Hall of Legends load error:",
              loadError
            );
          }
        );

    },
    []
  );


  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progress =
    Math.max(
      0,
      Math.min(
        100,
        safeNumber(
          rank?.progress
        )
      )
    );


  // ==========================================================
  // DISPLAY RANK
  // ==========================================================

  const currentRankDisplay =
    useMemo(
      () => {

        const sourceRank =
          rank?.currentRank ||
          "New Walker";


        const key =
          getRankTranslationKey(
            sourceRank
          );


        return key
          ? t(key)
          : sourceRank;

      },
      [
        rank?.currentRank,
        t,
      ]
    );


  const nextRankDisplay =
    useMemo(
      () => {

        const sourceRank =
          rank?.nextRank;


        if (
          !sourceRank ||
          sourceRank ===
            "MAX"
        ) {
          return "";
        }


        const key =
          getRankTranslationKey(
            sourceRank
          );


        return key
          ? t(key)
          : sourceRank;

      },
      [
        rank?.nextRank,
        t,
      ]
    );


  // ==========================================================
  // MEMBER NAME
  //
  // Translate only the original default name.
  // Never translate a user's custom name.
  // ==========================================================

  const memberName =
    record.name ===
      "Legathon Walker"
      ? t(
          "defaultWalker"
        )
      : record.name;


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
            TOP BAR
        ================================================= */}

        <View
          style={
            styles.topRow
          }
        >

          {typeof goBack ===
          "function" ? (

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

          ) : (

            <View />

          )}


          <View
            style={
              styles.livePill
            }
          >

            <Text
              style={[
                styles.liveText,
                rtlText,
              ]}
              numberOfLines={
                1
              }
              adjustsFontSizeToFit
            >
              {t(
                "liveRecord"
              )}
            </Text>

          </View>

        </View>


        {/* =================================================
            HEADER
        ================================================= */}

        <Text
          style={[
            styles.kicker,
            rtlText,
          ]}
        >
          {t(
            "hallOfLegends"
          )}
        </Text>


        <Text
          style={[
            styles.title,
            rtlText,
          ]}
        >
          {t(
            "title"
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
            CURRENT RANK
        ================================================= */}

        <View
          style={
            styles.heroCard
          }
        >

          <Text
            style={
              styles.heroBadge
            }
          >
            {rank?.badge ||
              "🥾"}
          </Text>


          <Text
            style={[
              styles.heroLabel,
              rtlText,
            ]}
          >
            {t(
              "currentRank"
            )}
          </Text>


          <Text
            style={[
              styles.heroName,
              rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              2
            }
          >
            {currentRankDisplay}
          </Text>


          <Text
            style={[
              styles.memberName,
              rtlText,
            ]}
            numberOfLines={
              1
            }
            adjustsFontSizeToFit
          >
            {memberName}
          </Text>


          <Text
            style={
              styles.points
            }
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
              "legathonPoints"
            )}
          </Text>


          {/* ===============================================
              PROGRESS
          =============================================== */}

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
                    `${progress}%`,
                },
              ]}
            />

          </View>


          <View
            style={
              styles.progressRow
            }
          >

            <Text
              style={[
                styles.progressText,
                rtlText,
              ]}
            >
              {t(
                "complete",
                {
                  progress,
                }
              )}
            </Text>


            <Text
              style={[
                styles.progressText,
                rtlText,
              ]}
            >
              {rank?.nextRank ===
              "MAX"
                ? t(
                    "highestRank"
                  )
                : t(
                    "next",
                    {
                      rank:
                        nextRankDisplay ||
                        t(
                          "explorer"
                        ),
                    }
                  )}
            </Text>

          </View>


          {rank?.nextRank !==
            "MAX" && (

            <Text
              style={[
                styles.remaining,
                rtlText,
              ]}
            >
              {t(
                "pointsRemaining",
                {
                  points:
                    formatNumber(
                      rank
                        ?.pointsRemaining,
                      languageCode
                    ),
                }
              )}
            </Text>

          )}

        </View>


        {/* =================================================
            STATS
        ================================================= */}

        <View
          style={
            styles.statsRow
          }
        >

          <StatCard
            label={
              t(
                "journeySteps"
              )
            }
            value={
              formatNumber(
                record.steps,
                languageCode
              )
            }
            isRTL={
              isRTL
            }
          />


          <StatCard
            label={
              t(
                "miles"
              )
            }
            value={(
              record.steps /
              2000
            ).toLocaleString(
              languageCode,
              {
                minimumFractionDigits:
                  1,

                maximumFractionDigits:
                  1,
              }
            )}
            isRTL={
              isRTL
            }
          />

        </View>


        {/* =================================================
            COMPLETED JOURNEYS
        ================================================= */}

        <View
          style={
            styles.wideCard
          }
        >

          <Text
            style={[
              styles.statLabel,
              rtlText,
            ]}
          >
            {t(
              "completedJourneys"
            )}
          </Text>


          <Text
            style={[
              styles.wideValue,
              rtlText,
            ]}
          >
            {formatNumber(
              record.journeys,
              languageCode
            )}
          </Text>

        </View>


        {/* =================================================
            GLOBAL HALL
        ================================================= */}

        <View
          style={
            styles.communityCard
          }
        >

          <Text
            style={[
              styles.kicker,
              rtlText,
            ]}
          >
            {t(
              "globalHall"
            )}
          </Text>


          <Text
            style={[
              styles.sectionTitle,
              rtlText,
            ]}
          >
            {t(
              "communityRankings"
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
              styles.statusRow,

              isRTL &&
                styles.statusRowRTL,
            ]}
          >

            <Text
              style={[
                styles.statusLabel,
                rtlText,
              ]}
            >
              {t(
                "globalPosition"
              )}
            </Text>


            <Text
              style={[
                styles.statusValue,
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
            numberOfLines={
              1
            }
            adjustsFontSizeToFit
          >
            {refreshing
              ? t(
                  "refreshing"
                )
              : t(
                  "refreshRecord"
                )}
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  isRTL = false,
}) {

  return (
    <View
      style={
        styles.statCard
      }
    >

      <Text
        style={[
          styles.statValue,

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
          styles.statLabel,

          isRTL &&
            styles.rtlText,
        ]}
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
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


    topRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom:
        28,
    },


    back: {
      borderWidth: 1,

      borderColor:
        "#8B7029",

      borderRadius:
        24,

      paddingVertical:
        12,

      paddingHorizontal:
        19,
    },


    backText: {
      color:
        "#F5C542",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    livePill: {
      backgroundColor:
        "#102D28",

      borderRadius:
        20,

      paddingHorizontal:
        13,

      paddingVertical:
        8,

      maxWidth:
        "48%",
    },


    liveText: {
      color:
        "#81F1D0",

      fontSize:
        10,

      letterSpacing:
        1.3,

      fontWeight:
        "900",
    },


    kicker: {
      color:
        "#F5C542",

      fontSize:
        12,

      letterSpacing:
        2.3,

      fontWeight:
        "900",

      marginBottom:
        9,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        38,

      lineHeight:
        43,

      fontWeight:
        "900",

      marginBottom:
        12,
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


    heroCard: {
      backgroundColor:
        "#15191C",

      borderWidth:
        1.5,

      borderColor:
        "#947725",

      borderRadius:
        30,

      alignItems:
        "center",

      padding:
        25,

      marginTop:
        25,

      marginBottom:
        16,
    },


    heroBadge: {
      fontSize:
        44,

      marginBottom:
        7,
    },


    heroLabel: {
      color:
        "#F5C542",

      fontSize:
        11,

      letterSpacing:
        2.2,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    heroName: {
      color:
        "#FFFFFF",

      fontSize:
        31,

      fontWeight:
        "900",

      marginTop:
        7,

      textAlign:
        "center",

      width:
        "100%",
    },


    memberName: {
      color:
        "#81F1D0",

      fontSize:
        15,

      fontWeight:
        "800",

      marginTop:
        4,

      maxWidth:
        "90%",

      textAlign:
        "center",
    },


    points: {
      color:
        "#FFFFFF",

      fontSize:
        58,

      fontWeight:
        "900",

      marginTop:
        22,

      width:
        "100%",

      textAlign:
        "center",
    },


    pointsLabel: {
      color:
        "#F5C542",

      fontSize:
        11,

      letterSpacing:
        2,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    progressTrack: {
      width:
        "100%",

      height:
        10,

      backgroundColor:
        "#29364A",

      borderRadius:
        5,

      overflow:
        "hidden",

      marginTop:
        24,
    },


    progressFill: {
      height:
        "100%",

      backgroundColor:
        "#F5C542",

      borderRadius:
        5,
    },


    progressRow: {
      width:
        "100%",

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginTop:
        10,

      gap:
        10,
    },


    progressText: {
      color:
        "#A8B5C9",

      fontSize:
        12,

      fontWeight:
        "700",

      flexShrink:
        1,
    },


    remaining: {
      color:
        "#FFFFFF",

      fontSize:
        13,

      fontWeight:
        "800",

      marginTop:
        13,

      textAlign:
        "center",
    },


    statsRow: {
      flexDirection:
        "row",

      marginHorizontal:
        -6,
    },


    statCard: {
      flex: 1,

      backgroundColor:
        "#0B1727",

      borderWidth: 1,

      borderColor:
        "#263D59",

      borderRadius:
        22,

      padding:
        18,

      marginHorizontal:
        6,

      marginBottom:
        12,
    },


    statValue: {
      color:
        "#FFFFFF",

      fontSize:
        25,

      fontWeight:
        "900",

      marginBottom:
        7,
    },


    statLabel: {
      color:
        "#91A1B8",

      fontSize:
        10,

      letterSpacing:
        1.2,

      fontWeight:
        "900",

      textTransform:
        "uppercase",
    },


    wideCard: {
      backgroundColor:
        "#0B1727",

      borderWidth: 1,

      borderColor:
        "#263D59",

      borderRadius:
        22,

      padding:
        19,

      marginBottom:
        18,
    },


    wideValue: {
      color:
        "#81F1D0",

      fontSize:
        28,

      fontWeight:
        "900",

      marginTop:
        8,
    },


    communityCard: {
      backgroundColor:
        "#0B1727",

      borderWidth: 1,

      borderColor:
        "#564923",

      borderRadius:
        26,

      padding:
        22,

      marginBottom:
        16,
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


    statusRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      borderTopWidth:
        1,

      borderTopColor:
        "#263D59",

      marginTop:
        18,

      paddingTop:
        16,

      gap:
        12,
    },


    statusRowRTL: {
      flexDirection:
        "row-reverse",
    },


    statusLabel: {
      color:
        "#C5D0E0",

      fontSize:
        14,

      fontWeight:
        "700",

      flexShrink:
        1,
    },


    statusValue: {
      color:
        "#F5C542",

      fontSize:
        14,

      fontWeight:
        "900",
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