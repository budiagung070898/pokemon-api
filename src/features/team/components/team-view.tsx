"use client";

import { EmptyState } from "@/components/common/empty-state";
import { InlineEditInput } from "@/components/common/inline-edit-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { MAX_TEAM_SIZE, Team, useActiveTeam, useTeamStore } from "@/stores/team-store";
import { Check, Heart, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { TeamAnalysis } from "./team-analysis";
import { TeamEmptySlot } from "./team-empty-slot";
import { TeamMemberCard } from "./team-member-card";

export function TeamView() {
  const isHydrated = useStoreHydrated(useTeamStore);
  const teams = useTeamStore((state) => state.teams);
  const team = useActiveTeam();
  const createTeam = useTeamStore((state) => state.createTeam);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Team Builder
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Build your dream team
        </h1>
      </header>

      {!isHydrated && <Skeleton className="h-96 rounded-3xl bg-muted" />}

      {isHydrated && !team && (
        <EmptyState
          title="No teams yet"
          description="Create a team of up to six Pokémon and see how they cover each other."
          action={
            <Button className="rounded-full" onClick={createTeam}>
              <Plus aria-hidden />
              Create your first team
            </Button>
          }
        />
      )}

      {isHydrated && team && (
        <>
          <TeamSwitcher teams={teams} activeId={team.id} />
          <TeamEditor team={team} />
        </>
      )}
    </div>
  );
}

function TeamSwitcher({ teams, activeId }: { teams: Team[]; activeId: string }) {
  const setActiveTeam = useTeamStore((state) => state.setActiveTeam);
  const createTeam = useTeamStore((state) => state.createTeam);

  return (
    <nav aria-label="Your teams" className="flex gap-2 overflow-x-auto pb-1">
      {teams.map((team) => (
        <button
          key={team.id}
          type="button"
          onClick={() => setActiveTeam(team.id)}
          aria-current={team.id === activeId ? "true" : undefined}
          className={cn(
            "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold outline-none transition focus-visible:ring-[3px] focus-visible:ring-ring/60",
            team.id === activeId
              ? "border-foreground bg-foreground text-background"
              : "bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {team.name}
          <span className="ml-2 opacity-60 tabular-nums">{team.members.length}/{MAX_TEAM_SIZE}</span>
        </button>
      ))}
      <Button variant="outline" className="shrink-0 rounded-full" onClick={createTeam}>
        <Plus aria-hidden />
        New team
      </Button>
    </nav>
  );
}

function TeamEditor({ team }: { team: Team }) {
  // Actions never change, so a shallow selector avoids re-rendering on unrelated updates.
  const { renameTeam, deleteTeam, addMember, removeMember, replaceMember, moveMember, setLevel } =
    useTeamStore(
      useShallow((state) => ({
        renameTeam: state.renameTeam,
        deleteTeam: state.deleteTeam,
        addMember: state.addMember,
        removeMember: state.removeMember,
        replaceMember: state.replaceMember,
        moveMember: state.moveMember,
        setLevel: state.setLevel,
      })),
    );

  const add = (name: string) => {
    const { result } = addMember(name, team.id);
    if (result === "duplicate") toast.info(`${formatName(name)} is already on this team.`);
  };

  const replace = (index: number, name: string) => {
    if (team.members.some((member, i) => member.name === name && i !== index)) {
      toast.info(`${formatName(name)} is already on this team.`);
      return;
    }
    replaceMember(team.id, index, name);
  };

  const emptySlots = MAX_TEAM_SIZE - team.members.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InlineEditInput
          key={team.id}
          value={team.name}
          label="Team name"
          onSave={(name) => renameTeam(team.id, name)}
        />
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
            <Check className="size-3.5 text-emerald-500" aria-hidden />
            Saved on this device
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Trash2 aria-hidden />
                Delete team
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {team.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The team and its {team.members.length} Pokémon will be removed. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTeam(team.id)}>Delete team</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {emptySlots > 0 && <FavoritesQuickAdd team={team} onAdd={add} />}

      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {team.members.map((member, index) => (
          <li key={member.name}>
            <TeamMemberCard
              member={member}
              index={index}
              teamSize={team.members.length}
              onReplace={(name) => replace(index, name)}
              onRemove={() => removeMember(team.id, index)}
              onMove={(to) => moveMember(team.id, index, to)}
              onLevelChange={(level) => setLevel(team.id, index, level)}
            />
          </li>
        ))}
        {Array.from({ length: emptySlots }, (_, offset) => (
          <li key={`empty-${offset}`}>
            <TeamEmptySlot index={team.members.length + offset} onAdd={add} />
          </li>
        ))}
      </ol>

      {team.members.length > 0 && <TeamAnalysis members={team.members} />}
    </div>
  );
}

function FavoritesQuickAdd({ team, onAdd }: { team: Team; onAdd: (name: string) => void }) {
  const favorites = useFavoritesStore((state) => state.names);
  const available = favorites.filter((name) => !team.members.some((member) => member.name === name));

  if (available.length === 0) return null;

  return (
    <section aria-label="Add from favorites" className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <Heart className="size-4 fill-rose-500 text-rose-500" aria-hidden />
        Quick add:
      </span>
      {available.slice(0, 8).map((name) => (
        <Button
          key={name}
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onAdd(name)}
          aria-label={`Add ${formatName(name)} to ${team.name}`}
        >
          <Plus aria-hidden />
          {formatName(name)}
        </Button>
      ))}
    </section>
  );
}
