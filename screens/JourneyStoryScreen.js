import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getJourneyStory,
} from "../data/journeyStories";

import {
  getJourneyProgress,
} from "../utils/journeyProgress";

import {
  translate,
} from "../i18n/i18n";

import {
  getJourneyTranslation,
} from "../i18n/journeyTranslations";

// ============================================================
// STORY SCREEN TRANSLATIONS
// ============================================================

const STORY_TEXT = {
  en: {
    back: "Back",
    journeyStory: "JOURNEY STORY",
    intro:
      "Unlock the story one checkpoint at a time as your real-world steps move you through the route.",
    currentChapter: "CURRENT CHAPTER",
    storyLevel: "Story Level",
    storyXP: "Story XP",
    textStoryMode: "TEXT STORY MODE",
    markRead: "Mark Chapter Read",
    chapterRead: "✓ Chapter Read",
    shareChapter: "📤 Share Chapter",
    storyTranscript: "STORY TRANSCRIPT",
    storyCheckpoints: "Story Checkpoints",
    chapterComplete: "CHAPTER COMPLETE",
    unlocked: "UNLOCKED",
    locked: "LOCKED",
    reachCheckpoint:
      "Reach checkpoint {count} to unlock this story.",
    continueWalking: "Continue Walking",
    journeyStart: "Journey Start",
    journeyBegins: "The Journey Begins",
    beginStory:
      "Begin walking to unlock this journey’s story.",
    checkpoint: "Checkpoint {count}",
    chapter: "Chapter {count}",
    legathonJourney: "Legathon Journey",
    shareMessage:
      'I unlocked "{title}" on Legathon Walk. {story}',
  },

  es: {
    back: "Atrás",
    journeyStory: "HISTORIA DEL VIAJE",
    intro:
      "Desbloquea la historia punto por punto mientras tus pasos reales te hacen avanzar por la ruta.",
    currentChapter: "CAPÍTULO ACTUAL",
    storyLevel: "Nivel de Historia",
    storyXP: "XP de Historia",
    textStoryMode: "MODO HISTORIA DE TEXTO",
    markRead: "Marcar Capítulo como Leído",
    chapterRead: "✓ Capítulo Leído",
    shareChapter: "📤 Compartir Capítulo",
    storyTranscript: "TEXTO DE LA HISTORIA",
    storyCheckpoints: "Puntos de la Historia",
    chapterComplete: "CAPÍTULO COMPLETADO",
    unlocked: "DESBLOQUEADO",
    locked: "BLOQUEADO",
    reachCheckpoint:
      "Llega al punto {count} para desbloquear esta historia.",
    continueWalking: "Continuar Caminando",
    journeyStart: "Inicio del Viaje",
    journeyBegins: "Comienza el Viaje",
    beginStory:
      "Comienza a caminar para desbloquear la historia de este viaje.",
    checkpoint: "Punto {count}",
    chapter: "Capítulo {count}",
    legathonJourney: "Viaje Legathon",
    shareMessage:
      'Desbloqueé "{title}" en Legathon Walk. {story}',
  },

  fr: {
    back: "Retour",
    journeyStory: "HISTOIRE DU VOYAGE",
    intro:
      "Débloquez l’histoire étape par étape pendant que vos pas réels vous font avancer sur le parcours.",
    currentChapter: "CHAPITRE ACTUEL",
    storyLevel: "Niveau de l’Histoire",
    storyXP: "XP Histoire",
    textStoryMode: "MODE HISTOIRE TEXTE",
    markRead: "Marquer le Chapitre comme Lu",
    chapterRead: "✓ Chapitre Lu",
    shareChapter: "📤 Partager le Chapitre",
    storyTranscript: "TEXTE DE L’HISTOIRE",
    storyCheckpoints: "Étapes de l’Histoire",
    chapterComplete: "CHAPITRE TERMINÉ",
    unlocked: "DÉBLOQUÉ",
    locked: "VERROUILLÉ",
    reachCheckpoint:
      "Atteignez l’étape {count} pour débloquer cette histoire.",
    continueWalking: "Continuer à Marcher",
    journeyStart: "Début du Voyage",
    journeyBegins: "Le Voyage Commence",
    beginStory:
      "Commencez à marcher pour débloquer l’histoire de ce voyage.",
    checkpoint: "Étape {count}",
    chapter: "Chapitre {count}",
    legathonJourney: "Voyage Legathon",
    shareMessage:
      'J’ai débloqué « {title} » sur Legathon Walk. {story}',
  },

  de: {
    back: "Zurück",
    journeyStory: "REISEGESCHICHTE",
    intro:
      "Schalte die Geschichte Kontrollpunkt für Kontrollpunkt frei, während deine echten Schritte dich durch die Route führen.",
    currentChapter: "AKTUELLES KAPITEL",
    storyLevel: "Story-Level",
    storyXP: "Story-XP",
    textStoryMode: "TEXT-STORY-MODUS",
    markRead: "Kapitel als Gelesen Markieren",
    chapterRead: "✓ Kapitel Gelesen",
    shareChapter: "📤 Kapitel Teilen",
    storyTranscript: "STORY-TEXT",
    storyCheckpoints: "Story-Kontrollpunkte",
    chapterComplete: "KAPITEL ABGESCHLOSSEN",
    unlocked: "FREIGESCHALTET",
    locked: "GESPERRT",
    reachCheckpoint:
      "Erreiche Kontrollpunkt {count}, um diese Geschichte freizuschalten.",
    continueWalking: "Weitergehen",
    journeyStart: "Reisestart",
    journeyBegins: "Die Reise Beginnt",
    beginStory:
      "Beginne zu gehen, um die Geschichte dieser Reise freizuschalten.",
    checkpoint: "Kontrollpunkt {count}",
    chapter: "Kapitel {count}",
    legathonJourney: "Legathon-Reise",
    shareMessage:
      'Ich habe „{title}“ auf Legathon Walk freigeschaltet. {story}',
  },

  pt: {
    back: "Voltar",
    journeyStory: "HISTÓRIA DA JORNADA",
    intro:
      "Desbloqueie a história ponto a ponto enquanto seus passos reais avançam pela rota.",
    currentChapter: "CAPÍTULO ATUAL",
    storyLevel: "Nível da História",
    storyXP: "XP da História",
    textStoryMode: "MODO HISTÓRIA EM TEXTO",
    markRead: "Marcar Capítulo como Lido",
    chapterRead: "✓ Capítulo Lido",
    shareChapter: "📤 Compartilhar Capítulo",
    storyTranscript: "TEXTO DA HISTÓRIA",
    storyCheckpoints: "Pontos da História",
    chapterComplete: "CAPÍTULO CONCLUÍDO",
    unlocked: "DESBLOQUEADO",
    locked: "BLOQUEADO",
    reachCheckpoint:
      "Alcance o ponto {count} para desbloquear esta história.",
    continueWalking: "Continuar Caminhando",
    journeyStart: "Início da Jornada",
    journeyBegins: "A Jornada Começa",
    beginStory:
      "Comece a caminhar para desbloquear a história desta jornada.",
    checkpoint: "Ponto {count}",
    chapter: "Capítulo {count}",
    legathonJourney: "Jornada Legathon",
    shareMessage:
      'Desbloqueei "{title}" no Legathon Walk. {story}',
  },

  ja: {
    back: "戻る",
    journeyStory: "ジャーニーストーリー",
    intro:
      "実際の歩数でルートを進みながら、チェックポイントごとに物語を解放します。",
    currentChapter: "現在のチャプター",
    storyLevel: "ストーリーレベル",
    storyXP: "ストーリーXP",
    textStoryMode: "テキストストーリーモード",
    markRead: "チャプターを読了",
    chapterRead: "✓ 読了済み",
    shareChapter: "📤 チャプターを共有",
    storyTranscript: "ストーリーテキスト",
    storyCheckpoints: "ストーリーチェックポイント",
    chapterComplete: "チャプター完了",
    unlocked: "解除済み",
    locked: "ロック中",
    reachCheckpoint:
      "チェックポイント{count}に到達すると、このストーリーが解放されます。",
    continueWalking: "歩行を続ける",
    journeyStart: "ジャーニースタート",
    journeyBegins: "旅の始まり",
    beginStory:
      "歩き始めて、このジャーニーのストーリーを解放しましょう。",
    checkpoint: "チェックポイント {count}",
    chapter: "チャプター {count}",
    legathonJourney: "Legathonジャーニー",
    shareMessage:
      'Legathon Walkで「{title}」を解放しました。{story}',
  },

  ko: {
    back: "뒤로",
    journeyStory: "여정 이야기",
    intro:
      "실제 걸음으로 경로를 따라가며 체크포인트마다 이야기를 잠금 해제하세요.",
    currentChapter: "현재 챕터",
    storyLevel: "스토리 레벨",
    storyXP: "스토리 XP",
    textStoryMode: "텍스트 스토리 모드",
    markRead: "챕터 읽음 표시",
    chapterRead: "✓ 읽음 완료",
    shareChapter: "📤 챕터 공유",
    storyTranscript: "스토리 텍스트",
    storyCheckpoints: "스토리 체크포인트",
    chapterComplete: "챕터 완료",
    unlocked: "잠금 해제됨",
    locked: "잠김",
    reachCheckpoint:
      "체크포인트 {count}에 도달하면 이 이야기가 열립니다.",
    continueWalking: "계속 걷기",
    journeyStart: "여정 시작",
    journeyBegins: "여정이 시작됩니다",
    beginStory:
      "걷기를 시작하여 이 여정의 이야기를 잠금 해제하세요.",
    checkpoint: "체크포인트 {count}",
    chapter: "챕터 {count}",
    legathonJourney: "Legathon 여정",
    shareMessage:
      'Legathon Walk에서 "{title}"을 잠금 해제했습니다. {story}',
  },

  zh: {
    back: "返回",
    journeyStory: "旅程故事",
    intro:
      "随着现实中的步数推动你沿路线前进，逐个检查点解锁故事。",
    currentChapter: "当前章节",
    storyLevel: "故事等级",
    storyXP: "故事 XP",
    textStoryMode: "文字故事模式",
    markRead: "标记章节已读",
    chapterRead: "✓ 章节已读",
    shareChapter: "📤 分享章节",
    storyTranscript: "故事正文",
    storyCheckpoints: "故事检查点",
    chapterComplete: "章节已完成",
    unlocked: "已解锁",
    locked: "已锁定",
    reachCheckpoint:
      "到达检查点 {count} 即可解锁此故事。",
    continueWalking: "继续步行",
    journeyStart: "旅程开始",
    journeyBegins: "旅程启程",
    beginStory:
      "开始步行即可解锁这段旅程的故事。",
    checkpoint: "检查点 {count}",
    chapter: "章节 {count}",
    legathonJourney: "Legathon旅程",
    shareMessage:
      '我在 Legathon Walk 解锁了“{title}”。{story}',
  },

  it: {
    back: "Indietro",
    journeyStory: "STORIA DEL PERCORSO",
    intro:
      "Sblocca la storia checkpoint dopo checkpoint mentre i tuoi passi reali ti fanno avanzare lungo il percorso.",
    currentChapter: "CAPITOLO ATTUALE",
    storyLevel: "Livello Storia",
    storyXP: "XP Storia",
    textStoryMode: "MODALITÀ STORIA TESTUALE",
    markRead: "Segna Capitolo come Letto",
    chapterRead: "✓ Capitolo Letto",
    shareChapter: "📤 Condividi Capitolo",
    storyTranscript: "TESTO DELLA STORIA",
    storyCheckpoints: "Checkpoint della Storia",
    chapterComplete: "CAPITOLO COMPLETATO",
    unlocked: "SBLOCCATO",
    locked: "BLOCCATO",
    reachCheckpoint:
      "Raggiungi il checkpoint {count} per sbloccare questa storia.",
    continueWalking: "Continua a Camminare",
    journeyStart: "Inizio Percorso",
    journeyBegins: "Il Percorso Inizia",
    beginStory:
      "Inizia a camminare per sbloccare la storia di questo percorso.",
    checkpoint: "Checkpoint {count}",
    chapter: "Capitolo {count}",
    legathonJourney: "Percorso Legathon",
    shareMessage:
      'Ho sbloccato "{title}" su Legathon Walk. {story}',
  },

  ar: {
    back: "رجوع",
    journeyStory: "قصة الرحلة",
    intro:
      "افتح القصة نقطة بعد نقطة بينما تحركك خطواتك الحقيقية عبر المسار.",
    currentChapter: "الفصل الحالي",
    storyLevel: "مستوى القصة",
    storyXP: "خبرة القصة",
    textStoryMode: "وضع القصة النصية",
    markRead: "تحديد الفصل كمقروء",
    chapterRead: "✓ تمت قراءة الفصل",
    shareChapter: "📤 مشاركة الفصل",
    storyTranscript: "نص القصة",
    storyCheckpoints: "نقاط القصة",
    chapterComplete: "اكتمل الفصل",
    unlocked: "مفتوح",
    locked: "مغلق",
    reachCheckpoint:
      "صل إلى النقطة {count} لفتح هذه القصة.",
    continueWalking: "متابعة المشي",
    journeyStart: "بداية الرحلة",
    journeyBegins: "تبدأ الرحلة",
    beginStory:
      "ابدأ المشي لفتح قصة هذه الرحلة.",
    checkpoint: "النقطة {count}",
    chapter: "الفصل {count}",
    legathonJourney: "رحلة Legathon",
    shareMessage:
      'فتحت "{title}" على Legathon Walk. {story}',
  },
};

// ============================================================
// HELPERS
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
    ) =>
      Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[key]
          )
        : match
  );
}

function storyText(
  language,
  key,
  variables = {}
) {
  const central =
    translate(
      language,
      key
    );

  const value =
    central !== key
      ? central
      : STORY_TEXT?.[
          language
        ]?.[key] ??
        STORY_TEXT.en?.[
          key
        ] ??
        key;

  return fillTemplate(
    value,
    variables
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function JourneyStoryScreen({
  route,
  navigation,
  language = "en",
  goBack,
  goToProgress,
  lifetimeSteps = 0,
  subscriptionPlan = "free",
}) {
  const activeLanguage =
    route?.params?.language ||
    language ||
    "en";

  function t(
    key,
    variables = {}
  ) {
    return storyText(
      activeLanguage,
      key,
      variables
    );
  }

  // ==========================================================
  // JOURNEY
  // ==========================================================

  const routeJourney =
    route?.params?.journey ||
    null;

  const selectedJourneyId =
    routeJourney?.id ||
    routeJourney?.journeyId ||
    routeJourney?.routeKey ||
    routeJourney?.slug ||
    route?.params?.journeyId ||
    routeJourney?.title ||
    "selma";

  const storyData =
    getJourneyStory(
      selectedJourneyId
    );

  const requestedCheckpoint =
    Math.min(
      5,
      Math.max(
        1,
        Number(
          route?.params
            ?.checkpoint ||
            1
        )
      )
    );

  // ==========================================================
  // LOCALIZED JOURNEY
  // ==========================================================

  const localizedJourney =
    useMemo(
      () => {
        const source = {
          ...(storyData ||
            {}),
          ...(routeJourney ||
            {}),

          id:
            routeJourney?.id ||
            storyData?.id ||
            selectedJourneyId,
        };

        return getJourneyTranslation(
          source,
          activeLanguage
        );
      },

      [
        storyData,
        routeJourney,
        selectedJourneyId,
        activeLanguage,
      ]
    );

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    listenedChapters,
    setListenedChapters,
  ] =
    useState(
      []
    );

  const [
    storyXP,
    setStoryXP,
  ] =
    useState(
      0
    );

  const [
    showXPReward,
    setShowXPReward,
  ] =
    useState(
      false
    );

  const [
    journeyProgress,
    setJourneyProgress,
  ] =
    useState(
      null
    );

  // ==========================================================
  // LOAD STORY DATA
  // ==========================================================

  useEffect(
    () => {
      loadReadChapters();
      loadStoryXP();
    },

    []
  );

  useEffect(
    () => {
      let mounted =
        true;

      async function loadProgress() {
        try {
          const savedProgress =
            await getJourneyProgress(
              selectedJourneyId
            );

          if (
            mounted
          ) {
            setJourneyProgress(
              savedProgress
            );
          }
        } catch (
          error
        ) {
          console.log(
            "Journey progress load error:",
            error
          );
        }
      }

      if (
        selectedJourneyId
      ) {
        loadProgress();
      }

      return () => {
        mounted =
          false;
      };
    },

    [
      selectedJourneyId,
    ]
  );

  // ==========================================================
  // LOAD READ CHAPTERS
  // ==========================================================

  async function loadReadChapters() {
    try {
      // Keep the existing storage key so previous
      // Story XP / completed chapters are not lost.
      const saved =
        await AsyncStorage
          .getItem(
            "listenedJourneyChapters"
          );

      const parsed =
        saved
          ? JSON.parse(
              saved
            )
          : [];

      setListenedChapters(
        Array.isArray(
          parsed
        )
          ? parsed
          : []
      );
    } catch (
      error
    ) {
      console.log(
        "Load story chapters error:",
        error
      );
    }
  }

  // ==========================================================
  // LOAD STORY XP
  // ==========================================================

  async function loadStoryXP() {
    try {
      const saved =
        await AsyncStorage
          .getItem(
            "storyXP"
          );

      setStoryXP(
        Number(
          saved ||
            0
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Load story XP error:",
        error
      );
    }
  }

  // ==========================================================
  // CHECKPOINTS
  // ==========================================================

  const checkpoints =
    useMemo(
      () => {
        const chapters =
          storyData?.chapters ||
          storyData?.checkpoints ||
          [];

        const journeyPercent =
          Math.max(
            Number(
              journeyProgress
                ?.progress ||
                0
            ),

            Number(
              routeJourney
                ?.progress ||
                0
            ),

            Number(
              routeJourney
                ?.journeyProgress ||
                0
            ),

            Number(
              routeJourney
                ?.progressPercent ||
                0
            )
          );

        const journeyIsComplete =
          journeyProgress
            ?.isComplete ===
            true ||
          journeyProgress
            ?.completed ===
            true ||
          routeJourney
            ?.isComplete ===
            true ||
          routeJourney
            ?.completed ===
            true ||
          journeyPercent >=
            100;

        const currentCheckpoint =
          Math.max(
            Number(
              journeyProgress
                ?.currentCheckpoint ||
                0
            ),

            Number(
              journeyProgress
                ?.checkpoint ||
                0
            ),

            Number(
              routeJourney
                ?.currentCheckpoint ||
                0
            ),

            Number(
              routeJourney
                ?.checkpoint ||
                0
            )
          );

        const completedCheckpoints = [
          ...(
            Array.isArray(
              journeyProgress
                ?.completedCheckpoints
            )
              ? journeyProgress
                  .completedCheckpoints
              : []
          ),

          ...(
            Array.isArray(
              routeJourney
                ?.completedCheckpoints
            )
              ? routeJourney
                  .completedCheckpoints
              : []
          ),
        ].map(
          Number
        );

        const unlockedStories = [
          ...(
            Array.isArray(
              journeyProgress
                ?.storiesUnlocked
            )
              ? journeyProgress
                  .storiesUnlocked
              : []
          ),

          ...(
            Array.isArray(
              routeJourney
                ?.storiesUnlocked
            )
              ? routeJourney
                  .storiesUnlocked
              : []
          ),
        ].map(
          Number
        );

        return chapters.map(
          (
            chapter,
            index
          ) => {
            const checkpointNumber =
              index +
              1;

            const requiredPercent =
              (
                (
                  checkpointNumber -
                  1
                ) /
                4
              ) *
              100;

            const requiredSteps =
              Number(
                routeJourney
                  ?.checkpointSteps?.[
                    index
                  ]
              ) ||
              Number(
                routeJourney
                  ?.stepsPerCheckpoint
              ) *
                checkpointNumber ||
              checkpointNumber *
                1000;

            const unlocked =
              checkpointNumber ===
                1 ||
              journeyIsComplete ||
              journeyPercent >=
                requiredPercent ||
              currentCheckpoint >=
                checkpointNumber ||
              completedCheckpoints
                .includes(
                  checkpointNumber
                ) ||
              unlockedStories
                .includes(
                  checkpointNumber
                );

            const chapterId =
              chapter.id ||
              `${
                storyData?.id ||
                selectedJourneyId ||
                "journey"
              }-${checkpointNumber}`;

            const completed =
              listenedChapters
                .includes(
                  chapterId
                ) ||
              journeyIsComplete ||
              completedCheckpoints
                .includes(
                  checkpointNumber
                );

            return {
              ...chapter,

              id:
                chapterId,

              number:
                checkpointNumber,

              checkpoint:
                checkpointNumber,

              title:
                chapter.location ||
                chapter.title ||
                t(
                  "checkpoint",
                  {
                    count:
                      checkpointNumber,
                  }
                ),

              subtitle:
                chapter.title ||
                t(
                  "chapter",
                  {
                    count:
                      checkpointNumber,
                  }
                ),

              story:
                chapter.description ||
                chapter.story ||
                chapter.narration ||
                "",

              xp:
                Number(
                  chapter.xp ||
                    25
                ),

              requiredSteps,

              unlocked,

              completed,
            };
          }
        );
      },

      [
        storyData,
        routeJourney,
        listenedChapters,
        journeyProgress,
        activeLanguage,
        selectedJourneyId,
      ]
    );

  // ==========================================================
  // CURRENT CHAPTER
  // ==========================================================

  const currentChapter =
    checkpoints.find(
      checkpoint =>
        Number(
          checkpoint
            ?.checkpoint
        ) ===
        requestedCheckpoint
    ) ||
    checkpoints[
      requestedCheckpoint -
        1
    ] ||
    checkpoints[0] ||
    {
      id:
        `journey-start-${requestedCheckpoint}`,

      number:
        requestedCheckpoint,

      checkpoint:
        requestedCheckpoint,

      title:
        t(
          "journeyStart"
        ),

      subtitle:
        t(
          "journeyBegins"
        ),

      story:
        t(
          "beginStory"
        ),

      xp:
        0,

      requiredSteps:
        0,

      unlocked:
        true,

      completed:
        false,
    };

  // ==========================================================
  // DISPLAY DATA
  // ==========================================================

  const journeyTitle =
    localizedJourney
      ?.title ||
    storyData?.title ||
    routeJourney?.title ||
    routeJourney?.name ||
    t(
      "legathonJourney"
    );

  const chapterTitle =
    currentChapter
      ?.subtitle ||
    currentChapter
      ?.title ||
    t(
      "journeyBegins"
    );

  const chapterLocation =
    currentChapter
      ?.title ||
    currentChapter
      ?.location ||
    t(
      "checkpoint",
      {
        count:
          currentChapter
            ?.number ||
          1,
      }
    );

  const chapterStory =
    currentChapter
      ?.story ||
    currentChapter
      ?.description ||
    t(
      "beginStory"
    );

  const storyLevel =
    Math.max(
      1,

      Math.floor(
        storyXP /
          100
      ) +
        1
    );

  const storyXPProgress =
    storyXP %
    100;

  const currentChapterRead =
    listenedChapters
      .includes(
        currentChapter.id
      );

  // ==========================================================
  // MARK CHAPTER READ
  // ==========================================================

  async function markChapterRead() {
    if (
      !currentChapter?.id ||
      currentChapterRead
    ) {
      return;
    }

    const updatedChapters = [
      ...new Set([
        ...listenedChapters,
        currentChapter.id,
      ]),
    ];

    setListenedChapters(
      updatedChapters
    );

    await AsyncStorage
      .setItem(
        "listenedJourneyChapters",

        JSON.stringify(
          updatedChapters
        )
      );

    const xpAmount =
      Number(
        currentChapter
          ?.xp ||
          25
      );

    const updatedXP =
      storyXP +
      xpAmount;

    setStoryXP(
      updatedXP
    );

    await AsyncStorage
      .setItem(
        "storyXP",

        String(
          updatedXP
        )
      );

    setShowXPReward(
      true
    );

    setTimeout(
      () => {
        setShowXPReward(
          false
        );
      },

      2500
    );
  }

  // ==========================================================
  // SHARE
  // ==========================================================

  async function shareChapter() {
    try {
      await Share.share({
        message:
          t(
            "shareMessage",
            {
              title:
                chapterTitle,

              story:
                chapterStory,
            }
          ),
      });
    } catch (
      error
    ) {
      console.log(
        "Share chapter error:",
        error
      );
    }
  }

  // ==========================================================
  // BACK
  // ==========================================================

  function handleBack() {
    if (
      typeof goBack ===
      "function"
    ) {
      goBack();

      return;
    }

    navigation
      ?.goBack?.();
  }

  // ==========================================================
  // CONTINUE WALKING
  // ==========================================================

  function continueWalking() {
    const journeyToContinue =
      routeJourney &&
      typeof routeJourney ===
        "object"
        ? routeJourney
        : storyData &&
          typeof storyData ===
            "object"
        ? {
            ...storyData,

            id:
              storyData.id ||
              selectedJourneyId,
          }
        : null;

    if (
      typeof goToProgress ===
      "function"
    ) {
      goToProgress(
        journeyToContinue
      );

      return;
    }

    handleBack();
  }

  // ==========================================================
  // BACKGROUND
  // ==========================================================

  const backgroundSource =
    routeJourney
      ?.background ||
    routeJourney?.image ||
    storyData?.background ||
    require(
      "../assets/collage-background.png"
    );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ImageBackground
      source={
        backgroundSource
      }
      style={
        styles.background
      }
      resizeMode="cover"
    >
      <View
        style={
          styles.overlay
        }
      >
        {/* ====================================================
            XP REWARD
        ==================================================== */}

        {showXPReward && (
          <View
            style={
              styles.xpReward
            }
          >
            <Text
              style={
                styles.xpRewardText
              }
            >
              +
              {Number(
                currentChapter
                  ?.xp ||
                  25
              )}{" "}
              {t(
                "storyXP"
              )}
            </Text>
          </View>
        )}

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

            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={
                handleBack
              }
              activeOpacity={
                0.85
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

            {/* ==================================================
                HEADER
            ================================================== */}

            <Text
              style={
                styles.kicker
              }
            >
              {t(
                "journeyStory"
              )}
            </Text>

            <Text
              style={
                styles.journeyTitle
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
                journeyTitle
              }
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              {t(
                "intro"
              )}
            </Text>

            {/* ==================================================
                CURRENT CHAPTER
            ================================================== */}

            <View
              style={
                styles.heroCard
              }
            >
              <Text
                style={
                  styles.heroLabel
                }
              >
                {t(
                  "currentChapter"
                )}
              </Text>

              <Text
                style={
                  styles.locationLabel
                }
              >
                {
                  chapterLocation
                }
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
                numberOfLines={
                  4
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.72
                }
              >
                {
                  chapterTitle
                }
              </Text>

              {/* ================================================
                  STORY XP
              ================================================ */}

              <View
                style={
                  styles.storyLevelCard
                }
              >
                <Text
                  style={
                    styles.storyLevelText
                  }
                >
                  {t(
                    "storyLevel"
                  )}{" "}
                  {
                    storyLevel
                  }
                </Text>

                <Text
                  style={
                    styles.storyXPText
                  }
                >
                  {
                    storyXPProgress
                  }
                  /100 XP
                </Text>

                <View
                  style={
                    styles.storyXPTrack
                  }
                >
                  <View
                    style={[
                      styles.storyXPFill,

                      {
                        width:
                          `${storyXPProgress}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* ================================================
                  STORY TEXT
              ================================================ */}

              <Text
                style={
                  styles.heroText
                }
              >
                {
                  chapterStory
                }
              </Text>

              {/* ================================================
                  TEXT MODE BADGE
              ================================================ */}

              <View
                style={
                  styles.textModeBadge
                }
              >
                <Ionicons
                  name="book-outline"
                  size={
                    18
                  }
                  color="#4FFFD2"
                />

                <Text
                  style={
                    styles.textModeBadgeText
                  }
                >
                  {t(
                    "textStoryMode"
                  )}
                </Text>
              </View>

              {/* ================================================
                  MARK READ
              ================================================ */}

              <TouchableOpacity
                style={[
                  styles.readButton,

                  currentChapterRead &&
                    styles.readButtonComplete,
                ]}
                onPress={
                  markChapterRead
                }
                disabled={
                  currentChapterRead
                }
                activeOpacity={
                  0.85
                }
              >
                <Ionicons
                  name={
                    currentChapterRead
                      ? "checkmark-circle"
                      : "book-outline"
                  }
                  size={
                    22
                  }
                  color="#020617"
                />

                <Text
                  style={
                    styles.readButtonText
                  }
                >
                  {currentChapterRead
                    ? t(
                        "chapterRead"
                      )
                    : t(
                        "markRead"
                      )}
                </Text>
              </TouchableOpacity>

              {/* ================================================
                  SHARE
              ================================================ */}

              <TouchableOpacity
                style={
                  styles.shareButton
                }
                onPress={
                  shareChapter
                }
                activeOpacity={
                  0.85
                }
              >
                <Text
                  style={
                    styles.shareButtonText
                  }
                >
                  {t(
                    "shareChapter"
                  )}
                </Text>
              </TouchableOpacity>

              {/* ================================================
                  TRANSCRIPT / STORY
              ================================================ */}

              <View
                style={
                  styles.transcriptCard
                }
              >
                <Text
                  style={
                    styles.transcriptLabel
                  }
                >
                  {t(
                    "storyTranscript"
                  )}
                </Text>

                <Text
                  style={
                    styles.transcriptText
                  }
                >
                  {
                    chapterStory
                  }
                </Text>
              </View>
            </View>

            {/* ==================================================
                CHECKPOINT LIST
            ================================================== */}

            <View
              style={
                styles.checkpointsSection
              }
            >
              <Text
                style={
                  styles.checkpointsTitle
                }
              >
                {t(
                  "storyCheckpoints"
                )}
              </Text>

              {checkpoints.map(
                (
                  checkpoint,
                  index
                ) => {
                  const checkpointNumber =
                    Number(
                      checkpoint
                        .checkpoint ||
                      checkpoint
                        .number ||
                      index +
                        1
                    );

                  const isCurrent =
                    checkpointNumber ===
                    Number(
                      requestedCheckpoint
                    );

                  const isUnlocked =
                    checkpoint
                      .unlocked ||
                    isCurrent;

                  const isCompleted =
                    checkpoint
                      .completed ||
                    listenedChapters
                      .includes(
                        checkpoint.id
                      );

                  return (
                    <View
                      key={
                        checkpoint.id ||
                        `checkpoint-${checkpointNumber}`
                      }
                      style={[
                        styles.checkpointCard,

                        isCurrent &&
                          styles
                            .checkpointCardCurrent,

                        !isUnlocked &&
                          styles
                            .checkpointCardLocked,
                      ]}
                    >
                      {/* ========================================
                          NUMBER
                      ======================================== */}

                      <View
                        style={[
                          styles.checkpointNumber,

                          isCompleted &&
                            styles
                              .checkpointNumberComplete,

                          !isUnlocked &&
                            styles
                              .checkpointNumberLocked,
                        ]}
                      >
                        {isUnlocked ? (
                          <Text
                            style={
                              styles
                                .checkpointNumberText
                            }
                          >
                            {
                              checkpointNumber
                            }
                          </Text>
                        ) : (
                          <Ionicons
                            name="lock-closed"
                            size={
                              21
                            }
                            color="#94A1B3"
                          />
                        )}
                      </View>

                      {/* ========================================
                          CONTENT
                      ======================================== */}

                      <View
                        style={
                          styles.checkpointContent
                        }
                      >
                        <Text
                          style={
                            styles.checkpointStatus
                          }
                        >
                          {isCompleted
                            ? t(
                                "chapterComplete"
                              )
                            : isCurrent
                            ? t(
                                "currentChapter"
                              )
                            : isUnlocked
                            ? t(
                                "unlocked"
                              )
                            : t(
                                "locked"
                              )}
                        </Text>

                        <Text
                          style={
                            styles.checkpointTitle
                          }
                        >
                          {
                            checkpoint.title
                          }
                        </Text>

                        <Text
                          style={
                            styles.checkpointSubtitle
                          }
                        >
                          {
                            checkpoint.subtitle
                          }
                        </Text>

                        {isUnlocked ? (
                          <Text
                            style={
                              styles.checkpointStory
                            }
                          >
                            {checkpoint.story ||
                              checkpoint.description ||
                              ""}
                          </Text>
                        ) : (
                          <Text
                            style={
                              styles.checkpointLockedText
                            }
                          >
                            {t(
                              "reachCheckpoint",

                              {
                                count:
                                  checkpointNumber,
                              }
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* ==================================================
                CONTINUE WALKING
            ================================================== */}

            <TouchableOpacity
              style={
                styles.progressButton
              }
              onPress={
                continueWalking
              }
              activeOpacity={
                0.85
              }
            >
              <Ionicons
                name="walk"
                size={
                  23
                }
                color="#020617"
              />

              <Text
                style={
                  styles.progressButtonText
                }
              >
                {t(
                  "continueWalking"
                )}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    background: {
      flex:
        1,

      backgroundColor:
        "#020617",
    },

    overlay: {
      flex:
        1,

      backgroundColor:
        "rgba(2,4,10,0.80)",
    },

    safe: {
      flex:
        1,
    },

    content: {
      padding:
        22,

      paddingBottom:
        190,
    },

    // ==========================================================
    // XP
    // ==========================================================

    xpReward: {
      position:
        "absolute",

      top:
        80,

      alignSelf:
        "center",

      backgroundColor:
        "#D4AF37",

      paddingHorizontal:
        22,

      paddingVertical:
        12,

      borderRadius:
        999,

      zIndex:
        99,

      shadowColor:
        "#D4AF37",

      shadowOpacity:
        0.5,

      shadowRadius:
        14,

      elevation:
        10,
    },

    xpRewardText: {
      color:
        "#020617",

      fontSize:
        18,

      fontWeight:
        "900",
    },

    // ==========================================================
    // BACK
    // ==========================================================

    backButton: {
      alignSelf:
        "flex-start",

      paddingVertical:
        12,

      paddingHorizontal:
        20,

      borderRadius:
        999,

      backgroundColor:
        "rgba(8,18,37,0.86)",

      borderWidth:
        1,

      borderColor:
        "rgba(167,243,208,0.45)",

      marginBottom:
        26,
    },

    backText: {
      color:
        "#A7F3D0",

      fontSize:
        19,

      fontWeight:
        "900",
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    kicker: {
      color:
        "#D4AF37",

      fontSize:
        14,

      fontWeight:
        "900",

      letterSpacing:
        4,

      marginBottom:
        10,
    },

    journeyTitle: {
      color:
        "#FFFFFF",

      fontSize:
        42,

      lineHeight:
        47,

      fontWeight:
        "900",

      letterSpacing:
        -1,

      marginBottom:
        12,
    },

    subtitle: {
      color:
        "#CBD5E1",

      fontSize:
        19,

      fontWeight:
        "700",

      lineHeight:
        29,

      marginBottom:
        28,
    },

    // ==========================================================
    // HERO
    // ==========================================================

    heroCard: {
      backgroundColor:
        "rgba(8,18,37,0.96)",

      borderRadius:
        32,

      padding:
        24,

      borderWidth:
        1,

      borderColor:
        "rgba(167,243,208,0.30)",

      marginBottom:
        24,
    },

    heroLabel: {
      color:
        "#D4AF37",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginBottom:
        10,
    },

    locationLabel: {
      color:
        "#9EF2D0",

      fontSize:
        16,

      fontWeight:
        "900",

      marginBottom:
        7,
    },

    heroTitle: {
      color:
        "#FFFFFF",

      fontSize:
        38,

      fontWeight:
        "900",

      lineHeight:
        44,

      marginBottom:
        18,
    },

    heroText: {
      color:
        "#CBD5E1",

      fontSize:
        19,

      fontWeight:
        "700",

      lineHeight:
        30,

      marginBottom:
        22,
    },

    // ==========================================================
    // STORY LEVEL
    // ==========================================================

    storyLevelCard: {
      backgroundColor:
        "rgba(2,6,23,0.65)",

      borderRadius:
        20,

      padding:
        16,

      marginBottom:
        18,

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.35)",
    },

    storyLevelText: {
      color:
        "#FFFFFF",

      fontSize:
        20,

      fontWeight:
        "900",
    },

    storyXPText: {
      color:
        "#D4AF37",

      fontSize:
        16,

      fontWeight:
        "900",

      marginTop:
        4,

      marginBottom:
        10,
    },

    storyXPTrack: {
      height:
        10,

      borderRadius:
        20,

      backgroundColor:
        "rgba(255,255,255,0.14)",

      overflow:
        "hidden",
    },

    storyXPFill: {
      height:
        "100%",

      borderRadius:
        20,

      backgroundColor:
        "#D4AF37",
    },

    // ==========================================================
    // TEXT MODE
    // ==========================================================

    textModeBadge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(79,255,210,0.12)",

      borderWidth:
        1,

      borderColor:
        "#4FFFD2",

      paddingVertical:
        10,

      paddingHorizontal:
        16,

      borderRadius:
        999,

      alignSelf:
        "flex-start",

      marginBottom:
        18,
    },

    textModeBadgeText: {
      color:
        "#4FFFD2",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        1.4,

      marginLeft:
        8,
    },

    // ==========================================================
    // READ BUTTON
    // ==========================================================

    readButton: {
      minHeight:
        58,

      backgroundColor:
        "#A7F3D0",

      borderRadius:
        22,

      paddingHorizontal:
        16,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    readButtonComplete: {
      backgroundColor:
        "#4FFFD2",
    },

    readButtonText: {
      color:
        "#020617",

      fontSize:
        17,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginLeft:
        9,
    },

    // ==========================================================
    // SHARE
    // ==========================================================

    shareButton: {
      marginTop:
        14,

      borderRadius:
        20,

      paddingVertical:
        15,

      paddingHorizontal:
        12,

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.10)",

      borderWidth:
        1,

      borderColor:
        "rgba(255,255,255,0.18)",
    },

    shareButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    // ==========================================================
    // TRANSCRIPT
    // ==========================================================

    transcriptCard: {
      backgroundColor:
        "rgba(2,6,23,0.68)",

      borderRadius:
        24,

      padding:
        18,

      marginTop:
        18,

      borderWidth:
        1,

      borderColor:
        "rgba(167,243,208,0.22)",
    },

    transcriptLabel: {
      color:
        "#D4AF37",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginBottom:
        10,
    },

    transcriptText: {
      color:
        "#CBD5E1",

      fontSize:
        17,

      fontWeight:
        "700",

      lineHeight:
        27,
    },

    // ==========================================================
    // CHECKPOINTS
    // ==========================================================

    checkpointsSection: {
      marginTop:
        24,

      padding:
        20,

      paddingBottom:
        28,

      backgroundColor:
        "rgba(4,15,35,0.96)",

      borderRadius:
        28,

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.45)",
    },

    checkpointsTitle: {
      color:
        "#FFFFFF",

      fontSize:
        30,

      fontWeight:
        "900",

      marginBottom:
        22,
    },

    checkpointCard: {
      flexDirection:
        "row",

      marginBottom:
        18,

      padding:
        18,

      borderRadius:
        22,

      backgroundColor:
        "#07152B",

      borderWidth:
        1,

      borderColor:
        "rgba(132,159,197,0.35)",
    },

    checkpointCardCurrent: {
      borderColor:
        "#D9B52F",

      borderWidth:
        2,

      backgroundColor:
        "#0A1930",
    },

    checkpointCardLocked: {
      opacity:
        0.55,
    },

    checkpointNumber: {
      width:
        50,

      height:
        50,

      borderRadius:
        25,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        14,

      backgroundColor:
        "#D9B52F",
    },

    checkpointNumberComplete: {
      backgroundColor:
        "#4FFFD2",
    },

    checkpointNumberLocked: {
      backgroundColor:
        "#17243A",

      borderWidth:
        1,

      borderColor:
        "#53627A",
    },

    checkpointNumberText: {
      color:
        "#061126",

      fontSize:
        22,

      fontWeight:
        "900",
    },

    checkpointContent: {
      flex:
        1,
    },

    checkpointStatus: {
      color:
        "#D9B52F",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        1.4,

      marginBottom:
        8,
    },

    checkpointTitle: {
      color:
        "#FFFFFF",

      fontSize:
        23,

      fontWeight:
        "900",

      marginBottom:
        5,
    },

    checkpointSubtitle: {
      color:
        "#9EF2D0",

      fontSize:
        17,

      fontWeight:
        "800",

      marginBottom:
        10,
    },

    checkpointStory: {
      color:
        "#D6DEEC",

      fontSize:
        16,

      lineHeight:
        25,

      fontWeight:
        "600",
    },

    checkpointLockedText: {
      color:
        "#91A0B7",

      fontSize:
        14,

      lineHeight:
        21,

      fontWeight:
        "700",
    },

    // ==========================================================
    // CONTINUE
    // ==========================================================

    progressButton: {
      minHeight:
        64,

      backgroundColor:
        "#D4AF37",

      borderRadius:
        24,

      paddingVertical:
        18,

      paddingHorizontal:
        16,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        18,

      marginBottom:
        30,
    },

    progressButtonText: {
      flexShrink:
        1,

      color:
        "#020617",

      fontSize:
        22,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginLeft:
        9,
    },
  });