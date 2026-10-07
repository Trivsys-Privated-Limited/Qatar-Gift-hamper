"use client";

import { HAMPER_CATEGORIES, type Hamper } from "@/config/business";
import { formatPrice, orderLink } from "@/lib/whatsapp";
import { HamperImage } from "./HamperImage";
import { ArrowRightIcon } from "./Icons";

export function categoryTag(hamper: Hamper): string {
  return HAMPER_CATEGORIES.find((c) => c.id === hamper.category)?.tag ?? "";
}

/** Product card. Clicking anywhere opens the details; the WhatsApp link orders directly. */
export function HamperCard({
  hamper,
  onOpen,
  className = "",
  style,
}: {
  hamper: Hamper;
  onOpen: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-ink/[0.07] bg-white shadow-soft transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-lift ${className}`}
      style={style}
    >
      <HamperImage
        hamper={hamper}
        aspect="aspect-[5/4]"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="kicker text-[0.64rem]">{categoryTag(hamper)}</p>
        <h3 className="mt-2 text-[1.65rem] leading-tight">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-maroon"
          >
            {hamper.name}
            <span className="sr-only">, view details</span>
          </button>
        </h3>
        <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-muted">{hamper.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink/10 pt-4">
          <p className="font-medium tracking-wide text-espresso">{formatPrice(hamper.price)}</p>
          <a
            href={orderLink(hamper)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-maroon/85 transition-colors hover:text-maroon group-hover:text-maroon"
            aria-label={`Order the ${hamper.name} on WhatsApp`}
          >
            Order on WhatsApp
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
  );
}
