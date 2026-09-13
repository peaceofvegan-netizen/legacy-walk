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
  const [points, setPoints] = useState(0);

  const [rank, setRank] = useState(
    () => getLegathonRank(0)
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestRef.current;

    setError("");

    try {
      const storedTotal = Number(
        await getTotalPoints()
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
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    refresh();

    const subscription =
      AppState.addEventListener(
        "change",
        (state) => {
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