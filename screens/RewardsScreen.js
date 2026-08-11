import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { translate } from "../i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWCoins } from "../utils/wcoinStorage";
import { loadCloudRewardPoints } from "../services/cloudSync";
import { supabase } from "../lib/supabase";
const WCOIN_IMAGE = require("../assets/wcoin.png");

const BLUE_TRACKSUIT = require("../assets/tracksuits/blue_tracksuit.png");
const GREEN_TRACKSUIT = require("../assets/tracksuits/green_tracksuit.png");
const YELLOW_TRACKSUIT = require("../assets/tracksuits/yellow_tracksuit.png");
const RED_TRACKSUIT = require("../assets/tracksuits/red_tracksuit.png");
const BLACK_TRACKSUIT = require("../assets/tracksuits/elite_tracksuit.png");

const TRACKSUITS = [
  {
    id: "blue",
    name: "Explorer Blue",
    unlockSteps: 150000,
    image: BLUE_TRACKSUIT,
    color: "#2563EB",
  },
  {
    id: "green",
    name: "Pathfinder Green",
    unlockSteps: 250000,
    image: GREEN_TRACKSUIT,
    color: "#22C55E",
  },
  {
    id: "red",
    name: "Trailblazer Red",
    unlockSteps: 350000,
    image: RED_TRACKSUIT,
    color: "#EF4444",
  },
  {
    id: "yellow",
    name: "Legend Yellow",
    unlockSteps: 1000000,
    image: YELLOW_TRACKSUIT,
    color: "#EAB308",
  },
  {
    id: "black",
    name: "Elite Black",
    unlockSteps: 3000000,
    image: BLACK_TRACKSUIT,
    color: "#111827",
  },
];
export default function RewardsScreen({
  language = "en",
  goBack,
  wCoinBalance: incomingBalance = 0,
  addWCoins,
}) {

  const [wCoinBalance, setWCoinBalance] = React.useState(
  Number(incomingBalance || 0)
);
const [rewardPoints, setRewardPoints] = React.useState(0);
const refreshWCoinBalance = React.useCallback(async () => {
  try {
    const latestBalance = Number(await getWCoins());

    setWCoinBalance(latestBalance);

    console.log(
      "REWARDS WCOIN BALANCE:",
      latestBalance
    );
  } catch (error) {
    console.error(
      "REWARDS BALANCE REFRESH ERROR:",
      error
    );
  }
}, []);
const loadRewardPoints = React.useCallback(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const rewards = await loadCloudRewardPoints(user.id);

    setRewardPoints(rewards.points || 0);

  } catch (error) {
    console.log("Reward Points Error:", error);
  }
}, []);
React.useEffect(() => {
    refreshWCoinBalance();
    loadRewardPoints();
}, [refreshWCoinBalance, loadRewardPoints]);

React.useEffect(() => {
  setWCoinBalance(Number(incomingBalance || 0));
}, [incomingBalance]);



  const [totalSteps, setTotalSteps] = React.useState(0);

 React.useEffect(() => {
  async function loadSteps() {
  const lifetime = await AsyncStorage.getItem("lifetimeSteps");
  const today = await AsyncStorage.getItem("todaySteps");
  const stepsKey = await AsyncStorage.getItem("steps");

  const steps =
    Number(lifetime || 0) ||
    Number(today || 0) ||
    Number(stepsKey || 0);

  setTotalSteps(steps);

  const unlockedSuits = TRACKSUITS
    .filter((suit) => steps >= suit.unlockSteps)
    .map((suit) => suit.id);

  await AsyncStorage.setItem(
    "unlockedTracksuits",
    JSON.stringify(unlockedSuits)
  );

  const highestUnlocked = TRACKSUITS
    .filter((suit) => steps >= suit.unlockSteps)
    .pop();

  if (highestUnlocked) {
    await AsyncStorage.setItem(
      "equippedTracksuit",
      highestUnlocked.id
    );
  }
}

  loadSteps();

  const timer = setInterval(loadSteps, 3000);

  return () => clearInterval(timer);
}, []);
    
   return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
     <Text style={styles.kicker}>
  {translate(language, "legathonWalk")}
</Text>

<Text style={styles.title}>
  {translate(language, "rewards")}
</Text>

      <View style={styles.walletCard}>
        <Image source={WCOIN_IMAGE} style={styles.walletCoin} />

        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>
  {translate(language, "wCoinWallet")}
</Text>
        <Text style={styles.walletAmount}>{wCoinBalance}</Text>
          <Text style={styles.walletText}>
  {translate(language, "storeCreditInfo")}
</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
  {translate(language, "Tracksuit Unlocks")}
</Text>




      {TRACKSUITS.map((item) => {
        const unlocked = totalSteps >= item.unlockSteps;
        const progress = Math.min((totalSteps / item.unlockSteps) * 100, 100);
        const remaining = Math.max(item.unlockSteps - totalSteps, 0);

        return (
          <View key={item.id} style={styles.suitCard}>
            <View style={styles.imageWrap}>
              <Image source={item.image} style={styles.suitImage} />

              <View style={unlocked ? styles.unlockedBadge : styles.lockBadge}>
                <Text style={unlocked ? styles.unlockedText : styles.lockText}>
                  {unlocked ? "✅ UNLOCKED" : "🔒 LOCKED"}
                </Text>
              </View>
            </View>

            <Text style={styles.suitName}>{item.name}</Text>
            <Text style={styles.suitSub}>
              Unlock at {item.unlockSteps.toLocaleString()} steps
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: item.color },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {totalSteps.toLocaleString()} / {item.unlockSteps.toLocaleString()} steps
            </Text>

            <Text style={styles.statusText}>
              {unlocked
                ? "Unlocked and ready to wear"
                : `${remaining.toLocaleString()} steps remaining`}
            </Text>
          </View>
        );
      })}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitleSmall}>Reward Redemption</Text>

        <RewardRow points="2,500" reward="$5 Reward" />
        <RewardRow points="10,000" reward="$10 Reward" />
        <RewardRow points="25,000" reward="$25 Reward" />
        <RewardRow points="50,000" reward="Sponsor Reward" />
        <RewardRow points="100,000" reward="Legathon Experience" />

        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem Rewards</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function RewardRow({ points, reward }) {
  return (
    <View style={styles.rewardRow}>
      <Text style={styles.rewardPoints}>{points} Points</Text>
      <Text style={styles.rewardPrize}>{reward}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 240,
  },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginBottom: 18,
  },

  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#EAB308",
    padding: 16,
    marginBottom: 28,
  },

  walletCoin: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    marginRight: 16,
  },

  walletInfo: {
    flex: 1,
  },

  walletLabel: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "900",
  },

  walletAmount: {
    color: "#EAB308",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 2,
  },

  walletText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 16,
  },

  suitCard: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#263244",
    padding: 14,
    marginBottom: 24,
  },

  imageWrap: {
    width: "100%",
    height: 430,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    marginBottom: 14,
  },

  suitImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  lockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#EAB308",
  },

  lockText: {
    color: "#EAB308",
    fontSize: 14,
    fontWeight: "900",
  },

  unlockedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#052E16",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#22C55E",
  },

  unlockedText: {
    color: "#86EFAC",
    fontSize: 14,
    fontWeight: "900",
  },

  suitName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  suitSub: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  progressBar: {
    height: 12,
    backgroundColor: "#1E293B",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    borderRadius: 99,
  },

  progressText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 10,
  },

  statusText: {
    color: "#A7F3D0",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4,
  },

  sectionCard: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#263244",
    padding: 20,
    marginBottom: 40,
  },

  sectionTitleSmall: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 16,
  },

  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  rewardPoints: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
  },

  rewardPrize: {
    color: "#EAB308",
    fontSize: 16,
    fontWeight: "900",
  },

  redeemButton: {
    backgroundColor: "#EAB308",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },

  redeemButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "900",
  },
});