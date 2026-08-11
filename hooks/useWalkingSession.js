import { useEffect, useState } from "react";

export function useWalkingSession({
  steps = 0,
  activeJourney = null,
  onCompleteJourney,
}) {
  const [isWalking, setIsWalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartSteps, setSessionStartSteps] = useState(steps);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    let timer;

    if (isWalking && !isPaused) {
      timer = setInterval(() => {
        setSessionSeconds((current) => current + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWalking, isPaused]);

  const sessionSteps = Math.max(steps - sessionStartSteps, 0);
  const sessionMiles = (sessionSteps / 2200).toFixed(2);
  const sessionCalories = Math.floor(sessionSteps * 0.045);
  const sessionXP = Math.floor(sessionSteps / 100);

  function startSession() {
    setSessionStartSteps(steps);
    setSessionSeconds(0);
    setIsWalking(true);
    setIsPaused(false);
  }

  function pauseSession() {
    setIsPaused(true);
  }

  function resumeSession() {
    setIsPaused(false);
  }

  function endSession() {
    setIsWalking(false);
    setIsPaused(false);

    if (activeJourney && onCompleteJourney) {
      onCompleteJourney();
    }
  }

  function formatTime() {
    const minutes = Math.floor(sessionSeconds / 60);
    const seconds = sessionSeconds % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return {
    isWalking,
    isPaused,
    sessionSteps,
    sessionMiles,
    sessionCalories,
    sessionXP,
    sessionSeconds,
    sessionTime: formatTime(),
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  };
}