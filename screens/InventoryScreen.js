import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../i18n/i18n";
const INVENTORY_ITEMS = [
  {
    id: "blue-shoes",
    title: "Blue W Shoes",
    type: "Explorer Gear",
    icon: "👟",
  },
  {
    id: "green-tracksuit",
    title: "Green Tracksuit",
    type: "Pathfinder Gear",
    icon: "🟢",
  },
  {
    id: "red-headphones",
    title: "Red Headphones",
    type: "Trailblazer Gear",
    icon: "🎧",
  },
  {
    id: "gold-coin",
    title: "Gold W Coin",
    type: "Legend Gear",
    icon: "🪙",
  },
  {
    id: "black-legacy-set",
    title: "Black Legacy Set",
    type: "Black Legacy Gear",
    icon: "👑",
  },
];

export default function InventoryScreen({ 
  language = "en",
  goBack,
}) {
  const [ownedItems, setOwnedItems] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const saved = await AsyncStorage.getItem("ownedAvatarItems");
    setOwnedItems(saved ? JSON.parse(saved) : []);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
  {translate(language, "inventoryTitle")}
</Text>
        <Text style={styles.title}>Owned Gear</Text>

        <Text style={styles.subtitle}>
          View the avatar gear you’ve unlocked or purchased with W Coins.
        </Text>

        {INVENTORY_ITEMS.map((item) => {
          const owned = ownedItems.includes(item.id);

          return (
            <View key={item.id} style={styles.card}>
              <Text style={styles.icon}>{item.icon}</Text>

              <View style={styles.info}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
              </View>

              <Text style={[styles.status, owned ? styles.owned : styles.locked]}>
                {owned ? "Owned" : "Locked"}
              </Text>
            </View>
          );
        })}
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
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginBottom: 12,
  },

  subtitle: {
    color: "#A8B0BF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 24,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A0F17",
    borderWidth: 1,
    borderColor: "#1F2A3D",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  icon: {
    fontSize: 34,
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  itemTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  itemType: {
    color: "#9AA4B7",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },

  status: {
    fontSize: 14,
    fontWeight: "900",
  },

  owned: {
    color: "#A6FFD2",
  },

  locked: {
    color: "#6B7280",
  },
});