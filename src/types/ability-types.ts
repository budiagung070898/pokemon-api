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
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: NamedAPIResource;
  }[];
}
