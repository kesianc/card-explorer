import Image, { type ImageProps } from "next/image";

/**
 * Scryfall's CDN rejects requests without a User-Agent. Next's image optimizer
 * does not send one, so we load these URLs directly in the browser.
 */
export function ScryfallImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
