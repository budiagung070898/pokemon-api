import { formatName } from "@/lib/pokemon";
import { PokemonDetail } from "@/types/pokemon-types";

export function CompareProfile({ a, b }: { a: PokemonDetail; b: PokemonDetail }) {
  const rows = [
    { label: "Height", a: `${a.height / 10} m`, b: `${b.height / 10} m` },
    { label: "Weight", a: `${a.weight / 10} kg`, b: `${b.weight / 10} kg` },
    { label: "Base Exp.", a: a.base_experience ?? "—", b: b.base_experience ?? "—" },
    {
      label: "Abilities",
      a: a.abilities.map(({ ability }) => formatName(ability.name)).join(", "),
      b: b.abilities.map(({ ability }) => formatName(ability.name)).join(", "),
    },
  ];

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Profile comparison</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b last:border-0">
            <td className="w-1/2 py-2.5 pr-3 text-right font-semibold text-foreground">{row.a}</td>
            <th scope="row" className="w-20 py-2.5 text-center text-xs font-semibold text-muted-foreground">
              {row.label}
            </th>
            <td className="w-1/2 py-2.5 pl-3 font-semibold text-foreground">{row.b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
