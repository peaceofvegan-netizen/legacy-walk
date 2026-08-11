import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

export async function exportAvatarProfile(cardRef) {
  try {
    const permission =
      await MediaLibrary.requestPermissionsAsync();

    if (!permission.granted) {
      return {
        success: false,
        message: "Media permission denied",
      };
    }

    const uri = await captureRef(cardRef, {
      format: "png",
      quality: 1,
    });

    await MediaLibrary.saveToLibraryAsync(uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }

    return {
      success: true,
      uri,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Export failed",
    };
  }
}