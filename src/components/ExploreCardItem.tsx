import { ArrowRight } from "lucide-react";
import type { Card } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";
import { ManaCost } from "./ManaCost";
import { ScryfallImage } from "./ScryfallImage";

const RARITY_DOT: Record<string, string> = {
  common: "bg-text-3",
  uncommon: "bg-[#b8c4d6]",
  rare: "bg-gold-bright",
  mythic: "bg-[#e9703a]",
};

type ExploreCardItemProps = {
  card: Card;
  selected?: boolean;
  onSelect: () => void;
};

export function ExploreCardItem({ card, selected, onSelect }: ExploreCardItemProps) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={onSelect}
        className={`relative block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
          selected ? "rounded-[4.5%] ring-2 ring-gold/70 ring-offset-2 ring-offset-ground" : ""
        }`}
      >
        <div className="relative aspect-[63/88] overflow-hidden rounded-[4.5%] shadow-[0_18px_30px_-12px_rgba(2,4,10,0.8)] transition-transform duration-300 ease-out group-hover:-translate-y-2">
          <ScryfallImage
            src={card.imageUrl}
            alt={card.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </button>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug text-text">{card.name}</h3>
          <FavoriteButton card={card} />
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-2 text-[0.9375rem] text-text-2">
          <ManaCost cost={card.manaCost} />
          <span>{card.typeLine}</span>
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-3">
            <span
              aria-hidden
              className={`size-2 rounded-full ${RARITY_DOT[card.rarity] ?? "bg-text-3"}`}
            />
            {card.rarity}
          </span>

          <button
            type="button"
            onClick={onSelect}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-gold-bright opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            View details
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
