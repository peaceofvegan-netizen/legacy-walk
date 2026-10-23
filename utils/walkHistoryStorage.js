import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const WALK_HISTORY_KEY = "LEGACY_WALK_HISTORY";

export async function saveWalkHistory(history) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    await _accountSession.run(async () => (AsyncStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(history))));
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Save walk history error:", error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loadWalkHistory() {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    const saved = await _accountSession2.run(async () => (AsyncStorage.getItem(WALK_HISTORY_KEY)));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Load walk history error:", error);
    return [];
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function clearWalkHistory() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  try {
    await _accountSession3.run(async () => (AsyncStorage.removeItem(WALK_HISTORY_KEY)));
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Clear walk history error:", error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}