import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import { supabase } from "../lib/supabase";

let activePlayer = null;
let activeStatusSubscription = null;
let playbackGeneration = 0;

const audioCache = new Map();

function cleanText(text) {
  return String(text || "")
    .replace(/\*/g, "")
    .replace(/[#_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function releaseActivePlayer() {
  if (activeStatusSubscription) {
    activeStatusSubscription.remove();
    activeStatusSubscription = null;
  }

  if (!activePlayer) {
    return;
  }

  try {
    activePlayer.pause();
    activePlayer.release();
  } catch (error) {
    console.log("Coach voice stop error:", error);
  } finally {
    activePlayer = null;
  }
}

export function stopCoachVoice() {
  playbackGeneration += 1;
  releaseActivePlayer();
}

export function pauseCoachVoice() {
  if (!activePlayer) {
    return false;
  }

  activePlayer.pause();
  return true;
}

export function resumeCoachVoice() {
  if (!activePlayer) {
    return false;
  }

  activePlayer.play();
  return true;
}

async function getAudioFile(text) {
  const cachedFile = audioCache.get(text);

  if (cachedFile) {
    const fileInformation =
      await FileSystem.getInfoAsync(cachedFile);

    if (fileInformation.exists) {
      return cachedFile;
    }

    audioCache.delete(text);
  }

  const { data, error } =
    await supabase.functions.invoke(
      "coach-voice",
      {
        body: {
          text,
        },
      }
    );

  if (error) {
    throw new Error(
      error.message ||
        "Coach voice request failed."
    );
  }

  if (!data?.audioBase64) {
    throw new Error(
      data?.error ||
        "Coach voice returned no audio."
    );
  }

  const fileUri =
    `${FileSystem.cacheDirectory}` +
    `legathon-coach-${Date.now()}.mp3`;

  await FileSystem.writeAsStringAsync(
    fileUri,
    data.audioBase64,
    {
      encoding:
        FileSystem.EncodingType.Base64,
    }
  );

  audioCache.set(text, fileUri);

  return fileUri;
}

export async function speakCoachVoice(
  text,
  options = {}
) {
  const naturalText = cleanText(text);

  if (!naturalText) {
    return null;
  }

  stopCoachVoice();

  const currentGeneration =
    playbackGeneration;

  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: "doNotMix",
  });

  const fileUri =
    await getAudioFile(naturalText);

  if (
    currentGeneration !== playbackGeneration
  ) {
    return null;
  }

  const player =
    createAudioPlayer(fileUri);

 player.volume = 1;

  activePlayer = player;

  activeStatusSubscription =
    player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (activePlayer !== player) {
          return;
        }

        if (
          typeof options.onStatus ===
          "function"
        ) {
          options.onStatus(status);
        }

        if (status?.error) {
          const playbackError =
            new Error(status.error);

          releaseActivePlayer();

          if (
            typeof options.onError ===
            "function"
          ) {
            options.onError(
              playbackError
            );
          }

          return;
        }

        if (status?.didJustFinish) {
          releaseActivePlayer();

          if (
            typeof options.onDone ===
            "function"
          ) {
            options.onDone();
          }
        }
      }
    );

  player.play();

  return player;
}