import { STORE_ITEMS } from "./avatarStoreData";
import {
  loadAvatarInventory,
  saveAvatarInventory,
} from "./avatarInventoryStorage";

export const MYSTERY_BOXES = [
  {
    id: "starter_box",
    name: "Starter Gear Box",
    price: 750,
    currency: "coins",
    rarityBoost: "Common",
  },
  {
    id: "premium_box",
    name: "Premium Gear Box",
    price: 2500,
    currency: "coins",
    rarityBoost: "Rare",
  },
  {
    id: "legendary_box",
    name: "Legendary Gear Box",
    price: 5000,
    currency: "wellness",
    rarityBoost: "Legendary",
  },
];

export async function openMysteryBox(box) {
  const inventory = await loadAvatarInventory();

  const balance =
    box.currency === "coins"
      ? inventory.coins
      : inventory.wellnessPoints;

  if (balance < box.price) {
    return {
      success: false,
      message: "Not enough points",
    };
  }

  const unownedItems = STORE_ITEMS.filter(
    (item) => !inventory.ownedItems.includes(item.id)
  );

  if (unownedItems.length === 0) {
    return {
      success: false,
      message: "You already own all gear",
    };
  }

  const boosted =
    unownedItems.filter((item) => item.rarity === box.rarityBoost);

  const rewardPool = boosted.length > 0 ? boosted : unownedItems;

  const reward =
    rewardPool[Math.floor(Math.random() * rewardPool.length)];

  const updated = {
    ...inventory,
    ownedItems: [reward.id, ...inventory.ownedItems],
    coins:
      box.currency === "coins"
        ? inventory.coins - box.price
        : inventory.coins,
    wellnessPoints:
      box.currency === "wellness"
        ? inventory.wellnessPoints - box.price
        : inventory.wellnessPoints,
  };

  await saveAvatarInventory(updated);

  return {
    success: true,
    reward,
    inventory: updated,
  };
}