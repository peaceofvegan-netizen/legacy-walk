// screens/SleepCoachScreen.js

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
// LEGATHON WALK — SLEEP COACH
// MULTILINGUAL
// ============================================================

const SLEEP_KEYS = [
  "sleepData",
  "dailySleep",
];

const SLEEP_GOAL = 8;


// ============================================================
// CANONICAL QUALITY VALUES
// IMPORTANT:
// These English values remain internal so changing language
// does not change saved sleep data.
// ============================================================

const QUALITY_OPTIONS = [
  {
    value: 1,
    label: "Poor",
    translationKey: "qualityPoor",
  },
  {
    value: 2,
    label: "Fair",
    translationKey: "qualityFair",
  },
  {
    value: 3,
    label: "Good",
    translationKey: "qualityGood",
  },
  {
    value: 4,
    label: "Very Good",
    translationKey: "qualityVeryGood",
  },
  {
    value: 5,
    label: "Excellent",
    translationKey: "qualityExcellent",
  },
];


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    wellness: "LEGATHON WELLNESS",
    sleepCoach: "Sleep Coach",

    lastNightsSleep: "LAST NIGHT’S SLEEP",

    restoredReady: "Restored and Ready",
    restoredMessage:
      "Your sleep check-in supports normal walking activity today.",

    goodFoundation: "Good Foundation",
    goodFoundationMessage:
      "Your sleep was solid. Maintain a comfortable pace and regular hydration.",

    takeItGently: "Take It Gently",
    takeItGentlyMessage:
      "Consider a lighter walk and an earlier wind-down tonight.",

    sleepRecoveryNeeded: "Sleep Recovery Needed",
    restRecommended: "Rest Recommended",
    recoveryMessage:
      "Prioritize rest and avoid pushing intensity when you feel unusually fatigued.",

    hoursSlept: "Hours Slept",
    adjustThirtyMinutes: "Adjust in 30-minute increments.",
    hours: "hours",

    sleepQuality: "Sleep Quality",

    qualityPoor: "Poor",
    qualityFair: "Fair",
    qualityGood: "Good",
    qualityVeryGood: "Very Good",
    qualityExcellent: "Excellent",

    nightInterruptions: "Night Interruptions",
    wakeQuestion: "How many times did you wake up?",

    morningReadiness: "Morning Readiness",
    morningReadinessQuestion:
      "How rested did you feel after waking?",

    savingSleep: "Saving Sleep...",
    saveSleep: "Save Sleep Check-In",

    sleepTools: "Sleep Tools",

    windDown: "Wind Down",
    calmBreathing: "Calm breathing",

    recovery: "Recovery",
    checkReadiness: "Check readiness",

    returnToAI: "Return to AI Wellness",

    lastUpdated: "Last updated {date}",
    noCheckIn: "No sleep check-in recorded today",

    notice:
      "This sleep check-in is informational and is not medical advice. Speak with a qualified professional about persistent sleep problems.",

    sleepRecorded: "Sleep Recorded",
    sleepRecordedMessage:
      "Your sleep score is {score}%. Your AI Wellness Coach can now use this check-in.",

    saveError: "Save Error",
    saveErrorMessage:
      "Your sleep check-in could not be saved. Please try again.",
  },


  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    wellness: "BIENESTAR LEGATHON",
    sleepCoach: "Coach de Sueño",

    lastNightsSleep: "SUEÑO DE ANOCHE",

    restoredReady: "Descansado y Listo",
    restoredMessage:
      "Tu registro de sueño permite una actividad normal de caminata hoy.",

    goodFoundation: "Buena Base",
    goodFoundationMessage:
      "Dormiste bien. Mantén un ritmo cómodo y una hidratación regular.",

    takeItGently: "Tómalo con Calma",
    takeItGentlyMessage:
      "Considera una caminata más ligera y comienza a relajarte más temprano esta noche.",

    sleepRecoveryNeeded: "Necesitas Recuperar Sueño",
    restRecommended: "Descanso Recomendado",
    recoveryMessage:
      "Prioriza el descanso y evita aumentar la intensidad si te sientes inusualmente fatigado.",

    hoursSlept: "Horas Dormidas",
    adjustThirtyMinutes: "Ajusta en incrementos de 30 minutos.",
    hours: "horas",

    sleepQuality: "Calidad del Sueño",

    qualityPoor: "Mala",
    qualityFair: "Regular",
    qualityGood: "Buena",
    qualityVeryGood: "Muy Buena",
    qualityExcellent: "Excelente",

    nightInterruptions: "Interrupciones Nocturnas",
    wakeQuestion: "¿Cuántas veces te despertaste?",

    morningReadiness: "Preparación Matutina",
    morningReadinessQuestion:
      "¿Qué tan descansado te sentiste al despertar?",

    savingSleep: "Guardando Sueño...",
    saveSleep: "Guardar Registro de Sueño",

    sleepTools: "Herramientas de Sueño",

    windDown: "Relajarse",
    calmBreathing: "Respiración calmada",

    recovery: "Recuperación",
    checkReadiness: "Revisar preparación",

    returnToAI: "Volver a Bienestar IA",

    lastUpdated: "Última actualización: {date}",
    noCheckIn: "No hay registro de sueño hoy",

    notice:
      "Este registro de sueño es informativo y no constituye asesoramiento médico. Consulta a un profesional cualificado si tienes problemas de sueño persistentes.",

    sleepRecorded: "Sueño Registrado",
    sleepRecordedMessage:
      "Tu puntuación de sueño es {score}%. Tu Coach de Bienestar IA ahora puede usar este registro.",

    saveError: "Error al Guardar",
    saveErrorMessage:
      "No se pudo guardar tu registro de sueño. Inténtalo de nuevo.",
  },


  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    wellness: "BIEN-ÊTRE LEGATHON",
    sleepCoach: "Coach Sommeil",

    lastNightsSleep: "SOMMEIL DE LA NUIT DERNIÈRE",

    restoredReady: "Reposé et Prêt",
    restoredMessage:
      "Votre suivi du sommeil permet une activité de marche normale aujourd’hui.",

    goodFoundation: "Bonne Base",
    goodFoundationMessage:
      "Votre sommeil était bon. Maintenez une allure confortable et une hydratation régulière.",

    takeItGently: "Allez-y Doucement",
    takeItGentlyMessage:
      "Envisagez une marche plus légère et commencez à vous détendre plus tôt ce soir.",

    sleepRecoveryNeeded: "Récupération de Sommeil Nécessaire",
    restRecommended: "Repos Recommandé",
    recoveryMessage:
      "Privilégiez le repos et évitez les efforts intenses si vous ressentez une fatigue inhabituelle.",

    hoursSlept: "Heures de Sommeil",
    adjustThirtyMinutes: "Ajustez par tranches de 30 minutes.",
    hours: "heures",

    sleepQuality: "Qualité du Sommeil",

    qualityPoor: "Mauvaise",
    qualityFair: "Moyenne",
    qualityGood: "Bonne",
    qualityVeryGood: "Très Bonne",
    qualityExcellent: "Excellente",

    nightInterruptions: "Réveils Nocturnes",
    wakeQuestion: "Combien de fois vous êtes-vous réveillé ?",

    morningReadiness: "État au Réveil",
    morningReadinessQuestion:
      "À quel point vous sentiez-vous reposé au réveil ?",

    savingSleep: "Enregistrement...",
    saveSleep: "Enregistrer le Sommeil",

    sleepTools: "Outils de Sommeil",

    windDown: "Se Détendre",
    calmBreathing: "Respiration calme",

    recovery: "Récupération",
    checkReadiness: "Vérifier l’état",

    returnToAI: "Retour au Bien-être IA",

    lastUpdated: "Dernière mise à jour : {date}",
    noCheckIn: "Aucun suivi du sommeil enregistré aujourd’hui",

    notice:
      "Ce suivi du sommeil est fourni à titre informatif et ne constitue pas un avis médical. Consultez un professionnel qualifié en cas de problèmes de sommeil persistants.",

    sleepRecorded: "Sommeil Enregistré",
    sleepRecordedMessage:
      "Votre score de sommeil est de {score} %. Votre Coach Bien-être IA peut maintenant utiliser ce suivi.",

    saveError: "Erreur d’Enregistrement",
    saveErrorMessage:
      "Votre suivi du sommeil n’a pas pu être enregistré. Veuillez réessayer.",
  },


  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    wellness: "LEGATHON WELLNESS",
    sleepCoach: "Schlaf-Coach",

    lastNightsSleep: "SCHLAF DER LETZTEN NACHT",

    restoredReady: "Erholt und Bereit",
    restoredMessage:
      "Dein Schlaf-Check-in unterstützt heute normale Gehaktivitäten.",

    goodFoundation: "Gute Grundlage",
    goodFoundationMessage:
      "Dein Schlaf war solide. Behalte ein angenehmes Tempo und regelmäßige Flüssigkeitszufuhr bei.",

    takeItGently: "Mach es Ruhiger",
    takeItGentlyMessage:
      "Erwäge heute einen leichteren Spaziergang und beginne am Abend früher mit dem Entspannen.",

    sleepRecoveryNeeded: "Schlaferholung Erforderlich",
    restRecommended: "Ruhe Empfohlen",
    recoveryMessage:
      "Priorisiere Erholung und vermeide hohe Intensität, wenn du dich ungewöhnlich müde fühlst.",

    hoursSlept: "Geschlafene Stunden",
    adjustThirtyMinutes: "In 30-Minuten-Schritten anpassen.",
    hours: "Stunden",

    sleepQuality: "Schlafqualität",

    qualityPoor: "Schlecht",
    qualityFair: "Ausreichend",
    qualityGood: "Gut",
    qualityVeryGood: "Sehr Gut",
    qualityExcellent: "Ausgezeichnet",

    nightInterruptions: "Nächtliche Unterbrechungen",
    wakeQuestion: "Wie oft bist du aufgewacht?",

    morningReadiness: "Morgendliche Bereitschaft",
    morningReadinessQuestion:
      "Wie ausgeruht hast du dich nach dem Aufwachen gefühlt?",

    savingSleep: "Schlaf wird gespeichert...",
    saveSleep: "Schlaf-Check-in Speichern",

    sleepTools: "Schlaf-Tools",

    windDown: "Entspannen",
    calmBreathing: "Ruhige Atmung",

    recovery: "Erholung",
    checkReadiness: "Bereitschaft prüfen",

    returnToAI: "Zurück zu AI Wellness",

    lastUpdated: "Zuletzt aktualisiert: {date}",
    noCheckIn: "Heute wurde noch kein Schlaf-Check-in gespeichert",

    notice:
      "Dieser Schlaf-Check-in dient nur zur Information und ist keine medizinische Beratung. Sprich bei anhaltenden Schlafproblemen mit einer qualifizierten Fachperson.",

    sleepRecorded: "Schlaf Gespeichert",
    sleepRecordedMessage:
      "Dein Schlafwert beträgt {score} %. Dein AI Wellness Coach kann diesen Check-in jetzt verwenden.",

    saveError: "Speicherfehler",
    saveErrorMessage:
      "Dein Schlaf-Check-in konnte nicht gespeichert werden. Bitte versuche es erneut.",
  },


  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    wellness: "BEM-ESTAR LEGATHON",
    sleepCoach: "Coach de Sono",

    lastNightsSleep: "SONO DA NOITE PASSADA",

    restoredReady: "Descansado e Pronto",
    restoredMessage:
      "Seu registro de sono permite uma atividade normal de caminhada hoje.",

    goodFoundation: "Boa Base",
    goodFoundationMessage:
      "Seu sono foi bom. Mantenha um ritmo confortável e hidratação regular.",

    takeItGently: "Vá com Calma",
    takeItGentlyMessage:
      "Considere uma caminhada mais leve e comece a relaxar mais cedo esta noite.",

    sleepRecoveryNeeded: "Recuperação do Sono Necessária",
    restRecommended: "Descanso Recomendado",
    recoveryMessage:
      "Priorize o descanso e evite aumentar a intensidade quando sentir fadiga incomum.",

    hoursSlept: "Horas Dormidas",
    adjustThirtyMinutes: "Ajuste em intervalos de 30 minutos.",
    hours: "horas",

    sleepQuality: "Qualidade do Sono",

    qualityPoor: "Ruim",
    qualityFair: "Regular",
    qualityGood: "Boa",
    qualityVeryGood: "Muito Boa",
    qualityExcellent: "Excelente",

    nightInterruptions: "Interrupções Noturnas",
    wakeQuestion: "Quantas vezes você acordou?",

    morningReadiness: "Disposição Matinal",
    morningReadinessQuestion:
      "Quão descansado você se sentiu ao acordar?",

    savingSleep: "Salvando Sono...",
    saveSleep: "Salvar Registro de Sono",

    sleepTools: "Ferramentas de Sono",

    windDown: "Relaxar",
    calmBreathing: "Respiração calma",

    recovery: "Recuperação",
    checkReadiness: "Verificar disposição",

    returnToAI: "Voltar ao Bem-estar IA",

    lastUpdated: "Última atualização: {date}",
    noCheckIn: "Nenhum registro de sono hoje",

    notice:
      "Este registro de sono é apenas informativo e não constitui aconselhamento médico. Procure um profissional qualificado em caso de problemas persistentes de sono.",

    sleepRecorded: "Sono Registrado",
    sleepRecordedMessage:
      "Sua pontuação de sono é {score}%. Seu Coach de Bem-estar IA agora pode usar este registro.",

    saveError: "Erro ao Salvar",
    saveErrorMessage:
      "Seu registro de sono não pôde ser salvo. Tente novamente.",
  },


  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    wellness: "LEGATHON ウェルネス",
    sleepCoach: "睡眠コーチ",

    lastNightsSleep: "昨夜の睡眠",

    restoredReady: "十分に回復しています",
    restoredMessage:
      "今日の通常のウォーキング活動に適した睡眠状態です。",

    goodFoundation: "良い睡眠状態",
    goodFoundationMessage:
      "しっかり眠れています。無理のないペースと定期的な水分補給を心がけましょう。",

    takeItGently: "今日は軽めに",
    takeItGentlyMessage:
      "軽めのウォーキングを検討し、今夜は少し早めにリラックスしましょう。",

    sleepRecoveryNeeded: "睡眠回復が必要です",
    restRecommended: "休息をおすすめします",
    recoveryMessage:
      "休息を優先し、強い疲労を感じる場合は運動強度を上げないようにしましょう。",

    hoursSlept: "睡眠時間",
    adjustThirtyMinutes: "30分単位で調整できます。",
    hours: "時間",

    sleepQuality: "睡眠の質",

    qualityPoor: "悪い",
    qualityFair: "普通",
    qualityGood: "良い",
    qualityVeryGood: "とても良い",
    qualityExcellent: "最高",

    nightInterruptions: "夜間の目覚め",
    wakeQuestion: "夜中に何回目が覚めましたか？",

    morningReadiness: "朝の回復度",
    morningReadinessQuestion:
      "起床時にどのくらい休めたと感じましたか？",

    savingSleep: "睡眠データを保存中...",
    saveSleep: "睡眠チェックインを保存",

    sleepTools: "睡眠ツール",

    windDown: "リラックス",
    calmBreathing: "穏やかな呼吸",

    recovery: "回復",
    checkReadiness: "回復度を確認",

    returnToAI: "AIウェルネスに戻る",

    lastUpdated: "最終更新：{date}",
    noCheckIn: "今日はまだ睡眠チェックインがありません",

    notice:
      "この睡眠チェックインは情報提供を目的としたもので、医療上の助言ではありません。睡眠の問題が続く場合は、資格を持つ専門家に相談してください。",

    sleepRecorded: "睡眠を記録しました",
    sleepRecordedMessage:
      "睡眠スコアは{score}%です。AIウェルネスコーチがこのチェックインを利用できるようになりました。",

    saveError: "保存エラー",
    saveErrorMessage:
      "睡眠チェックインを保存できませんでした。もう一度お試しください。",
  },


  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    wellness: "LEGATHON 웰니스",
    sleepCoach: "수면 코치",

    lastNightsSleep: "지난밤 수면",

    restoredReady: "회복 완료",
    restoredMessage:
      "오늘 일반적인 걷기 활동을 하기에 적절한 수면 상태입니다.",

    goodFoundation: "좋은 수면 상태",
    goodFoundationMessage:
      "수면 상태가 좋았습니다. 편안한 속도를 유지하고 규칙적으로 수분을 섭취하세요.",

    takeItGently: "가볍게 시작하세요",
    takeItGentlyMessage:
      "오늘은 가벼운 걷기를 고려하고 저녁에는 조금 일찍 휴식을 시작하세요.",

    sleepRecoveryNeeded: "수면 회복 필요",
    restRecommended: "휴식 권장",
    recoveryMessage:
      "휴식을 우선하고 평소보다 피곤하다면 운동 강도를 높이지 마세요.",

    hoursSlept: "수면 시간",
    adjustThirtyMinutes: "30분 단위로 조정하세요.",
    hours: "시간",

    sleepQuality: "수면의 질",

    qualityPoor: "나쁨",
    qualityFair: "보통",
    qualityGood: "좋음",
    qualityVeryGood: "매우 좋음",
    qualityExcellent: "최상",

    nightInterruptions: "야간 각성",
    wakeQuestion: "밤에 몇 번 깼나요?",

    morningReadiness: "아침 회복 상태",
    morningReadinessQuestion:
      "일어났을 때 얼마나 개운했나요?",

    savingSleep: "수면 저장 중...",
    saveSleep: "수면 체크인 저장",

    sleepTools: "수면 도구",

    windDown: "긴장 풀기",
    calmBreathing: "편안한 호흡",

    recovery: "회복",
    checkReadiness: "회복 상태 확인",

    returnToAI: "AI 웰니스로 돌아가기",

    lastUpdated: "마지막 업데이트: {date}",
    noCheckIn: "오늘 기록된 수면 체크인이 없습니다",

    notice:
      "이 수면 체크인은 정보 제공용이며 의료 조언이 아닙니다. 수면 문제가 지속되면 자격을 갖춘 전문가와 상담하세요.",

    sleepRecorded: "수면 기록 완료",
    sleepRecordedMessage:
      "수면 점수는 {score}%입니다. 이제 AI 웰니스 코치가 이 체크인을 활용할 수 있습니다.",

    saveError: "저장 오류",
    saveErrorMessage:
      "수면 체크인을 저장하지 못했습니다. 다시 시도해 주세요.",
  },


  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    wellness: "LEGATHON 健康",
    sleepCoach: "睡眠教练",

    lastNightsSleep: "昨晚睡眠",

    restoredReady: "恢复良好，准备就绪",
    restoredMessage:
      "你的睡眠状态支持今天进行正常的步行活动。",

    goodFoundation: "良好基础",
    goodFoundationMessage:
      "你的睡眠情况良好。保持舒适的步行速度并定期补充水分。",

    takeItGently: "今天轻松一点",
    takeItGentlyMessage:
      "可以考虑进行较轻松的步行，并在今晚早点开始放松。",

    sleepRecoveryNeeded: "需要睡眠恢复",
    restRecommended: "建议休息",
    recoveryMessage:
      "优先休息，如果感到异常疲劳，请避免增加活动强度。",

    hoursSlept: "睡眠时间",
    adjustThirtyMinutes: "以30分钟为单位调整。",
    hours: "小时",

    sleepQuality: "睡眠质量",

    qualityPoor: "较差",
    qualityFair: "一般",
    qualityGood: "良好",
    qualityVeryGood: "很好",
    qualityExcellent: "优秀",

    nightInterruptions: "夜间醒来",
    wakeQuestion: "你夜里醒了几次？",

    morningReadiness: "早晨恢复状态",
    morningReadinessQuestion:
      "醒来后你感觉休息得怎么样？",

    savingSleep: "正在保存睡眠...",
    saveSleep: "保存睡眠记录",

    sleepTools: "睡眠工具",

    windDown: "放松",
    calmBreathing: "平静呼吸",

    recovery: "恢复",
    checkReadiness: "检查恢复状态",

    returnToAI: "返回 AI 健康",

    lastUpdated: "最后更新：{date}",
    noCheckIn: "今天尚未记录睡眠",

    notice:
      "此睡眠记录仅供参考，不构成医疗建议。如果睡眠问题持续存在，请咨询合格的专业人士。",

    sleepRecorded: "睡眠已记录",
    sleepRecordedMessage:
      "你的睡眠评分为 {score}%。AI 健康教练现在可以使用这次记录。",

    saveError: "保存错误",
    saveErrorMessage:
      "无法保存睡眠记录。请重试。",
  },


  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    wellness: "BENESSERE LEGATHON",
    sleepCoach: "Coach del Sonno",

    lastNightsSleep: "SONNO DELLA SCORSA NOTTE",

    restoredReady: "Ripristinato e Pronto",
    restoredMessage:
      "Il tuo controllo del sonno supporta una normale attività di camminata oggi.",

    goodFoundation: "Buona Base",
    goodFoundationMessage:
      "Hai dormito bene. Mantieni un ritmo confortevole e un’idratazione regolare.",

    takeItGently: "Procedi con Calma",
    takeItGentlyMessage:
      "Considera una camminata più leggera e inizia a rilassarti prima questa sera.",

    sleepRecoveryNeeded: "Recupero del Sonno Necessario",
    restRecommended: "Riposo Consigliato",
    recoveryMessage:
      "Dai priorità al riposo ed evita di aumentare l’intensità se ti senti insolitamente affaticato.",

    hoursSlept: "Ore Dormite",
    adjustThirtyMinutes: "Regola a intervalli di 30 minuti.",
    hours: "ore",

    sleepQuality: "Qualità del Sonno",

    qualityPoor: "Scarsa",
    qualityFair: "Discreta",
    qualityGood: "Buona",
    qualityVeryGood: "Molto Buona",
    qualityExcellent: "Eccellente",

    nightInterruptions: "Interruzioni Notturne",
    wakeQuestion: "Quante volte ti sei svegliato?",

    morningReadiness: "Prontezza Mattutina",
    morningReadinessQuestion:
      "Quanto ti sei sentito riposato al risveglio?",

    savingSleep: "Salvataggio del Sonno...",
    saveSleep: "Salva Controllo del Sonno",

    sleepTools: "Strumenti per il Sonno",

    windDown: "Rilassati",
    calmBreathing: "Respirazione calma",

    recovery: "Recupero",
    checkReadiness: "Controlla la prontezza",

    returnToAI: "Torna al Benessere IA",

    lastUpdated: "Ultimo aggiornamento: {date}",
    noCheckIn: "Nessun controllo del sonno registrato oggi",

    notice:
      "Questo controllo del sonno è solo informativo e non costituisce un consiglio medico. Rivolgiti a un professionista qualificato per problemi di sonno persistenti.",

    sleepRecorded: "Sonno Registrato",
    sleepRecordedMessage:
      "Il tuo punteggio del sonno è {score}%. Il Coach Benessere IA può ora utilizzare questo controllo.",

    saveError: "Errore di Salvataggio",
    saveErrorMessage:
      "Non è stato possibile salvare il controllo del sonno. Riprova.",
  },


  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    wellness: "العافية من LEGATHON",
    sleepCoach: "مدرب النوم",

    lastNightsSleep: "نوم الليلة الماضية",

    restoredReady: "مستعد بعد الراحة",
    restoredMessage:
      "يشير تسجيل نومك إلى إمكانية ممارسة نشاط المشي المعتاد اليوم.",

    goodFoundation: "أساس جيد",
    goodFoundationMessage:
      "كان نومك جيدًا. حافظ على وتيرة مريحة واشرب الماء بانتظام.",

    takeItGently: "خذ الأمر بهدوء",
    takeItGentlyMessage:
      "فكر في مشي أخف اليوم وابدأ الاسترخاء مبكرًا هذا المساء.",

    sleepRecoveryNeeded: "تحتاج إلى استعادة النوم",
    restRecommended: "الراحة موصى بها",
    recoveryMessage:
      "أعطِ الأولوية للراحة وتجنب زيادة الشدة عندما تشعر بإرهاق غير معتاد.",

    hoursSlept: "ساعات النوم",
    adjustThirtyMinutes: "اضبط الوقت بزيادات قدرها 30 دقيقة.",
    hours: "ساعات",

    sleepQuality: "جودة النوم",

    qualityPoor: "ضعيفة",
    qualityFair: "مقبولة",
    qualityGood: "جيدة",
    qualityVeryGood: "جيدة جدًا",
    qualityExcellent: "ممتازة",

    nightInterruptions: "الاستيقاظ أثناء الليل",
    wakeQuestion: "كم مرة استيقظت أثناء الليل؟",

    morningReadiness: "الاستعداد الصباحي",
    morningReadinessQuestion:
      "ما مدى شعورك بالراحة بعد الاستيقاظ؟",

    savingSleep: "جارٍ حفظ النوم...",
    saveSleep: "حفظ تسجيل النوم",

    sleepTools: "أدوات النوم",

    windDown: "الاسترخاء",
    calmBreathing: "تنفس هادئ",

    recovery: "التعافي",
    checkReadiness: "تحقق من الاستعداد",

    returnToAI: "العودة إلى العافية بالذكاء الاصطناعي",

    lastUpdated: "آخر تحديث: {date}",
    noCheckIn: "لم يتم تسجيل النوم اليوم",

    notice:
      "هذا التسجيل الخاص بالنوم لأغراض معلوماتية فقط وليس نصيحة طبية. تحدث مع مختص مؤهل إذا استمرت مشكلات النوم.",

    sleepRecorded: "تم تسجيل النوم",
    sleepRecordedMessage:
      "درجة نومك هي {score}%. يمكن لمدرب العافية بالذكاء الاصطناعي الآن استخدام هذا التسجيل.",

    saveError: "خطأ في الحفظ",
    saveErrorMessage:
      "تعذر حفظ تسجيل النوم. يرجى المحاولة مرة أخرى.",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(
  language
) {
  const code = String(
    language || "en"
  )
    .toLowerCase()
    .split("-")[0];

  return TEXT[code]
    ? code
    : "en";
}


function fillTemplate(
  value,
  replacements = {}
) {
  let output = String(
    value || ""
  );

  Object.entries(
    replacements
  ).forEach(
    ([key, replacement]) => {
      output =
        output.replace(
          new RegExp(
            `\\{${key}\\}`,
            "g"
          ),
          String(
            replacement
          )
        );
    }
  );

  return output;
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
// JSON
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
// SLEEP SCORE
// ORIGINAL CALCULATION PRESERVED
// ============================================================

function calculateSleepScore(
  hours,
  quality,
  interruptions,
  rested
) {
  const durationScore =
    Math.max(
      0,
      100 -
        Math.abs(
          SLEEP_GOAL -
            hours
        ) *
          18
    );

  const qualityScore =
    ((quality - 1) / 4) *
    100;

  const interruptionScore =
    Math.max(
      0,
      100 -
        interruptions *
          22
    );

  const restedScore =
    ((rested - 1) / 4) *
    100;

  return Math.round(
    durationScore *
      0.4 +
      qualityScore *
        0.25 +
      interruptionScore *
        0.15 +
      restedScore *
        0.2
  );
}


// ============================================================
// CANONICAL STATUS
// Stored values remain English.
// Translation is display-only.
// ============================================================

function getSleepStatus(
  score,
  hours
) {
  if (score >= 85) {
    return {
      id: "restored",
      title:
        "Restored and Ready",
      color:
        "#42F58D",
      icon:
        "sunny",
    };
  }

  if (score >= 65) {
    return {
      id: "good",
      title:
        "Good Foundation",
      color:
        "#73A8FF",
      icon:
        "moon",
    };
  }

  if (score >= 45) {
    return {
      id: "gentle",
      title:
        "Take It Gently",
      color:
        "#FFC94A",
      icon:
        "cloudy-night",
    };
  }

  return {
    id:
      hours < 5
        ? "recovery"
        : "rest",

    title:
      hours < 5
        ? "Sleep Recovery Needed"
        : "Rest Recommended",

    color:
      "#FF7184",

    icon:
      "bed",
  };
}


// ============================================================
// STATUS TRANSLATION
// ============================================================

function getLocalizedStatus(
  status,
  t
) {
  switch (
    status.id
  ) {
    case "restored":
      return {
        title:
          t.restoredReady,
        message:
          t.restoredMessage,
      };

    case "good":
      return {
        title:
          t.goodFoundation,
        message:
          t.goodFoundationMessage,
      };

    case "gentle":
      return {
        title:
          t.takeItGently,
        message:
          t.takeItGentlyMessage,
      };

    case "recovery":
      return {
        title:
          t.sleepRecoveryNeeded,
        message:
          t.recoveryMessage,
      };

    default:
      return {
        title:
          t.restRecommended,
        message:
          t.recoveryMessage,
      };
  }
}


// ============================================================
// RATING ROW
// ============================================================

function RatingRow({
  title,
  subtitle,
  value,
  onChange,
  color = "#A978FF",
  isRTL = false,
}) {
  return (
    <View
      style={
        styles.ratingCard
      }
    >
      <Text
        style={[
          styles.ratingTitle,
          isRTL &&
            styles.rtlText,
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.ratingSubtitle,
          isRTL &&
            styles.rtlText,
        ]}
      >
        {subtitle}
      </Text>

      <View
        style={[
          styles.ratingButtons,
          isRTL &&
            styles.rowRTL,
        ]}
      >
        {[1, 2, 3, 4, 5].map(
          (number) => {
            const selected =
              number ===
              value;

            return (
              <TouchableOpacity
                key={number}
                style={[
                  styles.ratingButton,

                  selected && {
                    backgroundColor:
                      color,

                    borderColor:
                      color,
                  },
                ]}
                onPress={() =>
                  onChange(
                    number
                  )
                }
                accessibilityRole="button"
                accessibilityState={{
                  selected,
                }}
              >
                <Text
                  style={[
                    styles.ratingNumber,

                    selected &&
                      styles.ratingNumberSelected,
                  ]}
                >
                  {number}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function SleepCoachScreen({
  navigation,
  goBack,
  goToRecovery,
  goToBreathing,
  goToAIWellness,
  language = "en",
}) {
  const languageCode =
    normalizeLanguage(
      language
    );

  const t =
    TEXT[languageCode];

  const isRTL =
    languageCode ===
    "ar";


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    hours,
    setHours,
  ] = useState(7.5);

  const [
    quality,
    setQuality,
  ] = useState(3);

  const [
    interruptions,
    setInterruptions,
  ] = useState(0);

  const [
    rested,
    setRested,
  ] = useState(3);

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  // ==========================================================
  // SCORE
  // ==========================================================

  const sleepScore =
    useMemo(
      () =>
        calculateSleepScore(
          hours,
          quality,
          interruptions,
          rested
        ),
      [
        hours,
        quality,
        interruptions,
        rested,
      ]
    );


  const status =
    useMemo(
      () =>
        getSleepStatus(
          sleepScore,
          hours
        ),
      [
        sleepScore,
        hours,
      ]
    );


  const localizedStatus =
    useMemo(
      () =>
        getLocalizedStatus(
          status,
          t
        ),
      [
        status,
        t,
      ]
    );


  const durationProgress =
    Math.min(
      100,
      Math.round(
        (
          hours /
          SLEEP_GOAL
        ) *
          100
      )
    );


  // ==========================================================
  // LOAD TODAY'S SLEEP
  // ==========================================================

  useEffect(() => {
    const loadSleep =
      async () => {
        try {
          const saved =
            await AsyncStorage.getItem(
              "sleepData"
            );

          const parsed =
            safelyParseJSON(
              saved,
              null
            );

          if (
            !parsed ||
            parsed.date !==
              getTodayKey()
          ) {
            return;
          }

          setHours(
            Math.max(
              0,
              Math.min(
                16,
                Number(
                  parsed.hours
                ) || 0
              )
            )
          );

          setQuality(
            Math.max(
              1,
              Math.min(
                5,
                Number(
                  parsed.quality
                ) || 3
              )
            )
          );

          setInterruptions(
            Math.max(
              0,
              Math.min(
                10,
                Number(
                  parsed.interruptions
                ) || 0
              )
            )
          );

          setRested(
            Math.max(
              1,
              Math.min(
                5,
                Number(
                  parsed.rested
                ) || 3
              )
            )
          );

          setLastUpdated(
            parsed.timestamp ||
              ""
          );
        } catch (error) {
          console.log(
            "Sleep load error:",
            error
          );
        }
      };

    loadSleep();
  }, []);


  // ==========================================================
  // ADJUST HOURS
  // ==========================================================

  const adjustHours = (
    change
  ) => {
    setHours(
      (current) =>
        Math.max(
          0,
          Math.min(
            16,
            Math.round(
              (
                current +
                change
              ) *
                2
            ) /
              2
          )
        )
    );
  };


  // ==========================================================
  // SAVE
  // ==========================================================

  const saveSleep =
    async () => {
      if (isSaving) {
        return;
      }

      setIsSaving(
        true
      );

      try {
        const timestamp =
          new Date().toISOString();

        const selectedQuality =
          QUALITY_OPTIONS.find(
            (item) =>
              item.value ===
              quality
          )?.label ||
          "Good";


        // ====================================================
        // IMPORTANT:
        // Stored data stays canonical English/internal.
        // ====================================================

        const record = {
          hours,

          sleepHours:
            hours,

          goal:
            SLEEP_GOAL,

          sleepGoal:
            SLEEP_GOAL,

          quality,

          qualityLabel:
            selectedQuality,

          interruptions,

          rested,

          score:
            sleepScore,

          sleepScore,

          status:
            status.title,

          statusId:
            status.id,

          date:
            getTodayKey(),

          timestamp,
        };


        const serialized =
          JSON.stringify(
            record
          );


        await AsyncStorage.multiSet(
          SLEEP_KEYS.map(
            (key) => [
              key,
              serialized,
            ]
          )
        );


        setLastUpdated(
          timestamp
        );


        Alert.alert(
          t.sleepRecorded,

          fillTemplate(
            t.sleepRecordedMessage,
            {
              score:
                sleepScore,
            }
          )
        );
      } catch (error) {
        console.log(
          "Sleep save error:",
          error
        );

        Alert.alert(
          t.saveError,
          t.saveErrorMessage
        );
      } finally {
        setIsSaving(
          false
        );
      }
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
        navigation?.canGoBack?.()
      ) {
        navigation.goBack();
        return;
      }

      navigation?.navigate?.(
        "AIWellness"
      );
    };


  // ==========================================================
  // DATE DISPLAY
  // ==========================================================

  const formattedLastUpdated =
    useMemo(
      () => {
        if (
          !lastUpdated
        ) {
          return "";
        }

        try {
          return new Date(
            lastUpdated
          ).toLocaleString(
            languageCode
          );
        } catch {
          return new Date(
            lastUpdated
          ).toLocaleString();
        }
      },
      [
        lastUpdated,
        languageCode,
      ]
    );


  // ==========================================================
  // SCREEN
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
          "#10112E",
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
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <View
            style={[
              styles.header,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={
                handleBack
              }
              accessibilityRole="button"
            >
              <Ionicons
                name={
                  isRTL
                    ? "chevron-forward"
                    : "chevron-back"
                }
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
                style={[
                  styles.eyebrow,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.wellness}
              </Text>

              <Text
                style={[
                  styles.title,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.sleepCoach}
              </Text>
            </View>

            <View
              style={
                styles.headerIcon
              }
            >
              <Ionicons
                name="moon"
                size={25}
                color="#A978FF"
              />
            </View>
          </View>


          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <LinearGradient
            colors={[
              "#1A1847",
              "#101B3A",
              "#071326",
            ]}
            style={
              styles.heroCard
            }
          >
            <View
              style={[
                styles.scoreHeader,

                isRTL &&
                  styles.rowRTL,
              ]}
            >
              <View
                style={[
                  styles.scoreCopy,

                  isRTL &&
                    styles.scoreCopyRTL,
                ]}
              >
                <Text
                  style={[
                    styles.heroLabel,

                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {t.lastNightsSleep}
                </Text>

                <Text
                  style={[
                    styles.statusTitle,

                    {
                      color:
                        status.color,
                    },

                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {
                    localizedStatus.title
                  }
                </Text>
              </View>

              <View
                style={[
                  styles.scoreCircle,

                  {
                    borderColor:
                      status.color,
                  },
                ]}
              >
                <Text
                  style={
                    styles.scoreNumber
                  }
                >
                  {sleepScore}
                </Text>

                <Text
                  style={
                    styles.percent
                  }
                >
                  %
                </Text>
              </View>
            </View>

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
                      `${durationProgress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.heroMessage,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {
                localizedStatus.message
              }
            </Text>
          </LinearGradient>


          {/* ================================================= */}
          {/* HOURS */}
          {/* ================================================= */}

          <Text
            style={[
              styles.sectionTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t.hoursSlept}
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {
              t.adjustThirtyMinutes
            }
          </Text>

          <View
            style={[
              styles.hoursCard,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <TouchableOpacity
              style={
                styles.adjustButton
              }
              onPress={() =>
                adjustHours(
                  -0.5
                )
              }
            >
              <Ionicons
                name="remove"
                size={28}
                color="#DDE8F7"
              />
            </TouchableOpacity>

            <View
              style={
                styles.hoursCenter
              }
            >
              <Text
                style={
                  styles.hoursNumber
                }
              >
                {hours.toFixed(
                  1
                )}
              </Text>

              <Text
                style={[
                  styles.hoursLabel,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.hours}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.adjustButton
              }
              onPress={() =>
                adjustHours(
                  0.5
                )
              }
            >
              <Ionicons
                name="add"
                size={28}
                color="#DDE8F7"
              />
            </TouchableOpacity>
          </View>


          {/* ================================================= */}
          {/* QUALITY */}
          {/* ================================================= */}

          <Text
            style={[
              styles.sectionTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t.sleepQuality}
          </Text>

          <View
            style={[
              styles.qualityGrid,

              isRTL &&
                styles.wrapRTL,
            ]}
          >
            {QUALITY_OPTIONS.map(
              (option) => {
                const selected =
                  option.value ===
                  quality;

                return (
                  <TouchableOpacity
                    key={
                      option.value
                    }
                    style={[
                      styles.qualityButton,

                      selected &&
                        styles.qualityButtonSelected,
                    ]}
                    onPress={() =>
                      setQuality(
                        option.value
                      )
                    }
                    accessibilityRole="button"
                    accessibilityState={{
                      selected,
                    }}
                  >
                    <Text
                      style={[
                        styles.qualityText,

                        selected &&
                          styles.qualityTextSelected,

                        isRTL &&
                          styles.rtlCenterText,
                      ]}
                    >
                      {
                        t[
                          option
                            .translationKey
                        ]
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>


          {/* ================================================= */}
          {/* INTERRUPTIONS */}
          {/* ================================================= */}

          <View
            style={[
              styles.interruptionCard,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <View
              style={[
                styles.interruptionCopy,

                isRTL &&
                  styles.interruptionCopyRTL,
              ]}
            >
              <Text
                style={[
                  styles.interruptionTitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {
                  t.nightInterruptions
                }
              </Text>

              <Text
                style={[
                  styles.interruptionSubtitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.wakeQuestion}
              </Text>
            </View>

            <View
              style={[
                styles.counterRow,

                isRTL &&
                  styles.rowRTL,
              ]}
            >
              <TouchableOpacity
                style={
                  styles.counterButton
                }
                onPress={() =>
                  setInterruptions(
                    (current) =>
                      Math.max(
                        0,
                        current -
                          1
                      )
                  )
                }
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color="#DDE8F7"
                />
              </TouchableOpacity>

              <Text
                style={
                  styles.counterNumber
                }
              >
                {interruptions}
              </Text>

              <TouchableOpacity
                style={
                  styles.counterButton
                }
                onPress={() =>
                  setInterruptions(
                    (current) =>
                      Math.min(
                        10,
                        current +
                          1
                      )
                  )
                }
              >
                <Ionicons
                  name="add"
                  size={22}
                  color="#DDE8F7"
                />
              </TouchableOpacity>
            </View>
          </View>


          {/* ================================================= */}
          {/* MORNING READINESS */}
          {/* ================================================= */}

          <RatingRow
            title={
              t.morningReadiness
            }
            subtitle={
              t.morningReadinessQuestion
            }
            value={
              rested
            }
            onChange={
              setRested
            }
            isRTL={
              isRTL
            }
          />


          {/* ================================================= */}
          {/* SAVE */}
          {/* ================================================= */}

          <TouchableOpacity
            style={[
              styles.saveButton,

              isSaving &&
                styles.disabledButton,

              isRTL &&
                styles.rowRTL,
            ]}
            onPress={
              saveSleep
            }
            disabled={
              isSaving
            }
          >
            <Ionicons
              name={
                isSaving
                  ? "hourglass"
                  : "checkmark-circle"
              }
              size={23}
              color="#07101F"
            />

            <Text
              style={[
                styles.saveButtonText,

                isRTL &&
                  styles.saveButtonTextRTL,
              ]}
            >
              {isSaving
                ? t.savingSleep
                : t.saveSleep}
            </Text>
          </TouchableOpacity>


          {/* ================================================= */}
          {/* SLEEP TOOLS */}
          {/* ================================================= */}

          <Text
            style={[
              styles.sectionTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t.sleepTools}
          </Text>

          <View
            style={[
              styles.toolsRow,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <TouchableOpacity
              style={
                styles.toolCard
              }
              onPress={
                goToBreathing
              }
              disabled={
                typeof goToBreathing !==
                "function"
              }
            >
              <Ionicons
                name="leaf"
                size={25}
                color="#42F58D"
              />

              <Text
                style={[
                  styles.toolTitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.windDown}
              </Text>

              <Text
                style={[
                  styles.toolSubtitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {
                  t.calmBreathing
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.toolCard
              }
              onPress={
                goToRecovery
              }
              disabled={
                typeof goToRecovery !==
                "function"
              }
            >
              <Ionicons
                name="heart"
                size={25}
                color="#FF7184"
              />

              <Text
                style={[
                  styles.toolTitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t.recovery}
              </Text>

              <Text
                style={[
                  styles.toolSubtitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {
                  t.checkReadiness
                }
              </Text>
            </TouchableOpacity>
          </View>


          {/* ================================================= */}
          {/* AI WELLNESS */}
          {/* ================================================= */}

          <TouchableOpacity
            style={[
              styles.aiButton,

              isRTL &&
                styles.rowRTL,
            ]}
            onPress={
              goToAIWellness
            }
            disabled={
              typeof goToAIWellness !==
              "function"
            }
          >
            <Ionicons
              name="sparkles"
              size={22}
              color="#FFC94A"
            />

            <Text
              style={[
                styles.aiButtonText,

                isRTL &&
                  styles.aiButtonTextRTL,
              ]}
            >
              {t.returnToAI}
            </Text>

            <Ionicons
              name={
                isRTL
                  ? "chevron-back"
                  : "chevron-forward"
              }
              size={20}
              color="#FFC94A"
            />
          </TouchableOpacity>


          {/* ================================================= */}
          {/* LAST UPDATED */}
          {/* ================================================= */}

          <View
            style={[
              styles.lastUpdatedCard,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color="#8FA8C4"
            />

            <Text
              style={[
                styles.lastUpdatedText,

                isRTL &&
                  styles.lastUpdatedTextRTL,
              ]}
            >
              {lastUpdated
                ? fillTemplate(
                    t.lastUpdated,
                    {
                      date:
                        formattedLastUpdated,
                    }
                  )
                : t.noCheckIn}
            </Text>
          </View>


          {/* ================================================= */}
          {/* NOTICE */}
          {/* ================================================= */}

          <View
            style={[
              styles.noticeCard,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <Ionicons
              name="information-circle"
              size={22}
              color="#73A8FF"
            />

            <Text
              style={[
                styles.noticeText,

                isRTL &&
                  styles.noticeTextRTL,
              ]}
            >
              {t.notice}
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

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
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
      color: "#FFC94A",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2.7,
      marginBottom: 4,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
    },

    headerIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "rgba(169,120,255,0.14)",
      borderWidth: 1,
      borderColor:
        "rgba(169,120,255,0.42)",
    },

    heroCard: {
      borderRadius: 28,
      padding: 22,
      borderWidth: 1,
      borderColor:
        "#514589",
    },

    scoreHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    scoreCopy: {
      flex: 1,
      paddingRight: 12,
    },

    scoreCopyRTL: {
      paddingRight: 0,
      paddingLeft: 12,
    },

    heroLabel: {
      color: "#C2A8FF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2.4,
    },

    statusTitle: {
      fontSize: 23,
      fontWeight: "900",
      marginTop: 8,
    },

    scoreCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#081126",
    },

    scoreNumber: {
      color: "#FFFFFF",
      fontSize: 31,
      fontWeight: "900",
    },

    percent: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 11,
    },

    progressTrack: {
      height: 11,
      borderRadius: 999,
      backgroundColor:
        "#252A52",
      overflow: "hidden",
      marginTop: 22,
    },

    progressFill: {
      height: "100%",
      backgroundColor:
        "#A978FF",
      borderRadius: 999,
    },

    heroMessage: {
      color: "#C0CAE0",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "600",
      marginTop: 17,
    },

    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 30,
      marginBottom: 7,
    },

    sectionSubtitle: {
      color: "#98ABC2",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "600",
      marginBottom: 15,
    },

    hoursCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 24,
      padding: 18,
    },

    adjustButton: {
      width: 55,
      height: 55,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#19284A",
      borderWidth: 1,
      borderColor:
        "#4B5986",
    },

    hoursCenter: {
      alignItems: "center",
    },

    hoursNumber: {
      color: "#FFFFFF",
      fontSize: 45,
      fontWeight: "900",
    },

    hoursLabel: {
      color: "#A978FF",
      fontSize: 15,
      fontWeight: "900",
    },

    qualityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    qualityButton: {
      width: "48.5%",
      minHeight: 54,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      marginBottom: 12,
      paddingHorizontal: 8,
    },

    qualityButtonSelected: {
      backgroundColor:
        "#A978FF",
      borderColor:
        "#A978FF",
    },

    qualityText: {
      color: "#DCE5F4",
      fontSize: 15,
      fontWeight: "900",
      textAlign: "center",
    },

    qualityTextSelected: {
      color: "#07101F",
    },

    interruptionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 22,
      padding: 17,
      marginTop: 4,
    },

    interruptionCopy: {
      flex: 1,
      paddingRight: 12,
    },

    interruptionCopyRTL: {
      paddingRight: 0,
      paddingLeft: 12,
    },

    interruptionTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    interruptionSubtitle: {
      color: "#98ABC2",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
      marginTop: 3,
    },

    counterRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    counterButton: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#19284A",
    },

    counterNumber: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "900",
      minWidth: 38,
      textAlign: "center",
    },

    ratingCard: {
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
      borderRadius: 22,
      padding: 17,
      marginTop: 14,
    },

    ratingTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    ratingSubtitle: {
      color: "#98ABC2",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
      marginTop: 3,
    },

    ratingButtons: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 16,
    },

    ratingButton: {
      width: 47,
      height: 43,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#19284A",
      borderWidth: 1,
      borderColor:
        "#4B5986",
    },

    ratingNumber: {
      color: "#DCE5F4",
      fontSize: 17,
      fontWeight: "900",
    },

    ratingNumberSelected: {
      color: "#07101F",
    },

    saveButton: {
      minHeight: 60,
      borderRadius: 999,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#FFC94A",
      marginTop: 18,
      paddingHorizontal: 18,
    },

    disabledButton: {
      opacity: 0.55,
    },

    saveButtonText: {
      color: "#07101F",
      fontSize: 17,
      fontWeight: "900",
      marginLeft: 9,
      textAlign: "center",
    },

    saveButtonTextRTL: {
      marginLeft: 0,
      marginRight: 9,
      writingDirection: "rtl",
    },

    toolsRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
    },

    toolCard: {
      width: "48.5%",
      minHeight: 116,
      borderRadius: 20,
      padding: 16,
      backgroundColor:
        "#0B1730",
      borderWidth: 1,
      borderColor:
        "#3F4876",
    },

    toolTitle: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 13,
    },

    toolSubtitle: {
      color: "#98ABC2",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
    },

    aiButton: {
      minHeight: 58,
      borderRadius: 19,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      backgroundColor:
        "#101B34",
      borderWidth: 1,
      borderColor:
        "#514589",
      marginTop: 14,
    },

    aiButtonText: {
      flex: 1,
      color: "#EAF1FB",
      fontSize: 16,
      fontWeight: "900",
      marginLeft: 10,
    },

    aiButtonTextRTL: {
      marginLeft: 0,
      marginRight: 10,
      writingDirection: "rtl",
      textAlign: "right",
    },

    lastUpdatedCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#071426",
      borderRadius: 17,
      padding: 15,
      marginTop: 16,
    },

    lastUpdatedText: {
      flex: 1,
      color: "#8FA8C4",
      fontSize: 12,
      fontWeight: "700",
      marginLeft: 8,
    },

    lastUpdatedTextRTL: {
      marginLeft: 0,
      marginRight: 8,
      textAlign: "right",
      writingDirection: "rtl",
    },

    noticeCard: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      padding: 16,
      borderRadius: 19,
      backgroundColor:
        "rgba(115,168,255,0.08)",
      borderWidth: 1,
      borderColor:
        "rgba(115,168,255,0.25)",
      marginTop: 16,
    },

    noticeText: {
      flex: 1,
      color: "#9EB4CE",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600",
      marginLeft: 10,
    },

    noticeTextRTL: {
      marginLeft: 0,
      marginRight: 10,
      textAlign: "right",
      writingDirection: "rtl",
    },

    // ========================================================
    // RTL
    // ========================================================

    rtlText: {
      textAlign: "right",
      writingDirection: "rtl",
    },

    rtlCenterText: {
      textAlign: "center",
      writingDirection: "rtl",
    },

    rowRTL: {
      flexDirection:
        "row-reverse",
    },

    wrapRTL: {
      flexDirection:
        "row-reverse",
    },
  });