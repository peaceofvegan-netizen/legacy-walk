
// screens/MarathonScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Pedometer } from "expo-sensors";

import MARATHON_CATALOG, {
  MARATHON_TOTAL_STEPS,
  STEPS_PER_MILE,
} from "../data/marathonCatalog";

import {
  getActiveMarathon,
  loadMarathonProgressMap,
} from "../utils/marathonStorage";

import {
  loadLegathonSession,
  startLegathon,
  resumeLegathon,
  pauseLegathon,
  exitLegathon,
  completeLegathonSession,
} from "../utils/legathonSession";

import {
  getCurrentStepOwner,
  syncTodaySteps,
} from "../utils/stepTrackingEngine";

// ============================================================
// LEGATHON WALK — WORLD LEGATHONS
//
// 26 global 26.2-mile walking challenges
//
// Preserves existing:
// - Marathon IDs used internally
// - Marathon storage utilities
// - Legathon session utilities
// - Step ownership and routing
// - Earned rewards and saved progress
//
// Upgrades:
// - Visible Legathon branding
// - Official WCoin image
// - Aligned statistic cards
// - Faster initial screen presentation
// - Ten-language user interface
// - Existing activation and pause/resume behavior
// ============================================================

const GOLD = "#F7BE22";

const COLORS = {
  background: "#02060D",
  card: "#0B1422",
  cardAlt: "#111D2E",
  border: "#283447",
  gold: GOLD,
  white: "#FFFFFF",
  muted: "#A7B2C5",
  green: "#75D5A5",
  red: "#FFD0D0",
};

const WCOIN_IMAGE = require("../assets/wcoin.png");

// Five seconds reduces repeated storage and sensor work.
// The manual Sync Walking Progress button remains available.
const SYNC_INTERVAL_MS = 5000;

function safeNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

function formatNumber(value, language = "en") {
  const number = Math.floor(safeNumber(value));

  try {
    return number.toLocaleString(language);
  } catch {
    return number.toLocaleString();
  }
}

const STEPS_IN_ONE_MILE =
  safeNumber(STEPS_PER_MILE) || 2000;

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    loading: "Loading your Legathons…",
    worldLegathons: "World Legathons",
    intro:
      "26 global walking challenges. One stronger you.",

    modeActive: "Legathon Mode Active",
    modePaused: "Legathon Paused",
    modeReady: "Legathon Mode Ready",

    activeMessage:
      "New walking steps count toward {title}.",
    pausedMessage:
      "Your progress is saved. Resume when you are ready.",
    readyMessage:
      "Choose an unlocked Legathon to begin.",

    activeLegathon: "ACTIVE LEGATHON",
    pausedLegathon: "PAUSED LEGATHON",
    nextLegathon: "NEXT LEGATHON",

    complete: "COMPLETE",
    steps: "Steps",
    miles: "Miles",
    remaining: "Remaining",

    completionRewards: "LEGATHON COMPLETION REWARDS",
    legathonPoints: "Legathon Points",
    avatarXP: "Avatar XP",

    continueLegathon: "Continue Legathon",
    resumeLegathon: "Resume Legathon",
    activateLegathon: "Activate Legathon",

    syncProgress: "Sync Walking Progress",
    pauseLegathon: "Pause Legathon",
    returnJourney: "Return to Journey Mode",

    lastSynced: "Last synced {time}",

    allComplete: "All 26 Legathons Complete!",
    noChallenge: "No Legathon available",
    savedChallenges:
      "Your saved Legathons are listed below.",

    completed: "Completed",
    unlocked: "Unlocked",
    wcoinsClaimed: "WCoins Claimed",

    totalPointsClaimed:
      "TOTAL LEGATHON POINTS CLAIMED",

    globalChallenges:
      "Global Legathon Challenges",

    challengeIntro:
      "Complete each unlocked Legathon to advance through the 26-challenge world series.",

    view: "View",
    locked: "Locked",
    continue: "Continue",
    resume: "Resume",
    start: "Start",

    rewardsClaimed: "Rewards claimed",

    howItWorks: "How Legathon Mode Works",

    how1:
      "Activation starts a new step checkpoint. Keep your phone with you while walking.",

    how2:
      "While active, new steps go to your Legathon. Pausing returns step routing to Journey mode and saves your Legathon progress.",

    how3:
      "Your progress synchronizes while this screen is open and when the app returns to the foreground.",

    retrySync: "Retry Sync",

    completeAlert: "Legathon Complete!",
    completeAlertMessage:
      "{title} is complete. Open its details to review your rewards.",

    completeSaved:
      "This Legathon is complete. Your progress is saved.",

    previousRequired:
      "Complete the previous Legathon to unlock this challenge.",

    couldNotFinish:
      "Could not finish the Legathon session.",

    couldNotRead:
      "Could not read the walking session.",

    couldNotSave:
      "Walking progress could not be saved. Please try again.",

    couldNotActivate:
      "The Legathon could not be activated.",

    ownerMismatch:
      "The session started, but step routing did not switch to the Legathon. Check your session and step-engine files.",

    couldNotUpdate:
      "The Legathon session could not be updated.",

    iphoneOnly:
      "This step engine currently supports iPhone. Android needs a compatible step-count source.",

    permission:
      "Enable Motion & Fitness access for Legathon Walk in iPhone Settings, then try again.",

    unavailable:
      "The pedometer is unavailable. Try this on a physical iPhone.",

    accessibilityWcoin: "WCoin",

    progress: "Progress",
    challengeNumber: "LEGATHON {number} OF {total}",
  },

  es: {
    back: "‹ Atrás",
    loading: "Cargando tus Legathons…",
    worldLegathons: "Legathons Mundiales",
    intro:
      "26 desafíos mundiales de caminata. Una versión más fuerte de ti.",

    modeActive: "Modo Legathon activo",
    modePaused: "Legathon en pausa",
    modeReady: "Modo Legathon listo",

    activeMessage:
      "Los nuevos pasos cuentan para {title}.",
    pausedMessage:
      "Tu progreso está guardado. Continúa cuando estés listo.",
    readyMessage:
      "Elige un Legathon desbloqueado para comenzar.",

    activeLegathon: "LEGATHON ACTIVO",
    pausedLegathon: "LEGATHON EN PAUSA",
    nextLegathon: "PRÓXIMO LEGATHON",

    complete: "COMPLETADO",
    steps: "Pasos",
    miles: "Millas",
    remaining: "Restantes",

    completionRewards: "RECOMPENSAS DEL LEGATHON",
    legathonPoints: "Puntos Legathon",
    avatarXP: "XP del avatar",

    continueLegathon: "Continuar Legathon",
    resumeLegathon: "Reanudar Legathon",
    activateLegathon: "Activar Legathon",

    syncProgress: "Sincronizar progreso",
    pauseLegathon: "Pausar Legathon",
    returnJourney: "Volver al modo Journey",

    lastSynced: "Última sincronización: {time}",

    allComplete: "¡Los 26 Legathons completados!",
    noChallenge: "No hay Legathon disponible",
    savedChallenges:
      "Tus Legathons guardados aparecen abajo.",

    completed: "Completados",
    unlocked: "Desbloqueados",
    wcoinsClaimed: "WCoins reclamados",

    totalPointsClaimed:
      "TOTAL DE PUNTOS LEGATHON RECLAMADOS",

    globalChallenges: "Desafíos Legathon Globales",
    challengeIntro:
      "Completa cada Legathon desbloqueado para avanzar por la serie mundial de 26 desafíos.",

    view: "Ver",
    locked: "Bloqueado",
    continue: "Continuar",
    resume: "Reanudar",
    start: "Comenzar",

    rewardsClaimed: "Recompensas reclamadas",

    howItWorks: "Cómo funciona el modo Legathon",

    how1:
      "La activación inicia un nuevo punto de control de pasos. Lleva tu teléfono mientras caminas.",

    how2:
      "Mientras esté activo, los nuevos pasos cuentan para tu Legathon. Al pausar, los pasos vuelven al modo Journey y se guarda el progreso.",

    how3:
      "El progreso se sincroniza mientras esta pantalla está abierta y cuando la aplicación vuelve al primer plano.",

    retrySync: "Reintentar sincronización",

    completeAlert: "¡Legathon completado!",
    completeAlertMessage:
      "{title} está completado. Abre los detalles para revisar tus recompensas.",

    completeSaved:
      "Este Legathon está completado. Tu progreso está guardado.",

    previousRequired:
      "Completa el Legathon anterior para desbloquear este desafío.",

    couldNotFinish:
      "No se pudo finalizar la sesión Legathon.",

    couldNotRead:
      "No se pudo leer la sesión de caminata.",

    couldNotSave:
      "No se pudo guardar el progreso. Inténtalo de nuevo.",

    couldNotActivate:
      "No se pudo activar el Legathon.",

    ownerMismatch:
      "La sesión comenzó, pero los pasos no se asignaron al Legathon. Comprueba los archivos de sesión y motor.",

    couldNotUpdate:
      "No se pudo actualizar la sesión Legathon.",

    iphoneOnly:
      "Este sistema funciona actualmente con iPhone. Android necesita una fuente compatible de pasos.",

    permission:
      "Activa Movimiento y Fitness para Legathon Walk en los ajustes del iPhone.",

    unavailable:
      "El podómetro no está disponible. Prueba en un iPhone físico.",

    accessibilityWcoin: "WCoin",
    progress: "Progreso",
    challengeNumber: "LEGATHON {number} DE {total}",
  },

  fr: {
    back: "‹ Retour",
    loading: "Chargement de vos Legathons…",
    worldLegathons: "Legathons Mondiaux",
    intro:
      "26 défis de marche mondiaux. Un vous plus fort.",

    modeActive: "Mode Legathon actif",
    modePaused: "Legathon en pause",
    modeReady: "Mode Legathon prêt",

    activeMessage:
      "Vos nouveaux pas comptent pour {title}.",
    pausedMessage:
      "Votre progression est enregistrée. Reprenez quand vous êtes prêt.",
    readyMessage:
      "Choisissez un Legathon déverrouillé.",

    activeLegathon: "LEGATHON ACTIF",
    pausedLegathon: "LEGATHON EN PAUSE",
    nextLegathon: "PROCHAIN LEGATHON",

    complete: "TERMINÉ",
    steps: "Pas",
    miles: "Miles",
    remaining: "Restants",

    completionRewards: "RÉCOMPENSES LEGATHON",
    legathonPoints: "Points Legathon",
    avatarXP: "XP Avatar",

    continueLegathon: "Continuer le Legathon",
    resumeLegathon: "Reprendre le Legathon",
    activateLegathon: "Activer le Legathon",

    syncProgress: "Synchroniser la progression",
    pauseLegathon: "Mettre le Legathon en pause",
    returnJourney: "Retour au mode Journey",

    lastSynced: "Dernière synchronisation : {time}",

    allComplete: "Les 26 Legathons sont terminés !",
    noChallenge: "Aucun Legathon disponible",
    savedChallenges:
      "Vos Legathons enregistrés apparaissent ci-dessous.",

    completed: "Terminés",
    unlocked: "Déverrouillés",
    wcoinsClaimed: "WCoins réclamés",

    totalPointsClaimed:
      "TOTAL DES POINTS LEGATHON RÉCLAMÉS",

    globalChallenges: "Défis Legathon Mondiaux",
    challengeIntro:
      "Terminez chaque Legathon déverrouillé pour avancer dans la série mondiale de 26 défis.",

    view: "Voir",
    locked: "Verrouillé",
    continue: "Continuer",
    resume: "Reprendre",
    start: "Commencer",

    rewardsClaimed: "Récompenses réclamées",

    howItWorks: "Fonctionnement du mode Legathon",

    how1:
      "L'activation démarre un nouveau point de contrôle des pas. Gardez votre téléphone pendant la marche.",

    how2:
      "En mode actif, les nouveaux pas vont au Legathon. La pause renvoie les pas au mode Journey et conserve votre progression.",

    how3:
      "La progression est synchronisée lorsque cet écran est ouvert et lorsque l'application revient au premier plan.",

    retrySync: "Réessayer la synchronisation",

    completeAlert: "Legathon terminé !",
    completeAlertMessage:
      "{title} est terminé. Ouvrez ses détails pour consulter vos récompenses.",

    completeSaved:
      "Ce Legathon est terminé. Votre progression est enregistrée.",

    previousRequired:
      "Terminez le Legathon précédent pour déverrouiller ce défi.",

    couldNotFinish:
      "Impossible de terminer la session Legathon.",

    couldNotRead:
      "Impossible de lire la session de marche.",

    couldNotSave:
      "La progression n'a pas pu être enregistrée. Réessayez.",

    couldNotActivate:
      "Le Legathon n'a pas pu être activé.",

    ownerMismatch:
      "La session a démarré, mais les pas ne sont pas attribués au Legathon. Vérifiez les fichiers de session et du moteur.",

    couldNotUpdate:
      "Impossible de mettre à jour la session Legathon.",

    iphoneOnly:
      "Ce système prend actuellement en charge l'iPhone. Android nécessite une source de pas compatible.",

    permission:
      "Activez Mouvement et forme pour Legathon Walk dans les réglages de l'iPhone.",

    unavailable:
      "Le podomètre n'est pas disponible. Essayez sur un iPhone physique.",

    accessibilityWcoin: "WCoin",
    progress: "Progression",
    challengeNumber: "LEGATHON {number} SUR {total}",
  },

  de: {
    back: "‹ Zurück",
    loading: "Deine Legathons werden geladen…",
    worldLegathons: "Welt-Legathons",
    intro:
      "26 globale Walking-Challenges. Ein stärkeres Ich.",

    modeActive: "Legathon-Modus aktiv",
    modePaused: "Legathon pausiert",
    modeReady: "Legathon-Modus bereit",

    activeMessage:
      "Neue Schritte zählen für {title}.",
    pausedMessage:
      "Dein Fortschritt ist gespeichert. Setze fort, wenn du bereit bist.",
    readyMessage:
      "Wähle einen freigeschalteten Legathon.",

    activeLegathon: "AKTIVER LEGATHON",
    pausedLegathon: "PAUSIERTER LEGATHON",
    nextLegathon: "NÄCHSTER LEGATHON",

    complete: "ABGESCHLOSSEN",
    steps: "Schritte",
    miles: "Meilen",
    remaining: "Verbleibend",

    completionRewards: "LEGATHON-ABSCHLUSSBELOHNUNGEN",
    legathonPoints: "Legathon-Punkte",
    avatarXP: "Avatar-XP",

    continueLegathon: "Legathon fortsetzen",
    resumeLegathon: "Legathon fortsetzen",
    activateLegathon: "Legathon aktivieren",

    syncProgress: "Fortschritt synchronisieren",
    pauseLegathon: "Legathon pausieren",
    returnJourney: "Zum Journey-Modus zurück",

    lastSynced: "Zuletzt synchronisiert: {time}",

    allComplete: "Alle 26 Legathons abgeschlossen!",
    noChallenge: "Kein Legathon verfügbar",
    savedChallenges:
      "Deine gespeicherten Legathons stehen unten.",

    completed: "Abgeschlossen",
    unlocked: "Freigeschaltet",
    wcoinsClaimed: "WCoins erhalten",

    totalPointsClaimed: "LEGATHON-PUNKTE GESAMT",

    globalChallenges: "Globale Legathon-Challenges",
    challengeIntro:
      "Schließe jeden freigeschalteten Legathon ab und meistere die weltweite Serie.",

    view: "Ansehen",
    locked: "Gesperrt",
    continue: "Fortsetzen",
    resume: "Fortsetzen",
    start: "Start",

    rewardsClaimed: "Belohnungen erhalten",

    howItWorks: "So funktioniert der Legathon-Modus",

    how1:
      "Die Aktivierung startet einen neuen Schritt-Checkpoint. Nimm dein Telefon beim Gehen mit.",

    how2:
      "Im aktiven Modus gehen neue Schritte an den Legathon. Beim Pausieren werden sie wieder dem Journey-Modus zugeordnet und dein Fortschritt bleibt gespeichert.",

    how3:
      "Der Fortschritt wird bei geöffnetem Bildschirm und beim Zurückkehren zur App synchronisiert.",

    retrySync: "Synchronisierung wiederholen",

    completeAlert: "Legathon abgeschlossen!",
    completeAlertMessage:
      "{title} ist abgeschlossen. Öffne die Details für deine Belohnungen.",

    completeSaved:
      "Dieser Legathon ist abgeschlossen. Dein Fortschritt ist gespeichert.",

    previousRequired:
      "Schließe den vorherigen Legathon ab, um diese Challenge freizuschalten.",

    couldNotFinish:
      "Die Legathon-Sitzung konnte nicht beendet werden.",

    couldNotRead:
      "Die Walking-Sitzung konnte nicht gelesen werden.",

    couldNotSave:
      "Der Fortschritt konnte nicht gespeichert werden. Bitte erneut versuchen.",

    couldNotActivate:
      "Der Legathon konnte nicht aktiviert werden.",

    ownerMismatch:
      "Die Sitzung wurde gestartet, aber die Schrittzuordnung stimmt nicht. Prüfe die Sitzungs- und Engine-Dateien.",

    couldNotUpdate:
      "Die Legathon-Sitzung konnte nicht aktualisiert werden.",

    iphoneOnly:
      "Dieses System unterstützt derzeit iPhone. Android benötigt eine kompatible Schrittquelle.",

    permission:
      "Aktiviere Bewegung & Fitness für Legathon Walk in den iPhone-Einstellungen.",

    unavailable:
      "Der Schrittzähler ist nicht verfügbar. Verwende ein physisches iPhone.",

    accessibilityWcoin: "WCoin",
    progress: "Fortschritt",
    challengeNumber: "LEGATHON {number} VON {total}",
  },

  pt: {
    back: "‹ Voltar",
    loading: "Carregando seus Legathons…",
    worldLegathons: "Legathons Mundiais",
    intro:
      "26 desafios globais de caminhada. Você mais forte.",

    modeActive: "Modo Legathon ativo",
    modePaused: "Legathon pausado",
    modeReady: "Modo Legathon pronto",

    activeMessage:
      "Novos passos contam para {title}.",
    pausedMessage:
      "Seu progresso está salvo. Continue quando estiver pronto.",
    readyMessage:
      "Escolha um Legathon desbloqueado.",

    activeLegathon: "LEGATHON ATIVO",
    pausedLegathon: "LEGATHON PAUSADO",
    nextLegathon: "PRÓXIMO LEGATHON",

    complete: "CONCLUÍDO",
    steps: "Passos",
    miles: "Milhas",
    remaining: "Restantes",

    completionRewards: "RECOMPENSAS DO LEGATHON",
    legathonPoints: "Pontos Legathon",
    avatarXP: "XP do Avatar",

    continueLegathon: "Continuar Legathon",
    resumeLegathon: "Retomar Legathon",
    activateLegathon: "Ativar Legathon",

    syncProgress: "Sincronizar progresso",
    pauseLegathon: "Pausar Legathon",
    returnJourney: "Voltar ao modo Journey",

    lastSynced: "Última sincronização: {time}",

    allComplete: "Todos os 26 Legathons concluídos!",
    noChallenge: "Nenhum Legathon disponível",
    savedChallenges:
      "Seus Legathons salvos aparecem abaixo.",

    completed: "Concluídos",
    unlocked: "Desbloqueados",
    wcoinsClaimed: "WCoins resgatados",

    totalPointsClaimed:
      "TOTAL DE PONTOS LEGATHON RESGATADOS",

    globalChallenges: "Desafios Globais Legathon",
    challengeIntro:
      "Conclua cada Legathon desbloqueado para avançar pela série mundial.",

    view: "Ver",
    locked: "Bloqueado",
    continue: "Continuar",
    resume: "Retomar",
    start: "Iniciar",

    rewardsClaimed: "Recompensas resgatadas",

    howItWorks: "Como funciona o modo Legathon",

    how1:
      "A ativação inicia um novo ponto de controle de passos. Leve o telefone enquanto caminha.",

    how2:
      "Enquanto ativo, novos passos contam para o Legathon. Pausar retorna os passos ao modo Journey e salva o progresso.",

    how3:
      "O progresso é sincronizado com a tela aberta e quando o aplicativo volta ao primeiro plano.",

    retrySync: "Tentar sincronizar novamente",

    completeAlert: "Legathon concluído!",
    completeAlertMessage:
      "{title} foi concluído. Abra os detalhes para revisar suas recompensas.",

    completeSaved:
      "Este Legathon foi concluído. Seu progresso está salvo.",

    previousRequired:
      "Conclua o Legathon anterior para desbloquear este desafio.",

    couldNotFinish:
      "Não foi possível finalizar a sessão Legathon.",

    couldNotRead:
      "Não foi possível ler a sessão de caminhada.",

    couldNotSave:
      "Não foi possível salvar o progresso. Tente novamente.",

    couldNotActivate:
      "O Legathon não pôde ser ativado.",

    ownerMismatch:
      "A sessão começou, mas os passos não foram direcionados ao Legathon. Verifique os arquivos da sessão e do mecanismo.",

    couldNotUpdate:
      "Não foi possível atualizar a sessão Legathon.",

    iphoneOnly:
      "Este sistema suporta atualmente iPhone. Android precisa de uma fonte de passos compatível.",

    permission:
      "Ative Movimento e Fitness para Legathon Walk nos Ajustes do iPhone.",

    unavailable:
      "O pedômetro não está disponível. Tente em um iPhone físico.",

    accessibilityWcoin: "WCoin",
    progress: "Progresso",
    challengeNumber: "LEGATHON {number} DE {total}",
  },

  ja: {
    back: "‹ 戻る",
    loading: "Legathonを読み込んでいます…",
    worldLegathons: "ワールドLegathon",
    intro:
      "世界の26のウォーキングチャレンジに挑戦しましょう。",

    modeActive: "Legathonモード実行中",
    modePaused: "Legathon一時停止中",
    modeReady: "Legathonモード準備完了",

    activeMessage:
      "新しい歩数は{title}に加算されます。",
    pausedMessage:
      "進捗は保存されています。準備ができたら再開してください。",
    readyMessage:
      "アンロック済みのLegathonを選択してください。",

    activeLegathon: "実行中のLEGATHON",
    pausedLegathon: "一時停止中のLEGATHON",
    nextLegathon: "次のLEGATHON",

    complete: "完了",
    steps: "歩数",
    miles: "マイル",
    remaining: "残り",

    completionRewards: "LEGATHON完了報酬",
    legathonPoints: "Legathonポイント",
    avatarXP: "アバターXP",

    continueLegathon: "Legathonを続ける",
    resumeLegathon: "Legathonを再開",
    activateLegathon: "Legathonを開始",

    syncProgress: "歩行進捗を同期",
    pauseLegathon: "Legathonを一時停止",
    returnJourney: "Journeyモードに戻る",

    lastSynced: "最終同期 {time}",

    allComplete: "26のLegathonをすべて完了しました！",
    noChallenge: "利用可能なLegathonがありません",
    savedChallenges:
      "保存されたLegathonは以下に表示されます。",

    completed: "完了",
    unlocked: "アンロック",
    wcoinsClaimed: "獲得WCoins",

    totalPointsClaimed:
      "獲得済みLEGATHONポイント合計",

    globalChallenges:
      "グローバルLegathonチャレンジ",

    challengeIntro:
      "アンロックされたLegathonを完了して、世界のシリーズを進みましょう。",

    view: "表示",
    locked: "ロック",
    continue: "続ける",
    resume: "再開",
    start: "開始",

    rewardsClaimed: "報酬獲得済み",

    howItWorks: "Legathonモードの仕組み",

    how1:
      "開始すると新しい歩数チェックポイントが設定されます。歩くときはスマートフォンを携帯してください。",

    how2:
      "実行中の歩数はLegathonに加算されます。一時停止するとJourneyモードに戻り、Legathonの進捗は保存されます。",

    how3:
      "表示中およびアプリがフォアグラウンドに戻ったときに進捗を同期します。",

    retrySync: "同期を再試行",

    completeAlert: "Legathon完了！",
    completeAlertMessage:
      "{title}を完了しました。詳細を開いて報酬を確認してください。",

    completeSaved:
      "このLegathonは完了しています。進捗は保存されています。",

    previousRequired:
      "前のLegathonを完了すると、このチャレンジを解除できます。",

    couldNotFinish:
      "Legathonセッションを完了できませんでした。",

    couldNotRead:
      "歩行セッションを読み込めませんでした。",

    couldNotSave:
      "歩行進捗を保存できませんでした。もう一度お試しください。",

    couldNotActivate:
      "Legathonを開始できませんでした。",

    ownerMismatch:
      "セッションは開始されましたが、歩数の割り当て先がLegathonになっていません。セッションとエンジンのファイルを確認してください。",

    couldNotUpdate:
      "Legathonセッションを更新できませんでした。",

    iphoneOnly:
      "この歩数エンジンは現在iPhoneに対応しています。Androidには互換性のある歩数データが必要です。",

    permission:
      "iPhoneの設定でLegathon Walkの「モーションとフィットネス」へのアクセスを有効にしてください。",

    unavailable:
      "歩数計を利用できません。実機のiPhoneでお試しください。",

    accessibilityWcoin: "WCoin",
    progress: "進捗",
    challengeNumber: "LEGATHON {number} / {total}",
  },

  ko: {
    back: "‹ 뒤로",
    loading: "Legathon을 불러오는 중…",
    worldLegathons: "월드 Legathon",
    intro:
      "전 세계 26개의 걷기 챌린지에 도전하세요.",

    modeActive: "Legathon 모드 활성",
    modePaused: "Legathon 일시정지",
    modeReady: "Legathon 모드 준비",

    activeMessage:
      "새로운 걸음 수가 {title}에 반영됩니다.",
    pausedMessage:
      "진행 상황이 저장되었습니다. 준비되면 다시 시작하세요.",
    readyMessage:
      "잠금 해제된 Legathon을 선택하세요.",

    activeLegathon: "활성 LEGATHON",
    pausedLegathon: "일시정지 LEGATHON",
    nextLegathon: "다음 LEGATHON",

    complete: "완료",
    steps: "걸음",
    miles: "마일",
    remaining: "남음",

    completionRewards: "LEGATHON 완료 보상",
    legathonPoints: "Legathon 포인트",
    avatarXP: "아바타 XP",

    continueLegathon: "Legathon 계속",
    resumeLegathon: "Legathon 재개",
    activateLegathon: "Legathon 시작",

    syncProgress: "걷기 진행 동기화",
    pauseLegathon: "Legathon 일시정지",
    returnJourney: "Journey 모드로 돌아가기",

    lastSynced: "마지막 동기화 {time}",

    allComplete: "26개 Legathon 모두 완료!",
    noChallenge: "사용 가능한 Legathon이 없습니다",
    savedChallenges:
      "저장된 Legathon이 아래에 표시됩니다.",

    completed: "완료",
    unlocked: "잠금 해제",
    wcoinsClaimed: "획득 WCoins",

    totalPointsClaimed:
      "획득한 LEGATHON 포인트 합계",

    globalChallenges:
      "글로벌 Legathon 챌린지",

    challengeIntro:
      "잠금 해제된 Legathon을 완료해 글로벌 시리즈를 진행하세요.",

    view: "보기",
    locked: "잠김",
    continue: "계속",
    resume: "재개",
    start: "시작",

    rewardsClaimed: "보상 획득 완료",

    howItWorks: "Legathon 모드 작동 방식",

    how1:
      "활성화하면 새로운 걸음 체크포인트가 시작됩니다. 걸을 때 휴대폰을 가지고 다니세요.",

    how2:
      "활성 상태에서는 새 걸음이 Legathon에 반영됩니다. 일시정지하면 Journey 모드로 돌아가며 진행 상황은 유지됩니다.",

    how3:
      "화면이 열려 있거나 앱이 다시 활성화되면 저장된 진행 상황을 동기화합니다.",

    retrySync: "동기화 다시 시도",

    completeAlert: "Legathon 완료!",
    completeAlertMessage:
      "{title}을 완료했습니다. 세부 정보에서 보상을 확인하세요.",

    completeSaved:
      "이 Legathon은 완료되었습니다. 진행 상황이 저장되었습니다.",

    previousRequired:
      "이 챌린지를 잠금 해제하려면 이전 Legathon을 완료하세요.",

    couldNotFinish:
      "Legathon 세션을 완료할 수 없습니다.",

    couldNotRead:
      "걷기 세션을 읽을 수 없습니다.",

    couldNotSave:
      "걷기 진행 상황을 저장할 수 없습니다. 다시 시도하세요.",

    couldNotActivate:
      "Legathon을 활성화할 수 없습니다.",

    ownerMismatch:
      "세션은 시작되었지만 걸음 소유자가 Legathon으로 전환되지 않았습니다. 세션 및 엔진 파일을 확인하세요.",

    couldNotUpdate:
      "Legathon 세션을 업데이트할 수 없습니다.",

    iphoneOnly:
      "이 시스템은 현재 iPhone을 지원합니다. Android에는 호환되는 걸음 수 데이터가 필요합니다.",

    permission:
      "iPhone 설정에서 Legathon Walk의 동작 및 피트니스 권한을 활성화하세요.",

    unavailable:
      "만보계를 사용할 수 없습니다. 실제 iPhone에서 사용해 보세요.",

    accessibilityWcoin: "WCoin",
    progress: "진행 상황",
    challengeNumber: "LEGATHON {number} / {total}",
  },

  zh: {
    back: "‹ 返回",
    loading: "正在加载你的Legathon…",
    worldLegathons: "世界 Legathon",
    intro:
      "挑战全球26项步行活动，成为更强大的自己。",

    modeActive: "Legathon 模式已开启",
    modePaused: "Legathon 已暂停",
    modeReady: "Legathon 模式已准备",

    activeMessage:
      "新的步数将计入 {title}。",
    pausedMessage:
      "你的进度已保存。准备好后即可继续。",
    readyMessage:
      "选择一个已解锁的Legathon开始。",

    activeLegathon: "当前 LEGATHON",
    pausedLegathon: "已暂停 LEGATHON",
    nextLegathon: "下一个 LEGATHON",

    complete: "完成",
    steps: "步数",
    miles: "英里",
    remaining: "剩余",

    completionRewards: "LEGATHON完成奖励",
    legathonPoints: "Legathon积分",
    avatarXP: "虚拟形象XP",

    continueLegathon: "继续Legathon",
    resumeLegathon: "恢复Legathon",
    activateLegathon: "开始Legathon",

    syncProgress: "同步步行进度",
    pauseLegathon: "暂停Legathon",
    returnJourney: "返回Journey模式",

    lastSynced: "最后同步：{time}",

    allComplete: "26项Legathon全部完成！",
    noChallenge: "没有可用的Legathon",
    savedChallenges:
      "已保存的Legathon显示在下方。",

    completed: "已完成",
    unlocked: "已解锁",
    wcoinsClaimed: "已领取WCoins",

    totalPointsClaimed:
      "已领取LEGATHON积分总数",

    globalChallenges:
      "全球Legathon挑战",

    challengeIntro:
      "完成每个已解锁的Legathon，继续推进全球系列。",

    view: "查看",
    locked: "已锁定",
    continue: "继续",
    resume: "恢复",
    start: "开始",

    rewardsClaimed: "奖励已领取",

    howItWorks: "Legathon模式如何运作",

    how1:
      "激活后会建立新的步数检查点。步行时请随身携带手机。",

    how2:
      "模式开启时，新步数计入Legathon。暂停后步数重新计入Journey模式，Legathon进度继续保存。",

    how3:
      "页面打开和应用重新回到前台时，会同步已保存的进度。",

    retrySync: "重新同步",

    completeAlert: "Legathon完成！",
    completeAlertMessage:
      "{title}已完成。打开详情查看你的奖励。",

    completeSaved:
      "此Legathon已完成。你的进度已保存。",

    previousRequired:
      "完成上一个Legathon即可解锁此挑战。",

    couldNotFinish:
      "无法完成Legathon会话。",

    couldNotRead:
      "无法读取步行会话。",

    couldNotSave:
      "无法保存步行进度。请重试。",

    couldNotActivate:
      "无法激活Legathon。",

    ownerMismatch:
      "会话已启动，但步数未分配给Legathon。请检查会话和引擎文件。",

    couldNotUpdate:
      "无法更新Legathon会话。",

    iphoneOnly:
      "此系统目前支持iPhone。Android需要兼容的步数来源。",

    permission:
      "请在iPhone设置中为Legathon Walk启用“运动与健身”权限。",

    unavailable:
      "计步器不可用。请使用实体iPhone。",

    accessibilityWcoin: "WCoin",
    progress: "进度",
    challengeNumber: "LEGATHON {number} / {total}",
  },

  it: {
    back: "‹ Indietro",
    loading: "Caricamento dei tuoi Legathon…",
    worldLegathons: "Legathon Mondiali",
    intro:
      "26 sfide globali di camminata. Una versione più forte di te.",

    modeActive: "Modalità Legathon attiva",
    modePaused: "Legathon in pausa",
    modeReady: "Modalità Legathon pronta",

    activeMessage:
      "I nuovi passi vengono conteggiati per {title}.",
    pausedMessage:
      "I tuoi progressi sono salvati. Riprendi quando sei pronto.",
    readyMessage:
      "Scegli un Legathon sbloccato per iniziare.",

    activeLegathon: "LEGATHON ATTIVO",
    pausedLegathon: "LEGATHON IN PAUSA",
    nextLegathon: "PROSSIMO LEGATHON",

    complete: "COMPLETATO",
    steps: "Passi",
    miles: "Miglia",
    remaining: "Rimanenti",

    completionRewards: "RICOMPENSE LEGATHON",
    legathonPoints: "Punti Legathon",
    avatarXP: "XP Avatar",

    continueLegathon: "Continua Legathon",
    resumeLegathon: "Riprendi Legathon",
    activateLegathon: "Attiva Legathon",

    syncProgress: "Sincronizza progressi",
    pauseLegathon: "Metti in pausa",
    returnJourney: "Torna alla modalità Journey",

    lastSynced: "Ultima sincronizzazione: {time}",

    allComplete: "Tutti i 26 Legathon completati!",
    noChallenge: "Nessun Legathon disponibile",
    savedChallenges:
      "I tuoi Legathon salvati sono elencati sotto.",

    completed: "Completati",
    unlocked: "Sbloccati",
    wcoinsClaimed: "WCoins riscattati",

    totalPointsClaimed:
      "PUNTI LEGATHON TOTALI RISCATTATI",

    globalChallenges:
      "Sfide Legathon Globali",

    challengeIntro:
      "Completa ogni Legathon sbloccato per avanzare nella serie mondiale.",

    view: "Visualizza",
    locked: "Bloccato",
    continue: "Continua",
    resume: "Riprendi",
    start: "Inizia",

    rewardsClaimed: "Ricompense riscattate",

    howItWorks: "Come funziona la modalità Legathon",

    how1:
      "L'attivazione avvia un nuovo checkpoint dei passi. Porta il telefono con te mentre cammini.",

    how2:
      "Quando è attiva, i nuovi passi vanno al Legathon. La pausa riporta i passi alla modalità Journey e conserva i progressi.",

    how3:
      "I progressi vengono sincronizzati con la schermata aperta e al ritorno in primo piano.",

    retrySync: "Riprova sincronizzazione",

    completeAlert: "Legathon completato!",
    completeAlertMessage:
      "{title} è completato. Apri i dettagli per vedere le ricompense.",

    completeSaved:
      "Questo Legathon è completato. I progressi sono salvati.",

    previousRequired:
      "Completa il Legathon precedente per sbloccare questa sfida.",

    couldNotFinish:
      "Impossibile completare la sessione Legathon.",

    couldNotRead:
      "Impossibile leggere la sessione di camminata.",

    couldNotSave:
      "Impossibile salvare i progressi. Riprova.",

    couldNotActivate:
      "Impossibile attivare il Legathon.",

    ownerMismatch:
      "La sessione è iniziata, ma i passi non sono assegnati al Legathon. Controlla i file di sessione e del motore.",

    couldNotUpdate:
      "Impossibile aggiornare la sessione Legathon.",

    iphoneOnly:
      "Questo sistema supporta attualmente iPhone. Android richiede una fonte di passi compatibile.",

    permission:
      "Abilita Movimento e fitness per Legathon Walk nelle impostazioni dell'iPhone.",

    unavailable:
      "Il pedometro non è disponibile. Prova su un iPhone fisico.",

    accessibilityWcoin: "WCoin",
    progress: "Progresso",
    challengeNumber: "LEGATHON {number} DI {total}",
  },

  ar: {
    back: "رجوع ›",
    loading: "جارٍ تحميل Legathons…",
    worldLegathons: "Legathons العالمية",
    intro:
      "26 تحديًا عالميًا للمشي. نحو نسخة أقوى منك.",

    modeActive: "وضع Legathon نشط",
    modePaused: "Legathon متوقف مؤقتًا",
    modeReady: "وضع Legathon جاهز",

    activeMessage:
      "تُحتسب خطواتك الجديدة ضمن {title}.",
    pausedMessage:
      "تم حفظ تقدمك. استأنف عندما تكون جاهزًا.",
    readyMessage:
      "اختر Legathon مفتوحًا للبدء.",

    activeLegathon: "LEGATHON النشط",
    pausedLegathon: "LEGATHON المتوقف",
    nextLegathon: "LEGATHON التالي",

    complete: "مكتمل",
    steps: "الخطوات",
    miles: "الأميال",
    remaining: "المتبقي",

    completionRewards: "مكافآت إكمال LEGATHON",
    legathonPoints: "نقاط Legathon",
    avatarXP: "XP للشخصية",

    continueLegathon: "متابعة Legathon",
    resumeLegathon: "استئناف Legathon",
    activateLegathon: "بدء Legathon",

    syncProgress: "مزامنة تقدم المشي",
    pauseLegathon: "إيقاف Legathon مؤقتًا",
    returnJourney: "العودة إلى وضع Journey",

    lastSynced: "آخر مزامنة: {time}",

    allComplete: "تم إكمال جميع Legathons الـ26!",
    noChallenge: "لا يوجد Legathon متاح",
    savedChallenges:
      "تظهر تحديات Legathon المحفوظة أدناه.",

    completed: "المكتملة",
    unlocked: "المفتوحة",
    wcoinsClaimed: "WCoins المستلمة",

    totalPointsClaimed:
      "إجمالي نقاط LEGATHON المستلمة",

    globalChallenges:
      "تحديات Legathon العالمية",

    challengeIntro:
      "أكمل كل Legathon مفتوح للتقدم عبر السلسلة العالمية.",

    view: "عرض",
    locked: "مغلق",
    continue: "متابعة",
    resume: "استئناف",
    start: "بدء",

    rewardsClaimed: "تم استلام المكافآت",

    howItWorks: "كيف يعمل وضع Legathon",

    how1:
      "يبدأ التفعيل نقطة تحقق جديدة للخطوات. احتفظ بهاتفك معك أثناء المشي.",

    how2:
      "أثناء النشاط، تُضاف الخطوات الجديدة إلى Legathon. عند الإيقاف المؤقت تعود الخطوات إلى وضع Journey مع الاحتفاظ بالتقدم.",

    how3:
      "تتم مزامنة التقدم أثناء فتح الشاشة وعند عودة التطبيق إلى الواجهة.",

    retrySync: "إعادة محاولة المزامنة",

    completeAlert: "اكتمل Legathon!",
    completeAlertMessage:
      "تم إكمال {title}. افتح التفاصيل لمراجعة مكافآتك.",

    completeSaved:
      "تم إكمال هذا Legathon وحفظ تقدمك.",

    previousRequired:
      "أكمل Legathon السابق لفتح هذا التحدي.",

    couldNotFinish:
      "تعذر إنهاء جلسة Legathon.",

    couldNotRead:
      "تعذر قراءة جلسة المشي.",

    couldNotSave:
      "تعذر حفظ تقدم المشي. حاول مرة أخرى.",

    couldNotActivate:
      "تعذر تفعيل Legathon.",

    ownerMismatch:
      "بدأت الجلسة ولكن الخطوات لم تُوجَّه إلى Legathon. تحقق من ملفات الجلسة ومحرك الخطوات.",

    couldNotUpdate:
      "تعذر تحديث جلسة Legathon.",

    iphoneOnly:
      "يدعم هذا النظام iPhone حاليًا. يحتاج Android إلى مصدر خطوات متوافق.",

    permission:
      "فعّل إذن الحركة واللياقة لتطبيق Legathon Walk من إعدادات iPhone.",

    unavailable:
      "عداد الخطوات غير متاح. جرّب على جهاز iPhone فعلي.",

    accessibilityWcoin: "WCoin",
    progress: "التقدم",
    challengeNumber: "LEGATHON {number} من {total}",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function normalizeLanguage(language) {
  const normalized = String(language || "en")
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return TEXT[normalized] ? normalized : "en";
}

function fillTemplate(value, variables = {}) {
  return String(value ?? "").replace(
    /\{(\w+)\}/g,
    (match, key) =>
      Object.prototype.hasOwnProperty.call(
        variables,
        key
      )
        ? String(variables[key])
        : match
  );
}

// ============================================================
// PROGRESS HELPERS
// ============================================================

function getProgress(legathon, progressMap) {
  const saved =
    progressMap?.[legathon.id] || {};

  const totalSteps =
    safeNumber(saved.totalSteps) ||
    safeNumber(legathon.totalSteps) ||
    safeNumber(MARATHON_TOTAL_STEPS) ||
    52400;

  const steps = Math.min(
    totalSteps,
    safeNumber(saved.steps)
  );

  const completed =
    saved.completed === true ||
    steps >= totalSteps;

  return {
    ...saved,
    steps,
    totalSteps,
    completed,

    unlocked:
      completed ||
      saved.unlocked === true ||
      legathon.unlockedByDefault === true,

    percent: completed
      ? 100
      : Math.min(
          100,
          (steps / totalSteps) * 100
        ),
  };
}

function createResultError(result, fallback) {
  const error =
    result?.error ||
    result?.result?.error;

  const message =
    error?.message ||
    (error ? String(error) : result?.reason) ||
    fallback;

  return new Error(message);
}

// Keep internal "marathon" owner values unchanged.
// These are step-routing identifiers, not display text.

function isLegathonActive(state, legathonId) {
  return Boolean(
    legathonId &&
      state.activeId === legathonId &&
      state.session?.marathonId === legathonId &&
      state.session?.active === true &&
      state.session?.status === "active" &&
      state.session?.ownsStepRouting === true &&
      state.owner?.owner === "marathon" &&
      state.owner?.marathonId === legathonId
  );
}

// ============================================================
// WORLD LEGATHONS SCREEN
// ============================================================

export default function MarathonScreen({
  language = "en",
  goBack,
  goToWorldMarathonDetail,
}) {
  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";

  const t = useCallback(
    (key, variables = {}) => {
      const value =
        TEXT[languageCode]?.[key] ??
        TEXT.en?.[key] ??
        key;

      return fillTemplate(value, variables);
    },
    [languageCode]
  );

  const requirePedometer = useCallback(
    async (requestPermission = false) => {
      if (Platform.OS !== "ios") {
        throw new Error(t("iphoneOnly"));
      }

      let permission =
        await Pedometer.getPermissionsAsync();

      if (
        !permission.granted &&
        requestPermission &&
        permission.canAskAgain
      ) {
        permission =
          await Pedometer.requestPermissionsAsync();
      }

      if (!permission.granted) {
        throw new Error(t("permission"));
      }

      const available =
        await Pedometer.isAvailableAsync();

      if (!available) {
        throw new Error(t("unavailable"));
      }
    },
    [t]
  );

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    screenState,
    setScreenState,
  ] = useState({
    progressMap: {},
    activeId: null,
    session: null,
    owner: null,
  });

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [lastSync, setLastSync] =
    useState(null);

  // ==========================================================
  // REFS
  // ==========================================================

  const mountedRef = useRef(false);

  const appStateRef = useRef(
    AppState.currentState
  );

  const operationQueueRef = useRef(
    Promise.resolve()
  );

  const pendingOperationsRef = useRef(0);

  const completionAlertsRef = useRef(
    new Set()
  );

  // ==========================================================
  // SERIALIZED OPERATIONS
  // ==========================================================

  const runOperation = useCallback(
    (operation, showErrorAlert = false) => {
      if (
        !showErrorAlert &&
        pendingOperationsRef.current > 0
      ) {
        return Promise.resolve();
      }

      pendingOperationsRef.current += 1;

      if (mountedRef.current) {
        setBusy(true);
      }

      const queuedOperation =
        operationQueueRef.current.then(
          async () => {
            if (!mountedRef.current) {
              return;
            }

            try {
              await operation();

              if (mountedRef.current) {
                setErrorMessage("");
              }
            } catch (error) {
              const message =
                error?.message ||
                String(error);

              console.error(
                "WorldLegathons operation error:",
                error
              );

              if (mountedRef.current) {
                setErrorMessage(message);

                if (showErrorAlert) {
                  Alert.alert(
                    "Legathon",
                    message
                  );
                }
              }
            } finally {
              if (mountedRef.current) {
                setLoading(false);
              }
            }
          }
        );

      operationQueueRef.current =
        queuedOperation.catch(() => {});

      return queuedOperation.finally(() => {
        pendingOperationsRef.current =
          Math.max(
            0,
            pendingOperationsRef.current - 1
          );

        if (mountedRef.current) {
          setBusy(
            pendingOperationsRef.current > 0
          );
        }
      });
    },
    []
  );

  // ==========================================================
  // READ SAVED LEGATHON STATE
  // ==========================================================

  const refreshLegathonState = useCallback(
    async () => {
      const progressMap =
        await loadMarathonProgressMap();

      let session =
        await loadLegathonSession();

      const sessionLegathon =
        MARATHON_CATALOG.find(
          (legathon) =>
            legathon.id ===
            session?.marathonId
        );

      if (
        sessionLegathon &&
        session.status !== "completed" &&
        getProgress(
          sessionLegathon,
          progressMap
        ).completed
      ) {
        const result =
          await completeLegathonSession(
            sessionLegathon.id
          );

        if (result?.completed !== true) {
          throw createResultError(
            result,
            t("couldNotFinish")
          );
        }

        session =
          await loadLegathonSession();
      }

      const activeLegathon =
        await getActiveMarathon();

      const owner =
        await getCurrentStepOwner();

      if (owner?.error) {
        throw createResultError(
          owner,
          t("couldNotRead")
        );
      }

      const nextState = {
        progressMap: progressMap || {},
        session,
        owner,

        activeId:
          activeLegathon?.marathonId ||
          activeLegathon?.id ||
          activeLegathon?.marathon?.id ||
          null,
      };

      if (mountedRef.current) {
        setScreenState(nextState);
      }

      return nextState;
    },
    [t]
  );

  // ==========================================================
  // SYNC PHYSICAL WALKING STEPS
  // ==========================================================

  const syncWalkingProgress = useCallback(
    async () => {
      await refreshLegathonState();

      await requirePedometer();

      const result =
        await syncTodaySteps();

      const routingFailed =
        safeNumber(result?.delta) > 0 &&
        result?.destination === "marathon" &&
        result?.routed !== true;

      if (
        !result ||
        result.synced !== true ||
        result.error ||
        result.result?.error ||
        result.result?.saved === false ||
        result.saved === false ||
        routingFailed
      ) {
        throw createResultError(
          result,
          t("couldNotSave")
        );
      }

      const nextState =
        await refreshLegathonState();

      if (mountedRef.current) {
        setLastSync(new Date());
      }

      if (result.completedNow === true) {
        const completedId =
          result.marathonId ||
          result.marathon?.id;

        const completedLegathon =
          MARATHON_CATALOG.find(
            (legathon) =>
              legathon.id === completedId
          );

        if (
          completedLegathon &&
          getProgress(
            completedLegathon,
            nextState.progressMap
          ).completed &&
          !completionAlertsRef.current.has(
            completedId
          ) &&
          mountedRef.current
        ) {
          completionAlertsRef.current.add(
            completedId
          );

          Alert.alert(
            t("completeAlert"),
            t("completeAlertMessage", {
              title: completedLegathon.title,
            })
          );
        }
      }

      return nextState;
    },
    [
      refreshLegathonState,
      requirePedometer,
      t,
    ]
  );

  // ==========================================================
  // INITIAL LOAD + AUTOMATIC SYNCHRONIZATION
  //
  // Show saved data first, then sync physical steps.
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    appStateRef.current =
      AppState.currentState;

    // Read locally saved progress quickly.
    void runOperation(
      refreshLegathonState
    ).then(() => {
      if (mountedRef.current) {
        void runOperation(
          syncWalkingProgress
        );
      }
    });

    const interval = setInterval(() => {
      if (
        appStateRef.current === "active"
      ) {
        void runOperation(
          syncWalkingProgress
        );
      }
    }, SYNC_INTERVAL_MS);

    const subscription =
      AppState.addEventListener(
        "change",
        (nextAppState) => {
          const previousAppState =
            appStateRef.current;

          appStateRef.current =
            nextAppState;

          if (
            nextAppState === "active" &&
            previousAppState !== "active"
          ) {
            void runOperation(
              syncWalkingProgress
            );
          }
        }
      );

    return () => {
      mountedRef.current = false;

      clearInterval(interval);

      subscription.remove();
    };
  }, [
    runOperation,
    refreshLegathonState,
    syncWalkingProgress,
  ]);

  // ==========================================================
  // DETAILS NAVIGATION
  // ==========================================================

  const openLegathonDetails = useCallback(
    (legathonId) => {
      if (
        typeof goToWorldMarathonDetail ===
        "function"
      ) {
        goToWorldMarathonDetail(
          legathonId
        );
      }
    },
    [goToWorldMarathonDetail]
  );

  // ==========================================================
  // ACTIVATE / RESUME / OPEN LEGATHON
  // ==========================================================

  const handleOpenLegathon = useCallback(
    (legathon) => {
      void runOperation(
        async () => {
          const currentState =
            await refreshLegathonState();

          const progress = getProgress(
            legathon,
            currentState.progressMap
          );

          if (progress.completed) {
            if (
              typeof goToWorldMarathonDetail ===
              "function"
            ) {
              openLegathonDetails(
                legathon.id
              );
            } else {
              Alert.alert(
                legathon.title,
                t("completeSaved")
              );
            }

            return;
          }

          if (!progress.unlocked) {
            throw new Error(
              t("previousRequired")
            );
          }

          await requirePedometer(true);

          if (
            !isLegathonActive(
              currentState,
              legathon.id
            )
          ) {
            const shouldResume =
              currentState.activeId ===
                legathon.id &&
              currentState.session?.marathonId ===
                legathon.id &&
              currentState.session?.status ===
                "paused";

            const result = shouldResume
              ? await resumeLegathon()
              : await startLegathon(
                  legathon.id
                );

            const succeeded = shouldResume
              ? result?.resumed
              : result?.started;

            if (succeeded !== true) {
              throw createResultError(
                result,
                t("couldNotActivate")
              );
            }

            const updatedState =
              await syncWalkingProgress();

            if (
              !isLegathonActive(
                updatedState,
                legathon.id
              )
            ) {
              throw new Error(
                t("ownerMismatch")
              );
            }
          } else {
            await syncWalkingProgress();
          }

          if (mountedRef.current) {
            openLegathonDetails(
              legathon.id
            );
          }
        },
        true
      );
    },
    [
      runOperation,
      refreshLegathonState,
      syncWalkingProgress,
      openLegathonDetails,
      goToWorldMarathonDetail,
      requirePedometer,
      t,
    ]
  );

  // ==========================================================
  // PAUSE / EXIT
  // ==========================================================

  const handleSessionAction = useCallback(
    (action) => {
      void runOperation(
        async () => {
          const currentState =
            await syncWalkingProgress();

          if (
            currentState.session?.status ===
            "completed"
          ) {
            return;
          }

          const result =
            action === "pause"
              ? await pauseLegathon()
              : await exitLegathon();

          const succeeded =
            action === "pause"
              ? result?.paused
              : result?.exited;

          if (succeeded !== true) {
            throw createResultError(
              result,
              t("couldNotUpdate")
            );
          }

          await syncWalkingProgress();
        },
        true
      );
    },
    [
      runOperation,
      syncWalkingProgress,
      t,
    ]
  );

  // ==========================================================
  // DERIVED LEGATHON DATA
  // ==========================================================

  const legathonRows = useMemo(
    () =>
      MARATHON_CATALOG.map(
        (legathon) => ({
          legathon,

          progress: getProgress(
            legathon,
            screenState.progressMap
          ),
        })
      ),
    [screenState.progressMap]
  );

  const selectedLegathon =
    legathonRows.find(
      (row) =>
        row.legathon.id ===
        screenState.activeId
    ) ||
    legathonRows.find(
      (row) =>
        row.progress.unlocked &&
        !row.progress.completed
    );

  const modeActive = selectedLegathon
    ? isLegathonActive(
        screenState,
        selectedLegathon.legathon.id
      )
    : false;

  const modePaused = Boolean(
    selectedLegathon &&
    screenState.session?.status ===
      "paused" &&
    screenState.session?.marathonId ===
      selectedLegathon.legathon.id
  );

  const completedCount =
    legathonRows.filter(
      (row) => row.progress.completed
    ).length;

  const unlockedCount =
    legathonRows.filter(
      (row) => row.progress.unlocked
    ).length;

  const claimedLegathons =
    legathonRows.filter(
      (row) =>
        row.progress.rewardClaimed === true
    );

  const claimedCoins =
    claimedLegathons.reduce(
      (total, row) =>
        total +
        safeNumber(
          row.legathon.rewardCoins
        ),
      0
    );

  const claimedPoints =
    claimedLegathons.reduce(
      (total, row) =>
        total +
        safeNumber(
          row.legathon.rewardPoints
        ),
      0
    );

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={GOLD}
          />

          <Text
            style={[
              styles.bodyText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View
          style={[
            styles.headerRow,
            isRTL && styles.rowRTL,
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            accessibilityRole="button"
            disabled={
              busy ||
              typeof goBack !== "function"
            }
            onPress={goBack}
          >
            <Text
              style={[
                styles.goldText,
                isRTL && styles.rtlText,
              ]}
            >
              {t("back")}
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerBadge}>
            LEGATHON
          </Text>
        </View>

        <Text
          style={[
            styles.screenTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {t("worldLegathons")}
        </Text>

        <Text
          style={[
            styles.bodyText,
            isRTL && styles.rtlText,
          ]}
        >
          {t("intro")}
        </Text>

        {/* ERRORS */}

        {!!errorMessage && (
          <View style={styles.errorCard}>
            <Text
              style={[
                styles.errorText,
                isRTL && styles.rtlText,
              ]}
            >
              {errorMessage}
            </Text>

            <ActionButton
              label={t("retrySync")}
              disabled={busy}
              onPress={() => {
                void runOperation(
                  syncWalkingProgress,
                  true
                );
              }}
            />
          </View>
        )}

        {/* MODE STATUS */}

        <View
          style={[
            styles.card,
            modeActive && styles.activeCard,
          ]}
        >
          <Text
            style={[
              styles.goldText,
              isRTL && styles.rtlText,
            ]}
          >
            {modeActive
              ? t("modeActive")
              : modePaused
              ? t("modePaused")
              : t("modeReady")}
          </Text>

          <Text
            style={[
              styles.bodyText,
              isRTL && styles.rtlText,
            ]}
          >
            {modeActive
              ? t("activeMessage", {
                  title:
                    selectedLegathon?.legathon
                      ?.title || "",
                })
              : modePaused
              ? t("pausedMessage")
              : t("readyMessage")}
          </Text>
        </View>

        {/* FEATURED LEGATHON */}

        {selectedLegathon ? (
          <View
            style={[
              styles.card,
              styles.heroCard,
            ]}
          >
            <View
              style={[
                styles.row,
                isRTL && styles.rowRTL,
              ]}
            >
              <Text
                style={[
                  styles.heroFlag,
                  isRTL && styles.heroFlagRTL,
                ]}
              >
                {selectedLegathon.legathon.flag}
              </Text>

              <View style={styles.flex}>
                <Text
                  style={[
                    styles.label,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {modeActive
                    ? t("activeLegathon")
                    : modePaused
                    ? t("pausedLegathon")
                    : t("nextLegathon")}
                </Text>

                <Text
                  style={[
                    styles.heroTitle,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {selectedLegathon.legathon.title}
                </Text>

                <Text
                  style={[
                    styles.bodyText,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {selectedLegathon.legathon.city}
                  {", "}
                  {selectedLegathon.legathon.country}
                </Text>
              </View>
            </View>

            {/* PROGRESS CIRCLE */}

            <View style={styles.percentCircle}>
              <Text style={styles.percentValue}>
                {Math.floor(
                  selectedLegathon.progress.percent
                )}
                %
              </Text>

              <Text style={styles.label}>
                {t("complete")}
              </Text>
            </View>

            <ProgressBar
              percent={
                selectedLegathon.progress.percent
              }
            />

            {/* WALKING METRICS */}

            <View style={styles.metricsRow}>
              <MetricCard
                value={formatNumber(
                  selectedLegathon.progress.steps,
                  languageCode
                )}
                label={t("steps")}
              />

              <MetricCard
                value={(
                  selectedLegathon.progress.steps /
                  STEPS_IN_ONE_MILE
                ).toFixed(2)}
                label={t("miles")}
              />

              <MetricCard
                value={formatNumber(
                  selectedLegathon.progress.totalSteps -
                    selectedLegathon.progress.steps,
                  languageCode
                )}
                label={t("remaining")}
              />
            </View>

            <Text style={styles.centerText}>
              {formatNumber(
                selectedLegathon.progress.steps,
                languageCode
              )}
              {" / "}
              {formatNumber(
                selectedLegathon.progress.totalSteps,
                languageCode
              )}
              {" "}
              {t("steps")}
            </Text>

            <Text style={styles.centerText}>
              {(
                selectedLegathon.progress.steps /
                STEPS_IN_ONE_MILE
              ).toFixed(2)}
              {" / "}
              {(
                selectedLegathon.progress.totalSteps /
                STEPS_IN_ONE_MILE
              ).toFixed(2)}
              {" "}
              {t("miles")}
            </Text>

            {/* COMPLETION REWARDS */}

            <View style={styles.rewardsCard}>
              <Text
                style={[
                  styles.label,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("completionRewards")}
              </Text>

              <View
                style={[
                  styles.wcoinRewardRow,
                  isRTL && styles.rowRTL,
                ]}
              >
                <Image
                  source={WCOIN_IMAGE}
                  style={[
                    styles.wcoinHeroIcon,
                    isRTL && styles.wcoinHeroIconRTL,
                  ]}
                  resizeMode="contain"
                  accessibilityLabel={t(
                    "accessibilityWcoin"
                  )}
                />

                <Text
                  style={styles.wcoinHeroText}
                >
                  {formatNumber(
                    selectedLegathon.legathon
                      .rewardCoins,
                    languageCode
                  )}
                  {" WCoins"}
                </Text>
              </View>

              <Text
                style={[
                  styles.bodyText,
                  isRTL && styles.rtlText,
                ]}
              >
                {"⭐ "}
                {formatNumber(
                  selectedLegathon.legathon
                    .rewardPoints,
                  languageCode
                )}
                {" "}
                {t("legathonPoints")}
              </Text>

              <Text
                style={[
                  styles.bodyText,
                  isRTL && styles.rtlText,
                ]}
              >
                {"✨ "}
                {formatNumber(
                  selectedLegathon.legathon
                    .avatarXP,
                  languageCode
                )}
                {" "}
                {t("avatarXP")}
              </Text>
            </View>

            {/* PRIMARY ACTION */}

            <ActionButton
              primary
              disabled={busy}
              label={
                modeActive
                  ? t("continueLegathon")
                  : modePaused
                  ? t("resumeLegathon")
                  : t("activateLegathon")
              }
              onPress={() =>
                handleOpenLegathon(
                  selectedLegathon.legathon
                )
              }
            />

            <ActionButton
              disabled={busy}
              label={t("syncProgress")}
              onPress={() => {
                void runOperation(
                  syncWalkingProgress,
                  true
                );
              }}
            />

            {modeActive && (
              <ActionButton
                disabled={busy}
                label={t("pauseLegathon")}
                onPress={() =>
                  handleSessionAction("pause")
                }
              />
            )}

            {(modeActive || modePaused) && (
              <ActionButton
                disabled={busy}
                label={t("returnJourney")}
                onPress={() =>
                  handleSessionAction("exit")
                }
              />
            )}

            {busy && (
              <ActivityIndicator
                color={GOLD}
                style={styles.spinner}
              />
            )}

            {lastSync && (
              <Text style={styles.centerText}>
                {t("lastSynced", {
                  time: lastSync.toLocaleTimeString(
                    languageCode
                  ),
                })}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text
              style={[
                styles.heroTitle,
                isRTL && styles.rtlText,
              ]}
            >
              {completedCount ===
                legathonRows.length &&
              legathonRows.length > 0
                ? t("allComplete")
                : t("noChallenge")}
            </Text>

            <Text
              style={[
                styles.bodyText,
                isRTL && styles.rtlText,
              ]}
            >
              {t("savedChallenges")}
            </Text>
          </View>
        )}

        {/* OVERALL LEGATHON STATS */}

        <View style={styles.metricsRow}>
          <MetricCard
            value={formatNumber(
              completedCount,
              languageCode
            )}
            label={t("completed")}
          />

          <MetricCard
            value={formatNumber(
              unlockedCount,
              languageCode
            )}
            label={t("unlocked")}
          />

          <MetricCard
            value={formatNumber(
              claimedCoins,
              languageCode
            )}
            label={t("wcoinsClaimed")}
            wcoin
          />
        </View>

        {/* TOTAL LEGATHON POINTS */}

        <View style={styles.card}>
          <Text
            style={[
              styles.label,
              isRTL && styles.rtlText,
            ]}
          >
            {t("totalPointsClaimed")}
          </Text>

          <Text style={styles.heroTitle}>
            {"⭐ "}
            {formatNumber(
              claimedPoints,
              languageCode
            )}
          </Text>
        </View>

        {/* GLOBAL LEGATHON LIST */}

        <Text
          style={[
            styles.sectionTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {t("globalChallenges")}
        </Text>

        <Text
          style={[
            styles.bodyText,
            isRTL && styles.rtlText,
          ]}
        >
          {t("challengeIntro")}
        </Text>

        {legathonRows.map(
          ({ legathon, progress }) => {
            const isRunning =
              isLegathonActive(
                screenState,
                legathon.id
              );

            const isPaused =
              screenState.session?.status ===
                "paused" &&
              screenState.session?.marathonId ===
                legathon.id;

            const statusLabel =
              progress.completed
                ? t("view")
                : !progress.unlocked
                ? t("locked")
                : isRunning
                ? t("continue")
                : isPaused
                ? t("resume")
                : t("start");

            return (
              <TouchableOpacity
                key={legathon.id}
                accessibilityRole="button"
                accessibilityLabel={
                  `${legathon.title}, ${statusLabel}`
                }
                disabled={
                  busy || !progress.unlocked
                }
                onPress={() =>
                  handleOpenLegathon(
                    legathon
                  )
                }
                activeOpacity={0.85}
                style={[
                  styles.card,
                  styles.challengeRow,
                  isRTL && styles.rowRTL,
                  isRunning && styles.activeCard,
                  !progress.unlocked &&
                    styles.lockedCard,
                ]}
              >
                <Text
                  style={[
                    styles.cardFlag,
                    isRTL && styles.cardFlagRTL,
                  ]}
                >
                  {legathon.flag}
                </Text>

                <View style={styles.flex}>
                  <Text
                    style={[
                      styles.challengeOrder,
                      isRTL && styles.rtlText,
                    ]}
                  >
                    {t("challengeNumber", {
                      number: legathon.order,
                      total: MARATHON_CATALOG.length,
                    })}
                  </Text>

                  <Text
                    style={[
                      styles.cardTitle,
                      isRTL && styles.rtlText,
                    ]}
                  >
                    {legathon.title}
                  </Text>

                  <Text
                    style={[
                      styles.smallText,
                      isRTL && styles.rtlText,
                    ]}
                  >
                    {legathon.city}
                    {", "}
                    {legathon.country}
                  </Text>

                  <Text
                    style={[
                      styles.smallText,
                      isRTL && styles.rtlText,
                    ]}
                  >
                    {(
                      progress.steps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}
                    {" / "}
                    {(
                      progress.totalSteps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}
                    {" "}
                    {t("miles")}
                  </Text>

                  <View
                    style={[
                      styles.wcoinListRow,
                      isRTL && styles.rowRTL,
                    ]}
                  >
                    <Image
                      source={WCOIN_IMAGE}
                      style={[
                        styles.wcoinListIcon,
                        isRTL &&
                          styles.wcoinListIconRTL,
                      ]}
                      resizeMode="contain"
                      accessibilityLabel={t(
                        "accessibilityWcoin"
                      )}
                    />

                    <Text style={styles.rewardText}>
                      {formatNumber(
                        legathon.rewardCoins,
                        languageCode
                      )}
                      {" WCoins"}
                    </Text>
                  </View>

                  <ProgressBar
                    percent={progress.percent}
                  />

                  {progress.completed && (
                    <Text
                      style={[
                        styles.successText,
                        isRTL && styles.rtlText,
                      ]}
                    >
                      {t("completed")}
                      {progress.rewardClaimed
                        ? ` • ${t("rewardsClaimed")}`
                        : ""}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.statusText,
                    isRTL && styles.statusTextRTL,
                  ]}
                >
                  {statusLabel}
                </Text>
              </TouchableOpacity>
            );
          }
        )}

        {/* HOW LEGATHON MODE WORKS */}

        <View style={styles.card}>
          <Text
            style={[
              styles.cardTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("howItWorks")}
          </Text>

          <Text
            style={[
              styles.bodyText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("how1")}
          </Text>

          <Text
            style={[
              styles.bodyText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("how2")}
          </Text>

          <Text
            style={[
              styles.bodyText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("how3")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// REUSABLE ACTION BUTTON
// ============================================================

function ActionButton({
  label,
  onPress,
  disabled = false,
  primary = false,
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.actionButton,
        primary && styles.primaryButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          primary && styles.primaryButtonText,
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({ percent }) {
  const progress = Math.min(
    100,
    safeNumber(percent)
  );

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${progress}%`,
          },
        ]}
      />
    </View>
  );
}

// ============================================================
// METRIC CARD — ALIGNED WCOIN FIX
//
// WCoin is beside its number, not above it.
// All three metric values share the same height.
// ============================================================

function MetricCard({
  value,
  label,
  wcoin = false,
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricValueRow}>
        {wcoin && (
          <Image
            source={WCOIN_IMAGE}
            style={styles.wcoinMetricIcon}
            resizeMode="contain"
            accessibilityLabel="WCoin"
          />
        )}

        <Text
          style={styles.metricValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {value}
        </Text>
      </View>

      <Text
        style={styles.metricLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 150,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    minHeight: 44,
    justifyContent: "center",
  },

  headerBadge: {
    color: GOLD,
    borderColor: GOLD,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },

  screenTitle: {
    color: COLORS.white,
    fontSize: 38,
    lineHeight: 45,
    fontWeight: "900",
  },

  bodyText: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
  },

  activeCard: {
    borderColor: GOLD,
  },

  heroCard: {
    borderColor: "#8A6B22",
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  flex: {
    flex: 1,
    minWidth: 0,
  },

  heroFlag: {
    fontSize: 42,
    marginRight: 14,
  },

  heroFlagRTL: {
    marginRight: 0,
    marginLeft: 14,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },

  label: {
    color: "#9EACC0",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  goldText: {
    color: GOLD,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 4,
  },

  percentCircle: {
    width: 172,
    height: 172,
    borderRadius: 86,
    borderWidth: 9,
    borderColor: GOLD,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },

  percentValue: {
    color: COLORS.white,
    fontSize: 44,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#253248",
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    backgroundColor: GOLD,
  },

  // ==========================================================
  // THREE-COLUMN STATISTICS
  // ==========================================================

  metricsRow: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginTop: 18,
  },

  metricCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 116,
    marginHorizontal: 4,
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
  },

  metricValueRow: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  metricValue: {
    color: GOLD,
    fontSize: 27,
    fontWeight: "900",
    includeFontPadding: false,
    textAlign: "center",
    flexShrink: 1,
  },

  metricLabel: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    minHeight: 34,
  },

  wcoinMetricIcon: {
    width: 23,
    height: 23,
    marginRight: 5,
  },

  centerText: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
  },

  // ==========================================================
  // REWARDS
  // ==========================================================

  rewardsCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },

  wcoinRewardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  wcoinHeroIcon: {
    width: 34,
    height: 34,
    marginRight: 9,
  },

  wcoinHeroIconRTL: {
    marginRight: 0,
    marginLeft: 9,
  },

  wcoinHeroText: {
    flexShrink: 1,
    color: GOLD,
    fontSize: 19,
    fontWeight: "800",
  },

  wcoinListRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  wcoinListIcon: {
    width: 24,
    height: 24,
    marginRight: 7,
  },

  wcoinListIconRTL: {
    marginRight: 0,
    marginLeft: 7,
  },

  // ==========================================================
  // BUTTONS
  // ==========================================================

  actionButton: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 13,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: GOLD,
  },

  actionButtonText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  primaryButtonText: {
    color: "#06101C",
  },

  disabledButton: {
    opacity: 0.5,
  },

  spinner: {
    marginTop: 12,
  },

  // ==========================================================
  // LEGATHON CHALLENGE LIST
  // ==========================================================

  sectionTitle: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "900",
    marginTop: 28,
  },

  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardFlag: {
    fontSize: 32,
    marginRight: 12,
  },

  cardFlagRTL: {
    marginRight: 0,
    marginLeft: 12,
  },

  challengeOrder: {
    color: GOLD,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "800",
  },

  smallText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  rewardText: {
    flexShrink: 1,
    color: GOLD,
    fontWeight: "800",
    fontSize: 14,
  },

  statusText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 9,
    maxWidth: 68,
    textAlign: "right",
  },

  statusTextRTL: {
    marginLeft: 0,
    marginRight: 9,
    textAlign: "left",
  },

  lockedCard: {
    opacity: 0.55,
  },

  successText: {
    color: COLORS.green,
    fontSize: 12,
    marginTop: 8,
  },

  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  errorCard: {
    backgroundColor: "#291922",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 14,
    lineHeight: 21,
  },

  // ==========================================================
  // RIGHT-TO-LEFT SUPPORT
  // ==========================================================

  rowRTL: {
    flexDirection: "row-reverse",
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});
