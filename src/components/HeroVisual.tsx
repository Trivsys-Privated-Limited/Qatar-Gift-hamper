"use client";

import Image from "next/image";
import { business } from "@/config/business";
import { useImageFallback } from "@/lib/useImageFallback";
import { GiftIcon } from "./Icons";

/** Hero photo beside the headline, or the wrapped-gift illustration until the photo is added. */
export function HeroVisual() {
  const { src, alt } = business.heroImage;
  const { ref, failed, onError } = useImageFallback(src);
  const frame = "relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:aspect-[5/4.4]";

  return (
    <div className="animate-fade-up relative [animation-delay:120ms]">
      {/* Thin offset gold frame behind the photo */}
      <span aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-lg border border-gold/60 sm:block" />
      {failed ? (
        <div aria-hidden="true" className={`${frame} bg-maroon`}>
          <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-gold/80" />
          <span className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-gold/80" />
          <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream">
            <GiftIcon className="h-14 w-14 text-maroon" />
          </div>
        </div>
      ) : (
        <div className={`${frame} bg-sand shadow-lift`}>
          <Image
            ref={ref}
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover object-[60%_50%]"
            onError={onError}
          />
        </div>
      )}
    </div>
  );
}
