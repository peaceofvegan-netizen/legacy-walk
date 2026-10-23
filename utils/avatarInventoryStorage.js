import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";

import { AVATARS, DEFAULT_AVATAR } from "../data/avatarCatalog";

const EQUIPPED_AVATAR_KEY = "selectedAvatarId";
const OWNED_AVATARS_KEY = "ownedAvatarIds";

export async function saveEquippedAvatar(avatarId) {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  try {
    await _accountSession.run(async () => (AsyncStorage.setItem(EQUIPPED_AVATAR_KEY, avatarId)));
    return true;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("saveEquippedAvatar error:", error);
    return false;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getEquippedAvatar() {
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();

  try {
    const savedId = await _accountSession2.run(async () => (getEquippedAvatarId()));

    // Your AVATARS is an object, not an array.
    // So we cannot use AVATARS.find().
    return (
      AVATARS?.Black?.male?.middle ||
      DEFAULT_AVATAR
    );
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("getEquippedAvatar error:", error);
    return DEFAULT_AVATAR;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


export async function saveOwnedAvatars(avatarIds) {
  const _accountSession3 = captureAccountSession();
  const AsyncStorage = _accountSession3.storage;

  try {
    _accountSession3.assertCurrent();

  try {
    await _accountSession3.run(async () => (AsyncStorage.setItem(
      OWNED_AVATARS_KEY,
      JSON.stringify(avatarIds)
    )));
    return true;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("saveOwnedAvatars error:", error);
    return false;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getOwnedAvatarIds() {
  const _accountSession4 = captureAccountSession();
  const AsyncStorage = _accountSession4.storage;

  try {
    _accountSession4.assertCurrent();

  try {
    const saved = await _accountSession4.run(async () => (AsyncStorage.getItem(OWNED_AVATARS_KEY)));

    if (!saved) {
      return [DEFAULT_AVATAR.id];
    }

    return JSON.parse(saved);
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("getOwnedAvatarIds error:", error);
    return [DEFAULT_AVATAR.id];
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addOwnedAvatar(avatarId) {
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  try {
    const currentOwned = await _accountSession5.run(async () => (getOwnedAvatarIds()));

    if (currentOwned.includes(avatarId)) {
      return currentOwned;
    }

    const updatedOwned = [...currentOwned, avatarId];

    await _accountSession5.run(async () => (saveOwnedAvatars(updatedOwned)));

    return updatedOwned;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("addOwnedAvatar error:", error);
    return [DEFAULT_AVATAR.id];
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function clearAvatarStorage() {
  const _accountSession6 = captureAccountSession();
  const AsyncStorage = _accountSession6.storage;

  try {
    _accountSession6.assertCurrent();

  try {
    await _accountSession6.run(async () => (AsyncStorage.removeItem(EQUIPPED_AVATAR_KEY)));
    await _accountSession6.run(async () => (AsyncStorage.removeItem(OWNED_AVATARS_KEY)));
    return true;
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log("clearAvatarStorage error:", error);
    return false;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}