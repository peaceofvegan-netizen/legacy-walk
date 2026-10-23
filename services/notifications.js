import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
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
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  if (!Device.isDevice) {
    console.log("Push notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } =
    await _accountSession.run(async () => (Notifications.getPermissionsAsync()));

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await _accountSession.run(async () => (Notifications.requestPermissionsAsync()));

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await _accountSession.run(async () => (Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    })));
  }

  const token = await _accountSession.run(async () => (Notifications.getExpoPushTokenAsync()));

  return token.data;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function scheduleDailyWalkReminder() {
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();

  await _accountSession2.run(async () => (Notifications.cancelAllScheduledNotificationsAsync()));

  await _accountSession2.run(async () => (Notifications.scheduleNotificationAsync({
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
  })));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function scheduleReflectionReminder() {
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();

  await _accountSession3.run(async () => (Notifications.scheduleNotificationAsync({
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
  })));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function notifyJourneyComplete(journeyTitle) {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();

  await _accountSession4.run(async () => (Notifications.scheduleNotificationAsync({
    content: {
      title: "Journey Complete",
      body: `You completed ${journeyTitle}. Your legacy is growing.`,
      sound: true,
    },
    trigger: null,
  })));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function notifyRewardUnlocked(rewardTitle) {
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();

  await _accountSession5.run(async () => (Notifications.scheduleNotificationAsync({
    content: {
      title: "Reward Eligibility Unlocked",
      body: `${rewardTitle} is now available for review.`,
      sound: true,
    },
    trigger: null,
  })));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}