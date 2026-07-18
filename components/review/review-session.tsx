"use client";

import * as React from "react";
import { CheckCircle2, PartyPopper, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview, getReviewQueue } from "@/actions/review";

type QueueWord = Awaited<ReturnType<typeof getReviewQueue>>["words"][number];

export function ReviewSession({ initialWords }: { initialWords: QueueWord[] }) {
  const [queue, setQueue] = React.useState(initialWords);
  const [revealed, setRevealed] = React.useState(false);
  const [reviewedCount, setReviewedCount] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  const total = initialWords.length;
  const current = queue[0];

  async function handleAnswer(remembered: boolean) {
    if (!current || pending) return;
    setPending(true);
    await submitReview(current.id, remembered);
    setQueue((q) => q.slice(1));
    setReviewedCount((c) => c + 1);
    setRevealed(false);
    setPending(false);
  }

  if (!current) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
        <PartyPopper className="size-6 text-accent-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">
          {total === 0 ? "Nothing due right now" : "All caught up!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "Save a few words and they'll show up here when they're due for review."
            : `You reviewed ${reviewedCount} word${reviewedCount === 1 ? "" : "s"}. Come back tomorrow for more.`}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        {reviewedCount + 1} of {total} due today
      </p>

      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">{current.word}</h2>

        {revealed ? (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-base">{current.definition}</p>
            {current.exampleSentence && (
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{current.exampleSentence}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setRevealed(true)}
          >
            Show definition
          </Button>
        )}
      </div>

      {revealed && (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={pending}
            onClick={() => handleAnswer(false)}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Still learning
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={pending}
            onClick={() => handleAnswer(true)}
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Got it
          </Button>
        </div>
      )}
    </div>
  );
}
