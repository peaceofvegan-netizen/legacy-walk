export const ACHIEVEMENTS = [
  {
    id: "first_journey",
    title: "First Journey",
    type: "journey",
    goal: 1,
    reward: {
      points: 100,
      wcoins: 25,
    },
  },

  {
    id: "first_million_steps",
    title: "One Million Steps",
    type: "steps",
    goal: 1000000,
    reward: {
      points: 500,
      wcoins: 500,
      tracksuit: "yellow",
    },
  },

  {
    id: "hall_of_fame",
    title: "Hall of Fame",
    type: "points",
    goal: 1500000,
    reward: {
      badge: "hall_of_fame",
    },
  },
];
export function checkAchievements(stats) {
  return ACHIEVEMENTS.filter(a => {
    switch (a.type) {

      case "steps":
        return stats.steps >= a.goal;

      case "journey":
        return stats.completedJourneys >= a.goal;

      case "points":
        return stats.points >= a.goal;

      default:
        return false;
    }
  });
}
