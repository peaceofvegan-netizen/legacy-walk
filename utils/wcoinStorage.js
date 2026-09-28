import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  supabase,
} from "../lib/supabase";


// ============================================================
// LEGATHON WALK
// WCOIN STORAGE
//
// Supabase = source of truth
// AsyncStorage = local display/offline cache only
// ============================================================


export const WCOIN_KEY =
  "wCoinBalance";

const USER_CACHE_PREFIX =
  "LEGATHON_WCOIN_CACHE:";


// ============================================================
// HELPERS
// ============================================================

function normalizeBalance(
  value
) {
  const amount =
    Number(value);

  if (
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return 0;
  }

  return Math.floor(
    amount
  );
}


function getUserCacheKey(
  userId
) {
  return (
    USER_CACHE_PREFIX +
    String(userId || "")
  );
}


// ============================================================
// WRITE LOCAL CACHE
// ============================================================

export async function cacheWCoins(
  balance,
  userId = null
) {
  const normalized =
    normalizeBalance(
      balance
    );


  const writes = [
    AsyncStorage.setItem(
      WCOIN_KEY,
      String(normalized)
    ),
  ];


  if (userId) {
    writes.push(
      AsyncStorage.setItem(
        getUserCacheKey(
          userId
        ),
        String(normalized)
      )
    );
  }


  await Promise.all(
    writes
  );


  return normalized;
}


// ============================================================
// READ USER-SPECIFIC CACHE
// ============================================================

async function readUserCache(
  userId
) {
  if (!userId) {
    return 0;
  }


  try {

    const saved =
      await AsyncStorage.getItem(
        getUserCacheKey(
          userId
        )
      );


    if (
      saved === null
    ) {
      return 0;
    }


    return normalizeBalance(
      saved
    );

  } catch (error) {

    console.log(
      "WCoin cache read error:",
      error
    );

    return 0;
  }
}


// ============================================================
// CURRENT USER
// ============================================================

async function getCurrentUser() {

  // getSession reads the locally stored Supabase session first.
  // This lets us identify the correct user's cache even if
  // the network is temporarily unavailable.

  const {
    data: sessionData,
    error: sessionError,
  } =
    await supabase.auth.getSession();


  if (sessionError) {

    console.log(
      "WCoin session error:",
      sessionError
    );
  }


  const sessionUser =
    sessionData
      ?.session
      ?.user;


  if (sessionUser) {
    return sessionUser;
  }


  try {

    const {
      data,
      error,
    } =
      await supabase.auth.getUser();


    if (error) {
      return null;
    }


    return (
      data?.user ||
      null
    );

  } catch (error) {

    console.log(
      "WCoin user lookup error:",
      error
    );

    return null;
  }
}


// ============================================================
// GET WCOINS
//
// This is the main function used by:
// - WCoin Wallet
// - Leaderboard
// - Rewards
// - other balance displays
// ============================================================

export async function getWCoins() {

  const user =
    await getCurrentUser();


  // Do NOT show a previous user's generic cached balance
  // when nobody is signed in.

  if (!user?.id) {

    await AsyncStorage.setItem(
      WCOIN_KEY,
      "0"
    );

    return 0;
  }


  try {

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "wcoin_wallets"
        )
        .select(
          "balance"
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();


    if (error) {
      throw error;
    }


    // No wallet row yet means this user currently has 0 WCoins.

    const balance =
      data
        ? normalizeBalance(
            data.balance
          )
        : 0;


    await cacheWCoins(
      balance,
      user.id
    );


    return balance;

  } catch (error) {

    console.log(
      "WCoin server refresh failed. Using user cache:",
      error
    );


    // Network unavailable:
    // show the last server-confirmed balance for THIS user only.

    const cached =
      await readUserCache(
        user.id
      );


    await AsyncStorage.setItem(
      WCOIN_KEY,
      String(cached)
    );


    return cached;
  }
}


// ============================================================
// FORCE REFRESH
//
// Same server-authoritative behavior as getWCoins.
// Kept as a separate name for screens/services that want
// explicit refresh semantics.
// ============================================================

export async function refreshWCoins() {
  return getWCoins();
}


// ============================================================
// SYNC A SERVER-RETURNED BALANCE
//
// Use this after a secure Supabase RPC returns new_balance.
// This does NOT calculate or add rewards locally.
// ============================================================

export async function syncServerWCoinBalance(
  balance
) {
  const normalized =
    normalizeBalance(
      balance
    );


  const user =
    await getCurrentUser();


  if (!user?.id) {
    return normalized;
  }


  await cacheWCoins(
    normalized,
    user.id
  );


  return normalized;
}


// ============================================================
// GET CACHED BALANCE ONLY
//
// UI fallback only.
// Never use this to determine rewards or purchases.
// ============================================================

export async function getCachedWCoins() {

  const user =
    await getCurrentUser();


  if (!user?.id) {
    return 0;
  }


  return readUserCache(
    user.id
  );
}


// ============================================================
// LEGACY ADDWCOINS EXPORT
//
// Direct client-side WCoin creation is intentionally disabled.
//
// Journey rewards:
// claim_my_journey_reward
//
// Community challenge rewards:
// claim_my_community_challenge
//
// Other reward types should receive their own secure RPC.
// ============================================================

export async function addWCoins(
  amount
) {
  console.warn(
    "addWCoins() blocked. WCoins must be awarded by a secure Supabase reward function.",
    amount
  );


  throw new Error(
    "Direct WCoin awards are disabled. Use an approved Legathon reward claim."
  );
}


// ============================================================
// LEGACY SPEND EXPORT
//
// We are intentionally NOT allowing the phone to directly
// change the secure wallet balance.
//
// Store spending will be connected to a secure Supabase
// transaction in the next step.
// ============================================================

export async function spendWCoins(
  amount
) {
  console.warn(
    "spendWCoins() blocked until secure server spending is connected.",
    amount
  );


  throw new Error(
    "Secure WCoin spending has not been connected yet."
  );
}


// ============================================================
// CLEAR LOCAL CACHE
//
// Useful at logout.
// Does not alter the Supabase wallet.
// ============================================================

export async function clearWCoinCache() {

  try {

    const user =
      await getCurrentUser();


    const keys = [
      WCOIN_KEY,
    ];


    if (user?.id) {
      keys.push(
        getUserCacheKey(
          user.id
        )
      );
    }


    await AsyncStorage.multiRemove(
      keys
    );


    return true;

  } catch (error) {

    console.log(
      "Clear WCoin cache error:",
      error
    );

    return false;
  }
}