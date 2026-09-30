import { PokemonIndexEntry } from "@/queries/pokemon/use-pokemon-list";

export function randomPokemonName(list: PokemonIndexEntry[], exclude?: string) {
  const candidates = list.filter((entry) => entry.name !== exclude);
  return candidates[Math.floor(Math.random() * candidates.length)].name;
}

/** Opponent level within ±5 of the player's, kept in 1–100. */
export const randomLevelAround = (level: number) =>
  Math.min(100, Math.max(1, level + Math.floor(Math.random() * 11) - 5));
