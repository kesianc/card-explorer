import Link from "next/link";
import { ScryfallImage } from "./ScryfallImage";
import { Dices } from "lucide-react";
import { POPULAR_SEARCHES } from "@/lib/query";
import { getHeroShowcase } from "@/lib/scryfall";
import { SearchForm } from "./SearchForm";

const fanCardFaceClass =
  "relative size-full overflow-hidden rounded-lg shadow-[0_1px_1px_rgba(2,4,10,0.6),-6px_10px_16px_-4px_rgba(2,4,10,0.7)] brightness-[0.74] saturate-[0.88] transition-[transform,filter] duration-300 ease-out group-hover:-translate-y-[24%] group-hover:brightness-100 group-hover:saturate-100";

const featuredCardFaceClass =
  "relative size-full overflow-hidden rounded-lg shadow-[0_1px_1px_rgba(2,4,10,0.6),-6px_10px_16px_-4px_rgba(2,4,10,0.7),0_0_40px_-10px_rgba(228,200,138,0.3)] brightness-[0.94] transition-[transform,filter] duration-300 ease-out group-hover:-translate-y-2.5 group-hover:-rotate-3 group-hover:scale-[1.04] group-hover:brightness-100";

export async function Hero() {
  const { featured, fan } = await getHeroShowcase();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-10 md:py-20 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
      <div>
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
              className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-text-2 transition-colors hover:border-gold/50 hover:text-text"
            >
              {term}
            </Link>
          ))}
        </div>

        <div className="mt-9 flex max-w-xl flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/10 pt-7">
          <button
            type="button"
            className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-gold/40 bg-gold/5 px-6 text-base font-semibold text-gold-bright transition-all duration-200 hover:border-gold-bright/70 hover:bg-gold/15 hover:text-[#f3dcab] hover:shadow-[0_0_24px_-8px_rgba(228,200,138,0.45)] active:translate-y-px active:scale-[0.985]"
          >
            <Dices className="size-5" strokeWidth={1.8} aria-hidden />
            Surprise me
          </button>
          <p className="max-w-[15rem] font-serif text-base italic leading-snug text-text-2">
            Tears open a sealed pack and deals you one card.
          </p>
        </div>
      </div>

      <div className="relative mt-12 h-96 lg:mt-0">
      
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-y-10 inset-x-0 bg-[radial-gradient(ellipse_40%_50%_at_55%_52%,rgba(255,214,152,0.13),transparent_72%),radial-gradient(ellipse_60%_70%_at_60%_50%,rgba(58,82,150,0.14),transparent_75%)]"
        />

        <div
          aria-hidden
          className="absolute inset-x-[8%] inset-y-[7%] -rotate-5 rounded-[26px] bg-[radial-gradient(ellipse_at_50%_40%,#1a2446_0%,#121a35_55%,#0e1429_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_40px_80px_-30px_rgba(2,4,10,0.9)]"
        />

        <div className="absolute left-[40%] top-[70%]">
          {fan.map((card, index) => (
            <div
              key={card.id}
              className="group absolute bottom-0 -left-14 aspect-[63/88] w-28 origin-[50%_172%] hover:z-5"
              style={{ rotate: `${(index - 2.5) * 11}deg` }}
            >
              <div className={fanCardFaceClass}>
                <ScryfallImage
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          <div
            aria-hidden
            className="absolute left-0 top-0 z-10 aspect-[2/3] w-37 -translate-x-1/2 -translate-y-[21%] -rotate-3 overflow-hidden rounded-md bg-[linear-gradient(135deg,#24305a_0%,#141b36_45%,#1d2750_70%,#0e1329_100%)] shadow-[0_22px_26px_rgba(2,4,10,0.75)]"
          >
            <div className="absolute left-1/2 top-[46.7%] aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold" />
            <p className="absolute inset-x-0 top-[77%] text-center text-[0.4375rem] font-semibold tracking-[0.2em] text-text-2">
              ONE RANDOM CARD
            </p>
          </div>
        </div>

        <div className="group absolute bottom-[12%] right-[8%] z-20 aspect-[63/88] w-32 rotate-9">
          <div className={featuredCardFaceClass}>
            <ScryfallImage
              src={featured.imageUrl}
              alt={featured.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
