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

const WCOIN = require("../assets/wcoin.png");

export default function MoreScreen({
  language = "en",

  goToProfile,
  goToAvatarProfile,
  goToPassport,
  goToCertificates,

  goToWalkingAnalytics,
  goToStepPermissions,
  goToAICoach,
  goToGPSJourneyMap,
  goToJourneyStory,
  goToLegathons,

  goToCommunity,
  goToLeaderboard,
  goToHallOfLegends,
  goToDailyChallenges,

  goToPhysicalStore,

  
  goToWCoinWallet,
  goToSubscription,

  goToBreathing,
  goToBreathingAnalytics,
 goToJourneyPreferences,
  goToLanguage,
  goToSettings,
  goToPrivacy,
  goToAbout,
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>LEGATHON WALK</Text>

        <Text style={styles.title}>
          {translate(language, "more")}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            {translate(language, "YOUR LEGATHON HUB")}
          </Text>

          <Text style={styles.heroText}>
            Access your profile, walking tools, community, marketplace,
            wellness features, and app settings.
          </Text>
        </View>

        <Section title={translate(language, "legathon Identity")}>
          <MenuItem icon="👤" title={translate(language, "profile")} onPress={goToProfile} />
          <MenuItem icon="🧍" title={translate(language, "avatarProfile")} onPress={goToAvatarProfile} />
          <MenuItem icon="🛂" title={translate(language, "passport")} onPress={goToPassport} />
      
        </Section>

        <Section title={translate(language, "walkTools")}>
          <MenuItem icon="📊" title={translate(language, "walkingAnalytics")} onPress={goToWalkingAnalytics} />
            <MenuItem
  icon="⚙️"
  title="Journey Preferences"
  onPress={goToJourneyPreferences}
/>

          <MenuItem icon="🧠" title={translate(language, "aiCoach")} onPress={goToAICoach} />
          <MenuItem icon="🗺️" title={translate(language, "gpsJourneyMap")} onPress={goToGPSJourneyMap} />
          <MenuItem icon="📖" title={translate(language, "journeyStory")} onPress={goToJourneyStory} />
          <MenuItem icon="🏃" title={translate(language, "legathons")} onPress={goToLegathons} />
        </Section>

        <Section title={translate(language, "community")}>
          <MenuItem icon="👥" title={translate(language, "community")} onPress={goToCommunity} />
          <MenuItem icon="🏆" title={translate(language, "leaderboard")} onPress={goToLeaderboard} />
          <MenuItem icon="👑" title={translate(language, "hallOfLegends")} onPress={goToHallOfLegends} />
         
        </Section>

        <Section title={translate(language, "storeWallet")}>
          <MenuItem icon="🛍️" title={translate(language, "marketplace")} onPress={goToPhysicalStore} />
          
          
          <MenuItem image={WCOIN} title={translate(language, "wCoinWallet")} onPress={goToWCoinWallet} />
          <MenuItem icon="⭐" title={translate(language, "subscription")} onPress={goToSubscription} />
        </Section>

        <Section title={translate(language, "wellness")}>
          <MenuItem icon="🫁" title={translate(language, "breathingExercise")} onPress={goToBreathing} />
          <MenuItem icon="📈" title={translate(language, "breathingAnalytics")} onPress={goToBreathingAnalytics} />
        </Section>

        <Section title={translate(language, "app")}>
  <MenuItem
    icon="⚙️"
    title={translate(language, "settings")}
    onPress={goToSettings}
  />
</Section>

        <View style={{ height: 130 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MenuItem({ icon, image, title, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {image ? (
        <Image source={image} style={styles.menuImage} />
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}

      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

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

  title: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
    marginBottom: 24,
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
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 34,
    width: 55,
  },

  menuImage: {
    width: 38,
    height: 38,
    resizeMode: "contain",
    marginRight: 17,
  },

  menuText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  arrow: {
    color: "#D4AF37",
    fontSize: 48,
    fontWeight: "900",
    marginLeft: 12,
  },
});