export const BREATHING_CHALLENGES = [
  {
    id: "morning_reset",
    title: "Morning Reset",
    goal: "Complete 1 breathing session today",
    reward: 25,
    target: 1,
  },
  {
    id: "calm_minutes",
    title: "Calm Minutes",
    goal: "Breathe for 5 total minutes",
    reward: 50,
    target: 5,
  },
  {
    id: "focus_builder",
    title: "Focus Builder",
    goal: "Complete 3 sessions this week",
    reward: 100,
    target: 3,
  },
];

export function getBreathingChallenges(analytics) {
  return BREATHING_CHALLENGES.map((challenge) => {
    const progress =
      challenge.id === "calm_minutes"
        ? analytics.minutesBreathed || 0
        : analytics.sessionsCompleted || 0;

    return {
      ...challenge,
      progress,
      completed: progress >= challenge.target,
    };
  });
}