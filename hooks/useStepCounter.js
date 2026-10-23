import { useEffect, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { captureAccountSession, isAccountSessionEnded } from '../utils/accountStorage';
import { loadStepStats, getStepVerificationStatus } from '../utils/stepTrackingEngine';

// Display accepted engine totals. A raw sensor event never awards app progress.
export function useStepCounter() {
  const [state, setState] = useState({ steps: 0, liveSteps: 0, isAvailable: false,
    permissionGranted: false, loading: true, error: null });
  const offset = useRef(null);
  const lastLifetime = useRef(0);
  useEffect(() => {
    const account = captureAccountSession();
    let disposed = false, reading = false;
    async function refresh() {
      if (disposed || reading || !account.isCurrent()) return;
      reading = true;
      try {
        const stats = await account.run(loadStepStats);
        const lifetime = stats.journeyLifetimeSteps + stats.marathonLifetimeSteps;
        if (offset.current === null) offset.current = lifetime;
        lastLifetime.current = lifetime;
        if (!disposed) setState(previous => ({ ...previous, steps: stats.todaySteps,
          liveSteps: Math.max(0, lifetime - offset.current), loading: false,
          verificationStatus: getStepVerificationStatus() }));
      } catch (error) {
        if (!disposed && !isAccountSessionEnded(error)) setState(previous => ({ ...previous, loading: false, error: error.message }));
      } finally { reading = false; }
    }
    async function initialize() {
      try {
        let permission = await account.run(() => Pedometer.getPermissionsAsync());
        if (!permission.granted && permission.canAskAgain) permission = await account.run(() => Pedometer.requestPermissionsAsync());
        const available = await account.run(() => Pedometer.isAvailableAsync());
        if (!disposed) setState(previous => ({ ...previous, isAvailable: available,
          permissionGranted: permission.granted,
          error: permission.granted ? null : 'Motion access is required to verify steps.' }));
        await refresh();
      } catch (error) {
        if (!disposed && !isAccountSessionEnded(error)) setState(previous => ({ ...previous, loading: false, error: error.message }));
      }
    }
    void initialize();
    const timer = setInterval(refresh, 1500);
    return () => { disposed = true; clearInterval(timer); };
  }, []);
  return { ...state, miles: Number((state.steps / 2000).toFixed(2)),
    liveMiles: Number((state.liveSteps / 2000).toFixed(2)),
    resetSteps: () => { offset.current = lastLifetime.current; setState(previous => ({ ...previous, liveSteps: 0 })); } };
}
