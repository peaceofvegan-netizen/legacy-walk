import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { avatarOptions } from "../data/avatarOptions";

const getDefaultAvatar = () => {
  return avatarOptions[0];
};
const TRACKSUITS = [
  {
    id: "blue",
    name: "Explorer Blue",
    unlockSteps: 150000,
    image: require("../assets/tracksuits/blue_tracksuit.png"),
  },
  {
    id: "red",
    name: "Trailblazer Red",
    unlockSteps: 250000,
    image: require("../assets/tracksuits/red_tracksuit.png"),
  },
  {
    id: "green",
    name: "Pathfinder Green",
    unlockSteps: 350000,
    image: require("../assets/tracksuits/green_tracksuit.png"),
  },
  {
    id: "yellow",
    name: "Legend Yellow",
    unlockSteps: 1000000,
    image: require("../assets/tracksuits/yellow_tracksuit.png"),
  },
  {
    id: "blackGold",
    name: "Elite Black Gold",
    unlockSteps: 3000000,
    image: require("../assets/tracksuits/elite_tracksuit.png"),
  },
];

function getRank(steps) {
  if (steps >= 3000000) return "Elite Legend";
  if (steps >= 1000000) return "Legend";
  if (steps >= 350000) return "Pathfinder";
  if (steps >= 250000) return "Trailblazer";
  if (steps >= 150000) return "Explorer";
  return "Rookie";
}

function getNextSuit(steps) {
  return TRACKSUITS.find((suit) => steps < suit.unlockSteps);
}

export default function AvatarCenterScreen({
  goBack,
  goToAvatarPicker,
  goToRewards,
}) {
  const [avatarName, setAvatarName] = React.useState("Legacy Walker");
  const [selectedAvatar, setSelectedAvatar] = React.useState(avatarOptions[0]);
  const [lifetimeSteps, setLifetimeSteps] = React.useState(0);
  const [equippedSuit, setEquippedSuit] = React.useState("blue");

  React.useEffect(() => {
    loadAvatarCenter();

    const timer = setInterval(loadAvatarCenter, 3000);
    return () => clearInterval(timer);
  }, []);

  async function loadAvatarCenter() {
    try {
      const savedSteps = await AsyncStorage.getItem("lifetimeSteps");
      const savedProfile = await AsyncStorage.getItem("avatarProfile");
      const savedSuit = await AsyncStorage.getItem("equippedTracksuit");

      setLifetimeSteps(Number(savedSteps || 0));

      if (savedSuit) {
        setEquippedSuit(savedSuit);
      }

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        setAvatarName(profile.name || "Legacy Walker");

      const foundAvatar = avatarOptions.find(
  (avatar) => avatar.id === profile.avatarId
);

if (foundAvatar) {
  setSelectedAvatar(foundAvatar);
}
}
} catch (error) {
  console.log("Avatar Center Load Error:", error);
}
}

async function equipSuit(suit) {
  if (lifetimeSteps < suit.unlockSteps) {
    Alert.alert(
      "Suit Locked",
      `${suit.name} unlocks at ${suit.unlockSteps.toLocaleString()} lifetime steps.`
    );
    return;
  }

  try {
    await AsyncStorage.setItem(
      "equippedTracksuit",
      suit.id
    );

    setEquippedSuit(suit.id);

    Alert.alert(
      "Suit Equipped",
      `${suit.name} is now your active outfit.`
    );
  } catch (error) {
    console.log("Equip suit error:", error);
  }
}

function editAvatarName() {
  if (Platform.OS === "ios") {
    Alert.prompt(
      "Edit Avatar Name",
      "Enter avatar name",
      async (text) => {
        if (!text || text.trim() === "") return;

        try {
          const savedProfile =
            await AsyncStorage.getItem("avatarProfile");

          const profile = savedProfile
            ? JSON.parse(savedProfile)
            : {};

          const updatedProfile = {
            ...profile,
            name: text.trim(),
            avatarId:
              profile.avatarId ||
              selectedAvatar?.id ||
              avatarOptions[0].id,
          };

          await AsyncStorage.setItem(
            "avatarProfile",
            JSON.stringify(updatedProfile)
          );

          setAvatarName(text.trim());
        } catch (error) {
          console.log("Edit name error:", error);
        }
      }
    );

    return;
  }

  Alert.alert(
    "Edit Name",
    "Name editing works best on iPhone for now."
  );
}

const rank = getRank(lifetimeSteps);

const unlockedSuits = TRACKSUITS.filter(
  (suit) => lifetimeSteps >= suit.unlockSteps
);

const nextSuit = getNextSuit(lifetimeSteps);

const currentSuit =
  TRACKSUITS.find(
    (suit) => suit.id === equippedSuit
  ) || TRACKSUITS[0];

const nextProgress = nextSuit
  ? Math.min(
      (lifetimeSteps / nextSuit.unlockSteps) * 100,
      100
    )
  : 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        {goBack && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>👑 PREMIUM</Text>
        </View>
      </View>

      <Text style={styles.kicker}>LEGATHON WALK</Text>
      <Text style={styles.title}>Avatar Center</Text>
      <Text style={styles.subtitle}>Your Legacy. Your Journey. Your Avatar.</Text>

      <View style={styles.heroCard}>
        <View style={styles.avatarStage}>
          <View style={styles.glowCircle} />

          <Image source={selectedAvatar.image} style={styles.avatarImage} />

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{rank}</Text>
          </View>
        </View>

        <View style={styles.heroInfo}>
          <Text style={styles.sectionKicker}>YOUR AVATAR</Text>
          <Text style={styles.avatarName}>{avatarName}</Text>
          <Text style={styles.avatarLabel}>{selectedAvatar.label}</Text>

          

      <View style={styles.nextUnlockCard}>
        <Text style={styles.nextUnlockTitle}>👑 Next Legathon Unlock</Text>

        <Text style={styles.nextUnlockName}>
          {nextSuit ? nextSuit.name : "All Suits Unlocked"}
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${nextProgress}%` }]} />
        </View>

       <Text style={styles.nextUnlockSteps}>
  {nextSuit
    ? `${Math.max(
        nextSuit.unlockSteps - lifetimeSteps,
        0
      ).toLocaleString()} steps remaining`
    : "You unlocked every legathon suit."}
</Text>
</View>
</View>

      <View style={styles.actionGrid}>
        <ActionButton
          icon="🙂"
          title="Change Avatar"
          subtitle="Pick your full body avatar"
          onPress={goToAvatarPicker}
        />

        <ActionButton
          icon="✏️"
          title="Edit Name"
          subtitle="Update display name"
          onPress={editAvatarName}
        />

        <ActionButton
          icon="🎁"
          title="Rewards"
          subtitle="View unlock rewards"
          onPress={goToRewards}
        />

        <ActionButton
          icon="⭐"
          title="Milestones"
          subtitle="Track avatar progress"
          onPress={() => Alert.alert("Coming Soon", "Avatar milestones coming soon.")}
        />
      </View>

      <View style={styles.showcaseHeader}>
        <Text style={styles.showcaseTitle}>Your Avatar Showcase</Text>
        <Text style={styles.showcaseLink}>Collection</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarStrip}
      >
        {avatarOptions.map((avatar) => {
          const active = avatar.id === selectedAvatar.id;

          return (
            <TouchableOpacity
              key={avatar.id}
              style={[styles.miniAvatarCard, active && styles.activeMiniCard]}
              onPress={async () => {
                const updatedProfile = {
                  name: avatarName,
                  avatarId: avatar.id,
                };

                await AsyncStorage.setItem(
                  "avatarProfile",
                  JSON.stringify(updatedProfile)
                );

                setSelectedAvatar(avatar);
              }}
            >
              <Image source={avatar.image} style={styles.miniAvatarImage} />

              <Text style={styles.miniAvatarLabel}>{avatar.label}</Text>

              {active && <Text style={styles.activeText}>ACTIVE</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.wardrobeTitle}>Wardrobe Unlocks</Text>

      {TRACKSUITS.map((suit) => {
        const unlocked = lifetimeSteps >= suit.unlockSteps;
        const equipped = equippedSuit === suit.id;
        const remaining = Math.max(suit.unlockSteps - lifetimeSteps, 0);
        const progress = Math.min((lifetimeSteps / suit.unlockSteps) * 100, 100);

        return (
          <View key={suit.id} style={styles.suitCard}>
            <Image source={suit.image} style={styles.suitImage} />

            <View style={styles.suitInfo}>
              <Text style={styles.suitName}>{suit.name}</Text>

              <Text style={styles.suitUnlock}>
                Unlock at {suit.unlockSteps.toLocaleString()} steps
              </Text>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <Text style={unlocked ? styles.unlockedText : styles.lockedText}>
                {unlocked
                  ? equipped
                    ? "✅ Wearing"
                    : "✅ Unlocked"
                  : `🔒 ${remaining.toLocaleString()} steps remaining`}
              </Text>

              <TouchableOpacity
                style={[
                  styles.equipButton,
                  !unlocked && styles.lockedButton,
                  equipped && styles.equippedButton,
                ]}
                onPress={() => equipSuit(suit)}
              >
                <Text style={styles.equipButtonText}>
                  {equipped ? "Wearing" : unlocked ? "Wear Suit" : "Locked"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
</View>
</ScrollView>
  );
}

function Stat({ emoji, value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },
 content: {
  paddingHorizontal: 34,
  paddingTop: 20,
  paddingBottom: 150,
},

  topRow: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "900",
  },
  premiumBadge: {
    borderWidth: 1.5,
    borderColor: "#7C3AED",
    backgroundColor: "#180B2E",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  premiumText: {
    color: "#FACC15",
    fontSize: 14,
    fontWeight: "900",
  },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 6,
    marginTop: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 54,
    fontWeight: "900",
    marginTop: 8,
    lineHeight: 62,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "#0E1A2F",
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#D4AF37",
    padding: 24,
    overflow: "visible",
  },
 avatarStage: {
  height: 470,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#081221",
  borderRadius: 28,
  overflow: "visible",
  paddingBottom: 60,
},
  glowCircle: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: "#7C3AED",
    backgroundColor: "rgba(124,58,237,0.22)",
  },
  avatarImage: {
    width: "100%",
    height: 390,
    resizeMode: "contain",
  },
 
  levelBadgeText: {
    color: "#FACC15",
    fontSize: 15,
    fontWeight: "900",
  },

  heroInfo: {
    paddingTop: 22,
  },
  sectionKicker: {
    color: "#FACC15",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
  },
  avatarName: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 6,
  },
  avatarLabel: {
    color: "#CBD5E1",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  quote: {
    color: "#E5E7EB",
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 24,
    marginTop: 16,
  },
  statNumber: {
  fontSize: 34,
  fontWeight: "900",
  color: "#FFFFFF",
  textAlign: "center",
  flexShrink: 1,
},
statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 8,
},
statBox: {
  flex: 1,
  minWidth: 0,
  alignItems: "center",
},

 statCard: {
  width: "31%",
  height: 140,
  backgroundColor: "#021533",
  borderRadius: 24,
  borderWidth: 1,
  borderColor: "#123D7A",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 8,
},

  statEmoji: {
    fontSize: 24,
  },

statLabel: {
  fontSize: 16,
  fontWeight: "700",
  color: "#C8D1E8",
  textAlign: "center",
  marginTop: 8,
},

  nextUnlockCard: {
    backgroundColor: "#111827",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    padding: 20,
    marginTop: 22,
  },
  nextUnlockTitle: {
    color: "#FACC15",
    fontSize: 18,
    fontWeight: "900",
  },
  nextUnlockName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  nextUnlockSteps: {
    color: "#A7F3D0",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 12,
  },
  progressTrack: {
    height: 12,
    backgroundColor: "#1E293B",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FACC15",
    borderRadius: 999,
  },

  actionGrid: {
    marginTop: 22,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#0E1A2F",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#263A5E",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
legendBadge: {
  position: "absolute",
  bottom: -55,
  alignSelf: "center",
  backgroundColor: "#1B0A3D",
  borderWidth: 2,
  borderColor: "#FACC15",
  borderRadius: 30,
  paddingHorizontal: 30,
  paddingVertical: 12,
  zIndex: 100,
},

  actionSubtitle: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },
  actionArrow: {
    color: "#CBD5E1",
    fontSize: 36,
    fontWeight: "300",
  },

showcaseHeader: {
  marginTop: 26,
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
},

showcaseTitle: {
  color: "#FFFFFF",
  fontSize: 38,
  fontWeight: "900",
},

showcaseLink: {
  color: "#C084FC",
  fontSize: 22,
  fontWeight: "900",
}, 
  avatarStrip: {
    paddingVertical: 16,
    gap: 12,
  },
  miniAvatarCard: {
    width: 130,
    backgroundColor: "#0E1A2F",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#263A5E",
    padding: 10,
    alignItems: "center",
  },
  activeMiniCard: {
    borderColor: "#D4AF37",
    borderWidth: 2,
  },
  miniAvatarImage: {
    width: 100,
    height: 140,
    resizeMode: "contain",
  },
  miniAvatarLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },
  activeText: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },

  wardrobeTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 22,
    marginBottom: 16,
  },
  suitCard: {
    backgroundColor: "#0E1A2F",
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#263A5E",
    marginBottom: 24,
    overflow: "hidden",
  },
  suitImage: {
    width: "100%",
    height: 360,
    resizeMode: "contain",
    backgroundColor: "#05070C",
  },
  suitInfo: {
    padding: 20,
  },
  suitName: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  suitUnlock: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 6,
  },
  unlockedText: {
    color: "#A7F3D0",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  lockedText: {
    color: "#FACC15",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  equipButton: {
    backgroundColor: "#FACC15",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  lockedButton: {
    backgroundColor: "#334155",
  },
  equippedButton: {
    backgroundColor: "#16A34A",
  },
  equipButtonText: {
    color: "#05070C",
    fontSize: 18,
    fontWeight: "900",
  },
});