"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { generateWordOfDay } from "@/lib/ai";
import type { WordResult } from "@/lib/ai/schema";

function todayUtcDateOnly(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

export async function getWordOfDay(): Promise<WordResult> {
  const date = todayUtcDateOnly();

  const existing = await prisma.wordOfDay.findUnique({ where: { date } });
  if (existing) {
    return existing.data as unknown as WordResult;
  }

  const result = await generateWordOfDay(date.toISOString().slice(0, 10));

  try {
    const created = await prisma.wordOfDay.create({
      data: { date, word: result.word, data: result },
    });
    return created.data as unknown as WordResult;
  } catch (err) {
    // Two requests raced at the day boundary — the loser hits the @unique
    // constraint (P2002). Re-read so both converge on the winner's word
    // instead of generating (and storing) two different words for one day.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const winner = await prisma.wordOfDay.findUnique({ where: { date } });
      if (winner) return winner.data as unknown as WordResult;
    }
    throw err;
  }
}
