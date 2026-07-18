import { SRS_MAX_LEVEL } from "@/lib/srs";
import { cn } from "@/lib/utils";

const LABELS = ["New", "Learning", "Learning", "Familiar", "Familiar", "Mastered"];

export function MasteryMeter({ srsLevel }: { srsLevel: number }) {
  const level = Math.min(Math.max(srsLevel, 0), SRS_MAX_LEVEL);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" role="img" aria-label={`Mastery: ${LABELS[level]}`}>
        {Array.from({ length: SRS_MAX_LEVEL }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-3 rounded-full",
              i < level ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{LABELS[level]}</span>
    </div>
  );
}
