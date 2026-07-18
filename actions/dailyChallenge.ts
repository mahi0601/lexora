"use server";

import { prisma } from "@/lib/prisma";
import { requireLocalUser } from "@/lib/getOrCreateUser";
import { getWordOfDay } from "@/actions/wordOfDay";
import { syncAchievements } from "@/actions/achievements";
import { bumpDailyStreak } from "@/lib/streak";
import { generatePracticeWord } from "@/lib/ai";
import { checkRateLimit, RateLimitError } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

function todayDateOnly(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * The clue only — never the word itself, so guessing it is a real guess.
 * Solving/revealing (below) is what returns the full word.
 */
export async function getDailyChallenge() {
  const word = await getWordOfDay();

  const user = await requireLocalUser();
  const attempt = await prisma.dailyChallengeAttempt.findUnique({
    where: { userId_date: { userId: user.id, date: todayDateOnly() } },
  });
  const solvedToday = attempt?.solved ?? false;

  return {
    definition: word.definition,
    exampleSentence: word.exampleSentences?.[0] ?? null,
    partOfSpeech: word.partOfSpeech,
    wordLength: word.word.length,
    solvedToday,
  };
}

async function recordSolve() {
  try {
    const user = await requireLocalUser();
    const existing = await prisma.dailyChallengeAttempt.findUnique({
      where: { userId_date: { userId: user.id, date: todayDateOnly() } },
    });
    if (existing) return null;

    await prisma.dailyChallengeAttempt.create({
      data: { userId: user.id, date: todayDateOnly(), solved: true },
    });
    const streak = await bumpDailyStreak(user);
    await syncAchievements(user.id).catch(() => {});
    return streak;
  } catch {
    return null;
  }
}

export async function submitDailyChallengeGuess(guess: string) {
  const word = await getWordOfDay();
  const correct = guess.trim().toLowerCase() === word.word.toLowerCase();
  const streak = correct ? await recordSolve() : null;

  return {
    correct,
    word: correct ? word.word : null,
    definition: correct ? word.definition : null,
    pronunciation: correct ? word.pronunciation : null,
    originEtymology: correct ? word.originEtymology : null,
    streak,
  };
}

export async function revealDailyChallenge() {
  const word = await getWordOfDay();
  return {
    word: word.word,
    definition: word.definition,
    pronunciation: word.pronunciation,
    originEtymology: word.originEtymology,
  };
}

/**
 * Unlimited bonus practice after the daily challenge — a fresh random word,
 * no auth, no persistence, doesn't touch the streak. Unlike the daily
 * challenge the word ships to the client right away (nothing here is worth
 * hiding server-side), the UI just doesn't render it until solved/revealed.
 *
 * Still spends real AI-provider quota per call (unlike the cached category
 * lists), so it gets the same abuse guard as search — and `exclude` is
 * client-supplied text that flows into the prompt, so it's bounded before
 * use rather than trusted verbatim.
 */
export type PracticeWordResult =
  | {
      ok: true;
      word: string;
      definition: string;
      exampleSentence: string | null;
      partOfSpeech: string[];
      wordLength: number;
      pronunciation: string;
      originEtymology: string;
    }
  | { ok: false; error: string };

export async function getPracticeWord(
  exclude: string[] = []
): Promise<PracticeWordResult> {
  const userId: string | null = null;
  const ip = userId ? null : await getClientIp();

  try {
    await checkRateLimit({ userId, ip });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return { ok: false, error: err.message };
    }
    // Rate-limit check depends on the DB; a DB hiccup here shouldn't block
    // practice — log and fail open instead of blocking the user.
    console.error("checkRateLimit failed, failing open:", err);
  }

  const safeExclude = exclude.slice(-20).map((w) => w.slice(0, 40));

  try {
    const word = await generatePracticeWord(safeExclude);

    prisma.searchQuery
      .create({
        data: {
          userId: userId ?? undefined,
          ip: ip ?? undefined,
          queryText: "[practice]",
          resultWord: word.word,
        },
      })
      .catch(() => {});

    return {
      ok: true,
      word: word.word,
      definition: word.definition,
      exampleSentence: word.exampleSentences?.[0] ?? null,
      partOfSpeech: word.partOfSpeech,
      wordLength: word.word.length,
      pronunciation: word.pronunciation,
      originEtymology: word.originEtymology,
    };
  } catch {
    return {
      ok: false,
      error: "Couldn't find a practice word right now. Please try again.",
    };
  }
}
