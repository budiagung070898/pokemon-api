import { getIdFromUrl } from "@/lib/pokemon";
import { PokemonMove } from "@/types/pokemon-types";

export const LEARN_METHODS = [
  { value: "level-up", label: "Level Up" },
  { value: "machine", label: "TM / HM" },
  { value: "egg", label: "Egg" },
  { value: "tutor", label: "Tutor" },
  { value: "other", label: "Other" },
] as const;

export type LearnMethod = (typeof LEARN_METHODS)[number]["value"];

export interface LearnsetEntry {
  name: string;
  method: LearnMethod;
  level: number;
}

const KNOWN_METHODS: string[] = ["level-up", "machine", "egg", "tutor"];

const toLearnMethod = (method: string) =>
  (KNOWN_METHODS.includes(method) ? method : "other") as LearnMethod;

/** Version groups this Pokémon has moves in, newest first. */
export function getVersionGroups(moves: PokemonMove[]) {
  const groups = new Map<string, number>();

  for (const move of moves) {
    for (const { version_group } of move.version_group_details) {
      groups.set(version_group.name, getIdFromUrl(version_group.url));
    }
  }

  return [...groups.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

/** Moves learnable in one version group, level-up moves sorted by level. */
export function getLearnset(moves: PokemonMove[], versionGroup: string) {
  const entries = moves.flatMap((move) =>
    move.version_group_details
      .filter((detail) => detail.version_group.name === versionGroup)
      .map(
        (detail): LearnsetEntry => ({
          name: move.move.name,
          method: toLearnMethod(detail.move_learn_method.name),
          level: detail.level_learned_at,
        }),
      ),
  );

  return entries.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}
