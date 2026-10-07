import React from "react";
// screens/TermsOfServiceScreen.js

import React from "react";

import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";


// ============================================================
// LEGATHON WALK — TERMS OF SERVICE
// ============================================================

const LEGATHON_BG =
  require("../assets/collage-background.png");


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",

    kicker: "TERMS OF SERVICE",
    title: "Using Legathon Walk",

    welcomeTitle: "Welcome To Legathon Walk",
    welcomeText:
      "By using Legathon Walk, you agree to these terms governing step tracking, rewards, community participation, subscriptions, purchases, and account usage.",

    stepTitle: "Step Tracking Disclaimer",
    stepText:
      "Legathon Walk relies on device sensors, Apple Health, Google Fit, and other tracking sources. Step counts may vary and are not guaranteed to be perfectly accurate.",

    rewardsTitle: "Rewards & W Coins",
    rewardsText:
      "W Coins, achievements, rewards, badges, and collectibles are virtual items and do not have cash value unless specifically stated.",

    marketplaceTitle: "Marketplace Terms",
    marketplaceText:
      "Marketplace items, avatar rewards, passport frames, and collectibles may be modified, discontinued, or updated at any time.",

    subscriptionTitle: "Subscription Terms",
    subscriptionText:
      "Legathon Premium and Elite subscriptions automatically renew unless canceled through the appropriate platform or billing provider.",

    communityTitle: "Community Rules",
    communityText:
      "Users must treat others respectfully. Harassment, hate speech, impersonation, spam, cheating, and abusive behavior may result in account restrictions.",

    accountRules: "Account Rules",

    accurateInfo:
      "Provide accurate account information",

    protectLogin:
      "Protect your login credentials",

    responsibleUse:
      "Use the platform responsibly",

    noFakeActivity:
      "No fake activity or reward manipulation",

    noUnauthorizedAccess:
      "No unauthorized access attempts",

    safetyNotice: "SAFETY NOTICE",
    walkSafely: "Walk Safely",

    safetyText:
      "Always remain aware of your surroundings while walking. Do not use Legathon Walk in a manner that distracts you from traffic, hazards, or emergency situations.",

    support: "SUPPORT",

    questionsTitle:
      "Questions About These Terms?",

    contactText:
      "Contact Legathon Walk support regarding account access, subscriptions, purchases, rewards, or policy questions.",

    contactSupport:
      "Contact Support",

    lastUpdated:
      "Last Updated: June 2026",
  },


  // ==========================================================
  // SPANISH
  // ==========================================================

  es: {
    back: "‹ Atrás",

    kicker: "TÉRMINOS DE SERVICIO",
    title: "Uso de Legathon Walk",

    welcomeTitle:
      "Bienvenido a Legathon Walk",

    welcomeText:
      "Al utilizar Legathon Walk, aceptas estos términos que regulan el seguimiento de pasos, las recompensas, la participación en la comunidad, las suscripciones, las compras y el uso de la cuenta.",

    stepTitle:
      "Aviso sobre el seguimiento de pasos",

    stepText:
      "Legathon Walk utiliza sensores del dispositivo, Apple Health, Google Fit y otras fuentes de seguimiento. El conteo de pasos puede variar y no se garantiza que sea completamente exacto.",

    rewardsTitle:
      "Recompensas y W Coins",

    rewardsText:
      "Los W Coins, logros, recompensas, insignias y objetos coleccionables son elementos virtuales y no tienen valor en efectivo salvo que se indique específicamente.",

    marketplaceTitle:
      "Términos de la tienda",

    marketplaceText:
      "Los artículos de la tienda, recompensas de avatar, marcos de pasaporte y objetos coleccionables pueden modificarse, descontinuarse o actualizarse en cualquier momento.",

    subscriptionTitle:
      "Términos de suscripción",

    subscriptionText:
      "Las suscripciones Legathon Premium y Elite se renuevan automáticamente a menos que se cancelen mediante la plataforma o proveedor de facturación correspondiente.",

    communityTitle:
      "Reglas de la comunidad",

    communityText:
      "Los usuarios deben tratar a los demás con respeto. El acoso, discurso de odio, suplantación de identidad, spam, trampas y comportamiento abusivo pueden resultar en restricciones de la cuenta.",

    accountRules:
      "Reglas de la cuenta",

    accurateInfo:
      "Proporciona información precisa de la cuenta",

    protectLogin:
      "Protege tus credenciales de acceso",

    responsibleUse:
      "Utiliza la plataforma de forma responsable",

    noFakeActivity:
      "No se permite actividad falsa ni manipulación de recompensas",

    noUnauthorizedAccess:
      "No se permiten intentos de acceso no autorizado",

    safetyNotice:
      "AVISO DE SEGURIDAD",

    walkSafely:
      "Camina con seguridad",

    safetyText:
      "Mantente siempre atento a tu entorno mientras caminas. No utilices Legathon Walk de una manera que te distraiga del tráfico, peligros o situaciones de emergencia.",

    support:
      "SOPORTE",

    questionsTitle:
      "¿Preguntas sobre estos términos?",

    contactText:
      "Contacta con el soporte de Legathon Walk para consultas sobre acceso a la cuenta, suscripciones, compras, recompensas o políticas.",

    contactSupport:
      "Contactar soporte",

    lastUpdated:
      "Última actualización: junio de 2026",
  },


  // ==========================================================
  // FRENCH
  // ==========================================================

  fr: {
    back: "‹ Retour",

    kicker: "CONDITIONS D’UTILISATION",
    title: "Utilisation de Legathon Walk",

    welcomeTitle:
      "Bienvenue sur Legathon Walk",

    welcomeText:
      "En utilisant Legathon Walk, vous acceptez les présentes conditions concernant le suivi des pas, les récompenses, la participation à la communauté, les abonnements, les achats et l’utilisation du compte.",

    stepTitle:
      "Avis concernant le suivi des pas",

    stepText:
      "Legathon Walk utilise les capteurs de l’appareil, Apple Health, Google Fit et d’autres sources de suivi. Le nombre de pas peut varier et son exactitude parfaite n’est pas garantie.",

    rewardsTitle:
      "Récompenses et W Coins",

    rewardsText:
      "Les W Coins, succès, récompenses, badges et objets de collection sont des éléments virtuels et n’ont aucune valeur monétaire sauf indication contraire.",

    marketplaceTitle:
      "Conditions de la boutique",

    marketplaceText:
      "Les articles de la boutique, récompenses d’avatar, cadres de passeport et objets de collection peuvent être modifiés, supprimés ou mis à jour à tout moment.",

    subscriptionTitle:
      "Conditions d’abonnement",

    subscriptionText:
      "Les abonnements Legathon Premium et Elite sont renouvelés automatiquement sauf s’ils sont annulés via la plateforme ou le fournisseur de paiement approprié.",

    communityTitle:
      "Règles de la communauté",

    communityText:
      "Les utilisateurs doivent traiter les autres avec respect. Le harcèlement, les discours haineux, l’usurpation d’identité, le spam, la triche et les comportements abusifs peuvent entraîner des restrictions du compte.",

    accountRules:
      "Règles du compte",

    accurateInfo:
      "Fournissez des informations de compte exactes",

    protectLogin:
      "Protégez vos identifiants de connexion",

    responsibleUse:
      "Utilisez la plateforme de manière responsable",

    noFakeActivity:
      "Aucune fausse activité ou manipulation des récompenses",

    noUnauthorizedAccess:
      "Aucune tentative d’accès non autorisé",

    safetyNotice:
      "AVIS DE SÉCURITÉ",

    walkSafely:
      "Marchez en toute sécurité",

    safetyText:
      "Restez toujours attentif à votre environnement lorsque vous marchez. N’utilisez pas Legathon Walk d’une manière qui pourrait vous distraire de la circulation, des dangers ou des situations d’urgence.",

    support:
      "ASSISTANCE",

    questionsTitle:
      "Des questions sur ces conditions ?",

    contactText:
      "Contactez l’assistance Legathon Walk pour toute question concernant l’accès au compte, les abonnements, les achats, les récompenses ou les politiques.",

    contactSupport:
      "Contacter l’assistance",

    lastUpdated:
      "Dernière mise à jour : juin 2026",
  },


  // ==========================================================
  // GERMAN
  // ==========================================================

  de: {
    back: "‹ Zurück",

    kicker: "NUTZUNGSBEDINGUNGEN",
    title: "Legathon Walk verwenden",

    welcomeTitle:
      "Willkommen bei Legathon Walk",

    welcomeText:
      "Durch die Nutzung von Legathon Walk stimmst du diesen Bedingungen für Schrittverfolgung, Belohnungen, Community-Teilnahme, Abonnements, Käufe und Kontonutzung zu.",

    stepTitle:
      "Hinweis zur Schrittverfolgung",

    stepText:
      "Legathon Walk verwendet Gerätesensoren, Apple Health, Google Fit und andere Tracking-Quellen. Schrittzahlen können variieren und eine vollständig genaue Erfassung kann nicht garantiert werden.",

    rewardsTitle:
      "Belohnungen & W Coins",

    rewardsText:
      "W Coins, Erfolge, Belohnungen, Abzeichen und Sammlerstücke sind virtuelle Elemente und haben keinen Geldwert, sofern nicht ausdrücklich anders angegeben.",

    marketplaceTitle:
      "Shop-Bedingungen",

    marketplaceText:
      "Shop-Artikel, Avatar-Belohnungen, Passrahmen und Sammlerstücke können jederzeit geändert, eingestellt oder aktualisiert werden.",

    subscriptionTitle:
      "Abonnementbedingungen",

    subscriptionText:
      "Legathon Premium- und Elite-Abonnements verlängern sich automatisch, sofern sie nicht über die entsprechende Plattform oder den Zahlungsanbieter gekündigt werden.",

    communityTitle:
      "Community-Regeln",

    communityText:
      "Nutzer müssen andere respektvoll behandeln. Belästigung, Hassrede, Identitätsmissbrauch, Spam, Betrug und missbräuchliches Verhalten können zu Kontoeinschränkungen führen.",

    accountRules:
      "Kontoregeln",

    accurateInfo:
      "Gib korrekte Kontoinformationen an",

    protectLogin:
      "Schütze deine Anmeldedaten",

    responsibleUse:
      "Nutze die Plattform verantwortungsvoll",

    noFakeActivity:
      "Keine gefälschten Aktivitäten oder Belohnungsmanipulation",

    noUnauthorizedAccess:
      "Keine unbefugten Zugriffsversuche",

    safetyNotice:
      "SICHERHEITSHINWEIS",

    walkSafely:
      "Sicher gehen",

    safetyText:
      "Achte beim Gehen immer auf deine Umgebung. Verwende Legathon Walk nicht auf eine Weise, die dich vom Verkehr, von Gefahren oder von Notfallsituationen ablenkt.",

    support:
      "SUPPORT",

    questionsTitle:
      "Fragen zu diesen Bedingungen?",

    contactText:
      "Wende dich bei Fragen zu Kontozugriff, Abonnements, Käufen, Belohnungen oder Richtlinien an den Legathon Walk Support.",

    contactSupport:
      "Support kontaktieren",

    lastUpdated:
      "Zuletzt aktualisiert: Juni 2026",
  },


  // ==========================================================
  // PORTUGUESE
  // ==========================================================

  pt: {
    back: "‹ Voltar",

    kicker: "TERMOS DE SERVIÇO",
    title: "Usando o Legathon Walk",

    welcomeTitle:
      "Bem-vindo ao Legathon Walk",

    welcomeText:
      "Ao utilizar o Legathon Walk, você concorda com estes termos que regem o acompanhamento de passos, recompensas, participação na comunidade, assinaturas, compras e uso da conta.",

    stepTitle:
      "Aviso sobre contagem de passos",

    stepText:
      "O Legathon Walk utiliza sensores do dispositivo, Apple Health, Google Fit e outras fontes de acompanhamento. A contagem de passos pode variar e não há garantia de precisão absoluta.",

    rewardsTitle:
      "Recompensas e W Coins",

    rewardsText:
      "W Coins, conquistas, recompensas, medalhas e itens colecionáveis são itens virtuais e não possuem valor em dinheiro, salvo quando especificamente indicado.",

    marketplaceTitle:
      "Termos da loja",

    marketplaceText:
      "Itens da loja, recompensas de avatar, molduras de passaporte e colecionáveis podem ser modificados, descontinuados ou atualizados a qualquer momento.",

    subscriptionTitle:
      "Termos de assinatura",

    subscriptionText:
      "As assinaturas Legathon Premium e Elite são renovadas automaticamente, a menos que sejam canceladas pela plataforma ou pelo provedor de cobrança apropriado.",

    communityTitle:
      "Regras da comunidade",

    communityText:
      "Os usuários devem tratar os outros com respeito. Assédio, discurso de ódio, falsidade ideológica, spam, trapaça e comportamento abusivo podem resultar em restrições da conta.",

    accountRules:
      "Regras da conta",

    accurateInfo:
      "Forneça informações corretas da conta",

    protectLogin:
      "Proteja suas credenciais de acesso",

    responsibleUse:
      "Use a plataforma com responsabilidade",

    noFakeActivity:
      "Não manipule atividades ou recompensas",

    noUnauthorizedAccess:
      "Não tente obter acesso não autorizado",

    safetyNotice:
      "AVISO DE SEGURANÇA",

    walkSafely:
      "Caminhe com segurança",

    safetyText:
      "Esteja sempre atento ao ambiente ao seu redor enquanto caminha. Não utilize o Legathon Walk de maneira que possa distraí-lo do trânsito, perigos ou situações de emergência.",

    support:
      "SUPORTE",

    questionsTitle:
      "Dúvidas sobre estes termos?",

    contactText:
      "Entre em contato com o suporte do Legathon Walk para questões relacionadas ao acesso à conta, assinaturas, compras, recompensas ou políticas.",

    contactSupport:
      "Contatar suporte",

    lastUpdated:
      "Última atualização: junho de 2026",
  },


  // ==========================================================
  // JAPANESE
  // ==========================================================

  ja: {
    back: "‹ 戻る",

    kicker: "利用規約",
    title: "Legathon Walk の利用",

    welcomeTitle:
      "Legathon Walkへようこそ",

    welcomeText:
      "Legathon Walkを利用することで、歩数追跡、報酬、コミュニティへの参加、サブスクリプション、購入、アカウント利用に関する本規約に同意したものとみなされます。",

    stepTitle:
      "歩数追跡に関する免責事項",

    stepText:
      "Legathon Walkは、端末センサー、Apple Health、Google Fitなどの追跡情報を使用します。歩数は変動する場合があり、完全な正確性は保証されません。",

    rewardsTitle:
      "報酬とW Coin",

    rewardsText:
      "W Coin、実績、報酬、バッジ、コレクションアイテムは仮想アイテムであり、明示されている場合を除き現金価値はありません。",

    marketplaceTitle:
      "ストア利用条件",

    marketplaceText:
      "ストア商品、アバター報酬、パスポートフレーム、コレクションアイテムは、いつでも変更、終了、更新される場合があります。",

    subscriptionTitle:
      "サブスクリプション規約",

    subscriptionText:
      "Legathon PremiumおよびEliteのサブスクリプションは、適切なプラットフォームまたは決済サービスで解約されない限り自動更新されます。",

    communityTitle:
      "コミュニティルール",

    communityText:
      "利用者は他の利用者を尊重する必要があります。嫌がらせ、ヘイトスピーチ、なりすまし、スパム、不正行為、迷惑行為はアカウント制限の対象となる場合があります。",

    accountRules:
      "アカウントルール",

    accurateInfo:
      "正確なアカウント情報を提供する",

    protectLogin:
      "ログイン情報を安全に管理する",

    responsibleUse:
      "責任を持ってプラットフォームを利用する",

    noFakeActivity:
      "不正な活動や報酬操作を行わない",

    noUnauthorizedAccess:
      "不正アクセスを試みない",

    safetyNotice:
      "安全上の注意",

    walkSafely:
      "安全に歩きましょう",

    safetyText:
      "歩行中は常に周囲の状況に注意してください。交通、危険物、緊急事態への注意を妨げるような方法でLegathon Walkを使用しないでください。",

    support:
      "サポート",

    questionsTitle:
      "利用規約についてご質問がありますか？",

    contactText:
      "アカウントアクセス、サブスクリプション、購入、報酬、ポリシーに関するご質問はLegathon Walkサポートまでお問い合わせください。",

    contactSupport:
      "サポートに連絡",

    lastUpdated:
      "最終更新：2026年6月",
  },


  // ==========================================================
  // KOREAN
  // ==========================================================

  ko: {
    back: "‹ 뒤로",

    kicker: "서비스 이용약관",
    title: "Legathon Walk 이용",

    welcomeTitle:
      "Legathon Walk에 오신 것을 환영합니다",

    welcomeText:
      "Legathon Walk를 사용함으로써 걸음 수 추적, 보상, 커뮤니티 참여, 구독, 구매 및 계정 사용에 관한 본 약관에 동의하게 됩니다.",

    stepTitle:
      "걸음 수 추적 안내",

    stepText:
      "Legathon Walk는 기기 센서, Apple Health, Google Fit 및 기타 추적 정보를 사용합니다. 걸음 수는 달라질 수 있으며 완벽한 정확성을 보장하지 않습니다.",

    rewardsTitle:
      "보상 및 W Coin",

    rewardsText:
      "W Coin, 업적, 보상, 배지 및 수집품은 가상 아이템이며 별도로 명시되지 않는 한 현금 가치를 갖지 않습니다.",

    marketplaceTitle:
      "스토어 이용약관",

    marketplaceText:
      "스토어 상품, 아바타 보상, 패스포트 프레임 및 수집품은 언제든지 변경, 중단 또는 업데이트될 수 있습니다.",

    subscriptionTitle:
      "구독 약관",

    subscriptionText:
      "Legathon Premium 및 Elite 구독은 해당 플랫폼 또는 결제 제공업체를 통해 취소하지 않는 한 자동으로 갱신됩니다.",

    communityTitle:
      "커뮤니티 규칙",

    communityText:
      "사용자는 서로를 존중해야 합니다. 괴롭힘, 혐오 발언, 사칭, 스팸, 부정행위 및 악의적인 행동은 계정 제한으로 이어질 수 있습니다.",

    accountRules:
      "계정 규칙",

    accurateInfo:
      "정확한 계정 정보를 제공하세요",

    protectLogin:
      "로그인 정보를 안전하게 보호하세요",

    responsibleUse:
      "플랫폼을 책임감 있게 사용하세요",

    noFakeActivity:
      "허위 활동 또는 보상 조작 금지",

    noUnauthorizedAccess:
      "무단 접근 시도 금지",

    safetyNotice:
      "안전 안내",

    walkSafely:
      "안전하게 걸으세요",

    safetyText:
      "걷는 동안 항상 주변 환경에 주의를 기울이세요. 교통, 위험 요소 또는 긴급 상황에 대한 주의를 방해하는 방식으로 Legathon Walk를 사용하지 마세요.",

    support:
      "지원",

    questionsTitle:
      "이 약관에 대해 궁금한 점이 있나요?",

    contactText:
      "계정 접근, 구독, 구매, 보상 또는 정책에 관한 문의는 Legathon Walk 지원팀에 문의하세요.",

    contactSupport:
      "지원팀에 문의",

    lastUpdated:
      "최종 업데이트: 2026년 6월",
  },


  // ==========================================================
  // CHINESE
  // ==========================================================

  zh: {
    back: "‹ 返回",

    kicker: "服务条款",
    title: "使用 Legathon Walk",

    welcomeTitle:
      "欢迎使用 Legathon Walk",

    welcomeText:
      "使用 Legathon Walk 即表示您同意这些关于步数追踪、奖励、社区参与、订阅、购买以及账户使用的条款。",

    stepTitle:
      "步数追踪免责声明",

    stepText:
      "Legathon Walk 使用设备传感器、Apple Health、Google Fit 以及其他追踪来源。步数可能存在差异，我们无法保证其完全准确。",

    rewardsTitle:
      "奖励与 W Coin",

    rewardsText:
      "W Coin、成就、奖励、徽章和收藏品属于虚拟项目，除非另有明确说明，否则不具有现金价值。",

    marketplaceTitle:
      "商店条款",

    marketplaceText:
      "商店商品、头像奖励、护照边框以及收藏品可能随时修改、停止提供或更新。",

    subscriptionTitle:
      "订阅条款",

    subscriptionText:
      "Legathon Premium 和 Elite 订阅将自动续订，除非您通过相应的平台或付款服务提供商取消订阅。",

    communityTitle:
      "社区规则",

    communityText:
      "用户必须尊重他人。骚扰、仇恨言论、冒充他人、垃圾信息、作弊以及其他滥用行为可能导致账户受到限制。",

    accountRules:
      "账户规则",

    accurateInfo:
      "提供准确的账户信息",

    protectLogin:
      "保护您的登录凭据",

    responsibleUse:
      "负责任地使用平台",

    noFakeActivity:
      "禁止虚假活动或操纵奖励",

    noUnauthorizedAccess:
      "禁止未经授权的访问尝试",

    safetyNotice:
      "安全提示",

    walkSafely:
      "安全步行",

    safetyText:
      "步行时请始终注意周围环境。请勿以可能分散您对交通、危险或紧急情况注意力的方式使用 Legathon Walk。",

    support:
      "支持",

    questionsTitle:
      "对这些条款有疑问？",

    contactText:
      "如对账户访问、订阅、购买、奖励或政策有疑问，请联系 Legathon Walk 支持团队。",

    contactSupport:
      "联系支持",

    lastUpdated:
      "最后更新：2026年6月",
  },


  // ==========================================================
  // ITALIAN
  // ==========================================================

  it: {
    back: "‹ Indietro",

    kicker: "TERMINI DI SERVIZIO",
    title: "Utilizzo di Legathon Walk",

    welcomeTitle:
      "Benvenuto su Legathon Walk",

    welcomeText:
      "Utilizzando Legathon Walk, accetti questi termini relativi al monitoraggio dei passi, alle ricompense, alla partecipazione alla community, agli abbonamenti, agli acquisti e all’utilizzo dell’account.",

    stepTitle:
      "Avviso sul monitoraggio dei passi",

    stepText:
      "Legathon Walk utilizza i sensori del dispositivo, Apple Health, Google Fit e altre fonti di monitoraggio. Il conteggio dei passi può variare e non è garantita una precisione assoluta.",

    rewardsTitle:
      "Ricompense e W Coin",

    rewardsText:
      "W Coin, obiettivi, ricompense, badge e oggetti da collezione sono elementi virtuali e non hanno valore monetario salvo diversa indicazione.",

    marketplaceTitle:
      "Termini dello store",

    marketplaceText:
      "Gli articoli dello store, le ricompense avatar, le cornici del passaporto e gli oggetti da collezione possono essere modificati, rimossi o aggiornati in qualsiasi momento.",

    subscriptionTitle:
      "Termini di abbonamento",

    subscriptionText:
      "Gli abbonamenti Legathon Premium ed Elite si rinnovano automaticamente salvo cancellazione tramite la piattaforma o il fornitore di pagamento appropriato.",

    communityTitle:
      "Regole della community",

    communityText:
      "Gli utenti devono trattare gli altri con rispetto. Molestie, discorsi d’odio, impersonificazione, spam, imbrogli e comportamenti abusivi possono comportare restrizioni dell’account.",

    accountRules:
      "Regole dell’account",

    accurateInfo:
      "Fornisci informazioni accurate sull’account",

    protectLogin:
      "Proteggi le tue credenziali di accesso",

    responsibleUse:
      "Utilizza la piattaforma responsabilmente",

    noFakeActivity:
      "Nessuna attività falsa o manipolazione delle ricompense",

    noUnauthorizedAccess:
      "Nessun tentativo di accesso non autorizzato",

    safetyNotice:
      "AVVISO DI SICUREZZA",

    walkSafely:
      "Cammina in sicurezza",

    safetyText:
      "Presta sempre attenzione all’ambiente circostante mentre cammini. Non utilizzare Legathon Walk in modo da distrarti dal traffico, dai pericoli o dalle situazioni di emergenza.",

    support:
      "ASSISTENZA",

    questionsTitle:
      "Domande su questi termini?",

    contactText:
      "Contatta l’assistenza Legathon Walk per domande relative all’accesso all’account, agli abbonamenti, agli acquisti, alle ricompense o alle politiche.",

    contactSupport:
      "Contatta l’assistenza",

    lastUpdated:
      "Ultimo aggiornamento: giugno 2026",
  },


  // ==========================================================
  // ARABIC
  // ==========================================================

  ar: {
    back: "رجوع ›",

    kicker: "شروط الخدمة",
    title: "استخدام Legathon Walk",

    welcomeTitle:
      "مرحبًا بك في Legathon Walk",

    welcomeText:
      "باستخدام Legathon Walk، فإنك توافق على هذه الشروط التي تحكم تتبع الخطوات والمكافآت والمشاركة في المجتمع والاشتراكات والمشتريات واستخدام الحساب.",

    stepTitle:
      "إخلاء مسؤولية تتبع الخطوات",

    stepText:
      "يعتمد Legathon Walk على مستشعرات الجهاز وApple Health وGoogle Fit ومصادر تتبع أخرى. قد يختلف عدد الخطوات ولا يمكن ضمان دقته بشكل كامل.",

    rewardsTitle:
      "المكافآت و W Coin",

    rewardsText:
      "تُعد W Coin والإنجازات والمكافآت والشارات والمقتنيات عناصر افتراضية ولا تحمل قيمة نقدية إلا إذا تم توضيح ذلك بشكل صريح.",

    marketplaceTitle:
      "شروط المتجر",

    marketplaceText:
      "قد يتم تعديل عناصر المتجر ومكافآت الصور الرمزية وإطارات جواز السفر والمقتنيات أو إيقافها أو تحديثها في أي وقت.",

    subscriptionTitle:
      "شروط الاشتراك",

    subscriptionText:
      "يتم تجديد اشتراكات Legathon Premium وElite تلقائيًا ما لم يتم إلغاؤها من خلال المنصة أو مزود الدفع المناسب.",

    communityTitle:
      "قواعد المجتمع",

    communityText:
      "يجب على المستخدمين معاملة الآخرين باحترام. قد تؤدي المضايقة أو خطاب الكراهية أو انتحال الهوية أو الرسائل المزعجة أو الغش أو السلوك المسيء إلى فرض قيود على الحساب.",

    accountRules:
      "قواعد الحساب",

    accurateInfo:
      "قدّم معلومات حساب دقيقة",

    protectLogin:
      "احمِ بيانات تسجيل الدخول الخاصة بك",

    responsibleUse:
      "استخدم المنصة بمسؤولية",

    noFakeActivity:
      "يُمنع النشاط المزيف أو التلاعب بالمكافآت",

    noUnauthorizedAccess:
      "يُمنع إجراء محاولات وصول غير مصرح بها",

    safetyNotice:
      "تنبيه السلامة",

    walkSafely:
      "امشِ بأمان",

    safetyText:
      "كن دائمًا منتبهًا لما يحيط بك أثناء المشي. لا تستخدم Legathon Walk بطريقة تشتت انتباهك عن حركة المرور أو المخاطر أو حالات الطوارئ.",

    support:
      "الدعم",

    questionsTitle:
      "هل لديك أسئلة حول هذه الشروط؟",

    contactText:
      "تواصل مع دعم Legathon Walk بشأن الوصول إلى الحساب أو الاشتراكات أو المشتريات أو المكافآت أو الأسئلة المتعلقة بالسياسات.",

    contactSupport:
      "الاتصال بالدعم",

    lastUpdated:
      "آخر تحديث: يونيو 2026",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code =
    String(language || "en")
      .toLowerCase()
      .split("-")[0];

  return TEXT[code]
    ? code
    : "en";
}


function getText(language, key) {
  const code =
    normalizeLanguage(language);

  return (
    TEXT?.[code]?.[key] ||
    TEXT?.en?.[key] ||
    key
  );
}


// ============================================================
// SCREEN
// ============================================================

export default function TermsOfServiceScreen({
  goBack,
  language = "en",
  goToSupport,
}) {

  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";


  const t = (key) =>
    getText(
      languageCode,
      key
    );


  const textDirection =
    isRTL
      ? styles.rtlText
      : null;


  return (
    <ImageBackground
      source={LEGATHON_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >

      <View
        style={styles.overlay}
      >

        <SafeAreaView
          style={styles.safe}
        >

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.content
            }
          >

            {/* ============================================= */}
            {/* BACK */}
            {/* ============================================= */}

            {typeof goBack ===
              "function" && (

              <TouchableOpacity
                style={styles.backButton}
                onPress={goBack}
                activeOpacity={0.8}
              >

                <Text
                  style={[
                    styles.backText,
                    textDirection,
                  ]}
                >
                  {t("back")}
                </Text>

              </TouchableOpacity>
            )}


            {/* ============================================= */}
            {/* HEADER */}
            {/* ============================================= */}

            <Text
              style={[
                styles.kicker,
                textDirection,
              ]}
            >
              {t("kicker")}
            </Text>


            <Text
              style={[
                styles.title,
                textDirection,
              ]}
            >
              {t("title")}
            </Text>


            {/* ============================================= */}
            {/* INTRO */}
            {/* ============================================= */}

            <View
              style={styles.heroCard}
            >

              <Text
                style={styles.heroIcon}
              >
                📜
              </Text>


              <Text
                style={[
                  styles.heroTitle,
                  textDirection,
                ]}
              >
                {t("welcomeTitle")}
              </Text>


              <Text
                style={[
                  styles.heroText,
                  textDirection,
                ]}
              >
                {t("welcomeText")}
              </Text>

            </View>


            {/* ============================================= */}
            {/* TERMS */}
            {/* ============================================= */}

            <TermCard
              icon="👟"
              title={t("stepTitle")}
              text={t("stepText")}
              isRTL={isRTL}
            />


            <TermCard
              icon="🪙"
              title={t("rewardsTitle")}
              text={t("rewardsText")}
              isRTL={isRTL}
            />


            <TermCard
              icon="🛍️"
              title={t("marketplaceTitle")}
              text={t("marketplaceText")}
              isRTL={isRTL}
            />


            <TermCard
              icon="⭐"
              title={t("subscriptionTitle")}
              text={t("subscriptionText")}
              isRTL={isRTL}
            />


            <TermCard
              icon="🌎"
              title={t("communityTitle")}
              text={t("communityText")}
              isRTL={isRTL}
            />


            {/* ============================================= */}
            {/* ACCOUNT RULES */}
            {/* ============================================= */}

            <View
              style={styles.sectionCard}
            >

              <Text
                style={[
                  styles.sectionTitle,
                  textDirection,
                ]}
              >
                {t("accountRules")}
              </Text>


              <RuleRow
                icon="✅"
                text={t("accurateInfo")}
                isRTL={isRTL}
              />


              <RuleRow
                icon="✅"
                text={t("protectLogin")}
                isRTL={isRTL}
              />


              <RuleRow
                icon="✅"
                text={t("responsibleUse")}
                isRTL={isRTL}
              />


              <RuleRow
                icon="❌"
                text={t("noFakeActivity")}
                isRTL={isRTL}
              />


              <RuleRow
                icon="❌"
                text={t("noUnauthorizedAccess")}
                isRTL={isRTL}
              />

            </View>


            {/* ============================================= */}
            {/* SAFETY */}
            {/* ============================================= */}

            <View
              style={styles.safetyCard}
            >

              <Text
                style={[
                  styles.safetyLabel,
                  textDirection,
                ]}
              >
                {t("safetyNotice")}
              </Text>


              <Text
                style={[
                  styles.safetyTitle,
                  textDirection,
                ]}
              >
                {t("walkSafely")}
              </Text>


              <Text
                style={[
                  styles.safetyText,
                  textDirection,
                ]}
              >
                {t("safetyText")}
              </Text>

            </View>


            {/* ============================================= */}
            {/* SUPPORT */}
            {/* ============================================= */}

            <View
              style={styles.contactCard}
            >

              <Text
                style={[
                  styles.contactLabel,
                  textDirection,
                ]}
              >
                {t("support")}
              </Text>


              <Text
                style={[
                  styles.contactTitle,
                  textDirection,
                ]}
              >
                {t("questionsTitle")}
              </Text>


              <Text
                style={[
                  styles.contactText,
                  textDirection,
                ]}
              >
                {t("contactText")}
              </Text>


              {typeof goToSupport ===
                "function" && (

                <TouchableOpacity
                  style={
                    styles.contactButton
                  }
                  onPress={
                    goToSupport
                  }
                  activeOpacity={
                    0.85
                  }
                >

                  <Text
                    style={[
                      styles.contactButtonText,
                      textDirection,
                    ]}
                  >
                    {t("contactSupport")}
                  </Text>

                </TouchableOpacity>
              )}

            </View>


            {/* ============================================= */}
            {/* FOOTER */}
            {/* ============================================= */}

            <Text
              style={[
                styles.footerText,
                textDirection,
              ]}
            >
              {t("lastUpdated")}
            </Text>

          </ScrollView>

        </SafeAreaView>

      </View>

    </ImageBackground>
  );
}


// ============================================================
// TERM CARD
// ============================================================

function TermCard({
  icon,
  title,
  text,
  isRTL = false,
}) {

  return (
    <View
      style={[
        styles.termCard,

        isRTL &&
          styles.rowRTL,
      ]}
    >

      <Text
        style={[
          styles.termIcon,

          isRTL &&
            styles.termIconRTL,
        ]}
      >
        {icon}
      </Text>


      <View
        style={styles.flexOne}
      >

        <Text
          style={[
            styles.termTitle,

            isRTL &&
              styles.rtlText,
          ]}
        >
          {title}
        </Text>


        <Text
          style={[
            styles.termText,

            isRTL &&
              styles.rtlText,
          ]}
        >
          {text}
        </Text>

      </View>

    </View>
  );
}


// ============================================================
// RULE ROW
// ============================================================

function RuleRow({
  icon,
  text,
  isRTL = false,
}) {

  return (
    <View
      style={[
        styles.ruleRow,

        isRTL &&
          styles.rowRTL,
      ]}
    >

      <Text
        style={[
          styles.ruleIcon,

          isRTL &&
            styles.ruleIconRTL,
        ]}
      >
        {icon}
      </Text>


      <Text
        style={[
          styles.ruleText,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {text}
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
      backgroundColor: "#020617",
    },


    backgroundImage: {
      resizeMode: "cover",
      opacity: 0.45,
    },


    overlay: {
      flex: 1,
      backgroundColor:
        "rgba(2,4,10,0.78)",
    },


    safe: {
      flex: 1,
    },


    content: {
      padding: 22,
      paddingBottom: 160,
    },


    flexOne: {
      flex: 1,
    },


    // ========================================================
    // RTL
    // ========================================================

    rtlText: {
      writingDirection: "rtl",
      textAlign: "right",
    },


    rowRTL: {
      flexDirection: "row-reverse",
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 999,
      backgroundColor:
        "rgba(8,18,37,0.88)",
      borderWidth: 1,
      borderColor:
        "rgba(212,175,55,0.45)",
      marginBottom: 24,
    },


    backText: {
      color: "#D4AF37",
      fontSize: 19,
      fontWeight: "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    kicker: {
      color: "#D4AF37",
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 4,
      marginBottom: 10,
    },


    title: {
      color: "#FFFFFF",
      fontSize: 52,
      fontWeight: "900",
      lineHeight: 58,
      marginBottom: 24,
    },


    // ========================================================
    // HERO
    // ========================================================

    heroCard: {
      backgroundColor:
        "rgba(212,175,55,0.12)",
      borderRadius: 34,
      padding: 26,
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        "rgba(212,175,55,0.42)",
      marginBottom: 24,
    },


    heroIcon: {
      fontSize: 58,
      marginBottom: 12,
    },


    heroTitle: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "900",
      textAlign: "center",
    },


    heroText: {
      color: "#CBD5E1",
      fontSize: 18,
      fontWeight: "800",
      lineHeight: 28,
      textAlign: "center",
      marginTop: 12,
    },


    // ========================================================
    // TERM CARDS
    // ========================================================

    termCard: {
      flexDirection: "row",
      backgroundColor:
        "rgba(8,18,37,0.96)",
      borderRadius: 28,
      padding: 20,
      borderWidth: 1,
      borderColor:
        "rgba(167,243,208,0.22)",
      marginBottom: 16,
    },


    termIcon: {
      fontSize: 34,
      width: 52,
    },


    termIconRTL: {
      textAlign: "right",
    },


    termTitle: {
      color: "#FFFFFF",
      fontSize: 21,
      fontWeight: "900",
    },


    termText: {
      color: "#CBD5E1",
      fontSize: 16,
      fontWeight: "800",
      lineHeight: 24,
      marginTop: 8,
    },


    // ========================================================
    // ACCOUNT RULES
    // ========================================================

    sectionCard: {
      backgroundColor:
        "rgba(8,18,37,0.96)",
      borderRadius: 34,
      padding: 24,
      borderWidth: 1,
      borderColor:
        "rgba(167,243,208,0.22)",
      marginTop: 8,
      marginBottom: 24,
    },


    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "900",
      marginBottom: 18,
    },


    ruleRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },


    ruleIcon: {
      fontSize: 24,
      width: 40,
    },


    ruleIconRTL: {
      textAlign: "right",
    },


    ruleText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
      flex: 1,
    },


    // ========================================================
    // SAFETY
    // ========================================================

    safetyCard: {
      backgroundColor:
        "rgba(167,243,208,0.1)",
      borderRadius: 34,
      padding: 24,
      borderWidth: 1,
      borderColor:
        "rgba(167,243,208,0.35)",
      marginBottom: 24,
    },


    safetyLabel: {
      color: "#A7F3D0",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 10,
    },


    safetyTitle: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "900",
    },


    safetyText: {
      color: "#CBD5E1",
      fontSize: 18,
      fontWeight: "800",
      lineHeight: 28,
      marginTop: 12,
    },


    // ========================================================
    // SUPPORT
    // ========================================================

    contactCard: {
      backgroundColor:
        "rgba(8,18,37,0.96)",
      borderRadius: 34,
      padding: 24,
      borderWidth: 1,
      borderColor:
        "rgba(212,175,55,0.28)",
      marginBottom: 24,
    },


    contactLabel: {
      color: "#D4AF37",
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 10,
    },


    contactTitle: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "900",
      lineHeight: 40,
    },


    contactText: {
      color: "#CBD5E1",
      fontSize: 18,
      fontWeight: "800",
      lineHeight: 28,
      marginTop: 12,
    },


    contactButton: {
      backgroundColor: "#D4AF37",
      borderRadius: 26,
      paddingVertical: 18,
      paddingHorizontal: 16,
      alignItems: "center",
      marginTop: 22,
    },


    contactButtonText: {
      color: "#020617",
      fontSize: 18,
      fontWeight: "900",
    },


    // ========================================================
    // FOOTER
    // ========================================================

    footerText: {
      color: "#94A3B8",
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 40,
    },
  });