"use server";

import { randomInt } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireLocalUser } from "@/lib/getOrCreateUser";

const COOKIE_NAME = "lexora_uid";
const ONE_YEAR = 60 * 60 * 24 * 365;
// No 0/O/1/I — those get misread when someone copies the code by hand.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += CODE_CHARS[randomInt(0, CODE_CHARS.length)];
  }
  return code;
}

/** Returns the existing code if there is one, otherwise mints a new one. */
export async function getOrCreateRecoveryCode(): Promise<string> {
  const user = await requireLocalUser();
  if (user.recoveryCode) return user.recoveryCode;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    try {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { recoveryCode: code },
      });
      return updated.recoveryCode as string;
    } catch (err) {
      // Collision on the unique code — vanishingly unlikely, just retry.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        continue;
      }
      throw err;
    }
  }
  throw new Error("Could not generate a recovery code. Please try again.");
}

/** Permanently deletes this visitor's data (cascades to every table via the
 * schema's onDelete: Cascade) and clears the cookie so they start fresh. */
export async function deleteAllMyData(): Promise<{ ok: true }> {
  const user = await requireLocalUser();
  await prisma.user.delete({ where: { id: user.id } });

  const jar = await cookies();
  jar.delete(COOKIE_NAME);

  return { ok: true };
}

export async function restoreFromRecoveryCode(
  rawCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, error: "Enter a code first." };
  }

  const owner = await prisma.user.findUnique({ where: { recoveryCode: code } });
  if (!owner) {
    return { ok: false, error: "That code doesn't match any saved words." };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, owner.clerkId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR,
    path: "/",
  });

  return { ok: true };
}
