"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, X } from "lucide-react";
import type { CardDetails } from "@/lib/types";
import { cardFromDetails } from "@/lib/favorites";
import { FavoriteButton } from "./FavoriteButton";
import { ManaCost } from "./ManaCost";
import { ScryfallImage } from "./ScryfallImage";

const RARITY_DOT: Record<string, string> = {
  common: "bg-text-3",
  uncommon: "bg-[#b8c4d6]",
  rare: "bg-gold-bright",
  mythic: "bg-[#e9703a]",
};

type CardDetailPanelProps = {
  card: CardDetails | null;
  detailsLoading?: boolean;
  detailsError?: string | null;
  onClose: () => void;
};

function CardDetailImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative aspect-[63/88] overflow-hidden rounded-[4.5%] bg-surface-2 shadow-[0_18px_40px_-16px_rgba(2,4,10,0.9)]">
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-surface-2"
          aria-hidden
        >
          <Loader2 className="size-9 animate-spin text-gold-bright" />
        </div>
      )}
      <ScryfallImage
        src={src}
        alt={alt}
        fill
        sizes="280px"
        priority
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}

function CardDetailImagePlaceholder() {
  return (
    <div
      className="relative flex aspect-[63/88] items-center justify-center overflow-hidden rounded-[4.5%] bg-surface-2 shadow-[0_18px_40px_-16px_rgba(2,4,10,0.9)]"
      aria-hidden
    >
      <Loader2 className="size-9 animate-spin text-gold-bright" />
    </div>
  );
}

export function CardDetailPanel({
  card,
  detailsLoading = false,
  detailsError = null,
  onClose,
}: CardDetailPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const showDetails = card && !detailsLoading && !detailsError;

  const pt =
    showDetails && card.power != null && card.toughness != null
      ? `${card.power}/${card.toughness}`
      : showDetails && card.loyalty != null
        ? `Loyalty ${card.loyalty}`
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close card details"
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-title"
        aria-busy={detailsLoading || !card}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-surface shadow-[0_24px_80px_-20px_rgba(2,4,10,0.95)] sm:max-h-[min(88vh,820px)] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-3">
            Card details
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-2 transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-4 sm:grid-cols-[minmax(0,240px)_1fr] sm:p-6 md:grid-cols-[minmax(0,280px)_1fr]">
          <div className="mx-auto w-full max-w-[280px] shrink-0">
            {showDetails ? (
              <CardDetailImage src={card.imageUrl} alt={card.name} />
            ) : (
              <CardDetailImagePlaceholder />
            )}
          </div>

          <div className="min-w-0">
            {detailsError ? (
              <div className="py-4">
                <h2
                  id="card-detail-title"
                  className="font-serif text-2xl text-text md:text-3xl"
                >
                  Card details
                </h2>
                <p className="mt-6 text-text-2">{detailsError}</p>
              </div>
            ) : detailsLoading || !card ? (
              <div className="py-4" aria-live="polite">
                <h2
                  id="card-detail-title"
                  className="font-serif text-2xl text-text md:text-3xl"
                >
                  Loading…
                </h2>
                <div className="mt-8 space-y-3" aria-hidden>
                  <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-1/2 max-w-sm animate-pulse rounded bg-white/5" />
                  <div className="mt-6 h-24 w-full max-w-lg animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2
                    id="card-detail-title"
                    className="font-serif text-2xl leading-snug text-text md:text-3xl"
                  >
                    {card.name}
                  </h2>
                  <FavoriteButton
                    card={cardFromDetails(card)}
                    className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-2 transition-colors hover:bg-white/5 hover:text-gold-bright"
                  />
                </div>

                <p className="mt-3 flex flex-wrap items-center gap-2 text-base text-text-2">
                  <ManaCost cost={card.manaCost} />
                  <span>{card.typeLine}</span>
                  {pt && (
                    <span className="rounded-md border border-white/10 bg-surface-2 px-2 py-0.5 text-sm font-semibold text-text">
                      {pt}
                    </span>
                  )}
                </p>

                {card.oracleText && (
                  <div className="mt-6 whitespace-pre-wrap font-serif text-base leading-relaxed text-text">
                    {card.oracleText}
                  </div>
                )}

                {card.flavorText && (
                  <p className="mt-4 font-serif text-base italic leading-relaxed text-text-2">
                    {card.flavorText}
                  </p>
                )}

                <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-3">
                      Set
                    </dt>
                    <dd className="mt-1 text-text">
                      {card.setName}{" "}
                      <span className="text-text-2">· #{card.collectorNumber}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-3">
                      Rarity
                    </dt>
                    <dd className="mt-1 inline-flex items-center gap-2 capitalize text-text">
                      <span
                        aria-hidden
                        className={`size-2 rounded-full ${RARITY_DOT[card.rarity] ?? "bg-text-3"}`}
                      />
                      {card.rarity}
                    </dd>
                  </div>
                  {card.artist && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-3">
                        Artist
                      </dt>
                      <dd className="mt-1 text-text">{card.artist}</dd>
                    </div>
                  )}
                  <div
                    className={`flex items-end ${card.artist ? "" : "sm:col-start-2"}`}
                  >
                    <a
                      href={card.scryfallUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-semibold text-gold-bright transition-colors hover:text-gold"
                    >
                      View on Scryfall
                      <ExternalLink className="size-4" aria-hidden />
                    </a>
                  </div>
                </dl>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
