"use client";

import * as React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getStreakSafe } from "@/actions/review";

export function StreakWidget() {
  const [streak, setStreak] = React.useState<Awaited<ReturnType<typeof getStreakSafe>>>(null);

  React.useEffect(() => {
    getStreakSafe().then(setStreak);
  }, []);

  if (!streak || streak.dueCount === 0) return null;

  return (
    <Link
      href="/review"
      className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-lg border border-accent bg-accent px-4 py-2.5 text-sm text-accent-foreground transition-opacity hover:opacity-90"
    >
      <Flame className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">
        {streak.currentStreak > 0 && (
          <>
            <strong className="font-semibold">{streak.currentStreak}-day streak</strong>
            {" · "}
          </>
        )}
        {streak.dueCount} word{streak.dueCount === 1 ? "" : "s"} due for review
      </span>
      <span className="shrink-0 font-medium">Review now →</span>
    </Link>
  );
}
