"use client";

import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { AdventurePartner, getMaxHp } from "./progression";

/** Partner's max HP at its current level (needs the Pokémon's base HP). */
export function usePartnerStats(partner: AdventurePartner) {
  const { data: pokemon } = usePokemon(partner.name);
  const baseHp = pokemon?.stats.find(({ stat }) => stat.name === "hp")?.base_stat;

  return {
    pokemon,
    baseHp,
    maxHp: baseHp ? getMaxHp(baseHp, partner.level) : null,
  };
}
