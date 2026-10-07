// screens/StoreItemDetailScreen.js

// screens/StoreItemDetailScreen.js

import React, {
  useEffect,
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
  SafeAreaView,
} from "react-native";

const WCOIN =
  require("../assets/wcoin.png");


// ============================================================
// LEGATHON WALK
// STORE ITEM DETAIL SCREEN — MULTILINGUAL
// ============================================================

const TEXT = {
  en: {
    back: "Back",
    store: "LEGATHON WALK STORE",
    productDetails: "Product Details",
    productImage: "Product Image",

    price: "PRICE",
    wCoins: "W COINS",

    selectColor: "Select Color",
    selectSize: "Select Size",

    noColorRequired:
      "No color selection required.",
    noSizeRequired:
      "No size selection required.",

    yourSelection: "Your Selection",

    item: "Item",
    color: "Color",
    size: "Size",
    priceRow: "Price",

    notSelected: "Not Selected",

    collection: "Collection",
    category: "Category",
    product: "Product",
    fit: "Fit",
    availability: "Availability",
    available: "Available",

    wCoinEligible: "W Coin Eligible",

    wCoinMessage:
      "Eligible Premium and Elite members can apply W Coins toward merchandise discounts at checkout.",

    continuePurchase:
      "CONTINUE TO PURCHASE",

    chooseOptions:
      "Select your color and size before continuing.",

    itemNotFound: "Item Not Found",

    itemNotFoundText:
      "Return to the Legathon Walk Store and select an item.",

    returnStore:
      "RETURN TO STORE",

    unisex: "Unisex",
    merchandise: "Merchandise",
    defaultItem: "Legathon Walk Item",

    black: "Black",
    white: "White",
    blue: "Blue",
    green: "Green",
    red: "Red",
    yellow: "Yellow",
    pink: "Pink",
    gray: "Gray",
    grey: "Grey",
    gold: "Gold",
  },


  es: {
    back: "Atrás",
    store: "TIENDA LEGATHON WALK",
    productDetails: "Detalles del Producto",
    productImage: "Imagen del Producto",

    price: "PRECIO",
    wCoins: "W COINS",

    selectColor: "Seleccionar Color",
    selectSize: "Seleccionar Talla",

    noColorRequired:
      "No se requiere seleccionar un color.",
    noSizeRequired:
      "No se requiere seleccionar una talla.",

    yourSelection: "Tu Selección",

    item: "Artículo",
    color: "Color",
    size: "Talla",
    priceRow: "Precio",

    notSelected: "No Seleccionado",

    collection: "Colección",
    category: "Categoría",
    product: "Producto",
    fit: "Corte",
    availability: "Disponibilidad",
    available: "Disponible",

    wCoinEligible: "Elegible para W Coin",

    wCoinMessage:
      "Los miembros Premium y Elite elegibles pueden aplicar W Coins a descuentos en mercancía durante el pago.",

    continuePurchase:
      "CONTINUAR CON LA COMPRA",

    chooseOptions:
      "Selecciona tu color y talla antes de continuar.",

    itemNotFound:
      "Artículo No Encontrado",

    itemNotFoundText:
      "Regresa a la tienda Legathon Walk y selecciona un artículo.",

    returnStore:
      "VOLVER A LA TIENDA",

    unisex: "Unisex",
    merchandise: "Mercancía",
    defaultItem: "Artículo Legathon Walk",

    black: "Negro",
    white: "Blanco",
    blue: "Azul",
    green: "Verde",
    red: "Rojo",
    yellow: "Amarillo",
    pink: "Rosa",
    gray: "Gris",
    grey: "Gris",
    gold: "Dorado",
  },


  fr: {
    back: "Retour",
    store: "BOUTIQUE LEGATHON WALK",
    productDetails: "Détails du Produit",
    productImage: "Image du Produit",

    price: "PRIX",
    wCoins: "W COINS",

    selectColor: "Choisir la Couleur",
    selectSize: "Choisir la Taille",

    noColorRequired:
      "Aucune sélection de couleur requise.",
    noSizeRequired:
      "Aucune sélection de taille requise.",

    yourSelection: "Votre Sélection",

    item: "Article",
    color: "Couleur",
    size: "Taille",
    priceRow: "Prix",

    notSelected: "Non Sélectionné",

    collection: "Collection",
    category: "Catégorie",
    product: "Produit",
    fit: "Coupe",
    availability: "Disponibilité",
    available: "Disponible",

    wCoinEligible: "Éligible aux W Coins",

    wCoinMessage:
      "Les membres Premium et Elite éligibles peuvent utiliser des W Coins pour obtenir des réductions sur les produits lors du paiement.",

    continuePurchase:
      "CONTINUER L'ACHAT",

    chooseOptions:
      "Choisissez votre couleur et votre taille avant de continuer.",

    itemNotFound:
      "Article Introuvable",

    itemNotFoundText:
      "Retournez à la boutique Legathon Walk et sélectionnez un article.",

    returnStore:
      "RETOUR À LA BOUTIQUE",

    unisex: "Unisexe",
    merchandise: "Marchandise",
    defaultItem: "Article Legathon Walk",

    black: "Noir",
    white: "Blanc",
    blue: "Bleu",
    green: "Vert",
    red: "Rouge",
    yellow: "Jaune",
    pink: "Rose",
    gray: "Gris",
    grey: "Gris",
    gold: "Or",
  },


  de: {
    back: "Zurück",
    store: "LEGATHON WALK SHOP",
    productDetails: "Produktdetails",
    productImage: "Produktbild",

    price: "PREIS",
    wCoins: "W COINS",

    selectColor: "Farbe Auswählen",
    selectSize: "Größe Auswählen",

    noColorRequired:
      "Keine Farbauswahl erforderlich.",
    noSizeRequired:
      "Keine Größenauswahl erforderlich.",

    yourSelection: "Deine Auswahl",

    item: "Artikel",
    color: "Farbe",
    size: "Größe",
    priceRow: "Preis",

    notSelected: "Nicht Ausgewählt",

    collection: "Kollektion",
    category: "Kategorie",
    product: "Produkt",
    fit: "Passform",
    availability: "Verfügbarkeit",
    available: "Verfügbar",

    wCoinEligible: "W Coin Berechtigt",

    wCoinMessage:
      "Berechtigte Premium- und Elite-Mitglieder können W Coins beim Bezahlen für Merchandise-Rabatte verwenden.",

    continuePurchase:
      "WEITER ZUM KAUF",

    chooseOptions:
      "Wähle Farbe und Größe aus, bevor du fortfährst.",

    itemNotFound:
      "Artikel Nicht Gefunden",

    itemNotFoundText:
      "Kehre zum Legathon Walk Shop zurück und wähle einen Artikel aus.",

    returnStore:
      "ZURÜCK ZUM SHOP",

    unisex: "Unisex",
    merchandise: "Merchandise",
    defaultItem: "Legathon Walk Artikel",

    black: "Schwarz",
    white: "Weiß",
    blue: "Blau",
    green: "Grün",
    red: "Rot",
    yellow: "Gelb",
    pink: "Rosa",
    gray: "Grau",
    grey: "Grau",
    gold: "Gold",
  },


  pt: {
    back: "Voltar",
    store: "LOJA LEGATHON WALK",
    productDetails: "Detalhes do Produto",
    productImage: "Imagem do Produto",

    price: "PREÇO",
    wCoins: "W COINS",

    selectColor: "Selecionar Cor",
    selectSize: "Selecionar Tamanho",

    noColorRequired:
      "Nenhuma seleção de cor é necessária.",
    noSizeRequired:
      "Nenhuma seleção de tamanho é necessária.",

    yourSelection: "Sua Seleção",

    item: "Item",
    color: "Cor",
    size: "Tamanho",
    priceRow: "Preço",

    notSelected: "Não Selecionado",

    collection: "Coleção",
    category: "Categoria",
    product: "Produto",
    fit: "Caimento",
    availability: "Disponibilidade",
    available: "Disponível",

    wCoinEligible: "Elegível para W Coin",

    wCoinMessage:
      "Membros Premium e Elite elegíveis podem usar W Coins para descontos em produtos durante o checkout.",

    continuePurchase:
      "CONTINUAR PARA COMPRA",

    chooseOptions:
      "Selecione sua cor e tamanho antes de continuar.",

    itemNotFound:
      "Item Não Encontrado",

    itemNotFoundText:
      "Volte à loja Legathon Walk e selecione um item.",

    returnStore:
      "VOLTAR À LOJA",

    unisex: "Unissex",
    merchandise: "Mercadoria",
    defaultItem: "Item Legathon Walk",

    black: "Preto",
    white: "Branco",
    blue: "Azul",
    green: "Verde",
    red: "Vermelho",
    yellow: "Amarelo",
    pink: "Rosa",
    gray: "Cinza",
    grey: "Cinza",
    gold: "Dourado",
  },


  ja: {
    back: "戻る",
    store: "LEGATHON WALK ストア",
    productDetails: "商品詳細",
    productImage: "商品画像",

    price: "価格",
    wCoins: "W COINS",

    selectColor: "カラーを選択",
    selectSize: "サイズを選択",

    noColorRequired:
      "カラーを選択する必要はありません。",
    noSizeRequired:
      "サイズを選択する必要はありません。",

    yourSelection: "選択内容",

    item: "商品",
    color: "カラー",
    size: "サイズ",
    priceRow: "価格",

    notSelected: "未選択",

    collection: "コレクション",
    category: "カテゴリー",
    product: "商品タイプ",
    fit: "対象",
    availability: "在庫状況",
    available: "購入可能",

    wCoinEligible: "W Coin 対象",

    wCoinMessage:
      "対象のPremiumおよびEliteメンバーは、チェックアウト時にW Coinsを商品割引に使用できます。",

    continuePurchase:
      "購入手続きへ進む",

    chooseOptions:
      "続行する前にカラーとサイズを選択してください。",

    itemNotFound:
      "商品が見つかりません",

    itemNotFoundText:
      "Legathon Walkストアに戻って商品を選択してください。",

    returnStore:
      "ストアに戻る",

    unisex: "ユニセックス",
    merchandise: "商品",
    defaultItem: "Legathon Walk 商品",

    black: "ブラック",
    white: "ホワイト",
    blue: "ブルー",
    green: "グリーン",
    red: "レッド",
    yellow: "イエロー",
    pink: "ピンク",
    gray: "グレー",
    grey: "グレー",
    gold: "ゴールド",
  },


  ko: {
    back: "뒤로",
    store: "LEGATHON WALK 스토어",
    productDetails: "상품 상세",
    productImage: "상품 이미지",

    price: "가격",
    wCoins: "W COINS",

    selectColor: "색상 선택",
    selectSize: "사이즈 선택",

    noColorRequired:
      "색상을 선택할 필요가 없습니다.",
    noSizeRequired:
      "사이즈를 선택할 필요가 없습니다.",

    yourSelection: "선택 내용",

    item: "상품",
    color: "색상",
    size: "사이즈",
    priceRow: "가격",

    notSelected: "선택 안 됨",

    collection: "컬렉션",
    category: "카테고리",
    product: "제품",
    fit: "핏",
    availability: "구매 가능 여부",
    available: "구매 가능",

    wCoinEligible: "W Coin 사용 가능",

    wCoinMessage:
      "대상 Premium 및 Elite 회원은 결제 시 W Coins를 상품 할인에 사용할 수 있습니다.",

    continuePurchase:
      "구매 계속하기",

    chooseOptions:
      "계속하기 전에 색상과 사이즈를 선택하세요.",

    itemNotFound:
      "상품을 찾을 수 없습니다",

    itemNotFoundText:
      "Legathon Walk 스토어로 돌아가 상품을 선택하세요.",

    returnStore:
      "스토어로 돌아가기",

    unisex: "공용",
    merchandise: "상품",
    defaultItem: "Legathon Walk 상품",

    black: "블랙",
    white: "화이트",
    blue: "블루",
    green: "그린",
    red: "레드",
    yellow: "옐로우",
    pink: "핑크",
    gray: "그레이",
    grey: "그레이",
    gold: "골드",
  },


  zh: {
    back: "返回",
    store: "LEGATHON WALK 商店",
    productDetails: "商品详情",
    productImage: "商品图片",

    price: "价格",
    wCoins: "W COINS",

    selectColor: "选择颜色",
    selectSize: "选择尺码",

    noColorRequired:
      "无需选择颜色。",
    noSizeRequired:
      "无需选择尺码。",

    yourSelection: "您的选择",

    item: "商品",
    color: "颜色",
    size: "尺码",
    priceRow: "价格",

    notSelected: "未选择",

    collection: "系列",
    category: "类别",
    product: "产品",
    fit: "适用",
    availability: "供应状态",
    available: "有货",

    wCoinEligible: "可使用 W Coin",

    wCoinMessage:
      "符合条件的 Premium 和 Elite 会员可在结账时使用 W Coins 获得商品折扣。",

    continuePurchase:
      "继续购买",

    chooseOptions:
      "继续之前请选择颜色和尺码。",

    itemNotFound:
      "未找到商品",

    itemNotFoundText:
      "返回 Legathon Walk 商店并选择商品。",

    returnStore:
      "返回商店",

    unisex: "男女通用",
    merchandise: "商品",
    defaultItem: "Legathon Walk 商品",

    black: "黑色",
    white: "白色",
    blue: "蓝色",
    green: "绿色",
    red: "红色",
    yellow: "黄色",
    pink: "粉色",
    gray: "灰色",
    grey: "灰色",
    gold: "金色",
  },


  it: {
    back: "Indietro",
    store: "NEGOZIO LEGATHON WALK",
    productDetails: "Dettagli del Prodotto",
    productImage: "Immagine del Prodotto",

    price: "PREZZO",
    wCoins: "W COINS",

    selectColor: "Seleziona Colore",
    selectSize: "Seleziona Taglia",

    noColorRequired:
      "Non è necessario selezionare un colore.",
    noSizeRequired:
      "Non è necessario selezionare una taglia.",

    yourSelection: "La Tua Selezione",

    item: "Articolo",
    color: "Colore",
    size: "Taglia",
    priceRow: "Prezzo",

    notSelected: "Non Selezionato",

    collection: "Collezione",
    category: "Categoria",
    product: "Prodotto",
    fit: "Vestibilità",
    availability: "Disponibilità",
    available: "Disponibile",

    wCoinEligible: "Idoneo per W Coin",

    wCoinMessage:
      "I membri Premium ed Elite idonei possono utilizzare W Coins per ottenere sconti sulla merce al checkout.",

    continuePurchase:
      "CONTINUA ALL'ACQUISTO",

    chooseOptions:
      "Seleziona colore e taglia prima di continuare.",

    itemNotFound:
      "Articolo Non Trovato",

    itemNotFoundText:
      "Torna al negozio Legathon Walk e seleziona un articolo.",

    returnStore:
      "TORNA AL NEGOZIO",

    unisex: "Unisex",
    merchandise: "Merchandise",
    defaultItem: "Articolo Legathon Walk",

    black: "Nero",
    white: "Bianco",
    blue: "Blu",
    green: "Verde",
    red: "Rosso",
    yellow: "Giallo",
    pink: "Rosa",
    gray: "Grigio",
    grey: "Grigio",
    gold: "Oro",
  },


  ar: {
    back: "رجوع",
    store: "متجر LEGATHON WALK",
    productDetails: "تفاصيل المنتج",
    productImage: "صورة المنتج",

    price: "السعر",
    wCoins: "W COINS",

    selectColor: "اختر اللون",
    selectSize: "اختر المقاس",

    noColorRequired:
      "لا يلزم اختيار لون.",
    noSizeRequired:
      "لا يلزم اختيار مقاس.",

    yourSelection: "اختيارك",

    item: "المنتج",
    color: "اللون",
    size: "المقاس",
    priceRow: "السعر",

    notSelected: "غير محدد",

    collection: "المجموعة",
    category: "الفئة",
    product: "المنتج",
    fit: "الملاءمة",
    availability: "التوفر",
    available: "متوفر",

    wCoinEligible:
      "مؤهل لاستخدام W Coin",

    wCoinMessage:
      "يمكن لأعضاء Premium وElite المؤهلين استخدام W Coins للحصول على خصومات على المنتجات عند الدفع.",

    continuePurchase:
      "متابعة الشراء",

    chooseOptions:
      "اختر اللون والمقاس قبل المتابعة.",

    itemNotFound:
      "لم يتم العثور على المنتج",

    itemNotFoundText:
      "ارجع إلى متجر Legathon Walk واختر منتجًا.",

    returnStore:
      "العودة إلى المتجر",

    unisex: "للجميع",
    merchandise: "منتجات",
    defaultItem: "منتج Legathon Walk",

    black: "أسود",
    white: "أبيض",
    blue: "أزرق",
    green: "أخضر",
    red: "أحمر",
    yellow: "أصفر",
    pink: "وردي",
    gray: "رمادي",
    grey: "رمادي",
    gold: "ذهبي",
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
    TEXT?.[language]?.[key] ||
    TEXT.en?.[key] ||
    key
  );
}


// ============================================================
// TRANSLATE DISPLAY COLOR
//
// IMPORTANT:
// The stored color value remains unchanged.
// This only changes what the customer sees.
// ============================================================

function getColorLabel(
  color,
  language
) {
  const key =
    String(color || "")
      .trim()
      .toLowerCase();

  return (
    TEXT?.[language]?.[key] ||
    color
  );
}


// ============================================================
// DISPLAY GENDER
// ============================================================

function getGenderLabel(
  gender,
  language
) {
  const value =
    String(gender || "")
      .trim()
      .toLowerCase();

  if (
    value === "unisex"
  ) {
    return getText(
      language,
      "unisex"
    );
  }

  // Catalog values remain untouched.
  return gender;
}


// ============================================================
// LEGATHON WALK
// STORE ITEM DETAIL SCREEN
// ============================================================

export default function StoreItemDetailScreen({
  language = "en",
  item = null,
  goBack,
  goToPurchaseConfirmation,
}) {

  const languageCode =
    normalizeLanguage(
      language
    );


  const t = key =>
    getText(
      languageCode,
      key
    );


  const isRTL =
    languageCode === "ar";


  const rtlText =
    isRTL
      ? styles.rtlText
      : null;


  // ==========================================================
  // PRODUCT OPTIONS
  // ==========================================================

  const colors =
    Array.isArray(
      item?.colors
    )
      ? item.colors
      : [];


  const sizes =
    Array.isArray(
      item?.sizes
    )
      ? item.sizes
      : [];


  // ==========================================================
  // SELECTED OPTIONS
  // ==========================================================

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    colors[0] || ""
  );


  const [
    selectedSize,
    setSelectedSize,
  ] = useState(
    sizes[0] || ""
  );


  // ==========================================================
  // RESET OPTIONS WHEN PRODUCT CHANGES
  // ==========================================================

  useEffect(() => {

    setSelectedColor(
      colors[0] || ""
    );


    setSelectedSize(
      sizes[0] || ""
    );

  }, [
    item?.id,
  ]);


  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

  const productName =
    item?.name ||
    item?.title ||
    t(
      "defaultItem"
    );


  // ==========================================================
  // PRICE
  // ==========================================================

  const price =
    useMemo(() => {

      const rawPrice =
        item?.price ??
        item?.retailPrice ??
        item?.amount ??
        0;


      if (
        typeof rawPrice ===
        "number"
      ) {

        return Math.max(
          rawPrice,
          0
        );
      }


      const parsed =
        Number(
          String(
            rawPrice
          )
            .replace(
              "$",
              ""
            )
            .replace(
              /,/g,
              ""
            )
            .trim()
        );


      return Number.isFinite(
        parsed
      )
        ? Math.max(
            parsed,
            0
          )
        : 0;

    }, [
      item?.price,
      item?.retailPrice,
      item?.amount,
    ]);


  // ==========================================================
  // WCOIN VALUE
  // ==========================================================

  const coins =
    Math.max(
      0,

      Math.floor(
        Number(
          item?.coins ??
          item?.coinDiscount ??
          0
        ) || 0
      )
    );


  // ==========================================================
  // OTHER PRODUCT INFORMATION
  // ==========================================================

  const gender =
    item?.gender ||
    "Unisex";


  const category =
    item?.category ||
    t(
      "merchandise"
    );


  const productType =
    item?.productType ||
    category;


  const collection =
    item?.collection ||
    "Legathon";


  // ==========================================================
  // SELECT PRODUCT IMAGE BASED ON COLOR
  // ==========================================================

  const selectedImage =
    useMemo(() => {

      if (
        selectedColor &&
        item?.imagesByColor?.[
          selectedColor
        ]
      ) {

        return (
          item.imagesByColor[
            selectedColor
          ]
        );
      }


      return (
        item?.image ||
        null
      );

    }, [
      item,
      selectedColor,
    ]);


  // ==========================================================
  // DETERMINE IF OPTIONS ARE READY
  // ==========================================================

  const colorRequired =
    colors.length > 0;


  const sizeRequired =
    sizes.length > 0;


  const hasSelectedColor =
    !colorRequired ||
    Boolean(
      selectedColor
    );


  const hasSelectedSize =
    !sizeRequired ||
    Boolean(
      selectedSize
    );


  const readyToPurchase =
    hasSelectedColor &&
    hasSelectedSize;


  // ==========================================================
  // CONTINUE TO PURCHASE
  // ==========================================================

  const handlePurchase =
    () => {

      if (
        !readyToPurchase
      ) {
        return;
      }


      if (
        typeof goToPurchaseConfirmation !==
        "function"
      ) {
        return;
      }


      const selectedItem = {

        ...item,


        // ------------------------------------------------------
        // KEEP ORIGINAL INTERNAL COLOR VALUE
        // ------------------------------------------------------

        selectedColor:
          selectedColor ||
          null,


        // ------------------------------------------------------
        // KEEP ORIGINAL INTERNAL SIZE VALUE
        // ------------------------------------------------------

        selectedSize:
          selectedSize ||
          null,


        // ------------------------------------------------------
        // MAKE CHECKOUT USE SELECTED COLOR IMAGE
        // ------------------------------------------------------

        image:
          selectedImage,


        // ------------------------------------------------------
        // PRODUCT DETAILS
        // ------------------------------------------------------

        name:
          productName,

        price,

        coins,
      };


      console.log(
        "STORE ITEM SELECTED:",
        {
          id:
            selectedItem?.id,

          name:
            selectedItem?.name,

          color:
            selectedItem
              ?.selectedColor,

          size:
            selectedItem
              ?.selectedSize,

          price:
            selectedItem?.price,
        }
      );


      goToPurchaseConfirmation(
        selectedItem
      );
    };


  // ==========================================================
  // NO ITEM
  // ==========================================================

  if (!item) {

    return (
      <SafeAreaView
        style={
          styles.safe
        }
      >

        <View
          style={
            styles.emptyContainer
          }
        >

          <Text
            style={
              styles.emptyIcon
            }
          >
            🛍️
          </Text>


          <Text
            style={[
              styles.emptyTitle,
              rtlText,
            ]}
          >
            {t(
              "itemNotFound"
            )}
          </Text>


          <Text
            style={[
              styles.emptyText,
              rtlText,
            ]}
          >
            {t(
              "itemNotFoundText"
            )}
          </Text>


          <TouchableOpacity
            style={
              styles.primaryButton
            }
            onPress={
              goBack
            }
          >

            <Text
              style={[
                styles.primaryButtonText,

                isRTL &&
                  styles.rtlCenterText,
              ]}
              adjustsFontSizeToFit
              numberOfLines={
                1
              }
            >
              {t(
                "returnStore"
              )}
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );
  }


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
        {/* BACK BUTTON */}
        {/* ================================================== */}

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
          accessibilityRole="button"
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


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <Text
          style={[
            styles.kicker,
            rtlText,
          ]}
        >
          {t(
            "store"
          )}
        </Text>


        <Text
          style={[
            styles.pageTitle,
            rtlText,
          ]}
          adjustsFontSizeToFit
          numberOfLines={
            2
          }
        >
          {t(
            "productDetails"
          )}
        </Text>


        {/* ================================================== */}
        {/* PRODUCT IMAGE */}
        {/* ================================================== */}

        <View
          style={
            styles.imageCard
          }
        >

          {selectedImage ? (

            <Image
              source={
                selectedImage
              }
              style={
                styles.productImage
              }
            />

          ) : (

            <View
              style={
                styles.noImageBox
              }
            >

              <Text
                style={[
                  styles.noImageText,
                  rtlText,
                ]}
              >
                {t(
                  "productImage"
                )}
              </Text>

            </View>

          )}


          {/* ================================================ */}
          {/* SELECTED COLOR BADGE */}
          {/* ================================================ */}

          {selectedColor ? (

            <View
              style={[
                styles.selectedColorBadge,

                isRTL &&
                  styles.selectedColorBadgeRTL,
              ]}
            >

              <Text
                style={[
                  styles.selectedColorBadgeText,
                  rtlText,
                ]}
              >
                {getColorLabel(
                  selectedColor,
                  languageCode
                )}
              </Text>

            </View>

          ) : null}

        </View>


        {/* ================================================== */}
        {/* PRODUCT INFORMATION */}
        {/* ================================================== */}

        <View
          style={
            styles.productInfoCard
          }
        >

          <Text
            style={[
              styles.collectionText,
              rtlText,
            ]}
          >
            {String(
              collection
            ).toUpperCase()}
          </Text>


          <Text
            style={[
              styles.productName,
              rtlText,
            ]}
          >
            {productName}
          </Text>


          <Text
            style={[
              styles.productMeta,
              rtlText,
            ]}
          >
            {getGenderLabel(
              gender,
              languageCode
            )}
            {"  •  "}
            {productType}
          </Text>


          {/* ================================================ */}
          {/* PRICE / WCOIN */}
          {/* ================================================ */}

          <View
            style={[
              styles.priceRow,

              isRTL &&
                styles.rowRTL,
            ]}
          >

            <View>

              <Text
                style={[
                  styles.priceLabel,
                  rtlText,
                ]}
              >
                {t(
                  "price"
                )}
              </Text>


              <Text
                style={[
                  styles.priceText,

                  isRTL &&
                    styles.numberText,
                ]}
              >
                ${price.toFixed(
                  2
                )}
              </Text>

            </View>


            <View
              style={[
                styles.wCoinPill,

                isRTL &&
                  styles.rowRTL,
              ]}
            >

              <Image
                source={
                  WCOIN
                }
                style={[
                  styles.wCoinIcon,

                  isRTL &&
                    styles.wCoinIconRTL,
                ]}
              />


              <View>

                <Text
                  style={[
                    styles.wCoinLabel,
                    rtlText,
                  ]}
                >
                  {t(
                    "wCoins"
                  )}
                </Text>


                <Text
                  style={[
                    styles.wCoinAmount,

                    isRTL &&
                      styles.numberText,
                  ]}
                >
                  {coins.toLocaleString(
                    languageCode
                  )}
                </Text>

              </View>

            </View>

          </View>

        </View>


        {/* ================================================== */}
        {/* COLOR SELECTOR */}
        {/* ================================================== */}

        <View
          style={
            styles.optionCard
          }
        >

          <View
            style={[
              styles.optionHeader,

              isRTL &&
                styles.rowRTL,
            ]}
          >

            <Text
              style={[
                styles.optionTitle,
                rtlText,
              ]}
            >
              {t(
                "selectColor"
              )}
            </Text>


            {selectedColor ? (

              <Text
                style={[
                  styles.selectedOptionText,
                  rtlText,
                ]}
              >
                {getColorLabel(
                  selectedColor,
                  languageCode
                )}
              </Text>

            ) : null}

          </View>


          {colors.length >
          0 ? (

            <View
              style={[
                styles.optionWrap,

                isRTL &&
                  styles.wrapRTL,
              ]}
            >

              {colors.map(
                color => {

                  const active =
                    selectedColor ===
                    color;


                  return (

                    <TouchableOpacity
                      key={
                        color
                      }
                      style={[
                        styles.colorButton,

                        active &&
                          styles.optionButtonActive,

                        isRTL &&
                          styles.rowRTL,
                      ]}
                      onPress={() =>
                        setSelectedColor(
                          color
                        )
                      }
                      activeOpacity={
                        0.8
                      }
                    >

                      <View
                        style={[
                          styles.colorDot,

                          {
                            backgroundColor:
                              getColorValue(
                                color
                              ),
                          },

                          color
                            .toLowerCase() ===
                            "white" &&
                            styles.whiteColorDot,

                          isRTL &&
                            styles.colorDotRTL,
                        ]}
                      />


                      <Text
                        style={[
                          styles.optionText,

                          active &&
                            styles.optionTextActive,

                          rtlText,
                        ]}
                      >
                        {getColorLabel(
                          color,
                          languageCode
                        )}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          ) : (

            <Text
              style={[
                styles.unavailableText,
                rtlText,
              ]}
            >
              {t(
                "noColorRequired"
              )}
            </Text>

          )}

        </View>


        {/* ================================================== */}
        {/* SIZE SELECTOR */}
        {/* ================================================== */}

        <View
          style={
            styles.optionCard
          }
        >

          <View
            style={[
              styles.optionHeader,

              isRTL &&
                styles.rowRTL,
            ]}
          >

            <Text
              style={[
                styles.optionTitle,
                rtlText,
              ]}
            >
              {t(
                "selectSize"
              )}
            </Text>


            {selectedSize ? (

              <Text
                style={[
                  styles.selectedOptionText,
                  rtlText,
                ]}
              >
                {selectedSize}
              </Text>

            ) : null}

          </View>


          {sizes.length >
          0 ? (

            <View
              style={[
                styles.sizeWrap,

                isRTL &&
                  styles.wrapRTL,
              ]}
            >

              {sizes.map(
                size => {

                  const active =
                    selectedSize ===
                    size;


                  return (

                    <TouchableOpacity
                      key={
                        size
                      }
                      style={[
                        styles.sizeButton,

                        active &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      activeOpacity={
                        0.8
                      }
                    >

                      <Text
                        style={[
                          styles.sizeText,

                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {size}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          ) : (

            <Text
              style={[
                styles.unavailableText,
                rtlText,
              ]}
            >
              {t(
                "noSizeRequired"
              )}
            </Text>

          )}

        </View>


        {/* ================================================== */}
        {/* YOUR SELECTION */}
        {/* ================================================== */}

        <View
          style={
            styles.selectionCard
          }
        >

          <Text
            style={[
              styles.selectionTitle,
              rtlText,
            ]}
          >
            {t(
              "yourSelection"
            )}
          </Text>


          <DetailRow
            label={
              t(
                "item"
              )
            }
            value={
              productName
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "color"
              )
            }
            value={
              selectedColor
                ? getColorLabel(
                    selectedColor,
                    languageCode
                  )
                : t(
                    "notSelected"
                  )
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "size"
              )
            }
            value={
              selectedSize ||
              t(
                "notSelected"
              )
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "priceRow"
              )
            }
            value={`$${price.toFixed(
              2
            )}`}
            isRTL={
              isRTL
            }
          />

        </View>


        {/* ================================================== */}
        {/* PRODUCT DETAILS */}
        {/* ================================================== */}

        <View
          style={
            styles.detailsCard
          }
        >

          <Text
            style={[
              styles.detailsTitle,
              rtlText,
            ]}
          >
            {t(
              "productDetails"
            )}
          </Text>


          <DetailRow
            label={
              t(
                "collection"
              )
            }
            value={
              collection
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "category"
              )
            }
            value={
              category
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "product"
              )
            }
            value={
              productType
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "fit"
              )
            }
            value={
              getGenderLabel(
                gender,
                languageCode
              )
            }
            isRTL={
              isRTL
            }
          />


          <DetailRow
            label={
              t(
                "availability"
              )
            }
            value={
              t(
                "available"
              )
            }
            isRTL={
              isRTL
            }
          />

        </View>


        {/* ================================================== */}
        {/* WCOIN INFORMATION */}
        {/* ================================================== */}

        <View
          style={[
            styles.rewardCard,

            isRTL &&
              styles.rowRTL,
          ]}
        >

          <Image
            source={
              WCOIN
            }
            style={[
              styles.rewardCoin,

              isRTL &&
                styles.rewardCoinRTL,
            ]}
          />


          <View
            style={
              styles.rewardContent
            }
          >

            <Text
              style={[
                styles.rewardTitle,
                rtlText,
              ]}
            >
              {t(
                "wCoinEligible"
              )}
            </Text>


            <Text
              style={[
                styles.rewardText,
                rtlText,
              ]}
            >
              {t(
                "wCoinMessage"
              )}
            </Text>

          </View>

        </View>


        {/* ================================================== */}
        {/* CHECKOUT BUTTON */}
        {/* ================================================== */}

        <TouchableOpacity
          style={[
            styles.primaryButton,

            !readyToPurchase &&
              styles.disabledButton,
          ]}
          onPress={
            handlePurchase
          }
          disabled={
            !readyToPurchase
          }
          activeOpacity={
            0.85
          }
          accessibilityRole="button"
          accessibilityState={{
            disabled:
              !readyToPurchase,
          }}
        >

          <Text
            style={[
              styles.primaryButtonText,

              isRTL &&
                styles.rtlCenterText,
            ]}
            adjustsFontSizeToFit
            numberOfLines={
              1
            }
          >
            {t(
              "continuePurchase"
            )}
          </Text>

        </TouchableOpacity>


        {/* ================================================== */}
        {/* CURRENT SELECTION UNDER BUTTON */}
        {/* ================================================== */}

        {selectedColor &&
        selectedSize ? (

          <Text
            style={[
              styles.purchaseNote,

              isRTL &&
                styles.rtlCenterText,
            ]}
          >
            {getColorLabel(
              selectedColor,
              languageCode
            )}
            {" • "}
            {selectedSize}
            {" • "}
            ${price.toFixed(
              2
            )}
          </Text>

        ) : (

          <Text
            style={[
              styles.purchaseNote,

              isRTL &&
                styles.rtlCenterText,
            ]}
          >
            {t(
              "chooseOptions"
            )}
          </Text>

        )}


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
// DETAIL ROW
// ============================================================

function DetailRow({
  label,
  value,
  isRTL = false,
}) {

  return (
    <View
      style={[
        styles.detailRow,

        isRTL &&
          styles.rowRTL,
      ]}
    >

      <Text
        style={[
          styles.detailLabel,

          isRTL &&
            styles.rtlText,
        ]}
      >
        {label}
      </Text>


      <Text
        style={[
          styles.detailValue,

          isRTL &&
            styles.detailValueRTL,
        ]}
      >
        {value}
      </Text>

    </View>
  );
}


// ============================================================
// COLOR HELPER
// ============================================================

function getColorValue(
  color
) {

  const value =
    String(
      color || ""
    ).toLowerCase();


  switch (
    value
  ) {

    case "black":
      return "#090909";


    case "white":
      return "#FFFFFF";


    case "blue":
      return "#2563EB";


    case "green":
      return "#16A34A";


    case "red":
      return "#DC2626";


    case "yellow":
      return "#FACC15";


    case "pink":
      return "#EC4899";


    case "gray":

    case "grey":
      return "#64748B";


    case "gold":
      return "#D4AF37";


    default:
      return "#64748B";
  }
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    // ========================================================
    // SCREEN
    // ========================================================

    safe: {
      flex: 1,
      backgroundColor: "#050914",
    },


    container: {
      flex: 1,
      backgroundColor: "#050914",
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 34,
      paddingBottom: 160,
    },


    bottomSpace: {
      height: 100,
    },


    // ========================================================
    // BACK
    // ========================================================

    backButton: {
      alignSelf: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 2,
      marginBottom: 20,
    },


    backButtonRTL: {
      alignSelf: "flex-end",
    },


    backText: {
      color: "#E7C447",
      fontSize: 22,
      fontWeight: "900",
    },


    // ========================================================
    // HEADER
    // ========================================================

    kicker: {
      color: "#E7C447",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 3.5,
      marginBottom: 10,
    },


    pageTitle: {
      color: "#FFFFFF",
      fontSize: 42,
      lineHeight: 48,
      fontWeight: "900",
      marginBottom: 24,
    },


    // ========================================================
    // IMAGE CARD
    // ========================================================

    imageCard: {
      width: "100%",
      minHeight: 330,
      backgroundColor: "#071224",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
      overflow: "hidden",
    },


    productImage: {
      width: "100%",
      height: 285,
      resizeMode: "contain",
    },


    noImageBox: {
      width: "100%",
      height: 250,
      alignItems: "center",
      justifyContent: "center",
    },


    noImageText: {
      color: "#64748B",
      fontSize: 16,
      fontWeight: "800",
    },


    selectedColorBadge: {
      position: "absolute",
      right: 16,
      bottom: 16,
      backgroundColor: "#050914",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "#D4AF37",
      paddingHorizontal: 14,
      paddingVertical: 8,
    },


    selectedColorBadgeRTL: {
      right: undefined,
      left: 16,
    },


    selectedColorBadgeText: {
      color: "#E7C447",
      fontSize: 12,
      fontWeight: "900",
    },


    // ========================================================
    // PRODUCT INFO
    // ========================================================

    productInfoCard: {
      backgroundColor: "#0B182B",
      borderRadius: 26,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 20,
      marginBottom: 18,
    },


    collectionText: {
      color: "#A7F3D0",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 3,
      marginBottom: 8,
    },


    productName: {
      color: "#FFFFFF",
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "900",
    },


    productMeta: {
      color: "#94A3B8",
      fontSize: 14,
      fontWeight: "700",
      marginTop: 8,
    },


    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 24,
    },


    priceLabel: {
      color: "#94A3B8",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2,
    },


    priceText: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "900",
      marginTop: 3,
    },


    // ========================================================
    // WCOIN
    // ========================================================

    wCoinPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#071224",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#D4AF37",
      paddingHorizontal: 13,
      paddingVertical: 9,
    },


    wCoinIcon: {
      width: 31,
      height: 31,
      resizeMode: "contain",
      marginRight: 9,
    },


    wCoinIconRTL: {
      marginRight: 0,
      marginLeft: 9,
    },


    wCoinLabel: {
      color: "#94A3B8",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },


    wCoinAmount: {
      color: "#E7C447",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 1,
    },


    // ========================================================
    // COLOR / SIZE CARDS
    // ========================================================

    optionCard: {
      backgroundColor: "#0B182B",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 18,
      marginBottom: 18,
    },


    optionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },


    optionTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
    },


    selectedOptionText: {
      color: "#E7C447",
      fontSize: 13,
      fontWeight: "900",
    },


    optionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },


    wrapRTL: {
      flexDirection: "row-reverse",
    },


    colorButton: {
      minHeight: 48,
      borderRadius: 24,
      backgroundColor: "#101B2E",
      borderWidth: 1,
      borderColor: "#29425D",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      marginRight: 10,
      marginBottom: 10,
    },


    colorDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      marginRight: 8,
    },


    colorDotRTL: {
      marginRight: 0,
      marginLeft: 8,
    },


    whiteColorDot: {
      borderWidth: 1,
      borderColor: "#94A3B8",
    },


    optionText: {
      color: "#CBD5E1",
      fontSize: 13,
      fontWeight: "900",
    },


    optionButtonActive: {
      backgroundColor: "#D4AF37",
      borderColor: "#E7C447",
    },


    optionTextActive: {
      color: "#050914",
    },


    unavailableText: {
      color: "#718096",
      fontSize: 13,
      fontWeight: "700",
    },


    // ========================================================
    // SIZE
    // ========================================================

    sizeWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },


    sizeButton: {
      minWidth: 60,
      minHeight: 50,
      backgroundColor: "#101B2E",
      borderWidth: 1,
      borderColor: "#29425D",
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      marginRight: 10,
      marginBottom: 10,
    },


    sizeText: {
      color: "#CBD5E1",
      fontSize: 14,
      fontWeight: "900",
    },


    // ========================================================
    // SELECTION SUMMARY
    // ========================================================

    selectionCard: {
      backgroundColor: "#09172A",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#D4AF37",
      padding: 18,
      marginBottom: 18,
    },


    selectionTitle: {
      color: "#E7C447",
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 14,
    },


    // ========================================================
    // DETAILS
    // ========================================================

    detailsCard: {
      backgroundColor: "#0B182B",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#1E334A",
      padding: 18,
      marginBottom: 18,
    },


    detailsTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 14,
    },


    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#17283A",
      paddingVertical: 12,
    },


    detailLabel: {
      color: "#94A3B8",
      fontSize: 13,
      fontWeight: "700",
    },


    detailValue: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
      maxWidth: "62%",
    },


    detailValueRTL: {
      writingDirection: "rtl",
      textAlign: "left",
    },


    // ========================================================
    // WCOIN REWARD CARD
    // ========================================================

    rewardCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#09172A",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#D4AF37",
      padding: 18,
      marginBottom: 22,
    },


    rewardCoin: {
      width: 48,
      height: 48,
      resizeMode: "contain",
      marginRight: 14,
    },


    rewardCoinRTL: {
      marginRight: 0,
      marginLeft: 14,
    },


    rewardContent: {
      flex: 1,
    },


    rewardTitle: {
      color: "#E7C447",
      fontSize: 16,
      fontWeight: "900",
    },


    rewardText: {
      color: "#AAB3C5",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      marginTop: 4,
    },


    // ========================================================
    // PURCHASE BUTTON
    // ========================================================

    primaryButton: {
      width: "100%",
      minHeight: 62,
      backgroundColor: "#D4AF37",
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
    },


    primaryButtonText: {
      color: "#050914",
      fontSize: 17,
      fontWeight: "900",
      textAlign: "center",
    },


    disabledButton: {
      opacity: 0.45,
    },


    purchaseNote: {
      color: "#94A3B8",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 12,
      paddingHorizontal: 16,
    },


    // ========================================================
    // EMPTY SCREEN
    // ========================================================

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
    },


    emptyIcon: {
      fontSize: 64,
      marginBottom: 18,
    },


    emptyTitle: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "900",
      textAlign: "center",
    },


    emptyText: {
      color: "#94A3B8",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 24,
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


    numberText: {
      writingDirection: "ltr",
    },
  });