import { calculateDamage } from "./calculate-damage";
import { calculateTypeEffectiveness } from "./calculate-type-effectiveness";
import { calculateTurnOrder } from "./calculate-turn-order";
import {
  BattleEvent,
  BattleMove,
  BattlePokemon,
  BattleState,
  Combatant,
  RandomFn,
  Side,
  TYPELESS,
  TypeChart,
} from "./types";

/** Used when a Pokémon has no damaging moves or runs out of PP. */
export const STRUGGLE: BattleMove = {
  name: "struggle",
  type: TYPELESS,
  category: "physical",
  power: 50,
  accuracy: null,
  priority: 0,
  maxPp: 1,
};

const toCombatant = (pokemon: BattlePokemon): Combatant => ({
  ...pokemon,
  currentHp: pokemon.stats.hp,
  pp: pokemon.moves.map((move) => move.maxPp),
});

export const createBattle = (player: BattlePokemon, opponent: BattlePokemon): BattleState => ({
  player: toCombatant(player),
  opponent: toCombatant(opponent),
  turn: 1,
  winner: null,
  log: [],
});

export const otherSide = (side: Side): Side => (side === "player" ? "opponent" : "player");

/** False once every move is out of PP (the Pokémon can only Struggle). */
export const hasUsableMove = (combatant: Combatant) => combatant.pp.some((pp) => pp > 0);

const pickMove = (combatant: Combatant, index: number) =>
  index >= 0 && combatant.pp[index] > 0 ? combatant.moves[index] : STRUGGLE;

/**
 * Resolves one full turn. Pure: returns the next state plus the events that
 * happened, which the UI animates and the replay re-plays.
 */
export function resolveTurn(
  state: BattleState,
  playerMoveIndex: number,
  opponentMoveIndex: number,
  chart: TypeChart,
  random: RandomFn,
): { state: BattleState; events: BattleEvent[] } {
  if (state.winner) return { state, events: [] };

  const combatants: Record<Side, Combatant> = {
    player: { ...state.player, pp: [...state.player.pp] },
    opponent: { ...state.opponent, pp: [...state.opponent.pp] },
  };
  const moveIndexes: Record<Side, number> = { player: playerMoveIndex, opponent: opponentMoveIndex };
  const events: BattleEvent[] = [{ kind: "turn-start", turn: state.turn }];
  let winner: Side | null = null;

  const order = calculateTurnOrder(
    [
      { side: "player", move: pickMove(combatants.player, playerMoveIndex), speed: combatants.player.stats.speed },
      { side: "opponent", move: pickMove(combatants.opponent, opponentMoveIndex), speed: combatants.opponent.stats.speed },
    ],
    random,
  );

  for (const { side, move } of order) {
    const attacker = combatants[side];
    const target = otherSide(side);
    const defender = combatants[target];

    if (move !== STRUGGLE) attacker.pp[moveIndexes[side]] -= 1;
    events.push({ kind: "move-used", side, move: move.name, moveType: move.type });

    if (move.accuracy !== null && random() * 100 >= move.accuracy) {
      events.push({ kind: "miss", side });
      continue;
    }

    const result = calculateDamage(attacker, defender, move, chart, random);
    if (result.effectiveness === 0) {
      events.push({ kind: "no-effect", target });
      continue;
    }

    defender.currentHp = Math.max(0, defender.currentHp - result.damage);
    events.push({
      kind: "damage",
      target,
      amount: result.damage,
      hpAfter: defender.currentHp,
      effectiveness: result.effectiveness,
      critical: result.critical,
    });

    if (defender.currentHp === 0) {
      winner = side;
      events.push({ kind: "faint", side: target }, { kind: "battle-end", winner });
      break;
    }
  }

  return {
    state: {
      player: combatants.player,
      opponent: combatants.opponent,
      turn: state.turn + 1,
      winner,
      log: [...state.log, ...events],
    },
    events,
  };
}

/**
 * Simple opponent AI: usually picks the move with the best expected damage,
 * sometimes a random one so battles don't feel scripted.
 */
export function chooseAiMove(
  self: Combatant,
  foe: Combatant,
  chart: TypeChart,
  random: RandomFn,
) {
  const usable = self.moves
    .map((move, index) => ({ move, index }))
    .filter(({ index }) => self.pp[index] > 0);

  if (usable.length === 0) return -1;
  if (random() < 0.25) return usable[Math.floor(random() * usable.length)].index;

  const score = (move: BattleMove) =>
    move.power *
    ((move.accuracy ?? 100) / 100) *
    (self.types.includes(move.type) ? 1.5 : 1) *
    calculateTypeEffectiveness(move.type, foe.types, chart);

  return usable.reduce((best, current) => (score(current.move) > score(best.move) ? current : best))
    .index;
}
