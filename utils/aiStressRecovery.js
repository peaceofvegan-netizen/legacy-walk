export function recommendBreathingTechnique({
  mood = "Calm",
  stressLevel = "Medium",
  goal = "Reset",
  fatigue = "Medium",
}) {
  if (goal === "Sleep" || stressLevel === "High") {
    return {
      selectedId: "478",
      title: "4-7-8 Breathing Recommended",
      message:
        "Your stress level suggests a slower breathing pattern to help your body settle.",
      reason: "Best for deep relaxation, stress relief, and sleep preparation.",
    };
  }

  if (goal === "Focus") {
    return {
      selectedId: "box",
      title: "Box Breathing Recommended",
      message:
        "Box breathing is great for focus, control, and mental reset.",
      reason: "Best for concentration, nervous system reset, and calm focus.",
    };
  }

  if (fatigue === "High") {
    return {
      selectedId: "walk",
      title: "Walk Recovery Recommended",
      message:
        "Your body may benefit from a gentle post-walk cooldown.",
      reason: "Best for recovery after movement or walking sessions.",
    };
  }

  return {
    selectedId: "calm",
    title: "Calm Reset Recommended",
    message:
      "A short calming breath pattern can help you reset quickly.",
    reason: "Best for daily stress, anxiety cooldown, and emotional balance.",
  };
}