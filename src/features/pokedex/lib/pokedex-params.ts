import { POKEMON_TYPES } from "@/constant/pokemon-type-color";
import { z } from "zod";

export const SORT_OPTIONS = [
  { value: "id-asc", label: "Lowest number" },
  { value: "id-desc", label: "Highest number" },
  { value: "name", label: "Name (A–Z)" },
  { value: "stat", label: "Highest base stats" },
] as const;

export type PokedexSort = (typeof SORT_OPTIONS)[number]["value"];

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value) as [
  PokedexSort,
  ...PokedexSort[],
];

/** URL search params are untrusted input: invalid values fall back to defaults. */
const pokedexParamsSchema = z.object({
  search: z.string().trim().catch(""),
  type: z.enum(POKEMON_TYPES).optional().catch(undefined),
  generation: z.coerce.number().int().positive().optional().catch(undefined),
  sort: z.enum(SORT_VALUES).catch("id-asc"),
  page: z.coerce.number().int().positive().catch(1),
});

export type PokedexParams = z.infer<typeof pokedexParamsSchema>;

export const DEFAULT_PARAMS = pokedexParamsSchema.parse({});

export const parsePokedexParams = (searchParams: URLSearchParams) =>
  pokedexParamsSchema.parse(Object.fromEntries(searchParams));

/** Serialises params, omitting defaults so shared URLs stay short. */
export const toPokedexQueryString = (params: PokedexParams) => {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.type) query.set("type", params.type);
  if (params.generation) query.set("generation", String(params.generation));
  if (params.sort !== DEFAULT_PARAMS.sort) query.set("sort", params.sort);
  if (params.page > 1) query.set("page", String(params.page));

  return query.toString();
};
