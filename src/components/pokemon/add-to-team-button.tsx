"use client";

import { Button } from "@/components/ui/button";
import { formatName } from "@/lib/pokemon";
import { MAX_TEAM_SIZE, useTeamStore } from "@/stores/team-store";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddToTeamButton({ name }: { name: string }) {
  const addMember = useTeamStore((state) => state.addMember);
  const router = useRouter();

  const add = () => {
    const { result, teamName } = addMember(name);
    const pokemon = formatName(name);

    if (result === "duplicate") toast.info(`${pokemon} is already in ${teamName}.`);
    if (result === "full") toast.warning(`${teamName} already has ${MAX_TEAM_SIZE} Pokémon.`);
    if (result === "added") {
      toast.success(`${pokemon} joined ${teamName}!`, {
        action: { label: "View team", onClick: () => router.push("/team") },
      });
    }
  };

  return (
    <Button variant="outline" onClick={add} className="rounded-full">
      <Plus aria-hidden />
      Add to team
    </Button>
  );
}

