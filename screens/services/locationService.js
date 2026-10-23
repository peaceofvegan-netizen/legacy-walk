import { captureAccountSession, isAccountSessionEnded } from "../../utils/accountStorage";
import * as Location from "expo-location";

export async function startLocationTracking(onUpdate) {
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  const { status } =
    await _accountSession.run(async () => (Location.requestForegroundPermissionsAsync()));

  if (status !== "granted") {
    return null;
  }

  return await _accountSession.run(async () => (Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 3000,
      distanceInterval: 5,
    },
    (location) => {
  if (!_accountSession.isCurrent()) return;

      onUpdate(location);
    }
  )));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}