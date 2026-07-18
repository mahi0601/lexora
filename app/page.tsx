import { Hero } from "@/components/landing/hero";
import { SearchResults } from "@/components/landing/search-results";
import { DailyChallengeCard } from "@/components/word-of-day/daily-challenge-card";
import { CategoryCards } from "@/components/landing/category-cards";
import { RecentSearches } from "@/components/landing/recent-searches";
import { LogoSplash } from "@/components/branding/logo-splash";
import { StreakWidget } from "@/components/review/streak-widget";
import { TrendingWords } from "@/components/landing/trending-words";

export default function Home() {
  return (
    <main id="main-content" className="pb-12">
      <LogoSplash />
      <div className="flex flex-col gap-4 px-4 pt-8">
        <StreakWidget />
        <DailyChallengeCard />
      </div>
      <Hero />
      <SearchResults />
      <TrendingWords />
      <CategoryCards />
      <RecentSearches />
    </main>
  );
}
