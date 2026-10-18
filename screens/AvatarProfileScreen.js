// screens/AvatarProfileScreen.js

import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  avatarOptions,
} from "../data/avatarOptions";

import {
  getCurrentAvatarVisual,
} from "../utils/avatarVisualResolver";

import {
  STEP_STATS_KEY,
} from "../utils/stepTrackingEngine";

import useLegathonPoints from
  "../hooks/useLegathonPoints";

// ============================================================
// HELPERS
// ============================================================

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.floor(number)).toLocaleString()
    : "—";
}

function readCount(value) {
  const number = Number(value ?? 0);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    throw new Error("Invalid saved step total.");
  }

  return Math.floor(number);
}

function imageSource(value) {
  if (
    typeof value === "number" &&
    value > 0
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return { uri: value };
  }

  if (Array.isArray(value)) {
    return value.length ? value : null;
  }

  if (value && typeof value === "object") {
    if (value.uri) {
      return value;
    }

    if (value.image) {
      return imageSource(value.image);
    }
  }

  return null;
}

function sourceKey(source) {
  return JSON.stringify(source);
}

// ============================================================
// AVATAR IMAGE
//
// Never renders an unrelated default avatar.
// Hides the image until its actual source finishes loading.
// ============================================================

function SavedAvatarImage({ source }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <View style={styles.avatarFrame}>
      <Image
        source={source}
        style={[
          styles.avatarImage,
          { opacity: loaded && !failed ? 1 : 0 },
        ]}
        resizeMode="contain"
        accessibilityLabel="Your selected avatar"
        onLoad={() => {
          setLoaded(true);
          setFailed(false);
        }}
        onError={() => {
          setFailed(true);
        }}
      />

      {!loaded && !failed && (
        <View style={styles.imageOverlay}>
          <ActivityIndicator
            size="large"
            color="#F6C84A"
          />
        </View>
      )}

      {failed && (
        <View style={styles.imageOverlay}>
          <Text style={styles.placeholderText}>
            Your avatar image could not be loaded.
          </Text>
        </View>
      )}
    </View>
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function AvatarProfileScreen({
  currentAvatar = null,
  goToAvatarStore,
  goToAvatarCenter,
  goBack,
}) {
  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] =
    useState(true);

  const [avatarError, setAvatarError] =
    useState("");

  const [journeySteps, setJourneySteps] =
    useState(null);

  const [stepError, setStepError] =
    useState("");

  const {
    points: legathonPoints,
    rank: legathonRank,
  } = useLegathonPoints();

  const openAvatarCenter =
    typeof goToAvatarCenter === "function"
      ? goToAvatarCenter
      : goToAvatarStore;

  // ==========================================================
  // LOAD SAVED AVATAR + JOURNEY TOTAL
  // ==========================================================

  useEffect(() => {
    let disposed = false;
    let refreshing = false;
    let refreshAgain = false;

    let foreground =
      AppState.currentState !== "background" &&
      AppState.currentState !== "inactive";

    async function refresh() {
      if (disposed || !foreground) {
        return;
      }

      if (refreshing) {
        refreshAgain = true;
        return;
      }

      refreshing = true;

      try {
        const rows = await AsyncStorage.multiGet([
          "avatarProfile",
          STEP_STATS_KEY,
        ]);

        if (disposed) return;

        const values = Object.fromEntries(rows);

        // ====================================================
        // SAVED AVATAR
        // ====================================================

        try {
          const rawProfile = values.avatarProfile;

          const profile = rawProfile
            ? JSON.parse(rawProfile)
            : null;

          if (
            profile !== null &&
            (
              typeof profile !== "object" ||
              Array.isArray(profile)
            )
          ) {
            throw new Error(
              "Your saved avatar profile could not be read."
            );
          }

          const hasSavedId =
            profile?.avatarId !== undefined &&
            profile?.avatarId !== null &&
            profile?.avatarId !== "";

          let nextAvatar;

          if (hasSavedId) {
            // Saved selection takes priority over a temporary
            // default avatar supplied by the parent screen.
            const selected = avatarOptions.find(
              (item) =>
                String(item.id) ===
                String(profile.avatarId)
            );

            if (!selected) {
              throw new Error(
                "Your saved avatar is unavailable. Open Avatar Center to check your selection."
              );
            }

            const visual =
              await getCurrentAvatarVisual(
                selected.id
              );

            const source = imageSource(
              visual?.image || selected.image
            );

            if (!source) {
              throw new Error(
                "Your selected avatar has no available image."
              );
            }

            nextAvatar = {
              name:
                profile.name ||
                currentAvatar?.name ||
                "Legathon Walker",

              source,
            };
          } else {
            // Use an explicitly supplied avatar only when
            // there is no saved avatar ID.
            const suppliedId =
              currentAvatar?.avatarId ??
              currentAvatar?.id;

            const selected =
              suppliedId !== undefined &&
              suppliedId !== null
                ? avatarOptions.find(
                    (item) =>
                      String(item.id) ===
                      String(suppliedId)
                  )
                : null;

            const visual = selected
              ? await getCurrentAvatarVisual(
                  selected.id
                )
              : null;

            const source = imageSource(
              visual?.image ||
                selected?.image ||
                currentAvatar?.image
            );

            nextAvatar = source
              ? {
                  name:
                    profile?.name ||
                    currentAvatar?.name ||
                    "Legathon Walker",

                  source,
                }
              : null;
          }

          if (!disposed) {
            setAvatar(nextAvatar);
            setAvatarError("");
          }
        } catch (error) {
          if (!disposed) {
            setAvatar(null);
            setAvatarError(
              error?.message ||
                "Your avatar could not be loaded."
            );
          }
        }

        // ====================================================
        // JOURNEY LIFETIME STEPS
        //
        // Marathon steps are intentionally excluded.
        // This screen only reads saved totals.
        // ====================================================

        try {
          const rawStats = values[STEP_STATS_KEY];

          if (!rawStats) {
            throw new Error(
              "Saved journey steps are not available yet."
            );
          }

          const stats = JSON.parse(rawStats);

          if (
            !stats ||
            typeof stats !== "object" ||
            Array.isArray(stats)
          ) {
            throw new Error(
              "Saved journey steps could not be read."
            );
          }

          const steps = readCount(
            stats.journeyLifetimeSteps ??
              stats.lifetimeSteps ??
              stats.totalSteps
          );

          if (!disposed) {
            setJourneySteps(steps);
            setStepError("");
          }
        } catch (error) {
          if (!disposed) {
            setJourneySteps(null);
            setStepError(
              error?.message ||
                "Saved journey steps could not be read."
            );
          }
        }
      } catch (error) {
        if (!disposed) {
          setAvatar(null);
          setJourneySteps(null);

          setAvatarError(
            "Your saved profile could not be loaded."
          );

          setStepError(
            "Saved journey steps could not be read."
          );
        }
      } finally {
        refreshing = false;

        if (!disposed) {
          setAvatarLoading(false);
        }

        if (
          refreshAgain &&
          !disposed &&
          foreground
        ) {
          refreshAgain = false;
          void refresh();
        }
      }
    }

    void refresh();

    const timer = setInterval(() => {
      void refresh();
    }, 1500);

    const subscription =
      AppState.addEventListener(
        "change",
        (state) => {
          foreground = state === "active";

          if (foreground) {
            void refresh();
          }
        }
      );

    return () => {
      disposed = true;
      clearInterval(timer);
      subscription.remove();
    };
  }, [
    currentAvatar?.id,
    currentAvatar?.avatarId,
    currentAvatar?.name,
    currentAvatar?.image,
  ]);

  const journeyMiles =
    journeySteps === null
      ? "—"
      : (journeySteps / 2000).toFixed(2);

  const rankName =
    legathonRank?.currentRank ||
    "New Walker";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {typeof goBack === "function" && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.headerCopy}>
          <Text style={styles.brand}>
            LEGATHON WALK
          </Text>

          <Text style={styles.title}>
            Legathon Profile
          </Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View
          style={styles.avatarBackdrop}
          pointerEvents="none"
        />

        {avatarLoading ? (
          <View style={styles.avatarFrame}>
            <ActivityIndicator
              size="large"
              color="#F6C84A"
            />

            <Text style={styles.placeholderText}>
              Loading your avatar…
            </Text>
          </View>
        ) : avatar ? (
          <SavedAvatarImage
            key={sourceKey(avatar.source)}
            source={avatar.source}
          />
        ) : (
          <View style={styles.avatarFrame}>
            <Text style={styles.placeholderText}>
              {avatarError ||
                "Choose your avatar in Avatar Center."}
            </Text>
          </View>
        )}

        <View style={styles.rankPill}>
          <Text style={styles.rankText}>
            {rankName}
          </Text>
        </View>

        <Text style={styles.identityLabel}>
          YOUR LEGATHON IDENTITY
        </Text>

        <Text style={styles.avatarName}>
          {avatarLoading
            ? "…"
            : avatar?.name || "Legathon Walker"}
        </Text>

        <Text style={styles.avatarSubtitle}>
          Keep stepping. Build your legacy.
        </Text>

        <TouchableOpacity
          style={[
            styles.editButton,
            typeof openAvatarCenter !== "function" &&
              styles.disabledButton,
          ]}
          onPress={openAvatarCenter}
          disabled={
            typeof openAvatarCenter !== "function"
          }
          accessibilityRole="button"
        >
          <Text style={styles.editButtonText}>
            Open Avatar Center
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>
        WALKING LEGATHON
      </Text>

      <Text style={styles.sectionTitle}>
        Performance
      </Text>

      {!!stepError && (
        <Text
          style={styles.errorText}
          accessibilityRole="alert"
        >
          {stepError}
        </Text>
      )}

      <View style={styles.statsGrid}>
        <Stat
          icon="👟"
          value={formatNumber(journeySteps)}
          label="Journey Lifetime Steps"
          sub="Journey walking only"
        />

        <Stat
          icon="🗺️"
          value={journeyMiles}
          label="Journey Miles"
          sub="2,000 steps per mile"
        />

        <Stat
          icon="⭐"
          value={formatNumber(legathonPoints)}
          label="Legathon Points"
          sub={rankName}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Tracksuit Progress
        </Text>

        <Text style={styles.infoText}>
          Journey Lifetime Steps advance your
          tracksuit progression. Marathon steps
          are tracked separately.
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function Stat({
  icon,
  value,
  label,
  sub,
}) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>
        {icon}
      </Text>

      <Text
        style={styles.statValue}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>

      <Text style={styles.statSub}>
        {sub}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 260,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  headerCopy: {
    flex: 1,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#F6C84A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  backText: {
    color: "#F6C84A",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900",
  },

  brand: {
    color: "#79F5D1",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    marginTop: 7,
  },

  profileCard: {
    backgroundColor: "#07111A",
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: "#E0AE25",
    overflow: "hidden",
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 30,
  },

  avatarBackdrop: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#141537",
    top: 95,
  },

  avatarFrame: {
    width: "100%",
    height: 455,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    maxWidth: 330,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  placeholderText: {
    color: "#B7BECC",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 14,
    paddingHorizontal: 24,
  },

  rankPill: {
    borderWidth: 1,
    borderColor: "#F6C84A",
    backgroundColor: "#07111A",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginTop: -8,
  },

  rankText: {
    color: "#F6C84A",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  identityLabel: {
    color: "#F6C84A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 16,
  },

  avatarName: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 44,
    marginTop: 14,
    paddingHorizontal: 16,
  },

  avatarSubtitle: {
    color: "#AAB6C4",
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 26,
    paddingHorizontal: 18,
  },

  editButton: {
    backgroundColor: "#E0AE25",
    width: "90%",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  editButtonText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  disabledButton: {
    opacity: 0.5,
  },

  sectionLabel: {
    color: "#F6C84A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 28,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 18,
  },

  errorText: {
    color: "#F6C84A",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statBox: {
    width: "48%",
    minHeight: 180,
    backgroundColor: "#08182E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#233C5E",
    padding: 18,
    marginBottom: 14,
  },

  statIcon: {
    fontSize: 26,
    marginBottom: 16,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  statLabel: {
    color: "#AAB6C4",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "900",
    marginTop: 8,
  },

  statSub: {
    color: "#7F90A9",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 7,
  },

  infoCard: {
    backgroundColor: "#0B172A",
    borderWidth: 1,
    borderColor: "#233C5E",
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
  },

  infoTitle: {
    color: "#F6C84A",
    fontSize: 19,
    fontWeight: "900",
  },

  infoText: {
    color: "#AAB6C4",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
});