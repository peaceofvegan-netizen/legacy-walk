import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
import { useState } from "react";
import { useAudioPlayer } from "expo-audio";

const SOUND_FILES = {
  Rain: require("../assets/sounds/rain.mp3"),
  Ocean: require("../assets/sounds/ocean.mp3"),
  Forest: require("../assets/sounds/forest.mp3"),
  Night: require("../assets/sounds/night.mp3"),
};

export function useAmbientAudio() {
  const _accountSession = captureAccountSession();

  const player = useAudioPlayer(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);

  async function playSound(mode) {
  try {
    _accountSession.assertCurrent();

    try {
      const source = SOUND_FILES[mode];

      if (!source) {
        console.log("Unknown ambient audio mode:", mode);
        return;
      }

      player.pause();

      try {
        await _accountSession.run(async () => (player.seekTo(0)));
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        // Ignore seek errors when no previous source is loaded.
      }

      player.replace(source);

      player.loop = true;
      player.volume = 0.65;

      player.play();

      setCurrentMode(mode);
      setIsPlaying(true);
    } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

      console.log("Audio play error:", error);
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

  async function stopSound() {
  try {
    _accountSession.assertCurrent();

    try {
      player.pause();

      try {
        await _accountSession.run(async () => (player.seekTo(0)));
      } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

        // Ignore if the player has not loaded a source yet.
      }

      setIsPlaying(false);
      setCurrentMode(null);
    } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

      console.log("Audio stop error:", error);
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

  async function toggleSound(mode) {
  try {
    _accountSession.assertCurrent();

    if (isPlaying && currentMode === mode) {
      await _accountSession.run(async () => (stopSound()));
    } else {
      await _accountSession.run(async () => (playSound(mode)));
    }
  
  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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