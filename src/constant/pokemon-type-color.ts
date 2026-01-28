export const POKEMON_TYPE_BORDERS: Record<string, string> = {
  normal: "border-zinc-400/60",
  fire: "border-orange-500/70",
  water: "border-sky-500/70",
  electric: "border-yellow-400/80",
  grass: "border-emerald-500/70",
  ice: "border-cyan-300/70",
  fighting: "border-red-600/70",
  poison: "border-purple-500/70",
  ground: "border-amber-600/70",
  flying: "border-indigo-400/70",
  psychic: "border-pink-500/70",
  bug: "border-lime-500/70",
  rock: "border-stone-500/70",
  ghost: "border-violet-500/70",
  dragon: "border-indigo-600/70",
  dark: "border-neutral-700/70",
  steel: "border-slate-400/70",
  fairy: "border-rose-400/70",
};

export const POKEMON_TYPE_GRADIENTS: Record<string, string> = {
  fire: "from-orange-400 via-red-500 to-yellow-400",
  water: "from-sky-400 via-blue-500 to-cyan-400",
  grass: "from-emerald-400 via-green-500 to-lime-400",
  electric: "from-yellow-300 via-yellow-400 to-amber-400",
  ice: "from-cyan-200 via-sky-300 to-blue-300",
  psychic: "from-pink-400 via-fuchsia-500 to-purple-500",
  fairy: "from-rose-300 via-pink-400 to-fuchsia-400",
  dragon: "from-indigo-500 via-purple-600 to-sky-500",
  dark: "from-neutral-600 via-neutral-800 to-black",
  steel: "from-slate-300 via-slate-400 to-zinc-400",
  bug: "from-lime-400 via-green-500 to-emerald-400",
  poison: "from-purple-400 via-violet-500 to-fuchsia-500",
  ground: "from-amber-500 via-orange-600 to-yellow-600",
  flying: "from-indigo-300 via-sky-400 to-cyan-300",
  fighting: "from-red-500 via-orange-600 to-yellow-500",
  rock: "from-stone-400 via-amber-500 to-yellow-600",
  ghost: "from-violet-500 via-purple-600 to-indigo-600",
  normal: "from-zinc-300 via-neutral-400 to-stone-400",
};

export const POKEMON_TYPE_GLASS = {
  normal: {
    glow: "from-zinc-300/40 to-zinc-400/30",
    border: "border-zinc-400/30",
    text: "text-zinc-800 dark:text-zinc-100",
    accent: "text-zinc-700 dark:text-zinc-200",
    muted: "text-zinc-500 dark:text-zinc-400",
  },

  fire: {
    glow: "from-orange-400/50 to-red-500/40",
    border: "border-orange-400/40",
    text: "text-orange-900 dark:text-orange-100",
    accent: "text-orange-700 dark:text-orange-200",
    muted: "text-orange-600/80 dark:text-orange-300/70",
  },

  water: {
    glow: "from-sky-400/50 to-blue-500/40",
    border: "border-sky-400/40",
    text: "text-blue-900 dark:text-sky-100",
    accent: "text-sky-700 dark:text-sky-200",
    muted: "text-sky-600/80 dark:text-sky-300/70",
  },

  grass: {
    glow: "from-emerald-400/50 to-green-500/40",
    border: "border-emerald-400/40",
    text: "text-emerald-900 dark:text-emerald-100",
    accent: "text-emerald-700 dark:text-emerald-200",
    muted: "text-emerald-600/80 dark:text-emerald-300/70",
  },

  electric: {
    glow: "from-yellow-300/60 to-amber-400/40",
    border: "border-yellow-400/40",
    text: "text-amber-900 dark:text-yellow-100",
    accent: "text-yellow-700 dark:text-yellow-200",
    muted: "text-yellow-600/80 dark:text-yellow-300/70",
  },

  ice: {
    glow: "from-cyan-300/50 to-sky-400/40",
    border: "border-cyan-300/40",
    text: "text-cyan-900 dark:text-cyan-100",
    accent: "text-cyan-700 dark:text-cyan-200",
    muted: "text-cyan-600/80 dark:text-cyan-300/70",
  },

  fighting: {
    glow: "from-red-500/50 to-rose-600/40",
    border: "border-red-500/40",
    text: "text-red-900 dark:text-red-100",
    accent: "text-red-700 dark:text-red-200",
    muted: "text-red-600/80 dark:text-red-300/70",
  },

  poison: {
    glow: "from-fuchsia-500/50 to-purple-600/40",
    border: "border-fuchsia-500/40",
    text: "text-purple-900 dark:text-purple-100",
    accent: "text-purple-700 dark:text-purple-200",
    muted: "text-purple-600/80 dark:text-purple-300/70",
  },

  ground: {
    glow: "from-amber-400/50 to-yellow-600/40",
    border: "border-amber-400/40",
    text: "text-amber-900 dark:text-amber-100",
    accent: "text-amber-700 dark:text-amber-200",
    muted: "text-amber-600/80 dark:text-amber-300/70",
  },

  flying: {
    glow: "from-indigo-300/50 to-sky-400/40",
    border: "border-indigo-300/40",
    text: "text-indigo-900 dark:text-indigo-100",
    accent: "text-indigo-700 dark:text-indigo-200",
    muted: "text-indigo-600/80 dark:text-indigo-300/70",
  },

  psychic: {
    glow: "from-pink-400/50 to-fuchsia-500/40",
    border: "border-pink-400/40",
    text: "text-pink-900 dark:text-pink-100",
    accent: "text-pink-700 dark:text-pink-200",
    muted: "text-pink-600/80 dark:text-pink-300/70",
  },

  bug: {
    glow: "from-lime-400/50 to-green-500/40",
    border: "border-lime-400/40",
    text: "text-lime-900 dark:text-lime-100",
    accent: "text-lime-700 dark:text-lime-200",
    muted: "text-lime-600/80 dark:text-lime-300/70",
  },

  rock: {
    glow: "from-stone-400/50 to-stone-600/40",
    border: "border-stone-400/40",
    text: "text-stone-900 dark:text-stone-100",
    accent: "text-stone-700 dark:text-stone-200",
    muted: "text-stone-600/80 dark:text-stone-300/70",
  },

  ghost: {
    glow: "from-violet-500/50 to-indigo-600/40",
    border: "border-violet-500/40",
    text: "text-violet-900 dark:text-violet-100",
    accent: "text-violet-700 dark:text-violet-200",
    muted: "text-violet-600/80 dark:text-violet-300/70",
  },

  dragon: {
    glow: "from-indigo-500/60 to-purple-600/40",
    border: "border-indigo-500/40",
    text: "text-indigo-900 dark:text-indigo-100",
    accent: "text-indigo-700 dark:text-indigo-200",
    muted: "text-indigo-600/80 dark:text-indigo-300/70",
  },

  dark: {
    glow: "from-zinc-700/60 to-black/40",
    border: "border-zinc-600/40",
    text: "text-zinc-900 dark:text-zinc-100",
    accent: "text-zinc-700 dark:text-zinc-200",
    muted: "text-zinc-600/80 dark:text-zinc-400",
  },

  steel: {
    glow: "from-slate-300/50 to-slate-500/40",
    border: "border-slate-400/40",
    text: "text-slate-900 dark:text-slate-100",
    accent: "text-slate-700 dark:text-slate-200",
    muted: "text-slate-600/80 dark:text-slate-300/70",
  },

  fairy: {
    glow: "from-pink-300/60 to-rose-400/40",
    border: "border-pink-400/40",
    text: "text-pink-900 dark:text-pink-100",
    accent: "text-pink-700 dark:text-pink-200",
    muted: "text-pink-600/80 dark:text-pink-300/70",
  },
} as const;
