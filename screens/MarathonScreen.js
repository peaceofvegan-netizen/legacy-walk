// screens/MarathonScreen.js

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
// CONSTANTS
// ============================================================

const SYNC_INTERVAL_MS = 2500;
const GOLD = "#F7BE22";

const WCOIN_IMAGE = require("../assets/wcoin.png");

function safeNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

function formatNumber(value, language = "en") {
  try {
    return Math.floor(safeNumber(value)).toLocaleString(language);
  } catch {
    return Math.floor(safeNumber(value)).toLocaleString();
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
      "Walk global endurance challenges and build your Legathon legacy.",

    modeActive: "Legathon Mode Active",
    modePaused: "Legathon Paused",
    modeReady: "Legathon Mode Ready",

    activeMessage:
      "New walking steps count toward {title}.",
    pausedMessage:
      "Your progress is saved. Resume when you are ready.",
    readyMessage:
      "Choose an unlocked challenge to begin.",

    activeLegathon: "ACTIVE LEGATHON",
    pausedLegathon: "PAUSED LEGATHON",
    nextLegathon: "NEXT LEGATHON",

    complete: "COMPLETE",
    steps: "Steps",
    miles: "Miles",
    remaining: "Remaining",

    completionRewards: "COMPLETION REWARDS",
    legathonPoints: "Legathon Points",
    avatarXP: "Avatar XP",

    continueLegathon: "Continue Legathon",
    resumeLegathon: "Resume Legathon",
    activateLegathon: "Activate Legathon",

    syncProgress: "Sync Walking Progress",
    pauseLegathon: "Pause Legathon",
    returnJourney: "Return to Journey Mode",

    lastSynced: "Last synced {time}",

    allComplete: "All Legathons Complete!",
    noChallenge: "No challenge available",
    savedChallenges:
      "Your saved challenges are listed below.",

    completed: "Completed",
    unlocked: "Unlocked",
    wcoinsClaimed: "WCoins Claimed",

    totalPointsClaimed:
      "TOTAL LEGATHON POINTS CLAIMED",

    globalChallenges:
      "Global Legathon Challenges",

    challengeIntro:
      "Complete each unlocked challenge to advance through the global Legathon series.",

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
      "While active, new steps go to your Legathon. Pausing returns step routing to Journey mode and keeps your marathon progress.",

    how3:
      "This screen checks for saved walking progress while open and when the app returns to the foreground.",

    retrySync: "Retry Sync",

    completeAlert: "Legathon Complete!",
    completeAlertMessage:
      "{title} is complete. Open its details to review your rewards.",

    completeSaved:
      "This Legathon is complete. Your progress is saved.",

    previousRequired:
      "Complete the previous Legathon to unlock this challenge.",

    couldNotFinish:
      "Could not finish the walking session.",

    couldNotRead:
      "Could not read the walking session.",

    couldNotSave:
      "Walking progress could not be saved. Please try again.",

    couldNotActivate:
      "The Legathon could not be activated.",

    ownerMismatch:
      "The session started but its step owner does not match. Check that the latest session and engine files are both saved.",

    couldNotUpdate:
      "The walking session could not be updated.",

    iphoneOnly:
      "This step engine currently supports iPhone. Android needs a compatible step-count source.",

    permission:
      "Enable Motion & Fitness access for this app in iPhone Settings, then try again.",

    unavailable:
      "The pedometer is unavailable. Try this on a physical iPhone.",

    accessibilityWcoin: "WCoin",
  },

  es: {
    back: "‹ Atrás",
    loading: "Cargando tus Legathons…",
    worldLegathons: "Legathons Mundiales",
    intro:
      "Completa desafíos mundiales de resistencia caminando y construye tu legado Legathon.",

    modeActive: "Modo Legathon activo",
    modePaused: "Legathon en pausa",
    modeReady: "Modo Legathon listo",

    activeMessage:
      "Tus nuevos pasos cuentan para {title}.",
    pausedMessage:
      "Tu progreso está guardado. Continúa cuando estés listo.",
    readyMessage:
      "Elige un desafío desbloqueado para comenzar.",

    activeLegathon: "LEGATHON ACTIVO",
    pausedLegathon: "LEGATHON EN PAUSA",
    nextLegathon: "PRÓXIMO LEGATHON",

    complete: "COMPLETADO",
    steps: "Pasos",
    miles: "Millas",
    remaining: "Restantes",

    completionRewards: "RECOMPENSAS POR COMPLETAR",
    legathonPoints: "Puntos Legathon",
    avatarXP: "XP del avatar",

    continueLegathon: "Continuar Legathon",
    resumeLegathon: "Reanudar Legathon",
    activateLegathon: "Activar Legathon",

    syncProgress: "Sincronizar progreso",
    pauseLegathon: "Pausar Legathon",
    returnJourney: "Volver al modo Journey",

    lastSynced: "Última sincronización: {time}",

    allComplete: "¡Todos los Legathons completados!",
    noChallenge: "No hay desafío disponible",
    savedChallenges:
      "Tus desafíos guardados aparecen a continuación.",

    completed: "Completados",
    unlocked: "Desbloqueados",
    wcoinsClaimed: "WCoins reclamados",

    totalPointsClaimed:
      "TOTAL DE PUNTOS LEGATHON RECLAMADOS",

    globalChallenges:
      "Desafíos Legathon Globales",

    challengeIntro:
      "Completa cada desafío desbloqueado para avanzar por la serie global Legathon.",

    view: "Ver",
    locked: "Bloqueado",
    continue: "Continuar",
    resume: "Reanudar",
    start: "Comenzar",

    rewardsClaimed: "Recompensas reclamadas",

    howItWorks: "Cómo funciona el modo Legathon",

    how1:
      "La activación inicia un nuevo punto de control de pasos. Lleva tu teléfono contigo mientras caminas.",

    how2:
      "Mientras esté activo, tus nuevos pasos irán a tu Legathon. Al pausar, los pasos vuelven al modo Journey y tu progreso del maratón queda guardado.",

    how3:
      "Esta pantalla comprueba el progreso guardado mientras está abierta y cuando la aplicación vuelve al primer plano.",

    retrySync: "Reintentar sincronización",

    completeAlert: "¡Legathon completado!",
    completeAlertMessage:
      "{title} está completado. Abre los detalles para revisar tus recompensas.",

    completeSaved:
      "Este Legathon está completado. Tu progreso está guardado.",

    previousRequired:
      "Completa el Legathon anterior para desbloquear este desafío.",

    couldNotFinish:
      "No se pudo finalizar la sesión de caminata.",

    couldNotRead:
      "No se pudo leer la sesión de caminata.",

    couldNotSave:
      "No se pudo guardar el progreso. Inténtalo de nuevo.",

    couldNotActivate:
      "No se pudo activar el Legathon.",

    ownerMismatch:
      "La sesión comenzó, pero el propietario de los pasos no coincide. Comprueba que los archivos más recientes de sesión y motor estén guardados.",

    couldNotUpdate:
      "No se pudo actualizar la sesión de caminata.",

    iphoneOnly:
      "Este sistema de pasos actualmente funciona con iPhone. Android necesita una fuente de conteo de pasos compatible.",

    permission:
      "Activa el acceso a Movimiento y Fitness para esta aplicación en los ajustes del iPhone.",

    unavailable:
      "El podómetro no está disponible. Prueba en un iPhone físico.",

    accessibilityWcoin: "WCoin",
  },

  fr: {
    back: "‹ Retour",
    loading: "Chargement de vos Legathons…",
    worldLegathons: "Legathons Mondiaux",
    intro:
      "Relevez des défis mondiaux d'endurance à pied et construisez votre héritage Legathon.",

    modeActive: "Mode Legathon actif",
    modePaused: "Legathon en pause",
    modeReady: "Mode Legathon prêt",

    activeMessage:
      "Vos nouveaux pas comptent pour {title}.",
    pausedMessage:
      "Votre progression est enregistrée. Reprenez lorsque vous êtes prêt.",
    readyMessage:
      "Choisissez un défi déverrouillé pour commencer.",

    activeLegathon: "LEGATHON ACTIF",
    pausedLegathon: "LEGATHON EN PAUSE",
    nextLegathon: "PROCHAIN LEGATHON",

    complete: "TERMINÉ",
    steps: "Pas",
    miles: "Miles",
    remaining: "Restants",

    completionRewards: "RÉCOMPENSES",
    legathonPoints: "Points Legathon",
    avatarXP: "XP Avatar",

    continueLegathon: "Continuer le Legathon",
    resumeLegathon: "Reprendre le Legathon",
    activateLegathon: "Activer le Legathon",

    syncProgress: "Synchroniser la progression",
    pauseLegathon: "Mettre en pause",
    returnJourney: "Retour au mode Journey",

    lastSynced: "Dernière synchronisation : {time}",

    allComplete: "Tous les Legathons sont terminés !",
    noChallenge: "Aucun défi disponible",
    savedChallenges:
      "Vos défis enregistrés sont affichés ci-dessous.",

    completed: "Terminés",
    unlocked: "Déverrouillés",
    wcoinsClaimed: "WCoins réclamés",

    totalPointsClaimed:
      "TOTAL DES POINTS LEGATHON RÉCLAMÉS",

    globalChallenges:
      "Défis Legathon Mondiaux",

    challengeIntro:
      "Terminez chaque défi déverrouillé pour progresser dans la série mondiale Legathon.",

    view: "Voir",
    locked: "Verrouillé",
    continue: "Continuer",
    resume: "Reprendre",
    start: "Commencer",

    rewardsClaimed: "Récompenses réclamées",

    howItWorks: "Fonctionnement du mode Legathon",

    how1:
      "L'activation démarre un nouveau point de contrôle des pas. Gardez votre téléphone avec vous pendant la marche.",

    how2:
      "Lorsque le mode est actif, vos nouveaux pas sont attribués au Legathon. La pause renvoie les pas vers le mode Journey tout en conservant votre progression.",

    how3:
      "Cet écran vérifie la progression enregistrée lorsqu'il est ouvert et lorsque l'application revient au premier plan.",

    retrySync: "Réessayer la synchronisation",

    completeAlert: "Legathon terminé !",
    completeAlertMessage:
      "{title} est terminé. Ouvrez ses détails pour consulter vos récompenses.",

    completeSaved:
      "Ce Legathon est terminé. Votre progression est enregistrée.",

    previousRequired:
      "Terminez le Legathon précédent pour déverrouiller ce défi.",

    couldNotFinish:
      "Impossible de terminer la session de marche.",

    couldNotRead:
      "Impossible de lire la session de marche.",

    couldNotSave:
      "La progression n'a pas pu être enregistrée. Réessayez.",

    couldNotActivate:
      "Le Legathon n'a pas pu être activé.",

    ownerMismatch:
      "La session a démarré, mais le propriétaire des pas ne correspond pas. Vérifiez que les derniers fichiers de session et du moteur sont enregistrés.",

    couldNotUpdate:
      "La session de marche n'a pas pu être mise à jour.",

    iphoneOnly:
      "Ce système de pas prend actuellement en charge l'iPhone. Android nécessite une source de comptage de pas compatible.",

    permission:
      "Activez l'accès Mouvement et forme pour cette application dans les réglages de l'iPhone.",

    unavailable:
      "Le podomètre n'est pas disponible. Essayez sur un iPhone physique.",

    accessibilityWcoin: "WCoin",
  },

  de: {
    back: "‹ Zurück",
    loading: "Deine Legathons werden geladen…",
    worldLegathons: "Welt-Legathons",
    intro:
      "Meistere weltweite Ausdauer-Walking-Challenges und baue dein Legathon-Vermächtnis auf.",

    modeActive: "Legathon-Modus aktiv",
    modePaused: "Legathon pausiert",
    modeReady: "Legathon-Modus bereit",

    activeMessage:
      "Neue Schritte zählen für {title}.",
    pausedMessage:
      "Dein Fortschritt ist gespeichert. Setze fort, wenn du bereit bist.",
    readyMessage:
      "Wähle eine freigeschaltete Challenge.",

    activeLegathon: "AKTIVER LEGATHON",
    pausedLegathon: "PAUSIERTER LEGATHON",
    nextLegathon: "NÄCHSTER LEGATHON",

    complete: "ABGESCHLOSSEN",
    steps: "Schritte",
    miles: "Meilen",
    remaining: "Verbleibend",

    completionRewards: "ABSCHLUSSBELOHNUNGEN",
    legathonPoints: "Legathon-Punkte",
    avatarXP: "Avatar-XP",

    continueLegathon: "Legathon fortsetzen",
    resumeLegathon: "Legathon fortsetzen",
    activateLegathon: "Legathon aktivieren",

    syncProgress: "Fortschritt synchronisieren",
    pauseLegathon: "Legathon pausieren",
    returnJourney: "Zum Journey-Modus zurück",

    lastSynced: "Zuletzt synchronisiert: {time}",

    allComplete: "Alle Legathons abgeschlossen!",
    noChallenge: "Keine Challenge verfügbar",
    savedChallenges:
      "Deine gespeicherten Challenges werden unten angezeigt.",

    completed: "Abgeschlossen",
    unlocked: "Freigeschaltet",
    wcoinsClaimed: "WCoins erhalten",

    totalPointsClaimed:
      "GESAMTE LEGATHON-PUNKTE",

    globalChallenges:
      "Globale Legathon-Challenges",

    challengeIntro:
      "Schließe jede freigeschaltete Challenge ab, um durch die globale Legathon-Serie voranzukommen.",

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
      "Im aktiven Modus zählen neue Schritte für deinen Legathon. Beim Pausieren werden Schritte wieder dem Journey-Modus zugeordnet und dein Marathon-Fortschritt bleibt erhalten.",

    how3:
      "Dieser Bildschirm prüft den gespeicherten Fortschritt, während er geöffnet ist und wenn die App wieder in den Vordergrund kommt.",

    retrySync: "Synchronisierung wiederholen",

    completeAlert: "Legathon abgeschlossen!",
    completeAlertMessage:
      "{title} ist abgeschlossen. Öffne die Details, um deine Belohnungen anzusehen.",

    completeSaved:
      "Dieser Legathon ist abgeschlossen. Dein Fortschritt ist gespeichert.",

    previousRequired:
      "Schließe den vorherigen Legathon ab, um diese Challenge freizuschalten.",

    couldNotFinish:
      "Die Walking-Sitzung konnte nicht abgeschlossen werden.",

    couldNotRead:
      "Die Walking-Sitzung konnte nicht gelesen werden.",

    couldNotSave:
      "Der Fortschritt konnte nicht gespeichert werden. Bitte versuche es erneut.",

    couldNotActivate:
      "Der Legathon konnte nicht aktiviert werden.",

    ownerMismatch:
      "Die Sitzung wurde gestartet, aber die Schrittzuordnung stimmt nicht überein. Prüfe, ob die neuesten Sitzungs- und Engine-Dateien gespeichert wurden.",

    couldNotUpdate:
      "Die Walking-Sitzung konnte nicht aktualisiert werden.",

    iphoneOnly:
      "Diese Schritt-Engine unterstützt derzeit das iPhone. Android benötigt eine kompatible Schrittquelle.",

    permission:
      "Aktiviere Bewegung & Fitness für diese App in den iPhone-Einstellungen.",

    unavailable:
      "Der Schrittzähler ist nicht verfügbar. Verwende ein physisches iPhone.",

    accessibilityWcoin: "WCoin",
  },

  pt: {
    back: "‹ Voltar",
    loading: "Carregando seus Legathons…",
    worldLegathons: "Legathons Mundiais",
    intro:
      "Complete desafios globais de resistência caminhando e construa seu legado Legathon.",

    modeActive: "Modo Legathon ativo",
    modePaused: "Legathon pausado",
    modeReady: "Modo Legathon pronto",

    activeMessage:
      "Novos passos contam para {title}.",
    pausedMessage:
      "Seu progresso está salvo. Continue quando estiver pronto.",
    readyMessage:
      "Escolha um desafio desbloqueado para começar.",

    activeLegathon: "LEGATHON ATIVO",
    pausedLegathon: "LEGATHON PAUSADO",
    nextLegathon: "PRÓXIMO LEGATHON",

    complete: "CONCLUÍDO",
    steps: "Passos",
    miles: "Milhas",
    remaining: "Restantes",

    completionRewards: "RECOMPENSAS",
    legathonPoints: "Pontos Legathon",
    avatarXP: "XP do Avatar",

    continueLegathon: "Continuar Legathon",
    resumeLegathon: "Retomar Legathon",
    activateLegathon: "Ativar Legathon",

    syncProgress: "Sincronizar progresso",
    pauseLegathon: "Pausar Legathon",
    returnJourney: "Voltar ao modo Journey",

    lastSynced: "Última sincronização: {time}",

    allComplete: "Todos os Legathons concluídos!",
    noChallenge: "Nenhum desafio disponível",
    savedChallenges:
      "Seus desafios salvos estão listados abaixo.",

    completed: "Concluídos",
    unlocked: "Desbloqueados",
    wcoinsClaimed: "WCoins resgatados",

    totalPointsClaimed:
      "TOTAL DE PONTOS LEGATHON RESGATADOS",

    globalChallenges:
      "Desafios Globais Legathon",

    challengeIntro:
      "Conclua cada desafio desbloqueado para avançar pela série global Legathon.",

    view: "Ver",
    locked: "Bloqueado",
    continue: "Continuar",
    resume: "Retomar",
    start: "Iniciar",

    rewardsClaimed: "Recompensas resgatadas",

    howItWorks: "Como funciona o modo Legathon",

    how1:
      "A ativação inicia um novo ponto de controle de passos. Leve seu telefone enquanto caminha.",

    how2:
      "Enquanto ativo, novos passos vão para o Legathon. Pausar retorna o direcionamento de passos ao modo Journey e mantém seu progresso.",

    how3:
      "Esta tela verifica o progresso salvo enquanto está aberta e quando o aplicativo retorna ao primeiro plano.",

    retrySync: "Tentar sincronizar novamente",

    completeAlert: "Legathon concluído!",
    completeAlertMessage:
      "{title} foi concluído. Abra os detalhes para revisar suas recompensas.",

    completeSaved:
      "Este Legathon foi concluído. Seu progresso está salvo.",

    previousRequired:
      "Conclua o Legathon anterior para desbloquear este desafio.",

    couldNotFinish:
      "Não foi possível finalizar a sessão de caminhada.",

    couldNotRead:
      "Não foi possível ler a sessão de caminhada.",

    couldNotSave:
      "O progresso não pôde ser salvo. Tente novamente.",

    couldNotActivate:
      "O Legathon não pôde ser ativado.",

    ownerMismatch:
      "A sessão foi iniciada, mas o proprietário dos passos não corresponde. Verifique se os arquivos mais recentes da sessão e do mecanismo foram salvos.",

    couldNotUpdate:
      "A sessão de caminhada não pôde ser atualizada.",

    iphoneOnly:
      "Este sistema de passos atualmente oferece suporte ao iPhone. Android precisa de uma fonte de contagem de passos compatível.",

    permission:
      "Ative Movimento e Fitness para este aplicativo nos Ajustes do iPhone.",

    unavailable:
      "O pedômetro não está disponível. Tente em um iPhone físico.",

    accessibilityWcoin: "WCoin",
  },

  ja: {
    back: "‹ 戻る",
    loading: "Legathonを読み込んでいます…",
    worldLegathons: "ワールド Legathon",
    intro:
      "世界の耐久ウォーキングチャレンジに挑戦し、Legathonの実績を築きましょう。",

    modeActive: "Legathonモード実行中",
    modePaused: "Legathon一時停止中",
    modeReady: "Legathonモード準備完了",

    activeMessage:
      "新しい歩数は{title}に加算されます。",
    pausedMessage:
      "進捗は保存されています。準備ができたら再開してください。",
    readyMessage:
      "アンロック済みのチャレンジを選択してください。",

    activeLegathon: "実行中のLEGATHON",
    pausedLegathon: "一時停止中のLEGATHON",
    nextLegathon: "次のLEGATHON",

    complete: "完了",
    steps: "歩数",
    miles: "マイル",
    remaining: "残り",

    completionRewards: "完了報酬",
    legathonPoints: "Legathonポイント",
    avatarXP: "アバターXP",

    continueLegathon: "Legathonを続ける",
    resumeLegathon: "Legathonを再開",
    activateLegathon: "Legathonを開始",

    syncProgress: "歩行進捗を同期",
    pauseLegathon: "Legathonを一時停止",
    returnJourney: "Journeyモードに戻る",

    lastSynced: "最終同期 {time}",

    allComplete: "すべてのLegathonを完了しました！",
    noChallenge: "利用可能なチャレンジがありません",
    savedChallenges:
      "保存されたチャレンジは以下に表示されます。",

    completed: "完了",
    unlocked: "アンロック",
    wcoinsClaimed: "獲得WCoins",

    totalPointsClaimed:
      "獲得済みLEGATHONポイント合計",

    globalChallenges:
      "グローバルLegathonチャレンジ",

    challengeIntro:
      "アンロックされたチャレンジを完了して、世界のLegathonシリーズを進みましょう。",

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
      "実行中の新しい歩数はLegathonに加算されます。一時停止すると歩数はJourneyモードに戻り、マラソンの進捗は保存されます。",

    how3:
      "この画面は、表示中およびアプリがフォアグラウンドに戻ったときに保存済みの歩行進捗を確認します。",

    retrySync: "同期を再試行",

    completeAlert: "Legathon完了！",
    completeAlertMessage:
      "{title}を完了しました。詳細を開いて報酬を確認してください。",

    completeSaved:
      "このLegathonは完了しています。進捗は保存されています。",

    previousRequired:
      "前のLegathonを完了すると、このチャレンジをアンロックできます。",

    couldNotFinish:
      "歩行セッションを完了できませんでした。",

    couldNotRead:
      "歩行セッションを読み込めませんでした。",

    couldNotSave:
      "歩行進捗を保存できませんでした。もう一度お試しください。",

    couldNotActivate:
      "Legathonを開始できませんでした。",

    ownerMismatch:
      "セッションは開始されましたが、歩数の割り当て先が一致しません。最新のセッションファイルとエンジンファイルが保存されているか確認してください。",

    couldNotUpdate:
      "歩行セッションを更新できませんでした。",

    iphoneOnly:
      "この歩数エンジンは現在iPhoneに対応しています。Androidでは互換性のある歩数データソースが必要です。",

    permission:
      "iPhoneの設定で、このアプリの「モーションとフィットネス」へのアクセスを有効にしてください。",

    unavailable:
      "歩数計を利用できません。実機のiPhoneでお試しください。",

    accessibilityWcoin: "WCoin",
  },

  ko: {
    back: "‹ 뒤로",
    loading: "Legathon을 불러오는 중…",
    worldLegathons: "월드 Legathon",
    intro:
      "세계적인 지구력 걷기 챌린지에 도전하고 Legathon 기록을 쌓으세요.",

    modeActive: "Legathon 모드 활성",
    modePaused: "Legathon 일시정지",
    modeReady: "Legathon 모드 준비",

    activeMessage:
      "새로운 걸음 수가 {title}에 반영됩니다.",
    pausedMessage:
      "진행 상황이 저장되었습니다. 준비되면 다시 시작하세요.",
    readyMessage:
      "잠금 해제된 챌린지를 선택해 시작하세요.",

    activeLegathon: "활성 LEGATHON",
    pausedLegathon: "일시정지 LEGATHON",
    nextLegathon: "다음 LEGATHON",

    complete: "완료",
    steps: "걸음",
    miles: "마일",
    remaining: "남음",

    completionRewards: "완료 보상",
    legathonPoints: "Legathon 포인트",
    avatarXP: "아바타 XP",

    continueLegathon: "Legathon 계속",
    resumeLegathon: "Legathon 재개",
    activateLegathon: "Legathon 시작",

    syncProgress: "걷기 진행 동기화",
    pauseLegathon: "Legathon 일시정지",
    returnJourney: "Journey 모드로 돌아가기",

    lastSynced: "마지막 동기화 {time}",

    allComplete: "모든 Legathon 완료!",
    noChallenge: "사용 가능한 챌린지가 없습니다",
    savedChallenges:
      "저장된 챌린지가 아래에 표시됩니다.",

    completed: "완료",
    unlocked: "잠금 해제",
    wcoinsClaimed: "획득 WCoins",

    totalPointsClaimed:
      "획득한 LEGATHON 포인트 합계",

    globalChallenges:
      "글로벌 Legathon 챌린지",

    challengeIntro:
      "잠금 해제된 챌린지를 완료하여 글로벌 Legathon 시리즈를 진행하세요.",

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
      "활성 상태에서는 새 걸음이 Legathon에 반영됩니다. 일시정지하면 걸음 경로가 Journey 모드로 돌아가며 마라톤 진행 상황은 유지됩니다.",

    how3:
      "이 화면은 열려 있는 동안과 앱이 다시 활성화될 때 저장된 걷기 진행 상황을 확인합니다.",

    retrySync: "동기화 다시 시도",

    completeAlert: "Legathon 완료!",
    completeAlertMessage:
      "{title}을 완료했습니다. 세부 정보를 열어 보상을 확인하세요.",

    completeSaved:
      "이 Legathon은 완료되었습니다. 진행 상황이 저장되었습니다.",

    previousRequired:
      "이 챌린지를 잠금 해제하려면 이전 Legathon을 완료하세요.",

    couldNotFinish:
      "걷기 세션을 완료할 수 없습니다.",

    couldNotRead:
      "걷기 세션을 읽을 수 없습니다.",

    couldNotSave:
      "걷기 진행 상황을 저장할 수 없습니다. 다시 시도하세요.",

    couldNotActivate:
      "Legathon을 활성화할 수 없습니다.",

    ownerMismatch:
      "세션은 시작되었지만 걸음 소유자가 일치하지 않습니다. 최신 세션 및 엔진 파일이 모두 저장되어 있는지 확인하세요.",

    couldNotUpdate:
      "걷기 세션을 업데이트할 수 없습니다.",

    iphoneOnly:
      "이 걸음 엔진은 현재 iPhone을 지원합니다. Android에는 호환되는 걸음 수 데이터 소스가 필요합니다.",

    permission:
      "iPhone 설정에서 이 앱의 동작 및 피트니스 접근 권한을 활성화하세요.",

    unavailable:
      "만보계를 사용할 수 없습니다. 실제 iPhone에서 사용해 보세요.",

    accessibilityWcoin: "WCoin",
  },

  zh: {
    back: "‹ 返回",
    loading: "正在加载你的 Legathon…",
    worldLegathons: "世界 Legathon",
    intro:
      "完成全球耐力步行挑战，建立你的 Legathon 成就。",

    modeActive: "Legathon 模式已开启",
    modePaused: "Legathon 已暂停",
    modeReady: "Legathon 模式已准备",

    activeMessage:
      "新的步数将计入 {title}。",
    pausedMessage:
      "你的进度已保存。准备好后即可继续。",
    readyMessage:
      "选择一个已解锁的挑战开始。",

    activeLegathon: "当前 LEGATHON",
    pausedLegathon: "已暂停 LEGATHON",
    nextLegathon: "下一个 LEGATHON",

    complete: "完成",
    steps: "步数",
    miles: "英里",
    remaining: "剩余",

    completionRewards: "完成奖励",
    legathonPoints: "Legathon 积分",
    avatarXP: "虚拟形象 XP",

    continueLegathon: "继续 Legathon",
    resumeLegathon: "恢复 Legathon",
    activateLegathon: "开始 Legathon",

    syncProgress: "同步步行进度",
    pauseLegathon: "暂停 Legathon",
    returnJourney: "返回 Journey 模式",

    lastSynced: "最后同步：{time}",

    allComplete: "所有 Legathon 已完成！",
    noChallenge: "没有可用挑战",
    savedChallenges:
      "你保存的挑战显示在下方。",

    completed: "已完成",
    unlocked: "已解锁",
    wcoinsClaimed: "已领取 WCoins",

    totalPointsClaimed:
      "已领取 LEGATHON 积分总数",

    globalChallenges:
      "全球 Legathon 挑战",

    challengeIntro:
      "完成每个已解锁的挑战，继续推进全球 Legathon 系列。",

    view: "查看",
    locked: "已锁定",
    continue: "继续",
    resume: "恢复",
    start: "开始",

    rewardsClaimed: "奖励已领取",

    howItWorks: "Legathon 模式如何运作",

    how1:
      "激活后会建立新的步数检查点。步行时请随身携带手机。",

    how2:
      "模式开启时，新步数会计入 Legathon。暂停后，步数会重新计入 Journey 模式，同时保留马拉松进度。",

    how3:
      "此页面在打开时以及应用重新回到前台时检查已保存的步行进度。",

    retrySync: "重新同步",

    completeAlert: "Legathon 完成！",
    completeAlertMessage:
      "{title} 已完成。打开详情查看你的奖励。",

    completeSaved:
      "此 Legathon 已完成。你的进度已保存。",

    previousRequired:
      "完成上一个 Legathon 即可解锁此挑战。",

    couldNotFinish:
      "无法完成步行会话。",

    couldNotRead:
      "无法读取步行会话。",

    couldNotSave:
      "无法保存步行进度。请重试。",

    couldNotActivate:
      "无法激活 Legathon。",

    ownerMismatch:
      "会话已启动，但步数归属不匹配。请确认最新的会话和引擎文件均已保存。",

    couldNotUpdate:
      "无法更新步行会话。",

    iphoneOnly:
      "此步数引擎目前支持 iPhone。Android 需要兼容的步数来源。",

    permission:
      "请在 iPhone 设置中为此应用启用“运动与健身”权限，然后重试。",

    unavailable:
      "计步器不可用。请在实体 iPhone 上尝试。",

    accessibilityWcoin: "WCoin",
  },

  it: {
    back: "‹ Indietro",
    loading: "Caricamento dei tuoi Legathon…",
    worldLegathons: "Legathon Mondiali",
    intro:
      "Affronta sfide globali di resistenza a piedi e costruisci il tuo percorso Legathon.",

    modeActive: "Modalità Legathon attiva",
    modePaused: "Legathon in pausa",
    modeReady: "Modalità Legathon pronta",

    activeMessage:
      "I nuovi passi vengono conteggiati per {title}.",
    pausedMessage:
      "I tuoi progressi sono salvati. Riprendi quando sei pronto.",
    readyMessage:
      "Scegli una sfida sbloccata per iniziare.",

    activeLegathon: "LEGATHON ATTIVO",
    pausedLegathon: "LEGATHON IN PAUSA",
    nextLegathon: "PROSSIMO LEGATHON",

    complete: "COMPLETATO",
    steps: "Passi",
    miles: "Miglia",
    remaining: "Rimanenti",

    completionRewards: "RICOMPENSE",
    legathonPoints: "Punti Legathon",
    avatarXP: "XP Avatar",

    continueLegathon: "Continua Legathon",
    resumeLegathon: "Riprendi Legathon",
    activateLegathon: "Attiva Legathon",

    syncProgress: "Sincronizza progressi",
    pauseLegathon: "Metti in pausa",
    returnJourney: "Torna alla modalità Journey",

    lastSynced: "Ultima sincronizzazione: {time}",

    allComplete: "Tutti i Legathon completati!",
    noChallenge: "Nessuna sfida disponibile",
    savedChallenges:
      "Le tue sfide salvate sono elencate qui sotto.",

    completed: "Completati",
    unlocked: "Sbloccati",
    wcoinsClaimed: "WCoins riscattati",

    totalPointsClaimed:
      "PUNTI LEGATHON TOTALI RISCATTATI",

    globalChallenges:
      "Sfide Legathon Globali",

    challengeIntro:
      "Completa ogni sfida sbloccata per avanzare nella serie globale Legathon.",

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
      "Quando è attiva, i nuovi passi vanno al tuo Legathon. La pausa riporta i passi alla modalità Journey e conserva i progressi della maratona.",

    how3:
      "Questa schermata controlla i progressi salvati mentre è aperta e quando l'app torna in primo piano.",

    retrySync: "Riprova sincronizzazione",

    completeAlert: "Legathon completato!",
    completeAlertMessage:
      "{title} è completato. Apri i dettagli per vedere le ricompense.",

    completeSaved:
      "Questo Legathon è completato. I tuoi progressi sono salvati.",

    previousRequired:
      "Completa il Legathon precedente per sbloccare questa sfida.",

    couldNotFinish:
      "Impossibile completare la sessione di camminata.",

    couldNotRead:
      "Impossibile leggere la sessione di camminata.",

    couldNotSave:
      "Impossibile salvare i progressi. Riprova.",

    couldNotActivate:
      "Impossibile attivare il Legathon.",

    ownerMismatch:
      "La sessione è iniziata, ma il proprietario dei passi non corrisponde. Controlla che i file più recenti della sessione e del motore siano salvati.",

    couldNotUpdate:
      "Impossibile aggiornare la sessione di camminata.",

    iphoneOnly:
      "Questo sistema di passi attualmente supporta iPhone. Android richiede una fonte di conteggio passi compatibile.",

    permission:
      "Abilita Movimento e fitness per questa app nelle Impostazioni dell'iPhone.",

    unavailable:
      "Il pedometro non è disponibile. Prova su un iPhone fisico.",

    accessibilityWcoin: "WCoin",
  },

  ar: {
    back: "رجوع ›",
    loading: "جارٍ تحميل Legathons…",
    worldLegathons: "Legathons العالمية",
    intro:
      "شارك في تحديات المشي العالمية وابنِ إنجازاتك في Legathon.",

    modeActive: "وضع Legathon نشط",
    modePaused: "Legathon متوقف مؤقتًا",
    modeReady: "وضع Legathon جاهز",

    activeMessage:
      "تُحتسب خطواتك الجديدة ضمن {title}.",
    pausedMessage:
      "تم حفظ تقدمك. استأنف عندما تكون جاهزًا.",
    readyMessage:
      "اختر تحديًا مفتوحًا للبدء.",

    activeLegathon: "LEGATHON النشط",
    pausedLegathon: "LEGATHON المتوقف",
    nextLegathon: "LEGATHON التالي",

    complete: "مكتمل",
    steps: "الخطوات",
    miles: "الأميال",
    remaining: "المتبقي",

    completionRewards: "مكافآت الإكمال",
    legathonPoints: "نقاط Legathon",
    avatarXP: "XP للشخصية",

    continueLegathon: "متابعة Legathon",
    resumeLegathon: "استئناف Legathon",
    activateLegathon: "بدء Legathon",

    syncProgress: "مزامنة تقدم المشي",
    pauseLegathon: "إيقاف Legathon مؤقتًا",
    returnJourney: "العودة إلى وضع Journey",

    lastSynced: "آخر مزامنة: {time}",

    allComplete: "تم إكمال جميع Legathons!",
    noChallenge: "لا يوجد تحدٍ متاح",
    savedChallenges:
      "تظهر تحدياتك المحفوظة أدناه.",

    completed: "المكتملة",
    unlocked: "المفتوحة",
    wcoinsClaimed: "WCoins المستلمة",

    totalPointsClaimed:
      "إجمالي نقاط LEGATHON المستلمة",

    globalChallenges:
      "تحديات Legathon العالمية",

    challengeIntro:
      "أكمل كل تحدٍ مفتوح للتقدم عبر سلسلة Legathon العالمية.",

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
      "أثناء النشاط، تُضاف الخطوات الجديدة إلى Legathon. عند الإيقاف المؤقت تعود الخطوات إلى وضع Journey مع الاحتفاظ بتقدم الماراثون.",

    how3:
      "تتحقق هذه الشاشة من تقدم المشي المحفوظ أثناء فتحها وعندما يعود التطبيق إلى الواجهة.",

    retrySync: "إعادة محاولة المزامنة",

    completeAlert: "اكتمل Legathon!",
    completeAlertMessage:
      "تم إكمال {title}. افتح التفاصيل لمراجعة مكافآتك.",

    completeSaved:
      "تم إكمال هذا Legathon وحفظ تقدمك.",

    previousRequired:
      "أكمل Legathon السابق لفتح هذا التحدي.",

    couldNotFinish:
      "تعذر إنهاء جلسة المشي.",

    couldNotRead:
      "تعذر قراءة جلسة المشي.",

    couldNotSave:
      "تعذر حفظ تقدم المشي. حاول مرة أخرى.",

    couldNotActivate:
      "تعذر تفعيل Legathon.",

    ownerMismatch:
      "بدأت الجلسة ولكن وجهة الخطوات لا تتطابق. تحقق من حفظ أحدث ملفات الجلسة ومحرك الخطوات.",

    couldNotUpdate:
      "تعذر تحديث جلسة المشي.",

    iphoneOnly:
      "محرك الخطوات هذا يدعم iPhone حاليًا. يحتاج Android إلى مصدر متوافق لعد الخطوات.",

    permission:
      "فعّل إذن الحركة واللياقة لهذا التطبيق من إعدادات iPhone ثم حاول مرة أخرى.",

    unavailable:
      "عداد الخطوات غير متاح. جرّب على جهاز iPhone فعلي.",

    accessibilityWcoin: "WCoin",
  },
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================

function normalizeLanguage(language) {
  const normalized = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[normalized] ? normalized : "en";
}

function fillTemplate(value, variables = {}) {
  return String(value || "").replace(
    /\{(\w+)\}/g,
    (_, key) =>
      variables[key] !== undefined
        ? String(variables[key])
        : ""
  );
}

// ============================================================
// PROGRESS HELPERS
// ============================================================

function getProgress(marathon, progressMap) {
  const saved = progressMap?.[marathon.id] || {};

  const totalSteps =
    safeNumber(saved.totalSteps) ||
    safeNumber(marathon.totalSteps) ||
    safeNumber(MARATHON_TOTAL_STEPS) ||
    52400;

  const steps = Math.min(
    totalSteps,
    safeNumber(saved.steps)
  );

  const completed =
    saved.completed === true || steps >= totalSteps;

  return {
    ...saved,
    steps,
    totalSteps,
    completed,

    unlocked:
      completed ||
      saved.unlocked === true ||
      marathon.unlockedByDefault === true,

    percent: completed
      ? 100
      : Math.min(100, (steps / totalSteps) * 100),
  };
}

function createResultError(result, fallback) {
  const error =
    result?.error || result?.result?.error;

  const message =
    error?.message ||
    (error ? String(error) : result?.reason) ||
    fallback;

  return new Error(message);
}

function isMarathonActive(state, marathonId) {
  return Boolean(
    marathonId &&
      state.activeId === marathonId &&
      state.session?.marathonId === marathonId &&
      state.session?.active === true &&
      state.session?.status === "active" &&
      state.session?.ownsStepRouting === true &&
      state.owner?.owner === "marathon" &&
      state.owner?.marathonId === marathonId
  );
}

// ============================================================
// MARATHON SCREEN
// ============================================================

export default function MarathonScreen({
  language = "en",
  goBack,
  goToWorldMarathonDetail,
}) {
  const languageCode = normalizeLanguage(language);
  const isRTL = languageCode === "ar";

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

  const [screenState, setScreenState] = useState({
    progressMap: {},
    activeId: null,
    session: null,
    owner: null,
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSync, setLastSync] = useState(null);

  const mountedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const operationQueueRef = useRef(Promise.resolve());
  const pendingOperationsRef = useRef(0);
  const completionAlertsRef = useRef(new Set());

  // ==========================================================
  // SERIALIZE OPERATIONS
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
        operationQueueRef.current.then(async () => {
          if (!mountedRef.current) return;

          try {
            await operation();

            if (mountedRef.current) {
              setErrorMessage("");
            }
          } catch (error) {
            const message =
              error?.message || String(error);

            console.error(
              "MarathonScreen operation error:",
              error
            );

            if (mountedRef.current) {
              setErrorMessage(message);

              if (showErrorAlert) {
                Alert.alert("Legathon", message);
              }
            }
          } finally {
            if (mountedRef.current) {
              setLoading(false);
            }
          }
        });

      operationQueueRef.current =
        queuedOperation.catch(() => {});

      return queuedOperation.finally(() => {
        pendingOperationsRef.current -= 1;

        if (mountedRef.current) {
          setBusy(pendingOperationsRef.current > 0);
        }
      });
    },
    []
  );

  // ==========================================================
  // LOAD SAVED STATE
  // ==========================================================

  const refreshMarathonState = useCallback(async () => {
    const progressMap =
      await loadMarathonProgressMap();

    let session =
      await loadLegathonSession();

    const sessionMarathon =
      MARATHON_CATALOG.find(
        (marathon) =>
          marathon.id === session?.marathonId
      );

    if (
      sessionMarathon &&
      session.status !== "completed" &&
      getProgress(
        sessionMarathon,
        progressMap
      ).completed
    ) {
      const result =
        await completeLegathonSession(
          sessionMarathon.id
        );

      if (result?.completed !== true) {
        throw createResultError(
          result,
          t("couldNotFinish")
        );
      }

      session = await loadLegathonSession();
    }

    const activeMarathon =
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
        activeMarathon?.marathonId ||
        activeMarathon?.id ||
        activeMarathon?.marathon?.id ||
        null,
    };

    if (mountedRef.current) {
      setScreenState(nextState);
    }

    return nextState;
  }, [t]);

  // ==========================================================
  // SYNC PHYSICAL STEPS
  // ==========================================================

  const syncWalkingProgress = useCallback(async () => {
    await refreshMarathonState();
    await requirePedometer();

    const result = await syncTodaySteps();

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
      await refreshMarathonState();

    if (mountedRef.current) {
      setLastSync(new Date());
    }

    if (result.completedNow === true) {
      const completedId =
        result.marathonId ||
        result.marathon?.id;

      const completedMarathon =
        MARATHON_CATALOG.find(
          (marathon) =>
            marathon.id === completedId
        );

      if (
        completedMarathon &&
        getProgress(
          completedMarathon,
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
            title: completedMarathon.title,
          })
        );
      }
    }

    return nextState;
  }, [
    refreshMarathonState,
    requirePedometer,
    t,
  ]);

  // ==========================================================
  // INITIAL LOAD + AUTO SYNC
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;
    appStateRef.current = AppState.currentState;

    void runOperation(syncWalkingProgress);

    const interval = setInterval(() => {
      if (appStateRef.current === "active") {
        void runOperation(syncWalkingProgress);
      }
    }, SYNC_INTERVAL_MS);

    const subscription =
      AppState.addEventListener(
        "change",
        (nextAppState) => {
          const previousAppState =
            appStateRef.current;

          appStateRef.current = nextAppState;

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
    syncWalkingProgress,
  ]);

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const openMarathonDetails = useCallback(
    (marathonId) => {
      if (
        typeof goToWorldMarathonDetail ===
        "function"
      ) {
        goToWorldMarathonDetail(marathonId);
      }
    },
    [goToWorldMarathonDetail]
  );

  // ==========================================================
  // START / RESUME / OPEN
  // ==========================================================

  const handleOpenMarathon = useCallback(
    (marathon) => {
      void runOperation(async () => {
        const currentState =
          await refreshMarathonState();

        const progress = getProgress(
          marathon,
          currentState.progressMap
        );

        if (progress.completed) {
          if (
            typeof goToWorldMarathonDetail ===
            "function"
          ) {
            openMarathonDetails(marathon.id);
          } else {
            Alert.alert(
              marathon.title,
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
          !isMarathonActive(
            currentState,
            marathon.id
          )
        ) {
          const shouldResume =
            currentState.activeId === marathon.id &&
            currentState.session?.marathonId ===
              marathon.id &&
            currentState.session?.status ===
              "paused";

          const result = shouldResume
            ? await resumeLegathon()
            : await startLegathon(marathon.id);

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
            !isMarathonActive(
              updatedState,
              marathon.id
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
          openMarathonDetails(marathon.id);
        }
      }, true);
    },
    [
      runOperation,
      refreshMarathonState,
      syncWalkingProgress,
      openMarathonDetails,
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
      void runOperation(async () => {
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
      }, true);
    },
    [
      runOperation,
      syncWalkingProgress,
      t,
    ]
  );

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const marathonRows = useMemo(
    () =>
      MARATHON_CATALOG.map((marathon) => ({
        marathon,
        progress: getProgress(
          marathon,
          screenState.progressMap
        ),
      })),
    [screenState.progressMap]
  );

  const selectedMarathon =
    marathonRows.find(
      (row) =>
        row.marathon.id === screenState.activeId
    ) ||
    marathonRows.find(
      (row) =>
        row.progress.unlocked &&
        !row.progress.completed
    );

  const modeActive = selectedMarathon
    ? isMarathonActive(
        screenState,
        selectedMarathon.marathon.id
      )
    : false;

  const modePaused = Boolean(
    selectedMarathon &&
      screenState.session?.status === "paused" &&
      screenState.session?.marathonId ===
        selectedMarathon.marathon.id
  );

  const completedCount = marathonRows.filter(
    (row) => row.progress.completed
  ).length;

  const unlockedCount = marathonRows.filter(
    (row) => row.progress.unlocked
  ).length;

  const claimedMarathons = marathonRows.filter(
    (row) =>
      row.progress.rewardClaimed === true
  );

  const claimedCoins =
    claimedMarathons.reduce(
      (total, row) =>
        total +
        safeNumber(
          row.marathon.rewardCoins
        ),
      0
    );

  const claimedPoints =
    claimedMarathons.reduce(
      (total, row) =>
        total +
        safeNumber(
          row.marathon.rewardPoints
        ),
      0
    );

  // ==========================================================
  // LOADING
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
  // RENDER
  // ==========================================================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
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
                    selectedMarathon?.marathon
                      ?.title || "",
                })
              : modePaused
              ? t("pausedMessage")
              : t("readyMessage")}
          </Text>
        </View>

        {selectedMarathon ? (
          <View
            style={[
              styles.card,
              styles.heroCard,
            ]}
          >
            <View style={styles.row}>
              <Text style={styles.heroFlag}>
                {selectedMarathon.marathon.flag}
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
                  {
                    selectedMarathon.marathon
                      .title
                  }
                </Text>

                <Text
                  style={[
                    styles.bodyText,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {
                    selectedMarathon.marathon
                      .city
                  }
                  ,{" "}
                  {
                    selectedMarathon.marathon
                      .country
                  }
                </Text>
              </View>
            </View>

            <View style={styles.percentCircle}>
              <Text style={styles.percentValue}>
                {Math.floor(
                  selectedMarathon.progress
                    .percent
                )}
                %
              </Text>

              <Text
                style={[
                  styles.label,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("complete")}
              </Text>
            </View>

            <ProgressBar
              percent={
                selectedMarathon.progress
                  .percent
              }
            />

            <View style={styles.metricsRow}>
              <MetricCard
                value={formatNumber(
                  selectedMarathon.progress
                    .steps,
                  languageCode
                )}
                label={t("steps")}
              />

              <MetricCard
                value={(
                  selectedMarathon.progress
                    .steps /
                  STEPS_IN_ONE_MILE
                ).toFixed(2)}
                label={t("miles")}
              />

              <MetricCard
                value={formatNumber(
                  selectedMarathon.progress
                    .totalSteps -
                    selectedMarathon.progress
                      .steps,
                  languageCode
                )}
                label={t("remaining")}
              />
            </View>

            <Text style={styles.centerText}>
              {formatNumber(
                selectedMarathon.progress.steps,
                languageCode
              )}{" "}
              /{" "}
              {formatNumber(
                selectedMarathon.progress
                  .totalSteps,
                languageCode
              )}{" "}
              {t("steps")}
            </Text>

            <Text style={styles.centerText}>
              {(
                selectedMarathon.progress.steps /
                STEPS_IN_ONE_MILE
              ).toFixed(2)}{" "}
              /{" "}
              {(
                selectedMarathon.progress
                  .totalSteps /
                STEPS_IN_ONE_MILE
              ).toFixed(2)}{" "}
              {t("miles")}
            </Text>

            <View style={styles.rewardsCard}>
              <Text
                style={[
                  styles.label,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("completionRewards")}
              </Text>

              <View style={styles.wcoinRewardRow}>
                <Image
                  source={WCOIN_IMAGE}
                  style={styles.wcoinHeroIcon}
                  resizeMode="contain"
                  accessibilityLabel={t(
                    "accessibilityWcoin"
                  )}
                />

                <Text style={styles.wcoinHeroText}>
                  {formatNumber(
                    selectedMarathon.marathon
                      .rewardCoins,
                    languageCode
                  )}{" "}
                  WCoins
                </Text>
              </View>

              <Text style={styles.bodyText}>
                ⭐{" "}
                {formatNumber(
                  selectedMarathon.marathon
                    .rewardPoints,
                  languageCode
                )}{" "}
                {t("legathonPoints")}
              </Text>

              <Text style={styles.bodyText}>
                ✨{" "}
                {formatNumber(
                  selectedMarathon.marathon
                    .avatarXP,
                  languageCode
                )}{" "}
                {t("avatarXP")}
              </Text>
            </View>

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
                handleOpenMarathon(
                  selectedMarathon.marathon
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
                  time:
                    lastSync.toLocaleTimeString(
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
                marathonRows.length &&
              marathonRows.length > 0
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
            ⭐{" "}
            {formatNumber(
              claimedPoints,
              languageCode
            )}
          </Text>
        </View>

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

        {marathonRows.map(
          ({ marathon, progress }) => {
            const isRunning =
              isMarathonActive(
                screenState,
                marathon.id
              );

            const isPaused =
              screenState.session?.status ===
                "paused" &&
              screenState.session?.marathonId ===
                marathon.id;

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
                key={marathon.id}
                accessibilityRole="button"
                accessibilityLabel={`${marathon.title}, ${statusLabel}`}
                disabled={busy}
                onPress={() =>
                  handleOpenMarathon(marathon)
                }
                style={[
                  styles.card,
                  styles.row,
                  isRunning &&
                    styles.activeCard,
                  !progress.unlocked &&
                    styles.lockedCard,
                ]}
              >
                <Text style={styles.cardFlag}>
                  {marathon.flag}
                </Text>

                <View style={styles.flex}>
                  <Text style={styles.cardTitle}>
                    {marathon.title}
                  </Text>

                  <Text style={styles.smallText}>
                    {marathon.city},{" "}
                    {marathon.country}
                  </Text>

                  <Text style={styles.smallText}>
                    {(
                      progress.steps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}{" "}
                    /{" "}
                    {(
                      progress.totalSteps /
                      STEPS_IN_ONE_MILE
                    ).toFixed(2)}{" "}
                    {t("miles")}
                  </Text>

                  <View
                    style={styles.wcoinListRow}
                  >
                    <Image
                      source={WCOIN_IMAGE}
                      style={styles.wcoinListIcon}
                      resizeMode="contain"
                      accessibilityLabel={t(
                        "accessibilityWcoin"
                      )}
                    />

                    <Text
                      style={styles.rewardText}
                    >
                      {formatNumber(
                        marathon.rewardCoins,
                        languageCode
                      )}{" "}
                      WCoins
                    </Text>
                  </View>

                  <ProgressBar
                    percent={progress.percent}
                  />

                  {progress.completed && (
                    <Text
                      style={styles.successText}
                    >
                      {t("completed")}
                      {progress.rewardClaimed
                        ? ` • ${t(
                            "rewardsClaimed"
                          )}`
                        : ""}
                    </Text>
                  )}
                </View>

                <Text
                  style={styles.statusText}
                >
                  {statusLabel}
                </Text>
              </TouchableOpacity>
            );
          }
        )}

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
// REUSABLE COMPONENTS
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
      onPress={onPress}
      disabled={disabled}
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
        adjustsFontSizeToFit
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ProgressBar({ percent }) {
  const width = Math.min(
    100,
    safeNumber(percent)
  );

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${width}%`,
          },
        ]}
      />
    </View>
  );
}

function MetricCard({
  value,
  label,
  wcoin = false,
}) {
  return (
    <View style={styles.metricCard}>
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
      >
        {value}
      </Text>

      <Text
        style={styles.metricLabel}
        numberOfLines={2}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#02060D",
  },

  content: {
    padding: 20,
    paddingBottom: 140,
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
    padding: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },

  bodyText: {
    color: "#A7B2C5",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#0B1422",
    borderWidth: 1,
    borderColor: "#283447",
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

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },

  label: {
    color: "#9EACC0",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
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
    color: "#FFFFFF",
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

  metricsRow: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginTop: 18,
  },

  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 17,
    paddingHorizontal: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#283447",
    backgroundColor: "#0B1422",
    alignItems: "center",
  },

  metricValue: {
    color: GOLD,
    fontSize: 27,
    fontWeight: "900",
  },

  metricLabel: {
    color: "#A7B2C5",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 7,
  },

  centerText: {
    color: "#A7B2C5",
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
  },

  rewardsCard: {
    backgroundColor: "#111D2E",
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

  wcoinMetricIcon: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },

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

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 28,
  },

  cardFlag: {
    fontSize: 32,
    marginRight: 12,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  smallText: {
    color: "#A7B2C5",
    fontSize: 13,
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
  },

  lockedCard: {
    opacity: 0.55,
  },

  successText: {
    color: "#75D5A5",
    fontSize: 12,
    marginTop: 8,
  },

  errorCard: {
    backgroundColor: "#291922",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },

  errorText: {
    color: "#FFD0D0",
    fontSize: 14,
    lineHeight: 21,
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});