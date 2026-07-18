import type { Metadata } from "next";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { getMatchWords } from "@/actions/match";
import { UnauthenticatedError } from "@/lib/getOrCreateUser";
import { MatchGame } from "@/components/match/match-game";

export const metadata: Metadata = {
  title: "Match — Lexora",
};

export default async function MatchPage() {
  let result: Awaited<ReturnType<typeof getMatchWords>>;

  try {
    result = await getMatchWords();
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return (
        <main id="main-content" className="mx-auto max-w-2xl px-4 py-16">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
            <LogIn className="size-6 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-foreground">Sign in required</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to play the matching game with your saved words.
            </p>
          </div>
        </main>
      );
    }
    throw err;
  }

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Match
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Pair each word with its definition.
        </p>
      </div>

      {result.ok ? (
        <MatchGame pairs={result.pairs} />
      ) : (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">{result.error}</p>
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Find a word to save →
          </Link>
        </div>
      )}
    </main>
  );
}
