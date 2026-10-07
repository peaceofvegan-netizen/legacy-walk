import React, {
  useMemo,
} from "react";

import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  calculateJourneySteps,
  getJourneyById,
} from "../data/journeyCatalog";

import JOURNEY_REWARDS
  from "../utils/journeyRewards";

import {
  translate,
} from "../i18n/i18n";

// ============================================================
// ASSETS
// ============================================================

const FALLBACK_ROUTE =
  require("../assets/routes/selma.png");

const WCOIN_ICON =
  require("../assets/legathon/icons/coin.png");

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  background:
    "#040A14",

  surface:
    "#08162A",

  surfaceLight:
    "#0E1E35",

  border:
    "#24405F",

  white:
    "#FFFFFF",

  textSecondary:
    "#A9B6CA",

  gold:
    "#F7C948",

  goldLight:
    "#FFD877",

  mint:
    "#8FF6D0",

  teal:
    "#16D8C4",

  blue:
    "#3B82F6",

  purple:
    "#A78BFA",

  red:
    "#FF5A6A",

  green:
    "#45F18B",

  muted:
    "#6F8198",

  black:
    "#020611",
};

// ============================================================
// SCREEN TRANSLATIONS
// ============================================================

const DETAIL_TRANSLATIONS = {
  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    journeyDetails:
      "Journey Details",

    distance:
      "Distance",

    steps:
      "Steps",

    difficulty:
      "Difficulty",

    estimatedTime:
      "Estimated Time",

    journeyOverview:
      "JOURNEY OVERVIEW",

    walkThroughHistory:
      "Walk Through History",

    defaultOverview:
      "Complete this Legathon Walk journey using the five-checkpoint route. Each checkpoint unlocks history, progress, and a new milestone.",

    readJourneyStory:
      "Read Journey Story",

    journeyRewards:
      "JOURNEY REWARDS",

    completeToEarn:
      "Complete to Earn",

    wcoins:
      "WCoins",

    legathonPoints:
      "Legathon Points",

    points:
      "Points",

    avatarXP:
      "Avatar XP",

    avatarProgression:
      "Avatar progression",

    lifetimeSteps:
      "Lifetime Steps",

    projectedLifetime:
      "{count} projected lifetime steps",

    journeyBadge:
      "Journey Badge",

    awardedOnce:
      "Awarded once after completion",

    passportStamp:
      "Passport Stamp",

    certificate:
      "Certificate",

    included:
      "Included",

    notIncluded:
      "Not Included",

    freeReward:
      "Free merchandise reward",

    premiumReward:
      "Premium mileage reward",

    eliteReward:
      "Elite mileage reward",

    pointsSubtitle:
      "Avatar level and Hall of Legends progress",

    fiveCheckpointRoute:
      "FIVE-CHECKPOINT ROUTE",

    yourJourneyPath:
      "Your Journey Path",

    checkpointDescription:
      "Begin at checkpoint 1 and finish at checkpoint {count}. Each checkpoint unlocks new history and journey progress.",

    checkpoints:
      "{count} checkpoints",

    gpsGuided:
      "GPS guided",

    narration:
      "Journey content",

    eliteJourney:
      "Elite Journey",

    premiumJourney:
      "Premium Journey",

    lockedMessage:
      "You can preview this entire journey. Upgrade your membership when you are ready to start walking.",

    startJourney:
      "Start Journey",

    unlockElite:
      "Unlock with Elite",

    unlockPremium:
      "Unlock with Premium",

    returnCatalog:
      "Return to Journey Catalog",

    journeyNotFound:
      "Journey Not Found",

    journeyLoadError:
      "This journey could not be loaded from the catalog.",

    returnJourneys:
      "Return to Journeys",

    free:
      "FREE",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Easy",

    beginner:
      "Beginner",

    intermediate:
      "Intermediate",

    advanced:
      "Advanced",

    hard:
      "Hard",

    expert:
      "Expert",

    upToOneWeek:
      "Up to 1 week",

    explorer:
      "Explorer",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    journeyDetails:
      "Detalles del Viaje",

    distance:
      "Distancia",

    steps:
      "Pasos",

    difficulty:
      "Dificultad",

    estimatedTime:
      "Tiempo Estimado",

    journeyOverview:
      "RESUMEN DEL VIAJE",

    walkThroughHistory:
      "Camina por la Historia",

    defaultOverview:
      "Completa este viaje de Legathon Walk usando la ruta de cinco puntos de control. Cada punto desbloquea historia, progreso y un nuevo logro.",

    readJourneyStory:
      "Leer Historia del Viaje",

    journeyRewards:
      "RECOMPENSAS DEL VIAJE",

    completeToEarn:
      "Completa para Ganar",

    wcoins:
      "WCoins",

    legathonPoints:
      "Puntos Legathon",

    points:
      "Puntos",

    avatarXP:
      "XP del Avatar",

    avatarProgression:
      "Progreso del avatar",

    lifetimeSteps:
      "Pasos Totales",

    projectedLifetime:
      "{count} pasos totales proyectados",

    journeyBadge:
      "Insignia del Viaje",

    awardedOnce:
      "Otorgada una vez al completar",

    passportStamp:
      "Sello del Pasaporte",

    certificate:
      "Certificado",

    included:
      "Incluido",

    notIncluded:
      "No Incluido",

    freeReward:
      "Recompensa de mercancía gratis",

    premiumReward:
      "Recompensa Premium por distancia",

    eliteReward:
      "Recompensa Elite por distancia",

    pointsSubtitle:
      "Nivel del avatar y progreso en el Salón de Leyendas",

    fiveCheckpointRoute:
      "RUTA DE CINCO PUNTOS",

    yourJourneyPath:
      "Tu Ruta de Viaje",

    checkpointDescription:
      "Comienza en el punto 1 y termina en el punto {count}. Cada punto desbloquea nueva historia y progreso.",

    checkpoints:
      "{count} puntos",

    gpsGuided:
      "Guiado por GPS",

    narration:
      "Contenido del viaje",

    eliteJourney:
      "Viaje Elite",

    premiumJourney:
      "Viaje Premium",

    lockedMessage:
      "Puedes obtener una vista previa de este viaje. Mejora tu membresía cuando estés listo para comenzar a caminar.",

    startJourney:
      "Iniciar Viaje",

    unlockElite:
      "Desbloquear con Elite",

    unlockPremium:
      "Desbloquear con Premium",

    returnCatalog:
      "Volver al Catálogo de Viajes",

    journeyNotFound:
      "Viaje No Encontrado",

    journeyLoadError:
      "Este viaje no pudo cargarse desde el catálogo.",

    returnJourneys:
      "Volver a Viajes",

    free:
      "GRATIS",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Fácil",

    beginner:
      "Principiante",

    intermediate:
      "Intermedio",

    advanced:
      "Avanzado",

    hard:
      "Difícil",

    expert:
      "Experto",

    upToOneWeek:
      "Hasta 1 semana",

    explorer:
      "Explorador",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    journeyDetails:
      "Détails du Voyage",

    distance:
      "Distance",

    steps:
      "Pas",

    difficulty:
      "Difficulté",

    estimatedTime:
      "Temps Estimé",

    journeyOverview:
      "APERÇU DU VOYAGE",

    walkThroughHistory:
      "Marchez à Travers l'Histoire",

    defaultOverview:
      "Terminez ce voyage Legathon Walk en suivant le parcours à cinq étapes. Chaque étape débloque de l'histoire, de la progression et un nouveau jalon.",

    readJourneyStory:
      "Lire l'Histoire du Voyage",

    journeyRewards:
      "RÉCOMPENSES DU VOYAGE",

    completeToEarn:
      "Terminez pour Gagner",

    wcoins:
      "WCoins",

    legathonPoints:
      "Points Legathon",

    points:
      "Points",

    avatarXP:
      "XP Avatar",

    avatarProgression:
      "Progression de l'avatar",

    lifetimeSteps:
      "Pas Cumulés",

    projectedLifetime:
      "{count} pas cumulés projetés",

    journeyBadge:
      "Badge du Voyage",

    awardedOnce:
      "Attribué une fois après l'achèvement",

    passportStamp:
      "Tampon de Passeport",

    certificate:
      "Certificat",

    included:
      "Inclus",

    notIncluded:
      "Non Inclus",

    freeReward:
      "Récompense marchandise gratuite",

    premiumReward:
      "Récompense kilométrique Premium",

    eliteReward:
      "Récompense kilométrique Elite",

    pointsSubtitle:
      "Niveau de l'avatar et progression au Temple des Légendes",

    fiveCheckpointRoute:
      "PARCOURS À CINQ ÉTAPES",

    yourJourneyPath:
      "Votre Parcours",

    checkpointDescription:
      "Commencez au point 1 et terminez au point {count}. Chaque point débloque une nouvelle histoire et de la progression.",

    checkpoints:
      "{count} étapes",

    gpsGuided:
      "Guidage GPS",

    narration:
      "Contenu du voyage",

    eliteJourney:
      "Voyage Elite",

    premiumJourney:
      "Voyage Premium",

    lockedMessage:
      "Vous pouvez prévisualiser ce voyage. Améliorez votre abonnement lorsque vous êtes prêt à commencer à marcher.",

    startJourney:
      "Commencer le Voyage",

    unlockElite:
      "Débloquer avec Elite",

    unlockPremium:
      "Débloquer avec Premium",

    returnCatalog:
      "Retour au Catalogue",

    journeyNotFound:
      "Voyage Introuvable",

    journeyLoadError:
      "Ce voyage n'a pas pu être chargé depuis le catalogue.",

    returnJourneys:
      "Retour aux Voyages",

    free:
      "GRATUIT",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Facile",

    beginner:
      "Débutant",

    intermediate:
      "Intermédiaire",

    advanced:
      "Avancé",

    hard:
      "Difficile",

    expert:
      "Expert",

    upToOneWeek:
      "Jusqu'à 1 semaine",

    explorer:
      "Explorateur",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    journeyDetails:
      "Reisedetails",

    distance:
      "Entfernung",

    steps:
      "Schritte",

    difficulty:
      "Schwierigkeit",

    estimatedTime:
      "Geschätzte Zeit",

    journeyOverview:
      "REISEÜBERSICHT",

    walkThroughHistory:
      "Durch die Geschichte Gehen",

    defaultOverview:
      "Absolviere diese Legathon-Walk-Reise über die Route mit fünf Kontrollpunkten. Jeder Kontrollpunkt schaltet Geschichte, Fortschritt und einen neuen Meilenstein frei.",

    readJourneyStory:
      "Reisegeschichte Lesen",

    journeyRewards:
      "REISEBELOHNUNGEN",

    completeToEarn:
      "Abschließen und Verdienen",

    wcoins:
      "WCoins",

    legathonPoints:
      "Legathon-Punkte",

    points:
      "Punkte",

    avatarXP:
      "Avatar-XP",

    avatarProgression:
      "Avatar-Fortschritt",

    lifetimeSteps:
      "Gesamtschritte",

    projectedLifetime:
      "{count} prognostizierte Gesamtschritte",

    journeyBadge:
      "Reiseabzeichen",

    awardedOnce:
      "Einmal nach Abschluss vergeben",

    passportStamp:
      "Passstempel",

    certificate:
      "Zertifikat",

    included:
      "Enthalten",

    notIncluded:
      "Nicht Enthalten",

    freeReward:
      "Kostenlose Merchandise-Belohnung",

    premiumReward:
      "Premium-Distanzbelohnung",

    eliteReward:
      "Elite-Distanzbelohnung",

    pointsSubtitle:
      "Avatar-Level und Hall-of-Legends-Fortschritt",

    fiveCheckpointRoute:
      "ROUTE MIT FÜNF KONTROLLPUNKTEN",

    yourJourneyPath:
      "Dein Reiseweg",

    checkpointDescription:
      "Beginne bei Kontrollpunkt 1 und beende die Reise bei Kontrollpunkt {count}. Jeder Punkt schaltet neue Geschichte und Fortschritt frei.",

    checkpoints:
      "{count} Kontrollpunkte",

    gpsGuided:
      "GPS-geführt",

    narration:
      "Reiseinhalte",

    eliteJourney:
      "Elite-Reise",

    premiumJourney:
      "Premium-Reise",

    lockedMessage:
      "Du kannst diese Reise vollständig ansehen. Aktualisiere deine Mitgliedschaft, wenn du bereit bist loszugehen.",

    startJourney:
      "Reise Starten",

    unlockElite:
      "Mit Elite Freischalten",

    unlockPremium:
      "Mit Premium Freischalten",

    returnCatalog:
      "Zurück zum Reisekatalog",

    journeyNotFound:
      "Reise Nicht Gefunden",

    journeyLoadError:
      "Diese Reise konnte nicht aus dem Katalog geladen werden.",

    returnJourneys:
      "Zurück zu Reisen",

    free:
      "KOSTENLOS",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Einfach",

    beginner:
      "Anfänger",

    intermediate:
      "Mittel",

    advanced:
      "Fortgeschritten",

    hard:
      "Schwer",

    expert:
      "Experte",

    upToOneWeek:
      "Bis zu 1 Woche",

    explorer:
      "Entdecker",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    journeyDetails:
      "Detalhes da Jornada",

    distance:
      "Distância",

    steps:
      "Passos",

    difficulty:
      "Dificuldade",

    estimatedTime:
      "Tempo Estimado",

    journeyOverview:
      "VISÃO GERAL DA JORNADA",

    walkThroughHistory:
      "Caminhe Pela História",

    defaultOverview:
      "Complete esta jornada Legathon Walk usando a rota de cinco pontos. Cada ponto desbloqueia história, progresso e um novo marco.",

    readJourneyStory:
      "Ler História da Jornada",

    journeyRewards:
      "RECOMPENSAS DA JORNADA",

    completeToEarn:
      "Complete para Ganhar",

    wcoins:
      "WCoins",

    legathonPoints:
      "Pontos Legathon",

    points:
      "Pontos",

    avatarXP:
      "XP do Avatar",

    avatarProgression:
      "Progressão do avatar",

    lifetimeSteps:
      "Passos Acumulados",

    projectedLifetime:
      "{count} passos acumulados projetados",

    journeyBadge:
      "Distintivo da Jornada",

    awardedOnce:
      "Concedido uma vez após a conclusão",

    passportStamp:
      "Carimbo do Passaporte",

    certificate:
      "Certificado",

    included:
      "Incluído",

    notIncluded:
      "Não Incluído",

    freeReward:
      "Recompensa de mercadoria grátis",

    premiumReward:
      "Recompensa Premium por distância",

    eliteReward:
      "Recompensa Elite por distância",

    pointsSubtitle:
      "Nível do avatar e progresso no Salão das Lendas",

    fiveCheckpointRoute:
      "ROTA DE CINCO PONTOS",

    yourJourneyPath:
      "Seu Caminho",

    checkpointDescription:
      "Comece no ponto 1 e termine no ponto {count}. Cada ponto desbloqueia nova história e progresso.",

    checkpoints:
      "{count} pontos",

    gpsGuided:
      "Guiado por GPS",

    narration:
      "Conteúdo da jornada",

    eliteJourney:
      "Jornada Elite",

    premiumJourney:
      "Jornada Premium",

    lockedMessage:
      "Você pode visualizar esta jornada completa. Atualize sua assinatura quando estiver pronto para começar a caminhar.",

    startJourney:
      "Iniciar Jornada",

    unlockElite:
      "Desbloquear com Elite",

    unlockPremium:
      "Desbloquear com Premium",

    returnCatalog:
      "Voltar ao Catálogo",

    journeyNotFound:
      "Jornada Não Encontrada",

    journeyLoadError:
      "Esta jornada não pôde ser carregada do catálogo.",

    returnJourneys:
      "Voltar às Jornadas",

    free:
      "GRÁTIS",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Fácil",

    beginner:
      "Iniciante",

    intermediate:
      "Intermediário",

    advanced:
      "Avançado",

    hard:
      "Difícil",

    expert:
      "Especialista",

    upToOneWeek:
      "Até 1 semana",

    explorer:
      "Explorador",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    journeyDetails:
      "ジャーニー詳細",

    distance:
      "距離",

    steps:
      "歩数",

    difficulty:
      "難易度",

    estimatedTime:
      "推定時間",

    journeyOverview:
      "ジャーニー概要",

    walkThroughHistory:
      "歴史を歩く",

    defaultOverview:
      "5つのチェックポイントを巡るLegathon Walkジャーニーです。各チェックポイントで歴史、進捗、新しいマイルストーンが解放されます。",

    readJourneyStory:
      "ジャーニーストーリーを読む",

    journeyRewards:
      "ジャーニー報酬",

    completeToEarn:
      "完了して獲得",

    wcoins:
      "WCoins",

    legathonPoints:
      "Legathonポイント",

    points:
      "ポイント",

    avatarXP:
      "アバターXP",

    avatarProgression:
      "アバター進捗",

    lifetimeSteps:
      "累計歩数",

    projectedLifetime:
      "予想累計歩数 {count}",

    journeyBadge:
      "ジャーニーバッジ",

    awardedOnce:
      "完了後に1回獲得",

    passportStamp:
      "パスポートスタンプ",

    certificate:
      "証明書",

    included:
      "含まれる",

    notIncluded:
      "含まれない",

    freeReward:
      "無料グッズ報酬",

    premiumReward:
      "プレミアム距離報酬",

    eliteReward:
      "エリート距離報酬",

    pointsSubtitle:
      "アバターレベルとHall of Legendsの進捗",

    fiveCheckpointRoute:
      "5チェックポイントルート",

    yourJourneyPath:
      "あなたのルート",

    checkpointDescription:
      "チェックポイント1から開始し、チェックポイント{count}でゴールします。各ポイントで新しい歴史と進捗が解放されます。",

    checkpoints:
      "{count} チェックポイント",

    gpsGuided:
      "GPSガイド",

    narration:
      "ジャーニーコンテンツ",

    eliteJourney:
      "エリートジャーニー",

    premiumJourney:
      "プレミアムジャーニー",

    lockedMessage:
      "このジャーニーをプレビューできます。歩き始める準備ができたらメンバーシップをアップグレードしてください。",

    startJourney:
      "ジャーニーを開始",

    unlockElite:
      "Eliteで解除",

    unlockPremium:
      "Premiumで解除",

    returnCatalog:
      "ジャーニーカタログへ戻る",

    journeyNotFound:
      "ジャーニーが見つかりません",

    journeyLoadError:
      "カタログからジャーニーを読み込めませんでした。",

    returnJourneys:
      "ジャーニーへ戻る",

    free:
      "無料",

    premium:
      "プレミアム",

    elite:
      "エリート",

    easy:
      "簡単",

    beginner:
      "初心者",

    intermediate:
      "中級",

    advanced:
      "上級",

    hard:
      "難しい",

    expert:
      "エキスパート",

    upToOneWeek:
      "最大1週間",

    explorer:
      "エクスプローラー",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    journeyDetails:
      "여정 상세",

    distance:
      "거리",

    steps:
      "걸음 수",

    difficulty:
      "난이도",

    estimatedTime:
      "예상 시간",

    journeyOverview:
      "여정 개요",

    walkThroughHistory:
      "역사 속을 걸어보세요",

    defaultOverview:
      "5개의 체크포인트로 구성된 Legathon Walk 여정을 완료하세요. 각 체크포인트에서 새로운 역사와 진행 상황이 열립니다.",

    readJourneyStory:
      "여정 이야기 읽기",

    journeyRewards:
      "여정 보상",

    completeToEarn:
      "완료하고 보상 받기",

    wcoins:
      "WCoins",

    legathonPoints:
      "Legathon 포인트",

    points:
      "포인트",

    avatarXP:
      "아바타 XP",

    avatarProgression:
      "아바타 진행",

    lifetimeSteps:
      "누적 걸음 수",

    projectedLifetime:
      "예상 누적 걸음 수 {count}",

    journeyBadge:
      "여정 배지",

    awardedOnce:
      "완료 후 한 번 지급",

    passportStamp:
      "패스포트 스탬프",

    certificate:
      "인증서",

    included:
      "포함",

    notIncluded:
      "포함되지 않음",

    freeReward:
      "무료 상품 보상",

    premiumReward:
      "프리미엄 거리 보상",

    eliteReward:
      "엘리트 거리 보상",

    pointsSubtitle:
      "아바타 레벨 및 Hall of Legends 진행",

    fiveCheckpointRoute:
      "5개 체크포인트 경로",

    yourJourneyPath:
      "나의 여정 경로",

    checkpointDescription:
      "체크포인트 1에서 시작하여 체크포인트 {count}에서 완료합니다. 각 체크포인트에서 새로운 역사와 진행 상황이 열립니다.",

    checkpoints:
      "체크포인트 {count}개",

    gpsGuided:
      "GPS 안내",

    narration:
      "여정 콘텐츠",

    eliteJourney:
      "엘리트 여정",

    premiumJourney:
      "프리미엄 여정",

    lockedMessage:
      "이 여정을 미리 볼 수 있습니다. 걷기를 시작할 준비가 되면 멤버십을 업그레이드하세요.",

    startJourney:
      "여정 시작",

    unlockElite:
      "Elite로 잠금 해제",

    unlockPremium:
      "Premium으로 잠금 해제",

    returnCatalog:
      "여정 목록으로 돌아가기",

    journeyNotFound:
      "여정을 찾을 수 없습니다",

    journeyLoadError:
      "카탈로그에서 이 여정을 불러올 수 없습니다.",

    returnJourneys:
      "여정으로 돌아가기",

    free:
      "무료",

    premium:
      "프리미엄",

    elite:
      "엘리트",

    easy:
      "쉬움",

    beginner:
      "초급",

    intermediate:
      "중급",

    advanced:
      "고급",

    hard:
      "어려움",

    expert:
      "전문가",

    upToOneWeek:
      "최대 1주",

    explorer:
      "탐험가",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    journeyDetails:
      "旅程详情",

    distance:
      "距离",

    steps:
      "步数",

    difficulty:
      "难度",

    estimatedTime:
      "预计时间",

    journeyOverview:
      "旅程概览",

    walkThroughHistory:
      "穿越历史",

    defaultOverview:
      "通过五个检查点完成这段 Legathon Walk 旅程。每个检查点都会解锁新的历史内容、进度和里程碑。",

    readJourneyStory:
      "阅读旅程故事",

    journeyRewards:
      "旅程奖励",

    completeToEarn:
      "完成即可获得",

    wcoins:
      "WCoins",

    legathonPoints:
      "Legathon积分",

    points:
      "积分",

    avatarXP:
      "虚拟形象XP",

    avatarProgression:
      "虚拟形象进度",

    lifetimeSteps:
      "累计步数",

    projectedLifetime:
      "预计累计步数 {count}",

    journeyBadge:
      "旅程徽章",

    awardedOnce:
      "完成后获得一次",

    passportStamp:
      "护照印章",

    certificate:
      "证书",

    included:
      "包含",

    notIncluded:
      "不包含",

    freeReward:
      "免费商品奖励",

    premiumReward:
      "Premium里程奖励",

    eliteReward:
      "Elite里程奖励",

    pointsSubtitle:
      "虚拟形象等级和传奇殿堂进度",

    fiveCheckpointRoute:
      "五个检查点路线",

    yourJourneyPath:
      "你的旅程路线",

    checkpointDescription:
      "从检查点1开始，在检查点{count}完成。每个检查点都会解锁新的历史内容和旅程进度。",

    checkpoints:
      "{count} 个检查点",

    gpsGuided:
      "GPS导航",

    narration:
      "旅程内容",

    eliteJourney:
      "Elite旅程",

    premiumJourney:
      "Premium旅程",

    lockedMessage:
      "你可以预览整个旅程。当你准备开始步行时，请升级会员计划。",

    startJourney:
      "开始旅程",

    unlockElite:
      "使用Elite解锁",

    unlockPremium:
      "使用Premium解锁",

    returnCatalog:
      "返回旅程目录",

    journeyNotFound:
      "未找到旅程",

    journeyLoadError:
      "无法从目录中加载此旅程。",

    returnJourneys:
      "返回旅程",

    free:
      "免费",

    premium:
      "高级",

    elite:
      "精英",

    easy:
      "简单",

    beginner:
      "初级",

    intermediate:
      "中级",

    advanced:
      "高级",

    hard:
      "困难",

    expert:
      "专家",

    upToOneWeek:
      "最长1周",

    explorer:
      "探索者",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    journeyDetails:
      "Dettagli del Percorso",

    distance:
      "Distanza",

    steps:
      "Passi",

    difficulty:
      "Difficoltà",

    estimatedTime:
      "Tempo Stimato",

    journeyOverview:
      "PANORAMICA DEL PERCORSO",

    walkThroughHistory:
      "Cammina nella Storia",

    defaultOverview:
      "Completa questo percorso Legathon Walk utilizzando i cinque checkpoint. Ogni checkpoint sblocca storia, progresso e un nuovo traguardo.",

    readJourneyStory:
      "Leggi la Storia",

    journeyRewards:
      "PREMI DEL PERCORSO",

    completeToEarn:
      "Completa per Guadagnare",

    wcoins:
      "WCoins",

    legathonPoints:
      "Punti Legathon",

    points:
      "Punti",

    avatarXP:
      "XP Avatar",

    avatarProgression:
      "Progressione avatar",

    lifetimeSteps:
      "Passi Totali",

    projectedLifetime:
      "{count} passi totali previsti",

    journeyBadge:
      "Distintivo del Percorso",

    awardedOnce:
      "Assegnato una volta al completamento",

    passportStamp:
      "Timbro Passaporto",

    certificate:
      "Certificato",

    included:
      "Incluso",

    notIncluded:
      "Non Incluso",

    freeReward:
      "Premio merce gratuita",

    premiumReward:
      "Premio Premium per distanza",

    eliteReward:
      "Premio Elite per distanza",

    pointsSubtitle:
      "Livello avatar e progresso nella Sala delle Leggende",

    fiveCheckpointRoute:
      "PERCORSO A CINQUE CHECKPOINT",

    yourJourneyPath:
      "Il Tuo Percorso",

    checkpointDescription:
      "Inizia dal checkpoint 1 e termina al checkpoint {count}. Ogni checkpoint sblocca nuova storia e progresso.",

    checkpoints:
      "{count} checkpoint",

    gpsGuided:
      "Guidato da GPS",

    narration:
      "Contenuto del percorso",

    eliteJourney:
      "Percorso Elite",

    premiumJourney:
      "Percorso Premium",

    lockedMessage:
      "Puoi visualizzare l'intero percorso. Aggiorna il tuo abbonamento quando sei pronto per iniziare a camminare.",

    startJourney:
      "Inizia Percorso",

    unlockElite:
      "Sblocca con Elite",

    unlockPremium:
      "Sblocca con Premium",

    returnCatalog:
      "Torna al Catalogo",

    journeyNotFound:
      "Percorso Non Trovato",

    journeyLoadError:
      "Questo percorso non può essere caricato dal catalogo.",

    returnJourneys:
      "Torna ai Percorsi",

    free:
      "GRATUITO",

    premium:
      "PREMIUM",

    elite:
      "ELITE",

    easy:
      "Facile",

    beginner:
      "Principiante",

    intermediate:
      "Intermedio",

    advanced:
      "Avanzato",

    hard:
      "Difficile",

    expert:
      "Esperto",

    upToOneWeek:
      "Fino a 1 settimana",

    explorer:
      "Esploratore",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    journeyDetails:
      "تفاصيل الرحلة",

    distance:
      "المسافة",

    steps:
      "الخطوات",

    difficulty:
      "الصعوبة",

    estimatedTime:
      "الوقت المتوقع",

    journeyOverview:
      "نظرة عامة على الرحلة",

    walkThroughHistory:
      "امشِ عبر التاريخ",

    defaultOverview:
      "أكمل رحلة Legathon Walk عبر مسار من خمس نقاط. تفتح كل نقطة محتوى تاريخياً وتقدماً ومرحلة جديدة.",

    readJourneyStory:
      "قراءة قصة الرحلة",

    journeyRewards:
      "مكافآت الرحلة",

    completeToEarn:
      "أكمل لتحصل على المكافآت",

    wcoins:
      "WCoins",

    legathonPoints:
      "نقاط Legathon",

    points:
      "نقاط",

    avatarXP:
      "خبرة الصورة الرمزية",

    avatarProgression:
      "تقدم الصورة الرمزية",

    lifetimeSteps:
      "إجمالي الخطوات",

    projectedLifetime:
      "{count} إجمالي الخطوات المتوقع",

    journeyBadge:
      "شارة الرحلة",

    awardedOnce:
      "تُمنح مرة واحدة بعد الإكمال",

    passportStamp:
      "ختم جواز السفر",

    certificate:
      "الشهادة",

    included:
      "مضمن",

    notIncluded:
      "غير مضمن",

    freeReward:
      "مكافأة بضائع مجانية",

    premiumReward:
      "مكافأة Premium للمسافة",

    eliteReward:
      "مكافأة Elite للمسافة",

    pointsSubtitle:
      "مستوى الصورة الرمزية والتقدم في قاعة الأساطير",

    fiveCheckpointRoute:
      "مسار من خمس نقاط",

    yourJourneyPath:
      "مسار رحلتك",

    checkpointDescription:
      "ابدأ من النقطة 1 وأنهِ الرحلة عند النقطة {count}. تفتح كل نقطة تاريخاً جديداً وتقدماً في الرحلة.",

    checkpoints:
      "{count} نقاط",

    gpsGuided:
      "توجيه GPS",

    narration:
      "محتوى الرحلة",

    eliteJourney:
      "رحلة Elite",

    premiumJourney:
      "رحلة Premium",

    lockedMessage:
      "يمكنك معاينة الرحلة بالكامل. قم بترقية عضويتك عندما تكون مستعداً لبدء المشي.",

    startJourney:
      "بدء الرحلة",

    unlockElite:
      "فتح باستخدام Elite",

    unlockPremium:
      "فتح باستخدام Premium",

    returnCatalog:
      "العودة إلى دليل الرحلات",

    journeyNotFound:
      "الرحلة غير موجودة",

    journeyLoadError:
      "تعذر تحميل هذه الرحلة من الدليل.",

    returnJourneys:
      "العودة إلى الرحلات",

    free:
      "مجاني",

    premium:
      "مميز",

    elite:
      "نخبة",

    easy:
      "سهل",

    beginner:
      "مبتدئ",

    intermediate:
      "متوسط",

    advanced:
      "متقدم",

    hard:
      "صعب",

    expert:
      "خبير",

    upToOneWeek:
      "حتى أسبوع واحد",

    explorer:
      "مستكشف",
  },
};

// ============================================================
// HELPERS
// ============================================================

const normalizePlan = (
  plan
) =>
  String(
    plan ||
      "free"
  )
    .trim()
    .toLowerCase();

const normalizeAccessLevel = (
  journey
) => {
  if (
    journey
      ?.accessLevel
  ) {
    return String(
      journey
        .accessLevel
    ).toLowerCase();
  }

  if (
    journey?.elite ===
    true
  ) {
    return "elite";
  }

  if (
    journey
      ?.premium ===
    true
  ) {
    return "premium";
  }

  return "free";
};

const canAccessJourney = (
  journey,
  plan
) => {
  const requiredPlan =
    normalizeAccessLevel(
      journey
    );

  const currentPlan =
    normalizePlan(
      plan
    );

  if (
    requiredPlan ===
    "free"
  ) {
    return true;
  }

  if (
    requiredPlan ===
      "premium" &&
    (
      currentPlan ===
        "premium" ||
      currentPlan ===
        "elite"
    )
  ) {
    return true;
  }

  if (
    requiredPlan ===
      "elite" &&
    currentPlan ===
      "elite"
  ) {
    return true;
  }

  return false;
};

const formatNumber = (
  value
) =>
  Number(
    value ||
      0
  ).toLocaleString();

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
    ) =>
      Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[
              key
            ]
          )
        : match
  );
}

const getRewardWCoins = (
  journey,
  subscriptionPlan
) => {
  const plan =
    normalizePlan(
      subscriptionPlan
    );

  if (
    plan ===
    "elite"
  ) {
    return Number(
      journey
        ?.eliteWCoins ||
        journey
          ?.wCoins ||
        0
    );
  }

  if (
    plan ===
    "premium"
  ) {
    return Number(
      journey
        ?.premiumWCoins ||
        journey
          ?.wCoins ||
        0
    );
  }

  return Number(
    journey
      ?.freeWCoins ||
      journey
        ?.wCoins ||
      0
  );
};

// ============================================================
// HEADER BUTTON
// ============================================================

function HeaderButton({
  icon,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={
        styles.headerButton
      }
      activeOpacity={
        0.8
      }
      onPress={
        onPress
      }
    >
      <Ionicons
        name={
          icon
        }
        size={
          26
        }
        color={
          COLORS.white
        }
      />
    </TouchableOpacity>
  );
}

// ============================================================
// STAT
// ============================================================

function Stat({
  label,
  value,
  icon,
  color =
    COLORS.white,
}) {
  return (
    <View
      style={
        styles.statCard
      }
    >
      <View
        style={
          styles.statTopRow
        }
      >
        <Ionicons
          name={
            icon
          }
          size={
            19
          }
          color={
            color
          }
        />

        <Text
          style={
            styles.statLabel
          }
          numberOfLines={
            2
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.7
          }
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.statValue,
          {
            color,
          },
        ]}
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {value}
      </Text>
    </View>
  );
}

// ============================================================
// REWARD ITEM
// ============================================================

function RewardItem({
  icon,
  imageSource,
  label,
  value,
  valueColor =
    COLORS.white,
  subtitle,
}) {
  return (
    <View
      style={
        styles.rewardItem
      }
    >
      <View
        style={
          styles.rewardIconBox
        }
      >
        {imageSource ? (
          <Image
            source={
              imageSource
            }
            style={
              styles.rewardCoinImage
            }
            resizeMode="contain"
          />
        ) : (
          <Text
            style={
              styles.rewardIcon
            }
          >
            {icon}
          </Text>
        )}
      </View>

      <View
        style={
          styles.rewardTextWrap
        }
      >
        <Text
          style={
            styles.rewardLabel
          }
        >
          {label}
        </Text>

        <Text
          style={[
            styles.rewardValue,
            {
              color:
                valueColor,
            },
          ]}
        >
          {value}
        </Text>

        {!!subtitle && (
          <Text
            style={
              styles.rewardSubtitle
            }
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

// ============================================================
// ACCESS BADGE
// ============================================================

function AccessBadge({
  accessLevel,
  t,
}) {
  const config = {
    free: {
      label:
        t(
          "free"
        ),

      icon:
        "checkmark-circle",

      backgroundColor:
        COLORS.mint,

      color:
        COLORS.black,
    },

    premium: {
      label:
        t(
          "premium"
        ),

      icon:
        "star",

      backgroundColor:
        COLORS.gold,

      color:
        COLORS.black,
    },

    elite: {
      label:
        t(
          "elite"
        ),

      icon:
        "diamond",

      backgroundColor:
        COLORS.purple,

      color:
        COLORS.black,
    },
  };

  const current =
    config[
      accessLevel
    ] ||
    config.free;

  return (
    <View
      style={[
        styles.accessBadge,

        {
          backgroundColor:
            current
              .backgroundColor,
        },
      ]}
    >
      <Ionicons
        name={
          current.icon
        }
        size={
          15
        }
        color={
          current.color
        }
      />

      <Text
        style={[
          styles.accessBadgeText,

          {
            color:
              current.color,
          },
        ]}
      >
        {
          current.label
        }
      </Text>
    </View>
  );
}

// ============================================================
// CHECKPOINT PREVIEW
// ============================================================

function ProgressPreview({
  checkpoints = 5,
}) {
  const safeCheckpointCount =
    Math.max(
      1,
      Number(
        checkpoints ||
          5
      )
    );

  return (
    <View
      style={
        styles.progressPreview
      }
    >
      {Array.from(
        {
          length:
            safeCheckpointCount,
        },

        (
          _,
          index
        ) => {
          const checkpointNumber =
            index +
            1;

          const isFinish =
            checkpointNumber ===
            safeCheckpointCount;

          return (
            <React.Fragment
              key={
                checkpointNumber
              }
            >
              <View
                style={[
                  styles.checkpointCircle,

                  isFinish &&
                    styles.finishCheckpoint,
                ]}
              >
                {isFinish ? (
                  <Ionicons
                    name="flag"
                    size={
                      18
                    }
                    color={
                      COLORS.black
                    }
                  />
                ) : (
                  <Text
                    style={
                      styles.checkpointNumber
                    }
                  >
                    {
                      checkpointNumber
                    }
                  </Text>
                )}
              </View>

              {!isFinish && (
                <View
                  style={
                    styles.checkpointLine
                  }
                />
              )}
            </React.Fragment>
          );
        }
      )}
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function JourneyDetailScreen({
  language = "en",

  route,

  navigation,

  journey:
    journeyProp,

  subscriptionPlan:
    subscriptionPlanProp =
      "free",

  lifetimeSteps = 0,

  goBack,

  startJourney,

  goToSubscription,

  goToStory,
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
        : DETAIL_TRANSLATIONS?.[
            language
          ]?.[key] ??
          DETAIL_TRANSLATIONS
            .en?.[key] ??
          key;

    return fillTemplate(
      value,
      variables
    );
  }

  // ==========================================================
  // JOURNEY
  // ==========================================================

  const routeJourney =
    route
      ?.params
      ?.journey;

  const routeJourneyId =
    route
      ?.params
      ?.journeyId;

  const journey =
    useMemo(
      () => {
        if (
          routeJourney
        ) {
          return routeJourney;
        }

        if (
          journeyProp
        ) {
          return journeyProp;
        }

        if (
          routeJourneyId
        ) {
          return getJourneyById(
            routeJourneyId
          );
        }

        return null;
      },

      [
        routeJourney,
        journeyProp,
        routeJourneyId,
      ]
    );

  // ==========================================================
  // ID
  // ==========================================================

  const journeyId =
    journey?.id ||
    journey?.journeyId ||
    journey?.routeKey ||
    journey?.slug ||
    routeJourneyId ||
    "great-wall-of-china";

  const normalizedJourneyId =
    String(
      journeyId ||
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

  const journeyReward =
    JOURNEY_REWARDS[
      normalizedJourneyId
    ] ||
    JOURNEY_REWARDS[
      "great-wall-of-china"
    ] ||
    null;

  // ==========================================================
  // PLAN
  // ==========================================================

  const subscriptionPlan =
    route
      ?.params
      ?.subscriptionPlan ??
    subscriptionPlanProp ??
    "free";

  // ==========================================================
  // DISTANCE
  // ==========================================================

  const miles =
    Number(
      journey
        ?.distanceMiles ??
      journey?.miles ??
      journeyReward
        ?.distanceMiles ??
      0
    );

  // ==========================================================
  // STEPS
  // ==========================================================

  const steps =
    Number(
      journey
        ?.totalSteps ??
      journey?.steps ??
      journeyReward
        ?.totalSteps
    ) ||
    calculateJourneySteps(
      miles
    );

  // ==========================================================
  // DIFFICULTY
  // ==========================================================

  const rawDifficulty =
    journey?.difficulty ||
    "Easy";

  function translatedDifficulty(
    value
  ) {
    const map = {
      Easy:
        "easy",

      Beginner:
        "beginner",

      Intermediate:
        "intermediate",

      Advanced:
        "advanced",

      Hard:
        "hard",

      Expert:
        "expert",
    };

    const key =
      map[
        value
      ];

    return key
      ? t(key)
      : value;
  }

  const difficulty =
    translatedDifficulty(
      rawDifficulty
    );

  // ==========================================================
  // TIME
  // ==========================================================

  const estimatedTime =
    journey
      ?.estimatedTime ||
    t(
      "upToOneWeek"
    );

  // ==========================================================
  // BADGE
  // ==========================================================

  const rawBadge =
    journey?.rank ||
    journey?.badge ||
    journeyReward?.badge ||
    "Explorer";

  const badge =
    rawBadge ===
    "Explorer"
      ? t(
          "explorer"
        )
      : rawBadge;

  // ==========================================================
  // REWARDS
  // ==========================================================

  const legathonPoints =
    Number(
      journey
        ?.rewardPoints ??
      journeyReward
        ?.rewardPoints ??
      0
    );

  const xpReward =
    Number(
      journey
        ?.xpReward ??
      journey
        ?.avatarXP ??
      journeyReward
        ?.avatarXP ??
      0
    );

  const wCoinReward =
    getRewardWCoins(
      {
        ...journeyReward,
        ...journey,
      },

      subscriptionPlan
    );

  // ==========================================================
  // ACCESS
  // ==========================================================

  const accessLevel =
    normalizeAccessLevel(
      journey
    );

  const userCanStart =
    canAccessJourney(
      journey,
      subscriptionPlan
    );

  // ==========================================================
  // CHECKPOINTS
  // ==========================================================

  const checkpoints =
    Number(
      journey
        ?.checkpoints ||
      5
    );

  // ==========================================================
  // IMAGE
  // ==========================================================

  const imageSource =
    journey?.image ||
    FALLBACK_ROUTE;

  // ==========================================================
  // PLAN REWARD LABEL
  // ==========================================================

  const currentPlanLabel =
    normalizePlan(
      subscriptionPlan
    );

  const rewardPlanLabel =
    currentPlanLabel ===
    "elite"
      ? t(
          "eliteReward"
        )
      : currentPlanLabel ===
        "premium"
      ? t(
          "premiumReward"
        )
      : t(
          "freeReward"
        );

  // ==========================================================
  // LOCKED BUTTON
  // ==========================================================

  function getLockedText() {
    return accessLevel ===
      "elite"
      ? t(
          "unlockElite"
        )
      : t(
          "unlockPremium"
        );
  }

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
          ?.goBack
      ) {
        navigation
          .goBack();
      }
    };

  // ==========================================================
  // STORY
  // ==========================================================

  const handleOpenStory =
    () => {
      if (
        typeof goToStory ===
        "function"
      ) {
        goToStory(
          journey
        );

        return;
      }

      if (
        navigation
          ?.navigate
      ) {
        navigation
          .navigate(
            "JourneyStory",

            {
              journeyId:
                journey
                  ?.id,

              journey,

              language,
            }
          );
      }
    };

  // ==========================================================
  // SUBSCRIPTION
  // ==========================================================

  const handleSubscription =
    () => {
      if (
        typeof goToSubscription ===
        "function"
      ) {
        goToSubscription(
          journey
        );

        return;
      }

      if (
        navigation
          ?.navigate
      ) {
        navigation
          .navigate(
            "Subscription",

            {
              requiredPlan:
                accessLevel,

              journeyId:
                journey
                  ?.id,

              journeyTitle:
                journey
                  ?.title,

              language,
            }
          );
      }
    };

  // ==========================================================
  // START JOURNEY
  // ==========================================================

  const handleStartJourney =
    async () => {
      if (
        !userCanStart
      ) {
        handleSubscription();

        return;
      }

      if (
        typeof startJourney ===
        "function"
      ) {
        startJourney(
          journey
        );

        return;
      }

      if (
        navigation
          ?.navigate
      ) {
        await AsyncStorage
          .setItem(
            "activeJourney",

            JSON.stringify(
              journey
            )
          );

        navigation
          .navigate(
            "GPSJourneyMap",

            {
              journeyId:
                journey
                  ?.id,

              journey,

              language,
            }
          );
      }
    };

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (
    !journey
  ) {
    return (
      <SafeAreaView
        style={
          styles.safe
        }
      >
        <View
          style={
            styles.emptyContainer
          }
        >
          <Ionicons
            name="map-outline"
            size={
              58
            }
            color={
              COLORS.gold
            }
          />

          <Text
            style={
              styles.emptyTitle
            }
          >
            {t(
              "journeyNotFound"
            )}
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            {t(
              "journeyLoadError"
            )}
          </Text>

          <TouchableOpacity
            style={
              styles.emptyButton
            }
            onPress={
              handleBack
            }
          >
            <Text
              style={
                styles.emptyButtonText
              }
            >
              {t(
                "returnJourneys"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >
      <ImageBackground
        source={
          imageSource
        }
        style={
          styles.background
        }
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(2,6,17,0.54)",

            "rgba(2,6,17,0.88)",

            COLORS.background,
          ]}
          locations={[
            0,
            0.34,
            0.67,
          ]}
          style={
            styles.overlay
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
            <HeaderButton
              icon=
                "chevron-back"
              onPress={
                handleBack
              }
            />

            <View
              style={
                styles.headerCenter
              }
            >
              <Text
                style={
                  styles.headerEyebrow
                }
              >
                LEGATHON WALK
              </Text>

              <Text
                style={
                  styles.headerTitle
                }
                numberOfLines={
                  1
                }
                adjustsFontSizeToFit
                minimumFontScale={
                  0.7
                }
              >
                {t(
                  "journeyDetails"
                )}
              </Text>
            </View>

            <HeaderButton
              icon=
                "bookmark-outline"
              onPress={() => {}}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* ==================================================
                HERO
            ================================================== */}

            <View
              style={
                styles.heroCard
              }
            >
              <Image
                source={
                  imageSource
                }
                style={
                  styles.heroImage
                }
                resizeMode="cover"
              />

              <LinearGradient
                colors={[
                  "transparent",

                  "rgba(2,6,17,0.54)",

                  COLORS.surface,
                ]}
                style={
                  styles.heroImageOverlay
                }
              />

              <AccessBadge
                accessLevel={
                  accessLevel
                }
                t={
                  t
                }
              />

              <View
                style={
                  styles.heroContent
                }
              >
                {!!journey
                  ?.category && (
                  <Text
                    style={
                      styles.categoryText
                    }
                  >
                    {
                      journey
                        .category
                    }
                  </Text>
                )}

                <Text
                  style={
                    styles.journeyTitle
                  }
                  numberOfLines={
                    3
                  }
                  adjustsFontSizeToFit
                  minimumFontScale={
                    0.72
                  }
                >
                  {
                    journey.title
                  }
                </Text>

                {!!(
                  journey
                    ?.country ||
                  journey
                    ?.location
                ) && (
                  <Text
                    style={
                      styles.locationText
                    }
                  >
                    {journey
                      ?.location ||
                      journey
                        ?.country}
                  </Text>
                )}
              </View>
            </View>

            {/* ==================================================
                STATS
            ================================================== */}

            <View
              style={
                styles.statsGrid
              }
            >
              <Stat
                label={
                  t(
                    "distance"
                  )
                }
                value={
                  `${formatNumber(
                    miles
                  )} mi`
                }
                icon=
                  "map-outline"
                color={
                  COLORS.mint
                }
              />

              <Stat
                label={
                  t(
                    "steps"
                  )
                }
                value={
                  formatNumber(
                    steps
                  )
                }
                icon=
                  "footsteps-outline"
                color={
                  COLORS.blue
                }
              />

              <Stat
                label={
                  t(
                    "difficulty"
                  )
                }
                value={
                  difficulty
                }
                icon=
                  "speedometer-outline"
                color={
                  COLORS.gold
                }
              />

              <Stat
                label={
                  t(
                    "estimatedTime"
                  )
                }
                value={
                  estimatedTime
                }
                icon=
                  "time-outline"
                color={
                  COLORS.purple
                }
              />
            </View>

            {/* ==================================================
                OVERVIEW
            ================================================== */}

            <LinearGradient
              colors={[
                "rgba(15,34,58,0.97)",

                "rgba(7,20,39,0.98)",
              ]}
              style={
                styles.overviewCard
              }
            >
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "journeyOverview"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "walkThroughHistory"
                )}
              </Text>

              <Text
                style={
                  styles.overviewText
                }
              >
                {journey
                  ?.subtitle ||
                  t(
                    "defaultOverview"
                  )}
              </Text>

              <TouchableOpacity
                style={
                  styles.storyButton
                }
                activeOpacity={
                  0.85
                }
                onPress={
                  handleOpenStory
                }
              >
                <Ionicons
                  name=
                    "book-outline"
                  size={
                    21
                  }
                  color={
                    COLORS.mint
                  }
                />

                <Text
                  style={
                    styles.storyButtonText
                  }
                >
                  {t(
                    "readJourneyStory"
                  )}
                </Text>

                <Ionicons
                  name=
                    "chevron-forward"
                  size={
                    20
                  }
                  color={
                    COLORS.mint
                  }
                />
              </TouchableOpacity>
            </LinearGradient>

            {/* ==================================================
                REWARDS
            ================================================== */}

            <LinearGradient
              colors={[
                "rgba(47,38,8,0.96)",

                "rgba(12,25,43,0.98)",
              ]}
              style={
                styles.rewardsCard
              }
            >
              <View
                style={
                  styles.sectionHeaderRow
                }
              >
                <View
                  style={{
                    flex:
                      1,
                  }}
                >
                  <Text
                    style={
                      styles.rewardsEyebrow
                    }
                  >
                    {t(
                      "journeyRewards"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.rewardsTitle
                    }
                  >
                    {t(
                      "completeToEarn"
                    )}
                  </Text>
                </View>

                <Ionicons
                  name=
                    "trophy"
                  size={
                    39
                  }
                  color={
                    COLORS.gold
                  }
                />
              </View>

              <View
                style={
                  styles.rewardsList
                }
              >
                <RewardItem
                  imageSource={
                    WCOIN_ICON
                  }
                  label={
                    t(
                      "wcoins"
                    )
                  }
                  value={
                    `${formatNumber(
                      wCoinReward
                    )} WCoins`
                  }
                  valueColor={
                    COLORS.gold
                  }
                  subtitle={
                    rewardPlanLabel
                  }
                />

                <RewardItem
                  icon="⭐"
                  label={
                    t(
                      "legathonPoints"
                    )
                  }
                  value={
                    `${formatNumber(
                      legathonPoints
                    )} ${t(
                      "points"
                    )}`
                  }
                  valueColor={
                    COLORS.mint
                  }
                  subtitle={
                    t(
                      "pointsSubtitle"
                    )
                  }
                />

                {xpReward >
                  0 && (
                  <RewardItem
                    icon="✨"
                    label={
                      t(
                        "avatarXP"
                      )
                    }
                    value={
                      `${formatNumber(
                        xpReward
                      )} XP`
                    }
                    valueColor={
                      COLORS.purple
                    }
                    subtitle={
                      t(
                        "avatarProgression"
                      )
                    }
                  />
                )}

                <RewardItem
                  icon="👣"
                  label={
                    t(
                      "lifetimeSteps"
                    )
                  }
                  value={
                    `+${formatNumber(
                      steps
                    )}`
                  }
                  valueColor={
                    COLORS.blue
                  }
                  subtitle={
                    t(
                      "projectedLifetime",

                      {
                        count:
                          formatNumber(
                            Number(
                              lifetimeSteps ||
                                0
                            ) +
                              steps
                          ),
                      }
                    )
                  }
                />

                <RewardItem
                  icon="🏅"
                  label={
                    t(
                      "journeyBadge"
                    )
                  }
                  value={
                    badge
                  }
                  valueColor={
                    COLORS.goldLight
                  }
                  subtitle={
                    t(
                      "awardedOnce"
                    )
                  }
                />

                <RewardItem
                  icon="📘"
                  label={
                    t(
                      "passportStamp"
                    )
                  }
                  value={
                    journey
                      ?.passportStamp ===
                    false
                      ? t(
                          "notIncluded"
                        )
                      : t(
                          "included"
                        )
                  }
                  valueColor={
                    COLORS.green
                  }
                />

                <RewardItem
                  icon="📜"
                  label={
                    t(
                      "certificate"
                    )
                  }
                  value={
                    journey
                      ?.certificate ===
                    false
                      ? t(
                          "notIncluded"
                        )
                      : t(
                          "included"
                        )
                  }
                  valueColor={
                    COLORS.green
                  }
                />
              </View>
            </LinearGradient>

            {/* ==================================================
                CHECKPOINTS
            ================================================== */}

            <View
              style={
                styles.checkpointCard
              }
            >
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "fiveCheckpointRoute"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "yourJourneyPath"
                )}
              </Text>

              <Text
                style={
                  styles.checkpointDescription
                }
              >
                {t(
                  "checkpointDescription",

                  {
                    count:
                      checkpoints,
                  }
                )}
              </Text>

              <ProgressPreview
                checkpoints={
                  checkpoints
                }
              />

              <View
                style={
                  styles.routeInfoRow
                }
              >
                <View
                  style={
                    styles.routeInfoItem
                  }
                >
                  <Ionicons
                    name=
                      "flag-outline"
                    size={
                      20
                    }
                    color={
                      COLORS.mint
                    }
                  />

                  <Text
                    style={
                      styles.routeInfoText
                    }
                  >
                    {t(
                      "checkpoints",

                      {
                        count:
                          checkpoints,
                      }
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.routeInfoItem
                  }
                >
                  <Ionicons
                    name=
                      "navigate-outline"
                    size={
                      20
                    }
                    color={
                      COLORS.blue
                    }
                  />

                  <Text
                    style={
                      styles.routeInfoText
                    }
                  >
                    {t(
                      "gpsGuided"
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.routeInfoItem
                  }
                >
                  <Ionicons
                    name=
                      "book-outline"
                    size={
                      20
                    }
                    color={
                      COLORS.gold
                    }
                  />

                  <Text
                    style={
                      styles.routeInfoText
                    }
                  >
                    {t(
                      "narration"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* ==================================================
                LOCKED MESSAGE
            ================================================== */}

            {!userCanStart && (
              <View
                style={
                  styles.lockedCard
                }
              >
                <View
                  style={
                    styles.lockedIcon
                  }
                >
                  <Ionicons
                    name=
                      "lock-closed"
                    size={
                      28
                    }
                    color={
                      COLORS.gold
                    }
                  />
                </View>

                <View
                  style={
                    styles.lockedTextWrap
                  }
                >
                  <Text
                    style={
                      styles.lockedTitle
                    }
                  >
                    {accessLevel ===
                    "elite"
                      ? t(
                          "eliteJourney"
                        )
                      : t(
                          "premiumJourney"
                        )}
                  </Text>

                  <Text
                    style={
                      styles.lockedText
                    }
                  >
                    {t(
                      "lockedMessage"
                    )}
                  </Text>
                </View>
              </View>
            )}

            {/* ==================================================
                START
            ================================================== */}

            <TouchableOpacity
              style={[
                styles.startButton,

                !userCanStart &&
                  styles.lockedStartButton,
              ]}
              activeOpacity={
                0.86
              }
              onPress={
                handleStartJourney
              }
            >
              <Ionicons
                name={
                  userCanStart
                    ? "walk"
                    : "lock-closed"
                }
                size={
                  24
                }
                color={
                  COLORS.black
                }
              />

              <Text
                style={
                  styles.startButtonText
                }
              >
                {userCanStart
                  ? t(
                      "startJourney"
                    )
                  : getLockedText()}
              </Text>
            </TouchableOpacity>

            {/* ==================================================
                RETURN
            ================================================== */}

            <TouchableOpacity
              style={
                styles.secondaryButton
              }
              activeOpacity={
                0.85
              }
              onPress={
                handleBack
              }
            >
              <Ionicons
                name=
                  "albums-outline"
                size={
                  21
                }
                color={
                  COLORS.white
                }
              />

              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                {t(
                  "returnCatalog"
                )}
              </Text>
            </TouchableOpacity>

            <View
              style={
                styles.bottomSpacer
              }
            />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    safe: {
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },

    background: {
      flex:
        1,
    },

    overlay: {
      flex:
        1,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      paddingHorizontal:
        18,

      paddingTop:
        10,

      paddingBottom:
        12,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    headerButton: {
      width:
        46,

      height:
        46,

      borderRadius:
        23,

      backgroundColor:
        "rgba(255,255,255,0.09)",

      borderWidth:
        1,

      borderColor:
        "rgba(255,255,255,0.16)",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    headerCenter: {
      flex:
        1,

      paddingHorizontal:
        10,

      alignItems:
        "center",
    },

    headerEyebrow: {
      color:
        COLORS.gold,

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        2.2,
    },

    headerTitle: {
      color:
        COLORS.white,

      fontSize:
        20,

      fontWeight:
        "900",

      marginTop:
        2,

      textAlign:
        "center",
    },

    scrollContent: {
      paddingHorizontal:
        18,

      paddingBottom:
        30,
    },

    // ==========================================================
    // HERO
    // ==========================================================

    heroCard: {
      height:
        390,

      borderRadius:
        32,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.surface,

      borderWidth:
        1,

      borderColor:
        COLORS.gold,
    },

    heroImage: {
      width:
        "100%",

      height:
        "100%",
    },

    heroImageOverlay: {
      ...StyleSheet.absoluteFillObject,
    },

    accessBadge: {
      position:
        "absolute",

      top:
        18,

      right:
        18,

      zIndex:
        5,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        13,

      paddingVertical:
        8,

      borderRadius:
        18,
    },

    accessBadgeText: {
      marginLeft:
        6,

      fontSize:
        11,

      fontWeight:
        "900",

      letterSpacing:
        0.5,
    },

    heroContent: {
      position:
        "absolute",

      left:
        22,

      right:
        22,

      bottom:
        24,
    },

    categoryText: {
      color:
        COLORS.mint,

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        1.7,
    },

    journeyTitle: {
      color:
        COLORS.white,

      fontSize:
        34,

      lineHeight:
        39,

      fontWeight:
        "900",

      marginTop:
        8,
    },

    locationText: {
      color:
        COLORS.textSecondary,

      fontSize:
        15,

      fontWeight:
        "700",

      marginTop:
        8,
    },

    // ==========================================================
    // STATS
    // ==========================================================

    statsGrid: {
      marginTop:
        16,

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },

    statCard: {
      width:
        "48%",

      minHeight:
        112,

      backgroundColor:
        "rgba(8,22,42,0.96)",

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      padding:
        17,

      marginBottom:
        12,
    },

    statTopRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    statLabel: {
      flex:
        1,

      color:
        COLORS.textSecondary,

      fontSize:
        12,

      fontWeight:
        "800",

      marginLeft:
        7,
    },

    statValue: {
      fontSize:
        20,

      fontWeight:
        "900",

      marginTop:
        13,
    },

    // ==========================================================
    // OVERVIEW
    // ==========================================================

    overviewCard: {
      borderRadius:
        28,

      padding:
        23,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      marginTop:
        6,
    },

    sectionEyebrow: {
      color:
        COLORS.mint,

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        2.2,
    },

    sectionTitle: {
      color:
        COLORS.white,

      fontSize:
        27,

      fontWeight:
        "900",

      marginTop:
        9,
    },

    overviewText: {
      color:
        COLORS.textSecondary,

      fontSize:
        16,

      lineHeight:
        25,

      fontWeight:
        "600",

      marginTop:
        14,
    },

    storyButton: {
      minHeight:
        56,

      marginTop:
        22,

      borderRadius:
        20,

      backgroundColor:
        "rgba(143,246,208,0.08)",

      borderWidth:
        1,

      borderColor:
        "rgba(143,246,208,0.34)",

      paddingHorizontal:
        17,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    storyButtonText: {
      flex:
        1,

      color:
        COLORS.mint,

      fontSize:
        15,

      fontWeight:
        "900",

      marginLeft:
        10,
    },

    // ==========================================================
    // REWARDS
    // ==========================================================

    rewardsCard: {
      borderRadius:
        28,

      padding:
        23,

      borderWidth:
        1,

      borderColor:
        "rgba(247,201,72,0.52)",

      marginTop:
        16,
    },

    sectionHeaderRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    rewardsEyebrow: {
      color:
        COLORS.mint,

      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        2.2,
    },

    rewardsTitle: {
      color:
        COLORS.white,

      fontSize:
        28,

      fontWeight:
        "900",

      marginTop:
        7,
    },

    rewardsList: {
      marginTop:
        20,
    },

    rewardItem: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        14,

      borderBottomWidth:
        1,

      borderBottomColor:
        "rgba(255,255,255,0.08)",
    },

    rewardIconBox: {
      width:
        50,

      height:
        50,

      borderRadius:
        18,

      backgroundColor:
        "rgba(255,255,255,0.07)",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        13,
    },

    rewardIcon: {
      fontSize:
        25,
    },

    rewardCoinImage: {
      width:
        40,

      height:
        40,
    },

    rewardTextWrap: {
      flex:
        1,
    },

    rewardLabel: {
      color:
        COLORS.textSecondary,

      fontSize:
        12,

      fontWeight:
        "800",
    },

    rewardValue: {
      fontSize:
        18,

      fontWeight:
        "900",

      marginTop:
        4,
    },

    rewardSubtitle: {
      color:
        COLORS.muted,

      fontSize:
        11,

      lineHeight:
        16,

      marginTop:
        3,
    },

    // ==========================================================
    // CHECKPOINTS
    // ==========================================================

    checkpointCard: {
      borderRadius:
        28,

      padding:
        23,

      backgroundColor:
        "rgba(8,22,42,0.97)",

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      marginTop:
        16,
    },

    checkpointDescription: {
      color:
        COLORS.textSecondary,

      fontSize:
        15,

      lineHeight:
        23,

      marginTop:
        13,
    },

    progressPreview: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        28,
    },

    checkpointCircle: {
      width:
        43,

      height:
        43,

      borderRadius:
        22,

      backgroundColor:
        COLORS.teal,

      borderWidth:
        3,

      borderColor:
        COLORS.white,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    finishCheckpoint: {
      backgroundColor:
        COLORS.gold,
    },

    checkpointNumber: {
      color:
        COLORS.black,

      fontSize:
        15,

      fontWeight:
        "900",
    },

    checkpointLine: {
      flex:
        1,

      height:
        4,

      backgroundColor:
        COLORS.border,

      marginHorizontal:
        4,
    },

    routeInfoRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginTop:
        28,
    },

    routeInfoItem: {
      width:
        "31%",

      alignItems:
        "center",
    },

    routeInfoText: {
      color:
        COLORS.textSecondary,

      fontSize:
        11,

      fontWeight:
        "800",

      textAlign:
        "center",

      marginTop:
        7,
    },

    // ==========================================================
    // LOCKED
    // ==========================================================

    lockedCard: {
      flexDirection:
        "row",

      backgroundColor:
        "rgba(247,201,72,0.09)",

      borderWidth:
        1,

      borderColor:
        "rgba(247,201,72,0.48)",

      borderRadius:
        24,

      padding:
        18,

      marginTop:
        16,
    },

    lockedIcon: {
      width:
        54,

      height:
        54,

      borderRadius:
        20,

      backgroundColor:
        "rgba(247,201,72,0.13)",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        14,
    },

    lockedTextWrap: {
      flex:
        1,
    },

    lockedTitle: {
      color:
        COLORS.gold,

      fontSize:
        18,

      fontWeight:
        "900",
    },

    lockedText: {
      color:
        COLORS.textSecondary,

      fontSize:
        13,

      lineHeight:
        20,

      marginTop:
        5,
    },

    // ==========================================================
    // BUTTONS
    // ==========================================================

    startButton: {
      minHeight:
        66,

      borderRadius:
        24,

      backgroundColor:
        COLORS.gold,

      marginTop:
        22,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        18,
    },

    lockedStartButton: {
      backgroundColor:
        COLORS.goldLight,
    },

    startButtonText: {
      flexShrink:
        1,

      color:
        COLORS.black,

      fontSize:
        19,

      fontWeight:
        "900",

      marginLeft:
        10,

      textAlign:
        "center",
    },

    secondaryButton: {
      minHeight:
        60,

      borderRadius:
        22,

      backgroundColor:
        COLORS.surfaceLight,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      marginTop:
        13,

      paddingHorizontal:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    secondaryButtonText: {
      flexShrink:
        1,

      color:
        COLORS.white,

      fontSize:
        16,

      fontWeight:
        "900",

      marginLeft:
        9,

      textAlign:
        "center",
    },

    bottomSpacer: {
      height:
        120,
    },

    // ==========================================================
    // EMPTY
    // ==========================================================

    emptyContainer: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        30,
    },

    emptyTitle: {
      color:
        COLORS.white,

      fontSize:
        29,

      fontWeight:
        "900",

      textAlign:
        "center",

      marginTop:
        18,
    },

    emptyText: {
      color:
        COLORS.textSecondary,

      fontSize:
        15,

      lineHeight:
        23,

      textAlign:
        "center",

      marginTop:
        10,
    },

    emptyButton: {
      minHeight:
        56,

      marginTop:
        24,

      paddingHorizontal:
        24,

      borderRadius:
        20,

      backgroundColor:
        COLORS.gold,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    emptyButtonText: {
      color:
        COLORS.black,

      fontSize:
        16,

      fontWeight:
        "900",

      textAlign:
        "center",
    },
  });