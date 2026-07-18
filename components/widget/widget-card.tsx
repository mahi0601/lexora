"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pickWidgetTheme, cssGradient } from "@/lib/widgetThemes";

const CANVAS_SIZE = 1080;

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fittedFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  maxWidth: number,
  startSize: number,
  minSize: number
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `700 ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

export function WidgetCard({
  word,
  definition,
}: {
  word: string;
  definition: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const headingRef = React.useRef<HTMLSpanElement>(null);
  const [downloading, setDownloading] = React.useState(false);

  const theme = React.useMemo(() => pickWidgetTheme(word), [word]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await document.fonts.ready;
      const fontFamily = headingRef.current
        ? getComputedStyle(headingRef.current).fontFamily
        : "serif";

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      theme.stops.forEach((s) => gradient.addColorStop(s.offset, s.color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.save();
      ctx.filter = "blur(90px)";
      ctx.fillStyle = theme.accentColor;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE * 0.15, CANVAS_SIZE * 0.85, 220, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE * 0.9, CANVAS_SIZE * 0.1, 260, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const padding = 90;
      const maxTextWidth = CANVAS_SIZE - padding * 2;

      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = `600 30px ${fontFamily}`;
      ctx.fillText("LEXORA", padding, padding);

      const wordSize = fittedFontSize(ctx, word, fontFamily, maxTextWidth, 130, 60);
      ctx.font = `700 ${wordSize}px ${fontFamily}`;
      ctx.fillStyle = "#ffffff";
      const wordY = CANVAS_SIZE * 0.62;
      ctx.fillText(word, padding, wordY);

      ctx.font = `400 36px ${fontFamily}`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      const lines = wrapCanvasText(ctx, definition, maxTextWidth).slice(0, 3);
      lines.forEach((line, i) => {
        ctx.fillText(line, padding, wordY + 60 + i * 46);
      });

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lexora-${word.toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
      <div
        className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg shadow-sm"
        style={{ background: cssGradient(theme) }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span
            ref={headingRef}
            className="font-heading mb-auto text-xs font-semibold tracking-wide text-white/75"
          >
            LEXORA
          </span>
          <h3 className="font-heading text-4xl font-bold break-words text-white">
            {word}
          </h3>
          <p className="mt-2 text-sm text-white/90">{definition}</p>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleDownload} disabled={downloading}>
        <Download className="size-4" aria-hidden="true" />
        {downloading ? "Preparing…" : "Download as widget"}
      </Button>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
