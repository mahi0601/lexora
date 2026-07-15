import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Lexora
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
