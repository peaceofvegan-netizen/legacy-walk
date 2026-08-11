export function getDailyMotivation({
  steps,
  dailyGoal,
  streak,
}) {
  if (dailyGoal.completed) {
    return "You completed today’s goal. That’s how legacy is built — one committed day at a time.";
  }

  if (steps >= 7500) {
    return "You’re close to today’s goal. A short walk can finish the mission.";
  }

  if (steps >= 5000) {
    return "Strong progress. You’re halfway there — keep your momentum alive.";
  }

  if (streak.streak >= 7) {
    return "Protect your streak today. Even a short walk keeps your legacy moving.";
  }

  return "Start with a simple walk. The first step is the hardest, but it starts everything.";
}