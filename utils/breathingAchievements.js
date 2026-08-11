const ACHIEVEMENTS = [
  {
    id: "first_breath",
    title: "First Breath",
    icon: "🌱",
    requirement: 1,
    type: "sessions",
  },

  {
    id: "mindful_walker",
    title: "Mindful Walker",
    icon: "🧘",
    requirement: 10,
    type: "sessions",
  },

  {
    id: "streak_builder",
    title: "Streak Builder",
    icon: "🔥",
    requirement: 25,
    type: "sessions",
  },

  {
    id: "calm_master",
    title: "Calm Master",
    icon: "👑",
    requirement: 50,
    type: "sessions",
  },

  {
    id: "wellness_legend",
    title: "Wellness Legend",
    icon: "💎",
    requirement: 100,
    type: "sessions",
  },
];

export function getBreathingAchievements(stats) {
  const sessions = stats.totalSessions || 0;

  return ACHIEVEMENTS.map((badge) => ({
    ...badge,
    unlocked: sessions >= badge.requirement,
  }));
}