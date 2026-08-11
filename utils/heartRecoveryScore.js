export function calculateHeartRecoveryScore({
  cycleCount = 0,
  sessionSecondsLeft = 0,
  sessionMinutes = 3,
  breathingStreak = 0,
  completedSessions = 0,
}) {
  const totalSeconds = sessionMinutes * 60;
  const completedSeconds = Math.max(0, totalSeconds - sessionSecondsLeft);

  const completionPercent =
    totalSeconds > 0 ? Math.min(100, (completedSeconds / totalSeconds) * 100) : 0;

  const cycleScore = Math.min(30, cycleCount * 5);
  const completionScore = Math.min(40, completionPercent * 0.4);
  const streakScore = Math.min(20, breathingStreak * 2);
  const experienceScore = Math.min(10, completedSessions * 0.5);

  const recoveryScore = Math.round(
    cycleScore + completionScore + streakScore + experienceScore
  );

  let rating = "Building";
  let message = "Keep breathing steadily to improve your recovery score.";

  if (recoveryScore >= 85) {
    rating = "Excellent";
    message = "Excellent recovery rhythm. Your body is settling into a calm state.";
  } else if (recoveryScore >= 70) {
    rating = "Strong";
    message = "Strong recovery session. Your breathing rhythm is improving.";
  } else if (recoveryScore >= 50) {
    rating = "Good";
    message = "Good session. Stay consistent to improve calm control.";
  }

  return {
    recoveryScore,
    calmScore: Math.min(100, Math.round(recoveryScore + breathingStreak)),
    stressReduction: Math.min(100, Math.round(recoveryScore * 0.75)),
    rating,
    message,
    bonusEligible: recoveryScore >= 85,
  };
}