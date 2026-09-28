// services/revenuecat.js

import {
  Platform,
} from "react-native";

import Purchases from
  "react-native-purchases";

import {
  supabase,
} from "../lib/supabase";


// ============================================================
// LEGATHON WALK — REVENUECAT SERVICE
// ============================================================


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
// REVENUECAT PUBLIC SDK KEYS
//
// These are PUBLIC RevenueCat SDK keys.
// They are allowed in the mobile app.
//
// Never put a RevenueCat secret API key here.
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


let configuredUserId =
  null;


// ============================================================
// GET PLATFORM API KEY
// ============================================================

function getRevenueCatApiKey() {

  if (
    Platform.OS ===
    "ios"
  ) {

    return IOS_KEY;
  }


  if (
    Platform.OS ===
    "android"
  ) {

    return ANDROID_KEY;
  }


  return null;
}


// ============================================================
// GET CURRENT SUPABASE USER
// ============================================================

async function getCurrentSupabaseUser() {

  try {

    const {
      data,
      error,
    } =
      await supabase
        .auth
        .getUser();


    if (
      error
    ) {

      console.log(
        "Supabase user lookup error:",
        error
      );


      return null;
    }


    return (
      data?.user ||
      null
    );

  } catch (
    error
  ) {

    console.log(
      "Supabase user lookup error:",
      error
    );


    return null;
  }
}


// ============================================================
// GET LEGATHON USER ID
//
// RevenueCat App User ID = Supabase auth UUID.
//
// This connects:
//
// Supabase user
//       ↓
// RevenueCat customer
//       ↓
// Premium / Elite entitlement
//
// ============================================================

export async function getLegathonRevenueCatUserId() {

  const user =
    await getCurrentSupabaseUser();


  if (
    !user?.id
  ) {

    return null;
  }


  return String(
    user.id
  );
}


// ============================================================
// READ PLAN FROM CUSTOMER INFO
// ============================================================

export function getPlanFromCustomerInfo(
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
// GET ACTIVE ENTITLEMENT
// ============================================================

function getActiveEntitlement(
  customerInfo,
  plan
) {

  if (
    plan ===
    "elite"
  ) {

    return (
      customerInfo
        ?.entitlements
        ?.active
        ?.[
          ENTITLEMENTS.ELITE
        ] ||
      null
    );
  }


  if (
    plan ===
    "premium"
  ) {

    return (
      customerInfo
        ?.entitlements
        ?.active
        ?.[
          ENTITLEMENTS.PREMIUM
        ] ||
      null
    );
  }


  return null;
}


// ============================================================
// CONFIGURE REVENUECAT
// ============================================================
//
// RevenueCat should normally be configured once.
//
// If a Supabase user is signed in, that UUID becomes
// the RevenueCat App User ID.
//
// ============================================================

export async function configureRevenueCat(
  suppliedUserId = null
) {

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


  // ----------------------------------------------------------
  // REMOVE OLD SHARED USER
  //
  // Older Legathon checkout code used:
  //
  // configureRevenueCat("legathon-user")
  //
  // Never allow that shared ID again.
  // ----------------------------------------------------------

  let desiredUserId =
    suppliedUserId;


  if (
    desiredUserId ===
    "legathon-user"
  ) {

    console.warn(
      'Ignoring legacy shared RevenueCat ID "legathon-user".'
    );


    desiredUserId =
      null;
  }


  if (
    !desiredUserId
  ) {

    desiredUserId =
      await getLegathonRevenueCatUserId();
  }


  if (
    desiredUserId
  ) {

    desiredUserId =
      String(
        desiredUserId
      );
  }


  // ==========================================================
  // FIRST CONFIGURATION
  // ==========================================================

  if (
    !configured
  ) {

    const config = {
      apiKey,
    };


    if (
      desiredUserId
    ) {

      config.appUserID =
        desiredUserId;
    }


    Purchases.configure(
      config
    );


    configured =
      true;


    configuredUserId =
      desiredUserId ||
      null;


    console.log(
      "RevenueCat configured",
      configuredUserId
        ? `for user ${configuredUserId}`
        : "anonymously"
    );


    return true;
  }


  // ==========================================================
  // SDK ALREADY CONFIGURED
  //
  // If user signs in after anonymous configuration,
  // identify them using RevenueCat logIn().
  // ==========================================================

  if (
    desiredUserId &&
    configuredUserId !==
      desiredUserId
  ) {

    const loginResult =
      await Purchases
        .logIn(
          desiredUserId
        );


    configuredUserId =
      desiredUserId;


    console.log(
      "RevenueCat user identified:",
      desiredUserId
    );


    return (
      loginResult
        ?.customerInfo ||
      true
    );
  }


  return true;
}


// ============================================================
// ENSURE CONFIGURED
// ============================================================

async function ensureRevenueCatConfigured() {

  await configureRevenueCat();
}


// ============================================================
// SECURE SUPABASE MEMBERSHIP SYNC
//
// IMPORTANT:
//
// The phone does NOT tell Supabase:
// "I am premium."
//
// Instead, this calls a server Edge Function.
//
// The Edge Function will independently ask RevenueCat
// for the user's real entitlement status.
//
// ============================================================

export async function syncRevenueCatMembership() {

  try {

    const user =
      await getCurrentSupabaseUser();


    if (
      !user?.id
    ) {

      console.log(
        "RevenueCat membership sync skipped: user is not signed in."
      );


      return {
        synced:
          false,

        plan:
          "free",

        reason:
          "not-authenticated",
      };
    }


    const {
      data,
      error,
    } =
      await supabase
        .functions
        .invoke(
          "sync-revenuecat-membership",
          {
            body: {},
          }
        );


    if (
      error
    ) {

      console.log(
        "RevenueCat membership sync error:",
        error
      );


      return {
        synced:
          false,

        reason:
          "sync-error",

        error,
      };
    }


    console.log(
      "RevenueCat membership synced:",
      data
    );


    return (
      data || {
        synced:
          false,
      }
    );

  } catch (
    error
  ) {

    console.log(
      "RevenueCat membership sync error:",
      error
    );


    return {
      synced:
        false,

      reason:
        "sync-error",

      error,
    };
  }
}


// ============================================================
// GET CURRENT REVENUECAT PLAN
// ============================================================

export async function getRevenueCatPlan() {

  await ensureRevenueCatConfigured();


  const customerInfo =
    await Purchases
      .getCustomerInfo();


  const plan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  return plan;
}


// ============================================================
// GET FULL MEMBERSHIP STATUS
// ============================================================

export async function getRevenueCatMembershipStatus() {

  await ensureRevenueCatConfigured();


  const customerInfo =
    await Purchases
      .getCustomerInfo();


  const plan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  const entitlement =
    getActiveEntitlement(
      customerInfo,
      plan
    );


  return {

    plan,

    active:
      plan !==
      "free",

    expirationDate:
      entitlement
        ?.expirationDate ||
      null,

    willRenew:
      entitlement
        ?.willRenew ??
      false,

    productIdentifier:
      entitlement
        ?.productIdentifier ||
      null,

    customerInfo,

  };
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
    offerings
      ?.current ||
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


  const plan =
    getPlanFromCustomerInfo(
      result
        ?.customerInfo
    );


  // ----------------------------------------------------------
  // IMPORTANT:
  //
  // Purchase already succeeded in the App Store / Play Store.
  //
  // If Supabase sync temporarily fails, do NOT throw another
  // purchase error that could make the customer pay twice.
  // ----------------------------------------------------------

  if (
    plan ===
      "premium" ||
    plan ===
      "elite"
  ) {

    await syncRevenueCatMembership();
  }


  return plan;
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


  // ----------------------------------------------------------
  // Synchronize restored subscription with Supabase.
  // ----------------------------------------------------------

  await syncRevenueCatMembership();


  return restoredPlan;
}


// ============================================================
// REFRESH CUSTOMER INFO + SERVER MEMBERSHIP
// ============================================================

export async function refreshRevenueCatMembership() {

  await ensureRevenueCatConfigured();


  const customerInfo =
    await Purchases
      .getCustomerInfo();


  const plan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  const serverSync =
    await syncRevenueCatMembership();


  return {

    plan,

    customerInfo,

    serverSync,

  };
}


// ============================================================
// REVENUECAT LOGOUT
//
// Call this when a Legathon account signs out.
//
// RevenueCat will return to an anonymous customer.
// ============================================================

export async function logoutRevenueCatUser() {

  if (
    !configured
  ) {

    configuredUserId =
      null;

    return true;
  }


  try {

    await Purchases
      .logOut();


    configuredUserId =
      null;


    console.log(
      "RevenueCat user logged out."
    );


    return true;

  } catch (
    error
  ) {

    console.log(
      "RevenueCat logout error:",
      error
    );


    return false;
  }
}