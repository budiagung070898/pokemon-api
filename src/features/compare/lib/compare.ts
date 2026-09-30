import { getDefensiveMultipliers } from "@/lib/type-effectiveness";
import { PokemonMove, PokemonStat } from "@/types/pokemon-types";
import { TypeDetail } from "@/types/type-types";

export interface StatComparison {
  name: string;
  a: number;
  b: number;
}

export function compareStats(a: PokemonStat[], b: PokemonStat[]): StatComparison[] {
  return a.map((stat) => ({
    name: stat.stat.name,
    a: stat.base_stat,
    b: b.find((other) => other.stat.name === stat.stat.name)?.base_stat ?? 0,
  }));
}

export interface StabMatchup {
  type: string;
  multiplier: number;
}

/**
 * How hard the attacker's own types (its STAB moves) hit the defender,
 * strongest first. Only types are considered, not the actual movepool.
 */
export function getStabMatchups(attackerTypes: string[], defenderTypes: TypeDetail[]) {
  const multipliers = getDefensiveMultipliers(defenderTypes);

  return attackerTypes
    .map((type): StabMatchup => ({
      type,
      multiplier: multipliers[type as keyof typeof multipliers] ?? 1,
    }))
    .sort((x, y) => y.multiplier - x.multiplier);
}

const moveNames = (moves: PokemonMove[]) => new Set(moves.map(({ move }) => move.name));

/** Moves each Pokémon can learn in any game, split into shared and unique. */
export function compareMoves(a: PokemonMove[], b: PokemonMove[]) {
  const namesA = moveNames(a);
  const namesB = moveNames(b);
  const sort = (names: string[]) => names.sort((x, y) => x.localeCompare(y));

  return {
    shared: sort([...namesA].filter((name) => namesB.has(name))),
    onlyA: sort([...namesA].filter((name) => !namesB.has(name))),
    onlyB: sort([...namesB].filter((name) => !namesA.has(name))),
  };
}
