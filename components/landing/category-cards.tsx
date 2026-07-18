import Link from "next/link";
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
import { CATEGORIES } from "@/lib/categories";

const ICONS: Record<string, LucideIcon> = {
  emotions: Heart,
  literature: BookOpen,
  psychology: Brain,
  business: Briefcase,
  technology: Laptop,
  law: Scale,
  nature: Leaf,
  medical: Stethoscope,
  travel: Plane,
  academic: GraduationCap,
  music: Music,
  idioms: Puzzle,
  "rare-words": Sparkles,
  slang: MessageCircle,
};

export function CategoryCards() {
  return (
    <section id="categories" aria-label="Browse by category" className="px-4 py-8">
      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Or browse by category
      </h2>
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => {
          const Icon = ICONS[category.slug];
          return (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center gap-2 rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Icon className="size-4" aria-hidden="true" />
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
