import { PokemonDetail, PokemonStat } from "@/types/pokemon-types";

// Alternate forms (megas, regional variants, ...) use ids from 10001 upwards.
export const MAX_SPECIES_ID = 10_000;

const ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** "https://pokeapi.co/api/v2/pokemon/25/" -> 25 */
export const getIdFromUrl = (url: string) =>
  Number(url.split("/").filter(Boolean).at(-1));

export const formatPokemonId = (id: number) =>
  `#${id.toString().padStart(4, "0")}`;

export const formatName = (name: string) =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Official artwork by id, following the PokeAPI sprites repository layout. */
export const getArtworkUrl = (id: number) => `${ARTWORK_BASE_URL}/${id}.png`;

export const getPokemonArtwork = (pokemon: PokemonDetail, shiny = false) => {
  const artwork = pokemon.sprites.other["official-artwork"];
  const sprite = shiny ? artwork.front_shiny : artwork.front_default;
  return sprite ?? pokemon.sprites.front_default;
};

export const getBaseStatTotal = (stats: PokemonStat[]) =>
  stats.reduce((total, stat) => total + stat.base_stat, 0);

export const toRomanGeneration = (generationName: string) =>
  generationName.replace("generation-", "").toUpperCase();
