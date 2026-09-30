import { BattleState } from "@/lib/battle-engine";
import { BattleView } from "../lib/battle-view";
import { BattleEffectText } from "./battle-effect-text";
import { BattlePokemon } from "./battle-pokemon";

interface BattleArenaProps {
  state: BattleState;
  view: BattleView;
  eventKey: number;
}

export function BattleArena({ state, view, eventKey }: BattleArenaProps) {
  return (
    <section
      aria-label="Battle arena"
      className="relative overflow-hidden rounded-[2rem] border bg-linear-to-b from-sky-100 via-sky-50 to-emerald-100 p-4 sm:p-8 dark:from-indigo-950 dark:via-slate-900 dark:to-emerald-950"
    >
      <p className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs font-bold text-muted-foreground backdrop-blur">
        Turn {view.turn}
      </p>
      <div className="space-y-2 sm:space-y-0 [&>*:last-child]:sm:-mt-20">
        <BattlePokemon
          side="opponent"
          pokemon={state.opponent}
          hp={view.hp.opponent}
          fainted={view.fainted.opponent}
          current={view.current}
          eventKey={eventKey}
        />
        <BattlePokemon
          side="player"
          pokemon={state.player}
          hp={view.hp.player}
          fainted={view.fainted.player}
          current={view.current}
          eventKey={eventKey}
        />
      </div>
      <BattleEffectText current={view.current} eventKey={eventKey} />
    </section>
  );
}
