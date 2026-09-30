import { BattleMove, RandomFn, Side } from "./types";

export interface TurnAction {
  side: Side;
  move: BattleMove;
  speed: number;
}

/** Higher move priority first, then higher Speed; speed ties are a coin flip. */
export function calculateTurnOrder(actions: [TurnAction, TurnAction], random: RandomFn) {
  const [first, second] = actions;
  const priorityDiff = second.move.priority - first.move.priority;
  const speedDiff = second.speed - first.speed;

  if (priorityDiff !== 0) return priorityDiff > 0 ? [second, first] : [first, second];
  if (speedDiff !== 0) return speedDiff > 0 ? [second, first] : [first, second];
  return random() < 0.5 ? [first, second] : [second, first];
}
