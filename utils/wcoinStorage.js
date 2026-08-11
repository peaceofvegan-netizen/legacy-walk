import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "LEGACY_WALK_WCOINS";

const safeCoinAmount = value => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number)
  );
};

export async function getWCoins() {
  try {
    const saved =
      await AsyncStorage.getItem(KEY);

    return safeCoinAmount(saved);
  } catch (error) {
    console.log(
      "getWCoins error:",
      error
    );

    return 0;
  }
}

// Alias for screens using this name.
export async function getWCoinBalance() {
  return getWCoins();
}

export async function addWCoins(amount) {
  try {
    const coinsToAdd =
      safeCoinAmount(amount);

    const current =
      await getWCoins();

    const updated =
      current + coinsToAdd;

    await AsyncStorage.setItem(
      KEY,
      String(updated)
    );

    console.log(
      "WCOIN DEPOSIT:",
      {
        previousBalance: current,
        added: coinsToAdd,
        newBalance: updated,
      }
    );

    return {
      success: true,
      previousBalance: current,
      added: coinsToAdd,
      balance: updated,
    };
  } catch (error) {
    console.log(
      "addWCoins error:",
      error
    );

    throw error;
  }
}

export async function subtractWCoins(
  amount
) {
  try {
    const coinsToSubtract =
      safeCoinAmount(amount);

    const current =
      await getWCoins();

    if (
      coinsToSubtract >
      current
    ) {
      return {
        success: false,
        reason:
          "insufficient-balance",
        balance: current,
      };
    }

    const updated =
      current -
      coinsToSubtract;

    await AsyncStorage.setItem(
      KEY,
      String(updated)
    );

    return {
      success: true,
      deducted: coinsToSubtract,
      balance: updated,
    };
  } catch (error) {
    console.log(
      "subtractWCoins error:",
      error
    );

    throw error;
  }
}

export async function setWCoins(
  amount
) {
  try {
    const updated =
      safeCoinAmount(amount);

    await AsyncStorage.setItem(
      KEY,
      String(updated)
    );

    return updated;
  } catch (error) {
    console.log(
      "setWCoins error:",
      error
    );

    throw error;
  }
}