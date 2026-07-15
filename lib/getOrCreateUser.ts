import { prisma } from "@/lib/prisma";

export class UnauthenticatedError extends Error {
  constructor() {
    super("You must be signed in to do that.");
  }
}

/**
 * Resolves the signed-in Clerk user to our local `User` row, lazily
 * provisioning it on first authenticated action. Every My Words action must
 * call this and scope its Prisma queries by the returned internal id —
 * never trust a client-supplied user/word id on its own.
 *
 * Clerk auth is temporarily disabled for local dev (no API keys configured),
 * so this always reports signed-out until Clerk is wired back in.
 */
export async function requireLocalUser() {
  const clerkId: string | null = null;
  if (!clerkId) {
    throw new UnauthenticatedError();
  }

  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {},
  });
}
