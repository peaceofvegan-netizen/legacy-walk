export function getStoryChapter(progress) {
  if (progress >= 100) {
    return {
      chapter: "Final Legacy",
      scene:
        "You completed the journey. History now lives through your footsteps.",
      reward: "🏆 Legendary Chapter",
    };
  }

  if (progress >= 75) {
    return {
      chapter: "The Turning Point",
      scene:
        "Your determination pushes the story toward transformation.",
      reward: "⚡ Momentum Rising",
    };
  }

  if (progress >= 50) {
    return {
      chapter: "The Movement Grows",
      scene:
        "New voices rise. The journey becomes bigger than one person.",
      reward: "🌍 Story Expanding",
    };
  }

  if (progress >= 25) {
    return {
      chapter: "First Milestone",
      scene:
        "Your steps begin shaping the path ahead.",
      reward: "👣 Path Unlocked",
    };
  }

  return {
    chapter: "The Beginning",
    scene:
      "Every great journey starts with a single step.",
    reward: "✨ Journey Started",
  };
}