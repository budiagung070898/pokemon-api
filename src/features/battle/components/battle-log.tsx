import { cn } from "@/lib/utils";
import { LogLine } from "../lib/battle-view";

const TONES: Record<NonNullable<LogLine["tone"]>, string> = {
  turn: "pt-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase",
  good: "font-bold text-rose-600 dark:text-rose-400",
  bad: "font-bold text-foreground",
  crit: "font-bold text-amber-600 dark:text-amber-400",
  muted: "text-muted-foreground",
};

/**
 * Newest line at the bottom. `flex-col-reverse` keeps the scroll anchored to
 * the latest entry without any scroll effect.
 */
export function BattleLog({ lines }: { lines: LogLine[] }) {
  return (
    <section aria-label="Battle log" className="flex h-56 flex-col rounded-2xl border bg-card">
      <h2 className="border-b px-4 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Battle log
      </h2>
      <div className="flex flex-1 flex-col-reverse overflow-y-auto px-4 py-2">
        <ol aria-live="polite" className="space-y-1 text-sm">
          {lines.length === 0 && <li className="text-muted-foreground">Choose a move to begin!</li>}
          {lines.map((line) => (
            <li
              key={line.id}
              className={cn(line.tone && TONES[line.tone])}
            >
              {line.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
