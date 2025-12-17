import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JoshCoach",
  description: "Privacy-first spaced repetition learning for relationship education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-10%] top-[-20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.22),_transparent_60%)] blur-2xl" />
            <div className="absolute right-[-5%] top-[10%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.18),_transparent_60%)] blur-2xl" />
            <div className="absolute bottom-[-25%] left-[20%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(14,116,144,0.18),_transparent_60%)] blur-3xl" />
          </div>

          <header className="relative z-10 border-b border-border/70 bg-card/80 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                JoshCoach
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="rounded-full px-3 py-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/topics"
                  className="rounded-full px-3 py-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  Topics
                </Link>
                <Link
                  href="/review"
                  className="rounded-full px-3 py-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  Review Queue
                </Link>
                <Link
                  href="/rituals"
                  className="rounded-full px-3 py-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  Rituals
                </Link>
                <Link
                  href="/summary"
                  className="rounded-full px-3 py-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  Summary
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="container relative z-10 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
