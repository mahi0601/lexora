import * as groq from "@/lib/ai/providers/groq";
import {
  WordResultContentSchema,
  describeSchemaForRepair,
  type WordResult,
  type WordResultContent,
} from "@/lib/ai/schema";
import {
  WORD_SEARCH_SYSTEM_PROMPT,
  WORD_OF_DAY_SYSTEM_PROMPT,
  buildWordSearchUserPrompt,
  buildWordOfDayUserPrompt,
  buildRepairPrompt,
} from "@/lib/ai/prompts";

export class AIGenerationError extends Error {}

// Everything provider-specific is isolated behind this single `complete()`
// call. Swapping providers later means writing a new file with the same
// signature and changing this one import — no call sites elsewhere change.
const provider = groq;

function extractJsonObject(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return candidate.trim();
  return candidate.slice(start, end + 1);
}

async function completeWithRepair(
  system: string,
  user: string
): Promise<WordResultContent> {
  let lastRaw = "";

  for (let attempt = 0; attempt < 3; attempt++) {
    const raw =
      attempt === 0
        ? await provider.complete(system, user)
        : await provider.complete(
            system,
            buildRepairPrompt(lastRaw, describeSchemaForRepair())
          );
    lastRaw = raw;

    const jsonText = extractJsonObject(raw);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      continue;
    }

    const result = WordResultContentSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
  }

  throw new AIGenerationError(
    "The AI did not return a result matching the expected format. Please try again."
  );
}

function attachProvenance(content: WordResultContent): WordResult {
  return {
    ...content,
    aiGenerated: true,
    modelUsed: provider.modelName,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateWordResult(input: {
  query: string;
  categoryHint?: string;
}): Promise<WordResult> {
  const content = await completeWithRepair(
    WORD_SEARCH_SYSTEM_PROMPT,
    buildWordSearchUserPrompt(input)
  );
  return attachProvenance(content);
}

export async function generateWordOfDay(dateISO: string): Promise<WordResult> {
  const content = await completeWithRepair(
    WORD_OF_DAY_SYSTEM_PROMPT,
    buildWordOfDayUserPrompt(dateISO)
  );
  return attachProvenance(content);
}
