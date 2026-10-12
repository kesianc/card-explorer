import type { Card, CardDetails } from "./types";

export const FAVORITES_STORAGE_KEY = "card-explorer-favorites";

export function cardFromDetails(details: CardDetails): Card {
  return {
    id: details.id,
    name: details.name,
    imageUrl: details.imageUrl,
    typeLine: details.typeLine,
    manaCost: details.manaCost,
    rarity: details.rarity,
  };
}

export function readFavoritesFromStorage(): Card[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Card[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.imageUrl === "string",
    );
  } catch {
    return [];
  }
}

export function writeFavoritesToStorage(cards: Card[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(cards));
}
