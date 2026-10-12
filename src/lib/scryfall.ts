import type { Card } from "./types";

const API = "https://api.scryfall.com";

const HEADERS = {
  Accept: "application/json",
  "User-Agent": "CardExplorer/1.0",
};

type ScryfallCardRaw = {
  id: string;
  name: string;
  set: string;
  collector_number: string;
  image_uris?: { normal?: string };
  card_faces?: Array<{ image_uris?: { normal?: string } }>;
};

function mapCard(raw: ScryfallCardRaw): Card {
  const imageUrl =
    raw.image_uris?.normal ?? raw.card_faces?.[0]?.image_uris?.normal;

  if (!imageUrl) {
    throw new Error(`Scryfall card "${raw.name}" has no image`);
  }

  return {
    id: raw.id,
    name: raw.name,
    imageUrl,
  };
}

export const HERO_FEATURED = { set: "m21", number: "1" };

/** Fan order: warm → blue → artifact → red → green → black (matches hero layout). */
export const HERO_FAN = [
  { set: "m21", number: "5" },
  { set: "m21", number: "59" },
  { set: "m21", number: "228" },
  { set: "m21", number: "148" },
  { set: "m21", number: "186" },
  { set: "m21", number: "110" },
];

export async function getCardBySet(set: string, number: string): Promise<Card> {
  const response = await fetch(`${API}/cards/${set}/${number}`, {
    headers: HEADERS,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Scryfall error: ${response.status}`);
  }

  const raw = (await response.json()) as ScryfallCardRaw;
  return mapCard(raw);
}

export async function getCardsCollection(
  identifiers: { set: string; number: string }[],
): Promise<Card[]> {
  const response = await fetch(`${API}/cards/collection`, {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifiers: identifiers.map(({ set, number }) => ({
        set,
        collector_number: number,
      })),
    }),
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Scryfall collection error: ${response.status}`);
  }

  const body = (await response.json()) as { data: ScryfallCardRaw[] };
  const byKey = new Map(
    body.data.map((card) => [
      `${card.set.toLowerCase()}/${card.collector_number}`,
      mapCard(card),
    ]),
  );

  return identifiers.map(({ set, number }) => {
    const card = byKey.get(`${set.toLowerCase()}/${number}`);
    if (!card) {
      throw new Error(`Scryfall missing card ${set}/${number}`);
    }
    return card;
  });
}

export async function getHeroShowcase() {
  const [featured, fan] = await Promise.all([
    getCardBySet(HERO_FEATURED.set, HERO_FEATURED.number),
    getCardsCollection(HERO_FAN),
  ]);

  return { featured, fan };
}
