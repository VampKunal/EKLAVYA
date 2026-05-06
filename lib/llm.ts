"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY!);

interface BaseLLMOptions {
  prompt: string;
  model?: string;
}

/**
 * Simple delay function for backoff
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLLMResponse({
  prompt,
  model = 'gemini-3-flash-preview',
}: BaseLLMOptions): Promise<string> {
  let lastError: any;

  // Manual retry loop for 429s (Rate Limits)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const generativeModel = genAI.getGenerativeModel({ model });

      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error: any) {
      lastError = error;

      // Handle rate limits (429)
      if (error?.status === 429 || error?.message?.includes('429')) {
        console.warn(`Rate limit hit (429). Retrying in ${Math.pow(2, attempt) * 1000}ms...`);
        await delay(Math.pow(2, attempt) * 1000);
        continue;
      }

      // Handle other errors (like 404 if model name is wrong)
      console.error("LLM Error:", error);
      throw error;
    }
  }

  throw lastError;
}
