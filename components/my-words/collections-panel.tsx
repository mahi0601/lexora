"use client";

import * as React from "react";
import { Share2, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCollection } from "@/actions/words";
import { shareCollection, unshareCollection } from "@/actions/sharing";
import { useMyWordsStore } from "@/store/useMyWordsStore";

export function CollectionsPanel() {
  const { collections, refreshCollections } = useMyWordsStore();
  const [name, setName] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createCollection(name.trim());
    setName("");
    await refreshCollections();
  }

  async function handleShare(id: string, alreadyShared: boolean) {
    if (alreadyShared) {
      await unshareCollection(id);
      await refreshCollections();
      return;
    }
    const res = await shareCollection(id);
    if (res.ok) {
      await refreshCollections();
      await navigator.clipboard.writeText(`${window.location.origin}/shared/${res.token}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">Collections</h2>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name…"
          aria-label="New collection name"
          className="h-8 text-sm"
        />
        <Button type="submit" size="sm" variant="outline">
          <Plus className="size-4" aria-hidden="true" />
          Add
        </Button>
      </form>

      {collections.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {collections.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-foreground">{c.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleShare(c.id, Boolean(c.shareToken))}
              >
                {copiedId === c.id ? (
                  <>
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    Link copied
                  </>
                ) : (
                  <>
                    <Share2 className="size-4" aria-hidden="true" />
                    {c.shareToken ? "Copy share link" : "Share"}
                  </>
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
