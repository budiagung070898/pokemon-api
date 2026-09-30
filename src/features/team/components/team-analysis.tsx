"use client";

import { SectionCard } from "@/components/common/section-card";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { formatMultiplier } from "@/lib/type-effectiveness";
import { cn } from "@/lib/utils";
import { pokemonQueryOptions } from "@/queries/pokemon/use-pokemon";
import { typeQueryOptions } from "@/queries/type/use-type";
import { TeamMember } from "@/stores/team-store";
import { TypeDetail } from "@/types/type-types";
import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import {
  analyzeCoverage,
  analyzeDefense,
  AnalyzedMember,
  CoverageEntry,
  DefensiveRow,
  getThreats,
} from "../lib/team-analysis";

export function TeamAnalysis({ members }: { members: TeamMember[] }) {
  const pokemonQueries = useQueries({
    queries: members.map((member) => pokemonQueryOptions(member.name)),
  });
  const analyzed: AnalyzedMember[] = pokemonQueries.flatMap((query) =>
    query.data
      ? [{ id: query.data.id, name: query.data.name, types: query.data.types.map(({ type }) => type.name) }]
      : [],
  );

  const uniqueTypes = [...new Set(analyzed.flatMap((member) => member.types))];
  const typeQueries = useQueries({ queries: uniqueTypes.map(typeQueryOptions) });

  const isLoading =
    analyzed.length < members.length || typeQueries.some((query) => !query.data);
  const hasError =
    pokemonQueries.some((query) => query.isError) || typeQueries.some((query) => query.isError);

  if (hasError) {
    return (
      <SectionCard id="team-analysis" title="Team analysis">
        <p className="text-sm text-muted-foreground">Analysis is unavailable right now.</p>
      </SectionCard>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 rounded-3xl bg-muted" aria-label="Analyzing team" />;
  }

  const typeDetails = new Map<string, TypeDetail>(
    typeQueries.map((query) => [query.data!.name, query.data!]),
  );
  const defense = analyzeDefense(analyzed, typeDetails);
  const coverage = analyzeCoverage(analyzed, typeDetails);

  return (
    <div className="space-y-6">
      <SectionCard id="team-summary" title="Team analysis">
        <DefenseSummary rows={defense} />
      </SectionCard>
      <SectionCard id="defense-matrix" title="Defensive matchups">
        <DefenseMatrix rows={defense} members={analyzed} />
      </SectionCard>
      <SectionCard id="coverage" title="Offensive coverage (STAB)">
        <CoverageGrid entries={coverage} />
      </SectionCard>
    </div>
  );
}

function DefenseSummary({ rows }: { rows: DefensiveRow[] }) {
  const weaknesses = rows.filter((row) => row.weak > 0).sort((a, b) => b.weak - a.weak);
  const resistances = rows
    .filter((row) => row.resist + row.immune > 0)
    .sort((a, b) => b.resist + b.immune - (a.resist + a.immune));
  const threats = getThreats(rows);

  return (
    <div className="space-y-5">
      {threats.length > 0 && (
        <p role="status" className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
          <strong>Watch out:</strong>{" "}
          {threats.map((row) => formatName(row.attackingType)).join(", ")}{" "}
          {threats.length === 1 ? "attacks hit" : "attacks each hit"} several members hard, and few
          members resist {threats.length === 1 ? "it" : "them"}.
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <CountList
          title="Weaknesses"
          tone="text-rose-600 dark:text-rose-400"
          items={weaknesses.map((row) => ({ type: row.attackingType, count: row.weak }))}
          empty="No shared weaknesses."
        />
        <CountList
          title="Resistances & immunities"
          tone="text-emerald-600 dark:text-emerald-400"
          items={resistances.map((row) => ({ type: row.attackingType, count: row.resist + row.immune }))}
          empty="No resistances yet."
        />
      </div>
      <p className="text-xs text-muted-foreground">Numbers show how many team members are affected.</p>
    </div>
  );
}

function CountList({
  title,
  tone,
  items,
  empty,
}: {
  title: string;
  tone: string;
  items: { type: string; count: number }[];
  empty: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className={cn("text-xs font-bold tracking-wider uppercase", tone)}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {items.map(({ type, count }) => (
            <li key={type} className="inline-flex items-center gap-1 rounded-full border bg-background py-0.5 pr-2 pl-0.5">
              <PokemonTypeBadge type={type} />
              <span className="text-xs font-bold text-foreground tabular-nums">
                ×{count}
                <span className="sr-only"> members</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const CELL_STYLES: Record<string, string> = {
  "4": "bg-rose-600 text-white",
  "2": "bg-rose-500/20 text-rose-700 dark:text-rose-300",
  "0.5": "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "0.25": "bg-emerald-600 text-white",
  "0": "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
};

function DefenseMatrix({ rows, members }: { rows: DefensiveRow[]; members: AnalyzedMember[] }) {
  return (
    <div className="-mx-5 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[560px] border-separate border-spacing-1 text-center text-xs">
        <caption className="sr-only">Damage multiplier each attacking type deals to each team member</caption>
        <thead>
          <tr>
            <th scope="col" className="w-24 text-left font-semibold text-muted-foreground">
              Attack
            </th>
            {members.map((member) => (
              <th key={member.name} scope="col" className="font-normal">
                <span className="sr-only">{formatName(member.name)}</span>
                <Image
                  src={getArtworkUrl(member.id)}
                  alt=""
                  width={36}
                  height={36}
                  className="mx-auto"
                  title={formatName(member.name)}
                />
              </th>
            ))}
            <th scope="col" className="font-semibold text-rose-600 dark:text-rose-400">Weak</th>
            <th scope="col" className="font-semibold text-emerald-600 dark:text-emerald-400">Resist</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.attackingType}>
              <th scope="row" className="text-left">
                <PokemonTypeBadge type={row.attackingType} />
              </th>
              {row.multipliers.map((multiplier, index) => (
                <td
                  key={members[index].name}
                  className={cn("h-7 rounded-md font-bold tabular-nums", CELL_STYLES[String(multiplier)])}
                >
                  {multiplier === 1 ? <span className="sr-only">×1</span> : formatMultiplier(multiplier)}
                </td>
              ))}
              <td className={cn("font-bold tabular-nums", row.weak >= 3 ? "text-rose-600" : "text-foreground")}>
                {row.weak}
              </td>
              <td className="font-bold text-foreground tabular-nums">{row.resist + row.immune}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoverageGrid({ entries }: { entries: CoverageEntry[] }) {
  const covered = entries.filter((entry) => entry.coveredBy.length > 0).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your team&apos;s own types hit{" "}
        <strong className="text-foreground">
          {covered} of {entries.length}
        </strong>{" "}
        types super-effectively. Based on STAB only, since full movesets aren&apos;t chosen here.
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {entries.map(({ defendingType, coveredBy }) => (
          <li
            key={defendingType}
            className={cn(
              "space-y-1.5 rounded-2xl border p-3",
              coveredBy.length === 0 && "border-dashed opacity-60",
            )}
          >
            <PokemonTypeBadge type={defendingType} />
            <p className="text-[11px] text-muted-foreground">
              {coveredBy.length > 0
                ? `Hit by ${coveredBy.map(formatName).join(", ")}`
                : "Not covered"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

