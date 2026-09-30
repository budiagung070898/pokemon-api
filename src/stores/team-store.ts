import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_TEAM_SIZE = 6;
export const DEFAULT_LEVEL = 50;

export interface TeamMember {
  name: string;
  level: number;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: number;
}

type AddResult = "added" | "duplicate" | "full";

interface TeamState {
  teams: Team[];
  activeTeamId: string | null;
  createTeam: () => string;
  deleteTeam: (id: string) => void;
  renameTeam: (id: string, name: string) => void;
  setActiveTeam: (id: string) => void;
  /** Adds to the given team, or to the active team (creating one if needed). */
  addMember: (name: string, teamId?: string) => { result: AddResult; teamName: string };
  removeMember: (teamId: string, index: number) => void;
  replaceMember: (teamId: string, index: number, name: string) => void;
  moveMember: (teamId: string, from: number, to: number) => void;
  setLevel: (teamId: string, index: number, level: number) => void;
}

const newTeam = (count: number): Team => ({
  id: crypto.randomUUID(),
  name: `Team ${count + 1}`,
  members: [],
  createdAt: Date.now(),
});

const clampLevel = (level: number) => Math.min(100, Math.max(1, Math.round(level) || 1));

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => {
      const updateTeam = (id: string, update: (team: Team) => Team) =>
        set((state) => ({
          teams: state.teams.map((team) => (team.id === id ? update(team) : team)),
        }));

      return {
        teams: [],
        activeTeamId: null,

        createTeam: () => {
          const team = newTeam(get().teams.length);
          set((state) => ({ teams: [...state.teams, team], activeTeamId: team.id }));
          return team.id;
        },

        deleteTeam: (id) =>
          set((state) => {
            const teams = state.teams.filter((team) => team.id !== id);
            const activeTeamId =
              state.activeTeamId === id ? (teams[0]?.id ?? null) : state.activeTeamId;
            return { teams, activeTeamId };
          }),

        renameTeam: (id, name) =>
          updateTeam(id, (team) => ({ ...team, name: name.trim() || team.name })),

        setActiveTeam: (id) => set({ activeTeamId: id }),

        addMember: (name, teamId) => {
          const targetId = teamId ?? get().activeTeamId ?? get().createTeam();
          const team = get().teams.find((candidate) => candidate.id === targetId);
          if (!team) return { result: "full", teamName: "" };

          if (team.members.some((member) => member.name === name)) {
            return { result: "duplicate", teamName: team.name };
          }
          if (team.members.length >= MAX_TEAM_SIZE) {
            return { result: "full", teamName: team.name };
          }

          updateTeam(targetId, (current) => ({
            ...current,
            members: [...current.members, { name, level: DEFAULT_LEVEL }],
          }));
          return { result: "added", teamName: team.name };
        },

        removeMember: (teamId, index) =>
          updateTeam(teamId, (team) => ({
            ...team,
            members: team.members.filter((_, i) => i !== index),
          })),

        replaceMember: (teamId, index, name) =>
          updateTeam(teamId, (team) => {
            if (team.members.some((member, i) => member.name === name && i !== index)) {
              return team;
            }
            return {
              ...team,
              members: team.members.map((member, i) => (i === index ? { ...member, name } : member)),
            };
          }),

        moveMember: (teamId, from, to) =>
          updateTeam(teamId, (team) => {
            if (to < 0 || to >= team.members.length) return team;
            const members = [...team.members];
            const [moved] = members.splice(from, 1);
            members.splice(to, 0, moved);
            return { ...team, members };
          }),

        setLevel: (teamId, index, level) =>
          updateTeam(teamId, (team) => ({
            ...team,
            members: team.members.map((member, i) =>
              i === index ? { ...member, level: clampLevel(level) } : member,
            ),
          })),
      };
    },
    {
      name: "pokedex-teams",
      skipHydration: true,
    },
  ),
);

export const useActiveTeam = () =>
  useTeamStore(
    (state) => state.teams.find((team) => team.id === state.activeTeamId) ?? state.teams[0],
  );
