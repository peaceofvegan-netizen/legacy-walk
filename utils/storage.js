import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const PROGRESS_KEY = "LEGACY_WALK_PROGRESS";

export async function saveProgress(progress) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const json = JSON.stringify(progress);
    await _accountSession.run(async () => (AsyncStorage.setItem(PROGRESS_KEY, json)));
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Save progress error:", error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function loadProgress() {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    const json = await _accountSession2.run(async () => (AsyncStorage.getItem(PROGRESS_KEY)));
    return json ? JSON.parse(json) : null;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Load progress error:", error);
    return null;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function clearProgress() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  try {
    await _accountSession3.run(async () => (AsyncStorage.removeItem(PROGRESS_KEY)));
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("Clear progress error:", error);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}