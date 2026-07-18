import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

/**
 * Resolves the current visitor to our local `User` row, lazily provisioning
 * it on first use. Every My Words action must call this and scope its
 * Prisma queries by the returned internal id — never trust a client-supplied
 * user/word id on its own.
 *
 * Lexora has no sign-in flow (matching the reference app), so "the user" is
 * whoever holds the anonymous device-id cookie middleware.ts assigns to
 * every visitor on their first request. The `clerkId` column just stores
 * that id — left named for the account system a future phase could add
 * without another migration, not because Clerk is actually wired up.
 */
export async function requireLocalUser() {
  const jar = await cookies();
  const uid = jar.get("lexora_uid")?.value ?? crypto.randomUUID();

  try {
    return await prisma.user.upsert({
      where: { clerkId: uid },
      create: { clerkId: uid },
      update: {},
    });
  } catch (err) {
    // Pages that fetch several things in parallel (Promise.all) each call
    // this at once — two upserts for the same brand-new uid can race each
    // other's create. Whoever loses just reads the winner's row instead of
    // failing the request (same pattern as wordOfDay.ts's day-boundary race).
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return prisma.user.findUniqueOrThrow({ where: { clerkId: uid } });
    }
    throw err;
  }
}
