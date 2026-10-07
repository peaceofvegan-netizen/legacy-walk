// screens/PhysicalMerchStoreScreen.js

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
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import {
  getWCoins,
} from "../utils/wcoinStorage";

import {
  APPAREL_CATALOG,
} from "../assets/apparel/apparelCatalog";


// ============================================================
// LEGATHON WALK — PHYSICAL MERCH STORE
// MULTILINGUAL
// ============================================================

const WCOIN =
  require("../assets/wcoin.png");


const MAIN_CATEGORIES = [
  "Mens",
  "Womens",
  "Accessories",
];


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    storeKicker: "LEGATHON WALK STORE",
    officialStore: "Official Store",
    storeSubtitle:
      "Premium apparel, accessories, and exclusive Legathon Walk gear.",

    wCoinBalance: "W COIN BALANCE",
    walletSubtitle:
      "Use W Coins toward eligible Legathon gear and merchandise.",

    lifetimeProgress:
      "LIFETIME WALKING PROGRESS",
    lifetimeSteps: "Lifetime Steps",

    mens: "Men",
    womens: "Women",
    accessories: "Accessories",

    mensCollection: "Men's Collection",
    womensCollection: "Women's Collection",
    accessoriesCollection: "Accessories",

    locked: "LOCKED",
    unlockAt: "UNLOCK AT",
    steps: "steps",

    wCoinsAvailable: "W Coins available",
    moreWCoinsNeeded: "More W Coins needed",

    buyRedeem: "Buy / Redeem",
    lockedButton: "Locked",

    gear: "Gear",
    legathonItem: "Legathon Item",
  },


  es: {
    back: "Atrás",
    storeKicker: "TIENDA LEGATHON WALK",
    officialStore: "Tienda Oficial",
    storeSubtitle:
      "Ropa premium, accesorios y productos exclusivos de Legathon Walk.",

    wCoinBalance: "SALDO DE W COINS",
    walletSubtitle:
      "Usa W Coins en productos y artículos Legathon elegibles.",

    lifetimeProgress:
      "PROGRESO TOTAL DE CAMINATA",
    lifetimeSteps: "Pasos Totales",

    mens: "Hombres",
    womens: "Mujeres",
    accessories: "Accesorios",

    mensCollection: "Colección para Hombres",
    womensCollection: "Colección para Mujeres",
    accessoriesCollection: "Accesorios",

    locked: "BLOQUEADO",
    unlockAt: "DESBLOQUEAR EN",
    steps: "pasos",

    wCoinsAvailable: "W Coins disponibles",
    moreWCoinsNeeded: "Se necesitan más W Coins",

    buyRedeem: "Comprar / Canjear",
    lockedButton: "Bloqueado",

    gear: "Equipo",
    legathonItem: "Artículo Legathon",
  },


  fr: {
    back: "Retour",
    storeKicker: "BOUTIQUE LEGATHON WALK",
    officialStore: "Boutique Officielle",
    storeSubtitle:
      "Vêtements premium, accessoires et équipements exclusifs Legathon Walk.",

    wCoinBalance: "SOLDE W COINS",
    walletSubtitle:
      "Utilisez vos W Coins pour les articles Legathon éligibles.",

    lifetimeProgress:
      "PROGRESSION DE MARCHE TOTALE",
    lifetimeSteps: "Pas Totaux",

    mens: "Hommes",
    womens: "Femmes",
    accessories: "Accessoires",

    mensCollection: "Collection Hommes",
    womensCollection: "Collection Femmes",
    accessoriesCollection: "Accessoires",

    locked: "VERROUILLÉ",
    unlockAt: "DÉBLOQUER À",
    steps: "pas",

    wCoinsAvailable: "W Coins disponibles",
    moreWCoinsNeeded:
      "Plus de W Coins nécessaires",

    buyRedeem: "Acheter / Échanger",
    lockedButton: "Verrouillé",

    gear: "Équipement",
    legathonItem: "Article Legathon",
  },


  de: {
    back: "Zurück",
    storeKicker: "LEGATHON WALK SHOP",
    officialStore: "Offizieller Shop",
    storeSubtitle:
      "Premium-Bekleidung, Accessoires und exklusive Legathon Walk-Ausrüstung.",

    wCoinBalance: "W COIN GUTHABEN",
    walletSubtitle:
      "Verwende W Coins für berechtigte Legathon-Ausrüstung und Merchandise.",

    lifetimeProgress:
      "GESAMTER WALKING-FORTSCHRITT",
    lifetimeSteps: "Gesamtschritte",

    mens: "Herren",
    womens: "Damen",
    accessories: "Accessoires",

    mensCollection: "Herrenkollektion",
    womensCollection: "Damenkollektion",
    accessoriesCollection: "Accessoires",

    locked: "GESPERRT",
    unlockAt: "FREISCHALTEN BEI",
    steps: "Schritten",

    wCoinsAvailable: "W Coins verfügbar",
    moreWCoinsNeeded:
      "Mehr W Coins erforderlich",

    buyRedeem: "Kaufen / Einlösen",
    lockedButton: "Gesperrt",

    gear: "Ausrüstung",
    legathonItem: "Legathon Artikel",
  },


  pt: {
    back: "Voltar",
    storeKicker: "LOJA LEGATHON WALK",
    officialStore: "Loja Oficial",
    storeSubtitle:
      "Roupas premium, acessórios e equipamentos exclusivos Legathon Walk.",

    wCoinBalance: "SALDO DE W COINS",
    walletSubtitle:
      "Use W Coins em equipamentos e produtos Legathon elegíveis.",

    lifetimeProgress:
      "PROGRESSO TOTAL DE CAMINHADA",
    lifetimeSteps: "Passos Totais",

    mens: "Masculino",
    womens: "Feminino",
    accessories: "Acessórios",

    mensCollection: "Coleção Masculina",
    womensCollection: "Coleção Feminina",
    accessoriesCollection: "Acessórios",

    locked: "BLOQUEADO",
    unlockAt: "DESBLOQUEAR EM",
    steps: "passos",

    wCoinsAvailable: "W Coins disponíveis",
    moreWCoinsNeeded:
      "Mais W Coins necessários",

    buyRedeem: "Comprar / Resgatar",
    lockedButton: "Bloqueado",

    gear: "Equipamento",
    legathonItem: "Item Legathon",
  },


  ja: {
    back: "戻る",
    storeKicker: "LEGATHON WALK ストア",
    officialStore: "公式ストア",
    storeSubtitle:
      "プレミアムウェア、アクセサリー、Legathon Walk限定ギア。",

    wCoinBalance: "W COIN 残高",
    walletSubtitle:
      "対象のLegathonギアや商品にW Coinsを使用できます。",

    lifetimeProgress:
      "累計ウォーキング進捗",
    lifetimeSteps: "累計歩数",

    mens: "メンズ",
    womens: "レディース",
    accessories: "アクセサリー",

    mensCollection: "メンズコレクション",
    womensCollection: "レディースコレクション",
    accessoriesCollection: "アクセサリー",

    locked: "ロック中",
    unlockAt: "解除条件",
    steps: "歩",

    wCoinsAvailable: "W Coins 使用可能",
    moreWCoinsNeeded:
      "W Coins がさらに必要です",

    buyRedeem: "購入 / 交換",
    lockedButton: "ロック中",

    gear: "ギア",
    legathonItem: "Legathon アイテム",
  },


  ko: {
    back: "뒤로",
    storeKicker: "LEGATHON WALK 스토어",
    officialStore: "공식 스토어",
    storeSubtitle:
      "프리미엄 의류, 액세서리 및 Legathon Walk 전용 장비.",

    wCoinBalance: "W COIN 잔액",
    walletSubtitle:
      "W Coins를 사용하여 대상 Legathon 장비와 상품을 구매하세요.",

    lifetimeProgress:
      "누적 걷기 진행도",
    lifetimeSteps: "누적 걸음 수",

    mens: "남성",
    womens: "여성",
    accessories: "액세서리",

    mensCollection: "남성 컬렉션",
    womensCollection: "여성 컬렉션",
    accessoriesCollection: "액세서리",

    locked: "잠김",
    unlockAt: "잠금 해제",
    steps: "걸음",

    wCoinsAvailable: "W Coins 사용 가능",
    moreWCoinsNeeded:
      "W Coins가 더 필요합니다",

    buyRedeem: "구매 / 교환",
    lockedButton: "잠김",

    gear: "장비",
    legathonItem: "Legathon 상품",
  },


  zh: {
    back: "返回",
    storeKicker: "LEGATHON WALK 商店",
    officialStore: "官方商店",
    storeSubtitle:
      "高级服装、配饰和 Legathon Walk 独家装备。",

    wCoinBalance: "W COIN 余额",
    walletSubtitle:
      "使用 W Coins 购买符合条件的 Legathon 装备和商品。",

    lifetimeProgress:
      "累计步行进度",
    lifetimeSteps: "累计步数",

    mens: "男士",
    womens: "女士",
    accessories: "配饰",

    mensCollection: "男士系列",
    womensCollection: "女士系列",
    accessoriesCollection: "配饰",

    locked: "已锁定",
    unlockAt: "解锁条件",
    steps: "步",

    wCoinsAvailable: "W Coins 可用",
    moreWCoinsNeeded:
      "需要更多 W Coins",

    buyRedeem: "购买 / 兑换",
    lockedButton: "已锁定",

    gear: "装备",
    legathonItem: "Legathon 商品",
  },


  it: {
    back: "Indietro",
    storeKicker: "NEGOZIO LEGATHON WALK",
    officialStore: "Negozio Ufficiale",
    storeSubtitle:
      "Abbigliamento premium, accessori e prodotti esclusivi Legathon Walk.",

    wCoinBalance: "SALDO W COINS",
    walletSubtitle:
      "Usa W Coins per articoli e prodotti Legathon idonei.",

    lifetimeProgress:
      "PROGRESSO TOTALE DI CAMMINATA",
    lifetimeSteps: "Passi Totali",

    mens: "Uomo",
    womens: "Donna",
    accessories: "Accessori",

    mensCollection: "Collezione Uomo",
    womensCollection: "Collezione Donna",
    accessoriesCollection: "Accessori",

    locked: "BLOCCATO",
    unlockAt: "SBLOCCA A",
    steps: "passi",

    wCoinsAvailable: "W Coins disponibili",
    moreWCoinsNeeded:
      "Servono più W Coins",

    buyRedeem: "Acquista / Riscatta",
    lockedButton: "Bloccato",

    gear: "Equipaggiamento",
    legathonItem: "Articolo Legathon",
  },


  ar: {
    back: "رجوع",
    storeKicker: "متجر LEGATHON WALK",
    officialStore: "المتجر الرسمي",
    storeSubtitle:
      "ملابس فاخرة وإكسسوارات ومعدات Legathon Walk الحصرية.",

    wCoinBalance: "رصيد W COIN",
    walletSubtitle:
      "استخدم W Coins لشراء معدات ومنتجات Legathon المؤهلة.",

    lifetimeProgress:
      "إجمالي تقدم المشي",
    lifetimeSteps: "إجمالي الخطوات",

    mens: "رجالي",
    womens: "نسائي",
    accessories: "إكسسوارات",

    mensCollection: "مجموعة الرجال",
    womensCollection: "مجموعة النساء",
    accessoriesCollection: "الإكسسوارات",

    locked: "مغلق",
    unlockAt: "يفتح عند",
    steps: "خطوة",

    wCoinsAvailable: "W Coins متاحة",
    moreWCoinsNeeded:
      "تحتاج إلى المزيد من W Coins",

    buyRedeem: "شراء / استبدال",
    lockedButton: "مغلق",

    gear: "معدات",
    legathonItem: "منتج Legathon",
  },
};


// ============================================================
// LANGUAGE HELPERS
// ============================================================

function normalizeLanguage(
  language
) {
  const code =
    String(
      language || "en"
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


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {
  const numeric =
    Number(value);

  return Number.isFinite(numeric)
    ? numeric
    : fallback;
}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(
  value,
  language
) {
  const numeric =
    Math.floor(
      Math.max(
        0,
        safeNumber(
          value,
          0
        )
      )
    );

  try {
    return numeric.toLocaleString(
      language
    );
  } catch {
    return numeric.toLocaleString();
  }
}


// ============================================================
// CATEGORY DISPLAY
//
// Internal values remain:
// Mens / Womens / Accessories
// ============================================================

function getCategoryLabel(
  category,
  language
) {
  if (
    category === "Mens"
  ) {
    return getText(
      language,
      "mens"
    );
  }

  if (
    category === "Womens"
  ) {
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


// ============================================================
// SCREEN
// ============================================================

export default function PhysicalMerchStoreScreen({
  language = "en",

  goBack,

  openItem,

  goToPurchaseConfirmation,

  wCoinBalance:
    incomingBalance = 0,

  lifetimeSteps = 0,

  spendWCoins,
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


  const isRTL =
    languageCode === "ar";


  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  const [
    activeCategory,
    setActiveCategory,
  ] = useState(
    "Mens"
  );


  const [
    wCoinBalance,
    setWCoinBalance,
  ] = useState(
    safeNumber(
      incomingBalance,
      0
    )
  );


  // ==========================================================
  // REAL LIFETIME STEPS
  // ==========================================================

  const totalSteps =
    Math.max(
      0,
      safeNumber(
        lifetimeSteps,
        0
      )
    );


  // ==========================================================
  // WCOIN BALANCE
  // ==========================================================

  const refreshWCoinBalance =
    useCallback(
      async () => {
        try {
          const storedBalance =
            await getWCoins();


          const latestBalance =
            safeNumber(
              storedBalance,
              safeNumber(
                incomingBalance,
                0
              )
            );


          setWCoinBalance(
            latestBalance
          );


          console.log(
            "STORE WCOIN BALANCE:",
            latestBalance
          );

        } catch (error) {
          console.error(
            "STORE BALANCE REFRESH ERROR:",
            error
          );


          setWCoinBalance(
            safeNumber(
              incomingBalance,
              0
            )
          );
        }
      },
      [
        incomingBalance,
      ]
    );


  useEffect(() => {
    refreshWCoinBalance();
  }, [
    refreshWCoinBalance,
  ]);


  // ==========================================================
  // UPDATE WHEN PARENT BALANCE CHANGES
  // ==========================================================

  useEffect(() => {
    const latest =
      safeNumber(
        incomingBalance,
        0
      );


    setWCoinBalance(
      current => {
        if (
          latest !== current &&
          latest >= 0
        ) {
          return latest;
        }

        return current;
      }
    );
  }, [
    incomingBalance,
  ]);


  // ==========================================================
  // FILTER STORE
  // ==========================================================

  const filteredItems =
    useMemo(
      () => {

        if (
          activeCategory ===
          "Mens"
        ) {
          return APPAREL_CATALOG.filter(
            item =>
              item.gender ===
              "Men"
          );
        }


        if (
          activeCategory ===
          "Womens"
        ) {
          return APPAREL_CATALOG.filter(
            item =>
              item.gender ===
              "Women"
          );
        }


        if (
          activeCategory ===
          "Accessories"
        ) {
          return APPAREL_CATALOG.filter(
            item =>
              item.category ===
              "Accessories"
          );
        }


        return [];

      },
      [
        activeCategory,
      ]
    );


  // ==========================================================
  // COLLECTION TITLE
  // ==========================================================

  const collectionTitle =
    activeCategory === "Mens"
      ? t(
          "mensCollection"
        )
      : activeCategory ===
          "Womens"
        ? t(
            "womensCollection"
          )
        : t(
            "accessoriesCollection"
          );


  // ==========================================================
  // OPEN PRODUCT
  // ==========================================================

  const handleProductPress = (
    item,
    unlocked
  ) => {

    if (!unlocked) {
      return;
    }


    console.log(
      "OPEN PRODUCT:",
      item?.name ||
        item?.title ||
        item?.id
    );


    // OPEN PRODUCT DETAILS FIRST

    if (
      typeof openItem ===
      "function"
    ) {
      openItem(
        item
      );

      return;
    }


    // FALLBACK ONLY

    if (
      typeof goToPurchaseConfirmation ===
      "function"
    ) {
      goToPurchaseConfirmation(
        item
      );
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >

      <ScrollView
        style={
          styles.scroll
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        {typeof goBack ===
          "function" && (

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

            <Text
              style={[
                styles.backText,
                rtlText,
              ]}
            >
              {isRTL
                ? `${t("back")} ›`
                : `‹ ${t("back")}`}
            </Text>

          </TouchableOpacity>

        )}


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View
          style={
            styles.header
          }
        >

          <Text
            style={[
              styles.kicker,
              rtlText,
            ]}
          >
            {t(
              "storeKicker"
            )}
          </Text>


          <Text
            style={[
              styles.title,
              rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              2
            }
          >
            {t(
              "officialStore"
            )}
          </Text>


          <Text
            style={[
              styles.subTitle,
              rtlText,
            ]}
          >
            {t(
              "storeSubtitle"
            )}
          </Text>

        </View>


        {/* ================================================= */}
        {/* WCOIN WALLET */}
        {/* ================================================= */}

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
                  styles.rtlNumber,
              ]}
              adjustsFontSizeToFit
              numberOfLines={
                1
              }
            >
              {formatNumber(
                wCoinBalance,
                languageCode
              )}
            </Text>

          </View>


          <Text
            style={[
              styles.walletSub,
              rtlText,
            ]}
          >
            {t(
              "walletSubtitle"
            )}
          </Text>

        </View>


        {/* ================================================= */}
        {/* LIFETIME WALKING */}
        {/* ================================================= */}

        <View
          style={
            styles.stepsCard
          }
        >

          <Text
            style={[
              styles.stepsLabel,
              rtlText,
            ]}
          >
            {t(
              "lifetimeProgress"
            )}
          </Text>


          <Text
            style={[
              styles.stepsAmount,
              rtlText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              1
            }
          >
            {formatNumber(
              totalSteps,
              languageCode
            )}
          </Text>


          <Text
            style={[
              styles.stepsUnit,
              rtlText,
            ]}
          >
            {t(
              "lifetimeSteps"
            )}
          </Text>

        </View>


        {/* ================================================= */}
        {/* CATEGORIES */}
        {/* ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={
            styles.categoryScroll
          }
          contentContainerStyle={
            styles.categoryContent
          }
        >

          {MAIN_CATEGORIES.map(
            category => {

              const active =
                category ===
                activeCategory;


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
                    setActiveCategory(
                      category
                    )
                  }
                  activeOpacity={
                    0.85
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


        {/* ================================================= */}
        {/* COLLECTION TITLE */}
        {/* ================================================= */}

        <Text
          style={[
            styles.sectionTitle,
            rtlText,
          ]}
        >
          {collectionTitle}
        </Text>


        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        <View
          style={
            styles.grid
          }
        >

          {filteredItems.map(
            item => {

              const unlockSteps =
                Math.max(
                  0,
                  safeNumber(
                    item.unlockSteps,
                    0
                  )
                );


              const unlocked =
                totalSteps >=
                unlockSteps;


              // Keep catalog product names exactly as stored.
              // This protects catalog compatibility.
              const productName =
                item.title ||
                item.name ||
                t(
                  "legathonItem"
                );


              const collection =
                item.collection ||
                "Legathon";


              const price =
                safeNumber(
                  item.price,
                  0
                );


              const coinCost =
                Math.max(
                  0,
                  safeNumber(
                    item.coins,
                    0
                  )
                );


              const canAfford =
                wCoinBalance >=
                coinCost;


              return (
                <View
                  key={
                    item.id
                  }
                  style={[
                    styles.productCard,

                    !unlocked &&
                      styles.lockedCard,
                  ]}
                >

                  {/* ======================================= */}
                  {/* IMAGE */}
                  {/* ======================================= */}

                  <View
                    style={
                      styles.imageWrap
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


                    {!unlocked && (

                      <View
                        style={
                          styles.lockOverlay
                        }
                      >

                        <Text
                          style={
                            styles.lockIcon
                          }
                        >
                          🔒
                        </Text>


                        <Text
                          style={
                            styles.lockText
                          }
                          adjustsFontSizeToFit
                          numberOfLines={
                            1
                          }
                        >
                          {t(
                            "locked"
                          )}
                        </Text>

                      </View>

                    )}

                  </View>


                  {/* ======================================= */}
                  {/* NAME */}
                  {/* ======================================= */}

                  <Text
                    style={[
                      styles.productName,
                      rtlText,
                    ]}
                    numberOfLines={
                      2
                    }
                    adjustsFontSizeToFit
                  >
                    {productName}
                  </Text>


                  <Text
                    style={[
                      styles.collectionText,
                      rtlText,
                    ]}
                    numberOfLines={
                      2
                    }
                  >
                    {isRTL
                      ? `${t("gear")} ${collection}`
                      : `${collection} ${t("gear")}`}
                  </Text>


                  {/* ======================================= */}
                  {/* PRICE */}
                  {/* ======================================= */}

                  <Text
                    style={[
                      styles.price,
                      rtlText,
                    ]}
                  >
                    ${price.toFixed(
                      2
                    )}
                  </Text>


                  {/* ======================================= */}
                  {/* WCOIN */}
                  {/* ======================================= */}

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
                        styles.coinCost,

                        isRTL &&
                          styles.rtlNumber,
                      ]}
                    >
                      {formatNumber(
                        coinCost,
                        languageCode
                      )}
                    </Text>

                  </View>


                  {/* ======================================= */}
                  {/* LOCK REQUIREMENT */}
                  {/* ======================================= */}

                  {!unlocked &&
                    unlockSteps >
                      0 && (

                    <View
                      style={
                        styles.requirementBox
                      }
                    >

                      <Text
                        style={[
                          styles.requirementLabel,
                          rtlText,
                        ]}
                      >
                        {t(
                          "unlockAt"
                        )}
                      </Text>


                      <Text
                        style={[
                          styles.requirementValue,
                          rtlText,
                        ]}
                      >
                        {formatNumber(
                          unlockSteps,
                          languageCode
                        )}{" "}
                        {t(
                          "steps"
                        )}
                      </Text>

                    </View>

                  )}


                  {/* ======================================= */}
                  {/* COIN STATUS */}
                  {/* ======================================= */}

                  {unlocked &&
                    coinCost >
                      0 && (

                    <Text
                      style={[
                        styles.coinStatus,

                        canAfford
                          ? styles.coinStatusReady
                          : styles.coinStatusLow,

                        rtlText,
                      ]}
                    >
                      {canAfford
                        ? t(
                            "wCoinsAvailable"
                          )
                        : t(
                            "moreWCoinsNeeded"
                          )}
                    </Text>

                  )}


                  {/* ======================================= */}
                  {/* BUY */}
                  {/* ======================================= */}

                  <TouchableOpacity
                    style={[
                      styles.buyButton,

                      unlocked
                        ? styles.buyButtonActive
                        : styles.buyButtonLocked,
                    ]}
                    disabled={
                      !unlocked
                    }
                    onPress={() =>
                      handleProductPress(
                        item,
                        unlocked
                      )
                    }
                    activeOpacity={
                      0.85
                    }
                    accessibilityRole=
                      "button"
                    accessibilityState={{
                      disabled:
                        !unlocked,
                    }}
                  >

                    <Text
                      style={[
                        styles.buyText,

                        !unlocked &&
                          styles.buyTextLocked,

                        isRTL &&
                          styles.rtlCenterText,
                      ]}
                      adjustsFontSizeToFit
                      numberOfLines={
                        1
                      }
                    >
                      {unlocked
                        ? t(
                            "buyRedeem"
                          )
                        : t(
                            "lockedButton"
                          )}
                    </Text>

                  </TouchableOpacity>

                </View>
              );
            }
          )}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor: "#050914",
    },


    scroll: {
      flex: 1,
      backgroundColor: "#050914",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 260,
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",

      minHeight: 46,

      paddingHorizontal: 20,

      borderRadius: 24,

      borderWidth: 1.5,
      borderColor: "#E7C447",

      backgroundColor: "#071224",

      justifyContent: "center",

      marginBottom: 18,
    },


    backButtonRTL: {
      alignSelf: "flex-end",
    },


    backText: {
      color: "#E7C447",

      fontSize: 18,
      fontWeight: "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
      marginBottom: 22,
    },


    kicker: {
      color: "#E7C447",

      fontSize: 12,
      fontWeight: "900",

      letterSpacing: 3.2,

      marginBottom: 8,
    },


    title: {
      color: "#FFFFFF",

      fontSize: 42,
      lineHeight: 48,

      fontWeight: "900",
    },


    subTitle: {
      color: "#AAB3C5",

      fontSize: 16,
      fontWeight: "700",

      lineHeight: 24,

      marginTop: 10,
    },


    // ========================================================
    // WALLET
    // ========================================================

    walletCard: {
      backgroundColor: "#071224",

      borderRadius: 26,

      borderWidth: 1.5,
      borderColor: "#D4AF37",

      padding: 20,

      marginBottom: 16,
    },


    walletLabel: {
      color: "#A7F3D0",

      fontSize: 13,
      fontWeight: "900",

      letterSpacing: 3,

      marginBottom: 12,
    },


    walletRow: {
      flexDirection: "row",
      alignItems: "center",
    },


    coinIcon: {
      width: 40,
      height: 40,

      resizeMode: "contain",

      marginRight: 14,
    },


    coinIconRTL: {
      marginRight: 0,
      marginLeft: 14,
    },


    walletAmount: {
      color: "#FFFFFF",

      fontSize: 48,
      fontWeight: "900",

      flexShrink: 1,
    },


    walletSub: {
      color: "#AAB3C5",

      fontSize: 15,
      fontWeight: "700",

      lineHeight: 22,

      marginTop: 10,
    },


    // ========================================================
    // STEPS
    // ========================================================

    stepsCard: {
      backgroundColor: "#0B182B",

      borderRadius: 22,

      borderWidth: 1,
      borderColor: "#1E415C",

      padding: 18,

      marginBottom: 4,
    },


    stepsLabel: {
      color: "#A7F3D0",

      fontSize: 11,
      fontWeight: "900",

      letterSpacing: 2,
    },


    stepsAmount: {
      color: "#FFFFFF",

      fontSize: 34,
      fontWeight: "900",

      marginTop: 6,
    },


    stepsUnit: {
      color: "#AAB3C5",

      fontSize: 13,
      fontWeight: "700",

      marginTop: 2,
    },


    // ========================================================
    // CATEGORY
    // ========================================================

    categoryScroll: {
      marginTop: 18,
      marginBottom: 20,
    },


    categoryContent: {
      paddingRight: 20,
    },


    categoryPill: {
      minWidth: 112,
      height: 44,

      marginRight: 10,

      borderRadius: 24,

      justifyContent: "center",
      alignItems: "center",

      backgroundColor: "#101B2E",

      borderWidth: 1,
      borderColor: "#103557",

      paddingHorizontal: 16,
    },


    categoryPillActive: {
      backgroundColor: "#F2C438",
      borderColor: "#F2C438",
    },


    categoryText: {
      color: "#B8C4D9",

      fontSize: 15,
      fontWeight: "800",
    },


    categoryTextActive: {
      color: "#000000",
    },


    // ========================================================
    // SECTION
    // ========================================================

    sectionTitle: {
      color: "#A7F3D0",

      fontSize: 30,
      lineHeight: 38,

      fontWeight: "900",
      letterSpacing: 1.5,

      marginBottom: 20,

      paddingTop: 2,
    },


    // ========================================================
    // GRID
    // ========================================================

    grid: {
      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent: "space-between",

      alignItems: "flex-start",
    },


    // ========================================================
    // PRODUCT
    // ========================================================

    productCard: {
      width: "48%",

      backgroundColor: "#0B182B",

      borderRadius: 24,

      borderWidth: 1,
      borderColor: "#1E334A",

      padding: 12,

      marginBottom: 18,
    },


    lockedCard: {
      opacity: 0.78,
    },


    imageWrap: {
      width: "100%",
      height: 150,

      borderRadius: 18,

      backgroundColor: "#050914",

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 14,

      overflow: "hidden",
    },


    productImage: {
      width: "92%",
      height: "92%",

      resizeMode: "contain",
    },


    // ========================================================
    // LOCK
    // ========================================================

    lockOverlay: {
      position: "absolute",

      left: 0,
      right: 0,
      top: 0,
      bottom: 0,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(0,0,0,0.58)",
    },


    lockIcon: {
      fontSize: 24,

      marginBottom: 6,
    },


    lockText: {
      color: "#FFFFFF",

      fontSize: 15,
      fontWeight: "900",

      letterSpacing: 2,

      maxWidth: "90%",

      textAlign: "center",
    },


    // ========================================================
    // PRODUCT DETAILS
    // ========================================================

    productName: {
      color: "#FFFFFF",

      fontSize: 17,
      lineHeight: 22,

      fontWeight: "900",

      minHeight: 44,

      marginBottom: 4,
    },


    collectionText: {
      color: "#AAB3C5",

      fontSize: 12,
      fontWeight: "800",

      marginBottom: 8,
    },


    price: {
      color: "#FFFFFF",

      fontSize: 25,
      fontWeight: "900",

      marginBottom: 8,
    },


    // ========================================================
    // WCOIN
    // ========================================================

    coinRow: {
      flexDirection: "row",

      alignItems: "center",

      marginBottom: 9,
    },


    smallCoin: {
      width: 23,
      height: 23,

      resizeMode: "contain",

      marginRight: 8,
    },


    smallCoinRTL: {
      marginRight: 0,
      marginLeft: 8,
    },


    coinCost: {
      color: "#F2C438",

      fontSize: 18,
      fontWeight: "900",
    },


    coinStatus: {
      fontSize: 11,
      fontWeight: "900",

      marginBottom: 10,
    },


    coinStatusReady: {
      color: "#A7F3D0",
    },


    coinStatusLow: {
      color: "#FF9CA8",
    },


    // ========================================================
    // REQUIREMENT
    // ========================================================

    requirementBox: {
      backgroundColor: "#111B2D",

      borderRadius: 12,

      padding: 9,

      marginBottom: 10,

      borderWidth: 1,
      borderColor: "#253A52",
    },


    requirementLabel: {
      color: "#8497AE",

      fontSize: 9,
      fontWeight: "900",

      letterSpacing: 1.3,
    },


    requirementValue: {
      color: "#E7C447",

      fontSize: 12,
      fontWeight: "900",

      marginTop: 3,
    },


    // ========================================================
    // BUY
    // ========================================================

    buyButton: {
      minHeight: 48,

      borderRadius: 20,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 8,
    },


    buyButtonActive: {
      backgroundColor: "#F2C438",
    },


    buyButtonLocked: {
      backgroundColor: "#263244",
    },


    buyText: {
      color: "#00142D",

      fontSize: 14,
      fontWeight: "900",

      textAlign: "center",
    },


    buyTextLocked: {
      color: "#8C9AAE",
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


    rtlNumber: {
      writingDirection: "ltr",
    },
  });