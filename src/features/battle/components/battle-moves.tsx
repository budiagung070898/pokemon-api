import { getTypeColor } from "@/constant/pokemon-type-color";
import { Combatant, hasUsableMove, STRUGGLE } from "@/lib/battle-engine";
import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";

interface BattleMovesProps {
  pokemon: Combatant;
  disabled: boolean;
  onSelect: (index: number) => void;
}

export function BattleMoves({ pokemon, disabled, onSelect }: BattleMovesProps) {
  if (!hasUsableMove(pokemon)) {
    return (
      <MoveButton
        name={STRUGGLE.name}
        detail="No PP left — last resort"
        color="#71717a"
        disabled={disabled}
        onClick={() => onSelect(-1)}
      />
    );
  }

  return (
    <div role="group" aria-label="Choose a move" className="grid grid-cols-2 gap-2">
      {pokemon.moves.map((move, index) => (
        <MoveButton
          key={move.name}
          name={move.name}
          type={move.type}
          detail={`${formatName(move.category)} · ${move.power} pow · ${move.accuracy ?? "—"}% acc`}
          pp={`${pokemon.pp[index]}/${move.maxPp}`}
          color={getTypeColor(move.type).bg}
          disabled={disabled || pokemon.pp[index] === 0}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}

interface MoveButtonProps {
  name: string;
  type?: string;
  detail: string;
  pp?: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
}

function MoveButton({ name, type, detail, pp, color, disabled, onClick }: MoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ borderLeftColor: color }}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col items-start gap-0.5 rounded-2xl border border-l-[6px] bg-card px-3 py-2.5 text-left outline-none transition",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-0",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
      )}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="truncate font-bold text-foreground">{formatName(name)}</span>
        {pp && <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">PP {pp}</span>}
      </span>
      <span className="flex w-full min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
        {type && (
          <span className="font-bold uppercase" style={{ color }}>
            {type}
          </span>
        )}
        <span className="truncate">{detail}</span>
      </span>
    </button>
  );
}
