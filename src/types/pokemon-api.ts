export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListParams {
  limit?: number;
  offset?: number;
}

// ===== Basic shared types =====
export interface PokemonNamedResource {
  name: string;
  url: string;
}

// ===== Sprites =====
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;

  // Female variants
  front_female?: string | null;
  front_shiny_female?: string | null;
  back_female?: string | null;
  back_shiny_female?: string | null;

  // Other sprite sources
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
      front_female?: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
      front_female?: string | null;
      front_shiny_female?: string | null;
    };
  };
}

// ===== Types =====
export interface PokemonType {
  slot: number;
  type: PokemonNamedResource;
}

// ===== Abilities =====
export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: PokemonNamedResource;
}

// ===== Stats =====
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: PokemonNamedResource;
}

// ===== Main Pokémon Detail =====
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}
