import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useLiveLocation() {
  const _accountSession = captureAccountSession();

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    let subscription;

    async function startTracking() {
  try {
    _accountSession.assertCurrent();

      try {
        const { status } = await _accountSession.run(async () => (Location.requestForegroundPermissionsAsync()));

        if (status !== "granted") {
          setError("Location permission denied.");
          return;
        }

        setTracking(true);

        subscription = await _accountSession.run(async () => (Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (position) => {
  if (!_accountSession.isCurrent()) return;

            const point = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
            };

            setLocation(point);
            setRoute((current) => {
  

return ([...current, point]);
});
          }
        )));
      } catch (err) {
    if (isAccountSessionEnded(err)) throw err;

        setError(err.message);
      }
    
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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