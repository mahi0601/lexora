import { SearchBar } from "@/components/landing/search-bar";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-4 pt-20 pb-8 text-center md:pt-28">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          Find the Perfect Word.
          <br />
          <span className="bg-gradient-to-r from-aurora-1 via-aurora-2 to-aurora-3 bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>
        <p className="max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Describe what you mean, use a rough phrase, or type a word in your
          own language. Lexora understands your intent and finds the exact
          English word you&apos;re looking for.
        </p>
      </div>
      <SearchBar />
    </section>
  );
}
