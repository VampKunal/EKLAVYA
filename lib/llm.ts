"use server"

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY!,
  baseURL: process.env.LLM_BASE_URL!,
});

interface BaseLLMOptions {
  prompt: string;
  model?: string;
}

export async function getLLMResponse({
  prompt,
  model = 'gemini-1.5-flash',
}: BaseLLMOptions): Promise<string> {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim() || '';
}
