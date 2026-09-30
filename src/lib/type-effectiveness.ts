import { POKEMON_TYPES, PokemonTypeName } from "@/constant/pokemon-type-color";
import { TypeDetail } from "@/types/type-types";

export type TypeMultipliers = Record<PokemonTypeName, number>;

/**
 * Damage multiplier of every attacking type against a defender with the
 * given types, derived from PokéAPI `damage_relations` (dual types multiply).
 */
export function getDefensiveMultipliers(defenderTypes: TypeDetail[]) {
  const multipliers = Object.fromEntries(
    POKEMON_TYPES.map((type) => [type, 1]),
  ) as TypeMultipliers;

  for (const { damage_relations: relations } of defenderTypes) {
    const apply = (types: { name: string }[], factor: number) => {
      for (const { name } of types) {
        if (name in multipliers) multipliers[name as PokemonTypeName] *= factor;
      }
    };

    apply(relations.double_damage_from, 2);
    apply(relations.half_damage_from, 0.5);
    apply(relations.no_damage_from, 0);
  }

  return multipliers;
}

export interface EffectivenessGroup {
  multiplier: number;
  types: PokemonTypeName[];
}

/** Groups multipliers from most to least damage taken, e.g. ×4, ×2, ×½, ×0. */
export function groupByMultiplier(multipliers: TypeMultipliers) {
  const groups = new Map<number, PokemonTypeName[]>();

  for (const type of POKEMON_TYPES) {
    const value = multipliers[type];
    groups.set(value, [...(groups.get(value) ?? []), type]);
  }

  return [...groups.entries()]
    .map(([multiplier, types]): EffectivenessGroup => ({ multiplier, types }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

export function formatMultiplier(multiplier: number) {
  if (multiplier === 0.5) return "×½";
  if (multiplier === 0.25) return "×¼";
  return `×${multiplier}`;
}
