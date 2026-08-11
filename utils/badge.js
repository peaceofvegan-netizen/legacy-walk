export function getUnlockedBadges(steps) {
  const badges = [
    { steps: 1000, label: "👟 First 1K Steps" },
    { steps: 5000, label: "🔥 5K Walker" },
    { steps: 10000, label: "🏆 10K Champion" },
    { steps: 25000, label: "🌍 World Walker" },
    { steps: 50000, label: "✊ Legacy Builder" },
  ];

  return badges.filter((badge) => steps >= badge.steps);
}