import AsyncStorage from "@react-native-async-storage/async-storage";

const WORLD_KEY = "@LEGATHON_WORLD_PROGRESS";

export async function getUnlockedWorld() {
  try {
    const value = await AsyncStorage.getItem(WORLD_KEY);
    return value ? Number(value) : 1;
  } catch (e) {
    return 1;
  }
}

export async function unlockNextWorld(currentWorld) {
  try {
    const nextWorld = currentWorld + 1;

    const unlocked = await getUnlockedWorld();

    if (nextWorld > unlocked) {
      await AsyncStorage.setItem(
        WORLD_KEY,
        nextWorld.toString()
      );
    }
  } catch (e) {
    console.log(e);
  }
}

export async function resetWorldProgress() {
  await AsyncStorage.setItem(WORLD_KEY, "1");
}