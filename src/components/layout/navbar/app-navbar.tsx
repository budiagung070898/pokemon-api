"use client";

import { Pokeball } from "@/components/common/pokeball";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Pokédex", href: "/pokedex" },
  { label: "Compare", href: "/compare" },
  { label: "Team", href: "/team" },
  { label: "Battle", href: "/battle" },
  { label: "Collection", href: "/collection" },
  { label: "Favorites", href: "/favorites" },
];

const PROFILE_ITEM = { label: "Profile", href: "/profile" };

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const AppNavbar = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <Pokeball className="size-7 text-rose-500" />
          <span className="text-lg font-black tracking-tight text-foreground">
            Pokédex
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  active={isActive(pathname, item.href)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant={isActive(pathname, PROFILE_ITEM.href) ? "secondary" : "ghost"}
            size="icon"
            className="hidden rounded-full lg:inline-flex"
          >
            <Link
              href={PROFILE_ITEM.href}
              aria-label="Trainer profile"
              aria-current={isActive(pathname, PROFILE_ITEM.href) ? "page" : undefined}
            >
              <UserRound className="size-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
};

function NavLink({
  href,
  active,
  children,
  className,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-semibold outline-none transition-colors",
        "focus-visible:ring-[3px] focus-visible:ring-ring/60",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="flex flex-col gap-1">
            {[...NAV_ITEMS, PROFILE_ITEM].map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <NavLink
                    href={item.href}
                    active={isActive(pathname, item.href)}
                    className="block px-4 py-3 text-base"
                  >
                    {item.label}
                  </NavLink>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
