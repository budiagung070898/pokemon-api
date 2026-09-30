export type Side = "player" | "opponent";

export type MoveCategory = "physical" | "special";

/** Typeless moves (Struggle) ignore type effectiveness and STAB. */
export const TYPELESS = "typeless";

export interface BattleMove {
  name: string;
  type: string;
  category: MoveCategory;
  power: number;
  /** `null` means the move never misses. */
  accuracy: number | null;
  priority: number;
  maxPp: number;
}

export interface BattleStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface BattlePokemon {
  id: number;
  name: string;
  types: string[];
  level: number;
  stats: BattleStats;
  moves: BattleMove[];
}

export interface Combatant extends BattlePokemon {
  currentHp: number;
  /** Remaining PP, index-aligned with `moves`. */
  pp: number[];
}

/** Multiplier of an attacking type against a defending type. */
export type TypeChart = Record<string, Record<string, number>>;

export type BattleEvent =
  | { kind: "turn-start"; turn: number }
  | { kind: "move-used"; side: Side; move: string; moveType: string }
  | { kind: "miss"; side: Side }
  | { kind: "no-effect"; target: Side }
  | {
      kind: "damage";
      target: Side;
      amount: number;
      hpAfter: number;
      effectiveness: number;
      critical: boolean;
    }
  | { kind: "faint"; side: Side }
  | { kind: "battle-end"; winner: Side };

export interface BattleState {
  player: Combatant;
  opponent: Combatant;
  turn: number;
  winner: Side | null;
  /** Every event since the battle started — the source for animation and replay. */
  log: BattleEvent[];
}

/** Returns a number in [0, 1). Injected so battles are deterministic in tests. */
export type RandomFn = () => number;
