// screens/MarketplaceScreen.js

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";


// ============================================================
// LEGATHON WALK — MARKETPLACE
// MULTILINGUAL STORE
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


const CATEGORIES = [
  "Mens",
  "Womens",
  "Accessories",
];


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    store: "Store",
    back: "Go back",
    wCoinBalance: "W COIN BALANCE",
    walletText:
      "Use W Coins toward eligible Legathon gear and merchandise.",

    mens: "Men",
    womens: "Women",
    accessories: "Accessories",

    mensCollection: "Men's Collection",
    womensCollection: "Women's Collection",
    accessoriesCollection: "Accessories",

    subscriptionPlans: "Subscription Plans",

    availableNow: "Available now",
    buyNow: "Buy Now",
    useWCoins: "Use W Coins",
    upgrade: "Upgrade",

    free: "Free",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Free Member",
    premiumMember: "Premium Member",
    eliteMember: "Elite Member",

    freePrice: "$0",
    premiumPrice: "$4.99 / month",
    elitePrice: "$9.99 / month",

    perk12Journeys: "12 free Journeys",
    perkCommunity: "Community access",
    perkLeaderboard: "Leaderboard access",
    perkBasicAnalytics: "Basic Walking Analytics",

    perkFullJourneys: "Full Journey collection",
    perk26Marathons: "26 Legathon Marathons",
    perkAIWellness: "AI Wellness Coach",
    perkAIWalking: "AI Walking Coach",
    perkPaceMobility:
      "Walking Pace & Mobility Trends",
    perkDiscounts:
      "WCoin merchandise discounts",

    perkEverythingPremium:
      "Everything in Premium",
    perkPersonalCoach:
      "Personal Wellness Coach",
    perkEnhancedRedemption:
      "Enhanced WCoin redemption",
    perkFreeShipping:
      "Free shipping on eligible merchandise",

    black: "Black",
    blue: "Blue",
    green: "Green",
    grey: "Grey",
    pink: "Pink",
    red: "Red",
    white: "White",
    yellow: "Yellow",
    blackWhite: "Black & White",

    men: "Men",
    women: "Women",

    duffleBag: "Duffle Bag",
    fannyPack: "Fanny Pack",
    bikerShorts: "Biker Shorts",
    compressionPants: "Compression Pants",
    compressionShirt: "Compression Shirt",
    hoodie: "Hoodie",
    tshirt: "T-Shirt",
    shorts: "Shorts",
    sportsBra: "Sports Bra",
  },


  es: {
    store: "Tienda",
    back: "Volver",
    wCoinBalance: "SALDO DE W COINS",
    walletText:
      "Usa W Coins en artículos y productos Legathon elegibles.",

    mens: "Hombres",
    womens: "Mujeres",
    accessories: "Accesorios",

    mensCollection: "Colección para Hombres",
    womensCollection: "Colección para Mujeres",
    accessoriesCollection: "Accesorios",

    subscriptionPlans: "Planes de Suscripción",

    availableNow: "Disponible ahora",
    buyNow: "Comprar Ahora",
    useWCoins: "Usar W Coins",
    upgrade: "Mejorar",

    free: "Gratis",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Miembro Gratis",
    premiumMember: "Miembro Premium",
    eliteMember: "Miembro Elite",

    freePrice: "$0",
    premiumPrice: "$4.99 / mes",
    elitePrice: "$9.99 / mes",

    perk12Journeys: "12 Journeys gratis",
    perkCommunity: "Acceso a la comunidad",
    perkLeaderboard: "Acceso a la clasificación",
    perkBasicAnalytics:
      "Análisis básico de caminata",

    perkFullJourneys:
      "Colección completa de Journeys",
    perk26Marathons:
      "26 Maratones Legathon",
    perkAIWellness:
      "Coach de bienestar con IA",
    perkAIWalking:
      "Coach de caminata con IA",
    perkPaceMobility:
      "Ritmo de caminata y tendencias de movilidad",
    perkDiscounts:
      "Descuentos en productos con WCoin",

    perkEverythingPremium:
      "Todo lo incluido en Premium",
    perkPersonalCoach:
      "Coach personal de bienestar",
    perkEnhancedRedemption:
      "Canje mejorado de WCoin",
    perkFreeShipping:
      "Envío gratis en productos elegibles",

    black: "Negro",
    blue: "Azul",
    green: "Verde",
    grey: "Gris",
    pink: "Rosa",
    red: "Rojo",
    white: "Blanco",
    yellow: "Amarillo",
    blackWhite: "Negro y Blanco",

    men: "Hombre",
    women: "Mujer",

    duffleBag: "Bolsa Deportiva",
    fannyPack: "Riñonera",
    bikerShorts: "Shorts de Ciclismo",
    compressionPants: "Pantalones de Compresión",
    compressionShirt: "Camiseta de Compresión",
    hoodie: "Sudadera con Capucha",
    tshirt: "Camiseta",
    shorts: "Shorts",
    sportsBra: "Sujetador Deportivo",
  },


  fr: {
    store: "Boutique",
    back: "Retour",
    wCoinBalance: "SOLDE W COINS",
    walletText:
      "Utilisez vos W Coins pour les articles Legathon éligibles.",

    mens: "Hommes",
    womens: "Femmes",
    accessories: "Accessoires",

    mensCollection: "Collection Hommes",
    womensCollection: "Collection Femmes",
    accessoriesCollection: "Accessoires",

    subscriptionPlans: "Formules d'Abonnement",

    availableNow: "Disponible maintenant",
    buyNow: "Acheter",
    useWCoins: "Utiliser W Coins",
    upgrade: "Améliorer",

    free: "Gratuit",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Membre Gratuit",
    premiumMember: "Membre Premium",
    eliteMember: "Membre Elite",

    freePrice: "$0",
    premiumPrice: "$4.99 / mois",
    elitePrice: "$9.99 / mois",

    perk12Journeys: "12 Journeys gratuits",
    perkCommunity: "Accès à la communauté",
    perkLeaderboard: "Accès au classement",
    perkBasicAnalytics:
      "Analyse de marche de base",

    perkFullJourneys:
      "Collection complète de Journeys",
    perk26Marathons:
      "26 Marathons Legathon",
    perkAIWellness:
      "Coach bien-être IA",
    perkAIWalking:
      "Coach de marche IA",
    perkPaceMobility:
      "Rythme de marche et tendances de mobilité",
    perkDiscounts:
      "Réductions WCoin sur les articles",

    perkEverythingPremium:
      "Tout ce qui est inclus dans Premium",
    perkPersonalCoach:
      "Coach personnel de bien-être",
    perkEnhancedRedemption:
      "Conversion WCoin améliorée",
    perkFreeShipping:
      "Livraison gratuite sur les articles éligibles",

    black: "Noir",
    blue: "Bleu",
    green: "Vert",
    grey: "Gris",
    pink: "Rose",
    red: "Rouge",
    white: "Blanc",
    yellow: "Jaune",
    blackWhite: "Noir et Blanc",

    men: "Homme",
    women: "Femme",

    duffleBag: "Sac de Sport",
    fannyPack: "Sac Banane",
    bikerShorts: "Short Cycliste",
    compressionPants: "Pantalon de Compression",
    compressionShirt: "Haut de Compression",
    hoodie: "Sweat à Capuche",
    tshirt: "T-Shirt",
    shorts: "Short",
    sportsBra: "Brassière de Sport",
  },


  de: {
    store: "Shop",
    back: "Zurück",
    wCoinBalance: "W COIN GUTHABEN",
    walletText:
      "Verwende W Coins für berechtigte Legathon-Ausrüstung und Merchandise.",

    mens: "Herren",
    womens: "Damen",
    accessories: "Accessoires",

    mensCollection: "Herrenkollektion",
    womensCollection: "Damenkollektion",
    accessoriesCollection: "Accessoires",

    subscriptionPlans: "Abonnementpläne",

    availableNow: "Jetzt verfügbar",
    buyNow: "Jetzt Kaufen",
    useWCoins: "W Coins Verwenden",
    upgrade: "Upgrade",

    free: "Kostenlos",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Kostenloses Mitglied",
    premiumMember: "Premium-Mitglied",
    eliteMember: "Elite-Mitglied",

    freePrice: "$0",
    premiumPrice: "$4.99 / Monat",
    elitePrice: "$9.99 / Monat",

    perk12Journeys: "12 kostenlose Journeys",
    perkCommunity: "Community-Zugang",
    perkLeaderboard: "Bestenlisten-Zugang",
    perkBasicAnalytics:
      "Grundlegende Walking-Analysen",

    perkFullJourneys:
      "Vollständige Journey-Sammlung",
    perk26Marathons:
      "26 Legathon-Marathons",
    perkAIWellness:
      "KI-Wellness-Coach",
    perkAIWalking:
      "KI-Walking-Coach",
    perkPaceMobility:
      "Gehtempo & Mobilitätstrends",
    perkDiscounts:
      "WCoin-Rabatte auf Merchandise",

    perkEverythingPremium:
      "Alles aus Premium",
    perkPersonalCoach:
      "Persönlicher Wellness-Coach",
    perkEnhancedRedemption:
      "Erweiterte WCoin-Einlösung",
    perkFreeShipping:
      "Kostenloser Versand für berechtigte Artikel",

    black: "Schwarz",
    blue: "Blau",
    green: "Grün",
    grey: "Grau",
    pink: "Rosa",
    red: "Rot",
    white: "Weiß",
    yellow: "Gelb",
    blackWhite: "Schwarz & Weiß",

    men: "Herren",
    women: "Damen",

    duffleBag: "Sporttasche",
    fannyPack: "Bauchtasche",
    bikerShorts: "Radlerhose",
    compressionPants: "Kompressionshose",
    compressionShirt: "Kompressionsshirt",
    hoodie: "Hoodie",
    tshirt: "T-Shirt",
    shorts: "Shorts",
    sportsBra: "Sport-BH",
  },


  pt: {
    store: "Loja",
    back: "Voltar",
    wCoinBalance: "SALDO DE W COINS",
    walletText:
      "Use W Coins em equipamentos e produtos Legathon elegíveis.",

    mens: "Masculino",
    womens: "Feminino",
    accessories: "Acessórios",

    mensCollection: "Coleção Masculina",
    womensCollection: "Coleção Feminina",
    accessoriesCollection: "Acessórios",

    subscriptionPlans: "Planos de Assinatura",

    availableNow: "Disponível agora",
    buyNow: "Comprar Agora",
    useWCoins: "Usar W Coins",
    upgrade: "Atualizar",

    free: "Grátis",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Membro Grátis",
    premiumMember: "Membro Premium",
    eliteMember: "Membro Elite",

    freePrice: "$0",
    premiumPrice: "$4.99 / mês",
    elitePrice: "$9.99 / mês",

    perk12Journeys: "12 Journeys grátis",
    perkCommunity: "Acesso à comunidade",
    perkLeaderboard: "Acesso ao ranking",
    perkBasicAnalytics:
      "Análises básicas de caminhada",

    perkFullJourneys:
      "Coleção completa de Journeys",
    perk26Marathons:
      "26 Maratonas Legathon",
    perkAIWellness:
      "Coach de bem-estar com IA",
    perkAIWalking:
      "Coach de caminhada com IA",
    perkPaceMobility:
      "Ritmo de caminhada e tendências de mobilidade",
    perkDiscounts:
      "Descontos WCoin em produtos",

    perkEverythingPremium:
      "Tudo do Premium",
    perkPersonalCoach:
      "Coach pessoal de bem-estar",
    perkEnhancedRedemption:
      "Resgate WCoin aprimorado",
    perkFreeShipping:
      "Frete grátis em produtos elegíveis",

    black: "Preto",
    blue: "Azul",
    green: "Verde",
    grey: "Cinza",
    pink: "Rosa",
    red: "Vermelho",
    white: "Branco",
    yellow: "Amarelo",
    blackWhite: "Preto e Branco",

    men: "Masculino",
    women: "Feminino",

    duffleBag: "Bolsa Esportiva",
    fannyPack: "Pochete",
    bikerShorts: "Shorts de Ciclismo",
    compressionPants: "Calça de Compressão",
    compressionShirt: "Camisa de Compressão",
    hoodie: "Moletom com Capuz",
    tshirt: "Camiseta",
    shorts: "Shorts",
    sportsBra: "Top Esportivo",
  },


  ja: {
    store: "ストア",
    back: "戻る",
    wCoinBalance: "W COIN 残高",
    walletText:
      "対象のLegathonギアや商品にW Coinsを使用できます。",

    mens: "メンズ",
    womens: "レディース",
    accessories: "アクセサリー",

    mensCollection: "メンズコレクション",
    womensCollection: "レディースコレクション",
    accessoriesCollection: "アクセサリー",

    subscriptionPlans: "サブスクリプションプラン",

    availableNow: "販売中",
    buyNow: "今すぐ購入",
    useWCoins: "W Coinsを使う",
    upgrade: "アップグレード",

    free: "無料",
    premium: "Premium",
    elite: "Elite",

    freeMember: "無料メンバー",
    premiumMember: "Premiumメンバー",
    eliteMember: "Eliteメンバー",

    freePrice: "$0",
    premiumPrice: "$4.99 / 月",
    elitePrice: "$9.99 / 月",

    perk12Journeys: "12の無料Journey",
    perkCommunity: "コミュニティアクセス",
    perkLeaderboard: "ランキングアクセス",
    perkBasicAnalytics:
      "基本ウォーキング分析",

    perkFullJourneys:
      "すべてのJourney",
    perk26Marathons:
      "26のLegathonマラソン",
    perkAIWellness:
      "AIウェルネスコーチ",
    perkAIWalking:
      "AIウォーキングコーチ",
    perkPaceMobility:
      "歩行ペースとモビリティ傾向",
    perkDiscounts:
      "WCoin商品割引",

    perkEverythingPremium:
      "Premiumのすべて",
    perkPersonalCoach:
      "パーソナルウェルネスコーチ",
    perkEnhancedRedemption:
      "強化されたWCoin交換",
    perkFreeShipping:
      "対象商品の送料無料",

    black: "ブラック",
    blue: "ブルー",
    green: "グリーン",
    grey: "グレー",
    pink: "ピンク",
    red: "レッド",
    white: "ホワイト",
    yellow: "イエロー",
    blackWhite: "ブラック＆ホワイト",

    men: "メンズ",
    women: "レディース",

    duffleBag: "ダッフルバッグ",
    fannyPack: "ウエストバッグ",
    bikerShorts: "バイカーショーツ",
    compressionPants: "コンプレッションパンツ",
    compressionShirt: "コンプレッションシャツ",
    hoodie: "パーカー",
    tshirt: "Tシャツ",
    shorts: "ショーツ",
    sportsBra: "スポーツブラ",
  },


  ko: {
    store: "스토어",
    back: "뒤로 가기",
    wCoinBalance: "W COIN 잔액",
    walletText:
      "W Coins를 사용하여 대상 Legathon 장비와 상품을 구매하세요.",

    mens: "남성",
    womens: "여성",
    accessories: "액세서리",

    mensCollection: "남성 컬렉션",
    womensCollection: "여성 컬렉션",
    accessoriesCollection: "액세서리",

    subscriptionPlans: "구독 플랜",

    availableNow: "현재 구매 가능",
    buyNow: "지금 구매",
    useWCoins: "W Coins 사용",
    upgrade: "업그레이드",

    free: "무료",
    premium: "Premium",
    elite: "Elite",

    freeMember: "무료 회원",
    premiumMember: "Premium 회원",
    eliteMember: "Elite 회원",

    freePrice: "$0",
    premiumPrice: "$4.99 / 월",
    elitePrice: "$9.99 / 월",

    perk12Journeys: "무료 Journey 12개",
    perkCommunity: "커뮤니티 이용",
    perkLeaderboard: "리더보드 이용",
    perkBasicAnalytics: "기본 걷기 분석",

    perkFullJourneys: "전체 Journey 컬렉션",
    perk26Marathons: "Legathon 마라톤 26개",
    perkAIWellness: "AI 웰니스 코치",
    perkAIWalking: "AI 워킹 코치",
    perkPaceMobility: "걷기 속도 및 이동성 추세",
    perkDiscounts: "WCoin 상품 할인",

    perkEverythingPremium: "Premium의 모든 기능",
    perkPersonalCoach: "개인 웰니스 코치",
    perkEnhancedRedemption: "향상된 WCoin 교환",
    perkFreeShipping: "대상 상품 무료 배송",

    black: "블랙",
    blue: "블루",
    green: "그린",
    grey: "그레이",
    pink: "핑크",
    red: "레드",
    white: "화이트",
    yellow: "옐로우",
    blackWhite: "블랙 & 화이트",

    men: "남성",
    women: "여성",

    duffleBag: "더플백",
    fannyPack: "패니팩",
    bikerShorts: "바이커 쇼츠",
    compressionPants: "컴프레션 팬츠",
    compressionShirt: "컴프레션 셔츠",
    hoodie: "후디",
    tshirt: "티셔츠",
    shorts: "쇼츠",
    sportsBra: "스포츠 브라",
  },


  zh: {
    store: "商店",
    back: "返回",
    wCoinBalance: "W COIN 余额",
    walletText:
      "使用 W Coins 购买符合条件的 Legathon 装备和商品。",

    mens: "男士",
    womens: "女士",
    accessories: "配饰",

    mensCollection: "男士系列",
    womensCollection: "女士系列",
    accessoriesCollection: "配饰",

    subscriptionPlans: "订阅计划",

    availableNow: "现已发售",
    buyNow: "立即购买",
    useWCoins: "使用 W Coins",
    upgrade: "升级",

    free: "免费",
    premium: "Premium",
    elite: "Elite",

    freeMember: "免费会员",
    premiumMember: "Premium 会员",
    eliteMember: "Elite 会员",

    freePrice: "$0",
    premiumPrice: "$4.99 / 月",
    elitePrice: "$9.99 / 月",

    perk12Journeys: "12个免费 Journey",
    perkCommunity: "社区访问",
    perkLeaderboard: "排行榜访问",
    perkBasicAnalytics: "基础步行分析",

    perkFullJourneys: "完整 Journey 系列",
    perk26Marathons: "26场 Legathon 马拉松",
    perkAIWellness: "AI 健康教练",
    perkAIWalking: "AI 步行教练",
    perkPaceMobility: "步行速度与活动能力趋势",
    perkDiscounts: "WCoin 商品折扣",

    perkEverythingPremium: "包含 Premium 的全部功能",
    perkPersonalCoach: "个人健康教练",
    perkEnhancedRedemption: "增强 WCoin 兑换",
    perkFreeShipping: "符合条件的商品免费配送",

    black: "黑色",
    blue: "蓝色",
    green: "绿色",
    grey: "灰色",
    pink: "粉色",
    red: "红色",
    white: "白色",
    yellow: "黄色",
    blackWhite: "黑白",

    men: "男士",
    women: "女士",

    duffleBag: "旅行包",
    fannyPack: "腰包",
    bikerShorts: "骑行短裤",
    compressionPants: "压缩长裤",
    compressionShirt: "压缩上衣",
    hoodie: "连帽衫",
    tshirt: "T恤",
    shorts: "短裤",
    sportsBra: "运动文胸",
  },


  it: {
    store: "Negozio",
    back: "Indietro",
    wCoinBalance: "SALDO W COINS",
    walletText:
      "Usa W Coins per articoli e prodotti Legathon idonei.",

    mens: "Uomo",
    womens: "Donna",
    accessories: "Accessori",

    mensCollection: "Collezione Uomo",
    womensCollection: "Collezione Donna",
    accessoriesCollection: "Accessori",

    subscriptionPlans: "Piani di Abbonamento",

    availableNow: "Disponibile ora",
    buyNow: "Acquista Ora",
    useWCoins: "Usa W Coins",
    upgrade: "Aggiorna",

    free: "Gratis",
    premium: "Premium",
    elite: "Elite",

    freeMember: "Membro Gratuito",
    premiumMember: "Membro Premium",
    eliteMember: "Membro Elite",

    freePrice: "$0",
    premiumPrice: "$4.99 / mese",
    elitePrice: "$9.99 / mese",

    perk12Journeys: "12 Journey gratuiti",
    perkCommunity: "Accesso alla community",
    perkLeaderboard: "Accesso alla classifica",
    perkBasicAnalytics: "Analisi base della camminata",

    perkFullJourneys: "Collezione completa di Journey",
    perk26Marathons: "26 Maratone Legathon",
    perkAIWellness: "Coach benessere IA",
    perkAIWalking: "Coach camminata IA",
    perkPaceMobility:
      "Ritmo di camminata e tendenze di mobilità",
    perkDiscounts: "Sconti WCoin sui prodotti",

    perkEverythingPremium: "Tutto di Premium",
    perkPersonalCoach: "Coach personale di benessere",
    perkEnhancedRedemption: "Riscatto WCoin avanzato",
    perkFreeShipping:
      "Spedizione gratuita sui prodotti idonei",

    black: "Nero",
    blue: "Blu",
    green: "Verde",
    grey: "Grigio",
    pink: "Rosa",
    red: "Rosso",
    white: "Bianco",
    yellow: "Giallo",
    blackWhite: "Nero e Bianco",

    men: "Uomo",
    women: "Donna",

    duffleBag: "Borsone",
    fannyPack: "Marsupio",
    bikerShorts: "Pantaloncini da Ciclista",
    compressionPants: "Pantaloni a Compressione",
    compressionShirt: "Maglia a Compressione",
    hoodie: "Felpa con Cappuccio",
    tshirt: "T-Shirt",
    shorts: "Pantaloncini",
    sportsBra: "Reggiseno Sportivo",
  },


  ar: {
    store: "المتجر",
    back: "رجوع",
    wCoinBalance: "رصيد W COIN",
    walletText:
      "استخدم W Coins لشراء معدات ومنتجات Legathon المؤهلة.",

    mens: "رجالي",
    womens: "نسائي",
    accessories: "إكسسوارات",

    mensCollection: "مجموعة الرجال",
    womensCollection: "مجموعة النساء",
    accessoriesCollection: "الإكسسوارات",

    subscriptionPlans: "خطط الاشتراك",

    availableNow: "متوفر الآن",
    buyNow: "اشترِ الآن",
    useWCoins: "استخدم W Coins",
    upgrade: "ترقية",

    free: "مجاني",
    premium: "Premium",
    elite: "Elite",

    freeMember: "عضو مجاني",
    premiumMember: "عضو Premium",
    eliteMember: "عضو Elite",

    freePrice: "$0",
    premiumPrice: "$4.99 / شهر",
    elitePrice: "$9.99 / شهر",

    perk12Journeys: "12 رحلة Journey مجانية",
    perkCommunity: "الوصول إلى المجتمع",
    perkLeaderboard: "الوصول إلى لوحة المتصدرين",
    perkBasicAnalytics: "تحليلات المشي الأساسية",

    perkFullJourneys: "مجموعة Journey الكاملة",
    perk26Marathons: "26 ماراثون Legathon",
    perkAIWellness: "مدرب العافية بالذكاء الاصطناعي",
    perkAIWalking: "مدرب المشي بالذكاء الاصطناعي",
    perkPaceMobility: "سرعة المشي واتجاهات الحركة",
    perkDiscounts: "خصومات WCoin على المنتجات",

    perkEverythingPremium: "كل مزايا Premium",
    perkPersonalCoach: "مدرب عافية شخصي",
    perkEnhancedRedemption: "استبدال WCoin المحسن",
    perkFreeShipping: "شحن مجاني للمنتجات المؤهلة",

    black: "أسود",
    blue: "أزرق",
    green: "أخضر",
    grey: "رمادي",
    pink: "وردي",
    red: "أحمر",
    white: "أبيض",
    yellow: "أصفر",
    blackWhite: "أسود وأبيض",

    men: "رجالي",
    women: "نسائي",

    duffleBag: "حقيبة رياضية",
    fannyPack: "حقيبة خصر",
    bikerShorts: "شورت دراجات",
    compressionPants: "بنطال ضغط",
    compressionShirt: "قميص ضغط",
    hoodie: "هودي",
    tshirt: "تي شيرت",
    shorts: "شورت",
    sportsBra: "حمالة صدر رياضية",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code =
    String(language || "en")
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
    TEXT[language]?.[key] ||
    TEXT.en[key] ||
    key
  );
}


// ============================================================
// SUBSCRIPTION PLANS
//
// IDs and prices remain canonical.
// Only display text is translated.
// ============================================================

const PLANS = [
  {
    id: "free",

    nameKey: "free",

    priceKey: "freePrice",

    perkKeys: [
      "perk12Journeys",
      "perkCommunity",
      "perkLeaderboard",
      "perkBasicAnalytics",
    ],
  },

  {
    id: "premium",

    nameKey: "premium",

    priceKey: "premiumPrice",

    perkKeys: [
      "perkFullJourneys",
      "perk26Marathons",
      "perkAIWellness",
      "perkAIWalking",
      "perkPaceMobility",
      "perkDiscounts",
    ],
  },

  {
    id: "elite",

    nameKey: "elite",

    priceKey: "elitePrice",

    perkKeys: [
      "perkEverythingPremium",
      "perkPersonalCoach",
      "perkEnhancedRedemption",
      "perkFreeShipping",
    ],
  },
];


// ============================================================
// STORE ITEMS
//
// IMPORTANT:
// IDs, categories, prices, WCoin prices and images are unchanged.
// ============================================================

export const STORE_ITEMS = [

  // ==========================================================
  // ACCESSORIES
  // ==========================================================

  {
    id: "dufflebag-black",
    category: "Accessories",
    title: "Legathon Black Duffle Bag",
    price: 69.99,
    coins: 1200,
    image: require(
      "../assets/apparel/accessories/dufflebag_black.png"
    ),
  },

  {
    id: "dufflebag-pink",
    category: "Accessories",
    title: "Legathon Pink Duffle Bag",
    price: 69.99,
    coins: 1200,
    image: require(
      "../assets/apparel/accessories/dufflebag_pink.png"
    ),
  },

  {
    id: "fanny-black",
    category: "Accessories",
    title: "Legathon Black Fanny Pack",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/accessories/fanny_black.png"
    ),
  },

  {
    id: "fanny-pink",
    category: "Accessories",
    title: "Legathon Pink Fanny Pack",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/accessories/fanny_pink.png"
    ),
  },


  // ==========================================================
  // BIKER SHORTS
  // ==========================================================

  {
    id: "bikers-black-womens",
    category: "Womens",
    title: "Black Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_black_womens.png"
    ),
  },

  {
    id: "bikers-blue-womens",
    category: "Womens",
    title: "Blue Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_blue_womens.png"
    ),
  },

  {
    id: "bikers-green-womens",
    category: "Womens",
    title: "Green Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_green_womens.png"
    ),
  },

  {
    id: "bikers-grey-womens",
    category: "Womens",
    title: "Grey Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_grey_womens.png"
    ),
  },

  {
    id: "bikers-pink-womens",
    category: "Womens",
    title: "Pink Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_pink_womens.png"
    ),
  },

  {
    id: "bikers-red-womens",
    category: "Womens",
    title: "Red Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_red_womens.png"
    ),
  },

  {
    id: "bikers-white-womens",
    category: "Womens",
    title: "White Women Biker Shorts",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/biker_shorts/bikers_white_womens.png"
    ),
  },


  // ==========================================================
  // COMPRESSION PANTS
  // ==========================================================

  {
    id: "compressor-black-men-pants",
    category: "Mens",
    title: "Black Men Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_black_men.png"
    ),
  },

  {
    id: "compressor-black-women-pants",
    category: "Womens",
    title: "Black Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_black_women.png"
    ),
  },

  {
    id: "compressor-blue-men-pants",
    category: "Mens",
    title: "Blue Men Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_blue_men.png"
    ),
  },

  {
    id: "compressor-blue-womens-pants",
    category: "Womens",
    title: "Blue Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_blue_womens.png"
    ),
  },

  {
    id: "compressor-grey-womens-pants",
    category: "Womens",
    title: "Grey Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_grey_womens.png"
    ),
  },

  {
    id: "compressor-pink-womens-pants",
    category: "Womens",
    title: "Pink Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_pink_womens.png"
    ),
  },

  {
    id: "compressor-red-men-pants",
    category: "Mens",
    title: "Red Men Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_red_men.png"
    ),
  },

  {
    id: "compressor-red-womens-pants",
    category: "Womens",
    title: "Red Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_red_womens.png"
    ),
  },

  {
    id: "compressor-white-men-pants",
    category: "Mens",
    title: "White Men Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_white_men.png"
    ),
  },

  {
    id: "compressor-white-womens-pants",
    category: "Womens",
    title: "White Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_white_womens.png"
    ),
  },

  {
    id: "compressor-yellow-womens-pants",
    category: "Womens",
    title: "Yellow Women Compression Pants",
    price: 39.99,
    coins: 700,
    image: require(
      "../assets/apparel/compressor_pants/compressor_yellow_womens.png"
    ),
  },


  // ==========================================================
  // COMPRESSION SHIRTS
  // ==========================================================

  {
    id: "compressor-black-men-shirt",
    category: "Mens",
    title: "Black Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_black_men.png"
    ),
  },

  {
    id: "compressor-blue-men-shirt",
    category: "Mens",
    title: "Blue Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_blue_men.png"
    ),
  },

  {
    id: "compressor-blue-womens-shirt",
    category: "Womens",
    title: "Blue Women Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_blue_womens.png"
    ),
  },

  {
    id: "compressor-green-women-shirt",
    category: "Womens",
    title: "Green Women Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_green_women.png"
    ),
  },

  {
    id: "compressor-grey-men-shirt",
    category: "Mens",
    title: "Grey Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_grey_men.png"
    ),
  },

  {
    id: "compressor-red-men-shirt",
    category: "Mens",
    title: "Red Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_red_men.png"
    ),
  },

  {
    id: "compressor-red-womens-shirt",
    category: "Womens",
    title: "Red Women Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_red_womens.png"
    ),
  },

  {
    id: "compressor-white-men-shirt",
    category: "Mens",
    title: "White Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_white_men.png"
    ),
  },

  {
    id: "compressor-white-womens-shirt",
    category: "Womens",
    title: "White Women Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_white_womens.png"
    ),
  },

  {
    id: "compressor-yellow-men-shirt",
    category: "Mens",
    title: "Yellow Men Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_yellow_men.png"
    ),
  },

  {
    id: "compressor-yellow-womens-shirt",
    category: "Womens",
    title: "Yellow Women Compression Shirt",
    price: 34.99,
    coins: 650,
    image: require(
      "../assets/apparel/compressor_shirts/compressor_yellow_womens.png"
    ),
  },


  // ==========================================================
  // HOODIES
  // ==========================================================

  {
    id: "hoodie-black-mens",
    category: "Mens",
    title: "Black Men Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_black_mens.png"
    ),
  },

  {
    id: "hoodie-black-womens",
    category: "Womens",
    title: "Black Women Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_black_womens.png"
    ),
  },

  {
    id: "hoodie-blue-womens",
    category: "Womens",
    title: "Blue Women Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_blue_womens.png"
    ),
  },

  {
    id: "hoodie-green-mens",
    category: "Mens",
    title: "Green Men Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_green_mens.png"
    ),
  },

  {
    id: "hoodie-green-womens",
    category: "Womens",
    title: "Green Women Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_green_womens.png"
    ),
  },

  {
    id: "hoodie-red-mens",
    category: "Mens",
    title: "Red Men Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_red_mens.png"
    ),
  },

  {
    id: "hoodie-red-womens",
    category: "Womens",
    title: "Red Women Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_red_womens.png"
    ),
  },

  {
    id: "hoodie-white-mens",
    category: "Mens",
    title: "White Men Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_white_mens.png"
    ),
  },

  {
    id: "hoodie-white-womens",
    category: "Womens",
    title: "White Women Hoodie",
    price: 49.99,
    coins: 1000,
    image: require(
      "../assets/apparel/hoodies/hoodie_white_womens.png"
    ),
  },


  // ==========================================================
  // MEN T-SHIRTS
  // ==========================================================

  {
    id: "tshirt-black-mens",
    category: "Mens",
    title: "Black Men T-Shirt",
    price: 24.99,
    coins: 400,
    image: require(
      "../assets/apparel/men tshirts/tshirt_black_mens.png"
    ),
  },

  {
    id: "tshirt-blue-mens",
    category: "Mens",
    title: "Blue Men T-Shirt",
    price: 24.99,
    coins: 400,
    image: require(
      "../assets/apparel/men tshirts/tshirt_blue_mens.png"
    ),
  },

  {
    id: "tshirt-green-mens",
    category: "Mens",
    title: "Green Men T-Shirt",
    price: 24.99,
    coins: 400,
    image: require(
      "../assets/apparel/men tshirts/tshirt_green_mens.png"
    ),
  },

  {
    id: "tshirt-red-mens",
    category: "Mens",
    title: "Red Men T-Shirt",
    price: 24.99,
    coins: 400,
    image: require(
      "../assets/apparel/men tshirts/tshirt_red_mens.png"
    ),
  },

  {
    id: "tshirt-white-mens",
    category: "Mens",
    title: "White Men T-Shirt",
    price: 24.99,
    coins: 400,
    image: require(
      "../assets/apparel/men tshirts/tshirt_white_mens.png"
    ),
  },


  // ==========================================================
  // WOMEN SHORTS
  // ==========================================================

  {
    id: "shorts-black",
    category: "Womens",
    title: "Black Shorts",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/shorts/shorts_black.png"
    ),
  },

  {
    id: "shorts-blue",
    category: "Womens",
    title: "Blue Shorts",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/shorts/shorts_blue.png"
    ),
  },

  {
    id: "shorts-green",
    category: "Womens",
    title: "Green Shorts",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/shorts/shorts_green.png"
    ),
  },

  {
    id: "shorts-red",
    category: "Womens",
    title: "Red Shorts",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/shorts/shorts_red.png"
    ),
  },

  {
    id: "shorts-white",
    category: "Womens",
    title: "White Shorts",
    price: 29.99,
    coins: 500,
    image: require(
      "../assets/apparel/shorts/shorts_white.png"
    ),
  },


  // ==========================================================
  // SPORTS BRAS
  // ==========================================================

  {
    id: "sport-black-womens",
    category: "Womens",
    title: "Black Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_black_womens.png"
    ),
  },

  {
    id: "sport-blackwhite-womens",
    category: "Womens",
    title: "Black White Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_blackwhite_womens.png"
    ),
  },

  {
    id: "sport-blue-womens",
    category: "Womens",
    title: "Blue Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_blue_womens.png"
    ),
  },

  {
    id: "sport-green-women",
    category: "Womens",
    title: "Green Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_green_women.png"
    ),
  },

  {
    id: "sport-grey-womens",
    category: "Womens",
    title: "Grey Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_grey_womens.png"
    ),
  },

  {
    id: "sport-pink-womens",
    category: "Womens",
    title: "Pink Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_pink_womens.png"
    ),
  },

  {
    id: "sport-red-womens",
    category: "Womens",
    title: "Red Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_red_womens.png"
    ),
  },

  {
    id: "sport-white-women",
    category: "Womens",
    title: "White Sports Bra",
    price: 34.99,
    coins: 600,
    image: require(
      "../assets/apparel/sports_bra/sport_white_women.png"
    ),
  },
];


// ============================================================
// PRODUCT DISPLAY HELPERS
//
// Products keep their original English title internally.
// We translate only the visible title.
// ============================================================

const COLOR_KEYS = {
  black: "black",
  blue: "blue",
  green: "green",
  grey: "grey",
  gray: "grey",
  pink: "pink",
  red: "red",
  white: "white",
  yellow: "yellow",
};


function getCategoryLabel(
  category,
  language
) {
  if (category === "Mens") {
    return getText(
      language,
      "mens"
    );
  }

  if (category === "Womens") {
    return getText(
      language,
      "womens"
    );
  }

  return getText(
    language,
    "accessories"
  );
}


function getMemberTierLabel(
  memberTier,
  language
) {
  const normalized =
    String(
      memberTier || ""
    )
      .trim()
      .toLowerCase();

  if (
    normalized === "free" ||
    normalized === "free member"
  ) {
    return getText(
      language,
      "freeMember"
    );
  }

  if (
    normalized === "premium" ||
    normalized === "premium member"
  ) {
    return getText(
      language,
      "premiumMember"
    );
  }

  if (
    normalized === "elite" ||
    normalized === "elite member"
  ) {
    return getText(
      language,
      "eliteMember"
    );
  }

  // Preserve custom membership labels.
  return memberTier;
}


function getProductTitle(
  item,
  language
) {
  const id =
    String(
      item?.id || ""
    ).toLowerCase();

  const original =
    item?.title || "";

  let colorKey = null;

  if (
    id.includes(
      "blackwhite"
    )
  ) {
    colorKey =
      "blackWhite";
  } else {
    for (
      const [
        word,
        key,
      ] of Object.entries(
        COLOR_KEYS
      )
    ) {
      if (
        id.includes(
          `-${word}`
        ) ||
        id.startsWith(
          word
        )
      ) {
        colorKey = key;
        break;
      }
    }
  }

  const color =
    colorKey
      ? getText(
          language,
          colorKey
        )
      : "";


  let productKey = null;

  if (
    id.includes(
      "dufflebag"
    )
  ) {
    productKey =
      "duffleBag";
  } else if (
    id.includes(
      "fanny"
    )
  ) {
    productKey =
      "fannyPack";
  } else if (
    id.includes(
      "bikers"
    )
  ) {
    productKey =
      "bikerShorts";
  } else if (
    id.includes(
      "compressor"
    ) &&
    id.includes(
      "pants"
    )
  ) {
    productKey =
      "compressionPants";
  } else if (
    id.includes(
      "compressor"
    ) &&
    id.includes(
      "shirt"
    )
  ) {
    productKey =
      "compressionShirt";
  } else if (
    id.includes(
      "hoodie"
    )
  ) {
    productKey =
      "hoodie";
  } else if (
    id.includes(
      "tshirt"
    )
  ) {
    productKey =
      "tshirt";
  } else if (
    id.includes(
      "sport-"
    )
  ) {
    productKey =
      "sportsBra";
  } else if (
    id.includes(
      "shorts"
    )
  ) {
    productKey =
      "shorts";
  }


  if (!productKey) {
    return original;
  }


  const product =
    getText(
      language,
      productKey
    );


  let gender = "";

  if (
    id.includes(
      "womens"
    ) ||
    id.includes(
      "women"
    )
  ) {
    gender =
      getText(
        language,
        "women"
      );
  } else if (
    id.includes(
      "mens"
    ) ||
    id.includes(
      "-men-"
    )
  ) {
    gender =
      getText(
        language,
        "men"
      );
  }


  // Accessories retain the Legathon brand.
  if (
    item.category ===
    "Accessories"
  ) {
    return [
      "Legathon",
      color,
      product,
    ]
      .filter(Boolean)
      .join(" ");
  }


  // Women's generic shorts do not need gender repeated.
  if (
    id.startsWith(
      "shorts-"
    )
  ) {
    return [
      color,
      product,
    ]
      .filter(Boolean)
      .join(" ");
  }


  return [
    color,
    gender,
    product,
  ]
    .filter(Boolean)
    .join(" ");
}


// ============================================================
// MARKETPLACE SCREEN
// ============================================================

export default function MarketplaceScreen({
  language = "en",

  goBack,

  wCoins = 4250,

  memberTier = "Free Member",

  onBuyProduct,

  onBuyWithCoins,

  onSubscribe,
}) {

  const languageCode =
    normalizeLanguage(
      language
    );


  const t =
    useCallback(
      key =>
        getText(
          languageCode,
          key
        ),
      [
        languageCode,
      ]
    );


  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(
      "Mens"
    );


  const isRTL =
    languageCode ===
    "ar";


  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(
      () =>
        STORE_ITEMS.filter(
          item =>
            item.category ===
            selectedCategory
        ),
      [
        selectedCategory,
      ]
    );


  // ==========================================================
  // COLLECTION TITLE
  // ==========================================================

  const collectionTitle =
    selectedCategory ===
    "Mens"
      ? t(
          "mensCollection"
        )
      : selectedCategory ===
          "Womens"
        ? t(
            "womensCollection"
          )
        : t(
            "accessoriesCollection"
          );


  // ==========================================================
  // WALLET NUMBER
  // ==========================================================

  const walletAmount =
    useMemo(
      () => {
        const amount =
          Number(
            wCoins || 0
          );

        try {
          return amount
            .toLocaleString(
              languageCode
            );
        } catch {
          return amount
            .toLocaleString();
        }
      },
      [
        wCoins,
        languageCode,
      ]
    );


  // ==========================================================
  // UI
  // ==========================================================

  return (
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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <View
        style={[
          styles.headerRow,

          isRTL &&
            styles.rowRTL,
        ]}
      >

        <TouchableOpacity
          style={[
            styles.backButton,

            isRTL &&
              styles.backButtonRTL,
          ]}
          onPress={
            goBack
          }
          activeOpacity={
            0.8
          }
          accessibilityRole=
            "button"
          accessibilityLabel={
            t(
              "back"
            )
          }
        >

          <Ionicons
            name={
              isRTL
                ? "chevron-forward"
                : "chevron-back"
            }
            size={
              24
            }
            color=
              "#FFFFFF"
          />

        </TouchableOpacity>


        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={[
              styles.kicker,
              rtlText,
            ]}
          >
            LEGATHON WALK
          </Text>


          <Text
            style={[
              styles.title,
              rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              1
            }
          >
            {t(
              "store"
            )}
          </Text>

        </View>

      </View>


      {/* =====================================================
          WCOIN WALLET
      ===================================================== */}

      <View
        style={
          styles.walletCard
        }
      >

        <Text
          style={[
            styles.walletLabel,
            rtlText,
          ]}
        >
          {t(
            "wCoinBalance"
          )}
        </Text>


        <View
          style={[
            styles.walletRow,

            isRTL &&
              styles.rowRTL,
          ]}
        >

          <Image
            source={
              WCOIN
            }
            style={[
              styles.coinIcon,

              isRTL &&
                styles.coinIconRTL,
            ]}
          />


          <Text
            style={[
              styles.walletAmount,

              isRTL &&
                styles.walletAmountRTL,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              1
            }
          >
            {walletAmount}
          </Text>

        </View>


        <Text
          style={[
            styles.walletText,
            rtlText,
          ]}
        >
          {t(
            "walletText"
          )}
        </Text>


        <Text
          style={[
            styles.memberText,
            rtlText,
          ]}
        >
          {getMemberTierLabel(
            memberTier,
            languageCode
          )}
        </Text>

      </View>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.categoryRow
        }
      >

        {CATEGORIES.map(
          category => {

            const active =
              selectedCategory ===
              category;


            return (
              <TouchableOpacity
                key={
                  category
                }
                style={[
                  styles.categoryPill,

                  active &&
                    styles.categoryPillActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >

                <Text
                  style={[
                    styles.categoryText,

                    active &&
                      styles.categoryTextActive,

                    isRTL &&
                      styles.rtlCenterText,
                  ]}
                  adjustsFontSizeToFit
                  numberOfLines={
                    1
                  }
                >
                  {getCategoryLabel(
                    category,
                    languageCode
                  )}
                </Text>

              </TouchableOpacity>
            );
          }
        )}

      </ScrollView>


      {/* =====================================================
          COLLECTION
      ===================================================== */}

      <Text
        style={[
          styles.sectionTitle,
          rtlText,
        ]}
      >
        {collectionTitle}
      </Text>


      <View
        style={
          styles.grid
        }
      >

        {filteredProducts.map(
          item => (

            <ProductCard
              key={
                item.id
              }
              item={
                item
              }
              language={
                languageCode
              }
              onBuyProduct={
                onBuyProduct
              }
              onBuyWithCoins={
                onBuyWithCoins
              }
            />

          )
        )}

      </View>


      {/* =====================================================
          SUBSCRIPTIONS
      ===================================================== */}

      <Text
        style={[
          styles.sectionTitle,
          rtlText,
        ]}
      >
        {t(
          "subscriptionPlans"
        )}
      </Text>


      {PLANS.map(
        plan => {

          const displayPlan = {
            id:
              plan.id,

            // Keep callback-compatible English canonical values.
            name:
              plan.id === "free"
                ? "Free"
                : plan.id === "premium"
                  ? "Premium"
                  : "Elite",

            price:
              plan.id === "free"
                ? "$0"
                : plan.id === "premium"
                  ? "$4.99 / month"
                  : "$9.99 / month",

            perks:
              plan.perkKeys.map(
                key =>
                  TEXT.en[key]
              ),
          };


          return (
            <View
              key={
                plan.id
              }
              style={
                styles.planCard
              }
            >

              <View
                style={[
                  styles.planTop,

                  isRTL &&
                    styles.rowRTL,
                ]}
              >

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={[
                      styles.planName,
                      rtlText,
                    ]}
                    adjustsFontSizeToFit
                    numberOfLines={
                      1
                    }
                  >
                    {t(
                      plan.nameKey
                    )}
                  </Text>


                  <Text
                    style={[
                      styles.planPrice,
                      rtlText,
                    ]}
                  >
                    {t(
                      plan.priceKey
                    )}
                  </Text>

                </View>


                {plan.id !==
                  "free" && (

                  <TouchableOpacity
                    style={[
                      styles.subscribeButton,

                      isRTL &&
                        styles.subscribeButtonRTL,
                    ]}
                    onPress={() =>
                      onSubscribe?.(
                        displayPlan
                      )
                    }
                  >

                    <Text
                      style={
                        styles.subscribeButtonText
                      }
                      adjustsFontSizeToFit
                      numberOfLines={
                        1
                      }
                    >
                      {t(
                        "upgrade"
                      )}
                    </Text>

                  </TouchableOpacity>

                )}

              </View>


              {plan.perkKeys.map(
                perkKey => (

                  <Text
                    key={
                      perkKey
                    }
                    style={[
                      styles.planPerk,
                      rtlText,
                    ]}
                  >
                    {isRTL
                      ? `${t(perkKey)} •`
                      : `• ${t(perkKey)}`}
                  </Text>

                )
              )}

            </View>
          );
        }
      )}

    </ScrollView>
  );
}


// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({
  item,
  language,
  onBuyProduct,
  onBuyWithCoins,
}) {

  const isRTL =
    language === "ar";


  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  const categoryLabel =
    getCategoryLabel(
      item.category,
      language
    );


  const productTitle =
    getProductTitle(
      item,
      language
    );


  let coinAmount;

  try {
    coinAmount =
      Number(
        item.coins || 0
      ).toLocaleString(
        language
      );
  } catch {
    coinAmount =
      Number(
        item.coins || 0
      ).toLocaleString();
  }


  return (
    <View
      style={
        styles.productCard
      }
    >

      <View
        style={
          styles.imageBox
        }
      >

        <Image
          source={
            item.image
          }
          style={
            styles.productImage
          }
        />

      </View>


      <Text
        style={[
          styles.productCategory,
          rtlText,
        ]}
        numberOfLines={
          1
        }
        adjustsFontSizeToFit
      >
        {categoryLabel}
      </Text>


      <Text
        style={[
          styles.productTitle,
          rtlText,
        ]}
        numberOfLines={
          3
        }
        adjustsFontSizeToFit
      >
        {productTitle}
      </Text>


      <Text
        style={[
          styles.productPrice,
          rtlText,
        ]}
      >
        ${Number(
          item.price
        ).toFixed(2)}
      </Text>


      <View
        style={[
          styles.coinRow,

          isRTL &&
            styles.rowRTL,
        ]}
      >

        <Image
          source={
            WCOIN
          }
          style={[
            styles.smallCoin,

            isRTL &&
              styles.smallCoinRTL,
          ]}
        />


        <Text
          style={[
            styles.coinPrice,
            rtlText,
          ]}
        >
          {coinAmount}
        </Text>

      </View>


      <Text
        style={[
          styles.availableText,
          rtlText,
        ]}
      >
        {getText(
          language,
          "availableNow"
        )}
      </Text>


      <TouchableOpacity
        style={
          styles.buyButton
        }
        onPress={() =>
          onBuyProduct?.(
            item
          )
        }
      >

        <Text
          style={
            styles.buyButtonText
          }
          numberOfLines={
            1
          }
          adjustsFontSizeToFit
        >
          {getText(
            language,
            "buyNow"
          )}
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={[
          styles.coinButton,

          isRTL &&
            styles.rowRTL,
        ]}
        onPress={() =>
          onBuyWithCoins?.(
            item
          )
        }
      >

        <Image
          source={
            WCOIN
          }
          style={[
            styles.buttonCoin,

            isRTL &&
              styles.buttonCoinRTL,
          ]}
        />


        <Text
          style={
            styles.coinButtonText
          }
          numberOfLines={
            1
          }
          adjustsFontSizeToFit
        >
          {getText(
            language,
            "useWCoins"
          )}
        </Text>

      </TouchableOpacity>

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#05070C",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 58,
      paddingBottom: 180,
    },


    // ========================================================
    // HEADER
    // ========================================================

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },


    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#101827",

      borderWidth: 1,
      borderColor: "#263244",

      marginRight: 14,
    },


    backButtonRTL: {
      marginRight: 0,
      marginLeft: 14,
    },


    kicker: {
      color: "#A7F3D0",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 4,
    },


    title: {
      color: "#FFFFFF",
      fontSize: 42,
      fontWeight: "900",
      marginTop: 2,
    },


    // ========================================================
    // WALLET
    // ========================================================

    walletCard: {
      backgroundColor: "#0F172A",

      borderRadius: 28,

      borderWidth: 1.5,
      borderColor: "#D4AF37",

      padding: 22,
      marginBottom: 22,
    },


    walletLabel: {
      color: "#A7F3D0",

      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 3,

      marginBottom: 12,
    },


    walletRow: {
      flexDirection: "row",
      alignItems: "center",
    },


    coinIcon: {
      width: 42,
      height: 42,

      resizeMode: "contain",

      marginRight: 14,
    },


    coinIconRTL: {
      marginRight: 0,
      marginLeft: 14,
    },


    walletAmount: {
      color: "#FFFFFF",
      fontSize: 52,
      fontWeight: "900",

      flexShrink: 1,
    },


    walletAmountRTL: {
      textAlign: "right",
    },


    walletText: {
      color: "#CBD5E1",

      fontSize: 16,
      fontWeight: "700",

      marginTop: 10,
      lineHeight: 24,
    },


    memberText: {
      color: "#D4AF37",

      fontSize: 15,
      fontWeight: "900",

      marginTop: 12,
    },


    // ========================================================
    // CATEGORY
    // ========================================================

    categoryRow: {
      paddingVertical: 8,
      paddingRight: 20,
      marginBottom: 26,
    },


    categoryPill: {
      minWidth: 145,
      minHeight: 50,

      paddingHorizontal: 24,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 25,

      borderWidth: 1,
      borderColor: "#334155",

      backgroundColor: "#111827",

      marginRight: 12,
    },


    categoryPillActive: {
      backgroundColor: "#E0AE25",
      borderColor: "#E0AE25",
    },


    categoryText: {
      color: "#CBD5E1",

      fontSize: 16,
      fontWeight: "900",
    },


    categoryTextActive: {
      color: "#000000",
    },


    // ========================================================
    // SECTION
    // ========================================================

    sectionTitle: {
      color: "#A7F3D0",

      fontSize: 28,
      fontWeight: "900",
      letterSpacing: 2,

      marginBottom: 18,
    },


    // ========================================================
    // PRODUCT GRID
    // ========================================================

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",

      justifyContent: "space-between",

      marginBottom: 30,
    },


    productCard: {
      width: "48%",

      backgroundColor: "#0F172A",

      borderRadius: 24,

      borderWidth: 1,
      borderColor: "#263244",

      padding: 14,

      marginBottom: 16,
    },


    imageBox: {
      height: 145,

      backgroundColor: "#020617",

      borderRadius: 20,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 14,

      overflow: "hidden",
    },


    productImage: {
      width: "100%",
      height: 150,

      resizeMode: "contain",
    },


    productCategory: {
      color: "#D4AF37",

      fontSize: 12,
      fontWeight: "900",

      textTransform: "uppercase",
    },


    productTitle: {
      color: "#FFFFFF",

      fontSize: 16,
      fontWeight: "900",

      marginTop: 6,

      minHeight: 60,
    },


    productPrice: {
      color: "#FFFFFF",

      fontSize: 24,
      fontWeight: "900",

      marginTop: 8,
    },


    coinRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 8,
    },


    smallCoin: {
      width: 22,
      height: 22,

      marginRight: 8,

      resizeMode: "contain",
    },


    smallCoinRTL: {
      marginRight: 0,
      marginLeft: 8,
    },


    coinPrice: {
      color: "#D4AF37",

      fontSize: 18,
      fontWeight: "900",
    },


    availableText: {
      color: "#A7F3D0",

      fontSize: 12,
      fontWeight: "900",

      marginTop: 10,
      marginBottom: 12,
    },


    // ========================================================
    // BUTTONS
    // ========================================================

    buyButton: {
      backgroundColor: "#E0AE25",

      borderRadius: 18,

      paddingVertical: 12,
      paddingHorizontal: 8,

      alignItems: "center",

      marginBottom: 8,
    },


    buyButtonText: {
      color: "#000000",

      fontSize: 15,
      fontWeight: "900",

      textAlign: "center",
    },


    coinButton: {
      minHeight: 46,

      backgroundColor: "#111827",

      borderRadius: 18,

      flexDirection: "row",

      justifyContent: "center",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#D4AF37",

      paddingHorizontal: 8,
    },


    buttonCoin: {
      width: 20,
      height: 20,

      resizeMode: "contain",

      marginRight: 7,
    },


    buttonCoinRTL: {
      marginRight: 0,
      marginLeft: 7,
    },


    coinButtonText: {
      color: "#D4AF37",

      fontSize: 14,
      fontWeight: "900",

      textAlign: "center",

      flexShrink: 1,
    },


    // ========================================================
    // SUBSCRIPTIONS
    // ========================================================

    planCard: {
      backgroundColor: "#0F172A",

      borderRadius: 24,

      borderWidth: 1,
      borderColor: "#263244",

      padding: 18,

      marginBottom: 16,
    },


    planTop: {
      flexDirection: "row",

      justifyContent: "space-between",
      alignItems: "center",

      marginBottom: 12,
    },


    planName: {
      color: "#FFFFFF",

      fontSize: 26,
      fontWeight: "900",
    },


    planPrice: {
      color: "#D4AF37",

      fontSize: 20,
      fontWeight: "900",

      marginTop: 4,
    },


    planPerk: {
      color: "#CBD5E1",

      fontSize: 15,
      fontWeight: "700",

      lineHeight: 22,

      marginTop: 6,
    },


    subscribeButton: {
      backgroundColor: "#E0AE25",

      borderRadius: 999,

      paddingVertical: 10,
      paddingHorizontal: 18,

      marginLeft: 10,

      maxWidth: "42%",
    },


    subscribeButtonRTL: {
      marginLeft: 0,
      marginRight: 10,
    },


    subscribeButtonText: {
      color: "#000000",

      fontSize: 15,
      fontWeight: "900",

      textAlign: "center",
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


    rtlCenterText: {
      writingDirection: "rtl",
      textAlign: "center",
    },
  });