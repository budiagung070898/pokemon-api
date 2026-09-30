"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

interface TeamNameInputProps {
  name: string;
  onRename: (name: string) => void;
}

/** Inline editable team name; saves on blur or Enter, Escape cancels. */
export function TeamNameInput({ name, onRename }: TeamNameInputProps) {
  const [draft, setDraft] = useState(name);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) setDraft(name);
    else if (trimmed !== name) onRename(trimmed);
  };

  return (
    <label className="group flex items-center gap-2">
      <span className="sr-only">Team name</span>
      <input
        value={draft}
        maxLength={30}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setDraft(name);
            event.currentTarget.blur();
          }
        }}
        className="w-full max-w-xs rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-black text-foreground outline-none hover:border-border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      <Pencil className="size-4 text-muted-foreground" aria-hidden />
    </label>
  );
}
