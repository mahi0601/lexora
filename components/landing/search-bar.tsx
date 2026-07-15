"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/useSearchStore";

const ROTATING_EXAMPLES = [
  "happy about someone else's success",
  "the smell after rain",
  "someone who loves books",
  "saudade",
  "alegría",
  "want to help everyone",
];

export function SearchBar() {
  const { query, setQuery, search, loading, categoryHint, setCategoryHint } =
    useSearchStore();
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_EXAMPLES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    void search(query, categoryHint ?? undefined);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
      {categoryHint && (
        <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-muted-foreground">
          Searching in <strong className="text-foreground">{categoryHint}</strong>
          <button
            type="button"
            onClick={() => setCategoryHint(null)}
            aria-label={`Clear ${categoryHint} category filter`}
            className="rounded-full p-0.5 hover:bg-muted"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </span>
      )}
      <form
        onSubmit={handleSubmit}
        className="glass flex w-full items-center gap-2 rounded-card p-2 shadow-lg"
        role="search"
        aria-label="Find a word"
      >
        <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="relative min-w-0 flex-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Describe what you mean, or type a word or phrase"
          className="w-full min-w-0 bg-transparent py-3 text-base outline-none placeholder:text-transparent md:text-lg"
        />
        {query.length === 0 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="whitespace-nowrap text-base text-muted-foreground md:text-lg"
              >
                {ROTATING_EXAMPLES[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading || !query.trim()}
        size="lg"
        className="rounded-full shadow-[0_0_0_0_var(--primary)] transition-shadow hover:shadow-[0_0_24px_4px_var(--primary)]"
      >
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
