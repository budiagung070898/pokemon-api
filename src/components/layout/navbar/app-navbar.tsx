"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { label: "Pokémon", href: "/pokemon" },
  { label: "Abilities", href: "/abilities" },
  { label: "Moves", href: "/moves" },
];

export const AppNavbar = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full bg-white/70 dark:bg-purple-900/60 backdrop-blur-md border-b border-white/30 dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">
            P
          </div>
          <span className="font-extrabold tracking-wide">PokéDex</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold transition-all duration-300 group",
                  active
                    ? "text-sky-600 dark:text-amber-300"
                    : "text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-amber-300",
                )}
              >
                {item.label}

                {/* Active underline */}
                {active && (
                  <span
                    className={cn(
                      "pointer-events-none absolute -bottom-3 left-0 h-0.75 w-full rounded-full opacity-0 transition-opacity",
                      "group-hover:opacity-60",
                      active && "opacity-100",
                      "bg-linear-to-r from-sky-500 via-cyan-400 to-sky-500",
                      "dark:from-amber-400 dark:via-orange-400 dark:to-amber-400",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
