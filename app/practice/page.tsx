import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Brain, Shuffle, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Practice — Lexora",
};

const MODES: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    href: "/review",
    icon: RotateCcw,
    title: "Review",
    description: "Spaced-repetition flashcards for words due today.",
  },
  {
    href: "/quiz",
    icon: Brain,
    title: "Quiz",
    description: "Multiple-choice: match each word to its definition.",
  },
  {
    href: "/match",
    icon: Shuffle,
    title: "Match",
    description: "Pair up words and definitions against the clock.",
  },
];

export default function PracticePage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Practice
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Choose how you want to practice your saved words.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {MODES.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <mode.icon className="size-6" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {mode.title}
            </h2>
            <p className="text-sm text-muted-foreground">{mode.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
