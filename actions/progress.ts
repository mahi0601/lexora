"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** One cell per day for the last `weeks` weeks, counting reviews done that day. */
export async function getActivityHeatmap(weeks = 12) {
  const user = await requireLocalUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const since = new Date(today);
  since.setDate(since.getDate() - weeks * 7 + 1);

  const logs = await prisma.reviewLog.findMany({
    where: { userId: user.id, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();
  for (const log of logs) {
    const key = dateKey(log.createdAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days: { date: string; count: number }[] = [];
  const cursor = new Date(since);
  while (cursor <= today) {
    const key = dateKey(cursor);
    days.push({ date: key, count: counts.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}
