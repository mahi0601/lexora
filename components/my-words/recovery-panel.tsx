"use client";

import * as React from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrCreateRecoveryCode, restoreFromRecoveryCode } from "@/actions/recovery";

export function RecoveryPanel() {
  const [code, setCode] = React.useState<string | null>(null);
  const [loadingCode, setLoadingCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [restoreInput, setRestoreInput] = React.useState("");
  const [restoreError, setRestoreError] = React.useState<string | null>(null);
  const [restoring, setRestoring] = React.useState(false);

  async function handleGetCode() {
    setLoadingCode(true);
    setCode(await getOrCreateRecoveryCode());
    setLoadingCode(false);
  }

  async function handleCopy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleRestore(e: React.FormEvent) {
    e.preventDefault();
    setRestoring(true);
    setRestoreError(null);
    const res = await restoreFromRecoveryCode(restoreInput);
    if (res.ok) {
      window.location.reload();
      return;
    }
    setRestoreError(res.error);
    setRestoring(false);
  }

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Back up your words</h2>
        <p className="text-xs text-muted-foreground">
          Your words live on this browser only — no account required. Get a
          code so you can bring them to a new device before you lose access
          to this one.
        </p>
        {code ? (
          <div className="flex items-center gap-2">
            <code className="rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-sm tracking-wide text-foreground">
              {code}
            </code>
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCode}
            disabled={loadingCode}
            className="self-start"
          >
            <KeyRound className="size-4" aria-hidden="true" />
            {loadingCode ? "Generating…" : "Get my code"}
          </Button>
        )}
      </div>

      <form onSubmit={handleRestore} className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Restore on this device</h2>
        <p className="text-xs text-muted-foreground">
          Have a code from another device? Entering it replaces anything
          saved on this device with that code&apos;s words.
        </p>
        <div className="flex gap-2">
          <Input
            value={restoreInput}
            onChange={(e) => setRestoreInput(e.target.value)}
            placeholder="XXXX-XXXX"
            aria-label="Recovery code"
            className="font-mono"
          />
          <Button type="submit" size="sm" disabled={restoring || !restoreInput.trim()}>
            Restore
          </Button>
        </div>
        {restoreError && <p className="text-xs text-destructive">{restoreError}</p>}
      </form>
    </div>
  );
}
