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
interface BattlePokemonOptions {
  /** Only moves learned at or below the current level (adventure progression). */
  limitMovesToLevel?: boolean;
}

export function useBattlePokemon(
  name: string | undefined,
  level: number,
  { limitMovesToLevel = false }: BattlePokemonOptions = {},
) {
  const pokemonQuery = usePokemon(name);
  const pokemon = pokemonQuery.data;

  const latestGame = pokemon ? getVersionGroups(pokemon.moves)[0] : undefined;
  const levelUpMoves =
    pokemon && latestGame
      ? getLearnset(pokemon.moves, latestGame).filter((entry) => entry.method === "level-up")
      : [];
  const moveNames = [...new Set(levelUpMoves.map((entry) => entry.name))];
  // Learnsets are sorted by level, so the first entry per move is when it's learned.
  const learnLevel = new Map<string, number>();
  for (const entry of levelUpMoves) {
    if (!learnLevel.has(entry.name)) learnLevel.set(entry.name, entry.level);
  }

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

  function pickMoves() {
    if (!limitMovesToLevel) return selectBattleMoves(types, loadedMoves);
    const known = loadedMoves.filter((move) => (learnLevel.get(move.name) ?? 0) <= level);
    const moves = selectBattleMoves(types, known);
    if (moves.length > 0) return moves;
    // Nothing damaging yet: fall back to the earliest damaging move it can learn.
    const earliest = [...loadedMoves].sort(
      (a, b) => (learnLevel.get(a.name) ?? 0) - (learnLevel.get(b.name) ?? 0),
    );
    return earliest.flatMap((move) => selectBattleMoves(types, [move])).slice(0, 1);
  }

  const battlePokemon: BattlePokemon = {
    id: pokemon.id,
    name: pokemon.name,
    types,
    level,
    stats,
    moves: pickMoves(),
  };

  return { status: "ready" as const, pokemon: battlePokemon, detail: pokemon };
}
