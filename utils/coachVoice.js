import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import { supabase } from "../lib/supabase";

let activePlayer = null;
const audioCache = new Map();

function cleanText(text) {
  return String(text || "")
    .replace(/\*/g, "")
    .replace(/[#_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function stopCoachVoice() {
  if (!activePlayer) return;

  try {
    activePlayer.pause();
    activePlayer.release();
  } catch (error) {
    console.log(
      "Coach voice stop error:",
      error
    );
  } finally {
    activePlayer = null;
  }
}

async function getAudioFile(text) {
  const cachedFile =
    audioCache.get(text);

  if (cachedFile) {
    const info =
      await FileSystem.getInfoAsync(
        cachedFile
      );

    if (info.exists) {
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
  text
) {
  const naturalText = cleanText(text);

  if (!naturalText) return;

  stopCoachVoice();

  await setAudioModeAsync({
    playsInSilentMode: true,
  });

  const fileUri =
    await getAudioFile(naturalText);

  const player =
    createAudioPlayer(fileUri);

  player.volume = 1;

  activePlayer = player;

  player.play();
}