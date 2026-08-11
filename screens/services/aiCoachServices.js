export async function getEliteCoachResponse({
  question,
  goal,
  calorieTarget,
  stepsToday,
}) {
  // Later this should call your secure backend, not expose API keys in the app.
  return `You asked: ${question}. Based on your ${goal} goal, aim for about ${calorieTarget} calories today. You have walked ${stepsToday.toLocaleString()} steps, so focus on hydration, protein, and steady walking.`;
}