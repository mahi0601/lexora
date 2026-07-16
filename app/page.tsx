import { Hero } from "@/components/landing/hero";
import { SearchResults } from "@/components/landing/search-results";
import { WordOfDayCard } from "@/components/word-of-day/word-of-day-card";
import { CategoryCards } from "@/components/landing/category-cards";
import { RecentSearches } from "@/components/landing/recent-searches";

export default function Home() {
  return (
    <main id="main-content" className="pb-12">
      <Hero />
      <SearchResults />
      <div className="px-4 py-8">
        <WordOfDayCard />
      </div>
      <CategoryCards />
      <RecentSearches />
    </main>
  );
}
