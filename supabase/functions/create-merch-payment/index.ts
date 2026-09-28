// ============================================================
// LEGATHON WALK
// CREATE MERCHANDISE STRIPE PAYMENT
// ============================================================

import Stripe from "npm:stripe@^22";

import {
  createClient,
} from "npm:@supabase/supabase-js@2";


// ============================================================
// CORS
// ============================================================

const corsHeaders = {

  "Access-Control-Allow-Origin":
    "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",

};


// ============================================================
// JSON RESPONSE
// ============================================================

function jsonResponse(
  body: unknown,
  status = 200
) {

  return new Response(

    JSON.stringify(
      body
    ),

    {
      status,

      headers: {

        ...corsHeaders,

        "Content-Type":
          "application/json",

      },
    }
  );
}


// ============================================================
// READ NEW OR LEGACY SUPABASE KEYS
// ============================================================

function getNamedKey(
  envName: string
) {

  try {

    const raw =
      Deno.env.get(
        envName
      );


    if (
      !raw
    ) {

      return "";
    }


    const parsed =
      JSON.parse(
        raw
      );


    if (
      parsed?.default
    ) {

      return String(
        parsed.default
      );
    }


    const values =
      Object.values(
        parsed || {}
      );


    if (
      values.length >
      0
    ) {

      return String(
        values[0]
      );
    }


    return "";

  } catch {

    return "";
  }
}


// ============================================================
// SAFE NON-NEGATIVE INTEGER
// ============================================================

function safeInteger(
  value: unknown
) {

  const number =
    Number(
      value
    );


  if (
    !Number.isFinite(
      number
    )
  ) {

    return 0;
  }


  return Math.max(
    0,
    Math.floor(
      number
    )
  );
}


// ============================================================
// SAFE STRING
// ============================================================

function safeString(
  value: unknown
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";
  }


  return String(
    value
  ).trim();
}


// ============================================================
// ENVIRONMENT
// ============================================================

const SUPABASE_URL =
  Deno.env.get(
    "SUPABASE_URL"
  ) || "";


const SUPABASE_PUBLISHABLE_KEY =

  Deno.env.get(
    "SUPABASE_PUBLISHABLE_KEY"
  ) ||

  Deno.env.get(
    "SUPABASE_ANON_KEY"
  ) ||

  getNamedKey(
    "SUPABASE_PUBLISHABLE_KEYS"
  );


const SUPABASE_SECRET_KEY =

  Deno.env.get(
    "SUPABASE_SECRET_KEY"
  ) ||

  Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY"
  ) ||

  getNamedKey(
    "SUPABASE_SECRET_KEYS"
  );


const STRIPE_SECRET_KEY =
  Deno.env.get(
    "STRIPE_SECRET_KEY"
  ) || "";


// ============================================================
// STRIPE
// ============================================================

const stripe =

  STRIPE_SECRET_KEY

    ? new Stripe(
        STRIPE_SECRET_KEY
      )

    : null;


// ============================================================
// MAIN FUNCTION
// ============================================================

Deno.serve(
  async (
    req
  ) => {

    // ========================================================
    // PREFLIGHT
    // ========================================================

    if (
      req.method ===
      "OPTIONS"
    ) {

      return new Response(
        "ok",
        {
          headers:
            corsHeaders,
        }
      );
    }


    if (
      req.method !==
      "POST"
    ) {

      return jsonResponse(
        {
          success:
            false,

          message:
            "Method not allowed.",
        },

        405
      );
    }


    // ========================================================
    // CHECK SERVER CONFIGURATION
    // ========================================================

    if (
      !SUPABASE_URL ||
      !SUPABASE_PUBLISHABLE_KEY
    ) {

      console.error(
        "Missing Supabase Edge Function environment variables."
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Server configuration error.",
        },

        500
      );
    }


    if (
      !SUPABASE_SECRET_KEY
    ) {

      console.error(
        "Missing Supabase server secret key."
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Server configuration error.",
        },

        500
      );
    }


    if (
      !stripe
    ) {

      console.error(
        "Missing STRIPE_SECRET_KEY."
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Stripe is not configured.",
        },

        500
      );
    }


    // ========================================================
    // AUTHORIZATION HEADER
    // ========================================================

    const authHeader =
      req.headers.get(
        "Authorization"
      );


    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {

      return jsonResponse(
        {
          success:
            false,

          message:
            "Authentication required.",
        },

        401
      );
    }


    const accessToken =
      authHeader
        .replace(
          "Bearer ",
          ""
        )
        .trim();


    // ========================================================
    // USER SUPABASE CLIENT
    //
    // Uses customer's JWT.
    // auth.uid() inside RPCs becomes this user.
    // ========================================================

    const userSupabase =
      createClient(

        SUPABASE_URL,

        SUPABASE_PUBLISHABLE_KEY,

        {
          global: {

            headers: {

              Authorization:
                authHeader,

            },
          },

          auth: {

            persistSession:
              false,

            autoRefreshToken:
              false,

          },
        }
      );


    // ========================================================
    // VERIFY USER
    // ========================================================

    const {
      data:
        userData,

      error:
        userError,

    } =
      await userSupabase
        .auth
        .getUser(
          accessToken
        );


    if (
      userError ||
      !userData?.user
    ) {

      console.error(
        "AUTH ERROR:",
        userError
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Your login session is no longer valid.",
        },

        401
      );
    }


    const user =
      userData.user;


    // ========================================================
    // ADMIN SUPABASE CLIENT
    //
    // Never return this key to the app.
    // ========================================================

    const adminSupabase =
      createClient(

        SUPABASE_URL,

        SUPABASE_SECRET_KEY,

        {
          auth: {

            persistSession:
              false,

            autoRefreshToken:
              false,

          },
        }
      );


    // ========================================================
    // READ BODY
    // ========================================================

    let body:
      Record<
        string,
        unknown
      >;


    try {

      body =
        await req.json();

    } catch {

      return jsonResponse(
        {
          success:
            false,

          message:
            "Invalid request body.",
        },

        400
      );
    }


    // ========================================================
    // ITEM
    // ========================================================

    const itemId =
      safeString(
        body?.itemId
      );


    const useWCoins =
      body?.useWCoins ===
      true;


    const requestedWCoins =

      useWCoins

        ? safeInteger(
            body?.requestedWCoins
          )

        : 0;


    // ========================================================
    // PRODUCT OPTIONS
    // ========================================================

    const selectedColor =

      body?.selectedColor ===
        null ||

      body?.selectedColor ===
        undefined

        ? null

        : safeString(
            body.selectedColor
          ) || null;


    const selectedSize =

      body?.selectedSize ===
        null ||

      body?.selectedSize ===
        undefined

        ? null

        : safeString(
            body.selectedSize
          ) || null;


    // ========================================================
    // SHIPPING ADDRESS
    // ========================================================

    const shippingObject =

      body?.shipping &&
      typeof body.shipping ===
        "object" &&
      !Array.isArray(
        body.shipping
      )

        ? body.shipping as
            Record<
              string,
              unknown
            >

        : {};


    const shippingName =
      safeString(
        shippingObject?.name
      );


    const shippingPhone =
      safeString(
        shippingObject?.phone
      );


    const shippingLine1 =
      safeString(
        shippingObject?.line1
      );


    const shippingLine2 =
      safeString(
        shippingObject?.line2
      );


    const shippingCity =
      safeString(
        shippingObject?.city
      );


    const shippingState =
      safeString(
        shippingObject?.state
      );


    const shippingPostalCode =
      safeString(
        shippingObject?.postalCode
      );


    const shippingCountryRaw =
      safeString(
        shippingObject?.country
      );


    const shippingCountry =

      shippingCountryRaw
        .toLowerCase() ===
        "united states"

        ? "US"

        : shippingCountryRaw
            .toUpperCase();


    // ========================================================
    // VALIDATE ITEM ID
    // ========================================================

    if (
      !itemId
    ) {

      return jsonResponse(
        {
          success:
            false,

          message:
            "Missing merchandise item ID.",
        },

        400
      );
    }


    // ========================================================
    // VALIDATE SHIPPING ADDRESS
    // ========================================================

    if (
      !shippingName ||
      !shippingLine1 ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode ||
      !shippingCountry
    ) {

      return jsonResponse(
        {
          success:
            false,

          message:
            "A complete shipping address is required.",
        },

        400
      );
    }


    // ========================================================
    // CURRENTLY U.S. SHIPPING ONLY
    // ========================================================

    if (
      shippingCountry !==
      "US"
    ) {

      return jsonResponse(
        {
          success:
            false,

          message:
            "Legathon merchandise checkout currently supports U.S. shipping addresses only.",
        },

        400
      );
    }


    // ========================================================
    // PREPARE ORDER
    //
    // THIS RPC:
    //
    // • loads official product price
    // • checks server membership
    // • checks WCoin balance
    // • calculates discounts
    // • reserves WCoins
    // • creates pending order
    //
    // Phone price is NOT trusted.
    // ========================================================

    const {
      data:
        orderData,

      error:
        orderError,

    } =
      await userSupabase
        .rpc(
          "prepare_merch_order",
          {

            p_item_id:
              itemId,

            p_requested_wcoins:
              requestedWCoins,

            p_selected_color:
              selectedColor,

            p_selected_size:
              selectedSize,

          }
        );


    if (
      orderError
    ) {

      console.error(
        "PREPARE ORDER ERROR:",
        orderError
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            orderError.message ||
            "Unable to prepare merchandise order.",
        },

        400
      );
    }


    const order =

      Array.isArray(
        orderData
      )

        ? orderData[0]

        : orderData;


    if (
      !order?.order_id
    ) {

      console.error(
        "INVALID ORDER RESPONSE:",
        orderData
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "The merchandise order could not be created.",
        },

        500
      );
    }


    // ========================================================
    // ORDER ID
    // ========================================================

    const orderId =
      Number(
        order.order_id
      );


    if (
      !Number.isFinite(
        orderId
      ) ||
      orderId <=
        0
    ) {

      console.error(
        "INVALID ORDER ID:",
        order.order_id
      );


      return jsonResponse(
        {
          success:
            false,

          message:
            "The merchandise order returned an invalid order ID.",
        },

        500
      );
    }


    // ========================================================
    // ORDER NUMBER
    // ========================================================

    const orderNumber =
      String(
        order.order_number ||
        `LW-${orderId}`
      );


    // ========================================================
    // TOTAL
    // ========================================================

    const total =
      Number(
        order.total ||
        0
      );


    const amountCents =
      Math.round(
        total *
        100
      );


    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (
      !Number.isFinite(
        amountCents
      ) ||
      amountCents <=
        0
    ) {

      console.error(
        "INVALID PAYMENT AMOUNT:",
        {
          orderId,
          total,
          amountCents,
        }
      );


      await userSupabase
        .rpc(
          "cancel_merch_order_reservation",
          {

            p_order_id:
              orderId,

            p_reason:
              "invalid-payment-amount",

          }
        );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Invalid merchandise payment amount.",
        },

        400
      );
    }


    // ========================================================
    // SAVE SHIPPING ADDRESS TO ORDER
    // ========================================================

    const {
      error:
        shippingSaveError,
    } =
      await adminSupabase
        .from(
          "store_orders"
        )
        .update(
          {

            shipping_name:
              shippingName,

            shipping_phone:
              shippingPhone ||
              null,

            shipping_line1:
              shippingLine1,

            shipping_line2:
              shippingLine2 ||
              null,

            shipping_city:
              shippingCity,

            shipping_state:
              shippingState,

            shipping_postal_code:
              shippingPostalCode,

            shipping_country:
              shippingCountry,

            fulfillment_status:
              "unfulfilled",

            updated_at:
              new Date()
                .toISOString(),

          }
        )
        .eq(
          "id",
          orderId
        )
        .eq(
          "user_id",
          user.id
        );


    if (
      shippingSaveError
    ) {

      console.error(
        "SAVE SHIPPING ERROR:",
        shippingSaveError
      );


      const {
        error:
          refundError,
      } =
        await userSupabase
          .rpc(
            "cancel_merch_order_reservation",
            {

              p_order_id:
                orderId,

              p_reason:
                "shipping-save-failed",

            }
          );


      if (
        refundError
      ) {

        console.error(
          "SHIPPING FAILURE REFUND ERROR:",
          refundError
        );
      }


      return jsonResponse(
        {
          success:
            false,

          message:
            "Unable to save the shipping address.",
        },

        500
      );
    }


    // ========================================================
    // RECORD WCOIN RESERVATION IN TRANSACTION HISTORY
    // ========================================================

    const reservedWCoins =
      Math.max(

        0,

        Math.floor(

          Number(
            order.wcoins_reserved ||
            0
          )
        )
      );


    if (
      reservedWCoins >
      0
    ) {

      const {
        error:
          ledgerError,
      } =
        await adminSupabase
          .from(
            "wcoin_transactions"
          )
          .upsert(
            {

              user_id:
                user.id,

              amount:
                -reservedWCoins,

              transaction_type:
                "reservation",

              source_type:
                "merch_order_reservation",

              source_id:
                String(
                  orderId
                ),

            },

            {
              onConflict:
                "user_id,source_type,source_id",

              ignoreDuplicates:
                true,
            }
          );


      if (
        ledgerError
      ) {

        console.error(
          "WCOIN LEDGER ERROR:",
          ledgerError
        );


        await userSupabase
          .rpc(
            "cancel_merch_order_reservation",
            {

              p_order_id:
                orderId,

              p_reason:
                "ledger-error",

            }
          );


        return jsonResponse(
          {
            success:
              false,

            message:
              "Unable to reserve W Coins for this order.",
          },

          500
        );
      }
    }


    // ========================================================
    // CREATE STRIPE PAYMENT INTENT
    // ========================================================

    let paymentIntent:
      Stripe.PaymentIntent;


    try {

      paymentIntent =
        await stripe
          .paymentIntents
          .create(
            {

              amount:
                amountCents,

              currency:
                "usd",

              automatic_payment_methods: {

                enabled:
                  true,

              },

              description:
                `Legathon Walk merchandise order ${orderNumber}`,


              // =================================================
              // SHIPPING ADDRESS SENT TO STRIPE
              // =================================================

              shipping: {

                name:
                  shippingName,

                phone:
                  shippingPhone ||
                  undefined,

                address: {

                  line1:
                    shippingLine1,

                  line2:
                    shippingLine2 ||
                    undefined,

                  city:
                    shippingCity,

                  state:
                    shippingState,

                  postal_code:
                    shippingPostalCode,

                  country:
                    "US",

                },
              },


              // =================================================
              // ORDER METADATA
              // =================================================

              metadata: {

                legathon_order_id:
                  String(
                    orderId
                  ),

                legathon_order_number:
                  orderNumber,

                legathon_user_id:
                  user.id,

                legathon_item_id:
                  itemId,

              },

            },

            {
              idempotencyKey:
                `legathon-merch-${orderId}`,
            }
          );

    } catch (
      stripeError
    ) {

      console.error(
        "STRIPE CREATE ERROR:",
        stripeError
      );


      // ======================================================
      // REFUND RESERVED WCOINS
      // ======================================================

      const {
        error:
          refundError,
      } =
        await userSupabase
          .rpc(
            "cancel_merch_order_reservation",
            {

              p_order_id:
                orderId,

              p_reason:
                "stripe-create-failed",

            }
          );


      if (
        refundError
      ) {

        console.error(
          "RESERVATION REFUND ERROR:",
          refundError
        );
      }


      return jsonResponse(
        {
          success:
            false,

          message:
            "Stripe could not start the payment. No completed purchase was recorded.",
        },

        502
      );
    }


    // ========================================================
    // PAYMENT INTENT MUST HAVE CLIENT SECRET
    // ========================================================

    if (
      !paymentIntent
        ?.client_secret
    ) {

      console.error(
        "STRIPE PAYMENT INTENT HAS NO CLIENT SECRET:",
        paymentIntent?.id
      );


      try {

        await stripe
          .paymentIntents
          .cancel(
            paymentIntent.id
          );

      } catch (
        cancelStripeError
      ) {

        console.error(
          "STRIPE CANCEL ERROR:",
          cancelStripeError
        );
      }


      await userSupabase
        .rpc(
          "cancel_merch_order_reservation",
          {

            p_order_id:
              orderId,

            p_reason:
              "missing-client-secret",

          }
        );


      return jsonResponse(
        {
          success:
            false,

          message:
            "Stripe did not return a usable payment session.",
        },

        502
      );
    }


    // ========================================================
    // SAVE PAYMENT INTENT TO ORDER
    // ========================================================

    const {
      error:
        saveIntentError,
    } =
      await adminSupabase
        .from(
          "store_orders"
        )
        .update(
          {

            stripe_payment_intent_id:
              paymentIntent.id,

            stripe_payment_status:
              paymentIntent.status,

            status:
              "awaiting_payment",

            updated_at:
              new Date()
                .toISOString(),

          }
        )
        .eq(
          "id",
          orderId
        )
        .eq(
          "user_id",
          user.id
        );


    if (
      saveIntentError
    ) {

      console.error(
        "SAVE PAYMENT INTENT ERROR:",
        saveIntentError
      );


      // ======================================================
      // CLIENT HAS NOT RECEIVED SECRET YET.
      // CANCEL STRIPE INTENT.
      // ======================================================

      try {

        await stripe
          .paymentIntents
          .cancel(
            paymentIntent.id
          );

      } catch (
        cancelStripeError
      ) {

        console.error(
          "STRIPE CANCEL ERROR:",
          cancelStripeError
        );
      }


      // ======================================================
      // RETURN RESERVED WCOINS
      // ======================================================

      const {
        error:
          refundError,
      } =
        await userSupabase
          .rpc(
            "cancel_merch_order_reservation",
            {

              p_order_id:
                orderId,

              p_reason:
                "order-save-failed",

            }
          );


      if (
        refundError
      ) {

        console.error(
          "WCOIN REFUND ERROR:",
          refundError
        );
      }


      return jsonResponse(
        {
          success:
            false,

          message:
            "The secure payment could not be prepared.",
        },

        500
      );
    }


    // ========================================================
    // SUCCESS
    //
    // STRIPE SECRET KEY NEVER LEAVES THIS FUNCTION.
    // ========================================================

    return jsonResponse(
      {

        success:
          true,

        paymentIntentClientSecret:
          paymentIntent.client_secret,

        paymentIntentId:
          paymentIntent.id,

        orderId,

        orderNumber,

        itemTitle:
          order.item_title,

        membershipPlan:
          order.membership_plan,

        itemPrice:
          Number(
            order.cash_price ||
            0
          ),

        membershipDiscount:
          Number(
            order.membership_discount ||
            0
          ),

        wcoinsReserved:
          reservedWCoins,

        wcoinDiscount:
          Number(
            order.wcoin_discount ||
            0
          ),

        shipping:
          Number(
            order.shipping ||
            0
          ),

        total,

      },

      200
    );
  }
);