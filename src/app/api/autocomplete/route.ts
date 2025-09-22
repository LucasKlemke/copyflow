// Or your chosen provider
import { NextRequest, NextResponse } from "next/server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // Or your chosen model
      prompt: `You are an intelligent autocomplete engine for Portuguese text. Your job is to CONTINUE the text from where it ends, not replace it.

Given this partial text: "${prompt}"

Rules:
1. Only provide the CONTINUATION from where the text ends
2. Do NOT repeat any part of the input text
3. Continue naturally in Portuguese
4. Keep it concise (1-5 words maximum)
5. If the text ends mid-word, complete just that word
6. If the text ends with a complete word, suggest the next logical words

Continue from here:`,
      maxTokens: 15, // Reduced for shorter continuations
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
