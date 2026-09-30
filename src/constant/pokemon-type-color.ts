export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPES)[number];

// `fg` is picked per type so badge text keeps a WCAG AA contrast ratio.
const DARK_TEXT = "#0f172a";
const LIGHT_TEXT = "#ffffff";

export const POKEMON_TYPE_COLORS: Record<
  PokemonTypeName,
  { bg: string; fg: string }
> = {
  normal: { bg: "#A8A77A", fg: DARK_TEXT },
  fire: { bg: "#EE8130", fg: DARK_TEXT },
  water: { bg: "#6390F0", fg: DARK_TEXT },
  electric: { bg: "#F7D02C", fg: DARK_TEXT },
  grass: { bg: "#7AC74C", fg: DARK_TEXT },
  ice: { bg: "#96D9D6", fg: DARK_TEXT },
  fighting: { bg: "#C22E28", fg: LIGHT_TEXT },
  poison: { bg: "#A33EA1", fg: LIGHT_TEXT },
  ground: { bg: "#E2BF65", fg: DARK_TEXT },
  flying: { bg: "#A98FF3", fg: DARK_TEXT },
  psychic: { bg: "#F95587", fg: DARK_TEXT },
  bug: { bg: "#A6B91A", fg: DARK_TEXT },
  rock: { bg: "#B6A136", fg: DARK_TEXT },
  ghost: { bg: "#735797", fg: LIGHT_TEXT },
  dragon: { bg: "#6F35FC", fg: LIGHT_TEXT },
  dark: { bg: "#705746", fg: LIGHT_TEXT },
  steel: { bg: "#B7B7CE", fg: DARK_TEXT },
  fairy: { bg: "#D685AD", fg: DARK_TEXT },
};

export const isPokemonType = (value: string): value is PokemonTypeName =>
  (POKEMON_TYPES as readonly string[]).includes(value);

export const getTypeColor = (type: string) =>
  isPokemonType(type)
    ? POKEMON_TYPE_COLORS[type]
    : POKEMON_TYPE_COLORS.normal;
