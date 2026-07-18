export interface AchievementStats {
  totalSaved: number;
  totalReviewed: number;
  longestStreak: number;
}

export type AchievementIcon =
  | "sprout"
  | "library"
  | "book-marked"
  | "flame"
  | "trophy"
  | "brain"
  | "graduation-cap";

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: AchievementIcon;
  isUnlocked: (stats: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "first-word",
    title: "First Word",
    description: "Save your first word.",
    icon: "sprout",
    isUnlocked: (s) => s.totalSaved >= 1,
  },
  {
    key: "word-collector",
    title: "Word Collector",
    description: "Save 10 words.",
    icon: "library",
    isUnlocked: (s) => s.totalSaved >= 10,
  },
  {
    key: "lexicon-builder",
    title: "Lexicon Builder",
    description: "Save 50 words.",
    icon: "book-marked",
    isUnlocked: (s) => s.totalSaved >= 50,
  },
  {
    key: "three-day-streak",
    title: "On a Roll",
    description: "Reach a 3-day review streak.",
    icon: "flame",
    isUnlocked: (s) => s.longestStreak >= 3,
  },
  {
    key: "week-warrior",
    title: "Week Warrior",
    description: "Reach a 7-day review streak.",
    icon: "trophy",
    isUnlocked: (s) => s.longestStreak >= 7,
  },
  {
    key: "review-rookie",
    title: "Review Rookie",
    description: "Complete 10 reviews.",
    icon: "brain",
    isUnlocked: (s) => s.totalReviewed >= 10,
  },
  {
    key: "review-master",
    title: "Review Master",
    description: "Complete 100 reviews.",
    icon: "graduation-cap",
    isUnlocked: (s) => s.totalReviewed >= 100,
  },
];
