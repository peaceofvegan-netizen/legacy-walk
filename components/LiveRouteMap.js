import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function LiveRouteMap({ location, route = [] }) {
  if (!location) {
    return (
      <View style={styles.emptyMap}>
        <Text style={styles.emptyText}>Waiting for GPS signal...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation
      followsUserLocation
    >
      <Marker coordinate={location} title="You are here" />

      {route.length > 1 && (
        <Polyline
          coordinates={route}
          strokeColor="#A6FFD2"
          strokeWidth={5}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 260,
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
  },

  emptyMap: {
    height: 260,
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#131C2B",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#A6FFD2",
    fontWeight: "900",
  },
});