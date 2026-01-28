import { NamedAPIResource } from "./api";

/* ---------- Move ---------- */
export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  type: NamedAPIResource;
  damage_class: NamedAPIResource;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
}
