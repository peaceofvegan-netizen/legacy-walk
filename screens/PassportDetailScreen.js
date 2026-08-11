import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

const passportImages = {
  rome: require("../assets/passports/rome.png"),
  wall: require("../assets/passports/greatwall.png"),
  tubman: require("../assets/passports/tubman.png"),
  mecca: require("../assets/passports/mecca.png"),
  tokyo: require("../assets/passports/tokyo.png"),
  trans: require("../assets/passports/trans.png"),
};

export default function PassportDetailScreen({
  passportId = "rome",
  goBack,
  goCertificate,
}) {
  const id = passportId || "rome";

  const passportData = {
    rome: {
      icon: "🇮🇹",
      title: "Roman Empire",
      location: "Rome, Italy",
      distance: "133 Miles",
      description:
        "Walk through the legacy of the Roman Empire and discover ancient history.",
    },
    wall: {
      icon: "🧱",
      title: "Great Wall of China",
      location: "China",
      distance: "250 Miles",
      description: "Travel one of the greatest wonders ever built.",
    },
    tubman: {
      icon: "🕯️",
      title: "Harriet Tubman",
      location: "Underground Railroad",
      distance: "120 Miles",
      description:
        "Honor courage, freedom, and the powerful journey toward liberation.",
    },
    mecca: {
      icon: "🕌",
      title: "Mecca",
      location: "Saudi Arabia",
      distance: "98 Miles",
      description:
        "A spiritual legacy journey inspired by faith, discipline, and reflection.",
    },
    tokyo: {
      icon: "🌃",
      title: "Tokyo Nights",
      location: "Tokyo, Japan",
      distance: "75 Miles",
      description:
        "Explore a glowing city journey filled with culture, movement, and discovery.",
    },
    trans: {
      icon: "🚄",
      title: "Trans-Siberian Trek",
      location: "Russia",
      distance: "500 Miles",
      description:
        "Complete one of the world’s greatest rail-inspired legacy journeys.",
    },
  };

  const passport = passportData[id] || passportData.rome;
  const backgroundImage = passportImages[id] || passportImages.rome;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
 


            <View style={styles.heroCard}>
              <View style={styles.passportIconCircle}>
                <Text style={styles.icon}>{passport.icon}</Text>
              </View>

              <Text style={styles.title}>{passport.title}</Text>
              <Text style={styles.location}>{passport.location}</Text>
              <Text style={styles.distance}>{passport.distance}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Story</Text>
              <Text style={styles.description}>{passport.description}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Passport Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Journey</Text>
                <Text style={styles.detailValue}>{passport.title}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Region</Text>
                <Text style={styles.detailValue}>{passport.location}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{passport.distance}</Text>
              </View>

              <View style={styles.stampBox}>
                <Text style={styles.stampText}>PASSPORT UNLOCKED</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={goCertificate}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>View Certificate</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  background: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 1.32,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.12)",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 150,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 22,
  },

  backText: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "900",
  },

 heroCard: {
  backgroundColor: "rgba(8,18,37,0.72)",
  borderRadius: 30,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.12)",
  paddingVertical: 34,
  paddingHorizontal: 22,
  alignItems: "center",
  marginBottom: 22,
},

  passportIconCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "rgba(212,175,55,0.14)",
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  icon: {
    fontSize: 58,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 40,
  },

  location: {
    color: "#AAB3C5",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },

  distance: {
    color: "#D4AF37",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },

  sectionCard: {
  backgroundColor: "rgba(8,18,37,0.72)",
  borderRadius: 26,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.12)",
  padding: 22,
  marginBottom: 22,
},

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
  },

  description: {
    color: "#AAB3C5",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 30,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(170,179,197,0.18)",
    paddingVertical: 12,
    gap: 12,
  },

  detailLabel: {
    color: "#AAB3C5",
    fontSize: 16,
    fontWeight: "900",
  },

  detailValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    flex: 1,
  },

  stampBox: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212,175,55,0.13)",
    paddingVertical: 14,
    alignItems: "center",
  },

  stampText: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  button: {
    backgroundColor: "#D4AF37",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
  },
collectionRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 15,
},

collectionItem: {
  width: "31%",
  backgroundColor: "#101826",
  borderRadius: 18,
  paddingVertical: 18,
  paddingHorizontal: 10,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
  minHeight: 110,
},

collectionUnlocked: {
  borderWidth: 2,
  borderColor: "#D4AF37",
  shadowColor: "#D4AF37",
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 8,
},

collectionIcon: {
  fontSize: 32,
  marginBottom: 10,
},
collectionRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 12,
},

collectionItem: {
  width: "30%",
  minHeight: 105,
  backgroundColor: "#101826",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
},

collectionTitle: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "800",
  textAlign: "center",
},

lockedText: {
  color: "#9CA3AF",

},
  buttonText: {
    color: "#020617",
    fontSize: 21,
    fontWeight: "900",
  },
});