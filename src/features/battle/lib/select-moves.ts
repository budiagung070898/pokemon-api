import { BattleMove } from "@/lib/battle-engine";
import { MoveDetail } from "@/types/move-types";

export const MAX_MOVES = 4;

// Their drawback (the user faints) isn't simulated, so they would be unfair.
const EXCLUDED_MOVES = new Set(["explosion", "self-destruct", "misty-explosion"]);

export const toBattleMove = (move: MoveDetail): BattleMove | null => {
  const category = move.damage_class.name;
  if (category === "status" || !move.power || EXCLUDED_MOVES.has(move.name)) return null;

  return {
    name: move.name,
    type: move.type.name,
    category: category === "special" ? "special" : "physical",
    power: move.power,
    accuracy: move.accuracy,
    priority: move.priority,
    maxPp: move.pp,
  };
};

/**
 * Picks up to four damaging moves: the strongest move of each type first
 * (for coverage), then fills remaining slots by strength. Status moves and
 * variable-power moves are skipped because the engine doesn't simulate them.
 */
export function selectBattleMoves(pokemonTypes: string[], moves: MoveDetail[]) {
  const candidates = moves.flatMap((move) => toBattleMove(move) ?? []);
  const score = (move: BattleMove) =>
    move.power * ((move.accuracy ?? 100) / 100) * (pokemonTypes.includes(move.type) ? 1.5 : 1);
  const ranked = candidates.sort((a, b) => score(b) - score(a));

  const selected: BattleMove[] = [];
  for (const move of ranked) {
    if (selected.length === MAX_MOVES) break;
    if (!selected.some((chosen) => chosen.type === move.type)) selected.push(move);
  }
  for (const move of ranked) {
    if (selected.length === MAX_MOVES) break;
    if (!selected.includes(move)) selected.push(move);
  }

  return selected;
}
