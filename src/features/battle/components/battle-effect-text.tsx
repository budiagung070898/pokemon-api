import { BattleEvent } from "@/lib/battle-engine";
import { cn } from "@/lib/utils";

function getEffect(event: BattleEvent | null) {
  if (event?.kind === "damage" && event.critical) {
    return { text: "Critical hit!", className: "bg-amber-400 text-amber-950" };
  }
  if (event?.kind === "damage" && event.effectiveness > 1) {
    return { text: "Super effective!", className: "bg-rose-500 text-white" };
  }
  if (event?.kind === "damage" && event.effectiveness < 1) {
    return { text: "Not very effective…", className: "bg-zinc-600 text-white" };
  }
  if (event?.kind === "miss") return { text: "Missed!", className: "bg-zinc-600 text-white" };
  if (event?.kind === "no-effect") return { text: "No effect", className: "bg-zinc-600 text-white" };
  return null;
}

/** Big floating callout in the middle of the arena; decorative (the log announces it). */
export function BattleEffectText({ current, eventKey }: { current: BattleEvent | null; eventKey: number }) {
  const effect = getEffect(current);
  if (!effect) return null;

  return (
    <span
      key={eventKey}
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 animate-[battle-pop_0.9s_ease-out_forwards] rounded-full px-4 py-2 text-sm font-black tracking-wide uppercase shadow-lg sm:text-lg",
        effect.className,
      )}
    >
      {effect.text}
    </span>
  );
}
