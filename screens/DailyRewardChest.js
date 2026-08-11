// screens/DailyRewardChest.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { addWCoins } from "../utils/wcoinStorage";
import { addBooster } from "../utils/boosterStorage";

export default function DailyRewardChest({ setActiveTab }) {
  const claimReward = async () => {
    await addWCoins(100);
    await addBooster("bomb", 1);

    Alert.alert(
      "Daily Reward Claimed!",
      "+100 W Coins and +1 Bomb Booster"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Chest</Text>
      <Text style={styles.chest}>🎁</Text>

      <Text style={styles.text}>
        Claim your daily Legacy Walk reward.
      </Text>

      <TouchableOpacity style={styles.button} onPress={claimReward}>
        <Text style={styles.buttonText}>Claim Reward</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setActiveTab("legathon")}
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },
  chest: {
    fontSize: 90,
    marginVertical: 24,
  },
  text: {
    color: "#dbe7ff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    width: "100%",
    backgroundColor: "#f5c542",
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  backButton: {
    width: "100%",
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