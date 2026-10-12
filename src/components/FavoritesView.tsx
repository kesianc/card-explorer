"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";
import { CardDetailModal } from "./CardDetailModal";
import { ExploreCardItem } from "./ExploreCardItem";

export function FavoritesView() {
  const { favorites } = useFavorites();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl uppercase tracking-[0.12em] text-text md:text-4xl">
          Favorites
        </h1>
      </header>

      {favorites.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-surface/40 px-6 py-16 text-center">
          <Heart className="size-10 text-text-3" aria-hidden />
          <p className="mt-4 font-serif text-xl text-text">No favorites yet</p>
          <p className="mt-2 max-w-md text-text-2">
            Tap the heart on any card while browsing to save it here.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink transition-colors hover:bg-gold-bright"
          >
            Explore cards
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((card) => (
            <li key={card.id}>
              <ExploreCardItem
                card={card}
                selected={card.id === selectedCardId}
                onSelect={() => setSelectedCardId(card.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <CardDetailModal
        cardId={selectedCardId}
        onClose={() => setSelectedCardId(null)}
      />
    </div>
  );
}
