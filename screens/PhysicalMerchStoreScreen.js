

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getWCoins } from "../utils/wcoinStorage";
import { APPAREL_CATALOG } from "../assets/apparel/apparelCatalog";

const WCOIN = require("../assets/wcoin.png");

const MAIN_CATEGORIES = ["Mens", "Womens", "Accessories"];
export default function PhysicalMerchStoreScreen({
  language,
  goBack,
  openItem,
  goToPurchaseConfirmation,
  wCoinBalance: incomingBalance = 0,
  spendWCoins,
}) {

  const totalSteps = 250000;
  const [activeCategory, setActiveCategory] = useState("Mens");

const [wCoinBalance, setWCoinBalance] =
  useState(Number(incomingBalance || 0));

const refreshWCoinBalance = useCallback(async () => {
  try {
    const latestBalance = Number(
      await getWCoins()
    );

    setWCoinBalance(latestBalance);

    console.log(
      "STORE WCOIN BALANCE:",
      latestBalance
    );
  } catch (error) {
    console.error(
      "STORE BALANCE REFRESH ERROR:",
      error
    );
  }
}, []);

useEffect(() => {
  refreshWCoinBalance();
}, [refreshWCoinBalance]);


  const filteredItems = useMemo(() => {
    return APPAREL_CATALOG.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {goBack && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.kicker}>LEGATHON WALK STORE</Text>
        <Text style={styles.title}>Official Store</Text>
        <Text style={styles.subTitle}>
          Premium apparel, accessories, and exclusive Legathon Walk gear.
        </Text>

        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>W COIN BALANCE</Text>

          <View style={styles.walletRow}>
            <Image source={WCOIN} style={styles.coinIcon} />
            <Text style={styles.walletAmount}>
              {Number(wCoinBalance || 0).toLocaleString()}
            </Text>
          </View>

          <Text style={styles.walletSub}>
            Use W Coins for cash discounts on unlocked gear.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {MAIN_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.categoryPillActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          {activeCategory === "Mens"
            ? "Shop Collection"
            : activeCategory === "Womens"
            ? "Shop Collection"
            : "Accessories"}
        </Text>

        <View style={styles.grid}>
      {filteredItems.map((item) => {
  const unlocked = totalSteps >= Number(item.unlockSteps || 0);

  return (
              <View
                key={item.id}
                style={[
                  styles.productCard,
                  !unlocked && styles.lockedCard,
                ]}
              >
                <View style={styles.imageWrap}>
                  <Image source={item.image} style={styles.productImage} />

                  {!unlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockText}>LOCKED</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.productName}>
                  {item.title || item.name || "Legacy Item"}
                </Text>

                <Text style={styles.collectionText}>
                  {item.collection || "Legacy"} Gear
                </Text>

                <Text style={styles.price}>
                  ${Number(item.price || 0).toFixed(2)}
                </Text>

                <View style={styles.coinRow}>
                  <Image source={WCOIN} style={styles.smallCoin} />
                  <Text style={styles.coinCost}>{item.coins || 0}</Text>
                </View>

   
<TouchableOpacity
  style={[
    styles.buyButton,
    unlocked
      ? styles.buyButtonActive
      : styles.buyButtonLocked,
  ]}
  onPress={() => {
    console.log("BUY PRESSED", item.name || item.title);

    if (goToPurchaseConfirmation) {
      goToPurchaseConfirmation(item);
    } else if (openItem) {
      openItem(item);
    }
  }}
>
  <Text style={styles.buyText}>
    {unlocked ? "Buy / Redeem" : "Test Redeem"}
  </Text>
</TouchableOpacity>
            );
 
        
                </View>
        );
      })}
    </View>

    <View style={{ height: 100 }} />
  </ScrollView>
</SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050914",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 180,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#E7C447",
    backgroundColor: "#071224",
    marginBottom: 24,
  },
  backText: {
    color: "#E7C447",
    fontSize: 22,
    fontWeight: "900",
  },
  kicker: {
    color: "#E7C447",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "900",
  },
  subTitle: {
    color: "#AAB3C5",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
    marginTop: 14,
  },
  walletCard: {
    backgroundColor: "#071224",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#2B6470",
    padding: 20,
    marginTop: 26,
    marginBottom: 24,
  },
  walletLabel: {
    color: "#A7F3D0",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 14,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    marginRight: 18,
  },
  walletAmount: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
  },
  walletSub: {
    color: "#AAB3C5",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
    marginTop: 14,
  },
  categoryScroll: {
    marginTop: 24,
    marginBottom: 24,
  },
  categoryPill: {
    minWidth: 120,
    height: 44,
    marginRight: 12,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101B2E",
    borderWidth: 1,
    borderColor: "#103557",
  },
  categoryPillActive: {
    backgroundColor: "#F2C438",
    borderColor: "#F2C438",
  },
  categoryText: {
    color: "#B8C4D9",
    fontSize: 18,
    fontWeight: "700",
  },
  categoryTextActive: {
    color: "#000000",
  },
  sectionTitle: {
    color: "#A7F3D0",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
    opacity: 0.75,
  },
  imageWrap: {
    height: 150,
    borderRadius: 18,
    backgroundColor: "#050914",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden",
  },
  productImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  lockOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  lockText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  collectionText: {
    color: "#AAB3C5",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  smallCoin: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 8,
  },
  coinCost: {
    color: "#F2C438",
    fontSize: 18,
    fontWeight: "900",
  },
  buyButton: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyButtonActive: {
    backgroundColor: "#F2C438",
  },
  buyButtonLocked: {
    backgroundColor: "#263244",
  },
  buyText: {
    color: "#00142D",
    fontSize: 15,
    fontWeight: "900",
  },
});