"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Map" },
  { href: "/tips", label: "Tips" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group inline-flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-white">Culinary Discourse</span>
          <span className="hidden text-sm text-white/80 group-hover:text-white sm:inline">
            Hong Kong Food Map
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-3 py-1.5 transition focus:outline-none focus:ring-2 focus:ring-white/40",
                  isActive
                    ? "bg-white/20 font-medium text-white ring-1 ring-white/40"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
