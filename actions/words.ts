"use server";

import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import type { WordResult } from "@/lib/ai/schema";

export type SortOption = "recent" | "favorite" | "difficulty" | "alphabetical";

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

export async function saveWord(
  result: WordResult,
  options?: { collectionId?: string | null }
) {
  const user = await requireLocalUser();

  const saved = await prisma.savedWord.upsert({
    where: { userId_word: { userId: user.id, word: result.word } },
    create: {
      userId: user.id,
      word: result.word,
      data: result,
      difficulty: result.difficultyLevel,
      cefrLevel: result.cefrLevel,
      partOfSpeech: result.partOfSpeech[0],
      collectionId: options?.collectionId ?? null,
    },
    update: {
      data: result,
      difficulty: result.difficultyLevel,
      cefrLevel: result.cefrLevel,
      partOfSpeech: result.partOfSpeech[0],
    },
  });

  return { ok: true as const, id: saved.id };
}

export async function updateWord(
  id: string,
  patch: {
    notes?: string;
    tags?: string[];
    isFavorite?: boolean;
    reviewLater?: boolean;
    collectionId?: string | null;
  }
) {
  const user = await requireLocalUser();

  const result = await prisma.savedWord.updateMany({
    where: { id, userId: user.id },
    data: patch,
  });

  if (result.count === 0) {
    return { ok: false as const, error: "Word not found." };
  }
  return { ok: true as const };
}

export async function deleteWord(id: string) {
  const user = await requireLocalUser();

  const result = await prisma.savedWord.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return { ok: false as const, error: "Word not found." };
  }
  return { ok: true as const };
}

export async function listWords(params?: {
  search?: string;
  sort?: SortOption;
  onlyFavorites?: boolean;
  onlyReviewLater?: boolean;
  collectionId?: string;
}) {
  const user = await requireLocalUser();

  const rows = await prisma.savedWord.findMany({
    where: {
      userId: user.id,
      ...(params?.search
        ? { word: { contains: params.search, mode: "insensitive" } }
        : {}),
      ...(params?.onlyFavorites ? { isFavorite: true } : {}),
      ...(params?.onlyReviewLater ? { reviewLater: true } : {}),
      ...(params?.collectionId ? { collectionId: params.collectionId } : {}),
    },
    include: { collection: true },
  });

  const sort = params?.sort ?? "recent";
  const sorted = [...rows].sort((a, b) => {
    switch (sort) {
      case "favorite":
        return Number(b.isFavorite) - Number(a.isFavorite);
      case "difficulty":
        return (
          (DIFFICULTY_ORDER[a.difficulty ?? ""] ?? 99) -
          (DIFFICULTY_ORDER[b.difficulty ?? ""] ?? 99)
        );
      case "alphabetical":
        return a.word.localeCompare(b.word);
      case "recent":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return sorted;
}

export async function createCollection(name: string) {
  const user = await requireLocalUser();
  const collection = await prisma.collection.create({
    data: { userId: user.id, name },
  });
  return { ok: true as const, collection };
}

export async function listCollections() {
  const user = await requireLocalUser();
  return prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportWords(
  format: "markdown" | "json" | "csv"
): Promise<{ ok: true; content: string; filename: string } | { ok: false; error: string }> {
  const words = await listWords({ sort: "alphabetical" });

  if (format === "json") {
    return {
      ok: true,
      content: JSON.stringify(words, null, 2),
      filename: "lexora-vocabulary.json",
    };
  }

  if (format === "csv") {
    const header = "word,definition,difficulty,cefrLevel,tags,notes,savedAt";
    const lines = words.map((w) => {
      const data = w.data as unknown as WordResult;
      return [
        w.word,
        data.definition ?? "",
        w.difficulty ?? "",
        w.cefrLevel ?? "",
        w.tags.join("; "),
        w.notes ?? "",
        w.createdAt.toISOString(),
      ]
        .map((v) => csvEscape(String(v)))
        .join(",");
    });
    return {
      ok: true,
      content: [header, ...lines].join("\n"),
      filename: "lexora-vocabulary.csv",
    };
  }

  const sections = words.map((w) => {
    const data = w.data as unknown as WordResult;
    return [
      `## ${w.word}${w.isFavorite ? " ⭐" : ""}`,
      `- **Definition:** ${data.definition ?? "N/A"}`,
      `- **Difficulty:** ${w.difficulty ?? "N/A"} (${w.cefrLevel ?? "N/A"})`,
      w.tags.length ? `- **Tags:** ${w.tags.join(", ")}` : null,
      w.notes ? `- **Notes:** ${w.notes}` : null,
      `- **Saved:** ${w.createdAt.toISOString().slice(0, 10)}`,
      "",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  });

  return {
    ok: true,
    content: `# My Vocabulary Journal\n\n${sections.join("\n")}`,
    filename: "lexora-vocabulary.md",
  };
}
