import AsyncStorage from "@react-native-async-storage/async-storage";

const TOTAL_POINTS_KEY = "totalPoints";

// Get lifetime points
export async function getTotalPoints() {
  try {
    const savedPoints = await AsyncStorage.getItem(TOTAL_POINTS_KEY);
    return Number(savedPoints || 0);
  } catch (error) {
    console.log("GET TOTAL POINTS ERROR:", error);
    return 0;
  }
}

// Award points one time only
export async function awardPointsOnce(achievementId, points) {
  try {
    if (!achievementId || Number(points) <= 0) {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await getTotalPoints(),
      };
    }

    const awardKey = `pointsAwarded_${achievementId}`;

    const alreadyAwarded = await AsyncStorage.getItem(awardKey);

    if (alreadyAwarded === "true") {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await getTotalPoints(),
      };
    }

    const currentPoints = await getTotalPoints();
    const newTotal = currentPoints + Number(points);

    await AsyncStorage.multiSet([
      [TOTAL_POINTS_KEY, String(newTotal)],
      [awardKey, "true"],
    ]);

    return {
      awarded: true,
      pointsAdded: Number(points),
      totalPoints: newTotal,
    };
  } catch (error) {
    console.log("AWARD POINTS ERROR:", error);

    return {
      awarded: false,
      pointsAdded: 0,
      totalPoints: await getTotalPoints(),
    };
  }
}