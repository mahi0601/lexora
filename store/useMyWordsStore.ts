import { create } from "zustand";
import {
  listWords,
  listCollections,
  type SortOption,
} from "@/actions/words";

type SavedWordRow = Awaited<ReturnType<typeof listWords>>[number];
type CollectionRow = Awaited<ReturnType<typeof listCollections>>[number];

interface MyWordsState {
  words: SavedWordRow[];
  collections: CollectionRow[];
  loading: boolean;
  search: string;
  sort: SortOption;
  onlyFavorites: boolean;
  onlyReviewLater: boolean;
  onlyCustom: boolean;
  collectionId: string | null;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  toggleOnlyFavorites: () => void;
  toggleOnlyReviewLater: () => void;
  toggleOnlyCustom: () => void;
  setCollectionId: (collectionId: string | null) => void;
  refresh: () => Promise<void>;
  refreshCollections: () => Promise<void>;
}

export const useMyWordsStore = create<MyWordsState>((set, get) => ({
  words: [],
  collections: [],
  loading: true,
  search: "",
  sort: "recent",
  onlyFavorites: false,
  onlyReviewLater: false,
  onlyCustom: false,
  collectionId: null,

  setSearch: (search) => {
    set({ search });
    void get().refresh();
  },
  setSort: (sort) => {
    set({ sort });
    void get().refresh();
  },
  toggleOnlyFavorites: () => {
    set((s) => ({ onlyFavorites: !s.onlyFavorites }));
    void get().refresh();
  },
  toggleOnlyReviewLater: () => {
    set((s) => ({ onlyReviewLater: !s.onlyReviewLater }));
    void get().refresh();
  },
  toggleOnlyCustom: () => {
    set((s) => ({ onlyCustom: !s.onlyCustom }));
    void get().refresh();
  },
  setCollectionId: (collectionId) => {
    set({ collectionId });
    void get().refresh();
  },

  refresh: async () => {
    const { search, sort, onlyFavorites, onlyReviewLater, onlyCustom, collectionId } =
      get();
    set({ loading: true });
    const words = await listWords({
      search: search || undefined,
      sort,
      onlyFavorites,
      onlyReviewLater,
      onlyCustom,
      collectionId: collectionId ?? undefined,
    });
    set({ words, loading: false });
  },

  refreshCollections: async () => {
    const collections = await listCollections();
    set({ collections });
  },
}));
