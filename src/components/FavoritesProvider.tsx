"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Card } from "@/lib/types";
import { readFavoritesFromStorage, writeFavoritesToStorage } from "@/lib/favorites";

type FavoritesContextValue = {
  favorites: Card[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (card: Card) => void;
  removeFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavoritesFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeFavoritesToStorage(favorites);
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((card) => card.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((card: Card) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === card.id);
      if (exists) {
        return prev.filter((item) => item.id !== card.id);
      }
      return [...prev, card];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
