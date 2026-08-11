import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { translate } from "../i18n/i18n";
const LEGACY_BG = require("../assets/collage-background.png");

const faqs = [
  {
    question: "How does Legathon Walk work?",
    answer:
      "Legacy Walk turns your real-world steps into progress across historic, cultural, and inspirational journeys.",
  },
  {
    question: "How do passport stamps unlock?",
    answer:
      "Stamps unlock when you reach checkpoints inside a journey. Each route has its own collectible passport.",
  },
  {
    question: "What are W Coins?",
    answer:
      "W Coins are Legathon Walk rewards you earn from challenges, streaks, checkpoints, and completed routes.",
  },
  {
    question: "Why are my steps not updating?",
    answer:
      "Check that step tracking, motion, health, and location permissions are enabled for Legathon Walk.",
  },
];


  
export default function HelpCenterScreen({
  language = "en",
  goBack,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <ImageBackground
      source={LEGACY_BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {goBack && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
            )}
                  <Text style={styles.kicker}>
                  {translate(language, "helpCenterTitle")}
                  </Text>

                  <Text style={styles.title}>
                  {translate(language, "contactSupport")}
              </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroIcon}>❓</Text>
              <Text style={styles.heroTitle}>
                {translate(language, "stillNeedHelp")}
               </Text>
              <Text style={styles.heroText}>
                Get help with step tracking, journeys, passports, W Coins,
                rewards, subscriptions, and your Legathon profile.
              </Text>
            </View>

            <View style={styles.quickGrid}>
            <HelpTile icon="👟" title={translate(language, "walkingHelp")} />
             <HelpTile icon="🛂" title={translate(language, "passport")} />
             <HelpTile icon="🪙" title={translate(language, "wCoinWallet")} />
             <HelpTile icon="⭐" title={translate(language, "subscriptionHelp")} />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Popular Help Topics</Text>

              <HelpRow icon="📍" text="How journey checkpoints work" />
              <HelpRow icon="🔥" text="How streaks and daily challenges work" />
              <HelpRow icon="🏆" text="How badges and certificates unlock" />
              <HelpRow icon="🎁" text="How to redeem marketplace items" />
              <HelpRow icon="⚙️" text="How to manage app permissions" />
            </View>

            <View style={styles.faqCard}>
              <Text style={styles.sectionTitle}>FAQ</Text>

              {faqs.map((faq, index) => {
                const open = openFaq === index;

                return (
                  <TouchableOpacity
                    key={faq.question}
                    style={styles.faqItem}
                    onPress={() => setOpenFaq(open ? null : index)}
                  >
                    <View style={styles.faqTop}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Text style={styles.faqArrow}>{open ? "−" : "+"}</Text>
                    </View>

                    {open && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactLabel}>CONTACT SUPPORT</Text>
              <Text style={styles.contactTitle}>Need more help?</Text>
              <Text style={styles.contactText}>
                Send a support message about your account, steps, rewards,
                payments, or journey progress.
              </Text>

              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function HelpTile({ icon, title }) {
  return (
    <View style={styles.helpTile}>
      <Text style={styles.helpTileIcon}>{icon}</Text>
      <Text style={styles.helpTileTitle}>{title}</Text>
    </View>
  );
}

function HelpRow({ icon, text }) {
  return (
    <View style={styles.helpRow}>
      <Text style={styles.helpIcon}>{icon}</Text>
      <Text style={styles.helpText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#020617" },
  backgroundImage: { resizeMode: "cover", opacity: 0.45 },
  overlay: { flex: 1, backgroundColor: "rgba(2,4,10,0.78)" },
  safe: { flex: 1 },
  content: { padding: 22, paddingBottom: 160 },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(8,18,37,0.88)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.45)",
    marginBottom: 24,
  },
  backText: { color: "#D4AF37", fontSize: 19, fontWeight: "900" },

  kicker: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
    marginBottom: 24,
  },

  heroCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.28)",
    marginBottom: 24,
  },
  heroIcon: { fontSize: 58, marginBottom: 12 },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    textAlign: "center",
    marginTop: 12,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 24,
  },
  helpTile: {
    width: "47.8%",
    minHeight: 135,
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 28,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  helpTileIcon: { fontSize: 34, marginBottom: 10 },
  helpTileTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  sectionCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167,243,208,0.22)",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  helpIcon: { fontSize: 28, width: 46 },
  helpText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
    lineHeight: 24,
  },

  faqCard: {
    backgroundColor: "rgba(8,18,37,0.96)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.28)",
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: "rgba(2,6,23,0.62)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
  },
  faqTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqQuestion: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
    lineHeight: 23,
  },
  faqArrow: {
    color: "#D4AF37",
    fontSize: 28,
    fontWeight: "900",
    marginLeft: 12,
  },
  faqAnswer: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: 12,
  },

  contactCard: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.42)",
    marginBottom: 40,
  },
  contactLabel: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },
  contactTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  contactText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 12,
  },
  contactButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 22,
  },
  contactButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
});