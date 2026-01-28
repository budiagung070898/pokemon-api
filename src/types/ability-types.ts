import { NamedAPIResource } from "./api";

/* ---------- Ability ---------- */
export interface AbilityDetail {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: NamedAPIResource;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: NamedAPIResource;
  }[];
}
