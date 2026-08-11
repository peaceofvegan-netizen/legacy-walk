import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useStepCounter() {
  const [steps, setSteps] = useState(8742);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let subscription;

    async function startPedometer() {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);

      if (!available) return;

      subscription = Pedometer.watchStepCount((result) => {
        setSteps((current) => current + result.steps);
      });
    }

    startPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    steps,
    isAvailable,
    miles: Number((steps / 2200).toFixed(1)),
    calories: Math.round(steps * 0.04),
  };
}