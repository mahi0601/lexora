"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateWordResult, AIGenerationError } from "@/lib/ai";
import { checkRateLimit, RateLimitError } from "@/lib/rateLimit";
import type { WordResult } from "@/lib/ai/schema";

export type SearchWordResult =
  | { ok: true; result: WordResult }
  | { ok: false; error: string };

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip");
}

export async function searchWord(
  query: string,
  categoryHint?: string
): Promise<SearchWordResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: false, error: "Type something to search for a word." };
  }
  if (trimmed.length > 300) {
    return { ok: false, error: "That's a bit long — try a shorter phrase." };
  }

  // Clerk auth is temporarily disabled for local dev; treat everyone as anonymous.
  const userId: string | null = null;
  const ip = userId ? null : await getClientIp();

  try {
    await checkRateLimit({ userId, ip });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return { ok: false, error: err.message };
    }
    throw err;
  }

  try {
    const result = await generateWordResult({
      query: trimmed,
      categoryHint,
    });

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
