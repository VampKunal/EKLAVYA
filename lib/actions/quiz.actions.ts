'use server';

import { getLLMResponse } from "@/lib/llm";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizQuestionOption[];
  correctOptionId: string;
  explanation?: string;
}

export async function generateQuizForCompanion(companion: Companion, numQuestions = 6): Promise<QuizQuestion[]> {
  const prompt = `Generate a JSON array of ${numQuestions} multiple-choice quiz questions for the following study context.
  Each element must be an object with keys: id (string, unique), question (string), options (array of {id: string, text: string}), correctOptionId (string, must match an option id), explanation (string concise why correct is correct).

  IMPORTANT RULES:
  - Output ONLY valid JSON (no markdown, no backticks, no prose around it).
  - Keep questions focused on the subject and topic.
  - Options should be plausible; avoid giveaways like 'All of the above'.
  - Difficulty: mixed from easy to medium.

  Subject: ${companion.subject}
  Topic: ${companion.topic}
  Style: ${'assessment'}
  Name: ${companion.name}
  `;

  const raw = await getLLMResponse({ prompt });

  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Quiz JSON is not an array');
    return data as QuizQuestion[];
  } catch (e) {
    // Fallback: attempt to sanitize common issues
    const trimmed = raw.trim().replace(/^```json|^```|```$/g, '');
    const data = JSON.parse(trimmed);
    if (!Array.isArray(data)) throw new Error('Quiz JSON is not an array');
    return data as QuizQuestion[];
  }
}

export interface QuizMistakeRecord {
  questionId: string;
  question: string;
  selectedOptionId: string;
  correctOptionId: string;
}

export async function recordQuizAttempt(params: {
  companionId: string;
  score: number;
  total: number;
  mistakes: QuizMistakeRecord[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      companion_id: params.companionId,
      score: params.score,
      total: params.total,
      mistakes: params.mistakes,
    })
    .select();

  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function getUserQuizAttempts(limit = 10) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data;
}


