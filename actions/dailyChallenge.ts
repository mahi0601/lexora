"use server";

import { prisma } from "@/lib/prisma";
import { requireLocalUser } from "@/lib/getOrCreateUser";
import { getWordOfDay } from "@/actions/wordOfDay";
import { syncAchievements } from "@/actions/achievements";
import { bumpDailyStreak } from "@/lib/streak";
import { generatePracticeWord } from "@/lib/ai";

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

  let solvedToday = false;
  try {
    const user = await requireLocalUser();
    const attempt = await prisma.dailyChallengeAttempt.findUnique({
      where: { userId_date: { userId: user.id, date: todayDateOnly() } },
    });
    solvedToday = attempt?.solved ?? false;
  } catch {
    // Anonymous visitor — still playable, just nothing to persist.
  }

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
 */
export async function getPracticeWord(exclude: string[] = []) {
  const word = await generatePracticeWord(exclude);
  return {
    word: word.word,
    definition: word.definition,
    exampleSentence: word.exampleSentences?.[0] ?? null,
    partOfSpeech: word.partOfSpeech,
    wordLength: word.word.length,
    pronunciation: word.pronunciation,
    originEtymology: word.originEtymology,
  };
}
