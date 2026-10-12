import { getFeaturedCards } from "@/lib/scryfall";
import { CardTile } from "./CardTile";

export async function FeaturedCards() {
  const cards = await getFeaturedCards();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-10 -mt-6 md:-mt-12 lg:-mt-16">
      <div className="border-t border-white/10 pt-6 md:pt-8">
        <h2 className="font-display text-lg uppercase tracking-[0.14em] text-text md:text-xl">
          Featured cards
        </h2>

        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <CardTile key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
