"use client";

import * as React from "react";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchPair } from "@/actions/match";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function MatchGame({ pairs }: { pairs: MatchPair[] }) {
  const [words] = React.useState(() => shuffle(pairs));
  const [definitions] = React.useState(() => shuffle(pairs));
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [selectedDef, setSelectedDef] = React.useState<string | null>(null);
  const [matched, setMatched] = React.useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = React.useState<{ word: string; def: string } | null>(null);
  const [moves, setMoves] = React.useState(0);

  function pickWord(id: string) {
    if (matched.has(id) || wrongPair) return;
    setSelectedWord(id);
    if (selectedDef) evaluate(id, selectedDef);
  }

  function pickDef(id: string) {
    if (matched.has(id) || wrongPair) return;
    setSelectedDef(id);
    if (selectedWord) evaluate(selectedWord, id);
  }

  function evaluate(wordId: string, defId: string) {
    setMoves((m) => m + 1);
    if (wordId === defId) {
      setMatched((m) => new Set(m).add(wordId));
      setSelectedWord(null);
      setSelectedDef(null);
    } else {
      setWrongPair({ word: wordId, def: defId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWord(null);
        setSelectedDef(null);
      }, 600);
    }
  }

  const complete = matched.size === pairs.length;

  if (complete) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
        <PartyPopper className="size-6 text-accent-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">All matched!</h2>
        <p className="text-sm text-muted-foreground">
          {pairs.length} pairs in {moves} move{moves === 1 ? "" : "s"}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Matched {matched.size} of {pairs.length} · {moves} move{moves === 1 ? "" : "s"}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {words.map((w) => (
            <button
              key={w.id}
              type="button"
              disabled={matched.has(w.id)}
              onClick={() => pickWord(w.id)}
              className={cn(
                "rounded-lg border-2 border-foreground bg-card px-4 py-3 text-left text-sm font-medium transition-colors duration-150",
                matched.has(w.id) && "border-success bg-success/10 text-muted-foreground",
                selectedWord === w.id && !matched.has(w.id) && "border-primary bg-accent",
                wrongPair?.word === w.id && "border-destructive bg-destructive/10",
                !matched.has(w.id) && "hover:bg-muted"
              )}
            >
              {w.word}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {definitions.map((d) => (
            <button
              key={d.id}
              type="button"
              disabled={matched.has(d.id)}
              onClick={() => pickDef(d.id)}
              className={cn(
                "rounded-lg border-2 border-foreground bg-card px-4 py-3 text-left text-sm transition-colors duration-150",
                matched.has(d.id) && "border-success bg-success/10 text-muted-foreground",
                selectedDef === d.id && !matched.has(d.id) && "border-primary bg-accent",
                wrongPair?.def === d.id && "border-destructive bg-destructive/10",
                !matched.has(d.id) && "hover:bg-muted"
              )}
            >
              {d.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
