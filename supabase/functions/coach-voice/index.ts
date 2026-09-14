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

function bytesToBase64(
  bytes: Uint8Array
) {
  const chunkSize = 0x8000;
  let binary = "";

  for (
    let index = 0;
    index < bytes.length;
    index += chunkSize
  ) {
    const chunk = bytes.subarray(
      index,
      index + chunkSize
    );

    binary += String.fromCharCode(
      ...chunk
    );
  }

  return btoa(binary);
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

    const text = String(
      body?.text || ""
    )
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      return jsonResponse(
        {
          error:
            "Voice text is required.",
        },
        400
      );
    }

    if (text.length > 3500) {
      return jsonResponse(
        {
          error:
            "Voice text is too long.",
        },
        400
      );
    }

    const openAIResponse =
      await fetch(
        "https://api.openai.com/v1/audio/speech",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            model:
              "gpt-4o-mini-tts",

            voice: "marin",

            input: text,

            instructions:
              "Speak like a warm, calm, encouraging human wellness coach. Use natural pacing, gentle emphasis, short pauses, and a confident conversational tone. Never sound like an announcer or a robot.",

            response_format: "mp3",

            speed: 1.02,
          }),
        }
      );

    if (!openAIResponse.ok) {
      const details =
        await openAIResponse.text();

      console.error(
        "OpenAI voice error:",
        openAIResponse.status,
        details
      );

      return jsonResponse(
        {
          error:
            "Unable to generate the coach voice.",
        },
        502
      );
    }

    const audioBytes =
      new Uint8Array(
        await openAIResponse.arrayBuffer()
      );

    return jsonResponse({
      audioBase64:
        bytesToBase64(audioBytes),

      mimeType: "audio/mpeg",
    });
  } catch (error) {
    console.error(
      "Unexpected coach voice error:",
      error
    );

    return jsonResponse(
      {
        error:
          "Unexpected voice generation error.",
      },
      500
    );
  }
});