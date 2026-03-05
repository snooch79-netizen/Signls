import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "AI responses are temporarily unavailable." },
      { status: 200 }
    );
  }

  try {
    const body = (await request.json()) as {
      wellnessData?: unknown;
    };

    const dataForPrompt =
      typeof body.wellnessData === "object" && body.wellnessData !== null
        ? JSON.stringify(body.wellnessData)
        : "No structured data provided.";

    const prompt = `
The user just logged their wellness data: ${dataForPrompt}.

Give a warm, friendly, insightful 2–3 sentence response that acknowledges their entry and suggests one small thing to pay attention to. Be conversational, not clinical. Never give medical advice.
    `.trim();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "Thanks for checking in today. Keep noticing how your body and energy shift through the day.",
        },
        { status: 200 }
      );
    }

    const json = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const message =
      json.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Thanks for checking in today. Keep noticing how your body and energy shift through the day.";

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json(
      {
        message:
          "Thanks for checking in today. Keep noticing how your body and energy shift through the day.",
      },
      { status: 200 }
    );
  }
}

