import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";

// screens/RewardsScreen.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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



import { getWCoins } from "../utils/wcoinStorage";
import { getJourneyLifetimeSteps } from "../utils/stepTrackingEngine";
import useLegathonPoints from "../hooks/useLegathonPoints";

// ============================================================
// LEGATHON WALK — REWARDS SCREEN
// All 10 languages
// Information-only cards
// Official WCoin image
// Existing rewards and storage preserved
// ============================================================

const WCOIN_IMAGE = require("../assets/wcoin.png");

const COLORS = {
  background: "#020711",
  card: "#081526",
  cardDeep: "#06101D",
  gold: "#F4C126",
  goldDark: "#8F6B13",
  white: "#FFFFFF",
  muted: "#9EABC0",
  aqua: "#78F1D0",
  green: "#67E0A7",
  greenDark: "#123B2D",
  border: "#29415F",
};

// These are cumulative Journey Lifetime Step milestones.
// Keep the existing thresholds and stable IDs.

const TRACKSUITS = [
  { id: "blue", level: 1, unlockAt: 150000 },
  { id: "green", level: 2, unlockAt: 400000 },
  { id: "red", level: 3, unlockAt: 750000 },
  { id: "yellow", level: 4, unlockAt: 1250000 },
  { id: "elite", level: 5, unlockAt: 4250000 },
];

// ============================================================
// MULTILINGUAL TEXT
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    rewards: "Rewards",
    subtitle:
      "Your walking milestones, earned currency, points and tracksuit progression.",
    dashboard: "YOUR REWARD DASHBOARD",
    balances: "Your Balances",
    lifetime: "JOURNEY LIFETIME STEPS",
    progressionSteps: "Tracksuit progression steps",
    wcoins: "WCOINS",
    points: "LEGATHON POINTS",
    rank: "LEGATHON RANK",
    nextRank: "Next: {rank}",
    pointsRemaining: "{count} points remaining",
    maxRank: "Maximum rank reached",
    currentSuit: "CURRENT TRACKSUIT MILESTONE",
    level: "LEVEL {level} / 5",
    lifetimeTitle: "Journey Lifetime Steps",
    nextSuit: "NEXT TRACKSUIT",
    stepsRemaining: "{count} steps remaining",
    unlocksAt:
      "Unlocks at {count} Journey Lifetime Steps",
    allUnlocked: "ALL TRACKSUITS UNLOCKED",
    collectionComplete:
      "You reached the complete tracksuit collection.",
    refresh: "Refresh Rewards",
    avatarRewards: "AVATAR REWARDS",
    suitUnlocks: "Tracksuit Unlocks",
    suitDescription:
      "Tracksuits unlock from Journey Lifetime Steps. Once earned, each suit stays available in Avatar Center.",
    suitSteps: "{count} Journey Lifetime Steps",
    unlocked: "UNLOCKED",
    next: "NEXT",
    locked: "LOCKED",
    rewardCenter: "REWARD CENTER",
    overview: "Rewards Overview",
    achievements: "Achievements",
    achievementsInfo:
      "Your walking milestones and earned badges.",
    wallet: "WCoin Balance",
    walletInfo: "Your current WCoin rewards balance.",
    pointsInfo: "Your current Legathon rank.",
    how: "How Rewards Work",
    walk: "Walk Journeys",
    walkInfo:
      "Journey walking adds to your Journey Lifetime Steps. Marathon steps stay separate.",
    unlock: "Unlock Tracksuits",
    unlockInfo:
      "Reach each Journey Lifetime Step milestone to permanently unlock that tracksuit.",
    outfit: "Choose Your Outfit",
    outfitInfo:
      "Choose any earned tracksuit in Avatar Center. Unlocking a new suit does not automatically change your outfit.",
    earn: "Earn WCoins & Points",
    earnInfo:
      "WCoins and Legathon Points are separate reward systems. Your latest stored totals appear above.",
    standard: "Standard",
    blue: "Blue",
    green: "Green",
    red: "Red",
    yellow: "Yellow",
    eliteSuit: "Black & Gold Elite",
    newWalker: "New Walker",
    explorer: "Explorer",
    pathfinder: "Pathfinder",
    trailblazer: "Trailblazer",
    adventurer: "Adventurer",
    legend: "Legend",
    elite: "Elite",
    max: "MAX",
  },

  es: {
    back: "Atrás",
    rewards: "Recompensas",
    subtitle:
      "Tus logros de caminata, monedas, puntos y progreso de conjuntos deportivos.",
    dashboard: "TU PANEL DE RECOMPENSAS",
    balances: "Tus Saldos",
    lifetime: "PASOS ACUMULADOS DE VIAJES",
    progressionSteps: "Pasos para desbloquear conjuntos",
    wcoins: "WCOINS",
    points: "PUNTOS LEGATHON",
    rank: "RANGO LEGATHON",
    nextRank: "Siguiente: {rank}",
    pointsRemaining: "Faltan {count} puntos",
    maxRank: "Rango máximo alcanzado",
    currentSuit: "META ACTUAL DEL CONJUNTO",
    level: "NIVEL {level} / 5",
    lifetimeTitle: "Pasos Acumulados de Viajes",
    nextSuit: "SIGUIENTE CONJUNTO",
    stepsRemaining: "Faltan {count} pasos",
    unlocksAt: "Se desbloquea a los {count} pasos acumulados",
    allUnlocked: "TODOS LOS CONJUNTOS DESBLOQUEADOS",
    collectionComplete: "Has completado la colección de conjuntos.",
    refresh: "Actualizar Recompensas",
    avatarRewards: "RECOMPENSAS DEL AVATAR",
    suitUnlocks: "Desbloqueo de Conjuntos",
    suitDescription:
      "Los conjuntos se desbloquean con los pasos acumulados de viajes. Una vez obtenidos, permanecen disponibles en el Centro de Avatar.",
    suitSteps: "{count} pasos acumulados",
    unlocked: "DESBLOQUEADO",
    next: "SIGUIENTE",
    locked: "BLOQUEADO",
    rewardCenter: "CENTRO DE RECOMPENSAS",
    overview: "Resumen de Recompensas",
    achievements: "Logros",
    achievementsInfo: "Tus metas de caminata e insignias obtenidas.",
    wallet: "Saldo WCoin",
    walletInfo: "Tu saldo actual de recompensas WCoin.",
    pointsInfo: "Tu rango actual en Legathon.",
    how: "Cómo Funcionan las Recompensas",
    walk: "Camina en los Viajes",
    walkInfo:
      "Los pasos de los viajes aumentan el total acumulado. Los pasos de maratones se mantienen separados.",
    unlock: "Desbloquea Conjuntos",
    unlockInfo:
      "Alcanza cada meta de pasos para desbloquear permanentemente su conjunto.",
    outfit: "Elige Tu Atuendo",
    outfitInfo:
      "Elige cualquier conjunto ganado en el Centro de Avatar. Los nuevos conjuntos no cambian tu atuendo automáticamente.",
    earn: "Gana WCoins y Puntos",
    earnInfo:
      "WCoins y Puntos Legathon son sistemas separados. Los totales guardados aparecen arriba.",
    standard: "Estándar",
    blue: "Azul",
    green: "Verde",
    red: "Rojo",
    yellow: "Amarillo",
    eliteSuit: "Elite Negro y Dorado",
    newWalker: "Caminante Nuevo",
    explorer: "Explorador",
    pathfinder: "Pionero",
    trailblazer: "Precursor",
    adventurer: "Aventurero",
    legend: "Leyenda",
    elite: "Elite",
    max: "MÁX",
  },

  fr: {
    back: "Retour",
    rewards: "Récompenses",
    subtitle:
      "Vos étapes de marche, monnaie gagnée, points et progression des survêtements.",
    dashboard: "VOTRE TABLEAU DE RÉCOMPENSES",
    balances: "Vos Soldes",
    lifetime: "PAS CUMULÉS DES VOYAGES",
    progressionSteps: "Pas de progression des survêtements",
    wcoins: "WCOINS",
    points: "POINTS LEGATHON",
    rank: "RANG LEGATHON",
    nextRank: "Suivant : {rank}",
    pointsRemaining: "{count} points restants",
    maxRank: "Rang maximum atteint",
    currentSuit: "PALIER ACTUEL DU SURVÊTEMENT",
    level: "NIVEAU {level} / 5",
    lifetimeTitle: "Pas Cumulés des Voyages",
    nextSuit: "PROCHAIN SURVÊTEMENT",
    stepsRemaining: "{count} pas restants",
    unlocksAt: "Se débloque à {count} pas cumulés",
    allUnlocked: "TOUS LES SURVÊTEMENTS DÉBLOQUÉS",
    collectionComplete:
      "Vous avez terminé la collection des survêtements.",
    refresh: "Actualiser les Récompenses",
    avatarRewards: "RÉCOMPENSES AVATAR",
    suitUnlocks: "Déblocage des Survêtements",
    suitDescription:
      "Les survêtements se débloquent grâce aux pas cumulés des voyages. Une fois gagnés, ils restent disponibles dans le Centre Avatar.",
    suitSteps: "{count} pas cumulés",
    unlocked: "DÉBLOQUÉ",
    next: "SUIVANT",
    locked: "VERROUILLÉ",
    rewardCenter: "CENTRE DE RÉCOMPENSES",
    overview: "Aperçu des Récompenses",
    achievements: "Succès",
    achievementsInfo: "Vos étapes de marche et badges obtenus.",
    wallet: "Solde WCoin",
    walletInfo: "Votre solde actuel de WCoins.",
    pointsInfo: "Votre rang Legathon actuel.",
    how: "Comment Fonctionnent les Récompenses",
    walk: "Parcourir les Voyages",
    walkInfo:
      "Les pas des voyages s'ajoutent au total cumulé. Les pas des marathons restent séparés.",
    unlock: "Débloquer les Survêtements",
    unlockInfo:
      "Atteignez chaque palier pour débloquer définitivement le survêtement.",
    outfit: "Choisir Votre Tenue",
    outfitInfo:
      "Choisissez un survêtement gagné dans le Centre Avatar. Un nouveau déblocage ne change pas automatiquement votre tenue.",
    earn: "Gagner des WCoins et des Points",
    earnInfo:
      "Les WCoins et les Points Legathon sont deux systèmes distincts dont les totaux figurent ci-dessus.",
    standard: "Standard",
    blue: "Bleu",
    green: "Vert",
    red: "Rouge",
    yellow: "Jaune",
    eliteSuit: "Elite Noir et Or",
    newWalker: "Nouveau Marcheur",
    explorer: "Explorateur",
    pathfinder: "Éclaireur",
    trailblazer: "Pionnier",
    adventurer: "Aventurier",
    legend: "Légende",
    elite: "Elite",
    max: "MAX",
  },

  de: {
    back: "Zurück",
    rewards: "Belohnungen",
    subtitle:
      "Deine Geh-Meilensteine, Währung, Punkte und Trainingsanzug-Fortschritte.",
    dashboard: "DEIN BELOHNUNGS-DASHBOARD",
    balances: "Deine Guthaben",
    lifetime: "REISE-GESAMTSCHRITTE",
    progressionSteps: "Schritte für Trainingsanzüge",
    wcoins: "WCOINS",
    points: "LEGATHON-PUNKTE",
    rank: "LEGATHON-RANG",
    nextRank: "Nächster: {rank}",
    pointsRemaining: "{count} Punkte verbleiben",
    maxRank: "Maximaler Rang erreicht",
    currentSuit: "AKTUELLER TRAININGSANZUG-MEILENSTEIN",
    level: "LEVEL {level} / 5",
    lifetimeTitle: "Reise-Gesamtschritte",
    nextSuit: "NÄCHSTER TRAININGSANZUG",
    stepsRemaining: "{count} Schritte verbleiben",
    unlocksAt: "Freischaltung bei {count} Gesamtschritten",
    allUnlocked: "ALLE TRAININGSANZÜGE FREIGESCHALTET",
    collectionComplete:
      "Du hast die gesamte Trainingsanzug-Sammlung freigeschaltet.",
    refresh: "Belohnungen Aktualisieren",
    avatarRewards: "AVATAR-BELOHNUNGEN",
    suitUnlocks: "Trainingsanzüge Freischalten",
    suitDescription:
      "Trainingsanzüge werden durch Reise-Gesamtschritte freigeschaltet und bleiben im Avatar-Center verfügbar.",
    suitSteps: "{count} Reise-Gesamtschritte",
    unlocked: "FREIGESCHALTET",
    next: "NÄCHSTER",
    locked: "GESPERRT",
    rewardCenter: "BELOHNUNGSZENTRUM",
    overview: "Belohnungsübersicht",
    achievements: "Erfolge",
    achievementsInfo: "Deine Geh-Meilensteine und Abzeichen.",
    wallet: "WCoin-Guthaben",
    walletInfo: "Dein aktuelles WCoin-Guthaben.",
    pointsInfo: "Dein aktueller Legathon-Rang.",
    how: "So Funktionieren Belohnungen",
    walk: "Reisen Gehen",
    walkInfo:
      "Reiseschritte erhöhen deine Gesamtschritte. Marathonschritte bleiben getrennt.",
    unlock: "Trainingsanzüge Freischalten",
    unlockInfo:
      "Erreiche jeden Meilenstein, um den Anzug dauerhaft freizuschalten.",
    outfit: "Wähle Dein Outfit",
    outfitInfo:
      "Wähle einen verdienten Anzug im Avatar-Center. Neue Freischaltungen ändern dein Outfit nicht automatisch.",
    earn: "WCoins und Punkte Verdienen",
    earnInfo:
      "WCoins und Legathon-Punkte sind getrennte Systeme mit eigenen gespeicherten Werten.",
    standard: "Standard",
    blue: "Blau",
    green: "Grün",
    red: "Rot",
    yellow: "Gelb",
    eliteSuit: "Schwarz & Gold Elite",
    newWalker: "Neuer Walker",
    explorer: "Entdecker",
    pathfinder: "Pfadfinder",
    trailblazer: "Wegbereiter",
    adventurer: "Abenteurer",
    legend: "Legende",
    elite: "Elite",
    max: "MAX",
  },

  pt: {
    back: "Voltar",
    rewards: "Recompensas",
    subtitle:
      "Seus marcos de caminhada, WCoins, pontos e progresso dos agasalhos.",
    dashboard: "SEU PAINEL DE RECOMPENSAS",
    balances: "Seus Saldos",
    lifetime: "PASSOS TOTAIS DAS JORNADAS",
    progressionSteps: "Passos para progressão dos agasalhos",
    wcoins: "WCOINS",
    points: "PONTOS LEGATHON",
    rank: "CLASSIFICAÇÃO LEGATHON",
    nextRank: "Próximo: {rank}",
    pointsRemaining: "Faltam {count} pontos",
    maxRank: "Classificação máxima alcançada",
    currentSuit: "MARCO ATUAL DO AGASALHO",
    level: "NÍVEL {level} / 5",
    lifetimeTitle: "Passos Totais das Jornadas",
    nextSuit: "PRÓXIMO AGASALHO",
    stepsRemaining: "Faltam {count} passos",
    unlocksAt: "Desbloqueia com {count} passos acumulados",
    allUnlocked: "TODOS OS AGASALHOS DESBLOQUEADOS",
    collectionComplete:
      "Você completou toda a coleção de agasalhos.",
    refresh: "Atualizar Recompensas",
    avatarRewards: "RECOMPENSAS DO AVATAR",
    suitUnlocks: "Desbloqueio de Agasalhos",
    suitDescription:
      "Os agasalhos são desbloqueados pelos Passos Totais das Jornadas e permanecem disponíveis no Centro de Avatar.",
    suitSteps: "{count} passos acumulados",
    unlocked: "DESBLOQUEADO",
    next: "PRÓXIMO",
    locked: "BLOQUEADO",
    rewardCenter: "CENTRO DE RECOMPENSAS",
    overview: "Resumo das Recompensas",
    achievements: "Conquistas",
    achievementsInfo:
      "Seus marcos de caminhada e emblemas conquistados.",
    wallet: "Saldo WCoin",
    walletInfo: "Seu saldo atual de WCoins.",
    pointsInfo: "Sua classificação Legathon atual.",
    how: "Como Funcionam as Recompensas",
    walk: "Caminhe nas Jornadas",
    walkInfo:
      "Os passos das jornadas aumentam o total acumulado. Passos de maratonas ficam separados.",
    unlock: "Desbloqueie Agasalhos",
    unlockInfo:
      "Alcance cada marco para desbloquear o agasalho permanentemente.",
    outfit: "Escolha Seu Visual",
    outfitInfo:
      "Escolha qualquer agasalho conquistado no Centro de Avatar. Novos desbloqueios não mudam a roupa automaticamente.",
    earn: "Ganhe WCoins e Pontos",
    earnInfo:
      "WCoins e Pontos Legathon são sistemas separados cujos totais aparecem acima.",
    standard: "Padrão",
    blue: "Azul",
    green: "Verde",
    red: "Vermelho",
    yellow: "Amarelo",
    eliteSuit: "Elite Preto e Dourado",
    newWalker: "Novo Caminhante",
    explorer: "Explorador",
    pathfinder: "Desbravador",
    trailblazer: "Pioneiro",
    adventurer: "Aventureiro",
    legend: "Lenda",
    elite: "Elite",
    max: "MÁX",
  },

  ja: {
    back: "戻る",
    rewards: "報酬",
    subtitle:
      "歩行実績、WCoins、ポイント、トラックスーツの進捗を確認できます。",
    dashboard: "報酬ダッシュボード",
    balances: "保有残高",
    lifetime: "ジャーニー累計歩数",
    progressionSteps: "トラックスーツ進捗歩数",
    wcoins: "WCOINS",
    points: "LEGATHONポイント",
    rank: "LEGATHONランク",
    nextRank: "次: {rank}",
    pointsRemaining: "あと {count} ポイント",
    maxRank: "最高ランクに到達",
    currentSuit: "現在のトラックスーツマイルストーン",
    level: "レベル {level} / 5",
    lifetimeTitle: "ジャーニー累計歩数",
    nextSuit: "次のトラックスーツ",
    stepsRemaining: "あと {count} 歩",
    unlocksAt: "累計 {count} 歩で解除",
    allUnlocked: "全トラックスーツ解除済み",
    collectionComplete:
      "トラックスーツのコレクションを完了しました。",
    refresh: "報酬を更新",
    avatarRewards: "アバター報酬",
    suitUnlocks: "トラックスーツ解除",
    suitDescription:
      "トラックスーツはジャーニー累計歩数で解除され、アバターセンターで引き続き利用できます。",
    suitSteps: "ジャーニー累計 {count} 歩",
    unlocked: "解除済み",
    next: "次",
    locked: "ロック中",
    rewardCenter: "報酬センター",
    overview: "報酬の概要",
    achievements: "実績",
    achievementsInfo: "歩行実績と獲得バッジ。",
    wallet: "WCoin残高",
    walletInfo: "現在のWCoin報酬残高。",
    pointsInfo: "現在のLegathonランク。",
    how: "報酬の仕組み",
    walk: "ジャーニーを歩く",
    walkInfo:
      "ジャーニーの歩数は累計歩数に加算されます。マラソンの歩数は別に管理されます。",
    unlock: "トラックスーツを解除",
    unlockInfo:
      "各歩数目標に到達すると衣装が永久に解除されます。",
    outfit: "衣装を選ぶ",
    outfitInfo:
      "アバターセンターで獲得した衣装を選べます。新しい衣装は自動的に着用されません。",
    earn: "WCoinsとポイントを獲得",
    earnInfo:
      "WCoinsとLegathonポイントは別々の報酬システムです。最新の残高は上に表示されます。",
    standard: "スタンダード",
    blue: "ブルー",
    green: "グリーン",
    red: "レッド",
    yellow: "イエロー",
    eliteSuit: "ブラック＆ゴールド Elite",
    newWalker: "新しいウォーカー",
    explorer: "エクスプローラー",
    pathfinder: "パスファインダー",
    trailblazer: "トレイルブレイザー",
    adventurer: "アドベンチャラー",
    legend: "レジェンド",
    elite: "Elite",
    max: "MAX",
  },

  ko: {
    back: "뒤로",
    rewards: "보상",
    subtitle:
      "걷기 업적, WCoins, 포인트 및 트랙수트 진행 상황을 확인하세요.",
    dashboard: "보상 대시보드",
    balances: "보유 잔액",
    lifetime: "여정 누적 걸음 수",
    progressionSteps: "트랙수트 진행 걸음 수",
    wcoins: "WCOINS",
    points: "LEGATHON 포인트",
    rank: "LEGATHON 등급",
    nextRank: "다음: {rank}",
    pointsRemaining: "{count} 포인트 남음",
    maxRank: "최고 등급 달성",
    currentSuit: "현재 트랙수트 마일스톤",
    level: "레벨 {level} / 5",
    lifetimeTitle: "여정 누적 걸음 수",
    nextSuit: "다음 트랙수트",
    stepsRemaining: "{count}걸음 남음",
    unlocksAt: "누적 {count}걸음에서 잠금 해제",
    allUnlocked: "모든 트랙수트 잠금 해제",
    collectionComplete:
      "트랙수트 컬렉션을 모두 완성했습니다.",
    refresh: "보상 새로고침",
    avatarRewards: "아바타 보상",
    suitUnlocks: "트랙수트 잠금 해제",
    suitDescription:
      "트랙수트는 여정 누적 걸음 수로 잠금 해제됩니다. 획득한 의상은 아바타 센터에서 계속 사용할 수 있습니다.",
    suitSteps: "여정 누적 {count}걸음",
    unlocked: "잠금 해제",
    next: "다음",
    locked: "잠김",
    rewardCenter: "보상 센터",
    overview: "보상 개요",
    achievements: "업적",
    achievementsInfo: "걷기 목표와 획득한 배지.",
    wallet: "WCoin 지갑",
    walletInfo: "현재 WCoins 보상 잔액.",
    pointsInfo: "현재 Legathon 등급.",
    how: "보상 이용 방법",
    walk: "여정 걷기",
    walkInfo:
      "여정 걸음 수는 누적 걸음에 추가됩니다. 마라톤 걸음은 별도로 유지됩니다.",
    unlock: "트랙수트 잠금 해제",
    unlockInfo:
      "각 걸음 목표를 달성하면 해당 트랙수트가 영구적으로 해제됩니다.",
    outfit: "의상 선택",
    outfitInfo:
      "아바타 센터에서 획득한 의상을 선택하세요. 새 의상은 자동으로 착용되지 않습니다.",
    earn: "WCoins 및 포인트 획득",
    earnInfo:
      "WCoins와 Legathon 포인트는 별도의 보상 시스템입니다. 저장된 잔액은 위에 표시됩니다.",
    standard: "기본",
    blue: "블루",
    green: "그린",
    red: "레드",
    yellow: "옐로우",
    eliteSuit: "블랙 & 골드 Elite",
    newWalker: "새로운 워커",
    explorer: "탐험가",
    pathfinder: "개척자",
    trailblazer: "선구자",
    adventurer: "모험가",
    legend: "레전드",
    elite: "Elite",
    max: "MAX",
  },

  zh: {
    back: "返回",
    rewards: "奖励",
    subtitle:
      "查看你的步行成就、WCoins、积分和运动服进度。",
    dashboard: "奖励面板",
    balances: "你的余额",
    lifetime: "旅程累计步数",
    progressionSteps: "运动服进度步数",
    wcoins: "WCOINS",
    points: "LEGATHON积分",
    rank: "LEGATHON等级",
    nextRank: "下一级：{rank}",
    pointsRemaining: "还需 {count} 积分",
    maxRank: "已达到最高等级",
    currentSuit: "当前运动服里程碑",
    level: "等级 {level} / 5",
    lifetimeTitle: "旅程累计步数",
    nextSuit: "下一套运动服",
    stepsRemaining: "还需 {count} 步",
    unlocksAt: "累计达到 {count} 步时解锁",
    allUnlocked: "所有运动服已解锁",
    collectionComplete: "你已完成全部运动服收藏。",
    refresh: "刷新奖励",
    avatarRewards: "虚拟形象奖励",
    suitUnlocks: "运动服解锁",
    suitDescription:
      "运动服根据旅程累计步数解锁，获得后会永久保留，可在虚拟形象中心选择。",
    suitSteps: "{count} 旅程累计步数",
    unlocked: "已解锁",
    next: "下一个",
    locked: "未解锁",
    rewardCenter: "奖励中心",
    overview: "奖励概览",
    achievements: "成就",
    achievementsInfo: "你的步行里程碑和已获徽章。",
    wallet: "WCoin余额",
    walletInfo: "当前WCoins奖励余额。",
    pointsInfo: "当前Legathon等级。",
    how: "奖励机制",
    walk: "步行完成旅程",
    walkInfo:
      "旅程步数计入累计步数。马拉松步数独立计算。",
    unlock: "解锁运动服",
    unlockInfo:
      "达到各步数里程碑即可永久解锁对应运动服。",
    outfit: "选择你的服装",
    outfitInfo:
      "可在虚拟形象中心选择已获得的运动服。新解锁的服装不会自动替换当前服装。",
    earn: "赚取WCoins和积分",
    earnInfo:
      "WCoins和Legathon积分是独立的奖励系统，上方显示最新保存的总额。",
    standard: "标准",
    blue: "蓝色",
    green: "绿色",
    red: "红色",
    yellow: "黄色",
    eliteSuit: "黑金Elite",
    newWalker: "新手行者",
    explorer: "探索者",
    pathfinder: "开拓者",
    trailblazer: "先锋",
    adventurer: "冒险家",
    legend: "传奇",
    elite: "Elite",
    max: "最高",
  },

  it: {
    back: "Indietro",
    rewards: "Premi",
    subtitle:
      "I tuoi traguardi di camminata, WCoins, punti e progressione delle tute.",
    dashboard: "IL TUO PANNELLO PREMI",
    balances: "I Tuoi Saldi",
    lifetime: "PASSI TOTALI DEI PERCORSI",
    progressionSteps: "Passi per la progressione delle tute",
    wcoins: "WCOINS",
    points: "PUNTI LEGATHON",
    rank: "GRADO LEGATHON",
    nextRank: "Successivo: {rank}",
    pointsRemaining: "{count} punti rimanenti",
    maxRank: "Grado massimo raggiunto",
    currentSuit: "TRAGUARDO ATTUALE DELLA TUTA",
    level: "LIVELLO {level} / 5",
    lifetimeTitle: "Passi Totali dei Percorsi",
    nextSuit: "PROSSIMA TUTA",
    stepsRemaining: "{count} passi rimanenti",
    unlocksAt: "Si sblocca a {count} passi accumulati",
    allUnlocked: "TUTTE LE TUTE SBLOCCATE",
    collectionComplete:
      "Hai completato l'intera collezione di tute.",
    refresh: "Aggiorna Premi",
    avatarRewards: "PREMI AVATAR",
    suitUnlocks: "Sblocco Tute",
    suitDescription:
      "Le tute si sbloccano con i passi accumulati dei percorsi. Una volta ottenute, restano disponibili nel Centro Avatar.",
    suitSteps: "{count} passi accumulati",
    unlocked: "SBLOCCATO",
    next: "PROSSIMO",
    locked: "BLOCCATO",
    rewardCenter: "CENTRO PREMI",
    overview: "Panoramica dei Premi",
    achievements: "Traguardi",
    achievementsInfo: "I tuoi traguardi e distintivi ottenuti.",
    wallet: "Saldo WCoin",
    walletInfo: "Il saldo attuale dei tuoi WCoins.",
    pointsInfo: "Il tuo grado Legathon attuale.",
    how: "Come Funzionano i Premi",
    walk: "Cammina nei Percorsi",
    walkInfo:
      "I passi dei percorsi aumentano il totale accumulato. I passi delle maratone restano separati.",
    unlock: "Sblocca Tute",
    unlockInfo:
      "Raggiungi ogni traguardo per sbloccare la tuta in modo permanente.",
    outfit: "Scegli il Tuo Outfit",
    outfitInfo:
      "Scegli qualsiasi tuta ottenuta nel Centro Avatar. Le nuove tute non vengono indossate automaticamente.",
    earn: "Guadagna WCoins e Punti",
    earnInfo:
      "WCoins e Punti Legathon sono sistemi separati. I totali salvati sono mostrati sopra.",
    standard: "Standard",
    blue: "Blu",
    green: "Verde",
    red: "Rosso",
    yellow: "Giallo",
    eliteSuit: "Elite Nero e Oro",
    newWalker: "Nuovo Camminatore",
    explorer: "Esploratore",
    pathfinder: "Apripista",
    trailblazer: "Pioniere",
    adventurer: "Avventuriero",
    legend: "Leggenda",
    elite: "Elite",
    max: "MAX",
  },

  ar: {
    back: "رجوع",
    rewards: "المكافآت",
    subtitle:
      "إنجازات المشي وWCoins والنقاط وتقدم البدلات الرياضية.",
    dashboard: "لوحة المكافآت",
    balances: "أرصدتك",
    lifetime: "إجمالي خطوات الرحلات",
    progressionSteps: "خطوات تقدم البدلات",
    wcoins: "WCOINS",
    points: "نقاط LEGATHON",
    rank: "تصنيف LEGATHON",
    nextRank: "التالي: {rank}",
    pointsRemaining: "متبقي {count} نقطة",
    maxRank: "تم الوصول إلى أعلى تصنيف",
    currentSuit: "مرحلة البدلة الحالية",
    level: "المستوى {level} / 5",
    lifetimeTitle: "إجمالي خطوات الرحلات",
    nextSuit: "البدلة التالية",
    stepsRemaining: "متبقي {count} خطوة",
    unlocksAt: "تُفتح عند الوصول إلى {count} خطوة",
    allUnlocked: "تم فتح جميع البدلات",
    collectionComplete: "أكملت مجموعة البدلات بالكامل.",
    refresh: "تحديث المكافآت",
    avatarRewards: "مكافآت الصورة الرمزية",
    suitUnlocks: "فتح البدلات",
    suitDescription:
      "يتم فتح البدلات عن طريق إجمالي خطوات الرحلات. تبقى البدلات المكتسبة متاحة في مركز الصورة الرمزية.",
    suitSteps: "{count} من إجمالي خطوات الرحلات",
    unlocked: "مفتوح",
    next: "التالي",
    locked: "مغلق",
    rewardCenter: "مركز المكافآت",
    overview: "نظرة عامة على المكافآت",
    achievements: "الإنجازات",
    achievementsInfo: "إنجازات المشي والشارات المكتسبة.",
    wallet: "رصيد WCoin",
    walletInfo: "رصيد WCoins الحالي.",
    pointsInfo: "تصنيفك الحالي في Legathon.",
    how: "كيف تعمل المكافآت",
    walk: "المشي في الرحلات",
    walkInfo:
      "خطوات الرحلات تضاف إلى إجمالي خطوات الرحلات. خطوات الماراثون منفصلة.",
    unlock: "فتح البدلات",
    unlockInfo:
      "بلغ كل مرحلة من الخطوات لفتح البدلة بشكل دائم.",
    outfit: "اختر ملابسك",
    outfitInfo:
      "اختر أي بدلة مكتسبة في مركز الصورة الرمزية. لا يتم ارتداء البدلات الجديدة تلقائيًا.",
    earn: "اكسب WCoins والنقاط",
    earnInfo:
      "WCoins ونقاط Legathon نظامان منفصلان. تظهر أحدث الأرصدة المحفوظة أعلاه.",
    standard: "عادي",
    blue: "أزرق",
    green: "أخضر",
    red: "أحمر",
    yellow: "أصفر",
    eliteSuit: "Elite أسود وذهبي",
    newWalker: "مبتدئ",
    explorer: "مستكشف",
    pathfinder: "مكتشف المسار",
    trailblazer: "رائد",
    adventurer: "مغامر",
    legend: "أسطورة",
    elite: "Elite",
    max: "الأعلى",
  },
};

// ============================================================
// HELPERS
// ============================================================

function getLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return TEXT[code] ? code : "en";
}

function fillTemplate(template, variables = {}) {
  return String(template || "").replace(
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
  const number = Number(value ?? 0);
  return Number.isFinite(number)
    ? Math.max(0, number)
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

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, safeNumber(value)));
}

// ============================================================
// JOURNEY LIFETIME STEPS
// Keep existing storage compatibility.
// ============================================================

async function loadRewardLifetimeSteps() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const centralSteps = safeNumber(
      await _accountSession.run(async () => (getJourneyLifetimeSteps()))
    );

    const [lowerRaw, upperRaw] = await _accountSession.run(async () => (Promise.all([
      AsyncStorage.getItem("lifetimeSteps"),
      AsyncStorage.getItem("LifetimeSteps"),
    ])));

    const lifetimeSteps = Math.max(
      centralSteps,
      safeNumber(lowerRaw),
      safeNumber(upperRaw)
    );

    await _accountSession.run(async () => (Promise.all([
      AsyncStorage.setItem(
        "lifetimeSteps",
        String(lifetimeSteps)
      ),
      AsyncStorage.setItem(
        "LifetimeSteps",
        String(lifetimeSteps)
      ),
    ])));

    return lifetimeSteps;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Rewards lifetime steps error:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// ============================================================
// TRACKSUIT PROGRESSION
// ============================================================

function calculateTracksuitProgress(lifetimeSteps) {
  const steps = safeNumber(lifetimeSteps);

  const unlocked = TRACKSUITS.filter(
    (suit) => steps >= suit.unlockAt
  );

  const current =
    unlocked.length > 0
      ? unlocked[unlocked.length - 1]
      : null;

  const next =
    TRACKSUITS.find((suit) => steps < suit.unlockAt) ||
    null;

  const currentStart = current?.unlockAt || 0;
  const nextTarget = next?.unlockAt || currentStart;

  const segmentSize = Math.max(
    1,
    nextTarget - currentStart
  );

  const progress = next
    ? clamp(
        ((steps - currentStart) / segmentSize) * 100
      )
    : 100;

  return {
    steps,
    current,
    next,
    unlocked,
    currentLevel: current?.level || 0,
    nextTarget: next?.unlockAt || null,
    stepsRemaining: next
      ? Math.max(0, next.unlockAt - steps)
      : 0,
    progress,
  };
}

// ============================================================
// RANK NAMES
// ============================================================

const RANK_KEYS = {
  "new walker": "newWalker",
  rookie: "newWalker",
  explorer: "explorer",
  pathfinder: "pathfinder",
  trailblazer: "trailblazer",
  adventurer: "adventurer",
  legend: "legend",
  elite: "elite",
  max: "max",
};

// ============================================================
// INFORMATION-ONLY REWARD CARD
// ============================================================

function RewardInfoCard({
  icon,
  image,
  title,
  value,
  description,
  isRTL,
}) {
  return (
    <View
      style={[
        styles.navigationCard,
        isRTL && styles.rowRTL,
      ]}
    >
      <View style={styles.navigationIconBox}>
        {image ? (
          <Image
            source={image}
            style={styles.navigationImage}
            resizeMode="contain"
            accessibilityLabel="WCoin"
          />
        ) : (
          <Text style={styles.navigationEmoji}>
            {icon}
          </Text>
        )}
      </View>

      <View style={styles.navigationText}>
        <Text
          style={[
            styles.navigationTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {title}
        </Text>

        {value !== undefined && value !== null && (
          <Text
            style={[
              styles.navigationBalance,
              isRTL && styles.rtlText,
            ]}
          >
            {value}
          </Text>
        )}

        <Text
          style={[
            styles.navigationSub,
            isRTL && styles.rtlText,
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// HOW REWARDS WORK ROW
// ============================================================

function InfoRow({
  number,
  title,
  body,
  last = false,
  isRTL = false,
}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && styles.infoRowLast,
        isRTL && styles.rowRTL,
      ]}
    >
      <View
        style={[
          styles.infoNumberCircle,
          isRTL && styles.infoNumberRTL,
        ]}
      >
        <Text style={styles.infoNumber}>
          {number}
        </Text>
      </View>

      <View style={styles.infoTextArea}>
        <Text
          style={[
            styles.infoRowTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.infoBody,
            isRTL && styles.rtlText,
          ]}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// MAIN REWARDS SCREEN
// ============================================================

export default function RewardsScreen({
  language = "en",
  goBack,

  // Retained for compatibility with existing App.js.
  // These are intentionally not used for reward cards.
  goToAchievements,
  goToWCoins,
  goToLegathonPoints,
}) {
  const _accountSession2 = captureAccountSession();

  const languageCode = getLanguage(language);
  const isRTL = languageCode === "ar";

  const t = useCallback(
    (key, variables = {}) => {
  

      const value =
        TEXT[languageCode]?.[key] ??
        TEXT.en[key] ??
        key;

      return fillTemplate(value, variables);
    },
    [languageCode]
  );

  const number = useCallback(
    (value) => {
  

return (formatNumber(value, languageCode));
},
    [languageCode]
  );

  // ==========================================================
  // REWARD STATE
  // ==========================================================

  const [lifetimeSteps, setLifetimeSteps] =
    useState(0);

  const [wcoinBalance, setWcoinBalance] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const {
    points: legathonPoints,
    rank: legathonRank,
  } = useLegathonPoints();

  // ==========================================================
  // LOAD REWARDS
  // ==========================================================

  const loadRewards = useCallback(
    async (initial = false) => {
  try {
    _accountSession2.assertCurrent();

      const requestId = ++requestRef.current;

      if (mountedRef.current) {
        if (initial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
      }

      try {
        const [steps, coins] = await _accountSession2.run(async () => (Promise.all([
          loadRewardLifetimeSteps(),
          getWCoins(),
        ])));

        if (
          !mountedRef.current ||
          requestId !== requestRef.current
        ) {
          return;
        }

        setLifetimeSteps(safeNumber(steps));
        setWcoinBalance(safeNumber(coins));
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        console.log("Rewards load error:", error);
      } finally {
        if (
          mountedRef.current &&
          requestId === requestRef.current
        ) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
},
    []
  );

  // ==========================================================
  // INITIAL LOAD AND APP FOREGROUND REFRESH
  // ==========================================================

  useEffect(() => {
  if (!_accountSession2.isCurrent()) return;

    mountedRef.current = true;

    void loadRewards(true);

    const subscription = AppState.addEventListener(
      "change",
      (nextState) => {
  if (!_accountSession2.isCurrent()) return;

        if (nextState === "active") {
          void loadRewards(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      subscription.remove();
    };
  }, [loadRewards]);

  // ==========================================================
  // TRACKSUIT PROGRESSION
  // ==========================================================

  const progression = useMemo(
    () => {
  

return (calculateTracksuitProgress(lifetimeSteps));
},
    [lifetimeSteps]
  );

  const tracksuitName = useCallback(
    (suit) => {
  

      if (!suit) return t("standard");

      const key =
        suit.id === "elite"
          ? "eliteSuit"
          : suit.id;

      return t(key);
    },
    [t]
  );

  // ==========================================================
  // LEGATHON RANK
  // ==========================================================

  const currentRankRaw =
    legathonRank?.currentRank || "New Walker";

  const nextRankRaw =
    legathonRank?.nextRank || "MAX";

  const translateRank = useCallback(
    (rank) => {
  

      const key =
        RANK_KEYS[String(rank || "")
          .trim()
          .toLowerCase()];

      return key ? t(key) : String(rank || "");
    },
    [t]
  );

  const currentRank = translateRank(currentRankRaw);
  const nextRank = translateRank(nextRankRaw);

  const isMaxRank =
    String(nextRankRaw).trim().toUpperCase() === "MAX";

  const pointsRemaining = safeNumber(
    legathonRank?.pointsRemaining
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}

          <View
            style={[
              styles.topRow,
              isRTL && styles.rowRTL,
            ]}
          >
            {typeof goBack === "function" ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={goBack}
                activeOpacity={0.8}
              >
                <Text style={styles.backText}>
                  {isRTL ? "" : "‹ "}
                  {t("back")}
                  {isRTL ? " ›" : ""}
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>
                LEGATHON
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.pageTitle,
              isRTL && styles.rtlText,
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {t("rewards")}
          </Text>

          <Text
            style={[
              styles.pageSubtitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("subtitle")}
          </Text>

          {/* BALANCES */}

          <Text
            style={[
              styles.sectionEyebrow,
              isRTL && styles.rtlText,
            ]}
          >
            {t("dashboard")}
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("balances")}
          </Text>

          <View style={styles.balanceGrid}>
            {/* LIFETIME STEPS */}

            <View
              style={[
                styles.fullBalanceCard,
                isRTL && styles.rowRTL,
              ]}
            >
              <View
                style={[
                  styles.balanceIcon,
                  isRTL && styles.balanceIconRTL,
                ]}
              >
                <Text style={styles.balanceEmoji}>
                  👟
                </Text>
              </View>

              <View style={styles.balanceTextArea}>
                <Text
                  style={[
                    styles.balanceLabel,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("lifetime")}
                </Text>

                <Text
                  style={[
                    styles.balanceLarge,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {number(lifetimeSteps)}
                </Text>

                <Text
                  style={[
                    styles.balanceSub,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("progressionSteps")}
                </Text>
              </View>
            </View>

            {/* WCOIN — INFORMATION ONLY */}

            <View style={styles.halfBalanceCard}>
              <Image
                source={WCOIN_IMAGE}
                style={styles.wcoinBalanceIcon}
                resizeMode="contain"
                accessibilityLabel="WCoin"
              />

              <Text
                style={[
                  styles.smallBalanceLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("wcoins")}
              </Text>

              <Text
                style={[
                  styles.smallBalanceValue,
                  isRTL && styles.rtlText,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {number(wcoinBalance)}
              </Text>
            </View>

            {/* LEGATHON POINTS — INFORMATION ONLY */}

            <View style={styles.halfBalanceCard}>
              <Text style={styles.currencyEmoji}>
                ⭐
              </Text>

              <Text
                style={[
                  styles.smallBalanceLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("points")}
              </Text>

              <Text
                style={[
                  styles.smallBalanceValue,
                  isRTL && styles.rtlText,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {number(legathonPoints)}
              </Text>
            </View>
          </View>

          {/* LEGATHON RANK */}

          <View
            style={[
              styles.rankCard,
              isRTL && styles.rowRTL,
            ]}
          >
            <View style={styles.rankLeft}>
              <Text
                style={[
                  styles.cardEyebrow,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("rank")}
              </Text>

              <Text
                style={[
                  styles.rankName,
                  isRTL && styles.rtlText,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {currentRank}
              </Text>
            </View>

            <View
              style={[
                styles.rankRight,
                isRTL && styles.rankRightRTL,
              ]}
            >
              <Text
                style={[
                  styles.rankNext,
                  isRTL && styles.rtlText,
                ]}
              >
                {isMaxRank
                  ? t("max")
                  : t("nextRank", {
                      rank: nextRank,
                    })}
              </Text>

              <Text
                style={[
                  styles.rankRemaining,
                  isRTL && styles.rtlText,
                ]}
              >
                {isMaxRank
                  ? t("maxRank")
                  : t("pointsRemaining", {
                      count: number(pointsRemaining),
                    })}
              </Text>
            </View>
          </View>

          {/* CURRENT TRACKSUIT */}

          <View style={styles.progressCard}>
            <Text
              style={[
                styles.cardEyebrow,
                isRTL && styles.rtlText,
              ]}
            >
              {t("currentSuit")}
            </Text>

            <Text
              style={[
                styles.currentSuitName,
                isRTL && styles.rtlText,
              ]}
              numberOfLines={3}
              adjustsFontSizeToFit
            >
              {progression.current
                ? tracksuitName(progression.current)
                : t("standard")}
            </Text>

            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>
                {t("level", {
                  level: progression.currentLevel,
                })}
              </Text>
            </View>

            <Text style={styles.heroSteps}>
              {number(progression.steps)}
            </Text>

            <Text style={styles.heroStepsLabel}>
              {t("lifetimeTitle")}
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progression.progress}%`,
                  },
                ]}
              />
            </View>

            {progression.next ? (
              <View style={styles.nextSuitBox}>
                <Text
                  style={[
                    styles.nextSuitEyebrow,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("nextSuit")}
                </Text>

                <Text
                  style={[
                    styles.nextSuitName,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {tracksuitName(progression.next)}
                </Text>

                <Text
                  style={[
                    styles.stepsRemaining,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("stepsRemaining", {
                    count: number(
                      progression.stepsRemaining
                    ),
                  })}
                </Text>

                <Text
                  style={[
                    styles.unlockTarget,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("unlocksAt", {
                    count: number(
                      progression.nextTarget
                    ),
                  })}
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
                  style={[
                    styles.completeTitle,
                    isRTL && styles.rtlText,
                  ]}
                >
                  👑 {t("allUnlocked")}
                </Text>

                <Text
                  style={[
                    styles.unlockTarget,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t("collectionComplete")}
                </Text>
              </View>
            )}

            {/* REFRESH — STILL CLICKABLE */}

            <TouchableOpacity
              style={[
                styles.refreshButton,
                refreshing && styles.disabledButton,
              ]}
              disabled={refreshing || loading}
              onPress={() => {
  

return (loadRewards(false));
}}
              activeOpacity={0.85}
            >
              {refreshing ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.background}
                />
              ) : (
                <Text style={styles.refreshButtonText}>
                  {t("refresh")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* TRACKSUITS */}

          <Text
            style={[
              styles.sectionEyebrow,
              isRTL && styles.rtlText,
            ]}
          >
            {t("avatarRewards")}
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("suitUnlocks")}
          </Text>

          <Text
            style={[
              styles.sectionDescription,
              isRTL && styles.rtlText,
            ]}
          >
            {t("suitDescription")}
          </Text>

          <View style={styles.tracksuitList}>
            {TRACKSUITS.map((suit) => {
  

              const unlocked =
                lifetimeSteps >= suit.unlockAt;

              const isNext =
                progression.next?.id === suit.id;

              return (
                <View
                  key={suit.id}
                  style={[
                    styles.tracksuitRow,
                    unlocked && styles.tracksuitUnlocked,
                    isNext && styles.tracksuitNext,
                    isRTL && styles.rowRTL,
                  ]}
                >
                  <View
                    style={[
                      styles.trackLevelCircle,
                      isRTL && styles.trackLevelRTL,
                    ]}
                  >
                    <Text style={styles.trackLevelNumber}>
                      {suit.level}
                    </Text>
                  </View>

                  <View style={styles.trackSuitInfo}>
                    <Text
                      style={[
                        styles.trackSuitName,
                        unlocked && styles.unlockedText,
                        isRTL && styles.rtlText,
                      ]}
                      numberOfLines={2}
                      adjustsFontSizeToFit
                    >
                      {tracksuitName(suit)}
                    </Text>

                    <Text
                      style={[
                        styles.trackSuitSteps,
                        isRTL && styles.rtlText,
                      ]}
                    >
                      {t("suitSteps", {
                        count: number(suit.unlockAt),
                      })}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      unlocked && styles.statusUnlocked,
                      isNext && styles.statusNext,
                      isRTL && styles.statusPillRTL,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        unlocked && styles.statusUnlockedText,
                        isNext && styles.statusNextText,
                      ]}
                    >
                      {unlocked
                        ? t("unlocked")
                        : isNext
                        ? t("next")
                        : t("locked")}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* REWARDS OVERVIEW — INFORMATION ONLY */}

          <Text
            style={[
              styles.sectionEyebrow,
              isRTL && styles.rtlText,
            ]}
          >
            {t("rewardCenter")}
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("overview")}
          </Text>

          <RewardInfoCard
            icon="🏆"
            title={t("achievements")}
            description={t("achievementsInfo")}
            isRTL={isRTL}
          />

         
          {/* HOW REWARDS WORK */}

          <View style={styles.infoCard}>
            <Text
              style={[
                styles.infoTitle,
                isRTL && styles.rtlText,
              ]}
            >
              {t("how")}
            </Text>

            <InfoRow
              number="1"
              title={t("walk")}
              body={t("walkInfo")}
              isRTL={isRTL}
            />

            <InfoRow
              number="2"
              title={t("unlock")}
              body={t("unlockInfo")}
              isRTL={isRTL}
            />

            <InfoRow
              number="3"
              title={t("outfit")}
              body={t("outfitInfo")}
              isRTL={isRTL}
            />

            <InfoRow
              number="4"
              title={t("earn")}
              body={t("earnInfo")}
              last
              isRTL={isRTL}
            />
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={COLORS.gold}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 180,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  backButton: {
    paddingVertical: 10,
  },

  backText: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: "900",
  },

  brandPill: {
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 19,
  },

  brandPillText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },

  pageTitle: {
    color: COLORS.white,
    fontSize: 48,
    lineHeight: 55,
    fontWeight: "900",
  },

  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 35,
  },

  sectionEyebrow: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 7,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
    marginBottom: 15,
  },

  sectionDescription: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 20,
  },

  // BALANCES

  balanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  fullBalanceCard: {
    width: "100%",
    minHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  balanceIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.cardDeep,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  balanceIconRTL: {
    marginRight: 0,
    marginLeft: 15,
  },

  balanceEmoji: {
    fontSize: 32,
  },

  balanceTextArea: {
    flex: 1,
    minWidth: 0,
  },

  balanceLabel: {
    color: COLORS.aqua,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  balanceLarge: {
    color: COLORS.white,
    fontSize: 35,
    fontWeight: "900",
    marginTop: 5,
  },

  balanceSub: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  halfBalanceCard: {
    width: "48.5%",
    minHeight: 185,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    padding: 17,
    justifyContent: "center",
  },

  wcoinBalanceIcon: {
    width: 43,
    height: 43,
    marginBottom: 13,
  },

  currencyEmoji: {
    fontSize: 32,
    marginBottom: 13,
  },

  smallBalanceLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  smallBalanceValue: {
    color: COLORS.white,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 7,
  },

  // RANK

  rankCard: {
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  rankLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  cardEyebrow: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  rankName: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 7,
  },

  rankRight: {
    alignItems: "flex-end",
    flex: 1,
    minWidth: 0,
  },

  rankRightRTL: {
    alignItems: "flex-start",
  },

  rankNext: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },

  rankRemaining: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "right",
  },

  // TRACKSUIT PROGRESSION

  progressCard: {
    borderWidth: 1.5,
    borderColor: COLORS.goldDark,
    borderRadius: 27,
    backgroundColor: COLORS.card,
    padding: 22,
    marginBottom: 36,
  },

  currentSuitName: {
    color: COLORS.white,
    fontSize: 37,
    lineHeight: 45,
    fontWeight: "900",
    marginTop: 12,
  },

  levelPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    backgroundColor: "#252617",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 14,
  },

  levelPillText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "900",
  },

  heroSteps: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 30,
  },

  heroStepsLabel: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  progressTrack: {
    width: "100%",
    height: 13,
    borderRadius: 8,
    backgroundColor: "#213248",
    overflow: "hidden",
    marginTop: 23,
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.gold,
  },

  nextSuitBox: {
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    borderRadius: 21,
    backgroundColor: "#171D25",
    padding: 18,
    marginTop: 24,
  },

  nextSuitEyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  nextSuitName: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 8,
  },

  stepsRemaining: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
  },

  unlockTarget: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    marginTop: 7,
  },

  completeBox: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenDark,
  },

  completeTitle: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "900",
  },

  refreshButton: {
    minHeight: 59,
    borderRadius: 26,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
  },

  refreshButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "900",
  },

  disabledButton: {
    opacity: 0.6,
  },

  // TRACKSUITS

  tracksuitList: {
    marginBottom: 35,
  },

  tracksuitRow: {
    minHeight: 108,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
  },

  tracksuitUnlocked: {
    borderColor: COLORS.green,
  },

  tracksuitNext: {
    borderColor: COLORS.gold,
  },

  trackLevelCircle: {
    width: 51,
    height: 51,
    borderRadius: 26,
    backgroundColor: COLORS.cardDeep,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  trackLevelRTL: {
    marginRight: 0,
    marginLeft: 13,
  },

  trackLevelNumber: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: "900",
  },

  trackSuitInfo: {
    flex: 1,
    minWidth: 0,
  },

  trackSuitName: {
    color: "#7F8DA3",
    fontSize: 18,
    fontWeight: "900",
  },

  unlockedText: {
    color: COLORS.white,
  },

  trackSuitSteps: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  statusPill: {
    borderWidth: 1,
    borderColor: "#66758B",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 9,
    marginLeft: 8,
    maxWidth: 105,
  },

  statusPillRTL: {
    marginLeft: 0,
    marginRight: 8,
  },

  statusText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  statusUnlocked: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenDark,
  },

  statusUnlockedText: {
    color: COLORS.green,
  },

  statusNext: {
    borderColor: COLORS.gold,
  },

  statusNextText: {
    color: COLORS.gold,
  },

  // INFORMATION-ONLY REWARD CARDS

  navigationCard: {
    minHeight: 119,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 17,
    marginBottom: 13,
  },

  navigationIconBox: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  navigationEmoji: {
    fontSize: 34,
  },

  navigationImage: {
    width: 39,
    height: 39,
  },

  navigationText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 12,
  },

  navigationTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  navigationBalance: {
    color: COLORS.gold,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 6,
  },

  navigationSub: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  // HOW REWARDS WORK

  infoCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    padding: 20,
    marginTop: 21,
  },

  infoTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1D3048",
  },

  infoRowLast: {
    borderBottomWidth: 0,
  },

  infoNumberCircle: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#2A2513",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoNumberRTL: {
    marginRight: 0,
    marginLeft: 13,
  },

  infoNumber: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: "900",
  },

  infoTextArea: {
    flex: 1,
    minWidth: 0,
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
    top: 145,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  rowRTL: {
    flexDirection: "row-reverse",
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});
