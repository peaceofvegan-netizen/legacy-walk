import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";
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
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();


  try {

    const {
      data,
      error,
    } =
      await _accountSession.run(async () => (supabase
        .auth
        .getUser()));


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
    if (isAccountSessionEnded(error)) throw error;


    console.log(
      "Supabase user lookup error:",
      error
    );


    return null;
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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
  const _accountSession2 = captureAccountSession();

  try {
    _accountSession2.assertCurrent();


  const user =
    await _accountSession2.run(async () => (getCurrentSupabaseUser()));


  if (
    !user?.id
  ) {

    return null;
  }


  return String(
    user.id
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession3 = captureAccountSession();

  try {
    _accountSession3.assertCurrent();


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
      await _accountSession3.run(async () => (getLegathonRevenueCatUserId()));
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
      await _accountSession3.run(async () => (Purchases
        .logIn(
          desiredUserId
        )));


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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// ENSURE CONFIGURED
// ============================================================

async function ensureRevenueCatConfigured() {
  const _accountSession4 = captureAccountSession();

  try {
    _accountSession4.assertCurrent();


  await _accountSession4.run(async () => (configureRevenueCat()));

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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
  const _accountSession5 = captureAccountSession();

  try {
    _accountSession5.assertCurrent();


  try {

    const user =
      await _accountSession5.run(async () => (getCurrentSupabaseUser()));


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
      await _accountSession5.run(async () => (supabase
        .functions
        .invoke(
          "sync-revenuecat-membership",
          {
            body: {},
          }
        )));


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
    if (isAccountSessionEnded(error)) throw error;


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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// GET CURRENT REVENUECAT PLAN
// ============================================================

export async function getRevenueCatPlan() {
  const _accountSession6 = captureAccountSession();

  try {
    _accountSession6.assertCurrent();


  await _accountSession6.run(async () => (ensureRevenueCatConfigured()));


  const customerInfo =
    await _accountSession6.run(async () => (Purchases
      .getCustomerInfo()));


  const plan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  return plan;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// GET FULL MEMBERSHIP STATUS
// ============================================================

export async function getRevenueCatMembershipStatus() {
  const _accountSession7 = captureAccountSession();

  try {
    _accountSession7.assertCurrent();


  await _accountSession7.run(async () => (ensureRevenueCatConfigured()));


  const customerInfo =
    await _accountSession7.run(async () => (Purchases
      .getCustomerInfo()));


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

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// LOAD CURRENT OFFERING
// ============================================================

export async function loadOfferings() {
  const _accountSession8 = captureAccountSession();

  try {
    _accountSession8.assertCurrent();


  await _accountSession8.run(async () => (ensureRevenueCatConfigured()));


  const offerings =
    await _accountSession8.run(async () => (Purchases
      .getOfferings()));


  return (
    offerings
      ?.current ||
    null
  );

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// PURCHASE PACKAGE
// ============================================================

export async function buyPackage(
  packageToBuy
) {
  const _accountSession9 = captureAccountSession();

  try {
    _accountSession9.assertCurrent();


  await _accountSession9.run(async () => (ensureRevenueCatConfigured()));


  if (
    !packageToBuy
  ) {

    throw new Error(
      "RevenueCat package is missing."
    );
  }


  const result =
    await _accountSession9.run(async () => (Purchases
      .purchasePackage(
        packageToBuy
      )));


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

    await _accountSession9.run(async () => (syncRevenueCatMembership()));
  }


  return plan;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// RESTORE PURCHASES
// ============================================================

export async function restoreRevenueCatPurchases() {
  const _accountSession0 = captureAccountSession();

  try {
    _accountSession0.assertCurrent();


  await _accountSession0.run(async () => (ensureRevenueCatConfigured()));


  console.log(
    "Restoring RevenueCat purchases..."
  );


  const customerInfo =
    await _accountSession0.run(async () => (Purchases
      .restorePurchases()));


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

  await _accountSession0.run(async () => (syncRevenueCatMembership()));


  return restoredPlan;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}


// ============================================================
// REFRESH CUSTOMER INFO + SERVER MEMBERSHIP
// ============================================================

export async function refreshRevenueCatMembership() {
  const _accountSession1 = captureAccountSession();

  try {
    _accountSession1.assertCurrent();


  await _accountSession1.run(async () => (ensureRevenueCatConfigured()));


  const customerInfo =
    await _accountSession1.run(async () => (Purchases
      .getCustomerInfo()));


  const plan =
    getPlanFromCustomerInfo(
      customerInfo
    );


  const serverSync =
    await _accountSession1.run(async () => (syncRevenueCatMembership()));


  return {

    plan,

    customerInfo,

    serverSync,

  };

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
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