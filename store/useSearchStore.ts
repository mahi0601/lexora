import { create } from "zustand";
import { persist } from "zustand/middleware";
import { searchWord } from "@/actions/search";
import type { WordResult } from "@/lib/ai/schema";

const MAX_RECENT_SEARCHES = 8;

interface SearchState {
  query: string;
  result: WordResult | null;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  reset: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      result: null,
      loading: false,
      error: null,
      recentSearches: [],

      setQuery: (query) => set({ query }),

      search: async (query) => {
        set({ loading: true, error: null, query });
        try {
          const response = await searchWord(query);
          if (response.ok) {
            const trimmed = query.trim();
            const recentSearches = [
              trimmed,
              ...get().recentSearches.filter(
                (q) => q.toLowerCase() !== trimmed.toLowerCase()
              ),
            ].slice(0, MAX_RECENT_SEARCHES);
            set({ result: response.result, loading: false, error: null, recentSearches });
          } else {
            set({ result: null, loading: false, error: response.error });
          }
        } catch {
          set({
            result: null,
            loading: false,
            error: "Something went wrong finding a word for that. Please try again.",
          });
        }
      },

      reset: () =>
        set({ query: "", result: null, loading: false, error: null }),
    }),
    {
      name: "lexora-recent-searches",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
