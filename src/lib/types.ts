export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  typeLine: string;
  manaCost: string;
  rarity: string;
}

export interface CardDetails extends Card {
  oracleText: string;
  flavorText?: string;
  setName: string;
  setCode: string;
  collectorNumber: string;
  artist?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  scryfallUri: string;
}

export interface CardSearchPage {
  cards: Card[];
  totalCards: number;
  hasMore: boolean;
  nextPage: string | null;
}
