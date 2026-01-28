import { AppNavbar } from "@/components/layout/navbar/app-navbar";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/react-query-provider";
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
  title: "Pokemon Encyclopedia",
  description: "Pokémon Encyclopedia built with Next.js and PokéAPI",
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
          "min-h-screen text-foreground antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            {/* Fixed background */}
            <div
              className="
            fixed inset-0 -z-10
            bg-linear-to-br
            from-sky-200 via-sky-100 to-amber-100
            dark:from-purple-950 dark:via-purple-900 dark:to-indigo-900
          "
            />

            <AppNavbar />

            <main className="py-20 max-w-7xl mx-auto px-6 text-muted-foreground">
              {children}
            </main>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
