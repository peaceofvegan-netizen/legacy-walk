import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "./translation";

const LANGUAGE_KEY = "LEGACY_WALK_LANGUAGE";

export async function saveLanguage(languageCode) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.log("Save language error:", error);
  }
}

export async function loadLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    return saved || "en";
  } catch (error) {
    console.log("Load language error:", error);
    return "en";
  }
}

export function translate(languageCode = "en", key) {
  return (
    translations?.[languageCode]?.[key] ||
    translations?.en?.[key] ||
    key
  );
}