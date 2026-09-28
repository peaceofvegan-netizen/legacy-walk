import {
  supabase,
} from "../lib/supabase";


// ============================================================
// CREDIT VERIFIED WALKING TO JOINED COMMUNITY CHALLENGES
// ============================================================

export async function creditCommunityChallengeSteps(
  stepDelta = 0
) {
  const steps =
    Math.max(
      0,
      Math.floor(
        Number(stepDelta) || 0
      )
    );


  if (!steps) {
    return {
      credited: false,
      steps: 0,
      reason: "zero-steps",
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


    const user =
      userData?.user;


    // Walking still counts normally if the user is not signed in.
    // It simply cannot be added to a shared challenge.
    if (!user) {
      return {
        credited: false,
        steps: 0,
        reason: "not-authenticated",
      };
    }


    const {
      error,
    } =
      await supabase.rpc(
        "credit_my_community_challenges",
        {
          p_steps: steps,
        }
      );


    if (error) {
      throw error;
    }


    return {
      credited: true,
      steps,
    };

  } catch (error) {

    console.log(
      "Community challenge step credit error:",
      error
    );


    return {
      credited: false,
      steps: 0,
      error,
    };
  }
}
export async function claimCommunityChallengeReward(
  challengeId
) {
  if (!challengeId) {
    return {
      claimed: false,
      rewardWCoins: 0,
      newBalance: null,
      reason: "missing-challenge-id",
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
        claimed: false,
        rewardWCoins: 0,
        newBalance: null,
        reason: "not-authenticated",
      };
    }

    const {
      data,
      error,
    } =
      await supabase.rpc(
        "claim_my_community_challenge",
        {
          p_challenge_id:
            challengeId,
        }
      );

    if (error) {
      throw error;
    }

    const result =
      Array.isArray(data)
        ? data[0]
        : data;

    return {
      claimed:
        result?.claimed === true,

      rewardWCoins:
        Number(
          result?.reward_wcoins ||
          0
        ),

      newBalance:
        result?.new_balance ===
          null ||
        result?.new_balance ===
          undefined
          ? null
          : Number(
              result.new_balance
            ),

      reason:
        result?.reason ||
        null,
    };

  } catch (error) {
    console.log(
      "Community challenge claim error:",
      error
    );

    return {
      claimed: false,
      rewardWCoins: 0,
      newBalance: null,
      reason: "claim-error",
      error,
    };
  }
}