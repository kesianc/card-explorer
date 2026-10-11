import Link from "next/link";
import { POPULAR_SEARCHES } from "@/lib/query";
import { SearchForm } from "./SearchForm";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-10 md:py-20">
      <h1 className="text-6xl text-text">
        <span className="block font-display uppercase">Discover</span>
        <span className="block font-serif italic">something new</span>
      </h1>

      <p className="mt-6 text-lg text-text-2">
        Explore Magic: The Gathering cards, abilities, artists, and stories.
      </p>

      <SearchForm />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-text-3">Popular</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/explore?q=${term.toLowerCase()}`}
            className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-text-2"
          >
            {term}
          </Link>
        ))}
      </div>
    </section>
  );
}