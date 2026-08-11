import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();

  return token.data;
}

export async function scheduleDailyWalkReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to Walk",
      body: "Your Legacy Walk journey is waiting. Take a few steps today.",
      sound: true,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleReflectionReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reflect on Your Journey",
      body: "Take a moment to write how today’s walk made you feel.",
      sound: true,
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
}

export async function notifyJourneyComplete(journeyTitle) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Journey Complete",
      body: `You completed ${journeyTitle}. Your legacy is growing.`,
      sound: true,
    },
    trigger: null,
  });
}

export async function notifyRewardUnlocked(rewardTitle) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reward Eligibility Unlocked",
      body: `${rewardTitle} is now available for review.`,
      sound: true,
    },
    trigger: null,
  });
}