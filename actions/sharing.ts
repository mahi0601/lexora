"use server";

import { randomUUID } from "crypto";
import { requireLocalUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";
import type { WordResult } from "@/lib/ai/schema";

export async function shareCollection(collectionId: string) {
  const user = await requireLocalUser();
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId: user.id },
  });
  if (!collection) {
    return { ok: false as const, error: "Collection not found." };
  }

  const token = collection.shareToken ?? randomUUID();
  if (!collection.shareToken) {
    await prisma.collection.update({
      where: { id: collectionId },
      data: { shareToken: token },
    });
  }
  return { ok: true as const, token };
}

export async function unshareCollection(collectionId: string) {
  const user = await requireLocalUser();
  const result = await prisma.collection.updateMany({
    where: { id: collectionId, userId: user.id },
    data: { shareToken: null },
  });
  if (result.count === 0) {
    return { ok: false as const, error: "Collection not found." };
  }
  return { ok: true as const };
}

// Public — looked up by an unguessable token, never by collection id.
export async function getSharedCollection(token: string) {
  const collection = await prisma.collection.findUnique({
    where: { shareToken: token },
    include: { savedWords: true },
  });
  if (!collection) return null;

  return {
    name: collection.name,
    words: collection.savedWords.map((w) => ({
      id: w.id,
      word: w.word,
      definition: (w.data as unknown as WordResult).definition,
    })),
  };
}
