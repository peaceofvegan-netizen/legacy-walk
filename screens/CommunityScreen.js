// screens/CommunityScreen.js
//
// LEGATHON WALK
// COMMUNITY HUB
//
// LIVE THROUGH SUPABASE:
// • Walking Circles
// • Walking Circle membership totals
// • Join / Leave Circle
// • Top Walking Circles ranking
//
// LOCAL DEVICE STATE:
// • Cheers
// • Sample friend request
// • Challenge participation
// • Event participation
// • Feed reactions
// • Following
// • Activity read state
//
// COMMENTS:
// • Opens CommunityCommentsScreen
//
// AI:
// • Text-only AI Community Coach
// ============================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../lib/supabase";

// ============================================================
// ASSETS
// ============================================================

const COMMUNITY_BG = require("../assets/collage-background.png");
const WCOIN = require("../assets/wcoin.png");

// ============================================================
// STORAGE
// ============================================================

const COMMUNITY_STATE_KEY = "@legathon_community_state";

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    community: "Legathon Community",
    tagline: "Walk • Encourage • Grow Together",

    walkersOnline: "WALKERS ONLINE",
    friendsOnline: "Friends online",

    global: "GLOBAL",
    friends: "FRIENDS",
    following: "FOLLOWING",

    activityCenter: "Activity Center",
    unreadUpdates: "{count} unread updates",
    allCaughtUp: "You're all caught up",

    walkingStreak: "Walking Streak",
    walkingStreakText:
      "Several walkers extended their walking streak today.",
    journeyCompleted: "Journey Completed",
    journeyCompletedText:
      "A community member completed the Great Wall of China journey.",
    communityGrowing: "Community Growing",
    communityGrowingText:
      "New walkers joined the Legathon community.",

    read: "✓ Read",
    markRead: "Tap to mark as read",

    communityFeed: "Community Feed",
    communityFeedSubtitle:
      "Celebrate walkers around the world",

    completedCheckpoint: "completed Checkpoint 3",
    walkedSteps: "walked 14,582 steps",
    earnedStamp: "earned a new journey stamp",

    celebrate: "Celebrate",
    encourage: "Encourage",
    support: "Support",
    sent: "✓ Sent",
    comments: "💬 Comments",
    journey: "JOURNEY",

    walkingCircles: "Walking Circles",
    walkingCirclesSubtitle:
      "Find your walking community",
    loadingCircles: "Loading Walking Circles...",
    noCircles: "No Walking Circles are available yet.",
    unableLoadCircles: "Unable to load Walking Circles.",
    retry: "Retry",
    members: "members",
    updating: "Updating...",
    joinedLeave: "✓ Joined • Tap to Leave",
    joinCircle: "Join Circle",

    topWalkingCircles: "Top Walking Circles",
    joined: "Joined",
    join: "Join",

    communityChallenges: "Community Challenges",
    weekendChallenge: "Weekend Challenge",
    weekendChallengeDescription:
      "Walk 50,000 community steps this weekend.",
    globalWalkingWeekend: "Global Walking Weekend",
    globalWalkingWeekendDescription:
      "Help the community reach 100,000 steps.",
    joinChallenge: "Join Challenge",

    communityEvents: "Community Events",
    globalEvent: "Global Walking Weekend",
    communityEvent: "Community Event",
    globalEventDescription:
      "Walk with Legathon members around the world.",

    autismWalk: "Autism Awareness Walk",
    awarenessEvent: "Awareness Event",
    autismDescription:
      "Walk together in support of autism awareness.",

    heartWalk: "Heart Health Walk",
    wellnessEvent: "Wellness Event",
    heartDescription:
      "Join the community for a heart-healthy walking event.",

    joinEvent: "Join Event",

    aiCommunityCoach: "Legathon AI Community Coach",
    walkSmarter: "Walk Smarter Together",
    aiDescription:
      "Get encouragement, community insights, walking motivation, and personalized text guidance from Legathon AI.",
    openAICoach: "Open AI Community Coach",

    friendsWalking: "Friends Walking Now",
    friendsOnlineCount:
      "{online} of {total} friends online",
    steps: "steps",
    cheered: "✓ Cheered",
    cheer: "👏 Cheer",
    remove: "Remove",

    friendRequests: "Friend Requests",
    wantsWalk: "Wants to walk with you",
    accept: "Accept",
    decline: "Decline",
    friendAdded: "✓ Friend Added",
    requestDeclined: "Request Declined",

    followingTitle: "Following",
    followingSubtitle:
      "Walkers and circles you follow",
    follow: "Follow",
    followingButton: "✓ Following",

    legendWalker: "Legend Walker",
    masterExplorer: "Master Explorer",
    walkingCircle: "Walking Circle",

    signInRequired: "Sign In Required",
    signInCircle:
      "Please sign in to join a Walking Circle.",
    unableUpdateCircle: "Unable to Update Circle",
    tryAgain: "Please try again.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "AI Community Coach navigation is ready to be connected.",
  },

  es: {
    back: "‹ Atrás",
    community: "Comunidad Legathon",
    tagline: "Camina • Anima • Crece Juntos",

    walkersOnline: "CAMINANTES EN LÍNEA",
    friendsOnline: "Amigos en línea",

    global: "GLOBAL",
    friends: "AMIGOS",
    following: "SIGUIENDO",

    activityCenter: "Centro de Actividad",
    unreadUpdates: "{count} actualizaciones sin leer",
    allCaughtUp: "Estás al día",

    walkingStreak: "Racha de Caminata",
    walkingStreakText:
      "Varios caminantes ampliaron hoy su racha de caminata.",
    journeyCompleted: "Viaje Completado",
    journeyCompletedText:
      "Un miembro de la comunidad completó el viaje de la Gran Muralla China.",
    communityGrowing: "La Comunidad Crece",
    communityGrowingText:
      "Nuevos caminantes se unieron a la comunidad Legathon.",

    read: "✓ Leído",
    markRead: "Toca para marcar como leído",

    communityFeed: "Actividad de la Comunidad",
    communityFeedSubtitle:
      "Celebra a caminantes de todo el mundo",

    completedCheckpoint: "completó el Punto de Control 3",
    walkedSteps: "caminó 14.582 pasos",
    earnedStamp: "obtuvo un nuevo sello de viaje",

    celebrate: "Celebrar",
    encourage: "Animar",
    support: "Apoyar",
    sent: "✓ Enviado",
    comments: "💬 Comentarios",
    journey: "VIAJE",

    walkingCircles: "Círculos de Caminata",
    walkingCirclesSubtitle:
      "Encuentra tu comunidad de caminata",
    loadingCircles: "Cargando círculos de caminata...",
    noCircles:
      "Todavía no hay círculos de caminata disponibles.",
    unableLoadCircles:
      "No se pudieron cargar los círculos de caminata.",
    retry: "Reintentar",
    members: "miembros",
    updating: "Actualizando...",
    joinedLeave: "✓ Unido • Toca para salir",
    joinCircle: "Unirse al Círculo",

    topWalkingCircles: "Mejores Círculos de Caminata",
    joined: "Unido",
    join: "Unirse",

    communityChallenges: "Desafíos de la Comunidad",
    weekendChallenge: "Desafío de Fin de Semana",
    weekendChallengeDescription:
      "Camina 50.000 pasos comunitarios este fin de semana.",
    globalWalkingWeekend: "Fin de Semana Mundial de Caminata",
    globalWalkingWeekendDescription:
      "Ayuda a la comunidad a alcanzar 100.000 pasos.",
    joinChallenge: "Unirse al Desafío",

    communityEvents: "Eventos de la Comunidad",
    globalEvent: "Fin de Semana Mundial de Caminata",
    communityEvent: "Evento Comunitario",
    globalEventDescription:
      "Camina con miembros de Legathon de todo el mundo.",

    autismWalk: "Caminata de Concientización sobre el Autismo",
    awarenessEvent: "Evento de Concientización",
    autismDescription:
      "Caminemos juntos en apoyo de la concientización sobre el autismo.",

    heartWalk: "Caminata por la Salud del Corazón",
    wellnessEvent: "Evento de Bienestar",
    heartDescription:
      "Únete a la comunidad para una caminata saludable para el corazón.",

    joinEvent: "Unirse al Evento",

    aiCommunityCoach: "Coach Comunitario Legathon AI",
    walkSmarter: "Caminen Mejor Juntos",
    aiDescription:
      "Obtén ánimo, información de la comunidad, motivación para caminar y orientación personalizada por texto de Legathon AI.",
    openAICoach: "Abrir Coach Comunitario AI",

    friendsWalking: "Amigos Caminando Ahora",
    friendsOnlineCount:
      "{online} de {total} amigos en línea",
    steps: "pasos",
    cheered: "✓ Animado",
    cheer: "👏 Animar",
    remove: "Eliminar",

    friendRequests: "Solicitudes de Amistad",
    wantsWalk: "Quiere caminar contigo",
    accept: "Aceptar",
    decline: "Rechazar",
    friendAdded: "✓ Amigo Agregado",
    requestDeclined: "Solicitud Rechazada",

    followingTitle: "Siguiendo",
    followingSubtitle:
      "Caminantes y círculos que sigues",
    follow: "Seguir",
    followingButton: "✓ Siguiendo",

    legendWalker: "Caminante Leyenda",
    masterExplorer: "Explorador Maestro",
    walkingCircle: "Círculo de Caminata",

    signInRequired: "Inicio de Sesión Requerido",
    signInCircle:
      "Inicia sesión para unirte a un círculo de caminata.",
    unableUpdateCircle: "No se Pudo Actualizar el Círculo",
    tryAgain: "Inténtalo de nuevo.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "La navegación del Coach Comunitario AI está lista para conectarse.",
  },

  fr: {
    back: "‹ Retour",
    community: "Communauté Legathon",
    tagline: "Marchez • Encouragez • Grandissez Ensemble",

    walkersOnline: "MARCHEURS EN LIGNE",
    friendsOnline: "Amis en ligne",

    global: "GLOBAL",
    friends: "AMIS",
    following: "ABONNEMENTS",

    activityCenter: "Centre d’Activité",
    unreadUpdates: "{count} mises à jour non lues",
    allCaughtUp: "Vous êtes à jour",

    walkingStreak: "Série de Marche",
    walkingStreakText:
      "Plusieurs marcheurs ont prolongé leur série de marche aujourd’hui.",
    journeyCompleted: "Parcours Terminé",
    journeyCompletedText:
      "Un membre de la communauté a terminé le parcours de la Grande Muraille de Chine.",
    communityGrowing: "Communauté en Croissance",
    communityGrowingText:
      "De nouveaux marcheurs ont rejoint la communauté Legathon.",

    read: "✓ Lu",
    markRead: "Touchez pour marquer comme lu",

    communityFeed: "Fil de la Communauté",
    communityFeedSubtitle:
      "Célébrez les marcheurs du monde entier",

    completedCheckpoint: "a terminé le point de contrôle 3",
    walkedSteps: "a marché 14 582 pas",
    earnedStamp: "a obtenu un nouveau tampon de parcours",

    celebrate: "Célébrer",
    encourage: "Encourager",
    support: "Soutenir",
    sent: "✓ Envoyé",
    comments: "💬 Commentaires",
    journey: "PARCOURS",

    walkingCircles: "Cercles de Marche",
    walkingCirclesSubtitle:
      "Trouvez votre communauté de marche",
    loadingCircles: "Chargement des cercles de marche...",
    noCircles:
      "Aucun cercle de marche n’est encore disponible.",
    unableLoadCircles:
      "Impossible de charger les cercles de marche.",
    retry: "Réessayer",
    members: "membres",
    updating: "Mise à jour...",
    joinedLeave: "✓ Rejoint • Touchez pour quitter",
    joinCircle: "Rejoindre le Cercle",

    topWalkingCircles: "Meilleurs Cercles de Marche",
    joined: "Rejoint",
    join: "Rejoindre",

    communityChallenges: "Défis Communautaires",
    weekendChallenge: "Défi du Week-end",
    weekendChallengeDescription:
      "Marchez 50 000 pas communautaires ce week-end.",
    globalWalkingWeekend: "Week-end Mondial de Marche",
    globalWalkingWeekendDescription:
      "Aidez la communauté à atteindre 100 000 pas.",
    joinChallenge: "Rejoindre le Défi",

    communityEvents: "Événements Communautaires",
    globalEvent: "Week-end Mondial de Marche",
    communityEvent: "Événement Communautaire",
    globalEventDescription:
      "Marchez avec des membres Legathon du monde entier.",

    autismWalk: "Marche de Sensibilisation à l’Autisme",
    awarenessEvent: "Événement de Sensibilisation",
    autismDescription:
      "Marchons ensemble pour soutenir la sensibilisation à l’autisme.",

    heartWalk: "Marche pour la Santé du Cœur",
    wellnessEvent: "Événement Bien-être",
    heartDescription:
      "Rejoignez la communauté pour une marche bénéfique pour le cœur.",

    joinEvent: "Rejoindre l’Événement",

    aiCommunityCoach: "Coach Communautaire Legathon AI",
    walkSmarter: "Marchez Plus Intelligemment Ensemble",
    aiDescription:
      "Recevez des encouragements, des informations communautaires, de la motivation et des conseils personnalisés par texte de Legathon AI.",
    openAICoach: "Ouvrir le Coach Communautaire AI",

    friendsWalking: "Amis en Marche",
    friendsOnlineCount:
      "{online} amis sur {total} en ligne",
    steps: "pas",
    cheered: "✓ Encouragé",
    cheer: "👏 Encourager",
    remove: "Retirer",

    friendRequests: "Demandes d’Ami",
    wantsWalk: "Souhaite marcher avec vous",
    accept: "Accepter",
    decline: "Refuser",
    friendAdded: "✓ Ami Ajouté",
    requestDeclined: "Demande Refusée",

    followingTitle: "Abonnements",
    followingSubtitle:
      "Marcheurs et cercles que vous suivez",
    follow: "Suivre",
    followingButton: "✓ Suivi",

    legendWalker: "Marcheur Légendaire",
    masterExplorer: "Maître Explorateur",
    walkingCircle: "Cercle de Marche",

    signInRequired: "Connexion Requise",
    signInCircle:
      "Connectez-vous pour rejoindre un cercle de marche.",
    unableUpdateCircle: "Impossible de Mettre à Jour le Cercle",
    tryAgain: "Veuillez réessayer.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "La navigation du Coach Communautaire AI est prête à être connectée.",
  },

  de: {
    back: "‹ Zurück",
    community: "Legathon Community",
    tagline: "Gehen • Motivieren • Gemeinsam Wachsen",

    walkersOnline: "WALKER ONLINE",
    friendsOnline: "Freunde online",

    global: "GLOBAL",
    friends: "FREUNDE",
    following: "FOLGE ICH",

    activityCenter: "Aktivitätscenter",
    unreadUpdates: "{count} ungelesene Updates",
    allCaughtUp: "Alles auf dem neuesten Stand",

    walkingStreak: "Gehserie",
    walkingStreakText:
      "Mehrere Walker haben heute ihre Gehserie verlängert.",
    journeyCompleted: "Reise Abgeschlossen",
    journeyCompletedText:
      "Ein Community-Mitglied hat die Reise zur Chinesischen Mauer abgeschlossen.",
    communityGrowing: "Community Wächst",
    communityGrowingText:
      "Neue Walker sind der Legathon Community beigetreten.",

    read: "✓ Gelesen",
    markRead: "Tippen, um als gelesen zu markieren",

    communityFeed: "Community-Feed",
    communityFeedSubtitle:
      "Feiere Walker aus aller Welt",

    completedCheckpoint: "hat Checkpoint 3 abgeschlossen",
    walkedSteps: "ist 14.582 Schritte gegangen",
    earnedStamp: "hat einen neuen Reisestempel erhalten",

    celebrate: "Feiern",
    encourage: "Motivieren",
    support: "Unterstützen",
    sent: "✓ Gesendet",
    comments: "💬 Kommentare",
    journey: "REISE",

    walkingCircles: "Walking Circles",
    walkingCirclesSubtitle:
      "Finde deine Walking-Community",
    loadingCircles: "Walking Circles werden geladen...",
    noCircles: "Noch keine Walking Circles verfügbar.",
    unableLoadCircles:
      "Walking Circles konnten nicht geladen werden.",
    retry: "Erneut versuchen",
    members: "Mitglieder",
    updating: "Aktualisierung...",
    joinedLeave: "✓ Beigetreten • Tippen zum Verlassen",
    joinCircle: "Circle Beitreten",

    topWalkingCircles: "Top Walking Circles",
    joined: "Beigetreten",
    join: "Beitreten",

    communityChallenges: "Community-Herausforderungen",
    weekendChallenge: "Wochenend-Challenge",
    weekendChallengeDescription:
      "Geht dieses Wochenende gemeinsam 50.000 Schritte.",
    globalWalkingWeekend: "Globales Walking-Wochenende",
    globalWalkingWeekendDescription:
      "Hilf der Community, 100.000 Schritte zu erreichen.",
    joinChallenge: "Challenge Beitreten",

    communityEvents: "Community-Events",
    globalEvent: "Globales Walking-Wochenende",
    communityEvent: "Community-Event",
    globalEventDescription:
      "Gehe mit Legathon-Mitgliedern auf der ganzen Welt.",

    autismWalk: "Autismus-Aufmerksamkeitslauf",
    awarenessEvent: "Awareness-Event",
    autismDescription:
      "Geht gemeinsam zur Unterstützung der Autismus-Aufklärung.",

    heartWalk: "Herzgesundheits-Walk",
    wellnessEvent: "Wellness-Event",
    heartDescription:
      "Nimm mit der Community an einem herzgesunden Walk teil.",

    joinEvent: "Event Beitreten",

    aiCommunityCoach: "Legathon AI Community Coach",
    walkSmarter: "Gemeinsam Smarter Gehen",
    aiDescription:
      "Erhalte Motivation, Community-Einblicke und personalisierte textbasierte Tipps von Legathon AI.",
    openAICoach: "AI Community Coach Öffnen",

    friendsWalking: "Freunde Gehen Jetzt",
    friendsOnlineCount:
      "{online} von {total} Freunden online",
    steps: "Schritte",
    cheered: "✓ Motiviert",
    cheer: "👏 Motivieren",
    remove: "Entfernen",

    friendRequests: "Freundschaftsanfragen",
    wantsWalk: "Möchte mit dir gehen",
    accept: "Annehmen",
    decline: "Ablehnen",
    friendAdded: "✓ Freund Hinzugefügt",
    requestDeclined: "Anfrage Abgelehnt",

    followingTitle: "Folge Ich",
    followingSubtitle:
      "Walker und Circles, denen du folgst",
    follow: "Folgen",
    followingButton: "✓ Folge ich",

    legendWalker: "Legendärer Walker",
    masterExplorer: "Meister-Entdecker",
    walkingCircle: "Walking Circle",

    signInRequired: "Anmeldung Erforderlich",
    signInCircle:
      "Bitte melde dich an, um einem Walking Circle beizutreten.",
    unableUpdateCircle:
      "Circle Konnte Nicht Aktualisiert Werden",
    tryAgain: "Bitte erneut versuchen.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "Die Navigation zum AI Community Coach kann jetzt verbunden werden.",
  },

  pt: {
    back: "‹ Voltar",
    community: "Comunidade Legathon",
    tagline: "Caminhe • Incentive • Cresça Junto",

    walkersOnline: "CAMINHANTES ONLINE",
    friendsOnline: "Amigos online",

    global: "GLOBAL",
    friends: "AMIGOS",
    following: "SEGUINDO",

    activityCenter: "Central de Atividades",
    unreadUpdates: "{count} atualizações não lidas",
    allCaughtUp: "Tudo em dia",

    walkingStreak: "Sequência de Caminhada",
    walkingStreakText:
      "Vários caminhantes aumentaram sua sequência de caminhada hoje.",
    journeyCompleted: "Jornada Concluída",
    journeyCompletedText:
      "Um membro da comunidade concluiu a jornada da Grande Muralha da China.",
    communityGrowing: "Comunidade Crescendo",
    communityGrowingText:
      "Novos caminhantes entraram para a comunidade Legathon.",

    read: "✓ Lido",
    markRead: "Toque para marcar como lido",

    communityFeed: "Feed da Comunidade",
    communityFeedSubtitle:
      "Celebre caminhantes do mundo todo",

    completedCheckpoint: "concluiu o Checkpoint 3",
    walkedSteps: "caminhou 14.582 passos",
    earnedStamp: "ganhou um novo selo de jornada",

    celebrate: "Celebrar",
    encourage: "Incentivar",
    support: "Apoiar",
    sent: "✓ Enviado",
    comments: "💬 Comentários",
    journey: "JORNADA",

    walkingCircles: "Círculos de Caminhada",
    walkingCirclesSubtitle:
      "Encontre sua comunidade de caminhada",
    loadingCircles: "Carregando círculos de caminhada...",
    noCircles:
      "Ainda não há círculos de caminhada disponíveis.",
    unableLoadCircles:
      "Não foi possível carregar os círculos de caminhada.",
    retry: "Tentar novamente",
    members: "membros",
    updating: "Atualizando...",
    joinedLeave: "✓ Participando • Toque para sair",
    joinCircle: "Entrar no Círculo",

    topWalkingCircles: "Principais Círculos de Caminhada",
    joined: "Participando",
    join: "Entrar",

    communityChallenges: "Desafios da Comunidade",
    weekendChallenge: "Desafio de Fim de Semana",
    weekendChallengeDescription:
      "Caminhe 50.000 passos comunitários neste fim de semana.",
    globalWalkingWeekend: "Fim de Semana Global de Caminhada",
    globalWalkingWeekendDescription:
      "Ajude a comunidade a alcançar 100.000 passos.",
    joinChallenge: "Participar do Desafio",

    communityEvents: "Eventos da Comunidade",
    globalEvent: "Fim de Semana Global de Caminhada",
    communityEvent: "Evento Comunitário",
    globalEventDescription:
      "Caminhe com membros do Legathon ao redor do mundo.",

    autismWalk: "Caminhada de Conscientização sobre Autismo",
    awarenessEvent: "Evento de Conscientização",
    autismDescription:
      "Caminhe junto em apoio à conscientização sobre o autismo.",

    heartWalk: "Caminhada pela Saúde do Coração",
    wellnessEvent: "Evento de Bem-estar",
    heartDescription:
      "Junte-se à comunidade para uma caminhada saudável para o coração.",

    joinEvent: "Participar do Evento",

    aiCommunityCoach: "Coach Comunitário Legathon AI",
    walkSmarter: "Caminhe Melhor em Conjunto",
    aiDescription:
      "Receba incentivo, insights da comunidade, motivação para caminhar e orientação personalizada em texto do Legathon AI.",
    openAICoach: "Abrir Coach Comunitário AI",

    friendsWalking: "Amigos Caminhando Agora",
    friendsOnlineCount:
      "{online} de {total} amigos online",
    steps: "passos",
    cheered: "✓ Incentivado",
    cheer: "👏 Incentivar",
    remove: "Remover",

    friendRequests: "Solicitações de Amizade",
    wantsWalk: "Quer caminhar com você",
    accept: "Aceitar",
    decline: "Recusar",
    friendAdded: "✓ Amigo Adicionado",
    requestDeclined: "Solicitação Recusada",

    followingTitle: "Seguindo",
    followingSubtitle:
      "Caminhantes e círculos que você segue",
    follow: "Seguir",
    followingButton: "✓ Seguindo",

    legendWalker: "Caminhante Lendário",
    masterExplorer: "Explorador Mestre",
    walkingCircle: "Círculo de Caminhada",

    signInRequired: "Login Necessário",
    signInCircle:
      "Faça login para entrar em um círculo de caminhada.",
    unableUpdateCircle:
      "Não Foi Possível Atualizar o Círculo",
    tryAgain: "Tente novamente.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "A navegação do Coach Comunitário AI está pronta para ser conectada.",
  },

  ja: {
    back: "‹ 戻る",
    community: "Legathon コミュニティ",
    tagline: "歩く • 励ます • 一緒に成長",

    walkersOnline: "オンラインのウォーカー",
    friendsOnline: "オンラインの友達",

    global: "グローバル",
    friends: "友達",
    following: "フォロー中",

    activityCenter: "アクティビティセンター",
    unreadUpdates: "未読の更新 {count} 件",
    allCaughtUp: "すべて確認済みです",

    walkingStreak: "ウォーキング連続記録",
    walkingStreakText:
      "今日、複数のウォーカーが連続記録を更新しました。",
    journeyCompleted: "ジャーニー完了",
    journeyCompletedText:
      "コミュニティメンバーが万里の長城ジャーニーを完了しました。",
    communityGrowing: "コミュニティ拡大中",
    communityGrowingText:
      "新しいウォーカーがLegathonコミュニティに参加しました。",

    read: "✓ 既読",
    markRead: "タップして既読にする",

    communityFeed: "コミュニティフィード",
    communityFeedSubtitle:
      "世界中のウォーカーを称えよう",

    completedCheckpoint: "チェックポイント3を完了しました",
    walkedSteps: "14,582歩歩きました",
    earnedStamp: "新しいジャーニースタンプを獲得しました",

    celebrate: "祝う",
    encourage: "応援",
    support: "サポート",
    sent: "✓ 送信済み",
    comments: "💬 コメント",
    journey: "ジャーニー",

    walkingCircles: "ウォーキングサークル",
    walkingCirclesSubtitle:
      "あなたのウォーキングコミュニティを見つけよう",
    loadingCircles: "ウォーキングサークルを読み込み中...",
    noCircles:
      "利用できるウォーキングサークルはまだありません。",
    unableLoadCircles:
      "ウォーキングサークルを読み込めませんでした。",
    retry: "再試行",
    members: "メンバー",
    updating: "更新中...",
    joinedLeave: "✓ 参加中 • タップして退出",
    joinCircle: "サークルに参加",

    topWalkingCircles: "トップウォーキングサークル",
    joined: "参加中",
    join: "参加",

    communityChallenges: "コミュニティチャレンジ",
    weekendChallenge: "週末チャレンジ",
    weekendChallengeDescription:
      "今週末、コミュニティで50,000歩を歩こう。",
    globalWalkingWeekend: "グローバルウォーキング週末",
    globalWalkingWeekendDescription:
      "コミュニティの100,000歩達成を助けよう。",
    joinChallenge: "チャレンジに参加",

    communityEvents: "コミュニティイベント",
    globalEvent: "グローバルウォーキング週末",
    communityEvent: "コミュニティイベント",
    globalEventDescription:
      "世界中のLegathonメンバーと一緒に歩こう。",

    autismWalk: "自閉症啓発ウォーク",
    awarenessEvent: "啓発イベント",
    autismDescription:
      "自閉症への理解を広げるために一緒に歩きましょう。",

    heartWalk: "心臓健康ウォーク",
    wellnessEvent: "ウェルネスイベント",
    heartDescription:
      "心臓の健康のためのウォーキングに参加しましょう。",

    joinEvent: "イベントに参加",

    aiCommunityCoach: "Legathon AI コミュニティコーチ",
    walkSmarter: "一緒にスマートに歩こう",
    aiDescription:
      "Legathon AIから励まし、コミュニティ情報、ウォーキングのモチベーション、個別のテキストガイダンスを受け取れます。",
    openAICoach: "AIコミュニティコーチを開く",

    friendsWalking: "今歩いている友達",
    friendsOnlineCount:
      "{total}人中{online}人の友達がオンライン",
    steps: "歩",
    cheered: "✓ 応援済み",
    cheer: "👏 応援",
    remove: "削除",

    friendRequests: "友達リクエスト",
    wantsWalk: "あなたと一緒に歩きたいようです",
    accept: "承認",
    decline: "拒否",
    friendAdded: "✓ 友達を追加しました",
    requestDeclined: "リクエストを拒否しました",

    followingTitle: "フォロー中",
    followingSubtitle:
      "フォローしているウォーカーとサークル",
    follow: "フォロー",
    followingButton: "✓ フォロー中",

    legendWalker: "レジェンドウォーカー",
    masterExplorer: "マスターエクスプローラー",
    walkingCircle: "ウォーキングサークル",

    signInRequired: "サインインが必要です",
    signInCircle:
      "ウォーキングサークルに参加するにはサインインしてください。",
    unableUpdateCircle:
      "サークルを更新できません",
    tryAgain: "もう一度お試しください。",

    aiTitle: "Legathon AI",
    aiNavigation:
      "AIコミュニティコーチへのナビゲーションを接続できます。",
  },

  ko: {
    back: "‹ 뒤로",
    community: "Legathon 커뮤니티",
    tagline: "걷기 • 응원하기 • 함께 성장하기",

    walkersOnline: "온라인 워커",
    friendsOnline: "온라인 친구",

    global: "글로벌",
    friends: "친구",
    following: "팔로잉",

    activityCenter: "활동 센터",
    unreadUpdates: "읽지 않은 업데이트 {count}개",
    allCaughtUp: "모두 확인했습니다",

    walkingStreak: "걷기 연속 기록",
    walkingStreakText:
      "여러 워커가 오늘 걷기 연속 기록을 연장했습니다.",
    journeyCompleted: "여정 완료",
    journeyCompletedText:
      "커뮤니티 회원이 만리장성 여정을 완료했습니다.",
    communityGrowing: "커뮤니티 성장 중",
    communityGrowingText:
      "새로운 워커들이 Legathon 커뮤니티에 가입했습니다.",

    read: "✓ 읽음",
    markRead: "탭하여 읽음으로 표시",

    communityFeed: "커뮤니티 피드",
    communityFeedSubtitle:
      "전 세계 워커들을 함께 축하하세요",

    completedCheckpoint: "체크포인트 3을 완료했습니다",
    walkedSteps: "14,582걸음을 걸었습니다",
    earnedStamp: "새 여정 스탬프를 획득했습니다",

    celebrate: "축하",
    encourage: "응원",
    support: "지원",
    sent: "✓ 전송됨",
    comments: "💬 댓글",
    journey: "여정",

    walkingCircles: "워킹 서클",
    walkingCirclesSubtitle:
      "나에게 맞는 걷기 커뮤니티를 찾아보세요",
    loadingCircles: "워킹 서클 불러오는 중...",
    noCircles: "아직 이용 가능한 워킹 서클이 없습니다.",
    unableLoadCircles:
      "워킹 서클을 불러올 수 없습니다.",
    retry: "다시 시도",
    members: "회원",
    updating: "업데이트 중...",
    joinedLeave: "✓ 가입됨 • 탭하여 나가기",
    joinCircle: "서클 가입",

    topWalkingCircles: "인기 워킹 서클",
    joined: "가입됨",
    join: "가입",

    communityChallenges: "커뮤니티 챌린지",
    weekendChallenge: "주말 챌린지",
    weekendChallengeDescription:
      "이번 주말 커뮤니티와 함께 50,000걸음을 걸어보세요.",
    globalWalkingWeekend: "글로벌 워킹 주말",
    globalWalkingWeekendDescription:
      "커뮤니티가 100,000걸음에 도달하도록 도와주세요.",
    joinChallenge: "챌린지 참가",

    communityEvents: "커뮤니티 이벤트",
    globalEvent: "글로벌 워킹 주말",
    communityEvent: "커뮤니티 이벤트",
    globalEventDescription:
      "전 세계 Legathon 회원들과 함께 걸어보세요.",

    autismWalk: "자폐 인식 걷기",
    awarenessEvent: "인식 이벤트",
    autismDescription:
      "자폐 인식 향상을 위해 함께 걸어보세요.",

    heartWalk: "심장 건강 걷기",
    wellnessEvent: "웰니스 이벤트",
    heartDescription:
      "심장 건강을 위한 커뮤니티 걷기에 참여하세요.",

    joinEvent: "이벤트 참가",

    aiCommunityCoach: "Legathon AI 커뮤니티 코치",
    walkSmarter: "함께 더 스마트하게 걸으세요",
    aiDescription:
      "Legathon AI에서 격려, 커뮤니티 인사이트, 걷기 동기 부여 및 개인화된 텍스트 가이드를 받아보세요.",
    openAICoach: "AI 커뮤니티 코치 열기",

    friendsWalking: "지금 걷고 있는 친구",
    friendsOnlineCount:
      "친구 {total}명 중 {online}명 온라인",
    steps: "걸음",
    cheered: "✓ 응원함",
    cheer: "👏 응원",
    remove: "삭제",

    friendRequests: "친구 요청",
    wantsWalk: "함께 걷고 싶어 합니다",
    accept: "수락",
    decline: "거절",
    friendAdded: "✓ 친구 추가됨",
    requestDeclined: "요청 거절됨",

    followingTitle: "팔로잉",
    followingSubtitle:
      "팔로우하는 워커와 서클",
    follow: "팔로우",
    followingButton: "✓ 팔로잉",

    legendWalker: "레전드 워커",
    masterExplorer: "마스터 탐험가",
    walkingCircle: "워킹 서클",

    signInRequired: "로그인 필요",
    signInCircle:
      "워킹 서클에 가입하려면 로그인하세요.",
    unableUpdateCircle:
      "서클을 업데이트할 수 없습니다",
    tryAgain: "다시 시도해 주세요.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "AI 커뮤니티 코치 화면 연결 준비가 완료되었습니다.",
  },

  zh: {
    back: "‹ 返回",
    community: "Legathon 社区",
    tagline: "行走 • 鼓励 • 一起成长",

    walkersOnline: "在线步行者",
    friendsOnline: "好友在线",

    global: "全球",
    friends: "好友",
    following: "关注",

    activityCenter: "活动中心",
    unreadUpdates: "{count} 条未读更新",
    allCaughtUp: "已查看全部更新",

    walkingStreak: "连续步行",
    walkingStreakText:
      "多位步行者今天延续了他们的连续步行记录。",
    journeyCompleted: "旅程已完成",
    journeyCompletedText:
      "一位社区成员完成了中国长城旅程。",
    communityGrowing: "社区正在成长",
    communityGrowingText:
      "新的步行者加入了 Legathon 社区。",

    read: "✓ 已读",
    markRead: "点击标记为已读",

    communityFeed: "社区动态",
    communityFeedSubtitle:
      "为世界各地的步行者喝彩",

    completedCheckpoint: "完成了检查点 3",
    walkedSteps: "走了 14,582 步",
    earnedStamp: "获得了新的旅程印章",

    celebrate: "庆祝",
    encourage: "鼓励",
    support: "支持",
    sent: "✓ 已发送",
    comments: "💬 评论",
    journey: "旅程",

    walkingCircles: "步行圈",
    walkingCirclesSubtitle:
      "找到属于你的步行社区",
    loadingCircles: "正在加载步行圈...",
    noCircles: "目前还没有可用的步行圈。",
    unableLoadCircles: "无法加载步行圈。",
    retry: "重试",
    members: "成员",
    updating: "正在更新...",
    joinedLeave: "✓ 已加入 • 点击退出",
    joinCircle: "加入步行圈",

    topWalkingCircles: "热门步行圈",
    joined: "已加入",
    join: "加入",

    communityChallenges: "社区挑战",
    weekendChallenge: "周末挑战",
    weekendChallengeDescription:
      "本周末一起完成 50,000 个社区步数。",
    globalWalkingWeekend: "全球步行周末",
    globalWalkingWeekendDescription:
      "帮助社区达到 100,000 步。",
    joinChallenge: "加入挑战",

    communityEvents: "社区活动",
    globalEvent: "全球步行周末",
    communityEvent: "社区活动",
    globalEventDescription:
      "与世界各地的 Legathon 成员一起步行。",

    autismWalk: "自闭症认知步行活动",
    awarenessEvent: "公益认知活动",
    autismDescription:
      "一起步行，支持自闭症认知。",

    heartWalk: "心脏健康步行",
    wellnessEvent: "健康活动",
    heartDescription:
      "加入社区，一起进行有益心脏健康的步行活动。",

    joinEvent: "加入活动",

    aiCommunityCoach: "Legathon AI 社区教练",
    walkSmarter: "一起更聪明地步行",
    aiDescription:
      "通过 Legathon AI 获得鼓励、社区洞察、步行动力和个性化文字指导。",
    openAICoach: "打开 AI 社区教练",

    friendsWalking: "正在步行的好友",
    friendsOnlineCount:
      "{total} 位好友中有 {online} 位在线",
    steps: "步",
    cheered: "✓ 已鼓励",
    cheer: "👏 鼓励",
    remove: "移除",

    friendRequests: "好友请求",
    wantsWalk: "想和你一起步行",
    accept: "接受",
    decline: "拒绝",
    friendAdded: "✓ 已添加好友",
    requestDeclined: "已拒绝请求",

    followingTitle: "关注",
    followingSubtitle:
      "你关注的步行者和步行圈",
    follow: "关注",
    followingButton: "✓ 已关注",

    legendWalker: "传奇步行者",
    masterExplorer: "探索大师",
    walkingCircle: "步行圈",

    signInRequired: "需要登录",
    signInCircle:
      "请登录后加入步行圈。",
    unableUpdateCircle: "无法更新步行圈",
    tryAgain: "请重试。",

    aiTitle: "Legathon AI",
    aiNavigation:
      "AI 社区教练导航已准备好连接。",
  },

  it: {
    back: "‹ Indietro",
    community: "Community Legathon",
    tagline: "Cammina • Incoraggia • Cresci Insieme",

    walkersOnline: "CAMMINATORI ONLINE",
    friendsOnline: "Amici online",

    global: "GLOBALE",
    friends: "AMICI",
    following: "SEGUITI",

    activityCenter: "Centro Attività",
    unreadUpdates: "{count} aggiornamenti non letti",
    allCaughtUp: "Sei aggiornato",

    walkingStreak: "Serie di Camminate",
    walkingStreakText:
      "Diversi camminatori hanno prolungato oggi la loro serie.",
    journeyCompleted: "Viaggio Completato",
    journeyCompletedText:
      "Un membro della community ha completato il viaggio della Grande Muraglia Cinese.",
    communityGrowing: "Community in Crescita",
    communityGrowingText:
      "Nuovi camminatori si sono uniti alla community Legathon.",

    read: "✓ Letto",
    markRead: "Tocca per segnare come letto",

    communityFeed: "Feed della Community",
    communityFeedSubtitle:
      "Celebra i camminatori di tutto il mondo",

    completedCheckpoint: "ha completato il Checkpoint 3",
    walkedSteps: "ha camminato 14.582 passi",
    earnedStamp: "ha ottenuto un nuovo timbro di viaggio",

    celebrate: "Festeggia",
    encourage: "Incoraggia",
    support: "Supporta",
    sent: "✓ Inviato",
    comments: "💬 Commenti",
    journey: "VIAGGIO",

    walkingCircles: "Cerchi di Cammino",
    walkingCirclesSubtitle:
      "Trova la tua community di cammino",
    loadingCircles: "Caricamento dei cerchi di cammino...",
    noCircles:
      "Non ci sono ancora cerchi di cammino disponibili.",
    unableLoadCircles:
      "Impossibile caricare i cerchi di cammino.",
    retry: "Riprova",
    members: "membri",
    updating: "Aggiornamento...",
    joinedLeave: "✓ Iscritto • Tocca per uscire",
    joinCircle: "Unisciti al Cerchio",

    topWalkingCircles: "Migliori Cerchi di Cammino",
    joined: "Iscritto",
    join: "Unisciti",

    communityChallenges: "Sfide della Community",
    weekendChallenge: "Sfida del Weekend",
    weekendChallengeDescription:
      "Cammina 50.000 passi comunitari questo weekend.",
    globalWalkingWeekend: "Weekend Globale di Cammino",
    globalWalkingWeekendDescription:
      "Aiuta la community a raggiungere 100.000 passi.",
    joinChallenge: "Partecipa alla Sfida",

    communityEvents: "Eventi della Community",
    globalEvent: "Weekend Globale di Cammino",
    communityEvent: "Evento Community",
    globalEventDescription:
      "Cammina con i membri Legathon di tutto il mondo.",

    autismWalk: "Camminata per la Consapevolezza dell’Autismo",
    awarenessEvent: "Evento di Sensibilizzazione",
    autismDescription:
      "Camminiamo insieme a sostegno della consapevolezza sull’autismo.",

    heartWalk: "Camminata per la Salute del Cuore",
    wellnessEvent: "Evento Benessere",
    heartDescription:
      "Unisciti alla community per una camminata salutare per il cuore.",

    joinEvent: "Partecipa all’Evento",

    aiCommunityCoach: "Coach Community Legathon AI",
    walkSmarter: "Camminiamo Meglio Insieme",
    aiDescription:
      "Ricevi incoraggiamento, informazioni dalla community, motivazione e guida personalizzata via testo da Legathon AI.",
    openAICoach: "Apri AI Community Coach",

    friendsWalking: "Amici che Camminano Ora",
    friendsOnlineCount:
      "{online} di {total} amici online",
    steps: "passi",
    cheered: "✓ Incoraggiato",
    cheer: "👏 Incoraggia",
    remove: "Rimuovi",

    friendRequests: "Richieste di Amicizia",
    wantsWalk: "Vuole camminare con te",
    accept: "Accetta",
    decline: "Rifiuta",
    friendAdded: "✓ Amico Aggiunto",
    requestDeclined: "Richiesta Rifiutata",

    followingTitle: "Seguiti",
    followingSubtitle:
      "Camminatori e cerchi che segui",
    follow: "Segui",
    followingButton: "✓ Seguito",

    legendWalker: "Camminatore Leggendario",
    masterExplorer: "Esploratore Maestro",
    walkingCircle: "Cerchio di Cammino",

    signInRequired: "Accesso Richiesto",
    signInCircle:
      "Accedi per unirti a un cerchio di cammino.",
    unableUpdateCircle:
      "Impossibile Aggiornare il Cerchio",
    tryAgain: "Riprova.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "La navigazione dell’AI Community Coach è pronta per essere collegata.",
  },

  ar: {
    back: "رجوع ›",
    community: "مجتمع Legathon",
    tagline: "امشِ • شجّع • تطوّروا معًا",

    walkersOnline: "المشاة المتصلون",
    friendsOnline: "الأصدقاء متصلون",

    global: "العالمي",
    friends: "الأصدقاء",
    following: "المتابَعون",

    activityCenter: "مركز النشاط",
    unreadUpdates: "{count} تحديثات غير مقروءة",
    allCaughtUp: "تمت قراءة جميع التحديثات",

    walkingStreak: "سلسلة المشي",
    walkingStreakText:
      "واصل عدد من المشاة سلسلة المشي الخاصة بهم اليوم.",
    journeyCompleted: "اكتملت الرحلة",
    journeyCompletedText:
      "أكمل أحد أعضاء المجتمع رحلة سور الصين العظيم.",
    communityGrowing: "المجتمع ينمو",
    communityGrowingText:
      "انضم مشاة جدد إلى مجتمع Legathon.",

    read: "✓ مقروء",
    markRead: "اضغط لتحديده كمقروء",

    communityFeed: "موجز المجتمع",
    communityFeedSubtitle:
      "احتفل بالمشاة حول العالم",

    completedCheckpoint: "أكمل نقطة التحقق 3",
    walkedSteps: "مشى 14,582 خطوة",
    earnedStamp: "حصل على ختم رحلة جديد",

    celebrate: "احتفل",
    encourage: "شجّع",
    support: "ادعم",
    sent: "✓ تم الإرسال",
    comments: "💬 التعليقات",
    journey: "الرحلة",

    walkingCircles: "دوائر المشي",
    walkingCirclesSubtitle:
      "اعثر على مجتمع المشي المناسب لك",
    loadingCircles: "جارٍ تحميل دوائر المشي...",
    noCircles:
      "لا توجد دوائر مشي متاحة حتى الآن.",
    unableLoadCircles:
      "تعذر تحميل دوائر المشي.",
    retry: "إعادة المحاولة",
    members: "أعضاء",
    updating: "جارٍ التحديث...",
    joinedLeave: "✓ منضم • اضغط للمغادرة",
    joinCircle: "انضم إلى الدائرة",

    topWalkingCircles: "أفضل دوائر المشي",
    joined: "منضم",
    join: "انضم",

    communityChallenges: "تحديات المجتمع",
    weekendChallenge: "تحدي عطلة نهاية الأسبوع",
    weekendChallengeDescription:
      "امشوا 50,000 خطوة مجتمعية في عطلة نهاية الأسبوع.",
    globalWalkingWeekend: "عطلة المشي العالمية",
    globalWalkingWeekendDescription:
      "ساعد المجتمع في الوصول إلى 100,000 خطوة.",
    joinChallenge: "انضم إلى التحدي",

    communityEvents: "فعاليات المجتمع",
    globalEvent: "عطلة المشي العالمية",
    communityEvent: "فعالية مجتمعية",
    globalEventDescription:
      "امشِ مع أعضاء Legathon حول العالم.",

    autismWalk: "مسيرة التوعية بالتوحد",
    awarenessEvent: "فعالية توعوية",
    autismDescription:
      "امشوا معًا دعمًا للتوعية بالتوحد.",

    heartWalk: "مسيرة صحة القلب",
    wellnessEvent: "فعالية العافية",
    heartDescription:
      "انضم إلى المجتمع في مسيرة مفيدة لصحة القلب.",

    joinEvent: "انضم إلى الفعالية",

    aiCommunityCoach: "مدرب مجتمع Legathon AI",
    walkSmarter: "امشوا بذكاء معًا",
    aiDescription:
      "احصل على التشجيع ورؤى المجتمع والتحفيز وإرشادات نصية مخصصة من Legathon AI.",
    openAICoach: "فتح مدرب المجتمع بالذكاء الاصطناعي",

    friendsWalking: "الأصدقاء الذين يمشون الآن",
    friendsOnlineCount:
      "{online} من أصل {total} أصدقاء متصلون",
    steps: "خطوة",
    cheered: "✓ تم التشجيع",
    cheer: "👏 شجّع",
    remove: "إزالة",

    friendRequests: "طلبات الصداقة",
    wantsWalk: "يريد المشي معك",
    accept: "قبول",
    decline: "رفض",
    friendAdded: "✓ تمت إضافة الصديق",
    requestDeclined: "تم رفض الطلب",

    followingTitle: "المتابَعون",
    followingSubtitle:
      "المشاة والدوائر التي تتابعها",
    follow: "متابعة",
    followingButton: "✓ تتم المتابعة",

    legendWalker: "المشي الأسطوري",
    masterExplorer: "المستكشف المحترف",
    walkingCircle: "دائرة مشي",

    signInRequired: "تسجيل الدخول مطلوب",
    signInCircle:
      "يرجى تسجيل الدخول للانضمام إلى دائرة مشي.",
    unableUpdateCircle:
      "تعذر تحديث الدائرة",
    tryAgain: "يرجى المحاولة مرة أخرى.",

    aiTitle: "Legathon AI",
    aiNavigation:
      "التنقل إلى مدرب المجتمع بالذكاء الاصطناعي جاهز للربط.",
  },
};

// Use English as fallback for any missing keys.
TEXT.es = { ...TEXT.en, ...TEXT.es };
TEXT.fr = { ...TEXT.en, ...TEXT.fr };
TEXT.de = { ...TEXT.en, ...TEXT.de };
TEXT.pt = { ...TEXT.en, ...TEXT.pt };
TEXT.ja = { ...TEXT.en, ...TEXT.ja };
TEXT.ko = { ...TEXT.en, ...TEXT.ko };
TEXT.zh = { ...TEXT.en, ...TEXT.zh };
TEXT.it = { ...TEXT.en, ...TEXT.it };
TEXT.ar = { ...TEXT.en, ...TEXT.ar };

// ============================================================
// HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}

function fillTemplate(value, values = {}) {
  let result = String(value ?? "");

  Object.entries(values).forEach(([key, replacement]) => {
    result = result.replaceAll(
      `{${key}}`,
      String(replacement)
    );
  });

  return result;
}

function safeInteger(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.floor(number));
}

// ============================================================
// STATIC DATA
//
// IDs and canonical source values remain unchanged.
// ============================================================

const COMMUNITY_FEED = [
  {
    id: "feed-1",
    icon: "🏯",
    name: "James Wilson",
    activityKey: "completedCheckpoint",
    journey: "Great Wall of China",
    actionKey: "celebrate",
    actionIcon: "🎉",
  },
  {
    id: "feed-2",
    icon: "🌿",
    name: "Maria Johnson",
    activityKey: "walkedSteps",
    journey: "Amazon Rainforest",
    actionKey: "encourage",
    actionIcon: "👏",
  },
  {
    id: "feed-3",
    icon: "🏅",
    name: "Sarah Thompson",
    activityKey: "earnedStamp",
    journey: "Selma to Montgomery",
    actionKey: "support",
    actionIcon: "💪",
  },
];

const FRIENDS_WALKING = [
  {
    id: "james-wilson",
    name: "James Wilson",
    journey: "Amazon Rainforest",
    steps: 8240,
    icon: "🌿",
    isOnline: true,
  },
  {
    id: "maria-johnson",
    name: "Maria Johnson",
    journey: "Great Wall of China",
    steps: 14582,
    icon: "🏯",
    isOnline: true,
  },
];

const FRIEND_REQUEST_PERSON = {
  id: "daniel-brooks",
  name: "Daniel Brooks",
  journey: "Selma to Montgomery",
  steps: 6840,
  icon: "👟",
  isOnline: true,
};

const ACTIVITIES = [
  {
    id: "activity-1",
    icon: "🔥",
    titleKey: "walkingStreak",
    textKey: "walkingStreakText",
  },
  {
    id: "activity-2",
    icon: "🏆",
    titleKey: "journeyCompleted",
    textKey: "journeyCompletedText",
  },
  {
    id: "activity-3",
    icon: "🌍",
    titleKey: "communityGrowing",
    textKey: "communityGrowingText",
  },
];

const CHALLENGES = [
  {
    id: "weekend-challenge",
    icon: "🔥",
    titleKey: "weekendChallenge",
    descriptionKey: "weekendChallengeDescription",
    progress: 42600,
    target: 50000,
    reward: 500,
  },
  {
    id: "global-walking-weekend",
    icon: "🌍",
    titleKey: "globalWalkingWeekend",
    descriptionKey: "globalWalkingWeekendDescription",
    progress: 31000,
    target: 100000,
    reward: 1000,
  },
];

const EVENTS = [
  {
    id: "global-event",
    icon: "🌎",
    titleKey: "globalEvent",
    dateKey: "communityEvent",
    descriptionKey: "globalEventDescription",
  },
  {
    id: "autism-event",
    icon: "🧩",
    titleKey: "autismWalk",
    dateKey: "awarenessEvent",
    descriptionKey: "autismDescription",
  },
  {
    id: "heart-event",
    icon: "❤️",
    titleKey: "heartWalk",
    dateKey: "wellnessEvent",
    descriptionKey: "heartDescription",
  },
];

const FOLLOW_SUGGESTIONS = [
  {
    id: "maya-runs",
    icon: "🏆",
    name: "MayaRuns",
    subtitleKey: "legendWalker",
  },
  {
    id: "history-hunter",
    icon: "🔥",
    name: "HistoryHunter",
    subtitleKey: "masterExplorer",
  },
  {
    id: "world-explorers",
    icon: "🌍",
    name: "World Explorers",
    subtitleKey: "walkingCircle",
  },
];

// ============================================================
// SMALL COMPONENTS
// ============================================================

function CommunityTab({
  label,
  selected,
  onPress,
  badge,
  rtl,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selected && styles.tabButtonSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.tabButtonText,
          selected && styles.tabButtonTextSelected,
          rtl && styles.rtlText,
        ]}
      >
        {label}
      </Text>

      {!!badge && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
  rtl,
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>{icon}</Text>

        <Text
          style={[
            styles.sectionTitle,
            rtl && styles.rtlText,
          ]}
        >
          {title}
        </Text>
      </View>

      {!!subtitle && (
        <Text
          style={[
            styles.sectionSubtitle,
            rtl && styles.rtlText,
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function CommunityScreen({
  navigation,
  goBack,
  goToAICoach,
  goToComments,
  language = "en",
}) {
  const languageCode = normalizeLanguage(language);
  const isRTL = languageCode === "ar";

  const t = useCallback(
    (key, values) => {
      const value =
        TEXT[languageCode]?.[key] ??
        TEXT.en[key] ??
        key;

      return values
        ? fillTemplate(value, values)
        : value;
    },
    [languageCode]
  );

  // ==========================================================
  // TAB
  // ==========================================================

  const [selectedTab, setSelectedTab] =
    useState("global");

  // ==========================================================
  // LOCAL COMMUNITY STATE
  // ==========================================================

  const [cheeredFriends, setCheeredFriends] =
    useState({});

  const [
    friendRequestStatus,
    setFriendRequestStatus,
  ] = useState("pending");

  const [acceptedFriends, setAcceptedFriends] =
    useState([]);

  const [joinedChallenges, setJoinedChallenges] =
    useState({});

  const [joinedEvents, setJoinedEvents] =
    useState({});

  const [feedReactions, setFeedReactions] =
    useState({});

  const [following, setFollowing] =
    useState({});

  const [readActivities, setReadActivities] =
    useState({});

  // ==========================================================
  // LIVE WALKING CIRCLES
  // ==========================================================

  const [walkingCircles, setWalkingCircles] =
    useState([]);

  const [joinedCircles, setJoinedCircles] =
    useState({});

  const [circlesLoading, setCirclesLoading] =
    useState(true);

  const [circlesError, setCirclesError] =
    useState("");

  const [circleActionId, setCircleActionId] =
    useState(null);

  const [refreshing, setRefreshing] =
    useState(false);

  // ==========================================================
  // LOAD LOCAL STATE
  // ==========================================================

  const loadCommunityState = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(
        COMMUNITY_STATE_KEY
      );

      if (!saved) {
        return;
      }

      const data = JSON.parse(saved);

      if (!data || typeof data !== "object") {
        return;
      }

      setCheeredFriends(data.cheeredFriends || {});

      setFriendRequestStatus(
        data.friendRequestStatus || "pending"
      );

      setAcceptedFriends(
        Array.isArray(data.acceptedFriends)
          ? data.acceptedFriends
          : []
      );

      setJoinedChallenges(data.joinedChallenges || {});
      setJoinedEvents(data.joinedEvents || {});
      setFeedReactions(data.feedReactions || {});
      setFollowing(data.following || {});
      setReadActivities(data.readActivities || {});
    } catch (error) {
      console.log("COMMUNITY LOAD ERROR:", error);
    }
  }, []);

  // ==========================================================
  // SAVE LOCAL STATE
  // ==========================================================

  const persistCommunityState = useCallback(
    async (overrides = {}) => {
      try {
        const stateToSave = {
          cheeredFriends,
          friendRequestStatus,
          acceptedFriends,
          joinedChallenges,
          joinedEvents,
          feedReactions,
          following,
          readActivities,
          ...overrides,
        };

        await AsyncStorage.setItem(
          COMMUNITY_STATE_KEY,
          JSON.stringify(stateToSave)
        );
      } catch (error) {
        console.log("COMMUNITY SAVE ERROR:", error);
      }
    },
    [
      cheeredFriends,
      friendRequestStatus,
      acceptedFriends,
      joinedChallenges,
      joinedEvents,
      feedReactions,
      following,
      readActivities,
    ]
  );

  // ==========================================================
  // WALKING CIRCLES
  // ==========================================================

  const loadWalkingCircles = useCallback(
    async ({ showLoader = true } = {}) => {
      try {
        if (showLoader) {
          setCirclesLoading(true);
        }

        setCirclesError("");

        const {
          data: circleData,
          error: circleError,
        } = await supabase
          .from("walking_circles")
          .select(
            [
              "id",
              "name",
              "icon",
              "base_member_count",
              "live_member_count",
              "sort_order",
              "active",
            ].join(",")
          )
          .eq("active", true)
          .order("sort_order", {
            ascending: true,
          });

        if (circleError) {
          throw circleError;
        }

        const formatted = (circleData || []).map(
          (circle) => {
            const baseMembers = safeInteger(
              circle?.base_member_count
            );

            const liveMembers = safeInteger(
              circle?.live_member_count
            );

            return {
              id: String(circle?.id || ""),
              name:
                circle?.name ||
                TEXT.en.walkingCircle,
              icon: circle?.icon || "👣",
              baseMembers,
              liveMembers,
              members: baseMembers + liveMembers,
            };
          }
        );

        setWalkingCircles(formatted);

        const {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.log(
            "Community user lookup:",
            userError
          );
        }

        const user = userData?.user || null;

        if (!user) {
          setJoinedCircles({});
          return;
        }

        const {
          data: membershipData,
          error: membershipError,
        } = await supabase
          .from("walking_circle_members")
          .select("circle_id")
          .eq("user_id", user.id);

        if (membershipError) {
          throw membershipError;
        }

        const membershipMap = {};

        (membershipData || []).forEach(
          (membership) => {
            if (membership?.circle_id) {
              membershipMap[
                membership.circle_id
              ] = true;
            }
          }
        );

        setJoinedCircles(membershipMap);
      } catch (error) {
        console.log(
          "WALKING CIRCLES LOAD ERROR:",
          error
        );

        setCirclesError(
          error?.message || t("unableLoadCircles")
        );
      } finally {
        if (showLoader) {
          setCirclesLoading(false);
        }
      }
    },
    [t]
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void loadCommunityState();
    void loadWalkingCircles();
  }, [loadCommunityState, loadWalkingCircles]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        loadCommunityState(),
        loadWalkingCircles({
          showLoader: false,
        }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadCommunityState, loadWalkingCircles]);

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    if (typeof goBack === "function") {
      goBack();
      return;
    }

    navigation?.goBack?.();
  };

  // ==========================================================
  // FRIEND ACTIONS
  // ==========================================================

  const handleCheer = async (friendId) => {
    const updated = {
      ...cheeredFriends,
      [friendId]: true,
    };

    setCheeredFriends(updated);

    await persistCommunityState({
      cheeredFriends: updated,
    });
  };

  const handleAcceptFriend = async () => {
    const alreadyExists = acceptedFriends.some(
      (friend) =>
        friend.id === FRIEND_REQUEST_PERSON.id
    );

    const updatedFriends = alreadyExists
      ? acceptedFriends
      : [...acceptedFriends, FRIEND_REQUEST_PERSON];

    setFriendRequestStatus("accepted");
    setAcceptedFriends(updatedFriends);

    await persistCommunityState({
      friendRequestStatus: "accepted",
      acceptedFriends: updatedFriends,
    });
  };

  const handleDeclineFriend = async () => {
    setFriendRequestStatus("declined");

    await persistCommunityState({
      friendRequestStatus: "declined",
    });
  };

  const handleRemoveFriend = async (friendId) => {
    const updatedFriends = acceptedFriends.filter(
      (friend) => friend.id !== friendId
    );

    setAcceptedFriends(updatedFriends);

    await persistCommunityState({
      acceptedFriends: updatedFriends,
    });
  };

  // ==========================================================
  // CHALLENGES / EVENTS
  // ==========================================================

  const handleJoinChallenge = async (
    challengeId
  ) => {
    const updated = {
      ...joinedChallenges,
      [challengeId]:
        !joinedChallenges[challengeId],
    };

    setJoinedChallenges(updated);

    await persistCommunityState({
      joinedChallenges: updated,
    });
  };

  const handleJoinEvent = async (eventId) => {
    const updated = {
      ...joinedEvents,
      [eventId]: !joinedEvents[eventId],
    };

    setJoinedEvents(updated);

    await persistCommunityState({
      joinedEvents: updated,
    });
  };

  // ==========================================================
  // FEED
  // ==========================================================

  const handleFeedReaction = async (postId) => {
    const updated = {
      ...feedReactions,
      [postId]: true,
    };

    setFeedReactions(updated);

    await persistCommunityState({
      feedReactions: updated,
    });
  };

  const handleOpenComments = (item) => {
    const localizedActivity = t(item.activityKey);

    const post = {
      ...item,
      activity: localizedActivity,
      text: `${item.name} ${localizedActivity}`,
    };

    if (typeof goToComments === "function") {
      goToComments(post);
      return;
    }

    navigation?.navigate?.("CommunityComments", {
      postId: item.id,
      postName: item.name,
      postText: post.text,
      postJourney: item.journey,
    });
  };

  // ==========================================================
  // WALKING CIRCLE JOIN / LEAVE
  // ==========================================================

  const handleJoinCircle = async (circleId) => {
    if (circleActionId) {
      return;
    }

    try {
      setCircleActionId(circleId);

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const user = userData?.user;

      if (!user) {
        Alert.alert(
          t("signInRequired"),
          t("signInCircle")
        );

        return;
      }

      const alreadyJoined = Boolean(
        joinedCircles[circleId]
      );

      if (alreadyJoined) {
        const { error } = await supabase
          .from("walking_circle_members")
          .delete()
          .eq("circle_id", circleId)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("walking_circle_members")
          .insert({
            circle_id: circleId,
            user_id: user.id,
          });

        if (error && error.code !== "23505") {
          throw error;
        }
      }

      await loadWalkingCircles({
        showLoader: false,
      });
    } catch (error) {
      console.log(
        "WALKING CIRCLE ACTION ERROR:",
        error
      );

      Alert.alert(
        t("unableUpdateCircle"),
        error?.message || t("tryAgain")
      );
    } finally {
      setCircleActionId(null);
    }
  };

  // ==========================================================
  // FOLLOWING
  // ==========================================================

  const handleToggleFollow = async (id) => {
    const updated = {
      ...following,
      [id]: !following[id],
    };

    setFollowing(updated);

    await persistCommunityState({
      following: updated,
    });
  };

  // ==========================================================
  // ACTIVITY
  // ==========================================================

  const handleActivityRead = async (
    activityId
  ) => {
    const updated = {
      ...readActivities,
      [activityId]: true,
    };

    setReadActivities(updated);

    await persistCommunityState({
      readActivities: updated,
    });
  };

  // ==========================================================
  // AI COACH
  // ==========================================================

  const handleOpenAICoach = () => {
    if (typeof goToAICoach === "function") {
      goToAICoach();
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate("AIWellness");
      return;
    }

    Alert.alert(
      t("aiTitle"),
      t("aiNavigation")
    );
  };

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const allFriends = useMemo(
    () => [
      ...FRIENDS_WALKING,
      ...acceptedFriends,
    ],
    [acceptedFriends]
  );

  const totalFriends = allFriends.length;

  const onlineFriends = allFriends.filter(
    (friend) => friend.isOnline !== false
  ).length;

  const unreadActivityCount = ACTIVITIES.filter(
    (item) => !readActivities[item.id]
  ).length;

  const pendingFriendRequests =
    friendRequestStatus === "pending" ? 1 : 0;

  const topWalkingCircles = useMemo(() => {
    return [...walkingCircles]
      .sort((a, b) => b.members - a.members)
      .slice(0, 3)
      .map((circle, index) => ({
        ...circle,
        rank: index + 1,
      }));
  }, [walkingCircles]);

  // ==========================================================
  // FRIENDS TAB
  // ==========================================================

  const renderFriendsTab = () => (
    <>
      <SectionTitle
        icon="👟"
        title={t("friendsWalking")}
        subtitle={t("friendsOnlineCount", {
          online: onlineFriends,
          total: totalFriends,
        })}
        rtl={isRTL}
      />

      {allFriends.map((friend) => {
        const isAcceptedFriend =
          acceptedFriends.some(
            (accepted) =>
              accepted.id === friend.id
          );

        return (
          <View
            key={friend.id}
            style={styles.friendCard}
          >
            <View style={styles.friendIconWrap}>
              <Text style={styles.friendIcon}>
                {friend.icon}
              </Text>
            </View>

            <View style={styles.friendInfo}>
              <View style={styles.friendNameRow}>
                <Text
                  style={[
                    styles.friendName,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {friend.name}
                </Text>

                {friend.isOnline !== false && (
                  <View style={styles.onlineDot} />
                )}
              </View>

              <Text
                style={[
                  styles.friendJourney,
                  isRTL && styles.rtlText,
                ]}
              >
                {friend.journey}
              </Text>

              <Text
                style={[
                  styles.friendSteps,
                  isRTL && styles.rtlText,
                ]}
              >
                {safeInteger(
                  friend.steps
                ).toLocaleString()}{" "}
                {t("steps")}
              </Text>
            </View>

            <View style={styles.friendActions}>
              <TouchableOpacity
                style={[
                  styles.cheerButton,
                  cheeredFriends[friend.id] &&
                    styles.cheerButtonActive,
                ]}
                onPress={() =>
                  handleCheer(friend.id)
                }
                disabled={Boolean(
                  cheeredFriends[friend.id]
                )}
              >
                <Text
                  style={[
                    styles.cheerButtonText,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {cheeredFriends[friend.id]
                    ? t("cheered")
                    : t("cheer")}
                </Text>
              </TouchableOpacity>

              {isAcceptedFriend && (
                <TouchableOpacity
                  style={
                    styles.removeFriendButton
                  }
                  onPress={() =>
                    handleRemoveFriend(friend.id)
                  }
                >
                  <Text
                    style={[
                      styles.removeFriendButtonText,
                      isRTL && styles.rtlText,
                    ]}
                  >
                    {t("remove")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      <SectionTitle
        icon="👥"
        title={t("friendRequests")}
        rtl={isRTL}
      />

      <View style={styles.requestCard}>
        <View style={styles.requestTop}>
          <View style={styles.requestIconWrap}>
            <Text style={styles.requestIcon}>
              👟
            </Text>
          </View>

          <View style={styles.requestInfo}>
            <Text
              style={[
                styles.requestName,
                isRTL && styles.rtlText,
              ]}
            >
              {FRIEND_REQUEST_PERSON.name}
            </Text>

            <Text
              style={[
                styles.requestText,
                isRTL && styles.rtlText,
              ]}
            >
              {t("wantsWalk")}
            </Text>
          </View>
        </View>

        {friendRequestStatus === "pending" ? (
          <View style={styles.requestButtonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAcceptFriend}
            >
              <Text
                style={[
                  styles.acceptButtonText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("accept")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDeclineFriend}
            >
              <Text
                style={[
                  styles.declineButtonText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("decline")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.requestStatusBox}>
            <Text
              style={[
                styles.requestStatusText,
                isRTL && styles.rtlText,
              ]}
            >
              {friendRequestStatus === "accepted"
                ? t("friendAdded")
                : t("requestDeclined")}
            </Text>
          </View>
        )}
      </View>
    </>
  );

  // ==========================================================
  // FOLLOWING TAB
  // ==========================================================

  const renderFollowingTab = () => (
    <>
      <SectionTitle
        icon="📡"
        title={t("followingTitle")}
        subtitle={t("followingSubtitle")}
        rtl={isRTL}
      />

      {FOLLOW_SUGGESTIONS.map((item) => (
        <View
          key={item.id}
          style={styles.followCard}
        >
          <View style={styles.followIconWrap}>
            <Text style={styles.followIcon}>
              {item.icon}
            </Text>
          </View>

          <View style={styles.followInfo}>
            <Text
              style={[
                styles.followName,
                isRTL && styles.rtlText,
              ]}
            >
              {item.name}
            </Text>

            <Text
              style={[
                styles.followSubtitle,
                isRTL && styles.rtlText,
              ]}
            >
              {t(item.subtitleKey)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.followButton,
              following[item.id] &&
                styles.followButtonActive,
            ]}
            onPress={() =>
              handleToggleFollow(item.id)
            }
          >
            <Text
              style={[
                styles.followButtonText,
                following[item.id] &&
                  styles.followButtonTextActive,
                isRTL && styles.rtlText,
              ]}
            >
              {following[item.id]
                ? t("followingButton")
                : t("follow")}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );

  // ==========================================================
  // GLOBAL TAB
  // ==========================================================

  const renderGlobalTab = () => (
    <>
      <SectionTitle
        icon="🔔"
        title={t("activityCenter")}
        subtitle={
          unreadActivityCount > 0
            ? t("unreadUpdates", {
                count: unreadActivityCount,
              })
            : t("allCaughtUp")
        }
        rtl={isRTL}
      />

      {ACTIVITIES.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.activityCard,
            readActivities[item.id] &&
              styles.activityCardRead,
          ]}
          onPress={() =>
            handleActivityRead(item.id)
          }
          disabled={Boolean(
            readActivities[item.id]
          )}
        >
          <View style={styles.activityIconWrap}>
            <Text style={styles.activityIcon}>
              {item.icon}
            </Text>
          </View>

          <View style={styles.activityContent}>
            <Text
              style={[
                styles.activityTitle,
                isRTL && styles.rtlText,
              ]}
            >
              {t(item.titleKey)}
            </Text>

            <Text
              style={[
                styles.activityText,
                isRTL && styles.rtlText,
              ]}
            >
              {t(item.textKey)}
            </Text>

            <Text
              style={[
                styles.activityStatus,
                readActivities[item.id] &&
                  styles.activityStatusRead,
                isRTL && styles.rtlText,
              ]}
            >
              {readActivities[item.id]
                ? t("read")
                : t("markRead")}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <SectionTitle
        icon="🌎"
        title={t("communityFeed")}
        subtitle={t("communityFeedSubtitle")}
        rtl={isRTL}
      />

      {COMMUNITY_FEED.map((item) => (
        <View
          key={item.id}
          style={styles.feedCard}
        >
          <View style={styles.feedTopRow}>
            <View style={styles.feedAvatar}>
              <Text style={styles.feedAvatarText}>
                {item.icon}
              </Text>
            </View>

            <View style={styles.feedInfo}>
              <Text
                style={[
                  styles.feedName,
                  isRTL && styles.rtlText,
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.feedActivity,
                  isRTL && styles.rtlText,
                ]}
              >
                {t(item.activityKey)}
              </Text>
            </View>
          </View>

          <View style={styles.feedJourneyBox}>
            <Text
              style={[
                styles.feedJourneyLabel,
                isRTL && styles.rtlText,
              ]}
            >
              {t("journey")}
            </Text>

            <Text
              style={[
                styles.feedJourneyText,
                isRTL && styles.rtlText,
              ]}
            >
              {item.journey}
            </Text>
          </View>

          <View style={styles.feedButtonRow}>
            <TouchableOpacity
              style={[
                styles.feedActionButton,
                feedReactions[item.id] &&
                  styles.feedActionButtonActive,
              ]}
              onPress={() =>
                handleFeedReaction(item.id)
              }
              disabled={Boolean(
                feedReactions[item.id]
              )}
            >
              <Text
                style={[
                  styles.feedActionText,
                  isRTL && styles.rtlText,
                ]}
              >
                {feedReactions[item.id]
                  ? t("sent")
                  : `${item.actionIcon} ${t(
                      item.actionKey
                    )}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.commentButton}
              onPress={() =>
                handleOpenComments(item)
              }
            >
              <Text
                style={[
                  styles.commentButtonText,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("comments")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <SectionTitle
        icon="👣"
        title={t("walkingCircles")}
        subtitle={t("walkingCirclesSubtitle")}
        rtl={isRTL}
      />

      {circlesLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator
            size="small"
            color="#80F2CE"
          />

          <Text
            style={[
              styles.loadingText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("loadingCircles")}
          </Text>
        </View>
      ) : circlesError ? (
        <View style={styles.errorCard}>
          <Text
            style={[
              styles.errorText,
              isRTL && styles.rtlText,
            ]}
          >
            {circlesError}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              loadWalkingCircles()
            }
          >
            <Text
              style={[
                styles.retryButtonText,
                isRTL && styles.rtlText,
              ]}
            >
              {t("retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : walkingCircles.length === 0 ? (
        <View style={styles.loadingCard}>
          <Text
            style={[
              styles.loadingText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("noCircles")}
          </Text>
        </View>
      ) : (
        <View style={styles.circleGrid}>
          {walkingCircles.map((circle) => {
            const joined = Boolean(
              joinedCircles[circle.id]
            );

            const updating =
              circleActionId === circle.id;

            return (
              <TouchableOpacity
                key={circle.id}
                style={[
                  styles.circleCard,
                  joined &&
                    styles.circleCardJoined,
                ]}
                onPress={() =>
                  handleJoinCircle(circle.id)
                }
                disabled={Boolean(circleActionId)}
                activeOpacity={0.85}
              >
                <Text style={styles.circleIcon}>
                  {circle.icon}
                </Text>

                <Text
                  style={[
                    styles.circleName,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {circle.name}
                </Text>

                <Text
                  style={[
                    styles.circleMembers,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {circle.members.toLocaleString()}{" "}
                  {t("members")}
                </Text>

                <Text
                  style={[
                    styles.circleJoinText,
                    joined &&
                      styles.circleJoinTextActive,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {updating
                    ? t("updating")
                    : joined
                    ? t("joinedLeave")
                    : t("joinCircle")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <SectionTitle
        icon="🏆"
        title={t("topWalkingCircles")}
        rtl={isRTL}
      />

      {topWalkingCircles.map((circle) => {
        const joined = Boolean(
          joinedCircles[circle.id]
        );

        const updating =
          circleActionId === circle.id;

        return (
          <View
            key={circle.id}
            style={styles.topCircleCard}
          >
            <View style={styles.topCircleRank}>
              <Text
                style={styles.topCircleRankText}
              >
                #{circle.rank}
              </Text>
            </View>

            <Text style={styles.topCircleIcon}>
              {circle.icon}
            </Text>

            <View style={styles.topCircleInfo}>
              <Text
                style={[
                  styles.topCircleName,
                  isRTL && styles.rtlText,
                ]}
              >
                {circle.name}
              </Text>

              <Text
                style={[
                  styles.topCircleMembers,
                  isRTL && styles.rtlText,
                ]}
              >
                {circle.members.toLocaleString()}{" "}
                {t("members")}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.topCircleButton,
                joined &&
                  styles.topCircleButtonJoined,
              ]}
              onPress={() =>
                handleJoinCircle(circle.id)
              }
              disabled={Boolean(circleActionId)}
            >
              <Text
                style={[
                  styles.topCircleButtonText,
                  joined &&
                    styles.topCircleButtonTextJoined,
                  isRTL && styles.rtlText,
                ]}
              >
                {updating
                  ? "..."
                  : joined
                  ? t("joined")
                  : t("join")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <SectionTitle
        icon="🎯"
        title={t("communityChallenges")}
        rtl={isRTL}
      />

      {CHALLENGES.map((challenge) => {
        const percentage =
          Math.min(
            safeInteger(challenge.progress) /
              Math.max(
                1,
                safeInteger(challenge.target)
              ),
            1
          ) * 100;

        return (
          <View
            key={challenge.id}
            style={styles.challengeCard}
          >
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeIcon}>
                {challenge.icon}
              </Text>

              <View
                style={styles.challengeHeaderInfo}
              >
                <Text
                  style={[
                    styles.challengeTitle,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t(challenge.titleKey)}
                </Text>

                <Text
                  style={[
                    styles.challengeDescription,
                    isRTL && styles.rtlText,
                  ]}
                >
                  {t(challenge.descriptionKey)}
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.challengeStats}>
              <Text style={styles.challengeProgressText}>
                {safeInteger(
                  challenge.progress
                ).toLocaleString()}{" "}
                /{" "}
                {safeInteger(
                  challenge.target
                ).toLocaleString()}
              </Text>

              <View style={styles.wcoinRewardRow}>
                <Image
                  source={WCOIN}
                  style={styles.wcoinRewardIcon}
                  resizeMode="contain"
                  accessibilityLabel="WCoin"
                />

                <Text style={styles.challengeReward}>
                  {safeInteger(
                    challenge.reward
                  ).toLocaleString()}{" "}
                  WCoin
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.aquaButton,
                joinedChallenges[challenge.id] &&
                  styles.joinedButton,
              ]}
              onPress={() =>
                handleJoinChallenge(challenge.id)
              }
            >
              <Text
                style={[
                  styles.aquaButtonText,
                  isRTL && styles.rtlText,
                ]}
              >
                {joinedChallenges[challenge.id]
                  ? t("joinedLeave")
                  : t("joinChallenge")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <SectionTitle
        icon="📅"
        title={t("communityEvents")}
        rtl={isRTL}
      />

      {EVENTS.map((event) => (
        <View
          key={event.id}
          style={styles.eventCard}
        >
          <View style={styles.eventIconWrap}>
            <Text style={styles.eventIcon}>
              {event.icon}
            </Text>
          </View>

          <View style={styles.eventInfo}>
            <Text
              style={[
                styles.eventTitle,
                isRTL && styles.rtlText,
              ]}
            >
              {t(event.titleKey)}
            </Text>

            <Text
              style={[
                styles.eventDate,
                isRTL && styles.rtlText,
              ]}
            >
              {t(event.dateKey)}
            </Text>

            <Text
              style={[
                styles.eventDescription,
                isRTL && styles.rtlText,
              ]}
            >
              {t(event.descriptionKey)}
            </Text>

            <TouchableOpacity
              style={[
                styles.goldButton,
                joinedEvents[event.id] &&
                  styles.joinedEventButton,
              ]}
              onPress={() =>
                handleJoinEvent(event.id)
              }
            >
              <Text
                style={[
                  styles.goldButtonText,
                  joinedEvents[event.id] &&
                    styles.joinedEventButtonText,
                  isRTL && styles.rtlText,
                ]}
              >
                {joinedEvents[event.id]
                  ? t("joinedLeave")
                  : t("joinEvent")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <SectionTitle
        icon="🧠"
        title={t("aiCommunityCoach")}
        rtl={isRTL}
      />

      <View style={styles.aiCard}>
        <View style={styles.aiIconWrap}>
          <Text style={styles.aiIcon}>✨</Text>
        </View>

        <Text
          style={[
            styles.aiTitle,
            isRTL && styles.rtlText,
          ]}
        >
          {t("walkSmarter")}
        </Text>

        <Text
          style={[
            styles.aiText,
            isRTL && styles.rtlText,
          ]}
        >
          {t("aiDescription")}
        </Text>

        <TouchableOpacity
          style={styles.aiCoachButton}
          onPress={handleOpenAICoach}
        >
          <Text
            style={[
              styles.aiCoachButtonText,
              isRTL && styles.rtlText,
            ]}
          >
            {t("openAICoach")}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ==========================================================
  // TAB ROUTER
  // ==========================================================

  const renderTabContent = () => {
    if (selectedTab === "friends") {
      return renderFriendsTab();
    }

    if (selectedTab === "following") {
      return renderFollowingTab();
    }

    return renderGlobalTab();
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={COMMUNITY_BG}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.backgroundOverlay} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#80F2CE"
            />
          }
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text
              style={[
                styles.backButtonText,
                isRTL && styles.rtlText,
              ]}
            >
              {t("back")}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.brandText,
              isRTL && styles.rtlText,
            ]}
          >
            LEGATHON WALK
          </Text>

          <Text
            style={[
              styles.mainTitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("community")}
          </Text>

          <Text
            style={[
              styles.mainSubtitle,
              isRTL && styles.rtlText,
            ]}
          >
            {t("tagline")}
          </Text>

          <View style={styles.onlineCard}>
            <View style={styles.flex}>
              <Text
                style={[
                  styles.onlineLabel,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("walkersOnline")}
              </Text>

              <Text
                style={[
                  styles.onlineCount,
                  isRTL && styles.rtlText,
                ]}
              >
                {onlineFriends.toLocaleString()}
              </Text>
            </View>

            <View style={styles.onlineRight}>
              <View style={styles.largeOnlineDot} />

              <Text
                style={[
                  styles.onlineStatus,
                  isRTL && styles.rtlText,
                ]}
              >
                {t("friendsOnline")}
              </Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            <CommunityTab
              label={t("global")}
              selected={selectedTab === "global"}
              onPress={() =>
                setSelectedTab("global")
              }
              badge={
                unreadActivityCount > 0
                  ? unreadActivityCount
                  : null
              }
              rtl={isRTL}
            />

            <CommunityTab
              label={t("friends")}
              selected={selectedTab === "friends"}
              onPress={() =>
                setSelectedTab("friends")
              }
              badge={pendingFriendRequests || null}
              rtl={isRTL}
            />

            <CommunityTab
              label={t("following")}
              selected={
                selectedTab === "following"
              }
              onPress={() =>
                setSelectedTab("following")
              }
              rtl={isRTL}
            />
          </View>

          {renderTabContent()}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020813",
  },

  flex: {
    flex: 1,
  },

  rtlText: {
    writingDirection: "rtl",
  },

  wcoinRewardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  wcoinRewardIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },

  background: {
    flex: 1,
    backgroundColor: "#020813",
  },

  backgroundImage: {
    opacity: 0.23,
  },

  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 8, 19, 0.78)",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 150,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 18,
    marginBottom: 6,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  brandText: {
    color: "#FFD343",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginTop: 6,
  },

  mainTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    marginTop: 8,
  },

  mainSubtitle: {
    color: "#AFC0D9",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 22,
  },

  onlineCard: {
    backgroundColor: "rgba(15, 29, 49, 0.96)",
    borderWidth: 1,
    borderColor: "#243856",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  onlineLabel: {
    color: "#8FA5C2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  onlineCount: {
    color: "#80F2CE",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 3,
  },

  onlineRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  largeOnlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#80F2CE",
    marginRight: 8,
  },

  onlineStatus: {
    color: "#DDE7F5",
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 1,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(10, 22, 38, 0.96)",
    borderRadius: 20,
    padding: 5,
    marginBottom: 24,
  },

  tabButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },

  tabButtonSelected: {
    backgroundColor: "#FFD343",
  },

  tabButtonText: {
    color: "#91A3BC",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  tabButtonTextSelected: {
    color: "#08111D",
  },

  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF5B5B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 4,
  },

  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  sectionHeader: {
    marginTop: 7,
    marginBottom: 13,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    fontSize: 23,
    marginRight: 9,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    flexShrink: 1,
  },

  sectionSubtitle: {
    color: "#8FA2BD",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    marginLeft: 34,
  },

  friendCard: {
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  friendIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1B2A42",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  friendIcon: {
    fontSize: 25,
  },

  friendInfo: {
    flex: 1,
    minWidth: 0,
  },

  friendNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  friendName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    flexShrink: 1,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#80F2CE",
    marginLeft: 7,
  },

  friendJourney: {
    color: "#AFC0D9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  friendSteps: {
    color: "#FFD343",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },

  friendActions: {
    alignItems: "center",
    marginLeft: 8,
  },

  cheerButton: {
    backgroundColor: "#182C45",
    borderWidth: 1,
    borderColor: "#35516F",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  cheerButtonActive: {
    backgroundColor: "#1F5C4E",
    borderColor: "#80F2CE",
  },

  cheerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  removeFriendButton: {
    marginTop: 7,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  removeFriendButtonText: {
    color: "#9AA9BF",
    fontSize: 11,
    fontWeight: "800",
  },

  requestCard: {
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },

  requestTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  requestIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1D2C44",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  requestIcon: {
    fontSize: 27,
  },

  requestInfo: {
    flex: 1,
  },

  requestName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  requestText: {
    color: "#AFC0D9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  requestButtonRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  acceptButton: {
    flex: 1,
    backgroundColor: "#80F2CE",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginRight: 6,
  },

  acceptButtonText: {
    color: "#06101D",
    fontSize: 14,
    fontWeight: "900",
  },

  declineButton: {
    flex: 1,
    backgroundColor: "#1D2B40",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginLeft: 6,
  },

  declineButtonText: {
    color: "#DCE5F2",
    fontSize: 14,
    fontWeight: "900",
  },

  requestStatusBox: {
    marginTop: 18,
    backgroundColor: "#172946",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  requestStatusText: {
    color: "#80F2CE",
    fontSize: 15,
    fontWeight: "900",
  },

  followCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  followIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1D2C44",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  followIcon: {
    fontSize: 25,
  },

  followInfo: {
    flex: 1,
    minWidth: 0,
  },

  followName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  followSubtitle: {
    color: "#AEBBD2",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  followButton: {
    borderWidth: 1.5,
    borderColor: "#80F2CE",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  followButtonActive: {
    backgroundColor: "#1F5C4E",
  },

  followButtonText: {
    color: "#80F2CE",
    fontSize: 12,
    fontWeight: "900",
  },

  followButtonTextActive: {
    color: "#FFFFFF",
  },

  activityCard: {
    flexDirection: "row",
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderWidth: 1,
    borderColor: "#263B58",
    borderRadius: 20,
    padding: 15,
    marginBottom: 11,
  },

  activityCardRead: {
    opacity: 0.6,
    borderColor: "#26364D",
  },

  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E304B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityIcon: {
    fontSize: 22,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  activityText: {
    color: "#AFC0D9",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 3,
  },

  activityStatus: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },

  activityStatusRead: {
    color: "#80F2CE",
  },

  feedCard: {
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
  },

  feedTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  feedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1C2B42",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  feedAvatarText: {
    fontSize: 24,
  },

  feedInfo: {
    flex: 1,
  },

  feedName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  feedActivity: {
    color: "#AFBED2",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  feedJourneyBox: {
    backgroundColor: "#0D1727",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },

  feedJourneyLabel: {
    color: "#8194AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  feedJourneyText: {
    color: "#FFD343",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3,
  },

  feedButtonRow: {
    flexDirection: "row",
    marginTop: 13,
  },

  feedActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#36506E",
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 4,
    alignItems: "center",
    marginRight: 5,
  },

  feedActionButtonActive: {
    backgroundColor: "#1F5C4E",
    borderColor: "#80F2CE",
  },

  feedActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  commentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FFD343",
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 4,
    alignItems: "center",
    marginLeft: 5,
  },

  commentButtonText: {
    color: "#FFD343",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  loadingCard: {
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    alignItems: "center",
  },

  loadingText: {
    color: "#AFC0D9",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },

  errorCard: {
    backgroundColor: "rgba(70, 23, 30, 0.94)",
    borderWidth: 1,
    borderColor: "#EF5B5B",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  errorText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFD343",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 12,
  },

  retryButtonText: {
    color: "#07111E",
    fontSize: 12,
    fontWeight: "900",
  },

  circleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  circleCard: {
    width: "48.5%",
    minHeight: 178,
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderWidth: 1,
    borderColor: "#263B58",
    borderRadius: 21,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  circleCardJoined: {
    borderWidth: 2,
    borderColor: "#80F2CE",
    backgroundColor: "#102A2B",
  },

  circleIcon: {
    fontSize: 34,
    marginBottom: 9,
  },

  circleName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  circleMembers: {
    color: "#91A4BD",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },

  circleJoinText: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },

  circleJoinTextActive: {
    color: "#80F2CE",
  },

  topCircleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 19,
    padding: 14,
    marginBottom: 10,
  },

  topCircleRank: {
    width: 36,
  },

  topCircleRankText: {
    color: "#FFD343",
    fontSize: 15,
    fontWeight: "900",
  },

  topCircleIcon: {
    fontSize: 25,
    marginRight: 10,
  },

  topCircleInfo: {
    flex: 1,
    minWidth: 0,
  },

  topCircleName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  topCircleMembers: {
    color: "#91A4BD",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  topCircleButton: {
    backgroundColor: "#FFD343",
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minWidth: 64,
    alignItems: "center",
  },

  topCircleButtonJoined: {
    backgroundColor: "#1F5C4E",
  },

  topCircleButtonText: {
    color: "#07111E",
    fontSize: 11,
    fontWeight: "900",
  },

  topCircleButtonTextJoined: {
    color: "#FFFFFF",
  },

  challengeCard: {
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
  },

  challengeHeader: {
    flexDirection: "row",
  },

  challengeIcon: {
    fontSize: 31,
    marginRight: 12,
  },

  challengeHeaderInfo: {
    flex: 1,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  challengeDescription: {
    color: "#AFC0D9",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 4,
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#26354A",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 17,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#80F2CE",
    borderRadius: 10,
  },

  challengeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  challengeProgressText: {
    color: "#B9C6D9",
    fontSize: 11,
    fontWeight: "800",
  },

  challengeReward: {
    color: "#FFD343",
    fontSize: 12,
    fontWeight: "900",
  },

  aquaButton: {
    backgroundColor: "#80F2CE",
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 8,
    alignItems: "center",
    marginTop: 15,
  },

  aquaButtonText: {
    color: "#06101D",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  joinedButton: {
    backgroundColor: "#66CDB1",
  },

  eventCard: {
    flexDirection: "row",
    backgroundColor: "rgba(16, 29, 49, 0.97)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 13,
  },

  eventIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E2F48",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  eventIcon: {
    fontSize: 27,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  eventDate: {
    color: "#FFD343",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },

  eventDescription: {
    color: "#AFC0D9",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 6,
  },

  goldButton: {
    backgroundColor: "#FFD343",
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: "center",
    marginTop: 13,
  },

  goldButtonText: {
    color: "#07111E",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  joinedEventButton: {
    backgroundColor: "#1F5C4E",
  },

  joinedEventButtonText: {
    color: "#FFFFFF",
  },

  aiCard: {
    backgroundColor: "rgba(16, 29, 49, 0.98)",
    borderWidth: 1,
    borderColor: "#3A5C68",
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
    marginBottom: 10,
  },

  aiIconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#173844",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  aiIcon: {
    fontSize: 32,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
  },

  aiText: {
    color: "#AFC0D9",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 9,
  },

  aiCoachButton: {
    width: "100%",
    backgroundColor: "#80F2CE",
    borderRadius: 17,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 17,
  },

  aiCoachButtonText: {
    color: "#03101B",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
});