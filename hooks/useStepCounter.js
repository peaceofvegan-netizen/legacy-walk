import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Pedometer,
} from "expo-sensors";


// ============================================================
// LEGATHON WALK — LIVE STEP COUNTER
// ============================================================
//
// RESPONSIBILITY:
//
// • Check Motion / Pedometer permission
// • Check pedometer availability
// • Listen for foreground live steps
// • Provide live step data
//
// DOES NOT:
//
// • Start or stop walking sessions
// • Calculate session duration
// • Save walking history
// • Calculate Walking Function Score
// • Award WCoins
// • Award points
//
// Session management belongs in:
// useWalkingSession.js
//
// ============================================================


const STEPS_PER_MILE = 2000;


export function useStepCounter() {

  const [steps, setSteps] =
    useState(0);

  const [isAvailable, setIsAvailable] =
    useState(false);

  const [permissionGranted, setPermissionGranted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  const subscriptionRef =
    useRef(null);

  const mountedRef =
    useRef(true);


  // ==========================================================
  // START PEDOMETER
  // ==========================================================

  useEffect(() => {

    mountedRef.current = true;


    async function initializePedometer() {

      try {

        setLoading(true);
        setError(null);


        // ======================================================
        // CHECK PERMISSION
        // ======================================================

        let permission =
          await Pedometer.getPermissionsAsync();


        if (!mountedRef.current) {
          return;
        }


        // Request permission when necessary.

        if (!permission.granted) {

          permission =
            await Pedometer.requestPermissionsAsync();
        }


        if (!mountedRef.current) {
          return;
        }


        if (!permission.granted) {

          setPermissionGranted(false);
          setIsAvailable(false);

          setError(
            "Motion access is required to count steps."
          );

          return;
        }


        setPermissionGranted(true);


        // ======================================================
        // CHECK SENSOR AVAILABILITY
        // ======================================================

        const available =
          await Pedometer.isAvailableAsync();


        if (!mountedRef.current) {
          return;
        }


        setIsAvailable(available);


        if (!available) {

          setError(
            "Pedometer is not available on this device."
          );

          return;
        }


        // ======================================================
        // LIVE STEP SUBSCRIPTION
        // ======================================================

        subscriptionRef.current =
          Pedometer.watchStepCount(
            (result) => {

              if (!mountedRef.current) {
                return;
              }


              const liveSteps =
                Math.max(
                  0,
                  Number(
                    result?.steps || 0
                  )
                );


              setSteps(liveSteps);
            }
          );


      } catch (err) {

        console.log(
          "Legathon pedometer error:",
          err
        );


        if (mountedRef.current) {

          setIsAvailable(false);

          setError(
            err?.message ||
              "Unable to start the step counter."
          );
        }

      } finally {

        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }


    initializePedometer();


    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {

      mountedRef.current = false;


      if (
        subscriptionRef.current
      ) {

        subscriptionRef.current.remove();

        subscriptionRef.current =
          null;
      }
    };

  }, []);


  // ==========================================================
  // BASIC LIVE DISTANCE
  // ==========================================================

  const miles =
    steps / STEPS_PER_MILE;


  // ==========================================================
  // RESET LOCAL LIVE COUNTER
  // ==========================================================
  //
  // NOTE:
  // This resets Legathon's displayed live value.
  // It does NOT reset the phone's hardware pedometer.
  //
  // ==========================================================

  const resetSteps = () => {

    setSteps(0);
  };


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    steps,

    miles:
      Number(
        miles.toFixed(2)
      ),

    isAvailable,

    permissionGranted,

    loading,

    error,

    resetSteps,
  };
}