// screens/SettingsScreen.js

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

const COLLAGE_BG = require(
  "../assets/collage-background.png"
);

// ============================================================
// STORAGE
// ============================================================

export const LEGATHON_SETTINGS_KEY =
  "LEGATHON_APP_SETTINGS_V1";

export const DEFAULT_LEGATHON_SETTINGS = {
  stepTracking: true,
  notifications: true,
  streakAlerts: true,
  rewardAlerts: true,
  privateProfile: false,
  darkMode: true,
  theme: "legathonBlack",
};

// ============================================================
// THEMES
// ============================================================

const THEMES = {
  legathonBlack: {
    labelKey: "themeLegathonBlack",
    accent: "#D4AF37",
    secondary: "#A7F3D0",
    background: "#02070D",
    card: "rgba(2,20,43,0.94)",
    border: "#123A68",
    text: "#FFFFFF",
    muted: "#AEB8CC",
  },

  romanGold: {
    labelKey: "themeRomanGold",
    accent: "#F4C542",
    secondary: "#FFE7A3",
    background: "#100B03",
    card: "rgba(40,27,6,0.95)",
    border: "#7A5715",
    text: "#FFF9E8",
    muted: "#D5C49C",
  },

  tokyoNeon: {
    labelKey: "themeTokyoNeon",
    accent: "#00E5FF",
    secondary: "#FF4FD8",
    background: "#030510",
    card: "rgba(11,13,43,0.95)",
    border: "#253D86",
    text: "#FFFFFF",
    muted: "#AEB8D8",
  },

  meccaEmerald: {
    labelKey: "themeMeccaEmerald",
    accent: "#42F5A1",
    secondary: "#E7C75E",
    background: "#02100B",
    card: "rgba(4,38,27,0.95)",
    border: "#176848",
    text: "#F3FFF9",
    muted: "#A8CDBD",
  },
};

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    saved: "✓ Saved",
    loadingSettings: "Loading settings...",

    settingsKicker: "LEGATHON SETTINGS",
    controlYourJourney: "Control Your\nJourney",

    account: "Account",
    profileInformation: "Profile Information",
    profileInformationSub:
      "Name, avatar, rank, and public profile",

    language: "Language",
    languageSub: "Choose your app language",

    healthPermissionsSection:
      "Health & Permissions",

    stepTracking: "Step Tracking",
    stepTrackingSub:
      "Connect walking activity to Legathon Walk",

    healthPermissions: "Health Permissions",
    healthPermissionsSub:
      "Manage Apple Health or Google Fit access",

    devicePermissions: "Device Permissions",
    devicePermissionsSub:
      "Motion, location, microphone, and notifications",

    notificationsSection: "Notifications",

    pushNotifications: "Push Notifications",
    pushNotificationsSub:
      "Journey reminders and important updates",

    streakAlerts: "Streak Alerts",
    streakAlertsSub:
      "Daily walking reminders",

    rewardAlerts: "Reward Alerts",
    rewardAlertsSub:
      "Checkpoint, stamp, badge, and reward updates",

    privacy: "Privacy",

    privateProfile: "Private Profile",
    privateProfileSub:
      "Hide your public walking stats and leaderboard profile",

    dataPrivacy: "Data & Privacy",
    dataPrivacySub:
      "Manage your activity and profile data",

    privacyPolicy: "Privacy Policy",
    privacyPolicySub:
      "Read Legathon Walk's privacy policy",

    appearance: "Appearance",

    darkMode: "Dark Mode",
    darkModeSub:
      "Use the premium dark interface",

    colorTheme: "COLOR THEME",

    themeLegathonBlack: "Legathon Black",
    themeRomanGold: "Roman Gold",
    themeTokyoNeon: "Tokyo Neon",
    themeMeccaEmerald: "Mecca Emerald",

    support: "Support",

    helpCenter: "Help Center",
    helpCenterSub: "FAQs and app support",

    contactSupport: "Contact Support",
    contactSupportSub:
      "Get help with your account",

    aboutLegathon: "About Legathon Walk",
    aboutLegathonSub:
      "App version, mission, and credits",

    logOut: "Log Out",

    version:
      "LEGATHON WALK • SETTINGS V1",

    settingsError: "Settings Error",
    settingsErrorMessage:
      "Your change could not be saved. Please try again.",

    permissionMessage:
      "Legathon Walk will open your device settings so you can manage this permission.",

    cancel: "Cancel",
    openSettings: "Open Settings",

    unableOpenSettings:
      "Unable to Open Settings",

    unableOpenSettingsMessage:
      "Open your phone Settings and select Legathon Walk.",

    logoutQuestion: "Log Out?",

    logoutMessage:
      "Your saved walking progress will remain connected to your account.",

    logoutNotConnected:
      "Logout Not Connected",

    logoutNotConnectedMessage:
      "Pass your existing logout function into SettingsScreen as onLogout.",
  },

  es: {
    back: "‹ Atrás",
    saved: "✓ Guardado",
    loadingSettings: "Cargando ajustes...",

    settingsKicker: "AJUSTES DE LEGATHON",
    controlYourJourney:
      "Controla tu\nrecorrido",

    account: "Cuenta",
    profileInformation:
      "Información del perfil",
    profileInformationSub:
      "Nombre, avatar, rango y perfil público",

    language: "Idioma",
    languageSub:
      "Elige el idioma de la aplicación",

    healthPermissionsSection:
      "Salud y permisos",

    stepTracking:
      "Seguimiento de pasos",
    stepTrackingSub:
      "Conecta tu actividad al caminar con Legathon Walk",

    healthPermissions:
      "Permisos de salud",
    healthPermissionsSub:
      "Administra el acceso a Apple Health o Google Fit",

    devicePermissions:
      "Permisos del dispositivo",
    devicePermissionsSub:
      "Movimiento, ubicación, micrófono y notificaciones",

    notificationsSection:
      "Notificaciones",

    pushNotifications:
      "Notificaciones push",
    pushNotificationsSub:
      "Recordatorios de recorridos y actualizaciones importantes",

    streakAlerts:
      "Alertas de racha",
    streakAlertsSub:
      "Recordatorios diarios para caminar",

    rewardAlerts:
      "Alertas de recompensas",
    rewardAlertsSub:
      "Actualizaciones de puntos de control, sellos, insignias y recompensas",

    privacy: "Privacidad",

    privateProfile:
      "Perfil privado",
    privateProfileSub:
      "Oculta tus estadísticas públicas y tu perfil de clasificación",

    dataPrivacy:
      "Datos y privacidad",
    dataPrivacySub:
      "Administra tus datos de actividad y perfil",

    privacyPolicy:
      "Política de privacidad",
    privacyPolicySub:
      "Lee la política de privacidad de Legathon Walk",

    appearance: "Apariencia",

    darkMode: "Modo oscuro",
    darkModeSub:
      "Usa la interfaz oscura premium",

    colorTheme: "TEMA DE COLOR",

    themeLegathonBlack:
      "Negro Legathon",
    themeRomanGold:
      "Oro Romano",
    themeTokyoNeon:
      "Neón de Tokio",
    themeMeccaEmerald:
      "Esmeralda de La Meca",

    support: "Soporte",

    helpCenter:
      "Centro de ayuda",
    helpCenterSub:
      "Preguntas frecuentes y soporte de la aplicación",

    contactSupport:
      "Contactar soporte",
    contactSupportSub:
      "Obtén ayuda con tu cuenta",

    aboutLegathon:
      "Acerca de Legathon Walk",
    aboutLegathonSub:
      "Versión, misión y créditos de la aplicación",

    logOut: "Cerrar sesión",

    version:
      "LEGATHON WALK • AJUSTES V1",

    settingsError:
      "Error de ajustes",
    settingsErrorMessage:
      "No se pudo guardar el cambio. Inténtalo de nuevo.",

    permissionMessage:
      "Legathon Walk abrirá los ajustes de tu dispositivo para que puedas administrar este permiso.",

    cancel: "Cancelar",
    openSettings:
      "Abrir ajustes",

    unableOpenSettings:
      "No se pueden abrir los ajustes",

    unableOpenSettingsMessage:
      "Abre los ajustes de tu teléfono y selecciona Legathon Walk.",

    logoutQuestion:
      "¿Cerrar sesión?",

    logoutMessage:
      "Tu progreso guardado seguirá conectado a tu cuenta.",

    logoutNotConnected:
      "Cierre de sesión no conectado",

    logoutNotConnectedMessage:
      "Pasa tu función de cierre de sesión existente a SettingsScreen como onLogout.",
  },

  fr: {
    back: "‹ Retour",
    saved: "✓ Enregistré",
    loadingSettings:
      "Chargement des paramètres...",

    settingsKicker:
      "PARAMÈTRES LEGATHON",
    controlYourJourney:
      "Contrôlez votre\nparcours",

    account: "Compte",
    profileInformation:
      "Informations du profil",
    profileInformationSub:
      "Nom, avatar, rang et profil public",

    language: "Langue",
    languageSub:
      "Choisissez la langue de l'application",

    healthPermissionsSection:
      "Santé et autorisations",

    stepTracking:
      "Suivi des pas",
    stepTrackingSub:
      "Connectez votre activité de marche à Legathon Walk",

    healthPermissions:
      "Autorisations santé",
    healthPermissionsSub:
      "Gérez l'accès à Apple Health ou Google Fit",

    devicePermissions:
      "Autorisations de l'appareil",
    devicePermissionsSub:
      "Mouvement, localisation, microphone et notifications",

    notificationsSection:
      "Notifications",

    pushNotifications:
      "Notifications push",
    pushNotificationsSub:
      "Rappels de parcours et mises à jour importantes",

    streakAlerts:
      "Alertes de série",
    streakAlertsSub:
      "Rappels quotidiens de marche",

    rewardAlerts:
      "Alertes de récompenses",
    rewardAlertsSub:
      "Mises à jour des checkpoints, tampons, badges et récompenses",

    privacy:
      "Confidentialité",

    privateProfile:
      "Profil privé",
    privateProfileSub:
      "Masquez vos statistiques publiques et votre profil de classement",

    dataPrivacy:
      "Données et confidentialité",
    dataPrivacySub:
      "Gérez vos données d'activité et de profil",

    privacyPolicy:
      "Politique de confidentialité",
    privacyPolicySub:
      "Consultez la politique de confidentialité de Legathon Walk",

    appearance: "Apparence",

    darkMode: "Mode sombre",
    darkModeSub:
      "Utilisez l'interface sombre premium",

    colorTheme:
      "THÈME DE COULEUR",

    themeLegathonBlack:
      "Noir Legathon",
    themeRomanGold:
      "Or Romain",
    themeTokyoNeon:
      "Néon Tokyo",
    themeMeccaEmerald:
      "Émeraude de La Mecque",

    support: "Assistance",

    helpCenter:
      "Centre d'aide",
    helpCenterSub:
      "FAQ et assistance de l'application",

    contactSupport:
      "Contacter l'assistance",
    contactSupportSub:
      "Obtenez de l'aide pour votre compte",

    aboutLegathon:
      "À propos de Legathon Walk",
    aboutLegathonSub:
      "Version de l'application, mission et crédits",

    logOut: "Se déconnecter",

    version:
      "LEGATHON WALK • PARAMÈTRES V1",

    settingsError:
      "Erreur de paramètres",
    settingsErrorMessage:
      "Votre modification n'a pas pu être enregistrée. Veuillez réessayer.",

    permissionMessage:
      "Legathon Walk ouvrira les paramètres de votre appareil afin que vous puissiez gérer cette autorisation.",

    cancel: "Annuler",
    openSettings:
      "Ouvrir les paramètres",

    unableOpenSettings:
      "Impossible d'ouvrir les paramètres",

    unableOpenSettingsMessage:
      "Ouvrez les paramètres de votre téléphone et sélectionnez Legathon Walk.",

    logoutQuestion:
      "Se déconnecter ?",

    logoutMessage:
      "Votre progression de marche enregistrée restera liée à votre compte.",

    logoutNotConnected:
      "Déconnexion non connectée",

    logoutNotConnectedMessage:
      "Transmettez votre fonction de déconnexion existante à SettingsScreen via onLogout.",
  },

  de: {
    back: "‹ Zurück",
    saved: "✓ Gespeichert",
    loadingSettings:
      "Einstellungen werden geladen...",

    settingsKicker:
      "LEGATHON EINSTELLUNGEN",
    controlYourJourney:
      "Steuere deine\nReise",

    account: "Konto",
    profileInformation:
      "Profilinformationen",
    profileInformationSub:
      "Name, Avatar, Rang und öffentliches Profil",

    language: "Sprache",
    languageSub:
      "Wähle deine App-Sprache",

    healthPermissionsSection:
      "Gesundheit & Berechtigungen",

    stepTracking:
      "Schrittaufzeichnung",
    stepTrackingSub:
      "Verbinde deine Gehaktivität mit Legathon Walk",

    healthPermissions:
      "Gesundheitsberechtigungen",
    healthPermissionsSub:
      "Apple Health- oder Google Fit-Zugriff verwalten",

    devicePermissions:
      "Geräteberechtigungen",
    devicePermissionsSub:
      "Bewegung, Standort, Mikrofon und Benachrichtigungen",

    notificationsSection:
      "Benachrichtigungen",

    pushNotifications:
      "Push-Benachrichtigungen",
    pushNotificationsSub:
      "Reiseerinnerungen und wichtige Updates",

    streakAlerts:
      "Serien-Benachrichtigungen",
    streakAlertsSub:
      "Tägliche Geherinnerungen",

    rewardAlerts:
      "Belohnungsbenachrichtigungen",
    rewardAlertsSub:
      "Updates zu Checkpoints, Stempeln, Abzeichen und Belohnungen",

    privacy: "Datenschutz",

    privateProfile:
      "Privates Profil",
    privateProfileSub:
      "Öffentliche Gehstatistiken und Ranglistenprofil ausblenden",

    dataPrivacy:
      "Daten & Datenschutz",
    dataPrivacySub:
      "Aktivitäts- und Profildaten verwalten",

    privacyPolicy:
      "Datenschutzrichtlinie",
    privacyPolicySub:
      "Lies die Datenschutzrichtlinie von Legathon Walk",

    appearance:
      "Darstellung",

    darkMode:
      "Dunkler Modus",
    darkModeSub:
      "Verwende die Premium-Dunkeloberfläche",

    colorTheme: "FARBTHEMA",

    themeLegathonBlack:
      "Legathon Schwarz",
    themeRomanGold:
      "Römisches Gold",
    themeTokyoNeon:
      "Tokyo Neon",
    themeMeccaEmerald:
      "Mekka Smaragd",

    support: "Support",

    helpCenter:
      "Hilfe-Center",
    helpCenterSub:
      "FAQs und App-Support",

    contactSupport:
      "Support kontaktieren",
    contactSupportSub:
      "Hilfe mit deinem Konto erhalten",

    aboutLegathon:
      "Über Legathon Walk",
    aboutLegathonSub:
      "App-Version, Mission und Mitwirkende",

    logOut: "Abmelden",

    version:
      "LEGATHON WALK • EINSTELLUNGEN V1",

    settingsError:
      "Einstellungsfehler",
    settingsErrorMessage:
      "Deine Änderung konnte nicht gespeichert werden. Bitte versuche es erneut.",

    permissionMessage:
      "Legathon Walk öffnet deine Geräteeinstellungen, damit du diese Berechtigung verwalten kannst.",

    cancel: "Abbrechen",
    openSettings:
      "Einstellungen öffnen",

    unableOpenSettings:
      "Einstellungen können nicht geöffnet werden",

    unableOpenSettingsMessage:
      "Öffne die Einstellungen deines Telefons und wähle Legathon Walk.",

    logoutQuestion:
      "Abmelden?",

    logoutMessage:
      "Dein gespeicherter Gehfortschritt bleibt mit deinem Konto verbunden.",

    logoutNotConnected:
      "Abmeldung nicht verbunden",

    logoutNotConnectedMessage:
      "Übergib deine bestehende Abmeldefunktion als onLogout an SettingsScreen.",
  },

  pt: {
    back: "‹ Voltar",
    saved: "✓ Salvo",
    loadingSettings:
      "Carregando configurações...",

    settingsKicker:
      "CONFIGURAÇÕES LEGATHON",
    controlYourJourney:
      "Controle sua\njornada",

    account: "Conta",
    profileInformation:
      "Informações do perfil",
    profileInformationSub:
      "Nome, avatar, classificação e perfil público",

    language: "Idioma",
    languageSub:
      "Escolha o idioma do aplicativo",

    healthPermissionsSection:
      "Saúde e permissões",

    stepTracking:
      "Rastreamento de passos",
    stepTrackingSub:
      "Conecte sua atividade de caminhada ao Legathon Walk",

    healthPermissions:
      "Permissões de saúde",
    healthPermissionsSub:
      "Gerencie o acesso ao Apple Health ou Google Fit",

    devicePermissions:
      "Permissões do dispositivo",
    devicePermissionsSub:
      "Movimento, localização, microfone e notificações",

    notificationsSection:
      "Notificações",

    pushNotifications:
      "Notificações push",
    pushNotificationsSub:
      "Lembretes de jornadas e atualizações importantes",

    streakAlerts:
      "Alertas de sequência",
    streakAlertsSub:
      "Lembretes diários de caminhada",

    rewardAlerts:
      "Alertas de recompensas",
    rewardAlertsSub:
      "Atualizações de checkpoints, selos, emblemas e recompensas",

    privacy: "Privacidade",

    privateProfile:
      "Perfil privado",
    privateProfileSub:
      "Oculte suas estatísticas públicas e perfil do ranking",

    dataPrivacy:
      "Dados e privacidade",
    dataPrivacySub:
      "Gerencie seus dados de atividade e perfil",

    privacyPolicy:
      "Política de privacidade",
    privacyPolicySub:
      "Leia a política de privacidade do Legathon Walk",

    appearance: "Aparência",

    darkMode: "Modo escuro",
    darkModeSub:
      "Use a interface escura premium",

    colorTheme: "TEMA DE COR",

    themeLegathonBlack:
      "Preto Legathon",
    themeRomanGold:
      "Ouro Romano",
    themeTokyoNeon:
      "Neon de Tóquio",
    themeMeccaEmerald:
      "Esmeralda de Meca",

    support: "Suporte",

    helpCenter:
      "Central de ajuda",
    helpCenterSub:
      "Perguntas frequentes e suporte do aplicativo",

    contactSupport:
      "Contatar suporte",
    contactSupportSub:
      "Obtenha ajuda com sua conta",

    aboutLegathon:
      "Sobre o Legathon Walk",
    aboutLegathonSub:
      "Versão do aplicativo, missão e créditos",

    logOut: "Sair",

    version:
      "LEGATHON WALK • CONFIGURAÇÕES V1",

    settingsError:
      "Erro nas configurações",
    settingsErrorMessage:
      "Sua alteração não pôde ser salva. Tente novamente.",

    permissionMessage:
      "O Legathon Walk abrirá as configurações do seu dispositivo para que você possa gerenciar esta permissão.",

    cancel: "Cancelar",
    openSettings:
      "Abrir configurações",

    unableOpenSettings:
      "Não foi possível abrir as configurações",

    unableOpenSettingsMessage:
      "Abra as configurações do telefone e selecione Legathon Walk.",

    logoutQuestion: "Sair?",

    logoutMessage:
      "Seu progresso de caminhada salvo permanecerá conectado à sua conta.",

    logoutNotConnected:
      "Logout não conectado",

    logoutNotConnectedMessage:
      "Passe sua função de logout existente para SettingsScreen como onLogout.",
  },

  ja: {
    back: "‹ 戻る",
    saved: "✓ 保存済み",
    loadingSettings:
      "設定を読み込んでいます...",

    settingsKicker:
      "LEGATHON 設定",
    controlYourJourney:
      "あなたの旅を\nコントロール",

    account: "アカウント",
    profileInformation:
      "プロフィール情報",
    profileInformationSub:
      "名前、アバター、ランク、公開プロフィール",

    language: "言語",
    languageSub:
      "アプリの言語を選択",

    healthPermissionsSection:
      "ヘルスケアと権限",

    stepTracking:
      "歩数トラッキング",
    stepTrackingSub:
      "歩行アクティビティをLegathon Walkに接続",

    healthPermissions:
      "ヘルスケア権限",
    healthPermissionsSub:
      "Apple HealthまたはGoogle Fitへのアクセスを管理",

    devicePermissions:
      "デバイス権限",
    devicePermissionsSub:
      "モーション、位置情報、マイク、通知を管理",

    notificationsSection:
      "通知",

    pushNotifications:
      "プッシュ通知",
    pushNotificationsSub:
      "Journeyのリマインダーと重要なお知らせ",

    streakAlerts:
      "連続記録アラート",
    streakAlertsSub:
      "毎日のウォーキングリマインダー",

    rewardAlerts:
      "リワード通知",
    rewardAlertsSub:
      "チェックポイント、スタンプ、バッジ、リワードの更新",

    privacy:
      "プライバシー",

    privateProfile:
      "非公開プロフィール",
    privateProfileSub:
      "公開歩行データとランキングプロフィールを非表示",

    dataPrivacy:
      "データとプライバシー",
    dataPrivacySub:
      "アクティビティとプロフィールデータを管理",

    privacyPolicy:
      "プライバシーポリシー",
    privacyPolicySub:
      "Legathon Walkのプライバシーポリシーを読む",

    appearance: "外観",

    darkMode:
      "ダークモード",
    darkModeSub:
      "プレミアムダークインターフェースを使用",

    colorTheme:
      "カラーテーマ",

    themeLegathonBlack:
      "Legathon ブラック",
    themeRomanGold:
      "ローマン ゴールド",
    themeTokyoNeon:
      "東京ネオン",
    themeMeccaEmerald:
      "メッカ エメラルド",

    support: "サポート",

    helpCenter:
      "ヘルプセンター",
    helpCenterSub:
      "よくある質問とアプリサポート",

    contactSupport:
      "サポートに連絡",
    contactSupportSub:
      "アカウントに関するサポートを受ける",

    aboutLegathon:
      "Legathon Walkについて",
    aboutLegathonSub:
      "アプリのバージョン、ミッション、クレジット",

    logOut: "ログアウト",

    version:
      "LEGATHON WALK • 設定 V1",

    settingsError:
      "設定エラー",
    settingsErrorMessage:
      "変更を保存できませんでした。もう一度お試しください。",

    permissionMessage:
      "この権限を管理するため、Legathon Walkがデバイス設定を開きます。",

    cancel: "キャンセル",
    openSettings: "設定を開く",

    unableOpenSettings:
      "設定を開けません",

    unableOpenSettingsMessage:
      "端末の設定を開き、Legathon Walkを選択してください。",

    logoutQuestion:
      "ログアウトしますか？",

    logoutMessage:
      "保存された歩行進捗はアカウントに接続されたままになります。",

    logoutNotConnected:
      "ログアウトが接続されていません",

    logoutNotConnectedMessage:
      "既存のログアウト関数をonLogoutとしてSettingsScreenに渡してください。",
  },

  ko: {
    back: "‹ 뒤로",
    saved: "✓ 저장됨",
    loadingSettings:
      "설정을 불러오는 중...",

    settingsKicker:
      "LEGATHON 설정",
    controlYourJourney:
      "나의 여정을\n관리하세요",

    account: "계정",
    profileInformation:
      "프로필 정보",
    profileInformationSub:
      "이름, 아바타, 랭크 및 공개 프로필",

    language: "언어",
    languageSub:
      "앱 언어 선택",

    healthPermissionsSection:
      "건강 및 권한",

    stepTracking:
      "걸음 수 추적",
    stepTrackingSub:
      "걷기 활동을 Legathon Walk에 연결",

    healthPermissions:
      "건강 권한",
    healthPermissionsSub:
      "Apple Health 또는 Google Fit 접근 관리",

    devicePermissions:
      "기기 권한",
    devicePermissionsSub:
      "동작, 위치, 마이크 및 알림 관리",

    notificationsSection:
      "알림",

    pushNotifications:
      "푸시 알림",
    pushNotificationsSub:
      "Journey 알림 및 중요 업데이트",

    streakAlerts:
      "연속 기록 알림",
    streakAlertsSub:
      "매일 걷기 알림",

    rewardAlerts:
      "리워드 알림",
    rewardAlertsSub:
      "체크포인트, 스탬프, 배지 및 리워드 업데이트",

    privacy: "개인정보",

    privateProfile:
      "비공개 프로필",
    privateProfileSub:
      "공개 걷기 통계 및 리더보드 프로필 숨기기",

    dataPrivacy:
      "데이터 및 개인정보",
    dataPrivacySub:
      "활동 및 프로필 데이터 관리",

    privacyPolicy:
      "개인정보 처리방침",
    privacyPolicySub:
      "Legathon Walk 개인정보 처리방침 보기",

    appearance: "화면 설정",

    darkMode: "다크 모드",
    darkModeSub:
      "프리미엄 다크 인터페이스 사용",

    colorTheme: "색상 테마",

    themeLegathonBlack:
      "Legathon 블랙",
    themeRomanGold:
      "로마 골드",
    themeTokyoNeon:
      "도쿄 네온",
    themeMeccaEmerald:
      "메카 에메랄드",

    support: "지원",

    helpCenter:
      "도움말 센터",
    helpCenterSub:
      "FAQ 및 앱 지원",

    contactSupport:
      "지원팀 문의",
    contactSupportSub:
      "계정 관련 도움 받기",

    aboutLegathon:
      "Legathon Walk 정보",
    aboutLegathonSub:
      "앱 버전, 미션 및 크레딧",

    logOut: "로그아웃",

    version:
      "LEGATHON WALK • 설정 V1",

    settingsError:
      "설정 오류",
    settingsErrorMessage:
      "변경 사항을 저장할 수 없습니다. 다시 시도해 주세요.",

    permissionMessage:
      "이 권한을 관리할 수 있도록 Legathon Walk가 기기 설정을 엽니다.",

    cancel: "취소",
    openSettings: "설정 열기",

    unableOpenSettings:
      "설정을 열 수 없습니다",

    unableOpenSettingsMessage:
      "휴대폰 설정을 열고 Legathon Walk를 선택하세요.",

    logoutQuestion:
      "로그아웃하시겠습니까?",

    logoutMessage:
      "저장된 걷기 진행 상황은 계정에 계속 연결됩니다.",

    logoutNotConnected:
      "로그아웃이 연결되지 않았습니다",

    logoutNotConnectedMessage:
      "기존 로그아웃 함수를 onLogout으로 SettingsScreen에 전달하세요.",
  },

  zh: {
    back: "‹ 返回",
    saved: "✓ 已保存",
    loadingSettings:
      "正在加载设置...",

    settingsKicker:
      "LEGATHON 设置",
    controlYourJourney:
      "掌控你的\n旅程",

    account: "账户",
    profileInformation:
      "个人资料",
    profileInformationSub:
      "姓名、头像、等级和公开资料",

    language: "语言",
    languageSub:
      "选择应用语言",

    healthPermissionsSection:
      "健康与权限",

    stepTracking:
      "步数追踪",
    stepTrackingSub:
      "将步行活动连接到 Legathon Walk",

    healthPermissions:
      "健康权限",
    healthPermissionsSub:
      "管理 Apple Health 或 Google Fit 访问权限",

    devicePermissions:
      "设备权限",
    devicePermissionsSub:
      "管理运动、位置、麦克风和通知权限",

    notificationsSection:
      "通知",

    pushNotifications:
      "推送通知",
    pushNotificationsSub:
      "旅程提醒和重要更新",

    streakAlerts:
      "连续记录提醒",
    streakAlertsSub:
      "每日步行提醒",

    rewardAlerts:
      "奖励提醒",
    rewardAlertsSub:
      "检查点、印章、徽章和奖励更新",

    privacy: "隐私",

    privateProfile:
      "私人资料",
    privateProfileSub:
      "隐藏你的公开步行统计和排行榜资料",

    dataPrivacy:
      "数据与隐私",
    dataPrivacySub:
      "管理你的活动和个人资料数据",

    privacyPolicy:
      "隐私政策",
    privacyPolicySub:
      "阅读 Legathon Walk 隐私政策",

    appearance: "外观",

    darkMode: "深色模式",
    darkModeSub:
      "使用高级深色界面",

    colorTheme: "颜色主题",

    themeLegathonBlack:
      "Legathon 黑色",
    themeRomanGold:
      "罗马金",
    themeTokyoNeon:
      "东京霓虹",
    themeMeccaEmerald:
      "麦加翡翠",

    support: "支持",

    helpCenter:
      "帮助中心",
    helpCenterSub:
      "常见问题和应用支持",

    contactSupport:
      "联系支持",
    contactSupportSub:
      "获取账户帮助",

    aboutLegathon:
      "关于 Legathon Walk",
    aboutLegathonSub:
      "应用版本、使命和制作信息",

    logOut: "退出登录",

    version:
      "LEGATHON WALK • 设置 V1",

    settingsError:
      "设置错误",
    settingsErrorMessage:
      "无法保存你的更改。请重试。",

    permissionMessage:
      "Legathon Walk 将打开设备设置，以便你管理此权限。",

    cancel: "取消",
    openSettings: "打开设置",

    unableOpenSettings:
      "无法打开设置",

    unableOpenSettingsMessage:
      "打开手机设置并选择 Legathon Walk。",

    logoutQuestion:
      "退出登录？",

    logoutMessage:
      "你保存的步行进度仍会与你的账户保持关联。",

    logoutNotConnected:
      "退出功能尚未连接",

    logoutNotConnectedMessage:
      "请将现有的退出登录函数作为 onLogout 传入 SettingsScreen。",
  },

  it: {
    back: "‹ Indietro",
    saved: "✓ Salvato",
    loadingSettings:
      "Caricamento impostazioni...",

    settingsKicker:
      "IMPOSTAZIONI LEGATHON",
    controlYourJourney:
      "Controlla il tuo\npercorso",

    account: "Account",
    profileInformation:
      "Informazioni profilo",
    profileInformationSub:
      "Nome, avatar, grado e profilo pubblico",

    language: "Lingua",
    languageSub:
      "Scegli la lingua dell'app",

    healthPermissionsSection:
      "Salute e autorizzazioni",

    stepTracking:
      "Monitoraggio passi",
    stepTrackingSub:
      "Collega la tua attività di camminata a Legathon Walk",

    healthPermissions:
      "Autorizzazioni salute",
    healthPermissionsSub:
      "Gestisci l'accesso ad Apple Health o Google Fit",

    devicePermissions:
      "Autorizzazioni dispositivo",
    devicePermissionsSub:
      "Movimento, posizione, microfono e notifiche",

    notificationsSection:
      "Notifiche",

    pushNotifications:
      "Notifiche push",
    pushNotificationsSub:
      "Promemoria dei percorsi e aggiornamenti importanti",

    streakAlerts:
      "Avvisi serie",
    streakAlertsSub:
      "Promemoria giornalieri per camminare",

    rewardAlerts:
      "Avvisi ricompense",
    rewardAlertsSub:
      "Aggiornamenti su checkpoint, timbri, badge e ricompense",

    privacy: "Privacy",

    privateProfile:
      "Profilo privato",
    privateProfileSub:
      "Nascondi statistiche pubbliche e profilo classifica",

    dataPrivacy:
      "Dati e privacy",
    dataPrivacySub:
      "Gestisci i dati delle attività e del profilo",

    privacyPolicy:
      "Informativa sulla privacy",
    privacyPolicySub:
      "Leggi l'informativa sulla privacy di Legathon Walk",

    appearance: "Aspetto",

    darkMode: "Modalità scura",
    darkModeSub:
      "Usa l'interfaccia scura premium",

    colorTheme: "TEMA COLORE",

    themeLegathonBlack:
      "Nero Legathon",
    themeRomanGold:
      "Oro Romano",
    themeTokyoNeon:
      "Neon Tokyo",
    themeMeccaEmerald:
      "Smeraldo Mecca",

    support: "Supporto",

    helpCenter:
      "Centro assistenza",
    helpCenterSub:
      "FAQ e supporto dell'app",

    contactSupport:
      "Contatta il supporto",
    contactSupportSub:
      "Ricevi assistenza per il tuo account",

    aboutLegathon:
      "Informazioni su Legathon Walk",
    aboutLegathonSub:
      "Versione dell'app, missione e crediti",

    logOut: "Esci",

    version:
      "LEGATHON WALK • IMPOSTAZIONI V1",

    settingsError:
      "Errore impostazioni",
    settingsErrorMessage:
      "La modifica non è stata salvata. Riprova.",

    permissionMessage:
      "Legathon Walk aprirà le impostazioni del dispositivo per consentirti di gestire questa autorizzazione.",

    cancel: "Annulla",
    openSettings:
      "Apri impostazioni",

    unableOpenSettings:
      "Impossibile aprire le impostazioni",

    unableOpenSettingsMessage:
      "Apri le impostazioni del telefono e seleziona Legathon Walk.",

    logoutQuestion:
      "Vuoi uscire?",

    logoutMessage:
      "I progressi di camminata salvati resteranno collegati al tuo account.",

    logoutNotConnected:
      "Logout non collegato",

    logoutNotConnectedMessage:
      "Passa la funzione di logout esistente a SettingsScreen come onLogout.",
  },

  ar: {
    back: "رجوع ›",
    saved: "✓ تم الحفظ",
    loadingSettings:
      "جارٍ تحميل الإعدادات...",

    settingsKicker:
      "إعدادات LEGATHON",
    controlYourJourney:
      "تحكم في\nرحلتك",

    account: "الحساب",
    profileInformation:
      "معلومات الملف الشخصي",
    profileInformationSub:
      "الاسم والصورة الرمزية والرتبة والملف العام",

    language: "اللغة",
    languageSub:
      "اختر لغة التطبيق",

    healthPermissionsSection:
      "الصحة والأذونات",

    stepTracking:
      "تتبع الخطوات",
    stepTrackingSub:
      "اربط نشاط المشي بتطبيق Legathon Walk",

    healthPermissions:
      "أذونات الصحة",
    healthPermissionsSub:
      "إدارة الوصول إلى Apple Health أو Google Fit",

    devicePermissions:
      "أذونات الجهاز",
    devicePermissionsSub:
      "الحركة والموقع والميكروفون والإشعارات",

    notificationsSection:
      "الإشعارات",

    pushNotifications:
      "الإشعارات الفورية",
    pushNotificationsSub:
      "تذكيرات الرحلات والتحديثات المهمة",

    streakAlerts:
      "تنبيهات الاستمرارية",
    streakAlertsSub:
      "تذكيرات المشي اليومية",

    rewardAlerts:
      "تنبيهات المكافآت",
    rewardAlertsSub:
      "تحديثات نقاط التحقق والطوابع والشارات والمكافآت",

    privacy: "الخصوصية",

    privateProfile:
      "ملف شخصي خاص",
    privateProfileSub:
      "إخفاء إحصاءات المشي العامة وملف لوحة المتصدرين",

    dataPrivacy:
      "البيانات والخصوصية",
    dataPrivacySub:
      "إدارة بيانات النشاط والملف الشخصي",

    privacyPolicy:
      "سياسة الخصوصية",
    privacyPolicySub:
      "اقرأ سياسة خصوصية Legathon Walk",

    appearance: "المظهر",

    darkMode:
      "الوضع الداكن",
    darkModeSub:
      "استخدم الواجهة الداكنة المميزة",

    colorTheme: "سمة الألوان",

    themeLegathonBlack:
      "Legathon الأسود",
    themeRomanGold:
      "الذهبي الروماني",
    themeTokyoNeon:
      "نيون طوكيو",
    themeMeccaEmerald:
      "زمرد مكة",

    support: "الدعم",

    helpCenter:
      "مركز المساعدة",
    helpCenterSub:
      "الأسئلة الشائعة ودعم التطبيق",

    contactSupport:
      "اتصل بالدعم",
    contactSupportSub:
      "احصل على مساعدة بشأن حسابك",

    aboutLegathon:
      "حول Legathon Walk",
    aboutLegathonSub:
      "إصدار التطبيق والرسالة والاعتمادات",

    logOut: "تسجيل الخروج",

    version:
      "LEGATHON WALK • الإعدادات V1",

    settingsError:
      "خطأ في الإعدادات",
    settingsErrorMessage:
      "تعذر حفظ التغيير. يرجى المحاولة مرة أخرى.",

    permissionMessage:
      "سيفتح Legathon Walk إعدادات جهازك حتى تتمكن من إدارة هذا الإذن.",

    cancel: "إلغاء",
    openSettings:
      "فتح الإعدادات",

    unableOpenSettings:
      "تعذر فتح الإعدادات",

    unableOpenSettingsMessage:
      "افتح إعدادات هاتفك واختر Legathon Walk.",

    logoutQuestion:
      "تسجيل الخروج؟",

    logoutMessage:
      "سيظل تقدم المشي المحفوظ مرتبطًا بحسابك.",

    logoutNotConnected:
      "تسجيل الخروج غير متصل",

    logoutNotConnectedMessage:
      "مرّر دالة تسجيل الخروج الحالية إلى SettingsScreen باسم onLogout.",
  },
};

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(
    language || "en"
  )
    .toLowerCase()
    .split("-")[0];

  return TEXT[code]
    ? code
    : "en";
}

// ============================================================
// SETTINGS HELPERS
// ============================================================

function safeBoolean(
  value,
  fallback
) {
  return typeof value ===
    "boolean"
    ? value
    : fallback;
}

function normalizeSettings(value) {
  const saved =
    value &&
    typeof value ===
      "object"
      ? value
      : {};

  const selectedTheme =
    typeof saved.theme ===
      "string" &&
    THEMES[saved.theme]
      ? saved.theme
      : DEFAULT_LEGATHON_SETTINGS
          .theme;

  return {
    stepTracking:
      safeBoolean(
        saved.stepTracking,
        DEFAULT_LEGATHON_SETTINGS
          .stepTracking
      ),

    notifications:
      safeBoolean(
        saved.notifications,
        DEFAULT_LEGATHON_SETTINGS
          .notifications
      ),

    streakAlerts:
      safeBoolean(
        saved.streakAlerts,
        DEFAULT_LEGATHON_SETTINGS
          .streakAlerts
      ),

    rewardAlerts:
      safeBoolean(
        saved.rewardAlerts,
        DEFAULT_LEGATHON_SETTINGS
          .rewardAlerts
      ),

    privateProfile:
      safeBoolean(
        saved.privateProfile,
        DEFAULT_LEGATHON_SETTINGS
          .privateProfile
      ),

    darkMode:
      safeBoolean(
        saved.darkMode,
        DEFAULT_LEGATHON_SETTINGS
          .darkMode
      ),

    theme:
      selectedTheme,
  };
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function SettingsScreen({
  language = "en",

  goBack,
  goToProfile,
  goToLanguage,
  goToPrivacy,
  goToAbout,
  goToHelpCenter,
  goToContactSupport,

  onLogout,
  onSettingsChanged,
}) {
  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";

  const t = key =>
    TEXT?.[languageCode]?.[
      key
    ] ||
    TEXT?.en?.[key] ||
    key;

  const [
    settings,
    setSettings,
  ] = useState(
    DEFAULT_LEGATHON_SETTINGS
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const selectedTheme =
    THEMES[settings.theme] ||
    THEMES.legathonBlack;

  const colors =
    useMemo(() => {
      if (
        settings.darkMode
      ) {
        return selectedTheme;
      }

      return {
        ...selectedTheme,

        background:
          "#EEF3F8",

        card:
          "rgba(255,255,255,0.96)",

        border:
          "#C5D2E0",

        text:
          "#07111F",

        muted:
          "#536276",
      };
    }, [
      selectedTheme,
      settings.darkMode,
    ]);

  const styles =
    useMemo(
      () =>
        createStyles(
          colors
        ),
      [colors]
    );

  const rtlText =
    isRTL
      ? styles.rtlText
      : null;

  // ==========================================================
  // LOAD SETTINGS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const saved =
          await AsyncStorage.getItem(
            LEGATHON_SETTINGS_KEY
          );

        if (!mounted) {
          return;
        }

        if (saved) {
          setSettings(
            normalizeSettings(
              JSON.parse(
                saved
              )
            )
          );
        }
      } catch (error) {
        console.log(
          "Settings load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  async function persistSettings(
    nextSettings
  ) {
    setSaving(true);

    try {
      await AsyncStorage.multiSet([
        [
          LEGATHON_SETTINGS_KEY,
          JSON.stringify(
            nextSettings
          ),
        ],

        [
          "LEGATHON_STEP_TRACKING_ENABLED",
          String(
            nextSettings
              .stepTracking
          ),
        ],

        [
          "LEGATHON_NOTIFICATIONS_ENABLED",
          String(
            nextSettings
              .notifications
          ),
        ],

        [
          "LEGATHON_PRIVATE_PROFILE",
          String(
            nextSettings
              .privateProfile
          ),
        ],

        [
          "LEGATHON_DARK_MODE",
          String(
            nextSettings
              .darkMode
          ),
        ],

        [
          "LEGATHON_THEME",
          nextSettings.theme,
        ],
      ]);

      if (
        typeof onSettingsChanged ===
        "function"
      ) {
        onSettingsChanged(
          nextSettings
        );
      }
    } catch (error) {
      console.log(
        "Settings save error:",
        error
      );

      Alert.alert(
        t("settingsError"),
        t(
          "settingsErrorMessage"
        )
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // UPDATE SETTING
  // ==========================================================

  function updateSetting(
    key,
    value
  ) {
    const nextSettings = {
      ...settings,
      [key]: value,
    };

    if (
      key ===
        "notifications" &&
      value === false
    ) {
      nextSettings.streakAlerts =
        false;

      nextSettings.rewardAlerts =
        false;
    }

    setSettings(
      nextSettings
    );

    persistSettings(
      nextSettings
    );
  }

  // ==========================================================
  // DEVICE SETTINGS
  // ==========================================================

  function openDeviceSettings(
    title
  ) {
    Alert.alert(
      title,
      t(
        "permissionMessage"
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
            t(
              "openSettings"
            ),

          onPress:
            async () => {
              try {
                await Linking.openSettings();
              } catch {
                Alert.alert(
                  t(
                    "unableOpenSettings"
                  ),

                  t(
                    "unableOpenSettingsMessage"
                  )
                );
              }
            },
        },
      ]
    );
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================

  function handleLogout() {
    Alert.alert(
      t("logoutQuestion"),
      t("logoutMessage"),
      [
        {
          text:
            t("cancel"),

          style:
            "cancel",
        },

        {
          text:
            t("logOut"),

          style:
            "destructive",

          onPress:
            async () => {
              if (
                typeof onLogout ===
                "function"
              ) {
                await onLogout();

                return;
              }

              Alert.alert(
                t(
                  "logoutNotConnected"
                ),

                t(
                  "logoutNotConnectedMessage"
                )
              );
            },
        },
      ]
    );
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.loadingScreen
        }
      >
        <ActivityIndicator
          size="large"
          color={
            colors.accent
          }
        />

        <Text
          style={[
            styles.loadingText,
            rtlText,
          ]}
        >
          {t(
            "loadingSettings"
          )}
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // SCREEN
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
            {/* =============================================== */}
            {/* TOP ROW */}
            {/* =============================================== */}

            <View
              style={[
                styles.topRow,

                isRTL &&
                  styles.rowRTL,
              ]}
            >
              {goBack ? (
                <TouchableOpacity
                  style={
                    styles.backButton
                  }
                  onPress={
                    goBack
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Text
                    style={[
                      styles.backText,
                      rtlText,
                    ]}
                  >
                    {t("back")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              <View
                style={
                  styles.saveStatus
                }
              >
                {saving ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      colors.accent
                    }
                  />
                ) : (
                  <Text
                    style={[
                      styles.saveStatusText,
                      rtlText,
                    ]}
                  >
                    {t(
                      "saved"
                    )}
                  </Text>
                )}
              </View>
            </View>

            {/* =============================================== */}
            {/* HEADER */}
            {/* =============================================== */}

            <Text
              style={[
                styles.kicker,
                rtlText,
              ]}
            >
              {t(
                "settingsKicker"
              )}
            </Text>

            <Text
              style={[
                styles.title,
                rtlText,
              ]}
            >
              {t(
                "controlYourJourney"
              )}
            </Text>

            {/* =============================================== */}
            {/* ACCOUNT */}
            {/* =============================================== */}

            <Section
              title={t(
                "account"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <SettingRow
                icon="👤"
                title={t(
                  "profileInformation"
                )}
                subtitle={t(
                  "profileInformationSub"
                )}
                onPress={
                  goToProfile
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="🌎"
                title={t(
                  "language"
                )}
                subtitle={t(
                  "languageSub"
                )}
                onPress={
                  goToLanguage
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />
            </Section>

            {/* =============================================== */}
            {/* HEALTH */}
            {/* =============================================== */}

            <Section
              title={t(
                "healthPermissionsSection"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <ToggleRow
                icon="👟"
                title={t(
                  "stepTracking"
                )}
                subtitle={t(
                  "stepTrackingSub"
                )}
                value={
                  settings.stepTracking
                }
                onValueChange={value =>
                  updateSetting(
                    "stepTracking",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="❤️"
                title={t(
                  "healthPermissions"
                )}
                subtitle={t(
                  "healthPermissionsSub"
                )}
                onPress={() =>
                  openDeviceSettings(
                    t(
                      "healthPermissions"
                    )
                  )
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="📱"
                title={t(
                  "devicePermissions"
                )}
                subtitle={t(
                  "devicePermissionsSub"
                )}
                onPress={() =>
                  openDeviceSettings(
                    t(
                      "devicePermissions"
                    )
                  )
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />
            </Section>

            {/* =============================================== */}
            {/* NOTIFICATIONS */}
            {/* =============================================== */}

            <Section
              title={t(
                "notificationsSection"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <ToggleRow
                icon="🔔"
                title={t(
                  "pushNotifications"
                )}
                subtitle={t(
                  "pushNotificationsSub"
                )}
                value={
                  settings.notifications
                }
                onValueChange={value =>
                  updateSetting(
                    "notifications",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <ToggleRow
                icon="🔥"
                title={t(
                  "streakAlerts"
                )}
                subtitle={t(
                  "streakAlertsSub"
                )}
                value={
                  settings.streakAlerts
                }
                disabled={
                  !settings.notifications
                }
                onValueChange={value =>
                  updateSetting(
                    "streakAlerts",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <ToggleRow
                icon="🏅"
                title={t(
                  "rewardAlerts"
                )}
                subtitle={t(
                  "rewardAlertsSub"
                )}
                value={
                  settings.rewardAlerts
                }
                disabled={
                  !settings.notifications
                }
                onValueChange={value =>
                  updateSetting(
                    "rewardAlerts",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />
            </Section>

            {/* =============================================== */}
            {/* PRIVACY */}
            {/* =============================================== */}

            <Section
              title={t(
                "privacy"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <ToggleRow
                icon="🔒"
                title={t(
                  "privateProfile"
                )}
                subtitle={t(
                  "privateProfileSub"
                )}
                value={
                  settings.privateProfile
                }
                onValueChange={value =>
                  updateSetting(
                    "privateProfile",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="🛡️"
                title={t(
                  "dataPrivacy"
                )}
                subtitle={t(
                  "dataPrivacySub"
                )}
                onPress={
                  goToPrivacy
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="📄"
                title={t(
                  "privacyPolicy"
                )}
                subtitle={t(
                  "privacyPolicySub"
                )}
                onPress={
                  goToPrivacy
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />
            </Section>

            {/* =============================================== */}
            {/* APPEARANCE */}
            {/* =============================================== */}

            <Section
              title={t(
                "appearance"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <ToggleRow
                icon="🌙"
                title={t(
                  "darkMode"
                )}
                subtitle={t(
                  "darkModeSub"
                )}
                value={
                  settings.darkMode
                }
                onValueChange={value =>
                  updateSetting(
                    "darkMode",
                    value
                  )
                }
                colors={
                  colors
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />

              <Text
                style={[
                  styles.themeLabel,
                  rtlText,
                ]}
              >
                {t(
                  "colorTheme"
                )}
              </Text>

              <View
                style={[
                  styles.themeGrid,

                  isRTL &&
                    styles.themeGridRTL,
                ]}
              >
                {Object.entries(
                  THEMES
                ).map(
                  ([
                    themeId,
                    theme,
                  ]) => (
                    <ThemePill
                      key={
                        themeId
                      }
                      label={t(
                        theme.labelKey
                      )}
                      color={
                        theme.accent
                      }
                      active={
                        settings.theme ===
                        themeId
                      }
                      onPress={() =>
                        updateSetting(
                          "theme",
                          themeId
                        )
                      }
                      styles={
                        styles
                      }
                      isRTL={
                        isRTL
                      }
                    />
                  )
                )}
              </View>
            </Section>

            {/* =============================================== */}
            {/* SUPPORT */}
            {/* =============================================== */}

            <Section
              title={t(
                "support"
              )}
              styles={
                styles
              }
              isRTL={
                isRTL
              }
            >
              <SettingRow
                icon="❓"
                title={t(
                  "helpCenter"
                )}
                subtitle={t(
                  "helpCenterSub"
                )}
                onPress={
                  goToHelpCenter
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="💬"
                title={t(
                  "contactSupport"
                )}
                subtitle={t(
                  "contactSupportSub"
                )}
                onPress={
                  goToContactSupport
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
              />

              <SettingRow
                icon="ℹ️"
                title={t(
                  "aboutLegathon"
                )}
                subtitle={t(
                  "aboutLegathonSub"
                )}
                onPress={
                  goToAbout
                }
                styles={
                  styles
                }
                isRTL={
                  isRTL
                }
                last
              />
            </Section>

            {/* =============================================== */}
            {/* LOGOUT */}
            {/* =============================================== */}

            <TouchableOpacity
              style={
                styles.logoutButton
              }
              onPress={
                handleLogout
              }
              activeOpacity={
                0.8
              }
            >
              <Text
                style={[
                  styles.logoutText,
                  rtlText,
                ]}
              >
                {t("logOut")}
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.versionText,

                isRTL &&
                  styles.rtlCenter,
              ]}
            >
              {t("version")}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

// ============================================================
// SECTION
// ============================================================

function Section({
  title,
  children,
  styles,
  isRTL = false,
}) {
  return (
    <View
      style={
        styles.section
      }
    >
      <Text
        style={[
          styles.sectionTitle,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {title}
      </Text>

      <View
        style={
          styles.divider
        }
      />

      {children}
    </View>
  );
}

// ============================================================
// SETTING ROW
// ============================================================

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  styles,
  last = false,
  isRTL = false,
}) {
  const enabled =
    typeof onPress ===
    "function";

  return (
    <TouchableOpacity
      style={[
        styles.row,

        isRTL &&
          styles.rowRTL,

        last &&
          styles.rowLast,

        !enabled &&
          styles.rowDisabled,
      ]}
      onPress={
        onPress
      }
      disabled={
        !enabled
      }
      activeOpacity={
        0.8
      }
    >
      <Text
        style={[
          styles.rowIcon,

          isRTL &&
            styles.rowIconRTL,
        ]}
      >
        {icon}
      </Text>

      <View
        style={[
          styles.rowTextWrap,

          isRTL &&
            styles.rowTextWrapRTL,
        ]}
      >
        <Text
          style={[
            styles.rowTitle,

            isRTL &&
              styles.rtlText,
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={[
              styles.rowSubtitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {enabled && (
        <Text
          style={
            styles.chevron
          }
        >
          {isRTL
            ? "‹"
            : "›"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================================
// TOGGLE ROW
// ============================================================

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  colors,
  styles,
  disabled = false,
  last = false,
  isRTL = false,
}) {
  return (
    <View
      style={[
        styles.row,

        isRTL &&
          styles.rowRTL,

        last &&
          styles.rowLast,

        disabled &&
          styles.rowDisabled,
      ]}
    >
      <Text
        style={[
          styles.rowIcon,

          isRTL &&
            styles.rowIconRTL,
        ]}
      >
        {icon}
      </Text>

      <View
        style={[
          styles.rowTextWrap,

          isRTL &&
            styles.rowTextWrapRTL,
        ]}
      >
        <Text
          style={[
            styles.rowTitle,

            isRTL &&
              styles.rtlText,
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={[
              styles.rowSubtitle,

              isRTL &&
                styles.rtlText,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        disabled={
          disabled
        }
        trackColor={{
          false:
            "#5C6678",

          true:
            colors.accent,
        }}
        thumbColor=
          "#F6F2E8"
        ios_backgroundColor=
          "#5C6678"
      />
    </View>
  );
}

// ============================================================
// THEME PILL
// ============================================================

function ThemePill({
  label,
  color,
  active,
  onPress,
  styles,
  isRTL = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.themePill,

        isRTL &&
          styles.rowRTL,

        active &&
          styles.themePillActive,

        active && {
          borderColor:
            color,
        },
      ]}
      onPress={
        onPress
      }
      activeOpacity={
        0.8
      }
    >
      <View
        style={[
          styles.themeDot,

          isRTL &&
            styles.themeDotRTL,

          {
            backgroundColor:
              color,
          },
        ]}
      />

      <Text
        style={[
          styles.themeText,

          active &&
            styles.themeTextActive,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// STYLES
// ============================================================

function createStyles(
  colors
) {
  return StyleSheet.create({
    loadingScreen: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.background,
    },

    loadingText: {
      color:
        colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginTop: 14,
    },

    background: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    backgroundImage: {
      opacity: 0.26,
    },

    overlay: {
      flex: 1,
      backgroundColor:
        settingsOverlay(
          colors
        ),
    },

    safe: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 140,
    },

    topRow: {
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 26,
    },

    rowRTL: {
      flexDirection:
        "row-reverse",
    },

    rtlText: {
      writingDirection:
        "rtl",
      textAlign:
        "right",
    },

    rtlCenter: {
      writingDirection:
        "rtl",
      textAlign:
        "center",
    },

    backButton: {
      borderWidth: 2,
      borderColor:
        colors.accent,
      borderRadius: 28,
      paddingVertical: 11,
      paddingHorizontal: 22,
    },

    backText: {
      color:
        colors.accent,
      fontSize: 20,
      fontWeight: "900",
    },

    saveStatus: {
      minWidth: 70,
      minHeight: 36,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius: 18,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      paddingHorizontal: 12,
    },

    saveStatusText: {
      color:
        colors.secondary,
      fontSize: 12,
      fontWeight: "900",
    },

    kicker: {
      color:
        colors.accent,
      fontSize: 15,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 12,
    },

    title: {
      color:
        colors.text,
      fontSize: 46,
      lineHeight: 52,
      fontWeight: "900",
      marginBottom: 26,
    },

    section: {
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 28,
      padding: 18,
      marginBottom: 20,
    },

    sectionTitle: {
      color:
        colors.text,
      fontSize: 27,
      fontWeight: "900",
      marginBottom: 14,
    },

    divider: {
      height: 1,
      backgroundColor:
        colors.border,
      opacity: 0.7,
      marginBottom: 4,
    },

    row: {
      minHeight: 86,
      flexDirection: "row",
      alignItems:
        "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor:
        colors.border,
    },

    rowLast: {
      borderBottomWidth: 0,
    },

    rowDisabled: {
      opacity: 0.48,
    },

    rowIcon: {
      width: 52,
      fontSize: 29,
      marginRight: 10,
    },

    rowIconRTL: {
      marginRight: 0,
      marginLeft: 10,
      textAlign: "right",
    },

    rowTextWrap: {
      flex: 1,
      paddingRight: 8,
    },

    rowTextWrapRTL: {
      paddingRight: 0,
      paddingLeft: 8,
    },

    rowTitle: {
      color:
        colors.text,
      fontSize: 20,
      fontWeight: "900",
    },

    rowSubtitle: {
      color:
        colors.muted,
      fontSize: 14,
      fontWeight: "700",
      marginTop: 5,
      lineHeight: 20,
    },

    chevron: {
      color:
        colors.accent,
      fontSize: 42,
      fontWeight: "900",
      marginHorizontal: 8,
    },

    themeLabel: {
      color:
        colors.muted,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2,
      marginTop: 18,
      marginBottom: 12,
    },

    themeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    themeGridRTL: {
      flexDirection:
        "row-reverse",
    },

    themePill: {
      flexDirection: "row",
      alignItems:
        "center",
      borderWidth: 1.5,
      borderColor:
        colors.border,
      borderRadius: 24,
      paddingVertical: 11,
      paddingHorizontal: 14,
    },

    themePillActive: {
      backgroundColor:
        colors.background,
    },

    themeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },

    themeDotRTL: {
      marginRight: 0,
      marginLeft: 8,
    },

    themeText: {
      color:
        colors.muted,
      fontSize: 14,
      fontWeight: "900",
    },

    themeTextActive: {
      color:
        colors.text,
    },

    logoutButton: {
      borderWidth: 1.5,
      borderColor:
        "#FF5A66",
      backgroundColor:
        "rgba(255,0,0,0.12)",
      borderRadius: 28,
      paddingVertical: 18,
      alignItems:
        "center",
      marginTop: 8,
    },

    logoutText: {
      color:
        "#FF7B86",
      fontSize: 21,
      fontWeight: "900",
    },

    versionText: {
      color:
        colors.muted,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 2,
      textAlign: "center",
      marginTop: 26,
    },
  });
}

// ============================================================
// BACKGROUND OVERLAY
// ============================================================

function settingsOverlay(
  colors
) {
  return colors.background ===
    "#EEF3F8"
    ? "rgba(238,243,248,0.86)"
    : "rgba(0,0,0,0.68)";
}