export function getUserLeaderboardScore({
  steps = 0,
  completedJourneys = 0,
  rewardPoints = 0,
  streak = 0,
}) {
  return steps + completedJourneys * 5000 + rewardPoints * 10 + streak * 1000;
}

export function rankLeaderboard(users = []) {
  return users
    .map((user) => ({
      ...user,
      score: getUserLeaderboardScore(user),
    }))
    .sort((a, b) => b.score - a.score)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
}

export function getRankTitle(rank) {
  if (rank === 1) return "Legacy Champion";
  if (rank <= 3) return "Top 3 Walker";
  if (rank <= 10) return "Elite Walker";
  if (rank <= 25) return "Rising Explorer";
  return "Legacy Walker";
}