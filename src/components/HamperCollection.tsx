"use client";

import { useState } from "react";
import { HAMPER_CATEGORIES, hampers, type Hamper, type HamperCategory } from "@/config/business";
import { HamperCard } from "./HamperCard";
import { HamperDetails } from "./HamperDetails";

const FILTERS = [{ id: "all", label: "All" }, ...HAMPER_CATEGORIES] as const;

/** Occasion filters, the hamper grid and the details modal. */
export function HamperCollection() {
  const [filter, setFilter] = useState<HamperCategory | "all">("all");
  const [selected, setSelected] = useState<Hamper | null>(null);
  const shown = filter === "all" ? hampers : hampers.filter((h) => h.category === filter);

  return (
    <>
      <div role="group" aria-label="Filter hampers by occasion" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length === 1 ? "1 hamper shown" : `${shown.length} hampers shown`}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {shown.map((h, i) => (
          <HamperCard
            // Re-keying on filter change replays the entrance animation.
            key={`${filter}-${h.id}`}
            hamper={h}
            onOpen={() => setSelected(h)}
            className="animate-card-in"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      <HamperDetails hamper={selected} onClose={() => setSelected(null)} />
    </>
  );
}
