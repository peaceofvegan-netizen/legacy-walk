// screens/SubscriptionScreen.js

import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Animated,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";


// ============================================================
// LEGATHON WALK — SUBSCRIPTION SCREEN
// MULTILINGUAL
// ============================================================

const FREE_CARD =
  require("../assets/subscriptions/free-card.jpg");

const PREMIUM_CARD =
  require("../assets/subscriptions/premium-card.jpg");

const ELITE_CARD =
  require("../assets/subscriptions/elite-card.jpg");


// ============================================================
// LANGUAGE
// ============================================================

function normalizeLanguage(language) {
  const code = String(
    language || "en"
  )
    .toLowerCase()
    .split("-")[0];

  const supported = [
    "en",
    "es",
    "fr",
    "de",
    "pt",
    "ja",
    "ko",
    "zh",
    "it",
    "ar",
  ];

  return supported.includes(code)
    ? code
    : "en";
}


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    tagline: "Built for Every Step.",
    chooseMembership: "Choose Your Membership",
    subtitle:
      "Start free or unlock the complete Legathon Walk experience with Premium or Elite.",

    currentPlan: "CURRENT PLAN",
    active: "ACTIVE",

    free: "Free",
    premium: "Premium",
    elite: "Elite",

    forever: "Forever",
    perMonth: "/ month",

    startWalking: "START WALKING",
    mostPopular: "MOST POPULAR",
    bestValue: "BEST VALUE",

    currentPlanButton: "CURRENT PLAN",
    chooseFree: "CHOOSE FREE",
    manageFreePlan: "MANAGE FREE PLAN",
    choosePremium: "CHOOSE PREMIUM",
    chooseElite: "CHOOSE ELITE",

    free12Journeys: "12 Free Journeys",
    community: "Legathon Community",
    leaderboardRankings: "Leaderboard & Rankings",
    basicAnalytics: "Basic Walking Analytics",
    collectWCoins: "Collect WCoins",
    wcoinRedemption: "WCoin Redemption",
    marathons26: "26 Legathon Marathons",
    allPremiumJourneys: "All Premium Journeys",
    tracksuitUnlocks5: "5 Tracksuit Unlocks",
    paceMobility: "Walking Pace & Mobility Trends",
    aiWellnessCoach: "AI Wellness Coach",
    personalWellnessCoach: "Personal Wellness Coach",

    allJourneys92: "All 92+ Journeys",
    allMarathons26: "All 26 Legathon Marathons",
    fullLeaderboard: "Full Leaderboard & Rankings",
    advancedAnalytics: "Advanced Walking Analytics",
    aiWalkingCoach: "AI Walking Coach",
    premiumMerchBenefits: "Premium Merchandise Benefits",
    elitePersonalCoach: "Elite Personal Wellness Coach",
    eliteWCoinValue: "Elite WCoin Redemption Value",
    freeMerchShipping: "Free Merchandise Shipping",

    everythingPremium: "Everything in Premium",
    highestWCoinValue: "Highest WCoin Redemption Value",
    freeShippingUpper: "FREE Merchandise Shipping",
    eliteMerchBenefits: "Elite Merchandise Benefits",

    walkCompleteEarn: "🪙 WALK • COMPLETE • EARN",
    wcoinRewards: "WCoin Rewards",
    rewardDescription:
      "Complete eligible Legathon Walk activity and journeys to earn WCoins. Your WCoins accumulate in your wallet as you progress.",

    redemptionUnlock: "REDEMPTION UNLOCK",
    tenThousandWCoins: "10,000 WCoins",
    redemptionDescription:
      "Reach 10,000 earned WCoins to unlock eligible redemption benefits on paid memberships.",

    freeUpper: "FREE",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "COLLECT",
    fiveDollarValue: "$5 VALUE",
    tenDollarValue: "$10 VALUE",

    freeCoinDescription:
      "Earn and collect WCoins. Redemption remains locked.",
    premiumCoinDescription:
      "10,000 WCoins after redemption unlock.",
    eliteCoinDescription:
      "10,000 WCoins at the highest membership redemption value.",

    rewardNote:
      "WCoins are earned through eligible Legathon activity and journey completion. They are not direct cash-per-mile payments.",

    milestoneRewards: "👕 WALKING MILESTONE REWARDS",
    tracksuitCollection: "Tracksuit Collection",
    tracksuitDescription:
      "The five Legathon tracksuits are earned through walking milestones. Premium and Elite members can unlock the collection as their lifetime walking progress reaches each requirement.",
    walkingRequired: "WALKING REQUIRED",
    tracksuitsCannotPurchase:
      "Tracksuits cannot be purchased",

    eliteExclusive: "👑 ELITE EXCLUSIVE",
    personalCoach: "Personal Wellness Coach",
    personalCoachDescription:
      "Elite members receive personalized text-based wellness insights using walking pace, activity trends, and walking-performance data.",
    walkingDataNotice:
      "Walking pace is wellness and activity data. It is not used as a direct cash-per-mile reward.",

    membershipComparison: "Membership Comparison",
    feature: "FEATURE",
    prem: "PREM",

    comparison12Free: "12 Free Journeys",
    allJourneys: "All Journeys",
    legathons26: "26 Legathons",
    communityShort: "Community",
    leaderboard: "Leaderboard",
    walkingAnalytics: "Walking Analytics",
    basic: "Basic",
    advanced: "Advanced",
    paceMobilityShort: "Pace & Mobility",
    wcoinCollection: "WCoin Collection",
    tracksuitUnlocks: "Tracksuit Unlocks",
    personalCoachShort: "Personal Coach",
    freeShipping: "Free Shipping",

    manageMembership: "Manage Membership",
    manageDescription:
      "Changes, cancellations, and renewals for paid memberships are managed through your App Store or Google Play account.",
    manageSubscription: "MANAGE SUBSCRIPTION",

    footerTitle: "Walk More. Experience More.",
    footerText:
      "Your Legathon membership determines the journeys, rewards, analytics, wellness tools, and merchandise benefits available to your account.",
    return: "Return",
    restorePurchases: "RESTORE PURCHASES",
    restoring: "RESTORING...",
    privacyPolicy: "Privacy Policy",
    termsService: "Terms of Service",

    manageMembershipAlert: "Manage Your Membership",
    manageMembershipMessage:
      "Your paid Legathon Walk membership is managed through your App Store or Google Play account. Cancel or change the subscription there before the app returns your account to the Free plan.",
    keepMembership: "Keep Membership",
    manageSubscriptionAlert: "Manage Subscription",

    checkoutUnavailable: "Checkout Unavailable",
    checkoutUnavailableMessage:
      "Subscription checkout is not currently connected.",

    restoreTitle: "Restore Purchases",
    restoreNotConnected:
      "Restore Purchases still needs to be connected to RevenueCat.",
    purchaseRestored: "Purchase Restored",
    restoredPremium:
      "Your Premium membership has been restored.",
    restoredElite:
      "Your Elite membership has been restored.",
    noMembership: "No Active Membership Found",
    noMembershipMessage:
      "No active Premium or Elite membership was found for this account.",
    unableRestore: "Unable to Restore",
    unableRestoreMessage:
      "Your purchases could not be restored.",

    subscriptionSettingsUnavailable:
      "Subscription settings are unavailable.",
    manageFallback:
      "Open your App Store or Google Play subscription settings to manage or cancel your Legathon Walk membership.",

    privacyNotConnected:
      "Privacy Policy navigation is not connected yet.",
    termsNotConnected:
      "Terms of Service navigation is not connected yet.",
  },


  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    tagline: "Creado para cada paso.",
    chooseMembership: "Elige tu membresía",
    subtitle:
      "Comienza gratis o desbloquea la experiencia completa de Legathon Walk con Premium o Elite.",

    currentPlan: "PLAN ACTUAL",
    active: "ACTIVO",

    free: "Gratis",
    premium: "Premium",
    elite: "Elite",

    forever: "Para siempre",
    perMonth: "/ mes",

    startWalking: "EMPIEZA A CAMINAR",
    mostPopular: "MÁS POPULAR",
    bestValue: "MEJOR VALOR",

    currentPlanButton: "PLAN ACTUAL",
    chooseFree: "ELEGIR GRATIS",
    manageFreePlan: "GESTIONAR PLAN GRATIS",
    choosePremium: "ELEGIR PREMIUM",
    chooseElite: "ELEGIR ELITE",

    free12Journeys: "12 Journeys gratis",
    community: "Comunidad Legathon",
    leaderboardRankings: "Clasificación y rangos",
    basicAnalytics: "Análisis básico de caminata",
    collectWCoins: "Acumular WCoins",
    wcoinRedemption: "Canje de WCoins",
    marathons26: "26 maratones Legathon",
    allPremiumJourneys: "Todos los Journeys Premium",
    tracksuitUnlocks5: "5 desbloqueos de chándal",
    paceMobility: "Ritmo de caminata y movilidad",
    aiWellnessCoach: "Coach de bienestar con IA",
    personalWellnessCoach: "Coach personal de bienestar",

    allJourneys92: "Todos los 92+ Journeys",
    allMarathons26: "Los 26 maratones Legathon",
    fullLeaderboard: "Clasificación y rangos completos",
    advancedAnalytics: "Análisis avanzado de caminata",
    aiWalkingCoach: "Coach de caminata con IA",
    premiumMerchBenefits: "Beneficios Premium en mercancía",
    elitePersonalCoach: "Coach personal de bienestar Elite",
    eliteWCoinValue: "Valor de canje WCoin Elite",
    freeMerchShipping: "Envío gratis de mercancía",

    everythingPremium: "Todo lo incluido en Premium",
    highestWCoinValue: "Mayor valor de canje WCoin",
    freeShippingUpper: "ENVÍO GRATIS DE MERCANCÍA",
    eliteMerchBenefits: "Beneficios Elite en mercancía",

    walkCompleteEarn: "🪙 CAMINA • COMPLETA • GANA",
    wcoinRewards: "Recompensas WCoin",
    rewardDescription:
      "Completa actividades y Journeys elegibles de Legathon Walk para ganar WCoins. Tus WCoins se acumulan en tu billetera a medida que avanzas.",

    redemptionUnlock: "DESBLOQUEO DE CANJE",
    tenThousandWCoins: "10.000 WCoins",
    redemptionDescription:
      "Alcanza 10.000 WCoins ganados para desbloquear beneficios de canje elegibles con membresías de pago.",

    freeUpper: "GRATIS",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "ACUMULAR",
    fiveDollarValue: "VALOR $5",
    tenDollarValue: "VALOR $10",

    freeCoinDescription:
      "Gana y acumula WCoins. El canje permanece bloqueado.",
    premiumCoinDescription:
      "10.000 WCoins después de desbloquear el canje.",
    eliteCoinDescription:
      "10.000 WCoins con el valor de canje más alto de la membresía.",

    rewardNote:
      "Los WCoins se obtienen mediante actividades y Journeys elegibles de Legathon. No son pagos directos en efectivo por milla.",

    milestoneRewards: "👕 RECOMPENSAS POR HITOS DE CAMINATA",
    tracksuitCollection: "Colección de chándales",
    tracksuitDescription:
      "Los cinco chándales Legathon se obtienen alcanzando hitos de caminata. Los miembros Premium y Elite pueden desbloquear la colección al alcanzar cada requisito de pasos acumulados.",
    walkingRequired: "SE REQUIERE CAMINAR",
    tracksuitsCannotPurchase:
      "Los chándales no se pueden comprar",

    eliteExclusive: "👑 EXCLUSIVO ELITE",
    personalCoach: "Coach personal de bienestar",
    personalCoachDescription:
      "Los miembros Elite reciben información personalizada de bienestar basada en texto usando el ritmo de caminata, tendencias de actividad y datos de rendimiento.",
    walkingDataNotice:
      "El ritmo de caminata es información de bienestar y actividad. No se utiliza como recompensa directa en efectivo por milla.",

    membershipComparison: "Comparación de membresías",
    feature: "FUNCIÓN",
    prem: "PREM",

    comparison12Free: "12 Journeys gratis",
    allJourneys: "Todos los Journeys",
    legathons26: "26 Legathons",
    communityShort: "Comunidad",
    leaderboard: "Clasificación",
    walkingAnalytics: "Análisis de caminata",
    basic: "Básico",
    advanced: "Avanzado",
    paceMobilityShort: "Ritmo y movilidad",
    wcoinCollection: "Acumulación WCoin",
    tracksuitUnlocks: "Desbloqueo de chándales",
    personalCoachShort: "Coach personal",
    freeShipping: "Envío gratis",

    manageMembership: "Gestionar membresía",
    manageDescription:
      "Los cambios, cancelaciones y renovaciones de membresías de pago se gestionan mediante tu cuenta de App Store o Google Play.",
    manageSubscription: "GESTIONAR SUSCRIPCIÓN",

    footerTitle: "Camina más. Vive más.",
    footerText:
      "Tu membresía Legathon determina los Journeys, recompensas, análisis, herramientas de bienestar y beneficios de mercancía disponibles para tu cuenta.",
    return: "Volver",
    restorePurchases: "RESTAURAR COMPRAS",
    restoring: "RESTAURANDO...",
    privacyPolicy: "Política de privacidad",
    termsService: "Términos del servicio",

    manageMembershipAlert: "Gestiona tu membresía",
    manageMembershipMessage:
      "Tu membresía de pago de Legathon Walk se gestiona mediante App Store o Google Play. Cancela o cambia la suscripción allí antes de volver al plan Gratis.",
    keepMembership: "Mantener membresía",
    manageSubscriptionAlert: "Gestionar suscripción",

    checkoutUnavailable: "Pago no disponible",
    checkoutUnavailableMessage:
      "El pago de suscripciones no está conectado actualmente.",

    restoreTitle: "Restaurar compras",
    restoreNotConnected:
      "Restaurar compras todavía debe conectarse a RevenueCat.",
    purchaseRestored: "Compra restaurada",
    restoredPremium:
      "Tu membresía Premium ha sido restaurada.",
    restoredElite:
      "Tu membresía Elite ha sido restaurada.",
    noMembership: "No se encontró membresía activa",
    noMembershipMessage:
      "No se encontró una membresía Premium o Elite activa para esta cuenta.",
    unableRestore: "No se pudo restaurar",
    unableRestoreMessage:
      "No se pudieron restaurar tus compras.",

    subscriptionSettingsUnavailable:
      "La configuración de suscripción no está disponible.",
    manageFallback:
      "Abre la configuración de suscripciones de App Store o Google Play para gestionar o cancelar tu membresía de Legathon Walk.",

    privacyNotConnected:
      "La navegación a la Política de privacidad aún no está conectada.",
    termsNotConnected:
      "La navegación a los Términos del servicio aún no está conectada.",
  },


  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    tagline: "Conçu pour chaque pas.",
    chooseMembership: "Choisissez votre abonnement",
    subtitle:
      "Commencez gratuitement ou débloquez toute l’expérience Legathon Walk avec Premium ou Elite.",

    currentPlan: "ABONNEMENT ACTUEL",
    active: "ACTIF",

    free: "Gratuit",
    premium: "Premium",
    elite: "Elite",

    forever: "Toujours",
    perMonth: "/ mois",

    startWalking: "COMMENCER À MARCHER",
    mostPopular: "LE PLUS POPULAIRE",
    bestValue: "MEILLEURE VALEUR",

    currentPlanButton: "ABONNEMENT ACTUEL",
    chooseFree: "CHOISIR GRATUIT",
    manageFreePlan: "GÉRER LE PLAN GRATUIT",
    choosePremium: "CHOISIR PREMIUM",
    chooseElite: "CHOISIR ELITE",

    free12Journeys: "12 Journeys gratuits",
    community: "Communauté Legathon",
    leaderboardRankings: "Classement et rangs",
    basicAnalytics: "Analyse de marche de base",
    collectWCoins: "Collecter des WCoins",
    wcoinRedemption: "Échange de WCoins",
    marathons26: "26 marathons Legathon",
    allPremiumJourneys: "Tous les Journeys Premium",
    tracksuitUnlocks5: "5 survêtements à débloquer",
    paceMobility: "Rythme de marche et mobilité",
    aiWellnessCoach: "Coach bien-être IA",
    personalWellnessCoach: "Coach personnel bien-être",

    allJourneys92: "Tous les 92+ Journeys",
    allMarathons26: "Les 26 marathons Legathon",
    fullLeaderboard: "Classement et rangs complets",
    advancedAnalytics: "Analyse avancée de marche",
    aiWalkingCoach: "Coach de marche IA",
    premiumMerchBenefits: "Avantages boutique Premium",
    elitePersonalCoach: "Coach personnel bien-être Elite",
    eliteWCoinValue: "Valeur d’échange WCoin Elite",
    freeMerchShipping: "Livraison gratuite des articles",

    everythingPremium: "Tout Premium inclus",
    highestWCoinValue: "Valeur d’échange WCoin maximale",
    freeShippingUpper: "LIVRAISON GRATUITE",
    eliteMerchBenefits: "Avantages boutique Elite",

    walkCompleteEarn: "🪙 MARCHEZ • TERMINEZ • GAGNEZ",
    wcoinRewards: "Récompenses WCoin",
    rewardDescription:
      "Effectuez des activités et Journeys Legathon Walk éligibles pour gagner des WCoins. Vos WCoins s’accumulent dans votre portefeuille au fil de votre progression.",

    redemptionUnlock: "DÉBLOCAGE DE L’ÉCHANGE",
    tenThousandWCoins: "10 000 WCoins",
    redemptionDescription:
      "Atteignez 10 000 WCoins gagnés pour débloquer les avantages d’échange éligibles des abonnements payants.",

    freeUpper: "GRATUIT",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "COLLECTER",
    fiveDollarValue: "VALEUR 5 $",
    tenDollarValue: "VALEUR 10 $",

    freeCoinDescription:
      "Gagnez et collectez des WCoins. L’échange reste verrouillé.",
    premiumCoinDescription:
      "10 000 WCoins après le déblocage de l’échange.",
    eliteCoinDescription:
      "10 000 WCoins avec la valeur d’échange la plus élevée.",

    rewardNote:
      "Les WCoins sont gagnés grâce aux activités et Journeys Legathon éligibles. Ils ne constituent pas un paiement direct en espèces par mile.",

    milestoneRewards: "👕 RÉCOMPENSES DE MARCHE",
    tracksuitCollection: "Collection de survêtements",
    tracksuitDescription:
      "Les cinq survêtements Legathon sont gagnés grâce aux étapes de marche. Les membres Premium et Elite peuvent débloquer la collection en atteignant chaque objectif de progression.",
    walkingRequired: "MARCHE REQUISE",
    tracksuitsCannotPurchase:
      "Les survêtements ne peuvent pas être achetés",

    eliteExclusive: "👑 EXCLUSIVITÉ ELITE",
    personalCoach: "Coach personnel bien-être",
    personalCoachDescription:
      "Les membres Elite reçoivent des conseils personnalisés de bien-être sous forme de texte, basés sur le rythme de marche, les tendances d’activité et les données de performance.",
    walkingDataNotice:
      "Le rythme de marche est une donnée de bien-être et d’activité. Il n’est pas utilisé comme récompense directe en espèces par mile.",

    membershipComparison: "Comparaison des abonnements",
    feature: "FONCTION",
    prem: "PREM",

    comparison12Free: "12 Journeys gratuits",
    allJourneys: "Tous les Journeys",
    legathons26: "26 Legathons",
    communityShort: "Communauté",
    leaderboard: "Classement",
    walkingAnalytics: "Analyse de marche",
    basic: "Basique",
    advanced: "Avancé",
    paceMobilityShort: "Rythme et mobilité",
    wcoinCollection: "Collecte WCoin",
    tracksuitUnlocks: "Survêtements",
    personalCoachShort: "Coach personnel",
    freeShipping: "Livraison gratuite",

    manageMembership: "Gérer l’abonnement",
    manageDescription:
      "Les modifications, annulations et renouvellements des abonnements payants sont gérés via votre compte App Store ou Google Play.",
    manageSubscription: "GÉRER L’ABONNEMENT",

    footerTitle: "Marchez plus. Vivez plus.",
    footerText:
      "Votre abonnement Legathon détermine les Journeys, récompenses, analyses, outils de bien-être et avantages boutique disponibles.",
    return: "Retour",
    restorePurchases: "RESTAURER LES ACHATS",
    restoring: "RESTAURATION...",
    privacyPolicy: "Politique de confidentialité",
    termsService: "Conditions d’utilisation",

    manageMembershipAlert: "Gérer votre abonnement",
    manageMembershipMessage:
      "Votre abonnement Legathon Walk payant est géré via votre compte App Store ou Google Play. Annulez ou modifiez-le là-bas avant de revenir au plan Gratuit.",
    keepMembership: "Conserver l’abonnement",
    manageSubscriptionAlert: "Gérer l’abonnement",

    checkoutUnavailable: "Paiement indisponible",
    checkoutUnavailableMessage:
      "Le paiement des abonnements n’est pas encore connecté.",

    restoreTitle: "Restaurer les achats",
    restoreNotConnected:
      "La restauration des achats doit encore être connectée à RevenueCat.",
    purchaseRestored: "Achat restauré",
    restoredPremium:
      "Votre abonnement Premium a été restauré.",
    restoredElite:
      "Votre abonnement Elite a été restauré.",
    noMembership: "Aucun abonnement actif trouvé",
    noMembershipMessage:
      "Aucun abonnement Premium ou Elite actif n’a été trouvé pour ce compte.",
    unableRestore: "Restauration impossible",
    unableRestoreMessage:
      "Vos achats n’ont pas pu être restaurés.",

    subscriptionSettingsUnavailable:
      "Les réglages d’abonnement ne sont pas disponibles.",
    manageFallback:
      "Ouvrez les réglages d’abonnement App Store ou Google Play pour gérer ou annuler votre abonnement Legathon Walk.",

    privacyNotConnected:
      "La navigation vers la politique de confidentialité n’est pas encore connectée.",
    termsNotConnected:
      "La navigation vers les conditions d’utilisation n’est pas encore connectée.",
  },


  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    tagline: "Für jeden Schritt gemacht.",
    chooseMembership: "Mitgliedschaft wählen",
    subtitle:
      "Starte kostenlos oder schalte das vollständige Legathon Walk Erlebnis mit Premium oder Elite frei.",

    currentPlan: "AKTUELLER PLAN",
    active: "AKTIV",

    free: "Kostenlos",
    premium: "Premium",
    elite: "Elite",

    forever: "Dauerhaft",
    perMonth: "/ Monat",

    startWalking: "LOSLAUFEN",
    mostPopular: "AM BELIEBTESTEN",
    bestValue: "BESTER WERT",

    currentPlanButton: "AKTUELLER PLAN",
    chooseFree: "KOSTENLOS WÄHLEN",
    manageFreePlan: "KOSTENLOSEN PLAN VERWALTEN",
    choosePremium: "PREMIUM WÄHLEN",
    chooseElite: "ELITE WÄHLEN",

    free12Journeys: "12 kostenlose Journeys",
    community: "Legathon Community",
    leaderboardRankings: "Bestenliste & Ränge",
    basicAnalytics: "Grundlegende Gehanalyse",
    collectWCoins: "WCoins sammeln",
    wcoinRedemption: "WCoin-Einlösung",
    marathons26: "26 Legathon-Marathons",
    allPremiumJourneys: "Alle Premium Journeys",
    tracksuitUnlocks5: "5 Trainingsanzüge freischalten",
    paceMobility: "Gehtempo & Mobilitätstrends",
    aiWellnessCoach: "KI-Wellness-Coach",
    personalWellnessCoach: "Persönlicher Wellness-Coach",

    allJourneys92: "Alle 92+ Journeys",
    allMarathons26: "Alle 26 Legathon-Marathons",
    fullLeaderboard: "Vollständige Bestenliste & Ränge",
    advancedAnalytics: "Erweiterte Gehanalyse",
    aiWalkingCoach: "KI-Gehcoach",
    premiumMerchBenefits: "Premium-Merchandise-Vorteile",
    elitePersonalCoach: "Elite persönlicher Wellness-Coach",
    eliteWCoinValue: "Elite WCoin-Einlösewert",
    freeMerchShipping: "Kostenloser Merchandise-Versand",

    everythingPremium: "Alles aus Premium",
    highestWCoinValue: "Höchster WCoin-Einlösewert",
    freeShippingUpper: "KOSTENLOSER MERCHANDISE-VERSAND",
    eliteMerchBenefits: "Elite-Merchandise-Vorteile",

    walkCompleteEarn: "🪙 GEHEN • ABSCHLIESSEN • VERDIENEN",
    wcoinRewards: "WCoin-Belohnungen",
    rewardDescription:
      "Schließe berechtigte Legathon Walk Aktivitäten und Journeys ab, um WCoins zu verdienen. Deine WCoins sammeln sich mit deinem Fortschritt in deiner Wallet.",

    redemptionUnlock: "EINLÖSUNG FREISCHALTEN",
    tenThousandWCoins: "10.000 WCoins",
    redemptionDescription:
      "Erreiche 10.000 verdiente WCoins, um berechtigte Einlösevorteile für kostenpflichtige Mitgliedschaften freizuschalten.",

    freeUpper: "KOSTENLOS",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "SAMMELN",
    fiveDollarValue: "5 $ WERT",
    tenDollarValue: "10 $ WERT",

    freeCoinDescription:
      "WCoins verdienen und sammeln. Einlösung bleibt gesperrt.",
    premiumCoinDescription:
      "10.000 WCoins nach Freischaltung der Einlösung.",
    eliteCoinDescription:
      "10.000 WCoins zum höchsten Einlösewert der Mitgliedschaft.",

    rewardNote:
      "WCoins werden durch berechtigte Legathon-Aktivitäten und Journey-Abschlüsse verdient. Sie sind keine direkten Bargeldzahlungen pro Meile.",

    milestoneRewards: "👕 GEH-MEILENSTEIN-BELOHNUNGEN",
    tracksuitCollection: "Trainingsanzug-Kollektion",
    tracksuitDescription:
      "Die fünf Legathon-Trainingsanzüge werden durch Geh-Meilensteine verdient. Premium- und Elite-Mitglieder können die Kollektion mit ihrem lebenslangen Gehfortschritt freischalten.",
    walkingRequired: "GEHEN ERFORDERLICH",
    tracksuitsCannotPurchase:
      "Trainingsanzüge können nicht gekauft werden",

    eliteExclusive: "👑 ELITE EXKLUSIV",
    personalCoach: "Persönlicher Wellness-Coach",
    personalCoachDescription:
      "Elite-Mitglieder erhalten personalisierte textbasierte Wellness-Einblicke anhand von Gehtempo, Aktivitätstrends und Leistungsdaten.",
    walkingDataNotice:
      "Das Gehtempo ist eine Wellness- und Aktivitätsinformation. Es wird nicht als direkte Bargeldbelohnung pro Meile verwendet.",

    membershipComparison: "Mitgliedschaften vergleichen",
    feature: "FUNKTION",
    prem: "PREM",

    comparison12Free: "12 kostenlose Journeys",
    allJourneys: "Alle Journeys",
    legathons26: "26 Legathons",
    communityShort: "Community",
    leaderboard: "Bestenliste",
    walkingAnalytics: "Gehanalyse",
    basic: "Basis",
    advanced: "Erweitert",
    paceMobilityShort: "Tempo & Mobilität",
    wcoinCollection: "WCoin-Sammlung",
    tracksuitUnlocks: "Trainingsanzüge",
    personalCoachShort: "Persönlicher Coach",
    freeShipping: "Gratis Versand",

    manageMembership: "Mitgliedschaft verwalten",
    manageDescription:
      "Änderungen, Kündigungen und Verlängerungen kostenpflichtiger Mitgliedschaften werden über dein App Store- oder Google Play-Konto verwaltet.",
    manageSubscription: "ABO VERWALTEN",

    footerTitle: "Mehr gehen. Mehr erleben.",
    footerText:
      "Deine Legathon-Mitgliedschaft bestimmt, welche Journeys, Belohnungen, Analysen, Wellness-Tools und Merchandise-Vorteile verfügbar sind.",
    return: "Zurück",
    restorePurchases: "KÄUFE WIEDERHERSTELLEN",
    restoring: "WIEDERHERSTELLUNG...",
    privacyPolicy: "Datenschutz",
    termsService: "Nutzungsbedingungen",

    manageMembershipAlert: "Mitgliedschaft verwalten",
    manageMembershipMessage:
      "Deine kostenpflichtige Legathon Walk Mitgliedschaft wird über App Store oder Google Play verwaltet. Kündige oder ändere sie dort, bevor dein Konto zum kostenlosen Plan zurückkehrt.",
    keepMembership: "Mitgliedschaft behalten",
    manageSubscriptionAlert: "Abo verwalten",

    checkoutUnavailable: "Kasse nicht verfügbar",
    checkoutUnavailableMessage:
      "Der Abonnement-Kauf ist derzeit nicht verbunden.",

    restoreTitle: "Käufe wiederherstellen",
    restoreNotConnected:
      "Die Wiederherstellung muss noch mit RevenueCat verbunden werden.",
    purchaseRestored: "Kauf wiederhergestellt",
    restoredPremium:
      "Deine Premium-Mitgliedschaft wurde wiederhergestellt.",
    restoredElite:
      "Deine Elite-Mitgliedschaft wurde wiederhergestellt.",
    noMembership: "Keine aktive Mitgliedschaft gefunden",
    noMembershipMessage:
      "Für dieses Konto wurde keine aktive Premium- oder Elite-Mitgliedschaft gefunden.",
    unableRestore: "Wiederherstellung nicht möglich",
    unableRestoreMessage:
      "Deine Käufe konnten nicht wiederhergestellt werden.",

    subscriptionSettingsUnavailable:
      "Abonnement-Einstellungen sind nicht verfügbar.",
    manageFallback:
      "Öffne deine App Store- oder Google Play-Abonnement-Einstellungen, um deine Legathon Walk Mitgliedschaft zu verwalten oder zu kündigen.",

    privacyNotConnected:
      "Die Datenschutz-Navigation ist noch nicht verbunden.",
    termsNotConnected:
      "Die Navigation zu den Nutzungsbedingungen ist noch nicht verbunden.",
  },


  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    tagline: "Feito para cada passo.",
    chooseMembership: "Escolha sua assinatura",
    subtitle:
      "Comece grátis ou desbloqueie a experiência completa do Legathon Walk com Premium ou Elite.",

    currentPlan: "PLANO ATUAL",
    active: "ATIVO",

    free: "Grátis",
    premium: "Premium",
    elite: "Elite",

    forever: "Para sempre",
    perMonth: "/ mês",

    startWalking: "COMECE A CAMINHAR",
    mostPopular: "MAIS POPULAR",
    bestValue: "MELHOR VALOR",

    currentPlanButton: "PLANO ATUAL",
    chooseFree: "ESCOLHER GRÁTIS",
    manageFreePlan: "GERENCIAR PLANO GRÁTIS",
    choosePremium: "ESCOLHER PREMIUM",
    chooseElite: "ESCOLHER ELITE",

    free12Journeys: "12 Journeys grátis",
    community: "Comunidade Legathon",
    leaderboardRankings: "Ranking e classificações",
    basicAnalytics: "Análise básica de caminhada",
    collectWCoins: "Acumular WCoins",
    wcoinRedemption: "Resgate de WCoins",
    marathons26: "26 maratonas Legathon",
    allPremiumJourneys: "Todos os Journeys Premium",
    tracksuitUnlocks5: "5 agasalhos desbloqueáveis",
    paceMobility: "Ritmo e tendências de mobilidade",
    aiWellnessCoach: "Coach de bem-estar com IA",
    personalWellnessCoach: "Coach pessoal de bem-estar",

    allJourneys92: "Todos os 92+ Journeys",
    allMarathons26: "Todas as 26 maratonas Legathon",
    fullLeaderboard: "Ranking completo",
    advancedAnalytics: "Análise avançada de caminhada",
    aiWalkingCoach: "Coach de caminhada com IA",
    premiumMerchBenefits: "Benefícios Premium em produtos",
    elitePersonalCoach: "Coach pessoal Elite",
    eliteWCoinValue: "Valor de resgate WCoin Elite",
    freeMerchShipping: "Frete grátis de produtos",

    everythingPremium: "Tudo do Premium",
    highestWCoinValue: "Maior valor de resgate WCoin",
    freeShippingUpper: "FRETE GRÁTIS",
    eliteMerchBenefits: "Benefícios Elite em produtos",

    walkCompleteEarn: "🪙 CAMINHE • COMPLETE • GANHE",
    wcoinRewards: "Recompensas WCoin",
    rewardDescription:
      "Complete atividades e Journeys elegíveis do Legathon Walk para ganhar WCoins. Seus WCoins se acumulam na carteira conforme você progride.",

    redemptionUnlock: "DESBLOQUEIO DE RESGATE",
    tenThousandWCoins: "10.000 WCoins",
    redemptionDescription:
      "Alcance 10.000 WCoins ganhos para desbloquear benefícios de resgate elegíveis em assinaturas pagas.",

    freeUpper: "GRÁTIS",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "ACUMULAR",
    fiveDollarValue: "VALOR $5",
    tenDollarValue: "VALOR $10",

    freeCoinDescription:
      "Ganhe e acumule WCoins. O resgate permanece bloqueado.",
    premiumCoinDescription:
      "10.000 WCoins após desbloquear o resgate.",
    eliteCoinDescription:
      "10.000 WCoins com o maior valor de resgate da assinatura.",

    rewardNote:
      "WCoins são ganhos por atividades e conclusão de Journeys elegíveis do Legathon. Eles não são pagamentos diretos em dinheiro por milha.",

    milestoneRewards: "👕 RECOMPENSAS POR MARCOS DE CAMINHADA",
    tracksuitCollection: "Coleção de agasalhos",
    tracksuitDescription:
      "Os cinco agasalhos Legathon são conquistados por marcos de caminhada. Membros Premium e Elite podem desbloquear a coleção conforme atingem cada requisito.",
    walkingRequired: "CAMINHADA NECESSÁRIA",
    tracksuitsCannotPurchase:
      "Os agasalhos não podem ser comprados",

    eliteExclusive: "👑 EXCLUSIVO ELITE",
    personalCoach: "Coach pessoal de bem-estar",
    personalCoachDescription:
      "Membros Elite recebem informações personalizadas de bem-estar em texto usando ritmo de caminhada, tendências de atividade e dados de desempenho.",
    walkingDataNotice:
      "O ritmo de caminhada é um dado de bem-estar e atividade. Não é usado como recompensa direta em dinheiro por milha.",

    membershipComparison: "Comparação de assinaturas",
    feature: "RECURSO",
    prem: "PREM",

    comparison12Free: "12 Journeys grátis",
    allJourneys: "Todos os Journeys",
    legathons26: "26 Legathons",
    communityShort: "Comunidade",
    leaderboard: "Ranking",
    walkingAnalytics: "Análise de caminhada",
    basic: "Básico",
    advanced: "Avançado",
    paceMobilityShort: "Ritmo e mobilidade",
    wcoinCollection: "Acúmulo WCoin",
    tracksuitUnlocks: "Agasalhos",
    personalCoachShort: "Coach pessoal",
    freeShipping: "Frete grátis",

    manageMembership: "Gerenciar assinatura",
    manageDescription:
      "Alterações, cancelamentos e renovações de assinaturas pagas são gerenciados pela sua conta da App Store ou Google Play.",
    manageSubscription: "GERENCIAR ASSINATURA",

    footerTitle: "Caminhe mais. Viva mais.",
    footerText:
      "Sua assinatura Legathon determina os Journeys, recompensas, análises, ferramentas de bem-estar e benefícios disponíveis.",
    return: "Voltar",
    restorePurchases: "RESTAURAR COMPRAS",
    restoring: "RESTAURANDO...",
    privacyPolicy: "Política de Privacidade",
    termsService: "Termos de Serviço",

    manageMembershipAlert: "Gerencie sua assinatura",
    manageMembershipMessage:
      "Sua assinatura paga do Legathon Walk é gerenciada pela App Store ou Google Play. Cancele ou altere a assinatura lá antes de voltar ao plano Grátis.",
    keepMembership: "Manter assinatura",
    manageSubscriptionAlert: "Gerenciar assinatura",

    checkoutUnavailable: "Pagamento indisponível",
    checkoutUnavailableMessage:
      "O checkout da assinatura ainda não está conectado.",

    restoreTitle: "Restaurar compras",
    restoreNotConnected:
      "A restauração ainda precisa ser conectada ao RevenueCat.",
    purchaseRestored: "Compra restaurada",
    restoredPremium:
      "Sua assinatura Premium foi restaurada.",
    restoredElite:
      "Sua assinatura Elite foi restaurada.",
    noMembership: "Nenhuma assinatura ativa encontrada",
    noMembershipMessage:
      "Nenhuma assinatura Premium ou Elite ativa foi encontrada para esta conta.",
    unableRestore: "Não foi possível restaurar",
    unableRestoreMessage:
      "Suas compras não puderam ser restauradas.",

    subscriptionSettingsUnavailable:
      "As configurações de assinatura não estão disponíveis.",
    manageFallback:
      "Abra as configurações de assinatura da App Store ou Google Play para gerenciar ou cancelar sua assinatura Legathon Walk.",

    privacyNotConnected:
      "A navegação da Política de Privacidade ainda não está conectada.",
    termsNotConnected:
      "A navegação dos Termos de Serviço ainda não está conectada.",
  },


  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    tagline: "すべての一歩のために。",
    chooseMembership: "メンバーシップを選択",
    subtitle:
      "無料で始めるか、Premium または Elite で Legathon Walk の全機能を利用できます。",

    currentPlan: "現在のプラン",
    active: "有効",

    free: "無料",
    premium: "Premium",
    elite: "Elite",

    forever: "ずっと無料",
    perMonth: "/ 月",

    startWalking: "ウォーキングを開始",
    mostPopular: "一番人気",
    bestValue: "最高の価値",

    currentPlanButton: "現在のプラン",
    chooseFree: "無料を選択",
    manageFreePlan: "無料プランを管理",
    choosePremium: "PREMIUMを選択",
    chooseElite: "ELITEを選択",

    free12Journeys: "12の無料Journey",
    community: "Legathonコミュニティ",
    leaderboardRankings: "ランキング",
    basicAnalytics: "基本ウォーキング分析",
    collectWCoins: "WCoinsを集める",
    wcoinRedemption: "WCoin交換",
    marathons26: "26のLegathonマラソン",
    allPremiumJourneys: "すべてのPremium Journey",
    tracksuitUnlocks5: "5つのトラックスーツ解除",
    paceMobility: "歩行ペースとモビリティ傾向",
    aiWellnessCoach: "AIウェルネスコーチ",
    personalWellnessCoach: "パーソナルウェルネスコーチ",

    allJourneys92: "92以上のすべてのJourney",
    allMarathons26: "26のすべてのLegathonマラソン",
    fullLeaderboard: "完全ランキング",
    advancedAnalytics: "高度なウォーキング分析",
    aiWalkingCoach: "AIウォーキングコーチ",
    premiumMerchBenefits: "Premium商品特典",
    elitePersonalCoach: "Eliteパーソナルウェルネスコーチ",
    eliteWCoinValue: "Elite WCoin交換価値",
    freeMerchShipping: "商品送料無料",

    everythingPremium: "Premiumの全機能",
    highestWCoinValue: "最高のWCoin交換価値",
    freeShippingUpper: "商品送料無料",
    eliteMerchBenefits: "Elite商品特典",

    walkCompleteEarn: "🪙 歩く • 完了 • 獲得",
    wcoinRewards: "WCoinリワード",
    rewardDescription:
      "対象のLegathon WalkアクティビティやJourneyを完了してWCoinsを獲得できます。進行に応じてWCoinsがウォレットに貯まります。",

    redemptionUnlock: "交換解除",
    tenThousandWCoins: "10,000 WCoins",
    redemptionDescription:
      "10,000 WCoinsを獲得すると、有料メンバーシップの対象交換特典を利用できます。",

    freeUpper: "無料",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "貯める",
    fiveDollarValue: "$5相当",
    tenDollarValue: "$10相当",

    freeCoinDescription:
      "WCoinsを獲得して貯められます。交換機能はロックされています。",
    premiumCoinDescription:
      "交換解除後、10,000 WCoinsで利用できます。",
    eliteCoinDescription:
      "10,000 WCoinsを最高のメンバーシップ交換価値で利用できます。",

    rewardNote:
      "WCoinsは対象のLegathonアクティビティとJourney完了によって獲得します。1マイルごとの直接現金支払いではありません。",

    milestoneRewards: "👕 ウォーキングマイルストーン報酬",
    tracksuitCollection: "トラックスーツコレクション",
    tracksuitDescription:
      "5つのLegathonトラックスーツはウォーキングのマイルストーンで獲得します。PremiumとEliteメンバーは生涯歩数が各条件に達すると解除できます。",
    walkingRequired: "ウォーキングが必要",
    tracksuitsCannotPurchase:
      "トラックスーツは購入できません",

    eliteExclusive: "👑 ELITE限定",
    personalCoach: "パーソナルウェルネスコーチ",
    personalCoachDescription:
      "Eliteメンバーは歩行ペース、活動傾向、歩行パフォーマンスデータを使用したテキストベースのパーソナライズされたウェルネス情報を受け取れます。",
    walkingDataNotice:
      "歩行ペースはウェルネスおよび活動データです。1マイルごとの直接現金報酬には使用されません。",

    membershipComparison: "メンバーシップ比較",
    feature: "機能",
    prem: "PREM",

    comparison12Free: "12の無料Journey",
    allJourneys: "すべてのJourney",
    legathons26: "26 Legathons",
    communityShort: "コミュニティ",
    leaderboard: "ランキング",
    walkingAnalytics: "ウォーキング分析",
    basic: "基本",
    advanced: "高度",
    paceMobilityShort: "ペースとモビリティ",
    wcoinCollection: "WCoin収集",
    tracksuitUnlocks: "トラックスーツ解除",
    personalCoachShort: "パーソナルコーチ",
    freeShipping: "送料無料",

    manageMembership: "メンバーシップ管理",
    manageDescription:
      "有料メンバーシップの変更、キャンセル、更新はApp StoreまたはGoogle Playアカウントで管理されます。",
    manageSubscription: "サブスクリプションを管理",

    footerTitle: "もっと歩く。もっと体験する。",
    footerText:
      "Legathonメンバーシップによって利用できるJourney、報酬、分析、ウェルネスツール、商品特典が決まります。",
    return: "戻る",
    restorePurchases: "購入を復元",
    restoring: "復元中...",
    privacyPolicy: "プライバシーポリシー",
    termsService: "利用規約",

    manageMembershipAlert: "メンバーシップを管理",
    manageMembershipMessage:
      "有料のLegathon WalkメンバーシップはApp StoreまたはGoogle Playで管理されます。無料プランに戻る前に、そこでキャンセルまたは変更してください。",
    keepMembership: "メンバーシップを維持",
    manageSubscriptionAlert: "サブスクリプションを管理",

    checkoutUnavailable: "購入できません",
    checkoutUnavailableMessage:
      "サブスクリプション購入は現在接続されていません。",

    restoreTitle: "購入を復元",
    restoreNotConnected:
      "購入の復元はまだRevenueCatに接続する必要があります。",
    purchaseRestored: "購入を復元しました",
    restoredPremium:
      "Premiumメンバーシップを復元しました。",
    restoredElite:
      "Eliteメンバーシップを復元しました。",
    noMembership: "有効なメンバーシップがありません",
    noMembershipMessage:
      "このアカウントには有効なPremiumまたはEliteメンバーシップがありません。",
    unableRestore: "復元できません",
    unableRestoreMessage:
      "購入を復元できませんでした。",

    subscriptionSettingsUnavailable:
      "サブスクリプション設定を利用できません。",
    manageFallback:
      "App StoreまたはGoogle Playのサブスクリプション設定を開き、Legathon Walkメンバーシップを管理またはキャンセルしてください。",

    privacyNotConnected:
      "プライバシーポリシー画面への移動はまだ接続されていません。",
    termsNotConnected:
      "利用規約画面への移動はまだ接続されていません。",
  },


  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    tagline: "모든 걸음을 위해.",
    chooseMembership: "멤버십 선택",
    subtitle:
      "무료로 시작하거나 Premium 또는 Elite로 Legathon Walk의 모든 기능을 이용하세요.",

    currentPlan: "현재 플랜",
    active: "활성",

    free: "무료",
    premium: "Premium",
    elite: "Elite",

    forever: "계속 무료",
    perMonth: "/ 월",

    startWalking: "걷기 시작",
    mostPopular: "가장 인기",
    bestValue: "최고의 가치",

    currentPlanButton: "현재 플랜",
    chooseFree: "무료 선택",
    manageFreePlan: "무료 플랜 관리",
    choosePremium: "PREMIUM 선택",
    chooseElite: "ELITE 선택",

    free12Journeys: "무료 Journey 12개",
    community: "Legathon 커뮤니티",
    leaderboardRankings: "리더보드 및 랭킹",
    basicAnalytics: "기본 걷기 분석",
    collectWCoins: "WCoins 적립",
    wcoinRedemption: "WCoin 교환",
    marathons26: "Legathon 마라톤 26개",
    allPremiumJourneys: "모든 Premium Journey",
    tracksuitUnlocks5: "트랙수트 5개 잠금 해제",
    paceMobility: "걷기 속도 및 이동성 추세",
    aiWellnessCoach: "AI 웰니스 코치",
    personalWellnessCoach: "개인 웰니스 코치",

    allJourneys92: "92개 이상의 모든 Journey",
    allMarathons26: "Legathon 마라톤 26개 전체",
    fullLeaderboard: "전체 리더보드 및 랭킹",
    advancedAnalytics: "고급 걷기 분석",
    aiWalkingCoach: "AI 걷기 코치",
    premiumMerchBenefits: "Premium 상품 혜택",
    elitePersonalCoach: "Elite 개인 웰니스 코치",
    eliteWCoinValue: "Elite WCoin 교환 가치",
    freeMerchShipping: "상품 무료 배송",

    everythingPremium: "Premium의 모든 혜택",
    highestWCoinValue: "최고 WCoin 교환 가치",
    freeShippingUpper: "상품 무료 배송",
    eliteMerchBenefits: "Elite 상품 혜택",

    walkCompleteEarn: "🪙 걷기 • 완료 • 적립",
    wcoinRewards: "WCoin 보상",
    rewardDescription:
      "적격 Legathon Walk 활동과 Journey를 완료하여 WCoins를 적립하세요. 진행할수록 WCoins가 지갑에 쌓입니다.",

    redemptionUnlock: "교환 잠금 해제",
    tenThousandWCoins: "10,000 WCoins",
    redemptionDescription:
      "10,000 WCoins를 적립하면 유료 멤버십의 적격 교환 혜택이 잠금 해제됩니다.",

    freeUpper: "무료",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "적립",
    fiveDollarValue: "$5 가치",
    tenDollarValue: "$10 가치",

    freeCoinDescription:
      "WCoins를 적립할 수 있습니다. 교환 기능은 잠겨 있습니다.",
    premiumCoinDescription:
      "교환 잠금 해제 후 10,000 WCoins.",
    eliteCoinDescription:
      "10,000 WCoins를 최고 멤버십 교환 가치로 사용할 수 있습니다.",

    rewardNote:
      "WCoins는 적격 Legathon 활동과 Journey 완료를 통해 적립됩니다. 마일당 직접 현금 지급이 아닙니다.",

    milestoneRewards: "👕 걷기 마일스톤 보상",
    tracksuitCollection: "트랙수트 컬렉션",
    tracksuitDescription:
      "Legathon 트랙수트 5개는 걷기 마일스톤으로 획득합니다. Premium 및 Elite 회원은 누적 걷기 진행도가 각 조건에 도달하면 컬렉션을 잠금 해제할 수 있습니다.",
    walkingRequired: "걷기 필요",
    tracksuitsCannotPurchase:
      "트랙수트는 구매할 수 없습니다",

    eliteExclusive: "👑 ELITE 전용",
    personalCoach: "개인 웰니스 코치",
    personalCoachDescription:
      "Elite 회원은 걷기 속도, 활동 추세 및 걷기 성과 데이터를 활용한 개인화된 텍스트 기반 웰니스 정보를 받습니다.",
    walkingDataNotice:
      "걷기 속도는 웰니스 및 활동 데이터입니다. 마일당 직접 현금 보상으로 사용되지 않습니다.",

    membershipComparison: "멤버십 비교",
    feature: "기능",
    prem: "PREM",

    comparison12Free: "무료 Journey 12개",
    allJourneys: "모든 Journey",
    legathons26: "26 Legathons",
    communityShort: "커뮤니티",
    leaderboard: "리더보드",
    walkingAnalytics: "걷기 분석",
    basic: "기본",
    advanced: "고급",
    paceMobilityShort: "속도 및 이동성",
    wcoinCollection: "WCoin 적립",
    tracksuitUnlocks: "트랙수트 잠금 해제",
    personalCoachShort: "개인 코치",
    freeShipping: "무료 배송",

    manageMembership: "멤버십 관리",
    manageDescription:
      "유료 멤버십 변경, 취소 및 갱신은 App Store 또는 Google Play 계정에서 관리됩니다.",
    manageSubscription: "구독 관리",

    footerTitle: "더 걷고. 더 경험하세요.",
    footerText:
      "Legathon 멤버십에 따라 이용 가능한 Journey, 보상, 분석, 웰니스 도구 및 상품 혜택이 결정됩니다.",
    return: "돌아가기",
    restorePurchases: "구매 복원",
    restoring: "복원 중...",
    privacyPolicy: "개인정보 처리방침",
    termsService: "서비스 이용약관",

    manageMembershipAlert: "멤버십 관리",
    manageMembershipMessage:
      "유료 Legathon Walk 멤버십은 App Store 또는 Google Play 계정에서 관리됩니다. 무료 플랜으로 돌아가기 전에 해당 계정에서 취소하거나 변경하세요.",
    keepMembership: "멤버십 유지",
    manageSubscriptionAlert: "구독 관리",

    checkoutUnavailable: "결제 이용 불가",
    checkoutUnavailableMessage:
      "구독 결제가 현재 연결되어 있지 않습니다.",

    restoreTitle: "구매 복원",
    restoreNotConnected:
      "구매 복원 기능은 아직 RevenueCat에 연결해야 합니다.",
    purchaseRestored: "구매 복원 완료",
    restoredPremium:
      "Premium 멤버십이 복원되었습니다.",
    restoredElite:
      "Elite 멤버십이 복원되었습니다.",
    noMembership: "활성 멤버십 없음",
    noMembershipMessage:
      "이 계정에서 활성 Premium 또는 Elite 멤버십을 찾을 수 없습니다.",
    unableRestore: "복원할 수 없음",
    unableRestoreMessage:
      "구매를 복원할 수 없습니다.",

    subscriptionSettingsUnavailable:
      "구독 설정을 사용할 수 없습니다.",
    manageFallback:
      "App Store 또는 Google Play 구독 설정에서 Legathon Walk 멤버십을 관리하거나 취소하세요.",

    privacyNotConnected:
      "개인정보 처리방침 화면이 아직 연결되지 않았습니다.",
    termsNotConnected:
      "서비스 이용약관 화면이 아직 연결되지 않았습니다.",
  },


  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    tagline: "为每一步而打造。",
    chooseMembership: "选择会员计划",
    subtitle:
      "免费开始，或通过 Premium 或 Elite 解锁完整的 Legathon Walk 体验。",

    currentPlan: "当前计划",
    active: "已启用",

    free: "免费",
    premium: "Premium",
    elite: "Elite",

    forever: "永久免费",
    perMonth: "/ 月",

    startWalking: "开始步行",
    mostPopular: "最受欢迎",
    bestValue: "最佳价值",

    currentPlanButton: "当前计划",
    chooseFree: "选择免费计划",
    manageFreePlan: "管理免费计划",
    choosePremium: "选择 PREMIUM",
    chooseElite: "选择 ELITE",

    free12Journeys: "12个免费Journey",
    community: "Legathon社区",
    leaderboardRankings: "排行榜与等级",
    basicAnalytics: "基础步行分析",
    collectWCoins: "收集WCoins",
    wcoinRedemption: "WCoin兑换",
    marathons26: "26场Legathon马拉松",
    allPremiumJourneys: "全部Premium Journey",
    tracksuitUnlocks5: "解锁5套运动服",
    paceMobility: "步行速度与行动趋势",
    aiWellnessCoach: "AI健康教练",
    personalWellnessCoach: "个人健康教练",

    allJourneys92: "全部92+ Journey",
    allMarathons26: "全部26场Legathon马拉松",
    fullLeaderboard: "完整排行榜与等级",
    advancedAnalytics: "高级步行分析",
    aiWalkingCoach: "AI步行教练",
    premiumMerchBenefits: "Premium商品福利",
    elitePersonalCoach: "Elite个人健康教练",
    eliteWCoinValue: "Elite WCoin兑换价值",
    freeMerchShipping: "商品免费配送",

    everythingPremium: "包含Premium全部功能",
    highestWCoinValue: "最高WCoin兑换价值",
    freeShippingUpper: "商品免费配送",
    eliteMerchBenefits: "Elite商品福利",

    walkCompleteEarn: "🪙 步行 • 完成 • 赚取",
    wcoinRewards: "WCoin奖励",
    rewardDescription:
      "完成符合条件的Legathon Walk活动和Journey即可赚取WCoins。随着进度增加，WCoins会累积到你的钱包中。",

    redemptionUnlock: "兑换解锁",
    tenThousandWCoins: "10,000 WCoins",
    redemptionDescription:
      "累计获得10,000 WCoins即可解锁付费会员的符合条件兑换福利。",

    freeUpper: "免费",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "收集",
    fiveDollarValue: "$5价值",
    tenDollarValue: "$10价值",

    freeCoinDescription:
      "赚取并收集WCoins。兑换功能保持锁定。",
    premiumCoinDescription:
      "解锁兑换后可使用10,000 WCoins。",
    eliteCoinDescription:
      "10,000 WCoins享受最高会员兑换价值。",

    rewardNote:
      "WCoins通过符合条件的Legathon活动和完成Journey获得，并不是按每英里直接支付现金。",

    milestoneRewards: "👕 步行里程碑奖励",
    tracksuitCollection: "运动服系列",
    tracksuitDescription:
      "五套Legathon运动服通过步行里程碑获得。Premium和Elite会员在累计步行进度达到各项要求后即可解锁。",
    walkingRequired: "需要步行",
    tracksuitsCannotPurchase:
      "运动服不能直接购买",

    eliteExclusive: "👑 ELITE专属",
    personalCoach: "个人健康教练",
    personalCoachDescription:
      "Elite会员可根据步行速度、活动趋势和步行表现数据获得个性化文字健康建议。",
    walkingDataNotice:
      "步行速度属于健康与活动数据，不会作为按每英里直接支付现金的依据。",

    membershipComparison: "会员计划比较",
    feature: "功能",
    prem: "PREM",

    comparison12Free: "12个免费Journey",
    allJourneys: "全部Journey",
    legathons26: "26个Legathons",
    communityShort: "社区",
    leaderboard: "排行榜",
    walkingAnalytics: "步行分析",
    basic: "基础",
    advanced: "高级",
    paceMobilityShort: "速度与行动力",
    wcoinCollection: "WCoin收集",
    tracksuitUnlocks: "运动服解锁",
    personalCoachShort: "个人教练",
    freeShipping: "免费配送",

    manageMembership: "管理会员",
    manageDescription:
      "付费会员的更改、取消和续订通过你的App Store或Google Play账户管理。",
    manageSubscription: "管理订阅",

    footerTitle: "多走一步，体验更多。",
    footerText:
      "你的Legathon会员等级决定账户可使用的Journey、奖励、分析、健康工具和商品福利。",
    return: "返回",
    restorePurchases: "恢复购买",
    restoring: "正在恢复...",
    privacyPolicy: "隐私政策",
    termsService: "服务条款",

    manageMembershipAlert: "管理会员",
    manageMembershipMessage:
      "你的Legathon Walk付费会员由App Store或Google Play管理。请先在那里取消或更改订阅，再返回免费计划。",
    keepMembership: "保留会员",
    manageSubscriptionAlert: "管理订阅",

    checkoutUnavailable: "无法结账",
    checkoutUnavailableMessage:
      "订阅结账功能目前尚未连接。",

    restoreTitle: "恢复购买",
    restoreNotConnected:
      "恢复购买功能仍需要连接RevenueCat。",
    purchaseRestored: "购买已恢复",
    restoredPremium:
      "你的Premium会员已恢复。",
    restoredElite:
      "你的Elite会员已恢复。",
    noMembership: "未找到有效会员",
    noMembershipMessage:
      "此账户没有找到有效的Premium或Elite会员。",
    unableRestore: "无法恢复",
    unableRestoreMessage:
      "无法恢复你的购买。",

    subscriptionSettingsUnavailable:
      "订阅设置当前不可用。",
    manageFallback:
      "请打开App Store或Google Play订阅设置来管理或取消Legathon Walk会员。",

    privacyNotConnected:
      "隐私政策页面尚未连接。",
    termsNotConnected:
      "服务条款页面尚未连接。",
  },


  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    tagline: "Creato per ogni passo.",
    chooseMembership: "Scegli il tuo abbonamento",
    subtitle:
      "Inizia gratis oppure sblocca l’esperienza completa Legathon Walk con Premium o Elite.",

    currentPlan: "PIANO ATTUALE",
    active: "ATTIVO",

    free: "Gratis",
    premium: "Premium",
    elite: "Elite",

    forever: "Per sempre",
    perMonth: "/ mese",

    startWalking: "INIZIA A CAMMINARE",
    mostPopular: "PIÙ POPOLARE",
    bestValue: "MIGLIOR VALORE",

    currentPlanButton: "PIANO ATTUALE",
    chooseFree: "SCEGLI GRATIS",
    manageFreePlan: "GESTISCI PIANO GRATIS",
    choosePremium: "SCEGLI PREMIUM",
    chooseElite: "SCEGLI ELITE",

    free12Journeys: "12 Journey gratuiti",
    community: "Community Legathon",
    leaderboardRankings: "Classifica e livelli",
    basicAnalytics: "Analisi base della camminata",
    collectWCoins: "Accumula WCoins",
    wcoinRedemption: "Riscatto WCoin",
    marathons26: "26 maratone Legathon",
    allPremiumJourneys: "Tutti i Journey Premium",
    tracksuitUnlocks5: "5 tute da sbloccare",
    paceMobility: "Ritmo di camminata e mobilità",
    aiWellnessCoach: "Coach benessere IA",
    personalWellnessCoach: "Coach personale benessere",

    allJourneys92: "Tutti i 92+ Journey",
    allMarathons26: "Tutte le 26 maratone Legathon",
    fullLeaderboard: "Classifica completa",
    advancedAnalytics: "Analisi avanzata della camminata",
    aiWalkingCoach: "Coach camminata IA",
    premiumMerchBenefits: "Vantaggi merchandise Premium",
    elitePersonalCoach: "Coach personale Elite",
    eliteWCoinValue: "Valore riscatto WCoin Elite",
    freeMerchShipping: "Spedizione merchandise gratuita",

    everythingPremium: "Tutto ciò che include Premium",
    highestWCoinValue: "Massimo valore di riscatto WCoin",
    freeShippingUpper: "SPEDIZIONE GRATUITA",
    eliteMerchBenefits: "Vantaggi merchandise Elite",

    walkCompleteEarn: "🪙 CAMMINA • COMPLETA • GUADAGNA",
    wcoinRewards: "Premi WCoin",
    rewardDescription:
      "Completa attività e Journey Legathon Walk idonei per guadagnare WCoins. I tuoi WCoins si accumulano nel portafoglio mentre avanzi.",

    redemptionUnlock: "SBLOCCO RISCATTO",
    tenThousandWCoins: "10.000 WCoins",
    redemptionDescription:
      "Raggiungi 10.000 WCoins guadagnati per sbloccare i vantaggi di riscatto disponibili con gli abbonamenti a pagamento.",

    freeUpper: "GRATIS",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "ACCUMULA",
    fiveDollarValue: "VALORE $5",
    tenDollarValue: "VALORE $10",

    freeCoinDescription:
      "Guadagna e accumula WCoins. Il riscatto resta bloccato.",
    premiumCoinDescription:
      "10.000 WCoins dopo lo sblocco del riscatto.",
    eliteCoinDescription:
      "10.000 WCoins al massimo valore di riscatto dell’abbonamento.",

    rewardNote:
      "I WCoins vengono guadagnati tramite attività Legathon idonee e completamento dei Journey. Non sono pagamenti diretti in contanti per miglio.",

    milestoneRewards: "👕 PREMI PER TRAGUARDI DI CAMMINATA",
    tracksuitCollection: "Collezione tute",
    tracksuitDescription:
      "Le cinque tute Legathon si guadagnano attraverso i traguardi di camminata. I membri Premium ed Elite possono sbloccarle raggiungendo ogni requisito.",
    walkingRequired: "CAMMINATA RICHIESTA",
    tracksuitsCannotPurchase:
      "Le tute non possono essere acquistate",

    eliteExclusive: "👑 ESCLUSIVA ELITE",
    personalCoach: "Coach personale benessere",
    personalCoachDescription:
      "I membri Elite ricevono informazioni personalizzate sul benessere in formato testuale usando ritmo di camminata, tendenze di attività e dati sulle prestazioni.",
    walkingDataNotice:
      "Il ritmo di camminata è un dato di benessere e attività. Non viene utilizzato come ricompensa diretta in contanti per miglio.",

    membershipComparison: "Confronto abbonamenti",
    feature: "FUNZIONE",
    prem: "PREM",

    comparison12Free: "12 Journey gratuiti",
    allJourneys: "Tutti i Journey",
    legathons26: "26 Legathons",
    communityShort: "Community",
    leaderboard: "Classifica",
    walkingAnalytics: "Analisi camminata",
    basic: "Base",
    advanced: "Avanzata",
    paceMobilityShort: "Ritmo e mobilità",
    wcoinCollection: "Raccolta WCoin",
    tracksuitUnlocks: "Sblocco tute",
    personalCoachShort: "Coach personale",
    freeShipping: "Spedizione gratis",

    manageMembership: "Gestisci abbonamento",
    manageDescription:
      "Modifiche, cancellazioni e rinnovi degli abbonamenti a pagamento vengono gestiti tramite App Store o Google Play.",
    manageSubscription: "GESTISCI ABBONAMENTO",

    footerTitle: "Cammina di più. Vivi di più.",
    footerText:
      "Il tuo abbonamento Legathon determina Journey, premi, analisi, strumenti di benessere e vantaggi merchandise disponibili.",
    return: "Indietro",
    restorePurchases: "RIPRISTINA ACQUISTI",
    restoring: "RIPRISTINO...",
    privacyPolicy: "Informativa sulla privacy",
    termsService: "Termini di servizio",

    manageMembershipAlert: "Gestisci il tuo abbonamento",
    manageMembershipMessage:
      "Il tuo abbonamento Legathon Walk a pagamento viene gestito tramite App Store o Google Play. Annullalo o modificalo lì prima di tornare al piano Gratis.",
    keepMembership: "Mantieni abbonamento",
    manageSubscriptionAlert: "Gestisci abbonamento",

    checkoutUnavailable: "Pagamento non disponibile",
    checkoutUnavailableMessage:
      "Il checkout degli abbonamenti non è attualmente collegato.",

    restoreTitle: "Ripristina acquisti",
    restoreNotConnected:
      "Il ripristino acquisti deve ancora essere collegato a RevenueCat.",
    purchaseRestored: "Acquisto ripristinato",
    restoredPremium:
      "Il tuo abbonamento Premium è stato ripristinato.",
    restoredElite:
      "Il tuo abbonamento Elite è stato ripristinato.",
    noMembership: "Nessun abbonamento attivo",
    noMembershipMessage:
      "Non è stato trovato alcun abbonamento Premium o Elite attivo per questo account.",
    unableRestore: "Impossibile ripristinare",
    unableRestoreMessage:
      "Non è stato possibile ripristinare i tuoi acquisti.",

    subscriptionSettingsUnavailable:
      "Le impostazioni dell’abbonamento non sono disponibili.",
    manageFallback:
      "Apri le impostazioni degli abbonamenti App Store o Google Play per gestire o annullare il tuo abbonamento Legathon Walk.",

    privacyNotConnected:
      "La navigazione alla Privacy Policy non è ancora collegata.",
    termsNotConnected:
      "La navigazione ai Termini di servizio non è ancora collegata.",
  },


  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    tagline: "مصمم لكل خطوة.",
    chooseMembership: "اختر عضويتك",
    subtitle:
      "ابدأ مجانًا أو افتح تجربة Legathon Walk الكاملة مع Premium أو Elite.",

    currentPlan: "الخطة الحالية",
    active: "نشطة",

    free: "مجاني",
    premium: "Premium",
    elite: "Elite",

    forever: "دائمًا",
    perMonth: "/ شهريًا",

    startWalking: "ابدأ المشي",
    mostPopular: "الأكثر شعبية",
    bestValue: "أفضل قيمة",

    currentPlanButton: "الخطة الحالية",
    chooseFree: "اختر المجاني",
    manageFreePlan: "إدارة الخطة المجانية",
    choosePremium: "اختر PREMIUM",
    chooseElite: "اختر ELITE",

    free12Journeys: "12 Journey مجانية",
    community: "مجتمع Legathon",
    leaderboardRankings: "لوحة الصدارة والتصنيفات",
    basicAnalytics: "تحليلات المشي الأساسية",
    collectWCoins: "اجمع WCoins",
    wcoinRedemption: "استبدال WCoin",
    marathons26: "26 ماراثون Legathon",
    allPremiumJourneys: "جميع Premium Journeys",
    tracksuitUnlocks5: "فتح 5 بدلات رياضية",
    paceMobility: "سرعة المشي واتجاهات الحركة",
    aiWellnessCoach: "مدرب العافية بالذكاء الاصطناعي",
    personalWellnessCoach: "مدرب العافية الشخصي",

    allJourneys92: "جميع الـ 92+ Journey",
    allMarathons26: "جميع ماراثونات Legathon الـ26",
    fullLeaderboard: "لوحة الصدارة والتصنيفات الكاملة",
    advancedAnalytics: "تحليلات المشي المتقدمة",
    aiWalkingCoach: "مدرب المشي بالذكاء الاصطناعي",
    premiumMerchBenefits: "مزايا منتجات Premium",
    elitePersonalCoach: "مدرب العافية الشخصي Elite",
    eliteWCoinValue: "قيمة استبدال WCoin لـ Elite",
    freeMerchShipping: "شحن المنتجات مجانًا",

    everythingPremium: "كل مزايا Premium",
    highestWCoinValue: "أعلى قيمة لاستبدال WCoin",
    freeShippingUpper: "شحن المنتجات مجانًا",
    eliteMerchBenefits: "مزايا منتجات Elite",

    walkCompleteEarn: "🪙 امشِ • أكمل • اكسب",
    wcoinRewards: "مكافآت WCoin",
    rewardDescription:
      "أكمل أنشطة وJourneys المؤهلة في Legathon Walk لكسب WCoins. تتراكم WCoins في محفظتك مع تقدمك.",

    redemptionUnlock: "فتح الاستبدال",
    tenThousandWCoins: "10,000 WCoins",
    redemptionDescription:
      "اكسب 10,000 WCoins لفتح مزايا الاستبدال المؤهلة في العضويات المدفوعة.",

    freeUpper: "مجاني",
    premiumUpper: "PREMIUM",
    eliteUpper: "ELITE",

    collect: "اجمع",
    fiveDollarValue: "قيمة $5",
    tenDollarValue: "قيمة $10",

    freeCoinDescription:
      "اكسب واجمع WCoins. يبقى الاستبدال مقفلاً.",
    premiumCoinDescription:
      "10,000 WCoins بعد فتح الاستبدال.",
    eliteCoinDescription:
      "10,000 WCoins بأعلى قيمة استبدال للعضوية.",

    rewardNote:
      "يتم كسب WCoins من خلال أنشطة Legathon المؤهلة وإكمال Journeys. وهي ليست مدفوعات نقدية مباشرة لكل ميل.",

    milestoneRewards: "👕 مكافآت إنجازات المشي",
    tracksuitCollection: "مجموعة البدلات الرياضية",
    tracksuitDescription:
      "يتم كسب بدلات Legathon الرياضية الخمس من خلال إنجازات المشي. يمكن لأعضاء Premium وElite فتح المجموعة عند الوصول إلى كل متطلب.",
    walkingRequired: "المشي مطلوب",
    tracksuitsCannotPurchase:
      "لا يمكن شراء البدلات الرياضية",

    eliteExclusive: "👑 حصري لـ ELITE",
    personalCoach: "مدرب العافية الشخصي",
    personalCoachDescription:
      "يحصل أعضاء Elite على إرشادات عافية شخصية نصية باستخدام سرعة المشي واتجاهات النشاط وبيانات أداء المشي.",
    walkingDataNotice:
      "سرعة المشي هي بيانات عافية ونشاط، ولا تُستخدم كمكافأة نقدية مباشرة لكل ميل.",

    membershipComparison: "مقارنة العضويات",
    feature: "الميزة",
    prem: "PREM",

    comparison12Free: "12 Journey مجانية",
    allJourneys: "جميع Journeys",
    legathons26: "26 Legathons",
    communityShort: "المجتمع",
    leaderboard: "لوحة الصدارة",
    walkingAnalytics: "تحليلات المشي",
    basic: "أساسي",
    advanced: "متقدم",
    paceMobilityShort: "السرعة والحركة",
    wcoinCollection: "جمع WCoin",
    tracksuitUnlocks: "فتح البدلات",
    personalCoachShort: "المدرب الشخصي",
    freeShipping: "شحن مجاني",

    manageMembership: "إدارة العضوية",
    manageDescription:
      "تتم إدارة تغييرات وإلغاءات وتجديدات العضويات المدفوعة من خلال حساب App Store أو Google Play.",
    manageSubscription: "إدارة الاشتراك",

    footerTitle: "امشِ أكثر. اختبر أكثر.",
    footerText:
      "تحدد عضويتك في Legathon الـJourneys والمكافآت والتحليلات وأدوات العافية ومزايا المنتجات المتاحة لحسابك.",
    return: "رجوع",
    restorePurchases: "استعادة المشتريات",
    restoring: "جارٍ الاستعادة...",
    privacyPolicy: "سياسة الخصوصية",
    termsService: "شروط الخدمة",

    manageMembershipAlert: "إدارة عضويتك",
    manageMembershipMessage:
      "تتم إدارة عضوية Legathon Walk المدفوعة عبر App Store أو Google Play. قم بإلغاء أو تغيير الاشتراك هناك قبل العودة إلى الخطة المجانية.",
    keepMembership: "الاحتفاظ بالعضوية",
    manageSubscriptionAlert: "إدارة الاشتراك",

    checkoutUnavailable: "الدفع غير متاح",
    checkoutUnavailableMessage:
      "عملية دفع الاشتراك غير متصلة حاليًا.",

    restoreTitle: "استعادة المشتريات",
    restoreNotConnected:
      "لا تزال استعادة المشتريات بحاجة إلى الاتصال بـ RevenueCat.",
    purchaseRestored: "تمت استعادة الشراء",
    restoredPremium:
      "تمت استعادة عضوية Premium الخاصة بك.",
    restoredElite:
      "تمت استعادة عضوية Elite الخاصة بك.",
    noMembership: "لم يتم العثور على عضوية نشطة",
    noMembershipMessage:
      "لم يتم العثور على عضوية Premium أو Elite نشطة لهذا الحساب.",
    unableRestore: "تعذرت الاستعادة",
    unableRestoreMessage:
      "تعذر استعادة مشترياتك.",

    subscriptionSettingsUnavailable:
      "إعدادات الاشتراك غير متاحة.",
    manageFallback:
      "افتح إعدادات الاشتراك في App Store أو Google Play لإدارة أو إلغاء عضوية Legathon Walk.",

    privacyNotConnected:
      "صفحة سياسة الخصوصية غير متصلة بعد.",
    termsNotConnected:
      "صفحة شروط الخدمة غير متصلة بعد.",
  },
};


// ============================================================
// LANGUAGE FALLBACKS
// French is also used as the safe fallback for any missing
// language-specific key below.
// ============================================================

TEXT.fr = {
  ...TEXT.en,
  ...TEXT.fr,
};

TEXT.es = {
  ...TEXT.en,
  ...TEXT.es,
};

TEXT.de = {
  ...TEXT.en,
  ...TEXT.de,
};

TEXT.pt = {
  ...TEXT.en,
  ...TEXT.pt,
};

TEXT.ja = {
  ...TEXT.en,
  ...TEXT.ja,
};

TEXT.ko = {
  ...TEXT.en,
  ...TEXT.ko,
};

TEXT.zh = {
  ...TEXT.en,
  ...TEXT.zh,
};

TEXT.it = {
  ...TEXT.en,
  ...TEXT.it,
};

TEXT.ar = {
  ...TEXT.en,
  ...TEXT.ar,
};


// ============================================================
// MEMBERSHIP CONFIGURATION
// INTERNAL IDS STAY ENGLISH
// ============================================================

const SUBSCRIPTION_CARDS = [
  {
    id: "free",
    titleKey: "free",
    price: "$0",
    periodKey: "forever",
    image: FREE_CARD,
    badgeKey: "startWalking",
    accent: "#58E8C1",
  },

  {
    id: "premium",
    titleKey: "premium",
    price: "$4.99",
    periodKey: "perMonth",
    image: PREMIUM_CARD,
    badgeKey: "mostPopular",
    accent: "#D8A72E",
  },

  {
    id: "elite",
    titleKey: "elite",
    price: "$9.99",
    periodKey: "perMonth",
    image: ELITE_CARD,
    badgeKey: "bestValue",
    accent: "#B28CFF",
  },
];


// ============================================================
// PLAN FEATURES
// ============================================================

const PLAN_FEATURES = {
  free: [
    { icon: "🌎", key: "free12Journeys", available: true },
    { icon: "👥", key: "community", available: true },
    { icon: "🏆", key: "leaderboardRankings", available: true },
    { icon: "📊", key: "basicAnalytics", available: true },
    { icon: "🪙", key: "collectWCoins", available: true },
    { icon: "🔒", key: "wcoinRedemption", available: false },
    { icon: "🔒", key: "marathons26", available: false },
    { icon: "🔒", key: "allPremiumJourneys", available: false },
    { icon: "🔒", key: "tracksuitUnlocks5", available: false },
    { icon: "🔒", key: "paceMobility", available: false },
    { icon: "🔒", key: "aiWellnessCoach", available: false },
    { icon: "🔒", key: "personalWellnessCoach", available: false },
  ],

  premium: [
    { icon: "🌎", key: "allJourneys92", available: true },
    { icon: "🏁", key: "allMarathons26", available: true },
    { icon: "👥", key: "community", available: true },
    { icon: "🏆", key: "fullLeaderboard", available: true },
    { icon: "📈", key: "advancedAnalytics", available: true },
    { icon: "🚶", key: "paceMobility", available: true },
    { icon: "🧠", key: "aiWellnessCoach", available: true },
    { icon: "💬", key: "aiWalkingCoach", available: true },
    { icon: "👕", key: "tracksuitUnlocks5", available: true },
    { icon: "🪙", key: "wcoinRedemption", available: true },
    { icon: "🎁", key: "premiumMerchBenefits", available: true },

    {
      icon: "🔒",
      key: "elitePersonalCoach",
      available: false,
    },

    {
      icon: "🔒",
      key: "eliteWCoinValue",
      available: false,
    },

    {
      icon: "🔒",
      key: "freeMerchShipping",
      available: false,
    },
  ],

  elite: [
    {
      icon: "👑",
      key: "everythingPremium",
      available: true,
      highlight: true,
    },

    { icon: "🌎", key: "allJourneys92", available: true },
    { icon: "🏁", key: "allMarathons26", available: true },
    { icon: "🏆", key: "fullLeaderboard", available: true },
    { icon: "📈", key: "advancedAnalytics", available: true },
    { icon: "🚶", key: "paceMobility", available: true },
    { icon: "🧠", key: "aiWellnessCoach", available: true },
    { icon: "💬", key: "aiWalkingCoach", available: true },

    {
      icon: "⭐",
      key: "personalWellnessCoach",
      available: true,
      highlight: true,
    },

    { icon: "👕", key: "tracksuitUnlocks5", available: true },

    {
      icon: "🪙",
      key: "highestWCoinValue",
      available: true,
      highlight: true,
    },

    {
      icon: "📦",
      key: "freeShippingUpper",
      available: true,
      highlight: true,
    },

    {
      icon: "🎁",
      key: "eliteMerchBenefits",
      available: true,
    },
  ],
};


// ============================================================
// MAIN SCREEN
// ============================================================

export default function SubscriptionScreen({
  language = "en",

  subscriptionPlan = "free",

  setSubscriptionPlan,

  goBack,

  goHome,

  goToPaywall,

  onRestorePurchases,

  goToPrivacyPolicy,

  goToTermsOfService,
}) {
  const languageCode =
    useMemo(
      () =>
        normalizeLanguage(
          language
        ),
      [language]
    );


  const isRTL =
    languageCode === "ar";


  const t = (key) =>
    TEXT?.[languageCode]?.[key] ||
    TEXT.en[key] ||
    key;


  // ==========================================================
  // STATE
  // ==========================================================

  const pulseAnim =
    useRef(
      new Animated.Value(1)
    ).current;


  const [
    isRestoring,
    setIsRestoring,
  ] = useState(false);


  // ==========================================================
  // CURRENT PLAN
  // ==========================================================

  const normalizedCurrentPlan =
    String(
      subscriptionPlan ||
      "free"
    ).toLowerCase();


  const currentPlan =
    SUBSCRIPTION_CARDS.find(
      (plan) =>
        plan.id ===
        normalizedCurrentPlan
    ) ||
    SUBSCRIPTION_CARDS[0];


  const hasPaidMembership =
    normalizedCurrentPlan ===
      "premium" ||
    normalizedCurrentPlan ===
      "elite";


  // ==========================================================
  // CARD ANIMATION
  // ==========================================================

  const animateSelection =
    () => {
      Animated.sequence([
        Animated.timing(
          pulseAnim,
          {
            toValue: 0.98,
            duration: 90,
            useNativeDriver: true,
          }
        ),

        Animated.spring(
          pulseAnim,
          {
            toValue: 1,
            friction: 4,
            tension: 70,
            useNativeDriver: true,
          }
        ),
      ]).start();
    };


  // ==========================================================
  // MANAGE APP STORE / GOOGLE PLAY SUBSCRIPTION
  // ==========================================================

  const openSubscriptionSettings =
    async () => {
      try {
        const url =
          Platform.OS === "ios"
            ? "https://apps.apple.com/account/subscriptions"
            : "https://play.google.com/store/account/subscriptions";


        const supported =
          await Linking.canOpenURL(
            url
          );


        if (!supported) {
          throw new Error(
            t(
              "subscriptionSettingsUnavailable"
            )
          );
        }


        await Linking.openURL(
          url
        );

      } catch (error) {
        console.log(
          "OPEN SUBSCRIPTION SETTINGS ERROR:",
          error
        );


        Alert.alert(
          t(
            "manageMembership"
          ),
          t(
            "manageFallback"
          )
        );
      }
    };


  // ==========================================================
  // SELECT PLAN
  // ==========================================================

  const handlePlanSelect =
    (planId) => {
      const nextPlan =
        String(
          planId || ""
        ).toLowerCase();


      if (!nextPlan) {
        return;
      }


      if (
        nextPlan ===
        normalizedCurrentPlan
      ) {
        return;
      }


      animateSelection();


      // ======================================================
      // FREE PLAN
      // ======================================================

      if (
        nextPlan === "free"
      ) {
        if (
          hasPaidMembership
        ) {
          Alert.alert(
            t(
              "manageMembershipAlert"
            ),

            t(
              "manageMembershipMessage"
            ),

            [
              {
                text:
                  t(
                    "keepMembership"
                  ),

                style:
                  "cancel",
              },

              {
                text:
                  t(
                    "manageSubscriptionAlert"
                  ),

                onPress:
                  openSubscriptionSettings,
              },
            ]
          );


          return;
        }


        if (
          typeof setSubscriptionPlan ===
          "function"
        ) {
          setSubscriptionPlan(
            "free"
          );
        }


        return;
      }


      // ======================================================
      // PREMIUM / ELITE
      // ======================================================

      if (
        nextPlan === "premium" ||
        nextPlan === "elite"
      ) {
        if (
          typeof goToPaywall ===
          "function"
        ) {
          goToPaywall(
            nextPlan
          );

          return;
        }


        Alert.alert(
          t(
            "checkoutUnavailable"
          ),

          t(
            "checkoutUnavailableMessage"
          )
        );
      }
    };


  // ==========================================================
  // RESTORE PURCHASES
  // ==========================================================

  const handleRestorePurchases =
    async () => {
      if (
        isRestoring
      ) {
        return;
      }


      if (
        typeof onRestorePurchases !==
        "function"
      ) {
        Alert.alert(
          t(
            "restoreTitle"
          ),

          t(
            "restoreNotConnected"
          )
        );

        return;
      }


      try {
        setIsRestoring(
          true
        );


        const restoredPlan =
          await onRestorePurchases();


        const normalizedRestoredPlan =
          String(
            restoredPlan || ""
          ).toLowerCase();


        if (
          normalizedRestoredPlan ===
            "premium" ||
          normalizedRestoredPlan ===
            "elite"
        ) {
          if (
            typeof setSubscriptionPlan ===
            "function"
          ) {
            setSubscriptionPlan(
              normalizedRestoredPlan
            );
          }


          Alert.alert(
            t(
              "purchaseRestored"
            ),

            normalizedRestoredPlan ===
            "elite"
              ? t(
                  "restoredElite"
                )
              : t(
                  "restoredPremium"
                )
          );


          return;
        }


        Alert.alert(
          t(
            "noMembership"
          ),

          t(
            "noMembershipMessage"
          )
        );

      } catch (error) {
        console.log(
          "RESTORE PURCHASE ERROR:",
          error
        );


        Alert.alert(
          t(
            "unableRestore"
          ),

          error?.message ||
            t(
              "unableRestoreMessage"
            )
        );

      } finally {
        setIsRestoring(
          false
        );
      }
    };


  // ==========================================================
  // PRIVACY
  // ==========================================================

  const handlePrivacyPolicy =
    () => {
      if (
        typeof goToPrivacyPolicy ===
        "function"
      ) {
        goToPrivacyPolicy();

        return;
      }


      Alert.alert(
        t(
          "privacyPolicy"
        ),

        t(
          "privacyNotConnected"
        )
      );
    };


  // ==========================================================
  // TERMS
  // ==========================================================

  const handleTerms =
    () => {
      if (
        typeof goToTermsOfService ===
        "function"
      ) {
        goToTermsOfService();

        return;
      }


      Alert.alert(
        t(
          "termsService"
        ),

        t(
          "termsNotConnected"
        )
      );
    };


  // ==========================================================
  // RETURN
  // ==========================================================

  const handleReturn =
    () => {
      if (
        typeof goBack ===
        "function"
      ) {
        goBack();

        return;
      }


      if (
        typeof goHome ===
        "function"
      ) {
        goHome();
      }
    };


  // ==========================================================
  // PLAN BUTTON LABEL
  // ==========================================================

  const getPlanButtonLabel =
    (card) => {
      if (
        normalizedCurrentPlan ===
        card.id
      ) {
        return t(
          "currentPlanButton"
        );
      }


      if (
        card.id === "free"
      ) {
        return hasPaidMembership
          ? t(
              "manageFreePlan"
            )
          : t(
              "chooseFree"
            );
      }


      if (
        card.id === "premium"
      ) {
        return t(
          "choosePremium"
        );
      }


      return t(
        "chooseElite"
      );
    };


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >
      <ScrollView
        style={
          styles.container
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <View
          style={[
            styles.header,

            isRTL &&
              styles.rowRTL,
          ]}
        >
          <TouchableOpacity
            onPress={
              handleReturn
            }
            activeOpacity={
              0.7
            }
            style={
              styles.backButton
            }
          >
            <Text
              style={
                styles.backArrow
              }
            >
              {isRTL
                ? "›"
                : "‹"}
            </Text>
          </TouchableOpacity>


          <View
            style={
              styles.headerTextWrap
            }
          >
            <Text
              style={
                styles.brand
              }
            >
              <Text
                style={
                  styles.brandBlue
                }
              >
                LEGATHON
              </Text>

              {" "}
              WALK
            </Text>


            <View
              style={
                styles.goldLine
              }
            />


            <Text
              style={[
                styles.tagline,

                isRTL &&
                  styles.rtlCenter,
              ]}
            >
              {t(
                "tagline"
              )}
            </Text>
          </View>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <Text
          style={[
            styles.screenTitle,

            isRTL &&
              styles.rtlCenter,
          ]}
        >
          {t(
            "chooseMembership"
          )}
        </Text>


        <Text
          style={[
            styles.screenSubtitle,

            isRTL &&
              styles.rtlCenter,
          ]}
        >
          {t(
            "subtitle"
          )}
        </Text>


        {/* ================================================== */}
        {/* CURRENT PLAN */}
        {/* ================================================== */}

        <View
          style={[
            styles.currentPlanPanel,

            isRTL &&
              styles.rowRTL,
          ]}
        >
          <View>
            <Text
              style={[
                styles.currentPlanLabel,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "currentPlan"
              )}
            </Text>


            <Text
              style={[
                styles.currentPlanName,

                {
                  color:
                    currentPlan.accent,
                },

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                currentPlan.titleKey
              )}
            </Text>
          </View>


          <View
            style={[
              styles.activeBadge,

              {
                borderColor:
                  currentPlan.accent,
              },

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <View
              style={[
                styles.activeDot,

                {
                  backgroundColor:
                    currentPlan.accent,
                },
              ]}
            />


            <Text
              style={[
                styles.activeBadgeText,

                {
                  color:
                    currentPlan.accent,
                },

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "active"
              )}
            </Text>
          </View>
        </View>


        {/* ================================================== */}
        {/* PLAN CARDS */}
        {/* ================================================== */}

        {SUBSCRIPTION_CARDS.map(
          (card) => {
            const isCurrent =
              normalizedCurrentPlan ===
              card.id;


            return (
              <Animated.View
                key={
                  card.id
                }
                style={[
                  styles.cardWrap,

                  isCurrent &&
                    styles.currentCardWrap,

                  isCurrent && {
                    borderColor:
                      card.accent,
                  },

                  {
                    transform: [
                      {
                        scale:
                          isCurrent
                            ? pulseAnim
                            : 1,
                      },
                    ],
                  },
                ]}
              >

                {/* BADGES */}

                <View
                  style={[
                    styles.cardTopRow,

                    isRTL &&
                      styles.rowRTL,
                  ]}
                >
                  <View
                    style={[
                      styles.planBadge,

                      {
                        borderColor:
                          card.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.planBadgeText,

                        {
                          color:
                            card.accent,
                        },

                        isRTL &&
                          styles.rtlText,
                      ]}
                    >
                      {t(
                        card.badgeKey
                      )}
                    </Text>
                  </View>


                  {isCurrent && (
                    <View
                      style={[
                        styles.currentBadge,

                        {
                          backgroundColor:
                            card.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.currentBadgeText,

                          isRTL &&
                            styles.rtlText,
                        ]}
                      >
                        {t(
                          "currentPlan"
                        )}
                      </Text>
                    </View>
                  )}
                </View>


                {/* IMAGE */}

                <ImageBackground
                  source={
                    card.image
                  }
                  style={
                    styles.cardImage
                  }
                  imageStyle={
                    styles.cardImageStyle
                  }
                  resizeMode="cover"
                >
                  <View
                    style={
                      styles.cardImageShade
                    }
                  />
                </ImageBackground>


                {/* PRICE */}

                <View
                  style={[
                    styles.priceArea,

                    isRTL &&
                      styles.rowRTL,
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.planTitle,

                        isRTL &&
                          styles.rtlText,
                      ]}
                    >
                      {t(
                        card.titleKey
                      )}
                    </Text>


                    <View
                      style={[
                        styles.priceRow,

                        isRTL &&
                          styles.rowRTL,
                      ]}
                    >
                      <Text
                        style={[
                          styles.price,

                          {
                            color:
                              card.accent,
                          },
                        ]}
                      >
                        {card.price}
                      </Text>


                      <Text
                        style={[
                          styles.pricePeriod,

                          isRTL &&
                            styles.rtlText,
                        ]}
                      >
                        {t(
                          card.periodKey
                        )}
                      </Text>
                    </View>
                  </View>


                  {card.id ===
                    "elite" && (
                    <View
                      style={
                        styles.crownCircle
                      }
                    >
                      <Text
                        style={
                          styles.crownIcon
                        }
                      >
                        ♛
                      </Text>
                    </View>
                  )}
                </View>


                {/* FEATURES */}

                <View
                  style={
                    styles.featureList
                  }
                >
                  {PLAN_FEATURES[
                    card.id
                  ].map(
                    (
                      feature,
                      index
                    ) => (
                      <View
                        key={`${card.id}-${index}`}
                        style={[
                          styles.featureRow,

                          feature.highlight &&
                            styles.highlightFeature,

                          isRTL &&
                            styles.rowRTL,
                        ]}
                      >
                        <Text
                          style={
                            styles.featureIcon
                          }
                        >
                          {feature.icon}
                        </Text>


                        <Text
                          style={[
                            styles.featureText,

                            !feature.available &&
                              styles.lockedFeatureText,

                            feature.highlight && {
                              color:
                                card.accent,
                            },

                            isRTL &&
                              styles.rtlText,
                          ]}
                        >
                          {t(
                            feature.key
                          )}
                        </Text>
                      </View>
                    )
                  )}
                </View>


                {/* BUTTON */}

                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  disabled={
                    isCurrent
                  }
                  onPress={() =>
                    handlePlanSelect(
                      card.id
                    )
                  }
                  style={[
                    styles.planButton,

                    {
                      borderColor:
                        card.accent,
                    },

                    isCurrent &&
                      styles.currentPlanButton,

                    !isCurrent && {
                      backgroundColor:
                        card.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.planButtonText,

                      isCurrent
                        ? {
                            color:
                              card.accent,
                          }
                        : styles.planButtonActiveText,

                      isRTL &&
                        styles.rtlCenter,
                    ]}
                  >
                    {getPlanButtonLabel(
                      card
                    )}
                  </Text>
                </TouchableOpacity>

              </Animated.View>
            );
          }
        )}


        {/* ================================================== */}
        {/* WCOIN REWARDS */}
        {/* ================================================== */}

        <View
          style={
            styles.rewardBox
          }
        >
          <Text
            style={[
              styles.sectionEyebrow,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "walkCompleteEarn"
            )}
          </Text>


          <Text
            style={[
              styles.rewardTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "wcoinRewards"
            )}
          </Text>


          <Text
            style={[
              styles.rewardDescription,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "rewardDescription"
            )}
          </Text>


          <View
            style={
              styles.unlockBox
            }
          >
            <Text
              style={[
                styles.unlockSmall,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "redemptionUnlock"
              )}
            </Text>


            <Text
              style={[
                styles.unlockAmount,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "tenThousandWCoins"
              )}
            </Text>


            <Text
              style={[
                styles.unlockDescription,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "redemptionDescription"
              )}
            </Text>
          </View>


          <View
            style={
              styles.coinComparison
            }
          >
            <CoinTier
              name={
                t(
                  "freeUpper"
                )
              }
              value={
                t(
                  "collect"
                )
              }
              description={
                t(
                  "freeCoinDescription"
                )
              }
              isRTL={
                isRTL
              }
            />


            <View
              style={
                styles.coinDivider
              }
            />


            <CoinTier
              name={
                t(
                  "premiumUpper"
                )
              }
              value={
                t(
                  "fiveDollarValue"
                )
              }
              description={
                t(
                  "premiumCoinDescription"
                )
              }
              valueStyle={
                styles.premiumCoinValue
              }
              isRTL={
                isRTL
              }
            />


            <View
              style={
                styles.coinDivider
              }
            />


            <CoinTier
              name={
                t(
                  "eliteUpper"
                )
              }
              value={
                t(
                  "tenDollarValue"
                )
              }
              description={
                t(
                  "eliteCoinDescription"
                )
              }
              valueStyle={
                styles.eliteCoinValue
              }
              isRTL={
                isRTL
              }
            />
          </View>


          <Text
            style={[
              styles.rewardNote,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "rewardNote"
            )}
          </Text>
        </View>


        {/* ================================================== */}
        {/* TRACKSUITS */}
        {/* ================================================== */}

        <View
          style={
            styles.infoBox
          }
        >
          <Text
            style={[
              styles.infoEyebrow,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "milestoneRewards"
            )}
          </Text>


          <Text
            style={[
              styles.infoTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "tracksuitCollection"
            )}
          </Text>


          <Text
            style={[
              styles.infoText,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "tracksuitDescription"
            )}
          </Text>


          <View
            style={[
              styles.lockStatus,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <Text
              style={[
                styles.lockStatusIcon,

                isRTL &&
                  styles.rtlIcon,
              ]}
            >
              👟
            </Text>


            <View
              style={
                styles.lockStatusTextWrap
              }
            >
              <Text
                style={[
                  styles.lockStatusTitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "walkingRequired"
                )}
              </Text>


              <Text
                style={[
                  styles.lockStatusText,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "tracksuitsCannotPurchase"
                )}
              </Text>
            </View>
          </View>
        </View>


        {/* ================================================== */}
        {/* ELITE WELLNESS */}
        {/* ================================================== */}

        <View
          style={
            styles.eliteCoachBox
          }
        >
          <Text
            style={[
              styles.eliteEyebrow,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "eliteExclusive"
            )}
          </Text>


          <Text
            style={[
              styles.eliteCoachTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "personalCoach"
            )}
          </Text>


          <Text
            style={[
              styles.eliteCoachText,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "personalCoachDescription"
            )}
          </Text>


          <View
            style={[
              styles.dataNotice,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <Text
              style={[
                styles.dataNoticeIcon,

                isRTL &&
                  styles.rtlIcon,
              ]}
            >
              🚶
            </Text>


            <Text
              style={[
                styles.dataNoticeText,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "walkingDataNotice"
              )}
            </Text>
          </View>
        </View>


        {/* ================================================== */}
        {/* COMPARISON */}
        {/* ================================================== */}

        <View
          style={
            styles.comparisonBox
          }
        >
          <Text
            style={[
              styles.comparisonTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "membershipComparison"
            )}
          </Text>


          <View
            style={
              styles.tableHeader
            }
          >
            <Text
              style={[
                styles.tableFeatureHeader,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "feature"
              )}
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              {t(
                "freeUpper"
              )}
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              {t(
                "prem"
              )}
            </Text>


            <Text
              style={
                styles.tablePlanHeader
              }
            >
              {t(
                "eliteUpper"
              )}
            </Text>
          </View>


          <ComparisonRow
            label={
              t(
                "comparison12Free"
              )
            }
            free="✓"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "allJourneys"
              )
            }
            free="—"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "legathons26"
              )
            }
            free="—"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "communityShort"
              )
            }
            free="✓"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "leaderboard"
              )
            }
            free="✓"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "walkingAnalytics"
              )
            }
            free={
              t(
                "basic"
              )
            }
            premium={
              t(
                "advanced"
              )
            }
            elite={
              t(
                "advanced"
              )
            }
            small
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "paceMobilityShort"
              )
            }
            free="—"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "wcoinCollection"
              )
            }
            free="✓"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "wcoinRedemption"
              )
            }
            free="—"
            premium="$5"
            elite="$10"
            small
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "tracksuitUnlocks"
              )
            }
            free="—"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "aiWellnessCoach"
              )
            }
            free="—"
            premium="✓"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "personalCoachShort"
              )
            }
            free="—"
            premium="—"
            elite="✓"
            isRTL={
              isRTL
            }
          />


          <ComparisonRow
            label={
              t(
                "freeShipping"
              )
            }
            free="—"
            premium="—"
            elite="✓"
            isRTL={
              isRTL
            }
          />
        </View>


        {/* ================================================== */}
        {/* SUBSCRIPTION MANAGEMENT */}
        {/* ================================================== */}

        {hasPaidMembership && (
          <View
            style={
              styles.manageBox
            }
          >
            <Text
              style={[
                styles.manageTitle,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "manageMembership"
              )}
            </Text>


            <Text
              style={[
                styles.manageText,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "manageDescription"
              )}
            </Text>


            <TouchableOpacity
              style={
                styles.manageButton
              }
              onPress={
                openSubscriptionSettings
              }
              activeOpacity={
                0.8
              }
            >
              <Text
                style={[
                  styles.manageButtonText,

                  isRTL &&
                    styles.rtlCenter,
                ]}
              >
                {t(
                  "manageSubscription"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <View
          style={
            styles.footer
          }
        >
          <Text
            style={[
              styles.footerTitle,

              isRTL &&
                styles.rtlCenter,
            ]}
          >
            {t(
              "footerTitle"
            )}
          </Text>


          <Text
            style={[
              styles.footerText,

              isRTL &&
                styles.rtlCenter,
            ]}
          >
            {t(
              "footerText"
            )}
          </Text>


          <TouchableOpacity
            style={
              styles.returnButton
            }
            onPress={
              handleReturn
            }
            activeOpacity={
              0.8
            }
          >
            <Text
              style={[
                styles.returnText,

                isRTL &&
                  styles.rtlCenter,
              ]}
            >
              {t(
                "return"
              )}
            </Text>
          </TouchableOpacity>


          {/* RESTORE PURCHASES */}

          <TouchableOpacity
            style={
              styles.restoreButton
            }
            onPress={
              handleRestorePurchases
            }
            disabled={
              isRestoring
            }
            activeOpacity={
              0.8
            }
          >
            {isRestoring ? (
              <View
                style={[
                  styles.restoreRow,

                  isRTL &&
                    styles.rowRTL,
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color="#D8A72E"
                />


                <Text
                  style={[
                    styles.restoreText,

                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {t(
                    "restoring"
                  )}
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.restoreText,

                  isRTL &&
                    styles.rtlCenter,
                ]}
              >
                {t(
                  "restorePurchases"
                )}
              </Text>
            )}
          </TouchableOpacity>


          <View
            style={[
              styles.footerLinks,

              isRTL &&
                styles.rowRTL,
            ]}
          >
            <TouchableOpacity
              onPress={
                handlePrivacyPolicy
              }
            >
              <Text
                style={[
                  styles.footerLink,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "privacyPolicy"
                )}
              </Text>
            </TouchableOpacity>


            <Text
              style={
                styles.footerDot
              }
            >
              •
            </Text>


            <TouchableOpacity
              onPress={
                handleTerms
              }
            >
              <Text
                style={[
                  styles.footerLink,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "termsService"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View
          style={
            styles.bottomSpace
          }
        />

      </ScrollView>
    </SafeAreaView>
  );
}


// ============================================================
// COIN TIER
// ============================================================

function CoinTier({
  name,
  value,
  description,
  valueStyle,
  isRTL = false,
}) {
  return (
    <View
      style={
        styles.coinTier
      }
    >
      <Text
        style={[
          styles.coinTierName,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {name}
      </Text>


      <Text
        style={[
          styles.coinTierValue,
          valueStyle,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {value}
      </Text>


      <Text
        style={[
          styles.coinTierDescription,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {description}
      </Text>
    </View>
  );
}


// ============================================================
// COMPARISON ROW
// ============================================================

function ComparisonRow({
  label,
  free,
  premium,
  elite,
  small = false,
  isRTL = false,
}) {
  return (
    <View
      style={
        styles.tableRow
      }
    >
      <Text
        style={[
          styles.tableLabel,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {label}
      </Text>


      <Text
        style={[
          styles.tableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {free}
      </Text>


      <Text
        style={[
          styles.tableValue,

          styles.premiumTableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {premium}
      </Text>


      <Text
        style={[
          styles.tableValue,

          styles.eliteTableValue,

          small &&
            styles.tableValueSmall,
        ]}
      >
        {elite}
      </Text>
    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor: "#05070C",
    },

    container: {
      flex: 1,
      backgroundColor: "#05070C",
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 160,
    },

    bottomSpace: {
      height: 120,
    },


    // ========================================================
    // RTL
    // ========================================================

    rowRTL: {
      flexDirection: "row-reverse",
    },

    rtlText: {
      writingDirection: "rtl",
      textAlign: "right",
    },

    rtlCenter: {
      writingDirection: "rtl",
      textAlign: "center",
    },

    rtlIcon: {
      marginRight: 0,
      marginLeft: 13,
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    backButton: {
      width: 54,
      height: 54,
      borderRadius: 27,
      borderWidth: 1,
      borderColor: "#374151",
      backgroundColor: "#101722",
      alignItems: "center",
      justifyContent: "center",
    },

    backArrow: {
      color: "#D8A72E",
      fontSize: 48,
      fontWeight: "300",
      lineHeight: 48,
      marginTop: -5,
    },

    headerTextWrap: {
      flex: 1,
      alignItems: "center",
    },

    headerSpacer: {
      width: 54,
    },

    brand: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    brandBlue: {
      color: "#1E7BFF",
    },

    goldLine: {
      width: 170,
      height: 3,
      borderRadius: 999,
      backgroundColor: "#D8A72E",
      marginTop: 6,
      marginBottom: 7,
    },

    tagline: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "800",
    },


    // ========================================================
    // TITLE
    // ========================================================

    screenTitle: {
      color: "#FFFFFF",
      fontSize: 31,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 6,
    },

    screenSubtitle: {
      color: "#8F9DB2",
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 22,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 22,
      paddingHorizontal: 16,
    },


    // ========================================================
    // CURRENT PLAN
    // ========================================================

    currentPlanPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#0A1320",
      borderWidth: 1,
      borderColor: "#243A55",
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginBottom: 24,
    },

    currentPlanLabel: {
      color: "#7E8DA4",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2,
    },

    currentPlanName: {
      fontSize: 23,
      fontWeight: "900",
      marginTop: 4,
    },

    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },

    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginRight: 7,
    },

    activeBadgeText: {
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
    },


    // ========================================================
    // CARDS
    // ========================================================

    cardWrap: {
      width: "100%",
      borderRadius: 28,
      overflow: "hidden",
      marginBottom: 28,
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#1E334F",

      shadowColor: "#000000",
      shadowOpacity: 0.35,
      shadowRadius: 12,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 8,
    },

    currentCardWrap: {
      borderWidth: 2,

      shadowColor: "#D8A72E",
      shadowOpacity: 0.3,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 7,
      },

      elevation: 12,
    },

    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 12,
    },

    planBadge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 11,
      paddingVertical: 6,
      maxWidth: "58%",
    },

    planBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1,
      textAlign: "center",
    },

    currentBadge: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      maxWidth: "40%",
    },

    currentBadgeText: {
      color: "#05070C",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.6,
      textAlign: "center",
    },

    cardImage: {
      width: "100%",
      height: 300,
      justifyContent: "flex-end",
    },

    cardImageStyle: {
      borderRadius: 0,
    },

    cardImageShade: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(0,0,0,0.08)",
    },


    // ========================================================
    // PRICE
    // ========================================================

    priceArea: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 15,
    },

    planTitle: {
      color: "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
    },

    priceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 3,
    },

    price: {
      fontSize: 32,
      fontWeight: "900",
    },

    pricePeriod: {
      color: "#8795AA",
      fontSize: 14,
      fontWeight: "700",
      marginLeft: 5,
      marginBottom: 5,
    },

    crownCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "#151128",
      borderWidth: 1,
      borderColor: "#B28CFF",
      alignItems: "center",
      justifyContent: "center",
    },

    crownIcon: {
      color: "#B28CFF",
      fontSize: 28,
    },


    // ========================================================
    // FEATURES
    // ========================================================

    featureList: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },

    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 38,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        "#1C2A3C",
    },

    highlightFeature: {
      backgroundColor:
        "rgba(216,167,46,0.05)",

      borderRadius: 10,
      paddingHorizontal: 6,
    },

    featureIcon: {
      width: 31,
      fontSize: 17,
    },

    featureText: {
      flex: 1,
      color: "#E7EDF6",
      fontSize: 14,
      fontWeight: "700",
    },

    lockedFeatureText: {
      color: "#68778D",
    },


    // ========================================================
    // PLAN BUTTON
    // ========================================================

    planButton: {
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 20,
      borderWidth: 1.5,
      borderRadius: 999,
      paddingVertical: 15,
      paddingHorizontal: 12,
      alignItems: "center",
    },

    currentPlanButton: {
      backgroundColor: "#071224",
    },

    planButtonText: {
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 0.7,
      textAlign: "center",
    },

    planButtonActiveText: {
      color: "#05070C",
    },


    // ========================================================
    // WCOIN
    // ========================================================

    rewardBox: {
      backgroundColor: "#11150E",
      borderColor: "#8B6B1C",
      borderWidth: 1.5,
      borderRadius: 26,
      padding: 20,
      marginBottom: 24,
    },

    sectionEyebrow: {
      color: "#D8A72E",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    rewardTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
      marginTop: 7,
    },

    rewardDescription: {
      color: "#AEB8C7",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },

    unlockBox: {
      backgroundColor: "#181A11",
      borderWidth: 1,
      borderColor: "#4E421D",
      borderRadius: 18,
      padding: 16,
      marginTop: 18,
    },

    unlockSmall: {
      color: "#8F9A79",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    unlockAmount: {
      color: "#F5C94C",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 3,
    },

    unlockDescription: {
      color: "#929C89",
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
      fontWeight: "600",
    },

    coinComparison: {
      marginTop: 17,
    },

    coinTier: {
      paddingVertical: 12,
    },

    coinTierName: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    coinTierValue: {
      color: "#8D99A8",
      fontSize: 21,
      fontWeight: "900",
      marginTop: 4,
    },

    premiumCoinValue: {
      color: "#D8A72E",
    },

    eliteCoinValue: {
      color: "#B28CFF",
    },

    coinTierDescription: {
      color: "#8994A4",
      fontSize: 13,
      lineHeight: 18,
      marginTop: 3,
    },

    coinDivider: {
      height: 1,
      backgroundColor: "#323526",
    },

    rewardNote: {
      color: "#7F8978",
      fontSize: 11,
      lineHeight: 17,
      marginTop: 15,
      fontStyle: "italic",
    },


    // ========================================================
    // TRACKSUITS
    // ========================================================

    infoBox: {
      backgroundColor: "#071224",
      borderColor: "#24415F",
      borderWidth: 1,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
    },

    infoEyebrow: {
      color: "#58E8C1",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    infoTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginTop: 7,
    },

    infoText: {
      color: "#A6B2C4",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },

    lockStatus: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#0B1727",
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },

    lockStatusIcon: {
      fontSize: 25,
      marginRight: 13,
    },

    lockStatusTextWrap: {
      flex: 1,
    },

    lockStatusTitle: {
      color: "#8C9AAF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    lockStatusText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      marginTop: 2,
    },


    // ========================================================
    // ELITE
    // ========================================================

    eliteCoachBox: {
      backgroundColor: "#100D1D",
      borderWidth: 1.5,
      borderColor: "#7055A7",
      borderRadius: 26,
      padding: 20,
      marginBottom: 24,

      shadowColor: "#B28CFF",
      shadowOpacity: 0.16,
      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 5,
      },
    },

    eliteEyebrow: {
      color: "#B28CFF",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    eliteCoachTitle: {
      color: "#FFFFFF",
      fontSize: 27,
      fontWeight: "900",
      marginTop: 7,
    },

    eliteCoachText: {
      color: "#B5AEC6",
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
      marginTop: 8,
    },

    dataNotice: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#171228",
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },

    dataNoticeIcon: {
      fontSize: 25,
      marginRight: 12,
    },

    dataNoticeText: {
      flex: 1,
      color: "#BEB7CE",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
    },


    // ========================================================
    // COMPARISON
    // ========================================================

    comparisonBox: {
      backgroundColor: "#071224",
      borderColor: "#243A55",
      borderWidth: 1,
      borderRadius: 24,
      padding: 16,
      marginBottom: 24,
    },

    comparisonTitle: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "900",
      marginBottom: 18,
    },

    tableHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#2A3B51",
    },

    tableFeatureHeader: {
      flex: 1.6,
      color: "#73839A",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

    tablePlanHeader: {
      flex: 0.75,
      textAlign: "center",
      color: "#73839A",
      fontSize: 9,
      fontWeight: "900",
    },

    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 49,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        "#223149",
    },

    tableLabel: {
      flex: 1.6,
      color: "#D7DEEA",
      fontSize: 12,
      fontWeight: "700",
    },

    tableValue: {
      flex: 0.75,
      color: "#58E8C1",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },

    tableValueSmall: {
      fontSize: 9,
    },

    premiumTableValue: {
      color: "#D8A72E",
    },

    eliteTableValue: {
      color: "#B28CFF",
    },


    // ========================================================
    // MANAGE
    // ========================================================

    manageBox: {
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#243A55",
      borderRadius: 24,
      padding: 18,
      marginBottom: 24,
    },

    manageTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
    },

    manageText: {
      color: "#94A3B8",
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
      marginTop: 7,
    },

    manageButton: {
      borderWidth: 1.5,
      borderColor: "#D8A72E",
      borderRadius: 999,
      paddingVertical: 14,
      paddingHorizontal: 12,
      alignItems: "center",
      marginTop: 16,
    },

    manageButtonText: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.6,
      textAlign: "center",
    },


    // ========================================================
    // FOOTER
    // ========================================================

    footer: {
      alignItems: "center",
      marginTop: 6,
    },

    footerTitle: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
    },

    footerText: {
      color: "#7F8CA0",
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      marginTop: 7,
      paddingHorizontal: 12,
    },

    returnButton: {
      width: "100%",
      borderColor: "#D8A72E",
      borderWidth: 1.5,
      borderRadius: 999,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 20,
    },

    returnText: {
      color: "#D8A72E",
      fontSize: 18,
      fontWeight: "900",
    },

    restoreButton: {
      width: "100%",
      borderRadius: 999,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 12,
      backgroundColor: "#0A1320",
      borderWidth: 1,
      borderColor: "#243A55",
    },

    restoreRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    restoreText: {
      color: "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.6,
      marginLeft: 8,
      textAlign: "center",
    },

    footerLinks: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },

    footerLink: {
      color: "#73839A",
      fontSize: 11,
      fontWeight: "700",
      marginHorizontal: 5,
    },

    footerDot: {
      color: "#3F4C5F",
      fontSize: 12,
    },
  });