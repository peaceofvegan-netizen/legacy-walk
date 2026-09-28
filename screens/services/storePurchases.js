import {
  supabase,
} from "../lib/supabase";

import {
  syncServerWCoinBalance,
} from "../utils/wcoinStorage";


// ============================================================
// LEGATHON WALK
// SECURE STORE PURCHASE SERVICE
// ============================================================

export async function purchaseStoreItem(
  itemId
) {

  if (!itemId) {
    return {
      purchased: false,
      reason:
        "missing-item-id",
    };
  }


  try {

    const {
      data: userData,
      error: userError,
    } =
      await supabase.auth.getUser();


    if (userError) {
      throw userError;
    }


    if (!userData?.user) {
      return {
        purchased: false,
        reason:
          "not-authenticated",
      };
    }


    const {
      data,
      error,
    } =
      await supabase.rpc(
        "purchase_store_item",
        {
          p_item_id:
            itemId,
        }
      );


    if (error) {
      throw error;
    }


    const result =
      Array.isArray(data)
        ? data[0]
        : data;


    if (!result) {
      return {
        purchased: false,
        reason:
          "empty-response",
      };
    }


    const newBalance =
      result.new_balance ===
        null ||
      result.new_balance ===
        undefined
        ? null
        : Number(
            result.new_balance
          );


    if (
      Number.isFinite(
        newBalance
      )
    ) {
      await syncServerWCoinBalance(
        newBalance
      );
    }


    return {
      purchased:
        result.purchased === true,

      orderId:
        result.order_id ??
        null,

      itemTitle:
        result.item_title ??
        null,

      wcoinCost:
        Number(
          result.wcoin_cost ||
          0
        ),

      newBalance,

      reason:
        result.reason ||
        null,
    };

  } catch (error) {

    console.log(
      "Secure store purchase error:",
      error
    );


    return {
      purchased: false,
      reason:
        "purchase-error",
      error,
    };
  }
}