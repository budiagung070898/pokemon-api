import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { BattleEvent, Combatant, Side } from "@/lib/battle-engine";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BattleHealthBar } from "./battle-health-bar";

interface BattlePokemonProps {
  side: Side;
  pokemon: Combatant;
  hp: number;
  fainted: boolean;
  /** Event being animated; restarts the sprite animation when it changes. */
  current: BattleEvent | null;
  eventKey: number;
}

function spriteAnimation(side: Side, current: BattleEvent | null) {
  if (!current) return undefined;
  if (current.kind === "move-used" && current.side === side) {
    return side === "player"
      ? "animate-[battle-lunge-player_0.5s_ease-in-out]"
      : "animate-[battle-lunge-opponent_0.5s_ease-in-out]";
  }
  if (current.kind === "item-used" && current.side === side) {
    return "animate-[battle-heal_0.8s_ease-in-out]";
  }
  if (current.kind === "damage" && current.target === side) {
    return "animate-[battle-hit_0.6s_ease-in-out]";
  }
  return undefined;
}

export function BattlePokemon({ side, pokemon, hp, fainted, current, eventKey }: BattlePokemonProps) {
  const isPlayer = side === "player";

  return (
    <div
      className={cn(
        "flex items-end gap-3 sm:gap-6",
        isPlayer ? "flex-row" : "flex-row-reverse",
      )}
    >
      <div className="relative w-[40%] max-w-56 shrink-0">
        {/* Ground shadow / platform */}
        <div
          aria-hidden
          className="absolute inset-x-[5%] bottom-[2%] h-[16%] rounded-[50%] bg-black/10 dark:bg-white/10"
        />
        <div
          key={eventKey}
          className={cn(
            "relative aspect-square",
            spriteAnimation(side, current),
            fainted && "animate-[battle-faint_0.8s_ease-in_forwards]",
          )}
        >
          <Image
            src={getArtworkUrl(pokemon.id)}
            alt={`${isPlayer ? "Your" : "Opposing"} ${formatName(pokemon.name)}`}
            fill
            sizes="(min-width: 640px) 16rem, 40vw"
            priority
            className={cn("object-contain drop-shadow-xl", isPlayer && "-scale-x-100")}
          />
        </div>
      </div>

      <div
        className={cn(
          "mb-[8%] min-w-0 flex-1 space-y-2 rounded-2xl border bg-card/90 p-3 shadow-sm backdrop-blur sm:max-w-72",
          isPlayer ? "mr-auto" : "ml-auto",
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-black text-foreground sm:text-base">
            {formatName(pokemon.name)}
          </h3>
          <span className="shrink-0 text-xs font-bold text-muted-foreground">Lv. {pokemon.level}</span>
        </div>
        <div className="flex gap-1">
          {pokemon.types.map((type) => (
            <PokemonTypeBadge key={type} type={type} />
          ))}
        </div>
        <BattleHealthBar hp={hp} maxHp={pokemon.stats.hp} showNumbers={isPlayer} />
      </div>
    </div>
  );
}
