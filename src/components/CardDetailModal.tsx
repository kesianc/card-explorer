"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { CardDetails } from "@/lib/types";
import { fetchCardById } from "@/lib/scryfall";
import { CardDetailPanel } from "./CardDetailPanel";

type CardDetailModalProps = {
  cardId: string | null;
  onClose: () => void;
};

export function CardDetailModal({ cardId, onClose }: CardDetailModalProps) {
  const [card, setCard] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      setCard(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCardById(cardId)
      .then((details) => {
        if (!cancelled) setCard(details);
      })
      .catch(() => {
        if (!cancelled) {
          setCard(null);
          setError("Could not load this card.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cardId]);

  if (!cardId) return null;

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink/60 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="size-10 animate-spin text-gold-bright" aria-hidden />
        <p className="font-display text-sm uppercase tracking-[0.14em] text-gold-bright">
          Loading card
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6">
        <div className="rounded-2xl border border-white/10 bg-surface px-6 py-5 text-center">
          <p className="text-text">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 cursor-pointer rounded-xl bg-gold px-5 py-2.5 font-semibold text-gold-ink"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return <CardDetailPanel card={card} onClose={onClose} />;
}
