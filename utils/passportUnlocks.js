export function getUnlockedPassportStamps(passportStamps, completedJourneys) {
  return passportStamps.map((stamp) => {
    const completed = completedJourneys.some(
      (journey) => journey.title === stamp.journey
    );

    if (!completed) return stamp;

    return {
      ...stamp,
      status: "Unlocked",
      dateUnlocked:
        completedJourneys.find((journey) => journey.title === stamp.journey)
          ?.completedAt || "Unlocked",
    };
  });
}