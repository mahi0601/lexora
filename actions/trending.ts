"use server";

import { prisma } from "@/lib/prisma";

/** Most-searched words across all (anonymous) users in the last 48 hours. */
export async function getTrendingWords(limit = 8) {
  const since = new Date();
  since.setHours(since.getHours() - 48);

  const grouped = await prisma.searchQuery.groupBy({
    by: ["resultWord"],
    where: { resultWord: { not: null }, createdAt: { gte: since } },
    _count: { resultWord: true },
    orderBy: { _count: { resultWord: "desc" } },
    take: limit,
  });

  return grouped
    .filter((g) => g.resultWord)
    .map((g) => ({ word: g.resultWord as string, count: g._count.resultWord }));
}
