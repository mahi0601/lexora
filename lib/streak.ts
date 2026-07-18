import { prisma } from "@/lib/prisma";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / msPerDay);
}

/**
 * Bumps the user's daily streak the first time they do *anything* that
 * counts — a review answer or a solved daily challenge — on a given day.
 * Shared so every streak-worthy action (review.ts, dailyChallenge.ts) stays
 * in sync on one definition of "today already counted."
 */
export async function bumpDailyStreak(user: {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastReviewedAt: Date | null;
}) {
  const today = new Date();
  const { lastReviewedAt } = user;

  if (lastReviewedAt && daysBetween(today, lastReviewedAt) === 0) {
    return { currentStreak: user.currentStreak, longestStreak: user.longestStreak };
  }

  const gap = lastReviewedAt ? daysBetween(today, lastReviewedAt) : null;
  const currentStreak = gap === 1 ? user.currentStreak + 1 : 1;
  const longestStreak = Math.max(user.longestStreak, currentStreak);

  await prisma.user.update({
    where: { id: user.id },
    data: { currentStreak, longestStreak, lastReviewedAt: today },
  });

  return { currentStreak, longestStreak };
}
