"use client";

import { motion } from "framer-motion";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { emoji: "❤️", name: "Emotions" },
  { emoji: "📚", name: "Literature" },
  { emoji: "🧠", name: "Psychology" },
  { emoji: "💼", name: "Business" },
  { emoji: "💻", name: "Technology" },
  { emoji: "⚖️", name: "Law" },
  { emoji: "🌿", name: "Nature" },
  { emoji: "🏥", name: "Medical" },
  { emoji: "✈️", name: "Travel" },
  { emoji: "🎓", name: "Academic" },
  { emoji: "🎵", name: "Music" },
  { emoji: "🧩", name: "Idioms" },
  { emoji: "✨", name: "Rare Words" },
  { emoji: "😎", name: "Slang" },
];

export function CategoryCards() {
  const { categoryHint, setCategoryHint } = useSearchStore();

  return (
    <section aria-label="Browse by category" className="px-4 py-10">
      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Or browse by category
      </h2>
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5">
        {CATEGORIES.map((category) => {
          const active = categoryHint === category.name;
          return (
            <li key={category.name}>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setCategoryHint(active ? null : category.name)
                }
                aria-pressed={active}
                className={cn(
                  "glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span aria-hidden="true">{category.emoji}</span>
                {category.name}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
