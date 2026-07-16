"use client";

import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultCard } from "@/components/results/result-card";
import { useSearchStore } from "@/store/useSearchStore";

export function SearchResults() {
  const { result, loading, error, search } = useSearchStore();

  if (!loading && !error && !result) return null;

  return (
    <div className="px-4 py-6" aria-live="polite">
      {loading && (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="mx-auto w-full max-w-2xl rounded-lg border border-border bg-card p-6 text-center text-muted-foreground"
        >
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && result && (
          <ResultCard
            key={result.word}
            result={result}
            onSelectAlternate={(word) => void search(word)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
