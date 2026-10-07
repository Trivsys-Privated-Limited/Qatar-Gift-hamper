"use client";

import Image from "next/image";
import type { Hamper } from "@/config/business";
import { useImageFallback } from "@/lib/useImageFallback";
import { GiftIcon } from "./Icons";

/** The hamper photo, or a branded placeholder with a SAMPLE badge until a real photo is added. */
export function HamperImage({
  hamper,
  className = "",
  imgClassName = "",
  compact = false,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  hamper: Hamper;
  className?: string;
  /** Extra classes on the <img> itself, e.g. a hover zoom. */
  imgClassName?: string;
  compact?: boolean;
  aspect?: string;
  /** Rendered width hints so the browser downloads a suitably small file. */
  sizes?: string;
  priority?: boolean;
}) {
  const { ref, failed, onError } = useImageFallback(hamper.image);

  if (!failed && hamper.image) {
    return (
      <div className={`relative ${aspect} w-full overflow-hidden bg-sand ${className}`}>
        <Image
          ref={ref}
          src={hamper.image}
          alt={hamper.imageAlt ?? hamper.name}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
          onError={onError}
        />
      </div>
    );
  }

  const maroon = hamper.placeholder === "maroon";
  return (
    <div
      role="img"
      aria-label={`${hamper.name} (sample image)`}
      className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden ${
        maroon ? "bg-maroon" : "bg-sand"
      } ${className}`}
    >
      {/* Subtle ribbon cross, like a wrapped box */}
      <span className={`absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 ${maroon ? "bg-gold/15" : "bg-gold/30"}`} />
      <span className={`absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 ${maroon ? "bg-gold/15" : "bg-gold/30"}`} />
      <GiftIcon className={`relative text-gold ${compact ? "h-10 w-10" : "h-16 w-16"}`} />
      <span
        className={`absolute left-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-espresso ${
          compact ? "text-[0.55rem]" : "text-[0.62rem]"
        }`}
      >
        Sample
      </span>
    </div>
  );
}
