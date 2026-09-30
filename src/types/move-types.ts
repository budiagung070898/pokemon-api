import { NamedAPIResource } from "./api";

/* ---------- Move ---------- */
export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  effect_chance: number | null;
  type: NamedAPIResource;
  damage_class: NamedAPIResource;
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
  machines: {
    machine: { url: string };
    version_group: NamedAPIResource;
  }[];
}

/* ---------- Machine (TM / HM / TR) ---------- */
export interface MachineDetail {
  id: number;
  item: NamedAPIResource;
  move: NamedAPIResource;
  version_group: NamedAPIResource;
}
