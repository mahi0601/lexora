"use client";

import { useSearchStore } from "@/store/useSearchStore";

export function RecentSearches() {
  const { recentSearches, search } = useSearchStore();

  if (recentSearches.length === 0) return null;

  return (
    <section aria-label="Recently searched" className="px-4 py-8">
      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Recently searched
      </h2>
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {recentSearches.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => void search(q)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {q}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
