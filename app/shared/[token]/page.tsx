import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSharedCollection } from "@/actions/sharing";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const collection = await getSharedCollection(token);
  return {
    title: collection ? `${collection.name} — Lexora` : "Shared collection — Lexora",
  };
}

export default async function SharedCollectionPage({ params }: Props) {
  const { token } = await params;
  const collection = await getSharedCollection(token);
  if (!collection) notFound();

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Shared collection</p>
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          {collection.name}
        </h1>
      </div>

      {collection.words.length === 0 ? (
        <p className="text-sm text-muted-foreground">This collection is empty.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {collection.words.map((w) => (
            <li key={w.id} className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">{w.word}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{w.definition}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
