"use client";

import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface InlineEditInputProps {
  value: string;
  label: string;
  onSave: (value: string) => void;
  className?: string;
}

/** Inline editable heading text; saves on blur or Enter, Escape cancels. */
export function InlineEditInput({ value, label, onSave, className }: InlineEditInputProps) {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) setDraft(value);
    else if (trimmed !== value) onSave(trimmed);
  };

  return (
    <label className="group flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <input
        value={draft}
        maxLength={30}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setDraft(value);
            event.currentTarget.blur();
          }
        }}
        className={cn(
          "w-full max-w-xs rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-black text-foreground outline-none hover:border-border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className,
        )}
      />
      <Pencil className="size-4 text-muted-foreground" aria-hidden />
    </label>
  );
}
