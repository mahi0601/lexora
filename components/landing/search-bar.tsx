"use client";

import type { FormEvent } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/useSearchStore";

export function SearchBar() {
  const { query, setQuery, search, loading, categoryHint, setCategoryHint } =
    useSearchStore();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    void search(query, categoryHint ?? undefined);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2">
      {categoryHint && (
        <span className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
          Searching in <strong className="text-foreground">{categoryHint}</strong>
          <button
            type="button"
            onClick={() => setCategoryHint(null)}
            aria-label={`Clear ${categoryHint} category filter`}
            className="rounded-full p-1 hover:bg-background"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </span>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm"
        role="search"
        aria-label="Find a word"
      >
        <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you mean, or type a word or phrase…"
          aria-label="Describe what you mean, or type a word or phrase"
          className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground md:text-lg"
        />
        <Button type="submit" disabled={loading || !query.trim()} size="lg">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            "Find the word"
          )}
        </Button>
      </form>
    </div>
  );
}
