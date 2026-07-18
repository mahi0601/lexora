"use client";

import * as React from "react";
import { Star, Clock, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateWord, deleteWord, listWords } from "@/actions/words";
import { useMyWordsStore } from "@/store/useMyWordsStore";
import { MasteryMeter } from "@/components/my-words/mastery-meter";
import type { WordResult } from "@/lib/ai/schema";

type SavedWordRow = Awaited<ReturnType<typeof listWords>>[number];

const NO_COLLECTION = "__none__";

export function SavedWordCard({ word }: { word: SavedWordRow }) {
  const { refresh, collections } = useMyWordsStore();
  const data = word.data as unknown as WordResult;
  const [notes, setNotes] = React.useState(word.notes ?? "");
  const [tagDraft, setTagDraft] = React.useState("");
  const [tags, setTags] = React.useState(word.tags);

  async function toggleFavorite() {
    await updateWord(word.id, { isFavorite: !word.isFavorite });
    await refresh();
  }

  async function toggleReviewLater() {
    await updateWord(word.id, { reviewLater: !word.reviewLater });
    await refresh();
  }

  async function handleDelete() {
    if (!window.confirm(`Remove "${word.word}" from your saved words?`)) return;
    await deleteWord(word.id);
    await refresh();
  }

  async function handleNotesBlur() {
    if (notes !== (word.notes ?? "")) {
      await updateWord(word.id, { notes });
    }
  }

  async function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !tagDraft.trim()) return;
    e.preventDefault();
    const next = Array.from(new Set([...tags, tagDraft.trim()]));
    setTags(next);
    setTagDraft("");
    await updateWord(word.id, { tags: next });
  }

  async function removeTag(tag: string) {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    await updateWord(word.id, { tags: next });
  }

  async function handleCollectionChange(value: string | null) {
    await updateWord(word.id, {
      collectionId: !value || value === NO_COLLECTION ? null : value,
    });
    await refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-heading text-lg font-semibold">{word.word}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{data.definition}</p>
          <div className="mt-1.5">
            <MasteryMeter srsLevel={word.srsLevel} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={word.isFavorite ? "Unfavorite" : "Favorite"}
            aria-pressed={word.isFavorite}
            onClick={toggleFavorite}
          >
            <Star className="size-4" fill={word.isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={word.reviewLater ? "Remove from review later" : "Review later"}
            aria-pressed={word.reviewLater}
            onClick={toggleReviewLater}
          >
            <Clock className="size-4" fill={word.reviewLater ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${word.word}`}
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {word.isCustom && <Badge variant="secondary">Your word</Badge>}
        {word.difficulty && <Badge variant="outline">{word.difficulty}</Badge>}
        {word.cefrLevel && <Badge variant="outline">{word.cefrLevel}</Badge>}
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="rounded-full hover:bg-muted"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Input
        value={tagDraft}
        onChange={(e) => setTagDraft(e.target.value)}
        onKeyDown={addTag}
        placeholder="Add a tag and press Enter"
        aria-label={`Add a tag to ${word.word}`}
        className="h-8 text-sm"
      />

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleNotesBlur}
        placeholder="Add a personal note…"
        aria-label={`Notes for ${word.word}`}
        className="min-h-16 text-sm"
      />

      <Select
        value={word.collectionId ?? NO_COLLECTION}
        onValueChange={handleCollectionChange}
      >
        <SelectTrigger aria-label={`Collection for ${word.word}`} className="w-full">
          <SelectValue placeholder="No collection" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_COLLECTION}>No collection</SelectItem>
          {collections.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
