import { Hero } from "@/components/landing/hero";
import { SearchResults } from "@/components/landing/search-results";
import { WordOfDayCard } from "@/components/word-of-day/word-of-day-card";
import { CategoryCards } from "@/components/landing/category-cards";

export default function Home() {
  return (
    <main id="main-content" className="pb-24">
      <Hero />
      <SearchResults />
      <div className="px-4 py-6">
        <WordOfDayCard />
      </div>
      <CategoryCards />
    </main>
  );
}
