import { calculateDamage } from "./calculate-damage";
import { calculateTypeEffectiveness } from "./calculate-type-effectiveness";
import { calculateTurnOrder, TurnAction } from "./calculate-turn-order";
import {
  BattleEvent,
  BattleMove,
  BattlePokemon,
  BattleState,
  Combatant,
  PlayerAction,
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

const toCombatant = (pokemon: BattlePokemon, hp = pokemon.stats.hp): Combatant => ({
  ...pokemon,
  currentHp: Math.min(Math.max(1, hp), pokemon.stats.hp),
  pp: pokemon.moves.map((move) => move.maxPp),
});

interface CreateBattleOptions {
  /** Start the player below full HP (e.g. adventure mode carries HP over). */
  playerHp?: number;
}

export const createBattle = (
  player: BattlePokemon,
  opponent: BattlePokemon,
  { playerHp }: CreateBattleOptions = {},
): BattleState => ({
  player: toCombatant(player, playerHp),
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
  playerAction: PlayerAction,
  opponentMoveIndex: number,
  chart: TypeChart,
  random: RandomFn,
): { state: BattleState; events: BattleEvent[] } {
  if (state.winner) return { state, events: [] };

  const combatants: Record<Side, Combatant> = {
    player: { ...state.player, pp: [...state.player.pp] },
    opponent: { ...state.opponent, pp: [...state.opponent.pp] },
  };
  const playerMoveIndex = playerAction.type === "move" ? playerAction.index : -1;
  const moveIndexes: Record<Side, number> = { player: playerMoveIndex, opponent: opponentMoveIndex };
  const events: BattleEvent[] = [{ kind: "turn-start", turn: state.turn }];
  let winner: Side | null = null;

  // Using an item always happens first and replaces the player's attack.
  if (playerAction.type === "item") {
    const player = combatants.player;
    const amount = Math.min(playerAction.heal, player.stats.hp - player.currentHp);
    player.currentHp += amount;
    events.push({ kind: "item-used", side: "player", item: playerAction.item, amount, hpAfter: player.currentHp });
  }

  const opponentAction: TurnAction = {
    side: "opponent",
    move: pickMove(combatants.opponent, opponentMoveIndex),
    speed: combatants.opponent.stats.speed,
  };
  const order =
    playerAction.type === "move"
      ? calculateTurnOrder(
          [
            { side: "player", move: pickMove(combatants.player, playerMoveIndex), speed: combatants.player.stats.speed },
            opponentAction,
          ],
          random,
        )
      : [opponentAction];

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

    // Report HP actually lost, like the games (no "overkill" numbers).
    const amount = Math.min(result.damage, defender.currentHp);
    defender.currentHp -= amount;
    events.push({
      kind: "damage",
      target,
      amount,
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
