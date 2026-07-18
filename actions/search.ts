"use server";

import { prisma } from "@/lib/prisma";
import { generateWordResult, AIGenerationError } from "@/lib/ai";
import { checkRateLimit, RateLimitError } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import type { WordResult } from "@/lib/ai/schema";

export type SearchWordResult =
  | { ok: true; result: WordResult }
  | { ok: false; error: string };

export async function searchWord(query: string): Promise<SearchWordResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: false, error: "Type something to search for a word." };
  }
  if (trimmed.length > 300) {
    return { ok: false, error: "That's a bit long — try a shorter phrase." };
  }

  // Search stays IP-scoped for rate-limiting regardless of who's visiting —
  // it doesn't need the per-visitor identity My Words/streaks use.
  const userId: string | null = null;
  const ip = userId ? null : await getClientIp();

  try {
    await checkRateLimit({ userId, ip });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return { ok: false, error: err.message };
    }
    // Rate-limit check depends on the DB; a DB hiccup here shouldn't block
    // the search itself, so log and fail open instead of throwing.
    console.error("checkRateLimit failed, failing open:", err);
  }

  try {
    const result = await generateWordResult({ query: trimmed });

    // Best-effort logging — never block the user's result on this.
    prisma.searchQuery
      .create({
        data: {
          userId: userId ?? undefined,
          ip: ip ?? undefined,
          queryText: trimmed,
          resultWord: result.word,
        },
      })
      .catch(() => {});

    return { ok: true, result };
  } catch (err) {
    if (err instanceof AIGenerationError) {
      return { ok: false, error: err.message };
    }
    return {
      ok: false,
      error: "Something went wrong finding a word for that. Please try again.",
    };
  }
}
