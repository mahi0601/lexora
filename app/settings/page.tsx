"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const APPEARANCE_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Manage your Lexora preferences.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Choose how Lexora looks on this device.
        </p>
        <div className="flex gap-2">
          {APPEARANCE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant="outline"
              onClick={() => setTheme(opt.value)}
              aria-pressed={mounted && theme === opt.value}
              className={cn(
                mounted && theme === opt.value && "border-primary bg-primary/5 text-primary"
              )}
            >
              <opt.icon className="size-4" aria-hidden="true" />
              {opt.label}
            </Button>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        More settings, including notification and account preferences, are
        coming soon.
      </p>
    </main>
  );
}
