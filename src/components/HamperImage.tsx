import type { Hamper } from "@/config/business";
import { GiftIcon } from "./Icons";

/** The hamper photo, or a branded placeholder with a SAMPLE badge until a real photo is added. */
export function HamperImage({
  hamper,
  className = "",
  compact = false,
  aspect = "aspect-[4/3]",
}: {
  hamper: Hamper;
  className?: string;
  compact?: boolean;
  aspect?: string;
}) {
  if (hamper.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={hamper.image} alt={hamper.name} className={`${aspect} w-full object-cover ${className}`} loading="lazy" />
    );
  }

  const maroon = hamper.placeholder === "maroon";
  return (
    <div
      role="img"
      aria-label={`${hamper.name} (sample image)`}
      className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden ${
        maroon ? "bg-maroon" : "bg-[#EFE5D6]"
      } ${className}`}
    >
      {/* Subtle ribbon cross, like a wrapped box */}
      <span className={`absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 ${maroon ? "bg-gold/15" : "bg-gold/30"}`} />
      <span className={`absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 ${maroon ? "bg-gold/15" : "bg-gold/30"}`} />
      <GiftIcon className={`relative text-gold ${compact ? "h-10 w-10" : "h-16 w-16"} ${maroon ? "" : "drop-shadow-[0_1px_0_rgba(107,26,42,0.25)]"}`} />
      <span
        className={`absolute left-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-maroon-dark ${
          compact ? "text-[0.55rem]" : "text-[0.62rem]"
        }`}
      >
        Sample
      </span>
    </div>
  );
}
