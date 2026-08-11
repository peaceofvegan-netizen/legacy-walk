import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

const SOUND_FILES = {
  Rain: require("../assets/sounds/rain.mp3"),
  Ocean: require("../assets/sounds/ocean.mp3"),
  Forest: require("../assets/sounds/forest.mp3"),
  Night: require("../assets/sounds/night.mp3"),
};

export function useAmbientAudio() {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);

  async function playSound(mode) {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        SOUND_FILES[mode],
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.65,
        }
      );

      soundRef.current = sound;
      setCurrentMode(mode);
      setIsPlaying(true);
    } catch (error) {
      console.log("Audio play error:", error);
    }
  }

  async function stopSound() {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setIsPlaying(false);
      setCurrentMode(null);
    } catch (error) {
      console.log("Audio stop error:", error);
    }
  }

  async function toggleSound(mode) {
    if (isPlaying && currentMode === mode) {
      await stopSound();
    } else {
      await playSound(mode);
    }
  }

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return {
    isPlaying,
    currentMode,
    playSound,
    stopSound,
    toggleSound,
  };
}