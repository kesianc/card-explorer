import { ScryfallImage } from "./ScryfallImage";

/** Transforma "{2}{R}{R}" em bolinhas de mana (ícones oficiais do Scryfall). */
export function ManaCost({ cost }: { cost: string }) {
  const symbols = [...cost.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);

  if (symbols.length === 0) return null;

  return (
    <span
      role="img"
      aria-label={`Mana cost ${symbols.join(" ")}`}
      className="inline-flex items-center gap-1"
    >
      {symbols.map((symbol, index) => (
        <ScryfallImage
          key={index}
          src={`https://svgs.scryfall.io/card-symbols/${symbol.replace("/", "")}.svg`}
          alt=""
          width={18}
          height={18}
          className="size-[18px]"
        />
      ))}
    </span>
  );
}
