import { MAX_SPECIES_ID } from "@/lib/pokemon";
import { PokemonIndexEntry } from "@/queries/pokemon/use-pokemon-list";

/**
 * Inverted-triangle map (like the arcade map in Puzzle Bobble): one stage at
 * the bottom, and each cleared stage lets you climb left or right. Row `r`
 * has `r + 1` stages; the top row holds the bosses.
 */
export const MAP_ROWS = 7;
export const BOSS_ROW = MAP_ROWS - 1;

// A handful of iconic legendaries as final bosses — the rest of the map is random.
const BOSSES = ["mewtwo", "lugia", "ho-oh", "rayquaza", "dialga", "palkia", "giratina-altered"];

export interface MapNode {
  id: string;
  row: number;
  col: number;
  isBoss: boolean;
  opponent: PokemonIndexEntry;
}

export const nodeId = (row: number, col: number) => `${row}-${col}`;

export const parseNodeId = (id: string) => {
  const [row, col] = id.split("-").map(Number);
  return { row, col };
};

/** Small deterministic PRNG so a run's map is the same after a reload. */
function mulberry32(seed: number) {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMap(seed: number, list: PokemonIndexEntry[]): MapNode[] {
  const random = mulberry32(seed);
  const pool = list.filter((entry) => entry.id < MAX_SPECIES_ID && !BOSSES.includes(entry.name));
  const bosses = BOSSES.flatMap((name) => list.find((entry) => entry.name === name) ?? []);
  const nodes: MapNode[] = [];

  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col <= row; col++) {
      const isBoss = row === BOSS_ROW && bosses.length > 0;
      const opponent = isBoss
        ? bosses[col % bosses.length]
        : pool[Math.floor(random() * pool.length)];
      nodes.push({ id: nodeId(row, col), row, col, isBoss, opponent });
    }
  }

  return nodes;
}

/** Stages you can enter next: the bottom one at the start, then up-left / up-right. */
export function getAvailableNodeIds(lastClearedId: string | undefined) {
  if (!lastClearedId) return [nodeId(0, 0)];
  const { row, col } = parseNodeId(lastClearedId);
  if (row >= BOSS_ROW) return [];
  return [nodeId(row + 1, col), nodeId(row + 1, col + 1)];
}

/** Whether a stage can still be reached from the current position. */
export function isReachable(id: string, lastClearedId: string | undefined) {
  if (!lastClearedId) return true;
  const target = parseNodeId(id);
  const from = parseNodeId(lastClearedId);
  const rowsUp = target.row - from.row;
  return rowsUp > 0 && target.col >= from.col && target.col <= from.col + rowsUp;
}

/** Higher rows are harder; stages further right are harder but pay more. */
export const getOpponentLevel = (node: MapNode) =>
  3 + node.row * 4 + node.col + (node.isBoss ? 4 : 0);

export const getCoinReward = (node: MapNode) =>
  node.isBoss ? 200 : 30 + node.row * 10 + node.col * 8;
