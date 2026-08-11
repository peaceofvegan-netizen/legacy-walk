export function getLevelFromXP(xp = 0) {
  const levels = [
    { level: 1, title: "New Walker", minXP: 0 },
    { level: 2, title: "Path Finder", minXP: 500 },
    { level: 3, title: "Story Walker", minXP: 1500 },
    { level: 4, title: "Culture Explorer", minXP: 3000 },
    { level: 5, title: "Global Walker", minXP: 6000 },
    { level: 6, title: "Legacy Builder", minXP: 10000 },
    { level: 7, title: "World Explorer", minXP: 18000 },
    { level: 8, title: "Elite Walker", minXP: 30000 },
    { level: 9, title: "Master Explorer", minXP: 50000 },
    { level: 10, title: "Legendary Walker", minXP: 100000 },
  ];

  const currentLevel =
    [...levels].reverse().find((item) => xp >= item.minXP) || levels[0];

  const nextLevel =
    levels.find((item) => item.minXP > currentLevel.minXP) || null;

  const nextXP = nextLevel ? nextLevel.minXP : currentLevel.minXP;
  const currentXP = currentLevel.minXP;
  const progress =
    nextLevel === null
      ? 100
      : Math.min(100, Math.round(((xp - currentXP) / (nextXP - currentXP)) * 100));

  return {
    ...currentLevel,
    xp,
    nextLevel,
    progress,
    xpToNext: nextLevel ? nextXP - xp : 0,
  };
}

export function calculateXP({ steps = 0, completedJourneys = 0, streak = 0 }) {
  const stepXP = Math.floor(steps / 100);
  const journeyXP = completedJourneys * 1000;
  const streakXP = streak * 50;

  return stepXP + journeyXP + streakXP;
}