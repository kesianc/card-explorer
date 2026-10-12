"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { CardDetailModal } from "./CardDetailModal";
import { MagicDust } from "./MagicDust";
import { HeroShowcaseDraw } from "./SurpriseDiscovery";
import { ScryfallImage } from "./ScryfallImage";

const wingCardFaceClass =
  "relative size-full overflow-hidden rounded-lg shadow-[0_10px_28px_-6px_rgba(2,4,10,0.75),0_2px_6px_rgba(0,0,0,0.35)] brightness-[0.9] saturate-[0.94] transition-[transform,filter,box-shadow] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:brightness-100 group-hover:saturate-100";

const centerCardFaceClass =
  "relative size-full overflow-hidden rounded-lg shadow-[0_14px_40px_-8px_rgba(2,4,10,0.8),0_0_48px_-12px_rgba(228,200,138,0.35)] brightness-[0.97] transition-[transform,filter,box-shadow] duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:brightness-100";

type HeroShowcaseProps = {
  fan: Card[];
  featured: Card;
};

type FanSlot = {
  card: Card;
  layoutClass: string;
  sizes: string;
  faceClass: string;
};

function HeroFanCard({
  card,
  layoutClass,
  sizes,
  faceClass,
  onSelect,
}: FanSlot & { onSelect: (id: string) => void }) {
  return (
    <div className={`group absolute top-0 aspect-[63/88] ${layoutClass}`}>
      <button
        type="button"
        onClick={() => onSelect(card.id)}
        className="relative block size-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label={`View details for ${card.name}`}
      >
        <div className={faceClass}>
          <ScryfallImage
            src={card.imageUrl}
            alt={card.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </button>
    </div>
  );
}

export function HeroShowcase({ fan, featured }: HeroShowcaseProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const leftCard = fan[0];
  const rightCard = fan[1] ?? fan[0];

  const slots: FanSlot[] = [
    {
      card: leftCard,
      layoutClass:
        "left-[2%] z-10 w-[36%] max-w-[11rem] -rotate-[13deg] origin-top sm:left-[4%] sm:w-[37%] md:max-w-[11.75rem]",
      sizes: "(max-width: 640px) 32vw, 188px",
      faceClass: wingCardFaceClass,
    },
    {
      card: featured,
      layoutClass:
        "left-1/2 z-30 w-[45%] max-w-[14.75rem] -translate-x-1/2 rotate-0 sm:w-[47%] md:max-w-[16rem]",
      sizes: "(max-width: 640px) 42vw, 256px",
      faceClass: centerCardFaceClass,
    },
    {
      card: rightCard,
      layoutClass:
        "right-[2%] z-10 w-[36%] max-w-[11rem] rotate-[13deg] origin-top sm:right-[4%] sm:w-[37%] md:max-w-[11.75rem]",
      sizes: "(max-width: 640px) 32vw, 188px",
      faceClass: wingCardFaceClass,
    },
  ];

  return (
    <>
      <div className="relative mx-auto mt-8 flex w-full max-w-xl items-center justify-center lg:mt-0 lg:max-w-none lg:-translate-y-1 lg:pt-[0.04em]">
        <div className="relative h-[min(34rem,88vw)] w-full min-h-[26rem] pb-16 sm:h-[32rem] sm:pb-[4.5rem] md:h-[36rem] md:pb-20 lg:h-[38rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[28%] h-[min(115%,26rem)] w-[min(120%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_62%_68%_at_50%_40%,rgba(72,118,210,0.62),rgba(48,88,168,0.32)_38%,rgba(28,52,108,0.12)_55%,transparent_78%)] blur-[1px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[29%] h-[min(100%,22rem)] w-[min(105%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_55%_60%_at_50%_44%,rgba(130,175,255,0.42),rgba(85,130,220,0.18)_45%,transparent_72%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[30%] h-[min(88%,18rem)] w-[min(92%,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_48%_52%_at_50%_48%,rgba(170,205,255,0.22),rgba(100,145,220,0.06)_50%,transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[32%] h-[min(70%,13rem)] w-[min(65%,15rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,rgba(255,220,160,0.12),transparent_68%)]"
          />

          <MagicDust className="inset-0 opacity-95" />

          <div className="absolute inset-x-0 bottom-[34%] top-[0%] z-10 sm:bottom-[36%]">
            {slots.map((slot) => (
              <HeroFanCard
                key={slot.card.id}
                {...slot}
                onSelect={setSelectedCardId}
              />
            ))}
          </div>

          <HeroShowcaseDraw onRevealCardId={setSelectedCardId} />
        </div>
      </div>

      <CardDetailModal
        cardId={selectedCardId}
        onClose={() => setSelectedCardId(null)}
      />
    </>
  );
}
