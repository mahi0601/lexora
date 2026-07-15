import { z } from "zod";

export const DifficultyLevel = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const CefrLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

export const Frequency = z.enum([
  "very-common",
  "common",
  "uncommon",
  "rare",
  "very-rare",
]);

export const AlternateWordSchema = z.object({
  word: z.string(),
  confidencePercent: z.number().min(0).max(100),
  reason: z.string(),
});

// What we ask the model to produce and validate its raw output against.
// Deliberately excludes provenance fields (aiGenerated/modelUsed/generatedAt) —
// the model can't reliably know the current timestamp or its own model id, so
// lib/ai.ts attaches those itself after validating this content shape.
export const WordResultContentSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  ipa: z.string(),
  partOfSpeech: z.array(z.string()).min(1),
  definition: z.string(),
  extendedExplanation: z.string(),
  difficultyLevel: DifficultyLevel,
  cefrLevel: CefrLevel,
  frequency: Frequency,
  originEtymology: z.string(),
  commonContexts: z.array(z.string()),
  formalityNote: z.string(),
  regionalNote: z.string(),
  exampleSentences: z.array(z.string()).min(2),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
  relatedWords: z.array(z.string()),
  similarExpressions: z.array(z.string()),
  emoji: z.string(),
  matchExplanation: z.string(),
  alternates: z.array(AlternateWordSchema).max(6),
});

// Provenance — lets the UI honestly label CEFR/difficulty/frequency as
// AI-estimated rather than certified corpus data.
export const WordResultProvenanceSchema = z.object({
  aiGenerated: z.literal(true),
  modelUsed: z.string(),
  generatedAt: z.string(),
});

export const WordResultSchema = WordResultContentSchema.merge(
  WordResultProvenanceSchema
);

export type WordResultContent = z.infer<typeof WordResultContentSchema>;
export type WordResult = z.infer<typeof WordResultSchema>;
export type AlternateWord = z.infer<typeof AlternateWordSchema>;

export function describeSchemaForRepair(): string {
  return `{
  word: string, pronunciation: string, ipa: string, partOfSpeech: string[],
  definition: string, extendedExplanation: string,
  difficultyLevel: "beginner"|"intermediate"|"advanced"|"expert",
  cefrLevel: "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  frequency: "very-common"|"common"|"uncommon"|"rare"|"very-rare",
  originEtymology: string, commonContexts: string[],
  formalityNote: string, regionalNote: string,
  exampleSentences: string[] (min 2), synonyms: string[], antonyms: string[],
  relatedWords: string[], similarExpressions: string[], emoji: string,
  matchExplanation: string,
  alternates: { word: string, confidencePercent: number, reason: string }[] (max 6)
}`;
}
