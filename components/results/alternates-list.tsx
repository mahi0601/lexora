import type { AlternateWord } from "@/lib/ai/schema";

export function AlternatesList({
  alternates,
  onSelect,
}: {
  alternates: AlternateWord[];
  onSelect?: (word: string) => void;
}) {
  if (alternates.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
        You may also mean
      </h3>
      <ul className="flex flex-col gap-2">
        {alternates
          .slice()
          .sort((a, b) => b.confidencePercent - a.confidencePercent)
          .map((alt) => (
            <li key={alt.word}>
              <button
                type="button"
                onClick={() => onSelect?.(alt.word)}
                className="glass flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="font-medium">{alt.word}</span>
                <span className="ml-auto shrink-0 text-sm text-muted-foreground">
                  {alt.confidencePercent}%
                </span>
                <span className="hidden max-w-[16rem] truncate text-sm text-muted-foreground md:inline">
                  {alt.reason}
                </span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
