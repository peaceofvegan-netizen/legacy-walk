import { useState } from "react";
import { useAudioPlayer } from "expo-audio";

const SOUND_FILES = {
  Rain: require("../assets/sounds/rain.mp3"),
  Ocean: require("../assets/sounds/ocean.mp3"),
  Forest: require("../assets/sounds/forest.mp3"),
  Night: require("../assets/sounds/night.mp3"),
};

export function useAmbientAudio() {
  const player = useAudioPlayer(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);

  async function playSound(mode) {
    try {
      const source = SOUND_FILES[mode];

      if (!source) {
        console.log("Unknown ambient audio mode:", mode);
        return;
      }

      player.pause();

      try {
        await player.seekTo(0);
      } catch (error) {
        // Ignore seek errors when no previous source is loaded.
      }

      player.replace(source);

      player.loop = true;
      player.volume = 0.65;

      player.play();

      setCurrentMode(mode);
      setIsPlaying(true);
    } catch (error) {
      console.log("Audio play error:", error);
    }
  }

  async function stopSound() {
    try {
      player.pause();

      try {
        await player.seekTo(0);
      } catch (error) {
        // Ignore if the player has not loaded a source yet.
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

  return {
    isPlaying,
    currentMode,
    playSound,
    stopSound,
    toggleSound,
  };
}