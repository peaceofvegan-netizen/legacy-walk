import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const WCOIN = require("../assets/wcoin.png");

export default function PurchaseConfirmationScreen({
  item = {},
  goBack,
  goHome,
  goToInventory,
}) {
  const [confirmed, setConfirmed] = useState(false);

  const name = item.name || item.title || "Legacy Walk Item";

  const price =
    typeof item.price === "number"
      ? item.price
      : Number(String(item.price || "0").replace("$", ""));

  const coins = item.coins || item.coinDiscount || 0;

  const orderNumber = useMemo(() => {
    return `LW-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  const discountAmount = coins > 0 ? Math.min(price * 0.15, coins / 100) : 0;
  const finalPrice = Math.max(price - discountAmount, 0);

  const confirmPurchase = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>

          <Text style={styles.successTitle}>Purchase Confirmed</Text>

          <Text style={styles.successSub}>
            Thank you for supporting Legacy Walk. Your order has been successfully processed!
          </Text>

          <View style={styles.orderBox}>
            <Info label="Order Number" value={orderNumber} />
            <Info label="Item" value={name} />
            <Info label="You Saved" value={`${coins} W Coins`}/>
            <Info label="Delivery" value="3–5 Business Days" />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goHome}>
            <Text style={styles.primaryButtonText}>Return Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={goToInventory}
          >
            <Text style={styles.secondaryButtonText}>View Inventory</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.kicker}>LEGACY WALK STORE</Text>
      <Text style={styles.title}>Confirm Purchase</Text>

      <View style={styles.productCard}>
        {item.image && (
  <Image
    source={item.image}
    style={{
      width: 120,
      height: 120,
      resizeMode: "contain",
      alignSelf: "center",
      marginBottom: 20,
    }}
  />
)}

        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productSub}>Official Legacy Walk Merch</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <Info label="Item Price" value={`$${price.toFixed(2)}`} />

        <View style={styles.coinRow}>
          <View>
            <Text style={styles.infoLabel}>W Coin Discount</Text>
            <Text style={styles.infoValue}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.coinPill}>
            <Image source={WCOIN} style={styles.coinIcon} />
            <Text style={styles.coinText}>{coins}</Text>
          </View>
        </View>

        <Info label="Shipping" value="Free" />
        <Info label="Estimated Delivery" value="3–5 Business Days" />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={confirmPurchase}>
        <Text style={styles.primaryButtonText}>CONFIRM PURCHASE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  content: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 150,
  },

  back: {
    color: "#E7C447",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 24,
  },

  kicker: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginBottom: 24,
  },

  productCard: {
    backgroundColor: "#0B182B",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#1E334A",
  },

  productImage: {
    width: 230,
    height: 230,
    resizeMode: "contain",
    marginBottom: 18,
  },

  productName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  productSub: {
    color: "#E7C447",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },

  summaryCard: {
    backgroundColor: "#0B182B",
    borderRadius: 26,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1E334A",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  infoRow: {
    marginBottom: 16,
  },

  infoLabel: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },

  infoValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  coinRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071224",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E7C447",
  },

  coinIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    marginRight: 8,
  },

  coinText: {
    color: "#E7C447",
    fontSize: 18,
    fontWeight: "900",
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#1E334A",
    marginTop: 8,
    paddingTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: "#A7F3D0",
    fontSize: 20,
    fontWeight: "900",
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  primaryButton: {
  backgroundColor: "#D4AF37",
  borderRadius: 24,
  paddingVertical: 18,
  alignItems: "center",
  marginTop: 4,
  width: "100%",
},

secondaryButton: {
  borderWidth: 1,
  borderColor: "#D4AF37",
  borderRadius: 24,
  paddingVertical: 18,
  alignItems: "center",
  marginTop: 14,
  width: "100%",
},


  secondaryButtonText: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },

  successCard: {
    backgroundColor: "#0B182B",
    borderRadius: 30,
    padding: 28,
    alignItems: "center",
    marginTop: 60,
    borderWidth: 1,
    borderColor: "#1E334A",
  },

  successIcon: {
    fontSize: 72,
    marginBottom: 18,
  },

  successTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  successSub: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 24,
  },

  orderBox: {
    width: "100%",
    backgroundColor: "#071224",
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },
}); 