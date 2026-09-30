# Pokédex — Implementation Plan

Modern interactive Pokédex + encyclopedia + team builder + battle game on top of
[PokéAPI](https://pokeapi.co). Built incrementally; every phase ends with
`tsc --noEmit`, `eslint` and `next build` passing.

## Stack (unchanged from the existing project)

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui (Radix) · TanStack Query (server state) · axios · Zod (URL params) ·
Zustand + `persist` (client state: favorites, team, progress).

Motion library is deferred until the battle phase; CSS transitions and
`tw-animate-css` cover everything before that.

## Architecture

```
src/
  api/            axios API classes per PokéAPI resource (existing pattern)
  queries/        TanStack Query hooks + consistent query keys
  types/          PokéAPI response types
  constant/       type list + colors, endpoints
  lib/            pure helpers (pokemon formatting, battle-engine later)
  stores/         Zustand stores (persisted client state)
  providers/      React Query provider, store hydration
  components/
    ui/           shadcn primitives
    common/       Empty/Error states, Poké Ball mark
    pokemon/      PokemonCard, PokemonGrid, PokemonTypeBadge, PokemonArtwork, FavoriteButton
    layout/       navbar
  features/       page-level feature modules (home, pokedex, pokemon-detail, …)
  app/            routes only — thin server components that render features
```

### Data strategy

- PokéAPI has no search/filter endpoints. The Pokédex loads the lightweight
  `/pokemon?limit=…` index once (`staleTime: Infinity`) and filters in memory.
- Type filter → `/type/{name}`; generation filter → `/generation/{id}`; results
  are intersected by id.
- Card details are fetched per visible card (`usePokemon(name)`), shared by
  cache with the detail page, so opening a card is instant.
- Sorting by base stats needs details, so it is only enabled when filters
  narrow the list to ≤ 160 Pokémon.
- Global defaults: `staleTime` 1h, `gcTime` 24h, no refetch on focus.

### URL state

`/pokedex?search=char&type=fire&generation=1&sort=stat&page=2` — parsed with a
Zod schema (invalid values fall back to defaults) and updated with native
`history.pushState/replaceState`, which Next.js syncs with `useSearchParams`.

## Phases

### Phase 1 — Foundation ✅
- Neutral theme tokens, type color system, navbar (desktop + mobile sheet), skip link
- Home: hero, featured Pokémon, random discovery, quick explore, battle CTA
- `/pokedex`: search (name/ID), type & generation filters, sort, pagination,
  skeleton / empty / error states, URL state
- Pokémon card with favorite button (Zustand persisted store)
- `/pokedex/[pokemon]` dedicated route (basic view + metadata), redirects from old `/pokemon` routes
- `/battle` placeholder

### Phase 2 — Pokémon detail ✅
- Shiny toggle, prev/next navigation, cry audio
- Overview incl. species data (`/pokemon-species`): gender ratio, capture rate, growth rate, genus
- Animated stat bars, abilities with descriptions + hidden badge
- Moves with learn-method filter (level-up / machine / egg / tutor); move detail on demand
- Evolution tree from `/evolution-chain` with branching + trigger conditions
- Type effectiveness computed from `/type` damage relations
- Flavor text with game/version selector, game appearances
- Server-side prefetch + `HydrationBoundary` (content in initial HTML, real 404, flavor text as meta description)
- Notes: TM and HM share PokéAPI's `machine` learn method, so they are one filter;
  each row shows the game-specific item (TM24, HM03…) from `/machine`.

### Phase 2.5 — Compare Pokémon ✅
- `/compare?a=charizard&b=dragonite` (shareable)
- Side-by-side stat table with winner highlight, type matchup both directions,
  shared/unique move comparison
- Reusable `PokemonPicker` (searchable combobox) — reused by Team Builder and Battle
- Entry points: navbar, "Compare" button on the detail page

### Phase 3 — Favorites & Team Builder ✅
- `/favorites`
- `/team`: up to 6, add/remove/reorder/replace, rename, save multiple teams
- **Team Analyzer**: pure functions computing team weaknesses, resistances,
  immunities and offensive coverage from type data (unit-testable, UI-independent)
- Level per member (slider) with stats computed at that level (`lib/pokemon-stats.ts`,
  reused by the battle engine); "Add to team" on the detail page with toasts
- Teams auto-save to localStorage (Zustand `persist`); multiple teams act as saved slots
- Reorder uses accessible "Move up / Move down" buttons instead of drag & drop

### Phase 4 — Battle
- `lib/battle-engine/`: `calculateDamage`, `calculateTypeEffectiveness`,
  `calculateTurnOrder`, `calculateCriticalHit`, `battleState` (reducer-style state machine)
- Battle UI: arena, HP bars, move picker, log, result; Quick Battle (random opponent)
- **Battle Replay**: the engine emits an event log per turn; the replay player
  re-runs those events through the same animation pipeline

### Phase 5 — Progress
- Catch system (Poké/Great/Ultra Ball probabilities based on species capture rate)
- `/collection` (seen / caught, silhouettes, completion %)
- `/profile` stats and achievements, all persisted locally
