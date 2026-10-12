"use client";

import { useEffect, useState } from "react";
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
    setCard(null);
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

  return (
    <CardDetailPanel
      card={card}
      detailsLoading={loading}
      detailsError={error}
      onClose={onClose}
    />
  );
}
