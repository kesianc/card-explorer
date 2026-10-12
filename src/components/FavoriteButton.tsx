"use client";

import { Heart } from "lucide-react";
import type { Card } from "@/lib/types";
import { useFavorites } from "./FavoritesProvider";

type FavoriteButtonProps = {
  card: Card;
  className?: string;
  iconClassName?: string;
};

export function FavoriteButton({
  card,
  className = "-mr-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-2 transition-colors hover:text-gold-bright",
  iconClassName = "size-5",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(card.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active ? `Remove ${card.name} from favorites` : `Add ${card.name} to favorites`
      }
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(card);
      }}
    >
      <Heart
        className={`${iconClassName} ${active ? "fill-gold-bright text-gold-bright" : ""}`}
        aria-hidden
      />
    </button>
  );
}
