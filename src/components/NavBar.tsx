"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/favorites", label: "Favorites", heart: true },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 h-16 md:h-[4.5rem]">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-10"
      >
        <Link
          href="/"
          className="font-display text-base uppercase tracking-[0.16em] text-text"
        >
          Card Explorer
        </Link>

        <ul className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.9375rem] font-medium transition-colors hover:text-text ${
                    active ? "text-text" : "text-text-2"
                  }`}
                >
                  {link.label}
                  {link.heart && <Heart className="size-[1.1rem]" aria-hidden />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}