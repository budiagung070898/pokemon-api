export const pokemonKeys = {
  all: ["pokemon"] as const,
  list: (params?: unknown) => [...pokemonKeys.all, "list", params] as const,
  detail: (id: string | number) => [...pokemonKeys.all, "detail", id] as const,
  moves: (params?: unknown) => ["moves", params] as const,
  abilities: (params?: unknown) => ["abilities", params] as const,
};
