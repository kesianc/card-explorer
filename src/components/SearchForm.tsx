"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const [value, setValue] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const term = value.trim();
    if (!term) return;

    router.push(`/explore?q=${encodeURIComponent(term)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-surface p-1.5"
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search cards, abilities, artists..."
        aria-label="Search cards"
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-text placeholder:text-text-3"
      />
            <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-semibold text-gold-ink transition-colors hover:bg-gold-bright cursor-pointer"
      >
        Search
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </form>
  );
}