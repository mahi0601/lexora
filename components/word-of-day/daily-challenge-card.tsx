"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, Shuffle, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/widget/widget-card";
import {
  getDailyChallenge,
  submitDailyChallengeGuess,
  revealDailyChallenge,
  getPracticeWord,
} from "@/actions/dailyChallenge";

type Clue = Awaited<ReturnType<typeof getDailyChallenge>>;
type Solution = Awaited<ReturnType<typeof revealDailyChallenge>>;
type PracticeWordResult = Awaited<ReturnType<typeof getPracticeWord>>;
type PracticeWord = Extract<PracticeWordResult, { ok: true }>;

function PuzzlePrompt({
  partOfSpeech,
  wordLength,
  definition,
  exampleSentence,
}: {
  partOfSpeech: string[];
  wordLength: number;
  definition: string;
  exampleSentence: string | null;
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        {partOfSpeech?.join(", ")} · {wordLength} letters
      </p>
      <p className="mt-2 text-lg font-medium text-foreground">{definition}</p>
      {exampleSentence && (
        <p className="mt-2 text-sm text-muted-foreground italic">
          &ldquo;{exampleSentence}&rdquo;
        </p>
      )}
    </>
  );
}

export function DailyChallengeCard() {
  const [clue, setClue] = React.useState<Clue | null>(null);
  const [solution, setSolution] = React.useState<Solution | null>(null);
  const [guess, setGuess] = React.useState("");
  const [wrongCount, setWrongCount] = React.useState(0);
  const [pending, setPending] = React.useState(false);
  const [justRevealed, setJustRevealed] = React.useState(false);

  const [practice, setPractice] = React.useState<PracticeWord | null>(null);
  const [practiceGuess, setPracticeGuess] = React.useState("");
  const [practiceWrong, setPracticeWrong] = React.useState(0);
  const [practiceSolved, setPracticeSolved] = React.useState(false);
  const [practiceLoading, setPracticeLoading] = React.useState(false);
  const [practiceCount, setPracticeCount] = React.useState(0);
  const [practiceError, setPracticeError] = React.useState<string | null>(null);
  const [showWidget, setShowWidget] = React.useState(false);
  const seenWords = React.useRef<string[]>([]);

  React.useEffect(() => {
    getDailyChallenge().then(async (data) => {
      setClue(data);
      if (data.solvedToday) {
        const revealed = await revealDailyChallenge();
        setSolution(revealed);
        seenWords.current.push(revealed.word);
      }
    });
  }, []);

  async function handleGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!guess.trim() || pending) return;
    setPending(true);
    const res = await submitDailyChallengeGuess(guess);
    setPending(false);

    if (res.correct && res.word) {
      setSolution({
        word: res.word,
        definition: res.definition ?? "",
        pronunciation: res.pronunciation ?? "",
        originEtymology: res.originEtymology ?? "",
      });
      seenWords.current.push(res.word);
    } else {
      setWrongCount((c) => c + 1);
      setGuess("");
    }
  }

  async function handleReveal() {
    const revealed = await revealDailyChallenge();
    setSolution(revealed);
    setJustRevealed(true);
    seenWords.current.push(revealed.word);
  }

  async function loadPractice() {
    setPracticeLoading(true);
    setPracticeError(null);
    const res = await getPracticeWord(seenWords.current);
    if (res.ok) {
      seenWords.current.push(res.word);
      setPractice(res);
      setPracticeGuess("");
      setPracticeWrong(0);
      setPracticeSolved(false);
    } else {
      setPracticeError(res.error);
    }
    setPracticeLoading(false);
  }

  function handlePracticeGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!practice || !practiceGuess.trim()) return;
    if (practiceGuess.trim().toLowerCase() === practice.word.toLowerCase()) {
      setPracticeSolved(true);
      setPracticeCount((c) => c + 1);
    } else {
      setPracticeWrong((c) => c + 1);
      setPracticeGuess("");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <section
        id="daily-challenge"
        aria-label="Daily challenge"
        className="rounded-lg border border-accent bg-accent p-6 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="size-4" aria-hidden="true" />
          Daily Challenge
        </div>

        {!clue ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : solution ? (
          <>
            <div className="flex items-baseline gap-2">
              <h3 className="font-heading text-2xl font-semibold text-foreground">
                {solution.word}
              </h3>
              {justRevealed ? (
                <Badge variant="outline">Revealed</Badge>
              ) : (
                <Badge className="gap-1 bg-accent-foreground text-accent">
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                  Solved
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">{solution.pronunciation}</p>
            <p className="mt-2 text-foreground">{solution.definition}</p>
            {solution.originEtymology && (
              <p className="mt-3 text-sm">
                <span className="font-medium">Origin: </span>
                {solution.originEtymology}
              </p>
            )}
            {justRevealed && (
              <p className="mt-3 text-xs text-subtle-foreground">
                Revealing doesn&apos;t count toward your streak — come back tomorrow to guess fresh.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowWidget((v) => !v)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent-foreground underline-offset-4 hover:underline"
            >
              <ImageIcon className="size-3.5" aria-hidden="true" />
              {showWidget ? "Hide widget" : "Get as widget"}
            </button>
          </>
        ) : (
          <>
            <PuzzlePrompt
              partOfSpeech={clue.partOfSpeech}
              wordLength={clue.wordLength}
              definition={clue.definition}
              exampleSentence={clue.exampleSentence}
            />

            <form onSubmit={handleGuess} className="mt-4 flex gap-2">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type your guess…"
                aria-label="Your guess for today's word"
                className="min-w-0 flex-1 rounded-full border-2 border-foreground bg-card px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" disabled={pending || !guess.trim()}>
                Guess
              </Button>
            </form>

            {wrongCount > 0 && (
              <p className="mt-2 text-sm text-destructive">
                Not quite — try again{wrongCount >= 2 ? ", or reveal it below" : ""}.
              </p>
            )}

            <button
              type="button"
              onClick={handleReveal}
              className="mt-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Just show me
            </button>
          </>
        )}
      </section>

      {solution && showWidget && (
        <WidgetCard word={solution.word} definition={solution.definition} />
      )}

      {solution && !practice && (
        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={loadPractice}
            disabled={practiceLoading}
          >
            <Shuffle className="size-4" aria-hidden="true" />
            {practiceLoading ? "Finding a word…" : "Practice another word"}
          </Button>
          {practiceError && <p className="text-sm text-destructive">{practiceError}</p>}
        </div>
      )}

      {practice && (
        <section
          aria-label="Bonus practice"
          className="rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-3 text-sm font-medium text-muted-foreground">
            Practice{practiceCount > 0 ? ` · ${practiceCount} solved this session` : ""}
          </div>

          {practiceSolved ? (
            <>
              <h3 className="font-heading text-2xl font-semibold text-foreground">
                {practice.word}
              </h3>
              <p className="mt-1 text-muted-foreground">{practice.pronunciation}</p>
              <p className="mt-2 text-foreground">{practice.definition}</p>
              <Button
                type="button"
                variant="outline"
                onClick={loadPractice}
                disabled={practiceLoading}
                className="mt-4"
              >
                <Shuffle className="size-4" aria-hidden="true" />
                {practiceLoading ? "Finding a word…" : "Next word"}
              </Button>
              {practiceError && (
                <p className="mt-2 text-sm text-destructive">{practiceError}</p>
              )}
            </>
          ) : (
            <>
              <PuzzlePrompt
                partOfSpeech={practice.partOfSpeech}
                wordLength={practice.wordLength}
                definition={practice.definition}
                exampleSentence={practice.exampleSentence}
              />

              <form onSubmit={handlePracticeGuess} className="mt-4 flex gap-2">
                <input
                  value={practiceGuess}
                  onChange={(e) => setPracticeGuess(e.target.value)}
                  placeholder="Type your guess…"
                  aria-label="Your guess for this practice word"
                  className="min-w-0 flex-1 rounded-full border-2 border-foreground bg-card px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" disabled={!practiceGuess.trim()}>
                  Guess
                </Button>
              </form>

              {practiceWrong > 0 && (
                <p className="mt-2 text-sm text-destructive">
                  Not quite — try again{practiceWrong >= 2 ? ", or reveal it below" : ""}.
                </p>
              )}

              <button
                type="button"
                onClick={() => setPracticeSolved(true)}
                className="mt-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Just show me
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
