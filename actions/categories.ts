"use server";

import { prisma } from "@/lib/prisma";
import { generateCategoryWords } from "@/lib/ai";
import { getCategoryBySlug } from "@/lib/categories";
import type { CategoryWordEntry } from "@/lib/ai/schema";

export async function getCategoryWords(slug: string): Promise<{
  name: string;
  words: CategoryWordEntry[];
} | null> {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const cached = await prisma.categoryWordList.findUnique({ where: { slug } });
  if (cached) {
    return { name: category.name, words: cached.words as unknown as CategoryWordEntry[] };
  }

  const words = await generateCategoryWords(category.name);

  try {
    await prisma.categoryWordList.create({ data: { slug, words } });
  } catch {
    // Two requests raced — whichever lost just serves its own freshly
    // generated list this once rather than failing the page.
  }

  return { name: category.name, words };
}
