import { AppNavbar } from "@/components/layout/navbar/app-navbar";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/react-query-provider";
import { StoreHydration } from "@/providers/store-hydration";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pokédex — Explore the Pokémon World",
    template: "%s",
  },
  description:
    "An interactive Pokédex: explore Pokémon, build teams and battle. Built with Next.js and PokéAPI.",
  icons: {
    icon: {
      url: "logo/pokemon.svg",
      href: "/logo/pokemon.svg",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-background text-foreground antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <StoreHydration />
            <a
              href="#main"
              className="sr-only z-[60] rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              Skip to content
            </a>

            <AppNavbar />

            <main
              id="main"
              className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6"
            >
              {children}
            </main>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
