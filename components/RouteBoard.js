import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const SHOE = require("../assets/w-shoe.jpeg");

export default function RouteBoard({
  title,
  start,
  finish,
  miles,
  progress = 0,
  destinationIcon = "🏛️",
  milestones = [],
}) {
  const shoePosition = Math.max(
    8,
    Math.min(progress * 3.2, 82)
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.route}>
            {start} → {finish}
          </Text>
        </View>

        <View style={styles.milesBadge}>
          <Text style={styles.milesText}>
            {miles} MI
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>
          {progress}% Complete
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(progress, 3)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.mapArea}>
        <View style={[styles.routePath, styles.route1]} />
        <View style={[styles.routePath, styles.route2]} />
        <View style={[styles.routePath, styles.route3]} />
        <View style={[styles.routePath, styles.route4]} />

        <View
          style={[
            styles.shoeWrapper,
            { left: `${shoePosition}%` },
          ]}
        >
          <Image
            source={SHOE}
            style={styles.shoe}
          />
        </View>

        {milestones.map((milestone, index) => {
          const positions = [
            { left: "6%", top: 135 },
            { left: "26%", top: 95 },
            { left: "47%", top: 145 },
            { left: "68%", top: 105 },
            { left: "86%", top: 60 },
          ];

          const position =
            positions[index] || positions[4];

          return (
            <View
              key={index}
              style={[
                styles.marker,
                {
                  left: position.left,
                  top: position.top,
                },
              ]}
            >
              <View
                style={[
                  styles.markerCircle,
                  index === milestones.length - 1 &&
                    styles.destinationCircle,
                ]}
              >
                <Text style={styles.markerIcon}>
                  {index === milestones.length - 1
                    ? destinationIcon
                    : "📍"}
                </Text>
              </View>

              <Text
                style={[
                  styles.markerText,
                  index === milestones.length - 1 &&
                    styles.destinationText,
                ]}
              >
                {milestone}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerCard}>
          <Text style={styles.footerValue}>
            {progress}%
          </Text>
          <Text style={styles.footerLabel}>
            Progress
          </Text>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerValue}>
            {miles}
          </Text>
          <Text style={styles.footerLabel}>
            Miles
          </Text>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerValue}>
            {milestones.length}
          </Text>
          <Text style={styles.footerLabel}>
            Stops
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#071019",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(166,255,210,0.20)",
    marginHorizontal: 18,
    marginVertical: 16,
    padding: 20,

    shadowColor: "#A6FFD2",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  route: {
    color: "#A8B0BF",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },

  milesBadge: {
    backgroundColor: "rgba(224,174,37,0.10)",
    borderWidth: 1,
    borderColor: "#E0AE25",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  milesText: {
    color: "#E0AE25",
    fontWeight: "900",
  },

  progressContainer: {
    marginTop: 18,
  },

  progressLabel: {
    color: "#A6FFD2",
    fontWeight: "900",
    marginBottom: 10,
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#13263A",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#A6FFD2",
  },

  mapArea: {
    height: 260,
    marginTop: 24,
    position: "relative",
  },

  routePath: {
    position: "absolute",
    height: 8,
    backgroundColor: "#A6FFD2",
    borderRadius: 999,

    shadowColor: "#A6FFD2",
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },

  route1: {
    width: 90,
    left: 20,
    top: 170,
    transform: [{ rotate: "-18deg" }],
  },

  route2: {
    width: 95,
    left: 110,
    top: 120,
    transform: [{ rotate: "20deg" }],
  },

  route3: {
    width: 95,
    left: 205,
    top: 165,
    transform: [{ rotate: "-15deg" }],
  },

  route4: {
    width: 85,
    right: 15,
    top: 105,
    transform: [{ rotate: "18deg" }],
  },

  shoeWrapper: {
    position: "absolute",
    top: 150,
    marginLeft: -25,
    zIndex: 99,
  },

  shoe: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  marker: {
    position: "absolute",
    width: 80,
    alignItems: "center",
  },

  markerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#A6FFD2",
    alignItems: "center",
    justifyContent: "center",
  },

  destinationCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0AE25",
  },

  markerIcon: {
    fontSize: 20,
  },

  markerText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },

  destinationText: {
    color: "#E0AE25",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  footerCard: {
    flex: 1,
    backgroundColor: "#101A28",
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 4,
    alignItems: "center",
  },

  footerValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  footerLabel: {
    color: "#A8B0BF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
});