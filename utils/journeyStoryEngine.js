import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


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
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(
    STORY_PROGRESS_KEY
  )));

  return saved
    ? JSON.parse(saved)
    : {
        unlockedStories: [],
      };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function checkStoryUnlocks(
  journeyId,
  completedMiles
) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const story = JOURNEY_STORIES[journeyId];

  if (!story) return [];

  const progress = await _accountSession2.run(async () => (loadStoryProgress()));

  const newlyUnlocked = story.milestones.filter(
    (milestone) =>
      {
  

return (completedMiles >= milestone.mile &&
      !progress.unlockedStories.includes(
        `${journeyId}-${milestone.mile}`
      ));
}
  );

  if (newlyUnlocked.length === 0) {
    return [];
  }

  const updated = {
    unlockedStories: [
      ...progress.unlockedStories,
      ...newlyUnlocked.map(
        (item) => {
  

return (`${journeyId}-${item.mile}`);
}
      ),
    ],
  };

  await _accountSession2.run(async () => (AsyncStorage.setItem(
    STORY_PROGRESS_KEY,
    JSON.stringify(updated)
  )));

  return newlyUnlocked;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function getUnlockedStories(
  journeyId
) {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  const story = JOURNEY_STORIES[journeyId];

  if (!story) return [];

  const progress = await _accountSession3.run(async () => (loadStoryProgress()));

  return story.milestones.filter((milestone) =>
    {
  

return (progress.unlockedStories.includes(
      `${journeyId}-${milestone.mile}`
    ));
}
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}