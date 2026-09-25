// services/revenuecat.js

import {
  Platform,
} from "react-native";

import Purchases from
  "react-native-purchases";


// ============================================================
// ENTITLEMENTS
// ============================================================

export const ENTITLEMENTS = {

  PREMIUM:
    "premium",

  ELITE:
    "elite",

};


// ============================================================
// REVENUECAT API KEYS
// ============================================================

const IOS_KEY =
  process.env
    .EXPO_PUBLIC_REVENUECAT_IOS_KEY;


const ANDROID_KEY =
  process.env
    .EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;


// ============================================================
// CONFIGURATION STATE
// ============================================================

let configured =
  false;


// ============================================================
// GET PLATFORM API KEY
// ============================================================

function getRevenueCatApiKey() {

  return (
    Platform.OS ===
    "ios"
      ? IOS_KEY
      : ANDROID_KEY
  );
}


// ============================================================
// READ PLAN FROM CUSTOMER INFO
// ============================================================

function getPlanFromCustomerInfo(
  customerInfo
) {

  const active =
    customerInfo
      ?.entitlements
      ?.active ||
    {};


  if (
    active[
      ENTITLEMENTS.ELITE
    ]
  ) {

    return "elite";
  }


  if (
    active[
      ENTITLEMENTS.PREMIUM
    ]
  ) {

    return "premium";
  }


  return "free";
}


// ============================================================
// CONFIGURE REVENUECAT
// ============================================================
//
// userId is OPTIONAL.
//
// If no userId is supplied,
// RevenueCat uses its anonymous App User ID.
//
// This is safer than giving every customer
// the same hard-coded ID.
//
// ============================================================

export async function configureRevenueCat(
  userId = null
) {

  if (
    configured
  ) {

    return true;
  }


  const apiKey =
    getRevenueCatApiKey();


  if (
    !apiKey
  ) {

    console.log(
      "Missing RevenueCat API key"
    );


    throw new Error(
      "RevenueCat API key is missing."
    );
  }


  const config = {
    apiKey,
  };


  if (
    userId
  ) {

    config.appUserID =
      String(
        userId
      );
  }


  Purchases.configure(
    config
  );


  configured =
    true;


  console.log(
    "RevenueCat configured",
    userId
      ? "with user ID"
      : "anonymously"
  );


  return true;
}


// ============================================================
// ENSURE CONFIGURED
// ============================================================

async function ensureRevenueCatConfigured() {

  if (
    configured
  ) {

    return;
  }


  await configureRevenueCat();
}


// ============================================================
// GET CURRENT REVENUECAT PLAN
// ============================================================

export async function getRevenueCatPlan() {

  await ensureRevenueCatConfigured();


  const customerInfo =
    await Purchases
      .getCustomerInfo();


  return getPlanFromCustomerInfo(
    customerInfo
  );
}


// ============================================================
// LOAD CURRENT OFFERING
// ============================================================

export async function loadOfferings() {

  await ensureRevenueCatConfigured();


  const offerings =
    await Purchases
      .getOfferings();


  return (
    offerings?.current ||
    null
  );
}


// ============================================================
// PURCHASE PACKAGE
// ============================================================

export async function buyPackage(
  packageToBuy
) {

  await ensureRevenueCatConfigured();


  if (
    !packageToBuy
  ) {

    throw new Error(
      "RevenueCat package is missing."
    );
  }


  const result =
    await Purchases
      .purchasePackage(
        packageToBuy
      );


  return getPlanFromCustomerInfo(
    result?.customerInfo
  );
}


// ============================================================
// RESTORE PURCHASES
// ============================================================

export async function restoreRevenueCatPurchases() {

  await ensureRevenueCatConfigured();


  console.log(
    "Restoring RevenueCat purchases..."
  );


  const customerInfo =
    await Purchases
      .restorePurchases();


  const restoredPlan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  console.log(
    "RevenueCat restored plan:",
    restoredPlan
  );


  return restoredPlan;
}