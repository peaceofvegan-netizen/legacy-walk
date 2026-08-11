export function getWalkingStreak(steps) {
  if (steps >= 10000) {
    return {
      label: "Goal Day",
      streak: 12,
      message: "You hit your daily goal. Your streak continues!",
    };
  }

  if (steps >= 5000) {
    return {
      label: "Strong Day",
      streak: 12,
      message: "You’re halfway to your goal. Keep moving.",
    };
  }

  return {
    label: "Start Walking",
    streak: 11,
    message: "Take more steps today to protect your streak.",
  };
}