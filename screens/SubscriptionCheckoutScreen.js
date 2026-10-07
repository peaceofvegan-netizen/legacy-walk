// screens/SubscriptionCheckoutScreen.js

// screens/SubscriptionCheckoutScreen.js

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  configureRevenueCat,
  loadOfferings,
  buyPackage,
} from "../services/revenuecat";


// ============================================================
// LEGATHON WALK
// SUBSCRIPTION CHECKOUT SCREEN
// ============================================================

const PREMIUM_CARD =
  require("../assets/subscriptions/premium-card.jpg");

const ELITE_CARD =
  require("../assets/subscriptions/elite-card.jpg");


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    back: "Back",

    checkoutKicker: "LEGATHON WALK CHECKOUT",
    confirmYourMembership: "Confirm Your\nMembership",

    checkoutSubtitle:
      "Upgrade your Legathon Walk experience with more journeys, wellness tools, analytics, and member rewards.",

    premiumMembership: "Premium Membership",
    eliteMembership: "Elite Membership",

    premium: "Premium",
    elite: "Elite",
    free: "Free",

    premiumBadge: "★ PREMIUM MEMBERSHIP",
    eliteBadge: "★ ELITE MEMBERSHIP",

    yourMembership: "YOUR MEMBERSHIP",
    perMonth: "/ month",
    billedMonthly: "Billed monthly",
    currentPlan: "CURRENT PLAN",

    includedWithPlan: "INCLUDED WITH YOUR PLAN",
    membershipBenefits: "Membership Benefits",

    premiumBenefit1:
      "Full Access to All Legathon Journeys",
    premiumBenefit2:
      "26 Legathon Marathons",
    premiumBenefit3:
      "AI Wellness Coach",
    premiumBenefit4:
      "AI Walking Coach",
    premiumBenefit5:
      "Walking Pace & Mobility Trends",
    premiumBenefit6:
      "W Coin Merchandise Discounts",

    eliteBenefit1:
      "Everything Included in Premium",
    eliteBenefit2:
      "Personal Wellness Coach",
    eliteBenefit3:
      "Enhanced W Coin Redemption",
    eliteBenefit4:
      "Free Shipping on Legathon Merchandise",
    eliteBenefit5:
      "Elite Member Benefits",
    eliteBenefit6:
      "Premium Walking Analytics",

    walkEarnProgress: "Walk. Earn. Progress.",

    rewardsDescription:
      "Legathon Walk rewards your activity through W Coins, journey rewards, points, rankings, and milestone unlocks.",

    orderSummary: "ORDER SUMMARY",

    plan: "Plan",
    billing: "Billing",
    monthly: "Monthly",
    price: "Price",

    totalToday: "Total Today",
    monthlySubscription: "Monthly subscription",

    securePurchase: "Secure Purchase",

    securePurchaseText:
      "Your subscription will be processed securely through your device's App Store or Google Play account.",

    confirmPremium:
      "CONFIRM PREMIUM MEMBERSHIP",

    confirmElite:
      "CONFIRM ELITE MEMBERSHIP",

    currentMembership:
      "CURRENT MEMBERSHIP",

    processing:
      "PROCESSING...",

    paymentInfo:
      "Payment will be charged to your App Store or Google Play account after purchase confirmation. Your subscription renews automatically unless canceled through your account subscription settings.",

    noLongTermCommitment:
      "No Long-Term Commitment",

    cancelText:
      "Manage or cancel your membership through your device's subscription settings.",

    builtForEveryStep:
      "Built for Every Step.",

    membershipActive:
      "Membership Active",

    alreadyMembership:
      "You already have the {plan} membership.",

    noOffering:
      "No RevenueCat offering is currently available.",

    noPackage:
      "No RevenueCat package was found for {plan}.",

    entitlementNotActivated:
      "The purchase completed, but the membership entitlement was not activated.",

    membershipActivated:
      "Membership Activated",

    membershipNowActive:
      "Your {plan} membership is now active.",

    unablePurchase:
      "Unable to Complete Purchase",

    tryAgain:
      "Please try again.",
  },


  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    back: "Atrás",

    checkoutKicker: "PAGO DE LEGATHON WALK",
    confirmYourMembership: "Confirma tu\nmembresía",

    checkoutSubtitle:
      "Mejora tu experiencia de Legathon Walk con más recorridos, herramientas de bienestar, análisis y recompensas para miembros.",

    premiumMembership: "Membresía Premium",
    eliteMembership: "Membresía Elite",

    premium: "Premium",
    elite: "Elite",
    free: "Gratis",

    premiumBadge: "★ MEMBRESÍA PREMIUM",
    eliteBadge: "★ MEMBRESÍA ELITE",

    yourMembership: "TU MEMBRESÍA",
    perMonth: "/ mes",
    billedMonthly: "Facturado mensualmente",
    currentPlan: "PLAN ACTUAL",

    includedWithPlan: "INCLUIDO EN TU PLAN",
    membershipBenefits: "Beneficios de la membresía",

    premiumBenefit1:
      "Acceso completo a todos los recorridos de Legathon",
    premiumBenefit2:
      "26 maratones Legathon",
    premiumBenefit3:
      "Coach de bienestar con IA",
    premiumBenefit4:
      "Coach de caminata con IA",
    premiumBenefit5:
      "Ritmo de caminata y tendencias de movilidad",
    premiumBenefit6:
      "Descuentos en mercancía con W Coins",

    eliteBenefit1:
      "Todo lo incluido en Premium",
    eliteBenefit2:
      "Coach personal de bienestar",
    eliteBenefit3:
      "Canje mejorado de W Coins",
    eliteBenefit4:
      "Envío gratis en mercancía Legathon",
    eliteBenefit5:
      "Beneficios para miembros Elite",
    eliteBenefit6:
      "Análisis Premium de caminata",

    walkEarnProgress: "Camina. Gana. Progresa.",

    rewardsDescription:
      "Legathon Walk recompensa tu actividad mediante W Coins, recompensas de recorridos, puntos, clasificaciones y desbloqueos por hitos.",

    orderSummary: "RESUMEN DEL PEDIDO",

    plan: "Plan",
    billing: "Facturación",
    monthly: "Mensual",
    price: "Precio",

    totalToday: "Total de hoy",
    monthlySubscription: "Suscripción mensual",

    securePurchase: "Compra segura",

    securePurchaseText:
      "Tu suscripción se procesará de forma segura mediante la App Store o Google Play de tu dispositivo.",

    confirmPremium:
      "CONFIRMAR MEMBRESÍA PREMIUM",

    confirmElite:
      "CONFIRMAR MEMBRESÍA ELITE",

    currentMembership:
      "MEMBRESÍA ACTUAL",

    processing:
      "PROCESANDO...",

    paymentInfo:
      "El pago se cargará a tu cuenta de App Store o Google Play después de confirmar la compra. La suscripción se renovará automáticamente salvo que la canceles desde la configuración de suscripciones de tu cuenta.",

    noLongTermCommitment:
      "Sin compromiso a largo plazo",

    cancelText:
      "Administra o cancela tu membresía desde la configuración de suscripciones de tu dispositivo.",

    builtForEveryStep:
      "Creado para cada paso.",

    membershipActive:
      "Membresía activa",

    alreadyMembership:
      "Ya tienes la membresía {plan}.",

    noOffering:
      "Actualmente no hay una oferta de RevenueCat disponible.",

    noPackage:
      "No se encontró un paquete de RevenueCat para {plan}.",

    entitlementNotActivated:
      "La compra se completó, pero la membresía no fue activada.",

    membershipActivated:
      "Membresía activada",

    membershipNowActive:
      "Tu membresía {plan} ahora está activa.",

    unablePurchase:
      "No se pudo completar la compra",

    tryAgain:
      "Inténtalo de nuevo.",
  },


  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    back: "Retour",

    checkoutKicker: "PAIEMENT LEGATHON WALK",
    confirmYourMembership: "Confirmez votre\nabonnement",

    checkoutSubtitle:
      "Améliorez votre expérience Legathon Walk avec davantage de parcours, d'outils de bien-être, d'analyses et de récompenses.",

    premiumMembership: "Abonnement Premium",
    eliteMembership: "Abonnement Elite",

    premium: "Premium",
    elite: "Elite",
    free: "Gratuit",

    premiumBadge: "★ ABONNEMENT PREMIUM",
    eliteBadge: "★ ABONNEMENT ELITE",

    yourMembership: "VOTRE ABONNEMENT",
    perMonth: "/ mois",
    billedMonthly: "Facturé mensuellement",
    currentPlan: "FORFAIT ACTUEL",

    includedWithPlan: "INCLUS DANS VOTRE FORFAIT",
    membershipBenefits: "Avantages de l'abonnement",

    premiumBenefit1:
      "Accès complet à tous les parcours Legathon",
    premiumBenefit2:
      "26 marathons Legathon",
    premiumBenefit3:
      "Coach bien-être IA",
    premiumBenefit4:
      "Coach de marche IA",
    premiumBenefit5:
      "Rythme de marche et tendances de mobilité",
    premiumBenefit6:
      "Réductions W Coin sur les produits",

    eliteBenefit1:
      "Tout ce qui est inclus dans Premium",
    eliteBenefit2:
      "Coach personnel de bien-être",
    eliteBenefit3:
      "Valeur de conversion W Coin améliorée",
    eliteBenefit4:
      "Livraison gratuite des produits Legathon",
    eliteBenefit5:
      "Avantages réservés aux membres Elite",
    eliteBenefit6:
      "Analyses Premium de marche",

    walkEarnProgress: "Marchez. Gagnez. Progressez.",

    rewardsDescription:
      "Legathon Walk récompense votre activité avec des W Coins, des récompenses de parcours, des points, des classements et des déblocages d'étapes.",

    orderSummary: "RÉCAPITULATIF",

    plan: "Forfait",
    billing: "Facturation",
    monthly: "Mensuelle",
    price: "Prix",

    totalToday: "Total aujourd'hui",
    monthlySubscription: "Abonnement mensuel",

    securePurchase: "Achat sécurisé",

    securePurchaseText:
      "Votre abonnement sera traité en toute sécurité via l'App Store ou Google Play de votre appareil.",

    confirmPremium:
      "CONFIRMER L'ABONNEMENT PREMIUM",

    confirmElite:
      "CONFIRMER L'ABONNEMENT ELITE",

    currentMembership:
      "ABONNEMENT ACTUEL",

    processing:
      "TRAITEMENT...",

    paymentInfo:
      "Le paiement sera débité de votre compte App Store ou Google Play après confirmation. Votre abonnement se renouvelle automatiquement sauf annulation dans les paramètres de votre compte.",

    noLongTermCommitment:
      "Aucun engagement à long terme",

    cancelText:
      "Gérez ou annulez votre abonnement dans les paramètres d'abonnement de votre appareil.",

    builtForEveryStep:
      "Conçu pour chaque pas.",

    membershipActive:
      "Abonnement actif",

    alreadyMembership:
      "Vous avez déjà l'abonnement {plan}.",

    noOffering:
      "Aucune offre RevenueCat n'est actuellement disponible.",

    noPackage:
      "Aucun forfait RevenueCat n'a été trouvé pour {plan}.",

    entitlementNotActivated:
      "L'achat a été effectué, mais l'abonnement n'a pas été activé.",

    membershipActivated:
      "Abonnement activé",

    membershipNowActive:
      "Votre abonnement {plan} est maintenant actif.",

    unablePurchase:
      "Impossible de finaliser l'achat",

    tryAgain:
      "Veuillez réessayer.",
  },


  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    back: "Zurück",

    checkoutKicker: "LEGATHON WALK CHECKOUT",
    confirmYourMembership: "Mitgliedschaft\nbestätigen",

    checkoutSubtitle:
      "Erweitere dein Legathon-Walk-Erlebnis mit mehr Journeys, Wellness-Tools, Analysen und Mitgliedervorteilen.",

    premiumMembership: "Premium-Mitgliedschaft",
    eliteMembership: "Elite-Mitgliedschaft",

    premium: "Premium",
    elite: "Elite",
    free: "Kostenlos",

    premiumBadge: "★ PREMIUM-MITGLIEDSCHAFT",
    eliteBadge: "★ ELITE-MITGLIEDSCHAFT",

    yourMembership: "DEINE MITGLIEDSCHAFT",
    perMonth: "/ Monat",
    billedMonthly: "Monatliche Abrechnung",
    currentPlan: "AKTUELLER PLAN",

    includedWithPlan: "IN DEINEM PLAN ENTHALTEN",
    membershipBenefits: "Mitgliedervorteile",

    premiumBenefit1:
      "Voller Zugriff auf alle Legathon Journeys",
    premiumBenefit2:
      "26 Legathon-Marathons",
    premiumBenefit3:
      "KI-Wellness-Coach",
    premiumBenefit4:
      "KI-Walking-Coach",
    premiumBenefit5:
      "Gehgeschwindigkeit & Mobilitätstrends",
    premiumBenefit6:
      "W-Coin-Rabatte auf Merchandise",

    eliteBenefit1:
      "Alles aus Premium",
    eliteBenefit2:
      "Persönlicher Wellness-Coach",
    eliteBenefit3:
      "Verbesserte W-Coin-Einlösung",
    eliteBenefit4:
      "Kostenloser Versand von Legathon-Merchandise",
    eliteBenefit5:
      "Elite-Mitgliedervorteile",
    eliteBenefit6:
      "Premium-Walking-Analysen",

    walkEarnProgress: "Gehen. Verdienen. Fortschritt.",

    rewardsDescription:
      "Legathon Walk belohnt deine Aktivität mit W Coins, Journey-Belohnungen, Punkten, Ranglisten und Meilenstein-Freischaltungen.",

    orderSummary: "BESTELLÜBERSICHT",

    plan: "Plan",
    billing: "Abrechnung",
    monthly: "Monatlich",
    price: "Preis",

    totalToday: "Heute gesamt",
    monthlySubscription: "Monatliches Abonnement",

    securePurchase: "Sicherer Kauf",

    securePurchaseText:
      "Dein Abonnement wird sicher über den App Store oder Google Play deines Geräts verarbeitet.",

    confirmPremium:
      "PREMIUM-MITGLIEDSCHAFT BESTÄTIGEN",

    confirmElite:
      "ELITE-MITGLIEDSCHAFT BESTÄTIGEN",

    currentMembership:
      "AKTUELLE MITGLIEDSCHAFT",

    processing:
      "VERARBEITUNG...",

    paymentInfo:
      "Die Zahlung wird nach der Kaufbestätigung über dein App-Store- oder Google-Play-Konto abgerechnet. Das Abonnement verlängert sich automatisch, sofern es nicht in den Kontoeinstellungen gekündigt wird.",

    noLongTermCommitment:
      "Keine langfristige Bindung",

    cancelText:
      "Verwalte oder kündige deine Mitgliedschaft über die Abonnementeinstellungen deines Geräts.",

    builtForEveryStep:
      "Für jeden Schritt gemacht.",

    membershipActive:
      "Mitgliedschaft aktiv",

    alreadyMembership:
      "Du hast bereits die {plan}-Mitgliedschaft.",

    noOffering:
      "Derzeit ist kein RevenueCat-Angebot verfügbar.",

    noPackage:
      "Für {plan} wurde kein RevenueCat-Paket gefunden.",

    entitlementNotActivated:
      "Der Kauf wurde abgeschlossen, aber die Mitgliedschaft wurde nicht aktiviert.",

    membershipActivated:
      "Mitgliedschaft aktiviert",

    membershipNowActive:
      "Deine {plan}-Mitgliedschaft ist jetzt aktiv.",

    unablePurchase:
      "Kauf konnte nicht abgeschlossen werden",

    tryAgain:
      "Bitte versuche es erneut.",
  },


  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    back: "Voltar",

    checkoutKicker: "PAGAMENTO LEGATHON WALK",
    confirmYourMembership: "Confirme sua\nassinatura",

    checkoutSubtitle:
      "Melhore sua experiência Legathon Walk com mais jornadas, ferramentas de bem-estar, análises e recompensas.",

    premiumMembership: "Assinatura Premium",
    eliteMembership: "Assinatura Elite",

    premium: "Premium",
    elite: "Elite",
    free: "Grátis",

    premiumBadge: "★ ASSINATURA PREMIUM",
    eliteBadge: "★ ASSINATURA ELITE",

    yourMembership: "SUA ASSINATURA",
    perMonth: "/ mês",
    billedMonthly: "Cobrado mensalmente",
    currentPlan: "PLANO ATUAL",

    includedWithPlan: "INCLUÍDO NO SEU PLANO",
    membershipBenefits: "Benefícios da assinatura",

    premiumBenefit1:
      "Acesso completo a todas as jornadas Legathon",
    premiumBenefit2:
      "26 maratonas Legathon",
    premiumBenefit3:
      "Coach de bem-estar com IA",
    premiumBenefit4:
      "Coach de caminhada com IA",
    premiumBenefit5:
      "Ritmo de caminhada e tendências de mobilidade",
    premiumBenefit6:
      "Descontos em produtos com W Coins",

    eliteBenefit1:
      "Tudo incluído no Premium",
    eliteBenefit2:
      "Coach pessoal de bem-estar",
    eliteBenefit3:
      "Resgate aprimorado de W Coins",
    eliteBenefit4:
      "Frete grátis em produtos Legathon",
    eliteBenefit5:
      "Benefícios para membros Elite",
    eliteBenefit6:
      "Análises Premium de caminhada",

    walkEarnProgress: "Caminhe. Ganhe. Progrida.",

    rewardsDescription:
      "Legathon Walk recompensa sua atividade com W Coins, recompensas de jornadas, pontos, classificações e desbloqueios por marcos.",

    orderSummary: "RESUMO DO PEDIDO",

    plan: "Plano",
    billing: "Cobrança",
    monthly: "Mensal",
    price: "Preço",

    totalToday: "Total hoje",
    monthlySubscription: "Assinatura mensal",

    securePurchase: "Compra segura",

    securePurchaseText:
      "Sua assinatura será processada com segurança pela App Store ou Google Play do seu dispositivo.",

    confirmPremium:
      "CONFIRMAR ASSINATURA PREMIUM",

    confirmElite:
      "CONFIRMAR ASSINATURA ELITE",

    currentMembership:
      "ASSINATURA ATUAL",

    processing:
      "PROCESSANDO...",

    paymentInfo:
      "O pagamento será cobrado da sua conta da App Store ou Google Play após a confirmação. A assinatura será renovada automaticamente, salvo cancelamento nas configurações da conta.",

    noLongTermCommitment:
      "Sem compromisso de longo prazo",

    cancelText:
      "Gerencie ou cancele sua assinatura nas configurações de assinatura do dispositivo.",

    builtForEveryStep:
      "Feito para cada passo.",

    membershipActive:
      "Assinatura ativa",

    alreadyMembership:
      "Você já possui a assinatura {plan}.",

    noOffering:
      "Nenhuma oferta RevenueCat está disponível no momento.",

    noPackage:
      "Nenhum pacote RevenueCat foi encontrado para {plan}.",

    entitlementNotActivated:
      "A compra foi concluída, mas a assinatura não foi ativada.",

    membershipActivated:
      "Assinatura ativada",

    membershipNowActive:
      "Sua assinatura {plan} está ativa.",

    unablePurchase:
      "Não foi possível concluir a compra",

    tryAgain:
      "Tente novamente.",
  },


  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    back: "戻る",

    checkoutKicker: "LEGATHON WALK お支払い",
    confirmYourMembership: "メンバーシップを\n確認",

    checkoutSubtitle:
      "より多くのジャーニー、ウェルネスツール、分析、会員特典でLegathon Walkをさらに楽しめます。",

    premiumMembership: "Premium メンバーシップ",
    eliteMembership: "Elite メンバーシップ",

    premium: "Premium",
    elite: "Elite",
    free: "無料",

    premiumBadge: "★ PREMIUM メンバーシップ",
    eliteBadge: "★ ELITE メンバーシップ",

    yourMembership: "メンバーシップ",
    perMonth: "/ 月",
    billedMonthly: "毎月請求",
    currentPlan: "現在のプラン",

    includedWithPlan: "プランに含まれる内容",
    membershipBenefits: "メンバー特典",

    premiumBenefit1:
      "すべてのLegathonジャーニーにアクセス",
    premiumBenefit2:
      "26のLegathonマラソン",
    premiumBenefit3:
      "AIウェルネスコーチ",
    premiumBenefit4:
      "AIウォーキングコーチ",
    premiumBenefit5:
      "歩行ペースとモビリティ傾向",
    premiumBenefit6:
      "W Coin商品割引",

    eliteBenefit1:
      "Premiumのすべての特典",
    eliteBenefit2:
      "パーソナルウェルネスコーチ",
    eliteBenefit3:
      "W Coin交換価値の強化",
    eliteBenefit4:
      "Legathon商品の送料無料",
    eliteBenefit5:
      "Elite会員特典",
    eliteBenefit6:
      "Premium歩行分析",

    walkEarnProgress: "歩く。獲得する。進歩する。",

    rewardsDescription:
      "Legathon Walkでは、W Coins、ジャーニー報酬、ポイント、ランキング、マイルストーン特典を通じて活動が報われます。",

    orderSummary: "注文内容",

    plan: "プラン",
    billing: "請求",
    monthly: "月額",
    price: "価格",

    totalToday: "本日のお支払い",
    monthlySubscription: "月額サブスクリプション",

    securePurchase: "安全なお支払い",

    securePurchaseText:
      "サブスクリプションは端末のApp StoreまたはGoogle Playアカウントを通じて安全に処理されます。",

    confirmPremium:
      "PREMIUMを確定",

    confirmElite:
      "ELITEを確定",

    currentMembership:
      "現在のメンバーシップ",

    processing:
      "処理中...",

    paymentInfo:
      "購入確認後、App StoreまたはGoogle Playアカウントに請求されます。アカウントのサブスクリプション設定でキャンセルしない限り、自動更新されます。",

    noLongTermCommitment:
      "長期契約なし",

    cancelText:
      "端末のサブスクリプション設定からメンバーシップを管理またはキャンセルできます。",

    builtForEveryStep:
      "すべての一歩のために。",

    membershipActive:
      "メンバーシップ有効",

    alreadyMembership:
      "すでに{plan}メンバーシップをご利用中です。",

    noOffering:
      "現在利用可能なRevenueCatオファーがありません。",

    noPackage:
      "{plan}のRevenueCatパッケージが見つかりませんでした。",

    entitlementNotActivated:
      "購入は完了しましたが、メンバーシップが有効化されませんでした。",

    membershipActivated:
      "メンバーシップが有効になりました",

    membershipNowActive:
      "{plan}メンバーシップが有効になりました。",

    unablePurchase:
      "購入を完了できませんでした",

    tryAgain:
      "もう一度お試しください。",
  },


  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    back: "뒤로",

    checkoutKicker: "LEGATHON WALK 결제",
    confirmYourMembership: "멤버십을\n확인하세요",

    checkoutSubtitle:
      "더 많은 Journey, 웰니스 도구, 분석 및 회원 혜택으로 Legathon Walk를 업그레이드하세요.",

    premiumMembership: "Premium 멤버십",
    eliteMembership: "Elite 멤버십",

    premium: "Premium",
    elite: "Elite",
    free: "무료",

    premiumBadge: "★ PREMIUM 멤버십",
    eliteBadge: "★ ELITE 멤버십",

    yourMembership: "내 멤버십",
    perMonth: "/ 월",
    billedMonthly: "매월 청구",
    currentPlan: "현재 플랜",

    includedWithPlan: "플랜 포함 혜택",
    membershipBenefits: "멤버십 혜택",

    premiumBenefit1:
      "모든 Legathon Journey 이용",
    premiumBenefit2:
      "26개 Legathon 마라톤",
    premiumBenefit3:
      "AI 웰니스 코치",
    premiumBenefit4:
      "AI 워킹 코치",
    premiumBenefit5:
      "걷기 속도 및 이동성 추세",
    premiumBenefit6:
      "W Coin 상품 할인",

    eliteBenefit1:
      "Premium의 모든 혜택",
    eliteBenefit2:
      "개인 웰니스 코치",
    eliteBenefit3:
      "향상된 W Coin 교환",
    eliteBenefit4:
      "Legathon 상품 무료 배송",
    eliteBenefit5:
      "Elite 회원 혜택",
    eliteBenefit6:
      "Premium 걷기 분석",

    walkEarnProgress: "걷고. 얻고. 성장하세요.",

    rewardsDescription:
      "Legathon Walk는 W Coins, Journey 보상, 포인트, 순위 및 마일스톤 잠금 해제를 통해 활동을 보상합니다.",

    orderSummary: "주문 요약",

    plan: "플랜",
    billing: "결제",
    monthly: "월간",
    price: "가격",

    totalToday: "오늘 결제",
    monthlySubscription: "월간 구독",

    securePurchase: "안전한 결제",

    securePurchaseText:
      "구독은 기기의 App Store 또는 Google Play 계정을 통해 안전하게 처리됩니다.",

    confirmPremium:
      "PREMIUM 멤버십 확인",

    confirmElite:
      "ELITE 멤버십 확인",

    currentMembership:
      "현재 멤버십",

    processing:
      "처리 중...",

    paymentInfo:
      "구매 확인 후 App Store 또는 Google Play 계정으로 결제됩니다. 계정 구독 설정에서 취소하지 않는 한 자동으로 갱신됩니다.",

    noLongTermCommitment:
      "장기 약정 없음",

    cancelText:
      "기기의 구독 설정에서 멤버십을 관리하거나 취소할 수 있습니다.",

    builtForEveryStep:
      "모든 걸음을 위해.",

    membershipActive:
      "멤버십 활성화됨",

    alreadyMembership:
      "이미 {plan} 멤버십을 이용 중입니다.",

    noOffering:
      "현재 이용 가능한 RevenueCat 오퍼가 없습니다.",

    noPackage:
      "{plan} RevenueCat 패키지를 찾을 수 없습니다.",

    entitlementNotActivated:
      "구매가 완료되었지만 멤버십 권한이 활성화되지 않았습니다.",

    membershipActivated:
      "멤버십 활성화 완료",

    membershipNowActive:
      "{plan} 멤버십이 활성화되었습니다.",

    unablePurchase:
      "구매를 완료할 수 없습니다",

    tryAgain:
      "다시 시도해 주세요.",
  },


  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    back: "返回",

    checkoutKicker: "LEGATHON WALK 结账",
    confirmYourMembership: "确认您的\n会员资格",

    checkoutSubtitle:
      "升级您的 Legathon Walk 体验，解锁更多旅程、健康工具、分析和会员奖励。",

    premiumMembership: "Premium 会员",
    eliteMembership: "Elite 会员",

    premium: "Premium",
    elite: "Elite",
    free: "免费",

    premiumBadge: "★ PREMIUM 会员",
    eliteBadge: "★ ELITE 会员",

    yourMembership: "您的会员",
    perMonth: "/ 月",
    billedMonthly: "按月计费",
    currentPlan: "当前方案",

    includedWithPlan: "您的方案包含",
    membershipBenefits: "会员权益",

    premiumBenefit1:
      "访问所有 Legathon 旅程",
    premiumBenefit2:
      "26 场 Legathon 马拉松",
    premiumBenefit3:
      "AI 健康教练",
    premiumBenefit4:
      "AI 步行教练",
    premiumBenefit5:
      "步行速度与行动趋势",
    premiumBenefit6:
      "W Coin 商品折扣",

    eliteBenefit1:
      "包含 Premium 的全部权益",
    eliteBenefit2:
      "个人健康教练",
    eliteBenefit3:
      "增强 W Coin 兑换价值",
    eliteBenefit4:
      "Legathon 商品免运费",
    eliteBenefit5:
      "Elite 会员专属权益",
    eliteBenefit6:
      "Premium 步行分析",

    walkEarnProgress: "步行。赚取。进步。",

    rewardsDescription:
      "Legathon Walk 通过 W Coins、旅程奖励、积分、排名和里程碑解锁来奖励您的活动。",

    orderSummary: "订单摘要",

    plan: "方案",
    billing: "计费",
    monthly: "每月",
    price: "价格",

    totalToday: "今日总额",
    monthlySubscription: "月度订阅",

    securePurchase: "安全购买",

    securePurchaseText:
      "您的订阅将通过设备的 App Store 或 Google Play 账户安全处理。",

    confirmPremium:
      "确认 PREMIUM 会员",

    confirmElite:
      "确认 ELITE 会员",

    currentMembership:
      "当前会员",

    processing:
      "处理中...",

    paymentInfo:
      "确认购买后，费用将从您的 App Store 或 Google Play 账户收取。除非您在账户订阅设置中取消，否则订阅将自动续订。",

    noLongTermCommitment:
      "无需长期承诺",

    cancelText:
      "您可以通过设备的订阅设置管理或取消会员资格。",

    builtForEveryStep:
      "为每一步而生。",

    membershipActive:
      "会员已激活",

    alreadyMembership:
      "您已经拥有 {plan} 会员资格。",

    noOffering:
      "目前没有可用的 RevenueCat 优惠。",

    noPackage:
      "未找到 {plan} 的 RevenueCat 套餐。",

    entitlementNotActivated:
      "购买已完成，但会员权益尚未激活。",

    membershipActivated:
      "会员已激活",

    membershipNowActive:
      "您的 {plan} 会员资格现已激活。",

    unablePurchase:
      "无法完成购买",

    tryAgain:
      "请重试。",
  },


  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    back: "Indietro",

    checkoutKicker: "PAGAMENTO LEGATHON WALK",
    confirmYourMembership: "Conferma il tuo\nabbonamento",

    checkoutSubtitle:
      "Migliora la tua esperienza Legathon Walk con più percorsi, strumenti wellness, analisi e vantaggi per i membri.",

    premiumMembership: "Abbonamento Premium",
    eliteMembership: "Abbonamento Elite",

    premium: "Premium",
    elite: "Elite",
    free: "Gratuito",

    premiumBadge: "★ ABBONAMENTO PREMIUM",
    eliteBadge: "★ ABBONAMENTO ELITE",

    yourMembership: "IL TUO ABBONAMENTO",
    perMonth: "/ mese",
    billedMonthly: "Fatturato mensilmente",
    currentPlan: "PIANO ATTUALE",

    includedWithPlan: "INCLUSO NEL TUO PIANO",
    membershipBenefits: "Vantaggi dell'abbonamento",

    premiumBenefit1:
      "Accesso completo a tutti i percorsi Legathon",
    premiumBenefit2:
      "26 maratone Legathon",
    premiumBenefit3:
      "Coach wellness AI",
    premiumBenefit4:
      "Coach di camminata AI",
    premiumBenefit5:
      "Ritmo di camminata e tendenze di mobilità",
    premiumBenefit6:
      "Sconti W Coin sul merchandising",

    eliteBenefit1:
      "Tutto ciò che è incluso in Premium",
    eliteBenefit2:
      "Coach personale di benessere",
    eliteBenefit3:
      "Valore di riscatto W Coin migliorato",
    eliteBenefit4:
      "Spedizione gratuita sul merchandising Legathon",
    eliteBenefit5:
      "Vantaggi per membri Elite",
    eliteBenefit6:
      "Analisi Premium della camminata",

    walkEarnProgress: "Cammina. Guadagna. Progredisci.",

    rewardsDescription:
      "Legathon Walk premia la tua attività con W Coins, ricompense dei percorsi, punti, classifiche e sblocchi per traguardi.",

    orderSummary: "RIEPILOGO ORDINE",

    plan: "Piano",
    billing: "Fatturazione",
    monthly: "Mensile",
    price: "Prezzo",

    totalToday: "Totale oggi",
    monthlySubscription: "Abbonamento mensile",

    securePurchase: "Acquisto sicuro",

    securePurchaseText:
      "Il tuo abbonamento verrà elaborato in modo sicuro tramite l'App Store o Google Play del tuo dispositivo.",

    confirmPremium:
      "CONFERMA ABBONAMENTO PREMIUM",

    confirmElite:
      "CONFERMA ABBONAMENTO ELITE",

    currentMembership:
      "ABBONAMENTO ATTUALE",

    processing:
      "ELABORAZIONE...",

    paymentInfo:
      "Il pagamento verrà addebitato sul tuo account App Store o Google Play dopo la conferma. L'abbonamento si rinnoverà automaticamente salvo annullamento nelle impostazioni dell'account.",

    noLongTermCommitment:
      "Nessun impegno a lungo termine",

    cancelText:
      "Gestisci o annulla il tuo abbonamento dalle impostazioni di abbonamento del dispositivo.",

    builtForEveryStep:
      "Creato per ogni passo.",

    membershipActive:
      "Abbonamento attivo",

    alreadyMembership:
      "Hai già l'abbonamento {plan}.",

    noOffering:
      "Al momento non è disponibile alcuna offerta RevenueCat.",

    noPackage:
      "Nessun pacchetto RevenueCat trovato per {plan}.",

    entitlementNotActivated:
      "L'acquisto è stato completato, ma l'abbonamento non è stato attivato.",

    membershipActivated:
      "Abbonamento attivato",

    membershipNowActive:
      "Il tuo abbonamento {plan} è ora attivo.",

    unablePurchase:
      "Impossibile completare l'acquisto",

    tryAgain:
      "Riprova.",
  },


  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    back: "رجوع",

    checkoutKicker: "الدفع في LEGATHON WALK",
    confirmYourMembership: "تأكيد\nعضويتك",

    checkoutSubtitle:
      "طوّر تجربتك في Legathon Walk مع المزيد من الرحلات وأدوات العافية والتحليلات ومزايا الأعضاء.",

    premiumMembership: "عضوية Premium",
    eliteMembership: "عضوية Elite",

    premium: "Premium",
    elite: "Elite",
    free: "مجاني",

    premiumBadge: "★ عضوية PREMIUM",
    eliteBadge: "★ عضوية ELITE",

    yourMembership: "عضويتك",
    perMonth: "/ شهريًا",
    billedMonthly: "تتم الفوترة شهريًا",
    currentPlan: "الخطة الحالية",

    includedWithPlan: "المزايا المشمولة في خطتك",
    membershipBenefits: "مزايا العضوية",

    premiumBenefit1:
      "الوصول الكامل إلى جميع رحلات Legathon",
    premiumBenefit2:
      "26 ماراثون Legathon",
    premiumBenefit3:
      "مدرب العافية بالذكاء الاصطناعي",
    premiumBenefit4:
      "مدرب المشي بالذكاء الاصطناعي",
    premiumBenefit5:
      "سرعة المشي واتجاهات الحركة",
    premiumBenefit6:
      "خصومات W Coin على المنتجات",

    eliteBenefit1:
      "جميع مزايا Premium",
    eliteBenefit2:
      "مدرب عافية شخصي",
    eliteBenefit3:
      "قيمة استبدال محسنة لـ W Coin",
    eliteBenefit4:
      "شحن مجاني لمنتجات Legathon",
    eliteBenefit5:
      "مزايا أعضاء Elite",
    eliteBenefit6:
      "تحليلات مشي Premium",

    walkEarnProgress: "امشِ. اكسب. تقدم.",

    rewardsDescription:
      "يكافئ Legathon Walk نشاطك من خلال W Coins ومكافآت الرحلات والنقاط والتصنيفات وفتح إنجازات المراحل.",

    orderSummary: "ملخص الطلب",

    plan: "الخطة",
    billing: "الفوترة",
    monthly: "شهري",
    price: "السعر",

    totalToday: "إجمالي اليوم",
    monthlySubscription: "اشتراك شهري",

    securePurchase: "شراء آمن",

    securePurchaseText:
      "ستتم معالجة اشتراكك بأمان من خلال حساب App Store أو Google Play على جهازك.",

    confirmPremium:
      "تأكيد عضوية PREMIUM",

    confirmElite:
      "تأكيد عضوية ELITE",

    currentMembership:
      "العضوية الحالية",

    processing:
      "جارٍ المعالجة...",

    paymentInfo:
      "سيتم تحصيل الدفع من حساب App Store أو Google Play بعد تأكيد الشراء. يتجدد الاشتراك تلقائيًا ما لم يتم إلغاؤه من إعدادات الاشتراك في حسابك.",

    noLongTermCommitment:
      "بدون التزام طويل الأجل",

    cancelText:
      "يمكنك إدارة عضويتك أو إلغاؤها من إعدادات الاشتراك على جهازك.",

    builtForEveryStep:
      "مصمم لكل خطوة.",

    membershipActive:
      "العضوية نشطة",

    alreadyMembership:
      "لديك بالفعل عضوية {plan}.",

    noOffering:
      "لا يوجد عرض RevenueCat متاح حاليًا.",

    noPackage:
      "لم يتم العثور على حزمة RevenueCat لخطة {plan}.",

    entitlementNotActivated:
      "اكتملت عملية الشراء، ولكن لم يتم تفعيل العضوية.",

    membershipActivated:
      "تم تفعيل العضوية",

    membershipNowActive:
      "عضويتك {plan} نشطة الآن.",

    unablePurchase:
      "تعذر إكمال عملية الشراء",

    tryAgain:
      "يرجى المحاولة مرة أخرى.",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {

  const code =
    String(
      language ||
      "en"
    )
      .trim()
      .toLowerCase()
      .split("-")[0];


  return TEXT[code]
    ? code
    : "en";
}


function getText(
  language,
  key
) {

  return (
    TEXT?.[language]?.[key] ||
    TEXT.en[key] ||
    key
  );
}


function fillTemplate(
  value,
  variables = {}
) {

  let output =
    String(
      value ||
      ""
    );


  Object.entries(
    variables
  ).forEach(
    ([key, replacement]) => {

      output =
        output.replace(
          new RegExp(
            `\\{${key}\\}`,
            "g"
          ),

          String(
            replacement ??
            ""
          )
        );
    }
  );


  return output;
}


// ============================================================
// PLAN CONFIGURATION
// ============================================================
//
// RevenueCat IDs remain canonical and are NEVER translated.
// Only display text changes language.
//
// ============================================================

const PLAN_DATA = {

  premium: {

    id:
      "premium",

    image:
      PREMIUM_CARD,

    accent:
      "#D8A72E",

    benefitKeys: [
      "premiumBenefit1",
      "premiumBenefit2",
      "premiumBenefit3",
      "premiumBenefit4",
      "premiumBenefit5",
      "premiumBenefit6",
    ],
  },


  elite: {

    id:
      "elite",

    image:
      ELITE_CARD,

    accent:
      "#A855F7",

    benefitKeys: [
      "eliteBenefit1",
      "eliteBenefit2",
      "eliteBenefit3",
      "eliteBenefit4",
      "eliteBenefit5",
      "eliteBenefit6",
    ],
  },
};


// ============================================================
// PRICE CONFIGURATION
// ============================================================

const PLAN_PRICES = {

  premium: {
    price: "$4.99",
    priceLabel: "$4.99/mo",
  },

  elite: {
    price: "$9.99",
    priceLabel: "$9.99/mo",
  },
};


// ============================================================
// MAIN SCREEN
// ============================================================

export default function SubscriptionCheckoutScreen({

  language = "en",

  selectedPlan = "premium",

  subscriptionPlan = "free",

  goBack,

  onConfirm,

}) {

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const languageCode =
    normalizeLanguage(
      language
    );


  const isRTL =
    languageCode ===
    "ar";


  const t =
    (
      key
    ) =>
      getText(
        languageCode,
        key
      );


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);


  // ==========================================================
  // REVENUECAT SETUP
  // ==========================================================

  useEffect(() => {

    let mounted =
      true;


    const setupRevenueCat =
      async () => {

        try {

          await configureRevenueCat();


          if (
            mounted
          ) {

            console.log(
              "RevenueCat configured from subscription checkout"
            );
          }

        } catch (error) {

          console.log(
            "RevenueCat configuration error:",
            error
          );
        }
      };


    setupRevenueCat();


    return () => {

      mounted =
        false;
    };

  }, []);


  // ==========================================================
  // SELECTED PLAN
  // ==========================================================

  const plan =
    useMemo(() => {

      const normalized =
        String(
          selectedPlan ||
          "premium"
        ).toLowerCase();


      return (
        PLAN_DATA[
          normalized
        ] ||
        PLAN_DATA.premium
      );

    }, [
      selectedPlan,
    ]);


  const isElite =
    plan.id ===
    "elite";


  const currentPlan =
    String(
      subscriptionPlan ||
      "free"
    ).toLowerCase();


  const alreadySubscribed =
    currentPlan ===
    plan.id;


  // ==========================================================
  // DISPLAY VALUES
  // ==========================================================

  const planShortTitle =
    isElite
      ? t("elite")
      : t("premium");


  const planTitle =
    isElite
      ? t("eliteMembership")
      : t("premiumMembership");


  const planPrice =
    PLAN_PRICES[
      plan.id
    ]?.price ||
    "$0";


  const planPriceLabel =
    PLAN_PRICES[
      plan.id
    ]?.priceLabel ||
    "$0/mo";


  const benefits =
    plan.benefitKeys.map(
      (
        key
      ) =>
        t(key)
    );


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    () => {

      if (
        isProcessing
      ) {
        return;
      }


      if (
        typeof goBack ===
        "function"
      ) {

        goBack();
      }
    };


  // ==========================================================
  // FIND REVENUECAT PACKAGE
  // ==========================================================

  const findPackageForPlan =
    (
      offering
    ) => {

      const packages =
        offering
          ?.availablePackages ||
        [];


      return packages.find(
        (
          pkg
        ) => {

          const packageId =
            String(
              pkg?.identifier ||
              ""
            ).toLowerCase();


          const productId =
            String(
              pkg?.product
                ?.identifier ||
              ""
            ).toLowerCase();


          // ==================================================
          // PREMIUM
          // ==================================================

          if (
            plan.id ===
            "premium"
          ) {

            return (
              packageId ===
                "premium" ||

              productId ===
                "premium_monthly_499"
            );
          }


          // ==================================================
          // ELITE
          // ==================================================

          if (
            plan.id ===
            "elite"
          ) {

            return (
              packageId ===
                "elite" ||

              productId ===
                "legendary_monthly_999"
            );
          }


          return false;
        }
      );
    };


  // ==========================================================
  // CONFIRM SUBSCRIPTION
  // ==========================================================

  const handleConfirm =
    async () => {

      if (
        isProcessing
      ) {
        return;
      }


      if (
        alreadySubscribed
      ) {

        Alert.alert(
          t(
            "membershipActive"
          ),

          fillTemplate(
            t(
              "alreadyMembership"
            ),
            {
              plan:
                planShortTitle,
            }
          )
        );


        return;
      }


      try {

        setIsProcessing(
          true
        );


        console.log(
          "Starting RevenueCat purchase:",
          plan.id
        );


        // ====================================================
        // LOAD CURRENT OFFERING
        // ====================================================

        const offering =
          await loadOfferings();


        if (
          !offering
        ) {

          throw new Error(
            t(
              "noOffering"
            )
          );
        }


        // ====================================================
        // FIND SELECTED PACKAGE
        // ====================================================

        const packageToBuy =
          findPackageForPlan(
            offering
          );


        if (
          !packageToBuy
        ) {

          throw new Error(
            fillTemplate(
              t(
                "noPackage"
              ),
              {
                plan:
                  planShortTitle,
              }
            )
          );
        }


        console.log(
          "Purchasing RevenueCat package:",
          packageToBuy
            ?.identifier,
          packageToBuy
            ?.product
            ?.identifier
        );


        // ====================================================
        // REAL APP STORE / GOOGLE PLAY PURCHASE
        // ====================================================

        const purchasedPlan =
          await buyPackage(
            packageToBuy
          );


        console.log(
          "RevenueCat purchase result:",
          purchasedPlan
        );


        // ====================================================
        // VERIFY ENTITLEMENT
        // ====================================================

        if (
          purchasedPlan !==
            "premium" &&
          purchasedPlan !==
            "elite"
        ) {

          throw new Error(
            t(
              "entitlementNotActivated"
            )
          );
        }


        // ====================================================
        // UPDATE APP MEMBERSHIP
        // ====================================================

        if (
          typeof onConfirm ===
          "function"
        ) {

          await onConfirm(
            purchasedPlan
          );
        }


        const purchasedPlanName =
          purchasedPlan ===
          "elite"

            ? t(
                "elite"
              )

            : t(
                "premium"
              );


        Alert.alert(
          t(
            "membershipActivated"
          ),

          fillTemplate(
            t(
              "membershipNowActive"
            ),
            {
              plan:
                purchasedPlanName,
            }
          )
        );

      } catch (error) {

        // ====================================================
        // USER CANCELLED
        // ====================================================

        if (
          error?.userCancelled
        ) {

          console.log(
            "Subscription purchase cancelled by user."
          );


          return;
        }


        console.log(
          "Subscription purchase error:",
          error
        );


        Alert.alert(
          t(
            "unablePurchase"
          ),

          error?.message ||
            t(
              "tryAgain"
            )
        );

      } finally {

        setIsProcessing(
          false
        );
      }
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
        {/* BACK */}
        {/* ================================================== */}

        <TouchableOpacity
          onPress={
            handleBack
          }
          style={[
            styles.backButton,

            isRTL &&
              styles.backButtonRTL,
          ]}
          activeOpacity={
            0.8
          }
          disabled={
            isProcessing
          }
        >

          <Text
            style={[
              styles.backText,

              isRTL &&
                styles.rtlText,
            ]}
          >

            {isRTL
              ? `${t("back")} ›`
              : `‹ ${t("back")}`}

          </Text>

        </TouchableOpacity>


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <View
          style={
            styles.header
          }
        >

          <Text
            style={[
              styles.kicker,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "checkoutKicker"
            )}
          </Text>


          <Text
            style={[
              styles.title,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "confirmYourMembership"
            )}
          </Text>


          <Text
            style={[
              styles.subtitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "checkoutSubtitle"
            )}
          </Text>

        </View>


        {/* ================================================== */}
        {/* PLAN BADGE */}
        {/* ================================================== */}

        <View
          style={[
            styles.planBadge,

            isElite &&
              styles.elitePlanBadge,

            isRTL &&
              styles.planBadgeRTL,
          ]}
        >

          <Text
            style={[
              styles.planBadgeText,

              isElite &&
                styles.elitePlanBadgeText,

              isRTL &&
                styles.rtlText,
            ]}
          >

            {isElite
              ? t(
                  "eliteBadge"
                )
              : t(
                  "premiumBadge"
                )}

          </Text>

        </View>


        {/* ================================================== */}
        {/* PLAN IMAGE */}
        {/* ================================================== */}

        <View
          style={[
            styles.imageWrap,

            isElite &&
              styles.eliteImageWrap,
          ]}
        >

          <Image
            source={
              plan.image
            }
            style={
              styles.planImage
            }
            resizeMode="cover"
          />

        </View>


        {/* ================================================== */}
        {/* PRICE HERO */}
        {/* ================================================== */}

        <View
          style={
            styles.priceHero
          }
        >

          <Text
            style={[
              styles.priceHeroLabel,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {t(
              "yourMembership"
            )}
          </Text>


          <Text
            style={[
              styles.priceHeroTitle,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {planShortTitle}
          </Text>


          <View
            style={[
              styles.heroPriceRow,

              isRTL &&
                styles.rowReverse,
            ]}
          >

            <Text
              style={[
                styles.heroPrice,

                isElite &&
                  styles.eliteAccentText,
              ]}
            >
              {planPrice}
            </Text>


            <Text
              style={[
                styles.heroMonth,

                isRTL &&
                  styles.heroMonthRTL,
              ]}
            >
              {t(
                "perMonth"
              )}
            </Text>

          </View>


          <Text
            style={[
              styles.billingText,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {t(
              "billedMonthly"
            )}
          </Text>


          {alreadySubscribed && (

            <View
              style={
                styles.activePlanBadge
              }
            >

              <Text
                style={[
                  styles.activePlanText,

                  isRTL &&
                    styles.rtlCenteredText,
                ]}
              >
                {t(
                  "currentPlan"
                )}
              </Text>

            </View>

          )}

        </View>


        {/* ================================================== */}
        {/* BENEFITS */}
        {/* ================================================== */}

        <View
          style={
            styles.benefitsCard
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
              "includedWithPlan"
            )}
          </Text>


          <Text
            style={[
              styles.benefitsTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "membershipBenefits"
            )}
          </Text>


          {benefits.map(
            (
              benefit,
              index
            ) => (

              <View
                key={`${plan.id}-${index}`}
                style={[
                  styles.benefitRow,

                  isRTL &&
                    styles.rowReverse,

                  index ===
                    benefits.length -
                      1 &&
                    styles.lastBenefitRow,
                ]}
              >

                <View
                  style={[
                    styles.checkCircle,

                    isElite &&
                      styles.eliteCheckCircle,

                    isRTL &&
                      styles.checkCircleRTL,
                  ]}
                >

                  <Text
                    style={
                      styles.checkMark
                    }
                  >
                    ✓
                  </Text>

                </View>


                <Text
                  style={[
                    styles.benefitText,

                    isRTL &&
                      styles.rtlText,
                  ]}
                >
                  {benefit}
                </Text>

              </View>
            )
          )}

        </View>


        {/* ================================================== */}
        {/* REWARDS MESSAGE */}
        {/* ================================================== */}

        <View
          style={
            styles.rewardInfoCard
          }
        >

          <Text
            style={[
              styles.rewardInfoTitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "walkEarnProgress"
            )}
          </Text>


          <Text
            style={[
              styles.rewardInfoText,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "rewardsDescription"
            )}
          </Text>

        </View>


        {/* ================================================== */}
        {/* ORDER SUMMARY */}
        {/* ================================================== */}

        <View
          style={[
            styles.summaryCard,

            isElite &&
              styles.eliteSummaryCard,
          ]}
        >

          <View
            style={[
              styles.summaryHeader,

              isRTL &&
                styles.rowReverse,
            ]}
          >

            <View
              style={[
                styles.summaryTitleWrap,

                isRTL &&
                  styles.summaryTitleWrapRTL,
              ]}
            >

              <Text
                style={[
                  styles.summaryKicker,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "orderSummary"
                )}
              </Text>


              <Text
                style={[
                  styles.summaryTitle,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {planTitle}
              </Text>

            </View>


            <View
              style={[
                styles.summaryPlanPill,

                isElite &&
                  styles.eliteSummaryPlanPill,

                isRTL &&
                  styles.summaryPlanPillRTL,
              ]}
            >

              <Text
                style={[
                  styles.summaryPlanPillText,

                  isElite &&
                    styles.eliteSummaryPlanPillText,
                ]}
              >
                {planShortTitle}
              </Text>

            </View>

          </View>


          <View
            style={
              styles.divider
            }
          />


          <SummaryRow
            label={
              t(
                "plan"
              )
            }
            value={
              planTitle
            }
            isRTL={
              isRTL
            }
          />


          <SummaryRow
            label={
              t(
                "billing"
              )
            }
            value={
              t(
                "monthly"
              )
            }
            isRTL={
              isRTL
            }
          />


          <SummaryRow
            label={
              t(
                "price"
              )
            }
            value={
              planPriceLabel
            }
            highlight
            elite={
              isElite
            }
            isRTL={
              isRTL
            }
          />


          <View
            style={
              styles.divider
            }
          />


          <View
            style={[
              styles.totalRow,

              isRTL &&
                styles.rowReverse,
            ]}
          >

            <View
              style={
                styles.totalTextWrap
              }
            >

              <Text
                style={[
                  styles.totalLabel,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "totalToday"
                )}
              </Text>


              <Text
                style={[
                  styles.totalSub,

                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "monthlySubscription"
                )}
              </Text>

            </View>


            <Text
              style={[
                styles.totalValue,

                isElite &&
                  styles.eliteAccentText,
              ]}
            >
              {planPrice}
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* SECURE PURCHASE */}
        {/* ================================================== */}

        <View
          style={[
            styles.secureBox,

            isRTL &&
              styles.rowReverse,
          ]}
        >

          <View
            style={[
              styles.secureIcon,

              isRTL &&
                styles.secureIconRTL,
            ]}
          >

            <Text
              style={
                styles.lockIcon
              }
            >
              🔒
            </Text>

          </View>


          <View
            style={
              styles.secureTextWrap
            }
          >

            <Text
              style={[
                styles.secureTitle,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "securePurchase"
              )}
            </Text>


            <Text
              style={[
                styles.secureText,

                isRTL &&
                  styles.rtlText,
              ]}
            >
              {t(
                "securePurchaseText"
              )}
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* CONFIRM */}
        {/* ================================================== */}

        <TouchableOpacity
          style={[
            styles.confirmButton,

            isElite &&
              styles.eliteButton,

            (
              isProcessing ||
              alreadySubscribed
            ) &&
              styles.disabledButton,
          ]}
          onPress={
            handleConfirm
          }
          activeOpacity={
            0.88
          }
          disabled={
            isProcessing ||
            alreadySubscribed
          }
        >

          {isProcessing ? (

            <View
              style={[
                styles.processingRow,

                isRTL &&
                  styles.rowReverse,
              ]}
            >

              <ActivityIndicator
                size="small"
                color="#020617"
              />


              <Text
                style={[
                  styles.confirmText,

                  isRTL &&
                    styles.confirmTextRTL,
                ]}
              >
                {t(
                  "processing"
                )}
              </Text>

            </View>

          ) : (

            <Text
              style={
                styles.confirmTextCentered
              }
            >

              {alreadySubscribed

                ? t(
                    "currentMembership"
                  )

                : isElite

                ? t(
                    "confirmElite"
                  )

                : t(
                    "confirmPremium"
                  )}

            </Text>

          )}

        </TouchableOpacity>


        {/* ================================================== */}
        {/* PAYMENT INFO */}
        {/* ================================================== */}

        <Text
          style={[
            styles.footerText,

            isRTL &&
              styles.rtlCenteredText,
          ]}
        >
          {t(
            "paymentInfo"
          )}
        </Text>


        {/* ================================================== */}
        {/* CANCELLATION */}
        {/* ================================================== */}

        <View
          style={
            styles.cancelBox
          }
        >

          <Text
            style={[
              styles.cancelTitle,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {t(
              "noLongTermCommitment"
            )}
          </Text>


          <Text
            style={[
              styles.cancelText,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {t(
              "cancelText"
            )}
          </Text>

        </View>


        {/* ================================================== */}
        {/* BRAND FOOTER */}
        {/* ================================================== */}

        <View
          style={
            styles.brandFooter
          }
        >

          <View
            style={
              styles.footerLine
            }
          />


          <Text
            style={
              styles.footerBrand
            }
          >

            <Text
              style={
                styles.footerBlue
              }
            >
              LEGATHON
            </Text>

            {" "}
            WALK

          </Text>


          <Text
            style={[
              styles.footerTagline,

              isRTL &&
                styles.rtlCenteredText,
            ]}
          >
            {t(
              "builtForEveryStep"
            )}
          </Text>

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
// SUMMARY ROW
// ============================================================

function SummaryRow({

  label,

  value,

  highlight = false,

  elite = false,

  isRTL = false,

}) {

  return (

    <View
      style={
        styles.row
      }
    >

      <Text
        style={[
          styles.label,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {label}
      </Text>


      <Text
        style={[
          styles.value,

          highlight &&
            styles.price,

          highlight &&
          elite &&
            styles.eliteAccentText,

          isRTL &&
            styles.rtlText,
        ]}
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

    safe: {
      flex: 1,
      backgroundColor: "#020617",
    },


    container: {
      flex: 1,
      backgroundColor: "#020617",
    },


    content: {
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 100,
    },


    bottomSpace: {
      height: 80,
    },


    // ========================================================
    // RTL
    // ========================================================

    rtlText: {
      writingDirection: "rtl",
      textAlign: "right",
    },


    rtlCenteredText: {
      writingDirection: "rtl",
      textAlign: "center",
    },


    rowReverse: {
      flexDirection: "row-reverse",
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",
      paddingVertical: 10,
      paddingRight: 20,
      marginBottom: 10,
    },


    backButtonRTL: {
      alignSelf: "flex-end",
      paddingRight: 0,
      paddingLeft: 20,
    },


    backText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
      marginBottom: 20,
    },


    kicker: {
      color: "#8EF0C5",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 1.7,
      marginBottom: 9,
    },


    title: {
      color: "#FFFFFF",
      fontSize: 40,
      lineHeight: 44,
      fontWeight: "900",
      letterSpacing: -0.8,
      marginBottom: 12,
    },


    subtitle: {
      color: "#94A3B8",
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
    },


    // ========================================================
    // PLAN BADGE
    // ========================================================

    planBadge: {
      alignSelf: "flex-start",
      backgroundColor:
        "rgba(216,167,46,0.14)",
      borderColor: "#D8A72E",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginBottom: 16,
    },


    planBadgeRTL: {
      alignSelf: "flex-end",
    },


    elitePlanBadge: {
      backgroundColor:
        "rgba(168,85,247,0.15)",
      borderColor: "#A855F7",
    },


    planBadgeText: {
      color: "#D8A72E",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1,
    },


    elitePlanBadgeText: {
      color: "#C084FC",
    },


    // ========================================================
    // IMAGE
    // ========================================================

    imageWrap: {
      width: "100%",
      borderRadius: 26,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "#D8A72E",
      marginBottom: 20,

      shadowColor: "#D8A72E",
      shadowOpacity: 0.25,
      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 8,
    },


    eliteImageWrap: {
      borderColor: "#A855F7",
      shadowColor: "#A855F7",
    },


    planImage: {
      width: "100%",
      height: 430,
    },


    // ========================================================
    // PRICE HERO
    // ========================================================

    priceHero: {
      alignItems: "center",
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#1E334F",
      borderRadius: 24,
      paddingVertical: 22,
      paddingHorizontal: 18,
      marginBottom: 20,
    },


    priceHeroLabel: {
      color: "#64748B",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.5,
      marginBottom: 7,
    },


    priceHeroTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginBottom: 5,
    },


    heroPriceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
    },


    heroPrice: {
      color: "#D8A72E",
      fontSize: 44,
      fontWeight: "900",
    },


    heroMonth: {
      color: "#CBD5E1",
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 8,
      marginLeft: 4,
    },


    heroMonthRTL: {
      marginLeft: 0,
      marginRight: 4,
    },


    billingText: {
      color: "#94A3B8",
      fontSize: 14,
      fontWeight: "700",
      marginTop: 3,
    },


    activePlanBadge: {
      marginTop: 14,
      borderRadius: 999,
      backgroundColor:
        "rgba(142,240,197,0.14)",
      borderWidth: 1,
      borderColor: "#8EF0C5",
      paddingHorizontal: 13,
      paddingVertical: 7,
    },


    activePlanText: {
      color: "#8EF0C5",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
    },


    // ========================================================
    // BENEFITS
    // ========================================================

    benefitsCard: {
      backgroundColor: "#081327",
      borderRadius: 26,
      padding: 22,
      borderWidth: 1,
      borderColor: "#1D334F",
      marginBottom: 20,
    },


    sectionEyebrow: {
      color: "#8EF0C5",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.4,
      marginBottom: 5,
    },


    benefitsTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      marginBottom: 17,
    },


    benefitRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#16243A",
    },


    lastBenefitRow: {
      borderBottomWidth: 0,
    },


    checkCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#D8A72E",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },


    checkCircleRTL: {
      marginRight: 0,
      marginLeft: 12,
    },


    eliteCheckCircle: {
      backgroundColor: "#A855F7",
    },


    checkMark: {
      color: "#020617",
      fontSize: 17,
      fontWeight: "900",
    },


    benefitText: {
      flex: 1,
      color: "#E2E8F0",
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 22,
    },


    // ========================================================
    // REWARD INFO
    // ========================================================

    rewardInfoCard: {
      backgroundColor: "#071224",
      borderWidth: 1,
      borderColor: "#1E334F",
      borderRadius: 22,
      padding: 18,
      marginBottom: 20,
    },


    rewardInfoTitle: {
      color: "#E7C447",
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 6,
    },


    rewardInfoText: {
      color: "#94A3B8",
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
    },


    // ========================================================
    // SUMMARY
    // ========================================================

    summaryCard: {
      backgroundColor: "#081327",
      borderRadius: 28,
      padding: 22,
      borderWidth: 1.5,
      borderColor: "#D8A72E",
      marginBottom: 20,

      shadowColor: "#D8A72E",
      shadowOpacity: 0.13,
      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      elevation: 6,
    },


    eliteSummaryCard: {
      borderColor: "#A855F7",
      shadowColor: "#A855F7",
    },


    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },


    summaryTitleWrap: {
      flex: 1,
      paddingRight: 8,
    },


    summaryTitleWrapRTL: {
      paddingRight: 0,
      paddingLeft: 8,
    },


    summaryKicker: {
      color: "#8EF0C5",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.3,
      marginBottom: 5,
    },


    summaryTitle: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "900",
    },


    summaryPlanPill: {
      backgroundColor: "#D8A72E",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginLeft: 10,
    },


    summaryPlanPillRTL: {
      marginLeft: 0,
      marginRight: 10,
    },


    eliteSummaryPlanPill: {
      backgroundColor: "#A855F7",
    },


    summaryPlanPillText: {
      color: "#020617",
      fontSize: 10,
      fontWeight: "900",
    },


    eliteSummaryPlanPillText: {
      color: "#FFFFFF",
    },


    row: {
      marginBottom: 18,
    },


    label: {
      color: "#94A3B8",
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 5,
    },


    value: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
    },


    price: {
      color: "#D8A72E",
      fontSize: 24,
      fontWeight: "900",
    },


    divider: {
      height: 1,
      backgroundColor: "#26364F",
      marginVertical: 20,
    },


    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },


    totalTextWrap: {
      flex: 1,
    },


    totalLabel: {
      color: "#8EF0C5",
      fontSize: 21,
      fontWeight: "900",
    },


    totalSub: {
      color: "#64748B",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 3,
    },


    totalValue: {
      color: "#D8A72E",
      fontSize: 32,
      fontWeight: "900",
    },


    eliteAccentText: {
      color: "#C084FC",
    },


    // ========================================================
    // SECURE BOX
    // ========================================================

    secureBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#071224",
      borderRadius: 20,
      padding: 17,
      borderWidth: 1,
      borderColor: "#1E334F",
      marginBottom: 20,
    },


    secureIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#102039",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },


    secureIconRTL: {
      marginRight: 0,
      marginLeft: 13,
    },


    lockIcon: {
      fontSize: 20,
    },


    secureTextWrap: {
      flex: 1,
    },


    secureTitle: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 3,
    },


    secureText: {
      color: "#94A3B8",
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
    },


    // ========================================================
    // CONFIRM BUTTON
    // ========================================================

    confirmButton: {
      backgroundColor: "#D8A72E",
      borderRadius: 22,
      paddingVertical: 21,
      paddingHorizontal: 15,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,

      shadowColor: "#D8A72E",
      shadowOpacity: 0.35,
      shadowRadius: 15,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      elevation: 8,
    },


    eliteButton: {
      backgroundColor: "#A855F7",
      shadowColor: "#A855F7",
    },


    disabledButton: {
      opacity: 0.55,
    },


    processingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },


    confirmText: {
      color: "#020617",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: 0.4,
      marginLeft: 8,
    },


    confirmTextRTL: {
      marginLeft: 0,
      marginRight: 8,
    },


    confirmTextCentered: {
      color: "#020617",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: 0.4,
    },


    // ========================================================
    // PAYMENT
    // ========================================================

    footerText: {
      color: "#94A3B8",
      fontSize: 12,
      textAlign: "center",
      lineHeight: 19,
      paddingHorizontal: 8,
      marginBottom: 20,
    },


    cancelBox: {
      backgroundColor: "#071224",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#1E334F",
      padding: 17,
      alignItems: "center",
      marginBottom: 30,
    },


    cancelTitle: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      marginBottom: 5,
      textAlign: "center",
    },


    cancelText: {
      color: "#94A3B8",
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
      fontWeight: "600",
    },


    // ========================================================
    // FOOTER
    // ========================================================

    brandFooter: {
      alignItems: "center",
      paddingTop: 8,
    },


    footerLine: {
      width: 80,
      height: 2,
      borderRadius: 999,
      backgroundColor: "#D8A72E",
      marginBottom: 15,
    },


    footerBrand: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
      letterSpacing: 1,
    },


    footerBlue: {
      color: "#1E7BFF",
    },


    footerTagline: {
      color: "#D8A72E",
      fontSize: 12,
      fontWeight: "800",
      marginTop: 5,
      textAlign: "center",
    },
  });