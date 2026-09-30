import { CRITICAL_HIT_MULTIPLIER, calculateCriticalHit } from "./calculate-critical-hit";
import { calculateTypeEffectiveness } from "./calculate-type-effectiveness";
import { BattleMove, BattlePokemon, RandomFn, TypeChart } from "./types";

const STAB_MULTIPLIER = 1.5;

/** Damage rolls between 85% and 100%, like the main series games. */
const randomVariation = (random: RandomFn) => 0.85 + random() * 0.15;

export interface DamageResult {
  damage: number;
  effectiveness: number;
  critical: boolean;
}

/**
 * Main-series damage formula (Gen V+), without abilities, items, weather
 * or stat stages:
 *   ((2 × Level / 5 + 2) × Power × A / D) / 50 + 2, then × modifiers.
 */
export function calculateDamage(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: BattleMove,
  chart: TypeChart,
  random: RandomFn,
): DamageResult {
  const effectiveness = calculateTypeEffectiveness(move.type, defender.types, chart);
  if (effectiveness === 0) return { damage: 0, effectiveness, critical: false };

  const isPhysical = move.category === "physical";
  const attack = isPhysical ? attacker.stats.attack : attacker.stats.specialAttack;
  const defense = isPhysical ? defender.stats.defense : defender.stats.specialDefense;

  const levelFactor = Math.floor((2 * attacker.level) / 5 + 2);
  const base = Math.floor(Math.floor((levelFactor * move.power * attack) / defense) / 50) + 2;

  const critical = calculateCriticalHit(random);
  const stab = attacker.types.includes(move.type) ? STAB_MULTIPLIER : 1;
  const modifier =
    randomVariation(random) * stab * effectiveness * (critical ? CRITICAL_HIT_MULTIPLIER : 1);

  return { damage: Math.max(1, Math.floor(base * modifier)), effectiveness, critical };
}
