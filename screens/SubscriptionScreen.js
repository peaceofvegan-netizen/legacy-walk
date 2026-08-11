// SubscriptionScreen.js

import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const FREE_CARD = require("../assets/subscriptions/free-card.jpg");
const PREMIUM_CARD = require("../assets/subscriptions/premium-card.jpg");
const ELITE_CARD = require("../assets/subscriptions/elite-card.jpg");

const SUBSCRIPTION_CARDS = [
  {
    id: "free",
    title: "Free",
    image: FREE_CARD,
  },
  {
    id: "premium",
    title: "Premium",
    image: PREMIUM_CARD,
  },
  {
    id: "elite",
    title: "Elite",
    image: ELITE_CARD,
  },
];
export default function SubscriptionScreen({
  subscriptionPlan = "free",
  setSubscriptionPlan,
  goBack,
  goHome,
  goToPaywall,
}) {


 
  
const handlePlanSelect = (planId) => {
  if (planId === subscriptionPlan) return;

  if (setSubscriptionPlan) {
    setSubscriptionPlan(planId);
  }

  goToPaywall?.(planId);
};
  const handleReturn = () => {
    if (goBack) {
      goBack();
    } else if (goHome) {
      goHome();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReturn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.brand}>
              <Text style={styles.brandBlue}>LEGATHON</Text> WALK
            </Text>

            <View style={styles.goldLine} />

            <Text style={styles.tagline}>
              Walk Today.{" "}
              <Text style={styles.goldText}>
                Legacy Forever.
              </Text>
            </Text>
          </View>
        </View>

        <Text style={styles.screenTitle}>
          Choose Your Membership
        </Text>

        {SUBSCRIPTION_CARDS.map((card) => {
          const isCurrent = subscriptionPlan === card.id;

          return (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.92}
              style={[
                styles.cardWrap,
                isCurrent && styles.currentCardWrap,
              ]}
              onPress={() => handlePlanSelect(card.id)}
            >
             <ImageBackground
  source={card.image}
  style={styles.cardImage}
  imageStyle={styles.cardImageStyle}
  resizeMode="cover"
>


</ImageBackground>

           
            </TouchableOpacity>
          );
        })}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            Membership Access
          </Text>

          <Text style={styles.infoText}>
            Free members get basic journeys and standard rewards.
            Premium and Elite unlock advanced rewards, premium
            journeys, and AI Wellness Coach access.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={handleReturn}
        >
          <Text style={styles.returnText}>
            Return Home
          </Text>
        </TouchableOpacity>

        <View style={{ height: 150 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  container: {
    flex: 1,
    backgroundColor: "#05070C",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 180,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backArrow: {
    color: "#D8A72E",
    fontSize: 58,
    fontWeight: "300",
    marginRight: 8,
  },

  headerTextWrap: {
    flex: 1,
    alignItems: "center",
    marginRight: 42,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
  },

  brandBlue: {
    color: "#1E7BFF",
  },

  goldLine: {
    width: 190,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#D8A72E",
    marginTop: 6,
    marginBottom: 8,
  },

  tagline: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  goldText: {
    color: "#D8A72E",
  },

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18,
  },

 cardWrap: {
  width: "100%",
  borderRadius: 28,
  overflow: "hidden",
  marginBottom: 30,
  backgroundColor: "#071224",
  borderWidth: 1,
  borderColor: "#1E334F",

  // Premium card look
  shadowColor: "#D8A72E",
  shadowOpacity: 0.25,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  elevation: 10,
},

cardImage: {
  width: "100%",
  height: 520,
},
  cardImageStyle: {
    borderRadius: 28,
  },

  currentBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#A6F0CD",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  currentBadgeText: {
    color: "#05070C",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  tapBadge: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(5,7,12,0.82)",
    borderColor: "#D8A72E",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  tapBadgeText: {
    color: "#D8A72E",
    fontSize: 12,
    fontWeight: "900",
  },

  infoBox: {
    backgroundColor: "#071224",
    borderColor: "#243A5E",
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },

  infoTitle: {
    color: "#D8A72E",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },

  infoText: {
    color: "#DDE6F3",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },

  returnButton: {
    borderColor: "#D8A72E",
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
  },

  returnText: {
    color: "#D8A72E",
    fontSize: 20,
    fontWeight: "900",
  },
});