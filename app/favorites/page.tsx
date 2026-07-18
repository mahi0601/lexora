import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { listWords, listCollections } from "@/actions/words";
import { UnauthenticatedError } from "@/lib/getOrCreateUser";
import { FavoritesView } from "@/components/my-words/favorites-view";

export const metadata: Metadata = {
  title: "Favorites — Lexora",
};

export default async function FavoritesPage() {
  let words: Awaited<ReturnType<typeof listWords>>;
  let collections: Awaited<ReturnType<typeof listCollections>>;

  try {
    [words, collections] = await Promise.all([
      listWords({ sort: "recent" }),
      listCollections(),
    ]);
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return (
        <main id="main-content" className="mx-auto max-w-2xl px-4 py-16">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
            <LogIn className="size-6 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-foreground">Sign in required</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to save and manage your favorite words.
            </p>
          </div>
        </main>
      );
    }
    throw err;
  }

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
