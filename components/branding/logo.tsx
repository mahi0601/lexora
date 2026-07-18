import { cn } from "@/lib/utils";

/**
 * The Lexora mark: a teal L with a coral-lit terminal — the moment a word
 * gets highlighted the instant you find it. Colors are fixed (not theme
 * tokens) so the mark reads the same in light and dark mode.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-8", className)}
      role="img"
      aria-label="Lexora"
    >
      <rect width="40" height="40" rx="10" fill="#4F918D" />
      <rect x="12" y="9" width="5" height="21.5" rx="1.5" fill="#FFFFFF" />
      <rect x="12" y="25.5" width="11" height="5" rx="1.5" fill="#FFFFFF" />
      <rect x="23.5" y="25.5" width="5" height="5" rx="1.5" fill="#E8836F" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="font-heading text-base font-semibold tracking-tight text-foreground">
        Lexora
      </span>
    </span>
  );
}
