import AsyncStorage from "@react-native-async-storage/async-storage";

const LEGACY_POINTS_KEY = "legathonPoints";

export const getLegacyPoints = async () => {
  try {
    const stored = await AsyncStorage.getItem(LEGACY_POINTS_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.log("Error loading Legathon Points:", error);
    return 0;
  }
};

export const addLegacyPoints = async (points) => {
  try {
    const current = await getLegacyPoints();
    const total = current + points;

    await AsyncStorage.setItem(
      LEGACY_POINTS_KEY,
      total.toString()
    );

    return total;
  } catch (error) {
    console.log("Error saving Legathon Points:", error);
    return 0;
  }
};

export const resetLegacyPoints = async () => {
  try {
    await AsyncStorage.setItem(LEGACY_POINTS_KEY, "0");
  } catch (error) {
    console.log("Error resetting Legathon Points:", error);
  }
};