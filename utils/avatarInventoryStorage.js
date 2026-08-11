import AsyncStorage from "@react-native-async-storage/async-storage";
import { AVATARS, DEFAULT_AVATAR } from "../data/avatarCatalog";

const EQUIPPED_AVATAR_KEY = "selectedAvatarId";
const OWNED_AVATARS_KEY = "ownedAvatarIds";

export async function saveEquippedAvatar(avatarId) {
  try {
    await AsyncStorage.setItem(EQUIPPED_AVATAR_KEY, avatarId);
    return true;
  } catch (error) {
    console.log("saveEquippedAvatar error:", error);
    return false;
  }
}

export async function getEquippedAvatar() {
  try {
    const savedId = await getEquippedAvatarId();

    // Your AVATARS is an object, not an array.
    // So we cannot use AVATARS.find().
    return (
      AVATARS?.Black?.male?.middle ||
      DEFAULT_AVATAR
    );
  } catch (error) {
    console.log("getEquippedAvatar error:", error);
    return DEFAULT_AVATAR;
  }
}


export async function saveOwnedAvatars(avatarIds) {
  try {
    await AsyncStorage.setItem(
      OWNED_AVATARS_KEY,
      JSON.stringify(avatarIds)
    );
    return true;
  } catch (error) {
    console.log("saveOwnedAvatars error:", error);
    return false;
  }
}

export async function getOwnedAvatarIds() {
  try {
    const saved = await AsyncStorage.getItem(OWNED_AVATARS_KEY);

    if (!saved) {
      return [DEFAULT_AVATAR.id];
    }

    return JSON.parse(saved);
  } catch (error) {
    console.log("getOwnedAvatarIds error:", error);
    return [DEFAULT_AVATAR.id];
  }
}

export async function addOwnedAvatar(avatarId) {
  try {
    const currentOwned = await getOwnedAvatarIds();

    if (currentOwned.includes(avatarId)) {
      return currentOwned;
    }

    const updatedOwned = [...currentOwned, avatarId];

    await saveOwnedAvatars(updatedOwned);

    return updatedOwned;
  } catch (error) {
    console.log("addOwnedAvatar error:", error);
    return [DEFAULT_AVATAR.id];
  }
}

export async function clearAvatarStorage() {
  try {
    await AsyncStorage.removeItem(EQUIPPED_AVATAR_KEY);
    await AsyncStorage.removeItem(OWNED_AVATARS_KEY);
    return true;
  } catch (error) {
    console.log("clearAvatarStorage error:", error);
    return false;
  }
}