import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const TOTAL_POINTS_KEY = "totalPoints";

// Get lifetime points
export async function getTotalPoints() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const savedPoints = await _accountSession.run(async () => (AsyncStorage.getItem(TOTAL_POINTS_KEY)));
    return Number(savedPoints || 0);
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("GET TOTAL POINTS ERROR:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

// Award points one time only
export async function awardPointsOnce(achievementId, points) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    if (!achievementId || Number(points) <= 0) {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await _accountSession2.run(async () => (getTotalPoints())),
      };
    }

    const awardKey = `pointsAwarded_${achievementId}`;

    const alreadyAwarded = await _accountSession2.run(async () => (AsyncStorage.getItem(awardKey)));

    if (alreadyAwarded === "true") {
      return {
        awarded: false,
        pointsAdded: 0,
        totalPoints: await _accountSession2.run(async () => (getTotalPoints())),
      };
    }

    const currentPoints = await _accountSession2.run(async () => (getTotalPoints()));
    const newTotal = currentPoints + Number(points);

    await _accountSession2.run(async () => (AsyncStorage.multiSet([
      [TOTAL_POINTS_KEY, String(newTotal)],
      [awardKey, "true"],
    ])));

    return {
      awarded: true,
      pointsAdded: Number(points),
      totalPoints: newTotal,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("AWARD POINTS ERROR:", error);

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