import { captureAccountSession, isAccountSessionEnded } from "../../utils/accountStorage";


const LEGACY_POINTS_KEY = "legathonPoints";

export const getLegacyPoints = async () => {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const stored = await _accountSession.run(async () => (AsyncStorage.getItem(LEGACY_POINTS_KEY)));
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Error loading Legathon Points:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
};

export const addLegacyPoints = async (points) => {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    const current = await _accountSession2.run(async () => (getLegacyPoints()));
    const total = current + points;

    await _accountSession2.run(async () => (AsyncStorage.setItem(
      LEGACY_POINTS_KEY,
      total.toString()
    )));

    return total;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Error saving Legathon Points:", error);
    return 0;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
};

export const resetLegacyPoints = async () => {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  try {
    await _accountSession3.run(async () => (AsyncStorage.setItem(LEGACY_POINTS_KEY, "0")));
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Error resetting Legathon Points:", error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
};