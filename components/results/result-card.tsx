"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WordActions } from "@/components/results/word-actions";
import { AlternatesList } from "@/components/results/alternates-list";
import type { WordResult } from "@/lib/ai/schema";

function WordList({ title, words }: { title: string; words: string[] }) {
  if (words.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <Badge key={w} variant="secondary">
            {w}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ResultCard({
  result,
  onSelectAlternate,
}: {
  result: WordResult;
  onSelectAlternate?: (word: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      role="region"
      aria-live="polite"
      aria-label={`Result for ${result.word}`}
      className="mx-auto w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              {result.word}
            </h2>
          </div>
          <p className="mt-1 text-muted-foreground">
            {result.pronunciation} · <span lang="und">{result.ipa}</span> ·{" "}
            {result.partOfSpeech.join(", ")}
          </p>
        </div>
        <WordActions result={result} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{result.cefrLevel}</Badge>
        <Badge variant="outline">{result.difficultyLevel}</Badge>
        <Badge variant="outline">{result.frequency.replace("-", " ")}</Badge>
      </div>

      <p className="mt-4 text-lg">{result.definition}</p>
      <p className="mt-2 text-muted-foreground">{result.extendedExplanation}</p>

      <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-sm text-foreground">
        <span className="font-medium">Why this word: </span>
        {result.matchExplanation}
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Examples
        </h3>
        <ul className="flex flex-col gap-2">
          {result.exampleSentences.map((s, i) => (
            <li key={i} className="text-sm italic">
              &ldquo;{s}&rdquo;
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-5" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-medium text-muted-foreground">
            Origin
          </h3>
          <p className="text-sm">{result.originEtymology}</p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-medium text-muted-foreground">
            Usage notes
          </h3>
          <p className="text-sm">{result.formalityNote}</p>
          <p className="text-sm">{result.regionalNote}</p>
        </div>
      </div>

      {result.commonContexts.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1 text-sm font-medium text-muted-foreground">
            Common contexts
          </h3>
          <p className="text-sm">{result.commonContexts.join(" · ")}</p>
        </div>
      )}

      <Separator className="my-5" />

      <div className="grid gap-4 sm:grid-cols-2">
        <WordList title="Synonyms" words={result.synonyms} />
        <WordList title="Antonyms" words={result.antonyms} />
        <WordList title="Related words" words={result.relatedWords} />
        <WordList title="Similar expressions" words={result.similarExpressions} />
      </div>

      <AlternatesList
        alternates={result.alternates}
        onSelect={onSelectAlternate}
      />

      <p className="mt-6 text-xs text-subtle-foreground">
        CEFR level, difficulty, and frequency are AI-estimated, not sourced
        from a certified linguistic corpus.
      </p>
    </motion.div>
  );
}
