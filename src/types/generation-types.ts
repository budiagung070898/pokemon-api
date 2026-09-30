import { NamedAPIResource } from "./api";

export interface GenerationDetail {
  id: number;
  name: string;
  main_region: NamedAPIResource;
  pokemon_species: NamedAPIResource[];
}
