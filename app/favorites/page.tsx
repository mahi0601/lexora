import type { Metadata } from "next";
import { listWords, listCollections } from "@/actions/words";
import { FavoritesView } from "@/components/my-words/favorites-view";

export const metadata: Metadata = {
  title: "Favorites — Lexora",
};

export default async function FavoritesPage() {
  const [words, collections] = await Promise.all([
    listWords({ sort: "recent" }),
    listCollections(),
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Favorites
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Words you&apos;ve saved for later.
        </p>
      </div>
      <FavoritesView initialWords={words} initialCollections={collections} />
    </main>
  );
}
