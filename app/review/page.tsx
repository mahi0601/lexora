import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { getReviewQueue } from "@/actions/review";
import { UnauthenticatedError } from "@/lib/getOrCreateUser";
import { ReviewSession } from "@/components/review/review-session";

export const metadata: Metadata = {
  title: "Review — Lexora",
};

export default async function ReviewPage() {
  let words: Awaited<ReturnType<typeof getReviewQueue>>["words"];

  try {
    ({ words } = await getReviewQueue());
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return (
        <main id="main-content" className="mx-auto max-w-2xl px-4 py-16">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
            <LogIn className="size-6 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-foreground">Sign in required</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to review your saved words.
            </p>
          </div>
        </main>
      );
    }
    throw err;
  }

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Review
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          A quick pass over the words due today.
        </p>
      </div>
      <ReviewSession initialWords={words} />
    </main>
  );
}
