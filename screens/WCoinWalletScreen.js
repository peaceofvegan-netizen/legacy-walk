import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getWCoins } from "../utils/wcoinStorage";

// ============================================================
// ASSETS AND COLORS
// ============================================================

const BACKGROUND = require(
  "../assets/collage-background.png"
);

const WCOIN = require("../assets/wcoin.png");

const GOLD = "#E6BC43";

// ============================================================
// HELPERS
// ============================================================

function validAmount(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? Math.floor(parsed)
    : null;
}

function formatAmount(value) {
  return value === null
    ? "—"
    : value.toLocaleString();
}

// ============================================================
// WALLET SCREEN
// ============================================================

export default function WCoinWalletScreen({
  goBack,
  goToStore,
  wCoinBalance: incomingBalance,
  earnedToday,
  spentThisWeek,
}) {
  const [balance, setBalance] = useState(() =>
    validAmount(incomingBalance)
  );

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [updatedAt, setUpdatedAt] =
    useState(null);

  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const earned = validAmount(earnedToday);
  const spent = validAmount(spentThisWeek);

  const canOpenStore =
    typeof goToStore === "function";

  // ==========================================================
  // REFRESH BALANCE
  // ==========================================================

  const refreshBalance = useCallback(async () => {
    const requestId = ++requestRef.current;

    if (mountedRef.current) {
      setRefreshing(true);
    }

    try {
      const latest = validAmount(
        await getWCoins()
      );

      if (latest === null) {
        throw new Error("Invalid wallet balance.");
      }

      if (
        !mountedRef.current ||
        requestId !== requestRef.current
      ) {
        return;
      }

      setBalance(latest);
      setUpdatedAt(new Date());
      setError("");
    } catch (caught) {
      console.error(
        "WCoin wallet refresh failed:",
        caught
      );

      if (
        mountedRef.current &&
        requestId === requestRef.current
      ) {
        setError(
          "Your balance could not be refreshed. Please try again."
        );
      }
    } finally {
      if (
        mountedRef.current &&
        requestId === requestRef.current
      ) {
        setRefreshing(false);
      }
    }
  }, []);

  // ==========================================================
  // FOREGROUND REFRESH AND CLEANUP
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    const subscription =
      AppState.addEventListener(
        "change",
        nextState => {
          if (nextState === "active") {
            void refreshBalance();
          }
        }
      );

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      subscription.remove();
    };
  }, [refreshBalance]);

  // ==========================================================
  // INITIAL LOAD AND PARENT BALANCE UPDATES
  // ==========================================================

  useEffect(() => {
    // Read storage again instead of overwriting a loaded
    // balance with a potentially older prop value.
    void refreshBalance();
  }, [incomingBalance, refreshBalance]);

  // ==========================================================
  // BALANCE STATUS
  // ==========================================================

  const status = refreshing
    ? "Updating balance…"
    : error
      ? balance === null
        ? "Balance unavailable"
        : "Last known balance"
      : updatedAt
        ? `Updated ${updatedAt.toLocaleTimeString(
            [],
            {
              hour: "numeric",
              minute: "2-digit",
            }
          )}`
        : "Checking balance…";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ImageBackground
      source={BACKGROUND}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshBalance}
              tintColor={GOLD}
              colors={[GOLD]}
            />
          }
        >
          {/* HEADER */}

          <View style={styles.header}>
            {typeof goBack === "function" ? (
              <TouchableOpacity
                onPress={goBack}
                style={styles.backButton}
                accessibilityRole="button"
              >
                <Text style={styles.backText}>
                  ‹ Back
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <Text style={styles.brand}>
              LEGATHON
            </Text>
          </View>

          <Text style={styles.kicker}>
            WCOIN WALLET
          </Text>

          <Text style={styles.title}>
            Your walking{"\n"}rewards.
          </Text>

          <Text style={styles.subtitle}>
            Your WCoins, all in one place.
          </Text>

          {/* AVAILABLE BALANCE */}

          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceHeading}>
                <Text style={styles.balanceLabel}>
                  AVAILABLE BALANCE
                </Text>

                <Text style={styles.balanceCaption}>
                  Earned through your Legathon activity
                </Text>
              </View>

              <View style={styles.coinContainer}>
                <Image
                  source={WCOIN}
                  style={styles.coin}
                  accessible={false}
                />
              </View>
            </View>

            <Text
              style={styles.balance}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.35}
            >
              {formatAmount(balance)}
            </Text>

            <Text style={styles.currency}>
              WCoins
            </Text>

            <View style={styles.balanceFooter}>
              <Text style={styles.updateText}>
                {status}
              </Text>

              <TouchableOpacity
                onPress={refreshBalance}
                disabled={refreshing}
                style={styles.refreshButton}
                accessibilityRole="button"
                accessibilityLabel="Refresh wallet balance"
                accessibilityState={{
                  disabled: refreshing,
                  busy: refreshing,
                }}
              >
                {refreshing ? (
                  <ActivityIndicator
                    size="small"
                    color={GOLD}
                  />
                ) : (
                  <Text style={styles.refreshText}>
                    Refresh ↻
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* REFRESH ERROR */}

          {!!error && (
            <View
              style={styles.errorCard}
              accessibilityLiveRegion="polite"
            >
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          {/* WALLET ACTIVITY */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Wallet activity
            </Text>
          </View>

          <View style={styles.statsRow}>
            <ActivityCard
              label="Earned today"
              amount={earned}
              prefix="+"
              positive
            />

            <ActivityCard
              label="Spent this week"
              amount={spent}
              prefix="−"
            />
          </View>

          {(earned === null || spent === null) && (
            <Text style={styles.helper}>
              A dash means that activity total is not
              available yet.
            </Text>
          )}

          {/* STORE */}

          <View style={styles.storeCard}>
            <Text style={styles.kicker}>
              PUT YOUR WCOINS TO USE
            </Text>

            <Text style={styles.storeTitle}>
              Explore the store
            </Text>

            <Text style={styles.storeDescription}>
              Browse Legathon merchandise and available
              WCoin redemption options.
            </Text>

            <TouchableOpacity
              onPress={
                canOpenStore ? goToStore : undefined
              }
              disabled={!canOpenStore}
              accessibilityRole="button"
              accessibilityState={{
                disabled: !canOpenStore,
              }}
              style={[
                styles.storeButton,
                !canOpenStore && styles.disabled,
              ]}
            >
              <Text style={styles.storeButtonText}>
                {canOpenStore
                  ? "Redeem in Store  →"
                  : "Store unavailable"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Keep walking. Keep building your Legathon
            story.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ============================================================
// ACTIVITY CARD
// ============================================================

function ActivityCard({
  label,
  amount,
  prefix,
  positive = false,
}) {
  const displayValue =
    amount === null
      ? "—"
      : `${amount > 0 ? prefix : ""}${formatAmount(
          amount
        )}`;

  return (
    <View style={styles.statCard}>
      <Text
        style={[
          styles.statValue,
          positive
            ? styles.earnedValue
            : styles.spentValue,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {displayValue}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>

      <Text style={styles.statUnit}>
        WCoins
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#040817",
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.12,
  },

  safe: {
    flex: 1,
    backgroundColor: "rgba(4,8,23,0.92)",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#3A3540",
  },

  backText: {
    color: GOLD,
    fontSize: 17,
    fontWeight: "700",
  },

  brand: {
    color: "#9CA9BC",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.2,
  },

  kicker: {
    color: GOLD,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 35,
    lineHeight: 40,
    fontWeight: "900",
    marginTop: 10,
  },

  subtitle: {
    color: "#A7B3C7",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },

  balanceCard: {
    backgroundColor: "#191B22",
    borderWidth: 1,
    borderColor: "#78652D",
    borderRadius: 26,
    padding: 22,
  },

  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  balanceHeading: {
    flex: 1,
    paddingRight: 10,
  },

  balanceLabel: {
    color: GOLD,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  balanceCaption: {
    color: "#A9B0BD",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  coinContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2B2B29",
    alignItems: "center",
    justifyContent: "center",
  },

  coin: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },

  balance: {
    color: "#FFFFFF",
    fontSize: 57,
    fontWeight: "900",
    marginTop: 22,
    alignSelf: "stretch",
  },

  currency: {
    color: GOLD,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },

  balanceFooter: {
    borderTopWidth: 1,
    borderTopColor: "#363638",
    marginTop: 22,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  updateText: {
    color: "#A9B0BD",
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    paddingRight: 8,
  },

  refreshButton: {
    minWidth: 80,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  refreshText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "800",
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    minWidth: 0,
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#263347",
    backgroundColor: "#0C1627",
  },

  statValue: {
    fontSize: 29,
    fontWeight: "900",
    marginBottom: 8,
  },

  earnedValue: {
    color: "#A7F3D0",
  },

  spentValue: {
    color: "#E8C782",
  },

  statLabel: {
    color: "#D6DDE7",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  statUnit: {
    color: "#7E8EA5",
    fontSize: 11,
    marginTop: 4,
  },

  helper: {
    color: "#8594AA",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  storeCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#0C1627",
    borderWidth: 1,
    borderColor: "#263347",
  },

  storeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },

  storeDescription: {
    color: "#A7B3C7",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 9,
  },

  storeButton: {
    backgroundColor: GOLD,
    minHeight: 54,
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  storeButtonText: {
    color: "#08111F",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  footerNote: {
    color: "#8996AB",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 22,
    paddingHorizontal: 15,
  },

  errorCard: {
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#301E28",
  },

  errorText: {
    color: "#FFD0D8",
    fontSize: 13,
    lineHeight: 20,
  },
});