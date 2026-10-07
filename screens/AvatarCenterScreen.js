// screens/AvatarCenterScreen.js

import React from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { avatarOptions } from "../data/avatarOptions";

import { TRACKSUIT_TIERS } from "../utils/tracksuitConfig";

import {
  getTracksuitProgress,
  canUserEquipTracksuit,
} from "../utils/tracksuitProgress";

import {
  getCurrentAvatarVisual,
  getTracksuitVisual,
} from "../utils/avatarVisualResolver";

import {
  getCurrentAvatarSuit,
  setCurrentAvatarSuit,
  getAvatarWardrobeState,
  syncAvatarSuitFromLifetimeSteps,
} from "../utils/avatarWardrobeStorage";

import { translate } from "../i18n/i18n";

// ============================================================
// LEGATHON WALK — AVATAR CENTER
// MULTILINGUAL VERSION
//
// Supported:
// en, es, fr, de, pt, ja, ko, zh, it, ar
//
// IMPORTANT:
// This screen NEVER adds steps.
// It only reads lifetimeSteps.
// ============================================================


// ============================================================
// TRANSLATIONS
// ============================================================

const AVATAR_TRANSLATIONS = {
  en: {
    back: "Back",

    basic: "BASIC",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Avatar Center",
    subtitle: "Your Journey. Your Progress. Your Avatar.",

    yourAvatar: "YOUR AVATAR",
    avatar: "Avatar",

    wearing: "Wearing {suit}",
    defaultOutfit: "Default Outfit",
    updatingOutfit: "Updating outfit…",
    normalFallback: "Normal avatar fallback active",

    lifetimeSteps: "JOURNEY LIFETIME STEPS",
    marathonNote:
      "Marathon steps do not advance tracksuit progression.",

    nextUnlock: "Next Legathon Unlock",
    allTracksuitsUnlocked: "All Tracksuits Unlocked",
    stepsRemaining: "{steps} steps remaining",
    allMilestones:
      "Every tracksuit milestone has been completed.",

    changeAvatar: "Change Avatar",
    changeAvatarSubtitle: "Choose your avatar style and age",

    editName: "Edit Name",
    editNameSubtitle: "Update your avatar display name",

    avatarShowcase: "Your Avatar Showcase",
    collection: "Collection",
    active: "ACTIVE",

    wardrobeUnlocks: "Wardrobe Unlocks",
    premiumWardrobe: "Premium Wardrobe",
    premiumWardrobeMessage:
      "Tracksuits are available to Premium and Elite members. Your Journey Lifetime Steps continue to accumulate.",

    walkAdditional:
      "Walk {steps} additional Journey Steps",
    unlocksAt:
      "Unlocks at {steps} lifetime steps",

    milestoneCompleted: "Walking milestone completed",

    locked: "Locked",
    wearingButton: "Wearing",
    wearSuit: "Wear Suit",

    wearDefaultOutfit: "Wear Default Outfit",

    tracksuitLocked: "Tracksuit Locked",
    lifetimeRemaining:
      "{steps} Journey Lifetime Steps remaining.",

    premiumRequired: "Premium Required",
    premiumRequiredMessage:
      "Blue, Green, Red, and Yellow tracksuits are available to Premium and Elite members.",

    eliteRequired: "Elite Required",
    eliteRequiredMessage:
      "The Black & Gold Elite Tracksuit is available to Elite members.",

    tracksuitUnavailable: "Tracksuit Unavailable",
    tracksuitUnavailableMessage:
      "This tracksuit cannot be equipped yet.",

    tracksuitEquipped: "Tracksuit Equipped",
    nowWearing: "{suit} is now being worn.",

    unableToEquip: "Unable to Equip",
    unableToEquipMessage:
      "The tracksuit could not be equipped.",

    editAvatarName: "Edit Avatar Name",
    editIphoneOnly:
      "Avatar name editing is currently available on iPhone.",
    enterNewName: "Enter a new avatar name.",

    rookie: "Rookie",
    explorer: "Explorer",
    trailblazer: "Trailblazer",
    pathfinder: "Pathfinder",
    legend: "Legend",
    eliteLegend: "Elite Legend",
  },

  es: {
    back: "Atrás",

    basic: "BÁSICO",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Centro de Avatar",
    subtitle: "Tu viaje. Tu progreso. Tu avatar.",

    yourAvatar: "TU AVATAR",
    avatar: "Avatar",

    wearing: "Usando {suit}",
    defaultOutfit: "Atuendo predeterminado",
    updatingOutfit: "Actualizando atuendo…",
    normalFallback: "Avatar normal activo",

    lifetimeSteps: "PASOS TOTALES DE VIAJES",
    marathonNote:
      "Los pasos de maratón no avanzan el progreso de los conjuntos.",

    nextUnlock: "Próximo desbloqueo Legathon",
    allTracksuitsUnlocked: "Todos los conjuntos desbloqueados",
    stepsRemaining: "Faltan {steps} pasos",
    allMilestones:
      "Has completado todos los hitos de los conjuntos.",

    changeAvatar: "Cambiar avatar",
    changeAvatarSubtitle:
      "Elige el estilo y la edad de tu avatar",

    editName: "Editar nombre",
    editNameSubtitle:
      "Actualiza el nombre de tu avatar",

    avatarShowcase: "Tu colección de avatares",
    collection: "Colección",
    active: "ACTIVO",

    wardrobeUnlocks: "Desbloqueos de vestuario",
    premiumWardrobe: "Vestuario Premium",
    premiumWardrobeMessage:
      "Los conjuntos están disponibles para miembros Premium y Elite. Tus pasos totales de viaje continúan acumulándose.",

    walkAdditional:
      "Camina {steps} pasos adicionales de viaje",
    unlocksAt:
      "Se desbloquea con {steps} pasos totales",

    milestoneCompleted: "Hito de caminata completado",

    locked: "Bloqueado",
    wearingButton: "Usando",
    wearSuit: "Usar conjunto",

    wearDefaultOutfit: "Usar atuendo predeterminado",

    tracksuitLocked: "Conjunto bloqueado",
    lifetimeRemaining:
      "Faltan {steps} pasos totales de viaje.",

    premiumRequired: "Se requiere Premium",
    premiumRequiredMessage:
      "Los conjuntos azul, verde, rojo y amarillo están disponibles para miembros Premium y Elite.",

    eliteRequired: "Se requiere Elite",
    eliteRequiredMessage:
      "El conjunto Elite negro y dorado está disponible para miembros Elite.",

    tracksuitUnavailable: "Conjunto no disponible",
    tracksuitUnavailableMessage:
      "Este conjunto aún no se puede usar.",

    tracksuitEquipped: "Conjunto equipado",
    nowWearing: "Ahora estás usando {suit}.",

    unableToEquip: "No se puede equipar",
    unableToEquipMessage:
      "No se pudo equipar el conjunto.",

    editAvatarName: "Editar nombre del avatar",
    editIphoneOnly:
      "La edición del nombre del avatar está disponible actualmente en iPhone.",
    enterNewName: "Ingresa un nuevo nombre.",

    rookie: "Principiante",
    explorer: "Explorador",
    trailblazer: "Pionero",
    pathfinder: "Descubridor",
    legend: "Leyenda",
    eliteLegend: "Leyenda Elite",
  },

  fr: {
    back: "Retour",

    basic: "BASIQUE",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Centre d'Avatar",
    subtitle: "Votre voyage. Vos progrès. Votre avatar.",

    yourAvatar: "VOTRE AVATAR",
    avatar: "Avatar",

    wearing: "Porte {suit}",
    defaultOutfit: "Tenue par défaut",
    updatingOutfit: "Mise à jour de la tenue…",
    normalFallback: "Avatar normal actif",

    lifetimeSteps: "PAS CUMULÉS DES VOYAGES",
    marathonNote:
      "Les pas de marathon ne font pas progresser les survêtements.",

    nextUnlock: "Prochain déblocage Legathon",
    allTracksuitsUnlocked: "Tous les survêtements débloqués",
    stepsRemaining: "{steps} pas restants",
    allMilestones:
      "Tous les paliers de survêtement sont terminés.",

    changeAvatar: "Changer d'avatar",
    changeAvatarSubtitle:
      "Choisissez le style et l'âge de votre avatar",

    editName: "Modifier le nom",
    editNameSubtitle:
      "Modifiez le nom affiché de votre avatar",

    avatarShowcase: "Votre collection d'avatars",
    collection: "Collection",
    active: "ACTIF",

    wardrobeUnlocks: "Déblocages de garde-robe",
    premiumWardrobe: "Garde-robe Premium",
    premiumWardrobeMessage:
      "Les survêtements sont disponibles pour les membres Premium et Elite. Vos pas cumulés de voyage continuent de s'accumuler.",

    walkAdditional:
      "Marchez {steps} pas de voyage supplémentaires",
    unlocksAt:
      "Se débloque à {steps} pas cumulés",

    milestoneCompleted: "Palier de marche atteint",

    locked: "Verrouillé",
    wearingButton: "Porté",
    wearSuit: "Porter",

    wearDefaultOutfit: "Porter la tenue par défaut",

    tracksuitLocked: "Survêtement verrouillé",
    lifetimeRemaining:
      "{steps} pas cumulés de voyage restants.",

    premiumRequired: "Premium requis",
    premiumRequiredMessage:
      "Les survêtements bleu, vert, rouge et jaune sont disponibles pour les membres Premium et Elite.",

    eliteRequired: "Elite requis",
    eliteRequiredMessage:
      "Le survêtement Elite noir et or est réservé aux membres Elite.",

    tracksuitUnavailable: "Survêtement indisponible",
    tracksuitUnavailableMessage:
      "Ce survêtement ne peut pas encore être équipé.",

    tracksuitEquipped: "Survêtement équipé",
    nowWearing: "{suit} est maintenant porté.",

    unableToEquip: "Impossible d'équiper",
    unableToEquipMessage:
      "Le survêtement n'a pas pu être équipé.",

    editAvatarName: "Modifier le nom de l'avatar",
    editIphoneOnly:
      "La modification du nom de l'avatar est actuellement disponible sur iPhone.",
    enterNewName: "Entrez un nouveau nom d'avatar.",

    rookie: "Débutant",
    explorer: "Explorateur",
    trailblazer: "Pionnier",
    pathfinder: "Éclaireur",
    legend: "Légende",
    eliteLegend: "Légende Elite",
  },

  de: {
    back: "Zurück",

    basic: "BASIS",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Avatar-Zentrum",
    subtitle: "Deine Reise. Dein Fortschritt. Dein Avatar.",

    yourAvatar: "DEIN AVATAR",
    avatar: "Avatar",

    wearing: "Trägt {suit}",
    defaultOutfit: "Standard-Outfit",
    updatingOutfit: "Outfit wird aktualisiert…",
    normalFallback: "Standard-Avatar aktiv",

    lifetimeSteps: "LEBENSLANGE REISESCHRITTE",
    marathonNote:
      "Marathonschritte zählen nicht zum Trainingsanzug-Fortschritt.",

    nextUnlock: "Nächste Legathon-Freischaltung",
    allTracksuitsUnlocked: "Alle Trainingsanzüge freigeschaltet",
    stepsRemaining: "Noch {steps} Schritte",
    allMilestones:
      "Alle Trainingsanzug-Meilensteine wurden abgeschlossen.",

    changeAvatar: "Avatar ändern",
    changeAvatarSubtitle:
      "Wähle Stil und Alter deines Avatars",

    editName: "Name bearbeiten",
    editNameSubtitle:
      "Ändere den Anzeigenamen deines Avatars",

    avatarShowcase: "Deine Avatar-Sammlung",
    collection: "Sammlung",
    active: "AKTIV",

    wardrobeUnlocks: "Garderobe freischalten",
    premiumWardrobe: "Premium-Garderobe",
    premiumWardrobeMessage:
      "Trainingsanzüge sind für Premium- und Elite-Mitglieder verfügbar. Deine lebenslangen Reiseschritte werden weiterhin gesammelt.",

    walkAdditional:
      "Gehe {steps} zusätzliche Reiseschritte",
    unlocksAt:
      "Freischaltung bei {steps} Gesamtschritten",

    milestoneCompleted: "Lauf-Meilenstein erreicht",

    locked: "Gesperrt",
    wearingButton: "Getragen",
    wearSuit: "Anziehen",

    wearDefaultOutfit: "Standard-Outfit tragen",

    tracksuitLocked: "Trainingsanzug gesperrt",
    lifetimeRemaining:
      "Noch {steps} lebenslange Reiseschritte.",

    premiumRequired: "Premium erforderlich",
    premiumRequiredMessage:
      "Blaue, grüne, rote und gelbe Trainingsanzüge sind für Premium- und Elite-Mitglieder verfügbar.",

    eliteRequired: "Elite erforderlich",
    eliteRequiredMessage:
      "Der schwarz-goldene Elite-Trainingsanzug ist Elite-Mitgliedern vorbehalten.",

    tracksuitUnavailable: "Trainingsanzug nicht verfügbar",
    tracksuitUnavailableMessage:
      "Dieser Trainingsanzug kann noch nicht getragen werden.",

    tracksuitEquipped: "Trainingsanzug angezogen",
    nowWearing: "{suit} wird jetzt getragen.",

    unableToEquip: "Anziehen nicht möglich",
    unableToEquipMessage:
      "Der Trainingsanzug konnte nicht angezogen werden.",

    editAvatarName: "Avatar-Namen bearbeiten",
    editIphoneOnly:
      "Das Bearbeiten des Avatar-Namens ist derzeit auf dem iPhone verfügbar.",
    enterNewName: "Gib einen neuen Avatar-Namen ein.",

    rookie: "Anfänger",
    explorer: "Entdecker",
    trailblazer: "Wegbereiter",
    pathfinder: "Pfadfinder",
    legend: "Legende",
    eliteLegend: "Elite-Legende",
  },

  pt: {
    back: "Voltar",

    basic: "BÁSICO",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Central de Avatar",
    subtitle: "Sua jornada. Seu progresso. Seu avatar.",

    yourAvatar: "SEU AVATAR",
    avatar: "Avatar",

    wearing: "Usando {suit}",
    defaultOutfit: "Roupa padrão",
    updatingOutfit: "Atualizando roupa…",
    normalFallback: "Avatar normal ativo",

    lifetimeSteps: "PASSOS TOTAIS DE JORNADA",
    marathonNote:
      "Passos de maratona não avançam o progresso dos agasalhos.",

    nextUnlock: "Próximo desbloqueio Legathon",
    allTracksuitsUnlocked: "Todos os agasalhos desbloqueados",
    stepsRemaining: "Faltam {steps} passos",
    allMilestones:
      "Todos os marcos de agasalho foram concluídos.",

    changeAvatar: "Alterar avatar",
    changeAvatarSubtitle:
      "Escolha o estilo e a idade do seu avatar",

    editName: "Editar nome",
    editNameSubtitle:
      "Atualize o nome exibido do seu avatar",

    avatarShowcase: "Sua coleção de avatares",
    collection: "Coleção",
    active: "ATIVO",

    wardrobeUnlocks: "Desbloqueios do guarda-roupa",
    premiumWardrobe: "Guarda-roupa Premium",
    premiumWardrobeMessage:
      "Os agasalhos estão disponíveis para membros Premium e Elite. Seus passos totais de jornada continuam acumulando.",

    walkAdditional:
      "Caminhe mais {steps} passos de jornada",
    unlocksAt:
      "Desbloqueia com {steps} passos totais",

    milestoneCompleted: "Marco de caminhada concluído",

    locked: "Bloqueado",
    wearingButton: "Usando",
    wearSuit: "Usar agasalho",

    wearDefaultOutfit: "Usar roupa padrão",

    tracksuitLocked: "Agasalho bloqueado",
    lifetimeRemaining:
      "Faltam {steps} passos totais de jornada.",

    premiumRequired: "Premium necessário",
    premiumRequiredMessage:
      "Os agasalhos azul, verde, vermelho e amarelo estão disponíveis para membros Premium e Elite.",

    eliteRequired: "Elite necessário",
    eliteRequiredMessage:
      "O agasalho Elite preto e dourado está disponível para membros Elite.",

    tracksuitUnavailable: "Agasalho indisponível",
    tracksuitUnavailableMessage:
      "Este agasalho ainda não pode ser usado.",

    tracksuitEquipped: "Agasalho equipado",
    nowWearing: "{suit} está sendo usado agora.",

    unableToEquip: "Não foi possível equipar",
    unableToEquipMessage:
      "O agasalho não pôde ser equipado.",

    editAvatarName: "Editar nome do avatar",
    editIphoneOnly:
      "A edição do nome do avatar está disponível atualmente no iPhone.",
    enterNewName: "Digite um novo nome para o avatar.",

    rookie: "Iniciante",
    explorer: "Explorador",
    trailblazer: "Pioneiro",
    pathfinder: "Desbravador",
    legend: "Lenda",
    eliteLegend: "Lenda Elite",
  },

  ja: {
    back: "戻る",

    basic: "ベーシック",
    premium: "プレミアム",
    elite: "エリート",

    avatarCenter: "アバターセンター",
    subtitle: "あなたの旅。あなたの進歩。あなたのアバター。",

    yourAvatar: "あなたのアバター",
    avatar: "アバター",

    wearing: "{suit}を着用中",
    defaultOutfit: "デフォルト衣装",
    updatingOutfit: "衣装を更新中…",
    normalFallback: "通常アバターを使用中",

    lifetimeSteps: "旅の累計歩数",
    marathonNote:
      "マラソンの歩数はトラックスーツの進行には加算されません。",

    nextUnlock: "次のLegathonアンロック",
    allTracksuitsUnlocked: "すべてのトラックスーツを解除済み",
    stepsRemaining: "残り{steps}歩",
    allMilestones:
      "すべてのトラックスーツのマイルストーンを達成しました。",

    changeAvatar: "アバターを変更",
    changeAvatarSubtitle:
      "アバターのスタイルと年齢を選択",

    editName: "名前を編集",
    editNameSubtitle:
      "アバターの表示名を変更",

    avatarShowcase: "アバターコレクション",
    collection: "コレクション",
    active: "使用中",

    wardrobeUnlocks: "ワードローブ解除",
    premiumWardrobe: "プレミアムワードローブ",
    premiumWardrobeMessage:
      "トラックスーツはプレミアムおよびエリート会員が利用できます。旅の累計歩数は引き続き加算されます。",

    walkAdditional:
      "さらに{steps}歩の旅の歩数を歩く",
    unlocksAt:
      "累計{steps}歩で解除",

    milestoneCompleted: "歩行マイルストーン達成",

    locked: "ロック中",
    wearingButton: "着用中",
    wearSuit: "着用する",

    wearDefaultOutfit: "デフォルト衣装を着用",

    tracksuitLocked: "トラックスーツはロック中",
    lifetimeRemaining:
      "旅の累計歩数があと{steps}歩必要です。",

    premiumRequired: "プレミアムが必要です",
    premiumRequiredMessage:
      "青、緑、赤、黄のトラックスーツはプレミアムおよびエリート会員が利用できます。",

    eliteRequired: "エリートが必要です",
    eliteRequiredMessage:
      "ブラック＆ゴールドのエリートトラックスーツはエリート会員専用です。",

    tracksuitUnavailable: "トラックスーツを利用できません",
    tracksuitUnavailableMessage:
      "このトラックスーツはまだ着用できません。",

    tracksuitEquipped: "トラックスーツを装備しました",
    nowWearing: "{suit}を着用しました。",

    unableToEquip: "装備できません",
    unableToEquipMessage:
      "トラックスーツを装備できませんでした。",

    editAvatarName: "アバター名を編集",
    editIphoneOnly:
      "アバター名の編集は現在iPhoneで利用できます。",
    enterNewName: "新しいアバター名を入力してください。",

    rookie: "ルーキー",
    explorer: "エクスプローラー",
    trailblazer: "トレイルブレイザー",
    pathfinder: "パスファインダー",
    legend: "レジェンド",
    eliteLegend: "エリートレジェンド",
  },

  ko: {
    back: "뒤로",

    basic: "베이직",
    premium: "프리미엄",
    elite: "엘리트",

    avatarCenter: "아바타 센터",
    subtitle: "나의 여정. 나의 성장. 나의 아바타.",

    yourAvatar: "내 아바타",
    avatar: "아바타",

    wearing: "{suit} 착용 중",
    defaultOutfit: "기본 의상",
    updatingOutfit: "의상 업데이트 중…",
    normalFallback: "기본 아바타 사용 중",

    lifetimeSteps: "여정 누적 걸음 수",
    marathonNote:
      "마라톤 걸음은 트레이닝복 진행도에 포함되지 않습니다.",

    nextUnlock: "다음 Legathon 잠금 해제",
    allTracksuitsUnlocked: "모든 트레이닝복 잠금 해제",
    stepsRemaining: "{steps}걸음 남음",
    allMilestones:
      "모든 트레이닝복 목표를 완료했습니다.",

    changeAvatar: "아바타 변경",
    changeAvatarSubtitle:
      "아바타 스타일과 연령을 선택하세요",

    editName: "이름 편집",
    editNameSubtitle:
      "아바타 표시 이름을 변경하세요",

    avatarShowcase: "아바타 컬렉션",
    collection: "컬렉션",
    active: "사용 중",

    wardrobeUnlocks: "의상 잠금 해제",
    premiumWardrobe: "프리미엄 의상",
    premiumWardrobeMessage:
      "트레이닝복은 프리미엄 및 엘리트 회원이 이용할 수 있습니다. 여정 누적 걸음은 계속 쌓입니다.",

    walkAdditional:
      "여정 걸음 {steps}걸음 추가로 걷기",
    unlocksAt:
      "누적 {steps}걸음에서 잠금 해제",

    milestoneCompleted: "걷기 목표 달성",

    locked: "잠김",
    wearingButton: "착용 중",
    wearSuit: "착용",

    wearDefaultOutfit: "기본 의상 착용",

    tracksuitLocked: "트레이닝복 잠김",
    lifetimeRemaining:
      "여정 누적 걸음 {steps}걸음이 더 필요합니다.",

    premiumRequired: "프리미엄 필요",
    premiumRequiredMessage:
      "파랑, 초록, 빨강, 노랑 트레이닝복은 프리미엄 및 엘리트 회원이 이용할 수 있습니다.",

    eliteRequired: "엘리트 필요",
    eliteRequiredMessage:
      "블랙 & 골드 엘리트 트레이닝복은 엘리트 회원 전용입니다.",

    tracksuitUnavailable: "트레이닝복 사용 불가",
    tracksuitUnavailableMessage:
      "아직 이 트레이닝복을 착용할 수 없습니다.",

    tracksuitEquipped: "트레이닝복 착용 완료",
    nowWearing: "{suit}을(를) 착용했습니다.",

    unableToEquip: "착용할 수 없음",
    unableToEquipMessage:
      "트레이닝복을 착용하지 못했습니다.",

    editAvatarName: "아바타 이름 편집",
    editIphoneOnly:
      "현재 iPhone에서 아바타 이름을 편집할 수 있습니다.",
    enterNewName: "새 아바타 이름을 입력하세요.",

    rookie: "루키",
    explorer: "탐험가",
    trailblazer: "개척자",
    pathfinder: "길잡이",
    legend: "레전드",
    eliteLegend: "엘리트 레전드",
  },

  zh: {
    back: "返回",

    basic: "基础",
    premium: "高级",
    elite: "精英",

    avatarCenter: "虚拟形象中心",
    subtitle: "你的旅程。你的进步。你的虚拟形象。",

    yourAvatar: "你的虚拟形象",
    avatar: "虚拟形象",

    wearing: "正在穿着 {suit}",
    defaultOutfit: "默认服装",
    updatingOutfit: "正在更新服装…",
    normalFallback: "正在使用普通虚拟形象",

    lifetimeSteps: "旅程累计步数",
    marathonNote:
      "马拉松步数不会推进运动服解锁进度。",

    nextUnlock: "下一个 Legathon 解锁",
    allTracksuitsUnlocked: "所有运动服均已解锁",
    stepsRemaining: "还需 {steps} 步",
    allMilestones:
      "所有运动服里程碑均已完成。",

    changeAvatar: "更换虚拟形象",
    changeAvatarSubtitle:
      "选择虚拟形象的风格和年龄",

    editName: "编辑名称",
    editNameSubtitle:
      "更新虚拟形象显示名称",

    avatarShowcase: "你的虚拟形象收藏",
    collection: "收藏",
    active: "当前使用",

    wardrobeUnlocks: "衣橱解锁",
    premiumWardrobe: "高级衣橱",
    premiumWardrobeMessage:
      "运动服面向高级和精英会员开放。你的旅程累计步数会继续累积。",

    walkAdditional:
      "再走 {steps} 个旅程步数",
    unlocksAt:
      "累计达到 {steps} 步时解锁",

    milestoneCompleted: "步行里程碑已完成",

    locked: "已锁定",
    wearingButton: "穿着中",
    wearSuit: "穿上",

    wearDefaultOutfit: "穿默认服装",

    tracksuitLocked: "运动服已锁定",
    lifetimeRemaining:
      "还需要 {steps} 个旅程累计步数。",

    premiumRequired: "需要高级会员",
    premiumRequiredMessage:
      "蓝色、绿色、红色和黄色运动服面向高级和精英会员开放。",

    eliteRequired: "需要精英会员",
    eliteRequiredMessage:
      "黑金精英运动服仅面向精英会员开放。",

    tracksuitUnavailable: "运动服不可用",
    tracksuitUnavailableMessage:
      "目前还不能穿这套运动服。",

    tracksuitEquipped: "运动服已装备",
    nowWearing: "现在正在穿着 {suit}。",

    unableToEquip: "无法装备",
    unableToEquipMessage:
      "无法装备该运动服。",

    editAvatarName: "编辑虚拟形象名称",
    editIphoneOnly:
      "目前可在 iPhone 上编辑虚拟形象名称。",
    enterNewName: "输入新的虚拟形象名称。",

    rookie: "新手",
    explorer: "探索者",
    trailblazer: "开拓者",
    pathfinder: "探路者",
    legend: "传奇",
    eliteLegend: "精英传奇",
  },

  it: {
    back: "Indietro",

    basic: "BASE",
    premium: "PREMIUM",
    elite: "ELITE",

    avatarCenter: "Centro Avatar",
    subtitle: "Il tuo viaggio. I tuoi progressi. Il tuo avatar.",

    yourAvatar: "IL TUO AVATAR",
    avatar: "Avatar",

    wearing: "Indossa {suit}",
    defaultOutfit: "Abbigliamento predefinito",
    updatingOutfit: "Aggiornamento abbigliamento…",
    normalFallback: "Avatar normale attivo",

    lifetimeSteps: "PASSI TOTALI DEI VIAGGI",
    marathonNote:
      "I passi delle maratone non fanno avanzare i progressi delle tute.",

    nextUnlock: "Prossimo sblocco Legathon",
    allTracksuitsUnlocked: "Tutte le tute sbloccate",
    stepsRemaining: "{steps} passi rimanenti",
    allMilestones:
      "Tutti i traguardi delle tute sono stati completati.",

    changeAvatar: "Cambia avatar",
    changeAvatarSubtitle:
      "Scegli lo stile e l'età del tuo avatar",

    editName: "Modifica nome",
    editNameSubtitle:
      "Aggiorna il nome visualizzato del tuo avatar",

    avatarShowcase: "La tua collezione di avatar",
    collection: "Collezione",
    active: "ATTIVO",

    wardrobeUnlocks: "Sblocchi guardaroba",
    premiumWardrobe: "Guardaroba Premium",
    premiumWardrobeMessage:
      "Le tute sono disponibili per i membri Premium ed Elite. I tuoi passi totali di viaggio continuano ad accumularsi.",

    walkAdditional:
      "Cammina altri {steps} passi di viaggio",
    unlocksAt:
      "Si sblocca a {steps} passi totali",

    milestoneCompleted: "Traguardo di camminata completato",

    locked: "Bloccato",
    wearingButton: "Indossato",
    wearSuit: "Indossa",

    wearDefaultOutfit: "Indossa abbigliamento predefinito",

    tracksuitLocked: "Tuta bloccata",
    lifetimeRemaining:
      "Mancano {steps} passi totali di viaggio.",

    premiumRequired: "Premium richiesto",
    premiumRequiredMessage:
      "Le tute blu, verdi, rosse e gialle sono disponibili per i membri Premium ed Elite.",

    eliteRequired: "Elite richiesto",
    eliteRequiredMessage:
      "La tuta Elite nera e oro è disponibile per i membri Elite.",

    tracksuitUnavailable: "Tuta non disponibile",
    tracksuitUnavailableMessage:
      "Questa tuta non può ancora essere indossata.",

    tracksuitEquipped: "Tuta equipaggiata",
    nowWearing: "Ora stai indossando {suit}.",

    unableToEquip: "Impossibile equipaggiare",
    unableToEquipMessage:
      "Non è stato possibile equipaggiare la tuta.",

    editAvatarName: "Modifica nome avatar",
    editIphoneOnly:
      "La modifica del nome dell'avatar è attualmente disponibile su iPhone.",
    enterNewName: "Inserisci un nuovo nome per l'avatar.",

    rookie: "Principiante",
    explorer: "Esploratore",
    trailblazer: "Pioniere",
    pathfinder: "Esploratore esperto",
    legend: "Leggenda",
    eliteLegend: "Leggenda Elite",
  },

  ar: {
    back: "رجوع",

    basic: "أساسي",
    premium: "بريميوم",
    elite: "إيليت",

    avatarCenter: "مركز الأفاتار",
    subtitle: "رحلتك. تقدمك. أفاتارك.",

    yourAvatar: "الأفاتار الخاص بك",
    avatar: "أفاتار",

    wearing: "يرتدي {suit}",
    defaultOutfit: "الزي الافتراضي",
    updatingOutfit: "جارٍ تحديث الزي…",
    normalFallback: "الأفاتار العادي نشط",

    lifetimeSteps: "إجمالي خطوات الرحلات",
    marathonNote:
      "خطوات الماراثون لا تزيد تقدم فتح البدلات الرياضية.",

    nextUnlock: "فتح Legathon التالي",
    allTracksuitsUnlocked: "تم فتح جميع البدلات الرياضية",
    stepsRemaining: "متبقي {steps} خطوة",
    allMilestones:
      "تم إكمال جميع مراحل البدلات الرياضية.",

    changeAvatar: "تغيير الأفاتار",
    changeAvatarSubtitle:
      "اختر نمط وعمر الأفاتار",

    editName: "تعديل الاسم",
    editNameSubtitle:
      "حدّث الاسم المعروض للأفاتار",

    avatarShowcase: "مجموعة الأفاتار الخاصة بك",
    collection: "المجموعة",
    active: "نشط",

    wardrobeUnlocks: "فتح خزانة الملابس",
    premiumWardrobe: "خزانة بريميوم",
    premiumWardrobeMessage:
      "البدلات الرياضية متاحة لأعضاء بريميوم وإيليت. يستمر تجميع إجمالي خطوات رحلاتك.",

    walkAdditional:
      "امشِ {steps} خطوة رحلة إضافية",
    unlocksAt:
      "يتم الفتح عند {steps} خطوة إجمالية",

    milestoneCompleted: "تم إكمال مرحلة المشي",

    locked: "مقفل",
    wearingButton: "قيد الارتداء",
    wearSuit: "ارتداء البدلة",

    wearDefaultOutfit: "ارتداء الزي الافتراضي",

    tracksuitLocked: "البدلة الرياضية مقفلة",
    lifetimeRemaining:
      "متبقي {steps} خطوة من إجمالي خطوات الرحلات.",

    premiumRequired: "يتطلب بريميوم",
    premiumRequiredMessage:
      "البدلات الزرقاء والخضراء والحمراء والصفراء متاحة لأعضاء بريميوم وإيليت.",

    eliteRequired: "يتطلب إيليت",
    eliteRequiredMessage:
      "البدلة الرياضية السوداء والذهبية متاحة لأعضاء إيليت.",

    tracksuitUnavailable: "البدلة غير متاحة",
    tracksuitUnavailableMessage:
      "لا يمكن ارتداء هذه البدلة بعد.",

    tracksuitEquipped: "تم ارتداء البدلة",
    nowWearing: "يتم الآن ارتداء {suit}.",

    unableToEquip: "تعذر الارتداء",
    unableToEquipMessage:
      "تعذر ارتداء البدلة الرياضية.",

    editAvatarName: "تعديل اسم الأفاتار",
    editIphoneOnly:
      "تعديل اسم الأفاتار متاح حاليًا على iPhone.",
    enterNewName: "أدخل اسمًا جديدًا للأفاتار.",

    rookie: "مبتدئ",
    explorer: "مستكشف",
    trailblazer: "رائد",
    pathfinder: "مستكشف طرق",
    legend: "أسطورة",
    eliteLegend: "أسطورة إيليت",
  },
};


// ============================================================
// HELPERS
// ============================================================

function fillTemplate(template, values = {}) {
  return String(template || "").replace(
    /\{(\w+)\}/g,
    (_, key) =>
      values[key] !== undefined &&
      values[key] !== null
        ? String(values[key])
        : ""
  );
}


function getDefaultAvatar() {
  return avatarOptions?.[0] || null;
}


function safeNumber(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return 0;
  }

  return number;
}


function normalizeMembership(value) {
  const membership = String(
    value || "basic"
  )
    .trim()
    .toLowerCase();

  if (membership.includes("elite")) {
    return "elite";
  }

  if (membership.includes("premium")) {
    return "premium";
  }

  return "basic";
}


// ============================================================
// RANK KEY
// ============================================================

function getRankKey(lifetimeSteps) {
  const steps = safeNumber(lifetimeSteps);

  if (steps >= 4250000) {
    return "eliteLegend";
  }

  if (steps >= 1250000) {
    return "legend";
  }

  if (steps >= 750000) {
    return "pathfinder";
  }

  if (steps >= 400000) {
    return "trailblazer";
  }

  if (steps >= 150000) {
    return "explorer";
  }

  return "rookie";
}


// ============================================================
// ACTION BUTTON
// ============================================================

function ActionButton({
  icon,
  title,
  subtitle,
  onPress,
  rtl = false,
}) {
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Text style={styles.actionIcon}>
        {icon}
      </Text>

      <View style={styles.actionTextWrap}>
        <Text
          style={[
            styles.actionTitle,
            rtl && styles.rtlText,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionSubtitle,
            rtl && styles.rtlText,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Text style={styles.actionArrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function AvatarCenterScreen({
  goBack,
  goToAvatarPicker,

  language = "en",

  subscriptionTier,
  membershipTier,
}) {
  // ==========================================================
  // TRANSLATION
  // ==========================================================

  const activeLanguage =
    AVATAR_TRANSLATIONS[language]
      ? language
      : "en";

  const rtl =
    activeLanguage === "ar";

  const t = React.useCallback(
    (key, values = {}) => {
      const local =
        AVATAR_TRANSLATIONS?.[activeLanguage]?.[
          key
        ];

      const english =
        AVATAR_TRANSLATIONS.en?.[key];

      let template =
        local ??
        english ??
        key;

      // Only use central translations when the
      // local Avatar dictionary does not contain the key.
      if (
        local === undefined &&
        english === undefined
      ) {
        const central =
          translate(activeLanguage, key);

        if (
          central &&
          central !== key
        ) {
          template = central;
        }
      }

      return fillTemplate(
        template,
        values
      );
    },
    [activeLanguage]
  );


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    avatarName,
    setAvatarName,
  ] = React.useState(
    "Legathon Walker"
  );

  const [
    selectedAvatar,
    setSelectedAvatar,
  ] = React.useState(
    getDefaultAvatar()
  );

  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] = React.useState(0);

  const [
    equippedSuit,
    setEquippedSuit,
  ] = React.useState(
    "default"
  );

  const [
    resolvedAvatarImage,
    setResolvedAvatarImage,
  ] = React.useState(
    getDefaultAvatar()?.image ||
      null
  );

  const [
    avatarVisual,
    setAvatarVisual,
  ] = React.useState(null);

  const [
    loadingVisual,
    setLoadingVisual,
  ] = React.useState(false);

  const [
    screenReady,
    setScreenReady,
  ] = React.useState(false);


  // ==========================================================
  // MEMBERSHIP
  // ==========================================================

  const membership =
    normalizeMembership(
      subscriptionTier ||
        membershipTier
    );


  // ==========================================================
  // REFRESH AVATAR VISUAL
  // ==========================================================

  const refreshAvatarVisual =
    React.useCallback(
      async (
        avatar = selectedAvatar
      ) => {
        if (!avatar?.id) {
          setResolvedAvatarImage(
            avatar?.image || null
          );

          setAvatarVisual(null);

          return;
        }

        try {
          setLoadingVisual(true);

          const visual =
            await getCurrentAvatarVisual(
              avatar.id
            );

          setAvatarVisual(visual);

          setResolvedAvatarImage(
            visual?.image ||
              avatar.image ||
              null
          );
        } catch (error) {
          console.log(
            "Refresh avatar visual error:",
            error
          );

          setResolvedAvatarImage(
            avatar.image || null
          );
        } finally {
          setLoadingVisual(false);
        }
      },
      [selectedAvatar]
    );


  // ==========================================================
  // LOAD AVATAR CENTER
  // ==========================================================

  const loadAvatarCenter =
    React.useCallback(
      async () => {
        try {
          const [
            savedSteps,
            savedProfile,
          ] = await Promise.all([
            AsyncStorage.getItem(
              "lifetimeSteps"
            ),

            AsyncStorage.getItem(
              "avatarProfile"
            ),

            // Keep this call so existing wardrobe
            // storage is initialized/read.
            getAvatarWardrobeState(),
          ]);

          // --------------------------------------------------
          // JOURNEY LIFETIME STEPS
          // --------------------------------------------------

          setLifetimeSteps(
            safeNumber(savedSteps)
          );

          // --------------------------------------------------
          // WARDROBE
          // --------------------------------------------------

          const checkedSteps =
            Number(savedSteps);

          if (
            savedSteps === null ||
            String(savedSteps).trim() ===
              "" ||
            !Number.isFinite(
              checkedSteps
            ) ||
            checkedSteps < 0
          ) {
            throw new Error(
              "Journey steps are unavailable. Outfit was not changed."
            );
          }

          const validatedWardrobe =
            await syncAvatarSuitFromLifetimeSteps(
              checkedSteps
            );

          if (
            !validatedWardrobe.saved
          ) {
            throw new Error(
              "Unable to validate the equipped tracksuit."
            );
          }

          setEquippedSuit(
            validatedWardrobe.currentSuit
          );

          // --------------------------------------------------
          // AVATAR PROFILE
          // --------------------------------------------------

          let avatar =
            getDefaultAvatar();

          if (savedProfile) {
            try {
              const profile =
                JSON.parse(
                  savedProfile
                );

              const savedName =
                String(
                  profile?.name || ""
                ).trim();

              // Migrate the old visible default name.
              const migratedName =
                !savedName ||
                savedName ===
                  "Legacy Walker"
                  ? "Legathon Walker"
                  : savedName;

              setAvatarName(
                migratedName
              );

              if (
                savedName ===
                  "Legacy Walker"
              ) {
                await AsyncStorage.setItem(
                  "avatarProfile",
                  JSON.stringify({
                    ...profile,
                    name:
                      "Legathon Walker",
                  })
                );
              }

              const foundAvatar =
                avatarOptions.find(
                  (option) =>
                    option.id ===
                    profile?.avatarId
                );

              if (foundAvatar) {
                avatar =
                  foundAvatar;
              }
            } catch (error) {
              console.log(
                "Avatar profile parse error:",
                error
              );
            }
          }

          setSelectedAvatar(avatar);

          // --------------------------------------------------
          // RESOLVE ACTUAL DISPLAY IMAGE
          // --------------------------------------------------

          if (avatar?.id) {
            const visual =
              await getCurrentAvatarVisual(
                avatar.id
              );

            setAvatarVisual(visual);

            setResolvedAvatarImage(
              visual?.image ||
                avatar.image ||
                null
            );
          }

          setScreenReady(true);
        } catch (error) {
          console.log(
            "Avatar Center Load Error:",
            error
          );

          setScreenReady(true);
        }
      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  React.useEffect(() => {
    loadAvatarCenter();
  }, [loadAvatarCenter]);


  // ==========================================================
  // PERIODIC STEP / WARDROBE REFRESH
  // ==========================================================

  React.useEffect(() => {
    const timer =
      setInterval(
        async () => {
          try {
            const [
              savedSteps,
            ] = await Promise.all([
              AsyncStorage.getItem(
                "lifetimeSteps"
              ),

              getCurrentAvatarSuit(),
            ]);

            setLifetimeSteps(
              safeNumber(savedSteps)
            );

            const checkedSteps =
              Number(savedSteps);

            if (
              savedSteps === null ||
              String(
                savedSteps
              ).trim() === "" ||
              !Number.isFinite(
                checkedSteps
              ) ||
              checkedSteps < 0
            ) {
              throw new Error(
                "Journey steps are unavailable. Outfit was not changed."
              );
            }

            const validatedWardrobe =
              await syncAvatarSuitFromLifetimeSteps(
                checkedSteps
              );

            if (
              !validatedWardrobe.saved
            ) {
              throw new Error(
                "Unable to validate the equipped tracksuit."
              );
            }

            setEquippedSuit(
              validatedWardrobe.currentSuit
            );
          } catch (error) {
            console.log(
              "Avatar Center refresh error:",
              error
            );
          }
        },
        3000
      );

    return () =>
      clearInterval(timer);
  }, []);


  // ==========================================================
  // REFRESH IMAGE WHEN AVATAR OR SUIT CHANGES
  // ==========================================================

  React.useEffect(() => {
    if (
      !screenReady ||
      !selectedAvatar?.id
    ) {
      return;
    }

    refreshAvatarVisual(
      selectedAvatar
    );
  }, [
    selectedAvatar?.id,
    equippedSuit,
    screenReady,
    refreshAvatarVisual,
  ]);


  // ==========================================================
  // SELECT AVATAR
  // ==========================================================

  async function selectAvatar(
    avatar
  ) {
    if (!avatar?.id) {
      return;
    }

    try {
      const profile = {
        name: avatarName,
        avatarId: avatar.id,
      };

      await AsyncStorage.setItem(
        "avatarProfile",
        JSON.stringify(profile)
      );

      setSelectedAvatar(avatar);

      const visual =
        await getCurrentAvatarVisual(
          avatar.id
        );

      setAvatarVisual(visual);

      setResolvedAvatarImage(
        visual?.image ||
          avatar.image ||
          null
      );
    } catch (error) {
      console.log(
        "Select avatar error:",
        error
      );
    }
  }


  // ==========================================================
  // EQUIP TRACKSUIT
  // ==========================================================

  async function equipSuit(suit) {
    if (!suit?.id) {
      return;
    }

    const eligibility =
      canUserEquipTracksuit({
        lifetimeSteps,

        suitId: suit.id,

        subscriptionTier:
          membership,
      });

    // --------------------------------------------------------
    // STEP LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "steps"
    ) {
      Alert.alert(
        t("tracksuitLocked"),

        t("lifetimeRemaining", {
          steps: Number(
            eligibility.progress
              ?.remaining || 0
          ).toLocaleString(),
        })
      );

      return;
    }

    // --------------------------------------------------------
    // PREMIUM LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "premium_required"
    ) {
      Alert.alert(
        t("premiumRequired"),
        t(
          "premiumRequiredMessage"
        )
      );

      return;
    }

    // --------------------------------------------------------
    // ELITE LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "elite_required"
    ) {
      Alert.alert(
        t("eliteRequired"),
        t("eliteRequiredMessage")
      );

      return;
    }

    if (!eligibility.allowed) {
      Alert.alert(
        t("tracksuitUnavailable"),
        t(
          "tracksuitUnavailableMessage"
        )
      );

      return;
    }

    try {
      const result =
        await setCurrentAvatarSuit(
          suit.id,
          suit.level
        );

      if (!result?.success) {
        throw new Error(
          "Unable to save equipped tracksuit."
        );
      }

      setEquippedSuit(
        result.suitId
      );

      if (selectedAvatar?.id) {
        const preview =
          getTracksuitVisual({
            avatarId:
              selectedAvatar.id,

            suitId:
              result.suitId,
          });

        if (preview?.image) {
          setResolvedAvatarImage(
            preview.image
          );

          setAvatarVisual(
            preview
          );
        } else {
          await refreshAvatarVisual(
            selectedAvatar
          );
        }
      }

      Alert.alert(
        t("tracksuitEquipped"),

        t("nowWearing", {
          suit: suit.name,
        })
      );
    } catch (error) {
      console.log(
        "Equip tracksuit error:",
        error
      );

      Alert.alert(
        t("unableToEquip"),
        t(
          "unableToEquipMessage"
        )
      );
    }
  }


  // ==========================================================
  // REMOVE TRACKSUIT
  // ==========================================================

  async function wearDefaultOutfit() {
    try {
      await setCurrentAvatarSuit(
        "default",
        0
      );

      setEquippedSuit(
        "default"
      );

      if (selectedAvatar) {
        setResolvedAvatarImage(
          selectedAvatar.image ||
            null
        );

        await refreshAvatarVisual(
          selectedAvatar
        );
      }
    } catch (error) {
      console.log(
        "Wear default outfit error:",
        error
      );
    }
  }


  // ==========================================================
  // EDIT AVATAR NAME
  // ==========================================================

  function editAvatarName() {
    if (Platform.OS !== "ios") {
      Alert.alert(
        t("editAvatarName"),
        t("editIphoneOnly")
      );

      return;
    }

    Alert.prompt(
      t("editAvatarName"),
      t("enterNewName"),

      async (text) => {
        const newName =
          String(text || "").trim();

        if (!newName) {
          return;
        }

        try {
          const profile = {
            name: newName,

            avatarId:
              selectedAvatar?.id ||
              getDefaultAvatar()?.id,
          };

          await AsyncStorage.setItem(
            "avatarProfile",
            JSON.stringify(profile)
          );

          setAvatarName(newName);
        } catch (error) {
          console.log(
            "Edit avatar name error:",
            error
          );
        }
      }
    );
  }


  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const rank =
    t(
      getRankKey(
        lifetimeSteps
      )
    );

  const nextSuit =
    TRACKSUIT_TIERS.find(
      (suit) =>
        !getTracksuitProgress(
          lifetimeSteps,
          suit
        ).unlocked
    ) || null;

  const nextProgress =
    nextSuit
      ? getTracksuitProgress(
          lifetimeSteps,
          nextSuit
        )
      : null;

  const currentSuit =
    TRACKSUIT_TIERS.find(
      (suit) =>
        suit.id === equippedSuit
    ) || null;


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* TOP BAR */}

      <View style={styles.topRow}>
        {goBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.82}
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              {rtl
                ? `${t("back")} ›`
                : `‹ ${t("back")}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View
          style={[
            styles.membershipBadge,

            membership === "elite" &&
              styles.eliteBadge,
          ]}
        >
          <Text
            style={
              styles.membershipBadgeText
            }
          >
            {membership === "elite"
              ? `👑 ${t("elite")}`
              : membership ===
                  "premium"
              ? `👑 ${t("premium")}`
              : t("basic")}
          </Text>
        </View>
      </View>


      {/* HEADER */}

      <Text style={styles.kicker}>
        LEGATHON WALK
      </Text>

      <Text
        style={[
          styles.title,
          rtl && styles.rtlText,
        ]}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
      >
        {t("avatarCenter")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          rtl && styles.rtlText,
        ]}
      >
        {t("subtitle")}
      </Text>


      {/* HERO */}

      <View style={styles.heroCard}>
        <View
          style={styles.avatarStage}
        >
          <View
            style={styles.glowCircle}
          />

          {resolvedAvatarImage ? (
            <Image
              source={
                resolvedAvatarImage
              }
              style={styles.avatarImage}
              resizeMode="contain"
            />
          ) : (
            <View
              style={
                styles.avatarPlaceholder
              }
            >
              <Text
                style={
                  styles.avatarPlaceholderText
                }
              >
                🙂
              </Text>
            </View>
          )}

          <View
            style={styles.rankBadge}
          >
            <Text
              style={
                styles.rankBadgeText
              }
            >
              {rank}
            </Text>
          </View>
        </View>

        <View style={styles.heroInfo}>
          <Text
            style={[
              styles.heroKicker,
              rtl && styles.rtlText,
            ]}
          >
            {t("yourAvatar")}
          </Text>

          <Text
            style={[
              styles.avatarName,
              rtl && styles.rtlText,
            ]}
          >
            {avatarName}
          </Text>

          <Text
            style={[
              styles.avatarLabel,
              rtl && styles.rtlText,
            ]}
          >
            {selectedAvatar?.label ||
              selectedAvatar?.id ||
              t("avatar")}
          </Text>

          {currentSuit ? (
            <View
              style={
                styles.wearingPill
              }
            >
              <Text
                style={[
                  styles.wearingPillText,
                  rtl &&
                    styles.rtlText,
                ]}
              >
                ✓{" "}
                {t("wearing", {
                  suit:
                    currentSuit.name,
                })}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={
                styles.defaultOutfitPill
              }
              onPress={
                wearDefaultOutfit
              }
            >
              <Text
                style={[
                  styles.defaultOutfitText,
                  rtl &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "defaultOutfit"
                )}
              </Text>
            </TouchableOpacity>
          )}

          {loadingVisual ? (
            <Text
              style={[
                styles.loadingText,
                rtl && styles.rtlText,
              ]}
            >
              {t(
                "updatingOutfit"
              )}
            </Text>
          ) : null}

          {__DEV__ &&
          avatarVisual?.fallbackUsed ? (
            <Text
              style={[
                styles.debugText,
                rtl && styles.rtlText,
              ]}
            >
              {t(
                "normalFallback"
              )}
            </Text>
          ) : null}
        </View>
      </View>


      {/* LIFETIME STEPS */}

      <View
        style={styles.lifetimeCard}
      >
        <Text
          style={[
            styles.lifetimeLabel,
            rtl && styles.rtlText,
          ]}
        >
          {t("lifetimeSteps")}
        </Text>

        <Text
          style={
            styles.lifetimeNumber
          }
        >
          {Math.floor(
            lifetimeSteps
          ).toLocaleString()}
        </Text>

        <Text
          style={[
            styles.lifetimeNote,
            rtl && styles.rtlText,
          ]}
        >
          {t("marathonNote")}
        </Text>
      </View>


      {/* NEXT UNLOCK */}

      <View style={styles.nextCard}>
        <Text
          style={[
            styles.nextTitle,
            rtl && styles.rtlText,
          ]}
        >
          👑 {t("nextUnlock")}
        </Text>

        <Text
          style={[
            styles.nextSuitName,
            rtl && styles.rtlText,
          ]}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {nextSuit
            ? nextSuit.name
            : t(
                "allTracksuitsUnlocked"
              )}
        </Text>

        <View
          style={
            styles.progressTrack
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  nextProgress
                    ? nextProgress.percent100
                    : 100
                }%`,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.nextRemaining,
            rtl && styles.rtlText,
          ]}
        >
          {nextProgress
            ? t(
                "stepsRemaining",
                {
                  steps:
                    nextProgress.remaining.toLocaleString(),
                }
              )
            : t("allMilestones")}
        </Text>
      </View>


      {/* ACTIONS */}

      <View style={styles.actions}>
        <ActionButton
          icon="🙂"
          title={t(
            "changeAvatar"
          )}
          subtitle={t(
            "changeAvatarSubtitle"
          )}
          onPress={
            goToAvatarPicker
          }
          rtl={rtl}
        />

        <ActionButton
          icon="✏️"
          title={t("editName")}
          subtitle={t(
            "editNameSubtitle"
          )}
          onPress={
            editAvatarName
          }
          rtl={rtl}
        />
      </View>


      {/* AVATAR SHOWCASE */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <Text
          style={[
            styles.sectionTitle,
            rtl && styles.rtlText,
          ]}
        >
          {t("avatarShowcase")}
        </Text>

        <Text
          style={[
            styles.sectionSideText,
            rtl && styles.rtlText,
          ]}
        >
          {t("collection")}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.avatarStrip
        }
      >
        {avatarOptions.map(
          (avatar, index) => {
            const active =
              avatar.id ===
              selectedAvatar?.id;

            return (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarCard,

                  active &&
                    styles.avatarCardActive,
                ]}
                onPress={() =>
                  selectAvatar(
                    avatar
                  )
                }
                activeOpacity={0.82}
              >
                <Image
                  source={
                    avatar.id ===
                      selectedAvatar?.id &&
                    resolvedAvatarImage
                      ? resolvedAvatarImage
                      : avatar.image
                  }
                  style={
                    styles.avatarCardImage
                  }
                  resizeMode="contain"
                />

                <Text
                  style={[
                    styles.avatarCardLabel,
                    rtl &&
                      styles.rtlText,
                  ]}
                  numberOfLines={1}
                >
                  {avatar.label ||
                    `${t(
                      "avatar"
                    )} ${index + 1}`}
                </Text>

                {active ? (
                  <Text
                    style={
                      styles.activeLabel
                    }
                  >
                    {t("active")}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          }
        )}
      </ScrollView>


      {/* WARDROBE */}

      <Text
        style={[
          styles.wardrobeTitle,
          rtl && styles.rtlText,
        ]}
      >
        {t("wardrobeUnlocks")}
      </Text>

      {membership === "basic" ? (
        <View
          style={
            styles.membershipNotice
          }
        >
          <Text
            style={[
              styles.membershipNoticeTitle,
              rtl &&
                styles.rtlText,
            ]}
          >
            {t(
              "premiumWardrobe"
            )}
          </Text>

          <Text
            style={[
              styles.membershipNoticeText,
              rtl &&
                styles.rtlText,
            ]}
          >
            {t(
              "premiumWardrobeMessage"
            )}
          </Text>
        </View>
      ) : null}


      {/* TRACKSUITS */}

      {TRACKSUIT_TIERS.map(
        (suit) => {
          const progress =
            getTracksuitProgress(
              lifetimeSteps,
              suit
            );

          const access =
            canUserEquipTracksuit({
              lifetimeSteps,

              suitId: suit.id,

              subscriptionTier:
                membership,
            });

          const equipped =
            access.allowed &&
            progress.unlocked &&
            equippedSuit ===
              suit.id;

          let buttonLabel =
            t("locked");

          if (equipped) {
            buttonLabel =
              t(
                "wearingButton"
              );
          } else if (
            access.allowed
          ) {
            buttonLabel =
              t("wearSuit");
          } else if (
            progress.unlocked &&
            access.reason ===
              "premium_required"
          ) {
            buttonLabel =
              t("premium");
          } else if (
            progress.unlocked &&
            access.reason ===
              "elite_required"
          ) {
            buttonLabel =
              t("elite");
          }

          return (
            <View
              key={suit.id}
              style={styles.suitCard}
            >
              <SuitPreview
                selectedAvatar={
                  selectedAvatar
                }
                suit={suit}
              />

              <View
                style={
                  styles.suitContent
                }
              >
                <Text
                  style={[
                    styles.suitName,
                    rtl &&
                      styles.rtlText,
                  ]}
                >
                  {suit.name}
                </Text>

                <Text
                  style={[
                    styles.suitRequirement,
                    rtl &&
                      styles.rtlText,
                  ]}
                >
                  {t(
                    "walkAdditional",
                    {
                      steps:
                        Number(
                          suit.tierSteps
                        ).toLocaleString(),
                    }
                  )}

                  {"\n"}

                  {t(
                    "unlocksAt",
                    {
                      steps:
                        Number(
                          suit.unlockAt
                        ).toLocaleString(),
                    }
                  )}
                </Text>

                <View
                  style={
                    styles.suitProgressTrack
                  }
                >
                  <View
                    style={[
                      styles.suitProgressFill,
                      {
                        width: `${progress.percent100}%`,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    progress.unlocked
                      ? styles.unlockedText
                      : styles.lockedText,

                    rtl &&
                      styles.rtlText,
                  ]}
                >
                  {progress.unlocked
                    ? `✅ ${t(
                        "milestoneCompleted"
                      )}`
                    : `🔒 ${t(
                        "stepsRemaining",
                        {
                          steps:
                            progress.remaining.toLocaleString(),
                        }
                      )}`}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.equipButton,

                    !access.allowed &&
                      !equipped &&
                      styles.equipButtonDisabled,

                    equipped &&
                      styles.equipButtonActive,
                  ]}
                  disabled={equipped}
                  onPress={() =>
                    equipSuit(suit)
                  }
                  activeOpacity={0.82}
                >
                  <Text
                    style={[
                      styles.equipButtonText,
                      rtl &&
                        styles.rtlText,
                    ]}
                  >
                    {buttonLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      )}


      {/* RETURN TO DEFAULT OUTFIT */}

      {equippedSuit !==
      "default" ? (
        <TouchableOpacity
          style={
            styles.defaultButton
          }
          onPress={
            wearDefaultOutfit
          }
          activeOpacity={0.82}
        >
          <Text
            style={[
              styles.defaultButtonText,
              rtl &&
                styles.rtlText,
            ]}
          >
            {t(
              "wearDefaultOutfit"
            )}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}


// ============================================================
// SUIT PREVIEW
// ============================================================

function SuitPreview({
  selectedAvatar,
  suit,
}) {
  const preview =
    React.useMemo(() => {
      if (
        !selectedAvatar?.id ||
        !suit?.id
      ) {
        return null;
      }

      return getTracksuitVisual({
        avatarId:
          selectedAvatar.id,

        suitId: suit.id,
      });
    }, [
      selectedAvatar?.id,
      suit?.id,
    ]);

  const image =
    preview?.image ||
    selectedAvatar?.image ||
    null;

  return (
    <View
      style={styles.suitPreview}
    >
      {image ? (
        <Image
          source={image}
          style={
            styles.suitPreviewImage
          }
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03070D",
  },

  content: {
    paddingHorizontal: 28,
    paddingTop: 52,
    paddingBottom: 170,
  },

  topRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 42,
  },

  backButton: {
    borderWidth: 2,
    borderColor: "#E2B93B",
    borderRadius: 40,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },

  backButtonText: {
    color: "#E8C149",
    fontSize: 18,
    fontWeight: "900",
  },

  membershipBadge: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#566277",
    backgroundColor: "#101827",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  eliteBadge: {
    borderColor: "#E1B538",
    backgroundColor: "#241B08",
  },

  membershipBadgeText: {
    color: "#FFD64A",
    fontSize: 15,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7F2D8",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#C8D2E0",
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "700",
    marginBottom: 32,
  },

  heroCard: {
    backgroundColor: "#0D1B30",
    borderWidth: 2,
    borderColor: "#DDB536",
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 24,
  },

  avatarStage: {
    height: 575,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071426",
    position: "relative",
  },

  glowCircle: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#281A60",
    borderWidth: 4,
    borderColor: "#7946E5",
  },

  avatarImage: {
    width: "88%",
    height: "88%",
    zIndex: 2,
  },

  avatarPlaceholder: {
    width: 230,
    height: 230,
    borderRadius: 115,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  avatarPlaceholderText: {
    fontSize: 86,
  },

  rankBadge: {
    position: "absolute",
    bottom: 18,
    zIndex: 5,
    backgroundColor: "#08111F",
    borderColor: "#DBB33A",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  rankBadgeText: {
    color: "#FFD54B",
    fontWeight: "900",
    fontSize: 16,
  },

  heroInfo: {
    padding: 28,
    alignItems: "center",
  },

  heroKicker: {
    color: "#FFD54B",
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8,
  },

  avatarName: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
  },

  avatarLabel: {
    color: "#E8BE3C",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 7,
    textAlign: "center",
  },

  wearingPill: {
    marginTop: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#64DDA5",
    backgroundColor: "#10392B",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },

  wearingPillText: {
    color: "#A8F2D7",
    fontWeight: "900",
    textAlign: "center",
  },

  defaultOutfitPill: {
    marginTop: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#44536A",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },

  defaultOutfitText: {
    color: "#CFD8E5",
    fontWeight: "800",
    textAlign: "center",
  },

  loadingText: {
    color: "#8291A6",
    marginTop: 10,
  },

  debugText: {
    color: "#A7B0BE",
    fontSize: 11,
    marginTop: 8,
  },

  lifetimeCard: {
    backgroundColor: "#101B2D",
    borderWidth: 1,
    borderColor: "#29415E",
    borderRadius: 26,
    padding: 26,
    marginBottom: 24,
  },

  lifetimeLabel: {
    color: "#A6F1D6",
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "900",
  },

  lifetimeNumber: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 8,
  },

  lifetimeNote: {
    color: "#9BA9BA",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  nextCard: {
    padding: 26,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#DDB536",
    backgroundColor: "#101827",
    marginBottom: 24,
  },

  nextTitle: {
    color: "#FFD54B",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 15,
  },

  nextSuitName: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    marginBottom: 20,
  },

  progressTrack: {
    height: 16,
    borderRadius: 20,
    backgroundColor: "#293449",
    overflow: "hidden",
    marginBottom: 16,
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#E7BC2F",
  },

  nextRemaining: {
    color: "#A6F1D6",
    fontSize: 18,
    fontWeight: "900",
  },

  actions: {
    gap: 15,
    marginBottom: 38,
  },

  actionButton: {
    minHeight: 108,
    backgroundColor: "#0D1B30",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#294562",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  actionIcon: {
    width: 66,
    textAlign: "center",
    fontSize: 34,
  },

  actionTextWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },

  actionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  actionSubtitle: {
    color: "#B5C0D0",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    fontWeight: "700",
  },

  actionArrow: {
    color: "#CFD7E2",
    fontSize: 42,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 17,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    flexShrink: 1,
  },

  sectionSideText: {
    color: "#A6F1D6",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 10,
  },

  avatarStrip: {
    gap: 13,
    paddingRight: 20,
    marginBottom: 40,
  },

  avatarCard: {
    width: 160,
    height: 245,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#29415E",
    backgroundColor: "#0D192A",
    padding: 10,
    alignItems: "center",
  },

  avatarCardActive: {
    borderWidth: 3,
    borderColor: "#DDB536",
  },

  avatarCardImage: {
    width: 130,
    height: 174,
  },

  avatarCardLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    maxWidth: 135,
  },

  activeLabel: {
    color: "#A6F1D6",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },

  wardrobeTitle: {
    color: "#FFFFFF",
    fontSize: 39,
    lineHeight: 46,
    fontWeight: "900",
    marginBottom: 22,
  },

  membershipNotice: {
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#56448B",
    backgroundColor: "#171229",
    marginBottom: 22,
  },

  membershipNoticeTitle: {
    color: "#FFD54B",
    fontSize: 19,
    fontWeight: "900",
  },

  membershipNoticeText: {
    color: "#CDD5E0",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  suitCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#29415E",
    backgroundColor: "#0D192A",
    marginBottom: 24,
  },

  suitPreview: {
    height: 440,
    backgroundColor: "#07101D",
    justifyContent: "center",
    alignItems: "center",
  },

  suitPreviewImage: {
    width: "94%",
    height: "94%",
  },

  suitContent: {
    padding: 26,
  },

  suitName: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    marginBottom: 12,
  },

  suitRequirement: {
    color: "#D8DFE8",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 18,
  },

  suitProgressTrack: {
    height: 15,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#293449",
    marginBottom: 16,
  },

  suitProgressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#E7BC2F",
  },

  unlockedText: {
    color: "#8CE7B8",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 18,
  },

  lockedText: {
    color: "#FFD54B",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 18,
  },

  equipButton: {
    minHeight: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18A954",
    paddingHorizontal: 15,
  },

  equipButtonActive: {
    borderWidth: 2,
    borderColor: "#61E99A",
  },

  equipButtonDisabled: {
    backgroundColor: "#465268",
  },

  equipButtonText: {
    color: "#07100B",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  defaultButton: {
    minHeight: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#DDB536",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },

  defaultButtonText: {
    color: "#FFD54B",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});