import { PokemonIndexEntry } from "@/queries/pokemon/use-pokemon-list";
import { PokedexSort } from "./pokedex-params";

interface FilterOptions {
  search: string;
  /** Ids allowed by the type/generation filters. `null` means "no filter". */
  allowedIds: Set<number> | null;
}

export function filterPokemon(
  entries: PokemonIndexEntry[],
  { search, allowedIds }: FilterOptions,
) {
  const query = search.toLowerCase().replace(/^#/, "").replace(/\s+/g, "-");
  const isIdQuery = /^\d+$/.test(query);

  return entries.filter((entry) => {
    if (allowedIds && !allowedIds.has(entry.id)) return false;
    if (!query) return true;
    if (isIdQuery) return String(entry.id).startsWith(String(Number(query)));
    return entry.name.includes(query);
  });
}

export function sortPokemon(
  entries: PokemonIndexEntry[],
  sort: PokedexSort,
  statTotals?: Map<string, number>,
) {
  const sorted = [...entries];

  switch (sort) {
    case "id-desc":
      return sorted.sort((a, b) => b.id - a.id);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "stat":
      if (!statTotals) return sorted;
      return sorted.sort(
        (a, b) =>
          (statTotals.get(b.name) ?? 0) - (statTotals.get(a.name) ?? 0) ||
          a.id - b.id,
      );
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

export function intersectIds(sets: (Set<number> | null)[]) {
  const activeSets = sets.filter((set): set is Set<number> => set !== null);
  if (activeSets.length === 0) return null;

  const [first, ...rest] = activeSets;
  return new Set([...first].filter((id) => rest.every((set) => set.has(id))));
}
