import type { Metadata } from "next";
import { getReviewQueue } from "@/actions/review";
import { ReviewSession } from "@/components/review/review-session";

export const metadata: Metadata = {
  title: "Review — Lexora",
};

export default async function ReviewPage() {
  const { words } = await getReviewQueue();

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
