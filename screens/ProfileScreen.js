// screens/ProfileScreen.js

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  AppState,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  avatarOptions,
} from "../data/avatarOptions";

import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";

import {
  getCurrentAvatarSuit,
} from "../utils/avatarWardrobeStorage";

import {
  translate,
} from "../i18n/i18n";

import useLegathonPoints from "../hooks/useLegathonPoints";

// ============================================================
// ASSETS
// ============================================================

const COLLAGE_BG =
  require("../assets/collage-background.png");

const LOCKED_PASSPORT =
  require("../assets/locked/legacy-lock.png");

const PASSPORT_IMAGES = {
  rome:
    require("../assets/passports/rome.png"),

  wall:
    require("../assets/passports/greatwallofchina.png"),

  tubman:
    require("../assets/passports/tubman.png"),

  mecca:
    require("../assets/passports/meccaroute.png"),

  tokyo:
    require("../assets/passports/tokyo.png"),
};

// ============================================================
// CONSTANTS
// ============================================================

const STEPS_PER_MILE = 2000;

// ============================================================
// PROFILE TRANSLATIONS
// ============================================================

const PROFILE_TEXT = {
  en: {
    profileTitle: "Legathon Profile",
    profileSubtitle:
      "Your walking Legathon in one place",

    identity:
      "YOUR LEGATHON IDENTITY",

    legathonPoints:
      "Legathon Points",

    percentTo:
      "{percent}% to {rank}",

    openAvatarCenter:
      "Open Avatar Center",

    walkingLegathon:
      "WALKING LEGATHON",

    performance:
      "Performance",

    journeySteps:
      "Journey Steps",

    miles:
      "Miles",

    journeys:
      "Journeys",

    completed:
      "Completed",

    stamps:
      "Stamps",

    dayStreak:
      "Day Streak",

    journeyIdentity:
      "JOURNEY IDENTITY",

    favoriteJourney:
      "Favorite Journey",

    journeyProgress:
      "Legathon Journey • {percent}% Complete",

    worldCollection:
      "WORLD COLLECTION",

    passportCollection:
      "Passport Collection",

    unlocked:
      "UNLOCKED",

    locked:
      "LOCKED",

    achievementWall:
      "ACHIEVEMENT WALL",

    badgesEarned:
      "Badges Earned",

    rewardsSaved:
      "{count} saved rewards • milestone badges update automatically",

    firstRoute:
      "First Route",

    firstPassport:
      "First Passport",

    streakMaster:
      "Streak Master",

    worldExplorer:
      "World Explorer",

    earned:
      "EARNED",

    journeyHistory:
      "JOURNEY HISTORY",

    journeyTimeline:
      "Journey Timeline",

    timelineEmpty:
      "Complete your first journey to begin your Legathon timeline.",

    completedStatus:
      "Completed",

    percentComplete:
      "{percent}% Complete",

    yourAscent:
      "YOUR ASCENT",

    legathonRank:
      "Legathon Rank",

    current:
      "CURRENT",

    showcase:
      "LEGATHON SHOWCASE",

    publicHighlights:
      "Public Profile Highlights",

    avatar:
      "Avatar",

    outfit:
      "Outfit",

    favoritePassport:
      "Favorite Passport",

    favoriteBadge:
      "Favorite Badge",

    favoriteJourneyLabel:
      "Favorite Journey",

    walker:
      "LEGATHON WALKER",

    buildLegacy:
      "Keep Building Your Journey",

    footer:
      "Every Journey Step, completed route, passport stamp, and achievement adds another chapter to your walking story.",

    updating:
      "Updating profile…",

    noneYet:
      "None Yet",

    noBadge:
      "No Badge Yet",

    noFavorite:
      "No Favorite Yet",

    legathonWalker:
      "Legathon Walker",

    legathonJourney:
      "Legathon Journey",

    defaultOutfit:
      "Default Outfit",

    blueTracksuit:
      "Blue Tracksuit",

    greenTracksuit:
      "Green Tracksuit",

    redTracksuit:
      "Red Tracksuit",

    yellowTracksuit:
      "Yellow Tracksuit",

    eliteTracksuit:
      "Black & Gold Elite",

    rankNewWalker:
      "New Walker",

    rankExplorer:
      "Explorer",

    rankPathfinder:
      "Pathfinder",

    rankTrailblazer:
      "Trailblazer",

    rankAdventurer:
      "Adventurer",

    rankChampion:
      "Champion",

    rankMasterWalker:
      "Master Walker",

    rankLegathonHero:
      "Legathon Hero",

    rankLegend:
      "Legend",

    rankHallOfFame:
      "Hall of Fame",

    passportRome:
      "Rome",

    passportWall:
      "Great Wall",

    passportTubman:
      "Tubman",

    passportMecca:
      "Mecca",

    passportTokyo:
      "Tokyo",
  },

  es: {
    profileTitle:
      "Perfil Legathon",

    profileSubtitle:
      "Toda tu experiencia Legathon en un solo lugar",

    identity:
      "TU IDENTIDAD LEGATHON",

    legathonPoints:
      "Puntos Legathon",

    percentTo:
      "{percent}% para {rank}",

    openAvatarCenter:
      "Abrir Centro de Avatar",

    walkingLegathon:
      "TU LEGATHON DE CAMINATA",

    performance:
      "Rendimiento",

    journeySteps:
      "Pasos de Viaje",

    miles:
      "Millas",

    journeys:
      "Viajes",

    completed:
      "Completados",

    stamps:
      "Sellos",

    dayStreak:
      "Racha de Días",

    journeyIdentity:
      "IDENTIDAD DEL VIAJE",

    favoriteJourney:
      "Viaje Favorito",

    journeyProgress:
      "Viaje Legathon • {percent}% Completado",

    worldCollection:
      "COLECCIÓN MUNDIAL",

    passportCollection:
      "Colección de Pasaportes",

    unlocked:
      "DESBLOQUEADO",

    locked:
      "BLOQUEADO",

    achievementWall:
      "MURO DE LOGROS",

    badgesEarned:
      "Insignias Ganadas",

    rewardsSaved:
      "{count} recompensas guardadas • las insignias se actualizan automáticamente",

    firstRoute:
      "Primera Ruta",

    firstPassport:
      "Primer Pasaporte",

    streakMaster:
      "Maestro de Rachas",

    worldExplorer:
      "Explorador Mundial",

    earned:
      "GANADO",

    journeyHistory:
      "HISTORIAL DE VIAJES",

    journeyTimeline:
      "Cronología de Viajes",

    timelineEmpty:
      "Completa tu primer viaje para comenzar tu cronología Legathon.",

    completedStatus:
      "Completado",

    percentComplete:
      "{percent}% Completado",

    yourAscent:
      "TU ASCENSO",

    legathonRank:
      "Rango Legathon",

    current:
      "ACTUAL",

    showcase:
      "EXHIBICIÓN LEGATHON",

    publicHighlights:
      "Aspectos Destacados del Perfil",

    avatar:
      "Avatar",

    outfit:
      "Atuendo",

    favoritePassport:
      "Pasaporte Favorito",

    favoriteBadge:
      "Insignia Favorita",

    favoriteJourneyLabel:
      "Viaje Favorito",

    walker:
      "CAMINANTE LEGATHON",

    buildLegacy:
      "Sigue Construyendo Tu Viaje",

    footer:
      "Cada paso, ruta completada, sello de pasaporte y logro añade otro capítulo a tu historia de caminata.",

    updating:
      "Actualizando perfil…",

    noneYet:
      "Ninguno Todavía",

    noBadge:
      "Sin Insignia Todavía",

    noFavorite:
      "Sin Favorito Todavía",

    legathonWalker:
      "Caminante Legathon",

    legathonJourney:
      "Viaje Legathon",

    defaultOutfit:
      "Atuendo Predeterminado",

    blueTracksuit:
      "Chándal Azul",

    greenTracksuit:
      "Chándal Verde",

    redTracksuit:
      "Chándal Rojo",

    yellowTracksuit:
      "Chándal Amarillo",

    eliteTracksuit:
      "Elite Negro y Dorado",

    rankNewWalker:
      "Nuevo Caminante",

    rankExplorer:
      "Explorador",

    rankPathfinder:
      "Buscador de Caminos",

    rankTrailblazer:
      "Pionero",

    rankAdventurer:
      "Aventurero",

    rankChampion:
      "Campeón",

    rankMasterWalker:
      "Maestro Caminante",

    rankLegathonHero:
      "Héroe Legathon",

    rankLegend:
      "Leyenda",

    rankHallOfFame:
      "Salón de la Fama",

    passportRome:
      "Roma",

    passportWall:
      "Gran Muralla",

    passportTubman:
      "Tubman",

    passportMecca:
      "La Meca",

    passportTokyo:
      "Tokio",
  },

  fr: {
    profileTitle:
      "Profil Legathon",

    profileSubtitle:
      "Toute votre expérience Legathon au même endroit",

    identity:
      "VOTRE IDENTITÉ LEGATHON",

    legathonPoints:
      "Points Legathon",

    percentTo:
      "{percent}% vers {rank}",

    openAvatarCenter:
      "Ouvrir le Centre Avatar",

    walkingLegathon:
      "VOTRE LEGATHON DE MARCHE",

    performance:
      "Performance",

    journeySteps:
      "Pas de Voyage",

    miles:
      "Miles",

    journeys:
      "Voyages",

    completed:
      "Terminés",

    stamps:
      "Tampons",

    dayStreak:
      "Série de Jours",

    journeyIdentity:
      "IDENTITÉ DU VOYAGE",

    favoriteJourney:
      "Voyage Favori",

    journeyProgress:
      "Voyage Legathon • {percent}% Terminé",

    worldCollection:
      "COLLECTION MONDIALE",

    passportCollection:
      "Collection de Passeports",

    unlocked:
      "DÉBLOQUÉ",

    locked:
      "VERROUILLÉ",

    achievementWall:
      "MUR DES RÉUSSITES",

    badgesEarned:
      "Badges Gagnés",

    rewardsSaved:
      "{count} récompenses enregistrées • les badges se mettent à jour automatiquement",

    firstRoute:
      "Premier Parcours",

    firstPassport:
      "Premier Passeport",

    streakMaster:
      "Maître des Séries",

    worldExplorer:
      "Explorateur du Monde",

    earned:
      "GAGNÉ",

    journeyHistory:
      "HISTORIQUE DES VOYAGES",

    journeyTimeline:
      "Chronologie des Voyages",

    timelineEmpty:
      "Terminez votre premier voyage pour commencer votre chronologie Legathon.",

    completedStatus:
      "Terminé",

    percentComplete:
      "{percent}% Terminé",

    yourAscent:
      "VOTRE ASCENSION",

    legathonRank:
      "Rang Legathon",

    current:
      "ACTUEL",

    showcase:
      "VITRINE LEGATHON",

    publicHighlights:
      "Points Forts du Profil Public",

    avatar:
      "Avatar",

    outfit:
      "Tenue",

    favoritePassport:
      "Passeport Favori",

    favoriteBadge:
      "Badge Favori",

    favoriteJourneyLabel:
      "Voyage Favori",

    walker:
      "MARCHEUR LEGATHON",

    buildLegacy:
      "Continuez Votre Parcours",

    footer:
      "Chaque pas, parcours terminé, tampon de passeport et réussite ajoute un nouveau chapitre à votre histoire de marche.",

    updating:
      "Mise à jour du profil…",

    noneYet:
      "Aucun pour l’Instant",

    noBadge:
      "Aucun Badge",

    noFavorite:
      "Aucun Favori",

    legathonWalker:
      "Marcheur Legathon",

    legathonJourney:
      "Voyage Legathon",

    defaultOutfit:
      "Tenue par Défaut",

    blueTracksuit:
      "Survêtement Bleu",

    greenTracksuit:
      "Survêtement Vert",

    redTracksuit:
      "Survêtement Rouge",

    yellowTracksuit:
      "Survêtement Jaune",

    eliteTracksuit:
      "Élite Noir et Or",

    rankNewWalker:
      "Nouveau Marcheur",

    rankExplorer:
      "Explorateur",

    rankPathfinder:
      "Éclaireur",

    rankTrailblazer:
      "Pionnier",

    rankAdventurer:
      "Aventurier",

    rankChampion:
      "Champion",

    rankMasterWalker:
      "Maître Marcheur",

    rankLegathonHero:
      "Héros Legathon",

    rankLegend:
      "Légende",

    rankHallOfFame:
      "Temple de la Renommée",

    passportRome:
      "Rome",

    passportWall:
      "Grande Muraille",

    passportTubman:
      "Tubman",

    passportMecca:
      "La Mecque",

    passportTokyo:
      "Tokyo",
  },

  de: {
    profileTitle:
      "Legathon-Profil",

    profileSubtitle:
      "Dein gesamtes Legathon-Erlebnis an einem Ort",

    identity:
      "DEINE LEGATHON-IDENTITÄT",

    legathonPoints:
      "Legathon-Punkte",

    percentTo:
      "{percent}% bis {rank}",

    openAvatarCenter:
      "Avatar-Center Öffnen",

    walkingLegathon:
      "DEIN GEH-LEGATHON",

    performance:
      "Leistung",

    journeySteps:
      "Reiseschritte",

    miles:
      "Meilen",

    journeys:
      "Reisen",

    completed:
      "Abgeschlossen",

    stamps:
      "Stempel",

    dayStreak:
      "Tagesserie",

    journeyIdentity:
      "REISEIDENTITÄT",

    favoriteJourney:
      "Lieblingsreise",

    journeyProgress:
      "Legathon-Reise • {percent}% Abgeschlossen",

    worldCollection:
      "WELTSAMMLUNG",

    passportCollection:
      "Pass-Sammlung",

    unlocked:
      "FREIGESCHALTET",

    locked:
      "GESPERRT",

    achievementWall:
      "ERFOLGSWAND",

    badgesEarned:
      "Verdiente Abzeichen",

    rewardsSaved:
      "{count} gespeicherte Belohnungen • Meilenstein-Abzeichen werden automatisch aktualisiert",

    firstRoute:
      "Erste Route",

    firstPassport:
      "Erster Pass",

    streakMaster:
      "Serienmeister",

    worldExplorer:
      "Weltentdecker",

    earned:
      "VERDIENT",

    journeyHistory:
      "REISEVERLAUF",

    journeyTimeline:
      "Reise-Zeitleiste",

    timelineEmpty:
      "Schließe deine erste Reise ab, um deine Legathon-Zeitleiste zu beginnen.",

    completedStatus:
      "Abgeschlossen",

    percentComplete:
      "{percent}% Abgeschlossen",

    yourAscent:
      "DEIN AUFSTIEG",

    legathonRank:
      "Legathon-Rang",

    current:
      "AKTUELL",

    showcase:
      "LEGATHON-SHOWCASE",

    publicHighlights:
      "Öffentliche Profil-Highlights",

    avatar:
      "Avatar",

    outfit:
      "Outfit",

    favoritePassport:
      "Lieblingspass",

    favoriteBadge:
      "Lieblingsabzeichen",

    favoriteJourneyLabel:
      "Lieblingsreise",

    walker:
      "LEGATHON-WALKER",

    buildLegacy:
      "Setze Deine Reise Fort",

    footer:
      "Jeder Reiseschritt, jede abgeschlossene Route, jeder Passstempel und jeder Erfolg fügt deiner Gehgeschichte ein neues Kapitel hinzu.",

    updating:
      "Profil wird aktualisiert…",

    noneYet:
      "Noch Keine",

    noBadge:
      "Noch Kein Abzeichen",

    noFavorite:
      "Noch Kein Favorit",

    legathonWalker:
      "Legathon-Walker",

    legathonJourney:
      "Legathon-Reise",

    defaultOutfit:
      "Standard-Outfit",

    blueTracksuit:
      "Blauer Trainingsanzug",

    greenTracksuit:
      "Grüner Trainingsanzug",

    redTracksuit:
      "Roter Trainingsanzug",

    yellowTracksuit:
      "Gelber Trainingsanzug",

    eliteTracksuit:
      "Schwarz-Gold Elite",

    rankNewWalker:
      "Neuer Walker",

    rankExplorer:
      "Entdecker",

    rankPathfinder:
      "Pfadfinder",

    rankTrailblazer:
      "Wegbereiter",

    rankAdventurer:
      "Abenteurer",

    rankChampion:
      "Champion",

    rankMasterWalker:
      "Meister-Walker",

    rankLegathonHero:
      "Legathon-Held",

    rankLegend:
      "Legende",

    rankHallOfFame:
      "Hall of Fame",

    passportRome:
      "Rom",

    passportWall:
      "Große Mauer",

    passportTubman:
      "Tubman",

    passportMecca:
      "Mekka",

    passportTokyo:
      "Tokio",
  },

  pt: {
    profileTitle:
      "Perfil Legathon",

    profileSubtitle:
      "Toda a sua experiência Legathon em um só lugar",

    identity:
      "SUA IDENTIDADE LEGATHON",

    legathonPoints:
      "Pontos Legathon",

    percentTo:
      "{percent}% para {rank}",

    openAvatarCenter:
      "Abrir Central de Avatar",

    walkingLegathon:
      "SEU LEGATHON DE CAMINHADA",

    performance:
      "Desempenho",

    journeySteps:
      "Passos de Jornada",

    miles:
      "Milhas",

    journeys:
      "Jornadas",

    completed:
      "Concluídas",

    stamps:
      "Carimbos",

    dayStreak:
      "Sequência de Dias",

    journeyIdentity:
      "IDENTIDADE DA JORNADA",

    favoriteJourney:
      "Jornada Favorita",

    journeyProgress:
      "Jornada Legathon • {percent}% Concluída",

    worldCollection:
      "COLEÇÃO MUNDIAL",

    passportCollection:
      "Coleção de Passaportes",

    unlocked:
      "DESBLOQUEADO",

    locked:
      "BLOQUEADO",

    achievementWall:
      "MURAL DE CONQUISTAS",

    badgesEarned:
      "Emblemas Conquistados",

    rewardsSaved:
      "{count} recompensas salvas • os emblemas são atualizados automaticamente",

    firstRoute:
      "Primeira Rota",

    firstPassport:
      "Primeiro Passaporte",

    streakMaster:
      "Mestre de Sequências",

    worldExplorer:
      "Explorador Mundial",

    earned:
      "CONQUISTADO",

    journeyHistory:
      "HISTÓRICO DE JORNADAS",

    journeyTimeline:
      "Linha do Tempo",

    timelineEmpty:
      "Conclua sua primeira jornada para iniciar sua linha do tempo Legathon.",

    completedStatus:
      "Concluída",

    percentComplete:
      "{percent}% Concluída",

    yourAscent:
      "SUA ASCENSÃO",

    legathonRank:
      "Classificação Legathon",

    current:
      "ATUAL",

    showcase:
      "VITRINE LEGATHON",

    publicHighlights:
      "Destaques do Perfil Público",

    avatar:
      "Avatar",

    outfit:
      "Roupa",

    favoritePassport:
      "Passaporte Favorito",

    favoriteBadge:
      "Emblema Favorito",

    favoriteJourneyLabel:
      "Jornada Favorita",

    walker:
      "CAMINHANTE LEGATHON",

    buildLegacy:
      "Continue Construindo Sua Jornada",

    footer:
      "Cada passo, rota concluída, carimbo de passaporte e conquista adiciona outro capítulo à sua história de caminhada.",

    updating:
      "Atualizando perfil…",

    noneYet:
      "Nenhum Ainda",

    noBadge:
      "Nenhum Emblema Ainda",

    noFavorite:
      "Nenhum Favorito Ainda",

    legathonWalker:
      "Caminhante Legathon",

    legathonJourney:
      "Jornada Legathon",

    defaultOutfit:
      "Roupa Padrão",

    blueTracksuit:
      "Agasalho Azul",

    greenTracksuit:
      "Agasalho Verde",

    redTracksuit:
      "Agasalho Vermelho",

    yellowTracksuit:
      "Agasalho Amarelo",

    eliteTracksuit:
      "Elite Preto e Dourado",

    rankNewWalker:
      "Novo Caminhante",

    rankExplorer:
      "Explorador",

    rankPathfinder:
      "Desbravador",

    rankTrailblazer:
      "Pioneiro",

    rankAdventurer:
      "Aventureiro",

    rankChampion:
      "Campeão",

    rankMasterWalker:
      "Mestre Caminhante",

    rankLegathonHero:
      "Herói Legathon",

    rankLegend:
      "Lenda",

    rankHallOfFame:
      "Hall da Fama",

    passportRome:
      "Roma",

    passportWall:
      "Grande Muralha",

    passportTubman:
      "Tubman",

    passportMecca:
      "Meca",

    passportTokyo:
      "Tóquio",
  },

  ja: {
    profileTitle:
      "Legathon プロフィール",

    profileSubtitle:
      "あなたのLegathonウォーキング情報をひとつの場所で確認",

    identity:
      "あなたのLEGATHONアイデンティティ",

    legathonPoints:
      "Legathonポイント",

    percentTo:
      "{rank}まで {percent}%",

    openAvatarCenter:
      "アバターセンターを開く",

    walkingLegathon:
      "ウォーキングLEGATHON",

    performance:
      "パフォーマンス",

    journeySteps:
      "ジャーニー歩数",

    miles:
      "マイル",

    journeys:
      "ジャーニー",

    completed:
      "完了",

    stamps:
      "スタンプ",

    dayStreak:
      "連続日数",

    journeyIdentity:
      "ジャーニー情報",

    favoriteJourney:
      "お気に入りジャーニー",

    journeyProgress:
      "Legathonジャーニー • {percent}% 完了",

    worldCollection:
      "ワールドコレクション",

    passportCollection:
      "パスポートコレクション",

    unlocked:
      "解除済み",

    locked:
      "ロック中",

    achievementWall:
      "実績ウォール",

    badgesEarned:
      "獲得バッジ",

    rewardsSaved:
      "保存された報酬 {count} 件 • マイルストーンバッジは自動更新されます",

    firstRoute:
      "最初のルート",

    firstPassport:
      "最初のパスポート",

    streakMaster:
      "連続記録マスター",

    worldExplorer:
      "ワールドエクスプローラー",

    earned:
      "獲得済み",

    journeyHistory:
      "ジャーニー履歴",

    journeyTimeline:
      "ジャーニータイムライン",

    timelineEmpty:
      "最初のジャーニーを完了するとLegathonタイムラインが始まります。",

    completedStatus:
      "完了",

    percentComplete:
      "{percent}% 完了",

    yourAscent:
      "あなたのランク",

    legathonRank:
      "Legathonランク",

    current:
      "現在",

    showcase:
      "LEGATHONショーケース",

    publicHighlights:
      "公開プロフィールのハイライト",

    avatar:
      "アバター",

    outfit:
      "ウェア",

    favoritePassport:
      "お気に入りパスポート",

    favoriteBadge:
      "お気に入りバッジ",

    favoriteJourneyLabel:
      "お気に入りジャーニー",

    walker:
      "LEGATHONウォーカー",

    buildLegacy:
      "ジャーニーを続けよう",

    footer:
      "ジャーニーの一歩一歩、完了したルート、パスポートスタンプ、実績があなたのウォーキングストーリーに新しい章を加えます。",

    updating:
      "プロフィールを更新中…",

    noneYet:
      "まだありません",

    noBadge:
      "バッジなし",

    noFavorite:
      "お気に入りなし",

    legathonWalker:
      "Legathonウォーカー",

    legathonJourney:
      "Legathonジャーニー",

    defaultOutfit:
      "デフォルトウェア",

    blueTracksuit:
      "ブルートラックスーツ",

    greenTracksuit:
      "グリーントラックスーツ",

    redTracksuit:
      "レッドトラックスーツ",

    yellowTracksuit:
      "イエロートラックスーツ",

    eliteTracksuit:
      "ブラック＆ゴールド エリート",

    rankNewWalker:
      "ニューウォーカー",

    rankExplorer:
      "エクスプローラー",

    rankPathfinder:
      "パスファインダー",

    rankTrailblazer:
      "トレイルブレイザー",

    rankAdventurer:
      "アドベンチャラー",

    rankChampion:
      "チャンピオン",

    rankMasterWalker:
      "マスターウォーカー",

    rankLegathonHero:
      "Legathonヒーロー",

    rankLegend:
      "レジェンド",

    rankHallOfFame:
      "殿堂",

    passportRome:
      "ローマ",

    passportWall:
      "万里の長城",

    passportTubman:
      "タブマン",

    passportMecca:
      "メッカ",

    passportTokyo:
      "東京",
  },

  ko: {
    profileTitle:
      "Legathon 프로필",

    profileSubtitle:
      "나의 Legathon 걷기 활동을 한곳에서 확인하세요",

    identity:
      "나의 LEGATHON 아이덴티티",

    legathonPoints:
      "Legathon 포인트",

    percentTo:
      "{rank}까지 {percent}%",

    openAvatarCenter:
      "아바타 센터 열기",

    walkingLegathon:
      "걷기 LEGATHON",

    performance:
      "활동 성과",

    journeySteps:
      "여정 걸음",

    miles:
      "마일",

    journeys:
      "여정",

    completed:
      "완료",

    stamps:
      "스탬프",

    dayStreak:
      "연속 일수",

    journeyIdentity:
      "여정 정보",

    favoriteJourney:
      "즐겨찾는 여정",

    journeyProgress:
      "Legathon 여정 • {percent}% 완료",

    worldCollection:
      "월드 컬렉션",

    passportCollection:
      "패스포트 컬렉션",

    unlocked:
      "잠금 해제",

    locked:
      "잠김",

    achievementWall:
      "업적",

    badgesEarned:
      "획득 배지",

    rewardsSaved:
      "저장된 보상 {count}개 • 마일스톤 배지는 자동 업데이트됩니다",

    firstRoute:
      "첫 번째 루트",

    firstPassport:
      "첫 번째 패스포트",

    streakMaster:
      "연속 기록 마스터",

    worldExplorer:
      "월드 익스플로러",

    earned:
      "획득",

    journeyHistory:
      "여정 기록",

    journeyTimeline:
      "여정 타임라인",

    timelineEmpty:
      "첫 여정을 완료하면 Legathon 타임라인이 시작됩니다.",

    completedStatus:
      "완료",

    percentComplete:
      "{percent}% 완료",

    yourAscent:
      "나의 성장",

    legathonRank:
      "Legathon 랭크",

    current:
      "현재",

    showcase:
      "LEGATHON 쇼케이스",

    publicHighlights:
      "공개 프로필 하이라이트",

    avatar:
      "아바타",

    outfit:
      "의상",

    favoritePassport:
      "즐겨찾는 패스포트",

    favoriteBadge:
      "즐겨찾는 배지",

    favoriteJourneyLabel:
      "즐겨찾는 여정",

    walker:
      "LEGATHON 워커",

    buildLegacy:
      "계속해서 여정을 만들어 가세요",

    footer:
      "모든 여정의 걸음, 완료한 루트, 패스포트 스탬프와 업적이 걷기 이야기의 새로운 장이 됩니다.",

    updating:
      "프로필 업데이트 중…",

    noneYet:
      "아직 없음",

    noBadge:
      "아직 배지 없음",

    noFavorite:
      "아직 즐겨찾기 없음",

    legathonWalker:
      "Legathon 워커",

    legathonJourney:
      "Legathon 여정",

    defaultOutfit:
      "기본 의상",

    blueTracksuit:
      "블루 트랙수트",

    greenTracksuit:
      "그린 트랙수트",

    redTracksuit:
      "레드 트랙수트",

    yellowTracksuit:
      "옐로 트랙수트",

    eliteTracksuit:
      "블랙 & 골드 엘리트",

    rankNewWalker:
      "뉴 워커",

    rankExplorer:
      "익스플로러",

    rankPathfinder:
      "패스파인더",

    rankTrailblazer:
      "트레일블레이저",

    rankAdventurer:
      "어드벤처러",

    rankChampion:
      "챔피언",

    rankMasterWalker:
      "마스터 워커",

    rankLegathonHero:
      "Legathon 히어로",

    rankLegend:
      "레전드",

    rankHallOfFame:
      "명예의 전당",

    passportRome:
      "로마",

    passportWall:
      "만리장성",

    passportTubman:
      "터브먼",

    passportMecca:
      "메카",

    passportTokyo:
      "도쿄",
  },

  zh: {
    profileTitle:
      "Legathon 个人资料",

    profileSubtitle:
      "在一个页面查看你的Legathon步行成就",

    identity:
      "你的LEGATHON身份",

    legathonPoints:
      "Legathon积分",

    percentTo:
      "距离{rank}还有 {percent}%",

    openAvatarCenter:
      "打开头像中心",

    walkingLegathon:
      "步行LEGATHON",

    performance:
      "表现",

    journeySteps:
      "旅程步数",

    miles:
      "英里",

    journeys:
      "旅程",

    completed:
      "已完成",

    stamps:
      "印章",

    dayStreak:
      "连续天数",

    journeyIdentity:
      "旅程身份",

    favoriteJourney:
      "最喜欢的旅程",

    journeyProgress:
      "Legathon旅程 • 已完成 {percent}%",

    worldCollection:
      "世界收藏",

    passportCollection:
      "护照收藏",

    unlocked:
      "已解锁",

    locked:
      "已锁定",

    achievementWall:
      "成就墙",

    badgesEarned:
      "已获得徽章",

    rewardsSaved:
      "已保存 {count} 个奖励 • 里程碑徽章会自动更新",

    firstRoute:
      "第一条路线",

    firstPassport:
      "第一本护照",

    streakMaster:
      "连续记录大师",

    worldExplorer:
      "世界探索者",

    earned:
      "已获得",

    journeyHistory:
      "旅程历史",

    journeyTimeline:
      "旅程时间线",

    timelineEmpty:
      "完成你的第一个旅程即可开始Legathon旅程时间线。",

    completedStatus:
      "已完成",

    percentComplete:
      "已完成 {percent}%",

    yourAscent:
      "你的成长",

    legathonRank:
      "Legathon等级",

    current:
      "当前",

    showcase:
      "LEGATHON展示",

    publicHighlights:
      "公开个人资料亮点",

    avatar:
      "头像",

    outfit:
      "服装",

    favoritePassport:
      "最喜欢的护照",

    favoriteBadge:
      "最喜欢的徽章",

    favoriteJourneyLabel:
      "最喜欢的旅程",

    walker:
      "LEGATHON步行者",

    buildLegacy:
      "继续你的Legathon旅程",

    footer:
      "每一步、每条完成的路线、每个护照印章和每项成就都会为你的步行故事增加新的篇章。",

    updating:
      "正在更新个人资料…",

    noneYet:
      "暂无",

    noBadge:
      "暂无徽章",

    noFavorite:
      "暂无收藏",

    legathonWalker:
      "Legathon步行者",

    legathonJourney:
      "Legathon旅程",

    defaultOutfit:
      "默认服装",

    blueTracksuit:
      "蓝色运动服",

    greenTracksuit:
      "绿色运动服",

    redTracksuit:
      "红色运动服",

    yellowTracksuit:
      "黄色运动服",

    eliteTracksuit:
      "黑金精英",

    rankNewWalker:
      "新步行者",

    rankExplorer:
      "探索者",

    rankPathfinder:
      "开拓者",

    rankTrailblazer:
      "先锋",

    rankAdventurer:
      "冒险家",

    rankChampion:
      "冠军",

    rankMasterWalker:
      "步行大师",

    rankLegathonHero:
      "Legathon英雄",

    rankLegend:
      "传奇",

    rankHallOfFame:
      "名人堂",

    passportRome:
      "罗马",

    passportWall:
      "万里长城",

    passportTubman:
      "塔布曼",

    passportMecca:
      "麦加",

    passportTokyo:
      "东京",
  },

  it: {
    profileTitle:
      "Profilo Legathon",

    profileSubtitle:
      "Tutta la tua esperienza Legathon in un unico posto",

    identity:
      "LA TUA IDENTITÀ LEGATHON",

    legathonPoints:
      "Punti Legathon",

    percentTo:
      "{percent}% verso {rank}",

    openAvatarCenter:
      "Apri Centro Avatar",

    walkingLegathon:
      "IL TUO LEGATHON DI CAMMINATA",

    performance:
      "Prestazioni",

    journeySteps:
      "Passi del Viaggio",

    miles:
      "Miglia",

    journeys:
      "Viaggi",

    completed:
      "Completati",

    stamps:
      "Timbri",

    dayStreak:
      "Serie di Giorni",

    journeyIdentity:
      "IDENTITÀ DEL VIAGGIO",

    favoriteJourney:
      "Viaggio Preferito",

    journeyProgress:
      "Viaggio Legathon • {percent}% Completato",

    worldCollection:
      "COLLEZIONE MONDIALE",

    passportCollection:
      "Collezione Passaporti",

    unlocked:
      "SBLOCCATO",

    locked:
      "BLOCCATO",

    achievementWall:
      "MURO DEI TRAGUARDI",

    badgesEarned:
      "Badge Ottenuti",

    rewardsSaved:
      "{count} ricompense salvate • i badge si aggiornano automaticamente",

    firstRoute:
      "Primo Percorso",

    firstPassport:
      "Primo Passaporto",

    streakMaster:
      "Maestro delle Serie",

    worldExplorer:
      "Esploratore del Mondo",

    earned:
      "OTTENUTO",

    journeyHistory:
      "STORIA DEI VIAGGI",

    journeyTimeline:
      "Cronologia dei Viaggi",

    timelineEmpty:
      "Completa il tuo primo viaggio per iniziare la cronologia Legathon.",

    completedStatus:
      "Completato",

    percentComplete:
      "{percent}% Completato",

    yourAscent:
      "LA TUA ASCESA",

    legathonRank:
      "Rango Legathon",

    current:
      "ATTUALE",

    showcase:
      "VETRINA LEGATHON",

    publicHighlights:
      "Punti Salienti del Profilo Pubblico",

    avatar:
      "Avatar",

    outfit:
      "Completo",

    favoritePassport:
      "Passaporto Preferito",

    favoriteBadge:
      "Badge Preferito",

    favoriteJourneyLabel:
      "Viaggio Preferito",

    walker:
      "CAMMINATORE LEGATHON",

    buildLegacy:
      "Continua il Tuo Viaggio",

    footer:
      "Ogni passo, percorso completato, timbro del passaporto e risultato aggiunge un nuovo capitolo alla tua storia di cammino.",

    updating:
      "Aggiornamento profilo…",

    noneYet:
      "Nessuno",

    noBadge:
      "Nessun Badge",

    noFavorite:
      "Nessun Preferito",

    legathonWalker:
      "Camminatore Legathon",

    legathonJourney:
      "Viaggio Legathon",

    defaultOutfit:
      "Completo Predefinito",

    blueTracksuit:
      "Tuta Blu",

    greenTracksuit:
      "Tuta Verde",

    redTracksuit:
      "Tuta Rossa",

    yellowTracksuit:
      "Tuta Gialla",

    eliteTracksuit:
      "Elite Nero e Oro",

    rankNewWalker:
      "Nuovo Camminatore",

    rankExplorer:
      "Esploratore",

    rankPathfinder:
      "Pathfinder",

    rankTrailblazer:
      "Pioniere",

    rankAdventurer:
      "Avventuriero",

    rankChampion:
      "Campione",

    rankMasterWalker:
      "Maestro Camminatore",

    rankLegathonHero:
      "Eroe Legathon",

    rankLegend:
      "Leggenda",

    rankHallOfFame:
      "Hall of Fame",

    passportRome:
      "Roma",

    passportWall:
      "Grande Muraglia",

    passportTubman:
      "Tubman",

    passportMecca:
      "La Mecca",

    passportTokyo:
      "Tokyo",
  },

  ar: {
    profileTitle:
      "ملف Legathon",

    profileSubtitle:
      "كل إنجازات المشي في Legathon في مكان واحد",

    identity:
      "هويتك في LEGATHON",

    legathonPoints:
      "نقاط Legathon",

    percentTo:
      "{percent}% للوصول إلى {rank}",

    openAvatarCenter:
      "فتح مركز الشخصية",

    walkingLegathon:
      "LEGATHON للمشي",

    performance:
      "الأداء",

    journeySteps:
      "خطوات الرحلة",

    miles:
      "الأميال",

    journeys:
      "الرحلات",

    completed:
      "مكتملة",

    stamps:
      "الأختام",

    dayStreak:
      "سلسلة الأيام",

    journeyIdentity:
      "هوية الرحلة",

    favoriteJourney:
      "الرحلة المفضلة",

    journeyProgress:
      "رحلة Legathon • مكتمل {percent}%",

    worldCollection:
      "المجموعة العالمية",

    passportCollection:
      "مجموعة جوازات السفر",

    unlocked:
      "مفتوح",

    locked:
      "مغلق",

    achievementWall:
      "جدار الإنجازات",

    badgesEarned:
      "الشارات المكتسبة",

    rewardsSaved:
      "{count} مكافآت محفوظة • يتم تحديث شارات الإنجاز تلقائيًا",

    firstRoute:
      "المسار الأول",

    firstPassport:
      "جواز السفر الأول",

    streakMaster:
      "سيد الاستمرارية",

    worldExplorer:
      "مستكشف العالم",

    earned:
      "مكتسبة",

    journeyHistory:
      "سجل الرحلات",

    journeyTimeline:
      "الخط الزمني للرحلات",

    timelineEmpty:
      "أكمل رحلتك الأولى لبدء الخط الزمني في Legathon.",

    completedStatus:
      "مكتملة",

    percentComplete:
      "مكتمل {percent}%",

    yourAscent:
      "تقدمك",

    legathonRank:
      "رتبة Legathon",

    current:
      "الحالية",

    showcase:
      "عرض LEGATHON",

    publicHighlights:
      "أبرز معلومات الملف العام",

    avatar:
      "الشخصية",

    outfit:
      "الزي",

    favoritePassport:
      "جواز السفر المفضل",

    favoriteBadge:
      "الشارة المفضلة",

    favoriteJourneyLabel:
      "الرحلة المفضلة",

    walker:
      "مشارك LEGATHON",

    buildLegacy:
      "واصل بناء رحلتك",

    footer:
      "كل خطوة في الرحلة ومسار مكتمل وختم جواز سفر وإنجاز يضيف فصلًا جديدًا إلى قصة المشي الخاصة بك.",

    updating:
      "جارٍ تحديث الملف…",

    noneYet:
      "لا يوجد بعد",

    noBadge:
      "لا توجد شارة بعد",

    noFavorite:
      "لا يوجد مفضل بعد",

    legathonWalker:
      "مشارك Legathon",

    legathonJourney:
      "رحلة Legathon",

    defaultOutfit:
      "الزي الافتراضي",

    blueTracksuit:
      "البدلة الرياضية الزرقاء",

    greenTracksuit:
      "البدلة الرياضية الخضراء",

    redTracksuit:
      "البدلة الرياضية الحمراء",

    yellowTracksuit:
      "البدلة الرياضية الصفراء",

    eliteTracksuit:
      "النخبة الأسود والذهبي",

    rankNewWalker:
      "مشارك جديد",

    rankExplorer:
      "مستكشف",

    rankPathfinder:
      "مكتشف المسار",

    rankTrailblazer:
      "رائد",

    rankAdventurer:
      "مغامر",

    rankChampion:
      "بطل",

    rankMasterWalker:
      "سيد المشي",

    rankLegathonHero:
      "بطل Legathon",

    rankLegend:
      "أسطورة",

    rankHallOfFame:
      "قاعة المشاهير",

    passportRome:
      "روما",

    passportWall:
      "سور الصين العظيم",

    passportTubman:
      "توبمان",

    passportMecca:
      "مكة",

    passportTokyo:
      "طوكيو",
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
    ) =>
      Object.prototype
        .hasOwnProperty.call(
          variables,
          key
        )
        ? String(
            variables[key]
          )
        : match
  );
}

function getProfileText(
  language,
  key,
  variables = {}
) {
  // Profile-specific translation first.
  // This prevents translate()'s English fallback from
  // overriding our screen-specific language text.
  const local =
    PROFILE_TEXT?.[
      language
    ]?.[key];

  if (
    local !==
    undefined
  ) {
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
    central !== key
  ) {
    return fillTemplate(
      central,
      variables
    );
  }

  return fillTemplate(
    PROFILE_TEXT.en?.[
      key
    ] ||
      key,
    variables
  );
}

// ============================================================
// HELPERS
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(
      value
    );

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return fallback;
  }

  return parsed;
}

function formatNumber(
  value
) {
  return safeNumber(
    value
  ).toLocaleString();
}

function safeParse(
  value,
  fallback
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch (
    error
  ) {
    return fallback;
  }
}

function getSuitTranslationKey(
  suitId
) {
  switch (
    String(
      suitId ||
      "default"
    ).toLowerCase()
  ) {
    case "blue":
      return "blueTracksuit";

    case "green":
      return "greenTracksuit";

    case "red":
      return "redTracksuit";

    case "yellow":
      return "yellowTracksuit";

    case "elite":
      return "eliteTracksuit";

    default:
      return "defaultOutfit";
  }
}

function getRankTranslationKey(
  rank
) {
  const value =
    String(
      rank ||
      ""
    )
      .trim()
      .toLowerCase();

  switch (
    value
  ) {
    case "new walker":
      return "rankNewWalker";

    case "explorer":
      return "rankExplorer";

    case "pathfinder":
      return "rankPathfinder";

    case "trailblazer":
      return "rankTrailblazer";

    case "adventurer":
      return "rankAdventurer";

    case "champion":
      return "rankChampion";

    case "master walker":
      return "rankMasterWalker";

    case "legathon hero":
      return "rankLegathonHero";

    case "legend":
      return "rankLegend";

    case "hall of fame":
      return "rankHallOfFame";

    default:
      return null;
  }
}

function getPassportTranslationKey(
  id
) {
  switch (
    id
  ) {
    case "rome":
      return "passportRome";

    case "wall":
      return "passportWall";

    case "tubman":
      return "passportTubman";

    case "mecca":
      return "passportMecca";

    case "tokyo":
      return "passportTokyo";

    default:
      return null;
  }
}

function getFirstUnlockedPassportId(
  stamps
) {
  if (
    !Array.isArray(
      stamps
    )
  ) {
    return null;
  }

  const order = [
    "tokyo",
    "rome",
    "wall",
    "tubman",
    "mecca",
  ];

  for (
    const id of order
  ) {
    if (
      stamps.includes(
        id
      )
    ) {
      return id;
    }
  }

  return null;
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function ProfileScreen({
  language = "en",
  openPassport,
  goToAvatarCenter,
  goBack,
}) {
  function t(
    key,
    variables = {}
  ) {
    return getProfileText(
      language,
      key,
      variables
    );
  }

  function rankLabel(
    rank
  ) {
    if (
      rank === "MAX"
    ) {
      return "MAX";
    }

    const key =
      getRankTranslationKey(
        rank
      );

    return key
      ? t(
          key
        )
      : rank;
  }

  function suitLabel(
    suit
  ) {
    return t(
      getSuitTranslationKey(
        suit
      )
    );
  }

  // ==========================================================
  // PROFILE / AVATAR
  // ==========================================================

  const [
    avatarName,
    setAvatarName,
  ] =
    useState(
      t(
        "legathonWalker"
      )
    );

  const [
    selectedAvatarId,
    setSelectedAvatarId,
  ] =
    useState(
      avatarOptions?.[0]
        ?.id ||
        null
    );

  const [
    avatarImage,
    setAvatarImage,
  ] =
    useState(
      avatarOptions?.[0]
        ?.image ||
        null
    );

  const [
    equippedSuit,
    setEquippedSuit,
  ] =
    useState(
      "default"
    );

  // ==========================================================
  // PROFILE DATA
  // ==========================================================

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState(0);

  const [
    totalMiles,
    setTotalMiles,
  ] =
    useState(0);

  const [
    completedJourneys,
    setCompletedJourneys,
  ] =
    useState([]);

  const [
    journeyCount,
    setJourneyCount,
  ] =
    useState(0);

  const [
    passportStamps,
    setPassportStamps,
  ] =
    useState([]);

  const [
    rewardsEarned,
    setRewardsEarned,
  ] =
    useState([]);

  const [
    walkingStreak,
    setWalkingStreak,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  // ==========================================================
  // LEGATHON POINTS / RANK
  // ==========================================================

  const {
    points:
      legathonPoints,

    rank:
      legathonRank,
  } =
    useLegathonPoints();

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          const [
            savedSteps,
            journeysRaw,
            stampsRaw,
            rewardsRaw,
            profileRaw,
            streakRaw,
            currentSuit,
          ] =
            await Promise.all([
              AsyncStorage.getItem(
                "lifetimeSteps"
              ),

              AsyncStorage.getItem(
                "journeyProgressData"
              ),

              AsyncStorage.getItem(
                "passportStamps"
              ),

              AsyncStorage.getItem(
                "rewardsEarned"
              ),

              AsyncStorage.getItem(
                "avatarProfile"
              ),

              AsyncStorage.getItem(
                "walkingStreak"
              ),

              getCurrentAvatarSuit(),
            ]);

          // STEPS

          const steps =
            Math.max(
              0,
              safeNumber(
                savedSteps
              )
            );

          setLifetimeSteps(
            steps
          );

          setTotalMiles(
            Number(
              (
                steps /
                STEPS_PER_MILE
              ).toFixed(
                2
              )
            )
          );

          // JOURNEYS

          const parsedJourneys =
            safeParse(
              journeysRaw,
              []
            );

          const journeys =
            Array.isArray(
              parsedJourneys
            )
              ? parsedJourneys
              : [];

          setJourneyCount(
            journeys.length
          );

          const completed =
            journeys.filter(
              journey => {
                if (
                  journey?.completed ===
                  true
                ) {
                  return true;
                }

                return (
                  safeNumber(
                    journey?.progress
                  ) >=
                  100
                );
              }
            );

          setCompletedJourneys(
            completed
          );

          // PASSPORTS

          const parsedStamps =
            safeParse(
              stampsRaw,
              []
            );

          setPassportStamps(
            Array.isArray(
              parsedStamps
            )
              ? parsedStamps
              : []
          );

          // REWARDS

          const parsedRewards =
            safeParse(
              rewardsRaw,
              []
            );

          setRewardsEarned(
            Array.isArray(
              parsedRewards
            )
              ? parsedRewards
              : []
          );

          // STREAK

          setWalkingStreak(
            Math.max(
              0,
              safeNumber(
                streakRaw
              )
            )
          );

          // SUIT

          setEquippedSuit(
            currentSuit ||
            "default"
          );

          // AVATAR PROFILE

          const savedProfile =
            safeParse(
              profileRaw,
              null
            );

          const avatarId =
            savedProfile?.avatarId ||
            avatarOptions?.[0]?.id ||
            null;

          const name =
            savedProfile?.name ||
            t(
              "legathonWalker"
            );

          setAvatarName(
            name
          );

          setSelectedAvatarId(
            avatarId
          );

          const normalAvatar =
            avatarOptions.find(
              avatar =>
                avatar.id ===
                avatarId
            ) ||
            avatarOptions?.[0] ||
            null;

          if (
            avatarId
          ) {
            try {
              const visual =
                await getCurrentAvatarVisual(
                  avatarId
                );

              setAvatarImage(
                visual?.image ||
                normalAvatar?.image ||
                null
              );
            } catch (
              avatarError
            ) {
              console.log(
                "Profile avatar visual error:",
                avatarError
              );

              setAvatarImage(
                normalAvatar?.image ||
                null
              );
            }
          } else {
            setAvatarImage(
              normalAvatar?.image ||
              null
            );
          }
        } catch (
          error
        ) {
          console.log(
            "Profile load error:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        language,
      ]
    );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {
      loadProfile();
    },
    [
      loadProfile,
    ]
  );

  // ==========================================================
  // REFRESH WHEN APP RETURNS
  // ==========================================================

  useEffect(
    () => {
      const subscription =
        AppState.addEventListener(
          "change",
          nextState => {
            if (
              nextState ===
              "active"
            ) {
              loadProfile();
            }
          }
        );

      return () => {
        subscription?.remove?.();
      };
    },
    [
      loadProfile,
    ]
  );

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const completedCount =
    completedJourneys.length;

  const stampCount =
    passportStamps.length;

  const rewardCount =
    rewardsEarned.length;

  const currentRank =
    legathonRank?.currentRank ||
    legathonRank?.rank ||
    "New Walker";

  const nextRank =
    legathonRank?.nextRank ||
    "MAX";

  const rankProgress =
    Math.min(
      100,
      Math.max(
        0,
        safeNumber(
          legathonRank?.progress
        )
      )
    );

  const favoriteJourney =
    completedJourneys?.[0] ||
    {
      id:
        "rome",

      icon:
        "🏛️",

      title:
        "Roman Empire",

      progress:
        0,
    };

  const favoritePassportId =
    getFirstUnlockedPassportId(
      passportStamps
    );

  const favoritePassport =
    favoritePassportId
      ? t(
          getPassportTranslationKey(
            favoritePassportId
          )
        )
      : t(
          "noneYet"
        );

  let favoriteBadge =
    t(
      "noBadge"
    );

  if (
    completedCount >=
    10
  ) {
    favoriteBadge =
      t(
        "worldExplorer"
      );
  } else if (
    lifetimeSteps >=
    100000
  ) {
    favoriteBadge =
      t(
        "streakMaster"
      );
  } else if (
    stampCount >=
    1
  ) {
    favoriteBadge =
      t(
        "firstPassport"
      );
  } else if (
    completedCount >=
    1
  ) {
    favoriteBadge =
      t(
        "firstRoute"
      );
  }

  const displayJourneyTitle =
    favoriteJourney?.title ||
    t(
      "noFavorite"
    );

  // Keep internal English rank IDs.
  // Only translate what appears on screen.
  const rankOrder = [
    "New Walker",
    "Explorer",
    "Pathfinder",
    "Trailblazer",
    "Adventurer",
    "Champion",
    "Master Walker",
    "Legathon Hero",
    "Legend",
    "Hall of Fame",
  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ImageBackground
      source={
        COLLAGE_BG
      }
      style={
        styles.background
      }
      imageStyle={
        styles.backgroundImage
      }
    >
      <View
        style={
          styles.overlay
        }
      >
        <SafeAreaView
          style={
            styles.safe
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
            {/* HEADER */}

            <View
              style={
                styles.headerRow
              }
            >
              {goBack ? (
                <TouchableOpacity
                  style={
                    styles.backButton
                  }
                  onPress={
                    goBack
                  }
                >
                  <Text
                    style={
                      styles.backText
                    }
                  >
                    ‹
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={
                    styles.backSpacer
                  }
                />
              )}

              <View
                style={
                  styles.headerTextWrap
                }
              >
                <Text
                  style={
                    styles.eyebrow
                  }
                >
                  LEGATHON WALK
                </Text>

                <Text
                  style={
                    styles.title
                  }
                  adjustsFontSizeToFit
                  minimumFontScale={
                    0.75
                  }
                >
                  {t(
                    "profileTitle"
                  )}
                </Text>

                <Text
                  style={
                    styles.headerSubtitle
                  }
                >
                  {t(
                    "profileSubtitle"
                  )}
                </Text>
              </View>
            </View>

            {/* PROFILE HERO */}

            <View
              style={
                styles.heroCard
              }
            >
              <View
                style={
                  styles.heroGlow
                }
              />

              <View
                style={
                  styles.avatarStage
                }
              >
                {avatarImage ? (
                  <Image
                    source={
                      avatarImage
                    }
                    style={
                      styles.avatarImage
                    }
                    resizeMode="contain"
                  />
                ) : (
                  <Text
                    style={
                      styles.avatarFallback
                    }
                  >
                    👤
                  </Text>
                )}

                <View
                  style={
                    styles.rankPill
                  }
                >
                  <Text
                    style={
                      styles.rankPillText
                    }
                    numberOfLines={
                      1
                    }
                    adjustsFontSizeToFit
                  >
                    {rankLabel(
                      currentRank
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.heroInfo
                }
              >
                <Text
                  style={
                    styles.profileLabel
                  }
                >
                  {t(
                    "identity"
                  )}
                </Text>

                <Text
                  style={
                    styles.name
                  }
                >
                  {
                    avatarName
                  }
                </Text>

                <View
                  style={
                    styles.outfitPill
                  }
                >
                  <Text
                    style={
                      styles.outfitPillText
                    }
                    numberOfLines={
                      1
                    }
                    adjustsFontSizeToFit
                  >
                    ✓{" "}
                    {suitLabel(
                      equippedSuit
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.legathonScore
                  }
                >
                  ⭐{" "}
                  {formatNumber(
                    legathonPoints
                  )}{" "}
                  {t(
                    "legathonPoints"
                  )}
                </Text>

                <View
                  style={
                    styles.levelBar
                  }
                >
                  <View
                    style={[
                      styles.levelFill,

                      {
                        width:
                          `${rankProgress}%`,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={
                    styles.levelText
                  }
                >
                  {t(
                    "percentTo",
                    {
                      percent:
                        Math.round(
                          rankProgress
                        ),

                      rank:
                        rankLabel(
                          nextRank
                        ),
                    }
                  )}
                </Text>

                {goToAvatarCenter ? (
                  <TouchableOpacity
                    style={
                      styles.avatarCenterButton
                    }
                    onPress={
                      goToAvatarCenter
                    }
                    activeOpacity={
                      0.85
                    }
                  >
                    <Text
                      style={
                        styles.avatarCenterButtonText
                      }
                      adjustsFontSizeToFit
                      minimumFontScale={
                        0.75
                      }
                    >
                      {t(
                        "openAvatarCenter"
                      )}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* PERFORMANCE */}

            <View
              style={
                styles.sectionHeadingRow
              }
            >
              <View>
                <Text
                  style={
                    styles.goldLabel
                  }
                >
                  {t(
                    "walkingLegathon"
                  )}
                </Text>

                <Text
                  style={
                    styles.sectionHeading
                  }
                >
                  {t(
                    "performance"
                  )}
                </Text>
              </View>

              <Text
                style={
                  styles.sectionIcon
                }
              >
                ✦
              </Text>
            </View>

            <View
              style={
                styles.statsGrid
              }
            >
              <Stat
                icon="👟"
                number={
                  formatNumber(
                    lifetimeSteps
                  )
                }
                label={
                  t(
                    "journeySteps"
                  )
                }
              />

              <Stat
                icon="🗺️"
                number={
                  totalMiles.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits:
                        2,

                      maximumFractionDigits:
                        2,
                    }
                  )
                }
                label={
                  t(
                    "miles"
                  )
                }
              />

              <Stat
                icon="🌍"
                number={
                  formatNumber(
                    journeyCount
                  )
                }
                label={
                  t(
                    "journeys"
                  )
                }
              />

              <Stat
                icon="✅"
                number={
                  formatNumber(
                    completedCount
                  )
                }
                label={
                  t(
                    "completed"
                  )
                }
              />

              <Stat
                icon="🛂"
                number={
                  formatNumber(
                    stampCount
                  )
                }
                label={
                  t(
                    "stamps"
                  )
                }
              />

              <Stat
                icon="🔥"
                number={
                  formatNumber(
                    walkingStreak
                  )
                }
                label={
                  t(
                    "dayStreak"
                  )
                }
              />
            </View>

            {/* FAVORITE JOURNEY */}

            <View
              style={
                styles.sectionCard
              }
            >
              <View
                style={
                  styles.sectionTop
                }
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    {t(
                      "journeyIdentity"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      "favoriteJourney"
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  🧭
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.favoriteCard
                }
                onPress={() => {
                  if (
                    openPassport
                  ) {
                    openPassport(
                      favoriteJourney?.id ||
                      "rome"
                    );
                  }
                }}
                activeOpacity={
                  0.85
                }
              >
                <View
                  style={
                    styles.favoriteIconBox
                  }
                >
                  <Text
                    style={
                      styles.favoriteIcon
                    }
                  >
                    {favoriteJourney?.icon ||
                      "🏛️"}
                  </Text>
                </View>

                <View
                  style={
                    styles.favoriteTextWrap
                  }
                >
                  <Text
                    style={
                      styles.favoriteTitle
                    }
                  >
                    {
                      displayJourneyTitle
                    }
                  </Text>

                  <Text
                    style={
                      styles.favoriteSub
                    }
                  >
                    {t(
                      "journeyProgress",
                      {
                        percent:
                          Math.round(
                            safeNumber(
                              favoriteJourney?.progress
                            )
                          ),
                      }
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.chevron
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            {/* PASSPORT COLLECTION */}

            <View
              style={
                styles.sectionCard
              }
            >
              <View
                style={
                  styles.sectionTop
                }
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    {t(
                      "worldCollection"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      "passportCollection"
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.countPill
                  }
                >
                  <Text
                    style={
                      styles.countPillText
                    }
                  >
                    {
                      stampCount
                    }
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.collectionGrid
                }
              >
                <Collection
                  id="rome"
                  title={
                    t(
                      "passportRome"
                    )
                  }
                  unlocked={
                    passportStamps.includes(
                      "rome"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.rome
                  }
                  openPassport={
                    openPassport
                  }
                  unlockedText={
                    t(
                      "unlocked"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Collection
                  id="wall"
                  title={
                    t(
                      "passportWall"
                    )
                  }
                  unlocked={
                    passportStamps.includes(
                      "wall"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.wall
                  }
                  openPassport={
                    openPassport
                  }
                  unlockedText={
                    t(
                      "unlocked"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Collection
                  id="tubman"
                  title={
                    t(
                      "passportTubman"
                    )
                  }
                  unlocked={
                    passportStamps.includes(
                      "tubman"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.tubman
                  }
                  openPassport={
                    openPassport
                  }
                  unlockedText={
                    t(
                      "unlocked"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Collection
                  id="mecca"
                  title={
                    t(
                      "passportMecca"
                    )
                  }
                  unlocked={
                    passportStamps.includes(
                      "mecca"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.mecca
                  }
                  openPassport={
                    openPassport
                  }
                  unlockedText={
                    t(
                      "unlocked"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Collection
                  id="tokyo"
                  title={
                    t(
                      "passportTokyo"
                    )
                  }
                  unlocked={
                    passportStamps.includes(
                      "tokyo"
                    )
                  }
                  image={
                    PASSPORT_IMAGES.tokyo
                  }
                  openPassport={
                    openPassport
                  }
                  unlockedText={
                    t(
                      "unlocked"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />
              </View>
            </View>

            {/* ACHIEVEMENT WALL */}

            <View
              style={
                styles.goldCard
              }
            >
              <Text
                style={
                  styles.goldLabel
                }
              >
                {t(
                  "achievementWall"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "badgesEarned"
                )}
              </Text>

              <Text
                style={
                  styles.mutedText
                }
              >
                {t(
                  "rewardsSaved",
                  {
                    count:
                      rewardCount,
                  }
                )}
              </Text>

              <View
                style={
                  styles.badgeGrid
                }
              >
                <Badge
                  icon="🥇"
                  title={
                    t(
                      "firstRoute"
                    )
                  }
                  unlocked={
                    completedCount >=
                    1
                  }
                  earnedText={
                    t(
                      "earned"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Badge
                  icon="🛡️"
                  title={
                    t(
                      "firstPassport"
                    )
                  }
                  unlocked={
                    stampCount >=
                    1
                  }
                  earnedText={
                    t(
                      "earned"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Badge
                  icon="🔥"
                  title={
                    t(
                      "streakMaster"
                    )
                  }
                  unlocked={
                    lifetimeSteps >=
                    100000
                  }
                  earnedText={
                    t(
                      "earned"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />

                <Badge
                  icon="🌎"
                  title={
                    t(
                      "worldExplorer"
                    )
                  }
                  unlocked={
                    completedCount >=
                    10
                  }
                  earnedText={
                    t(
                      "earned"
                    )
                  }
                  lockedText={
                    t(
                      "locked"
                    )
                  }
                />
              </View>
            </View>

            {/* JOURNEY TIMELINE */}

            <View
              style={
                styles.sectionCard
              }
            >
              <View
                style={
                  styles.sectionTop
                }
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    {t(
                      "journeyHistory"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      "journeyTimeline"
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  🏁
                </Text>
              </View>

              {completedJourneys.length ===
              0 ? (
                <View
                  style={
                    styles.emptyState
                  }
                >
                  <Text
                    style={
                      styles.emptyStateIcon
                    }
                  >
                    🗺️
                  </Text>

                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    {t(
                      "timelineEmpty"
                    )}
                  </Text>
                </View>
              ) : (
                completedJourneys.map(
                  (
                    journey,
                    index
                  ) => {
                    const percent =
                      Math.round(
                        safeNumber(
                          journey?.progress
                        )
                      );

                    return (
                      <Timeline
                        key={
                          journey?.id ||
                          `${journey?.title}-${index}`
                        }
                        title={
                          journey?.title ||
                          t(
                            "legathonJourney"
                          )
                        }
                        date={
                          journey?.completed
                            ? t(
                                "completedStatus"
                              )
                            : t(
                                "percentComplete",
                                {
                                  percent,
                                }
                              )
                        }
                        last={
                          index ===
                          completedJourneys.length -
                            1
                        }
                      />
                    );
                  }
                )
              )}
            </View>

            {/* LEGATHON RANK */}

            <View
              style={
                styles.sectionCard
              }
            >
              <View
                style={
                  styles.sectionTop
                }
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.goldLabel
                    }
                  >
                    {t(
                      "yourAscent"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      "legathonRank"
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.sectionIcon
                  }
                >
                  👑
                </Text>
              </View>

              <View
                style={
                  styles.rankList
                }
              >
                {rankOrder.map(
                  rank => {
                    const active =
                      rank ===
                      currentRank;

                    return (
                      <View
                        key={
                          rank
                        }
                        style={[
                          styles.rankRow,

                          active &&
                            styles.rankRowActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.rankDiamond,

                            active &&
                              styles.rankDiamondActive,
                          ]}
                        >
                          {active
                            ? "◆"
                            : "◇"}
                        </Text>

                        <Text
                          style={[
                            styles.rankText,

                            active &&
                              styles.rankTextActive,
                          ]}
                        >
                          {rankLabel(
                            rank
                          )}
                        </Text>

                        {active ? (
                          <View
                            style={
                              styles.currentPill
                            }
                          >
                            <Text
                              style={
                                styles.currentPillText
                              }
                              numberOfLines={
                                1
                              }
                              adjustsFontSizeToFit
                            >
                              {t(
                                "current"
                              )}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  }
                )}
              </View>
            </View>

            {/* PUBLIC PROFILE */}

            <View
              style={
                styles.showcaseCard
              }
            >
              <Text
                style={
                  styles.goldLabel
                }
              >
                {t(
                  "showcase"
                )}
              </Text>

              <Text
                style={
                  styles.showcaseTitle
                }
              >
                {t(
                  "publicHighlights"
                )}
              </Text>

              <Showcase
                label={
                  t(
                    "avatar"
                  )
                }
                value={
                  avatarName
                }
              />

              <Showcase
                label={
                  t(
                    "outfit"
                  )
                }
                value={
                  suitLabel(
                    equippedSuit
                  )
                }
              />

              <Showcase
                label={
                  t(
                    "favoritePassport"
                  )
                }
                value={
                  favoritePassport
                }
              />

              <Showcase
                label={
                  t(
                    "favoriteBadge"
                  )
                }
                value={
                  favoriteBadge
                }
              />

              <Showcase
                label={
                  t(
                    "favoriteJourneyLabel"
                  )
                }
                value={
                  displayJourneyTitle
                }
              />
            </View>

            {/* FOOTER */}

            <View
              style={
                styles.bottomCard
              }
            >
              <Text
                style={
                  styles.bottomLabel
                }
              >
                {t(
                  "walker"
                )}
              </Text>

              <Text
                style={
                  styles.bottomTitle
                }
              >
                {t(
                  "buildLegacy"
                )}
              </Text>

              <Text
                style={
                  styles.bottomText
                }
              >
                {t(
                  "footer"
                )}
              </Text>
            </View>

            {loading ? (
              <Text
                style={
                  styles.loadingText
                }
              >
                {t(
                  "updating"
                )}
              </Text>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

// ============================================================
// STAT
// ============================================================

function Stat({
  icon,
  number,
  label,
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
        style={
          styles.statNumber
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {number}
      </Text>

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
  );
}

// ============================================================
// COLLECTION
// ============================================================

function Collection({
  id,
  image,
  title,
  unlocked = false,
  openPassport,
  unlockedText,
  lockedText,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.passportCard,

        unlocked &&
          styles.unlockedPassport,
      ]}
      onPress={() => {
        if (
          unlocked &&
          openPassport
        ) {
          openPassport(
            id
          );
        }
      }}
      activeOpacity={
        unlocked
          ? 0.82
          : 1
      }
    >
      <View
        style={
          styles.passportImageWrap
        }
      >
        <Image
          source={
            unlocked
              ? image
              : LOCKED_PASSPORT
          }
          style={
            styles.passportImage
          }
          resizeMode="contain"
        />
      </View>

      <Text
        style={
          styles.passportTitle
        }
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.75
        }
      >
        {title}
      </Text>

      <Text
        style={
          unlocked
            ? styles.passportUnlockedText
            : styles.passportLockedText
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {unlocked
          ? unlockedText
          : lockedText}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// BADGE
// ============================================================

function Badge({
  icon,
  title,
  unlocked = false,
  earnedText,
  lockedText,
}) {
  return (
    <View
      style={[
        styles.badgeCard,

        unlocked
          ? styles.badgeUnlocked
          : styles.badgeLocked,
      ]}
    >
      <Text
        style={[
          styles.badgeIcon,

          !unlocked &&
            styles.lockedOpacity,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.badgeTitle,

          !unlocked &&
            styles.badgeTitleLocked,
        ]}
        numberOfLines={
          2
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {title}
      </Text>

      <Text
        style={
          unlocked
            ? styles.badgeStateUnlocked
            : styles.badgeStateLocked
        }
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {unlocked
          ? earnedText
          : lockedText}
      </Text>
    </View>
  );
}

// ============================================================
// TIMELINE
// ============================================================

function Timeline({
  title,
  date,
  last = false,
}) {
  return (
    <View
      style={
        styles.timelineRow
      }
    >
      <View
        style={
          styles.timelineMarkerWrap
        }
      >
        <View
          style={
            styles.timelineDot
          }
        />

        {!last ? (
          <View
            style={
              styles.timelineLine
            }
          />
        ) : null}
      </View>

      <View
        style={
          styles.timelineTextWrap
        }
      >
        <Text
          style={
            styles.timelineTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.timelineDate
          }
        >
          {date}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// SHOWCASE
// ============================================================

function Showcase({
  label,
  value,
}) {
  return (
    <View
      style={
        styles.showcaseRow
      }
    >
      <Text
        style={
          styles.showcaseItemLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.showcaseItemValue
        }
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
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor:
        "#02060D",
    },

    backgroundImage: {
      resizeMode:
        "cover",
      opacity: 0.34,
    },

    overlay: {
      flex: 1,
      backgroundColor:
        "rgba(1,7,16,0.77)",
    },

    safe: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 170,
    },

    headerRow: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      marginBottom: 22,
    },

    backButton: {
      width: 48,
      height: 48,

      borderRadius: 24,

      borderWidth: 1,
      borderColor:
        "#DDB535",

      backgroundColor:
        "rgba(7,20,38,0.94)",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 12,
    },

    backText: {
      color:
        "#F1CB49",

      fontSize: 39,
      lineHeight: 42,
    },

    backSpacer: {
      width: 0,
    },

    headerTextWrap: {
      flex: 1,
    },

    eyebrow: {
      color:
        "#9EF0D4",

      fontSize: 13,
      fontWeight:
        "900",

      letterSpacing: 3,
      marginBottom: 7,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize: 36,
      lineHeight: 40,

      fontWeight:
        "900",
    },

    headerSubtitle: {
      color:
        "#A8B5C8",

      fontSize: 15,
      lineHeight: 22,

      fontWeight:
        "700",

      marginTop: 7,
    },

    heroCard: {
      overflow:
        "hidden",

      borderRadius: 30,

      borderWidth: 2,
      borderColor:
        "#DBB536",

      backgroundColor:
        "#071427",

      marginBottom: 30,

      shadowColor:
        "#E1B739",

      shadowOpacity: 0.22,
      shadowRadius: 22,

      shadowOffset: {
        width: 0,
        height: 10,
      },

      elevation: 12,
    },

    heroGlow: {
      position:
        "absolute",

      width: 430,
      height: 430,

      borderRadius: 215,

      backgroundColor:
        "rgba(75,44,170,0.30)",

      top: 72,

      alignSelf:
        "center",
    },

    avatarStage: {
      height: 500,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "rgba(4,15,30,0.40)",

      position:
        "relative",
    },

    avatarImage: {
      width:
        "92%",

      height:
        "92%",
    },

    avatarFallback: {
      fontSize: 110,
    },

    rankPill: {
      position:
        "absolute",

      bottom: 18,

      maxWidth:
        "88%",

      borderRadius: 24,

      borderWidth: 1.5,
      borderColor:
        "#E3BC38",

      backgroundColor:
        "#07111F",

      paddingVertical: 8,
      paddingHorizontal: 22,
    },

    rankPillText: {
      color:
        "#FFD54A",

      fontSize: 16,
      fontWeight:
        "900",

      textAlign:
        "center",
    },

    heroInfo: {
      alignItems:
        "center",

      paddingHorizontal: 24,
      paddingTop: 27,
      paddingBottom: 30,

      backgroundColor:
        "rgba(8,24,44,0.96)",
    },

    profileLabel: {
      color:
        "#FFD34A",

      fontSize: 13,
      fontWeight:
        "900",

      letterSpacing: 2,

      marginBottom: 8,

      textAlign:
        "center",
    },

    name: {
      color:
        "#FFFFFF",

      fontSize: 40,
      lineHeight: 46,

      fontWeight:
        "900",

      textAlign:
        "center",
    },

    avatarIdentity: {
      color:
        "#E7BE3D",

      fontSize: 18,
      fontWeight:
        "900",

      marginTop: 5,
    },

    outfitPill: {
      maxWidth:
        "100%",

      marginTop: 18,

      borderRadius: 25,

      borderWidth: 1.5,
      borderColor:
        "#55DEA4",

      backgroundColor:
        "#0E3A2B",

      paddingVertical: 9,
      paddingHorizontal: 18,
    },

    outfitPillText: {
      color:
        "#A5F1D5",

      fontSize: 15,
      fontWeight:
        "900",

      textAlign:
        "center",
    },

    legathonScore: {
      color:
        "#FFD54A",

      fontSize: 21,
      lineHeight: 28,

      fontWeight:
        "900",

      marginTop: 24,

      textAlign:
        "center",
    },

    levelBar: {
      width:
        "100%",

      height: 13,

      borderRadius: 10,

      backgroundColor:
        "#25394F",

      overflow:
        "hidden",

      marginTop: 20,
    },

    levelFill: {
      height:
        "100%",

      borderRadius: 10,

      backgroundColor:
        "#E2B932",
    },

    levelText: {
      color:
        "#ADB9CB",

      fontSize: 16,
      fontWeight:
        "800",

      marginTop: 11,

      textAlign:
        "center",
    },

    avatarCenterButton: {
      width:
        "100%",

      marginTop: 22,

      minHeight: 56,

      borderRadius: 28,

      backgroundColor:
        "#E1B736",

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal: 15,
    },

    avatarCenterButtonText: {
      color:
        "#07111F",

      fontSize: 17,
      fontWeight:
        "900",

      textAlign:
        "center",
    },

    sectionHeadingRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 15,
    },

    sectionHeading: {
      color:
        "#FFFFFF",

      fontSize: 30,
      fontWeight:
        "900",

      marginTop: 2,
    },

    goldLabel: {
      color:
        "#DFB634",

      fontSize: 12,
      fontWeight:
        "900",

      letterSpacing: 2,
    },

    sectionIcon: {
      fontSize: 30,
    },

    sectionCard: {
      borderRadius: 26,

      borderWidth: 1,
      borderColor:
        "#304965",

      backgroundColor:
        "rgba(7,22,42,0.95)",

      padding: 22,

      marginBottom: 24,
    },

    sectionTop: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 20,
    },

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize: 26,
      lineHeight: 32,

      fontWeight:
        "900",

      marginTop: 5,
    },

    mutedText: {
      color:
        "#9EABBE",

      fontSize: 14,
      lineHeight: 20,

      marginTop: 8,
    },

    statsGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginBottom: 22,
    },

    statBox: {
      width:
        "48%",

      minHeight: 150,

      borderRadius: 23,

      borderWidth: 1,
      borderColor:
        "#304B69",

      backgroundColor:
        "rgba(8,25,47,0.96)",

      padding: 17,

      justifyContent:
        "center",

      marginBottom: 14,
    },

    statIcon: {
      fontSize: 24,
      marginBottom: 8,
    },

    statNumber: {
      color:
        "#FFFFFF",

      fontSize: 31,
      fontWeight:
        "900",
    },

    statLabel: {
      color:
        "#AFB9CA",

      fontSize: 14,
      lineHeight: 19,

      fontWeight:
        "800",

      marginTop: 4,
    },

    favoriteCard: {
      minHeight: 108,

      borderRadius: 22,

      backgroundColor:
        "#101D2D",

      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 15,
    },

    favoriteIconBox: {
      width: 66,
      height: 66,

      borderRadius: 18,

      backgroundColor:
        "#15283E",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 14,
    },

    favoriteIcon: {
      fontSize: 34,
    },

    favoriteTextWrap: {
      flex: 1,
    },

    favoriteTitle: {
      color:
        "#FFFFFF",

      fontSize: 20,
      fontWeight:
        "900",
    },

    favoriteSub: {
      color:
        "#AEB8C7",

      fontSize: 14,
      lineHeight: 20,

      fontWeight:
        "700",

      marginTop: 5,
    },

    chevron: {
      color:
        "#D9B337",

      fontSize: 35,

      marginLeft: 8,
    },

    countPill: {
      minWidth: 43,
      height: 43,

      borderRadius: 22,

      backgroundColor:
        "#DDB536",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    countPillText: {
      color:
        "#07111F",

      fontSize: 18,
      fontWeight:
        "900",
    },

    collectionGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },

    passportCard: {
      width:
        "48%",

      borderRadius: 23,

      borderWidth: 1,
      borderColor:
        "#324D70",

      backgroundColor:
        "#101F35",

      padding: 12,

      alignItems:
        "center",

      marginBottom: 15,
    },

    unlockedPassport: {
      borderWidth: 2,
      borderColor:
        "#DDB536",
    },

    passportImageWrap: {
      width:
        "100%",

      aspectRatio: 0.82,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    passportImage: {
      width:
        "92%",

      height:
        "92%",
    },

    passportTitle: {
      color:
        "#FFFFFF",

      fontSize: 18,

      fontWeight:
        "900",

      marginTop: 7,

      textAlign:
        "center",
    },

    passportUnlockedText: {
      color:
        "#88E7BA",

      fontSize: 10,
      fontWeight:
        "900",

      letterSpacing: 1,

      marginTop: 5,
    },

    passportLockedText: {
      color:
        "#8996AA",

      fontSize: 10,
      fontWeight:
        "900",

      letterSpacing: 1,

      marginTop: 5,
    },

    goldCard: {
      borderRadius: 27,

      borderWidth: 1.5,
      borderColor:
        "#DDB536",

      backgroundColor:
        "rgba(24,18,2,0.95)",

      padding: 22,

      marginBottom: 24,
    },

    badgeGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      marginTop: 20,
    },

    badgeCard: {
      width:
        "48%",

      minHeight: 145,

      borderRadius: 22,

      borderWidth: 1,

      padding: 16,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 14,
    },

    badgeUnlocked: {
      borderColor:
        "#DDB536",

      backgroundColor:
        "#101D2F",
    },

    badgeLocked: {
      borderColor:
        "#354256",

      backgroundColor:
        "#0B1421",
    },

    badgeIcon: {
      fontSize: 36,
      marginBottom: 9,
    },

    lockedOpacity: {
      opacity: 0.35,
    },

    badgeTitle: {
      color:
        "#FFFFFF",

      fontSize: 16,
      fontWeight:
        "900",

      textAlign:
        "center",
    },

    badgeTitleLocked: {
      color:
        "#748197",
    },

    badgeStateUnlocked: {
      color:
        "#8CE8BB",

      fontSize: 9,
      fontWeight:
        "900",

      letterSpacing: 1,

      marginTop: 8,
    },

    badgeStateLocked: {
      color:
        "#657286",

      fontSize: 9,
      fontWeight:
        "900",

      letterSpacing: 1,

      marginTop: 8,
    },

    timelineRow: {
      flexDirection:
        "row",

      minHeight: 88,
    },

    timelineMarkerWrap: {
      width: 34,

      alignItems:
        "center",
    },

    timelineDot: {
      width: 18,
      height: 18,

      borderRadius: 9,

      backgroundColor:
        "#E2B936",

      marginTop: 4,
    },

    timelineLine: {
      width: 2,
      flex: 1,

      backgroundColor:
        "#725F28",

      marginTop: 5,
    },

    timelineTextWrap: {
      flex: 1,
      paddingLeft: 12,
      paddingBottom: 20,
    },

    timelineTitle: {
      color:
        "#FFFFFF",

      fontSize: 19,

      fontWeight:
        "900",
    },

    timelineDate: {
      color:
        "#A7B2C3",

      fontSize: 14,
      fontWeight:
        "700",

      marginTop: 5,
    },

    emptyState: {
      borderRadius: 20,

      backgroundColor:
        "#0D1929",

      padding: 25,

      alignItems:
        "center",
    },

    emptyStateIcon: {
      fontSize: 38,
      marginBottom: 10,
    },

    emptyText: {
      color:
        "#A4B0C1",

      fontSize: 15,
      lineHeight: 22,

      textAlign:
        "center",
    },

    rankList: {
      gap: 8,
    },

    rankRow: {
      minHeight: 61,

      borderRadius: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 15,
    },

    rankRowActive: {
      backgroundColor:
        "#202C3E",
    },

    rankDiamond: {
      color:
        "#DDB536",

      fontSize: 23,

      width: 39,
    },

    rankDiamondActive: {
      color:
        "#F1C63B",
    },

    rankText: {
      flex: 1,

      color:
        "#8390A5",

      fontSize: 19,
      fontWeight:
        "900",
    },

    rankTextActive: {
      color:
        "#FFFFFF",
    },

    currentPill: {
      maxWidth: 95,

      borderRadius: 16,

      backgroundColor:
        "#E2B936",

      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    currentPillText: {
      color:
        "#07111F",

      fontSize: 9,
      fontWeight:
        "900",

      textAlign:
        "center",
    },

    showcaseCard: {
      borderRadius: 27,

      borderWidth: 1,
      borderColor:
        "#394E68",

      backgroundColor:
        "rgba(7,23,43,0.97)",

      padding: 22,

      marginBottom: 24,
    },

    showcaseTitle: {
      color:
        "#FFFFFF",

      fontSize: 30,
      lineHeight: 37,

      fontWeight:
        "900",

      marginTop: 6,
      marginBottom: 18,
    },

    showcaseRow: {
      minHeight: 61,

      borderBottomWidth: 1,
      borderBottomColor:
        "#2B3B50",

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap: 14,
    },

    showcaseItemLabel: {
      flex: 1,

      color:
        "#9EABBF",

      fontSize: 14,

      fontWeight:
        "800",
    },

    showcaseItemValue: {
      flex: 1,

      color:
        "#FFFFFF",

      fontSize: 14,
      fontWeight:
        "900",

      textAlign:
        "right",
    },

    bottomCard: {
      borderRadius: 27,

      borderWidth: 1,
      borderColor:
        "#DDB536",

      backgroundColor:
        "rgba(12,20,32,0.96)",

      padding: 25,

      marginBottom: 24,
    },

    bottomLabel: {
      color:
        "#9EF0D4",

      fontSize: 11,
      fontWeight:
        "900",

      letterSpacing: 2,
    },

    bottomTitle: {
      color:
        "#FFFFFF",

      fontSize: 28,
      lineHeight: 34,

      fontWeight:
        "900",

      marginTop: 8,
    },

    bottomText: {
      color:
        "#A9B5C5",

      fontSize: 15,
      lineHeight: 23,

      marginTop: 10,
    },

    loadingText: {
      color:
        "#91A0B4",

      textAlign:
        "center",

      marginTop: 6,
    },
  });