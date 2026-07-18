"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS, type AchievementStats } from "@/lib/achievements";

async function computeStats(userId: string): Promise<AchievementStats> {
  const [user, totalSaved, totalReviewed] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.savedWord.count({ where: { userId } }),
    prisma.reviewLog.count({ where: { userId } }),
  ]);
  return { totalSaved, totalReviewed, longestStreak: user.longestStreak };
}

/**
 * Unlocks any newly-earned badges. Called after saveWord/submitReview so a
 * badge appears the moment it's earned rather than on the next page load.
 */
export async function syncAchievements(userId: string) {
  const stats = await computeStats(userId);
  const earnedKeys = ACHIEVEMENTS.filter((a) => a.isUnlocked(stats)).map((a) => a.key);
  if (earnedKeys.length === 0) return;

  await prisma.userAchievement.createMany({
    data: earnedKeys.map((key) => ({ userId, key })),
    skipDuplicates: true,
  });
}

export async function getAchievements() {
  const user = await requireLocalUser();
  // Self-heal: catches anyone who crossed a threshold without a sync firing.
  await syncAchievements(user.id);
  const unlocked = await prisma.userAchievement.findMany({ where: { userId: user.id } });
  const unlockedKeys = new Set(unlocked.map((u) => u.key));

  return ACHIEVEMENTS.map((a) => ({
    key: a.key,
    title: a.title,
    description: a.description,
    icon: a.icon,
    unlocked: unlockedKeys.has(a.key),
  }));
}
