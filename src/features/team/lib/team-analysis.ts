import { POKEMON_TYPES, PokemonTypeName } from "@/constant/pokemon-type-color";
import { getDefensiveMultipliers, TypeMultipliers } from "@/lib/type-effectiveness";
import { TypeDetail } from "@/types/type-types";

export interface AnalyzedMember {
  id: number;
  name: string;
  types: string[];
}

export interface DefensiveRow {
  attackingType: PokemonTypeName;
  /** Multiplier per member, in team order. */
  multipliers: number[];
  weak: number;
  resist: number;
  immune: number;
}

/**
 * For every attacking type: how each member takes it, and how many members
 * are weak / resistant / immune, derived from PokéAPI damage relations.
 */
export function analyzeDefense(
  members: AnalyzedMember[],
  typeDetails: Map<string, TypeDetail>,
): DefensiveRow[] {
  const memberMultipliers: TypeMultipliers[] = members.map((member) =>
    getDefensiveMultipliers(
      member.types.flatMap((type) => typeDetails.get(type) ?? []),
    ),
  );

  return POKEMON_TYPES.map((attackingType) => {
    const multipliers = memberMultipliers.map((multiplier) => multiplier[attackingType]);
    return {
      attackingType,
      multipliers,
      weak: multipliers.filter((m) => m > 1).length,
      resist: multipliers.filter((m) => m > 0 && m < 1).length,
      immune: multipliers.filter((m) => m === 0).length,
    };
  });
}

/** Types that hit several members super-effectively with nobody to switch into. */
export const getThreats = (rows: DefensiveRow[]) =>
  rows
    .filter((row) => row.weak >= 2 && row.weak > row.resist + row.immune)
    .sort((a, b) => b.weak - a.weak);

export interface CoverageEntry {
  defendingType: PokemonTypeName;
  /** Team attacking (STAB) types that are super effective against it. */
  coveredBy: string[];
}

/**
 * Offensive coverage from the team's own types (STAB). Full movepool
 * coverage would need every move's details, so it is intentionally STAB-only.
 */
export function analyzeCoverage(
  members: AnalyzedMember[],
  typeDetails: Map<string, TypeDetail>,
): CoverageEntry[] {
  const attackingTypes = [...new Set(members.flatMap((member) => member.types))];

  return POKEMON_TYPES.map((defendingType) => ({
    defendingType,
    coveredBy: attackingTypes.filter((type) =>
      typeDetails
        .get(type)
        ?.damage_relations.double_damage_to.some(({ name }) => name === defendingType),
    ),
  }));
}
