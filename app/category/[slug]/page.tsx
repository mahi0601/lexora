import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getCategoryWords } from "@/actions/categories";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryWords(slug).catch(() => null);
  return { title: category ? `${category.name} — Lexora` : "Category — Lexora" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category: Awaited<ReturnType<typeof getCategoryWords>>;
  try {
    category = await getCategoryWords(slug);
  } catch {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        Couldn&apos;t load this category right now. Please try again.
      </main>
    );
  }

  if (!category) notFound();

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Category</p>
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          {category.name}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          {category.words.length} words to explore.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {category.words.map((w) => (
          <li key={w.word}>
            <Link
              href={`/word/${encodeURIComponent(w.word)}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors duration-150 hover:bg-muted"
            >
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  {w.word}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{w.definition}</p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {w.cefrLevel}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
