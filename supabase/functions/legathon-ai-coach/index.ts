import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

function jsonResponse(
  body: unknown,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
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

function safeNumber(
  value: unknown,
  fallback = 0
) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed.",
      },
      405
    );
  }

  try {
    const apiKey =
      Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return jsonResponse(
        {
          error:
            "OPENAI_API_KEY is not configured.",
        },
        500
      );
    }

    const body = await request
      .json()
      .catch(() => ({}));

    const message = String(
      body?.message || ""
    ).trim();

    if (!message) {
      return jsonResponse(
        {
          error:
            "A message is required.",
        },
        400
      );
    }

    if (message.length > 2000) {
      return jsonResponse(
        {
          error:
            "The message is too long.",
        },
        400
      );
    }

    const wellness =
      body?.wellness &&
      typeof body.wellness === "object"
        ? body.wellness
        : {};

    const coachMemory =
      body?.coachMemory &&
      typeof body.coachMemory ===
        "object"
        ? body.coachMemory
        : {};

    const history =
      Array.isArray(body?.history)
        ? body.history.slice(-12)
        : [];

    const steps =
      safeNumber(
        wellness?.steps,
        0
      );

    const stepGoal =
      safeNumber(
        wellness?.stepGoal,
        7000
      );

    const hydration =
      safeNumber(
        wellness?.hydration,
        0
      );

    const hydrationGoal =
      safeNumber(
        wellness?.hydrationGoal,
        100
      );

    const journey =
      String(
        wellness?.journey || ""
      );

    const journeyProgress =
      safeNumber(
        wellness?.journeyProgress,
        0
      );

    const checkpoint =
      String(
        wellness?.checkpoint || ""
      );

    const recovery =
      wellness?.recovery ?? null;

    const sleepHours =
      wellness?.sleepHours ?? null;

    const systemPrompt = `
You are the Legathon AI Wellness Coach inside a walking and wellness application.

PERSONALITY:
- Warm, natural, encouraging, and conversational.
- Supportive without sounding robotic.
- Clear and concise.
- Usually answer in two to five short sentences.
- Address the user's actual question directly.
- Do not use markdown headings or excessive bullet points.
- Do not claim to be a doctor.

CURRENT WELLNESS INFORMATION:
- Steps today: ${steps}
- Daily step goal: ${stepGoal}
- Hydration: ${hydration}
- Hydration goal: ${hydrationGoal}
- Recovery score: ${recovery ?? "not recorded"}
- Sleep hours: ${sleepHours ?? "not recorded"}
- Active journey: ${journey || "none"}
- Journey progress: ${journeyProgress}%
- Current checkpoint: ${checkpoint || "not recorded"}

COACH MEMORY:
- Preferred walking time: ${
      coachMemory?.preferredWalkTime ||
      "not recorded"
    }
- Meal preference: ${
      coachMemory?.mealPreference ||
      "not recorded"
    }
- Favorite breathing exercise: ${
      coachMemory?.favoriteBreathing ||
      "not recorded"
    }

SAFETY:
- Give general wellness information only.
- Do not diagnose medical conditions.
- Do not recommend prescription medication changes.
- For chest pain, severe breathing difficulty, fainting, signs of stroke, or another possible emergency, tell the user to stop exercising and contact emergency services.
- For persistent or concerning symptoms, recommend speaking with a qualified healthcare professional.
- Do not shame the user about weight, fitness, food, or progress.
`;

    const conversation = history
      .filter(
        (item: {
          sender?: unknown;
          text?: unknown;
        }) =>
          typeof item?.text ===
            "string" &&
          item.text.trim()
      )
      .map(
        (item: {
          sender?: unknown;
          text?: unknown;
        }) => ({
          role:
            item.sender === "coach"
              ? "assistant"
              : "user",

          content: String(
            item.text
          ).slice(0, 2000),
        })
      );

    conversation.push({
      role: "user",
      content: message,
    });

    const openAIResponse =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: "gpt-4o",
            temperature: 0.7,
            max_tokens: 350,

            messages: [
              {
                role: "system",
                content: systemPrompt,
              },

              ...conversation,
            ],
          }),
        }
      );

    if (!openAIResponse.ok) {
      const details =
        await openAIResponse.text();

      console.error(
        "OpenAI coach error:",
        openAIResponse.status,
        details
      );

      return jsonResponse(
        {
          error:
            "Unable to prepare the coach response.",
        },
        502
      );
    }

    const result =
      await openAIResponse.json();

    const reply =
      result?.choices?.[0]?.message
        ?.content;

    if (
      typeof reply !== "string" ||
      !reply.trim()
    ) {
      return jsonResponse(
        {
          error:
            "The AI Coach returned no response.",
        },
        502
      );
    }

    return jsonResponse({
      reply: reply.trim(),
    });
  } catch (error) {
    console.error(
      "Unexpected AI coach error:",
      error
    );

    return jsonResponse(
      {
        error:
          "Unexpected AI Coach error.",
      },
      500
    );
  }
});