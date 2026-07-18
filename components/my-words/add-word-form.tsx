"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCustomWord } from "@/actions/words";
import { useMyWordsStore } from "@/store/useMyWordsStore";

export function AddWordForm() {
  const refresh = useMyWordsStore((s) => s.refresh);
  const [open, setOpen] = React.useState(false);
  const [word, setWord] = React.useState("");
  const [definition, setDefinition] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await addCustomWord({ word, definition });
    setPending(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    setWord("");
    setDefinition("");
    setOpen(false);
    await refresh();
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" />
        Add your own word
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
    >
      <Input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Word"
        aria-label="Word"
        autoFocus
      />
      <Input
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
        placeholder="Your definition"
        aria-label="Your definition"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending || !word.trim() || !definition.trim()}>
          Save
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
