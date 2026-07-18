"use client";

import * as React from "react";
import { Copy, Check, Share2, Volume2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSpeechSynthesis } from "@/components/results/use-speech-synthesis";
import { toggleFavoriteFromResult } from "@/actions/words";
import type { WordResult } from "@/lib/ai/schema";

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function WordActions({ result }: { result: WordResult }) {
  const { speak } = useSpeechSynthesis();
  const [copied, setCopied] = React.useState(false);
  const [favorited, setFavorited] = React.useState(false);
  const [favoriteNote, setFavoriteNote] = React.useState<string | null>(null);

  async function handleFavorite() {
    try {
      const res = await toggleFavoriteFromResult(result);
      setFavorited(res.isFavorite);
    } catch {
      setFavoriteNote("Couldn't save — try again");
      setTimeout(() => setFavoriteNote(null), 1500);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${result.word} — ${result.definition}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/word/${encodeURIComponent(result.word)}`
        : "";
    if (navigator.share) {
      await navigator.share({ title: result.word, text: result.definition, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <ActionButton
        label={favoriteNote ?? (favorited ? "Unfavorite" : "Favorite")}
        onClick={handleFavorite}
      >
        <Heart
          className={favorited ? "size-4 text-destructive" : "size-4"}
          fill={favorited ? "currentColor" : "none"}
        />
      </ActionButton>

      <ActionButton label={copied ? "Copied!" : "Copy"} onClick={handleCopy}>
        {copied ? (
          <Check className="size-4 text-primary" />
        ) : (
          <Copy className="size-4" />
        )}
      </ActionButton>

      <ActionButton label="Listen" onClick={() => speak(result.word)}>
        <Volume2 className="size-4" />
      </ActionButton>

      <ActionButton label="Share" onClick={handleShare}>
        <Share2 className="size-4" />
      </ActionButton>
    </div>
  );
}
