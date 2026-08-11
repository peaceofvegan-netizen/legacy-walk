import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useLiveLocation() {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;

    async function startTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Location permission denied.");
          return;
        }

        setTracking(true);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (position) => {
            const point = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
            };

            setLocation(point);
            setRoute((current) => [...current, point]);
          }
        );
      } catch (err) {
        setError(err.message);
      }
    }

    startTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    location,
    route,
    tracking,
    error,
  };
}