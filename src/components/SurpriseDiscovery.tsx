"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchRandomCard } from "@/lib/scryfall";

const MAX_ATTEMPTS = 3;

type HeroShowcaseDrawProps = {
  onRevealCardId: (id: string) => void;
};

export function HeroShowcaseDraw({ onRevealCardId }: HeroShowcaseDrawProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawCard = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const card = await fetchRandomCard();
          onRevealCardId(card.id);
          return;
        } catch {
          // Algumas cartas aleatórias não têm imagem; tentamos de novo.
        }
      }

      setError("We couldn't draw a card right now. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, onRevealCardId]);

  return (
    <>
      <div className="absolute inset-x-0 bottom-[7rem] z-40 flex flex-col items-center px-3 pt-0 sm:bottom-[7.5rem] sm:px-4 md:bottom-32 lg:bottom-[8.5rem]">
        <div className="flex max-w-full items-center gap-2 sm:gap-3" aria-hidden>
          <span className="h-px w-6 shrink-0 bg-gradient-to-r from-transparent via-gold/25 to-gold/55 sm:w-10 md:w-14" />
          <span className="size-1 shrink-0 rotate-45 border border-gold/55 bg-gold/15 shadow-[0_0_6px_rgba(228,200,138,0.35)]" />
          <p
            className="shrink font-display text-[0.5625rem] uppercase tracking-[0.22em] text-gold-bright/85 sm:text-[0.625rem] sm:tracking-[0.28em] md:text-xs md:tracking-[0.32em]"
          >
            Discover something mythic
          </p>
          <span className="size-1 shrink-0 rotate-45 border border-gold/55 bg-gold/15 shadow-[0_0_6px_rgba(228,200,138,0.35)]" />
          <span className="h-px w-6 shrink-0 bg-gradient-to-l from-transparent via-gold/25 to-gold/55 sm:w-10 md:w-14" />
        </div>

        <button
          type="button"
          onClick={drawCard}
          disabled={loading}
          className="mt-3 min-h-11 w-full max-w-[15.5rem] cursor-pointer rounded-full border border-[#f0d9a8]/35 bg-[linear-gradient(180deg,#ecd49a_0%,#d4b06a_42%,#b8924f_100%)] px-8 py-2.5 text-sm font-semibold tracking-wide text-[#2a2214] shadow-[0_4px_16px_rgba(2,4,10,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-200 hover:border-[#f5e4bc]/50 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-75 active:translate-y-px sm:mt-3.5 sm:max-w-[17rem] sm:text-[0.9375rem]"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Drawing a card
            </span>
          ) : (
            "Draw a card"
          )}
        </button>

        {error && (
          <p className="mt-2 max-w-xs text-center text-xs text-[#e8a8a0] sm:text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
