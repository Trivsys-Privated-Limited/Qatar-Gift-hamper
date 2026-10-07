"use client";

import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";

/**
 * The owner's logo from /public/logo.jpg. If the file is missing, a text wordmark
 * in the same style is shown instead so the layout never breaks.
 */
export function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // The error can fire before React hydrates, so check the image state too.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className={`inline-flex flex-col justify-center leading-none text-maroon ${className}`} aria-label={business.name}>
        <span className="font-heading text-[1.05rem] md:text-xl font-semibold tracking-wide">Qatar Surprise</span>
        <span className="mt-1 text-[0.6rem] md:text-[0.68rem] font-semibold uppercase tracking-[0.45em]">Hamper</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={business.logo} alt={business.name} className={`w-auto object-contain ${className}`} onError={() => setFailed(true)} />
  );
}
