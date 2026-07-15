import { create } from "zustand";
import { searchWord } from "@/actions/search";
import type { WordResult } from "@/lib/ai/schema";

interface SearchState {
  query: string;
  result: WordResult | null;
  loading: boolean;
  error: string | null;
  categoryHint: string | null;
  setQuery: (query: string) => void;
  setCategoryHint: (categoryHint: string | null) => void;
  search: (query: string, categoryHint?: string) => Promise<void>;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  result: null,
  loading: false,
  error: null,
  categoryHint: null,

  setQuery: (query) => set({ query }),
  setCategoryHint: (categoryHint) => set({ categoryHint }),

  search: async (query, categoryHint) => {
    set({ loading: true, error: null, query });
    try {
      const response = await searchWord(
        query,
        categoryHint ?? get().categoryHint ?? undefined
      );
      if (response.ok) {
        set({ result: response.result, loading: false, error: null });
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
}));
