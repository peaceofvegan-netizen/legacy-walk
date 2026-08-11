import AsyncStorage from "@react-native-async-storage/async-storage";

const STORY_PROGRESS_KEY = "LEGACY_WALK_STORY_PROGRESS";

export const JOURNEY_STORIES = {
  underground_railroad: {
    id: "underground_railroad",
    title: "Underground Railroad",

    milestones: [
      {
        mile: 1,
        type: "story",
        title: "The Journey Begins",
        description:
          "You leave behind everything familiar and begin the path toward freedom.",
      },

      {
        mile: 5,
        type: "fact",
        title: "Safe Houses",
        description:
          "Many freedom seekers traveled at night and relied on safe houses for protection.",
      },

      {
        mile: 10,
        type: "story",
        title: "Crossing the River",
        description:
          "Natural barriers often became the most dangerous part of the journey.",
      },

      {
        mile: 25,
        type: "audio",
        title: "Voices of Freedom",
        description:
          "Listen to stories inspired by real accounts of those seeking freedom.",
      },

      {
        mile: 40,
        type: "story",
        title: "The Final Push",
        description:
          "The destination is close, but the risks remain high.",
      },

      {
        mile: 50,
        type: "reward",
        title: "Journey Complete",
        description:
          "You completed the Underground Railroad Journey.",
      },
    ],
  },
};

export async function loadStoryProgress() {
  const saved = await AsyncStorage.getItem(
    STORY_PROGRESS_KEY
  );

  return saved
    ? JSON.parse(saved)
    : {
        unlockedStories: [],
      };
}

export async function checkStoryUnlocks(
  journeyId,
  completedMiles
) {
  const story = JOURNEY_STORIES[journeyId];

  if (!story) return [];

  const progress = await loadStoryProgress();

  const newlyUnlocked = story.milestones.filter(
    (milestone) =>
      completedMiles >= milestone.mile &&
      !progress.unlockedStories.includes(
        `${journeyId}-${milestone.mile}`
      )
  );

  if (newlyUnlocked.length === 0) {
    return [];
  }

  const updated = {
    unlockedStories: [
      ...progress.unlockedStories,
      ...newlyUnlocked.map(
        (item) => `${journeyId}-${item.mile}`
      ),
    ],
  };

  await AsyncStorage.setItem(
    STORY_PROGRESS_KEY,
    JSON.stringify(updated)
  );

  return newlyUnlocked;
}

export async function getUnlockedStories(
  journeyId
) {
  const story = JOURNEY_STORIES[journeyId];

  if (!story) return [];

  const progress = await loadStoryProgress();

  return story.milestones.filter((milestone) =>
    progress.unlockedStories.includes(
      `${journeyId}-${milestone.mile}`
    )
  );
}