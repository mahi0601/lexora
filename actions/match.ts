"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import type { WordResult } from "@/lib/ai/schema";

export interface MatchPair {
  id: string;
  word: string;
  definition: string;
}

export async function getMatchWords(count = 6) {
  const user = await requireLocalUser();
  const words = await prisma.savedWord.findMany({ where: { userId: user.id } });

  if (words.length < 4) {
    return {
      ok: false as const,
      error: "Save at least 4 words to unlock the matching game.",
      pairs: [] as MatchPair[],
    };
  }

  const selected = [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, words.length));

  return {
    ok: true as const,
    error: null,
    pairs: selected.map((w) => ({
      id: w.id,
      word: w.word,
      definition: (w.data as unknown as WordResult).definition,
    })),
  };
}
