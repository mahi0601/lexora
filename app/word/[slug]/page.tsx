import type { Metadata } from "next";
import { generateWordResult, AIGenerationError } from "@/lib/ai";
import { ResultCard } from "@/components/results/result-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  return {
    title: `${word} — Lexora`,
    description: `What "${word}" means, with pronunciation, examples, and related words — found on Lexora.`,
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const query = decodeURIComponent(slug);

  try {
    const result = await generateWordResult({ query });
    return (
      <main id="main-content" className="px-4 py-16">
        <ResultCard result={result} />
      </main>
    );
  } catch (err) {
    const message =
      err instanceof AIGenerationError
        ? err.message
        : "Couldn't look up that word right now. Please try again.";
    return (
      <main id="main-content" className="px-4 py-24 text-center text-muted-foreground">
        {message}
      </main>
    );
  }
}
