import { useEffect, useState } from "react";
import { getTotalPoints } from "../utils/legacyPointsManager";
import { getLegathonRank } from "../utils/legathonRankSystem";

export default function useLegathonPoints() {
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState(null);

  async function refresh() {
    const total = await getTotalPoints();
    setPoints(total);
    setRank(getLegathonRank(total));
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    points,
    rank,
    refresh,
  };
}