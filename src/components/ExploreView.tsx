"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import type { Card } from "@/lib/types";
import { fetchCardSearchPage } from "@/lib/scryfall";
import {
  buildScryfallQuery,
  EMPTY_EXPLORE_FILTERS,
  hasActiveFilters,
  MANA_COLOR_OPTIONS,
  parseExploreFilters,
  RARITY_OPTIONS,
  setExploreFiltersOnParams,
  type ExploreFilters,
} from "@/lib/explore-filters";
import { CardDetailModal } from "./CardDetailModal";
import { ExploreCardItem } from "./ExploreCardItem";
import { ExploreFiltersModal } from "./ExploreFiltersModal";
import { SearchForm } from "./SearchForm";

function formatCount(total: number, query: string, filtersActive: boolean) {
  const formatted = total.toLocaleString("en-US");
  if (query) {
    return `${formatted} result${total === 1 ? "" : "s"} for “${query}”`;
  }
  if (filtersActive) {
    return `${formatted} matching cards`;
  }
  return `${formatted} cards in the catalog`;
}

export function ExploreView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const selectedCardId = searchParams.get("card");
  const filters = parseExploreFilters(searchParams);
  const scryfallQuery = buildScryfallQuery(query, filters);

  const [cards, setCards] = useState<Card[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const next = params.toString();
      router.push(next ? `/explore?${next}` : "/explore", { scroll: false });
    },
    [router, searchParams],
  );

  const loadFirstPage = useCallback(async (searchQ: string) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setCards([]);
    setNextPage(null);
    setTotalCards(0);

    try {
      const page = await fetchCardSearchPage({ query: searchQ });
      if (requestId !== requestIdRef.current) return;

      setCards(page.cards);
      setTotalCards(page.totalCards);
      setNextPage(page.nextPage);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError("Could not load cards. Please try again.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const page = await fetchCardSearchPage({ nextPageUrl: nextPage });
      setCards((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const merged = [...prev];
        for (const card of page.cards) {
          if (!seen.has(card.id)) {
            seen.add(card.id);
            merged.push(card);
          }
        }
        return merged;
      });
      setNextPage(page.nextPage);
      setTotalCards(page.totalCards);
    } catch {
      setError("Could not load more cards.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextPage]);

  useEffect(() => {
    loadFirstPage(scryfallQuery);
  }, [scryfallQuery, loadFirstPage]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !nextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNextPage, nextPage, cards.length]);

  function openCard(cardId: string) {
    pushParams((params) => {
      params.set("card", cardId);
    });
  }

  function closeCard() {
    pushParams((params) => {
      params.delete("card");
    });
  }

  function applyFilters(next: ExploreFilters) {
    pushParams((params) => {
      setExploreFiltersOnParams(params, next);
    });
    setFiltersOpen(false);
  }

  function clearAllFilters() {
    pushParams((params) => {
      setExploreFiltersOnParams(params, EMPTY_EXPLORE_FILTERS);
    });
  }

  function removeColor(color: string) {
    pushParams((params) => {
      const current = parseExploreFilters(params);
      setExploreFiltersOnParams(params, {
        ...current,
        colors: current.colors.filter((c) => c !== color),
      });
    });
  }

  function removeRarity(rarity: string) {
    pushParams((params) => {
      const current = parseExploreFilters(params);
      setExploreFiltersOnParams(params, {
        ...current,
        rarities: current.rarities.filter((r) => r !== rarity),
      });
    });
  }

  function removeType(type: string) {
    pushParams((params) => {
      const current = parseExploreFilters(params);
      setExploreFiltersOnParams(params, {
        ...current,
        types: current.types.filter((t) => t !== type),
      });
    });
  }

  const filtersActive = hasActiveFilters(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-10 md:py-14">
      <header>
        <h1 className="font-display text-3xl uppercase tracking-[0.12em] text-text md:text-4xl">
          Explore
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-text-2">
          Browse the full Scryfall catalog or narrow your search.
        </p>

        <SearchForm defaultValue={query} className="mt-8 max-w-3xl" />

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-gold/50"
          >
            <SlidersHorizontal className="size-4 text-gold-bright" aria-hidden />
            Filters
          </button>

          {filters.colors.map((code) => {
            const meta = MANA_COLOR_OPTIONS.find((m) => m.id === code);
            if (!meta) return null;
            return (
              <span
                key={code}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-semibold text-text"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: meta.borderColor }}
                  aria-hidden
                />
                {meta.label}
                <button
                  type="button"
                  onClick={() => removeColor(code)}
                  className="cursor-pointer text-text-3 hover:text-text"
                  aria-label={`Remove ${meta.label} filter`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            );
          })}

          {filters.rarities.map((rarity) => {
            const meta = RARITY_OPTIONS.find((r) => r.id === rarity);
            if (!meta) return null;
            return (
              <span
                key={rarity}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-semibold capitalize text-text"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: meta.dotColor }}
                  aria-hidden
                />
                {meta.label}
                <button
                  type="button"
                  onClick={() => removeRarity(rarity)}
                  className="cursor-pointer text-text-3 hover:text-text"
                  aria-label={`Remove ${meta.label} filter`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            );
          })}

          {filters.types.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-semibold text-text"
            >
              {type}
              <button
                type="button"
                onClick={() => removeType(type)}
                className="cursor-pointer text-text-3 hover:text-text"
                aria-label={`Remove ${type} filter`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}

          {filtersActive && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer px-1 text-xs font-medium text-text-2 transition-colors hover:text-text"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-text-3" aria-live="polite">
          {loading && !cards.length
            ? "Loading…"
            : formatCount(totalCards, query, filtersActive)}
        </p>
      </header>

      {error && (
        <p className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {!loading && !error && cards.length === 0 && (
        <p className="mt-12 text-center text-text-2">No cards found. Try another search or filter.</p>
      )}

      <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.id}>
            <ExploreCardItem
              card={card}
              selected={card.id === selectedCardId}
              onSelect={() => openCard(card.id)}
            />
          </li>
        ))}
      </ul>

      {loading && (
        <div className="mt-12 flex justify-center text-text-2" aria-hidden>
          <Loader2 className="size-8 animate-spin" />
        </div>
      )}

      <div ref={loadMoreRef} className="h-1" aria-hidden />

      {loadingMore && (
        <div className="mt-8 flex justify-center text-text-2" aria-live="polite">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}

      <CardDetailModal cardId={selectedCardId} onClose={closeCard} />

      <ExploreFiltersModal
        isOpen={filtersOpen}
        textQuery={query}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={applyFilters}
        onClear={clearAllFilters}
      />
    </div>
  );
}
