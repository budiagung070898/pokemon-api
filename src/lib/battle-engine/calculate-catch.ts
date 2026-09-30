import { RandomFn } from "./types";

export type BallType = "poke-ball" | "great-ball" | "ultra-ball";

export const BALLS: { type: BallType; label: string; bonus: number }[] = [
  { type: "poke-ball", label: "Poké Ball", bonus: 1 },
  { type: "great-ball", label: "Great Ball", bonus: 1.5 },
  { type: "ultra-ball", label: "Ultra Ball", bonus: 2 },
];

// Main-series capture rates go up to 255 (easiest).
const MAX_CAPTURE_RATE = 255;

/**
 * Simplified Gen III+ catch formula for a weakened Pokémon:
 *   chance = ((3·maxHP − 2·HP) / (3·maxHP)) × captureRate × ball / 255
 * The opponent was just defeated, so it's treated as having 1 HP left.
 */
export function calculateCatchChance(captureRate: number, ballBonus: number, maxHp = 100, hp = 1) {
  const hpFactor = (3 * maxHp - 2 * hp) / (3 * maxHp);
  return Math.min(1, (hpFactor * captureRate * ballBonus) / MAX_CAPTURE_RATE);
}

export interface CatchAttempt {
  caught: boolean;
  /** 0–3 wobbles before breaking free (3 + caught = click!). */
  shakes: number;
}

export function attemptCatch(chance: number, random: RandomFn): CatchAttempt {
  // Each of the three shakes must pass; the per-shake odds multiply back to `chance`.
  const perShake = Math.cbrt(chance);
  let shakes = 0;
  while (shakes < 3 && random() < perShake) shakes++;
  return { caught: shakes === 3, shakes };
}
