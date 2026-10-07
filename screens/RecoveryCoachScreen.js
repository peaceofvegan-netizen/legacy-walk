// screens/RecoveryCoachScreen.js

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
// STORAGE
// ============================================================

const RECOVERY_KEYS = [
  "recoveryData",
  "dailyRecovery",
];

// ============================================================
// DEFAULT CHECK-IN
// ============================================================

const INITIAL_CHECK_IN = {
  energy: 3,
  soreness: 2,
  stress: 2,
  sleep: 3,
  hydration: 3,
};

// ============================================================
// CHECK-IN CONFIG
// ============================================================

const CHECK_IN_ITEMS = [
  {
    key: "energy",
    icon: "flash",
    color: "#FFC94A",
  },
  {
    key: "soreness",
    icon: "body",
    color: "#FF7184",
  },
  {
    key: "stress",
    icon: "pulse",
    color: "#A978FF",
  },
  {
    key: "sleep",
    icon: "moon",
    color: "#73A8FF",
  },
  {
    key: "hydration",
    icon: "water",
    color: "#49D8FF",
  },
];

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    wellness: "LEGATHON WELLNESS",
    recoveryCoach: "Recovery Coach",

    todaysRecovery: "TODAY’S RECOVERY",

    readyPerform: "Ready to Perform",
    readyBalance: "Ready With Balance",
    recoveryRecommended: "Recovery Recommended",
    restRestore: "Rest and Restore",

    strongWalk: "Strong Walk",
    moderateWalk: "Moderate Walk",
    lightRecoveryWalk: "Light Recovery Walk",
    restLightMovement: "Rest or Very Light Movement",

    strongMessage:
      "Your recovery indicators look strong. You can choose a challenging walk while maintaining good form and hydration.",

    moderateMessage:
      "You appear ready for steady movement. Keep the pace comfortable and reassess if soreness or fatigue increases.",

    recoveryMessage:
      "Keep today gentle. Try a short walk, hydrate, and give your body extra time to recover.",

    restMessage:
      "Your check-in suggests a recovery day. Prioritize rest, hydration, nutrition, and sleep before increasing intensity.",

    lastCheckIn: "Last check-in: {time}",
    notRecorded: "Not recorded yet",

    howFeel: "How Do You Feel?",
    rateAreas:
      "Rate each area from 1 to 5. Your answers calculate today’s recovery readiness.",

    energy: "Energy",
    energySubtitle: "How energized do you feel?",
    energyLow: "Low",
    energyHigh: "High",

    soreness: "Muscle Soreness",
    sorenessSubtitle: "How sore does your body feel?",
    sorenessLow: "None",
    sorenessHigh: "Severe",

    stress: "Stress",
    stressSubtitle: "How mentally stressed do you feel?",
    stressLow: "Calm",
    stressHigh: "High",

    sleep: "Sleep Quality",
    sleepSubtitle: "How restorative was your sleep?",
    sleepLow: "Poor",
    sleepHigh: "Great",

    hydration: "Hydration",
    hydrationSubtitle: "How hydrated do you feel?",
    hydrationLow: "Low",
    hydrationHigh: "Great",

    ratingAccessibility: "{title} {rating} out of 5",

    saving: "Saving Check-In...",
    saveCheckIn: "Save Recovery Check-In",

    recoveryTools: "Recovery Tools",
    calmBreathing: "Calm Breathing",
    hydrationTool: "Hydration",
    sleepCoach: "Sleep Coach",
    walkingData: "Walking Data",

    recordedTitle: "Recovery Recorded",
    recordedMessage:
      "Your recovery score is {score}%. Your AI Wellness Coach can now use this check-in.",

    saveError: "Save Error",
    saveErrorMessage:
      "Your recovery check-in could not be saved. Please try again.",

    notice:
      "This wellness check-in is informational and is not medical advice. Stop exercising and seek professional care for concerning symptoms.",

    backAccessibility: "Back to AI Wellness",
  },

  es: {
    wellness: "BIENESTAR LEGATHON",
    recoveryCoach: "Guía de recuperación",

    todaysRecovery: "RECUPERACIÓN DE HOY",

    readyPerform: "Listo para rendir",
    readyBalance: "Listo con equilibrio",
    recoveryRecommended: "Recuperación recomendada",
    restRestore: "Descansa y recupérate",

    strongWalk: "Caminata intensa",
    moderateWalk: "Caminata moderada",
    lightRecoveryWalk: "Caminata ligera de recuperación",
    restLightMovement: "Descanso o movimiento muy ligero",

    strongMessage:
      "Tus indicadores de recuperación se ven fuertes. Puedes elegir una caminata más exigente manteniendo una buena técnica e hidratación.",

    moderateMessage:
      "Parece que estás listo para un movimiento constante. Mantén un ritmo cómodo y vuelve a evaluar si aumenta el dolor o la fatiga.",

    recoveryMessage:
      "Tómatelo con calma hoy. Prueba una caminata corta, hidrátate y dale a tu cuerpo más tiempo para recuperarse.",

    restMessage:
      "Tu registro sugiere un día de recuperación. Prioriza el descanso, la hidratación, la nutrición y el sueño antes de aumentar la intensidad.",

    lastCheckIn: "Último registro: {time}",
    notRecorded: "Aún no registrado",

    howFeel: "¿Cómo te sientes?",
    rateAreas:
      "Califica cada área del 1 al 5. Tus respuestas calculan tu nivel de recuperación de hoy.",

    energy: "Energía",
    energySubtitle: "¿Qué tan lleno de energía te sientes?",
    energyLow: "Baja",
    energyHigh: "Alta",

    soreness: "Dolor muscular",
    sorenessSubtitle: "¿Qué tan adolorido se siente tu cuerpo?",
    sorenessLow: "Ninguno",
    sorenessHigh: "Intenso",

    stress: "Estrés",
    stressSubtitle: "¿Qué tan estresado mentalmente te sientes?",
    stressLow: "Calma",
    stressHigh: "Alto",

    sleep: "Calidad del sueño",
    sleepSubtitle: "¿Qué tan reparador fue tu sueño?",
    sleepLow: "Mala",
    sleepHigh: "Excelente",

    hydration: "Hidratación",
    hydrationSubtitle: "¿Qué tan hidratado te sientes?",
    hydrationLow: "Baja",
    hydrationHigh: "Excelente",

    ratingAccessibility: "{title} {rating} de 5",

    saving: "Guardando registro...",
    saveCheckIn: "Guardar registro de recuperación",

    recoveryTools: "Herramientas de recuperación",
    calmBreathing: "Respiración tranquila",
    hydrationTool: "Hidratación",
    sleepCoach: "Guía del sueño",
    walkingData: "Datos de caminata",

    recordedTitle: "Recuperación registrada",
    recordedMessage:
      "Tu puntuación de recuperación es {score}%. Tu guía de bienestar con IA ahora puede usar este registro.",

    saveError: "Error al guardar",
    saveErrorMessage:
      "No se pudo guardar tu registro de recuperación. Inténtalo de nuevo.",

    notice:
      "Este registro de bienestar es informativo y no constituye asesoramiento médico. Deja de hacer ejercicio y busca atención profesional si presentas síntomas preocupantes.",

    backAccessibility: "Volver a Bienestar con IA",
  },

  fr: {
    wellness: "BIEN-ÊTRE LEGATHON",
    recoveryCoach: "Coach de récupération",

    todaysRecovery: "RÉCUPÉRATION DU JOUR",

    readyPerform: "Prêt à performer",
    readyBalance: "Prêt avec équilibre",
    recoveryRecommended: "Récupération recommandée",
    restRestore: "Repos et récupération",

    strongWalk: "Marche soutenue",
    moderateWalk: "Marche modérée",
    lightRecoveryWalk: "Marche légère de récupération",
    restLightMovement: "Repos ou mouvement très léger",

    strongMessage:
      "Vos indicateurs de récupération sont bons. Vous pouvez choisir une marche plus exigeante tout en maintenant une bonne posture et une bonne hydratation.",

    moderateMessage:
      "Vous semblez prêt pour une activité régulière. Gardez un rythme confortable et réévaluez si les douleurs ou la fatigue augmentent.",

    recoveryMessage:
      "Allez-y doucement aujourd’hui. Faites une courte marche, hydratez-vous et accordez plus de temps à votre corps pour récupérer.",

    restMessage:
      "Votre bilan suggère une journée de récupération. Privilégiez le repos, l’hydratation, la nutrition et le sommeil avant d’augmenter l’intensité.",

    lastCheckIn: "Dernier bilan : {time}",
    notRecorded: "Pas encore enregistré",

    howFeel: "Comment vous sentez-vous ?",
    rateAreas:
      "Évaluez chaque domaine de 1 à 5. Vos réponses permettent de calculer votre niveau de récupération aujourd’hui.",

    energy: "Énergie",
    energySubtitle: "Quel est votre niveau d’énergie ?",
    energyLow: "Faible",
    energyHigh: "Élevé",

    soreness: "Douleurs musculaires",
    sorenessSubtitle: "À quel point votre corps est-il courbaturé ?",
    sorenessLow: "Aucune",
    sorenessHigh: "Forte",

    stress: "Stress",
    stressSubtitle: "Quel est votre niveau de stress mental ?",
    stressLow: "Calme",
    stressHigh: "Élevé",

    sleep: "Qualité du sommeil",
    sleepSubtitle: "Votre sommeil a-t-il été réparateur ?",
    sleepLow: "Mauvaise",
    sleepHigh: "Excellente",

    hydration: "Hydratation",
    hydrationSubtitle: "À quel point vous sentez-vous hydraté ?",
    hydrationLow: "Faible",
    hydrationHigh: "Excellente",

    ratingAccessibility: "{title} {rating} sur 5",

    saving: "Enregistrement...",
    saveCheckIn: "Enregistrer le bilan",

    recoveryTools: "Outils de récupération",
    calmBreathing: "Respiration calme",
    hydrationTool: "Hydratation",
    sleepCoach: "Coach du sommeil",
    walkingData: "Données de marche",

    recordedTitle: "Récupération enregistrée",
    recordedMessage:
      "Votre score de récupération est de {score} %. Votre coach bien-être IA peut maintenant utiliser ce bilan.",

    saveError: "Erreur d’enregistrement",
    saveErrorMessage:
      "Votre bilan de récupération n’a pas pu être enregistré. Réessayez.",

    notice:
      "Ce bilan de bien-être est fourni à titre informatif et ne constitue pas un avis médical. Arrêtez l’exercice et consultez un professionnel en cas de symptômes préoccupants.",

    backAccessibility: "Retour au bien-être IA",
  },

  de: {
    wellness: "LEGATHON WELLNESS",
    recoveryCoach: "Erholungs-Coach",

    todaysRecovery: "HEUTIGE ERHOLUNG",

    readyPerform: "Bereit für Leistung",
    readyBalance: "Ausgeglichen bereit",
    recoveryRecommended: "Erholung empfohlen",
    restRestore: "Ruhen und erholen",

    strongWalk: "Intensiver Spaziergang",
    moderateWalk: "Moderater Spaziergang",
    lightRecoveryWalk: "Leichter Erholungsspaziergang",
    restLightMovement: "Ruhe oder sehr leichte Bewegung",

    strongMessage:
      "Deine Erholungswerte sehen gut aus. Du kannst einen anspruchsvolleren Spaziergang wählen und dabei auf gute Form und ausreichende Flüssigkeitszufuhr achten.",

    moderateMessage:
      "Du scheinst für gleichmäßige Bewegung bereit zu sein. Halte das Tempo angenehm und passe es an, wenn Schmerzen oder Müdigkeit zunehmen.",

    recoveryMessage:
      "Gehe es heute ruhig an. Mache einen kurzen Spaziergang, trinke ausreichend und gib deinem Körper mehr Zeit zur Erholung.",

    restMessage:
      "Dein Check-in deutet auf einen Erholungstag hin. Priorisiere Ruhe, Flüssigkeit, Ernährung und Schlaf, bevor du die Intensität erhöhst.",

    lastCheckIn: "Letzter Check-in: {time}",
    notRecorded: "Noch nicht erfasst",

    howFeel: "Wie fühlst du dich?",
    rateAreas:
      "Bewerte jeden Bereich von 1 bis 5. Deine Antworten bestimmen deine heutige Erholungsbereitschaft.",

    energy: "Energie",
    energySubtitle: "Wie energiegeladen fühlst du dich?",
    energyLow: "Niedrig",
    energyHigh: "Hoch",

    soreness: "Muskelkater",
    sorenessSubtitle: "Wie stark fühlt sich dein Körper beansprucht an?",
    sorenessLow: "Keiner",
    sorenessHigh: "Stark",

    stress: "Stress",
    stressSubtitle: "Wie gestresst fühlst du dich mental?",
    stressLow: "Ruhig",
    stressHigh: "Hoch",

    sleep: "Schlafqualität",
    sleepSubtitle: "Wie erholsam war dein Schlaf?",
    sleepLow: "Schlecht",
    sleepHigh: "Sehr gut",

    hydration: "Flüssigkeit",
    hydrationSubtitle: "Wie gut hydriert fühlst du dich?",
    hydrationLow: "Niedrig",
    hydrationHigh: "Sehr gut",

    ratingAccessibility: "{title} {rating} von 5",

    saving: "Check-in wird gespeichert...",
    saveCheckIn: "Erholungs-Check-in speichern",

    recoveryTools: "Erholungswerkzeuge",
    calmBreathing: "Ruhiges Atmen",
    hydrationTool: "Flüssigkeit",
    sleepCoach: "Schlaf-Coach",
    walkingData: "Gehedaten",

    recordedTitle: "Erholung gespeichert",
    recordedMessage:
      "Dein Erholungswert beträgt {score} %. Dein KI-Wellness-Coach kann diesen Check-in jetzt verwenden.",

    saveError: "Speicherfehler",
    saveErrorMessage:
      "Dein Erholungs-Check-in konnte nicht gespeichert werden. Versuche es erneut.",

    notice:
      "Dieser Wellness-Check-in dient nur zur Information und ist keine medizinische Beratung. Beende das Training und hole professionelle Hilfe bei besorgniserregenden Symptomen.",

    backAccessibility: "Zurück zu KI-Wellness",
  },

  pt: {
    wellness: "BEM-ESTAR LEGATHON",
    recoveryCoach: "Coach de recuperação",

    todaysRecovery: "RECUPERAÇÃO DE HOJE",

    readyPerform: "Pronto para o desempenho",
    readyBalance: "Pronto com equilíbrio",
    recoveryRecommended: "Recuperação recomendada",
    restRestore: "Descanse e recupere",

    strongWalk: "Caminhada intensa",
    moderateWalk: "Caminhada moderada",
    lightRecoveryWalk: "Caminhada leve de recuperação",
    restLightMovement: "Descanso ou movimento muito leve",

    strongMessage:
      "Seus indicadores de recuperação estão bons. Você pode escolher uma caminhada mais desafiadora mantendo boa postura e hidratação.",

    moderateMessage:
      "Você parece pronto para um movimento constante. Mantenha um ritmo confortável e reavalie se a dor ou o cansaço aumentarem.",

    recoveryMessage:
      "Pegue leve hoje. Faça uma caminhada curta, hidrate-se e dê mais tempo para o corpo se recuperar.",

    restMessage:
      "Seu check-in sugere um dia de recuperação. Priorize descanso, hidratação, nutrição e sono antes de aumentar a intensidade.",

    lastCheckIn: "Último check-in: {time}",
    notRecorded: "Ainda não registrado",

    howFeel: "Como você se sente?",
    rateAreas:
      "Avalie cada área de 1 a 5. Suas respostas calculam sua prontidão de recuperação de hoje.",

    energy: "Energia",
    energySubtitle: "Quanta energia você sente?",
    energyLow: "Baixa",
    energyHigh: "Alta",

    soreness: "Dor muscular",
    sorenessSubtitle: "Quanto seu corpo está dolorido?",
    sorenessLow: "Nenhuma",
    sorenessHigh: "Intensa",

    stress: "Estresse",
    stressSubtitle: "Quanto estresse mental você sente?",
    stressLow: "Calmo",
    stressHigh: "Alto",

    sleep: "Qualidade do sono",
    sleepSubtitle: "Quão restaurador foi seu sono?",
    sleepLow: "Ruim",
    sleepHigh: "Ótima",

    hydration: "Hidratação",
    hydrationSubtitle: "Quão hidratado você se sente?",
    hydrationLow: "Baixa",
    hydrationHigh: "Ótima",

    ratingAccessibility: "{title} {rating} de 5",

    saving: "Salvando check-in...",
    saveCheckIn: "Salvar check-in de recuperação",

    recoveryTools: "Ferramentas de recuperação",
    calmBreathing: "Respiração calma",
    hydrationTool: "Hidratação",
    sleepCoach: "Coach do sono",
    walkingData: "Dados de caminhada",

    recordedTitle: "Recuperação registrada",
    recordedMessage:
      "Sua pontuação de recuperação é {score}%. Seu Coach de Bem-Estar com IA agora pode usar este check-in.",

    saveError: "Erro ao salvar",
    saveErrorMessage:
      "Não foi possível salvar seu check-in de recuperação. Tente novamente.",

    notice:
      "Este check-in de bem-estar é apenas informativo e não constitui orientação médica. Pare de se exercitar e procure atendimento profissional se apresentar sintomas preocupantes.",

    backAccessibility: "Voltar ao Bem-Estar com IA",
  },

  ja: {
    wellness: "LEGATHON ウェルネス",
    recoveryCoach: "リカバリーコーチ",

    todaysRecovery: "今日の回復状態",

    readyPerform: "高い運動準備度",
    readyBalance: "バランス良好",
    recoveryRecommended: "回復を優先",
    restRestore: "休息と回復",

    strongWalk: "しっかり歩く",
    moderateWalk: "適度なウォーキング",
    lightRecoveryWalk: "軽いリカバリーウォーク",
    restLightMovement: "休息または非常に軽い運動",

    strongMessage:
      "回復状態は良好です。フォームと水分補給を意識しながら、少し負荷の高いウォーキングを選べます。",

    moderateMessage:
      "安定した運動を行える状態です。無理のないペースを保ち、筋肉痛や疲労が増えた場合は調整してください。",

    recoveryMessage:
      "今日は軽めにしましょう。短いウォーキングと水分補給を行い、体に十分な回復時間を与えてください。",

    restMessage:
      "今日のチェックインでは回復日が推奨されます。運動強度を上げる前に、休息、水分、栄養、睡眠を優先してください。",

    lastCheckIn: "最終チェックイン: {time}",
    notRecorded: "まだ記録されていません",

    howFeel: "今日の体調は？",
    rateAreas:
      "各項目を1〜5で評価してください。回答から今日の回復状態を計算します。",

    energy: "エネルギー",
    energySubtitle: "どのくらい元気に感じますか？",
    energyLow: "低い",
    energyHigh: "高い",

    soreness: "筋肉痛",
    sorenessSubtitle: "体の筋肉痛はどの程度ですか？",
    sorenessLow: "なし",
    sorenessHigh: "強い",

    stress: "ストレス",
    stressSubtitle: "精神的なストレスはどの程度ですか？",
    stressLow: "穏やか",
    stressHigh: "高い",

    sleep: "睡眠の質",
    sleepSubtitle: "睡眠でどの程度回復できましたか？",
    sleepLow: "悪い",
    sleepHigh: "良い",

    hydration: "水分状態",
    hydrationSubtitle: "どのくらい水分が足りていると感じますか？",
    hydrationLow: "低い",
    hydrationHigh: "良い",

    ratingAccessibility: "{title} 5段階中{rating}",

    saving: "チェックインを保存中...",
    saveCheckIn: "回復チェックインを保存",

    recoveryTools: "回復ツール",
    calmBreathing: "リラックス呼吸",
    hydrationTool: "水分補給",
    sleepCoach: "睡眠コーチ",
    walkingData: "ウォーキングデータ",

    recordedTitle: "回復状態を記録しました",
    recordedMessage:
      "回復スコアは{score}%です。AIウェルネスコーチがこのチェックインを利用できるようになりました。",

    saveError: "保存エラー",
    saveErrorMessage:
      "回復チェックインを保存できませんでした。もう一度お試しください。",

    notice:
      "このウェルネスチェックインは情報提供を目的としており、医療上の助言ではありません。気になる症状がある場合は運動を中止し、専門家に相談してください。",

    backAccessibility: "AIウェルネスに戻る",
  },

  ko: {
    wellness: "LEGATHON 웰니스",
    recoveryCoach: "회복 코치",

    todaysRecovery: "오늘의 회복 상태",

    readyPerform: "활동 준비 완료",
    readyBalance: "균형 있게 준비됨",
    recoveryRecommended: "회복 권장",
    restRestore: "휴식과 회복",

    strongWalk: "강도 높은 걷기",
    moderateWalk: "보통 강도 걷기",
    lightRecoveryWalk: "가벼운 회복 걷기",
    restLightMovement: "휴식 또는 매우 가벼운 움직임",

    strongMessage:
      "회복 지표가 좋습니다. 올바른 자세와 수분 섭취를 유지하면서 조금 더 도전적인 걷기를 선택할 수 있습니다.",

    moderateMessage:
      "꾸준한 움직임을 할 준비가 된 것으로 보입니다. 편안한 속도를 유지하고 통증이나 피로가 증가하면 다시 조절하세요.",

    recoveryMessage:
      "오늘은 가볍게 움직이세요. 짧게 걷고 수분을 섭취하며 몸이 회복할 시간을 더 주세요.",

    restMessage:
      "오늘은 회복일이 적합해 보입니다. 강도를 높이기 전에 휴식, 수분, 영양 및 수면을 우선하세요.",

    lastCheckIn: "마지막 체크인: {time}",
    notRecorded: "아직 기록되지 않음",

    howFeel: "오늘 기분은 어떤가요?",
    rateAreas:
      "각 항목을 1에서 5까지 평가하세요. 답변을 바탕으로 오늘의 회복 준비도를 계산합니다.",

    energy: "에너지",
    energySubtitle: "얼마나 활력이 있다고 느끼나요?",
    energyLow: "낮음",
    energyHigh: "높음",

    soreness: "근육통",
    sorenessSubtitle: "몸의 근육통이 어느 정도인가요?",
    sorenessLow: "없음",
    sorenessHigh: "심함",

    stress: "스트레스",
    stressSubtitle: "정신적인 스트레스가 어느 정도인가요?",
    stressLow: "편안함",
    stressHigh: "높음",

    sleep: "수면의 질",
    sleepSubtitle: "수면이 얼마나 회복에 도움이 되었나요?",
    sleepLow: "나쁨",
    sleepHigh: "좋음",

    hydration: "수분 상태",
    hydrationSubtitle: "몸에 수분이 충분하다고 느끼나요?",
    hydrationLow: "낮음",
    hydrationHigh: "좋음",

    ratingAccessibility: "{title} 5점 중 {rating}점",

    saving: "체크인 저장 중...",
    saveCheckIn: "회복 체크인 저장",

    recoveryTools: "회복 도구",
    calmBreathing: "편안한 호흡",
    hydrationTool: "수분 섭취",
    sleepCoach: "수면 코치",
    walkingData: "걷기 데이터",

    recordedTitle: "회복 상태 기록 완료",
    recordedMessage:
      "회복 점수는 {score}%입니다. 이제 AI 웰니스 코치가 이 체크인을 활용할 수 있습니다.",

    saveError: "저장 오류",
    saveErrorMessage:
      "회복 체크인을 저장할 수 없습니다. 다시 시도하세요.",

    notice:
      "이 웰니스 체크인은 정보 제공용이며 의료 조언이 아닙니다. 우려되는 증상이 있으면 운동을 중단하고 전문적인 진료를 받으세요.",

    backAccessibility: "AI 웰니스로 돌아가기",
  },

  zh: {
    wellness: "LEGATHON 健康",
    recoveryCoach: "恢复教练",

    todaysRecovery: "今日恢复状态",

    readyPerform: "状态良好",
    readyBalance: "平衡状态良好",
    recoveryRecommended: "建议恢复",
    restRestore: "休息与恢复",

    strongWalk: "较强强度步行",
    moderateWalk: "中等强度步行",
    lightRecoveryWalk: "轻度恢复步行",
    restLightMovement: "休息或非常轻度活动",

    strongMessage:
      "你的恢复指标表现良好。保持正确姿势和充足补水的同时，可以选择更有挑战性的步行。",

    moderateMessage:
      "你目前适合进行稳定的活动。保持舒适的速度，如果酸痛或疲劳增加，请重新调整强度。",

    recoveryMessage:
      "今天请保持轻松。可以短距离步行、补充水分，并给身体更多恢复时间。",

    restMessage:
      "你的签到结果表明今天更适合作为恢复日。在提高运动强度前，请优先保证休息、补水、营养和睡眠。",

    lastCheckIn: "上次签到：{time}",
    notRecorded: "尚未记录",

    howFeel: "你感觉怎么样？",
    rateAreas:
      "请为每个项目按1到5评分。你的回答将用于计算今天的恢复准备度。",

    energy: "精力",
    energySubtitle: "你感觉有多少精力？",
    energyLow: "低",
    energyHigh: "高",

    soreness: "肌肉酸痛",
    sorenessSubtitle: "你的身体感觉有多酸痛？",
    sorenessLow: "没有",
    sorenessHigh: "严重",

    stress: "压力",
    stressSubtitle: "你感觉精神压力有多大？",
    stressLow: "平静",
    stressHigh: "高",

    sleep: "睡眠质量",
    sleepSubtitle: "你的睡眠恢复效果如何？",
    sleepLow: "较差",
    sleepHigh: "很好",

    hydration: "补水状态",
    hydrationSubtitle: "你感觉身体的水分是否充足？",
    hydrationLow: "低",
    hydrationHigh: "很好",

    ratingAccessibility: "{title}，5分中的{rating}分",

    saving: "正在保存签到...",
    saveCheckIn: "保存恢复签到",

    recoveryTools: "恢复工具",
    calmBreathing: "平静呼吸",
    hydrationTool: "补水",
    sleepCoach: "睡眠教练",
    walkingData: "步行数据",

    recordedTitle: "恢复状态已记录",
    recordedMessage:
      "你的恢复分数为{score}%。AI健康教练现在可以使用本次签到数据。",

    saveError: "保存错误",
    saveErrorMessage:
      "无法保存你的恢复签到。请重试。",

    notice:
      "此健康签到仅供参考，不属于医疗建议。如出现令人担忧的症状，请停止运动并寻求专业医疗帮助。",

    backAccessibility: "返回AI健康",
  },

  it: {
    wellness: "BENESSERE LEGATHON",
    recoveryCoach: "Coach del recupero",

    todaysRecovery: "RECUPERO DI OGGI",

    readyPerform: "Pronto per l’attività",
    readyBalance: "Pronto con equilibrio",
    recoveryRecommended: "Recupero consigliato",
    restRestore: "Riposo e recupero",

    strongWalk: "Camminata intensa",
    moderateWalk: "Camminata moderata",
    lightRecoveryWalk: "Camminata leggera di recupero",
    restLightMovement: "Riposo o movimento molto leggero",

    strongMessage:
      "I tuoi indicatori di recupero sono buoni. Puoi scegliere una camminata più impegnativa mantenendo una buona postura e una corretta idratazione.",

    moderateMessage:
      "Sembri pronto per un movimento costante. Mantieni un ritmo confortevole e rivaluta se aumentano indolenzimento o stanchezza.",

    recoveryMessage:
      "Oggi procedi con calma. Prova una breve camminata, idratati e concedi al corpo più tempo per recuperare.",

    restMessage:
      "Il tuo check-in suggerisce una giornata di recupero. Dai priorità a riposo, idratazione, alimentazione e sonno prima di aumentare l’intensità.",

    lastCheckIn: "Ultimo check-in: {time}",
    notRecorded: "Non ancora registrato",

    howFeel: "Come ti senti?",
    rateAreas:
      "Valuta ogni area da 1 a 5. Le tue risposte calcolano il livello di recupero di oggi.",

    energy: "Energia",
    energySubtitle: "Quanto ti senti energico?",
    energyLow: "Bassa",
    energyHigh: "Alta",

    soreness: "Indolenzimento muscolare",
    sorenessSubtitle: "Quanto senti il corpo indolenzito?",
    sorenessLow: "Nessuno",
    sorenessHigh: "Forte",

    stress: "Stress",
    stressSubtitle: "Quanto stress mentale senti?",
    stressLow: "Calmo",
    stressHigh: "Alto",

    sleep: "Qualità del sonno",
    sleepSubtitle: "Quanto è stato rigenerante il tuo sonno?",
    sleepLow: "Scarsa",
    sleepHigh: "Ottima",

    hydration: "Idratazione",
    hydrationSubtitle: "Quanto ti senti idratato?",
    hydrationLow: "Bassa",
    hydrationHigh: "Ottima",

    ratingAccessibility: "{title} {rating} su 5",

    saving: "Salvataggio check-in...",
    saveCheckIn: "Salva check-in di recupero",

    recoveryTools: "Strumenti di recupero",
    calmBreathing: "Respirazione calma",
    hydrationTool: "Idratazione",
    sleepCoach: "Coach del sonno",
    walkingData: "Dati di camminata",

    recordedTitle: "Recupero registrato",
    recordedMessage:
      "Il tuo punteggio di recupero è {score}%. Il tuo coach di benessere IA può ora utilizzare questo check-in.",

    saveError: "Errore di salvataggio",
    saveErrorMessage:
      "Non è stato possibile salvare il check-in di recupero. Riprova.",

    notice:
      "Questo check-in sul benessere è solo informativo e non costituisce un consiglio medico. Interrompi l’attività fisica e rivolgiti a un professionista in caso di sintomi preoccupanti.",

    backAccessibility: "Torna al Benessere IA",
  },

  ar: {
    wellness: "LEGATHON للعافية",
    recoveryCoach: "مدرب التعافي",

    todaysRecovery: "تعافي اليوم",

    readyPerform: "جاهز للأداء",
    readyBalance: "جاهز بتوازن",
    recoveryRecommended: "يوصى بالتعافي",
    restRestore: "الراحة والاستشفاء",

    strongWalk: "مشي قوي",
    moderateWalk: "مشي معتدل",
    lightRecoveryWalk: "مشي خفيف للتعافي",
    restLightMovement: "راحة أو حركة خفيفة جدًا",

    strongMessage:
      "مؤشرات التعافي لديك تبدو جيدة. يمكنك اختيار مشي أكثر تحديًا مع الحفاظ على الوضعية الجيدة والترطيب.",

    moderateMessage:
      "يبدو أنك مستعد لحركة منتظمة. حافظ على وتيرة مريحة وأعد التقييم إذا زاد الألم أو التعب.",

    recoveryMessage:
      "اجعل نشاط اليوم خفيفًا. جرّب مشيًا قصيرًا واشرب الماء وامنح جسمك وقتًا إضافيًا للتعافي.",

    restMessage:
      "يشير تسجيلك إلى أن اليوم مناسب للتعافي. أعطِ الأولوية للراحة والترطيب والتغذية والنوم قبل زيادة شدة النشاط.",

    lastCheckIn: "آخر تسجيل: {time}",
    notRecorded: "لم يتم التسجيل بعد",

    howFeel: "كيف تشعر؟",
    rateAreas:
      "قيّم كل جانب من 1 إلى 5. تُستخدم إجاباتك لحساب مدى استعدادك للتعافي اليوم.",

    energy: "الطاقة",
    energySubtitle: "ما مستوى الطاقة الذي تشعر به؟",
    energyLow: "منخفضة",
    energyHigh: "مرتفعة",

    soreness: "ألم العضلات",
    sorenessSubtitle: "ما مدى شعورك بألم العضلات؟",
    sorenessLow: "لا يوجد",
    sorenessHigh: "شديد",

    stress: "التوتر",
    stressSubtitle: "ما مستوى التوتر النفسي الذي تشعر به؟",
    stressLow: "هادئ",
    stressHigh: "مرتفع",

    sleep: "جودة النوم",
    sleepSubtitle: "ما مدى فائدة نومك في التعافي؟",
    sleepLow: "ضعيفة",
    sleepHigh: "ممتازة",

    hydration: "الترطيب",
    hydrationSubtitle: "ما مدى شعورك بأن جسمك رطب بشكل جيد؟",
    hydrationLow: "منخفض",
    hydrationHigh: "ممتاز",

    ratingAccessibility: "{title} {rating} من 5",

    saving: "جارٍ حفظ التسجيل...",
    saveCheckIn: "حفظ تسجيل التعافي",

    recoveryTools: "أدوات التعافي",
    calmBreathing: "التنفس الهادئ",
    hydrationTool: "الترطيب",
    sleepCoach: "مدرب النوم",
    walkingData: "بيانات المشي",

    recordedTitle: "تم تسجيل التعافي",
    recordedMessage:
      "درجة التعافي لديك هي {score}٪. يمكن لمدرب العافية بالذكاء الاصطناعي الآن استخدام هذا التسجيل.",

    saveError: "خطأ في الحفظ",
    saveErrorMessage:
      "تعذر حفظ تسجيل التعافي. حاول مرة أخرى.",

    notice:
      "هذا التقييم مخصص للمعلومات العامة ولا يُعد نصيحة طبية. أوقف التمرين واطلب رعاية متخصصة إذا ظهرت أعراض مقلقة.",

    backAccessibility: "العودة إلى العافية بالذكاء الاصطناعي",
  },
};

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase();

  return TEXT[code] ? code : "en";
}

function fillTemplate(value, replacements = {}) {
  return String(value || "").replace(
    /\{(\w+)\}/g,
    (_, key) =>
      replacements[key] !== undefined &&
      replacements[key] !== null
        ? String(replacements[key])
        : ""
  );
}

const LOCALES = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  it: "it-IT",
  ar: "ar-SA",
};

// ============================================================
// HELPERS
// ============================================================

function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      Number(value) || 0
    )
  );
}

function safelyParseJSON(
  value,
  fallback
) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// ============================================================
// RECOVERY SCORE
// ============================================================

function calculateRecoveryScore(
  checkIn
) {
  const energy = clamp(
    ((checkIn.energy - 1) / 4) * 100
  );

  const soreness = clamp(
    ((5 - checkIn.soreness) / 4) * 100
  );

  const stress = clamp(
    ((5 - checkIn.stress) / 4) * 100
  );

  const sleep = clamp(
    ((checkIn.sleep - 1) / 4) * 100
  );

  const hydration = clamp(
    ((checkIn.hydration - 1) / 4) * 100
  );

  return Math.round(
    energy * 0.25 +
      soreness * 0.2 +
      stress * 0.15 +
      sleep * 0.25 +
      hydration * 0.15
  );
}

// ============================================================
// RECOVERY STATUS
// ============================================================

function getRecoveryStatus(score, t) {
  if (score >= 85) {
    return {
      id: "ready_to_perform",
      label: t("readyPerform"),
      color: "#42F58D",
      icon: "rocket",
      intensity: t("strongWalk"),
      message: t("strongMessage"),
    };
  }

  if (score >= 65) {
    return {
      id: "ready_with_balance",
      label: t("readyBalance"),
      color: "#7EE8C4",
      icon: "walk",
      intensity: t("moderateWalk"),
      message: t("moderateMessage"),
    };
  }

  if (score >= 45) {
    return {
      id: "recovery_recommended",
      label: t("recoveryRecommended"),
      color: "#FFC94A",
      icon: "leaf",
      intensity: t("lightRecoveryWalk"),
      message: t("recoveryMessage"),
    };
  }

  return {
    id: "rest_and_restore",
    label: t("restRestore"),
    color: "#FF7184",
    icon: "heart",
    intensity: t("restLightMovement"),
    message: t("restMessage"),
  };
}

// ============================================================
// RATING SELECTOR
// ============================================================

function RatingSelector({
  item,
  value,
  onChange,
  t,
  isRTL,
}) {
  const title = t(item.key);

  const subtitle = t(
    `${item.key}Subtitle`
  );

  const low = t(
    `${item.key}Low`
  );

  const high = t(
    `${item.key}High`
  );

  return (
    <View style={styles.checkInCard}>
      <View style={styles.checkInHeader}>
        <View
          style={[
            styles.checkInIcon,
            {
              backgroundColor:
                `${item.color}18`,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={23}
            color={item.color}
          />
        </View>

        <View style={styles.checkInCopy}>
          <Text
            style={[
              styles.checkInTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.checkInSubtitle,
              isRTL && styles.rtlText,
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(
          (rating) => {
            const selected =
              rating === value;

            return (
              <TouchableOpacity
                key={rating}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={t(
                  "ratingAccessibility",
                  {
                    title,
                    rating,
                  }
                )}
                accessibilityState={{
                  selected,
                }}
                onPress={() =>
                  onChange(rating)
                }
                style={[
                  styles.ratingButton,
                  selected && {
                    backgroundColor:
                      item.color,
                    borderColor:
                      item.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ratingNumber,
                    selected &&
                      styles.ratingNumberSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <View style={styles.scaleLabels}>
        <Text
          style={[
            styles.scaleText,
            isRTL && styles.rtlText,
          ]}
        >
          {low}
        </Text>

        <Text
          style={[
            styles.scaleText,
            isRTL && styles.rtlText,
          ]}
        >
          {high}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// RECOVERY TOOL
// ============================================================

function RecoveryTool({
  icon,
  title,
  color,
  onPress,
  isRTL,
}) {
  const enabled =
    typeof onPress === "function";

  return (
    <TouchableOpacity
      style={[
        styles.toolCard,
        !enabled &&
          styles.toolCardDisabled,
      ]}
      activeOpacity={0.84}
      onPress={onPress}
      disabled={!enabled}
    >
      <View
        style={[
          styles.toolIcon,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={color}
        />
      </View>

      <Text
        style={[
          styles.toolTitle,
          isRTL && styles.rtlText,
        ]}
      >
        {title}
      </Text>

      <Ionicons
        name={
          isRTL
            ? "chevron-back"
            : "chevron-forward"
        }
        size={18}
        color="#7890AA"
      />
    </TouchableOpacity>
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function RecoveryCoachScreen({
  language = "en",
  navigation,
  goBack,
  goToBreathing,
  goToHydration,
  goToSleep,
  goToWalkingAnalytics,
}) {
  const currentLanguage =
    normalizeLanguage(language);

  const isRTL =
    currentLanguage === "ar";

  const t = (
    key,
    replacements = {}
  ) => {
    const value =
      TEXT[currentLanguage]?.[key] ??
      TEXT.en?.[key] ??
      key;

    return fillTemplate(
      value,
      replacements
    );
  };

  const [checkIn, setCheckIn] =
    useState(INITIAL_CHECK_IN);

  const [
    lastRecorded,
    setLastRecorded,
  ] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const score = useMemo(
    () =>
      calculateRecoveryScore(
        checkIn
      ),
    [checkIn]
  );

  const status = getRecoveryStatus(
    score,
    t
  );

  // ==========================================================
  // LOAD SAVED RECOVERY
  // ==========================================================

  useEffect(() => {
    const loadSavedRecovery =
      async () => {
        try {
          const saved =
            await AsyncStorage.getItem(
              "recoveryData"
            );

          const parsed =
            safelyParseJSON(
              saved,
              null
            );

          if (parsed?.checkIn) {
            setCheckIn({
              ...INITIAL_CHECK_IN,
              ...parsed.checkIn,
            });
          }

          if (parsed?.timestamp) {
            setLastRecorded(
              parsed.timestamp
            );
          }
        } catch (error) {
          console.log(
            "Recovery load error:",
            error
          );
        }
      };

    loadSavedRecovery();
  }, []);

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    if (
      typeof goBack === "function"
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
  // UPDATE RATING
  // ==========================================================

  const updateRating = (
    key,
    rating
  ) => {
    setCheckIn((current) => ({
      ...current,
      [key]: rating,
    }));
  };

  // ==========================================================
  // SAVE RECOVERY
  // ==========================================================

  const saveRecovery = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const timestamp =
        new Date().toISOString();

      const recoveryRecord = {
        score,
        recoveryScore: score,

        // Stable internal status value
        status: status.id,

        // Localized display values
        statusLabel: status.label,

        recommendedIntensity:
          status.intensity,

        stress: checkIn.stress,

        stressLevel:
          checkIn.stress,

        checkIn,

        date: timestamp.slice(
          0,
          10
        ),

        timestamp,
      };

      const serialized =
        JSON.stringify(
          recoveryRecord
        );

      await AsyncStorage.multiSet(
        RECOVERY_KEYS.map(
          (key) => [
            key,
            serialized,
          ]
        )
      );

      setLastRecorded(timestamp);

      Alert.alert(
        t("recordedTitle"),
        t("recordedMessage", {
          score,
        })
      );
    } catch (error) {
      console.log(
        "Recovery save error:",
        error
      );

      Alert.alert(
        t("saveError"),
        t("saveErrorMessage")
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================================
  // LOCALIZED DATE/TIME
  // ==========================================================

  const formattedLastRecorded =
    lastRecorded
      ? new Date(
          lastRecorded
        ).toLocaleString(
          LOCALES[currentLanguage]
        )
      : t("notRecorded");

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          {/* HEADER */}

          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={t(
                "backAccessibility"
              )}
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
              style={styles.topBarText}
            >
              <Text
                style={[
                  styles.eyebrow,
                  isRTL &&
                    styles.rtlText,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t("wellness")}
              </Text>

              <Text
                style={[
                  styles.screenTitle,
                  isRTL &&
                    styles.rtlText,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {t("recoveryCoach")}
              </Text>
            </View>

            <View
              style={styles.headerIcon}
            >
              <Ionicons
                name="heart"
                size={25}
                color="#42F58D"
              />
            </View>
          </View>

          {/* RECOVERY SCORE */}

          <LinearGradient
            colors={[
              "#0B2A46",
              "#081A31",
              "#061326",
            ]}
            style={styles.scoreCard}
          >
            <View
              style={styles.scoreHeader}
            >
              <View
                style={
                  styles.statusContainer
                }
              >
                <Text
                  style={[
                    styles.scoreLabel,
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {t("todaysRecovery")}
                </Text>

                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color:
                        status.color,
                    },
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {status.label}
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
                  {score}
                </Text>

                <Text
                  style={
                    styles.percentSign
                  }
                >
                  %
                </Text>
              </View>
            </View>

            <View
              style={styles.progressTrack}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${score}%`,

                    backgroundColor:
                      status.color,
                  },
                ]}
              />
            </View>

            <View
              style={
                styles.recommendationRow
              }
            >
              <Ionicons
                name={status.icon}
                size={22}
                color={status.color}
              />

              <View
                style={
                  styles.recommendationCopy
                }
              >
                <Text
                  style={[
                    styles.recommendationTitle,
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {status.intensity}
                </Text>

                <Text
                  style={[
                    styles.recommendationText,
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {status.message}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* LAST CHECK-IN */}

          <View
            style={styles.recordedRow}
          >
            <Ionicons
              name="time-outline"
              size={17}
              color="#8FA8C4"
            />

            <Text
              style={[
                styles.recordedText,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t("lastCheckIn", {
                time:
                  formattedLastRecorded,
              })}
            </Text>
          </View>

          {/* CHECK-IN */}

          <Text
            style={[
              styles.sectionTitle,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t("howFeel")}
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t("rateAreas")}
          </Text>

          {CHECK_IN_ITEMS.map(
            (item) => (
              <RatingSelector
                key={item.key}
                item={item}
                value={
                  checkIn[item.key]
                }
                onChange={(rating) =>
                  updateRating(
                    item.key,
                    rating
                  )
                }
                t={t}
                isRTL={isRTL}
              />
            )
          )}

          {/* SAVE */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving &&
                styles.disabledButton,
            ]}
            onPress={saveRecovery}
            disabled={isSaving}
            activeOpacity={0.86}
          >
            <Ionicons
              name={
                isSaving
                  ? "hourglass"
                  : "checkmark-circle"
              }
              size={23}
              color="#02111F"
            />

            <Text
              style={
                styles.saveButtonText
              }
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {isSaving
                ? t("saving")
                : t("saveCheckIn")}
            </Text>
          </TouchableOpacity>

          {/* TOOLS */}

          <Text
            style={[
              styles.sectionTitle,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t("recoveryTools")}
          </Text>

          <View style={styles.toolsGrid}>
            <RecoveryTool
              icon="leaf"
              title={t(
                "calmBreathing"
              )}
              color="#42F58D"
              onPress={goToBreathing}
              isRTL={isRTL}
            />

            <RecoveryTool
              icon="water"
              title={t(
                "hydrationTool"
              )}
              color="#49D8FF"
              onPress={goToHydration}
              isRTL={isRTL}
            />

            <RecoveryTool
              icon="moon"
              title={t("sleepCoach")}
              color="#A978FF"
              onPress={goToSleep}
              isRTL={isRTL}
            />

            <RecoveryTool
              icon="analytics"
              title={t("walkingData")}
              color="#FFC94A"
              onPress={
                goToWalkingAnalytics
              }
              isRTL={isRTL}
            />
          </View>

          {/* NOTICE */}

          <View
            style={styles.noticeCard}
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
                  styles.rtlText,
              ]}
            >
              {t("notice")}
            </Text>
          </View>

          <View
            style={{ height: 140 }}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  topBar: {
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
    backgroundColor: "#0B1C33",
    borderWidth: 1,
    borderColor: "#29496B",
  },

  topBarText: {
    flex: 1,
    paddingHorizontal: 14,
  },

  eyebrow: {
    color: "#FFC94A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginBottom: 4,
  },

  screenTitle: {
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
      "rgba(66,245,141,0.12)",
    borderWidth: 1,
    borderColor:
      "rgba(66,245,141,0.38)",
  },

  scoreCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#31577E",
    padding: 22,
    shadowColor: "#42F58D",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusContainer: {
    flex: 1,
    paddingRight: 12,
  },

  scoreLabel: {
    color: "#9EB4CE",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  statusLabel: {
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
    backgroundColor: "#061326",
  },

  scoreNumber: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },

  percentSign: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 11,
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#173553",
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  recommendationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
  },

  recommendationCopy: {
    flex: 1,
    marginLeft: 12,
  },

  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  recommendationText: {
    color: "#B8C8DB",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },

  recordedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 4,
  },

  recordedText: {
    flex: 1,
    color: "#8FA8C4",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
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
    marginBottom: 16,
  },

  checkInCard: {
    backgroundColor: "#08182C",
    borderWidth: 1,
    borderColor: "#264666",
    borderRadius: 22,
    padding: 17,
    marginBottom: 14,
  },

  checkInHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkInIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  checkInCopy: {
    flex: 1,
    marginLeft: 12,
  },

  checkInTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  checkInSubtitle: {
    color: "#91A6BF",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  ratingButton: {
    width: 47,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102946",
    borderWidth: 1,
    borderColor: "#345778",
  },

  ratingNumber: {
    color: "#D9E6F5",
    fontSize: 17,
    fontWeight: "900",
  },

  ratingNumberSelected: {
    color: "#02111F",
  },

  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
  },

  scaleText: {
    color: "#7088A3",
    fontSize: 11,
    fontWeight: "800",
  },

  saveButton: {
    minHeight: 60,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC94A",
    marginTop: 8,
    paddingHorizontal: 20,
    shadowColor: "#FFC94A",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  disabledButton: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: "#02111F",
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 9,
    textAlign: "center",
  },

  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  toolCard: {
    width: "48.5%",
    minHeight: 120,
    borderRadius: 20,
    backgroundColor: "#08182C",
    borderWidth: 1,
    borderColor: "#264666",
    padding: 15,
    marginBottom: 12,
  },

  toolCardDisabled: {
    opacity: 0.5,
  },

  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  toolTitle: {
    flex: 1,
    color: "#EAF2FC",
    fontSize: 15,
    fontWeight: "900",
  },

  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor:
      "rgba(115,168,255,0.08)",
    borderWidth: 1,
    borderColor:
      "rgba(115,168,255,0.25)",
    borderRadius: 19,
    padding: 16,
    marginTop: 12,
  },

  noticeText: {
    flex: 1,
    color: "#9EB4CE",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginLeft: 10,
  },

  rtlText: {
    writingDirection: "rtl",
  },
});