import { cn } from "@/lib/utils";

function intensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-primary/30";
  if (count <= 3) return "bg-primary/60";
  return "bg-primary";
}

export function ActivityHeatmap({
  days,
}: {
  days: { date: string; count: number }[];
}) {
  const columns: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div
      className="flex gap-1 overflow-x-auto pb-1"
      role="img"
      aria-label="Review activity over the last few months"
    >
      {columns.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} review${day.count === 1 ? "" : "s"}`}
              className={cn("size-3 shrink-0 rounded-sm", intensityClass(day.count))}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
