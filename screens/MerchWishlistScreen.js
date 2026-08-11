import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const WISHLIST_ITEMS = [
  {
    id: "legend_headphones",
    name: "Black Gold Legend Headphones",
    collection: "Legend",
    locked: true,
  },
  {
    id: "champion_tracksuit",
    name: "Black Champion Tracksuit",
    collection: "Champion",
    locked: true,
  },
  {
    id: "blue_momentum_set",
    name: "Blue Momentum Collection",
    collection: "Momentum",
    locked: false,
  },
  {
    id: "green_consistency_bag",
    name: "Green Gym Bag",
    collection: "Consistency",
    locked: false,
  },
];

export default function MerchWishlistScreen() {
  const [wishlist, setWishlist] = useState([]);

  function toggleWishlist(item) {
    const exists = wishlist.find((x) => x.id === item.id);

    if (exists) {
      setWishlist(
        wishlist.filter((x) => x.id !== item.id)
      );
    } else {
      setWishlist([...wishlist, item]);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.small}>
        MERCH WISHLIST
      </Text>

      <Text style={styles.title}>
        Future Unlocks
      </Text>

      <Text style={styles.description}>
        Save gear you want to unlock and
        purchase once your achievements
        qualify.
      </Text>

      {WISHLIST_ITEMS.map((item) => {
        const saved = wishlist.find(
          (x) => x.id === item.id
        );

        return (
          <View
            key={item.id}
            style={styles.card}
          >
            <Text style={styles.itemName}>
              {item.name}
            </Text>

            <Text style={styles.collection}>
              {item.collection}
            </Text>

            {item.locked ? (
              <Text style={styles.locked}>
                🔒 Achievement Locked
              </Text>
            ) : (
              <Text style={styles.unlocked}>
                ✅ Eligible
              </Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                toggleWishlist(item)
              }
            >
              <Text style={styles.buttonText}>
                {saved
                  ? "REMOVE FROM WISHLIST"
                  : "ADD TO WISHLIST"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          Saved Items
        </Text>

        <Text style={styles.summaryCount}>
          {wishlist.length}
        </Text>
      </View>

      <View style={{ height: 150 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 18,
    paddingBottom: 150,
  },

  small: {
    color: "#D8A72E",
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "900",
  },

  description: {
    color: "#AAB3BF",
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#111318",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },

  itemName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },

  collection: {
    color: "#D8A72E",
    marginTop: 8,
    fontWeight: "800",
  },

  locked: {
    color: "#FF6B6B",
    marginTop: 10,
  },

  unlocked: {
    color: "#2ECC71",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#D8A72E",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },

  buttonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "900",
  },

  summary: {
    backgroundColor: "#111318",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#D8A72E",
  },

  summaryTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },

  summaryCount: {
    color: "#D8A72E",
    fontSize: 42,
    fontWeight: "900",
    marginTop: 10,
  },
});