"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

type SearchFormProps = {
  defaultValue?: string;
  className?: string;
  /** Chamado quando o campo fica vazio (apagar texto ou limpar busca). */
  onQueryClear?: () => void;
};

export function SearchForm({
  defaultValue = "",
  className,
  onQueryClear,
}: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const term = value.trim();
    if (!term) {
      onQueryClear?.();
      return;
    }

    router.push(`/explore?q=${encodeURIComponent(term)}`);
  }

  function handleChange(next: string) {
    setValue(next);
    if (onQueryClear && next.trim() === "") {
      onQueryClear();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-surface p-1.5 transition-colors focus-within:border-gold/60 ${className ?? "mt-9"}`}
    >
      <Search className="ml-3 size-5 shrink-0 text-text-3" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search cards, abilities, artists..."
        aria-label="Search cards"
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-text placeholder:text-text-3 focus:outline-none"
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