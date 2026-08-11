import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getWCoins,
} from "../utils/wcoinStorage";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const LEGACY_BG = require("../assets/collage-background.png");
const WCOIN = require("../assets/wcoin.png");

export default function WCoinWalletScreen({
  goBack,
  goToStore,
  wCoinBalance: incomingBalance = 0,
  earnedToday = 75,
  spentThisWeek = 500,
}) {
const [wCoinBalance, setWCoinBalance] =
  useState(Number(incomingBalance || 0));

const refreshWCoinBalance = useCallback(async () => {
  try {
    const latestBalance = Number(
      await getWCoins()
    );

    setWCoinBalance(latestBalance);

    console.log(
      "WCOIN WALLET REFRESHED:",
      latestBalance
    );
  } catch (error) {
    console.error(
      "WCOIN WALLET REFRESH ERROR:",
      error
    );
  }
}, []);

useEffect(() => {
  refreshWCoinBalance();
}, [refreshWCoinBalance]);

useEffect(() => {
  setWCoinBalance(
    Number(incomingBalance || 0)
  );
}, [incomingBalance]);


  return (
    <ImageBackground
      source={LEGACY_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
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

            <Text style={styles.kicker}>W COIN WALLET</Text>

            <Text style={styles.title}>Your Legacy Currency</Text>

            <View style={styles.walletCard}>
              <Text style={styles.walletLabel}>AVAILABLE BALANCE</Text>

              <Image source={WCOIN} style={styles.coinIcon} />

              <Text style={styles.balance}>
                {Number(wCoinBalance || 0).toLocaleString()}
              </Text>

              <Text style={styles.walletText}>W Coins</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>+{earnedToday}</Text>
                <Text style={styles.statLabel}>Earned Today</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>-{spentThisWeek}</Text>
                <Text style={styles.statLabel}>Spent This Week</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={goToStore}
            >
              <Text style={styles.primaryButtonText}>Redeem In Store</Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              W Coins can be used toward Legacy Walk rewards, discounts, and
              unlocked gear.
            </Text>

            <View style={{ height: 120 }} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#020617",
  },
  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.45,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.78)",
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 70,
    paddingBottom: 160,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#D4AF37",
    backgroundColor: "rgba(8,18,37,0.85)",
    marginBottom: 36,
  },
  backText: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "900",
  },
  kicker: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    lineHeight: 58,
    fontWeight: "900",
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: "rgba(212,175,55,0.14)",
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.55)",
    paddingVertical: 38,
    paddingHorizontal: 22,
    alignItems: "center",
    marginBottom: 24,
  },
  walletLabel: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 28,
  },
  coinIcon: {
    width: 96,
    height: 96,
    resizeMode: "contain",
    marginBottom: 24,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 76,
    lineHeight: 82,
    fontWeight: "900",
  },
  walletText: {
    color: "#CBD5E1",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(8,18,37,0.94)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  statNumber: {
    color: "#A7F3D0",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 8,
  },
  statLabel: {
    color: "#AAB3C5",
    fontSize: 15,
    fontWeight: "900",
  },
  primaryButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
  },
  note: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    textAlign: "center",
  },
});