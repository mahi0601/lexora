import {
  Sprout,
  Library,
  BookMarked,
  Flame,
  Trophy,
  Brain,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { AchievementIcon } from "@/lib/achievements";
import { cn } from "@/lib/utils";

const ICONS: Record<AchievementIcon, LucideIcon> = {
  sprout: Sprout,
  library: Library,
  "book-marked": BookMarked,
  flame: Flame,
  trophy: Trophy,
  brain: Brain,
  "graduation-cap": GraduationCap,
};

export function AchievementBadge({
  title,
  description,
  icon,
  unlocked,
}: {
  title: string;
  description: string;
  icon: AchievementIcon;
  unlocked: boolean;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center",
        unlocked
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground"
      )}
    >
      <Icon className={cn("size-6", !unlocked && "opacity-40")} aria-hidden="true" />
      <div className="text-sm font-semibold">{title}</div>
      <p className={cn("text-xs", !unlocked && "opacity-70")}>{description}</p>
    </div>
  );
}
