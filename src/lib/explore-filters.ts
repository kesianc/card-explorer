export type ManaColorCode = "W" | "U" | "B" | "R" | "G";

export type RarityCode = "common" | "uncommon" | "rare" | "mythic";

export type CardTypeCode =
  | "Creature"
  | "Instant"
  | "Sorcery"
  | "Artifact"
  | "Enchantment"
  | "Planeswalker"
  | "Land";

export interface ExploreFilters {
  colors: ManaColorCode[];
  rarities: RarityCode[];
  types: CardTypeCode[];
}

export const EMPTY_EXPLORE_FILTERS: ExploreFilters = {
  colors: [],
  rarities: [],
  types: [],
};

export const MANA_COLOR_OPTIONS: {
  id: ManaColorCode;
  label: string;
  borderColor: string;
  glowColor: string;
  iconColor: string;
}[] = [
  {
    id: "W",
    label: "White",
    borderColor: "#e4c88a",
    glowColor: "rgba(228,200,138,0.35)",
    iconColor: "#fef08a",
  },
  {
    id: "U",
    label: "Blue",
    borderColor: "#38bdf8",
    glowColor: "rgba(56,189,248,0.35)",
    iconColor: "#38bdf8",
  },
  {
    id: "B",
    label: "Black",
    borderColor: "#a855f7",
    glowColor: "rgba(168,85,247,0.35)",
    iconColor: "#c084fc",
  },
  {
    id: "R",
    label: "Red",
    borderColor: "#ef4444",
    glowColor: "rgba(239,68,68,0.35)",
    iconColor: "#f87171",
  },
  {
    id: "G",
    label: "Green",
    borderColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.35)",
    iconColor: "#4ade80",
  },
];

export const RARITY_OPTIONS: {
  id: RarityCode;
  label: string;
  dotColor: string;
}[] = [
  { id: "common", label: "Common", dotColor: "#9ca3af" },
  { id: "uncommon", label: "Uncommon", dotColor: "#e2e8f0" },
  { id: "rare", label: "Rare", dotColor: "#eab308" },
  { id: "mythic", label: "Mythic", dotColor: "#f97316" },
];

export const CARD_TYPE_OPTIONS: CardTypeCode[] = [
  "Creature",
  "Instant",
  "Sorcery",
  "Artifact",
  "Enchantment",
  "Planeswalker",
  "Land",
];

const COLOR_CODES = new Set<ManaColorCode>(["W", "U", "B", "R", "G"]);
const RARITY_CODES = new Set<RarityCode>(["common", "uncommon", "rare", "mythic"]);
const TYPE_CODES = new Set<CardTypeCode>(CARD_TYPE_OPTIONS);

function parseList<T extends string>(value: string | null, allowed: Set<T>): T[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part): part is T => allowed.has(part as T));
}

export function parseExploreFilters(params: URLSearchParams): ExploreFilters {
  return {
    colors: parseList(params.get("c")?.toUpperCase() ?? null, COLOR_CODES),
    rarities: parseList(params.get("r"), RARITY_CODES),
    types: parseList(params.get("t"), TYPE_CODES),
  };
}

export function hasActiveFilters(filters: ExploreFilters): boolean {
  return (
    filters.colors.length > 0 ||
    filters.rarities.length > 0 ||
    filters.types.length > 0
  );
}

export function setExploreFiltersOnParams(
  params: URLSearchParams,
  filters: ExploreFilters,
): void {
  if (filters.colors.length) {
    params.set("c", filters.colors.map((c) => c.toLowerCase()).join(","));
  } else {
    params.delete("c");
  }

  if (filters.rarities.length) {
    params.set("r", filters.rarities.join(","));
  } else {
    params.delete("r");
  }

  if (filters.types.length) {
    params.set("t", filters.types.join(","));
  } else {
    params.delete("t");
  }
}

function orClause(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `(${parts.join(" or ")})`;
}

export function buildScryfallQuery(textQuery: string, filters: ExploreFilters): string {
  const parts: string[] = [];
  const text = textQuery.trim();

  parts.push(text || "*");

  if (filters.colors.length) {
    parts.push(orClause(filters.colors.map((c) => `c:${c.toLowerCase()}`)));
  }

  if (filters.rarities.length) {
    parts.push(orClause(filters.rarities.map((r) => `r:${r}`)));
  }

  if (filters.types.length) {
    parts.push(orClause(filters.types.map((t) => `t:${t.toLowerCase()}`)));
  }

  return parts.join(" ");
}
