import { formatName, getIdFromUrl } from "@/lib/pokemon";
import { PokemonDetail } from "@/types/pokemon-types";
import { PokemonSpecies } from "@/types/species-types";

/**
 * Games are taken from `game_indices` (older titles) and Pokédex entries
 * (newer titles don't have game indices), ordered by release via version id.
 */
export function PokemonGames({ pokemon, species }: { pokemon: PokemonDetail; species?: PokemonSpecies }) {
  const versions = new Map<string, number>();

  for (const { version } of pokemon.game_indices) versions.set(version.name, getIdFromUrl(version.url));
  for (const { version } of species?.flavor_text_entries ?? []) {
    versions.set(version.name, getIdFromUrl(version.url));
  }

  const sorted = [...versions.entries()].sort((a, b) => a[1] - b[1]);

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No game data available.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {sorted.map(([name]) => (
        <li
          key={name}
          className="rounded-full border bg-background px-3 py-1 text-xs font-semibold text-foreground"
        >
          {formatName(name)}
        </li>
      ))}
    </ul>
  );
}
