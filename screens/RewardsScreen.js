// screens/RewardsScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getWCoins } from "../utils/wcoinStorage";

import {
  getJourneyLifetimeSteps,
} from "../utils/stepTrackingEngine";

import useLegathonPoints from "../hooks/useLegathonPoints";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// ASSETS
// ============================================================

const WCOIN_IMAGE =
  require("../assets/wcoin.png");

// ============================================================
// TRACKSUITS
// ============================================================
//
// Keep these names/IDs internally in English.
// Only the visible name is translated.
//
// These are cumulative Journey Lifetime Step milestones.
//
// Blue:              150,000
// Green:             400,000
// Red:               750,000
// Yellow:          1,250,000
// Black & Gold:    4,250,000
//
// ============================================================

const TRACKSUITS = [
  {
    id: "blue",
    level: 1,
    name: "Blue",
    unlockAt: 150000,
    icon: "🔵",
  },

  {
    id: "green",
    level: 2,
    name: "Green",
    unlockAt: 400000,
    icon: "🟢",
  },

  {
    id: "red",
    level: 3,
    name: "Red",
    unlockAt: 750000,
    icon: "🔴",
  },

  {
    id: "yellow",
    level: 4,
    name: "Yellow",
    unlockAt: 1250000,
    icon: "🟡",
  },

  {
    id: "elite",
    level: 5,
    name: "Black & Gold Elite",
    unlockAt: 4250000,
    icon: "👑",
  },
];

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  background: "#020711",
  card: "#081526",
  cardSoft: "#0C1A2C",
  cardDeep: "#06101D",
  gold: "#F4C126",
  goldDark: "#8F6B13",
  white: "#FFFFFF",
  text: "#D7DFEB",
  muted: "#9EABC0",
  mutedDark: "#66758B",
  aqua: "#78F1D0",
  green: "#67E0A7",
  greenDark: "#123B2D",
  border: "#29415F",
};

// ============================================================
// TRANSLATIONS
// ============================================================

const REWARDS_TEXT = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    back: "Back",

    rewards: "Rewards",

    pageSubtitle:
      "Your walking milestones, earned currency, points and tracksuit progression.",

    rewardDashboard:
      "YOUR REWARD DASHBOARD",

    yourBalances:
      "Your Balances",

    journeyLifetimeSteps:
      "JOURNEY LIFETIME STEPS",

    tracksuitProgressionSteps:
      "Tracksuit progression steps",

    wcoins:
      "WCOINS",

    openWallet:
      "Open Wallet ›",

    legathonPoints:
      "LEGATHON POINTS",

    viewRank:
      "View Rank ›",

    legathonRank:
      "LEGATHON RANK",

    next:
      "Next: {rank}",

    pointsRemaining:
      "{count} points remaining",

    maximumRank:
      "Maximum rank reached",

    currentTracksuit:
      "CURRENT TRACKSUIT MILESTONE",

    level:
      "LEVEL {level} / 5",

    journeyLifetimeStepsTitle:
      "Journey Lifetime Steps",

    nextTracksuit:
      "NEXT TRACKSUIT",

    stepsRemaining:
      "{count} steps remaining",

    unlocksAt:
      "Unlocks at {count} Journey Lifetime Steps",

    allTracksuits:
      "👑 ALL TRACKSUITS UNLOCKED",

    completeCollection:
      "You reached the complete tracksuit milestone collection.",

    refreshRewards:
      "Refresh Rewards",

    avatarRewards:
      "AVATAR REWARDS",

    tracksuitUnlocks:
      "Tracksuit Unlocks",

    tracksuitDescription:
      "Tracksuits unlock from Journey Lifetime Steps. Once a suit is earned, it stays available and you choose which unlocked outfit your avatar wears in Avatar Center.",

    tracksuitSteps:
      "{count} Journey Lifetime Steps",

    unlocked:
      "UNLOCKED",

    nextStatus:
      "NEXT",

    locked:
      "LOCKED",

    rewardCenter:
      "REWARD CENTER",

    exploreRewards:
      "Explore Rewards",

    achievements:
      "Achievements",

    achievementDescription:
      "View milestones and earned badges",

    wcoinWallet:
      "WCoin Wallet",

    walletDescription:
      "Open your wallet and rewards balance",

    points:
      "Points",

    howRewardsWork:
      "How Rewards Work",

    walkJourneys:
      "Walk Journeys",

    walkJourneysBody:
      "Journey walking adds to your Journey Lifetime Steps. Marathon steps stay separate.",

    unlockTracksuits:
      "Unlock Tracksuits",

    unlockTracksuitsBody:
      "Reach each Journey Lifetime Step milestone to permanently unlock that tracksuit.",

    chooseOutfit:
      "Choose Your Outfit",

    chooseOutfitBody:
      "Unlocking a new tracksuit does not force you to wear it. Choose any earned tracksuit in Avatar Center.",

    earnCoinsPoints:
      "Earn WCoins & Points",

    earnCoinsPointsBody:
      "WCoins and Legathon Points are separate reward systems and are shown above with your latest stored totals.",

    standard:
      "Standard",

    allUnlocked:
      "All Tracksuits Unlocked",

    blue:
      "Blue",

    green:
      "Green",

    red:
      "Red",

    yellow:
      "Yellow",

    blackGoldElite:
      "Black & Gold Elite",

    newWalker:
      "New Walker",

    explorer:
      "Explorer",

    pathfinder:
      "Pathfinder",

    trailblazer:
      "Trailblazer",

    adventurer:
      "Adventurer",

    legend:
      "Legend",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    back: "Atrás",

    rewards: "Recompensas",

    pageSubtitle:
      "Tus logros de caminata, moneda ganada, puntos y progreso de conjuntos deportivos.",

    rewardDashboard:
      "TU PANEL DE RECOMPENSAS",

    yourBalances:
      "Tus Saldos",

    journeyLifetimeSteps:
      "PASOS TOTALES DE VIAJES",

    tracksuitProgressionSteps:
      "Pasos para progresar en conjuntos",

    wcoins:
      "WCOINS",

    openWallet:
      "Abrir Billetera ›",

    legathonPoints:
      "PUNTOS LEGATHON",

    viewRank:
      "Ver Rango ›",

    legathonRank:
      "RANGO LEGATHON",

    next:
      "Siguiente: {rank}",

    pointsRemaining:
      "Faltan {count} puntos",

    maximumRank:
      "Rango máximo alcanzado",

    currentTracksuit:
      "LOGRO ACTUAL DE CONJUNTO",

    level:
      "NIVEL {level} / 5",

    journeyLifetimeStepsTitle:
      "Pasos Totales de Viajes",

    nextTracksuit:
      "SIGUIENTE CONJUNTO",

    stepsRemaining:
      "Faltan {count} pasos",

    unlocksAt:
      "Se desbloquea a los {count} Pasos Totales de Viajes",

    allTracksuits:
      "👑 TODOS LOS CONJUNTOS DESBLOQUEADOS",

    completeCollection:
      "Has alcanzado toda la colección de conjuntos.",

    refreshRewards:
      "Actualizar Recompensas",

    avatarRewards:
      "RECOMPENSAS DEL AVATAR",

    tracksuitUnlocks:
      "Conjuntos Desbloqueables",

    tracksuitDescription:
      "Los conjuntos se desbloquean con los Pasos Totales de Viajes. Una vez ganado un conjunto, permanece disponible y puedes elegir cuál usar en el Centro de Avatar.",

    tracksuitSteps:
      "{count} Pasos Totales de Viajes",

    unlocked:
      "DESBLOQUEADO",

    nextStatus:
      "SIGUIENTE",

    locked:
      "BLOQUEADO",

    rewardCenter:
      "CENTRO DE RECOMPENSAS",

    exploreRewards:
      "Explorar Recompensas",

    achievements:
      "Logros",

    achievementDescription:
      "Ver metas e insignias obtenidas",

    wcoinWallet:
      "Billetera WCoin",

    walletDescription:
      "Abre tu billetera y consulta tu saldo de recompensas",

    points:
      "Puntos",

    howRewardsWork:
      "Cómo Funcionan las Recompensas",

    walkJourneys:
      "Camina Viajes",

    walkJourneysBody:
      "Caminar en los viajes aumenta tus Pasos Totales de Viajes. Los pasos de maratones se mantienen separados.",

    unlockTracksuits:
      "Desbloquea Conjuntos",

    unlockTracksuitsBody:
      "Alcanza cada meta de Pasos Totales de Viajes para desbloquear permanentemente ese conjunto.",

    chooseOutfit:
      "Elige Tu Atuendo",

    chooseOutfitBody:
      "Desbloquear un nuevo conjunto no te obliga a usarlo. Elige cualquier conjunto ganado en el Centro de Avatar.",

    earnCoinsPoints:
      "Gana WCoins y Puntos",

    earnCoinsPointsBody:
      "WCoins y Puntos Legathon son sistemas de recompensa separados y muestran tus totales guardados más recientes.",

    standard:
      "Estándar",

    allUnlocked:
      "Todos los Conjuntos Desbloqueados",

    blue:
      "Azul",

    green:
      "Verde",

    red:
      "Rojo",

    yellow:
      "Amarillo",

    blackGoldElite:
      "Elite Negro y Dorado",

    newWalker:
      "Caminante Nuevo",

    explorer:
      "Explorador",

    pathfinder:
      "Pionero",

    trailblazer:
      "Precursor",

    adventurer:
      "Aventurero",

    legend:
      "Leyenda",

    elite:
      "Elite",

    max:
      "MÁX",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    back: "Retour",

    rewards: "Récompenses",

    pageSubtitle:
      "Vos étapes de marche, monnaie gagnée, points et progression des survêtements.",

    rewardDashboard:
      "VOTRE TABLEAU DE RÉCOMPENSES",

    yourBalances:
      "Vos Soldes",

    journeyLifetimeSteps:
      "PAS CUMULÉS DES VOYAGES",

    tracksuitProgressionSteps:
      "Pas de progression des survêtements",

    wcoins:
      "WCOINS",

    openWallet:
      "Ouvrir le Portefeuille ›",

    legathonPoints:
      "POINTS LEGATHON",

    viewRank:
      "Voir le Rang ›",

    legathonRank:
      "RANG LEGATHON",

    next:
      "Suivant : {rank}",

    pointsRemaining:
      "{count} points restants",

    maximumRank:
      "Rang maximum atteint",

    currentTracksuit:
      "PALIER ACTUEL DU SURVÊTEMENT",

    level:
      "NIVEAU {level} / 5",

    journeyLifetimeStepsTitle:
      "Pas Cumulés des Voyages",

    nextTracksuit:
      "PROCHAIN SURVÊTEMENT",

    stepsRemaining:
      "{count} pas restants",

    unlocksAt:
      "Se débloque à {count} Pas Cumulés des Voyages",

    allTracksuits:
      "👑 TOUS LES SURVÊTEMENTS DÉBLOQUÉS",

    completeCollection:
      "Vous avez atteint la collection complète des survêtements.",

    refreshRewards:
      "Actualiser les Récompenses",

    avatarRewards:
      "RÉCOMPENSES AVATAR",

    tracksuitUnlocks:
      "Déblocage des Survêtements",

    tracksuitDescription:
      "Les survêtements se débloquent grâce aux Pas Cumulés des Voyages. Une fois gagné, un survêtement reste disponible et vous choisissez celui que votre avatar porte dans le Centre Avatar.",

    tracksuitSteps:
      "{count} Pas Cumulés des Voyages",

    unlocked:
      "DÉBLOQUÉ",

    nextStatus:
      "SUIVANT",

    locked:
      "VERROUILLÉ",

    rewardCenter:
      "CENTRE DE RÉCOMPENSES",

    exploreRewards:
      "Explorer les Récompenses",

    achievements:
      "Succès",

    achievementDescription:
      "Voir les étapes et badges obtenus",

    wcoinWallet:
      "Portefeuille WCoin",

    walletDescription:
      "Ouvrez votre portefeuille et consultez vos récompenses",

    points:
      "Points",

    howRewardsWork:
      "Comment Fonctionnent les Récompenses",

    walkJourneys:
      "Marchez sur les Voyages",

    walkJourneysBody:
      "Les pas effectués dans les voyages alimentent vos Pas Cumulés des Voyages. Les pas des marathons restent séparés.",

    unlockTracksuits:
      "Débloquez les Survêtements",

    unlockTracksuitsBody:
      "Atteignez chaque palier de Pas Cumulés des Voyages pour débloquer définitivement le survêtement.",

    chooseOutfit:
      "Choisissez Votre Tenue",

    chooseOutfitBody:
      "Débloquer un nouveau survêtement ne vous oblige pas à le porter. Choisissez n’importe quel survêtement gagné dans le Centre Avatar.",

    earnCoinsPoints:
      "Gagnez des WCoins et des Points",

    earnCoinsPointsBody:
      "Les WCoins et les Points Legathon sont deux systèmes de récompense distincts affichant vos derniers totaux enregistrés.",

    standard:
      "Standard",

    allUnlocked:
      "Tous les Survêtements Débloqués",

    blue:
      "Bleu",

    green:
      "Vert",

    red:
      "Rouge",

    yellow:
      "Jaune",

    blackGoldElite:
      "Elite Noir et Or",

    newWalker:
      "Nouveau Marcheur",

    explorer:
      "Explorateur",

    pathfinder:
      "Éclaireur",

    trailblazer:
      "Pionnier",

    adventurer:
      "Aventurier",

    legend:
      "Légende",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    back: "Zurück",

    rewards: "Belohnungen",

    pageSubtitle:
      "Deine Geh-Meilensteine, verdiente Währung, Punkte und Trainingsanzug-Fortschritte.",

    rewardDashboard:
      "DEIN BELOHNUNGS-DASHBOARD",

    yourBalances:
      "Deine Guthaben",

    journeyLifetimeSteps:
      "REISE-GESAMTSCHRITTE",

    tracksuitProgressionSteps:
      "Schritte für Trainingsanzug-Fortschritt",

    wcoins:
      "WCOINS",

    openWallet:
      "Wallet Öffnen ›",

    legathonPoints:
      "LEGATHON-PUNKTE",

    viewRank:
      "Rang Ansehen ›",

    legathonRank:
      "LEGATHON-RANG",

    next:
      "Nächster: {rank}",

    pointsRemaining:
      "{count} Punkte verbleiben",

    maximumRank:
      "Maximaler Rang erreicht",

    currentTracksuit:
      "AKTUELLER TRAININGSANZUG-MEILENSTEIN",

    level:
      "LEVEL {level} / 5",

    journeyLifetimeStepsTitle:
      "Reise-Gesamtschritte",

    nextTracksuit:
      "NÄCHSTER TRAININGSANZUG",

    stepsRemaining:
      "{count} Schritte verbleiben",

    unlocksAt:
      "Freischaltung bei {count} Reise-Gesamtschritten",

    allTracksuits:
      "👑 ALLE TRAININGSANZÜGE FREIGESCHALTET",

    completeCollection:
      "Du hast die gesamte Trainingsanzug-Sammlung freigeschaltet.",

    refreshRewards:
      "Belohnungen Aktualisieren",

    avatarRewards:
      "AVATAR-BELOHNUNGEN",

    tracksuitUnlocks:
      "Trainingsanzüge Freischalten",

    tracksuitDescription:
      "Trainingsanzüge werden durch Reise-Gesamtschritte freigeschaltet. Ein verdienter Anzug bleibt verfügbar und kann im Avatar-Center ausgewählt werden.",

    tracksuitSteps:
      "{count} Reise-Gesamtschritte",

    unlocked:
      "FREIGESCHALTET",

    nextStatus:
      "NÄCHSTER",

    locked:
      "GESPERRT",

    rewardCenter:
      "BELOHNUNGSZENTRUM",

    exploreRewards:
      "Belohnungen Entdecken",

    achievements:
      "Erfolge",

    achievementDescription:
      "Meilensteine und verdiente Abzeichen ansehen",

    wcoinWallet:
      "WCoin Wallet",

    walletDescription:
      "Öffne deine Wallet und sieh dein Belohnungsguthaben",

    points:
      "Punkte",

    howRewardsWork:
      "So Funktionieren Belohnungen",

    walkJourneys:
      "Reisen Gehen",

    walkJourneysBody:
      "Schritte während Reisen erhöhen deine Reise-Gesamtschritte. Marathonschritte bleiben getrennt.",

    unlockTracksuits:
      "Trainingsanzüge Freischalten",

    unlockTracksuitsBody:
      "Erreiche jeden Reise-Gesamtschritt-Meilenstein, um den entsprechenden Trainingsanzug dauerhaft freizuschalten.",

    chooseOutfit:
      "Wähle Dein Outfit",

    chooseOutfitBody:
      "Ein freigeschalteter Trainingsanzug muss nicht automatisch getragen werden. Wähle jeden verdienten Anzug im Avatar-Center.",

    earnCoinsPoints:
      "WCoins & Punkte Verdienen",

    earnCoinsPointsBody:
      "WCoins und Legathon-Punkte sind getrennte Belohnungssysteme und zeigen deine neuesten gespeicherten Werte.",

    standard:
      "Standard",

    allUnlocked:
      "Alle Trainingsanzüge Freigeschaltet",

    blue:
      "Blau",

    green:
      "Grün",

    red:
      "Rot",

    yellow:
      "Gelb",

    blackGoldElite:
      "Schwarz & Gold Elite",

    newWalker:
      "Neuer Walker",

    explorer:
      "Entdecker",

    pathfinder:
      "Pfadfinder",

    trailblazer:
      "Wegbereiter",

    adventurer:
      "Abenteurer",

    legend:
      "Legende",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    back: "Voltar",

    rewards: "Recompensas",

    pageSubtitle:
      "Seus marcos de caminhada, moeda conquistada, pontos e progresso dos agasalhos.",

    rewardDashboard:
      "SEU PAINEL DE RECOMPENSAS",

    yourBalances:
      "Seus Saldos",

    journeyLifetimeSteps:
      "PASSOS TOTAIS DAS JORNADAS",

    tracksuitProgressionSteps:
      "Passos para progressão dos agasalhos",

    wcoins:
      "WCOINS",

    openWallet:
      "Abrir Carteira ›",

    legathonPoints:
      "PONTOS LEGATHON",

    viewRank:
      "Ver Classificação ›",

    legathonRank:
      "CLASSIFICAÇÃO LEGATHON",

    next:
      "Próximo: {rank}",

    pointsRemaining:
      "Faltam {count} pontos",

    maximumRank:
      "Classificação máxima alcançada",

    currentTracksuit:
      "MARCO ATUAL DO AGASALHO",

    level:
      "NÍVEL {level} / 5",

    journeyLifetimeStepsTitle:
      "Passos Totais das Jornadas",

    nextTracksuit:
      "PRÓXIMO AGASALHO",

    stepsRemaining:
      "Faltam {count} passos",

    unlocksAt:
      "Desbloqueia com {count} Passos Totais das Jornadas",

    allTracksuits:
      "👑 TODOS OS AGASALHOS DESBLOQUEADOS",

    completeCollection:
      "Você alcançou toda a coleção de agasalhos.",

    refreshRewards:
      "Atualizar Recompensas",

    avatarRewards:
      "RECOMPENSAS DO AVATAR",

    tracksuitUnlocks:
      "Desbloqueio de Agasalhos",

    tracksuitDescription:
      "Os agasalhos são desbloqueados pelos Passos Totais das Jornadas. Depois de conquistado, o agasalho permanece disponível e pode ser escolhido no Centro de Avatar.",

    tracksuitSteps:
      "{count} Passos Totais das Jornadas",

    unlocked:
      "DESBLOQUEADO",

    nextStatus:
      "PRÓXIMO",

    locked:
      "BLOQUEADO",

    rewardCenter:
      "CENTRO DE RECOMPENSAS",

    exploreRewards:
      "Explorar Recompensas",

    achievements:
      "Conquistas",

    achievementDescription:
      "Veja marcos e emblemas conquistados",

    wcoinWallet:
      "Carteira WCoin",

    walletDescription:
      "Abra sua carteira e consulte seu saldo de recompensas",

    points:
      "Pontos",

    howRewardsWork:
      "Como Funcionam as Recompensas",

    walkJourneys:
      "Caminhe nas Jornadas",

    walkJourneysBody:
      "Caminhar nas jornadas aumenta seus Passos Totais das Jornadas. Os passos das maratonas permanecem separados.",

    unlockTracksuits:
      "Desbloqueie Agasalhos",

    unlockTracksuitsBody:
      "Alcance cada marco de Passos Totais das Jornadas para desbloquear permanentemente o agasalho.",

    chooseOutfit:
      "Escolha Seu Visual",

    chooseOutfitBody:
      "Desbloquear um novo agasalho não obriga você a usá-lo. Escolha qualquer agasalho conquistado no Centro de Avatar.",

    earnCoinsPoints:
      "Ganhe WCoins e Pontos",

    earnCoinsPointsBody:
      "WCoins e Pontos Legathon são sistemas separados e mostram os seus totais armazenados mais recentes.",

    standard:
      "Padrão",

    allUnlocked:
      "Todos os Agasalhos Desbloqueados",

    blue:
      "Azul",

    green:
      "Verde",

    red:
      "Vermelho",

    yellow:
      "Amarelo",

    blackGoldElite:
      "Elite Preto e Dourado",

    newWalker:
      "Novo Caminhante",

    explorer:
      "Explorador",

    pathfinder:
      "Desbravador",

    trailblazer:
      "Pioneiro",

    adventurer:
      "Aventureiro",

    legend:
      "Lenda",

    elite:
      "Elite",

    max:
      "MÁX",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    back: "戻る",

    rewards: "報酬",

    pageSubtitle:
      "歩行マイルストーン、獲得通貨、ポイント、トラックスーツの進捗を確認できます。",

    rewardDashboard:
      "報酬ダッシュボード",

    yourBalances:
      "保有残高",

    journeyLifetimeSteps:
      "ジャーニー累計歩数",

    tracksuitProgressionSteps:
      "トラックスーツ進捗歩数",

    wcoins:
      "WCOINS",

    openWallet:
      "ウォレットを開く ›",

    legathonPoints:
      "LEGATHONポイント",

    viewRank:
      "ランクを見る ›",

    legathonRank:
      "LEGATHONランク",

    next:
      "次: {rank}",

    pointsRemaining:
      "あと {count} ポイント",

    maximumRank:
      "最高ランクに到達",

    currentTracksuit:
      "現在のトラックスーツマイルストーン",

    level:
      "レベル {level} / 5",

    journeyLifetimeStepsTitle:
      "ジャーニー累計歩数",

    nextTracksuit:
      "次のトラックスーツ",

    stepsRemaining:
      "あと {count} 歩",

    unlocksAt:
      "ジャーニー累計 {count} 歩で解除",

    allTracksuits:
      "👑 全トラックスーツ解除済み",

    completeCollection:
      "すべてのトラックスーツマイルストーンを達成しました。",

    refreshRewards:
      "報酬を更新",

    avatarRewards:
      "アバター報酬",

    tracksuitUnlocks:
      "トラックスーツ解除",

    tracksuitDescription:
      "トラックスーツはジャーニー累計歩数で解除されます。一度獲得すると利用可能なままで、アバターセンターで好きな獲得済み衣装を選べます。",

    tracksuitSteps:
      "ジャーニー累計 {count} 歩",

    unlocked:
      "解除済み",

    nextStatus:
      "次",

    locked:
      "ロック中",

    rewardCenter:
      "報酬センター",

    exploreRewards:
      "報酬を見る",

    achievements:
      "実績",

    achievementDescription:
      "マイルストーンと獲得バッジを確認",

    wcoinWallet:
      "WCoinウォレット",

    walletDescription:
      "ウォレットと報酬残高を確認",

    points:
      "ポイント",

    howRewardsWork:
      "報酬の仕組み",

    walkJourneys:
      "ジャーニーを歩く",

    walkJourneysBody:
      "ジャーニーでの歩行はジャーニー累計歩数に加算されます。マラソンの歩数は別に管理されます。",

    unlockTracksuits:
      "トラックスーツを解除",

    unlockTracksuitsBody:
      "各ジャーニー累計歩数マイルストーンに到達すると、そのトラックスーツが永久に解除されます。",

    chooseOutfit:
      "衣装を選ぶ",

    chooseOutfitBody:
      "新しいトラックスーツを解除しても自動的に着用されません。アバターセンターで獲得済みの衣装を選べます。",

    earnCoinsPoints:
      "WCoinsとポイントを獲得",

    earnCoinsPointsBody:
      "WCoinsとLegathonポイントは別々の報酬システムで、最新の保存残高が上に表示されます。",

    standard:
      "スタンダード",

    allUnlocked:
      "全トラックスーツ解除済み",

    blue:
      "ブルー",

    green:
      "グリーン",

    red:
      "レッド",

    yellow:
      "イエロー",

    blackGoldElite:
      "ブラック＆ゴールド Elite",

    newWalker:
      "新しいウォーカー",

    explorer:
      "エクスプローラー",

    pathfinder:
      "パスファインダー",

    trailblazer:
      "トレイルブレイザー",

    adventurer:
      "アドベンチャラー",

    legend:
      "レジェンド",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    back: "뒤로",

    rewards: "보상",

    pageSubtitle:
      "걷기 목표, 획득한 화폐, 포인트 및 트랙수트 진행 상황을 확인하세요.",

    rewardDashboard:
      "보상 대시보드",

    yourBalances:
      "보유 잔액",

    journeyLifetimeSteps:
      "여정 누적 걸음 수",

    tracksuitProgressionSteps:
      "트랙수트 진행 걸음 수",

    wcoins:
      "WCOINS",

    openWallet:
      "지갑 열기 ›",

    legathonPoints:
      "LEGATHON 포인트",

    viewRank:
      "등급 보기 ›",

    legathonRank:
      "LEGATHON 등급",

    next:
      "다음: {rank}",

    pointsRemaining:
      "{count} 포인트 남음",

    maximumRank:
      "최고 등급 달성",

    currentTracksuit:
      "현재 트랙수트 마일스톤",

    level:
      "레벨 {level} / 5",

    journeyLifetimeStepsTitle:
      "여정 누적 걸음 수",

    nextTracksuit:
      "다음 트랙수트",

    stepsRemaining:
      "{count}걸음 남음",

    unlocksAt:
      "여정 누적 {count}걸음에서 잠금 해제",

    allTracksuits:
      "👑 모든 트랙수트 잠금 해제",

    completeCollection:
      "전체 트랙수트 마일스톤 컬렉션을 달성했습니다.",

    refreshRewards:
      "보상 새로고침",

    avatarRewards:
      "아바타 보상",

    tracksuitUnlocks:
      "트랙수트 잠금 해제",

    tracksuitDescription:
      "트랙수트는 여정 누적 걸음 수로 잠금 해제됩니다. 한 번 획득하면 계속 사용할 수 있으며 아바타 센터에서 원하는 트랙수트를 선택할 수 있습니다.",

    tracksuitSteps:
      "여정 누적 {count}걸음",

    unlocked:
      "잠금 해제",

    nextStatus:
      "다음",

    locked:
      "잠김",

    rewardCenter:
      "보상 센터",

    exploreRewards:
      "보상 둘러보기",

    achievements:
      "업적",

    achievementDescription:
      "목표와 획득한 배지 확인",

    wcoinWallet:
      "WCoin 지갑",

    walletDescription:
      "지갑과 보상 잔액 확인",

    points:
      "포인트",

    howRewardsWork:
      "보상 이용 방법",

    walkJourneys:
      "여정 걷기",

    walkJourneysBody:
      "여정에서 걷는 걸음은 여정 누적 걸음 수에 추가됩니다. 마라톤 걸음은 별도로 유지됩니다.",

    unlockTracksuits:
      "트랙수트 잠금 해제",

    unlockTracksuitsBody:
      "각 여정 누적 걸음 수 마일스톤에 도달하면 해당 트랙수트가 영구적으로 잠금 해제됩니다.",

    chooseOutfit:
      "의상 선택",

    chooseOutfitBody:
      "새 트랙수트를 잠금 해제해도 자동으로 착용되지 않습니다. 아바타 센터에서 획득한 트랙수트를 선택하세요.",

    earnCoinsPoints:
      "WCoins 및 포인트 획득",

    earnCoinsPointsBody:
      "WCoins와 Legathon 포인트는 별도의 보상 시스템이며 최신 저장 합계가 위에 표시됩니다.",

    standard:
      "기본",

    allUnlocked:
      "모든 트랙수트 잠금 해제",

    blue:
      "블루",

    green:
      "그린",

    red:
      "레드",

    yellow:
      "옐로우",

    blackGoldElite:
      "블랙 & 골드 Elite",

    newWalker:
      "새로운 워커",

    explorer:
      "탐험가",

    pathfinder:
      "개척자",

    trailblazer:
      "선구자",

    adventurer:
      "모험가",

    legend:
      "레전드",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    back: "返回",

    rewards: "奖励",

    pageSubtitle:
      "查看你的步行里程碑、已赚取货币、积分和运动服进度。",

    rewardDashboard:
      "奖励面板",

    yourBalances:
      "你的余额",

    journeyLifetimeSteps:
      "旅程累计步数",

    tracksuitProgressionSteps:
      "运动服进度步数",

    wcoins:
      "WCOINS",

    openWallet:
      "打开钱包 ›",

    legathonPoints:
      "LEGATHON积分",

    viewRank:
      "查看等级 ›",

    legathonRank:
      "LEGATHON等级",

    next:
      "下一级：{rank}",

    pointsRemaining:
      "还需 {count} 积分",

    maximumRank:
      "已达到最高等级",

    currentTracksuit:
      "当前运动服里程碑",

    level:
      "等级 {level} / 5",

    journeyLifetimeStepsTitle:
      "旅程累计步数",

    nextTracksuit:
      "下一套运动服",

    stepsRemaining:
      "还需 {count} 步",

    unlocksAt:
      "达到 {count} 旅程累计步数时解锁",

    allTracksuits:
      "👑 所有运动服已解锁",

    completeCollection:
      "你已经完成全部运动服里程碑收藏。",

    refreshRewards:
      "刷新奖励",

    avatarRewards:
      "虚拟形象奖励",

    tracksuitUnlocks:
      "运动服解锁",

    tracksuitDescription:
      "运动服根据旅程累计步数解锁。获得后会永久保留，你可以在虚拟形象中心选择任何已经解锁的运动服。",

    tracksuitSteps:
      "{count} 旅程累计步数",

    unlocked:
      "已解锁",

    nextStatus:
      "下一个",

    locked:
      "未解锁",

    rewardCenter:
      "奖励中心",

    exploreRewards:
      "探索奖励",

    achievements:
      "成就",

    achievementDescription:
      "查看里程碑和已获得徽章",

    wcoinWallet:
      "WCoin钱包",

    walletDescription:
      "打开钱包并查看奖励余额",

    points:
      "积分",

    howRewardsWork:
      "奖励机制",

    walkJourneys:
      "步行完成旅程",

    walkJourneysBody:
      "旅程中的步行会计入旅程累计步数。马拉松步数保持独立计算。",

    unlockTracksuits:
      "解锁运动服",

    unlockTracksuitsBody:
      "达到每个旅程累计步数里程碑即可永久解锁对应运动服。",

    chooseOutfit:
      "选择你的服装",

    chooseOutfitBody:
      "解锁新的运动服不会强制你穿着它。你可以在虚拟形象中心选择任何已经获得的运动服。",

    earnCoinsPoints:
      "赚取WCoins和积分",

    earnCoinsPointsBody:
      "WCoins和Legathon积分是独立的奖励系统，上方显示最新保存的总额。",

    standard:
      "标准",

    allUnlocked:
      "所有运动服已解锁",

    blue:
      "蓝色",

    green:
      "绿色",

    red:
      "红色",

    yellow:
      "黄色",

    blackGoldElite:
      "黑金Elite",

    newWalker:
      "新手行者",

    explorer:
      "探索者",

    pathfinder:
      "开拓者",

    trailblazer:
      "先锋",

    adventurer:
      "冒险家",

    legend:
      "传奇",

    elite:
      "Elite",

    max:
      "最高",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    back: "Indietro",

    rewards: "Premi",

    pageSubtitle:
      "I tuoi traguardi di camminata, valuta guadagnata, punti e progressione delle tute.",

    rewardDashboard:
      "IL TUO PANNELLO PREMI",

    yourBalances:
      "I Tuoi Saldi",

    journeyLifetimeSteps:
      "PASSI TOTALI DEI PERCORSI",

    tracksuitProgressionSteps:
      "Passi per la progressione delle tute",

    wcoins:
      "WCOINS",

    openWallet:
      "Apri Portafoglio ›",

    legathonPoints:
      "PUNTI LEGATHON",

    viewRank:
      "Visualizza Grado ›",

    legathonRank:
      "GRADO LEGATHON",

    next:
      "Successivo: {rank}",

    pointsRemaining:
      "{count} punti rimanenti",

    maximumRank:
      "Grado massimo raggiunto",

    currentTracksuit:
      "TRAGUARDO ATTUALE DELLA TUTA",

    level:
      "LIVELLO {level} / 5",

    journeyLifetimeStepsTitle:
      "Passi Totali dei Percorsi",

    nextTracksuit:
      "PROSSIMA TUTA",

    stepsRemaining:
      "{count} passi rimanenti",

    unlocksAt:
      "Si sblocca a {count} Passi Totali dei Percorsi",

    allTracksuits:
      "👑 TUTTE LE TUTE SBLOCCATE",

    completeCollection:
      "Hai completato l’intera collezione di traguardi delle tute.",

    refreshRewards:
      "Aggiorna Premi",

    avatarRewards:
      "PREMI AVATAR",

    tracksuitUnlocks:
      "Sblocco Tute",

    tracksuitDescription:
      "Le tute si sbloccano con i Passi Totali dei Percorsi. Una volta guadagnata, una tuta resta disponibile e puoi scegliere quale indossare nel Centro Avatar.",

    tracksuitSteps:
      "{count} Passi Totali dei Percorsi",

    unlocked:
      "SBLOCCATO",

    nextStatus:
      "PROSSIMO",

    locked:
      "BLOCCATO",

    rewardCenter:
      "CENTRO PREMI",

    exploreRewards:
      "Esplora Premi",

    achievements:
      "Traguardi",

    achievementDescription:
      "Visualizza traguardi e distintivi ottenuti",

    wcoinWallet:
      "Portafoglio WCoin",

    walletDescription:
      "Apri il portafoglio e visualizza il saldo dei premi",

    points:
      "Punti",

    howRewardsWork:
      "Come Funzionano i Premi",

    walkJourneys:
      "Cammina nei Percorsi",

    walkJourneysBody:
      "Le camminate nei percorsi aumentano i Passi Totali dei Percorsi. I passi delle maratone rimangono separati.",

    unlockTracksuits:
      "Sblocca Tute",

    unlockTracksuitsBody:
      "Raggiungi ogni traguardo di Passi Totali dei Percorsi per sbloccare permanentemente quella tuta.",

    chooseOutfit:
      "Scegli il Tuo Outfit",

    chooseOutfitBody:
      "Sbloccare una nuova tuta non significa doverla indossare. Scegli qualsiasi tuta ottenuta nel Centro Avatar.",

    earnCoinsPoints:
      "Guadagna WCoins e Punti",

    earnCoinsPointsBody:
      "WCoins e Punti Legathon sono sistemi di ricompensa separati e mostrano i totali salvati più recenti.",

    standard:
      "Standard",

    allUnlocked:
      "Tutte le Tute Sbloccate",

    blue:
      "Blu",

    green:
      "Verde",

    red:
      "Rosso",

    yellow:
      "Giallo",

    blackGoldElite:
      "Elite Nero e Oro",

    newWalker:
      "Nuovo Camminatore",

    explorer:
      "Esploratore",

    pathfinder:
      "Apripista",

    trailblazer:
      "Pioniere",

    adventurer:
      "Avventuriero",

    legend:
      "Leggenda",

    elite:
      "Elite",

    max:
      "MAX",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    back: "رجوع",

    rewards: "المكافآت",

    pageSubtitle:
      "إنجازات المشي والعملات المكتسبة والنقاط وتقدم البدلات الرياضية.",

    rewardDashboard:
      "لوحة المكافآت",

    yourBalances:
      "أرصدتك",

    journeyLifetimeSteps:
      "إجمالي خطوات الرحلات",

    tracksuitProgressionSteps:
      "خطوات تقدم البدلات",

    wcoins:
      "WCOINS",

    openWallet:
      "فتح المحفظة ›",

    legathonPoints:
      "نقاط LEGATHON",

    viewRank:
      "عرض التصنيف ›",

    legathonRank:
      "تصنيف LEGATHON",

    next:
      "التالي: {rank}",

    pointsRemaining:
      "متبقي {count} نقطة",

    maximumRank:
      "تم الوصول إلى أعلى تصنيف",

    currentTracksuit:
      "مرحلة البدلة الحالية",

    level:
      "المستوى {level} / 5",

    journeyLifetimeStepsTitle:
      "إجمالي خطوات الرحلات",

    nextTracksuit:
      "البدلة التالية",

    stepsRemaining:
      "متبقي {count} خطوة",

    unlocksAt:
      "تُفتح عند {count} من إجمالي خطوات الرحلات",

    allTracksuits:
      "👑 تم فتح جميع البدلات",

    completeCollection:
      "لقد أكملت مجموعة مراحل البدلات بالكامل.",

    refreshRewards:
      "تحديث المكافآت",

    avatarRewards:
      "مكافآت الصورة الرمزية",

    tracksuitUnlocks:
      "فتح البدلات",

    tracksuitDescription:
      "يتم فتح البدلات من خلال إجمالي خطوات الرحلات. بمجرد الحصول على البدلة تبقى متاحة ويمكنك اختيار أي بدلة مكتسبة في مركز الصورة الرمزية.",

    tracksuitSteps:
      "{count} من إجمالي خطوات الرحلات",

    unlocked:
      "مفتوح",

    nextStatus:
      "التالي",

    locked:
      "مغلق",

    rewardCenter:
      "مركز المكافآت",

    exploreRewards:
      "استكشاف المكافآت",

    achievements:
      "الإنجازات",

    achievementDescription:
      "عرض المراحل والشارات المكتسبة",

    wcoinWallet:
      "محفظة WCoin",

    walletDescription:
      "افتح محفظتك واعرض رصيد المكافآت",

    points:
      "نقاط",

    howRewardsWork:
      "كيف تعمل المكافآت",

    walkJourneys:
      "المشي في الرحلات",

    walkJourneysBody:
      "المشي في الرحلات يضيف إلى إجمالي خطوات الرحلات. خطوات الماراثون تبقى منفصلة.",

    unlockTracksuits:
      "فتح البدلات",

    unlockTracksuitsBody:
      "صل إلى كل مرحلة من إجمالي خطوات الرحلات لفتح البدلة بشكل دائم.",

    chooseOutfit:
      "اختر ملابسك",

    chooseOutfitBody:
      "فتح بدلة جديدة لا يجبرك على ارتدائها. اختر أي بدلة حصلت عليها من مركز الصورة الرمزية.",

    earnCoinsPoints:
      "اكسب WCoins والنقاط",

    earnCoinsPointsBody:
      "WCoins ونقاط Legathon نظاما مكافآت منفصلان ويتم عرض أحدث الأرصدة المحفوظة أعلاه.",

    standard:
      "عادي",

    allUnlocked:
      "تم فتح جميع البدلات",

    blue:
      "أزرق",

    green:
      "أخضر",

    red:
      "أحمر",

    yellow:
      "أصفر",

    blackGoldElite:
      "Elite أسود وذهبي",

    newWalker:
      "مبتدئ",

    explorer:
      "مستكشف",

    pathfinder:
      "مكتشف المسار",

    trailblazer:
      "رائد",

    adventurer:
      "مغامر",

    legend:
      "أسطورة",

    elite:
      "Elite",

    max:
      "الأعلى",
  },
};

// ============================================================
// HELPERS
// ============================================================

function fillTemplate(
  value,
  variables = {}
) {
  return String(value).replace(
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

function safeNumber(value) {
  const parsed = Number(
    value ??
      0
  );

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    parsed
  );
}

function formatNumber(value) {
  return Math.floor(
    safeNumber(value)
  ).toLocaleString();
}

function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      safeNumber(value)
    )
  );
}

// ============================================================
// LIFETIME STEP LOADER
// ============================================================

async function loadRewardLifetimeSteps() {
  try {
    const centralSteps =
      safeNumber(
        await getJourneyLifetimeSteps()
      );

    const [
      lowerRaw,
      upperRaw,
    ] =
      await Promise.all([
        AsyncStorage.getItem(
          "lifetimeSteps"
        ),

        AsyncStorage.getItem(
          "LifetimeSteps"
        ),
      ]);

    const lifetimeSteps =
      Math.max(
        centralSteps,
        safeNumber(
          lowerRaw
        ),
        safeNumber(
          upperRaw
        )
      );

    // Keep both old keys synchronized.
    await Promise.all([
      AsyncStorage.setItem(
        "lifetimeSteps",
        String(
          lifetimeSteps
        )
      ),

      AsyncStorage.setItem(
        "LifetimeSteps",
        String(
          lifetimeSteps
        )
      ),
    ]);

    return lifetimeSteps;
  } catch (error) {
    console.log(
      "Rewards lifetime steps error:",
      error
    );

    return 0;
  }
}

// ============================================================
// TRACKSUIT PROGRESSION
// ============================================================

function calculateTracksuitProgress(
  lifetimeSteps
) {
  const steps =
    safeNumber(
      lifetimeSteps
    );

  const unlocked =
    TRACKSUITS.filter(
      suit =>
        steps >=
        suit.unlockAt
    );

  const current =
    unlocked.length >
    0
      ? unlocked[
          unlocked.length -
            1
        ]
      : null;

  const next =
    TRACKSUITS.find(
      suit =>
        steps <
        suit.unlockAt
    ) ||
    null;

  const currentStart =
    current?.unlockAt ||
    0;

  const nextTarget =
    next?.unlockAt ||
    currentStart;

  const segmentSize =
    Math.max(
      1,
      nextTarget -
        currentStart
    );

  const segmentProgress =
    next
      ? clamp(
          (
            (
              steps -
              currentStart
            ) /
            segmentSize
          ) *
            100
        )
      : 100;

  return {
    steps,

    current,

    next,

    unlocked,

    currentLevel:
      current?.level ||
      0,

    currentName:
      current?.name ||
      "Standard",

    nextName:
      next?.name ||
      "All Tracksuits Unlocked",

    nextTarget:
      next?.unlockAt ||
      null,

    stepsRemaining:
      next
        ? Math.max(
            0,
            next.unlockAt -
              steps
          )
        : 0,

    progress:
      segmentProgress,
  };
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function RewardsScreen({
  language = "en",

  goBack,

  goToAchievements,

  goToWCoins,

  goToLegathonPoints,
}) {
  // ==========================================================
  // TRANSLATION
  // ==========================================================

  function t(
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
        : REWARDS_TEXT?.[
            language
          ]?.[key] ??
          REWARDS_TEXT.en?.[
            key
          ] ??
          key;

    return fillTemplate(
      value,
      variables
    );
  }

  // ==========================================================
  // TRANSLATE TRACKSUIT
  // ==========================================================

  function tracksuitName(
    suit
  ) {
    const id =
      typeof suit ===
      "string"
        ? suit
        : suit?.id;

    const map = {
      blue: "blue",
      green: "green",
      red: "red",
      yellow: "yellow",
      elite: "blackGoldElite",
    };

    const key =
      map[id];

    if (
      key
    ) {
      return t(
        key
      );
    }

    const rawName =
      typeof suit ===
      "string"
        ? suit
        : suit?.name;

    if (
      rawName ===
      "Standard"
    ) {
      return t(
        "standard"
      );
    }

    if (
      rawName ===
      "All Tracksuits Unlocked"
    ) {
      return t(
        "allUnlocked"
      );
    }

    return (
      rawName ||
      t(
        "standard"
      )
    );
  }

  // ==========================================================
  // TRANSLATE RANK
  // ==========================================================

  function rankName(
    rank
  ) {
    const normalized =
      String(
        rank ||
          ""
      )
        .trim()
        .toLowerCase();

    const map = {
      "new walker":
        "newWalker",

      rookie:
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

      elite:
        "elite",

      max:
        "max",
    };

    const key =
      map[
        normalized
      ];

    return key
      ? t(key)
      : rank ||
          t(
            "newWalker"
          );
  }

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(
      0
    );

  const [
    wcoinBalance,
    setWcoinBalance,
  ] =
    useState(
      0
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const {
    points:
      legathonPoints,

    rank:
      legathonRank,
  } =
    useLegathonPoints();

  // ==========================================================
  // TRACKSUIT PROGRESS
  // ==========================================================

  const progression =
    useMemo(
      () =>
        calculateTracksuitProgress(
          lifetimeSteps
        ),

      [
        lifetimeSteps,
      ]
    );

  // ==========================================================
  // LOAD REWARDS
  // ==========================================================

  const loadRewards =
    useCallback(
      async (
        showMainLoader =
          false
      ) => {
        try {
          if (
            showMainLoader
          ) {
            setLoading(
              true
            );
          } else {
            setRefreshing(
              true
            );
          }

          const [
            steps,
            coins,
          ] =
            await Promise.all([
              loadRewardLifetimeSteps(),

              getWCoins(),
            ]);

          setLifetimeSteps(
            steps
          );

          setWcoinBalance(
            coins
          );
        } catch (
          error
        ) {
          console.log(
            "Rewards load error:",
            error
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },

      []
    );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {
      loadRewards(
        true
      );
    },

    [
      loadRewards,
    ]
  );

  // ==========================================================
  // REFRESH WHEN APP RETURNS
  // ==========================================================

  useEffect(
    () => {
      const subscription =
        AppState
          .addEventListener(
            "change",

            nextState => {
              if (
                nextState ===
                "active"
              ) {
                loadRewards(
                  false
                );
              }
            }
          );

      return () => {
        subscription
          ?.remove?.();
      };
    },

    [
      loadRewards,
    ]
  );

  // ==========================================================
  // RANK
  // ==========================================================

  const currentRankRaw =
    legathonRank
      ?.currentRank ||
    "New Walker";

  const nextRankRaw =
    legathonRank
      ?.nextRank ||
    "MAX";

  const currentRank =
    rankName(
      currentRankRaw
    );

  const nextRank =
    rankName(
      nextRankRaw
    );

  const isMaxRank =
    String(
      nextRankRaw
    ).toUpperCase() ===
    "MAX";

  const pointsRemaining =
    safeNumber(
      legathonRank
        ?.pointsRemaining
    );

  // ==========================================================
  // CURRENT / NEXT TRACKSUIT
  // ==========================================================

  const currentSuitName =
    progression.current
      ? tracksuitName(
          progression.current
        )
      : t(
          "standard"
        );

  const nextSuitName =
    progression.next
      ? tracksuitName(
          progression.next
        )
      : t(
          "allUnlocked"
        );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View
      style={
        styles.screen
      }
    >
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <View
            style={
              styles.topRow
            }
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={() => {
                if (
                  typeof goBack ===
                  "function"
                ) {
                  goBack();
                }
              }}
              activeOpacity={
                0.8
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

            <View
              style={
                styles.brandPill
              }
            >
              <Text
                style={
                  styles.brandPillText
                }
              >
                LEGATHON
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.pageTitle
            }
            numberOfLines={
              2
            }
            adjustsFontSizeToFit
            minimumFontScale={
              0.72
            }
          >
            {t(
              "rewards"
            )}
          </Text>

          <Text
            style={
              styles.pageSubtitle
            }
          >
            {t(
              "pageSubtitle"
            )}
          </Text>

          {/* ==================================================
              BALANCES HEADER
          ================================================== */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            {t(
              "rewardDashboard"
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "yourBalances"
            )}
          </Text>

          {/* ==================================================
              BALANCE GRID
          ================================================== */}

          <View
            style={
              styles.balanceGrid
            }
          >
            {/* JOURNEY LIFETIME STEPS */}

            <View
              style={[
                styles.balanceCard,

                styles.fullBalanceCard,
              ]}
            >
              <View
                style={
                  styles.balanceIcon
                }
              >
                <Text
                  style={
                    styles.balanceEmoji
                  }
                >
                  👟
                </Text>
              </View>

              <View
                style={
                  styles.balanceTextArea
                }
              >
                <Text
                  style={
                    styles.balanceLabel
                  }
                >
                  {t(
                    "journeyLifetimeSteps"
                  )}
                </Text>

                <Text
                  style={
                    styles.balanceLarge
                  }
                >
                  {formatNumber(
                    lifetimeSteps
                  )}
                </Text>

                <Text
                  style={
                    styles.balanceSub
                  }
                >
                  {t(
                    "tracksuitProgressionSteps"
                  )}
                </Text>
              </View>
            </View>

            {/* ==================================================
                WCOIN BALANCE
            ================================================== */}

            <TouchableOpacity
              style={
                styles.halfBalanceCard
              }
              onPress={() => {
                if (
                  typeof goToWCoins ===
                  "function"
                ) {
                  goToWCoins();
                }
              }}
              activeOpacity={
                0.85
              }
            >
              <Image
                source={
                  WCOIN_IMAGE
                }
                style={
                  styles.wcoinBalanceIcon
                }
                resizeMode="contain"
                accessibilityLabel="WCoin"
              />

              <Text
                style={
                  styles.smallBalanceLabel
                }
              >
                {t(
                  "wcoins"
                )}
              </Text>

              <Text
                style={
                  styles.smallBalanceValue
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {formatNumber(
                  wcoinBalance
                )}
              </Text>

              <Text
                style={
                  styles.cardLink
                }
              >
                {t(
                  "openWallet"
                )}
              </Text>
            </TouchableOpacity>

            {/* ==================================================
                LEGATHON POINTS
            ================================================== */}

            <TouchableOpacity
              style={
                styles.halfBalanceCard
              }
              onPress={() => {
                if (
                  typeof goToLegathonPoints ===
                  "function"
                ) {
                  goToLegathonPoints();
                }
              }}
              activeOpacity={
                0.85
              }
            >
              <Text
                style={
                  styles.currencyEmoji
                }
              >
                ⭐
              </Text>

              <Text
                style={
                  styles.smallBalanceLabel
                }
              >
                {t(
                  "legathonPoints"
                )}
              </Text>

              <Text
                style={
                  styles.smallBalanceValue
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {formatNumber(
                  legathonPoints
                )}
              </Text>

              <Text
                style={
                  styles.cardLink
                }
              >
                {t(
                  "viewRank"
                )}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ==================================================
              LEGATHON RANK
          ================================================== */}

          <View
            style={
              styles.rankCard
            }
          >
            <View
              style={
                styles.rankLeft
              }
            >
              <Text
                style={
                  styles.cardEyebrow
                }
              >
                {t(
                  "legathonRank"
                )}
              </Text>

              <Text
                style={
                  styles.rankName
                }
                numberOfLines={
                  2
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {
                  currentRank
                }
              </Text>
            </View>

            <View
              style={
                styles.rankRight
              }
            >
              <Text
                style={
                  styles.rankNext
                }
              >
                {t(
                  "next",

                  {
                    rank:
                      nextRank,
                  }
                )}
              </Text>

              {!isMaxRank ? (
                <Text
                  style={
                    styles.rankRemaining
                  }
                >
                  {t(
                    "pointsRemaining",

                    {
                      count:
                        formatNumber(
                          pointsRemaining
                        ),
                    }
                  )}
                </Text>
              ) : (
                <Text
                  style={
                    styles.rankRemaining
                  }
                >
                  {t(
                    "maximumRank"
                  )}
                </Text>
              )}
            </View>
          </View>

          {/* ==================================================
              CURRENT TRACKSUIT
          ================================================== */}

          <View
            style={
              styles.progressCard
            }
          >
            <Text
              style={
                styles.cardEyebrow
              }
            >
              {t(
                "currentTracksuit"
              )}
            </Text>

            <Text
              style={
                styles.currentSuitName
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
                currentSuitName
              }
            </Text>

            <View
              style={
                styles.levelPill
              }
            >
              <Text
                style={
                  styles.levelPillText
                }
              >
                {t(
                  "level",

                  {
                    level:
                      progression.currentLevel,
                  }
                )}
              </Text>
            </View>

            <Text
              style={
                styles.heroSteps
              }
            >
              {formatNumber(
                progression.steps
              )}
            </Text>

            <Text
              style={
                styles.heroStepsLabel
              }
            >
              {t(
                "journeyLifetimeStepsTitle"
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
                      `${progression.progress}%`,
                  },
                ]}
              />
            </View>

            {/* ==================================================
                NEXT TRACKSUIT
            ================================================== */}

            {progression.next ? (
              <View
                style={
                  styles.nextSuitBox
                }
              >
                <Text
                  style={
                    styles.nextSuitEyebrow
                  }
                >
                  {t(
                    "nextTracksuit"
                  )}
                </Text>

                <Text
                  style={
                    styles.nextSuitName
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
                    nextSuitName
                  }
                </Text>

                <Text
                  style={
                    styles.stepsRemaining
                  }
                >
                  {t(
                    "stepsRemaining",

                    {
                      count:
                        formatNumber(
                          progression.stepsRemaining
                        ),
                    }
                  )}
                </Text>

                <Text
                  style={
                    styles.unlockTarget
                  }
                >
                  {t(
                    "unlocksAt",

                    {
                      count:
                        formatNumber(
                          progression.nextTarget
                        ),
                    }
                  )}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.nextSuitBox,

                  styles.completeBox,
                ]}
              >
                <Text
                  style={
                    styles.completeTitle
                  }
                >
                  {t(
                    "allTracksuits"
                  )}
                </Text>

                <Text
                  style={
                    styles.unlockTarget
                  }
                >
                  {t(
                    "completeCollection"
                  )}
                </Text>
              </View>
            )}

            {/* ==================================================
                REFRESH
            ================================================== */}

            <TouchableOpacity
              style={
                styles.refreshButton
              }
              onPress={() =>
                loadRewards(
                  false
                )
              }
              activeOpacity={
                0.85
              }
            >
              {refreshing ? (
                <ActivityIndicator
                  size="small"
                  color={
                    COLORS.background
                  }
                />
              ) : (
                <Text
                  style={
                    styles.refreshButtonText
                  }
                >
                  {t(
                    "refreshRewards"
                  )}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ==================================================
              TRACKSUIT SECTION
          ================================================== */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            {t(
              "avatarRewards"
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "tracksuitUnlocks"
            )}
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            {t(
              "tracksuitDescription"
            )}
          </Text>

          <View
            style={
              styles.tracksuitList
            }
          >
            {TRACKSUITS.map(
              suit => {
                const unlocked =
                  lifetimeSteps >=
                  suit.unlockAt;

                const next =
                  progression
                    .next?.id ===
                  suit.id;

                return (
                  <View
                    key={
                      suit.id
                    }
                    style={[
                      styles.tracksuitRow,

                      unlocked &&
                        styles.tracksuitUnlocked,

                      next &&
                        styles.tracksuitNext,
                    ]}
                  >
                    <View
                      style={
                        styles.trackLevelCircle
                      }
                    >
                      <Text
                        style={
                          styles.trackLevelNumber
                        }
                      >
                        {
                          suit.level
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.trackSuitInfo
                      }
                    >
                      <Text
                        style={[
                          styles.trackSuitName,

                          unlocked &&
                            styles.unlockedText,
                        ]}
                        numberOfLines={
                          2
                        }
                        adjustsFontSizeToFit
                        minimumFontScale={
                          0.7
                        }
                      >
                        {tracksuitName(
                          suit
                        )}
                      </Text>

                      <Text
                        style={
                          styles.trackSuitSteps
                        }
                      >
                        {t(
                          "tracksuitSteps",

                          {
                            count:
                              formatNumber(
                                suit.unlockAt
                              ),
                          }
                        )}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusPill,

                        unlocked &&
                          styles.statusUnlocked,

                        next &&
                          styles.statusNext,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,

                          unlocked &&
                            styles.statusUnlockedText,

                          next &&
                            styles.statusNextText,
                        ]}
                      >
                        {unlocked
                          ? t(
                              "unlocked"
                            )
                          : next
                          ? t(
                              "nextStatus"
                            )
                          : t(
                              "locked"
                            )}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>

          {/* ==================================================
              REWARD CENTER
          ================================================== */}

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            {t(
              "rewardCenter"
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }
          >
            {t(
              "exploreRewards"
            )}
          </Text>

          {/* ACHIEVEMENTS */}

          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {
              if (
                typeof goToAchievements ===
                "function"
              ) {
                goToAchievements();
              }
            }}
            activeOpacity={
              0.85
            }
          >
            <Text
              style={
                styles.navigationEmoji
              }
            >
              🏆
            </Text>

            <View
              style={
                styles.navigationText
              }
            >
              <Text
                style={
                  styles.navigationTitle
                }
              >
                {t(
                  "achievements"
                )}
              </Text>

              <Text
                style={
                  styles.navigationSub
                }
              >
                {t(
                  "achievementDescription"
                )}
              </Text>
            </View>

            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* ==================================================
              WCOIN WALLET
          ================================================== */}

          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {
              if (
                typeof goToWCoins ===
                "function"
              ) {
                goToWCoins();
              }
            }}
            activeOpacity={
              0.85
            }
          >
            <Image
              source={
                WCOIN_IMAGE
              }
              style={
                styles.wcoinNavigationIcon
              }
              resizeMode="contain"
              accessibilityLabel="WCoin"
            />

            <View
              style={
                styles.navigationText
              }
            >
              <Text
                style={
                  styles.navigationTitle
                }
              >
                {t(
                  "wcoinWallet"
                )}
              </Text>

              <Text
                style={
                  styles.navigationBalance
                }
              >
                {formatNumber(
                  wcoinBalance
                )}{" "}
                WCoins
              </Text>

              <Text
                style={
                  styles.navigationSub
                }
              >
                {t(
                  "walletDescription"
                )}
              </Text>
            </View>

            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* ==================================================
              LEGATHON POINTS
          ================================================== */}

          <TouchableOpacity
            style={
              styles.navigationCard
            }
            onPress={() => {
              if (
                typeof goToLegathonPoints ===
                "function"
              ) {
                goToLegathonPoints();
              }
            }}
            activeOpacity={
              0.85
            }
          >
            <Text
              style={
                styles.navigationEmoji
              }
            >
              ⭐
            </Text>

            <View
              style={
                styles.navigationText
              }
            >
              <Text
                style={
                  styles.navigationTitle
                }
              >
                {t(
                  "legathonPoints"
                )}
              </Text>

              <Text
                style={
                  styles.navigationBalance
                }
              >
                {formatNumber(
                  legathonPoints
                )}{" "}
                {t(
                  "points"
                )}
              </Text>

              <Text
                style={
                  styles.navigationSub
                }
              >
                {
                  currentRank
                }
              </Text>
            </View>

            <Text
              style={
                styles.navigationArrow
              }
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* ==================================================
              HOW REWARDS WORK
          ================================================== */}

          <View
            style={
              styles.infoCard
            }
          >
            <Text
              style={
                styles.infoTitle
              }
            >
              {t(
                "howRewardsWork"
              )}
            </Text>

            <InfoRow
              number="1"
              title={
                t(
                  "walkJourneys"
                )
              }
              body={
                t(
                  "walkJourneysBody"
                )
              }
            />

            <InfoRow
              number="2"
              title={
                t(
                  "unlockTracksuits"
                )
              }
              body={
                t(
                  "unlockTracksuitsBody"
                )
              }
            />

            <InfoRow
              number="3"
              title={
                t(
                  "chooseOutfit"
                )
              }
              body={
                t(
                  "chooseOutfitBody"
                )
              }
            />

            <InfoRow
              number="4"
              title={
                t(
                  "earnCoinsPoints"
                )
              }
              body={
                t(
                  "earnCoinsPointsBody"
                )
              }
              last
            />
          </View>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (
            <View
              style={
                styles.loadingOverlay
              }
            >
              <ActivityIndicator
                size="large"
                color={
                  COLORS.gold
                }
              />
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ============================================================
// INFO ROW
// ============================================================

function InfoRow({
  number,
  title,
  body,
  last = false,
}) {
  return (
    <View
      style={[
        styles.infoRow,

        last &&
          styles.infoRowLast,
      ]}
    >
      <View
        style={
          styles.infoNumberCircle
        }
      >
        <Text
          style={
            styles.infoNumber
          }
        >
          {number}
        </Text>
      </View>

      <View
        style={
          styles.infoTextArea
        }
      >
        <Text
          style={
            styles.infoRowTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.infoBody
          }
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    safeArea: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 26,
      paddingTop: 18,
      paddingBottom: 180,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    topRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 44,
    },

    backButton: {
      paddingVertical: 10,
    },

    backText: {
      color: COLORS.gold,
      fontSize: 22,
      fontWeight: "900",
    },

    brandPill: {
      borderWidth: 1.5,
      borderColor:
        COLORS.gold,
      borderRadius: 28,
      paddingVertical: 11,
      paddingHorizontal: 24,
    },

    brandPillText: {
      color: COLORS.gold,
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 3,
    },

    pageTitle: {
      color: COLORS.white,
      fontSize: 51,
      lineHeight: 58,
      fontWeight: "900",
    },

    pageSubtitle: {
      color: COLORS.muted,
      fontSize: 20,
      lineHeight: 29,
      fontWeight: "700",
      marginTop: 18,
      marginBottom: 45,
    },

    // ==========================================================
    // SECTION TITLES
    // ==========================================================

    sectionEyebrow: {
      color: COLORS.gold,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 6,
    },

    sectionTitle: {
      color: COLORS.white,
      fontSize: 34,
      lineHeight: 41,
      fontWeight: "900",
      marginBottom: 12,
    },

    sectionDescription: {
      color: COLORS.muted,
      fontSize: 17,
      lineHeight: 27,
      fontWeight: "700",
      marginBottom: 22,
    },

    // ==========================================================
    // BALANCES
    // ==========================================================

    balanceGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      marginBottom: 38,
    },

    balanceCard: {
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 27,
      backgroundColor:
        COLORS.card,
      padding: 22,
    },

    fullBalanceCard: {
      width: "100%",
      minHeight: 155,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    balanceIcon: {
      width: 78,
      height: 78,
      borderRadius: 39,
      backgroundColor:
        COLORS.cardDeep,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 18,
    },

    balanceEmoji: {
      fontSize: 37,
    },

    balanceTextArea: {
      flex: 1,
    },

    balanceLabel: {
      color: COLORS.aqua,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.6,
    },

    balanceLarge: {
      color: COLORS.white,
      fontSize: 39,
      lineHeight: 45,
      fontWeight: "900",
      marginTop: 5,
    },

    balanceSub: {
      color: COLORS.muted,
      fontSize: 14,
      fontWeight: "700",
      marginTop: 3,
    },

    halfBalanceCard: {
      width: "48%",
      minHeight: 190,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 25,
      backgroundColor:
        COLORS.card,
      padding: 19,
      justifyContent:
        "center",
    },

    wcoinBalanceIcon: {
      width: 42,
      height: 42,
      marginBottom: 11,
    },

    wcoinNavigationIcon: {
      width: 36,
      height: 36,
      marginRight: 14,
    },

    currencyEmoji: {
      fontSize: 31,
      marginBottom: 11,
    },

    smallBalanceLabel: {
      color: COLORS.muted,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    smallBalanceValue: {
      color: COLORS.white,
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "900",
      marginTop: 5,
    },

    cardLink: {
      color: COLORS.gold,
      fontSize: 13,
      fontWeight: "900",
      marginTop: 13,
    },

    // ==========================================================
    // RANK
    // ==========================================================

    rankCard: {
      borderWidth: 1,
      borderColor:
        COLORS.goldDark,
      borderRadius: 25,
      backgroundColor:
        COLORS.card,
      padding: 23,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 24,
    },

    rankLeft: {
      flex: 1,
      paddingRight: 12,
    },

    cardEyebrow: {
      color: COLORS.gold,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2,
    },

    rankName: {
      color: COLORS.white,
      fontSize: 25,
      fontWeight: "900",
      marginTop: 5,
    },

    rankRight: {
      alignItems:
        "flex-end",
      maxWidth: "53%",
    },

    rankNext: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
    },

    rankRemaining: {
      color: COLORS.muted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
      textAlign: "right",
    },

    // ==========================================================
    // TRACKSUIT PROGRESSION
    // ==========================================================

    progressCard: {
      borderWidth: 1.5,
      borderColor:
        COLORS.goldDark,
      borderRadius: 28,
      backgroundColor:
        COLORS.card,
      padding: 25,
      marginBottom: 44,
    },

    currentSuitName: {
      color: COLORS.white,
      fontSize: 42,
      lineHeight: 50,
      fontWeight: "900",
      marginTop: 11,
    },

    levelPill: {
      alignSelf:
        "flex-start",
      borderWidth: 1,
      borderColor:
        COLORS.goldDark,
      backgroundColor:
        "#252617",
      borderRadius: 22,
      paddingVertical: 9,
      paddingHorizontal: 17,
      marginTop: 15,
    },

    levelPillText: {
      color: COLORS.gold,
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    heroSteps: {
      color: COLORS.white,
      fontSize: 53,
      lineHeight: 62,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 36,
    },

    heroStepsLabel: {
      color: COLORS.muted,
      fontSize: 18,
      fontWeight: "800",
      textAlign: "center",
    },

    progressTrack: {
      width: "100%",
      height: 14,
      borderRadius: 8,
      backgroundColor:
        "#213248",
      overflow: "hidden",
      marginTop: 27,
    },

    progressFill: {
      height: "100%",
      backgroundColor:
        COLORS.gold,
      borderRadius: 8,
    },

    nextSuitBox: {
      borderWidth: 1,
      borderColor:
        COLORS.goldDark,
      borderRadius: 22,
      backgroundColor:
        "#171D25",
      padding: 20,
      marginTop: 27,
    },

    nextSuitEyebrow: {
      color: COLORS.gold,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2,
    },

    nextSuitName: {
      color: COLORS.white,
      fontSize: 28,
      fontWeight: "900",
      marginTop: 8,
    },

    stepsRemaining: {
      color: COLORS.gold,
      fontSize: 21,
      fontWeight: "900",
      marginTop: 14,
    },

    unlockTarget: {
      color: COLORS.muted,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
      marginTop: 5,
    },

    completeBox: {
      borderColor:
        COLORS.green,
      backgroundColor:
        COLORS.greenDark,
    },

    completeTitle: {
      color: COLORS.green,
      fontSize: 18,
      fontWeight: "900",
    },

    refreshButton: {
      minHeight: 66,
      borderRadius: 28,
      backgroundColor:
        COLORS.gold,
      justifyContent:
        "center",
      alignItems: "center",
      paddingHorizontal: 15,
      marginTop: 27,
    },

    refreshButtonText: {
      color:
        COLORS.background,
      fontSize: 19,
      fontWeight: "900",
      textAlign: "center",
    },

    // ==========================================================
    // TRACKSUITS
    // ==========================================================

    tracksuitList: {
      marginBottom: 46,
    },

    tracksuitRow: {
      minHeight: 125,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 24,
      backgroundColor:
        COLORS.card,
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      marginBottom: 13,
    },

    tracksuitUnlocked: {
      borderColor:
        COLORS.green,
    },

    tracksuitNext: {
      borderColor:
        COLORS.gold,
    },

    trackLevelCircle: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor:
        COLORS.cardDeep,
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 15,
    },

    trackLevelNumber: {
      color: COLORS.gold,
      fontSize: 28,
      fontWeight: "900",
    },

    trackSuitInfo: {
      flex: 1,
    },

    trackSuitName: {
      color: "#7F8DA3",
      fontSize: 20,
      fontWeight: "900",
    },

    unlockedText: {
      color: COLORS.white,
    },

    trackSuitSteps: {
      color: COLORS.muted,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "700",
      marginTop: 5,
    },

    statusPill: {
      borderWidth: 1,
      borderColor:
        COLORS.mutedDark,
      borderRadius: 20,
      paddingVertical: 9,
      paddingHorizontal: 10,
      marginLeft: 8,
      maxWidth: 110,
    },

    statusText: {
      color: COLORS.muted,
      fontSize: 10,
      fontWeight: "900",
      textAlign: "center",
    },

    statusUnlocked: {
      borderColor:
        COLORS.green,
      backgroundColor:
        COLORS.greenDark,
    },

    statusUnlockedText: {
      color: COLORS.green,
    },

    statusNext: {
      borderColor:
        COLORS.gold,
    },

    statusNextText: {
      color: COLORS.gold,
    },

    // ==========================================================
    // NAVIGATION
    // ==========================================================

    navigationCard: {
      minHeight: 132,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 25,
      backgroundColor:
        COLORS.card,
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      marginBottom: 14,
    },

    navigationEmoji: {
      fontSize: 34,
      width: 50,
    },

    navigationText: {
      flex: 1,
    },

    navigationTitle: {
      color: COLORS.white,
      fontSize: 23,
      fontWeight: "900",
    },

    navigationBalance: {
      color: COLORS.gold,
      fontSize: 18,
      fontWeight: "900",
      marginTop: 5,
    },

    navigationSub: {
      color: COLORS.muted,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      marginTop: 4,
    },

    navigationArrow: {
      color: COLORS.gold,
      fontSize: 36,
      marginLeft: 10,
    },

    // ==========================================================
    // HOW REWARDS WORK
    // ==========================================================

    infoCard: {
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 27,
      backgroundColor:
        COLORS.card,
      padding: 23,
      marginTop: 30,
    },

    infoTitle: {
      color: COLORS.white,
      fontSize: 28,
      fontWeight: "900",
      marginBottom: 10,
    },

    infoRow: {
      flexDirection: "row",
      paddingVertical: 19,
      borderBottomWidth: 1,
      borderBottomColor:
        "#1D3048",
    },

    infoRowLast: {
      borderBottomWidth: 0,
    },

    infoNumberCircle: {
      width: 39,
      height: 39,
      borderRadius: 20,
      backgroundColor:
        "#2A2513",
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 14,
    },

    infoNumber: {
      color: COLORS.gold,
      fontSize: 17,
      fontWeight: "900",
    },

    infoTextArea: {
      flex: 1,
    },

    infoRowTitle: {
      color: COLORS.white,
      fontSize: 17,
      fontWeight: "900",
    },

    infoBody: {
      color: COLORS.muted,
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600",
      marginTop: 5,
    },

    loadingOverlay: {
      position: "absolute",
      top: 150,
      left: 0,
      right: 0,
      alignItems: "center",
    },
  });