import Link from "next/link";
import { POPULAR_SEARCHES } from "@/lib/query";
import { getHeroShowcase } from "@/lib/scryfall";
import { HeroShowcase } from "./HeroShowcase";
import { SearchForm } from "./SearchForm";

export async function Hero() {
  const { featured, fan } = await getHeroShowcase();

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 pb-4 md:px-10 md:pt-24 md:pb-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-14 lg:pb-6">
      <div className="min-w-0">
        <h1 className="overflow-visible pt-[0.04em] text-[clamp(3.2rem,6.5vw,6.3rem)] leading-[0.98] tracking-[-0.01em] text-text">
          <span className="block font-display uppercase">Discover</span>
          <span className="block font-serif italic">something new</span>
        </h1>

        <p className="mt-6 text-xl text-text-2">
          Explore Magic: The Gathering cards, abilities, artists, and stories.
        </p>

        <SearchForm />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-text-3">Popular</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/explore?q=${term.toLowerCase()}`}
              className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-text-2 transition-colors hover:border-gold/50 hover:text-text"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      <HeroShowcase fan={fan} featured={featured} />
    </section>
  );
}
