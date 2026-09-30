import { PokemonStat } from "@/types/pokemon-types";

/**
 * Stat at a given level using the main-series formula with neutral nature
 * and no IVs/EVs — simple and predictable for team building and battles.
 */
export function calculateStat(statName: string, baseStat: number, level: number) {
  const scaled = Math.floor((2 * baseStat * level) / 100);
  return statName === "hp" ? scaled + level + 10 : scaled + 5;
}

export function calculateStatsAtLevel(stats: PokemonStat[], level: number) {
  return stats.map(({ stat, base_stat }) => ({
    name: stat.name,
    value: calculateStat(stat.name, base_stat, level),
  }));
}
