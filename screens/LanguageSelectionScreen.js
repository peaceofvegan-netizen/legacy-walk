import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  LANGUAGES,
} from "../i18n/languages";

import {
  saveLanguage,
  translate,
} from "../i18n/i18n";

export default function LanguageSelectionScreen({
  language = "en",
  setLanguage,
  goBack,
}) {
  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  async function handleContinue() {
    try {
      await saveLanguage(
        selectedLanguage
      );

      if (setLanguage) {
        setLanguage(
          selectedLanguage
        );
      }

      if (goBack) {
        goBack();
      }
    } catch (error) {
      console.log(
        "Language save error:",
        error
      );
    }
  }

  function handleSelectLanguage(
    languageCode
  ) {
    setSelectedLanguage(
      languageCode
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.small}>
        LEGATHON WALK GLOBAL
      </Text>

      <Text style={styles.title}>
        {translate(
          selectedLanguage,
          "chooseYourLanguage"
        )}
      </Text>

      <Text style={styles.subtitle}>
        {translate(
          selectedLanguage,
          "selectLanguage"
        )}
      </Text>

      <View style={styles.grid}>
        {LANGUAGES.map(
          (item) => {
            const selected =
              selectedLanguage ===
              item.code;

            return (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.languageCard,
                  selected &&
                    styles.languageCardActive,
                ]}
                onPress={() =>
                  handleSelectLanguage(
                    item.code
                  )
                }
                activeOpacity={0.8}
              >
                <Text
                  style={styles.flag}
                >
                  {item.flag}
                </Text>

                <Text
                  style={[
                    styles.languageName,
                    selected &&
                      styles.languageNameActive,
                  ]}
                >
                  {item.name}
                </Text>

                {selected && (
                  <Text
                    style={
                      styles.selectedText
                    }
                  >
                    ✓{" "}
                    {translate(
                      selectedLanguage,
                      "selected"
                    )}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        activeOpacity={0.85}
      >
        <Text
          style={styles.buttonText}
        >
          {translate(
            selectedLanguage,
            "applyLanguage"
          )}
        </Text>
      </TouchableOpacity>

      <View
        style={styles.bottomSpace}
      />
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#05070C",
    },

    content: {
      padding: 18,
      paddingTop: 30,
      paddingBottom: 130,
    },

    small: {
      color: "#A6FFD2",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2,
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
      justifyContent:
        "space-between",
    },

    languageCard: {
      width: "48%",
      minHeight: 145,

      backgroundColor:
        "#10151F",

      borderRadius: 22,

      padding: 18,

      marginBottom: 14,

      borderWidth: 1,

      borderColor:
        "#1F2A3D",

      alignItems: "center",
      justifyContent: "center",
    },

    languageCardActive: {
      borderColor:
        "#A6FFD2",

      borderWidth: 2,

      backgroundColor:
        "#0E1A13",
    },

    flag: {
      fontSize: 34,
      marginBottom: 10,
    },

    languageName: {
      color: "#DDE6F3",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },

    languageNameActive: {
      color: "#A6FFD2",
    },

    selectedText: {
      color: "#A6FFD2",
      fontSize: 11,
      fontWeight: "900",
      marginTop: 8,
    },

    button: {
      backgroundColor:
        "#A6FFD2",

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

    bottomSpace: {
      height: 120,
    },
  });