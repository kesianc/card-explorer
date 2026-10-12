import { FeaturedCards } from "@/components/FeaturedCards";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-w-0">
      <Hero />
      <FeaturedCards />
    </main>
  );
}
