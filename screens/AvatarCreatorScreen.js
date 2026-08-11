import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_AVATAR_PROFILE,
  buildAvatarKey,
  getAvatarDescription,
} from "../utils/avatarLive";

const OPTIONS = {
  gender: ["male", "female"],
  age: ["young", "middle", "senior"],
  skinTone: ["light", "medium", "dark"],
  hairStyle: ["short", "curly", "braids", "bald"],
  hairColor: ["black", "brown", "blonde", "gray"],
  outfit: ["defaultBlack", "blue", "red", "green", "yellow", "blackGold"],
};

export default function AvatarCreatorScreen({ goBack }) {
  const [profile, setProfile] = React.useState(DEFAULT_AVATAR_PROFILE);

  React.useEffect(() => {
    loadAvatar();
  }, []);

  async function loadAvatar() {
    const saved = await AsyncStorage.getItem("avatarProfile");

    if (saved) {
      setProfile({
        ...DEFAULT_AVATAR_PROFILE,
        ...JSON.parse(saved),
      });
    }
  }

  function updateProfile(key, value) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveAvatar() {
    await AsyncStorage.setItem(
      "avatarProfile",
      JSON.stringify(profile)
    );

    await AsyncStorage.setItem(
      "avatarKey",
      buildAvatarKey(profile)
    );

    Alert.alert(
      "Avatar Saved",
      "Your realistic avatar profile has been updated."
    );

    if (goBack) goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {goBack && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.kicker}>LEGACY WALK</Text>
      <Text style={styles.title}>Create Avatar</Text>
      <Text style={styles.subtitle}>Build your realistic Legacy identity.</Text>

      <View style={styles.previewCard}>
        <Text style={styles.previewEmoji}>🧍🏾‍♂️</Text>
        <Text style={styles.previewTitle}>Avatar Preview</Text>
        <Text style={styles.previewText}>
          {getAvatarDescription(profile)}
        </Text>
      </View>

      <OptionGroup
        title="Gender"
        options={OPTIONS.gender}
        value={profile.gender}
        onChange={(value) => updateProfile("gender", value)}
      />

      <OptionGroup
        title="Age"
        options={OPTIONS.age}
        value={profile.age}
        onChange={(value) => updateProfile("age", value)}
      />

      <OptionGroup
        title="Skin Tone"
        options={OPTIONS.skinTone}
        value={profile.skinTone}
        onChange={(value) => updateProfile("skinTone", value)}
      />

      <OptionGroup
        title="Hair Style"
        options={OPTIONS.hairStyle}
        value={profile.hairStyle}
        onChange={(value) => updateProfile("hairStyle", value)}
      />

      <OptionGroup
        title="Hair Color"
        options={OPTIONS.hairColor}
        value={profile.hairColor}
        onChange={(value) => updateProfile("hairColor", value)}
      />

      <OptionGroup
        title="Outfit"
        options={OPTIONS.outfit}
        value={profile.outfit}
        onChange={(value) => updateProfile("outfit", value)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveAvatar}>
        <Text style={styles.saveButtonText}>Save Avatar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function OptionGroup({ title, options, value, onChange }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>

      <View style={styles.optionWrap}>
        {options.map((item) => {
          const active = value === item;

          return (
            <TouchableOpacity
              key={item}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => onChange(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  active && styles.optionTextActive,
                ]}
              >
                {formatLabel(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function formatLabel(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },
  content: {
    padding: 24,
    paddingBottom: 160,
  },

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  backButtonText: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 6,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    marginTop: 8,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 24,
  },

  previewCard: {
    backgroundColor: "#0E1A2F",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    padding: 30,
    marginBottom: 28,
  },
  previewEmoji: {
    fontSize: 86,
  },
  previewTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 12,
  },
  previewText: {
    color: "#FACC15",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
  },

  group: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1E3A8A",
    padding: 20,
    marginBottom: 18,
  },
  groupTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 14,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  optionActive: {
    backgroundColor: "#FACC15",
    borderColor: "#FACC15",
  },
  optionText: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "900",
  },
  optionTextActive: {
    color: "#05070C",
  },

  saveButton: {
    backgroundColor: "#FACC15",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 14,
  },
  saveButtonText: {
    color: "#05070C",
    fontSize: 22,
    fontWeight: "900",
  },
});