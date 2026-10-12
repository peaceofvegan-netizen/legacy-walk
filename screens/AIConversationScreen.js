import React, {
  useCallback,
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
// MULTILINGUAL TEXT-ONLY AI COACH
// ============================================================

const CONVERSATION_STORAGE_KEY =
  "legathonAIConversationMessages";

const COACH_MEMORY_KEY =
  "legathonAICoachMemory";

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(value) {
  const code = String(value || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  const supported = [
    "en",
    "es",
    "fr",
    "de",
    "pt",
    "it",
    "ja",
    "ko",
    "zh",
    "ar",
  ];

  return supported.includes(code)
    ? code
    : "en";
}

function getConversationStorageKey(language) {
  return `${CONVERSATION_STORAGE_KEY}_${normalizeLanguage(
    language
  )}`;
}

const LOCALES = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  ar: "ar",
};

function formatNumber(value, language) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  try {
    return amount.toLocaleString(
      LOCALES[normalizeLanguage(language)]
    );
  } catch {
    return amount.toLocaleString();
  }
}

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

    // LOCAL COACH
    preferredWalk:
      "You prefer walking at {time}. That remains a good time if your schedule and conditions allow.",

    journeyWalk:
      "Continue your {journey} journey. You are {progress}% complete{checkpoint}. Begin at a comfortable pace and build momentum gradually.",

    checkpointText:
      " and currently at checkpoint {checkpoint}",

    stepGoalComplete:
      "You completed today’s step goal. A short recovery walk is optional if you still feel well.",

    stepsRemaining:
      "You are {steps} steps from today’s goal. Start with a comfortable 15-minute walk and reassess how you feel afterward.",

    recoveryScore:
      "Your current recovery score is {score}%. Prioritize hydration, protein, gentle movement, and quality sleep.",

    recoveryMissing:
      "Recovery has not been recorded yet. Check your energy, soreness, hydration, and sleep before choosing today’s walking intensity.",

    savedMeal:
      "Your saved meal preference is {preference}. Build today’s meals around lean protein, vegetables, a quality carbohydrate, and healthy fat.",

    mealAdvice:
      "Build your plate around lean protein, vegetables, a quality carbohydrate, and healthy fat. Open the Meal Planner for a complete daily plan.",

    hydrationRemaining:
      "You have {amount} ounces remaining toward today’s hydration goal. Drink gradually throughout the day.",

    hydrationComplete:
      "You reached today’s hydration goal. Continue drinking according to thirst, activity, and weather.",

    sleepRecorded:
      "You recorded {hours} hours of sleep. Keep your bedtime consistent and reduce bright screens before bed tonight.",

    sleepMissing:
      "Sleep has not been recorded yet. Aim for a consistent bedtime, a cool dark room, and a calm wind-down routine.",

    favoriteBreathingReply:
      "Your favorite exercise is {exercise}. Use it now for several slow rounds while keeping your shoulders relaxed.",

    breathingAdvice:
      "Try four rounds of breathing: inhale for four seconds, hold for four, exhale for six, then pause briefly before repeating.",

    activeJourney:
      "Your active journey is {journey}. You are {progress}% complete{checkpoint}.",

    noJourney:
      "You do not have an active journey yet. Open Journeys to choose one and begin GPS coaching.",

    progressSummary:
      "Today you have {steps} steps toward your {goal}-step goal. Hydration is {hydration} of {hydrationGoal} ounces{journey}.",

    progressJourney:
      ". Your {journey} journey is {progress}% complete.",

    defaultCoach:
      "I can help with walking, recovery, meals, hydration, sleep, breathing, journey coaching, and progress reviews. What would you like to improve today?",
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

    remoteError:
      "No se pudo contactar al entrenador IA.",

    emptyResponse:
      "El entrenador IA no devolvió una respuesta.",

    preferredWalk:
      "Prefieres caminar a las {time}. Sigue siendo un buen momento si tu horario y las condiciones lo permiten.",

    journeyWalk:
      "Continúa tu recorrido {journey}. Has completado el {progress}%{checkpoint}. Comienza a un ritmo cómodo y aumenta gradualmente.",

    checkpointText:
      " y actualmente estás en el punto de control {checkpoint}",

    stepGoalComplete:
      "Has completado tu meta de pasos de hoy. Puedes hacer una caminata corta de recuperación si todavía te sientes bien.",

    stepsRemaining:
      "Te faltan {steps} pasos para alcanzar la meta de hoy. Comienza con una caminata cómoda de 15 minutos y después evalúa cómo te sientes.",

    recoveryScore:
      "Tu puntuación actual de recuperación es {score}%. Prioriza la hidratación, las proteínas, el movimiento suave y un sueño de calidad.",

    recoveryMissing:
      "Aún no se ha registrado tu recuperación. Revisa tu energía, molestias, hidratación y sueño antes de elegir la intensidad de la caminata.",

    savedMeal:
      "Tu preferencia de comida guardada es {preference}. Organiza tus comidas con proteína magra, verduras, carbohidratos de calidad y grasas saludables.",

    mealAdvice:
      "Organiza tu plato con proteína magra, verduras, carbohidratos de calidad y grasas saludables. Abre el Planificador de Comidas para obtener un plan diario completo.",

    hydrationRemaining:
      "Te quedan {amount} onzas para alcanzar la meta de hidratación de hoy. Bebe gradualmente durante el día.",

    hydrationComplete:
      "Has alcanzado la meta de hidratación de hoy. Continúa bebiendo según tu sed, actividad y clima.",

    sleepRecorded:
      "Registraste {hours} horas de sueño. Mantén un horario constante y reduce las pantallas brillantes antes de acostarte.",

    sleepMissing:
      "Aún no se ha registrado el sueño. Intenta mantener una hora constante para dormir, una habitación fresca y oscura y una rutina relajante.",

    favoriteBreathingReply:
      "Tu ejercicio favorito es {exercise}. Haz varias rondas lentas manteniendo los hombros relajados.",

    breathingAdvice:
      "Prueba cuatro rondas de respiración: inhala durante cuatro segundos, mantén cuatro, exhala durante seis y haz una breve pausa antes de repetir.",

    activeJourney:
      "Tu recorrido activo es {journey}. Has completado el {progress}%{checkpoint}.",

    noJourney:
      "Todavía no tienes un recorrido activo. Abre Recorridos para elegir uno y comenzar el entrenamiento GPS.",

    progressSummary:
      "Hoy llevas {steps} pasos de una meta de {goal}. Tu hidratación es {hydration} de {hydrationGoal} onzas{journey}.",

    progressJourney:
      ". Tu recorrido {journey} está completado al {progress}%.",

    defaultCoach:
      "Puedo ayudarte con caminatas, recuperación, comidas, hidratación, sueño, respiración, recorridos y progreso. ¿Qué te gustaría mejorar hoy?",
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

    remoteError:
      "Impossible de joindre le coach IA.",

    emptyResponse:
      "Le coach IA n’a renvoyé aucune réponse.",

    preferredWalk:
      "Vous préférez marcher à {time}. Cela reste un bon moment si votre emploi du temps et les conditions le permettent.",

    journeyWalk:
      "Continuez votre parcours {journey}. Vous avez terminé {progress}%{checkpoint}. Commencez à un rythme confortable et augmentez progressivement.",

    checkpointText:
      " et vous êtes actuellement au point de contrôle {checkpoint}",

    stepGoalComplete:
      "Vous avez atteint votre objectif de pas aujourd’hui. Une courte marche de récupération est facultative si vous vous sentez toujours bien.",

    stepsRemaining:
      "Il vous reste {steps} pas pour atteindre votre objectif du jour. Commencez par une marche confortable de 15 minutes, puis réévaluez votre état.",

    recoveryScore:
      "Votre score de récupération actuel est de {score}%. Privilégiez l’hydratation, les protéines, les mouvements doux et un sommeil de qualité.",

    recoveryMissing:
      "Votre récupération n’a pas encore été enregistrée. Vérifiez votre énergie, vos courbatures, votre hydratation et votre sommeil avant de choisir l’intensité de votre marche.",

    savedMeal:
      "Votre préférence alimentaire enregistrée est {preference}. Composez vos repas avec des protéines maigres, des légumes, des glucides de qualité et de bonnes graisses.",

    mealAdvice:
      "Composez votre assiette avec des protéines maigres, des légumes, des glucides de qualité et de bonnes graisses. Ouvrez le Planificateur de Repas pour un programme quotidien complet.",

    hydrationRemaining:
      "Il vous reste {amount} onces pour atteindre votre objectif d’hydratation aujourd’hui. Buvez progressivement au cours de la journée.",

    hydrationComplete:
      "Vous avez atteint votre objectif d’hydratation aujourd’hui. Continuez à boire selon votre soif, votre activité et la météo.",

    sleepRecorded:
      "Vous avez enregistré {hours} heures de sommeil. Gardez une heure de coucher régulière et réduisez les écrans lumineux avant de dormir.",

    sleepMissing:
      "Votre sommeil n’a pas encore été enregistré. Visez une heure de coucher régulière, une chambre fraîche et sombre et une routine calme.",

    favoriteBreathingReply:
      "Votre exercice préféré est {exercise}. Faites maintenant plusieurs cycles lents en gardant les épaules détendues.",

    breathingAdvice:
      "Essayez quatre cycles de respiration : inspirez pendant quatre secondes, retenez quatre secondes, expirez pendant six secondes, puis faites une courte pause avant de recommencer.",

    activeJourney:
      "Votre parcours actif est {journey}. Vous avez terminé {progress}%{checkpoint}.",

    noJourney:
      "Vous n’avez pas encore de parcours actif. Ouvrez Voyages pour en choisir un et commencer le coaching GPS.",

    progressSummary:
      "Aujourd’hui, vous avez effectué {steps} pas sur un objectif de {goal}. Votre hydratation est de {hydration} sur {hydrationGoal} onces{journey}.",

    progressJourney:
      ". Votre parcours {journey} est terminé à {progress}%.",

    defaultCoach:
      "Je peux vous aider avec la marche, la récupération, les repas, l’hydratation, le sommeil, la respiration, votre parcours et vos progrès. Que souhaitez-vous améliorer aujourd’hui ?",
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

    remoteError:
      "Der KI-Coach ist nicht erreichbar.",

    emptyResponse:
      "Der KI-Coach hat keine Antwort geliefert.",

    preferredWalk:
      "Du gehst bevorzugt um {time} spazieren. Das bleibt eine gute Zeit, wenn dein Zeitplan und die Bedingungen es zulassen.",

    journeyWalk:
      "Setze deine {journey}-Reise fort. Du hast {progress}% abgeschlossen{checkpoint}. Beginne in einem angenehmen Tempo und steigere dich langsam.",

    checkpointText:
      " und bist derzeit an Kontrollpunkt {checkpoint}",

    stepGoalComplete:
      "Du hast dein heutiges Schrittziel erreicht. Ein kurzer Erholungsspaziergang ist optional, wenn du dich weiterhin gut fühlst.",

    stepsRemaining:
      "Dir fehlen noch {steps} Schritte bis zu deinem heutigen Ziel. Beginne mit einem angenehmen 15-minütigen Spaziergang und prüfe danach, wie du dich fühlst.",

    recoveryScore:
      "Dein aktueller Erholungswert beträgt {score}%. Achte auf Flüssigkeit, Protein, sanfte Bewegung und guten Schlaf.",

    recoveryMissing:
      "Deine Erholung wurde noch nicht erfasst. Prüfe Energie, Muskelkater, Flüssigkeitszufuhr und Schlaf, bevor du die heutige Gehintensität wählst.",

    savedMeal:
      "Deine gespeicherte Essenspräferenz ist {preference}. Plane deine Mahlzeiten mit magerem Protein, Gemüse, hochwertigen Kohlenhydraten und gesunden Fetten.",

    mealAdvice:
      "Stelle deinen Teller aus magerem Protein, Gemüse, hochwertigen Kohlenhydraten und gesunden Fetten zusammen. Öffne den Mahlzeitenplaner für einen vollständigen Tagesplan.",

    hydrationRemaining:
      "Dir fehlen noch {amount} Unzen bis zu deinem heutigen Flüssigkeitsziel. Trinke über den Tag verteilt.",

    hydrationComplete:
      "Du hast dein heutiges Flüssigkeitsziel erreicht. Trinke weiterhin entsprechend Durst, Aktivität und Wetter.",

    sleepRecorded:
      "Du hast {hours} Stunden Schlaf erfasst. Halte eine regelmäßige Schlafenszeit ein und reduziere helle Bildschirme vor dem Schlafengehen.",

    sleepMissing:
      "Schlaf wurde noch nicht erfasst. Versuche eine regelmäßige Schlafenszeit, ein kühles dunkles Zimmer und eine ruhige Abendroutine.",

    favoriteBreathingReply:
      "Deine bevorzugte Übung ist {exercise}. Nutze sie jetzt für mehrere langsame Runden und halte deine Schultern entspannt.",

    breathingAdvice:
      "Versuche vier Atemrunden: vier Sekunden einatmen, vier Sekunden halten, sechs Sekunden ausatmen und kurz pausieren.",

    activeJourney:
      "Deine aktive Reise ist {journey}. Du hast {progress}% abgeschlossen{checkpoint}.",

    noJourney:
      "Du hast noch keine aktive Reise. Öffne Reisen, wähle eine aus und starte das GPS-Coaching.",

    progressSummary:
      "Heute hast du {steps} Schritte von deinem Ziel von {goal} erreicht. Deine Flüssigkeitszufuhr beträgt {hydration} von {hydrationGoal} Unzen{journey}.",

    progressJourney:
      ". Deine {journey}-Reise ist zu {progress}% abgeschlossen.",

    defaultCoach:
      "Ich kann dir bei Gehen, Erholung, Mahlzeiten, Flüssigkeitszufuhr, Schlaf, Atmung, Reise-Coaching und Fortschritt helfen. Was möchtest du heute verbessern?",
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

    remoteError:
      "Não foi possível acessar o Coach IA.",

    emptyResponse:
      "O Coach IA não retornou uma resposta.",

    preferredWalk:
      "Você prefere caminhar às {time}. Esse continua sendo um bom horário se sua agenda e as condições permitirem.",

    journeyWalk:
      "Continue sua jornada {journey}. Você concluiu {progress}%{checkpoint}. Comece em um ritmo confortável e aumente gradualmente.",

    checkpointText:
      " e está atualmente no ponto de controle {checkpoint}",

    stepGoalComplete:
      "Você concluiu sua meta de passos de hoje. Uma caminhada curta de recuperação é opcional se você ainda estiver se sentindo bem.",

    stepsRemaining:
      "Faltam {steps} passos para sua meta de hoje. Comece com uma caminhada confortável de 15 minutos e depois avalie como se sente.",

    recoveryScore:
      "Sua pontuação atual de recuperação é {score}%. Priorize hidratação, proteína, movimento leve e sono de qualidade.",

    recoveryMissing:
      "Sua recuperação ainda não foi registrada. Verifique energia, dores, hidratação e sono antes de escolher a intensidade da caminhada.",

    savedMeal:
      "Sua preferência alimentar salva é {preference}. Monte suas refeições com proteína magra, vegetais, carboidratos de qualidade e gorduras saudáveis.",

    mealAdvice:
      "Monte seu prato com proteína magra, vegetais, carboidratos de qualidade e gorduras saudáveis. Abra o Planejador de Refeições para um plano diário completo.",

    hydrationRemaining:
      "Faltam {amount} onças para sua meta de hidratação de hoje. Beba gradualmente ao longo do dia.",

    hydrationComplete:
      "Você atingiu sua meta de hidratação de hoje. Continue bebendo de acordo com sua sede, atividade e clima.",

    sleepRecorded:
      "Você registrou {hours} horas de sono. Mantenha um horário consistente para dormir e reduza telas brilhantes antes de deitar.",

    sleepMissing:
      "O sono ainda não foi registrado. Tente manter um horário regular, um quarto fresco e escuro e uma rotina relaxante.",

    favoriteBreathingReply:
      "Seu exercício favorito é {exercise}. Faça agora várias rodadas lentas mantendo os ombros relaxados.",

    breathingAdvice:
      "Faça quatro rodadas de respiração: inspire por quatro segundos, segure por quatro, expire por seis e faça uma breve pausa antes de repetir.",

    activeJourney:
      "Sua jornada ativa é {journey}. Você concluiu {progress}%{checkpoint}.",

    noJourney:
      "Você ainda não tem uma jornada ativa. Abra Jornadas para escolher uma e iniciar o coaching por GPS.",

    progressSummary:
      "Hoje você tem {steps} passos de uma meta de {goal}. Sua hidratação está em {hydration} de {hydrationGoal} onças{journey}.",

    progressJourney:
      ". Sua jornada {journey} está {progress}% concluída.",

    defaultCoach:
      "Posso ajudar com caminhada, recuperação, refeições, hidratação, sono, respiração, coaching de jornada e progresso. O que você gostaria de melhorar hoje?",
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

    remoteError:
      "Impossibile raggiungere il Coach IA.",

    emptyResponse:
      "Il Coach IA non ha restituito una risposta.",

    preferredWalk:
      "Preferisci camminare alle {time}. Rimane un buon momento se i tuoi impegni e le condizioni lo consentono.",

    journeyWalk:
      "Continua il tuo percorso {journey}. Hai completato il {progress}%{checkpoint}. Inizia a un ritmo confortevole e aumenta gradualmente.",

    checkpointText:
      " e sei attualmente al checkpoint {checkpoint}",

    stepGoalComplete:
      "Hai completato l’obiettivo di passi di oggi. Una breve camminata di recupero è facoltativa se ti senti ancora bene.",

    stepsRemaining:
      "Ti mancano {steps} passi per raggiungere l’obiettivo di oggi. Inizia con una camminata confortevole di 15 minuti e poi valuta come ti senti.",

    recoveryScore:
      "Il tuo punteggio di recupero attuale è {score}%. Dai priorità a idratazione, proteine, movimento leggero e sonno di qualità.",

    recoveryMissing:
      "Il recupero non è ancora stato registrato. Controlla energia, indolenzimento, idratazione e sonno prima di scegliere l’intensità della camminata.",

    savedMeal:
      "La tua preferenza alimentare salvata è {preference}. Organizza i pasti con proteine magre, verdure, carboidrati di qualità e grassi sani.",

    mealAdvice:
      "Componi il piatto con proteine magre, verdure, carboidrati di qualità e grassi sani. Apri il Pianificatore Pasti per un piano giornaliero completo.",

    hydrationRemaining:
      "Ti mancano {amount} once per raggiungere l’obiettivo di idratazione di oggi. Bevi gradualmente durante la giornata.",

    hydrationComplete:
      "Hai raggiunto l’obiettivo di idratazione di oggi. Continua a bere in base a sete, attività e condizioni climatiche.",

    sleepRecorded:
      "Hai registrato {hours} ore di sonno. Mantieni un orario regolare e riduci gli schermi luminosi prima di dormire.",

    sleepMissing:
      "Il sonno non è ancora stato registrato. Cerca di mantenere un orario regolare, una stanza fresca e buia e una routine rilassante.",

    favoriteBreathingReply:
      "Il tuo esercizio preferito è {exercise}. Esegui ora diversi cicli lenti mantenendo le spalle rilassate.",

    breathingAdvice:
      "Prova quattro cicli di respirazione: inspira per quattro secondi, trattieni per quattro, espira per sei e fai una breve pausa prima di ripetere.",

    activeJourney:
      "Il tuo percorso attivo è {journey}. Hai completato il {progress}%{checkpoint}.",

    noJourney:
      "Non hai ancora un percorso attivo. Apri Percorsi per sceglierne uno e iniziare il coaching GPS.",

    progressSummary:
      "Oggi hai {steps} passi su un obiettivo di {goal}. L’idratazione è {hydration} su {hydrationGoal} once{journey}.",

    progressJourney:
      ". Il tuo percorso {journey} è completato al {progress}%.",

    defaultCoach:
      "Posso aiutarti con camminata, recupero, pasti, idratazione, sonno, respirazione, coaching del percorso e progressi. Cosa vuoi migliorare oggi?",
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

    remoteError:
      "AIコーチに接続できません。",

    emptyResponse:
      "AIコーチから応答がありません。",

    preferredWalk:
      "{time}に歩くのがお好みです。予定や状況に問題がなければ、その時間で続けてください。",

    journeyWalk:
      "{journey}ジャーニーを続けましょう。現在{progress}%完了しています{checkpoint}。無理のないペースから始め、徐々にペースを上げましょう。",

    checkpointText:
      "。現在チェックポイント{checkpoint}です",

    stepGoalComplete:
      "今日の歩数目標を達成しました。体調が良ければ、短いリカバリーウォークを追加してもかまいません。",

    stepsRemaining:
      "今日の目標まであと{steps}歩です。まず15分間、無理のないペースで歩き、その後の体調を確認しましょう。",

    recoveryScore:
      "現在の回復スコアは{score}%です。水分補給、たんぱく質、軽い運動、質の良い睡眠を優先しましょう。",

    recoveryMissing:
      "回復状態はまだ記録されていません。今日のウォーキング強度を決める前に、エネルギー、筋肉痛、水分補給、睡眠を確認しましょう。",

    savedMeal:
      "保存されている食事の好みは{preference}です。たんぱく質、野菜、良質な炭水化物、健康的な脂質を中心に食事を組み立てましょう。",

    mealAdvice:
      "たんぱく質、野菜、良質な炭水化物、健康的な脂質を中心に食事を組み立てましょう。詳しい一日のプランは食事プランナーを開いてください。",

    hydrationRemaining:
      "今日の水分目標まであと{amount}オンスです。一日を通して少しずつ飲みましょう。",

    hydrationComplete:
      "今日の水分補給目標を達成しました。喉の渇き、活動量、天候に合わせて引き続き水分を取りましょう。",

    sleepRecorded:
      "{hours}時間の睡眠を記録しました。就寝時間を一定にし、寝る前の明るい画面を控えましょう。",

    sleepMissing:
      "睡眠はまだ記録されていません。一定の就寝時間、涼しく暗い部屋、落ち着いた就寝前ルーティンを意識しましょう。",

    favoriteBreathingReply:
      "お気に入りの呼吸法は{exercise}です。肩の力を抜き、ゆっくり数回行いましょう。",

    breathingAdvice:
      "4秒吸い、4秒止め、6秒吐き、少し休む呼吸を4回繰り返してみましょう。",

    activeJourney:
      "現在のジャーニーは{journey}です。{progress}%完了しています{checkpoint}。",

    noJourney:
      "現在アクティブなジャーニーはありません。ジャーニーを開いて選択し、GPSコーチングを開始してください。",

    progressSummary:
      "今日は{goal}歩の目標に対して{steps}歩です。水分補給は{hydration}/{hydrationGoal}オンスです{journey}",

    progressJourney:
      "。{journey}ジャーニーは{progress}%完了しています。",

    defaultCoach:
      "ウォーキング、回復、食事、水分補給、睡眠、呼吸、ジャーニー、進捗をサポートできます。今日は何を改善したいですか？",
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

    remoteError:
      "AI 코치에 연결할 수 없습니다.",

    emptyResponse:
      "AI 코치의 응답이 없습니다.",

    preferredWalk:
      "{time}에 걷는 것을 선호합니다. 일정과 상황이 허락한다면 좋은 시간입니다.",

    journeyWalk:
      "{journey} 여정을 계속하세요. 현재 {progress}% 완료했습니다{checkpoint}. 편안한 속도로 시작해 점차 페이스를 높이세요.",

    checkpointText:
      " 그리고 현재 체크포인트 {checkpoint}에 있습니다",

    stepGoalComplete:
      "오늘의 걸음 수 목표를 완료했습니다. 몸 상태가 좋다면 짧은 회복 걷기를 추가할 수 있습니다.",

    stepsRemaining:
      "오늘 목표까지 {steps}걸음 남았습니다. 편안한 15분 걷기로 시작한 뒤 몸 상태를 확인하세요.",

    recoveryScore:
      "현재 회복 점수는 {score}%입니다. 수분, 단백질, 가벼운 움직임과 충분한 수면을 우선하세요.",

    recoveryMissing:
      "아직 회복 상태가 기록되지 않았습니다. 오늘 걷기 강도를 결정하기 전에 에너지, 근육통, 수분 섭취와 수면을 확인하세요.",

    savedMeal:
      "저장된 식사 선호도는 {preference}입니다. 저지방 단백질, 채소, 좋은 탄수화물과 건강한 지방을 중심으로 식사하세요.",

    mealAdvice:
      "저지방 단백질, 채소, 좋은 탄수화물과 건강한 지방을 중심으로 식사하세요. 전체 일일 계획은 식사 플래너를 열어 확인하세요.",

    hydrationRemaining:
      "오늘 수분 목표까지 {amount}온스 남았습니다. 하루 동안 조금씩 나누어 마시세요.",

    hydrationComplete:
      "오늘의 수분 섭취 목표를 달성했습니다. 갈증, 활동량과 날씨에 맞춰 계속 수분을 섭취하세요.",

    sleepRecorded:
      "{hours}시간의 수면을 기록했습니다. 일정한 취침 시간을 유지하고 잠들기 전 밝은 화면을 줄이세요.",

    sleepMissing:
      "아직 수면이 기록되지 않았습니다. 일정한 취침 시간, 시원하고 어두운 방, 편안한 취침 루틴을 유지하세요.",

    favoriteBreathingReply:
      "선호하는 호흡 운동은 {exercise}입니다. 어깨에 힘을 빼고 천천히 여러 번 반복하세요.",

    breathingAdvice:
      "4초 들이마시고, 4초 멈추고, 6초 내쉰 뒤 잠시 쉬는 호흡을 네 번 반복해 보세요.",

    activeJourney:
      "현재 활성 여정은 {journey}입니다. {progress}% 완료했습니다{checkpoint}.",

    noJourney:
      "아직 활성 여정이 없습니다. 여정을 열어 하나를 선택하고 GPS 코칭을 시작하세요.",

    progressSummary:
      "오늘 {goal}걸음 목표 중 {steps}걸음을 걸었습니다. 수분 섭취는 {hydration}/{hydrationGoal}온스입니다{journey}.",

    progressJourney:
      ". {journey} 여정은 {progress}% 완료했습니다.",

    defaultCoach:
      "걷기, 회복, 식사, 수분, 수면, 호흡, 여정 코칭과 진행 상황을 도와드릴 수 있습니다. 오늘 무엇을 개선하고 싶으신가요?",
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

    remoteError:
      "无法连接 AI 教练。",

    emptyResponse:
      "AI 教练没有返回回复。",

    preferredWalk:
      "您喜欢在 {time} 步行。如果您的时间安排和环境允许，这仍然是一个合适的时间。",

    journeyWalk:
      "继续您的 {journey} 旅程。您已完成 {progress}%{checkpoint}。请从舒适的速度开始，然后逐渐增加强度。",

    checkpointText:
      "，目前位于检查点 {checkpoint}",

    stepGoalComplete:
      "您已经完成今天的步数目标。如果感觉良好，可以进行一次短时间的恢复步行。",

    stepsRemaining:
      "距离今天的目标还剩 {steps} 步。先进行舒适的15分钟步行，然后再评估身体感觉。",

    recoveryScore:
      "您当前的恢复评分为 {score}%。请优先补水、摄入蛋白质、进行轻度活动并保证高质量睡眠。",

    recoveryMissing:
      "尚未记录恢复情况。在选择今天的步行强度前，请检查精力、酸痛程度、补水和睡眠情况。",

    savedMeal:
      "您保存的饮食偏好是 {preference}。建议以瘦蛋白、蔬菜、优质碳水化合物和健康脂肪搭配今天的饮食。",

    mealAdvice:
      "建议以瘦蛋白、蔬菜、优质碳水化合物和健康脂肪搭配餐食。打开饮食计划器查看完整的每日计划。",

    hydrationRemaining:
      "距离今天的补水目标还剩 {amount} 盎司。请在一天中逐渐补充水分。",

    hydrationComplete:
      "您已经达到今天的补水目标。请根据口渴程度、活动量和天气继续补充水分。",

    sleepRecorded:
      "您记录了 {hours} 小时睡眠。保持规律的睡眠时间，并在睡前减少使用明亮屏幕。",

    sleepMissing:
      "尚未记录睡眠。建议保持固定的睡眠时间、凉爽黑暗的房间和放松的睡前习惯。",

    favoriteBreathingReply:
      "您最喜欢的呼吸练习是 {exercise}。现在可以慢慢做几轮，并保持肩膀放松。",

    breathingAdvice:
      "尝试四轮呼吸：吸气4秒，屏息4秒，呼气6秒，然后短暂停顿再重复。",

    activeJourney:
      "您当前的旅程是 {journey}。已经完成 {progress}%{checkpoint}。",

    noJourney:
      "您目前没有正在进行的旅程。打开旅程选择一个，然后开始 GPS 指导。",

    progressSummary:
      "今天您已完成 {steps} 步，目标为 {goal} 步。补水进度为 {hydration}/{hydrationGoal} 盎司{journey}。",

    progressJourney:
      "。您的 {journey} 旅程已完成 {progress}%。",

    defaultCoach:
      "我可以帮助您进行步行、恢复、饮食、补水、睡眠、呼吸、旅程指导和进度分析。今天您想改善什么？",
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

    remoteError:
      "تعذر الوصول إلى مدرب الذكاء الاصطناعي.",

    emptyResponse:
      "لم يُرجع مدرب الذكاء الاصطناعي أي رد.",

    preferredWalk:
      "تفضل المشي في {time}. يظل هذا وقتًا مناسبًا إذا كان جدولك والظروف يسمحان بذلك.",

    journeyWalk:
      "واصل رحلة {journey}. لقد أكملت {progress}%{checkpoint}. ابدأ بوتيرة مريحة وزد سرعتك تدريجيًا.",

    checkpointText:
      " وأنت حاليًا عند نقطة التفتيش {checkpoint}",

    stepGoalComplete:
      "لقد أكملت هدف خطوات اليوم. يمكنك القيام بمشي قصير للتعافي إذا كنت لا تزال تشعر بأنك بخير.",

    stepsRemaining:
      "يتبقى لك {steps} خطوة للوصول إلى هدف اليوم. ابدأ بمشي مريح لمدة 15 دقيقة ثم قيّم شعورك بعد ذلك.",

    recoveryScore:
      "درجة التعافي الحالية لديك هي {score}%. أعطِ الأولوية للترطيب والبروتين والحركة الخفيفة والنوم الجيد.",

    recoveryMissing:
      "لم يتم تسجيل التعافي بعد. تحقق من طاقتك والألم والترطيب والنوم قبل اختيار شدة المشي اليوم.",

    savedMeal:
      "تفضيلك الغذائي المحفوظ هو {preference}. اجعل وجباتك تعتمد على البروتين قليل الدهون والخضروات والكربوهيدرات الجيدة والدهون الصحية.",

    mealAdvice:
      "اجعل طبقك يحتوي على بروتين قليل الدهون وخضروات وكربوهيدرات جيدة ودهون صحية. افتح مخطط الوجبات للحصول على خطة يومية كاملة.",

    hydrationRemaining:
      "يتبقى لك {amount} أونصة للوصول إلى هدف الترطيب اليوم. اشرب تدريجيًا خلال اليوم.",

    hydrationComplete:
      "لقد وصلت إلى هدف الترطيب اليوم. استمر في الشرب وفقًا للعطش والنشاط والطقس.",

    sleepRecorded:
      "لقد سجلت {hours} ساعة من النوم. حافظ على وقت نوم منتظم وقلل من الشاشات الساطعة قبل النوم.",

    sleepMissing:
      "لم يتم تسجيل النوم بعد. حاول الالتزام بوقت نوم منتظم وغرفة باردة ومظلمة وروتين هادئ قبل النوم.",

    favoriteBreathingReply:
      "تمرين التنفس المفضل لديك هو {exercise}. قم الآن بعدة جولات ببطء مع إبقاء كتفيك مسترخيين.",

    breathingAdvice:
      "جرب أربع جولات من التنفس: استنشق لمدة أربع ثوانٍ، احبس النفس أربع ثوانٍ، ازفر لمدة ست ثوانٍ، ثم توقف قليلًا قبل التكرار.",

    activeJourney:
      "رحلتك الحالية هي {journey}. لقد أكملت {progress}%{checkpoint}.",

    noJourney:
      "ليس لديك رحلة نشطة حتى الآن. افتح الرحلات واختر واحدة لبدء التدريب باستخدام GPS.",

    progressSummary:
      "لديك اليوم {steps} خطوة من هدف يبلغ {goal} خطوة. الترطيب هو {hydration} من {hydrationGoal} أونصة{journey}.",

    progressJourney:
      ". رحلة {journey} مكتملة بنسبة {progress}%.",

    defaultCoach:
      "يمكنني مساعدتك في المشي والتعافي والوجبات والترطيب والنوم والتنفس وتدريب الرحلات ومراجعة التقدم. ما الذي ترغب في تحسينه اليوم؟",
  },
};

// ============================================================
// TEMPLATE HELPER
// ============================================================

function fillTemplate(template, values = {}) {
  let result = String(template || "");

  Object.entries(values).forEach(
    ([key, value]) => {
      result = result.replace(
        new RegExp(
          `\\{${key}\\}`,
          "g"
        ),
        String(
          value === null ||
            value === undefined
            ? ""
            : value
        )
      );
    }
  );

  return result;
}

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
    console.log(
      "JSON parse error:",
      error
    );

    return fallback;
  }
}

function getText(language, key) {
  const code =
    normalizeLanguage(language);

  return (
    TEXT?.[code]?.[key] ??
    TEXT?.en?.[key] ??
    key
  );
}

function getDayGreeting(language) {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return getText(
      language,
      "morning"
    );
  }

  if (hour < 18) {
    return getText(
      language,
      "afternoon"
    );
  }

  return getText(
    language,
    "evening"
  );
}

// ============================================================
// STARTER MESSAGE
// ============================================================

function getStarterMessages(language) {
  return [
    {
      id: `welcome-${normalizeLanguage(
        language
      )}`,

      sender: "coach",

      text: getText(
        language,
        "welcome"
      ),

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
      label: getText(
        language,
        "walkPrompt"
      ),
      coachMessage:
        "Plan today's walk",
      icon: "walk",
    },

    {
      id: "recovery",
      label: getText(
        language,
        "recoveryPrompt"
      ),
      coachMessage:
        "Help me recover",
      icon: "heart",
    },

    {
      id: "meal",
      label: getText(
        language,
        "mealPrompt"
      ),
      coachMessage:
        "Build a meal plan",
      icon: "restaurant",
    },

    {
      id: "hydration",
      label: getText(
        language,
        "hydrationPrompt"
      ),
      coachMessage:
        "Check hydration",
      icon: "water",
    },

    {
      id: "sleep",
      label: getText(
        language,
        "sleepPrompt"
      ),
      coachMessage:
        "Improve sleep",
      icon: "moon",
    },

    {
      id: "stress",
      label: getText(
        language,
        "stressPrompt"
      ),
      coachMessage:
        "Reduce stress",
      icon: "leaf",
    },

    {
      id: "journey",
      label: getText(
        language,
        "journeyPrompt"
      ),
      coachMessage:
        "Coach my journey",
      icon: "map",
    },

    {
      id: "progress",
      label: getText(
        language,
        "progressPrompt"
      ),
      coachMessage:
        "Review progress",
      icon: "stats-chart",
    },
  ];
}

// ============================================================
// NAVIGATION INTENT
// IMPORTANT:
// We detect against canonical English prompt intent.
// ============================================================

function detectNavigationIntent(
  text,
  wellness
) {
  const value = String(
    text || ""
  ).toLowerCase();

  if (
    value.includes(
      "meal planner"
    ) ||
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
    value.includes(
      "continue journey"
    ) ||
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
// Canonical English natural-language memory commands.
// Manual memory panel works in every language.
// ============================================================

function detectMemoryUpdate(text) {
  const original = String(
    text || ""
  ).trim();

  const lower =
    original.toLowerCase();

  if (
    lower.includes(
      "i like to walk at"
    )
  ) {
    return {
      preferredWalkTime:
        original
          .split(
            /i like to walk at/i
          )[1]
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
// MULTILINGUAL LOCAL FALLBACK COACH
// ============================================================

function createLocalCoachReply(
  message,
  context = {},
  language = "en"
) {
  const code =
    normalizeLanguage(language);

  const t = (key) =>
    getText(code, key);

  const value = String(
    message || ""
  ).toLowerCase();

  const steps =
    safeNumber(
      context.steps,
      0
    );

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
      ? safeNumber(
          context.recovery
        )
      : null;

  const sleepHours =
    context.sleepHours !== null &&
    context.sleepHours !== undefined
      ? safeNumber(
          context.sleepHours
        )
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

  const checkpointText =
    checkpoint
      ? fillTemplate(
          t("checkpointText"),
          {
            checkpoint,
          }
        )
      : "";

  // ----------------------------------------------------------
  // PREFERRED WALK TIME
  // ----------------------------------------------------------

  if (
    value.includes(
      "when should i walk"
    ) &&
    coachMemory.preferredWalkTime
  ) {
    return fillTemplate(
      t("preferredWalk"),
      {
        time:
          coachMemory
            .preferredWalkTime,
      }
    );
  }

  // ----------------------------------------------------------
  // WALK
  // ----------------------------------------------------------

  if (
    value.includes("walk") ||
    value.includes("steps")
  ) {
    if (journey) {
      return fillTemplate(
        t("journeyWalk"),
        {
          journey,
          progress:
            Math.round(
              journeyProgress
            ),
          checkpoint:
            checkpointText,
        }
      );
    }

    if (
      stepsRemaining === 0
    ) {
      return t(
        "stepGoalComplete"
      );
    }

    return fillTemplate(
      t("stepsRemaining"),
      {
        steps:
          formatNumber(
            stepsRemaining,
            code
          ),
      }
    );
  }

  // ----------------------------------------------------------
  // RECOVERY
  // ----------------------------------------------------------

  if (
    value.includes("recover") ||
    value.includes("recovery")
  ) {
    if (recovery !== null) {
      return fillTemplate(
        t("recoveryScore"),
        {
          score:
            Math.round(
              recovery
            ),
        }
      );
    }

    return t(
      "recoveryMissing"
    );
  }

  // ----------------------------------------------------------
  // MEALS
  // ----------------------------------------------------------

  if (
    value.includes("meal") ||
    value.includes("food") ||
    value.includes("eat")
  ) {
    const preference =
      coachMemory
        .mealPreference;

    if (preference) {
      return fillTemplate(
        t("savedMeal"),
        {
          preference,
        }
      );
    }

    return t("mealAdvice");
  }

  // ----------------------------------------------------------
  // HYDRATION
  // ----------------------------------------------------------

  if (
    value.includes("water") ||
    value.includes("hydration")
  ) {
    const remaining =
      Math.max(
        hydrationGoal -
          hydration,
        0
      );

    if (remaining > 0) {
      return fillTemplate(
        t(
          "hydrationRemaining"
        ),
        {
          amount:
            formatNumber(
              Math.round(
                remaining
              ),
              code
            ),
        }
      );
    }

    return t(
      "hydrationComplete"
    );
  }

  // ----------------------------------------------------------
  // SLEEP
  // ----------------------------------------------------------

  if (
    value.includes("sleep") ||
    value.includes("tired")
  ) {
    if (
      sleepHours !== null
    ) {
      return fillTemplate(
        t("sleepRecorded"),
        {
          hours:
            sleepHours.toFixed(
              1
            ),
        }
      );
    }

    return t("sleepMissing");
  }

  // ----------------------------------------------------------
  // STRESS / BREATHING
  // ----------------------------------------------------------

  if (
    value.includes("stress") ||
    value.includes("calm") ||
    value.includes("breath")
  ) {
    if (
      coachMemory
        .favoriteBreathing
    ) {
      return fillTemplate(
        t(
          "favoriteBreathingReply"
        ),
        {
          exercise:
            coachMemory
              .favoriteBreathing,
        }
      );
    }

    return t(
      "breathingAdvice"
    );
  }

  // ----------------------------------------------------------
  // JOURNEY
  // ----------------------------------------------------------

  if (
    value.includes("journey") ||
    value.includes(
      "checkpoint"
    )
  ) {
    if (journey) {
      return fillTemplate(
        t("activeJourney"),
        {
          journey,
          progress:
            Math.round(
              journeyProgress
            ),
          checkpoint:
            checkpointText,
        }
      );
    }

    return t("noJourney");
  }

  // ----------------------------------------------------------
  // PROGRESS
  // ----------------------------------------------------------

  if (
    value.includes("progress") ||
    value.includes("summary")
  ) {
    const journeySummary =
      journey
        ? fillTemplate(
            t(
              "progressJourney"
            ),
            {
              journey,
              progress:
                Math.round(
                  journeyProgress
                ),
            }
          )
        : "";

    return fillTemplate(
      t("progressSummary"),
      {
        steps:
          formatNumber(
            steps,
            code
          ),

        goal:
          formatNumber(
            stepGoal,
            code
          ),

        hydration:
          formatNumber(
            Math.round(
              hydration
            ),
            code
          ),

        hydrationGoal:
          formatNumber(
            Math.round(
              hydrationGoal
            ),
            code
          ),

        journey:
          journeySummary,
      }
    );
  }

  return t("defaultCoach");
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
  isRTL = false,
}) {
  return (
    <View
      style={[
        styles.memoryInputRow,
        isRTL &&
          styles.rowReverse,
      ]}
    >
      <View
        style={[
          styles.memoryIcon,
          isRTL &&
            styles.memoryIconRTL,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#42F58D"
        />
      </View>

      <View
        style={
          styles.memoryInputWrap
        }
      >
        <Text
          style={[
            styles.memoryLabel,
            isRTL &&
              styles.rtlText,
          ]}
        >
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={
            onChangeText
          }
          placeholder={
            placeholder
          }
          placeholderTextColor="#687D96"
          style={[
            styles.memoryInput,
            isRTL &&
              styles.rtlText,
          ]}
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
  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";

  const conversationKey =
    useMemo(
      () =>
        getConversationStorageKey(
          languageCode
        ),
      [languageCode]
    );

  const t = useCallback(
    (key) => {
      const localValue =
        getText(
          languageCode,
          key
        );

      if (
        localValue !== key
      ) {
        return localValue;
      }

      return translate(
        languageCode,
        key
      );
    },
    [languageCode]
  );

  const quickPrompts =
    useMemo(
      () =>
        getQuickPrompts(
          languageCode
        ),
      [languageCode]
    );

  const [
    messages,
    setMessages,
  ] = useState(() =>
    getStarterMessages(
      languageCode
    )
  );

  const [
    conversationLoaded,
    setConversationLoaded,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] = useState("");

  const [
    isTyping,
    setIsTyping,
  ] = useState(false);

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
  ] = useState(
    INITIAL_MEMORY
  );

  const [
    memoryDraft,
    setMemoryDraft,
  ] = useState(
    INITIAL_MEMORY
  );

  const scrollRef =
    useRef(null);

  const mountedRef =
    useRef(true);

  const canSend =
    useMemo(() => {
      return (
        draft.trim().length >
          0 &&
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
              wellness
                ?.hydrationGoal,
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
            wellness
              ?.journeyProgress,
            0
          ),

        checkpoint:
          wellness
            ?.checkpoint ||
          "",

        coachMemory,
      };
    }, [
      wellness,
      coachMemory,
    ]);

  const scrollToBottom =
    useCallback(() => {
      requestAnimationFrame(
        () => {
          scrollRef.current
            ?.scrollToEnd?.({
              animated: true,
            });
        }
      );
    }, []);

  // ==========================================================
  // MOUNT
  // ==========================================================

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;
    };
  }, []);

  // ==========================================================
  // REMOTE AI
  // ==========================================================

  const requestCoachReply =
    async (
      message,
      memoryContext,
      history
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

              language:
                languageCode,

              locale:
                LOCALES[
                  languageCode
                ],

              instruction:
                languageCode ===
                "en"
                  ? "Respond in English."
                  : `Respond only in the user's selected app language: ${languageCode}. Do not switch to English unless the user explicitly asks for English.`,

              wellness: {
                ...mergedWellness,

                coachMemory:
                  memoryContext,
              },

              coachMemory:
                memoryContext,

              history:
                history
                  .slice(-12)
                  .map(
                    (item) => ({
                      sender:
                        item.sender,

                      text:
                        item.text,
                    })
                  ),
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
            t(
              "emptyResponse"
            )
        );
      }

      return String(
        data.reply
      );
    };

  // ==========================================================
  // LOAD CONVERSATION WHEN LANGUAGE CHANGES
  // ==========================================================

  useEffect(() => {
    let active = true;

    const loadConversation =
      async () => {
        setConversationLoaded(
          false
        );

        setIsTyping(false);
        setPendingAction(null);
        setDraft("");

        try {
          const savedMessages =
            await AsyncStorage.getItem(
              conversationKey
            );

          const parsed =
            safelyParseJSON(
              savedMessages,
              null
            );

          if (!active) {
            return;
          }

          if (
            Array.isArray(
              parsed
            ) &&
            parsed.length > 0
          ) {
            setMessages(
              parsed
            );
          } else {
            setMessages(
              getStarterMessages(
                languageCode
              )
            );
          }
        } catch (error) {
          console.log(
            "Coach conversation load error:",
            error
          );

          if (active) {
            setMessages(
              getStarterMessages(
                languageCode
              )
            );
          }
        } finally {
          if (active) {
            setConversationLoaded(
              true
            );
          }
        }
      };

    loadConversation();

    return () => {
      active = false;
    };
  }, [
    conversationKey,
    languageCode,
  ]);

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
            typeof parsed ===
              "object"
          ) {
            const nextMemory =
              {
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
  // SAVE CURRENT LANGUAGE CONVERSATION
  // ==========================================================

  useEffect(() => {
    if (
      !conversationLoaded
    ) {
      return;
    }

    const saveConversation =
      async () => {
        try {
          await AsyncStorage.setItem(
            conversationKey,
            JSON.stringify(
              messages
            )
          );
        } catch (error) {
          console.log(
            "Coach conversation save error:",
            error
          );
        }
      };

    saveConversation();
  }, [
    messages,
    conversationKey,
    conversationLoaded,
  ]);

  // ==========================================================
  // AUTO SCROLL
  // ==========================================================

  useEffect(() => {
    scrollToBottom();
  }, [
    messages,
    isTyping,
    scrollToBottom,
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

      setShowMemoryPanel(
        false
      );
    };

  // ==========================================================
  // CLEAR MEMORY
  // ==========================================================

  const clearCoachMemory =
    () => {
      Alert.alert(
        t(
          "clearMemoryTitle"
        ),

        t(
          "clearMemoryMessage"
        ),

        [
          {
            text: t("cancel"),
            style: "cancel",
          },

          {
            text: t("clear"),
            style:
              "destructive",

            onPress:
              async () => {
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

                  setShowMemoryPanel(
                    false
                  );
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
  // CLEAR CURRENT LANGUAGE CONVERSATION
  // ==========================================================

  const clearConversation =
    () => {
      Alert.alert(
        t(
          "newConversationTitle"
        ),

        t(
          "newConversationMessage"
        ),

        [
          {
            text: t("cancel"),
            style: "cancel",
          },

          {
            text: t("clear"),
            style:
              "destructive",

            onPress:
              async () => {
                try {
                  await AsyncStorage.removeItem(
                    conversationKey
                  );

                  setMessages(
                    getStarterMessages(
                      languageCode
                    )
                  );

                  setDraft("");
                  setIsTyping(
                    false
                  );
                  setPendingAction(
                    null
                  );
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

      const contextForMessage =
        {
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

        sender: "user",

        text: cleaned,

        actionIntent: null,
      };

      // Snapshot before state changes so remote history
      // does not depend on a stale closure later.
      const historyForRequest =
        [
          ...messages,
          userMessage,
        ];

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
              activeMemory,
              historyForRequest
            );
        } catch (
          remoteError
        ) {
          console.log(
            "Remote AI unavailable. Using local multilingual coach:",
            remoteError
          );

          replyText =
            createLocalCoachReply(
              intentText,
              contextForMessage,
              languageCode
            );
        }

        if (
          !mountedRef.current
        ) {
          return;
        }

        const coachMessage =
          {
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

        if (
          navigationIntent
        ) {
          setPendingAction(
            navigationIntent
          );
        }
      } catch (error) {
        console.log(
          "Coach response error:",
          error
        );

        if (
          mountedRef.current
        ) {
          setMessages(
            (current) => [
              ...current,

              {
                id:
                  `coach-error-${Date.now()}`,

                sender:
                  "coach",

                text:
                  t(
                    "responseError"
                  ),

                actionIntent:
                  null,
              },
            ]
          );
        }
      } finally {
        if (
          mountedRef.current
        ) {
          setIsTyping(false);
        }
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

      // The user sees their selected language.
      // The canonical English message is only used for
      // local intent detection.
      sendMessage(
        prompt.label,
        prompt.coachMessage
      );
    };

  // ==========================================================
  // MEMORY PANEL
  // ==========================================================

  const openMemoryPanel =
    () => {
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

      setShowMemoryPanel(
        true
      );
    };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={
            styles.container
          }
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

          <View
            style={[
              styles.header,
              isRTL &&
                styles.rowReverse,
            ]}
          >
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
                name={
                  isRTL
                    ? "chevron-forward"
                    : "chevron-back"
                }
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
                style={[
                  styles.eyebrow,
                  isRTL &&
                    styles.rtlText,
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {t("wellness")}
              </Text>

              <Text
                style={[
                  styles.title,
                  isRTL &&
                    styles.rtlText,
                ]}
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
                  style={[
                    styles.memoryHeader,
                    isRTL &&
                      styles.rowReverse,
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        styles.memoryEyebrow,
                        isRTL &&
                          styles.rtlText,
                      ]}
                    >
                      {t(
                        "aiMemory"
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.memoryTitle,
                        isRTL &&
                          styles.rtlText,
                      ]}
                    >
                      {t(
                        "remembers"
                      )}
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
                  isRTL={isRTL}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (
                        current
                      ) => ({
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
                  isRTL={isRTL}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (
                        current
                      ) => ({
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
                  isRTL={isRTL}
                  onChangeText={(
                    value
                  ) =>
                    setMemoryDraft(
                      (
                        current
                      ) => ({
                        ...current,

                        favoriteBreathing:
                          value,
                      })
                    )
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.saveMemoryButton,
                    isRTL &&
                      styles.rowReverse,
                  ]}
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
                    style={[
                      styles.saveMemoryText,
                      isRTL &&
                        styles.buttonTextRTL,
                    ]}
                  >
                    {t(
                      "saveMemory"
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.clearMemoryButton,
                    isRTL &&
                      styles.rowReverse,
                  ]}
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
                    style={[
                      styles.clearMemoryText,
                      isRTL &&
                        styles.buttonTextRTL,
                    ]}
                  >
                    {t(
                      "clearMemory"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* COACH STATUS */}

            <View
              style={[
                styles.coachStatus,
                isRTL &&
                  styles.rowReverse,
              ]}
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
                style={[
                  styles.coachStatusText,
                  isRTL &&
                    styles.coachStatusTextRTL,
                ]}
              >
                <Text
                  style={[
                    styles.coachName,
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {t(
                    "coachName"
                  )}
                </Text>

                <Text
                  style={[
                    styles.coachReady,
                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {isTyping
                    ? t(
                        "preparing"
                      )
                    : `${getDayGreeting(
                        languageCode
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
              style={
                styles.messages
              }
            >
              {messages.map(
                (message) => {
                  const isUser =
                    message.sender ===
                    "user";

                  return (
                    <View
                      key={
                        message.id
                      }
                      style={[
                        styles.messageRow,

                        isUser
                          ? styles.userMessageRow
                          : styles.coachMessageRow,

                        isRTL &&
                          !isUser &&
                          styles.coachMessageRowRTL,

                        isRTL &&
                          isUser &&
                          styles.userMessageRowRTL,
                      ]}
                    >
                      {!isUser && (
                        <View
                          style={[
                            styles.messageAvatar,
                            isRTL &&
                              styles.messageAvatarRTL,
                          ]}
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

                          isRTL &&
                            !isUser &&
                            styles.coachBubbleRTL,

                          isRTL &&
                            isUser &&
                            styles.userBubbleRTL,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,

                            isUser &&
                              styles.userMessageText,

                            isRTL &&
                              styles.rtlText,
                          ]}
                        >
                          {
                            message.text
                          }
                        </Text>

                        {!isUser &&
                          message.actionIntent && (
                            <TouchableOpacity
                              style={[
                                styles.actionButton,
                                isRTL &&
                                  styles.rowReverse,
                              ]}
                              onPress={() =>
                                openDetectedScreen(
                                  message.actionIntent
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.actionButtonText,
                                  isRTL &&
                                    styles.actionButtonTextRTL,
                                ]}
                              >
                                {t(
                                  "openFeature"
                                )}
                              </Text>

                              <Ionicons
                                name={
                                  isRTL
                                    ? "arrow-back"
                                    : "arrow-forward"
                                }
                                size={
                                  18
                                }
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

                    isRTL &&
                      styles.coachMessageRowRTL,
                  ]}
                >
                  <View
                    style={[
                      styles.messageAvatar,
                      isRTL &&
                        styles.messageAvatarRTL,
                    ]}
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

                      isRTL &&
                        styles.coachBubbleRTL,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typingText,
                        isRTL &&
                          styles.rtlText,
                      ]}
                    >
                      {t(
                        "thinking"
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* RECOMMENDED ACTION */}

            {pendingAction && (
              <TouchableOpacity
                style={[
                  styles.pendingActionButton,
                  isRTL &&
                    styles.rowReverse,
                ]}
                onPress={() =>
                  openDetectedScreen(
                    pendingAction
                  )
                }
              >
                <Text
                  style={[
                    styles.pendingActionText,
                    isRTL &&
                      styles.pendingActionTextRTL,
                  ]}
                >
                  {t(
                    "openRecommended"
                  )}
                </Text>

                <Ionicons
                  name={
                    isRTL
                      ? "arrow-back"
                      : "arrow-forward"
                  }
                  size={20}
                  color="#02111F"
                />
              </TouchableOpacity>
            )}

            {/* QUICK COACHING */}

            <Text
              style={[
                styles.quickTitle,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "quickCoaching"
              )}
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
                    key={
                      prompt.id
                    }
                    style={[
                      styles.quickPrompt,
                      isRTL &&
                        styles.rowReverse,
                    ]}
                    onPress={() =>
                      handleQuickPrompt(
                        prompt
                      )
                    }
                    disabled={
                      isTyping
                    }
                    activeOpacity={
                      0.8
                    }
                  >
                    <Ionicons
                      name={
                        prompt.icon
                      }
                      size={19}
                      color="#42F58D"
                    />

                    <Text
                      style={[
                        styles.quickPromptText,
                        isRTL &&
                          styles.quickPromptTextRTL,
                      ]}
                    >
                      {
                        prompt.label
                      }
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <View
              style={{
                height: 24,
              }}
            />
          </ScrollView>

          {/* TEXT COMPOSER */}

          <View
            style={
              styles.composerArea
            }
          >
            <View
              style={[
                styles.composer,
                isRTL &&
                  styles.rowReverse,
              ]}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={23}
                color="#42F58D"
                style={[
                  styles.chatIcon,
                  isRTL &&
                    styles.chatIconRTL,
                ]}
              />

              <TextInput
                value={draft}
                onChangeText={
                  setDraft
                }
                placeholder={t(
                  "placeholder"
                )}
                placeholderTextColor="#71859D"
                style={[
                  styles.input,
                  isRTL &&
                    styles.rtlText,
                ]}
                multiline
                maxLength={2000}
                editable={
                  !isTyping
                }
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
              style={[
                styles.disclaimer,
                isRTL &&
                  styles.rtlText,
              ]}
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
    textAlign: "center",
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

  coachStatusTextRTL: {
    marginLeft: 0,
    marginRight: 13,
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

  memoryIconRTL: {
    marginRight: 0,
    marginLeft: 12,
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

  buttonTextRTL: {
    marginLeft: 0,
    marginRight: 8,
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

  coachMessageRowRTL: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },

  userMessageRowRTL: {
    flexDirection: "row-reverse",
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

  messageAvatarRTL: {
    marginRight: 0,
    marginLeft: 10,
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

  coachBubbleRTL: {
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 7,
  },

  userBubble: {
    backgroundColor: "#FFC746",
    borderBottomRightRadius: 7,
  },

  userBubbleRTL: {
    borderBottomRightRadius: 23,
    borderBottomLeftRadius: 7,
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

  actionButtonTextRTL: {
    marginRight: 0,
    marginLeft: 8,
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

  pendingActionTextRTL: {
    marginRight: 0,
    marginLeft: 9,
    writingDirection: "rtl",
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

  quickPromptTextRTL: {
    marginLeft: 0,
    marginRight: 8,
    writingDirection: "rtl",
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

  chatIconRTL: {
    marginLeft: 0,
    marginRight: 8,
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

  rowReverse: {
    flexDirection: "row-reverse",
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});