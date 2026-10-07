import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  translations,
} from "./translation";

// ============================================================
// LANGUAGE STORAGE
// ============================================================

// Current Legathon Walk storage key
const LANGUAGE_KEY =
  "LEGATHON_WALK_LANGUAGE";

// Old key kept only so existing users
// do not lose their saved language.
const OLD_LANGUAGE_KEY =
  "LEGACY_WALK_LANGUAGE";

// ============================================================
// NORMALIZE LANGUAGE
// ============================================================

function normalizeLanguage(
  languageCode
) {
  const code = String(
    languageCode || "en"
  ).trim();

  // Only use the language if translations exist.
  if (translations?.[code]) {
    return code;
  }

  return "en";
}

// ============================================================
// SAVE LANGUAGE
// ============================================================

export async function saveLanguage(
  languageCode
) {
  try {
    const language =
      normalizeLanguage(
        languageCode
      );

    await AsyncStorage.setItem(
      LANGUAGE_KEY,
      language
    );

    // Remove old Legacy Walk key
    // after successful save.
    await AsyncStorage.removeItem(
      OLD_LANGUAGE_KEY
    );

    return language;
  } catch (error) {
    console.log(
      "Save language error:",
      error
    );

    return "en";
  }
}

// ============================================================
// LOAD LANGUAGE
// ============================================================

export async function loadLanguage() {
  try {
    // First check the new Legathon key.
    const savedLanguage =
      await AsyncStorage.getItem(
        LANGUAGE_KEY
      );

    if (savedLanguage) {
      return normalizeLanguage(
        savedLanguage
      );
    }

    // --------------------------------------------------------
    // MIGRATION:
    // Check old Legacy Walk key for existing users.
    // --------------------------------------------------------

    const oldLanguage =
      await AsyncStorage.getItem(
        OLD_LANGUAGE_KEY
      );

    if (oldLanguage) {
      const migratedLanguage =
        normalizeLanguage(
          oldLanguage
        );

      await AsyncStorage.setItem(
        LANGUAGE_KEY,
        migratedLanguage
      );

      await AsyncStorage.removeItem(
        OLD_LANGUAGE_KEY
      );

      return migratedLanguage;
    }

    return "en";
  } catch (error) {
    console.log(
      "Load language error:",
      error
    );

    return "en";
  }
}

// ============================================================
// TRANSLATE
// ============================================================

export function translate(
  languageCode = "en",
  key
) {
  const language =
    normalizeLanguage(
      languageCode
    );

  return (
    translations?.[language]?.[key] ||
    translations?.en?.[key] ||
    key
  );
}