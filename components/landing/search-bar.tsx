"use client";

import type { FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/useSearchStore";

export function SearchBar() {
  const { query, setQuery, search, loading } = useSearchStore();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    void search(query);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2">
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
