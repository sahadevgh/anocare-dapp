import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful, privacy-respecting AI health assistant called Anocare. Keep responses clear, kind, and supportive.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, message: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, response: data.choices[0].message.content });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
