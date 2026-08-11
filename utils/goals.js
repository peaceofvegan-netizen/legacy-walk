export function getDailyGoalProgress(steps, goal = 10000) {
  const percent = Math.min(
    100,
    Math.round((steps / goal) * 100)
  );

  const remaining = Math.max(goal - steps, 0);

  return {
    goal,
    percent,
    remaining,
    completed: steps >= goal,
  };
}