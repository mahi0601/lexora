import type { Metadata } from "next";
import Link from "next/link";
import { getMatchWords } from "@/actions/match";
import { MatchGame } from "@/components/match/match-game";

export const metadata: Metadata = {
  title: "Match — Lexora",
};

export default async function MatchPage() {
  const result = await getMatchWords();

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
