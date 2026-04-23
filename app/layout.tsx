import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Culinary Discourse: A Discourse-Driven Hong Kong Food Map",
  description:
    "A research-driven interactive map visualizing how Hong Kong food is described across tourist, local, and social media discourses."
};

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group inline-flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-white">
            Culinary Discourse
          </span>
          <span className="hidden text-sm text-white/80 group-hover:text-white sm:inline">
            Hong Kong Food Map
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Map
          </Link>
          <Link
            href="/insights"
            className="rounded-full px-3 py-1.5 text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Insights
          </Link>
          <Link
            href="/about"
            className="rounded-full px-3 py-1.5 text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TopNav />
        {children}
      </body>
    </html>
  );
}

