import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export const ENTITLEMENTS = {
  PREMIUM: "premium",
  LEGENDARY: "legendary",
};

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

let configured = false;

export async function configureRevenueCat(userId) {
  if (configured || !userId) return;

  const apiKey = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;

  if (!apiKey) {
    console.log("Missing RevenueCat API key");
    return;
  }

  Purchases.configure({
    apiKey,
    appUserID: userId,
  });

  configured = true;
}

export async function getRevenueCatPlan() {
  const customerInfo = await Purchases.getCustomerInfo();

  if (customerInfo.entitlements.active[ENTITLEMENTS.LEGENDARY]) {
    return "legendary";
  }

  if (customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM]) {
    return "premium";
  }

  return "free";
}

export async function loadOfferings() {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function buyPackage(packageToBuy) {
  const { customerInfo } = await Purchases.purchasePackage(packageToBuy);

  if (customerInfo.entitlements.active[ENTITLEMENTS.LEGENDARY]) {
    return "legendary";
  }

  if (customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM]) {
    return "premium";
  }

  return "free";
}

export async function restoreRevenueCatPurchases() {
  const customerInfo = await Purchases.restorePurchases();

  if (customerInfo.entitlements.active[ENTITLEMENTS.LEGENDARY]) {
    return "legendary";
  }

  if (customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM]) {
    return "premium";
  }

  return "free";
}