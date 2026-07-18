"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import type { WordResult } from "@/lib/ai/schema";

export interface QuizQuestion {
  wordId: string;
  word: string;
  correctDefinition: string;
  options: string[];
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function getQuizQuestions(count = 8) {
  const user = await requireLocalUser();
  const words = await prisma.savedWord.findMany({ where: { userId: user.id } });

  if (words.length < 4) {
    return {
      ok: false as const,
      error: "Save at least 4 words to unlock quiz mode.",
      questions: [] as QuizQuestion[],
    };
  }

  const pool = words.map((w) => ({
    id: w.id,
    word: w.word,
    definition: (w.data as unknown as WordResult).definition,
  }));

  const selected = shuffled(pool).slice(0, Math.min(count, pool.length));

  const questions: QuizQuestion[] = selected.map((item) => {
    const distractors = shuffled(pool.filter((p) => p.id !== item.id))
      .slice(0, 3)
      .map((d) => d.definition);
    return {
      wordId: item.id,
      word: item.word,
      correctDefinition: item.definition,
      options: shuffled([item.definition, ...distractors]),
    };
  });

  return { ok: true as const, error: null, questions };
}
