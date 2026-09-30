export const pokemonKeys = {
  all: ["pokemon"] as const,
  list: () => [...pokemonKeys.all, "list"] as const,
  detail: (nameOrId: string | number) =>
    [...pokemonKeys.all, "detail", String(nameOrId)] as const,
  moves: (params?: unknown) => ["moves", params] as const,
  abilities: (params?: unknown) => ["abilities", params] as const,
};

export const typeKeys = {
  all: ["type"] as const,
  detail: (name: string) => [...typeKeys.all, "detail", name] as const,
};

export const generationKeys = {
  all: ["generation"] as const,
  list: () => [...generationKeys.all, "list"] as const,
  detail: (id: number) => [...generationKeys.all, "detail", id] as const,
};
