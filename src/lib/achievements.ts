export interface TrainerStats {
  seen: number;
  caught: number;
  caughtTypes: number;
  battlesWon: number;
  battlesLost: number;
  favorites: number;
  teams: number;
  largestTeam: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: (stats: TrainerStats) => number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-battle", title: "First Battle", description: "Fight your first battle.", icon: "⚔️", target: 1, progress: (s) => s.battlesWon + s.battlesLost },
  { id: "first-victory", title: "First Victory", description: "Win a battle.", icon: "🏆", target: 1, progress: (s) => s.battlesWon },
  { id: "battle-veteran", title: "Battle Veteran", description: "Win 25 battles.", icon: "🎖️", target: 25, progress: (s) => s.battlesWon },
  { id: "first-catch", title: "First Catch", description: "Catch your first Pokémon.", icon: "🔴", target: 1, progress: (s) => s.caught },
  { id: "collector-10", title: "10 Pokémon Collected", description: "Catch 10 different Pokémon.", icon: "🎒", target: 10, progress: (s) => s.caught },
  { id: "collector-50", title: "Seasoned Collector", description: "Catch 50 different Pokémon.", icon: "💼", target: 50, progress: (s) => s.caught },
  { id: "type-master", title: "Type Master", description: "Catch Pokémon of all 18 types.", icon: "🌈", target: 18, progress: (s) => s.caughtTypes },
  { id: "pokedex-beginner", title: "Pokédex Beginner", description: "Discover 25 Pokémon.", icon: "📘", target: 25, progress: (s) => s.seen },
  { id: "pokedex-expert", title: "Kanto Expert", description: "Discover 151 Pokémon.", icon: "📗", target: 151, progress: (s) => s.seen },
  { id: "full-team", title: "Full Team", description: "Build a team of six Pokémon.", icon: "👥", target: 6, progress: (s) => s.largestTeam },
  { id: "fan-club", title: "Fan Club", description: "Favorite 10 Pokémon.", icon: "💖", target: 10, progress: (s) => s.favorites },
];

export const getAchievementProgress = (achievement: Achievement, stats: TrainerStats) => {
  const current = Math.min(achievement.progress(stats), achievement.target);
  return { current, unlocked: current >= achievement.target };
};

export const getUnlockedIds = (stats: TrainerStats) =>
  ACHIEVEMENTS.filter((achievement) => getAchievementProgress(achievement, stats).unlocked).map(
    (achievement) => achievement.id,
  );
