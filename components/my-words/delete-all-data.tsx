"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAllMyData } from "@/actions/recovery";

export function DeleteAllData() {
  const [pending, setPending] = React.useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete every word, collection, streak, and badge on this device? This can't be undone unless you've saved a recovery code."
      )
    ) {
      return;
    }
    setPending(true);
    await deleteAllMyData();
    window.location.href = "/";
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <h2 className="text-sm font-semibold text-foreground">Delete all my data</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Permanently removes every word, collection, streak, and badge tied to
        this device.
      </p>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={pending}
        className="mt-3"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {pending ? "Deleting…" : "Delete everything"}
      </Button>
    </div>
  );
}
