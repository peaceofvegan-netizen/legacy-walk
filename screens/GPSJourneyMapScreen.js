import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  AppState,
} from "react-native";

import { Pedometer } from "expo-sensors";

import * as Location from "expo-location";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  addRegularJourneySteps,
  activateJourneyTracking,
} from "../utils/stepTrackingEngine";

import {
  completeJourneyProgress,
  resetJourneyProgress,
  updateJourneySteps,
} from "../utils/journeyProgress";

import {
  awardPointsOnce,
} from "../utils/rewardPointsSystem";

import {
  addPoints,
} from "../utils/legacyPointsManager";

import journeyMaps
  from "../data/journeyMaps";

import {
  getRouteImage,
} from "../data/routeImages";

import JOURNEY_REWARDS, {
  completeJourneyReward,
} from "../utils/journeyRewards";

import {
  translate,
} from "../i18n/i18n";

import {
  getJourneyTranslation,
} from "../i18n/journeyTranslations";

// ============================================================
// ASSETS
// ============================================================

const SHOE_ICON =
  require("../assets/apparel/w-shoe.png");

// KEEP OLD STORAGE KEY.
// Changing this would risk losing existing journey progress.
const PROGRESS_KEY =
  "LEGACY_WALK_JOURNEY_PROGRESS";

// ============================================================
// GPS JOURNEY TRANSLATIONS
// ============================================================

const GPS_TEXT = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    back: "Back",

    journeyUnavailable:
      "Journey unavailable",

    journeyUnavailableText:
      "This journey needs an ID and a step goal before tracking can start.",

    loading:
      "Loading saved journey progress…",

    liveProgress:
      "LIVE JOURNEY PROGRESS",

    defaultDescription:
      "Walk anywhere. Every step moves you closer to completing your Legathon Journey.",

    waitingGps:
      "Waiting for reliable GPS",

    vehiclePaused:
      "Vehicle-speed movement — steps paused",

    verifyingWalking:
      "Verifying walking speed",

    walkingVerified:
      "Walking verified",

    goalReached:
      "Journey Goal Reached",

    saving:
      "Saving Progress",

    starting:
      "Starting Tracking",

    trackingPaused:
      "Tracking Paused",

    autoSaved:
      "Auto-saved {time}",

    autoSaveReady:
      "Auto-save ready",

    steps:
      "Steps",

    miles:
      "Miles",

    calories:
      "Calories",

    time:
      "Time",

    journeyProgress:
      "Journey Progress",

    remainingSteps:
      "{count} steps remaining",

    remainingStepsLabel:
      "Steps Remaining",

    goalCompleted:
      "Journey step goal completed",

    routeUnavailable:
      "Route card unavailable",

    routeUnavailableText:
      "The route artwork for {title} has not been connected yet.",

    journeySummary:
      "Journey Summary",

    progress:
      "Progress",

    completedCheckpoints:
      "Completed Checkpoints",

    trackingStatus:
      "Tracking Status",

    active:
      "Active",

    paused:
      "Paused",

    journeyRewards:
      "Journey Rewards",

    rewardPoints:
      "Reward Points",

    wcoins:
      "WCoins",

    passportStamp:
      "Passport Stamp",

    unlocked:
      "Unlocked",

    unlocksCompletion:
      "Unlocks on completion",

    certificate:
      "Certificate",

    earned:
      "Earned",

    earnedCompletion:
      "Earned on completion",

    journeyCheckpoints:
      "Journey Checkpoints",

    reached:
      "Reached",

    start:
      "Start",

    checkpoint:
      "Checkpoint {count}",

    finish:
      "Finish",

    current:
      "Current",

    upcoming:
      "Upcoming",

    devJump:
      "🧪 DEV: Jump Near Finish",

    claimRewards:
      "Complete Journey and Claim Rewards",

    journeyCompleted:
      "🏆 Journey Completed",

    pauseTracking:
      "Pause Tracking",

    resumeTracking:
      "Resume Tracking",

    saveExit:
      "Save and Exit",

    share:
      "📤 Share My Walk",

    resetJourney:
      "Reset Journey",

    resetQuestion:
      "Reset Journey?",

    resetWarning:
      "Your walking progress will return to zero. Previously claimed rewards will remain protected.",

    cancel:
      "Cancel",

    reset:
      "Reset",

    resetComplete:
      "Journey Reset",

    resetCompleteMessage:
      "Progress was reset. Previously claimed rewards were kept. Tap Resume Tracking to walk again.",

    unableSave:
      "Unable to Save Journey",

    unableShare:
      "Unable to Share",

    tryAgain:
      "Please try again.",

    notComplete:
      "Journey Not Complete",

    reachGoal:
      "Reach the full step goal before claiming rewards.",

    completeTitle:
      "Journey Complete!",

    completedAgain:
      "You completed this walk again. Your previously claimed rewards remain protected.",

    rewardsEarned:
      "WCoins earned: {coins}\nLegathon points earned: {points}",

    shareMessage:
      "I’m walking {title} on Legathon Walk.\n\nSteps: {steps}\nDistance: {miles} miles\nCheckpoints reached: {checkpoints}/5\n\nJoin me on Legathon Walk.",

    motionPermission:
      "Enable Motion & Fitness permission to count steps.",

    trackingUnavailable:
      "Step tracking is unavailable on this device.",

    trackingStartFailed:
      "Could not start journey tracking. Please try again.",

    preciseLocation:
      "Enable precise location to filter vehicle movement.",

    anotherActivity:
      "Another activity owns step tracking. Resume this journey when ready.",

    stepSaveFailed:
      "Could not save your step totals.",

    progressSaveFailed:
      "Progress could not be fully saved. Tap Save and Exit to retry.",

    savedJourneyInvalid:
      "Saved journey data is invalid.",

    savedProgressInvalid:
      "Saved progress has invalid steps or time; it was not overwritten.",

    storyProgressInvalid:
      "Saved story progress is invalid.",

    journeyListInvalid:
      "Journey list data is invalid.",

    loadFailed:
      "Could not load your saved journey. Nothing was overwritten. Go back and reopen it.",

    passportInvalid:
      "Passport data is invalid.",

    signIn:
      "Sign in to your Legathon account before claiming WCoin Journey rewards.",

    rewardFailed:
      "The reward service did not confirm an award. Check your wallet before retrying.",

    routeAccessibility:
      "Journey route artwork",

    legathonJourney:
      "Legathon Journey",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    back: "Atrás",

    journeyUnavailable:
      "Viaje no disponible",

    journeyUnavailableText:
      "Este viaje necesita un ID y una meta de pasos antes de iniciar el seguimiento.",

    loading:
      "Cargando progreso guardado…",

    liveProgress:
      "PROGRESO DEL VIAJE EN VIVO",

    defaultDescription:
      "Camina donde quieras. Cada paso te acerca a completar tu Viaje Legathon.",

    waitingGps:
      "Esperando una señal GPS confiable",

    vehiclePaused:
      "Movimiento de vehículo — pasos en pausa",

    verifyingWalking:
      "Verificando velocidad de caminata",

    walkingVerified:
      "Caminata verificada",

    goalReached:
      "Meta del viaje alcanzada",

    saving:
      "Guardando progreso",

    starting:
      "Iniciando seguimiento",

    trackingPaused:
      "Seguimiento en pausa",

    autoSaved:
      "Guardado automáticamente {time}",

    autoSaveReady:
      "Guardado automático listo",

    steps:
      "Pasos",

    miles:
      "Millas",

    calories:
      "Calorías",

    time:
      "Tiempo",

    journeyProgress:
      "Progreso del Viaje",

    remainingSteps:
      "Quedan {count} pasos",

    remainingStepsLabel:
      "Pasos Restantes",

    goalCompleted:
      "Meta de pasos completada",

    routeUnavailable:
      "Tarjeta de ruta no disponible",

    routeUnavailableText:
      "La imagen de ruta de {title} aún no está conectada.",

    journeySummary:
      "Resumen del Viaje",

    progress:
      "Progreso",

    completedCheckpoints:
      "Puntos Completados",

    trackingStatus:
      "Estado del Seguimiento",

    active:
      "Activo",

    paused:
      "En pausa",

    journeyRewards:
      "Recompensas del Viaje",

    rewardPoints:
      "Puntos de Recompensa",

    wcoins:
      "WCoins",

    passportStamp:
      "Sello del Pasaporte",

    unlocked:
      "Desbloqueado",

    unlocksCompletion:
      "Se desbloquea al completar",

    certificate:
      "Certificado",

    earned:
      "Ganado",

    earnedCompletion:
      "Se gana al completar",

    journeyCheckpoints:
      "Puntos del Viaje",

    reached:
      "Alcanzado",

    start:
      "Inicio",

    checkpoint:
      "Punto {count}",

    finish:
      "Final",

    current:
      "Actual",

    upcoming:
      "Próximo",

    devJump:
      "🧪 DEV: Ir cerca del final",

    claimRewards:
      "Completar Viaje y Reclamar Recompensas",

    journeyCompleted:
      "🏆 Viaje Completado",

    pauseTracking:
      "Pausar Seguimiento",

    resumeTracking:
      "Reanudar Seguimiento",

    saveExit:
      "Guardar y Salir",

    share:
      "📤 Compartir Mi Caminata",

    resetJourney:
      "Reiniciar Viaje",

    resetQuestion:
      "¿Reiniciar viaje?",

    resetWarning:
      "Tu progreso volverá a cero. Las recompensas ya reclamadas permanecerán protegidas.",

    cancel:
      "Cancelar",

    reset:
      "Reiniciar",

    resetComplete:
      "Viaje Reiniciado",

    resetCompleteMessage:
      "El progreso fue reiniciado. Las recompensas reclamadas se conservaron. Toca Reanudar Seguimiento para volver a caminar.",

    unableSave:
      "No se Pudo Guardar el Viaje",

    unableShare:
      "No se Pudo Compartir",

    tryAgain:
      "Inténtalo de nuevo.",

    notComplete:
      "Viaje No Completado",

    reachGoal:
      "Alcanza la meta completa de pasos antes de reclamar recompensas.",

    completeTitle:
      "¡Viaje Completado!",

    completedAgain:
      "Completaste esta caminata nuevamente. Tus recompensas reclamadas permanecen protegidas.",

    rewardsEarned:
      "WCoins ganados: {coins}\nPuntos Legathon ganados: {points}",

    shareMessage:
      "Estoy caminando {title} en Legathon Walk.\n\nPasos: {steps}\nDistancia: {miles} millas\nPuntos alcanzados: {checkpoints}/5\n\nÚnete a mí en Legathon Walk.",

    motionPermission:
      "Activa el permiso de Movimiento y Fitness para contar pasos.",

    trackingUnavailable:
      "El seguimiento de pasos no está disponible en este dispositivo.",

    trackingStartFailed:
      "No se pudo iniciar el seguimiento del viaje.",

    preciseLocation:
      "Activa la ubicación precisa para filtrar el movimiento en vehículo.",

    anotherActivity:
      "Otra actividad controla el seguimiento de pasos.",

    stepSaveFailed:
      "No se pudieron guardar los pasos.",

    progressSaveFailed:
      "No se pudo guardar completamente el progreso.",

    savedJourneyInvalid:
      "Los datos guardados del viaje no son válidos.",

    savedProgressInvalid:
      "El progreso guardado contiene datos no válidos.",

    storyProgressInvalid:
      "El progreso guardado de la historia no es válido.",

    journeyListInvalid:
      "Los datos de la lista de viajes no son válidos.",

    loadFailed:
      "No se pudo cargar tu viaje guardado. Nada fue sobrescrito.",

    passportInvalid:
      "Los datos del pasaporte no son válidos.",

    signIn:
      "Inicia sesión en tu cuenta Legathon antes de reclamar recompensas WCoin.",

    rewardFailed:
      "El servicio de recompensas no confirmó el premio.",

    routeAccessibility:
      "Imagen de la ruta del viaje",

    legathonJourney:
      "Viaje Legathon",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    back: "Retour",

    journeyUnavailable:
      "Voyage indisponible",

    journeyUnavailableText:
      "Ce voyage nécessite un identifiant et un objectif de pas avant le démarrage du suivi.",

    loading:
      "Chargement de la progression enregistrée…",

    liveProgress:
      "PROGRESSION DU VOYAGE EN DIRECT",

    defaultDescription:
      "Marchez où vous voulez. Chaque pas vous rapproche de la fin de votre voyage Legathon.",

    waitingGps:
      "En attente d’un GPS fiable",

    vehiclePaused:
      "Mouvement de véhicule — pas en pause",

    verifyingWalking:
      "Vérification de la vitesse de marche",

    walkingVerified:
      "Marche vérifiée",

    goalReached:
      "Objectif du voyage atteint",

    saving:
      "Enregistrement de la progression",

    starting:
      "Démarrage du suivi",

    trackingPaused:
      "Suivi en pause",

    autoSaved:
      "Enregistré automatiquement à {time}",

    autoSaveReady:
      "Enregistrement automatique prêt",

    steps:
      "Pas",

    miles:
      "Miles",

    calories:
      "Calories",

    time:
      "Temps",

    journeyProgress:
      "Progression du Voyage",

    remainingSteps:
      "{count} pas restants",

    remainingStepsLabel:
      "Pas Restants",

    goalCompleted:
      "Objectif de pas atteint",

    routeUnavailable:
      "Carte de route indisponible",

    routeUnavailableText:
      "L’illustration de l’itinéraire pour {title} n’est pas encore connectée.",

    journeySummary:
      "Résumé du Voyage",

    progress:
      "Progression",

    completedCheckpoints:
      "Étapes Terminées",

    trackingStatus:
      "État du Suivi",

    active:
      "Actif",

    paused:
      "En pause",

    journeyRewards:
      "Récompenses du Voyage",

    rewardPoints:
      "Points de Récompense",

    wcoins:
      "WCoins",

    passportStamp:
      "Tampon de Passeport",

    unlocked:
      "Débloqué",

    unlocksCompletion:
      "Se débloque à la fin",

    certificate:
      "Certificat",

    earned:
      "Gagné",

    earnedCompletion:
      "Gagné à la fin",

    journeyCheckpoints:
      "Étapes du Voyage",

    reached:
      "Atteint",

    start:
      "Départ",

    checkpoint:
      "Étape {count}",

    finish:
      "Arrivée",

    current:
      "Actuel",

    upcoming:
      "À venir",

    devJump:
      "🧪 DEV : Aller près de la fin",

    claimRewards:
      "Terminer le Voyage et Réclamer les Récompenses",

    journeyCompleted:
      "🏆 Voyage Terminé",

    pauseTracking:
      "Mettre le Suivi en Pause",

    resumeTracking:
      "Reprendre le Suivi",

    saveExit:
      "Enregistrer et Quitter",

    share:
      "📤 Partager Ma Marche",

    resetJourney:
      "Réinitialiser le Voyage",

    resetQuestion:
      "Réinitialiser le voyage ?",

    resetWarning:
      "Votre progression reviendra à zéro. Les récompenses déjà réclamées resteront protégées.",

    cancel:
      "Annuler",

    reset:
      "Réinitialiser",

    resetComplete:
      "Voyage Réinitialisé",

    resetCompleteMessage:
      "La progression a été réinitialisée. Les récompenses déjà réclamées ont été conservées.",

    unableSave:
      "Impossible d’Enregistrer le Voyage",

    unableShare:
      "Impossible de Partager",

    tryAgain:
      "Veuillez réessayer.",

    notComplete:
      "Voyage Incomplet",

    reachGoal:
      "Atteignez l’objectif complet de pas avant de réclamer les récompenses.",

    completeTitle:
      "Voyage Terminé !",

    completedAgain:
      "Vous avez terminé cette marche à nouveau. Vos récompenses restent protégées.",

    rewardsEarned:
      "WCoins gagnés : {coins}\nPoints Legathon gagnés : {points}",

    shareMessage:
      "Je marche sur {title} avec Legathon Walk.\n\nPas : {steps}\nDistance : {miles} miles\nÉtapes atteintes : {checkpoints}/5\n\nRejoignez-moi sur Legathon Walk.",

    motionPermission:
      "Activez l’autorisation Mouvement et forme pour compter les pas.",

    trackingUnavailable:
      "Le suivi des pas n’est pas disponible sur cet appareil.",

    trackingStartFailed:
      "Impossible de démarrer le suivi du voyage.",

    preciseLocation:
      "Activez la localisation précise pour filtrer les déplacements en véhicule.",

    anotherActivity:
      "Une autre activité contrôle le suivi des pas.",

    stepSaveFailed:
      "Impossible d’enregistrer le total des pas.",

    progressSaveFailed:
      "La progression n’a pas pu être entièrement enregistrée.",

    savedJourneyInvalid:
      "Les données enregistrées du voyage sont invalides.",

    savedProgressInvalid:
      "La progression enregistrée contient des données invalides.",

    storyProgressInvalid:
      "La progression enregistrée de l’histoire est invalide.",

    journeyListInvalid:
      "Les données de la liste des voyages sont invalides.",

    loadFailed:
      "Impossible de charger votre voyage enregistré.",

    passportInvalid:
      "Les données du passeport sont invalides.",

    signIn:
      "Connectez-vous à votre compte Legathon avant de réclamer les récompenses WCoin.",

    rewardFailed:
      "Le service de récompenses n’a pas confirmé l’attribution.",

    routeAccessibility:
      "Illustration de l’itinéraire du voyage",

    legathonJourney:
      "Voyage Legathon",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    back: "Zurück",

    journeyUnavailable:
      "Reise nicht verfügbar",

    journeyUnavailableText:
      "Diese Reise benötigt eine ID und ein Schrittziel, bevor das Tracking starten kann.",

    loading:
      "Gespeicherten Reisefortschritt laden…",

    liveProgress:
      "LIVE-REISEFORTSCHRITT",

    defaultDescription:
      "Gehe, wo du möchtest. Jeder Schritt bringt dich dem Abschluss deiner Legathon-Reise näher.",

    waitingGps:
      "Warten auf zuverlässiges GPS",

    vehiclePaused:
      "Fahrzeugbewegung — Schritte pausiert",

    verifyingWalking:
      "Gehgeschwindigkeit wird geprüft",

    walkingVerified:
      "Gehen bestätigt",

    goalReached:
      "Reiseziel erreicht",

    saving:
      "Fortschritt wird gespeichert",

    starting:
      "Tracking wird gestartet",

    trackingPaused:
      "Tracking pausiert",

    autoSaved:
      "Automatisch gespeichert {time}",

    autoSaveReady:
      "Automatisches Speichern bereit",

    steps:
      "Schritte",

    miles:
      "Meilen",

    calories:
      "Kalorien",

    time:
      "Zeit",

    journeyProgress:
      "Reisefortschritt",

    remainingSteps:
      "{count} Schritte verbleiben",

    remainingStepsLabel:
      "Verbleibende Schritte",

    goalCompleted:
      "Schrittziel erreicht",

    routeUnavailable:
      "Routenkarte nicht verfügbar",

    routeUnavailableText:
      "Die Routengrafik für {title} ist noch nicht verbunden.",

    journeySummary:
      "Reiseübersicht",

    progress:
      "Fortschritt",

    completedCheckpoints:
      "Abgeschlossene Kontrollpunkte",

    trackingStatus:
      "Tracking-Status",

    active:
      "Aktiv",

    paused:
      "Pausiert",

    journeyRewards:
      "Reisebelohnungen",

    rewardPoints:
      "Belohnungspunkte",

    wcoins:
      "WCoins",

    passportStamp:
      "Passstempel",

    unlocked:
      "Freigeschaltet",

    unlocksCompletion:
      "Wird nach Abschluss freigeschaltet",

    certificate:
      "Zertifikat",

    earned:
      "Verdient",

    earnedCompletion:
      "Wird nach Abschluss verdient",

    journeyCheckpoints:
      "Reise-Kontrollpunkte",

    reached:
      "Erreicht",

    start:
      "Start",

    checkpoint:
      "Kontrollpunkt {count}",

    finish:
      "Ziel",

    current:
      "Aktuell",

    upcoming:
      "Bevorstehend",

    devJump:
      "🧪 DEV: Kurz vor das Ziel springen",

    claimRewards:
      "Reise Abschließen und Belohnungen Beanspruchen",

    journeyCompleted:
      "🏆 Reise Abgeschlossen",

    pauseTracking:
      "Tracking Pausieren",

    resumeTracking:
      "Tracking Fortsetzen",

    saveExit:
      "Speichern und Beenden",

    share:
      "📤 Meinen Walk Teilen",

    resetJourney:
      "Reise Zurücksetzen",

    resetQuestion:
      "Reise zurücksetzen?",

    resetWarning:
      "Dein Gehfortschritt wird auf null gesetzt. Bereits beanspruchte Belohnungen bleiben geschützt.",

    cancel:
      "Abbrechen",

    reset:
      "Zurücksetzen",

    resetComplete:
      "Reise Zurückgesetzt",

    resetCompleteMessage:
      "Der Fortschritt wurde zurückgesetzt. Bereits beanspruchte Belohnungen wurden behalten.",

    unableSave:
      "Reise Konnte Nicht Gespeichert Werden",

    unableShare:
      "Teilen Nicht Möglich",

    tryAgain:
      "Bitte versuche es erneut.",

    notComplete:
      "Reise Nicht Abgeschlossen",

    reachGoal:
      "Erreiche das vollständige Schrittziel, bevor du Belohnungen beanspruchst.",

    completeTitle:
      "Reise Abgeschlossen!",

    completedAgain:
      "Du hast diesen Walk erneut abgeschlossen. Deine Belohnungen bleiben geschützt.",

    rewardsEarned:
      "Verdiente WCoins: {coins}\nVerdiente Legathon-Punkte: {points}",

    shareMessage:
      "Ich gehe {title} auf Legathon Walk.\n\nSchritte: {steps}\nDistanz: {miles} Meilen\nKontrollpunkte: {checkpoints}/5\n\nMach mit bei Legathon Walk.",

    motionPermission:
      "Aktiviere die Bewegungs- und Fitnessberechtigung.",

    trackingUnavailable:
      "Schrittverfolgung ist auf diesem Gerät nicht verfügbar.",

    trackingStartFailed:
      "Reise-Tracking konnte nicht gestartet werden.",

    preciseLocation:
      "Aktiviere den genauen Standort, um Fahrzeugbewegungen zu filtern.",

    anotherActivity:
      "Eine andere Aktivität verwendet die Schrittverfolgung.",

    stepSaveFailed:
      "Schrittwerte konnten nicht gespeichert werden.",

    progressSaveFailed:
      "Der Fortschritt konnte nicht vollständig gespeichert werden.",

    savedJourneyInvalid:
      "Gespeicherte Reisedaten sind ungültig.",

    savedProgressInvalid:
      "Der gespeicherte Fortschritt ist ungültig.",

    storyProgressInvalid:
      "Gespeicherter Story-Fortschritt ist ungültig.",

    journeyListInvalid:
      "Daten der Reiseliste sind ungültig.",

    loadFailed:
      "Deine gespeicherte Reise konnte nicht geladen werden.",

    passportInvalid:
      "Passdaten sind ungültig.",

    signIn:
      "Melde dich bei deinem Legathon-Konto an, bevor du WCoin-Belohnungen beanspruchst.",

    rewardFailed:
      "Der Belohnungsdienst hat keine Vergabe bestätigt.",

    routeAccessibility:
      "Routengrafik der Reise",

    legathonJourney:
      "Legathon-Reise",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    back: "Voltar",

    journeyUnavailable:
      "Jornada indisponível",

    journeyUnavailableText:
      "Esta jornada precisa de um ID e uma meta de passos antes que o rastreamento possa começar.",

    loading:
      "Carregando progresso salvo…",

    liveProgress:
      "PROGRESSO DA JORNADA AO VIVO",

    defaultDescription:
      "Caminhe onde quiser. Cada passo aproxima você da conclusão da sua Jornada Legathon.",

    waitingGps:
      "Aguardando GPS confiável",

    vehiclePaused:
      "Movimento de veículo — passos pausados",

    verifyingWalking:
      "Verificando velocidade da caminhada",

    walkingVerified:
      "Caminhada verificada",

    goalReached:
      "Meta da jornada alcançada",

    saving:
      "Salvando progresso",

    starting:
      "Iniciando rastreamento",

    trackingPaused:
      "Rastreamento pausado",

    autoSaved:
      "Salvo automaticamente {time}",

    autoSaveReady:
      "Salvamento automático pronto",

    steps:
      "Passos",

    miles:
      "Milhas",

    calories:
      "Calorias",

    time:
      "Tempo",

    journeyProgress:
      "Progresso da Jornada",

    remainingSteps:
      "Faltam {count} passos",

    remainingStepsLabel:
      "Passos Restantes",

    goalCompleted:
      "Meta de passos concluída",

    routeUnavailable:
      "Cartão de rota indisponível",

    routeUnavailableText:
      "A arte da rota de {title} ainda não foi conectada.",

    journeySummary:
      "Resumo da Jornada",

    progress:
      "Progresso",

    completedCheckpoints:
      "Pontos Concluídos",

    trackingStatus:
      "Status do Rastreamento",

    active:
      "Ativo",

    paused:
      "Pausado",

    journeyRewards:
      "Recompensas da Jornada",

    rewardPoints:
      "Pontos de Recompensa",

    wcoins:
      "WCoins",

    passportStamp:
      "Carimbo do Passaporte",

    unlocked:
      "Desbloqueado",

    unlocksCompletion:
      "Desbloqueia ao concluir",

    certificate:
      "Certificado",

    earned:
      "Conquistado",

    earnedCompletion:
      "Conquistado ao concluir",

    journeyCheckpoints:
      "Pontos da Jornada",

    reached:
      "Alcançado",

    start:
      "Início",

    checkpoint:
      "Ponto {count}",

    finish:
      "Final",

    current:
      "Atual",

    upcoming:
      "Próximo",

    devJump:
      "🧪 DEV: Ir perto do final",

    claimRewards:
      "Concluir Jornada e Resgatar Recompensas",

    journeyCompleted:
      "🏆 Jornada Concluída",

    pauseTracking:
      "Pausar Rastreamento",

    resumeTracking:
      "Retomar Rastreamento",

    saveExit:
      "Salvar e Sair",

    share:
      "📤 Compartilhar Minha Caminhada",

    resetJourney:
      "Reiniciar Jornada",

    resetQuestion:
      "Reiniciar jornada?",

    resetWarning:
      "Seu progresso voltará a zero. As recompensas já resgatadas permanecerão protegidas.",

    cancel:
      "Cancelar",

    reset:
      "Reiniciar",

    resetComplete:
      "Jornada Reiniciada",

    resetCompleteMessage:
      "O progresso foi reiniciado. As recompensas já resgatadas foram mantidas.",

    unableSave:
      "Não Foi Possível Salvar a Jornada",

    unableShare:
      "Não Foi Possível Compartilhar",

    tryAgain:
      "Tente novamente.",

    notComplete:
      "Jornada Não Concluída",

    reachGoal:
      "Atinja a meta completa de passos antes de resgatar as recompensas.",

    completeTitle:
      "Jornada Concluída!",

    completedAgain:
      "Você concluiu esta caminhada novamente. Suas recompensas permanecem protegidas.",

    rewardsEarned:
      "WCoins ganhos: {coins}\nPontos Legathon ganhos: {points}",

    shareMessage:
      "Estou caminhando {title} no Legathon Walk.\n\nPassos: {steps}\nDistância: {miles} milhas\nPontos alcançados: {checkpoints}/5\n\nJunte-se a mim no Legathon Walk.",

    motionPermission:
      "Ative a permissão de Movimento e Fitness.",

    trackingUnavailable:
      "O rastreamento de passos não está disponível neste dispositivo.",

    trackingStartFailed:
      "Não foi possível iniciar o rastreamento da jornada.",

    preciseLocation:
      "Ative a localização precisa para filtrar movimentos de veículo.",

    anotherActivity:
      "Outra atividade controla o rastreamento de passos.",

    stepSaveFailed:
      "Não foi possível salvar seus passos.",

    progressSaveFailed:
      "O progresso não pôde ser totalmente salvo.",

    savedJourneyInvalid:
      "Os dados salvos da jornada são inválidos.",

    savedProgressInvalid:
      "O progresso salvo é inválido.",

    storyProgressInvalid:
      "O progresso salvo da história é inválido.",

    journeyListInvalid:
      "Os dados da lista de jornadas são inválidos.",

    loadFailed:
      "Não foi possível carregar sua jornada salva.",

    passportInvalid:
      "Os dados do passaporte são inválidos.",

    signIn:
      "Entre na sua conta Legathon antes de resgatar recompensas WCoin.",

    rewardFailed:
      "O serviço de recompensas não confirmou a premiação.",

    routeAccessibility:
      "Arte da rota da jornada",

    legathonJourney:
      "Jornada Legathon",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    back: "戻る",

    journeyUnavailable:
      "ジャーニーを利用できません",

    journeyUnavailableText:
      "追跡を開始するにはIDと歩数目標が必要です。",

    loading:
      "保存したジャーニー進捗を読み込み中…",

    liveProgress:
      "ライブ・ジャーニー進捗",

    defaultDescription:
      "どこでも歩けます。一歩ごとにLegathonジャーニーの完了へ近づきます。",

    waitingGps:
      "信頼できるGPSを待っています",

    vehiclePaused:
      "車両速度の移動 — 歩数を一時停止",

    verifyingWalking:
      "歩行速度を確認中",

    walkingVerified:
      "歩行を確認しました",

    goalReached:
      "ジャーニー目標達成",

    saving:
      "進捗を保存中",

    starting:
      "追跡を開始中",

    trackingPaused:
      "追跡一時停止",

    autoSaved:
      "{time} に自動保存",

    autoSaveReady:
      "自動保存の準備完了",

    steps:
      "歩数",

    miles:
      "マイル",

    calories:
      "カロリー",

    time:
      "時間",

    journeyProgress:
      "ジャーニー進捗",

    remainingSteps:
      "残り {count} 歩",

    remainingStepsLabel:
      "残りの歩数",

    goalCompleted:
      "歩数目標を達成しました",

    routeUnavailable:
      "ルートカードを利用できません",

    routeUnavailableText:
      "{title} のルート画像はまだ接続されていません。",

    journeySummary:
      "ジャーニー概要",

    progress:
      "進捗",

    completedCheckpoints:
      "完了チェックポイント",

    trackingStatus:
      "追跡状態",

    active:
      "アクティブ",

    paused:
      "一時停止",

    journeyRewards:
      "ジャーニー報酬",

    rewardPoints:
      "報酬ポイント",

    wcoins:
      "WCoins",

    passportStamp:
      "パスポートスタンプ",

    unlocked:
      "解除済み",

    unlocksCompletion:
      "完了時に解除",

    certificate:
      "証明書",

    earned:
      "獲得済み",

    earnedCompletion:
      "完了時に獲得",

    journeyCheckpoints:
      "ジャーニーチェックポイント",

    reached:
      "到達",

    start:
      "スタート",

    checkpoint:
      "チェックポイント {count}",

    finish:
      "ゴール",

    current:
      "現在",

    upcoming:
      "次",

    devJump:
      "🧪 DEV: ゴール直前へ移動",

    claimRewards:
      "ジャーニーを完了して報酬を受け取る",

    journeyCompleted:
      "🏆 ジャーニー完了",

    pauseTracking:
      "追跡を一時停止",

    resumeTracking:
      "追跡を再開",

    saveExit:
      "保存して終了",

    share:
      "📤 ウォークを共有",

    resetJourney:
      "ジャーニーをリセット",

    resetQuestion:
      "ジャーニーをリセットしますか？",

    resetWarning:
      "歩行進捗はゼロに戻ります。獲得済みの報酬は保持されます。",

    cancel:
      "キャンセル",

    reset:
      "リセット",

    resetComplete:
      "ジャーニーをリセットしました",

    resetCompleteMessage:
      "進捗をリセットしました。獲得済みの報酬は保持されています。",

    unableSave:
      "ジャーニーを保存できません",

    unableShare:
      "共有できません",

    tryAgain:
      "もう一度お試しください。",

    notComplete:
      "ジャーニー未完了",

    reachGoal:
      "報酬を受け取る前に歩数目標を達成してください。",

    completeTitle:
      "ジャーニー完了！",

    completedAgain:
      "このウォークを再度完了しました。獲得済みの報酬は保持されます。",

    rewardsEarned:
      "獲得WCoins: {coins}\n獲得Legathonポイント: {points}",

    shareMessage:
      "Legathon Walkで{title}を歩いています。\n\n歩数: {steps}\n距離: {miles}マイル\n到達チェックポイント: {checkpoints}/5\n\n一緒に歩きましょう。",

    motionPermission:
      "歩数を数えるにはモーションとフィットネスの権限を有効にしてください。",

    trackingUnavailable:
      "この端末では歩数追跡を利用できません。",

    trackingStartFailed:
      "ジャーニー追跡を開始できませんでした。",

    preciseLocation:
      "車両移動を除外するため正確な位置情報を有効にしてください。",

    anotherActivity:
      "別のアクティビティが歩数追跡を使用しています。",

    stepSaveFailed:
      "歩数を保存できませんでした。",

    progressSaveFailed:
      "進捗を完全に保存できませんでした。",

    savedJourneyInvalid:
      "保存されたジャーニーデータが無効です。",

    savedProgressInvalid:
      "保存された進捗が無効です。",

    storyProgressInvalid:
      "保存されたストーリー進捗が無効です。",

    journeyListInvalid:
      "ジャーニー一覧データが無効です。",

    loadFailed:
      "保存されたジャーニーを読み込めませんでした。",

    passportInvalid:
      "パスポートデータが無効です。",

    signIn:
      "WCoin報酬を受け取る前にLegathonアカウントへサインインしてください。",

    rewardFailed:
      "報酬サービスが付与を確認できませんでした。",

    routeAccessibility:
      "ジャーニールート画像",

    legathonJourney:
      "Legathonジャーニー",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    back: "뒤로",

    journeyUnavailable:
      "여정을 사용할 수 없습니다",

    journeyUnavailableText:
      "추적을 시작하려면 여정 ID와 걸음 목표가 필요합니다.",

    loading:
      "저장된 여정 진행 상황 불러오는 중…",

    liveProgress:
      "실시간 여정 진행",

    defaultDescription:
      "어디서든 걸으세요. 한 걸음마다 Legathon 여정 완주에 가까워집니다.",

    waitingGps:
      "신뢰할 수 있는 GPS를 기다리는 중",

    vehiclePaused:
      "차량 속도 이동 — 걸음 수 일시 정지",

    verifyingWalking:
      "걷기 속도 확인 중",

    walkingVerified:
      "걷기 확인됨",

    goalReached:
      "여정 목표 달성",

    saving:
      "진행 상황 저장 중",

    starting:
      "추적 시작 중",

    trackingPaused:
      "추적 일시 정지",

    autoSaved:
      "{time} 자동 저장",

    autoSaveReady:
      "자동 저장 준비 완료",

    steps:
      "걸음 수",

    miles:
      "마일",

    calories:
      "칼로리",

    time:
      "시간",

    journeyProgress:
      "여정 진행",

    remainingSteps:
      "{count}걸음 남음",

    remainingStepsLabel:
      "남은 걸음 수",

    goalCompleted:
      "여정 걸음 목표 완료",

    routeUnavailable:
      "경로 카드를 사용할 수 없습니다",

    routeUnavailableText:
      "{title}의 경로 이미지가 아직 연결되지 않았습니다.",

    journeySummary:
      "여정 요약",

    progress:
      "진행",

    completedCheckpoints:
      "완료한 체크포인트",

    trackingStatus:
      "추적 상태",

    active:
      "활성",

    paused:
      "일시 정지",

    journeyRewards:
      "여정 보상",

    rewardPoints:
      "보상 포인트",

    wcoins:
      "WCoins",

    passportStamp:
      "패스포트 스탬프",

    unlocked:
      "잠금 해제됨",

    unlocksCompletion:
      "완료 시 잠금 해제",

    certificate:
      "인증서",

    earned:
      "획득",

    earnedCompletion:
      "완료 시 획득",

    journeyCheckpoints:
      "여정 체크포인트",

    reached:
      "도달",

    start:
      "시작",

    checkpoint:
      "체크포인트 {count}",

    finish:
      "완료",

    current:
      "현재",

    upcoming:
      "예정",

    devJump:
      "🧪 DEV: 종료 지점 근처로 이동",

    claimRewards:
      "여정 완료 및 보상 받기",

    journeyCompleted:
      "🏆 여정 완료",

    pauseTracking:
      "추적 일시 정지",

    resumeTracking:
      "추적 재개",

    saveExit:
      "저장 후 종료",

    share:
      "📤 내 걷기 공유",

    resetJourney:
      "여정 초기화",

    resetQuestion:
      "여정을 초기화할까요?",

    resetWarning:
      "걷기 진행 상황이 0으로 돌아갑니다. 이미 받은 보상은 유지됩니다.",

    cancel:
      "취소",

    reset:
      "초기화",

    resetComplete:
      "여정 초기화 완료",

    resetCompleteMessage:
      "진행 상황이 초기화되었습니다. 이미 받은 보상은 유지됩니다.",

    unableSave:
      "여정을 저장할 수 없습니다",

    unableShare:
      "공유할 수 없습니다",

    tryAgain:
      "다시 시도해 주세요.",

    notComplete:
      "여정 미완료",

    reachGoal:
      "보상을 받기 전에 전체 걸음 목표를 달성하세요.",

    completeTitle:
      "여정 완료!",

    completedAgain:
      "이 걷기를 다시 완료했습니다. 이전에 받은 보상은 유지됩니다.",

    rewardsEarned:
      "획득 WCoins: {coins}\n획득 Legathon 포인트: {points}",

    shareMessage:
      "Legathon Walk에서 {title}을 걷고 있습니다.\n\n걸음 수: {steps}\n거리: {miles}마일\n도달 체크포인트: {checkpoints}/5\n\nLegathon Walk에서 함께 걸어요.",

    motionPermission:
      "걸음 수를 계산하려면 모션 및 피트니스 권한을 활성화하세요.",

    trackingUnavailable:
      "이 기기에서는 걸음 추적을 사용할 수 없습니다.",

    trackingStartFailed:
      "여정 추적을 시작할 수 없습니다.",

    preciseLocation:
      "차량 이동을 필터링하려면 정확한 위치 권한을 활성화하세요.",

    anotherActivity:
      "다른 활동이 걸음 추적을 사용 중입니다.",

    stepSaveFailed:
      "걸음 수를 저장할 수 없습니다.",

    progressSaveFailed:
      "진행 상황을 완전히 저장하지 못했습니다.",

    savedJourneyInvalid:
      "저장된 여정 데이터가 올바르지 않습니다.",

    savedProgressInvalid:
      "저장된 진행 상황이 올바르지 않습니다.",

    storyProgressInvalid:
      "저장된 이야기 진행 상황이 올바르지 않습니다.",

    journeyListInvalid:
      "여정 목록 데이터가 올바르지 않습니다.",

    loadFailed:
      "저장된 여정을 불러올 수 없습니다.",

    passportInvalid:
      "패스포트 데이터가 올바르지 않습니다.",

    signIn:
      "WCoin 보상을 받기 전에 Legathon 계정에 로그인하세요.",

    rewardFailed:
      "보상 서비스가 지급을 확인하지 못했습니다.",

    routeAccessibility:
      "여정 경로 이미지",

    legathonJourney:
      "Legathon 여정",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    back: "返回",

    journeyUnavailable:
      "旅程不可用",

    journeyUnavailableText:
      "开始追踪前，此旅程需要有效的ID和步数目标。",

    loading:
      "正在加载已保存的旅程进度…",

    liveProgress:
      "实时旅程进度",

    defaultDescription:
      "你可以在任何地方步行。每一步都会让你更接近完成 Legathon 旅程。",

    waitingGps:
      "正在等待可靠的GPS信号",

    vehiclePaused:
      "检测到车辆速度 — 步数已暂停",

    verifyingWalking:
      "正在验证步行速度",

    walkingVerified:
      "步行已验证",

    goalReached:
      "旅程目标已达成",

    saving:
      "正在保存进度",

    starting:
      "正在开始追踪",

    trackingPaused:
      "追踪已暂停",

    autoSaved:
      "已于 {time} 自动保存",

    autoSaveReady:
      "自动保存已就绪",

    steps:
      "步数",

    miles:
      "英里",

    calories:
      "卡路里",

    time:
      "时间",

    journeyProgress:
      "旅程进度",

    remainingSteps:
      "还剩 {count} 步",

    remainingStepsLabel:
      "剩余步数",

    goalCompleted:
      "旅程步数目标已完成",

    routeUnavailable:
      "路线卡不可用",

    routeUnavailableText:
      "{title} 的路线图尚未连接。",

    journeySummary:
      "旅程概要",

    progress:
      "进度",

    completedCheckpoints:
      "已完成检查点",

    trackingStatus:
      "追踪状态",

    active:
      "进行中",

    paused:
      "已暂停",

    journeyRewards:
      "旅程奖励",

    rewardPoints:
      "奖励积分",

    wcoins:
      "WCoins",

    passportStamp:
      "护照印章",

    unlocked:
      "已解锁",

    unlocksCompletion:
      "完成后解锁",

    certificate:
      "证书",

    earned:
      "已获得",

    earnedCompletion:
      "完成后获得",

    journeyCheckpoints:
      "旅程检查点",

    reached:
      "已到达",

    start:
      "起点",

    checkpoint:
      "检查点 {count}",

    finish:
      "终点",

    current:
      "当前",

    upcoming:
      "即将到达",

    devJump:
      "🧪 DEV：跳到接近终点",

    claimRewards:
      "完成旅程并领取奖励",

    journeyCompleted:
      "🏆 旅程已完成",

    pauseTracking:
      "暂停追踪",

    resumeTracking:
      "继续追踪",

    saveExit:
      "保存并退出",

    share:
      "📤 分享我的步行",

    resetJourney:
      "重置旅程",

    resetQuestion:
      "重置旅程？",

    resetWarning:
      "你的步行进度将归零。已经领取的奖励会继续保留。",

    cancel:
      "取消",

    reset:
      "重置",

    resetComplete:
      "旅程已重置",

    resetCompleteMessage:
      "进度已重置。已经领取的奖励仍然保留。",

    unableSave:
      "无法保存旅程",

    unableShare:
      "无法分享",

    tryAgain:
      "请重试。",

    notComplete:
      "旅程尚未完成",

    reachGoal:
      "请达到完整步数目标后再领取奖励。",

    completeTitle:
      "旅程完成！",

    completedAgain:
      "你再次完成了这段步行。之前领取的奖励仍然保留。",

    rewardsEarned:
      "获得 WCoins：{coins}\n获得 Legathon 积分：{points}",

    shareMessage:
      "我正在 Legathon Walk 上步行 {title}。\n\n步数：{steps}\n距离：{miles} 英里\n已到达检查点：{checkpoints}/5\n\n加入我，一起使用 Legathon Walk。",

    motionPermission:
      "请启用运动与健身权限以计算步数。",

    trackingUnavailable:
      "此设备不支持步数追踪。",

    trackingStartFailed:
      "无法开始旅程追踪。",

    preciseLocation:
      "请启用精确位置以过滤车辆移动。",

    anotherActivity:
      "另一个活动正在使用步数追踪。",

    stepSaveFailed:
      "无法保存步数总计。",

    progressSaveFailed:
      "进度未能完整保存。",

    savedJourneyInvalid:
      "已保存的旅程数据无效。",

    savedProgressInvalid:
      "已保存的进度无效。",

    storyProgressInvalid:
      "已保存的故事进度无效。",

    journeyListInvalid:
      "旅程列表数据无效。",

    loadFailed:
      "无法加载已保存的旅程。",

    passportInvalid:
      "护照数据无效。",

    signIn:
      "领取 WCoin 奖励前，请先登录你的 Legathon 账户。",

    rewardFailed:
      "奖励服务未确认奖励发放。",

    routeAccessibility:
      "旅程路线图",

    legathonJourney:
      "Legathon旅程",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    back: "Indietro",

    journeyUnavailable:
      "Percorso non disponibile",

    journeyUnavailableText:
      "Questo percorso richiede un ID e un obiettivo di passi prima di avviare il monitoraggio.",

    loading:
      "Caricamento dei progressi salvati…",

    liveProgress:
      "PROGRESSO DEL PERCORSO IN TEMPO REALE",

    defaultDescription:
      "Cammina ovunque. Ogni passo ti avvicina al completamento del tuo percorso Legathon.",

    waitingGps:
      "In attesa di un GPS affidabile",

    vehiclePaused:
      "Movimento da veicolo — passi in pausa",

    verifyingWalking:
      "Verifica della velocità di camminata",

    walkingVerified:
      "Camminata verificata",

    goalReached:
      "Obiettivo del percorso raggiunto",

    saving:
      "Salvataggio dei progressi",

    starting:
      "Avvio del monitoraggio",

    trackingPaused:
      "Monitoraggio in pausa",

    autoSaved:
      "Salvato automaticamente alle {time}",

    autoSaveReady:
      "Salvataggio automatico pronto",

    steps:
      "Passi",

    miles:
      "Miglia",

    calories:
      "Calorie",

    time:
      "Tempo",

    journeyProgress:
      "Progresso del Percorso",

    remainingSteps:
      "{count} passi rimanenti",

    remainingStepsLabel:
      "Passi Rimanenti",

    goalCompleted:
      "Obiettivo di passi completato",

    routeUnavailable:
      "Scheda del percorso non disponibile",

    routeUnavailableText:
      "L’immagine del percorso per {title} non è ancora collegata.",

    journeySummary:
      "Riepilogo del Percorso",

    progress:
      "Progresso",

    completedCheckpoints:
      "Checkpoint Completati",

    trackingStatus:
      "Stato del Monitoraggio",

    active:
      "Attivo",

    paused:
      "In pausa",

    journeyRewards:
      "Premi del Percorso",

    rewardPoints:
      "Punti Premio",

    wcoins:
      "WCoins",

    passportStamp:
      "Timbro Passaporto",

    unlocked:
      "Sbloccato",

    unlocksCompletion:
      "Si sblocca al completamento",

    certificate:
      "Certificato",

    earned:
      "Ottenuto",

    earnedCompletion:
      "Ottenuto al completamento",

    journeyCheckpoints:
      "Checkpoint del Percorso",

    reached:
      "Raggiunto",

    start:
      "Inizio",

    checkpoint:
      "Checkpoint {count}",

    finish:
      "Fine",

    current:
      "Attuale",

    upcoming:
      "In arrivo",

    devJump:
      "🧪 DEV: Vai vicino alla fine",

    claimRewards:
      "Completa il Percorso e Riscatta i Premi",

    journeyCompleted:
      "🏆 Percorso Completato",

    pauseTracking:
      "Pausa Monitoraggio",

    resumeTracking:
      "Riprendi Monitoraggio",

    saveExit:
      "Salva ed Esci",

    share:
      "📤 Condividi la Mia Camminata",

    resetJourney:
      "Reimposta Percorso",

    resetQuestion:
      "Reimpostare il percorso?",

    resetWarning:
      "I tuoi progressi torneranno a zero. I premi già riscattati resteranno protetti.",

    cancel:
      "Annulla",

    reset:
      "Reimposta",

    resetComplete:
      "Percorso Reimpostato",

    resetCompleteMessage:
      "I progressi sono stati reimpostati. I premi già riscattati sono stati mantenuti.",

    unableSave:
      "Impossibile Salvare il Percorso",

    unableShare:
      "Impossibile Condividere",

    tryAgain:
      "Riprova.",

    notComplete:
      "Percorso Non Completato",

    reachGoal:
      "Raggiungi l’obiettivo completo di passi prima di riscattare i premi.",

    completeTitle:
      "Percorso Completato!",

    completedAgain:
      "Hai completato di nuovo questa camminata. I premi restano protetti.",

    rewardsEarned:
      "WCoins guadagnati: {coins}\nPunti Legathon guadagnati: {points}",

    shareMessage:
      "Sto percorrendo {title} su Legathon Walk.\n\nPassi: {steps}\nDistanza: {miles} miglia\nCheckpoint raggiunti: {checkpoints}/5\n\nUnisciti a me su Legathon Walk.",

    motionPermission:
      "Abilita l’autorizzazione Movimento e Fitness.",

    trackingUnavailable:
      "Il monitoraggio dei passi non è disponibile su questo dispositivo.",

    trackingStartFailed:
      "Impossibile avviare il monitoraggio del percorso.",

    preciseLocation:
      "Abilita la posizione precisa per filtrare i movimenti in veicolo.",

    anotherActivity:
      "Un’altra attività sta usando il monitoraggio dei passi.",

    stepSaveFailed:
      "Impossibile salvare i passi.",

    progressSaveFailed:
      "I progressi non sono stati salvati completamente.",

    savedJourneyInvalid:
      "I dati salvati del percorso non sono validi.",

    savedProgressInvalid:
      "I progressi salvati non sono validi.",

    storyProgressInvalid:
      "I progressi salvati della storia non sono validi.",

    journeyListInvalid:
      "I dati dell’elenco percorsi non sono validi.",

    loadFailed:
      "Impossibile caricare il percorso salvato.",

    passportInvalid:
      "I dati del passaporto non sono validi.",

    signIn:
      "Accedi al tuo account Legathon prima di riscattare i premi WCoin.",

    rewardFailed:
      "Il servizio premi non ha confermato l’assegnazione.",

    routeAccessibility:
      "Immagine del percorso",

    legathonJourney:
      "Percorso Legathon",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    back: "رجوع",

    journeyUnavailable:
      "الرحلة غير متاحة",

    journeyUnavailableText:
      "تحتاج هذه الرحلة إلى معرّف وهدف للخطوات قبل بدء التتبع.",

    loading:
      "جارٍ تحميل تقدم الرحلة المحفوظ…",

    liveProgress:
      "تقدم الرحلة المباشر",

    defaultDescription:
      "امشِ أينما تريد. كل خطوة تقربك من إكمال رحلة Legathon.",

    waitingGps:
      "في انتظار إشارة GPS موثوقة",

    vehiclePaused:
      "حركة بسرعة مركبة — تم إيقاف الخطوات مؤقتاً",

    verifyingWalking:
      "جارٍ التحقق من سرعة المشي",

    walkingVerified:
      "تم التحقق من المشي",

    goalReached:
      "تم الوصول إلى هدف الرحلة",

    saving:
      "جارٍ حفظ التقدم",

    starting:
      "جارٍ بدء التتبع",

    trackingPaused:
      "التتبع متوقف مؤقتاً",

    autoSaved:
      "تم الحفظ التلقائي {time}",

    autoSaveReady:
      "الحفظ التلقائي جاهز",

    steps:
      "الخطوات",

    miles:
      "الأميال",

    calories:
      "السعرات",

    time:
      "الوقت",

    journeyProgress:
      "تقدم الرحلة",

    remainingSteps:
      "متبقي {count} خطوة",

    remainingStepsLabel:
      "الخطوات المتبقية",

    goalCompleted:
      "تم إكمال هدف خطوات الرحلة",

    routeUnavailable:
      "بطاقة المسار غير متاحة",

    routeUnavailableText:
      "لم يتم ربط صورة مسار {title} بعد.",

    journeySummary:
      "ملخص الرحلة",

    progress:
      "التقدم",

    completedCheckpoints:
      "نقاط التحقق المكتملة",

    trackingStatus:
      "حالة التتبع",

    active:
      "نشط",

    paused:
      "متوقف مؤقتاً",

    journeyRewards:
      "مكافآت الرحلة",

    rewardPoints:
      "نقاط المكافأة",

    wcoins:
      "WCoins",

    passportStamp:
      "ختم جواز السفر",

    unlocked:
      "تم الفتح",

    unlocksCompletion:
      "يُفتح عند الإكمال",

    certificate:
      "الشهادة",

    earned:
      "تم الحصول عليها",

    earnedCompletion:
      "تُكتسب عند الإكمال",

    journeyCheckpoints:
      "نقاط الرحلة",

    reached:
      "تم الوصول",

    start:
      "البداية",

    checkpoint:
      "نقطة {count}",

    finish:
      "النهاية",

    current:
      "الحالية",

    upcoming:
      "قادمة",

    devJump:
      "🧪 DEV: الانتقال قرب النهاية",

    claimRewards:
      "إكمال الرحلة والمطالبة بالمكافآت",

    journeyCompleted:
      "🏆 اكتملت الرحلة",

    pauseTracking:
      "إيقاف التتبع مؤقتاً",

    resumeTracking:
      "استئناف التتبع",

    saveExit:
      "حفظ وخروج",

    share:
      "📤 مشاركة مشيتي",

    resetJourney:
      "إعادة ضبط الرحلة",

    resetQuestion:
      "إعادة ضبط الرحلة؟",

    resetWarning:
      "سيعود تقدم المشي إلى الصفر. ستظل المكافآت السابقة محفوظة.",

    cancel:
      "إلغاء",

    reset:
      "إعادة ضبط",

    resetComplete:
      "تمت إعادة ضبط الرحلة",

    resetCompleteMessage:
      "تمت إعادة ضبط التقدم. تم الاحتفاظ بالمكافآت السابقة.",

    unableSave:
      "تعذر حفظ الرحلة",

    unableShare:
      "تعذرت المشاركة",

    tryAgain:
      "حاول مرة أخرى.",

    notComplete:
      "الرحلة غير مكتملة",

    reachGoal:
      "أكمل هدف الخطوات بالكامل قبل المطالبة بالمكافآت.",

    completeTitle:
      "اكتملت الرحلة!",

    completedAgain:
      "لقد أكملت هذه المسيرة مرة أخرى. ستظل المكافآت السابقة محفوظة.",

    rewardsEarned:
      "WCoins المكتسبة: {coins}\nنقاط Legathon المكتسبة: {points}",

    shareMessage:
      "أنا أمشي في {title} على Legathon Walk.\n\nالخطوات: {steps}\nالمسافة: {miles} ميل\nالنقاط التي تم الوصول إليها: {checkpoints}/5\n\nانضم إلي على Legathon Walk.",

    motionPermission:
      "فعّل إذن الحركة واللياقة لاحتساب الخطوات.",

    trackingUnavailable:
      "تتبع الخطوات غير متاح على هذا الجهاز.",

    trackingStartFailed:
      "تعذر بدء تتبع الرحلة.",

    preciseLocation:
      "فعّل الموقع الدقيق لتصفية حركة المركبات.",

    anotherActivity:
      "هناك نشاط آخر يستخدم تتبع الخطوات.",

    stepSaveFailed:
      "تعذر حفظ إجمالي خطواتك.",

    progressSaveFailed:
      "تعذر حفظ التقدم بالكامل.",

    savedJourneyInvalid:
      "بيانات الرحلة المحفوظة غير صالحة.",

    savedProgressInvalid:
      "التقدم المحفوظ غير صالح.",

    storyProgressInvalid:
      "تقدم القصة المحفوظ غير صالح.",

    journeyListInvalid:
      "بيانات قائمة الرحلات غير صالحة.",

    loadFailed:
      "تعذر تحميل رحلتك المحفوظة.",

    passportInvalid:
      "بيانات جواز السفر غير صالحة.",

    signIn:
      "سجّل الدخول إلى حساب Legathon قبل المطالبة بمكافآت WCoin.",

    rewardFailed:
      "لم تؤكد خدمة المكافآت منح الجائزة.",

    routeAccessibility:
      "صورة مسار الرحلة",

    legathonJourney:
      "رحلة Legathon",
  },
};

// ============================================================
// TRANSLATION HELPERS
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
    ) => {
      return Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[key]
          )
        : match;
    }
  );
}

function getText(
  language = "en",
  key,
  variables = {}
) {
  const local =
    GPS_TEXT?.[
      language
    ]?.[key];

  if (local) {
    return fillTemplate(
      local,
      variables
    );
  }

  const central =
    translate(
      language,
      key
    );

  if (
    central !==
    key
  ) {
    return fillTemplate(
      central,
      variables
    );
  }

  return fillTemplate(
    GPS_TEXT.en?.[
      key
    ] ||
      key,
    variables
  );
}

function translateWalkingStatus(
  language,
  status
) {
  const statusKeys = {
    "Waiting for reliable GPS":
      "waitingGps",

    "Vehicle-speed movement — steps paused":
      "vehiclePaused",

    "Verifying walking speed":
      "verifyingWalking",

    "Walking verified":
      "walkingVerified",
  };

  const key =
    statusKeys[
      status
    ];

  return key
    ? getText(
        language,
        key
      )
    : status;
}

// ============================================================
// WALKING GATE
// ============================================================

// Do NOT translate these internal values.
// "Walking verified" is used by the step-tracking logic.
export function createWalkingGate(
  clock = Date.now
) {
  let lastFix = 0;
  let previous = null;
  let generation = 0;
  let driving = false;
  let slowSamples = 0;
  let mediumFastSamples = 0;
  let unknownSamples = 0;

  function resetVerification() {
    generation += 1;
    slowSamples = 0;
    mediumFastSamples = 0;
    unknownSamples = 0;
  }

  function status() {
    const now =
      clock();

    if (
      !lastFix ||
      now - lastFix >
        10000
    ) {
      return "Waiting for reliable GPS";
    }

    if (
      driving
    ) {
      return "Vehicle-speed movement — steps paused";
    }

    if (
      slowSamples <
      2
    ) {
      return "Verifying walking speed";
    }

    return "Walking verified";
  }

  function update(
    fix
  ) {
    const now =
      clock();

    const coords =
      fix?.coords;

    const time =
      Number(
        fix?.timestamp
      );

    if (
      !coords ||
      !Number.isFinite(
        time
      ) ||
      now - time >
        10000 ||
      time >
        now + 1000 ||
      !Number.isFinite(
        coords.accuracy
      ) ||
      coords.accuracy >
        50 ||
      coords.accuracy <
        0 ||
      !Number.isFinite(
        coords.latitude
      ) ||
      !Number.isFinite(
        coords.longitude
      )
    ) {
      unknownSamples +=
        1;

      if (
        unknownSamples >=
        2
      ) {
        resetVerification();
      }

      return;
    }

    unknownSamples =
      0;

    if (
      previous &&
      time <=
        previous.timestamp
    ) {
      return;
    }

    if (
      lastFix &&
      time - lastFix >
        10000
    ) {
      resetVerification();
    }

    let derivedSpeed =
      null;

    if (
      previous
    ) {
      const seconds =
        (
          time -
          previous.timestamp
        ) /
        1000;

      if (
        seconds >= 1 &&
        seconds <= 10
      ) {
        const radians =
          Math.PI /
          180;

        const latitudeDifference =
          (
            coords.latitude -
            previous.coords
              .latitude
          ) *
          radians;

        const longitudeDifference =
          (
            coords.longitude -
            previous.coords
              .longitude
          ) *
          radians;

        const haversine =
          Math.sin(
            latitudeDifference /
              2
          ) **
            2 +
          Math.cos(
            coords.latitude *
              radians
          ) *
            Math.cos(
              previous.coords
                .latitude *
                radians
            ) *
            Math.sin(
              longitudeDifference /
                2
            ) **
              2;

        const distance =
          6371000 *
          2 *
          Math.asin(
            Math.sqrt(
              Math.min(
                1,
                haversine
              )
            )
          );

        derivedSpeed =
          Math.max(
            0,
            distance -
              coords.accuracy -
              previous.coords
                .accuracy
          ) /
          seconds;
      }
    }

    previous =
      fix;

    lastFix =
      time;

    const reportedSpeed =
      Number.isFinite(
        coords.speed
      ) &&
      coords.speed >=
        0
        ? coords.speed
        : null;

    const speed =
      reportedSpeed ===
      null
        ? derivedSpeed
        : Math.max(
            reportedSpeed,
            derivedSpeed ??
              0
          );

    if (
      speed ===
      null
    ) {
      unknownSamples +=
        1;

      if (
        unknownSamples >=
        2
      ) {
        resetVerification();
      }

      return;
    }

    unknownSamples =
      0;

    if (
      speed >= 4
    ) {
      driving = true;

      resetVerification();

      return;
    }

    if (
      speed > 2.8
    ) {
      mediumFastSamples +=
        1;

      slowSamples =
        0;

      if (
        mediumFastSamples >=
        2
      ) {
        resetVerification();
      }

      return;
    }

    mediumFastSamples =
      0;

    slowSamples =
      Math.min(
        slowSamples +
          1,
        2
      );

    if (
      slowSamples >=
      2
    ) {
      driving = false;
    }
  }

  function ticket() {
    if (
      clock() -
        lastFix >
      10000
    ) {
      resetVerification();

      lastFix =
        0;
    }

    return status() ===
      "Walking verified"
      ? generation
      : null;
  }

  return {
    update,
    status,
    ticket,
  };
}

// ============================================================
// SERIALIZE JOURNEY OPERATIONS
// ============================================================

let journeyWork =
  Promise.resolve();

function enqueueJourneyWork(
  operation
) {
  const result =
    journeyWork.then(
      operation
    );

  journeyWork =
    result.catch(
      () => {}
    );

  return result;
}

// ============================================================
// HELPERS
// ============================================================

function normalizeId(
  value
) {
  return String(
    value ??
      ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[_\s]+/g,
      "-"
    )
    .replace(
      /[^a-z0-9-]/g,
      ""
    )
    .replace(
      /-+/g,
      "-"
    );
}

function nonnegative(
  value,
  fallback = 0
) {
  const number =
    Number(
      value
    );

  return Number.isFinite(
    number
  ) &&
    number >=
      0
    ? number
    : fallback;
}

function firstPositive(
  ...values
) {
  return (
    values
      .map(
        Number
      )
      .find(
        value =>
          Number.isFinite(
            value
          ) &&
          value >
            0
      ) ||
    0
  );
}

function parseObject(
  raw,
  language = "en"
) {
  if (
    !raw
  ) {
    return {};
  }

  const value =
    JSON.parse(
      raw
    );

  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value
    )
  ) {
    throw new Error(
      getText(
        language,
        "savedJourneyInvalid"
      )
    );
  }

  return value;
}

function checkpointFor(
  steps,
  goal
) {
  return steps >=
    goal
    ? 5
    : Math.min(
        4,
        1 +
          Math.floor(
            (
              steps /
              goal
            ) *
              4
          )
      );
}

// ============================================================
// MAIN WRAPPER
// ============================================================

export default function GPSJourneyMapScreen(
  props
) {
  const language =
    props.language ||
    "en";

  const raw =
    props.journey ||
    props.selectedJourney ||
    props.activeJourney ||
    props.route
      ?.params
      ?.journey ||
    props.route
      ?.params
      ?.selectedJourney;

  const data =
    raw &&
    typeof raw ===
      "object"
      ? raw
      : raw
      ? {
          id:
            String(
              raw
            ),

          title:
            String(
              raw
            ),
        }
      : {};

  const id =
    String(
      data.id ||
        data.journeyId ||
        data.routeKey ||
        data.slug ||
        props.route
          ?.params
          ?.journeyId ||
        props.route
          ?.params
          ?.id ||
        ""
    );

  const reward =
    JOURNEY_REWARDS[
      normalizeId(
        id
      )
    ] ||
    JOURNEY_REWARDS[
      id
    ] ||
    {};

  const goal =
    firstPositive(
      data.totalSteps,

      data.requiredSteps,

      data.stepGoal,

      data.targetSteps,

      reward.totalSteps,

      firstPositive(
        data.distanceMiles,

        data.miles,

        reward.distanceMiles
      ) *
        2000
    );

  if (
    !id ||
    !goal
  ) {
    return (
      <View
        style={[
          styles.container,
          styles.content,
        ]}
      >
        <Text
          style={
            styles.title
          }
        >
          {getText(
            language,
            "journeyUnavailable"
          )}
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          {getText(
            language,
            "journeyUnavailableText"
          )}
        </Text>

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            props.goBack
              ? props.goBack()
              : props.navigation
                  ?.goBack()
          }
        >
          <Text
            style={
              styles.secondaryText
            }
          >
            {getText(
              language,
              "back"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <JourneySession
      key={
        `${id}:${goal}`
      }
      {...props}
      language={
        language
      }
      initialJourney={{
        ...reward,
        ...data,

        id,

        totalSteps:
          Math.floor(
            goal
          ),
      }}
    />
  );
}

// ============================================================
// JOURNEY SESSION
// ============================================================

function JourneySession({
  initialJourney,

  language = "en",

  goBack,

  goToStory,

  navigation,
}) {
  const [
    currentJourney,
  ] =
    React.useState(
      initialJourney
    );

  const localizedJourney =
    React.useMemo(
      () =>
        getJourneyTranslation(
          currentJourney,
          language
        ),

      [
        currentJourney,
        language,
      ]
    );

  function t(
    key,
    variables = {}
  ) {
    return getText(
      language,
      key,
      variables
    );
  }

  const id =
    currentJourney.id;

  const normalizedJourneyId =
    normalizeId(
      id
    );

  const totalSteps =
    currentJourney.totalSteps;

  const journeyReward =
    JOURNEY_REWARDS[
      normalizedJourneyId
    ] ||
    JOURNEY_REWARDS[
      id
    ];

  const storyKey =
    `shownJourneyStories:${id}`;

  const [
    sessionId,
  ] =
    React.useState(
      () =>
        String(
          Date.now()
        )
    );

  const [
    view,
    setView,
  ] =
    React.useState(
      null
    );

  const [
    loadError,
    setLoadError,
  ] =
    React.useState(
      ""
    );

  const [
    saveError,
    setSaveError,
  ] =
    React.useState(
      ""
    );

  const [
    sensorError,
    setSensorError,
  ] =
    React.useState(
      ""
    );

  const [
    lastSavedAt,
    setLastSavedAt,
  ] =
    React.useState(
      null
    );

  // Keep this internal English value because
  // the walking gate uses it for logic.
  const [
    walkingStatus,
    setWalkingStatus,
  ] =
    React.useState(
      "Waiting for reliable GPS"
    );

  const [
    sensorReady,
    setSensorReady,
  ] =
    React.useState(
      false
    );

  const [
    busy,
    setBusy,
  ] =
    React.useState(
      false
    );

  const [
    focused,
    setFocused,
  ] =
    React.useState(
      () =>
        navigation
          ?.isFocused
          ?.() ??
        true
    );

  const [
    appState,
    setAppState,
  ] =
    React.useState(
      AppState.currentState ||
        "active"
    );

  const snapshot =
    React.useRef(
      null
    );

  const mounted =
    React.useRef(
      false
    );

  const busyRef =
    React.useRef(
      false
    );

  const trackingRef =
    React.useRef(
      false
    );

  const subscriptionRef =
    React.useRef(
      null
    );

  const allowNavigation =
    React.useRef(
      false
    );

  const errorRef =
    React.useRef(
      ""
    );

  // ==========================================================
  // PUBLISH
  // ==========================================================

  function publish() {
    if (
      mounted.current &&
      snapshot.current
    ) {
      setView({
        ...snapshot.current,
      });
    }
  }

  // ==========================================================
  // STOP SENSOR
  // ==========================================================

  function stopSensor() {
    trackingRef.current =
      false;

    subscriptionRef.current
      ?.remove();

    subscriptionRef.current =
      null;

    if (
      mounted.current
    ) {
      setSensorReady(
        false
      );
    }
  }

  // ==========================================================
  // SAVE ERROR
  // ==========================================================

  function reportSaveError(
    error
  ) {
    console.error(
      "Journey save failed:",
      error
    );

    errorRef.current =
      t(
        "progressSaveFailed"
      );

    if (
      mounted.current
    ) {
      setSaveError(
        errorRef.current
      );

      if (
        snapshot.current
      ) {
        snapshot.current.isTracking =
          false;
      }

      stopSensor();

      publish();
    }
  }

  // ==========================================================
  // SAVE CURRENT JOURNEY
  // ==========================================================

  async function persistNow() {
    if (
      !snapshot.current
    ) {
      return;
    }

    const state = {
      ...snapshot.current,
    };

    const percent =
      Math.min(
        100,

        (
          state.steps /
          totalSteps
        ) *
          100
      );

    const active = {
      ...currentJourney,

      sessionId,

      steps:
        state.steps,

      secondsActive:
        state.secondsActive,

      progress:
        percent,

      journeyProgress:
        percent,

      progressPercent:
        percent,

      currentCheckpoint:
        checkpointFor(
          state.steps,
          totalSteps
        ),

      completed:
        state.hasCompleted,

      isTracking:
        state.isTracking,

      lastUpdated:
        new Date()
          .toISOString(),
    };

    await AsyncStorage
      .multiSet([
        [
          `journeyStats_${id}`,

          JSON.stringify({
            ...state,

            schemaVersion:
              2,
          }),
        ],

        [
          `activeJourney_${id}`,

          JSON.stringify(
            active
          ),
        ],

        [
          `journeyProgress_${id}`,

          JSON.stringify(
            active
          ),
        ],

        [
          "activeJourney",

          JSON.stringify(
            active
          ),
        ],

        [
          "lastStartedJourney",

          JSON.stringify(
            active
          ),
        ],

        [
          "resumeJourneyId",
          id,
        ],

        [
          storyKey,

          JSON.stringify(
            state.shownStories
          ),
        ],

        [
          `lastRewardedCheckpoint_${id}`,

          String(
            state.lastRewardedCheckpoint
          ),
        ],
      ]);

    await updateJourneySteps(
      currentJourney,

      state.steps,

      {
        calories:
          Math.round(
            state.steps *
              0.04
          ),

        walkingTimeMinutes:
          state.secondsActive /
          60,
      }
    );

    const raw =
      await AsyncStorage
        .getItem(
          "journeyProgressData"
        );

    const existing =
      raw
        ? JSON.parse(
            raw
          )
        : [];

    if (
      !Array.isArray(
        existing
      )
    ) {
      throw new Error(
        t(
          "journeyListInvalid"
        )
      );
    }

    const entry = {
      id,

      title:
        currentJourney.title ||
        t(
          "legathonJourney"
        ),

      progress:
        percent,
    };

    const found =
      existing.some(
        item =>
          String(
            item?.id
          ) ===
          id
      );

    const updatedList =
      found
        ? existing.map(
            item =>
              String(
                item?.id
              ) ===
              id
                ? {
                    ...item,
                    ...entry,
                  }
                : item
          )
        : [
            ...existing,
            entry,
          ];

    await AsyncStorage
      .setItem(
        "journeyProgressData",

        JSON.stringify(
          updatedList
        )
      );

    errorRef.current =
      "";

    if (
      mounted.current
    ) {
      setSaveError(
        ""
      );

      setLastSavedAt(
        new Date()
      );
    }
  }

  function save() {
    return enqueueJourneyWork(
      persistNow
    );
  }

  // ==========================================================
  // RESTORE SAVED JOURNEY
  // ==========================================================

  React.useEffect(
    () => {
      mounted.current =
        true;

      let cancelled =
        false;

      enqueueJourneyWork(
        async () => {
          const values =
            Object.fromEntries(
              await AsyncStorage
                .multiGet([
                  `journeyStats_${id}`,

                  `journeyCompleted_${id}`,

                  `journeyRewarded_${id}`,

                  `lastRewardedCheckpoint_${id}`,

                  storyKey,

                  PROGRESS_KEY,
                ])
            );

          const rawStats =
            values[
              `journeyStats_${id}`
            ];

          const stats =
            parseObject(
              rawStats,
              language
            );

          const database =
            parseObject(
              values[
                PROGRESS_KEY
              ],
              language
            );

          const legacy =
            database[
              normalizedJourneyId
            ] ||
            {};

          const restoredSteps =
            Number(
              rawStats !=
              null
                ? stats.steps ??
                    0
                : legacy.stepsCompleted ??
                    0
            );

          const restoredSeconds =
            Number(
              rawStats !=
              null
                ? stats.secondsActive ??
                    0
                : (
                    legacy.walkingTimeMinutes ??
                    0
                  ) *
                    60
            );

          if (
            !Number.isFinite(
              restoredSteps
            ) ||
            restoredSteps <
              0 ||
            !Number.isFinite(
              restoredSeconds
            ) ||
            restoredSeconds <
              0
          ) {
            throw new Error(
              t(
                "savedProgressInvalid"
              )
            );
          }

          const stories =
            stats.shownStories ??
            (
              values[
                storyKey
              ]
                ? JSON.parse(
                    values[
                      storyKey
                    ]
                  )
                : []
            );

          if (
            !Array.isArray(
              stories
            )
          ) {
            throw new Error(
              t(
                "storyProgressInvalid"
              )
            );
          }

          const claimed =
            values[
              `journeyCompleted_${id}`
            ] ===
              "true" ||
            values[
              `journeyRewarded_${id}`
            ] ===
              "true" ||
            Boolean(
              legacy.rewardsClaimed
            );

          if (
            cancelled
          ) {
            return;
          }

          snapshot.current = {
            steps:
              Math.min(
                totalSteps,

                Math.floor(
                  restoredSteps
                )
              ),

            secondsActive:
              Math.floor(
                restoredSeconds
              ),

            hasCompleted:
              stats.hasCompleted ??
              claimed,

            rewardsClaimed:
              claimed,

            isTracking:
              stats.isTracking ??
              !claimed,

            lastRewardedCheckpoint:
              Math.max(
                1,

                nonnegative(
                  stats.lastRewardedCheckpoint ??
                    values[
                      `lastRewardedCheckpoint_${id}`
                    ],

                  1
                )
              ),

            shownStories:
              stories
                .map(
                  Number
                )
                .filter(
                  number =>
                    number >=
                      1 &&
                    number <=
                      5
                ),
          };

          if (
            snapshot.current
              .steps >=
            totalSteps
          ) {
            snapshot.current.isTracking =
              false;
          }

          publish();

          setLoadError(
            ""
          );
        }
      ).catch(
        error => {
          console.error(
            "Journey restoration failed:",
            error
          );

          if (
            !cancelled
          ) {
            setLoadError(
              t(
                "loadFailed"
              )
            );
          }
        }
      );

      return () => {
        cancelled =
          true;

        mounted.current =
          false;

        stopSensor();

        if (
          snapshot.current
        ) {
          save().catch(
            error =>
              console.error(
                "Final journey save failed:",
                error
              )
          );
        }
      };
    },

    []
  );

  // ==========================================================
  // CURRENT VALUES
  // ==========================================================

  const ready =
    view !==
    null;

  const steps =
    view?.steps ||
    0;

  const secondsActive =
    view?.secondsActive ||
    0;

  const hasCompleted =
    Boolean(
      view?.hasCompleted
    );

  const isTracking =
    Boolean(
      view?.isTracking &&
        sensorReady &&
        walkingStatus ===
          "Walking verified" &&
        focused &&
        appState ===
          "active" &&
        !busy
    );

  const progress =
    Math.min(
      100,

      Math.floor(
        (
          steps /
          totalSteps
        ) *
          10000
      ) /
        100
    );

  const liveMiles =
    steps /
    2000;

  const liveCalories =
    Math.round(
      steps *
        0.04
    );

  const remainingSteps =
    Math.max(
      totalSteps -
        steps,

      0
    );

  const currentCheckpoint =
    checkpointFor(
      steps,
      totalSteps
    );

  const timeActive = [
    Math.floor(
      secondsActive /
        3600
    ),

    Math.floor(
      secondsActive /
        60
    ) %
      60,

    secondsActive %
      60,
  ]
    .map(
      number =>
        String(
          number
        ).padStart(
          2,
          "0"
        )
    )
    .join(
      ":"
    );

  // ==========================================================
  // LOCALIZED JOURNEY TITLE
  // ==========================================================

  const canonicalRouteTitle =
    currentJourney.title ||
    t(
      "legathonJourney"
    );

  const routeTitle =
    localizedJourney
      ?.title ||
    canonicalRouteTitle;

  const routeDescription =
    language !==
      "en" &&
    localizedJourney
      ?.subtitle
      ? localizedJourney
          .subtitle
      : currentJourney.gpsText ||
        currentJourney.description ||
        localizedJourney
          ?.subtitle ||
        t(
          "defaultDescription"
        );

  // ==========================================================
  // ROUTE IMAGE
  // ==========================================================

  const routeImage =
    getRouteImage(
      currentJourney,
      id,
      normalizedJourneyId
    );

  // ==========================================================
  // CHECKPOINT DATA
  // ==========================================================

  const journeyData =
    journeyMaps?.[
      id
    ] ||
    journeyMaps?.[
      normalizedJourneyId
    ] ||
    journeyMaps?.[
      currentJourney.title
    ] ||
    {};

  const names =
    journeyData.checkpoints ??
    currentJourney.checkpoints ??
    currentJourney.checkpointNames;

  const defaults = [
    t(
      "start"
    ),

    t(
      "checkpoint",
      {
        count:
          2,
      }
    ),

    t(
      "checkpoint",
      {
        count:
          3,
      }
    ),

    t(
      "checkpoint",
      {
        count:
          4,
      }
    ),

    t(
      "finish"
    ),
  ];

  const checkpoints =
    defaults.map(
      (
        fallback,
        index
      ) => {
        const item =
          Array.isArray(
            names
          )
            ? names[
                index
              ]
            : null;

        const threshold =
          Math.ceil(
            (
              totalSteps *
              index
            ) /
              4
          );

        return {
          id:
            index +
            1,

          title:
            typeof item ===
            "string"
              ? item
              : item?.title ||
                item?.name ||
                item?.label ||
                fallback,

          complete:
            ready &&
            steps >=
              threshold,

          active:
            ready &&
            index +
              1 ===
              currentCheckpoint &&
            steps <
              totalSteps,
        };
      }
    );

  const completedCheckpoints =
    checkpoints.filter(
      point =>
        point.complete
    ).length;

  // ==========================================================
  // CHECKPOINT POINT REWARDS
  // ==========================================================

  async function awardReachedCheckpoints() {
    const highest =
      checkpointFor(
        snapshot.current
          .steps,

        totalSteps
      );

    for (
      let checkpoint =
        2;

      checkpoint <=
      highest;

      checkpoint +=
        1
    ) {
      const key =
        `checkpointReward_${id}_${checkpoint}`;

      if (
        await AsyncStorage
          .getItem(
            key
          ) !==
        "true"
      ) {
        await awardPointsOnce(
          `${id}_checkpoint_${checkpoint}`,

          50
        );

        await AsyncStorage
          .setItem(
            key,
            "true"
          );
      }

      snapshot.current.lastRewardedCheckpoint =
        Math.max(
          snapshot.current
            .lastRewardedCheckpoint,

          checkpoint
        );
    }
  }

  // ==========================================================
  // START SENSOR
  // ==========================================================

  React.useEffect(
    () => {
      if (
        !ready ||
        !view.isTracking ||
        steps >=
          totalSteps ||
        busy ||
        !focused ||
        appState !==
          "active"
      ) {
        return;
      }

      let cancelled =
        false;

      let lastReading =
        null;

      let locationSubscription =
        null;

      let verificationTimer =
        null;

      let pending = [];

      let priorTicket =
        null;

      const gate =
        createWalkingGate();

      function cleanupLocation() {
        locationSubscription
          ?.remove();

        locationSubscription =
          null;

        if (
          verificationTimer
        ) {
          clearInterval(
            verificationTimer
          );
        }

        verificationTimer =
          null;

        pending = [];
      }

      function commit(
        delta
      ) {
        enqueueJourneyWork(
          async () => {
            const available =
              Math.max(
                0,

                totalSteps -
                  snapshot.current
                    .steps
              );

            if (
              !available
            ) {
              return;
            }

            const accepted =
              Math.min(
                delta,
                available
              );

            const result =
              await addRegularJourneySteps(
                accepted
              );

            if (
              result?.blocked
            ) {
              throw new Error(
                t(
                  "anotherActivity"
                )
              );
            }

            if (
              !result?.saved
            ) {
              throw new Error(
                t(
                  "stepSaveFailed"
                )
              );
            }

            const credited =
              Math.min(
                accepted,

                Math.max(
                  0,

                  Math.floor(
                    Number(
                      result.added
                    ) ||
                      0
                  )
                )
              );

            if (
              !credited
            ) {
              return;
            }

            snapshot.current.steps +=
              credited;

            if (
              snapshot.current
                .steps >=
              totalSteps
            ) {
              snapshot.current.isTracking =
                false;

              stopSensor();
            }

            publish();

            await persistNow();

            await awardReachedCheckpoints();
          }
        ).catch(
          reportSaveError
        );
      }

      async function start() {
        try {
          const permission =
            await Pedometer
              .requestPermissionsAsync();

          if (
            cancelled
          ) {
            return;
          }

          if (
            !permission.granted
          ) {
            throw new Error(
              t(
                "motionPermission"
              )
            );
          }

          const available =
            await Pedometer
              .isAvailableAsync();

          if (
            !available
          ) {
            throw new Error(
              t(
                "trackingUnavailable"
              )
            );
          }

          if (
            cancelled
          ) {
            return;
          }

          const activated =
            await enqueueJourneyWork(
              async () => {
                if (
                  cancelled
                ) {
                  return null;
                }

                return activateJourneyTracking();
              }
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !activated
              ?.saved
          ) {
            throw new Error(
              t(
                "trackingStartFailed"
              )
            );
          }

          const locationPermission =
            await Location
              .requestForegroundPermissionsAsync();

          if (
            cancelled
          ) {
            return;
          }

          if (
            !locationPermission
              .granted
          ) {
            throw new Error(
              t(
                "preciseLocation"
              )
            );
          }

          locationSubscription =
            await Location
              .watchPositionAsync(
                {
                  accuracy:
                    Location
                      .Accuracy
                      .High,

                  timeInterval:
                    1000,

                  distanceInterval:
                    0,
                },

                fix => {
                  if (
                    cancelled
                  ) {
                    return;
                  }

                  gate.update(
                    fix
                  );

                  setWalkingStatus(
                    gate.status()
                  );
                }
              );

          if (
            cancelled
          ) {
            cleanupLocation();

            return;
          }

          trackingRef.current =
            true;

          verificationTimer =
            setInterval(
              () => {
                if (
                  cancelled ||
                  !trackingRef.current ||
                  busyRef.current
                ) {
                  pending = [];

                  return;
                }

                const ticket =
                  gate.ticket();

                setWalkingStatus(
                  gate.status()
                );

                if (
                  ticket ===
                  null
                ) {
                  pending = [];

                  return;
                }

                const readyItems =
                  [];

                pending =
                  pending.filter(
                    item => {
                      if (
                        item.ticket !==
                        ticket
                      ) {
                        return false;
                      }

                      if (
                        Date.now() -
                          item.time <
                        6000
                      ) {
                        return true;
                      }

                      readyItems.push(
                        item
                      );

                      return false;
                    }
                  );

                const delta =
                  readyItems.reduce(
                    (
                      sum,
                      item
                    ) =>
                      sum +
                      item.delta,

                    0
                  );

                if (
                  delta
                ) {
                  commit(
                    delta
                  );
                }
              },

              1000
            );

          subscriptionRef.current =
            Pedometer
              .watchStepCount(
                result => {
                  if (
                    cancelled ||
                    !trackingRef.current ||
                    busyRef.current
                  ) {
                    return;
                  }

                  const reading =
                    Number(
                      result
                        ?.steps
                    );

                  if (
                    !Number.isFinite(
                      reading
                    ) ||
                    reading <
                      0
                  ) {
                    return;
                  }

                  const value =
                    Math.floor(
                      reading
                    );

                  const ticket =
                    gate.ticket();

                  const delta =
                    lastReading ===
                      null ||
                    value <
                      lastReading
                      ? 0
                      : value -
                        lastReading;

                  lastReading =
                    value;

                  if (
                    delta >
                      0 &&
                    ticket !==
                      null &&
                    priorTicket ===
                      ticket
                  ) {
                    pending.push({
                      delta,

                      ticket,

                      time:
                        Date.now(),
                    });
                  }

                  priorTicket =
                    ticket;
                }
              );

          setSensorError(
            ""
          );

          setSensorReady(
            true
          );
        } catch (
          error
        ) {
          cleanupLocation();

          if (
            !cancelled
          ) {
            stopSensor();

            snapshot.current.isTracking =
              false;

            publish();

            setSensorError(
              error.message ||
                t(
                  "trackingStartFailed"
                )
            );
          }
        }
      }

      start();

      return () => {
        cancelled =
          true;

        cleanupLocation();

        stopSensor();
      };
    },

    [
      ready,

      view?.isTracking,

      busy,

      focused,

      appState,
    ]
  );

  // ==========================================================
  // ACTIVE TIMER
  // ==========================================================

  React.useEffect(
    () => {
      if (
        !isTracking
      ) {
        return;
      }

      const timer =
        setInterval(
          () => {
            if (
              !trackingRef.current ||
              busyRef.current ||
              !snapshot.current
            ) {
              return;
            }

            snapshot.current.secondsActive +=
              1;

            publish();

            if (
              snapshot.current
                .secondsActive %
                5 ===
              0
            ) {
              save().catch(
                reportSaveError
              );
            }
          },

          1000
        );

      return () =>
        clearInterval(
          timer
        );
    },

    [
      isTracking,
    ]
  );

  // ==========================================================
  // APP STATE / NAVIGATION
  // ==========================================================

  React.useEffect(
    () => {
      const listener =
        AppState
          .addEventListener(
            "change",

            next => {
              setAppState(
                next
              );

              if (
                next !==
                "active"
              ) {
                stopSensor();

                if (
                  snapshot.current
                ) {
                  save().catch(
                    reportSaveError
                  );
                }
              }
            }
          );

      const offBlur =
        navigation
          ?.addListener
          ?.(
            "blur",

            () => {
              setFocused(
                false
              );

              stopSensor();

              if (
                snapshot.current
              ) {
                save().catch(
                  reportSaveError
                );
              }
            }
          );

      const offFocus =
        navigation
          ?.addListener
          ?.(
            "focus",

            () =>
              setFocused(
                true
              )
          );

      const offRemove =
        navigation
          ?.addListener
          ?.(
            "beforeRemove",

            event => {
              if (
                allowNavigation.current ||
                !snapshot.current
              ) {
                return;
              }

              event.preventDefault();

              if (
                busyRef.current
              ) {
                return;
              }

              runAction(
                async () => {
                  await persistNow();

                  allowNavigation.current =
                    true;

                  navigation.dispatch(
                    event.data
                      .action
                  );
                }
              );
            }
          );

      return () => {
        listener.remove();

        offBlur?.();

        offFocus?.();

        offRemove?.();
      };
    },

    [
      navigation,
    ]
  );

  // ==========================================================
  // ACTION WRAPPER
  // ==========================================================

  async function runAction(
    operation
  ) {
    if (
      !snapshot.current ||
      busyRef.current
    ) {
      return;
    }

    busyRef.current =
      true;

    setBusy(
      true
    );

    stopSensor();

    try {
      await enqueueJourneyWork(
        operation
      );
    } catch (
      error
    ) {
      reportSaveError(
        error
      );

      if (
        mounted.current
      ) {
        Alert.alert(
          t(
            "unableSave"
          ),

          error.message ||
            t(
              "tryAgain"
            )
        );
      }
    } finally {
      busyRef.current =
        false;

      if (
        mounted.current
      ) {
        publish();

        setBusy(
          false
        );
      }
    }
  }

  // ==========================================================
  // LEAVE
  // ==========================================================

  function leave() {
    allowNavigation.current =
      true;

    if (
      typeof goBack ===
      "function"
    ) {
      goBack();
    } else {
      navigation
        ?.goBack();
    }
  }

  // ==========================================================
  // SAVE AND EXIT
  // ==========================================================

  function saveAndExit() {
    if (
      !snapshot.current
    ) {
      leave();

      return;
    }

    return runAction(
      async () => {
        await persistNow();

        leave();
      }
    );
  }

  // ==========================================================
  // PAUSE / RESUME
  // ==========================================================

  function toggleTracking() {
    return runAction(
      async () => {
        snapshot.current.isTracking =
          snapshot.current
            .steps <
            totalSteps &&
          !snapshot.current
            .isTracking;

        await persistNow();
      }
    );
  }

  // ==========================================================
  // OPEN CHECKPOINT STORY
  // ==========================================================

  function openCheckpointStory(
    checkpointNumber
  ) {
    const number =
      Number(
        checkpointNumber
      );

    if (
      !snapshot.current ||
      !Number.isInteger(
        number
      ) ||
      number <
        1 ||
      number >
        5 ||
      snapshot.current
        .steps <
        Math.ceil(
          (
            totalSteps *
            (
              number -
              1
            )
          ) /
            4
        ) ||
      typeof goToStory !==
        "function"
    ) {
      return;
    }

    return runAction(
      async () => {
        const previous =
          snapshot.current
            .shownStories;

        snapshot.current.shownStories =
          [
            ...new Set([
              ...previous,
              number,
            ]),
          ];

        try {
          await persistNow();
        } catch (
          error
        ) {
          snapshot.current.shownStories =
            previous;

          throw error;
        }

        goToStory(
          number
        );
      }
    );
  }

  // ==========================================================
  // AUTO-OPEN CHECKPOINT STORY
  // ==========================================================

  React.useEffect(
    () => {
      if (
        !ready ||
        busy ||
        errorRef.current ||
        !focused ||
        appState !==
          "active" ||
        !steps ||
        typeof goToStory !==
          "function"
      ) {
        return;
      }

      const number =
        checkpointFor(
          steps,
          totalSteps
        );

      if (
        !view.shownStories.includes(
          number
        )
      ) {
        openCheckpointStory(
          number
        );
      }
    },

    [
      ready,

      busy,

      focused,

      appState,

      steps,

      view?.shownStories,

      goToStory,
    ]
  );

  // ==========================================================
  // RESET
  // ==========================================================

  function resetJourney() {
    return runAction(
      async () => {
        const prior =
          snapshot.current;

        snapshot.current = {
          ...prior,

          steps:
            0,

          secondsActive:
            0,

          hasCompleted:
            false,

          isTracking:
            false,

          shownStories:
            [],
        };

        await AsyncStorage
          .setItem(
            `journeyStats_${id}`,

            JSON.stringify({
              ...snapshot.current,

              schemaVersion:
                2,
            })
          );

        await resetJourneyProgress(
          id
        );

        await persistNow();

        Alert.alert(
          t(
            "resetComplete"
          ),

          t(
            "resetCompleteMessage"
          )
        );
      }
    );
  }

  // ==========================================================
  // DEV TEST
  // ==========================================================

  function runJourneyTest() {
    if (
      !__DEV__
    ) {
      return;
    }

    return runAction(
      async () => {
        snapshot.current.steps =
          Math.max(
            snapshot.current
              .steps,

            totalSteps -
              100
          );

        snapshot.current.isTracking =
          false;

        await persistNow();
      }
    );
  }

  // ==========================================================
  // PASSPORT
  // ==========================================================

  async function awardPassportStamp() {
    const aliases = {
      roman:
        "rome",

      rome:
        "rome",

      greatwall:
        "wall",

      wall:
        "wall",

      tubman:
        "tubman",

      harriet:
        "tubman",

      mecca:
        "mecca",

      tokyo:
        "tokyo",

      trans:
        "trans",
    };

    const stampId =
      aliases[
        id.toLowerCase()
      ] ||
      id.toLowerCase();

    const raw =
      await AsyncStorage
        .getItem(
          "passportStamps"
        );

    const stamps =
      raw
        ? JSON.parse(
            raw
          )
        : [];

    if (
      !Array.isArray(
        stamps
      )
    ) {
      throw new Error(
        t(
          "passportInvalid"
        )
      );
    }

    await AsyncStorage
      .multiSet([
        [
          "passportStamps",

          JSON.stringify([
            ...new Set([
              ...stamps,
              stampId,
            ]),
          ]),
        ],

        [
          `passport_${id.toLowerCase()}`,

          "true",
        ],
      ]);
  }

  // ==========================================================
  // COMPLETE JOURNEY
  // ==========================================================

  function completeJourney() {
    if (
      !snapshot.current ||
      snapshot.current
        .steps <
        totalSteps
    ) {
      Alert.alert(
        t(
          "notComplete"
        ),

        t(
          "reachGoal"
        )
      );

      return;
    }

    return runAction(
      async () => {
        snapshot.current.isTracking =
          false;

        await persistNow();

        await awardReachedCheckpoints();

        const flags =
          Object.fromEntries(
            await AsyncStorage
              .multiGet([
                `journeyCompleted_${id}`,

                `journeyRewarded_${id}`,
              ])
          );

        let alreadyClaimed =
          snapshot.current
            .rewardsClaimed ||
          flags[
            `journeyCompleted_${id}`
          ] ===
            "true" ||
          flags[
            `journeyRewarded_${id}`
          ] ===
            "true";

        let earnedCoins =
          0;

        let earnedPoints =
          0;

        if (
          !alreadyClaimed
        ) {
          const reward =
            await completeJourneyReward(
              id
            );

          if (
            reward
              ?.awarded
          ) {
            earnedCoins =
              nonnegative(
                reward.addedWCoins ??
                  reward.walletResult
                    ?.added ??
                  reward.reward
                    ?.wCoins
              );
          } else if (
            reward
              ?.alreadyClaimed
          ) {
            alreadyClaimed =
              true;
          } else if (
            reward
              ?.requiresSignIn
          ) {
            throw new Error(
              t(
                "signIn"
              )
            );
          } else {
            throw new Error(
              t(
                "rewardFailed"
              )
            );
          }

          // Keep internal points record in canonical title/language.
          const points =
            await addPoints({
              id:
                `journey_${id}_complete`,

              title:
                canonicalRouteTitle,

              category:
                "Journey",

              points:
                nonnegative(
                  currentJourney
                    .rewardPoints ??
                    journeyReward
                      ?.rewardPoints
                ),

              source:
                "Journey Complete",

              metadata: {
                journeyId:
                  id,
              },
            });

          earnedPoints =
            nonnegative(
              points
                ?.pointsAwarded
            );

          await AsyncStorage
            .multiSet([
              [
                `journeyCompleted_${id}`,

                "true",
              ],

              [
                `journeyRewarded_${id}`,

                "true",
              ],
            ]);
        }

        await completeJourneyProgress(
          id
        );

        await awardPassportStamp();

        snapshot.current.hasCompleted =
          true;

        snapshot.current.rewardsClaimed =
          true;

        await persistNow();

        Alert.alert(
          t(
            "completeTitle"
          ),

          alreadyClaimed
            ? t(
                "completedAgain"
              )
            : t(
                "rewardsEarned",

                {
                  coins:
                    earnedCoins
                      .toLocaleString(),

                  points:
                    earnedPoints
                      .toLocaleString(),
                }
              )
        );
      }
    );
  }

  // ==========================================================
  // SHARE
  // ==========================================================

  async function shareWalkProgress() {
    try {
      await Share.share({
        message:
          t(
            "shareMessage",

            {
              title:
                routeTitle,

              steps:
                steps
                  .toLocaleString(),

              miles:
                liveMiles
                  .toFixed(
                    2
                  ),

              checkpoints:
                completedCheckpoints,
            }
          ),
      });
    } catch (
      error
    ) {
      Alert.alert(
        t(
          "unableShare"
        ),

        error.message ||
          t(
            "tryAgain"
          )
      );
    }
  }

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (
    !ready
  ) {
    return (
      <View
        style={[
          styles.container,

          styles.content,
        ]}
      >
        <TouchableOpacity
          onPress={
            leave
          }
          style={
            styles.backButton
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹{" "}
            {t(
              "back"
            )}
          </Text>
        </TouchableOpacity>

        <Text
          style={
            styles.title
          }
        >
          {
            routeTitle
          }
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          {loadError ||
            t(
              "loading"
            )}
        </Text>
      </View>
    );
  }

  // ==========================================================
  // MAIN SCREEN
  // ==========================================================

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          onPress={
            saveAndExit
          }
          style={
            styles.backButton
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹{" "}
            {t(
              "back"
            )}
          </Text>
        </TouchableOpacity>

        <Text
          style={
            styles.kicker
          }
        >
          {t(
            "liveProgress"
          )}
        </Text>

        <Text
          style={
            styles.title
          }
        >
          {
            routeTitle
          }
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          {
            routeDescription
          }
        </Text>

        {/* ====================================================
            STATUS
        ==================================================== */}

        <View
          style={[
            styles.statusBadge,

            !isTracking &&
              styles.statusBadgePaused,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,

              !isTracking &&
                styles.statusBadgeTextPaused,
            ]}
          >
            {progress >=
            100
              ? `● ${t(
                  "goalReached"
                )}`

              : busy

              ? `● ${t(
                  "saving"
                )}`

              : view.isTracking &&
                !sensorReady &&
                focused &&
                appState ===
                  "active"

              ? `● ${t(
                  "starting"
                )}`

              : view.isTracking &&
                sensorReady &&
                focused &&
                appState ===
                  "active"

              ? `● ${translateWalkingStatus(
                  language,
                  walkingStatus
                )}`

              : `● ${t(
                  "trackingPaused"
                )}`}
          </Text>
        </View>

        <Text
          style={
            styles.autoSaveText
          }
        >
          {lastSavedAt
            ? t(
                "autoSaved",

                {
                  time:
                    lastSavedAt
                      .toLocaleTimeString(),
                }
              )
            : t(
                "autoSaveReady"
              )}
        </Text>
      </View>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {!!(
        saveError ||
        sensorError
      ) && (
        <Text
          style={[
            styles.subtitle,

            {
              color:
                "#FFC747",

              marginBottom:
                14,
            },
          ]}
          accessibilityRole="alert"
        >
          {saveError ||
            sensorError}
        </Text>
      )}

      {/* ======================================================
          LIVE STATS
      ====================================================== */}

      <View
        style={
          styles.statsGrid
        }
      >
        <StatMini
          icon="👟"
          value={
            steps
              .toLocaleString()
          }
          label={
            t(
              "steps"
            )
          }
        />

        <StatMini
          icon="📍"
          value={
            liveMiles
              .toFixed(
                2
              )
          }
          label={
            t(
              "miles"
            )
          }
        />

        <StatMini
          icon="🔥"
          value={
            liveCalories
          }
          label={
            t(
              "calories"
            )
          }
        />

        <StatMini
          icon="⏱️"
          value={
            timeActive
          }
          label={
            t(
              "time"
            )
          }
          small
        />
      </View>

      {/* ======================================================
          PROGRESS
      ====================================================== */}

      <View
        style={
          styles.progressCard
        }
      >
        <View
          style={
            styles.progressHeader
          }
        >
          <Text
            style={
              styles.progressTitle
            }
          >
            {t(
              "journeyProgress"
            )}
          </Text>

          <Text
            style={
              styles.progressPercent
            }
          >
            {progress.toFixed(
              2
            )}
            %
          </Text>
        </View>

        <View
          style={
            styles.progressBar
          }
        >
          <View
            style={[
              styles.progressFill,

              {
                width:
                  `${Math.min(
                    progress,
                    100
                  )}%`,
              },
            ]}
          />
        </View>

        <Text
          style={
            styles.progressRemaining
          }
        >
          {remainingSteps >
          0
            ? t(
                "remainingSteps",

                {
                  count:
                    remainingSteps
                      .toLocaleString(),
                }
              )
            : t(
                "goalCompleted"
              )}
        </Text>
      </View>

      {/* ======================================================
          ROUTE ART
      ====================================================== */}

      {routeImage !=
      null ? (
        <AlignedRouteArtwork
          source={
            routeImage
          }
          checkpoints={
            checkpoints
          }
          progress={
            steps /
            totalSteps
          }
          artworkPoints={
            currentJourney
              .routeArtworkPoints
          }
          language={
            language
          }
        />
      ) : (
        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryTitle
            }
          >
            {t(
              "routeUnavailable"
            )}
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {t(
              "routeUnavailableText",

              {
                title:
                  routeTitle,
              }
            )}
          </Text>
        </View>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <View
        style={
          styles.summaryCard
        }
      >
        <Text
          style={
            styles.summaryTitle
          }
        >
          {t(
            "journeySummary"
          )}
        </Text>

        <SummaryRow
          label={
            t(
              "progress"
            )
          }
          value={
            `${progress.toFixed(
              2
            )}%`
          }
        />

        <SummaryRow
          label={
            t(
              "completedCheckpoints"
            )
          }
          value={
            `${completedCheckpoints}/5`
          }
        />

        <SummaryRow
          label={
            t(
              "remainingStepsLabel"
            )
          }
          value={
            remainingSteps
              .toLocaleString()
          }
        />

        <SummaryRow
          label={
            t(
              "trackingStatus"
            )
          }
          value={
            progress >=
            100
              ? t(
                  "goalReached"
                )
              : isTracking
              ? t(
                  "active"
                )
              : t(
                  "paused"
                )
          }
        />
      </View>

      {/* ======================================================
          REWARDS
      ====================================================== */}

      <View
        style={
          styles.rewardsCard
        }
      >
        <Text
          style={
            styles.rewardsTitle
          }
        >
          {t(
            "journeyRewards"
          )}
        </Text>

        <SummaryRow
          label={
            t(
              "rewardPoints"
            )
          }
          value={
            Number(
              journeyReward
                ?.rewardPoints ||
                currentJourney
                  ?.rewardPoints ||
                0
            ).toLocaleString()
          }
          reward
        />

        <SummaryRow
          label={
            t(
              "wcoins"
            )
          }
          value={
            Number(
              journeyReward
                ?.wCoins ||
                currentJourney
                  ?.wCoins ||
                0
            ).toLocaleString()
          }
          reward
        />

        <SummaryRow
          label={
            t(
              "passportStamp"
            )
          }
          value={
            hasCompleted
              ? `✓ ${t(
                  "unlocked"
                )}`
              : t(
                  "unlocksCompletion"
                )
          }
          reward
        />

        <SummaryRow
          label={
            t(
              "certificate"
            )
          }
          value={
            hasCompleted
              ? `✓ ${t(
                  "earned"
                )}`
              : t(
                  "earnedCompletion"
                )
          }
          reward
        />
      </View>

      {/* ======================================================
          CHECKPOINTS
      ====================================================== */}

      <View
        style={
          styles.historyCard
        }
      >
        <Text
          style={
            styles.historyTitle
          }
        >
          {t(
            "journeyCheckpoints"
          )}
        </Text>

        {checkpoints.map(
          point => (
            <TouchableOpacity
              key={
                point.id
              }
              style={
                styles.historyRow
              }
              disabled={
                !point.complete &&
                !point.active
              }
              onPress={() => {
                if (
                  point.complete ||
                  point.active
                ) {
                  openCheckpointStory(
                    point.id
                  );
                }
              }}
            >
              <Text
                style={
                  styles.historyIcon
                }
              >
                {point.complete
                  ? "✅"
                  : point.active
                  ? "🟡"
                  : "○"}
              </Text>

              <Text
                style={
                  styles.historyText
                }
              >
                {point.id}.{" "}
                {
                  point.title
                }
              </Text>

              {point.complete && (
                <Text
                  style={
                    styles.reachedText
                  }
                >
                  {t(
                    "reached"
                  )}
                </Text>
              )}
            </TouchableOpacity>
          )
        )}
      </View>

      {/* ======================================================
          DEV TEST
      ====================================================== */}

      {__DEV__ && (
        <TouchableOpacity
          style={
            styles.testButton
          }
          onPress={
            runJourneyTest
          }
        >
          <Text
            style={
              styles.testButtonText
            }
          >
            {t(
              "devJump"
            )}
          </Text>
        </TouchableOpacity>
      )}

      {/* ======================================================
          COMPLETE JOURNEY
      ====================================================== */}

      {progress >=
        100 &&
        !hasCompleted && (
        <TouchableOpacity
          style={
            styles.completeButton
          }
          onPress={
            completeJourney
          }
        >
          <Text
            style={
              styles.completeButtonText
            }
          >
            {t(
              "claimRewards"
            )}
          </Text>
        </TouchableOpacity>
      )}

      {hasCompleted && (
        <View
          style={
            styles.completedBanner
          }
        >
          <Text
            style={
              styles.completedBannerText
            }
          >
            {t(
              "journeyCompleted"
            )}
          </Text>
        </View>
      )}

      {/* ======================================================
          TRACKING BUTTONS
      ====================================================== */}

      <View
        style={
          styles.actionRow
        }
      >
        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={
            toggleTracking
          }
        >
          <Text
            style={
              styles.secondaryText
            }
          >
            {view.isTracking
              ? t(
                  "pauseTracking"
                )
              : t(
                  "resumeTracking"
                )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={
            saveAndExit
          }
        >
          <Text
            style={
              styles.secondaryText
            }
          >
            {t(
              "saveExit"
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ======================================================
          SHARE
      ====================================================== */}

      <TouchableOpacity
        style={
          styles.shareWalkButton
        }
        onPress={
          shareWalkProgress
        }
      >
        <Text
          style={
            styles.shareWalkText
          }
        >
          {t(
            "share"
          )}
        </Text>
      </TouchableOpacity>

      {/* ======================================================
          RESET
      ====================================================== */}

      <TouchableOpacity
        style={
          styles.resetButton
        }
        onPress={() => {
          Alert.alert(
            t(
              "resetQuestion"
            ),

            t(
              "resetWarning"
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
                  resetJourney,
              },
            ]
          );
        }}
      >
        <Text
          style={
            styles.resetButtonText
          }
        >
          {t(
            "resetJourney"
          )}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ============================================================
// DEFAULT ROUTE ARTWORK POINTS
// ============================================================

const DEFAULT_ARTWORK_POINTS = [
  {
    x:
      0.13,

    y:
      0.83,
  },

  {
    x:
      0.32,

    y:
      0.83,
  },

  {
    x:
      0.5,

    y:
      0.83,
  },

  {
    x:
      0.68,

    y:
      0.83,
  },

  {
    x:
      0.87,

    y:
      0.83,
  },
];

// ============================================================
// ROUTE ARTWORK
// ============================================================

function AlignedRouteArtwork({
  source,

  checkpoints,

  progress,

  artworkPoints,

  language = "en",
}) {
  const resolved =
    Image.resolveAssetSource(
      source
    );

  const knownRatio =
    resolved?.width >
      0 &&
    resolved?.height >
      0
      ? resolved.width /
        resolved.height
      : null;

  const uri =
    resolved?.uri;

  const [
    remoteSize,
    setRemoteSize,
  ] =
    React.useState(
      null
    );

  const [
    width,
    setWidth,
  ] =
    React.useState(
      0
    );

  const aspectRatio =
    knownRatio ||
    (
      remoteSize?.uri ===
      uri
        ? remoteSize.ratio
        : null
    ) ||
    1.5;

  React.useEffect(
    () => {
      let cancelled =
        false;

      if (
        !knownRatio &&
        uri
      ) {
        Image.getSize(
          uri,

          (
            imageWidth,
            imageHeight
          ) => {
            if (
              !cancelled &&
              imageWidth >
                0 &&
              imageHeight >
                0
            ) {
              setRemoteSize({
                uri,

                ratio:
                  imageWidth /
                  imageHeight,
              });
            }
          },

          () => {}
        );
      }

      return () => {
        cancelled =
          true;
      };
    },

    [
      uri,
      knownRatio,
    ]
  );

  const validPoints =
    Array.isArray(
      artworkPoints
    ) &&
    artworkPoints.length ===
      5 &&
    artworkPoints.every(
      point =>
        Number.isFinite(
          point?.x
        ) &&
        Number.isFinite(
          point?.y
        ) &&
        point.x >=
          0 &&
        point.x <=
          1 &&
        point.y >=
          0 &&
        point.y <=
          1
    );

  const points =
    validPoints
      ? artworkPoints
      : DEFAULT_ARTWORK_POINTS;

  const fraction =
    Math.max(
      0,

      Math.min(
        1,

        Number(
          progress
        ) ||
          0
      )
    );

  const segment =
    Math.min(
      3,

      Math.floor(
        fraction *
          4
      )
    );

  const progressWithinSegment =
    fraction *
      4 -
    segment;

  const from =
    points[
      segment
    ];

  const to =
    points[
      segment +
      1
    ];

  const shoe = {
    x:
      from.x +
      (
        to.x -
        from.x
      ) *
        progressWithinSegment,

    y:
      from.y +
      (
        to.y -
        from.y
      ) *
        progressWithinSegment,
  };

  const height =
    width /
    aspectRatio;

  const markerSize =
    Math.max(
      18,

      Math.min(
        34,

        width *
          0.055
      )
    );

  const shoeSize =
    markerSize *
    0.9;

  return (
    <View
      style={[
        styles.routeCard,

        {
          aspectRatio,
        },
      ]}
      onLayout={
        event =>
          setWidth(
            event.nativeEvent
              .layout.width
          )
      }
    >
      <Image
        source={
          source
        }
        resizeMode="contain"
        accessibilityLabel={
          getText(
            language,
            "routeAccessibility"
          )
        }
        style={{
          position:
            "absolute",

          top:
            0,

          left:
            0,

          width:
            "100%",

          height:
            "100%",
        }}
      />

      {width >
        0 && (
        <View
          pointerEvents="none"
          style={{
            position:
              "absolute",

            top:
              0,

            left:
              0,

            width:
              "100%",

            height:
              "100%",
          }}
        >
          {checkpoints.map(
            (
              point,
              index
            ) => (
              <View
                key={
                  point.id
                }
                accessible
                accessibilityLabel={
                  `${getText(
                    language,
                    "checkpoint",

                    {
                      count:
                        point.id,
                    }
                  )}: ${point.title}`
                }
                style={[
                  styles.checkCircle,

                  point.complete &&
                    styles.checkCircleComplete,

                  point.active &&
                    styles.checkCircleCurrent,

                  {
                    position:
                      "absolute",

                    left:
                      points[
                        index
                      ].x *
                        width -
                      markerSize /
                        2,

                    top:
                      points[
                        index
                      ].y *
                        height -
                      markerSize /
                        2,

                    width:
                      markerSize,

                    height:
                      markerSize,

                    borderRadius:
                      markerSize /
                      2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.checkNumber,

                    {
                      fontSize:
                        markerSize *
                        0.46,
                    },
                  ]}
                  allowFontScaling={
                    false
                  }
                >
                  {point.id ===
                  5
                    ? "🏁"
                    : point.id}
                </Text>
              </View>
            )
          )}

          <Image
            source={
              SHOE_ICON
            }
            resizeMode="contain"
            style={{
              position:
                "absolute",

              width:
                shoeSize,

              height:
                shoeSize,

              left:
                shoe.x *
                  width -
                shoeSize /
                  2,

              top:
                shoe.y *
                  height -
                markerSize /
                  2 -
                shoeSize -
                2,
            }}
          />
        </View>
      )}
    </View>
  );
}

// ============================================================
// MINI STAT
// ============================================================

function StatMini({
  icon,

  value,

  label,

  small,
}) {
  return (
    <View
      style={
        styles.statBox
      }
    >
      <Text
        style={
          styles.statIcon
        }
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.statValue,

          small &&
            styles.statValueSmall,
        ]}
      >
        {value}
      </Text>

      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

// ============================================================
// SUMMARY ROW
// ============================================================

function SummaryRow({
  label,

  value,

  reward = false,
}) {
  return (
    <View
      style={
        styles.summaryRow
      }
    >
      <Text
        style={
          reward
            ? styles.rewardLabel
            : styles.summaryLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          reward
            ? styles.rewardValue
            : styles.summaryValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    container: {
      flex:
        1,

      backgroundColor:
        "#07111F",
    },

    content: {
      padding:
        18,

      paddingBottom:
        60,
    },

    header: {
      marginBottom:
        18,
    },

    backButton: {
      alignSelf:
        "flex-start",

      marginBottom:
        12,

      paddingVertical:
        6,

      paddingRight:
        18,
    },

    backText: {
      color:
        "#D4AF37",

      fontSize:
        17,

      fontWeight:
        "900",
    },

    kicker: {
      color:
        "#8BE7FF",

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        1.5,

      marginBottom:
        6,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        30,

      fontWeight:
        "900",

      marginBottom:
        8,
    },

    subtitle: {
      color:
        "#C8D6EA",

      fontSize:
        14,

      lineHeight:
        21,
    },

    statusBadge: {
      alignSelf:
        "flex-start",

      backgroundColor:
        "rgba(182,255,216,0.12)",

      borderColor:
        "rgba(182,255,216,0.35)",

      borderWidth:
        1,

      paddingHorizontal:
        12,

      paddingVertical:
        7,

      borderRadius:
        999,

      marginTop:
        12,
    },

    statusBadgePaused: {
      backgroundColor:
        "rgba(255,199,71,0.12)",

      borderColor:
        "rgba(255,199,71,0.40)",
    },

    statusBadgeText: {
      color:
        "#B6FFD8",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    statusBadgeTextPaused: {
      color:
        "#FFC747",
    },

    autoSaveText: {
      color:
        "#9FB0C7",

      fontSize:
        12,

      fontWeight:
        "700",

      marginTop:
        8,
    },

    statsGrid: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginBottom:
        16,
    },

    statBox: {
      width:
        "23%",

      minHeight:
        100,

      backgroundColor:
        "#101C2E",

      borderRadius:
        18,

      paddingVertical:
        12,

      paddingHorizontal:
        4,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.25)",
    },

    statIcon: {
      fontSize:
        20,

      marginBottom:
        4,
    },

    statValue: {
      color:
        "#B6FFD8",

      fontSize:
        18,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    statValueSmall: {
      fontSize:
        12,
    },

    statLabel: {
      color:
        "#9FB0C7",

      fontSize:
        11,

      fontWeight:
        "700",

      marginTop:
        3,

      textAlign:
        "center",
    },

    progressCard: {
      backgroundColor:
        "#111C2D",

      borderRadius:
        20,

      padding:
        18,

      marginBottom:
        18,

      borderWidth:
        1,

      borderColor:
        "#2A3B52",
    },

    progressHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom:
        14,
    },

    progressTitle: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "900",
    },

    progressPercent: {
      color:
        "#A6FFD2",

      fontSize:
        22,

      fontWeight:
        "900",
    },

    progressBar: {
      width:
        "100%",

      height:
        12,

      backgroundColor:
        "#1B2B43",

      borderRadius:
        999,

      overflow:
        "hidden",
    },

    progressFill: {
      height:
        "100%",

      backgroundColor:
        "#78E8C5",

      borderRadius:
        999,
    },

    progressRemaining: {
      marginTop:
        12,

      color:
        "#DDE6F3",

      fontSize:
        14,

      fontWeight:
        "800",
    },

    routeCard: {
      width:
        "100%",

      borderRadius:
        18,

      overflow:
        "hidden",

      marginBottom:
        18,

      backgroundColor:
        "#0E1A2B",
    },

    checkCircle: {
      width:
        38,

      height:
        38,

      borderRadius:
        19,

      backgroundColor:
        "#24324A",

      borderWidth:
        2,

      borderColor:
        "#7D8AA3",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    checkCircleComplete: {
      backgroundColor:
        "#1F8F55",

      borderColor:
        "#B6FFD8",
    },

    checkCircleCurrent: {
      backgroundColor:
        "#D4AF37",

      borderColor:
        "#FFFFFF",
    },

    checkNumber: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "900",
    },

    summaryCard: {
      backgroundColor:
        "#101C2E",

      borderRadius:
        24,

      padding:
        18,

      marginBottom:
        16,

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.25)",
    },

    summaryTitle: {
      color:
        "#FFFFFF",

      fontSize:
        20,

      fontWeight:
        "900",

      marginBottom:
        12,
    },

    summaryRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingVertical:
        9,

      gap:
        12,
    },

    summaryLabel: {
      flex:
        1,

      color:
        "#9FB0C7",

      fontSize:
        14,

      fontWeight:
        "700",
    },

    summaryValue: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "900",

      textAlign:
        "right",
    },

    rewardsCard: {
      backgroundColor:
        "#101C2E",

      borderRadius:
        24,

      padding:
        18,

      marginBottom:
        16,

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.25)",
    },

    rewardsTitle: {
      color:
        "#D4AF37",

      fontSize:
        20,

      fontWeight:
        "900",

      marginBottom:
        12,
    },

    rewardLabel: {
      flex:
        1,

      color:
        "#9FB0C7",

      fontSize:
        14,

      fontWeight:
        "700",
    },

    rewardValue: {
      color:
        "#B6FFD8",

      fontSize:
        14,

      fontWeight:
        "900",

      textAlign:
        "right",
    },

    historyCard: {
      backgroundColor:
        "#101C2E",

      borderRadius:
        24,

      padding:
        18,

      borderWidth:
        1,

      borderColor:
        "rgba(212,175,55,0.25)",

      marginBottom:
        16,
    },

    historyTitle: {
      color:
        "#FFFFFF",

      fontSize:
        20,

      fontWeight:
        "900",

      marginBottom:
        14,
    },

    historyRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      minHeight:
        50,

      paddingVertical:
        10,

      borderBottomWidth:
        1,

      borderBottomColor:
        "rgba(255,255,255,0.08)",
    },

    historyIcon: {
      width:
        30,

      fontSize:
        17,
    },

    historyText: {
      flex:
        1,

      color:
        "#DDE8F8",

      fontSize:
        14,

      fontWeight:
        "700",
    },

    reachedText: {
      color:
        "#B6FFD8",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    testButton: {
      backgroundColor:
        "#24344D",

      paddingVertical:
        16,

      borderRadius:
        18,

      alignItems:
        "center",

      marginBottom:
        14,

      borderWidth:
        1,

      borderColor:
        "#435B7A",
    },

    testButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "900",
    },

    completeButton: {
      backgroundColor:
        "#D4AF37",

      paddingVertical:
        17,

      paddingHorizontal:
        18,

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        14,
    },

    completeButtonText: {
      color:
        "#07111F",

      fontSize:
        16,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    completedBanner: {
      backgroundColor:
        "rgba(182,255,216,0.14)",

      borderWidth:
        1,

      borderColor:
        "rgba(182,255,216,0.45)",

      borderRadius:
        20,

      paddingVertical:
        16,

      paddingHorizontal:
        18,

      alignItems:
        "center",

      marginBottom:
        14,
    },

    completedBannerText: {
      color:
        "#B6FFD8",

      fontSize:
        17,

      fontWeight:
        "900",
    },

    actionRow: {
      flexDirection:
        "row",

      gap:
        12,

      marginBottom:
        14,
    },

    secondaryButton: {
      flex:
        1,

      backgroundColor:
        "#16253A",

      paddingVertical:
        14,

      paddingHorizontal:
        8,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        1,

      borderColor:
        "#2A405D",
    },

    secondaryText: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "800",

      textAlign:
        "center",
    },

    shareWalkButton: {
      backgroundColor:
        "#D8A72E",

      borderRadius:
        999,

      paddingVertical:
        15,

      paddingHorizontal:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        14,
    },

    shareWalkText: {
      color:
        "#05070C",

      fontSize:
        16,

      fontWeight:
        "900",
    },

    resetButton: {
      backgroundColor:
        "#3A1620",

      paddingVertical:
        15,

      paddingHorizontal:
        18,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        12,

      borderWidth:
        1,

      borderColor:
        "rgba(255,182,193,0.25)",
    },

    resetButtonText: {
      color:
        "#FFB6C1",

      fontSize:
        15,

      fontWeight:
        "900",
    },
  });