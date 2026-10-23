import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

export async function exportAvatarProfile(cardRef) {
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  try {
    const permission =
      await _accountSession.run(async () => (MediaLibrary.requestPermissionsAsync()));

    if (!permission.granted) {
      return {
        success: false,
        message: "Media permission denied",
      };
    }

    const uri = await _accountSession.run(async () => (captureRef(cardRef, {
      format: "png",
      quality: 1,
    })));

    await _accountSession.run(async () => (MediaLibrary.saveToLibraryAsync(uri)));

    if (await _accountSession.run(async () => (Sharing.isAvailableAsync()))) {
      await _accountSession.run(async () => (Sharing.shareAsync(uri)));
    }

    return {
      success: true,
      uri,
    };
  } catch (error) {
    if (isAccountSessionEnded(error)) throw error;

    console.log(error);

    return {
      success: false,
      message: "Export failed",
    };
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}