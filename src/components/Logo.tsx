"use client";

import { business } from "@/config/business";
import { useImageFallback } from "@/lib/useImageFallback";

/**
 * The owner's logo (business.logo). Until a logo is set, or if the file is missing,
 * a text wordmark in the brand style is shown instead so the layout never breaks.
 */
export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { ref, failed, onError } = useImageFallback(business.logo ?? undefined);

  if (failed) {
    return (
      <span
        className={`inline-flex flex-col justify-center leading-none ${tone === "light" ? "text-cream" : "text-maroon"} ${className}`}
        aria-label={business.name}
      >
        <span className="font-heading text-[1.35rem] font-semibold tracking-[0.01em] md:text-[1.6rem]">Qatar Surprise</span>
        <span className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.5em] md:text-[0.62rem]">Hamper</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={business.logo ?? undefined} alt={business.name} className={`w-auto object-contain ${className}`} onError={onError} />
  );
}
