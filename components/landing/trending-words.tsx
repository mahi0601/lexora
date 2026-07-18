"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { getTrendingWords } from "@/actions/trending";
import { useSearchStore } from "@/store/useSearchStore";

export function TrendingWords() {
  const [words, setWords] = React.useState<Awaited<ReturnType<typeof getTrendingWords>>>([]);
  const { search } = useSearchStore();

  React.useEffect(() => {
    getTrendingWords().then(setWords).catch(() => setWords([]));
  }, []);

  if (words.length === 0) return null;

  return (
    <section aria-label="Trending words" className="px-4 py-8">
      <p className="mb-4 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground">
        <TrendingUp className="size-4" aria-hidden="true" />
        Trending in the last 2 days
      </p>
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {words.map((w) => (
          <li key={w.word}>
            <button
              type="button"
              onClick={() => void search(w.word)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted"
            >
              {w.word}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
