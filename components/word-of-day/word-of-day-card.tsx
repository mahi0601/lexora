"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getWordOfDay } from "@/actions/wordOfDay";
import type { WordResult } from "@/lib/ai/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function WordOfDayCard() {
  const [word, setWord] = React.useState<WordResult | null>(null);

  React.useEffect(() => {
    getWordOfDay().then(setWord).catch(() => setWord(null));
  }, []);

  return (
    <section
      aria-label="Word of the day"
      className="glass mx-auto w-full max-w-2xl rounded-card p-6 shadow-lg"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        Word of the Day
      </div>

      {!word ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-2xl">
              {word.emoji}
            </span>
            <h3 className="text-2xl font-semibold">{word.word}</h3>
            <Badge>{word.cefrLevel}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{word.pronunciation}</p>
          <p className="mt-2">{word.definition}</p>
          <p className="mt-2 text-sm italic text-muted-foreground">
            &ldquo;{word.exampleSentences[0]}&rdquo;
          </p>
          <p className="mt-3 text-sm">
            <span className="font-medium">Origin: </span>
            {word.originEtymology}
          </p>
        </>
      )}
    </section>
  );
}
