import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";

import { translate } from "../i18n/i18n";

// ======================================================
// LEGATHON CUSTOM MORE SCREEN ICONS
// ======================================================

const MORE_ICONS = {
  profile: require("../assets/more-icons/profile.png"),
  avatarProfile: require("../assets/more-icons/avatar-profile.png"),
  passport: require("../assets/more-icons/passport.png"),

  walkingAnalytics: require("../assets/more-icons/walking-analytics.png"),
  walkingPace: require("../assets/more-icons/walking-pace.png"),
  journeyPreference: require("../assets/more-icons/journey-preference.png"),
  aiCoach: require("../assets/more-icons/ai.png"),
  legathons: require("../assets/more-icons/legathon.png"),

  community: require("../assets/more-icons/community.png"),
  leaderboard: require("../assets/more-icons/leaderboard.png"),
  hallOfLegends: require("../assets/more-icons/hall-of-legends.png"),

  marketplace: require("../assets/more-icons/marketplace.png"),
  wcoinWallet: require("../assets/more-icons/wcoin-wallet.png"),
  subscription: require("../assets/more-icons/subscription.png"),

  settings: require("../assets/more-icons/settings.png"),
};

export default function MoreScreen({
  language = "en",

  goToProfile,
  goToAvatarProfile,
  goToPassport,

  goToWalkingAnalytics,
  goToWalkingFunction,
  goToJourneyPreferences,

  goToAICoach,
  goToLegathons,

  goToCommunity,
  goToLeaderboard,
  goToHallOfLegends,

  goToPhysicalStore,
  goToWCoinWallet,
  goToSubscription,

  goToSettings,
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <Text style={styles.kicker}>
          LEGATHON WALK
        </Text>

       
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            YOUR LEGATHON HUB
          </Text>

          <Text style={styles.heroText}>
            Access your profile, walking tools,
            community, marketplace, wellness
            features, and app settings.
          </Text>
        </View>

        {/* ==================================================
            LEGATHON IDENTITY
        ================================================== */}

        <Section title="LEGATHON IDENTITY">
          <MenuItem
            image={MORE_ICONS.profile}
            title={translate(
              language,
              "profile"
            )}
            onPress={goToProfile}
          />

          <MenuItem
            image={MORE_ICONS.avatarProfile}
            title={translate(
              language,
              "avatarProfile"
            )}
            onPress={goToAvatarProfile}
          />

          <MenuItem
            image={MORE_ICONS.passport}
            title={translate(
              language,
              "passport"
            )}
            onPress={goToPassport}
          />
        </Section>

        {/* ==================================================
            WALK TOOLS
        ================================================== */}

        <Section
          title={translate(
            language,
            "walkTools"
          )}
        >
          <MenuItem
            image={MORE_ICONS.walkingAnalytics}
            title={translate(
              language,
              "walkingAnalytics"
            )}
            onPress={goToWalkingAnalytics}
          />

          <MenuItem
            image={MORE_ICONS.walkingPace}
            title="Walking Pace & Function"
            onPress={goToWalkingFunction}
          />

          <MenuItem
            image={MORE_ICONS.journeyPreference}
            title="Journey Preferences"
            onPress={goToJourneyPreferences}
          />

          <MenuItem
            image={MORE_ICONS.aiCoach}
            title={translate(
              language,
              "aiCoach"
            )}
            onPress={goToAICoach}
          />

          <MenuItem
            image={MORE_ICONS.legathons}
            title={translate(
              language,
              "legathons"
            )}
            onPress={goToLegathons}
          />
        </Section>

        {/* ==================================================
            COMMUNITY
        ================================================== */}

        <Section
          title={translate(
            language,
            "community"
          )}
        >
          <MenuItem
            image={MORE_ICONS.community}
            title={translate(
              language,
              "community"
            )}
            onPress={goToCommunity}
          />

          <MenuItem
            image={MORE_ICONS.leaderboard}
            title={translate(
              language,
              "leaderboard"
            )}
            onPress={goToLeaderboard}
          />

          <MenuItem
            image={MORE_ICONS.hallOfLegends}
            title={translate(
              language,
              "hallOfLegends"
            )}
            onPress={goToHallOfLegends}
          />
        </Section>

        {/* ==================================================
            STORE & WALLET
        ================================================== */}

        <Section
          title={translate(
            language,
            "storeWallet"
          )}
        >
          <MenuItem
            image={MORE_ICONS.marketplace}
            title={translate(
              language,
              "marketplace"
            )}
            onPress={goToPhysicalStore}
          />

          <MenuItem
            image={MORE_ICONS.wcoinWallet}
            title={translate(
              language,
              "wCoinWallet"
            )}
            onPress={goToWCoinWallet}
          />

          <MenuItem
            image={MORE_ICONS.subscription}
            title={translate(
              language,
              "subscription"
            )}
            onPress={goToSubscription}
          />
        </Section>

        {/* ==================================================
            APP
        ================================================== */}

        <Section
          title={translate(
            language,
            "app"
          )}
        >
          <MenuItem
            image={MORE_ICONS.settings}
            title={translate(
              language,
              "settings"
            )}
            onPress={goToSettings}
          />
        </Section>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  children,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
}

// ======================================================
// MENU ITEM
// ======================================================

function MenuItem({
  image,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Image
          source={image}
          style={styles.menuImage}
          resizeMode="contain"
        />
      </View>

      <Text
        style={styles.menuText}
        numberOfLines={2}
      >
        {title}
      </Text>

      <Text style={styles.arrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  content: {
    padding: 20,
    paddingTop: 60,
  },

  kicker: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 8,
  },

 

  heroCard: {
    backgroundColor: "#0B182B",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E334A",
    marginBottom: 30,
  },

  heroTitle: {
    color: "#A7F3D0",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 25,
  },

  section: {
    marginBottom: 34,
  },

  sectionTitle: {
    color: "#A7F3D0",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 14,
  },

  menuItem: {
    backgroundColor: "#0B182B",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1E334A",

    paddingVertical: 16,
    paddingHorizontal: 18,

    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",

    minHeight: 104,
  },

  // Holds every custom Legathon icon
  iconContainer: {
    width: 72,
    height: 72,
    marginRight: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // Actual PNG
  menuImage: {
    width: 72,
    height: 72,
  },

  menuText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 30,
  },

  arrow: {
    color: "#D4AF37",
    fontSize: 48,
    fontWeight: "900",
    marginLeft: 10,
  },

  bottomSpace: {
    height: 130,
  },
});