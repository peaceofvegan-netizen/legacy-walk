import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadAvatarInventory, saveAvatarInventory } from "./avatarInventoryStorage";

const LOADOUTS_KEY = "LEGACY_WALK_AVATAR_LOADOUTS";

export async function loadAvatarLoadouts() {
  const saved = await AsyncStorage.getItem(LOADOUTS_KEY);

  return saved
    ? JSON.parse(saved)
    : {
        activeLoadoutId: "default",
        loadouts: [
          {
            id: "default",
            name: "Beginner Fit",
            equipped: {
              tracksuits: "starter_tracksuit",
            },
          },
        ],
      };
}

export async function saveAvatarLoadouts(data) {
  await AsyncStorage.setItem(LOADOUTS_KEY, JSON.stringify(data));
}

export async function saveCurrentOutfitAsLoadout(name = "New Outfit") {
  const inventory = await loadAvatarInventory();
  const current = await loadAvatarLoadouts();

  const newLoadout = {
    id: Date.now().toString(),
    name,
    equipped: inventory.equipped || {},
  };

  const updated = {
    ...current,
    loadouts: [newLoadout, ...current.loadouts],
  };

  await saveAvatarLoadouts(updated);

  return updated;
}

export async function applyAvatarLoadout(loadout) {
  const inventory = await loadAvatarInventory();

  const updatedInventory = {
    ...inventory,
    equipped: loadout.equipped || {},
  };

  await saveAvatarInventory(updatedInventory);

  const current = await loadAvatarLoadouts();

  const updatedLoadouts = {
    ...current,
    activeLoadoutId: loadout.id,
  };

  await saveAvatarLoadouts(updatedLoadouts);

  return {
    inventory: updatedInventory,
    loadouts: updatedLoadouts,
  };
}