// SplashLoadingScreen.js

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashLoadingScreen({
  goToWelcomeBack,
  goToAvatarOnboarding,
}) {
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(
        "hasCompletedOnboarding"
      );

      setTimeout(() => {
        if (completed === "true") {
          goToWelcomeBack?.();
        } else {
          goToAvatarOnboarding?.();
        }
      }, 900);
    } catch (error) {
      console.log("Splash onboarding check error:", error);

      setTimeout(() => {
        goToAvatarOnboarding?.();
      }, 900);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>LW</Text>
      </View>

      <Text style={styles.brand}>
        LEGACY WALK
      </Text>

      <Text style={styles.title}>
        Building Your Legacy
      </Text>

      <Text style={styles.subtitle}>
        Loading your journey, preferences, and progress.
      </Text>

      <ActivityIndicator
        size="large"
        color="#D8A72E"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "#071224",
    borderColor: "#D8A72E",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 2,
  },

  brand: {
    color: "#D8A72E",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 7,
    marginBottom: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    color: "#AAB7CA",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 310,
  },

  loader: {
    marginTop: 30,
  },
});