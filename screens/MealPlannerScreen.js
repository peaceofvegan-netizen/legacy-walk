// screens/MealPlannerScreen.js

import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";


// ============================================================
// STORAGE
// ============================================================

// Keep the existing key so current users do not lose saved plans.
const STORAGE_KEY = "legacyWalkMealPlanner";


// ============================================================
// DEFAULT PROFILE
// ============================================================

const DEFAULT_PROFILE = {
  dailyCalories: 2000,
  proteinGoal: 130,
  carbGoal: 220,
  fatGoal: 65,
  waterGoal: 100,
  preference: "Balanced",
};


// ============================================================
// DEFAULT MEALS
// ============================================================

const DEFAULT_MEALS = [
  {
    id: "breakfast",
    type: "Breakfast",
    icon: "weather-sunny",
    time: "8:00 AM",
    name: "Protein Oatmeal Bowl",
    description:
      "Oats, blueberries, banana, Greek yogurt, chia seeds, and cinnamon.",
    calories: 480,
    protein: 28,
    carbs: 68,
    fat: 12,
    completed: false,
  },
  {
    id: "lunch",
    type: "Lunch",
    icon: "food-apple",
    time: "12:30 PM",
    name: "Grilled Chicken Power Bowl",
    description:
      "Chicken breast, brown rice, spinach, avocado, tomato, and lemon dressing.",
    calories: 610,
    protein: 48,
    carbs: 62,
    fat: 20,
    completed: false,
  },
  {
    id: "snack",
    type: "Snack",
    icon: "food-apple-outline",
    time: "3:30 PM",
    name: "Recovery Snack",
    description:
      "Greek yogurt, strawberries, almonds, and a drizzle of honey.",
    calories: 280,
    protein: 21,
    carbs: 32,
    fat: 9,
    completed: false,
  },
  {
    id: "dinner",
    type: "Dinner",
    icon: "silverware-fork-knife",
    time: "7:00 PM",
    name: "Salmon Recovery Plate",
    description:
      "Baked salmon, roasted sweet potato, broccoli, and mixed greens.",
    calories: 630,
    protein: 45,
    carbs: 58,
    fat: 24,
    completed: false,
  },
];


// ============================================================
// PREFERENCES
// ============================================================

// Keep these values in English internally so existing saved
// profiles continue working.
const PREFERENCE_OPTIONS = [
  "Balanced",
  "High Protein",
  "Low Carb",
  "Vegetarian",
  "Mediterranean",
];


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    wellness: "LEGATHON AI WELLNESS",
    mealPlanner: "Meal Planner",
    todaysPlan: "TODAY'S NUTRITION PLAN",
    heroDescription:
      "Fuel your walks, improve recovery, and stay consistent with a balanced daily nutrition plan.",
    dailyProgress: "Daily progress",
    consumed: "Consumed",
    dailyGoal: "Daily goal",
    remaining: "Remaining",

    personalization: "PERSONALIZATION",
    nutritionGoals: "Nutrition Goals",
    mealPreference: "Meal preference",

    balanced: "Balanced",
    highProtein: "High Protein",
    lowCarb: "Low Carb",
    vegetarian: "Vegetarian",
    mediterranean: "Mediterranean",

    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    waterOz: "Water oz",

    dailyTargets: "DAILY TARGETS",
    nutritionOverview: "Nutrition Overview",

    today: "TODAY",
    yourMeals: "Your Meals",
    reset: "Reset",

    breakfast: "Breakfast",
    lunch: "Lunch",
    snack: "Snack",
    dinner: "Dinner",

    proteinOatmealBowl: "Protein Oatmeal Bowl",
    proteinOatmealDescription:
      "Oats, blueberries, banana, Greek yogurt, chia seeds, and cinnamon.",

    chickenPowerBowl: "Grilled Chicken Power Bowl",
    chickenPowerDescription:
      "Chicken breast, brown rice, spinach, avocado, tomato, and lemon dressing.",

    recoverySnack: "Recovery Snack",
    recoverySnackDescription:
      "Greek yogurt, strawberries, almonds, and a drizzle of honey.",

    salmonPlate: "Salmon Recovery Plate",
    salmonPlateDescription:
      "Baked salmon, roasted sweet potato, broccoli, and mixed greens.",

    eggAvocado: "Egg and Avocado Breakfast",
    eggAvocadoDescription:
      "Two eggs, avocado toast, fresh berries, and Greek yogurt.",

    turkeyQuinoa: "Turkey Quinoa Bowl",
    turkeyQuinoaDescription:
      "Lean turkey, quinoa, roasted vegetables, spinach, and herb dressing.",

    proteinSmoothie: "Protein Smoothie",
    proteinSmoothieDescription:
      "Protein, banana, berries, spinach, almond milk, and chia seeds.",

    beefRecovery: "Lean Beef Recovery Bowl",
    beefRecoveryDescription:
      "Lean beef, roasted potatoes, green beans, and mixed vegetables.",

    cal: "cal",
    editMeal: "Edit meal",

    hydration: "HYDRATION",
    waterGoal: "Water Goal",
    glassesCompleted: "{count} glasses completed",

    legathonAI: "LEGATHON AI",
    coachRecommendation: "Coach Recommendation",
    recoveryNutrition: "Recovery Nutrition",
    recoveryNutritionText:
      "Complete your protein-rich meal after your walk and drink at least 16 ounces of water to support muscle recovery.",

    generatePlan: "Generate New Meal Plan",

    disclaimer:
      "Meal suggestions are general wellness guidance and are not medical nutrition advice.",

    mealEditMessage:
      "Meal editing can be connected to the AI meal builder next.",
    cancel: "Cancel",
    replaceMeal: "Replace meal",

    premiumMealPlanning: "Premium Meal Planning",
    premiumMessage:
      "Personalized AI meal plans are available with Premium and Elite.",
    notNow: "Not now",
    viewPlans: "View plans",

    newPlanCreated: "New plan created",
    newPlanMessage: "Your {preference} meal plan is ready.",

    resetToday: "Reset today?",
    resetTodayMessage:
      "This will clear completed meals and hydration for today.",
  },

  es: {
    wellness: "BIENESTAR IA LEGATHON",
    mealPlanner: "Planificador de Comidas",
    todaysPlan: "PLAN NUTRICIONAL DE HOY",
    heroDescription:
      "Alimenta tus caminatas, mejora la recuperación y mantén la constancia con un plan nutricional diario equilibrado.",
    dailyProgress: "Progreso diario",
    consumed: "Consumidas",
    dailyGoal: "Meta diaria",
    remaining: "Restantes",

    personalization: "PERSONALIZACIÓN",
    nutritionGoals: "Metas Nutricionales",
    mealPreference: "Preferencia alimentaria",

    balanced: "Equilibrada",
    highProtein: "Alta en proteínas",
    lowCarb: "Baja en carbohidratos",
    vegetarian: "Vegetariana",
    mediterranean: "Mediterránea",

    calories: "Calorías",
    protein: "Proteína",
    carbs: "Carbohidratos",
    fat: "Grasa",
    waterOz: "Agua oz",

    dailyTargets: "OBJETIVOS DIARIOS",
    nutritionOverview: "Resumen Nutricional",

    today: "HOY",
    yourMeals: "Tus Comidas",
    reset: "Restablecer",

    breakfast: "Desayuno",
    lunch: "Almuerzo",
    snack: "Merienda",
    dinner: "Cena",

    proteinOatmealBowl: "Tazón de Avena con Proteína",
    proteinOatmealDescription:
      "Avena, arándanos, banana, yogur griego, semillas de chía y canela.",

    chickenPowerBowl: "Tazón Energético de Pollo",
    chickenPowerDescription:
      "Pechuga de pollo, arroz integral, espinaca, aguacate, tomate y aderezo de limón.",

    recoverySnack: "Merienda de Recuperación",
    recoverySnackDescription:
      "Yogur griego, fresas, almendras y un toque de miel.",

    salmonPlate: "Plato de Recuperación con Salmón",
    salmonPlateDescription:
      "Salmón al horno, batata asada, brócoli y verduras mixtas.",

    eggAvocado: "Desayuno de Huevo y Aguacate",
    eggAvocadoDescription:
      "Dos huevos, tostada con aguacate, frutas frescas y yogur griego.",

    turkeyQuinoa: "Tazón de Pavo y Quinoa",
    turkeyQuinoaDescription:
      "Pavo magro, quinoa, verduras asadas, espinaca y aderezo de hierbas.",

    proteinSmoothie: "Batido de Proteína",
    proteinSmoothieDescription:
      "Proteína, banana, frutos rojos, espinaca, leche de almendras y chía.",

    beefRecovery: "Tazón de Recuperación con Carne Magra",
    beefRecoveryDescription:
      "Carne magra, papas asadas, judías verdes y verduras mixtas.",

    cal: "cal",
    editMeal: "Editar comida",

    hydration: "HIDRATACIÓN",
    waterGoal: "Meta de Agua",
    glassesCompleted: "{count} vasos completados",

    legathonAI: "IA LEGATHON",
    coachRecommendation: "Recomendación del Coach",
    recoveryNutrition: "Nutrición para Recuperación",
    recoveryNutritionText:
      "Completa una comida rica en proteínas después de caminar y bebe al menos 16 onzas de agua para apoyar la recuperación muscular.",

    generatePlan: "Generar Nuevo Plan",

    disclaimer:
      "Las sugerencias de comidas son orientación general de bienestar y no constituyen asesoramiento médico nutricional.",

    mealEditMessage:
      "La edición de comidas puede conectarse próximamente al creador de comidas con IA.",
    cancel: "Cancelar",
    replaceMeal: "Reemplazar comida",

    premiumMealPlanning: "Planificación Premium",
    premiumMessage:
      "Los planes personalizados con IA están disponibles con Premium y Elite.",
    notNow: "Ahora no",
    viewPlans: "Ver planes",

    newPlanCreated: "Nuevo plan creado",
    newPlanMessage: "Tu plan {preference} está listo.",

    resetToday: "¿Restablecer hoy?",
    resetTodayMessage:
      "Esto borrará las comidas completadas y la hidratación de hoy.",
  },

  fr: {
    wellness: "BIEN-ÊTRE IA LEGATHON",
    mealPlanner: "Planificateur de Repas",
    todaysPlan: "PLAN NUTRITIONNEL DU JOUR",
    heroDescription:
      "Alimentez vos marches, améliorez votre récupération et restez régulier avec un plan nutritionnel quotidien équilibré.",
    dailyProgress: "Progression quotidienne",
    consumed: "Consommées",
    dailyGoal: "Objectif quotidien",
    remaining: "Restantes",

    personalization: "PERSONNALISATION",
    nutritionGoals: "Objectifs Nutritionnels",
    mealPreference: "Préférence alimentaire",

    balanced: "Équilibré",
    highProtein: "Riche en protéines",
    lowCarb: "Faible en glucides",
    vegetarian: "Végétarien",
    mediterranean: "Méditerranéen",

    calories: "Calories",
    protein: "Protéines",
    carbs: "Glucides",
    fat: "Lipides",
    waterOz: "Eau oz",

    dailyTargets: "OBJECTIFS QUOTIDIENS",
    nutritionOverview: "Aperçu Nutritionnel",

    today: "AUJOURD'HUI",
    yourMeals: "Vos Repas",
    reset: "Réinitialiser",

    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    snack: "Collation",
    dinner: "Dîner",

    proteinOatmealBowl: "Bol d'Avoine Protéiné",
    proteinOatmealDescription:
      "Avoine, myrtilles, banane, yaourt grec, graines de chia et cannelle.",

    chickenPowerBowl: "Bol Énergétique au Poulet",
    chickenPowerDescription:
      "Poulet grillé, riz complet, épinards, avocat, tomate et vinaigrette au citron.",

    recoverySnack: "Collation de Récupération",
    recoverySnackDescription:
      "Yaourt grec, fraises, amandes et un filet de miel.",

    salmonPlate: "Assiette de Récupération au Saumon",
    salmonPlateDescription:
      "Saumon au four, patate douce rôtie, brocoli et légumes verts.",

    eggAvocado: "Petit-déjeuner Œufs et Avocat",
    eggAvocadoDescription:
      "Deux œufs, toast à l'avocat, fruits rouges et yaourt grec.",

    turkeyQuinoa: "Bol Dinde et Quinoa",
    turkeyQuinoaDescription:
      "Dinde maigre, quinoa, légumes rôtis, épinards et sauce aux herbes.",

    proteinSmoothie: "Smoothie Protéiné",
    proteinSmoothieDescription:
      "Protéines, banane, fruits rouges, épinards, lait d'amande et chia.",

    beefRecovery: "Bol de Récupération au Bœuf Maigre",
    beefRecoveryDescription:
      "Bœuf maigre, pommes de terre rôties, haricots verts et légumes variés.",

    cal: "cal",
    editMeal: "Modifier le repas",

    hydration: "HYDRATATION",
    waterGoal: "Objectif d'Eau",
    glassesCompleted: "{count} verres terminés",

    legathonAI: "IA LEGATHON",
    coachRecommendation: "Recommandation du Coach",
    recoveryNutrition: "Nutrition de Récupération",
    recoveryNutritionText:
      "Prenez un repas riche en protéines après votre marche et buvez au moins 16 onces d'eau pour favoriser la récupération musculaire.",

    generatePlan: "Générer un Nouveau Plan",

    disclaimer:
      "Les suggestions de repas sont des conseils généraux de bien-être et ne constituent pas des conseils médicaux en nutrition.",

    mealEditMessage:
      "La modification des repas pourra ensuite être connectée au générateur de repas IA.",
    cancel: "Annuler",
    replaceMeal: "Remplacer le repas",

    premiumMealPlanning: "Planification Premium",
    premiumMessage:
      "Les plans de repas IA personnalisés sont disponibles avec Premium et Elite.",
    notNow: "Pas maintenant",
    viewPlans: "Voir les offres",

    newPlanCreated: "Nouveau plan créé",
    newPlanMessage: "Votre plan {preference} est prêt.",

    resetToday: "Réinitialiser aujourd'hui ?",
    resetTodayMessage:
      "Cela effacera les repas terminés et l'hydratation d'aujourd'hui.",
  },

  de: {
    wellness: "LEGATHON KI-WELLNESS",
    mealPlanner: "Ernährungsplaner",
    todaysPlan: "HEUTIGER ERNÄHRUNGSPLAN",
    heroDescription:
      "Unterstütze deine Spaziergänge, verbessere deine Erholung und bleibe mit einem ausgewogenen täglichen Ernährungsplan konsequent.",
    dailyProgress: "Tagesfortschritt",
    consumed: "Verbraucht",
    dailyGoal: "Tagesziel",
    remaining: "Verbleibend",

    personalization: "PERSONALISIERUNG",
    nutritionGoals: "Ernährungsziele",
    mealPreference: "Ernährungspräferenz",

    balanced: "Ausgewogen",
    highProtein: "Proteinreich",
    lowCarb: "Kohlenhydratarm",
    vegetarian: "Vegetarisch",
    mediterranean: "Mediterran",

    calories: "Kalorien",
    protein: "Protein",
    carbs: "Kohlenhydrate",
    fat: "Fett",
    waterOz: "Wasser oz",

    dailyTargets: "TAGESZIELE",
    nutritionOverview: "Ernährungsübersicht",

    today: "HEUTE",
    yourMeals: "Deine Mahlzeiten",
    reset: "Zurücksetzen",

    breakfast: "Frühstück",
    lunch: "Mittagessen",
    snack: "Snack",
    dinner: "Abendessen",

    proteinOatmealBowl: "Protein-Haferflocken-Bowl",
    proteinOatmealDescription:
      "Haferflocken, Blaubeeren, Banane, griechischer Joghurt, Chiasamen und Zimt.",

    chickenPowerBowl: "Gegrillte Hähnchen-Power-Bowl",
    chickenPowerDescription:
      "Hähnchenbrust, Naturreis, Spinat, Avocado, Tomate und Zitronendressing.",

    recoverySnack: "Erholungssnack",
    recoverySnackDescription:
      "Griechischer Joghurt, Erdbeeren, Mandeln und etwas Honig.",

    salmonPlate: "Lachs-Erholungsteller",
    salmonPlateDescription:
      "Gebackener Lachs, geröstete Süßkartoffel, Brokkoli und gemischtes Gemüse.",

    eggAvocado: "Ei-Avocado-Frühstück",
    eggAvocadoDescription:
      "Zwei Eier, Avocado-Toast, frische Beeren und griechischer Joghurt.",

    turkeyQuinoa: "Puten-Quinoa-Bowl",
    turkeyQuinoaDescription:
      "Magere Pute, Quinoa, geröstetes Gemüse, Spinat und Kräuterdressing.",

    proteinSmoothie: "Protein-Smoothie",
    proteinSmoothieDescription:
      "Protein, Banane, Beeren, Spinat, Mandelmilch und Chiasamen.",

    beefRecovery: "Magere Rindfleisch-Erholungs-Bowl",
    beefRecoveryDescription:
      "Mageres Rindfleisch, geröstete Kartoffeln, grüne Bohnen und Gemüse.",

    cal: "kcal",
    editMeal: "Mahlzeit bearbeiten",

    hydration: "HYDRATION",
    waterGoal: "Wasserziel",
    glassesCompleted: "{count} Gläser geschafft",

    legathonAI: "LEGATHON KI",
    coachRecommendation: "Coach-Empfehlung",
    recoveryNutrition: "Erholungsnahrung",
    recoveryNutritionText:
      "Iss nach deinem Spaziergang eine proteinreiche Mahlzeit und trinke mindestens 16 Unzen Wasser zur Unterstützung der Muskelerholung.",

    generatePlan: "Neuen Ernährungsplan Erstellen",

    disclaimer:
      "Mahlzeitenvorschläge sind allgemeine Wellness-Hinweise und keine medizinische Ernährungsberatung.",

    mealEditMessage:
      "Die Mahlzeitenbearbeitung kann als Nächstes mit dem KI-Mahlzeitengenerator verbunden werden.",
    cancel: "Abbrechen",
    replaceMeal: "Mahlzeit ersetzen",

    premiumMealPlanning: "Premium-Ernährungsplanung",
    premiumMessage:
      "Personalisierte KI-Ernährungspläne sind mit Premium und Elite verfügbar.",
    notNow: "Nicht jetzt",
    viewPlans: "Pläne ansehen",

    newPlanCreated: "Neuer Plan erstellt",
    newPlanMessage: "Dein Plan „{preference}“ ist bereit.",

    resetToday: "Heute zurücksetzen?",
    resetTodayMessage:
      "Dadurch werden abgeschlossene Mahlzeiten und die heutige Flüssigkeitsmenge gelöscht.",
  },

  pt: {
    wellness: "BEM-ESTAR IA LEGATHON",
    mealPlanner: "Planejador de Refeições",
    todaysPlan: "PLANO NUTRICIONAL DE HOJE",
    heroDescription:
      "Abasteça suas caminhadas, melhore a recuperação e mantenha a consistência com um plano nutricional diário equilibrado.",
    dailyProgress: "Progresso diário",
    consumed: "Consumidas",
    dailyGoal: "Meta diária",
    remaining: "Restantes",

    personalization: "PERSONALIZAÇÃO",
    nutritionGoals: "Metas Nutricionais",
    mealPreference: "Preferência alimentar",

    balanced: "Equilibrada",
    highProtein: "Alta proteína",
    lowCarb: "Baixo carboidrato",
    vegetarian: "Vegetariana",
    mediterranean: "Mediterrânea",

    calories: "Calorias",
    protein: "Proteína",
    carbs: "Carboidratos",
    fat: "Gordura",
    waterOz: "Água oz",

    dailyTargets: "METAS DIÁRIAS",
    nutritionOverview: "Visão Nutricional",

    today: "HOJE",
    yourMeals: "Suas Refeições",
    reset: "Redefinir",

    breakfast: "Café da manhã",
    lunch: "Almoço",
    snack: "Lanche",
    dinner: "Jantar",

    proteinOatmealBowl: "Tigela de Aveia com Proteína",
    proteinOatmealDescription:
      "Aveia, mirtilos, banana, iogurte grego, chia e canela.",

    chickenPowerBowl: "Tigela Energética de Frango",
    chickenPowerDescription:
      "Peito de frango, arroz integral, espinafre, abacate, tomate e molho de limão.",

    recoverySnack: "Lanche de Recuperação",
    recoverySnackDescription:
      "Iogurte grego, morangos, amêndoas e um toque de mel.",

    salmonPlate: "Prato de Recuperação com Salmão",
    salmonPlateDescription:
      "Salmão assado, batata-doce assada, brócolis e folhas verdes.",

    eggAvocado: "Café da Manhã com Ovo e Abacate",
    eggAvocadoDescription:
      "Dois ovos, torrada com abacate, frutas vermelhas e iogurte grego.",

    turkeyQuinoa: "Tigela de Peru e Quinoa",
    turkeyQuinoaDescription:
      "Peru magro, quinoa, legumes assados, espinafre e molho de ervas.",

    proteinSmoothie: "Vitamina de Proteína",
    proteinSmoothieDescription:
      "Proteína, banana, frutas vermelhas, espinafre, leite de amêndoas e chia.",

    beefRecovery: "Tigela de Recuperação com Carne Magra",
    beefRecoveryDescription:
      "Carne magra, batatas assadas, vagem e legumes variados.",

    cal: "cal",
    editMeal: "Editar refeição",

    hydration: "HIDRATAÇÃO",
    waterGoal: "Meta de Água",
    glassesCompleted: "{count} copos concluídos",

    legathonAI: "IA LEGATHON",
    coachRecommendation: "Recomendação do Coach",
    recoveryNutrition: "Nutrição para Recuperação",
    recoveryNutritionText:
      "Faça uma refeição rica em proteínas após a caminhada e beba pelo menos 16 onças de água para apoiar a recuperação muscular.",

    generatePlan: "Gerar Novo Plano",

    disclaimer:
      "As sugestões de refeições são orientações gerais de bem-estar e não constituem aconselhamento nutricional médico.",

    mealEditMessage:
      "A edição de refeições poderá ser conectada ao criador de refeições com IA.",
    cancel: "Cancelar",
    replaceMeal: "Substituir refeição",

    premiumMealPlanning: "Planejamento Premium",
    premiumMessage:
      "Planos personalizados com IA estão disponíveis no Premium e Elite.",
    notNow: "Agora não",
    viewPlans: "Ver planos",

    newPlanCreated: "Novo plano criado",
    newPlanMessage: "Seu plano {preference} está pronto.",

    resetToday: "Redefinir hoje?",
    resetTodayMessage:
      "Isso limpará as refeições concluídas e a hidratação de hoje.",
  },

  ja: {
    wellness: "LEGATHON AI ウェルネス",
    mealPlanner: "食事プランナー",
    todaysPlan: "今日の栄養プラン",
    heroDescription:
      "バランスの取れた毎日の栄養プランで、ウォーキングを支え、回復を促し、継続をサポートします。",
    dailyProgress: "今日の進捗",
    consumed: "摂取済み",
    dailyGoal: "1日の目標",
    remaining: "残り",

    personalization: "パーソナライズ",
    nutritionGoals: "栄養目標",
    mealPreference: "食事の好み",

    balanced: "バランス",
    highProtein: "高タンパク",
    lowCarb: "低炭水化物",
    vegetarian: "ベジタリアン",
    mediterranean: "地中海式",

    calories: "カロリー",
    protein: "タンパク質",
    carbs: "炭水化物",
    fat: "脂質",
    waterOz: "水分 oz",

    dailyTargets: "1日の目標",
    nutritionOverview: "栄養概要",

    today: "今日",
    yourMeals: "今日の食事",
    reset: "リセット",

    breakfast: "朝食",
    lunch: "昼食",
    snack: "間食",
    dinner: "夕食",

    proteinOatmealBowl: "プロテインオートミールボウル",
    proteinOatmealDescription:
      "オーツ麦、ブルーベリー、バナナ、ギリシャヨーグルト、チアシード、シナモン。",

    chickenPowerBowl: "グリルチキンパワーボウル",
    chickenPowerDescription:
      "鶏むね肉、玄米、ほうれん草、アボカド、トマト、レモンドレッシング。",

    recoverySnack: "リカバリースナック",
    recoverySnackDescription:
      "ギリシャヨーグルト、いちご、アーモンド、少量のはちみつ。",

    salmonPlate: "サーモンリカバリープレート",
    salmonPlateDescription:
      "焼きサーモン、ローストしたさつまいも、ブロッコリー、ミックスグリーン。",

    eggAvocado: "卵とアボカドの朝食",
    eggAvocadoDescription:
      "卵2個、アボカドトースト、ベリー、ギリシャヨーグルト。",

    turkeyQuinoa: "ターキーキヌアボウル",
    turkeyQuinoaDescription:
      "脂肪の少ないターキー、キヌア、ロースト野菜、ほうれん草、ハーブドレッシング。",

    proteinSmoothie: "プロテインスムージー",
    proteinSmoothieDescription:
      "プロテイン、バナナ、ベリー、ほうれん草、アーモンドミルク、チアシード。",

    beefRecovery: "赤身牛肉リカバリーボウル",
    beefRecoveryDescription:
      "赤身牛肉、ローストポテト、いんげん、ミックス野菜。",

    cal: "kcal",
    editMeal: "食事を編集",

    hydration: "水分補給",
    waterGoal: "水分目標",
    glassesCompleted: "{count} 杯完了",

    legathonAI: "LEGATHON AI",
    coachRecommendation: "コーチのおすすめ",
    recoveryNutrition: "回復のための栄養",
    recoveryNutritionText:
      "ウォーキング後はタンパク質を多く含む食事をとり、筋肉の回復を支えるため少なくとも16オンスの水を飲みましょう。",

    generatePlan: "新しい食事プランを作成",

    disclaimer:
      "食事の提案は一般的なウェルネス情報であり、医療上の栄養アドバイスではありません。",

    mealEditMessage:
      "食事編集は次にAI食事ビルダーへ接続できます。",
    cancel: "キャンセル",
    replaceMeal: "食事を変更",

    premiumMealPlanning: "プレミアム食事プラン",
    premiumMessage:
      "パーソナライズされたAI食事プランはPremiumとEliteで利用できます。",
    notNow: "今はしない",
    viewPlans: "プランを見る",

    newPlanCreated: "新しいプランを作成しました",
    newPlanMessage: "{preference}の食事プランが準備できました。",

    resetToday: "今日をリセットしますか？",
    resetTodayMessage:
      "今日の完了済み食事と水分記録がリセットされます。",
  },

  ko: {
    wellness: "LEGATHON AI 웰니스",
    mealPlanner: "식단 플래너",
    todaysPlan: "오늘의 영양 계획",
    heroDescription:
      "균형 잡힌 일일 영양 계획으로 걷기에 필요한 에너지를 공급하고 회복과 꾸준함을 지원하세요.",
    dailyProgress: "오늘의 진행",
    consumed: "섭취",
    dailyGoal: "일일 목표",
    remaining: "남음",

    personalization: "개인 설정",
    nutritionGoals: "영양 목표",
    mealPreference: "식단 선호",

    balanced: "균형식",
    highProtein: "고단백",
    lowCarb: "저탄수화물",
    vegetarian: "채식",
    mediterranean: "지중해식",

    calories: "칼로리",
    protein: "단백질",
    carbs: "탄수화물",
    fat: "지방",
    waterOz: "물 oz",

    dailyTargets: "일일 목표",
    nutritionOverview: "영양 개요",

    today: "오늘",
    yourMeals: "오늘의 식사",
    reset: "초기화",

    breakfast: "아침",
    lunch: "점심",
    snack: "간식",
    dinner: "저녁",

    proteinOatmealBowl: "프로틴 오트밀 볼",
    proteinOatmealDescription:
      "귀리, 블루베리, 바나나, 그릭 요거트, 치아씨드, 시나몬.",

    chickenPowerBowl: "그릴드 치킨 파워 볼",
    chickenPowerDescription:
      "닭가슴살, 현미, 시금치, 아보카도, 토마토, 레몬 드레싱.",

    recoverySnack: "회복 간식",
    recoverySnackDescription:
      "그릭 요거트, 딸기, 아몬드와 약간의 꿀.",

    salmonPlate: "연어 회복 플레이트",
    salmonPlateDescription:
      "구운 연어, 구운 고구마, 브로콜리와 혼합 채소.",

    eggAvocado: "달걀 아보카도 아침식사",
    eggAvocadoDescription:
      "달걀 두 개, 아보카도 토스트, 베리와 그릭 요거트.",

    turkeyQuinoa: "터키 퀴노아 볼",
    turkeyQuinoaDescription:
      "저지방 칠면조, 퀴노아, 구운 채소, 시금치와 허브 드레싱.",

    proteinSmoothie: "프로틴 스무디",
    proteinSmoothieDescription:
      "프로틴, 바나나, 베리, 시금치, 아몬드 밀크와 치아씨드.",

    beefRecovery: "저지방 소고기 회복 볼",
    beefRecoveryDescription:
      "저지방 소고기, 구운 감자, 그린빈과 혼합 채소.",

    cal: "kcal",
    editMeal: "식사 편집",

    hydration: "수분 섭취",
    waterGoal: "물 목표",
    glassesCompleted: "{count}잔 완료",

    legathonAI: "LEGATHON AI",
    coachRecommendation: "코치 추천",
    recoveryNutrition: "회복 영양",
    recoveryNutritionText:
      "걷기 후 단백질이 풍부한 식사를 하고 근육 회복을 위해 최소 16온스의 물을 마시세요.",

    generatePlan: "새 식단 생성",

    disclaimer:
      "식사 제안은 일반적인 웰니스 안내이며 의학적 영양 조언이 아닙니다.",

    mealEditMessage:
      "식사 편집 기능은 다음 단계에서 AI 식단 빌더와 연결할 수 있습니다.",
    cancel: "취소",
    replaceMeal: "식사 변경",

    premiumMealPlanning: "프리미엄 식단 계획",
    premiumMessage:
      "맞춤형 AI 식단은 Premium 및 Elite에서 이용할 수 있습니다.",
    notNow: "나중에",
    viewPlans: "플랜 보기",

    newPlanCreated: "새 플랜 생성 완료",
    newPlanMessage: "{preference} 식단이 준비되었습니다.",

    resetToday: "오늘 기록을 초기화할까요?",
    resetTodayMessage:
      "오늘 완료한 식사와 수분 기록이 초기화됩니다.",
  },

  zh: {
    wellness: "LEGATHON AI 健康",
    mealPlanner: "膳食计划",
    todaysPlan: "今日营养计划",
    heroDescription:
      "通过均衡的每日营养计划为步行提供能量、促进恢复并保持稳定习惯。",
    dailyProgress: "今日进度",
    consumed: "已摄入",
    dailyGoal: "每日目标",
    remaining: "剩余",

    personalization: "个性化",
    nutritionGoals: "营养目标",
    mealPreference: "饮食偏好",

    balanced: "均衡",
    highProtein: "高蛋白",
    lowCarb: "低碳水",
    vegetarian: "素食",
    mediterranean: "地中海饮食",

    calories: "卡路里",
    protein: "蛋白质",
    carbs: "碳水化合物",
    fat: "脂肪",
    waterOz: "饮水 oz",

    dailyTargets: "每日目标",
    nutritionOverview: "营养概览",

    today: "今天",
    yourMeals: "你的餐食",
    reset: "重置",

    breakfast: "早餐",
    lunch: "午餐",
    snack: "加餐",
    dinner: "晚餐",

    proteinOatmealBowl: "蛋白燕麦碗",
    proteinOatmealDescription:
      "燕麦、蓝莓、香蕉、希腊酸奶、奇亚籽和肉桂。",

    chickenPowerBowl: "烤鸡能量碗",
    chickenPowerDescription:
      "鸡胸肉、糙米、菠菜、牛油果、番茄和柠檬酱汁。",

    recoverySnack: "恢复加餐",
    recoverySnackDescription:
      "希腊酸奶、草莓、杏仁和少量蜂蜜。",

    salmonPlate: "三文鱼恢复餐",
    salmonPlateDescription:
      "烤三文鱼、烤红薯、西兰花和混合蔬菜。",

    eggAvocado: "鸡蛋牛油果早餐",
    eggAvocadoDescription:
      "两个鸡蛋、牛油果吐司、新鲜浆果和希腊酸奶。",

    turkeyQuinoa: "火鸡藜麦碗",
    turkeyQuinoaDescription:
      "低脂火鸡肉、藜麦、烤蔬菜、菠菜和香草酱汁。",

    proteinSmoothie: "蛋白奶昔",
    proteinSmoothieDescription:
      "蛋白粉、香蕉、浆果、菠菜、杏仁奶和奇亚籽。",

    beefRecovery: "瘦牛肉恢复碗",
    beefRecoveryDescription:
      "瘦牛肉、烤土豆、四季豆和混合蔬菜。",

    cal: "卡",
    editMeal: "编辑餐食",

    hydration: "补水",
    waterGoal: "饮水目标",
    glassesCompleted: "已完成 {count} 杯",

    legathonAI: "LEGATHON AI",
    coachRecommendation: "教练建议",
    recoveryNutrition: "恢复营养",
    recoveryNutritionText:
      "步行后完成富含蛋白质的餐食，并至少饮用16盎司水，以帮助肌肉恢复。",

    generatePlan: "生成新膳食计划",

    disclaimer:
      "餐食建议仅为一般健康指导，并非医疗营养建议。",

    mealEditMessage:
      "下一步可将餐食编辑连接到AI膳食生成器。",
    cancel: "取消",
    replaceMeal: "更换餐食",

    premiumMealPlanning: "高级膳食计划",
    premiumMessage:
      "个性化AI膳食计划可在Premium和Elite中使用。",
    notNow: "暂时不要",
    viewPlans: "查看方案",

    newPlanCreated: "新计划已创建",
    newPlanMessage: "你的{preference}膳食计划已准备好。",

    resetToday: "重置今天？",
    resetTodayMessage:
      "这将清除今天已完成的餐食和饮水记录。",
  },

  it: {
    wellness: "BENESSERE IA LEGATHON",
    mealPlanner: "Pianificatore Pasti",
    todaysPlan: "PIANO NUTRIZIONALE DI OGGI",
    heroDescription:
      "Alimenta le tue camminate, migliora il recupero e mantieni la costanza con un piano nutrizionale quotidiano equilibrato.",
    dailyProgress: "Progresso giornaliero",
    consumed: "Consumate",
    dailyGoal: "Obiettivo giornaliero",
    remaining: "Rimanenti",

    personalization: "PERSONALIZZAZIONE",
    nutritionGoals: "Obiettivi Nutrizionali",
    mealPreference: "Preferenza alimentare",

    balanced: "Bilanciata",
    highProtein: "Alto contenuto proteico",
    lowCarb: "Basso contenuto di carboidrati",
    vegetarian: "Vegetariana",
    mediterranean: "Mediterranea",

    calories: "Calorie",
    protein: "Proteine",
    carbs: "Carboidrati",
    fat: "Grassi",
    waterOz: "Acqua oz",

    dailyTargets: "OBIETTIVI GIORNALIERI",
    nutritionOverview: "Panoramica Nutrizionale",

    today: "OGGI",
    yourMeals: "I Tuoi Pasti",
    reset: "Reimposta",

    breakfast: "Colazione",
    lunch: "Pranzo",
    snack: "Spuntino",
    dinner: "Cena",

    proteinOatmealBowl: "Bowl di Avena Proteica",
    proteinOatmealDescription:
      "Avena, mirtilli, banana, yogurt greco, semi di chia e cannella.",

    chickenPowerBowl: "Power Bowl di Pollo Grigliato",
    chickenPowerDescription:
      "Petto di pollo, riso integrale, spinaci, avocado, pomodoro e condimento al limone.",

    recoverySnack: "Spuntino di Recupero",
    recoverySnackDescription:
      "Yogurt greco, fragole, mandorle e un filo di miele.",

    salmonPlate: "Piatto di Recupero al Salmone",
    salmonPlateDescription:
      "Salmone al forno, patata dolce arrosto, broccoli e verdure miste.",

    eggAvocado: "Colazione con Uova e Avocado",
    eggAvocadoDescription:
      "Due uova, toast con avocado, frutti di bosco e yogurt greco.",

    turkeyQuinoa: "Bowl di Tacchino e Quinoa",
    turkeyQuinoaDescription:
      "Tacchino magro, quinoa, verdure arrosto, spinaci e condimento alle erbe.",

    proteinSmoothie: "Frullato Proteico",
    proteinSmoothieDescription:
      "Proteine, banana, frutti di bosco, spinaci, latte di mandorla e chia.",

    beefRecovery: "Bowl di Recupero con Manzo Magro",
    beefRecoveryDescription:
      "Manzo magro, patate arrosto, fagiolini e verdure miste.",

    cal: "cal",
    editMeal: "Modifica pasto",

    hydration: "IDRATAZIONE",
    waterGoal: "Obiettivo Acqua",
    glassesCompleted: "{count} bicchieri completati",

    legathonAI: "IA LEGATHON",
    coachRecommendation: "Raccomandazione del Coach",
    recoveryNutrition: "Nutrizione per il Recupero",
    recoveryNutritionText:
      "Completa un pasto ricco di proteine dopo la camminata e bevi almeno 16 once d'acqua per favorire il recupero muscolare.",

    generatePlan: "Genera Nuovo Piano",

    disclaimer:
      "I suggerimenti sui pasti sono indicazioni generali di benessere e non costituiscono consulenza nutrizionale medica.",

    mealEditMessage:
      "La modifica dei pasti potrà essere collegata al generatore di pasti IA.",
    cancel: "Annulla",
    replaceMeal: "Sostituisci pasto",

    premiumMealPlanning: "Pianificazione Premium",
    premiumMessage:
      "I piani alimentari IA personalizzati sono disponibili con Premium ed Elite.",
    notNow: "Non ora",
    viewPlans: "Vedi piani",

    newPlanCreated: "Nuovo piano creato",
    newPlanMessage: "Il tuo piano {preference} è pronto.",

    resetToday: "Reimpostare oggi?",
    resetTodayMessage:
      "Questo cancellerà i pasti completati e l'idratazione di oggi.",
  },

  ar: {
    wellness: "LEGATHON للعافية بالذكاء الاصطناعي",
    mealPlanner: "مخطط الوجبات",
    todaysPlan: "خطة التغذية لليوم",
    heroDescription:
      "ادعم المشي وحسّن التعافي وحافظ على الاستمرارية من خلال خطة تغذية يومية متوازنة.",
    dailyProgress: "التقدم اليومي",
    consumed: "تم استهلاكه",
    dailyGoal: "الهدف اليومي",
    remaining: "المتبقي",

    personalization: "التخصيص",
    nutritionGoals: "أهداف التغذية",
    mealPreference: "تفضيل الوجبات",

    balanced: "متوازن",
    highProtein: "عالي البروتين",
    lowCarb: "منخفض الكربوهيدرات",
    vegetarian: "نباتي",
    mediterranean: "متوسطي",

    calories: "السعرات",
    protein: "البروتين",
    carbs: "الكربوهيدرات",
    fat: "الدهون",
    waterOz: "الماء oz",

    dailyTargets: "الأهداف اليومية",
    nutritionOverview: "نظرة عامة على التغذية",

    today: "اليوم",
    yourMeals: "وجباتك",
    reset: "إعادة تعيين",

    breakfast: "الإفطار",
    lunch: "الغداء",
    snack: "وجبة خفيفة",
    dinner: "العشاء",

    proteinOatmealBowl: "وعاء الشوفان بالبروتين",
    proteinOatmealDescription:
      "شوفان وتوت أزرق وموز وزبادي يوناني وبذور الشيا وقرفة.",

    chickenPowerBowl: "وعاء الدجاج المشوي",
    chickenPowerDescription:
      "صدر دجاج وأرز بني وسبانخ وأفوكادو وطماطم وصلصة الليمون.",

    recoverySnack: "وجبة خفيفة للتعافي",
    recoverySnackDescription:
      "زبادي يوناني وفراولة ولوز وقليل من العسل.",

    salmonPlate: "طبق السلمون للتعافي",
    salmonPlateDescription:
      "سلمون مخبوز وبطاطا حلوة مشوية وبروكلي وخضروات مشكلة.",

    eggAvocado: "إفطار البيض والأفوكادو",
    eggAvocadoDescription:
      "بيضتان وخبز بالأفوكادو وتوت طازج وزبادي يوناني.",

    turkeyQuinoa: "وعاء الديك الرومي والكينوا",
    turkeyQuinoaDescription:
      "ديك رومي قليل الدهن وكينوا وخضروات مشوية وسبانخ وصلصة أعشاب.",

    proteinSmoothie: "سموثي البروتين",
    proteinSmoothieDescription:
      "بروتين وموز وتوت وسبانخ وحليب اللوز وبذور الشيا.",

    beefRecovery: "وعاء اللحم قليل الدهن للتعافي",
    beefRecoveryDescription:
      "لحم بقري قليل الدهن وبطاطس مشوية وفاصوليا خضراء وخضروات مشكلة.",

    cal: "سعرة",
    editMeal: "تعديل الوجبة",

    hydration: "الترطيب",
    waterGoal: "هدف الماء",
    glassesCompleted: "تم إكمال {count} أكواب",

    legathonAI: "LEGATHON AI",
    coachRecommendation: "توصية المدرب",
    recoveryNutrition: "تغذية التعافي",
    recoveryNutritionText:
      "تناول وجبة غنية بالبروتين بعد المشي واشرب ما لا يقل عن 16 أونصة من الماء لدعم تعافي العضلات.",

    generatePlan: "إنشاء خطة وجبات جديدة",

    disclaimer:
      "اقتراحات الوجبات هي إرشادات عامة للعافية وليست نصائح طبية غذائية.",

    mealEditMessage:
      "يمكن ربط تعديل الوجبات بمنشئ الوجبات بالذكاء الاصطناعي لاحقًا.",
    cancel: "إلغاء",
    replaceMeal: "استبدال الوجبة",

    premiumMealPlanning: "تخطيط الوجبات المميز",
    premiumMessage:
      "خطط الوجبات المخصصة بالذكاء الاصطناعي متاحة مع Premium وElite.",
    notNow: "ليس الآن",
    viewPlans: "عرض الخطط",

    newPlanCreated: "تم إنشاء خطة جديدة",
    newPlanMessage: "خطة {preference} الخاصة بك جاهزة.",

    resetToday: "إعادة تعيين اليوم؟",
    resetTodayMessage:
      "سيؤدي ذلك إلى مسح الوجبات المكتملة وسجل الترطيب لليوم.",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}

function fillTemplate(text, values = {}) {
  let result = String(text || "");

  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(
      new RegExp(`\\{${key}\\}`, "g"),
      String(value)
    );
  });

  return result;
}

function preferenceKey(preference) {
  switch (preference) {
    case "High Protein":
      return "highProtein";

    case "Low Carb":
      return "lowCarb";

    case "Vegetarian":
      return "vegetarian";

    case "Mediterranean":
      return "mediterranean";

    case "Balanced":
    default:
      return "balanced";
  }
}

function mealTypeKey(id) {
  switch (id) {
    case "breakfast":
      return "breakfast";

    case "lunch":
      return "lunch";

    case "snack":
      return "snack";

    case "dinner":
      return "dinner";

    default:
      return null;
  }
}


// ============================================================
// HELPERS
// ============================================================

function clamp(value, minimum = 0, maximum = 100) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return minimum;
  }

  return Math.min(
    Math.max(number, minimum),
    maximum
  );
}


// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({
  value,
  color = "#42F58D",
}) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${clamp(value)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}


// ============================================================
// MACRO CARD
// ============================================================

function MacroCard({
  label,
  current,
  goal,
  unit = "g",
  color,
  icon,
}) {
  const progress =
    goal > 0
      ? (current / goal) * 100
      : 0;

  return (
    <View style={styles.macroCard}>
      <View style={styles.macroHeader}>
        <View
          style={[
            styles.macroIcon,
            {
              borderColor: color,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={color}
          />
        </View>

        <Text
          style={styles.macroLabel}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {label}
        </Text>
      </View>

      <Text style={styles.macroValue}>
        {Math.round(current)}

        <Text style={styles.macroGoal}>
          {" "}
          / {goal}
          {unit}
        </Text>
      </Text>

      <ProgressBar
        value={progress}
        color={color}
      />
    </View>
  );
}


// ============================================================
// MEAL CARD
// ============================================================

function MealCard({
  meal,
  onToggle,
  onEdit,
  t,
}) {
  const typeKey =
    mealTypeKey(meal.id);

  const translatedType =
    typeKey
      ? t(typeKey)
      : meal.type;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.mealCard,
        meal.completed &&
          styles.mealCardCompleted,
      ]}
      onPress={() =>
        onToggle(meal.id)
      }
    >
      <View style={styles.mealTopRow}>
        <View style={styles.mealTitleRow}>
          <View style={styles.mealIcon}>
            <MaterialCommunityIcons
              name={meal.icon}
              size={24}
              color="#42F58D"
            />
          </View>

          <View style={styles.mealHeading}>
            <Text style={styles.mealType}>
              {translatedType}
            </Text>

            <Text style={styles.mealTime}>
              {meal.time}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            meal.completed &&
              styles.completeButtonActive,
          ]}
          onPress={() =>
            onToggle(meal.id)
          }
        >
          <Ionicons
            name={
              meal.completed
                ? "checkmark"
                : "ellipse-outline"
            }
            size={20}
            color={
              meal.completed
                ? "#02111F"
                : "#AFC1D9"
            }
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.mealName}>
        {meal.name}
      </Text>

      <Text style={styles.mealDescription}>
        {meal.description}
      </Text>

      <View style={styles.nutritionRow}>
        <View style={styles.nutritionPill}>
          <Ionicons
            name="flame"
            size={15}
            color="#FFC94A"
          />

          <Text style={styles.nutritionText}>
            {meal.calories} {t("cal")}
          </Text>
        </View>

        <View style={styles.nutritionPill}>
          <MaterialCommunityIcons
            name="food-drumstick"
            size={15}
            color="#FF6475"
          />

          <Text style={styles.nutritionText}>
            {meal.protein}g {t("protein")}
          </Text>
        </View>

        <View style={styles.nutritionPill}>
          <MaterialCommunityIcons
            name="bread-slice"
            size={15}
            color="#52A8FF"
          />

          <Text style={styles.nutritionText}>
            {meal.carbs}g {t("carbs")}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editMealButton}
        onPress={() => onEdit(meal)}
      >
        <Ionicons
          name="create-outline"
          size={17}
          color="#9FCBFF"
        />

        <Text style={styles.editMealText}>
          {t("editMeal")}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function MealPlannerScreen({
  language = "en",
  goBack,
  goToSubscription,
  userPlan = "free",
}) {
  const languageCode =
    normalizeLanguage(language);

  function t(key, values = {}) {
    const value =
      TEXT?.[languageCode]?.[key] ??
      TEXT.en?.[key] ??
      key;

    return fillTemplate(
      value,
      values
    );
  }

  const [profile, setProfile] =
    useState(DEFAULT_PROFILE);

  const [meals, setMeals] =
    useState(DEFAULT_MEALS);

  const [water, setWater] =
    useState(0);

  const [showGoals, setShowGoals] =
    useState(false);

  const [isLoaded, setIsLoaded] =
    useState(false);


  // ==========================================================
  // TOTALS
  // ==========================================================

  const totals = useMemo(() => {
    return meals.reduce(
      (result, meal) => {
        result.calories +=
          Number(meal.calories || 0);

        result.protein +=
          Number(meal.protein || 0);

        result.carbs +=
          Number(meal.carbs || 0);

        result.fat +=
          Number(meal.fat || 0);

        if (meal.completed) {
          result.completedCalories +=
            Number(meal.calories || 0);

          result.completedProtein +=
            Number(meal.protein || 0);

          result.completedCarbs +=
            Number(meal.carbs || 0);

          result.completedFat +=
            Number(meal.fat || 0);
        }

        return result;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,

        completedCalories: 0,
        completedProtein: 0,
        completedCarbs: 0,
        completedFat: 0,
      }
    );
  }, [meals]);


  const completedMeals =
    useMemo(
      () =>
        meals.filter(
          (meal) =>
            meal.completed
        ).length,
      [meals]
    );


  const planProgress =
    meals.length > 0
      ? (
          completedMeals /
          meals.length
        ) * 100
      : 0;


  // ==========================================================
  // LOCALIZE MEALS
  // ==========================================================

  const localizedMeals =
    useMemo(() => {
      const mapping = {
        breakfast: {
          defaultName:
            "Protein Oatmeal Bowl",
          defaultDescription:
            "Oats, blueberries, banana, Greek yogurt, chia seeds, and cinnamon.",
          nameKey:
            "proteinOatmealBowl",
          descriptionKey:
            "proteinOatmealDescription",

          replacementName:
            "Egg and Avocado Breakfast",
          replacementDescription:
            "Two eggs, avocado toast, fresh berries, and Greek yogurt.",
          replacementNameKey:
            "eggAvocado",
          replacementDescriptionKey:
            "eggAvocadoDescription",
        },

        lunch: {
          defaultName:
            "Grilled Chicken Power Bowl",
          defaultDescription:
            "Chicken breast, brown rice, spinach, avocado, tomato, and lemon dressing.",
          nameKey:
            "chickenPowerBowl",
          descriptionKey:
            "chickenPowerDescription",

          replacementName:
            "Turkey Quinoa Bowl",
          replacementDescription:
            "Lean turkey, quinoa, roasted vegetables, spinach, and herb dressing.",
          replacementNameKey:
            "turkeyQuinoa",
          replacementDescriptionKey:
            "turkeyQuinoaDescription",
        },

        snack: {
          defaultName:
            "Recovery Snack",
          defaultDescription:
            "Greek yogurt, strawberries, almonds, and a drizzle of honey.",
          nameKey:
            "recoverySnack",
          descriptionKey:
            "recoverySnackDescription",

          replacementName:
            "Protein Smoothie",
          replacementDescription:
            "Protein, banana, berries, spinach, almond milk, and chia seeds.",
          replacementNameKey:
            "proteinSmoothie",
          replacementDescriptionKey:
            "proteinSmoothieDescription",
        },

        dinner: {
          defaultName:
            "Salmon Recovery Plate",
          defaultDescription:
            "Baked salmon, roasted sweet potato, broccoli, and mixed greens.",
          nameKey:
            "salmonPlate",
          descriptionKey:
            "salmonPlateDescription",

          replacementName:
            "Lean Beef Recovery Bowl",
          replacementDescription:
            "Lean beef, roasted potatoes, green beans, and mixed vegetables.",
          replacementNameKey:
            "beefRecovery",
          replacementDescriptionKey:
            "beefRecoveryDescription",
        },
      };

      return meals.map((meal) => {
        const config =
          mapping[meal.id];

        if (!config) {
          return meal;
        }

        let displayName =
          meal.name;

        let displayDescription =
          meal.description;

        if (
          meal.name ===
          config.defaultName
        ) {
          displayName =
            t(config.nameKey);
        } else if (
          meal.name ===
          config.replacementName
        ) {
          displayName =
            t(
              config.replacementNameKey
            );
        }

        if (
          meal.description ===
          config.defaultDescription
        ) {
          displayDescription =
            t(
              config.descriptionKey
            );
        } else if (
          meal.description ===
          config.replacementDescription
        ) {
          displayDescription =
            t(
              config.replacementDescriptionKey
            );
        }

        return {
          ...meal,
          name: displayName,
          description:
            displayDescription,
        };
      });
    }, [meals, languageCode]);


  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    loadPlanner();
  }, []);


  // ==========================================================
  // SAVE
  // ==========================================================

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    savePlanner();
  }, [
    profile,
    meals,
    water,
    isLoaded,
  ]);


  const loadPlanner =
    async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          setProfile({
            ...DEFAULT_PROFILE,
            ...(parsed.profile || {}),
          });

          setMeals(
            Array.isArray(
              parsed.meals
            ) &&
              parsed.meals.length
              ? parsed.meals
              : DEFAULT_MEALS
          );

          setWater(
            Number(
              parsed.water || 0
            )
          );
        }
      } catch (error) {
        console.log(
          "Meal planner load error:",
          error
        );
      } finally {
        setIsLoaded(true);
      }
    };


  const savePlanner =
    async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,

          JSON.stringify({
            profile,
            meals,
            water,

            updatedAt:
              new Date()
                .toISOString(),
          })
        );
      } catch (error) {
        console.log(
          "Meal planner save error:",
          error
        );
      }
    };


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    if (
      typeof goBack ===
      "function"
    ) {
      goBack();
    }
  };


  // ==========================================================
  // TOGGLE MEAL
  // ==========================================================

  const toggleMeal =
    (mealId) => {
      setMeals(
        (currentMeals) =>
          currentMeals.map(
            (meal) =>
              meal.id === mealId
                ? {
                    ...meal,
                    completed:
                      !meal.completed,
                  }
                : meal
          )
      );
    };


  // ==========================================================
  // EDIT MEAL
  // ==========================================================

  const editMeal =
    (displayMeal) => {
      Alert.alert(
        displayMeal.name,
        t("mealEditMessage"),
        [
          {
            text:
              t("cancel"),

            style:
              "cancel",
          },

          {
            text:
              t(
                "replaceMeal"
              ),

            onPress: () =>
              replaceMeal(
                displayMeal.id
              ),
          },
        ]
      );
    };


  // ==========================================================
  // REPLACE MEAL
  // ==========================================================

  const replaceMeal =
    (mealId) => {
      const replacements = {
        breakfast: {
          name:
            "Egg and Avocado Breakfast",

          description:
            "Two eggs, avocado toast, fresh berries, and Greek yogurt.",

          calories: 510,
          protein: 30,
          carbs: 47,
          fat: 23,
        },

        lunch: {
          name:
            "Turkey Quinoa Bowl",

          description:
            "Lean turkey, quinoa, roasted vegetables, spinach, and herb dressing.",

          calories: 590,
          protein: 46,
          carbs: 58,
          fat: 18,
        },

        snack: {
          name:
            "Protein Smoothie",

          description:
            "Protein, banana, berries, spinach, almond milk, and chia seeds.",

          calories: 310,
          protein: 27,
          carbs: 39,
          fat: 7,
        },

        dinner: {
          name:
            "Lean Beef Recovery Bowl",

          description:
            "Lean beef, roasted potatoes, green beans, and mixed vegetables.",

          calories: 650,
          protein: 47,
          carbs: 61,
          fat: 24,
        },
      };

      setMeals(
        (currentMeals) =>
          currentMeals.map(
            (meal) =>
              meal.id === mealId
                ? {
                    ...meal,
                    ...(
                      replacements[
                        mealId
                      ] || {}
                    ),

                    completed:
                      false,
                  }
                : meal
          )
      );
    };


  // ==========================================================
  // GENERATE PLAN
  // ==========================================================

  const generateNewPlan =
    () => {
      if (
        userPlan === "free" &&
        typeof goToSubscription ===
          "function"
      ) {
        Alert.alert(
          t(
            "premiumMealPlanning"
          ),

          t(
            "premiumMessage"
          ),

          [
            {
              text:
                t("notNow"),

              style:
                "cancel",
            },

            {
              text:
                t("viewPlans"),

              onPress:
                goToSubscription,
            },
          ]
        );

        return;
      }

      setMeals(
        (currentMeals) =>
          currentMeals.map(
            (meal) => ({
              ...meal,
              completed: false,
            })
          )
      );

      setWater(0);

      Alert.alert(
        t("newPlanCreated"),

        t(
          "newPlanMessage",
          {
            preference:
              t(
                preferenceKey(
                  profile.preference
                )
              ),
          }
        )
      );
    };


  // ==========================================================
  // RESET DAY
  // ==========================================================

  const resetDay = () => {
    Alert.alert(
      t("resetToday"),

      t(
        "resetTodayMessage"
      ),

      [
        {
          text:
            t("cancel"),

          style:
            "cancel",
        },

        {
          text:
            t("reset"),

          style:
            "destructive",

          onPress: () => {
            setMeals(
              (
                currentMeals
              ) =>
                currentMeals.map(
                  (meal) => ({
                    ...meal,
                    completed:
                      false,
                  })
                )
            );

            setWater(0);
          },
        },
      ]
    );
  };


  // ==========================================================
  // WATER
  // ==========================================================

  const addWater = () => {
    setWater(
      (current) =>
        Math.min(
          current + 8,
          Number(
            profile.waterGoal ||
              100
          )
        )
    );
  };


  const removeWater = () => {
    setWater(
      (current) =>
        Math.max(
          current - 8,
          0
        )
    );
  };


  // ==========================================================
  // GOALS
  // ==========================================================

  const updateGoal =
    (field, value) => {
      const numericValue =
        Number(
          String(value)
            .replace(
              /[^0-9]/g,
              ""
            )
        );

      setProfile(
        (current) => ({
          ...current,

          [field]:
            Number.isFinite(
              numericValue
            )
              ? numericValue
              : 0,
        })
      );
    };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[
          "#020611",
          "#071A33",
          "#020611",
        ]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              style={
                styles.headerButton
              }
              onPress={
                handleBack
              }
            >
              <Ionicons
                name="chevron-back"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={
                styles.headerTitleWrap
              }
            >
              <Text
                style={
                  styles.eyebrow
                }
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {t("wellness")}
              </Text>

              <Text
                style={
                  styles.title
                }
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
              >
                {t(
                  "mealPlanner"
                )}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.headerButton
              }
              onPress={() =>
                setShowGoals(
                  (current) =>
                    !current
                )
              }
            >
              <Ionicons
                name="settings-outline"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>


          {/* HERO */}

          <LinearGradient
            colors={[
              "#123E77",
              "#08284F",
              "#06172D",
            ]}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <View
                style={
                  styles.heroHeading
                }
              >
                <Text
                  style={
                    styles.heroLabel
                  }
                >
                  {t(
                    "todaysPlan"
                  )}
                </Text>

                <Text
                  style={
                    styles.heroTitle
                  }
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {t(
                    preferenceKey(
                      profile.preference
                    )
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.planBadge
                }
              >
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={18}
                  color="#FFC94A"
                />

                <Text
                  style={
                    styles.planBadgeText
                  }
                >
                  {completedMeals}/
                  {meals.length}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.heroDescription
              }
            >
              {t(
                "heroDescription"
              )}
            </Text>

            <View
              style={
                styles.dailyProgressRow
              }
            >
              <Text
                style={
                  styles.dailyProgressLabel
                }
              >
                {t(
                  "dailyProgress"
                )}
              </Text>

              <Text
                style={
                  styles.dailyProgressValue
                }
              >
                {Math.round(
                  planProgress
                )}
                %
              </Text>
            </View>

            <ProgressBar
              value={
                planProgress
              }
              color="#42F58D"
            />

            <View
              style={
                styles.calorieSummary
              }
            >
              <View
                style={
                  styles.calorieColumn
                }
              >
                <Text
                  style={
                    styles.calorieNumber
                  }
                >
                  {totals.completedCalories.toLocaleString()}
                </Text>

                <Text
                  style={
                    styles.calorieCaption
                  }
                >
                  {t("consumed")}
                </Text>
              </View>

              <View
                style={
                  styles.calorieDivider
                }
              />

              <View
                style={
                  styles.calorieColumn
                }
              >
                <Text
                  style={
                    styles.calorieNumber
                  }
                >
                  {Number(
                    profile.dailyCalories
                  ).toLocaleString()}
                </Text>

                <Text
                  style={
                    styles.calorieCaption
                  }
                >
                  {t(
                    "dailyGoal"
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.calorieDivider
                }
              />

              <View
                style={
                  styles.calorieColumn
                }
              >
                <Text
                  style={
                    styles.calorieNumber
                  }
                >
                  {Math.max(
                    Number(
                      profile.dailyCalories
                    ) -
                      totals.completedCalories,
                    0
                  ).toLocaleString()}
                </Text>

                <Text
                  style={
                    styles.calorieCaption
                  }
                >
                  {t(
                    "remaining"
                  )}
                </Text>
              </View>
            </View>
          </LinearGradient>


          {/* GOAL EDITOR */}

          {showGoals && (
            <View
              style={
                styles.goalEditor
              }
            >
              <View
                style={
                  styles.sectionHeader
                }
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={
                      styles.sectionEyebrow
                    }
                  >
                    {t(
                      "personalization"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      "nutritionGoals"
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.closeButton
                  }
                  onPress={() =>
                    setShowGoals(
                      false
                    )
                  }
                >
                  <Ionicons
                    name="close"
                    size={21}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={
                  styles.fieldLabel
                }
              >
                {t(
                  "mealPreference"
                )}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.preferenceRow
                }
              >
                {PREFERENCE_OPTIONS.map(
                  (option) => {
                    const selected =
                      profile.preference ===
                      option;

                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.preferenceButton,

                          selected &&
                            styles.preferenceButtonActive,
                        ]}
                        onPress={() =>
                          setProfile(
                            (
                              current
                            ) => ({
                              ...current,

                              preference:
                                option,
                            })
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.preferenceText,

                            selected &&
                              styles.preferenceTextActive,
                          ]}
                        >
                          {t(
                            preferenceKey(
                              option
                            )
                          )}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>

              <View
                style={
                  styles.goalInputGrid
                }
              >
                <GoalInput
                  label={t(
                    "calories"
                  )}
                  value={
                    profile.dailyCalories
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateGoal(
                      "dailyCalories",
                      value
                    )
                  }
                />

                <GoalInput
                  label={t(
                    "protein"
                  )}
                  value={
                    profile.proteinGoal
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateGoal(
                      "proteinGoal",
                      value
                    )
                  }
                />

                <GoalInput
                  label={t(
                    "carbs"
                  )}
                  value={
                    profile.carbGoal
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateGoal(
                      "carbGoal",
                      value
                    )
                  }
                />

                <GoalInput
                  label={t(
                    "waterOz"
                  )}
                  value={
                    profile.waterGoal
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateGoal(
                      "waterGoal",
                      value
                    )
                  }
                />
              </View>
            </View>
          )}


          {/* NUTRITION OVERVIEW */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "dailyTargets"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "nutritionOverview"
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.macroGrid
            }
          >
            <MacroCard
              label={t(
                "calories"
              )}
              current={
                totals.completedCalories
              }
              goal={
                profile.dailyCalories
              }
              unit=""
              color="#FFC94A"
              icon="fire"
            />

            <MacroCard
              label={t(
                "protein"
              )}
              current={
                totals.completedProtein
              }
              goal={
                profile.proteinGoal
              }
              color="#FF6475"
              icon="food-drumstick"
            />

            <MacroCard
              label={t(
                "carbs"
              )}
              current={
                totals.completedCarbs
              }
              goal={
                profile.carbGoal
              }
              color="#52A8FF"
              icon="bread-slice"
            />

            <MacroCard
              label={t(
                "fat"
              )}
              current={
                totals.completedFat
              }
              goal={
                profile.fatGoal
              }
              color="#B77BFF"
              icon="peanut"
            />
          </View>


          {/* MEALS */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t("today")}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "yourMeals"
                )}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.resetButton
              }
              onPress={
                resetDay
              }
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#9FCBFF"
              />

              <Text
                style={
                  styles.resetText
                }
              >
                {t("reset")}
              </Text>
            </TouchableOpacity>
          </View>

          {localizedMeals.map(
            (meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onToggle={
                  toggleMeal
                }
                onEdit={
                  editMeal
                }
                t={t}
              />
            )
          )}


          {/* WATER */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "hydration"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "waterGoal"
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.waterCard
            }
          >
            <View
              style={
                styles.waterLeft
              }
            >
              <View
                style={
                  styles.waterIcon
                }
              >
                <Ionicons
                  name="water"
                  size={30}
                  color="#38D6FF"
                />
              </View>

              <View
                style={
                  styles.waterCopy
                }
              >
                <Text
                  style={
                    styles.waterValue
                  }
                >
                  {water} /{" "}
                  {profile.waterGoal} oz
                </Text>

                <Text
                  style={
                    styles.waterCaption
                  }
                >
                  {t(
                    "glassesCompleted",
                    {
                      count:
                        Math.round(
                          water / 8
                        ),
                    }
                  )}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.waterControls
              }
            >
              <TouchableOpacity
                style={
                  styles.waterButton
                }
                onPress={
                  removeWater
                }
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.waterButtonPrimary
                }
                onPress={
                  addWater
                }
              >
                <Ionicons
                  name="add"
                  size={23}
                  color="#02111F"
                />
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.waterProgress
              }
            >
              <ProgressBar
                value={
                  profile.waterGoal >
                  0
                    ? (
                        water /
                        profile.waterGoal
                      ) * 100
                    : 0
                }
                color="#38D6FF"
              />
            </View>
          </View>


          {/* AI COACH */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "legathonAI"
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                {t(
                  "coachRecommendation"
                )}
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={[
              "#102B4E",
              "#071B32",
            ]}
            style={
              styles.coachCard
            }
          >
            <View
              style={
                styles.coachIcon
              }
            >
              <MaterialCommunityIcons
                name="brain"
                size={30}
                color="#42F58D"
              />
            </View>

            <View
              style={
                styles.coachTextWrap
              }
            >
              <Text
                style={
                  styles.coachTitle
                }
              >
                {t(
                  "recoveryNutrition"
                )}
              </Text>

              <Text
                style={
                  styles.coachText
                }
              >
                {t(
                  "recoveryNutritionText"
                )}
              </Text>
            </View>
          </LinearGradient>


          {/* GENERATE */}

          <TouchableOpacity
            activeOpacity={0.88}
            style={
              styles.generateButton
            }
            onPress={
              generateNewPlan
            }
          >
            <LinearGradient
              colors={[
                "#FFD34F",
                "#F4B92E",
              ]}
              style={
                styles.generateGradient
              }
            >
              <MaterialCommunityIcons
                name="creation"
                size={24}
                color="#02111F"
              />

              <Text
                style={
                  styles.generateText
                }
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {t(
                  "generatePlan"
                )}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={23}
                color="#02111F"
              />
            </LinearGradient>
          </TouchableOpacity>

          <Text
            style={
              styles.disclaimer
            }
          >
            {t(
              "disclaimer"
            )}
          </Text>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}


// ============================================================
// GOAL INPUT
// ============================================================

function GoalInput({
  label,
  value,
  onChangeText,
}) {
  return (
    <View
      style={
        styles.goalInputWrap
      }
    >
      <Text
        style={
          styles.goalInputLabel
        }
        numberOfLines={2}
      >
        {label}
      </Text>

      <TextInput
        value={String(value)}
        onChangeText={
          onChangeText
        }
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#687B96"
        style={
          styles.goalInput
        }
      />
    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A1D35",
    borderWidth: 1,
    borderColor: "#244768",
  },

  headerTitleWrap: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },

  eyebrow: {
    color: "#FFC94A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },

  heroCard: {
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#2A5685",
    marginBottom: 24,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  heroHeading: {
    flex: 1,
    paddingRight: 10,
  },

  heroLabel: {
    color: "#9FCBFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 4,
  },

  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,201,74,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,201,74,0.45)",
  },

  planBadgeText: {
    color: "#FFC94A",
    fontWeight: "900",
  },

  heroDescription: {
    color: "#C1D3E8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },

  dailyProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 8,
  },

  dailyProgressLabel: {
    color: "#B8C9DD",
    fontSize: 13,
    fontWeight: "700",
  },

  dailyProgressValue: {
    color: "#42F58D",
    fontSize: 13,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#263B52",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  calorieSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(159,203,255,0.2)",
  },

  calorieColumn: {
    flex: 1,
    alignItems: "center",
  },

  calorieNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  calorieCaption: {
    color: "#9CB0C8",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },

  calorieDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(159,203,255,0.22)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: "#52A8FF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },

  goalEditor: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#081D35",
    borderWidth: 1,
    borderColor: "#27496E",
    marginBottom: 24,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132C48",
  },

  fieldLabel: {
    color: "#B9CADF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  preferenceRow: {
    gap: 8,
    paddingBottom: 16,
  },

  preferenceButton: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#102A47",
    borderWidth: 1,
    borderColor: "#28496A",
  },

  preferenceButtonActive: {
    backgroundColor: "#FFC94A",
    borderColor: "#FFC94A",
  },

  preferenceText: {
    color: "#BFD0E4",
    fontSize: 12,
    fontWeight: "800",
  },

  preferenceTextActive: {
    color: "#02111F",
  },

  goalInputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  goalInputWrap: {
    width: "48%",
  },

  goalInputLabel: {
    color: "#9DB2CB",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
  },

  goalInput: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 13,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    backgroundColor: "#061426",
    borderWidth: 1,
    borderColor: "#294867",
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },

  macroCard: {
    width: "48%",
    minHeight: 130,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#244564",
  },

  macroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071426",
    borderWidth: 1,
  },

  macroLabel: {
    flex: 1,
    color: "#B9CBE0",
    fontWeight: "800",
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 11,
  },

  macroGoal: {
    color: "#8299B3",
    fontSize: 12,
    fontWeight: "700",
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#0B233D",
    borderWidth: 1,
    borderColor: "#274C70",
  },

  resetText: {
    color: "#9FCBFF",
    fontSize: 12,
    fontWeight: "800",
  },

  mealCard: {
    borderRadius: 23,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#264866",
  },

  mealCardCompleted: {
    borderColor: "rgba(66,245,141,0.7)",
    backgroundColor: "#092637",
  },

  mealTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mealTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  mealIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(66,245,141,0.1)",
  },

  mealHeading: {
    marginLeft: 12,
    flex: 1,
  },

  mealType: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  mealTime: {
    color: "#8399B2",
    fontSize: 12,
    marginTop: 2,
  },

  completeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102A46",
    borderWidth: 1,
    borderColor: "#31506D",
  },

  completeButtonActive: {
    backgroundColor: "#42F58D",
    borderColor: "#42F58D",
  },

  mealName: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 16,
  },

  mealDescription: {
    color: "#AFC1D6",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },

  nutritionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 15,
  },

  nutritionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: "#061426",
  },

  nutritionText: {
    color: "#C5D5E8",
    fontSize: 11,
    fontWeight: "700",
  },

  editMealButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 15,
  },

  editMealText: {
    color: "#9FCBFF",
    fontSize: 12,
    fontWeight: "800",
  },

  waterCard: {
    borderRadius: 23,
    padding: 18,
    marginBottom: 26,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#26516F",
  },

  waterLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 90,
  },

  waterIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56,214,255,0.1)",
    marginRight: 13,
  },

  waterCopy: {
    flex: 1,
  },

  waterValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  waterCaption: {
    color: "#8FA6BF",
    fontSize: 12,
    marginTop: 3,
  },

  waterControls: {
    position: "absolute",
    right: 18,
    top: 20,
    flexDirection: "row",
    gap: 8,
  },

  waterButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132B46",
  },

  waterButtonPrimary: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38D6FF",
  },

  waterProgress: {
    marginTop: 17,
  },

  coachCard: {
    flexDirection: "row",
    borderRadius: 23,
    padding: 18,
    borderWidth: 1,
    borderColor: "#295075",
    marginBottom: 20,
  },

  coachIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(66,245,141,0.1)",
    marginRight: 13,
  },

  coachTextWrap: {
    flex: 1,
  },

  coachTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  coachText: {
    color: "#B7CAE0",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },

  generateButton: {
    borderRadius: 26,
    overflow: "hidden",
    marginTop: 4,
  },

  generateGradient: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
  },

  generateText: {
    color: "#02111F",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },

  disclaimer: {
    color: "#71869F",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});