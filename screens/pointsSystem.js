import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";


const TOTAL_POINTS_KEY = "totalPoints";

// Get current lifetime points
export async function getTotalPoints() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const saved = await _accountSession.run(async () => (AsyncStorage.getItem(TOTAL_POINTS_KEY)));
    return Number(saved || 0);
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Get points error:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// Award points only once for a specific achievement
export async function awardPointsOnce({
  achievementId,
  points,
}) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    if (!achievementId || points <= 0) {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await _accountSession2.run(async () => (getTotalPoints())),
      };
    }

    const rewardKey = `pointsAwarded_${achievementId}`;

    const alreadyAwarded =
      await _accountSession2.run(async () => (AsyncStorage.getItem(rewardKey)));

    const currentTotal = await _accountSession2.run(async () => (getTotalPoints()));

    if (alreadyAwarded === "true") {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: currentTotal,
      };
    }

    const newTotal = currentTotal + Number(points);

    await _accountSession2.run(async () => (AsyncStorage.setItem(
      TOTAL_POINTS_KEY,
      String(newTotal)
    )));

    await _accountSession2.run(async () => (AsyncStorage.setItem(
      rewardKey,
      "true"
    )));

    return {
      awarded: true,
      pointsAdded: Number(points),
      totalPoints: newTotal,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Award points error:", error);

    return {
      awarded: false,
      pointsAdded: 0,
      totalPoints: await _accountSession2.run(async () => (getTotalPoints())),
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}