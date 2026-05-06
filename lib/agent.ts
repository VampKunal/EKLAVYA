"use server";

import { getLLMResponse } from "./llm";

export async function getTutorResponse(
  userInput: string,
  config: CompanionConfig,
  conversationHistory: CompanionMessage[]
): Promise<string> {
  if (!config) throw new Error('No configuration set');

  const systemPrompt = `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

        Tutor Guidelines:
        - Stick to the given topic: "${config.topic}" and subject: "${config.subject}" and teach the student about it.
        - Keep the conversation flowing smoothly while maintaining control.
        - From time to time make sure that the student is following you and understands you.
        - Break down the topic into smaller parts and teach the student one part at a time.
        - Keep your style of conversation "${config.style}".
        - Keep your responses short, like in a real voice conversation.
        - Do not include any special characters in your responses - this is a voice conversation.
        - Maximum response length should be 2-3 sentences for natural conversation flow.
        - The student may communicate via voice or text - respond naturally to both.`;

        const conversationContext = conversationHistory
            .slice(-10)
            .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
            .join('\n');

        const fullPrompt = `${systemPrompt}
        Previous conversation:
        ${conversationContext}

        Current student message: ${userInput}
        Respond as the tutor:`;

  return await getLLMResponse({ prompt: fullPrompt });
}
