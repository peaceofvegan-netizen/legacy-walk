import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AppState,
} from "react-native";

import {
  getTotalPoints,
} from "../utils/legacyPointsManager";

import {
  getLegathonRank,
} from "../utils/legathonRankSystem";

export default function useLegathonPoints() {
  const _accountSession = captureAccountSession();

  const [points, setPoints] = useState(0);

  const [rank, setRank] = useState(
    () => {
  

return (getLegathonRank(0));
}
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const refresh = useCallback(async () => {
  try {
    _accountSession.assertCurrent();

    const requestId = ++requestRef.current;

    setError("");

    try {
      const storedTotal = Number(
        await _accountSession.run(async () => (getTotalPoints()))
      );

      const total = Number.isFinite(storedTotal)
        ? Math.max(0, storedTotal)
        : 0;

      if (
        !mountedRef.current ||
        requestId !== requestRef.current
      ) {
        return total;
      }

      setPoints(total);
      setRank(getLegathonRank(total));

      return total;
    } catch (refreshError) {
    if (isAccountSessionEnded(refreshError)) throw refreshError;

      if (
        mountedRef.current &&
        requestId === requestRef.current
      ) {
        setError(
          "Legathon Points could not be refreshed."
        );
      }

      return 0;
    } finally {
      if (
        mountedRef.current &&
        requestId === requestRef.current
      ) {
        setLoading(false);
      }
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}, []);

  useEffect(() => {
  if (!_accountSession.isCurrent()) return;

    mountedRef.current = true;

    refresh();

    const subscription =
      AppState.addEventListener(
        "change",
        (state) => {
  if (!_accountSession.isCurrent()) return;

          if (state === "active") {
            refresh();
          }
        }
      );

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      subscription.remove();
    };
  }, [refresh]);

  return {
    points,
    rank,
    loading,
    error,
    refresh,
  };
}