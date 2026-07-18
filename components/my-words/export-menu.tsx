"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportWords } from "@/actions/words";

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const MIME: Record<"markdown" | "json" | "csv" | "anki", string> = {
  markdown: "text/markdown",
  json: "application/json",
  csv: "text/csv",
  anki: "text/plain",
};

export function ExportMenu() {
  async function handleExport(format: "markdown" | "json" | "csv" | "anki") {
    const res = await exportWords(format);
    if (res.ok) {
      downloadFile(res.content, res.filename, MIME[format]);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("markdown")}>
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("anki")}>
          Anki import (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
