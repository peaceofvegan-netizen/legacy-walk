import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const WORLD_KEY = "@LEGATHON_WORLD_PROGRESS";

export async function getUnlockedWorld() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    const value = await _accountSession.run(async () => (AsyncStorage.getItem(WORLD_KEY)));
    return value ? Number(value) : 1;
  } catch (e) {
    if (isAccountSessionEnded(e)) throw e;

    return 1;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function unlockNextWorld(currentWorld) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  try {
    const nextWorld = currentWorld + 1;

    const unlocked = await _accountSession2.run(async () => (getUnlockedWorld()));

    if (nextWorld > unlocked) {
      await _accountSession2.run(async () => (AsyncStorage.setItem(
        WORLD_KEY,
        nextWorld.toString()
      )));
    }
  } catch (e) {
    if (isAccountSessionEnded(e)) throw e;

    console.log(e);
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function resetWorldProgress() {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  await _accountSession3.run(async () => (AsyncStorage.setItem(WORLD_KEY, "1")));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}