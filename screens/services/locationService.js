import * as Location from "expo-location";

export async function startLocationTracking(onUpdate) {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    return null;
  }

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 3000,
      distanceInterval: 5,
    },
    (location) => {
      onUpdate(location);
    }
  );
}