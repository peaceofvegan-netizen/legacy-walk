export const AVATAR_ACTIONS = [
  {
    id: "idle",
    label: "Idle",
    emoji: "🧍",
    description: "Calm breathing stance",
  },
  {
    id: "walk",
    label: "Walk",
    emoji: "🚶",
    description: "Light walking bounce",
  },
  {
    id: "stretch",
    label: "Stretch",
    emoji: "🙆",
    description: "Recovery stretch",
  },
  {
    id: "celebrate",
    label: "Celebrate",
    emoji: "🎉",
    description: "Reward celebration",
  },
];

export function getAvatarRank(level = 1) {
  if (level >= 50) return "Mythic Walker";
  if (level >= 30) return "Legendary Walker";
  if (level >= 20) return "Marathon Walker";
  if (level >= 10) return "Recovery Walker";
  if (level >= 5) return "Active Walker";
  return "Beginner Walker";
}