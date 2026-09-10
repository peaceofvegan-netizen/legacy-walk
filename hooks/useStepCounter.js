import { useEffect, useRef, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useStepCounter() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [walkingSeconds, setWalkingSeconds] = useState(0);

  const sessionStartRef = useRef(null);
  const lastStepsRef = useRef(0);

  useEffect(() => {
    let subscription = null;
    let timer = null;
    let mounted = true;

    async function startPedometer() {
      try {
        const available = await Pedometer.isAvailableAsync();

        if (!mounted) return;

        setIsAvailable(available);

        if (!available) {
          console.log("Pedometer is not available.");
          return;
        }

        sessionStartRef.current = Date.now();

        subscription = Pedometer.watchStepCount((result) => {
          const liveSteps = Number(result?.steps || 0);

          lastStepsRef.current = liveSteps;
          setSteps(liveSteps);
        });

        timer = setInterval(() => {
          if (!sessionStartRef.current) return;

          const elapsedSeconds = Math.floor(
            (Date.now() - sessionStartRef.current) / 1000
          );

          setWalkingSeconds(elapsedSeconds);
        }, 1000);
      } catch (error) {
        console.log("Pedometer start error:", error);
        setIsAvailable(false);
      }
    }

    startPedometer();

    return () => {
      mounted = false;

      if (subscription) {
        subscription.remove();
      }

      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  // Legathon currently uses approximately 2,000 steps = 1 mile.
  const miles = steps / 2000;

  const walkingMinutes = walkingSeconds / 60;

  // Minutes required to walk one mile.
  const paceMinutesPerMile =
    miles > 0 && walkingMinutes > 0
      ? walkingMinutes / miles
      : 0;

  // Miles per hour.
  const speedMph =
    walkingSeconds > 0
      ? miles / (walkingSeconds / 3600)
      : 0;

  // Steps per minute.
  const cadence =
    walkingMinutes > 0
      ? steps / walkingMinutes
      : 0;

  const calories = Math.round(steps * 0.04);

  return {
    steps,
    isAvailable,

    miles: Number(miles.toFixed(2)),
    calories,

    walkingSeconds,
    walkingMinutes: Number(walkingMinutes.toFixed(1)),

    paceMinutesPerMile: Number(paceMinutesPerMile.toFixed(2)),
    speedMph: Number(speedMph.toFixed(2)),
    cadence: Math.round(cadence),
  };
}