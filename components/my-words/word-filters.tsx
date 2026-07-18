"use client";

import { Search, Star, Clock, PenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyWordsStore } from "@/store/useMyWordsStore";
import { ExportMenu } from "@/components/my-words/export-menu";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/actions/words";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recently added",
  favorite: "Favorites first",
  difficulty: "Difficulty",
  alphabetical: "Alphabetical",
};

export function WordFilters() {
  const {
    search,
    setSearch,
    sort,
    setSort,
    onlyFavorites,
    toggleOnlyFavorites,
    onlyReviewLater,
    toggleOnlyReviewLater,
    onlyCustom,
    toggleOnlyCustom,
  } = useMyWordsStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[12rem] flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your words…"
          aria-label="Search saved words"
          className="pl-9"
        />
      </div>

      <Select value={sort} onValueChange={(v) => v && setSort(v as SortOption)}>
        <SelectTrigger aria-label="Sort saved words" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={onlyFavorites}
        onClick={toggleOnlyFavorites}
        className={cn(onlyFavorites && "bg-accent text-accent-foreground")}
      >
        <Star className="mr-2 size-4" fill={onlyFavorites ? "currentColor" : "none"} />
        Favorites
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={onlyReviewLater}
        onClick={toggleOnlyReviewLater}
        className={cn(onlyReviewLater && "bg-accent text-accent-foreground")}
      >
        <Clock className="mr-2 size-4" />
        Review later
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={onlyCustom}
        onClick={toggleOnlyCustom}
        className={cn(onlyCustom && "bg-accent text-accent-foreground")}
      >
        <PenLine className="mr-2 size-4" />
        Your words
      </Button>

      <ExportMenu />
    </div>
  );
}
