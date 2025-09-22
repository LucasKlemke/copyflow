// Or your chosen provider
import { NextRequest, NextResponse } from "next/server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // Or your chosen model
      prompt: `You are an intelligent autocomplete engine. Given a partial word or phrase, return a smart suggestion that completes it meaningfully. Suggest a single, concise completion for: "${prompt}"`,
      maxTokens: 20, // Limit the length of the suggestion
    });

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error("Error generating autocomplete:", error);
    return NextResponse.json(
      { error: "Failed to generate autocomplete" },
      { status: 500 }
    );
  }
}
