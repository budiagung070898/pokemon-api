"use client";

import { BattlePokemon } from "@/lib/battle-engine";
import { getLearnset, getVersionGroups } from "@/lib/learnset";
import { calculateStat } from "@/lib/pokemon-stats";
import { moveQueryOptions } from "@/queries/move/use-move";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { useQueries } from "@tanstack/react-query";
import { selectBattleMoves } from "../lib/select-moves";

/**
 * Turns a Pokémon into a battle-ready combatant: stats at the given level and
 * four moves chosen from what it learns by level-up in its latest game.
 */
export function useBattlePokemon(name: string | undefined, level: number) {
  const pokemonQuery = usePokemon(name);
  const pokemon = pokemonQuery.data;

  const latestGame = pokemon ? getVersionGroups(pokemon.moves)[0] : undefined;
  const moveNames = pokemon && latestGame
    ? [...new Set(
        getLearnset(pokemon.moves, latestGame)
          .filter((entry) => entry.method === "level-up")
          .map((entry) => entry.name),
      )]
    : [];

  const moveQueries = useQueries({ queries: moveNames.map(moveQueryOptions) });
  const loadedMoves = moveQueries.flatMap((query) => query.data ?? []);
  const movesReady = moveQueries.every((query) => !query.isPending);

  if (pokemonQuery.isError) return { status: "error" as const };
  if (!pokemon || !movesReady) {
    return {
      status: "loading" as const,
      progress: { loaded: loadedMoves.length, total: moveNames.length },
    };
  }

  const types = pokemon.types.map(({ type }) => type.name);
  const statAt = (statName: string) =>
    calculateStat(
      statName,
      pokemon.stats.find(({ stat }) => stat.name === statName)?.base_stat ?? 1,
      level,
    );
  const stats: BattlePokemon["stats"] = {
    hp: statAt("hp"),
    attack: statAt("attack"),
    defense: statAt("defense"),
    specialAttack: statAt("special-attack"),
    specialDefense: statAt("special-defense"),
    speed: statAt("speed"),
  };

  const battlePokemon: BattlePokemon = {
    id: pokemon.id,
    name: pokemon.name,
    types,
    level,
    stats,
    moves: selectBattleMoves(types, loadedMoves),
  };

  return { status: "ready" as const, pokemon: battlePokemon, detail: pokemon };
}
