import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
// screens/WCoinShop.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { addWCoins } from "../utils/wcoinStorage";

const COIN_PACKS = [
  { id: "coins_500", coins: 500, price: "$0.99" },
  { id: "coins_1200", coins: 1200, price: "$1.99" },
  { id: "coins_3000", coins: 3000, price: "$4.99" },
  { id: "coins_7500", coins: 7500, price: "$9.99" },
];

export default function WCoinShop({ setActiveTab }) {
  const _accountSession = captureAccountSession();

  const buyPack = async (pack) => {
  try {
    _accountSession.assertCurrent();

    await _accountSession.run(async () => (addWCoins(pack.coins)));

    Alert.alert(
      "W Coins Added",
      `+${pack.coins} W Coins added.`
    );
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>W Coin Shop</Text>

      <Text style={styles.subtitle}>
        Buy W Coins to refill lives and boosters.
      </Text>

      {COIN_PACKS.map((pack) => {
  

return ((
        <TouchableOpacity
          key={pack.id}
          style={styles.card}
          onPress={() => {
  

return (buyPack(pack));
}}
        >
          <Text style={styles.coins}>🪙 {pack.coins} W Coins</Text>
          <Text style={styles.price}>{pack.price}</Text>
        </TouchableOpacity>
      ));
})}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
  

return (setActiveTab("legathon"));
}}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    padding: 24,
    paddingTop: 70,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#dbe7ff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 18,
  },
  card: {
    backgroundColor: "rgba(245,197,66,0.16)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(245,197,66,0.45)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coins: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  price: {
    color: "#f5c542",
    fontSize: 18,
    fontWeight: "900",
  },
  backButton: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "900",
  },
});