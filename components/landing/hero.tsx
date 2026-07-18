import { SearchBar } from "@/components/landing/search-bar";

export function Hero() {
  return (
    <section id="search" className="flex flex-col items-center gap-5 px-4 pt-14 pb-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-4xl">
          Find the perfect word
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Describe what you mean, use a rough phrase, or type a word in your
          own language — Lexora finds the exact English word you&apos;re
          looking for.
        </p>
      </div>
      <SearchBar />
    </section>
  );
}
