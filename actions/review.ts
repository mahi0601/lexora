"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import { syncAchievements } from "@/actions/achievements";
import { SRS_INTERVAL_DAYS, SRS_MAX_LEVEL } from "@/lib/srs";
import { bumpDailyStreak } from "@/lib/streak";
import type { WordResult } from "@/lib/ai/schema";

export async function getReviewQueue(limit = 20) {
  const user = await requireLocalUser();

  const [due, dueCount] = await Promise.all([
    prisma.savedWord.findMany({
      where: { userId: user.id, nextReviewAt: { lte: new Date() } },
      orderBy: { nextReviewAt: "asc" },
      take: limit,
    }),
    prisma.savedWord.count({
      where: { userId: user.id, nextReviewAt: { lte: new Date() } },
    }),
  ]);

  return {
    words: due.map((w) => ({
      id: w.id,
      word: w.word,
      srsLevel: w.srsLevel,
      definition: (w.data as unknown as WordResult).definition,
      exampleSentence: (w.data as unknown as WordResult).exampleSentences?.[0] ?? null,
    })),
    dueCount,
  };
}

export async function getStreak() {
  const user = await requireLocalUser();
  const dueCount = await prisma.savedWord.count({
    where: { userId: user.id, nextReviewAt: { lte: new Date() } },
  });
  return {
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    dueCount,
  };
}

/**
 * Same as getStreak, but for the homepage widget's opportunistic fetch —
 * returns null instead of throwing so a signed-out visit doesn't surface as
 * a server action error, since "no streak to show" is an expected outcome
 * here, not a failure.
 */
export async function getStreakSafe() {
  try {
    return await getStreak();
  } catch {
    return null;
  }
}

export async function submitReview(id: string, remembered: boolean) {
  const user = await requireLocalUser();

  const word = await prisma.savedWord.findFirst({
    where: { id, userId: user.id },
  });
  if (!word) {
    return { ok: false as const, error: "Word not found." };
  }

  const nextLevel = remembered
    ? Math.min(word.srsLevel + 1, SRS_MAX_LEVEL)
    : 0;
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + SRS_INTERVAL_DAYS[nextLevel]);

  await prisma.savedWord.update({
    where: { id: word.id },
    data: { srsLevel: nextLevel, nextReviewAt },
  });
  await prisma.reviewLog.create({
    data: { userId: user.id, savedWordId: word.id, remembered },
  });

  const { currentStreak, longestStreak } = await bumpDailyStreak(user);
  await syncAchievements(user.id).catch(() => {});

  return { ok: true as const, currentStreak, longestStreak };
}
