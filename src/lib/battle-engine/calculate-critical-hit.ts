import { RandomFn } from "./types";

/** Gen VI+ base critical hit chance (1 in 24) and multiplier. */
export const CRITICAL_HIT_CHANCE = 1 / 24;
export const CRITICAL_HIT_MULTIPLIER = 1.5;

export const calculateCriticalHit = (random: RandomFn) => random() < CRITICAL_HIT_CHANCE;
