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
    const body = await request.json();
    const wellnessData = body.wellnessData || {};
    
    const { sleep, energy, mood, stress, nutrition, symptoms } = wellnessData;

    const prompt = `The user just logged their wellness data:
- Sleep: ${sleep}/10
- Energy: ${energy}/10
- Mood: ${mood}/10
- Stress: ${stress}/10
- Nutrition: ${nutrition}/10
- Symptoms: ${symptoms}

Based on this specific data, give a warm, personalized 2-3 sentence response that:
1. Acknowledges their specific situation (reference their sleep, mood, stress levels, or symptoms by name)
2. If they're doing well (most scores 7+), celebrate that and suggest maintaining it
3. If they're struggling (any score under 5), offer one specific, actionable suggestion based on what they reported
4. Be conversational and human, not clinical

Never give medical advice. Be specific to their data, not generic.`;

    console.log("Sending prompt to Gemini:", prompt);

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

    console.log("Gemini response status:", response.status);

    if (!response.ok) {
      console.log("API error, returning fallback");
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

    console.log("Gemini JSON response:", json);

    const message =
      json.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Thanks for checking in today. Keep noticing how your body and energy shift through the day.";

    console.log("Final message:", message);

    return NextResponse.json({ message });
  } catch (error) {
    console.log("Error caught:", error);
    return NextResponse.json(
      {
        message:
          "Thanks for checking in today. Keep noticing how your body and energy shift through the day.",
      },
      { status: 200 }
    );
  }
}
