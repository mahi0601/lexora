import type { Metadata } from "next";
import { LogIn, Flame } from "lucide-react";
import { getStreak } from "@/actions/review";
import { getAchievements } from "@/actions/achievements";
import { getActivityHeatmap } from "@/actions/progress";
import { UnauthenticatedError } from "@/lib/getOrCreateUser";
import { AchievementBadge } from "@/components/progress/achievement-badge";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";

export const metadata: Metadata = {
  title: "Progress — Lexora",
};

export default async function ProgressPage() {
  let streak: Awaited<ReturnType<typeof getStreak>>;
  let achievements: Awaited<ReturnType<typeof getAchievements>>;
  let heatmap: Awaited<ReturnType<typeof getActivityHeatmap>>;

  try {
    [streak, achievements, heatmap] = await Promise.all([
      getStreak(),
      getAchievements(),
      getActivityHeatmap(),
    ]);
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return (
        <main id="main-content" className="mx-auto max-w-2xl px-4 py-16">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
            <LogIn className="size-6 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-foreground">Sign in required</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to see your streak, badges, and review history.
            </p>
          </div>
        </main>
      );
    }
    throw err;
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Progress
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Your streak, review history, and badges.
        </p>
      </div>

      <section className="mb-10 flex items-center gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Flame className="size-6" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading text-2xl font-semibold">{streak.currentStreak} days</p>
          <p className="text-sm text-muted-foreground">
            Current streak · longest {streak.longestStreak} days
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-foreground">Review activity</h2>
        <ActivityHeatmap days={heatmap} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-foreground">Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {achievements.map((a) => (
            <AchievementBadge
              key={a.key}
              title={a.title}
              description={a.description}
              icon={a.icon}
              unlocked={a.unlocked}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
