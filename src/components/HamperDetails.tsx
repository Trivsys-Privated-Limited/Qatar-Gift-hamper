"use client";

import { useEffect, useRef } from "react";
import { business, type Hamper } from "@/config/business";
import { formatPrice, orderLink } from "@/lib/whatsapp";
import { categoryTag } from "./HamperCard";
import { HamperImage } from "./HamperImage";
import { CardIcon, CheckIcon, CloseIcon, DeliveryIcon, WhatsAppIcon } from "./Icons";

/** Product details in a modal. Closes with the X, Escape or a click on the backdrop. */
export function HamperDetails({ hamper, onClose }: { hamper: Hamper | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (hamper && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!hamper && dialog.open) {
      dialog.close();
    }
  }, [hamper]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        document.body.style.overflow = "";
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="hamper-details-title"
      className="modal m-auto max-h-[100dvh] w-full max-w-full bg-transparent p-0 sm:max-h-[92dvh] sm:w-[calc(100%-3rem)] sm:max-w-3xl"
    >
      {hamper && (
        <div className="relative flex max-h-[100dvh] flex-col overflow-y-auto bg-cream sm:max-h-[92dvh] sm:rounded-xl sm:shadow-2xl md:grid md:grid-cols-[1.05fr_1fr]">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 text-espresso shadow-soft backdrop-blur hover:bg-white"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <HamperImage
            hamper={hamper}
            className="shrink-0"
            aspect="aspect-[5/4] md:aspect-auto md:h-full md:min-h-[32rem]"
            sizes="(min-width: 768px) 400px, 100vw"
          />

          <div className="flex flex-col p-6 sm:p-8">
            <p className="kicker">{categoryTag(hamper)}</p>
            <h2 id="hamper-details-title" className="mt-2 text-[2.1rem] leading-tight">
              {hamper.name}
            </h2>
            <p className="mt-1 text-lg font-medium tracking-wide text-maroon">{formatPrice(hamper.price)}</p>
            <p className="mt-4 leading-relaxed text-muted">{hamper.description}</p>

            <h3 className="mt-6 font-sans text-[0.7rem] font-medium uppercase tracking-[0.24em] text-espresso">Includes</h3>
            <ul className="mt-3 space-y-2">
              {hamper.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.95rem] text-ink/85">
                  <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm text-ink/80">
              <p className="flex items-start gap-3">
                <DeliveryIcon className="h-5 w-5 shrink-0 text-maroon" />
                <span>
                  <strong className="font-medium text-espresso">Delivery.</strong> Same-day delivery available across{" "}
                  {business.city.split(",")[0]}.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <CardIcon className="h-5 w-5 shrink-0 text-maroon" />
                <span>
                  <strong className="font-medium text-espresso">Personalised card.</strong> Tell us your message and we&apos;ll
                  add it on a card inside the hamper.
                </span>
              </p>
            </div>

            <a
              href={orderLink(hamper)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-7 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Order this hamper on WhatsApp
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
