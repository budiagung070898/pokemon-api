import { TeamView } from "@/features/team/components/team-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Builder | Pokédex",
  description: "Build a team of six Pokémon and analyze its weaknesses, resistances and coverage.",
};

export default function TeamPage() {
  return <TeamView />;
}
