import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ExploreView } from "@/components/ExploreView";

function ExploreFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-text-2">
      <Loader2 className="size-8 animate-spin" aria-label="Loading explore" />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<ExploreFallback />}>
        <ExploreView />
      </Suspense>
    </main>
  );
}
