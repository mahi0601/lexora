import { prisma } from "@/lib/prisma";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

export class RateLimitError extends Error {}

/**
 * Coarse abuse guard for the public (unauthenticated) search endpoint, since
 * it spends free AI-provider quota. Not meant to be precise — just enough to
 * stop a single client from hammering the endpoint.
 */
export async function checkRateLimit(identifier: {
  userId?: string | null;
  ip?: string | null;
}): Promise<void> {
  const since = new Date(Date.now() - WINDOW_MS);

  const count = await prisma.searchQuery.count({
    where: {
      createdAt: { gte: since },
      ...(identifier.userId
        ? { userId: identifier.userId }
        : { ip: identifier.ip ?? "unknown" }),
    },
  });

  if (count >= MAX_REQUESTS_PER_WINDOW) {
    throw new RateLimitError("Too many searches — please wait a moment and try again.");
  }
}
