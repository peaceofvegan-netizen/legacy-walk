// screens/AIConversationScreen.js

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../lib/supabase";
import { translate } from "../i18n/i18n";

// ============================================================
// LEGATHON WALK — AI WELLNESS CONVERSATION
// TEXT-ONLY AI COACH
// ============================================================

const CONVERSATION_STORAGE_KEY =
  "legathonAIConversationMessages";

const COACH_MEMORY_KEY =
  "legathonAICoachMemory";

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    wellness: "LEGATHON AI WELLNESS",
    yourCoach: "Your Coach",
    welcome:
      "Welcome. I’m your Legathon AI Wellness Coach. I can help with walking, recovery, hydration, meals, sleep, breathing, and your active Legathon Journey.",

    aiMemory: "AI MEMORY",
    remembers: "What Your Coach Remembers",
    preferredWalkTime: "Preferred Walk Time",
    walkExample: "Example: 7:00 PM",
    mealPreference: "Meal Preference",
    mealExample: "Example: Mediterranean",
    favoriteBreathing: "Favorite Breathing Exercise",
    breathingExample: "Example: 4-7-8",
    saveMemory: "Save Coach Memory",
    clearMemory: "Clear Coach Memory",

    clearMemoryTitle: "Clear Coach Memory?",
    clearMemoryMessage:
      "This removes the preferences your coach remembers.",

    newConversationTitle: "Start New Conversation?",
    newConversationMessage:
      "This clears the current coach conversation.",

    cancel: "Cancel",
    clear: "Clear",

    coachName: "Legathon AI Coach",
    preparing: "Preparing your response",
    ready: "Ready to help",

    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",

    openFeature: "Open Feature",
    openRecommended: "Open Recommended Feature",
    thinking: "Your coach is thinking…",

    quickCoaching: "QUICK COACHING",

    walkPrompt: "Plan today’s walk",
    recoveryPrompt: "Help me recover",
    mealPrompt: "Build a meal plan",
    hydrationPrompt: "Check hydration",
    sleepPrompt: "Improve sleep",
    stressPrompt: "Reduce stress",
    journeyPrompt: "Coach my journey",
    progressPrompt: "Review progress",

    placeholder: "Type a message to your coach…",

    disclaimer:
      "Legathon AI provides general wellness guidance and does not replace professional medical care.",

    responseError:
      "I could not prepare that response. Please try again.",

    remoteError: "Unable to reach the AI Coach.",
    emptyResponse: "The AI Coach returned no response.",
  },

  es: {
    wellness: "BIENESTAR IA LEGATHON",
    yourCoach: "Tu Entrenador",
    welcome:
      "Bienvenido. Soy tu entrenador de bienestar con IA de Legathon. Puedo ayudarte con caminatas, recuperación, hidratación, comidas, sueño, respiración y tu recorrido activo de Legathon.",

    aiMemory: "MEMORIA IA",
    remembers: "Lo que recuerda tu entrenador",
    preferredWalkTime: "Hora Preferida para Caminar",
    walkExample: "Ejemplo: 7:00 PM",
    mealPreference: "Preferencia de Comida",
    mealExample: "Ejemplo: Mediterránea",
    favoriteBreathing: "Ejercicio de Respiración Favorito",
    breathingExample: "Ejemplo: 4-7-8",
    saveMemory: "Guardar Memoria",
    clearMemory: "Borrar Memoria",

    clearMemoryTitle: "¿Borrar la memoria?",
    clearMemoryMessage:
      "Esto elimina las preferencias que recuerda tu entrenador.",

    newConversationTitle: "¿Iniciar una nueva conversación?",
    newConversationMessage:
      "Esto borra la conversación actual.",

    cancel: "Cancelar",
    clear: "Borrar",

    coachName: "Entrenador IA Legathon",
    preparing: "Preparando tu respuesta",
    ready: "Listo para ayudar",

    morning: "Buenos días",
    afternoon: "Buenas tardes",
    evening: "Buenas noches",

    openFeature: "Abrir Función",
    openRecommended: "Abrir Función Recomendada",
    thinking: "Tu entrenador está pensando…",

    quickCoaching: "ENTRENAMIENTO RÁPIDO",

    walkPrompt: "Planear la caminata de hoy",
    recoveryPrompt: "Ayúdame a recuperarme",
    mealPrompt: "Crear un plan de comidas",
    hydrationPrompt: "Revisar hidratación",
    sleepPrompt: "Mejorar el sueño",
    stressPrompt: "Reducir el estrés",
    journeyPrompt: "Entrenar mi recorrido",
    progressPrompt: "Revisar progreso",

    placeholder: "Escribe un mensaje a tu entrenador…",

    disclaimer:
      "Legathon AI ofrece orientación general de bienestar y no reemplaza la atención médica profesional.",

    responseError:
      "No pude preparar esa respuesta. Inténtalo de nuevo.",

    remoteError: "No se pudo contactar al entrenador IA.",
    emptyResponse: "El entrenador IA no devolvió una respuesta.",
  },

  fr: {
    wellness: "BIEN-ÊTRE IA LEGATHON",
    yourCoach: "Votre Coach",
    welcome:
      "Bienvenue. Je suis votre coach bien-être IA Legathon. Je peux vous aider avec la marche, la récupération, l’hydratation, les repas, le sommeil, la respiration et votre parcours Legathon actif.",

    aiMemory: "MÉMOIRE IA",
    remembers: "Ce que votre coach mémorise",
    preferredWalkTime: "Heure de Marche Préférée",
    walkExample: "Exemple : 19:00",
    mealPreference: "Préférence Alimentaire",
    mealExample: "Exemple : Méditerranéen",
    favoriteBreathing: "Exercice Respiratoire Préféré",
    breathingExample: "Exemple : 4-7-8",
    saveMemory: "Enregistrer la Mémoire",
    clearMemory: "Effacer la Mémoire",

    clearMemoryTitle: "Effacer la mémoire ?",
    clearMemoryMessage:
      "Cela supprime les préférences mémorisées par votre coach.",

    newConversationTitle: "Nouvelle conversation ?",
    newConversationMessage:
      "Cela efface la conversation actuelle.",

    cancel: "Annuler",
    clear: "Effacer",

    coachName: "Coach IA Legathon",
    preparing: "Préparation de votre réponse",
    ready: "Prêt à vous aider",

    morning: "Bonjour",
    afternoon: "Bon après-midi",
    evening: "Bonsoir",

    openFeature: "Ouvrir",
    openRecommended: "Ouvrir la Fonction Recommandée",
    thinking: "Votre coach réfléchit…",

    quickCoaching: "COACHING RAPIDE",

    walkPrompt: "Planifier la marche du jour",
    recoveryPrompt: "Aidez-moi à récupérer",
    mealPrompt: "Créer un plan de repas",
    hydrationPrompt: "Vérifier l’hydratation",
    sleepPrompt: "Améliorer le sommeil",
    stressPrompt: "Réduire le stress",
    journeyPrompt: "Coacher mon parcours",
    progressPrompt: "Voir mes progrès",

    placeholder: "Écrivez à votre coach…",

    disclaimer:
      "Legathon AI fournit des conseils généraux de bien-être et ne remplace pas les soins médicaux professionnels.",

    responseError:
      "Impossible de préparer cette réponse. Veuillez réessayer.",

    remoteError: "Impossible de joindre le coach IA.",
    emptyResponse: "Le coach IA n’a renvoyé aucune réponse.",
  },

  de: {
    wellness: "LEGATHON KI WELLNESS",
    yourCoach: "Dein Coach",
    welcome:
      "Willkommen. Ich bin dein Legathon KI-Wellness-Coach. Ich helfe dir bei Gehen, Erholung, Flüssigkeitszufuhr, Mahlzeiten, Schlaf, Atmung und deiner aktiven Legathon-Reise.",

    aiMemory: "KI-GEDÄCHTNIS",
    remembers: "Was dein Coach sich merkt",
    preferredWalkTime: "Bevorzugte Gehzeit",
    walkExample: "Beispiel: 19:00",
    mealPreference: "Essenspräferenz",
    mealExample: "Beispiel: Mediterran",
    favoriteBreathing: "Bevorzugte Atemübung",
    breathingExample: "Beispiel: 4-7-8",
    saveMemory: "Coach-Gedächtnis Speichern",
    clearMemory: "Coach-Gedächtnis Löschen",

    clearMemoryTitle: "Coach-Gedächtnis löschen?",
    clearMemoryMessage:
      "Dadurch werden die gespeicherten Präferenzen entfernt.",

    newConversationTitle: "Neue Unterhaltung starten?",
    newConversationMessage:
      "Dadurch wird die aktuelle Unterhaltung gelöscht.",

    cancel: "Abbrechen",
    clear: "Löschen",

    coachName: "Legathon KI Coach",
    preparing: "Antwort wird vorbereitet",
    ready: "Bereit zu helfen",

    morning: "Guten Morgen",
    afternoon: "Guten Tag",
    evening: "Guten Abend",

    openFeature: "Funktion Öffnen",
    openRecommended: "Empfohlene Funktion Öffnen",
    thinking: "Dein Coach denkt nach…",

    quickCoaching: "SCHNELL-COACHING",

    walkPrompt: "Heutigen Spaziergang planen",
    recoveryPrompt: "Bei der Erholung helfen",
    mealPrompt: "Essensplan erstellen",
    hydrationPrompt: "Flüssigkeit prüfen",
    sleepPrompt: "Schlaf verbessern",
    stressPrompt: "Stress reduzieren",
    journeyPrompt: "Meine Reise coachen",
    progressPrompt: "Fortschritt prüfen",

    placeholder: "Nachricht an deinen Coach…",

    disclaimer:
      "Legathon AI bietet allgemeine Wellness-Hinweise und ersetzt keine professionelle medizinische Versorgung.",

    responseError:
      "Die Antwort konnte nicht erstellt werden. Bitte versuche es erneut.",

    remoteError: "Der KI-Coach ist nicht erreichbar.",
    emptyResponse: "Der KI-Coach hat keine Antwort geliefert.",
  },

  pt: {
    wellness: "BEM-ESTAR IA LEGATHON",
    yourCoach: "Seu Coach",
    welcome:
      "Bem-vindo. Sou seu Coach de Bem-Estar com IA Legathon. Posso ajudar com caminhada, recuperação, hidratação, refeições, sono, respiração e sua Jornada Legathon ativa.",

    aiMemory: "MEMÓRIA IA",
    remembers: "O que seu coach lembra",
    preferredWalkTime: "Horário Preferido para Caminhar",
    walkExample: "Exemplo: 19:00",
    mealPreference: "Preferência Alimentar",
    mealExample: "Exemplo: Mediterrânea",
    favoriteBreathing: "Exercício Respiratório Favorito",
    breathingExample: "Exemplo: 4-7-8",
    saveMemory: "Salvar Memória",
    clearMemory: "Limpar Memória",

    clearMemoryTitle: "Limpar memória?",
    clearMemoryMessage:
      "Isso remove as preferências lembradas pelo seu coach.",

    newConversationTitle: "Iniciar nova conversa?",
    newConversationMessage:
      "Isso limpa a conversa atual.",

    cancel: "Cancelar",
    clear: "Limpar",

    coachName: "Coach IA Legathon",
    preparing: "Preparando sua resposta",
    ready: "Pronto para ajudar",

    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",

    openFeature: "Abrir Recurso",
    openRecommended: "Abrir Recurso Recomendado",
    thinking: "Seu coach está pensando…",

    quickCoaching: "COACHING RÁPIDO",

    walkPrompt: "Planejar caminhada de hoje",
    recoveryPrompt: "Ajude na recuperação",
    mealPrompt: "Criar plano alimentar",
    hydrationPrompt: "Verificar hidratação",
    sleepPrompt: "Melhorar o sono",
    stressPrompt: "Reduzir o estresse",
    journeyPrompt: "Orientar minha jornada",
    progressPrompt: "Revisar progresso",

    placeholder: "Digite uma mensagem para seu coach…",

    disclaimer:
      "Legathon AI fornece orientação geral de bem-estar e não substitui cuidados médicos profissionais.",

    responseError:
      "Não consegui preparar essa resposta. Tente novamente.",

    remoteError: "Não foi possível acessar o Coach IA.",
    emptyResponse: "O Coach IA não retornou uma resposta.",
  },

  it: {
    wellness: "BENESSERE IA LEGATHON",
    yourCoach: "Il Tuo Coach",
    welcome:
      "Benvenuto. Sono il tuo Coach Benessere IA Legathon. Posso aiutarti con camminata, recupero, idratazione, pasti, sonno, respirazione e il tuo Percorso Legathon attivo.",

    aiMemory: "MEMORIA IA",
    remembers: "Cosa Ricorda il Tuo Coach",
    preferredWalkTime: "Orario Preferito per Camminare",
    walkExample: "Esempio: 19:00",
    mealPreference: "Preferenza Alimentare",
    mealExample: "Esempio: Mediterranea",
    favoriteBreathing: "Esercizio di Respirazione Preferito",
    breathingExample: "Esempio: 4-7-8",
    saveMemory: "Salva Memoria",
    clearMemory: "Cancella Memoria",

    clearMemoryTitle: "Cancellare la memoria?",
    clearMemoryMessage:
      "Questo rimuove le preferenze ricordate dal tuo coach.",

    newConversationTitle: "Nuova conversazione?",
    newConversationMessage:
      "Questo cancella la conversazione attuale.",

    cancel: "Annulla",
    clear: "Cancella",

    coachName: "Coach IA Legathon",
    preparing: "Preparazione della risposta",
    ready: "Pronto ad aiutarti",

    morning: "Buongiorno",
    afternoon: "Buon pomeriggio",
    evening: "Buonasera",

    openFeature: "Apri Funzione",
    openRecommended: "Apri Funzione Consigliata",
    thinking: "Il tuo coach sta pensando…",

    quickCoaching: "COACHING RAPIDO",

    walkPrompt: "Pianifica la camminata",
    recoveryPrompt: "Aiutami a recuperare",
    mealPrompt: "Crea un piano pasti",
    hydrationPrompt: "Controlla idratazione",
    sleepPrompt: "Migliora il sonno",
    stressPrompt: "Riduci lo stress",
    journeyPrompt: "Segui il mio percorso",
    progressPrompt: "Controlla i progressi",

    placeholder: "Scrivi un messaggio al tuo coach…",

    disclaimer:
      "Legathon AI fornisce indicazioni generali sul benessere e non sostituisce l’assistenza medica professionale.",

    responseError:
      "Non è stato possibile preparare la risposta. Riprova.",

    remoteError: "Impossibile raggiungere il Coach IA.",
    emptyResponse: "Il Coach IA non ha restituito una risposta.",
  },

  ja: {
    wellness: "LEGATHON AI ウェルネス",
    yourCoach: "あなたのコーチ",
    welcome:
      "ようこそ。Legathon AIウェルネスコーチです。ウォーキング、回復、水分補給、食事、睡眠、呼吸、Legathonジャーニーをサポートします。",

    aiMemory: "AIメモリー",
    remembers: "コーチが記憶していること",
    preferredWalkTime: "希望するウォーキング時間",
    walkExample: "例：午後7:00",
    mealPreference: "食事の好み",
    mealExample: "例：地中海料理",
    favoriteBreathing: "お気に入りの呼吸法",
    breathingExample: "例：4-7-8",
    saveMemory: "メモリーを保存",
    clearMemory: "メモリーを消去",

    clearMemoryTitle: "メモリーを消去しますか？",
    clearMemoryMessage:
      "コーチが記憶している設定を削除します。",

    newConversationTitle: "新しい会話を開始しますか？",
    newConversationMessage:
      "現在の会話を消去します。",

    cancel: "キャンセル",
    clear: "消去",

    coachName: "Legathon AI コーチ",
    preparing: "回答を準備しています",
    ready: "サポートできます",

    morning: "おはようございます",
    afternoon: "こんにちは",
    evening: "こんばんは",

    openFeature: "機能を開く",
    openRecommended: "おすすめ機能を開く",
    thinking: "コーチが考えています…",

    quickCoaching: "クイックコーチング",

    walkPrompt: "今日のウォーキングを計画",
    recoveryPrompt: "回復をサポート",
    mealPrompt: "食事プランを作成",
    hydrationPrompt: "水分補給を確認",
    sleepPrompt: "睡眠を改善",
    stressPrompt: "ストレスを軽減",
    journeyPrompt: "ジャーニーをコーチ",
    progressPrompt: "進捗を確認",

    placeholder: "コーチにメッセージを入力…",

    disclaimer:
      "Legathon AIは一般的なウェルネス情報を提供するもので、専門的な医療の代わりではありません。",

    responseError:
      "回答を準備できませんでした。もう一度お試しください。",

    remoteError: "AIコーチに接続できません。",
    emptyResponse: "AIコーチから応答がありません。",
  },

  ko: {
    wellness: "LEGATHON AI 웰니스",
    yourCoach: "나의 코치",
    welcome:
      "환영합니다. Legathon AI 웰니스 코치입니다. 걷기, 회복, 수분 섭취, 식사, 수면, 호흡 및 Legathon 여정을 도와드릴 수 있습니다.",

    aiMemory: "AI 메모리",
    remembers: "코치가 기억하는 정보",
    preferredWalkTime: "선호 걷기 시간",
    walkExample: "예: 오후 7:00",
    mealPreference: "식사 선호도",
    mealExample: "예: 지중해식",
    favoriteBreathing: "선호 호흡 운동",
    breathingExample: "예: 4-7-8",
    saveMemory: "코치 메모리 저장",
    clearMemory: "코치 메모리 지우기",

    clearMemoryTitle: "코치 메모리를 지울까요?",
    clearMemoryMessage:
      "코치가 기억하는 선호 정보를 삭제합니다.",

    newConversationTitle: "새 대화를 시작할까요?",
    newConversationMessage:
      "현재 코치 대화를 삭제합니다.",

    cancel: "취소",
    clear: "지우기",

    coachName: "Legathon AI 코치",
    preparing: "답변을 준비하고 있습니다",
    ready: "도움드릴 준비가 되었습니다",

    morning: "좋은 아침입니다",
    afternoon: "안녕하세요",
    evening: "좋은 저녁입니다",

    openFeature: "기능 열기",
    openRecommended: "추천 기능 열기",
    thinking: "코치가 생각하고 있습니다…",

    quickCoaching: "빠른 코칭",

    walkPrompt: "오늘 걷기 계획",
    recoveryPrompt: "회복 도움",
    mealPrompt: "식사 계획 만들기",
    hydrationPrompt: "수분 섭취 확인",
    sleepPrompt: "수면 개선",
    stressPrompt: "스트레스 줄이기",
    journeyPrompt: "여정 코칭",
    progressPrompt: "진행 상황 확인",

    placeholder: "코치에게 메시지를 입력하세요…",

    disclaimer:
      "Legathon AI는 일반적인 웰니스 정보를 제공하며 전문 의료 서비스를 대체하지 않습니다.",

    responseError:
      "응답을 준비하지 못했습니다. 다시 시도해 주세요.",

    remoteError: "AI 코치에 연결할 수 없습니다.",
    emptyResponse: "AI 코치의 응답이 없습니다.",
  },

  zh: {
    wellness: "LEGATHON AI 健康",
    yourCoach: "您的教练",
    welcome:
      "欢迎。我是您的 Legathon AI 健康教练。我可以帮助您进行步行、恢复、补水、饮食、睡眠、呼吸训练以及当前的 Legathon 旅程。",

    aiMemory: "AI 记忆",
    remembers: "您的教练记住的信息",
    preferredWalkTime: "首选步行时间",
    walkExample: "例如：晚上7:00",
    mealPreference: "饮食偏好",
    mealExample: "例如：地中海饮食",
    favoriteBreathing: "最喜欢的呼吸练习",
    breathingExample: "例如：4-7-8",
    saveMemory: "保存教练记忆",
    clearMemory: "清除教练记忆",

    clearMemoryTitle: "清除教练记忆？",
    clearMemoryMessage:
      "这将删除教练记住的偏好设置。",

    newConversationTitle: "开始新对话？",
    newConversationMessage:
      "这将清除当前的教练对话。",

    cancel: "取消",
    clear: "清除",

    coachName: "Legathon AI 教练",
    preparing: "正在准备回复",
    ready: "随时为您提供帮助",

    morning: "早上好",
    afternoon: "下午好",
    evening: "晚上好",

    openFeature: "打开功能",
    openRecommended: "打开推荐功能",
    thinking: "您的教练正在思考…",

    quickCoaching: "快速指导",

    walkPrompt: "规划今天的步行",
    recoveryPrompt: "帮助我恢复",
    mealPrompt: "制定饮食计划",
    hydrationPrompt: "检查补水",
    sleepPrompt: "改善睡眠",
    stressPrompt: "减轻压力",
    journeyPrompt: "指导我的旅程",
    progressPrompt: "查看进度",

    placeholder: "给您的教练发送消息…",

    disclaimer:
      "Legathon AI 提供一般健康指导，不能替代专业医疗服务。",

    responseError:
      "无法准备回复，请重试。",

    remoteError: "无法连接 AI 教练。",
    emptyResponse: "AI 教练没有返回回复。",
  },

  ar: {
    wellness: "LEGATHON AI للعافية",
    yourCoach: "مدربك",
    welcome:
      "مرحبًا. أنا مدرب Legathon للذكاء الاصطناعي والعافية. يمكنني مساعدتك في المشي والتعافي والترطيب والوجبات والنوم والتنفس ورحلتك الحالية في Legathon.",

    aiMemory: "ذاكرة الذكاء الاصطناعي",
    remembers: "ما يتذكره مدربك",
    preferredWalkTime: "وقت المشي المفضل",
    walkExample: "مثال: 7:00 مساءً",
    mealPreference: "تفضيلات الطعام",
    mealExample: "مثال: متوسطي",
    favoriteBreathing: "تمرين التنفس المفضل",
    breathingExample: "مثال: 4-7-8",
    saveMemory: "حفظ ذاكرة المدرب",
    clearMemory: "مسح ذاكرة المدرب",

    clearMemoryTitle: "مسح ذاكرة المدرب؟",
    clearMemoryMessage:
      "سيؤدي ذلك إلى حذف التفضيلات التي يتذكرها مدربك.",

    newConversationTitle: "بدء محادثة جديدة؟",
    newConversationMessage:
      "سيؤدي ذلك إلى مسح المحادثة الحالية.",

    cancel: "إلغاء",
    clear: "مسح",

    coachName: "مدرب Legathon AI",
    preparing: "جارٍ إعداد ردك",
    ready: "جاهز للمساعدة",

    morning: "صباح الخير",
    afternoon: "مساء الخير",
    evening: "مساء الخير",

    openFeature: "فتح الميزة",
    openRecommended: "فتح الميزة المقترحة",
    thinking: "مدربك يفكر…",

    quickCoaching: "تدريب سريع",

    walkPrompt: "خطط لمشي اليوم",
    recoveryPrompt: "ساعدني على التعافي",
    mealPrompt: "أنشئ خطة وجبات",
    hydrationPrompt: "تحقق من الترطيب",
    sleepPrompt: "حسن النوم",
    stressPrompt: "قلل التوتر",
    journeyPrompt: "دربني في رحلتي",
    progressPrompt: "راجع التقدم",

    placeholder: "اكتب رسالة إلى مدربك…",

    disclaimer:
      "يقدم Legathon AI إرشادات عامة للعافية ولا يحل محل الرعاية الطبية المتخصصة.",

    responseError:
      "تعذر إعداد الرد. حاول مرة أخرى.",

    remoteError: "تعذر الوصول إلى مدرب الذكاء الاصطناعي.",
    emptyResponse: "لم يُرجع مدرب الذكاء الاصطناعي أي رد.",
  },
};

// ============================================================
// HELPERS
// ============================================================

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function safelyParseJSON(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log("JSON parse error:", error);
    return fallback;
  }
}

function getLanguage(language) {
  return TEXT[language]
    ? language
    : "en";
}

function getText(language, key) {
  const code = getLanguage(language);

  return (
    TEXT?.[code]?.[key] ??
    TEXT?.en?.[key] ??
    key
  );
}

function getDayGreeting(language) {
  const hour = new Date().getHours();

  if (hour < 12) {
    return getText(language, "morning");
  }

  if (hour < 18) {
    return getText(language, "afternoon");
  }

  return getText(language, "evening");
}

// ============================================================
// STARTER MESSAGE
// ============================================================

function getStarterMessages(language) {
  return [
    {
      id: "welcome",
      sender: "coach",
      text: getText(language, "welcome"),
      actionIntent: null,
    },
  ];
}

// ============================================================
// COACH MEMORY
// ============================================================

const INITIAL_MEMORY = {
  preferredWalkTime: "",
  mealPreference: "",
  favoriteBreathing: "",
};

// ============================================================
// QUICK PROMPTS
// ============================================================

function getQuickPrompts(language) {
  return [
    {
      id: "walk",
      label: getText(language, "walkPrompt"),
      coachMessage: "Plan today's walk",
      icon: "walk",
    },
    {
      id: "recovery",
      label: getText(language, "recoveryPrompt"),
      coachMessage: "Help me recover",
      icon: "heart",
    },
    {
      id: "meal",
      label: getText(language, "mealPrompt"),
      coachMessage: "Build a meal plan",
      icon: "restaurant",
    },
    {
      id: "hydration",
      label: getText(language, "hydrationPrompt"),
      coachMessage: "Check hydration",
      icon: "water",
    },
    {
      id: "sleep",
      label: getText(language, "sleepPrompt"),
      coachMessage: "Improve sleep",
      icon: "moon",
    },
    {
      id: "stress",
      label: getText(language, "stressPrompt"),
      coachMessage: "Reduce stress",
      icon: "leaf",
    },
    {
      id: "journey",
      label: getText(language, "journeyPrompt"),
      coachMessage: "Coach my journey",
      icon: "map",
    },
    {
      id: "progress",
      label: getText(language, "progressPrompt"),
      coachMessage: "Review progress",
      icon: "stats-chart",
    },
  ];
}

// ============================================================
// NAVIGATION INTENT
// ============================================================

function detectNavigationIntent(text, wellness) {
  const value = String(text || "").toLowerCase();

  if (
    value.includes("meal planner") ||
    value.includes("meal plan") ||
    value.includes("build a meal")
  ) {
    return "meal";
  }

  if (
    value.includes("hydration") ||
    value.includes("water")
  ) {
    return "hydration";
  }

  if (
    value.includes("recovery") ||
    value.includes("recover")
  ) {
    return "recovery";
  }

  if (
    value.includes("sleep") ||
    value.includes("tired")
  ) {
    return "sleep";
  }

  if (
    value.includes("stress") ||
    value.includes("calm") ||
    value.includes("breathing")
  ) {
    return "breathing";
  }

  if (
    value.includes("start walk") ||
    value.includes("continue journey") ||
    value.includes("gps")
  ) {
    return wellness?.journey
      ? "journeyMap"
      : "journeys";
  }

  return null;
}

// ============================================================
// MEMORY DETECTION
// ============================================================

function detectMemoryUpdate(text) {
  const original = String(text || "").trim();
  const lower = original.toLowerCase();

  if (lower.includes("i like to walk at")) {
    return {
      preferredWalkTime:
        original
          .split(/i like to walk at/i)[1]
          ?.trim() || "",
    };
  }

  if (
    lower.includes(
      "my meal preference is"
    )
  ) {
    return {
      mealPreference:
        original
          .split(
            /my meal preference is/i
          )[1]
          ?.trim() || "",
    };
  }

  if (
    lower.includes(
      "my favorite breathing exercise is"
    )
  ) {
    return {
      favoriteBreathing:
        original
          .split(
            /my favorite breathing exercise is/i
          )[1]
          ?.trim() || "",
    };
  }

  return null;
}

// ============================================================
// LOCAL FALLBACK COACH
// ============================================================

function createLocalCoachReply(
  message,
  context = {}
) {
  const value =
    String(message || "").toLowerCase();

  const steps =
    safeNumber(context.steps, 0);

  const stepGoal =
    Math.max(
      1,
      safeNumber(
        context.stepGoal,
        7000
      )
    );

  const hydration =
    safeNumber(
      context.hydration,
      0
    );

  const hydrationGoal =
    Math.max(
      1,
      safeNumber(
        context.hydrationGoal,
        100
      )
    );

  const recovery =
    context.recovery !== null &&
    context.recovery !== undefined
      ? safeNumber(context.recovery)
      : null;

  const sleepHours =
    context.sleepHours !== null &&
    context.sleepHours !== undefined
      ? safeNumber(context.sleepHours)
      : null;

  const journey =
    context.journey || "";

  const journeyProgress =
    safeNumber(
      context.journeyProgress,
      0
    );

  const checkpoint =
    context.checkpoint || "";

  const coachMemory =
    context.coachMemory || {};

  const stepsRemaining =
    Math.max(
      stepGoal - steps,
      0
    );

  if (
    value.includes("when should i walk") &&
    coachMemory.preferredWalkTime
  ) {
    return (
      `You prefer walking at ${coachMemory.preferredWalkTime}. ` +
      "That remains a good time if your schedule and conditions allow."
    );
  }

  if (
    value.includes("walk") ||
    value.includes("steps")
  ) {
    if (journey) {
      return (
        `Continue your ${journey} journey. ` +
        `You are ${Math.round(journeyProgress)}% complete` +
        `${
          checkpoint
            ? ` and currently at checkpoint ${checkpoint}`
            : ""
        }. Begin at a comfortable pace and build momentum gradually.`
      );
    }

    if (stepsRemaining === 0) {
      return (
        "You completed today’s step goal. " +
        "A short recovery walk is optional if you still feel well."
      );
    }

    return (
      `You are ${stepsRemaining.toLocaleString()} steps ` +
      "from today’s goal. Start with a comfortable " +
      "15-minute walk and reassess how you feel afterward."
    );
  }

  if (
    value.includes("recover") ||
    value.includes("recovery")
  ) {
    if (recovery !== null) {
      return (
        `Your current recovery score is ${Math.round(recovery)}%. ` +
        "Prioritize hydration, protein, gentle movement, and quality sleep."
      );
    }

    return (
      "Recovery has not been recorded yet. " +
      "Check your energy, soreness, hydration, and sleep before choosing today’s walking intensity."
    );
  }

  if (
    value.includes("meal") ||
    value.includes("food") ||
    value.includes("eat")
  ) {
    const preference =
      coachMemory.mealPreference;

    if (preference) {
      return (
        `Your saved meal preference is ${preference}. ` +
        "Build today’s meals around lean protein, vegetables, a quality carbohydrate, and healthy fat."
      );
    }

    return (
      "Build your plate around lean protein, vegetables, " +
      "a quality carbohydrate, and healthy fat. " +
      "Open the Meal Planner for a complete daily plan."
    );
  }

  if (
    value.includes("water") ||
    value.includes("hydration")
  ) {
    const remaining =
      Math.max(
        hydrationGoal - hydration,
        0
      );

    if (remaining > 0) {
      return (
        `You have ${Math.round(remaining)} ounces remaining toward today’s hydration goal. ` +
        "Drink gradually throughout the day."
      );
    }

    return (
      "You reached today’s hydration goal. " +
      "Continue drinking according to thirst, activity, and weather."
    );
  }

  if (
    value.includes("sleep") ||
    value.includes("tired")
  ) {
    if (sleepHours !== null) {
      return (
        `You recorded ${sleepHours.toFixed(1)} hours of sleep. ` +
        "Keep your bedtime consistent and reduce bright screens before bed tonight."
      );
    }

    return (
      "Sleep has not been recorded yet. " +
      "Aim for a consistent bedtime, a cool dark room, and a calm wind-down routine."
    );
  }

  if (
    value.includes("stress") ||
    value.includes("calm") ||
    value.includes("breath")
  ) {
    if (
      coachMemory.favoriteBreathing
    ) {
      return (
        `Your favorite exercise is ${coachMemory.favoriteBreathing}. ` +
        "Use it now for several slow rounds while keeping your shoulders relaxed."
      );
    }

    return (
      "Try four rounds of breathing: inhale for four seconds, " +
      "hold for four, exhale for six, then pause briefly before repeating."
    );
  }

  if (
    value.includes("journey") ||
    value.includes("checkpoint")
  ) {
    if (journey) {
      return (
        `Your active journey is ${journey}. ` +
        `You are ${Math.round(journeyProgress)}% complete` +
        `${
          checkpoint
            ? ` at checkpoint ${checkpoint}`
            : ""
        }.`
      );
    }

    return (
      "You do not have an active journey yet. " +
      "Open Journeys to choose one and begin GPS coaching."
    );
  }

  if (
    value.includes("progress") ||
    value.includes("summary")
  ) {
    return (
      `Today you have ${steps.toLocaleString()} steps toward your ` +
      `${stepGoal.toLocaleString()}-step goal. ` +
      `Hydration is ${Math.round(hydration)} of ${Math.round(
        hydrationGoal
      )} ounces` +
      `${
        journey
          ? `. Your ${journey} journey is ${Math.round(
              journeyProgress
            )}% complete.`
          : "."
      }`
    );
  }

  return (
    "I can help with walking, recovery, meals, hydration, " +
    "sleep, breathing, journey coaching, and progress reviews. " +
    "What would you like to improve today?"
  );
}

// ============================================================
// MEMORY INPUT
// ============================================================

function MemoryInput({
  icon,
  label,
  value,
  placeholder,
  onChangeText,
}) {
  return (
    <View style={styles.memoryInputRow}>
      <View style={styles.memoryIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#42F58D"
        />
      </View>

      <View style={styles.memoryInputWrap}>
        <Text style={styles.memoryLabel}>
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#687D96"
          style={styles.memoryInput}
        />
      </View>
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function AIConversationScreen({
  language = "en",

  goBack,

  wellness = {},

  goToGPSJourneyMap,
  goToJourneys,
  goToMealPlanner,
  goToHydration,
  goToRecovery,
  goToSleep,
  goToBreathing,
}) {
  const t = (key) => {
    const localValue =
      getText(language, key);

    if (localValue !== key) {
      return localValue;
    }

    return translate(language, key);
  };

  const quickPrompts =
    useMemo(
      () =>
        getQuickPrompts(language),
      [language]
    );

  const [messages, setMessages] =
    useState(() =>
      getStarterMessages(language)
    );

  const [draft, setDraft] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [
    pendingAction,
    setPendingAction,
  ] = useState(null);

  const [
    showMemoryPanel,
    setShowMemoryPanel,
  ] = useState(false);

  const [
    coachMemory,
    setCoachMemory,
  ] = useState(INITIAL_MEMORY);

  const [
    memoryDraft,
    setMemoryDraft,
  ] = useState(INITIAL_MEMORY);

  const scrollRef =
    useRef(null);

  const canSend =
    useMemo(() => {
      return (
        draft.trim().length > 0 &&
        !isTyping
      );
    }, [draft, isTyping]);

  const mergedWellness =
    useMemo(() => {
      return {
        steps:
          safeNumber(
            wellness?.steps,
            0
          ),

        stepGoal:
          Math.max(
            1,
            safeNumber(
              wellness?.stepGoal,
              7000
            )
          ),

        hydration:
          safeNumber(
            wellness?.hydration,
            0
          ),

        hydrationGoal:
          Math.max(
            1,
            safeNumber(
              wellness?.hydrationGoal,
              100
            )
          ),

        recovery:
          wellness?.recovery ??
          null,

        sleepHours:
          wellness?.sleepHours ??
          null,

        journey:
          wellness?.journey ||
          "",

        journeyProgress:
          safeNumber(
            wellness?.journeyProgress,
            0
          ),

        checkpoint:
          wellness?.checkpoint ||
          "",

        coachMemory,
      };
    }, [
      wellness,
      coachMemory,
    ]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current
        ?.scrollToEnd?.({
          animated: true,
        });
    });
  };

  // ==========================================================
  // REMOTE AI
  // ==========================================================

  const requestCoachReply =
    async (
      message,
      memoryContext
    ) => {
      const {
        data,
        error,
      } =
        await supabase.functions.invoke(
          "legathon-ai-coach",
          {
            body: {
              message,

              language,

              wellness: {
                ...mergedWellness,

                coachMemory:
                  memoryContext,
              },

              coachMemory:
                memoryContext,

              history:
                messages
                  .slice(-12)
                  .map((item) => ({
                    sender:
                      item.sender,

                    text:
                      item.text,
                  })),
            },
          }
        );

      if (error) {
        throw new Error(
          error.message ||
            t("remoteError")
        );
      }

      if (!data?.reply) {
        throw new Error(
          data?.error ||
            t("emptyResponse")
        );
      }

      return String(data.reply);
    };

  // ==========================================================
  // LOAD CONVERSATION
  // ==========================================================

  useEffect(() => {
    const loadConversation =
      async () => {
        try {
          const savedMessages =
            await AsyncStorage.getItem(
              CONVERSATION_STORAGE_KEY
            );

          const parsed =
            safelyParseJSON(
              savedMessages,
              null
            );

          if (
            Array.isArray(parsed) &&
            parsed.length > 0
          ) {
            setMessages(parsed);
          }
        } catch (error) {
          console.log(
            "Coach conversation load error:",
            error
          );
        }
      };

    loadConversation();
  }, []);

  // ==========================================================
  // LOAD MEMORY
  // ==========================================================

  useEffect(() => {
    const loadMemory =
      async () => {
        try {
          const savedMemory =
            await AsyncStorage.getItem(
              COACH_MEMORY_KEY
            );

          const parsed =
            safelyParseJSON(
              savedMemory,
              null
            );

          if (
            parsed &&
            typeof parsed === "object"
          ) {
            const nextMemory = {
              ...INITIAL_MEMORY,
              ...parsed,
            };

            setCoachMemory(
              nextMemory
            );

            setMemoryDraft(
              nextMemory
            );
          }
        } catch (error) {
          console.log(
            "Coach memory load error:",
            error
          );
        }
      };

    loadMemory();
  }, []);

  // ==========================================================
  // SAVE CONVERSATION
  // ==========================================================

  useEffect(() => {
    const saveConversation =
      async () => {
        try {
          await AsyncStorage.setItem(
            CONVERSATION_STORAGE_KEY,
            JSON.stringify(messages)
          );
        } catch (error) {
          console.log(
            "Coach conversation save error:",
            error
          );
        }
      };

    saveConversation();
  }, [messages]);

  // ==========================================================
  // AUTO SCROLL
  // ==========================================================

  useEffect(() => {
    scrollToBottom();
  }, [
    messages,
    isTyping,
  ]);

  // ==========================================================
  // SAVE MEMORY
  // ==========================================================

  const saveCoachMemory =
    async (updates) => {
      try {
        const nextMemory = {
          ...coachMemory,
          ...updates,
        };

        setCoachMemory(
          nextMemory
        );

        await AsyncStorage.setItem(
          COACH_MEMORY_KEY,
          JSON.stringify(
            nextMemory
          )
        );

        return nextMemory;
      } catch (error) {
        console.log(
          "Coach memory save error:",
          error
        );

        return {
          ...coachMemory,
          ...updates,
        };
      }
    };

  const saveMemoryPanel =
    async () => {
      await saveCoachMemory({
        preferredWalkTime:
          memoryDraft
            .preferredWalkTime
            .trim(),

        mealPreference:
          memoryDraft
            .mealPreference
            .trim(),

        favoriteBreathing:
          memoryDraft
            .favoriteBreathing
            .trim(),
      });

      setShowMemoryPanel(false);
    };

  // ==========================================================
  // CLEAR MEMORY
  // ==========================================================

  const clearCoachMemory = () => {
    Alert.alert(
      t("clearMemoryTitle"),
      t("clearMemoryMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clear"),
          style: "destructive",

          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                COACH_MEMORY_KEY
              );

              setCoachMemory({
                ...INITIAL_MEMORY,
              });

              setMemoryDraft({
                ...INITIAL_MEMORY,
              });

              setShowMemoryPanel(false);
            } catch (error) {
              console.log(
                "Clear coach memory error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================================
  // CLEAR CONVERSATION
  // ==========================================================

  const clearConversation = () => {
    Alert.alert(
      t("newConversationTitle"),
      t("newConversationMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clear"),
          style: "destructive",

          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                CONVERSATION_STORAGE_KEY
              );

              setMessages(
                getStarterMessages(
                  language
                )
              );

              setDraft("");
              setIsTyping(false);
              setPendingAction(null);
            } catch (error) {
              console.log(
                "Clear conversation error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const openDetectedScreen =
    (intent) => {
      switch (intent) {
        case "meal":
          goToMealPlanner?.();
          return;

        case "hydration":
          goToHydration?.();
          return;

        case "recovery":
          goToRecovery?.();
          return;

        case "sleep":
          goToSleep?.();
          return;

        case "breathing":
          goToBreathing?.();
          return;

        case "journeyMap":
          goToGPSJourneyMap?.();
          return;

        case "journeys":
          goToJourneys?.();
          return;

        default:
          return;
      }
    };

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  const sendMessage =
    async (
      text = draft,
      detectionText = null
    ) => {
      const cleaned =
        String(
          text || ""
        ).trim();

      if (
        !cleaned ||
        isTyping ||
        cleaned.length > 2000
      ) {
        return;
      }

      const intentText =
        detectionText ||
        cleaned;

      const memoryUpdate =
        detectMemoryUpdate(
          intentText
        );

      let activeMemory = {
        ...coachMemory,
      };

      if (memoryUpdate) {
        activeMemory =
          await saveCoachMemory(
            memoryUpdate
          );
      }

      const contextForMessage = {
        ...mergedWellness,
        coachMemory:
          activeMemory,
      };

      const navigationIntent =
        detectNavigationIntent(
          intentText,
          contextForMessage
        );

      const userMessage = {
        id:
          `user-${Date.now()}`,

        sender:
          "user",

        text:
          cleaned,

        actionIntent:
          null,
      };

      setMessages(
        (current) => [
          ...current,
          userMessage,
        ]
      );

      setDraft("");
      setIsTyping(true);

      try {
        let replyText;

        try {
          replyText =
            await requestCoachReply(
              cleaned,
              activeMemory
            );
        } catch (remoteError) {
          console.log(
            "Remote AI unavailable. Using local coach:",
            remoteError
          );

          replyText =
            createLocalCoachReply(
              intentText,
              contextForMessage
            );
        }

        const coachMessage = {
          id:
            `coach-${Date.now()}`,

          sender:
            "coach",

          text:
            replyText,

          actionIntent:
            navigationIntent,
        };

        setMessages(
          (current) => [
            ...current,
            coachMessage,
          ]
        );

        if (navigationIntent) {
          setPendingAction(
            navigationIntent
          );
        }
      } catch (error) {
        console.log(
          "Coach response error:",
          error
        );

        setMessages(
          (current) => [
            ...current,
            {
              id:
                `coach-error-${Date.now()}`,

              sender:
                "coach",

              text:
                t("responseError"),

              actionIntent:
                null,
            },
          ]
        );
      } finally {
        setIsTyping(false);
      }
    };

  // ==========================================================
  // QUICK PROMPT
  // ==========================================================

  const handleQuickPrompt =
    (prompt) => {
      if (isTyping) {
        return;
      }

      sendMessage(
        prompt.label,
        prompt.coachMessage
      );
    };

  // ==========================================================
  // MEMORY PANEL
  // ==========================================================

  const openMemoryPanel = () => {
    setMemoryDraft({
      preferredWalkTime:
        coachMemory
          .preferredWalkTime ||
        "",

      mealPreference:
        coachMemory
          .mealPreference ||
        "",

      favoriteBreathing:
        coachMemory
          .favoriteBreathing ||
        "",
    });

    setShowMemoryPanel(true);
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? 10
              : 0
          }
        >
          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              style={
                styles.headerButton
              }
              onPress={() =>
                goBack?.()
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-back"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={
                styles.headerCenter
              }
            >
              <Text
                style={styles.eyebrow}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {t("wellness")}
              </Text>

              <Text
                style={styles.title}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {t("yourCoach")}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.headerButton
              }
              onPress={
                openMemoryPanel
              }
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="brain"
                size={23}
                color="#42F58D"
              />
            </TouchableOpacity>
          </View>

          {/* CONVERSATION */}

          <ScrollView
            ref={scrollRef}
            style={
              styles.screenScroll
            }
            contentContainerStyle={
              styles.screenScrollContent
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={
              scrollToBottom
            }
          >
            {/* MEMORY PANEL */}

            {showMemoryPanel && (
              <View
                style={
                  styles.memoryPanel
                }
              >
                <View
                  style={
                    styles.memoryHeader
                  }
                >
                  <View
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={
                        styles.memoryEyebrow
                      }
                    >
                      {t("aiMemory")}
                    </Text>

                    <Text
                      style={
                        styles.memoryTitle
                      }
                    >
                      {t("remembers")}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.memoryCloseButton
                    }
                    onPress={() =>
                      setShowMemoryPanel(
                        false
                      )
                    }
                  >
                    <Ionicons
                      name="close"
                      size={21}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                <MemoryInput
                  icon="time-outline"
                  label={t(
                    "preferredWalkTime"
                  )}
                  value={
                    memoryDraft
                      .preferredWalkTime
                  }
                  placeholder={t(
                    "walkExample"
                  )}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,
                        preferredWalkTime:
                          value,
                      })
                    )
                  }
                />

                <MemoryInput
                  icon="restaurant-outline"
                  label={t(
                    "mealPreference"
                  )}
                  value={
                    memoryDraft
                      .mealPreference
                  }
                  placeholder={t(
                    "mealExample"
                  )}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,
                        mealPreference:
                          value,
                      })
                    )
                  }
                />

                <MemoryInput
                  icon="leaf-outline"
                  label={t(
                    "favoriteBreathing"
                  )}
                  value={
                    memoryDraft
                      .favoriteBreathing
                  }
                  placeholder={t(
                    "breathingExample"
                  )}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (current) => ({
                        ...current,
                        favoriteBreathing:
                          value,
                      })
                    )
                  }
                />

                <TouchableOpacity
                  style={
                    styles.saveMemoryButton
                  }
                  onPress={
                    saveMemoryPanel
                  }
                >
                  <Ionicons
                    name="save-outline"
                    size={19}
                    color="#02111F"
                  />

                  <Text
                    style={
                      styles.saveMemoryText
                    }
                  >
                    {t("saveMemory")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.clearMemoryButton
                  }
                  onPress={
                    clearCoachMemory
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color="#FF7585"
                  />

                  <Text
                    style={
                      styles.clearMemoryText
                    }
                  >
                    {t("clearMemory")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* COACH STATUS */}

            <View
              style={
                styles.coachStatus
              }
            >
              <View
                style={
                  styles.coachOrb
                }
              >
                <MaterialCommunityIcons
                  name="brain"
                  size={34}
                  color="#42F58D"
                />
              </View>

              <View
                style={
                  styles.coachStatusText
                }
              >
                <Text
                  style={
                    styles.coachName
                  }
                >
                  {t("coachName")}
                </Text>

                <Text
                  style={
                    styles.coachReady
                  }
                >
                  {isTyping
                    ? t("preparing")
                    : `${getDayGreeting(
                        language
                      )} • ${t(
                        "ready"
                      )}`}
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.resetButton
                }
                onPress={
                  clearConversation
                }
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#9FCBFF"
                />
              </TouchableOpacity>
            </View>

            {/* MESSAGES */}

            <View
              style={styles.messages}
            >
              {messages.map(
                (message) => {
                  const isUser =
                    message.sender ===
                    "user";

                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.messageRow,

                        isUser
                          ? styles.userMessageRow
                          : styles.coachMessageRow,
                      ]}
                    >
                      {!isUser && (
                        <View
                          style={
                            styles.messageAvatar
                          }
                        >
                          <MaterialCommunityIcons
                            name="brain"
                            size={21}
                            color="#42F58D"
                          />
                        </View>
                      )}

                      <View
                        style={[
                          styles.messageBubble,

                          isUser
                            ? styles.userBubble
                            : styles.coachBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,

                            isUser &&
                              styles.userMessageText,
                          ]}
                        >
                          {message.text}
                        </Text>

                        {!isUser &&
                          message.actionIntent && (
                            <TouchableOpacity
                              style={
                                styles.actionButton
                              }
                              onPress={() =>
                                openDetectedScreen(
                                  message.actionIntent
                                )
                              }
                            >
                              <Text
                                style={
                                  styles.actionButtonText
                                }
                              >
                                {t(
                                  "openFeature"
                                )}
                              </Text>

                              <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#02111F"
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                  );
                }
              )}

              {isTyping && (
                <View
                  style={[
                    styles.messageRow,
                    styles.coachMessageRow,
                  ]}
                >
                  <View
                    style={
                      styles.messageAvatar
                    }
                  >
                    <MaterialCommunityIcons
                      name="brain"
                      size={21}
                      color="#42F58D"
                    />
                  </View>

                  <View
                    style={[
                      styles.messageBubble,
                      styles.coachBubble,
                    ]}
                  >
                    <Text
                      style={
                        styles.typingText
                      }
                    >
                      {t("thinking")}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* RECOMMENDED ACTION */}

            {pendingAction && (
              <TouchableOpacity
                style={
                  styles.pendingActionButton
                }
                onPress={() =>
                  openDetectedScreen(
                    pendingAction
                  )
                }
              >
                <Text
                  style={
                    styles.pendingActionText
                  }
                >
                  {t(
                    "openRecommended"
                  )}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#02111F"
                />
              </TouchableOpacity>
            )}

            {/* QUICK COACHING */}

            <Text
              style={styles.quickTitle}
            >
              {t("quickCoaching")}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.quickPromptRow
              }
            >
              {quickPrompts.map(
                (prompt) => (
                  <TouchableOpacity
                    key={prompt.id}
                    style={
                      styles.quickPrompt
                    }
                    onPress={() =>
                      handleQuickPrompt(
                        prompt
                      )
                    }
                    disabled={isTyping}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={prompt.icon}
                      size={19}
                      color="#42F58D"
                    />

                    <Text
                      style={
                        styles.quickPromptText
                      }
                    >
                      {prompt.label}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <View
              style={{ height: 24 }}
            />
          </ScrollView>

          {/* TEXT COMPOSER */}

          <View
            style={
              styles.composerArea
            }
          >
            <View
              style={styles.composer}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={23}
                color="#42F58D"
                style={styles.chatIcon}
              />

              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={t(
                  "placeholder"
                )}
                placeholderTextColor="#71859D"
                style={styles.input}
                multiline
                maxLength={2000}
                editable={!isTyping}
                returnKeyType="send"
                blurOnSubmit
                onSubmitEditing={() => {
                  if (canSend) {
                    sendMessage();
                  }
                }}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,

                  !canSend &&
                    styles.sendButtonDisabled,
                ]}
                onPress={() =>
                  sendMessage()
                }
                disabled={!canSend}
              >
                <Ionicons
                  name="arrow-up"
                  size={26}
                  color="#02111F"
                />
              </TouchableOpacity>
            </View>

            <Text
              style={
                styles.disclaimer
              }
            >
              {t("disclaimer")}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#173656",
  },

  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B223A",
    borderWidth: 1,
    borderColor: "#24527A",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  eyebrow: {
    color: "#E5B52E",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 3,
  },

  screenScroll: {
    flex: 1,
  },

  screenScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },

  coachStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#081C31",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#28577E",
    padding: 16,
    marginBottom: 20,
  },

  coachOrb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#083045",
    borderWidth: 1,
    borderColor: "#14617A",
  },

  coachStatusText: {
    flex: 1,
    marginLeft: 13,
  },

  coachName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  coachReady: {
    color: "#91A9C5",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  resetButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102A45",
  },

  memoryPanel: {
    backgroundColor: "#07182B",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#315B84",
    padding: 18,
    marginBottom: 20,
  },

  memoryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  memoryEyebrow: {
    color: "#42F58D",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.5,
  },

  memoryTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 5,
  },

  memoryCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132B45",
  },

  memoryInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2037",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#234C71",
    padding: 12,
    marginBottom: 12,
  },

  memoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#073245",
    marginRight: 12,
  },

  memoryInputWrap: {
    flex: 1,
  },

  memoryLabel: {
    color: "#9EB5CE",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  memoryInput: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 3,
  },

  saveMemoryButton: {
    minHeight: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42F58D",
    marginTop: 5,
  },

  saveMemoryText: {
    color: "#02111F",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
  },

  clearMemoryButton: {
    minHeight: 50,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#24121D",
    borderWidth: 1,
    borderColor: "#71313E",
    marginTop: 10,
  },

  clearMemoryText: {
    color: "#FF7585",
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },

  messages: {
    width: "100%",
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  coachMessageRow: {
    justifyContent: "flex-start",
  },

  userMessageRow: {
    justifyContent: "flex-end",
  },

  messageAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#073044",
    marginRight: 10,
    marginBottom: 4,
  },

  messageBubble: {
    maxWidth: "82%",
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 15,
  },

  coachBubble: {
    backgroundColor: "#0B2641",
    borderWidth: 1,
    borderColor: "#2A5D86",
    borderBottomLeftRadius: 7,
  },

  userBubble: {
    backgroundColor: "#FFC746",
    borderBottomRightRadius: 7,
  },

  messageText: {
    color: "#DCEBFF",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },

  userMessageText: {
    color: "#02111F",
    fontWeight: "800",
  },

  typingText: {
    color: "#91A9C5",
    fontSize: 15,
    fontWeight: "800",
    fontStyle: "italic",
  },

  actionButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC746",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginTop: 13,
  },

  actionButtonText: {
    color: "#02111F",
    fontSize: 14,
    fontWeight: "900",
    marginRight: 8,
  },

  pendingActionButton: {
    minHeight: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC746",
    marginTop: 4,
    marginBottom: 22,
    paddingHorizontal: 14,
  },

  pendingActionText: {
    flexShrink: 1,
    color: "#02111F",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 9,
    textAlign: "center",
  },

  quickTitle: {
    color: "#91A9C5",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.5,
    marginTop: 8,
    marginBottom: 12,
  },

  quickPromptRow: {
    paddingRight: 18,
  },

  quickPrompt: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2138",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2A577E",
    paddingHorizontal: 16,
    marginRight: 10,
  },

  quickPromptText: {
    color: "#C7D9EE",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },

  composerArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:
      Platform.OS === "ios"
        ? 12
        : 10,
    backgroundColor: "#03101F",
    borderTopWidth: 1,
    borderTopColor: "#183B5D",
  },

  composer: {
    minHeight: 62,
    maxHeight: 130,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#091F35",
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "#2A577E",
    paddingHorizontal: 8,
  },

  chatIcon: {
    marginLeft: 8,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC746",
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  disclaimer: {
    color: "#6F849E",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
});