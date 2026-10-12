"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/favorites", label: "Favorites", heart: true },
];

function CardsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-6 text-gold"
      aria-hidden
    >
      <rect x="3.25" y="5" width="9" height="13" rx="1.5" transform="rotate(-8 7.75 11.5)" />
      <rect x="11.75" y="5" width="9" height="13" rx="1.5" transform="rotate(8 16.25 11.5)" />
    </svg>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-ground/90 backdrop-blur md:h-[4.5rem]">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-md px-3 py-2 font-display text-base uppercase tracking-[0.16em] text-text focus-visible:outline-2 focus-visible:outline-gold"
        >
          <CardsIcon />
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
                  aria-label={
                    link.heart
                      ? favoriteCount === 0
                        ? "Favorites"
                        : `Favorites, ${favoriteCount} card${favoriteCount === 1 ? "" : "s"}`
                      : undefined
                  }
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.9375rem] font-medium transition-colors hover:text-text ${
                    active ? "text-text" : "text-text-2"
                  }`}
                >
                  {link.label}
                  {link.heart && (
                    <span className="inline-flex items-center gap-1">
                      <Heart
                        className={`size-[1.1rem] ${favoriteCount > 0 ? "fill-gold-bright/35 text-gold-bright" : ""}`}
                        aria-hidden
                      />
                      {favoriteCount > 0 && (
                        <span className="min-w-[0.65rem] text-center text-[0.8125rem] font-semibold tabular-nums text-gold-bright">
                          {favoriteCount}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
