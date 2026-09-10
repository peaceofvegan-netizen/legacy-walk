import AsyncStorage from "@react-native-async-storage/async-storage";

const TOTAL_POINTS_KEY = "totalPoints";

// Get current lifetime points
export async function getTotalPoints() {
  try {
    const saved = await AsyncStorage.getItem(TOTAL_POINTS_KEY);
    return Number(saved || 0);
  } catch (error) {
    console.log("Get points error:", error);
    return 0;
  }
}

// Award points only once for a specific achievement
export async function awardPointsOnce({
  achievementId,
  points,
}) {
  try {
    if (!achievementId || points <= 0) {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await getTotalPoints(),
      };
    }

    const rewardKey = `pointsAwarded_${achievementId}`;

    const alreadyAwarded =
      await AsyncStorage.getItem(rewardKey);

    const currentTotal = await getTotalPoints();

    if (alreadyAwarded === "true") {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: currentTotal,
      };
    }

    const newTotal = currentTotal + Number(points);

    await AsyncStorage.setItem(
      TOTAL_POINTS_KEY,
      String(newTotal)
    );

    await AsyncStorage.setItem(
      rewardKey,
      "true"
    );

    return {
      awarded: true,
      pointsAdded: Number(points),
      totalPoints: newTotal,
    };
  } catch (error) {
    console.log("Award points error:", error);

    return {
      awarded: false,
      pointsAdded: 0,
      totalPoints: await getTotalPoints(),
    };
  }
}