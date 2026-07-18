"use client";

import * as React from "react";
import { CheckCircle2, XCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/actions/quiz";

export function QuizSession({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);

  const question = questions[index];

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.correctDefinition) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  if (!question) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
        <PartyPopper className="size-6 text-accent-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">Quiz complete</h2>
        <p className="text-sm text-muted-foreground">
          You scored {score} out of {questions.length}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Question {index + 1} of {questions.length} · Score {score}
      </p>

      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Which definition matches:</p>
        <h2 className="font-heading mt-1 text-3xl font-semibold tracking-tight">{question.word}</h2>
      </div>

      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const isCorrect = option === question.correctDefinition;
          const isPicked = option === selected;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              disabled={selected !== null}
              className={cn(
                "flex items-center justify-between gap-3 rounded-full border-2 border-foreground bg-card px-5 py-3 text-left text-sm font-medium transition-colors duration-150",
                !selected && "hover:bg-muted",
                selected && isCorrect && "border-success bg-success/10",
                selected && isPicked && !isCorrect && "border-destructive bg-destructive/10"
              )}
            >
              <span>{option}</span>
              {selected && isCorrect && (
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
              )}
              {selected && isPicked && !isCorrect && (
                <XCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <Button type="button" onClick={next} className="self-center">
          {index + 1 === questions.length ? "See results" : "Next question"}
        </Button>
      )}
    </div>
  );
}
