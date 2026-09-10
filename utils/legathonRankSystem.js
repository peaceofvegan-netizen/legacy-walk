export const LEGATHON_RANKS = [
  {
    id: 1,
    title: "New Walker",
    minPoints: 0,
    maxPoints: 9999,
    color: "#9CA3AF",
    badge: "🥾",
  },
  {
    id: 2,
    title: "Explorer",
    minPoints: 10000,
    maxPoints: 24999,
    color: "#3B82F6",
    badge: "🧭",
  },
  {
    id: 3,
    title: "Pathfinder",
    minPoints: 25000,
    maxPoints: 49999,
    color: "#22C55E",
    badge: "🌿",
  },
  {
    id: 4,
    title: "Trailblazer",
    minPoints: 50000,
    maxPoints: 99999,
    color: "#F59E0B",
    badge: "🔥",
  },
  {
    id: 5,
    title: "Adventurer",
    minPoints: 100000,
    maxPoints: 249999,
    color: "#EF4444",
    badge: "🏔️",
  },
  {
    id: 6,
    title: "Champion",
    minPoints: 250000,
    maxPoints: 499999,
    color: "#8B5CF6",
    badge: "🏆",
  },
  {
    id: 7,
    title: "Master Walker",
    minPoints: 500000,
    maxPoints: 999999,
    color: "#06B6D4",
    badge: "⭐",
  },
  {
    id: 8,
    title: "Legathon Hero",
    minPoints: 1000000,
    maxPoints: 2499999,
    color: "#10B981",
    badge: "🛡️",
  },
  {
    id: 9,
    title: "Legend",
    minPoints: 2500000,
    maxPoints: 4999999,
    color: "#FACC15",
    badge: "👑",
  },
  {
    id: 10,
    title: "Hall of Fame",
    minPoints: 5000000,
    maxPoints: Number.MAX_SAFE_INTEGER,
    color: "#FFFFFF",
    badge: "🌍",
  },
];

export function getLegathonRank(totalPoints) {
  const points = Number(totalPoints || 0);

  const current =
    LEGATHON_RANKS.find(
      (rank) =>
        points >= rank.minPoints &&
        points <= rank.maxPoints
    ) || LEGATHON_RANKS[0];

  const next =
    LEGATHON_RANKS.find(
      (rank) => rank.id === current.id + 1
    ) || null;

  const progress = next
    ? Math.min(
        100,
        ((points - current.minPoints) /
          (next.minPoints - current.minPoints)) *
          100
      )
    : 100;

  return {
    currentRank: current.title,
    badge: current.badge,
    color: current.color,
    currentPoints: points,
    nextRank: next ? next.title : "MAX",
    nextRankPoints: next ? next.minPoints : points,
    pointsRemaining: next
      ? next.minPoints - points
      : 0,
    progress: Math.round(progress),
  };
}