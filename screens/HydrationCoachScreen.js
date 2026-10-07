// screens/HydrationCoachScreen.js

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";


// ============================================================
// LEGATHON WALK — HYDRATION COACH
// ============================================================
//
// • 10-language support
// • Daily hydration tracking
// • Persistent hydration storage
// • Adjustable daily goal
// • Hydration progress
// • Recovery navigation
// • AI Wellness navigation
//
// Languages:
//
// en English
// es Spanish
// fr French
// de German
// pt Portuguese
// ja Japanese
// ko Korean
// zh Chinese
// it Italian
// ar Arabic
//
// ============================================================


// ============================================================
// STORAGE
// ============================================================

const HYDRATION_KEYS = [
  "hydrationData",
  "dailyHydration",
];

const DEFAULT_GOAL = 100;

const ADD_AMOUNTS = [
  8,
  12,
  16,
  24,
];

const GOAL_OPTIONS = [
  64,
  80,
  100,
  128,
];


// ============================================================
// TRANSLATIONS
// ============================================================

const HYDRATION_TRANSLATIONS = {
  en: {
    wellness: "LEGATHON WELLNESS",
    hydrationCoach: "Hydration Coach",

    todaysWater: "TODAY’S WATER",
    ofGoal: "of {goal} oz goal",

    complete: "complete",
    remaining: "{amount} oz remaining",
    goalReached: "Goal reached",

    dailyGoalComplete: "Daily Goal Complete",
    dailyGoalCompleteMessage:
      "Excellent work. Continue drinking according to thirst and activity.",

    almostThere: "Almost There",
    almostThereMessage:
      "You are close to your hydration goal. Keep your water nearby.",

    buildingMomentum: "Building Momentum",
    buildingMomentumMessage:
      "Good progress. Add water gradually throughout the rest of your day.",

    hydrationNeeded: "Hydration Needed",
    hydrationNeededMessage:
      "Start with a glass of water and keep recording your intake today.",

    addWater: "Add Water",
    addWaterSubtitle:
      "Select the amount you just finished drinking.",

    removeEight: "Remove 8 oz",

    dailyGoal: "Daily Goal",

    recovery: "Recovery",
    aiWellness: "AI Wellness",

    lastUpdated: "Last updated {time}",
    noWaterToday: "No water recorded today",
    reset: "Reset",

    resetTitle: "Reset Today’s Water?",
    resetMessage:
      "This resets only today’s hydration amount.",
    cancel: "Cancel",

    saveError: "Save Error",
    saveErrorMessage:
      "Your hydration could not be saved. Please try again.",

    notice:
      "Hydration needs vary. Follow professional guidance if you have a medical condition or fluid restriction.",
  },

  es: {
    wellness: "BIENESTAR LEGATHON",
    hydrationCoach: "Entrenador de Hidratación",

    todaysWater: "AGUA DE HOY",
    ofGoal: "de una meta de {goal} oz",

    complete: "completado",
    remaining: "faltan {amount} oz",
    goalReached: "Meta alcanzada",

    dailyGoalComplete: "Meta Diaria Completada",
    dailyGoalCompleteMessage:
      "Excelente trabajo. Continúa bebiendo según tu sed y nivel de actividad.",

    almostThere: "Ya Casi",
    almostThereMessage:
      "Estás cerca de tu meta de hidratación. Mantén agua cerca.",

    buildingMomentum: "Buen Progreso",
    buildingMomentumMessage:
      "Vas bien. Continúa agregando agua gradualmente durante el resto del día.",

    hydrationNeeded: "Necesitas Hidratación",
    hydrationNeededMessage:
      "Comienza con un vaso de agua y continúa registrando tu consumo hoy.",

    addWater: "Agregar Agua",
    addWaterSubtitle:
      "Selecciona la cantidad de agua que acabas de beber.",

    removeEight: "Quitar 8 oz",

    dailyGoal: "Meta Diaria",

    recovery: "Recuperación",
    aiWellness: "Bienestar IA",

    lastUpdated: "Última actualización {time}",
    noWaterToday: "No se ha registrado agua hoy",
    reset: "Restablecer",

    resetTitle: "¿Restablecer el agua de hoy?",
    resetMessage:
      "Esto restablece únicamente la cantidad de hidratación de hoy.",
    cancel: "Cancelar",

    saveError: "Error al Guardar",
    saveErrorMessage:
      "No se pudo guardar tu hidratación. Inténtalo de nuevo.",

    notice:
      "Las necesidades de hidratación varían. Sigue las indicaciones profesionales si tienes una condición médica o restricción de líquidos.",
  },

  fr: {
    wellness: "BIEN-ÊTRE LEGATHON",
    hydrationCoach: "Coach Hydratation",

    todaysWater: "EAU AUJOURD’HUI",
    ofGoal: "sur un objectif de {goal} oz",

    complete: "terminé",
    remaining: "{amount} oz restantes",
    goalReached: "Objectif atteint",

    dailyGoalComplete: "Objectif Quotidien Atteint",
    dailyGoalCompleteMessage:
      "Excellent travail. Continuez à boire selon votre soif et votre activité.",

    almostThere: "Presque Arrivé",
    almostThereMessage:
      "Vous êtes proche de votre objectif d’hydratation. Gardez de l’eau à proximité.",

    buildingMomentum: "Bon Progrès",
    buildingMomentumMessage:
      "Bonne progression. Continuez à boire progressivement pendant le reste de la journée.",

    hydrationNeeded: "Hydratation Nécessaire",
    hydrationNeededMessage:
      "Commencez par un verre d’eau et continuez à enregistrer votre consommation aujourd’hui.",

    addWater: "Ajouter de l’Eau",
    addWaterSubtitle:
      "Sélectionnez la quantité que vous venez de boire.",

    removeEight: "Retirer 8 oz",

    dailyGoal: "Objectif Quotidien",

    recovery: "Récupération",
    aiWellness: "Bien-être IA",

    lastUpdated: "Dernière mise à jour {time}",
    noWaterToday: "Aucune eau enregistrée aujourd’hui",
    reset: "Réinitialiser",

    resetTitle: "Réinitialiser l’eau d’aujourd’hui ?",
    resetMessage:
      "Cela réinitialise uniquement la quantité d’eau enregistrée aujourd’hui.",
    cancel: "Annuler",

    saveError: "Erreur d’Enregistrement",
    saveErrorMessage:
      "Votre hydratation n’a pas pu être enregistrée. Veuillez réessayer.",

    notice:
      "Les besoins en hydratation varient. Suivez les conseils d’un professionnel si vous avez une condition médicale ou une restriction hydrique.",
  },

  de: {
    wellness: "LEGATHON WELLNESS",
    hydrationCoach: "Hydrations-Coach",

    todaysWater: "HEUTIGES WASSER",
    ofGoal: "von {goal} oz Tagesziel",

    complete: "abgeschlossen",
    remaining: "{amount} oz verbleibend",
    goalReached: "Ziel erreicht",

    dailyGoalComplete: "Tagesziel Erreicht",
    dailyGoalCompleteMessage:
      "Ausgezeichnet. Trinke weiterhin entsprechend deinem Durst und deiner Aktivität.",

    almostThere: "Fast Geschafft",
    almostThereMessage:
      "Du bist deinem Hydrationsziel sehr nahe. Halte Wasser griffbereit.",

    buildingMomentum: "Guter Fortschritt",
    buildingMomentumMessage:
      "Guter Fortschritt. Trinke im Laufe des restlichen Tages regelmäßig weiter.",

    hydrationNeeded: "Flüssigkeit Benötigt",
    hydrationNeededMessage:
      "Beginne mit einem Glas Wasser und erfasse deine Flüssigkeitsaufnahme weiter.",

    addWater: "Wasser Hinzufügen",
    addWaterSubtitle:
      "Wähle die Wassermenge aus, die du gerade getrunken hast.",

    removeEight: "8 oz entfernen",

    dailyGoal: "Tagesziel",

    recovery: "Erholung",
    aiWellness: "KI-Wellness",

    lastUpdated: "Zuletzt aktualisiert {time}",
    noWaterToday: "Heute wurde noch kein Wasser erfasst",
    reset: "Zurücksetzen",

    resetTitle: "Heutiges Wasser zurücksetzen?",
    resetMessage:
      "Dadurch wird nur die heutige Trinkmenge zurückgesetzt.",
    cancel: "Abbrechen",

    saveError: "Speicherfehler",
    saveErrorMessage:
      "Deine Hydration konnte nicht gespeichert werden. Bitte versuche es erneut.",

    notice:
      "Der Flüssigkeitsbedarf ist unterschiedlich. Befolge professionelle Empfehlungen, wenn du eine Erkrankung oder Flüssigkeitsbeschränkung hast.",
  },

  pt: {
    wellness: "BEM-ESTAR LEGATHON",
    hydrationCoach: "Coach de Hidratação",

    todaysWater: "ÁGUA DE HOJE",
    ofGoal: "de uma meta de {goal} oz",

    complete: "concluído",
    remaining: "{amount} oz restantes",
    goalReached: "Meta alcançada",

    dailyGoalComplete: "Meta Diária Concluída",
    dailyGoalCompleteMessage:
      "Excelente trabalho. Continue bebendo de acordo com sua sede e atividade.",

    almostThere: "Quase Lá",
    almostThereMessage:
      "Você está perto da sua meta de hidratação. Mantenha água por perto.",

    buildingMomentum: "Bom Progresso",
    buildingMomentumMessage:
      "Bom progresso. Continue bebendo água gradualmente durante o restante do dia.",

    hydrationNeeded: "Hidratação Necessária",
    hydrationNeededMessage:
      "Comece com um copo de água e continue registrando sua ingestão hoje.",

    addWater: "Adicionar Água",
    addWaterSubtitle:
      "Selecione a quantidade de água que você acabou de beber.",

    removeEight: "Remover 8 oz",

    dailyGoal: "Meta Diária",

    recovery: "Recuperação",
    aiWellness: "Bem-estar IA",

    lastUpdated: "Última atualização {time}",
    noWaterToday: "Nenhuma água registrada hoje",
    reset: "Redefinir",

    resetTitle: "Redefinir a água de hoje?",
    resetMessage:
      "Isso redefine apenas a quantidade de hidratação de hoje.",
    cancel: "Cancelar",

    saveError: "Erro ao Salvar",
    saveErrorMessage:
      "Sua hidratação não pôde ser salva. Tente novamente.",

    notice:
      "As necessidades de hidratação variam. Siga orientação profissional se você tiver uma condição médica ou restrição de líquidos.",
  },

  ja: {
    wellness: "LEGATHON ウェルネス",
    hydrationCoach: "水分補給コーチ",

    todaysWater: "今日の水分量",
    ofGoal: "目標 {goal} oz",

    complete: "完了",
    remaining: "残り {amount} oz",
    goalReached: "目標達成",

    dailyGoalComplete: "今日の目標達成",
    dailyGoalCompleteMessage:
      "素晴らしいです。喉の渇きや活動量に合わせて水分補給を続けましょう。",

    almostThere: "あと少し",
    almostThereMessage:
      "水分補給目標までもう少しです。水を手元に置いておきましょう。",

    buildingMomentum: "順調です",
    buildingMomentumMessage:
      "良い進捗です。残りの時間も少しずつ水分を補給しましょう。",

    hydrationNeeded: "水分補給が必要です",
    hydrationNeededMessage:
      "まずコップ一杯の水を飲み、今日の摂取量を記録していきましょう。",

    addWater: "水分を追加",
    addWaterSubtitle:
      "今飲んだ水の量を選択してください。",

    removeEight: "8 oz 減らす",

    dailyGoal: "1日の目標",

    recovery: "リカバリー",
    aiWellness: "AIウェルネス",

    lastUpdated: "最終更新 {time}",
    noWaterToday: "今日はまだ水分が記録されていません",
    reset: "リセット",

    resetTitle: "今日の水分量をリセットしますか？",
    resetMessage:
      "今日の水分量だけがリセットされます。",
    cancel: "キャンセル",

    saveError: "保存エラー",
    saveErrorMessage:
      "水分データを保存できませんでした。もう一度お試しください。",

    notice:
      "必要な水分量には個人差があります。持病や水分制限がある場合は専門家の指示に従ってください。",
  },

  ko: {
    wellness: "LEGATHON 웰니스",
    hydrationCoach: "수분 섭취 코치",

    todaysWater: "오늘의 수분",
    ofGoal: "목표 {goal} oz 중",

    complete: "완료",
    remaining: "{amount} oz 남음",
    goalReached: "목표 달성",

    dailyGoalComplete: "일일 목표 완료",
    dailyGoalCompleteMessage:
      "훌륭합니다. 갈증과 활동량에 맞춰 계속 수분을 섭취하세요.",

    almostThere: "거의 다 왔어요",
    almostThereMessage:
      "수분 섭취 목표에 가까워졌습니다. 물을 가까이 두세요.",

    buildingMomentum: "좋은 진행",
    buildingMomentumMessage:
      "잘하고 있습니다. 남은 시간 동안 조금씩 물을 더 마셔보세요.",

    hydrationNeeded: "수분 섭취 필요",
    hydrationNeededMessage:
      "물 한 잔으로 시작하고 오늘의 섭취량을 계속 기록하세요.",

    addWater: "물 추가",
    addWaterSubtitle:
      "방금 마신 물의 양을 선택하세요.",

    removeEight: "8 oz 제거",

    dailyGoal: "일일 목표",

    recovery: "회복",
    aiWellness: "AI 웰니스",

    lastUpdated: "마지막 업데이트 {time}",
    noWaterToday: "오늘 기록된 물이 없습니다",
    reset: "초기화",

    resetTitle: "오늘의 물 섭취량을 초기화할까요?",
    resetMessage:
      "오늘의 수분 섭취량만 초기화됩니다.",
    cancel: "취소",

    saveError: "저장 오류",
    saveErrorMessage:
      "수분 데이터를 저장할 수 없습니다. 다시 시도하세요.",

    notice:
      "필요한 수분량은 사람마다 다릅니다. 질환이 있거나 수분 제한이 필요한 경우 전문가의 지침을 따르세요.",
  },

  zh: {
    wellness: "LEGATHON 健康",
    hydrationCoach: "补水教练",

    todaysWater: "今日饮水量",
    ofGoal: "目标 {goal} oz",

    complete: "完成",
    remaining: "还剩 {amount} oz",
    goalReached: "目标已达成",

    dailyGoalComplete: "每日目标完成",
    dailyGoalCompleteMessage:
      "做得很好。请根据口渴程度和活动量继续适量补水。",

    almostThere: "快完成了",
    almostThereMessage:
      "你已经接近补水目标，请把水放在身边。",

    buildingMomentum: "进展良好",
    buildingMomentumMessage:
      "进展不错。今天剩余时间继续逐步补充水分。",

    hydrationNeeded: "需要补水",
    hydrationNeededMessage:
      "先喝一杯水，并继续记录今天的饮水量。",

    addWater: "添加饮水",
    addWaterSubtitle:
      "选择你刚刚喝下的水量。",

    removeEight: "减少 8 oz",

    dailyGoal: "每日目标",

    recovery: "恢复",
    aiWellness: "AI 健康",

    lastUpdated: "最后更新 {time}",
    noWaterToday: "今天尚未记录饮水",
    reset: "重置",

    resetTitle: "重置今天的饮水量？",
    resetMessage:
      "这只会重置今天记录的饮水量。",
    cancel: "取消",

    saveError: "保存错误",
    saveErrorMessage:
      "无法保存你的饮水数据，请重试。",

    notice:
      "每个人的补水需求不同。如果你有医疗状况或需要限制液体摄入，请遵循专业人员的指导。",
  },

  it: {
    wellness: "BENESSERE LEGATHON",
    hydrationCoach: "Coach Idratazione",

    todaysWater: "ACQUA DI OGGI",
    ofGoal: "su un obiettivo di {goal} oz",

    complete: "completato",
    remaining: "{amount} oz rimanenti",
    goalReached: "Obiettivo raggiunto",

    dailyGoalComplete: "Obiettivo Giornaliero Completato",
    dailyGoalCompleteMessage:
      "Ottimo lavoro. Continua a bere in base alla sete e all’attività.",

    almostThere: "Ci Sei Quasi",
    almostThereMessage:
      "Sei vicino al tuo obiettivo di idratazione. Tieni l’acqua a portata di mano.",

    buildingMomentum: "Buon Progresso",
    buildingMomentumMessage:
      "Buon progresso. Continua a bere gradualmente durante il resto della giornata.",

    hydrationNeeded: "Idratazione Necessaria",
    hydrationNeededMessage:
      "Inizia con un bicchiere d’acqua e continua a registrare ciò che bevi oggi.",

    addWater: "Aggiungi Acqua",
    addWaterSubtitle:
      "Seleziona la quantità di acqua che hai appena bevuto.",

    removeEight: "Rimuovi 8 oz",

    dailyGoal: "Obiettivo Giornaliero",

    recovery: "Recupero",
    aiWellness: "Benessere IA",

    lastUpdated: "Ultimo aggiornamento {time}",
    noWaterToday: "Nessuna acqua registrata oggi",
    reset: "Reimposta",

    resetTitle: "Reimpostare l’acqua di oggi?",
    resetMessage:
      "Questo reimposta solo la quantità di acqua registrata oggi.",
    cancel: "Annulla",

    saveError: "Errore di Salvataggio",
    saveErrorMessage:
      "Non è stato possibile salvare l’idratazione. Riprova.",

    notice:
      "Le esigenze di idratazione variano. Segui le indicazioni di un professionista se hai una condizione medica o una restrizione dei liquidi.",
  },

  ar: {
    wellness: "LEGATHON للعافية",
    hydrationCoach: "مدرب الترطيب",

    todaysWater: "ماء اليوم",
    ofGoal: "من هدف {goal} oz",

    complete: "مكتمل",
    remaining: "متبقي {amount} oz",
    goalReached: "تم تحقيق الهدف",

    dailyGoalComplete: "اكتمل الهدف اليومي",
    dailyGoalCompleteMessage:
      "عمل ممتاز. استمر في شرب الماء وفقًا للعطش ومستوى النشاط.",

    almostThere: "اقتربت من الهدف",
    almostThereMessage:
      "أنت قريب من هدف الترطيب. احتفظ بالماء بالقرب منك.",

    buildingMomentum: "تقدم جيد",
    buildingMomentumMessage:
      "تقدم جيد. استمر في شرب الماء تدريجيًا خلال بقية اليوم.",

    hydrationNeeded: "تحتاج إلى الترطيب",
    hydrationNeededMessage:
      "ابدأ بكوب من الماء واستمر في تسجيل كمية الماء التي تشربها اليوم.",

    addWater: "إضافة ماء",
    addWaterSubtitle:
      "حدد كمية الماء التي شربتها للتو.",

    removeEight: "إزالة 8 oz",

    dailyGoal: "الهدف اليومي",

    recovery: "التعافي",
    aiWellness: "العافية بالذكاء الاصطناعي",

    lastUpdated: "آخر تحديث {time}",
    noWaterToday: "لم يتم تسجيل ماء اليوم",
    reset: "إعادة تعيين",

    resetTitle: "إعادة تعيين ماء اليوم؟",
    resetMessage:
      "سيؤدي هذا إلى إعادة تعيين كمية الماء المسجلة لليوم فقط.",
    cancel: "إلغاء",

    saveError: "خطأ في الحفظ",
    saveErrorMessage:
      "تعذر حفظ بيانات الترطيب. حاول مرة أخرى.",

    notice:
      "تختلف احتياجات الترطيب من شخص لآخر. اتبع الإرشادات المهنية إذا كانت لديك حالة طبية أو قيود على تناول السوائل.",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(
  language
) {
  const code =
    String(
      language || "en"
    )
      .trim()
      .toLowerCase()
      .split("-")[0];

  return HYDRATION_TRANSLATIONS[
    code
  ]
    ? code
    : "en";
}


function fillTemplate(
  text,
  variables = {}
) {
  let result =
    String(text || "");

  Object.entries(
    variables
  ).forEach(
    ([key, value]) => {
      result =
        result.replace(
          new RegExp(
            `\\{${key}\\}`,
            "g"
          ),
          String(value)
        );
    }
  );

  return result;
}


// ============================================================
// DATE
// ============================================================

function getTodayKey() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


// ============================================================
// SAFE JSON
// ============================================================

function safelyParseJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch {
    return fallback;
  }
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function HydrationCoachScreen({
  navigation,
  goBack,
  goToRecovery,
  goToAIWellness,
  language = "en",
}) {

  const languageCode =
    normalizeLanguage(
      language
    );

  const strings =
    HYDRATION_TRANSLATIONS[
      languageCode
    ] ||
    HYDRATION_TRANSLATIONS.en;


  function t(
    key,
    variables = {}
  ) {
    const value =
      strings?.[key] ??
      HYDRATION_TRANSLATIONS
        .en?.[key] ??
      key;

    return fillTemplate(
      value,
      variables
    );
  }


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    amount,
    setAmount,
  ] = useState(0);


  const [
    goal,
    setGoal,
  ] = useState(
    DEFAULT_GOAL
  );


  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progress =
    useMemo(
      () =>
        Math.min(
          100,
          Math.round(
            (
              amount /
              Math.max(
                goal,
                1
              )
            ) * 100
          )
        ),
      [
        amount,
        goal,
      ]
    );


  const remaining =
    Math.max(
      goal - amount,
      0
    );


  // ==========================================================
  // HYDRATION STATUS
  // ==========================================================

  const status =
    useMemo(
      () => {

        if (
          progress >= 100
        ) {
          return {
            title:
              t(
                "dailyGoalComplete"
              ),

            message:
              t(
                "dailyGoalCompleteMessage"
              ),

            color:
              "#42F58D",

            icon:
              "checkmark-circle",
          };
        }


        if (
          progress >= 75
        ) {
          return {
            title:
              t(
                "almostThere"
              ),

            message:
              t(
                "almostThereMessage"
              ),

            color:
              "#7EE8C4",

            icon:
              "water",
          };
        }


        if (
          progress >= 40
        ) {
          return {
            title:
              t(
                "buildingMomentum"
              ),

            message:
              t(
                "buildingMomentumMessage"
              ),

            color:
              "#49D8FF",

            icon:
              "water-outline",
          };
        }


        return {
          title:
            t(
              "hydrationNeeded"
            ),

          message:
            t(
              "hydrationNeededMessage"
            ),

          color:
            "#FFC94A",

          icon:
            "alert-circle",
        };

      },
      [
        progress,
        languageCode,
      ]
    );


  // ==========================================================
  // LOAD HYDRATION
  // ==========================================================

  useEffect(
    () => {

      const loadHydration =
        async () => {

          try {

            const saved =
              await AsyncStorage.getItem(
                "hydrationData"
              );


            const parsed =
              safelyParseJSON(
                saved,
                null
              );


            if (!parsed) {
              return;
            }


            const savedGoal =
              Math.max(
                1,
                Number(
                  parsed.goal ??
                  parsed.hydrationGoal ??
                  parsed.dailyGoal
                ) ||
                  DEFAULT_GOAL
              );


            setGoal(
              savedGoal
            );


            if (
              parsed.date ===
              getTodayKey()
            ) {

              const savedAmount =
                Math.max(
                  0,
                  Number(
                    parsed.amount ??
                    parsed.ounces ??
                    parsed.hydration ??
                    parsed.current ??
                    parsed.todayAmount
                  ) || 0
                );


              setAmount(
                savedAmount
              );


              setLastUpdated(
                parsed.timestamp ||
                ""
              );

            } else {

              setAmount(0);
            }

          } catch (error) {

            console.log(
              "Hydration load error:",
              error
            );
          }
        };


      loadHydration();

    },
    []
  );


  // ==========================================================
  // SAVE HYDRATION
  // ==========================================================

  const saveHydration =
    async (
      nextAmount = amount,
      nextGoal = goal
    ) => {

      if (isSaving) {
        return;
      }


      setIsSaving(
        true
      );


      try {

        const timestamp =
          new Date()
            .toISOString();


        const safeAmount =
          Math.max(
            0,
            Number(
              nextAmount
            ) || 0
          );


        const safeGoal =
          Math.max(
            1,
            Number(
              nextGoal
            ) ||
              DEFAULT_GOAL
          );


        const record = {
          amount:
            safeAmount,

          ounces:
            safeAmount,

          hydration:
            safeAmount,

          current:
            safeAmount,

          todayAmount:
            safeAmount,

          goal:
            safeGoal,

          hydrationGoal:
            safeGoal,

          dailyGoal:
            safeGoal,

          date:
            getTodayKey(),

          timestamp,
        };


        const serialized =
          JSON.stringify(
            record
          );


        await AsyncStorage.multiSet(
          HYDRATION_KEYS.map(
            (key) => [
              key,
              serialized,
            ]
          )
        );


        setLastUpdated(
          timestamp
        );

      } catch (error) {

        console.log(
          "Hydration save error:",
          error
        );


        Alert.alert(
          t("saveError"),
          t(
            "saveErrorMessage"
          )
        );

      } finally {

        setIsSaving(
          false
        );
      }
    };


  // ==========================================================
  // ADD WATER
  // ==========================================================

  const addWater =
    async (
      ounces
    ) => {

      const nextAmount =
        amount +
        ounces;


      setAmount(
        nextAmount
      );


      await saveHydration(
        nextAmount,
        goal
      );
    };


  // ==========================================================
  // REMOVE WATER
  // ==========================================================

  const removeWater =
    async () => {

      const nextAmount =
        Math.max(
          amount - 8,
          0
        );


      setAmount(
        nextAmount
      );


      await saveHydration(
        nextAmount,
        goal
      );
    };


  // ==========================================================
  // CHANGE GOAL
  // ==========================================================

  const changeGoal =
    async (
      nextGoal
    ) => {

      setGoal(
        nextGoal
      );


      await saveHydration(
        amount,
        nextGoal
      );
    };


  // ==========================================================
  // RESET TODAY
  // ==========================================================

  const resetToday =
    () => {

      Alert.alert(
        t(
          "resetTitle"
        ),

        t(
          "resetMessage"
        ),

        [
          {
            text:
              t(
                "cancel"
              ),

            style:
              "cancel",
          },

          {
            text:
              t(
                "reset"
              ),

            style:
              "destructive",

            onPress:
              async () => {

                setAmount(
                  0
                );


                await saveHydration(
                  0,
                  goal
                );
              },
          },
        ]
      );
    };


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    () => {

      if (
        typeof goBack ===
        "function"
      ) {
        goBack();
        return;
      }


      if (
        navigation
          ?.canGoBack?.()
      ) {
        navigation.goBack();
        return;
      }


      navigation
        ?.navigate?.(
          "AIWellness"
        );
    };


  // ==========================================================
  // TIME
  // ==========================================================

  const formattedTime =
    lastUpdated
      ? new Date(
          lastUpdated
        ).toLocaleTimeString(
          languageCode,
          {
            hour:
              "numeric",

            minute:
              "2-digit",
          }
        )
      : "";


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={
          styles.container
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
              HEADER
          ================================================== */}

          <View
            style={
              styles.header
            }
          >

            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={
                handleBack
              }
              activeOpacity={
                0.82
              }
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color="#FFC94A"
              />
            </TouchableOpacity>


            <View
              style={
                styles.headerCopy
              }
            >
              <Text
                style={
                  styles.eyebrow
                }
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
              >
                {t(
                  "wellness"
                )}
              </Text>


              <Text
                style={
                  styles.title
                }
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.72}
              >
                {t(
                  "hydrationCoach"
                )}
              </Text>
            </View>


            <View
              style={
                styles.headerIcon
              }
            >
              <Ionicons
                name="water"
                size={26}
                color="#49D8FF"
              />
            </View>

          </View>


          {/* ==================================================
              HYDRATION HERO
          ================================================== */}

          <LinearGradient
            colors={[
              "#0A2947",
              "#071C34",
              "#061326",
            ]}
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
                "todaysWater"
              )}
            </Text>


            <View
              style={
                styles.amountRow
              }
            >
              <Text
                style={
                  styles.amount
                }
              >
                {amount
                  .toLocaleString()}
              </Text>


              <Text
                style={
                  styles.unit
                }
              >
                oz
              </Text>
            </View>


            <Text
              style={
                styles.goalText
              }
            >
              {t(
                "ofGoal",
                {
                  goal:
                    goal.toLocaleString(),
                }
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
                      `${progress}%`,
                  },
                ]}
              />
            </View>


            <View
              style={
                styles.progressDetails
              }
            >
              <Text
                style={
                  styles.progressPercent
                }
              >
                {progress}%{" "}
                {t(
                  "complete"
                )}
              </Text>


              <Text
                style={
                  styles.remainingText
                }
              >
                {remaining > 0
                  ? t(
                      "remaining",
                      {
                        amount:
                          remaining.toLocaleString(),
                      }
                    )
                  : t(
                      "goalReached"
                    )}
              </Text>
            </View>


            <View
              style={
                styles.statusCard
              }
            >
              <Ionicons
                name={
                  status.icon
                }
                size={25}
                color={
                  status.color
                }
              />


              <View
                style={
                  styles.statusCopy
                }
              >
                <Text
                  style={[
                    styles.statusTitle,
                    {
                      color:
                        status.color,
                    },
                  ]}
                >
                  {status.title}
                </Text>


                <Text
                  style={
                    styles.statusMessage
                  }
                >
                  {status.message}
                </Text>
              </View>
            </View>

          </LinearGradient>


          {/* ==================================================
              ADD WATER
          ================================================== */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "addWater"
            )}
          </Text>


          <Text
            style={
              styles.sectionSubtitle
            }
          >
            {t(
              "addWaterSubtitle"
            )}
          </Text>


          <View
            style={
              styles.amountGrid
            }
          >
            {ADD_AMOUNTS.map(
              (
                ounces
              ) => (
                <TouchableOpacity
                  key={
                    ounces
                  }
                  style={
                    styles.amountButton
                  }
                  onPress={() =>
                    addWater(
                      ounces
                    )
                  }
                  disabled={
                    isSaving
                  }
                  activeOpacity={
                    0.82
                  }
                >
                  <Ionicons
                    name="add-circle"
                    size={22}
                    color="#49D8FF"
                  />


                  <Text
                    style={
                      styles.amountButtonText
                    }
                  >
                    +{ounces} oz
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>


          <TouchableOpacity
            style={[
              styles.undoButton,

              amount === 0 &&
                styles.disabledButton,
            ]}
            onPress={
              removeWater
            }
            disabled={
              isSaving ||
              amount === 0
            }
            activeOpacity={
              0.82
            }
          >
            <Ionicons
              name="remove-circle-outline"
              size={21}
              color="#FF8A98"
            />


            <Text
              style={
                styles.undoText
              }
            >
              {t(
                "removeEight"
              )}
            </Text>
          </TouchableOpacity>


          {/* ==================================================
              DAILY GOAL
          ================================================== */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "dailyGoal"
            )}
          </Text>


          <View
            style={
              styles.goalOptions
            }
          >
            {GOAL_OPTIONS.map(
              (
                option
              ) => {

                const selected =
                  option ===
                  goal;


                return (
                  <TouchableOpacity
                    key={
                      option
                    }
                    style={[
                      styles.goalButton,

                      selected &&
                        styles.goalButtonSelected,
                    ]}
                    onPress={() =>
                      changeGoal(
                        option
                      )
                    }
                    disabled={
                      isSaving
                    }
                    activeOpacity={
                      0.82
                    }
                  >
                    <Text
                      style={[
                        styles.goalButtonText,

                        selected &&
                          styles.goalButtonTextSelected,
                      ]}
                    >
                      {option} oz
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>


          {/* ==================================================
              WELLNESS TOOLS
          ================================================== */}

          <View
            style={
              styles.quickTools
            }
          >

            <TouchableOpacity
              style={[
                styles.toolButton,

                typeof goToRecovery !==
                  "function" &&
                  styles.toolButtonDisabled,
              ]}
              onPress={
                goToRecovery
              }
              disabled={
                typeof goToRecovery !==
                "function"
              }
              activeOpacity={
                0.82
              }
            >
              <Ionicons
                name="heart"
                size={22}
                color="#42F58D"
              />


              <Text
                style={
                  styles.toolText
                }
                numberOfLines={2}
              >
                {t(
                  "recovery"
                )}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[
                styles.toolButton,

                typeof goToAIWellness !==
                  "function" &&
                  styles.toolButtonDisabled,
              ]}
              onPress={
                goToAIWellness
              }
              disabled={
                typeof goToAIWellness !==
                "function"
              }
              activeOpacity={
                0.82
              }
            >
              <Ionicons
                name="sparkles"
                size={22}
                color="#FFC94A"
              />


              <Text
                style={
                  styles.toolText
                }
                numberOfLines={2}
              >
                {t(
                  "aiWellness"
                )}
              </Text>
            </TouchableOpacity>

          </View>


          {/* ==================================================
              LAST UPDATED
          ================================================== */}

          <View
            style={
              styles.updateCard
            }
          >
            <Ionicons
              name="time-outline"
              size={18}
              color="#8FA8C4"
            />


            <Text
              style={
                styles.updateText
              }
            >
              {lastUpdated
                ? t(
                    "lastUpdated",
                    {
                      time:
                        formattedTime,
                    }
                  )
                : t(
                    "noWaterToday"
                  )}
            </Text>


            <TouchableOpacity
              onPress={
                resetToday
              }
              activeOpacity={
                0.8
              }
            >
              <Text
                style={
                  styles.resetText
                }
              >
                {t(
                  "reset"
                )}
              </Text>
            </TouchableOpacity>
          </View>


          {/* ==================================================
              SAFETY NOTICE
          ================================================== */}

          <View
            style={
              styles.noticeCard
            }
          >
            <Ionicons
              name="information-circle"
              size={22}
              color="#73A8FF"
            />


            <Text
              style={
                styles.noticeText
              }
            >
              {t(
                "notice"
              )}
            </Text>
          </View>


          <View
            style={{
              height: 140,
            }}
          />

        </ScrollView>
      </LinearGradient>
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
        "#020611",
    },


    container: {
      flex: 1,
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 24,
    },


    backButton: {
      width: 46,
      height: 46,

      borderRadius: 23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#0B1C33",

      borderWidth: 1,

      borderColor:
        "#29496B",
    },


    headerCopy: {
      flex: 1,
      paddingHorizontal: 14,
    },


    eyebrow: {
      color:
        "#FFC94A",

      fontSize: 11,

      fontWeight:
        "900",

      letterSpacing: 2.7,

      marginBottom: 4,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize: 28,

      fontWeight:
        "900",
    },


    headerIcon: {
      width: 46,
      height: 46,

      borderRadius: 23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(73,216,255,0.12)",

      borderWidth: 1,

      borderColor:
        "rgba(73,216,255,0.4)",
    },


    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------

    heroCard: {
      borderRadius: 28,

      borderWidth: 1,

      borderColor:
        "#31577E",

      padding: 22,
    },


    heroLabel: {
      color:
        "#80E8FF",

      fontSize: 12,

      fontWeight:
        "900",

      letterSpacing: 2.5,
    },


    amountRow: {
      flexDirection:
        "row",

      alignItems:
        "flex-end",

      marginTop: 8,
    },


    amount: {
      color:
        "#FFFFFF",

      fontSize: 66,

      lineHeight: 72,

      fontWeight:
        "900",
    },


    unit: {
      color:
        "#49D8FF",

      fontSize: 22,

      fontWeight:
        "900",

      marginBottom: 10,

      marginLeft: 6,
    },


    goalText: {
      color:
        "#A9BCD2",

      fontSize: 16,

      fontWeight:
        "700",
    },


    progressTrack: {
      height: 13,

      borderRadius: 999,

      backgroundColor:
        "#173553",

      overflow:
        "hidden",

      marginTop: 22,
    },


    progressFill: {
      height:
        "100%",

      borderRadius: 999,

      backgroundColor:
        "#49D8FF",
    },


    progressDetails: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",

      marginTop: 10,

      gap: 10,
    },


    progressPercent: {
      flex: 1,

      color:
        "#FFFFFF",

      fontSize: 13,

      fontWeight:
        "900",
    },


    remainingText: {
      flex: 1,

      color:
        "#9EB4CE",

      fontSize: 13,

      fontWeight:
        "700",

      textAlign:
        "right",
    },


    statusCard: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      backgroundColor:
        "#07192D",

      borderRadius: 18,

      padding: 15,

      marginTop: 20,
    },


    statusCopy: {
      flex: 1,

      marginLeft: 11,
    },


    statusTitle: {
      fontSize: 17,

      fontWeight:
        "900",

      marginBottom: 4,
    },


    statusMessage: {
      color:
        "#B8C8DB",

      fontSize: 14,

      lineHeight: 20,

      fontWeight:
        "600",
    },


    // --------------------------------------------------------
    // SECTIONS
    // --------------------------------------------------------

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize: 26,

      fontWeight:
        "900",

      marginTop: 30,

      marginBottom: 7,
    },


    sectionSubtitle: {
      color:
        "#98ABC2",

      fontSize: 15,

      lineHeight: 22,

      fontWeight:
        "600",

      marginBottom: 15,
    },


    // --------------------------------------------------------
    // WATER BUTTONS
    // --------------------------------------------------------

    amountGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    amountButton: {
      width:
        "48.5%",

      minHeight: 64,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#08182C",

      borderWidth: 1,

      borderColor:
        "#2D577B",

      borderRadius: 19,

      marginBottom: 12,

      paddingHorizontal: 8,
    },


    amountButtonText: {
      color:
        "#EAF6FF",

      fontSize: 17,

      fontWeight:
        "900",

      marginLeft: 8,
    },


    undoButton: {
      minHeight: 52,

      borderRadius: 17,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,113,132,0.08)",

      borderWidth: 1,

      borderColor:
        "rgba(255,113,132,0.28)",
    },


    disabledButton: {
      opacity: 0.45,
    },


    undoText: {
      color:
        "#FF9AA7",

      fontSize: 15,

      fontWeight:
        "900",

      marginLeft: 7,
    },


    // --------------------------------------------------------
    // GOAL
    // --------------------------------------------------------

    goalOptions: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    goalButton: {
      width:
        "48.5%",

      minHeight: 54,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 17,

      backgroundColor:
        "#08182C",

      borderWidth: 1,

      borderColor:
        "#2D577B",

      marginBottom: 12,
    },


    goalButtonSelected: {
      backgroundColor:
        "#49D8FF",

      borderColor:
        "#49D8FF",
    },


    goalButtonText: {
      color:
        "#DCEBFA",

      fontSize: 16,

      fontWeight:
        "900",
    },


    goalButtonTextSelected: {
      color:
        "#02111F",
    },


    // --------------------------------------------------------
    // QUICK TOOLS
    // --------------------------------------------------------

    quickTools: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginTop: 14,
    },


    toolButton: {
      width:
        "48.5%",

      minHeight: 62,

      borderRadius: 19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#08182C",

      borderWidth: 1,

      borderColor:
        "#264666",

      paddingHorizontal: 8,
    },


    toolButtonDisabled: {
      opacity: 0.45,
    },


    toolText: {
      flexShrink: 1,

      color:
        "#EAF2FC",

      fontSize: 15,

      fontWeight:
        "900",

      marginLeft: 8,

      textAlign:
        "center",
    },


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    updateCard: {
      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 15,

      borderRadius: 17,

      backgroundColor:
        "#07192D",

      marginTop: 18,
    },


    updateText: {
      flex: 1,

      color:
        "#9EB4CE",

      fontSize: 13,

      fontWeight:
        "700",

      marginLeft: 8,

      marginRight: 8,
    },


    resetText: {
      color:
        "#FF8A98",

      fontSize: 13,

      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // NOTICE
    // --------------------------------------------------------

    noticeCard: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      padding: 16,

      borderRadius: 19,

      backgroundColor:
        "rgba(115,168,255,0.08)",

      borderWidth: 1,

      borderColor:
        "rgba(115,168,255,0.25)",

      marginTop: 18,
    },


    noticeText: {
      flex: 1,

      color:
        "#9EB4CE",

      fontSize: 12,

      lineHeight: 18,

      fontWeight:
        "600",

      marginLeft: 10,
    },

  });