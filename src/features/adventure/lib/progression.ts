import { calculateStat } from "@/lib/pokemon-stats";

export const STARTING_LEVEL = 5;
const MAX_LEVEL = 100;

export const xpForNextLevel = (level: number) => level * 5;
export const xpForVictory = (opponentLevel: number) => opponentLevel * 25;

export interface AdventurePartner {
  id: number;
  name: string;
  level: number;
  xp: number;
  /** Current HP; carried between battles. */
  hp: number;
}

/**
 * Adds XP and levels up. Max HP grows with each level and the gained HP is
 * added to current HP, like the games.
 */
export function gainExperience(partner: AdventurePartner, xp: number, baseHp: number) {
  let { level, xp: currentXp } = partner;
  currentXp += xp;
  while (level < MAX_LEVEL && currentXp >= xpForNextLevel(level)) {
    currentXp -= xpForNextLevel(level);
    level++;
  }

  const hpGain = calculateStat("hp", baseHp, level) - calculateStat("hp", baseHp, partner.level);
  return {
    partner: { ...partner, level, xp: currentXp, hp: partner.hp + hpGain },
    levelsGained: level - partner.level,
  };
}

export const getMaxHp = (baseHp: number, level: number) => calculateStat("hp", baseHp, level);
