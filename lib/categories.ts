export interface CategoryDef {
  slug: string;
  name: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "emotions", name: "Emotions" },
  { slug: "literature", name: "Literature" },
  { slug: "psychology", name: "Psychology" },
  { slug: "business", name: "Business" },
  { slug: "technology", name: "Technology" },
  { slug: "law", name: "Law" },
  { slug: "nature", name: "Nature" },
  { slug: "medical", name: "Medical" },
  { slug: "travel", name: "Travel" },
  { slug: "academic", name: "Academic" },
  { slug: "music", name: "Music" },
  { slug: "idioms", name: "Idioms" },
  { slug: "rare-words", name: "Rare Words" },
  { slug: "slang", name: "Slang" },
];

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
