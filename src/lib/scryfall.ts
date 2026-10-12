import type { Card, CardDetails, CardSearchPage } from "./types";

const API = "https://api.scryfall.com";

const HEADERS = {
  Accept: "application/json",
  "User-Agent": "CardExplorer/1.0",
};

type ScryfallFace = {
  image_uris?: { normal?: string; large?: string };
  mana_cost?: string;
};

type ScryfallCardRaw = {
  id: string;
  name: string;
  set: string;
  set_name?: string;
  collector_number: string;
  type_line: string;
  mana_cost?: string;
  rarity: string;
  oracle_text?: string;
  flavor_text?: string;
  artist?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  scryfall_uri?: string;
  image_uris?: { normal?: string; large?: string };
  card_faces?: (ScryfallFace & {
    oracle_text?: string;
    flavor_text?: string;
    power?: string;
    toughness?: string;
  })[];
};

/** Uma carta pode ser pedida pelo nome ou pelo set + número do colecionador. */
export type CardRef = { set: string; number: string } | { name: string };

function mapCard(raw: ScryfallCardRaw): Card {
  const imageUrl =
    raw.image_uris?.normal ??
    raw.image_uris?.large ??
    raw.card_faces?.[0]?.image_uris?.normal ??
    raw.card_faces?.[0]?.image_uris?.large;

  if (!imageUrl) {
    throw new Error(`Scryfall card "${raw.name}" has no image`);
  }

  return {
    id: raw.id,
    name: raw.name,
    imageUrl,
    typeLine: raw.type_line,
    manaCost: raw.mana_cost ?? raw.card_faces?.[0]?.mana_cost ?? "",
    rarity: raw.rarity,
  };
}

function refKey(ref: CardRef): string {
  return "name" in ref
    ? `name/${ref.name.toLowerCase()}`
    : `${ref.set.toLowerCase()}/${ref.number}`;
}

/** Laterais do leque do hero (a carta central é HERO_FEATURED). */
export const HERO_FAN: CardRef[] = [
  { name: "Jace, the Mind Sculptor" },
  { name: "Sheoldred, the Apocalypse" },
];

/** Carta da frente (a da direita, em destaque). */
export const HERO_FEATURED: CardRef = { set: "one", number: "196" };

/** Cartas da faixa "Featured" logo abaixo do hero. */
export const FEATURED_CARDS: CardRef[] = [
  { set: "sld", number: "1433" },
  { name: "Consumptive Goo" },
  { name: "Widespread Panic" },
  { name: "Devastation Tide" },
];

export async function getCardsCollection(refs: CardRef[]): Promise<Card[]> {
  const response = await fetch(`${API}/cards/collection`, {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifiers: refs.map((ref) =>
        "name" in ref
          ? { name: ref.name }
          : { set: ref.set, collector_number: ref.number },
      ),
    }),
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Scryfall collection error: ${response.status}`);
  }

  const body = (await response.json()) as { data: ScryfallCardRaw[] };

  // Guardamos cada carta com duas "chaves": set/número e nome.
  const byKey = new Map<string, Card>();
  for (const raw of body.data) {
    const card = mapCard(raw);
    byKey.set(`${raw.set.toLowerCase()}/${raw.collector_number}`, card);
    byKey.set(`name/${raw.name.toLowerCase()}`, card);
  }

  return refs.map((ref) => {
    const card = byKey.get(refKey(ref));
    if (!card) {
      throw new Error(`Scryfall missing card ${JSON.stringify(ref)}`);
    }
    return card;
  });
}

export async function getHeroShowcase() {
  const cards = await getCardsCollection([...HERO_FAN, HERO_FEATURED]);

  return {
    fan: cards.slice(0, -1),
    featured: cards[cards.length - 1],
  };
}

export function getFeaturedCards() {
  return getCardsCollection(FEATURED_CARDS);
}

function mapCardDetails(raw: ScryfallCardRaw): CardDetails {
  const base = mapCard(raw);
  const face = raw.card_faces?.[0];

  const oracleText =
    raw.oracle_text ??
    face?.oracle_text ??
    raw.card_faces?.map((f) => f.oracle_text).filter(Boolean).join("\n\n") ??
    "";

  const flavorText = raw.flavor_text ?? face?.flavor_text;

  return {
    ...base,
    imageUrl:
      raw.image_uris?.large ??
      raw.image_uris?.normal ??
      face?.image_uris?.normal ??
      base.imageUrl,
    oracleText,
    flavorText,
    setName: raw.set_name ?? raw.set.toUpperCase(),
    setCode: raw.set,
    collectorNumber: raw.collector_number,
    artist: raw.artist,
    power: raw.power ?? face?.power,
    toughness: raw.toughness ?? face?.toughness,
    loyalty: raw.loyalty,
    scryfallUri: raw.scryfall_uri ?? `https://scryfall.com/card/${raw.set}/${raw.collector_number}`,
  };
}

type ScryfallListResponse = {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCardRaw[];
};

export async function fetchCardSearchPage(options: {
  query?: string;
  nextPageUrl?: string;
}): Promise<CardSearchPage> {
  const url =
    options.nextPageUrl ??
    `${API}/cards/search?${new URLSearchParams({
      q: options.query?.trim() || "*",
      unique: "cards",
      order: "name",
    })}`;

  const response = await fetch(url, { headers: HEADERS });

  if (response.status === 404) {
    return {
      cards: [],
      totalCards: 0,
      hasMore: false,
      nextPage: null,
    };
  }

  if (!response.ok) {
    throw new Error(`Scryfall search error: ${response.status}`);
  }

  const body = (await response.json()) as ScryfallListResponse;
  const cards: Card[] = [];

  for (const raw of body.data) {
    try {
      cards.push(mapCard(raw));
    } catch {
      // Algumas entradas (tokens, etc.) podem não ter imagem.
    }
  }

  return {
    cards,
    totalCards: body.total_cards,
    hasMore: body.has_more,
    nextPage: body.has_more ? body.next_page ?? null : null,
  };
}

export async function fetchCardById(id: string): Promise<CardDetails> {
  const response = await fetch(`${API}/cards/${id}`, { headers: HEADERS });

  if (!response.ok) {
    throw new Error(`Scryfall card error: ${response.status}`);
  }

  const raw = (await response.json()) as ScryfallCardRaw;
  return mapCardDetails(raw);
}

/** Carta aleatória com imagem (Scryfall `/cards/random`). */
export async function fetchRandomCard(): Promise<Card> {
  const response = await fetch(`${API}/cards/random`, { headers: HEADERS });

  if (!response.ok) {
    throw new Error(`Scryfall random error: ${response.status}`);
  }

  const raw = (await response.json()) as ScryfallCardRaw;
  return mapCard(raw);
}
