"use client";

import {
  Heart,
  BookOpen,
  Brain,
  Briefcase,
  Laptop,
  Scale,
  Leaf,
  Stethoscope,
  Plane,
  GraduationCap,
  Music,
  Puzzle,
  Sparkles,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";

const CATEGORIES: { icon: LucideIcon; name: string }[] = [
  { icon: Heart, name: "Emotions" },
  { icon: BookOpen, name: "Literature" },
  { icon: Brain, name: "Psychology" },
  { icon: Briefcase, name: "Business" },
  { icon: Laptop, name: "Technology" },
  { icon: Scale, name: "Law" },
  { icon: Leaf, name: "Nature" },
  { icon: Stethoscope, name: "Medical" },
  { icon: Plane, name: "Travel" },
  { icon: GraduationCap, name: "Academic" },
  { icon: Music, name: "Music" },
  { icon: Puzzle, name: "Idioms" },
  { icon: Sparkles, name: "Rare Words" },
  { icon: MessageCircle, name: "Slang" },
];

export function CategoryCards() {
  const { categoryHint, setCategoryHint } = useSearchStore();

  return (
    <section id="categories" aria-label="Browse by category" className="px-4 py-8">
      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Or browse by category
      </h2>
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => {
          const active = categoryHint === category.name;
          return (
            <li key={category.name}>
              <button
                type="button"
                onClick={() =>
                  setCategoryHint(active ? null : category.name)
                }
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-transparent text-foreground hover:bg-muted"
                )}
              >
                <category.icon className="size-4" aria-hidden="true" />
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
