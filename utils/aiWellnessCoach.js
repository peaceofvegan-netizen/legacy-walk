export function generateWellnessCoachMessage({
  steps = 0,
  streak = 0,
  mood = "Focused",
  goal = "General Wellness",
  activeJourney = null,
  rewardPoints = 0,
}) {
  const journeyName = activeJourney?.title || "your walk";

  if (steps >= 10000) {
    return {
      title: "Goal Complete",
      message: `Excellent work. You completed a strong walking day. Consistent walking may support cardiovascular health, circulation, digestion, mood, and brain function.`,
      action: "Cool down with breathing and save a reflection.",
    };
  }

  if (steps >= 7000) {
    return {
      title: "Almost There",
      message: `You are close to your daily goal. A short walk can help keep your momentum going and support healthy blood flow and energy.`,
      action: "Take a 10–15 minute walk to finish strong.",
    };
  }

  if (steps >= 3000) {
    return {
      title: "Good Progress",
      message: `You have already built movement today. Walking after meals may support digestion and may help with constipation and circulation.`,
      action: "Try another short session later today.",
    };
  }

  return {
    title: "Start Small",
    message: `Even a short walk around the house counts. Walking may support heart health, brain clarity, lower stress, and better circulation over time.`,
    action: `Start ${journeyName} with a 5-minute walk.`,
  };
}

export function generateTrainingRecommendation({
  age,
  weight,
  height,
  activityLevel = "Beginner",
  goal = "Walking",
}) {
  const safeGoal =
    activityLevel === "Advanced"
      ? 10000
      : activityLevel === "Intermediate"
      ? 7500
      : 5000;

  return {
    dailyStepGoal: safeGoal,
    trainingPlan:
      goal === "Marathon"
        ? "Begin with walking intervals, build weekly distance slowly, and include recovery days."
        : "Start with consistent daily walks and increase steps gradually each week.",
    note:
      "These are general wellness recommendations, not medical advice. Users should consult a healthcare professional before starting intense training.",
  };
}

export function generateNutritionTip({
  goal = "General Wellness",
  activityLevel = "Beginner",
}) {
  if (goal === "Weight Loss") {
    return "Focus on hydration, lean protein, vegetables, fiber, and consistent walking. Avoid crash dieting.";
  }

  if (goal === "Marathon") {
    return "For endurance training, prioritize hydration, balanced carbs, protein recovery, and rest days.";
  }

  return "Support your walks with water, balanced meals, fruits, vegetables, protein, and healthy snacks.";
}

export function getWalkingBenefitTip() {
  const tips = [
    "Walking may help support cardiovascular health and endurance.",
    "Walking can help promote healthy blood circulation.",
    "A short walk after meals may support digestion and bowel movement regularity.",
    "Daily walking may help support mood, focus, and brain function.",
    "Consistent walking may support healthy blood pressure and heart wellness.",
    "Walking is a low-impact way to build stamina and daily energy.",
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}