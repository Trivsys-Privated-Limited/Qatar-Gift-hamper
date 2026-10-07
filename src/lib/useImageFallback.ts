"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an <img> failed to load, so a missing photo can fall back to a placeholder.
 * Usage: `<img ref={ref} onError={onError} />`, then render the fallback when `failed` is true.
 */
export function useImageFallback(src: string | undefined) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
    // The error can fire before React hydrates, so check the image state too.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  return { ref, failed: !src || failed, onError: () => setFailed(true) };
}
