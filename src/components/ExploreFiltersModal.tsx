"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Droplets, Flame, Skull, Sun, Trees, X } from "lucide-react";
import type {
  CardTypeCode,
  ExploreFilters,
  ManaColorCode,
  RarityCode,
} from "@/lib/explore-filters";
import {
  CARD_TYPE_OPTIONS,
  MANA_COLOR_OPTIONS,
  RARITY_OPTIONS,
} from "@/lib/explore-filters";
import { buildScryfallQuery } from "@/lib/explore-filters";
import { fetchCardSearchPage } from "@/lib/scryfall";

const MANA_ICONS: Record<ManaColorCode, ComponentType<{ className?: string }>> = {
  W: Sun,
  U: Droplets,
  B: Skull,
  R: Flame,
  G: Trees,
};

type ExploreFiltersModalProps = {
  isOpen: boolean;
  textQuery: string;
  filters: ExploreFilters;
  onClose: () => void;
  onApply: (filters: ExploreFilters) => void;
  onClear: () => void;
};

export function ExploreFiltersModal({
  isOpen,
  textQuery,
  filters,
  onClose,
  onApply,
  onClear,
}: ExploreFiltersModalProps) {
  const [draft, setDraft] = useState<ExploreFilters>(filters);
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [filters, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const query = buildScryfallQuery(textQuery, draft);
    setPreviewLoading(true);
    const handle = window.setTimeout(() => {
      fetchCardSearchPage({ query })
        .then((page) => setPreviewTotal(page.totalCards))
        .catch(() => setPreviewTotal(null))
        .finally(() => setPreviewLoading(false));
    }, 280);

    return () => window.clearTimeout(handle);
  }, [draft, isOpen, textQuery]);

  if (!isOpen) return null;

  function toggleColor(color: ManaColorCode) {
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }

  function toggleRarity(rarity: RarityCode) {
    setDraft((prev) => ({
      ...prev,
      rarities: prev.rarities.includes(rarity)
        ? prev.rarities.filter((r) => r !== rarity)
        : [...prev.rarities, rarity],
    }));
  }

  function toggleType(type: CardTypeCode) {
    setDraft((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }

  const showLabel =
    previewTotal != null
      ? `Show ${previewTotal.toLocaleString("en-US")} cards`
      : previewLoading
        ? "Counting…"
        : "Show cards";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explore-filters-title"
        className="relative z-10 w-full max-w-[490px] rounded-2xl border border-white/10 bg-ground p-6 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <h2 id="explore-filters-title" className="font-serif text-2xl text-text">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-2 transition-colors hover:bg-white/5 hover:text-text"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-3">
              Mana color
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {MANA_COLOR_OPTIONS.map((mana) => {
                const selected = draft.colors.includes(mana.id);
                const Icon = MANA_ICONS[mana.id];
                return (
                  <button
                    key={mana.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleColor(mana.id)}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl px-1 py-3 transition-all ${
                      selected ? "bg-surface ring-1" : "opacity-75 hover:bg-white/5 hover:opacity-100"
                    }`}
                    style={
                      selected
                        ? {
                            borderColor: mana.borderColor,
                            boxShadow: `0 0 14px ${mana.glowColor}`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="flex size-9 items-center justify-center rounded-full border"
                      style={{
                        borderColor: selected ? mana.borderColor : "rgba(255,255,255,0.2)",
                        color: mana.iconColor,
                      }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span
                      className={`text-xs font-semibold ${selected ? "text-text" : "text-text-3"}`}
                    >
                      {mana.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-3">
              Rarity
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {RARITY_OPTIONS.map((rarity) => {
                const selected = draft.rarities.includes(rarity.id);
                return (
                  <button
                    key={rarity.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleRarity(rarity.id)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      selected
                        ? "border-gold/60 bg-surface-2 text-text ring-1 ring-gold/40"
                        : "border-white/10 bg-surface text-text hover:border-white/20"
                    }`}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: rarity.dotColor }}
                      aria-hidden
                    />
                    {rarity.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-3">
              Type
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {CARD_TYPE_OPTIONS.map((type) => {
                const selected = draft.types.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleType(type)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      selected
                        ? "border-gold/60 bg-surface-2 text-text ring-1 ring-gold/40"
                        : "border-white/10 bg-surface text-text hover:border-white/20"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => {
              onClear();
              setDraft({ colors: [], rarities: [], types: [] });
            }}
            className="cursor-pointer text-sm font-semibold text-text-2 transition-colors hover:text-text"
          >
            Clear all
          </button>
          <button
            type="button"
            disabled={previewLoading && previewTotal == null}
            onClick={() => onApply(draft)}
            className="cursor-pointer rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-gold-ink transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-70"
          >
            {showLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
