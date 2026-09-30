import { NamedAPIResource } from "./api";

export interface PokemonSpecies {
  id: number;
  name: string;
  /** Chance of being female in eighths; -1 means genderless. */
  gender_rate: number;
  capture_rate: number;
  base_happiness: number | null;
  hatch_counter: number | null;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  growth_rate: NamedAPIResource;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource;
  egg_groups: NamedAPIResource[];
  evolution_chain: { url: string } | null;
  genera: {
    genus: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
  }[];
}

export interface EvolutionDetail {
  trigger: NamedAPIResource;
  item: NamedAPIResource | null;
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  trade_species: NamedAPIResource | null;
  gender: number | null;
  min_level: number | null;
  min_happiness: number | null;
  min_affection: number | null;
  min_beauty: number | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}
