// screens/JourneyPreferencesScreen.js

import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  translate,
} from "../i18n/i18n";

const PREF_KEY =
  "journeyPreferences";

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    personalize: "PERSONALIZE",
    title: "Your Legathon",

    subtitle:
      "Choose the journeys and experiences that inspire you. Legathon Walk recommends based on your interests, not assumptions.",

    inspiresYou:
      "What inspires you?",

    yourGoals:
      "What are your goals?",

    challengeLevel:
      "Challenge Level",

    journeyLength:
      "Journey Length",

    hideRecommendations:
      "Hide From Recommendations",

    hideDescription:
      "Select categories you prefer not to see in recommendations. You can still browse all journeys later.",

    saveContinue:
      "Save & Continue",

    savePreferences:
      "Save Preferences",

    resetPreferences:
      "Reset Preferences",

    skipForNow:
      "Skip For Now",

    notNow:
      "Not Now",

    preferencesSaved:
      "Preferences Saved",

    preferencesSavedMessage:
      "Your Legathon Walk recommendations will now be personalized.",

    saveError:
      "Save Error",

    saveErrorMessage:
      "Unable to save preferences right now.",

    preferencesReset:
      "Preferences Reset",

    preferencesResetMessage:
      "Your journey preferences were reset.",

    resetError:
      "Reset Error",

    resetErrorMessage:
      "Unable to reset preferences right now.",

    ok: "OK",

    civil_rights:
      "✊ Civil Rights & Freedom Movements",

    african_history:
      "🌍 African & African Diaspora History",

    world_wonders:
      "🌎 World Wonders",

    ancient_civilizations:
      "🏛 Ancient Civilizations",

    nature:
      "🌳 Nature & Adventure",

    cities:
      "🏙 Cities & Culture",

    faith:
      "🙏 Faith & Spiritual Journeys",

    arts:
      "🎭 Arts & Literature",

    wellness:
      "❤️ Health & Wellness",

    fitness:
      "🏃 Fitness & Endurance",

    marathon:
      "🏅 Marathon Challenges",

    goal_weight_loss:
      "Lose Weight",

    goal_heart_health:
      "Improve Heart Health",

    goal_stress:
      "Reduce Stress",

    goal_activity:
      "Stay Active",

    goal_endurance:
      "Build Endurance",

    goal_history:
      "Learn History",

    goal_culture:
      "Explore New Cultures",

    goal_competition:
      "Compete With Friends",

    goal_mental_wellness:
      "Improve Mental Wellness",

    beginner:
      "🔵 Beginner",

    beginnerSubtitle:
      "Explorer Collection",

    beginnerDescription:
      "Perfect for members beginning their Legathon journey.",

    moderate:
      "🔴 Moderate",

    moderateSubtitle:
      "Trailblazer Collection",

    moderateDescription:
      "For members ready to challenge themselves.",

    advanced:
      "🟢 Advanced",

    advancedSubtitle:
      "Pathfinder Collection",

    advancedDescription:
      "Designed for experienced walkers pursuing bigger goals.",

    legendary:
      "🟡 Legendary",

    legendarySubtitle:
      "Longevity Collection",

    legendaryDescription:
      "For members committed to building a lasting legacy.",

    elite:
      "⚫ Elite",

    eliteSubtitle:
      "Elite Collection",

    eliteDescription:
      "The highest level of Legathon Walk achievement.",

    length_7_days:
      "⚡ Quick Challenges (7 Days)",

    length_30_days:
      "🚶 Standard Journeys (30 Days)",

    length_60_90_days:
      "🌎 Long Expeditions (60–90 Days)",

    length_lifetime:
      "🏆 Legendary Lifetime Journeys",

    hide_faith:
      "Faith & Spiritual",

    hide_civil_rights:
      "Civil Rights & Freedom Movements",

    hide_african_history:
      "African & African Diaspora History",

    hide_cause_based:
      "Cause-Based Walks",

    hide_marathon:
      "Marathon Challenges",
  },

  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    personalize: "PERSONALIZAR",
    title: "Tu Legathon",

    subtitle:
      "Elige los viajes y experiencias que te inspiran. Legathon Walk recomienda según tus intereses, no según suposiciones.",

    inspiresYou:
      "¿Qué te inspira?",

    yourGoals:
      "¿Cuáles son tus objetivos?",

    challengeLevel:
      "Nivel de Desafío",

    journeyLength:
      "Duración del Viaje",

    hideRecommendations:
      "Ocultar de las Recomendaciones",

    hideDescription:
      "Selecciona las categorías que prefieres no ver en las recomendaciones. Aún podrás explorar todos los viajes más adelante.",

    saveContinue:
      "Guardar y Continuar",

    savePreferences:
      "Guardar Preferencias",

    resetPreferences:
      "Restablecer Preferencias",

    skipForNow:
      "Omitir por Ahora",

    notNow:
      "Ahora No",

    preferencesSaved:
      "Preferencias Guardadas",

    preferencesSavedMessage:
      "Tus recomendaciones de Legathon Walk ahora serán personalizadas.",

    saveError:
      "Error al Guardar",

    saveErrorMessage:
      "No se pueden guardar las preferencias en este momento.",

    preferencesReset:
      "Preferencias Restablecidas",

    preferencesResetMessage:
      "Tus preferencias de viaje fueron restablecidas.",

    resetError:
      "Error al Restablecer",

    resetErrorMessage:
      "No se pueden restablecer las preferencias en este momento.",

    ok: "OK",

    civil_rights:
      "✊ Derechos Civiles y Movimientos de Libertad",

    african_history:
      "🌍 Historia Africana y de la Diáspora Africana",

    world_wonders:
      "🌎 Maravillas del Mundo",

    ancient_civilizations:
      "🏛 Civilizaciones Antiguas",

    nature:
      "🌳 Naturaleza y Aventura",

    cities:
      "🏙 Ciudades y Cultura",

    faith:
      "🙏 Fe y Viajes Espirituales",

    arts:
      "🎭 Artes y Literatura",

    wellness:
      "❤️ Salud y Bienestar",

    fitness:
      "🏃 Fitness y Resistencia",

    marathon:
      "🏅 Desafíos de Maratón",

    goal_weight_loss:
      "Perder Peso",

    goal_heart_health:
      "Mejorar la Salud del Corazón",

    goal_stress:
      "Reducir el Estrés",

    goal_activity:
      "Mantenerse Activo",

    goal_endurance:
      "Aumentar la Resistencia",

    goal_history:
      "Aprender Historia",

    goal_culture:
      "Explorar Nuevas Culturas",

    goal_competition:
      "Competir con Amigos",

    goal_mental_wellness:
      "Mejorar el Bienestar Mental",

    beginner:
      "🔵 Principiante",

    beginnerSubtitle:
      "Colección Explorador",

    beginnerDescription:
      "Perfecto para miembros que comienzan su viaje Legathon.",

    moderate:
      "🔴 Moderado",

    moderateSubtitle:
      "Colección Trailblazer",

    moderateDescription:
      "Para miembros preparados para desafiarse.",

    advanced:
      "🟢 Avanzado",

    advancedSubtitle:
      "Colección Pathfinder",

    advancedDescription:
      "Diseñado para caminantes experimentados que buscan objetivos mayores.",

    legendary:
      "🟡 Legendario",

    legendarySubtitle:
      "Colección Longevidad",

    legendaryDescription:
      "Para miembros comprometidos con construir un legado duradero.",

    elite:
      "⚫ Elite",

    eliteSubtitle:
      "Colección Elite",

    eliteDescription:
      "El nivel más alto de logro de Legathon Walk.",

    length_7_days:
      "⚡ Desafíos Rápidos (7 Días)",

    length_30_days:
      "🚶 Viajes Estándar (30 Días)",

    length_60_90_days:
      "🌎 Expediciones Largas (60–90 Días)",

    length_lifetime:
      "🏆 Viajes Legendarios de por Vida",

    hide_faith:
      "Fe y Espiritualidad",

    hide_civil_rights:
      "Derechos Civiles y Movimientos de Libertad",

    hide_african_history:
      "Historia Africana y de la Diáspora",

    hide_cause_based:
      "Caminatas por una Causa",

    hide_marathon:
      "Desafíos de Maratón",
  },

  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    personalize: "PERSONNALISER",
    title: "Votre Legathon",

    subtitle:
      "Choisissez les voyages et expériences qui vous inspirent. Legathon Walk recommande selon vos intérêts, et non selon des suppositions.",

    inspiresYou:
      "Qu’est-ce qui vous inspire ?",

    yourGoals:
      "Quels sont vos objectifs ?",

    challengeLevel:
      "Niveau de Défi",

    journeyLength:
      "Durée du Voyage",

    hideRecommendations:
      "Masquer des Recommandations",

    hideDescription:
      "Sélectionnez les catégories que vous préférez ne pas voir dans les recommandations. Vous pourrez toujours parcourir tous les voyages plus tard.",

    saveContinue:
      "Enregistrer et Continuer",

    savePreferences:
      "Enregistrer les Préférences",

    resetPreferences:
      "Réinitialiser les Préférences",

    skipForNow:
      "Passer pour l’Instant",

    notNow:
      "Pas Maintenant",

    preferencesSaved:
      "Préférences Enregistrées",

    preferencesSavedMessage:
      "Vos recommandations Legathon Walk seront désormais personnalisées.",

    saveError:
      "Erreur d’Enregistrement",

    saveErrorMessage:
      "Impossible d’enregistrer les préférences pour le moment.",

    preferencesReset:
      "Préférences Réinitialisées",

    preferencesResetMessage:
      "Vos préférences de voyage ont été réinitialisées.",

    resetError:
      "Erreur de Réinitialisation",

    resetErrorMessage:
      "Impossible de réinitialiser les préférences pour le moment.",

    ok: "OK",

    civil_rights:
      "✊ Droits Civiques et Mouvements de Liberté",

    african_history:
      "🌍 Histoire Africaine et de la Diaspora Africaine",

    world_wonders:
      "🌎 Merveilles du Monde",

    ancient_civilizations:
      "🏛 Civilisations Anciennes",

    nature:
      "🌳 Nature et Aventure",

    cities:
      "🏙 Villes et Culture",

    faith:
      "🙏 Foi et Voyages Spirituels",

    arts:
      "🎭 Arts et Littérature",

    wellness:
      "❤️ Santé et Bien-être",

    fitness:
      "🏃 Forme et Endurance",

    marathon:
      "🏅 Défis Marathon",

    goal_weight_loss:
      "Perdre du Poids",

    goal_heart_health:
      "Améliorer la Santé Cardiaque",

    goal_stress:
      "Réduire le Stress",

    goal_activity:
      "Rester Actif",

    goal_endurance:
      "Développer l’Endurance",

    goal_history:
      "Apprendre l’Histoire",

    goal_culture:
      "Découvrir de Nouvelles Cultures",

    goal_competition:
      "Rivaliser avec des Amis",

    goal_mental_wellness:
      "Améliorer le Bien-être Mental",

    beginner:
      "🔵 Débutant",

    beginnerSubtitle:
      "Collection Explorateur",

    beginnerDescription:
      "Parfait pour les membres qui commencent leur aventure Legathon.",

    moderate:
      "🔴 Modéré",

    moderateSubtitle:
      "Collection Trailblazer",

    moderateDescription:
      "Pour les membres prêts à se dépasser.",

    advanced:
      "🟢 Avancé",

    advancedSubtitle:
      "Collection Pathfinder",

    advancedDescription:
      "Conçu pour les marcheurs expérimentés poursuivant de plus grands objectifs.",

    legendary:
      "🟡 Légendaire",

    legendarySubtitle:
      "Collection Longévité",

    legendaryDescription:
      "Pour les membres déterminés à construire un héritage durable.",

    elite:
      "⚫ Élite",

    eliteSubtitle:
      "Collection Élite",

    eliteDescription:
      "Le plus haut niveau de réussite Legathon Walk.",

    length_7_days:
      "⚡ Défis Rapides (7 Jours)",

    length_30_days:
      "🚶 Voyages Standards (30 Jours)",

    length_60_90_days:
      "🌎 Longues Expéditions (60–90 Jours)",

    length_lifetime:
      "🏆 Voyages Légendaires à Long Terme",

    hide_faith:
      "Foi et Spiritualité",

    hide_civil_rights:
      "Droits Civiques et Mouvements de Liberté",

    hide_african_history:
      "Histoire Africaine et Diaspora",

    hide_cause_based:
      "Marches pour une Cause",

    hide_marathon:
      "Défis Marathon",
  },

  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    personalize: "PERSONALISIEREN",
    title: "Dein Legathon",

    subtitle:
      "Wähle Reisen und Erlebnisse, die dich inspirieren. Legathon Walk empfiehlt anhand deiner Interessen, nicht anhand von Annahmen.",

    inspiresYou:
      "Was inspiriert dich?",

    yourGoals:
      "Was sind deine Ziele?",

    challengeLevel:
      "Schwierigkeitsstufe",

    journeyLength:
      "Reisedauer",

    hideRecommendations:
      "Aus Empfehlungen Ausblenden",

    hideDescription:
      "Wähle Kategorien aus, die du nicht in Empfehlungen sehen möchtest. Du kannst später weiterhin alle Reisen durchsuchen.",

    saveContinue:
      "Speichern & Weiter",

    savePreferences:
      "Einstellungen Speichern",

    resetPreferences:
      "Einstellungen Zurücksetzen",

    skipForNow:
      "Vorerst Überspringen",

    notNow:
      "Nicht Jetzt",

    preferencesSaved:
      "Einstellungen Gespeichert",

    preferencesSavedMessage:
      "Deine Legathon Walk Empfehlungen werden jetzt personalisiert.",

    saveError:
      "Speicherfehler",

    saveErrorMessage:
      "Die Einstellungen können derzeit nicht gespeichert werden.",

    preferencesReset:
      "Einstellungen Zurückgesetzt",

    preferencesResetMessage:
      "Deine Reiseeinstellungen wurden zurückgesetzt.",

    resetError:
      "Fehler beim Zurücksetzen",

    resetErrorMessage:
      "Die Einstellungen können derzeit nicht zurückgesetzt werden.",

    ok: "OK",

    civil_rights:
      "✊ Bürgerrechte & Freiheitsbewegungen",

    african_history:
      "🌍 Afrikanische Geschichte & Diaspora",

    world_wonders:
      "🌎 Weltwunder",

    ancient_civilizations:
      "🏛 Antike Zivilisationen",

    nature:
      "🌳 Natur & Abenteuer",

    cities:
      "🏙 Städte & Kultur",

    faith:
      "🙏 Glaube & Spirituelle Reisen",

    arts:
      "🎭 Kunst & Literatur",

    wellness:
      "❤️ Gesundheit & Wohlbefinden",

    fitness:
      "🏃 Fitness & Ausdauer",

    marathon:
      "🏅 Marathon-Herausforderungen",

    goal_weight_loss:
      "Gewicht Verlieren",

    goal_heart_health:
      "Herzgesundheit Verbessern",

    goal_stress:
      "Stress Reduzieren",

    goal_activity:
      "Aktiv Bleiben",

    goal_endurance:
      "Ausdauer Aufbauen",

    goal_history:
      "Geschichte Lernen",

    goal_culture:
      "Neue Kulturen Entdecken",

    goal_competition:
      "Mit Freunden Messen",

    goal_mental_wellness:
      "Mentales Wohlbefinden Verbessern",

    beginner:
      "🔵 Anfänger",

    beginnerSubtitle:
      "Explorer-Kollektion",

    beginnerDescription:
      "Ideal für Mitglieder, die ihre Legathon-Reise beginnen.",

    moderate:
      "🔴 Mittel",

    moderateSubtitle:
      "Trailblazer-Kollektion",

    moderateDescription:
      "Für Mitglieder, die bereit sind, sich selbst herauszufordern.",

    advanced:
      "🟢 Fortgeschritten",

    advancedSubtitle:
      "Pathfinder-Kollektion",

    advancedDescription:
      "Für erfahrene Walker mit größeren Zielen.",

    legendary:
      "🟡 Legendär",

    legendarySubtitle:
      "Langlebigkeits-Kollektion",

    legendaryDescription:
      "Für Mitglieder, die ein dauerhaftes Vermächtnis aufbauen möchten.",

    elite:
      "⚫ Elite",

    eliteSubtitle:
      "Elite-Kollektion",

    eliteDescription:
      "Die höchste Leistungsstufe von Legathon Walk.",

    length_7_days:
      "⚡ Schnelle Herausforderungen (7 Tage)",

    length_30_days:
      "🚶 Standardreisen (30 Tage)",

    length_60_90_days:
      "🌎 Lange Expeditionen (60–90 Tage)",

    length_lifetime:
      "🏆 Legendäre Langzeitreisen",

    hide_faith:
      "Glaube & Spiritualität",

    hide_civil_rights:
      "Bürgerrechte & Freiheitsbewegungen",

    hide_african_history:
      "Afrikanische Geschichte & Diaspora",

    hide_cause_based:
      "Spenden- und Themenwanderungen",

    hide_marathon:
      "Marathon-Herausforderungen",
  },

  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    personalize: "PERSONALIZAR",
    title: "Seu Legathon",

    subtitle:
      "Escolha jornadas e experiências que inspiram você. O Legathon Walk recomenda com base nos seus interesses, não em suposições.",

    inspiresYou:
      "O que inspira você?",

    yourGoals:
      "Quais são seus objetivos?",

    challengeLevel:
      "Nível de Desafio",

    journeyLength:
      "Duração da Jornada",

    hideRecommendations:
      "Ocultar das Recomendações",

    hideDescription:
      "Selecione categorias que você prefere não ver nas recomendações. Você ainda poderá explorar todas as jornadas depois.",

    saveContinue:
      "Salvar e Continuar",

    savePreferences:
      "Salvar Preferências",

    resetPreferences:
      "Redefinir Preferências",

    skipForNow:
      "Pular por Agora",

    notNow:
      "Agora Não",

    preferencesSaved:
      "Preferências Salvas",

    preferencesSavedMessage:
      "Suas recomendações do Legathon Walk agora serão personalizadas.",

    saveError:
      "Erro ao Salvar",

    saveErrorMessage:
      "Não foi possível salvar as preferências agora.",

    preferencesReset:
      "Preferências Redefinidas",

    preferencesResetMessage:
      "Suas preferências de jornada foram redefinidas.",

    resetError:
      "Erro ao Redefinir",

    resetErrorMessage:
      "Não foi possível redefinir as preferências agora.",

    ok: "OK",

    civil_rights:
      "✊ Direitos Civis e Movimentos de Liberdade",

    african_history:
      "🌍 História Africana e da Diáspora Africana",

    world_wonders:
      "🌎 Maravilhas do Mundo",

    ancient_civilizations:
      "🏛 Civilizações Antigas",

    nature:
      "🌳 Natureza e Aventura",

    cities:
      "🏙 Cidades e Cultura",

    faith:
      "🙏 Fé e Jornadas Espirituais",

    arts:
      "🎭 Artes e Literatura",

    wellness:
      "❤️ Saúde e Bem-estar",

    fitness:
      "🏃 Fitness e Resistência",

    marathon:
      "🏅 Desafios de Maratona",

    goal_weight_loss:
      "Perder Peso",

    goal_heart_health:
      "Melhorar a Saúde do Coração",

    goal_stress:
      "Reduzir o Estresse",

    goal_activity:
      "Permanecer Ativo",

    goal_endurance:
      "Aumentar a Resistência",

    goal_history:
      "Aprender História",

    goal_culture:
      "Explorar Novas Culturas",

    goal_competition:
      "Competir com Amigos",

    goal_mental_wellness:
      "Melhorar o Bem-estar Mental",

    beginner:
      "🔵 Iniciante",

    beginnerSubtitle:
      "Coleção Explorer",

    beginnerDescription:
      "Perfeito para membros começando sua jornada Legathon.",

    moderate:
      "🔴 Moderado",

    moderateSubtitle:
      "Coleção Trailblazer",

    moderateDescription:
      "Para membros prontos para se desafiar.",

    advanced:
      "🟢 Avançado",

    advancedSubtitle:
      "Coleção Pathfinder",

    advancedDescription:
      "Projetado para caminhantes experientes buscando objetivos maiores.",

    legendary:
      "🟡 Lendário",

    legendarySubtitle:
      "Coleção Longevidade",

    legendaryDescription:
      "Para membros comprometidos em construir um legado duradouro.",

    elite:
      "⚫ Elite",

    eliteSubtitle:
      "Coleção Elite",

    eliteDescription:
      "O nível mais alto de conquista do Legathon Walk.",

    length_7_days:
      "⚡ Desafios Rápidos (7 Dias)",

    length_30_days:
      "🚶 Jornadas Padrão (30 Dias)",

    length_60_90_days:
      "🌎 Expedições Longas (60–90 Dias)",

    length_lifetime:
      "🏆 Jornadas Lendárias de Longo Prazo",

    hide_faith:
      "Fé e Espiritualidade",

    hide_civil_rights:
      "Direitos Civis e Movimentos de Liberdade",

    hide_african_history:
      "História Africana e Diáspora",

    hide_cause_based:
      "Caminhadas por Causas",

    hide_marathon:
      "Desafios de Maratona",
  },

  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    personalize: "パーソナライズ",
    title: "あなたのLegathon",

    subtitle:
      "あなたを刺激する旅や体験を選んでください。Legathon Walkは推測ではなく、あなたの興味に基づいておすすめします。",

    inspiresYou:
      "何に興味がありますか？",

    yourGoals:
      "目標は何ですか？",

    challengeLevel:
      "チャレンジレベル",

    journeyLength:
      "ジャーニー期間",

    hideRecommendations:
      "おすすめから非表示",

    hideDescription:
      "おすすめに表示したくないカテゴリーを選択してください。すべてのジャーニーは後からいつでも閲覧できます。",

    saveContinue:
      "保存して続行",

    savePreferences:
      "設定を保存",

    resetPreferences:
      "設定をリセット",

    skipForNow:
      "今はスキップ",

    notNow:
      "今はしない",

    preferencesSaved:
      "設定を保存しました",

    preferencesSavedMessage:
      "Legathon Walkのおすすめがあなた向けにパーソナライズされます。",

    saveError:
      "保存エラー",

    saveErrorMessage:
      "現在、設定を保存できません。",

    preferencesReset:
      "設定をリセットしました",

    preferencesResetMessage:
      "ジャーニー設定がリセットされました。",

    resetError:
      "リセットエラー",

    resetErrorMessage:
      "現在、設定をリセットできません。",

    ok: "OK",

    civil_rights:
      "✊ 公民権と自由運動",

    african_history:
      "🌍 アフリカとアフリカ系ディアスポラの歴史",

    world_wonders:
      "🌎 世界の驚異",

    ancient_civilizations:
      "🏛 古代文明",

    nature:
      "🌳 自然と冒険",

    cities:
      "🏙 都市と文化",

    faith:
      "🙏 信仰とスピリチュアルな旅",

    arts:
      "🎭 芸術と文学",

    wellness:
      "❤️ 健康とウェルネス",

    fitness:
      "🏃 フィットネスと持久力",

    marathon:
      "🏅 マラソンチャレンジ",

    goal_weight_loss:
      "減量",

    goal_heart_health:
      "心臓の健康を改善",

    goal_stress:
      "ストレスを減らす",

    goal_activity:
      "活動的に過ごす",

    goal_endurance:
      "持久力を高める",

    goal_history:
      "歴史を学ぶ",

    goal_culture:
      "新しい文化を探索",

    goal_competition:
      "友達と競う",

    goal_mental_wellness:
      "心の健康を改善",

    beginner:
      "🔵 初級",

    beginnerSubtitle:
      "Explorerコレクション",

    beginnerDescription:
      "Legathonを始めたばかりのメンバーに最適です。",

    moderate:
      "🔴 中級",

    moderateSubtitle:
      "Trailblazerコレクション",

    moderateDescription:
      "もう少し自分に挑戦したいメンバー向けです。",

    advanced:
      "🟢 上級",

    advancedSubtitle:
      "Pathfinderコレクション",

    advancedDescription:
      "より大きな目標を目指す経験豊富なウォーカー向けです。",

    legendary:
      "🟡 レジェンダリー",

    legendarySubtitle:
      "Longevityコレクション",

    legendaryDescription:
      "長期的なレガシーを築くことを目指すメンバー向けです。",

    elite:
      "⚫ エリート",

    eliteSubtitle:
      "Eliteコレクション",

    eliteDescription:
      "Legathon Walkで最も高い達成レベルです。",

    length_7_days:
      "⚡ クイックチャレンジ（7日間）",

    length_30_days:
      "🚶 標準ジャーニー（30日間）",

    length_60_90_days:
      "🌎 長期遠征（60〜90日間）",

    length_lifetime:
      "🏆 レジェンダリー長期ジャーニー",

    hide_faith:
      "信仰とスピリチュアル",

    hide_civil_rights:
      "公民権と自由運動",

    hide_african_history:
      "アフリカとディアスポラの歴史",

    hide_cause_based:
      "社会貢献ウォーク",

    hide_marathon:
      "マラソンチャレンジ",
  },

  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    personalize: "개인 설정",
    title: "나의 Legathon",

    subtitle:
      "관심 있는 여정과 경험을 선택하세요. Legathon Walk는 추측이 아닌 사용자의 관심사를 기반으로 추천합니다.",

    inspiresYou:
      "무엇에 관심이 있나요?",

    yourGoals:
      "목표는 무엇인가요?",

    challengeLevel:
      "도전 수준",

    journeyLength:
      "여정 기간",

    hideRecommendations:
      "추천에서 숨기기",

    hideDescription:
      "추천에서 보고 싶지 않은 카테고리를 선택하세요. 나중에 모든 여정을 직접 찾아볼 수 있습니다.",

    saveContinue:
      "저장하고 계속",

    savePreferences:
      "설정 저장",

    resetPreferences:
      "설정 초기화",

    skipForNow:
      "지금은 건너뛰기",

    notNow:
      "나중에",

    preferencesSaved:
      "설정 저장됨",

    preferencesSavedMessage:
      "이제 Legathon Walk 추천이 개인화됩니다.",

    saveError:
      "저장 오류",

    saveErrorMessage:
      "현재 설정을 저장할 수 없습니다.",

    preferencesReset:
      "설정 초기화됨",

    preferencesResetMessage:
      "여정 설정이 초기화되었습니다.",

    resetError:
      "초기화 오류",

    resetErrorMessage:
      "현재 설정을 초기화할 수 없습니다.",

    ok: "확인",

    civil_rights:
      "✊ 시민권과 자유 운동",

    african_history:
      "🌍 아프리카 및 아프리카 디아스포라 역사",

    world_wonders:
      "🌎 세계의 불가사의",

    ancient_civilizations:
      "🏛 고대 문명",

    nature:
      "🌳 자연과 모험",

    cities:
      "🏙 도시와 문화",

    faith:
      "🙏 신앙과 영적 여정",

    arts:
      "🎭 예술과 문학",

    wellness:
      "❤️ 건강과 웰니스",

    fitness:
      "🏃 피트니스와 지구력",

    marathon:
      "🏅 마라톤 도전",

    goal_weight_loss:
      "체중 감량",

    goal_heart_health:
      "심장 건강 향상",

    goal_stress:
      "스트레스 감소",

    goal_activity:
      "활동적으로 생활",

    goal_endurance:
      "지구력 향상",

    goal_history:
      "역사 배우기",

    goal_culture:
      "새로운 문화 탐험",

    goal_competition:
      "친구들과 경쟁",

    goal_mental_wellness:
      "정신 건강 향상",

    beginner:
      "🔵 초급",

    beginnerSubtitle:
      "Explorer 컬렉션",

    beginnerDescription:
      "Legathon 여정을 처음 시작하는 회원에게 적합합니다.",

    moderate:
      "🔴 중급",

    moderateSubtitle:
      "Trailblazer 컬렉션",

    moderateDescription:
      "조금 더 도전할 준비가 된 회원에게 적합합니다.",

    advanced:
      "🟢 고급",

    advancedSubtitle:
      "Pathfinder 컬렉션",

    advancedDescription:
      "더 큰 목표를 추구하는 경험 많은 워커를 위한 단계입니다.",

    legendary:
      "🟡 레전더리",

    legendarySubtitle:
      "Longevity 컬렉션",

    legendaryDescription:
      "지속적인 유산을 만들고자 하는 회원을 위한 단계입니다.",

    elite:
      "⚫ 엘리트",

    eliteSubtitle:
      "Elite 컬렉션",

    eliteDescription:
      "Legathon Walk에서 가장 높은 성취 단계입니다.",

    length_7_days:
      "⚡ 빠른 도전 (7일)",

    length_30_days:
      "🚶 표준 여정 (30일)",

    length_60_90_days:
      "🌎 장기 탐험 (60–90일)",

    length_lifetime:
      "🏆 레전더리 장기 여정",

    hide_faith:
      "신앙과 영성",

    hide_civil_rights:
      "시민권과 자유 운동",

    hide_african_history:
      "아프리카와 디아스포라 역사",

    hide_cause_based:
      "공익 걷기",

    hide_marathon:
      "마라톤 도전",
  },

  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    personalize: "个性化",
    title: "你的 Legathon",

    subtitle:
      "选择能够激励你的旅程和体验。Legathon Walk根据你的兴趣推荐，而不是根据假设。",

    inspiresYou:
      "什么最能激励你？",

    yourGoals:
      "你的目标是什么？",

    challengeLevel:
      "挑战等级",

    journeyLength:
      "旅程时长",

    hideRecommendations:
      "从推荐中隐藏",

    hideDescription:
      "选择你不希望在推荐中看到的类别。之后你仍然可以浏览所有旅程。",

    saveContinue:
      "保存并继续",

    savePreferences:
      "保存偏好",

    resetPreferences:
      "重置偏好",

    skipForNow:
      "暂时跳过",

    notNow:
      "暂不",

    preferencesSaved:
      "偏好已保存",

    preferencesSavedMessage:
      "你的Legathon Walk推荐现在将根据你的偏好进行个性化。",

    saveError:
      "保存错误",

    saveErrorMessage:
      "目前无法保存偏好设置。",

    preferencesReset:
      "偏好已重置",

    preferencesResetMessage:
      "你的旅程偏好已重置。",

    resetError:
      "重置错误",

    resetErrorMessage:
      "目前无法重置偏好设置。",

    ok: "确定",

    civil_rights:
      "✊ 民权与自由运动",

    african_history:
      "🌍 非洲及非洲侨民历史",

    world_wonders:
      "🌎 世界奇观",

    ancient_civilizations:
      "🏛 古代文明",

    nature:
      "🌳 自然与冒险",

    cities:
      "🏙 城市与文化",

    faith:
      "🙏 信仰与精神旅程",

    arts:
      "🎭 艺术与文学",

    wellness:
      "❤️ 健康与身心健康",

    fitness:
      "🏃 健身与耐力",

    marathon:
      "🏅 马拉松挑战",

    goal_weight_loss:
      "减轻体重",

    goal_heart_health:
      "改善心脏健康",

    goal_stress:
      "减轻压力",

    goal_activity:
      "保持活跃",

    goal_endurance:
      "提高耐力",

    goal_history:
      "学习历史",

    goal_culture:
      "探索新文化",

    goal_competition:
      "与朋友竞争",

    goal_mental_wellness:
      "改善心理健康",

    beginner:
      "🔵 初级",

    beginnerSubtitle:
      "Explorer 系列",

    beginnerDescription:
      "非常适合刚开始Legathon旅程的会员。",

    moderate:
      "🔴 中级",

    moderateSubtitle:
      "Trailblazer 系列",

    moderateDescription:
      "适合准备挑战自己的会员。",

    advanced:
      "🟢 高级",

    advancedSubtitle:
      "Pathfinder 系列",

    advancedDescription:
      "专为追求更高目标的有经验步行者设计。",

    legendary:
      "🟡 传奇",

    legendarySubtitle:
      "Longevity 系列",

    legendaryDescription:
      "适合致力于建立长久成就的会员。",

    elite:
      "⚫ 精英",

    eliteSubtitle:
      "Elite 系列",

    eliteDescription:
      "Legathon Walk的最高成就等级。",

    length_7_days:
      "⚡ 快速挑战（7天）",

    length_30_days:
      "🚶 标准旅程（30天）",

    length_60_90_days:
      "🌎 长期远征（60–90天）",

    length_lifetime:
      "🏆 传奇长期旅程",

    hide_faith:
      "信仰与精神",

    hide_civil_rights:
      "民权与自由运动",

    hide_african_history:
      "非洲及非洲侨民历史",

    hide_cause_based:
      "公益步行",

    hide_marathon:
      "马拉松挑战",
  },

  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    personalize: "PERSONALIZZA",
    title: "Il Tuo Legathon",

    subtitle:
      "Scegli i viaggi e le esperienze che ti ispirano. Legathon Walk consiglia in base ai tuoi interessi, non a supposizioni.",

    inspiresYou:
      "Cosa ti ispira?",

    yourGoals:
      "Quali sono i tuoi obiettivi?",

    challengeLevel:
      "Livello di Sfida",

    journeyLength:
      "Durata del Viaggio",

    hideRecommendations:
      "Nascondi dai Consigli",

    hideDescription:
      "Seleziona le categorie che preferisci non vedere nei consigli. Potrai comunque esplorare tutti i viaggi in seguito.",

    saveContinue:
      "Salva e Continua",

    savePreferences:
      "Salva Preferenze",

    resetPreferences:
      "Reimposta Preferenze",

    skipForNow:
      "Salta per Ora",

    notNow:
      "Non Ora",

    preferencesSaved:
      "Preferenze Salvate",

    preferencesSavedMessage:
      "I consigli Legathon Walk saranno ora personalizzati.",

    saveError:
      "Errore di Salvataggio",

    saveErrorMessage:
      "Impossibile salvare le preferenze in questo momento.",

    preferencesReset:
      "Preferenze Reimpostate",

    preferencesResetMessage:
      "Le preferenze di viaggio sono state reimpostate.",

    resetError:
      "Errore di Reimpostazione",

    resetErrorMessage:
      "Impossibile reimpostare le preferenze in questo momento.",

    ok: "OK",

    civil_rights:
      "✊ Diritti Civili e Movimenti per la Libertà",

    african_history:
      "🌍 Storia Africana e della Diaspora Africana",

    world_wonders:
      "🌎 Meraviglie del Mondo",

    ancient_civilizations:
      "🏛 Civiltà Antiche",

    nature:
      "🌳 Natura e Avventura",

    cities:
      "🏙 Città e Cultura",

    faith:
      "🙏 Fede e Viaggi Spirituali",

    arts:
      "🎭 Arte e Letteratura",

    wellness:
      "❤️ Salute e Benessere",

    fitness:
      "🏃 Fitness e Resistenza",

    marathon:
      "🏅 Sfide Maratona",

    goal_weight_loss:
      "Perdere Peso",

    goal_heart_health:
      "Migliorare la Salute del Cuore",

    goal_stress:
      "Ridurre lo Stress",

    goal_activity:
      "Rimanere Attivi",

    goal_endurance:
      "Aumentare la Resistenza",

    goal_history:
      "Imparare la Storia",

    goal_culture:
      "Esplorare Nuove Culture",

    goal_competition:
      "Competere con gli Amici",

    goal_mental_wellness:
      "Migliorare il Benessere Mentale",

    beginner:
      "🔵 Principiante",

    beginnerSubtitle:
      "Collezione Explorer",

    beginnerDescription:
      "Perfetto per chi sta iniziando il proprio viaggio Legathon.",

    moderate:
      "🔴 Moderato",

    moderateSubtitle:
      "Collezione Trailblazer",

    moderateDescription:
      "Per chi è pronto a mettersi alla prova.",

    advanced:
      "🟢 Avanzato",

    advancedSubtitle:
      "Collezione Pathfinder",

    advancedDescription:
      "Progettato per camminatori esperti con obiettivi più grandi.",

    legendary:
      "🟡 Leggendario",

    legendarySubtitle:
      "Collezione Longevità",

    legendaryDescription:
      "Per chi è impegnato a costruire un'eredità duratura.",

    elite:
      "⚫ Elite",

    eliteSubtitle:
      "Collezione Elite",

    eliteDescription:
      "Il livello più alto di successo Legathon Walk.",

    length_7_days:
      "⚡ Sfide Rapide (7 Giorni)",

    length_30_days:
      "🚶 Viaggi Standard (30 Giorni)",

    length_60_90_days:
      "🌎 Lunghe Spedizioni (60–90 Giorni)",

    length_lifetime:
      "🏆 Viaggi Leggendari a Lungo Termine",

    hide_faith:
      "Fede e Spiritualità",

    hide_civil_rights:
      "Diritti Civili e Movimenti per la Libertà",

    hide_african_history:
      "Storia Africana e Diaspora",

    hide_cause_based:
      "Camminate per una Causa",

    hide_marathon:
      "Sfide Maratona",
  },

  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    personalize: "تخصيص",
    title: "Legathon الخاص بك",

    subtitle:
      "اختر الرحلات والتجارب التي تلهمك. يقدم Legathon Walk التوصيات بناءً على اهتماماتك وليس على الافتراضات.",

    inspiresYou:
      "ما الذي يلهمك؟",

    yourGoals:
      "ما أهدافك؟",

    challengeLevel:
      "مستوى التحدي",

    journeyLength:
      "مدة الرحلة",

    hideRecommendations:
      "إخفاء من التوصيات",

    hideDescription:
      "حدد الفئات التي تفضل عدم رؤيتها في التوصيات. لا يزال بإمكانك استعراض جميع الرحلات لاحقًا.",

    saveContinue:
      "حفظ ومتابعة",

    savePreferences:
      "حفظ التفضيلات",

    resetPreferences:
      "إعادة ضبط التفضيلات",

    skipForNow:
      "تخطي الآن",

    notNow:
      "ليس الآن",

    preferencesSaved:
      "تم حفظ التفضيلات",

    preferencesSavedMessage:
      "سيتم الآن تخصيص توصيات Legathon Walk لك.",

    saveError:
      "خطأ في الحفظ",

    saveErrorMessage:
      "تعذر حفظ التفضيلات في الوقت الحالي.",

    preferencesReset:
      "تمت إعادة ضبط التفضيلات",

    preferencesResetMessage:
      "تمت إعادة ضبط تفضيلات الرحلات.",

    resetError:
      "خطأ في إعادة الضبط",

    resetErrorMessage:
      "تعذر إعادة ضبط التفضيلات في الوقت الحالي.",

    ok: "حسنًا",

    civil_rights:
      "✊ الحقوق المدنية وحركات الحرية",

    african_history:
      "🌍 التاريخ الأفريقي وتاريخ الشتات الأفريقي",

    world_wonders:
      "🌎 عجائب العالم",

    ancient_civilizations:
      "🏛 الحضارات القديمة",

    nature:
      "🌳 الطبيعة والمغامرة",

    cities:
      "🏙 المدن والثقافة",

    faith:
      "🙏 الإيمان والرحلات الروحية",

    arts:
      "🎭 الفنون والأدب",

    wellness:
      "❤️ الصحة والعافية",

    fitness:
      "🏃 اللياقة والتحمل",

    marathon:
      "🏅 تحديات الماراثون",

    goal_weight_loss:
      "فقدان الوزن",

    goal_heart_health:
      "تحسين صحة القلب",

    goal_stress:
      "تقليل التوتر",

    goal_activity:
      "البقاء نشطًا",

    goal_endurance:
      "زيادة القدرة على التحمل",

    goal_history:
      "تعلم التاريخ",

    goal_culture:
      "استكشاف ثقافات جديدة",

    goal_competition:
      "التنافس مع الأصدقاء",

    goal_mental_wellness:
      "تحسين الصحة النفسية",

    beginner:
      "🔵 مبتدئ",

    beginnerSubtitle:
      "مجموعة Explorer",

    beginnerDescription:
      "مثالي للأعضاء الذين يبدأون رحلة Legathon.",

    moderate:
      "🔴 متوسط",

    moderateSubtitle:
      "مجموعة Trailblazer",

    moderateDescription:
      "للأعضاء المستعدين لتحدي أنفسهم.",

    advanced:
      "🟢 متقدم",

    advancedSubtitle:
      "مجموعة Pathfinder",

    advancedDescription:
      "مصمم للمشاة ذوي الخبرة الذين يسعون لأهداف أكبر.",

    legendary:
      "🟡 أسطوري",

    legendarySubtitle:
      "مجموعة Longevity",

    legendaryDescription:
      "للأعضاء الملتزمين ببناء إرث دائم.",

    elite:
      "⚫ نخبة",

    eliteSubtitle:
      "مجموعة Elite",

    eliteDescription:
      "أعلى مستوى من الإنجاز في Legathon Walk.",

    length_7_days:
      "⚡ تحديات سريعة (7 أيام)",

    length_30_days:
      "🚶 رحلات قياسية (30 يومًا)",

    length_60_90_days:
      "🌎 رحلات طويلة (60–90 يومًا)",

    length_lifetime:
      "🏆 رحلات أسطورية طويلة الأمد",

    hide_faith:
      "الإيمان والروحانيات",

    hide_civil_rights:
      "الحقوق المدنية وحركات الحرية",

    hide_african_history:
      "التاريخ الأفريقي والشتات",

    hide_cause_based:
      "مسيرات القضايا المجتمعية",

    hide_marathon:
      "تحديات الماراثون",
  },
};

// ============================================================
// OPTION DATA
// IDs remain unchanged so stored preferences remain compatible.
// ============================================================

const INTERESTS = [
  "civil_rights",
  "african_history",
  "world_wonders",
  "ancient_civilizations",
  "nature",
  "cities",
  "faith",
  "arts",
  "wellness",
  "fitness",
  "marathon",
];

const GOALS = [
  "weight_loss",
  "heart_health",
  "stress",
  "activity",
  "endurance",
  "history",
  "culture",
  "competition",
  "mental_wellness",
];

const DIFFICULTY = [
  "beginner",
  "moderate",
  "advanced",
  "legendary",
  "elite",
];

const LENGTHS = [
  "7_days",
  "30_days",
  "60_90_days",
  "lifetime",
];

const HIDE_CATEGORIES = [
  "faith",
  "civil_rights",
  "african_history",
  "cause_based",
  "marathon",
];

// ============================================================
// TRANSLATION HELPER
// ============================================================

function getText(
  language,
  key
) {
  const local =
    TEXT?.[language]?.[key];

  if (local) {
    return local;
  }

  const central =
    translate(
      language,
      key
    );

  if (
    central !== key
  ) {
    return central;
  }

  return (
    TEXT.en?.[key] ||
    key
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function JourneyPreferencesScreen({
  language = "en",
  navigation,
  route,
  goBack,
  goToJourneys,
  goToSummary,
}) {
  const [
    interests,
    setInterests,
  ] = useState([]);

  const [
    goals,
    setGoals,
  ] = useState([]);

  const [
    difficulty,
    setDifficulty,
  ] = useState(
    "moderate"
  );

  const [
    preferredLength,
    setPreferredLength,
  ] = useState(
    "30_days"
  );

  const [
    hiddenCategories,
    setHiddenCategories,
  ] = useState([]);

  const fromOnboarding =
    route?.params
      ?.fromOnboarding ===
    true;

  function t(key) {
    return getText(
      language,
      key
    );
  }

  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences =
    async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            PREF_KEY
          );

        if (
          !saved
        ) {
          return;
        }

        const prefs =
          JSON.parse(
            saved
          );

        setInterests(
          prefs.interests ||
            []
        );

        setGoals(
          prefs.goals ||
            []
        );

        setDifficulty(
          prefs.difficulty ||
            "moderate"
        );

        setPreferredLength(
          prefs.preferredLength ||
            "30_days"
        );

        setHiddenCategories(
          prefs.hiddenCategories ||
            []
        );
      } catch (
        error
      ) {
        console.log(
          "Load preferences error:",
          error
        );
      }
    };

  // ==========================================================
  // MULTI SELECT
  // ==========================================================

  const toggleArrayValue = (
    value,
    list,
    setter
  ) => {
    if (
      list.includes(
        value
      )
    ) {
      setter(
        list.filter(
          item =>
            item !==
            value
        )
      );
    } else {
      setter([
        ...list,
        value,
      ]);
    }
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const savePreferences =
    async () => {
      const journeyPreferences = {
        interests,
        goals,
        difficulty,
        preferredLength,
        hiddenCategories,

        updatedAt:
          new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem(
          PREF_KEY,
          JSON.stringify(
            journeyPreferences
          )
        );

        Alert.alert(
          t(
            "preferencesSaved"
          ),

          t(
            "preferencesSavedMessage"
          ),

          [
            {
              text:
                t(
                  "ok"
                ),

              onPress:
                () => {
                  if (
                    typeof goToSummary ===
                    "function"
                  ) {
                    goToSummary();
                  } else if (
                    navigation?.navigate
                  ) {
                    navigation.navigate(
                      "PersonalizationSummary"
                    );
                  } else if (
                    typeof goBack ===
                    "function"
                  ) {
                    goBack();
                  }
                },
            },
          ]
        );
      } catch (
        error
      ) {
        console.log(
          "Save preferences error:",
          error
        );

        Alert.alert(
          t(
            "saveError"
          ),

          t(
            "saveErrorMessage"
          )
        );
      }
    };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetPreferences =
    async () => {
      try {
        await AsyncStorage.removeItem(
          PREF_KEY
        );

        setInterests(
          []
        );

        setGoals(
          []
        );

        setDifficulty(
          "moderate"
        );

        setPreferredLength(
          "30_days"
        );

        setHiddenCategories(
          []
        );

        Alert.alert(
          t(
            "preferencesReset"
          ),

          t(
            "preferencesResetMessage"
          )
        );
      } catch (
        error
      ) {
        console.log(
          "Reset preferences error:",
          error
        );

        Alert.alert(
          t(
            "resetError"
          ),

          t(
            "resetErrorMessage"
          )
        );
      }
    };

  // ==========================================================
  // SKIP
  // ==========================================================

  const skipScreen =
    () => {
      if (
        fromOnboarding
      ) {
        if (
          navigation?.navigate
        ) {
          navigation.navigate(
            "JourneySelection"
          );
        } else {
          goToJourneys?.();
        }
      } else {
        if (
          navigation?.goBack
        ) {
          navigation.goBack();
        } else {
          goBack?.();
        }
      }
    };

  // ==========================================================
  // MULTI OPTION
  // ==========================================================

  const renderMultiOption = (
    id,
    selectedList,
    setter,
    prefix = ""
  ) => {
    const selected =
      selectedList.includes(
        id
      );

    const key =
      prefix
        ? `${prefix}${id}`
        : id;

    return (
      <TouchableOpacity
        key={
          id
        }
        style={[
          styles.option,

          selected &&
            styles.optionSelected,
        ]}
        onPress={() =>
          toggleArrayValue(
            id,
            selectedList,
            setter
          )
        }
        activeOpacity={
          0.85
        }
      >
        <Text
          style={[
            styles.optionText,

            selected &&
              styles.optionTextSelected,
          ]}
        >
          {selected
            ? "✓ "
            : ""}

          {t(
            key
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  // ==========================================================
  // DIFFICULTY
  // ==========================================================

  const renderDifficultyOption =
    id => {
      const selected =
        difficulty ===
        id;

      return (
        <TouchableOpacity
          key={
            id
          }
          style={[
            styles.option,

            selected &&
              styles.optionSelected,
          ]}
          onPress={() =>
            setDifficulty(
              id
            )
          }
          activeOpacity={
            0.85
          }
        >
          <Text
            style={[
              styles.optionText,

              selected &&
                styles.optionTextSelected,
            ]}
          >
            {selected
              ? "✓ "
              : ""}

            {t(
              id
            )}
          </Text>

          <Text
            style={
              styles.optionSubText
            }
          >
            {t(
              `${id}Subtitle`
            )}
          </Text>

          <Text
            style={
              styles.optionDescription
            }
          >
            {t(
              `${id}Description`
            )}
          </Text>
        </TouchableOpacity>
      );
    };

  // ==========================================================
  // LENGTH
  // ==========================================================

  const renderLengthOption =
    id => {
      const selected =
        preferredLength ===
        id;

      return (
        <TouchableOpacity
          key={
            id
          }
          style={[
            styles.option,

            selected &&
              styles.optionSelected,
          ]}
          onPress={() =>
            setPreferredLength(
              id
            )
          }
          activeOpacity={
            0.85
          }
        >
          <Text
            style={[
              styles.optionText,

              selected &&
                styles.optionTextSelected,
            ]}
          >
            {selected
              ? "✓ "
              : ""}

            {t(
              `length_${id}`
            )}
          </Text>
        </TouchableOpacity>
      );
    };

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
      {/* HEADER */}

      <Text
        style={
          styles.small
        }
      >
        {t(
          "personalize"
        )}
      </Text>

      <Text
        style={
          styles.title
        }
        adjustsFontSizeToFit
        minimumFontScale={
          0.7
        }
      >
        {t(
          "title"
        )}
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        {t(
          "subtitle"
        )}
      </Text>

      {/* INTERESTS */}

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.cardTitle
          }
        >
          {t(
            "inspiresYou"
          )}
        </Text>

        {INTERESTS.map(
          id =>
            renderMultiOption(
              id,
              interests,
              setInterests
            )
        )}
      </View>

      {/* GOALS */}

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.cardTitle
          }
        >
          {t(
            "yourGoals"
          )}
        </Text>

        {GOALS.map(
          id =>
            renderMultiOption(
              id,
              goals,
              setGoals,
              "goal_"
            )
        )}
      </View>

      {/* DIFFICULTY */}

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.cardTitle
          }
        >
          {t(
            "challengeLevel"
          )}
        </Text>

        {DIFFICULTY.map(
          renderDifficultyOption
        )}
      </View>

      {/* JOURNEY LENGTH */}

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.cardTitle
          }
        >
          {t(
            "journeyLength"
          )}
        </Text>

        {LENGTHS.map(
          renderLengthOption
        )}
      </View>

      {/* HIDE FROM RECOMMENDATIONS */}

      <View
        style={
          styles.cardGold
        }
      >
        <Text
          style={
            styles.goldTitle
          }
        >
          {t(
            "hideRecommendations"
          )}
        </Text>

        <Text
          style={
            styles.goldSubtitle
          }
        >
          {t(
            "hideDescription"
          )}
        </Text>

        {HIDE_CATEGORIES.map(
          id =>
            renderMultiOption(
              id,
              hiddenCategories,
              setHiddenCategories,
              "hide_"
            )
        )}
      </View>

      {/* SAVE */}

      <TouchableOpacity
        style={
          styles.saveButton
        }
        onPress={
          savePreferences
        }
        activeOpacity={
          0.85
        }
      >
        <Text
          style={
            styles.saveText
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.75
          }
        >
          {fromOnboarding
            ? t(
                "saveContinue"
              )
            : t(
                "savePreferences"
              )}
        </Text>
      </TouchableOpacity>

      {/* RESET */}

      <TouchableOpacity
        style={
          styles.resetButton
        }
        onPress={
          resetPreferences
        }
        activeOpacity={
          0.85
        }
      >
        <Text
          style={
            styles.resetText
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.75
          }
        >
          {t(
            "resetPreferences"
          )}
        </Text>
      </TouchableOpacity>

      {/* SKIP */}

      <TouchableOpacity
        style={
          styles.skipButton
        }
        onPress={
          skipScreen
        }
        activeOpacity={
          0.85
        }
      >
        <Text
          style={
            styles.skipText
          }
          adjustsFontSizeToFit
          minimumFontScale={
            0.75
          }
        >
          {fromOnboarding
            ? t(
                "skipForNow"
              )
            : t(
                "notNow"
              )}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          height: 140,
        }}
      />
    </ScrollView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#05070C",
    },

    content: {
      padding: 18,
      paddingBottom: 160,
    },

    small: {
      color:
        "#D8A72E",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 4,
      marginTop: 18,
      marginBottom: 10,
    },

    title: {
      color:
        "#FFFFFF",
      fontSize: 52,
      fontWeight: "900",
      lineHeight: 58,
      marginBottom: 14,
    },

    subtitle: {
      color:
        "#AAB7CA",
      fontSize: 18,
      fontWeight: "700",
      lineHeight: 28,
      marginBottom: 22,
    },

    card: {
      backgroundColor:
        "#111318",
      borderColor:
        "#1F2A3D",
      borderWidth: 1,
      borderRadius: 28,
      padding: 18,
      marginBottom: 20,
    },

    cardGold: {
      backgroundColor:
        "#10100A",
      borderColor:
        "#D8A72E",
      borderWidth: 1.5,
      borderRadius: 28,
      padding: 18,
      marginBottom: 22,
    },

    cardTitle: {
      color:
        "#FFFFFF",
      fontSize: 25,
      lineHeight: 31,
      fontWeight: "900",
      marginBottom: 16,
    },

    goldTitle: {
      color:
        "#D8A72E",
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "900",
      marginBottom: 10,
    },

    goldSubtitle: {
      color:
        "#AAB7CA",
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 23,
      marginBottom: 14,
    },

    option: {
      backgroundColor:
        "#071224",
      borderColor:
        "#243A5E",
      borderWidth: 1,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      marginBottom: 10,
    },

    optionSelected: {
      backgroundColor:
        "#241D08",
      borderColor:
        "#D8A72E",
    },

    optionText: {
      color:
        "#DDE6F3",
      fontSize: 16,
      fontWeight: "800",
      lineHeight: 23,
    },

    optionTextSelected: {
      color:
        "#D8A72E",
    },

    optionSubText: {
      color:
        "#D8A72E",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 6,
    },

    optionDescription: {
      color:
        "#8FA1B8",
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 4,
    },

    saveButton: {
      minHeight: 58,
      backgroundColor:
        "#D8A72E",
      borderRadius: 999,
      paddingVertical: 17,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    saveText: {
      color:
        "#05070C",
      fontSize: 18,
      fontWeight: "900",
      textAlign: "center",
    },

    resetButton: {
      minHeight: 56,
      backgroundColor:
        "#1A0B0B",
      borderColor:
        "#FF5C5C",
      borderWidth: 1,
      borderRadius: 999,
      paddingVertical: 15,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    resetText: {
      color:
        "#FF5C5C",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },

    skipButton: {
      minHeight: 56,
      backgroundColor:
        "#0B1628",
      borderColor:
        "#243A5E",
      borderWidth: 1,
      borderRadius: 999,
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    skipText: {
      color:
        "#DDE6F3",
      fontSize: 17,
      fontWeight: "900",
      textAlign: "center",
    },
  });