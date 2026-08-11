import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loadWCoins, saveWCoins } from "../utils/wCoinStorage";
import { addWCoinTransaction } from "../utils/wCoinTransactions";

const WCOIN = require("../assets/wcoin.png");

const MARKET_ITEMS = [
  {
    id: "black-gold-profile-frame",
    category: "Profile Frames",
    icon: "🖼️",
    title: "Black + Gold Profile Frame",
    subtitle: "Legendary community profile border",
    price: 1200,
  },
  {
    id: "selma-premium-story-pack",
    category: "Premium Journeys",
    icon: "📖",
    title: "Selma Bonus Story Pack",
    subtitle: "Unlock extra historical checkpoints",
    price: 1500,
  },
  {
    id: "boston-262-unlock",
    category: "Marathon Unlocks",
    icon: "🏃",
    title: "Boston 26.2 Challenge",
    subtitle: "Unlock a World Marathon Series route",
    price: 2000,
  },
  {
    id: "gold-walker-badge",
    category: "Special Badges",
    icon: "🏅",
    title: "Gold Walker Badge",
    subtitle: "Show achievement status in Community",
    price: 2500,
  },
  {
    id: "black-legacy-drop",
    category: "Limited Drops",
    icon: "👑",
    title: "Black Legacy Digital Drop",
    subtitle: "Exclusive avatar and profile collection",
    price: 5000,
  },
];

export default function WCoinMarketplaceScreen({ goBack }) {
  const [wCoins, setWCoins] = useState(0);
  const [ownedItems, setOwnedItems] = useState([]);

  useEffect(() => {
    loadMarketplace();
  }, []);

  async function loadMarketplace() {
    const coins = await loadWCoins();
    const savedOwned = await AsyncStorage.getItem("ownedMarketplaceItems");

    setWCoins(coins);
    setOwnedItems(savedOwned ? JSON.parse(savedOwned) : []);
  }

  async function buyItem(item) {
    const owned = ownedItems.includes(item.id);

    if (owned) return;

    if (wCoins < item.price) {
      Alert.alert(
        "Not Enough W Coins",
        `You need ${item.price.toLocaleString()} W Coins to unlock ${item.title}.`
      );
      return;
    }

    const updatedCoins = wCoins - item.price;
    const updatedOwned = [...ownedItems, item.id];

    await saveWCoins(updatedCoins);
    await AsyncStorage.setItem(
      "ownedMarketplaceItems",
      JSON.stringify(updatedOwned)
    );

    await addWCoinTransaction({
      type: "spent",
      amount: item.price,
      title: `Marketplace unlock: ${item.title}`,
    });

    setWCoins(updatedCoins);
    setOwnedItems(updatedOwned);

    Alert.alert("Unlocked", `${item.title} has been added to your account.`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>W COIN ECONOMY</Text>
        <Text style={styles.title}>Marketplace</Text>

        <Text style={styles.subtitle}>
          Spend W Coins on premium journeys, marathon unlocks, badges, profile
          frames, avatar items, and limited drops.
        </Text>

        <View style={styles.walletCard}>
          <Image source={WCOIN} style={styles.coinImage} />

          <View>
            <Text style={styles.walletAmount}>{wCoins.toLocaleString()}</Text>
            <Text style={styles.walletLabel}>Available W Coins</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔥</Text>
          <Text style={styles.featureTitle}>Limited Weekly Drop</Text>
          <Text style={styles.featureText}>
            Earn more coins from walking, stories, marathons, AI wellness
            check-ins, and community challenges.
          </Text>
        </View>

        {MARKET_ITEMS.map((item) => {
          const owned = ownedItems.includes(item.id);
          const affordable = wCoins >= item.price;

          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.iconBox}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceWrap}>
                  <Image source={WCOIN} style={styles.priceCoin} />
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    owned && styles.ownedButton,
                    !affordable && !owned && styles.disabledButton,
                  ]}
                  onPress={() => buyItem(item)}
                  disabled={owned}
                >
                  <Text style={styles.buyButtonText}>
                    {owned
                      ? "Owned"
                      : affordable
                      ? "Unlock"
                      : "Need More Coins"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Earn W Coins</Text>
          <Text style={styles.infoText}>• Complete daily challenges</Text>
          <Text style={styles.infoText}>• Reach journey checkpoints</Text>
          <Text style={styles.infoText}>• Finish marathon challenges</Text>
          <Text style={styles.infoText}>• Complete AI wellness check-ins</Text>
          <Text style={styles.infoText}>• Win community challenges</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 22,
    paddingBottom: 180,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0B111B",
    borderWidth: 1,
    borderColor: "#1F2A3D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  backText: {
    color: "#E0AE25",
    fontSize: 40,
    fontWeight: "900",
    marginTop: -5,
  },

  kicker: {
    color: "#A6FFD2",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#A8B0BF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 22,
  },

  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    padding: 20,
    marginBottom: 18,
  },

  coinImage: {
    width: 58,
    height: 58,
    resizeMode: "contain",
    marginRight: 14,
  },

  walletAmount: {
    color: "#E0AE25",
    fontSize: 42,
    fontWeight: "900",
  },

  walletLabel: {
    color: "#9AA4B7",
    fontSize: 15,
    fontWeight: "900",
  },

  featureCard: {
    backgroundColor: "#120F08",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E0AE25",
    padding: 22,
    marginBottom: 18,
  },

  featureIcon: {
    fontSize: 36,
    marginBottom: 10,
  },

  featureTitle: {
    color: "#E0AE25",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 8,
  },

  featureText: {
    color: "#D8DEE9",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 24,
  },

  itemCard: {
    backgroundColor: "#0A0F17",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    padding: 18,
    marginBottom: 16,
  },

  itemTop: {
    flexDirection: "row",
    gap: 14,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  itemIcon: {
    fontSize: 28,
  },

  itemInfo: {
    flex: 1,
  },

  category: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },

  itemTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  itemSubtitle: {
    color: "#9AA4B7",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 5,
  },

  priceRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  priceCoin: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    marginRight: 7,
  },

  priceText: {
    color: "#E0AE25",
    fontSize: 24,
    fontWeight: "900",
  },

  buyButton: {
    backgroundColor: "#E0AE25",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },

  ownedButton: {
    backgroundColor: "#A6FFD2",
  },

  disabledButton: {
    backgroundColor: "#3A3F49",
  },

  buyButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "900",
  },

  infoCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    padding: 20,
    marginTop: 4,
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },

  infoText: {
    color: "#A8B0BF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
});