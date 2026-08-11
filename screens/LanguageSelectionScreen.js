import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { LANGUAGES } from "../i18n/languages";
import { saveLanguage } from "../i18n/i18n";
export default function LanguageSelectionScreen({
  onFinish,
  currentLanguage = "en",
  setAppLanguage,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  async function handleContinue() {
  await saveLanguage(selectedLanguage);

  if (setAppLanguage) {
    setAppLanguage(selectedLanguage);
  }

  if (onFinish) {
    onFinish(selectedLanguage);
  }
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.small}>LEGACY WALK GLOBAL</Text>

      <Text style={styles.title}>Choose Your Language</Text>

      <Text style={styles.subtitle}>
        Select the language you want to use inside Legacy Walk.
      </Text>

      <View style={styles.grid}>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageCard,
              selectedLanguage === language.code && styles.languageCardActive,
            ]}
            onPress={() => setSelectedLanguage(language.code)}
          >
            <Text style={styles.flag}>{language.flag}</Text>

            <Text
              style={[
                styles.languageName,
                selectedLanguage === language.code &&
                  styles.languageNameActive,
              ]}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    padding: 18,
    paddingBottom: 130,
  },

  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },

  subtitle: {
    color: "#A8B3C2",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
    marginBottom: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  languageCard: {
    width: "48%",
    backgroundColor: "#10151F",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1F2A3D",
    alignItems: "center",
  },

  languageCardActive: {
    borderColor: "#A6FFD2",
    backgroundColor: "#0E1A13",
  },

  flag: {
    fontSize: 34,
    marginBottom: 10,
  },

  languageName: {
    color: "#DDE6F3",
    fontWeight: "900",
    textAlign: "center",
  },

  languageNameActive: {
    color: "#A6FFD2",
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },
});