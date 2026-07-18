"use client";

import * as React from "react";
import { useMyWordsStore } from "@/store/useMyWordsStore";
import { WordFilters } from "@/components/my-words/word-filters";
import { SavedWordCard } from "@/components/my-words/saved-word-card";
import { CollectionsPanel } from "@/components/my-words/collections-panel";
import { AddWordForm } from "@/components/my-words/add-word-form";
import type { listWords, listCollections } from "@/actions/words";

type Words = Awaited<ReturnType<typeof listWords>>;
type Collections = Awaited<ReturnType<typeof listCollections>>;

export function FavoritesView({
  initialWords,
  initialCollections,
}: {
  initialWords: Words;
  initialCollections: Collections;
}) {
  const words = useMyWordsStore((s) => s.words);

  React.useEffect(() => {
    useMyWordsStore.setState({
      words: initialWords,
      collections: initialCollections,
      loading: false,
    });
  }, [initialWords, initialCollections]);

  return (
    <div className="flex flex-col gap-6">
      <CollectionsPanel />
      <AddWordForm />
      <WordFilters />
      {words.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved words yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <SavedWordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}
