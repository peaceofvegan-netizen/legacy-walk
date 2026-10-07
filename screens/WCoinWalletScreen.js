// screens/WCoinWalletScreen.js

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getWCoins } from "../utils/wcoinStorage";

// ============================================================
// ASSETS AND COLORS
// ============================================================

const BACKGROUND = require(
  "../assets/collage-background.png"
);

const WCOIN = require("../assets/wcoin.png");

const GOLD = "#E6BC43";

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "‹ Back",
    wallet: "WCOIN WALLET",
    title: "Your walking\nrewards.",
    subtitle: "Your WCoins, all in one place.",

    availableBalance: "AVAILABLE BALANCE",
    balanceCaption:
      "Earned through your Legathon activity",

    updatingBalance: "Updating balance…",
    balanceUnavailable: "Balance unavailable",
    lastKnownBalance: "Last known balance",
    checkingBalance: "Checking balance…",
    updated: "Updated",

    invalidBalance: "Invalid wallet balance.",
    refreshError:
      "Your balance could not be refreshed. Please try again.",

    refresh: "Refresh ↻",
    refreshAccessibility: "Refresh wallet balance",

    walletActivity: "Wallet activity",
    earnedToday: "Earned today",
    spentThisWeek: "Spent this week",

    unavailableHelper:
      "A dash means that activity total is not available yet.",

    useWCoins: "PUT YOUR WCOINS TO USE",
    exploreStore: "Explore the store",
    storeDescription:
      "Browse Legathon merchandise and available WCoin redemption options.",

    redeemStore: "Redeem in Store  →",
    storeUnavailable: "Store unavailable",

    footer:
      "Keep walking. Keep building your Legathon story.",
  },

  es: {
    back: "‹ Atrás",
    wallet: "BILLETERA WCOIN",
    title: "Tus recompensas\npor caminar.",
    subtitle: "Tus WCoins, todo en un solo lugar.",

    availableBalance: "SALDO DISPONIBLE",
    balanceCaption:
      "Ganado mediante tu actividad en Legathon",

    updatingBalance: "Actualizando saldo…",
    balanceUnavailable: "Saldo no disponible",
    lastKnownBalance: "Último saldo conocido",
    checkingBalance: "Consultando saldo…",
    updated: "Actualizado",

    invalidBalance: "Saldo de billetera no válido.",
    refreshError:
      "No se pudo actualizar tu saldo. Inténtalo de nuevo.",

    refresh: "Actualizar ↻",
    refreshAccessibility:
      "Actualizar saldo de la billetera",

    walletActivity: "Actividad de la billetera",
    earnedToday: "Ganado hoy",
    spentThisWeek: "Gastado esta semana",

    unavailableHelper:
      "Un guion significa que el total de actividad aún no está disponible.",

    useWCoins: "USA TUS WCOINS",
    exploreStore: "Explorar la tienda",
    storeDescription:
      "Explora productos de Legathon y las opciones disponibles para canjear WCoins.",

    redeemStore: "Canjear en la tienda  →",
    storeUnavailable: "Tienda no disponible",

    footer:
      "Sigue caminando. Sigue construyendo tu historia Legathon.",
  },

  fr: {
    back: "‹ Retour",
    wallet: "PORTEFEUILLE WCOIN",
    title: "Vos récompenses\nde marche.",
    subtitle: "Tous vos WCoins au même endroit.",

    availableBalance: "SOLDE DISPONIBLE",
    balanceCaption:
      "Gagné grâce à votre activité Legathon",

    updatingBalance: "Mise à jour du solde…",
    balanceUnavailable: "Solde indisponible",
    lastKnownBalance: "Dernier solde connu",
    checkingBalance: "Vérification du solde…",
    updated: "Mis à jour",

    invalidBalance: "Solde du portefeuille invalide.",
    refreshError:
      "Votre solde n'a pas pu être actualisé. Veuillez réessayer.",

    refresh: "Actualiser ↻",
    refreshAccessibility:
      "Actualiser le solde du portefeuille",

    walletActivity: "Activité du portefeuille",
    earnedToday: "Gagné aujourd'hui",
    spentThisWeek: "Dépensé cette semaine",

    unavailableHelper:
      "Un tiret signifie que ce total d'activité n'est pas encore disponible.",

    useWCoins: "UTILISEZ VOS WCOINS",
    exploreStore: "Explorer la boutique",
    storeDescription:
      "Découvrez les produits Legathon et les options disponibles pour utiliser vos WCoins.",

    redeemStore: "Utiliser en boutique  →",
    storeUnavailable: "Boutique indisponible",

    footer:
      "Continuez à marcher. Continuez à construire votre histoire Legathon.",
  },

  de: {
    back: "‹ Zurück",
    wallet: "WCOIN-WALLET",
    title: "Deine Geh-\nBelohnungen.",
    subtitle: "Deine WCoins an einem Ort.",

    availableBalance: "VERFÜGBARES GUTHABEN",
    balanceCaption:
      "Durch deine Legathon-Aktivität verdient",

    updatingBalance: "Guthaben wird aktualisiert…",
    balanceUnavailable: "Guthaben nicht verfügbar",
    lastKnownBalance: "Letzter bekannter Kontostand",
    checkingBalance: "Guthaben wird geprüft…",
    updated: "Aktualisiert",

    invalidBalance: "Ungültiges Wallet-Guthaben.",
    refreshError:
      "Dein Guthaben konnte nicht aktualisiert werden. Bitte versuche es erneut.",

    refresh: "Aktualisieren ↻",
    refreshAccessibility:
      "Wallet-Guthaben aktualisieren",

    walletActivity: "Wallet-Aktivität",
    earnedToday: "Heute verdient",
    spentThisWeek: "Diese Woche ausgegeben",

    unavailableHelper:
      "Ein Strich bedeutet, dass dieser Aktivitätswert noch nicht verfügbar ist.",

    useWCoins: "NUTZE DEINE WCOINS",
    exploreStore: "Shop entdecken",
    storeDescription:
      "Entdecke Legathon-Produkte und verfügbare WCoin-Einlöseoptionen.",

    redeemStore: "Im Shop einlösen  →",
    storeUnavailable: "Shop nicht verfügbar",

    footer:
      "Geh weiter. Schreibe deine Legathon-Geschichte weiter.",
  },

  pt: {
    back: "‹ Voltar",
    wallet: "CARTEIRA WCOIN",
    title: "Suas recompensas\nde caminhada.",
    subtitle: "Seus WCoins, todos em um só lugar.",

    availableBalance: "SALDO DISPONÍVEL",
    balanceCaption:
      "Ganhos através da sua atividade Legathon",

    updatingBalance: "Atualizando saldo…",
    balanceUnavailable: "Saldo indisponível",
    lastKnownBalance: "Último saldo conhecido",
    checkingBalance: "Verificando saldo…",
    updated: "Atualizado",

    invalidBalance: "Saldo da carteira inválido.",
    refreshError:
      "Não foi possível atualizar seu saldo. Tente novamente.",

    refresh: "Atualizar ↻",
    refreshAccessibility:
      "Atualizar saldo da carteira",

    walletActivity: "Atividade da carteira",
    earnedToday: "Ganhos hoje",
    spentThisWeek: "Gasto esta semana",

    unavailableHelper:
      "Um traço significa que esse total de atividade ainda não está disponível.",

    useWCoins: "USE SEUS WCOINS",
    exploreStore: "Explorar a loja",
    storeDescription:
      "Explore produtos Legathon e as opções disponíveis de resgate de WCoins.",

    redeemStore: "Resgatar na loja  →",
    storeUnavailable: "Loja indisponível",

    footer:
      "Continue caminhando. Continue construindo sua história Legathon.",
  },

  ja: {
    back: "‹ 戻る",
    wallet: "WCOIN ウォレット",
    title: "歩いて獲得した\nリワード。",
    subtitle: "WCoinsをひとつの場所で管理。",

    availableBalance: "利用可能残高",
    balanceCaption:
      "Legathonのアクティビティで獲得",

    updatingBalance: "残高を更新中…",
    balanceUnavailable: "残高を取得できません",
    lastKnownBalance: "最後に確認した残高",
    checkingBalance: "残高を確認中…",
    updated: "更新",

    invalidBalance: "ウォレット残高が無効です。",
    refreshError:
      "残高を更新できませんでした。もう一度お試しください。",

    refresh: "更新 ↻",
    refreshAccessibility:
      "ウォレット残高を更新",

    walletActivity: "ウォレット履歴",
    earnedToday: "今日の獲得",
    spentThisWeek: "今週の使用",

    unavailableHelper:
      "ダッシュは、そのアクティビティ合計がまだ利用できないことを示します。",

    useWCoins: "WCOINSを活用",
    exploreStore: "ストアを見る",
    storeDescription:
      "Legathonの商品と利用可能なWCoin交換オプションをご覧ください。",

    redeemStore: "ストアで交換  →",
    storeUnavailable: "ストアは利用できません",

    footer:
      "歩き続けよう。Legathonのストーリーを築き続けよう。",
  },

  ko: {
    back: "‹ 뒤로",
    wallet: "WCOIN 지갑",
    title: "걷기로 얻은\n리워드.",
    subtitle: "모든 WCoins를 한곳에서 확인하세요.",

    availableBalance: "사용 가능 잔액",
    balanceCaption:
      "Legathon 활동을 통해 획득",

    updatingBalance: "잔액 업데이트 중…",
    balanceUnavailable: "잔액을 사용할 수 없습니다",
    lastKnownBalance: "마지막 확인 잔액",
    checkingBalance: "잔액 확인 중…",
    updated: "업데이트됨",

    invalidBalance: "지갑 잔액이 올바르지 않습니다.",
    refreshError:
      "잔액을 새로 고칠 수 없습니다. 다시 시도해 주세요.",

    refresh: "새로고침 ↻",
    refreshAccessibility:
      "지갑 잔액 새로고침",

    walletActivity: "지갑 활동",
    earnedToday: "오늘 획득",
    spentThisWeek: "이번 주 사용",

    unavailableHelper:
      "대시는 해당 활동 합계를 아직 사용할 수 없음을 의미합니다.",

    useWCoins: "WCOINS 사용하기",
    exploreStore: "스토어 둘러보기",
    storeDescription:
      "Legathon 상품과 이용 가능한 WCoin 교환 옵션을 확인하세요.",

    redeemStore: "스토어에서 교환  →",
    storeUnavailable: "스토어를 사용할 수 없습니다",

    footer:
      "계속 걸으세요. 당신의 Legathon 이야기를 계속 만들어 가세요.",
  },

  zh: {
    back: "‹ 返回",
    wallet: "WCOIN 钱包",
    title: "你的步行\n奖励。",
    subtitle: "你的 WCoins，尽在一处。",

    availableBalance: "可用余额",
    balanceCaption:
      "通过你的 Legathon 活动赚取",

    updatingBalance: "正在更新余额…",
    balanceUnavailable: "余额不可用",
    lastKnownBalance: "上次已知余额",
    checkingBalance: "正在检查余额…",
    updated: "已更新",

    invalidBalance: "钱包余额无效。",
    refreshError:
      "无法刷新你的余额。请重试。",

    refresh: "刷新 ↻",
    refreshAccessibility:
      "刷新钱包余额",

    walletActivity: "钱包活动",
    earnedToday: "今日赚取",
    spentThisWeek: "本周使用",

    unavailableHelper:
      "破折号表示该活动总额暂时不可用。",

    useWCoins: "使用你的 WCOINS",
    exploreStore: "浏览商店",
    storeDescription:
      "浏览 Legathon 商品和可用的 WCoin 兑换选项。",

    redeemStore: "在商店兑换  →",
    storeUnavailable: "商店不可用",

    footer:
      "继续行走。继续书写你的 Legathon 故事。",
  },

  it: {
    back: "‹ Indietro",
    wallet: "PORTAFOGLIO WCOIN",
    title: "Le tue ricompense\nper camminare.",
    subtitle: "I tuoi WCoins, tutti in un unico posto.",

    availableBalance: "SALDO DISPONIBILE",
    balanceCaption:
      "Guadagnato attraverso la tua attività Legathon",

    updatingBalance: "Aggiornamento saldo…",
    balanceUnavailable: "Saldo non disponibile",
    lastKnownBalance: "Ultimo saldo conosciuto",
    checkingBalance: "Controllo saldo…",
    updated: "Aggiornato",

    invalidBalance: "Saldo del portafoglio non valido.",
    refreshError:
      "Impossibile aggiornare il saldo. Riprova.",

    refresh: "Aggiorna ↻",
    refreshAccessibility:
      "Aggiorna saldo del portafoglio",

    walletActivity: "Attività del portafoglio",
    earnedToday: "Guadagnato oggi",
    spentThisWeek: "Speso questa settimana",

    unavailableHelper:
      "Un trattino indica che il totale dell'attività non è ancora disponibile.",

    useWCoins: "USA I TUOI WCOINS",
    exploreStore: "Esplora lo store",
    storeDescription:
      "Scopri i prodotti Legathon e le opzioni disponibili per utilizzare i WCoins.",

    redeemStore: "Utilizza nello store  →",
    storeUnavailable: "Store non disponibile",

    footer:
      "Continua a camminare. Continua a costruire la tua storia Legathon.",
  },

  ar: {
    back: "رجوع ›",
    wallet: "محفظة WCOIN",
    title: "مكافآت\nالمشي الخاصة بك.",
    subtitle: "جميع WCoins الخاصة بك في مكان واحد.",

    availableBalance: "الرصيد المتاح",
    balanceCaption:
      "تم كسبه من خلال نشاطك في Legathon",

    updatingBalance: "جارٍ تحديث الرصيد…",
    balanceUnavailable: "الرصيد غير متاح",
    lastKnownBalance: "آخر رصيد معروف",
    checkingBalance: "جارٍ التحقق من الرصيد…",
    updated: "تم التحديث",

    invalidBalance: "رصيد المحفظة غير صالح.",
    refreshError:
      "تعذر تحديث رصيدك. يرجى المحاولة مرة أخرى.",

    refresh: "تحديث ↻",
    refreshAccessibility:
      "تحديث رصيد المحفظة",

    walletActivity: "نشاط المحفظة",
    earnedToday: "تم كسبه اليوم",
    spentThisWeek: "تم إنفاقه هذا الأسبوع",

    unavailableHelper:
      "تعني الشرطة أن إجمالي النشاط غير متاح حتى الآن.",

    useWCoins: "استخدم WCOINS الخاصة بك",
    exploreStore: "استكشف المتجر",
    storeDescription:
      "تصفح منتجات Legathon وخيارات استبدال WCoin المتاحة.",

    redeemStore: "استبدال في المتجر  ←",
    storeUnavailable: "المتجر غير متاح",

    footer:
      "استمر في المشي. واستمر في بناء قصة Legathon الخاصة بك.",
  },
};

// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(language) {
  const normalized = String(
    language || "en"
  )
    .toLowerCase()
    .split("-")[0];

  return TEXT[normalized]
    ? normalized
    : "en";
}

function getText(language, key) {
  return (
    TEXT?.[language]?.[key] ||
    TEXT?.en?.[key] ||
    key
  );
}

// ============================================================
// HELPERS
// ============================================================

function validAmount(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) &&
    parsed >= 0
    ? Math.floor(parsed)
    : null;
}

function formatAmount(
  value,
  language = "en"
) {
  if (value === null) {
    return "—";
  }

  try {
    return value.toLocaleString(
      language
    );
  } catch {
    return value.toLocaleString();
  }
}

// ============================================================
// WALLET SCREEN
// ============================================================

export default function WCoinWalletScreen({
  goBack,
  goToStore,
  wCoinBalance: incomingBalance,
  earnedToday,
  spentThisWeek,
  language = "en",
}) {
  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";

  const t = useCallback(
    key =>
      getText(
        languageCode,
        key
      ),
    [languageCode]
  );

  const [balance, setBalance] =
    useState(() =>
      validAmount(
        incomingBalance
      )
    );

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatedAt,
    setUpdatedAt,
  ] = useState(null);

  const mountedRef =
    useRef(false);

  const requestRef =
    useRef(0);

  const earned =
    validAmount(earnedToday);

  const spent =
    validAmount(spentThisWeek);

  const canOpenStore =
    typeof goToStore ===
    "function";

  // ==========================================================
  // REFRESH BALANCE
  // ==========================================================

  const refreshBalance =
    useCallback(async () => {
      const requestId =
        ++requestRef.current;

      if (
        mountedRef.current
      ) {
        setRefreshing(true);
      }

      try {
        const latest =
          validAmount(
            await getWCoins()
          );

        if (
          latest === null
        ) {
          throw new Error(
            t("invalidBalance")
          );
        }

        if (
          !mountedRef.current ||
          requestId !==
            requestRef.current
        ) {
          return;
        }

        setBalance(latest);

        setUpdatedAt(
          new Date()
        );

        setError("");
      } catch (caught) {
        console.error(
          "WCoin wallet refresh failed:",
          caught
        );

        if (
          mountedRef.current &&
          requestId ===
            requestRef.current
        ) {
          setError(
            t("refreshError")
          );
        }
      } finally {
        if (
          mountedRef.current &&
          requestId ===
            requestRef.current
        ) {
          setRefreshing(false);
        }
      }
    }, [t]);

  // ==========================================================
  // FOREGROUND REFRESH AND CLEANUP
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    const subscription =
      AppState.addEventListener(
        "change",
        nextState => {
          if (
            nextState ===
            "active"
          ) {
            void refreshBalance();
          }
        }
      );

    return () => {
      mountedRef.current =
        false;

      requestRef.current += 1;

      subscription.remove();
    };
  }, [refreshBalance]);

  // ==========================================================
  // INITIAL LOAD AND PARENT BALANCE UPDATES
  // ==========================================================

  useEffect(() => {
    void refreshBalance();
  }, [
    incomingBalance,
    refreshBalance,
  ]);

  // ==========================================================
  // BALANCE STATUS
  // ==========================================================

  let status;

  if (refreshing) {
    status =
      t("updatingBalance");
  } else if (error) {
    status =
      balance === null
        ? t(
            "balanceUnavailable"
          )
        : t(
            "lastKnownBalance"
          );
  } else if (updatedAt) {
    let timeText = "";

    try {
      timeText =
        updatedAt.toLocaleTimeString(
          languageCode,
          {
            hour: "numeric",
            minute: "2-digit",
          }
        );
    } catch {
      timeText =
        updatedAt.toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit",
          }
        );
    }

    status =
      `${t(
        "updated"
      )} ${timeText}`;
  } else {
    status =
      t("checkingBalance");
  }

  // ==========================================================
  // COMMON RTL TEXT STYLE
  // ==========================================================

  const directionStyle =
    isRTL
      ? styles.rtlText
      : null;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ImageBackground
      source={BACKGROUND}
      style={
        styles.background
      }
      imageStyle={
        styles.backgroundImage
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
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                refreshBalance
              }
              tintColor={
                GOLD
              }
              colors={[
                GOLD,
              ]}
            />
          }
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <View
            style={[
              styles.header,
              isRTL &&
                styles.rowRTL,
            ]}
          >
            {typeof goBack ===
            "function" ? (
              <TouchableOpacity
                onPress={
                  goBack
                }
                style={
                  styles.backButton
                }
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.backText,
                    directionStyle,
                  ]}
                >
                  {t("back")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <Text
              style={
                styles.brand
              }
            >
              LEGATHON
            </Text>
          </View>

          <Text
            style={[
              styles.kicker,
              directionStyle,
            ]}
          >
            {t("wallet")}
          </Text>

          <Text
            style={[
              styles.title,
              directionStyle,
            ]}
          >
            {t("title")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              directionStyle,
            ]}
          >
            {t("subtitle")}
          </Text>

          {/* ================================================= */}
          {/* AVAILABLE BALANCE */}
          {/* ================================================= */}

          <View
            style={
              styles.balanceCard
            }
          >
            <View
              style={[
                styles.balanceHeader,
                isRTL &&
                  styles.rowRTL,
              ]}
            >
              <View
                style={[
                  styles.balanceHeading,
                  isRTL &&
                    styles.balanceHeadingRTL,
                ]}
              >
                <Text
                  style={[
                    styles.balanceLabel,
                    directionStyle,
                  ]}
                >
                  {t(
                    "availableBalance"
                  )}
                </Text>

                <Text
                  style={[
                    styles.balanceCaption,
                    directionStyle,
                  ]}
                >
                  {t(
                    "balanceCaption"
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.coinContainer
                }
              >
                <Image
                  source={
                    WCOIN
                  }
                  style={
                    styles.coin
                  }
                  accessible={
                    false
                  }
                />
              </View>
            </View>

            <Text
              style={[
                styles.balance,
                directionStyle,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={
                0.35
              }
            >
              {formatAmount(
                balance,
                languageCode
              )}
            </Text>

            <Text
              style={[
                styles.currency,
                directionStyle,
              ]}
            >
              WCoins
            </Text>

            <View
              style={[
                styles.balanceFooter,
                isRTL &&
                  styles.rowRTL,
              ]}
            >
              <Text
                style={[
                  styles.updateText,
                  directionStyle,
                ]}
              >
                {status}
              </Text>

              <TouchableOpacity
                onPress={
                  refreshBalance
                }
                disabled={
                  refreshing
                }
                style={
                  styles.refreshButton
                }
                accessibilityRole="button"
                accessibilityLabel={t(
                  "refreshAccessibility"
                )}
                accessibilityState={{
                  disabled:
                    refreshing,

                  busy:
                    refreshing,
                }}
              >
                {refreshing ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      GOLD
                    }
                  />
                ) : (
                  <Text
                    style={[
                      styles.refreshText,
                      directionStyle,
                    ]}
                  >
                    {t(
                      "refresh"
                    )}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================================= */}
          {/* REFRESH ERROR */}
          {/* ================================================= */}

          {!!error && (
            <View
              style={
                styles.errorCard
              }
              accessibilityLiveRegion="polite"
            >
              <Text
                style={[
                  styles.errorText,
                  directionStyle,
                ]}
              >
                {error}
              </Text>
            </View>
          )}

          {/* ================================================= */}
          {/* WALLET ACTIVITY */}
          {/* ================================================= */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                directionStyle,
              ]}
            >
              {t(
                "walletActivity"
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statsRow,
              isRTL &&
                styles.rowRTL,
            ]}
          >
            <ActivityCard
              label={t(
                "earnedToday"
              )}
              amount={
                earned
              }
              prefix="+"
              positive
              language={
                languageCode
              }
              isRTL={
                isRTL
              }
            />

            <ActivityCard
              label={t(
                "spentThisWeek"
              )}
              amount={
                spent
              }
              prefix="−"
              language={
                languageCode
              }
              isRTL={
                isRTL
              }
            />
          </View>

          {(earned === null ||
            spent === null) && (
            <Text
              style={[
                styles.helper,
                directionStyle,
              ]}
            >
              {t(
                "unavailableHelper"
              )}
            </Text>
          )}

          {/* ================================================= */}
          {/* STORE */}
          {/* ================================================= */}

          <View
            style={
              styles.storeCard
            }
          >
            <Text
              style={[
                styles.kicker,
                directionStyle,
              ]}
            >
              {t(
                "useWCoins"
              )}
            </Text>

            <Text
              style={[
                styles.storeTitle,
                directionStyle,
              ]}
            >
              {t(
                "exploreStore"
              )}
            </Text>

            <Text
              style={[
                styles.storeDescription,
                directionStyle,
              ]}
            >
              {t(
                "storeDescription"
              )}
            </Text>

            <TouchableOpacity
              onPress={
                canOpenStore
                  ? goToStore
                  : undefined
              }
              disabled={
                !canOpenStore
              }
              accessibilityRole="button"
              accessibilityState={{
                disabled:
                  !canOpenStore,
              }}
              style={[
                styles.storeButton,

                !canOpenStore &&
                  styles.disabled,
              ]}
            >
              <Text
                style={[
                  styles.storeButtonText,
                  directionStyle,
                ]}
              >
                {canOpenStore
                  ? t(
                      "redeemStore"
                    )
                  : t(
                      "storeUnavailable"
                    )}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.footerNote,
              directionStyle,
            ]}
          >
            {t("footer")}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ============================================================
// ACTIVITY CARD
// ============================================================

function ActivityCard({
  label,
  amount,
  prefix,
  positive = false,
  language = "en",
  isRTL = false,
}) {
  const displayValue =
    amount === null
      ? "—"
      : `${
          amount > 0
            ? prefix
            : ""
        }${formatAmount(
          amount,
          language
        )}`;

  return (
    <View
      style={
        styles.statCard
      }
    >
      <Text
        style={[
          styles.statValue,

          positive
            ? styles.earnedValue
            : styles.spentValue,

          isRTL &&
            styles.rtlText,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={
          0.5
        }
      >
        {displayValue}
      </Text>

      <Text
        style={[
          styles.statLabel,
          isRTL &&
            styles.rtlText,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.statUnit,
          isRTL &&
            styles.rtlText,
        ]}
      >
        WCoins
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
        "#040817",
    },

    backgroundImage: {
      resizeMode: "cover",
      opacity: 0.12,
    },

    safe: {
      flex: 1,
      backgroundColor:
        "rgba(4,8,23,0.92)",
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 140,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 24,
    },

    rowRTL: {
      flexDirection:
        "row-reverse",
    },

    rtlText: {
      writingDirection: "rtl",
      textAlign: "right",
    },

    backButton: {
      minHeight: 44,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "#3A3540",
    },

    backText: {
      color: GOLD,
      fontSize: 17,
      fontWeight: "700",
    },

    brand: {
      color: "#9CA9BC",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 2.2,
    },

    kicker: {
      color: GOLD,
      fontSize: 11,
      lineHeight: 17,
      fontWeight: "800",
      letterSpacing: 2,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 35,
      lineHeight: 40,
      fontWeight: "900",
      marginTop: 10,
    },

    subtitle: {
      color: "#A7B3C7",
      fontSize: 15,
      lineHeight: 22,
      marginTop: 10,
      marginBottom: 24,
    },

    balanceCard: {
      backgroundColor:
        "#191B22",
      borderWidth: 1,
      borderColor: "#78652D",
      borderRadius: 26,
      padding: 22,
    },

    balanceHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    balanceHeading: {
      flex: 1,
      paddingRight: 10,
    },

    balanceHeadingRTL: {
      paddingRight: 0,
      paddingLeft: 10,
    },

    balanceLabel: {
      color: GOLD,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.5,
    },

    balanceCaption: {
      color: "#A9B0BD",
      fontSize: 12,
      lineHeight: 18,
      marginTop: 7,
    },

    coinContainer: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        "#2B2B29",
      alignItems: "center",
      justifyContent:
        "center",
    },

    coin: {
      width: 44,
      height: 44,
      resizeMode: "contain",
    },

    balance: {
      color: "#FFFFFF",
      fontSize: 57,
      fontWeight: "900",
      marginTop: 22,
      alignSelf: "stretch",
    },

    currency: {
      color: GOLD,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },

    balanceFooter: {
      borderTopWidth: 1,
      borderTopColor:
        "#363638",
      marginTop: 22,
      paddingTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    updateText: {
      color: "#A9B0BD",
      fontSize: 11,
      lineHeight: 16,
      flex: 1,
      paddingRight: 8,
    },

    refreshButton: {
      minWidth: 80,
      minHeight: 44,
      justifyContent:
        "center",
      alignItems: "center",
    },

    refreshText: {
      color: GOLD,
      fontSize: 12,
      fontWeight: "800",
    },

    sectionHeader: {
      marginTop: 25,
      marginBottom: 12,
    },

    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
    },

    statsRow: {
      flexDirection: "row",
      gap: 12,
    },

    statCard: {
      flex: 1,
      minWidth: 0,
      padding: 17,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#263347",
      backgroundColor:
        "#0C1627",
    },

    statValue: {
      fontSize: 29,
      fontWeight: "900",
      marginBottom: 8,
    },

    earnedValue: {
      color: "#A7F3D0",
    },

    spentValue: {
      color: "#E8C782",
    },

    statLabel: {
      color: "#D6DDE7",
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
    },

    statUnit: {
      color: "#7E8EA5",
      fontSize: 11,
      marginTop: 4,
    },

    helper: {
      color: "#8594AA",
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
    },

    storeCard: {
      marginTop: 24,
      padding: 20,
      borderRadius: 24,
      backgroundColor:
        "#0C1627",
      borderWidth: 1,
      borderColor: "#263347",
    },

    storeTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "800",
      marginTop: 10,
    },

    storeDescription: {
      color: "#A7B3C7",
      fontSize: 14,
      lineHeight: 22,
      marginTop: 9,
    },

    storeButton: {
      backgroundColor: GOLD,
      minHeight: 54,
      borderRadius: 17,
      paddingHorizontal: 14,
      paddingVertical: 15,
      marginTop: 20,
      justifyContent:
        "center",
      alignItems: "center",
    },

    storeButtonText: {
      color: "#08111F",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },

    disabled: {
      opacity: 0.5,
    },

    footerNote: {
      color: "#8996AB",
      textAlign: "center",
      fontSize: 12,
      lineHeight: 19,
      marginTop: 22,
      paddingHorizontal: 15,
    },

    errorCard: {
      marginTop: 12,
      borderRadius: 14,
      padding: 14,
      backgroundColor:
        "#301E28",
    },

    errorText: {
      color: "#FFD0D8",
      fontSize: 13,
      lineHeight: 20,
    },
  });