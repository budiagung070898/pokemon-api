import { TrainerStats } from "@/lib/achievements";
import type { CaughtPokemon } from "@/stores/progress-store";
import type { Team } from "@/stores/team-store";

interface TrainerStatsInput {
  seen: number[];
  caught: CaughtPokemon[];
  battlesWon: number;
  battlesLost: number;
  favorites: string[];
  teams: Team[];
}

export function computeTrainerStats(input: TrainerStatsInput): TrainerStats {
  return {
    seen: input.seen.length,
    caught: new Set(input.caught.map((entry) => entry.id)).size,
    caughtTypes: new Set(input.caught.flatMap((entry) => entry.types)).size,
    battlesWon: input.battlesWon,
    battlesLost: input.battlesLost,
    favorites: input.favorites.length,
    teams: input.teams.length,
    largestTeam: Math.max(0, ...input.teams.map((team) => team.members.length)),
  };
}
