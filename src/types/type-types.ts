import { NamedAPIResource } from "./api";

export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: NamedAPIResource[];
    double_damage_to: NamedAPIResource[];
    half_damage_from: NamedAPIResource[];
    half_damage_to: NamedAPIResource[];
    no_damage_from: NamedAPIResource[];
    no_damage_to: NamedAPIResource[];
  };
  pokemon: {
    slot: number;
    pokemon: NamedAPIResource;
  }[];
}
